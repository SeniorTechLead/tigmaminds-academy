/**
 * CrystalSymmetryDiagram — From Alhambra tiles to crystals to DNA.
 * Three connected panels: 2D tessellation → 3D crystal lattice → X-ray diffraction.
 */
export default function CrystalSymmetryDiagram() {
  const panelW = 150;
  const panelH = 130;
  const gap = 22;
  const startX = 16;
  const startY = 38;

  const panels = [0, 1, 2].map((i) => ({
    x: startX + i * (panelW + gap),
    y: startY,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 530 225"
        className="w-full"
        role="img"
        aria-label="From Alhambra tiles to crystals to X-ray diffraction — same mathematics across dimensions"
      >
        <rect width="530" height="225" className="fill-white dark:fill-slate-950" rx="8" />

        <text
          x="265"
          y="26"
          textAnchor="middle"
          className="fill-gray-900 dark:fill-slate-50"
          fontFamily="system-ui"
          fontSize="14"
          fontWeight="bold"
        >
          From Tiles to Crystals to DNA
        </text>

        {/* Panel backgrounds */}
        {panels.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={panelW}
            height={panelH}
            className="fill-gray-100 dark:fill-slate-800"
            rx="6"
            stroke="#334155"
            strokeWidth="1"
          />
        ))}

        {/* === Panel 1: 2D Alhambra Tile Pattern === */}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + 16}
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="600"
        >
          Alhambra Tile
        </text>
        {/* Star-and-cross pattern */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const s = 26;
            const gx = panels[0].x + 16 + col * s;
            const gy = panels[0].y + 24 + row * s;
            const cx = gx + s / 2;
            const cy = gy + s / 2;
            // 8-pointed star motif
            const colors = (row + col) % 2 === 0 ? "#38bdf8" : "#818cf8";
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={gx}
                  y={gy}
                  width={s}
                  height={s}
                  fill={colors}
                  fillOpacity="0.15"
                  stroke={colors}
                  strokeWidth="0.6"
                />
                {/* Small rotated square inside */}
                <rect
                  x={cx - 6}
                  y={cy - 6}
                  width={12}
                  height={12}
                  fill={colors}
                  fillOpacity="0.25"
                  stroke={colors}
                  strokeWidth="0.5"
                  transform={`rotate(45, ${cx}, ${cy})`}
                />
              </g>
            );
          })
        )}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + panelH - 10}
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="bold"
        >
          17 groups (2D)
        </text>

        {/* Arrow 1→2 */}
        <g>
          <line
            x1={panels[0].x + panelW + 2}
            y1={startY + panelH / 2}
            x2={panels[1].x - 2}
            y2={startY + panelH / 2}
            stroke="#fbbf24"
            strokeWidth="2"
            markerEnd="url(#crystalArrow)"
          />
        </g>

        {/* === Panel 2: 3D Crystal Lattice === */}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + 16}
          textAnchor="middle"
          fill="#a78bfa"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="600"
        >
          Crystal Lattice
        </text>
        {/* Simple cubic lattice in pseudo-3D */}
        {(() => {
          const cx = panels[1].x + panelW / 2;
          const cy = panels[1].y + 68;
          const s = 30;
          const dx = 12;
          const dy = 8;
          // 8 corners of a cube
          const corners = [
            [cx - s, cy - s],          // front-top-left
            [cx + s, cy - s],          // front-top-right
            [cx + s, cy + s],          // front-bottom-right
            [cx - s, cy + s],          // front-bottom-left
            [cx - s + dx, cy - s - dy], // back-top-left
            [cx + s + dx, cy - s - dy], // back-top-right
            [cx + s + dx, cy + s - dy], // back-bottom-right
            [cx - s + dx, cy + s - dy], // back-bottom-left
          ];
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // front face
            [4, 5], [5, 6], [6, 7], [7, 4], // back face
            [0, 4], [1, 5], [2, 6], [3, 7], // connections
          ];
          return (
            <g>
              {edges.map(([a, b], i) => (
                <line
                  key={i}
                  x1={corners[a][0]}
                  y1={corners[a][1]}
                  x2={corners[b][0]}
                  y2={corners[b][1]}
                  stroke="#a78bfa"
                  strokeWidth="1"
                  strokeOpacity={i >= 4 && i < 8 ? 0.4 : 0.7}
                />
              ))}
              {corners.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={i < 4 ? "#a78bfa" : "#7c3aed"}
                  fillOpacity={i < 4 ? 0.8 : 0.5}
                  stroke="#c4b5fd"
                  strokeWidth="0.8"
                />
              ))}
            </g>
          );
        })()}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + panelH - 10}
          textAnchor="middle"
          fill="#a78bfa"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="bold"
        >
          230 groups (3D)
        </text>

        {/* Arrow 2→3 */}
        <line
          x1={panels[1].x + panelW + 2}
          y1={startY + panelH / 2}
          x2={panels[2].x - 2}
          y2={startY + panelH / 2}
          stroke="#fbbf24"
          strokeWidth="2"
          markerEnd="url(#crystalArrow)"
        />

        {/* === Panel 3: X-ray Diffraction (Photo 51 style) === */}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + 16}
          textAnchor="middle"
          fill="#34d399"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="600"
        >
          X-ray Fingerprint
        </text>
        {/* Dark circle background */}
        {(() => {
          const cx = panels[2].x + panelW / 2;
          const cy = panels[2].y + 68;
          // X-shaped diffraction pattern (Photo 51 style)
          const dots: { x: number; y: number; r: number; o: number }[] = [];
          // Central spot
          dots.push({ x: cx, y: cy, r: 3, o: 0.8 });
          // X-pattern arms
          for (let arm = 0; arm < 4; arm++) {
            const angle = (45 + 90 * arm) * (Math.PI / 180);
            for (let d = 1; d <= 4; d++) {
              const dist = d * 10;
              dots.push({
                x: cx + dist * Math.cos(angle),
                y: cy + dist * Math.sin(angle),
                r: 2.5 - d * 0.3,
                o: 0.7 - d * 0.1,
              });
            }
          }
          // Layer lines (horizontal dots)
          for (let row = -2; row <= 2; row++) {
            if (row === 0) continue;
            for (let col = -1; col <= 1; col++) {
              if (col === 0 && (row === -1 || row === 1)) continue;
              dots.push({
                x: cx + col * 14,
                y: cy + row * 14,
                r: 1.8,
                o: 0.4,
              });
            }
          }
          return (
            <g>
              <circle cx={cx} cy={cy} r={44} fill="#0a0f1a" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1" />
              {dots.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  fill="#34d399"
                  fillOpacity={dot.o}
                />
              ))}
            </g>
          );
        })()}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + panelH - 10}
          textAnchor="middle"
          fill="#34d399"
          fontFamily="system-ui"
          fontSize="11"
          fontWeight="bold"
        >
          X-ray diffraction
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="crystalArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0,0 8,4 0,8" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Bottom note */}
        <text
          x="265"
          y="195"
          textAnchor="middle"
          fill="#fbbf24"
          fontFamily="system-ui"
          fontSize="12"
          fontStyle="italic"
        >
          Same mathematics, different dimensions
        </text>
        <text
          x="265"
          y="213"
          textAnchor="middle"
          className="fill-gray-400 dark:fill-slate-500"
          fontFamily="system-ui"
          fontSize="10"
        >
          Rosalind Franklin used crystallography to reveal DNA's structure
        </text>
      </svg>
    </div>
  );
}
