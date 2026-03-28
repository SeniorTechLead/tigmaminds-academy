/**
 * TessellationDiagram — shows hexagonal (honeycomb) and triangular tessellations.
 */

// Flat-top hexagon helper: returns SVG polygon points string
function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

// Equilateral-triangle helper
function triPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): string {
  return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
}

export default function TessellationDiagram() {
  const hexR = 24; // circumradius of each hexagon
  const hexW = hexR * 2; // width tip-to-tip (flat-top)
  const hexH = hexR * Math.sqrt(3); // height flat-to-flat

  // Build a grid of flat-top hexagons
  const hexagons: { cx: number; cy: number }[] = [];
  const cols = 7;
  const rows = 4;
  const startX = 55;
  const startY = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = startX + col * hexW * 0.75;
      const cy =
        startY + row * hexH + (col % 2 === 1 ? hexH / 2 : 0);
      hexagons.push({ cx, cy });
    }
  }

  // Pick one hexagon for the bee (roughly center)
  const beeIdx = 10;

  // Triangle tessellation row
  const triStartX = 30;
  const triStartY = 245;
  const triSide = 40;
  const triH = (triSide * Math.sqrt(3)) / 2;
  const triCols = 12;
  const triRows = 2;

  const triangles: { points: string; up: boolean; row: number; col: number }[] = [];
  for (let row = 0; row < triRows; row++) {
    for (let col = 0; col < triCols; col++) {
      const baseX = triStartX + col * (triSide / 2);
      const baseY = triStartY + row * triH;
      const isUp = (col + row) % 2 === 0;
      let points: string;
      if (isUp) {
        points = triPoints(
          baseX,
          baseY + triH,
          baseX + triSide / 2,
          baseY,
          baseX + triSide,
          baseY + triH
        );
      } else {
        points = triPoints(
          baseX,
          baseY,
          baseX + triSide / 2,
          baseY + triH,
          baseX + triSide,
          baseY
        );
      }
      triangles.push({ points, up: isUp, row, col });
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      <svg
        viewBox="0 0 500 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tessellation patterns: hexagonal honeycomb and triangular tiling"
      >
        {/* ── Hexagonal honeycomb ── */}
        {hexagons.map((h, i) => (
          <polygon
            key={`hex-${i}`}
            points={hexPoints(h.cx, h.cy, hexR)}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
        ))}

        {/* Bee in one hexagon */}
        <text
          x={hexagons[beeIdx].cx}
          y={hexagons[beeIdx].cy + 6}
          textAnchor="middle"
          fontSize={18}
          aria-label="bee"
        >
          🐝
        </text>

        {/* Honeycomb label */}
        <text
          x={250}
          y={200}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          className="fill-current text-gray-700 dark:text-gray-200"
        >
          Hexagonal tessellation (honeycomb)
        </text>

        {/* ── Triangle tessellation ── */}
        {triangles.map((t, i) => (
          <polygon
            key={`tri-${i}`}
            points={t.points}
            fill={t.up ? "#cffafe" : "#99f6e4"}
            stroke="#0d9488"
            strokeWidth={1}
          />
        ))}

        {/* Triangle label */}
        <text
          x={250}
          y={335}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          className="fill-current text-gray-700 dark:text-gray-200"
        >
          Triangular tessellation
        </text>
      </svg>
    </div>
  );
}
