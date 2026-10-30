import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth';
import {
  BookOpen,
  Music,
  Play,
  Square,
  Volume2,
  CheckCircle,
  Sparkles,
  Award,
  RefreshCw,
  HelpCircle,
  Info,
  Clock,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Zap,
  Layers,
  Flame,
} from 'lucide-react';
import {
  StaffNote,
  TREBLE_STAFF_NOTES,
  BASS_STAFF_NOTES,
  NOTE_DURATIONS,
  KEY_SIGNATURES_LIST,
  TIME_SIGNATURES_LIST,
  KeySignatureData,
  TimeSignatureItem,
} from './staff/staffData';
import {
  TrebleClefSvg,
  BassClefSvg,
  WholeNoteSvg,
  HalfNoteSvg,
  QuarterNoteSvg,
  EighthNoteSvg,
  SixteenthNoteSvg,
  BeamedEighthsSvg,
  WholeRestSvg,
  HalfRestSvg,
  QuarterRestSvg,
  EighthRestSvg,
  SixteenthRestSvg,
  SharpSvg,
  FlatSvg,
  NaturalSvg,
  FermataSvg,
  NoteAnatomySvg,
  StemRuleDiagramSvg,
  BarLinesSvg,
  KeySignatureStaffSvg,
} from './staff/MusicalSymbols';

// ============================================================================
// CURRICULUM DEFINITIONS: 6 CATEGORIES WITH FOCUSED SUB-CATEGORIES
// ============================================================================

export type MainCategoryKey =
  | 'staff-clefs'
  | 'notes-rests'
  | 'symbols-markings'
  | 'key-signatures'
  | 'time-signatures'
  | 'trainer-game';

interface SubCategoryItem {
  id: string;
  numberStr: string; // e.g. "1.1", "1.2"
  title: string;
  badge: string;
  description: string;
}

interface MainCategoryItem {
  key: MainCategoryKey;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  subCategories: SubCategoryItem[];
}

export const ACADEMY_CATEGORIES: MainCategoryItem[] = [
  {
    key: 'staff-clefs',
    number: 1,
    title: 'The Staff & Clefs',
    shortTitle: 'Staff & Clefs',
    subtitle: 'The 5 lines, 4 spaces, Treble & Bass clefs, and the Grand Staff',
    icon: '🏛️',
    subCategories: [
      {
        id: 'lines-spaces',
        numberStr: '1.1',
        title: 'The 5 Lines & 4 Spaces',
        badge: 'Fundamental',
        description: 'How pitch moves vertically: high vs low, numbered bottom to top.',
      },
      {
        id: 'treble-clef',
        numberStr: '1.2',
        title: 'Treble Clef (G-Clef)',
        badge: 'Right Hand',
        description: 'High register, line 2 G4 curl, E-G-B-D-F and F-A-C-E mnemonics.',
      },
      {
        id: 'bass-clef',
        numberStr: '1.3',
        title: 'Bass Clef (F-Clef)',
        badge: 'Left Hand',
        description: 'Low register, line 4 F3 dots, G-B-D-F-A and A-C-E-G mnemonics.',
      },
      {
        id: 'grand-staff',
        numberStr: '1.4',
        title: 'The Grand Staff & Middle C',
        badge: 'Piano Score',
        description: 'Treble and Bass staves linked by the brace and ledger line bridge.',
      },
      {
        id: 'interactive-soundboard',
        numberStr: '1.5',
        title: 'Interactive Staff Soundboard',
        badge: 'Live Audio',
        description: 'Click any notehead on the engraved staff to audition true piano pitch.',
      },
    ],
  },
  {
    key: 'notes-rests',
    number: 2,
    title: 'Notes & Rests',
    shortTitle: 'Notes & Rests',
    subtitle: 'The duration pyramid, note anatomy, stem rules, and musical silence',
    icon: '🎵',
    subCategories: [
      {
        id: 'note-anatomy',
        numberStr: '2.1',
        title: 'Note Anatomy & Stem Rules',
        badge: 'Engraving Rules',
        description: 'Notehead, stem, flag, beam, and the Line 3 stem direction rule.',
      },
      {
        id: 'duration-pyramid',
        numberStr: '2.2',
        title: 'Note Values Duration Pyramid',
        badge: 'Rhythm Engine',
        description: 'Whole, Half, Quarter, 8th, and 16th notes with exact beat durations.',
      },
      {
        id: 'musical-rests',
        numberStr: '2.3',
        title: 'Musical Rests (Silence)',
        badge: 'Sound of Silence',
        description: 'The visual shapes of rests and memory tricks: Hole in Ground vs Top Hat.',
      },
      {
        id: 'dotted-ties',
        numberStr: '2.4',
        title: 'Dotted Notes, Ties & Beams',
        badge: 'Expressive Timing',
        description: 'The +50% dotted note rule, ties vs slurs, and beamed note groupings.',
      },
    ],
  },
  {
    key: 'symbols-markings',
    number: 3,
    title: 'Symbols & Markings',
    shortTitle: 'Symbols & Roadmap',
    subtitle: 'Accidentals (♯, ♭, ♮), dynamics (pp to ff), articulations, and navigation',
    icon: '🔣',
    subCategories: [
      {
        id: 'accidentals',
        numberStr: '3.1',
        title: 'Accidentals (♯, ♭, ♮)',
        badge: 'Pitch Modifiers',
        description: 'Sharps, Flats, Naturals, Double Sharps, and Double Flats explained visually.',
      },
      {
        id: 'dynamics',
        numberStr: '3.2',
        title: 'Dynamics (Volume $p \\to f$)',
        badge: 'Expressive Volume',
        description: 'Italian terms from Pianissimo (pp) to Fortissimo (ff) with hairpins.',
      },
      {
        id: 'articulations',
        numberStr: '3.3',
        title: 'Articulations & Touch',
        badge: 'Touch & Style',
        description: 'Staccato dot, Accent punch, Tenuto weight, and Fermata pause.',
      },
      {
        id: 'bar-lines',
        numberStr: '3.4',
        title: 'Bar Lines & Repeat Signs',
        badge: 'Sheet Navigation',
        description: 'Measures, double bars, final bars, repeat signs (:||), and Coda jumps.',
      },
    ],
  },
  {
    key: 'key-signatures',
    number: 4,
    title: 'Key Signatures',
    shortTitle: 'Key Signatures',
    subtitle: 'The road map of keys: order of sharps and flats, reading rules, and engraved staves',
    icon: '🔑',
    subCategories: [
      {
        id: 'why-key-signatures',
        numberStr: '4.1',
        title: 'Why Key Signatures Exist',
        badge: 'Clutter-Free Score',
        description: 'How key signatures eliminate accidental clutter and establish the tonal home.',
      },
      {
        id: 'sharps-rule',
        numberStr: '4.2',
        title: 'The Sharp Keys System (♯)',
        badge: 'Father Charles Rule',
        description: 'The order of sharps and the secret "last sharp + 1/2 step up" trick.',
      },
      {
        id: 'flats-rule',
        numberStr: '4.3',
        title: 'The Flat Keys System (♭)',
        badge: 'Battle Ends Rule',
        description: 'The order of flats and the secret "penultimate (2nd-to-last) flat" trick.',
      },
      {
        id: 'interactive-key-visualizer',
        numberStr: '4.4',
        title: 'Interactive Key Signature Staff',
        badge: '11 Keys & Audio',
        description: 'Engraved staff with sharps/flats, 8-note scale audio, and tonic chord.',
      },
    ],
  },
  {
    key: 'time-signatures',
    number: 5,
    title: 'Time Signatures & Meter',
    shortTitle: 'Time & Meter',
    subtitle: 'The pulse, top vs bottom numbers, common time, and live metronome',
    icon: '⏱️',
    subCategories: [
      {
        id: 'time-anatomy',
        numberStr: '5.1',
        title: 'Anatomy of Time Signatures',
        badge: 'Top vs Bottom',
        description: 'Top number = how many beats; Bottom number = note type for 1 beat.',
      },
      {
        id: 'common-time',
        numberStr: '5.2',
        title: 'Common Time (C) & Cut Time (¢)',
        badge: 'Classical Symbols',
        description: 'The history and meaning behind the classic semicircle symbols.',
      },
      {
        id: 'core-meters',
        numberStr: '5.3',
        title: 'The 4 Core Musical Meters',
        badge: '4/4, 3/4, 2/4, 6/8',
        description: 'Comparing Quadruple, Triple Waltz, March Duple, and Compound Swing.',
      },
      {
        id: 'live-metronome',
        numberStr: '5.4',
        title: 'Live Metronome Pulse Player',
        badge: 'Interactive Pulse',
        description: 'Listen to each meter with accented Beat 1 downbeat and bouncing tempo dots.',
      },
    ],
  },
  {
    key: 'trainer-game',
    number: 6,
    title: 'Sight-Reading Trainer',
    shortTitle: 'Practice Game',
    subtitle: 'Test your sheet music reading skills with random notes, sound, and score streaks',
    icon: '🎯',
    subCategories: [
      {
        id: 'treble-quiz',
        numberStr: '6.1',
        title: 'Treble Clef Challenge',
        badge: 'Melody Reading',
        description: 'Flashcard notes on Treble staff with instant piano sound & mnemonic hints.',
      },
      {
        id: 'bass-quiz',
        numberStr: '6.2',
        title: 'Bass Clef Challenge',
        badge: 'Bass Reading',
        description: 'Flashcard notes on Bass staff to build confidence in the low register.',
      },
      {
        id: 'high-score-streak',
        numberStr: '6.3',
        title: 'Streak Challenge & Score',
        badge: 'Mastery',
        description: 'Compete for the highest consecutive streak with celebratory fireworks!',
      },
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StaffNotationSection: React.FC = () => {
  // Navigation State
  const [activeCategoryKey, setActiveCategoryKey] = useState<MainCategoryKey>('staff-clefs');
  const [activeSubId, setActiveSubId] = useState<string>('lines-spaces');

  // Category 1 State: Active Staff Note for Soundboard
  const [activeClef, setActiveClef] = useState<'treble' | 'bass'>('treble');
  const [selectedStaffNote, setSelectedStaffNote] = useState<StaffNote>(TREBLE_STAFF_NOTES[0]);

  // Category 4 State: Active Key Signature
  const [selectedKeySig, setSelectedKeySig] = useState<KeySignatureData>(KEY_SIGNATURES_LIST[0]);
  const [isPlayingScale, setIsPlayingScale] = useState(false);

  // Category 5 State: Active Time Signature & Metronome
  const [selectedTimeSig, setSelectedTimeSig] = useState<TimeSignatureItem>(TIME_SIGNATURES_LIST[0]);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [activeBeatIndex, setActiveBeatIndex] = useState(-1);

  // Category 6 State: Interactive Note Quiz
  const [quizClef, setQuizClef] = useState<'treble' | 'bass'>('treble');
  const [quizTargetNote, setQuizTargetNote] = useState<StaffNote>(TREBLE_STAFF_NOTES[4]); // G4 default
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  const metronomeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      scaleTimeoutRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // When changing category, set sub-category to the first one in that category
  const handleSelectCategory = (catKey: MainCategoryKey) => {
    soundEngine.playClick(750);
    setActiveCategoryKey(catKey);
    const cat = ACADEMY_CATEGORIES.find((c) => c.key === catKey);
    if (cat && cat.subCategories.length > 0) {
      setActiveSubId(cat.subCategories[0].id);
    }
  };

  const handleSelectSubCategory = (subId: string) => {
    soundEngine.playClick(680);
    setActiveSubId(subId);
  };

  // Find active category & sub-category objects
  const currentCategory =
    ACADEMY_CATEGORIES.find((c) => c.key === activeCategoryKey) || ACADEMY_CATEGORIES[0];
  const currentSubIndex = currentCategory.subCategories.findIndex((s) => s.id === activeSubId);
  const currentSub =
    currentCategory.subCategories[currentSubIndex >= 0 ? currentSubIndex : 0];

  // Next / Previous Navigation Helpers
  const handleNextLesson = () => {
    soundEngine.playClick(820);
    if (currentSubIndex < currentCategory.subCategories.length - 1) {
      setActiveSubId(currentCategory.subCategories[currentSubIndex + 1].id);
    } else {
      // Advance to next Category
      const nextCatIdx = ACADEMY_CATEGORIES.findIndex((c) => c.key === activeCategoryKey) + 1;
      if (nextCatIdx < ACADEMY_CATEGORIES.length) {
        const nextCat = ACADEMY_CATEGORIES[nextCatIdx];
        setActiveCategoryKey(nextCat.key);
        setActiveSubId(nextCat.subCategories[0].id);
      }
    }
  };

  const handlePrevLesson = () => {
    soundEngine.playClick(620);
    if (currentSubIndex > 0) {
      setActiveSubId(currentCategory.subCategories[currentSubIndex - 1].id);
    } else {
      // Step back to previous Category
      const prevCatIdx = ACADEMY_CATEGORIES.findIndex((c) => c.key === activeCategoryKey) - 1;
      if (prevCatIdx >= 0) {
        const prevCat = ACADEMY_CATEGORIES[prevCatIdx];
        setActiveCategoryKey(prevCat.key);
        setActiveSubId(prevCat.subCategories[prevCat.subCategories.length - 1].id);
      }
    }
  };

  // Play single note on the staff
  const handlePlayStaffNote = (note: StaffNote) => {
    soundEngine.playClick(620);
    soundEngine.playChord([note.noteName], 1.6, false);
    setSelectedStaffNote(note);
  };

  // Play Note Duration
  const handleAuditionDuration = (dur: (typeof NOTE_DURATIONS)[0]) => {
    soundEngine.playClick(700);
    const seconds = dur.beats * 0.75; // 0.75s per beat (80 BPM)
    soundEngine.playChord(['C4'], seconds, false);
  };

  // Play Key Scale
  const handlePlayKeyScale = (keyData: KeySignatureData) => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);
    soundEngine.playClick(800);

    scaleTimeoutRef.current.forEach((t) => clearTimeout(t));
    scaleTimeoutRef.current = [];

    const notes = keyData.scaleNotes;
    notes.forEach((note, idx) => {
      const t = setTimeout(() => {
        soundEngine.playChord([note], 0.65, false);
        if (idx === notes.length - 1) {
          setTimeout(() => setIsPlayingScale(false), 800);
        }
      }, idx * 280);
      scaleTimeoutRef.current.push(t);
    });
  };

  // Play Tonic Triad
  const handlePlayHomeChord = (keyData: KeySignatureData) => {
    soundEngine.playClick(720);
    const root = keyData.scaleNotes[0];
    const third = keyData.scaleNotes[2];
    const fifth = keyData.scaleNotes[4];
    soundEngine.playChord([root, third, fifth], 2.0, true);
  };

  // Metronome Beat Player
  const toggleMetronome = (tsItem: TimeSignatureItem) => {
    if (isMetronomeActive && selectedTimeSig.id === tsItem.id) {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
      setIsMetronomeActive(false);
      setActiveBeatIndex(-1);
      return;
    }

    if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    setSelectedTimeSig(tsItem);
    setIsMetronomeActive(true);

    const bpm = tsItem.top === 6 ? 140 : 96;
    const intervalMs = (60 / bpm) * 1000;
    let step = 0;

    const playCurrentBeat = () => {
      const beatInfo = tsItem.beatsArray[step];
      if (beatInfo.accent) {
        soundEngine.playClick(1050); // High accent click on downbeat
      } else {
        soundEngine.playClick(680); // Softer click on weak beats
      }
      setActiveBeatIndex(step);
      step = (step + 1) % tsItem.beatsArray.length;
    };

    playCurrentBeat();
    metronomeTimerRef.current = setInterval(playCurrentBeat, intervalMs);
  };

  // Trainer Game Logic
  const handleNextQuizQuestion = (clefOverride?: 'treble' | 'bass') => {
    const activeClefForQuiz = clefOverride || quizClef;
    const noteList = activeClefForQuiz === 'treble' ? TREBLE_STAFF_NOTES : BASS_STAFF_NOTES;
    const randomIndex = Math.floor(Math.random() * noteList.length);
    setQuizTargetNote(noteList[randomIndex]);
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (letterChoice: string) => {
    const isCorrect = letterChoice.toUpperCase() === quizTargetNote.letter.toUpperCase();
    setQuizTotal((prev) => prev + 1);

    if (isCorrect) {
      soundEngine.playClick(850);
      soundEngine.playChord([quizTargetNote.noteName], 1.2, false);
      const newScore = quizScore + 1;
      const newStreak = quizStreak + 1;
      setQuizScore(newScore);
      setQuizStreak(newStreak);
      setQuizFeedback({
        correct: true,
        text: `Spot on! That is indeed ${quizTargetNote.noteName} (${quizTargetNote.mnemonic}). Streak: ${newStreak}!`,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#c5a880', '#10b981', '#ffffff'],
        });
      } catch {
        // Ignored
      }

      setTimeout(() => {
        handleNextQuizQuestion();
      }, 1400);
    } else {
      soundEngine.playClick(320);
      setQuizStreak(0);
      setQuizFeedback({
        correct: false,
        text: `Not quite! Hint: Look at ${quizTargetNote.clef === 'treble' ? 'Treble' : 'Bass'} ${
          quizTargetNote.positionType === 'line'
            ? `Line ${quizTargetNote.lineOrSpaceNumber}`
            : quizTargetNote.positionType === 'space'
            ? `Space ${quizTargetNote.lineOrSpaceNumber}`
            : 'Ledger line'
        }. Try again!`,
      });
    }
  };

  return (
    <section id="staff-notation" className="relative mb-20 scroll-mt-28">
      {/* SECTION HEADER */}
      <div className="bg-[#141518] text-white rounded-3xl p-6 sm:p-9 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.3)] mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-[#c5a880] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Staff Notation Academy • Step-by-Step Curriculum</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight mb-3">
            Introduction to Staff Notation &amp; Sheet Music
          </h2>
          <p className="text-sm sm:text-base text-[#9ca3af] max-w-3xl leading-relaxed">
            Staff notation is the 500-year-old international language of music. We have divided every
            concept into clean, bite-sized categories and lessons with authentic vector symbols,
            interactive audio, and clear memory tricks!
          </p>
        </div>

        {/* 1. TOP LEVEL: CATEGORY SELECTOR TABS */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9ca3af] font-semibold">
              Select Curriculum Category:
            </span>
            <span className="text-xs text-[#c5a880] font-mono">
              Category {currentCategory.number} of {ACADEMY_CATEGORIES.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ACADEMY_CATEGORIES.map((cat) => {
              const isActive = cat.key === activeCategoryKey;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleSelectCategory(cat.key)}
                  className={`flex flex-col items-start text-left p-3 rounded-2xl transition-all cursor-pointer border relative ${
                    isActive
                      ? 'bg-[#c5a880] text-[#141518] border-[#c5a880] shadow-lg font-bold scale-[1.02]'
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-base">{cat.icon}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#141518]/20 text-[#141518]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      Cat 0{cat.number}
                    </span>
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {cat.shortTitle}
                  </span>
                  <span
                    className={`text-[10px] mt-1 leading-none ${
                      isActive ? 'text-[#141518]/80' : 'text-[#9ca3af]'
                    }`}
                  >
                    {cat.subCategories.length} Lessons
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. SUB-CATEGORY NAVIGATION PILLS & BREADCRUMB */}
      <div className="bg-white rounded-3xl border border-[#eae6de] p-5 sm:p-7 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eae6de]">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#5c5f6a]">
            <span className="text-[#8a6839] font-semibold">{currentCategory.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span className="font-mono text-[#141518] font-bold">
              Lesson {currentSub.numberStr}: {currentSub.title}
            </span>
          </div>

          {/* Lesson Counter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-[#f4efe6] text-[#8a6839] font-semibold">
              Lesson {currentSubIndex + 1} of {currentCategory.subCategories.length}
            </span>
          </div>
        </div>

        {/* Sub-Category Lesson Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {currentCategory.subCategories.map((sub, idx) => {
            const isSubActive = sub.id === activeSubId;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSelectSubCategory(sub.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  isSubActive
                    ? 'bg-[#141518] text-white shadow-md font-semibold ring-2 ring-[#c5a880]'
                    : 'bg-[#f8f6f0] text-[#5c5f6a] hover:bg-[#ede8db] hover:text-[#141518] border border-[#e5dcce]'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSubActive ? 'bg-[#c5a880] text-[#141518] font-bold' : 'bg-black/5 text-[#8a6839]'
                  }`}
                >
                  {sub.numberStr}
                </span>
                <span>{sub.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FOCUSED LESSON CONTENT VIEWPORT */}
      <div className="bg-white rounded-3xl border border-[#eae6de] p-6 sm:p-9 shadow-md transition-all">
        {/* ================================================================== */}
        {/* CATEGORY 1: STAFF & CLEFS LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'staff-clefs' && (
          <div className="space-y-8">
            {/* 1.1: 5 Lines & 4 Spaces */}
            {activeSubId === 'lines-spaces' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 1.1 • THE BASICS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    The 5 Lines &amp; 4 Spaces: How Pitch Moves
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Musical sheet music is drawn on 5 horizontal lines and 4 spaces. The most important
                    principle: <strong>Vertical position equals musical pitch</strong>.
                  </p>
                </div>

                {/* SVG Visual Graphic of 5 Lines & 4 Spaces */}
                <div className="bg-[#141518] rounded-2xl p-6 text-white border border-white/10 shadow-lg">
                  <svg viewBox="0 0 600 220" className="w-full max-w-2xl mx-auto">
                    {/* Vertical pitch direction arrow */}
                    <line x1="40" y1="180" x2="40" y2="40" stroke="#c5a880" strokeWidth="2.5" />
                    <polygon points="40,30 34,45 46,45" fill="#c5a880" />
                    <text
                      x="40"
                      y="198"
                      textAnchor="middle"
                      fill="#c5a880"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      PITCH
                    </text>
                    <text
                      x="40"
                      y="20"
                      textAnchor="middle"
                      fill="#c5a880"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      HIGHER ↑
                    </text>

                    {/* 5 Staff lines (Y: 50, 80, 110, 140, 170) */}
                    {[50, 80, 110, 140, 170].map((y, idx) => {
                      const lineNum = 5 - idx;
                      return (
                        <g key={idx}>
                          <line x1="80" y1={y} x2="520" y2={y} stroke="#f5f3ef" strokeWidth="2" />
                          <circle cx="535" cy={y} r="10" fill="#c5a880" />
                          <text
                            x="535"
                            y={y + 3.5}
                            textAnchor="middle"
                            fill="#141518"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            L{lineNum}
                          </text>
                          <text
                            x="90"
                            y={y - 5}
                            fill="#9ca3af"
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            Line {lineNum} (Bottom to top)
                          </text>
                        </g>
                      );
                    })}

                    {/* 4 Spaces Callouts */}
                    {[155, 125, 95, 65].map((y, idx) => {
                      const spaceNum = idx + 1;
                      return (
                        <g key={idx}>
                          <rect
                            x="450"
                            y={y - 10}
                            width="20"
                            height="20"
                            rx="4"
                            fill="#3b82f6"
                          />
                          <text
                            x="460"
                            y={y + 4}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            S{spaceNum}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Core Rules Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">RULE 1</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Always Numbered Bottom-to-Top</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1 leading-relaxed">
                      Line 1 is the bottommost line; Line 5 is the uppermost line. Similarly, Space 1 is
                      the lowest space.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">RULE 2</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Line vs. Space Alternation</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1 leading-relaxed">
                      As a melody steps up note-by-note, it strictly alternates: Line → Space → Line → Space!
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">RULE 3</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Pitch Audition</h4>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(600);
                          soundEngine.playChord(['C3'], 1.0, false);
                        }}
                        className="px-2.5 py-1 rounded bg-[#141518] text-white text-[11px] font-medium cursor-pointer"
                      >
                        Hear Low Note (C3)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(900);
                          soundEngine.playChord(['C6'], 1.0, false);
                        }}
                        className="px-2.5 py-1 rounded bg-[#c5a880] text-[#141518] text-[11px] font-bold cursor-pointer"
                      >
                        Hear High Note (C6)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1.2: Treble Clef (G-Clef) */}
            {activeSubId === 'treble-clef' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 1.2 • RIGHT HAND &amp; MELODIES
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Treble Clef (G-Clef): The Melody Anchor
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    The Treble Clef is also known as the <strong>G-Clef</strong> because its graceful inner
                    spiral wraps directly around <strong>Line 2 ($G_4$)</strong>. It is used for the
                    right hand on piano, vocals, guitars, violins, and flutes.
                  </p>
                </div>

                {/* SVG Visual Graphic of Treble Clef with Line & Space Notes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#141518] text-white rounded-2xl p-6 border border-white/10 shadow-lg">
                  <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                    <TrebleClefSvg color="#c5a880" size={72} />
                    <h4 className="font-serif text-lg text-white font-medium mt-2">Treble Clef</h4>
                    <p className="text-xs text-[#c5a880] font-mono">Inner loop encircles G4 (Line 2)</p>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    {/* Line Notes Mnemonic */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#c5a880] font-bold">5 TREBLE LINES (BOTTOM TO TOP):</span>
                        <button
                          type="button"
                          onClick={() => {
                            ['E4', 'G4', 'B4', 'D5', 'F5'].forEach((n, idx) => {
                              setTimeout(() => soundEngine.playChord([n], 0.6, false), idx * 260);
                            });
                          }}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#c5a880] text-[#141518] font-bold cursor-pointer"
                        >
                          ▶ Play Lines Melody
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {['E', 'G', 'B', 'D', 'F'].map((letter, i) => (
                          <div
                            key={i}
                            className="flex-1 text-center py-2 rounded-lg bg-black/40 border border-white/10"
                          >
                            <span className="block text-sm font-bold text-white font-mono">{letter}</span>
                            <span className="block text-[9px] text-[#9ca3af]">
                              {['Every', 'Good', 'Boy', 'Does', 'Fine'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Space Notes Mnemonic */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#38bdf8] font-bold">4 TREBLE SPACES (BOTTOM TO TOP):</span>
                        <button
                          type="button"
                          onClick={() => {
                            ['F4', 'A4', 'C5', 'E5'].forEach((n, idx) => {
                              setTimeout(() => soundEngine.playChord([n], 0.6, false), idx * 260);
                            });
                          }}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#38bdf8] text-[#141518] font-bold cursor-pointer"
                        >
                          ▶ Play Spaces Melody
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {['F', 'A', 'C', 'E'].map((letter, i) => (
                          <div
                            key={i}
                            className="flex-1 text-center py-2 rounded-lg bg-black/40 border border-white/10"
                          >
                            <span className="block text-sm font-bold text-white font-mono">{letter}</span>
                            <span className="block text-[9px] text-[#9ca3af]">Space {i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#9ca3af] mt-2">
                        💡 <strong>Memory Shortcut:</strong> The spaces in the Treble Clef literally spell
                        the word <strong>F - A - C - E</strong>!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1.3: Bass Clef (F-Clef) */}
            {activeSubId === 'bass-clef' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 1.3 • LEFT HAND &amp; BASS LINES
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Bass Clef (F-Clef): The Harmonic Foundation
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    The Bass Clef is also known as the <strong>F-Clef</strong>. Notice its two dots: they
                    directly enclose <strong>Line 4 ($F_3$)</strong>. Used for the left hand on piano,
                    bass guitar, cello, trombone, and tuba.
                  </p>
                </div>

                {/* SVG Visual Graphic of Bass Clef */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#141518] text-white rounded-2xl p-6 border border-white/10 shadow-lg">
                  <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                    <BassClefSvg color="#c5a880" size={72} />
                    <h4 className="font-serif text-lg text-white font-medium mt-2">Bass Clef</h4>
                    <p className="text-xs text-[#c5a880] font-mono">Two dots surround Line 4 (F3)</p>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    {/* Line Notes Mnemonic */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#c5a880] font-bold">5 BASS LINES (BOTTOM TO TOP):</span>
                        <button
                          type="button"
                          onClick={() => {
                            ['G2', 'B2', 'D3', 'F3', 'A3'].forEach((n, idx) => {
                              setTimeout(() => soundEngine.playChord([n], 0.6, false), idx * 260);
                            });
                          }}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#c5a880] text-[#141518] font-bold cursor-pointer"
                        >
                          ▶ Play Bass Lines
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {['G', 'B', 'D', 'F', 'A'].map((letter, i) => (
                          <div
                            key={i}
                            className="flex-1 text-center py-2 rounded-lg bg-black/40 border border-white/10"
                          >
                            <span className="block text-sm font-bold text-white font-mono">{letter}</span>
                            <span className="block text-[9px] text-[#9ca3af]">
                              {['Good', 'Boys', 'Do', 'Fine', 'Always'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Space Notes Mnemonic */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#10b981] font-bold">4 BASS SPACES (BOTTOM TO TOP):</span>
                        <button
                          type="button"
                          onClick={() => {
                            ['A2', 'C3', 'E3', 'G3'].forEach((n, idx) => {
                              setTimeout(() => soundEngine.playChord([n], 0.6, false), idx * 260);
                            });
                          }}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#10b981] text-[#141518] font-bold cursor-pointer"
                        >
                          ▶ Play Bass Spaces
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {['A', 'C', 'E', 'G'].map((letter, i) => (
                          <div
                            key={i}
                            className="flex-1 text-center py-2 rounded-lg bg-black/40 border border-white/10"
                          >
                            <span className="block text-sm font-bold text-white font-mono">{letter}</span>
                            <span className="block text-[9px] text-[#9ca3af]">
                              {['All', 'Cows', 'Eat', 'Grass'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1.4: The Grand Staff & Middle C */}
            {activeSubId === 'grand-staff' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 1.4 • THE COMPLETE PIANO SCORE
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    The Grand Staff &amp; The Middle C Bridge
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    When the Treble staff and Bass staff are joined together with a vertical bracket
                    (brace), they form the <strong>Grand Staff</strong>. <strong>Middle C ($C_4$)</strong> sits
                    on a single ledger line floating right in the middle between both staves!
                  </p>
                </div>

                {/* SVG Grand Staff Diagram */}
                <div className="bg-[#141518] rounded-2xl p-6 border border-white/10 shadow-lg text-white">
                  <svg viewBox="0 0 580 260" className="w-full max-w-2xl mx-auto">
                    {/* Left Brace */}
                    <path
                      d="M60 20c-15 40-15 90-25 110 10 20 10 70 25 110"
                      stroke="#c5a880"
                      strokeWidth="4"
                      fill="none"
                    />
                    <line x1="60" y1="20" x2="60" y2="240" stroke="#c5a880" strokeWidth="2" />

                    {/* Treble Staff (5 lines) */}
                    {[25, 45, 65, 85, 105].map((y, i) => (
                      <line key={i} x1="75" y1={y} x2="520" y2={y} stroke="#f5f3ef" strokeWidth="1.5" />
                    ))}
                    <text x="530" y="65" fill="#c5a880" fontSize="11" fontWeight="bold">
                      Treble Staff (Right Hand)
                    </text>

                    {/* Bass Staff (5 lines) */}
                    {[155, 175, 195, 215, 235].map((y, i) => (
                      <line key={i} x1="75" y1={y} x2="520" y2={y} stroke="#f5f3ef" strokeWidth="1.5" />
                    ))}
                    <text x="530" y="195" fill="#38bdf8" fontSize="11" fontWeight="bold">
                      Bass Staff (Left Hand)
                    </text>

                    {/* Middle C on Ledger Line right in center */}
                    <g transform="translate(290, 130)">
                      <line x1="-20" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
                      <ellipse cx="0" cy="0" rx="14" ry="9" transform="rotate(-25 0 0)" fill="#f59e0b" />
                      <text x="0" y="-14" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                        Middle C (C4)
                      </text>
                      <text x="0" y="24" textAnchor="middle" fill="#9ca3af" fontSize="9">
                        Ledger Line Bridge
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                  <div>
                    <h4 className="font-semibold text-sm text-[#141518]">Audition Middle C ($C_4$):</h4>
                    <p className="text-xs text-[#5c5f6a]">
                      261.63 Hz — The central anchor of the piano keyboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(650);
                      soundEngine.playChord(['C4'], 1.8, false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#141518] text-white text-xs font-semibold cursor-pointer hover:bg-[#2b2d35] transition-colors"
                  >
                    ▶ Play Middle C
                  </button>
                </div>
              </div>
            )}

            {/* 1.5: Interactive Staff Soundboard */}
            {activeSubId === 'interactive-soundboard' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                      LESSON 1.5 • INTERACTIVE SOUNDBOARD
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-[#141518]">
                      Interactive Musical Staff Soundboard
                    </h3>
                    <p className="text-sm text-[#5c5f6a]">
                      Click any notehead on the engraved staff to audition its authentic piano audio!
                    </p>
                  </div>

                  {/* Clef Switcher */}
                  <div className="flex p-1 bg-[#f4efe6] rounded-xl border border-[#e5dcce]">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(650);
                        setActiveClef('treble');
                        setSelectedStaffNote(TREBLE_STAFF_NOTES[0]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeClef === 'treble'
                          ? 'bg-[#141518] text-white shadow-xs'
                          : 'text-[#8a6839] hover:text-[#141518]'
                      }`}
                    >
                      🎼 Treble Clef
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(650);
                        setActiveClef('bass');
                        setSelectedStaffNote(BASS_STAFF_NOTES[6]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeClef === 'bass'
                          ? 'bg-[#141518] text-white shadow-xs'
                          : 'text-[#8a6839] hover:text-[#141518]'
                      }`}
                    >
                      𝄢 Bass Clef
                    </button>
                  </div>
                </div>

                {/* The Interactive Engraved SVG Staff */}
                <div className="bg-[#141518] rounded-2xl p-6 border border-white/10 shadow-lg overflow-x-auto">
                  <svg viewBox="0 0 740 160" className="w-full min-w-[620px] select-none">
                    {/* 5 Staff lines (y: 20, 40, 60, 80, 100) */}
                    {[20, 40, 60, 80, 100].map((y, idx) => (
                      <line
                        key={idx}
                        x1="40"
                        y1={y}
                        x2="700"
                        y2={y}
                        stroke="#f5f3ef"
                        strokeWidth="1.75"
                        strokeOpacity="0.8"
                      />
                    ))}

                    {/* Clef rendered at start */}
                    <g transform="translate(45, 0)">
                      {activeClef === 'treble' ? (
                        <TrebleClefSvg size={58} color="#c5a880" />
                      ) : (
                        <g transform="translate(0, 18)">
                          <BassClefSvg size={54} color="#c5a880" />
                        </g>
                      )}
                    </g>

                    {/* Render Noteheads along staff */}
                    {(activeClef === 'treble' ? TREBLE_STAFF_NOTES : BASS_STAFF_NOTES).map(
                      (note, idx) => {
                        const isSelected = selectedStaffNote.id === note.id;
                        const x = 140 + idx * 44;
                        const y = note.yPos;

                        return (
                          <g
                            key={note.id}
                            onClick={() => handlePlayStaffNote(note)}
                            className="cursor-pointer group"
                          >
                            {/* Ledger lines if applicable */}
                            {note.hasLedgerLine && (
                              <line
                                x1={x - 16}
                                y1={note.ledgerY}
                                x2={x + 16}
                                y2={note.ledgerY}
                                stroke={isSelected ? '#c5a880' : '#ffffff'}
                                strokeWidth="2.5"
                              />
                            )}

                            {/* Notehead oval */}
                            <ellipse
                              cx={x}
                              cy={y}
                              rx="13"
                              ry="8.5"
                              transform={`rotate(-25 ${x} ${y})`}
                              fill={isSelected ? '#c5a880' : '#ffffff'}
                              stroke={isSelected ? '#ffffff' : 'none'}
                              strokeWidth="2"
                              className="transition-transform group-hover:scale-125"
                            />

                            {/* Stem */}
                            <line
                              x1={y >= 60 ? x + 11 : x - 11}
                              y1={y}
                              x2={y >= 60 ? x + 11 : x - 11}
                              y2={y >= 60 ? y - 36 : y + 36}
                              stroke={isSelected ? '#c5a880' : '#ffffff'}
                              strokeWidth="2.2"
                            />

                            {/* Note Name underneath */}
                            <text
                              x={x}
                              y="145"
                              textAnchor="middle"
                              fill={isSelected ? '#c5a880' : '#9ca3af'}
                              fontSize="11"
                              fontFamily="monospace"
                              fontWeight={isSelected ? 'bold' : 'normal'}
                            >
                              {note.letter}
                            </text>
                          </g>
                        );
                      }
                    )}
                  </svg>
                </div>

                {/* Active Note Inspector */}
                <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#141518] text-[#c5a880] flex flex-col items-center justify-center font-bold font-mono text-lg shadow-sm">
                      {selectedStaffNote.letter}
                      <span className="text-[9px] text-white/60 font-sans font-normal">
                        Oct {selectedStaffNote.octave}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#141518]">
                        Note {selectedStaffNote.noteName} ({selectedStaffNote.clef === 'treble' ? 'Treble' : 'Bass'} Clef)
                      </h4>
                      <p className="text-xs text-[#8a6839] font-mono mt-0.5">
                        {selectedStaffNote.mnemonic} • Frequency: {selectedStaffNote.freq} Hz
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayStaffNote(selectedStaffNote)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141518] text-white text-xs font-semibold cursor-pointer hover:bg-[#2b2d35]"
                  >
                    <Volume2 className="w-4 h-4 text-[#c5a880]" />
                    Replay Note
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* CATEGORY 2: NOTES & RESTS LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'notes-rests' && (
          <div className="space-y-8">
            {/* 2.1: Note Anatomy & Stem Rules */}
            {activeSubId === 'note-anatomy' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 2.1 • ANATOMY &amp; RULES
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Note Anatomy &amp; The Stem Direction Rule
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Every musical note is built from up to 4 parts: <strong>Notehead</strong>,{' '}
                    <strong>Stem</strong>, <strong>Flag</strong>, and <strong>Beam</strong>.
                  </p>
                </div>

                {/* SVG Note Anatomy Graphic */}
                <NoteAnatomySvg />

                {/* The Line 3 Stem Direction Rule */}
                <div className="mt-6">
                  <h4 className="font-serif text-lg font-medium text-[#141518] mb-2">
                    The Line 3 Threshold Rule (Stem Direction):
                  </h4>
                  <StemRuleDiagramSvg />
                  <p className="text-xs text-[#5c5f6a] max-w-lg mx-auto text-center mt-2">
                    💡 If a notehead is placed <strong>below the middle line (Line 3)</strong>, its stem
                    points <strong>UP on the right</strong>. If placed <strong>on or above Line 3</strong>,
                    its stem points <strong>DOWN on the left</strong>!
                  </p>
                </div>
              </div>
            )}

            {/* 2.2: Note Values Pyramid */}
            {activeSubId === 'duration-pyramid' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 2.2 • DURATION PYRAMID
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Note Values &amp; Musical Duration Pyramid
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Notes tell the musician <strong>how long to hold each pitch</strong>. Click any card to hear
                    the note held on the piano for its exact duration!
                  </p>
                </div>

                {/* 5 Note Duration Cards with Authentic SVGs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {NOTE_DURATIONS.map((dur) => (
                    <div
                      key={dur.id}
                      className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-[#8a6839]">
                            {dur.fraction}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#141518] text-[#c5a880] text-xs font-mono font-bold">
                            {dur.beats} {dur.beats === 1 ? 'Beat' : 'Beats'}
                          </span>
                        </div>

                        {/* Visual SVG Graphic */}
                        <div className="bg-[#141518] rounded-xl p-4 flex items-center justify-center my-3">
                          {dur.id === 'whole-note' && <WholeNoteSvg color="#c5a880" size={54} />}
                          {dur.id === 'half-note' && <HalfNoteSvg color="#c5a880" size={48} />}
                          {dur.id === 'quarter-note' && <QuarterNoteSvg color="#c5a880" size={48} />}
                          {dur.id === 'eighth-note' && <EighthNoteSvg color="#c5a880" size={48} />}
                          {dur.id === 'sixteenth-note' && <SixteenthNoteSvg color="#c5a880" size={48} />}
                        </div>

                        <h4 className="font-serif font-medium text-base text-[#141518]">
                          {dur.name} ({dur.ukName})
                        </h4>
                        <p className="text-xs text-[#5c5f6a] mt-1">{dur.shapeDescription}</p>
                        <p className="text-xs font-mono text-[#8a6839] mt-2">{dur.countingMnemonic}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuditionDuration(dur)}
                        className="mt-4 w-full py-2 rounded-xl bg-[#141518] text-white text-xs font-semibold cursor-pointer hover:bg-[#2b2d35] flex items-center justify-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
                        Hear {dur.beats} Beat Duration
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2.3: Musical Rests (Silence) */}
            {activeSubId === 'musical-rests' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 2.3 • THE LANGUAGE OF SILENCE
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Musical Rests: Silence in Sheet Music
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Music is defined as much by silence as by sound! For every note value, there is an exact
                    matching <strong>Rest symbol</strong> indicating silence for the identical duration.
                  </p>
                </div>

                {/* Side-by-side Rests Table / Grid with Crisp SVGs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Whole Rest */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">4 BEATS SILENCE</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Whole Rest (Semibreve Rest)</h4>
                    <div className="bg-[#141518] rounded-xl p-3 my-2 flex items-center justify-center">
                      <WholeRestSvg color="#c5a880" size={90} />
                    </div>
                    <p className="text-xs text-[#5c5f6a]">
                      💡 <strong>Memory Trick:</strong> Hangs below Line 4 like a <em>hole in the ground</em>!
                    </p>
                  </div>

                  {/* Half Rest */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">2 BEATS SILENCE</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Half Rest (Minim Rest)</h4>
                    <div className="bg-[#141518] rounded-xl p-3 my-2 flex items-center justify-center">
                      <HalfRestSvg color="#c5a880" size={90} />
                    </div>
                    <p className="text-xs text-[#5c5f6a]">
                      💡 <strong>Memory Trick:</strong> Sits upright on Line 3 like a gentleman's <em>top hat</em>!
                    </p>
                  </div>

                  {/* Quarter Rest */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">1 BEAT SILENCE</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Quarter Rest (Crotchet Rest)</h4>
                    <div className="bg-[#141518] rounded-xl p-3 my-2 flex items-center justify-center">
                      <QuarterRestSvg color="#c5a880" size={40} />
                    </div>
                    <p className="text-xs text-[#5c5f6a]">
                      The famous "lightning squiggle" that pauses for 1 standard walking beat.
                    </p>
                  </div>

                  {/* Eighth Rest */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">0.5 BEAT SILENCE</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Eighth Rest (Quaver Rest)</h4>
                    <div className="bg-[#141518] rounded-xl p-3 my-2 flex items-center justify-center">
                      <EighthRestSvg color="#c5a880" size={38} />
                    </div>
                    <p className="text-xs text-[#5c5f6a]">Resembles a slanted numeral 7 with a dot.</p>
                  </div>

                  {/* Sixteenth Rest */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">0.25 BEAT SILENCE</span>
                    <h4 className="font-semibold text-sm text-[#141518] mt-1">Sixteenth Rest</h4>
                    <div className="bg-[#141518] rounded-xl p-3 my-2 flex items-center justify-center">
                      <SixteenthRestSvg color="#c5a880" size={38} />
                    </div>
                    <p className="text-xs text-[#5c5f6a]">Features two stacked flags for rapid rhythm pauses.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2.4: Dotted Notes, Ties & Beams */}
            {activeSubId === 'dotted-ties' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 2.4 • EXTENDED RHYTHMS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Dotted Notes, Ties &amp; Beams
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Composers use dots, ties, and beams to create rich, expressive rhythmic varieties.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* The Dotted Note Rule */}
                  <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-3">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">THE GOLDEN RULE</span>
                    <h4 className="font-serif text-lg font-medium text-[#141518]">
                      A Dot Adds Exactly 50% of the Original Value
                    </h4>
                    <p className="text-xs text-[#5c5f6a] leading-relaxed">
                      Whenever you see a small dot to the right of any notehead:
                    </p>
                    <div className="bg-white rounded-xl p-3 border border-[#e5dcce] font-mono text-xs text-[#141518]">
                      • Dotted Half Note: 2 beats + (50% = 1) = <strong>3 Beats</strong>
                      <br />• Dotted Quarter Note: 1 beat + (50% = 0.5) = <strong>1.5 Beats</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(750);
                        soundEngine.playChord(['C4'], 3.0 * 0.75, false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141518] text-white text-xs font-semibold cursor-pointer"
                    >
                      ▶ Hear Dotted Half Note (3 Beats)
                    </button>
                  </div>

                  {/* Ties vs Slurs */}
                  <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-3">
                    <span className="text-xs font-mono font-bold text-[#8a6839]">TIE VS SLUR</span>
                    <h4 className="font-serif text-lg font-medium text-[#141518]">
                      Ties Connect Same Pitch; Slurs Connect Phrases
                    </h4>
                    <p className="text-xs text-[#5c5f6a] leading-relaxed">
                      Both look like curved arcs, but serve completely different musical purposes:
                    </p>
                    <div className="bg-white rounded-xl p-3 border border-[#e5dcce] text-xs text-[#5c5f6a] space-y-1">
                      <p>
                        <strong>TIE:</strong> Connects two notes of the <em>exact same pitch</em>. Do not
                        re-strike the second note; hold sound continuously across the bar line!
                      </p>
                      <p>
                        <strong>SLUR:</strong> Connects notes of <em>different pitches</em>. Play them
                        smoothly connected without pauses (<em>Legato</em>).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* CATEGORY 3: SYMBOLS & MARKINGS LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'symbols-markings' && (
          <div className="space-y-8">
            {/* 3.1: Accidentals */}
            {activeSubId === 'accidentals' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 3.1 • ACCIDENTALS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Accidentals: Sharps (♯), Flats (♭) &amp; Naturals (♮)
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Accidentals are symbols placed immediately in front of a notehead to raise or lower its
                    pitch by a half-step (semitone).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sharp */}
                  <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="bg-[#141518] rounded-xl p-3 flex items-center justify-center mb-3">
                      <SharpSvg size={44} color="#e5c158" />
                    </div>
                    <h4 className="font-serif font-medium text-base text-[#141518]">Sharp (♯)</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Raises the pitch by <strong>1 half-step (1 piano key to the right)</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playChord(['C4'], 0.8, false);
                        setTimeout(() => soundEngine.playChord(['C#4'], 1.0, false), 800);
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-[#141518] text-white text-xs font-semibold cursor-pointer"
                    >
                      ▶ Hear C4 → C♯4
                    </button>
                  </div>

                  {/* Flat */}
                  <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="bg-[#141518] rounded-xl p-3 flex items-center justify-center mb-3">
                      <FlatSvg size={44} color="#38bdf8" />
                    </div>
                    <h4 className="font-serif font-medium text-base text-[#141518]">Flat (♭)</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Lowers the pitch by <strong>1 half-step (1 piano key to the left)</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playChord(['B4'], 0.8, false);
                        setTimeout(() => soundEngine.playChord(['Bb4'], 1.0, false), 800);
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-[#141518] text-white text-xs font-semibold cursor-pointer"
                    >
                      ▶ Hear B4 → B♭4
                    </button>
                  </div>

                  {/* Natural */}
                  <div className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="bg-[#141518] rounded-xl p-3 flex items-center justify-center mb-3">
                      <NaturalSvg size={44} color="#10b981" />
                    </div>
                    <h4 className="font-serif font-medium text-base text-[#141518]">Natural (♮)</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Cancels any previous sharp or flat and returns the pitch to its pure white key.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playChord(['F#4'], 0.8, false);
                        setTimeout(() => soundEngine.playChord(['F4'], 1.0, false), 800);
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-[#141518] text-white text-xs font-semibold cursor-pointer"
                    >
                      ▶ Hear F♯4 → F♮4
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3.2: Dynamics */}
            {activeSubId === 'dynamics' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 3.2 • VOLUME &amp; INTENSITY
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Musical Dynamics: The Volume Scale
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Dynamics indicate how soft or loud the music should be performed, using traditional
                    Italian terminology.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { symbol: 'pp', italian: 'Pianissimo', meaning: 'Very Soft', color: '#60a5fa' },
                    { symbol: 'p', italian: 'Piano', meaning: 'Soft', color: '#38bdf8' },
                    { symbol: 'mp', italian: 'Mezzo-Piano', meaning: 'Moderately Soft', color: '#34d399' },
                    { symbol: 'mf', italian: 'Mezzo-Forte', meaning: 'Moderately Loud', color: '#f59e0b' },
                    { symbol: 'f', italian: 'Forte', meaning: 'Loud', color: '#fb923c' },
                    { symbol: 'ff', italian: 'Fortissimo', meaning: 'Very Loud', color: '#ef4444' },
                  ].map((dyn, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#141518] text-white text-center border border-white/10"
                    >
                      <span
                        className="text-3xl font-serif italic font-bold block mb-1"
                        style={{ color: dyn.color }}
                      >
                        {dyn.symbol}
                      </span>
                      <h4 className="text-xs font-semibold text-white">{dyn.italian}</h4>
                      <p className="text-[10px] text-[#9ca3af] mt-0.5">{dyn.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3.3: Articulations */}
            {activeSubId === 'articulations' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 3.3 • TOUCH &amp; EXPRESSION
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Articulations: How Each Note is Struck
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Articulations modify the attack, release, and length of individual notes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Staccato */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="w-8 h-8 rounded-full bg-[#141518] text-white flex items-center justify-center font-bold text-lg mb-2">
                      •
                    </div>
                    <h4 className="font-semibold text-sm text-[#141518]">Staccato</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Play short, detached, and light with bounce.
                    </p>
                  </div>

                  {/* Accent */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="w-8 h-8 rounded-full bg-[#141518] text-white flex items-center justify-center font-bold text-lg mb-2">
                      &gt;
                    </div>
                    <h4 className="font-semibold text-sm text-[#141518]">Accent</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Strike note with sudden force and punch.
                    </p>
                  </div>

                  {/* Tenuto */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="w-8 h-8 rounded-full bg-[#141518] text-white flex items-center justify-center font-bold text-lg mb-2">
                      —
                    </div>
                    <h4 className="font-semibold text-sm text-[#141518]">Tenuto</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Hold note for its full written length with gentle emphasis.
                    </p>
                  </div>

                  {/* Fermata */}
                  <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                    <div className="w-8 h-8 rounded-full bg-[#141518] text-[#c5a880] flex items-center justify-center mb-2">
                      <FermataSvg size={22} color="#c5a880" />
                    </div>
                    <h4 className="font-semibold text-sm text-[#141518]">Fermata ("Bird's Eye")</h4>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      Pause the tempo and hold note indefinitely until performer feels ready.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3.4: Bar Lines & Repeats */}
            {activeSubId === 'bar-lines' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 3.4 • SHEET NAVIGATION
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Bar Lines &amp; Repeat Signs: Navigating the Score
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Bar lines divide sheet music into rhythmic measures. Special repeat signs tell you
                    where to loop and finish!
                  </p>
                </div>

                {/* SVG Visual Graphic of Bar Lines */}
                <BarLinesSvg />
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* CATEGORY 4: KEY SIGNATURES LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'key-signatures' && (
          <div className="space-y-8">
            {/* 4.1: Why Key Signatures Exist */}
            {activeSubId === 'why-key-signatures' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 4.1 • THE PURPOSE
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Why Do Key Signatures Exist?
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Imagine playing a song in E Major where every single F, C, G, and D note had a sharp
                    symbol drawn in front of it. The score would be covered in visual clutter! Key
                    signatures solve this by placing the accidentals <strong>once at the very beginning</strong> of
                    every line.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#141518] text-white border border-white/10 space-y-3">
                  <h4 className="font-serif text-lg text-[#c5a880]">The Key Signature Contract:</h4>
                  <p className="text-sm text-[#9ca3af] leading-relaxed">
                    When a composer puts a sharp on the top line (F) in the key signature, it means:{' '}
                    <strong className="text-white">
                      "Every time you see any F anywhere on this instrument, automatically play F♯, unless a
                      natural sign cancels it!"
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {/* 4.2: Sharps Rule */}
            {activeSubId === 'sharps-rule' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 4.2 • SHARP KEYS SYSTEM
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    The Secret Rule for Sharp Keys (♯)
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    You never have to memorize sharp key names again. Just use this magic rule!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#c5a880] text-[#141518] text-xs font-bold font-mono">
                    THE SHARP RULE:
                  </div>
                  <h4 className="text-xl font-serif font-medium text-[#141518]">
                    Look at the Last Sharp on the Right → Go UP 1 Half-Step = The Major Key!
                  </h4>
                  <p className="text-sm text-[#5c5f6a]">
                    Example: If the key signature has 3 sharps (F♯, C♯, G♯), look at the last sharp: <strong>G♯</strong>.
                    One half-step above G♯ is <strong>A</strong>. Therefore, the key is <strong>A Major</strong>!
                  </p>

                  <div className="p-4 rounded-xl bg-white border border-[#e5dcce]">
                    <span className="text-xs font-mono text-[#8a6839] font-bold block mb-1">
                      ORDER OF SHARPS (ALWAYS IN THIS EXACT SEQUENCE):
                    </span>
                    <span className="text-base font-mono font-bold text-[#141518]">
                      F♯ — C♯ — G♯ — D♯ — A♯ — E♯ — B♯
                    </span>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      💡 Mnemonic: <em>"Father Charles Goes Down And Ends Battle"</em>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4.3: Flats Rule */}
            {activeSubId === 'flats-rule' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 4.3 • FLAT KEYS SYSTEM
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    The Secret Rule for Flat Keys (♭)
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Reading flat key signatures is even easier than sharps!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#38bdf8] text-[#141518] text-xs font-bold font-mono">
                    THE FLAT RULE:
                  </div>
                  <h4 className="text-xl font-serif font-medium text-[#141518]">
                    The Penultimate (2nd-to-Last) Flat literally IS the Major Key Name!
                  </h4>
                  <p className="text-sm text-[#5c5f6a]">
                    Example: If the key signature has 3 flats (B♭, E♭, A♭), the second-to-last flat is <strong>E♭</strong>.
                    Therefore, the key is literally <strong>E♭ Major</strong>! (The only exception to memorize is 1 flat = F Major).
                  </p>

                  <div className="p-4 rounded-xl bg-white border border-[#e5dcce]">
                    <span className="text-xs font-mono text-[#38bdf8] font-bold block mb-1">
                      ORDER OF FLATS (EXACT REVERSE OF SHARPS):
                    </span>
                    <span className="text-base font-mono font-bold text-[#141518]">
                      B♭ — E♭ — A♭ — D♭ — G♭ — C♭ — F♭
                    </span>
                    <p className="text-xs text-[#5c5f6a] mt-1">
                      💡 Mnemonic: <em>"Battle Ends And Down Goes Charles' Father"</em>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4.4: Interactive Key Signature Staff Visualizer */}
            {activeSubId === 'interactive-key-visualizer' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 4.4 • INTERACTIVE VISUALIZER
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Interactive Key Signature Engraver &amp; Scale Player
                  </h3>
                  <p className="text-sm text-[#5c5f6a]">
                    Select any key signature to see its engraved accidentals placed on the staff lines, and
                    audition its 8-note scale audio!
                  </p>
                </div>

                {/* Key Selector Pills */}
                <div className="flex flex-wrap gap-2">
                  {KEY_SIGNATURES_LIST.map((keyItem) => {
                    const isSelected = selectedKeySig.id === keyItem.id;
                    return (
                      <button
                        key={keyItem.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(650);
                          setSelectedKeySig(keyItem);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#141518] text-[#c5a880] ring-2 ring-[#c5a880] shadow-md'
                            : 'bg-[#f4efe6] text-[#8a6839] hover:bg-[#ede5d8]'
                        }`}
                      >
                        {keyItem.majorKey}
                        <span className="text-[10px] ml-1 opacity-70">
                          ({keyItem.accidentalsCount}
                          {keyItem.type === 'sharp' ? '♯' : keyItem.type === 'flat' ? '♭' : '♮'})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* The Engraved Key Signature Staff */}
                <KeySignatureStaffSvg
                  accidentals={selectedKeySig.accidentals}
                  type={selectedKeySig.type}
                  keyName={selectedKeySig.name}
                />

                {/* Play Scale & Triad Audio Buttons */}
                <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#141518]">
                      {selectedKeySig.name} • {selectedKeySig.mnemonicRule}
                    </h4>
                    <p className="text-xs text-[#5c5f6a] mt-0.5">{selectedKeySig.explanation}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayKeyScale(selectedKeySig)}
                      disabled={isPlayingScale}
                      className="px-4 py-2 rounded-xl bg-[#141518] text-white text-xs font-semibold cursor-pointer hover:bg-[#2b2d35] flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-[#c5a880]" />
                      {isPlayingScale ? 'Playing Scale...' : 'Play 8-Note Scale'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlayHomeChord(selectedKeySig)}
                      className="px-4 py-2 rounded-xl bg-[#c5a880] text-[#141518] text-xs font-bold cursor-pointer hover:bg-[#d4af37]"
                    >
                      Play Tonic Triad
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* CATEGORY 5: TIME SIGNATURES LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'time-signatures' && (
          <div className="space-y-8">
            {/* 5.1: Anatomy of Time Signatures */}
            {activeSubId === 'time-anatomy' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 5.1 • TOP VS BOTTOM NUMBERS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Anatomy of Time Signatures
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Written as two stacked numbers at the start of a piece, the time signature defines the
                    rhythmic pulse and measure boundaries.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Large Stacked Numbers SVG Graphic */}
                  <div className="bg-[#141518] rounded-2xl p-6 text-center text-white border border-white/10 shadow-lg">
                    <div className="inline-block font-serif text-6xl font-bold leading-none text-[#c5a880]">
                      <div>4</div>
                      <div className="border-t-2 border-white/20 mt-1 pt-1">4</div>
                    </div>
                    <p className="text-xs text-[#9ca3af] font-mono mt-3">Common Time (4 over 4)</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                      <span className="text-xs font-mono font-bold text-[#8a6839]">TOP NUMBER:</span>
                      <h4 className="font-semibold text-sm text-[#141518] mt-1">How Many Beats in Each Measure</h4>
                      <p className="text-xs text-[#5c5f6a] mt-1">
                        If top is <strong>4</strong>, there are 4 beats per bar. If top is <strong>3</strong>,
                        there are 3 beats per bar (waltz).
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                      <span className="text-xs font-mono font-bold text-[#8a6839]">BOTTOM NUMBER:</span>
                      <h4 className="font-semibold text-sm text-[#141518] mt-1">Which Note Value Gets 1 Beat</h4>
                      <p className="text-xs text-[#5c5f6a] mt-1">
                        • <strong>4</strong> = Quarter note (♩) gets 1 beat
                        <br />• <strong>8</strong> = Eighth note (♪) gets 1 beat
                        <br />• <strong>2</strong> = Half note gets 1 beat
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5.2: Common Time (C) & Cut Time */}
            {activeSubId === 'common-time' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 5.2 • HISTORICAL SYMBOLS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Common Time (C) &amp; Cut Time (¢)
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    You will frequently see a large letter "C" instead of numbers. Here is what it means!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#141518] text-white border border-white/10 text-center">
                    <span className="text-5xl font-serif font-bold text-[#c5a880] block mb-2">C</span>
                    <h4 className="font-serif text-lg font-medium text-white">Common Time = 4/4</h4>
                    <p className="text-xs text-[#9ca3af] mt-1">
                      Originates from the broken medieval circle representing "imperfect meter". Found in
                      90% of modern songs!
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#141518] text-white border border-white/10 text-center">
                    <span className="text-5xl font-serif font-bold text-[#38bdf8] block mb-2">𝄵</span>
                    <h4 className="font-serif text-lg font-medium text-white">Cut Time (Alla Breve) = 2/2</h4>
                    <p className="text-xs text-[#9ca3af] mt-1">
                      A "C" sliced with a vertical line. Means 2 half-note beats per measure, played fast
                      like an uptempo march or jazz standard!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5.3: Core Meters */}
            {activeSubId === 'core-meters' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 5.3 • PRIMARY METERS
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    The 4 Primary Musical Meters
                  </h3>
                  <p className="text-sm text-[#5c5f6a] max-w-3xl mt-1 leading-relaxed">
                    Different time signatures give songs their unique rhythmic swing and dance feel!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIME_SIGNATURES_LIST.map((meter) => (
                    <div key={meter.id} className="p-5 rounded-2xl bg-[#f8f6f0] border border-[#e5dcce]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#8a6839]">{meter.meterType}</span>
                        <span className="text-lg font-serif font-bold text-[#141518]">
                          {meter.top}/{meter.bottom}
                        </span>
                      </div>
                      <h4 className="font-serif font-medium text-base text-[#141518]">{meter.name}</h4>
                      <p className="text-xs text-[#5c5f6a] mt-1">{meter.explanation}</p>
                      <p className="text-xs font-mono text-[#8a6839] mt-2">Pulse: {meter.pulsePattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5.4: Live Metronome Pulse Player */}
            {activeSubId === 'live-metronome' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                    LESSON 5.4 • INTERACTIVE METRONOME
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#141518]">
                    Live Interactive Metronome Pulse Player
                  </h3>
                  <p className="text-sm text-[#5c5f6a]">
                    Select any meter and tap "Play Beat" to hear an authentic ticking metronome with an
                    accented high-pitch downbeat on Beat 1!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TIME_SIGNATURES_LIST.map((ts) => {
                    const isRunning = isMetronomeActive && selectedTimeSig.id === ts.id;
                    return (
                      <div
                        key={ts.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isRunning
                            ? 'bg-[#141518] text-white border-[#c5a880] shadow-lg ring-2 ring-[#c5a880]/30'
                            : 'bg-[#f8f6f0] text-[#141518] border-[#e5dcce]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-serif font-bold block leading-none">
                              {ts.top}/{ts.bottom}
                            </span>
                            <span className="text-xs font-mono opacity-70">{ts.meterType}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleMetronome(ts)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                              isRunning
                                ? 'bg-red-500 text-white shadow-md animate-pulse'
                                : 'bg-[#141518] text-white hover:bg-[#2b2d35]'
                            }`}
                          >
                            {isRunning ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-current" />
                                Stop Pulse
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current text-[#c5a880]" />
                                Play Beat
                              </>
                            )}
                          </button>
                        </div>

                        {/* Animated Bouncing Beat Balls */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-white/10">
                          {ts.beatsArray.map((b, idx) => {
                            const isCurrentBeat = isRunning && activeBeatIndex === idx;
                            return (
                              <div
                                key={idx}
                                className={`text-center py-2 rounded-xl transition-all ${
                                  isCurrentBeat
                                    ? b.accent
                                      ? 'bg-[#c5a880] text-[#141518] font-bold scale-110 shadow-lg'
                                      : 'bg-white/40 text-white font-bold scale-105'
                                    : isRunning
                                    ? 'bg-white/10 text-white/60'
                                    : 'bg-black/5 text-[#5c5f6a]'
                                }`}
                              >
                                <span className="text-xs font-mono font-bold block">{b.beatNum}</span>
                                <span className="text-[9px] block truncate">{b.label.split(' ')[0]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* CATEGORY 6: SIGHT-READING TRAINER LESSONS */}
        {/* ================================================================== */}
        {activeCategoryKey === 'trainer-game' && (
          <div className="space-y-6">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-bold mb-2">
                LESSON {currentSub.numberStr} • INTERACTIVE PRACTICE
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#141518]">
                Can You Name This Note?
              </h3>
              <p className="text-sm text-[#5c5f6a]">
                Look at the notehead on the engraved staff and click the matching note letter (A–G).
              </p>
            </div>

            {/* Clef Selector for Quiz */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#5c5f6a] font-semibold">SELECT CLEF:</span>
              <div className="flex p-1 bg-[#f4efe6] rounded-xl border border-[#e5dcce]">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(650);
                    setQuizClef('treble');
                    handleNextQuizQuestion('treble');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    quizClef === 'treble'
                      ? 'bg-[#141518] text-white shadow-xs'
                      : 'text-[#8a6839]'
                  }`}
                >
                  🎼 Treble Clef
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(650);
                    setQuizClef('bass');
                    handleNextQuizQuestion('bass');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    quizClef === 'bass'
                      ? 'bg-[#141518] text-white shadow-xs'
                      : 'text-[#8a6839]'
                  }`}
                >
                  𝄢 Bass Clef
                </button>
              </div>

              {/* Streak Badge */}
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f8f6f0] border border-[#e5dcce] text-xs font-mono">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>
                  Streak: <strong className="text-[#141518]">{quizStreak}</strong>
                </span>
                <span className="text-[#9ca3af]">|</span>
                <span>
                  Accuracy: <strong className="text-[#141518]">{quizTotal > 0 ? Math.round((quizScore / quizTotal) * 100) : 100}%</strong>
                </span>
              </div>
            </div>

            {/* Quiz Staff Flashcard SVG */}
            <div className="bg-[#141518] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col items-center">
              <svg viewBox="0 0 400 160" className="w-full max-w-md select-none">
                {/* 5 Staff Lines (20, 40, 60, 80, 100) */}
                {[20, 40, 60, 80, 100].map((y, idx) => (
                  <line key={idx} x1="40" y1={y} x2="360" y2={y} stroke="#f5f3ef" strokeWidth="2" />
                ))}

                {/* Clef on Left */}
                <g transform="translate(45, 0)">
                  {quizClef === 'treble' ? (
                    <TrebleClefSvg size={58} color="#c5a880" />
                  ) : (
                    <g transform="translate(0, 18)">
                      <BassClefSvg size={54} color="#c5a880" />
                    </g>
                  )}
                </g>

                {/* Quiz Target Note */}
                <g transform="translate(200, 0)">
                  {quizTargetNote.hasLedgerLine && (
                    <line
                      x1="-18"
                      y1={quizTargetNote.ledgerY}
                      x2="18"
                      y2={quizTargetNote.ledgerY}
                      stroke="#c5a880"
                      strokeWidth="2.5"
                    />
                  )}
                  <ellipse
                    cx="0"
                    cy={quizTargetNote.yPos}
                    rx="14"
                    ry="9.5"
                    transform={`rotate(-25 0 ${quizTargetNote.yPos})`}
                    fill="#c5a880"
                  />
                  <line
                    x1={quizTargetNote.yPos >= 60 ? 12 : -12}
                    y1={quizTargetNote.yPos}
                    x2={quizTargetNote.yPos >= 60 ? 12 : -12}
                    y2={quizTargetNote.yPos >= 60 ? quizTargetNote.yPos - 36 : quizTargetNote.yPos + 36}
                    stroke="#c5a880"
                    strokeWidth="2.5"
                  />
                </g>
              </svg>

              {/* Feedback Alert */}
              {quizFeedback && (
                <div
                  className={`mt-4 px-4 py-2.5 rounded-xl text-xs font-semibold max-w-md text-center transition-all ${
                    quizFeedback.correct
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {quizFeedback.text}
                </div>
              )}
            </div>

            {/* Answer Buttons (C, D, E, F, G, A, B) */}
            <div className="pt-2">
              <span className="block text-center text-xs font-mono text-[#5c5f6a] uppercase tracking-wider mb-3">
                Click the correct note letter:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleQuizAnswer(letter)}
                    className="w-12 h-12 rounded-2xl bg-white border-2 border-[#e5dcce] hover:border-[#c5a880] text-base font-serif font-bold text-[#141518] hover:bg-[#f8f6f0] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. LESSON FOOTER: PREVIOUS & NEXT LESSON STEPPER */}
        <div className="mt-10 pt-6 border-t border-[#eae6de] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevLesson}
            className="px-4 py-2 rounded-xl border border-[#e5dcce] bg-[#f8f6f0] hover:bg-[#ede8db] text-[#141518] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Lesson
          </button>

          <span className="text-xs text-[#9ca3af] font-mono hidden sm:inline-block">
            {currentCategory.shortTitle} • Lesson {currentSub.numberStr}
          </span>

          <button
            type="button"
            onClick={handleNextLesson}
            className="px-5 py-2.5 rounded-xl bg-[#141518] text-white hover:bg-[#2b2d35] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
          >
            Next Lesson
            <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
          </button>
        </div>
      </div>
    </section>
  );
};
