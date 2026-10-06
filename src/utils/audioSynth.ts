// High-quality Web Audio API Piano & UI Sound Synthesizer

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic synthesized piano tone using layered oscillators and filter envelope
  public playNote(freq: number, duration: number = 1.4) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Master gain for this note
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.4, now + 0.015); // Fast attack
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Smooth decay

      // Lowpass filter to mimic acoustic piano string resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4.5, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration * 0.8);

      // Fundamental tone (Sine wave)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm body harmonic (Triangle wave)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.value = 0.25;

      // Subtle metallic strike overtone
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now); // 3rd harmonic
      const osc3Gain = this.ctx.createGain();
      osc3Gain.gain.value = 0.1;

      // Routing
      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc3.connect(osc3Gain);
      osc3Gain.connect(filter);

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play a full chord (multiple notes together with realistic acoustic spread)
  public playChord(noteNames: string[], duration: number = 1.8, arpeggiate: boolean = true) {
    if (!this.enabled || !noteNames.length) return;
    noteNames.forEach((note, idx) => {
      let freq = NOTE_FREQUENCIES[note];
      if (!freq) {
        freq = getNoteFrequency(note);
      }
      if (freq) {
        const delay = arpeggiate ? idx * 35 : 0;
        if (delay === 0) {
          this.playNote(freq, duration);
        } else {
          setTimeout(() => {
            this.playNote(freq, duration);
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
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
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
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
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
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00,
  'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,

  // Octave 4 (Middle C)
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,

  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.25,
  'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00,
  'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};
