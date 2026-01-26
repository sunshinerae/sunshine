#!/bin/bash
# =============================================================================
# Ralph Wiggum Loop v2 — Sophisticated Edition
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOOP_DIR="$SCRIPT_DIR/.loop"

# Source libraries
for lib in "$LOOP_DIR/lib/"*.sh; do source "$lib"; done

# Config
YOLO_MODE=false DRY_RUN=false INTERACTIVE=false BUILD_CHECK=true
MAX_ITERATIONS=100 MAX_RETRIES=3 CLAUDE_TIMEOUT=600 SLEEP_SECONDS=3
PLAN_FILE="implementation_plan.md" PROMPT_FILE="prompt.md"
LOCK_FILE="$LOOP_DIR/lock.pid" TEMP_FILES=()

show_help() {
    cat <<'EOF'
Ralph Wiggum Loop v2 — The Sunshine Effect

Usage: ./loop.sh [options]

Options:
  --yolo          Enable --dangerously-skip-permissions mode
  --dry-run       Show what would happen without changes
  --interactive   Pause after each task
  --no-build      Skip build check
  --max=N         Max iterations (default: 100)
  --help          Show this help

Examples:
  ./loop.sh --yolo          # Fully automatic (isolated VM only!)
  ./loop.sh --dry-run       # Preview mode
  ./loop.sh --interactive   # Step through
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --yolo) YOLO_MODE=true ;;
            --dry-run) DRY_RUN=true ;;
            --interactive|-i) INTERACTIVE=true ;;
            --no-build) BUILD_CHECK=false ;;
            --max=*) MAX_ITERATIONS="${1#*=}" ;;
            --help|-h) show_help; exit 0 ;;
            *) echo "Unknown: $1" >&2; exit 1 ;;
        esac
        shift
    done
}

lock_acquire() {
    [[ -f "$LOCK_FILE" ]] && {
        local pid=$(cat "$LOCK_FILE" 2>/dev/null)
        kill -0 "$pid" 2>/dev/null && { echo "ERROR: Running (PID $pid)" >&2; return 1; }
        rm -f "$LOCK_FILE"
    }
    echo $$ > "$LOCK_FILE"
}

lock_release() {
    [[ -f "$LOCK_FILE" && "$(cat "$LOCK_FILE" 2>/dev/null)" == "$$" ]] && rm -f "$LOCK_FILE"
}

cleanup() {
    log_message "INFO" "Cleaning up..."
    lock_release
    for f in "${TEMP_FILES[@]}"; do rm -f "$f" 2>/dev/null; done
    exit "${1:-0}"
}

preflight() {
    log_divider
    log_human "  Pre-flight Checks"
    log_divider

    local ok=true
    platform_check_deps && status_ok "Dependencies" || { status_fail "Missing deps"; ok=false; }
    git rev-parse --git-dir &>/dev/null && status_ok "Git repo" || { status_fail "Not a git repo"; ok=false; }
    git_is_clean && status_ok "Clean worktree" || status_warn "Uncommitted changes"
    [[ -f "$PLAN_FILE" ]] && status_ok "Plan: $PLAN_FILE" || { status_fail "No $PLAN_FILE"; ok=false; }
    [[ -f "$PROMPT_FILE" ]] && status_ok "Prompt: $PROMPT_FILE" || { status_fail "No $PROMPT_FILE"; ok=false; }
    [[ -d "node_modules" ]] && status_ok "node_modules" || status_warn "Missing node_modules"
    [[ "$YOLO_MODE" == "true" ]] && status_warn "YOLO: ON" || status_ok "YOLO: OFF"
    [[ "$DRY_RUN" == "true" ]] && status_info "DRY-RUN mode"
    log_human ""

    [[ "$ok" == true ]]
}

run_build() {
    [[ "$BUILD_CHECK" != "true" ]] && return 0
    [[ "$DRY_RUN" == "true" ]] && { log_human "  [DRY-RUN] Would build"; return 0; }
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

    # Check if task marked complete
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
    log_init "logs" "$(state_session_id)"
    memory_init "$LOOP_DIR/memory.json"

    lock_acquire || exit 1
    trap 'cleanup $?' SIGINT SIGTERM EXIT

    log_box "Ralph Wiggum Loop v2"
    log_human "  Log: $LOG_FILE"
    log_human "  State: $STATE_FILE"
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
