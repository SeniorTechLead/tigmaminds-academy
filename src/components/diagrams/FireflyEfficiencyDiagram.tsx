export default function FireflyEfficiencyDiagram() {
  const w = 520, h = 380;

  const sources = [
    { label: 'Incandescent', pct: 5, color: '#ef4444', icon: 'bulb' },
    { label: 'Fluorescent', pct: 20, color: '#f59e0b', icon: 'tube' },
    { label: 'LED', pct: 50, color: '#60a5fa', icon: 'led' },
    { label: 'Firefly', pct: 98, color: '#4ade80', icon: 'firefly' },
  ];

  const barStartX = 170;
  const barMaxW = 280;
  const barH = 36;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Energy efficiency comparison: incandescent 5%, fluorescent 20%, LED 50%, firefly 98%">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Energy Efficiency: Light vs Heat</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Nature's 400-million-year head start</text>

        {/* Subtitle */}
        <text x={w / 2} y="68" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">% of energy converted to visible light (not wasted as heat)</text>

        {sources.map((src, i) => {
          const y = 90 + i * 60;
          const barW = (src.pct / 100) * barMaxW;
          return (
            <g key={i}>
              {/* Icon */}
              {src.icon === 'bulb' && (
                <g>
                  <circle cx="30" cy={y + barH / 2} r="12" fill="none" stroke={src.color} strokeWidth="1.5" />
                  <path d={`M24,${y + barH / 2 + 2} Q30,${y + barH / 2 - 10} 36,${y + barH / 2 + 2}`} fill="none" stroke={src.color} strokeWidth="1" />
                  <line x1="27" y1={y + barH / 2 + 8} x2="33" y2={y + barH / 2 + 8} stroke={src.color} strokeWidth="1" />
                </g>
              )}
              {src.icon === 'tube' && (
                <rect x="18" y={y + barH / 2 - 6} width="24" height="12" rx="6" fill="none" stroke={src.color} strokeWidth="1.5" />
              )}
              {src.icon === 'led' && (
                <g>
                  <polygon points={`24,${y + barH / 2 - 8} 36,${y + barH / 2 - 8} 30,${y + barH / 2 + 6}`} fill="none" stroke={src.color} strokeWidth="1.5" />
                  <line x1="24" y1={y + barH / 2 + 6} x2="36" y2={y + barH / 2 + 6} stroke={src.color} strokeWidth="1.5" />
                </g>
              )}
              {src.icon === 'firefly' && (
                <g>
                  <circle cx="30" cy={y + barH / 2} r="8" fill={src.color} opacity="0.15" />
                  <circle cx="30" cy={y + barH / 2} r="4" fill={src.color} opacity="0.6" />
                  <circle cx="30" cy={y + barH / 2} r="12" fill={src.color} opacity="0.06" />
                </g>
              )}

              {/* Label */}
              <text x="55" y={y + barH / 2 + 4} fill={src.color} fontSize="11" fontWeight="600">{src.label}</text>

              {/* Bar background */}
              <rect x={barStartX} y={y} width={barMaxW} height={barH} rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="0.5" />

              {/* Bar fill */}
              <rect x={barStartX} y={y} width={barW} height={barH} rx="5" fill={src.color} opacity="0.3" />
              <rect x={barStartX} y={y} width={barW} height={barH} rx="5" fill="none" stroke={src.color} strokeWidth="1" />

              {/* Percentage */}
              <text x={barStartX + barW + 8} y={y + barH / 2 + 5} fill={src.color} fontSize="13" fontWeight="700">{src.pct}%</text>

              {/* Heat waste indicator */}
              {src.pct < 90 && (
                <text x={barStartX + barMaxW - 5} y={y + barH / 2 + 4} textAnchor="end" fill="#ef4444" fontSize="8" opacity="0.6">
                  {100 - src.pct}% wasted as heat
                </text>
              )}
            </g>
          );
        })}

        {/* Divider */}
        <line x1="30" y1="325" x2={w - 30} y2="325" stroke="#334155" strokeWidth="0.5" />

        {/* Explanation */}
        <rect x="40" y="335" width="440" height="35" rx="6" className="fill-white dark:fill-slate-950" stroke="#4ade80" strokeWidth="1" />
        <text x={w / 2} y="352" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="600">Firefly light is "cold light" — almost zero heat</text>
        <text x={w / 2} y="365" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">The chemical reaction (bioluminescence) converts energy to photons, not thermal vibration</text>
      </svg>
    </div>
  );
}
