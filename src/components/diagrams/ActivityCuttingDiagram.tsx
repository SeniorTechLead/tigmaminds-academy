export default function ActivityCuttingDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 340" className="w-full max-w-lg mx-auto" role="img" aria-label="Step-by-step guide to growing a plant from a cutting">
        <rect width="570" height="340" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="285" y="28" textAnchor="middle" className="fill-green-400" fontSize="14" fontWeight="bold">Grow Your Own Clone: Plant Cutting Activity</text>

        {/* Step 1 */}
        <rect x="20" y="50" width="120" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <circle cx="80" cy="70" r="12" className="fill-emerald-700" />
        <text x="80" y="74" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">1</text>
        <text x="80" y="95" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">Choose a stem</text>
        {/* Stem with node */}
        <line x1="80" y1="110" x2="80" y2="155" className="stroke-green-600" strokeWidth="3" />
        <ellipse cx="73" cy="118" rx="8" ry="4" className="fill-green-500" />
        <ellipse cx="87" cy="125" rx="8" ry="4" className="fill-green-500" />
        <circle cx="80" cy="135" r="3" className="fill-yellow-400" />
        <text x="80" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Pick a healthy stem</text>
        <text x="80" y="185" textAnchor="middle" className="fill-yellow-400" fontSize="7">with a node (bump)</text>

        {/* Step 2 */}
        <rect x="155" y="50" width="120" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <circle cx="215" cy="70" r="12" className="fill-emerald-700" />
        <text x="215" y="74" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">2</text>
        <text x="215" y="95" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">Cut below node</text>
        {/* Cut stem */}
        <line x1="215" y1="110" x2="215" y2="150" className="stroke-green-600" strokeWidth="3" />
        <circle cx="215" cy="130" r="3" className="fill-yellow-400" />
        <text x="228" y="153" className="fill-red-400" fontSize="12">✂</text>
        <line x1="205" y1="150" x2="225" y2="150" className="stroke-red-400" strokeWidth="1" strokeDasharray="3,2" />
        <text x="215" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Cut at 45-degree angle</text>
        <text x="215" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">just below a node</text>

        {/* Step 3 */}
        <rect x="290" y="50" width="120" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <circle cx="350" cy="70" r="12" className="fill-emerald-700" />
        <text x="350" y="74" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">3</text>
        <text x="350" y="95" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">Place in water</text>
        {/* Glass of water */}
        <rect x="330" y="115" width="40" height="50" rx="2" className="fill-blue-900" opacity="0.4" stroke="#60a5fa" strokeWidth="1" />
        <line x1="350" y1="115" x2="350" y2="100" className="stroke-green-500" strokeWidth="2" />
        <ellipse cx="344" cy="100" rx="6" ry="3" className="fill-green-400" />
        <ellipse cx="356" cy="98" rx="5" ry="3" className="fill-green-500" />
        <text x="350" y="175" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Node submerged</text>
        <text x="350" y="185" textAnchor="middle" className="fill-blue-300" fontSize="7">Change water daily</text>

        {/* Step 4 */}
        <rect x="425" y="50" width="125" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <circle cx="487" cy="70" r="12" className="fill-emerald-700" />
        <text x="487" y="74" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">4</text>
        <text x="487" y="95" textAnchor="middle" className="fill-emerald-300" fontSize="9" fontWeight="bold">Wait for roots</text>
        {/* Cutting with roots */}
        <rect x="468" y="120" width="38" height="40" rx="2" className="fill-blue-900" opacity="0.4" stroke="#60a5fa" strokeWidth="1" />
        <line x1="487" y1="120" x2="487" y2="105" className="stroke-green-500" strokeWidth="2" />
        <ellipse cx="481" cy="105" rx="6" ry="3" className="fill-green-400" />
        <ellipse cx="493" cy="103" rx="5" ry="3" className="fill-green-500" />
        {/* Roots */}
        <path d="M 483,145 Q 478,155 473,165" fill="none" className="stroke-amber-500" strokeWidth="1" />
        <path d="M 487,145 L 487,168" fill="none" className="stroke-amber-500" strokeWidth="1" />
        <path d="M 491,145 Q 496,155 501,165" fill="none" className="stroke-amber-500" strokeWidth="1" />
        <text x="487" y="175" textAnchor="middle" className="fill-amber-400" fontSize="7">Roots in 1-3 weeks!</text>
        <text x="487" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Then plant in soil</text>

        {/* Best plants to try */}
        <rect x="20" y="200" width="530" height="55" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="285" y="220" textAnchor="middle" className="fill-green-400" fontSize="10" fontWeight="bold">Easy plants to clone from cuttings:</text>
        {['Money plant', 'Tulsi (basil)', 'Mint', 'Rose', 'Hibiscus'].map((plant, i) => (
          <g key={i}>
            <rect x={35 + i * 105} y="228" width="90" height="20" rx="10" className="fill-green-900" opacity="0.5" />
            <text x={80 + i * 105} y="242" textAnchor="middle" className="fill-green-300" fontSize="9">{plant}</text>
          </g>
        ))}

        {/* Science note */}
        <rect x="20" y="268" width="530" height="60" rx="8" className="fill-emerald-900" opacity="0.3" />
        <text x="285" y="288" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">Why this works: Plant cells are totipotent</text>
        <text x="285" y="305" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="9">Unlike animal cells, a plant cell at the cut node can become ANY type of cell</text>
        <text x="285" y="320" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Root cells, leaf cells, stem cells -- all from one cutting. That is cloning in your kitchen.</text>
      </svg>
    </div>
  );
}
