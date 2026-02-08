#!/usr/bin/env bash
# Creates a folder with only the files needed for ClawHub upload (no .git or .cursor).
# Run from repo root, then point ClawHub "Drop a folder" at the created folder.

set -e
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$REPO_ROOT/clawhub-bundle"
rm -rf "$OUT"
mkdir -p "$OUT"
cp "$REPO_ROOT/SKILL.md" "$REPO_ROOT/README.md" "$REPO_ROOT/setup.js" "$REPO_ROOT/install-launchagent.sh" "$OUT/"
echo "Created: $OUT"
echo "Files: $(ls -1 "$OUT" | wc -l | tr -d ' ')"
ls -1 "$OUT"
echo ""
echo "Use this folder for ClawHub: Choose folder → select: $OUT"
