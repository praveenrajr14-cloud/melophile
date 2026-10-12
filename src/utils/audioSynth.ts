// High-quality Web Audio API Grand Piano & UI Sound Synthesizer
// Mobile-optimized (iOS Safari & Android Chrome):
// - Never queues phantom notes while AudioContext is suspended during splash intro
// - Unlocks AudioContext cleanly on first touchstart/pointerdown/keydown
// - Zero node leaks, zero end-of-note clicks/pops, Master DynamicsCompressor

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterGainNode: GainNode | null = null;
  private isUnlockedByGesture: boolean = false;
  public enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.isUnlockedByGesture = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };

      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
      window.addEventListener('click', unlockHandler, { passive: true });
    }
  }

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;

    // Do not create or queue oscillators from background timers before the user has touched/clicked the page!
    // This prevents mobile browsers from buffering splash-screen notes and blasting them later when playing the piano.
    if (!this.isUnlockedByGesture) {
      return false;
    }

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      this.ctx = new AudioCtx();

      // Master compressor prevents any digital clipping on mobile phone speakers
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(20, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(4.5, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.004, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.masterCompressor.connect(this.masterGainNode);
      this.masterGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return true;
  }

  // Warm synthesized acoustic grand piano tone with natural hammer envelope,
  // zero-crossing fadeout (prevents mobile speaker pops), and automatic node cleanup
  public playNote(freq: number, duration: number = 1.5, noteVolume: number = 0.22) {
    if (!this.enabled) return;
    try {
      if (!this.initContext() || !this.ctx || !this.masterCompressor) return;

      const ctx = this.ctx;
      const compressor = this.masterCompressor;

      const scheduleTone = () => {
        if (ctx.state !== 'running') return;

        const now = ctx.currentTime + 0.005; // 5ms lookahead prevents mobile buffer click
        const safeDuration = Math.max(0.35, duration);

        // Gently tame higher frequencies so upper notes sound warm on phone speakers
        const pitchAttenuation = freq > 480 ? Math.pow(480 / freq, 0.42) : 1.0;
        const peakGain = Math.max(0.03, Math.min(0.26, noteVolume * pitchAttenuation));

        // Envelope: smooth zero-start -> soft felt hammer attack -> natural decay -> true 0.0 release
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.0, now);
        noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.016);
        noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.42, now + 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, now + safeDuration - 0.03);
        // Final linear ramp to exact 0.0 prevents any pop when oscillators stop on mobile phones
        noteGain.gain.linearRampToValueAtTime(0.0, now + safeDuration);

        // Dynamic lowpass filter simulating grand piano soundboard warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(0.5, now);
        filter.frequency.setValueAtTime(Math.min(4800, freq * 4.2), now);
        filter.frequency.exponentialRampToValueAtTime(
          Math.max(320, freq * 1.25),
          now + safeDuration * 0.85
        );

        // 1. Fundamental tone (Warm Sine)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // 2. Acoustic body resonance (Triangle 2nd harmonic)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now);
        osc2.detune.setValueAtTime(1.8, now);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.12, now);
        osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + safeDuration * 0.65);

        // 3. Gentle 3rd harmonic overtone
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 3, now);
        osc3.detune.setValueAtTime(-1.8, now);
        const osc3Gain = ctx.createGain();
        osc3Gain.gain.setValueAtTime(0.035, now);
        osc3Gain.gain.exponentialRampToValueAtTime(
          0.0005,
          now + Math.min(0.38, safeDuration * 0.35)
        );

        // Routing
        osc1.connect(filter);
        osc2.connect(osc2Gain);
        osc2Gain.connect(filter);
        osc3.connect(osc3Gain);
        osc3Gain.connect(filter);

        filter.connect(noteGain);
        noteGain.connect(compressor);

        // Clean up all nodes on completion so mobile browsers never crackle or leak audio nodes
        osc1.onended = () => {
          try {
            osc1.disconnect();
            osc2.disconnect();
            osc3.disconnect();
            osc2Gain.disconnect();
            osc3Gain.disconnect();
            filter.disconnect();
            noteGain.disconnect();
          } catch {
            // Ignore
          }
        };

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        const stopTime = now + safeDuration + 0.02;
        osc1.stop(stopTime);
        osc2.stop(stopTime);
        osc3.stop(stopTime);
      };

      if (ctx.state === 'suspended') {
        ctx
          .resume()
          .then(() => scheduleTone())
          .catch(() => {});
      } else {
        scheduleTone();
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play a full chord with balanced voice scaling + subtle warm left-hand bass foundation
  public playChord(noteNames: string[], duration: number = 1.6, arpeggiate: boolean = true) {
    if (!this.enabled || !noteNames.length) return;

    this.isUnlockedByGesture = true;
    this.initContext();

    // Scale per-note volume by number of voices so chords stay warm and clean on mobile speakers
    const voiceCount = noteNames.length;
    const baseVoiceVolume =
      voiceCount === 1
        ? 0.24
        : Math.min(0.21, 0.56 / Math.max(2.4, Math.sqrt(voiceCount) * 1.45));

    // Add a soft, warm left-hand bass anchor 1 octave below the lowest chord note (only for 3+ note chords)
    const firstNote = noteNames[0];
    const firstFreq = NOTE_FREQUENCIES[firstNote] || getNoteFrequency(firstNote);
    if (firstFreq && firstFreq >= 220 && voiceCount >= 3) {
      this.playNote(firstFreq * 0.5, duration * 1.05, baseVoiceVolume * 0.52);
    }

    noteNames.forEach((note, idx) => {
      let freq = NOTE_FREQUENCIES[note];
      if (!freq) {
        freq = getNoteFrequency(note);
      }
      if (freq) {
        const delay = arpeggiate && voiceCount > 1 ? idx * 22 : 0;
        const voiceWeight =
          voiceCount === 1 ? 1.0 : idx === 0 ? 1.06 : idx === voiceCount - 1 ? 1.02 : 0.88;
        const vol = baseVoiceVolume * voiceWeight;

        if (delay === 0) {
          this.playNote(freq, duration, vol);
        } else {
          setTimeout(() => {
            this.playNote(freq, duration, vol);
          }, delay);
        }
      }
    });
  }

  // No-op or silent tactile UI helper so button clicks never produce a synthetic beep/chirp on mobile phones
  public playClick(_freq = 520) {
    // Intentionally silent on mobile/desktop UI buttons so only pure acoustic piano notes are heard
    this.isUnlockedByGesture = true;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const soundEngine = new SoundEngine();

const SEMITONE_MAP: Record<string, number> = {
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

export function getNoteFrequency(note: string): number {
  if (NOTE_FREQUENCIES[note]) return NOTE_FREQUENCIES[note];
  const m = note.match(/^([A-G][b#]?)([0-8])$/);
  if (!m) return 440;
  const name = m[1];
  const oct = parseInt(m[2], 10);
  const semi = SEMITONE_MAP[name] ?? 0;
  const midi = (oct + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Standard chromatic scale frequencies with enharmonic equivalents
export const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 2 & 3
  C3: 130.81,
  'C#3': 138.59,
  Db3: 138.59,
  D3: 146.83,
  'D#3': 155.56,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  Gb3: 185.0,
  G3: 196.0,
  'G#3': 207.65,
  Ab3: 207.65,
  A3: 220.0,
  'A#3': 233.08,
  Bb3: 233.08,
  B3: 246.94,

  // Octave 4 (Middle C)
  C4: 261.63,
  'C#4': 277.18,
  Db4: 277.18,
  D4: 293.66,
  'D#4': 311.13,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  Gb4: 369.99,
  G4: 392.0,
  'G#4': 415.3,
  Ab4: 415.3,
  A4: 440.0,
  'A#4': 466.16,
  Bb4: 466.16,
  B4: 493.88,

  // Octave 5
  C5: 523.25,
  'C#5': 554.37,
  Db5: 554.37,
  D5: 587.33,
  'D#5': 622.25,
  Eb5: 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  Gb5: 739.99,
  G5: 783.99,
  'G#5': 830.61,
  Ab5: 830.61,
  A5: 880.0,
  'A#5': 932.33,
  Bb5: 932.33,
  B5: 987.77,

  // Octave 6
  C6: 1046.5,
  'C#6': 1108.73,
  Db6: 1108.73,
  D6: 1174.66,
  'D#6': 1244.51,
  Eb6: 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  'F#6': 1479.98,
  Gb6: 1479.98,
  G6: 1567.98,
  'G#6': 1661.22,
  Ab6: 1661.22,
  A6: 1760.0,
  'A#6': 1864.66,
  Bb6: 1864.66,
  B6: 1975.53,
};
