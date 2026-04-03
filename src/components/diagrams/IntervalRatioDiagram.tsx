/**
 * Musical intervals and frequency ratios diagram.
 * Shows why certain frequency ratios sound consonant.
 * Interactive: click an interval to hear/see the ratio.
 */
import { useState } from 'react';

const intervals = [
  { name: 'Unison', ratio: '1:1', factor: 1, color: '#22c55e', consonance: 'Perfect' },
  { name: 'Octave', ratio: '2:1', factor: 2, color: '#3b82f6', consonance: 'Perfect' },
  { name: 'Perfect 5th', ratio: '3:2', factor: 1.5, color: '#8b5cf6', consonance: 'Perfect' },
  { name: 'Perfect 4th', ratio: '4:3', factor: 1.333, color: '#06b6d4', consonance: 'Perfect' },
  { name: 'Major 3rd', ratio: '5:4', factor: 1.25, color: '#f59e0b', consonance: 'Consonant' },
  { name: 'Minor 3rd', ratio: '6:5', factor: 1.2, color: '#f97316', consonance: 'Consonant' },
  { name: 'Tritone', ratio: '√2:1', factor: 1.414, color: '#ef4444', consonance: 'Dissonant' },
];

export default function IntervalRatioDiagram() {
  const [selected, setSelected] = useState(1); // Octave

  const totalW = 480;
  const totalH = 220;
  const barY = 80;
  const barH = 12;
  const baseFreq = 440;

  const sel = intervals[selected];
  const freqB = Math.round(baseFreq * sel.factor);

  // Draw wave comparison
  const makeWave = (freq: number, yCenter: number) => {
    const points: string[] = [];
    const startX = 30;
    const endX = totalW - 30;
    const cycles = freq / baseFreq * 3; // show 3 cycles of base
    for (let x = startX; x <= endX; x += 2) {
      const t = (x - startX) / (endX - startX);
      const y = yCenter - Math.sin(t * cycles * 2 * Math.PI) * 14;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      {/* Interval selector */}
      <div className="flex justify-center gap-1 mb-3 flex-wrap">
        {intervals.map((iv, i) => (
          <button
            key={iv.name}
            onClick={() => setSelected(i)}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
              selected === i
                ? 'text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            style={selected === i ? { backgroundColor: iv.color } : undefined}
          >
            {iv.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label={`Musical interval: ${sel.name} with ratio ${sel.ratio}`}>
        {/* Title */}
        <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
          {sel.name}: Frequency Ratio {sel.ratio}
        </text>
        <text x={totalW / 2} y="30" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          {baseFreq} Hz × {sel.factor} = {freqB} Hz — {sel.consonance}
        </text>

        {/* Wave A: base frequency */}
        <text x="12" y="54" className="fill-sky-600 dark:fill-sky-400" fontSize="8" fontWeight="700">A</text>
        <polyline points={makeWave(baseFreq, 55)} fill="none" className="stroke-sky-400" strokeWidth="1.5" />

        {/* Wave B: interval frequency */}
        <text x="12" y={barY + 4} className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontWeight="700" style={{ fill: sel.color }}>B</text>
        <polyline points={makeWave(freqB, barY + 5)} fill="none" stroke={sel.color} strokeWidth="1.5" />

        {/* Ratio bar visualization */}
        <g transform={`translate(30, ${barY + 35})`}>
          <text x="0" y="-4" className="fill-gray-500 dark:fill-gray-400" fontSize="8">Ratio visualization:</text>

          {/* Base bar */}
          <rect x="0" y="0" width={200} height={barH} rx="3"
            className="fill-sky-200 dark:fill-sky-900/40 stroke-sky-400" strokeWidth="1" />
          <text x="100" y={barH / 2 + 1} textAnchor="middle" dominantBaseline="central"
            className="fill-sky-700 dark:fill-sky-300" fontSize="8" fontWeight="700">
            A: {baseFreq} Hz
          </text>

          {/* Interval bar (scaled) */}
          <rect x="0" y={barH + 6} width={200 * sel.factor / 2} height={barH} rx="3"
            fill={sel.color + '40'} stroke={sel.color} strokeWidth="1" />
          <text x={200 * sel.factor / 4} y={barH + 6 + barH / 2 + 1} textAnchor="middle" dominantBaseline="central"
            fontSize="8" fontWeight="700" fill={sel.color}>
            B: {freqB} Hz
          </text>

          {/* Ratio label */}
          <text x={220} y={barH + 3} textAnchor="start" fontSize="11" fontWeight="800" fill={sel.color}>
            {sel.ratio}
          </text>
        </g>

        {/* Consonance explanation */}
        <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
          {sel.consonance === 'Perfect' ? 'Simple ratios (2:1, 3:2) = peaks align often = sounds harmonious' :
           sel.consonance === 'Consonant' ? 'Moderately simple ratio = still pleasant, slight complexity' :
           'Complex ratio (√2:1) = peaks rarely align = tense, unstable sound'}
        </text>
      </svg>
    </div>
  );
}
