/**
 * WallpaperGroupsDiagram — Shows 4 of the 17 wallpaper groups:
 * p1, pm, p4m, p6m with distinct tiling patterns.
 */
export default function WallpaperGroupsDiagram() {
  const panelW = 120;
  const panelH = 130;
  const gap = 12;
  const startX = 26;
  const startY = 38;

  const panels = [0, 1, 2, 3].map((i) => ({
    x: startX + i * (panelW + gap),
    y: startY,
  }));

  // Small hexagon points
  const hexPts = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = ((60 * i - 30) * Math.PI) / 180;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 544 210"
        className="w-full"
        role="img"
        aria-label="4 of the 17 wallpaper groups: p1, pm, p4m, p6m"
      >
        <rect width="544" height="210" className="fill-white dark:fill-slate-950" rx="8" />

        <text
          x="272"
          y="26"
          textAnchor="middle"
          className="fill-gray-900 dark:fill-slate-50"
          fontFamily="system-ui"
          fontSize="14"
          fontWeight="bold"
        >
          4 of the 17 Wallpaper Groups
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

        {/* === p1: Translation only — offset bricks === */}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + 16}
          textAnchor="middle"
          fill="#38bdf8"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          p1
        </text>
        {/* Brick pattern */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const bw = 24;
            const bh = 12;
            const offset = row % 2 === 1 ? bw / 2 : 0;
            const bx = panels[0].x + 8 + col * bw + offset;
            const by = panels[0].y + 26 + row * bh;
            if (bx + bw > panels[0].x + panelW - 4) return null;
            return (
              <rect
                key={`${row}-${col}`}
                x={bx}
                y={by}
                width={bw}
                height={bh}
                fill="#38bdf8"
                fillOpacity="0.25"
                stroke="#38bdf8"
                strokeWidth="0.8"
                rx="1"
              />
            );
          })
        )}
        <text
          x={panels[0].x + panelW / 2}
          y={panels[0].y + panelH - 8}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Translation only
        </text>

        {/* === pm: Translation + mirror — tree reflections === */}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + 16}
          textAnchor="middle"
          fill="#34d399"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          pm
        </text>
        {/* Simple triangles mirrored across vertical axes */}
        {[0, 1, 2].map((col) =>
          [0, 1].map((row) => {
            const cx = panels[1].x + 20 + col * 36;
            const by = panels[1].y + 38 + row * 40;
            return (
              <g key={`${col}-${row}`}>
                {/* Left triangle */}
                <polygon
                  points={`${cx},${by} ${cx - 12},${by + 24} ${cx},${by + 24}`}
                  fill="#34d399"
                  fillOpacity="0.35"
                  stroke="#34d399"
                  strokeWidth="0.8"
                />
                {/* Mirror (right triangle) */}
                <polygon
                  points={`${cx},${by} ${cx + 12},${by + 24} ${cx},${by + 24}`}
                  fill="#34d399"
                  fillOpacity="0.2"
                  stroke="#34d399"
                  strokeWidth="0.8"
                />
              </g>
            );
          })
        )}
        <text
          x={panels[1].x + panelW / 2}
          y={panels[1].y + panelH - 8}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          Translation + mirror
        </text>

        {/* === p4m: 4-fold rotation + mirrors — square grid with diagonals === */}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + 16}
          textAnchor="middle"
          fill="#a78bfa"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          p4m
        </text>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const s = 22;
            const gx = panels[2].x + 10 + col * s;
            const gy = panels[2].y + 26 + row * s;
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={gx}
                  y={gy}
                  width={s}
                  height={s}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                />
                {/* Diagonal triangles for p4m symmetry */}
                <polygon
                  points={`${gx},${gy} ${gx + s},${gy} ${gx + s / 2},${gy + s / 2}`}
                  fill="#a78bfa"
                  fillOpacity="0.3"
                  stroke="none"
                />
                <polygon
                  points={`${gx},${gy + s} ${gx + s},${gy + s} ${gx + s / 2},${gy + s / 2}`}
                  fill="#c084fc"
                  fillOpacity="0.2"
                  stroke="none"
                />
              </g>
            );
          })
        )}
        <text
          x={panels[2].x + panelW / 2}
          y={panels[2].y + panelH - 8}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          4-fold + mirrors
        </text>

        {/* === p6m: 6-fold rotation + mirrors — honeycomb === */}
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + 16}
          textAnchor="middle"
          fill="#fb923c"
          fontFamily="system-ui"
          fontSize="12"
          fontWeight="600"
        >
          p6m
        </text>
        {/* Honeycomb grid */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const r = 12;
            const hSpacing = r * Math.sqrt(3);
            const vSpacing = r * 1.5;
            const cx = panels[3].x + 20 + col * hSpacing + (row % 2 === 1 ? hSpacing / 2 : 0);
            const cy = panels[3].y + 38 + row * vSpacing;
            if (cx > panels[3].x + panelW - 10) return null;
            return (
              <polygon
                key={`${row}-${col}`}
                points={hexPts(cx, cy, r)}
                fill="#fb923c"
                fillOpacity="0.2"
                stroke="#fb923c"
                strokeWidth="0.8"
              />
            );
          })
        )}
        <text
          x={panels[3].x + panelW / 2}
          y={panels[3].y + panelH - 8}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-slate-400"
          fontFamily="system-ui"
          fontSize="10"
        >
          6-fold + mirrors
        </text>

        {/* Bottom note */}
        <text
          x="272"
          y="196"
          textAnchor="middle"
          className="fill-gray-400 dark:fill-slate-500"
          fontFamily="system-ui"
          fontSize="11"
        >
          The Alhambra contains at least 13 of these 17 groups
        </text>
      </svg>
    </div>
  );
}
