export default function VectorAdditionDiagram() {
  const w = 400, h = 350;

  // Origin for the main diagram
  const ox = 60, oy = 270;
  const scale = 28;

  // Vector A: (4, 2), Vector B: (2, 5)
  const A = { x: 4, y: 2 };
  const B = { x: 2, y: 5 };
  const R = { x: A.x + B.x, y: A.y + B.y };

  const toSvg = (vx: number, vy: number, baseX = ox, baseY = oy) => ({
    x: baseX + vx * scale,
    y: baseY - vy * scale,
  });

  const aEnd = toSvg(A.x, A.y);
  const bFromA = toSvg(A.x + B.x, A.y + B.y); // B drawn from tip of A
  const rEnd = toSvg(R.x, R.y);

  // Parallelogram: fourth point is B drawn from origin
  const bFromOrigin = toSvg(B.x, B.y);

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Vector addition: tip-to-tail and parallelogram method">
        <rect width={w} height={h} className="fill-white dark:fill-gray-900" rx="8" />

        <defs>
          <marker id="va-arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
          </marker>
          <marker id="va-arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#22c55e" />
          </marker>
          <marker id="va-arrow-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <path d="M0,0 L10,3.5 L0,7 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Title */}
        <text x={w / 2} y={22} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
          Vector Addition
        </text>

        {/* Light grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={`g-${i}`}>
            <line x1={ox + i * scale} y1={oy - 8 * scale} x2={ox + i * scale} y2={oy} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
            <line x1={ox} y1={oy - i * scale} x2={ox + 8 * scale} y2={oy - i * scale} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={ox} y1={oy} x2={ox + 8 * scale} y2={oy} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1={ox} y1={oy} x2={ox} y2={oy - 8 * scale} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />

        {/* Parallelogram dashed lines */}
        <line x1={aEnd.x} y1={aEnd.y} x2={rEnd.x} y2={rEnd.y}
          stroke="#22c55e" strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />
        <line x1={bFromOrigin.x} y1={bFromOrigin.y} x2={rEnd.x} y2={rEnd.y}
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />

        {/* Vector B from origin (parallelogram method, dashed) */}
        <line x1={ox} y1={oy} x2={bFromOrigin.x} y2={bFromOrigin.y}
          stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />

        {/* Vector A (from origin) */}
        <line x1={ox} y1={oy} x2={aEnd.x} y2={aEnd.y}
          stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#va-arrow-blue)" />

        {/* Vector B (tip-to-tail, from end of A) */}
        <line x1={aEnd.x} y1={aEnd.y} x2={bFromA.x} y2={bFromA.y}
          stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#va-arrow-green)" />

        {/* Resultant R (from origin to end of B) */}
        <line x1={ox} y1={oy} x2={rEnd.x} y2={rEnd.y}
          stroke="#ef4444" strokeWidth="3" markerEnd="url(#va-arrow-red)" />

        {/* Vector labels */}
        <text x={(ox + aEnd.x) / 2} y={(oy + aEnd.y) / 2 + 18} fontSize="13" fontWeight="700" fill="#3b82f6" textAnchor="middle">A</text>
        <text x={(aEnd.x + bFromA.x) / 2 + 14} y={(aEnd.y + bFromA.y) / 2} fontSize="13" fontWeight="700" fill="#22c55e" textAnchor="start">B</text>
        <text x={(ox + rEnd.x) / 2 - 14} y={(oy + rEnd.y) / 2} fontSize="14" fontWeight="700" fill="#ef4444" textAnchor="end">R</text>

        {/* Origin dot */}
        <circle cx={ox} cy={oy} r="3" className="fill-gray-500 dark:fill-gray-400" />

        {/* Info box */}
        <rect x={230} y={35} width={160} height={95} rx="8" className="fill-gray-50 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x={310} y={55} textAnchor="middle" fontSize="11" fontWeight="700" fill="#3b82f6">A = (4, 2)</text>
        <text x={310} y={73} textAnchor="middle" fontSize="11" fontWeight="700" fill="#22c55e">B = (2, 5)</text>
        <line x1={245} y1={80} x2={375} y2={80} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
        <text x={310} y={97} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">R = A + B = (6, 7)</text>
        <text x={310} y={118} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
          |R| = {'√'}(36+49) ≈ 9.22
        </text>

        {/* Method labels */}
        <text x={ox + 10} y={oy + 20} fontSize="10" className="fill-gray-500 dark:fill-gray-400">Tip-to-tail (solid)</text>
        <text x={ox + 10} y={oy + 32} fontSize="10" className="fill-gray-500 dark:fill-gray-400">Parallelogram (dashed)</text>
      </svg>
    </div>
  );
}
