// Ultra-responsive Web Audio API sound generator for tactile feedback
class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Crisp mechanical tactile click sound
  playClick() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // 1. High frequency crisp transient click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // 2. Low-end mechanical body tap
      const tapOsc = ctx.createOscillator();
      const tapGain = ctx.createGain();

      tapOsc.type = "triangle";
      tapOsc.frequency.setValueAtTime(220, now);
      tapOsc.frequency.exponentialRampToValueAtTime(60, now + 0.045);

      tapGain.gain.setValueAtTime(0.4, now);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      tapOsc.connect(tapGain);
      tapGain.connect(ctx.destination);

      tapOsc.start(now);
      tapOsc.stop(now + 0.05);
    } catch (e) {
      console.debug("Audio play error:", e);
    }
  }

  // Punchy Add-to-cart confirmation sound
  playAddToCart() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      // First click tap
      this.playClick();

      // Second harmonic chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now + 0.04); // D5
      osc.frequency.setValueAtTime(880, now + 0.09); // A5

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.setValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.04);
      osc.stop(now + 0.3);
    } catch (e) {
      console.debug("Audio play error:", e);
    }
  }
}

export const soundFX = new SoundFX();
