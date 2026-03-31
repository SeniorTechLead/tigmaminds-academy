export default function SalCelluloseLigninDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing cellulose fibers embedded in lignin matrix, like rebar in concrete"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Why Wood Is Strong: Cellulose + Lignin
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Nature&apos;s version of reinforced concrete
        </text>

        {/* Analogy comparison */}
        {/* Left: Rebar + Concrete */}
        <rect x="40" y="75" width="330" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" />
        <text x="205" y="100" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Reinforced Concrete
        </text>
        {/* Concrete background */}
        <rect x="60" y="115" width="290" height="110" rx="6" fill="#9ca3af" fillOpacity="0.25" />
        {/* Steel rebar */}
        {[135, 160, 185, 210].map(y => (
          <g key={y}>
            <line x1="70" y1={y} x2="340" y2={y} stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="70" cy={y} r="4" fill="#475569" />
            <circle cx="340" cy={y} r="4" fill="#475569" />
          </g>
        ))}
        <text x="205" y="237" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Steel rebar (tension) + concrete (compression)
        </text>

        {/* Right: Cellulose + Lignin */}
        <rect x="410" y="75" width="330" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1" />
        <text x="575" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Wood Cell Wall
        </text>
        {/* Lignin matrix */}
        <rect x="430" y="115" width="290" height="110" rx="6" fill="#854d0e" fillOpacity="0.2" />
        <text x="440" y="130" fontSize="10" fill="#a16207" fontWeight="600">Lignin matrix</text>
        {/* Cellulose fibers */}
        {[140, 160, 180, 200].map(y => (
          <g key={y}>
            {/* Wavy cellulose fiber */}
            <path
              d={`M440,${y} Q470,${y - 4} 500,${y} Q530,${y + 4} 560,${y} Q590,${y - 4} 620,${y} Q650,${y + 4} 680,${y} Q700,${y - 3} 710,${y}`}
              fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" opacity="0.8"
            />
          </g>
        ))}
        <text x="575" y="237" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Cellulose fibers (tension) + lignin (compression)
        </text>

        {/* Equals sign */}
        <text x="390" y="170" textAnchor="middle" fontSize="24" fontWeight="700" fill="#f59e0b">
          =
        </text>

        {/* Property breakdown */}
        <text x="390" y="280" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          What each component does:
        </text>

        {/* Cellulose card */}
        <rect x="50" y="300" width="320" height="150" rx="10" fill="#22c55e" fillOpacity="0.08" stroke="#22c55e" strokeWidth="1" />
        <text x="210" y="325" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">Cellulose Fibers (~45%)</text>
        <text x="70" y="348" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Long chains of glucose molecules</text>
        <text x="70" y="366" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Resists pulling (tension strength)</text>
        <text x="70" y="384" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Like ropes or steel cables</text>
        <text x="70" y="402" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Aligned along the grain direction</text>
        <text x="70" y="425" fontSize="11" fontWeight="600" fill="#22c55e">{'\u2192'} Strong along the grain</text>

        {/* Lignin card */}
        <rect x="410" y="300" width="320" height="150" rx="10" fill="#a16207" fillOpacity="0.08" stroke="#a16207" strokeWidth="1" />
        <text x="570" y="325" textAnchor="middle" fontSize="13" fontWeight="700" fill="#a16207">Lignin Matrix (~25%)</text>
        <text x="430" y="348" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Complex 3D polymer network</text>
        <text x="430" y="366" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Resists crushing (compression)</text>
        <text x="430" y="384" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Like glue or cement</text>
        <text x="430" y="402" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{'\u2022'} Waterproofs and stiffens the cell</text>
        <text x="430" y="425" fontSize="11" fontWeight="600" fill="#a16207">{'\u2192'} Prevents buckling</text>
      </svg>
    </div>
  );
}
