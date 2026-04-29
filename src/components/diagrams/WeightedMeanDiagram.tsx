'use client';
import { useState } from 'react';

/**
 * Visualizes weighted mean as a balance beam / stacked bar.
 * Shows how weights change the contribution of each component.
 * Students can adjust scores and see the weighted mean shift.
 */

interface Component {
  label: string;
  score: number;
  weight: number;
  color: string;
}

const DEFAULT: Component[] = [
  { label: 'Homework', score: 85, weight: 0.30, color: '#3b82f6' },
  { label: 'Midterm', score: 70, weight: 0.30, color: '#f59e0b' },
  { label: 'Final', score: 90, weight: 0.40, color: '#10b981' },
];

export default function WeightedMeanDiagram() {
  const [components, setComponents] = useState<Component[]>(DEFAULT);

  const totalWeight = components.reduce((s, c) => s + c.weight, 0);
  const weightedMean = components.reduce((s, c) => s + c.weight * c.score, 0) / totalWeight;
  const simpleMean = components.reduce((s, c) => s + c.score, 0) / components.length;

  const updateScore = (idx: number, score: number) => {
    setComponents(prev => prev.map((c, i) => i === idx ? { ...c, score: Math.max(0, Math.min(100, score)) } : c));
  };

  const W = 380, H = 180;
  const mx = 15, mr = 15, barY = 40, barH = 30;
  const barW = W - mx - mr;

  // Each component's pixel width proportional to weight
  const segments = components.map(c => ({
    ...c,
    w: (c.weight / totalWeight) * barW,
    contribution: c.weight * c.score,
  }));

  // Weighted mean position on 0-100 scale
  const meanX = mx + (weightedMean / 100) * barW;
  const simpleMeanX = mx + (simpleMean / 100) * barW;

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Title */}
        <text x={W / 2} y={18} fontSize="10" fill="#6b7280" textAnchor="middle" fontWeight="600">Each segment's width = its weight, shade = its score</text>

        {/* Stacked weight bar — width = weight, opacity = score/100 */}
        {(() => {
          let x = mx;
          return segments.map((seg, i) => {
            const el = (
              <g key={i}>
                <rect x={x} y={barY} width={seg.w} height={barH} fill={seg.color} fillOpacity={0.15 + (seg.score / 100) * 0.7} stroke={seg.color} strokeWidth="1.5" rx="2" />
                <text x={x + seg.w / 2} y={barY + barH / 2 + 4} fontSize="10" fill={seg.color} textAnchor="middle" fontWeight="700">
                  {seg.score}
                </text>
                <text x={x + seg.w / 2} y={barY - 5} fontSize="8" fill={seg.color} textAnchor="middle" fontWeight="600">
                  {seg.label} ({(seg.weight * 100).toFixed(0)}%)
                </text>
              </g>
            );
            x += seg.w;
            return el;
          });
        })()}

        {/* Contribution bars below — height proportional to weight × score */}
        {(() => {
          const contribY = barY + barH + 25;
          const maxContrib = Math.max(...segments.map(s => s.contribution));
          const contribH = 50;
          const gap = 8;
          const segW = (barW - gap * (segments.length - 1)) / segments.length;

          return (
            <>
              <text x={mx} y={contribY - 6} fontSize="8" fill="#6b7280" fontWeight="600">Contribution = weight × score:</text>
              {segments.map((seg, i) => {
                const x = mx + i * (segW + gap);
                const h = (seg.contribution / maxContrib) * contribH;
                return (
                  <g key={`c${i}`}>
                    <rect x={x} y={contribY + contribH - h} width={segW} height={h} fill={seg.color} fillOpacity="0.5" rx="3" />
                    <text x={x + segW / 2} y={contribY + contribH - h - 4} fontSize="9" fill={seg.color} textAnchor="middle" fontWeight="700">
                      {seg.contribution.toFixed(1)}
                    </text>
                    <text x={x + segW / 2} y={contribY + contribH + 12} fontSize="7" fill="#9ca3af" textAnchor="middle">
                      {(seg.weight).toFixed(2)} × {seg.score}
                    </text>
                  </g>
                );
              })}

              {/* Sum arrow */}
              <text x={W - mr - 5} y={contribY + contribH / 2} fontSize="9" fill="#6b7280" textAnchor="end" fontWeight="600">
                Sum ÷ 1.0 = {weightedMean.toFixed(1)}
              </text>
            </>
          );
        })()}
      </svg>

      {/* Score sliders */}
      <div className="grid grid-cols-3 gap-2">
        {components.map((c, i) => (
          <div key={i} className="text-center">
            <label className="text-[10px] font-semibold uppercase" style={{ color: c.color }}>{c.label}</label>
            <input
              type="range" min="0" max="100" value={c.score}
              onChange={e => updateScore(i, parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: c.color }}
            />
            <span className="text-xs font-bold" style={{ color: c.color }}>{c.score}</span>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div className="flex gap-3 text-sm">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Simple mean</div>
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{simpleMean.toFixed(1)}</div>
          <div className="text-[10px] text-gray-400">({components.map(c => c.score).join(' + ')}) ÷ {components.length}</div>
        </div>
        <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-200 dark:border-emerald-800">
          <div className="text-[10px] text-emerald-600 font-semibold uppercase">Weighted mean</div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{weightedMean.toFixed(1)}</div>
          <div className="text-[10px] text-emerald-500">The Final (weight 40%) pulls the average {weightedMean > simpleMean ? 'up' : weightedMean < simpleMean ? 'down' : '— same'}</div>
        </div>
      </div>
    </div>
  );
}
