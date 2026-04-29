/**
 * Tara holds a treasure map. Plot points spread across all four quadrants:
 * a tree (1, 2), a well (-3, 1), a stone (-2, -3), a chest (4, -2).
 * Visualises (x, y) coordinates and the four quadrants.
 *
 * Used to open the Coordinate Plane section. Different scene from
 * CityMapDistanceDiagram in coordinate-geometry.
 */
import Tara from './people/Tara';

export default function TreasureMapCoordinateDiagram() {
  const W = 720, H = 380;

  // Coordinate plane area
  const cx = 400, cy = 190;
  const unit = 28; // px per coord unit
  const half = 5;  // axes from -5 to +5

  // Convert (x, y) coords to screen
  const sx = (x: number) => cx + x * unit;
  const sy = (y: number) => cy - y * unit;

  // Treasure objects (x, y, emoji, label)
  const items = [
    { x: 1, y: 2, emoji: '🌳', label: 'Tree (1, 2)', quad: 'I' },
    { x: -3, y: 1, emoji: '⛲', label: 'Well (−3, 1)', quad: 'II' },
    { x: -2, y: -3, emoji: '🪨', label: 'Stone (−2, −3)', quad: 'III' },
    { x: 4, y: -2, emoji: '💎', label: 'Treasure (4, −2)', quad: 'IV' },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara reads a treasure map: every location has an (x, y) address on the coordinate plane">

        <rect x="0" y="0" width={W} height={H} fill="#fef3c7" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The treasure map
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Every spot has an (x, y) address.
        </text>

        {/* Tara on lower left */}
        <Tara x={120} y={350} scale={0.85} pose="pointing" />

        {/* Map "parchment" background */}
        <rect x={cx - half * unit - 16} y={cy - half * unit - 16} width={half * unit * 2 + 32} height={half * unit * 2 + 32}
          fill="#fef9c3" stroke="#92400e" strokeWidth="2" rx="3" className="dark:fill-amber-900/30" />

        {/* Light grid */}
        {Array.from({ length: half * 2 + 1 }).map((_, i) => {
          const v = i - half;
          if (v === 0) return null;
          return (
            <g key={i}>
              <line x1={sx(v)} y1={cy - half * unit} x2={sx(v)} y2={cy + half * unit} stroke="#cbd5e1" strokeWidth="0.6" opacity="0.7" />
              <line x1={cx - half * unit} y1={sy(v)} x2={cx + half * unit} y2={sy(v)} stroke="#cbd5e1" strokeWidth="0.6" opacity="0.7" />
            </g>
          );
        })}

        {/* Quadrant labels */}
        <text x={cx + 3 * unit} y={cy - 4 * unit + 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="#a16207" opacity="0.5">I</text>
        <text x={cx - 3 * unit} y={cy - 4 * unit + 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="#a16207" opacity="0.5">II</text>
        <text x={cx - 3 * unit} y={cy + 4 * unit + 6} textAnchor="middle" fontSize="14" fontWeight="700" fill="#a16207" opacity="0.5">III</text>
        <text x={cx + 3 * unit} y={cy + 4 * unit + 6} textAnchor="middle" fontSize="14" fontWeight="700" fill="#a16207" opacity="0.5">IV</text>

        {/* Axes */}
        <line x1={cx - half * unit - 8} y1={cy} x2={cx + half * unit + 12} y2={cy} stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#arX-tm)" />
        <line x1={cx} y1={cy + half * unit + 8} x2={cx} y2={cy - half * unit - 12} stroke="#0f172a" strokeWidth="1.8" markerEnd="url(#arY-tm)" />
        <defs>
          <marker id="arX-tm" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#0f172a" />
          </marker>
          <marker id="arY-tm" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#0f172a" />
          </marker>
        </defs>
        <text x={cx + half * unit + 18} y={cy + 4} fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">x</text>
        <text x={cx - 4} y={cy - half * unit - 18} fontSize="12" fontWeight="700" fill="#0f172a" textAnchor="end" className="dark:fill-gray-100">y</text>

        {/* Tick marks at integer positions */}
        {[-4, -2, 2, 4].map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={cy - 3} x2={sx(v)} y2={cy + 3} stroke="#0f172a" strokeWidth="1" />
            <text x={sx(v)} y={cy + 14} textAnchor="middle" fontSize="9" fill="#475569" className="dark:fill-gray-400">{v}</text>
            <line x1={cx - 3} y1={sy(v)} x2={cx + 3} y2={sy(v)} stroke="#0f172a" strokeWidth="1" />
            <text x={cx - 6} y={sy(v) + 3} textAnchor="end" fontSize="9" fill="#475569" className="dark:fill-gray-400">{v}</text>
          </g>
        ))}
        {/* Origin */}
        <circle cx={cx} cy={cy} r="3" fill="#0f172a" />
        <text x={cx + 6} y={cy + 14} fontSize="10" fill="#475569" className="dark:fill-gray-400">(0, 0)</text>

        {/* Plot the treasure items */}
        {items.map((item, i) => (
          <g key={i}>
            {/* Drop lines (dashed) from axes to point */}
            <line x1={sx(item.x)} y1={cy} x2={sx(item.x)} y2={sy(item.y)}
              stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1={cx} y1={sy(item.y)} x2={sx(item.x)} y2={sy(item.y)}
              stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            {/* Marker */}
            <circle cx={sx(item.x)} cy={sy(item.y)} r="14" fill="#fef3c7" stroke="#dc2626" strokeWidth="1.8" />
            <text x={sx(item.x)} y={sy(item.y) + 5} textAnchor="middle" fontSize="14">{item.emoji}</text>
          </g>
        ))}

        {/* Labels for each item — placed around the parchment */}
        {[
          { ...items[0], lx: cx + half * unit + 16, ly: cy - 2.5 * unit, color: '#16a34a' },
          { ...items[1], lx: cx - half * unit - 124, ly: cy - 2.5 * unit, color: '#3b82f6' },
          { ...items[2], lx: cx - half * unit - 124, ly: cy + 3 * unit, color: '#7c2d12' },
          { ...items[3], lx: cx + half * unit + 16, ly: cy + 3 * unit, color: '#dc2626' },
        ].map((item, i) => (
          <g key={`lbl-${i}`}>
            <rect x={item.lx} y={item.ly - 12} width="120" height="22" rx="11"
              fill="white" stroke={item.color} strokeWidth="1.2" className="dark:fill-gray-800" />
            <text x={item.lx + 60} y={item.ly + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill={item.color}>
              {item.label}
            </text>
          </g>
        ))}

        {/* Footer */}
        <rect x={W / 2 - 220} y={H - 28} width="440" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          (x, y): x = how far right (or left), y = how far up (or down).
        </text>
      </svg>
    </div>
  );
}
