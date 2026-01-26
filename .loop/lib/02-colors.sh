#!/bin/bash
# =============================================================================
# colors.sh - TTY-aware color output
# =============================================================================

is_tty() { [[ -t 1 ]]; }

colors_init() {
    if is_tty && [[ "${NO_COLOR:-}" != "1" ]]; then
        RED='\033[0;31m'
        GREEN='\033[0;32m'
        YELLOW='\033[1;33m'
        BLUE='\033[0;34m'
        PURPLE='\033[0;35m'
        CYAN='\033[0;36m'
        WHITE='\033[1;37m'
        BOLD='\033[1m'
        DIM='\033[2m'
        NC='\033[0m'
    else
        RED='' GREEN='' YELLOW='' BLUE='' PURPLE='' CYAN='' WHITE='' BOLD='' DIM='' NC=''
    fi
}

strip_ansi() {
    printf '%s' "$1" | sed 's/\x1b\[[0-9;]*m//g'
}

status_ok() { echo -e "  ${GREEN}✓${NC} $1"; }
status_fail() { echo -e "  ${RED}✗${NC} $1"; }
status_warn() { echo -e "  ${YELLOW}!${NC} $1"; }
status_info() { echo -e "  ${CYAN}→${NC} $1"; }

progress_bar() {
    local current="$1" total="$2" width="${3:-30}"
    [[ "$total" -eq 0 ]] && { printf '%*s' "$width" | tr ' ' '░'; return; }
    local percent=$((current * 100 / total))
    local filled=$((percent * width / 100))
    local empty=$((width - filled))
    printf '%s%s %d%%' "$(printf '%*s' "$filled" | tr ' ' '█')" "$(printf '%*s' "$empty" | tr ' ' '░')" "$percent"
}

colors_init
