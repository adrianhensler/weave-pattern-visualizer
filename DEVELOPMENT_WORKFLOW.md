# Development Workflow

**Last Updated**: 2026-01-04

---

## Critical: Prevent Branch Environment Mismatches

### The Problem We Had
During PR #2 review, there were TWO environments giving responses:
- **Environment A** (Claude Code): Had GitHub remote, could push/pull, saw broken PR commit
- **Environment B** (unknown): Had "work" branch, NO remotes, saw clean commit
- **Result**: Confusion about which version was actually on GitHub

### The Solution: Single Source of Truth

**✅ Always work in the repo with GitHub remote configured:**

```bash
# Before starting any work, verify you have the remote
git remote -v
# Should show:
# origin  https://github.com/adrianhensler/weave-pattern-visualizer.git (fetch)
# origin  https://github.com/adrianhensler/weave-pattern-visualizer.git (push)

# If no remote, you're in the WRONG environment!
```

**❌ Never create branches or make commits in a repo without remotes**

---

## Workflow for PRs and Development

### 1. Always Start from Main
```bash
git checkout main
git pull origin main
git checkout -b feature/my-new-feature
```

### 2. Make Changes and Commit
```bash
# Edit files
git add .
git commit -m "Description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3. Push to GitHub IMMEDIATELY
```bash
# Don't accumulate local commits without pushing
git push origin feature/my-new-feature
```

### 4. Create PR via GitHub CLI
```bash
gh pr create --title "Feature name" --body "Description"
```

### 5. Review and Merge
```bash
# Review
gh pr view <number>
gh pr diff <number>

# Merge when ready
gh pr merge <number> --merge --delete-branch
```

---

## Pre-Work Checklist

Before starting ANY development work:

```bash
#!/bin/bash
# Save as: check-environment.sh

echo "🔍 Checking development environment..."

# Check 1: Are we in the right directory?
if [ ! -f "index.html" ] || [ ! -d "js" ]; then
    echo "❌ Not in weave project directory!"
    exit 1
fi

# Check 2: Is GitHub remote configured?
if ! git remote -v | grep -q "github.com/adrianhensler/weave-pattern-visualizer"; then
    echo "❌ GitHub remote not configured!"
    echo "Run: git remote add origin https://github.com/adrianhensler/weave-pattern-visualizer.git"
    exit 1
fi

# Check 3: Are we on main or a feature branch?
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && ! echo "$BRANCH" | grep -qE "^(feature|fix|codex)/"; then
    echo "⚠️  Unusual branch name: $BRANCH"
    echo "Consider using: feature/*, fix/*, or codex/*"
fi

# Check 4: Are we synced with GitHub?
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "no-upstream")
if [ "$REMOTE" != "no-upstream" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "⚠️  Branch out of sync with GitHub"
    echo "Run: git pull origin $BRANCH"
fi

echo "✅ Environment looks good!"
echo "📍 Branch: $BRANCH"
echo "🔗 Remote: $(git remote get-url origin)"
```

Make it executable:
```bash
chmod +x check-environment.sh
```

Run before every work session:
```bash
./check-environment.sh
```

---

## Rules for Claude Code Sessions

When working with Claude Code:

1. **Always start by running**: `git remote -v`
2. **If no remote shows**: STOP - you're in the wrong environment
3. **Never create work branches without remotes**
4. **Push early, push often** - don't accumulate local-only commits
5. **Use GitHub as the source of truth** - not local branches

---

## PR Review Process

### For Reviewing PRs:
```bash
# Fetch the PR
gh pr checkout <number>

# Or view diff without checking out
gh pr diff <number>

# Check actual files
gh pr view <number> --json headRefOid
git fetch origin <commit-sha>
git checkout <commit-sha>
# Now you're looking at the ACTUAL PR commit
```

### Red Flags During Review:
- ❌ Duplicate code blocks in diff
- ❌ Orphaned CSS rules (selectors without properties)
- ❌ Extra closing tags
- ❌ If diff looks weird, check out the actual commit to verify

---

## Emergency: "I'm in the wrong environment!"

If you realize you're working in a repo without remotes:

```bash
# Option 1: Add the remote
git remote add origin https://github.com/adrianhensler/weave-pattern-visualizer.git

# Option 2: Clone a fresh copy and abandon the local-only repo
cd ~/code
mv weave weave-backup-local-only
git clone https://github.com/adrianhensler/weave-pattern-visualizer.git weave
cd weave
```

---

## Branch Naming Convention

Use these prefixes:
- `feature/` - New features (e.g., `feature/yarn-calculator`)
- `fix/` - Bug fixes (e.g., `fix/canvas-zoom`)
- `codex/` - Auto-generated branches (e.g., `codex/update-renderer`)

Never use:
- Generic names like `work`, `temp`, `test`
- Names without prefixes

---

## Commit Message Template

```
Brief description (50 chars max)

Optional longer description explaining what and why.
Keep it under 72 characters per line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Quick Reference: Common Commands

```bash
# Check environment
git remote -v
git status
git branch -a

# Sync with GitHub
git fetch origin
git pull origin main

# View PRs
gh pr list
gh pr view <number>
gh pr diff <number>

# Create PR
gh pr create --title "Title" --body "Description"

# Merge PR
gh pr merge <number> --merge --delete-branch

# Emergency: See what commit a PR actually has
gh pr view <number> --json headRefOid
```

---

## What Went Wrong with PR #2

**Timeline of the clusterfuck:**

1. PR created from `codex/wrap-canvas-in-viewport-container` branch
2. PR had commit `cc13afd` with syntax errors (duplicate canvas, orphaned CSS)
3. Someone checked a "work" branch in a local-only repo (no remotes)
4. That "work" branch had commit `d038ffc` WITHOUT errors (clean version)
5. Confusion ensued: which version was real?
6. Answer: GitHub (`cc13afd`) was the source of truth, "work" was local-only

**Root cause:** Working in an environment without GitHub remote configured.

**Fix:** Always verify `git remote -v` shows GitHub before starting work.

---

## Automation: Git Hook to Prevent Local-Only Work

Add to `.git/hooks/pre-push`:

```bash
#!/bin/bash
# Prevent pushing to non-existent remotes

REMOTE=$(git remote -v | grep origin | head -1)
if [ -z "$REMOTE" ]; then
    echo "❌ ERROR: No 'origin' remote configured!"
    echo "This repo is not connected to GitHub."
    echo "Add remote: git remote add origin https://github.com/adrianhensler/weave-pattern-visualizer.git"
    exit 1
fi

echo "✅ Pushing to: $REMOTE"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-push
```

---

**Bottom line:** If `git remote -v` shows nothing, STOP and fix it before doing any work.
