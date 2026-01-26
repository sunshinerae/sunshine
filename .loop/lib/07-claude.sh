#!/bin/bash
# =============================================================================
# claude.sh - Claude invocation with timeout and proper exit code handling
# =============================================================================

MEMORY_FILE="" CLAUDE_OUTPUT_FILE=""

memory_init() {
    MEMORY_FILE="${1:-.loop/memory.json}"
    [[ -f "$MEMORY_FILE" ]] || jq -n '{version: 1, entries: [], context: {project_type: "", common_patterns: [], known_issues: []}}' > "$MEMORY_FILE"
}

memory_add_success() {
    local task="$1" hash="${2:-}" dur="${3:-0}"
    [[ -f "$MEMORY_FILE" ]] || return
    jq --arg ts "$(get_timestamp)" --arg task "$task" --arg hash "$hash" --argjson dur "$dur" \
        '.entries += [{timestamp: $ts, type: "success", task: $task, commit_hash: $hash, duration_seconds: $dur}] | .entries = .entries[-50:]' \
        "$MEMORY_FILE" > "${MEMORY_FILE}.tmp" && mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"
}

memory_add_failure() {
    local task="$1" error="$2" retry="${3:-0}"
    [[ -f "$MEMORY_FILE" ]] || return
    jq --arg ts "$(get_timestamp)" --arg task "$task" --arg error "$error" --argjson retry "$retry" \
        '.entries += [{timestamp: $ts, type: "failure", task: $task, error: $error, retry_count: $retry}] | .entries = .entries[-50:]' \
        "$MEMORY_FILE" > "${MEMORY_FILE}.tmp" && mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"
}

memory_build_context() {
    [[ -f "$MEMORY_FILE" ]] || return
    local succ=$(jq -r '.entries | map(select(.type == "success")) | .[-3:] | .[] | "- Completed: \(.task)"' "$MEMORY_FILE" 2>/dev/null)
    local fail=$(jq -r '.entries | map(select(.type == "failure")) | .[-3:] | .[] | "- Failed: \(.task) (\(.error))"' "$MEMORY_FILE" 2>/dev/null)
    [[ -n "$succ" || -n "$fail" ]] && cat <<EOF

---
CONTEXT FROM PREVIOUS RUNS:
Recent successes:
$succ

Recent failures (avoid these mistakes):
$fail
---
EOF
}

claude_build_prompt() {
    local prompt_file="$1" task="$2"
    local base=$(cat "$prompt_file")
    local mem=$(memory_build_context)
    local last=$(git_last_commit)
    cat <<EOF
$base
$mem

---
CURRENT STATE:
Last commit: $last
CURRENT TASK: $task
---
EOF
}

claude_run() {
    local prompt="$1" timeout="${2:-600}" yolo="${3:-false}" out="${4:-$(mktemp)}"
    local flags="--print"
    [[ "$yolo" == "true" ]] && flags="--dangerously-skip-permissions --print"
    local pfile=$(mktemp)
    printf '%s' "$prompt" > "$pfile"
    local ec=0
    set +e
    if [[ -n "$TIMEOUT_CMD" ]]; then
        $TIMEOUT_CMD "${timeout}s" claude $flags "$(cat "$pfile")" > "$out" 2>&1
        ec=$?
    else
        claude $flags "$(cat "$pfile")" > "$out" 2>&1
        ec=$?
    fi
    set -e
    rm -f "$pfile"
    [[ -n "$LOG_FILE" ]] && log_raw "Claude Output" "$(cat "$out")"
    [[ $ec -eq 124 ]] && log_message "ERROR" "Claude timed out after ${timeout}s"
    CLAUDE_OUTPUT_FILE="$out"
    return $ec
}
