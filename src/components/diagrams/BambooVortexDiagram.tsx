export default function BambooVortexDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing wind creating vortices as it flows past a bamboo stalk, producing Aeolian sound"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .formula { font-family: system-ui, sans-serif; font-size: 12px; font-style: italic; }
          .small { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes drift { 0% { opacity: 0.8; } 50% { opacity: 0.4; } 100% { opacity: 0.8; } }
          .vortex { animation: drift 2s ease-in-out infinite; }
          .v2 { animation-delay: 0.5s; }
          .v3 { animation-delay: 1s; }
          .v4 { animation-delay: 1.5s; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Aeolian Vibration: How Wind Makes Bamboo Sing
        </text>

        {/* Wind arrows - left side */}
        {[100, 150, 200, 250, 300].map((y, i) => (
          <g key={i}>
            <line x1="20" y1={y} x2="100" y2={y} className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="2" markerEnd="url(#arrowBlue)" />
          </g>
        ))}
        <text x="60" y="85" textAnchor="middle" className="label fill-sky-500 dark:fill-sky-400">Wind (V)</text>

        {/* Bamboo cross-section */}
        <circle cx="150" cy="200" r="20" className="fill-emerald-500 dark:fill-emerald-600" opacity="0.9" />
        <circle cx="150" cy="200" r="12" className="fill-emerald-300 dark:fill-emerald-400" opacity="0.5" />
        <text x="150" y="204" textAnchor="middle" className="small fill-white">D</text>
        <text x="150" y="240" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-400">Bamboo</text>
        <text x="150" y="253" textAnchor="middle" className="small fill-emerald-500 dark:fill-emerald-400">(cross-section)</text>

        {/* Flow lines bending around bamboo */}
        <path d="M 110,140 Q 130,140 140,160 Q 155,180 170,170 Q 200,155 230,160" fill="none" className="stroke-sky-300 dark:stroke-sky-600" strokeWidth="1.5" opacity="0.6" />
        <path d="M 110,260 Q 130,260 140,240 Q 155,220 170,230 Q 200,245 230,240" fill="none" className="stroke-sky-300 dark:stroke-sky-600" strokeWidth="1.5" opacity="0.6" />

        {/* Von Karman vortex street */}
        {[
          { x: 220, y: 170, r: 'cw' },
          { x: 260, y: 230, r: 'ccw' },
          { x: 300, y: 170, r: 'cw' },
          { x: 340, y: 230, r: 'ccw' },
          { x: 380, y: 170, r: 'cw' },
        ].map((v, i) => (
          <g key={i} className={`vortex ${i === 1 ? 'v2' : i === 2 ? 'v3' : i === 3 ? 'v4' : ''}`}>
            <circle cx={v.x} cy={v.y} r="18" fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={v.x} y={v.y + 4} textAnchor="middle" className="label fill-blue-400 dark:fill-blue-500" fontSize="14">
              {v.r === 'cw' ? '↻' : '↺'}
            </text>
          </g>
        ))}

        <text x="300" y="275" textAnchor="middle" className="label fill-blue-500 dark:fill-blue-400">
          Von Kármán Vortex Street
        </text>
        <text x="300" y="290" textAnchor="middle" className="small fill-blue-400 dark:fill-blue-500">
          Alternating vortices create pressure pulses → sound
        </text>

        {/* Sound waves emanating */}
        {[1, 2, 3].map(i => (
          <path key={i} d={`M ${400 + i * 25},160 Q ${410 + i * 25},200 ${400 + i * 25},240`}
            fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" opacity={0.8 - i * 0.2} />
        ))}
        <text x="480" y="200" textAnchor="middle" className="label fill-amber-500 dark:fill-amber-400">Sound</text>
        <text x="480" y="215" textAnchor="middle" className="label fill-amber-500 dark:fill-amber-400">waves</text>

        {/* Formula box */}
        <rect x="140" y="310" width="320" height="70" rx="6" className="fill-slate-50 dark:fill-slate-900" stroke="#64748b" strokeWidth="1" />
        <text x="300" y="332" textAnchor="middle" className="formula fill-gray-800 dark:fill-slate-200">
          f = St × V / D
        </text>
        <text x="300" y="350" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          St ≈ 0.2 (Strouhal number) | V = wind speed (m/s) | D = diameter (m)
        </text>
        <text x="300" y="368" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">
          5 cm bamboo in 5 m/s breeze → f = 0.2 × 5 / 0.05 = 20 Hz (low hum)
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" className="fill-sky-400 dark:fill-sky-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
