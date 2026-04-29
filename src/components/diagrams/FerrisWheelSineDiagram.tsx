/**
 * Ferris-wheel scene: Tara sits in a Ferris wheel cabin. As the wheel turns,
 * her height above the ground traces a perfect sine wave. The diagram shows
 * the wheel on the left and the height-vs-time graph on the right, with a
 * coloured line connecting Tara's current height to the matching point on
 * the graph.
 *
 * Used to open the "Graphs of Trig Functions" section.
 */
import Tara from './people/Tara';

export default function FerrisWheelSineDiagram() {
  const W = 720, H = 380;

  // Wheel
  const wheelCx = 160, wheelCy = 200;
  const wheelR = 110;

  // "Phase" represents how far into one revolution we've gone, 0 = boarding at the bottom.
  // SVG y is inverted (larger y is lower on screen), so a phase of 0.25 (a quarter turn)
  // should put Tara on the LEFT side of the wheel (3 o'clock from the centre's POV is
  // visually right; we want counter-clockwise, so quarter turn = 9 o'clock = LEFT).
  // To make Tara visibly elevated, set phase a bit past quarter — say 0.3 of a turn.
  const phase = 0.3; // fraction of one full revolution
  const angleFromBottom = phase * 2 * Math.PI; // radians, counter-clockwise from bottom
  // Bottom is (cx, cy + r). Going CCW from there:
  //   phase 0    -> (cx,           cy + r)         bottom
  //   phase 0.25 -> (cx - r,       cy)             left
  //   phase 0.5  -> (cx,           cy - r)         top
  //   phase 0.75 -> (cx + r,       cy)             right
  // Position: (cx - r·sin(α), cy + r·cos(α)) where α = angleFromBottom
  const taraX = wheelCx - wheelR * Math.sin(angleFromBottom);
  const taraY = wheelCy + wheelR * Math.cos(angleFromBottom);
  // Height above the ground (the bottom of the wheel sits at wheelCy + wheelR = ground level for our sketch)
  // Height above bottom = wheelR - r·cos(α) = r·(1 - cos(α))
  // Equivalently this is a "raised cosine" — exactly a sine wave shape vs phase.

  // Graph axes
  const graphX0 = 360, graphX1 = 700;
  const graphY0 = 60, graphY1 = 340;
  const graphMid = (graphY0 + graphY1) / 2;
  const graphHalfHeight = (graphY1 - graphY0) / 2 - 20;

  // Graph: x is phase (0..1), y is height above bottom (0 at bottom, 2r at top).
  // We want the curve to rise from bottom and reach top at phase 0.5, so:
  //   height(phase) = r * (1 - cos(2π * phase))
  // In SVG screen coords, plot y = graphY1 - normalisedHeight * (graphY1 - graphY0 - 20px padding).
  const graphPad = 18;
  const usableHeight = graphY1 - graphY0 - 2 * graphPad;
  const heightToPy = (h01: number) => graphY1 - graphPad - h01 * usableHeight;

  const points: string[] = [];
  for (let p = 0; p <= 1; p += 0.01) {
    const px = graphX0 + p * (graphX1 - graphX0);
    const h01 = (1 - Math.cos(2 * Math.PI * p)) / 2; // 0..1 height
    points.push(`${px},${heightToPy(h01)}`);
  }

  // Current point on graph — must match Tara's height on the wheel
  const currentPx = graphX0 + phase * (graphX1 - graphX0);
  const currentH01 = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const currentPy = heightToPy(currentH01);

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara on a Ferris wheel; her height traces a sine wave over time">

        {/* Backdrop sky */}
        <defs>
          <linearGradient id="sky-fw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height="320" fill="url(#sky-fw)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height="320" fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y="320" width={W} height={H - 320} fill="#84cc16" opacity="0.5" className="dark:fill-emerald-900" />

        {/* Wheel support structure — two diagonal beams */}
        <line x1={wheelCx - 60} y1="320" x2={wheelCx} y2={wheelCy} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <line x1={wheelCx + 60} y1="320" x2={wheelCx} y2={wheelCy} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <rect x={wheelCx - 70} y="316" width="140" height="6" rx="2" fill="#1e293b" />

        {/* Wheel rim */}
        <circle cx={wheelCx} cy={wheelCy} r={wheelR} fill="none" stroke="#1e293b" strokeWidth="3" />
        {/* Inner rim for depth */}
        <circle cx={wheelCx} cy={wheelCy} r={wheelR - 6} fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />

        {/* Spokes — to each of the 8 cabin positions */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(k => {
          const a = (k / 8) * 2 * Math.PI;
          const sx = wheelCx - wheelR * Math.sin(a);
          const sy = wheelCy + wheelR * Math.cos(a);
          return (
            <line key={k}
              x1={wheelCx} y1={wheelCy} x2={sx} y2={sy}
              stroke="#475569" strokeWidth="1.5" opacity="0.7" />
          );
        })}

        {/* Cabins at 8 evenly-spaced positions around the wheel.
            For each cabin, compute its position from "bottom + k/8 of a turn", same convention as Tara. */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(k => {
          const cabinPhase = k / 8;
          // Skip the cabin whose phase is closest to Tara's
          if (Math.abs(cabinPhase - phase) < 0.07) return null;
          const a = cabinPhase * 2 * Math.PI;
          const cx2 = wheelCx - wheelR * Math.sin(a);
          const cy2 = wheelCy + wheelR * Math.cos(a);
          return (
            <g key={k}>
              <rect x={cx2 - 10} y={cy2 - 6} width="20" height="14" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
              <rect x={cx2 - 8} y={cy2 - 4} width="16" height="6" rx="1" fill="#fca5a5" opacity="0.7" />
            </g>
          );
        })}

        {/* Tara's cabin — bigger, brighter, with her in it */}
        <rect x={taraX - 16} y={taraY - 6} width="32" height="22" rx="4"
          fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
        {/* Cabin window */}
        <rect x={taraX - 13} y={taraY - 3} width="26" height="10" rx="1" fill="#fef9c3" opacity="0.6" />

        {/* Tara — sitting in cabin, just upper body visible */}
        <g transform={`translate(${taraX}, ${taraY + 6}) scale(0.42)`}>
          {/* Just head + torso for cabin view */}
          <rect x="-10" y="-44" width="20" height="22" rx="4" fill="#f97316" stroke="#1f2937" strokeWidth="1.2" />
          <ellipse cx="0" cy="-58" rx="11" ry="12" fill="#d9a273" stroke="#1f2937" strokeWidth="1.2" />
          {/* Hair top */}
          <path d="M -11 -62 Q -8 -71 0 -72 Q 8 -71 11 -62 Z" fill="#1f1410" stroke="#1f2937" strokeWidth="0.8" />
          {/* Eyes happy */}
          <circle cx="-4" cy="-58" r="1.3" fill="#1f2937" />
          <circle cx="4" cy="-58" r="1.3" fill="#1f2937" />
          {/* Smile */}
          <path d="M -3 -52 Q 0 -49 3 -52" fill="none" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Height tracking — horizontal dashed line from Tara to graph */}
        <line x1={taraX + 16} y1={taraY + 5} x2={currentPx} y2={currentPy}
          stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.9" />

        {/* GRAPH side */}
        {/* Graph background */}
        <rect x={graphX0 - 30} y={graphY0 - 20} width={graphX1 - graphX0 + 50} height={graphY1 - graphY0 + 40}
          fill="white" opacity="0.92" stroke="#cbd5e1" strokeWidth="1" rx="4" className="dark:fill-gray-800 dark:stroke-gray-600" />

        {/* Y-axis */}
        <line x1={graphX0} y1={graphY0 - 10} x2={graphX0} y2={graphY1 + 10}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#gU-fw)" className="dark:stroke-gray-400" />
        {/* X-axis at midline */}
        <line x1={graphX0 - 5} y1={graphMid} x2={graphX1 + 10} y2={graphMid}
          stroke="#475569" strokeWidth="1.2" markerEnd="url(#gR-fw)" className="dark:stroke-gray-400" />
        <defs>
          <marker id="gR-fw" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="gU-fw" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={graphX1 + 16} y={graphMid + 4} fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">time</text>
        <text x={graphX0 - 8} y={graphY0 - 14} fontSize="11" fontWeight="700" fill="#475569" textAnchor="end" className="dark:fill-gray-300">height</text>

        {/* Reference horizontal lines for max and min */}
        <line x1={graphX0 - 5} y1={graphMid - graphHalfHeight} x2={graphX1 + 5} y2={graphMid - graphHalfHeight}
          stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 3" className="dark:stroke-gray-600" />
        <line x1={graphX0 - 5} y1={graphMid + graphHalfHeight} x2={graphX1 + 5} y2={graphMid + graphHalfHeight}
          stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 3" className="dark:stroke-gray-600" />
        <text x={graphX0 - 6} y={graphMid - graphHalfHeight + 4} fontSize="10" fill="#94a3b8" textAnchor="end" className="dark:fill-gray-500">top</text>
        <text x={graphX0 - 6} y={graphMid + graphHalfHeight + 4} fontSize="10" fill="#94a3b8" textAnchor="end" className="dark:fill-gray-500">bottom</text>

        {/* The sine curve */}
        <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Current position dot */}
        <circle cx={currentPx} cy={currentPy} r="6" fill="#f97316" stroke="white" strokeWidth="2" />
        <circle cx={currentPx} cy={currentPy} r="10" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.92" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara on a Ferris wheel
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          As the wheel turns, her height traces a sine wave.
        </text>
      </svg>
    </div>
  );
}
