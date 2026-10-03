import React, { useState } from 'react';
import { WhatsAppIcon } from './SocialIcons';
import { soundEngine } from '../utils/audioSynth';
import { X, MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '917356146076';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20Melophile%20Music%20Academy,%20I%20would%20like%20to%20inquire%20about%20music%20lessons%20and%20book%20a%20free%20trial.`;

  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#eae6de] shadow-xl text-xs text-[#141518] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Chat directly with <strong>Praveen Raj R</strong> (+91 7356146076)
          </span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-600 p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Float Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => soundEngine.playClick(750)}
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Chat on WhatsApp +91 7356146076"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer relative"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />

        {/* Online beacon badge */}
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </span>
      </a>
    </aside>
  );
};
