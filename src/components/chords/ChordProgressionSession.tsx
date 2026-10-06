import React, { useState, useRef, useEffect } from 'react';
import {
  MUSICAL_KEYS,
  MusicalKey,
  ResolvedProgression,
  TransposedChord,
  getTransposedProgressions,
} from '../../utils/chordTransposer';
import { soundEngine } from '../../utils/audioSynth';
import {
  Play,
  Square,
  Lock,
  Crown,
  ChevronRight,
  Sparkles,
  Repeat,
  Volume2,
  Info,
  CheckCircle,
  Music2,
  Layers,
  X,
  VolumeX,
} from 'lucide-react';

interface ChordProgressionSessionProps {
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
  isProUnlocked: boolean;
  onOpenSubscription: () => void;
  onDemoUnlock: () => void;
}

interface ActiveInversionPopupData {
  chord: TransposedChord;
  progTitle: string;
  stepIndex: number;
  totalSteps: number;
}

export const ChordProgressionSession: React.FC<ChordProgressionSessionProps> = ({
  onSelectChord,
  isProUnlocked,
  onOpenSubscription,
  onDemoUnlock,
}) => {
  // Selected Key (defaults to C Major)
  const [activeKey, setActiveKey] = useState<MusicalKey>(MUSICAL_KEYS[0]);
  // Level filter ('all' | 'basic' | 'intermediate' | 'advanced')
  const [levelFilter, setLevelFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  
  // Playback & Loop Mode state
  const [activeProgId, setActiveProgId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isLoopMode, setIsLoopMode] = useState<boolean>(true);
  const [showTheoryId, setShowTheoryId] = useState<string | null>(null);

  // Active Inversion Popup / HUD state
  const [inversionPopupData, setInversionPopupData] = useState<ActiveInversionPopupData | null>(null);

  // Refs for robust loop timeout management
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isLoopModeRef = useRef<boolean>(true);
  const activeProgIdRef = useRef<string | null>(null);

  useEffect(() => {
    isLoopModeRef.current = isLoopMode;
  }, [isLoopMode]);

  useEffect(() => {
    activeProgIdRef.current = activeProgId;
  }, [activeProgId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((t) => clearTimeout(t));
      timeoutIdsRef.current = [];
    };
  }, []);

  // Compute transposed progressions for the currently selected key
  const progressions = React.useMemo(() => {
    return getTransposedProgressions(activeKey);
  }, [activeKey]);

  // Filtered by selected level
  const displayedProgressions = React.useMemo(() => {
    if (levelFilter === 'all') return progressions;
    return progressions.filter((p) => p.level === levelFilter);
  }, [progressions, levelFilter]);

  // Count items per category
  const basicCount = progressions.filter((p) => p.level === 'basic').length;
  const interCount = progressions.filter((p) => p.level === 'intermediate').length;
  const advCount = progressions.filter((p) => p.level === 'advanced').length;

  // Stop current playback and clear all loop timers
  const stopPlayback = () => {
    timeoutIdsRef.current.forEach((t) => clearTimeout(t));
    timeoutIdsRef.current = [];
    setActiveProgId(null);
    setActiveStepIndex(-1);
  };

  // Single chord click handler (also triggers the inversion popup!)
  const handleChordClick = (
    chord: TransposedChord,
    prog: ResolvedProgression,
    stepIndex: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (prog.isPro && !isProUnlocked) {
      onOpenSubscription();
      return;
    }

    soundEngine.playChord(chord.notes, 1.6, true);
    setActiveStepIndex(stepIndex);

    // Show Inversion Popup HUD for this chord
    setInversionPopupData({
      chord,
      progTitle: prog.title,
      stepIndex,
      totalSteps: prog.chords.length,
    });

    onSelectChord({
      id: `prog-${chord.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: chord.name,
      symbol: chord.symbol,
      formula: chord.formula,
      notes: chord.notes,
      vibe: chord.vibe,
      description: `${chord.description} (Inversion: ${chord.inversionName})`,
      voicingTip: chord.voiceLeadingReason,
    });
  };

  // Continuous loop progression player
  const startProgressionPlayback = (prog: ResolvedProgression) => {
    stopPlayback();
    soundEngine.playClick(720);
    setActiveProgId(prog.id);

    const playCycle = () => {
      if (activeProgIdRef.current !== prog.id) return;

      const stepDuration = 1250; // 1.25s per chord for smooth listening

      prog.chords.forEach((chord, idx) => {
        const timeout = setTimeout(() => {
          if (activeProgIdRef.current !== prog.id) return;

          setActiveStepIndex(idx);
          soundEngine.playChord(chord.notes, 1.4, true);

          // Update the live Inversion Popup HUD on each step
          setInversionPopupData({
            chord,
            progTitle: prog.title,
            stepIndex: idx,
            totalSteps: prog.chords.length,
          });

          // Sync with parent viewer and 2-octave piano
          onSelectChord({
            id: `prog-step-${idx}`,
            name: chord.name,
            symbol: chord.symbol,
            formula: chord.formula,
            notes: chord.notes,
            vibe: chord.vibe,
            description: `${chord.name} in ${activeKey.name} • ${chord.inversionName} (${chord.figuredBass})`,
            voicingTip: chord.voiceLeadingReason,
          });

          // Check if at the end of the progression
          if (idx === prog.chords.length - 1) {
            const nextCycleTimeout = setTimeout(() => {
              if (activeProgIdRef.current !== prog.id) return;

              if (isLoopModeRef.current) {
                // Loop mode enabled: loop back to beginning seamlessly!
                playCycle();
              } else {
                // Single run: finish playback
                stopPlayback();
              }
            }, stepDuration);
            timeoutIdsRef.current.push(nextCycleTimeout);
          }
        }, idx * stepDuration);

        timeoutIdsRef.current.push(timeout);
      });
    };

    playCycle();
  };

  const handlePlayOrStop = (prog: ResolvedProgression, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (prog.isPro && !isProUnlocked) {
      onOpenSubscription();
      return;
    }

    if (activeProgId === prog.id) {
      stopPlayback();
    } else {
      startProgressionPlayback(prog);
    }
  };

  return (
    <section id="chord-progressions-session" className="scroll-mt-28 my-10 relative">
      {/* Container Card */}
      <div className="relative rounded-3xl bg-white border border-[#eae6de] p-6 sm:p-8 lg:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Subtle decorative gradient glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#9e7a4b]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] border border-[#e5dcce] text-xs font-semibold uppercase tracking-wider text-[#8a6839] mb-3">
            <Repeat className="w-3.5 h-3.5 text-[#9e7a4b]" />
            <span>Harmonic Progression Session • All 12 Keys</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#141518] tracking-tight mb-3">
            Chord Progressions for Every Key
          </h2>
          <p className="text-[#5c5f6a] text-sm sm:text-base leading-relaxed">
            Select any key below to transpose the progression library instantly.
            Progressions feature <strong>real piano keyboard inversions</strong> with live popup tracking and <strong>continuous loop mode</strong> for hands-free piano practice.
          </p>
        </div>

        {/* =========================================================================
            KEY SELECTOR SEGMENTED ROW (ALL 12 CHROMATIC KEYS)
        ========================================================================= */}
        <div className="relative z-10 mb-8 p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-[#eae6de] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8a6839] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9e7a4b]" />
              Select Musical Key (Transposes All Progressions):
            </span>
            <div className="text-[11px] font-mono text-stone-500 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white border border-[#eae6de] font-bold text-[#141518]">
                {activeKey.name}
              </span>
              <span>•</span>
              <span>{activeKey.relativeMinor}</span>
              <span>•</span>
              <span className="hidden md:inline">{activeKey.keySignature}</span>
            </div>
          </div>

          {/* 12 Keys Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {MUSICAL_KEYS.map((k) => {
              const isSelected = activeKey.id === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(650);
                    setActiveKey(k);
                    // Play root tonic chord as acoustic feedback
                    const tonicNotes = k.semitones === 0
                      ? ['C4', 'E4', 'G4']
                      : [`${k.rootNote}4`, `${k.scaleDegrees[2]}4`, `${k.scaleDegrees[4]}4`];
                    soundEngine.playChord(tonicNotes, 1.0, true);
                  }}
                  className={`py-2 px-1 rounded-xl text-center font-mono text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#141518] text-[#c5a880] shadow-md scale-105 ring-2 ring-[#c5a880] font-bold'
                      : 'bg-white hover:bg-[#ede8e0] text-[#141518] border border-[#eae6de]'
                  }`}
                  title={`${k.name} (${k.keySignature})`}
                >
                  <span className="block leading-none">{k.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Active Key Scale Degrees Strip */}
          <div className="mt-3 pt-3 border-t border-[#ede8e0] flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <span className="text-stone-400 font-mono">Diatonic scale degrees in {activeKey.name}:</span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
              {activeKey.scaleDegrees.map((deg, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white border border-[#e5dcce] text-[#8a6839]"
                >
                  <span className="text-[9px] text-stone-400 font-normal mr-1">{['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i]}</span>
                  {deg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            LEVEL FILTER & LOOP MODE CONTROLS TOOLBAR
        ========================================================================= */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#eae6de]">
          {/* Level Filter Tabs */}
          <div className="inline-flex items-center bg-[#f4efe6] p-1 rounded-2xl border border-[#e5dcce] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setLevelFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                levelFilter === 'all'
                  ? 'bg-[#141518] text-white shadow-xs'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              All Levels ({progressions.length})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('basic')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                levelFilter === 'basic'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              Basic / Beginner ({basicCount})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('intermediate')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                levelFilter === 'intermediate'
                  ? 'bg-[#9e7a4b] text-white shadow-xs'
                  : 'text-[#5c5f6a] hover:text-[#141518]'
              }`}
            >
              Intermediate ({interCount})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('advanced')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                levelFilter === 'advanced'
                  ? 'bg-[#141518] text-[#c5a880] shadow-xs ring-1 ring-[#c5a880]'
                  : 'text-[#8a6839] hover:text-[#141518]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#c5a880] fill-current" />
              Advanced Pro ({advCount})
            </button>
          </div>

          {/* Right Toolbar: Loop Mode Toggle & Pro Unlock CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Loop Mode Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(600);
                setIsLoopMode(!isLoopMode);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                isLoopMode
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-1 ring-emerald-400'
                  : 'bg-white border-[#eae6de] text-stone-500 hover:text-stone-800'
              }`}
              title="Toggle continuous looping mode for progression playback"
            >
              <Repeat className={`w-3.5 h-3.5 ${isLoopMode ? 'text-emerald-600 animate-spin-slow' : 'text-stone-400'}`} />
              <span>Loop Mode: {isLoopMode ? 'ON' : 'OFF'}</span>
              <span className={`w-2 h-2 rounded-full ${isLoopMode ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
            </button>

            {/* Pro Status Badge & Demo Unlock */}
            {isProUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Pro Active
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenSubscription}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#141518] text-[#c5a880] hover:bg-[#2b2d35] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Crown className="w-3 h-3 fill-current text-[#c5a880]" />
                  <span>Unlock Pro</span>
                </button>
                <button
                  type="button"
                  onClick={onDemoUnlock}
                  className="text-[11px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
                  title="Test-drive unlock state immediately"
                >
                  Demo Unlock
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            PROGRESSIONS GRID CARDS
        ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedProgressions.map((prog) => {
            const isPlaying = activeProgId === prog.id;
            const isLocked = prog.isPro && !isProUnlocked;
            const isTheoryOpen = showTheoryId === prog.id;

            return (
              <div
                key={prog.id}
                className={`relative rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-[#faf8f5] border-[#9e7a4b] shadow-lg ring-2 ring-[#9e7a4b]/30'
                    : isLocked
                    ? 'bg-gradient-to-b from-white to-[#fbf9f6] border-[#e8e3d8] shadow-xs'
                    : 'bg-white border-[#eae6de] hover:border-[#b89562]/50 hover:shadow-md'
                }`}
              >
                {/* Top Badge Row */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Level Badge */}
                      {prog.level === 'basic' && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Basic • Free
                        </span>
                      )}
                      {prog.level === 'intermediate' && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f4efe6] text-[#8a6839] border border-[#e5dcce]">
                          Intermediate • Free
                        </span>
                      )}
                      {prog.level === 'advanced' && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#141518] text-[#c5a880] border border-[#2b2d35] flex items-center gap-1">
                          <Crown className="w-3 h-3 fill-current text-[#c5a880]" />
                          Advanced Pro
                        </span>
                      )}

                      {/* Genre Tag */}
                      <span className="text-[11px] text-stone-500 font-mono">
                        {prog.genre}
                      </span>
                    </div>

                    {/* Roman Formula Pill */}
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#141518] bg-[#f5f3ef] px-3 py-1 rounded-xl border border-[#e2ded5] shrink-0">
                      {prog.romanFormula}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-medium text-[#141518] mb-1.5">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-[#5c5f6a] leading-relaxed mb-4">
                    {prog.description}
                  </p>
                </div>

                {/* =============================================================
                    INTERACTIVE TRANSPOSED CHORD TIMELINE & INVERSION PILLS
                ============================================================= */}
                <div className="my-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-2">
                    <span>Voiced in {activeKey.name} (Click chord to inspect inversion):</span>
                    {isLocked && (
                      <span className="text-[#9e7a4b] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Pro Preview
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    {/* The Chords Timeline */}
                    <div
                      className={`flex items-center gap-2 overflow-x-auto pb-2 transition-all ${
                        isLocked ? 'blur-[0.5px] opacity-80' : ''
                      }`}
                    >
                      {prog.chords.map((chord, idx) => {
                        const isCurrentStep = isPlaying && activeStepIndex === idx;

                        return (
                          <React.Fragment key={idx}>
                            <button
                              type="button"
                              onClick={(e) => handleChordClick(chord, prog, idx, e)}
                              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-center transition-all duration-200 cursor-pointer shrink-0 flex flex-col items-center group ${
                                isCurrentStep
                                  ? 'bg-[#141518] text-[#c5a880] scale-110 shadow-lg ring-2 ring-[#c5a880]'
                                  : 'bg-[#faf8f5] hover:bg-[#ede8e0] text-[#141518] border border-[#e2ded5] hover:border-[#b89562]'
                              }`}
                              title={`Click to inspect ${chord.name} (${chord.inversionName})`}
                            >
                              <span className="text-sm font-bold font-mono leading-none">
                                {chord.name}
                              </span>
                              <span className="text-[10px] font-mono text-stone-400 mt-1 leading-none">
                                {chord.roman}
                              </span>
                              {/* Inversion Mini Badge */}
                              <span
                                className={`mt-1.5 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold leading-tight ${
                                  chord.inversionType === 'first'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : chord.inversionType === 'second'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : chord.inversionType === 'slash'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {chord.figuredBass}
                              </span>
                            </button>
                            {idx < prog.chords.length - 1 && (
                              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Locked Pro Overlay Card when locked */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-3 text-center border border-[#e5dcce]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#141518] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold text-[#141518] block leading-tight">
                              Included with Melophile Pro
                            </span>
                            <span className="text-[11px] text-[#5c5f6a]">
                              Full playback &amp; jazz voicings in all 12 keys
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={onOpenSubscription}
                            className="ml-2 px-3 py-1.5 rounded-full bg-[#c5a880] hover:bg-[#d6bc98] text-[#0b0c0e] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                          >
                            Unlock
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expandable Theory & Voice Leading Insight */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowTheoryId(isTheoryOpen ? null : prog.id)}
                    className="text-[11px] font-mono text-[#8a6839] hover:text-[#141518] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-[#9e7a4b]" />
                    <span>{isTheoryOpen ? 'Hide Voice Leading Analysis' : 'Show Voice Leading & Inversions Analysis'}</span>
                  </button>

                  {isTheoryOpen && (
                    <div className="mt-2 p-3.5 rounded-xl bg-[#f7f3eb] border border-[#e5dcce] text-xs text-[#4a4d56] space-y-2 animate-in fade-in duration-150">
                      <div>
                        <strong className="block text-[#141518] font-semibold text-[11px]">
                          Voice Leading Inversions Used:
                        </strong>
                        <p className="text-[11px] text-[#5c5f6a] leading-relaxed">
                          {prog.voiceLeadingTip}
                        </p>
                      </div>
                      <div>
                        <strong className="block text-[#141518] font-semibold text-[11px]">
                          Theoretical Context:
                        </strong>
                        <p className="text-[11px] text-[#5c5f6a] leading-relaxed">
                          {prog.theoryInsight}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-5 pt-4 border-t border-[#f0ede6] flex items-center justify-between gap-3">
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={onOpenSubscription}
                      className="w-full py-2.5 rounded-xl bg-[#141518] hover:bg-[#2b2d35] text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Crown className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>View with Pro Subscription</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handlePlayOrStop(prog, e)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isPlaying
                          ? 'bg-[#9e7a4b] text-white shadow-md'
                          : 'bg-[#141518] hover:bg-[#2b2d35] text-white shadow-xs'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Progression Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>
                            Play {isLoopMode ? 'Loop' : 'Sequence'} in {activeKey.name}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 mt-10 p-5 rounded-2xl bg-[#faf8f5] border border-[#eae6de] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5c5f6a]">
          <div className="flex items-center gap-2.5">
            <Music2 className="w-4 h-4 text-[#9e7a4b] shrink-0" />
            <span>
              All progressions feature dynamic piano voice-leading. Enable <strong>Loop Mode</strong> to rehearse continuously along with the playback.
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            Melophile Music Academy • Real-Time Voice Leading Engine
          </span>
        </div>
      </div>

      {/* =========================================================================
          FLOATING ACTIVE INVERSION HUD POPUP
          (Appears during progression playback or chord click to show which inversion is used)
      ========================================================================= */}
      {inversionPopupData && (
        <aside
          aria-label="Active Chord Inversion Inspector"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl pointer-events-none"
        >
          <div className="pointer-events-auto bg-[#141518]/95 backdrop-blur-md text-white border border-[#383b44] rounded-3xl p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
            {/* Top Bar: Progression Context, Step Count, Close button */}
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-stone-300 font-mono text-[11px] truncate max-w-[200px] sm:max-w-xs">
                  {inversionPopupData.progTitle}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-[#c5a880] font-bold">
                  Step {inversionPopupData.stepIndex + 1}/{inversionPopupData.totalSteps}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Loop Mode Indicator */}
                <button
                  type="button"
                  onClick={() => setIsLoopMode(!isLoopMode)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isLoopMode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-stone-400'
                  }`}
                  title="Toggle loop mode"
                >
                  <Repeat className="w-3 h-3" />
                  <span>Loop: {isLoopMode ? 'ON' : 'OFF'}</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setInversionPopupData(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content: Chord & Active Inversion Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Left Column: Chord Name & Roman */}
              <div className="sm:col-span-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {inversionPopupData.chord.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#c5a880] bg-white/10 px-2 py-0.5 rounded-md">
                    {inversionPopupData.chord.roman}
                  </span>
                </div>

                {/* Prominent Inversion Badge */}
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      inversionPopupData.chord.inversionType === 'first'
                        ? 'bg-emerald-500 text-black'
                        : inversionPopupData.chord.inversionType === 'second'
                        ? 'bg-indigo-400 text-black'
                        : inversionPopupData.chord.inversionType === 'slash'
                        ? 'bg-purple-400 text-black'
                        : 'bg-[#c5a880] text-black'
                    }`}
                  >
                    <span>{inversionPopupData.chord.inversionName}</span>
                    <span className="opacity-75">({inversionPopupData.chord.figuredBass})</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Voicing Tones & Bass Note */}
              <div className="sm:col-span-7 space-y-1.5 text-xs">
                {/* Bass Note Callout */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-stone-400 uppercase tracking-wider">Bass Tone:</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                    {inversionPopupData.chord.bassNote}
                  </span>
                  <span className="text-[#c5a880]">({inversionPopupData.chord.bassRole})</span>
                </div>

                {/* Voiced Pitches Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-stone-400 font-mono text-[11px]">Notes:</span>
                  {inversionPopupData.chord.notes.map((n, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        i === 0
                          ? 'bg-[#c5a880] text-[#141518] font-bold shadow-xs'
                          : 'bg-white/10 text-stone-200'
                      }`}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Voice leading reason */}
                <p className="text-[11px] text-stone-300 leading-snug line-clamp-2 pt-0.5">
                  <em>{inversionPopupData.chord.voiceLeadingReason}</em>
                </p>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 font-mono">
                Formula: <strong className="text-white">{inversionPopupData.chord.inversionFormula}</strong>
              </span>

              <div className="flex items-center gap-2">
                {activeProgId && (
                  <button
                    type="button"
                    onClick={stopPlayback}
                    className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop Audio</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => soundEngine.playChord(inversionPopupData.chord.notes, 1.6, true)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-[#c5a880]" />
                  <span>Replay Voicing</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
};
