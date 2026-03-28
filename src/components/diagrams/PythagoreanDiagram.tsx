export default function PythagoreanDiagram() {
  /* a=3, b=4, c=5 triangle. Scale factor for SVG units. */
  const s = 40; // 1 unit = 40px
  const a = 3, b = 4, c = 5;

  /* Triangle vertices (right angle at bottom-left) */
  const triX = 60, triY = 260;
  const A = { x: triX, y: triY };                    // right-angle vertex
  const B = { x: triX + b * s, y: triY };            // along base (b=4)
  const C = { x: triX, y: triY - a * s };            // along height (a=3)

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 500 350"
        className="w-full max-w-lg mx-auto"
        role="img"
        aria-label="Pythagorean theorem diagram showing a²+b²=c² with a 3-4-5 triangle"
      >
        {/* ── Triangle ── */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          className="fill-gray-100 dark:fill-gray-800 stroke-gray-700 dark:stroke-gray-200"
          strokeWidth="2"
        />

        {/* Right-angle marker */}
        <polyline
          points={`${A.x + 14},${A.y} ${A.x + 14},${A.y - 14} ${A.x},${A.y - 14}`}
          className="fill-none stroke-gray-500 dark:stroke-gray-400"
          strokeWidth="1.5"
        />

        {/* ── Square on side a (vertical, blue) ── */}
        <rect
          x={A.x - a * s}
          y={C.y}
          width={a * s}
          height={a * s}
          className="fill-blue-200/60 dark:fill-blue-800/40 stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="1.5"
        />
        <text
          x={A.x - a * s / 2}
          y={C.y + a * s / 2 + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          className="fill-blue-700 dark:fill-blue-300"
        >
          a² = {a * a}
        </text>

        {/* ── Square on side b (horizontal, green) ── */}
        <rect
          x={A.x}
          y={A.y}
          width={b * s}
          height={b * s}
          className="fill-emerald-200/60 dark:fill-emerald-800/40 stroke-emerald-500 dark:stroke-emerald-400"
          strokeWidth="1.5"
        />
        <text
          x={A.x + b * s / 2}
          y={A.y + b * s / 2 + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          className="fill-emerald-700 dark:fill-emerald-300"
        >
          b² = {b * b}
        </text>

        {/* ── Square on hypotenuse c (red, rotated) ── */}
        {(() => {
          /* The hypotenuse goes from C to B. Build square outward from the triangle. */
          const dx = B.x - C.x; // b*s
          const dy = B.y - C.y; // a*s
          /* Perpendicular (outward) normalised * c*s */
          const px = -dy; // -a*s  →  points "outward" from triangle
          const py = dx;  //  b*s
          const P1 = C;
          const P2 = B;
          const P3 = { x: B.x + px, y: B.y + py };
          const P4 = { x: C.x + px, y: C.y + py };
          const cx = (P1.x + P2.x + P3.x + P4.x) / 4;
          const cy = (P1.y + P2.y + P3.y + P4.y) / 4;
          return (
            <>
              <polygon
                points={`${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y} ${P4.x},${P4.y}`}
                className="fill-red-200/60 dark:fill-red-800/40 stroke-red-500 dark:stroke-red-400"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                className="fill-red-700 dark:fill-red-300"
              >
                c² = {c * c}
              </text>
            </>
          );
        })()}

        {/* ── Side labels on the triangle ── */}
        {/* a — left side */}
        <text
          x={A.x + 10}
          y={(A.y + C.y) / 2 + 4}
          fontSize="13"
          fontWeight="bold"
          className="fill-blue-600 dark:fill-blue-300"
        >
          a={a}
        </text>
        {/* b — bottom side */}
        <text
          x={(A.x + B.x) / 2}
          y={A.y - 8}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          className="fill-emerald-600 dark:fill-emerald-300"
        >
          b={b}
        </text>
        {/* c — hypotenuse */}
        <text
          x={(C.x + B.x) / 2 + 12}
          y={(C.y + B.y) / 2 - 6}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          className="fill-red-600 dark:fill-red-300"
        >
          c={c}
        </text>

        {/* ── Equation ── */}
        <text
          x={250}
          y={30}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          className="fill-gray-800 dark:fill-gray-100"
          fontFamily="serif"
        >
          a² + b² = c²
        </text>
        <text
          x={250}
          y={52}
          textAnchor="middle"
          fontSize="13"
          className="fill-gray-500 dark:fill-gray-400"
        >
          {a * a} + {b * b} = {c * c}
        </text>
      </svg>
    </div>
  );
}
