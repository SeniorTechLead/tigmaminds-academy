export default function LensRayDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 250" className="w-full max-w-2xl mx-auto" role="img" aria-label="Convex and concave lens ray diagrams">
        {/* ======== CONVEX LENS (left panel) ======== */}
        <text x={135} y={16} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">Convex (Converging) Lens</text>

        {/* Principal axis */}
        <line x1={10} y1={120} x2={260} y2={120} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Lens (biconvex shape) */}
        <ellipse cx={135} cy={120} rx={6} ry={55} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Focal point labels */}
        <circle cx={185} cy={120} r={3} className="fill-red-500" />
        <text x={185} y={138} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="700">F</text>

        <circle cx={85} cy={120} r={3} className="fill-red-500" />
        <text x={85} y={138} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="700">F</text>

        {/* Optical center */}
        <circle cx={135} cy={120} r={3} className="fill-gray-600 dark:fill-gray-300" />
        <text x={135} y={148} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">O</text>

        {/* Object arrow */}
        <line x1={50} y1={120} x2={50} y2={80} stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2" />
        <polygon points="47,82 53,82 50,74" className="fill-emerald-600 dark:fill-emerald-400" />
        <text x={50} y={72} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">Object</text>

        {/* Ray 1: Parallel to axis → through F */}
        <line x1={50} y1={85} x2={135} y2={85} className="stroke-orange-500" strokeWidth="1.5" />
        <line x1={135} y1={85} x2={250} y2={155} className="stroke-orange-500" strokeWidth="1.5" />
        <polygon points="248,153 252,157 244,157" className="fill-orange-500" />

        {/* Ray 2: Through center (straight) */}
        <line x1={50} y1={85} x2={250} y2={145} className="stroke-sky-500" strokeWidth="1.5" />
        <polygon points="248,143 252,147 245,147" className="fill-sky-500" />

        {/* Ray 3: Through F on object side → exits parallel */}
        <line x1={50} y1={85} x2={135} y2={120} className="stroke-violet-500" strokeWidth="1.5" strokeDasharray="0" />
        {/* This ray goes through F then to lens, so: from object through F to lens */}
        <line x1={50} y1={85} x2={85} y2={100.8} className="stroke-violet-500" strokeWidth="0" />
        {/* Simplified: aim at F, refract parallel */}
        <line x1={50} y1={85} x2={135} y2={155} className="stroke-violet-500" strokeWidth="1.5" />
        <line x1={135} y1={155} x2={250} y2={155} className="stroke-violet-500" strokeWidth="1.5" />

        {/* Image arrow (inverted) */}
        <line x1={220} y1={120} x2={220} y2={155} stroke="currentColor" className="text-red-500" strokeWidth="2" />
        <polygon points="217,153 223,153 220,160" className="fill-red-500" />
        <text x={220} y={170} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">Image</text>
        <text x={220} y={181} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(real, inverted)</text>

        {/* Label: Principal axis */}
        <text x={250} y={116} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="10">axis</text>

        {/* ======== CONCAVE LENS (right panel) ======== */}
        <text x={405} y={16} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">Concave (Diverging) Lens</text>

        {/* Principal axis */}
        <line x1={280} y1={120} x2={530} y2={120} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Lens (biconcave shape using two arcs) */}
        <path d="M 399 65 Q 411 120 399 175" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <path d="M 411 65 Q 399 120 411 175" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        {/* Top and bottom caps */}
        <line x1={399} y1={65} x2={411} y2={65} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <line x1={399} y1={175} x2={411} y2={175} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Virtual focal point (same side as incoming light) */}
        <circle cx={365} cy={120} r={3} className="fill-red-500" />
        <text x={365} y={138} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="700">F</text>

        {/* Optical center */}
        <circle cx={405} cy={120} r={3} className="fill-gray-600 dark:fill-gray-300" />
        <text x={405} y={148} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">O</text>

        {/* Object arrow */}
        <line x1={320} y1={120} x2={320} y2={80} stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2" />
        <polygon points="317,82 323,82 320,74" className="fill-emerald-600 dark:fill-emerald-400" />
        <text x={320} y={72} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">Object</text>

        {/* Ray 1: Parallel to axis → diverges away from F */}
        <line x1={320} y1={85} x2={405} y2={85} className="stroke-orange-500" strokeWidth="1.5" />
        <line x1={405} y1={85} x2={520} y2={60} className="stroke-orange-500" strokeWidth="1.5" />
        <polygon points="518,58 522,62 515,62" className="fill-orange-500" />
        {/* Virtual extension back to F (dashed) */}
        <line x1={405} y1={85} x2={365} y2={120} className="stroke-orange-500" strokeWidth="1" strokeDasharray="3,3" opacity={0.5} />

        {/* Ray 2: Through center (straight) */}
        <line x1={320} y1={85} x2={520} y2={150} className="stroke-sky-500" strokeWidth="1.5" />
        <polygon points="518,148 522,152 515,152" className="fill-sky-500" />

        {/* Ray 3: Aimed at far F → exits parallel */}
        <line x1={320} y1={85} x2={405} y2={105} className="stroke-violet-500" strokeWidth="1.5" />
        <line x1={405} y1={105} x2={520} y2={105} className="stroke-violet-500" strokeWidth="1.5" />
        {/* Virtual extension */}
        <line x1={405} y1={105} x2={365} y2={120} className="stroke-violet-500" strokeWidth="1" strokeDasharray="3,3" opacity={0.5} />

        {/* Virtual image (upright, smaller, same side) */}
        <line x1={370} y1={120} x2={370} y2={102} stroke="currentColor" className="text-red-500" strokeWidth="2" strokeDasharray="3,2" />
        <polygon points="367,104 373,104 370,97" className="fill-red-500" opacity={0.7} />
        <text x={370} y={196} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">Image</text>
        <text x={370} y={207} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(virtual, upright)</text>

        {/* Label: Principal axis */}
        <text x={520} y={116} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="10">axis</text>

        {/* Legend */}
        <line x1={20} y1={230} x2={40} y2={230} className="stroke-orange-500" strokeWidth="1.5" />
        <text x={45} y={234} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Parallel ray</text>
        <line x1={130} y1={230} x2={150} y2={230} className="stroke-sky-500" strokeWidth="1.5" />
        <text x={155} y={234} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Central ray</text>
        <line x1={240} y1={230} x2={260} y2={230} className="stroke-violet-500" strokeWidth="1.5" />
        <text x={265} y={234} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Focal ray</text>
      </svg>
    </div>
  );
}
