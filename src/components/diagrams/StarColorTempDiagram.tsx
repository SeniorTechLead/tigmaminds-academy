export default function StarColorTempDiagram() {
  const stars = [
    { temp: '30,000K+', color: '#93c5fd', glow: '#60a5fa', label: 'Blue-white', example: 'Rigel', r: 10, x: 80 },
    { temp: '10,000K', color: '#e0e7ff', glow: '#a5b4fc', label: 'White', example: 'Sirius', r: 9, x: 170 },
    { temp: '7,500K', color: '#fef9c3', glow: '#fde68a', label: 'Yellow-white', example: 'Procyon', r: 8, x: 260 },
    { temp: '5,500K', color: '#fde68a', glow: '#fbbf24', label: 'Yellow', example: 'Sun', r: 8, x: 340 },
    { temp: '3,500K', color: '#fca5a5', glow: '#f87171', label: 'Orange-red', example: 'Betelgeuse', r: 12, x: 440 },
  ];

  return (
    <svg viewBox="0 0 590 309" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Star color vs temperature from hot blue stars to cool red stars">
      <rect width="520" height="280" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Star Color = Temperature</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Hotter stars are blue, cooler stars are red (Wien's Law)</text>

      {/* Temperature gradient bar */}
      <defs>
        <linearGradient id="tempGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="25%" stopColor="#a5b4fc" />
          <stop offset="45%" stopColor="#fef9c3" />
          <stop offset="65%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="50" y="190" width="420" height="8" rx="4" fill="url(#tempGrad)" />
      <text x="50" y="210" fill="#60a5fa" fontSize="9">HOT</text>
      <text x="460" y="210" fill="#ef4444" fontSize="9">COOL</text>

      {/* Stars */}
      {stars.map((s) => (
        <g key={s.example}>
          {/* Glow */}
          <circle cx={s.x} cy="115" r={s.r + 8} fill={s.glow} opacity={0.1} />
          <circle cx={s.x} cy="115" r={s.r + 4} fill={s.glow} opacity={0.15} />
          {/* Star */}
          <circle cx={s.x} cy="115" r={s.r} fill={s.color} />

          {/* Label */}
          <text x={s.x} y="75" textAnchor="middle" fill={s.color} fontSize="10" fontWeight="600">{s.label}</text>
          <text x={s.x} y="150" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">{s.example}</text>
          <text x={s.x} y="165" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">{s.temp}</text>

          {/* Connection to bar */}
          <line x1={s.x} y1="170" x2={s.x} y2="188" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.8" strokeDasharray="2,2" />
        </g>
      ))}

      {/* Wien's Law box */}
      <rect x="120" y="225" width="280" height="42" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="243" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Wien's Displacement Law</text>
      <text x="260" y="259" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Peak wavelength = 2,900,000 / Temperature(K) nm</text>
    </svg>
  );
}
