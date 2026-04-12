'use client';
import { useState } from 'react';

/**
 * Interactive vector operations diagram.
 * Shows a = (3, −2) and b = (1, 5) with selectable operations:
 * addition, subtraction, scalar multiplication, magnitude, unit vector, dot product.
 */

type Op = 'add' | 'sub' | 'scalar' | 'magnitude' | 'unit' | 'dot';

const OPS: { key: Op; label: string }[] = [
  { key: 'add', label: 'a + b' },
  { key: 'sub', label: 'a − b' },
  { key: 'scalar', label: '3a' },
  { key: 'magnitude', label: '|a|' },
  { key: 'unit', label: 'Unit â' },
  { key: 'dot', label: 'a · b' },
];

const A = { x: 3, y: -2 };
const B = { x: 1, y: 5 };

export default function VectorOperationsDiagram() {
  const [op, setOp] = useState<Op>('add');

  const W = 380, H = 340;
  const cx = W / 2, cy = H / 2 + 10;
  const scale = 24;

  const sx = (v: number) => cx + v * scale;
  const sy = (v: number) => cy - v * scale;

  const magA = Math.sqrt(A.x ** 2 + A.y ** 2);
  const magB = Math.sqrt(B.x ** 2 + B.y ** 2);

  // Computed results per operation
  const result = (() => {
    switch (op) {
      case 'add': return { x: A.x + B.x, y: A.y + B.y };
      case 'sub': return { x: A.x - B.x, y: A.y - B.y };
      case 'scalar': return { x: 3 * A.x, y: 3 * A.y };
      case 'magnitude': return null;
      case 'unit': return { x: A.x / magA, y: A.y / magA };
      case 'dot': return null;
    }
  })();

  const dotProduct = A.x * B.x + A.y * B.y;
  const cosTheta = dotProduct / (magA * magB);
  const angleDeg = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);

  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, w: number, dashed?: boolean) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return null;
    const ux = dx / len, uy = dy / len, sz = Math.min(8, len * 0.2);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dashed ? '5,4' : undefined} />
        <polygon points={`${x2},${y2} ${x2 - sz * ux + (sz / 2.5) * uy},${y2 - sz * uy - (sz / 2.5) * ux} ${x2 - sz * ux - (sz / 2.5) * uy},${y2 - sz * uy + (sz / 2.5) * ux}`} fill={color} />
      </g>
    );
  };

  const label = (x: number, y: number, text: string, color: string, anchor?: string) => (
    <text x={x} y={y} fontSize="11" fontWeight="600" fill={color} textAnchor={anchor || 'start'}>{text}</text>
  );

  // Description for each operation
  const desc = (() => {
    switch (op) {
      case 'add': return `a + b = (${A.x}+${B.x}, ${A.y}+${B.y}) = (${A.x + B.x}, ${A.y + B.y}) — walk along a, then along b`;
      case 'sub': return `a − b = (${A.x}−${B.x}, ${A.y}−${B.y}) = (${A.x - B.x}, ${A.y - B.y}) — the vector FROM b's tip TO a's tip`;
      case 'scalar': return `3a = (3×${A.x}, 3×${A.y}) = (${3 * A.x}, ${3 * A.y}) — same direction, 3× longer`;
      case 'magnitude': return `|a| = √(${A.x}² + ${A.y}²) = √${A.x ** 2 + A.y ** 2} ≈ ${magA.toFixed(2)} — the length of the arrow`;
      case 'unit': return `â = a / |a| ≈ (${(A.x / magA).toFixed(2)}, ${(A.y / magA).toFixed(2)}) — same direction, magnitude = 1`;
      case 'dot': return `a · b = ${A.x}×${B.x} + ${A.y}×${B.y} = ${dotProduct} — negative means obtuse angle (${angleDeg.toFixed(0)}°)`;
    }
  })();

  return (
    <div className="space-y-2">
      {/* Operation buttons */}
      <div className="flex flex-wrap gap-1.5">
        {OPS.map(o => (
          <button
            key={o.key}
            onClick={() => setOp(o.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              op === o.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* SVG diagram */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Grid */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={10} x2={sx(v)} y2={H - 10} stroke={v === 0 ? '#94a3b8' : '#f1f5f9'} strokeWidth={v === 0 ? 1 : 0.4} />
            <line x1={10} y1={sy(v)} x2={W - 10} y2={sy(v)} stroke={v === 0 ? '#94a3b8' : '#f1f5f9'} strokeWidth={v === 0 ? 1 : 0.4} />
          </g>
        ))}

        {/* Always show a (blue) */}
        {arrow(sx(0), sy(0), sx(A.x), sy(A.y), '#2563eb', 2.5)}
        {label(sx(A.x) + 4, sy(A.y) - 6, `a (${A.x}, ${A.y})`, '#2563eb')}

        {/* Show b (green) for operations that use it */}
        {(op === 'add' || op === 'sub' || op === 'dot') && (
          <>
            {arrow(sx(0), sy(0), sx(B.x), sy(B.y), '#16a34a', 2.5)}
            {label(sx(B.x) + 4, sy(B.y) - 6, `b (${B.x}, ${B.y})`, '#16a34a')}
          </>
        )}

        {/* Operation-specific visuals */}
        {op === 'add' && result && (
          <>
            {/* b shifted to start from tip of a (parallelogram rule) */}
            {arrow(sx(A.x), sy(A.y), sx(result.x), sy(result.y), '#16a34a', 1.5, true)}
            {/* a shifted to start from tip of b */}
            {arrow(sx(B.x), sy(B.y), sx(result.x), sy(result.y), '#2563eb', 1.5, true)}
            {/* Result vector */}
            {arrow(sx(0), sy(0), sx(result.x), sy(result.y), '#dc2626', 3)}
            {label(sx(result.x) + 4, sy(result.y) - 6, `a+b (${result.x}, ${result.y})`, '#dc2626')}
          </>
        )}

        {op === 'sub' && result && (
          <>
            {/* Show a−b as arrow from tip of b to tip of a */}
            {arrow(sx(B.x), sy(B.y), sx(A.x), sy(A.y), '#f59e0b', 2, true)}
            {/* Result from origin */}
            {arrow(sx(0), sy(0), sx(result.x), sy(result.y), '#dc2626', 3)}
            {label(sx(result.x) + 4, sy(result.y) + 14, `a−b (${result.x}, ${result.y})`, '#dc2626')}
          </>
        )}

        {op === 'scalar' && result && (
          <>
            {/* 3a — long red arrow in same direction */}
            {arrow(sx(0), sy(0), sx(result.x), sy(result.y), '#dc2626', 3)}
            {label(sx(result.x) + 4, sy(result.y) - 6, `3a (${result.x}, ${result.y})`, '#dc2626')}
          </>
        )}

        {op === 'magnitude' && (
          <>
            {/* Draw the right triangle showing components */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(A.x)} y2={sy(0)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <line x1={sx(A.x)} y1={sy(0)} x2={sx(A.x)} y2={sy(A.y)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            {/* Label legs */}
            {label(sx(A.x / 2), sy(0) + 14, `${Math.abs(A.x)}`, '#f59e0b', 'middle')}
            {label(sx(A.x) + 10, sy(A.y / 2), `${Math.abs(A.y)}`, '#f59e0b', 'start')}
            {/* Label hypotenuse */}
            {label(sx(A.x / 2) - 16, sy(A.y / 2) - 8, `√${A.x ** 2 + A.y ** 2} ≈ ${magA.toFixed(2)}`, '#2563eb', 'middle')}
          </>
        )}

        {op === 'unit' && result && (
          <>
            {/* Unit circle for reference */}
            <circle cx={sx(0)} cy={sy(0)} r={scale} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
            {/* Unit vector */}
            {arrow(sx(0), sy(0), sx(result.x), sy(result.y), '#dc2626', 3)}
            {label(sx(result.x) + 6, sy(result.y) - 8, `â (${result.x.toFixed(2)}, ${result.y.toFixed(2)})`, '#dc2626')}
            {label(sx(0) + scale + 4, sy(0) - 4, 'r = 1', '#9ca3af', 'start')}
          </>
        )}

        {op === 'dot' && (
          <>
            {/* Angle arc */}
            {(() => {
              const angleA = Math.atan2(A.y, A.x);
              const angleB = Math.atan2(B.y, B.x);
              const r = 28;
              return (
                <>
                  <path
                    d={`M ${sx(0) + r * Math.cos(angleA)} ${sy(0) - r * Math.sin(angleA)} A ${r} ${r} 0 ${angleDeg > 180 ? 1 : 0} ${angleB > angleA ? 0 : 1} ${sx(0) + r * Math.cos(angleB)} ${sy(0) - r * Math.sin(angleB)}`}
                    fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="2"
                  />
                  {label(
                    sx(0) + (r + 12) * Math.cos((angleA + angleB) / 2),
                    sy(0) - (r + 12) * Math.sin((angleA + angleB) / 2) + 4,
                    `${angleDeg.toFixed(1)}°`,
                    '#f59e0b', 'middle'
                  )}
                </>
              );
            })()}
            {/* Projection of a onto b (scalar projection visualization) */}
            {(() => {
              const projScale = dotProduct / (magB * magB);
              const px = projScale * B.x;
              const py = projScale * B.y;
              return (
                <>
                  <line x1={sx(A.x)} y1={sy(A.y)} x2={sx(px)} y2={sy(py)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,2" />
                  <circle cx={sx(px)} cy={sy(py)} r="3" fill="#f59e0b" />
                </>
              );
            })()}
          </>
        )}

        {/* Origin */}
        <circle cx={sx(0)} cy={sy(0)} r="3" fill="#1e293b" className="dark:fill-white" />
      </svg>

      {/* Description */}
      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {desc}
      </div>
    </div>
  );
}
