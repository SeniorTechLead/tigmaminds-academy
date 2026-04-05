const StarCompassDiagram = () => {
  const stars = [
    { name: 'Polaris', angle: 0, color: '#facc15' },
    { name: 'Arcturus', angle: 63, color: '#fb923c' },
    { name: 'Vega', angle: 80, color: '#60a5fa' },
    { name: 'Sirius', angle: 110, color: '#f472b6' },
    { name: 'Canopus', angle: 160, color: '#a78bfa' },
    { name: 'Acrux', angle: 180, color: '#34d399' },
    { name: 'Antares', angle: 245, color: '#ef4444' },
    { name: 'Altair', angle: 290, color: '#38bdf8' },
  ];

  const cx = 210;
  const cy = 170;
  const r = 120;

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 420 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Star compass diagram showing star rising and setting positions around the horizon circle"
      >
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .twinkle { animation: twinkle 2.5s ease-in-out infinite; }
          .twinkle-delay { animation: twinkle 2.5s ease-in-out 0.8s infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="420" height="360" rx="8"
          className="fill-slate-950 stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text" fill="#e2e8f0">
          Star Compass — Horizon Bearings
        </text>

        {/* Horizon circle */}
        <circle cx={cx} cy={cy} r={r}
          fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* Compass directions */}
        <text x={cx} y={cy - r - 8} textAnchor="middle"
          className="label-text" fill="#94a3b8" fontWeight="600">N (0°)</text>
        <text x={cx + r + 12} y={cy + 4} textAnchor="start"
          className="label-text" fill="#94a3b8" fontWeight="600">E (90°)</text>
        <text x={cx} y={cy + r + 16} textAnchor="middle"
          className="label-text" fill="#94a3b8" fontWeight="600">S (180°)</text>
        <text x={cx - r - 12} y={cy + 4} textAnchor="end"
          className="label-text" fill="#94a3b8" fontWeight="600">W (270°)</text>

        {/* Cross lines */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r}
          stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy}
          stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Observer at center */}
        <circle cx={cx} cy={cy} r="5" fill="#94a3b8" />
        <text x={cx} y={cy + 18} textAnchor="middle"
          className="label-text" fill="#94a3b8" style={{ fontSize: '9px' }}>
          Observer
        </text>

        {/* Star positions on horizon */}
        {stars.map((star, i) => {
          const rad = ((star.angle - 90) * Math.PI) / 180;
          const sx = cx + r * Math.cos(rad);
          const sy = cy + r * Math.sin(rad);
          const lx = cx + (r + 28) * Math.cos(rad);
          const ly = cy + (r + 28) * Math.sin(rad);
          return (
            <g key={star.name}>
              {/* Star dot */}
              <circle cx={sx} cy={sy} r="4" fill={star.color}
                className={i % 2 === 0 ? 'twinkle' : 'twinkle-delay'} />
              {/* Line from center to star */}
              <line x1={cx} y1={cy} x2={sx} y2={sy}
                stroke={star.color} strokeWidth="0.7" opacity="0.4" strokeDasharray="3 3" />
              {/* Label */}
              <text x={lx} y={ly + 4} textAnchor="middle"
                fill={star.color} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '9px' }}>
                {star.name} ({star.angle}°)
              </text>
            </g>
          );
        })}

        {/* Bottom note */}
        <text x="210" y="335" textAnchor="middle"
          className="label-text" fill="#94a3b8" style={{ fontStyle: 'italic' }}>
          Each star rises and sets at a fixed bearing — a natural compass
        </text>
        <text x="210" y="350" textAnchor="middle"
          className="label-text" fill="#64748b" style={{ fontSize: '9px' }}>
          Polynesian navigators memorised ~200 star positions
        </text>
      </svg>
    </div>
  );
};

export default StarCompassDiagram;
