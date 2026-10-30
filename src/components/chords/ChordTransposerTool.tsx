import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Music,
  Wand2,
  ArrowUpRight,
  Play,
  Square,
  ChevronUp,
  ChevronDown,
  Layers,
  Crown,
  X,
  Repeat,
  PanelRightOpen,
  ArrowRight,
  GitMerge,
  ToggleLeft,
  ToggleRight,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import {
  ReharmonizeLevel,
  PassingChordLevel,
  PassingChordTransition,
  InversionType,
  SmoothChordVoicing,
  KEY_OPTIONS,
  SAMPLE_SONGS,
  transposeAndReharmonizeSong,
  parseChordToken,
  buildSmoothChordVoicing,
  getRomanNumeral,
  isChordLine,
} from '../../utils/chordTransposerEngine';

interface ChordTransposerToolProps {
  onSelectChordForPiano?: (chordName: string, symbol: string, notes: string[], formula: string) => void;
  initialEnablePassingChords?: boolean;
  initialPassingLevel?: PassingChordLevel;
}

const WHITE_KEYS_2OCT = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
];

const BLACK_KEYS_2OCT: { note: string; flats: string; leftPercent: number }[] = [
  { note: 'C#4', flats: 'Db4', leftPercent: 5.1 },
  { note: 'D#4', flats: 'Eb4', leftPercent: 12.25 },
  { note: 'F#4', flats: 'Gb4', leftPercent: 26.55 },
  { note: 'G#4', flats: 'Ab4', leftPercent: 33.7 },
  { note: 'A#4', flats: 'Bb4', leftPercent: 40.85 },
  { note: 'C#5', flats: 'Db5', leftPercent: 55.1 },
  { note: 'D#5', flats: 'Eb5', leftPercent: 62.25 },
  { note: 'F#5', flats: 'Gb5', leftPercent: 76.55 },
  { note: 'G#5', flats: 'Ab5', leftPercent: 83.7 },
  { note: 'A#5', flats: 'Bb5', leftPercent: 90.85 },
];

export const ChordTransposerTool: React.FC<ChordTransposerToolProps> = ({
  onSelectChordForPiano,
  initialEnablePassingChords = false,
  initialPassingLevel = 'intermediate',
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_SONGS[0].sheet);
  const [targetKeyIndex, setTargetKeyIndex] = useState<number | null>(null);
  const [level, setSetLevel] = useState<ReharmonizeLevel>('basic');
  const [enharmonic, setEnharmonic] = useState<'auto' | 'sharp' | 'flat'>('auto');
  const [copied, setCopied] = useState<boolean>(false);

  // Passing Chords Studio state
  const [enablePassingChords, setEnablePassingChords] = useState<boolean>(initialEnablePassingChords);
  const [passingLevel, setPassingLevel] = useState<PassingChordLevel>(initialPassingLevel);
  const [playingCadenceId, setPlayingCadenceId] = useState<string | null>(null);

  useEffect(() => {
    if (initialEnablePassingChords !== undefined) {
      setEnablePassingChords(initialEnablePassingChords);
    }
  }, [initialEnablePassingChords]);

  // Side Popup Box state for Smooth Voice-Leading Inversion Inspector
  const [isSidePopupOpen, setIsSidePopupOpen] = useState<boolean>(true);
  const [inversionOverride, setInversionOverride] = useState<'auto' | InversionType>('auto');
  const [selectedVoicing, setSelectedVoicing] = useState<SmoothChordVoicing | null>(null);
  const [playingStepIdx, setPlayingStepIdx] = useState<number>(-1);
  const [isLoopingChords, setIsLoopingChords] = useState<boolean>(false);

  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [aiAnimating, setAiAnimating] = useState<boolean>(false);

  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const isLoopingRef = useRef<boolean>(false);

  useEffect(() => {
    isLoopingRef.current = isLoopingChords;
  }, [isLoopingChords]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((t) => clearTimeout(t));
      timeoutIdsRef.current = [];
    };
  }, []);

  // Compute transposed & AI-reharmonized output with optional Passing Chords instantly
  const result = useMemo(() => {
    return transposeAndReharmonizeSong(inputText, targetKeyIndex, level, enharmonic, {
      enablePassingChords,
      passingChordLevel: passingLevel,
    });
  }, [inputText, targetKeyIndex, level, enharmonic, enablePassingChords, passingLevel]);

  const currentKeyIdx = result.targetKeyIndex;
  const preferFlats =
    enharmonic === 'flat'
      ? true
      : enharmonic === 'sharp'
      ? false
      : KEY_OPTIONS[currentKeyIdx]?.preferFlats ?? false;

  // Currently displayed chord voicing in the Side Popup Box (defaults to first chord in song)
  const activePopupVoicing: SmoothChordVoicing | null = useMemo(() => {
    if (selectedVoicing) {
      // Keep synced if key/level changed and chord exists in uniqueChords
      const matched = result.uniqueChords.find((c) => c.symbol === selectedVoicing.symbol);
      if (matched) return matched;
      return selectedVoicing;
    }
    return result.uniqueChords[0] || null;
  }, [selectedVoicing, result.uniqueChords]);

  // Active inversion details based on whether user chose 'auto' (Smooth Voice-Leading) or manual override
  const activeInversionDetail = useMemo(() => {
    if (!activePopupVoicing) return null;
    if (inversionOverride === 'auto') return activePopupVoicing.activeInversion;
    return activePopupVoicing.inversions[inversionOverride];
  }, [activePopupVoicing, inversionOverride]);

  const stopSequencePlayback = () => {
    timeoutIdsRef.current.forEach((t) => clearTimeout(t));
    timeoutIdsRef.current = [];
    isPlayingRef.current = false;
    setIsPlayingSequence(false);
    setPlayingStepIdx(-1);
  };

  // Handle changing AI level with subtle audio & visual feedback
  const handleSelectLevel = (newLevel: ReharmonizeLevel) => {
    stopSequencePlayback();
    soundEngine.playClick(newLevel === 'pro' ? 920 : newLevel === 'intermediate' ? 780 : 640);
    setAiAnimating(true);
    setSetLevel(newLevel);
    setSelectedVoicing(null);
    setTimeout(() => setAiAnimating(false), 350);
  };

  // Transpose by semitone (-1 or +1)
  const handleSemitoneShift = (delta: number) => {
    stopSequencePlayback();
    soundEngine.playClick(delta > 0 ? 760 : 620);
    const nextKey = ((currentKeyIdx + delta) % 12 + 12) % 12;
    setTargetKeyIndex(nextKey);
    setSelectedVoicing(null);
  };

  // Play single chord when clicked in the song sheet, palette, or side popup
  const handleAuditionChord = (
    symbol: string,
    roman?: string,
    forcedInversion?: 'auto' | InversionType
  ) => {
    const cleanSymbol = symbol.replace(/^[([（]+|[)\]）]+$/g, '');
    const existing = result.uniqueChords.find((c) => c.symbol === cleanSymbol);
    const parsed = parseChordToken(cleanSymbol);
    const computedRoman =
      roman ||
      existing?.roman ||
      (parsed ? getRomanNumeral(parsed.rootIndex, parsed.quality, currentKeyIdx) : 'I');

    const smoothVoicing =
      existing || buildSmoothChordVoicing(cleanSymbol, computedRoman, currentKeyIdx, preferFlats);

    const modeToUse = forcedInversion !== undefined ? forcedInversion : inversionOverride;
    const invDetail =
      modeToUse === 'auto' ? smoothVoicing.activeInversion : smoothVoicing.inversions[modeToUse];

    soundEngine.playChord(invDetail.notes, 1.7, true);
    setSelectedVoicing(smoothVoicing);
    setIsSidePopupOpen(true);

    if (onSelectChordForPiano) {
      onSelectChordForPiano(
        cleanSymbol,
        cleanSymbol,
        invDetail.notes,
        `${computedRoman} • ${invDetail.inversionName} (${invDetail.figuredBass})`
      );
    }
  };

  // Play all unique chords in sequence using their Smooth Voice-Leading Inversions
  const handlePlayAllChords = () => {
    if (isPlayingSequence || result.uniqueChords.length === 0) {
      stopSequencePlayback();
      return;
    }

    stopSequencePlayback();
    soundEngine.playClick(800);
    isPlayingRef.current = true;
    setIsPlayingSequence(true);
    setIsSidePopupOpen(true);
    setInversionOverride('auto');

    const playCycle = () => {
      if (!isPlayingRef.current) return;
      const stepMs = 1150;

      result.uniqueChords.forEach((ch, idx) => {
        const t = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setPlayingStepIdx(idx);
          setSelectedVoicing(ch);
          soundEngine.playChord(ch.activeInversion.notes, 1.4, true);

          if (onSelectChordForPiano) {
            onSelectChordForPiano(
              ch.symbol,
              ch.symbol,
              ch.activeInversion.notes,
              `${ch.roman} • ${ch.activeInversion.inversionName} (${ch.activeInversion.figuredBass})`
            );
          }

          if (idx === result.uniqueChords.length - 1) {
            const endTimer = setTimeout(() => {
              if (!isPlayingRef.current) return;
              if (isLoopingRef.current) {
                playCycle();
              } else {
                stopSequencePlayback();
              }
            }, stepMs);
            timeoutIdsRef.current.push(endTimer);
          }
        }, idx * stepMs);

        timeoutIdsRef.current.push(t);
      });
    };

    playCycle();
  };

  const activeAuditionChord = activePopupVoicing
    ? {
        symbol: activePopupVoicing.symbol,
        notes: activeInversionDetail?.notes || activePopupVoicing.notes,
        roman: activePopupVoicing.roman,
        inversionName:
          activeInversionDetail?.inversionName || activePopupVoicing.activeInversion.inversionName,
        figuredBass:
          activeInversionDetail?.figuredBass || activePopupVoicing.activeInversion.figuredBass,
      }
    : null;

  // Audition 3-chord cadence for a passing chord transition (Chord A -> Passing Chord -> Chord B)
  const handlePlayCadence = (trans: PassingChordTransition) => {
    stopSequencePlayback();
    soundEngine.playClick(720);
    setPlayingCadenceId(trans.id);

    // Step 1: fromChord (0.75s)
    soundEngine.playChord(trans.cadenceNotes.from, 0.75, true);

    // Step 2: passingChord after 800ms
    const t1 = setTimeout(() => {
      soundEngine.playChord(trans.cadenceNotes.passing, 0.85, true);
      setSelectedVoicing(trans.voicing);
      setIsSidePopupOpen(true);
    }, 800);

    // Step 3: toChord after 1650ms
    const t2 = setTimeout(() => {
      soundEngine.playChord(trans.cadenceNotes.to, 1.4, true);
    }, 1650);

    const t3 = setTimeout(() => {
      setPlayingCadenceId(null);
    }, 3100);

    timeoutIdsRef.current.push(t1, t2, t3);
  };

  // Copy transposed lyrics + chords
  const handleCopy = async () => {
    soundEngine.playClick(840);
    try {
      await navigator.clipboard.writeText(result.transposedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore
    }
  };

  // Download as .txt lead sheet
  const handleDownloadTxt = () => {
    soundEngine.playClick(750);
    const passingSummary = enablePassingChords
      ? `Passing Chords Mode: ACTIVE (${passingLevel.toUpperCase()} Tier)\nPassing Transitions: ${
          result.passingTransitions.length > 0
            ? result.passingTransitions
                .map((t) => `${t.fromChord} -> [${t.passingChord}] -> ${t.toChord}`)
                .join(' | ')
            : 'None'
        }\n`
      : `Passing Chords Mode: OFF\n`;

    const header = [
      `==========================================================`,
      `MELOPHILE MUSIC ACADEMY — AI CHORD TRANSPOSER LEAD SHEET`,
      `Original Key: ${result.detectedKeyName} | Transposed Key: ${result.targetKeyName} (${
        result.semitoneShift >= 0 ? `+${result.semitoneShift}` : result.semitoneShift
      } semitones)`,
      `AI Harmonic Level: ${level.toUpperCase()}`,
      passingSummary,
      `Chords Used: ${result.uniqueChords.map((c) => `${c.symbol} (${c.notes.join('-')})`).join(' | ')}`,
      `==========================================================\n\n`,
    ].join('\n');

    const blob = new Blob([header + result.transposedText], {
      type: 'text/plain;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Melophile_LeadSheet_Key_${result.targetKeyName}_${level}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render interactive lines where every chord token is clickable to play audio
  const renderInteractiveSheet = () => {
    const lines = result.transposedText.split('\n');

    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();

      // Section headers like [Verse 1], [Chorus]
      if (/^\[(verse|chorus|bridge|intro|outro|pre-chorus|interlude|solo|hook|tag|inst)/i.test(trimmed)) {
        return (
          <div
            key={lineIdx}
            className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#9e7a4b] mt-4 mb-1 select-text"
          >
            {line}
          </div>
        );
      }

      // Check if line is a Chord-Over-Lyric line
      if (isChordLine(line)) {
        // Split preserving whitespace so alignment stays exact!
        const parts = line.split(/(\s+)/);
        return (
          <div key={lineIdx} className="whitespace-pre leading-relaxed font-mono text-xs sm:text-sm">
            {parts.map((part, pIdx) => {
              // Check if token is a passing chord marker e.g. [pass: G/B]
              const passMatch = part.match(/^\[pass(ing)?:\s*([^\]]+)\]$/i);
              if (passMatch) {
                const passSymbol = passMatch[2].trim();
                const isSelected = activeAuditionChord?.symbol === passSymbol;
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAuditionChord(passSymbol)}
                    title={`Passing Chord: ${passSymbol} (${passingLevel}) — Click to audition on piano`}
                    className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-105'
                        : 'bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300/80 hover:scale-105'
                    }`}
                  >
                    <span className="text-[9px] uppercase px-1 rounded-full bg-amber-500/25 text-amber-900 font-bold tracking-wider">
                      pass
                    </span>
                    <span>{passSymbol}</span>
                  </button>
                );
              }

              const stripped = part.replace(/^[([（]+|[)\]）]+$/g, '');
              if (parseChordToken(stripped)) {
                const isSelected = activeAuditionChord?.symbol === stripped;
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAuditionChord(stripped)}
                    title={`Click to hear ${stripped} on piano`}
                    className={`inline-block font-bold rounded px-1 -mx-0.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#141518] text-[#c5a880] shadow-xs scale-105'
                        : level === 'pro'
                        ? 'text-[#8a6839] bg-[#f4efe6] hover:bg-[#141518] hover:text-[#c5a880]'
                        : level === 'intermediate'
                        ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-800 hover:text-white'
                        : 'text-[#141518] bg-[#ede8e0]/80 hover:bg-[#141518] hover:text-white'
                    }`}
                  >
                    {part}
                  </button>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </div>
        );
      }

      // Check if line has inline bracketed chords like [C] Amazing [G] grace or [pass: G/B]
      if (/\[([A-G][#b]?[^\]]*|pass(?:ing)?:\s*[^\]]+)\]/i.test(line)) {
        const segments = line.split(/(\[[A-G][#b]?[^\]]*\]|\[pass(?:ing)?:\s*[^\]]+\])/gi);
        return (
          <div key={lineIdx} className="whitespace-pre-wrap leading-7 text-[#141518] text-xs sm:text-sm">
            {segments.map((seg, sIdx) => {
              if (seg.startsWith('[') && seg.endsWith(']')) {
                const inner = seg.slice(1, -1);
                const passMatch = inner.match(/^pass(ing)?:\s*(.+)$/i);
                if (passMatch) {
                  const passSymbol = passMatch[2].trim();
                  const isSelected = activeAuditionChord?.symbol === passSymbol;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAuditionChord(passSymbol)}
                      title={`Passing chord: ${passSymbol} (${passingLevel} level)`}
                      className={`inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-105'
                          : 'bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300/80 hover:scale-105'
                      }`}
                    >
                      <span className="text-[9px] uppercase px-1 rounded-full bg-amber-500/25 text-amber-900 font-bold tracking-wider">
                        pass
                      </span>
                      <span>{passSymbol}</span>
                    </button>
                  );
                }
                if (parseChordToken(inner)) {
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAuditionChord(inner)}
                      className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded-md bg-[#141518] text-[#c5a880] font-mono text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
                    >
                      {inner}
                    </button>
                  );
                }
              }
              return <span key={sIdx}>{seg}</span>;
            })}
          </div>
        );
      }

      // Normal lyric line
      return (
        <div
          key={lineIdx}
          className="whitespace-pre-wrap text-[#2b2d35] font-sans text-xs sm:text-sm leading-relaxed min-h-[1.25rem]"
        >
          {line || '\u00A0'}
        </div>
      );
    });
  };

  return (
    <section
      id="chord-transposer"
      className="mb-20 rounded-3xl bg-white border-2 border-[#d8ccb8] shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden"
    >
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#141518] via-[#1d1f24] to-[#141518] text-white border-b border-[#2b2d35]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#c5a880] text-[11px] font-mono uppercase tracking-widest mb-3">
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Studio Utility • Instant Key Transposer & Reharmonizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white tracking-tight">
              AI Song Chord Transposer &amp; 3-Level Arranger
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 max-w-2xl leading-relaxed">
              Paste any song lyrics with chords below to instantly transpose across all 12 keys and use AI harmonic voice-leading to transform chords into{' '}
              <strong className="text-[#c5a880]">Basic</strong>,{' '}
              <strong className="text-[#c5a880]">Intermediate</strong>, or{' '}
              <strong className="text-[#c5a880]">Pro Masterclass</strong> voicings.
            </p>
          </div>

          {/* Detected Key & Shift Summary */}
          <div className="flex items-center gap-3 self-start lg:self-center bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Original Key
              </div>
              <div className="text-xl font-bold font-serif text-white mt-0.5">
                {result.detectedKeyName}
              </div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#c5a880]">
                Target Key
              </div>
              <div className="text-xl font-bold font-serif text-[#c5a880] mt-0.5">
                {result.targetKeyName}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Transpose
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                {result.semitoneShift === 0
                  ? '0 ST'
                  : result.semitoneShift > 0
                  ? `+${result.semitoneShift} ST`
                  : `${result.semitoneShift} ST`}
              </div>
            </div>
          </div>
        </div>

        {/* CONTROL BAR 1: 12-Key Chromatic Selector & Semitone Stepper */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-300 font-semibold">
                1. Select Target Key (Instant Transpose):
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSemitoneShift(-1)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Transpose Down 1 Semitone (-1)"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>-1</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSemitoneShift(1)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Transpose Up 1 Semitone (+1)"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>+1</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(600);
                    setTargetKeyIndex(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset to Original Detected Key"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Original ({result.detectedKeyName})</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {KEY_OPTIONS.map((k) => {
                const isSelected = currentKeyIdx === k.index;
                const isOriginal = result.detectedKeyIndex === k.index;
                return (
                  <button
                    key={k.index}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(680 + k.index * 18);
                      setTargetKeyIndex(k.index);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#c5a880] text-[#141518] shadow-md scale-105 ring-2 ring-white/40'
                        : 'bg-white/10 text-stone-200 hover:bg-white/20'
                    }`}
                  >
                    <span>{k.label}</span>
                    {isOriginal && !isSelected && (
                      <span
                        className="block text-[8px] uppercase text-[#c5a880] leading-none mt-0.5"
                        title="Original Key"
                      >
                        orig
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enharmonic Spelling Toggle */}
          <div className="flex items-center gap-2 self-start xl:self-end">
            <span className="text-[11px] font-mono text-stone-400">Spelling:</span>
            {(['auto', 'sharp', 'flat'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  soundEngine.playClick(700);
                  setEnharmonic(mode);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize cursor-pointer transition-colors ${
                  enharmonic === mode
                    ? 'bg-white text-[#141518] font-bold'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
              >
                {mode === 'auto' ? 'Auto' : mode === 'sharp' ? 'Sharps (♯)' : 'Flats (♭)'}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROL BAR 2: 3-LEVEL AI HARMONIC ADVANCEMENT SELECTOR */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#c5a880] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. AI Harmonic Arrangement Level (Basic → Intermediate → Pro):</span>
            </span>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Click any level to reharmonize all chords in real time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* BASIC TIER */}
            <button
              type="button"
              onClick={() => handleSelectLevel('basic')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                level === 'basic'
                  ? 'bg-white text-[#141518] border-white shadow-lg scale-[1.01]'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  level === 'basic' ? 'bg-[#141518] text-white' : 'bg-white/10 text-stone-300'
                }`}
              >
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Level 1 • Basic
                  </span>
                  {level === 'basic' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839] text-[10px] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-1 leading-snug ${
                    level === 'basic' ? 'text-[#5c5f6a]' : 'text-stone-400'
                  }`}
                >
                  Clean Major &amp; Minor Triads (e.g. C, F, Am, G). Ideal for beginners &amp; clear rhythm strumming.
                </p>
              </div>
            </button>

            {/* INTERMEDIATE TIER */}
            <button
              type="button"
              onClick={() => handleSelectLevel('intermediate')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                level === 'intermediate'
                  ? 'bg-white text-[#141518] border-white shadow-lg scale-[1.01]'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  level === 'intermediate'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white/10 text-emerald-300'
                }`}
              >
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Level 2 • Intermediate
                  </span>
                  {level === 'intermediate' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-1 leading-snug ${
                    level === 'intermediate' ? 'text-[#5c5f6a]' : 'text-stone-400'
                  }`}
                >
                  AI upgrades to Maj7, m7, add9, 7sus4 &amp; 1st-inversion slash basslines (e.g. Cmaj7, Am7, G/B).
                </p>
              </div>
            </button>

            {/* PRO TIER */}
            <button
              type="button"
              onClick={() => handleSelectLevel('pro')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                level === 'pro'
                  ? 'bg-gradient-to-br from-[#f8f3ea] to-white text-[#141518] border-[#c5a880] shadow-lg scale-[1.01] ring-2 ring-[#c5a880]'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  level === 'pro'
                    ? 'bg-[#141518] text-[#c5a880]'
                    : 'bg-[#c5a880]/20 text-[#c5a880]'
                }`}
              >
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Level 3 • Pro AI Masterclass
                  </span>
                  {level === 'pro' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#141518] text-[#c5a880] text-[10px] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-1 leading-snug ${
                    level === 'pro' ? 'text-[#5c5f6a]' : 'text-stone-400'
                  }`}
                >
                  Jazz / Neo-Soul / Film voicings: Maj9, m11, Dominant 13, Secondary Dominants (7b9) &amp; Modal Interchange.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* CONTROL BAR 3: PASSING CHORDS ENGINE (ENABLE / DISABLE & 3 LEVELS) */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                <GitMerge className="w-3.5 h-3.5 text-amber-300" />
                <span>3. AI Passing Chords Engine (Between Consecutive Chords):</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                  enablePassingChords
                    ? 'bg-amber-400 text-[#141518] shadow-xs'
                    : 'bg-white/10 text-stone-400'
                }`}
              >
                {enablePassingChords ? 'Passing Chords: ACTIVE' : 'Passing Chords: OFF'}
              </span>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(enablePassingChords ? 520 : 880);
                  setEnablePassingChords((prev) => !prev);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  enablePassingChords
                    ? 'bg-amber-400 hover:bg-amber-300 text-[#141518] shadow-md ring-2 ring-amber-300/50'
                    : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/10'
                }`}
                title="Toggle Passing Chords ON/OFF"
              >
                {enablePassingChords ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-[#141518]" />
                    <span>Disable Passing Chords</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-stone-300" />
                    <span>Enable Passing Chords</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3-Level Passing Chords Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* LEVEL 1: BASIC PASSING */}
            <button
              type="button"
              disabled={!enablePassingChords}
              onClick={() => {
                soundEngine.playClick(620);
                setPassingLevel('basic');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                !enablePassingChords
                  ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-stone-400'
                  : passingLevel === 'basic'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10 cursor-pointer'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono ${
                  passingLevel === 'basic' && enablePassingChords
                    ? 'bg-amber-400 text-[#141518]'
                    : 'bg-white/10 text-stone-300'
                }`}
              >
                L1
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">Basic: Stepwise &amp; Slash Bass</span>
                  {passingLevel === 'basic' && enablePassingChords && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-[#141518] text-[9px] font-bold uppercase">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-tight">
                  Smooth stepwise bass lines &amp; 1st-inversions (e.g. C → <strong className="text-amber-300">G/B</strong> → Am, F → <strong className="text-amber-300">C/E</strong> → Dm, <strong className="text-amber-300">C#dim</strong>).
                </p>
              </div>
            </button>

            {/* LEVEL 2: INTERMEDIATE PASSING */}
            <button
              type="button"
              disabled={!enablePassingChords}
              onClick={() => {
                soundEngine.playClick(750);
                setPassingLevel('intermediate');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                !enablePassingChords
                  ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-stone-400'
                  : passingLevel === 'intermediate'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10 cursor-pointer'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono ${
                  passingLevel === 'intermediate' && enablePassingChords
                    ? 'bg-amber-400 text-[#141518]'
                    : 'bg-white/10 text-stone-300'
                }`}
              >
                L2
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">Intermediate: Secondary Dominants</span>
                  {passingLevel === 'intermediate' && enablePassingChords && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-[#141518] text-[9px] font-bold uppercase">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-tight">
                  Secondary V7/x &amp; diminished 7ths (e.g. C → <strong className="text-amber-300">A7</strong> → Dm, C → <strong className="text-amber-300">E7</strong> → Am, <strong className="text-amber-300">C#°7</strong>).
                </p>
              </div>
            </button>

            {/* LEVEL 3: ADVANCED PASSING */}
            <button
              type="button"
              disabled={!enablePassingChords}
              onClick={() => {
                soundEngine.playClick(890);
                setPassingLevel('advanced');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                !enablePassingChords
                  ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-stone-400'
                  : passingLevel === 'advanced'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10 cursor-pointer'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono ${
                  passingLevel === 'advanced' && enablePassingChords
                    ? 'bg-amber-400 text-[#141518]'
                    : 'bg-white/10 text-stone-300'
                }`}
              >
                L3
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">Advanced: Tritone Subs &amp; Neo-Soul</span>
                  {passingLevel === 'advanced' && enablePassingChords && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-[#141518] text-[9px] font-bold uppercase">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-tight">
                  subV7 chromatic slips, Altered 7#9 Hendrix chords &amp; gospel transitions (e.g. <strong className="text-amber-300">Eb7</strong> → Dm, <strong className="text-amber-300">Bb7</strong> → Am, <strong className="text-amber-300">E7#9</strong>).
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE: Left Input (Paste Lyrics/Chords) + Right Output (Interactive Transposed Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#eae6de]">
        {/* LEFT COLUMN: Input Lyrics & Chords (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-[#fcfbfa] flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <label
              htmlFor="song-sheet-input"
              className="text-xs font-bold uppercase tracking-wider text-[#141518] flex items-center gap-1.5"
            >
              <span>Paste Song Lyrics &amp; Chords</span>
            </label>

            {/* Sample Song Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#5c5f6a] uppercase font-semibold">Presets:</span>
              {SAMPLE_SONGS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(660);
                    setInputText(sample.sheet);
                    setTargetKeyIndex(null);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#f4efe6] hover:bg-[#e8dfd1] text-[#8a6839] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {sample.title.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="song-sheet-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={15}
            placeholder={`Paste your song lyrics with chords here...\n\nExample:\nC             G          Am         F\nAmazing grace how sweet the sound\n\nOr inline brackets:\n[C] Amazing grace how [F] sweet the [C] sound`}
            className="w-full flex-1 p-4 rounded-2xl bg-white border border-[#dcd7ce] text-[#141518] font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#9e7a4b] shadow-inner resize-y"
          />

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#5c5f6a]">
            <span>Supports Chords-over-Lyrics &amp; [Chord] formats</span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(550);
                setInputText('');
              }}
              className="text-[#8a6839] hover:underline font-medium cursor-pointer"
            >
              Clear Sheet
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Transposed & AI-Advanced Interactive Output (7 Cols) */}
        <div className="lg:col-span-7 p-6 bg-white flex flex-col">
          {/* Output Action Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap pb-3 border-b border-[#eae6de]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#141518] text-[#c5a880] text-xs font-mono font-bold">
                Key of {result.targetKeyName}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#f4efe6] text-[#8a6839] text-xs font-semibold capitalize">
                {level === 'pro'
                  ? '✦ Pro AI Reharmonized'
                  : level === 'intermediate'
                  ? '✦ Intermediate 7ths & Slash'
                  : 'Basic Triads'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePlayAllChords}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingSequence
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-[#f4efe6] hover:bg-[#e8dfd1] text-[#8a6839]'
                }`}
              >
                {isPlayingSequence ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop Chords</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Song Chords</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(740);
                  setIsSidePopupOpen((prev) => !prev);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSidePopupOpen
                    ? 'bg-[#141518] text-[#c5a880] border-[#141518]'
                    : 'bg-white hover:bg-[#faf8f5] text-[#141518] border-[#dcd7ce]'
                }`}
                title="Toggle Smooth Voice-Leading Inversion Side Popup"
              >
                <PanelRightOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Inversion Popup</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#faf8f5] border border-[#dcd7ce] text-[#141518] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#5c5f6a]" />
                    <span>Copy Sheet</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-1.5 rounded-full bg-[#141518] hover:bg-[#2b2d35] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Download .TXT</span>
              </button>
            </div>
          </div>

          {/* Active Clicked Chord Inspector Bar */}
          <div className="mb-4 px-4 py-2.5 rounded-2xl bg-[#faf8f5] border border-[#eae6de] flex items-center justify-between flex-wrap gap-2">
            {activeAuditionChord ? (
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-semibold text-[#5c5f6a]">Smooth Voicing:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#141518] text-[#c5a880] font-mono text-xs font-bold">
                  {activeAuditionChord.symbol}
                </span>
                {activeAuditionChord.roman && (
                  <span className="text-xs font-mono text-[#8a6839]">
                    ({activeAuditionChord.roman})
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold">
                  {activeAuditionChord.inversionName} ({activeAuditionChord.figuredBass})
                </span>
                <span className="text-xs font-mono text-[#141518]">
                  Notes: <strong>{activeAuditionChord.notes.join(' – ')}</strong>
                </span>
              </div>
            ) : (
              <div className="text-xs text-[#5c5f6a] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#9e7a4b]" />
                <span>
                  <strong>Tip:</strong> Click any highlighted chord in the lyrics below to hear its smooth piano inversion!
                </span>
              </div>
            )}

            {/* Quick Chord Palette Pills with Smooth Inversion Tag */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {result.uniqueChords.slice(0, 8).map((ch) => (
                <button
                  key={ch.symbol}
                  type="button"
                  onClick={() => handleAuditionChord(ch.symbol, ch.roman)}
                  className={`px-2 py-0.5 rounded-md border font-mono text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeAuditionChord?.symbol === ch.symbol
                      ? 'bg-[#141518] text-[#c5a880] border-[#141518]'
                      : 'bg-white hover:bg-[#141518] text-[#141518] hover:text-[#c5a880] border-[#dcd7ce]'
                  }`}
                  title={`${ch.symbol} — ${ch.activeInversion.inversionName} (${ch.activeInversion.figuredBass})`}
                >
                  <span>{ch.symbol}</span>
                  <span className="text-[9px] opacity-75">
                    {ch.activeInversion.type === 'first'
                      ? '1st'
                      : ch.activeInversion.type === 'second'
                      ? '2nd'
                      : 'Root'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Rendered Song Sheet */}
          <div
            className={`flex-1 p-5 rounded-2xl bg-[#fcfbfa] border border-[#eae6de] overflow-x-auto max-h-[420px] overflow-y-auto transition-opacity duration-200 ${
              aiAnimating ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {inputText.trim() ? (
              renderInteractiveSheet()
            ) : (
              <div className="text-center py-16 text-xs text-[#5c5f6a]">
                Paste your song lyrics and chords on the left, or choose one of the presets above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DEDICATED PASSING CHORDS SECTION: 3 LEVELS & AUDIO AUDITION          */}
      {/* ===================================================================== */}
      <div id="passing-chords-studio" className="p-6 sm:p-8 bg-gradient-to-br from-[#fcfbfa] via-[#faf6ef] to-[#f7f2e7] border-t-2 border-[#e6dfd3]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[11px] font-mono uppercase tracking-wider font-bold mb-2">
              <GitMerge className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Harmonic Bridge • Passing Chords Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#141518] font-normal tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>Song Passing Chords Studio</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#141518] text-[#c5a880]">
                Key of {result.targetKeyName}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  enablePassingChords
                    ? 'bg-amber-400 text-stone-900 ring-2 ring-amber-300'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {enablePassingChords
                  ? `Active • ${passingLevel.toUpperCase()} Tier`
                  : 'Disabled (Click Toggle to Enable)'}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5f6a] mt-1 max-w-2xl leading-relaxed">
              Passing chords create harmonic tension and irresistible forward momentum between consecutive chords in your song. Discover smooth stepwise bass walkdowns, secondary dominants (V7/x), and neo-soul tritone substitutions.
            </p>
          </div>

          {/* Toggle Button in Section */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(enablePassingChords ? 520 : 880);
                setEnablePassingChords((prev) => !prev);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                enablePassingChords
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-[#141518] hover:bg-[#2b2d35] text-[#c5a880]'
              }`}
            >
              {enablePassingChords ? (
                <>
                  <ToggleRight className="w-4 h-4 text-white" />
                  <span>Disable Passing Chords</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-[#c5a880]" />
                  <span>Enable Passing Chords</span>
                </>
              )}
            </button>
          </div>
        </div>

        {!enablePassingChords ? (
          /* DISABLED STATE BANNER */
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border-2 border-dashed border-amber-300/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-700">
                <GitMerge className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#141518]">
                  Passing Chords are currently Disabled
                </h4>
                <p className="text-xs text-[#5c5f6a] mt-1 max-w-xl leading-relaxed">
                  Toggle Passing Chords ON to automatically inject transitional chords between consecutive chords in your song sheet, preview 3-chord cadences on piano, and explore Basic, Intermediate, and Advanced harmonic tiers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(880);
                setEnablePassingChords(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#141518] hover:bg-[#2b2d35] text-[#c5a880] text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md hover:scale-105 cursor-pointer shrink-0"
            >
              Enable Passing Chords (1-Click)
            </button>
          </div>
        ) : (
          /* ENABLED STATE: Active Passing Chords Breakdown + Level Switcher + Cadence Audition */
          <div className="space-y-6">
            {/* Level Quick Switcher */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-white/80 p-2.5 rounded-2xl border border-[#e6dfd3]">
              <span className="text-xs font-mono font-bold text-[#141518] px-2 flex items-center gap-1.5">
                <span>Select Passing Complexity:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['basic', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(lvl === 'advanced' ? 880 : lvl === 'intermediate' ? 760 : 640);
                      setPassingLevel(lvl);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                      passingLevel === lvl
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    Level {lvl === 'basic' ? '1: Basic' : lvl === 'intermediate' ? '2: Intermediate' : '3: Advanced'}
                  </button>
                ))}
              </div>
            </div>

            {/* Song Specific Consecutive Transitions Cards */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#141518] flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-600 fill-current" />
                  <span>Consecutive Chord Transitions in Your Song ({result.passingTransitions.length}):</span>
                </span>
                <span className="text-[11px] text-[#5c5f6a]">
                  Click &quot;Play Cadence&quot; to hear Chord 1 → Passing Chord → Chord 2
                </span>
              </div>

              {result.passingTransitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {result.passingTransitions.map((trans) => {
                    const isCadencePlaying = playingCadenceId === trans.id;
                    return (
                      <div
                        key={trans.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCadencePlaying
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-md'
                            : 'bg-white hover:bg-[#fffdfa] border-[#e6dfd3] hover:border-amber-300 shadow-2xs'
                        }`}
                      >
                        {/* Header: Chord A -> [PASSING] -> Chord B */}
                        <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-[#141518]">
                              {trans.fromChord}
                            </span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-white shadow-2xs font-extrabold ring-1 ring-amber-400">
                              {trans.passingChord}
                            </span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-[#141518]">
                              {trans.toChord}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            {trans.roman}
                          </span>
                        </div>

                        {/* Category & Inversion details */}
                        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-[#5c5f6a]">
                          <span className="font-semibold text-amber-800">
                            {trans.typeLabel}
                          </span>
                          <span>
                            {trans.voicing.activeInversion.inversionName} ({trans.voicing.activeInversion.figuredBass})
                          </span>
                        </div>

                        {/* Theory Explanation */}
                        <p className="text-xs text-[#5c5f6a] leading-relaxed mb-3 bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ece3]">
                          {trans.theoryExplanation}
                        </p>

                        {/* Bottom Actions: Play Cadence & Inspect on Piano */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f0ece3]">
                          <button
                            type="button"
                            onClick={() => handlePlayCadence(trans)}
                            disabled={isCadencePlaying}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                              isCadencePlaying
                                ? 'bg-amber-600 text-white animate-pulse'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                            }`}
                            title="Play Chord A -> Passing Chord -> Chord B in smooth tempo"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isCadencePlaying ? 'Auditioning...' : 'Play Cadence'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVoicing(trans.voicing);
                              setIsSidePopupOpen(true);
                              soundEngine.playChord(trans.voicing.notes, 1.6, true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#141518] text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Inspect in Smooth Voice-Leading Side Popup"
                          >
                            <Volume2 className="w-3 h-3 text-amber-700" />
                            <span>Piano Voicing</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-[#e6dfd3] text-center text-xs text-[#5c5f6a]">
                  Enter lyrics and chords with at least two different chords to generate contextual passing chord transitions.
                </div>
              )}
            </div>

            {/* Key Scale Degree Passing Chords Master Reference (all 6 primary degrees in current key) */}
            <div className="mt-6 pt-5 border-t border-[#e6dfd3]">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#141518] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#9e7a4b]" />
                  <span>Key of {result.targetKeyName} Passing Chords Master Reference (3 Levels):</span>
                </span>
                <span className="text-[11px] text-[#5c5f6a]">
                  Click any passing chord badge below to audition it on piano
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.degreeReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-[#e6dfd3] shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0ece3]">
                      <span className="font-mono text-xs font-bold text-[#141518]">
                        Approach {ref.degreeLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#141518] text-[#c5a880] font-mono text-[11px] font-bold">
                        Target: {ref.targetChord}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      {/* Basic */}
                      <div className="flex items-center justify-between gap-1 p-1.5 rounded-lg bg-stone-50 hover:bg-amber-50/60 transition-colors">
                        <span className="text-[10px] font-semibold text-stone-500 uppercase">
                          Basic:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAuditionChord(ref.basic.chord)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-amber-500 hover:text-white border border-stone-200 text-stone-900 font-bold transition-all cursor-pointer shadow-2xs"
                          title={`${ref.basic.type}: ${ref.basic.explanation}`}
                        >
                          {ref.basic.chord}
                        </button>
                      </div>

                      {/* Intermediate */}
                      <div className="flex items-center justify-between gap-1 p-1.5 rounded-lg bg-stone-50 hover:bg-emerald-700 hover:text-white transition-colors group">
                        <span className="text-[10px] font-semibold text-emerald-700 group-hover:text-white uppercase">
                          Inter:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAuditionChord(ref.intermediate.chord)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-emerald-700 hover:text-white border border-emerald-300 text-emerald-900 font-bold transition-all cursor-pointer shadow-2xs"
                          title={`${ref.intermediate.type}: ${ref.intermediate.explanation}`}
                        >
                          {ref.intermediate.chord}
                        </button>
                      </div>

                      {/* Advanced */}
                      <div className="flex items-center justify-between gap-1 p-1.5 rounded-lg bg-stone-50 hover:bg-[#141518] hover:text-[#c5a880] transition-colors group">
                        <span className="text-[10px] font-semibold text-amber-700 group-hover:text-[#c5a880] uppercase">
                          Adv:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAuditionChord(ref.advanced.chord)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#141518] hover:text-[#c5a880] border border-amber-300 text-amber-950 font-bold transition-all cursor-pointer shadow-2xs"
                          title={`${ref.advanced.type}: ${ref.advanced.explanation}`}
                        >
                          {ref.advanced.chord}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM PANEL: AI Harmonic Reharmonization Breakdown & Theory Insights */}
      {result.aiInsights.length > 0 && (
        <div className="p-6 bg-[#faf8f5] border-t border-[#eae6de]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9e7a4b]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#141518]">
                AI Harmonic Voice-Leading Insights ({level.toUpperCase()} Tier — Key of {result.targetKeyName})
              </h3>
            </div>
            <span className="text-xs text-[#5c5f6a]">
              Click any card to audition the upgraded chord voicing &amp; smooth inversion on piano
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {result.aiInsights.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleAuditionChord(item.toChord, item.romanFunction)}
                className="p-3.5 rounded-2xl bg-white border border-[#eae6de] hover:border-[#9e7a4b] shadow-2xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                    <span className="text-[#5c5f6a]">{item.fromChord}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#9e7a4b]" />
                    <span className="px-2 py-0.5 rounded bg-[#141518] text-[#c5a880]">
                      {item.toChord}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#f4efe6] text-[#8a6839]">
                    {item.romanFunction}
                  </span>
                </div>

                {item.inversionName && (
                  <div className="mb-1.5">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">
                      Smooth Voicing: {item.inversionName} ({item.figuredBass})
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-[#5c5f6a] leading-snug mb-2">
                  {item.reason}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#f0ece3] text-[10px] font-mono text-[#8a6839]">
                  <span>Notes: {item.notes.join(' - ')}</span>
                  <Volume2 className="w-3.5 h-3.5 text-[#9e7a4b] group-hover:scale-110 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FLOATING SIDE POPUP BOX: SMOOTH VOICE-LEADING & INVERSION INSPECTOR  */}
      {/* ===================================================================== */}
      {!isSidePopupOpen && activePopupVoicing && (
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick(740);
            setIsSidePopupOpen(true);
          }}
          className="fixed right-4 bottom-24 z-50 px-4 py-3 rounded-2xl bg-[#141518] text-white border-2 border-[#c5a880] shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer"
          title="Open Smooth Sound Inversion Side Popup"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#c5a880]">
              Smooth Inversion Popup
            </div>
            <div className="text-xs font-bold font-mono">
              {activePopupVoicing.symbol} • {activePopupVoicing.activeInversion.inversionName}
            </div>
          </div>
        </button>
      )}

      {isSidePopupOpen && activePopupVoicing && activeInversionDetail && (
        <aside
          id="transposer-inversion-side-popup"
          aria-label="Smooth Voice-Leading Inversion Side Popup"
          className="fixed right-3 sm:right-5 top-20 sm:top-22 z-50 w-[330px] sm:w-[375px] max-h-[calc(100vh-11rem)] overflow-y-auto rounded-3xl bg-[#141518]/95 backdrop-blur-xl text-white border-2 border-[#c5a880]/70 shadow-[0_24px_70px_rgba(0,0,0,0.65)] p-4 sm:p-5 transition-all duration-300"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlayingSequence ? 'bg-emerald-400 animate-ping' : 'bg-[#c5a880]'
                }`}
              />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#c5a880] font-bold">
                  Smooth Sound Inversion Popup
                </div>
                <div className="text-[11px] text-stone-400">
                  Key of {result.targetKeyName} •{' '}
                  {playingStepIdx >= 0
                    ? `Playing Chord ${playingStepIdx + 1} of ${result.uniqueChords.length}`
                    : `${result.uniqueChords.length} Song Chords`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsLoopingChords((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isLoopingChords
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/10 text-stone-400 hover:text-white'
                }`}
                title="Toggle Loop Mode for Smooth Song Chords"
              >
                <Repeat className="w-3 h-3" />
                <span>Loop {isLoopingChords ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSidePopupOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Side Popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Chord & Active Inversion Hero Box */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Now Playing Chord
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-serif font-bold text-white">
                    {activePopupVoicing.symbol}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[#c5a880] font-mono text-xs font-bold">
                    {activePopupVoicing.roman}
                  </span>
                </div>
              </div>

              {/* Prominent Inversion Badge */}
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block mb-1">
                  {inversionOverride === 'auto' ? '✦ Smoothest Inversion' : 'Manual Inversion'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    activeInversionDetail.type === 'first'
                      ? 'bg-emerald-400 text-[#141518]'
                      : activeInversionDetail.type === 'second'
                      ? 'bg-amber-300 text-[#141518]'
                      : 'bg-[#c5a880] text-[#141518]'
                  }`}
                >
                  <span>{activeInversionDetail.inversionName}</span>
                  <span>({activeInversionDetail.figuredBass})</span>
                </span>
              </div>
            </div>

            {/* Interactive 4-Way Inversion Selector inside Side Popup */}
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                Compare / Switch Inversion:
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(
                  [
                    { id: 'auto', label: '✦ Smooth' },
                    { id: 'root', label: 'Root (5/3)' },
                    { id: 'first', label: '1st Inv (6)' },
                    { id: 'second', label: '2nd (6/4)' },
                  ] as const
                ).map((tab) => {
                  const isActive = inversionOverride === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setInversionOverride(tab.id);
                        handleAuditionChord(
                          activePopupVoicing.symbol,
                          activePopupVoicing.roman,
                          tab.id
                        );
                      }}
                      className={`px-1.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#c5a880] text-[#141518] shadow-xs'
                          : 'bg-white/10 text-stone-300 hover:bg-white/20'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live 2-Octave Mini Piano Keyboard showing the exact inverted keys */}
          <div className="mb-3 p-3 rounded-2xl bg-[#1d1f26] border border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-2">
              <span>LIVE PIANO VOICING (C4 – B5)</span>
              <span className="text-[#c5a880] font-bold">
                Bass: {activeInversionDetail.bassNote}
              </span>
            </div>

            <div className="relative h-20 w-full select-none rounded-lg overflow-hidden border border-black/60 bg-[#111]">
              {/* White Keys */}
              <div className="flex h-full w-full">
                {WHITE_KEYS_2OCT.map((wk) => {
                  const isBass = activeInversionDetail.notes[0] === wk;
                  const isNoteActive = activeInversionDetail.notes.includes(wk);
                  return (
                    <div
                      key={wk}
                      onClick={() => soundEngine.playChord([wk], 1.1, false)}
                      className={`flex-1 relative border-r border-stone-300 last:border-r-0 flex flex-col justify-end items-center pb-1 cursor-pointer transition-colors ${
                        isBass
                          ? 'bg-[#c5a880] text-[#141518]'
                          : isNoteActive
                          ? 'bg-emerald-300 text-[#141518]'
                          : 'bg-[#fdfcfa] hover:bg-stone-200 text-stone-500'
                      }`}
                    >
                      <span className="text-[8px] font-mono font-bold leading-none">
                        {wk.replace(/[45]/, '')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Black Keys */}
              {BLACK_KEYS_2OCT.map((bk) => {
                const isBass =
                  activeInversionDetail.notes[0] === bk.note ||
                  activeInversionDetail.notes[0] === bk.flats;
                const isNoteActive =
                  activeInversionDetail.notes.includes(bk.note) ||
                  activeInversionDetail.notes.includes(bk.flats);
                return (
                  <div
                    key={bk.note}
                    onClick={() => soundEngine.playChord([bk.note], 1.1, false)}
                    style={{ left: `${bk.leftPercent}%` }}
                    className={`absolute top-0 w-[5.2%] h-[60%] rounded-b-md border border-black z-10 flex items-end justify-center pb-1 cursor-pointer transition-colors ${
                      isBass
                        ? 'bg-[#c5a880] text-[#141518] shadow-md'
                        : isNoteActive
                        ? 'bg-emerald-400 text-[#141518] shadow-md'
                        : 'bg-[#1a1b1f] hover:bg-stone-700 text-stone-400'
                    }`}
                  >
                    {isNoteActive && (
                      <span className="text-[7px] font-mono font-bold leading-none">
                        {preferFlats ? bk.flats.replace(/[45]/, '') : bk.note.replace(/[45]/, '')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Voiced Notes & Bass Role */}
            <div className="mt-2.5 flex items-center justify-between flex-wrap gap-1.5 text-[11px] font-mono">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-stone-400">Notes:</span>
                {activeInversionDetail.notes.map((n, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      i === 0
                        ? 'bg-[#c5a880] text-[#141518]'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-stone-400">
                Formula: <strong className="text-white">{activeInversionDetail.formula}</strong>
              </span>
            </div>

            {/* Why this inversion gives the smoothest sound */}
            <p className="mt-2 text-[11px] text-stone-300 leading-snug bg-white/5 p-2 rounded-xl border border-white/5">
              <strong className="text-[#c5a880]">Why it sounds smooth: </strong>
              {activePopupVoicing.smoothReason}
            </p>
          </div>

          {/* All Song Chords & Their Smooth Inversions List */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
              <span>Song Chords &amp; Smooth Inversions</span>
              <span>Click to Play</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {result.uniqueChords.map((ch, idx) => {
                const isCurrent = activePopupVoicing.symbol === ch.symbol;
                return (
                  <button
                    key={ch.symbol}
                    type="button"
                    onClick={() => {
                      setInversionOverride('auto');
                      handleAuditionChord(ch.symbol, ch.roman, 'auto');
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#c5a880]/20 border-[#c5a880] text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center text-stone-300">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-mono text-xs font-bold text-white">
                          {ch.symbol}
                        </span>
                        <span className="text-[10px] font-mono text-[#c5a880] ml-1.5">
                          ({ch.roman})
                        </span>
                        <div className="text-[10px] font-mono text-stone-400">
                          {ch.activeInversion.notes.join(' – ')}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        ch.activeInversion.type === 'first'
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                          : ch.activeInversion.type === 'second'
                          ? 'bg-amber-300/20 text-amber-200 border border-amber-300/30'
                          : 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30'
                      }`}
                    >
                      {ch.activeInversion.inversionName} ({ch.activeInversion.figuredBass})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls inside Side Popup */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handlePlayAllChords}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isPlayingSequence
                  ? 'bg-rose-500 text-white'
                  : 'bg-[#c5a880] hover:bg-[#d4b991] text-[#141518] font-bold'
              }`}
            >
              {isPlayingSequence ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Sequence</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Smooth Sequence</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => soundEngine.playChord(activeInversionDetail.notes, 1.6, true)}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Replay</span>
            </button>
          </div>
        </aside>
      )}
    </section>
  );
};
