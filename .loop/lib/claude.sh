#!/bin/bash
# claude.sh - Claude invocation with timeout

MEMORY_FILE=""

memory_init() {
    MEMORY_FILE="${1:-.loop/memory.json}"
    [[ -f "$MEMORY_FILE" ]] || echo '{"version":1,"entries":[]}' > "$MEMORY_FILE"
}

memory_add_success() {
    local task="$1" hash="${2:-}" dur="${3:-0}"
    [[ -f "$MEMORY_FILE" ]] || return
    "$JQ_CMD" --arg ts "$(get_timestamp)" --arg t "$task" --arg h "$hash" --argjson d "$dur" \
        '.entries += [{ts:$ts,type:"success",task:$t,hash:$h,dur:$d}] | .entries = .entries[-50:]' \
        "$MEMORY_FILE" > "${MEMORY_FILE}.tmp" && mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"
}

memory_add_failure() {
    local task="$1" error="$2" retry="${3:-0}"
    [[ -f "$MEMORY_FILE" ]] || return
    "$JQ_CMD" --arg ts "$(get_timestamp)" --arg t "$task" --arg e "$error" --argjson r "$retry" \
        '.entries += [{ts:$ts,type:"failure",task:$t,error:$e,retry:$r}] | .entries = .entries[-50:]' \
        "$MEMORY_FILE" > "${MEMORY_FILE}.tmp" && mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"
}

memory_build_context() {
    [[ -f "$MEMORY_FILE" ]] || return
    local succ=$("$JQ_CMD" -r '.entries | map(select(.type=="success")) | .[-3:] | .[] | "- Done: \(.task)"' "$MEMORY_FILE" 2>/dev/null)
    local fail=$("$JQ_CMD" -r '.entries | map(select(.type=="failure")) | .[-3:] | .[] | "- Failed: \(.task)"' "$MEMORY_FILE" 2>/dev/null)
    [[ -n "$succ" || -n "$fail" ]] && echo -e "\n---\nRECENT:\n$succ\n$fail\n---"
}

claude_build_prompt() {
    local prompt_file="$1" task="$2"
    cat "$prompt_file"
    memory_build_context
    echo -e "\n---\nLast commit: $(git_last_commit)\nCURRENT TASK: $task\n---"
}

claude_run() {
    local prompt="$1" timeout="${2:-600}" yolo="${3:-false}" outfile="${4:-$(mktemp)}"
    local flags="--print"
    [[ "$yolo" == "true" ]] && flags="--dangerously-skip-permissions --print"

    local pfile=$(mktemp)
    printf '%s' "$prompt" > "$pfile"

    local code=0
    if [[ -n "$TIMEOUT_CMD" ]]; then
        $TIMEOUT_CMD "${timeout}s" claude $flags "$(cat "$pfile")" > "$outfile" 2>&1 || code=$?
    else
        claude $flags "$(cat "$pfile")" > "$outfile" 2>&1 || code=$?
    fi
    rm -f "$pfile"

    [[ -n "$LOG_FILE" ]] && log_raw "Claude Output" "$(cat "$outfile")"
    CLAUDE_OUTPUT_FILE="$outfile"
    return $code
}
