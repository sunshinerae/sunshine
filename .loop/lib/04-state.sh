#!/bin/bash
# =============================================================================
# state.sh - State machine with JSON persistence
# =============================================================================

STATE_FILE="" STATE_DIR=""
declare -a VALID_STATES=(INIT PREFLIGHT IDLE SELECTING CHECKPOINT EXECUTING VERIFYING COMMITTING RETRY ROLLBACK RECOVERING COMPLETE FAILED)
declare -A VALID_TRANSITIONS=(
    ["INIT,PREFLIGHT"]=1 ["PREFLIGHT,IDLE"]=1 ["PREFLIGHT,FAILED"]=1
    ["IDLE,SELECTING"]=1 ["IDLE,COMPLETE"]=1
    ["SELECTING,CHECKPOINT"]=1 ["SELECTING,FAILED"]=1
    ["CHECKPOINT,EXECUTING"]=1 ["CHECKPOINT,FAILED"]=1
    ["EXECUTING,VERIFYING"]=1 ["EXECUTING,TIMEOUT"]=1 ["EXECUTING,ERROR"]=1
    ["TIMEOUT,ROLLBACK"]=1 ["ERROR,RETRY"]=1 ["ERROR,ROLLBACK"]=1
    ["VERIFYING,COMMITTING"]=1 ["VERIFYING,RETRY"]=1
    ["COMMITTING,IDLE"]=1 ["COMMITTING,FAILED"]=1
    ["RETRY,SELECTING"]=1 ["RETRY,FAILED"]=1
    ["ROLLBACK,IDLE"]=1 ["ROLLBACK,FAILED"]=1
    ["RECOVERING,IDLE"]=1 ["RECOVERING,SELECTING"]=1
)
CURRENT_STATE="INIT"

state_init() {
    STATE_DIR="${1:-.loop}"
    STATE_FILE="$STATE_DIR/state.json"
    mkdir -p "$STATE_DIR"
    if [[ -f "$STATE_FILE" ]]; then
        local saved=$(jq -r '.state // "INIT"' "$STATE_FILE" 2>/dev/null)
        [[ -n "$saved" && "$saved" != "null" ]] && { CURRENT_STATE="RECOVERING"; return 0; }
    fi
    local sid=$(generate_uuid)
    jq -n --arg sid "$sid" --arg ts "$(get_timestamp)" --arg state "INIT" \
        '{version: 1, session_id: $sid, started_at: $ts, updated_at: $ts, state: $state, iteration: 0, current_task: null, stats: {tasks_completed: 0, tasks_failed: 0, tasks_skipped: 0, total_tasks: 0, total_time_seconds: 0, task_times: []}, last_error: null}' > "$STATE_FILE"
    CURRENT_STATE="INIT"
}

state_get() { echo "$CURRENT_STATE"; }

state_transition() {
    local new="$1" key="${CURRENT_STATE},${new}"
    [[ -z "${VALID_TRANSITIONS[$key]}" ]] && { log_message "ERROR" "Invalid transition: $CURRENT_STATE -> $new"; return 1; }
    local old="$CURRENT_STATE"
    CURRENT_STATE="$new"
    state_set "state" "$new"
    state_set "updated_at" "$(get_timestamp)"
    log_event "state_transition" "$(jq -n --arg f "$old" --arg t "$new" '{from: $f, to: $t}')"
    return 0
}

state_set() {
    local field="$1" value="$2"
    if [[ "$value" =~ ^[0-9]+$ ]]; then
        jq --argjson v "$value" ".${field} = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    else
        jq --arg v "$value" ".${field} = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi
}

state_get_field() { jq -r ".$1 // empty" "$STATE_FILE" 2>/dev/null; }
state_is_recovery() { [[ "$CURRENT_STATE" == "RECOVERING" ]]; }
state_session_id() { state_get_field "session_id"; }
state_update_stats() { jq --argjson v "$2" ".stats.${1} = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
state_add_task_time() { jq --argjson t "$1" '.stats.task_times += [$t]' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
state_increment_stat() { jq ".stats.${1} += 1" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }

state_set_task() {
    local ln="$1" txt="$2" cp="${3:-}"
    jq --argjson ln "$ln" --arg txt "$txt" --arg ts "$(get_timestamp)" --arg cp "$cp" \
        '.current_task = {line_number: $ln, text: $txt, started_at: $ts, retry_count: 0, checkpoint_tag: $cp}' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
}

state_increment_retry() { jq '.current_task.retry_count += 1' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; state_get_field "current_task.retry_count"; }
state_clear_task() { jq '.current_task = null' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
state_set_error() { jq --arg e "$1" '.last_error = $e' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"; }
