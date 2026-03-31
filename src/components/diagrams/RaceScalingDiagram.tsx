export default function RaceScalingDiagram() {
  const w = 620;
  const h = 440;

  /* Animals: name, mass (kg), topSpeed (m/s), relativeSpeed (body lengths/s), color */
  const animals: { name: string; mass: number; topSpeed: number; bodyLen: number; relSpeed: number; color: string; y: number }[] = [
    { name: "Ant",       mass: 0.001,  topSpeed: 0.05,  bodyLen: 0.003, relSpeed: 16.7, color: "#a78bfa", y: 68 },
    { name: "Mouse",     mass: 0.02,   topSpeed: 3.6,   bodyLen: 0.08,  relSpeed: 45,   color: "#f472b6", y: 128 },
    { name: "Hare",      mass: 4,      topSpeed: 19.4,  bodyLen: 0.5,   relSpeed: 38.8, color: "#f97316", y: 188 },
    { name: "Cheetah",   mass: 50,     topSpeed: 30,    bodyLen: 1.5,   relSpeed: 20,   color: "#fbbf24", y: 248 },
    { name: "Elephant",  mass: 5000,   topSpeed: 11,    bodyLen: 6,     relSpeed: 1.8,  color: "#94a3b8", y: 308 },
    { name: "Tortoise",  mass: 1,      topSpeed: 0.08,  bodyLen: 0.25,  relSpeed: 0.32, color: "#22c55e", y: 368 },
  ];

  const maxRel = 50;
  const barLeft = 200;
  const barRight = 570;
  const barW = barRight - barLeft;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Bar chart comparing how many body lengths per second different animals move, showing that small animals are faster relative to their size">
        <rect width={w} height={h} rx={10} className="fill-slate-900" />

        <text x={w / 2} y={28} textAnchor="middle" className="fill-slate-100" style={{ fontSize: 16, fontWeight: 700 }}>
          Relative Speed \u2014 Body Lengths per Second
        </text>
        <text x={w / 2} y={46} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 12 }}>
          Smaller animals are faster relative to their size
        </text>

        {/* Axis */}
        <line x1={barLeft} y1={55} x2={barLeft} y2={395} className="stroke-slate-500" strokeWidth={1} />
        {[0, 10, 20, 30, 40, 50].map(v => {
          const x = barLeft + (v / maxRel) * barW;
          return (
            <g key={v}>
              <line x1={x} y1={55} x2={x} y2={395} className="stroke-slate-700" strokeWidth={0.5} />
              <text x={x} y={410} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11 }}>{v}</text>
            </g>
          );
        })}
        <text x={(barLeft + barRight) / 2} y={432} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 12 }}>
          body lengths / second
        </text>

        {/* Bars */}
        {animals.map(a => {
          const bw = (a.relSpeed / maxRel) * barW;
          return (
            <g key={a.name}>
              <text x={barLeft - 10} y={a.y + 4} textAnchor="end" className="fill-slate-200" style={{ fontSize: 13, fontWeight: 600 }}>
                {a.name}
              </text>
              <rect x={barLeft} y={a.y - 12} width={Math.max(bw, 2)} height={24} rx={4} fill={a.color} fillOpacity={0.7} />
              <rect x={barLeft} y={a.y - 12} width={Math.max(bw, 2)} height={24} rx={4} fill="none" stroke={a.color} strokeWidth={1.5} />
              <text x={barLeft + bw + 6} y={a.y + 5} className="fill-slate-300" style={{ fontSize: 11 }}>
                {a.relSpeed.toFixed(1)} BL/s
              </text>
              <text x={barLeft - 10} y={a.y + 18} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10 }}>
                ({a.topSpeed.toFixed(1)} m/s actual)
              </text>
            </g>
          );
        })}

        {/* Froude number callout */}
        <rect x={20} y={55} width={170} height={70} rx={8} className="fill-slate-800/90" />
        <text x={105} y={74} textAnchor="middle" className="fill-amber-300" style={{ fontSize: 12, fontWeight: 700 }}>
          Froude Number
        </text>
        <text x={105} y={92} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 11 }}>
          Fr = v\u00b2 / (g \u00d7 leg length)
        </text>
        <text x={105} y={108} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          Animals with similar Fr
        </text>
        <text x={105} y={120} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          move in similar gaits
        </text>
      </svg>
    </div>
  );
}
