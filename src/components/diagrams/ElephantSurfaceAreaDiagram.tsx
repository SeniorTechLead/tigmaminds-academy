const ElephantSurfaceAreaDiagram = () => {
  const animals = [
    { name: 'Mouse', mass: '20 g', ratio: 100, w: 14, h: 10, x: 80, color: '#ef4444', barH: 160 },
    { name: 'Cat', mass: '4 kg', ratio: 15, w: 28, h: 20, x: 200, color: '#f59e0b', barH: 120 },
    { name: 'Human', mass: '70 kg', ratio: 1.8, w: 22, h: 48, x: 320, color: '#3b82f6', barH: 70 },
    { name: 'Elephant', mass: '4,000 kg', ratio: 0.5, w: 70, h: 50, x: 460, color: '#8b5cf6', barH: 30 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Surface area to volume ratio comparison across animals of different sizes, showing why elephants overheat"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="600" height="460" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="300" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          The Cube-Square Law: Why Big Animals Overheat
        </text>

        {/* Explanation at top */}
        <rect x="40" y="42" width="520" height="50" rx="6"
          className="fill-amber-50 dark:fill-amber-900/15 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="300" y="60" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Double an animal's size → surface area grows 4× but volume grows 8×
        </text>
        <text x="300" y="74" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          Heat is made in the volume. Heat escapes through the surface. Bigger = harder to cool.
        </text>
        <text x="300" y="86" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-300">
          SA/V = 3/r for a sphere — as radius grows, ratio shrinks
        </text>

        {/* Bar chart area */}
        <text x="300" y="115" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Surface Area ÷ Volume Ratio (higher = cools easier)
        </text>

        {/* Y axis */}
        <line x1="45" y1="130" x2="45" y2="310" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        {[0, 25, 50, 75, 100].map((v) => {
          const y = 310 - (v / 100) * 170;
          return (
            <g key={v}>
              <line x1="42" y1={y} x2="550" y2={y} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="0.5" />
              <text x="38" y={y + 4} textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">{v}</text>
            </g>
          );
        })}

        {/* Bars + animal silhouettes */}
        {animals.map((a, i) => {
          const barY = 310 - a.barH;
          return (
            <g key={i}>
              {/* Bar */}
              <rect x={a.x - 25} y={barY} width="50" height={a.barH} rx="4"
                fill={a.color} opacity="0.6" />
              <text x={a.x} y={barY - 6} textAnchor="middle"
                className="label" fill={a.color} fontWeight="600">
                {a.ratio}
              </text>

              {/* Animal rectangle (proportional) */}
              <rect x={a.x - a.w / 2} y={320} width={a.w} height={a.h} rx="3"
                fill={a.color} opacity="0.3" stroke={a.color} strokeWidth="1.5" />

              {/* Labels */}
              <text x={a.x} y={320 + a.h + 14} textAnchor="middle"
                className="label" fill={a.color} fontWeight="600">{a.name}</text>
              <text x={a.x} y={320 + a.h + 27} textAnchor="middle"
                className="small fill-slate-500 dark:fill-slate-400">{a.mass}</text>
            </g>
          );
        })}

        {/* Consequence boxes at bottom */}
        <rect x="30" y="405" width="160" height="42" rx="6"
          className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="110" y="421" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Mouse: eats 25% body weight/day
        </text>
        <text x="110" y="435" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Loses heat so fast it must eat constantly
        </text>

        <rect x="220" y="405" width="160" height="42" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="300" y="421" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Human: sweats to boost cooling
        </text>
        <text x="300" y="435" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Balanced — moderate SA/V ratio
        </text>

        <rect x="410" y="405" width="160" height="42" rx="6"
          className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="490" y="421" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-300">
          Elephant: needs mud, ears, shade
        </text>
        <text x="490" y="435" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-300">
          Cannot cool fast enough without help
        </text>
      </svg>
    </div>
  );
};

export default ElephantSurfaceAreaDiagram;
