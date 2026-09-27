/**
 * Ascent — Web Audio API Synthesized Mountain Temple Bell, Wind Chimes & Celebration Fanfare
 * Resonates with warm alpine overtones and heavenly air harmonics.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Heavenly Bell Strike (Mountain Temple Bell with long celestial decay)
   */
  public playCelestialBell() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [554.37, 830.61, 1108.73];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq - 1.5, now + 3.0);

        const volume = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Mountain Wind Chime (Ascending celestial breeze)
   */
  public playMountainChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6 (celestial pentatonic)

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.07, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 2.2);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Mountain Summit Milestone Celebration Fanfare
   * Plays an uplifting cascade of celestial tones celebrating reaching 100% or unlocking a goal.
   */
  public playSummitCelebration() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Ascending celebratory fanfare: C5, E5, G5, C6, E6, G6
      const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];

      arpeggio.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 2.8);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Aliases
  public playIceShatter() {
    this.playMountainChime();
  }

  public playElectricPulse() {
    this.playCelestialBell();
  }

  public playSoftBell() {
    this.playCelestialBell();
  }

  public playSoftChime() {
    this.playMountainChime();
  }
}

export const sound = new SoundEngine();
