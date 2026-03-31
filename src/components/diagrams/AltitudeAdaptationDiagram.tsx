export default function AltitudeAdaptationDiagram() {
  const panelW = 440;
  const panelH = 90;
  const gap = 12;
  const leftPad = 100;
  const topPad = 35;

  const panels = [
    {
      alt: "Sea level",
      y: topPad + (panelH + gap) * 2,
      o2: "100%",
      color: "fill-green-400",
      bgClass: "fill-green-900/30",
      label: "Normal oxygen, easy breathing",
      lungColor: "fill-green-400/80",
      warning: false,
    },
    {
      alt: "3 500 m",
      y: topPad + (panelH + gap) * 1,
      o2: "70%",
      color: "fill-amber-400",
      bgClass: "fill-amber-900/20",
      label: "70% oxygen — body makes more red blood cells",
      lungColor: "fill-amber-400/70",
      warning: false,
    },
    {
      alt: "5 500 m",
      y: topPad,
      o2: "50%",
      color: "fill-red-400",
      bgClass: "fill-red-900/25",
      label: "50% oxygen — danger zone without acclimatization",
      lungColor: "fill-red-400/70",
      warning: true,
    },
  ];

  const totalH = topPad + 3 * panelH + 2 * gap + 60;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox={`0 0 580 ${totalH}`}
        className="w-full"
        role="img"
        aria-label="Three altitude panels showing how bodies adapt to thin air from sea level to 5500 metres"
      >
        <rect x="0" y="0" width="580" height={totalH} className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="290" y="22" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          How Your Body Adapts to Altitude
        </text>

        {/* Vertical arrow — altitude sickness risk */}
        <defs>
          <marker id="arrowUp" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
            <path d="M0,6 L4,0 L8,6" className="fill-red-400" />
          </marker>
        </defs>
        <line
          x1={leftPad / 2}
          y1={panels[0].y + panelH - 5}
          x2={leftPad / 2}
          y2={panels[2].y + 10}
          className="stroke-red-400"
          strokeWidth="2"
          markerEnd="url(#arrowUp)"
        />
        <text
          x={leftPad / 2}
          y={(panels[0].y + panels[2].y + panelH) / 2}
          textAnchor="middle"
          fontSize="8"
          className="fill-red-300"
          fontWeight="600"
          transform={`rotate(-90,${leftPad / 2},${(panels[0].y + panels[2].y + panelH) / 2})`}
        >
          Altitude sickness risk increases
        </text>

        {/* Panels */}
        {panels.map((p, i) => (
          <g key={i}>
            {/* Background */}
            <rect x={leftPad} y={p.y} width={panelW} height={panelH} rx="6" className={p.bgClass} />
            <rect x={leftPad} y={p.y} width={panelW} height={panelH} rx="6" fill="none" className="stroke-gray-600" strokeWidth="1" />

            {/* Altitude label */}
            <text x={leftPad + 12} y={p.y + 18} fontSize="11" className={p.color} fontWeight="700">
              {p.alt}
            </text>

            {/* Lung icon */}
            <g transform={`translate(${leftPad + 60}, ${p.y + 45})`}>
              {/* Left lung */}
              <ellipse cx="-10" cy="0" rx="10" ry="16" className={p.lungColor} opacity="0.8" />
              {/* Right lung */}
              <ellipse cx="10" cy="0" rx="10" ry="16" className={p.lungColor} opacity="0.8" />
              {/* Trachea */}
              <rect x="-2" y="-22" width="4" height="10" rx="1" className={p.lungColor} />
              {/* Warning triangle for danger zone */}
              {p.warning && (
                <g transform="translate(24, -12)">
                  <polygon points="0,-8 7,6 -7,6" className="fill-red-500" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9" className="fill-white" fontWeight="900">!</text>
                </g>
              )}
            </g>

            {/* O2 percentage */}
            <text x={leftPad + 110} y={p.y + 35} fontSize="18" className={p.color} fontWeight="800">
              {p.o2}
            </text>
            <text x={leftPad + 110} y={p.y + 48} fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              oxygen available
            </text>

            {/* Description */}
            <text x={leftPad + 175} y={p.y + 42} fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="500">
              {p.label}
            </text>
          </g>
        ))}

        {/* Snow leopard paw + note at 5000m */}
        <g transform={`translate(${leftPad + panelW - 120}, ${panels[2].y + panelH - 14})`}>
          {/* Paw print */}
          <circle cx="0" cy="0" r="3" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="-5" cy="-5" r="2" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="0" cy="-7" r="2" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="5" cy="-5" r="2" className="fill-gray-500 dark:fill-gray-400" />
          <text x="10" y="3" fontSize="7.5" className="fill-gray-600 dark:fill-gray-300" fontStyle="italic">
            Snow leopards adapted over millions of years
          </text>
        </g>
      </svg>
    </div>
  );
}
