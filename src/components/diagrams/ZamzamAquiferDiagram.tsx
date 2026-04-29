/**
 * ZamzamAquiferDiagram — Cross-section showing how an aquifer works.
 * Layers of soil, permeable rock, impermeable rock, and the water table.
 */
export default function ZamzamAquiferDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 467 280" className="w-full" role="img" aria-label="Cross-section of an aquifer showing water table, permeable and impermeable layers">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">How Groundwater Works</text>

        {/* Sky */}
        <rect x="0" y="30" width="400" height="40" fill="#bae6fd" opacity="0.3" />
        <text x="200" y="50" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Surface</text>

        {/* Rain arrows */}
        {[80, 140, 200, 260, 320].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="32" x2={x - 4} y2="48" stroke="#60a5fa" strokeWidth="1.5" />
            <polygon points={`${x - 4},48 ${x - 7},43 ${x - 1},43`} fill="#60a5fa" />
          </g>
        ))}

        {/* Soil layer */}
        <rect x="20" y="70" width="360" height="30" rx="3" fill="#92400e" opacity="0.6" />
        <text x="200" y="89" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">Soil Layer</text>

        {/* Unsaturated zone */}
        <rect x="20" y="100" width="360" height="35" rx="3" fill="#a16207" opacity="0.35" />
        <text x="200" y="121" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10">Unsaturated Zone (air + water in pores)</text>

        {/* Water table line */}
        <line x1="20" y1="135" x2="380" y2="135" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" />
        <text x="385" y="139" className="fill-blue-600 dark:fill-blue-400" fontSize="10" textAnchor="start" fontWeight="bold">← Water Table</text>

        {/* Aquifer (saturated permeable rock) */}
        <rect x="20" y="135" width="360" height="55" rx="3" fill="#3b82f6" opacity="0.25" />
        <rect x="20" y="135" width="360" height="55" rx="3" fill="none" stroke="#3b82f6" strokeWidth="1" />
        {/* Dots to represent porous rock with water */}
        {Array.from({ length: 30 }).map((_, i) => {
          const dx = 35 + (i % 10) * 35;
          const dy = 145 + Math.floor(i / 10) * 18;
          return <circle key={i} cx={dx} cy={dy} r="3" fill="#60a5fa" opacity="0.5" />;
        })}
        <text x="200" y="167" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="11" fontWeight="bold">Aquifer (Saturated Permeable Rock)</text>

        {/* Impermeable layer (confining bed) */}
        <rect x="20" y="190" width="360" height="25" rx="3" fill="#64748b" opacity="0.6" />
        <text x="200" y="207" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">Impermeable Layer (Clay / Shale)</text>

        {/* Confined aquifer below */}
        <rect x="20" y="215" width="360" height="35" rx="3" fill="#2563eb" opacity="0.2" />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={40 + i * 35} cy={232} r="3" fill="#3b82f6" opacity="0.4" />
        ))}
        <text x="200" y="237" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10">Confined Aquifer (Under Pressure)</text>

        {/* Well */}
        <rect x="95" y="45" width="10" height="145" fill="#78716c" opacity="0.8" />
        <rect x="92" y="40" width="16" height="10" rx="2" fill="#57534e" />
        <text x="100" y="38" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Well</text>
        {/* Water level in well matches water table */}
        <rect x="96" y="135" width="8" height="55" fill="#60a5fa" opacity="0.6" />

        {/* Flow arrows in aquifer */}
        {[60, 160, 280, 340].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="160" x2={x + 20} y2="160" stroke="#2563eb" strokeWidth="1.5" />
            <polygon points={`${x + 20},160 ${x + 16},157 ${x + 16},163`} fill="#2563eb" />
          </g>
        ))}

        {/* Legend */}
        <rect x="20" y="258" width="10" height="10" fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="0.5" />
        <text x="34" y="267" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Water-filled pores</text>
        <line x1="130" y1="263" x2="155" y2="263" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
        <text x="160" y="267" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Water table</text>
        <line x1="250" y1="263" x2="270" y2="263" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
        <text x="275" y="267" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Groundwater flow</text>
      </svg>
    </div>
  );
}
