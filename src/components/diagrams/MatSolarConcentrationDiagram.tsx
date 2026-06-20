/**
 * Parabolic solar concentration: parallel sun rays reflect off a parabolic
 * mirror to a single focus point where a pot heats up.
 *
 * Used in the "Solar Concentration — Focusing Sunlight for Energy" section.
 */
export default function MatSolarConcentrationDiagram() {
  const W = 700, H = 320;
  // parabola: y = a(x-h)^2 + k opening right; we draw opening upward-left as a dish
  const focusX = 350, focusY = 175;
  // mirror points (a vertical parabola cup), rays come straight down and reflect to focus
  const rayXs = [250, 290, 330, 370, 410, 450];
  // mirror y at x: simple cup y = 250 + ((x-350)^2)/360
  const mirrorY = (x) => 250 + ((x - 350) ** 2) / 360;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="A parabolic mirror reflects parallel sunlight rays to a single focus point, where a pot is heated.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A parabola focuses all parallel rays to one point</text>

        {/* sun */}
        <circle cx="350" cy="58" r="22" fill="#fde047" stroke="#eab308" strokeWidth="2" className="dark:fill-yellow-500/60" />
        <text x="350" y="63" textAnchor="middle" fontSize="10" fontWeight="700" fill="#a16207" className="dark:fill-yellow-200">Sun</text>

        {/* parabolic mirror */}
        <path d="M230 290 Q350 130 470 290" fill="none" stroke="#475569" strokeWidth="4" className="dark:stroke-gray-300" />
        <text x="350" y="305" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">parabolic mirror</text>

        {/* incoming rays (down) then reflected to focus */}
        {rayXs.map((x, i) => {
          const my = mirrorY(x);
          return (
            <g key={i}>
              <line x1={x} y1="88" x2={x} y2={my} stroke="#facc15" strokeWidth="2" className="dark:stroke-yellow-400" />
              <line x1={x} y1={my} x2={focusX} y2={focusY} stroke="#f97316" strokeWidth="1.6" strokeDasharray="4 3" />
            </g>
          );
        })}

        {/* focus + pot */}
        <circle cx={focusX} cy={focusY} r="6" fill="#dc2626" className="dark:fill-red-400" />
        <rect x={focusX - 26} y={focusY + 6} width="52" height="30" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-600 dark:stroke-gray-300" />
        <text x={focusX} y={focusY + 26} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">pot</text>
        <text x={focusX + 44} y={focusY} fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">focus</text>
      </svg>
    </div>
  );
}
