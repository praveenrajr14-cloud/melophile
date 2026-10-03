import React, { useEffect } from 'react';
import { soundEngine } from '../../utils/audioSynth';
import { Volume2, X, Sparkles, Music2, Info } from 'lucide-react';
import { TriadItem } from './FullTriadsList';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !triad) return null;

  // Enharmonic pitch normalizer (e.g. Db4 = C#4)
  const normalizePitch = (pitch: string) => {
    return pitch
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');
  };

  const isKeyActive = (keyNote: string, activeNotes: string[]) => {
    const normKey = normalizePitch(keyNote);
    return activeNotes.some((n) => normalizePitch(n) === normKey);
  };

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playChord(triad.notes, 1.8, true);
  };

  const handlePlaySingleNote = (note: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playChord([note], 1.2, false);
  };

  // Keyboard notes mapping for 12 keys (C4 to G5)
  const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];
  const blackKeys = [
    { note: 'C#4', left: 1.1 },
    { note: 'D#4', left: 3.1 },
    { note: 'F#4', left: 7.1 },
    { note: 'G#4', left: 9.1 },
    { note: 'A#4', left: 11.1 },
    { note: 'C#5', left: 15.1 },
    { note: 'D#5', left: 17.1 },
    { note: 'F#5', left: 21.1 },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#faf8f5] rounded-3xl border border-[#eae6de] p-5 sm:p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eae6de]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9e7a4b] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9e7a4b] font-bold">
              Active Voicing Inspector
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-[#141518] hover:bg-[#ede8e0] transition-colors"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chord Title & Audition Row */}
        <div className="flex items-center justify-between pt-4 mb-3">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518]">
                {triad.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold">
                {triad.symbol}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  triad.quality === 'Major'
                    ? 'bg-amber-100/80 text-amber-800 border border-amber-200'
                    : 'bg-stone-200/80 text-stone-700 border border-stone-300'
                }`}
              >
                {triad.quality}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#5c5f6a] mt-1">
              <span>
                Formula: <strong className="text-[#141518] font-mono">{triad.formula}</strong>
              </span>
              <span>•</span>
              <span>
                Tones: <strong className="text-[#9e7a4b] font-mono">{triad.notes.join(' - ')}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#141518] text-white text-xs font-medium hover:bg-[#2b2d35] cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Play</span>
          </button>
        </div>

        {/* Harmonic Formula Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-2 rounded-xl bg-white border border-[#eae6de] text-center">
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Root (1)</span>
            <span className="text-xs font-bold text-[#141518]">{triad.root}</span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-[#eae6de] text-center">
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Third (3)</span>
            <span className="text-xs font-bold text-[#9e7a4b]">{triad.third}</span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-[#eae6de] text-center">
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Fifth (5)</span>
            <span className="text-xs font-bold text-[#141518]">{triad.fifth}</span>
          </div>
        </div>

        {/* Mini Piano Keyboard Visualizer */}
        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-[#eae6de] shadow-inner mb-4">
          <div className="relative inline-flex bg-[#141518] p-2 rounded-xl border border-[#2b2d35] select-none shadow-md overflow-x-auto max-w-full">
            {/* Red Felt Strip */}
            <div className="absolute top-1 left-2 right-2 h-1 bg-[#8b2626] rounded-xs pointer-events-none" />

            {/* White Keys */}
            {whiteKeys.map((note) => {
              const isPressed = isKeyActive(note, triad.notes);
              return (
                <button
                  key={note}
                  type="button"
                  onClick={(e) => handlePlaySingleNote(note, e)}
                  className={`relative w-5 sm:w-6 h-20 sm:h-22 rounded-b border-x border-b border-black/20 transition-all duration-75 cursor-pointer origin-top flex flex-col justify-end items-center pb-1 group ${
                    isPressed
                      ? 'bg-[#9e7a4b] text-white shadow-sm ring-1 ring-[#c5a880]'
                      : 'bg-white hover:bg-[#faf8f5] text-stone-700'
                  }`}
                  title={`Note ${note} (Click to audition)`}
                >
                  <span
                    className={`text-[8px] font-mono leading-none ${
                      isPressed ? 'font-bold text-white' : 'text-stone-400'
                    }`}
                  >
                    {note.replace('4', '').replace('5', '')}
                  </span>
                </button>
              );
            })}

            {/* Black Keys */}
            {blackKeys.map((bk) => {
              const isPressed = isKeyActive(bk.note, triad.notes);
              return (
                <button
                  key={bk.note}
                  type="button"
                  onClick={(e) => handlePlaySingleNote(bk.note, e)}
                  style={{ left: `${bk.left * 1.25 + 0.5}rem` }}
                  className={`absolute top-2 w-3 sm:w-3.5 h-12 sm:h-13 rounded-b z-10 transition-all duration-75 cursor-pointer origin-top flex flex-col justify-end items-center pb-1 ${
                    isPressed
                      ? 'bg-[#b89562] text-white ring-1 ring-white shadow-md'
                      : 'bg-[#1a1e24] hover:bg-[#252a33] text-stone-300'
                  }`}
                  title={`Note ${bk.note} (Click to audition)`}
                >
                  <span className="text-[7px] font-mono leading-none">
                    {bk.note.replace('4', '').replace('5', '')}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-[#5c5f6a] mt-2 font-medium">
            Highlighted keys denote active voicing tones
          </span>
        </div>

        {/* Acoustic Character & Voicing Tip */}
        <div className="space-y-2 mb-4 text-xs text-[#5c5f6a]">
          <p className="leading-relaxed italic text-stone-700 bg-white/70 p-2.5 rounded-xl border border-[#eae6de]">
            "{triad.vibe}" — {triad.description}
          </p>

          <div className="flex items-start gap-2 bg-[#f4efe6]/60 p-2.5 rounded-xl border border-[#e5dcce] text-[#8a6839]">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9e7a4b]" />
            <span className="text-[11px] leading-relaxed">
              <strong>Finger Tip:</strong> {triad.voicingTip}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eae6de]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
