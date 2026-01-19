#!/bin/bash

# ===========================================
# Ralph Wiggum Loop — Full Featured Edition
# The Sunshine Effect
# ===========================================

set -e

# --- Configuration ---
MAX_ITERATIONS=100
SLEEP_SECONDS=3
MAX_RETRIES=2
LOG_DIR="logs"
BUILD_CHECK=true
INTERACTIVE=false

# --- Parse flags ---
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --interactive|-i) INTERACTIVE=true ;;
        --no-build) BUILD_CHECK=false ;;
        --max=*) MAX_ITERATIONS="${1#*=}" ;;
        --help|-h)
            echo "Usage: ./loop.sh [options]"
            echo ""
            echo "Options:"
            echo "  --interactive, -i   Pause after each task for review"
            echo "  --no-build          Skip build check after each task"
            echo "  --max=N             Set max iterations (default: 100)"
            echo "  --help, -h          Show this help"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# --- Logging ---
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/loop-$(date +%Y-%m-%d-%H%M%S).log"
FAILED_TASKS_FILE="$LOG_DIR/failed-tasks.log"

log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log_raw() {
    echo "$1" >> "$LOG_FILE"
}

# --- Helper Functions ---
get_done_count() {
    grep -c '^\- \[x\]' implementation_plan.md 2>/dev/null || echo 0
}

get_todo_count() {
    grep -c '^\- \[ \]' implementation_plan.md 2>/dev/null || echo 0
}

get_next_task() {
    grep -m1 '^\- \[ \]' implementation_plan.md | sed 's/^- \[ \] //'
}

get_last_commit() {
    git log --oneline -1 2>/dev/null || echo "none"
}

get_commit_count() {
    git rev-list --count HEAD 2>/dev/null || echo 0
}

format_time() {
    local seconds=$1
    if [ "$seconds" -lt 60 ]; then
        echo "${seconds}s"
    elif [ "$seconds" -lt 3600 ]; then
        echo "$((seconds / 60))m $((seconds % 60))s"
    else
        echo "$((seconds / 3600))h $((seconds % 3600 / 60))m"
    fi
}

# --- Pre-flight Checks ---
preflight() {
    log ""
    log "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log "${WHITE}  Pre-flight Checks${NC}"
    log "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local checks_passed=true

    # Check git
    if git rev-parse --git-dir > /dev/null 2>&1; then
        log "  ${GREEN}✓${NC} Git repository detected"
    else
        log "  ${RED}✗${NC} Not a git repository"
        checks_passed=false
    fi

    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        log "  ${GREEN}✓${NC} Working directory clean"
    else
        log "  ${YELLOW}!${NC} Uncommitted changes detected"
        log "    ${YELLOW}Files:${NC}"
        git status --porcelain | head -5 | sed 's/^/      /'
        if [ $(git status --porcelain | wc -l) -gt 5 ]; then
            log "      ... and more"
        fi
    fi

    # Check implementation_plan.md exists
    if [ -f "implementation_plan.md" ]; then
        log "  ${GREEN}✓${NC} implementation_plan.md found"
    else
        log "  ${RED}✗${NC} implementation_plan.md not found"
        checks_passed=false
    fi

    # Check prompt.md exists
    if [ -f "prompt.md" ]; then
        log "  ${GREEN}✓${NC} prompt.md found"
    else
        log "  ${RED}✗${NC} prompt.md not found"
        checks_passed=false
    fi

    # Check node_modules
    if [ -d "node_modules" ]; then
        log "  ${GREEN}✓${NC} node_modules present"
    else
        log "  ${YELLOW}!${NC} node_modules missing — run npm install first"
    fi

    # Check Claude CLI
    if command -v claude &> /dev/null; then
        log "  ${GREEN}✓${NC} Claude CLI available"
    else
        log "  ${RED}✗${NC} Claude CLI not found"
        checks_passed=false
    fi

    if [ "$checks_passed" = false ]; then
        log ""
        log "${RED}Pre-flight checks failed. Aborting.${NC}"
        exit 1
    fi

    log ""
}

# --- Build Check ---
run_build_check() {
    if [ "$BUILD_CHECK" = true ]; then
        log "  ${CYAN}Running build check...${NC}"
        if npm run build > /dev/null 2>&1; then
            log "  ${GREEN}✓${NC} Build passed"
            return 0
        else
            log "  ${RED}✗${NC} Build failed"
            return 1
        fi
    fi
    return 0
}

# --- Main Loop ---
main() {
    local start_time=$(date +%s)
    local task_times=()
    local retry_count=0
    local current_task=""

    # Header
    log ""
    log "${PURPLE}╔═══════════════════════════════════════════╗${NC}"
    log "${PURPLE}║${NC}   ${WHITE}Ralph Wiggum Loop${NC}                       ${PURPLE}║${NC}"
    log "${PURPLE}║${NC}   ${CYAN}The Sunshine Effect${NC}                     ${PURPLE}║${NC}"
    log "${PURPLE}╚═══════════════════════════════════════════╝${NC}"
    log ""
    log "  Log file: ${CYAN}$LOG_FILE${NC}"
    log "  Interactive mode: ${CYAN}$INTERACTIVE${NC}"
    log "  Build checks: ${CYAN}$BUILD_CHECK${NC}"

    # Pre-flight
    preflight

    # Initial counts
    local initial_done=$(get_done_count)
    log "  Starting with ${GREEN}$initial_done${NC} tasks already complete"
    log ""

    # Main loop
    for ((i=1; i<=MAX_ITERATIONS; i++)); do
        local iteration_start=$(date +%s)

        # Get counts
        local done_count=$(get_done_count)
        local todo_count=$(get_todo_count)
        local total=$((done_count + todo_count))
        local percent=$((done_count * 100 / total))

        # Exit if no tasks remaining
        if [ "$todo_count" -eq 0 ]; then
            local end_time=$(date +%s)
            local total_time=$((end_time - start_time))
            log ""
            log "${GREEN}╔═══════════════════════════════════════════╗${NC}"
            log "${GREEN}║${NC}   ${WHITE}All tasks complete!${NC}                     ${GREEN}║${NC}"
            log "${GREEN}║${NC}   ${CYAN}$done_count/$total tasks done${NC}                      ${GREEN}║${NC}"
            log "${GREEN}║${NC}   ${CYAN}Total time: $(format_time $total_time)${NC}                   ${GREEN}║${NC}"
            log "${GREEN}╚═══════════════════════════════════════════╝${NC}"
            exit 0
        fi

        # Get next task
        local next_task=$(get_next_task)

        # Check if this is a retry
        if [ "$next_task" = "$current_task" ]; then
            ((retry_count++))
            if [ "$retry_count" -ge "$MAX_RETRIES" ]; then
                log "  ${RED}Task failed $MAX_RETRIES times. Skipping.${NC}"
                echo "$(date): SKIPPED - $next_task" >> "$FAILED_TASKS_FILE"
                # Mark as done with skip note (so loop continues)
                sed -i "0,/^\- \[ \] $(echo "$next_task" | sed 's/[\/&]/\\&/g')/s//- [x] [SKIPPED] $next_task/" implementation_plan.md
                git add implementation_plan.md
                git commit -m "skip: $next_task (failed $MAX_RETRIES times)" || true
                retry_count=0
                continue
            fi
            log "  ${YELLOW}Retry $retry_count/$MAX_RETRIES${NC}"
        else
            current_task="$next_task"
            retry_count=0
        fi

        # Progress bar
        local bar_width=30
        local filled=$((percent * bar_width / 100))
        local empty=$((bar_width - filled))
        local bar=$(printf "%${filled}s" | tr ' ' '█')$(printf "%${empty}s" | tr ' ' '░')

        # Show status
        log "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        log "  ${WHITE}Iteration $i${NC} │ ${bar} ${percent}%"
        log "  ${GREEN}$done_count done${NC} │ ${YELLOW}$todo_count remaining${NC}"
        log "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        log ""
        log "  ${WHITE}Next task:${NC}"
        log "  ${YELLOW}→ $next_task${NC}"
        log ""

        # Get commit count before
        local commits_before=$(get_commit_count)
        local last_commit_before=$(get_last_commit)

        # Build the prompt with recent context
        local context_prompt="$(cat prompt.md)

---
CONTEXT: Last commit was: $last_commit_before
CURRENT TASK: $next_task
---"

        # Run Claude
        log "  ${CYAN}Running Claude...${NC}"
        log_raw "--- Claude Output Start ---"

        if claude --print "$context_prompt" 2>&1 | tee -a "$LOG_FILE"; then
            log_raw "--- Claude Output End ---"
        else
            log "  ${RED}Claude exited with error${NC}"
        fi

        log ""

        # Verify commit happened
        local commits_after=$(get_commit_count)
        local last_commit_after=$(get_last_commit)

        if [ "$commits_after" -gt "$commits_before" ]; then
            log "  ${GREEN}✓${NC} Commit detected: ${CYAN}$last_commit_after${NC}"
        else
            log "  ${YELLOW}!${NC} No new commit detected"
        fi

        # Verify task was marked complete
        local new_done_count=$(get_done_count)
        if [ "$new_done_count" -gt "$done_count" ]; then
            log "  ${GREEN}✓${NC} Task marked complete"
        else
            log "  ${YELLOW}!${NC} Task not marked complete — will retry"
        fi

        # Build check
        if ! run_build_check; then
            log "  ${YELLOW}Build failed — agent should fix on next iteration${NC}"
        fi

        # Time tracking
        local iteration_end=$(date +%s)
        local iteration_time=$((iteration_end - iteration_start))
        task_times+=($iteration_time)

        # Calculate average and estimate
        local total_task_time=0
        for t in "${task_times[@]}"; do
            total_task_time=$((total_task_time + t))
        done
        local avg_time=$((total_task_time / ${#task_times[@]}))
        local remaining_time=$((avg_time * (todo_count - 1)))

        log ""
        log "  ${CYAN}Task time:${NC} $(format_time $iteration_time) │ ${CYAN}Avg:${NC} $(format_time $avg_time) │ ${CYAN}Est. remaining:${NC} $(format_time $remaining_time)"
        log ""

        # Show recent commits
        log "  ${WHITE}Recent commits:${NC}"
        git log --oneline -3 2>/dev/null | while read line; do
            log "    ${CYAN}$line${NC}"
        done
        log ""

        # Interactive mode
        if [ "$INTERACTIVE" = true ]; then
            log "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            log "  ${WHITE}Interactive mode${NC}"
            log "  Press ${GREEN}Enter${NC} to continue, ${YELLOW}s${NC} to skip task, ${RED}q${NC} to quit"
            log "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            read -r input
            case $input in
                q|Q)
                    log "  ${YELLOW}Quitting...${NC}"
                    exit 0
                    ;;
                s|S)
                    log "  ${YELLOW}Skipping task...${NC}"
                    echo "$(date): MANUAL SKIP - $next_task" >> "$FAILED_TASKS_FILE"
                    sed -i "0,/^\- \[ \] $(echo "$next_task" | sed 's/[\/&]/\\&/g')/s//- [x] [SKIPPED] $next_task/" implementation_plan.md
                    git add implementation_plan.md
                    git commit -m "skip: $next_task (manual skip)" || true
                    ;;
            esac
        fi

        # Sleep
        sleep $SLEEP_SECONDS
    done

    log ""
    log "${YELLOW}Max iterations ($MAX_ITERATIONS) reached${NC}"
    log "Run again to continue."
}

# --- Run ---
main
