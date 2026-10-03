import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundEngine, NOTE_FREQUENCIES } from '../utils/audioSynth';
import { Play, Square, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface KeyConfig {
  note: string;
  isBlack: boolean;
  keyboardKey: string;
  octaveOffset: number;
}

export const InteractivePiano3D: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [currentOctave, setCurrentOctave] = useState<number>(4);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const demoTimeoutRefs = useRef<number[]>([]);

  // Base key sequence for one octave + top notes
  const keys: KeyConfig[] = [
    { note: 'C', isBlack: false, keyboardKey: 'A', octaveOffset: 0 },
    { note: 'C#', isBlack: true, keyboardKey: 'W', octaveOffset: 0 },
    { note: 'D', isBlack: false, keyboardKey: 'S', octaveOffset: 0 },
    { note: 'D#', isBlack: true, keyboardKey: 'E', octaveOffset: 0 },
    { note: 'E', isBlack: false, keyboardKey: 'D', octaveOffset: 0 },
    { note: 'F', isBlack: false, keyboardKey: 'F', octaveOffset: 0 },
    { note: 'F#', isBlack: true, keyboardKey: 'T', octaveOffset: 0 },
    { note: 'G', isBlack: false, keyboardKey: 'G', octaveOffset: 0 },
    { note: 'G#', isBlack: true, keyboardKey: 'Y', octaveOffset: 0 },
    { note: 'A', isBlack: false, keyboardKey: 'H', octaveOffset: 0 },
    { note: 'A#', isBlack: true, keyboardKey: 'U', octaveOffset: 0 },
    { note: 'B', isBlack: false, keyboardKey: 'J', octaveOffset: 0 },
    { note: 'C', isBlack: false, keyboardKey: 'K', octaveOffset: 1 },
    { note: 'C#', isBlack: true, keyboardKey: 'O', octaveOffset: 1 },
    { note: 'D', isBlack: false, keyboardKey: 'L', octaveOffset: 1 },
  ];

  const playNote = useCallback(
    (noteWithOctave: string) => {
      if (!soundEnabled) return;
      const freq = NOTE_FREQUENCIES[noteWithOctave];
      if (freq) {
        soundEngine.playNote(freq, 1.3);
        setLastPlayedNote(noteWithOctave);
      }
    },
    [soundEnabled]
  );

  const triggerKey = useCallback(
    (keyId: string, noteWithOctave: string) => {
      setActiveKeys((prev) => new Set(prev).add(keyId));
      playNote(noteWithOctave);

      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(keyId);
          return next;
        });
      }, 250);
    },
    [playNote]
  );

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const pressedKey = e.key.toUpperCase();
      const matched = keys.find((k) => k.keyboardKey === pressedKey);
      if (matched) {
        const fullNote = `${matched.note}${currentOctave + matched.octaveOffset}`;
        const keyId = `${matched.note}-${matched.octaveOffset}`;
        triggerKey(keyId, fullNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentOctave, keys, triggerKey]);

  // Demo Melody
  const playDemoSong = () => {
    if (isPlayingDemo) {
      stopDemoSong();
      return;
    }

    setIsPlayingDemo(true);
    const demoSequence: Array<{ note: string; delay: number }> = [
      { note: 'E4', delay: 0 },
      { note: 'G#4', delay: 240 },
      { note: 'B4', delay: 480 },
      { note: 'E5', delay: 720 },
      { note: 'D#5', delay: 960 },
      { note: 'E5', delay: 1200 },
      { note: 'B4', delay: 1440 },
      { note: 'C#5', delay: 1680 },
      { note: 'A4', delay: 1920 },
      { note: 'F#4', delay: 2200 },
      { note: 'D4', delay: 2450 },
      { note: 'F#4', delay: 2700 },
      { note: 'A4', delay: 2950 },
      { note: 'C#5', delay: 3200 },
      { note: 'B4', delay: 3450 },
      { note: 'G4', delay: 3800 },
      { note: 'E4', delay: 4200 },
    ];

    demoSequence.forEach((item) => {
      const timer = window.setTimeout(() => {
        const matched = keys.find((k) => {
          const octave = item.note.endsWith('5') ? 1 : 0;
          const noteBase = item.note.replace(/[3-5]/, '');
          return k.note === noteBase && k.octaveOffset === octave;
        });

        if (matched) {
          const keyId = `${matched.note}-${matched.octaveOffset}`;
          triggerKey(keyId, item.note);
        } else {
          playNote(item.note);
        }
      }, item.delay);
      demoTimeoutRefs.current.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      setIsPlayingDemo(false);
    }, 4800);
    demoTimeoutRefs.current.push(finishTimer);
  };

  const stopDemoSong = () => {
    demoTimeoutRefs.current.forEach((t) => window.clearTimeout(t));
    demoTimeoutRefs.current = [];
    setIsPlayingDemo(false);
    setActiveKeys(new Set());
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-white border border-[#eae6de] shadow-lg shadow-stone-200/50 overflow-hidden">
      {/* Subtle warm amber ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#b89562]/06 rounded-full blur-3xl pointer-events-none" />

      {/* Piano Header Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#eae6de]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f4efe6] border border-[#e5dcce] flex items-center justify-center text-[#9e7a4b]">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#141518] font-medium text-base sm:text-lg tracking-wide flex items-center gap-2">
              Interactive Piano Studio
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] border border-[#e5dcce]">
                Playable
              </span>
            </h3>
            <p className="text-xs text-[#5c5f6a]">
              Click keys or type on your keyboard to play authentic synthesized tones
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Demo Song Button */}
          <button
            type="button"
            onClick={playDemoSong}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-xs ${
              isPlayingDemo
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'border border-[#141518] text-[#141518] hover:bg-[#141518] hover:text-white'
            }`}
          >
            {isPlayingDemo ? (
              <>
                <Square className="w-3.5 h-3.5" /> Stop Melody
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Melophile Melody
              </>
            )}
          </button>

          {/* Octave Controls */}
          <div className="flex items-center bg-[#f5f3ef] border border-[#e2ded5] rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setCurrentOctave((o) => Math.max(3, o - 1))}
              disabled={currentOctave <= 3}
              className="px-2 py-1 text-[#5c5f6a] hover:text-[#141518] disabled:opacity-30 cursor-pointer transition-colors"
            >
              Oct -
            </button>
            <span className="px-2 font-mono font-semibold text-[#9e7a4b]">
              C{currentOctave}
            </span>
            <button
              type="button"
              onClick={() => setCurrentOctave((o) => Math.min(5, o + 1))}
              disabled={currentOctave >= 5}
              className="px-2 py-1 text-[#5c5f6a] hover:text-[#141518] disabled:opacity-30 cursor-pointer transition-colors"
            >
              Oct +
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[#f5f3ef] border border-[#e2ded5] text-[#5c5f6a] hover:text-[#141518] transition-all cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#9e7a4b]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Key labels toggle */}
          <button
            type="button"
            onClick={() => setShowKeyLabels((prev) => !prev)}
            className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showKeyLabels
                ? 'bg-[#f4efe6] border-[#e5dcce] text-[#8a6839] font-medium'
                : 'bg-[#f5f3ef] border-[#e2ded5] text-[#5c5f6a]'
            }`}
          >
            Labels
          </button>
        </div>
      </div>

      {/* Piano Bed */}
      <div className="relative z-10 w-full overflow-x-auto pb-4 pt-2 flex justify-center">
        {/* Piano Casing */}
        <div className="relative inline-flex bg-[#141518] p-3 sm:p-5 rounded-2xl border border-[#26282e] shadow-xl">
          {/* Subtle felt strip */}
          <div className="absolute top-2.5 sm:top-4 left-3 right-3 h-1.5 bg-[#8b2626] rounded-sm pointer-events-none" />

          {/* Keys Container */}
          <div className="relative flex select-none pt-1">

            {/* White Keys */}
            {keys
              .filter((k) => !k.isBlack)
              .map((key) => {
                const fullNote = `${key.note}${currentOctave + key.octaveOffset}`;
                const keyId = `${key.note}-${key.octaveOffset}`;
                const isActive = activeKeys.has(keyId);

                return (
                  <button
                    key={keyId}
                    type="button"
                    onMouseDown={() => triggerKey(keyId, fullNote)}
                    className={`relative w-9 sm:w-12 h-36 sm:h-48 rounded-b-md border-x border-b border-black/30 transition-all duration-75 cursor-pointer origin-top flex flex-col justify-end items-center pb-2.5 shadow-sm group ${
                      isActive
                        ? 'bg-[#c5a880] text-[#0b0c0e] shadow-[#c5a880]/40 shadow-inner'
                        : 'bg-[#f7f6f2] hover:bg-white text-slate-800'
                    }`}
                  >
                    {showKeyLabels && (
                      <div className="flex flex-col items-center pointer-events-none">
                        <span
                          className={`text-[11px] sm:text-xs font-semibold ${
                            isActive ? 'text-[#0b0c0e]' : 'text-slate-800'
                          }`}
                        >
                          {fullNote}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 bg-black/5 px-1 rounded mt-0.5">
                          {key.keyboardKey}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

            {/* Mobile Black Keys */}
            {keys
              .filter((k) => k.isBlack)
              .map((key) => {
                const fullNote = `${key.note}${currentOctave + key.octaveOffset}`;
                const keyId = `${key.note}-${key.octaveOffset}`;
                const isActive = activeKeys.has(keyId);

                const whiteKeyIndexMap: Record<string, number> = {
                  'C#-0': 0.65,
                  'D#-0': 1.7,
                  'F#-0': 3.65,
                  'G#-0': 4.7,
                  'A#-0': 5.75,
                  'C#-1': 7.65,
                };
                const leftPos = whiteKeyIndexMap[keyId] || 0;

                return (
                  <button
                    key={keyId}
                    type="button"
                    onMouseDown={() => triggerKey(keyId, fullNote)}
                    style={{
                      left: `calc(${leftPos} * 2.25rem + ${leftPos * 0.1}rem)`,
                    }}
                    className={`sm:hidden absolute top-1 w-6 h-24 rounded-b-sm z-30 transition-all duration-75 cursor-pointer origin-top flex flex-col justify-end items-center pb-2 shadow-md border-x border-b border-black ${
                      isActive
                        ? 'bg-[#c5a880] text-[#0b0c0e] ring-2 ring-[#c5a880]'
                        : 'bg-[#181a20] hover:bg-[#232730]'
                    }`}
                  >
                    {showKeyLabels && (
                      <span className="text-[9px] font-bold text-white/80">
                        {key.note}
                      </span>
                    )}
                  </button>
                );
              })}

            {/* Desktop Black Keys */}
            {keys
              .filter((k) => k.isBlack)
              .map((key) => {
                const fullNote = `${key.note}${currentOctave + key.octaveOffset}`;
                const keyId = `${key.note}-${key.octaveOffset}`;
                const isActive = activeKeys.has(keyId);

                const whiteKeyIndexMap: Record<string, number> = {
                  'C#-0': 0.68,
                  'D#-0': 1.72,
                  'F#-0': 3.68,
                  'G#-0': 4.72,
                  'A#-0': 5.75,
                  'C#-1': 7.68,
                };
                const leftPos = whiteKeyIndexMap[keyId] || 0;

                return (
                  <button
                    key={`${keyId}-desktop`}
                    type="button"
                    onMouseDown={() => triggerKey(keyId, fullNote)}
                    style={{
                      left: `calc(${leftPos} * 3rem + 0.15rem)`,
                    }}
                    className={`hidden sm:flex absolute top-1 w-7 h-30 rounded-b-sm z-30 transition-all duration-75 cursor-pointer origin-top flex-col justify-end items-center pb-2 shadow-md border-x border-b border-black ${
                      isActive
                        ? 'bg-[#c5a880] text-[#0b0c0e] ring-2 ring-[#c5a880]'
                        : 'bg-[#181a20] hover:bg-[#232730]'
                    }`}
                  >
                    {showKeyLabels && (
                      <div className="flex flex-col items-center pointer-events-none">
                        <span className="text-[10px] font-medium text-white/90">
                          {key.note}
                        </span>
                        <span className="text-[8px] font-mono text-[#c5a880]">
                          {key.keyboardKey}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Note Feedback */}
      <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>
            {lastPlayedNote ? (
              <>
                Last Played:{' '}
                <span className="text-[#c5a880] font-mono font-bold text-sm">
                  {lastPlayedNote}
                </span>{' '}
                ({NOTE_FREQUENCIES[lastPlayedNote]?.toFixed(1)} Hz)
              </>
            ) : (
              'Play any key to start'
            )}
          </span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Keyboard: Press <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5 font-mono text-slate-300">A-K</kbd> for white keys, <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/5 font-mono text-slate-300">W,E,T,Y,U</kbd> for black keys
        </div>
      </div>
    </div>
  );
};
