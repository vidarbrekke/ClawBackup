const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  defaults,
  resolveDir,
  normalizeSchedule,
  normalizeRange,
  normalizeUploadMode,
  buildBackupScript,
  buildLaunchdPlist
} = require("../setup.js");

test("normalizeSchedule accepts valid and falls back on invalid", () => {
  assert.equal(normalizeSchedule("launchd"), "launchd");
  assert.equal(normalizeSchedule(" CRON "), "cron");
  assert.equal(normalizeSchedule("none"), "none");
  assert.equal(normalizeSchedule("daily"), defaults.schedule);
});

test("normalizeRange clamps to fallback for invalid input", () => {
  assert.equal(normalizeRange("23", "11", 0, 23, "hour"), "23");
  assert.equal(normalizeRange("99", "11", 0, 23, "hour"), "11");
  assert.equal(normalizeRange("abc", "11", 0, 23, "hour"), "11");
});

test("normalizeUploadMode supports rclone and local-only", () => {
  assert.equal(normalizeUploadMode("rclone"), "rclone");
  assert.equal(normalizeUploadMode(" LOCAL-ONLY "), "local-only");
  assert.equal(normalizeUploadMode("other"), defaults.uploadMode);
});

test("resolveDir expands home shorthand and returns absolute paths", () => {
  const resolved = resolveDir("~/clawd");
  assert.ok(path.isAbsolute(resolved));
  assert.ok(resolved.endsWith(path.join("clawd")));
});

test("buildBackupScript includes core hardening and retention protections", () => {
  const script = buildBackupScript({
    projectDir: "/tmp/clawd",
    openclawDir: "/tmp/.openclaw",
    cursorappsClawd: "/tmp/Dev/CursorApps/clawd",
    localBackupDir: "/tmp/clawd/MoltBackups/Memory",
    gdriveRemote: "googleDrive:",
    gdriveDest: "MoltBackups/Memory/",
    retentionDays: "7",
    uploadMode: "rclone"
  });

  assert.ok(script.includes("set -euo pipefail"));
  assert.ok(script.includes("LOCK_DIR=\"$LOCAL_BACKUP_DIR/.lock\""));
  assert.ok(script.includes("manifest.json"));
  assert.ok(script.includes("shasum -a 256"));
  assert.ok(script.includes("sha256sum"));
  assert.ok(script.includes("--include 'clawd_memory_backup_*.tar.gz'"));
  assert.ok(script.includes("--include 'clawd_memory_backup_*.tar.gz.sha256'"));
  assert.ok(script.includes("UPLOAD_MODE=\"rclone\""));
});

test("buildBackupScript supports local-only mode", () => {
  const script = buildBackupScript({ uploadMode: "local-only" });
  assert.ok(script.includes("UPLOAD_MODE=\"local-only\""));
  assert.ok(script.includes("Upload disabled (local-only). Skipping rclone transfer."));
});

test("buildLaunchdPlist uses configured schedule time", () => {
  const plist = buildLaunchdPlist("/tmp/backup.sh", "/tmp/backups", "5", "30");
  assert.ok(plist.includes("<integer>5</integer>"));
  assert.ok(plist.includes("<integer>30</integer>"));
});
