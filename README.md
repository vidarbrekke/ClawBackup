# ClawBackup

Backs up your OpenClaw customizations (memory, config, skills, workspace) to Google Drive on a schedule. Works on macOS, Linux, and Windows (via Git Bash or WSL).

## What gets backed up

- **Clawd memory** — your project memory folder
- **OpenClaw config** — `openclaw.json`, skills, modules, workspace, cron jobs
- **Clawd scripts** — backup script, LaunchAgent plist (macOS)
- **CursorApps/clawd** — skills source, session proxy, docs (excluding `node_modules`)

## Prerequisites

- **Node.js** — [Download](https://nodejs.org/) (for running setup)
- **rclone** — [Download](https://rclone.org/install/) and configured for Google Drive
- **Bash** — included on macOS/Linux; use Git Bash on Windows

## Install (choose one)

### Option A: One command (no git required)

Run this in your terminal. It downloads and runs the setup interactively:

```bash
curl -fsSL https://raw.githubusercontent.com/vidarbrekke/ClawBackup/main/setup.js | node
```

### Option B: Clone the repo

```bash
git clone https://github.com/vidarbrekke/ClawBackup.git
cd ClawBackup
node setup.js
```

## Run setup

1. Run the setup (using Option A or B above).
2. Answer the prompts. Press Enter to accept the default in brackets.
3. The setup writes a customized `backup_enhanced.sh` into your project’s `scripts/` folder.
4. If you chose `launchd` (macOS) or `cron` (Linux), follow the printed commands to enable scheduled backups.

## Before first backup

1. **Configure rclone for Google Drive:**
   ```bash
   rclone config
   ```
   Create a remote (e.g. `googleDrive`) and complete the OAuth flow.

2. **Test a backup:**
   ```bash
   ~/clawd/scripts/backup_enhanced.sh
   ```
   (Use the path the setup printed for your system.)

## Schedule (optional)

- **macOS:** The setup generates a LaunchAgent plist. Install with the printed commands (copy to `~/Library/LaunchAgents/` and `launchctl load` — no sudo). Backups run daily at 11:00 under your user so rclone uses your config.
- **Linux:** Add the printed cron line to `crontab -e`.
- **Windows:** Use Task Scheduler to run the backup script daily via Git Bash or WSL.

## License

MIT
