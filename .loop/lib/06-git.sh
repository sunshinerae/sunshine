#!/bin/bash
# =============================================================================
# git.sh - Git operations with checkpoints and rollback
# =============================================================================

git_checkpoint_create() {
    local iteration="$1" task="$2" ts=$(date +%s)
    local tag="loop-checkpoint-${iteration}-${ts}"
    git tag "$tag" HEAD 2>/dev/null && echo "$tag" || { echo "ERROR: Failed to create checkpoint" >&2; return 1; }
}

git_checkpoint_rollback() {
    local tag="$1"
    git rev-parse "$tag" &>/dev/null || { echo "ERROR: Checkpoint $tag not found" >&2; return 1; }
    git reset --hard "$tag" &>/dev/null && { log_message "INFO" "Rolled back to: $tag"; return 0; } || { echo "ERROR: Rollback failed" >&2; return 1; }
}

git_checkpoints_list() { git tag -l 'loop-checkpoint-*' | sort -V; }

git_checkpoints_prune() {
    local keep="${1:-10}"
    local -a all=($(git_checkpoints_list))
    local total=${#all[@]} to_delete=$((total - keep))
    [[ "$to_delete" -le 0 ]] && return 0
    for ((i=0; i<to_delete; i++)); do git tag -d "${all[$i]}" 2>/dev/null; done
    log_message "INFO" "Pruned $to_delete old checkpoints"
}

git_commit_count() { git rev-list --count HEAD 2>/dev/null || echo 0; }
git_last_commit() { git log --oneline -1 2>/dev/null || echo "none"; }
git_last_hash() { git rev-parse --short HEAD 2>/dev/null || echo ""; }
git_verify_commit() { [[ "$(git_commit_count)" -gt "$1" ]]; }

git_commit_safe() {
    local msg="$1"
    if git diff --cached --quiet 2>/dev/null; then
        git diff --quiet -- "$PLAN_FILE" 2>/dev/null || git add "$PLAN_FILE"
        git diff --cached --quiet 2>/dev/null && { log_message "WARN" "Nothing to commit"; return 1; }
    fi
    git commit -m "$msg" 2>/dev/null || { log_message "ERROR" "Git commit failed"; return 1; }
}

git_is_clean() { [[ -z "$(git status --porcelain 2>/dev/null)" ]]; }
git_modified_files() { git status --porcelain 2>/dev/null | awk '{print $2}'; }
