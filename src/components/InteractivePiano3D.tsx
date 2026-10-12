import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundEngine } from '../utils/audioSynth';
import {
  Play,
  Square,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Hand,
  Headphones,
} from 'lucide-react';

interface WhiteKeyDef {
  note: string; // e.g., 'C4'
  label: string; // e.g., 'C4'
  shortNote: string; // e.g., 'C'
  keyboardKey: string;
  whiteIndex: number; // 0..13
}

interface BlackKeyDef {
  note: string; // e.g., 'C#4'
  flatNote: string; // e.g., 'Db4'
  shortLabel: string; // e.g., 'C#'
  keyboardKey: string;
  afterWhiteIndex: number; // Positioned on the seam after this white key index
}

export interface SongStep {
  note: string; // e.g. 'C4'
  lyric: string; // e.g. 'Twin-'
  beats: number; // relative duration multiplier (1 = quarter note, 2 = half note, etc.)
}

export interface PlayableSong {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Easy' | 'Classic';
  bpm: number;
  steps: SongStep[];
}

export const PLAYABLE_SONGS: PlayableSong[] = [
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    subtitle: 'Classic Lullaby • C Major',
    difficulty: 'Beginner',
    bpm: 110,
    steps: [
      { note: 'C4', lyric: 'Twin-', beats: 1 },
      { note: 'C4', lyric: '-kle', beats: 1 },
      { note: 'G4', lyric: 'twin-', beats: 1 },
      { note: 'G4', lyric: '-kle', beats: 1 },
      { note: 'A4', lyric: 'lit-', beats: 1 },
      { note: 'A4', lyric: '-tle', beats: 1 },
      { note: 'G4', lyric: 'star,', beats: 2 },
      { note: 'F4', lyric: 'How', beats: 1 },
      { note: 'F4', lyric: 'I', beats: 1 },
      { note: 'E4', lyric: 'won-', beats: 1 },
      { note: 'E4', lyric: '-der', beats: 1 },
      { note: 'D4', lyric: 'what', beats: 1 },
      { note: 'D4', lyric: 'you', beats: 1 },
      { note: 'C4', lyric: 'are!', beats: 2 },
    ],
  },
  {
    id: 'happy-birthday',
    title: 'Happy Birthday to You',
    subtitle: 'Celebration Standard • F Major',
    difficulty: 'Beginner',
    bpm: 115,
    steps: [
      { note: 'C4', lyric: 'Hap-', beats: 0.75 },
      { note: 'C4', lyric: '-py', beats: 0.5 },
      { note: 'D4', lyric: 'Birth-', beats: 1 },
      { note: 'C4', lyric: '-day', beats: 1 },
      { note: 'F4', lyric: 'to', beats: 1 },
      { note: 'E4', lyric: 'you,', beats: 2 },
      { note: 'C4', lyric: 'Hap-', beats: 0.75 },
      { note: 'C4', lyric: '-py', beats: 0.5 },
      { note: 'D4', lyric: 'Birth-', beats: 1 },
      { note: 'C4', lyric: '-day', beats: 1 },
      { note: 'G4', lyric: 'to', beats: 1 },
      { note: 'F4', lyric: 'you,', beats: 2 },
      { note: 'C4', lyric: 'Hap-', beats: 0.75 },
      { note: 'C4', lyric: '-py', beats: 0.5 },
      { note: 'C5', lyric: 'Birth-', beats: 1 },
      { note: 'A4', lyric: '-day', beats: 1 },
      { note: 'F4', lyric: 'dear', beats: 1 },
      { note: 'E4', lyric: 'friend,', beats: 1 },
      { note: 'D4', lyric: '♪', beats: 1.5 },
      { note: 'A#4', lyric: 'Hap-', beats: 0.75 },
      { note: 'A#4', lyric: '-py', beats: 0.5 },
      { note: 'A4', lyric: 'Birth-', beats: 1 },
      { note: 'F4', lyric: '-day', beats: 1 },
      { note: 'G4', lyric: 'to', beats: 1 },
      { note: 'F4', lyric: 'you!', beats: 2 },
    ],
  },
  {
    id: 'mary-little-lamb',
    title: 'Mary Had a Little Lamb',
    subtitle: 'Traditional Folk Melody • C Major',
    difficulty: 'Beginner',
    bpm: 120,
    steps: [
      { note: 'E4', lyric: 'Ma-', beats: 1 },
      { note: 'D4', lyric: '-ry', beats: 1 },
      { note: 'C4', lyric: 'had', beats: 1 },
      { note: 'D4', lyric: 'a', beats: 1 },
      { note: 'E4', lyric: 'lit-', beats: 1 },
      { note: 'E4', lyric: '-tle', beats: 1 },
      { note: 'E4', lyric: 'lamb,', beats: 2 },
      { note: 'D4', lyric: 'lit-', beats: 1 },
      { note: 'D4', lyric: '-tle', beats: 1 },
      { note: 'D4', lyric: 'lamb,', beats: 2 },
      { note: 'E4', lyric: 'lit-', beats: 1 },
      { note: 'G4', lyric: '-tle', beats: 1 },
      { note: 'G4', lyric: 'lamb,', beats: 2 },
      { note: 'E4', lyric: 'Ma-', beats: 1 },
      { note: 'D4', lyric: '-ry', beats: 1 },
      { note: 'C4', lyric: 'had', beats: 1 },
      { note: 'D4', lyric: 'a', beats: 1 },
      { note: 'E4', lyric: 'lit-', beats: 1 },
      { note: 'E4', lyric: '-tle', beats: 1 },
      { note: 'E4', lyric: 'lamb,', beats: 1 },
      { note: 'E4', lyric: 'its', beats: 1 },
      { note: 'D4', lyric: 'fleece', beats: 1 },
      { note: 'D4', lyric: 'was', beats: 1 },
      { note: 'E4', lyric: 'white', beats: 1 },
      { note: 'D4', lyric: 'as', beats: 1 },
      { note: 'C4', lyric: 'snow!', beats: 2 },
    ],
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy (Beethoven)',
    subtitle: '9th Symphony Theme • C Major',
    difficulty: 'Easy',
    bpm: 120,
    steps: [
      { note: 'E4', lyric: 'Joy-', beats: 1 },
      { note: 'E4', lyric: '-ful,', beats: 1 },
      { note: 'F4', lyric: 'joy-', beats: 1 },
      { note: 'G4', lyric: '-ful,', beats: 1 },
      { note: 'G4', lyric: 'we', beats: 1 },
      { note: 'F4', lyric: 'a-', beats: 1 },
      { note: 'E4', lyric: '-dore', beats: 1 },
      { note: 'D4', lyric: 'thee,', beats: 1 },
      { note: 'C4', lyric: 'God', beats: 1 },
      { note: 'C4', lyric: 'of', beats: 1 },
      { note: 'D4', lyric: 'glo-', beats: 1 },
      { note: 'E4', lyric: '-ry,', beats: 1 },
      { note: 'E4', lyric: 'Lord', beats: 1.5 },
      { note: 'D4', lyric: 'of', beats: 0.5 },
      { note: 'D4', lyric: 'love!', beats: 2 },
      { note: 'E4', lyric: 'Hearts', beats: 1 },
      { note: 'E4', lyric: 'un-', beats: 1 },
      { note: 'F4', lyric: '-fold', beats: 1 },
      { note: 'G4', lyric: 'like', beats: 1 },
      { note: 'G4', lyric: 'flow’rs', beats: 1 },
      { note: 'F4', lyric: 'be-', beats: 1 },
      { note: 'E4', lyric: '-fore', beats: 1 },
      { note: 'D4', lyric: 'thee,', beats: 1 },
      { note: 'C4', lyric: 'Hail', beats: 1 },
      { note: 'C4', lyric: 'thee', beats: 1 },
      { note: 'D4', lyric: 'sun', beats: 1 },
      { note: 'E4', lyric: 'a-', beats: 1 },
      { note: 'D4', lyric: '-bove', beats: 1.5 },
      { note: 'C4', lyric: 'us', beats: 0.5 },
      { note: 'C4', lyric: 'all!', beats: 2 },
    ],
  },
  {
    id: 'jingle-bells',
    title: 'Jingle Bells (Chorus)',
    subtitle: 'Festive Standard • C Major',
    difficulty: 'Easy',
    bpm: 125,
    steps: [
      { note: 'E4', lyric: 'Jin-', beats: 1 },
      { note: 'E4', lyric: '-gle', beats: 1 },
      { note: 'E4', lyric: 'bells,', beats: 2 },
      { note: 'E4', lyric: 'jin-', beats: 1 },
      { note: 'E4', lyric: '-gle', beats: 1 },
      { note: 'E4', lyric: 'bells,', beats: 2 },
      { note: 'E4', lyric: 'Jin-', beats: 1 },
      { note: 'G4', lyric: '-gle', beats: 1 },
      { note: 'C4', lyric: 'all', beats: 1.5 },
      { note: 'D4', lyric: 'the', beats: 0.5 },
      { note: 'E4', lyric: 'way!', beats: 2 },
      { note: 'F4', lyric: 'Oh', beats: 1 },
      { note: 'F4', lyric: 'what', beats: 1 },
      { note: 'F4', lyric: 'fun', beats: 1.5 },
      { note: 'F4', lyric: 'it', beats: 0.5 },
      { note: 'F4', lyric: 'is', beats: 1 },
      { note: 'E4', lyric: 'to', beats: 1 },
      { note: 'E4', lyric: 'ride', beats: 1 },
      { note: 'E4', lyric: 'in', beats: 0.5 },
      { note: 'E4', lyric: 'a', beats: 0.5 },
      { note: 'E4', lyric: 'one-', beats: 1 },
      { note: 'D4', lyric: '-horse', beats: 1 },
      { note: 'D4', lyric: 'o-', beats: 1 },
      { note: 'E4', lyric: '-pen', beats: 1 },
      { note: 'D4', lyric: 'sleigh!', beats: 1.5 },
      { note: 'G4', lyric: 'Hey!', beats: 1.5 },
    ],
  },
  {
    id: 'fur-elise',
    title: 'Für Elise (Main Theme)',
    subtitle: 'Ludwig van Beethoven • A Minor',
    difficulty: 'Classic',
    bpm: 120,
    steps: [
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'D#5', lyric: '♪', beats: 0.75 },
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'D#5', lyric: '♪', beats: 0.75 },
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'B4', lyric: '♪', beats: 0.75 },
      { note: 'D5', lyric: '♪', beats: 0.75 },
      { note: 'C5', lyric: '♪', beats: 0.75 },
      { note: 'A4', lyric: 'Hold', beats: 2 },
      { note: 'C4', lyric: '♪', beats: 0.75 },
      { note: 'E4', lyric: '♪', beats: 0.75 },
      { note: 'A4', lyric: '♪', beats: 0.75 },
      { note: 'B4', lyric: 'Hold', beats: 2 },
      { note: 'E4', lyric: '♪', beats: 0.75 },
      { note: 'G#4', lyric: '♪', beats: 0.75 },
      { note: 'B4', lyric: '♪', beats: 0.75 },
      { note: 'C5', lyric: 'Hold', beats: 2 },
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'D#5', lyric: '♪', beats: 0.75 },
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'D#5', lyric: '♪', beats: 0.75 },
      { note: 'E5', lyric: '♪', beats: 0.75 },
      { note: 'B4', lyric: '♪', beats: 0.75 },
      { note: 'D5', lyric: '♪', beats: 0.75 },
      { note: 'C5', lyric: '♪', beats: 0.75 },
      { note: 'A4', lyric: 'End', beats: 2 },
    ],
  },
];

// Full 2-Octave White Keys (14 keys: C4 to B5)
const WHITE_KEYS: WhiteKeyDef[] = [
  { note: 'C4', label: 'C4', shortNote: 'C', keyboardKey: 'A', whiteIndex: 0 },
  { note: 'D4', label: 'D4', shortNote: 'D', keyboardKey: 'S', whiteIndex: 1 },
  { note: 'E4', label: 'E4', shortNote: 'E', keyboardKey: 'D', whiteIndex: 2 },
  { note: 'F4', label: 'F4', shortNote: 'F', keyboardKey: 'F', whiteIndex: 3 },
  { note: 'G4', label: 'G4', shortNote: 'G', keyboardKey: 'G', whiteIndex: 4 },
  { note: 'A4', label: 'A4', shortNote: 'A', keyboardKey: 'H', whiteIndex: 5 },
  { note: 'B4', label: 'B4', shortNote: 'B', keyboardKey: 'J', whiteIndex: 6 },
  { note: 'C5', label: 'C5', shortNote: 'C', keyboardKey: 'K', whiteIndex: 7 },
  { note: 'D5', label: 'D5', shortNote: 'D', keyboardKey: 'L', whiteIndex: 8 },
  { note: 'E5', label: 'E5', shortNote: 'E', keyboardKey: ';', whiteIndex: 9 },
  { note: 'F5', label: 'F5', shortNote: 'F', keyboardKey: "'", whiteIndex: 10 },
  { note: 'G5', label: 'G5', shortNote: 'G', keyboardKey: 'Z', whiteIndex: 11 },
  { note: 'A5', label: 'A5', shortNote: 'A', keyboardKey: 'X', whiteIndex: 12 },
  { note: 'B5', label: 'B5', shortNote: 'B', keyboardKey: 'C', whiteIndex: 13 },
];

// Full 2-Octave Black Keys (10 keys, each centered on the exact seam after `afterWhiteIndex`)
const BLACK_KEYS: BlackKeyDef[] = [
  { note: 'C#4', flatNote: 'Db4', shortLabel: 'C#', keyboardKey: 'W', afterWhiteIndex: 0 },
  { note: 'D#4', flatNote: 'Eb4', shortLabel: 'D#', keyboardKey: 'E', afterWhiteIndex: 1 },
  { note: 'F#4', flatNote: 'Gb4', shortLabel: 'F#', keyboardKey: 'T', afterWhiteIndex: 3 },
  { note: 'G#4', flatNote: 'Ab4', shortLabel: 'G#', keyboardKey: 'Y', afterWhiteIndex: 4 },
  { note: 'A#4', flatNote: 'Bb4', shortLabel: 'A#', keyboardKey: 'U', afterWhiteIndex: 5 },
  { note: 'C#5', flatNote: 'Db5', shortLabel: 'C#', keyboardKey: 'O', afterWhiteIndex: 7 },
  { note: 'D#5', flatNote: 'Eb5', shortLabel: 'D#', keyboardKey: 'P', afterWhiteIndex: 8 },
  { note: 'F#5', flatNote: 'Gb5', shortLabel: 'F#', keyboardKey: 'V', afterWhiteIndex: 10 },
  { note: 'G#5', flatNote: 'Ab5', shortLabel: 'G#', keyboardKey: 'B', afterWhiteIndex: 11 },
  { note: 'A#5', flatNote: 'Bb5', shortLabel: 'A#', keyboardKey: 'N', afterWhiteIndex: 12 },
];

export const InteractivePiano3D: React.FC = () => {
  const [selectedSongId, setSelectedSongId] = useState<string>(PLAYABLE_SONGS[0].id);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [songCompleted, setSongCompleted] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tempoSpeed, setTempoSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);

  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isAutoPlayingRef = useRef<boolean>(false);

  const currentSong =
    PLAYABLE_SONGS.find((s) => s.id === selectedSongId) || PLAYABLE_SONGS[0];
  const currentTargetStep = currentSong.steps[stepIndex] || currentSong.steps[0];

  const stopAutoPlay = useCallback(() => {
    timeoutIdsRef.current.forEach((t) => clearTimeout(t));
    timeoutIdsRef.current = [];
    isAutoPlayingRef.current = false;
    setIsAutoPlaying(false);
    setActiveNotes(new Set());
  }, []);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((t) => clearTimeout(t));
      timeoutIdsRef.current = [];
    };
  }, []);

  // Select a new song
  const handleSelectSong = (songId: string) => {
    stopAutoPlay();
    soundEngine.playClick(720);
    setSelectedSongId(songId);
    setStepIndex(0);
    setSongCompleted(false);
  };

  // Play a single piano key (and advance interactive Play-Along step if it matches the target note!)
  const triggerNote = useCallback(
    (note: string, fromAutoPlay = false) => {
      if (soundEnabled) {
        soundEngine.playChord([note], 1.25, false);
      }
      setLastPlayedNote(note);

      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.add(note);
        return next;
      });

      setTimeout(() => {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 260);

      // If user manually clicked/typed the key during Play-Along mode, check if it matches target!
      if (!fromAutoPlay && !isAutoPlayingRef.current) {
        setStepIndex((prevIdx) => {
          const expected = currentSong.steps[prevIdx]?.note;
          if (expected === note) {
            if (prevIdx + 1 >= currentSong.steps.length) {
              setSongCompleted(true);
              return 0;
            }
            setSongCompleted(false);
            return prevIdx + 1;
          }
          return prevIdx;
        });
      }
    },
    [soundEnabled, currentSong]
  );

  // Computer Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const keyChar = e.key.toUpperCase();
      const matchedWhite = WHITE_KEYS.find((k) => k.keyboardKey === keyChar);
      if (matchedWhite) {
        triggerNote(matchedWhite.note, false);
        return;
      }
      const matchedBlack = BLACK_KEYS.find((k) => k.keyboardKey === keyChar);
      if (matchedBlack) {
        triggerNote(matchedBlack.note, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerNote]);

  // Auto-Play the currently selected song from start to finish
  const handleToggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
      return;
    }

    stopAutoPlay();
    soundEngine.playClick(780);
    isAutoPlayingRef.current = true;
    setIsAutoPlaying(true);
    setSongCompleted(false);
    setStepIndex(0);

    const speedMultiplier =
      tempoSpeed === 'slow' ? 1.35 : tempoSpeed === 'fast' ? 0.75 : 1;
    const beatMs = (60 / currentSong.bpm) * 1000 * speedMultiplier;

    let accumulatedMs = 80;
    currentSong.steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        if (!isAutoPlayingRef.current) return;
        setStepIndex(idx);
        triggerNote(step.note, true);

        if (idx === currentSong.steps.length - 1) {
          const endTimer = setTimeout(() => {
            if (!isAutoPlayingRef.current) return;
            stopAutoPlay();
            setSongCompleted(true);
            setStepIndex(0);
          }, step.beats * beatMs + 250);
          timeoutIdsRef.current.push(endTimer);
        }
      }, accumulatedMs);

      accumulatedMs += step.beats * beatMs;
      timeoutIdsRef.current.push(t);
    });
  };

  // Play the next expected note with 1 click ("Play Next Note" helper button)
  const handleStepForward = () => {
    if (isAutoPlaying) stopAutoPlay();
    const step = currentSong.steps[stepIndex];
    if (step) {
      triggerNote(step.note, false);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
  };

  const progressPercent = Math.round(
    ((songCompleted ? currentSong.steps.length : stepIndex) /
      currentSong.steps.length) *
      100
  );

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-5 sm:p-8 bg-white border border-[#eae6de] shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Subtle warm ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#b89562]/08 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HEADER & CONTROLS */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#eae6de]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#141518] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[#141518] font-serif font-medium text-lg sm:text-xl">
                Interactive Song &amp; Piano Studio
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                6 Playable Songs • Guided Mode
              </span>
            </div>
            <p className="text-xs text-[#5c5f6a] mt-0.5">
              Choose a song below — press the glowing <strong className="text-emerald-700">emerald target key</strong> to play along note-by-note, or click <strong>Auto-Play Song</strong>!
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Auto-Play Song Button */}
          <button
            type="button"
            onClick={handleToggleAutoPlay}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs ${
              isAutoPlaying
                ? 'bg-rose-600 text-white'
                : 'bg-[#141518] text-[#c5a880] hover:bg-[#2b2d35]'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play Song</span>
              </>
            )}
          </button>

          {/* Tempo Selector */}
          <div className="flex items-center bg-[#f5f3ef] border border-[#e2ded5] rounded-xl p-1 text-xs">
            {(['slow', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  soundEngine.playClick(680);
                  setTempoSpeed(spd);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-mono text-[11px] transition-colors cursor-pointer ${
                  tempoSpeed === spd
                    ? 'bg-[#141518] text-[#c5a880] font-bold'
                    : 'text-[#5c5f6a] hover:text-[#141518]'
                }`}
              >
                {spd}
              </button>
            ))}
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
            className={`text-xs px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
              showKeyLabels
                ? 'bg-[#f4efe6] border-[#e5dcce] text-[#8a6839] font-semibold'
                : 'bg-[#f5f3ef] border-[#e2ded5] text-[#5c5f6a]'
            }`}
          >
            Key Labels
          </button>
        </div>
      </div>

      {/* 2. PLAYABLE SONG SELECTOR PILLS */}
      <div className="relative z-10 mt-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6839] font-bold">
            Select a Playable Song:
          </span>
          <span className="text-[11px] font-mono text-[#5c5f6a]">
            Progress: <strong>{progressPercent}%</strong> ({stepIndex}/{currentSong.steps.length} notes)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PLAYABLE_SONGS.map((song) => {
            const isSelected = song.id === selectedSongId;
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => handleSelectSong(song.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#141518] text-white border-[#141518] shadow-md ring-2 ring-[#c5a880]/50'
                    : 'bg-[#faf8f5] hover:bg-[#f4efe6] text-[#141518] border-[#e5dcce]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      isSelected
                        ? 'bg-[#c5a880] text-[#141518]'
                        : 'bg-[#eae4d8] text-[#8a6839]'
                    }`}
                  >
                    {song.difficulty}
                  </span>
                  <Headphones
                    className={`w-3 h-3 ${
                      isSelected ? 'text-[#c5a880]' : 'text-[#9e7a4b]'
                    }`}
                  />
                </div>
                <div className="text-xs font-semibold leading-tight line-clamp-2">
                  {song.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE FOLLOW-ALONG NOTE & LYRIC TELEPROMPTER */}
      <div className="relative z-10 mb-5 p-4 rounded-2xl bg-[#141518] text-white border border-[#2b2d35]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c5a880] font-bold">
              {currentSong.title}
            </span>
            {songCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bravo! Song Completed — Press any key to play again!</span>
              </span>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-xs">
                <Hand className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span className="text-stone-300">Next Key to Press:</span>
                <strong className="text-emerald-300 font-mono text-sm">
                  {currentTargetStep.note}
                </strong>
                <span className="text-[#c5a880] font-serif italic">
                  “{currentTargetStep.lyric}”
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStepForward}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#141518] font-mono text-xs font-bold transition-colors cursor-pointer"
              title="Click to play the next note in the song"
            >
              Play Next Note ({currentTargetStep.note})
            </button>
            <button
              type="button"
              onClick={() => {
                stopAutoPlay();
                soundEngine.playClick(600);
                setStepIndex(0);
                setSongCompleted(false);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Restart Song from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Sequence of Song Notes & Lyrics */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5">
          {currentSong.steps.map((st, idx) => {
            const isCurrent = idx === stepIndex && !songCompleted;
            const isPast = idx < stepIndex || songCompleted;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  setStepIndex(idx);
                  setSongCompleted(false);
                  triggerNote(st.note, true);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs shrink-0 transition-all cursor-pointer flex flex-col items-center min-w-[46px] border ${
                  isCurrent
                    ? 'bg-emerald-400 text-[#141518] border-emerald-300 font-bold scale-105 shadow-md'
                    : isPast
                    ? 'bg-[#c5a880]/20 text-[#c5a880] border-[#c5a880]/40'
                    : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-xs font-bold">{st.note}</span>
                <span
                  className={`text-[10px] font-sans mt-0.5 ${
                    isCurrent ? 'text-[#141518] font-semibold' : 'opacity-75'
                  }`}
                >
                  {st.lyric}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TRUE 2-OCTAVE GRAND PIANO KEYBOARD (C4 TO B5) WITH EXACT ALIGNMENT */}
      <div className="relative z-10 w-full overflow-x-auto pb-2">
        <div className="min-w-[640px] w-full bg-[#141518] p-3 sm:p-5 rounded-2xl border border-[#26282e] shadow-xl">
          {/* Red Grand Piano Felt Strip */}
          <div className="h-1.5 w-full bg-[#8b2626] rounded-t-sm mb-0.5" />

          {/* Relative 14-White-Key Container */}
          <div className="relative w-full h-44 sm:h-52 select-none flex">
            {/* 14 WHITE KEYS (Each exactly 1/14 = 7.142857% width) */}
            {WHITE_KEYS.map((wk) => {
              const isPressed = activeNotes.has(wk.note);
              const isTarget = !songCompleted && currentTargetStep?.note === wk.note;

              return (
                <button
                  key={wk.note}
                  type="button"
                  onMouseDown={() => triggerNote(wk.note, false)}
                  aria-label={`Piano key ${wk.note}`}
                  className={`flex-1 h-full relative rounded-b-lg border-x border-b border-stone-400/80 transition-all duration-75 cursor-pointer flex flex-col justify-end items-center pb-2.5 shadow-sm ${
                    isPressed
                      ? 'bg-[#c5a880] text-[#141518] translate-y-0.5 shadow-inner'
                      : isTarget
                      ? 'bg-emerald-200 hover:bg-emerald-300 text-[#141518] ring-2 ring-inset ring-emerald-500'
                      : 'bg-[#fdfcfa] hover:bg-[#f4efe6] text-[#141518]'
                  }`}
                >
                  {isTarget && (
                    <span className="mb-auto mt-24 sm:mt-28 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      Play
                    </span>
                  )}

                  {showKeyLabels && (
                    <div className="flex flex-col items-center pointer-events-none">
                      <span className="text-xs font-bold leading-none">
                        {wk.label}
                      </span>
                      <span className="text-[9px] font-mono text-stone-500 bg-black/5 px-1.5 py-0.5 rounded mt-1">
                        {wk.keyboardKey}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* 10 BLACK KEYS (Mathematically centered on the exact seam between white keys) */}
            {BLACK_KEYS.map((bk) => {
              const isPressed =
                activeNotes.has(bk.note) || activeNotes.has(bk.flatNote);
              const isTarget =
                !songCompleted &&
                (currentTargetStep?.note === bk.note ||
                  currentTargetStep?.note === bk.flatNote);

              // Seam position after `afterWhiteIndex` out of 14 equal white keys
              const leftPercent = ((bk.afterWhiteIndex + 1) / 14) * 100;

              return (
                <button
                  key={bk.note}
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    triggerNote(bk.note, false);
                  }}
                  aria-label={`Piano key ${bk.note}`}
                  style={{
                    left: `${leftPercent}%`,
                    width: '4.5%',
                  }}
                  className={`absolute top-0 -translate-x-1/2 h-[62%] rounded-b-md z-20 transition-all duration-75 cursor-pointer flex flex-col justify-end items-center pb-2 shadow-lg border-x border-b border-black ${
                    isPressed
                      ? 'bg-[#c5a880] text-[#141518] translate-y-0.5'
                      : isTarget
                      ? 'bg-emerald-400 text-[#141518] ring-2 ring-white'
                      : 'bg-gradient-to-b from-[#23262f] to-[#121318] hover:from-[#2e323d] hover:to-[#1a1c23] text-white'
                  }`}
                >
                  {showKeyLabels && (
                    <div className="flex flex-col items-center pointer-events-none">
                      <span
                        className={`text-[9px] font-mono font-bold leading-none ${
                          isPressed || isTarget ? 'text-[#141518]' : 'text-white/90'
                        }`}
                      >
                        {bk.shortLabel}
                      </span>
                      <span
                        className={`text-[8px] font-mono mt-0.5 ${
                          isPressed || isTarget ? 'text-[#141518]' : 'text-[#c5a880]'
                        }`}
                      >
                        {bk.keyboardKey}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. FOOTER STATUS BAR */}
      <div className="relative z-10 mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5c5f6a] px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#9e7a4b]" />
          <span>
            {lastPlayedNote ? (
              <>
                Last Played Note:{' '}
                <strong className="text-[#141518] font-mono">{lastPlayedNote}</strong>
              </>
            ) : (
              'Click the glowing emerald piano key (or press A–L on your keyboard) to play the song!'
            )}
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#8a6839]">
          2-Octave Grand Piano Range: C4 – B5
        </span>
      </div>
    </div>
  );
};
