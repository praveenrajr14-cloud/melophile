/**
 * Melophile Music Academy — AI Chord Transposer & 3-Level Reharmonization Engine
 *
 * Capabilities:
 * 1. Parses song sheets with Chords-Over-Lyrics, Inline [Chord] Lyrics, or Chord Charts
 * 2. Automatically detects the original musical key via diatonic & cadence weighting
 * 3. Instant chromatic transposition across all 12 keys with proper enharmonic spelling (# vs b)
 * 4. 3-Level AI Harmonic Reharmonization:
 *    - Level 1 (Basic): Pure Major/Minor Triads & beginner-friendly voicings
 *    - Level 2 (Intermediate): Expressive Maj7, m7, add9, sus4 & smooth slash-chord basslines
 *    - Level 3 (Pro): Jazz/Neo-Soul 9ths, 11ths, 13ths, Altered Dominants (7b9, 7#9), Lydian #11 & Modal Interchange
 * 5. Converts any parsed chord symbol into playable Web Audio synthesizer notes (C3–C6)
 */

export type ReharmonizeLevel = 'basic' | 'intermediate' | 'pro';

export const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const KEY_OPTIONS = [
  { index: 0, label: 'C', preferFlats: false },
  { index: 1, label: 'Db / C#', preferFlats: true },
  { index: 2, label: 'D', preferFlats: false },
  { index: 3, label: 'Eb', preferFlats: true },
  { index: 4, label: 'E', preferFlats: false },
  { index: 5, label: 'F', preferFlats: true },
  { index: 6, label: 'F# / Gb', preferFlats: false },
  { index: 7, label: 'G', preferFlats: false },
  { index: 8, label: 'Ab', preferFlats: true },
  { index: 9, label: 'A', preferFlats: false },
  { index: 10, label: 'Bb', preferFlats: true },
  { index: 11, label: 'B', preferFlats: false },
];

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  'E#': 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

export interface ParsedChord {
  original: string;
  root: string;
  rootIndex: number;
  quality: string; // e.g., '', 'm', '7', 'maj7', 'm7', 'sus4', 'dim', 'aug', 'add9', 'm9', 'maj9', '13', etc.
  bass?: string;
  bassIndex?: number;
}

export type InversionType = 'root' | 'first' | 'second';

export interface ChordInversionDetail {
  type: InversionType;
  inversionName: string; // 'Root Position' | '1st Inversion' | '2nd Inversion'
  shortLabel: string; // 'Root (5/3)' | '1st Inv (6)' | '2nd Inv (6/4)'
  figuredBass: string; // '5/3' | '6' | '6/4' | '6/5' | '4/3'
  formula: string; // '1 - 3 - 5' | '3 - 5 - 1' | '5 - 1 - 3'
  bassNote: string; // e.g. 'C4'
  bassRole: string; // e.g. 'Root (1) in Bass'
  notes: string[];
  midiNotes: number[];
}

export interface SmoothChordVoicing {
  symbol: string;
  notes: string[]; // Default smooth voice-leading notes
  roman: string;
  activeInversion: ChordInversionDetail;
  smoothReason: string;
  inversions: {
    root: ChordInversionDetail;
    first: ChordInversionDetail;
    second: ChordInversionDetail;
  };
}

export interface ReharmonizationInsight {
  fromChord: string;
  toChord: string;
  romanFunction: string;
  reason: string;
  notes: string[];
  inversionName?: string;
  figuredBass?: string;
}

export interface TransposedSongResult {
  detectedKeyIndex: number;
  detectedKeyName: string;
  targetKeyIndex: number;
  targetKeyName: string;
  semitoneShift: number;
  level: ReharmonizeLevel;
  transposedText: string;
  uniqueChords: SmoothChordVoicing[];
  songSequence: SmoothChordVoicing[];
  aiInsights: ReharmonizationInsight[];
}

/**
 * Regex to match a valid standalone musical chord token
 */
const CHORD_TOKEN_REGEX =
  /^([A-G][#b]?)(maj13|maj11|maj9|maj7|M7|min11|min9|min7|min6|min|m11|m9|m7b5|m7|m6|mMaj7|m|dim7|dim|o7|o|aug7|aug|\+|sus2|sus4|sus|7sus4|9sus4|13sus4|add9|add11|add2|6\/9|6|7b9|7#9|7#11|7b5|7#5|7alt|7|9|11|13|5|2)?(\/[A-G][#b]?)?$/;

/**
 * Parse a single token to check if it is a valid chord
 */
export function parseChordToken(token: string): ParsedChord | null {
  const clean = token.trim();
  if (!clean) return null;
  const match = clean.match(CHORD_TOKEN_REGEX);
  if (!match) return null;

  const root = match[1];
  const quality = match[2] || '';
  const slashPart = match[3] || '';

  const rootIndex = NOTE_TO_SEMITONE[root];
  if (rootIndex === undefined) return null;

  let bass: string | undefined;
  let bassIndex: number | undefined;
  if (slashPart.startsWith('/')) {
    bass = slashPart.slice(1);
    bassIndex = NOTE_TO_SEMITONE[bass];
  }

  return {
    original: clean,
    root,
    rootIndex,
    quality,
    bass,
    bassIndex,
  };
}

/**
 * Determine if a line in a song sheet is a "chord line" (chords over lyrics)
 */
export function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Section headers like [Chorus], [Verse 1], [Bridge] are not chord lines
  if (/^\[(verse|chorus|bridge|intro|outro|pre-chorus|interlude|solo|hook|tag|inst)/i.test(trimmed)) {
    return false;
  }

  // Split by whitespace and barlines
  const tokens = trimmed
    .replace(/\|/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return false;

  let chordCount = 0;
  for (const t of tokens) {
    // Strip parentheses or brackets if someone wrote (G) or [C]
    const stripped = t.replace(/^[([（]+|[)\]）]+$/g, '');
    if (parseChordToken(stripped)) {
      chordCount++;
    } else if (/^(x\d+|\d+x|N\.C\.|-|\/|\|)$/i.test(stripped)) {
      // Repeat markers or bar dividers
      continue;
    } else {
      // Notice: single letter "A" or "I" or "Am" in a normal sentence:
      // If a line has multiple non-chord words, it's a lyric line.
    }
  }

  // If at least 65% of tokens are valid chords, and non-chord words aren't normal sentences
  const ratio = chordCount / tokens.length;
  if (tokens.length === 1) {
    // A single word "A" or "Am" could be a chord if uppercase, check if it's a chord
    return chordCount === 1;
  }
  return chordCount >= 1 && ratio >= 0.65;
}

/**
 * Format a pitch class index (0-11) into note name using sharps or flats
 */
export function formatPitchClass(index: number, preferFlats: boolean): string {
  const norm = ((index % 12) + 12) % 12;
  return preferFlats ? CHROMATIC_FLATS[norm] : CHROMATIC_SHARPS[norm];
}

/**
 * Detect the most likely Major key (0-11) from all chords in the text
 */
export function detectKeyFromText(text: string): { keyIndex: number; keyName: string } {
  const extractedChords: ParsedChord[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // Check inline bracketed chords like [Am] or [G/B]
    const bracketMatches = line.matchAll(/\[([A-G][#b]?[^\]]*)\]/g);
    for (const m of bracketMatches) {
      const parsed = parseChordToken(m[1]);
      if (parsed) extractedChords.push(parsed);
    }

    if (isChordLine(line)) {
      const tokens = line.replace(/\|/g, ' ').split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        const stripped = t.replace(/^[([（]+|[)\]）]+$/g, '');
        const parsed = parseChordToken(stripped);
        if (parsed) extractedChords.push(parsed);
      }
    }
  }

  if (extractedChords.length === 0) {
    return { keyIndex: 0, keyName: 'C' };
  }

  // Score each of the 12 Major keys based on diatonic fit + first/last chord tonic weight
  let bestKey = 0;
  let bestScore = -1;

  for (let candidateKey = 0; candidateKey < 12; candidateKey++) {
    let score = 0;
    const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
    const minorQualities = ['m', 'min', 'm7', 'm9', 'm11', 'min7'];

    extractedChords.forEach((chord, idx) => {
      const rel = ((chord.rootIndex - candidateKey) % 12 + 12) % 12;
      const isMinor = minorQualities.includes(chord.quality);

      // Diatonic match weights
      if (rel === 0 && !isMinor) score += 4; // I
      else if (rel === 5 && !isMinor) score += 3; // IV
      else if (rel === 7 && !isMinor) score += 3.5; // V
      else if (rel === 9 && isMinor) score += 3.5; // vi (relative minor)
      else if (rel === 2 && isMinor) score += 2.5; // ii
      else if (rel === 4 && isMinor) score += 2; // iii
      else if (majorIntervals.includes(rel)) score += 1;

      // Extra weight for first and last chord in song
      if (idx === 0) {
        if (rel === 0 && !isMinor) score += 5;
        if (rel === 9 && isMinor) score += 4.5; // Song in relative minor
      }
      if (idx === extractedChords.length - 1) {
        if (rel === 0 && !isMinor) score += 4;
        if (rel === 9 && isMinor) score += 3.5;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestKey = candidateKey;
    }
  }

  const preferFlats = KEY_OPTIONS[bestKey]?.preferFlats ?? false;
  return {
    keyIndex: bestKey,
    keyName: formatPitchClass(bestKey, preferFlats),
  };
}

/**
 * Determine the Roman Numeral label of a chord relative to the target key
 */
export function getRomanNumeral(
  rootIndex: number,
  quality: string,
  targetKeyIndex: number
): string {
  const interval = ((rootIndex - targetKeyIndex) % 12 + 12) % 12;
  const isMinor = /^m(?!aj)/i.test(quality) || quality.startsWith('min');
  const isDim = quality.startsWith('dim') || quality.startsWith('o') || quality === 'm7b5';

  const baseRomans: Record<number, string> = {
    0: 'I',
    1: 'bII',
    2: 'II',
    3: 'bIII',
    4: 'III',
    5: 'IV',
    6: '#IV',
    7: 'V',
    8: 'bVI',
    9: 'VI',
    10: 'bVII',
    11: 'VII',
  };

  let roman = baseRomans[interval] || 'I';
  if (isMinor) roman = roman.toLowerCase();
  if (isDim) roman = roman.toLowerCase() + '°';

  const ext = quality.replace(/^(m(?!aj)|min|dim|o)/, '');
  return `${roman}${ext}`;
}

/**
 * AI 3-Level Harmonic Reharmonizer
 * Transforms a transposed chord based on the selected complexity tier (Basic, Intermediate, Pro)
 * and its harmonic function in the target key.
 */
export function reharmonizeChord(
  transposedRootIndex: number,
  originalQuality: string,
  transposedBassIndex: number | undefined,
  targetKeyIndex: number,
  level: ReharmonizeLevel,
  preferFlats: boolean,
  chordOccurrenceIndex: number
): {
  symbol: string;
  quality: string;
  bassIndex?: number;
  reason?: string;
} {
  const rootName = formatPitchClass(transposedRootIndex, preferFlats);
  const relInterval = ((transposedRootIndex - targetKeyIndex) % 12 + 12) % 12;

  const isMinor = /^m(?!aj)/i.test(originalQuality) || originalQuality.startsWith('min');
  const isDim = originalQuality.startsWith('dim') || originalQuality === 'm7b5';
  const isAug = originalQuality.startsWith('aug') || originalQuality === '+';
  const isDominant7 = originalQuality === '7' || originalQuality === '9' || originalQuality === '13';

  // LEVEL 1: BASIC (Clean, beginner-friendly foundational triads)
  if (level === 'basic') {
    let basicQuality = '';
    if (isDim) basicQuality = 'dim';
    else if (isAug) basicQuality = 'aug';
    else if (isMinor) basicQuality = 'm';
    else basicQuality = '';

    const symbol = `${rootName}${basicQuality}`;
    const reason =
      originalQuality !== basicQuality
        ? `Simplified ${rootName}${originalQuality} → ${symbol} (Pure triad for clean beginner placement)`
        : `Foundational ${isMinor ? 'Minor' : 'Major'} triad (1 - ${isMinor ? 'b3' : '3'} - 5)`;

    return {
      symbol,
      quality: basicQuality,
      bassIndex: undefined,
      reason,
    };
  }

  // LEVEL 2: INTERMEDIATE (Lush 7ths, add9, sus4, and smooth 1st-inversion slash chords)
  if (level === 'intermediate') {
    let interQuality = originalQuality;
    let newBassIndex = transposedBassIndex;
    let reason = '';

    if (isDim) {
      interQuality = 'm7b5';
      reason = 'Upgraded diminished triad to half-diminished (m7b5) for smoother voice leading';
    } else if (isMinor) {
      if (relInterval === 9) {
        // vi chord
        interQuality = 'm7';
        reason = 'Added minor 7th (vi7) for warm contemporary ballad resonance';
      } else if (relInterval === 2) {
        // ii chord
        interQuality = 'm7';
        reason = 'Upgraded pre-dominant ii to ii7 for smooth subdominant motion';
      } else if (relInterval === 4) {
        // iii chord
        interQuality = 'm7';
        reason = 'Enriched mediant minor chord to iii7';
      } else {
        interQuality = 'm7';
        reason = 'Added expressive minor 7th interval';
      }
    } else {
      // Major family
      if (relInterval === 0) {
        // I Tonic
        interQuality = chordOccurrenceIndex % 2 === 0 ? 'maj7' : 'add9';
        reason =
          interQuality === 'maj7'
            ? 'Tonic Imaj7 adds dreamy, open studio warmth'
            : 'Tonic Iadd9 adds modern acoustic sparkle';
      } else if (relInterval === 5) {
        // IV Subdominant
        interQuality = 'maj7';
        reason = 'Subdominant IVmaj7 creates a lush, floating harmonic cushion';
      } else if (relInterval === 7) {
        // V Dominant
        if (chordOccurrenceIndex % 2 === 1 && newBassIndex === undefined) {
          // Put 3rd in the bass (V/7 -> e.g. G/B in C)
          newBassIndex = (transposedRootIndex + 4) % 12;
          interQuality = '';
          reason = '1st Inversion Slash Chord (3rd in bass) creates a step-wise melodic bassline';
        } else {
          interQuality = '7sus4';
          reason = 'Suspended dominant (7sus4) adds modern tension before resolution';
        }
      } else {
        interQuality = isDominant7 ? '7' : 'add9';
        reason = 'Enhanced triad with color tone extension';
      }
    }

    const bassStr =
      newBassIndex !== undefined ? `/${formatPitchClass(newBassIndex, preferFlats)}` : '';
    return {
      symbol: `${rootName}${interQuality}${bassStr}`,
      quality: interQuality,
      bassIndex: newBassIndex,
      reason,
    };
  }

  // LEVEL 3: PRO (Masterclass Jazz / Neo-Soul / Film Score Reharmonization)
  let proQuality = originalQuality;
  let proBassIndex = transposedBassIndex;
  let proReason = '';

  if (isDim || relInterval === 11) {
    proQuality = 'm7b5';
    proReason = 'Half-diminished rootless-ready voicing (1 - b3 - b5 - b7)';
  } else if (isMinor) {
    if (relInterval === 9) {
      // vi -> vi9 or vi11
      proQuality = chordOccurrenceIndex % 2 === 0 ? 'm9' : 'm11';
      proReason =
        proQuality === 'm9'
          ? 'Neo-Soul minor 9th (vi9) stacks a Major triad over the minor 3rd'
          : 'Modern Gospel/Jazz minor 11th (vi11) with Quartal inner harmony';
    } else if (relInterval === 2) {
      // ii -> ii9
      proQuality = 'm9';
      proReason = 'Jazz ii9 voicing (Root + 3rd + 7th + 9th) for silky ii–V–I voice leading';
    } else if (relInterval === 4) {
      // iii -> III7b9 (Secondary dominant V/vi) or iii7
      if (chordOccurrenceIndex % 2 === 1) {
        proQuality = '7b9';
        proReason = 'Secondary Dominant (V7b9/vi) — injects dramatic gospel/jazz pull toward the vi chord';
      } else {
        proQuality = 'm9';
        proReason = 'Lush mediant minor 9th extension';
      }
    } else {
      proQuality = 'm9';
      proReason = 'Extended minor 9th concert voicing';
    }
  } else {
    // Major / Dominant chords in Pro Mode
    if (relInterval === 0) {
      // I -> Imaj9
      proQuality = 'maj9';
      proReason = 'Concert Imaj9 (1 - 3 - 5 - 7 - 9) — signature Bill Evans / Film Score tonic voicing';
    } else if (relInterval === 5) {
      // IV -> IVmaj9 or IVmaj7#11 (Lydian) or ivm6 (Modal Interchange)
      if (chordOccurrenceIndex % 3 === 2) {
        proQuality = 'm6';
        proReason = 'Modal Interchange (ivm6 borrowed from parallel minor) for nostalgic cinematic cadence';
      } else {
        proQuality = 'maj9';
        proReason = 'Lydian-inflected Subdominant IVmaj9 for expansive harmonic depth';
      }
    } else if (relInterval === 7) {
      // V -> V13 or V7alt
      proQuality = chordOccurrenceIndex % 2 === 0 ? '13' : '7b9';
      proReason =
        proQuality === '13'
          ? ' Lush Dominant 13th (V13) — blends dominant tritone with soulful 6th/13th melody tone'
          : 'Altered Dominant (V7b9) — high-tension harmonic gravity resolving to tonic';
    } else if (relInterval === 2 && !isMinor) {
      // Secondary dominant II7 -> II9
      proQuality = '9';
      proReason = 'Secondary Dominant (V9/V) brightening the pre-dominant transition';
    } else {
      proQuality = 'maj9';
      proReason = 'Extended 5-voice harmonic structure';
    }
  }

  const proBassStr =
    proBassIndex !== undefined ? `/${formatPitchClass(proBassIndex, preferFlats)}` : '';

  return {
    symbol: `${rootName}${proQuality}${proBassStr}`,
    quality: proQuality,
    bassIndex: proBassIndex,
    reason: proReason,
  };
}

/**
 * Helper: get core intervals for a chord quality
 */
function getQualityIntervals(q: string): number[] {
  let intervals = [0, 4, 7]; // Default Major triad
  if (q === 'm' || q === 'min') intervals = [0, 3, 7];
  else if (q === 'dim' || q === 'o') intervals = [0, 3, 6];
  else if (q === 'dim7' || q === 'o7') intervals = [0, 3, 6, 9];
  else if (q === 'aug' || q === '+') intervals = [0, 4, 8];
  else if (q === 'sus2' || q === '2') intervals = [0, 2, 7];
  else if (q === 'sus4' || q === 'sus') intervals = [0, 5, 7];
  else if (q === '7sus4') intervals = [0, 5, 7, 10];
  else if (q === 'maj7' || q === 'M7') intervals = [0, 4, 7, 11];
  else if (q === 'm7' || q === 'min7') intervals = [0, 3, 7, 10];
  else if (q === 'm7b5') intervals = [0, 3, 6, 10];
  else if (q === '7') intervals = [0, 4, 7, 10];
  else if (q === '6') intervals = [0, 4, 7, 9];
  else if (q === 'm6' || q === 'min6') intervals = [0, 3, 7, 9];
  else if (q === 'add9' || q === 'add2') intervals = [0, 4, 7, 14];
  else if (q === 'maj9') intervals = [0, 4, 7, 11, 14];
  else if (q === 'm9' || q === 'min9') intervals = [0, 3, 7, 10, 14];
  else if (q === '9') intervals = [0, 4, 7, 10, 14];
  else if (q === 'm11' || q === 'min11') intervals = [0, 3, 7, 10, 14, 17];
  else if (q === '11') intervals = [0, 4, 7, 10, 14, 17];
  else if (q === '13' || q === 'maj13') intervals = [0, 4, 7, 10, 14, 21];
  else if (q === '7b9') intervals = [0, 4, 7, 10, 13];
  else if (q === '7#9') intervals = [0, 4, 7, 10, 15];
  return intervals;
}

function midiToNoteStr(midi: number, preferFlats = false): string {
  const pitchIdx = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = preferFlats ? CHROMATIC_FLATS[pitchIdx] : CHROMATIC_SHARPS[pitchIdx];
  return `${name}${octave}`;
}

/**
 * Compute all 3 core inversions (Root Position, 1st Inversion, 2nd Inversion) for any chord symbol
 * in the warm middle piano register (C4–B5) with strict ascending pitch order.
 */
export function getChordInversions(
  symbol: string,
  preferFlats = false
): {
  root: ChordInversionDetail;
  first: ChordInversionDetail;
  second: ChordInversionDetail;
} {
  const parsed = parseChordToken(symbol);
  const rootIndex = parsed ? parsed.rootIndex : 0;
  const q = parsed ? parsed.quality : '';
  const isMinor = /^m(?!aj)/i.test(q) || q.startsWith('min');
  const hasSeventh = /7|9|11|13/.test(q);
  const coreIntervals = getQualityIntervals(q);
  const baseMidiRoot = 60 + rootIndex; // C4..B4

  const buildInversion = (invType: InversionType): ChordInversionDetail => {
    let invIntervals = [...coreIntervals];
    if (invType === 'first') {
      const rootUp = coreIntervals[0] + 12;
      invIntervals = [...coreIntervals.slice(1), rootUp].sort((a, b) => a - b);
    } else if (invType === 'second') {
      const rootUp = coreIntervals[0] + 12;
      const thirdUp = coreIntervals[1] + 12;
      invIntervals = [...coreIntervals.slice(2), rootUp, thirdUp].sort((a, b) => a - b);
    }

    let rawMidis = invIntervals.map((semi) => baseMidiRoot + semi);

    // Shift entire chord down 1 octave as a cohesive unit if lowest note >= C5 (72)
    // or if top note exceeds C6 (84) while lowest note >= A4 (69)
    if (rawMidis[0] >= 72 || (rawMidis[rawMidis.length - 1] > 84 && rawMidis[0] >= 69)) {
      rawMidis = rawMidis.map((m) => m - 12);
    }

    const notes = rawMidis.map((m) => midiToNoteStr(m, preferFlats));
    const bassNote = notes[0] || 'C4';

    if (invType === 'first') {
      return {
        type: 'first',
        inversionName: '1st Inversion',
        shortLabel: hasSeventh ? '1st Inv (6/5)' : '1st Inv (6)',
        figuredBass: hasSeventh ? '6/5' : '6',
        formula: isMinor ? '♭3 - 5 - 1' : '3 - 5 - 1',
        bassNote,
        bassRole: isMinor ? 'Minor 3rd (♭3) in Bass' : 'Major 3rd (3) in Bass',
        notes,
        midiNotes: rawMidis,
      };
    }

    if (invType === 'second') {
      return {
        type: 'second',
        inversionName: '2nd Inversion',
        shortLabel: hasSeventh ? '2nd Inv (4/3)' : '2nd Inv (6/4)',
        figuredBass: hasSeventh ? '4/3' : '6/4',
        formula: isMinor ? '5 - 1 - ♭3' : '5 - 1 - 3',
        bassNote,
        bassRole: 'Perfect 5th (5) in Bass',
        notes,
        midiNotes: rawMidis,
      };
    }

    return {
      type: 'root',
      inversionName: 'Root Position',
      shortLabel: hasSeventh ? 'Root (7)' : 'Root (5/3)',
      figuredBass: hasSeventh ? '7' : '5/3',
      formula: isMinor ? '1 - ♭3 - 5' : '1 - 3 - 5',
      bassNote,
      bassRole: 'Root Tone (1) in Bass',
      notes,
      midiNotes: rawMidis,
    };
  };

  return {
    root: buildInversion('root'),
    first: buildInversion('first'),
    second: buildInversion('second'),
  };
}

/**
 * Compute the optimal Smooth Voice-Leading Voicing for a chord in the target key
 * Minimizes hand jump from the tonic center and retains common tones.
 */
export function buildSmoothChordVoicing(
  symbol: string,
  roman: string,
  targetKeyIndex: number,
  preferFlats = false
): SmoothChordVoicing {
  const parsed = parseChordToken(symbol);
  const rootIndex = parsed ? parsed.rootIndex : targetKeyIndex;
  const relInterval = ((rootIndex - targetKeyIndex) % 12 + 12) % 12;
  const inversions = getChordInversions(symbol, preferFlats);
  const tonicName = formatPitchClass(targetKeyIndex, preferFlats);

  let selectedType: InversionType = 'root';
  let smoothReason = `Root Position (5/3) anchors the ${tonicName} tonic hand position with solid acoustic grounding.`;

  // Check if explicit slash bass specifies an inversion
  if (parsed && parsed.bassIndex !== undefined) {
    const bassDiff = ((parsed.bassIndex - rootIndex) % 12 + 12) % 12;
    if (bassDiff === 3 || bassDiff === 4) {
      selectedType = 'first';
      smoothReason = `1st Inversion (${inversions.first.figuredBass}) places the 3rd (${inversions.first.bassNote}) in the bass for a smooth stepwise bassline.`;
    } else if (bassDiff === 7 || bassDiff === 6) {
      selectedType = 'second';
      smoothReason = `2nd Inversion (${inversions.second.figuredBass}) places the 5th (${inversions.second.bassNote}) in the bass as a smooth pedal anchor.`;
    }
  } else if (relInterval === 5) {
    // IV Subdominant -> 2nd Inversion (6/4) keeps the Tonic (1) as a common tone in the bass!
    selectedType = 'second';
    smoothReason = `2nd Inversion (${inversions.second.figuredBass}) keeps ${inversions.second.bassNote} anchored as a shared common tone with ${tonicName} — zero hand jump!`;
  } else if (relInterval === 9) {
    // vi Submediant -> 1st Inversion (6) keeps 1 and 3 in the exact same finger position!
    selectedType = 'first';
    smoothReason = `1st Inversion (${inversions.first.figuredBass}) shares two common tones (${inversions.first.notes[0]} & ${inversions.first.notes[1]}) with ${tonicName} — only one finger moves!`;
  } else if (relInterval === 7) {
    // V Dominant -> 1st Inversion (6) or 2nd Inversion (6/4) depending on closest center of gravity to tonic
    const tonicCenter = 60 + targetKeyIndex + 3.6;
    const firstCenter =
      inversions.first.midiNotes.reduce((a, b) => a + b, 0) / inversions.first.midiNotes.length;
    const secondCenter =
      inversions.second.midiNotes.reduce((a, b) => a + b, 0) / inversions.second.midiNotes.length;

    if (Math.abs(firstCenter - tonicCenter) <= Math.abs(secondCenter - tonicCenter) + 1.5) {
      selectedType = 'first';
      smoothReason = `1st Inversion (${inversions.first.figuredBass}) places the leading tone (${inversions.first.bassNote}) in the bass, resolving smoothly by 1 semitone into ${tonicName}.`;
    } else {
      selectedType = 'second';
      smoothReason = `2nd Inversion (${inversions.second.figuredBass}) retains the dominant common tone in the middle register for a seamless cadence.`;
    }
  } else if (relInterval === 2) {
    // ii Supertonic -> 1st Inversion (6) puts the Subdominant (4) in the bass
    selectedType = 'first';
    smoothReason = `1st Inversion (${inversions.first.figuredBass}) places ${inversions.first.bassNote} in the bass for silky pre-dominant ii6 → V → I voice-leading.`;
  } else if (relInterval === 4) {
    // iii Mediant -> 2nd Inversion (6/4) or 1st Inversion (6)
    selectedType = 'second';
    smoothReason = `2nd Inversion (${inversions.second.figuredBass}) shares upper common tones with ${tonicName} for effortless inner-voice motion.`;
  } else if (relInterval !== 0) {
    // Any other borrowed/chromatic chord: choose the inversion with minimal average MIDI distance from Tonic triad
    const tonicCenter = 60 + targetKeyIndex + 3.6;
    const candidates: InversionType[] = ['root', 'first', 'second'];
    let bestDist = Infinity;
    for (const c of candidates) {
      const avg =
        inversions[c].midiNotes.reduce((a, b) => a + b, 0) / inversions[c].midiNotes.length;
      const dist = Math.abs(avg - tonicCenter);
      if (dist < bestDist) {
        bestDist = dist;
        selectedType = c;
      }
    }
    smoothReason = `${inversions[selectedType].inversionName} (${inversions[selectedType].figuredBass}) keeps all voices in the warm middle register with minimal hand movement.`;
  }

  const activeInversion = inversions[selectedType];

  return {
    symbol,
    notes: activeInversion.notes,
    roman,
    activeInversion,
    smoothReason,
    inversions,
  };
}

/**
 * Convert any chord symbol (e.g. "Cmaj9", "F#m7b5", "G/B") into playable Web Audio notes (C4-B5)
 */
export function chordSymbolToNotes(symbol: string): string[] {
  const parsed = parseChordToken(symbol);
  if (!parsed) return ['C4', 'E4', 'G4'];
  const inversions = getChordInversions(symbol, false);
  if (parsed.bassIndex !== undefined) {
    const bassDiff = ((parsed.bassIndex - parsed.rootIndex) % 12 + 12) % 12;
    if (bassDiff === 3 || bassDiff === 4) return inversions.first.notes;
    if (bassDiff === 7 || bassDiff === 6) return inversions.second.notes;
  }
  return inversions.root.notes;
}

/**
 * Main Engine: Transpose & Reharmonize an entire song sheet (lyrics + chords)
 * Preserves exact lyric column alignment for Chords-Over-Lyrics and Inline [Chord] sheets.
 */
export function transposeAndReharmonizeSong(
  inputText: string,
  targetKeyIndex: number | null,
  level: ReharmonizeLevel,
  forceEnharmonic?: 'sharp' | 'flat' | 'auto'
): TransposedSongResult {
  const detected = detectKeyFromText(inputText);
  const actualTargetKey = targetKeyIndex !== null ? ((targetKeyIndex % 12) + 12) % 12 : detected.keyIndex;
  const semitoneShift = ((actualTargetKey - detected.keyIndex) % 12 + 12) % 12;

  const defaultPreferFlats = KEY_OPTIONS[actualTargetKey]?.preferFlats ?? false;
  const preferFlats =
    forceEnharmonic === 'flat'
      ? true
      : forceEnharmonic === 'sharp'
      ? false
      : defaultPreferFlats;

  const targetKeyName = formatPitchClass(actualTargetKey, preferFlats);

  const uniqueChordMap = new Map<string, SmoothChordVoicing>();
  const songSequence: SmoothChordVoicing[] = [];
  const insightsMap = new Map<string, ReharmonizationInsight>();
  let chordCounter = 0;

  const transformSingleChordToken = (rawToken: string): string => {
    // Preserve leading/trailing parens or brackets if present
    const prefixMatch = rawToken.match(/^[([（]+/);
    const suffixMatch = rawToken.match(/[)\]）]+$/);
    const prefix = prefixMatch ? prefixMatch[0] : '';
    const suffix = suffixMatch ? suffixMatch[0] : '';
    const core = rawToken.slice(prefix.length, rawToken.length - suffix.length);

    const parsed = parseChordToken(core);
    if (!parsed) return rawToken;

    const newRootIndex = ((parsed.rootIndex + semitoneShift) % 12 + 12) % 12;
    const newBassIndex =
      parsed.bassIndex !== undefined
        ? ((parsed.bassIndex + semitoneShift) % 12 + 12) % 12
        : undefined;

    // Pure transposed symbol before AI reharmonization
    const pureTransposedRoot = formatPitchClass(newRootIndex, preferFlats);
    const pureTransposedBass =
      newBassIndex !== undefined ? `/${formatPitchClass(newBassIndex, preferFlats)}` : '';
    const pureTransposedSymbol = `${pureTransposedRoot}${parsed.quality}${pureTransposedBass}`;

    // Run 3-Level AI Harmonic Reharmonizer
    const reharm = reharmonizeChord(
      newRootIndex,
      parsed.quality,
      newBassIndex,
      actualTargetKey,
      level,
      preferFlats,
      chordCounter++
    );

    const finalSymbol = reharm.symbol;
    const roman = getRomanNumeral(newRootIndex, reharm.quality, actualTargetKey);
    const smoothVoicing = buildSmoothChordVoicing(finalSymbol, roman, actualTargetKey, preferFlats);

    songSequence.push(smoothVoicing);

    if (!uniqueChordMap.has(finalSymbol)) {
      uniqueChordMap.set(finalSymbol, smoothVoicing);
    }

    if (reharm.reason && !insightsMap.has(`${pureTransposedSymbol}->${finalSymbol}`)) {
      insightsMap.set(`${pureTransposedSymbol}->${finalSymbol}`, {
        fromChord: pureTransposedSymbol,
        toChord: finalSymbol,
        romanFunction: roman,
        reason: reharm.reason,
        notes: smoothVoicing.notes,
        inversionName: smoothVoicing.activeInversion.inversionName,
        figuredBass: smoothVoicing.activeInversion.figuredBass,
      });
    }

    return `${prefix}${finalSymbol}${suffix}`;
  };

  // Process line by line
  const lines = inputText.split('\n');
  const outputLines = lines.map((line) => {
    // 1. Replace inline bracketed chords like [C] or [G/B] (excluding section headers like [Chorus])
    let processedLine = line.replace(/\[([A-G][#b]?[^\]]*)\]/g, (fullMatch, inner) => {
      if (parseChordToken(inner)) {
        return `[${transformSingleChordToken(inner)}]`;
      }
      return fullMatch;
    });

    // 2. If the line is a Chord-Over-Lyric line, replace each chord token while preserving spacing
    if (isChordLine(processedLine)) {
      processedLine = processedLine.replace(/(\S+)/g, (token) => {
        if (token === '|' || token === '/' || token === '-') return token;
        return transformSingleChordToken(token);
      });
    }

    return processedLine;
  });

  return {
    detectedKeyIndex: detected.keyIndex,
    detectedKeyName: detected.keyName,
    targetKeyIndex: actualTargetKey,
    targetKeyName,
    semitoneShift,
    level,
    transposedText: outputLines.join('\n'),
    uniqueChords: Array.from(uniqueChordMap.values()),
    songSequence,
    aiInsights: Array.from(insightsMap.values()),
  };
}

/**
 * Sample Songs with Lyrics & Chords for Instant 1-Click Demo
 */
export const SAMPLE_SONGS = [
  {
    id: 'amazing-grace',
    title: 'Amazing Grace (Hymn / Gospel Standard)',
    defaultKey: 'C',
    sheet: `[Verse 1]
C             F          C
Amazing grace how sweet the sound
C                    G
That saved a wretch like me
C              F         Am
I once was lost, but now am found
F         G        C
Was blind, but now I see

[Verse 2]
C                  F          C
'Twas grace that taught my heart to fear
C                 G
And grace my fears relieved
C                 F        Am
How precious did that grace appear
F        G       C
The hour I first believed`,
  },
  {
    id: 'acoustic-ballad',
    title: 'Golden Hour Dreams (Pop / Film Ballad)',
    defaultKey: 'G',
    sheet: `[Intro]
G    D    Em    C

[Verse]
G                    D
Soft morning light across the grand piano keys
Em                        C
Every note we played still lingers in the breeze
G                     D
Shadows fade away when harmony begins
Am             C              D
Finding home inside the melody within

[Chorus]
G                D
Hold on to the music in your soul
Em                     C
Let the cadence make the broken spirit whole
G                  B7            Em       C
Through every modulation, every minor fall
G          D          G
Love remains the finest chord of all`,
  },
  {
    id: 'soul-worship',
    title: 'River of Peace (Contemporary / Neo-Soul)',
    defaultKey: 'F',
    sheet: `[Chorus]
F                 C
Peace like a river flowing through the night
Dm                Bb
Guiding every footstep into gentle light
F                 A7              Dm      Bb
When the storm is rising and the road is long
F          C          F
Your mercy is my anchor and my song`,
  },
];
