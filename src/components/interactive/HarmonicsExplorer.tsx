import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const NUM_HARMONICS = 6;

interface Preset {
  name: string;
  description: string;
  amplitudes: number[];
}

const PRESETS: Preset[] = [
  { name: 'Pure tone', description: 'Fundamental only — clean, flute-like', amplitudes: [1, 0, 0, 0, 0, 0] },
  { name: 'Guitar-like', description: 'Rich harmonics — warm, full', amplitudes: [1, 0.8, 0.6, 0.45, 0.3, 0.2] },
  { name: 'Flute-like', description: 'Few harmonics — smooth, airy', amplitudes: [1, 0.15, 0.05, 0, 0, 0] },
  { name: 'Clarinet-like', description: 'Odd harmonics only — hollow, reedy', amplitudes: [1, 0, 0.6, 0, 0.3, 0] },
  { name: 'Bright brass', description: 'Many strong harmonics — brassy, loud', amplitudes: [1, 0.9, 0.85, 0.7, 0.6, 0.5] },
];

const SVG_W = 600;
const SVG_H = 180;
const PTS = 400;
const CY = SVG_H / 2;

function buildCombinedPath(amps: number[]): string {
  const pts: string[] = [];
  for (let i = 0; i <= PTS; i++) {
    const t = (i / PTS) * 4 * Math.PI; // show 2 full cycles
    let y = 0;
    for (let h = 0; h < amps.length; h++) {
      y += amps[h] * Math.sin((h + 1) * t);
    }
    // Normalize
    const maxAmp = amps.reduce((s, a) => s + Math.abs(a), 0) || 1;
    const ny = CY - (y / maxAmp) * (CY - 10);
    const x = (i / PTS) * SVG_W;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ny.toFixed(1)}`);
  }
  return pts.join(' ');
}

const HARMONIC_COLORS = [
  'text-rose-500', 'text-amber-500', 'text-emerald-500',
  'text-cyan-500', 'text-indigo-500', 'text-violet-500',
];
const HARMONIC_STROKE = [
  'stroke-rose-400', 'stroke-amber-400', 'stroke-emerald-400',
  'stroke-cyan-400', 'stroke-indigo-400', 'stroke-violet-400',
];

export default function HarmonicsExplorer() {
  const [freq, setFreq] = useState(220);
  const [amps, setAmps] = useState<number[]>([1, 0.5, 0.3, 0.15, 0.1, 0.05]);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const masterRef = useRef<GainNode | null>(null);

  const combinedPath = useMemo(() => buildCombinedPath(amps), [amps]);

  // Individual harmonic paths (faint)
  const harmonicPaths = useMemo(() =>
    amps.map((amp, h) => {
      if (amp === 0) return '';
      const pts: string[] = [];
      for (let i = 0; i <= PTS; i++) {
        const t = (i / PTS) * 4 * Math.PI;
        const maxAmp = amps.reduce((s, a) => s + Math.abs(a), 0) || 1;
        const y = CY - (amp * Math.sin((h + 1) * t) / maxAmp) * (CY - 10);
        const x = (i / PTS) * SVG_W;
        pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return pts.join(' ');
    }),
    [amps]
  );

  const setAmp = (idx: number, val: number) => {
    setAmps(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const stop = useCallback(() => {
    oscsRef.current.forEach(({ osc, gain }) => {
      try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
    });
    oscsRef.current = [];
    masterRef.current?.disconnect();
    masterRef.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing) { stop(); return; }

    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.2;
    master.connect(ctx.destination);
    masterRef.current = master;

    const nodes: { osc: OscillatorNode; gain: GainNode }[] = [];
    for (let h = 0; h < NUM_HARMONICS; h++) {
      const gain = ctx.createGain();
      gain.gain.value = amps[h];
      gain.connect(master);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * (h + 1);
      osc.connect(gain);
      osc.start();
      nodes.push({ osc, gain });
    }
    oscsRef.current = nodes;
    setPlaying(true);
  }, [playing, freq, amps, stop]);

  // Update live parameters while playing
  useEffect(() => {
    oscsRef.current.forEach(({ osc, gain }, h) => {
      osc.frequency.value = freq * (h + 1);
      gain.gain.value = amps[h];
    });
  }, [freq, amps]);

  useEffect(() => {
    return () => {
      oscsRef.current.forEach(({ osc, gain }) => {
        try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
      });
      masterRef.current?.disconnect();
      ctxRef.current?.close();
    };
  }, []);

  const loadPreset = (preset: Preset) => setAmps([...preset.amplitudes]);

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-gray-900 dark:text-white">Harmonics Explorer</h5>
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

      {/* Combined waveform with individual harmonics */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-lg bg-white dark:bg-gray-900" preserveAspectRatio="none" style={{ minHeight: 110 }}>
        <line x1="0" y1={CY} x2={SVG_W} y2={CY} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 4" />
        {/* Individual harmonics (faint) */}
        {harmonicPaths.map((path, h) =>
          path ? <path key={h} d={path} fill="none" className={HARMONIC_STROKE[h]} strokeWidth="1" opacity="0.3" /> : null
        )}
        {/* Combined waveform (bold) */}
        <path d={combinedPath} fill="none" className="stroke-gray-900 dark:stroke-white" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      {/* Fundamental frequency slider */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
          <label htmlFor="harm-freq">Fundamental frequency</label>
          <span className="tabular-nums font-medium">{freq} Hz</span>
        </div>
        <input
          id="harm-freq"
          type="range" min={80} max={600} value={freq}
          onChange={e => setFreq(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
        />
      </div>

      {/* Harmonic amplitude sliders */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-300 block font-medium">Harmonics</label>
        {Array.from({ length: NUM_HARMONICS }, (_, h) => (
          <div key={h} className="flex items-center gap-3">
            <span className={`w-20 text-xs font-medium flex-shrink-0 ${HARMONIC_COLORS[h]}`}>
              {h === 0 ? 'Fundamental' : `${h + 1}${h === 1 ? 'nd' : h === 2 ? 'rd' : 'th'}`}
              <span className="text-gray-400 dark:text-gray-500 ml-1">{freq * (h + 1)} Hz</span>
            </span>
            <input
              type="range" min={0} max={100} value={Math.round(amps[h] * 100)}
              onChange={e => setAmp(h, Number(e.target.value) / 100)}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
            />
            <span className="w-8 text-xs tabular-nums text-gray-500 dark:text-gray-400 text-right">
              {(amps[h] * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Presets</label>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => loadPreset(p)}
              className="px-3 py-1 text-xs rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={p.description}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
