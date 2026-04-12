'use client';

import { useState, useMemo } from 'react';

interface Sample {
  score: number;
  isDanger: boolean;
}

// 20 rumble examples with model confidence scores
// Dangerous ones cluster higher, safe ones cluster lower, with overlap in 0.35–0.65
const SAMPLES: Sample[] = [
  { score: 0.95, isDanger: true },
  { score: 0.91, isDanger: true },
  { score: 0.87, isDanger: true },
  { score: 0.82, isDanger: true },
  { score: 0.74, isDanger: true },
  { score: 0.68, isDanger: true },
  { score: 0.58, isDanger: true },  // ambiguous
  { score: 0.47, isDanger: true },  // ambiguous - hard to catch
  { score: 0.38, isDanger: true },  // ambiguous - very hard to catch
  { score: 0.12, isDanger: false },
  { score: 0.15, isDanger: false },
  { score: 0.21, isDanger: false },
  { score: 0.25, isDanger: false },
  { score: 0.30, isDanger: false },
  { score: 0.36, isDanger: false },
  { score: 0.42, isDanger: false }, // ambiguous
  { score: 0.53, isDanger: false }, // ambiguous - false alarm zone
  { score: 0.62, isDanger: false }, // ambiguous - false alarm zone
  { score: 0.70, isDanger: false }, // false alarm
  { score: 0.08, isDanger: false },
].sort((a, b) => a.score - b.score);

const PRESETS = [
  { label: 'High Recall (conservation)', threshold: 0.3 },
  { label: 'Balanced (F1)', threshold: 0.55 },
  { label: 'High Precision (research)', threshold: 0.75 },
];

export default function PrecisionRecallDiagram() {
  const [threshold, setThreshold] = useState(0.5);

  const stats = useMemo(() => {
    let tp = 0, fp = 0, fn = 0;
    for (const s of SAMPLES) {
      const predicted = s.score >= threshold;
      if (predicted && s.isDanger) tp++;
      else if (predicted && !s.isDanger) fp++;
      else if (!predicted && s.isDanger) fn++;
    }
    const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    return { tp, fp, fn, precision, recall, f1 };
  }, [threshold]);

  // Layout
  const svgW = 460;
  const svgH = 280;
  const circleY = 68;
  const circleR = 8;
  const trackLeft = 40;
  const trackRight = 420;
  const trackW = trackRight - trackLeft;

  const scoreToX = (score: number) => trackLeft + score * trackW;
  const threshX = scoreToX(threshold);

  // Bar chart area
  const barY = 158;
  const barH = 50;
  const barW = 50;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg" role="img">
        <title>Precision vs Recall Trade-off — Elephant Danger Detection</title>

        {/* Title */}
        <text x={svgW / 2} y="16" textAnchor="middle" className="fill-current" fontSize="12" fontWeight="bold">
          Precision vs Recall Trade-off
        </text>

        {/* Labels */}
        <text x={trackLeft} y="38" textAnchor="start" className="fill-current opacity-50" fontSize="8">
          Low score (safe)
        </text>
        <text x={trackRight} y="38" textAnchor="end" className="fill-current opacity-50" fontSize="8">
          High score (danger)
        </text>

        {/* Track line */}
        <line x1={trackLeft} y1={circleY + circleR + 6} x2={trackRight} y2={circleY + circleR + 6} stroke="gray" strokeOpacity="0.3" strokeWidth="1" />

        {/* Score ticks */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
          <g key={`tick-${v}`}>
            <line x1={scoreToX(v)} y1={circleY + circleR + 3} x2={scoreToX(v)} y2={circleY + circleR + 9} stroke="gray" strokeOpacity="0.4" strokeWidth="1" />
            <text x={scoreToX(v)} y={circleY + circleR + 18} textAnchor="middle" className="fill-current opacity-40" fontSize="7">
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Threshold line */}
        <line x1={threshX} y1={42} x2={threshX} y2={circleY + circleR + 8} stroke="#facc15" strokeWidth="2" strokeDasharray="3,2" />
        <text x={threshX} y={50} textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold">
          threshold
        </text>

        {/* Shaded regions */}
        <rect x={threshX} y={circleY - circleR - 4} width={trackRight - threshX + 10} height={circleR * 2 + 8} rx="4" fill="rgba(239,68,68,0.06)" />
        <text x={Math.min(threshX + 8, trackRight - 40)} y={circleY + circleR + 30} className="fill-current opacity-30" fontSize="7">
          Predicted Danger →
        </text>

        {/* Sample circles */}
        {SAMPLES.map((s, i) => {
          const cx = scoreToX(s.score);
          const predicted = s.score >= threshold;
          const isDanger = s.isDanger;
          // Outline for predictions
          let strokeColor = 'transparent';
          if (predicted && isDanger) strokeColor = '#facc15'; // TP
          else if (predicted && !isDanger) strokeColor = '#f97316'; // FP
          else if (!predicted && isDanger) strokeColor = '#ef4444'; // FN

          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={circleY}
                r={circleR}
                fill={isDanger ? 'rgba(239,68,68,0.7)' : 'rgba(34,197,94,0.7)'}
                stroke={strokeColor}
                strokeWidth={predicted || (!predicted && isDanger) ? 2 : 0.5}
              />
              <text x={cx} y={circleY + 4} textAnchor="middle" fontSize="8">
                {isDanger ? '\u26A0' : '\u2714'}
              </text>
            </g>
          );
        })}

        {/* Legend for circles */}
        <circle cx={trackLeft} cy={circleY + circleR + 36} r={5} fill="rgba(239,68,68,0.7)" />
        <text x={trackLeft + 9} y={circleY + circleR + 39} className="fill-current opacity-50" fontSize="7">Actually dangerous</text>
        <circle cx={trackLeft + 110} cy={circleY + circleR + 36} r={5} fill="rgba(34,197,94,0.7)" />
        <text x={trackLeft + 119} y={circleY + circleR + 39} className="fill-current opacity-50" fontSize="7">Actually safe</text>

        {/* Bar charts: Precision, Recall, F1 */}
        {[
          { label: 'Precision', value: stats.precision, color: '#6366f1', x: 80 },
          { label: 'Recall', value: stats.recall, color: '#f59e0b', x: 200 },
          { label: 'F1 Score', value: stats.f1, color: '#10b981', x: 320 },
        ].map((bar) => {
          const filledH = bar.value * barH;
          return (
            <g key={bar.label}>
              {/* Background bar */}
              <rect x={bar.x} y={barY} width={barW} height={barH} rx="3" fill="rgba(128,128,128,0.1)" stroke="rgba(128,128,128,0.2)" strokeWidth="0.5" />
              {/* Filled bar */}
              <rect x={bar.x} y={barY + barH - filledH} width={barW} height={filledH} rx="3" fill={bar.color} opacity="0.7" />
              {/* Value */}
              <text x={bar.x + barW / 2} y={barY + barH - filledH - 4} textAnchor="middle" fill={bar.color} fontSize="10" fontWeight="bold">
                {(bar.value * 100).toFixed(0)}%
              </text>
              {/* Label */}
              <text x={bar.x + barW / 2} y={barY + barH + 12} textAnchor="middle" className="fill-current" fontSize="9">
                {bar.label}
              </text>
            </g>
          );
        })}

        {/* F1 formula */}
        <text x={svgW / 2} y={barY + barH + 26} textAnchor="middle" className="fill-current opacity-40" fontSize="7">
          F1 = 2 × (P × R) / (P + R)
        </text>

        {/* Stats summary */}
        <text x={svgW / 2} y={barY + barH + 40} textAnchor="middle" className="fill-current opacity-50" fontSize="7">
          TP: {stats.tp} | FP: {stats.fp} | FN: {stats.fn}
        </text>
      </svg>

      {/* Threshold slider */}
      <div className="w-full max-w-lg flex items-center gap-3 px-2">
        <span className="text-xs opacity-60 whitespace-nowrap">Threshold:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="flex-1 accent-yellow-500"
        />
        <span className="text-xs font-mono font-bold w-8 text-right">{threshold.toFixed(2)}</span>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setThreshold(p.threshold)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              Math.abs(threshold - p.threshold) < 0.02
                ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 font-semibold'
                : 'border-gray-400/40 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Conservation insight */}
      <div className="w-full max-w-lg text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-2">
        <span className="font-semibold">Conservation trade-off:</span> Missing a danger signal (low recall) means elephants crash into a village. A false alarm (low precision) means rangers investigate nothing. For conservation: <span className="font-bold text-amber-700 dark:text-amber-400">RECALL matters most</span> — set a lower threshold to catch every threat.
      </div>
    </div>
  );
}
