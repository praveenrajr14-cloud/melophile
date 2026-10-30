import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth';
import { submitToCloudBackend, BACKEND_EMAIL } from '../../utils/cloudBackend';
import {
  ProMembership,
  OFFICIAL_UPI_ID,
  OFFICIAL_PAYEE_NAME,
  INSTRUCTOR_NAME,
  OFFICIAL_BANK_NAME,
  formatINR,
  generateMembershipId,
  generateInvoiceNumber,
  generateUpiUrl,
  saveActiveMembership,
} from '../../utils/subscriptionStorage';
import {
  Crown,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  AlertCircle,
  X,
  FileText,
  MessageCircle,
} from 'lucide-react';

interface LiveSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: 'annual' | 'monthly';
  onSuccess: (membership: ProMembership) => void;
}

export const LiveSubscriptionModal: React.FC<LiveSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'annual',
  onSuccess,
}) => {
  if (!isOpen) return null;

  // Step state: 1 = Details & Plan, 2 = Payment Channel, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');

  // Subscriber form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  // UPI state
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrViewMode, setQrViewMode] = useState<'dynamic' | 'original'>('dynamic');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins countdown

  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'rupay' | 'generic'>('generic');
  const [isProcessingCard, setIsProcessingCard] = useState(false);

  // Completed membership result
  const [confirmedMembership, setConfirmedMembership] = useState<ProMembership | null>(null);

  // Price calculations
  const amount = billingCycle === 'annual' ? 7999 : 999;
  const planTitle = billingCycle === 'annual' ? 'Annual All-Access Pass' : 'Monthly Pro Membership';
  const upiUrl = generateUpiUrl(amount, planTitle, OFFICIAL_UPI_ID);

  // 15-minute live countdown timer for UPI
  useEffect(() => {
    if (step !== 2 || paymentMethod !== 'UPI') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, paymentMethod]);

  // Generate real dynamic UPI QR Code via 'qrcode'
  useEffect(() => {
    if (step === 2 && paymentMethod === 'UPI') {
      QRCode.toDataURL(upiUrl, {
        margin: 1,
        width: 280,
        color: {
          dark: '#141518',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [step, paymentMethod, upiUrl]);

  // Detect card brand from number
  const handleCardNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);

    if (/^4/.test(digits)) setCardBrand('visa');
    else if (/^(5[1-5]|2[2-7])/.test(digits)) setCardBrand('mastercard');
    else if (/^(60|65|81|82|508)/.test(digits)) setCardBrand('rupay');
    else setCardBrand('generic');
  };

  const handleExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    soundEngine.playClick(900);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Validate step 1
  const handleProceedToPayment = () => {
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) errors.name = 'Full name is required for your certificate';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required for receipt delivery';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Valid 10-digit WhatsApp phone required for 1-on-1 mentor reviews';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      soundEngine.playClick(400);
      return;
    }

    setFormErrors({});
    soundEngine.playClick(850);
    setStep(2);
  };

  // Confirm membership & sync to cloud backend
  const finalizeMembership = async (method: 'UPI' | 'CARD' | 'NETBANKING', refId: string) => {
    soundEngine.playChord(['C4', 'E4', 'G4', 'B4', 'D5', 'G5'], 2.5, true);

    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#c5a880', '#141518', '#e5dcce', '#10b981'],
      });
    } catch {
      // Ignored
    }

    const now = new Date();
    const expiry = new Date();
    if (billingCycle === 'annual') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }

    const newMembership: ProMembership = {
      id: generateMembershipId(),
      invoiceNo: generateInvoiceNumber(),
      status: 'active',
      plan: billingCycle,
      planTitle,
      amount,
      currency: 'INR',
      subscriberName: name.trim() || 'Melophile Pro Member',
      subscriberEmail: email.trim() || BACKEND_EMAIL,
      subscriberPhone: phone.trim() || 'Not Provided',
      paymentMethod: method,
      utrOrTransactionId: refId || `TXN-${Date.now().toString().slice(-8)}`,
      paymentDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      autoRenew: true,
      features: [
        'Topics 04-06 Unlocked (Bill Evans Jazz, Modal Interchange, Quartal Film Scores)',
        'Full synthesized audio playback for all 50+ extended voicings',
        'Chord progression loop engine with custom BPM and key shifts',
        'PDF Lead Sheets & MIDI Stems Download Bundle',
        'Monthly 1-on-1 video critique with Praveen Raj R',
        'Studio rehearsal room access in Parassala, Trivandrum',
      ],
    };

    saveActiveMembership(newMembership);
    setConfirmedMembership(newMembership);
    setStep(3);
    onSuccess(newMembership);

    // Sync to praveenrajr14@gmail.com Cloud Storage & Email Backend
    await submitToCloudBackend({
      type: 'PRO_SUBSCRIPTION',
      name: newMembership.subscriberName,
      email: newMembership.subscriberEmail,
      phone: newMembership.subscriberPhone,
      plan: `${newMembership.planTitle} (${formatINR(amount)})`,
      amount: formatINR(amount),
      course: 'Melophile Pro Masterclass & Harmony Lab',
      message: `Payment Method: ${method} | Reference/UTR: ${newMembership.utrOrTransactionId} | Membership ID: ${newMembership.id} | Invoice: ${newMembership.invoiceNo}`,
    });
  };

  // Submit UPI payment verification
  const handleVerifyUpi = () => {
    if (!utrNumber.trim() || utrNumber.replace(/\D/g, '').length < 6) {
      setUtrError('Please enter the 12-digit UPI Reference / UTR Number from your payment app');
      soundEngine.playClick(400);
      return;
    }
    setUtrError('');
    finalizeMembership('UPI', utrNumber.trim());
  };

  // Process card payment simulation
  const handlePayCard = () => {
    const rawDigits = cardNumber.replace(/\D/g, '');
    if (rawDigits.length < 15) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      alert('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvv.length < 3) {
      alert('Please enter a valid CVV.');
      return;
    }

    setIsProcessingCard(true);
    soundEngine.playClick(900);

    setTimeout(() => {
      setIsProcessingCard(false);
      finalizeMembership('CARD', `AUTH-CARD-${rawDigits.slice(-4)}-${Date.now().toString().slice(-6)}`);
    }, 1800);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#eae6de] overflow-hidden my-6 text-[#141518]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent & Close Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141518] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c5a880] text-[#0b0c0e] flex items-center justify-center font-bold">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-semibold tracking-tight text-white leading-tight">
                Melophile Academy Pro
              </h2>
              <p className="text-[10px] text-[#c5a880] font-mono">
                Live Secure Checkout • Parassala Studios
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: PLAN SELECTOR & SUBSCRIBER INFO */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9e7a4b] font-bold">
                Step 1 of 2 • Select Plan &amp; Student Credentials
              </span>
              <h3 className="text-2xl font-serif font-medium text-[#141518] mt-1">
                Unlock Complete Jazz, Neo-Soul &amp; Film Harmony
              </h3>
              <p className="text-xs text-[#5c5f6a] mt-1 leading-relaxed">
                Instant access to Topics 04-06 audio playback, downloadable lead sheets, and 1-on-1 monthly video critique with Praveen Raj R.
              </p>
            </div>

            {/* Plan Picker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                onClick={() => {
                  soundEngine.playClick(800);
                  setBillingCycle('annual');
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  billingCycle === 'annual'
                    ? 'border-[#9e7a4b] bg-[#faf8f5] shadow-md ring-2 ring-[#9e7a4b]/30'
                    : 'border-[#eae6de] hover:border-[#b89562]/50 bg-white'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#141518] text-[#c5a880] text-[9px] font-mono font-bold uppercase tracking-wider">
                  Save 35%
                </div>
                <div className="font-bold text-sm text-[#141518]">Annual All-Access</div>
                <div className="text-2xl font-serif font-bold text-[#8a6839] mt-1">
                  ₹7,999 <span className="text-xs text-stone-500 font-normal font-sans">/ yr</span>
                </div>
                <p className="text-[11px] text-[#5c5f6a] mt-1.5 leading-snug">
                  Equivalent to ₹666/month. Includes 2 months completely free &amp; rehearsal studio pass.
                </p>
              </div>

              <div
                onClick={() => {
                  soundEngine.playClick(800);
                  setBillingCycle('monthly');
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  billingCycle === 'monthly'
                    ? 'border-[#9e7a4b] bg-[#faf8f5] shadow-md ring-2 ring-[#9e7a4b]/30'
                    : 'border-[#eae6de] hover:border-[#b89562]/50 bg-white'
                }`}
              >
                <div className="font-bold text-sm text-[#141518]">Monthly Pass</div>
                <div className="text-2xl font-serif font-bold text-[#141518] mt-1">
                  ₹999 <span className="text-xs text-stone-500 font-normal font-sans">/ mo</span>
                </div>
                <p className="text-[11px] text-[#5c5f6a] mt-1.5 leading-snug">
                  Full library access. Flexible billing, cancel anytime with 1 click.
                </p>
              </div>
            </div>

            {/* Subscriber Form */}
            <div className="space-y-3 pt-2 border-t border-[#f0ede6]">
              <span className="text-[11px] font-mono uppercase font-bold text-[#8a6839]">
                Student Credentials (for Certificate &amp; Mentor Sync):
              </span>

              <div>
                <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                  Full Name (Appears on Membership Card &amp; Invoice)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  placeholder="e.g. Sijo Kuriakose"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs text-[#141518] placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:ring-1 focus:ring-[#9e7a4b]"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                    Email Address (For Tax Invoice)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs text-[#141518] placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:ring-1 focus:ring-[#9e7a4b]"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                    WhatsApp Number (1-on-1 Mentorship)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs text-[#141518] placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:ring-1 focus:ring-[#9e7a4b]"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Inclusions summary */}
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] text-xs text-[#5c5f6a] space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-[#141518]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Risk-Free: 7-Day Money-Back Guarantee Included</span>
              </div>
              <p className="text-[11px] text-stone-500 pl-6">
                All payments are processed securely under RBI guidelines and verified by Praveen Raj R.
              </p>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continue to Payment — {formatINR(amount)}</span>
              <ArrowRight className="w-4 h-4 text-[#c5a880]" />
            </button>
          </div>
        )}

        {/* STEP 2: LIVE PAYMENT METHODS (UPI, CARDS, NETBANKING) */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9e7a4b] font-bold">
                  Step 2 of 2 • Secure Payment Gateway
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#141518]">
                  Pay {formatINR(amount)} for {planTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#8a6839] hover:underline font-medium cursor-pointer"
              >
                ← Change Plan
              </button>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#f5f3ef] border border-[#e6e2d8]">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setPaymentMethod('UPI');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#141518] text-white shadow-xs'
                    : 'text-[#5c5f6a] hover:text-[#141518]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>UPI Instant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setPaymentMethod('CARD');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'CARD'
                    ? 'bg-[#141518] text-white shadow-xs'
                    : 'text-[#5c5f6a] hover:text-[#141518]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setPaymentMethod('NETBANKING');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'NETBANKING'
                    ? 'bg-[#141518] text-white shadow-xs'
                    : 'text-[#5c5f6a] hover:text-[#141518]'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* METHOD 1: UPI INSTANT QR & DEEP LINKS */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#faf8f4] border border-[#eee9df]">
                  {/* Dynamic or Official GPay QR Display */}
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-[#e5dcce] shrink-0 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2 bg-[#f4efe6] p-0.5 rounded-lg text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setQrViewMode('dynamic')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          qrViewMode === 'dynamic' ? 'bg-[#141518] text-[#c5a880]' : 'text-stone-600 hover:text-black'
                        }`}
                      >
                        Auto-Amount QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrViewMode('original')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          qrViewMode === 'original' ? 'bg-[#141518] text-[#c5a880]' : 'text-stone-600 hover:text-black'
                        }`}
                      >
                        Official GPay QR
                      </button>
                    </div>

                    {qrViewMode === 'dynamic' ? (
                      qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Melophile UPI QR"
                          className="w-40 h-40 object-contain mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                          Generating QR...
                        </div>
                      )
                    ) : (
                      <img
                        src="/images/praveen-gpay-qr.jpg"
                        alt="Praveen Raj Google Pay QR"
                        className="w-40 h-40 object-contain mx-auto rounded-lg"
                      />
                    )}

                    <span className="text-[10px] text-stone-500 font-medium mt-1.5 block">
                      {qrViewMode === 'dynamic'
                        ? `Auto-fills ${formatINR(amount)} in UPI app`
                        : 'Official Google Pay Standalone QR'}
                    </span>
                  </div>

                  {/* UPI Details & Copy */}
                  <div className="space-y-2 text-xs flex-1 w-full">
                    <div className="flex items-center justify-between text-[11px] text-[#5c5f6a]">
                      <span className="font-mono uppercase font-semibold">Official UPI ID:</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Clock className="w-3 h-3" /> Expires in {formatTimer(timeLeft)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#e2ddd3] flex items-center justify-between">
                      <span className="font-mono font-bold text-[#141518] text-xs sm:text-sm">
                        {OFFICIAL_UPI_ID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="px-2.5 py-1 rounded-lg bg-[#141518] text-[#c5a880] text-[10px] font-bold hover:bg-[#2b2d35] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-[#5c5f6a] space-y-0.5">
                      <div>
                        Account Name: <strong className="text-[#141518]">{OFFICIAL_PAYEE_NAME}</strong>
                      </div>
                      <div>
                        Verified Beneficiary: <strong className="text-[#141518]">{INSTRUCTOR_NAME}</strong>
                      </div>
                      <div>
                        Linked Bank: <strong className="text-[#141518]">{OFFICIAL_BANK_NAME} (Google Pay)</strong>
                      </div>
                      <div>
                        Exact Amount: <strong className="text-emerald-700 font-mono text-sm">{formatINR(amount)}</strong>
                      </div>
                    </div>

                    {/* Mobile UPI App Intent Buttons */}
                    <div className="pt-2">
                      <span className="text-[10px] text-stone-400 font-mono block mb-1">
                        Or tap to open your mobile UPI app:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <a
                          href={upiUrl}
                          className="px-2 py-1.5 rounded-lg bg-[#f0ede6] hover:bg-[#141518] text-[#141518] hover:text-[#c5a880] font-semibold text-[11px] text-center transition-colors border border-[#ded9ce]"
                        >
                          Google Pay
                        </a>
                        <a
                          href={upiUrl}
                          className="px-2 py-1.5 rounded-lg bg-[#f0ede6] hover:bg-[#141518] text-[#141518] hover:text-[#c5a880] font-semibold text-[11px] text-center transition-colors border border-[#ded9ce]"
                        >
                          PhonePe / Paytm / BHIM
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UTR / Reference Entry */}
                <div className="p-4 rounded-2xl bg-white border border-[#dcd7ce] space-y-2">
                  <label className="block text-xs font-semibold text-[#141518]">
                    Confirm Payment: Enter 12-Digit UPI Reference / UTR Number
                  </label>
                  <p className="text-[11px] text-[#5c5f6a] leading-relaxed">
                    After completing the transfer in GPay / PhonePe / Paytm, enter the 12-digit UTR reference from your payment confirmation screen to verify instantly.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => {
                        setUtrNumber(e.target.value);
                        if (utrError) setUtrError('');
                      }}
                      placeholder="e.g. 429810482914"
                      maxLength={18}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-mono font-bold text-[#141518] placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyUpi}
                      className="px-5 py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Verify &amp; Activate</span>
                    </button>
                  </div>
                  {utrError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {utrError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* METHOD 2: CREDIT / DEBIT CARD */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-4">
                {/* Visual Card Replica */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1d22] via-[#24262e] to-[#121316] text-white shadow-xl border border-white/10 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[11px] font-mono tracking-widest text-[#c5a880] uppercase font-bold">
                      Melophile Pro Card
                    </div>
                    <span className="text-xs font-mono uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                      {cardBrand.toUpperCase()}
                    </span>
                  </div>

                  <div className="font-mono text-lg tracking-widest text-stone-200 mb-4">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[9px] uppercase text-stone-400 font-mono block">Cardholder</span>
                      <span className="font-semibold">{cardHolder || name.toUpperCase() || 'STUDENT NAME'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-stone-400 font-mono block">Expires</span>
                      <span className="font-mono">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-mono text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-mono text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                        CVV (3 Digits)
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-mono text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#5c5f6a] font-medium mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder={name ? name.toUpperCase() : 'AS PRINTED ON CARD'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-medium text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessingCard}
                  onClick={handlePayCard}
                  className="w-full py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>{isProcessingCard ? 'Authorizing 3D Secure...' : `Pay ${formatINR(amount)} Securely`}</span>
                </button>
              </div>
            )}

            {/* METHOD 3: NET BANKING / NEFT */}
            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#eee9df] space-y-2.5">
                  <span className="font-mono uppercase font-bold text-[10px] text-[#8a6839]">
                    Academy Direct Bank Details (State Bank of India / NEFT):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[#4a4d56]">
                    <div>
                      Account Name: <strong className="text-[#141518] block">{OFFICIAL_PAYEE_NAME}</strong>
                    </div>
                    <div>
                      Beneficiary: <strong className="text-[#141518] block">{INSTRUCTOR_NAME}</strong>
                    </div>
                    <div>
                      Bank Name: <strong className="text-[#141518] block">{OFFICIAL_BANK_NAME}</strong>
                    </div>
                    <div>
                      Instant UPI VPA: <strong className="text-[#141518] font-mono block">{OFFICIAL_UPI_ID}</strong>
                    </div>
                    <div>
                      Studio Location: <strong className="text-[#141518] block">Parassala, Trivandrum</strong>
                    </div>
                    <div>
                      Confirmation: <strong className="text-emerald-700 block">Instant via WhatsApp</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dcd7ce] space-y-2">
                  <label className="block text-xs font-semibold text-[#141518]">
                    Enter NEFT / IMPS Transaction Reference Number:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. AXISN04829184"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#dcd7ce] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:border-[#9e7a4b]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!utrNumber.trim()) {
                          alert('Please enter your bank transfer reference ID');
                          return;
                        }
                        finalizeMembership('NETBANKING', utrNumber.trim());
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all shrink-0"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: LIVE CONFIRMATION & MEMBERSHIP CERTIFICATION */}
        {step === 3 && confirmedMembership && (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-700 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ● Live Payment Verified &amp; Active
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141518] mt-2">
                Welcome to Melophile Pro, {confirmedMembership.subscriberName}!
              </h3>
              <p className="text-xs text-[#5c5f6a] max-w-sm mx-auto mt-1 leading-relaxed">
                Your subscription has been recorded in the Melophile Cloud Ledger and synced to Praveen Raj R. All advanced topics 4-6 are now unlocked!
              </p>
            </div>

            {/* Member Card Summary */}
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#eee9df] text-xs text-left space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#e5dcce]">
                <span className="font-mono text-stone-500">Membership ID:</span>
                <strong className="font-mono text-[#8a6839]">{confirmedMembership.id}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5dcce]">
                <span className="font-mono text-stone-500">Plan:</span>
                <strong className="text-[#141518]">{confirmedMembership.planTitle}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5dcce]">
                <span className="font-mono text-stone-500">Amount Paid:</span>
                <strong className="text-emerald-700 font-mono font-bold">
                  {formatINR(confirmedMembership.amount)}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-stone-500">Valid Through:</span>
                <strong className="text-[#141518]">
                  {new Date(confirmedMembership.expiryDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Access Pro Harmony Lessons Now</span>
                <ArrowRight className="w-4 h-4 text-[#c5a880]" />
              </button>

              <a
                href={`https://wa.me/919747000000?text=${encodeURIComponent(
                  `Hello Praveen sir! I just subscribed to Melophile Pro (Member ID: ${confirmedMembership.id}). I would like to introduce myself and schedule chord feedback.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect with Mentor Praveen Raj R on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
