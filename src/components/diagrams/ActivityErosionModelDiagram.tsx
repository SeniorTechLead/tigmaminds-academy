export default function ActivityErosionModelDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 380" className="w-full max-w-lg mx-auto" role="img" aria-label="Step-by-step instructions for building a mini river erosion model using a tray, sand, and water">
        <rect width="580" height="380" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="290" y="26" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Build Your Own Erosion Model</text>

        {/* Step 1: Materials */}
        <rect x="15" y="42" width="170" height="155" rx="8" className="fill-slate-800" />
        <circle cx="30" cy="56" r="10" className="fill-sky-600" />
        <text x="30" y="60" textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">1</text>
        <text x="105" y="60" textAnchor="middle" className="fill-sky-300" fontSize="11" fontWeight="bold">Gather Materials</text>

        {/* Tray */}
        <rect x="30" y="75" width="140" height="20" rx="4" className="fill-slate-600" />
        <text x="100" y="89" textAnchor="middle" className="fill-slate-300" fontSize="10">Baking tray</text>

        {/* Sand pile */}
        <path d="M 50,120 Q 80,100 110,120 Z" className="fill-amber-600" opacity="0.7" />
        <text x="80" y="135" textAnchor="middle" className="fill-amber-400" fontSize="10">Sand or soil</text>

        {/* Water bottle */}
        <rect x="125" y="102" width="15" height="30" rx="3" className="fill-blue-600" opacity="0.6" />
        <text x="155" y="122" className="fill-blue-400" fontSize="10">Water</text>

        {/* Small objects */}
        <circle cx="55" cy="160" r="5" className="fill-emerald-500" opacity="0.6" />
        <rect x="70" y="155" width="10" height="10" rx="1" className="fill-red-500" opacity="0.5" />
        <text x="100" y="165" className="fill-slate-400" fontSize="9">Small objects</text>
        <text x="100" y="178" className="fill-slate-400" fontSize="9">(stones, twigs)</text>

        {/* Step 2: Build terrain */}
        <rect x="195" y="42" width="190" height="155" rx="8" className="fill-slate-800" />
        <circle cx="210" cy="56" r="10" className="fill-sky-600" />
        <text x="210" y="60" textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">2</text>
        <text x="310" y="60" textAnchor="middle" className="fill-sky-300" fontSize="11" fontWeight="bold">Shape the Terrain</text>

        {/* Tilted tray with sand */}
        <g transform="rotate(-12, 290, 130)">
          <rect x="210" y="80" width="160" height="70" rx="4" className="fill-slate-600" opacity="0.5" />
          {/* Sand slope */}
          <path d="M 215,130 Q 250,90 370,85 L 370,150 L 215,150 Z" className="fill-amber-700" opacity="0.6" />
          {/* Small mound = future island */}
          <ellipse cx="310" cy="115" rx="18" ry="10" className="fill-amber-500" opacity="0.7" />
        </g>

        <text x="290" y="168" textAnchor="middle" className="fill-slate-300" fontSize="10">Tilt the tray. Pile sand</text>
        <text x="290" y="181" textAnchor="middle" className="fill-slate-300" fontSize="10">higher at one end.</text>
        <text x="290" y="193" textAnchor="middle" className="fill-amber-400" fontSize="10">Add a mound = "island"</text>

        {/* Step 3: Pour water */}
        <rect x="395" y="42" width="170" height="155" rx="8" className="fill-slate-800" />
        <circle cx="410" cy="56" r="10" className="fill-sky-600" />
        <text x="410" y="60" textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">3</text>
        <text x="490" y="60" textAnchor="middle" className="fill-sky-300" fontSize="11" fontWeight="bold">Add Water Slowly</text>

        {/* Water pouring */}
        <g transform="rotate(-12, 480, 120)">
          <rect x="405" y="75" width="150" height="65" rx="4" className="fill-slate-600" opacity="0.4" />
          {/* Water stream */}
          <path d="M 420,75 Q 425,95 430,110" fill="none" className="stroke-blue-400" strokeWidth="3">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
          </path>
          {/* Channel forming */}
          <path d="M 430,110 Q 460,108 500,100 Q 530,95 555,92" fill="none" className="stroke-blue-500" strokeWidth="4" opacity="0.5" />
          {/* Eroded mound */}
          <ellipse cx="480" cy="105" rx="14" ry="7" className="fill-amber-500" opacity="0.5" />
        </g>

        <text x="480" y="168" textAnchor="middle" className="fill-slate-300" fontSize="10">Pour slowly from</text>
        <text x="480" y="181" textAnchor="middle" className="fill-slate-300" fontSize="10">the high end.</text>
        <text x="480" y="193" textAnchor="middle" className="fill-blue-400" fontSize="10">Watch the channel form!</text>

        {/* Observation prompts */}
        <rect x="15" y="207" width="550" height="165" rx="8" className="fill-slate-800" />
        <circle cx="30" cy="221" r="10" className="fill-amber-600" />
        <text x="30" y="225" textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold">?</text>
        <text x="55" y="225" className="fill-amber-300" fontSize="12" fontWeight="bold">What to Observe</text>

        {/* Questions */}
        {[
          ['Where does the water carve channels?', 'Erosion happens where water flows fastest (steep slopes, narrow gaps)'],
          ['Where does sand pile up?', 'Deposition happens where water slows down (flat areas, behind obstacles)'],
          ['Does water go around your mound?', 'This is exactly how Majuli formed \u2014 the river flowed around the land'],
          ['What happens when you pour more water?', 'More water = more erosion \u2014 like monsoon floods attacking Majuli\u2019s banks'],
        ].map(([q, a], i) => (
          <g key={`obs-${i}`}>
            <circle cx="35" cy={248 + i * 28} r="3" className="fill-sky-400" />
            <text x="48" y={252 + i * 28} className="fill-sky-300" fontSize="11" fontWeight="bold">{q}</text>
            <text x="48" y={264 + i * 28} className="fill-slate-400" fontSize="10">{a}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
