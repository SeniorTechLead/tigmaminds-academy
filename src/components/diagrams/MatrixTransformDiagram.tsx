'use client';
import { useState } from 'react';

/**
 * Interactive matrix transformation diagram.
 * Student picks a transformation, sees the matrix, watches a unit square
 * transform with labeled points.
 */

type TransformType = 'identity' | 'scale' | 'rotate90' | 'rotate45' | 'reflectX' | 'reflectY' | 'shearX' | 'custom';

interface Transform {
  label: string;
  matrix: [number, number, number, number]; // [a, b, c, d] for [[a,b],[c,d]]
  desc: string;
}

const TRANSFORMS: Record<TransformType, Transform> = {
  identity:  { label: 'Identity',     matrix: [1, 0, 0, 1],       desc: 'No change — the "do nothing" matrix' },
  scale:     { label: 'Scale ×2, ×3', matrix: [2, 0, 0, 3],       desc: 'Stretch x by 2, y by 3' },
  rotate90:  { label: 'Rotate 90°',   matrix: [0, -1, 1, 0],      desc: 'Rotate counterclockwise by 90°' },
  rotate45:  { label: 'Rotate 45°',   matrix: [0.707, -0.707, 0.707, 0.707], desc: 'Rotate counterclockwise by 45°' },
  reflectX:  { label: 'Reflect (x-axis)', matrix: [1, 0, 0, -1],  desc: 'Flip vertically — y becomes −y' },
  reflectY:  { label: 'Reflect (y-axis)', matrix: [-1, 0, 0, 1],  desc: 'Flip horizontally — x becomes −x' },
  shearX:    { label: 'Shear',        matrix: [1, 1, 0, 1],       desc: 'Slant to the right — x shifts by y' },
  custom:    { label: 'Custom',       matrix: [1, 0, 0, 1],       desc: 'Edit the matrix values below' },
};

// Unit square corners
const SQUARE = [[0,0], [1,0], [1,1], [0,1]] as const;
// A small house shape for more visual interest
const HOUSE = [[0,0], [1,0], [1,0.7], [0.5,1], [0,0.7]] as const;

export default function MatrixTransformDiagram() {
  const [selected, setSelected] = useState<TransformType>('scale');
  const [custom, setCustom] = useState<[number,number,number,number]>([1.5, 0.5, -0.5, 1.5]);
  const [showHouse, setShowHouse] = useState(true);

  const t = selected === 'custom' ? { ...TRANSFORMS.custom, matrix: custom } : TRANSFORMS[selected];
  const [a, b, c, d] = t.matrix;

  const shape = showHouse ? HOUSE : SQUARE;

  // Apply transformation
  const apply = (x: number, y: number): [number, number] => [a*x + b*y, c*x + d*y];
  const transformed = shape.map(([x, y]) => apply(x, y));

  // Determinant
  const det = a * d - b * c;

  // Layout
  const W = 360, H = 320;
  const cx = W / 2, cy = H / 2;
  const scale = 50;
  const sx = (v: number) => cx + v * scale;
  const sy = (v: number) => cy - v * scale;

  const polyPoints = (pts: (readonly [number, number])[] | [number, number][]) =>
    pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
      {/* Transform selector buttons */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {(Object.entries(TRANSFORMS) as [TransformType, Transform][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-2 py-1 text-[10px] rounded-md font-medium transition-colors ${
              selected === key
                ? 'bg-violet-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto">
        <rect x="0" y="0" width={W} height={H} rx="6" fill="#fafafa" className="dark:fill-gray-900/50" />

        {/* Grid */}
        {[-3,-2,-1,0,1,2,3].map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={4} x2={sx(v)} y2={H-4} stroke={v===0?'#94a3b8':'#f1f5f9'} strokeWidth={v===0?1.2:0.5} className="dark:stroke-gray-700" />
            <line x1={4} y1={sy(v)} x2={W-4} y2={sy(v)} stroke={v===0?'#94a3b8':'#f1f5f9'} strokeWidth={v===0?1.2:0.5} className="dark:stroke-gray-700" />
          </g>
        ))}

        {/* Original shape — blue dashed */}
        <polygon points={polyPoints(shape)} fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4,3" />
        {shape.map(([x, y], i) => (
          <circle key={`o${i}`} cx={sx(x)} cy={sy(y)} r="3" fill="#2563eb" />
        ))}
        <text x={sx(0.5)} y={sy(0.5) + 4} textAnchor="middle" className="fill-blue-500 text-[9px]">original</text>

        {/* Transformed shape — green solid */}
        <polygon points={polyPoints(transformed)} fill="rgba(22,163,74,0.12)" stroke="#16a34a" strokeWidth="2" />
        {transformed.map(([x, y], i) => (
          <g key={`t${i}`}>
            <circle cx={sx(x)} cy={sy(y)} r="3.5" fill="#16a34a" />
            {i === 0 && <text x={sx(x) - 8} y={sy(y) + 12} className="fill-green-700 dark:fill-green-400 text-[8px]">({x.toFixed(1)},{y.toFixed(1)})</text>}
            {i === 1 && <text x={sx(x) + 4} y={sy(y) + 12} className="fill-green-700 dark:fill-green-400 text-[8px]">({x.toFixed(1)},{y.toFixed(1)})</text>}
          </g>
        ))}
        <text x={sx(transformed.reduce((s,[x])=>s+x,0)/transformed.length)} y={sy(transformed.reduce((s,[,y])=>s+y,0)/transformed.length)} textAnchor="middle" className="fill-green-600 dark:fill-green-400 text-[9px] font-bold">transformed</text>
      </svg>

      {/* Matrix display + info */}
      <div className="mt-2 flex items-start justify-center gap-4 flex-wrap">
        {/* Matrix */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">Matrix</div>
          <div className="inline-flex items-center gap-0.5">
            <span className="text-lg text-gray-400">[</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm font-mono font-bold text-gray-800 dark:text-gray-200">
              {selected === 'custom' ? (
                <>
                  <input type="number" step="0.1" value={custom[0]} onChange={e => setCustom([+e.target.value, custom[1], custom[2], custom[3]])} className="w-12 text-center bg-violet-50 dark:bg-violet-900/30 rounded border border-violet-200 dark:border-violet-700 text-sm" />
                  <input type="number" step="0.1" value={custom[1]} onChange={e => setCustom([custom[0], +e.target.value, custom[2], custom[3]])} className="w-12 text-center bg-violet-50 dark:bg-violet-900/30 rounded border border-violet-200 dark:border-violet-700 text-sm" />
                  <input type="number" step="0.1" value={custom[2]} onChange={e => setCustom([custom[0], custom[1], +e.target.value, custom[3]])} className="w-12 text-center bg-violet-50 dark:bg-violet-900/30 rounded border border-violet-200 dark:border-violet-700 text-sm" />
                  <input type="number" step="0.1" value={custom[3]} onChange={e => setCustom([custom[0], custom[1], custom[2], +e.target.value])} className="w-12 text-center bg-violet-50 dark:bg-violet-900/30 rounded border border-violet-200 dark:border-violet-700 text-sm" />
                </>
              ) : (
                <>
                  <span>{a.toFixed(a % 1 ? 2 : 0)}</span>
                  <span>{b.toFixed(b % 1 ? 2 : 0)}</span>
                  <span>{c.toFixed(c % 1 ? 2 : 0)}</span>
                  <span>{d.toFixed(d % 1 ? 2 : 0)}</span>
                </>
              )}
            </div>
            <span className="text-lg text-gray-400">]</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px]">
          <div className="font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{t.desc}</div>
          <div>det = {det.toFixed(2)} → area {Math.abs(det) < 0.01 ? 'collapsed to 0!' : `×${Math.abs(det).toFixed(2)}`}{det < 0 ? ' (flipped)' : ''}</div>
        </div>
      </div>

      <div className="mt-1 flex justify-center">
        <button
          onClick={() => setShowHouse(!showHouse)}
          className="text-[10px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Switch to {showHouse ? 'square' : 'house'} shape
        </button>
      </div>
    </div>
  );
}
