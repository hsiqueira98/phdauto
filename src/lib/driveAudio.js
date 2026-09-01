/**
 * Som ambiente do MODO IMERSIVO.
 *
 * Sintetizado em Web Audio — nenhum arquivo de áudio no bundle.
 * Um drone grave filtrado, com leve movimento, só para dar peso
 * à navegação. Sempre inicia desligado e só toca por gesto do usuário.
 */

let ctx = null;
let master = null;
let voices = [];

const FREQS = [55, 82.5, 110];

function ensureContext() {
  if (ctx) return ctx;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  ctx = new AudioContextClass();
  master = ctx.createGain();
  master.gain.value = 0;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 0.7;

  master.connect(filter);
  filter.connect(ctx.destination);

  voices = FREQS.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = i === 0 ? 0.6 : 0.18 / i;

    // Movimento lento — evita que o drone soe estático.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1.5 + i;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(master);
    osc.start();
    lfo.start();
    return { osc, gain, lfo };
  });

  return ctx;
}

export async function startAmbient(volume = 0.12) {
  const context = ensureContext();
  if (!context) return false;
  if (context.state === 'suspended') await context.resume();
  master.gain.cancelScheduledValues(context.currentTime);
  master.gain.setTargetAtTime(volume, context.currentTime, 0.8);
  return true;
}

export function stopAmbient() {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
}

/** Blip curto ao trocar de veículo no modo imersivo. */
export function blip(frequency = 440) {
  if (!ctx || !master || master.gain.value < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export function disposeAmbient() {
  if (!ctx) return;
  voices.forEach(({ osc, lfo }) => {
    try {
      osc.stop();
      lfo.stop();
    } catch {
      /* já parado */
    }
  });
  voices = [];
  ctx.close();
  ctx = null;
  master = null;
}
