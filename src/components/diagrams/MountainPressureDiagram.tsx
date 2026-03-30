export default function MountainPressureDiagram() {
  const left = 80;
  const right = 540;
  const top = 40;
  const bottom = 360;
  const maxAlt = 9000;

  const altY = (m: number) => bottom - (m / maxAlt) * (bottom - top);

  /* Pressure markers */
  const markers = [
    { alt: 0, pressure: 1013, label: "Sea level", dots: 40 },
    { alt: 3500, pressure: 650, label: "3 500 m", dots: 26 },
    { alt: 5500, pressure: 500, label: "5 500 m", dots: 18 },
    { alt: 8849, pressure: 335, label: "Everest 8 849 m", dots: 10 },
  ];

  /* Air column width at each level */
  const colLeft = left + 40;
  const colW = 120;

  /* Random-ish dot positions for air column */
  const seededDots = (count: number, yStart: number, yEnd: number) => {
    const dots: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = colLeft + 10 + ((i * 37 + i * i * 3) % (colW - 20));
      const y = yStart + ((i * 53 + i * 7) % Math.max(1, Math.abs(yEnd - yStart)));
      dots.push({ x, y: Math.min(y, yEnd) });
    }
    return dots;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 609 430"
        className="w-full"
        role="img"
        aria-label="Diagram showing atmospheric pressure decreasing with altitude from 1013 hPa at sea level to 335 hPa at Everest"
      >
        <rect x="0" y="0" width="580" height="410" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="290" y="24" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Atmospheric Pressure vs Altitude
        </text>

        {/* Y-axis */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        <text
          x={16}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-300"
          fontWeight="600"
          transform={`rotate(-90,16,${(top + bottom) / 2})`}
        >
          Altitude
        </text>

        {/* Air column background — gradient getting thinner */}
        <defs>
          <linearGradient id="airColGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect x={colLeft} y={top} width={colW} height={bottom - top} rx="4" fill="url(#airColGrad)" />
        <rect x={colLeft} y={top} width={colW} height={bottom - top} rx="4" fill="none" className="stroke-blue-400/40" strokeWidth="1" />

        {/* Air molecule dots — denser at bottom */}
        {markers.map((m, i) => {
          const yStart = altY(m.alt);
          const yEnd = i > 0 ? altY(markers[i - 1].alt) : bottom;
          const dots = seededDots(m.dots, Math.min(yStart, yEnd), Math.max(yStart, yEnd));
          return dots.map((d, j) => (
            <circle
              key={`${i}-${j}`}
              cx={d.x}
              cy={d.y}
              r="1.5"
              className="fill-blue-300"
              opacity={0.3 + (1 - d.y / bottom) * 0.5}
            />
          ));
        })}

        {/* Pressure markers with lines */}
        {markers.map((m, i) => (
          <g key={i}>
            {/* Horizontal dashed line */}
            <line
              x1={left}
              y1={altY(m.alt)}
              x2={right}
              y2={altY(m.alt)}
              className="stroke-gray-600"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
            {/* Altitude label left */}
            <text
              x={left - 6}
              y={altY(m.alt) + 3}
              textAnchor="end"
              fontSize="8"
              className="fill-gray-300"
            >
              {m.label}
            </text>
            {/* Pressure value right */}
            <rect
              x={colLeft + colW + 20}
              y={altY(m.alt) - 10}
              width="80"
              height="18"
              rx="3"
              className="fill-blue-900/50"
            />
            <text
              x={colLeft + colW + 60}
              y={altY(m.alt) + 3}
              textAnchor="middle"
              fontSize="10"
              className="fill-blue-300"
              fontWeight="700"
            >
              {m.pressure} hPa
            </text>
          </g>
        ))}

        {/* Ear pop icon at ~2000m */}
        <g transform={`translate(${colLeft + colW + 140}, ${altY(2000)})`}>
          {/* Ear shape */}
          <path d="M0,-10 Q10,-10 10,0 Q10,8 4,12 Q2,10 4,8 Q8,4 8,0 Q8,-6 0,-8" fill="none" className="stroke-amber-400" strokeWidth="1.5" />
          {/* Sound waves */}
          <path d="M-4,-4 Q-8,-4 -8,0 Q-8,4 -4,4" fill="none" className="stroke-amber-300" strokeWidth="1" />
          <path d="M-8,-6 Q-14,-6 -14,0 Q-14,6 -8,6" fill="none" className="stroke-amber-300/60" strokeWidth="1" />
          <text x="-16" y="24" textAnchor="start" fontSize="7.5" className="fill-amber-300" fontWeight="600">
            Ears pop!
          </text>
          <text x="-16" y="34" fontSize="7" className="fill-gray-400">
            Pressure changes quickly
          </text>
        </g>

        {/* Down arrow showing weight */}
        <defs>
          <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
            <path d="M0,0 L4,6 L8,0" className="fill-gray-400" />
          </marker>
        </defs>
        <line
          x1={colLeft + colW / 2}
          y1={top + 5}
          x2={colLeft + colW / 2}
          y2={bottom - 5}
          className="stroke-gray-400"
          strokeWidth="1.5"
          markerEnd="url(#arrowDown)"
          strokeDasharray="6 3"
        />
        <text
          x={colLeft + colW / 2}
          y={top + 20}
          textAnchor="middle"
          fontSize="7"
          className="fill-gray-400"
        >
          Weight of air
        </text>

        {/* Insight bar */}
        <rect x={left - 10} y={bottom + 14} width="490" height="24" rx="4" className="fill-slate-800" />
        <text x={left} y={bottom + 30} fontSize="9" className="fill-gray-300" fontWeight="600">
          Less air above you = less weight pushing down = lower pressure
        </text>
      </svg>
    </div>
  );
}
