/**
 * MuezzinInverseSquareDiagram — Shows how sound intensity drops with distance
 * following the inverse square law: I = P / (4*pi*r^2).
 */
export default function MuezzinInverseSquareDiagram() {
  const cx = 60;
  const cy = 140;
  const rings = [
    { r: 40, label: '1r', intensity: '100%', color: '#f97316' },
    { r: 80, label: '2r', intensity: '25%', color: '#fb923c' },
    { r: 120, label: '3r', intensity: '11%', color: '#fdba74' },
    { r: 160, label: '4r', intensity: '6.3%', color: '#fed7aa' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 420 280" className="w-full" role="img" aria-label="Inverse square law: sound intensity drops as 1 over distance squared">
        <rect width="420" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="210" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Why the Muezzin Needs Height: Inverse Square Law</text>
        <text x="210" y="40" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">Intensity = Power / (4πr²)</text>

        {/* Source (minaret top) */}
        <rect x={cx - 5} y={cy - 50} width="10" height="50" fill="#a16207" opacity="0.6" />
        <rect x={cx - 12} y={cy - 55} width="24" height="10" rx="3" fill="#ca8a04" />
        <circle cx={cx} cy={cy - 60} r="6" fill="#f97316" />
        <text x={cx} y={cy - 70} textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Source</text>

        {/* Concentric arcs */}
        {rings.map((ring, i) => (
          <g key={i}>
            <path
              d={`M ${cx} ${cy - ring.r} A ${ring.r} ${ring.r} 0 0 1 ${cx + ring.r} ${cy}`}
              fill="none"
              stroke={ring.color}
              strokeWidth={3 - i * 0.5}
              strokeDasharray={i > 0 ? '4 3' : 'none'}
              opacity={1 - i * 0.15}
            />
            <text x={cx + ring.r + 5} y={cy + 5} fill={ring.color} fontSize="10" fontWeight="bold">{ring.label}</text>
          </g>
        ))}

        {/* Intensity bars on the right */}
        <text x="290" y="70" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="11" fontWeight="bold">Sound Intensity</text>
        {rings.map((ring, i) => {
          const barY = 80 + i * 35;
          const barW = [140, 35, 15.5, 8.8][i];
          return (
            <g key={i}>
              <text x="230" y={barY + 14} textAnchor="end" className="fill-gray-600 dark:fill-slate-400" fontSize="10">{ring.label}:</text>
              <rect x="235" y={barY + 2} width={barW} height="16" rx="3" fill={ring.color} opacity="0.7" />
              <text x={240 + barW} y={barY + 14} className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">{ring.intensity}</text>
            </g>
          );
        })}

        {/* Explanation */}
        <rect x="220" y="220" width="190" height="48" rx="5" className="fill-amber-50 dark:fill-amber-900/20" stroke="#f59e0b" strokeWidth="1" />
        <text x="315" y="236" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300" fontSize="10" fontWeight="bold">Double the distance →</text>
        <text x="315" y="250" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300" fontSize="10" fontWeight="bold">¼ the intensity (not half!)</text>
        <text x="315" y="262" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Energy spreads over 4× the area</text>

        {/* Area explanation visual */}
        <rect x="30" y="200" width="20" height="20" fill="#f97316" opacity="0.6" stroke="#ea580c" strokeWidth="1" />
        <text x="40" y="237" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">At r: 1 unit²</text>

        <rect x="70" y="195" width="40" height="40" fill="#fdba74" opacity="0.4" stroke="#f97316" strokeWidth="1" />
        <text x="90" y="247" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">At 2r: 4 unit²</text>

        <text x="140" y="220" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="10">Same energy,</text>
        <text x="140" y="233" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="10">bigger area</text>
      </svg>
    </div>
  );
}
