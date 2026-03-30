export default function GoldenRatioNatureDiagram() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Golden rectangle dimensions
  const grX = 30;
  const grY = 55;
  const phi = 1.618;
  const bSide = 100; // b dimension
  const aSide = Math.round(bSide * phi); // a dimension

  // Golden spiral arcs (quarter circles through golden rectangles)
  // We'll draw a simplified golden spiral
  const spiralPath = (() => {
    let cx = grX + aSide;
    let cy = grY + bSide;
    const arcs: string[] = [];
    let r = bSide;
    // approximate 5 quarter turns
    const centers = [
      { cx: grX + aSide - bSide, cy: grY + bSide, startAngle: 0, sweep: 1 },
      { cx: grX + aSide - bSide, cy: grY + bSide - (r * 0.618), startAngle: 90, sweep: 1 },
    ];
    // Simplified: just draw a nice logarithmic spiral approximation
    const points: string[] = [];
    for (let t = 0; t <= 720; t += 5) {
      const rad = toRad(t);
      const growth = 0.003;
      const scale = 3 * Math.exp(growth * t);
      const x = grX + aSide * 0.38 + Math.cos(rad) * scale;
      const y = grY + bSide * 0.55 - Math.sin(rad) * scale;
      points.push(`${x},${y}`);
    }
    return `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(" ");
  })();

  // Nautilus shell outline (simplified)
  const shellCx = 350;
  const shellCy = 145;

  const nautilus = (() => {
    const points: string[] = [];
    for (let t = 0; t <= 900; t += 3) {
      const rad = toRad(t);
      const scale = 4.5 * Math.exp(0.0025 * t);
      const x = shellCx - 20 + Math.cos(rad) * scale;
      const y = shellCy + 10 - Math.sin(rad) * scale;
      points.push(`${x},${y}`);
    }
    return `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(" ");
  })();

  // Sunflower seed spiral pattern
  const seedCx = 555;
  const seedCy = 130;
  const seeds: { x: number; y: number }[] = [];
  const goldenAngle = 137.508; // degrees
  for (let i = 1; i <= 120; i++) {
    const r = 3.5 * Math.sqrt(i);
    const theta = toRad(i * goldenAngle);
    seeds.push({
      x: seedCx + Math.cos(theta) * r,
      y: seedCy + Math.sin(theta) * r,
    });
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="The golden ratio in nature: spiral, rectangle, nautilus shell, and sunflower"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .sub { font-family: system-ui, sans-serif; font-size: 10px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          .math { font-family: system-ui, sans-serif; font-size: 12px; }
          .big-math { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
          .fib { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="670" height="380" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="335" y="28" textAnchor="middle" className="title fill-amber-300">
          The Golden Ratio in Nature
        </text>

        {/* === Golden Rectangle with Spiral === */}
        <g>
          {/* Outer rectangle: a+b wide, a tall? No: golden rect is a x b where a/b = phi */}
          {/* Using: width = a = 162, height = b = 100 */}
          <rect x={grX} y={grY} width={aSide} height={bSide}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Square portion */}
          <rect x={grX} y={grY} width={bSide} height={bSide}
            fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" opacity={0.15} />
          {/* Remaining rectangle */}
          <rect x={grX + bSide} y={grY} width={aSide - bSide} height={bSide}
            fill="#fde68a" stroke="#f59e0b" strokeWidth="1" opacity={0.1} />

          {/* Dimension labels */}
          <text x={grX + bSide / 2} y={grY + bSide + 18} textAnchor="middle" className="math fill-cyan-400">
            b
          </text>
          <text x={grX + bSide + (aSide - bSide) / 2} y={grY + bSide + 18} textAnchor="middle" className="math fill-cyan-400">
            a - b
          </text>
          {/* Top dimension */}
          <line x1={grX} y1={grY - 8} x2={grX + aSide} y2={grY - 8} stroke="#94a3b8" strokeWidth="0.8" />
          <text x={grX + aSide / 2} y={grY - 14} textAnchor="middle" className="math fill-slate-300">
            a
          </text>
          {/* Right dimension */}
          <text x={grX + aSide + 14} y={grY + bSide / 2 + 4} textAnchor="start" className="math fill-slate-300">
            b
          </text>

          {/* Golden spiral */}
          <path d={spiralPath} fill="none" stroke="#f59e0b" strokeWidth="2" opacity={0.8} />

          <text x={grX + aSide / 2} y={grY + bSide + 35} textAnchor="middle" className="label fill-amber-300">
            Golden Rectangle
          </text>
        </g>

        {/* === Nautilus Shell with Spiral === */}
        <g>
          {/* Shell outline - outer */}
          <ellipse cx={shellCx} cy={shellCy} rx={75} ry={68}
            className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="1.5" />
          {/* Spiral inside */}
          <path d={nautilus} fill="none" stroke="#f59e0b" strokeWidth="1.8" opacity={0.85} />
          {/* Chamber lines */}
          {[180, 270, 360, 450, 540].map((t, i) => {
            const rad = toRad(t);
            const s1 = 4.5 * Math.exp(0.0025 * t);
            const s2 = 4.5 * Math.exp(0.0025 * (t + 45));
            return (
              <line key={i}
                x1={shellCx - 20 + Math.cos(rad) * s1}
                y1={shellCy + 10 - Math.sin(rad) * s1}
                x2={shellCx - 20 + Math.cos(toRad(t + 45)) * s2}
                y2={shellCy + 10 - Math.sin(toRad(t + 45)) * s2}
                stroke="#94a3b8" strokeWidth="0.6" opacity={0.4}
              />
            );
          })}
          <text x={shellCx} y={230} textAnchor="middle" className="label fill-amber-300">
            Nautilus Shell
          </text>
        </g>

        {/* === Sunflower Seed Pattern === */}
        <g>
          {seeds.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y}
              r={1.8}
              fill={i % 2 === 0 ? "#fbbf24" : "#a16207"}
              opacity={0.8}
            />
          ))}
          {/* Outer circle */}
          <circle cx={seedCx} cy={seedCy} r={42} fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity={0.3} />
          <text x={seedCx} y={230} textAnchor="middle" className="label fill-amber-300">
            Sunflower Seeds
          </text>
          <text x={seedCx} y={246} textAnchor="middle" className="sub fill-slate-400">
            golden angle: 137.5
          </text>
        </g>

        {/* === Bottom: The Equation and Fibonacci === */}
        <g>
          {/* Divider */}
          <line x1="40" y1="270" x2="630" y2="270" stroke="#334155" strokeWidth="1" />

          {/* Ratio equation */}
          <text x="200" y="302" textAnchor="middle" className="big-math fill-cyan-400">
            (a + b) / a = a / b = 1.618...
          </text>
          <text x="200" y="322" textAnchor="middle" className="sub fill-slate-400">
            The golden ratio (phi)
          </text>

          {/* Fibonacci sequence */}
          <text x="500" y="295" textAnchor="middle" className="label fill-green-300">
            Fibonacci Numbers:
          </text>
          {/* Number boxes */}
          {[1, 1, 2, 3, 5, 8, 13].map((n, i) => {
            const bx = 395 + i * 32;
            return (
              <g key={i}>
                <rect x={bx} y={305} width={28} height={22} rx="3"
                  className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1" />
                <text x={bx + 14} y={320} textAnchor="middle" className="fib fill-green-300">
                  {n}
                </text>
              </g>
            );
          })}
          <text x="500" y="345" textAnchor="middle" className="sub fill-slate-400">
            Each number = sum of the two before it
          </text>

          {/* Connection arrows */}
          <text x="335" y="368" textAnchor="middle" className="sub fill-amber-400">
            Consecutive Fibonacci ratios approach the golden ratio: 8/5 = 1.6, 13/8 = 1.625 ...
          </text>
        </g>
      </svg>
    </div>
  );
}
