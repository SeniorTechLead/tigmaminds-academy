'use client';
import { useState, useCallback, useRef } from 'react';

/**
 * Interactive vector addition diagram.
 * Student can DRAG the endpoints of vectors A and B.
 * The resultant R, magnitude |R|, angle, and parallelogram update live.
 */
export default function VectorBoatDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState({ x: 3, y: 8 }); // motor vector (east, north)
  const [b, setB] = useState({ x: 4, y: 2 }); // current vector
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  // Layout
  const W = 420, H = 380;
  const ox = 50, oy = H - 50; // origin (bottom-left)
  const scale = 28;
  const maxVal = 10;

  // SVG coords from vector coords (y flipped)
  const sx = (v: number) => ox + v * scale;
  const sy = (v: number) => oy - v * scale;

  // Resultant
  const r = { x: a.x + b.x, y: a.y + b.y };
  const magA = Math.sqrt(a.x * a.x + a.y * a.y);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y);
  const magR = Math.sqrt(r.x * r.x + r.y * r.y);
  const angleR = r.x === 0 && r.y === 0 ? 0 : Math.atan2(r.y, r.x) * (180 / Math.PI);

  const clamp = (v: number) => Math.max(-maxVal, Math.min(maxVal, Math.round(v * 2) / 2));

  const handlePointerDown = useCallback((which: 'a' | 'b') => {
    setDragging(which);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    const vx = clamp((svgPt.x - ox) / scale);
    const vy = clamp((oy - svgPt.y) / scale);
    if (dragging === 'a') setA({ x: vx, y: vy });
    else setB({ x: vx, y: vy });
  }, [dragging]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  // Arrow head
  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, width: number) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return null;
    const ux = dx / len, uy = dy / len;
    const sz = Math.min(10, len * 0.3);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon
          points={`${x2},${y2} ${x2 - sz * ux + (sz / 2.5) * uy},${y2 - sz * uy - (sz / 2.5) * ux} ${x2 - sz * ux - (sz / 2.5) * uy},${y2 - sz * uy + (sz / 2.5) * ux}`}
          fill={color}
        />
      </g>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
      <div className="text-sm font-bold text-center text-gray-800 dark:text-white mb-2">Vector Addition — drag the endpoints!</div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-lg mx-auto select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background */}
        <rect x="0" y="0" width={W} height={H} rx="8" fill="#f0f9ff" className="dark:fill-gray-900/50" />

        {/* Grid */}
        {Array.from({ length: 2 * maxVal + 1 }, (_, i) => i - maxVal).map(v => (
          <g key={`g${v}`}>
            {sx(v) >= 0 && sx(v) <= W && <line x1={sx(v)} y1={10} x2={sx(v)} y2={H - 10} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 1.5 : 0.5} className="dark:stroke-gray-700" />}
            {sy(v) >= 0 && sy(v) <= H && <line x1={10} y1={sy(v)} x2={W - 10} y2={sy(v)} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 1.5 : 0.5} className="dark:stroke-gray-700" />}
          </g>
        ))}

        {/* Axis labels */}
        {[2, 4, 6, 8].map(v => (
          <g key={`ax${v}`}>
            <text x={sx(v)} y={oy + 14} textAnchor="middle" className="fill-gray-400 text-[9px]">{v}</text>
            <text x={ox - 10} y={sy(v) + 3} textAnchor="middle" className="fill-gray-400 text-[9px]">{v}</text>
          </g>
        ))}

        {/* Parallelogram dashed lines */}
        <line x1={sx(a.x)} y1={sy(a.y)} x2={sx(r.x)} y2={sy(r.y)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,3" opacity="0.6" />
        <line x1={sx(b.x)} y1={sy(b.y)} x2={sx(r.x)} y2={sy(r.y)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,3" opacity="0.6" />

        {/* Vector A */}
        {arrow(sx(0), sy(0), sx(a.x), sy(a.y), '#2563eb', 3)}
        <text x={sx(a.x / 2) - 10} y={sy(a.y / 2) - 6} className="fill-blue-600 dark:fill-blue-400 text-[12px] font-bold">A</text>

        {/* Vector B */}
        {arrow(sx(0), sy(0), sx(b.x), sy(b.y), '#16a34a', 3)}
        <text x={sx(b.x / 2) + 8} y={sy(b.y / 2) + 14} className="fill-green-600 dark:fill-green-400 text-[12px] font-bold">B</text>

        {/* Resultant R */}
        {arrow(sx(0), sy(0), sx(r.x), sy(r.y), '#dc2626', 3.5)}
        <text x={sx(r.x / 2) + 10} y={sy(r.y / 2) - 8} className="fill-red-600 dark:fill-red-400 text-[12px] font-bold">R</text>

        {/* Draggable endpoints */}
        <circle
          cx={sx(a.x)} cy={sy(a.y)} r="8"
          fill="#2563eb" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => { e.preventDefault(); handlePointerDown('a'); }}
        />
        <circle
          cx={sx(b.x)} cy={sy(b.y)} r="8"
          fill="#16a34a" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => { e.preventDefault(); handlePointerDown('b'); }}
        />

        {/* Origin dot */}
        <circle cx={sx(0)} cy={sy(0)} r="4" fill="#1e293b" className="dark:fill-white" />

        {/* Angle arc */}
        {magR > 0.5 && (
          <path
            d={`M ${sx(0) + 20} ${sy(0)} A 20 20 0 ${angleR > 180 ? 1 : 0} ${angleR >= 0 ? 0 : 1} ${sx(0) + 20 * Math.cos(angleR * Math.PI / 180)} ${sy(0) - 20 * Math.sin(angleR * Math.PI / 180)}`}
            fill="none" stroke="#f59e0b" strokeWidth="2"
          />
        )}

      </svg>

      {/* Info panel — outside SVG so it never overlaps the drawing */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
          <div className="font-bold text-blue-600 dark:text-blue-400">A = ({a.x}, {a.y})</div>
          <div className="text-gray-500 dark:text-gray-400">|A| = {magA.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
          <div className="font-bold text-green-600 dark:text-green-400">B = ({b.x}, {b.y})</div>
          <div className="text-gray-500 dark:text-gray-400">|B| = {magB.toFixed(2)}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
          <div className="font-bold text-red-600 dark:text-red-400">R = ({r.x}, {r.y})</div>
          <div className="text-gray-500 dark:text-gray-400">|R| = {magR.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-1 text-center text-xs text-gray-600 dark:text-gray-400">
        |R| = √({r.x}² + {r.y}²) = √{(r.x * r.x + r.y * r.y).toFixed(1)} ≈ <span className="font-bold">{magR.toFixed(2)}</span>
        <span className="mx-2">·</span>
        <span className="text-amber-600 dark:text-amber-400">θ = {angleR.toFixed(1)}°</span>
      </div>
      <div className="text-center mt-1">
        <span className="text-[10px] text-gray-500 dark:text-gray-400">Drag the </span>
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">blue</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400"> and </span>
        <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">green</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400"> endpoints to change the vectors</span>
      </div>
    </div>
  );
}
