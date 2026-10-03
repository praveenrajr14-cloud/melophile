import React, { useState, useEffect, useMemo } from 'react';
import { soundEngine } from '../../utils/audioSynth';
import { Volume2, X, Sparkles, Music2, Info, Layers, ChevronRight } from 'lucide-react';
import { TriadItem } from './FullTriadsList';
import {
  InversionType,
  getChordInversions,
  PIANO_KEYS_C4_TO_C6,
  getKeyRole,
  getPitchClass,
  normalizePitch,
} from '../../utils/chordInversions';

interface TriadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  triad: TriadItem | null;
}

export const TriadInspectorModal: React.FC<TriadInspectorModalProps> = ({
  isOpen,
  onClose,
  triad,
}) => {
  const [activeInversion, setActiveInversion] = useState<InversionType>('root');

  // Reset to root position whenever a new chord is selected
  useEffect(() => {
    setActiveInversion('root');
  }, [triad?.id]);

  const inversions = useMemo(() => {
    if (!triad) return null;
    return getChordInversions(triad);
  }, [triad]);

  const currentVoicing = inversions ? inversions[activeInversion] : null;

  // Keyboard navigation: Escape to close, 1/2/3 to switch inversion, Space/P to play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !triad || !currentVoicing) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '1') {
        setActiveInversion('root');
      } else if (e.key === '2') {
        setActiveInversion('first');
      } else if (e.key === '3') {
        setActiveInversion('second');
      } else if (e.key === ' ' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        soundEngine.playChord(currentVoicing.notes, 1.8, true);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, triad, currentVoicing]);

  if (!isOpen || !triad || !currentVoicing || !inversions) return null;

  const handlePlayChord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playChord(currentVoicing.notes, 1.8, true);
  };

  const handlePlaySingleNote = (note: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playChord([note], 1.2, false);
  };

  const whiteKeys = PIANO_KEYS_C4_TO_C6.filter((k) => !k.isBlack);
  const blackKeys = PIANO_KEYS_C4_TO_C6.filter((k) => k.isBlack);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs select-none animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#faf8f5] rounded-3xl border border-[#eae6de] p-5 sm:p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eae6de]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9e7a4b] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9e7a4b] font-bold">
              Active Voicing &amp; Inversion Inspector
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-[#141518] hover:bg-[#ede8e0] transition-colors cursor-pointer"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chord Title & Audition Play Button */}
        <div className="flex items-center justify-between pt-4 mb-4">
          <div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518]">
                {triad.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold">
                {triad.symbol}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  triad.quality === 'Major'
                    ? 'bg-amber-100/90 text-amber-800 border border-amber-200'
                    : 'bg-stone-200/90 text-stone-700 border border-stone-300'
                }`}
              >
                {triad.quality}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5c5f6a] mt-1 flex-wrap">
              <span>
                Voicing: <strong className="text-[#141518] font-mono">{currentVoicing.label}</strong>
              </span>
              <span>•</span>
              <span>
                Bass: <strong className="text-[#9e7a4b] font-mono">{currentVoicing.bassNote}</strong> ({currentVoicing.bassRole})
              </span>
              <span>•</span>
              <span>
                Figured Bass: <strong className="text-[#141518] font-mono">{currentVoicing.figuredBass}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayChord}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141518] text-white text-xs font-medium hover:bg-[#2b2d35] cursor-pointer transition-all shadow-md shrink-0 active:scale-95"
            title="Audition chord voicing (Press Space or P)"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
            <span>Play Voicing</span>
          </button>
        </div>

        {/* Inversions Selector (Root, 1st Inversion, 2nd Inversion) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#9e7a4b]" />
              Select Triad Inversion
            </span>
            <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
              Keys: [1] Root [2] 1st [3] 2nd
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ede8e0]/70 rounded-2xl border border-[#eae6de]">
            {(['root', 'first', 'second'] as InversionType[]).map((invKey) => {
              const inv = inversions[invKey];
              const isSelected = activeInversion === invKey;
              return (
                <button
                  key={invKey}
                  type="button"
                  onClick={() => {
                    setActiveInversion(invKey);
                    soundEngine.playChord(inv.notes, 1.6, true);
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#141518] shadow-sm font-semibold border border-[#dcd6ca]'
                      : 'text-stone-600 hover:text-[#141518] hover:bg-white/40'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{inv.label}</span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono mt-0.5">
                    <span className="px-1 rounded bg-stone-100 text-[#8a6839] font-bold">
                      {inv.figuredBass}
                    </span>
                    <span>{inv.formula}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Harmonic Ordering Pills (Pitches in voicing order from lowest to highest) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {currentVoicing.notes.map((noteWithOctave, idx) => {
            const letter = noteWithOctave.replace(/[0-9]/g, '');
            const octave = noteWithOctave.replace(/[^0-9]/g, '');
            const isBass = idx === 0;

            // Determine if it's Root, 3rd, or 5th using pitch class (octave-independent)
            const noteClass = getPitchClass(noteWithOctave);
            const rootClass = getPitchClass(triad.notes[0]);
            const thirdClass = getPitchClass(triad.notes[1]);
            let roleTitle = 'Fifth (5)';
            if (noteClass === rootClass) roleTitle = 'Root (1)';
            else if (noteClass === thirdClass) roleTitle = triad.quality === 'Major' ? 'Major 3rd (3)' : 'Minor 3rd (♭3)';

            return (
              <button
                key={noteWithOctave}
                type="button"
                onClick={(e) => handlePlaySingleNote(noteWithOctave, e)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer group hover:border-[#9e7a4b] ${
                  isBass
                    ? 'bg-[#f7f2ea] border-[#decbb2] shadow-xs'
                    : 'bg-white border-[#eae6de]'
                }`}
                title={`Click to audition ${noteWithOctave}`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="text-[10px] uppercase font-mono text-stone-400">
                    {roleTitle}
                  </span>
                  {isBass && (
                    <span className="px-1 py-0.2 rounded-xs bg-[#9e7a4b] text-white text-[8px] font-bold uppercase font-mono tracking-tighter">
                      Bass
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-base sm:text-lg font-bold text-[#141518] group-hover:text-[#9e7a4b]">
                    {letter}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 font-normal">
                    {octave}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mathematically Exact SVG Piano Keyboard (C4 to C6) */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#eae6de] shadow-inner mb-4">
          <div className="w-full flex items-center justify-between px-1 mb-2 text-[11px] text-stone-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#9e7a4b]" />
              2-Octave Keyboard (C4 - C6)
            </span>
            <span className="text-[10px] text-stone-400">
              Click any key to audition individual pitch
            </span>
          </div>

          <div className="relative w-full overflow-x-auto pb-1">
            <div className="min-w-[440px] max-w-[540px] mx-auto bg-[#18191c] p-2 rounded-2xl shadow-xl border border-[#2b2d35]">
              {/* Crimson Felt Strip */}
              <div className="h-1.5 w-full bg-[#8b2626] rounded-t-sm mb-1 opacity-90 shadow-xs" />

              {/* Exact SVG Piano Geometry: 15 white keys (width 32) = 480px total width */}
              <svg
                viewBox="0 0 480 126"
                className="w-full h-auto select-none block overflow-visible"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Active White Key Gold Gradient */}
                  <linearGradient id="activeWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c5a880" />
                    <stop offset="100%" stopColor="#9e7a4b" />
                  </linearGradient>

                  {/* Active Black Key Amber Gradient */}
                  <linearGradient id="activeBlackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dfbe90" />
                    <stop offset="100%" stopColor="#a37c48" />
                  </linearGradient>

                  {/* Inactive White Key Subtle Drop */}
                  <linearGradient id="whiteKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="85%" stopColor="#fbf9f6" />
                    <stop offset="100%" stopColor="#ede6db" />
                  </linearGradient>

                  {/* Inactive Black Key Depth */}
                  <linearGradient id="blackKeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2c3038" />
                    <stop offset="15%" stopColor="#181a1f" />
                    <stop offset="100%" stopColor="#0c0d10" />
                  </linearGradient>

                  {/* Filter for key glow */}
                  <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#9e7a4b" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* 1. RENDER WHITE KEYS FIRST (15 White Keys: C4 to C6) */}
                <g id="white-keys">
                  {whiteKeys.map((key) => {
                    const role = getKeyRole(key, currentVoicing.notes, triad);
                    return (
                      <g
                        key={key.note}
                        onClick={(e) => handlePlaySingleNote(key.note, e as unknown as React.MouseEvent)}
                        className="cursor-pointer group"
                      >
                        <title>{`Note ${key.note} (Click to audition)`}</title>
                        <rect
                          x={key.x}
                          y={2}
                          width={key.width - 1}
                          height={key.height}
                          rx={3}
                          ry={3}
                          fill={role.isActive ? 'url(#activeWhiteGrad)' : 'url(#whiteKeyGrad)'}
                          stroke={role.isActive ? '#856338' : '#c8c2b7'}
                          strokeWidth={1}
                          filter={role.isActive ? 'url(#activeGlow)' : undefined}
                          className="transition-colors duration-100 group-hover:brightness-95"
                        />
                        {/* Key Label at bottom */}
                        <text
                          x={key.x + key.width / 2 - 0.5}
                          y={key.height - 10}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="ui-monospace, monospace"
                          fontWeight={role.isActive ? '700' : '500'}
                          fill={role.isActive ? '#ffffff' : '#737785'}
                          className="pointer-events-none select-none"
                        >
                          {key.note.replace('4', '').replace('5', '').replace('6', '')}
                        </text>

                        {/* Harmonic Role Badge on Active White Key */}
                        {role.isActive && (
                          <g className="pointer-events-none">
                            <circle
                              cx={key.x + key.width / 2 - 0.5}
                              cy={key.height - 24}
                              r={6}
                              fill="#ffffff"
                              opacity={0.92}
                            />
                            <text
                              x={key.x + key.width / 2 - 0.5}
                              y={key.height - 21.5}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                              fill="#856338"
                            >
                              {role.roleLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 2. RENDER BLACK KEYS ON TOP (10 Black Keys: C#4 to A#5) */}
                <g id="black-keys">
                  {blackKeys.map((key) => {
                    const role = getKeyRole(key, currentVoicing.notes, triad);
                    return (
                      <g
                        key={key.note}
                        onClick={(e) => handlePlaySingleNote(key.note, e as unknown as React.MouseEvent)}
                        className="cursor-pointer group"
                      >
                        <title>{`Note ${key.note} (Click to audition)`}</title>
                        <rect
                          x={key.x}
                          y={2}
                          width={key.width}
                          height={key.height}
                          rx={2.5}
                          ry={2.5}
                          fill={role.isActive ? 'url(#activeBlackGrad)' : 'url(#blackKeyGrad)'}
                          stroke={role.isActive ? '#ffffff' : '#333742'}
                          strokeWidth={role.isActive ? 1.2 : 0.8}
                          filter={role.isActive ? 'url(#activeGlow)' : undefined}
                          className="transition-all duration-100 group-hover:brightness-125"
                        />
                        {/* Note label inside black key */}
                        <text
                          x={key.x + key.width / 2}
                          y={key.height - 7}
                          textAnchor="middle"
                          fontSize="7"
                          fontFamily="ui-monospace, monospace"
                          fontWeight={role.isActive ? '700' : '400'}
                          fill={role.isActive ? '#ffffff' : '#b0b4bd'}
                          className="pointer-events-none select-none"
                        >
                          {role.isActive ? role.noteDisplay : key.note.replace(/[0-9]/g, '')}
                        </text>

                        {/* Harmonic Role Badge on Active Black Key */}
                        {role.isActive && (
                          <g className="pointer-events-none">
                            <circle
                              cx={key.x + key.width / 2}
                              cy={key.height - 19}
                              r={5.5}
                              fill="#ffffff"
                              opacity={0.95}
                            />
                            <text
                              x={key.x + key.width / 2}
                              y={key.height - 16.5}
                              textAnchor="middle"
                              fontSize="7.5"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                              fill="#856338"
                            >
                              {role.roleLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-stone-500 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#9e7a4b] border border-[#856338]" />
              <strong>Amber Keys:</strong> Voicing Tones
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white border border-stone-300 text-[8px] font-bold text-[#856338]">
                R
              </span>
              <span>Root</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white border border-stone-300 text-[8px] font-bold text-[#856338]">
                3
              </span>
              <span>3rd</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white border border-stone-300 text-[8px] font-bold text-[#856338]">
                5
              </span>
              <span>5th</span>
            </span>
          </div>
        </div>

        {/* Acoustic Character & Voicing & Fingering Guide */}
        <div className="space-y-2 mb-4 text-xs text-[#5c5f6a]">
          <div className="bg-white/80 p-3 rounded-xl border border-[#eae6de]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
              Voicing Analysis &amp; Character
            </span>
            <p className="leading-relaxed text-[#141518] text-[11px] sm:text-xs">
              {currentVoicing.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 bg-[#f4efe6]/60 p-2.5 rounded-xl border border-[#e5dcce] text-[#8a6839]">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9e7a4b]" />
              <div className="text-[11px] leading-relaxed">
                <strong className="block text-[#141518]">Right Hand Fingering:</strong>
                <span>{currentVoicing.rhFingering}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#f4efe6]/60 p-2.5 rounded-xl border border-[#e5dcce] text-[#8a6839]">
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9e7a4b]" />
              <div className="text-[11px] leading-relaxed">
                <strong className="block text-[#141518]">Voice Leading Tip:</strong>
                <span>{currentVoicing.voiceLeadingTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#eae6de]">
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
            Press [Space] to play voicing • [Esc] to exit
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
