const RedSeaCFDDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 340"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Computational Fluid Dynamics diagram showing how a fluid domain is divided into a grid of cells for simulation"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="rsc-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-emerald-500 dark:fill-emerald-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="320" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          CFD — Computational Fluid Dynamics
        </text>

        {/* Step 1: Grid */}
        <rect x="20" y="42" width="160" height="120" rx="4"
          className="fill-sky-50 dark:fill-sky-950/30 stroke-sky-300 dark:stroke-sky-700" strokeWidth="1" />
        <text x="100" y="58" textAnchor="middle"
          className="label-text fill-sky-700 dark:fill-sky-300" fontWeight="600" style={{ fontSize: '10px' }}>
          1. Divide into cells
        </text>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line key={`gv${i}`} x1={35 + i * 27} y1={68} x2={35 + i * 27} y2={148}
            className="stroke-sky-300 dark:stroke-sky-600" strokeWidth="0.8" />
        ))}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`gh${i}`} x1={35} y1={68 + i * 20} x2={170} y2={68 + i * 20}
            className="stroke-sky-300 dark:stroke-sky-600" strokeWidth="0.8" />
        ))}

        {/* Highlighted cell */}
        <rect x="89" y="88" width="27" height="20" rx="1"
          className="fill-sky-400 dark:fill-sky-600" opacity="0.4" />
        <text x="103" y="102" textAnchor="middle"
          className="label-text fill-sky-800 dark:fill-sky-200" style={{ fontSize: '10px' }}>
          cell
        </text>

        {/* Step 2: Equations */}
        <rect x="190" y="42" width="160" height="120" rx="4"
          className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="270" y="58" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300" fontWeight="600" style={{ fontSize: '10px' }}>
          2. Solve equations per cell
        </text>

        {/* Equations list */}
        <text x="200" y="78" className="formula-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '10px' }}>
          • Conservation of mass
        </text>
        <text x="200" y="94" className="formula-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '10px' }}>
          • Conservation of momentum
        </text>
        <text x="200" y="110" className="formula-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '10px' }}>
          • Conservation of energy
        </text>
        <text x="200" y="130" className="formula-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '10px' }}>
          (Navier-Stokes equations)
        </text>
        <text x="200" y="150" className="formula-text fill-emerald-500 dark:fill-emerald-500" style={{ fontSize: '10px' }}>
          Each cell passes data to neighbors
        </text>

        {/* Step 3: Result */}
        <rect x="360" y="42" width="170" height="120" rx="4"
          className="fill-violet-50 dark:fill-violet-950/30 stroke-violet-300 dark:stroke-violet-700" strokeWidth="1" />
        <text x="445" y="58" textAnchor="middle"
          className="label-text fill-violet-700 dark:fill-violet-300" fontWeight="600" style={{ fontSize: '10px' }}>
          3. Visualize result
        </text>

        {/* Simplified flow viz */}
        {[0, 1, 2, 3].map(row => (
          <g key={`fr${row}`}>
            {[0, 1, 2, 3, 4].map(col => {
              const x = 380 + col * 30;
              const y = 72 + row * 24;
              const speed = Math.max(0.3, 1 - Math.abs(row - 1.5) / 2.5);
              const len = 8 + speed * 14;
              return (
                <line key={`fa${row}${col}`} x1={x} y1={y} x2={x + len} y2={y}
                  className="stroke-emerald-500 dark:stroke-emerald-400"
                  strokeWidth={1 + speed * 1.5} markerEnd="url(#rsc-arrow)" opacity={0.5 + speed * 0.5} />
              );
            })}
          </g>
        ))}
        <text x="445" y="155" textAnchor="middle"
          className="label-text fill-violet-600 dark:fill-violet-400" style={{ fontSize: '10px' }}>
          Velocity field (flow map)
        </text>

        {/* Arrows between steps */}
        <text x="183" y="105" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: '16px' }}>→</text>
        <text x="353" y="105" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: '16px' }}>→</text>

        {/* Bottom: Application to Red Sea */}
        <rect x="20" y="175" width="510" height="130" rx="6"
          className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="270" y="195" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          CFD Applied to the Red Sea Crossing
        </text>

        {/* Pipeline */}
        <rect x="35" y="208" width="100" height="40" rx="4"
          className="fill-sky-100 dark:fill-sky-900/40 stroke-sky-400 dark:stroke-sky-600" strokeWidth="1" />
        <text x="85" y="224" textAnchor="middle"
          className="label-text fill-sky-700 dark:fill-sky-300" style={{ fontSize: '10px' }}>
          Seabed shape
        </text>
        <text x="85" y="238" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400" style={{ fontSize: '10px' }}>
          + water depth
        </text>

        <text x="145" y="228" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: '14px' }}>→</text>

        <rect x="160" y="208" width="100" height="40" rx="4"
          className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="210" y="224" textAnchor="middle"
          className="label-text fill-emerald-700 dark:fill-emerald-300" style={{ fontSize: '10px' }}>
          Wind speed
        </text>
        <text x="210" y="238" textAnchor="middle"
          className="label-text fill-emerald-600 dark:fill-emerald-400" style={{ fontSize: '10px' }}>
          + direction
        </text>

        <text x="270" y="228" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: '14px' }}>→</text>

        <rect x="285" y="208" width="100" height="40" rx="4"
          className="fill-violet-100 dark:fill-violet-900/40 stroke-violet-400 dark:stroke-violet-600" strokeWidth="1" />
        <text x="335" y="224" textAnchor="middle"
          className="label-text fill-violet-700 dark:fill-violet-300" style={{ fontSize: '10px' }}>
          CFD solver
        </text>
        <text x="335" y="238" textAnchor="middle"
          className="label-text fill-violet-600 dark:fill-violet-400" style={{ fontSize: '10px' }}>
          (Navier-Stokes)
        </text>

        <text x="395" y="228" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: '14px' }}>→</text>

        <rect x="410" y="208" width="108" height="40" rx="4"
          className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1" />
        <text x="464" y="224" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" style={{ fontSize: '10px' }}>
          Water level drops
        </text>
        <text x="464" y="238" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '10px' }}>
          1.5–2 m → ridge exposed
        </text>

        <text x="270" y="273" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Drews &amp; Han (2010) ran this exact CFD simulation: 63 mph wind over 12 hours
        </text>
        <text x="270" y="287" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          pushed water back, exposing a 3–4 km wide path for ~4 hours
        </text>
      </svg>
    </div>
  );
};

export default RedSeaCFDDiagram;
