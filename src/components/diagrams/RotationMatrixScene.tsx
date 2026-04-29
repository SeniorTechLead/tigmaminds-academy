/**
 * A simple "before/after" — a square at the origin, then the same square
 * rotated 45° by a rotation matrix. Pure mathematical magic: a 2×2 matrix
 * rotates the entire plane.
 *
 * Used in the Transformations section.
 */
import Tara from './people/Tara';

export default function RotationMatrixScene() {
  const W = 760, H = 380;

  // Original square corners (relative to origin in plot space)
  const corners = [[40, 40], [80, 40], [80, 80], [40, 80]];

  // Rotation by 45° counter-clockwise
  const rot = (45 * Math.PI) / 180;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const rotated = corners.map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);

  // Translate plot space to screen
  const cx1 = 220, cy1 = 200; // before
  const cx2 = 540, cy2 = 200; // after
  const px = (cx: number, p: [number, number] | number[]) => cx + p[0];
  const py = (cy: number, p: [number, number] | number[]) => cy - p[1];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A 2 by 2 rotation matrix rotates a square by 45 degrees — matrices act on the plane">

        <rect x="0" y="0" width={W} height={H} fill="#f0f9ff" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          A matrix can rotate the entire plane
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          One 2×2 matrix → every point gets turned.
        </text>

        {/* Tara on lower left */}
        <Tara x={90} y={350} scale={0.8} pose="pointing" />

        {/* Before plot */}
        <g>
          <line x1={cx1 - 90} y1={cy1} x2={cx1 + 110} y2={cy1} stroke="#94a3b8" strokeWidth="1" />
          <line x1={cx1} y1={cy1 - 110} x2={cx1} y2={cy1 + 110} stroke="#94a3b8" strokeWidth="1" />
          {/* Square */}
          <polygon points={corners.map(p => `${px(cx1, p)},${py(cy1, p)}`).join(' ')}
            fill="#bae6fd" stroke="#0c4a6e" strokeWidth="2" />
          <text x={cx1} y={cy1 + 130} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-300">
            Before
          </text>
        </g>

        {/* Matrix in middle */}
        <g transform="translate(370, 165)">
          <path d="M 10 0 L 0 0 L 0 70 L 10 70" fill="none" stroke="#475569" strokeWidth="2" />
          <text x="22" y="28" fontSize="12" fill="#0f172a" className="dark:fill-gray-100">cos 45°</text>
          <text x="22" y="58" fontSize="12" fill="#0f172a" className="dark:fill-gray-100">sin 45°</text>
          <text x="76" y="28" fontSize="12" fill="#0f172a" className="dark:fill-gray-100">−sin 45°</text>
          <text x="76" y="58" fontSize="12" fill="#0f172a" className="dark:fill-gray-100">cos 45°</text>
          <path d="M 130 0 L 140 0 L 140 70 L 130 70" fill="none" stroke="#475569" strokeWidth="2" />
          <text x="70" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
            R(45°)
          </text>
          {/* Arrow showing transformation flow */}
          <path d="M -16 35 L -34 35" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arX-rm)" />
          <path d="M 154 35 L 174 35" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arX-rm)" />
          <defs>
            <marker id="arX-rm" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
            </marker>
          </defs>
        </g>

        {/* After plot */}
        <g>
          <line x1={cx2 - 110} y1={cy2} x2={cx2 + 110} y2={cy2} stroke="#94a3b8" strokeWidth="1" />
          <line x1={cx2} y1={cy2 - 110} x2={cx2} y2={cy2 + 110} stroke="#94a3b8" strokeWidth="1" />
          {/* Original square (faded outline) */}
          <polygon points={corners.map(p => `${px(cx2, p)},${py(cy2, p)}`).join(' ')}
            fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
          {/* Rotated square */}
          <polygon points={rotated.map(p => `${px(cx2, p)},${py(cy2, p)}`).join(' ')}
            fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
          <text x={cx2} y={cy2 + 130} textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e" className="dark:fill-amber-300">
            After (rotated 45°)
          </text>
        </g>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Multiply every point by the matrix R → the plane rotates. Same with stretches, reflections.
        </text>
      </svg>
    </div>
  );
}
