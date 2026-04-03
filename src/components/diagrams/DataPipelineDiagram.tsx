/**
 * Interactive data pipeline diagram: raw data → filter → transform → aggregate → result.
 * Shows a list of elephant sighting records flowing through each stage.
 */
import { useState } from 'react';

interface Record {
  name: string;
  weight: number;
  park: string;
}

const RAW_DATA: Record[] = [
  { name: 'Ranga', weight: 4500, park: 'Kaziranga' },
  { name: 'Mohini', weight: 3800, park: 'Manas' },
  { name: 'Gaja', weight: 5200, park: 'Kaziranga' },
  { name: 'Tara', weight: 4100, park: 'Kaziranga' },
  { name: 'Bala', weight: 3200, park: 'Manas' },
];

type Stage = 0 | 1 | 2 | 3;

const stageInfo = [
  { label: 'Raw Data', color: 'gray', desc: 'All records — 5 elephants' },
  { label: 'Filter', color: 'sky', desc: 'park == "Kaziranga" → 3 records' },
  { label: 'Transform', color: 'violet', desc: 'Extract weights → [4500, 5200, 4100]' },
  { label: 'Aggregate', color: 'emerald', desc: 'mean(weights) → 4600.0 kg' },
];

export default function DataPipelineDiagram() {
  const [stage, setStage] = useState<Stage>(3);

  const filtered = RAW_DATA.filter(r => r.park === 'Kaziranga');
  const weights = filtered.map(r => r.weight);
  const mean = weights.reduce((a, b) => a + b, 0) / weights.length;

  const boxW = 90;
  const boxH = 22;
  const totalW = 500;
  const dataY = 56;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Stage stepper */}
      <div className="flex justify-center gap-1 mb-3">
        {stageInfo.map((s, i) => (
          <button
            key={i}
            onClick={() => setStage(i as Stage)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              stage === i
                ? 'bg-amber-500 text-white'
                : i <= stage
                  ? 'bg-slate-600 text-slate-200'
                  : 'bg-slate-800 text-slate-500'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${totalW} 240`} className="w-full" role="img" aria-label="Data pipeline showing filter, transform, aggregate stages">
        {/* Title */}
        <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
          Data Pipeline
        </text>
        <text x={totalW / 2} y="32" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          {stageInfo[stage].desc}
        </text>
        <text x={totalW / 2} y="46" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontFamily="monospace" fontWeight="600">
          {stage === 0 && 'data = [{"name": "Ranga", "weight": 4500, "park": "Kaziranga"}, ...]'}
          {stage === 1 && '[r for r in data if r["park"] == "Kaziranga"]'}
          {stage === 2 && '[r["weight"] for r in filtered]'}
          {stage === 3 && 'sum(weights) / len(weights)'}
        </text>

        {/* Stage 0 & 1: Record cards */}
        {(stage === 0 || stage === 1) && RAW_DATA.map((r, i) => {
          const isKaz = r.park === 'Kaziranga';
          const included = stage === 0 || isKaz;
          const y = dataY + i * (boxH + 6);
          return (
            <g key={i} opacity={included ? 1 : 0.25}>
              {/* Name */}
              <rect x="30" y={y} width={boxW} height={boxH} rx="5"
                className={isKaz && stage === 1
                  ? 'fill-sky-100 dark:fill-sky-900/30 stroke-sky-400'
                  : 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'}
                strokeWidth="1.5" />
              <text x={30 + boxW / 2} y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600" fontFamily="monospace">
                {r.name}
              </text>
              {/* Weight */}
              <rect x={30 + boxW + 6} y={y} width="60" height={boxH} rx="5"
                className={isKaz && stage === 1
                  ? 'fill-sky-50 dark:fill-sky-900/20 stroke-sky-300 dark:stroke-sky-700'
                  : 'fill-gray-50 dark:fill-gray-800/50 stroke-gray-200 dark:stroke-gray-700'}
                strokeWidth="1" />
              <text x={30 + boxW + 36} y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
                {r.weight}kg
              </text>
              {/* Park */}
              <text x={30 + boxW + 74} y={y + boxH / 2 + 1} dominantBaseline="central"
                className={isKaz ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-gray-400 dark:fill-gray-500'}
                fontSize="9" fontWeight={isKaz ? '600' : '400'}>
                {r.park}
              </text>
              {/* Strike-through for filtered out */}
              {stage === 1 && !isKaz && (
                <line x1="28" y1={y + boxH / 2} x2={30 + boxW + 68} y2={y + boxH / 2}
                  className="stroke-red-400" strokeWidth="1.5" />
              )}
            </g>
          );
        })}

        {/* Stage 2: Just weights */}
        {stage === 2 && (
          <g>
            {weights.map((w, i) => {
              const x = 100 + i * 110;
              const y = dataY + 30;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="80" height="36" rx="8"
                    className="fill-violet-100 dark:fill-violet-900/30 stroke-violet-400" strokeWidth="2" />
                  <text x={x + 40} y={y + 20} textAnchor="middle" dominantBaseline="central"
                    className="fill-violet-700 dark:fill-violet-300" fontSize="14" fontWeight="700" fontFamily="monospace">
                    {w}
                  </text>
                </g>
              );
            })}
            <text x={totalW / 2} y={dataY + 86} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
              Extracted just the weight values
            </text>
          </g>
        )}

        {/* Stage 3: Aggregation */}
        {stage === 3 && (
          <g>
            {/* Mini weight boxes */}
            {weights.map((w, i) => {
              const x = 80 + i * 100;
              return (
                <g key={i}>
                  <rect x={x} y={dataY} width="70" height="28" rx="6"
                    className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
                  <text x={x + 35} y={dataY + 16} textAnchor="middle" dominantBaseline="central"
                    className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontFamily="monospace">
                    {w}
                  </text>
                </g>
              );
            })}

            {/* Sum arrow */}
            <text x={totalW / 2} y={dataY + 48} textAnchor="middle" className="fill-gray-400" fontSize="10">
              ↓ sum = {weights.reduce((a, b) => a + b, 0)} ÷ {weights.length}
            </text>

            {/* Result */}
            <rect x={totalW / 2 - 60} y={dataY + 58} width="120" height="44" rx="10"
              className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400" strokeWidth="2" />
            <text x={totalW / 2} y={dataY + 76} textAnchor="middle"
              className="fill-emerald-700 dark:fill-emerald-300" fontSize="18" fontWeight="800" fontFamily="monospace">
              {mean.toFixed(1)}
            </text>
            <text x={totalW / 2} y={dataY + 92} textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400" fontSize="9" fontWeight="600">
              kg average
            </text>
          </g>
        )}

        {/* Pipeline arrows at bottom */}
        <g transform={`translate(30, 210)`}>
          {stageInfo.map((s, i) => {
            const x = i * 115;
            const isCurrent = i === stage;
            const isPast = i < stage;
            return (
              <g key={i}>
                {i > 0 && (
                  <line x1={x - 12} y1="10" x2={x + 2} y2="10"
                    className={isPast || isCurrent ? 'stroke-amber-400' : 'stroke-gray-300 dark:stroke-gray-700'}
                    strokeWidth="2" markerEnd="url(#arrowhead)" />
                )}
                <rect x={x + 4} y="0" width={boxW + 10} height="20" rx="5"
                  className={isCurrent
                    ? 'fill-amber-100 dark:fill-amber-900/30 stroke-amber-400'
                    : isPast
                      ? 'fill-gray-100 dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600'
                      : 'fill-gray-50 dark:fill-gray-800/50 stroke-gray-200 dark:stroke-gray-700'}
                  strokeWidth={isCurrent ? 2 : 1} />
                <text x={x + 4 + (boxW + 10) / 2} y="14" textAnchor="middle"
                  className={isCurrent ? 'fill-amber-700 dark:fill-amber-300' : 'fill-gray-500 dark:fill-gray-400'}
                  fontSize="9" fontWeight="600">
                  {s.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
