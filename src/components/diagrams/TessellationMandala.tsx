export default function TessellationMandala() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Helper: polygon points for a regular n-gon centered at (cx, cy) with radius r
  const nGonPoints = (cx: number, cy: number, r: number, n: number, rotOffset = -90) => {
    return Array.from({ length: n })
      .map((_, i) => {
        const angle = toRad(rotOffset + (360 / n) * i);
        return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
      })
      .join(" ");
  };

  // === Panel 1: 6 equilateral triangles at a point ===
  const triCx = 100;
  const triCy = 155;
  const triR = 55;

  // === Panel 2: 4 squares at a point ===
  const sqCx = 335;
  const sqCy = 155;
  const sqR = 48;

  // === Panel 3: 3 hexagons at a point ===
  const hexCx = 565;
  const hexCy = 155;
  const hexR = 38;

  // === Pentagon (bottom) ===
  const pentCx = 335;
  const pentCy = 345;
  const pentR = 38;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Why only triangles, squares, and hexagons tessellate: interior angles must sum to 360 degrees"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .sub { font-family: system-ui, sans-serif; font-size: 10px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          .math { font-family: system-ui, sans-serif; font-size: 11px; }
          .big { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
        `}</style>

        <rect width="670" height="430" rx="8" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="335" y="30" textAnchor="middle" className="title fill-amber-300">
          Why Only 3 Shapes Tessellate
        </text>
        <text x="335" y="48" textAnchor="middle" className="sub fill-slate-400">
          At any meeting point, angles must add to exactly 360
        </text>

        {/* ===== Panel 1: Triangles (6 x 60 = 360) ===== */}
        <g>
          {/* 6 equilateral triangles meeting at center */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a1 = toRad(-90 + i * 60);
            const a2 = toRad(-90 + (i + 1) * 60);
            const x1 = triCx + Math.cos(a1) * triR;
            const y1 = triCy + Math.sin(a1) * triR;
            const x2 = triCx + Math.cos(a2) * triR;
            const y2 = triCy + Math.sin(a2) * triR;
            return (
              <polygon
                key={i}
                points={`${triCx},${triCy} ${x1},${y1} ${x2},${y2}`}
                fill={i % 2 === 0 ? "#c4b5fd" : "#a78bfa"}
                stroke="#7c3aed"
                strokeWidth="1.5"
              />
            );
          })}
          {/* Center dot */}
          <circle cx={triCx} cy={triCy} r={3} fill="#fbbf24" />
          {/* Angle arc label */}
          <text x={triCx + 12} y={triCy - 8} className="sub fill-amber-300">60</text>

          {/* Label */}
          <text x={triCx} y={228} textAnchor="middle" className="label fill-purple-300">
            Equilateral Triangle
          </text>
          <text x={triCx} y={246} textAnchor="middle" className="math fill-cyan-400">
            6 x 60 = 360
          </text>
        </g>

        {/* ===== Panel 2: Squares (4 x 90 = 360) ===== */}
        <g>
          {/* 4 squares meeting at center */}
          {[
            { dx: 0, dy: 0 },
            { dx: -sqR, dy: 0 },
            { dx: -sqR, dy: -sqR },
            { dx: 0, dy: -sqR },
          ].map((off, i) => (
            <rect
              key={i}
              x={sqCx + off.dx}
              y={sqCy + off.dy}
              width={sqR}
              height={sqR}
              fill={i % 2 === 0 ? "#93c5fd" : "#60a5fa"}
              stroke="#2563eb"
              strokeWidth="1.5"
            />
          ))}
          {/* Center dot */}
          <circle cx={sqCx} cy={sqCy} r={3} fill="#fbbf24" />
          {/* Angle label */}
          <text x={sqCx + 8} y={sqCy - 6} className="sub fill-amber-300">90</text>

          {/* Label */}
          <text x={sqCx} y={228} textAnchor="middle" className="label fill-blue-300">
            Square
          </text>
          <text x={sqCx} y={246} textAnchor="middle" className="math fill-cyan-400">
            4 x 90 = 360
          </text>
        </g>

        {/* ===== Panel 3: Hexagons (3 x 120 = 360) ===== */}
        <g>
          {/* 3 hexagons meeting at a shared vertex */}
          {/* Position 3 hexagons so they share a common vertex at hexCx, hexCy */}
          {[0, 1, 2].map((i) => {
            // Place hexagons at 120 degree intervals around the meeting point
            const offsetAngle = toRad(-90 + i * 120);
            const dist = hexR * Math.sqrt(3) * 0.577; // distance from meeting point to hex center
            const cx = hexCx + Math.cos(offsetAngle) * dist;
            const cy = hexCy + Math.sin(offsetAngle) * dist;
            const fills = ["#86efac", "#4ade80", "#22c55e"];
            return (
              <polygon
                key={i}
                points={nGonPoints(cx, cy, hexR, 6, -90 + i * 0)}
                fill={fills[i]}
                stroke="#15803d"
                strokeWidth="1.5"
                opacity={0.8}
              />
            );
          })}
          {/* Center dot */}
          <circle cx={hexCx} cy={hexCy} r={3} fill="#fbbf24" />
          {/* Angle label */}
          <text x={hexCx + 10} y={hexCy - 6} className="sub fill-amber-300">120</text>

          {/* Label */}
          <text x={hexCx} y={228} textAnchor="middle" className="label fill-green-300">
            Regular Hexagon
          </text>
          <text x={hexCx} y={246} textAnchor="middle" className="math fill-cyan-400">
            3 x 120 = 360
          </text>
        </g>

        {/* Divider */}
        <line x1="40" y1="268" x2="630" y2="268" stroke="#334155" strokeWidth="1" />

        {/* ===== Bottom: Pentagon FAIL ===== */}
        <g>
          <text x="335" y="292" textAnchor="middle" className="big fill-red-400">
            Why not pentagons?
          </text>

          {/* 3 pentagons attempting to meet — with visible gap */}
          {[0, 1, 2].map((i) => {
            const offsetAngle = toRad(-90 + i * 120);
            const dist = pentR * 0.95;
            const cx = pentCx + Math.cos(offsetAngle) * dist;
            const cy = pentCy + Math.sin(offsetAngle) * dist;
            return (
              <polygon
                key={i}
                points={nGonPoints(cx, cy, pentR, 5, -90 + i * 24)}
                fill="#fca5a5"
                stroke="#dc2626"
                strokeWidth="1.5"
                opacity={0.6}
              />
            );
          })}

          {/* Gap indicator */}
          <text x={pentCx} y={pentCy + 2} textAnchor="middle" className="big fill-amber-300">
            GAP!
          </text>

          {/* Math explanation */}
          <text x={pentCx + 120} y={335} textAnchor="start" className="math fill-slate-300">
            Interior angle = 108
          </text>
          <text x={pentCx + 120} y={352} textAnchor="start" className="math fill-red-400">
            3 x 108 = 324 (not 360!)
          </text>
          <text x={pentCx + 120} y={369} textAnchor="start" className="math fill-amber-400">
            Gap of 36 -- can't tile!
          </text>
        </g>

        {/* Bottom summary */}
        <text x="335" y="420" textAnchor="middle" className="sub fill-slate-500">
          Only shapes whose interior angles divide evenly into 360 can tessellate a flat surface
        </text>
      </svg>
    </div>
  );
}
