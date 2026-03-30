import { useState, useRef, useEffect, useCallback } from 'react';

const ROWS = ['Kick', 'Snare', 'Hi-hat', 'Clap'] as const;
const STEPS = 16;

type Grid = boolean[][];

const PRESETS: Record<string, Grid> = {
  Rock: [
    [true,false,false,false, true,false,false,false, true,false,false,false, true,false,false,false],  // kick
    [false,false,false,false, true,false,false,false, false,false,false,false, true,false,false,false], // snare
    [true,false,true,false, true,false,true,false, true,false,true,false, true,false,true,false],      // hi-hat
    [false,false,false,false, false,false,false,false, false,false,false,false, false,false,false,false], // clap
  ],
  'Waltz (3/4)': [
    [true,false,false, false,false,false, false,false,false, false,false,false, true,false,false,false], // kick on 1
    [false,false,false, true,false,false, true,false,false, false,false,false, false,false,false,false], // snare on 2,3
    [true,false,true, true,false,true, true,false,true, true,false,true, true,false,true,false],       // hi-hat
    [false,false,false, false,false,false, false,false,false, false,false,false, false,false,false,false],
  ],
  Bihu: [
    [true,false,false,true, false,false,true,false, true,false,false,true, false,false,true,false],    // kick syncopated
    [false,false,true,false, true,false,false,false, false,false,true,false, true,false,false,true],   // snare offbeats
    [true,true,true,true, true,true,true,true, true,true,true,true, true,true,true,true],             // hi-hat 16ths
    [false,false,false,false, true,false,false,false, false,false,false,false, true,false,false,false], // clap
  ],
};

const EMPTY_GRID: Grid = ROWS.map(() => Array(STEPS).fill(false));

const ROW_COLORS = [
  'bg-rose-500 dark:bg-rose-400',
  'bg-amber-500 dark:bg-amber-400',
  'bg-cyan-500 dark:bg-cyan-400',
  'bg-violet-500 dark:bg-violet-400',
];

const ROW_BORDER_COLORS = [
  'border-rose-300 dark:border-rose-600',
  'border-amber-300 dark:border-amber-600',
  'border-cyan-300 dark:border-cyan-600',
  'border-violet-300 dark:border-violet-600',
];

// Synth drum sounds using Web Audio API
function playKick(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playSnare(ctx: AudioContext, time: number) {
  // Noise burst
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.6, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;
  noise.connect(filter).connect(noiseGain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.15);
  // Body tone
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 200;
  oscGain.gain.setValueAtTime(0.5, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  osc.connect(oscGain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.08);
}

function playHihat(ctx: AudioContext, time: number) {
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 5000;
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.05);
}

function playClap(ctx: AudioContext, time: number) {
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2500;
  filter.Q.value = 1.5;
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.1);
}

const PLAY_FNS = [playKick, playSnare, playHihat, playClap];

export default function BeatMachine() {
  const [grid, setGrid] = useState<Grid>(() => PRESETS.Rock.map(r => [...r]));
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number>(0);
  const stepRef = useRef(-1);
  const gridRef = useRef(grid);
  const bpmRef = useRef(bpm);

  gridRef.current = grid;
  bpmRef.current = bpm;

  const toggleCell = (row: number, col: number) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
  };

  const loadPreset = (name: string) => {
    setGrid(PRESETS[name].map(r => [...r]));
  };

  const clearGrid = () => setGrid(EMPTY_GRID.map(r => [...r]));

  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const s = (stepRef.current + 1) % STEPS;
    stepRef.current = s;
    setStep(s);

    const g = gridRef.current;
    const now = ctx.currentTime;
    for (let r = 0; r < ROWS.length; r++) {
      if (g[r][s]) PLAY_FNS[r](ctx, now);
    }

    const interval = (60 / bpmRef.current / 4) * 1000; // 16th note interval
    timerRef.current = window.setTimeout(tick, interval);
  }, []);

  const startStop = useCallback(() => {
    if (playing) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
      stepRef.current = -1;
      setStep(-1);
      setPlaying(false);
    } else {
      const ctx = ctxRef.current ?? new AudioContext();
      ctxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();
      stepRef.current = -1;
      setPlaying(true);
      tick();
    }
  }, [playing, tick]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h5 className="text-sm font-bold text-gray-900 dark:text-white">Beat Machine</h5>
        <div className="flex gap-2">
          <button
            onClick={startStop}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              playing
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {playing ? 'Stop' : 'Play'}
          </button>
          <button
            onClick={clearGrid}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* BPM slider */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
          <label htmlFor="bpm-slider">Tempo</label>
          <span className="tabular-nums font-medium">{bpm} BPM</span>
        </div>
        <input
          id="bpm-slider"
          type="range" min={60} max={180} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
        />
      </div>

      {/* Step sequencer grid */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[500px]">
          {/* Beat numbers */}
          <div className="flex mb-1 ml-16">
            {Array.from({ length: STEPS }, (_, i) => (
              <div
                key={i}
                className={`flex-1 text-center text-[10px] font-medium ${
                  i % 4 === 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {i % 4 === 0 ? i / 4 + 1 : ''}
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((name, rowIdx) => (
            <div key={name} className="flex items-center mb-1">
              <span className="w-16 text-xs font-medium text-gray-600 dark:text-gray-400 text-right pr-2 flex-shrink-0">{name}</span>
              <div className="flex flex-1 gap-px">
                {Array.from({ length: STEPS }, (_, colIdx) => {
                  const active = grid[rowIdx][colIdx];
                  const isCurrent = step === colIdx && playing;
                  return (
                    <button
                      key={colIdx}
                      onClick={() => toggleCell(rowIdx, colIdx)}
                      className={`flex-1 aspect-square rounded-sm border transition-all ${
                        active
                          ? `${ROW_COLORS[rowIdx]} border-transparent`
                          : `bg-white dark:bg-gray-900 ${ROW_BORDER_COLORS[rowIdx]} ${
                              colIdx % 4 === 0 ? 'border-2' : 'border'
                            }`
                      } ${isCurrent ? 'ring-2 ring-white dark:ring-gray-200 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 scale-110' : ''}`}
                      aria-label={`${name} step ${colIdx + 1} ${active ? 'on' : 'off'}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Presets</label>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => loadPreset(name)}
              className="px-3 py-1 text-xs rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
