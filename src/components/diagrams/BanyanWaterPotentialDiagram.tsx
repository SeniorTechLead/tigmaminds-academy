export default function BanyanWaterPotentialDiagram() {
  const levels = [
    { label: "Atmosphere", value: "-100 MPa", y: 50, color: "fill-sky-900", textColor: "fill-sky-300", barW: 20 },
    { label: "Leaf surface", value: "-2.0 MPa", y: 110, color: "fill-green-900", textColor: "fill-green-300", barW: 50 },
    { label: "Leaf cells", value: "-1.5 MPa", y: 160, color: "fill-green-800", textColor: "fill-green-300", barW: 70 },
    { label: "Trunk xylem", value: "-1.0 MPa", y: 220, color: "fill-amber-900", textColor: "fill-amber-300", barW: 90 },
    { label: "Root xylem", value: "-0.8 MPa", y: 270, color: "fill-amber-800", textColor: "fill-amber-300", barW: 100 },
    { label: "Soil water", value: "-0.3 MPa", y: 320, color: "fill-blue-900", textColor: "fill-blue-300", barW: 130 },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 455" className="w-full max-w-lg mx-auto" role="img" aria-label="Water potential gradient from soil to atmosphere showing how decreasing water potential drives transpiration">
        <rect width="500" height="420" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Water Potential Gradient</text>
        <text x="250" y="44" textAnchor="middle" className="fill-slate-400" fontSize="10">Water moves from high to low potential (less negative → more negative)</text>

        {/* Tree silhouette on right */}
        <g opacity="0.3">
          <ellipse cx="400" cy="120" rx="60" ry="50" className="fill-green-700" />
          <rect x="394" y="155" width="12" height="130" className="fill-amber-700" />
          <path d="M 394,285 Q 370,300 340,310" className="stroke-amber-700" strokeWidth="2" fill="none" />
          <path d="M 406,285 Q 430,300 460,310" className="stroke-amber-700" strokeWidth="2" fill="none" />
        </g>

        {/* Gradient bars */}
        {levels.map((level, i) => (
          <g key={i}>
            {/* Bar */}
            <rect x={80} y={level.y} width={level.barW} height={28} rx="4" className={level.color} />
            {/* Label */}
            <text x={80 + level.barW + 10} y={level.y + 14} className={level.textColor} fontSize="10" fontWeight="bold">{level.label}</text>
            <text x={80 + level.barW + 10} y={level.y + 26} className="fill-slate-400" fontSize="9">ψ = {level.value}</text>

            {/* Arrow to next level */}
            {i < levels.length - 1 && (
              <line x1={40} y1={level.y + 30} x2={40} y2={levels[i + 1].y - 2} className="stroke-blue-400" strokeWidth="1.5" markerEnd="url(#wpArrowUp)" />
            )}
          </g>
        ))}

        {/* Direction label */}
        <text x="25" y="190" textAnchor="middle" className="fill-blue-400" fontSize="9" fontWeight="bold" transform="rotate(-90, 25, 190)">Water flows UP</text>

        {/* More negative arrow on left */}
        <line x1="55" y1="320" x2="55" y2="55" className="stroke-slate-500" strokeWidth="1" markerEnd="url(#wpArrowSlate)" />
        <text x="55" y="345" textAnchor="middle" className="fill-slate-500" fontSize="7">Less negative</text>
        <text x="55" y="48" textAnchor="middle" className="fill-slate-500" fontSize="7">More negative</text>

        {/* Key insight box */}
        <rect x="290" y="240" width="185" height="65" rx="8" className="fill-blue-900" opacity="0.5" />
        <text x="382" y="258" textAnchor="middle" className="fill-blue-300" fontSize="9" fontWeight="bold">Why does water go up?</text>
        <text x="382" y="273" textAnchor="middle" className="fill-slate-300" fontSize="8">Water moves from less negative</text>
        <text x="382" y="285" textAnchor="middle" className="fill-slate-300" fontSize="8">(soil: -0.3) to more negative</text>
        <text x="382" y="297" textAnchor="middle" className="fill-slate-300" fontSize="8">(air: -100) — down the gradient</text>

        {/* The enormous gap */}
        <rect x="290" y="320" width="185" height="40" rx="8" className="fill-amber-900" opacity="0.5" />
        <text x="382" y="338" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">The atmosphere is incredibly dry</text>
        <text x="382" y="352" textAnchor="middle" className="fill-slate-400" fontSize="8">-100 MPa = enormous suction force</text>

        {/* Evaporation arrows at top */}
        {[350, 380, 410, 440].map((x, i) => (
          <line key={i} x1={x} y1={75} x2={x} y2={58} className="stroke-blue-400" strokeWidth="1" strokeDasharray="2,2" opacity="0.5">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
          </line>
        ))}

        {/* Bottom summary */}
        <text x="250" y="390" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Transpiration: the engine that pulls water from soil to sky</text>
        <text x="250" y="405" textAnchor="middle" className="fill-slate-400" fontSize="8">A large banyan can transpire 1,000+ litres of water per day</text>

        <defs>
          <marker id="wpArrowUp" markerWidth="6" markerHeight="5" refX="3" refY="5" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-blue-400" />
          </marker>
          <marker id="wpArrowSlate" markerWidth="6" markerHeight="5" refX="3" refY="0" orient="auto">
            <polygon points="0 5, 3 0, 6 5" className="fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
