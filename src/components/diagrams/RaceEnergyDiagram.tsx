export default function RaceEnergyDiagram() {
  const w = 620;
  const h = 440;
  const left = 90;
  const right = 570;
  const top = 60;
  const bottom = 360;
  const graphW = right - left;
  const graphH = bottom - top;

  /* X axis: time in minutes (0-30 min) */
  const maxT = 30;
  /* Y axis: energy % remaining (0-100) */
  const maxE = 100;

  const tX = (t: number) => left + (t / maxT) * graphW;
  const eY = (e: number) => bottom - (e / maxE) * graphH;

  /* Hare: anaerobic sprint burns energy fast */
  const harePts: [number, number][] = [];
  for (let t = 0; t <= maxT; t += 0.5) {
    let e: number;
    if (t <= 2) e = 100 - t * 25;          /* sprint: burns 25%/min */
    else if (t <= 10) e = 50 + (t - 2) * 2; /* rest: recovers slowly */
    else if (t <= 12) e = 66 - (t - 10) * 25;
    else e = Math.max(5, 16 + (t - 12) * 0.5);
    harePts.push([t, Math.max(5, Math.min(100, e))]);
  }

  /* Tortoise: aerobic steady, barely drains */
  const tortPts: [number, number][] = [];
  for (let t = 0; t <= maxT; t += 0.5) {
    const e = 100 - t * 1.5;  /* loses 1.5%/min */
    tortPts.push([t, Math.max(10, e)]);
  }

  const pathOf = (pts: [number, number][]) =>
    pts.map(([t, e], i) => `${i === 0 ? "M" : "L"}${tX(t)},${eY(e)}`).join(" ");

  /* Threshold line */
  const exhaustionY = eY(15);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Energy over time diagram showing how a hare rapidly depletes energy through anaerobic sprinting while a tortoise slowly uses energy through aerobic metabolism">
        <rect width={w} height={h} rx={10} className="fill-slate-900" />

        <text x={w / 2} y={26} textAnchor="middle" className="fill-slate-100" style={{ fontSize: 16, fontWeight: 700 }}>
          Energy and Endurance — ATP Depletion
        </text>
        <text x={w / 2} y={44} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12 }}>
          Anaerobic (fast, wasteful) vs Aerobic (slow, efficient)
        </text>

        {/* Grid */}
        {[0, 5, 10, 15, 20, 25, 30].map(t => (
          <g key={`t${t}`}>
            <line x1={tX(t)} y1={top} x2={tX(t)} y2={bottom} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={tX(t)} y={bottom + 16} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11 }}>{t}</text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map(e => (
          <g key={`e${e}`}>
            <line x1={left} y1={eY(e)} x2={right} y2={eY(e)} className="stroke-slate-700" strokeWidth={0.5} />
            <text x={left - 8} y={eY(e) + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: 11 }}>{e}%</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-slate-400" strokeWidth={1.5} />
        <text x={(left + right) / 2} y={bottom + 36} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 12 }}>Time (minutes)</text>
        <text x={24} y={(top + bottom) / 2} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 12 }} transform={`rotate(-90 24 ${(top + bottom) / 2})`}>Energy remaining (%)</text>

        {/* Exhaustion threshold */}
        <line x1={left} y1={exhaustionY} x2={right} y2={exhaustionY} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={right + 4} y={exhaustionY + 4} className="fill-red-400" style={{ fontSize: 10 }}>exhaustion</text>

        {/* Anaerobic zone shading */}
        <rect x={left} y={top} width={tX(2) - left} height={graphH} fill="#f97316" fillOpacity={0.08} />
        <text x={tX(1)} y={top + 14} textAnchor="middle" className="fill-orange-300" style={{ fontSize: 10, fontWeight: 600 }}>
          ANAEROBIC
        </text>

        {/* Aerobic zone label */}
        <text x={tX(16)} y={top + 14} textAnchor="middle" className="fill-emerald-300" style={{ fontSize: 10, fontWeight: 600 }}>
          AEROBIC ZONE
        </text>

        {/* Hare path */}
        <path d={pathOf(harePts)} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Tortoise path */}
        <path d={pathOf(tortPts)} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" />

        {/* ATP callout */}
        <rect x={right - 195} y={top + 24} width={188} height={72} rx={6} className="fill-slate-800/90" />
        <text x={right - 101} y={top + 44} textAnchor="middle" className="fill-amber-300" style={{ fontSize: 12, fontWeight: 700 }}>
          ATP = energy currency
        </text>
        <text x={right - 101} y={top + 60} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 11 }}>
          Anaerobic: 2 ATP / glucose
        </text>
        <text x={right - 101} y={top + 76} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 11 }}>
          Aerobic: 36 ATP / glucose
        </text>
        <text x={right - 101} y={top + 92} textAnchor="middle" className="fill-cyan-300" style={{ fontSize: 11, fontWeight: 600 }}>
          18× more efficient!
        </text>

        {/* Legend */}
        <g>
          <rect x={left + 6} y={bottom - 55} width={180} height={48} rx={6} className="fill-slate-800/80" />
          <circle cx={left + 20} cy={bottom - 38} r={5} fill="#f97316" />
          <text x={left + 30} y={bottom - 34} className="fill-slate-200" style={{ fontSize: 12 }}>Hare (anaerobic sprint)</text>
          <circle cx={left + 20} cy={bottom - 18} r={5} fill="#22c55e" />
          <text x={left + 30} y={bottom - 14} className="fill-slate-200" style={{ fontSize: 12 }}>Tortoise (aerobic cruise)</text>
        </g>
      </svg>
    </div>
  );
}
