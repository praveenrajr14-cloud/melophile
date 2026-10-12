// High-quality Web Audio API Grand Piano & UI Sound Synthesizer
// Features Master DynamicsCompressor, Warm Acoustic Harmonic Layering & Smooth Voice-Leading Playback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterGainNode: GainNode | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master compressor prevents any digital clipping when 4-6 chord tones ring together
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(18, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.22, this.ctx.currentTime);

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.masterCompressor.connect(this.masterGainNode);
      this.masterGainNode.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Warm synthesized acoustic grand piano tone with natural hammer envelope & string decay
  public playNote(freq: number, duration: number = 1.6, noteVolume: number = 0.22) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterCompressor) return;

      const now = this.ctx.currentTime;
      const safeDuration = Math.max(0.3, duration);

      // Gently tame higher frequencies so upper inversions sound silky and never harsh
      const pitchAttenuation = freq > 520 ? Math.pow(520 / freq, 0.35) : 1.0;
      const peakGain = Math.max(0.04, Math.min(0.32, noteVolume * pitchAttenuation));

      // Envelope: soft felt hammer attack -> initial decay -> warm sustain tail
      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.018);
      noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.45, now + 0.22);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + safeDuration);

      // Dynamic lowpass filter simulating piano soundboard warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(0.7, now);
      filter.frequency.setValueAtTime(Math.min(7500, freq * 5.2), now);
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(380, freq * 1.4),
        now + safeDuration * 0.85
      );

      // 1. Fundamental tone (Warm Sine)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // 2. Acoustic body resonance (Triangle 2nd harmonic, slightly detuned for chorus warmth)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(2.5, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.18, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.02, now + safeDuration * 0.65);

      // 3. Gentle 3rd harmonic hammer overtone (fades quickly like a real felt hammer)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);
      osc3.detune.setValueAtTime(-2.5, now);
      const osc3Gain = this.ctx.createGain();
      osc3Gain.gain.setValueAtTime(0.06, now);
      osc3Gain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(0.45, safeDuration * 0.4));

      // Routing
      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc3.connect(osc3Gain);
      osc3Gain.connect(filter);

      filter.connect(noteGain);
      noteGain.connect(this.masterCompressor);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      const stopTime = now + safeDuration + 0.04;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play a full chord with balanced voice scaling + subtle warm left-hand bass foundation
  public playChord(noteNames: string[], duration: number = 1.8, arpeggiate: boolean = true) {
    if (!this.enabled || !noteNames.length) return;

    this.initContext();

    // Scale per-note volume by number of voices so 4-5 note chords stay warm and clean
    const voiceCount = noteNames.length;
    const baseVoiceVolume = Math.min(0.24, 0.62 / Math.max(2.5, Math.sqrt(voiceCount) * 1.45));

    // Add a soft, warm left-hand bass anchor 1 octave below the lowest chord note (if lowest note is in octave 4+)
    const firstNote = noteNames[0];
    const firstFreq = NOTE_FREQUENCIES[firstNote] || getNoteFrequency(firstNote);
    if (firstFreq && firstFreq >= 220 && voiceCount >= 3) {
      this.playNote(firstFreq * 0.5, duration * 1.08, baseVoiceVolume * 0.65);
    }

    noteNames.forEach((note, idx) => {
      let freq = NOTE_FREQUENCIES[note];
      if (!freq) {
        freq = getNoteFrequency(note);
      }
      if (freq) {
        // Gentle harp-like pianist roll (22ms between fingers) for smooth sound
        const delay = arpeggiate ? idx * 24 : 0;
        // Emphasize bass & top melody note slightly, keep inner voices silky
        const voiceWeight = idx === 0 ? 1.08 : idx === voiceCount - 1 ? 1.04 : 0.88;
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

  // Play pleasant UI button click
  public playClick(freq = 600) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.045);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignored
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
  C6: 1046.5,
};
