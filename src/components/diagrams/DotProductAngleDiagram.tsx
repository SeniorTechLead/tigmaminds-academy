'use client';
import { useState, useCallback, useRef } from 'react';

/**
 * Interactive dot product & angle diagram.
 * Drag two vectors — watch the dot product, angle, and cos θ update live.
 * When vectors are perpendicular (dot=0), the display highlights it.
 */
export default function DotProductAngleDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState({ x: 4, y: 3 });
  const [b, setB] = useState({ x: -2, y: 5 });
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  const W = 380, H = 380;
  const cx = W / 2, cy = H / 2; // origin at center
  const scale = 22;
  const maxVal = 8;

  const sx = (v: number) => cx + v * scale;
  const sy = (v: number) => cy - v * scale;

  // Math
  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.sqrt(a.x * a.x + a.y * a.y);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y);
  const cosTheta = magA > 0.01 && magB > 0.01 ? dot / (magA * magB) : 0;
  const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
  const isPerpendicular = Math.abs(dot) < 0.3;
  const angleA = Math.atan2(a.y, a.x);
  const angleB = Math.atan2(b.y, b.x);

  const clamp = (v: number) => Math.max(-maxVal, Math.min(maxVal, Math.round(v * 2) / 2));

  const handlePointerDown = useCallback((which: 'a' | 'b') => setDragging(which), []);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const vx = clamp((svgPt.x - cx) / scale);
    const vy = clamp((cy - svgPt.y) / scale);
    if (dragging === 'a') setA({ x: vx, y: vy });
    else setB({ x: vx, y: vy });
  }, [dragging]);
  const handlePointerUp = useCallback(() => setDragging(null), []);

  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return null;
    const ux = dx / len, uy = dy / len, sz = Math.min(10, len * 0.25);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
        <polygon points={`${x2},${y2} ${x2 - sz * ux + (sz / 2.5) * uy},${y2 - sz * uy - (sz / 2.5) * ux} ${x2 - sz * ux - (sz / 2.5) * uy},${y2 - sz * uy + (sz / 2.5) * ux}`} fill={color} />
      </g>
    );
  };

  // Angle arc between the two vectors
  const arcRadius = 30;
  const startAngle = Math.min(angleA, angleB);
  const endAngle = Math.max(angleA, angleB);
  let sweep = endAngle - startAngle;
  if (sweep > Math.PI) sweep = 2 * Math.PI - sweep;
  const midAngle = angleA + (angleB - angleA) / 2;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
      <div className="text-sm font-bold text-center text-gray-800 dark:text-white mb-1">Dot Product & Angle — drag to explore</div>
      <svg
        ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-sm mx-auto select-none touch-none"
        onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
      >
        <rect x="0" y="0" width={W} height={H} rx="8" fill="#fafafa" className="dark:fill-gray-900/50" />

        {/* Grid */}
        {Array.from({ length: 2 * maxVal + 1 }, (_, i) => i - maxVal).map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={8} x2={sx(v)} y2={H - 8} stroke={v === 0 ? '#94a3b8' : '#f1f5f9'} strokeWidth={v === 0 ? 1.2 : 0.5} className="dark:stroke-gray-700" />
            <line x1={8} y1={sy(v)} x2={W - 8} y2={sy(v)} stroke={v === 0 ? '#94a3b8' : '#f1f5f9'} strokeWidth={v === 0 ? 1.2 : 0.5} className="dark:stroke-gray-700" />
          </g>
        ))}

        {/* Angle arc */}
        {magA > 0.5 && magB > 0.5 && (
          <path
            d={`M ${cx + arcRadius * Math.cos(angleA)} ${cy - arcRadius * Math.sin(angleA)} A ${arcRadius} ${arcRadius} 0 ${theta > 180 ? 1 : 0} ${angleB > angleA ? 0 : 1} ${cx + arcRadius * Math.cos(angleB)} ${cy - arcRadius * Math.sin(angleB)}`}
            fill={isPerpendicular ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)'}
            stroke={isPerpendicular ? '#22c55e' : '#f59e0b'}
            strokeWidth="2"
          />
        )}

        {/* Right angle marker when perpendicular */}
        {isPerpendicular && magA > 1 && magB > 1 && (
          <rect
            x={cx - 1} y={cy - 12} width="12" height="12"
            fill="none" stroke="#22c55e" strokeWidth="1.5"
            transform={`rotate(${-angleA * 180 / Math.PI}, ${cx}, ${cy})`}
          />
        )}

        {/* Vector A */}
        {arrow(cx, cy, sx(a.x), sy(a.y), '#2563eb', 3)}
        <text x={sx(a.x / 2) - 12} y={sy(a.y / 2) - 8} className="fill-blue-600 dark:fill-blue-400 text-[13px] font-bold">a</text>

        {/* Vector B */}
        {arrow(cx, cy, sx(b.x), sy(b.y), '#16a34a', 3)}
        <text x={sx(b.x / 2) + 8} y={sy(b.y / 2) + 14} className="fill-green-600 dark:fill-green-400 text-[13px] font-bold">b</text>

        {/* Angle label */}
        {magA > 0.5 && magB > 0.5 && (
          <text
            x={cx + (arcRadius + 14) * Math.cos((angleA + angleB) / 2)}
            y={cy - (arcRadius + 14) * Math.sin((angleA + angleB) / 2)}
            textAnchor="middle" dominantBaseline="middle"
            className={`text-[11px] font-bold ${isPerpendicular ? 'fill-green-600 dark:fill-green-400' : 'fill-amber-600 dark:fill-amber-400'}`}
          >
            {theta.toFixed(0)}°
          </text>
        )}

        {/* Draggable endpoints */}
        <circle cx={sx(a.x)} cy={sy(a.y)} r="8" fill="#2563eb" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => { e.preventDefault(); handlePointerDown('a'); }} />
        <circle cx={sx(b.x)} cy={sy(b.y)} r="8" fill="#16a34a" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => { e.preventDefault(); handlePointerDown('b'); }} />

        {/* Origin */}
        <circle cx={cx} cy={cy} r="3" fill="#1e293b" className="dark:fill-white" />
      </svg>

      {/* Info panel — OUTSIDE SVG */}
      <div className={`mt-2 rounded-lg p-3 text-center text-sm transition-colors ${isPerpendicular ? 'bg-green-50 dark:bg-green-900/20 ring-2 ring-green-400' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span><span className="text-blue-600 dark:text-blue-400 font-bold">a</span> = ({a.x}, {a.y})</span>
          <span><span className="text-green-600 dark:text-green-400 font-bold">b</span> = ({b.x}, {b.y})</span>
        </div>
        <div className="mt-1.5 font-mono text-xs text-gray-700 dark:text-gray-300">
          a · b = {a.x}×{b.x} + {a.y}×{b.y} = <span className="font-bold text-base">{dot}</span>
        </div>
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          cos θ = {dot} / ({magA.toFixed(2)} × {magB.toFixed(2)}) = <span className="font-semibold">{cosTheta.toFixed(3)}</span>
          <span className="mx-2">→</span>
          <span className={`font-bold ${isPerpendicular ? 'text-green-600 dark:text-green-400 text-base' : 'text-amber-600 dark:text-amber-400'}`}>
            θ = {theta.toFixed(1)}°
          </span>
        </div>
        {isPerpendicular && (
          <div className="mt-1.5 text-green-700 dark:text-green-300 font-bold text-sm">
            Perpendicular! (dot product ≈ 0)
          </div>
        )}
        {dot > 0 && !isPerpendicular && <div className="mt-1 text-xs text-gray-500">Positive dot product → acute angle (same-ish direction)</div>}
        {dot < 0 && !isPerpendicular && <div className="mt-1 text-xs text-gray-500">Negative dot product → obtuse angle (opposite-ish direction)</div>}
      </div>

      <div className="text-center mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
        Drag <span className="text-blue-600 font-semibold">a</span> and <span className="text-green-600 font-semibold">b</span> — try making them perpendicular (dot product = 0)
      </div>
    </div>
  );
}
