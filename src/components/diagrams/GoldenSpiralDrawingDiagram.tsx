/**
 * Tara at a chalkboard, drawing the golden spiral by stacking Fibonacci-sized
 * squares and connecting their corners with a curve. Visual proof that the
 * spiral comes from the sequence.
 *
 * Used in the Golden Ratio section.
 */
import Tara from './people/Tara';

export default function GoldenSpiralDrawingDiagram() {
  const W = 720, H = 380;

  // Stack of Fibonacci squares — start at small, build outward
  // We anchor at a chalkboard origin and stack: 1, 1, 2, 3, 5, 8, 13, 21
  // Use chalkboard from x=160..640, y=70..330
  // Spiral built clockwise outward from bottom-left starting square.
  // Coords for a tight stack (in chalkboard units):
  // s1 (1×1) at (0,0); s2 (1×1) at (1,0); s3 (2×2) at (0,1); s4 (3×3) at (-2,1); s5 (5×5) ...
  // Easier: pre-compute the squares and a quarter-circle in each.

  type Sq = { x: number; y: number; w: number; h: number; arcStart: 'br' | 'bl' | 'tl' | 'tr' };
  const unit = 16; // chalkboard pixels per Fibonacci unit
  const offsetX = 380, offsetY = 230; // anchor on chalkboard
  // Place squares so the spiral grows outward; arc orientation rotates 90° each step.
  const squares: Sq[] = [
    { x: 0, y: 0,  w: 1, h: 1,  arcStart: 'br' },   // 1, bottom-right corner arc
    { x: 1, y: 0,  w: 1, h: 1,  arcStart: 'bl' },   // 1
    { x: 0, y: 1,  w: 2, h: 2,  arcStart: 'tl' },   // 2
    { x: -3, y: 1, w: 3, h: 3,  arcStart: 'tr' },   // 3
    { x: -3, y: -4,w: 5, h: 5,  arcStart: 'br' },   // 5
    { x: 2, y: -4, w: 8, h: 8,  arcStart: 'bl' },   // 8
    { x: 2, y: 4,  w: 13,h: 13, arcStart: 'tl' },   // 13
  ];
  // Compute screen positions of each square.
  // (Note: chalkboard y grows downward in SVG, so flip y when computing screen y.)
  const sxs = (sx: number) => offsetX + sx * unit;
  const sys = (sy: number) => offsetY - sy * unit; // flip
  // For arc: sweep a 90° quarter circle inside each square, starting at the corner indicated.

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara draws the golden spiral by stacking Fibonacci squares on a chalkboard">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The golden spiral, built from squares
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Each square's side is the next Fibonacci number.
        </text>

        {/* Chalkboard */}
        <rect x="160" y="70" width="480" height="280" rx="8" fill="#14532d" stroke="#052e16" strokeWidth="3" />
        <rect x="160" y="70" width="480" height="280" rx="8" fill="none" stroke="#84cc16" strokeWidth="1" opacity="0.3" />

        {/* Squares */}
        {squares.map((s, i) => {
          const x = sxs(s.x);
          // SVG square top-left: top is at sys(s.y + s.h)
          const y = sys(s.y + s.h);
          const w = s.w * unit;
          const h = s.h * unit;
          // Centre of square
          const cx = x + w / 2;
          const cy = y + h / 2;
          // Quarter-arc inside the square — radius = side
          let arcStart: [number, number], arcEnd: [number, number];
          switch (s.arcStart) {
            case 'br': arcStart = [x + w, y + h]; arcEnd = [x, y + h - h]; break; // br→tr (sweeps left-up? no — this gets messy)
            case 'bl': arcStart = [x, y + h]; arcEnd = [x + w, y]; break;
            case 'tl': arcStart = [x, y]; arcEnd = [x + w, y + h]; break;
            case 'tr': arcStart = [x + w, y]; arcEnd = [x, y + h]; break;
            default: arcStart = [x, y]; arcEnd = [x + w, y + h];
          }
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="none" stroke="#fef9c3" strokeWidth="1.2" />
              {/* Side-length label */}
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={s.w > 5 ? 14 : s.w > 1 ? 11 : 9} fontWeight="700" fill="#fde047">
                {s.w}
              </text>
            </g>
          );
        })}

        {/* The spiral itself — drawn as connected quarter arcs in chalk-yellow */}
        <path d={`
          M ${sxs(2)} ${sys(0)}
          A ${unit} ${unit} 0 0 1 ${sxs(2)} ${sys(1)}
          A ${unit * 1} ${unit * 1} 0 0 1 ${sxs(0)} ${sys(1)}
          A ${unit * 2} ${unit * 2} 0 0 1 ${sxs(0)} ${sys(3)}
          A ${unit * 3} ${unit * 3} 0 0 1 ${sxs(-3)} ${sys(4)}
          A ${unit * 5} ${unit * 5} 0 0 1 ${sxs(-3)} ${sys(-1)}
          A ${unit * 8} ${unit * 8} 0 0 1 ${sxs(2)} ${sys(-4)}
          A ${unit * 13} ${unit * 13} 0 0 1 ${sxs(15)} ${sys(4)}
        `}
          fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />

        {/* Tara on left, chalk in hand */}
        <Tara x={70} y={350} scale={1.0} pose="pointing" />

        {/* Tara's speech / explanation */}
        <rect x="20" y="190" width="120" height="46" rx="10" fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="80" y="206" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Squares with sides
        </text>
        <text x="80" y="219" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-300">
          1, 1, 2, 3, 5, 8, 13...
        </text>
        <text x="80" y="232" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f97316">
          → golden spiral!
        </text>

        {/* Footer formula */}
        <rect x={W / 2 - 200} y={H - 26} width="400" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Each quarter turn, radius grows by φ ≈ 1.618 — the golden ratio.
        </text>
      </svg>
    </div>
  );
}
