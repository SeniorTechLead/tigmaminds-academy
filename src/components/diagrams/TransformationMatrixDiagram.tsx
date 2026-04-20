import { useState, useEffect, useRef } from 'react';

// ── The Unit Square Dances ───────────────────────────────────
// Live-editable 2×2 transformation matrix. Drag 4 sliders (a, b,
// c, d) and watch the unit square morph into whatever the matrix
// says. Plus preset buttons for rotation, scale, shear, reflect.
// Also shows the transformed i-hat and j-hat basis vectors, and
// the determinant (the area scale factor).

const PRESETS: { name: string; m: [number, number, number, number]; color: string }[] = [
  { name: 'Identity', m: [1, 0, 0, 1], color: '#64748b' },
  { name: 'Rotate 45°', m: [0.707, -0.707, 0.707, 0.707], color: '#8b5cf6' },
  { name: 'Rotate 90°', m: [0, -1, 1, 0], color: '#a855f7' },
  { name: 'Scale 2×', m: [2, 0, 0, 2], color: '#10b981' },
  { name: 'Shear', m: [1, 1, 0, 1], color: '#f59e0b' },
  { name: 'Flip y', m: [1, 0, 0, -1], color: '#ef4444' },
  { name: 'Squish', m: [1, 0, 0, 0.3], color: '#06b6d4' },
];

export default function TransformationMatrixDiagram() {
  const [m, setM] = useState<[number, number, number, number]>([2, 1, 0, 1]);
  const [anim, setAnim] = useState(false);
  const [t, setT] = useState(1); // 0 = identity, 1 = full transformation
  const animRef = useRef<number | null>(null);

  // Animation: interpolate t from 0 to 1 when a preset is picked
  const applyPreset = (target: [number, number, number, number]) => {
    setM(target);
    setT(0);
    setAnim(true);
  };

  useEffect(() => {
    if (!anim) return;
    let startTs: number | null = null;
    const duration = 800;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(1, elapsed / duration);
      // ease-in-out
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setT(eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setAnim(false);
      }
    };
    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [anim]);

  const updateEntry = (idx: 0 | 1 | 2 | 3, value: number) => {
    const next = [...m] as typeof m;
    next[idx] = value;
    setM(next);
    setT(1);
  };

  // Interpolate between identity and m using t
  const [a, b, c, d] = m;
  const lerp = (from: number, to: number) => from + (to - from) * t;
  const ai = lerp(1, a), bi = lerp(0, b), ci = lerp(0, c), di = lerp(1, d);

  const det = a * d - b * c;

  // Apply transformation to a point
  const tx = (x: number, y: number) => [ai * x + bi * y, ci * x + di * y] as const;

  // SVG layout
  const W = 440, H = 360;
  const ox = W / 2, oy = H / 2 + 20;
  const scale = 40;
  const toSvg = (gx: number, gy: number) => ({ x: ox + gx * scale, y: oy - gy * scale });

  // Unit square corners
  const square = [[0, 0], [1, 0], [1, 1], [0, 1]] as const;
  const transformedSquare = square.map(([x, y]) => {
    const [nx, ny] = tx(x, y);
    return toSvg(nx, ny);
  });

  const iHat = toSvg(...tx(1, 0));
  const jHat = toSvg(...tx(0, 1));
  const origin = toSvg(0, 0);

  return (
    <div className="bg-gradient-to-b from-violet-50 via-slate-50 to-emerald-50 dark:from-violet-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">
          The Unit Square Dances
        </p>
        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
          det = {det.toFixed(2)} {det < 0 && '(flipped)'}{Math.abs(det) < 0.01 && ' — collapsed!'}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Grid + Square */}
        <div className="flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto" role="img"
            aria-label="Interactive transformation matrix — edit entries or pick a preset to see the unit square morph">

            {/* Grid */}
            {Array.from({ length: 11 }, (_, i) => i - 5).map(v => (
              <g key={`g-${v}`}>
                <line x1={ox + v * scale} y1={0} x2={ox + v * scale} y2={H}
                  stroke="#e2e8f0" className="dark:stroke-slate-700" strokeWidth="0.5" />
                <line x1={0} y1={oy + v * scale} x2={W} y2={oy + v * scale}
                  stroke="#e2e8f0" className="dark:stroke-slate-700" strokeWidth="0.5" />
              </g>
            ))}

            {/* Axes */}
            <line x1={0} y1={oy} x2={W} y2={oy} stroke="#64748b" strokeWidth="1.5" />
            <line x1={ox} y1={0} x2={ox} y2={H} stroke="#64748b" strokeWidth="1.5" />

            {/* Original unit square (ghost) */}
            <polygon points={`${toSvg(0, 0).x},${toSvg(0, 0).y} ${toSvg(1, 0).x},${toSvg(1, 0).y} ${toSvg(1, 1).x},${toSvg(1, 1).y} ${toSvg(0, 1).x},${toSvg(0, 1).y}`}
              fill="none" stroke="#cbd5e1" className="dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={toSvg(0.5, 0.5).x} y={toSvg(0.5, 0.5).y} textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400" fontSize="10" opacity="0.6">
              unit square
            </text>

            {/* Transformed square */}
            <polygon
              points={transformedSquare.map(p => `${p.x},${p.y}`).join(' ')}
              fill="#8b5cf6" fillOpacity={0.2}
              stroke="#8b5cf6" strokeWidth="2" />

            {/* Transformed basis vectors — i-hat (red), j-hat (green) */}
            <defs>
              <marker id="iArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#dc2626" />
              </marker>
              <marker id="jArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#16a34a" />
              </marker>
            </defs>

            <line x1={origin.x} y1={origin.y} x2={iHat.x} y2={iHat.y}
              stroke="#dc2626" strokeWidth="3" markerEnd="url(#iArrow)" />
            <text x={iHat.x + 8} y={iHat.y + 4} className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="bold">
              î → ({ai.toFixed(1)}, {ci.toFixed(1)})
            </text>

            <line x1={origin.x} y1={origin.y} x2={jHat.x} y2={jHat.y}
              stroke="#16a34a" strokeWidth="3" markerEnd="url(#jArrow)" />
            <text x={jHat.x + 8} y={jHat.y + 4} className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">
              ĵ → ({bi.toFixed(1)}, {di.toFixed(1)})
            </text>

            {/* Origin */}
            <circle cx={origin.x} cy={origin.y} r="3" fill="#1e293b" className="dark:fill-white" />
          </svg>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            {PRESETS.map(p => (
              <button key={p.name}
                onClick={() => applyPreset(p.m)}
                className="text-[11px] px-2 py-0.5 rounded text-white font-semibold transition hover:opacity-80"
                style={{ background: p.color }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix editor */}
        <div className="md:w-48 bg-white/70 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 text-center font-semibold">
            Transformation matrix
          </div>

          {/* Matrix display with editable cells */}
          <div className="grid grid-cols-2 gap-1 font-mono text-sm mb-3">
            {[0, 1, 2, 3].map(i => (
              <input key={i}
                type="number"
                step="0.25"
                value={m[i]}
                onChange={e => updateEntry(i as 0 | 1 | 2 | 3, parseFloat(e.target.value) || 0)}
                className="w-full text-center rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-1 py-1 focus:border-violet-500 focus:outline-none"
                style={{
                  color: i === 0 || i === 2 ? '#dc2626' : '#16a34a',
                }} />
            ))}
          </div>

          <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 text-center">
            <span className="text-red-600 dark:text-red-400 font-bold">red</span> column: where î lands
            <br />
            <span className="text-green-600 dark:text-green-400 font-bold">green</span> column: where ĵ lands
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Determinant:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{det.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              Area of unit square after transformation. Negative = flipped. Zero = collapsed to a line.
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        Every 2×2 matrix is a recipe: <strong>column 1 = where î goes, column 2 = where ĵ goes.</strong> Everything else follows.
      </p>
    </div>
  );
}
