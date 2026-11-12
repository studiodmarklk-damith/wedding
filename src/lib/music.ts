/**
 * Generative romantic wedding soundtrack (Web Audio).
 * Warm piano arpeggios + string pad + music-box bells with lush reverb.
 * No audio files needed — plays forever, starts on a user gesture.
 */

const BPM = 68;
const BAR = (60 / BPM) * 4; // seconds per bar
const STEP = BAR / 8; // eighth note

// Chord voicings (MIDI notes): C – G/B – Am – F  |  C – F – G – C
const PROGRESSION: number[][] = [
  [48, 55, 64, 71, 74], // Cmaj9
  [47, 55, 59, 66, 69], // G/B (add9)
  [45, 52, 60, 67, 71], // Am (add9)
  [41, 48, 57, 64, 72], // Fmaj9
  [48, 55, 64, 71, 76], // C (E5 top)
  [41, 48, 57, 65, 72], // F
  [43, 50, 59, 62, 69], // G(add9)
  [48, 55, 64, 72, 79], // C (high sparkle)
];

const ARP = [0, 2, 3, 1, 4, 2, 3, 1]; // arpeggio pattern over chord tones
const PENTA = [76, 79, 81, 84, 86, 88, 91]; // E5 G5 A5 C6 D6 E6 G6

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

export class WeddingMusic {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private wet!: GainNode;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private bar = 0;
  private playing = false;

  start() {
    if (this.playing) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx) this.ctx = new AC();
    const ctx = this.ctx;
    ctx.resume().catch(() => {});

    this.master = ctx.createGain();
    this.master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22;
    comp.ratio.value = 4;

    const conv = ctx.createConvolver();
    conv.buffer = makeImpulse(ctx, 3.2, 2.4);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.5;

    this.master.connect(comp);
    comp.connect(ctx.destination);
    this.master.connect(conv);
    conv.connect(this.wet);
    this.wet.connect(ctx.destination);

    this.nextTime = ctx.currentTime + 0.15;
    this.bar = 0;
    this.playing = true;
    document.documentElement.setAttribute("data-music", ctx.state);
    ctx.resume().then(() => document.documentElement.setAttribute("data-music", ctx.state)).catch(() => {});
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 250);
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    while (this.nextTime < ctx.currentTime + 1.2) {
      this.playBar(this.nextTime, PROGRESSION[this.bar % PROGRESSION.length]);
      this.nextTime += BAR;
      this.bar++;
    }
  }

  private playBar(t0: number, chord: number[]) {
    this.playPad(t0, chord);
    this.playArp(t0, chord);
    if (this.bar % 2 === 0 && Math.random() < 0.85) this.playBell(t0 + STEP * (Math.random() < 0.5 ? 0 : 4));
  }

  private playPad(t0: number, chord: number[]) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 750;
    lp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 1.4);
    g.gain.setValueAtTime(0.05, t0 + BAR - 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t0 + BAR + 0.4);
    lp.connect(g);
    g.connect(this.master);
    chord.forEach((m, i) => {
      const detune = i % 2 === 0 ? 3 : -3;
      for (const d of [detune, -detune]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = mtof(m + 12);
        o.detune.value = d;
        const vg = ctx.createGain();
        vg.gain.value = 0.5 / chord.length;
        o.connect(vg);
        vg.connect(lp);
        o.start(t0);
        o.stop(t0 + BAR + 0.5);
      }
    });
  }

  private playArp(t0: number, chord: number[]) {
    const ctx = this.ctx!;
    for (let i = 0; i < 8; i++) {
      const t = t0 + i * STEP;
      if (i === 3 && Math.random() < 0.5) continue; // gentle humanization
      const m = chord[ARP[i]] + (i >= 6 ? 12 : 0);
      const f = mtof(m + 12);
      const g = ctx.createGain();
      const vel = 0.16 + Math.random() * 0.05;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vel, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const pan = ctx.createStereoPanner();
      pan.pan.value = ((i % 4) - 1.5) * 0.3;
      g.connect(pan);
      pan.connect(this.master);
      for (const [mult, amp, type] of [
        [1, 0.8, "sine"],
        [2.002, 0.25, "sine"],
        [3.001, 0.08, "triangle"],
      ] as const) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f * mult;
        const og = ctx.createGain();
        og.gain.value = amp;
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + 1.8);
      }
    }
  }

  private playBell(t: number) {
    const ctx = this.ctx!;
    const f = mtof(PENTA[Math.floor(Math.random() * PENTA.length)]);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    g.connect(pan);
    pan.connect(this.master);
    for (const [mult, amp] of [
      [1, 0.9],
      [4.01, 0.12],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + 2.6);
    }
  }

  setMuted(muted: boolean) {
    const ctx = this.ctx;
    if (!ctx) return;
    document.documentElement.setAttribute("data-music", muted ? "muted" : ctx.state);
    if (muted) ctx.suspend().catch(() => {});
    else ctx.resume().catch(() => {});
  }

  /** Fully stop and free the generative engine (used when switching to music.mp3). */
  stop() {
    this.playing = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    document.documentElement.removeAttribute("data-music");
  }
}
