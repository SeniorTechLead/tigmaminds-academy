import { useState, useMemo, useCallback, useRef } from 'react';

// ─── Math helpers ───────────────────────────────────────────
function gaussPDF(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function bivariateGaussPDF(
  x: number, y: number,
  mux: number, muy: number,
  sx: number, sy: number,
  rho: number,
): number {
  const z = ((x - mux) / sx) ** 2
    - 2 * rho * ((x - mux) / sx) * ((y - muy) / sy)
    + ((y - muy) / sy) ** 2;
  const denom = 2 * Math.PI * sx * sy * Math.sqrt(1 - rho * rho);
  return Math.exp(-z / (2 * (1 - rho * rho))) / denom;
}

// Seeded pseudo-random for deterministic scatter
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function seededRandn2(rng: () => number): [number, number] {
  const u1 = rng() || 1e-10;
  const u2 = rng();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

function seededCorrelatedSamples(
  n: number, mux: number, muy: number, sx: number, sy: number, rho: number, seed: number,
): [number, number][] {
  const rng = seededRandom(seed);
  const pts: [number, number][] = [];
  const l21 = rho;
  const l22 = Math.sqrt(Math.max(1e-10, 1 - rho * rho));
  for (let i = 0; i < n; i++) {
    const [z1, z2] = seededRandn2(rng);
    const x = mux + sx * z1;
    const y = muy + sy * (l21 * z1 + l22 * z2);
    pts.push([x, y]);
  }
  return pts;
}

// ─── Constants ──────────────────────────────────────────────
const TABS = [
  'The Bell Curve',
  'Adding a Second Variable',
  'Correlation Changes Everything',
  'The Math Behind It',
] as const;

// ─── Shared slider component ───────────────────────────────
function Slider({
  label, value, min, max, step, onChange, color = 'accent',
  onDragStart, onDragEnd, unit = '',
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color?: string;
  onDragStart?: () => void; onDragEnd?: () => void; unit?: string;
}) {
  const accent =
    color === 'blue' ? 'accent-blue-500' :
    color === 'red' ? 'accent-red-500' :
    color === 'purple' ? 'accent-purple-500' :
    color === 'amber' ? 'accent-amber-500' :
    'accent-sky-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-12 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
        className={`flex-1 h-1.5 rounded-full cursor-pointer ${accent}`}
      />
      <span className="text-xs font-mono text-gray-700 dark:text-gray-300 w-14 text-right">
        {value.toFixed(2)}{unit}
      </span>
    </div>
  );
}

// ─── TAB 1: The Bell Curve ──────────────────────────────────
function Tab1BellCurve() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [showRegions, setShowRegions] = useState(true);
  const [dragging, setDragging] = useState<'mu' | 'sigma' | null>(null);
  const seedRef = useRef(42);

  const W = 560, H = 260, PAD = 40;
  const xMin = -8, xMax = 8;
  const toSvgX = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const toSvgY = (y: number, yMax: number) => H - PAD - (y / yMax) * (H - 2 * PAD);

  const numPoints = 300;
  const curveData = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (i / numPoints) * (xMax - xMin);
      pts.push({ x, y: gaussPDF(x, mu, sigma) });
    }
    return pts;
  }, [mu, sigma]);

  const yMax = useMemo(() => Math.max(...curveData.map(p => p.y)) * 1.15, [curveData]);

  const curvePath = useMemo(() => {
    return curveData.map((p, i) =>
      `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y, yMax).toFixed(1)}`
    ).join(' ');
  }, [curveData, yMax]);

  // Shaded region paths
  const regionPath = useCallback((nSigma: number) => {
    const lo = mu - nSigma * sigma;
    const hi = mu + nSigma * sigma;
    const pts: string[] = [];
    pts.push(`M${toSvgX(Math.max(lo, xMin)).toFixed(1)},${toSvgY(0, yMax).toFixed(1)}`);
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (i / numPoints) * (xMax - xMin);
      if (x >= lo && x <= hi) {
        pts.push(`L${toSvgX(x).toFixed(1)},${toSvgY(gaussPDF(x, mu, sigma), yMax).toFixed(1)}`);
      }
    }
    pts.push(`L${toSvgX(Math.min(hi, xMax)).toFixed(1)},${toSvgY(0, yMax).toFixed(1)}Z`);
    return pts.join(' ');
  }, [mu, sigma, yMax]);

  // Scatter points under the curve (rejection sampling)
  const scatterPts = useMemo(() => {
    const rng = seededRandom(seedRef.current);
    const pts: { x: number; y: number }[] = [];
    let attempts = 0;
    while (pts.length < 80 && attempts < 2000) {
      attempts++;
      const x = xMin + rng() * (xMax - xMin);
      const maxY = gaussPDF(mu, mu, sigma); // peak
      const y = rng() * maxY;
      if (y < gaussPDF(x, mu, sigma)) {
        pts.push({ x, y });
      }
    }
    return pts;
  }, [mu, sigma]);

  return (
    <div>
      {/* Formula */}
      <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-center overflow-x-auto">
        <span className="text-gray-600 dark:text-gray-400">f(x) = </span>
        <span className="text-gray-600 dark:text-gray-400">(1 / </span>
        <span className={dragging === 'sigma' ? 'text-amber-500 font-bold' : 'text-amber-600 dark:text-amber-400'}>
          σ
        </span>
        <span className="text-gray-600 dark:text-gray-400">√2π) × e</span>
        <sup>
          <span className="text-gray-600 dark:text-gray-400">-(x - </span>
          <span className={dragging === 'mu' ? 'text-sky-500 font-bold' : 'text-sky-600 dark:text-sky-400'}>
            μ
          </span>
          <span className="text-gray-600 dark:text-gray-400">)² / 2</span>
          <span className={dragging === 'sigma' ? 'text-amber-500 font-bold' : 'text-amber-600 dark:text-amber-400'}>
            σ
          </span>
          <span className="text-gray-600 dark:text-gray-400">²</span>
        </sup>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <Slider label="μ =" value={mu} min={-5} max={5} step={0.1} onChange={setMu}
          color="blue" onDragStart={() => setDragging('mu')} onDragEnd={() => setDragging(null)} />
        <Slider label="σ =" value={sigma} min={0.3} max={3} step={0.05} onChange={setSigma}
          color="amber" onDragStart={() => setDragging('sigma')} onDragEnd={() => setDragging(null)} />
      </div>

      {/* Toggle */}
      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2 cursor-pointer select-none">
        <input type="checkbox" checked={showRegions} onChange={e => setShowRegions(e.target.checked)}
          className="accent-sky-500" />
        Show ±1σ, ±2σ, ±3σ regions
      </label>

      {/* SVG */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px] mx-auto" style={{ minWidth: 320 }}>
          {/* Grid lines */}
          {[-6, -4, -2, 0, 2, 4, 6].map(v => (
            <line key={v} x1={toSvgX(v)} y1={PAD} x2={toSvgX(v)} y2={H - PAD}
              className="stroke-gray-200 dark:stroke-gray-700" strokeWidth={0.5} />
          ))}
          {/* X axis */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD}
            className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={1} />
          {/* X labels */}
          {[-6, -4, -2, 0, 2, 4, 6].map(v => (
            <text key={v} x={toSvgX(v)} y={H - PAD + 16}
              className="fill-gray-500 dark:fill-gray-400" textAnchor="middle" fontSize={11}>{v}</text>
          ))}

          {/* Shaded regions */}
          {showRegions && (
            <>
              <path d={regionPath(3)} fill="rgba(56,189,248,0.1)" />
              <path d={regionPath(2)} fill="rgba(56,189,248,0.15)" />
              <path d={regionPath(1)} fill="rgba(56,189,248,0.25)" />
            </>
          )}

          {/* Region labels */}
          {showRegions && (
            <>
              <text x={toSvgX(mu)} y={toSvgY(gaussPDF(mu, mu, sigma) * 0.35, yMax)}
                className="fill-sky-600 dark:fill-sky-400" textAnchor="middle" fontSize={11} fontWeight={600}>
                68.3%
              </text>
              <text x={toSvgX(mu + 1.7 * sigma)} y={toSvgY(gaussPDF(mu, mu, sigma) * 0.12, yMax)}
                className="fill-sky-500 dark:fill-sky-400" textAnchor="middle" fontSize={10}>
                95.4%
              </text>
              <text x={toSvgX(mu + 2.7 * sigma)} y={toSvgY(gaussPDF(mu, mu, sigma) * 0.03, yMax)}
                className="fill-sky-400 dark:fill-sky-500" textAnchor="middle" fontSize={9}>
                99.7%
              </text>
            </>
          )}

          {/* Curve */}
          <path d={curvePath} fill="none" className="stroke-sky-500" strokeWidth={2.5} />

          {/* Scatter points */}
          {scatterPts.map((p, i) => (
            <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y, yMax)}
              r={2} className="fill-sky-400/60 dark:fill-sky-300/50" />
          ))}

          {/* Mean line */}
          <line x1={toSvgX(mu)} y1={PAD} x2={toSvgX(mu)} y2={H - PAD}
            className="stroke-sky-400 dark:stroke-sky-500" strokeWidth={1} strokeDasharray="4,3" />
          <text x={toSvgX(mu)} y={PAD - 6}
            className="fill-sky-600 dark:fill-sky-400" textAnchor="middle" fontSize={11} fontWeight={600}>
            μ={mu.toFixed(1)}
          </text>
        </svg>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Drag the sliders to see how μ shifts the center and σ controls the spread.
        The dots redistribute under the curve as parameters change.
      </p>
    </div>
  );
}

// ─── TAB 2: Independent Bivariate ───────────────────────────
function Tab2Bivariate() {
  const [mux, setMux] = useState(0);
  const [muy, setMuy] = useState(0);
  const [sx, setSx] = useState(1);
  const [sy, setSy] = useState(1);

  const W1 = 240, H1 = 140, PAD1 = 30;
  const CW = 280, CH = 280, CPAD = 30;
  const xRange = 6;

  // Mini bell curve renderer
  const miniCurve = useCallback((mu: number, sigma: number, color: string, label: string, w: number, h: number) => {
    const pts = 200;
    const toX = (x: number) => PAD1 + ((x + xRange) / (2 * xRange)) * (w - 2 * PAD1);
    const yMax = gaussPDF(mu, mu, sigma) * 1.15;
    const toY = (y: number) => h - PAD1 - (y / yMax) * (h - 2 * PAD1);

    let path = '';
    for (let i = 0; i <= pts; i++) {
      const x = -xRange + (i / pts) * 2 * xRange;
      const y = gaussPDF(x, mu, sigma);
      path += `${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`;
    }
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxWidth: w }}>
        <line x1={PAD1} y1={h - PAD1} x2={w - PAD1} y2={h - PAD1}
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={0.5} />
        <path d={path} fill="none" stroke={color} strokeWidth={2} />
        <text x={w / 2} y={14} fill={color} textAnchor="middle" fontSize={12} fontWeight={600}>{label}</text>
      </svg>
    );
  }, []);

  // Contour grid
  const gridSize = 50;
  const contourData = useMemo(() => {
    const data: number[][] = [];
    let maxVal = 0;
    for (let j = 0; j < gridSize; j++) {
      const row: number[] = [];
      for (let i = 0; i < gridSize; i++) {
        const x = -xRange + (i / (gridSize - 1)) * 2 * xRange;
        const y = -xRange + (j / (gridSize - 1)) * 2 * xRange;
        const v = bivariateGaussPDF(x, y, mux, muy, sx, sy, 0);
        row.push(v);
        if (v > maxVal) maxVal = v;
      }
      data.push(row);
    }
    return { data, maxVal };
  }, [mux, muy, sx, sy]);

  const cellW = (CW - 2 * CPAD) / gridSize;
  const cellH = (CH - 2 * CPAD) / gridSize;

  return (
    <div>
      <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-center">
        <span className="text-gray-600 dark:text-gray-400">f(x,y) = </span>
        <span className="text-blue-500">f(x)</span>
        <span className="text-gray-600 dark:text-gray-400"> × </span>
        <span className="text-red-500">f(y)</span>
        <span className="text-gray-500 dark:text-gray-400 ml-3 text-xs">(independence: just multiply!)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <Slider label="μx =" value={mux} min={-3} max={3} step={0.1} onChange={setMux} color="blue" />
        <Slider label="σx =" value={sx} min={0.3} max={3} step={0.05} onChange={setSx} color="blue" />
        <Slider label="μy =" value={muy} min={-3} max={3} step={0.1} onChange={setMuy} color="red" />
        <Slider label="σy =" value={sy} min={0.3} max={3} step={0.05} onChange={setSy} color="red" />
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Left: individual curves */}
        <div className="flex flex-col gap-2 shrink-0">
          {miniCurve(mux, sx, '#3b82f6', `X ~ N(${mux.toFixed(1)}, ${sx.toFixed(1)}²)`, W1, H1)}
          {miniCurve(muy, sy, '#ef4444', `Y ~ N(${muy.toFixed(1)}, ${sy.toFixed(1)}²)`, W1, H1)}
        </div>

        {/* Right: contour plot */}
        <div className="flex-1 overflow-x-auto">
          <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full max-w-[300px] mx-auto" style={{ minWidth: 220 }}>
            {/* Heatmap cells */}
            {contourData.data.map((row, j) =>
              row.map((v, i) => {
                const intensity = contourData.maxVal > 0 ? v / contourData.maxVal : 0;
                if (intensity < 0.02) return null;
                return (
                  <rect key={`${j}-${i}`}
                    x={CPAD + i * cellW} y={CPAD + j * cellH}
                    width={cellW + 0.5} height={cellH + 0.5}
                    fill={`rgba(168, 85, 247, ${intensity * 0.8})`}
                  />
                );
              })
            )}
            {/* Axes */}
            <line x1={CPAD} y1={CH - CPAD} x2={CW - CPAD} y2={CH - CPAD}
              className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={0.5} />
            <line x1={CPAD} y1={CPAD} x2={CPAD} y2={CH - CPAD}
              className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={0.5} />
            <text x={CW / 2} y={CH - 8} className="fill-blue-500" textAnchor="middle" fontSize={11}>X</text>
            <text x={12} y={CH / 2} className="fill-red-500" textAnchor="middle" fontSize={11}
              transform={`rotate(-90, 12, ${CH / 2})`}>Y</text>
            <text x={CW / 2} y={CPAD - 8} className="fill-purple-500 dark:fill-purple-400"
              textAnchor="middle" fontSize={11} fontWeight={600}>Joint Distribution</text>
          </svg>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        When X and Y are independent, the joint distribution is just the product.
        Notice the contours are axis-aligned — try making σx ≠ σy to see ellipses stretch.
      </p>
    </div>
  );
}

// ─── TAB 3: Correlated Bivariate ────────────────────────────
function Tab3Correlated() {
  const [sx, setSx] = useState(1.0);
  const [sy, setSy] = useState(1.0);
  const [rho, setRho] = useState(0.0);

  const CW = 320, CH = 320, CPAD = 40;
  const xRange = 4;
  const gridSize = 50;

  // Contour grid
  const contourData = useMemo(() => {
    const data: number[][] = [];
    let maxVal = 0;
    for (let j = 0; j < gridSize; j++) {
      const row: number[] = [];
      for (let i = 0; i < gridSize; i++) {
        const x = -xRange + (i / (gridSize - 1)) * 2 * xRange;
        const y = -xRange + (j / (gridSize - 1)) * 2 * xRange;
        const v = bivariateGaussPDF(x, y, 0, 0, sx, sy, rho);
        row.push(v);
        if (v > maxVal) maxVal = v;
      }
      data.push(row);
    }
    return { data, maxVal };
  }, [sx, sy, rho]);

  // Eigenvectors of the covariance matrix
  const eigen = useMemo(() => {
    const sxy = rho * sx * sy;
    const a = sx * sx, b = sxy, d = sy * sy;
    // eigenvalues of [[a,b],[b,d]]
    const trace = a + d;
    const det = a * d - b * b;
    const disc = Math.sqrt(Math.max(0, trace * trace / 4 - det));
    const l1 = trace / 2 + disc;
    const l2 = trace / 2 - disc;
    // eigenvectors
    let v1x: number, v1y: number, v2x: number, v2y: number;
    if (Math.abs(b) > 1e-10) {
      v1x = l1 - d; v1y = b;
      v2x = l2 - d; v2y = b;
    } else {
      v1x = 1; v1y = 0;
      v2x = 0; v2y = 1;
    }
    // normalize
    const n1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
    const n2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;
    return {
      l1, l2,
      v1: [v1x / n1, v1y / n1] as [number, number],
      v2: [v2x / n2, v2y / n2] as [number, number],
    };
  }, [sx, sy, rho]);

  // Scatter points
  const scatter = useMemo(
    () => seededCorrelatedSamples(200, 0, 0, sx, sy, rho, 12345),
    [sx, sy, rho],
  );

  const toSvgX = (x: number) => CPAD + ((x + xRange) / (2 * xRange)) * (CW - 2 * CPAD);
  const toSvgY = (y: number) => CPAD + ((-y + xRange) / (2 * xRange)) * (CH - 2 * CPAD);

  const cellW = (CW - 2 * CPAD) / gridSize;
  const cellH = (CH - 2 * CPAD) / gridSize;

  // Covariance matrix values
  const covXX = (sx * sx).toFixed(2);
  const covYY = (sy * sy).toFixed(2);
  const covXY = (rho * sx * sy).toFixed(2);

  return (
    <div>
      {/* Covariance matrix */}
      <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Covariance Matrix Σ</div>
        <div className="inline-flex items-center gap-1 font-mono text-sm">
          <span className="text-gray-400 text-2xl leading-none" style={{ fontFamily: 'serif' }}>[</span>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-4">
              <span className="text-blue-500 w-12 text-right">{covXX}</span>
              <span className="text-purple-500 w-12 text-right">{covXY}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-purple-500 w-12 text-right">{covXY}</span>
              <span className="text-red-500 w-12 text-right">{covYY}</span>
            </div>
          </div>
          <span className="text-gray-400 text-2xl leading-none" style={{ fontFamily: 'serif' }}>]</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <Slider label="σx =" value={sx} min={0.3} max={2.5} step={0.05} onChange={setSx} color="blue" />
        <Slider label="σy =" value={sy} min={0.3} max={2.5} step={0.05} onChange={setSy} color="red" />
        <Slider label="ρ =" value={rho} min={-0.99} max={0.99} step={0.01} onChange={setRho} color="purple" />
      </div>

      {/* Contour + scatter plot */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full max-w-[360px] mx-auto" style={{ minWidth: 260 }}>
          {/* Heatmap */}
          {contourData.data.map((row, j) =>
            row.map((v, i) => {
              const intensity = contourData.maxVal > 0 ? v / contourData.maxVal : 0;
              if (intensity < 0.02) return null;
              return (
                <rect key={`${j}-${i}`}
                  x={CPAD + i * cellW} y={CPAD + j * cellH}
                  width={cellW + 0.5} height={cellH + 0.5}
                  fill={`rgba(168, 85, 247, ${intensity * 0.55})`}
                />
              );
            })
          )}

          {/* Scatter points */}
          {scatter.map(([x, y], i) => {
            const sx2 = toSvgX(x), sy2 = toSvgY(y);
            if (sx2 < CPAD || sx2 > CW - CPAD || sy2 < CPAD || sy2 > CH - CPAD) return null;
            return (
              <circle key={i} cx={sx2} cy={sy2} r={1.8}
                className="fill-purple-400/50 dark:fill-purple-300/40" />
            );
          })}

          {/* Eigenvector arrows */}
          {[
            { v: eigen.v1, l: eigen.l1, color: '#f59e0b' },
            { v: eigen.v2, l: eigen.l2, color: '#10b981' },
          ].map(({ v, l, color }, idx) => {
            const scale = Math.sqrt(l) * 1.2;
            const cx = toSvgX(0), cy = toSvgY(0);
            const dx = v[0] * scale * ((CW - 2 * CPAD) / (2 * xRange));
            const dy = -v[1] * scale * ((CH - 2 * CPAD) / (2 * xRange));
            return (
              <g key={idx}>
                <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
                  stroke={color} strokeWidth={2.5} strokeLinecap="round" />
                {/* Arrowhead */}
                <circle cx={cx + dx} cy={cy + dy} r={3.5} fill={color} />
                <circle cx={cx - dx} cy={cy - dy} r={3.5} fill={color} />
              </g>
            );
          })}

          {/* Axes */}
          <line x1={CPAD} y1={CH - CPAD} x2={CW - CPAD} y2={CH - CPAD}
            className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={0.5} />
          <line x1={CPAD} y1={CPAD} x2={CPAD} y2={CH - CPAD}
            className="stroke-gray-400 dark:stroke-gray-500" strokeWidth={0.5} />
          <text x={CW / 2} y={CH - 10} className="fill-gray-500 dark:fill-gray-400" textAnchor="middle" fontSize={11}>X</text>
          <text x={14} y={CH / 2} className="fill-gray-500 dark:fill-gray-400" textAnchor="middle" fontSize={11}
            transform={`rotate(-90, 14, ${CH / 2})`}>Y</text>
        </svg>
      </div>

      {/* Eigenvalue legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="text-gray-600 dark:text-gray-400">λ₁ = {eigen.l1.toFixed(2)} (PC1)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-gray-600 dark:text-gray-400">λ₂ = {eigen.l2.toFixed(2)} (PC2)</span>
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        As ρ increases, the scatter elongates along a line. The arrows are eigenvectors
        of Σ (principal components) — their lengths show how much variance each captures.
      </p>
    </div>
  );
}

// ─── TAB 4: The Math Behind It ──────────────────────────────
function Tab4Math() {
  const [demoD, setDemoD] = useState(1.0);
  const [sx] = useState(1.2);
  const [sy] = useState(0.8);
  const [rho] = useState(0.6);

  const CW = 300, CH = 300, CPAD = 40;
  const xRange = 4;

  const toSvgX = (x: number) => CPAD + ((x + xRange) / (2 * xRange)) * (CW - 2 * CPAD);
  const toSvgY = (y: number) => CPAD + ((-y + xRange) / (2 * xRange)) * (CH - 2 * CPAD);

  // Mahalanobis distance contour: all points with (x-mu)^T Sigma^{-1} (x-mu) = d^2
  // For bivariate: parametric ellipse
  const ellipsePath = useCallback((d: number) => {
    const a = sx * sx, b = rho * sx * sy, dd = sy * sy;
    // eigenvalues
    const trace = a + dd;
    const det = a * dd - b * b;
    const disc = Math.sqrt(Math.max(0, trace * trace / 4 - det));
    const l1 = trace / 2 + disc;
    const l2 = trace / 2 - disc;
    // eigenvectors
    let v1x: number, v1y: number;
    if (Math.abs(b) > 1e-10) {
      v1x = l1 - dd; v1y = b;
    } else {
      v1x = 1; v1y = 0;
    }
    const n = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
    v1x /= n; v1y /= n;
    const v2x = -v1y, v2y = v1x;

    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const px = d * Math.sqrt(l1) * Math.cos(t) * v1x + d * Math.sqrt(l2) * Math.sin(t) * v2x;
      const py = d * Math.sqrt(l1) * Math.cos(t) * v1y + d * Math.sqrt(l2) * Math.sin(t) * v2y;
      pts.push(`${i === 0 ? 'M' : 'L'}${toSvgX(px).toFixed(1)},${toSvgY(py).toFixed(1)}`);
    }
    pts.push('Z');
    return pts.join(' ');
  }, [sx, sy, rho]);

  return (
    <div className="space-y-4">
      {/* Full formula */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">The Multivariate Gaussian</div>
        <div className="font-mono text-sm text-center overflow-x-auto whitespace-nowrap text-gray-700 dark:text-gray-300">
          f(<b>x</b>) = (2π)<sup>-k/2</sup> |<span className="text-blue-500">Σ</span>|<sup>-1/2</sup> exp(
            -½ (<b>x</b>-<span className="text-sky-500">μ</span>)<sup>T</sup>
            <span className="text-blue-500">Σ</span><sup>-1</sup>
            (<b>x</b>-<span className="text-sky-500">μ</span>)
          )
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">|Σ| — The Determinant</div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            The determinant of the covariance matrix measures the <b>volume</b> of the distribution's spread.
            For 2D, |Σ| = σ<sub>x</sub>²σ<sub>y</sub>²(1-ρ²). A large determinant means the data spreads
            over a wide area. As ρ approaches ±1, the determinant shrinks — the data collapses toward a line.
            The determinant appears in the denominator of the normalization constant, ensuring the total
            probability integrates to 1.
          </p>
        </div>

        <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Σ⁻¹ — The Precision Matrix</div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            The inverse covariance (precision) matrix controls the <b>shape</b> of the elliptical contours.
            High precision along a direction means the distribution is <em>narrow</em> in that direction —
            values far from the mean are severely penalized. The precision matrix is what actually appears
            in the exponent, not Σ itself.
          </p>
        </div>

        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
            (x-μ)<sup>T</sup>Σ<sup>-1</sup>(x-μ) — Mahalanobis Distance²
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            This quadratic form measures "how many standard deviations from the center" a point is,
            <b> accounting for correlation and different scales</b>. Unlike Euclidean distance, it stretches
            and rotates with the data. All points at the same Mahalanobis distance form an ellipse.
            When Σ = I (identity), it reduces to ordinary Euclidean distance.
          </p>
        </div>

        <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            Connection to PCA
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            The eigenvectors of Σ are the <b>principal components</b> — the natural axes of the data.
            The eigenvalues are the variance along each axis. PCA simply rotates coordinates to align
            with these eigenvectors, diagonalizing Σ. In the new coordinates, the variables are
            uncorrelated and the Gaussian becomes axis-aligned — exactly what Tab 2 showed.
          </p>
        </div>
      </div>

      {/* Mahalanobis distance demo */}
      <div>
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Mahalanobis Distance Contours (σ<sub>x</sub>={sx}, σ<sub>y</sub>={sy}, ρ={rho})
        </div>
        <Slider label="d =" value={demoD} min={0.5} max={3} step={0.1} onChange={setDemoD} color="amber" />
        <div className="overflow-x-auto mt-2">
          <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full max-w-[320px] mx-auto" style={{ minWidth: 220 }}>
            {/* Fixed reference ellipses */}
            {[1, 2, 3].map(d => (
              <path key={d} d={ellipsePath(d)} fill="none"
                className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={0.5} strokeDasharray="3,3" />
            ))}
            {/* Labels for reference */}
            {[1, 2, 3].map(d => (
              <text key={d} x={toSvgX(0)} y={toSvgY(d * sy * Math.sqrt(1 - rho * rho) * 0.9) - 2}
                className="fill-gray-400 dark:fill-gray-500" textAnchor="middle" fontSize={9}>
                d={d}
              </text>
            ))}

            {/* Active contour */}
            <path d={ellipsePath(demoD)} fill="rgba(245, 158, 11, 0.15)"
              stroke="#f59e0b" strokeWidth={2} />

            {/* Center dot */}
            <circle cx={toSvgX(0)} cy={toSvgY(0)} r={3} fill="#f59e0b" />

            {/* Axes */}
            <line x1={CPAD} y1={CH / 2} x2={CW - CPAD} y2={CH / 2}
              className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={0.5} />
            <line x1={CW / 2} y1={CPAD} x2={CW / 2} y2={CH - CPAD}
              className="stroke-gray-300 dark:stroke-gray-600" strokeWidth={0.5} />

            <text x={CW / 2} y={CH - 10} className="fill-gray-500 dark:fill-gray-400" textAnchor="middle" fontSize={11}>X</text>
            <text x={14} y={CH / 2} className="fill-gray-500 dark:fill-gray-400" textAnchor="middle" fontSize={11}
              transform={`rotate(-90, 14, ${CH / 2})`}>Y</text>
          </svg>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          All points on the amber ellipse are at Mahalanobis distance d = {demoD.toFixed(1)} from the center.
          Unlike circles (Euclidean), these ellipses account for correlation and scale.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function GaussianExplorer() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors
              ${activeTab === i
                ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 bg-white dark:bg-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <span className="mr-1">{i + 1}.</span>{tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 0 && <Tab1BellCurve />}
        {activeTab === 1 && <Tab2Bivariate />}
        {activeTab === 2 && <Tab3Correlated />}
        {activeTab === 3 && <Tab4Math />}
      </div>
    </div>
  );
}
