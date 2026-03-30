import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const WAVEFORMS: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];

function frequencyToNote(freq: number): string {
  const semitones = 12 * Math.log2(freq / 440);
  const noteIndex = Math.round(semitones) + 69; // MIDI note number (A4 = 69)
  if (noteIndex < 0 || noteIndex > 127) return '—';
  const name = NOTE_NAMES[noteIndex % 12];
  const octave = Math.floor(noteIndex / 12) - 1;
  const cents = Math.round((semitones - Math.round(semitones)) * 100);
  const centsStr = cents === 0 ? '' : cents > 0 ? ` +${cents}c` : ` ${cents}c`;
  return `${name}${octave}${centsStr}`;
}

const SVG_W = 600;
const SVG_H = 160;
const POINTS = 300;

function buildWavePath(waveform: OscillatorType, freq: number): string {
  const cycles = Math.min(Math.max(freq / 100, 1), 12);
  const pts: string[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = (i / POINTS) * cycles * 2 * Math.PI;
    const x = (i / POINTS) * SVG_W;
    let y: number;
    switch (waveform) {
      case 'square':
        y = Math.sin(t) >= 0 ? -1 : 1;
        break;
      case 'sawtooth':
        y = -2 * ((t / (2 * Math.PI)) % 1) + 1;
        break;
      case 'triangle':
        y = (2 / Math.PI) * Math.asin(Math.sin(t));
        break;
      default:
        y = Math.sin(t);
    }
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${(SVG_H / 2 + y * -(SVG_H / 2 - 10)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function TonePlayer() {
  const [freq, setFreq] = useState(440);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const wavePath = useMemo(() => buildWavePath(waveform, freq), [waveform, freq]);

  const stop = useCallback(() => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing) { stop(); return; }
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const osc = ctx.createOscillator();
    osc.type = waveform;
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    oscRef.current = osc;
    setPlaying(true);
  }, [playing, freq, waveform, stop]);

  // Update live parameters
  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.value = freq;
      oscRef.current.type = waveform;
    }
  }, [freq, waveform]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscRef.current?.stop();
      oscRef.current?.disconnect();
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-gray-900 dark:text-white">Tone Generator</h5>
        <button
          onClick={play}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
            playing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>

      {/* Waveform visual */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-lg bg-white dark:bg-gray-900" preserveAspectRatio="none" style={{ minHeight: 100 }}>
        <line x1="0" y1={SVG_H / 2} x2={SVG_W} y2={SVG_H / 2} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 4" />
        <path d={wavePath} fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      {/* Frequency slider */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
          <label htmlFor="tone-freq">Frequency</label>
          <span className="tabular-nums font-medium">{freq} Hz — {frequencyToNote(freq)}</span>
        </div>
        <input
          id="tone-freq"
          type="range" min={100} max={2000} value={freq}
          onChange={e => setFreq(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          <span>100 Hz</span><span>2000 Hz</span>
        </div>
      </div>

      {/* Waveform selector */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Waveform</label>
        <div className="flex gap-2 flex-wrap">
          {WAVEFORMS.map(w => (
            <button
              key={w}
              onClick={() => setWaveform(w)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                waveform === w
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {w.charAt(0).toUpperCase() + w.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
