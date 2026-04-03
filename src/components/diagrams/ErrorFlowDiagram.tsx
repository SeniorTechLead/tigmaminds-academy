/**
 * Interactive diagram showing try/except/else/finally control flow.
 * Toggle between "no error" and "error" paths to see which blocks run.
 */
import { useState } from 'react';

const blocks = [
  { id: 'try', label: 'try:', color: 'sky', y: 0 },
  { id: 'except', label: 'except:', color: 'red', y: 60 },
  { id: 'else', label: 'else:', color: 'emerald', y: 120 },
  { id: 'finally', label: 'finally:', color: 'amber', y: 180 },
] as const;

type Scenario = 'success' | 'error';

const activeBlocks: Record<Scenario, Set<string>> = {
  success: new Set(['try', 'else', 'finally']),
  error: new Set(['try', 'except', 'finally']),
};

const descriptions: Record<Scenario, string[]> = {
  success: [
    'try: runs your code',
    'except: SKIPPED — no error',
    'else: runs because try succeeded',
    'finally: ALWAYS runs (cleanup)',
  ],
  error: [
    'try: runs until error hits',
    'except: catches the error',
    'else: SKIPPED — error occurred',
    'finally: ALWAYS runs (cleanup)',
  ],
};

export default function ErrorFlowDiagram() {
  const [scenario, setScenario] = useState<Scenario>('success');

  const active = activeBlocks[scenario];
  const descs = descriptions[scenario];

  const boxW = 140;
  const boxH = 40;
  const descX = 220;
  const totalW = 480;
  const startY = 50;
  const totalH = startY + 4 * 60 + 30;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setScenario('success')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            scenario === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          No Error
        </button>
        <button
          onClick={() => setScenario('error')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            scenario === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Error Raised
        </button>
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="Try/except/else/finally control flow">
        {/* Title */}
        <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
          Error Handling Flow
        </text>
        <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          {scenario === 'success' ? 'Code runs without error' : 'Code raises an exception'}
        </text>

        {/* Flow blocks */}
        {blocks.map((block, i) => {
          const y = startY + block.y;
          const isActive = active.has(block.id);
          const isSkipped = !isActive;

          const fills: Record<string, { active: string; inactive: string }> = {
            sky: {
              active: 'fill-sky-100 dark:fill-sky-900/40 stroke-sky-400',
              inactive: 'fill-gray-100 dark:fill-gray-800/40 stroke-gray-300 dark:stroke-gray-600',
            },
            red: {
              active: 'fill-red-100 dark:fill-red-900/40 stroke-red-400',
              inactive: 'fill-gray-100 dark:fill-gray-800/40 stroke-gray-300 dark:stroke-gray-600',
            },
            emerald: {
              active: 'fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400',
              inactive: 'fill-gray-100 dark:fill-gray-800/40 stroke-gray-300 dark:stroke-gray-600',
            },
            amber: {
              active: 'fill-amber-100 dark:fill-amber-900/40 stroke-amber-400',
              inactive: 'fill-gray-100 dark:fill-gray-800/40 stroke-gray-300 dark:stroke-gray-600',
            },
          };

          const textFills: Record<string, { active: string; inactive: string }> = {
            sky: { active: 'fill-sky-700 dark:fill-sky-300', inactive: 'fill-gray-400 dark:fill-gray-600' },
            red: { active: 'fill-red-700 dark:fill-red-300', inactive: 'fill-gray-400 dark:fill-gray-600' },
            emerald: { active: 'fill-emerald-700 dark:fill-emerald-300', inactive: 'fill-gray-400 dark:fill-gray-600' },
            amber: { active: 'fill-amber-700 dark:fill-amber-300', inactive: 'fill-gray-400 dark:fill-gray-600' },
          };

          return (
            <g key={block.id} opacity={isSkipped ? 0.35 : 1}>
              {/* Connecting arrow from previous block */}
              {i > 0 && (
                <line
                  x1={40 + boxW / 2} y1={y - 20}
                  x2={40 + boxW / 2} y2={y}
                  className={isActive ? 'stroke-gray-400 dark:stroke-gray-500' : 'stroke-gray-200 dark:stroke-gray-700'}
                  strokeWidth="1.5"
                  strokeDasharray={isSkipped ? '4 3' : undefined}
                  markerEnd={isActive ? undefined : undefined}
                />
              )}

              {/* Block box */}
              <rect x="40" y={y} width={boxW} height={boxH} rx="8"
                className={isActive ? fills[block.color].active : fills[block.color].inactive}
                strokeWidth={isActive ? 2 : 1} />

              {/* Block label */}
              <text x={40 + boxW / 2} y={y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                className={isActive ? textFills[block.color].active : textFills[block.color].inactive}
                fontSize="14" fontWeight="700" fontFamily="monospace">
                {block.label}
              </text>

              {/* Description on the right */}
              <text x={descX} y={y + boxH / 2 + 1} dominantBaseline="central"
                className={isActive ? 'fill-gray-700 dark:fill-gray-300' : 'fill-gray-400 dark:fill-gray-500'}
                fontSize="10" fontWeight={isActive ? '600' : '400'}>
                {descs[i]}
              </text>

              {/* SKIPPED badge */}
              {isSkipped && (
                <g>
                  <line x1="40" y1={y + boxH / 2} x2={40 + boxW} y2={y + boxH / 2}
                    className="stroke-gray-400 dark:stroke-gray-600" strokeWidth="1" />
                </g>
              )}
            </g>
          );
        })}

        {/* Error lightning bolt on try block when error scenario */}
        {scenario === 'error' && (
          <g transform={`translate(${40 + boxW + 6}, ${startY + 6})`}>
            <text className="fill-red-500" fontSize="20">⚡</text>
          </g>
        )}

        {/* Footnote */}
        <text x={totalW / 2} y={totalH - 6} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
          finally: always runs — use it to close files, release locks, clean up resources
        </text>
      </svg>
    </div>
  );
}
