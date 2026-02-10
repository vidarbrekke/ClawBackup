#!/usr/bin/env bash
# Update VERSION and propagate it to README.md and SKILL.md.
# Version format: <major>.<minor>.<commit-count>
#
# Use --next to increment for the pending commit (pre-commit usage).

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE_VERSION="1.0"
COUNT="$(git -C "$REPO_ROOT" rev-list --count HEAD)"
if [ "${1:-}" = "--next" ]; then
  COUNT=$((COUNT + 1))
fi
VERSION="${BASE_VERSION}.${COUNT}"

echo "$VERSION" > "$REPO_ROOT/VERSION"

REPO_ROOT_PY="$REPO_ROOT" python3 - <<'PY'
import os
import pathlib

root = pathlib.Path(os.environ["REPO_ROOT_PY"]).resolve()
version = (root / "VERSION").read_text().strip()

def update_file(path: pathlib.Path):
    text = path.read_text()
    if "Version:" in text:
        lines = []
        for line in text.splitlines():
            if line.startswith("Version:"):
                lines.append(f"Version: {version}")
            else:
                lines.append(line)
        path.write_text("\n".join(lines) + "\n")
    else:
        # Insert Version line after title line
        lines = text.splitlines()
        if lines:
            lines.insert(1, f"Version: {version}")
            path.write_text("\n".join(lines) + "\n")

for file_name in ("README.md", "SKILL.md"):
    update_file(root / file_name)
PY

echo "Updated VERSION to $VERSION"
