export default function PitcherNutrientDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram comparing nutrient availability in normal soil versus pitcher plant bog soil">
        <rect width="560" height="400" rx="12" className="fill-slate-900" />
        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#86efac">Why Would a Plant Eat Insects?</text>
        <text x="280" y="46" textAnchor="middle" fontSize="10" className="fill-slate-400">Nutrient availability: normal soil vs pitcher plant habitat</text>

        {/* Normal soil side */}
        <g transform="translate(30, 70)">
          <text x="110" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#86efac">Normal Garden Soil</text>

          {/* Soil cross-section */}
          <rect x="20" y="20" width="180" height="120" rx="8" fill="#5c4033" stroke="#8b6914" strokeWidth="1.5" />
          {/* Organic matter */}
          {[30, 55, 80, 110, 140, 160].map((xp, i) => (
            <circle key={i} cx={xp} cy={40 + (i % 3) * 15} r={3 + (i % 2) * 2} fill="#3b2f1e" opacity="0.6" />
          ))}
          {/* Root system */}
          <path d="M 100,20 L 100,60 M 100,40 L 80,55 M 100,40 L 120,58 M 100,55 L 90,70 M 100,55 L 115,72" stroke="#4ade80" strokeWidth="2" fill="none" />
          {/* Bacteria symbols */}
          {[{x: 60, y: 90}, {x: 140, y: 80}, {x: 100, y: 110}].map((p, i) => (
            <g key={i}>
              <ellipse cx={p.x} cy={p.y} rx="6" ry="3" fill="#a78bfa" opacity="0.7" />
              <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="5" fill="white">N₂</text>
            </g>
          ))}
          <text x="110" y="155" textAnchor="middle" fontSize="9" className="fill-slate-400">Rich in bacteria that fix N₂</text>

          {/* Nutrient bars */}
          <text x="10" y="185" fontSize="9" fill="#86efac">Nitrogen</text>
          <rect x="70" y="176" width="130" height="12" rx="3" fill="#22c55e" opacity="0.7" />
          <text x="140" y="186" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">200 mg/kg</text>

          <text x="10" y="207" fontSize="9" fill="#60a5fa">Phosphorus</text>
          <rect x="70" y="198" width="90" height="12" rx="3" fill="#3b82f6" opacity="0.7" />
          <text x="120" y="208" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">50 mg/kg</text>

          <text x="10" y="229" fontSize="9" fill="#fbbf24">Potassium</text>
          <rect x="70" y="220" width="120" height="12" rx="3" fill="#eab308" opacity="0.7" />
          <text x="135" y="230" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">180 mg/kg</text>
        </g>

        {/* VS divider */}
        <text x="280" y="200" textAnchor="middle" fontSize="16" fontWeight="bold" className="fill-slate-500">vs</text>

        {/* Bog soil side */}
        <g transform="translate(300, 70)">
          <text x="120" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f87171">Pitcher Plant Bog Soil</text>

          {/* Waterlogged soil */}
          <rect x="20" y="20" width="180" height="120" rx="8" fill="#1e3a5f" stroke="#334155" strokeWidth="1.5" />
          {/* Water indication */}
          {[35, 55, 75, 95, 115].map((yp, i) => (
            <path key={i} d={`M 30,${yp} Q ${60 + i * 5},${yp - 3} ${100 + i * 3},${yp} Q ${140 - i * 2},${yp + 3} 190,${yp}`} stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.3" />
          ))}
          {/* Rain arrows */}
          {[50, 90, 130, 170].map((xp, i) => (
            <g key={i}>
              <line x1={xp} y1="15" x2={xp} y2="25" stroke="#93c5fd" strokeWidth="1.5" />
              <polygon points={`${xp},28 ${xp - 3},22 ${xp + 3},22`} fill="#93c5fd" />
            </g>
          ))}
          <text x="110" y="13" textAnchor="middle" fontSize="8" fill="#93c5fd">11,000+ mm rain/year</text>
          {/* Leaching arrows going down */}
          {[60, 100, 150].map((xp, i) => (
            <g key={i}>
              <line x1={xp} y1="125" x2={xp} y2="140" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2" />
              <text x={xp} y="150" textAnchor="middle" fontSize="6" fill="#f87171">N↓</text>
            </g>
          ))}
          <text x="120" y="165" textAnchor="middle" fontSize="9" className="fill-slate-400">Nutrients leached by heavy rain</text>

          {/* Nutrient bars - tiny */}
          <text x="10" y="185" fontSize="9" fill="#86efac">Nitrogen</text>
          <rect x="70" y="176" width="10" height="12" rx="3" fill="#22c55e" opacity="0.7" />
          <text x="90" y="186" fontSize="8" fill="#f87171" fontWeight="bold">10 mg/kg</text>

          <text x="10" y="207" fontSize="9" fill="#60a5fa">Phosphorus</text>
          <rect x="70" y="198" width="5" height="12" rx="3" fill="#3b82f6" opacity="0.7" />
          <text x="85" y="208" fontSize="8" fill="#f87171" fontWeight="bold">2 mg/kg</text>

          <text x="10" y="229" fontSize="9" fill="#fbbf24">Potassium</text>
          <rect x="70" y="220" width="18" height="12" rx="3" fill="#eab308" opacity="0.7" />
          <text x="98" y="230" fontSize="8" fill="#f87171" fontWeight="bold">25 mg/kg</text>
        </g>

        {/* Bottom: the solution */}
        <g transform="translate(280, 330)">
          <rect x="-250" y="-10" width="500" height="60" rx="8" fill="#14532d" opacity="0.4" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="8" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#86efac">The Evolutionary Solution</text>
          <text x="0" y="24" textAnchor="middle" fontSize="10" className="fill-slate-300">Insects are 16% nitrogen by mass. One ant provides more nitrogen</text>
          <text x="0" y="38" textAnchor="middle" fontSize="10" className="fill-slate-300">than the plant could absorb from the soil in weeks.</text>
        </g>
      </svg>
    </div>
  );
}
