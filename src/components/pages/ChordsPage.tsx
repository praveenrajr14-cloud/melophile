import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audioSynth';
import { CircleOfFifths } from '../chords/CircleOfFifths';
import { FullTriadsList } from '../chords/FullTriadsList';
import {
  Play,
  Volume2,
  Lock,
  Sparkles,
  CheckCircle,
  Crown,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Music2,
  Layers,
  Repeat,
  Info,
} from 'lucide-react';

interface ChordItem {
  id: string;
  name: string;
  symbol: string;
  formula: string;
  notes: string[];
  vibe: string;
  description: string;
  voicingTip: string;
}

interface ProgressionItem {
  id: string;
  title: string;
  roman: string;
  genre: string;
  description: string;
  chords: { name: string; notes: string[] }[];
}

interface Topic {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  level: string;
  concept: string;
  chords: ChordItem[];
  progressions: ProgressionItem[];
  isPro?: boolean;
}

export const ChordsPage: React.FC = () => {
  // Session subscription state
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [subSuccess, setSubSuccess] = useState(false);

  // Active playing state
  const [selectedChord, setSelectedChord] = useState<ChordItem>({
    id: 'c-major',
    name: 'C Major',
    symbol: 'C',
    formula: '1 - 3 - 5',
    notes: ['C4', 'E4', 'G4'],
    vibe: 'Pure, stable, resolute',
    description: 'The foundation of Western harmony. Built using root, major third, and perfect fifth.',
    voicingTip: 'Keep fingers curved; balance weight evenly across root (C) and third (E).',
  });

  const [activeProgressionId, setActiveProgressionId] = useState<string | null>(null);
  const [progressionStep, setProgressionStep] = useState<number>(-1);

  // Topics definition (3 free, subscription paywall, 3 advanced)
  const topics: Topic[] = [
    {
      id: 1,
      badge: 'Topic 01 • Foundational',
      title: 'Diatonic Triads & Major Scale Harmony',
      subtitle: 'The 3-note foundational blocks that form 90% of songs',
      level: 'Beginner',
      concept:
        'A triad is formed by stacking two thirds on top of a root note (1 - 3 - 5). In the C Major scale, seven unique diatonic triads are produced: three Major, three Minor, and one Diminished.',
      chords: [
        {
          id: 'c-major',
          name: 'C Major',
          symbol: 'C (I)',
          formula: '1 - 3 - 5',
          notes: ['C4', 'E4', 'G4'],
          vibe: 'Pure, stable, home',
          description: 'The tonic chord (I) providing resolution and ultimate rest.',
          voicingTip: 'Root position: C4 (thumb), E4 (middle), G4 (pinky).',
        },
        {
          id: 'd-minor',
          name: 'D Minor',
          symbol: 'Dm (ii)',
          formula: '1 - b3 - 5',
          notes: ['D4', 'F4', 'A4'],
          vibe: 'Soft, wistful, pre-dominant',
          description: 'The supertonic chord (ii). Leads smoothly into G Major (V).',
          voicingTip: 'Relax the third finger on F4 to prevent excessive harshness.',
        },
        {
          id: 'e-minor',
          name: 'E Minor',
          symbol: 'Em (iii)',
          formula: '1 - b3 - 5',
          notes: ['E4', 'G4', 'B4'],
          vibe: 'Introspective, delicate',
          description: 'The mediant chord (iii), sharing notes with both C and G.',
          voicingTip: 'Often voiced in 1st inversion (G-B-E) for smoother voice leading.',
        },
        {
          id: 'f-major',
          name: 'F Major',
          symbol: 'F (IV)',
          formula: '1 - 3 - 5',
          notes: ['F4', 'A4', 'C5'],
          vibe: 'Open, hopeful, expansive',
          description: 'The subdominant chord (IV). Gives a feeling of taking flight.',
          voicingTip: 'Notice C5 on top; perfect for melodic soprano voicing.',
        },
        {
          id: 'g-major',
          name: 'G Major',
          symbol: 'G (V)',
          formula: '1 - 3 - 5',
          notes: ['G4', 'B4', 'D5'],
          vibe: 'Bright, magnetic tension',
          description: 'The dominant chord (V). Contains the leading tone B that pulls back to C.',
          voicingTip: 'Lead tone B4 demands clean articulation before resolving to C.',
        },
        {
          id: 'a-minor',
          name: 'A Minor',
          symbol: 'Am (vi)',
          formula: '1 - b3 - 5',
          notes: ['A4', 'C5', 'E5'],
          vibe: 'Bittersweet, melancholic',
          description: 'The relative minor (vi). Used as a substitute for home tonic C.',
          voicingTip: 'Emphasize the lower A4 to give depth to the minor third interval.',
        },
      ],
      progressions: [
        {
          id: 'p-1',
          title: 'The Classic Pop/Folk Cadence',
          roman: 'I - IV - V - I',
          genre: 'Pop, Classical, Folk',
          description: 'The most universal harmonic cycle in Western music. Departure, peak tension, and resolution.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'F', notes: ['F4', 'A4', 'C5'] },
            { name: 'G', notes: ['G4', 'B4', 'D5'] },
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
          ],
        },
        {
          id: 'p-2',
          title: 'The 50s Doo-Wop Loop',
          roman: 'I - vi - IV - V',
          genre: 'Doo-Wop, Rock & Roll, Pop Ballads',
          description: 'Heard in thousands of classics from "Stand by Me" to "Perfect". Nostalgic and comforting.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'Am', notes: ['A4', 'C5', 'E5'] },
            { name: 'F', notes: ['F4', 'A4', 'C5'] },
            { name: 'G', notes: ['G4', 'B4', 'D5'] },
          ],
        },
        {
          id: 'p-3',
          title: 'The Emotional Modern Anthem',
          roman: 'vi - IV - I - V',
          genre: 'Modern Pop, Indie, Cinema',
          description: 'Starts in minor for emotional vulnerability, then elevates with IV and I.',
          chords: [
            { name: 'Am', notes: ['A4', 'C5', 'E5'] },
            { name: 'F', notes: ['F4', 'A4', 'C5'] },
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'G', notes: ['G4', 'B4', 'D5'] },
          ],
        },
      ],
    },
    {
      id: 2,
      badge: 'Topic 02 • Intermediate',
      title: 'Seventh Chords & Jazz/Soul Cadences',
      subtitle: 'Adding the 7th degree for harmonic depth and emotional richness',
      level: 'Intermediate',
      concept:
        'By stacking a third degree above the 5th (1 - 3 - 5 - 7), seventh chords introduce harmonic tension, warmth, and jazz sophistication. The relationship between the 3rd and 7th ("guide tones") dictates the chord personality.',
      chords: [
        {
          id: 'c-maj7',
          name: 'C Major 7th',
          symbol: 'Cmaj7 (IΔ)',
          formula: '1 - 3 - 5 - 7',
          notes: ['C4', 'E4', 'G4', 'B4'],
          vibe: 'Dreamy, luxurious, floating',
          description: 'The shimmering major 7th interval (B) softens the brightness of C Major.',
          voicingTip: 'Drop the root to the bass and play E4-G4-B4 in right hand.',
        },
        {
          id: 'd-min7',
          name: 'D Minor 7th',
          symbol: 'Dm7 (ii7)',
          formula: '1 - b3 - 5 - b7',
          notes: ['D4', 'F4', 'A4', 'C5'],
          vibe: 'Velvety, smooth, contemplative',
          description: 'The definitive jazz minor chord. The minor 7th (C) adds cool elegance.',
          voicingTip: 'Try omitting the 5th (A) for a cleaner modern soul keyboard comp.',
        },
        {
          id: 'g7-dom',
          name: 'G Dominant 7th',
          symbol: 'G7 (V7)',
          formula: '1 - 3 - 5 - b7',
          notes: ['G4', 'B4', 'D5', 'F5'],
          vibe: 'Tense, restless, magnetic',
          description: 'Contains a tritone between B and F that begs to resolve inward to C and E.',
          voicingTip: 'Emphasize the B and F guide tones to articulate the tension.',
        },
        {
          id: 'a-min7',
          name: 'A Minor 7th',
          symbol: 'Am7 (vi7)',
          formula: '1 - b3 - 5 - b7',
          notes: ['A4', 'C5', 'E5', 'G5'],
          vibe: 'Warm, wistful, resonant',
          description: 'Provides deep emotional color; essentially a C Major triad with an A bass.',
          voicingTip: 'Play A in low left hand; voice C5-E5-G5 in right hand.',
        },
      ],
      progressions: [
        {
          id: 'p-4',
          title: 'The Definitive Jazz Turnaround',
          roman: 'ii7 - V7 - Imaj7',
          genre: 'Jazz, Bossa Nova, Lo-Fi Hip Hop',
          description: 'The undisputed king of jazz harmony. Creates smooth voice leading with guide tones.',
          chords: [
            { name: 'Dm7', notes: ['D4', 'F4', 'A4', 'C5'] },
            { name: 'G7', notes: ['G4', 'B4', 'D5', 'F5'] },
            { name: 'Cmaj7', notes: ['C4', 'E4', 'G4', 'B4'] },
          ],
        },
        {
          id: 'p-5',
          title: 'Velvet R&B / Neo-Soul Cycle',
          roman: 'Imaj7 - iii7 - vi7 - IVmaj7',
          genre: 'R&B, Soul, Indie Pop',
          description: 'Luxurious descending cascade of seventh chords with creamy emotional warmth.',
          chords: [
            { name: 'Cmaj7', notes: ['C4', 'E4', 'G4', 'B4'] },
            { name: 'Em7', notes: ['E4', 'G4', 'B4', 'D5'] },
            { name: 'Am7', notes: ['A4', 'C5', 'E5', 'G5'] },
            { name: 'Fmaj7', notes: ['F4', 'A4', 'C5', 'E5'] },
          ],
        },
      ],
    },
    {
      id: 3,
      badge: 'Topic 03 • Modern Colors',
      title: 'Extended, Suspended & Pop Harmonies',
      subtitle: 'Add9, Sus2, Sus4 and secondary dominants shaping contemporary hits',
      level: 'Upper-Intermediate',
      concept:
        'By replacing or augmenting the 3rd with the 2nd or 4th, suspended chords suspend harmonic gravity. Adding the 9th brings high shimmer without the jazz complexity of 7ths.',
      chords: [
        {
          id: 'c-sus4',
          name: 'C Suspended 4th',
          symbol: 'Csus4',
          formula: '1 - 4 - 5',
          notes: ['C4', 'F4', 'G4'],
          vibe: 'Suspended, anticipatory, churchly',
          description: 'Replaces the 3rd with the 4th (F). Craves resolution down to E.',
          voicingTip: 'Let F4 ring before gently stepping down to E4 for the classic release.',
        },
        {
          id: 'f-add9',
          name: 'F Add 9',
          symbol: 'Fadd9',
          formula: '1 - 3 - 5 - 9',
          notes: ['F4', 'A4', 'C5', 'G5'],
          vibe: 'Luminous, acoustic sparkle, modern',
          description: 'Retains the warmth of the major triad while adding the high crystalline 9th (G).',
          voicingTip: 'Spread across two octaves: F3 in left hand, A4-C5-G5 in right.',
        },
        {
          id: 'c-maj9',
          name: 'C Major 9th',
          symbol: 'Cmaj9',
          formula: '1 - 3 - 5 - 7 - 9',
          notes: ['C4', 'E4', 'B4', 'D5'],
          vibe: 'Ethereal, cinematic, modern gospel',
          description: '5-note color chord; often played omitting the 5th for clarity.',
          voicingTip: 'Left hand plays C; right hand plays an Em7 triad (E-G-B-D).',
        },
        {
          id: 'e7-sec',
          name: 'E7 (Secondary Dominant)',
          symbol: 'V7/vi (E7)',
          formula: '1 - 3 - 5 - b7',
          notes: ['E4', 'G#4', 'B4', 'D5'],
          vibe: 'Dramatic, intense pull, bluesy',
          description: 'Borrowed dominant that pulls magnetically into A minor.',
          voicingTip: 'G#4 is the chromatic note outside C Major that creates the dramatic pull.',
        },
      ],
      progressions: [
        {
          id: 'p-6',
          title: 'The Modern Cinematic Stadium Anthem',
          roman: 'I - V - vi7 - IVadd9',
          genre: 'Coldplay, Adele, Stadium Pop',
          description: 'The timeless 4-chord progression elevated with open voicings and high 9th pedal tones.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'G', notes: ['G4', 'B4', 'D5'] },
            { name: 'Am7', notes: ['A4', 'C5', 'E5', 'G5'] },
            { name: 'Fadd9', notes: ['F4', 'A4', 'C5', 'G5'] },
          ],
        },
        {
          id: 'p-7',
          title: 'The Secondary Dominant Emotional Lift',
          roman: 'I - V7/vi - vi - IV',
          genre: 'Radiohead, Billy Joel, Broadway',
          description: 'The E7 acts as a surprise harmonic catapult straight into A minor.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'E7', notes: ['E4', 'G#4', 'B4', 'D5'] },
            { name: 'Am', notes: ['A4', 'C5', 'E5'] },
            { name: 'F', notes: ['F4', 'A4', 'C5'] },
          ],
        },
      ],
    },
    // TOPIC 4, 5, 6: ADVANCED (LOCKED BEHIND SUBSCRIPTION)
    {
      id: 4,
      badge: 'Topic 04 • Advanced Pro',
      title: 'Jazz Voicings, Rootless Chords & Tritone Substitution',
      subtitle: 'Bill Evans rootless voicings, altered dominants, and chromatic substitutions',
      level: 'Advanced',
      isPro: true,
      concept:
        'Professional jazz keyboardists rarely play the root note in their right hand. By playing 3rd-7th-9th-13th color combinations and replacing V7 with the tritone substitution (bII7), you unlock authentic bebop and modern jazz textures.',
      chords: [
        {
          id: 'dm9-rootless',
          name: 'Dm9 (Rootless Type A)',
          symbol: 'Dm9 [Rootless]',
          formula: 'b3 - 5 - b7 - 9',
          notes: ['F4', 'A4', 'C5', 'E5'],
          vibe: 'Sophisticated, smoky, weightless',
          description: 'Bill Evans signature voicing. Eliminates root D to let the bass player breathe.',
          voicingTip: 'Fingers 1-2-3-5 on F-A-C-E with left hand supplying bass or pedal.',
        },
        {
          id: 'db9-tritone',
          name: 'Db9 (Tritone Substitution of G7)',
          symbol: 'Db9 (Sub V7)',
          formula: '1 - 3 - 5 - b7 - 9',
          notes: ['C#4', 'F4', 'B4', 'D#5'],
          vibe: 'Sultry, Chromatic sliding tension',
          description: 'Shares the same tritone (F & B) as G7, but resolves chromatically down a half-step to C.',
          voicingTip: 'Slide downward smoothly from Dm7 to Db9 into Cmaj9.',
        },
        {
          id: 'g7-alt',
          name: 'G7 Altered (G7alt)',
          symbol: 'G7(#9b13)',
          formula: '1 - 3 - b7 - #9 - b13',
          notes: ['G4', 'B4', 'F5', 'A#5', 'D#5'],
          vibe: 'Dangerous, modern jazz dissonance',
          description: 'All possible tensions altered: sharp 9 and flat 13 over a dominant tritone.',
          voicingTip: 'Resolve both altered tensions inward to the 5th and 9th of C Major.',
        },
      ],
      progressions: [
        {
          id: 'p-8',
          title: 'The Chromatic Tritone Jazz Cadence',
          roman: 'ii7 - bII9 - Imaj9',
          genre: 'Modern Jazz, Film Noir',
          description: 'The smoothest chromatic bass line in jazz: D -> Db -> C.',
          chords: [
            { name: 'Dm9', notes: ['F4', 'A4', 'C5', 'E5'] },
            { name: 'Db9', notes: ['C#4', 'F4', 'B4', 'D#5'] },
            { name: 'Cmaj9', notes: ['E4', 'G4', 'B4', 'D5'] },
          ],
        },
      ],
    },
    {
      id: 5,
      badge: 'Topic 05 • Advanced Pro',
      title: 'Modal Interchange & Neo-Soul Loops',
      subtitle: 'Borrowing from parallel Aeolian & Dorian modes for bittersweet nostalgia',
      level: 'Advanced',
      isPro: true,
      concept:
        'Modal interchange involves borrowing chords from the parallel minor scale. The minor plagal cadence (iv to I) and backdoor dominant (bVII to I) create that instant emotional lump in the throat popularized by The Beatles and Stevie Wonder.',
      chords: [
        {
          id: 'f-min6',
          name: 'F Minor 6th (The Romantic iv)',
          symbol: 'iv6 (Fm6)',
          formula: '1 - b3 - 5 - 6',
          notes: ['F4', 'G#4', 'C5', 'D5'],
          vibe: 'Bittersweet nostalgia, heartbreaking',
          description: 'The legendary "minor plagal" chord. Ab resolves down to G; D resolves down to C.',
          voicingTip: 'Play with delicate touch right after F Major for maximum emotional contrast.',
        },
        {
          id: 'ab-maj7',
          name: 'Ab Major 7th (The bVI)',
          symbol: 'bVImaj7 (Abmaj7)',
          formula: '1 - 3 - 5 - 7',
          notes: ['G#4', 'C5', 'D#5', 'G5'],
          vibe: 'Epic, transcendent, heroic lift',
          description: 'Borrowed from C Natural Minor (Aeolian). Used in major cinema anthems.',
          voicingTip: 'Let the high G5 sing out as the common tone connected to C Major.',
        },
        {
          id: 'bb9-backdoor',
          name: 'Bb9 (The Backdoor Dominant)',
          symbol: 'bVII9 (Bb9)',
          formula: '1 - 3 - 5 - b7 - 9',
          notes: ['A#4', 'D5', 'F5', 'G#5', 'C6'],
          vibe: 'Soulful, unexpected resolution',
          description: 'Resolves to C Major from a whole step below instead of above.',
          voicingTip: 'Keep C6 on top to serve as the melodic anchor into Cmaj7.',
        },
      ],
      progressions: [
        {
          id: 'p-9',
          title: 'The Beatles "In My Life" Minor Plagal',
          roman: 'I - Imaj7 - iv6 - I',
          genre: 'Classic Rock, Romantic Ballad',
          description: 'The golden formula for nostalgic tearjerkers. The F to Fm transition is unforgettable.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'Cmaj7', notes: ['C4', 'E4', 'G4', 'B4'] },
            { name: 'Fm6', notes: ['F4', 'G#4', 'C5', 'D5'] },
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
          ],
        },
      ],
    },
    {
      id: 6,
      badge: 'Topic 06 • Masterclass Pro',
      title: 'Cinematic Film Score Voicings & Quartal Harmony',
      subtitle: 'Perfect 4th stacks, Hans Zimmer hybrid polychords, and interstellar suspense',
      level: 'Masterclass',
      isPro: true,
      concept:
        'Traditional tertian harmony stacks thirds; quartal harmony stacks perfect fourths. Popularized by McCoy Tyner and film composer Hans Zimmer, quartal chords sound futuristic, wide, and ambiguously floating.',
      chords: [
        {
          id: 'quartal-c',
          name: 'Quartal Stack in C',
          symbol: 'C Quartal [4ths]',
          formula: '1 - 4 - b7 - b10',
          notes: ['C4', 'F4', 'A#4', 'D#5'],
          vibe: 'Futuristic, spacious, sci-fi mystery',
          description: 'Stack of pure 4ths: C to F (4th), F to Bb (4th), Bb to Eb (4th).',
          voicingTip: 'Hold the sustain pedal down and let the non-functional 4ths ring out.',
        },
        {
          id: 'd-over-c',
          name: 'D / C (Lydian Hybrid Slash Chord)',
          symbol: 'D/C [II/I]',
          formula: '1 (Bass) + 2 - #4 - 6',
          notes: ['C4', 'D4', 'F#4', 'A4'],
          vibe: 'Wonder, celestial awe, Spielberg/Zimmer',
          description: 'D Major triad over C bass creates the enchanting C Lydian (#4) mode.',
          voicingTip: 'Hard C in left hand; clear ringing D-F#-A triad in right hand.',
        },
      ],
      progressions: [
        {
          id: 'p-10',
          title: 'The Hans Zimmer Interstellar Odyssey',
          roman: 'I - II/I - iv/I - I',
          genre: 'Cinematic Film Score',
          description: 'Pedal bass on C with shifting upper triads creating celestial wonder and tension.',
          chords: [
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
            { name: 'D/C', notes: ['C4', 'D4', 'F#4', 'A4'] },
            { name: 'Fm/C', notes: ['C4', 'F4', 'G#4', 'C5'] },
            { name: 'C', notes: ['C4', 'E4', 'G4'] },
          ],
        },
      ],
    },
  ];

  // Helper to match notes across enharmonics (e.g., Db4 = C#4)
  const normalizePitch = (pitch: string) => {
    return pitch
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');
  };

  const isKeyActive = (keyNote: string, activeNotes: string[]) => {
    const normKey = normalizePitch(keyNote);
    return activeNotes.some((n) => normalizePitch(n) === normKey);
  };

  // Play single chord
  const handlePlayChord = (chord: ChordItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playChord(chord.notes, 1.8, true);
    setSelectedChord(chord);
  };

  // Play progression loop
  const handlePlayProgression = (progression: ProgressionItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick(700);

    setActiveProgressionId(progression.id);
    setProgressionStep(0);

    progression.chords.forEach((chord, idx) => {
      setTimeout(() => {
        setProgressionStep(idx);
        soundEngine.playChord(chord.notes, 1.4, true);

        // Highlight matching chord if found
        const match = topics
          .flatMap((t) => t.chords)
          .find((c) => c.name.toLowerCase().startsWith(chord.name.toLowerCase()));
        if (match) {
          setSelectedChord(match);
        }

        if (idx === progression.chords.length - 1) {
          setTimeout(() => {
            setActiveProgressionId(null);
            setProgressionStep(-1);
          }, 1200);
        }
      }, idx * 1100);
    });
  };

  // Simulated Pro Subscription checkout
  const handleCompleteSubscription = () => {
    soundEngine.playClick(900);
    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#b89562', '#141518', '#f5f3ef', '#ffffff'],
      });
    } catch {
      // Ignored
    }
    setSubSuccess(true);
    setIsProUnlocked(true);

    setTimeout(() => {
      setShowSubModal(false);
      setSubSuccess(false);
    }, 2000);
  };

  return (
    <div className="relative w-full text-[#141518] pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] border border-[#e5dcce] text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-3">
          <Music2 className="w-3.5 h-3.5 text-[#9e7a4b]" />
          <span>Interactive Harmony Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#141518] mb-4">
          Chord Library & Progressions
        </h1>
        <p className="max-w-2xl mx-auto text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
          From basic 3-note triads to complex jazz substitutions and cinematic film scores.
          Click any chord to hear authentic synthesized voicings and see the exact finger placements.
        </p>

        {/* Quick jump navigation */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
          <a
            href="#circle-of-fifths"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141518] text-[#c5a880] border border-[#141518] hover:bg-[#2b2d35] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#c5a880]" />
            Circle of Fifths
          </a>
          <a
            href="#full-triads-list"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f4efe6] text-[#8a6839] border border-[#e5dcce] hover:bg-[#ede5d8] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Layers className="w-3 h-3 text-[#9e7a4b]" />
            24 Triads (List-Wise)
          </a>
          <a
            href="#topic-1"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#ede8e0] border border-[#eae6de] text-[#5c5f6a] transition-colors"
          >
            Topic 1: Triads & Harmony
          </a>
          <a
            href="#topic-2"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#ede8e0] border border-[#eae6de] text-[#5c5f6a] transition-colors"
          >
            Topic 2: 7th Chords
          </a>
          <a
            href="#topic-3"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#ede8e0] border border-[#eae6de] text-[#5c5f6a] transition-colors"
          >
            Topic 3: Pop & Extensions
          </a>
          <a
            href="#subscription-section"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141518] text-white flex items-center gap-1.5 shadow-xs"
          >
            <Crown className="w-3 h-3 text-[#c5a880]" />
            Pro Subscription
          </a>
          <a
            href="#topic-4"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#ede8e0] border border-[#eae6de] text-[#5c5f6a] transition-colors"
          >
            Topic 4-6: Pro Voicings
          </a>
        </div>
      </div>

      {/* 2. CHORD VISUALIZER & PIANO KEYBOARD VIEWER (STICKY HEAD) */}
      <div className="sticky top-20 z-30 mb-14 bg-white/95 backdrop-blur-md rounded-3xl border border-[#eae6de] p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chord metadata display (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9e7a4b] font-semibold">
                Active Voicing Inspector
              </span>
              <button
                type="button"
                onClick={() => handlePlayChord(selectedChord)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141518] text-white text-xs font-medium hover:bg-[#2b2d35] cursor-pointer transition-colors shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
                Play Chord
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#141518]">
                {selectedChord.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[#8a6839] text-xs font-mono font-semibold">
                {selectedChord.symbol}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#5c5f6a]">
              <span>
                Formula: <strong className="text-[#141518] font-mono">{selectedChord.formula}</strong>
              </span>
              <span>•</span>
              <span>
                Tones: <strong className="text-[#9e7a4b] font-mono">{selectedChord.notes.join(' - ')}</strong>
              </span>
            </div>

            <p className="text-xs text-[#5c5f6a] leading-relaxed pt-1">
              <em>"{selectedChord.vibe}"</em> — {selectedChord.description}
            </p>
          </div>

          {/* Mini Visual Piano Keys (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-end justify-center">
            <div className="relative inline-flex bg-[#141518] p-2 rounded-xl border border-[#2b2d35] shadow-inner select-none">
              {/* Felt strip */}
              <div className="absolute top-1 left-2 right-2 h-1 bg-[#8b2626] rounded-xs pointer-events-none" />

              {/* White keys (C4 to B4 + C5 to G5) */}
              {[
                'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
                'C5', 'D5', 'E5', 'F5', 'G5'
              ].map((note) => {
                const isPressed = isKeyActive(note, selectedChord.notes);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => soundEngine.playChord([note], 1.2, false)}
                    className={`relative w-6 sm:w-8 h-24 sm:h-28 rounded-b border-x border-b border-black/20 transition-all duration-75 cursor-pointer origin-top flex flex-col justify-end items-center pb-1.5 group ${
                      isPressed
                        ? 'bg-[#9e7a4b] text-white shadow-sm ring-1 ring-[#c5a880]'
                        : 'bg-white hover:bg-[#faf8f5] text-stone-700'
                    }`}
                  >
                    <span className={`text-[9px] font-mono ${isPressed ? 'font-bold text-white' : 'text-stone-400'}`}>
                      {note}
                    </span>
                  </button>
                );
              })}

              {/* Black keys overlaid */}
              {[
                { note: 'C#4', left: 1.1 },
                { note: 'D#4', left: 3.1 },
                { note: 'F#4', left: 7.1 },
                { note: 'G#4', left: 9.1 },
                { note: 'A#4', left: 11.1 },
                { note: 'C#5', left: 15.1 },
                { note: 'D#5', left: 17.1 },
                { note: 'F#5', left: 21.1 },
              ].map((bk) => {
                const isPressed = isKeyActive(bk.note, selectedChord.notes);
                return (
                  <button
                    key={bk.note}
                    type="button"
                    onClick={() => soundEngine.playChord([bk.note], 1.2, false)}
                    style={{ left: `calc(${bk.left} * 1rem)` }}
                    className={`absolute top-2 w-4 sm:w-5 h-16 sm:h-18 rounded-b-xs z-10 transition-all duration-75 cursor-pointer flex flex-col justify-end items-center pb-1 ${
                      isPressed
                        ? 'bg-[#c5a880] text-[#0b0c0e] ring-2 ring-[#c5a880]'
                        : 'bg-[#181a20] hover:bg-[#252830] text-white/70'
                    }`}
                  >
                    <span className="text-[7px] font-mono leading-none">
                      {bk.note.replace('4', '').replace('5', '')}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-[#5c5f6a] mt-1.5 font-medium">
              Highlighted keys denote active voicing tones
            </span>
          </div>
        </div>
      </div>

      {/* 2.5 INTERACTIVE CIRCLE OF FIFTHS */}
      <section id="circle-of-fifths" className="scroll-mt-36">
        <CircleOfFifths onSelectChord={(c) => setSelectedChord(c)} />
      </section>

      {/* 2.6 FULL 24 MAJOR & MINOR TRIADS DIRECTORY (LIST-WISE) */}
      <section id="full-triads-list" className="scroll-mt-36">
        <FullTriadsList
          onSelectChord={(c) => setSelectedChord(c)}
          selectedChordId={selectedChord.id}
        />
      </section>

      {/* 3. FREE TOPICS (1, 2, 3) */}
      <div className="space-y-20">
        {topics.slice(0, 3).map((topic) => (
          <section key={topic.id} id={`topic-${topic.id}`} className="scroll-mt-40">
            {/* Topic Header */}
            <div className="border-b border-[#eae6de] pb-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f4efe6] text-[#8a6839] border border-[#e5dcce]">
                  {topic.badge}
                </span>
                <span className="text-xs font-mono font-medium text-[#5c5f6a] bg-white px-2.5 py-0.5 rounded border border-[#eae6de]">
                  Level: {topic.level} • Free Unlocked
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#141518] mt-1">
                {topic.title}
              </h2>
              <p className="text-sm text-[#5c5f6a] mt-1">
                {topic.subtitle}
              </p>
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#eae6de] text-xs text-[#4a4d56] leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#9e7a4b] shrink-0 mt-0.5" />
                <span>{topic.concept}</span>
              </div>
            </div>

            {/* Chords Grid */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Core Chords in this Topic (Click to Play & Inspect):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.chords.map((chord) => {
                  const isCurrent = selectedChord.id === chord.id;
                  return (
                    <div
                      key={chord.id}
                      onClick={() => handlePlayChord(chord)}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isCurrent
                          ? 'bg-[#faf8f5] border-[#9e7a4b] shadow-md ring-1 ring-[#9e7a4b]/40'
                          : 'bg-white border-[#eae6de] hover:border-[#b89562]/60 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-[#141518] group-hover:text-[#9e7a4b] transition-colors">
                            {chord.name}
                          </h4>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#f4efe6] text-[#8a6839]">
                            {chord.symbol}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#5c5f6a] mb-2 font-mono">
                          <span>{chord.formula}</span>
                          <span>•</span>
                          <span className="text-[#9e7a4b]">{chord.notes.join(' ')}</span>
                        </div>
                        <p className="text-xs text-[#5c5f6a] leading-relaxed line-clamp-2">
                          {chord.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#f0ede6] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-400 italic">
                          {chord.vibe}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-[#f5f3ef] text-[#141518] hover:bg-[#141518] hover:text-white font-medium text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Audition
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Essential Progressions Grid */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-4 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5" />
                Featured Progressions (Click to Play Loop):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.progressions.map((prog) => {
                  const isPlaying = activeProgressionId === prog.id;
                  return (
                    <div
                      key={prog.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        isPlaying
                          ? 'bg-[#faf8f5] border-[#9e7a4b] shadow-md ring-1 ring-[#9e7a4b]/30'
                          : 'bg-white border-[#eae6de] hover:border-[#b89562]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-semibold text-[#8a6839] bg-[#f4efe6] px-2 py-0.5 rounded">
                            {prog.genre}
                          </span>
                          <h4 className="text-lg font-medium text-[#141518] mt-1.5">
                            {prog.title}
                          </h4>
                        </div>
                        <span className="font-mono text-sm font-semibold text-[#141518] bg-[#f5f3ef] px-2.5 py-1 rounded-lg border border-[#e2ded5]">
                          {prog.roman}
                        </span>
                      </div>

                      <p className="text-xs text-[#5c5f6a] leading-relaxed mb-5">
                        {prog.description}
                      </p>

                      {/* Interactive Chord Sequence Timeline */}
                      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                        {prog.chords.map((ch, idx) => {
                          const isCurrentStep = isPlaying && progressionStep === idx;
                          return (
                            <React.Fragment key={idx}>
                              <div
                                onClick={() => soundEngine.playChord(ch.notes, 1.4, true)}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all duration-200 flex flex-col items-center ${
                                  isCurrentStep
                                    ? 'bg-[#141518] text-white scale-105 shadow-md ring-2 ring-[#c5a880]'
                                    : 'bg-[#f5f3ef] hover:bg-[#ede8e0] text-[#141518] border border-[#e2ded5]'
                                }`}
                              >
                                <span>{ch.name}</span>
                                <span className="text-[9px] font-normal text-stone-400 mt-0.5">
                                  {ch.notes[0]}
                                </span>
                              </div>
                              {idx < prog.chords.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handlePlayProgression(prog, e)}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isPlaying
                            ? 'bg-[#9e7a4b] text-white shadow-sm'
                            : 'bg-[#141518] hover:bg-[#2b2d35] text-white shadow-xs'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isPlaying ? 'Playing Sequence...' : 'Play Progression Audio'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 4. SUBSCRIPTION PAYWALL CARD (AFTER TOPIC 3) */}
      <section
        id="subscription-section"
        className="my-24 relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#141518] via-[#1c1e24] to-[#121316] text-white shadow-2xl overflow-hidden border border-[#2b2d35]"
      >
        {/* Glow ambient decoration */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 text-xs font-semibold uppercase tracking-wider text-[#c5a880] mb-4">
            <Crown className="w-4 h-4 fill-current" />
            <span>Melophile Academy Pro</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white mb-4">
            Unlock Advanced Jazz, Neo-Soul & Film Harmony
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            You’ve mastered foundational triads, 7ths, and pop progressions.
            Take your playing to masterclass level with Topics 4, 5, and 6 — covering Bill Evans rootless voicings, modal interchange, tritone substitutions, and Hans Zimmer quartal harmony.
          </p>

          {/* Pricing Selector Tabs */}
          <div className="inline-flex items-center bg-black/40 p-1 rounded-full border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#141518] shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Monthly Plan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#c5a880] text-[#0b0c0e] shadow-sm font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Annual Pass (Save 35%)
              <span className="text-[10px] bg-black/40 text-white px-2 py-0.5 rounded-full">
                Best Value
              </span>
            </button>
          </div>

          {/* Price Tag */}
          <div className="mb-8">
            {billingCycle === 'annual' ? (
              <div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-6xl font-serif font-light text-[#c5a880]">
                    ₹7,999
                  </span>
                  <span className="text-sm text-stone-400 font-mono">/ year</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Equivalent to just ₹666/month. Includes 2 months completely free!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-6xl font-serif font-light text-[#c5a880]">
                    ₹999
                  </span>
                  <span className="text-sm text-stone-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Billed monthly. Cancel anytime with 1 click.
                </p>
              </div>
            )}
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-10">
            {[
              {
                icon: Layers,
                title: 'All Advanced Topics',
                desc: 'Instant unlock for Topics 4, 5, 6 with 50+ extended voicings & progressions.',
              },
              {
                icon: Zap,
                title: 'MIDI & PDF Lead Sheets',
                desc: 'Downloadable transcription sheets, chord charts, and MIDI stems.',
              },
              {
                icon: Crown,
                title: 'Monthly 1-on-1 Feedback',
                desc: 'Direct video review of your chord transitions by instructor Praveen Raj R.',
              },
              {
                icon: ShieldCheck,
                title: 'Studio Access Pass',
                desc: 'Priority offline acoustic piano rehearsal room booking in Parassala, TVM.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <Icon className="w-5 h-5 text-[#c5a880] mb-2" />
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Action Button */}
          {isProUnlocked ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-medium text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>You have Melophile Pro Active! All Topics 4-6 are fully unlocked below.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowSubModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#c5a880] hover:bg-[#d6bc98] text-[#0b0c0e] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xl shadow-black/80 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Subscribe to Melophile Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setIsProUnlocked(true);
                  try {
                    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
                  } catch {
                    // Ignored
                  }
                }}
                className="text-xs text-stone-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
              >
                Demo: Test Unlock All Topics Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. ADVANCED TOPICS (4, 5, 6 - LOCKED OR UNLOCKED BASED ON SUBSCRIPTION) */}
      <div className="space-y-20">
        {topics.slice(3, 6).map((topic) => (
          <section
            key={topic.id}
            id={`topic-${topic.id}`}
            className="scroll-mt-40 relative"
          >
            {/* If not unlocked, overlay premium gate */}
            {!isProUnlocked && (
              <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-[#eae6de]">
                <div className="w-14 h-14 rounded-2xl bg-[#141518] text-[#c5a880] flex items-center justify-center shadow-lg mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-1">
                  Pro Feature • {topic.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#141518] mb-2 max-w-md">
                  This topic is included with your Melophile Pro Subscription
                </h3>
                <p className="text-xs text-[#5c5f6a] max-w-sm leading-relaxed mb-5">
                  Unlock full audio playback, rootless jazz voicings, modal interchange formulas, and video analysis with Praveen Raj R.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSubModal(true)}
                  className="px-6 py-2.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Unlock with Melophile Pro</span>
                </button>
              </div>
            )}

            {/* Topic Header */}
            <div className="border-b border-[#eae6de] pb-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#141518] text-[#c5a880] border border-[#2b2d35] flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-[#c5a880]" />
                  {topic.badge}
                </span>
                <span className="text-xs font-mono font-medium text-[#8a6839] bg-[#f4efe6] px-2.5 py-0.5 rounded border border-[#e5dcce]">
                  Level: {topic.level} • Pro Masterclass
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#141518] mt-1">
                {topic.title}
              </h2>
              <p className="text-sm text-[#5c5f6a] mt-1">
                {topic.subtitle}
              </p>
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#eae6de] text-xs text-[#4a4d56] leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#9e7a4b] shrink-0 mt-0.5" />
                <span>{topic.concept}</span>
              </div>
            </div>

            {/* Chords Grid */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Advanced Voicings in this Topic:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.chords.map((chord) => {
                  const isCurrent = selectedChord.id === chord.id;
                  return (
                    <div
                      key={chord.id}
                      onClick={() => {
                        if (isProUnlocked) handlePlayChord(chord);
                        else setShowSubModal(true);
                      }}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isCurrent && isProUnlocked
                          ? 'bg-[#faf8f5] border-[#9e7a4b] shadow-md ring-1 ring-[#9e7a4b]/40'
                          : 'bg-white border-[#eae6de] hover:border-[#b89562]/60 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-[#141518] group-hover:text-[#9e7a4b] transition-colors">
                            {chord.name}
                          </h4>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#f4efe6] text-[#8a6839]">
                            {chord.symbol}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#5c5f6a] mb-2 font-mono">
                          <span>{chord.formula}</span>
                          <span>•</span>
                          <span className="text-[#9e7a4b]">{chord.notes.join(' ')}</span>
                        </div>
                        <p className="text-xs text-[#5c5f6a] leading-relaxed line-clamp-2">
                          {chord.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#f0ede6] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-400 italic">
                          {chord.vibe}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-[#f5f3ef] text-[#141518] hover:bg-[#141518] hover:text-white font-medium text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Audition
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Essential Progressions Grid */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-4 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5" />
                Featured Masterclass Progression:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.progressions.map((prog) => {
                  const isPlaying = activeProgressionId === prog.id;
                  return (
                    <div
                      key={prog.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        isPlaying
                          ? 'bg-[#faf8f5] border-[#9e7a4b] shadow-md ring-1 ring-[#9e7a4b]/30'
                          : 'bg-white border-[#eae6de] hover:border-[#b89562]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-semibold text-[#8a6839] bg-[#f4efe6] px-2 py-0.5 rounded">
                            {prog.genre}
                          </span>
                          <h4 className="text-lg font-medium text-[#141518] mt-1.5">
                            {prog.title}
                          </h4>
                        </div>
                        <span className="font-mono text-sm font-semibold text-[#141518] bg-[#f5f3ef] px-2.5 py-1 rounded-lg border border-[#e2ded5]">
                          {prog.roman}
                        </span>
                      </div>

                      <p className="text-xs text-[#5c5f6a] leading-relaxed mb-5">
                        {prog.description}
                      </p>

                      {/* Interactive Chord Sequence Timeline */}
                      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                        {prog.chords.map((ch, idx) => {
                          const isCurrentStep = isPlaying && progressionStep === idx;
                          return (
                            <React.Fragment key={idx}>
                              <div
                                onClick={() => {
                                  if (isProUnlocked) soundEngine.playChord(ch.notes, 1.4, true);
                                  else setShowSubModal(true);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all duration-200 flex flex-col items-center ${
                                  isCurrentStep
                                    ? 'bg-[#141518] text-white scale-105 shadow-md ring-2 ring-[#c5a880]'
                                    : 'bg-[#f5f3ef] hover:bg-[#ede8e0] text-[#141518] border border-[#e2ded5]'
                                }`}
                              >
                                <span>{ch.name}</span>
                                <span className="text-[9px] font-normal text-stone-400 mt-0.5">
                                  {ch.notes[0]}
                                </span>
                              </div>
                              {idx < prog.chords.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          if (isProUnlocked) handlePlayProgression(prog, e);
                          else setShowSubModal(true);
                        }}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isPlaying
                            ? 'bg-[#9e7a4b] text-white shadow-sm'
                            : 'bg-[#141518] hover:bg-[#2b2d35] text-white shadow-xs'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isPlaying ? 'Playing Sequence...' : 'Play Progression Audio'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 6. SUBSCRIPTION CHECKOUT MODAL */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative w-full max-w-md rounded-3xl bg-white border border-[#eae6de] p-6 sm:p-8 shadow-2xl text-[#141518] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient accent */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#b89562]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSubModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f5f3ef] hover:bg-[#ede8e0] text-[#5c5f6a] transition-colors cursor-pointer"
            >
              ✕
            </button>

            {subSuccess ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#f4efe6] border-2 border-[#9e7a4b] text-[#9e7a4b] mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-[#141518]">
                  Welcome to Melophile Pro!
                </h3>
                <p className="text-xs text-[#5c5f6a] leading-relaxed max-w-xs mx-auto">
                  All advanced jazz voicings, modal interchange loops, and film score topics are now completely unlocked.
                </p>
                <div className="p-3 bg-[#f5f3ef] rounded-xl text-xs font-mono text-[#8a6839]">
                  Subscription Status: Active • Annual Pass
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded-md bg-[#f4efe6] text-[#9e7a4b]">
                    <Crown className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#9e7a4b]">
                    Melophile Pro Checkout
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-medium text-[#141518] mb-1">
                  Complete Your Subscription
                </h3>
                <p className="text-xs text-[#5c5f6a] mb-6">
                  Unlimited harmonic library access, masterclass video reviews, and studio access.
                </p>

                {/* Plan Selection */}
                <div className="space-y-3 mb-6">
                  <div
                    onClick={() => setBillingCycle('annual')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      billingCycle === 'annual'
                        ? 'border-[#9e7a4b] bg-[#faf8f5] shadow-sm ring-1 ring-[#9e7a4b]/40'
                        : 'border-[#eae6de] hover:border-[#b89562]/40 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#141518]">Annual All-Access Pass</span>
                        <span className="text-[10px] bg-[#9e7a4b] text-white px-2 py-0.5 rounded-full font-bold">
                          Save 35%
                        </span>
                      </div>
                      <p className="text-xs text-[#5c5f6a] mt-0.5">
                        ₹7,999 / year (₹666/mo) • 2 months free
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-[#9e7a4b] flex items-center justify-center">
                      {billingCycle === 'annual' && <div className="w-2.5 h-2.5 rounded-full bg-[#9e7a4b]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      billingCycle === 'monthly'
                        ? 'border-[#9e7a4b] bg-[#faf8f5] shadow-sm ring-1 ring-[#9e7a4b]/40'
                        : 'border-[#eae6de] hover:border-[#b89562]/40 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm text-[#141518]">Monthly Membership</span>
                      <p className="text-xs text-[#5c5f6a] mt-0.5">
                        ₹999 / month • Cancel anytime
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-[#9e7a4b] flex items-center justify-center">
                      {billingCycle === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-[#9e7a4b]" />}
                    </div>
                  </div>
                </div>

                {/* Guaranteed inclusions */}
                <div className="space-y-2 mb-6 text-xs text-[#5c5f6a]">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#9e7a4b]" />
                    <span>Instant access to Topics 4, 5, and 6 audio playback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#9e7a4b]" />
                    <span>Monthly 1-on-1 video critique with Praveen Raj R</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#9e7a4b]" />
                    <span>PDF lead sheet downloads & studio rehearsal room perks</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleCompleteSubscription}
                  className="w-full py-3.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>
                    {billingCycle === 'annual' ? 'Start Annual Pass — ₹7,999' : 'Start Monthly Pass — ₹999'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
