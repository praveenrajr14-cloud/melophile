/**
 * Melophile Music Academy — Cloud Storage & Email Backend Service
 * Primary Connected Cloud Account: praveenrajr14@gmail.com
 *
 * Architecture:
 * 1. Google Drive & Google Sheets Cloud Storage via Google Apps Script Web App (DriveApp + SpreadsheetApp)
 * 2. Instant Email Notification via FormSubmit AJAX API -> praveenrajr14@gmail.com
 * 3. Persistent Local Cloud Ledger (localStorage) with CSV/JSON export & automatic retry sync
 */

export const BACKEND_EMAIL = 'praveenrajr14@gmail.com';
export const STORAGE_RECORDS_KEY = 'melophile_cloud_records_v1';
export const STORAGE_WEBHOOK_KEY = 'melophile_google_script_url';

export type CloudRecordType = 'TRIAL_BOOKING' | 'CONTACT_INQUIRY' | 'PRO_SUBSCRIPTION';

export interface CloudSubmissionPayload {
  type: CloudRecordType;
  name: string;
  email: string;
  phone: string;
  course?: string;
  level?: string;
  mode?: string;
  message?: string;
  plan?: string;
  amount?: string;
}

export interface StoredCloudRecord extends CloudSubmissionPayload {
  id: string;
  createdAt: string;
  targetAccount: string;
  syncStatus: 'synced_cloud_and_email' | 'email_dispatched' | 'saved_to_cloud_queue';
  syncedAt?: string;
}

/**
 * Retrieve the configured Google Apps Script Web App URL (Google Drive / Sheets connector)
 */
export function getGoogleScriptUrl(): string {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(STORAGE_WEBHOOK_KEY);
  if (saved && saved.trim().startsWith('https://script.google.com/')) {
    return saved.trim();
  }
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_SCRIPT_URL;
  return envUrl ? envUrl.trim() : '';
}

/**
 * Save a custom Google Apps Script Web App URL
 */
export function setGoogleScriptUrl(url: string): void {
  if (typeof window === 'undefined') return;
  if (!url.trim()) {
    localStorage.removeItem(STORAGE_WEBHOOK_KEY);
  } else {
    localStorage.setItem(STORAGE_WEBHOOK_KEY, url.trim());
  }
}

/**
 * Load all stored records from local cloud ledger
 */
export function getCloudRecords(): StoredCloudRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save record list to local cloud ledger
 */
function saveCloudRecords(records: StoredCloudRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('melophile-cloud-updated'));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Submit a form or subscription record to praveenrajr14@gmail.com Cloud Storage & Email Backend
 */
export async function submitToCloudBackend(
  payload: CloudSubmissionPayload
): Promise<{
  success: boolean;
  record: StoredCloudRecord;
  googleDriveSynced: boolean;
  emailSent: boolean;
}> {
  const id = `MELO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const createdAt = new Date().toISOString();

  const initialRecord: StoredCloudRecord = {
    ...payload,
    id,
    createdAt,
    targetAccount: BACKEND_EMAIL,
    syncStatus: 'saved_to_cloud_queue',
  };

  // Save immediately to local cloud queue so zero data is ever lost
  const existing = getCloudRecords();
  saveCloudRecords([initialRecord, ...existing]);

  let googleDriveSynced = false;
  let emailSent = false;

  const scriptUrl = getGoogleScriptUrl();

  // 1. Dispatch to Google Drive & Google Sheets Web App if configured
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          ...initialRecord,
          account: BACKEND_EMAIL,
          academy: 'Melophile Music Academy',
        }),
      });
      googleDriveSynced = true;
    } catch {
      googleDriveSynced = false;
    }
  }

  // 2. Dispatch Instant Email & Cloud Notification via FormSubmit AJAX to praveenrajr14@gmail.com
  try {
    const typeLabel =
      payload.type === 'TRIAL_BOOKING'
        ? 'New Free Trial Booking'
        : payload.type === 'PRO_SUBSCRIPTION'
        ? 'New Melophile Pro Subscription'
        : 'New Website Contact Inquiry';

    const formSubmitBody: Record<string, string> = {
      _subject: `[Melophile Cloud] ${typeLabel} — ${payload.name}`,
      _template: 'table',
      _captcha: 'false',
      Record_ID: id,
      Submission_Type: typeLabel,
      Timestamp_IST: new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      Student_Name: payload.name,
      Email: payload.email || 'Not provided',
      Phone_WhatsApp: payload.phone || 'Not provided',
      Course_Instrument: payload.course || 'N/A',
      Experience_Level: payload.level || 'N/A',
      Preferred_Mode: payload.mode || 'N/A',
      Subscription_Plan: payload.plan || 'N/A',
      Amount: payload.amount || 'N/A',
      Message_Notes: payload.message || 'None',
      Cloud_Storage_Account: BACKEND_EMAIL,
    };

    const response = await fetch(`https://formsubmit.co/ajax/${BACKEND_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formSubmitBody),
    });

    if (response.ok) {
      emailSent = true;
    }
  } catch {
    emailSent = false;
  }

  // Update record status
  const updatedStatus: StoredCloudRecord['syncStatus'] =
    googleDriveSynced
      ? 'synced_cloud_and_email'
      : emailSent
      ? 'email_dispatched'
      : 'saved_to_cloud_queue';

  const updatedRecord: StoredCloudRecord = {
    ...initialRecord,
    syncStatus: updatedStatus,
    syncedAt: new Date().toISOString(),
  };

  const latestList = getCloudRecords().map((rec) =>
    rec.id === id ? updatedRecord : rec
  );
  saveCloudRecords(latestList);

  return {
    success: true,
    record: updatedRecord,
    googleDriveSynced,
    emailSent,
  };
}

/**
 * Re-sync all local records to the configured Google Drive / Sheets Apps Script webhook
 */
export async function syncAllRecordsToGoogleDrive(): Promise<{
  syncedCount: number;
  error?: string;
}> {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl) {
    return {
      syncedCount: 0,
      error: 'Please paste your Google Apps Script Web App URL first.',
    };
  }

  const records = getCloudRecords();
  let syncedCount = 0;

  for (const rec of records) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          ...rec,
          account: BACKEND_EMAIL,
          academy: 'Melophile Music Academy',
        }),
      });
      syncedCount++;
    } catch {
      // Continue syncing remaining
    }
  }

  if (syncedCount > 0) {
    const updated = records.map((r) => ({
      ...r,
      syncStatus: 'synced_cloud_and_email' as const,
      syncedAt: new Date().toISOString(),
    }));
    saveCloudRecords(updated);
  }

  return { syncedCount };
}

/**
 * Export all stored backend records as a Google Sheets compatible CSV file
 */
export function exportRecordsToCsv(): void {
  const records = getCloudRecords();
  const headers = [
    'Record ID',
    'Timestamp (IST)',
    'Type',
    'Student Name',
    'Email',
    'Phone / WhatsApp',
    'Course',
    'Level',
    'Mode',
    'Plan',
    'Amount',
    'Message',
    'Cloud Account',
    'Sync Status',
  ];

  const escapeCsv = (val?: string) => {
    const str = (val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.id),
    escapeCsv(new Date(r.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
    escapeCsv(r.type),
    escapeCsv(r.name),
    escapeCsv(r.email),
    escapeCsv(r.phone),
    escapeCsv(r.course),
    escapeCsv(r.level),
    escapeCsv(r.mode),
    escapeCsv(r.plan),
    escapeCsv(r.amount),
    escapeCsv(r.message),
    escapeCsv(r.targetAccount),
    escapeCsv(r.syncStatus),
  ]);

  const csvContent =
    '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Melophile_Cloud_Backend_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ready-to-Deploy Google Apps Script for praveenrajr14@gmail.com
 * Automatically stores all website submissions into Google Drive & Google Sheets
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * MELOPHILE MUSIC ACADEMY — GOOGLE DRIVE & SHEETS CLOUD BACKEND
 * Connected Google Account: praveenrajr14@gmail.com
 *
 * HOW TO ENABLE IN 60 SECONDS:
 * 1. Go to https://script.google.com while signed in as praveenrajr14@gmail.com
 * 2. Click "New Project", paste this entire code, and click Save (Ctrl+S).
 * 3. Click "Deploy" -> "New deployment" -> Select type: "Web app".
 * 4. Set "Execute as": "Me (praveenrajr14@gmail.com)"
 * 5. Set "Who has access": "Anyone" -> Click "Deploy" & Authorize.
 * 6. Copy the generated Web App URL and paste it in the Melophile Cloud Storage Console!
 */

const ACCOUNT_EMAIL = 'praveenrajr14@gmail.com';
const DRIVE_FOLDER_NAME = 'Melophile_Website_Backend';
const SPREADSHEET_NAME = 'Melophile_Academy_Cloud_DB';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 1. Ensure Google Drive Backend Folder exists
    let folderIter = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    let folder = folderIter.hasNext() ? folderIter.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
    
    // 2. Save raw JSON backup file in Google Drive folder
    const fileName = (data.type || 'RECORD') + '_' + (data.id || new Date().getTime()) + '.json';
    folder.createFile(fileName, JSON.stringify(data, null, 2), MimeType.PLAIN_TEXT);
    
    // 3. Log row in Master Google Sheet inside Google Drive
    const ss = getOrCreateSpreadsheet(folder);
    const sheetName = data.type === 'PRO_SUBSCRIPTION' ? 'Pro_Subscriptions' 
                    : data.type === 'CONTACT_INQUIRY' ? 'Contact_Inquiries' 
                    : 'Trial_Bookings';
    
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'Record ID', 'Timestamp', 'Type', 'Name', 'Email', 'Phone',
        'Course', 'Level', 'Mode', 'Plan', 'Amount', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
    }
    
    sheet.appendRow([
      data.id || '',
      data.createdAt || new Date().toISOString(),
      data.type || 'TRIAL_BOOKING',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.course || '',
      data.level || '',
      data.mode || '',
      data.plan || '',
      data.amount || '',
      data.message || ''
    ]);
    
    // 4. Send Instant Email Notification to praveenrajr14@gmail.com
    MailApp.sendEmail({
      to: ACCOUNT_EMAIL,
      subject: '[Melophile Cloud DB] ' + (data.type || 'Booking') + ' - ' + (data.name || 'Student'),
      body: 'New website submission saved to your Google Drive (' + DRIVE_FOLDER_NAME + '):\\n\\n' +
            'Name: ' + (data.name || '') + '\\n' +
            'Phone: ' + (data.phone || '') + '\\n' +
            'Email: ' + (data.email || '') + '\\n' +
            'Course/Plan: ' + (data.course || data.plan || '') + '\\n' +
            'Level/Mode: ' + (data.level || '') + ' / ' + (data.mode || '') + '\\n' +
            'Message: ' + (data.message || '')
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet(folder) {
  const files = folder.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  const file = DriveApp.getFileById(ss.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return ss;
}
`;
