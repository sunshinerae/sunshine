#!/bin/bash
# tasks.sh - Safe task parsing with line-number-based operations

tasks_parse() {
    local plan_file="$1"
    local in_code_block=false
    local line_num=0

    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_num++))

        # Track fenced code blocks
        case "$line" in
            '```'*|'~~~'*)
                in_code_block=$([[ "$in_code_block" == false ]] && echo true || echo false)
                continue ;;
        esac

        [[ "$in_code_block" == true ]] && continue

        # Match task items: - [ ] or - [x]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[([[:space:]]|[xX])\][[:space:]]+(.+)$ ]]; then
            local checkbox="${BASH_REMATCH[1]}"
            local content="${BASH_REMATCH[2]}"
            local status=$([[ "$checkbox" == " " ]] && echo "pending" || echo "done")
            printf '%d\t%s\t%s\n' "$line_num" "$status" "$content"
        fi
    done < "$plan_file"
}

tasks_get_next() {
    local plan_file="$1"
    tasks_parse "$plan_file" | awk -F'\t' '$2 == "pending" {print $1 "\t" $3; exit}'
}

tasks_count() {
    local plan_file="$1" status="${2:-}"
    if [[ -n "$status" ]]; then
        tasks_parse "$plan_file" | awk -F'\t' -v s="$status" '$2 == s {c++} END {print c+0}'
    else
        tasks_parse "$plan_file" | wc -l | tr -d ' '
    fi
}

tasks_done_count() { tasks_count "$1" "done"; }
tasks_pending_count() { tasks_count "$1" "pending"; }

tasks_mark_complete() {
    local line_num="$1" plan_file="$2"
    [[ "$line_num" =~ ^[0-9]+$ ]] || return 1
    sed_inplace "$plan_file" "${line_num}s/\[ \]/[x]/"
}

tasks_mark_skipped() {
    local line_num="$1" plan_file="$2" reason="${3:-skipped}"
    [[ "$line_num" =~ ^[0-9]+$ ]] || return 1
    sed_inplace "$plan_file" "${line_num}s/\[ \]/[x] [SKIPPED: ${reason}]/"
}

tasks_validate() {
    local content="$1"
    [[ "$content" == *'$('* ]] && return 1
    [[ "$content" == *'`'* ]] && return 1
    return 0
}

tasks_sanitize_for_prompt() {
    local c="$1"
    c="${c//\$\(/}"; c="${c//)/}"
    printf '%s' "$c" | tr -d '`'
}

tasks_sanitize_for_git() {
    local c="$1"
    c="${c//\$/}"; c="${c//\"/\'}"; c="${c:0:72}"
    printf '%s' "$c" | tr -d '`'
}
