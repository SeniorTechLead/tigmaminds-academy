const FrogCubeSquareDiagram = () => {
  const cubes = [
    { label: '1 cm', side: 1, sa: 6, vol: 1, ratio: 6, x: 85, size: 16, color: '#22c55e' },
    { label: '2 cm', side: 2, sa: 24, vol: 8, ratio: 3, x: 220, size: 32, color: '#3b82f6' },
    { label: '4 cm', side: 4, sa: 96, vol: 64, ratio: 1.5, x: 370, size: 52, color: '#8b5cf6' },
    { label: '10 cm', side: 10, sa: 600, vol: 1000, ratio: 0.6, x: 530, size: 70, color: '#ef4444' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="The cube-square law illustrated with cubes of increasing size showing how surface area to volume ratio drops as size increases"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          .formula { font-family: 'Courier New', monospace; font-size: 11px; }
        `}</style>

        <rect width="640" height="560" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          The Cube-Square Law \u2014 Why Ants Can Carry 50\u00d7 Their Weight
        </text>

        {/* Core formula box */}
        <rect x="40" y="42" width="560" height="62" rx="6"
          className="fill-amber-50 dark:fill-amber-900/15 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="320" y="60" textAnchor="middle" className="formula fill-amber-700 dark:fill-amber-300">
          Surface area grows as L\u00b2 \u00a0\u00a0\u00a0|\u00a0\u00a0\u00a0 Volume grows as L\u00b3
        </text>
        <text x="320" y="76" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Double the size \u2192 area grows 4\u00d7, but volume (and weight) grows 8\u00d7
        </text>
        <text x="320" y="90" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          SA:V ratio = 6/L for a cube \u2014 smaller objects have higher ratios
        </text>

        {/* Cubes comparison */}
        <text x="320" y="124" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Cubes at Different Scales
        </text>

        {cubes.map((c, i) => {
          const baseY = 220;
          const cubeY = baseY - c.size;
          return (
            <g key={i}>
              {/* 3D cube illusion */}
              <rect x={c.x - c.size / 2} y={cubeY} width={c.size} height={c.size} rx="2"
                fill={c.color} opacity="0.3" stroke={c.color} strokeWidth="1.5" />
              {/* Top face */}
              <polygon
                points={`${c.x - c.size / 2},${cubeY} ${c.x - c.size / 2 + c.size * 0.3},${cubeY - c.size * 0.25} ${c.x + c.size / 2 + c.size * 0.3},${cubeY - c.size * 0.25} ${c.x + c.size / 2},${cubeY}`}
                fill={c.color} opacity="0.15" stroke={c.color} strokeWidth="0.8" />
              {/* Right face */}
              <polygon
                points={`${c.x + c.size / 2},${cubeY} ${c.x + c.size / 2 + c.size * 0.3},${cubeY - c.size * 0.25} ${c.x + c.size / 2 + c.size * 0.3},${baseY - c.size * 0.25} ${c.x + c.size / 2},${baseY}`}
                fill={c.color} opacity="0.2" stroke={c.color} strokeWidth="0.8" />

              {/* Size label */}
              <text x={c.x} y={cubeY - c.size * 0.25 - 10} textAnchor="middle"
                className="label" fill={c.color} fontWeight="600">{c.label}</text>

              {/* Stats below */}
              <text x={c.x} y={baseY + 18} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
                SA: {c.sa} cm\u00b2
              </text>
              <text x={c.x} y={baseY + 32} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
                Vol: {c.vol} cm\u00b3
              </text>
              <text x={c.x} y={baseY + 48} textAnchor="middle"
                className="label" fill={c.color} fontWeight="700">
                SA:V = {c.ratio}
              </text>
            </g>
          );
        })}

        {/* Arrow showing ratio decrease */}
        <line x1="90" y1="280" x2="540" y2="280"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
        </defs>
        <text x="320" y="298" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          SA:V ratio drops as size increases \u2192
        </text>

        {/* Consequences section */}
        <text x="320" y="328" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          What This Means for Animals
        </text>

        {/* Ant column */}
        <rect x="30" y="340" width="185" height="95" rx="6"
          className="fill-green-50 dark:fill-green-900/15 stroke-green-300 dark:stroke-green-700" strokeWidth="1" />
        <text x="122" y="358" textAnchor="middle" className="label fill-green-600 dark:fill-green-300" fontWeight="600">
          Ant (2 mm) \u2014 High SA:V
        </text>
        <text x="122" y="374" textAnchor="middle" className="tiny fill-green-600 dark:fill-green-300">
          Strength/weight = huge \u2192 carries 50\u00d7 body mass
        </text>
        <text x="122" y="388" textAnchor="middle" className="tiny fill-green-600 dark:fill-green-300">
          Falls from any height safely (air drag wins)
        </text>
        <text x="122" y="402" textAnchor="middle" className="tiny fill-green-600 dark:fill-green-300">
          Loses water fast \u2192 must stay underground/moist
        </text>
        <text x="122" y="418" textAnchor="middle" className="tiny fill-green-600 dark:fill-green-300">
          Surface tension is a real danger (water traps it)
        </text>

        {/* Frog column */}
        <rect x="228" y="340" width="185" height="95" rx="6"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="320" y="358" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-300" fontWeight="600">
          Tiny frog (8 mm) \u2014 Medium SA:V
        </text>
        <text x="320" y="374" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          Jumps 25\u00d7 body length (relatively strong)
        </text>
        <text x="320" y="388" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          Falls safely from trees (terminal velocity low)
        </text>
        <text x="320" y="402" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          Breathes through skin (enough surface for O\u2082)
        </text>
        <text x="320" y="418" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          Dries out in minutes without moisture
        </text>

        {/* Elephant column */}
        <rect x="426" y="340" width="185" height="95" rx="6"
          className="fill-purple-50 dark:fill-purple-900/15 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="518" y="358" textAnchor="middle" className="label fill-purple-600 dark:fill-purple-300" fontWeight="600">
          Elephant (4 m) \u2014 Low SA:V
        </text>
        <text x="518" y="374" textAnchor="middle" className="tiny fill-purple-600 dark:fill-purple-300">
          Can barely lift its own weight (thick legs needed)
        </text>
        <text x="518" y="388" textAnchor="middle" className="tiny fill-purple-600 dark:fill-purple-300">
          A fall from 2 m could be fatal
        </text>
        <text x="518" y="402" textAnchor="middle" className="tiny fill-purple-600 dark:fill-purple-300">
          Overheats easily (uses ears, mud, water)
        </text>
        <text x="518" y="418" textAnchor="middle" className="tiny fill-purple-600 dark:fill-purple-300">
          Needs huge lungs (skin can\u2019t supply enough O\u2082)
        </text>

        {/* Key formula summary */}
        <rect x="80" y="450" width="480" height="56" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="468" textAnchor="middle" className="formula fill-slate-700 dark:fill-slate-200">
          Strength/Weight = k\u00b2/k\u00b3 = 1/k
        </text>
        <text x="320" y="484" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          Scale up by k \u2192 strength grows as area (k\u00b2), weight grows as volume (k\u00b3).
        </text>
        <text x="320" y="498" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          Smaller animals are relatively stronger. Larger animals are relatively weaker. Always.
        </text>

        {/* Story connection */}
        <text x="320" y="530" textAnchor="middle" className="tiny fill-emerald-500 dark:fill-emerald-400">
          Mechi the tiny frog can leap 25\u00d7 her body length and survive any fall \u2014 the cube-square law is her superpower.
        </text>

        {/* Galileo note */}
        <text x="320" y="548" textAnchor="middle" className="tiny fill-slate-400 dark:fill-slate-500">
          Galileo described this law in 1638 when explaining why giant animals need thicker bones.
        </text>
      </svg>
    </div>
  );
};

export default FrogCubeSquareDiagram;
