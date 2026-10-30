import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioSynth';
import {
  Sparkles,
  Volume2,
  Play,
  ArrowRight,
  GitMerge,
  Info,
  Layers,
  ChevronRight,
  Wand2,
  Music,
} from 'lucide-react';
import { ChordTransposerTool } from './ChordTransposerTool';

interface PassingChordsSectionProps {
  onSelectChordForPiano?: (name: string, symbol: string, notes: string[], formula: string) => void;
}

interface CadenceExample {
  id: string;
  name: string;
  level: 'Basic' | 'Intermediate' | 'Pro';
  levelColor: string;
  genre: string;
  plainChords: { name: string; notes: string[] }[];
  passingChords: { name: string; notes: string[]; isPassing?: boolean }[];
  explanation: string;
}

const PASSING_CADENCES: CadenceExample[] = [
  {
    id: 'cadence-1',
    name: 'The Gentle Bass Walk-Down (I → vi)',
    level: 'Basic',
    levelColor: '#10b981',
    genre: 'Pop, Acoustic, Folk, "Let It Be", "Count on Me"',
    plainChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'Am', notes: ['A3', 'C4', 'E4'] },
    ],
    passingChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'G/B', notes: ['B3', 'D4', 'G4'], isPassing: true },
      { name: 'Am', notes: ['A3', 'C4', 'E4'] },
    ],
    explanation:
      'Instead of leaping from root C down to A, the G/B chord places B in the bass, creating a step-by-step scalar walk-down: C → B → A.',
  },
  {
    id: 'cadence-2',
    name: 'Secondary Dominant Pull (I → V7/ii → ii)',
    level: 'Intermediate',
    levelColor: '#f59e0b',
    genre: 'Soul, R&B, Jazz, Stevie Wonder, Motown',
    plainChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'Dm', notes: ['D4', 'F4', 'A4'] },
    ],
    passingChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'A7', notes: ['A3', 'C#4', 'E4', 'G4'], isPassing: true },
      { name: 'Dm', notes: ['D4', 'F4', 'A4'] },
    ],
    explanation:
      'A7 is the dominant 5th of Dm. Its sharp 3rd (C#) acts as a leading tone that pulls magnetically upward into D.',
  },
  {
    id: 'cadence-3',
    name: 'Chromatic Diminished Step (I → #I°7 → ii)',
    level: 'Pro',
    levelColor: '#a855f7',
    genre: 'Gospel, Neo-Soul, Jazz Standards, Broadway',
    plainChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'Dm', notes: ['D4', 'F4', 'A4'] },
    ],
    passingChords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'C#dim7', notes: ['C#4', 'E4', 'G4', 'Bb4'], isPassing: true },
      { name: 'Dm', notes: ['D4', 'F4', 'A4'] },
    ],
    explanation:
      'The definitive gospel passing chord! C#dim7 slides chromatically by a single semitone, adding intense harmonic tension before melting into Dm.',
  },
  {
    id: 'cadence-4',
    name: 'The Church Soul Cadence (IV → #IV°7 → I/V)',
    level: 'Pro',
    levelColor: '#a855f7',
    genre: 'Gospel, Traditional Church, Jazz Ballads',
    plainChords: [
      { name: 'F', notes: ['F4', 'A4', 'C5'] },
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
    ],
    passingChords: [
      { name: 'F', notes: ['F4', 'A4', 'C5'] },
      { name: 'F#dim7', notes: ['F#4', 'A4', 'C5', 'Eb5'], isPassing: true },
      { name: 'C/G', notes: ['G3', 'C4', 'E4', 'G4'] },
    ],
    explanation:
      'F#dim7 connects the IV chord (F) to the tonic chord over the fifth bass (C/G). Highly soulful and emotional.',
  },
];

export const PassingChordsSection: React.FC<PassingChordsSectionProps> = ({
  onSelectChordForPiano,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'soundboard' | 'transposer'>('theory');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Audio Playback Helpers
  const playChordSequence = (
    cadenceId: string,
    chords: { name: string; notes: string[]; isPassing?: boolean }[],
    type: 'plain' | 'passing'
  ) => {
    const playKey = `${cadenceId}-${type}`;
    if (playingId === playKey) return;
    setPlayingId(playKey);
    soundEngine.playClick(800);

    chords.forEach((ch, idx) => {
      setTimeout(() => {
        soundEngine.playChord(ch.notes, 1.1, true);
        if (idx === chords.length - 1) {
          setTimeout(() => setPlayingId(null), 1200);
        }
      }, idx * 1050);
    });
  };

  return (
    <div id="passing-chords" className="space-y-8 scroll-mt-28">
      {/* Category Header */}
      <div className="bg-[#141518] rounded-3xl p-6 sm:p-9 border border-white/10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Harmonic Stepping Stones • 3 Skill Levels</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight mb-3">
            Passing Chords Studio: The Secret to Smooth Harmony
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] max-w-3xl leading-relaxed">
            Passing chords are short harmonic bridges inserted between two destination chords. They transform
            stiff, predictable progressions into flowing, emotional, professional music!
          </p>

          {/* Sub-Category Pills */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setActiveSubTab('theory')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubTab === 'theory'
                  ? 'bg-emerald-500 text-[#141518] font-bold shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>1. Passing Theory &amp; 3 Levels</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('soundboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubTab === 'soundboard'
                  ? 'bg-emerald-500 text-[#141518] font-bold shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>2. Before vs. After Audio Soundboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transposer')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubTab === 'transposer'
                  ? 'bg-emerald-500 text-[#141518] font-bold shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>3. Song Transposer with Passing Chords Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Category 1: Theory & 3 Levels */}
      {activeSubTab === 'theory' && (
        <div className="bg-white rounded-3xl border border-[#eae6de] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              THE 3 LEVELS OF PASSING CHORDS
            </span>
            <h3 className="text-2xl font-serif font-medium text-[#141518]">
              How Passing Chords Connect the Harmonic Dots
            </h3>
            <p className="text-sm text-[#5c5f6a] mt-1 max-w-3xl leading-relaxed">
              Whenever two chords are more than a half-step apart, there is an opportunity to insert a
              passing chord. Depending on the musical genre and taste, you can choose from 3 levels:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1: Basic */}
            <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600">LEVEL 1 • BASIC</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Diatonic Step
                  </span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#141518] mt-2">
                  Scalar Bass Walk-Downs
                </h4>
                <p className="text-xs text-[#5c5f6a] leading-relaxed">
                  Uses natural scale degrees and chord inversions to step down smoothly.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#e5dcce] font-mono text-xs text-[#141518] mt-2">
                  Example: <strong>C → G/B → Am</strong>
                  <div className="text-[10px] text-[#5c5f6a] font-sans mt-1">
                    Bass movement: C (root) → B (step) → A (destination)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#8a6839]">
                💡 Ideal for pop ballads, worship, folk, acoustic singer-songwriter.
              </p>
            </div>

            {/* Level 2: Intermediate */}
            <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600">LEVEL 2 • INTERMEDIATE</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Secondary Dominant
                  </span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#141518] mt-2">
                  V7 Pulls to Target Chord
                </h4>
                <p className="text-xs text-[#5c5f6a] leading-relaxed">
                  Inserts the dominant 7th of the upcoming chord, using tritone tension to pull into it.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#e5dcce] font-mono text-xs text-[#141518] mt-2">
                  Example: <strong>C → A7 → Dm</strong>
                  <div className="text-[10px] text-[#5c5f6a] font-sans mt-1">
                    A7 is the dominant V7 of Dm. Its C# leads right up to D!
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#8a6839]">
                💡 Ideal for soul, R&amp;B, Motown, Broadway, classic 60s pop.
              </p>
            </div>

            {/* Level 3: Pro */}
            <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-600">LEVEL 3 • PRO</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Chromatic Diminished
                  </span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#141518] mt-2">
                  Half-Step Diminished Slides
                </h4>
                <p className="text-xs text-[#5c5f6a] leading-relaxed">
                  Sliding into the target chord using a sharp diminished 7th (#I°7 or #IV°7) or tritone sub.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#e5dcce] font-mono text-xs text-[#141518] mt-2">
                  Example: <strong>C → C#dim7 → Dm</strong>
                  <div className="text-[10px] text-[#5c5f6a] font-sans mt-1">
                    C#dim7 creates a rich, chromatic half-step slide into Dm.
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#8a6839]">
                💡 Ideal for gospel piano, neo-soul keyboards, jazz standards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Category 2: Before vs After Audio Soundboard */}
      {activeSubTab === 'soundboard' && (
        <div className="bg-white rounded-3xl border border-[#eae6de] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              LIVE AUDIO AUDITION
            </span>
            <h3 className="text-2xl font-serif font-medium text-[#141518]">
              Hear the Difference: Plain vs. Passing Chords
            </h3>
            <p className="text-sm text-[#5c5f6a] mt-1 max-w-2xl leading-relaxed">
              Listen to the exact same chord change played plain versus with an expressive passing chord
              inserted. Notice how the passing chord bridges the gap!
            </p>
          </div>

          <div className="space-y-4">
            {PASSING_CADENCES.map((cad) => (
              <div
                key={cad.id}
                className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white"
                      style={{ backgroundColor: cad.levelColor }}
                    >
                      {cad.level}
                    </span>
                    <h4 className="font-serif font-medium text-base text-[#141518]">{cad.name}</h4>
                  </div>
                  <p className="text-xs text-[#5c5f6a]">{cad.explanation}</p>
                  <p className="text-[11px] text-[#8a6839] font-mono">Found in: {cad.genre}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Play Plain */}
                  <button
                    type="button"
                    onClick={() => playChordSequence(cad.id, cad.plainChords, 'plain')}
                    disabled={playingId !== null}
                    className="px-3.5 py-2 rounded-xl border border-[#e5dcce] bg-white hover:bg-[#ede5d8] text-[#141518] text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-[#5c5f6a]" />
                    <span>Plain ({cad.plainChords.map((c) => c.name).join(' → ')})</span>
                  </button>

                  {/* Play with Passing Chord */}
                  <button
                    type="button"
                    onClick={() => playChordSequence(cad.id, cad.passingChords, 'passing')}
                    disabled={playingId !== null}
                    className="px-4 py-2 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm ring-1 ring-emerald-500/50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>With Passing ({cad.passingChords.map((c) => c.name).join(' → ')})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Category 3: Song Transposer in Passing Mode */}
      {activeSubTab === 'transposer' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Passing Chords Mode is Pre-Activated!</strong> The transposer below automatically
                inserts passing chords with green badges into song lyrics.
              </span>
            </div>
          </div>
          <ChordTransposerTool
            initialEnablePassingChords={true}
            initialPassingLevel="intermediate"
            onSelectChordForPiano={onSelectChordForPiano}
          />
        </div>
      )}
    </div>
  );
};
