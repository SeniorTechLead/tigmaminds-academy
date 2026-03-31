const TrainGearsDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram explaining gears, gradient percentage, and rack-and-pinion railways"
      >
        <style>{`
          .tg-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .tg-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .tg-section { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .tg-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tg-tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes gearSpin1 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes gearSpin2 {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .tg-gear1 { animation: gearSpin1 6s linear infinite; transform-origin: center; }
          .tg-gear2 { animation: gearSpin2 3s linear infinite; transform-origin: center; }
        `}</style>

        <defs>
          <marker id="tg-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-700 dark:fill-slate-200" />
          </marker>
          <marker id="tg-arr-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="tg-arr-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="520" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" className="tg-title fill-gray-800 dark:fill-slate-100">
          Gears and Gradient: Trading Speed for Force
        </text>

        {/* === LEFT: Gear pair === */}
        <text x="150" y="52" textAnchor="middle" className="tg-section fill-blue-600 dark:fill-blue-400">
          How Gears Multiply Force
        </text>

        {/* Large gear (driven) */}
        <g transform="translate(120, 130)">
          <g className="tg-gear1">
            <circle cx="0" cy="0" r="50" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" className="fill-blue-500 dark:fill-blue-400" />
            {/* Teeth */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i * 18) * Math.PI / 180;
              return (
                <rect key={i} x="-3" y="-56" width="6" height="8" rx="1"
                  className="fill-blue-400 dark:fill-blue-500"
                  transform={`rotate(\${i * 18})`} />
              );
            })}
          </g>
          <text x="0" y="70" textAnchor="middle" className="tg-small fill-blue-600 dark:fill-blue-400">
            Large gear: 40 teeth
          </text>
          <text x="0" y="82" textAnchor="middle" className="tg-small fill-blue-600 dark:fill-blue-400">
            Slow but powerful
          </text>
        </g>

        {/* Small gear (driving) */}
        <g transform="translate(195, 100)">
          <g className="tg-gear2">
            <circle cx="0" cy="0" r="26" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" className="fill-amber-500 dark:fill-amber-400" />
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x="-3" y="-32" width="6" height="8" rx="1"
                className="fill-amber-400 dark:fill-amber-500"
                transform={`rotate(\${i * 36})`} />
            ))}
          </g>
          <text x="40" y="-10" className="tg-small fill-amber-600 dark:fill-amber-400">
            Small gear: 20 teeth
          </text>
          <text x="40" y="2" className="tg-small fill-amber-600 dark:fill-amber-400">
            Fast from engine
          </text>
        </g>

        {/* Gear ratio explanation */}
        <rect x="30" y="222" width="240" height="60" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="150" y="240" textAnchor="middle" className="tg-small fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          Gear ratio = 40/20 = 2:1
        </text>
        <text x="150" y="255" textAnchor="middle" className="tg-small fill-emerald-600 dark:fill-emerald-400">
          Output speed halved, but force doubled
        </text>
        <text x="150" y="268" textAnchor="middle" className="tg-tiny fill-emerald-600 dark:fill-emerald-400">
          Hill trains use ratios of 4:1 or higher for steep grades
        </text>

        {/* === RIGHT: Gradient diagram === */}
        <text x="440" y="52" textAnchor="middle" className="tg-section fill-blue-600 dark:fill-blue-400">
          What Is Gradient?
        </text>

        {/* Gradient triangle */}
        <line x1="330" y1="200" x2="560" y2="200" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <line x1="560" y1="200" x2="560" y2="130" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="330" y1="200" x2="560" y2="130" stroke="#ef4444" strokeWidth="2.5" />

        {/* Horizontal label */}
        <text x="445" y="218" textAnchor="middle" className="tg-small fill-gray-600 dark:fill-gray-400">
          100 m horizontal
        </text>
        {/* Vertical label */}
        <text x="578" y="168" textAnchor="middle" className="tg-small fill-gray-600 dark:fill-gray-400" transform="rotate(90,578,168)">
          Rise
        </text>

        {/* Gradient examples */}
        {[
          { rise: 2, pct: '2%', note: 'Typical mainline max', color: '#22c55e', y: 195 },
          { rise: 5, pct: '5%', note: 'Steep mountain grade', color: '#f59e0b', y: 180 },
          { rise: 8, pct: '8%', note: 'Extreme (rack railway)', color: '#ef4444', y: 160 },
        ].map((g, i) => {
          const endY = 200 - (g.rise / 8) * 70;
          return (
            <g key={i}>
              <line x1="330" y1="200" x2="560" y2={endY}
                stroke={g.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
              <circle cx="560" cy={endY} r="3" fill={g.color} />
              <text x="568" y={endY + 3} className="tg-tiny" fill={g.color}>
                {g.pct} \u2014 {g.note}
              </text>
            </g>
          );
        })}

        {/* Formula */}
        <rect x="330" y="226" width="240" height="36" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="450" y="244" textAnchor="middle" className="tg-small fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Gradient (%) = (rise / run) \u00D7 100
        </text>
        <text x="450" y="257" textAnchor="middle" className="tg-tiny fill-blue-600 dark:fill-blue-400">
          A 5% grade rises 5 m for every 100 m of track
        </text>

        {/* Divider */}
        <line x1="20" y1="290" x2="580" y2="290" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === BOTTOM: Rack-and-pinion === */}
        <text x="300" y="314" textAnchor="middle" className="tg-section fill-purple-600 dark:fill-purple-400">
          Rack-and-Pinion Railway: When Friction Isn't Enough
        </text>

        {/* Rack rail diagram */}
        {/* Angled track */}
        <line x1="60" y1="460" x2="350" y2="360" stroke="#94a3b8" strokeWidth="6" />

        {/* Rack teeth on track */}
        {Array.from({ length: 20 }).map((_, i) => {
          const t = i / 19;
          const cx = 60 + t * 290;
          const cy = 460 - t * 100;
          return (
            <rect key={i} x={cx - 2} y={cy - 10} width="4" height="8" rx="1"
              className="fill-gray-500 dark:fill-gray-400"
              transform={`rotate(-19, \${cx}, \${cy})`} />
          );
        })}

        {/* Pinion gear on train */}
        <g transform="translate(180, 400)">
          <circle cx="0" cy="0" r="14" className="fill-purple-200 dark:fill-purple-900/40 stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" className="fill-purple-500 dark:fill-purple-400" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="-2" y="-18" width="4" height="6" rx="1"
              className="fill-purple-400 dark:fill-purple-500"
              transform={`rotate(\${i * 45})`} />
          ))}
        </g>

        {/* Train body */}
        <rect x="145" y="370" width="70" height="30" rx="4"
          className="fill-red-200 dark:fill-red-900/30 stroke-red-500 dark:stroke-red-400" strokeWidth="1.5"
          transform="rotate(-19, 180, 385)" />

        {/* Labels */}
        <line x1="180" y1="400" x2="180" y2="430" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,2" />
        <text x="180" y="445" textAnchor="middle" className="tg-small fill-purple-600 dark:fill-purple-400">
          Pinion gear meshes with
        </text>
        <text x="180" y="457" textAnchor="middle" className="tg-small fill-purple-600 dark:fill-purple-400">
          toothed rack on the track
        </text>

        {/* Right side: explanation */}
        <rect x="370" y="330" width="210" height="170" rx="6"
          className="fill-gray-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="475" y="352" textAnchor="middle" className="tg-small fill-purple-600 dark:fill-purple-400" fontWeight="600">
          When do you need a rack?
        </text>
        {[
          'Above ~8% gradient, steel wheels',
          'slip on steel rails even when dry.',
          '',
          'The Nilgiri Mountain Railway in',
          'Tamil Nadu uses rack-and-pinion',
          'on its steepest section (8.33%).',
          '',
          'Switzerland\u2019s Pilatus Railway:',
          '48% gradient \u2014 the steepest rack',
          'railway in the world!',
          '',
          'The gear teeth lock into the rack,',
          'making slipping impossible.',
        ].map((line, i) => (
          <text key={i} x="380" y={370 + i * 12} className="tg-tiny fill-gray-600 dark:fill-gray-400">
            {line}
          </text>
        ))}

      </svg>
    </div>
  );
};

export default TrainGearsDiagram;
