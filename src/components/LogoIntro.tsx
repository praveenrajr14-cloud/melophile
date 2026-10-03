import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';

interface LogoIntroProps {
  onComplete: () => void;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  // stage 0: Backdrop bloom
  // stage 1: Badge reveal & glow
  // stage 2: Piano keys cascading strike (C - E - G - B)
  // stage 3: MELO PHILE typography expansion
  // stage 4: MUSIC ACADEMY tracking spread & tagline
  // stage 5: Final shimmer & dismiss
  const [activeKey, setActiveKey] = useState<number>(-1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dismissing, setDismissing] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Badge reveals
    const t1 = setTimeout(() => {
      setStage(1);
    }, 200);

    // Stage 2: Key cascade sequence
    const t2 = setTimeout(() => {
      setStage(2);
      // Key 1
      setActiveKey(0);
      if (soundEnabled) soundEngine.playNote(261.63, 1.2); // C4

      setTimeout(() => {
        setActiveKey(1);
        if (soundEnabled) soundEngine.playNote(329.63, 1.2); // E4
      }, 220);

      setTimeout(() => {
        setActiveKey(2);
        if (soundEnabled) soundEngine.playNote(392.0, 1.2); // G4
      }, 440);

      setTimeout(() => {
        setActiveKey(3);
        if (soundEnabled) soundEngine.playNote(493.88, 1.6); // B4
      }, 660);

      setTimeout(() => {
        setActiveKey(-1);
      }, 1000);
    }, 600);

    // Stage 3: MELO PHILE letters
    const t3 = setTimeout(() => {
      setStage(3);
    }, 1400);

    // Stage 4: MUSIC ACADEMY tagline spread
    const t4 = setTimeout(() => {
      setStage(4);
    }, 1800);

    // Stage 5: Begin exit transition
    const t5 = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  const handleUserClick = () => {
    if (stage < 2) {
      soundEngine.playChord(['C4', 'E4', 'G4', 'B4'], 1.5, true);
    }
    handleDismiss();
  };

  return (
    <aside
      aria-label="Welcome to Melophile Music Academy"
      onClick={handleUserClick}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0f12] text-white overflow-hidden transition-all duration-700 select-none cursor-pointer ${
        dismissing
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial warm golden sunburst */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#c5a880]/15 via-[#9e7a4b]/05 to-transparent rounded-full blur-[140px] transition-all duration-1000 ${
            stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Skip Button (Top Right) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled((prev) => !prev);
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/10 transition-colors"
          title={soundEnabled ? 'Mute Intro Audio' : 'Enable Intro Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#c5a880]" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-white border border-white/10 transition-all flex items-center gap-1 group"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Central Animated Logo Composition */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer Rounded Charcoal Badge */}
        <div
          className={`relative h-28 sm:h-36 aspect-[2.4/1] bg-[#1a1e24] border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-700 ${
            stage >= 1
              ? 'opacity-100 scale-100 translate-y-0 ring-1 ring-[#c5a880]/30'
              : 'opacity-0 scale-90 translate-y-6'
          }`}
        >
          {/* Subtle badge inner highlight */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Left Side: Animated Piano Keys SVG */}
          <div className="h-full aspect-[1/1] relative flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto drop-shadow-md"
            >
              {/* White Key 1 (C) */}
              <rect
                x="5"
                y="10"
                width="18"
                height="80"
                rx="4"
                fill={activeKey === 0 ? '#f4efe6' : '#F8F9FA'}
                className="transition-all duration-150 origin-top"
                style={{
                  transform:
                    activeKey === 0
                      ? 'scaleY(0.96) translateY(2px)'
                      : 'scaleY(1)',
                  filter:
                    activeKey === 0
                      ? 'drop-shadow(0 0 12px #c5a880)'
                      : 'none',
                }}
              />
              {/* White Key 2 (E) */}
              <rect
                x="29"
                y="10"
                width="18"
                height="80"
                rx="4"
                fill={activeKey === 1 ? '#f4efe6' : '#F8F9FA'}
                className="transition-all duration-150 origin-top"
                style={{
                  transform:
                    activeKey === 1
                      ? 'scaleY(0.96) translateY(2px)'
                      : 'scaleY(1)',
                  filter:
                    activeKey === 1
                      ? 'drop-shadow(0 0 12px #c5a880)'
                      : 'none',
                }}
              />
              {/* White Key 3 (G) */}
              <rect
                x="53"
                y="10"
                width="18"
                height="80"
                rx="4"
                fill={activeKey === 2 ? '#f4efe6' : '#F8F9FA'}
                className="transition-all duration-150 origin-top"
                style={{
                  transform:
                    activeKey === 2
                      ? 'scaleY(0.96) translateY(2px)'
                      : 'scaleY(1)',
                  filter:
                    activeKey === 2
                      ? 'drop-shadow(0 0 12px #c5a880)'
                      : 'none',
                }}
              />
              {/* White Key 4 (B) */}
              <rect
                x="77"
                y="10"
                width="18"
                height="80"
                rx="4"
                fill={activeKey === 3 ? '#f4efe6' : '#F8F9FA'}
                className="transition-all duration-150 origin-top"
                style={{
                  transform:
                    activeKey === 3
                      ? 'scaleY(0.96) translateY(2px)'
                      : 'scaleY(1)',
                  filter:
                    activeKey === 3
                      ? 'drop-shadow(0 0 12px #c5a880)'
                      : 'none',
                }}
              />

              {/* Black keys */}
              <rect
                x="18"
                y="10"
                width="14"
                height="48"
                rx="3"
                fill="#1a1e24"
                stroke="#2a303a"
                strokeWidth="1"
              />
              <rect
                x="42"
                y="10"
                width="14"
                height="48"
                rx="3"
                fill="#1a1e24"
                stroke="#2a303a"
                strokeWidth="1"
              />
              <rect
                x="66"
                y="10"
                width="14"
                height="48"
                rx="3"
                fill="#1a1e24"
                stroke="#2a303a"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Right Side: Animated MELO PHILE Typography */}
          <div className="flex flex-col justify-center leading-[0.88] text-left pr-2 sm:pr-4 overflow-hidden">
            <span
              className={`text-white font-extrabold tracking-wider text-2xl sm:text-4xl font-sans transition-all duration-700 ${
                stage >= 3
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-6'
              }`}
            >
              MELO
            </span>
            <span
              className={`text-white font-extrabold tracking-wider text-2xl sm:text-4xl font-sans transition-all duration-700 delay-100 ${
                stage >= 3
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-6'
              }`}
            >
              PHILE
            </span>
          </div>
        </div>

        {/* Subtitle: MUSIC ACADEMY tracking expansion */}
        <div
          className={`mt-4 font-semibold text-center uppercase transition-all duration-700 ${
            stage >= 4
              ? 'opacity-100 tracking-[0.45em] text-[#c5a880] translate-y-0'
              : 'opacity-0 tracking-[0.2em] text-[#9e7a4b] translate-y-3'
          } text-xs sm:text-base font-sans`}
        >
          MUSIC ACADEMY
        </div>

        {/* Tagline & City Label */}
        <div
          className={`mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-stone-400 font-mono transition-all duration-700 delay-200 ${
            stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="italic font-serif text-[#e5dcce]">The sound of love</span>
          <span>•</span>
          <span>Parassala | TVM</span>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`absolute bottom-8 text-[11px] font-mono text-stone-500 uppercase tracking-widest transition-opacity duration-700 ${
          stage >= 2 ? 'opacity-70' : 'opacity-0'
        }`}
      >
        Click anywhere to enter studio
      </div>
    </aside>
  );
};
