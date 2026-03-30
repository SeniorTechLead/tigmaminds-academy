export default function BeeGeneticsDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 430" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee haplodiploid genetics diagram showing queen diploid and drone haploid sex determination">
        <rect width="570" height="430" rx="12" className="fill-slate-900" />

        <text x="285" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Haplodiploidy: Bee Sex Determination</text>
        <text x="285" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Females = diploid (2n), Males = haploid (n)</text>

        {/* Queen — top center */}
        <g transform="translate(285, 100)">
          <circle cx="0" cy="0" r="35" fill="#f59e0b" opacity="0.15" stroke="#fbbf24" strokeWidth="2" />
          {/* Crown */}
          <polygon points="-10,-30 -5,-22 0,-32 5,-22 10,-30" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          {/* Bee */}
          <ellipse cx="0" cy="0" rx="18" ry="11" fill="#eab308" />
          <line x1="-7" y1="0" x2="7" y2="0" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
          <circle cx="18" cy="-2" r="5" className="fill-gray-100 dark:fill-slate-800" />
          <text x="0" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Queen</text>

          {/* Chromosomes */}
          <g transform="translate(50, -10)">
            <rect x="0" y="-8" width="45" height="18" rx="3" fill="#a855f7" opacity="0.2" stroke="#a855f7" strokeWidth="1" />
            <text x="22" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">2n = 32</text>
          </g>
          <text x="50" y="16" fontSize="10" fill="#c4b5fd">Diploid (two sets)</text>
        </g>

        {/* Two paths from queen */}
        <defs>
          <marker id="bg-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Fertilized egg path — left */}
        <path d="M 250,135 Q 195,170 155,200" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bg-arrow)" strokeDasharray="5,3" />
        <text x="180" y="165" fontSize="10" fontWeight="bold" fill="#22c55e" transform="rotate(-30, 180, 165)">Fertilized egg</text>

        {/* Unfertilized egg path — right */}
        <path d="M 320,135 Q 375,170 415,200" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bg-arrow)" strokeDasharray="5,3" />
        <text x="380" y="165" fontSize="10" fontWeight="bold" fill="#60a5fa" transform="rotate(30, 380, 165)">Unfertilized egg</text>

        {/* Female offspring — left */}
        <g transform="translate(140, 255)">
          <rect x="-90" y="-42" width="180" height="108" rx="8" fill="#22c55e" opacity="0.06" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#22c55e">Female (Diploid 2n)</text>

          {/* Chromosome pair visualization */}
          <g transform="translate(-45, 10)">
            <rect x="0" y="-7" width="28" height="14" rx="3" fill="#a855f7" opacity="0.4" />
            <text x="14" y="5" textAnchor="middle" fontSize="10" fill="#c4b5fd">n</text>
            <text x="34" y="5" fontSize="10" className="fill-gray-500 dark:fill-slate-400">+</text>
            <rect x="42" y="-7" width="28" height="14" rx="3" fill="#ec4899" opacity="0.4" />
            <text x="56" y="5" textAnchor="middle" fontSize="10" fill="#f9a8d4">n</text>
            <text x="76" y="5" fontSize="10" className="fill-gray-500 dark:fill-slate-400">=</text>
            <rect x="84" y="-7" width="28" height="14" rx="3" fill="#22c55e" opacity="0.4" />
            <text x="98" y="5" textAnchor="middle" fontSize="10" fill="#86efac">2n</text>
          </g>

          <text x="-30" y="40" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Queen egg</text>
          <text x="45" y="40" fontSize="10" className="fill-gray-500 dark:fill-slate-400">+ Sperm</text>

          {/* Two outcomes */}
          <text x="0" y="56" textAnchor="middle" fontSize="10" fill="#fcd34d">→ Worker (unfed) or Queen (royal jelly)</text>
        </g>

        {/* Male offspring — right */}
        <g transform="translate(430, 255)">
          <rect x="-90" y="-42" width="180" height="108" rx="8" fill="#60a5fa" opacity="0.06" stroke="#60a5fa" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Male (Haploid n)</text>

          {/* Single chromosome set */}
          <g transform="translate(-25, 10)">
            <rect x="0" y="-7" width="28" height="14" rx="3" fill="#a855f7" opacity="0.4" />
            <text x="14" y="5" textAnchor="middle" fontSize="10" fill="#c4b5fd">n</text>
            <text x="35" y="5" fontSize="10" className="fill-gray-500 dark:fill-slate-400">=</text>
            <rect x="44" y="-7" width="28" height="14" rx="3" fill="#60a5fa" opacity="0.4" />
            <text x="58" y="5" textAnchor="middle" fontSize="10" fill="#93c5fd">n</text>
          </g>

          <text x="0" y="40" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">No sperm needed</text>
          <text x="0" y="56" textAnchor="middle" fontSize="10" fill="#fcd34d">→ Drone (always male)</text>
        </g>

        {/* Key insight — bottom */}
        <g transform="translate(285, 385)">
          <rect x="-240" y="-18" width="480" height="36" rx="6" fill="#f59e0b" opacity="0.1" stroke="#fbbf24" strokeWidth="1" />
          <text x="0" y="-2" textAnchor="middle" fontSize="10" fill="#fcd34d">
            Result: Sisters share 75% of genes (not 50%) — explains extreme cooperation
          </text>
          <text x="0" y="14" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            This &quot;superorganism&quot; behavior evolved because helping sisters passes more genes than reproducing alone
          </text>
        </g>
      </svg>
    </div>
  );
}
