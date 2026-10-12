import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import {
  ReharmonizeLevel,
  KEY_OPTIONS,
  SAMPLE_SONGS,
  transposeAndReharmonizeSong,
  parseChordToken,
  chordSymbolToNotes,
  isChordLine,
} from '../../utils/chordTransposerEngine';

interface ChordTransposerToolProps {
  onSelectChordForPiano?: (chordName: string, symbol: string, notes: string[], formula: string) => void;
}

export const ChordTransposerTool: React.FC<ChordTransposerToolProps> = ({
  onSelectChordForPiano,
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_SONGS[0].sheet);
  const [targetKeyIndex, setTargetKeyIndex] = useState<number | null>(null);
  const [level, setSetLevel] = useState<ReharmonizeLevel>('basic');
  const [enharmonic, setEnharmonic] = useState<'auto' | 'sharp' | 'flat'>('auto');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAuditionChord, setActiveAuditionChord] = useState<{
    symbol: string;
    notes: string[];
    roman?: string;
  } | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [aiAnimating, setAiAnimating] = useState<boolean>(false);

  // Compute transposed & AI-reharmonized output instantly
  const result = useMemo(() => {
    return transposeAndReharmonizeSong(inputText, targetKeyIndex, level, enharmonic);
  }, [inputText, targetKeyIndex, level, enharmonic]);

  const currentKeyIdx = result.targetKeyIndex;

  // Handle changing AI level with subtle audio & visual feedback
  const handleSelectLevel = (newLevel: ReharmonizeLevel) => {
    soundEngine.playClick(newLevel === 'pro' ? 920 : newLevel === 'intermediate' ? 780 : 640);
    setAiAnimating(true);
    setSetLevel(newLevel);
    setTimeout(() => setAiAnimating(false), 350);
  };

  // Transpose by semitone (-1 or +1)
  const handleSemitoneShift = (delta: number) => {
    soundEngine.playClick(delta > 0 ? 760 : 620);
    const nextKey = ((currentKeyIdx + delta) % 12 + 12) % 12;
    setTargetKeyIndex(nextKey);
  };

  // Play single chord when clicked in the song sheet or palette
  const handleAuditionChord = (symbol: string, roman?: string) => {
    const cleanSymbol = symbol.replace(/^[([（]+|[)\]）]+$/g, '');
    const notes = chordSymbolToNotes(cleanSymbol);
    soundEngine.playChord(notes, 1.7, true);
    setActiveAuditionChord({ symbol: cleanSymbol, notes, roman });

    if (onSelectChordForPiano) {
      onSelectChordForPiano(cleanSymbol, cleanSymbol, notes, roman || 'AI Voicing');
    }
  };

  // Play all unique chords in sequence
  const handlePlayAllChords = () => {
    if (isPlayingSequence || result.uniqueChords.length === 0) {
      setIsPlayingSequence(false);
      return;
    }
    soundEngine.playClick(800);
    setIsPlayingSequence(true);

    result.uniqueChords.forEach((ch, idx) => {
      setTimeout(() => {
        soundEngine.playChord(ch.notes, 1.3, true);
        setActiveAuditionChord({ symbol: ch.symbol, notes: ch.notes, roman: ch.roman });
        if (onSelectChordForPiano) {
          onSelectChordForPiano(ch.symbol, ch.symbol, ch.notes, ch.roman);
        }
        if (idx === result.uniqueChords.length - 1) {
          setTimeout(() => setIsPlayingSequence(false), 1100);
        }
      }, idx * 1000);
    });
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
    const header = [
      `==========================================================`,
      `MELOPHILE MUSIC ACADEMY — AI CHORD TRANSPOSER LEAD SHEET`,
      `Original Key: ${result.detectedKeyName} | Transposed Key: ${result.targetKeyName} (${
        result.semitoneShift >= 0 ? `+${result.semitoneShift}` : result.semitoneShift
      } semitones)`,
      `AI Harmonic Level: ${level.toUpperCase()}`,
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

      // Check if line has inline bracketed chords like [C] Amazing [G] grace
      if (/\[([A-G][#b]?[^\]]*)\]/.test(line)) {
        const segments = line.split(/(\[[A-G][#b]?[^\]]*\])/g);
        return (
          <div key={lineIdx} className="whitespace-pre-wrap leading-7 text-[#141518] text-xs sm:text-sm">
            {segments.map((seg, sIdx) => {
              if (seg.startsWith('[') && seg.endsWith(']')) {
                const inner = seg.slice(1, -1);
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
                    <span>Playing Chords...</span>
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
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-[#5c5f6a]">Active Voicing:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#141518] text-[#c5a880] font-mono text-xs font-bold">
                  {activeAuditionChord.symbol}
                </span>
                {activeAuditionChord.roman && (
                  <span className="text-xs font-mono text-[#8a6839]">
                    ({activeAuditionChord.roman})
                  </span>
                )}
                <span className="text-xs font-mono text-[#141518]">
                  Notes: <strong>{activeAuditionChord.notes.join(' – ')}</strong>
                </span>
              </div>
            ) : (
              <div className="text-xs text-[#5c5f6a] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#9e7a4b]" />
                <span>
                  <strong>Tip:</strong> Click any highlighted chord in the lyrics below to hear its exact piano voicing!
                </span>
              </div>
            )}

            {/* Quick Chord Palette Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {result.uniqueChords.slice(0, 8).map((ch) => (
                <button
                  key={ch.symbol}
                  type="button"
                  onClick={() => handleAuditionChord(ch.symbol, ch.roman)}
                  className="px-2 py-0.5 rounded-md bg-white hover:bg-[#141518] text-[#141518] hover:text-[#c5a880] border border-[#dcd7ce] font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {ch.symbol}
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
              Click any card to audition the upgraded chord voicing on piano
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
    </section>
  );
};
