#!/bin/bash
# =============================================================================
# logging.sh - Structured logging (human + JSON)
# =============================================================================

LOG_DIR="" LOG_FILE="" LOG_JSONL="" LOG_SESSION_ID=""

log_init() {
    LOG_DIR="${1:-logs}"
    LOG_SESSION_ID="${2:-$(generate_uuid)}"
    mkdir -p "$LOG_DIR"
    local ts=$(date +%Y-%m-%d-%H%M%S)
    LOG_FILE="$LOG_DIR/loop-${ts}.log"
    LOG_JSONL="$LOG_DIR/loop-${ts}.jsonl"
    { echo "# Loop Session: $LOG_SESSION_ID"; echo "# Started: $(get_timestamp)"; echo ""; } >> "$LOG_FILE"
    jq -n --arg sid "$LOG_SESSION_ID" --arg ts "$(get_timestamp)" '{event: "session_start", session_id: $sid, timestamp: $ts}' >> "$LOG_JSONL"
}

log_human() {
    local msg="$1" quiet="${2:-}"
    strip_ansi "$msg" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    [[ "$quiet" != "--quiet" ]] && echo -e "$msg"
}

log_event() {
    local event="$1" data="$2"
    jq -n --arg e "$event" --arg ts "$(get_timestamp)" --arg sid "$LOG_SESSION_ID" --argjson d "$data" \
        '{event: $e, timestamp: $ts, session_id: $sid, data: $d}' >> "$LOG_JSONL"
}

log_message() {
    local level="$1" msg="$2" meta="${3:-{}}"
    local color_msg
    case "$level" in
        INFO) color_msg="${CYAN}[INFO]${NC} $msg" ;;
        WARN) color_msg="${YELLOW}[WARN]${NC} $msg" ;;
        ERROR) color_msg="${RED}[ERROR]${NC} $msg" ;;
        *) color_msg="[$level] $msg" ;;
    esac
    log_human "$color_msg"
    log_event "log" "$(jq -n --arg l "$level" --arg m "$msg" --argjson meta "$meta" '{level: $l, message: $m, metadata: $meta}')"
}

log_raw() { { echo "--- $1 Start ---"; echo "$2"; echo "--- $1 End ---"; echo ""; } >> "$LOG_FILE"; }

log_divider() {
    local char="${1:-━}" width="${2:-50}"
    log_human "${CYAN}$(printf '%*s' "$width" | tr ' ' "$char")${NC}"
}

log_box() {
    local title="$1" color="${2:-$PURPLE}"
    log_human ""
    log_human "${color}╔════════════════════════════════════════════╗${NC}"
    log_human "${color}║${NC}   ${WHITE}${title}${NC}"
    log_human "${color}╚════════════════════════════════════════════╝${NC}"
    log_human ""
}
