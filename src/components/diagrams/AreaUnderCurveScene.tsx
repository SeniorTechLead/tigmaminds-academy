/**
 * Tara wants to know the area of an irregular pond seen from above. Approximate
 * by rectangles (Riemann sum) — make them thinner and thinner — converges to
 * the integral.
 *
 * Used in the Integration section.
 */
import Tara from './people/Tara';

export default function AreaUnderCurveScene() {
  const W = 760, H = 380;

  // Curve area
  const gx0 = 220, gx1 = 700, gy0 = 90, gy1 = 300;
  // y = curve = a downward-opening parabola peak at midpoint
  const f = (x: number) => {
    const t = (x - gx0) / (gx1 - gx0);
    return gy1 - 130 * Math.sin(t * Math.PI);
  };

  // Build curve points
  const curvePoints: string[] = [];
  for (let x = gx0; x <= gx1; x += 4) {
    curvePoints.push(`${x},${f(x)}`);
  }
  // Close to form a filled area
  const fillPoints = [...curvePoints, `${gx1},${gy1}`, `${gx0},${gy1}`];

  // Rectangles for Riemann sum (8 rectangles, midpoint rule)
  const numRects = 12;
  const dx = (gx1 - gx0) / numRects;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Area under a curve approximated by rectangles converges to the integral as rectangles get thinner">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Find the area under the curve
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Stack rectangles. Make them thinner. That&apos;s integration.
        </text>

        {/* Tara on lower-left */}
        <Tara x={100} y={350} scale={0.85} pose="thinking" />

        {/* Filled curve area (faded) */}
        <polygon points={fillPoints.join(' ')} fill="#bae6fd" opacity="0.5" className="dark:fill-blue-900/30" />

        {/* Rectangles approximating area */}
        {Array.from({ length: numRects }).map((_, i) => {
          const xLeft = gx0 + i * dx;
          const xMid = xLeft + dx / 2;
          const top = f(xMid);
          return (
            <rect key={i}
              x={xLeft + 0.5} y={top}
              width={dx - 1} height={gy1 - top}
              fill="#3b82f6" stroke="#1e3a8a" strokeWidth="0.8" opacity="0.65" />
          );
        })}

        {/* Curve itself on top */}
        <polyline points={curvePoints.join(' ')} fill="none" stroke="#1e3a8a" strokeWidth="2.5" />

        {/* Axes */}
        <line x1={gx0 - 10} y1={gy1} x2={gx1 + 14} y2={gy1} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arX-au)" />
        <line x1={gx0} y1={gy1 + 10} x2={gx0} y2={gy0 - 14} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arY-au)" />
        <defs>
          <marker id="arX-au" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arY-au" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
        </defs>
        <text x={gx1 + 18} y={gy1 + 4} fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">x</text>
        <text x={gx0 - 6} y={gy0 - 18} fontSize="11" fontWeight="700" fill="#475569" textAnchor="end" className="dark:fill-gray-300">y</text>
        <text x={gx0 - 6} y={gy1 + 14} textAnchor="end" fontSize="10" fill="#475569" className="dark:fill-gray-400">a</text>
        <text x={gx1 + 6} y={gy1 + 14} textAnchor="start" fontSize="10" fill="#475569" className="dark:fill-gray-400">b</text>

        {/* "y = f(x)" label */}
        <text x={gx0 + 200} y={f(gx0 + 200) - 12} fontSize="13" fontWeight="700" fill="#1e3a8a" className="dark:fill-blue-300">
          y = f(x)
        </text>

        {/* Integral notation panel */}
        <rect x="280" y="100" width="200" height="40" rx="10"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x="380" y="125" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          Area = ∫ₐᵇ f(x) dx
        </text>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          As rectangle width → 0, the sum → the exact integral.
        </text>
      </svg>
    </div>
  );
}
