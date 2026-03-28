export default function MapProjectionDiagram() {
  /* Three panels side by side, each ~160 wide with 30px gaps */
  const panelW = 160;
  const gap = 30;
  const panelY = 20;
  const panelH = 150;

  const panels = [
    { x: 10, label: "Mercator", sub: "Shape preserved, area distorted" },
    { x: 10 + panelW + gap, label: "Peters (Equal-area)", sub: "Area accurate, shape stretched" },
    { x: 10 + 2 * (panelW + gap), label: "Globe", sub: "How Earth actually looks" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <svg
        viewBox="0 0 540 220"
        className="w-full"
        role="img"
        aria-label="Three map projections compared: Mercator, Peters Equal-area, and Globe"
      >
        {/* Background */}
        <rect x="0" y="0" width="540" height="220" rx="6" className="fill-gray-50 dark:fill-gray-800" />

        {/* Title */}
        <text x="270" y="15" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-gray-100" fontFamily="sans-serif">
          Map Projections Compared
        </text>

        {/* ── Panel 1: Mercator ── */}
        <g>
          <rect x={panels[0].x} y={panelY} width={panelW} height={panelH} rx="4" className="fill-blue-100 dark:fill-blue-900/40 stroke-gray-400 dark:stroke-gray-600" strokeWidth="1" />
          {/* Greenland exaggerated — large blob near top */}
          <ellipse cx={panels[0].x + 65} cy={panelY + 28} rx="32" ry="18" className="fill-green-300 dark:fill-green-600" />
          <text x={panels[0].x + 65} y={panelY + 32} textAnchor="middle" fontSize="10" className="fill-green-900 dark:fill-green-200" fontFamily="sans-serif">Greenland</text>
          {/* Africa — similar size to Greenland (wrong!) */}
          <ellipse cx={panels[0].x + 90} cy={panelY + 80} rx="24" ry="30" className="fill-amber-300 dark:fill-amber-600" />
          <text x={panels[0].x + 90} y={panelY + 84} textAnchor="middle" fontSize="10" className="fill-amber-900 dark:fill-amber-200" fontFamily="sans-serif">Africa</text>
          {/* South America */}
          <ellipse cx={panels[0].x + 45} cy={panelY + 90} rx="18" ry="28" className="fill-yellow-200 dark:fill-yellow-700" />
          <text x={panels[0].x + 45} y={panelY + 94} textAnchor="middle" fontSize="10" className="fill-yellow-900 dark:fill-yellow-200" fontFamily="sans-serif">S.Am</text>
          {/* Equator line */}
          <line x1={panels[0].x} y1={panelY + 65} x2={panels[0].x + panelW} y2={panelY + 65} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="0.7" strokeDasharray="3 2" />
          <text x={panels[0].x + panelW - 4} y={panelY + 63} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-gray-400" fontFamily="sans-serif">Equator</text>
          {/* Warning */}
          <text x={panels[0].x + panelW / 2} y={panelY + panelH - 8} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400" fontFamily="sans-serif">
            Greenland looks huge!
          </text>
        </g>

        {/* ── Panel 2: Peters / Equal-area ── */}
        <g>
          <rect x={panels[1].x} y={panelY} width={panelW} height={panelH} rx="4" className="fill-blue-100 dark:fill-blue-900/40 stroke-gray-400 dark:stroke-gray-600" strokeWidth="1" />
          {/* Greenland — small and squished */}
          <ellipse cx={panels[1].x + 65} cy={panelY + 22} rx="14" ry="8" className="fill-green-300 dark:fill-green-600" />
          <text x={panels[1].x + 65} y={panelY + 26} textAnchor="middle" fontSize="10" className="fill-green-900 dark:fill-green-200" fontFamily="sans-serif">Greenland</text>
          {/* Africa — much larger (correct!) */}
          <ellipse cx={panels[1].x + 90} cy={panelY + 80} rx="22" ry="42" className="fill-amber-300 dark:fill-amber-600" />
          <text x={panels[1].x + 90} y={panelY + 84} textAnchor="middle" fontSize="10" className="fill-amber-900 dark:fill-amber-200" fontFamily="sans-serif">Africa</text>
          {/* South America — tall, skinny */}
          <ellipse cx={panels[1].x + 45} cy={panelY + 85} rx="15" ry="40" className="fill-yellow-200 dark:fill-yellow-700" />
          <text x={panels[1].x + 45} y={panelY + 89} textAnchor="middle" fontSize="10" className="fill-yellow-900 dark:fill-yellow-200" fontFamily="sans-serif">S.Am</text>
          {/* Equator */}
          <line x1={panels[1].x} y1={panelY + 55} x2={panels[1].x + panelW} y2={panelY + 55} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="0.7" strokeDasharray="3 2" />
          <text x={panels[1].x + panelW - 4} y={panelY + 53} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-gray-400" fontFamily="sans-serif">Equator</text>
          {/* Note */}
          <text x={panels[1].x + panelW / 2} y={panelY + panelH - 8} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-400" fontFamily="sans-serif">
            Areas are accurate
          </text>
        </g>

        {/* ── Panel 3: Globe ── */}
        <g>
          {/* Circle for globe */}
          <circle cx={panels[2].x + panelW / 2} cy={panelY + panelH / 2} r={panelH / 2 - 4} className="fill-blue-200 dark:fill-blue-800 stroke-gray-400 dark:stroke-gray-600" strokeWidth="1.2" />
          {/* Greenland — correct small size */}
          <ellipse cx={panels[2].x + 65} cy={panelY + 30} rx="12" ry="9" className="fill-green-300 dark:fill-green-600" />
          <text x={panels[2].x + 65} y={panelY + 34} textAnchor="middle" fontSize="10" className="fill-green-900 dark:fill-green-200" fontFamily="sans-serif">Grnld</text>
          {/* Africa — large */}
          <ellipse cx={panels[2].x + 90} cy={panelY + 78} rx="20" ry="28" className="fill-amber-300 dark:fill-amber-600" />
          <text x={panels[2].x + 90} y={panelY + 82} textAnchor="middle" fontSize="10" className="fill-amber-900 dark:fill-amber-200" fontFamily="sans-serif">Africa</text>
          {/* South America */}
          <ellipse cx={panels[2].x + 50} cy={panelY + 90} rx="16" ry="24" className="fill-yellow-200 dark:fill-yellow-700" />
          <text x={panels[2].x + 50} y={panelY + 94} textAnchor="middle" fontSize="10" className="fill-yellow-900 dark:fill-yellow-200" fontFamily="sans-serif">S.Am</text>
          {/* Equator arc */}
          <ellipse cx={panels[2].x + panelW / 2} cy={panelY + panelH / 2 + 5} rx="67" ry="10" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="0.7" strokeDasharray="3 2" />
          {/* Note */}
          <text x={panels[2].x + panelW / 2} y={panelY + panelH - 8} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-400" fontFamily="sans-serif">
            True shape and area
          </text>
        </g>

        {/* Panel labels */}
        {panels.map((p, i) => (
          <g key={i}>
            <text
              x={p.x + panelW / 2}
              y={panelY + panelH + 18}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              className="fill-gray-800 dark:fill-gray-100"
              fontFamily="sans-serif"
            >
              {p.label}
            </text>
            <text
              x={p.x + panelW / 2}
              y={panelY + panelH + 30}
              textAnchor="middle"
              fontSize="10"
              className="fill-gray-500 dark:fill-gray-400"
              fontFamily="sans-serif"
            >
              {p.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
