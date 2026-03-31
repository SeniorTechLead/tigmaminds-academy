export default function TejimolaPlantReproDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        className="w-full h-auto"
        role="img"
        aria-label="Plant reproduction diagram comparing sexual (seed) and asexual (vegetative) propagation"
      >
        <rect width="600" height="440" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#34d399">Seeds of Survival: How Plants Reproduce</text>

        {/* Divider */}
        <line x1="300" y1="50" x2="300" y2="430" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="6,4" />

        {/* LEFT: Sexual reproduction (seeds) */}
        <text x="150" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#60a5fa">Sexual — Seeds</text>

        {/* Flower */}
        <g transform="translate(150, 120)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-20" rx="10" ry="18" fill="#f472b6" opacity="0.8" transform={`rotate(${angle},0,0)`} />
          ))}
          <circle cx="0" cy="0" r="10" fill="#fbbf24" />
          {/* Pollen grains */}
          {[[-3, -2], [4, 1], [0, -5]].map(([x, y], i) => (
            <circle key={`p${i}`} cx={x} cy={y} r="2" fill="#fef3c7" opacity="0.9" />
          ))}
          <text x="0" y="4" textAnchor="middle" fontSize="7" fill="#92400e">pollen</text>
        </g>
        <text x="150" y="155" textAnchor="middle" fontSize="10" fill="#d1d5db">Flower produces pollen + ovules</text>

        {/* Arrow down */}
        <line x1="150" y1="162" x2="150" y2="185" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
        <text x="150" y="200" textAnchor="middle" fontSize="10" fill="#93c5fd">Pollination (wind, bees, water)</text>

        {/* Seed */}
        <g transform="translate(150, 230)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#a16207" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="0" cy="0" rx="6" ry="4" fill="#ca8a04" opacity="0.6" />
          <text x="0" y="3" textAnchor="middle" fontSize="6" fill="#fef3c7">embryo</text>
        </g>
        <text x="150" y="255" textAnchor="middle" fontSize="10" fill="#d1d5db">Seed = embryo + food + coat</text>

        {/* Arrow to seedling */}
        <line x1="150" y1="262" x2="150" y2="285" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />

        {/* Seedling */}
        <g transform="translate(150, 310)">
          <line x1="0" y1="0" x2="0" y2="-25" stroke="#22c55e" strokeWidth="2" />
          <ellipse cx="-10" cy="-22" rx="8" ry="5" fill="#22c55e" transform="rotate(-30,-10,-22)" />
          <ellipse cx="10" cy="-28" rx="8" ry="5" fill="#22c55e" transform="rotate(30,10,-28)" />
          {/* Roots */}
          <line x1="0" y1="0" x2="-8" y2="12" stroke="#a16207" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="8" y2="14" stroke="#a16207" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2="15" stroke="#a16207" strokeWidth="1.5" />
        </g>
        <text x="150" y="340" textAnchor="middle" fontSize="10" fill="#d1d5db">New plant (genetically unique)</text>

        {/* Key point */}
        <rect x="40" y="365" width="220" height="50" rx="6" fill="#1e3a5f" />
        <text x="150" y="383" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">Two parents mix DNA</text>
        <text x="150" y="398" textAnchor="middle" fontSize="10" fill="#93c5fd">Every offspring is different</text>
        <text x="150" y="410" textAnchor="middle" fontSize="10" fill="#93c5fd">= genetic diversity</text>

        {/* RIGHT: Vegetative propagation */}
        <text x="450" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#34d399">Asexual — Cloning</text>

        {/* Parent plant */}
        <g transform="translate(450, 110)">
          <line x1="0" y1="0" x2="0" y2="-35" stroke="#22c55e" strokeWidth="3" />
          {[-20, -10, 5, 15].map((y, i) => (
            <ellipse key={i} cx={i % 2 === 0 ? -14 : 14} cy={y} rx="10" ry="6" fill="#22c55e" opacity="0.85" transform={`rotate(${i % 2 === 0 ? -20 : 20}, ${i % 2 === 0 ? -14 : 14}, ${y})`} />
          ))}
        </g>
        <text x="450" y="125" textAnchor="middle" fontSize="10" fill="#d1d5db">Parent plant</text>

        {/* Four methods */}
        {[
          { y: 160, label: 'Cutting', desc: 'Stem piece grows roots', color: '#34d399' },
          { y: 210, label: 'Runner', desc: 'Horizontal stem, new plants', color: '#22d3ee' },
          { y: 260, label: 'Tuber', desc: 'Underground storage, sprouts', color: '#fbbf24' },
          { y: 310, label: 'Tissue culture', desc: 'Lab: cells to whole plant', color: '#c084fc' },
        ].map((m, i) => (
          <g key={i}>
            <rect x="340" y={m.y - 15} width="220" height="35" rx="6" fill={m.color} opacity="0.12" />
            <circle cx="360" cy={m.y} r="8" fill={m.color} opacity="0.4" />
            <text x="360" y={m.y + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill={m.color}>{i + 1}</text>
            <text x="380" y={m.y - 3} fontSize="11" fontWeight="bold" fill={m.color}>{m.label}</text>
            <text x="380" y={m.y + 11} fontSize="9" fill="#d1d5db">{m.desc}</text>
          </g>
        ))}

        {/* Key point */}
        <rect x="340" y="365" width="220" height="50" rx="6" fill="#1a3a2a" />
        <text x="450" y="383" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">One parent, no mixing</text>
        <text x="450" y="398" textAnchor="middle" fontSize="10" fill="#6ee7b7">Every offspring is identical</text>
        <text x="450" y="410" textAnchor="middle" fontSize="10" fill="#6ee7b7">= clones (fast but risky)</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#60a5fa" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
