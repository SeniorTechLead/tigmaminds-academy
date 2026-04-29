/**
 * Orographic rainfall diagram — wind hits mountain, rises, cools,
 * rain on windward side, dry rain shadow on leeward side.
 */
export default function OrographicRainDiagram() {
  const totalW = 500;
  const totalH = 240;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-2xl mx-auto my-6" role="img" aria-label="Orographic rainfall: moist air rises over mountain, drops rain, creates dry rain shadow">
      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Orographic Rainfall &amp; Rain Shadow
      </text>

      {/* Sky background gradient hint */}
      <rect x="0" y="22" width={totalW} height="170" rx="8" className="fill-sky-50 dark:fill-sky-900/10" />

      {/* Mountain */}
      <polygon points="130,195 250,70 370,195" className="fill-stone-300 dark:fill-stone-700 stroke-stone-400 dark:stroke-stone-600" strokeWidth="1.5" />
      {/* Snow cap */}
      <polygon points="230,85 250,70 270,85" className="fill-white dark:fill-gray-300" />

      {/* Ground line */}
      <line x1="20" y1="195" x2="480" y2="195" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="1.5" />

      {/* Left ground (green — wet) */}
      <rect x="20" y="195" width="110" height="12" rx="3" className="fill-emerald-300 dark:fill-emerald-800" />
      <text x="75" y="222" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-400" fontSize="8" fontWeight="600">
        Lush vegetation
      </text>

      {/* Right ground (brown — dry) */}
      <rect x="370" y="195" width="110" height="12" rx="3" className="fill-amber-200 dark:fill-amber-900/50" />
      <text x="425" y="222" textAnchor="middle" className="fill-amber-700 dark:fill-amber-400" fontSize="8" fontWeight="600">
        Dry &amp; arid
      </text>

      {/* Wind arrows (left side, going up) */}
      {[
        { x: 40, y: 170, angle: -30 },
        { x: 70, y: 150, angle: -40 },
        { x: 105, y: 130, angle: -50 },
        { x: 145, y: 108, angle: -55 },
      ].map((a, i) => (
        <g key={i} transform={`translate(${a.x}, ${a.y}) rotate(${a.angle})`}>
          <line x1="0" y1="0" x2="25" y2="0" className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="2" />
          <polygon points="25,-3 32,0 25,3" className="fill-sky-400 dark:fill-sky-500" />
        </g>
      ))}

      {/* "Moist air rises" label */}
      <text x="60" y="100" className="fill-sky-600 dark:fill-sky-400" fontSize="9" fontWeight="700"
        transform="rotate(-45, 60, 100)">
        Moist air rises ↗
      </text>

      {/* Clouds on windward side */}
      {[
        { cx: 170, cy: 60 },
        { cx: 200, cy: 50 },
        { cx: 230, cy: 55 },
      ].map((c, i) => (
        <g key={i}>
          <ellipse cx={c.cx} cy={c.cy} rx="25" ry="12" className="fill-gray-300 dark:fill-gray-500" opacity="0.8" />
          <ellipse cx={c.cx - 10} cy={c.cy - 5} rx="15" ry="10" className="fill-gray-200 dark:fill-gray-400" opacity="0.9" />
          <ellipse cx={c.cx + 12} cy={c.cy - 3} rx="14" ry="9" className="fill-gray-200 dark:fill-gray-400" opacity="0.9" />
        </g>
      ))}

      {/* Rain drops (windward side) */}
      {[
        { x: 145, y: 80 }, { x: 155, y: 90 }, { x: 165, y: 75 },
        { x: 175, y: 85 }, { x: 185, y: 95 }, { x: 195, y: 78 },
        { x: 205, y: 88 }, { x: 215, y: 73 }, { x: 160, y: 100 },
        { x: 180, y: 105 }, { x: 200, y: 98 },
      ].map((d, i) => (
        <text key={i} x={d.x} y={d.y} className="fill-sky-500 dark:fill-sky-400" fontSize="8">💧</text>
      ))}

      {/* "Cools & condenses" label */}
      <text x="200" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontWeight="600">
        Air cools → condensation → rain
      </text>

      {/* Dry descending air (right side) */}
      {[
        { x: 340, y: 110, angle: 40 },
        { x: 370, y: 130, angle: 35 },
        { x: 400, y: 150, angle: 25 },
      ].map((a, i) => (
        <g key={i} transform={`translate(${a.x}, ${a.y}) rotate(${a.angle})`}>
          <line x1="0" y1="0" x2="25" y2="0" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
          <polygon points="25,-3 32,0 25,3" className="fill-amber-400 dark:fill-amber-500" />
        </g>
      ))}

      {/* "Dry air descends" label */}
      <text x="420" y="100" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontWeight="700"
        transform="rotate(30, 420, 100)">
        Dry air sinks ↘
      </text>

      {/* Side labels */}
      <text x="75" y="185" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="9" fontWeight="800">
        WINDWARD
      </text>
      <text x="425" y="185" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="9" fontWeight="800">
        RAIN SHADOW
      </text>

      {/* Footer */}
      <text x={totalW / 2} y={totalH - 4} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        Mountains force air upward → cooling → rain on one side, desert on the other
      </text>
    </svg>
  );
}
