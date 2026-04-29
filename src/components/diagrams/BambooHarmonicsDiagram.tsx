export default function BambooHarmonicsDiagram() {
  // Generate sine wave path
  const wave = (n: number, x0: number, y0: number, w: number, h: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = x0 + (i / 100) * w;
      const y = y0 + Math.sin((i / 100) * Math.PI * n) * h;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const harmonics = [
    { n: 1, label: '1st Harmonic', sub: 'Fundamental', freq: 'f₁ = v / 2L', hz: '343 Hz', color: '#ef4444' },
    { n: 2, label: '2nd Harmonic', sub: '1st Overtone', freq: 'f₂ = 2 × f₁', hz: '686 Hz', color: '#f59e0b' },
    { n: 3, label: '3rd Harmonic', sub: '2nd Overtone', freq: 'f₃ = 3 × f₁', hz: '1029 Hz', color: '#22c55e' },
    { n: 4, label: '4th Harmonic', sub: '3rd Overtone', freq: 'f₄ = 4 × f₁', hz: '1372 Hz', color: '#3b82f6' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Standing wave patterns in a bamboo tube showing first four harmonics"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9px; }
          .formula { font-family: system-ui, sans-serif; font-size: 10px; font-style: italic; }
        `}</style>

        <rect width="600" height="480" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Standing Waves in a Bamboo Tube (Open-Open, L = 50 cm)
        </text>

        {harmonics.map((h, i) => {
          const y0 = 70 + i * 100;
          const tubeX = 140;
          const tubeW = 340;

          return (
            <g key={i}>
              {/* Labels */}
              <text x="20" y={y0 + 5} className="label" fill={h.color} fontWeight="600">{h.label}</text>
              <text x="20" y={y0 + 18} className="small fill-gray-500 dark:fill-slate-400">{h.sub}</text>
              <text x="20" y={y0 + 31} className="formula" fill={h.color}>{h.freq}</text>
              <text x="20" y={y0 + 44} className="small fill-gray-400 dark:fill-slate-500">= {h.hz}</text>

              {/* Tube walls */}
              <rect x={tubeX} y={y0 - 30} width={tubeW} height="60" rx="4" fill="none" stroke="#a3a3a3" strokeWidth="1.5" className="dark:stroke-slate-600" />

              {/* Bamboo texture hint */}
              <rect x={tubeX} y={y0 - 30} width={tubeW} height="60" rx="4" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.3" />

              {/* Standing wave */}
              <path d={wave(h.n, tubeX, y0, tubeW, 22)} fill="none" stroke={h.color} strokeWidth="2.5" />

              {/* Nodes (dots where wave crosses zero) */}
              {Array.from({ length: h.n + 1 }, (_, j) => {
                const nx = tubeX + (j / h.n) * tubeW;
                return (
                  <g key={j}>
                    <circle cx={nx} cy={y0} r="4" fill={h.color} opacity="0.8" />
                    {j === 0 && <text x={nx} y={y0 + 42} textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">N</text>}
                    {j === h.n && <text x={nx} y={y0 + 42} textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">N</text>}
                  </g>
                );
              })}

              {/* Antinode labels */}
              {Array.from({ length: h.n }, (_, j) => {
                const ax = tubeX + ((j + 0.5) / h.n) * tubeW;
                return (
                  <text key={j} x={ax} y={y0 + 42} textAnchor="middle" className="small fill-gray-400 dark:fill-slate-500">A</text>
                );
              })}

              {/* Frequency on right */}
              <text x="510" y={y0 + 5} textAnchor="start" className="label" fill={h.color} fontWeight="600">{h.hz}</text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x="120" y="440" width="360" height="30" rx="6" className="fill-slate-50 dark:fill-slate-900" stroke="#64748b" strokeWidth="1" />
        <circle cx="155" cy="455" r="4" fill="#6b7280" />
        <text x="165" y="459" className="small fill-gray-600 dark:fill-slate-400">N = Node (no vibration)</text>
        <text x="310" y="459" className="small fill-gray-600 dark:fill-slate-400">A = Antinode (max vibration)</text>
        <text x="450" y="459" className="small fill-gray-500 dark:fill-slate-400">v = 343 m/s</text>
      </svg>
    </div>
  );
}
