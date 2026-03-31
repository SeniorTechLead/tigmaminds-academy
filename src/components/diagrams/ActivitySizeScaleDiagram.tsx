const ActivitySizeScaleDiagram = () => {
  const steps = [
    {
      num: 1,
      title: 'Cut Three Cubes',
      desc: 'From clay or potato, cut cubes:\n1 cm, 2 cm, and 4 cm per side.',
      color: '#22c55e',
      bgClass: 'fill-green-50 dark:fill-green-900/10 stroke-green-300 dark:stroke-green-600',
      numBg: 'fill-green-100 dark:fill-green-900/30',
    },
    {
      num: 2,
      title: 'Calculate & Record',
      desc: 'For each cube, calculate:\nSA = 6 × side²\nVol = side³\nRatio = SA ÷ Vol',
      color: '#3b82f6',
      bgClass: 'fill-blue-50 dark:fill-blue-900/10 stroke-blue-300 dark:stroke-blue-600',
      numBg: 'fill-blue-100 dark:fill-blue-900/30',
    },
    {
      num: 3,
      title: 'The Drying Test',
      desc: 'Wet all three cubes equally.\nLeave them on a plate.\nWhich dries first? Why?',
      color: '#f59e0b',
      bgClass: 'fill-amber-50 dark:fill-amber-900/10 stroke-amber-300 dark:stroke-amber-600',
      numBg: 'fill-amber-100 dark:fill-amber-900/30',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: cut three cubes of different sizes to explore the cube-square law and why tiny frogs dry out faster"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          .step-num { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
        `}</style>

        <rect width="640" height="500" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Try It: The Size Scale Experiment
        </text>
        <text x="320" y="46" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Explore the cube-square law with clay or potato — no lab required
        </text>

        {/* Materials */}
        <rect x="40" y="58" width="560" height="30" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="78" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          You need: modelling clay or a potato, a knife (ask an adult), a ruler, and a plate
        </text>

        {/* Three steps */}
        {steps.map((s, i) => {
          const x = 30 + i * 200;
          return (
            <g key={i}>
              <rect x={x} y="100" width="185" height="160" rx="8"
                className={s.bgClass} strokeWidth="1.5" />
              <circle cx={x + 22} cy="122" r="14" className={s.numBg} />
              <text x={x + 22} y="127" textAnchor="middle" className="step-num" fill={s.color}>
                {s.num}
              </text>
              <text x={x + 92} y="127" textAnchor="middle" className="heading" fill={s.color}>
                {s.title}
              </text>
              {s.desc.split('\n').map((line, li) => (
                <text key={li} x={x + 92} y={150 + li * 16} textAnchor="middle"
                  className="small fill-slate-600 dark:fill-slate-300">{line}</text>
              ))}
            </g>
          );
        })}

        {/* Results table */}
        <text x="320" y="285" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Your Results Table (fill this in!)
        </text>

        {/* Table header */}
        <rect x="80" y="295" width="480" height="25" rx="4"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        {['Cube Side', 'Surface Area', 'Volume', 'SA ÷ Vol', 'Dries first?'].map((h, i) => (
          <text key={i} x={120 + i * 96} y="312" textAnchor="middle"
            className="small fill-slate-700 dark:fill-slate-200" fontWeight="600">{h}</text>
        ))}

        {/* Table rows */}
        {[
          { side: '1 cm', sa: '6 cm²', vol: '1 cm³', ratio: '6.0', dry: '⭐ Fastest!', color: '#22c55e' },
          { side: '2 cm', sa: '24 cm²', vol: '8 cm³', ratio: '3.0', dry: 'Medium', color: '#3b82f6' },
          { side: '4 cm', sa: '96 cm²', vol: '64 cm³', ratio: '1.5', dry: 'Slowest', color: '#8b5cf6' },
        ].map((row, i) => {
          const y = 330 + i * 28;
          return (
            <g key={i}>
              <rect x="80" y={y - 10} width="480" height="28" rx="0"
                fill={row.color} opacity="0.06" />
              {[row.side, row.sa, row.vol, row.ratio, row.dry].map((val, vi) => (
                <text key={vi} x={120 + vi * 96} y={y + 6} textAnchor="middle"
                  className="small fill-slate-600 dark:fill-slate-300">{val}</text>
              ))}
            </g>
          );
        })}

        {/* Table border */}
        <rect x="80" y="295" width="480" height="109" rx="4"
          fill="none" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Connection to biology */}
        <rect x="40" y="418" width="270" height="68" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="175" y="436" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          What you discovered
        </text>
        <text x="175" y="452" textAnchor="middle" className="tiny fill-emerald-600 dark:fill-emerald-400">
          The 1 cm cube has 6× the SA:V ratio of the 4 cm cube.
        </text>
        <text x="175" y="466" textAnchor="middle" className="tiny fill-emerald-600 dark:fill-emerald-400">
          It dries fastest because more surface is exposed
        </text>
        <text x="175" y="480" textAnchor="middle" className="tiny fill-emerald-600 dark:fill-emerald-400">
          relative to its volume of water. Same reason tiny frogs dry out!
        </text>

        <rect x="330" y="418" width="270" height="68" rx="6"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="465" y="436" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-300" fontWeight="600">
          The biology connection
        </text>
        <text x="465" y="452" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          A 7 mm frog is like the 1 cm cube — enormous surface
        </text>
        <text x="465" y="466" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          relative to volume. Great for breathing through skin.
        </text>
        <text x="465" y="480" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          Terrible for staying hydrated. That’s why they live in wet leaf litter.
        </text>
      </svg>
    </div>
  );
};

export default ActivitySizeScaleDiagram;
