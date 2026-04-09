import { useState } from 'react';

const DARK_BG = 'bg-gray-900';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider';

/* ════════════════════════════════════════════
   1. AngleExplorer — drag to change angle, see classification
   ════════════════════════════════════════════ */
export function AngleExplorer() {
  const [angle, setAngle] = useState(45);

  const classify = (deg: number): string => {
    if (deg === 0) return 'Zero';
    if (deg < 90) return 'Acute';
    if (deg === 90) return 'Right';
    if (deg < 180) return 'Obtuse';
    if (deg === 180) return 'Straight';
    if (deg < 360) return 'Reflex';
    return 'Full rotation';
  };

  const classColor = (deg: number): string => {
    if (deg === 90) return 'text-emerald-400';
    if (deg < 90) return 'text-sky-400';
    if (deg < 180) return 'text-amber-400';
    if (deg === 180) return 'text-orange-400';
    return 'text-rose-400';
  };

  const W = 280, H = 200;
  const cx = W / 2, cy = H / 2 + 10;
  const R = 70;
  const arcR = 30;

  const rad = (angle * Math.PI) / 180;
  const ex = cx + R * Math.cos(-rad);
  const ey = cy - R * Math.sin(-rad) + rad * 0; // keep y correct
  const endX = cx + R * Math.cos(rad);
  const endY = cy - R * Math.sin(rad);

  // Ray 1 is horizontal to the right
  const ray1X = cx + R;
  const ray1Y = cy;

  // Ray 2 at the angle (measured counter-clockwise from ray 1)
  const ray2X = cx + R * Math.cos((angle * Math.PI) / 180);
  const ray2Y = cy - R * Math.sin((angle * Math.PI) / 180);

  // Arc path
  const arcEndX = cx + arcR * Math.cos((angle * Math.PI) / 180);
  const arcEndY = cy - arcR * Math.sin((angle * Math.PI) / 180);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Angle Explorer</span>
        <span className={`font-mono text-sm font-bold ${classColor(angle)}`}>{classify(angle)}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} fill="#111827" />

        {/* Ray 1 — horizontal */}
        <line x1={cx} y1={cy} x2={ray1X} y2={ray1Y} stroke="#6b7280" strokeWidth={2} strokeLinecap="round" />

        {/* Ray 2 — at angle */}
        <line x1={cx} y1={cy} x2={ray2X} y2={ray2Y} stroke="#22c55e" strokeWidth={2} strokeLinecap="round" />

        {/* Arc */}
        {angle > 0 && angle < 360 && (
          <path
            d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`}
            fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray={angle === 90 ? '0' : '4 2'}
          />
        )}

        {/* Right angle square */}
        {angle === 90 && (
          <path
            d={`M ${cx + 15} ${cy} L ${cx + 15} ${cy - 15} L ${cx} ${cy - 15}`}
            fill="none" stroke="#22c55e" strokeWidth={1.5}
          />
        )}

        {/* Vertex dot */}
        <circle cx={cx} cy={cy} r={4} fill="#f59e0b" />

        {/* Degree label */}
        <text
          x={cx + (arcR + 14) * Math.cos((angle * Math.PI) / 360)}
          y={cy - (arcR + 14) * Math.sin((angle * Math.PI) / 360)}
          fill="#f59e0b" fontSize={12} fontFamily="monospace" textAnchor="middle"
        >
          {angle}°
        </text>
      </svg>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-12">0°</span>
        <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)}
          className="flex-1 accent-emerald-500" />
        <span className="text-xs text-gray-400 w-12 text-right">360°</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {angle}° is {classify(angle).toLowerCase()}
        {angle === 90 && ' — perpendicular lines form right angles'}
        {angle === 180 && ' — a straight line'}
        {angle === 360 && ' — a full rotation'}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. TriangleExplorer — three angles, always sum to 180
   ════════════════════════════════════════════ */
export function TriangleExplorer() {
  const [a, setA] = useState(60);
  const [b, setB] = useState(60);

  // C is derived so they always sum to 180
  const c = 180 - a - b;
  const valid = c > 0 && a > 0 && b > 0;

  const classifyShape = (): string => {
    if (!valid) return 'Invalid';
    const sorted = [a, b, c].sort((x, y) => x - y);
    if (sorted[0] === sorted[2]) return 'Equilateral';
    if (sorted[0] === sorted[1] || sorted[1] === sorted[2]) return 'Isosceles';
    return 'Scalene';
  };

  const classifyAngle = (): string => {
    if (!valid) return '';
    const mx = Math.max(a, b, c);
    if (mx > 90) return 'Obtuse';
    if (mx === 90) return 'Right';
    return 'Acute';
  };

  // Build triangle in SVG using angles. Place bottom side horizontal, compute vertices.
  const W = 280, H = 200;

  // Use law of sines to compute side lengths relative to a base
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const sinA = Math.sin(toRad(a));
  const sinB = Math.sin(toRad(b));
  const sinC = Math.sin(toRad(c));

  // Side opposite to angle: a_side/sin(A) = b_side/sin(B) = c_side/sin(C)
  // Let side opposite C (between vertices A and B) = base = 1
  const base = 1;
  const sideA = valid ? (base * sinA) / sinC : 0; // opposite angle A
  const sideB = valid ? (base * sinB) / sinC : 0; // opposite angle B

  // Place vertex C at origin, vertex B at (base, 0)
  // Vertex A is at angle B from vertex C
  const Ax = valid ? sideB * Math.cos(toRad(b)) : 0;
  const Ay = valid ? sideB * Math.sin(toRad(b)) : 0;

  // Scale and center
  const rawPts = valid ? [
    { x: 0, y: 0 },       // C
    { x: base, y: 0 },    // B
    { x: Ax, y: Ay },     // A
  ] : [];

  let pts: { x: number; y: number }[] = [];
  if (valid && rawPts.length === 3) {
    const xs = rawPts.map(p => p.x);
    const ys = rawPts.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const sw = maxX - minX || 1, sh = maxY - minY || 1;
    const PAD = 30;
    const scaleF = Math.min((W - PAD * 2) / sw, (H - PAD * 2) / sh);
    const offX = (W - sw * scaleF) / 2;
    const offY = (H - sh * scaleF) / 2;
    pts = rawPts.map(p => ({
      x: offX + (p.x - minX) * scaleF,
      y: H - (offY + (p.y - minY) * scaleF), // flip y
    }));
  }

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Triangle Explorer</span>
        {valid && (
          <span className="font-mono text-sm text-emerald-400">{classifyShape()} &middot; {classifyAngle()}</span>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} fill="#111827" />

        {valid && pts.length === 3 ? (
          <>
            {/* Triangle fill */}
            <polygon
              points={pts.map(p => `${p.x},${p.y}`).join(' ')}
              fill="#22c55e" fillOpacity={0.1} stroke="#22c55e" strokeWidth={2} strokeLinejoin="round"
            />

            {/* Angle labels */}
            {[
              { pt: pts[0], val: c, label: 'C' },
              { pt: pts[1], val: a, label: 'A' },
              { pt: pts[2], val: b, label: 'B' },
            ].map(({ pt, val, label }) => {
              // offset label away from triangle center
              const centX = (pts[0].x + pts[1].x + pts[2].x) / 3;
              const centY = (pts[0].y + pts[1].y + pts[2].y) / 3;
              const dx = pt.x - centX, dy = pt.y - centY;
              const d = Math.sqrt(dx * dx + dy * dy) || 1;
              const ox = pt.x + (dx / d) * 18;
              const oy = pt.y + (dy / d) * 18;
              return (
                <text key={label} x={ox} y={oy} fill="#f59e0b" fontSize={10} fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
                  {val}°
                </text>
              );
            })}

            {/* Vertex dots */}
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3} fill="#f59e0b" />
            ))}
          </>
        ) : (
          <text x={W / 2} y={H / 2} fill="#ef4444" fontSize={12} textAnchor="middle">
            Invalid — angles must be positive (C = {c}°)
          </text>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Angle A</span><span className="font-mono text-sky-400">{a}°</span>
          </div>
          <input type="range" min={1} max={178} value={a}
            onChange={e => { const v = +e.target.value; if (180 - v - b > 0) setA(v); }}
            className="w-full accent-sky-500" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Angle B</span><span className="font-mono text-violet-400">{b}°</span>
          </div>
          <input type="range" min={1} max={178} value={b}
            onChange={e => { const v = +e.target.value; if (180 - a - v > 0) setB(v); }}
            className="w-full accent-violet-500" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-gray-500">A + B + C =</span>
        <span className="font-mono text-emerald-400 font-bold">{a} + {b} + {c} = 180°</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. ProbabilityDice — roll two dice, track frequency
   ════════════════════════════════════════════ */
const DICE_DOTS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};

function DiceFace({ value, x, y, size }: { value: number; x: number; y: number; size: number }) {
  const pad = size * 0.18;
  const step = (size - pad * 2) / 2;
  const dots = DICE_DOTS[value] || [];
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.12} fill="#1f2937" stroke="#4b5563" strokeWidth={1.5} />
      {dots.map(([col, row], i) => (
        <circle key={i} cx={x + pad + col * step} cy={y + pad + row * step} r={size * 0.07} fill="white" />
      ))}
    </g>
  );
}

export function ProbabilityDice() {
  const [die1, setDie1] = useState(3);
  const [die2, setDie2] = useState(4);
  const [freq, setFreq] = useState<Record<number, number>>({});
  const [totalRolls, setTotalRolls] = useState(0);

  const roll = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDie1(d1);
    setDie2(d2);
    const sum = d1 + d2;
    setFreq(prev => ({ ...prev, [sum]: (prev[sum] || 0) + 1 }));
    setTotalRolls(prev => prev + 1);
  };

  const roll100 = () => {
    const newFreq = { ...freq };
    for (let i = 0; i < 100; i++) {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      newFreq[sum] = (newFreq[sum] || 0) + 1;
      if (i === 99) { setDie1(d1); setDie2(d2); }
    }
    setFreq(newFreq);
    setTotalRolls(prev => prev + 100);
  };

  const reset = () => { setFreq({}); setTotalRolls(0); };

  // Expected probability for sum of two dice: ways/36
  const expectedWays: Record<number, number> = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };

  const W = 300, H = 140;
  const barW = 18, gap = 4;
  const maxFreq = Math.max(1, ...Object.values(freq));
  const barArea = H - 30;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Dice Probability</span>
        <span className="text-xs text-gray-500">{totalRolls} rolls</span>
      </div>

      {/* Dice display */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <svg viewBox="0 0 50 50" className="w-12 h-12">
          <DiceFace value={die1} x={2} y={2} size={46} />
        </svg>
        <span className="text-lg font-bold text-gray-500">+</span>
        <svg viewBox="0 0 50 50" className="w-12 h-12">
          <DiceFace value={die2} x={2} y={2} size={46} />
        </svg>
        <span className="text-lg font-bold text-gray-500">=</span>
        <span className="text-2xl font-mono font-bold text-amber-400">{die1 + die2}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-2 mb-3">
        <button onClick={roll}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
          Roll
        </button>
        <button onClick={roll100}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
          Roll 100x
        </button>
        <button onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
          Reset
        </button>
      </div>

      {/* Frequency bar chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect width={W} height={H} rx={4} fill="#111827" />
        {Array.from({ length: 11 }, (_, i) => i + 2).map((sum, i) => {
          const f = freq[sum] || 0;
          const barH = totalRolls > 0 ? (f / maxFreq) * barArea : 0;
          const x = 14 + i * (barW + gap);
          const expectedH = totalRolls > 0 ? ((expectedWays[sum] / 36) * totalRolls / maxFreq) * barArea : 0;

          return (
            <g key={sum}>
              {/* Actual frequency bar */}
              <rect x={x} y={H - 18 - barH} width={barW} height={barH}
                fill="#22c55e" fillOpacity={0.7} rx={2} />
              {/* Expected line */}
              {totalRolls > 0 && (
                <line x1={x - 1} y1={H - 18 - expectedH} x2={x + barW + 1} y2={H - 18 - expectedH}
                  stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
              )}
              {/* Sum label */}
              <text x={x + barW / 2} y={H - 5} fill="#9ca3af" fontSize={8} textAnchor="middle" fontFamily="monospace">
                {sum}
              </text>
              {/* Count */}
              {f > 0 && (
                <text x={x + barW / 2} y={H - 22 - barH} fill="#d1d5db" fontSize={7} textAnchor="middle" fontFamily="monospace">
                  {f}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-2 bg-emerald-500 rounded-sm opacity-70" /> Actual
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-amber-500" style={{ borderTop: '2px dashed #f59e0b' }} /> Expected
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. GaussianExplorer — bell curve with sigma regions
   ════════════════════════════════════════════ */
export function GaussianExplorer() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  const W = 300, H = 180, PAD = 30;

  // Gaussian PDF
  const gauss = (x: number): number => {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return coeff * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
  };

  // Plot range: mu +/- 4*sigma, at least [-4, 4]
  const lo = Math.min(-4, mu - 4 * sigma);
  const hi = Math.max(4, mu + 4 * sigma);

  const scaleX = (x: number) => PAD + ((x - lo) / (hi - lo)) * (W - PAD * 2);
  const maxY = gauss(mu);
  const scaleY = (y: number) => H - PAD - (y / (maxY * 1.15)) * (H - PAD * 2);

  // Build curve path
  const steps = 120;
  const curvePts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = lo + (i / steps) * (hi - lo);
    const sx = scaleX(x);
    const sy = scaleY(gauss(x));
    curvePts.push(`${i === 0 ? 'M' : 'L'} ${sx} ${sy}`);
  }
  const curvePath = curvePts.join(' ');

  // Shaded regions for sigma bands
  const buildFill = (from: number, to: number): string => {
    const pts: string[] = [];
    const n = 60;
    const clampFrom = Math.max(lo, from);
    const clampTo = Math.min(hi, to);
    pts.push(`M ${scaleX(clampFrom)} ${scaleY(0)}`);
    for (let i = 0; i <= n; i++) {
      const x = clampFrom + (i / n) * (clampTo - clampFrom);
      pts.push(`L ${scaleX(x)} ${scaleY(gauss(x))}`);
    }
    pts.push(`L ${scaleX(clampTo)} ${scaleY(0)} Z`);
    return pts.join(' ');
  };

  const regions = [
    { from: mu - 3 * sigma, to: mu + 3 * sigma, color: '#3b82f6', opacity: 0.08, label: '99.7%' },
    { from: mu - 2 * sigma, to: mu + 2 * sigma, color: '#8b5cf6', opacity: 0.12, label: '95%' },
    { from: mu - sigma, to: mu + sigma, color: '#22c55e', opacity: 0.18, label: '68%' },
  ];

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Gaussian / Normal Distribution</span>
        <span className="font-mono text-xs text-gray-400">68-95-99.7 Rule</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} fill="#111827" />

        {/* Sigma shaded regions */}
        {regions.map(({ from, to, color, opacity, label }) => (
          <path key={label} d={buildFill(from, to)} fill={color} opacity={opacity} />
        ))}

        {/* X axis */}
        <line x1={PAD} y1={scaleY(0)} x2={W - PAD} y2={scaleY(0)} stroke="#374151" strokeWidth={1} />

        {/* Sigma markers */}
        {[-3, -2, -1, 0, 1, 2, 3].map(n => {
          const x = mu + n * sigma;
          if (x < lo || x > hi) return null;
          return (
            <g key={n}>
              <line x1={scaleX(x)} y1={scaleY(0) - 3} x2={scaleX(x)} y2={scaleY(0) + 3} stroke="#6b7280" strokeWidth={1} />
              <text x={scaleX(x)} y={scaleY(0) + 14} fill="#6b7280" fontSize={7} textAnchor="middle" fontFamily="monospace">
                {n === 0 ? 'μ' : `${n > 0 ? '+' : ''}${n}σ`}
              </text>
            </g>
          );
        })}

        {/* Curve */}
        <path d={curvePath} fill="none" stroke="#22c55e" strokeWidth={2} />

        {/* Region labels */}
        <text x={scaleX(mu)} y={scaleY(maxY * 0.5)} fill="#22c55e" fontSize={9} textAnchor="middle" fontWeight="bold">68%</text>
        <text x={scaleX(mu - 1.5 * sigma)} y={scaleY(maxY * 0.15)} fill="#8b5cf6" fontSize={8} textAnchor="middle">95%</text>
        <text x={scaleX(mu - 2.5 * sigma)} y={scaleY(maxY * 0.05)} fill="#3b82f6" fontSize={7} textAnchor="middle">99.7%</text>
      </svg>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Mean (μ)</span><span className="font-mono text-emerald-400">{mu.toFixed(1)}</span>
          </div>
          <input type="range" min={-3} max={3} step={0.1} value={mu} onChange={e => setMu(+e.target.value)}
            className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Std Dev (σ)</span><span className="font-mono text-amber-400">{sigma.toFixed(1)}</span>
          </div>
          <input type="range" min={0.3} max={3} step={0.1} value={sigma} onChange={e => setSigma(+e.target.value)}
            className="w-full accent-amber-500" />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        μ = {mu.toFixed(1)}, σ = {sigma.toFixed(1)} — about 68% of data falls within 1σ of the mean
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   5. DerivativeVisualizer — tangent line at a point on a curve
   ════════════════════════════════════════════ */
const FUNCTIONS: Record<string, { label: string; fn: (x: number) => number; deriv: (x: number) => number }> = {
  'x²': { label: 'x²', fn: x => x * x, deriv: x => 2 * x },
  'x³': { label: 'x³', fn: x => x * x * x, deriv: x => 3 * x * x },
  'sin(x)': { label: 'sin(x)', fn: x => Math.sin(x), deriv: x => Math.cos(x) },
};

export function DerivativeVisualizer() {
  const [funcKey, setFuncKey] = useState<string>('x²');
  const [t, setT] = useState(1);

  const { fn, deriv, label } = FUNCTIONS[funcKey];
  const slope = deriv(t);
  const yAtT = fn(t);

  const W = 300, H = 200, PAD = 30;
  const xMin = -3, xMax = 3;
  const samples = 150;

  // Compute y range dynamically
  const ys: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i / samples) * (xMax - xMin);
    ys.push(fn(x));
  }
  const yMinRaw = Math.min(...ys, -1);
  const yMaxRaw = Math.max(...ys, 1);
  const yPad = (yMaxRaw - yMinRaw) * 0.1 || 1;
  const yMin = yMinRaw - yPad;
  const yMax = yMaxRaw + yPad;

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  // Curve path
  const curvePts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i / samples) * (xMax - xMin);
    curvePts.push(`${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(fn(x))}`);
  }

  // Tangent line: y - yAtT = slope * (x - t) => y = slope*(x-t) + yAtT
  const tanLen = 1.5;
  const tx1 = t - tanLen, ty1 = slope * (tx1 - t) + yAtT;
  const tx2 = t + tanLen, ty2 = slope * (tx2 - t) + yAtT;

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Derivative Visualizer</span>
        <select value={funcKey} onChange={e => setFuncKey(e.target.value)}
          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white">
          {Object.keys(FUNCTIONS).map(k => <option key={k} value={k}>f(x) = {k}</option>)}
        </select>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} fill="#111827" />

        {/* Grid lines at integer positions */}
        {Array.from({ length: 7 }, (_, i) => i - 3).map(n => (
          <g key={`g${n}`}>
            {n >= xMin && n <= xMax && (
              <line x1={sx(n)} y1={PAD} x2={sx(n)} y2={H - PAD} stroke="#1f2937" strokeWidth={0.5} />
            )}
          </g>
        ))}

        {/* Axes */}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#4b5563" strokeWidth={1} />
        )}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#4b5563" strokeWidth={1} />
        )}

        {/* Curve */}
        <path d={curvePts.join(' ')} fill="none" stroke="#22c55e" strokeWidth={2} />

        {/* Tangent line */}
        <line x1={sx(tx1)} y1={sy(ty1)} x2={sx(tx2)} y2={sy(ty2)}
          stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 3" />

        {/* Point on curve */}
        <circle cx={sx(t)} cy={sy(yAtT)} r={5} fill="#ef4444" stroke="white" strokeWidth={1.5} />

        {/* Label */}
        <text x={sx(t) + 10} y={sy(yAtT) - 10} fill="#ef4444" fontSize={9} fontFamily="monospace">
          ({t.toFixed(1)}, {yAtT.toFixed(2)})
        </text>
      </svg>

      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Point x</span>
          <span className="font-mono text-sky-400">{t.toFixed(1)}</span>
        </div>
        <input type="range" min={-2.5} max={2.5} step={0.1} value={t} onChange={e => setT(+e.target.value)}
          className="w-full accent-sky-500" />
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800">
        <span className="text-xs text-gray-400">f({t.toFixed(1)}) = {yAtT.toFixed(3)}</span>
        <span className="text-xs text-gray-400">
          f'({t.toFixed(1)}) = <span className="font-bold text-amber-400">{slope.toFixed(3)}</span>
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        The dashed line is tangent to f(x) = {label} at x = {t.toFixed(1)} — its slope is the derivative
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   6. AreaUnderCurve — Riemann sums and integration
   ════════════════════════════════════════════ */
const INTEG_FNS: Record<string, {
  label: string;
  fn: (x: number) => number;
  antideriv: (x: number) => number;
}> = {
  'x²': { label: 'x²', fn: x => x * x, antideriv: x => (x ** 3) / 3 },
  'x³': { label: 'x³', fn: x => x * x * x, antideriv: x => (x ** 4) / 4 },
  'sin(x)': { label: 'sin(x)', fn: x => Math.sin(x), antideriv: x => -Math.cos(x) },
  '1+x': { label: '1+x', fn: x => 1 + x, antideriv: x => x + (x * x) / 2 },
};

export function AreaUnderCurve() {
  const [funcKey, setFuncKey] = useState<string>('x²');
  const [aVal, setAVal] = useState(0);
  const [bVal, setBVal] = useState(2);
  const [nRects, setNRects] = useState(10);

  const { fn, antideriv, label } = INTEG_FNS[funcKey];

  // Exact area via antiderivative
  const exactArea = antideriv(bVal) - antideriv(aVal);

  // Riemann sum (left endpoint)
  const dx = (bVal - aVal) / nRects;
  let riemannSum = 0;
  for (let i = 0; i < nRects; i++) {
    riemannSum += fn(aVal + i * dx) * dx;
  }

  const W = 300, H = 200, PAD = 30;
  const xMin = -1, xMax = 4;

  // Y range
  const yPts: number[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    yPts.push(fn(x));
  }
  const yMinRaw = Math.min(0, ...yPts);
  const yMaxRaw = Math.max(1, ...yPts);
  const yPadding = (yMaxRaw - yMinRaw) * 0.1 || 0.5;
  const yMin = yMinRaw - yPadding;
  const yMax = yMaxRaw + yPadding;

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  // Curve path
  const curvePts: string[] = [];
  const samples = 150;
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i / samples) * (xMax - xMin);
    curvePts.push(`${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(fn(x))}`);
  }

  // Shaded area path
  const fillPts: string[] = [];
  const fillN = 80;
  const a = Math.min(aVal, bVal);
  const b = Math.max(aVal, bVal);
  fillPts.push(`M ${sx(a)} ${sy(0)}`);
  for (let i = 0; i <= fillN; i++) {
    const x = a + (i / fillN) * (b - a);
    fillPts.push(`L ${sx(x)} ${sy(fn(x))}`);
  }
  fillPts.push(`L ${sx(b)} ${sy(0)} Z`);

  const N_OPTIONS = [2, 5, 10, 20, 50];

  return (
    <div className={`${DARK_BG} rounded-xl p-4 max-w-md mx-auto my-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${LABEL} text-gray-500`}>Area Under Curve (Integration)</span>
        <select value={funcKey} onChange={e => setFuncKey(e.target.value)}
          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white">
          {Object.keys(INTEG_FNS).map(k => <option key={k} value={k}>f(x) = {k}</option>)}
        </select>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-3">
        <rect width={W} height={H} rx={4} fill="#111827" />

        {/* Axes */}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#4b5563" strokeWidth={1} />
        )}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#4b5563" strokeWidth={1} />
        )}

        {/* Riemann rectangles */}
        {aVal < bVal && Array.from({ length: nRects }, (_, i) => {
          const rx = aVal + i * dx;
          const ry = fn(rx);
          const rTop = Math.max(ry, 0);
          const rBot = Math.min(ry, 0);
          return (
            <rect key={i}
              x={sx(rx)} y={sy(rTop)}
              width={Math.max(0, sx(rx + dx) - sx(rx))}
              height={Math.max(0, sy(rBot) - sy(rTop))}
              fill="#3b82f6" fillOpacity={0.25}
              stroke="#3b82f6" strokeWidth={0.5} strokeOpacity={0.5}
            />
          );
        })}

        {/* Shaded exact area */}
        {aVal < bVal && (
          <path d={fillPts.join(' ')} fill="#22c55e" fillOpacity={0.15} />
        )}

        {/* Curve */}
        <path d={curvePts.join(' ')} fill="none" stroke="#22c55e" strokeWidth={2} />

        {/* Bound markers */}
        {[aVal, bVal].map((v, i) => (
          <g key={i}>
            <line x1={sx(v)} y1={sy(0) - 5} x2={sx(v)} y2={sy(0) + 5} stroke={i === 0 ? '#f59e0b' : '#ef4444'} strokeWidth={2} />
            <text x={sx(v)} y={sy(0) + 16} fill={i === 0 ? '#f59e0b' : '#ef4444'} fontSize={9} textAnchor="middle" fontFamily="monospace">
              {i === 0 ? 'a' : 'b'}
            </text>
          </g>
        ))}

        {/* Axis tick labels */}
        {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map(n => (
          <text key={n} x={sx(n)} y={H - PAD + 14} fill="#6b7280" fontSize={7} textAnchor="middle" fontFamily="monospace">
            {n}
          </text>
        ))}
      </svg>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Lower bound (a)</span><span className="font-mono text-amber-400">{aVal.toFixed(1)}</span>
          </div>
          <input type="range" min={-0.5} max={3} step={0.1} value={aVal}
            onChange={e => { const v = +e.target.value; if (v < bVal) setAVal(v); }}
            className="w-full accent-amber-500" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Upper bound (b)</span><span className="font-mono text-rose-400">{bVal.toFixed(1)}</span>
          </div>
          <input type="range" min={0} max={3.5} step={0.1} value={bVal}
            onChange={e => { const v = +e.target.value; if (v > aVal) setBVal(v); }}
            className="w-full accent-rose-500" />
        </div>
      </div>

      {/* Rectangle count selector */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">Rectangles (N):</span>
        <div className="flex gap-1">
          {N_OPTIONS.map(n => (
            <button key={n} onClick={() => setNRects(n)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                n === nRects ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800 text-xs">
        <span className="text-gray-400">
          Riemann ({nRects}): <span className="font-mono text-blue-400 font-bold">{riemannSum.toFixed(4)}</span>
        </span>
        <span className="text-gray-400">
          Exact: <span className="font-mono text-emerald-400 font-bold">{exactArea.toFixed(4)}</span>
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        More rectangles = closer approximation to the exact integral of {label} from {aVal.toFixed(1)} to {bVal.toFixed(1)}
      </p>
    </div>
  );
}
