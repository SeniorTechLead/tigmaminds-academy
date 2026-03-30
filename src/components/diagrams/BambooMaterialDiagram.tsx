export default function BambooMaterialDiagram() {
  const materials = [
    { name: 'Bamboo', str: 350, density: 0.6, ratio: 583, color: '#22c55e', icon: '\uD83C\uDF3F' },
    { name: 'Steel', str: 400, density: 7.8, ratio: 51, color: '#94a3b8', icon: '⚙️' },
    { name: 'Concrete', str: 40, density: 2.4, ratio: 17, color: '#78716c', icon: '\uD83E\uDDF1' },
    { name: 'Wood (Oak)', str: 100, density: 0.7, ratio: 143, color: '#a16207', icon: '\uD83C\uDF33' },
    { name: 'Aluminium', str: 270, density: 2.7, ratio: 100, color: '#60a5fa', icon: '✨' },
  ];

  const maxRatio = 600;
  const barW = 280;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Strength-to-weight ratio comparison showing bamboo outperforming steel, concrete, and wood"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .val { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
          .small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="600" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Bamboo: The Wonder Material
        </text>
        <text x="300" y="46" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
          Strength-to-Weight Ratio (Tensile Strength / Density)
        </text>

        {materials.map((m, i) => {
          const y = 75 + i * 52;
          const bw = (m.ratio / maxRatio) * barW;

          return (
            <g key={i}>
              {/* Material label */}
              <text x="15" y={y + 16} className="label fill-gray-700 dark:fill-slate-300">{m.icon} {m.name}</text>

              {/* Stats */}
              <text x="130" y={y + 6} className="small fill-gray-400 dark:fill-slate-500">
                {m.str} MPa / {m.density} g/cm³
              </text>

              {/* Bar */}
              <rect x="130" y={y + 10} width={bw} height="22" rx="4" fill={m.color} opacity="0.85" />

              {/* Value */}
              <text x={135 + bw} y={y + 25} className="val" fill={m.color}>
                {m.ratio}
              </text>
            </g>
          );
        })}

        {/* Bamboo highlight */}
        <rect x="125" y="68" width={barW + 55} height="46" rx="6" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 3" />
        <text x="508" y="94" className="small fill-emerald-600 dark:fill-emerald-400">← 11× stronger</text>
        <text x="508" y="106" className="small fill-emerald-600 dark:fill-emerald-400">than steel per kg!</text>

        {/* Cross-section diagram */}
        <text x="300" y="350" textAnchor="middle" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">
          Why Bamboo Is So Strong: The Hollow Tube
        </text>

        {/* Solid cylinder */}
        <circle cx="170" cy="390" r="25" className="fill-amber-800 dark:fill-amber-900" opacity="0.6" />
        <text x="170" y="394" textAnchor="middle" className="small fill-white">Solid</text>
        <text x="170" y="424" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">Heavy, less stiff</text>

        {/* Arrow */}
        <text x="240" y="394" textAnchor="middle" className="label fill-gray-400 dark:fill-slate-500">vs</text>

        {/* Hollow cylinder (bamboo) */}
        <circle cx="310" cy="390" r="25" className="fill-emerald-500 dark:fill-emerald-600" opacity="0.7" />
        <circle cx="310" cy="390" r="16" className="fill-white dark:fill-slate-950" />
        <text x="310" y="394" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Hollow</text>
        <text x="310" y="424" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Light, very stiff</text>

        {/* Info */}
        <rect x="370" y="370" width="200" height="40" rx="6" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.8" />
        <text x="470" y="386" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-400">
          Hollow tubes resist bending better
        </text>
        <text x="470" y="399" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-400">
          than solid rods of the same weight.
        </text>
        <text x="470" y="412" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-500">
          Same principle: bicycle frames, bones
        </text>
      </svg>
    </div>
  );
}
