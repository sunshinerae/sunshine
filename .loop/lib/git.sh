#!/bin/bash
# git.sh - Git operations with checkpoints

git_checkpoint_create() {
    local iteration="$1" task="$2"
    local tag="loop-checkpoint-${iteration}-$(date +%s)"
    git tag "$tag" HEAD 2>/dev/null && echo "$tag"
}

git_checkpoint_rollback() {
    local tag="$1"
    git rev-parse "$tag" &>/dev/null || return 1
    git reset --hard "$tag" &>/dev/null
}

git_checkpoints_list() { git tag -l 'loop-checkpoint-*' | sort -V; }

git_checkpoints_prune() {
    local keep="${1:-10}"
    local all=($(git_checkpoints_list))
    local del=$((${#all[@]} - keep))
    [[ $del -le 0 ]] && return
    for ((i=0; i<del; i++)); do git tag -d "${all[$i]}" 2>/dev/null; done
}

git_commit_count() { git rev-list --count HEAD 2>/dev/null || echo 0; }
git_last_commit() { git log --oneline -1 2>/dev/null || echo "none"; }
git_last_hash() { git rev-parse --short HEAD 2>/dev/null; }
git_verify_commit() { [[ "$(git_commit_count)" -gt "$1" ]]; }
git_is_clean() { [[ -z "$(git status --porcelain 2>/dev/null)" ]]; }
git_modified_files() { git status --porcelain 2>/dev/null | awk '{print $2}'; }

git_commit_safe() {
    local msg="$1"
    git diff --cached --quiet 2>/dev/null && git add "$PLAN_FILE" 2>/dev/null
    git commit -m "$msg" 2>/dev/null
}
