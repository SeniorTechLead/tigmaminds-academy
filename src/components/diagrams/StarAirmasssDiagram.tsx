export default function StarAirmasssDiagram() {
  return (
    <svg viewBox="0 0 635 337" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Airmass diagram showing how starlight passes through more atmosphere at lower elevations">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Airmass: How Much Atmosphere?</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Observe stars high in the sky for best results</text>

      {/* Earth surface (curved) */}
      <path d="M0,240 Q260,220 520,240" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <rect x="0" y="240" width="520" height="60" className="fill-gray-100 dark:fill-slate-800" />

      {/* Atmosphere layer */}
      <path d="M0,240 Q260,220 520,240" fill="none" stroke="#3b82f6" strokeWidth="0" />
      <path d="M0,155 Q260,135 520,155" fill="none" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,3" />
      <rect x="0" y="155" width="520" height="85" fill="#1e3a5f" opacity={0.15} />
      <text x="480" y="150" textAnchor="end" fill="#3b82f6" fontSize="8">Top of atmosphere</text>

      {/* Observer */}
      <circle cx="260" cy="225" r="6" fill="#475569" />
      <text x="260" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Observer</text>

      {/* Zenith path (straight up) - 1x airmass */}
      <g>
        <circle cx="260" cy="80" r="4" fill="#fef3c7" />
        <circle cx="260" cy="80" r="7" fill="#fef3c7" opacity={0.15} />
        <line x1="260" y1="84" x2="260" y2="219" stroke="#22c55e" strokeWidth="2" opacity={0.7} />
        <text x="260" y="72" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">Zenith (90°)</text>
        <text x="280" y="180" fill="#22c55e" fontSize="10" fontWeight="700">X = 1.0</text>
        <text x="280" y="192" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Minimum air</text>
      </g>

      {/* 60 degree path - ~1.15x */}
      <g>
        <circle cx="370" cy="75" r="3" fill="#fef3c7" />
        <line x1="370" y1="78" x2="285" y2="219" stroke="#fbbf24" strokeWidth="1.5" opacity={0.6} />
        <text x="385" y="72" fill="#fbbf24" fontSize="9" fontWeight="600">60° alt</text>
        <text x="350" y="155" fill="#fbbf24" fontSize="9" fontWeight="700">X = 1.2</text>
      </g>

      {/* 30 degree path - 2x */}
      <g>
        <circle cx="440" cy="90" r="3" fill="#fef3c7" />
        <line x1="440" y1="93" x2="310" y2="219" stroke="#f59e0b" strokeWidth="1.5" opacity={0.5} />
        <text x="455" y="87" fill="#f59e0b" fontSize="9" fontWeight="600">30° alt</text>
        <text x="410" y="165" fill="#f59e0b" fontSize="9" fontWeight="700">X = 2.0</text>
      </g>

      {/* Horizon path - ~38x */}
      <g>
        <circle cx="500" cy="145" r="2" fill="#fca5a5" />
        <line x1="500" y1="147" x2="266" y2="219" stroke="#f87171" strokeWidth="1.5" opacity={0.3} />
        <text x="505" y="140" textAnchor="end" fill="#f87171" fontSize="9" fontWeight="600">Horizon (0°)</text>
        <text x="420" y="210" fill="#f87171" fontSize="9" fontWeight="700">X ≈ 38</text>
      </g>

      {/* Formula box */}
      <rect x="20" y="260" width="200" height="32" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="120" y="275" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">X ≈ 1/sin(altitude)</text>
      <text x="120" y="287" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Simple approximation</text>

      {/* Tip */}
      <rect x="240" y="260" width="260" height="32" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="370" y="275" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">Best data: X less than 2.0</text>
      <text x="370" y="287" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Stars above 30° elevation</text>
    </svg>
  );
}
