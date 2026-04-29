/**
 * ZamzamWaterCycleDiagram — Shows the full hydrological cycle with emphasis on
 * groundwater recharge, aquifer storage, and spring/well discharge.
 */
export default function ZamzamWaterCycleDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 453 300" className="w-full" role="img" aria-label="Hydrological cycle showing precipitation, infiltration, groundwater flow, and discharge">
        <rect width="420" height="300" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="210" y="20" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">The Water Cycle — Above and Below Ground</text>

        {/* Sun */}
        <circle cx="370" cy="45" r="18" fill="#fbbf24" opacity="0.8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return <line key={i} x1={370 + 22 * Math.cos(rad)} y1={45 + 22 * Math.sin(rad)} x2={370 + 28 * Math.cos(rad)} y2={45 + 28 * Math.sin(rad)} stroke="#fbbf24" strokeWidth="2" />;
        })}

        {/* Cloud */}
        <ellipse cx="160" cy="50" rx="40" ry="18" fill="#94a3b8" opacity="0.5" />
        <ellipse cx="140" cy="48" rx="25" ry="15" fill="#94a3b8" opacity="0.5" />
        <ellipse cx="180" cy="48" rx="25" ry="15" fill="#94a3b8" opacity="0.5" />

        {/* Rain */}
        {[140, 155, 170].map((x, i) => (
          <line key={i} x1={x} y1="66" x2={x - 3} y2="82" stroke="#60a5fa" strokeWidth="1.5" />
        ))}
        <text x="155" y="95" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">Precipitation</text>

        {/* Evaporation arrows from ocean */}
        <path d="M 350 145 C 360 110, 370 80, 355 55" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="375" y="100" className="fill-orange-600 dark:fill-orange-400" fontSize="9">Evaporation</text>

        {/* Ground surface */}
        <path d="M 0 140 Q 80 130, 150 135 Q 210 138, 280 132 Q 340 128, 420 140" fill="none" stroke="#16a34a" strokeWidth="2" />

        {/* Mountain */}
        <polygon points="30,140 70,80 110,140" fill="#059669" opacity="0.3" />

        {/* Surface labels */}
        <text x="70" y="77" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Mountain</text>

        {/* Infiltration arrows */}
        {[180, 220, 260].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="140" x2={x} y2="165" stroke="#3b82f6" strokeWidth="1.5" />
            <polygon points={`${x},165 ${x - 3},160 ${x + 3},160`} fill="#3b82f6" />
          </g>
        ))}
        <text x="220" y="178" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">Infiltration</text>

        {/* Underground layers */}
        <rect x="0" y="140" width="420" height="30" fill="#92400e" opacity="0.2" />
        <text x="360" y="158" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Soil</text>

        {/* Water table */}
        <line x1="0" y1="185" x2="420" y2="185" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="410" y="183" textAnchor="end" fill="#3b82f6" fontSize="9">Water Table</text>

        {/* Aquifer */}
        <rect x="0" y="185" width="420" height="50" fill="#3b82f6" opacity="0.12" />
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={20 + i * 20} cy={210} r="2" fill="#60a5fa" opacity="0.4" />
        ))}
        <text x="210" y="215" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="bold">Aquifer</text>

        {/* Groundwater flow arrows */}
        <path d="M 80 205 Q 150 210, 210 205 Q 270 200, 330 208" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <polygon points="330,208 325,204 325,212" fill="#2563eb" />
        <text x="210" y="228" textAnchor="middle" fill="#2563eb" fontSize="9">Groundwater Flow →</text>

        {/* Spring discharge on the left */}
        <circle cx="40" cy="140" r="5" fill="#60a5fa" />
        <path d="M 40 135 Q 50 120, 60 130" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="55" y="118" className="fill-blue-600 dark:fill-blue-400" fontSize="9" fontWeight="bold">Spring</text>

        {/* Well */}
        <rect x="308" y="110" width="8" height="75" fill="#78716c" opacity="0.8" />
        <rect x="305" y="107" width="14" height="8" rx="2" fill="#57534e" />
        <text x="312" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="9" fontWeight="bold">Well</text>

        {/* Ocean */}
        <rect x="340" y="130" width="80" height="55" rx="4" fill="#3b82f6" opacity="0.2" />
        <text x="380" y="160" textAnchor="middle" fill="#3b82f6" fontSize="10">Ocean</text>

        {/* Impermeable base */}
        <rect x="0" y="235" width="420" height="20" fill="#475569" opacity="0.4" />
        <text x="210" y="249" textAnchor="middle" fill="#e2e8f0" fontSize="9">Impermeable Bedrock</text>

        {/* Key */}
        <text x="210" y="275" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Rain → infiltrates soil → recharges aquifer → flows to wells and springs → evaporates → repeat</text>
        <text x="210" y="290" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Zamzam draws from a deep aquifer recharged by ancient rain</text>
      </svg>
    </div>
  );
}
