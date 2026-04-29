/**
 * River-width scene: Tara stands at point A on one bank, directly across from
 * a tree (point B) on the opposite bank. She walks 30 m along her bank to
 * point C and measures the angle ACB. Trigonometry gives her the river width
 * AB without needing to cross.
 *
 * Used in the Heights and Distances section.
 */
import Tara from './people/Tara';

export default function RiverWidthDiagram() {
  const W = 640, H = 380;

  // River runs horizontally across the middle
  const bankNearY = 240;   // Tara's bank
  const bankFarY = 110;    // far bank
  const riverColor = '#60a5fa';

  // Points
  const A = { x: 130, y: bankNearY - 5 };  // Tara's start
  const B = { x: 130, y: bankFarY + 5 };   // tree on opposite bank, directly across from A
  const C = { x: 410, y: bankNearY - 5 };  // Tara walks 30 m to C

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara measures the width of a river without crossing it">

        {/* Sky/grass on far bank */}
        <rect x="0" y="0" width={W} height={bankFarY} fill="#bae6fd" className="dark:fill-gray-800" />
        <rect x="0" y={bankFarY} width={W} height="20" fill="#84cc16" opacity="0.7" className="dark:fill-emerald-900" />

        {/* River */}
        <rect x="0" y={bankFarY + 18} width={W} height={bankNearY - bankFarY - 18} fill={riverColor} className="dark:fill-blue-900" />
        {/* Wave details */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <path key={i}
            d={`M ${50 + i * 100} ${bankFarY + 50 + (i % 2) * 30} q 10 -5 20 0 q 10 5 20 0`}
            fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.6" />
        ))}
        {[0, 1, 2, 3].map(i => (
          <path key={`w2-${i}`}
            d={`M ${100 + i * 130} ${bankFarY + 90 + (i % 2) * 20} q 10 -4 20 0 q 10 4 20 0`}
            fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.5" />
        ))}

        {/* Near bank (grass) */}
        <rect x="0" y={bankNearY - 10} width={W} height={H - bankNearY + 10} fill="#84cc16" opacity="0.7" className="dark:fill-emerald-900" />
        <line x1="0" y1={bankNearY - 10} x2={W} y2={bankNearY - 10} stroke="#65a30d" strokeWidth="1.5" className="dark:stroke-emerald-700" />

        {/* Tree at point B (on far bank) */}
        <rect x={B.x - 4} y={B.y - 35} width="8" height="35" fill="#92400e" stroke="#451a03" strokeWidth="1" />
        <circle cx={B.x} cy={B.y - 50} r="22" fill="#15803d" stroke="#14532d" strokeWidth="1.2" className="dark:fill-green-700" />
        <circle cx={B.x - 12} cy={B.y - 42} r="16" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" className="dark:fill-green-600" />
        <circle cx={B.x + 12} cy={B.y - 45} r="16" fill="#16a34a" stroke="#14532d" strokeWidth="1.2" className="dark:fill-green-700" />

        {/* Tara at point C (after walking 30 m), pointing across at the tree */}
        <Tara x={C.x} y={C.y} scale={0.85} pose="pointing" flip={true} />

        {/* Marker at point A (Tara's starting position) — small footprint */}
        <ellipse cx={A.x} cy={A.y + 3} rx="8" ry="3" fill="#475569" opacity="0.5" />
        <ellipse cx={A.x - 5} cy={A.y + 3} rx="3" ry="1.5" fill="#475569" />
        <ellipse cx={A.x + 5} cy={A.y + 3} rx="3" ry="1.5" fill="#475569" />

        {/* Triangle ABC — the right triangle */}
        {/* A to B (river width, perpendicular) */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
          stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />
        {/* A to C (along bank) */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y}
          stroke="#f97316" strokeWidth="2.5" />
        {/* C to B (line of sight from C to the tree) */}
        <line x1={C.x} y1={C.y} x2={B.x} y2={B.y}
          stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 4" />

        {/* Right angle marker at A */}
        <polyline points={`${A.x + 14} ${A.y} ${A.x + 14} ${A.y - 14} ${A.x} ${A.y - 14}`}
          fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* Angle at C */}
        <path d={`M ${C.x - 35} ${C.y} A 35 35 0 0 0 ${C.x - 32.6} ${C.y - 12.9}`}
          fill="none" stroke="#a855f7" strokeWidth="2" />
        <text x={C.x - 50} y={C.y - 6} fontSize="14" fontWeight="700" fill="#9333ea">55°</text>

        {/* Point labels */}
        <circle cx={A.x} cy={A.y} r="4" fill="#1e293b" />
        <text x={A.x - 16} y={A.y + 4} fontSize="14" fontWeight="700" fill="#1e293b" textAnchor="end" className="dark:fill-gray-100">A</text>

        <circle cx={B.x} cy={B.y} r="4" fill="#dc2626" />
        <text x={B.x - 12} y={B.y + 14} fontSize="14" fontWeight="700" fill="#1e293b" textAnchor="end" className="dark:fill-gray-100">B</text>

        <circle cx={C.x} cy={C.y} r="4" fill="#1e293b" />
        <text x={C.x + 8} y={C.y + 14} fontSize="14" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">C</text>

        {/* "30 m" label along AC */}
        <rect x={(A.x + C.x) / 2 - 22} y={C.y + 18} width="44" height="20" rx="10"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={(A.x + C.x) / 2} y={C.y + 32} textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          30 m
        </text>

        {/* "width = ?" label along AB */}
        <rect x={A.x - 70} y={(A.y + B.y) / 2 - 11} width="60" height="22" rx="11"
          fill="#d1fae5" stroke="#10b981" strokeWidth="1.2" className="dark:fill-emerald-900/40 dark:stroke-emerald-400" />
        <text x={A.x - 40} y={(A.y + B.y) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857" className="dark:fill-emerald-200">
          w = ?
        </text>

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          How wide is the river?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Walk along the bank, sight back to the tree, measure the angle.
        </text>
      </svg>
    </div>
  );
}
