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

# Get portable sed in-place flag
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

# Find real jq binary (not npm wrapper)
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

# Check dependencies
platform_check_deps() {
    local missing=()
    command -v git &>/dev/null || missing+=("git")
    [[ -n "$JQ_CMD" ]] || missing+=("jq")
    command -v claude &>/dev/null || missing+=("claude")

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "ERROR: Missing: ${missing[*]}" >&2
        return 1
    fi
    return 0
}

# Generate UUID
generate_uuid() {
    if [[ -f /proc/sys/kernel/random/uuid ]]; then
        cat /proc/sys/kernel/random/uuid
    elif command -v uuidgen &>/dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    else
        echo "$(date +%s)-$$-$RANDOM"
    fi
}

# Get timestamp
get_timestamp() {
    date -Iseconds 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S%z"
}
