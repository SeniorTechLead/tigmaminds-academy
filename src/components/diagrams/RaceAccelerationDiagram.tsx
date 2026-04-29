export default function RaceAccelerationDiagram() {
  const w = 600;
  const h = 420;
  const left = 80;
  const right = 560;
  const top = 50;
  const bottom = 350;
  const graphW = right - left;
  const graphH = bottom - top;

  /* Velocity axis: 0-20 m/s */
  const maxV = 20;
  /* Time axis: 0-12 s */
  const maxT = 12;

  const tX = (t: number) => left + (t / maxT) * graphW;
  const vY = (v: number) => bottom - (v / maxV) * graphH;

  /* Cheetah: 0 to 27 m/s in 3s (a ≈ 9 m/s²), sustain, tire at 8s */
  const cheetah: [number, number][] = [];
  for (let t = 0; t <= 12; t += 0.5) {
    let v: number;
    if (t <= 3) v = 9 * t;                         /* accelerating */
    else if (t <= 8) v = 27 - 0.5 * (t - 3);      /* slowly tiring */
    else v = Math.max(0, 24.5 - 3 * (t - 8));      /* rapid fatigue */
    cheetah.push([t, Math.min(v, maxV)]);
  }

  /* Tortoise: steady acceleration 0 to 0.08 m/s — scaled to 0 to 2 m/s for visibility */
  const tortoise: [number, number][] = [];
  for (let t = 0; t <= 12; t += 0.5) {
    const v = t <= 2 ? t * 1 : 2;  /* reaches 2 m/s in 2s, holds steady */
    tortoise.push([t, v]);
  }

  const pathOf = (pts: [number, number][]) =>
    pts.map(([t, v], i) => `${i === 0 ? "M" : "L"}${tX(t)},${vY(v)}`).join(" ");

  /* Acceleration shading for cheetah first 3s */
  const accelPoly = `${tX(0)},${vY(0)} ${tX(3)},${vY(Math.min(27, maxV))} ${tX(3)},${vY(0)}`;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Velocity versus time graph showing a cheetah accelerating rapidly then tiring, compared to a tortoise with slow steady velocity">
        <rect width={w} height={h} rx={10} className="fill-white dark:fill-slate-900" />

        <text x={w / 2} y={28} textAnchor="middle" className="fill-gray-800 dark:fill-slate-100" style={{ fontSize: 16, fontWeight: 700 }}>
          Acceleration — Velocity–Time Graph
        </text>

        {/* Grid */}
        {[0, 2, 4, 6, 8, 10, 12].map(t => (
          <g key={`t${t}`}>
            <line x1={tX(t)} y1={top} x2={tX(t)} y2={bottom} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={tX(t)} y={bottom + 16} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" style={{ fontSize: 11 }}>{t}s</text>
          </g>
        ))}
        {[0, 5, 10, 15, 20].map(v => (
          <g key={`v${v}`}>
            <line x1={left} y1={vY(v)} x2={right} y2={vY(v)} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={left - 8} y={vY(v) + 4} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" style={{ fontSize: 11 }}>{v}</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <text x={w / 2} y={bottom + 36} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" style={{ fontSize: 12 }}>Time (seconds)</text>
        <text x={20} y={(top + bottom) / 2} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" style={{ fontSize: 12 }} transform={`rotate(-90 20 ${(top + bottom) / 2})`}>Velocity (m/s)</text>

        {/* Acceleration shading */}
        <polygon points={accelPoly} fill="#f97316" fillOpacity={0.15} />

        {/* Cheetah path */}
        <path d={pathOf(cheetah)} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Tortoise path */}
        <path d={pathOf(tortoise)} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Annotation: slope = acceleration */}
        <defs>
          <marker id="rad-arr" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#fbbf24" />
          </marker>
        </defs>
        <line x1={tX(0.5)} y1={vY(4)} x2={tX(2.5)} y2={vY(18)} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#rad-arr)" />
        <text x={tX(0.8)} y={vY(14)} className="fill-amber-300" style={{ fontSize: 12, fontWeight: 600 }}>
          steep slope
        </text>
        <text x={tX(0.8)} y={vY(12)} className="fill-amber-300" style={{ fontSize: 12 }}>
          = high acceleration
        </text>

        {/* Deceleration label */}
        <text x={tX(9)} y={vY(16)} textAnchor="middle" className="fill-red-400" style={{ fontSize: 11, fontStyle: "italic" }}>
          negative acceleration
        </text>
        <text x={tX(9)} y={vY(14)} textAnchor="middle" className="fill-red-400" style={{ fontSize: 11, fontStyle: "italic" }}>
          (deceleration)
        </text>

        {/* Tortoise label */}
        <text x={tX(8)} y={vY(3.5)} className="fill-emerald-300" style={{ fontSize: 11 }}>
          Tortoise: small a, but never stops
        </text>

        {/* Formula box */}
        <rect x={right - 200} y={top + 2} width={192} height={50} rx={6} className="fill-slate-800/90" />
        <text x={right - 104} y={top + 22} textAnchor="middle" className="fill-cyan-300" style={{ fontSize: 13, fontWeight: 600 }}>
          a = Δv / Δt
        </text>
        <text x={right - 104} y={top + 40} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" style={{ fontSize: 11 }}>
          change in velocity ÷ change in time
        </text>

        {/* Legend */}
        <g>
          <rect x={left + 6} y={bottom - 58} width={155} height={50} rx={6} className="fill-slate-800/80" />
          <circle cx={left + 20} cy={bottom - 40} r={5} fill="#f97316" />
          <text x={left + 30} y={bottom - 36} className="fill-gray-700 dark:fill-slate-200" style={{ fontSize: 12 }}>Cheetah (a ≈ 9 m/s²)</text>
          <circle cx={left + 20} cy={bottom - 20} r={5} fill="#22c55e" />
          <text x={left + 30} y={bottom - 16} className="fill-gray-700 dark:fill-slate-200" style={{ fontSize: 12 }}>Tortoise (a ≈ 1 m/s²)</text>
        </g>
      </svg>
    </div>
  );
}
