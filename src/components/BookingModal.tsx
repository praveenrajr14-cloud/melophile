import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audioSynth';
import { X, Sparkles, Send, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedCourse = 'Keyboard & Piano (Comprehensive)',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: selectedCourse,
    level: 'Complete Beginner',
    mode: 'In-Studio (Offline) — Parassala, TVM',
    message: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick(850);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#c5a880', '#e2d3be', '#f5f4f0', '#ffffff'],
      });
    } catch {
      // Ignored
    }

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white border border-[#eae6de] p-6 sm:p-8 shadow-2xl text-[#141518] animate-fadeIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Accent Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#b89562]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f5f3ef] hover:bg-[#ede8e0] text-[#5c5f6a] hover:text-[#141518] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f4efe6] border-2 border-[#9e7a4b] text-[#9e7a4b] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-[#141518]">
              Trial Lesson Scheduled!
            </h3>
            <p className="text-[#5c5f6a] text-sm leading-relaxed max-w-sm mx-auto">
              We look forward to welcoming you, <strong className="text-[#141518]">{formData.name}</strong>. Instructor Praveen Raj R will contact you to confirm the time slot.
            </p>
            <div className="p-3.5 bg-[#f5f3ef] border border-[#e2ded5] rounded-xl text-xs text-[#8a6839] text-left space-y-1.5 font-mono">
              <div>• Course: {formData.course}</div>
              <div>• Mode: {formData.mode}</div>
              <div>• Instructor: Praveen Raj R (10+ Yrs Exp)</div>
              <div>• Location: Parassala | TVM (or Online HD)</div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-md bg-[#f4efe6] text-[#9e7a4b]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#9e7a4b]">
                Free 30-Minute Trial Session
              </span>
            </div>
            <h3 className="text-2xl font-serif text-[#141518] tracking-tight mb-1">
              Mentorship with Praveen Raj R
            </h3>
            <p className="text-xs text-[#5c5f6a] mb-6">
              Discover your musical potential with 1-on-1 guidance at Melophile Music Academy.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Rahul Nair"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm placeholder-stone-400 focus:outline-none focus:border-[#9e7a4b] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Instrument / Course
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm focus:outline-none focus:border-[#9e7a4b] focus:bg-white"
                  >
                    <option value="Keyboard & Piano (Comprehensive)">Keyboard & Piano (Comprehensive)</option>
                    <option value="Classical Piano">Western Classical Piano</option>
                    <option value="Electronic Keyboard Mastery">Electronic Keyboard Mastery</option>
                    <option value="Music Theory & Notation">Music Theory & Notation</option>
                    <option value="Young Melophiles (Ages 5-12)">Young Melophiles (Ages 5-12)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5c5f6a] uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({ ...formData, mode: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#fcfbfa] border border-[#dcd7ce] text-[#141518] text-sm focus:outline-none focus:border-[#9e7a4b] focus:bg-white"
                  >
                    <option value="In-Studio (Offline) — Parassala, TVM">In-Studio (Parassala, TVM)</option>
                    <option value="Live Online (HD Audio) — Worldwide">Live Online (HD Audio)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                Schedule Free Trial Lesson
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#eae6de]"></div>
                <span className="flex-shrink mx-2 text-[10px] text-[#5c5f6a] uppercase tracking-wider">or instant response</span>
                <div className="flex-grow border-t border-[#eae6de]"></div>
              </div>

              <a
                href="https://wa.me/917356146076?text=Hi%20Praveen%20Raj%20R,%20I%20would%20like%20to%20schedule%20a%20free%20trial%20lesson%20at%20Melophile%20Music%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playClick(750)}
                className="w-full py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-emerald-800 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp (+91 7356146076)</span>
              </a>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


