/**
 * Two villages on opposite sides of a river, with a bridge connecting them.
 * The central support pillar of the bridge sits at the *midpoint* of the
 * two endpoints. Tara at one village, Bipin at the other; the pillar is in
 * the middle. Coordinates given for both villages, and the midpoint formula
 * applied.
 *
 * Used in the Midpoint and Slope section.
 */
import Tara from './people/Tara';
import Bipin from './people/Bipin';

export default function BridgeMidpointDiagram() {
  const W = 760, H = 380;

  // River runs across middle horizontally
  const riverY1 = 230, riverY2 = 290;
  const groundY1 = 320; // ground level

  // Two villages on coordinates
  // Village A (Tara) at (2, 5), Village B (Bipin) at (8, 11)
  // Map them to screen positions
  const Ax = 130, Ay = groundY1;
  const Bx = 630, By = groundY1;
  const Mx = (Ax + Bx) / 2, My = groundY1;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A bridge between two villages — its central support pillar sits at the midpoint of the two coordinates">

        <defs>
          <linearGradient id="sky-bm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={riverY1} fill="url(#sky-bm)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={riverY1} fill="#0f172a" className="hidden dark:block" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Where does the bridge pillar go?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          At the midpoint of the two villages.
        </text>

        {/* Banks */}
        <rect x="0" y={riverY1 - 30} width={W} height="30" fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />
        <rect x="0" y={riverY2} width={W} height={H - riverY2} fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />

        {/* River */}
        <rect x="0" y={riverY1} width={W} height={riverY2 - riverY1} fill="#60a5fa" className="dark:fill-blue-900" />
        {[80, 250, 460, 600].map((wx, i) => (
          <path key={i} d={`M ${wx} ${riverY1 + 18 + (i % 2) * 14} q 12 -6 24 0 q 12 6 24 0`}
            fill="none" stroke="#2563eb" strokeWidth="1.2" opacity="0.7" />
        ))}

        {/* Bridge — horizontal beam + supports */}
        {/* Bridge deck */}
        <rect x={Ax + 20} y={riverY1 - 8} width={Bx - Ax - 40} height="6" fill="#7c2d12" stroke="#451a03" strokeWidth="1" />
        <rect x={Ax + 20} y={riverY1 - 14} width={Bx - Ax - 40} height="6" fill="#a16207" stroke="#451a03" strokeWidth="1" />

        {/* Side support at A */}
        <line x1={Ax + 30} y1={riverY1 - 8} x2={Ax + 30} y2={groundY1} stroke="#7c2d12" strokeWidth="3" />
        {/* Side support at B */}
        <line x1={Bx - 30} y1={riverY1 - 8} x2={Bx - 30} y2={groundY1} stroke="#7c2d12" strokeWidth="3" />
        {/* CENTRAL pillar at midpoint */}
        <rect x={Mx - 5} y={riverY1 - 8} width="10" height={groundY1 - riverY1 + 8} fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.2" />
        {/* Pillar base in water */}
        <ellipse cx={Mx} cy={groundY1 - 4} rx="14" ry="4" fill="#7f1d1d" />

        {/* Houses at each end */}
        <g transform={`translate(${Ax - 50}, ${groundY1 - 60})`}>
          <rect x="0" y="20" width="50" height="40" fill="#fef9c3" stroke="#854d0e" strokeWidth="1.5" />
          <polygon points="-4,20 25,0 54,20" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
          <rect x="20" y="40" width="10" height="20" fill="#7c2d12" />
          <rect x="6" y="28" width="10" height="10" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="0.8" />
          <rect x="34" y="28" width="10" height="10" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="0.8" />
        </g>
        <g transform={`translate(${Bx - 0}, ${groundY1 - 60})`}>
          <rect x="0" y="20" width="50" height="40" fill="#fef9c3" stroke="#854d0e" strokeWidth="1.5" />
          <polygon points="-4,20 25,0 54,20" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          <rect x="20" y="40" width="10" height="20" fill="#7c2d12" />
          <rect x="6" y="28" width="10" height="10" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="0.8" />
          <rect x="34" y="28" width="10" height="10" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="0.8" />
        </g>

        {/* Tara at village A (left) */}
        <Tara x={Ax + 60} y={groundY1} scale={0.85} pose="standing" />

        {/* Bipin at village B (right) */}
        <Bipin x={Bx - 60} y={groundY1} scale={0.85} pose="standing" flip={true} />

        {/* Coordinate labels under each village */}
        <rect x={Ax - 60} y={groundY1 + 12} width="100" height="22" rx="11" fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={Ax - 10} y={groundY1 + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Village A (2, 5)
        </text>

        <rect x={Bx - 50} y={groundY1 + 12} width="110" height="22" rx="11" fill="white" stroke="#475569" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={Bx + 5} y={groundY1 + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Village B (8, 11)
        </text>

        {/* Midpoint label */}
        <rect x={Mx - 80} y={riverY1 - 56} width="160" height="36" rx="14"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={Mx} y={riverY1 - 41} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          Midpoint = ((2+8)/2, (5+11)/2)
        </text>
        <text x={Mx} y={riverY1 - 27} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          = (5, 8) ★
        </text>
        {/* Pointer to pillar */}
        <line x1={Mx} y1={riverY1 - 20} x2={Mx} y2={riverY1 - 8} stroke="#f59e0b" strokeWidth="1.5" />

        {/* Footer formula */}
        <rect x={W / 2 - 200} y={H - 28} width="400" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2) — the average of coords.
        </text>
      </svg>
    </div>
  );
}
