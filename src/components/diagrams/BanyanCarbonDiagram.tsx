export default function BanyanCarbonDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 575 411" className="w-full max-w-2xl mx-auto" role="img" aria-label="Carbon cycle through a banyan tree showing CO2 absorption, carbon storage in wood, and O2 release">
        <rect width="500" height="380" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Carbon Cycle Through a Banyan Tree</text>

        {/* Tree trunk */}
        <rect x="225" y="140" width="50" height="140" rx="5" className="fill-amber-800" />
        <rect x="232" y="145" width="36" height="130" rx="4" className="fill-amber-700" opacity="0.5" />

        {/* Canopy */}
        <ellipse cx="250" cy="110" rx="100" ry="65" className="fill-green-700" opacity="0.8" />
        <ellipse cx="250" cy="100" rx="80" ry="50" className="fill-green-600" opacity="0.6" />

        {/* Roots */}
        <path d="M 230,280 Q 180,300 100,320" className="stroke-amber-700" strokeWidth="3" fill="none" />
        <path d="M 270,280 Q 320,300 400,320" className="stroke-amber-700" strokeWidth="3" fill="none" />

        {/* Ground line */}
        <line x1="50" y1="280" x2="450" y2="280" className="stroke-amber-800" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* CO2 IN - left side */}
        <g>
          <rect x="20" y="55" width="70" height="30" rx="15" className="fill-slate-700" />
          <text x="55" y="74" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="600">CO₂</text>
          <text x="55" y="50" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">from atmosphere</text>
          <path d="M 90,70 Q 120,70 150,85" className="stroke-green-400" strokeWidth="2" fill="none" markerEnd="url(#carbonArrowGreen)">
            <animate attributeName="stroke-dashoffset" from="15" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <text x="115" y="64" className="fill-green-400" fontSize="8">absorbed</text>
        </g>

        {/* O2 OUT - right side */}
        <g>
          <path d="M 350,85 Q 380,70 410,70" className="stroke-sky-400" strokeWidth="2" fill="none" markerEnd="url(#carbonArrowSky)">
            <animate attributeName="stroke-dashoffset" from="15" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <rect x="410" y="55" width="70" height="30" rx="15" className="fill-sky-900" />
          <text x="445" y="74" textAnchor="middle" className="fill-sky-300" fontSize="11" fontWeight="600">O₂</text>
          <text x="445" y="50" textAnchor="middle" className="fill-sky-400" fontSize="9">released</text>
          <text x="385" y="64" className="fill-sky-400" fontSize="8">released</text>
        </g>

        {/* Carbon stored in wood - label inside trunk */}
        <line x1="275" y1="200" x2="340" y2="200" className="stroke-amber-400" strokeWidth="1" />
        <rect x="340" y="185" width="110" height="35" rx="6" className="fill-amber-900 stroke-amber-600" strokeWidth="1" />
        <text x="395" y="200" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Carbon stored</text>
        <text x="395" y="213" textAnchor="middle" className="fill-amber-400" fontSize="8">in wood & roots</text>

        {/* Carbon stored label in canopy */}
        <text x="250" y="95" textAnchor="middle" className="fill-green-200" fontSize="9" fontWeight="bold">Leaves absorb CO₂</text>
        <text x="250" y="108" textAnchor="middle" className="fill-green-300" fontSize="8">via photosynthesis</text>

        {/* Key stat box */}
        <rect x="100" y="330" width="300" height="36" rx="8" className="fill-green-900" opacity="0.7" />
        <text x="250" y="348" textAnchor="middle" className="fill-green-300" fontSize="11" fontWeight="bold">1 large banyan stores 20–40 tonnes of carbon</text>
        <text x="250" y="361" textAnchor="middle" className="fill-green-400" fontSize="9">That is equal to ~80–150 tonnes of CO₂ removed from the air</text>

        {/* Small carbon atoms in trunk */}
        {[200, 215, 230, 245, 260].map((y, i) => (
          <g key={i}>
            <circle cx={240 + (i % 2) * 15} cy={y} r="4" className="fill-amber-500" opacity="0.5" />
            <text x={240 + (i % 2) * 15} y={y + 3} textAnchor="middle" className="fill-amber-900" fontSize="5" fontWeight="bold">C</text>
          </g>
        ))}

        {/* Arrow defs */}
        <defs>
          <marker id="carbonArrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-green-400" />
          </marker>
          <marker id="carbonArrowSky" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-sky-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
