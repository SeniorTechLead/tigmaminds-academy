export default function RaceSpeedDiagram() {
  const w = 600;
  const h = 400;
  const left = 80;
  const right = 560;
  const top = 40;
  const bottom = 340;
  const graphW = right - left;
  const graphH = bottom - top;

  /* Time axis: 0-60 seconds */
  const maxT = 60;
  /* Distance axis: 0-500 m */
  const maxD = 500;

  const tX = (t: number) => left + (t / maxT) * graphW;
  const dY = (d: number) => bottom - (d / maxD) * graphH;

  /* Hare: bursts to 70 km/h (19.4 m/s) for 10s, rests, bursts again */
  const harePoints: [number, number][] = [];
  let hDist = 0;
  for (let t = 0; t <= maxT; t += 1) {
    if (t <= 10) hDist += 19.4;
    else if (t <= 25) hDist += 0;       /* resting */
    else if (t <= 35) hDist += 19.4;
    else hDist += 0;                     /* resting again */
    harePoints.push([t, Math.min(hDist, maxD)]);
  }
  const harePath = harePoints
    .map(([t, d], i) => `${i === 0 ? "M" : "L"}${tX(t)},${dY(d)}`)
    .join(" ");

  /* Tortoise: steady 0.08 m/s — but let's scale up for visibility: 5 m/s steady */
  const tortPoints: [number, number][] = [];
  let tDist = 0;
  for (let t = 0; t <= maxT; t += 1) {
    tDist += 5;
    tortPoints.push([t, Math.min(tDist, maxD)]);
  }
  const tortPath = tortPoints
    .map(([t, d], i) => `${i === 0 ? "M" : "L"}${tX(t)},${dY(d)}`)
    .join(" ");

  /* Velocity insets */
  const speedLabel = (animal: string, speed: string, unit: string, color: string, y: number) => (
    <g key={animal}>
      <rect x={right - 170} y={y} width={160} height={34} rx={6} className="fill-slate-800/80" />
      <circle cx={right - 152} cy={y + 17} r={6} fill={color} />
      <text x={right - 140} y={y + 22} className="fill-gray-700 dark:fill-slate-200" style={{ fontSize: 13 }}>
        {animal}: {speed} {unit}
      </text>
    </g>
  );

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Position versus time graph comparing a hare that sprints and rests against a tortoise that moves at constant speed">
        <rect width={w} height={h} rx={10} className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x={w / 2} y={26} textAnchor="middle" className="fill-gray-800 dark:fill-slate-100" style={{ fontSize: 16, fontWeight: 700 }}>
          Speed vs Velocity — Position–Time Graph
        </text>

        {/* Grid */}
        {[0, 10, 20, 30, 40, 50, 60].map(t => (
          <g key={`t${t}`}>
            <line x1={tX(t)} y1={top} x2={tX(t)} y2={bottom} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={tX(t)} y={bottom + 18} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" style={{ fontSize: 11 }}>{t}s</text>
          </g>
        ))}
        {[0, 100, 200, 300, 400, 500].map(d => (
          <g key={`d${d}`}>
            <line x1={left} y1={dY(d)} x2={right} y2={dY(d)} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={left - 8} y={dY(d) + 4} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" style={{ fontSize: 11 }}>{d} m</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <text x={w / 2} y={bottom + 36} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" style={{ fontSize: 12 }}>Time (seconds)</text>
        <text x={18} y={h / 2} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" style={{ fontSize: 12 }} transform={`rotate(-90 18 ${h / 2})`}>Distance (m)</text>

        {/* Hare path */}
        <path d={harePath} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Tortoise path */}
        <path d={tortPath} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Flat segments annotation */}
        <text x={tX(17)} y={dY(194) - 10} textAnchor="middle" className="fill-orange-300" style={{ fontSize: 11, fontStyle: "italic" }}>
          resting (v = 0)
        </text>

        {/* Slope annotation */}
        <text x={tX(40)} y={dY(250) + 16} textAnchor="start" className="fill-emerald-300" style={{ fontSize: 11, fontStyle: "italic" }}>
          constant slope = constant speed
        </text>

        {/* Vector callout */}
        <rect x={left + 8} y={top + 4} width={220} height={52} rx={6} className="fill-slate-800/90" />
        <text x={left + 16} y={top + 22} className="fill-amber-300" style={{ fontSize: 12, fontWeight: 600 }}>
          Speed = distance / time (scalar)
        </text>
        <text x={left + 16} y={top + 42} className="fill-cyan-300" style={{ fontSize: 12, fontWeight: 600 }}>
          Velocity = displacement / time (vector)
        </text>

        {/* Legend */}
        {speedLabel("Hare", "70", "km/h bursts", "#f97316", top + 62)}
        {speedLabel("Tortoise", "18", "km/h steady", "#22c55e", top + 100)}

        {/* Direction arrow for vector */}
        <defs>
          <marker id="rsd-arrow" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#67e8f9" />
          </marker>
        </defs>
        <line x1={left + 240} y1={top + 38} x2={left + 290} y2={top + 38} stroke="#67e8f9" strokeWidth={2} markerEnd="url(#rsd-arrow)" />
        <text x={left + 296} y={top + 42} className="fill-cyan-300" style={{ fontSize: 11 }}>direction matters!</text>
      </svg>
    </div>
  );
}
