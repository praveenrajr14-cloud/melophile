// Musical Transposition Engine for Melophile Music Academy
// Calculates mathematically and harmonically accurate chords for all 12 keys

export interface MusicalKey {
  id: string;
  name: string;
  shortName: string;
  rootNote: string;
  semitones: number; // Semitones offset from C (0-11)
  relativeMinor: string;
  keySignature: string;
  scaleDegrees: string[]; // Diatonic scale degrees [I, ii, iii, IV, V, vi, vii°]
}

export interface TransposedChord {
  name: string;
  symbol: string;
  roman: string;
  notes: string[]; // E.g., ['C4', 'E4', 'G4']
  root: string;
  bassNote: string;
  bassRole: string;
  inversionType: 'root' | 'first' | 'second' | 'third' | 'slash';
  inversionName: string; // 'Root Position', '1st Inversion', '2nd Inversion', etc.
  figuredBass: string; // '5/3', '6', '6/4', '7', etc.
  inversionFormula: string;
  inversionDescription: string;
  voiceLeadingReason: string;
  formula: string;
  vibe: string;
  description: string;
}

export interface ProgressionTemplateChord {
  roman: string;
  semitoneOffset: number; // Relative to root tonic
  quality: 'maj' | 'min' | 'maj7' | 'min7' | 'dom7' | 'dom9' | 'maj9' | 'min9' | 'add9' | 'min6' | 'dim7' | 'II_over_I' | 'iv_over_I' | 'I_over_3';
  inversion?: 'root' | 'first' | 'second' | 'third';
  vibe: string;
  formula: string;
  voiceLeadingReason?: string;
}

export interface ProgressionDefinition {
  id: string;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  isPro: boolean;
  genre: string;
  romanFormula: string;
  description: string;
  voiceLeadingTip: string;
  theoryInsight: string;
  chords: ProgressionTemplateChord[];
}

export interface ResolvedProgression {
  id: string;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  isPro: boolean;
  genre: string;
  romanFormula: string;
  description: string;
  voiceLeadingTip: string;
  theoryInsight: string;
  chords: TransposedChord[];
}

// 12 Musical Chromatic Keys with authentic musical spellings
export const MUSICAL_KEYS: MusicalKey[] = [
  {
    id: 'C',
    name: 'C Major',
    shortName: 'C',
    rootNote: 'C',
    semitones: 0,
    relativeMinor: 'A minor',
    keySignature: 'Natural • No sharps/flats',
    scaleDegrees: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  },
  {
    id: 'Db',
    name: 'D♭ / C♯ Major',
    shortName: 'D♭',
    rootNote: 'Db',
    semitones: 1,
    relativeMinor: 'B♭ minor',
    keySignature: '5 Flats (B♭, E♭, A♭, D♭, G♭)',
    scaleDegrees: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  },
  {
    id: 'D',
    name: 'D Major',
    shortName: 'D',
    rootNote: 'D',
    semitones: 2,
    relativeMinor: 'B minor',
    keySignature: '2 Sharps (F♯, C♯)',
    scaleDegrees: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  },
  {
    id: 'Eb',
    name: 'E♭ Major',
    shortName: 'E♭',
    rootNote: 'Eb',
    semitones: 3,
    relativeMinor: 'C minor',
    keySignature: '3 Flats (B♭, E♭, A♭)',
    scaleDegrees: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  },
  {
    id: 'E',
    name: 'E Major',
    shortName: 'E',
    rootNote: 'E',
    semitones: 4,
    relativeMinor: 'C♯ minor',
    keySignature: '4 Sharps (F♯, C♯, G♯, D♯)',
    scaleDegrees: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  },
  {
    id: 'F',
    name: 'F Major',
    shortName: 'F',
    rootNote: 'F',
    semitones: 5,
    relativeMinor: 'D minor',
    keySignature: '1 Flat (B♭)',
    scaleDegrees: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  },
  {
    id: 'Fs',
    name: 'F♯ / G♭ Major',
    shortName: 'F♯',
    rootNote: 'F#',
    semitones: 6,
    relativeMinor: 'D♯ minor',
    keySignature: '6 Sharps (F♯, C♯, G♯, D♯, A♯, E♯)',
    scaleDegrees: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  },
  {
    id: 'G',
    name: 'G Major',
    shortName: 'G',
    rootNote: 'G',
    semitones: 7,
    relativeMinor: 'E minor',
    keySignature: '1 Sharp (F♯)',
    scaleDegrees: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  },
  {
    id: 'Ab',
    name: 'A♭ Major',
    shortName: 'A♭',
    rootNote: 'Ab',
    semitones: 8,
    relativeMinor: 'F minor',
    keySignature: '4 Flats (B♭, E♭, A♭, D♭)',
    scaleDegrees: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  },
  {
    id: 'A',
    name: 'A Major',
    shortName: 'A',
    rootNote: 'A',
    semitones: 9,
    relativeMinor: 'F♯ minor',
    keySignature: '3 Sharps (F♯, C♯, G♯)',
    scaleDegrees: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  },
  {
    id: 'Bb',
    name: 'B♭ Major',
    shortName: 'B♭',
    rootNote: 'Bb',
    semitones: 10,
    relativeMinor: 'G minor',
    keySignature: '2 Flats (B♭, E♭)',
    scaleDegrees: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  },
  {
    id: 'B',
    name: 'B Major',
    shortName: 'B',
    rootNote: 'B',
    semitones: 11,
    relativeMinor: 'G♯ minor',
    keySignature: '5 Sharps (F♯, C♯, G♯, D♯, A♯)',
    scaleDegrees: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  },
];

// Note spelling tables for chromatic pitches (semitones 0 to 11 from C)
const SHARP_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTE_NAMES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Key-aware note name resolver
function getNoteName(pitchClass: number, key: MusicalKey): string {
  const norm = ((pitchClass % 12) + 12) % 12;
  const isFlatKey = ['F', 'Bb', 'Eb', 'Ab', 'Db'].includes(key.id);
  return isFlatKey ? FLAT_NOTE_NAMES[norm] : SHARP_NOTE_NAMES[norm];
}

// Convert midi number (e.g. 60 -> C4)
function midiToPitchString(midi: number, key: MusicalKey): string {
  const pitchClass = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = getNoteName(pitchClass, key);
  return `${name}${octave}`;
}

// Formula intervals in semitones
const QUALITY_INTERVALS: Record<ProgressionTemplateChord['quality'], number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  dom9: [0, 4, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  add9: [0, 4, 7, 14],
  min6: [0, 3, 7, 9],
  dim7: [0, 3, 6, 9],
  II_over_I: [0, 2, 6, 9], // Bass at 0, Triad of II (2, 6, 9)
  iv_over_I: [0, 5, 8, 12], // Bass at 0, Minor triad of iv (5, 8, 12)
  I_over_3: [4, 7, 12], // 1st inversion tonic (3 in bass)
};

// Compute transposed chord object with full inversion metadata
export function transposeChord(
  template: ProgressionTemplateChord,
  key: MusicalKey
): TransposedChord {
  const rootPitchClass = (key.semitones + template.semitoneOffset) % 12;
  const rootName = getNoteName(rootPitchClass, key);

  let chordDisplayName = rootName;
  let symbolSuffix = '';

  switch (template.quality) {
    case 'maj':
      symbolSuffix = '';
      break;
    case 'min':
      symbolSuffix = 'm';
      break;
    case 'maj7':
      symbolSuffix = 'maj7';
      break;
    case 'min7':
      symbolSuffix = 'm7';
      break;
    case 'dom7':
      symbolSuffix = '7';
      break;
    case 'dom9':
      symbolSuffix = '9';
      break;
    case 'maj9':
      symbolSuffix = 'maj9';
      break;
    case 'min9':
      symbolSuffix = 'm9';
      break;
    case 'add9':
      symbolSuffix = 'add9';
      break;
    case 'min6':
      symbolSuffix = 'm6';
      break;
    case 'dim7':
      symbolSuffix = '°7';
      break;
    case 'II_over_I':
      chordDisplayName = `${getNoteName((key.semitones + 2) % 12, key)}/${getNoteName(key.semitones, key)}`;
      break;
    case 'iv_over_I':
      chordDisplayName = `${getNoteName((key.semitones + 5) % 12, key)}m/${getNoteName(key.semitones, key)}`;
      break;
    case 'I_over_3':
      chordDisplayName = `${getNoteName(key.semitones, key)}/${getNoteName((key.semitones + 4) % 12, key)}`;
      break;
  }

  if (!['II_over_I', 'iv_over_I', 'I_over_3'].includes(template.quality)) {
    chordDisplayName = `${rootName}${symbolSuffix}`;
  }

  // Determine active inversion
  let invType: 'root' | 'first' | 'second' | 'third' | 'slash' = template.inversion || 'root';
  if (template.quality === 'I_over_3') invType = 'first';
  if (['II_over_I', 'iv_over_I'].includes(template.quality)) invType = 'slash';

  // Base interval selection with inversion offsets
  let baseIntervals = [...QUALITY_INTERVALS[template.quality]];
  if (invType === 'first' && template.quality !== 'I_over_3') {
    // 3rd in bass: shift root up octave
    const third = baseIntervals[1];
    const fifth = baseIntervals[2];
    const rootUpper = baseIntervals[0] + 12;
    baseIntervals = [third, fifth, rootUpper];
  } else if (invType === 'second') {
    // 5th in bass: shift root and 3rd up octave
    const fifth = baseIntervals[2];
    const rootUpper = baseIntervals[0] + 12;
    const thirdUpper = baseIntervals[1] + 12;
    baseIntervals = [fifth, rootUpper, thirdUpper];
  }

  const baseMidiRoot = 60 + ((key.semitones + template.semitoneOffset) % 12); // Octave 4 base

  const notes: string[] = baseIntervals.map((interval, i) => {
    let noteMidi = baseMidiRoot + interval;
    if (template.quality === 'II_over_I' && i === 0) {
      noteMidi = 60 + (key.semitones % 12);
    }
    if (template.quality === 'iv_over_I' && i === 0) {
      noteMidi = 60 + (key.semitones % 12);
    }
    if (template.quality === 'I_over_3' && i === 0) {
      noteMidi = 60 + ((key.semitones + 4) % 12);
    }

    // Keep comfortably in C4 (60) to C6 (84)
    while (noteMidi > 84) noteMidi -= 12;
    while (noteMidi < 60) noteMidi += 12;

    return midiToPitchString(noteMidi, key);
  });

  // Calculate figured bass and inversion labels
  let inversionName = 'Root Position';
  let figuredBass = '5/3';
  let inversionFormula = '1 - 3 - 5';
  let bassRole = 'Root (1)';
  let inversionDescription = 'Solid acoustic foundation with root tone in the bass.';

  if (invType === 'first') {
    inversionName = '1st Inversion';
    figuredBass = template.quality.includes('7') ? '6/5' : '6';
    inversionFormula = '3 - 5 - 1';
    bassRole = template.quality.startsWith('min') ? 'Minor 3rd (♭3)' : 'Major 3rd (3)';
    inversionDescription = 'Lyrical, singing voicing with the 3rd in the bass. Creates smooth stepwise voice leading.';
  } else if (invType === 'second') {
    inversionName = '2nd Inversion';
    figuredBass = template.quality.includes('7') ? '4/3' : '6/4';
    inversionFormula = '5 - 1 - 3';
    bassRole = 'Perfect 5th (5)';
    inversionDescription = 'Dramatic, suspended voicing with the 5th in the bass. Creates forward momentum.';
  } else if (invType === 'third') {
    inversionName = '3rd Inversion';
    figuredBass = '4/2';
    inversionFormula = '7 - 1 - 3 - 5';
    bassRole = '7th';
    inversionDescription = 'High tension dominant color with 7th in the bass stepping downward.';
  } else if (invType === 'slash') {
    inversionName = 'Pedal Bass Voicing';
    figuredBass = 'Pedal';
    inversionFormula = 'Bass + Triad';
    bassRole = 'Tonic Pedal (1)';
    inversionDescription = 'Upper harmony shifts over a stationary low pedal point.';
  }

  const bassPitch = notes[0] || `${rootName}4`;

  return {
    name: chordDisplayName,
    symbol: `${chordDisplayName} (${template.roman})`,
    roman: template.roman,
    notes,
    root: rootName,
    bassNote: bassPitch,
    bassRole,
    inversionType: invType,
    inversionName,
    figuredBass,
    inversionFormula,
    inversionDescription,
    voiceLeadingReason:
      template.voiceLeadingReason ||
      `Voice-led in ${key.name} with ${inversionName} (${figuredBass}) for optimal smooth keyboard comping.`,
    formula: template.formula,
    vibe: template.vibe,
    description: `Voiced in ${key.name} (${inversionName}) with harmonic role ${template.roman}.`,
  };
}

// Full Library of 16 Chord Progressions from Basic to Intermediate to Advanced
export const PROGRESSION_TEMPLATES: ProgressionDefinition[] = [
  // =========================================================================
  // 1. BASIC / FOUNDATIONAL (5 Progressions - Free)
  // =========================================================================
  {
    id: 'prog-basic-1',
    title: 'The Classic Pop & Folk Cadence',
    level: 'basic',
    isPro: false,
    genre: 'Pop, Classical, Folk Anthem',
    romanFormula: 'I - IV - V - I',
    description: 'The definitive pillar of Western harmony. Departure, dominant tension, and ultimate resolution.',
    voiceLeadingTip: 'Smooth voice leading: let the 4th degree in IV step down to the 3rd upon resolution to I.',
    theoryInsight: 'Tonic (I) -> Subdominant (IV) -> Dominant (V) -> Tonic (I). Used by Mozart, Bob Dylan, and The Beatles.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', inversion: 'root', formula: '1 - 3 - 5', vibe: 'Home, pure stability', voiceLeadingReason: 'Root position tonic establishes tonal reference home.' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', inversion: 'second', formula: '1 - 3 - 5', vibe: 'Open, hopeful departure', voiceLeadingReason: '2nd Inversion (6/4) keeps common tonic note in bass while 3rd & 5th step upward.' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', inversion: 'first', formula: '1 - 3 - 5', vibe: 'Bright magnetic tension', voiceLeadingReason: '1st Inversion (6) places leading tone in bass, stepping directly into tonic.' },
      { roman: 'I', semitoneOffset: 0, quality: 'maj', inversion: 'root', formula: '1 - 3 - 5', vibe: 'Full resolution & peace', voiceLeadingReason: 'Authentic cadence resolves back into home root position.' },
    ],
  },
  {
    id: 'prog-basic-2',
    title: 'The 50s Doo-Wop Nostalgia Loop',
    level: 'basic',
    isPro: false,
    genre: 'Doo-Wop, Rock & Roll, Pop Ballads',
    romanFormula: 'I - vi - IV - V',
    description: 'Endlessly circular chord cycle that defined the golden age of 50s rock and contemporary ballads.',
    voiceLeadingTip: 'The step from I to vi shares two common tones; keep your hand relaxed and anchor the common notes.',
    theoryInsight: 'Featured in "Stand by Me", "Earth Angel", "Unchained Melody", and Ed Sheeran\'s "Perfect".',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', inversion: 'root', formula: '1 - 3 - 5', vibe: 'Warm baseline', voiceLeadingReason: 'Root position establishes peaceful foundation.' },
      { roman: 'vi', semitoneOffset: 9, quality: 'min', inversion: 'root', formula: '1 - b3 - 5', vibe: 'Nostalgic sweetness', voiceLeadingReason: 'Relative minor shares two common tones with tonic.' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', inversion: 'second', formula: '1 - 3 - 5', vibe: 'Rising emotion', voiceLeadingReason: '2nd Inversion provides smooth stepwise voice movement.' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', inversion: 'first', formula: '1 - 3 - 5', vibe: 'Pulling back home', voiceLeadingReason: '1st Inversion leading tone in bass guides loop back to I.' },
    ],
  },
  {
    id: 'prog-basic-3',
    title: 'The Emotional Modern Anthem',
    level: 'basic',
    isPro: false,
    genre: 'Modern Pop, Indie, Cinema',
    romanFormula: 'vi - IV - I - V',
    description: 'Starts in minor for emotional vulnerability, then elevates with IV and I into heroic resolution.',
    voiceLeadingTip: 'Emphasize the minor 3rd on the opening chord for dramatic acoustic depth.',
    theoryInsight: 'The signature sequence of Passenger ("Let Her Go"), Adele, and Imagine Dragons.',
    chords: [
      { roman: 'vi', semitoneOffset: 9, quality: 'min', inversion: 'root', formula: '1 - b3 - 5', vibe: 'Vulnerable, bittersweet', voiceLeadingReason: 'Root position minor chord creates emotional grounding.' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', inversion: 'first', formula: '1 - 3 - 5', vibe: 'Hopeful longing', voiceLeadingReason: '1st Inversion 3rd in bass adds sweet melodic warmth.' },
      { roman: 'I', semitoneOffset: 0, quality: 'maj', inversion: 'root', formula: '1 - 3 - 5', vibe: 'Triumphant release', voiceLeadingReason: 'Root position arrival brings clarity and peace.' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', inversion: 'second', formula: '1 - 3 - 5', vibe: 'Driving forward momentum', voiceLeadingReason: '2nd Inversion suspended dominant propels loop smoothly.' },
    ],
  },
  {
    id: 'prog-basic-4',
    title: "Pachelbel's Classical Canon",
    level: 'basic',
    isPro: false,
    genre: 'Baroque, Classical, Acoustic Pop',
    romanFormula: 'I - V - vi - iii - IV - I - IV - V',
    description: 'The immortal descending bass sequence written in 1680. Powers weddings, graduations, and pop anthems.',
    voiceLeadingTip: 'Follow the descending bass line closely: 1 -> 5 -> 6 -> 3 -> 4 -> 1.',
    theoryInsight: 'Heard in Maroon 5 ("Memories"), Green Day ("Basket Case"), and Pachelbel\'s Canon in D.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Majestic opening' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Step down' },
      { roman: 'vi', semitoneOffset: 9, quality: 'min', formula: '1 - b3 - 5', vibe: 'Reflective warmth' },
      { roman: 'iii', semitoneOffset: 4, quality: 'min', formula: '1 - b3 - 5', vibe: 'Introspective' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Rising subdominant' },
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Home return' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Final departure' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Culminating turnaround' },
    ],
  },
  {
    id: 'prog-basic-5',
    title: 'The Sentimental 4-Chord Axis',
    level: 'basic',
    isPro: false,
    genre: 'Contemporary Pop, Country, Rock',
    romanFormula: 'I - V - vi - IV',
    description: 'The ubiquitous modern progression popularized by the "Axis of Awesome". Uplifting and anthemic.',
    voiceLeadingTip: 'Keep the tonic note ringing as an upper pedal point across all 4 chords for instant cohesion.',
    theoryInsight: 'Featured in "Don\'t Stop Believin\'", "Someone Like You", and "Let It Be".',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Bright start' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Expansive lift' },
      { roman: 'vi', semitoneOffset: 9, quality: 'min', formula: '1 - b3 - 5', vibe: 'Heartfelt turn' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Satisfying launchpad' },
    ],
  },

  // =========================================================================
  // 2. INTERMEDIATE (5 Progressions - Free)
  // =========================================================================
  {
    id: 'prog-inter-1',
    title: 'The Definitive Jazz Turnaround (ii-V-I)',
    level: 'intermediate',
    isPro: false,
    genre: 'Jazz Standards, Bossa Nova, Lo-Fi',
    romanFormula: 'ii7 - V7 - Imaj7',
    description: 'The undisputed monarch of jazz harmony. Creates effortless voice leading between guide tones.',
    voiceLeadingTip: 'Watch the 7th of ii7 resolve downward by half-step directly to the 3rd of V7.',
    theoryInsight: 'The core formula behind 80% of the Great American Songbook and Bill Evans compositions.',
    chords: [
      { roman: 'ii7', semitoneOffset: 2, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Velvety pre-dominant' },
      { roman: 'V7', semitoneOffset: 7, quality: 'dom7', formula: '1 - 3 - 5 - b7', vibe: 'Magnetic tritone pull' },
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Dreamy resolution' },
    ],
  },
  {
    id: 'prog-inter-2',
    title: 'Velvet R&B / Neo-Soul Cascade',
    level: 'intermediate',
    isPro: false,
    genre: 'Neo-Soul, Contemporary R&B, Lo-Fi Hip Hop',
    romanFormula: 'Imaj7 - iii7 - vi7 - IVmaj7',
    description: 'Luxurious descending cascade of seventh chords with creamy emotional warmth and rich color.',
    voiceLeadingTip: 'Drop the root to your left hand and play compact 3rd-5th-7th triads in the right.',
    theoryInsight: 'Popularized by Stevie Wonder, Erykah Badu, D\'Angelo, and Tom Misch.',
    chords: [
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Lush elegance' },
      { roman: 'iii7', semitoneOffset: 4, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Silky descent' },
      { roman: 'vi7', semitoneOffset: 9, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Soulful groove' },
      { roman: 'IVmaj7', semitoneOffset: 5, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Warm suspension' },
    ],
  },
  {
    id: 'prog-inter-3',
    title: 'Stadium Pop Shimmer & 9th Extensions',
    level: 'intermediate',
    isPro: false,
    genre: 'Coldplay, Adele, Stadium Pop',
    romanFormula: 'I - V - vi7 - IVadd9',
    description: 'Elevated contemporary soundscape with crystalline upper pedal tones and open 9th extensions.',
    voiceLeadingTip: 'Let the 9th on the IVadd9 ring out on the highest register for maximum acoustic sparkle.',
    theoryInsight: 'Adds modern cinematic sheen without overwhelming the diatonic ear.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Clear foundation' },
      { roman: 'V', semitoneOffset: 7, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Resonant dominant' },
      { roman: 'vi7', semitoneOffset: 9, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Deepened minor' },
      { roman: 'IVadd9', semitoneOffset: 5, quality: 'add9', formula: '1 - 3 - 5 - 9', vibe: 'Crystalline sparkle' },
    ],
  },
  {
    id: 'prog-inter-4',
    title: 'Secondary Dominant Emotional Catapult',
    level: 'intermediate',
    isPro: false,
    genre: 'Radiohead, Billy Joel, Broadway Musical',
    romanFormula: 'I - V7/vi - vi - IV',
    description: 'Introduces a chromatic tension outside the parent scale that catapults straight into minor.',
    voiceLeadingTip: 'The major 3rd of V7/vi is a chromatic leading tone; lean into its tension before resolving.',
    theoryInsight: 'In C Major, E7 provides the G# leading tone that magnetic pulls into A Minor.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Initial rest' },
      { roman: 'V7/vi', semitoneOffset: 4, quality: 'dom7', formula: '1 - 3 - 5 - b7', vibe: 'Surprise chromatic pull' },
      { roman: 'vi', semitoneOffset: 9, quality: 'min', formula: '1 - b3 - 5', vibe: 'Emotional landing' },
      { roman: 'IV', semitoneOffset: 5, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Releasing warmth' },
    ],
  },
  {
    id: 'prog-inter-5',
    title: 'The Andalusian / Flamenco Minor Descent',
    level: 'intermediate',
    isPro: false,
    genre: 'Flamenco, Latin Jazz, Epic Cinema',
    romanFormula: 'i - bVII - bVI - V',
    description: 'Ancient Phrygian descending tetrachord bassline. Radiates dramatic Mediterranean tension.',
    voiceLeadingTip: 'The final chord is a major dominant V, creating the exotic Phrygian half-step resolution.',
    theoryInsight: 'Heard in Dire Straits ("Sultans of Swing"), Ray Charles ("Hit the Road Jack"), and flamenco.',
    chords: [
      { roman: 'i (vi)', semitoneOffset: 9, quality: 'min', formula: '1 - b3 - 5', vibe: 'Brooding minor tonic' },
      { roman: 'bVII (V)', semitoneOffset: 7, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Descending step' },
      { roman: 'bVI (IV)', semitoneOffset: 5, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Deepening shadow' },
      { roman: 'V (III)', semitoneOffset: 4, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Fiery major dominant' },
    ],
  },

  // =========================================================================
  // 3. ADVANCED PRO (6 Progressions - 🔒 GATED FOR SUBSCRIPTION)
  // =========================================================================
  {
    id: 'prog-adv-1',
    title: 'Bill Evans Chromatic Tritone Substitution',
    level: 'advanced',
    isPro: true,
    genre: 'Modern Bebop, Post-Bop, Film Noir',
    romanFormula: 'ii7 - bII9 - Imaj9',
    description: 'The pinnacle of chromatic voice leading. Replacing V7 with bII9 produces a half-step bass descent.',
    voiceLeadingTip: 'Notice the descending chromatic bassline: Scale degree 2 -> b2 -> 1 with rich guide tones.',
    theoryInsight: 'bII7 and V7 share the exact same tritone interval, enabling seamless harmonic substitution.',
    chords: [
      { roman: 'ii7', semitoneOffset: 2, quality: 'min9', formula: '1 - b3 - 5 - b7 - 9', vibe: 'Rootless jazz cool' },
      { roman: 'bII9', semitoneOffset: 1, quality: 'dom9', formula: '1 - 3 - 5 - b7 - 9', vibe: 'Sultry tritone slide' },
      { roman: 'Imaj9', semitoneOffset: 0, quality: 'maj9', formula: '1 - 3 - 5 - 7 - 9', vibe: 'Luminous landing' },
    ],
  },
  {
    id: 'prog-adv-2',
    title: 'The Beatles "In My Life" Minor Plagal Cadence',
    level: 'advanced',
    isPro: true,
    genre: 'Romantic Ballad, Classic Rock, Sophisticated Pop',
    romanFormula: 'I - Imaj7 - iv6 - I',
    description: 'Borrowed from the parallel minor mode. The minor 6th chord creates an unforgettable weeping resolution.',
    voiceLeadingTip: 'The minor 6th degree resolves downward by half step directly into the 5th of the tonic.',
    theoryInsight: 'The signature secret weapon of The Beatles ("In My Life", "Across the Universe") and Chopin.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Nostalgic beginning' },
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Gentle opening 7th' },
      { roman: 'iv6', semitoneOffset: 5, quality: 'min6', formula: '1 - b3 - 5 - 6', vibe: 'Heartbreaking minor iv' },
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Tender release' },
    ],
  },
  {
    id: 'prog-adv-3',
    title: 'The Backdoor Soul Dominant Resolution',
    level: 'advanced',
    isPro: true,
    genre: 'Soul, Gospel, Stevie Wonder, Bebop',
    romanFormula: 'Imaj7 - iv7 - bVII9 - Imaj7',
    description: 'Approaching the tonic from a whole-step below (bVII9 -> Imaj7) via modal interchange from Aeolian.',
    voiceLeadingTip: 'Keep the tonic note ringing as an anchor in the soprano melody across both chords.',
    theoryInsight: 'Used everywhere in Stevie Wonder classics ("Sir Duke", "Knocks Me Off My Feet") and Wayne Shorter.',
    chords: [
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Velvety soul opener' },
      { roman: 'iv7', semitoneOffset: 5, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Subdominant shadow' },
      { roman: 'bVII9', semitoneOffset: 10, quality: 'dom9', formula: '1 - 3 - 5 - b7 - 9', vibe: 'Backdoor dominant lift' },
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Heroic resolution' },
    ],
  },
  {
    id: 'prog-adv-4',
    title: 'Coltrane Changes / Giant Steps Multi-Tonic Matrix',
    level: 'advanced',
    isPro: true,
    genre: 'Modern Jazz, Hard Bop, Advanced Theory',
    romanFormula: 'Imaj7 - V7/bVI - bVImaj7 - V7/III - IIImaj7',
    description: 'John Coltrane\'s revolutionary cycle through 3 major tonal centers spaced by major thirds.',
    voiceLeadingTip: 'Divides the 12-tone octave into three equilateral augmented poles: I -> bVI -> III.',
    theoryInsight: 'Revolutionized jazz harmony in 1960. Required unprecedented agility over distant key centers.',
    chords: [
      { roman: 'Imaj7', semitoneOffset: 0, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'First tonal center' },
      { roman: 'V7/bVI', semitoneOffset: 3, quality: 'dom7', formula: '1 - 3 - 5 - b7', vibe: 'Pivot dominant 7' },
      { roman: 'bVImaj7', semitoneOffset: 8, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Second tonal center' },
      { roman: 'V7/III', semitoneOffset: 11, quality: 'dom7', formula: '1 - 3 - 5 - b7', vibe: 'Pivot dominant 7' },
      { roman: 'IIImaj7', semitoneOffset: 4, quality: 'maj7', formula: '1 - 3 - 5 - 7', vibe: 'Third tonal center' },
    ],
  },
  {
    id: 'prog-adv-5',
    title: 'Hans Zimmer Interstellar Polychord Odyssey',
    level: 'advanced',
    isPro: true,
    genre: 'Cinematic Film Score, Sci-Fi Mystery',
    romanFormula: 'I - II/I - iv/I - I',
    description: 'Hypnotic tonic pedal bass anchoring shifting modal triads (Lydian II and Minor Plagal iv).',
    voiceLeadingTip: 'Keep the low root locked in the left hand while the right hand moves freely between upper triads.',
    theoryInsight: 'The Hans Zimmer and John Williams hallmark for creating interstellar wonder and suspense.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Planetary baseline' },
      { roman: 'II/I', semitoneOffset: 0, quality: 'II_over_I', formula: '1 (Bass) + 2 - #4 - 6', vibe: 'Lydian celestial awe' },
      { roman: 'iv/I', semitoneOffset: 0, quality: 'iv_over_I', formula: '1 (Bass) + 4 - b6 - 1', vibe: 'Intense cosmic suspense' },
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Restoration of gravity' },
    ],
  },
  {
    id: 'prog-adv-6',
    title: 'Gospel Stepping Chromatic Diminished Walkup',
    level: 'advanced',
    isPro: true,
    genre: 'Contemporary Black Gospel, Neo-Soul, Church Piano',
    romanFormula: 'I - #I°7 - ii7 - #ii°7 - I/3',
    description: 'Traditional church keyboard walkup using diminished 7ths as stepping stones into 1st inversion tonic.',
    voiceLeadingTip: 'The bass walks chromatically upward: 1 -> #1 -> 2 -> #2 -> 3 with sparkling top voicing.',
    theoryInsight: 'Standard vernacular across gospel, soul, and jazz for turning simple cadences into moving statements.',
    chords: [
      { roman: 'I', semitoneOffset: 0, quality: 'maj', formula: '1 - 3 - 5', vibe: 'Praise foundation' },
      { roman: '#I°7', semitoneOffset: 1, quality: 'dim7', formula: '1 - b3 - b5 - bb7', vibe: 'Chromatic step up' },
      { roman: 'ii7', semitoneOffset: 2, quality: 'min7', formula: '1 - b3 - 5 - b7', vibe: 'Diatonic bridge' },
      { roman: '#ii°7', semitoneOffset: 3, quality: 'dim7', formula: '1 - b3 - b5 - bb7', vibe: 'Tension crescendo' },
      { roman: 'I/3', semitoneOffset: 0, quality: 'I_over_3', formula: '3 (Bass) - 5 - 1', vibe: 'Triumphant arrival' },
    ],
  },
];

// Master function: get all progressions transposed into the active key
export function getTransposedProgressions(key: MusicalKey): ResolvedProgression[] {
  return PROGRESSION_TEMPLATES.map((template) => ({
    id: template.id,
    title: template.title,
    level: template.level,
    isPro: template.isPro,
    genre: template.genre,
    romanFormula: template.romanFormula,
    description: template.description,
    voiceLeadingTip: template.voiceLeadingTip,
    theoryInsight: template.theoryInsight,
    chords: template.chords.map((ch) => transposeChord(ch, key)),
  }));
}
