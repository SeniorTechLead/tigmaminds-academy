export default function BambooResonanceDiagram() {
  const barHeight = (val: number, max: number) => (val / max) * 200;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Resonance diagram comparing low, matched, and high frequency forcing on a bamboo stalk"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
          .small { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes sway1 { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
          @keyframes sway2 { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
          @keyframes sway3 { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
          .bamboo1 { animation: sway1 3s ease-in-out infinite; transform-origin: bottom center; }
          .bamboo2 { animation: sway2 1.5s ease-in-out infinite; transform-origin: bottom center; }
          .bamboo3 { animation: sway3 0.8s ease-in-out infinite; transform-origin: bottom center; }
        `}</style>

        <rect width="600" height="440" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Resonance: When Wind Frequency Matches Bamboo
        </text>

        {/* Three scenarios */}
        {[
          { x: 100, label: 'Below Resonance', freq: 'Wind: 0.5 Hz', natural: 'Bamboo: 2 Hz', amp: 'Small sway', color: '#3b82f6', cls: 'bamboo1', ampVal: 0.2 },
          { x: 300, label: 'AT Resonance', freq: 'Wind: 2 Hz', natural: 'Bamboo: 2 Hz', amp: 'HUGE sway!', color: '#ef4444', cls: 'bamboo2', ampVal: 1.0 },
          { x: 500, label: 'Above Resonance', freq: 'Wind: 8 Hz', natural: 'Bamboo: 2 Hz', amp: 'Tiny quiver', color: '#22c55e', cls: 'bamboo3', ampVal: 0.15 },
        ].map((s, i) => (
          <g key={i}>
            {/* Label */}
            <text x={s.x} y="55" textAnchor="middle" className="val" fill={s.color}>{s.label}</text>
            <text x={s.x} y="72" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">{s.freq}</text>
            <text x={s.x} y="84" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">{s.natural}</text>

            {/* Ground */}
            <rect x={s.x - 50} y="250" width="100" height="8" rx="2" className="fill-amber-800 dark:fill-amber-900" opacity="0.5" />

            {/* Bamboo stalk */}
            <g className={s.cls}>
              <rect x={s.x - 4} y="110" width="8" height="140" rx="3" className="fill-emerald-500 dark:fill-emerald-600" />
              {/* Leaves */}
              <ellipse cx={s.x - 12} cy="120" rx="10" ry="4" className="fill-emerald-400 dark:fill-emerald-500" transform={`rotate(-30,${s.x - 12},120)`} />
              <ellipse cx={s.x + 12} cy="130" rx="10" ry="4" className="fill-emerald-400 dark:fill-emerald-500" transform={`rotate(30,${s.x + 12},130)`} />
              <ellipse cx={s.x - 10} cy="150" rx="8" ry="3" className="fill-emerald-400 dark:fill-emerald-500" transform={`rotate(-25,${s.x - 10},150)`} />
            </g>

            {/* Amplitude indicator */}
            <text x={s.x} y="278" textAnchor="middle" className="label" fill={s.color}>{s.amp}</text>

            {/* Amplitude bar */}
            <rect x={s.x - 15} y={310 + (200 - barHeight(s.ampVal, 1))} width="30" height={barHeight(s.ampVal, 1)} rx="4" fill={s.color} opacity="0.8" />
          </g>
        ))}

        {/* Amplitude axis */}
        <text x="30" y="410" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400" transform="rotate(-90,30,410)">
          Amplitude
        </text>
        <line x1="45" y1="310" x2="45" y2="510" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Key insight */}
        <rect x="100" y="390" width="400" height="36" rx="6" className="fill-red-50 dark:fill-red-950" stroke="#ef4444" strokeWidth="1" />
        <text x="300" y="408" textAnchor="middle" className="label fill-red-700 dark:fill-red-400">
          Resonance = maximum energy transfer. The bamboo captures the wind’s energy
        </text>
        <text x="300" y="421" textAnchor="middle" className="small fill-red-600 dark:fill-red-500">
          Same principle: pushing a swing at the right moment | wine glass shattering | Tacoma Narrows Bridge
        </text>
      </svg>
    </div>
  );
}
