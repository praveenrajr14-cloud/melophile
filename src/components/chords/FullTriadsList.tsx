import React, { useState, useMemo } from 'react';
import { soundEngine } from '../../utils/audioSynth';
import {
  Volume2,
  Play,
  Search,
  SlidersHorizontal,
  List,
  LayoutGrid,
  Sparkles,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export interface TriadItem {
  id: string;
  name: string;
  symbol: string;
  quality: 'Major' | 'Minor';
  formula: string;
  root: string;
  third: string;
  fifth: string;
  notes: string[];
  vibe: string;
  description: string;
  voicingTip: string;
  fifthsIndex: number; // 0 for C, 1 for G, etc.
  chromaticIndex: number; // 0 for C, 1 for C#, etc.
}

export const ALL_TRIADS: TriadItem[] = [
  // 12 MAJOR TRIADS
  {
    id: 'c-maj',
    name: 'C Major',
    symbol: 'C',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'C',
    third: 'E (Maj 3rd)',
    fifth: 'G (Perf 5th)',
    notes: ['C4', 'E4', 'G4'],
    vibe: 'Pure, resolute, luminous, home',
    description: 'The standard reference triad of Western tonal music. No accidentals.',
    voicingTip: 'Fingers 1-3-5 on white keys. Keep wrist buoyant and relaxed.',
    fifthsIndex: 0,
    chromaticIndex: 0,
  },
  {
    id: 'db-maj',
    name: 'D♭ / C♯ Major',
    symbol: 'D♭',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'D♭',
    third: 'F (Maj 3rd)',
    fifth: 'A♭ (Perf 5th)',
    notes: ['Db4', 'F4', 'Ab4'],
    vibe: 'Warm, opulent, romantic, velvety',
    description: 'A rich black-key foundation popular in Impressionism (Debussy, Chopin).',
    voicingTip: 'Black key root (Db), white key third (F), black key fifth (Ab).',
    fifthsIndex: 7,
    chromaticIndex: 1,
  },
  {
    id: 'd-maj',
    name: 'D Major',
    symbol: 'D',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'D',
    third: 'F♯ (Maj 3rd)',
    fifth: 'A (Perf 5th)',
    notes: ['D4', 'F#4', 'A4'],
    vibe: 'Bright, celebratory, triumphant, radiant',
    description: 'The key of brass and strings. Highly resonant and energetic.',
    voicingTip: 'White-Black-White configuration. Third finger naturally rests on F#4.',
    fifthsIndex: 2,
    chromaticIndex: 2,
  },
  {
    id: 'eb-maj',
    name: 'E♭ Major',
    symbol: 'E♭',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'E♭',
    third: 'G (Maj 3rd)',
    fifth: 'B♭ (Perf 5th)',
    notes: ['Eb4', 'G4', 'Bb4'],
    vibe: 'Heroic, majestic, solemn, spacious',
    description: 'Beethoven’s heroic key (Eroica Symphony). Deep and grounding.',
    voicingTip: 'Black-White-Black sandwich. Ergonomically snug under natural finger curves.',
    fifthsIndex: 9,
    chromaticIndex: 3,
  },
  {
    id: 'e-maj',
    name: 'E Major',
    symbol: 'E',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'E',
    third: 'G♯ (Maj 3rd)',
    fifth: 'B (Perf 5th)',
    notes: ['E4', 'G#4', 'B4'],
    vibe: 'Fiery, piercing, vibrant, ecstatic',
    description: 'The natural resonant key for guitars and bright acoustic keyboards.',
    voicingTip: 'White-Black-White. Raise middle finger gently to sit centered on G#4.',
    fifthsIndex: 4,
    chromaticIndex: 4,
  },
  {
    id: 'f-maj',
    name: 'F Major',
    symbol: 'F',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'F',
    third: 'A (Maj 3rd)',
    fifth: 'C (Perf 5th)',
    notes: ['F4', 'A4', 'C5'],
    vibe: 'Pastoral, calm, open, peaceful',
    description: 'All white keys. Associated with Beethoven’s Pastoral Symphony.',
    voicingTip: 'Broad span across F4 to C5. Ensure third finger on A is balanced.',
    fifthsIndex: 11,
    chromaticIndex: 5,
  },
  {
    id: 'fs-maj',
    name: 'F♯ / G♭ Major',
    symbol: 'F♯',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'F♯',
    third: 'A♯ (Maj 3rd)',
    fifth: 'C♯ (Perf 5th)',
    notes: ['F#4', 'A#4', 'C#5'],
    vibe: 'Ethereal, mystical, shimmering',
    description: 'Composed of 3 black keys. Unmatched tactile flow under the fingers.',
    voicingTip: 'All three tones are black keys! Extremely comfortable hand position.',
    fifthsIndex: 6,
    chromaticIndex: 6,
  },
  {
    id: 'g-maj',
    name: 'G Major',
    symbol: 'G',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'G',
    third: 'B (Maj 3rd)',
    fifth: 'D (Perf 5th)',
    notes: ['G4', 'B4', 'D5'],
    vibe: 'Earthy, rustic, cheerful, welcoming',
    description: 'The quintessential acoustic folk, pop, and classical dominant.',
    voicingTip: 'All white keys: G4, B4, D5. Crisp definition on the thumb.',
    fifthsIndex: 1,
    chromaticIndex: 7,
  },
  {
    id: 'ab-maj',
    name: 'A♭ Major',
    symbol: 'A♭',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'A♭',
    third: 'C (Maj 3rd)',
    fifth: 'E♭ (Perf 5th)',
    notes: ['Ab4', 'C5', 'Eb5'],
    vibe: 'Lush, soulful, romantic, nostalgic',
    description: 'Chopin’s favourite lyrical key. Foundation of modern soul & gospel.',
    voicingTip: 'Black-White-Black. Thumb on Ab4, index/middle on C5, pinky on Eb5.',
    fifthsIndex: 8,
    chromaticIndex: 8,
  },
  {
    id: 'a-maj',
    name: 'A Major',
    symbol: 'A',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'A',
    third: 'C♯ (Maj 3rd)',
    fifth: 'E (Perf 5th)',
    notes: ['A4', 'C#5', 'E5'],
    vibe: 'Passionate, energetic, optimistic',
    description: 'Luminous chamber key. Balanced between white and black key geometry.',
    voicingTip: 'White-Black-White. Let hand slide slightly forward into black key plane.',
    fifthsIndex: 3,
    chromaticIndex: 9,
  },
  {
    id: 'bb-maj',
    name: 'B♭ Major',
    symbol: 'B♭',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'B♭',
    third: 'D (Maj 3rd)',
    fifth: 'F (Perf 5th)',
    notes: ['Bb4', 'D5', 'F5'],
    vibe: 'Noble, grand, warm, cheerful',
    description: 'The standard brass & wind tuning key. Natural acoustic resonance.',
    voicingTip: 'Black-White-White. Thumb rests on Bb4 while fingers 3 and 5 take D and F.',
    fifthsIndex: 10,
    chromaticIndex: 10,
  },
  {
    id: 'b-maj',
    name: 'B Major',
    symbol: 'B',
    quality: 'Major',
    formula: '1 - 3 - 5',
    root: 'B',
    third: 'D♯ (Maj 3rd)',
    fifth: 'F♯ (Perf 5th)',
    notes: ['B4', 'D#5', 'F#5'],
    vibe: 'Piercing, glittering, intense, transcendent',
    description: 'Five sharps. Has a high emotional pitch and distinct overtone clarity.',
    voicingTip: 'White-Black-Black. Thumb on B4, 3 on D#5, 5 on F#5.',
    fifthsIndex: 5,
    chromaticIndex: 11,
  },

  // 12 MINOR TRIADS
  {
    id: 'c-min',
    name: 'C Minor',
    symbol: 'Cm',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'C',
    third: 'E♭ (Min 3rd)',
    fifth: 'G (Perf 5th)',
    notes: ['C4', 'Eb4', 'G4'],
    vibe: 'Dramatic, tragic, tempestuous, deep',
    description: 'Beethoven’s tragic struggle key (5th Symphony, Pathétique Sonata).',
    voicingTip: 'White-Black-White. Thumb on C4, middle finger on Eb4, pinky on G4.',
    fifthsIndex: 9,
    chromaticIndex: 0,
  },
  {
    id: 'cs-min',
    name: 'C♯ / D♭ Minor',
    symbol: 'C♯m',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'C♯',
    third: 'E (Min 3rd)',
    fifth: 'G♯ (Perf 5th)',
    notes: ['C#4', 'E4', 'G#4'],
    vibe: 'Poetic, melancholic, nocturnal',
    description: 'Beethoven’s Moonlight Sonata key. Intensely emotional and haunting.',
    voicingTip: 'Black-White-Black. Hand fits naturally with long middle finger on white E.',
    fifthsIndex: 4,
    chromaticIndex: 1,
  },
  {
    id: 'd-min',
    name: 'D Minor',
    symbol: 'Dm',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'D',
    third: 'F (Min 3rd)',
    fifth: 'A (Perf 5th)',
    notes: ['D4', 'F4', 'A4'],
    vibe: 'Somber, wistful, elegiac, serious',
    description: 'Mozart’s Requiem key. The most expressive minor key in classical history.',
    voicingTip: 'All white keys: D4, F4, A4. Maintain gentle curve across the knuckles.',
    fifthsIndex: 11,
    chromaticIndex: 2,
  },
  {
    id: 'eb-min',
    name: 'E♭ / D♯ Minor',
    symbol: 'E♭m',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'E♭',
    third: 'G♭ (Min 3rd)',
    fifth: 'B♭ (Perf 5th)',
    notes: ['Eb4', 'Gb4', 'Bb4'],
    vibe: 'Dark, ghostly, solemn, brooding',
    description: 'All 3 notes are black keys! Deep emotional resonance.',
    voicingTip: 'All three tones are black keys: Eb4, Gb4, Bb4. Silky, effortless feel.',
    fifthsIndex: 6,
    chromaticIndex: 3,
  },
  {
    id: 'e-min',
    name: 'E Minor',
    symbol: 'Em',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'E',
    third: 'G (Min 3rd)',
    fifth: 'B (Perf 5th)',
    notes: ['E4', 'G4', 'B4'],
    vibe: 'Introspective, delicate, mournful',
    description: 'Relative minor of G Major. Foundational in acoustic fingerstyle & rock.',
    voicingTip: 'All white keys: E4, G4, B4. Relax wrist downward for warm tone.',
    fifthsIndex: 1,
    chromaticIndex: 4,
  },
  {
    id: 'f-min',
    name: 'F Minor',
    symbol: 'Fm',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'F',
    third: 'A♭ (Min 3rd)',
    fifth: 'C (Perf 5th)',
    notes: ['F4', 'Ab4', 'C5'],
    vibe: 'Ominous, sorrowful, cinematic, deep',
    description: 'Known as the Minor Plagal chord (iv) in Pop, producing instant tears.',
    voicingTip: 'White-Black-White: F4 (thumb), Ab4 (middle), C5 (pinky).',
    fifthsIndex: 8,
    chromaticIndex: 5,
  },
  {
    id: 'fs-min',
    name: 'F♯ Minor',
    symbol: 'F♯m',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'F♯',
    third: 'A (Min 3rd)',
    fifth: 'C♯ (Perf 5th)',
    notes: ['F#4', 'A4', 'C#5'],
    vibe: 'Yearning, bittersweet, introspective',
    description: 'Relative minor of A Major. Famous in modern indie and film scores.',
    voicingTip: 'Black-White-Black. Rest the middle finger on white A4.',
    fifthsIndex: 3,
    chromaticIndex: 6,
  },
  {
    id: 'g-min',
    name: 'G Minor',
    symbol: 'Gm',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'G',
    third: 'B♭ (Min 3rd)',
    fifth: 'D (Perf 5th)',
    notes: ['G4', 'Bb4', 'D5'],
    vibe: 'Tragic, intense, lyrical, uneasy',
    description: 'Mozart’s tragic symphonic key (Symphony No. 40 in G Minor).',
    voicingTip: 'White-Black-White: G4, Bb4, D5. Balance weight over the Bb pivot.',
    fifthsIndex: 10,
    chromaticIndex: 7,
  },
  {
    id: 'gs-min',
    name: 'G♯ / A♭ Minor',
    symbol: 'G♯m',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'G♯',
    third: 'B (Min 3rd)',
    fifth: 'D♯ (Perf 5th)',
    notes: ['G#4', 'B4', 'D#5'],
    vibe: 'Eerie, shadowy, mysterious, poignant',
    description: 'Relative minor of B Major. Richly harmonic and enigmatic.',
    voicingTip: 'Black-White-Black: G#4, B4, D#5. Keep palm open and relaxed.',
    fifthsIndex: 5,
    chromaticIndex: 8,
  },
  {
    id: 'a-min',
    name: 'A Minor',
    symbol: 'Am',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'A',
    third: 'C (Min 3rd)',
    fifth: 'E (Perf 5th)',
    notes: ['A4', 'C5', 'E5'],
    vibe: 'Pensive, honest, natural, timeless',
    description: 'The purest minor triad in Western music. Relative minor to C Major.',
    voicingTip: 'All white keys: A4, C5, E5. The ultimate starting point for minor harmony.',
    fifthsIndex: 0,
    chromaticIndex: 9,
  },
  {
    id: 'bb-min',
    name: 'B♭ Minor',
    symbol: 'B♭m',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'B♭',
    third: 'D♭ (Min 3rd)',
    fifth: 'F (Perf 5th)',
    notes: ['Bb4', 'Db5', 'F5'],
    vibe: 'Funereal, mournful, heavy, profound',
    description: 'Chopin’s Funeral March key. Incredibly weighty and dark tone.',
    voicingTip: 'Black-Black-White: Bb4, Db5, F5. Excellent exercise in knuckle support.',
    fifthsIndex: 7,
    chromaticIndex: 10,
  },
  {
    id: 'b-min',
    name: 'B Minor',
    symbol: 'Bm',
    quality: 'Minor',
    formula: '1 - ♭3 - 5',
    root: 'B',
    third: 'D (Min 3rd)',
    fifth: 'F♯ (Perf 5th)',
    notes: ['B4', 'D5', 'F#5'],
    vibe: 'Solitary, austere, stoic, resigned',
    description: 'Bach’s Mass in B Minor. Combines classical restraint with quiet drama.',
    voicingTip: 'White-White-Black: B4, D5, F#5. Pinky reaches naturally to F#5.',
    fifthsIndex: 2,
    chromaticIndex: 11,
  },
];

interface FullTriadsListProps {
  onSelectChord: (chord: {
    id: string;
    name: string;
    symbol: string;
    formula: string;
    notes: string[];
    vibe: string;
    description: string;
    voicingTip: string;
  }) => void;
  selectedChordId?: string;
}

export const FullTriadsList: React.FC<FullTriadsListProps> = ({
  onSelectChord,
  selectedChordId,
}) => {
  const [filterQuality, setFilterQuality] = useState<'All' | 'Major' | 'Minor'>('All');
  const [sortBy, setSortBy] = useState<'fifths' | 'chromatic'>('fifths');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter & Sort Logic
  const filteredTriads = useMemo(() => {
    return ALL_TRIADS.filter((t) => {
      // Quality filter
      if (filterQuality !== 'All' && t.quality !== filterQuality) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesSymbol = t.symbol.toLowerCase().includes(q);
        const matchesRoot = t.root.toLowerCase().includes(q);
        const matchesNotes = t.notes.some((n) => n.toLowerCase().includes(q));
        const matchesVibe = t.vibe.toLowerCase().includes(q);
        return matchesName || matchesSymbol || matchesRoot || matchesNotes || matchesVibe;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'fifths') {
        return a.fifthsIndex - b.fifthsIndex;
      }
      return a.chromaticIndex - b.chromaticIndex;
    });
  }, [filterQuality, sortBy, searchQuery]);

  const handlePlay = (triad: TriadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playChord(triad.notes, 1.6, true);
    onSelectChord(triad);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#eae6de] p-6 sm:p-10 shadow-xs mb-14">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-[#eae6de] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#9e7a4b]" />
            <span>Complete Harmonic Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518]">
            Full Major & Minor Triads Directory
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5f6a] max-w-2xl mt-1">
            Browse all 24 foundational Western triads list-wise. Filter by Major or Minor, sort by Circle of Fifths or Chromatic scale, audition tones, and inspect finger placements.
          </p>
        </div>

        {/* Quality Counter Pill */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#eae6de] text-xs font-mono text-[#141518]">
            Showing <strong className="text-[#9e7a4b]">{filteredTriads.length}</strong> of 24 Triads
          </span>
        </div>
      </div>

      {/* Filter, Search & Layout Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Quality Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eae6de] shadow-2xs">
          {(['All', 'Major', 'Minor'] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                soundEngine.playClick(550);
                setFilterQuality(q);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                filterQuality === q
                  ? 'bg-[#141518] text-white font-semibold shadow-xs'
                  : 'text-[#5c5f6a] hover:text-[#141518] hover:bg-white'
              }`}
            >
              {q === 'All' ? 'All 24 Triads' : `${q} Triads (12)`}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#9e7a4b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by root, note, vibe..."
              className="w-full pl-9 pr-4 py-2 bg-[#faf8f5] border border-[#eae6de] rounded-xl text-xs text-[#141518] placeholder-[#9ca3af] focus:outline-none focus:border-[#9e7a4b] focus:ring-1 focus:ring-[#9e7a4b] transition-all"
            />
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-[#eae6de] text-xs">
            <span className="text-[11px] text-[#5c5f6a] px-2 font-medium hidden sm:inline">
              Sort:
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setSortBy('fifths');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === 'fifths'
                  ? 'bg-[#141518] text-white font-semibold'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              Circle of 5ths
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setSortBy('chromatic');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === 'chromatic'
                  ? 'bg-[#141518] text-white font-semibold'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              Chromatic
            </button>
          </div>

          {/* View Mode Toggle (List vs Grid) */}
          <div className="flex items-center bg-[#faf8f5] p-1 rounded-xl border border-[#eae6de]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#141518] text-white'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#141518] text-white'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: STRUCTURED LIST-WISE VIEW (TABLE / ROWS) */}
      {viewMode === 'list' ? (
        <div className="overflow-x-auto rounded-2xl border border-[#eae6de]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] border-b border-[#eae6de] text-[11px] font-mono uppercase tracking-wider text-[#5c5f6a]">
                <th className="py-3.5 px-4 font-semibold">Chord</th>
                <th className="py-3.5 px-3 font-semibold">Quality</th>
                <th className="py-3.5 px-3 font-semibold">Formula</th>
                <th className="py-3.5 px-4 font-semibold">Notes (Spelling)</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Acoustic Character / Vibe</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae6de] text-xs">
              {filteredTriads.map((triad) => {
                const isSelected = selectedChordId === triad.id;
                return (
                  <tr
                    key={triad.id}
                    onClick={() => handlePlay(triad)}
                    className={`group transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#f4efe6]/80'
                        : 'hover:bg-[#faf8f5]'
                    }`}
                  >
                    {/* Chord Symbol & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#faf8f5] group-hover:bg-[#141518] group-hover:text-white border border-[#eae6de] flex items-center justify-center font-serif font-bold text-sm text-[#141518] transition-colors shrink-0 shadow-2xs">
                          {triad.symbol}
                        </span>
                        <div>
                          <div className="font-semibold text-[#141518] text-sm">
                            {triad.name}
                          </div>
                          <div className="text-[10px] text-[#5c5f6a] font-mono">
                            Root: {triad.root}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quality Badge */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          triad.quality === 'Major'
                            ? 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-800 border border-indigo-500/20'
                        }`}
                      >
                        {triad.quality}
                      </span>
                    </td>

                    {/* Formula */}
                    <td className="py-3.5 px-3 font-mono font-medium text-[#141518]">
                      {triad.formula}
                    </td>

                    {/* Notes Breakdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {triad.notes.map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#faf8f5] border border-[#eae6de] font-mono text-[11px] font-semibold text-[#141518]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Vibe / Emotion */}
                    <td className="py-3.5 px-4 text-[#5c5f6a] hidden md:table-cell">
                      <span className="italic">"{triad.vibe}"</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => handlePlay(triad, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-medium cursor-pointer transition-all shadow-xs shrink-0 group-hover:scale-105"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Audition</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW 2: COMPACT CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTriads.map((triad) => {
            const isSelected = selectedChordId === triad.id;
            return (
              <div
                key={triad.id}
                onClick={() => handlePlay(triad)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#f4efe6] border-[#b89562] shadow-sm'
                    : 'bg-[#faf8f5] hover:bg-white border-[#eae6de] hover:border-[#b89562]/50 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-serif font-bold text-[#141518]">
                      {triad.symbol}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        triad.quality === 'Major'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {triad.quality}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#141518]">
                    {triad.name}
                  </h4>
                  <div className="text-[11px] font-mono text-[#5c5f6a] mt-0.5">
                    Formula: <strong className="text-[#141518]">{triad.formula}</strong>
                  </div>

                  {/* Notes badges */}
                  <div className="flex items-center gap-1.5 my-3">
                    {triad.notes.map((n, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#eae6de] text-xs font-mono font-semibold text-[#141518]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#5c5f6a] leading-relaxed italic line-clamp-2">
                    "{triad.vibe}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eae6de] flex items-center justify-between">
                  <span className="text-[10px] text-[#5c5f6a]">
                    Root: <strong className="text-[#141518]">{triad.root}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handlePlay(triad, e)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#9e7a4b] hover:text-[#141518] transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTriads.length === 0 && (
        <div className="text-center py-12 text-[#5c5f6a]">
          <p className="text-sm">No triads found matching "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-[#9e7a4b] underline cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
};
