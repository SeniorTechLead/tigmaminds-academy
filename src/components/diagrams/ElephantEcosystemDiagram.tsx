const ElephantEcosystemDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing elephants as ecosystem engineers: creating water holes, paths, and habitats for other species"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes ripple { 0%{r:8;opacity:0.6} 100%{r:20;opacity:0} }
          .ripple { animation: ripple 3s ease-out infinite; }
        `}</style>

        <rect width="600" height="440" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="300" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Elephants as Ecosystem Engineers
        </text>
        <text x="300" y="45" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          One elephant changes the landscape for hundreds of species
        </text>

        {/* Central elephant icon */}
        <ellipse cx="300" cy="170" rx="55" ry="38"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        <ellipse cx="255" cy="155" rx="22" ry="28"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        <circle cx="245" cy="148" r="3" className="fill-slate-600 dark:fill-slate-300" />
        <path d="M240 168 Q225 195 235 215" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2.5" fill="none" />
        <text x="300" y="175" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-200" fontWeight="600">
          Elephant
        </text>

        {/* Radiating connections to 5 engineering actions */}
        {/* 1. Mud wallows — left */}
        <line x1="245" y1="180" x2="85" y2="260" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <ellipse cx="85" cy="280" rx="65" ry="35" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
        <circle cx="85" cy="275" r="8" className="ripple" fill="#3b82f6" opacity="0" />
        <text x="85" y="272" textAnchor="middle" className="heading fill-blue-700 dark:fill-blue-400">
          Mud Wallows
        </text>
        <text x="85" y="286" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Become ponds in rain
        </text>
        <text x="85" y="298" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Frogs, dragonflies,
        </text>
        <text x="85" y="310" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          beetles breed here
        </text>
        <text x="85" y="325" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Last decades
        </text>

        {/* 2. Water holes — top left */}
        <line x1="270" y1="140" x2="120" y2="80" className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="40" y="58" width="160" height="55" rx="8"
          className="fill-cyan-50 dark:fill-cyan-900/20 stroke-cyan-400 dark:stroke-cyan-600" strokeWidth="1.5" />
        <text x="120" y="76" textAnchor="middle" className="heading fill-cyan-700 dark:fill-cyan-400">
          Dig Water Holes
        </text>
        <text x="120" y="90" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-300">
          Use tusks to dig dry riverbeds
        </text>
        <text x="120" y="103" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-300">
          Rhinos, deer, birds all drink
        </text>

        {/* 3. Paths — top right */}
        <line x1="340" y1="140" x2="480" y2="80" className="stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="400" y="58" width="170" height="55" rx="8"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1.5" />
        <text x="485" y="76" textAnchor="middle" className="heading fill-emerald-700 dark:fill-emerald-400">
          Create Trails
        </text>
        <text x="485" y="90" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Flatten paths through thick forest
        </text>
        <text x="485" y="103" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-300">
          Other animals use as highways
        </text>

        {/* 4. Tree clearing — right */}
        <line x1="355" y1="175" x2="500" y2="260" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="430" y="240" width="155" height="70" rx="8"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="507" y="258" textAnchor="middle" className="heading fill-amber-700 dark:fill-amber-400">
          Push Over Trees
        </text>
        <text x="507" y="272" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          Opens forest canopy
        </text>
        <text x="507" y="286" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          Sunlight reaches ground
        </text>
        <text x="507" y="300" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-300">
          Grasslands grow \u2192 grazer habitat
        </text>

        {/* 5. Seed dispersal — bottom center */}
        <line x1="300" y1="208" x2="300" y2="350" className="stroke-green-400 dark:stroke-green-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="210" y="350" width="180" height="70" rx="8"
          className="fill-green-50 dark:fill-green-900/20 stroke-green-400 dark:stroke-green-600" strokeWidth="1.5" />
        <text x="300" y="368" textAnchor="middle" className="heading fill-green-700 dark:fill-green-400">
          Spread Seeds
        </text>
        <text x="300" y="382" textAnchor="middle" className="small fill-green-600 dark:fill-green-300">
          Eat fruit, walk kilometers
        </text>
        <text x="300" y="396" textAnchor="middle" className="small fill-green-600 dark:fill-green-300">
          Deposit seeds in dung (fertilizer!)
        </text>
        <text x="300" y="410" textAnchor="middle" className="small fill-green-600 dark:fill-green-300">
          Some trees ONLY germinate after
        </text>
        <text x="300" y="422" textAnchor="middle" className="small fill-green-600 dark:fill-green-300">
          passing through elephant gut
        </text>

        {/* Kaziranga badge */}
        <rect x="200" y="210" width="200" height="28" rx="14"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="300" y="229" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          Kaziranga: 1,200+ elephants shape the entire park
        </text>
      </svg>
    </div>
  );
};

export default ElephantEcosystemDiagram;
