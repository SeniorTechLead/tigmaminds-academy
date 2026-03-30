import { useState, useRef, useEffect, useCallback } from 'react';

const NOTES: { name: string; freq: number }[] = [
  { name: 'C4', freq: 261.63 },
  { name: 'D4', freq: 293.66 },
  { name: 'E4', freq: 329.63 },
  { name: 'F4', freq: 349.23 },
  { name: 'G4', freq: 392.00 },
  { name: 'A4', freq: 440.00 },
  { name: 'B4', freq: 493.88 },
];

interface Interval {
  name: string;
  semitones: number;
  ratio: string;
  quality: 'consonant' | 'dissonant';
  feel: string;
}

const INTERVALS: Interval[] = [
  { name: 'Unison', semitones: 0, ratio: '1:1', quality: 'consonant', feel: 'Identical — perfectly fused' },
  { name: 'Minor 3rd', semitones: 3, ratio: '6:5', quality: 'consonant', feel: 'Sad, gentle, melancholic' },
  { name: 'Major 3rd', semitones: 4, ratio: '5:4', quality: 'consonant', feel: 'Happy, bright, stable' },
  { name: 'Perfect 4th', semitones: 5, ratio: '4:3', quality: 'consonant', feel: 'Open, floating, neutral' },
  { name: 'Perfect 5th', semitones: 7, ratio: '3:2', quality: 'consonant', feel: 'Strong, powerful, stable' },
  { name: 'Minor 7th', semitones: 10, ratio: '16:9', quality: 'dissonant', feel: 'Tense, wants to resolve' },
  { name: 'Octave', semitones: 12, ratio: '2:1', quality: 'consonant', feel: 'Same note, higher — perfectly fused' },
];

const SVG_W = 600;
const SVG_H = 120;
const PTS = 300;

function sineWavePath(freqScale: number, yOffset: number): string {
  const cycles = Math.min(Math.max(freqScale, 2), 10);
  const pts: string[] = [];
  for (let i = 0; i <= PTS; i++) {
    const x = (i / PTS) * SVG_W;
    const y = yOffset + Math.sin((i / PTS) * cycles * 2 * Math.PI) * 25;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function IntervalPlayer() {
  const [baseIdx, setBaseIdx] = useState(5); // A4
  const [intervalIdx, setIntervalIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscs: OscillatorNode[]; gain: GainNode } | null>(null);
  const timerRef = useRef<number>(0);

  const base = NOTES[baseIdx];
  const interval = intervalIdx !== null ? INTERVALS[intervalIdx] : null;
  const secondFreq = interval ? base.freq * Math.pow(2, interval.semitones / 12) : null;

  const stopSound = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = 0; }
    if (nodesRef.current) {
      const { oscs, gain } = nodesRef.current;
      gain.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.05);
      setTimeout(() => {
        oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
        gain.disconnect();
      }, 200);
      nodesRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playInterval = useCallback((intIdx: number) => {
    stopSound();
    setIntervalIdx(intIdx);

    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const int = INTERVALS[intIdx];
    const f1 = base.freq;
    const f2 = f1 * Math.pow(2, int.semitones / 12);

    const gain = ctx.createGain();
    gain.gain.value = 0.2;
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = f1;
    osc1.connect(gain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = f2;
    osc2.connect(gain);

    osc1.start();
    osc2.start();
    nodesRef.current = { oscs: [osc1, osc2], gain };
    setIsPlaying(true);

    // Auto-stop after 2 seconds
    timerRef.current = window.setTimeout(() => stopSound(), 2000);
  }, [base.freq, stopSound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      nodesRef.current?.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
      nodesRef.current?.gain.disconnect();
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      <h5 className="text-sm font-bold text-gray-900 dark:text-white">Interval Explorer</h5>

      {/* Base note selector */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Base note</label>
        <div className="flex gap-2 flex-wrap">
          {NOTES.map((n, i) => (
            <button
              key={n.name}
              onClick={() => { setBaseIdx(i); stopSound(); }}
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                baseIdx === i
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {n.name.replace('4', '')} <span className="opacity-60">{Math.round(n.freq)} Hz</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interval buttons */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Interval (tap to hear)</label>
        <div className="flex gap-2 flex-wrap">
          {INTERVALS.map((int, i) => (
            <button
              key={int.name}
              onClick={() => playInterval(i)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition border ${
                intervalIdx === i && isPlaying
                  ? int.quality === 'consonant'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {int.name}
              <span className="block text-[10px] opacity-70">{int.ratio}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two overlapping waveforms */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full rounded-lg bg-white dark:bg-gray-900" preserveAspectRatio="none" style={{ minHeight: 80 }}>
        <line x1="0" y1={SVG_H / 2} x2={SVG_W} y2={SVG_H / 2} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 4" />
        <path d={sineWavePath(base.freq / 80, SVG_H / 2)} fill="none" className="stroke-indigo-400" strokeWidth="2" opacity="0.7" />
        {secondFreq && (
          <path d={sineWavePath(secondFreq / 80, SVG_H / 2)} fill="none" className="stroke-rose-400" strokeWidth="2" opacity="0.7" />
        )}
      </svg>

      {/* Info banner */}
      {interval && (
        <div className={`text-sm rounded-lg px-4 py-2 ${
          interval.quality === 'consonant'
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
        }`}>
          <span className="font-semibold">{interval.name}</span> — {interval.feel}
          <span className="ml-2 text-xs opacity-70">
            ({base.freq.toFixed(0)} Hz + {secondFreq?.toFixed(0)} Hz)
          </span>
          <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
            interval.quality === 'consonant'
              ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
          }`}>
            {interval.quality === 'consonant' ? 'Consonant' : 'Dissonant'}
          </span>
        </div>
      )}
    </div>
  );
}
