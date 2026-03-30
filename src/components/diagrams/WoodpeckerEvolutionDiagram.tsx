export default function WoodpeckerEvolutionDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 441"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Convergent evolution: different woodpecker species with similar impact adaptations"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .species { font-family: system-ui, sans-serif; font-size: 10px; font-style: italic; }
        `}</style>

        <rect width="600" height="420" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Convergent Adaptations Across Woodpecker Species
        </text>

        {/* Species cards */}
        {[
          { name: 'Downy', sci: 'D. pubescens', size: 'Small (15cm)', beak: 'Short, chisel', crest: '#dc2626', body: '#16a34a', beakW: 20, x: 30 },
          { name: 'Pileated', sci: 'D. pileatus', size: 'Large (45cm)', beak: 'Long, powerful', crest: '#dc2626', body: '#1e293b', beakW: 35, x: 150 },
          { name: 'Great Spotted', sci: 'D. major', size: 'Medium (24cm)', beak: 'Medium, strong', crest: '#dc2626', body: '#16a34a', beakW: 25, x: 270 },
          { name: 'Acorn', sci: 'M. formicivorus', size: 'Medium (21cm)', beak: 'Short, thick', crest: '#dc2626', body: '#1e293b', beakW: 18, x: 390 },
        ].map((sp, i) => (
          <g key={i} transform={`translate(${sp.x}, 50)`}>
            <rect x="0" y="0" width="130" height="170" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />

            {/* Bird silhouette */}
            <g transform="translate(35, 15)">
              <ellipse cx="30" cy="30" rx="20" ry="25" fill={sp.body} opacity="0.7" />
              <ellipse cx="30" cy="10" rx="12" ry="10" fill={sp.crest} opacity="0.8" />
              <polygon points={`42,28 ${42 + sp.beakW},26 ${42 + sp.beakW},32 42,32`} fill="#d97706" />
              <circle cx="38" cy="24" r="3" fill="#fef9c3" />
              {/* Tail */}
              <polygon points="15,50 8,70 22,70" fill={sp.body} opacity="0.5" />
            </g>

            <text x="65" y="100" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">{sp.name}</text>
            <text x="65" y="114" textAnchor="middle" className="species fill-gray-500 dark:fill-slate-400">{sp.sci}</text>
            <text x="65" y="130" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{sp.size}</text>
            <text x="65" y="144" textAnchor="middle" className="sm" fill="#d97706">Beak: {sp.beak}</text>
            <text x="65" y="158" textAnchor="middle" className="sm" fill="#86efac">20 Hz drumming</text>
          </g>
        ))}

        {/* Shared adaptations */}
        <text x="300" y="248" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">
          Shared Adaptations (regardless of species)
        </text>

        <g transform="translate(40, 260)">
          {[
            { trait: 'Spongy bone sandwich', icon: '1', color: '#d97706' },
            { trait: 'Hyoid bone seatbelt', icon: '2', color: '#dc2626' },
            { trait: 'Tight brain fit', icon: '3', color: '#22c55e' },
            { trait: 'Straight-line strike', icon: '4', color: '#38bdf8' },
            { trait: 'Thick neck muscles', icon: '5', color: '#a78bfa' },
            { trait: 'Chisel-tip beak', icon: '6', color: '#f472b6' },
          ].map((a, i) => (
            <g key={i} transform={`translate(${(i % 3) * 175}, ${Math.floor(i / 3) * 50})`}>
              <circle cx="15" cy="15" r="12" fill={a.color} opacity="0.2" stroke={a.color} strokeWidth="1" />
              <text x="15" y="19" textAnchor="middle" className="sm" fill={a.color} fontWeight="700">{a.icon}</text>
              <text x="35" y="19" className="label fill-gray-900 dark:fill-slate-50">{a.trait}</text>
            </g>
          ))}
        </g>

        {/* Convergent evolution note */}
        <g transform="translate(50, 370)">
          <rect x="0" y="0" width="500" height="40" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="250" y="16" textAnchor="middle" className="sm" fill="#fbbf24" fontWeight="600">Convergent Evolution</text>
          <text x="250" y="32" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Same problem (impact survival) produces same solutions across 200+ species over 25 million years
          </text>
        </g>
      </svg>
    </div>
  );
}
