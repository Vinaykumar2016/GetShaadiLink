// backup_sync.js - Incremental daily backup script for GetShaadiLink (doesn't delete historic records)
const fs = require("fs");
const path = require("path");
const os = require("os");

// Define directories dynamically
const isProd = process.env.NODE_ENV === "production" || fs.existsSync("/home/u236692637");

const SOURCE_DIR = isProd
  ? path.join(os.homedir(), "getshaadilink_data")
  : path.join(__dirname, "data");

const BACKUP_DIR = isProd
  ? path.join(os.homedir(), "getshaadilink_backup")
  : path.join(__dirname, "backup_data");

console.log(`[Backup Started]`);
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Backup Destination: ${BACKUP_DIR}`);

// Ensure directories exist
if (!fs.existsSync(SOURCE_DIR)) {
  console.log(`Source directory does not exist. Nothing to back up.`);
  process.exit(0);
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function syncDirectory(src, dest) {
  let copiedCount = 0;
  let updatedCount = 0;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      const result = syncDirectory(srcPath, destPath);
      copiedCount += result.copied;
      updatedCount += result.updated;
    } else {
      // Check if file already exists in backup
      if (!fs.existsSync(destPath)) {
        // File doesn't exist - copy it
        fs.copyFileSync(srcPath, destPath);
        console.log(`[New File] Copied: ${item}`);
        copiedCount++;
      } else {
        // File exists - check if modified (compare file size and modification time)
        const destStat = fs.statSync(destPath);
        if (stat.size !== destStat.size || stat.mtimeMs > destStat.mtimeMs) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`[Updated File] Overwritten: ${item}`);
          updatedCount++;
        }
      }
    }
  }

  return { copied: copiedCount, updated: updatedCount };
}

try {
  const result = syncDirectory(SOURCE_DIR, BACKUP_DIR);
  console.log(`\n[Backup Succeeded]`);
  console.log(`New files copied: ${result.copied}`);
  console.log(`Existing files updated: ${result.updated}`);
  console.log(`No files were deleted (archive mode).`);
  process.exit(0);
} catch (err) {
  console.error(`\n[Backup Failed] Error during synchronization:`, err);
  process.exit(1);
}
