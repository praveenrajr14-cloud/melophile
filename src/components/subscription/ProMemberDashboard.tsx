import React, { useState } from 'react';
import {
  ProMembership,
  formatINR,
  clearActiveMembership,
  cancelActiveMembership,
} from '../../utils/subscriptionStorage';
import { soundEngine } from '../../utils/audioSynth';
import {
  Crown,
  CheckCircle2,
  FileText,
  MessageCircle,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';

interface ProMemberDashboardProps {
  membership: ProMembership;
  onOpenInvoice?: () => void;
  onJumpToTopic?: (topicId: number) => void;
  onResetMembership?: () => void;
}

export const ProMemberDashboard: React.FC<ProMemberDashboardProps> = ({
  membership,
  onOpenInvoice,
  onJumpToTopic,
  onResetMembership,
}) => {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentMembership, setCurrentMembership] = useState<ProMembership>(membership);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formattedExpiry = new Date(currentMembership.expiryDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedPaymentDate = new Date(currentMembership.paymentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadLeadSheets = () => {
    soundEngine.playClick(900);
    setDownloadSuccess(true);
    // Trigger virtual text/lead sheet download
    const content = `MELOPHILE MUSIC ACADEMY — PRO HARMONY LEAD SHEETS & VOICING GUIDE
Member: ${currentMembership.subscriberName} (${currentMembership.id})
Plan: ${currentMembership.planTitle}
Chief Instructor: Praveen Raj R (Parassala, Trivandrum, Kerala)

============================================================
TOPIC 04: JAZZ VOICINGS & BILL EVANS ROOTLESS 7THS / 9THS
============================================================
1. C Major 7 (Rootless A-Voicing): E4 - G4 - B4 - D5 (3 - 5 - 7 - 9)
2. D Minor 9 (Rootless A-Voicing): F4 - A4 - C5 - E5 (b3 - 5 - b7 - 9)
3. G Dominant 13 (Rootless): F4 - B4 - E5 - A5 (b7 - 3 - 13 - 9)
Master Cadence ii-V-I: Dm9 -> G13 -> Cmaj9

============================================================
TOPIC 05: MODAL INTERCHANGE & CINEMATIC BORROWED CHORDS
============================================================
1. F Minor 6 (iv): F4 - Ab4 - C5 - D5 (Romantic Hans Zimmer Cadence I -> iv -> I)
2. Ab Major 7 (bVI): Ab3 - C4 - Eb4 - G4 (Majestic submediant borrowed from Aeolian)
3. Bb Major (bVII): Bb3 - D4 - F4 (Epic rock/hero cadence bVII -> I)

============================================================
TOPIC 06: TRITONE SUBSTITUTION & QUARTAL HARMONY
============================================================
1. Db 7 (SubV7): Db4 - F4 - Ab4 - B4 (Tritone substitute for G7 resolving to C)
2. Quartal Stack on C: C4 - F4 - Bb4 - Eb5 - Ab5 (Stacked perfect fourths)

============================================================
Official Academy Support & Video Reviews:
WhatsApp: +91 9747 000000 | Email: praveenrajr14@gmail.com
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Melophile_Pro_Lead_Sheets_${currentMembership.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCancelAutoRenew = () => {
    if (confirm('Do you wish to turn off auto-renewal? Your Pro benefits will remain active until ' + formattedExpiry)) {
      const updated = cancelActiveMembership();
      if (updated) setCurrentMembership(updated);
    }
  };

  const handleResetSession = () => {
    if (confirm('Clear local membership to test checkout flow again?')) {
      clearActiveMembership();
      if (onResetMembership) onResetMembership();
    }
  };

  return (
    <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#141518] via-[#1a1b22] to-[#111215] text-white shadow-2xl border border-[#2b2d35] overflow-hidden my-8">
      {/* Luxury glow accent */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a880] text-[#0b0c0e] flex items-center justify-center font-bold shadow-lg">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a880] font-bold">
                  Melophile Academy Pro Portal
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white mt-0.5">
                Welcome Back, {currentMembership.subscriberName}
              </h2>
            </div>
          </div>

          {/* Quick Invoice & WhatsApp Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsInvoiceOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border border-white/10"
            >
              <FileText className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Tax Invoice</span>
            </button>

            <a
              href={`https://wa.me/919747000000?text=${encodeURIComponent(
                `Hi Praveen sir! I'm ${currentMembership.subscriberName} (Pro ID: ${currentMembership.id}). I'd like to schedule my monthly video review for chord transitions.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Mentor Line</span>
            </a>
          </div>
        </div>

        {/* 2-Column Grid: VIP Digital Card (Col 1) + Inclusions & Controls (Col 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* DIGITAL OBSIDIAN & GOLD VIP CARD (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#1d1f27] via-[#242731] to-[#15161b] border border-[#c5a880]/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Holographic gold glare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a880]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#c5a880]/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#c5a880] uppercase font-bold block">
                    Melophile Music Academy
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">
                    Parassala Studios • Trivandrum
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400">
                  Certified Pro Member
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                  {currentMembership.subscriberName}
                </h3>
                <div className="text-xs font-mono text-[#c5a880] tracking-wider font-semibold">
                  {currentMembership.id}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-end justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase font-mono text-stone-400 block">Tier</span>
                <span className="font-semibold text-stone-200">{currentMembership.planTitle}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono text-stone-400 block">Valid Until</span>
                <span className="font-mono text-[#c5a880] font-semibold">{formattedExpiry}</span>
              </div>
            </div>
          </div>

          {/* INCLUSIONS & QUICK ACCESS HUB (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                onClick={() => onJumpToTopic && onJumpToTopic(4)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a880] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Topic 04 • Bill Evans Jazz</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-snug">
                    Rootless A/B voicings, 9th/11th/13th extensions, and jazz ii-V-I cadences.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-stone-400 group-hover:text-white flex items-center gap-1 mt-3">
                  Jump to Lesson →
                </span>
              </div>

              <div
                onClick={() => onJumpToTopic && onJumpToTopic(5)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a880] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Topic 05 • Modal Interchange</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-snug">
                    Minor iv borrowed chords, bVI and bVII heroic Hollywood film score progressions.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-stone-400 group-hover:text-white flex items-center gap-1 mt-3">
                  Jump to Lesson →
                </span>
              </div>

              <div
                onClick={() => onJumpToTopic && onJumpToTopic(6)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a880] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Topic 06 • Quartal Harmony</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-snug">
                    Hans Zimmer fourths, tritone substitutions (SubV7), and modern cinematic tension.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-stone-400 group-hover:text-white flex items-center gap-1 mt-3">
                  Jump to Lesson →
                </span>
              </div>

              <div
                onClick={handleDownloadLeadSheets}
                className="p-4 rounded-2xl bg-[#c5a880]/15 hover:bg-[#c5a880]/25 border border-[#c5a880]/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a880] mb-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>Lead Sheets &amp; Audio Stems</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-snug">
                    Download full chord charts, transcription sheets, and practice stems.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#c5a880] font-semibold flex items-center gap-1 mt-3">
                  {downloadSuccess ? '✓ Downloaded!' : 'Download Bundle (.txt) ↓'}
                </span>
              </div>
            </div>

            {/* Bottom Membership Management Strip */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-400">
                <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>
                  Billed on {formattedPaymentDate} ({formatINR(currentMembership.amount)} via {currentMembership.paymentMethod})
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentMembership.autoRenew ? (
                  <button
                    type="button"
                    onClick={handleCancelAutoRenew}
                    className="text-stone-400 hover:text-stone-200 underline cursor-pointer text-[11px]"
                  >
                    Cancel Auto-Renewal
                  </button>
                ) : (
                  <span className="text-amber-400 text-[11px]">
                    Auto-renewal off (Active until {formattedExpiry})
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetSession}
                  className="text-stone-500 hover:text-stone-300 flex items-center gap-1 text-[10px] cursor-pointer"
                  title="Reset local storage for checkout testing"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        membership={currentMembership}
      />
    </div>
  );
};
