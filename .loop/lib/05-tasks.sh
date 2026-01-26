#!/bin/bash
# =============================================================================
# tasks.sh - Safe task parsing with line-number-based operations
# =============================================================================

tasks_parse() {
    local plan_file="$1" in_code_block="false" line_num=0
    while IFS= read -r line || [[ -n "$line" ]]; do
        line_num=$((line_num + 1))
        if echo "$line" | grep -qE '^[[:space:]]*(```|~~~)'; then
            [[ "$in_code_block" == "false" ]] && in_code_block="true" || in_code_block="false"
            continue
        fi
        [[ "$in_code_block" == "true" ]] && continue
        echo "$line" | grep -qE '^[[:space:]]{4,}[^-]' && continue
        if echo "$line" | grep -qE '^[[:space:]]*-[[:space:]]\[[[:space:]]\][[:space:]]+'; then
            local content=$(echo "$line" | sed 's/^[[:space:]]*-[[:space:]]\[[[:space:]]\][[:space:]]*//')
            printf '%d\t%s\t%s\n' "$line_num" "pending" "$content"
        elif echo "$line" | grep -qiE '^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]+'; then
            local content=$(echo "$line" | sed 's/^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]*//')
            printf '%d\t%s\t%s\n' "$line_num" "done" "$content"
        fi
    done < "$plan_file"
}

tasks_get_next() { tasks_parse "$1" | awk -F'\t' '$2 == "pending" {print $1 "\t" $3; exit}'; }

tasks_count() {
    local plan_file="$1" status="${2:-}"
    [[ -n "$status" ]] && tasks_parse "$plan_file" | awk -F'\t' -v s="$status" '$2 == s {count++} END {print count+0}' || tasks_parse "$plan_file" | wc -l | tr -d ' '
}

tasks_done_count() { tasks_count "$1" "done"; }
tasks_pending_count() { tasks_count "$1" "pending"; }

tasks_mark_complete() {
    local line_num="$1" plan_file="$2"
    [[ "$line_num" =~ ^[0-9]+$ ]] || { echo "ERROR: Invalid line number" >&2; return 1; }
    local cur=$(sed -n "${line_num}p" "$plan_file")
    echo "$cur" | grep -qE '^[[:space:]]*-[[:space:]]\[[[:space:]]\]' || { echo "ERROR: Line $line_num not unchecked task" >&2; return 1; }
    sed_inplace "$plan_file" "${line_num}s/\[ \]/[x]/"
    sed -n "${line_num}p" "$plan_file" | grep -q '\[x\]'
}

tasks_mark_skipped() {
    local line_num="$1" plan_file="$2" reason="${3:-skipped}"
    [[ "$line_num" =~ ^[0-9]+$ ]] || return 1
    local safe_reason=$(echo "$reason" | tr -d '/&')
    sed_inplace "$plan_file" "${line_num}s/\[ \]/[x] [SKIPPED: ${safe_reason}]/"
}

tasks_validate() {
    local content="$1"
    echo "$content" | grep -qE '\$\(' && { echo "WARN: Contains command substitution" >&2; return 1; }
    echo "$content" | grep -qE '\|\||&&|;' && { echo "WARN: Contains shell operators" >&2; return 1; }
    return 0
}

tasks_sanitize_for_prompt() { echo "$1" | sed 's/\$([^)]*)//g'; }
tasks_sanitize_for_git() { echo "$1" | tr -d '$`"' | cut -c1-72; }
