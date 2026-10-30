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
  Zap,
} from 'lucide-react';

// ============================================================================
// DATA & TYPES FOR STAFF NOTATION MASTERCLASS
// ============================================================================

export interface StaffNote {
  id: string;
  clef: 'treble' | 'bass';
  noteName: string; // e.g. "C4", "G4", "F3"
  letter: string; // "C", "G", "F"
  octave: number;
  freq: number;
  positionType: 'line' | 'space' | 'ledger';
  lineOrSpaceNumber: number; // 1 to 5 for lines, 1 to 4 for spaces
  yPos: number; // SVG Y coordinate for notehead center
  mnemonic: string;
  description: string;
  hasLedgerLine?: boolean;
  ledgerY?: number;
}

// Treble Clef standard notes (C4 up to C6)
export const TREBLE_STAFF_NOTES: StaffNote[] = [
  {
    id: 't-c4',
    clef: 'treble',
    noteName: 'C4',
    letter: 'C',
    octave: 4,
    freq: 261.63,
    positionType: 'ledger',
    lineOrSpaceNumber: 0,
    yPos: 120,
    hasLedgerLine: true,
    ledgerY: 120,
    mnemonic: 'Middle C — The Anchor between Treble & Bass staves',
    description: 'Sits on the first ledger line below the Treble staff.',
  },
  {
    id: 't-d4',
    clef: 'treble',
    noteName: 'D4',
    letter: 'D',
    octave: 4,
    freq: 293.66,
    positionType: 'space',
    lineOrSpaceNumber: 0,
    yPos: 110,
    mnemonic: 'Space below Line 1 (Right under E)',
    description: 'Hangs just beneath the bottom line of the Treble staff.',
  },
  {
    id: 't-e4',
    clef: 'treble',
    noteName: 'E4',
    letter: 'E',
    octave: 4,
    freq: 329.63,
    positionType: 'line',
    lineOrSpaceNumber: 1,
    yPos: 100,
    mnemonic: 'Every (Line 1)',
    description: 'Bottom line of the Treble staff. Part of "Every Good Boy Does Fine".',
  },
  {
    id: 't-f4',
    clef: 'treble',
    noteName: 'F4',
    letter: 'F',
    octave: 4,
    freq: 349.23,
    positionType: 'space',
    lineOrSpaceNumber: 1,
    yPos: 90,
    mnemonic: 'F in FACE (Space 1)',
    description: 'First space from the bottom. Spells "FACE" in the spaces.',
  },
  {
    id: 't-g4',
    clef: 'treble',
    noteName: 'G4',
    letter: 'G',
    octave: 4,
    freq: 392.0,
    positionType: 'line',
    lineOrSpaceNumber: 2,
    yPos: 80,
    mnemonic: 'Good (Line 2) — Treble Clef Center',
    description: 'The Treble Clef curls around this exact line (G-Clef).',
  },
  {
    id: 't-a4',
    clef: 'treble',
    noteName: 'A4',
    letter: 'A',
    octave: 4,
    freq: 440.0,
    positionType: 'space',
    lineOrSpaceNumber: 2,
    yPos: 70,
    mnemonic: 'A in FACE (Space 2) — Concert Pitch 440Hz',
    description: 'Second space from bottom. Standard orchestral tuning pitch.',
  },
  {
    id: 't-b4',
    clef: 'treble',
    noteName: 'B4',
    letter: 'B',
    octave: 4,
    freq: 493.88,
    positionType: 'line',
    lineOrSpaceNumber: 3,
    yPos: 60,
    mnemonic: 'Boy (Line 3 — Center Line)',
    description: 'Middle line of the Treble staff. Note stems can point up or down here.',
  },
  {
    id: 't-c5',
    clef: 'treble',
    noteName: 'C5',
    letter: 'C',
    octave: 5,
    freq: 523.25,
    positionType: 'space',
    lineOrSpaceNumber: 3,
    yPos: 50,
    mnemonic: 'C in FACE (Space 3)',
    description: 'Third space from bottom. 1 octave above Middle C.',
  },
  {
    id: 't-d5',
    clef: 'treble',
    noteName: 'D5',
    letter: 'D',
    octave: 5,
    freq: 587.33,
    positionType: 'line',
    lineOrSpaceNumber: 4,
    yPos: 40,
    mnemonic: 'Does (Line 4)',
    description: 'Fourth line of Treble staff. "Every Good Boy Does Fine".',
  },
  {
    id: 't-e5',
    clef: 'treble',
    noteName: 'E5',
    letter: 'E',
    octave: 5,
    freq: 659.25,
    positionType: 'space',
    lineOrSpaceNumber: 4,
    yPos: 30,
    mnemonic: 'E in FACE (Top Space 4)',
    description: 'Top space of the Treble staff. Completes "FACE".',
  },
  {
    id: 't-f5',
    clef: 'treble',
    noteName: 'F5',
    letter: 'F',
    octave: 5,
    freq: 698.46,
    positionType: 'line',
    lineOrSpaceNumber: 5,
    yPos: 20,
    mnemonic: 'Fine (Top Line 5)',
    description: 'Top line of the Treble staff. Highest line note.',
  },
  {
    id: 't-g5',
    clef: 'treble',
    noteName: 'G5',
    letter: 'G',
    octave: 5,
    freq: 783.99,
    positionType: 'space',
    lineOrSpaceNumber: 5,
    yPos: 10,
    mnemonic: 'Space sitting on Top Line',
    description: 'Sits right on top of Line 5.',
  },
  {
    id: 't-a5',
    clef: 'treble',
    noteName: 'A5',
    letter: 'A',
    octave: 5,
    freq: 880.0,
    positionType: 'ledger',
    lineOrSpaceNumber: 6,
    yPos: 0,
    hasLedgerLine: true,
    ledgerY: 0,
    mnemonic: '1st Ledger Line Above Staff',
    description: 'High soprano A note sitting on the first upper ledger line.',
  },
];

// Bass Clef standard notes (C2 up to C4)
export const BASS_STAFF_NOTES: StaffNote[] = [
  {
    id: 'b-g2',
    clef: 'bass',
    noteName: 'G2',
    letter: 'G',
    octave: 2,
    freq: 98.0,
    positionType: 'line',
    lineOrSpaceNumber: 1,
    yPos: 100,
    mnemonic: 'Good (Line 1 — Bottom Line)',
    description: 'Bottom line of the Bass staff. Part of "Good Boys Do Fine Always".',
  },
  {
    id: 'b-a2',
    clef: 'bass',
    noteName: 'A2',
    letter: 'A',
    octave: 2,
    freq: 110.0,
    positionType: 'space',
    lineOrSpaceNumber: 1,
    yPos: 90,
    mnemonic: 'All (Space 1)',
    description: 'First space from bottom in Bass staff. "All Cows Eat Grass".',
  },
  {
    id: 'b-b2',
    clef: 'bass',
    noteName: 'B2',
    letter: 'B',
    octave: 2,
    freq: 123.47,
    positionType: 'line',
    lineOrSpaceNumber: 2,
    yPos: 80,
    mnemonic: 'Boys (Line 2)',
    description: 'Second line from bottom in Bass staff.',
  },
  {
    id: 'b-c3',
    clef: 'bass',
    noteName: 'C3',
    letter: 'C',
    octave: 3,
    freq: 130.81,
    positionType: 'space',
    lineOrSpaceNumber: 2,
    yPos: 70,
    mnemonic: 'Cows (Space 2)',
    description: 'Second space from bottom. Bass C tone.',
  },
  {
    id: 'b-d3',
    clef: 'bass',
    noteName: 'D3',
    letter: 'D',
    octave: 3,
    freq: 146.83,
    positionType: 'line',
    lineOrSpaceNumber: 3,
    yPos: 60,
    mnemonic: 'Do (Line 3 — Center Line)',
    description: 'Middle line of the Bass staff. "Good Boys Do Fine Always".',
  },
  {
    id: 'b-e3',
    clef: 'bass',
    noteName: 'E3',
    letter: 'E',
    octave: 3,
    freq: 164.81,
    positionType: 'space',
    lineOrSpaceNumber: 3,
    yPos: 50,
    mnemonic: 'Eat (Space 3)',
    description: 'Third space from bottom. "All Cows Eat Grass".',
  },
  {
    id: 'b-f3',
    clef: 'bass',
    noteName: 'F3',
    letter: 'F',
    octave: 3,
    freq: 174.61,
    positionType: 'line',
    lineOrSpaceNumber: 4,
    yPos: 40,
    mnemonic: 'Fine (Line 4) — Bass Clef Two-Dots Center',
    description: 'The two dots of the Bass Clef surround this exact line (F-Clef).',
  },
  {
    id: 'b-g3',
    clef: 'bass',
    noteName: 'G3',
    letter: 'G',
    octave: 3,
    freq: 196.0,
    positionType: 'space',
    lineOrSpaceNumber: 4,
    yPos: 30,
    mnemonic: 'Grass (Top Space 4)',
    description: 'Top space of the Bass staff. Completes "All Cows Eat Grass".',
  },
  {
    id: 'b-a3',
    clef: 'bass',
    noteName: 'A3',
    letter: 'A',
    octave: 3,
    freq: 220.0,
    positionType: 'line',
    lineOrSpaceNumber: 5,
    yPos: 20,
    mnemonic: 'Always (Top Line 5)',
    description: 'Top line of the Bass staff. "Good Boys Do Fine Always".',
  },
  {
    id: 'b-b3',
    clef: 'bass',
    noteName: 'B3',
    letter: 'B',
    octave: 3,
    freq: 246.94,
    positionType: 'space',
    lineOrSpaceNumber: 5,
    yPos: 10,
    mnemonic: 'Space sitting on Top Line',
    description: 'Sits right on top of the Bass staff before Middle C.',
  },
  {
    id: 'b-c4',
    clef: 'bass',
    noteName: 'C4',
    letter: 'C',
    octave: 4,
    freq: 261.63,
    positionType: 'ledger',
    lineOrSpaceNumber: 6,
    yPos: 0,
    hasLedgerLine: true,
    ledgerY: 0,
    mnemonic: 'Middle C (Ledger line above Bass)',
    description: 'The exact same Middle C connecting Bass clef to Treble clef!',
  },
];

// Note Values & Durations
export interface NoteDurationItem {
  id: string;
  nameUS: string;
  nameUK: string;
  beats: number;
  fractionText: string;
  symbolDesc: string;
  restDesc: string;
  exampleAudioDuration: number;
  tip: string;
}

export const NOTE_DURATION_LIST: NoteDurationItem[] = [
  {
    id: 'whole',
    nameUS: 'Whole Note',
    nameUK: 'Semibreve',
    beats: 4,
    fractionText: '4 Beats (1 Full Measure in 4/4)',
    symbolDesc: 'Open hollow oval notehead with NO stem.',
    restDesc: 'Whole Rest: Hangs below Line 4 like a hole in the ground.',
    exampleAudioDuration: 2.2,
    tip: 'Count: "1 - 2 - 3 - 4". Holds for an entire standard 4/4 measure.',
  },
  {
    id: 'half',
    nameUS: 'Half Note',
    nameUK: 'Minim',
    beats: 2,
    fractionText: '2 Beats (1/2 of a Whole Note)',
    symbolDesc: 'Open hollow oval notehead WITH a stem.',
    restDesc: 'Half Rest: Sits right on top of Line 3 like a top hat.',
    exampleAudioDuration: 1.2,
    tip: 'Count: "1 - 2" or "3 - 4". Two half notes fill a 4/4 measure.',
  },
  {
    id: 'quarter',
    nameUS: 'Quarter Note',
    nameUK: 'Crotchet',
    beats: 1,
    fractionText: '1 Beat (The Basic Walking Pulse)',
    symbolDesc: 'Solid filled-in black notehead WITH a stem.',
    restDesc: 'Quarter Rest: Stylized lightning bolt / squiggly shape.',
    exampleAudioDuration: 0.65,
    tip: 'Count: "1, 2, 3, 4". The steady heartbeat beat in most popular music.',
  },
  {
    id: 'eighth',
    nameUS: 'Eighth Note',
    nameUK: 'Quaver',
    beats: 0.5,
    fractionText: '1/2 Beat (Twice as fast as a quarter)',
    symbolDesc: 'Filled black notehead with stem and ONE flag (or beamed in pairs).',
    restDesc: 'Eighth Rest: Resembles a slanted number "7" with a dot.',
    exampleAudioDuration: 0.35,
    tip: 'Count: "1 - and - 2 - and - 3 - and - 4 - and".',
  },
  {
    id: 'sixteenth',
    nameUS: 'Sixteenth Note',
    nameUK: 'Semiquaver',
    beats: 0.25,
    fractionText: '1/4 Beat (4 notes inside 1 beat)',
    symbolDesc: 'Filled black notehead with stem and TWO flags (or double beam).',
    restDesc: 'Sixteenth Rest: Slanted stem with TWO curved flags.',
    exampleAudioDuration: 0.2,
    tip: 'Count: "1 - e - and - a, 2 - e - and - a". Used for rapid runs and fast grooves.',
  },
];

// Key Signatures Data
export interface KeySignatureData {
  id: string;
  name: string; // e.g. "G Major / E Minor"
  majorKey: string;
  minorKey: string;
  accidentalsCount: number;
  type: 'natural' | 'sharp' | 'flat';
  accidentals: string[]; // ['F#'], ['F#', 'C#'], etc.
  scaleNotes: string[];
  mnemonicRule: string;
  explanation: string;
}

export const KEY_SIGNATURES_LIST: KeySignatureData[] = [
  {
    id: 'c-major',
    name: 'C Major / A Minor',
    majorKey: 'C',
    minorKey: 'Am',
    accidentalsCount: 0,
    type: 'natural',
    accidentals: [],
    scaleNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    mnemonicRule: 'Zero Sharps / Zero Flats — All Natural White Keys',
    explanation: 'The baseline key of Western music. Pure diatonic pitches without any accidentals.',
  },
  {
    id: 'g-major',
    name: 'G Major / E Minor',
    majorKey: 'G',
    minorKey: 'Em',
    accidentalsCount: 1,
    type: 'sharp',
    accidentals: ['F#'],
    scaleNotes: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'],
    mnemonicRule: '1 Sharp (F#) — Move up 1/2 step from last sharp: F# -> G',
    explanation: 'The sharp is on F (Line 5 of Treble). All F notes are played as F# throughout the song.',
  },
  {
    id: 'd-major',
    name: 'D Major / B Minor',
    majorKey: 'D',
    minorKey: 'Bm',
    accidentalsCount: 2,
    type: 'sharp',
    accidentals: ['F#', 'C#'],
    scaleNotes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'],
    mnemonicRule: '2 Sharps (F#, C#) — Last sharp C# -> up 1/2 step to D',
    explanation: 'Sharps on F and C. Order of sharps: Father Charles (F, C).',
  },
  {
    id: 'a-major',
    name: 'A Major / F# Minor',
    majorKey: 'A',
    minorKey: 'F#m',
    accidentalsCount: 3,
    type: 'sharp',
    accidentals: ['F#', 'C#', 'G#'],
    scaleNotes: ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5'],
    mnemonicRule: '3 Sharps (F#, C#, G#) — Last sharp G# -> up 1/2 step to A',
    explanation: 'Father Charles Goes (F, C, G). Bright, celebratory key.',
  },
  {
    id: 'e-major',
    name: 'E Major / C# Minor',
    majorKey: 'E',
    minorKey: 'C#m',
    accidentalsCount: 4,
    type: 'sharp',
    accidentals: ['F#', 'C#', 'G#', 'D#'],
    scaleNotes: ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5'],
    mnemonicRule: '4 Sharps (F#, C#, G#, D#) — Last sharp D# -> up 1/2 step to E',
    explanation: 'Father Charles Goes Down (F, C, G, D). Rich resonant guitar key.',
  },
  {
    id: 'b-major',
    name: 'B Major / G# Minor',
    majorKey: 'B',
    minorKey: 'G#m',
    accidentalsCount: 5,
    type: 'sharp',
    accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'],
    scaleNotes: ['B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'B4'],
    mnemonicRule: '5 Sharps (F#, C#, G#, D#, A#) — Last sharp A# -> up 1/2 step to B',
    explanation: 'Father Charles Goes Down And (F, C, G, D, A). Chopins favorite piano key.',
  },
  {
    id: 'f-major',
    name: 'F Major / D Minor',
    majorKey: 'F',
    minorKey: 'Dm',
    accidentalsCount: 1,
    type: 'flat',
    accidentals: ['Bb'],
    scaleNotes: ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'],
    mnemonicRule: '1 Flat (Bb) — Memory exception: 1 flat is always F Major',
    explanation: 'The flat is on B (Middle Line 3 of Treble). Warm pastoral acoustic key.',
  },
  {
    id: 'bb-major',
    name: 'Bb Major / G Minor',
    majorKey: 'Bb',
    minorKey: 'Gm',
    accidentalsCount: 2,
    type: 'flat',
    accidentals: ['Bb', 'Eb'],
    scaleNotes: ['Bb3', 'C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4'],
    mnemonicRule: '2 Flats (Bb, Eb) — Penultimate flat is Bb -> Bb Major',
    explanation: 'Second-to-last flat rule: Bb is the key name! Order: Battle Ends (B, E).',
  },
  {
    id: 'eb-major',
    name: 'Eb Major / C Minor',
    majorKey: 'Eb',
    minorKey: 'Cm',
    accidentalsCount: 3,
    type: 'flat',
    accidentals: ['Bb', 'Eb', 'Ab'],
    scaleNotes: ['Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5', 'D5', 'Eb5'],
    mnemonicRule: '3 Flats (Bb, Eb, Ab) — Penultimate flat is Eb -> Eb Major',
    explanation: 'Battle Ends And (B, E, A). Majestic brass & Beethoven key.',
  },
  {
    id: 'ab-major',
    name: 'Ab Major / F Minor',
    majorKey: 'Ab',
    minorKey: 'Fm',
    accidentalsCount: 4,
    type: 'flat',
    accidentals: ['Bb', 'Eb', 'Ab', 'Db'],
    scaleNotes: ['Ab3', 'Bb3', 'C4', 'Db4', 'Eb4', 'F4', 'G4', 'Ab4'],
    mnemonicRule: '4 Flats (Bb, Eb, Ab, Db) — Penultimate flat is Ab -> Ab Major',
    explanation: 'Battle Ends And Down (B, E, A, D). Soulful gospel & jazz ballad key.',
  },
  {
    id: 'db-major',
    name: 'Db Major / Bb Minor',
    majorKey: 'Db',
    minorKey: 'Bbm',
    accidentalsCount: 5,
    type: 'flat',
    accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
    scaleNotes: ['Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'C5', 'Db5'],
    mnemonicRule: '5 Flats (Bb, Eb, Ab, Db, Gb) — Penultimate flat is Db -> Db Major',
    explanation: 'Battle Ends And Down Goes (B, E, A, D, G). Romantic lush impressionist key.',
  },
];

// Time Signatures Data
export interface TimeSignatureItem {
  id: string;
  top: number;
  bottom: number;
  name: string;
  meterType: string;
  pulsePattern: string;
  genres: string;
  explanation: string;
  beatsArray: { beatNum: number; accent: boolean; label: string }[];
}

export const TIME_SIGNATURES_LIST: TimeSignatureItem[] = [
  {
    id: '4-4',
    top: 4,
    bottom: 4,
    name: '4/4 Time (Common Time "C")',
    meterType: 'Simple Quadruple Meter',
    pulsePattern: 'STRONG - weak - medium - weak (1, 2, 3, 4)',
    genres: 'Pop, Rock, Classical, Jazz, Funk, Hip-Hop, Ballads',
    explanation:
      'Top 4 = 4 beats in every measure. Bottom 4 = The quarter note gets 1 beat. Found in over 90% of modern songs.',
    beatsArray: [
      { beatNum: 1, accent: true, label: 'ONE (Downbeat)' },
      { beatNum: 2, accent: false, label: 'two' },
      { beatNum: 3, accent: false, label: 'three (medium)' },
      { beatNum: 4, accent: false, label: 'four (upbeat)' },
    ],
  },
  {
    id: '3-4',
    top: 3,
    bottom: 4,
    name: '3/4 Time (Waltz / Triple Time)',
    meterType: 'Simple Triple Meter',
    pulsePattern: 'STRONG - weak - weak (ONE - two - three)',
    genres: 'Waltz, Acoustic Ballads, Country, Folk, Movie Themes',
    explanation:
      'Top 3 = 3 beats in every measure. Bottom 4 = Quarter note gets 1 beat. Creates a circular, dancing lilt.',
    beatsArray: [
      { beatNum: 1, accent: true, label: 'ONE (Heavy Lilt)' },
      { beatNum: 2, accent: false, label: 'two' },
      { beatNum: 3, accent: false, label: 'three' },
    ],
  },
  {
    id: '2-4',
    top: 2,
    bottom: 4,
    name: '2/4 Time (March Meter)',
    meterType: 'Simple Duple Meter',
    pulsePattern: 'STRONG - weak (ONE - two, ONE - two)',
    genres: 'Marches, Polkas, Uptempo Ragtime, Samba, Kids Songs',
    explanation:
      'Top 2 = 2 beats in every measure. Bottom 4 = Quarter note gets 1 beat. Mimics the left-right stride of marching feet.',
    beatsArray: [
      { beatNum: 1, accent: true, label: 'ONE (Left)' },
      { beatNum: 2, accent: false, label: 'two (Right)' },
    ],
  },
  {
    id: '6-8',
    top: 6,
    bottom: 8,
    name: '6/8 Time (Compound Duple / Swing)',
    meterType: 'Compound Duple Meter',
    pulsePattern: 'ONE-two-three, FOUR-five-six (2 Dotted-Quarter Pulses)',
    genres: 'Soul Ballads, Blues, Gospel Shuffles, Irish Jigs, Barcarolles',
    explanation:
      'Top 6 = 6 eighth notes per measure, naturally grouped into TWO big swinging beats (3 + 3). Feels rolling and fluid.',
    beatsArray: [
      { beatNum: 1, accent: true, label: 'ONE (Big Pulse 1)' },
      { beatNum: 2, accent: false, label: 'two' },
      { beatNum: 3, accent: false, label: 'three' },
      { beatNum: 4, accent: true, label: 'FOUR (Big Pulse 2)' },
      { beatNum: 5, accent: false, label: 'five' },
      { beatNum: 6, accent: false, label: 'six' },
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StaffNotationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intro' | 'symbols' | 'keys' | 'meters' | 'game'>(
    'intro'
  );

  // Tab 1 state: Active Staff Note
  const [activeClef, setActiveClef] = useState<'treble' | 'bass'>('treble');
  const [selectedStaffNote, setSelectedStaffNote] = useState<StaffNote>(TREBLE_STAFF_NOTES[0]);

  // Tab 3 state: Active Key Signature
  const [selectedKeySig, setSelectedKeySig] = useState<KeySignatureData>(KEY_SIGNATURES_LIST[0]);
  const [isPlayingScale, setIsPlayingScale] = useState(false);

  // Tab 4 state: Active Time Signature & Metronome Beat player
  const [selectedTimeSig, setSelectedTimeSig] = useState<TimeSignatureItem>(TIME_SIGNATURES_LIST[0]);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [activeBeatIndex, setActiveBeatIndex] = useState(-1);

  // Tab 5 state: Interactive "Read the Note" Mini-Trainer Game
  const [quizClef, setQuizClef] = useState<'treble' | 'bass'>('treble');
  const [quizTargetNote, setQuizTargetNote] = useState<StaffNote>(TREBLE_STAFF_NOTES[4]); // G4 default
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
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

  // Play single note on the staff
  const handlePlayStaffNote = (note: StaffNote) => {
    soundEngine.playClick(620);
    soundEngine.playChord([note.noteName], 1.6, false);
    setSelectedStaffNote(note);
  };

  // Play Scale for Key Signature
  const handlePlayKeyScale = (keyData: KeySignatureData) => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);
    soundEngine.playClick(800);

    scaleTimeoutRef.current.forEach((t) => clearTimeout(t));
    scaleTimeoutRef.current = [];

    const notes = keyData.scaleNotes;
    notes.forEach((note, idx) => {
      const t = setTimeout(() => {
        soundEngine.playChord([note], 0.7, false);
        if (idx === notes.length - 1) {
          setTimeout(() => setIsPlayingScale(false), 800);
        }
      }, idx * 280);
      scaleTimeoutRef.current.push(t);
    });
  };

  // Play Home Tonic Triad
  const handlePlayHomeChord = (keyData: KeySignatureData) => {
    soundEngine.playClick(720);
    const root = keyData.scaleNotes[0];
    const third = keyData.scaleNotes[2];
    const fifth = keyData.scaleNotes[4];
    soundEngine.playChord([root, third, fifth], 2.0, true);
  };

  // Metronome Beat Player for Time Signatures
  const handleToggleMetronome = (timeSig: TimeSignatureItem) => {
    if (isMetronomeActive) {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
      setIsMetronomeActive(false);
      setActiveBeatIndex(-1);
      return;
    }

    soundEngine.playClick(900);
    setIsMetronomeActive(true);
    let currentBeat = 0;
    const totalBeats = timeSig.beatsArray.length;
    const msPerBeat = timeSig.id === '6-8' ? 260 : 500; // ~120 BPM

    // Play first tick immediately
    const firstBeat = timeSig.beatsArray[0];
    soundEngine.playClick(firstBeat.accent ? 1050 : 680);
    setActiveBeatIndex(0);

    metronomeTimerRef.current = setInterval(() => {
      currentBeat = (currentBeat + 1) % totalBeats;
      const b = timeSig.beatsArray[currentBeat];
      soundEngine.playClick(b.accent ? 1050 : 680);
      setActiveBeatIndex(currentBeat);
    }, msPerBeat);
  };

  // Stop metronome when changing time signature
  const handleSelectTimeSig = (item: TimeSignatureItem) => {
    if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    metronomeTimerRef.current = null;
    setIsMetronomeActive(false);
    setActiveBeatIndex(-1);
    setSelectedTimeSig(item);
  };

  // Game: Generate new question
  const generateNewQuizQuestion = (clefToUse?: 'treble' | 'bass') => {
    const clef = clefToUse || quizClef;
    const pool = clef === 'treble' ? TREBLE_STAFF_NOTES : BASS_STAFF_NOTES;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    setQuizTargetNote(chosen);
    setQuizFeedback(null);
  };

  // Game: Guess note
  const handleQuizGuess = (letter: string) => {
    const isCorrect = letter === quizTargetNote.letter;
    setQuizTotal((prev) => prev + 1);

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      soundEngine.playChord([quizTargetNote.noteName], 1.5, false);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // Ignore
      }
      setQuizFeedback({
        correct: true,
        text: `Correct! That note is ${quizTargetNote.noteName} (${quizTargetNote.mnemonic}).`,
      });
      setTimeout(() => generateNewQuizQuestion(), 1600);
    } else {
      soundEngine.playClick(320);
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

  const currentNotesList = activeClef === 'treble' ? TREBLE_STAFF_NOTES : BASS_STAFF_NOTES;

  return (
    <section
      id="staff-notation"
      className="mb-20 rounded-3xl bg-white border-2 border-[#d8ccb8] shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden scroll-mt-24"
    >
      {/* ===================================================================== */}
      {/* 1. TOP BANNER HEADER                                                  */}
      {/* ===================================================================== */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#141518] via-[#1e2025] to-[#141518] text-white border-b border-[#2b2d35]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#c5a880] text-[11px] font-mono uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Music Theory Masterclass • The Universal Written Language</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              Introduction to Staff Notation &amp; Sheet Music
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
              Staff notation is the 500-year-old international language of music. It represents{' '}
              <strong className="text-[#c5a880]">Pitch</strong> vertically (high vs. low) and{' '}
              <strong className="text-[#c5a880]">Rhythm</strong> horizontally (time). Click any note, symbol, key, or time signature below to see how it works and hear authentic grand piano audio!
            </p>
          </div>

          {/* Quick Summary Pill Badge */}
          <div className="flex items-center gap-3 self-start lg:self-center bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Staff Lines
              </div>
              <div className="text-xl font-bold font-serif text-white mt-0.5">5 Lines</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#c5a880]">
                Spaces
              </div>
              <div className="text-xl font-bold font-serif text-[#c5a880] mt-0.5">4 Spaces</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Bridge
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-1">Middle C</div>
            </div>
          </div>
        </div>

        {/* 5-TAB NAVIGATION BAR */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(680);
              setActiveTab('intro');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'intro'
                ? 'bg-[#c5a880] text-[#141518] shadow-md scale-105'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>1. The Grand Staff &amp; Clefs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(720);
              setActiveTab('symbols');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'symbols'
                ? 'bg-[#c5a880] text-[#141518] shadow-md scale-105'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Note Durations &amp; Symbols</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(760);
              setActiveTab('keys');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'bg-[#c5a880] text-[#141518] shadow-md scale-105'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Key Signatures Masterclass</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(800);
              setActiveTab('meters');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'meters'
                ? 'bg-[#c5a880] text-[#141518] shadow-md scale-105'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4. Time Signatures &amp; Meter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(840);
              setActiveTab('game');
              generateNewQuizQuestion();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'game'
                ? 'bg-emerald-400 text-[#141518] shadow-md scale-105 ring-2 ring-emerald-300'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>★ Interactive Note Trainer Game</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: THE GRAND STAFF & INTERACTIVE NOTE EXPLORER                     */}
      {/* ===================================================================== */}
      {activeTab === 'intro' && (
        <div className="p-6 sm:p-8 space-y-8 bg-[#fdfcfb]">
          {/* Explanation Header Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#eae6de] shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9e7a4b] block mb-1">
                The 5 Lines &amp; 4 Spaces
              </span>
              <h4 className="text-sm font-bold text-[#141518] mb-1">Numbered from Bottom to Top</h4>
              <p className="text-xs text-[#5c5f6a] leading-relaxed">
                Line 1 is at the bottom; Line 5 is at the top. Moving UP the staff raises the musical pitch. Moving DOWN lowers the pitch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#eae6de] shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9e7a4b] block mb-1">
                Treble Clef (G-Clef)
              </span>
              <h4 className="text-sm font-bold text-[#141518] mb-1">Right Hand Piano &amp; Vocals</h4>
              <p className="text-xs text-[#5c5f6a] leading-relaxed">
                Curls around Line 2 (G4). Lines: <strong className="text-[#141518]">E-G-B-D-F</strong> ("Every Good Boy Does Fine"). Spaces: <strong className="text-[#141518]">F-A-C-E</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#eae6de] shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9e7a4b] block mb-1">
                Bass Clef (F-Clef)
              </span>
              <h4 className="text-sm font-bold text-[#141518] mb-1">Left Hand Piano &amp; Bass</h4>
              <p className="text-xs text-[#5c5f6a] leading-relaxed">
                Two dots surround Line 4 (F3). Lines: <strong className="text-[#141518]">G-B-D-F-A</strong> ("Good Boys Do Fine Always"). Spaces: <strong className="text-[#141518]">A-C-E-G</strong> ("All Cows Eat Grass").
              </p>
            </div>
          </div>

          {/* Interactive Clef Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#eae6de]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#141518]">Select Staff Clef:</span>
              <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(700);
                    setActiveClef('treble');
                    setSelectedStaffNote(TREBLE_STAFF_NOTES[0]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeClef === 'treble'
                      ? 'bg-[#141518] text-[#c5a880] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  𝄞 Treble Clef (G-Clef)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(600);
                    setActiveClef('bass');
                    setSelectedStaffNote(BASS_STAFF_NOTES[0]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeClef === 'bass'
                      ? 'bg-[#141518] text-[#c5a880] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  𝄢 Bass Clef (F-Clef)
                </button>
              </div>
            </div>

            <span className="text-xs text-[#5c5f6a]">
              Click any notehead on the staff below to audition on grand piano!
            </span>
          </div>

          {/* INTERACTIVE SVG STAFF ENGRAVER */}
          <div className="p-6 rounded-3xl bg-white border-2 border-[#eae6de] shadow-inner overflow-x-auto">
            <div className="min-w-[700px] flex flex-col items-center">
              <svg viewBox="0 0 760 170" className="w-full max-w-[760px] h-auto select-none overflow-visible">
                {/* Staff Lines (5 horizontal lines spaced 20px apart) */}
                {[20, 40, 60, 80, 100].map((y, lineIdx) => (
                  <g key={y}>
                    <line x1="40" y1={y} x2="720" y2={y} stroke="#141518" strokeWidth="2" />
                    <text
                      x="25"
                      y={y + 4}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#8a6839"
                    >
                      L{5 - lineIdx}
                    </text>
                  </g>
                ))}

                {/* Left Measure Bar */}
                <line x1="40" y1="20" x2="40" y2="100" stroke="#141518" strokeWidth="3" />
                {/* Right Measure Bar */}
                <line x1="720" y1="20" x2="720" y2="100" stroke="#141518" strokeWidth="2" />
                <line x1="725" y1="20" x2="725" y2="100" stroke="#141518" strokeWidth="4" />

                {/* Clef Symbol */}
                {activeClef === 'treble' ? (
                  <text x="50" y="86" fontSize="76" fontFamily="serif" fill="#141518">
                    𝄞
                  </text>
                ) : (
                  <text x="50" y="66" fontSize="62" fontFamily="serif" fill="#141518">
                    𝄢
                  </text>
                )}

                {/* Common Time 4/4 indicator */}
                <text x="100" y="55" fontSize="26" fontFamily="serif" fontWeight="bold" fill="#141518">
                  4
                </text>
                <text x="100" y="95" fontSize="26" fontFamily="serif" fontWeight="bold" fill="#141518">
                  4
                </text>

                {/* Render Notes across the staff */}
                {currentNotesList.map((note, idx) => {
                  const xPos = 145 + idx * 46;
                  const isSelected = selectedStaffNote.id === note.id;

                  return (
                    <g
                      key={note.id}
                      onClick={() => handlePlayStaffNote(note)}
                      className="cursor-pointer group"
                    >
                      {/* Hover / Active Hit Area */}
                      <rect
                        x={xPos - 18}
                        y="0"
                        width="36"
                        height="150"
                        fill={isSelected ? '#c5a880' : 'transparent'}
                        opacity={isSelected ? '0.15' : '0'}
                        className="group-hover:opacity-10 transition-opacity"
                        rx="8"
                      />

                      {/* Ledger Line if present */}
                      {note.hasLedgerLine && note.ledgerY !== undefined && (
                        <line
                          x1={xPos - 16}
                          y1={note.ledgerY}
                          x2={xPos + 16}
                          y2={note.ledgerY}
                          stroke={isSelected ? '#9e7a4b' : '#141518'}
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Stem */}
                      <line
                        x1={note.yPos > 60 ? xPos + 6.5 : xPos - 6.5}
                        y1={note.yPos}
                        x2={note.yPos > 60 ? xPos + 6.5 : xPos - 6.5}
                        y2={note.yPos > 60 ? note.yPos - 36 : note.yPos + 36}
                        stroke={isSelected ? '#c5a880' : '#141518'}
                        strokeWidth="2"
                        className="group-hover:stroke-[#9e7a4b] transition-colors"
                      />

                      {/* Notehead (slanted ellipse) */}
                      <ellipse
                        cx={xPos}
                        cy={note.yPos}
                        rx="8"
                        ry="5.5"
                        transform={`rotate(-22 ${xPos} ${note.yPos})`}
                        fill={isSelected ? '#c5a880' : '#141518'}
                        className="group-hover:fill-[#9e7a4b] transition-colors"
                      />

                      {/* Note Letter Badge underneath */}
                      <rect
                        x={xPos - 13}
                        y="135"
                        width="26"
                        height="20"
                        rx="6"
                        fill={isSelected ? '#141518' : '#f4efe6'}
                      />
                      <text
                        x={xPos}
                        y="149"
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={isSelected ? '#c5a880' : '#141518'}
                      >
                        {note.letter}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* SELECTED NOTE DETAILS INSPECTOR */}
          <div className="p-5 rounded-2xl bg-white border border-[#eae6de] shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#141518] text-[#c5a880] flex flex-col items-center justify-center font-mono font-bold shrink-0 shadow-md">
                <span className="text-xl leading-none">{selectedStaffNote.letter}</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Oct {selectedStaffNote.octave}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-[#141518]">
                    Note {selectedStaffNote.noteName} ({selectedStaffNote.clef === 'treble' ? 'Treble Clef' : 'Bass Clef'})
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold">
                    {selectedStaffNote.positionType === 'line'
                      ? `Line ${selectedStaffNote.lineOrSpaceNumber}`
                      : selectedStaffNote.positionType === 'space'
                      ? `Space ${selectedStaffNote.lineOrSpaceNumber}`
                      : 'Ledger Line'}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    Freq: {selectedStaffNote.freq.toFixed(1)} Hz
                  </span>
                </div>
                <p className="text-xs text-[#5c5f6a] mt-1 leading-relaxed">
                  <strong className="text-[#8a6839]">Mnemonic: </strong>
                  {selectedStaffNote.mnemonic} — {selectedStaffNote.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePlayStaffNote(selectedStaffNote)}
              className="px-4 py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-[#c5a880] text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-sm hover:scale-105 cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>Replay {selectedStaffNote.noteName}</span>
            </button>
          </div>

          {/* Mnemonics Quick Reference Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd3]">
              <span className="text-xs font-mono font-bold text-[#141518] uppercase tracking-wider block mb-2">
                𝄞 Treble Clef Memory Tricks:
              </span>
              <ul className="space-y-1.5 text-xs text-[#5c5f6a]">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#141518] text-[#c5a880] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    L
                  </span>
                  <span>
                    Lines (Bottom to Top): <strong className="text-[#141518]">E - G - B - D - F</strong> ("Every Good Boy Does Fine")
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8a6839] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    S
                  </span>
                  <span>
                    Spaces (Bottom to Top): <strong className="text-[#141518]">F - A - C - E</strong> ("Spells FACE in the Space")
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd3]">
              <span className="text-xs font-mono font-bold text-[#141518] uppercase tracking-wider block mb-2">
                𝄢 Bass Clef Memory Tricks:
              </span>
              <ul className="space-y-1.5 text-xs text-[#5c5f6a]">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#141518] text-[#c5a880] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    L
                  </span>
                  <span>
                    Lines (Bottom to Top): <strong className="text-[#141518]">G - B - D - F - A</strong> ("Good Boys Do Fine Always")
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8a6839] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    S
                  </span>
                  <span>
                    Spaces (Bottom to Top): <strong className="text-[#141518]">A - C - E - G</strong> ("All Cows Eat Grass")
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: NOTE VALUES, DURATIONS & MUSIC SYMBOLS                          */}
      {/* ===================================================================== */}
      {activeTab === 'symbols' && (
        <div className="p-6 sm:p-8 space-y-8 bg-[#fdfcfb]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#141518]">
              Note Values &amp; Musical Duration Pyramid
            </h3>
            <p className="text-xs text-[#5c5f6a] mt-1 max-w-2xl leading-relaxed">
              Every note shape tells the musician exactly how long to hold the pitch. When music is silent, composers write matching <strong className="text-[#141518]">Rests</strong> for the identical number of beats. Click any card to hear the note held for its exact duration!
            </p>
          </div>

          {/* Interactive Note Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NOTE_DURATION_LIST.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-[#eae6de] shadow-2xs hover:border-[#c5a880] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0ece3]">
                    <div>
                      <h4 className="text-sm font-bold text-[#141518]">{item.nameUS}</h4>
                      <span className="text-[11px] font-mono text-[#8a6839]">({item.nameUK})</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#141518] text-[#c5a880] font-mono text-xs font-bold">
                      {item.beats} {item.beats === 1 ? 'Beat' : 'Beats'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#5c5f6a] my-3">
                    <p>
                      <strong className="text-[#141518]">Note Shape: </strong>
                      {item.symbolDesc}
                    </p>
                    <p className="bg-[#faf8f5] p-2 rounded-xl border border-[#f0ece3]">
                      <strong className="text-[#8a6839]">Rest Symbol: </strong>
                      {item.restDesc}
                    </p>
                    <p className="text-[11px] text-stone-500 italic">{item.tip}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(880);
                    soundEngine.playChord(['C4'], item.exampleAudioDuration, false);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-stone-100 hover:bg-[#141518] hover:text-[#c5a880] text-[#141518] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#8a6839]" />
                  <span>Hear {item.beats} Beat Duration</span>
                </button>
              </div>
            ))}

            {/* Dotted Notes Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#faf6ef] to-white border border-[#e6dfd3] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e6dfd3]">
                  <div>
                    <h4 className="text-sm font-bold text-[#141518]">Dotted Notes</h4>
                    <span className="text-[11px] font-mono text-[#8a6839]">(e.g. Dotted Half Note)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-mono text-xs font-bold">
                    +50% Duration
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#5c5f6a] my-3">
                  <p>
                    <strong className="text-[#141518]">The Golden Rule: </strong>
                    A dot placed after any note adds exactly <strong className="text-[#8a6839]">half of its original value</strong>!
                  </p>
                  <p className="bg-white p-2 rounded-xl border border-[#e6dfd3] font-mono text-[11px]">
                    Half Note (2) + Dot (1) = <strong>3 Beats</strong><br />
                    Quarter Note (1) + Dot (0.5) = <strong>1.5 Beats</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(880);
                  soundEngine.playChord(['C4'], 1.8, false);
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Dotted Half Note (3 Beats)</span>
              </button>
            </div>
          </div>

          {/* Expressive Symbols & Dynamics */}
          <div className="pt-4 border-t border-[#eae6de]">
            <h4 className="text-sm font-bold text-[#141518] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9e7a4b]" />
              <span>Dynamics &amp; Expressive Symbols Cheat Sheet:</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
              {[
                { sym: 'pp', name: 'Pianissimo', desc: 'Very Soft whisper' },
                { sym: 'p', name: 'Piano', desc: 'Soft and gentle' },
                { sym: 'mp', name: 'Mezzo-Piano', desc: 'Moderately soft' },
                { sym: 'mf', name: 'Mezzo-Forte', desc: 'Moderately loud' },
                { sym: 'f', name: 'Forte', desc: 'Loud and strong' },
                { sym: 'ff', name: 'Fortissimo', desc: 'Very loud / powerful' },
              ].map((d) => (
                <div key={d.sym} className="p-3 rounded-xl bg-white border border-[#eae6de] shadow-2xs">
                  <div className="font-serif italic font-extrabold text-xl text-[#141518]">{d.sym}</div>
                  <div className="text-xs font-bold text-[#8a6839] mt-0.5">{d.name}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{d.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#eae6de] flex items-start gap-2.5">
                <span className="font-serif font-bold text-lg text-[#141518] shrink-0 mt-0.5">·</span>
                <div>
                  <h5 className="text-xs font-bold text-[#141518]">Staccato (Dot above note)</h5>
                  <p className="text-[11px] text-[#5c5f6a]">Play short, detached, and light.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae6de] flex items-start gap-2.5">
                <span className="font-serif font-bold text-lg text-[#141518] shrink-0 mt-0.5">&gt;</span>
                <div>
                  <h5 className="text-xs font-bold text-[#141518]">Accent (Chevron above note)</h5>
                  <p className="text-[11px] text-[#5c5f6a]">Play note with stronger, punchier attack.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae6de] flex items-start gap-2.5">
                <span className="font-serif font-bold text-lg text-[#141518] shrink-0 mt-0.5">𝄐</span>
                <div>
                  <h5 className="text-xs font-bold text-[#141518]">Fermata ("Bird's Eye")</h5>
                  <p className="text-[11px] text-[#5c5f6a]">Hold the note longer than its standard value.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: KEY SIGNATURES MASTERCLASS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'keys' && (
        <div className="p-6 sm:p-8 space-y-8 bg-[#fdfcfb]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#141518]">
              Key Signatures (The Road Map of Tonality)
            </h3>
            <p className="text-xs text-[#5c5f6a] mt-1 max-w-2xl leading-relaxed">
              Key signatures are placed right after the clef to tell musicians which notes are sharp (♯) or flat (♭) throughout the whole piece. Use the secret rules below to instantly read ANY key signature!
            </p>
          </div>

          {/* Golden Rules Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block mb-1">
                Sharp Keys Secret Rule (♯)
              </span>
              <h4 className="text-sm font-bold text-[#141518] mb-1">
                The Last Sharp + Half-Step UP = Major Key!
              </h4>
              <p className="text-xs text-[#5c5f6a] leading-relaxed">
                Look at the very last sharp on the right: go UP one half-step to find the Major Key name! (e.g. 2 sharps are F# and C#. Move up half step from C# = <strong className="text-[#141518]">D Major</strong>).
              </p>
              <div className="mt-2 text-[11px] font-mono text-amber-900 font-semibold">
                Order of Sharps: F - C - G - D - A - E - B ("Father Charles Goes Down And Ends Battle")
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                Flat Keys Secret Rule (♭)
              </span>
              <h4 className="text-sm font-bold text-[#141518] mb-1">
                The Penultimate (2nd-to-Last) Flat IS the Key!
              </h4>
              <p className="text-xs text-[#5c5f6a] leading-relaxed">
                Look at the second flat from the right: that is literally the Major key name! (e.g. 3 flats are Bb, Eb, Ab. The second-to-last flat is <strong className="text-[#141518]">Eb Major</strong>!). 1 flat (Bb) is always F Major.
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-900 font-semibold">
                Order of Flats: B - E - A - D - G - C - F ("Battle Ends And Down Goes Charles' Father")
              </div>
            </div>
          </div>

          {/* Interactive Key Signature Selector */}
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#141518]">
                Select a Key Signature to Explore:
              </span>
              <span className="text-xs text-[#5c5f6a]">
                Active: <strong>{selectedKeySig.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {KEY_SIGNATURES_LIST.map((sig) => {
                const isSelected = selectedKeySig.id === sig.id;
                return (
                  <button
                    key={sig.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(680);
                      setSelectedKeySig(sig);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#141518] text-[#c5a880] shadow-md scale-105 ring-2 ring-[#c5a880]/50'
                        : sig.type === 'sharp'
                        ? 'bg-amber-500/15 text-amber-900 hover:bg-amber-500/25 border border-amber-300'
                        : sig.type === 'flat'
                        ? 'bg-emerald-500/15 text-emerald-900 hover:bg-emerald-500/25 border border-emerald-300'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    <span>{sig.majorKey}</span>
                    <span className="text-[10px] opacity-75 ml-1">
                      ({sig.accidentalsCount === 0 ? '♮' : `${sig.accidentalsCount}${sig.type === 'sharp' ? '♯' : '♭'}`})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Key Signature Display Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#eae6de] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#141518] text-[#c5a880] font-mono text-xs font-bold">
                  {selectedKeySig.majorKey} Major
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f4efe6] text-[#8a6839] font-mono text-xs font-semibold">
                  Relative Minor: {selectedKeySig.minorKey}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono">
                  {selectedKeySig.accidentalsCount === 0
                    ? 'Natural Scale (No sharps/flats)'
                    : `${selectedKeySig.accidentalsCount} ${selectedKeySig.type === 'sharp' ? 'Sharps' : 'Flats'}: ${selectedKeySig.accidentals.join(', ')}`}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#141518] pt-1">
                {selectedKeySig.mnemonicRule}
              </h4>
              <p className="text-xs text-[#5c5f6a] max-w-xl leading-relaxed">
                {selectedKeySig.explanation}
              </p>

              <div className="pt-2 text-xs font-mono text-[#8a6839]">
                Scale Notes: <strong>{selectedKeySig.scaleNotes.join(' - ')}</strong>
              </div>
            </div>

            {/* Actions: Play Scale & Play Tonic Chord */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePlayKeyScale(selectedKeySig)}
                disabled={isPlayingScale}
                className="px-4 py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-[#c5a880] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingScale ? 'Playing Scale...' : 'Play Scale'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayHomeChord(selectedKeySig)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#141518] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#8a6839]" />
                <span>Play Tonic Triad</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: TIME SIGNATURES & METRONOME METER PLAYER                        */}
      {/* ===================================================================== */}
      {activeTab === 'meters' && (
        <div className="p-6 sm:p-8 space-y-8 bg-[#fdfcfb]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#141518]">
              Time Signatures &amp; Musical Meter
            </h3>
            <p className="text-xs text-[#5c5f6a] mt-1 max-w-2xl leading-relaxed">
              The time signature is written as two stacked numbers at the beginning of sheet music. It defines the recurring pulse, rhythmic grouping, and bar divisions of the composition.
            </p>
          </div>

          {/* Time Signature Anatomy Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#eae6de] shadow-xs grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="flex items-center gap-6">
              <div className="w-20 h-24 rounded-2xl bg-[#141518] text-white flex flex-col items-center justify-center font-serif font-bold text-3xl shadow-md border border-[#c5a880]/30 shrink-0">
                <span className="text-[#c5a880]">4</span>
                <span className="w-12 h-0.5 bg-white/20 my-1" />
                <span>4</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-[#c5a880] font-mono uppercase text-[11px] block">
                    Top Number = How Many Beats
                  </strong>
                  <span className="text-[#5c5f6a]">
                    Tells you the exact number of beats in each measure (e.g. 4 beats, 3 beats, 2 beats).
                  </span>
                </div>
                <div>
                  <strong className="text-[#141518] font-mono uppercase text-[11px] block">
                    Bottom Number = Which Note Gets 1 Beat
                  </strong>
                  <span className="text-[#5c5f6a]">
                    4 = Quarter note (♩) gets 1 beat; 8 = Eighth note (♪) gets 1 beat; 2 = Half note (𝅗𝅥).
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#f0ece3] text-xs text-[#5c5f6a] leading-relaxed">
              <strong className="text-[#141518] block mb-1">Common Time (C):</strong>
              You will frequently see a large "C" symbol instead of 4/4. That stands for <em>Common Time</em>. A "C" with a vertical slash through it (𝄵) stands for <em>Cut Time (2/2)</em>, which is played twice as fast!
            </div>
          </div>

          {/* 4 Fundamental Time Signatures Interactive Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#141518]">
              Select a Time Signature &amp; Test Live Metronome Pulse:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIME_SIGNATURES_LIST.map((timeSig) => {
                const isSelected = selectedTimeSig.id === timeSig.id;
                const isPlayingThis = isSelected && isMetronomeActive;

                return (
                  <div
                    key={timeSig.id}
                    onClick={() => handleSelectTimeSig(timeSig)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#c5a880] shadow-md ring-2 ring-[#c5a880]/30'
                        : 'bg-white/80 hover:bg-white border-[#eae6de] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-xl bg-[#141518] text-white flex flex-col items-center justify-center font-serif font-bold text-xl shadow-xs">
                          <span className="text-[#c5a880]">{timeSig.top}</span>
                          <span className="w-8 h-px bg-white/20 my-0.5" />
                          <span>{timeSig.bottom}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#141518]">{timeSig.name}</h4>
                          <span className="text-[11px] font-mono text-[#8a6839]">{timeSig.meterType}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTimeSig(timeSig);
                          handleToggleMetronome(timeSig);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPlayingThis
                            ? 'bg-rose-500 text-white shadow-xs animate-pulse'
                            : 'bg-[#141518] hover:bg-[#2b2d35] text-[#c5a880]'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Pulse</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play Beat</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[#5c5f6a] leading-relaxed mb-3">
                      {timeSig.explanation}
                    </p>

                    {/* Animated Beat Visualizer Dots */}
                    <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#f0ece3]">
                      <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-2">
                        Pulse Pattern: <strong className="text-[#141518]">{timeSig.pulsePattern}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {timeSig.beatsArray.map((b, bIdx) => {
                          const isActive = isPlayingThis && activeBeatIndex === bIdx;
                          return (
                            <div
                              key={bIdx}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-center font-mono text-[11px] font-bold transition-all ${
                                isActive
                                  ? b.accent
                                    ? 'bg-amber-500 text-white shadow-md scale-110'
                                    : 'bg-[#141518] text-[#c5a880] shadow-sm scale-105'
                                  : b.accent
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-white text-stone-700 border border-stone-200'
                              }`}
                            >
                              <span>{b.beatNum}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: INTERACTIVE "READ THE NOTE" MINI-TRAINER GAME                   */}
      {/* ===================================================================== */}
      {activeTab === 'game' && (
        <div className="p-6 sm:p-8 space-y-8 bg-[#fdfcfb]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Interactive Sight-Reading Trainer</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#141518]">
                Can You Name This Note?
              </h3>
              <p className="text-xs text-[#5c5f6a] mt-1 max-w-xl leading-relaxed">
                Test your new sheet music knowledge! Look at the notehead on the staff and click the matching letter button. Earn streaks and hear the true piano pitch when you get it right!
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3 bg-white border border-[#eae6de] p-3 rounded-2xl shadow-xs self-start sm:self-center">
              <div className="text-center px-2">
                <div className="text-[10px] font-mono uppercase text-stone-500">Score</div>
                <div className="text-lg font-bold font-mono text-emerald-600">
                  {quizScore} / {quizTotal}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(600);
                  setQuizScore(0);
                  setQuizTotal(0);
                  generateNewQuizQuestion();
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                title="Reset Quiz"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clef Switcher for Quiz */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 font-bold uppercase">Clef:</span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(700);
                setQuizClef('treble');
                generateNewQuizQuestion('treble');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                quizClef === 'treble'
                  ? 'bg-[#141518] text-[#c5a880] shadow-xs'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              𝄞 Treble Clef
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setQuizClef('bass');
                generateNewQuizQuestion('bass');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                quizClef === 'bass'
                  ? 'bg-[#141518] text-[#c5a880] shadow-xs'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              𝄢 Bass Clef
            </button>
          </div>

          {/* SVG Flashcard Display */}
          <div className="p-6 rounded-3xl bg-white border-2 border-[#eae6de] shadow-sm flex flex-col items-center justify-center">
            <svg viewBox="0 0 460 160" className="w-full max-w-[460px] h-auto select-none overflow-visible">
              {/* 5 Staff lines */}
              {[30, 50, 70, 90, 110].map((y) => (
                <line key={y} x1="40" y1={y} x2="420" y2={y} stroke="#141518" strokeWidth="2" />
              ))}

              {/* Clef */}
              {quizClef === 'treble' ? (
                <text x="50" y="96" fontSize="76" fontFamily="serif" fill="#141518">
                  𝄞
                </text>
              ) : (
                <text x="50" y="76" fontSize="62" fontFamily="serif" fill="#141518">
                  𝄢
                </text>
              )}

              {/* Note position offset (note is at center X=230) */}
              {(() => {
                const targetY = quizTargetNote.yPos + 10;
                const hasLedger = quizTargetNote.hasLedgerLine;
                const ledgerY =
                  quizTargetNote.ledgerY !== undefined ? quizTargetNote.ledgerY + 10 : targetY;

                return (
                  <g>
                    {/* Ledger line */}
                    {hasLedger && (
                      <line
                        x1="210"
                        y1={ledgerY}
                        x2="250"
                        y2={ledgerY}
                        stroke="#141518"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Stem */}
                    <line
                      x1={targetY > 70 ? 236.5 : 223.5}
                      y1={targetY}
                      x2={targetY > 70 ? 236.5 : 223.5}
                      y2={targetY > 70 ? targetY - 36 : targetY + 36}
                      stroke="#141518"
                      strokeWidth="2"
                    />

                    {/* Notehead */}
                    <ellipse
                      cx="230"
                      cy={targetY}
                      rx="8.5"
                      ry="6"
                      transform={`rotate(-22 230 ${targetY})`}
                      fill="#141518"
                    />
                  </g>
                );
              })()}
            </svg>

            {/* Feedback message */}
            {quizFeedback && (
              <div
                className={`mt-4 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 ${
                  quizFeedback.correct
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {quizFeedback.correct ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{quizFeedback.text}</span>
              </div>
            )}
          </div>

          {/* Letter Choice Buttons (A through G) */}
          <div>
            <div className="text-center text-xs font-mono text-stone-500 uppercase tracking-wider mb-3">
              Click the correct note letter:
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleQuizGuess(letter)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white hover:bg-[#141518] hover:text-[#c5a880] text-[#141518] border-2 border-[#eae6de] hover:border-[#141518] font-mono text-lg font-bold shadow-xs hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
