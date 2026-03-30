export default function WoodpeckerStressDistributionDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 443"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="FEA-style stress map of woodpecker skull during impact showing stress distribution"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <defs>
          {/* Stress gradient: red (high) -> yellow -> green -> blue (low) */}
          <linearGradient id="stress-grad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <radialGradient id="stress-radial" cx="85%" cy="50%" r="85%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="20%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
        </defs>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          FEA Stress Map: Skull During Impact
        </text>
        <text x="300" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Finite Element Analysis shows how force distributes through bone
        </text>

        {/* Skull outline with stress colors */}
        <g transform="translate(100, 60)">
          {/* Skull shape filled with stress gradient */}
          <ellipse cx="140" cy="130" rx="110" ry="120" fill="url(#stress-radial)" opacity="0.6" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

          {/* FEA mesh overlay */}
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={`h-${i}`} cx="140" cy="130" rx={110 - i * 9} ry={120 - i * 10}
              fill="none" stroke="#f8fafc" strokeWidth="0.3" opacity="0.2" />
          ))}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * Math.PI * 2) / 16;
            return (
              <line key={`r-${i}`}
                x1={140 + Math.cos(angle) * 15} y1={130 + Math.sin(angle) * 15}
                x2={140 + Math.cos(angle) * 110} y2={130 + Math.sin(angle) * 120}
                stroke="#f8fafc" strokeWidth="0.3" opacity="0.2" />
            );
          })}

          {/* Beak (high stress zone) */}
          <polygon points="245,120 340,118 340,142 245,140" fill="#dc2626" opacity="0.7" stroke="#ef4444" strokeWidth="1" />

          {/* Brain area (low stress) */}
          <ellipse cx="130" cy="130" rx="55" ry="60" fill="#3b82f6" opacity="0.2" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />
          <text x="130" y="135" textAnchor="middle" className="sm" fill="#93c5fd">Low stress</text>
          <text x="130" y="148" textAnchor="middle" className="sm" fill="#93c5fd">(brain zone)</text>

          {/* Impact point */}
          <circle cx="340" cy="130" r="8" fill="#dc2626" opacity="0.8">
            <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="360" y="125" className="sm" fill="#fca5a5">Impact</text>
          <text x="360" y="138" className="sm" fill="#fca5a5">point</text>

          {/* Stress annotations */}
          <line x1="240" y1="130" x2="280" y2="80" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="284" y="75" className="sm" fill="#fca5a5">High stress</text>
          <text x="284" y="87" className="sm" fill="#fca5a5">(beak-skull junction)</text>

          <line x1="90" y1="60" x2="50" y2="30" stroke="#86efac" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="0" y="25" className="sm" fill="#86efac">Medium stress</text>
          <text x="0" y="37" className="sm" fill="#86efac">(upper skull)</text>

          <line x1="60" y1="200" x2="20" y2="230" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="0" y="245" className="sm" fill="#60a5fa">Low stress</text>
          <text x="0" y="257" className="sm" fill="#60a5fa">(rear skull)</text>
        </g>

        {/* Color legend */}
        <g transform="translate(80, 340)">
          <text x="0" y="0" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">Stress Scale (von Mises)</text>
          <rect x="0" y="10" width="440" height="16" rx="4" fill="url(#stress-grad)" />
          <text x="0" y="40" className="sm" fill="#60a5fa">Low (0 MPa)</text>
          <text x="220" y="40" textAnchor="middle" className="sm" fill="#eab308">Medium</text>
          <text x="440" y="40" textAnchor="end" className="sm" fill="#ef4444">High (200+ MPa)</text>
        </g>

        <text x="300" y="393" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          The skull channels stress away from the brain and distributes it through the bone structure
        </text>
      </svg>
    </div>
  );
}
