# Hostinger Daily Backup Cron Job Setup Guide

This guide details how to configure Hostinger's Cron Jobs panel to automatically back up your cards once a day.

---

## What the Backup Script Does (`backup_sync.js`)
* **Source**: `/home/u236692637/getshaadilink_data` (where all live cards, support queries, and reviews are saved).
* **Destination**: `/home/u236692637/getshaadilink_backup` (a separate backup directory in your user home directory).
* **Incremental logic**: It scans for new cards and updates modified ones.
* **No deletion**: Even if a card is deleted on the live website, the script **never** deletes anything from the backup folder, ensuring a permanent archive.

---

## Step-by-Step Cron Job Configuration

1. **Log in to Hostinger hPanel**:
   Navigate to [Hostinger hPanel](https://hpanel.hostinger.com) and log in.

2. **Open Cron Jobs section**:
   * On the hosting plan dashboard, search for **Cron Jobs** in the search bar or go to **Advanced -> Cron Jobs**.

3. **Add New Cron Job**:
   Fill in the form fields:
   * **Choose Type**: `Custom`
   * **Command to run**:
     ```bash
     /usr/local/bin/node /home/u236692637/public_html/backup_sync.js
     ```
     *(Note: If your website files are in a subdirectory like `/public_html/GetShaadiLink/`, adjust the path to `/home/u236692637/public_html/GetShaadiLink/backup_sync.js`)*
   
   * **Common Settings**: Choose **Once a Day** (which sets it to midnight `0 0 * * *`).
   * **Custom Time Details** (if "Once a Day" isn't pre-selected):
     * Minute: `0`
     * Hour: `0`
     * Day of Month: `*`
     * Month: `*`
     * Day of Week: `*`

4. **Save / Create**:
   Click **Save** or **Create**. The backup script will now execute automatically every night.

---

## Manual Execution (Testing)
If you want to run the backup manually via SSH on Hostinger:
1. Connect to your VPS/Hosting server via SSH.
2. Run:
   ```bash
   node /home/u236692637/public_html/backup_sync.js
   ```
3. It will print the list of newly copied files and confirm success.
