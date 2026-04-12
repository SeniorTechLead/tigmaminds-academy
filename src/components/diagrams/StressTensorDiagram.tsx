'use client';
import { useState } from 'react';

/**
 * Visual showing what a stress tensor means physically.
 * A small cube with arrows showing the force components on each face.
 */

type Face = 'x' | 'y' | 'z';

const FACES: { key: Face; label: string; color: string; desc: string }[] = [
  { key: 'x', label: 'Surface facing x', color: '#2563eb', desc: 'Forces on the surface whose normal points in the x-direction' },
  { key: 'y', label: 'Surface facing y', color: '#16a34a', desc: 'Forces on the surface whose normal points in the y-direction' },
  { key: 'z', label: 'Surface facing z', color: '#dc2626', desc: 'Forces on the surface whose normal points in the z-direction' },
];

export default function StressTensorDiagram() {
  const [face, setFace] = useState<Face>('x');

  const W = 340, H = 260;

  // Isometric cube drawing
  const cx = W / 2, cy = H / 2 + 10;
  const s = 55; // cube half-size
  // Isometric projection angles
  const ax = 0.866 * s, ay = 0.5 * s;

  // Cube corners in isometric view (centered at cx, cy)
  // Front-bottom-left is origin
  const pts = {
    fbl: [cx - ax, cy + ay],
    fbr: [cx + ax, cy + ay],
    ftl: [cx - ax, cy + ay - s * 1.2],
    ftr: [cx + ax, cy + ay - s * 1.2],
    bbl: [cx, cy],
    bbr: [cx + 2 * ax, cy],
    btl: [cx, cy - s * 1.2],
    btr: [cx + 2 * ax, cy - s * 1.2],
  };

  // Simplified: draw 3 visible faces of a cube
  const frontFace = `${pts.fbl[0]},${pts.fbl[1]} ${pts.fbr[0]},${pts.fbr[1]} ${pts.ftr[0]},${pts.ftr[1]} ${pts.ftl[0]},${pts.ftl[1]}`;
  const topFace = `${pts.ftl[0]},${pts.ftl[1]} ${pts.ftr[0]},${pts.ftr[1]} ${pts.btr[0]},${pts.btr[1]} ${pts.btl[0]},${pts.btl[1]}`;
  const rightFace = `${pts.fbr[0]},${pts.fbr[1]} ${pts.bbr[0]},${pts.bbr[1]} ${pts.btr[0]},${pts.btr[1]} ${pts.ftr[0]},${pts.ftr[1]}`;

  // Face centers for arrow origins
  const frontCenter = [(pts.fbl[0] + pts.ftr[0]) / 2, (pts.fbl[1] + pts.ftr[1]) / 2];
  const topCenter = [(pts.ftl[0] + pts.btr[0]) / 2, (pts.ftl[1] + pts.btr[1]) / 2];
  const rightCenter = [(pts.fbr[0] + pts.btr[0]) / 2, (pts.fbr[1] + pts.btr[1]) / 2];

  const highlight = face === 'x' ? 'front' : face === 'y' ? 'top' : 'right';

  const arrowLine = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
    const id = `ah${label.replace(/[^a-z]/gi, '')}`;
    return (
      <g>
        <defs>
          <marker id={id} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d={`M0,0 L6,2 L0,4`} fill={color} />
          </marker>
        </defs>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd={`url(#${id})`} />
        <text x={x2 + (x2 > x1 ? 4 : -4)} y={y2 + (y2 > y1 ? 12 : -4)} fontSize="9" fill={color} fontWeight="600" textAnchor={x2 > x1 ? 'start' : 'end'}>
          {label}
        </text>
      </g>
    );
  };

  // Arrows for the selected face
  const arrows = (() => {
    if (face === 'x') {
      const [ox, oy] = frontCenter;
      return (
        <>
          {arrowLine(ox, oy, ox - 40, oy, '#ef4444', 'σ_xx')}
          {arrowLine(ox, oy, ox + 25, oy - 25, '#f59e0b', 'σ_xy')}
          {arrowLine(ox, oy, ox, oy - 35, '#8b5cf6', 'σ_xz')}
        </>
      );
    }
    if (face === 'y') {
      const [ox, oy] = topCenter;
      return (
        <>
          {arrowLine(ox, oy, ox - 25, oy + 20, '#f59e0b', 'σ_yx')}
          {arrowLine(ox, oy, ox, oy - 35, '#ef4444', 'σ_yy')}
          {arrowLine(ox, oy, ox + 30, oy - 10, '#8b5cf6', 'σ_yz')}
        </>
      );
    }
    // z
    const [ox, oy] = rightCenter;
    return (
      <>
        {arrowLine(ox, oy, ox + 35, oy, '#f59e0b', 'σ_zx')}
        {arrowLine(ox, oy, ox + 15, oy - 30, '#f59e0b', 'σ_zy')}
        {arrowLine(ox, oy, ox + 35, oy + 15, '#ef4444', 'σ_zz')}
      </>
    );
  })();

  const faceInfo = FACES.find(f => f.key === face)!;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {FACES.map(f => (
          <button
            key={f.key}
            onClick={() => setFace(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              face === f.key
                ? `bg-blue-500 text-white`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Back edges (hidden) */}
        <line x1={pts.bbl[0]} y1={pts.bbl[1]} x2={pts.fbl[0]} y2={pts.fbl[1]} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={pts.bbl[0]} y1={pts.bbl[1]} x2={pts.bbr[0]} y2={pts.bbr[1]} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={pts.bbl[0]} y1={pts.bbl[1]} x2={pts.btl[0]} y2={pts.btl[1]} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />

        {/* Front face */}
        <polygon points={frontFace} fill={highlight === 'front' ? 'rgba(37,99,235,0.15)' : 'rgba(0,0,0,0.02)'} stroke="#94a3b8" strokeWidth="1.5" />
        {/* Top face */}
        <polygon points={topFace} fill={highlight === 'top' ? 'rgba(22,163,74,0.15)' : 'rgba(0,0,0,0.01)'} stroke="#94a3b8" strokeWidth="1.5" />
        {/* Right face */}
        <polygon points={rightFace} fill={highlight === 'right' ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.02)'} stroke="#94a3b8" strokeWidth="1.5" />

        {/* Stress arrows */}
        {arrows}

        {/* Axis labels */}
        <text x={pts.fbl[0] - 15} y={pts.fbl[1] + 5} fontSize="11" fill="#2563eb" fontWeight="700">x</text>
        <text x={pts.bbr[0] + 8} y={pts.bbr[1] + 5} fontSize="11" fill="#16a34a" fontWeight="700">y</text>
        <text x={pts.btl[0] - 5} y={pts.btl[1] - 8} fontSize="11" fill="#dc2626" fontWeight="700">z</text>
      </svg>

      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        <span className="font-semibold" style={{ color: faceInfo.color }}>{faceInfo.label}:</span> {faceInfo.desc}.
        The <span className="text-red-500 font-semibold">red</span> arrow is compression/tension (normal stress), the others are <span className="text-amber-500 font-semibold">shear</span> (sliding forces).
      </div>
    </div>
  );
}
