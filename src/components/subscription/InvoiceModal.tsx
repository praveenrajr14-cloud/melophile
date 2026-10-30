import React from 'react';
import { ProMembership, formatINR, OFFICIAL_PAYEE_NAME } from '../../utils/subscriptionStorage';
import { BACKEND_EMAIL } from '../../utils/cloudBackend';
import {
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  Download,
  Building,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership: ProMembership | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  membership,
}) => {
  if (!isOpen || !membership) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(membership.paymentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedExpiry = new Date(membership.expiryDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate base vs tax breakdown (18% GST inclusive)
  const total = membership.amount;
  const baseAmount = Math.round((total / 1.18) * 100) / 100;
  const taxAmount = Math.round((total - baseAmount) * 100) / 100;
  const halfTax = Math.round((taxAmount / 2) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#eae6de] overflow-hidden my-6 text-[#141518]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f8f6f0] border-b border-[#e8e2d5] print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8a6839]" />
            <span className="text-xs font-semibold text-[#8a6839] uppercase tracking-wider">
              Official Tax Invoice &amp; Payment Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Body */}
        <div id="printable-invoice" className="p-6 sm:p-10 space-y-6">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#eae6de]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#141518] text-[#c5a880] flex items-center justify-center font-bold text-lg font-serif">
                  M
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#141518] leading-tight">
                    MELOPHILE MUSIC ACADEMY
                  </h1>
                  <span className="text-[11px] font-mono text-[#8a6839] font-medium tracking-wide">
                    INSTITUTE OF CONTEMPORARY PIANO &amp; HARMONIC STUDIES
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#5c5f6a] max-w-sm leading-relaxed mt-2">
                Melophile Studios, TC 14/892, Main Road, Parassala, Thiruvananthapuram, Kerala — 695502
              </p>
              <p className="text-xs text-[#5c5f6a] mt-0.5 font-mono">
                Govt Reg: KL-TVM-EDU/2024/9842 • Email: {BACKEND_EMAIL}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Payment Completed
              </span>
              <div className="text-xs font-mono text-stone-500 mt-2">
                Invoice No: <strong className="text-[#141518] font-bold">{membership.invoiceNo}</strong>
              </div>
              <div className="text-xs font-mono text-stone-500">
                Date: <strong className="text-[#141518]">{formattedDate}</strong>
              </div>
              <div className="text-xs font-mono text-stone-500">
                Membership ID: <strong className="text-[#8a6839]">{membership.id}</strong>
              </div>
            </div>
          </div>

          {/* Student & Payment Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#faf8f4] border border-[#eee9df] text-xs">
            <div>
              <span className="font-mono uppercase font-bold text-[10px] text-[#8a6839] tracking-wider">
                Billed To (Student / Subscriber):
              </span>
              <h3 className="text-sm font-bold text-[#141518] mt-1">
                {membership.subscriberName}
              </h3>
              <p className="text-[#5c5f6a] mt-0.5">{membership.subscriberEmail}</p>
              <p className="text-[#5c5f6a] font-mono mt-0.5">{membership.subscriberPhone}</p>
            </div>

            <div>
              <span className="font-mono uppercase font-bold text-[10px] text-[#8a6839] tracking-wider">
                Payment &amp; Transaction Details:
              </span>
              <div className="space-y-1 mt-1 text-[#4a4d56]">
                <div>
                  Method: <strong className="text-[#141518] font-mono">{membership.paymentMethod}</strong>
                </div>
                <div>
                  Transaction Ref / UTR:{' '}
                  <strong className="text-[#141518] font-mono">{membership.utrOrTransactionId}</strong>
                </div>
                <div>
                  Subscription Validity:{' '}
                  <strong className="text-emerald-700 font-medium">Until {formattedExpiry}</strong>
                </div>
                <div>
                  Status: <strong className="text-emerald-700 font-bold uppercase">{membership.status}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#eae6de] text-stone-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 font-semibold">Service Description</th>
                  <th className="py-2.5 font-semibold text-center">SAC Code</th>
                  <th className="py-2.5 font-semibold text-center">Duration</th>
                  <th className="py-2.5 font-semibold text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ede4]">
                <tr>
                  <td className="py-3">
                    <div className="font-bold text-[#141518] text-sm">{membership.planTitle}</div>
                    <div className="text-[11px] text-[#5c5f6a] mt-0.5">
                      Full access to Topics 04-06 (Bill Evans Jazz, Modal Interchange, Quartal Film Scores),
                      Interactive Chord Transposer, Progression Loops, PDF Lead Sheets &amp; 1-on-1 Mentorship.
                    </div>
                  </td>
                  <td className="py-3 text-center font-mono text-stone-500">999293</td>
                  <td className="py-3 text-center font-mono text-[#141518]">
                    {membership.plan === 'annual' ? '12 Months' : '1 Month'}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-[#141518]">
                    {formatINR(baseAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Total */}
          <div className="flex justify-end pt-2 border-t border-[#eae6de]">
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-[#5c5f6a]">
                <span>Gross Tuition:</span>
                <span className="font-mono">{formatINR(baseAmount)}</span>
              </div>
              <div className="flex justify-between text-[#5c5f6a]">
                <span>CGST (9%):</span>
                <span className="font-mono">{formatINR(halfTax)}</span>
              </div>
              <div className="flex justify-between text-[#5c5f6a]">
                <span>SGST (9%):</span>
                <span className="font-mono">{formatINR(halfTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#141518] pt-2 border-t border-[#e2ddd3]">
                <span>Total Amount Paid:</span>
                <span className="text-[#8a6839] font-mono text-base">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          {/* Signoff & Seal */}
          <div className="pt-6 border-t border-[#eae6de] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#141518]">
                  Verified Digital Academic Receipt
                </p>
                <p className="text-[10px] text-[#5c5f6a]">
                  Eligible for educational tax deduction • System-generated on {formattedDate}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-base text-[#141518] font-bold">
                Praveen Raj R
              </div>
              <p className="text-[10px] text-[#8a6839] font-mono uppercase tracking-wider font-semibold">
                Director &amp; Chief Academic Mentor
              </p>
              <p className="text-[9px] text-stone-400 font-mono">
                Melophile Music Academy (Parassala, TVM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
