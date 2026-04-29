export default function BeeHiveTempDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 400" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee hive thermoregulation diagram maintaining temperature at 35 degrees Celsius">
        <rect width="560" height="400" rx="12" className="fill-slate-900" />

        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Hive Thermoregulation</text>
        <text x="280" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Maintaining brood nest at exactly 35°C (95°F)</text>

        {/* Central hive cross-section */}
        <g transform="translate(280, 195)">
          {/* Outer hive shell */}
          <ellipse cx="0" cy="0" rx="100" ry="80" fill="#78350f" opacity="0.25" stroke="#a16207" strokeWidth="2" />

          {/* Brood nest — inner warm zone */}
          <ellipse cx="0" cy="0" rx="50" ry="40" fill="#f59e0b" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />

          {/* Temperature label */}
          <text x="0" y="-5" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fbbf24">35°C</text>
          <text x="0" y="14" textAnchor="middle" fontSize="10" fill="#fcd34d">Brood Nest</text>

          {/* Heat rings */}
          {[55, 70, 85].map((r, i) => (
            <ellipse
              key={r}
              cx="0" cy="0"
              rx={r} ry={r * 0.8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.5"
              opacity={0.3 - i * 0.08}
              strokeDasharray="3,4"
            />
          ))}
        </g>

        {/* TOO HOT — left side */}
        <g transform="translate(70, 130)">
          <rect x="-50" y="-18" width="100" height="36" rx="6" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">TOO HOT</text>
          <text x="0" y="15" textAnchor="middle" fontSize="10" fill="#ef4444">&gt;36°C</text>
        </g>

        {/* Cooling strategies — left */}
        <g transform="translate(70, 190)">
          {/* Fanning */}
          <circle cx="0" cy="0" r="18" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="16">🌀</text>
          <text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">Wing fanning</text>
          <text x="0" y="45" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">at hive entrance</text>
        </g>

        <g transform="translate(70, 280)">
          {/* Water evaporation */}
          <circle cx="0" cy="0" r="18" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="16">💧</text>
          <text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">Water droplets</text>
          <text x="0" y="45" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">spread on comb</text>
        </g>

        {/* TOO COLD — right side */}
        <g transform="translate(490, 130)">
          <rect x="-50" y="-18" width="100" height="36" rx="6" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
          <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3b82f6">TOO COLD</text>
          <text x="0" y="15" textAnchor="middle" fontSize="10" fill="#3b82f6">&lt;34°C</text>
        </g>

        {/* Heating strategies — right */}
        <g transform="translate(490, 190)">
          {/* Shivering */}
          <circle cx="0" cy="0" r="18" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="16">⚡</text>
          <text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">Muscle shivering</text>
          <text x="0" y="45" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">flight muscles vibrate</text>
        </g>

        <g transform="translate(490, 280)">
          {/* Clustering */}
          <circle cx="0" cy="0" r="18" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontSize="16">🐝</text>
          <text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">Tight clustering</text>
          <text x="0" y="45" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">insulating layer</text>
        </g>

        {/* Thermometer at bottom */}
        <g transform="translate(280, 355)">
          {/* Scale bar */}
          <rect x="-150" y="-8" width="300" height="16" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
          {/* Gradient fill */}
          <defs>
            <linearGradient id="bht-temp-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <rect x="-148" y="-6" width="296" height="12" rx="6" fill="url(#bht-temp-grad)" opacity="0.5" />

          {/* Optimal zone marker */}
          <rect x="-20" y="-12" width="40" height="24" rx="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <text x="0" y="3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">35°C</text>

          {/* Scale labels */}
          <text x="-140" y="24" textAnchor="middle" fontSize="10" fill="#3b82f6">20°C</text>
          <text x="0" y="24" textAnchor="middle" fontSize="10" fill="#22c55e">Optimal</text>
          <text x="140" y="24" textAnchor="middle" fontSize="10" fill="#ef4444">45°C</text>
        </g>

        {/* Arrows connecting strategies to hive */}
        <defs>
          <marker id="bht-arrow-blue" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#60a5fa" />
          </marker>
          <marker id="bht-arrow-amber" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#f59e0b" />
          </marker>
        </defs>

        <line x1="100" y1="190" x2="180" y2="195" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bht-arrow-blue)" opacity="0.5" />
        <line x1="100" y1="280" x2="185" y2="230" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bht-arrow-blue)" opacity="0.5" />
        <line x1="460" y1="190" x2="380" y2="195" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bht-arrow-amber)" opacity="0.5" />
        <line x1="460" y1="280" x2="375" y2="230" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bht-arrow-amber)" opacity="0.5" />
      </svg>
    </div>
  );
}
