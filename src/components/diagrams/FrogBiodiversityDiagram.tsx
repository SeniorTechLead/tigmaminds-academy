const FrogBiodiversityDiagram = () => {
  const hotspots = [
    { name: 'Amazon\nBasin', species: '~1,500', x: 95, y: 150, r: 38, color: '#22c55e' },
    { name: 'W. Ghats\n(India)', species: '~200', x: 235, y: 165, r: 18, color: '#3b82f6' },
    { name: 'NE India', species: '~150+', x: 310, y: 140, r: 16, color: '#ef4444' },
    { name: 'Borneo', species: '~180', x: 410, y: 170, r: 17, color: '#f59e0b' },
    { name: 'Madagascar', species: '~350', x: 265, y: 210, r: 24, color: '#8b5cf6' },
    { name: 'PNG &\nAustralia', species: '~500', x: 510, y: 190, r: 28, color: '#10b981' },
  ];

  const layers = [
    { name: 'Canopy (30–40 m)', y: 280, h: 40, color: '#166534', species: 'Tree frogs, flying frogs' },
    { name: 'Understory (5–30 m)', y: 320, h: 45, color: '#15803d', species: 'Epiphyte frogs, moss frogs' },
    { name: 'Shrub layer (1–5 m)', y: 365, h: 35, color: '#22c55e', species: 'Reed frogs, bromeliad frogs' },
    { name: 'Leaf litter (0–1 m)', y: 400, h: 35, color: '#86efac', species: 'Miniature frogs, poison frogs' },
    { name: 'Soil & roots', y: 435, h: 25, color: '#a16207', species: 'Burrowing frogs, caecilians' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Why rainforests have the most species, showing biodiversity hotspots and vertical niche partitioning in forest layers"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tiny { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="640" height="560" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Why Rainforests Have the Most Species
        </text>

        {/* Key insight */}
        <rect x="40" y="42" width="560" height="48" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="320" y="60" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300">
          Rainforests cover 6% of Earth’s land but hold over 50% of all species.
        </text>
        <text x="320" y="74" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300">
          Three reasons: energy (sunlight + water), time (millions of years), and microhabitats (vertical layers).
        </text>

        {/* Hotspot circles */}
        <text x="320" y="108" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Global Amphibian Biodiversity Hotspots (circle size = species count)
        </text>

        {/* World map outline (simplified rectangle) */}
        <rect x="30" y="120" width="580" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Tropics band */}
        <rect x="30" y="148" width="580" height="55" fill="#22c55e" opacity="0.06" />
        <text x="615" y="178" textAnchor="end" className="tiny fill-green-500 dark:fill-green-400">
          Tropics
        </text>

        {hotspots.map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={h.y} r={h.r}
              fill={h.color} opacity="0.25" stroke={h.color} strokeWidth="1.5" />
            {h.name.split('\n').map((line, li) => (
              <text key={li} x={h.x} y={h.y - 4 + li * 11} textAnchor="middle"
                className="tiny" fill={h.color} fontWeight="600">{line}</text>
            ))}
            <text x={h.x} y={h.y + h.r + 12} textAnchor="middle"
              className="tiny fill-slate-500 dark:fill-slate-400">{h.species}</text>
          </g>
        ))}

        {/* NE India callout */}
        <line x1="310" y1="155" x2="350" y2="128"
          stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" />
        <text x="400" y="132" className="tiny fill-red-500 dark:fill-red-400">
          NE India: new species found yearly
        </text>

        {/* Vertical niche partitioning */}
        <text x="320" y="272" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Niche Partitioning: Frogs at Every Level of the Forest
        </text>

        {layers.map((l, i) => (
          <g key={i}>
            <rect x="60" y={l.y} width="280" height={l.h} rx="0"
              fill={l.color} opacity="0.25" stroke={l.color} strokeWidth="1" />
            <text x="70" y={l.y + l.h / 2 + 4} className="small" fill={l.color} fontWeight="600">
              {l.name}
            </text>
            <text x="355" y={l.y + l.h / 2 + 4} className="small fill-slate-600 dark:fill-slate-300">
              {l.species}
            </text>
          </g>
        ))}

        {/* Arrow showing height */}
        <line x1="50" y1="285" x2="50" y2="458" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <text x="46" y="375" textAnchor="middle" className="tiny fill-slate-400 dark:fill-slate-500"
          transform="rotate(-90 46 375)">Height</text>

        {/* Key concept: Microhabitat */}
        <rect x="360" y="280" width="250" height="90" rx="6"
          className="fill-amber-50 dark:fill-amber-900/15 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="485" y="298" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Microhabitat = Tiny Home
        </text>
        <text x="485" y="314" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">
          A bromeliad leaf pool: 200 ml of water
        </text>
        <text x="485" y="328" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">
          that holds 1 frog, 3 insect species,
        </text>
        <text x="485" y="342" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">
          and algae. That’s a complete ecosystem
        </text>
        <text x="485" y="356" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">
          in a teacup of water.
        </text>

        {/* Niche partitioning concept */}
        <rect x="360" y="380" width="250" height="80" rx="6"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="485" y="398" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Niche Partitioning
        </text>
        <text x="485" y="414" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          Different species avoid competition by
        </text>
        <text x="485" y="428" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          specializing: different layers, different
        </text>
        <text x="485" y="442" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          call times, different prey sizes.
        </text>

        {/* Bottom summary */}
        <rect x="40" y="475" width="560" height="72" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="493" textAnchor="middle" className="small fill-slate-700 dark:fill-slate-200" fontWeight="600">
          Why so many species here?
        </text>
        <text x="320" y="510" textAnchor="middle" className="tiny fill-slate-600 dark:fill-slate-300">
          • Energy: warm + wet = fast growth = more food = more animals supported
        </text>
        <text x="320" y="524" textAnchor="middle" className="tiny fill-slate-600 dark:fill-slate-300">
          • Time: tropical forests are ancient (100 M+ years) = more time for evolution to diversify
        </text>
        <text x="320" y="538" textAnchor="middle" className="tiny fill-slate-600 dark:fill-slate-300">
          • Structure: 5+ vertical layers = 5+ separate habitats stacked in one place
        </text>
      </svg>
    </div>
  );
};

export default FrogBiodiversityDiagram;
