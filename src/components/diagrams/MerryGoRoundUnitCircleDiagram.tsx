/**
 * Merry-go-round scene: Tara stands on a spinning platform (the unit circle).
 * Her position on the circle is (cos θ, sin θ). As she rotates, those
 * coordinates trace out the sine and cosine waves.
 *
 * Used to open the Unit Circle section — connects "going around in a circle"
 * (the playground experience) to the abstract definition.
 */
import Tara from './people/Tara';

export default function MerryGoRoundUnitCircleDiagram() {
  const W = 640, H = 460;
  const cx = 240, cy = 270;       // centre of the merry-go-round
  const radius = 140;             // platform radius

  // Tara's angle (60° from the positive x-axis, counter-clockwise)
  const theta = 60;
  const thetaRad = (theta * Math.PI) / 180;
  const taraX = cx + radius * Math.cos(thetaRad);
  const taraY = cy - radius * Math.sin(thetaRad);

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara stands on a merry-go-round; her position is (cos θ, sin θ)">

        <defs>
          <radialGradient id="ground-mgr" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#fef3c7" />
            <stop offset="1" stopColor="#fde68a" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Coordinate axes — the unit-circle frame */}
        <line x1={cx - radius - 30} y1={cy} x2={cx + radius + 30} y2={cy}
          stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#axR-mgr)" className="dark:stroke-gray-500" />
        <line x1={cx} y1={cy + radius + 30} x2={cx} y2={cy - radius - 30}
          stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#axU-mgr)" className="dark:stroke-gray-500" />
        <defs>
          <marker id="axR-mgr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
          <marker id="axU-mgr" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={cx + radius + 36} y={cy + 4} fontSize="14" fontWeight="700" fill="#475569" className="dark:fill-gray-300">x</text>
        <text x={cx - 4} y={cy - radius - 36} fontSize="14" fontWeight="700" fill="#475569" textAnchor="end" className="dark:fill-gray-300">y</text>

        {/* Merry-go-round platform — the unit circle, drawn as a wooden disc */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#ground-mgr)" stroke="#92400e" strokeWidth="2.5" className="dark:fill-amber-900/30" />
        {/* Wood-plank texture: radial spokes */}
        {[0, 30, 60, 90, 120, 150].map(a => {
          const ar = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={cx + radius * Math.cos(ar)} y1={cy + radius * Math.sin(ar)}
              x2={cx - radius * Math.cos(ar)} y2={cy - radius * Math.sin(ar)}
              stroke="#92400e" strokeWidth="0.6" opacity="0.4" />
          );
        })}
        {/* Centre post */}
        <circle cx={cx} cy={cy} r="8" fill="#451a03" stroke="#1c1917" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="3" fill="#fbbf24" />

        {/* Origin label */}
        <text x={cx + 14} y={cy + 18} fontSize="12" fontWeight="600" fill="#475569" className="dark:fill-gray-400">(0, 0)</text>

        {/* The angle θ swept from positive x-axis to Tara's position */}
        <path d={`M ${cx + 40} ${cy} A 40 40 0 0 0 ${cx + 40 * Math.cos(thetaRad)} ${cy - 40 * Math.sin(thetaRad)}`}
          fill="none" stroke="#f97316" strokeWidth="2.5" />
        <text x={cx + 50} y={cy - 16} fontSize="18" fontWeight="700" fill="#ea580c">θ</text>

        {/* Radius line from origin to Tara's feet position on circle */}
        <line x1={cx} y1={cy} x2={taraX} y2={taraY}
          stroke="#f97316" strokeWidth="2" strokeDasharray="5 4" />

        {/* Tara — standing on the circle. Place her feet at the (cos θ, sin θ) point.
            Tara's feet are at her local origin; placing her at (taraX, taraY) puts feet on the circle. */}
        <Tara x={taraX} y={taraY} scale={0.7} pose="standing" />

        {/* Drop perpendicular to x-axis, then to y-axis — show coordinates */}
        <line x1={taraX} y1={taraY} x2={taraX} y2={cy}
          stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1={taraX} y1={taraY} x2={cx} y2={taraY}
          stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* x-coordinate label (cos θ) */}
        <rect x={(cx + taraX) / 2 - 30} y={cy + 8} width="60" height="20" rx="10"
          fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" className="dark:fill-blue-900/50 dark:stroke-blue-400" />
        <text x={(cx + taraX) / 2} y={cy + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-200">
          x = cos θ
        </text>

        {/* y-coordinate label (sin θ) */}
        <rect x={taraX + 12} y={(cy + taraY) / 2 - 10} width="60" height="20" rx="10"
          fill="#d1fae5" stroke="#10b981" strokeWidth="1" className="dark:fill-emerald-900/50 dark:stroke-emerald-400" />
        <text x={taraX + 42} y={(cy + taraY) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857" className="dark:fill-emerald-200">
          y = sin θ
        </text>

        {/* Tara's coordinate label — to the right of Tara, near the empty corner */}
        <line x1={taraX + 12} y1={taraY - 60} x2={taraX + 60} y2={taraY - 110}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
        <rect x={taraX + 60} y={taraY - 124} width="130" height="28" rx="14"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={taraX + 125} y={taraY - 105} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          (cos 60°, sin 60°)
        </text>

        {/* Caption — top-LEFT (Tara is in upper right, so use the left) */}
        <rect x="20" y="14" width="240" height="62" rx="8"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara on a merry-go-round
        </text>
        <text x="32" y="51" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Pick any angle θ. Her position on the
        </text>
        <text x="32" y="65" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          circle is (cos θ, sin θ).
        </text>
      </svg>
    </div>
  );
}
