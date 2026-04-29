export default function BanyanNutrientCycleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 535 458" className="w-full max-w-2xl mx-auto" role="img" aria-label="Nutrient cycling in a banyan tree: leaves fall, decompose, nutrients enter soil, roots absorb, tree grows, leaves fall again">
        <rect width="500" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Nutrient Cycle</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Nothing is wasted — every leaf feeds the next</text>

        {/* Central circle path (invisible guide) */}
        {/* Nodes arranged in a circle: top=tree grows, right=leaves fall, bottom=decompose, left=roots absorb */}

        {/* === NODE 1: Tree Grows (top) === */}
        <g>
          {/* Mini tree */}
          <rect x="237" y="75" width="12" height="30" rx="2" className="fill-amber-700" />
          <ellipse cx="243" cy="72" rx="22" ry="15" className="fill-green-600" opacity="0.8" />
          <rect x="200" y="100" width="86" height="24" rx="6" className="fill-green-900" />
          <text x="243" y="116" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Tree grows</text>
        </g>

        {/* === Arrow 1→2 (top-right) === */}
        <path d="M 290,105 Q 340,120 370,160" className="stroke-green-400" strokeWidth="2" fill="none" markerEnd="url(#nutrientArrow)" />

        {/* === NODE 2: Leaves Fall (right) === */}
        <g>
          {/* Falling leaf icons */}
          <path d="M 395,180 Q 400,175 408,180 Q 403,187 395,180 Z" className="fill-amber-500" />
          <path d="M 385,195 Q 390,190 398,195 Q 393,202 385,195 Z" className="fill-amber-600" />
          <path d="M 405,200 Q 410,195 418,200 Q 413,207 405,200 Z" className="fill-yellow-600" />
          <rect x="355" y="210" width="100" height="24" rx="6" className="fill-amber-900" />
          <text x="405" y="226" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Leaves fall</text>
        </g>

        {/* === Arrow 2→3 (bottom-right) === */}
        <path d="M 400,240 Q 380,280 340,310" className="stroke-amber-400" strokeWidth="2" fill="none" markerEnd="url(#nutrientArrowAmber)" />

        {/* === NODE 3: Decomposition (bottom) === */}
        <g>
          {/* Decomposing matter */}
          <rect x="195" y="300" width="96" height="20" rx="4" className="fill-amber-800" opacity="0.5" />
          {/* Microbe dots */}
          {[210, 225, 240, 255, 270].map((x, i) => (
            <circle key={i} cx={x} cy={310} r="2" className="fill-amber-400" opacity="0.6" />
          ))}
          <rect x="185" y="325" width="116" height="36" rx="6" className="fill-amber-900" />
          <text x="243" y="341" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Decomposition</text>
          <text x="243" y="354" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">bacteria &amp; fungi</text>
        </g>

        {/* === Arrow 3→4 (bottom-left) === */}
        <path d="M 185,320 Q 140,290 110,250" className="stroke-amber-400" strokeWidth="2" fill="none" markerEnd="url(#nutrientArrowAmber)" />

        {/* === NODE 4: Nutrients in Soil (left) === */}
        <g>
          {/* Soil particles */}
          {[65, 80, 95, 110].map((x, i) => (
            <circle key={i} cx={x} cy={218 + (i % 2) * 6} r="3" className="fill-amber-600" opacity="0.5" />
          ))}
          <rect x="40" y="230" width="110" height="36" rx="6" className="fill-green-900" />
          <text x="95" y="246" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Nutrients in soil</text>
          <text x="95" y="259" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">N, P, K, Ca, Mg</text>
        </g>

        {/* === Arrow 4→5 (top-left) === */}
        <path d="M 100,225 Q 110,190 130,165" className="stroke-green-400" strokeWidth="2" fill="none" markerEnd="url(#nutrientArrow)" />

        {/* === NODE 5: Root Absorption (upper-left) === */}
        <g>
          {/* Root icon */}
          <path d="M 145,145 Q 130,155 120,168" className="stroke-amber-600" strokeWidth="2" fill="none" />
          <path d="M 145,145 Q 155,158 148,170" className="stroke-amber-600" strokeWidth="2" fill="none" />
          <rect x="120" y="125" width="100" height="24" rx="6" className="fill-green-900" />
          <text x="170" y="141" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Roots absorb</text>
        </g>

        {/* === Arrow 5→1 (top) === */}
        <path d="M 210,125 Q 225,108 237,105" className="stroke-green-400" strokeWidth="2" fill="none" markerEnd="url(#nutrientArrow)" />

        {/* Central label */}
        <text x="243" y="215" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="10" fontWeight="bold">CYCLE</text>
        <circle cx="243" cy="210" r="35" className="stroke-slate-600" strokeWidth="1" fill="none" strokeDasharray="4,4" />

        {/* Key nutrients box */}
        <rect x="60" y="380" width="380" height="28" rx="8" className="fill-green-900" opacity="0.6" />
        <text x="250" y="395" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">A banyan drops ~2 tonnes of leaves per year — all recycled into new growth</text>
        <text x="250" y="408" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">This self-fertilizing loop lets banyans thrive for centuries in poor soils</text>

        <defs>
          <marker id="nutrientArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-green-400" />
          </marker>
          <marker id="nutrientArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
