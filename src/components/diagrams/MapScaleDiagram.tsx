export default function MapScaleDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 550 328"
        className="w-full"
        role="img"
        aria-label="Map scale comparison: zoomed-out Assam versus zoomed-in village view with scale bars"
      >
        <rect width="500" height="300" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Map Scale
        </text>

        {/* Panel 1: Zoomed out — Assam */}
        <rect x="20" y="45" width="210" height="170" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="125" y="62" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Small Scale (Zoomed Out)
        </text>

        {/* Simplified Assam outline */}
        <path
          d="M60,120 Q70,95 100,90 Q130,85 150,95 Q170,100 185,110 Q195,120 190,135 Q185,150 165,155 Q140,160 120,158 Q90,155 70,145 Q55,135 60,120Z"
          fill="#166534"
          stroke="#4ade80"
          strokeWidth="1"
        />
        <text x="125" y="130" textAnchor="middle" fontSize="10" fill="#fef3c7" fontFamily="sans-serif" fontWeight="600">
          ASSAM
        </text>
        {/* Brahmaputra river */}
        <path d="M65,125 Q100,115 135,120 Q165,125 185,118" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

        {/* Scale bar */}
        <line x1="50" y1="195" x2="130" y2="195" stroke="#f8fafc" strokeWidth="2" />
        <line x1="50" y1="190" x2="50" y2="200" stroke="#f8fafc" strokeWidth="1.5" />
        <line x1="130" y1="190" x2="130" y2="200" stroke="#f8fafc" strokeWidth="1.5" />
        <text x="90" y="210" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">
          1 cm = 10 km
        </text>

        {/* Panel 2: Zoomed in — Village */}
        <rect x="270" y="45" width="210" height="170" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="375" y="62" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          Large Scale (Zoomed In)
        </text>

        {/* Village features */}
        {/* Fields */}
        <rect x="290" y="80" width="50" height="35" rx="2" fill="#166534" stroke="#4ade80" strokeWidth="0.5" />
        <rect x="345" y="80" width="45" height="35" rx="2" fill="#15803d" stroke="#4ade80" strokeWidth="0.5" />
        <text x="315" y="100" textAnchor="middle" fontSize="8" fill="#bbf7d0" fontFamily="sans-serif">fields</text>
        <text x="367" y="100" textAnchor="middle" fontSize="8" fill="#bbf7d0" fontFamily="sans-serif">fields</text>

        {/* Road */}
        <line x1="285" y1="130" x2="470" y2="130" stroke="#a16207" strokeWidth="3" />
        <text x="420" y="128" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">road</text>

        {/* Houses */}
        {[310, 340, 370, 400].map((hx) => (
          <g key={hx}>
            <rect x={hx - 8} y={140} width="16" height="12" fill="#92400e" stroke="#d97706" strokeWidth="0.5" />
            <polygon points={`${hx - 10},140 ${hx},132 ${hx + 10},140`} fill="#78350f" stroke="#d97706" strokeWidth="0.5" />
          </g>
        ))}
        <text x="355" y="165" textAnchor="middle" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">houses</text>

        {/* Pond */}
        <ellipse cx="330" cy="185" rx="20" ry="12" fill="#1e40af" stroke="#60a5fa" strokeWidth="0.8" />
        <text x="330" y="188" textAnchor="middle" fontSize="7" fill="#bfdbfe" fontFamily="sans-serif">pond</text>

        {/* Scale bar */}
        <line x1="300" y1="195" x2="380" y2="195" stroke="#f8fafc" strokeWidth="2" />
        <line x1="300" y1="190" x2="300" y2="200" stroke="#f8fafc" strokeWidth="1.5" />
        <line x1="380" y1="190" x2="380" y2="200" stroke="#f8fafc" strokeWidth="1.5" />
        <text x="340" y="210" textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">
          1 cm = 100 m
        </text>

        {/* Arrow between panels */}
        <line x1="235" y1="130" x2="265" y2="130" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowScale)" />
        <defs>
          <marker id="arrowScale" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>
        <text x="250" y="120" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="sans-serif">zoom</text>

        {/* Bottom caption */}
        <text x="250" y="260" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Scale tells you how much the real world has been shrunk.
        </text>
        <text x="250" y="278" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          Small scale = big area, less detail. Large scale = small area, more detail.
        </text>
      </svg>
    </div>
  );
}
