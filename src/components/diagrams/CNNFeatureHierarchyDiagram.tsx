'use client';
import { useState } from 'react';

type Animal = 'Elephant' | 'Tiger' | 'Deer';

// 8x8 pixel art grids (1 = filled, 0 = empty)
const GRIDS: Record<Animal, number[][]> = {
  Elephant: [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,1,0],
  ],
  Tiger: [
    [0,1,0,0,0,0,1,0],
    [1,1,1,0,0,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0],
  ],
  Deer: [
    [1,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,1,0,0,0,0,1,0],
  ],
};

const COLORS: Record<Animal, string> = {
  Elephant: '#6b7280',
  Tiger: '#f59e0b',
  Deer: '#92400e',
};

const SCORES: Record<Animal, [string, number][]> = {
  Elephant: [['Elephant', 92], ['Rhino', 5], ['Deer', 3]],
  Tiger: [['Tiger', 89], ['Leopard', 7], ['Deer', 4]],
  Deer: [['Deer', 94], ['Antelope', 4], ['Tiger', 2]],
};

const PARTS: Record<Animal, { label: string; icon: string }[]> = {
  Elephant: [
    { label: 'Ear', icon: '△' },
    { label: 'Trunk', icon: '⌒' },
    { label: 'Leg', icon: '▯' },
  ],
  Tiger: [
    { label: 'Ear', icon: '△' },
    { label: 'Stripe', icon: '≡' },
    { label: 'Tail', icon: '~' },
  ],
  Deer: [
    { label: 'Antler', icon: 'Y' },
    { label: 'Snout', icon: '▽' },
    { label: 'Leg', icon: '▯' },
  ],
};

// 3x3 filter kernels
const FILTERS = [
  { name: 'H-Edge', values: [[-1,-1,-1],[0,0,0],[1,1,1]] },
  { name: 'V-Edge', values: [[-1,0,1],[-1,0,1],[-1,0,1]] },
  { name: 'Diag',   values: [[1,0,-1],[0,0,0],[-1,0,1]] },
  { name: 'Texture',values: [[1,-1,1],[-1,1,-1],[1,-1,1]] },
];

export default function CNNFeatureHierarchyDiagram() {
  const [animal, setAnimal] = useState<Animal>('Elephant');
  const [focusLayer, setFocusLayer] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(true);

  const grid = GRIDS[animal];
  const color = COLORS[animal];
  const scores = SCORES[animal];
  const parts = PARTS[animal];

  const isVisible = (layer: number) => showAll || focusLayer === layer;
  const layerHighlight = (layer: number) =>
    focusLayer === layer ? 'opacity-100' : focusLayer === null ? 'opacity-100' : 'opacity-30';

  // Simple convolution for feature maps (6x6 output from 8x8 input with 3x3 filter)
  const computeFeatureMap = (filter: number[][]) => {
    const out: number[][] = [];
    for (let r = 0; r < 6; r++) {
      out[r] = [];
      for (let c = 0; c < 6; c++) {
        let sum = 0;
        for (let fr = 0; fr < 3; fr++)
          for (let fc = 0; fc < 3; fc++)
            sum += grid[r + fr][c + fc] * filter[fr][fc];
        out[r][c] = sum;
      }
    }
    return out;
  };

  const cellSize = 5;
  const fmCellSize = 4;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center items-center">
        {(['Elephant', 'Tiger', 'Deer'] as Animal[]).map(a => (
          <button
            key={a}
            onClick={() => setAnimal(a)}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              animal === a
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {a}
          </button>
        ))}
        <span className="text-gray-300 dark:text-slate-600 mx-1">|</span>
        <button
          onClick={() => { setShowAll(!showAll); if (showAll) setFocusLayer(0); else setFocusLayer(null); }}
          className="px-2 py-1 text-xs rounded font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
        >
          {showAll ? 'Focus mode' : 'Show all'}
        </button>
        {!showAll && (
          <>
            {[0, 1, 2].map(l => (
              <button
                key={l}
                onClick={() => setFocusLayer(l)}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  focusLayer === l
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Layer {l + 1}
              </button>
            ))}
          </>
        )}
      </div>

      <svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl h-auto" role="img" aria-label="CNN feature hierarchy diagram">
        <rect width="460" height="300" rx="8" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="230" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          How Deep Learning Builds Features Layer by Layer
        </text>

        {/* === INPUT IMAGE === */}
        <g transform="translate(10, 36)">
          <text x="20" y="0" fontSize="8" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Input (8×8)</text>
          <rect x="0" y="4" width={8 * cellSize + 2} height={8 * cellSize + 2} rx="2" stroke="#d1d5db" strokeWidth="0.5" fill="none" />
          {grid.map((row, r) =>
            row.map((v, c) => (
              <rect
                key={`${r}-${c}`}
                x={1 + c * cellSize}
                y={5 + r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={v ? color : '#f3f4f6'}
                stroke="#e5e7eb"
                strokeWidth="0.3"
              />
            ))
          )}
        </g>

        {/* Arrow: input -> layer 1 */}
        <line x1="54" y1="72" x2="72" y2="72" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#cnnArrow)" />

        {/* === LAYER 1: Edges & Textures === */}
        {isVisible(0) && (
          <g transform="translate(78, 30)" className={`transition-opacity ${layerHighlight(0)}`}
             onClick={() => { if (!showAll) setFocusLayer(0); }} style={{ cursor: showAll ? 'default' : 'pointer' }}>
            <rect x="-4" y="-4" width="126" height="110" rx="4" fill={focusLayer === 0 ? '#eff6ff' : 'transparent'} className={focusLayer === 0 ? '' : 'dark:fill-transparent'} stroke={focusLayer === 0 ? '#3b82f6' : '#e2e8f0'} strokeWidth={focusLayer === 0 ? '1.5' : '0.5'} strokeDasharray={focusLayer === 0 ? '' : '3 2'} />
            <text x="58" y="6" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">Layer 1 — Edges</text>

            {/* 4 filters */}
            {FILTERS.map((f, fi) => {
              const fx = (fi % 2) * 60;
              const fy = 12 + Math.floor(fi / 2) * 46;
              return (
                <g key={fi} transform={`translate(${fx}, ${fy})`}>
                  <text x="12" y="8" textAnchor="middle" fontSize="6" className="fill-gray-500 dark:fill-slate-400">{f.name}</text>
                  {/* 3x3 filter */}
                  {f.values.map((row, r) =>
                    row.map((v, c) => (
                      <g key={`${r}-${c}`}>
                        <rect x={c * 8} y={10 + r * 8} width="8" height="8" fill={v > 0 ? '#bfdbfe' : v < 0 ? '#fecaca' : '#f9fafb'} stroke="#d1d5db" strokeWidth="0.3" />
                        <text x={c * 8 + 4} y={10 + r * 8 + 6} textAnchor="middle" fontSize="5" fill={v > 0 ? '#1e40af' : v < 0 ? '#991b1b' : '#9ca3af'}>{v > 0 ? '+1' : v < 0 ? '-1' : '0'}</text>
                      </g>
                    ))
                  )}
                  {/* Arrow to feature map */}
                  <line x1="26" y1="24" x2="30" y2="24" stroke="#94a3b8" strokeWidth="0.5" markerEnd="url(#cnnArrowSmall)" />
                  {/* 6x6 feature map */}
                  {(() => {
                    const fm = computeFeatureMap(f.values);
                    const maxVal = Math.max(...fm.flat().map(Math.abs), 1);
                    return fm.map((row, r) =>
                      row.map((v, c) => {
                        const intensity = Math.abs(v) / maxVal;
                        return (
                          <rect
                            key={`fm-${r}-${c}`}
                            x={32 + c * fmCellSize}
                            y={10 + r * fmCellSize}
                            width={fmCellSize}
                            height={fmCellSize}
                            fill={v >= 0 ? `rgba(59,130,246,${intensity * 0.8})` : `rgba(239,68,68,${intensity * 0.6})`}
                            stroke="#e5e7eb"
                            strokeWidth="0.2"
                          />
                        );
                      })
                    );
                  })()}
                </g>
              );
            })}
          </g>
        )}

        {/* Arrow: layer 1 -> layer 2 */}
        <line x1="205" y1="82" x2="218" y2="82" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#cnnArrow)" />

        {/* === LAYER 2: Parts === */}
        {isVisible(1) && (
          <g transform="translate(222, 30)" className={`transition-opacity ${layerHighlight(1)}`}
             onClick={() => { if (!showAll) setFocusLayer(1); }} style={{ cursor: showAll ? 'default' : 'pointer' }}>
            <rect x="-4" y="-4" width="100" height="110" rx="4" fill={focusLayer === 1 ? '#f0fdf4' : 'transparent'} className={focusLayer === 1 ? '' : 'dark:fill-transparent'} stroke={focusLayer === 1 ? '#22c55e' : '#e2e8f0'} strokeWidth={focusLayer === 1 ? '1.5' : '0.5'} strokeDasharray={focusLayer === 1 ? '' : '3 2'} />
            <text x="46" y="6" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-green-600 dark:fill-green-400">Layer 2 — Parts</text>
            <text x="46" y="16" textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">Edges combine into shapes</text>

            {parts.map((p, i) => (
              <g key={i} transform={`translate(6, ${24 + i * 28})`}>
                <rect width="80" height="22" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="0.8" className="dark:fill-slate-800" />
                <text x="14" y="15" textAnchor="middle" fontSize="14">{p.icon}</text>
                <text x="50" y="14" textAnchor="middle" fontSize="8" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{p.label}</text>
              </g>
            ))}
          </g>
        )}

        {/* Arrow: layer 2 -> layer 3 */}
        <line x1="320" y1="82" x2="334" y2="82" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#cnnArrow)" />

        {/* === LAYER 3: Classification === */}
        {isVisible(2) && (
          <g transform="translate(338, 30)" className={`transition-opacity ${layerHighlight(2)}`}
             onClick={() => { if (!showAll) setFocusLayer(2); }} style={{ cursor: showAll ? 'default' : 'pointer' }}>
            <rect x="-4" y="-4" width="120" height="110" rx="4" fill={focusLayer === 2 ? '#fefce8' : 'transparent'} className={focusLayer === 2 ? '' : 'dark:fill-transparent'} stroke={focusLayer === 2 ? '#eab308' : '#e2e8f0'} strokeWidth={focusLayer === 2 ? '1.5' : '0.5'} strokeDasharray={focusLayer === 2 ? '' : '3 2'} />
            <text x="56" y="6" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Layer 3 — Object</text>
            <text x="56" y="16" textAnchor="middle" fontSize="6" className="fill-gray-400 dark:fill-slate-500">Parts → classification</text>

            {scores.map(([label, pct], i) => (
              <g key={i} transform={`translate(4, ${24 + i * 26})`}>
                <text x="0" y="10" fontSize="8" fontWeight={i === 0 ? '700' : '400'} className={i === 0 ? 'fill-gray-800 dark:fill-slate-100' : 'fill-gray-500 dark:fill-slate-400'}>
                  {label}
                </text>
                <rect x="50" y="2" width="56" height="12" rx="3" fill="#e5e7eb" className="dark:fill-slate-700" />
                <rect x="50" y="2" width={56 * (pct / 100)} height="12" rx="3" fill={i === 0 ? '#22c55e' : '#d1d5db'} />
                <text x={50 + 56 * (pct / 100) + 4} y="11" fontSize="7" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{pct}%</text>
              </g>
            ))}
          </g>
        )}

        {/* Bottom explanation */}
        <g transform="translate(10, 152)">
          <rect x="0" y="0" width="440" height="1" fill="#e2e8f0" />

          {/* Flow summary */}
          <text x="230" y="18" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">
            Pixels → Edges → Parts → Object — each layer builds on the previous one
          </text>

          {/* Layer descriptions */}
          <g transform="translate(0, 28)">
            <rect x="10" y="0" width="130" height="36" rx="4" fill="#eff6ff" className="dark:fill-slate-800" />
            <text x="75" y="12" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Layer 1: Low-level</text>
            <text x="75" y="22" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">Detects edges, lines,</text>
            <text x="75" y="30" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">and simple textures</text>

            <rect x="160" y="0" width="130" height="36" rx="4" fill="#f0fdf4" className="dark:fill-slate-800" />
            <text x="225" y="12" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-green-600 dark:fill-green-400">Layer 2: Mid-level</text>
            <text x="225" y="22" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">Combines edges into</text>
            <text x="225" y="30" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">meaningful shapes</text>

            <rect x="310" y="0" width="130" height="36" rx="4" fill="#fefce8" className="dark:fill-slate-800" />
            <text x="375" y="12" textAnchor="middle" fontSize="7" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Layer 3: High-level</text>
            <text x="375" y="22" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">Recognizes whole</text>
            <text x="375" y="30" textAnchor="middle" fontSize="6.5" className="fill-gray-500 dark:fill-slate-400">objects from parts</text>
          </g>
        </g>

        {/* Arrow markers */}
        <defs>
          <marker id="cnnArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
          </marker>
          <marker id="cnnArrowSmall" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <path d="M0,0 L4,2 L0,4 Z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-center px-2">
        {focusLayer === 0 && 'Layer 1 applies small filters to detect edges and textures — the building blocks of vision.'}
        {focusLayer === 1 && 'Layer 2 groups edges into recognizable parts — ears, trunks, stripes, antlers.'}
        {focusLayer === 2 && 'Layer 3 combines parts to classify the whole animal with a confidence score.'}
        {focusLayer === null && `Switch animals to see how the same network detects different features. Click "Focus mode" to examine one layer at a time.`}
      </p>
    </div>
  );
}
