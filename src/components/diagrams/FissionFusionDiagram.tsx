export default function FissionFusionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 250" className="w-full max-w-xl mx-auto" role="img" aria-label="Nuclear fission and fusion comparison">
        {/* Divider */}
        <line x1="260" y1="10" x2="260" y2="240" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,4" />

        {/* FISSION — left side */}
        <text x="130" y="22" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="14" fontWeight="bold">Fission</text>
        <text x="130" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(splitting heavy atoms)</text>

        {/* U-235 nucleus */}
        <circle cx="70" cy="90" r="28" className="fill-blue-200 dark:fill-blue-800 stroke-blue-500" strokeWidth="2" />
        <text x="70" y="86" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="bold">U-235</text>
        <text x="70" y="98" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="9">(uranium)</text>

        {/* Incoming neutron */}
        <circle cx="15" cy="90" r="5" className="fill-gray-500 dark:fill-gray-400" />
        <text x="15" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">n</text>
        <line x1="22" y1="90" x2="42" y2="90" className="stroke-gray-400" strokeWidth="1.5" markerEnd="url(#ffArrow)">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
        </line>

        {/* Arrow to products */}
        <line x1="100" y1="90" x2="125" y2="90" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#ffArrow)" />

        {/* Barium */}
        <circle cx="160" cy="68" r="18" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="1.5" />
        <text x="160" y="72" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">Ba</text>

        {/* Krypton */}
        <circle cx="165" cy="112" r="14" className="fill-violet-200 dark:fill-violet-800 stroke-violet-500" strokeWidth="1.5" />
        <text x="165" y="116" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="10" fontWeight="bold">Kr</text>

        {/* Released neutrons */}
        {[[200, 58], [205, 95], [195, 125]].map(([nx, ny], i) => (
          <g key={i}>
            <circle cx={nx} cy={ny} r="4" className="fill-gray-400 dark:fill-gray-500" />
            <text x={nx} y={ny - 6} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">n</text>
          </g>
        ))}

        {/* Energy burst */}
        <text x="230" y="90" textAnchor="middle" className="fill-amber-500" fontSize="16">⚡</text>
        <text x="230" y="108" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Energy!</text>

        {/* Fission equation */}
        <rect x="15" y="148" width="230" height="38" rx="6" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="130" y="164" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          U-235 + n → Ba-141 + Kr-92 + 3n
        </text>
        <text x="130" y="179" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="600">~200 MeV per reaction</text>

        {/* FUSION — right side */}
        <text x="390" y="22" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="14" fontWeight="bold">Fusion</text>
        <text x="390" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(joining light atoms)</text>

        {/* 4 Hydrogen nuclei */}
        {[[295, 75], [320, 60], [295, 100], [320, 105]].map(([hx, hy], i) => (
          <g key={`h-${i}`}>
            <circle cx={hx} cy={hy} r="10" className="fill-sky-200 dark:fill-sky-800 stroke-sky-500" strokeWidth="1.5" />
            <text x={hx} y={hy + 4} textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="10" fontWeight="bold">H</text>
          </g>
        ))}

        {/* Arrow to product */}
        <line x1="335" y1="85" x2="375" y2="85" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#ffArrow)" />
        <text x="355" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">extreme</text>
        <text x="355" y="100" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">heat</text>

        {/* Helium */}
        <circle cx="420" cy="85" r="22" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="2" />
        <text x="420" y="82" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">He</text>
        <text x="420" y="94" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9">(helium)</text>

        {/* Energy + positrons */}
        <text x="470" y="75" className="fill-amber-500" fontSize="16">⚡</text>
        <text x="475" y="95" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Energy!</text>

        {/* Fusion equation */}
        <rect x="275" y="148" width="230" height="38" rx="6" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="390" y="164" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          4 H → He + 2e⁺ + 2ν + energy
        </text>
        <text x="390" y="179" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">~26.7 MeV (powers the Sun!)</text>

        {/* Comparison bar */}
        <rect x="60" y="198" width="400" height="42" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="260" y="216" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          Key difference
        </text>
        <text x="260" y="232" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Fission: splits heavy atoms (power plants) | Fusion: joins light atoms (stars)
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="ffArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
