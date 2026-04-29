const WootzMicrostructureDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 440 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Wootz steel microstructure showing damask banding pattern and carbon nanotube inset"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        {/* Background */}
        <rect width="420" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Wootz Steel — Damask Microstructure
        </text>

        {/* Blade outline */}
        <path d="M 50 60 L 270 60 L 290 150 L 270 240 L 50 240 Z"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Damask banding pattern — alternating light/dark wavy bands */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const y = 70 + i * 18;
          const dark = i % 2 === 0;
          return (
            <path
              key={i}
              d={`M 55 ${y} Q 100 ${y - 5}, 150 ${y + 3} Q 200 ${y + 8}, 250 ${y - 2} L 270 ${y}`}
              fill="none"
              stroke={dark ? '#1e293b' : '#94a3b8'}
              strokeWidth={dark ? 5 : 4}
              opacity={dark ? 0.7 : 0.4}
            />
          );
        })}

        {/* Band labels */}
        <line x1="290" y1="78" x2="330" y2="68" className="stroke-slate-400" strokeWidth="1" />
        <text x="335" y="72" className="small-text fill-slate-600 dark:fill-slate-300">
          Cementite (Fe₃C)
        </text>
        <text x="335" y="84" className="small-text fill-slate-500 dark:fill-slate-400">
          Hard, dark bands
        </text>

        <line x1="290" y1="96" x2="330" y2="106" className="stroke-slate-400" strokeWidth="1" />
        <text x="335" y="110" className="small-text fill-slate-600 dark:fill-slate-300">
          Ferrite (pure Fe)
        </text>
        <text x="335" y="122" className="small-text fill-slate-500 dark:fill-slate-400">
          Soft, light bands
        </text>

        {/* Edge label */}
        <text x="290" y="155" className="small-text fill-slate-500 dark:fill-slate-400">
          Blade edge →
        </text>

        {/* Carbon content label */}
        <text x="160" y="255" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          ~1.5% carbon steel, slow-cooled
        </text>

        {/* Zoom inset box — carbon nanotubes */}
        <rect x="40" y="270" width="160" height="65" rx="4"
          className="fill-slate-100 dark:fill-slate-800 stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" />
        <text x="120" y="285" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-400" fontWeight="600">
          Nanoscale zoom (TEM)
        </text>

        {/* Nanotube representations */}
        {[60, 85, 110, 135].map((x) => (
          <g key={x}>
            <rect x={x} y="293" width="8" height="30" rx="4"
              fill="none" stroke="#6366f1" strokeWidth="1.2" />
            <line x1={x + 4} y1="296" x2={x + 4} y2="320"
              stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2 2" />
          </g>
        ))}
        <text x="165" y="312" className="small-text fill-indigo-500 dark:fill-indigo-400">
          Carbon
        </text>
        <text x="165" y="324" className="small-text fill-indigo-500 dark:fill-indigo-400">
          nanotubes
        </text>

        {/* Zoom connector line */}
        <line x1="160" y1="232" x2="120" y2="270"
          stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />

        {/* Properties box */}
        <rect x="230" y="270" width="170" height="65" rx="4"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="315" y="287" textAnchor="middle"
          className="small-text fill-slate-700 dark:fill-slate-200" fontWeight="600">
          Properties
        </text>
        <text x="240" y="302" className="small-text fill-slate-600 dark:fill-slate-300">
          Hard edge (cementite) + tough body
        </text>
        <text x="240" y="314" className="small-text fill-slate-600 dark:fill-slate-300">
          Self-sharpening blade
        </text>
        <text x="240" y="326" className="small-text fill-slate-600 dark:fill-slate-300">
          Nanotubes found in 2006 research
        </text>
      </svg>
    </div>
  );
};

export default WootzMicrostructureDiagram;
