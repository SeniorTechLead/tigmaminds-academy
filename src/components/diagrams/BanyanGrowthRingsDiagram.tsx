export default function BanyanGrowthRingsDiagram() {
  const rings = [
    { r: 20, width: 3, label: "Drought year", color: "fill-amber-900" },
    { r: 28, width: 5, label: "", color: "fill-amber-800" },
    { r: 38, width: 8, label: "Good rainfall", color: "fill-amber-700" },
    { r: 52, width: 10, label: "", color: "fill-amber-800" },
    { r: 68, width: 12, label: "Excellent year", color: "fill-amber-700" },
    { r: 86, width: 8, label: "", color: "fill-amber-800" },
    { r: 100, width: 4, label: "Drought", color: "fill-amber-900" },
    { r: 110, width: 8, label: "", color: "fill-amber-700" },
    { r: 124, width: 10, label: "", color: "fill-amber-800" },
    { r: 140, width: 5, label: "", color: "fill-amber-700" },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 557 455" className="w-full max-w-2xl mx-auto" role="img" aria-label="Tree trunk cross-section showing growth rings that reveal age and climate history">
        <rect width="500" height="420" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Reading Growth Rings</text>

        {/* Outer bark circle */}
        <circle cx="200" cy="210" r="150" className="fill-amber-950" />

        {/* Growth rings - drawn inside out */}
        {rings.slice().reverse().map((ring, i) => (
          <circle key={i} cx="200" cy="210" r={ring.r} className={ring.color} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
        ))}

        {/* Pith (center) */}
        <circle cx="200" cy="210" r="8" className="fill-amber-600" />
        <text x="200" y="213" textAnchor="middle" className="fill-amber-950" fontSize="6" fontWeight="bold">pith</text>

        {/* Bark label */}
        <line x1="340" y1="150" x2="365" y2="130" className="stroke-amber-400" strokeWidth="1" />
        <text x="370" y="128" className="fill-amber-400" fontSize="9" fontWeight="bold">Bark</text>
        <text x="370" y="140" className="fill-slate-400" fontSize="8">(outer protection)</text>

        {/* Narrow ring callout - drought */}
        <line x1="200" y1="110" x2="370" y2="85" className="stroke-slate-500" strokeWidth="1" />
        <rect x="370" y="72" width="110" height="22" rx="4" className="fill-amber-900" />
        <text x="425" y="87" textAnchor="middle" className="fill-amber-300" fontSize="9">Narrow = drought</text>

        {/* Wide ring callout - good year */}
        <line x1="200" y1="155" x2="370" y2="175" className="stroke-slate-500" strokeWidth="1" />
        <rect x="370" y="165" width="115" height="22" rx="4" className="fill-green-900" />
        <text x="427" y="180" textAnchor="middle" className="fill-green-300" fontSize="9">Wide = good year</text>

        {/* Age arrow */}
        <line x1="200" y1="210" x2="200" y2="360" className="stroke-amber-400" strokeWidth="1" />
        <line x1="50" y1="360" x2="350" y2="360" className="stroke-amber-400" strokeWidth="1.5" markerEnd="url(#ringArrow)" />
        <text x="200" y="378" textAnchor="middle" className="fill-amber-300" fontSize="10">Count rings from center → each ring = 1 year</text>

        {/* Sapwood label */}
        <line x1="90" y1="280" x2="60" y2="310" className="stroke-green-400" strokeWidth="1" />
        <text x="55" y="323" textAnchor="end" className="fill-green-400" fontSize="9" fontWeight="bold">Sapwood</text>
        <text x="55" y="335" textAnchor="end" className="fill-slate-400" fontSize="8">(carries water)</text>

        {/* Heartwood label */}
        <line x1="170" y1="250" x2="60" y2="270" className="stroke-amber-400" strokeWidth="1" />
        <text x="55" y="268" textAnchor="end" className="fill-amber-400" fontSize="9" fontWeight="bold">Heartwood</text>
        <text x="55" y="280" textAnchor="end" className="fill-slate-400" fontSize="8">(dense, strong)</text>

        {/* How to read */}
        <text x="250" y="405" textAnchor="middle" className="fill-green-300" fontSize="9">This cross-section shows ~10 years of growth and climate history</text>

        <defs>
          <marker id="ringArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
