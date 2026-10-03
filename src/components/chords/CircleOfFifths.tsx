import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioSynth';
import { Volume2, Music2, Sparkles, Play, Info, ArrowRight } from 'lucide-react';

export interface KeyDefinition {
  id: string;
  major: string;
  minor: string;
  accidentals: string;
  accidentalCount: number;
  accidentalType: 'sharp' | 'flat' | 'none';
  angle: number; // 0 is top (12 o'clock = C)
  majorNotes: string[];
  minorNotes: string[];
  scaleNotes: string[];
  diatonicChords: {
    degree: string;
    name: string;
    quality: string;
    notes: string[];
  }[];
  cadences: {
    name: string;
    roman: string;
    chords: { name: string; notes: string[] }[];
  }[];
}

export const CIRCLE_KEYS: KeyDefinition[] = [
  {
    id: 'C',
    major: 'C',
    minor: 'Am',
    accidentals: 'Natural (No ♯/♭)',
    accidentalCount: 0,
    accidentalType: 'none',
    angle: 0,
    majorNotes: ['C4', 'E4', 'G4'],
    minorNotes: ['A4', 'C5', 'E5'],
    scaleNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    diatonicChords: [
      { degree: 'I', name: 'C Major', quality: 'Major', notes: ['C4', 'E4', 'G4'] },
      { degree: 'ii', name: 'D Minor', quality: 'Minor', notes: ['D4', 'F4', 'A4'] },
      { degree: 'iii', name: 'E Minor', quality: 'Minor', notes: ['E4', 'G4', 'B4'] },
      { degree: 'IV', name: 'F Major', quality: 'Major', notes: ['F4', 'A4', 'C5'] },
      { degree: 'V', name: 'G Major', quality: 'Major', notes: ['G4', 'B4', 'D5'] },
      { degree: 'vi', name: 'A Minor', quality: 'Minor', notes: ['A4', 'C5', 'E5'] },
      { degree: 'vii°', name: 'B Diminished', quality: 'Diminished', notes: ['B4', 'D5', 'F5'] },
    ],
    cadences: [
      {
        name: 'Classical Perfect Authentic Cadence',
        roman: 'I - IV - V - I',
        chords: [
          { name: 'C', notes: ['C4', 'E4', 'G4'] },
          { name: 'F', notes: ['F4', 'A4', 'C5'] },
          { name: 'G', notes: ['G4', 'B4', 'D5'] },
          { name: 'C', notes: ['C4', 'E4', 'G4'] },
        ],
      },
      {
        name: 'Jazz ii - V - I Standard',
        roman: 'ii - V - I',
        chords: [
          { name: 'Dm', notes: ['D4', 'F4', 'A4'] },
          { name: 'G', notes: ['G4', 'B4', 'D5'] },
          { name: 'C', notes: ['C4', 'E4', 'G4'] },
        ],
      },
    ],
  },
  {
    id: 'G',
    major: 'G',
    minor: 'Em',
    accidentals: '1 Sharp (F♯)',
    accidentalCount: 1,
    accidentalType: 'sharp',
    angle: 30,
    majorNotes: ['G4', 'B4', 'D5'],
    minorNotes: ['E4', 'G4', 'B4'],
    scaleNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
    diatonicChords: [
      { degree: 'I', name: 'G Major', quality: 'Major', notes: ['G4', 'B4', 'D5'] },
      { degree: 'ii', name: 'A Minor', quality: 'Minor', notes: ['A4', 'C5', 'E5'] },
      { degree: 'iii', name: 'B Minor', quality: 'Minor', notes: ['B4', 'D#5', 'F#5'] },
      { degree: 'IV', name: 'C Major', quality: 'Major', notes: ['C4', 'E4', 'G4'] },
      { degree: 'V', name: 'D Major', quality: 'Major', notes: ['D4', 'F#4', 'A4'] },
      { degree: 'vi', name: 'E Minor', quality: 'Minor', notes: ['E4', 'G4', 'B4'] },
      { degree: 'vii°', name: 'F♯ Diminished', quality: 'Diminished', notes: ['F#4', 'A4', 'C5'] },
    ],
    cadences: [
      {
        name: 'Folk & Acoustic Resolution',
        roman: 'I - IV - V - I',
        chords: [
          { name: 'G', notes: ['G4', 'B4', 'D5'] },
          { name: 'C', notes: ['C4', 'E4', 'G4'] },
          { name: 'D', notes: ['D4', 'F#4', 'A4'] },
          { name: 'G', notes: ['G4', 'B4', 'D5'] },
        ],
      },
    ],
  },
  {
    id: 'D',
    major: 'D',
    minor: 'Bm',
    accidentals: '2 Sharps (F♯, C♯)',
    accidentalCount: 2,
    accidentalType: 'sharp',
    angle: 60,
    majorNotes: ['D4', 'F#4', 'A4'],
    minorNotes: ['B4', 'D5', 'F#5'],
    scaleNotes: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
    diatonicChords: [
      { degree: 'I', name: 'D Major', quality: 'Major', notes: ['D4', 'F#4', 'A4'] },
      { degree: 'ii', name: 'E Minor', quality: 'Minor', notes: ['E4', 'G4', 'B4'] },
      { degree: 'iii', name: 'F♯ Minor', quality: 'Minor', notes: ['F#4', 'A4', 'C#5'] },
      { degree: 'IV', name: 'G Major', quality: 'Major', notes: ['G4', 'B4', 'D5'] },
      { degree: 'V', name: 'A Major', quality: 'Major', notes: ['A4', 'C#5', 'E5'] },
      { degree: 'vi', name: 'B Minor', quality: 'Minor', notes: ['B4', 'D5', 'F#5'] },
      { degree: 'vii°', name: 'C♯ Diminished', quality: 'Diminished', notes: ['C#4', 'E4', 'G4'] },
    ],
    cadences: [
      {
        name: 'Pachelbel Canon Loop',
        roman: 'I - V - vi - iii - IV - I',
        chords: [
          { name: 'D', notes: ['D4', 'F#4', 'A4'] },
          { name: 'A', notes: ['A4', 'C#5', 'E5'] },
          { name: 'Bm', notes: ['B4', 'D5', 'F#5'] },
          { name: 'F#m', notes: ['F#4', 'A4', 'C#5'] },
          { name: 'G', notes: ['G4', 'B4', 'D5'] },
          { name: 'D', notes: ['D4', 'F#4', 'A4'] },
        ],
      },
    ],
  },
  {
    id: 'A',
    major: 'A',
    minor: 'F#m',
    accidentals: '3 Sharps (F♯, C♯, G♯)',
    accidentalCount: 3,
    accidentalType: 'sharp',
    angle: 90,
    majorNotes: ['A4', 'C#5', 'E5'],
    minorNotes: ['F#4', 'A4', 'C#5'],
    scaleNotes: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
    diatonicChords: [
      { degree: 'I', name: 'A Major', quality: 'Major', notes: ['A4', 'C#5', 'E5'] },
      { degree: 'ii', name: 'B Minor', quality: 'Minor', notes: ['B4', 'D5', 'F#5'] },
      { degree: 'iii', name: 'C♯ Minor', quality: 'Minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: 'IV', name: 'D Major', quality: 'Major', notes: ['D4', 'F#4', 'A4'] },
      { degree: 'V', name: 'E Major', quality: 'Major', notes: ['E4', 'G#4', 'B4'] },
      { degree: 'vi', name: 'F♯ Minor', quality: 'Minor', notes: ['F#4', 'A4', 'C#5'] },
      { degree: 'vii°', name: 'G♯ Diminished', quality: 'Diminished', notes: ['G#4', 'B4', 'D5'] },
    ],
    cadences: [
      {
        name: 'Stadium Rock Anthem',
        roman: 'I - V - vi - IV',
        chords: [
          { name: 'A', notes: ['A4', 'C#5', 'E5'] },
          { name: 'E', notes: ['E4', 'G#4', 'B4'] },
          { name: 'F#m', notes: ['F#4', 'A4', 'C#5'] },
          { name: 'D', notes: ['D4', 'F#4', 'A4'] },
        ],
      },
    ],
  },
  {
    id: 'E',
    major: 'E',
    minor: 'C#m',
    accidentals: '4 Sharps (F♯, C♯, G♯, D♯)',
    accidentalCount: 4,
    accidentalType: 'sharp',
    angle: 120,
    majorNotes: ['E4', 'G#4', 'B4'],
    minorNotes: ['C#4', 'E4', 'G#4'],
    scaleNotes: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
    diatonicChords: [
      { degree: 'I', name: 'E Major', quality: 'Major', notes: ['E4', 'G#4', 'B4'] },
      { degree: 'ii', name: 'F♯ Minor', quality: 'Minor', notes: ['F#4', 'A4', 'C#5'] },
      { degree: 'iii', name: 'G♯ Minor', quality: 'Minor', notes: ['G#4', 'B4', 'D#5'] },
      { degree: 'IV', name: 'A Major', quality: 'Major', notes: ['A4', 'C#5', 'E5'] },
      { degree: 'V', name: 'B Major', quality: 'Major', notes: ['B4', 'D#5', 'F#5'] },
      { degree: 'vi', name: 'C♯ Minor', quality: 'Minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: 'vii°', name: 'D♯ Diminished', quality: 'Diminished', notes: ['D#4', 'F#4', 'A4'] },
    ],
    cadences: [
      {
        name: 'Gospel & Soul Ascent',
        roman: 'I - IV - I - V',
        chords: [
          { name: 'E', notes: ['E4', 'G#4', 'B4'] },
          { name: 'A', notes: ['A4', 'C#5', 'E5'] },
          { name: 'E', notes: ['E4', 'G#4', 'B4'] },
          { name: 'B', notes: ['B4', 'D#5', 'F#5'] },
        ],
      },
    ],
  },
  {
    id: 'B',
    major: 'B',
    minor: 'G#m',
    accidentals: '5 Sharps (F♯, C♯, G♯, D♯, A♯)',
    accidentalCount: 5,
    accidentalType: 'sharp',
    angle: 150,
    majorNotes: ['B4', 'D#5', 'F#5'],
    minorNotes: ['G#4', 'B4', 'D#5'],
    scaleNotes: ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'],
    diatonicChords: [
      { degree: 'I', name: 'B Major', quality: 'Major', notes: ['B4', 'D#5', 'F#5'] },
      { degree: 'ii', name: 'C♯ Minor', quality: 'Minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: 'iii', name: 'D♯ Minor', quality: 'Minor', notes: ['D#4', 'F#4', 'A#4'] },
      { degree: 'IV', name: 'E Major', quality: 'Major', notes: ['E4', 'G#4', 'B4'] },
      { degree: 'V', name: 'F♯ Major', quality: 'Major', notes: ['F#4', 'A#4', 'C#5'] },
      { degree: 'vi', name: 'G♯ Minor', quality: 'Minor', notes: ['G#4', 'B4', 'D#5'] },
      { degree: 'vii°', name: 'A♯ Diminished', quality: 'Diminished', notes: ['A#4', 'C#5', 'E5'] },
    ],
    cadences: [
      {
        name: 'Resonant Acoustic Turn',
        roman: 'I - E - F# - B',
        chords: [
          { name: 'B', notes: ['B4', 'D#5', 'F#5'] },
          { name: 'E', notes: ['E4', 'G#4', 'B4'] },
          { name: 'F#', notes: ['F#4', 'A#4', 'C#5'] },
          { name: 'B', notes: ['B4', 'D#5', 'F#5'] },
        ],
      },
    ],
  },
  {
    id: 'Gb',
    major: 'F♯ / G♭',
    minor: 'D#m / Ebm',
    accidentals: '6 Sharps / 6 Flats',
    accidentalCount: 6,
    accidentalType: 'sharp',
    angle: 180,
    majorNotes: ['F#4', 'A#4', 'C#5'],
    minorNotes: ['D#4', 'F#4', 'A#4'],
    scaleNotes: ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'],
    diatonicChords: [
      { degree: 'I', name: 'F♯ Major', quality: 'Major', notes: ['F#4', 'A#4', 'C#5'] },
      { degree: 'ii', name: 'G♯ Minor', quality: 'Minor', notes: ['G#4', 'B4', 'D#5'] },
      { degree: 'iii', name: 'A♯ Minor', quality: 'Minor', notes: ['A#4', 'C#5', 'F5'] },
      { degree: 'IV', name: 'B Major', quality: 'Major', notes: ['B4', 'D#5', 'F#5'] },
      { degree: 'V', name: 'C♯ Major', quality: 'Major', notes: ['C#4', 'F4', 'G#4'] },
      { degree: 'vi', name: 'D♯ Minor', quality: 'Minor', notes: ['D#4', 'F#4', 'A#4'] },
      { degree: 'vii°', name: 'E♯ Diminished', quality: 'Diminished', notes: ['F4', 'G#4', 'B4'] },
    ],
    cadences: [
      {
        name: 'Impressionist Pentatonic Cycle',
        roman: 'I - vi - IV - V',
        chords: [
          { name: 'F#', notes: ['F#4', 'A#4', 'C#5'] },
          { name: 'D#m', notes: ['D#4', 'F#4', 'A#4'] },
          { name: 'B', notes: ['B4', 'D#5', 'F#5'] },
          { name: 'C#', notes: ['C#4', 'F4', 'G#4'] },
        ],
      },
    ],
  },
  {
    id: 'Db',
    major: 'D♭',
    minor: 'Bbm',
    accidentals: '5 Flats (B♭, E♭, A♭, D♭, G♭)',
    accidentalCount: 5,
    accidentalType: 'flat',
    angle: 210,
    majorNotes: ['Db4', 'F4', 'Ab4'],
    minorNotes: ['Bb4', 'Db5', 'F5'],
    scaleNotes: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'],
    diatonicChords: [
      { degree: 'I', name: 'D♭ Major', quality: 'Major', notes: ['Db4', 'F4', 'Ab4'] },
      { degree: 'ii', name: 'E♭ Minor', quality: 'Minor', notes: ['Eb4', 'Gb4', 'Bb4'] },
      { degree: 'iii', name: 'F Minor', quality: 'Minor', notes: ['F4', 'Ab4', 'C5'] },
      { degree: 'IV', name: 'G♭ Major', quality: 'Major', notes: ['Gb4', 'Bb4', 'Db5'] },
      { degree: 'V', name: 'A♭ Major', quality: 'Major', notes: ['Ab4', 'C5', 'Eb5'] },
      { degree: 'vi', name: 'B♭ Minor', quality: 'Minor', notes: ['Bb4', 'Db5', 'F5'] },
      { degree: 'vii°', name: 'C Diminished', quality: 'Diminished', notes: ['C4', 'Eb4', 'Gb4'] },
    ],
    cadences: [
      {
        name: 'Debussy Warm Nocturne',
        roman: 'I - IV - V - I',
        chords: [
          { name: 'Db', notes: ['Db4', 'F4', 'Ab4'] },
          { name: 'Gb', notes: ['Gb4', 'Bb4', 'Db5'] },
          { name: 'Ab', notes: ['Ab4', 'C5', 'Eb5'] },
          { name: 'Db', notes: ['Db4', 'F4', 'Ab4'] },
        ],
      },
    ],
  },
  {
    id: 'Ab',
    major: 'A♭',
    minor: 'Fm',
    accidentals: '4 Flats (B♭, E♭, A♭, D♭)',
    accidentalCount: 4,
    accidentalType: 'flat',
    angle: 240,
    majorNotes: ['Ab4', 'C5', 'Eb5'],
    minorNotes: ['F4', 'Ab4', 'C5'],
    scaleNotes: ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
    diatonicChords: [
      { degree: 'I', name: 'A♭ Major', quality: 'Major', notes: ['Ab4', 'C5', 'Eb5'] },
      { degree: 'ii', name: 'B♭ Minor', quality: 'Minor', notes: ['Bb4', 'Db5', 'F5'] },
      { degree: 'iii', name: 'C Minor', quality: 'Minor', notes: ['C4', 'Eb4', 'G4'] },
      { degree: 'IV', name: 'D♭ Major', quality: 'Major', notes: ['Db4', 'F4', 'Ab4'] },
      { degree: 'V', name: 'E♭ Major', quality: 'Major', notes: ['Eb4', 'G4', 'Bb4'] },
      { degree: 'vi', name: 'F Minor', quality: 'Minor', notes: ['F4', 'Ab4', 'C5'] },
      { degree: 'vii°', name: 'G Diminished', quality: 'Diminished', notes: ['G4', 'Bb4', 'Db5'] },
    ],
    cadences: [
      {
        name: 'Velvet Soul Ballad',
        roman: 'I - vi - ii - V',
        chords: [
          { name: 'Ab', notes: ['Ab4', 'C5', 'Eb5'] },
          { name: 'Fm', notes: ['F4', 'Ab4', 'C5'] },
          { name: 'Bbm', notes: ['Bb4', 'Db5', 'F5'] },
          { name: 'Eb', notes: ['Eb4', 'G4', 'Bb4'] },
        ],
      },
    ],
  },
  {
    id: 'Eb',
    major: 'E♭',
    minor: 'Cm',
    accidentals: '3 Flats (B♭, E♭, A♭)',
    accidentalCount: 3,
    accidentalType: 'flat',
    angle: 270,
    majorNotes: ['Eb4', 'G4', 'Bb4'],
    minorNotes: ['C4', 'Eb4', 'G4'],
    scaleNotes: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
    diatonicChords: [
      { degree: 'I', name: 'E♭ Major', quality: 'Major', notes: ['Eb4', 'G4', 'Bb4'] },
      { degree: 'ii', name: 'F Minor', quality: 'Minor', notes: ['F4', 'Ab4', 'C5'] },
      { degree: 'iii', name: 'G Minor', quality: 'Minor', notes: ['G4', 'Bb4', 'D5'] },
      { degree: 'IV', name: 'A♭ Major', quality: 'Major', notes: ['Ab4', 'C5', 'Eb5'] },
      { degree: 'V', name: 'B♭ Major', quality: 'Major', notes: ['Bb4', 'D5', 'F5'] },
      { degree: 'vi', name: 'C Minor', quality: 'Minor', notes: ['C4', 'Eb4', 'G4'] },
      { degree: 'vii°', name: 'D Diminished', quality: 'Diminished', notes: ['D4', 'F4', 'Ab4'] },
    ],
    cadences: [
      {
        name: 'Heroic Brass Cadence',
        roman: 'I - IV - V - I',
        chords: [
          { name: 'Eb', notes: ['Eb4', 'G4', 'Bb4'] },
          { name: 'Ab', notes: ['Ab4', 'C5', 'Eb5'] },
          { name: 'Bb', notes: ['Bb4', 'D5', 'F5'] },
          { name: 'Eb', notes: ['Eb4', 'G4', 'Bb4'] },
        ],
      },
    ],
  },
  {
    id: 'Bb',
    major: 'B♭',
    minor: 'Gm',
    accidentals: '2 Flats (B♭, E♭)',
    accidentalCount: 2,
    accidentalType: 'flat',
    angle: 300,
    majorNotes: ['Bb4', 'D5', 'F5'],
    minorNotes: ['G4', 'Bb4', 'D5'],
    scaleNotes: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
    diatonicChords: [
      { degree: 'I', name: 'B♭ Major', quality: 'Major', notes: ['Bb4', 'D5', 'F5'] },
      { degree: 'ii', name: 'C Minor', quality: 'Minor', notes: ['C4', 'Eb4', 'G4'] },
      { degree: 'iii', name: 'D Minor', quality: 'Minor', notes: ['D4', 'F4', 'A4'] },
      { degree: 'IV', name: 'E♭ Major', quality: 'Major', notes: ['Eb4', 'G4', 'Bb4'] },
      { degree: 'V', name: 'F Major', quality: 'Major', notes: ['F4', 'A4', 'C5'] },
      { degree: 'vi', name: 'G Minor', quality: 'Minor', notes: ['G4', 'Bb4', 'D5'] },
      { degree: 'vii°', name: 'A Diminished', quality: 'Diminished', notes: ['A4', 'C5', 'Eb5'] },
    ],
    cadences: [
      {
        name: 'Jazz Bebop Blues Turnaround',
        roman: 'I - vi - ii - V',
        chords: [
          { name: 'Bb', notes: ['Bb4', 'D5', 'F5'] },
          { name: 'Gm', notes: ['G4', 'Bb4', 'D5'] },
          { name: 'Cm', notes: ['C4', 'Eb4', 'G4'] },
          { name: 'F', notes: ['F4', 'A4', 'C5'] },
        ],
      },
    ],
  },
  {
    id: 'F',
    major: 'F',
    minor: 'Dm',
    accidentals: '1 Flat (B♭)',
    accidentalCount: 1,
    accidentalType: 'flat',
    angle: 330,
    majorNotes: ['F4', 'A4', 'C5'],
    minorNotes: ['D4', 'F4', 'A4'],
    scaleNotes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
    diatonicChords: [
      { degree: 'I', name: 'F Major', quality: 'Major', notes: ['F4', 'A4', 'C5'] },
      { degree: 'ii', name: 'G Minor', quality: 'Minor', notes: ['G4', 'Bb4', 'D5'] },
      { degree: 'iii', name: 'A Minor', quality: 'Minor', notes: ['A4', 'C5', 'E5'] },
      { degree: 'IV', name: 'B♭ Major', quality: 'Major', notes: ['Bb4', 'D5', 'F5'] },
      { degree: 'V', name: 'C Major', quality: 'Major', notes: ['C4', 'E4', 'G4'] },
      { degree: 'vi', name: 'D Minor', quality: 'Minor', notes: ['D4', 'F4', 'A4'] },
      { degree: 'vii°', name: 'E Diminished', quality: 'Diminished', notes: ['E4', 'G4', 'Bb4'] },
    ],
    cadences: [
      {
        name: 'Pastoral Romance Cadence',
        roman: 'I - IV - V - I',
        chords: [
          { name: 'F', notes: ['F4', 'A4', 'C5'] },
          { name: 'Bb', notes: ['Bb4', 'D5', 'F5'] },
          { name: 'C', notes: ['C4', 'E4', 'G4'] },
          { name: 'F', notes: ['F4', 'A4', 'C5'] },
        ],
      },
    ],
  },
];

interface CircleOfFifthsProps {
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
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ onSelectChord }) => {
  const [selectedKeyId, setSelectedKeyId] = useState<string>('C');
  const [hoveredKeyId, setHoveredKeyId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'major' | 'minor'>('major');

  const selectedKey = CIRCLE_KEYS.find((k) => k.id === selectedKeyId) || CIRCLE_KEYS[0];

  const handleKeyClick = (keyItem: KeyDefinition, mode: 'major' | 'minor') => {
    soundEngine.playClick(650);
    setSelectedKeyId(keyItem.id);
    setActiveMode(mode);

    const isMajor = mode === 'major';
    const notes = isMajor ? keyItem.majorNotes : keyItem.minorNotes;
    const name = isMajor ? `${keyItem.major} Major` : `${keyItem.minor} Minor`;
    const symbol = isMajor ? keyItem.major : keyItem.minor;

    soundEngine.playChord(notes, 1.8, true);

    onSelectChord({
      id: `${keyItem.id.toLowerCase()}-${mode}`,
      name,
      symbol,
      formula: isMajor ? '1 - 3 - 5' : '1 - ♭3 - 5',
      notes,
      vibe: isMajor ? `Bright, resolute, tonic center of ${keyItem.major}` : `Reflective, introspective relative minor of ${keyItem.major}`,
      description: `Key signature: ${keyItem.accidentals}. Tones: ${notes.join(', ')}.`,
      voicingTip: isMajor
        ? `Root position: ${notes[0]} - ${notes[1]} - ${notes[2]}.`
        : `Relative minor triad voiced in root position.`,
    });
  };

  // Helper to calculate SVG wedge path
  const describeArc = (
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180.0;
    const sRad = toRad(startAngle);
    const eRad = toRad(endAngle);

    const x1 = cx + outerRadius * Math.cos(sRad);
    const y1 = cy + outerRadius * Math.sin(sRad);
    const x2 = cx + outerRadius * Math.cos(eRad);
    const y2 = cy + outerRadius * Math.sin(eRad);

    const x3 = cx + innerRadius * Math.cos(eRad);
    const y3 = cy + innerRadius * Math.sin(eRad);
    const x4 = cx + innerRadius * Math.cos(sRad);
    const y4 = cy + innerRadius * Math.sin(sRad);

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  };

  // Calculate text coordinates at angle
  const getCoords = (cx: number, cy: number, radius: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const cx = 250;
  const cy = 250;
  const outerR = 230;
  const midR = 160;
  const innerR = 95;

  return (
    <div className="w-full bg-white rounded-3xl border border-[#eae6de] p-6 sm:p-10 shadow-xs mb-14">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-[#eae6de] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4efe6] text-[#8a6839] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#9e7a4b]" />
            <span>Interactive Theory Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518]">
            The Circle of Fifths
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5f6a] max-w-xl mt-1">
            The master blueprint of Western tonal harmony. Click any Major key (outer ring) or Relative Minor key (inner ring) to play its tonic chord, view its key signature, and explore all 7 diatonic chords.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium self-start md:self-center bg-[#faf8f5] p-2.5 rounded-2xl border border-[#eae6de]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#141518] border border-[#141518]" />
            <span className="text-[#141518]">Major (Outer)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c5a880] border border-[#b89562]" />
            <span className="text-[#5c5f6a]">Relative Minor (Inner)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive SVG Wheel (5 cols on large) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full select-none drop-shadow-sm"
            >
              {/* Outer decorative halo */}
              <circle
                cx={cx}
                cy={cy}
                r={outerR + 10}
                fill="none"
                stroke="#eae6de"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* 12 Outer Major Key Sectors */}
              {CIRCLE_KEYS.map((k) => {
                const isSelected = selectedKeyId === k.id && activeMode === 'major';
                const isHovered = hoveredKeyId === k.id;
                const path = describeArc(cx, cy, midR, outerR, k.angle - 15, k.angle + 15);
                const coords = getCoords(cx, cy, (midR + outerR) / 2, k.angle);

                return (
                  <g key={`major-${k.id}`} className="cursor-pointer group">
                    <path
                      d={path}
                      fill={
                        isSelected
                          ? '#141518'
                          : isHovered
                          ? '#f2ece2'
                          : '#faf8f5'
                      }
                      stroke="#eae6de"
                      strokeWidth="1.5"
                      className="transition-colors duration-200"
                      onClick={() => handleKeyClick(k, 'major')}
                      onMouseEnter={() => setHoveredKeyId(k.id)}
                      onMouseLeave={() => setHoveredKeyId(null)}
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-sm sm:text-base font-serif font-semibold pointer-events-none transition-colors ${
                        isSelected ? 'fill-[#c5a880]' : 'fill-[#141518]'
                      }`}
                    >
                      {k.major}
                    </text>
                  </g>
                );
              })}

              {/* 12 Inner Relative Minor Key Sectors */}
              {CIRCLE_KEYS.map((k) => {
                const isSelected = selectedKeyId === k.id && activeMode === 'minor';
                const isHovered = hoveredKeyId === k.id;
                const path = describeArc(cx, cy, innerR, midR, k.angle - 15, k.angle + 15);
                const coords = getCoords(cx, cy, (innerR + midR) / 2, k.angle);

                return (
                  <g key={`minor-${k.id}`} className="cursor-pointer group">
                    <path
                      d={path}
                      fill={
                        isSelected
                          ? '#c5a880'
                          : isHovered
                          ? '#ede5d8'
                          : '#f5f1eb'
                      }
                      stroke="#e2ded5"
                      strokeWidth="1.5"
                      className="transition-colors duration-200"
                      onClick={() => handleKeyClick(k, 'minor')}
                      onMouseEnter={() => setHoveredKeyId(k.id)}
                      onMouseLeave={() => setHoveredKeyId(null)}
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-xs font-mono font-medium pointer-events-none transition-colors ${
                        isSelected ? 'fill-[#141518] font-bold' : 'fill-[#5c5f6a]'
                      }`}
                    >
                      {k.minor}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub Display */}
              <circle
                cx={cx}
                cy={cy}
                r={innerR - 4}
                fill="#ffffff"
                stroke="#eae6de"
                strokeWidth="2"
                className="shadow-sm"
              />
              <circle
                cx={cx}
                cy={cy}
                r={innerR - 10}
                fill="#faf8f5"
                stroke="#e2ded5"
                strokeWidth="1"
              />

              {/* Center text: Active Key details */}
              <text
                x={cx}
                y={cy - 20}
                textAnchor="middle"
                className="text-[10px] font-mono uppercase tracking-widest fill-[#9e7a4b] font-semibold"
              >
                Tonic Key
              </text>
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                className="text-2xl font-serif font-bold fill-[#141518]"
              >
                {activeMode === 'major' ? selectedKey.major : selectedKey.minor}
              </text>
              <text
                x={cx}
                y={cy + 28}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[#5c5f6a]"
              >
                {selectedKey.accidentals}
              </text>
            </svg>
          </div>

          <p className="text-[11px] text-[#5c5f6a] text-center mt-3 font-medium">
            💡 <em>Click any slice on the wheel to hear its tonic chord and inspect its harmonic family.</em>
          </p>
        </div>

        {/* Selected Key Harmonization Details Panel (6 cols) */}
        <div className="lg:col-span-6 bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-[#eae6de]">
          {/* Key Title Header */}
          <div className="flex items-start justify-between pb-5 border-b border-[#e5dcce]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9e7a4b] font-semibold">
                Tonal Center & Family
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518] mt-0.5">
                Key of {selectedKey.major} Major
              </h3>
              <p className="text-xs text-[#5c5f6a] mt-1">
                Relative Minor: <strong className="text-[#141518]">{selectedKey.minor}</strong> • Key Signature:{' '}
                <strong className="text-[#141518]">{selectedKey.accidentals}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playChord(selectedKey.majorNotes, 1.8, true);
                onSelectChord({
                  id: `${selectedKey.id.toLowerCase()}-major`,
                  name: `${selectedKey.major} Major`,
                  symbol: selectedKey.major,
                  formula: '1 - 3 - 5',
                  notes: selectedKey.majorNotes,
                  vibe: 'Tonic resolution of the key',
                  description: `Built on scale degrees 1, 3, 5 of ${selectedKey.major} Major.`,
                  voicingTip: 'Root position triad.',
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141518] text-white text-xs font-medium hover:bg-[#2b2d35] cursor-pointer transition-colors shadow-xs shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Play Tonic</span>
            </button>
          </div>

          {/* Scale Degrees */}
          <div className="my-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#141518] block mb-2">
              Major Scale Tones (1 - 2 - 3 - 4 - 5 - 6 - 7)
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {selectedKey.scaleNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#eae6de] text-xs font-mono font-bold text-[#141518] shadow-2xs"
                >
                  <span className="text-[10px] text-[#9e7a4b] block leading-none mb-0.5">
                    {idx + 1}
                  </span>
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* All 7 Diatonic Chords of the Key */}
          <div className="my-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#141518]">
                Diatonic Chords (Harmonized Scale)
              </span>
              <span className="text-[11px] text-[#5c5f6a]">Click any chord to audition</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedKey.diatonicChords.map((chord) => (
                <button
                  key={chord.degree}
                  type="button"
                  onClick={() => {
                    soundEngine.playChord(chord.notes, 1.4, true);
                    onSelectChord({
                      id: `${selectedKey.id}-${chord.degree}`,
                      name: chord.name,
                      symbol: `${chord.degree} (${chord.name})`,
                      formula: chord.quality === 'Major' ? '1 - 3 - 5' : chord.quality === 'Minor' ? '1 - ♭3 - 5' : '1 - ♭3 - ♭5',
                      notes: chord.notes,
                      vibe: `Degree ${chord.degree} in the key of ${selectedKey.major}`,
                      description: `${chord.quality} diatonic triad formed on degree ${chord.degree}.`,
                      voicingTip: `Notes: ${chord.notes.join(' - ')}.`,
                    });
                  }}
                  className="p-2.5 rounded-2xl bg-white border border-[#eae6de] hover:border-[#b89562]/60 hover:shadow-xs transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#9e7a4b] uppercase">
                      {chord.degree}
                    </span>
                    <Play className="w-2.5 h-2.5 text-stone-400 group-hover:text-[#141518] transition-colors" />
                  </div>
                  <div className="text-xs font-semibold text-[#141518] truncate">
                    {chord.name}
                  </div>
                  <div className="text-[10px] text-[#5c5f6a] font-mono truncate">
                    {chord.notes.join(' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Signature Cadence */}
          {selectedKey.cadences.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#e5dcce]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#141518]">
                  Key Cadence: {selectedKey.cadences[0].name}
                </span>
                <span className="text-[11px] font-mono text-[#9e7a4b] font-semibold">
                  {selectedKey.cadences[0].roman}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-1">
                  {selectedKey.cadences[0].chords.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#eae6de] text-xs font-mono font-semibold text-[#141518] shadow-2xs"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const cadence = selectedKey.cadences[0];
                    cadence.chords.forEach((c, idx) => {
                      setTimeout(() => {
                        soundEngine.playChord(c.notes, 1.2, true);
                      }, idx * 750);
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4efe6] hover:bg-[#ede5d8] border border-[#e5dcce] text-xs font-medium text-[#141518] cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 text-[#9e7a4b] fill-current" />
                  <span>Play Cadence</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
