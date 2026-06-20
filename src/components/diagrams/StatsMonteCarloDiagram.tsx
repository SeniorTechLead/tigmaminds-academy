/**
 * Monte Carlo: estimate π by throwing random darts at a square with an inscribed
 * quarter circle. Fraction landing inside ≈ π/4.
 *
 * Used in the "Monte Carlo Simulation" section.
 */
export default function StatsMonteCarloDiagram() {
  const W = 640, H = 340;
  const ox = 60, oy = 70, side = 200;
  // deterministic pseudo-points (no Math.random — must be stable)
  const pts = [];
  let seed = 7;
  for (let i = 0; i < 80; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const x = (seed % 1000) / 1000;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const y = (seed % 1000) / 1000;
    pts.push({ x, y, inside: x * x + y * y <= 1 });
  }
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Monte Carlo estimation of pi: random darts thrown at a square; the fraction landing inside the quarter circle approximates pi over four.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Estimate by random sampling</text>

        {/* square */}
        <rect x={ox} y={oy} width={side} height={side} fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-gray-500" />
        {/* quarter circle (radius = side, centered at bottom-left corner) */}
        <path d={`M ${ox} ${oy + side} A ${side} ${side} 0 0 1 ${ox + side} ${oy} L ${ox} ${oy} Z`} fill="#dbeafe" opacity="0.55" className="dark:fill-blue-900/30" />
        <path d={`M ${ox + side} ${oy} A ${side} ${side} 0 0 0 ${ox} ${oy + side}`} fill="none" stroke="#3b82f6" strokeWidth="2" className="dark:stroke-blue-400" />

        {pts.map((p, i) => (
          <circle key={i} cx={ox + p.x * side} cy={oy + side - p.y * side} r="3"
            fill={p.inside ? '#16a34a' : '#dc2626'} />
        ))}

        {/* legend */}
        <circle cx={ox + side + 50} cy={oy + 30} r="5" fill="#16a34a" />
        <text x={ox + side + 62} y={oy + 34} fontSize="11" fill="#334155" className="dark:fill-gray-200">inside</text>
        <circle cx={ox + side + 50} cy={oy + 56} r="5" fill="#dc2626" />
        <text x={ox + side + 62} y={oy + 60} fontSize="11" fill="#334155" className="dark:fill-gray-200">outside</text>
        <text x={ox + side + 30} y={oy + 110} fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">inside / total</text>
        <text x={ox + side + 30} y={oy + 130} fontSize="12" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">≈ π / 4</text>
        <text x={ox} y={oy + side + 30} fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">More darts → better estimate. No formula needed.</text>
      </svg>
    </div>
  );
}
