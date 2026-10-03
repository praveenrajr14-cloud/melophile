// Musical helper functions for chord inversions and piano visualization
import { TriadItem } from '../components/chords/FullTriadsList';

export type InversionType = 'root' | 'first' | 'second';

export interface InversionDetail {
  type: InversionType;
  label: string;
  shortLabel: string;
  figuredBass: string;
  formula: string;
  notes: string[];
  bassNote: string;
  bassRole: string;
  description: string;
  rhFingering: string;
  voiceLeadingTip: string;
}

const NOTE_TO_SEMITONE: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
  'A#': 10, 'Bb': 10, 'B': 11
};

export const normalizePitch = (pitch: string): string => {
  return pitch
    .replace('Db', 'C#')
    .replace('Eb', 'D#')
    .replace('Gb', 'F#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#');
};

export function noteToMidi(noteStr: string): number {
  const m = noteStr.match(/^([A-G][b#]?)([3-6])$/);
  if (!m) throw new Error('Invalid note: ' + noteStr);
  const name = m[1];
  const oct = parseInt(m[2], 10);
  return (oct + 1) * 12 + NOTE_TO_SEMITONE[name];
}

export function midiToNote(midi: number, preferredSpelling?: string[]): string {
  const oct = Math.floor(midi / 12) - 1;
  const semi = midi % 12;
  const sharpNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  if (preferredSpelling) {
    for (const name of preferredSpelling) {
      if (NOTE_TO_SEMITONE[name] === semi) {
        return `${name}${oct}`;
      }
    }
  }
  return `${sharpNames[semi]}${oct}`;
}

export function getChordInversions(triad: TriadItem): Record<InversionType, InversionDetail> {
  const rootMidi = noteToMidi(triad.notes[0]);
  const thirdMidi = noteToMidi(triad.notes[1]);
  const fifthMidi = noteToMidi(triad.notes[2]);

  const noteNames = triad.notes.map(n => n.replace(/[0-9]/g, ''));
  const rootChar = noteNames[0];
  const thirdChar = noteNames[1];
  const fifthChar = noteNames[2];

  // 1) Root position: Root - Third - Fifth
  const rootNotes = [triad.notes[0], triad.notes[1], triad.notes[2]];

  // 2) 1st Inversion: Third - Fifth - Root (Root shifted up octave)
  let inv1Midis = [thirdMidi, fifthMidi, rootMidi + 12];
  if (inv1Midis[2] > 84 || (inv1Midis[0] - 12 >= 60)) {
    if (inv1Midis[0] - 12 >= 60) {
      inv1Midis = [inv1Midis[0] - 12, inv1Midis[1] - 12, inv1Midis[2] - 12];
    }
  }
  const inv1Notes = [
    midiToNote(inv1Midis[0], [thirdChar]),
    midiToNote(inv1Midis[1], [fifthChar]),
    midiToNote(inv1Midis[2], [rootChar])
  ];

  // 3) 2nd Inversion: Fifth - Root - Third (Fifth in bass)
  let inv2Midis = [fifthMidi, rootMidi + 12, thirdMidi + 12];
  if (inv2Midis[2] > 84 || (inv2Midis[0] - 12 >= 60)) {
    if (inv2Midis[0] - 12 >= 60) {
      inv2Midis = [inv2Midis[0] - 12, inv2Midis[1] - 12, inv2Midis[2] - 12];
    }
  }
  const inv2Notes = [
    midiToNote(inv2Midis[0], [fifthChar]),
    midiToNote(inv2Midis[1], [rootChar]),
    midiToNote(inv2Midis[2], [thirdChar])
  ];

  const isMajor = triad.quality === 'Major';

  return {
    root: {
      type: 'root',
      label: 'Root Position',
      shortLabel: 'Root',
      figuredBass: '5/3',
      formula: isMajor ? '1 - 3 - 5' : '1 - ♭3 - 5',
      notes: rootNotes,
      bassNote: rootChar,
      bassRole: 'Root',
      description: 'Solid acoustic foundation with root tone in the bass. Standard reference position.',
      rhFingering: '1 - 3 - 5 (Thumb - Middle - Pinky)',
      voiceLeadingTip: 'Keep hand relaxed and knuckles curved. Foundation of cadence arrivals.'
    },
    first: {
      type: 'first',
      label: '1st Inversion',
      shortLabel: '1st Inv',
      figuredBass: '6',
      formula: isMajor ? '3 - 5 - 1' : '♭3 - 5 - 1',
      notes: inv1Notes,
      bassNote: thirdChar,
      bassRole: isMajor ? 'Major 3rd' : 'Minor 3rd',
      description: 'Lyrical and warm voicing with the 3rd in the bass. Excellent for smooth stepwise basslines.',
      rhFingering: '1 - 2 - 5 (Thumb - Index - Pinky)',
      voiceLeadingTip: 'Notice the wider interval between the 5th and the upper Root. Use finger 2 on the 5th.'
    },
    second: {
      type: 'second',
      label: '2nd Inversion',
      shortLabel: '2nd Inv',
      figuredBass: '6/4',
      formula: isMajor ? '5 - 1 - 3' : '5 - 1 - ♭3',
      notes: inv2Notes,
      bassNote: fifthChar,
      bassRole: 'Perfect 5th',
      description: 'Suspended and dramatic voicing with the 5th in the bass. Often used in Cadential 6/4 formulas.',
      rhFingering: '1 - 3 - 5 (or 1 - 2 - 4)',
      voiceLeadingTip: 'The 4th interval is at the bottom (5 to 1) and the 3rd at the top. Creates forward momentum.'
    }
  };
}

// Exact Piano Keyboard geometry (2 octaves: C4 to C6)
export interface PianoKeyData {
  note: string;
  isBlack: boolean;
  x: number;
  width: number;
  height: number;
  aliases: string[];
}

export const PIANO_KEYS_C4_TO_C6: PianoKeyData[] = [
  // 15 White Keys (width = 32, height = 120)
  { note: 'C4', isBlack: false, x: 0, width: 32, height: 120, aliases: ['C4'] },
  { note: 'D4', isBlack: false, x: 32, width: 32, height: 120, aliases: ['D4'] },
  { note: 'E4', isBlack: false, x: 64, width: 32, height: 120, aliases: ['E4'] },
  { note: 'F4', isBlack: false, x: 96, width: 32, height: 120, aliases: ['F4'] },
  { note: 'G4', isBlack: false, x: 128, width: 32, height: 120, aliases: ['G4'] },
  { note: 'A4', isBlack: false, x: 160, width: 32, height: 120, aliases: ['A4'] },
  { note: 'B4', isBlack: false, x: 192, width: 32, height: 120, aliases: ['B4'] },
  { note: 'C5', isBlack: false, x: 224, width: 32, height: 120, aliases: ['C5'] },
  { note: 'D5', isBlack: false, x: 256, width: 32, height: 120, aliases: ['D5'] },
  { note: 'E5', isBlack: false, x: 288, width: 32, height: 120, aliases: ['E5'] },
  { note: 'F5', isBlack: false, x: 320, width: 32, height: 120, aliases: ['F5'] },
  { note: 'G5', isBlack: false, x: 352, width: 32, height: 120, aliases: ['G5'] },
  { note: 'A5', isBlack: false, x: 384, width: 32, height: 120, aliases: ['A5'] },
  { note: 'B5', isBlack: false, x: 416, width: 32, height: 120, aliases: ['B5'] },
  { note: 'C6', isBlack: false, x: 448, width: 32, height: 120, aliases: ['C6'] },

  // 10 Black Keys (width = 19, height = 74, centered on key boundaries)
  // C#4 between C4 (0..32) and D4 (32..64) -> border at 32 -> x = 22.5
  { note: 'C#4', isBlack: true, x: 22.5, width: 19, height: 74, aliases: ['C#4', 'Db4'] },
  // D#4 between D4 (32..64) and E4 (64..96) -> border at 64 -> x = 54.5
  { note: 'D#4', isBlack: true, x: 54.5, width: 19, height: 74, aliases: ['D#4', 'Eb4'] },
  // F#4 between F4 (96..128) and G4 (128..160) -> border at 128 -> x = 118.5
  { note: 'F#4', isBlack: true, x: 118.5, width: 19, height: 74, aliases: ['F#4', 'Gb4'] },
  // G#4 between G4 (128..160) and A4 (160..192) -> border at 160 -> x = 150.5
  { note: 'G#4', isBlack: true, x: 150.5, width: 19, height: 74, aliases: ['G#4', 'Ab4'] },
  // A#4 between A4 (160..192) and B4 (192..224) -> border at 192 -> x = 182.5
  { note: 'A#4', isBlack: true, x: 182.5, width: 19, height: 74, aliases: ['A#4', 'Bb4'] },

  // C#5 between C5 (224..256) and D5 (256..288) -> border at 256 -> x = 246.5
  { note: 'C#5', isBlack: true, x: 246.5, width: 19, height: 74, aliases: ['C#5', 'Db5'] },
  // D#5 between D5 (256..288) and E5 (288..320) -> border at 288 -> x = 278.5
  { note: 'D#5', isBlack: true, x: 278.5, width: 19, height: 74, aliases: ['D#5', 'Eb5'] },
  // F#5 between F5 (320..352) and G5 (352..384) -> border at 352 -> x = 342.5
  { note: 'F#5', isBlack: true, x: 342.5, width: 19, height: 74, aliases: ['F#5', 'Gb5'] },
  // G#5 between G5 (352..384) and A5 (384..416) -> border at 384 -> x = 374.5
  { note: 'G#5', isBlack: true, x: 374.5, width: 19, height: 74, aliases: ['G#5', 'Ab5'] },
  // A#5 between A5 (384..416) and B5 (416..448) -> border at 416 -> x = 406.5
  { note: 'A#5', isBlack: true, x: 406.5, width: 19, height: 74, aliases: ['A#5', 'Bb5'] },
];

export const getPitchClass = (noteStr: string): string => {
  return normalizePitch(noteStr).replace(/[0-9]/g, '');
};

export function getKeyRole(
  keyData: PianoKeyData,
  activeNotes: string[],
  triad: TriadItem
): { isActive: boolean; roleLabel: string; noteDisplay: string } {
  const normKey = normalizePitch(keyData.note);
  const matchingActive = activeNotes.find(n => normalizePitch(n) === normKey);

  if (!matchingActive) {
    return { isActive: false, roleLabel: '', noteDisplay: keyData.note.replace(/[0-9]/g, '') };
  }

  // Determine harmonic role using pitch class (octave-independent)
  const keyClass = getPitchClass(keyData.note);
  const rootClass = getPitchClass(triad.notes[0]);
  const thirdClass = getPitchClass(triad.notes[1]);
  const fifthClass = getPitchClass(triad.notes[2]);

  let roleLabel = '';
  if (keyClass === rootClass) roleLabel = 'R';
  else if (keyClass === thirdClass) roleLabel = '3';
  else if (keyClass === fifthClass) roleLabel = '5';

  return {
    isActive: true,
    roleLabel,
    noteDisplay: matchingActive.replace(/[0-9]/g, '')
  };
}
