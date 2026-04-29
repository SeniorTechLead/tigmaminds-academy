export default function ActivityMandalaDiagram() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Step positions (4 steps in a row)
  const steps = [
    { cx: 95, cy: 190, label: "Step 1", desc: "Draw a circle" },
    { cx: 255, cy: 190, label: "Step 2", desc: "Add concentric rings" },
    { cx: 415, cy: 190, label: "Step 3", desc: "Divide into 8 slices" },
    { cx: 575, cy: 190, label: "Step 4", desc: "Fill with motifs" },
  ];

  const mainR = 70;

  // Petal motif path for one slice (within a ~45 degree wedge)
  const petalMotif = (cx: number, cy: number, sliceAngle: number) => {
    const mid = toRad(sliceAngle);
    const inner = 22;
    const outer = 58;
    const tipX = cx + Math.cos(mid) * outer;
    const tipY = cy + Math.sin(mid) * outer;
    const baseL = toRad(sliceAngle - 12);
    const baseR = toRad(sliceAngle + 12);
    return `M ${cx + Math.cos(baseL) * inner},${cy + Math.sin(baseL) * inner}
            Q ${cx + Math.cos(mid) * (outer * 0.7)},${cy + Math.sin(mid) * (outer * 0.7)} ${tipX},${tipY}
            Q ${cx + Math.cos(mid) * (outer * 0.7)},${cy + Math.sin(mid) * (outer * 0.7)} ${cx + Math.cos(baseR) * inner},${cy + Math.sin(baseR) * inner}
            Z`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 670 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step by step mandala drawing guide: circle, rings, slices, motifs"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .sub { font-family: system-ui, sans-serif; font-size: 10px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          .step-num { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; }
          .desc { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="670" height="370" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="335" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Draw Your Own Mandala
        </text>

        {/* Step number badges */}
        {steps.map((s, i) => (
          <g key={`badge-${i}`}>
            <rect x={s.cx - 28} y={78} width={56} height={20} rx="10"
              fill={i === 3 ? "#f59e0b" : "#3b82f6"} opacity={0.9} />
            <text x={s.cx} y={92} textAnchor="middle" className="step-num fill-white">
              {s.label}
            </text>
          </g>
        ))}

        {/* === Step 1: Single circle with center dot === */}
        <g>
          <circle cx={steps[0].cx} cy={steps[0].cy} r={mainR}
            fill="none" stroke="#60a5fa" strokeWidth="2" />
          {/* Center dot */}
          <circle cx={steps[0].cx} cy={steps[0].cy} r={3} fill="#f59e0b" />
          {/* Compass hint: a small V shape */}
          <path d={`M ${steps[0].cx - 3},${steps[0].cy} L ${steps[0].cx},${steps[0].cy - 8} L ${steps[0].cx + 3},${steps[0].cy}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Radius line */}
          <line x1={steps[0].cx} y1={steps[0].cy} x2={steps[0].cx + mainR} y2={steps[0].cy}
            stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
          <text x={steps[0].cx + mainR / 2} y={steps[0].cy - 6} textAnchor="middle" className="sub fill-slate-400">
            radius
          </text>
          {/* Description */}
          <text x={steps[0].cx} y={285} textAnchor="middle" className="desc fill-slate-300">
            Use a compass to draw
          </text>
          <text x={steps[0].cx} y={298} textAnchor="middle" className="desc fill-slate-300">
            a perfect circle
          </text>
        </g>

        {/* Arrow 1->2 */}
        <line x1={170} y1={190} x2={180} y2={190}
          stroke="#64748b" strokeWidth="1.5" markerEnd="url(#stepArrow)" />

        {/* === Step 2: Concentric rings === */}
        <g>
          {[mainR, mainR * 0.72, mainR * 0.48, mainR * 0.25].map((r, i) => (
            <circle key={i} cx={steps[1].cx} cy={steps[1].cy} r={r}
              fill="none" stroke="#60a5fa" strokeWidth={i === 0 ? 2 : 1.2}
              opacity={i === 0 ? 1 : 0.6} />
          ))}
          <circle cx={steps[1].cx} cy={steps[1].cy} r={3} fill="#f59e0b" />
          {/* Ring labels */}
          <text x={steps[1].cx + 52} y={steps[1].cy - 52} className="sub fill-cyan-400">ring 1</text>
          <text x={steps[1].cx + 38} y={steps[1].cy - 30} className="sub fill-cyan-400">ring 2</text>
          {/* Description */}
          <text x={steps[1].cx} y={285} textAnchor="middle" className="desc fill-slate-300">
            Draw 3-4 rings inside,
          </text>
          <text x={steps[1].cx} y={298} textAnchor="middle" className="desc fill-slate-300">
            evenly spaced
          </text>
        </g>

        {/* Arrow 2->3 */}
        <line x1={330} y1={190} x2={340} y2={190}
          stroke="#64748b" strokeWidth="1.5" markerEnd="url(#stepArrow)" />

        {/* === Step 3: Divided into 8 slices === */}
        <g>
          {/* Rings */}
          {[mainR, mainR * 0.72, mainR * 0.48, mainR * 0.25].map((r, i) => (
            <circle key={i} cx={steps[2].cx} cy={steps[2].cy} r={r}
              fill="none" stroke="#60a5fa" strokeWidth={i === 0 ? 2 : 1.2}
              opacity={i === 0 ? 1 : 0.6} />
          ))}
          {/* 8 dividing lines through center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = toRad(i * 45);
            return (
              <line key={i}
                x1={steps[2].cx + Math.cos(angle) * mainR}
                y1={steps[2].cy + Math.sin(angle) * mainR}
                x2={steps[2].cx - Math.cos(angle) * mainR}
                y2={steps[2].cy - Math.sin(angle) * mainR}
                stroke="#f59e0b" strokeWidth="1" opacity={0.6}
              />
            );
          })}
          <circle cx={steps[2].cx} cy={steps[2].cy} r={3} fill="#f59e0b" />
          {/* Angle label */}
          <path d={`M ${steps[2].cx + 18},${steps[2].cy} A 18,18 0 0,0 ${steps[2].cx + 18 * Math.cos(toRad(-45))},${steps[2].cy + 18 * Math.sin(toRad(-45))}`}
            fill="none" stroke="#22d3ee" strokeWidth="1.2" />
          <text x={steps[2].cx + 28} y={steps[2].cy - 10} className="sub fill-cyan-400">45</text>
          {/* Description */}
          <text x={steps[2].cx} y={285} textAnchor="middle" className="desc fill-slate-300">
            Draw lines through center:
          </text>
          <text x={steps[2].cx} y={298} textAnchor="middle" className="desc fill-slate-300">
            360 / 8 = 45 per slice
          </text>
        </g>

        {/* Arrow 3->4 */}
        <line x1={490} y1={190} x2={500} y2={190}
          stroke="#64748b" strokeWidth="1.5" markerEnd="url(#stepArrow)" />

        {/* === Step 4: Filled mandala === */}
        <g>
          {/* Outer ring */}
          <circle cx={steps[3].cx} cy={steps[3].cy} r={mainR}
            fill="none" stroke="#f59e0b" strokeWidth="2" />

          {/* Outer petal ring (8 petals) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = -90 + i * 45;
            return (
              <path key={`op-${i}`}
                d={petalMotif(steps[3].cx, steps[3].cy, angle)}
                fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1" opacity={0.8}
              />
            );
          })}

          {/* Middle ring decorations */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = toRad(-90 + i * 45 + 22.5);
            const r = 35;
            return (
              <circle key={`md-${i}`}
                cx={steps[3].cx + Math.cos(angle) * r}
                cy={steps[3].cy + Math.sin(angle) * r}
                r={5} fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" opacity={0.7}
              />
            );
          })}

          {/* Inner petals (8 smaller) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = -90 + i * 45 + 22.5;
            const rad = toRad(angle);
            const tipR = 25;
            const tipX = steps[3].cx + Math.cos(rad) * tipR;
            const tipY = steps[3].cy + Math.sin(rad) * tipR;
            const lR = toRad(angle - 10);
            const rR = toRad(angle + 10);
            const baseR = 10;
            return (
              <path key={`ip-${i}`}
                d={`M ${steps[3].cx + Math.cos(lR) * baseR},${steps[3].cy + Math.sin(lR) * baseR}
                    L ${tipX},${tipY}
                    L ${steps[3].cx + Math.cos(rR) * baseR},${steps[3].cy + Math.sin(rR) * baseR} Z`}
                fill="#86efac" stroke="#22c55e" strokeWidth="0.8" opacity={0.7}
              />
            );
          })}

          {/* Center flower */}
          <circle cx={steps[3].cx} cy={steps[3].cy} r={8} fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx={steps[3].cx} cy={steps[3].cy} r={3} fill="#f59e0b" />

          {/* Slice lines (faint) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = toRad(i * 45);
            return (
              <line key={`sl-${i}`}
                x1={steps[3].cx + Math.cos(angle) * mainR}
                y1={steps[3].cy + Math.sin(angle) * mainR}
                x2={steps[3].cx - Math.cos(angle) * mainR}
                y2={steps[3].cy - Math.sin(angle) * mainR}
                stroke="#f59e0b" strokeWidth="0.5" opacity={0.25}
              />
            );
          })}

          {/* Description */}
          <text x={steps[3].cx} y={285} textAnchor="middle" className="desc fill-slate-300">
            Design one slice, then
          </text>
          <text x={steps[3].cx} y={298} textAnchor="middle" className="desc fill-slate-300">
            copy it to all 8!
          </text>
        </g>

        <defs>
          <marker id="stepArrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0,0 7,2.5 0,5" className="fill-gray-400 dark:fill-slate-500" />
          </marker>
        </defs>

        {/* Bottom tips */}
        <line x1="40" y1="318" x2="630" y2="318" stroke="#334155" strokeWidth="1" />
        <text x="335" y="340" textAnchor="middle" className="label fill-green-300">
          Materials: compass, ruler, pencil, coloured pens
        </text>
        <text x="335" y="358" textAnchor="middle" className="sub fill-slate-400">
          Tip: Start with pencil so you can erase, then go over in colour!
        </text>
      </svg>
    </div>
  );
}
