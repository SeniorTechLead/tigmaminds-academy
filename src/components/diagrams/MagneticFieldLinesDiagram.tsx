export default function MagneticFieldLinesDiagram() {
  // Field line curves from N pole (right) to S pole (left) outside the magnet
  // Each line defined by a vertical offset that controls the curve's spread
  const fieldLines = [
    { dy: 18, spread: 40 },
    { dy: 38, spread: 75 },
    { dy: 60, spread: 110 },
    { dy: 85, spread: 145 },
  ];

  const cx = 250, cy = 150;
  const magnetW = 120, magnetH = 40;
  const nLeft = cx, nRight = cx + magnetW / 2;
  const sLeft = cx - magnetW / 2, sRight = cx;

  // Build symmetric field line paths (top and bottom for each offset)
  const buildPath = (dy: number, spread: number, top: boolean) => {
    const sign = top ? -1 : 1;
    // Start at N pole edge, curve outward, arrive at S pole edge
    const startX = nRight - 5;
    const endX = sLeft + 5;
    const startY = cy + sign * (dy * 0.3);
    const endY = cy + sign * (dy * 0.3);
    const cp1x = cx + magnetW * 0.8;
    const cp1y = cy + sign * spread;
    const cp2x = cx - magnetW * 0.8;
    const cp2y = cy + sign * spread;
    return `M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
  };

  // Arrowhead at midpoint of a cubic bezier
  const midpointAndAngle = (dy: number, spread: number, top: boolean) => {
    const sign = top ? -1 : 1;
    const startX = nRight - 5;
    const endX = sLeft + 5;
    const startY = cy + sign * (dy * 0.3);
    const endY = cy + sign * (dy * 0.3);
    const cp1x = cx + magnetW * 0.8;
    const cp1y = cy + sign * spread;
    const cp2x = cx - magnetW * 0.8;
    const cp2y = cy + sign * spread;

    // Evaluate cubic bezier at t=0.5
    const t = 0.5;
    const mt = 1 - t;
    const mx = mt * mt * mt * startX + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * endX;
    const my = mt * mt * mt * startY + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * endY;

    // Tangent at t=0.5
    const tx = 3 * mt * mt * (cp1x - startX) + 6 * mt * t * (cp2x - cp1x) + 3 * t * t * (endX - cp2x);
    const ty = 3 * mt * mt * (cp1y - startY) + 6 * mt * t * (cp2y - cp1y) + 3 * t * t * (endY - cp2y);
    const angle = Math.atan2(ty, tx) * (180 / Math.PI);

    return { mx, my, angle };
  };

  return (
    <div className="my-4">
      <svg viewBox="0 0 525 338" className="w-full max-w-lg mx-auto" role="img" aria-label="Magnetic field lines around a bar magnet">
        {/* Title */}
        <text x="250" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="700">
          Magnetic Field Lines
        </text>

        {/* Bar magnet body */}
        {/* N pole (red) */}
        <rect x={cx} y={cy - magnetH / 2} width={magnetW / 2} height={magnetH} rx="3" className="fill-red-500 dark:fill-red-600" />
        <text x={cx + magnetW / 4} y={cy + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="700">N</text>

        {/* S pole (blue) */}
        <rect x={sLeft} y={cy - magnetH / 2} width={magnetW / 2} height={magnetH} rx="3" className="fill-blue-500 dark:fill-blue-600" />
        <text x={cx - magnetW / 4} y={cy + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="700">S</text>

        {/* Internal arrow inside the magnet (S to N inside) */}
        <line x1={sLeft + 15} y1={cy} x2={nRight - 15} y2={cy} stroke="white" strokeWidth="1.5" opacity="0.5" />
        <polygon
          points={`${nRight - 15},${cy - 4} ${nRight - 8},${cy} ${nRight - 15},${cy + 4}`}
          fill="white" opacity="0.5"
        />

        {/* Field lines — top and bottom */}
        {fieldLines.map(({ dy, spread }, i) => (
          <g key={i}>
            {[true, false].map(top => {
              const path = buildPath(dy, spread, top);
              const { mx, my, angle } = midpointAndAngle(dy, spread, top);
              return (
                <g key={top ? 'top' : 'bot'}>
                  <path d={path} fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
                  {/* Arrowhead at midpoint showing direction (N→S externally = right to left at top) */}
                  <polygon
                    points="-5,-3 0,0 -5,3"
                    className="fill-gray-500 dark:fill-gray-400"
                    transform={`translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${angle.toFixed(1)})`}
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* Pole labels outside magnet */}
        <text x={nRight + 12} y={cy + 4} className="fill-red-600 dark:fill-red-400" fontSize="11" fontWeight="600">North</text>
        <text x={sLeft - 38} y={cy + 4} className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontWeight="600">South</text>

        {/* Note */}
        <text x="250" y="288" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Field lines go from N to S outside the magnet — they never cross
        </text>
      </svg>
    </div>
  );
}
