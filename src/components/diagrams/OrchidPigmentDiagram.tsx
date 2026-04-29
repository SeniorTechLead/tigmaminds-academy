export default function OrchidPigmentDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Diagram showing three plant pigment families and the wavelengths they absorb versus reflect">
        <rect width="560" height="420" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#e879f9">Why Are Flowers Colored?</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Three pigment families absorb different wavelengths, reflecting the colors you see</text>

        {/* Visible spectrum bar */}
        <defs>
          <linearGradient id="spectrumGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#8b00ff" />
            <stop offset="15%" stopColor="#0000ff" />
            <stop offset="30%" stopColor="#00bfff" />
            <stop offset="45%" stopColor="#00ff00" />
            <stop offset="60%" stopColor="#ffff00" />
            <stop offset="75%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#ff0000" />
          </linearGradient>
        </defs>
        <rect x="60" y="62" width="440" height="14" rx="4" fill="url(#spectrumGrad)" opacity="0.85" />
        <text x="60" y="88" fontSize="8" className="fill-slate-400">380 nm (violet)</text>
        <text x="500" y="88" textAnchor="end" fontSize="8" className="fill-slate-400">750 nm (red)</text>
        <text x="280" y="88" textAnchor="middle" fontSize="8" className="fill-slate-400">Visible light</text>

        {/* Anthocyanins */}
        <g transform="translate(30, 110)">
          <rect x="0" y="0" width="160" height="130" rx="8" fill="#1e1b3a" stroke="#a855f7" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a855f7">Anthocyanins</text>
          {/* Absorption: green light */}
          <text x="80" y="38" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Absorb: green light</text>
          <rect x="20" y="44" width="120" height="10" rx="3" fill="#22c55e" opacity="0.3" />
          <line x1="20" y1="49" x2="140" y2="49" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 3" />
          <text x="80" y="65" textAnchor="middle" fontSize="8" fill="#6b7280">← absorbed →</text>

          {/* Reflected colors */}
          <text x="80" y="82" textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-200">Reflect:</text>
          <circle cx="40" cy="100" r="12" fill="#ef4444" opacity="0.8" />
          <text x="40" y="104" textAnchor="middle" fontSize="8" fill="white">Red</text>
          <circle cx="80" cy="100" r="12" fill="#8b5cf6" opacity="0.8" />
          <text x="80" y="104" textAnchor="middle" fontSize="8" fill="white">Purple</text>
          <circle cx="120" cy="100" r="12" fill="#3b82f6" opacity="0.8" />
          <text x="120" y="104" textAnchor="middle" fontSize="8" fill="white">Blue</text>
          <text x="80" y="126" textAnchor="middle" fontSize="8" fill="#c4b5fd">pH changes color!</text>
        </g>

        {/* Carotenoids */}
        <g transform="translate(200, 110)">
          <rect x="0" y="0" width="160" height="130" rx="8" fill="#1a1a0e" stroke="#f59e0b" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f59e0b">Carotenoids</text>
          <text x="80" y="38" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Absorb: blue-violet light</text>
          <rect x="20" y="44" width="120" height="10" rx="3" fill="#6366f1" opacity="0.3" />
          <line x1="20" y1="49" x2="140" y2="49" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
          <text x="80" y="65" textAnchor="middle" fontSize="8" fill="#6b7280">← absorbed →</text>

          <text x="80" y="82" textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-200">Reflect:</text>
          <circle cx="40" cy="100" r="12" fill="#eab308" opacity="0.8" />
          <text x="40" y="104" textAnchor="middle" fontSize="8" fill="white">Yellow</text>
          <circle cx="80" cy="100" r="12" fill="#f97316" opacity="0.8" />
          <text x="80" y="104" textAnchor="middle" fontSize="8" fill="white">Orange</text>
          <circle cx="120" cy="100" r="12" fill="#ef4444" opacity="0.8" />
          <text x="120" y="104" textAnchor="middle" fontSize="8" fill="white">Red</text>
          <text x="80" y="126" textAnchor="middle" fontSize="8" fill="#fde68a">Same as carrot pigments</text>
        </g>

        {/* Betalains */}
        <g transform="translate(370, 110)">
          <rect x="0" y="0" width="160" height="130" rx="8" fill="#1a0e16" stroke="#ec4899" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ec4899">Betalains</text>
          <text x="80" y="38" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Absorb: green-yellow light</text>
          <rect x="20" y="44" width="120" height="10" rx="3" fill="#84cc16" opacity="0.3" />
          <line x1="20" y1="49" x2="140" y2="49" stroke="#84cc16" strokeWidth="2" strokeDasharray="4 3" />
          <text x="80" y="65" textAnchor="middle" fontSize="8" fill="#6b7280">← absorbed →</text>

          <text x="80" y="82" textAnchor="middle" fontSize="9" className="fill-gray-700 dark:fill-slate-200">Reflect:</text>
          <circle cx="40" cy="100" r="12" fill="#dc2626" opacity="0.8" />
          <text x="40" y="104" textAnchor="middle" fontSize="8" fill="white">Red</text>
          <circle cx="80" cy="100" r="12" fill="#f472b6" opacity="0.8" />
          <text x="80" y="104" textAnchor="middle" fontSize="8" fill="white">Pink</text>
          <circle cx="120" cy="100" r="12" fill="#fbbf24" opacity="0.8" />
          <text x="120" y="104" textAnchor="middle" fontSize="8" fill="white">Yellow</text>
          <text x="80" y="126" textAnchor="middle" fontSize="8" fill="#f9a8d4">Only in bougainvillea family</text>
        </g>

        {/* How it works: sunlight hits petal */}
        <g transform="translate(280, 265)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">How Pigments Make Color</text>

          {/* Sunlight arrow */}
          <line x1="-180" y1="25" x2="-120" y2="45" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
          <text x="-180" y="20" textAnchor="start" fontSize="10" fill="#fbbf24">White sunlight</text>
          <text x="-180" y="32" textAnchor="start" fontSize="8" className="fill-gray-500 dark:fill-slate-400">(all wavelengths)</text>

          {/* Petal */}
          <ellipse cx="0" cy="60" rx="80" ry="30" fill="#a855f7" opacity="0.3" stroke="#a855f7" strokeWidth="1.5" />
          <text x="0" y="56" textAnchor="middle" fontSize="10" fill="white">Petal with</text>
          <text x="0" y="68" textAnchor="middle" fontSize="10" fill="white">anthocyanin</text>

          {/* Absorbed (green) - X mark */}
          <line x1="-30" y1="95" x2="-30" y2="130" stroke="#22c55e" strokeWidth="2" />
          <line x1="-38" y1="125" x2="-22" y2="115" stroke="#ef4444" strokeWidth="2.5" />
          <line x1="-38" y1="115" x2="-22" y2="125" stroke="#ef4444" strokeWidth="2.5" />
          <text x="-30" y="145" textAnchor="middle" fontSize="8" fill="#22c55e">Green absorbed</text>

          {/* Reflected (purple) - bounces back */}
          <line x1="80" y1="45" x2="140" y2="25" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowP)" />
          <text x="145" y="20" textAnchor="start" fontSize="10" fill="#a855f7">Purple reflected</text>
          <text x="145" y="32" textAnchor="start" fontSize="8" className="fill-gray-500 dark:fill-slate-400">→ what your eye sees</text>
        </g>

        <defs>
          <marker id="arrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#fbbf24" />
          </marker>
          <marker id="arrowP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#a855f7" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
