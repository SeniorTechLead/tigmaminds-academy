export default function WoodpeckerDecelerationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Velocity vs time during woodpecker impact: 7 meters per second to 0 in less than 1 millisecond"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Deceleration During Impact
        </text>
        <text x="300" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Velocity vs Time: How fast does the beak stop?
        </text>

        {/* Graph area */}
        <g transform="translate(80, 65)">
          {/* Y axis */}
          <line x1="0" y1="0" x2="0" y2="250" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* X axis */}
          <line x1="0" y1="250" x2="440" y2="250" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

          {/* Y axis label */}
          <text x="-50" y="125" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" transform="rotate(-90,-50,125)">
            Velocity (m/s)
          </text>

          {/* X axis label */}
          <text x="220" y="280" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
            Time (milliseconds)
          </text>

          {/* Y gridlines and labels */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(v => (
            <g key={v}>
              <line x1="-5" y1={250 - v * (250 / 7)} x2="440" y2={250 - v * (250 / 7)} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1" />
              <text x="-10" y={250 - v * (250 / 7) + 4} textAnchor="end" className="sm fill-gray-400 dark:fill-slate-500">{v}</text>
            </g>
          ))}

          {/* X gridlines and labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
            <g key={i}>
              <line x1={i * 88} y1="250" x2={i * 88} y2="255" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
              <text x={i * 88} y="268" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{v.toFixed(1)}</text>
            </g>
          ))}

          {/* Approach phase: constant velocity */}
          <line x1="0" y1={250 - 7 * (250 / 7)} x2="180" y2={250 - 7 * (250 / 7)} stroke="#22c55e" strokeWidth="3" />
          <text x="90" y={250 - 7 * (250 / 7) - 8} textAnchor="middle" className="val" fill="#86efac">7 m/s approach</text>

          {/* Impact zone - steep drop */}
          <path d="M180,0 C200,20 210,200 220,250" fill="none" stroke="#ef4444" strokeWidth="3" />

          {/* Impact zone highlight */}
          <rect x="175" y="0" width="50" height="250" fill="#ef4444" opacity="0.05" />
          <text x="200" y="140" textAnchor="middle" className="sm" fill="#fca5a5" transform="rotate(-75,200,140)">
            IMPACT!
          </text>

          {/* Post-impact: zero */}
          <line x1="220" y1="250" x2="440" y2="250" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" strokeDasharray="4 3" />

          {/* Time bracket for impact */}
          <line x1="180" y1="290" x2="220" y2="290" stroke="#fbbf24" strokeWidth="2" />
          <line x1="180" y1="285" x2="180" y2="295" stroke="#fbbf24" strokeWidth="2" />
          <line x1="220" y1="285" x2="220" y2="295" stroke="#fbbf24" strokeWidth="2" />
          <text x="200" y="306" textAnchor="middle" className="val" fill="#fbbf24">&lt; 0.5 ms</text>

          {/* Peak deceleration annotation */}
          <line x1="195" y1="125" x2="280" y2="80" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="280" y="62" width="150" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#ef4444" strokeWidth="1" />
          <text x="355" y="78" textAnchor="middle" className="sm" fill="#fca5a5">Peak deceleration:</text>
          <text x="355" y="94" textAnchor="middle" className="val" fill="#ef4444">~1,200g</text>
        </g>

        {/* Comparison box */}
        <g transform="translate(80, 365)">
          <rect x="0" y="0" width="440" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" />
          <text x="220" y="18" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            For comparison: a car crash takes ~100ms to decelerate — 200x longer than a woodpecker strike
          </text>
        </g>
      </svg>
    </div>
  );
}
