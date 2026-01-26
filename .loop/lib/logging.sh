#!/bin/bash
# logging.sh - Structured logging

LOG_DIR="" LOG_FILE="" LOG_JSONL="" LOG_SESSION_ID=""

log_init() {
    LOG_DIR="${1:-logs}"
    LOG_SESSION_ID="${2:-$(generate_uuid)}"
    mkdir -p "$LOG_DIR"
    local ts=$(date +%Y-%m-%d-%H%M%S)
    LOG_FILE="$LOG_DIR/loop-${ts}.log"
    LOG_JSONL="$LOG_DIR/loop-${ts}.jsonl"
    echo "# Session: $LOG_SESSION_ID - $(get_timestamp)" >> "$LOG_FILE"
    echo "{\"event\":\"start\",\"session\":\"$LOG_SESSION_ID\",\"ts\":\"$(get_timestamp)\"}" >> "$LOG_JSONL"
}

log_human() {
    local msg="$1" quiet="${2:-}"
    strip_ansi "$msg" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    [[ "$quiet" != "--quiet" ]] && echo -e "$msg"
}

log_event() {
    local event="$1" data="$2"
    echo "{\"event\":\"$event\",\"ts\":\"$(get_timestamp)\",\"data\":$data}" >> "$LOG_JSONL"
}

log_message() {
    local level="$1" msg="$2"
    local color_msg="[$level] $msg"
    case "$level" in
        INFO) color_msg="${CYAN}[INFO]${NC} $msg" ;;
        WARN) color_msg="${YELLOW}[WARN]${NC} $msg" ;;
        ERROR) color_msg="${RED}[ERROR]${NC} $msg" ;;
    esac
    log_human "$color_msg"
}

log_raw() {
    echo "--- $1 ---" >> "$LOG_FILE"
    echo "$2" >> "$LOG_FILE"
    echo "--- end ---" >> "$LOG_FILE"
}

log_divider() {
    local char="${1:--}" width="${2:-50}"
    log_human "$(printf '%*s' "$width" | tr ' ' "$char")"
}

log_box() {
    local title="$1" color="${2:-}"
    log_human ""
    log_human "${color}========================================${NC}"
    log_human "   ${WHITE}${title}${NC}"
    log_human "${color}========================================${NC}"
    log_human ""
}
