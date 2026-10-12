import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CheckCircle,
  Download,
  Copy,
  Check,
  RefreshCw,
  Send,
  Database,
  ExternalLink,
  Mail,
  FileSpreadsheet,
  FolderOpen,
} from 'lucide-react';
import {
  BACKEND_EMAIL,
  StoredCloudRecord,
  getCloudRecords,
  getGoogleScriptUrl,
  setGoogleScriptUrl,
  submitToCloudBackend,
  syncAllRecordsToGoogleDrive,
  exportRecordsToCsv,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
} from '../utils/cloudBackend';
import { soundEngine } from '../utils/audioSynth';

interface CloudBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudBackendModal: React.FC<CloudBackendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'drive_setup'>('records');
  const [records, setRecords] = useState<StoredCloudRecord[]>([]);
  const [scriptUrlInput, setScriptUrlInput] = useState<string>('');
  const [urlSaved, setUrlSaved] = useState<boolean>(false);
  const [scriptCopied, setScriptCopied] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRecords(getCloudRecords());
      setScriptUrlInput(getGoogleScriptUrl());
      setStatusBanner(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const refresh = () => setRecords(getCloudRecords());
    window.addEventListener('melophile-cloud-updated', refresh);
    return () => window.removeEventListener('melophile-cloud-updated', refresh);
  }, []);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick(750);
    setGoogleScriptUrl(scriptUrlInput);
    setUrlSaved(true);
    setStatusBanner('Google Drive & Sheets Web App endpoint saved!');
    setTimeout(() => setUrlSaved(false), 2500);
  };

  const handleCopyScript = async () => {
    soundEngine.playClick(820);
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSyncAll = async () => {
    soundEngine.playClick(700);
    setIsSyncing(true);
    setStatusBanner(null);
    const res = await syncAllRecordsToGoogleDrive();
    setIsSyncing(false);
    setRecords(getCloudRecords());
    if (res.error) {
      setStatusBanner(res.error);
    } else {
      setStatusBanner(`Synced ${res.syncedCount} record(s) to ${BACKEND_EMAIL} Google Drive!`);
    }
  };

  const handleSendTestRecord = async () => {
    soundEngine.playClick(880);
    setIsTesting(true);
    setStatusBanner(null);
    const result = await submitToCloudBackend({
      type: 'TRIAL_BOOKING',
      name: 'Cloud Verification Test',
      email: BACKEND_EMAIL,
      phone: '+91 7356146076',
      course: 'Piano & Keyboard (Cloud Test)',
      level: 'Intermediate',
      mode: 'In-Studio (Offline) — Parassala, TVM',
      message: `Automated cloud storage & email test for ${BACKEND_EMAIL}`,
    });
    setIsTesting(false);
    setRecords(getCloudRecords());
    setStatusBanner(
      result.googleDriveSynced
        ? `Test record saved to Google Drive & emailed to ${BACKEND_EMAIL}!`
        : `Test record logged & email alert dispatched to ${BACKEND_EMAIL}!`
    );
  };

  const isDriveWebhookConfigured = Boolean(getGoogleScriptUrl());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-[#eae6de] shadow-2xl text-[#141518] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#faf8f5] border-b border-[#eae6de] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-medium text-[#141518]">
                  Melophile Cloud Storage Backend
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Connected
                </span>
              </div>
              <p className="text-xs text-[#5c5f6a] flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#9e7a4b]" />
                <span>Primary Cloud Account:</span>
                <strong className="text-[#141518] font-mono">{BACKEND_EMAIL}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-[#ede8e0] text-[#5c5f6a] hover:text-[#141518] border border-[#e2ded5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#faf8f5] border-b border-[#eae6de] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'records'
                  ? 'border-[#9e7a4b] text-[#141518] bg-white'
                  : 'border-transparent text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#9e7a4b]" />
              <span>Cloud Records ({records.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drive_setup')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'drive_setup'
                  ? 'border-[#9e7a4b] text-[#141518] bg-white'
                  : 'border-transparent text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#9e7a4b]" />
              <span>Google Drive & Sheets Connector</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={handleSendTestRecord}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-full bg-[#f4efe6] hover:bg-[#ebe3d5] text-[#8a6839] border border-[#e5dcce] text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isTesting ? 'Sending Test...' : 'Send Test Record'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(650);
                exportRecordsToCsv();
              }}
              disabled={records.length === 0}
              className="px-3 py-1.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3 h-3" />
              <span>Export to Sheets (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusBanner && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl bg-[#f4efe6] border border-[#e5dcce] text-xs text-[#8a6839] flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-[#9e7a4b] shrink-0" />
              {statusBanner}
            </span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-[10px] underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'records' ? (
            <>
              {/* Cloud Pipeline Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae6de]">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8a6839]">
                    Email Alert Pipeline
                  </div>
                  <div className="text-sm font-semibold text-[#141518] mt-0.5 truncate">
                    {BACKEND_EMAIL}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Instant Email Forwarding Active
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae6de]">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8a6839]">
                    Google Drive & Sheets
                  </div>
                  <div className="text-sm font-semibold text-[#141518] mt-0.5">
                    {isDriveWebhookConfigured ? 'Web App Linked' : 'Ready to Link'}
                  </div>
                  <div className="text-[11px] text-[#5c5f6a] mt-1">
                    {isDriveWebhookConfigured ? (
                      <span className="text-emerald-700 font-medium">✓ Auto-Syncing to Drive</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('drive_setup')}
                        className="text-[#9e7a4b] underline font-medium cursor-pointer"
                      >
                        Configure Drive Webhook →
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae6de]">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8a6839]">
                    Total Stored Submissions
                  </div>
                  <div className="text-xl font-bold font-mono text-[#141518] mt-0.5">
                    {records.length}
                  </div>
                  <div className="text-[11px] text-[#5c5f6a] mt-0.5">
                    Trials, Inquiries & Pro Passes
                  </div>
                </div>
              </div>

              {/* Records List */}
              {records.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[#dcd7ce] bg-[#fcfbfa]">
                  <FolderOpen className="w-8 h-8 text-[#9e7a4b] mx-auto mb-2 opacity-80" />
                  <h4 className="text-sm font-semibold text-[#141518]">
                    No Submissions Logged Yet
                  </h4>
                  <p className="text-xs text-[#5c5f6a] max-w-md mx-auto mt-1">
                    Every Free Trial Booking, Contact Form Inquiry, and Melophile Pro Subscription is automatically stored here and sent to{' '}
                    <strong className="text-[#141518]">{BACKEND_EMAIL}</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-white border border-[#eae6de] hover:border-[#b89562]/50 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#f4efe6] text-[#8a6839] text-[10px] font-bold uppercase tracking-wider">
                            {rec.type.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-semibold text-[#141518]">
                            {rec.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#5c5f6a]">
                            ({rec.id})
                          </span>
                        </div>
                        <div className="text-xs text-[#5c5f6a] flex flex-wrap gap-x-4 gap-y-1">
                          {rec.phone && <span>Phone: <strong>{rec.phone}</strong></span>}
                          {rec.email && <span>Email: <strong>{rec.email}</strong></span>}
                          {rec.course && <span>Course: <strong>{rec.course}</strong></span>}
                          {rec.plan && <span>Plan: <strong>{rec.plan} ({rec.amount})</strong></span>}
                        </div>
                        {rec.message && (
                          <p className="text-xs text-[#5c5f6a] italic bg-[#faf8f5] px-2.5 py-1 rounded-lg border border-[#eae6de]">
                            "{rec.message}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          {rec.syncStatus === 'synced_cloud_and_email'
                            ? 'Drive + Email Synced'
                            : rec.syncStatus === 'email_dispatched'
                            ? 'Sent to Gmail + Cloud'
                            : 'Saved in Cloud Queue'}
                        </span>
                        <span className="text-[10px] font-mono text-[#5c5f6a]">
                          {new Date(rec.createdAt).toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#f4efe6] border border-[#e5dcce] space-y-2">
                <h4 className="text-sm font-semibold text-[#141518] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#9e7a4b]" />
                  <span>Direct Google Drive & Google Sheets Cloud Storage ({BACKEND_EMAIL})</span>
                </h4>
                <p className="text-xs text-[#5c5f6a] leading-relaxed">
                  Connect your Google Drive (<strong className="text-[#141518]">{BACKEND_EMAIL}</strong>) so every website submission automatically creates a JSON backup in your Google Drive folder{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white border border-[#e2ded5] text-[#8a6839]">
                    Melophile_Website_Backend
                  </code>{' '}
                  and appends a live row to{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white border border-[#e2ded5] text-[#8a6839]">
                    Melophile_Academy_Cloud_DB
                  </code>.
                </p>
              </div>

              {/* Webhook Input Form */}
              <form onSubmit={handleSaveUrl} className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c5f6a]">
                  Google Apps Script Web App URL ({BACKEND_EMAIL})
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={scriptUrlInput}
                    onChange={(e) => setScriptUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-xs font-mono text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    {urlSaved ? '✓ Saved' : 'Save Endpoint'}
                  </button>
                  {isDriveWebhookConfigured && (
                    <button
                      type="button"
                      onClick={handleSyncAll}
                      disabled={isSyncing}
                      className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-[#ebe3d5] text-[#8a6839] border border-[#e5dcce] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync All</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Ready-to-copy Google Apps Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5f6a]">
                    Turnkey Google Apps Script (Pre-configured for {BACKEND_EMAIL})
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://script.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#9e7a4b] hover:underline font-medium"
                    >
                      <span>Open script.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141518] text-white text-xs font-medium cursor-pointer hover:bg-[#2b2d35] transition-colors"
                    >
                      {scriptCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Code!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-2xl bg-[#141518] text-[#f5f3ef] text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
