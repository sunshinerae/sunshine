#!/bin/bash
# state.sh - State machine with JSON persistence

STATE_FILE="" STATE_DIR="" CURRENT_STATE="INIT"

state_init() {
    STATE_DIR="${1:-.loop}"
    STATE_FILE="$STATE_DIR/state.json"
    mkdir -p "$STATE_DIR"

    if [[ -f "$STATE_FILE" ]]; then
        local saved=$("$JQ_CMD" -r '.state // "INIT"' "$STATE_FILE" 2>/dev/null)
        [[ -n "$saved" && "$saved" != "null" ]] && { CURRENT_STATE="RECOVERING"; return 0; }
    fi

    local sid=$(generate_uuid)
    "$JQ_CMD" -n --arg sid "$sid" --arg ts "$(get_timestamp)" '{
        version: 1, session_id: $sid, started_at: $ts, updated_at: $ts,
        state: "INIT", iteration: 0, current_task: null,
        stats: {tasks_completed:0, tasks_failed:0, tasks_skipped:0, total_tasks:0, task_times:[]}
    }' > "$STATE_FILE"
    CURRENT_STATE="INIT"
}

state_get() { echo "$CURRENT_STATE"; }

state_transition() {
    CURRENT_STATE="$1"
    state_set "state" "$1"
    state_set "updated_at" "$(get_timestamp)"
}

state_set() {
    local field="$1" value="$2"
    if [[ "$value" =~ ^[0-9]+$ ]]; then
        "$JQ_CMD" --argjson v "$value" ".${field} = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    else
        "$JQ_CMD" --arg v "$value" ".${field} = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi
}

state_get_field() { "$JQ_CMD" -r ".$1 // empty" "$STATE_FILE" 2>/dev/null; }
state_is_recovery() { [[ "$CURRENT_STATE" == "RECOVERING" ]]; }
state_session_id() { state_get_field "session_id"; }
state_update_stats() { "$JQ_CMD" --argjson v "$2" ".stats.$1 = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
state_add_task_time() { "$JQ_CMD" --argjson t "$1" '.stats.task_times += [$t]' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
state_increment_stat() { "$JQ_CMD" ".stats.$1 += 1" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }

state_set_task() {
    local line="$1" text="$2" cp="${3:-}"
    "$JQ_CMD" --argjson ln "$line" --arg txt "$text" --arg ts "$(get_timestamp)" --arg cp "$cp" \
        '.current_task = {line_number:$ln, text:$txt, started_at:$ts, retry_count:0, checkpoint:$cp}' \
        "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
}

state_increment_retry() {
    "$JQ_CMD" '.current_task.retry_count += 1' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    state_get_field "current_task.retry_count"
}

state_clear_task() { "$JQ_CMD" '.current_task = null' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
