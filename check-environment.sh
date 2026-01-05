#!/bin/bash
# Environment Check Script - Run before starting any development work

echo "🔍 Checking development environment..."
echo ""

# Check 1: Are we in the right directory?
if [ ! -f "index.html" ] || [ ! -d "js" ]; then
    echo "❌ FAIL: Not in weave project directory!"
    echo "   Current dir: $(pwd)"
    exit 1
fi
echo "✅ In weave project directory"

# Check 2: Is GitHub remote configured?
if ! git remote -v | grep -q "github.com/adrianhensler/weave-pattern-visualizer"; then
    echo "❌ FAIL: GitHub remote not configured!"
    echo "   Fix: git remote add origin https://github.com/adrianhensler/weave-pattern-visualizer.git"
    exit 1
fi
echo "✅ GitHub remote configured"

# Check 3: Can we reach GitHub?
if ! git ls-remote origin HEAD >/dev/null 2>&1; then
    echo "⚠️  WARNING: Cannot reach GitHub (network issue?)"
else
    echo "✅ GitHub reachable"
fi

# Check 4: What branch are we on?
BRANCH=$(git branch --show-current)
echo "📍 Current branch: $BRANCH"

if [ "$BRANCH" != "main" ] && ! echo "$BRANCH" | grep -qE "^(feature|fix|codex)/"; then
    echo "⚠️  WARNING: Unusual branch name"
    echo "   Consider: feature/*, fix/*, or codex/*"
fi

# Check 5: Are we synced with GitHub?
git fetch origin -q
LOCAL=$(git rev-parse @ 2>/dev/null)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "no-upstream")

if [ "$REMOTE" = "no-upstream" ]; then
    echo "⚠️  WARNING: Branch not tracking remote"
    echo "   Fix: git push -u origin $BRANCH"
elif [ "$LOCAL" != "$REMOTE" ]; then
    AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
    BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")

    if [ "$AHEAD" -gt 0 ]; then
        echo "⚠️  $AHEAD commit(s) ahead of GitHub - push soon!"
    fi
    if [ "$BEHIND" -gt 0 ]; then
        echo "⚠️  $BEHIND commit(s) behind GitHub"
        echo "   Fix: git pull origin $BRANCH"
    fi
else
    echo "✅ Synced with GitHub"
fi

# Check 6: Any uncommitted changes?
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "⚠️  You have uncommitted changes"
fi

echo ""
echo "🔗 Remote: $(git remote get-url origin)"
echo ""
echo "✅ Environment check complete!"
