export default function HeatTransferCookingDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Three types of heat transfer in cooking: conduction (pan), convection (boiling water), radiation (fire roasting bamboo)">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ef4444">Three Ways Heat Cooks Your Pitha</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Each type of pitha uses a different method of heat transfer</text>

        {/* Conduction - Til Pitha */}
        <g transform="translate(30, 80)">
          <rect width="230" height="280" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="115" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">Conduction</text>
          <text x="115" y="42" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Direct contact = heat flows</text>

          {/* Pan */}
          <rect x="30" y="140" width="170" height="12" rx="3" fill="#64748b" />
          {/* Pitha on pan */}
          <rect x="60" y="120" width="110" height="20" rx="10" fill="#d97706" opacity="0.5" />
          <text x="115" y="135" textAnchor="middle" fontSize="10" fontWeight="600" fill="#92400e">Til Pitha</text>

          {/* Heat arrows from pan to pitha */}
          {[80, 115, 150].map(x => (
            <g key={x}>
              <line x1={x} y1="152" x2={x} y2="142" stroke="#ef4444" strokeWidth="2" />
              <polygon points={`${x - 3},142 ${x},136 ${x + 3},142`} fill="#ef4444" />
            </g>
          ))}

          {/* Flame under pan */}
          <text x="80" y="175" fontSize="16">🔥</text>
          <text x="115" y="175" fontSize="16">🔥</text>
          <text x="150" y="175" fontSize="16">🔥</text>

          <text x="115" y="205" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Metal pan touches batter directly</text>
          <text x="115" y="220" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Heat flows molecule-to-molecule</text>

          <rect x="20" y="240" width="190" height="30" rx="4" fill="#ef4444" opacity="0.1" />
          <text x="115" y="260" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">Fast and direct — great for browning</text>
        </g>

        {/* Convection - Narikol Pitha */}
        <g transform="translate(275, 80)">
          <rect width="230" height="280" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="115" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b82f6">Convection</text>
          <text x="115" y="42" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Moving fluid carries heat</text>

          {/* Pot */}
          <path d="M 40 120 L 40 180 Q 40 190 115 190 Q 190 190 190 180 L 190 120" fill="none" stroke="#64748b" strokeWidth="2.5" />
          {/* Water */}
          <rect x="42" y="135" width="146" height="53" fill="#60a5fa" opacity="0.15" />
          {/* Bubbles */}
          {[[70, 155], [100, 145], [130, 160], [155, 150]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#60a5fa" opacity="0.3" />
          ))}
          {/* Pitha above water (steaming) */}
          <rect x="65" y="110" width="100" height="22" rx="6" fill="#d97706" opacity="0.4" />
          <text x="115" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#92400e">Narikol Pitha</text>

          {/* Steam arrows */}
          {[85, 115, 145].map(x => (
            <text key={x} x={x} y="108" textAnchor="middle" fontSize="10" fill="#60a5fa" opacity="0.6">↑</text>
          ))}
          <text x="115" y="100" textAnchor="middle" fontSize="10" fill="#60a5fa">Steam rises</text>

          <text x="115" y="210" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Hot steam from boiling water</text>
          <text x="115" y="225" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">surrounds the pitha evenly</text>

          <rect x="20" y="240" width="190" height="30" rx="4" fill="#3b82f6" opacity="0.1" />
          <text x="115" y="260" textAnchor="middle" fontSize="10" fontWeight="600" fill="#3b82f6">Gentle and even — keeps it moist</text>
        </g>

        {/* Radiation - Sunga Pitha */}
        <g transform="translate(520, 80)">
          <rect width="230" height="280" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="115" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">Radiation</text>
          <text x="115" y="42" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Heat travels as infrared waves</text>

          {/* Bamboo tube */}
          <rect x="70" y="100" width="90" height="90" rx="8" fill="#22c55e" opacity="0.15" stroke="#16a34a" strokeWidth="1.5" />
          <text x="115" y="140" textAnchor="middle" fontSize="10" fontWeight="600" fill="#16a34a">Bamboo tube</text>
          <text x="115" y="156" textAnchor="middle" fontSize="10" fill="#92400e">(rice + jaggery)</text>

          {/* Fire below and to the side */}
          <text x="80" y="210" fontSize="16">🔥</text>
          <text x="130" y="210" fontSize="16">🔥</text>

          {/* Radiation waves */}
          {[
            { x1: 65, y1: 195, x2: 85, y2: 175 },
            { x1: 165, y1: 195, x2: 145, y2: 175 },
            { x1: 115, y1: 195, x2: 115, y2: 175 },
          ].map((w, i) => (
            <g key={i}>
              <line x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
            </g>
          ))}
          <text x="115" y="225" textAnchor="middle" fontSize="10" fill="#f59e0b">IR waves from fire</text>

          <text x="115" y="242" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Heat radiates from open fire</text>
          <text x="115" y="257" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">through the bamboo wall</text>

          <rect x="20" y="268" width="190" height="30" rx="4" fill="#f59e0b" opacity="0.1" />
          <text x="115" y="288" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Slow, smoky — bamboo adds flavor</text>
        </g>

        {/* Bottom */}
        <rect x="60" y="375" width="660" height="30" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="395" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Aita's four pithas use all three heat transfer methods — each one creates a different texture and flavor
        </text>
      </svg>
    </div>
  );
}
