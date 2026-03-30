export default function FluteOvertonesDiagram() {
  const instruments = [
    {
      name: 'Bamboo Flute',
      color: '#22c55e',
      darkColor: '#4ade80',
      harmonics: [1.0, 0.3, 0.08, 0.02, 0.01, 0.005],
      desc: 'Mostly fundamental \u2014 warm, pure tone',
    },
    {
      name: 'Trumpet',
      color: '#f59e0b',
      darkColor: '#fbbf24',
      harmonics: [1.0, 0.9, 0.75, 0.55, 0.4, 0.25],
      desc: 'Strong harmonics \u2014 bright, brassy tone',
    },
    {
      name: 'Clarinet',
      color: '#8b5cf6',
      darkColor: '#a78bfa',
      harmonics: [1.0, 0.05, 0.6, 0.04, 0.35, 0.03],
      desc: 'Odd harmonics only \u2014 hollow, woody tone',
    },
  ];

  const barW = 24;
  const maxH = 80;
  const baseY = 130;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 540"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Harmonic profiles of three instruments: bamboo flute with mostly fundamental, trumpet with many strong harmonics, and clarinet with only odd harmonics"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .instName { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .harmLabel { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="600" height="540" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Overtones: Why Instruments Sound Different
        </text>
        <text x="300" y="48" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          Same note (262 Hz, C\u2084) \u2014 different harmonic profiles create different timbres
        </text>

        {instruments.map((inst, idx) => {
          const yOffset = idx * 160 + 70;
          return (
            <g key={inst.name} transform={`translate(0, ${yOffset})`}>
              {/* Background */}
              <rect x="30" y="0" width="540" height="145" rx="6" className="fill-slate-50 dark:fill-slate-900/50" />

              {/* Instrument name */}
              <text x="50" y="20" className="instName" fill={inst.color}>
                <tspan className="dark:hidden">{inst.name}</tspan>
              </text>
              <text x="50" y="20" className="instName" fill={inst.darkColor}>
                <tspan className="hidden dark:inline">{inst.name}</tspan>
              </text>
              <text x="50" y="35" className="small fill-gray-500 dark:fill-slate-400">{inst.desc}</text>

              {/* Harmonic bars */}
              {inst.harmonics.map((h, i) => {
                const bx = 80 + i * 80;
                const bh = h * maxH;
                return (
                  <g key={i}>
                    <rect
                      x={bx}
                      y={baseY - bh}
                      width={barW}
                      height={bh}
                      rx="3"
                      fill={inst.color}
                      opacity={0.7 + h * 0.3}
                    />
                    {/* Harmonic number */}
                    <text x={bx + barW / 2} y={baseY + 14} textAnchor="middle" className="harmLabel fill-gray-600 dark:fill-slate-400">
                      {i === 0 ? 'f\u2081' : `${i + 1}f\u2081`}
                    </text>
                    {/* Percentage */}
                    <text x={bx + barW / 2} y={baseY - bh - 4} textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
                      {Math.round(h * 100)}%
                    </text>
                  </g>
                );
              })}

              {/* Axis line */}
              <line x1="70" y1={baseY} x2="560" y2={baseY} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            </g>
          );
        })}

        {/* Key insight */}
        <rect x="60" y="495" width="480" height="35" rx="6" className="fill-amber-50 dark:fill-amber-900/20" stroke="#f59e0b" strokeWidth="1" />
        <text x="300" y="517" textAnchor="middle" className="label fill-amber-800 dark:fill-amber-300">
          Timbre = the unique mixture of harmonics. Same pitch, completely different sound.
        </text>
      </svg>
    </div>
  );
}
