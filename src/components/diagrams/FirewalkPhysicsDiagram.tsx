export default function FirewalkPhysicsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 748 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Three factors that make firewalking possible: low conductivity, low heat capacity, and brief contact time">
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Why Firewalking Works: Three Factors</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">No single factor explains it — all three work together</text>

        {/* Central foot icon */}
        <ellipse cx="350" cy="200" rx="40" ry="18" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="350" y="204" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Foot on coal</text>

        {/* Factor 1: Low conductivity */}
        <g>
          <line x1="185" y1="120" x2="310" y2="190" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="40" y="70" width="200" height="90" rx="8" className="fill-red-50 dark:fill-red-900/10" stroke="#ef4444" strokeWidth="1.5" />
          <text x="140" y="95" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">1. Low Conductivity</text>
          <text x="140" y="115" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Charcoal: 0.05 W/m·K</text>
          <text x="140" y="130" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Heat flows slowly to skin</text>
          <text x="140" y="148" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(÷ 7,700 vs copper)</text>
        </g>

        {/* Factor 2: Low heat capacity per volume */}
        <g>
          <line x1="515" y1="120" x2="390" y2="190" stroke="#3b82f6" strokeWidth="1.5" />
          <rect x="460" y="70" width="200" height="90" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="560" y="95" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b82f6">2. Low Stored Energy</text>
          <text x="560" y="115" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Charcoal is light (250 kg/m³)</text>
          <text x="560" y="130" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Little energy per cm³</text>
          <text x="560" y="148" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(surface cools on contact)</text>
        </g>

        {/* Factor 3: Brief contact */}
        <g>
          <line x1="350" y1="270" x2="350" y2="218" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="220" y="270" width="260" height="80" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1.5" />
          <text x="350" y="295" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">3. Brief Contact (&lt; 1 second)</text>
          <text x="350" y="315" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Burn damage ∝ contact time</text>
          <text x="350" y="332" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Quick steps = not enough time for heat to penetrate</text>
        </g>

        {/* Bonus factor */}
        <text x="350" y="378" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Bonus factor: the Leidenfrost effect may create a thin steam layer from foot moisture</text>

        {/* Warning */}
        <rect x="150" y="395" width="400" height="28" rx="6" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="1" />
        <text x="350" y="413" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">⚠️ Never attempt firewalking without expert supervision — metal at the same temperature would cause instant burns</text>
      </svg>
    </div>
  );
}
