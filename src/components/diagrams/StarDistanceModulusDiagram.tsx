export default function StarDistanceModulusDiagram() {
  return (
    <svg viewBox="0 0 580 331" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Distance modulus showing apparent vs absolute magnitude and how distance affects brightness">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Distance Modulus</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Apparent vs Absolute magnitude</text>

      {/* Formula */}
      <rect x="100" y="58" width="320" height="40" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="260" y="78" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700" fontFamily="serif">
        m - M = 5 log₁₀(d/10)
      </text>
      <text x="260" y="92" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">m = apparent mag, M = absolute mag, d = distance in parsecs</text>

      {/* Visual: same star at different distances */}
      {/* Close star */}
      <g>
        <circle cx="120" cy="155" r="12" fill="#fef3c7" />
        <circle cx="120" cy="155" r="18" fill="#fef3c7" opacity={0.15} />
        <text x="120" y="182" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">10 parsecs</text>
        <text x="120" y="195" textAnchor="middle" fill="#fbbf24" fontSize="10">m = M = +1.0</text>
        <text x="120" y="208" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(definition distance)</text>
      </g>

      {/* Medium star */}
      <g>
        <circle cx="260" cy="155" r="6" fill="#fef3c7" />
        <circle cx="260" cy="155" r="10" fill="#fef3c7" opacity={0.1} />
        <text x="260" y="182" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">100 parsecs</text>
        <text x="260" y="195" textAnchor="middle" fill="#fbbf24" fontSize="10">m = +6.0</text>
        <text x="260" y="208" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">looks 5 mag dimmer</text>
      </g>

      {/* Far star */}
      <g>
        <circle cx="400" cy="155" r="2" fill="#fef3c7" />
        <circle cx="400" cy="155" r="5" fill="#fef3c7" opacity={0.07} />
        <text x="400" y="182" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">1000 parsecs</text>
        <text x="400" y="195" textAnchor="middle" fill="#fbbf24" fontSize="10">m = +11.0</text>
        <text x="400" y="208" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">needs telescope</text>
      </g>

      {/* Distance line */}
      <line x1="80" y1="220" x2="440" y2="220" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <polygon points="440,217 450,220 440,223" fill="#475569" />
      <text x="450" y="224" className="fill-gray-400 dark:fill-slate-500" fontSize="8">far</text>

      {/* Arrows between */}
      <line x1="145" y1="155" x2="240" y2="155" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="280" y1="155" x2="385" y2="155" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />

      {/* Key insight */}
      <rect x="60" y="235" width="400" height="52" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="253" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Same star, different apparent brightness</text>
      <text x="260" y="268" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Absolute magnitude (M) = how bright at standard 10 parsecs</text>
      <text x="260" y="281" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Sun: m = -26.7 (close!) but M = +4.8 (just average)</text>
    </svg>
  );
}
