#!/bin/bash
# =============================================================================
# platform.sh - Cross-platform compatibility layer
# =============================================================================

# Detect platform
platform_detect() {
    case "$(uname -s)" in
        Linux*)  echo "linux" ;;
        Darwin*) echo "darwin" ;;
        MINGW*|CYGWIN*|MSYS*) echo "windows" ;;
        *)       echo "unknown" ;;
    esac
}

PLATFORM=$(platform_detect)

# Find real jq (not npm's broken jq package)
find_real_jq() {
    for path in /usr/bin/jq /bin/jq /usr/local/bin/jq; do
        if [[ -x "$path" ]] && "$path" --version &>/dev/null; then
            echo "$path"
            return 0
        fi
    done
    command -v jq 2>/dev/null
}

JQ_CMD=$(find_real_jq)

# Wrapper for jq that uses the correct binary
jq() {
    "$JQ_CMD" "$@"
}

# Get portable sed in-place
sed_inplace() {
    local file="$1"
    shift
    if [[ "$PLATFORM" == "darwin" ]]; then
        sed -i '' "$@" "$file"
    else
        sed -i "$@" "$file"
    fi
}

# Get timeout command
get_timeout_cmd() {
    if command -v timeout &>/dev/null; then
        echo "timeout"
    elif command -v gtimeout &>/dev/null; then
        echo "gtimeout"
    else
        echo ""
    fi
}

TIMEOUT_CMD=$(get_timeout_cmd)

# Run command with timeout
run_with_timeout() {
    local timeout_secs="$1"
    shift
    if [[ -n "$TIMEOUT_CMD" ]]; then
        "$TIMEOUT_CMD" "${timeout_secs}s" "$@"
    else
        "$@"
    fi
}

# Check if required tools are available
platform_check_deps() {
    local missing=()
    command -v git &>/dev/null || missing+=("git")
    [[ -n "$JQ_CMD" ]] && "$JQ_CMD" --version &>/dev/null || missing+=("jq")
    command -v claude &>/dev/null || missing+=("claude")

    if [[ -z "$TIMEOUT_CMD" ]]; then
        echo "WARNING: timeout command not found" >&2
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "ERROR: Missing dependencies: ${missing[*]}" >&2
        return 1
    fi
    return 0
}

# Generate UUID
generate_uuid() {
    if command -v uuidgen &>/dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    elif [[ -f /proc/sys/kernel/random/uuid ]]; then
        cat /proc/sys/kernel/random/uuid
    else
        echo "$(date +%s)-$$-$RANDOM"
    fi
}

# Get timestamp
get_timestamp() {
    date -Iseconds 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S%z"
}

# Lock file management
LOCK_FILE=""

lock_acquire() {
    [[ -z "$LOCK_FILE" ]] && LOCK_FILE="${LOOP_DIR:-$PWD/.loop}/lock.pid"
    [[ -f "$LOCK_FILE" ]] && {
        local pid=$(cat "$LOCK_FILE" 2>/dev/null)
        kill -0 "$pid" 2>/dev/null && { echo "ERROR: Already running (PID $pid)" >&2; return 1; }
        rm -f "$LOCK_FILE"
    }
    echo $$ > "$LOCK_FILE"
}

lock_release() {
    [[ -z "$LOCK_FILE" ]] && return
    [[ -f "$LOCK_FILE" && "$(cat "$LOCK_FILE" 2>/dev/null)" == "$$" ]] && rm -f "$LOCK_FILE"
}
