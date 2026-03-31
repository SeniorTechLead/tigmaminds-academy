export default function ActivitySilkStretchDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: compare how different fabrics stretch and recover when pulled"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="620" height="320" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="28" textAnchor="middle" className="title fill-emerald-700 dark:fill-emerald-300">
          Activity: Fabric Stretch Test
        </text>
        <text x="310" y="48" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Compare how different fabrics stretch and snap back
        </text>

        {/* Three fabric strips being stretched */}
        {[
          { x: 70, name: 'Cotton', color: '#3b82f6', darkColor: '#60a5fa', stretch: 8, recovery: 'Low', desc: 'Stretches a little,\nstays stretched' },
          { x: 270, name: 'Silk (if available)', color: '#d97706', darkColor: '#fbbf24', stretch: 15, recovery: 'Medium', desc: 'Stretches more,\npartly recovers' },
          { x: 470, name: 'Polyester/Nylon', color: '#8b5cf6', darkColor: '#a78bfa', stretch: 20, recovery: 'High', desc: 'Stretches most,\nsnaps back well' },
        ].map((f, i) => (
          <g key={i}>
            <text x={f.x} y={80} textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">{f.name}</text>

            {/* Original strip */}
            <rect x={f.x - 30} y={95} width={60} height={15} rx="2" fill={f.color} opacity="0.3" stroke={f.color} strokeWidth="1" strokeDasharray="3,2" />
            <text x={f.x + 45} y={106} className="small fill-slate-500 dark:fill-slate-400">original</text>

            {/* Stretched strip */}
            <rect x={f.x - 30 - f.stretch / 2} y={125} width={60 + f.stretch} height={15} rx="2" fill={f.color} opacity="0.6" stroke={f.color} strokeWidth="1.5" />
            <text x={f.x + 50 + f.stretch / 2} y={136} className="small fill-slate-500 dark:fill-slate-400">stretched</text>

            {/* Arrows showing pull direction */}
            <line x1={f.x - 30 - f.stretch / 2 - 5} y1={132} x2={f.x - 30 - f.stretch / 2 - 15} y2={132} stroke={f.color} strokeWidth="1.5" markerEnd={`url(#stretch-arr-${i})`} />
            <line x1={f.x + 30 + f.stretch / 2 + 5} y1={132} x2={f.x + 30 + f.stretch / 2 + 15} y2={132} stroke={f.color} strokeWidth="1.5" markerEnd={`url(#stretch-arr-r-${i})`} />

            {/* Recovery label */}
            <text x={f.x} y={165} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Recovery: <tspan fontWeight="600">{f.recovery}</tspan></text>

            {/* Description */}
            {f.desc.split('\n').map((line, j) => (
              <text key={j} x={f.x} y={182 + j * 13} textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">{line}</text>
            ))}

            <defs>
              <marker id={`stretch-arr-${i}`} viewBox="0 0 10 10" refX="0" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 10 0 L 0 5 L 10 10 z" fill={f.color} />
              </marker>
              <marker id={`stretch-arr-r-${i}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={f.color} />
              </marker>
            </defs>
          </g>
        ))}

        {/* Instructions box */}
        <rect x="40" y="220" width="540" height="85" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="60" y="242" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">How to do this:</text>
        <text x="60" y="260" className="small fill-slate-600 dark:fill-slate-400">1. Cut equal-sized strips (10 cm \u00D7 2 cm) from cotton, silk (or any smooth fabric), and synthetic fabric</text>
        <text x="60" y="275" className="small fill-slate-600 dark:fill-slate-400">2. Mark the original length. Gently pull each strip and measure how far it stretches</text>
        <text x="60" y="290" className="small fill-slate-600 dark:fill-slate-400">3. Release and measure again — did it return to its original length? That is elastic recovery</text>
        <text x="60" y="305" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Silk has moderate stretch and good recovery — this comes from its mix of crystalline and amorphous regions</text>
      </svg>
    </div>
  );
}
