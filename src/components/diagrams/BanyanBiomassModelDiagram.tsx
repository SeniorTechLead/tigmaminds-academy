export default function BanyanBiomassModelDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 545 409" className="w-full max-w-lg mx-auto" role="img" aria-label="Biomass estimation pipeline from field measurements through allometric equations to per-hectare estimates">
        <rect width="500" height="380" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Biomass Estimation Pipeline</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">From tape measure to tonnes per hectare</text>

        {/* === STEP 1: Field Measurements === */}
        <rect x="20" y="65" width="130" height="80" rx="8" className="fill-green-900" opacity="0.6" />
        <text x="85" y="85" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="bold">1. Measure</text>
        {/* Tape measure icon */}
        <rect x="55" y="95" width="60" height="10" rx="3" className="fill-amber-600" />
        <text x="85" y="103" textAnchor="middle" className="fill-amber-900" fontSize="6">tape</text>
        <text x="85" y="120" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">DBH = 60 cm</text>
        <text x="85" y="132" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Height = 25 m</text>
        <text x="85" y="144" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Species: Banyan</text>

        {/* Arrow 1→2 */}
        <line x1="150" y1="105" x2="175" y2="105" className="stroke-green-400" strokeWidth="2" markerEnd="url(#bmArrow)" />

        {/* === STEP 2: Allometric Equation === */}
        <rect x="180" y="65" width="140" height="80" rx="8" className="fill-amber-900" opacity="0.6" />
        <text x="250" y="85" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">2. Equation</text>
        {/* Formula */}
        <text x="250" y="105" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="9">B = a × DBH^b × H^c</text>
        <text x="250" y="120" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">a = 0.0509</text>
        <text x="250" y="132" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">b = 2.5, c = 0.6</text>
        <text x="250" y="144" textAnchor="middle" className="fill-amber-400" fontSize="7">(species-specific coefficients)</text>

        {/* Arrow 2→3 */}
        <line x1="320" y1="105" x2="345" y2="105" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#bmArrowAmber)" />

        {/* === STEP 3: Individual Tree Biomass === */}
        <rect x="350" y="65" width="130" height="80" rx="8" className="fill-green-800" opacity="0.6" />
        <text x="415" y="85" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="bold">3. Result</text>
        {/* Tree icon */}
        <rect x="405" y="100" width="8" height="20" rx="1" className="fill-amber-600" />
        <ellipse cx="409" cy="98" rx="12" ry="8" className="fill-green-500" opacity="0.5" />
        <text x="415" y="132" textAnchor="middle" className="fill-green-200" fontSize="11" fontWeight="bold">2.8 tonnes</text>
        <text x="415" y="144" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">single tree biomass</text>

        {/* Arrow down to step 4 */}
        <line x1="250" y1="150" x2="250" y2="175" className="stroke-green-400" strokeWidth="2" markerEnd="url(#bmArrow)" />

        {/* === STEP 4: Sum All Trees in Plot === */}
        <rect x="100" y="178" width="300" height="70" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="250" y="198" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">4. Sum All Trees in Plot</text>

        {/* Mini trees in plot */}
        {[140, 180, 220, 260, 300, 340, 370].map((x, i) => (
          <g key={i}>
            <rect x={x} y={215} width={4} height={[12, 10, 6, 15, 8, 5, 9][i]} rx="1" className="fill-amber-600" />
            <ellipse cx={x + 2} cy={213} rx={[8, 6, 4, 10, 5, 3, 7][i]} ry={[5, 4, 3, 6, 4, 2, 5][i]} className="fill-green-500" opacity="0.4" />
          </g>
        ))}
        <text x="250" y="240" textAnchor="middle" className="fill-green-200" fontSize="10" fontWeight="bold">Plot total: 18.5 tonnes</text>

        {/* Arrow down to step 5 */}
        <line x1="250" y1="248" x2="250" y2="273" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#bmArrowAmber)" />

        {/* === STEP 5: Scale to Per Hectare === */}
        <rect x="80" y="275" width="340" height="55" rx="8" className="fill-green-900" opacity="0.5" />
        <text x="250" y="295" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">5. Scale Up to Per Hectare</text>
        <text x="250" y="312" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9">Plot = 0.04 ha (20×20 m) → multiply by 25</text>
        <text x="250" y="325" textAnchor="middle" className="fill-green-200" fontSize="12" fontWeight="bold">= 462 tonnes / hectare</text>

        {/* Carbon conversion */}
        <rect x="80" y="340" width="340" height="30" rx="6" className="fill-amber-900" opacity="0.4" />
        <text x="250" y="359" textAnchor="middle" className="fill-amber-300" fontSize="9">Carbon = biomass × 0.47 → ~217 tonnes C / hectare → ~796 tonnes CO₂ / hectare</text>

        <defs>
          <marker id="bmArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-green-400" />
          </marker>
          <marker id="bmArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
