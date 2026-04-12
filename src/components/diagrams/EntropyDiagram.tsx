'use client';
import { useState, useMemo } from 'react';

function entropy(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
}

function dieEntropy(faces: number): number {
  return Math.log2(faces);
}

// Generate the entropy curve points for SVG
function entropyPoints(chartX: number, chartY: number, chartW: number, chartH: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    const h = entropy(p);
    const x = chartX + (p * chartW);
    const y = chartY + chartH - (h * chartH); // max entropy = 1
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function EntropyDiagram() {
  const [bias, setBias] = useState(0.5);
  const [modeType, setModeType] = useState<'coin' | 'die'>('coin');
  const [dieFaces, setDieFaces] = useState(6);
  const [flips, setFlips] = useState<boolean[]>(() => Array(8).fill(false).map(() => Math.random() < 0.5));

  const h = modeType === 'coin' ? entropy(bias) : dieEntropy(dieFaces);

  const flipAll = () => {
    setFlips(Array(8).fill(false).map(() => Math.random() < bias));
  };

  const description = useMemo(() => {
    if (modeType === 'die') {
      return `Fair ${dieFaces}-sided die: H = log\u2082(${dieFaces}) = ${h.toFixed(2)} bits. More faces = more uncertainty.`;
    }
    if (bias >= 0.48 && bias <= 0.52) return 'Maximum uncertainty \u2014 1 full bit. You need 1 yes/no question.';
    if (bias >= 0.85 || bias <= 0.15) {
      const val = h.toFixed(2);
      return `Low uncertainty \u2014 only ${val} bits. The outcome is mostly predictable.`;
    }
    if (bias >= 0.98 || bias <= 0.02) return 'Zero uncertainty \u2014 0 bits. You already know the answer.';
    return `H = ${h.toFixed(2)} bits of uncertainty per outcome.`;
  }, [bias, modeType, dieFaces, h]);

  // Chart dimensions within SVG
  const cx = 60, cy = 30, cw = 340, ch = 130;
  const markerP = modeType === 'coin' ? bias : 0;
  const markerH = modeType === 'coin' ? entropy(bias) : 0;
  const markerX = cx + markerP * cw;
  const markerY = cy + ch - markerH * ch;

  // For die mode, max entropy shown = log2(20) ~ 4.32
  const dieMaxH = Math.log2(20);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-2 items-center justify-center">
        <button onClick={() => setModeType('coin')}
          className={`px-3 py-1 rounded text-xs font-semibold ${modeType === 'coin' ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200'}`}>
          Coin
        </button>
        <button onClick={() => setModeType('die')}
          className={`px-3 py-1 rounded text-xs font-semibold ${modeType === 'die' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200'}`}>
          Die
        </button>
      </div>

      {/* Slider */}
      <div className="flex items-center justify-center gap-3 mb-2">
        {modeType === 'coin' ? (
          <>
            <span className="text-xs text-gray-500 dark:text-slate-400 w-20 text-right">p(heads)</span>
            <input type="range" min={0} max={100} value={Math.round(bias * 100)}
              onChange={e => setBias(Number(e.target.value) / 100)}
              className="w-48 accent-amber-500" />
            <span className="text-xs font-mono w-10">{bias.toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="text-xs text-gray-500 dark:text-slate-400 w-20 text-right">Faces</span>
            <input type="range" min={2} max={20} value={dieFaces}
              onChange={e => setDieFaces(Number(e.target.value))}
              className="w-48 accent-indigo-500" />
            <span className="text-xs font-mono w-10">{dieFaces}</span>
          </>
        )}
      </div>

      {/* Entropy value */}
      <p className="text-center text-lg font-bold mb-1" style={{ color: modeType === 'coin' ? '#f59e0b' : '#6366f1' }}>
        H = {h.toFixed(2)} bits
      </p>

      {/* SVG */}
      <svg viewBox="0 0 460 280" className="w-full h-auto" role="img" aria-label="Entropy diagram: measuring surprise with information theory">
        <rect width="460" height="280" rx="8" className="fill-white dark:fill-slate-950" />
        <text x="230" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Measuring Surprise with Information Theory
        </text>

        {modeType === 'coin' ? (
          <>
            {/* Coin visuals */}
            <circle cx={120} cy={cy + ch / 2} r={Math.max(8, bias * 30)} fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            <text x={120} y={cy + ch / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff">H</text>
            <circle cx={340} cy={cy + ch / 2} r={Math.max(8, (1 - bias) * 30)} fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
            <text x={340} y={cy + ch / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff">T</text>
            <text x={120} y={cy + ch / 2 + 38} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{(bias * 100).toFixed(0)}%</text>
            <text x={340} y={cy + ch / 2 + 38} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{((1 - bias) * 100).toFixed(0)}%</text>

            {/* Entropy curve chart */}
            <g>
              {/* Axes */}
              <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
              <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
              {/* Axis labels */}
              <text x={cx - 8} y={cy + 4} textAnchor="end" fontSize="8" className="fill-gray-400">1</text>
              <text x={cx - 8} y={cy + ch + 4} textAnchor="end" fontSize="8" className="fill-gray-400">0</text>
              <text x={cx} y={cy + ch + 14} textAnchor="middle" fontSize="8" className="fill-gray-400">0</text>
              <text x={cx + cw / 2} y={cy + ch + 14} textAnchor="middle" fontSize="8" className="fill-gray-400">0.5</text>
              <text x={cx + cw} y={cy + ch + 14} textAnchor="middle" fontSize="8" className="fill-gray-400">1</text>
              <text x={cx + cw / 2} y={cy + ch + 24} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">p (probability of heads)</text>
              <text x={cx - 20} y={cy + ch / 2} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" transform={`rotate(-90, ${cx - 20}, ${cy + ch / 2})`}>H(p)</text>

              {/* Gridlines */}
              <line x1={cx} y1={cy + ch / 2} x2={cx + cw} y2={cy + ch / 2} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4" />
              <line x1={cx + cw / 2} y1={cy} x2={cx + cw / 2} y2={cy + ch} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4" />

              {/* Entropy curve */}
              <polyline points={entropyPoints(cx, cy, cw, ch)} fill="none" stroke="#f59e0b" strokeWidth="2" />

              {/* Marker */}
              <circle cx={markerX} cy={markerY} r={5} fill="#f59e0b" stroke="#fff" strokeWidth="1.5">
                <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
              </circle>
              <line x1={markerX} y1={markerY} x2={markerX} y2={cy + ch} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" opacity="0.5" />
            </g>

            {/* Coin flip section */}
            <text x={230} y={210} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
              Try it: 8 virtual flips (click to re-flip)
            </text>
            <g onClick={flipAll} style={{ cursor: 'pointer' }}>
              {flips.map((isHeads, i) => (
                <g key={i}>
                  <circle cx={100 + i * 42} cy={242} r={14} fill={isHeads ? '#eab308' : '#9ca3af'} stroke={isHeads ? '#ca8a04' : '#6b7280'} strokeWidth="1" />
                  <text x={100 + i * 42} y={243} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff">
                    {isHeads ? 'H' : 'T'}
                  </text>
                </g>
              ))}
            </g>
            <text x={230} y={270} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">
              Heads: {flips.filter(f => f).length}/8 — {bias >= 0.45 && bias <= 0.55 ? 'hard to predict!' : 'see the pattern?'}
            </text>
          </>
        ) : (
          /* Die mode */
          <>
            {/* Die visual */}
            <rect x={190} y={35} width={80} height={80} rx={12} fill="#6366f1" stroke="#4f46e5" strokeWidth="2" />
            <text x={230} y={82} textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff">{dieFaces}</text>
            <text x={230} y={130} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">faces</text>

            {/* Bar chart: entropy for different face counts */}
            <g>
              <line x1={cx} y1={140} x2={cx} y2={140 + 110} stroke="#94a3b8" strokeWidth="1" />
              <line x1={cx} y1={140 + 110} x2={cx + cw} y2={140 + 110} stroke="#94a3b8" strokeWidth="1" />
              <text x={cx + cw / 2} y={265} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Number of faces</text>
              <text x={cx - 20} y={195} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" transform={`rotate(-90, ${cx - 20}, 195)`}>H (bits)</text>

              {/* Bars for 2, 4, 6, 8, 10, 12, 16, 20 */}
              {[2, 4, 6, 8, 10, 12, 16, 20].map((f, i) => {
                const barW = 34;
                const gap = (cw - 8 * barW) / 9;
                const bx = cx + gap + i * (barW + gap);
                const bh = (dieEntropy(f) / dieMaxH) * 100;
                const isActive = f === dieFaces;
                return (
                  <g key={f}>
                    <rect x={bx} y={140 + 110 - bh} width={barW} height={bh} rx={3}
                      fill={isActive ? '#6366f1' : '#c7d2fe'} stroke={isActive ? '#4f46e5' : 'none'} strokeWidth={isActive ? 2 : 0} />
                    <text x={bx + barW / 2} y={257} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">{f}</text>
                    <text x={bx + barW / 2} y={140 + 107 - bh} textAnchor="middle" fontSize="7" fontWeight="600"
                      fill={isActive ? '#6366f1' : '#94a3b8'}>
                      {dieEntropy(f).toFixed(1)}
                    </text>
                  </g>
                );
              })}
            </g>
          </>
        )}
      </svg>

      {/* Description */}
      <p className="text-center text-xs mt-2 px-4 text-gray-600 dark:text-slate-400 italic">
        {description}
      </p>
    </div>
  );
}
