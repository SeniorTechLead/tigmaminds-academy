export default function ActivityBambooFluteDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Instructions for making a simple bamboo or straw flute to explore resonance"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .step { font-family: system-ui, sans-serif; font-size: 10px; }
          .small { font-family: system-ui, sans-serif; font-size: 9px; }
          .num { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <rect width="600" height="380" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Activity: Build a Straw Flute
        </text>
        <text x="300" y="44" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          Explore how tube length changes pitch — same physics as bamboo in the wind
        </text>

        {/* Step 1: Cut straws */}
        <g>
          <circle cx="40" cy="80" r="14" className="fill-emerald-100 dark:fill-emerald-900" />
          <text x="40" y="84" textAnchor="middle" className="num fill-emerald-600 dark:fill-emerald-400">1</text>
          <text x="62" y="76" className="step fill-gray-700 dark:fill-slate-300">Cut 5 straws to different lengths:</text>
          <text x="62" y="90" className="small fill-gray-500 dark:fill-slate-400">20 cm, 16 cm, 13 cm, 10 cm, 8 cm</text>

          {/* Visual: 5 straws */}
          {[20, 16, 13, 10, 8].map((len, i) => {
            const sw = len * 7;
            const sx = 380;
            const sy = 68 + i * 10;
            return (
              <g key={i}>
                <rect x={sx} y={sy} width={sw} height="6" rx="3" className="fill-amber-400 dark:fill-amber-500" opacity={0.7 + i * 0.05} />
                <text x={sx + sw + 5} y={sy + 6} className="small fill-gray-400 dark:fill-slate-500">{len}cm</text>
              </g>
            );
          })}
        </g>

        {/* Step 2: Seal one end */}
        <g>
          <circle cx="40" cy="140" r="14" className="fill-sky-100 dark:fill-sky-900" />
          <text x="40" y="144" textAnchor="middle" className="num fill-sky-600 dark:fill-sky-400">2</text>
          <text x="62" y="136" className="step fill-gray-700 dark:fill-slate-300">Seal one end of each straw</text>
          <text x="62" y="150" className="small fill-gray-500 dark:fill-slate-400">Pinch flat and tape, or fold and press</text>

          {/* Visual: sealed straw */}
          <rect x="400" y="130" width="120" height="10" rx="3" className="fill-amber-400 dark:fill-amber-500" />
          <rect x="395" y="128" width="10" height="14" rx="2" className="fill-gray-400 dark:fill-gray-600" />
          <text x="394" y="153" className="small fill-gray-400 dark:fill-slate-500">sealed</text>
          <text x="520" y="153" className="small fill-gray-400 dark:fill-slate-500">open</text>
        </g>

        {/* Step 3: Blow across the top */}
        <g>
          <circle cx="40" cy="195" r="14" className="fill-purple-100 dark:fill-purple-900" />
          <text x="40" y="199" textAnchor="middle" className="num fill-purple-600 dark:fill-purple-400">3</text>
          <text x="62" y="191" className="step fill-gray-700 dark:fill-slate-300">Blow across the open end</text>
          <text x="62" y="205" className="small fill-gray-500 dark:fill-slate-400">Like blowing across a bottle top — angle your breath</text>

          {/* Visual: breath arrow */}
          <line x1="420" y1="180" x2="460" y2="195" className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="2" markerEnd="url(#breathArr)" />
          <rect x="460" y="175" width="8" height="35" rx="3" className="fill-amber-400 dark:fill-amber-500" />
          {/* Sound waves */}
          {[1, 2, 3].map(i => (
            <path key={i} d={`M ${472 + i * 8},185 Q ${476 + i * 8},192 ${472 + i * 8},200`}
              fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" opacity={0.8 - i * 0.2} />
          ))}
        </g>

        {/* Step 4: Listen and compare */}
        <g>
          <circle cx="40" cy="255" r="14" className="fill-rose-100 dark:fill-rose-900" />
          <text x="40" y="259" textAnchor="middle" className="num fill-rose-600 dark:fill-rose-400">4</text>
          <text x="62" y="251" className="step fill-gray-700 dark:fill-slate-300">Listen: shorter straw = higher pitch</text>
          <text x="62" y="265" className="small fill-gray-500 dark:fill-slate-400">This is f = v / (4L) in action — halve the length, double the frequency</text>
        </g>

        {/* Result box */}
        <rect x="60" y="290" width="480" height="70" rx="8" className="fill-emerald-50 dark:fill-emerald-950" stroke="#22c55e" strokeWidth="1" />
        <text x="300" y="310" textAnchor="middle" className="label fill-emerald-700 dark:fill-emerald-400" fontWeight="600">
          What you’ll discover:
        </text>
        <text x="300" y="328" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-500">
          The 20 cm straw sounds deep. The 8 cm straw sounds high. Line them up and blow across
        </text>
        <text x="300" y="342" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-500">
          each one — you’ve built a pan flute! Same physics as bamboo groves singing in the wind.
        </text>
        <text x="300" y="356" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          The air column inside each straw vibrates at its natural frequency — that’s resonance.
        </text>

        <defs>
          <marker id="breathArr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" className="fill-sky-400 dark:fill-sky-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
