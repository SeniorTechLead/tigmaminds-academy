/**
 * BethlehemCelestialNavDiagram — How ancient travelers navigated
 * using stars, showing Polaris, altitude angle, and latitude.
 */
export default function BethlehemCelestialNavDiagram() {
  // Traveler on the ground looking up at Polaris
  const horizonY = 190;
  const personX = 100;
  const polarisAngle = 32; // degrees (latitude of Bethlehem ~31.7)
  const angleRad = (polarisAngle * Math.PI) / 180;

  const starDist = 140;
  const polarisX = personX + starDist * Math.cos(angleRad);
  const polarisY = horizonY - starDist * Math.sin(angleRad);

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Celestial navigation using Polaris to determine latitude">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />

        <text x="200" y="18" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="12" fontWeight="bold">Finding Your Latitude from the Stars</text>

        {/* Night sky background */}
        <rect x="10" y="30" width="380" height="165" rx="6" fill="#0f172a" opacity="0.85" />

        {/* Scattered stars */}
        {[[60, 55], [150, 45], [220, 65], [280, 50], [340, 60], [310, 90], [90, 100], [170, 110], [350, 120], [250, 130]].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={i < 3 ? 1.5 : 1} fill="#e2e8f0" opacity={0.3 + (i % 3) * 0.2} />
        ))}

        {/* Polaris (bright) */}
        <circle cx={polarisX} cy={polarisY} r="4" fill="#fbbf24" />
        <circle cx={polarisX} cy={polarisY} r="8" fill="#fbbf24" opacity="0.15" />
        <text x={polarisX} y={polarisY - 12} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Polaris</text>
        <text x={polarisX} y={polarisY - 24} textAnchor="middle" fill="#fbbf24" fontSize="10">(North Star)</text>

        {/* Ground/horizon */}
        <line x1="10" y1={horizonY} x2="390" y2={horizonY} stroke="#4ade80" strokeWidth="2" />
        <text x="370" y={horizonY + 14} textAnchor="end" fill="#4ade80" fontSize="10">Horizon</text>

        {/* Person (simple stick figure) */}
        <circle cx={personX} cy={horizonY - 30} r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1={personX} y1={horizonY - 25} x2={personX} y2={horizonY - 5} stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1={personX} y1={horizonY - 5} x2={personX - 6} y2={horizonY} stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1={personX} y1={horizonY - 5} x2={personX + 6} y2={horizonY} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Sight line to Polaris */}
        <line x1={personX} y1={horizonY - 30} x2={polarisX} y2={polarisY} stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Horizontal reference line */}
        <line x1={personX} y1={horizonY - 30} x2={personX + 100} y2={horizonY - 30} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

        {/* Angle arc */}
        <path d={`M ${personX + 40},${horizonY - 30} A 40 40 0 0 0 ${personX + 40 * Math.cos(angleRad)},${horizonY - 30 - 40 * Math.sin(angleRad)}`} fill="none" stroke="#f472b6" strokeWidth="1.5" />
        <text x={personX + 52} y={horizonY - 38} fill="#f472b6" fontSize="11" fontWeight="bold">32°</text>

        {/* Info panel below */}
        <text x="200" y="212" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Angle of Polaris above horizon = Your latitude</text>
        <text x="200" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Bethlehem is at 31.7° N — Polaris sits ~32° above the horizon</text>
        <text x="200" y="244" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">The Magi could track their latitude every clear night</text>
      </svg>
    </div>
  );
}
