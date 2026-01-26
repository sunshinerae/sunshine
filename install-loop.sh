#!/bin/bash
# =============================================================================
# Ralph Wiggum Loop — Global Installer
# =============================================================================
# Installs ralph-loop globally so you can run it from any project
#
# Usage:
#   ./install-loop.sh           # Install to ~/.local (user install)
#   sudo ./install-loop.sh      # Install to /usr/local (system-wide)
# =============================================================================

set -euo pipefail

# Detect install location
if [[ $EUID -eq 0 ]]; then
    PREFIX="/usr/local"
    echo "Installing system-wide to $PREFIX..."
else
    PREFIX="$HOME/.local"
    echo "Installing for current user to $PREFIX..."
fi

LIB_DIR="$PREFIX/share/ralph-loop"
BIN_DIR="$PREFIX/bin"

# Source directory (where this script lives)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create directories
mkdir -p "$LIB_DIR/lib"
mkdir -p "$BIN_DIR"

# Copy libraries
echo "Copying libraries..."
cp -r "$SCRIPT_DIR/.loop/lib/"*.sh "$LIB_DIR/lib/"

# Copy default config
if [[ -f "$SCRIPT_DIR/.loop/config.yaml" ]]; then
    cp "$SCRIPT_DIR/.loop/config.yaml" "$LIB_DIR/config.yaml.default"
fi

# Create the global wrapper script
echo "Creating ralph-loop command..."
cat > "$BIN_DIR/ralph-loop" << 'WRAPPER'
#!/bin/bash
# =============================================================================
# Ralph Wiggum Loop v2 — Global Wrapper
# =============================================================================
# Run from any project directory. Uses project-local files:
#   - implementation_plan.md (required)
#   - prompt.md (required)
#   - .loop/ directory for state (created automatically)
# =============================================================================

set -euo pipefail

# Find library location
if [[ -d "$HOME/.local/share/ralph-loop/lib" ]]; then
    RALPH_LIB="$HOME/.local/share/ralph-loop/lib"
elif [[ -d "/usr/local/share/ralph-loop/lib" ]]; then
    RALPH_LIB="/usr/local/share/ralph-loop/lib"
else
    echo "Error: ralph-loop libraries not found. Reinstall with install-loop.sh" >&2
    exit 1
fi

# Working directory is where user runs the command
WORK_DIR="$(pwd)"
LOOP_DIR="$WORK_DIR/.loop"

# Create .loop directory if needed
mkdir -p "$LOOP_DIR/lib"

# Source libraries from global install
for lib in "$RALPH_LIB"/*.sh; do source "$lib"; done

# Config
YOLO_MODE=false DRY_RUN=false INTERACTIVE=false BUILD_CHECK=true
MAX_ITERATIONS=100 MAX_RETRIES=3 CLAUDE_TIMEOUT=600 SLEEP_SECONDS=3
PLAN_FILE="implementation_plan.md" PROMPT_FILE="prompt.md"
LOCK_FILE="$LOOP_DIR/lock.pid" TEMP_FILES=()

show_help() {
    cat <<'EOF'
Ralph Wiggum Loop v2 — The Sunshine Effect

Usage: ralph-loop [options]

Run from any project directory containing:
  - implementation_plan.md   # Your task list with [ ] checkboxes
  - prompt.md                # Instructions for Claude

Options:
  --yolo          Enable --dangerously-skip-permissions mode
  --dry-run       Show what would happen without changes
  --interactive   Pause after each task
  --no-build      Skip build check
  --max=N         Max iterations (default: 100)
  --init          Create template files in current directory
  --help          Show this help

Examples:
  ralph-loop --init         # Set up a new project
  ralph-loop --dry-run      # Preview what would happen
  ralph-loop --yolo         # Fully automatic (isolated VM only!)
  ralph-loop --interactive  # Step through tasks
EOF
}

init_project() {
    echo "Initializing ralph-loop in $(pwd)..."

    if [[ ! -f "implementation_plan.md" ]]; then
        cat > implementation_plan.md << 'PLAN'
# Implementation Plan

## Tasks

- [ ] First task to complete
- [ ] Second task to complete
- [ ] Third task to complete
PLAN
        echo "  Created implementation_plan.md"
    else
        echo "  implementation_plan.md already exists"
    fi

    if [[ ! -f "prompt.md" ]]; then
        cat > prompt.md << 'PROMPT'
# Claude Instructions

You are working on this project. Complete the task provided.

## Rules

1. Complete ONLY the specific task given
2. Mark the task as done with [x] when complete
3. Commit your changes with a descriptive message
4. Do not modify other tasks or unrelated code

## Context

[Add project-specific context here]
PROMPT
        echo "  Created prompt.md"
    else
        echo "  prompt.md already exists"
    fi

    mkdir -p .loop
    echo "  Created .loop/ directory"

    echo ""
    echo "Ready! Edit the files and run: ralph-loop --dry-run"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --yolo) YOLO_MODE=true ;;
            --dry-run) DRY_RUN=true ;;
            --interactive|-i) INTERACTIVE=true ;;
            --no-build) BUILD_CHECK=false ;;
            --max=*) MAX_ITERATIONS="${1#*=}" ;;
            --init) init_project; exit 0 ;;
            --help|-h) show_help; exit 0 ;;
            *) echo "Unknown: $1" >&2; exit 1 ;;
        esac
        shift
    done
}

cleanup() {
    local code="${1:-0}"
    for f in "${TEMP_FILES[@]:-}"; do [[ -f "$f" ]] && rm -f "$f"; done
    lock_release 2>/dev/null || true
    exit "$code"
}

progress_bar() {
    local done="$1" total="$2" width=20
    local filled=$((done * width / total))
    local empty=$((width - filled))
    printf "[%s%s] %d/%d" "$(printf '█%.0s' $(seq 1 $filled 2>/dev/null) || true)" \
           "$(printf '░%.0s' $(seq 1 $empty 2>/dev/null) || true)" "$done" "$total"
}

preflight() {
    log_human "  Pre-flight checks..."
    local ok=true
    platform_check_deps && status_ok "Dependencies" || { status_fail "Missing deps"; ok=false; }
    git rev-parse --git-dir &>/dev/null && status_ok "Git repo" || { status_fail "Not a git repo"; ok=false; }
    git_is_clean && status_ok "Clean worktree" || status_warn "Uncommitted changes"
    [[ -f "$PLAN_FILE" ]] && status_ok "Plan: $PLAN_FILE" || { status_fail "No $PLAN_FILE (run --init)"; ok=false; }
    [[ -f "$PROMPT_FILE" ]] && status_ok "Prompt: $PROMPT_FILE" || { status_fail "No $PROMPT_FILE (run --init)"; ok=false; }
    [[ "$YOLO_MODE" == "true" ]] && status_warn "YOLO: ON" || status_ok "YOLO: OFF"
    [[ "$DRY_RUN" == "true" ]] && status_info "DRY-RUN mode"
    log_human ""

    [[ "$ok" == true ]]
}

run_build() {
    [[ "$BUILD_CHECK" != "true" ]] && return 0
    [[ "$DRY_RUN" == "true" ]] && { log_human "  [DRY-RUN] Would build"; return 0; }

    # Only run if package.json exists
    if [[ ! -f "package.json" ]]; then
        return 0
    fi

    log_human "  Building..."
    npm run build &>/dev/null && status_ok "Build passed" || { status_fail "Build failed"; return 1; }
}

execute_task() {
    local line="$1" task="$2"
    local checkpoint=""

    if [[ "$DRY_RUN" != "true" ]]; then
        checkpoint=$(git_checkpoint_create "$(state_get_field iteration)" "$task")
        state_set_task "$line" "$task" "$checkpoint"
    else
        log_human "  [DRY-RUN] Would create checkpoint"
    fi

    local prompt=$(claude_build_prompt "$PROMPT_FILE" "$task")

    if [[ "$DRY_RUN" == "true" ]]; then
        log_human "  [DRY-RUN] Would run Claude:"
        log_human "    Task: $task"
        return 0
    fi

    local commits_before=$(git_commit_count)
    log_human "  Running Claude..."

    local outfile=$(mktemp)
    TEMP_FILES+=("$outfile")

    local code=0
    claude_run "$prompt" "$CLAUDE_TIMEOUT" "$YOLO_MODE" "$outfile" || code=$?

    if [[ $code -eq 124 ]]; then
        log_message "ERROR" "Claude timed out"
        [[ -n "$checkpoint" ]] && git_checkpoint_rollback "$checkpoint"
        return 1
    fi

    [[ $code -ne 0 ]] && { log_message "ERROR" "Claude exit $code"; return 1; }

    log_human ""
    git_verify_commit "$commits_before" && status_ok "Commit: $(git_last_commit)" || status_warn "No commit"

    local status=$(tasks_parse "$PLAN_FILE" | awk -F'\t' -v ln="$line" '$1==ln {print $2}')
    [[ "$status" == "done" ]] && { status_ok "Task complete"; return 0; }
    status_warn "Task not marked complete"
    return 1
}

interactive_prompt() {
    [[ "$INTERACTIVE" != "true" ]] && return 0
    log_human "  Press Enter to continue, s=skip, q=quit"
    local input; read -r input
    case "$input" in
        q|Q) log_human "Quitting"; exit 0 ;;
        s|S) return 1 ;;
    esac
    return 0
}

format_time() {
    local s="$1"
    ((s < 60)) && echo "${s}s" && return
    ((s < 3600)) && echo "$((s/60))m $((s%60))s" && return
    echo "$((s/3600))h $((s%3600/60))m"
}

main() {
    local start=$(date +%s)
    parse_args "$@"
    colors_init
    state_init "$LOOP_DIR"
    log_init "$WORK_DIR/logs" "$(state_session_id)"
    memory_init "$LOOP_DIR/memory.json"

    lock_acquire || exit 1
    trap 'cleanup $?' SIGINT SIGTERM EXIT

    log_box "Ralph Wiggum Loop v2"
    log_human "  Project: $WORK_DIR"
    log_human "  Log: $LOG_FILE"
    log_human ""

    state_is_recovery && log_human "  Recovering from previous session..."

    preflight || { log_message "ERROR" "Preflight failed"; exit 1; }

    state_transition "IDLE"

    local total=$(tasks_count "$PLAN_FILE")
    local done=$(tasks_done_count "$PLAN_FILE")
    state_update_stats "total_tasks" "$total"

    log_human "  Starting: $done/$total complete"
    log_human ""

    local iter=0 retry=0 curr_line=""

    while ((iter < MAX_ITERATIONS)); do
        iter=$((iter + 1))
        state_set "iteration" "$iter"

        done=$(tasks_done_count "$PLAN_FILE")
        local pending=$(tasks_pending_count "$PLAN_FILE")
        total=$((done + pending))

        if ((pending == 0)); then
            local elapsed=$(($(date +%s) - start))
            log_box "All tasks complete!"
            log_human "  $done/$total done in $(format_time $elapsed)"
            exit 0
        fi

        local next=$(tasks_get_next "$PLAN_FILE")
        [[ -z "$next" ]] && { log_message "ERROR" "No task found"; break; }

        local line=$(echo "$next" | cut -f1)
        local task=$(echo "$next" | cut -f2)

        if [[ "$line" == "$curr_line" ]]; then
            retry=$((retry + 1))
            if ((retry >= MAX_RETRIES)); then
                log_message "WARN" "Skipping after $MAX_RETRIES failures"
                [[ "$DRY_RUN" != "true" ]] && {
                    tasks_mark_skipped "$line" "$PLAN_FILE" "failed $MAX_RETRIES times"
                    git add "$PLAN_FILE" && git_commit_safe "skip: $(tasks_sanitize_for_git "$task")"
                }
                state_increment_stat "tasks_skipped"
                retry=0 curr_line=""
                continue
            fi
            log_human "  Retry $retry/$MAX_RETRIES"
        else
            curr_line="$line" retry=0
        fi

        log_divider
        log_human "  Iteration $iter | $(progress_bar "$done" "$total")"
        log_human "  $done done | $pending remaining"
        log_divider
        log_human ""
        log_human "  Next: $task"
        log_human ""

        if execute_task "$line" "$task"; then
            state_clear_task
            retry=0 curr_line=""
            memory_add_success "$task" "$(git_last_hash)" "0"
            state_increment_stat "tasks_completed"
        fi

        run_build || log_human "  Build failed, will retry"

        local iter_time=$(($(date +%s) - start))
        log_human "  Time: $(format_time $iter_time)"
        log_human ""

        if ! interactive_prompt; then
            [[ "$DRY_RUN" != "true" ]] && {
                tasks_mark_skipped "$line" "$PLAN_FILE" "manual"
                git add "$PLAN_FILE" && git_commit_safe "skip: $(tasks_sanitize_for_git "$task")"
            }
            state_increment_stat "tasks_skipped"
            retry=0 curr_line=""
        fi

        sleep "$SLEEP_SECONDS"
    done

    log_human "Max iterations reached"
}

main "$@"
WRAPPER

chmod +x "$BIN_DIR/ralph-loop"

echo ""
echo "Installation complete!"
echo ""

# Check if bin is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo "Add this to your ~/.bashrc or ~/.zshrc:"
    echo ""
    echo "  export PATH=\"$BIN_DIR:\$PATH\""
    echo ""
    echo "Then run: source ~/.bashrc  (or restart your terminal)"
else
    echo "Run 'ralph-loop --help' to get started"
fi

echo ""
echo "Usage in any project:"
echo "  cd /path/to/project"
echo "  ralph-loop --init      # Create template files"
echo "  ralph-loop --dry-run   # Preview what would happen"
echo "  ralph-loop --yolo      # Run automatically"
