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

/* Small reusable card for each derivation step */
function StepCard({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold shrink-0">{num}</span>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</span>
      </div>
      {children}
    </div>
  );
}

function StepQuestion({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1.5 italic">{children}</p>;
}

function StepIntuition({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{children}</p>;
}

function StepFormula({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-sm text-center py-2 px-3 mb-2 rounded bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 overflow-x-auto">
      {children}
    </div>
  );
}

function Tab4Math() {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        Instead of dropping the formula on you, let us build it one piece at a time. Each step
        answers a question, gives an analogy, shows the math, and draws a picture.
      </p>

      {/* ── Step 1 ─────────────────────────────────── */}
      <StepCard num={1} title="How far from the center?">
        <StepQuestion>How do we measure how "unusual" a value is?</StepQuestion>
        <StepIntuition>
          If the average height is 170 cm, someone at 185 cm is "15 cm away from normal."
          That difference from the average is the most basic building block.
        </StepIntuition>
        <StepFormula>
          (<b>x</b> &minus; <span className="text-blue-500">μ</span>)
        </StepFormula>
        {/* Visual: number line with μ and x */}
        <svg viewBox="0 0 240 50" className="w-full max-w-[240px] mx-auto" aria-label="Number line showing x minus mu">
          <line x1="20" y1="30" x2="220" y2="30" stroke="#9ca3af" strokeWidth="1" />
          {/* tick marks */}
          {[60, 120, 180].map(tx => <line key={tx} x1={tx} y1="26" x2={tx} y2="34" stroke="#9ca3af" strokeWidth="1" />)}
          {/* μ marker */}
          <circle cx="90" cy="30" r="4" fill="#3b82f6" />
          <text x="90" y="22" textAnchor="middle" fontSize="10" className="fill-blue-500" fontWeight="bold">μ</text>
          {/* x marker */}
          <circle cx="170" cy="30" r="4" fill="#0ea5e9" />
          <text x="170" y="22" textAnchor="middle" fontSize="10" className="fill-sky-500" fontWeight="bold">x</text>
          {/* arrow between */}
          <line x1="94" y1="38" x2="166" y2="38" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowAmb)" />
          <defs><marker id="arrowAmb" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" /></marker></defs>
          <text x="130" y="48" textAnchor="middle" fontSize="9" className="fill-amber-500">x &minus; μ</text>
        </svg>
      </StepCard>

      {/* ── Step 2 ─────────────────────────────────── */}
      <StepCard num={2} title="Make it scale-free">
        <StepQuestion>Is 15 cm a lot? That depends on the spread!</StepQuestion>
        <StepIntuition>
          15 cm above average human height? Unremarkable. 15 cm above average ant size?
          Gigantic. We divide by the spread (σ) so the number tells us "how many standard
          deviations away" &mdash; the <b>z-score</b>.
        </StepIntuition>
        <StepFormula>
          z = (<b>x</b> &minus; <span className="text-blue-500">μ</span>) / <span className="text-amber-500">σ</span>
        </StepFormula>
        {/* Visual: two bell curves */}
        <svg viewBox="0 0 240 80" className="w-full max-w-[240px] mx-auto" aria-label="Narrow vs wide bell curves">
          {/* narrow curve σ=0.5 */}
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 60; i++) {
              const x = 20 + i;
              const t = (i - 30) / 8;
              const y = 70 - 55 * Math.exp(-0.5 * t * t);
              pts.push(`${i === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="50" y="12" textAnchor="middle" fontSize="8" className="fill-amber-500">σ small</text>
          <text x="50" y="78" textAnchor="middle" fontSize="7" className="fill-gray-400">15cm = huge</text>

          {/* wide curve σ=3 */}
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 100; i++) {
              const x = 130 + i;
              const t = (i - 50) / 30;
              const y = 70 - 40 * Math.exp(-0.5 * t * t);
              pts.push(`${i === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="180" y="12" textAnchor="middle" fontSize="8" className="fill-blue-500">σ large</text>
          <text x="180" y="78" textAnchor="middle" fontSize="7" className="fill-gray-400">15cm = nothing</text>
        </svg>
      </StepCard>

      {/* ── Step 3 ─────────────────────────────────── */}
      <StepCard num={3} title="Square it — distance does not care about direction">
        <StepQuestion>Should "15 cm below" be treated differently from "15 cm above"?</StepQuestion>
        <StepIntuition>
          No. Being unusual in either direction is equally noteworthy. Squaring removes the
          sign: &minus;2 and +2 both become 4.
        </StepIntuition>
        <StepFormula>
          z² = (<b>x</b> &minus; <span className="text-blue-500">μ</span>)² / <span className="text-amber-500">σ</span>²
        </StepFormula>
        {/* Visual: parabola */}
        <svg viewBox="0 0 200 80" className="w-full max-w-[200px] mx-auto" aria-label="Parabola z-squared">
          {/* axes */}
          <line x1="20" y1="70" x2="180" y2="70" stroke="#9ca3af" strokeWidth="0.5" />
          <line x1="100" y1="70" x2="100" y2="10" stroke="#9ca3af" strokeWidth="0.5" />
          {/* parabola */}
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 80; i++) {
              const z = (i - 40) / 14;
              const x = 20 + i * 2;
              const y = 68 - z * z * 14;
              if (y >= 8) pts.push(`${pts.length === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#8b5cf6" strokeWidth="2" />
          <text x="100" y="8" textAnchor="middle" fontSize="9" className="fill-purple-500">z²</text>
          <text x="180" y="78" textAnchor="middle" fontSize="8" className="fill-gray-400">z</text>
          {/* labels for symmetry */}
          <text x="55" y="45" textAnchor="middle" fontSize="7" className="fill-gray-400">&minus;z</text>
          <text x="145" y="45" textAnchor="middle" fontSize="7" className="fill-gray-400">+z</text>
          <text x="100" y="78" textAnchor="middle" fontSize="7" className="fill-gray-400">0</text>
        </svg>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Symmetric: &minus;z and +z give the same z².</p>
      </StepCard>

      {/* ── Step 4 ─────────────────────────────────── */}
      <StepCard num={4} title="Turn distance into probability — the exponential">
        <StepQuestion>How do we convert "distance from center" into "how likely"?</StepQuestion>
        <StepIntuition>
          We need a function that is (a) highest at the center, (b) drops smoothly toward zero,
          and (c) never goes negative. The exponential of a negative number does exactly that.
        </StepIntuition>
        <StepFormula>
          e<sup>&minus;½z²</sup>
        </StepFormula>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
          <b>Why &minus;½?</b> It is a convention that makes σ equal to the actual standard
          deviation of the resulting distribution. Without the ½, you would need to rescale σ.
        </p>
        {/* Visual: e^(-x) vs e^(-x²) */}
        <svg viewBox="0 0 240 90" className="w-full max-w-[240px] mx-auto" aria-label="Exponential decay vs bell shape">
          {/* e^(-|x|) one-sided decay */}
          <text x="60" y="10" textAnchor="middle" fontSize="8" className="fill-amber-500">e<tspan baselineShift="super" fontSize="6">&minus;|z|</tspan></text>
          <line x1="10" y1="80" x2="110" y2="80" stroke="#9ca3af" strokeWidth="0.5" />
          <line x1="60" y1="80" x2="60" y2="15" stroke="#9ca3af" strokeWidth="0.5" />
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 50; i++) {
              const z = (i - 25) / 8;
              const x = 10 + i * 2;
              const y = 78 - 58 * Math.exp(-Math.abs(z));
              pts.push(`${i === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="60" y="88" textAnchor="middle" fontSize="7" className="fill-gray-400">pointy peak</text>

          {/* e^(-x²/2) bell */}
          <text x="180" y="10" textAnchor="middle" fontSize="8" className="fill-sky-500">e<tspan baselineShift="super" fontSize="6">&minus;½z²</tspan></text>
          <line x1="130" y1="80" x2="230" y2="80" stroke="#9ca3af" strokeWidth="0.5" />
          <line x1="180" y1="80" x2="180" y2="15" stroke="#9ca3af" strokeWidth="0.5" />
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 50; i++) {
              const z = (i - 25) / 8;
              const x = 130 + i * 2;
              const y = 78 - 58 * Math.exp(-0.5 * z * z);
              pts.push(`${i === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
          <text x="180" y="88" textAnchor="middle" fontSize="7" className="fill-gray-400">smooth bell</text>
        </svg>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          Squaring z rounds the peak into a smooth bell instead of a sharp tent.
        </p>
      </StepCard>

      {/* ── Step 5 ─────────────────────────────────── */}
      <StepCard num={5} title="Make it add up to 1 — normalization">
        <StepQuestion>Probabilities must sum to 1. How do we ensure that?</StepQuestion>
        <StepIntuition>
          Like cutting a pie: the total has to be 100%. We compute the area under the
          un-normalized curve and divide by it. That area turns out to be σ&radic;(2π).
        </StepIntuition>
        <StepFormula>
          <span className="text-emerald-500">1 / (<span className="text-amber-500">σ</span>&radic;(2π))</span>{' '}
          &times; e<sup>&minus;½((<b>x</b>&minus;<span className="text-blue-500">μ</span>)/<span className="text-amber-500">σ</span>)²</sup>
        </StepFormula>
        {/* Visual: shaded area = sqrt(2pi) */}
        <svg viewBox="0 0 220 90" className="w-full max-w-[220px] mx-auto" aria-label="Area under unnormalized curve equals sqrt 2 pi">
          <line x1="10" y1="75" x2="210" y2="75" stroke="#9ca3af" strokeWidth="0.5" />
          {/* filled area */}
          <path d={(() => {
            const pts: string[] = [`M10,75`];
            for (let i = 0; i <= 100; i++) {
              const z = (i - 50) / 16;
              const x = 10 + i * 2;
              const y = 75 - 60 * Math.exp(-0.5 * z * z);
              pts.push(`L${x},${y.toFixed(1)}`);
            }
            pts.push('L210,75 Z');
            return pts.join(' ');
          })()} fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
          <text x="110" y="60" textAnchor="middle" fontSize="9" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="bold">area = &radic;(2π)</text>
          <text x="110" y="88" textAnchor="middle" fontSize="8" className="fill-gray-400">divide by this to get total = 1</text>
        </svg>

        {/* The complete 1D formula, color-coded */}
        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 text-center">Complete univariate formula</div>
          <div className="font-mono text-sm text-center overflow-x-auto text-gray-800 dark:text-gray-200">
            f(x) = <span className="text-emerald-500">1/(<span className="text-amber-500">σ</span>&radic;(2π))</span>{' '}
            &times; exp(&minus;(<b>x</b>&minus;<span className="text-blue-500">μ</span>)² / (2<span className="text-amber-500">σ</span>²))
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2 text-[10px]">
            <span className="text-blue-500">&#9632; μ = center</span>
            <span className="text-amber-500">&#9632; σ = spread</span>
            <span className="text-emerald-500">&#9632; normalization</span>
          </div>
        </div>
      </StepCard>

      {/* ── Step 6 ─────────────────────────────────── */}
      <StepCard num={6} title="Adding a second variable — when they are independent">
        <StepQuestion>What if we have two measurements (height AND weight)?</StepQuestion>
        <StepIntuition>
          If they are independent &mdash; knowing height tells you nothing about weight &mdash;
          the joint probability is simply the product of the two separate bell curves.
        </StepIntuition>
        <StepFormula>
          f(x,y) = f(x) &times; f(y)
        </StepFormula>
        {/* Visual: two 1D bells -> top-down circles */}
        <svg viewBox="0 0 260 70" className="w-full max-w-[260px] mx-auto" aria-label="Two bells multiplied give circles">
          {/* bell x */}
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 40; i++) {
              const z = (i - 20) / 7;
              pts.push(`${i === 0 ? 'M' : 'L'}${10 + i},${55 - 35 * Math.exp(-0.5 * z * z)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="30" y="65" textAnchor="middle" fontSize="8" className="fill-blue-500">f(x)</text>

          {/* times sign */}
          <text x="62" y="40" textAnchor="middle" fontSize="14" className="fill-gray-400">&times;</text>

          {/* bell y */}
          <path d={(() => {
            const pts: string[] = [];
            for (let i = 0; i <= 40; i++) {
              const z = (i - 20) / 7;
              pts.push(`${i === 0 ? 'M' : 'L'}${75 + i},${55 - 35 * Math.exp(-0.5 * z * z)}`);
            }
            return pts.join(' ');
          })()} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="95" y="65" textAnchor="middle" fontSize="8" className="fill-amber-500">f(y)</text>

          {/* equals */}
          <text x="128" y="40" textAnchor="middle" fontSize="14" className="fill-gray-400">=</text>

          {/* concentric circles (top-down view) */}
          <circle cx="190" cy="35" r="25" fill="none" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
          <circle cx="190" cy="35" r="16" fill="none" stroke="#8b5cf6" strokeWidth="1" />
          <circle cx="190" cy="35" r="8" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="190" cy="35" r="2" fill="#8b5cf6" />
          <text x="190" y="66" textAnchor="middle" fontSize="7" className="fill-gray-400">top-down: circles</text>
          <text x="230" y="30" fontSize="7" className="fill-gray-400">1σ</text>
          <text x="230" y="20" fontSize="7" className="fill-gray-400">2σ</text>
        </svg>
      </StepCard>

      {/* ── Step 7 ─────────────────────────────────── */}
      <StepCard num={7} title="What if they are NOT independent? — Correlation">
        <StepQuestion>What if tall people tend to be heavier? Now height DOES tell you about weight.</StepQuestion>
        <StepIntuition>
          The "distance from center" is no longer measured along the x and y axes separately.
          It is measured along the tilted axes of an ellipse. We need a cross-term that
          couples x and y.
        </StepIntuition>
        <StepFormula>
          <span className="text-purple-500">2ρ</span>(x&minus;<span className="text-blue-500">μ<sub>x</sub></span>)(y&minus;<span className="text-blue-500">μ<sub>y</sub></span>) / (<span className="text-amber-500">σ<sub>x</sub></span><span className="text-amber-500">σ<sub>y</sub></span>)
        </StepFormula>
        {/* Visual: circles morphing to ellipses */}
        <svg viewBox="0 0 260 70" className="w-full max-w-[260px] mx-auto" aria-label="Circles morphing into tilted ellipses as rho increases">
          {[0, 0.5, 0.9].map((r, idx) => {
            const cx = 50 + idx * 85;
            const cy = 35;
            const angle = r * 45;
            const rx = 22 * Math.sqrt(1 + r);
            const ry = 22 * Math.sqrt(1 - r);
            return (
              <g key={idx}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                  transform={`rotate(${-angle}, ${cx}, ${cy})`}
                  fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="2" fill="#8b5cf6" />
                <text x={cx} y="65" textAnchor="middle" fontSize="8" className="fill-purple-500">ρ={r}</text>
              </g>
            );
          })}
        </svg>
      </StepCard>

      {/* ── Step 8 ─────────────────────────────────── */}
      <StepCard num={8} title="The covariance matrix — packaging it neatly">
        <StepQuestion>Writing out σ<sub>x</sub>, σ<sub>y</sub>, ρ everywhere is messy. Is there a cleaner way?</StepQuestion>
        <StepIntuition>
          The covariance matrix Σ stores everything about spread and correlation in one object.
          Diagonal entries = individual spreads. Off-diagonal entries = how the variables move together.
        </StepIntuition>
        {/* Visual: color-coded matrix */}
        <svg viewBox="0 0 240 80" className="w-full max-w-[240px] mx-auto" aria-label="Covariance matrix with color-coded entries">
          {/* brackets */}
          <text x="50" y="50" fontSize="40" className="fill-gray-400" fontWeight="100">[</text>
          <text x="180" y="50" fontSize="40" className="fill-gray-400" fontWeight="100">]</text>
          {/* entries */}
          <text x="90" y="32" textAnchor="middle" fontSize="11" className="fill-amber-500" fontWeight="bold">σ<tspan baselineShift="sub" fontSize="8">x</tspan>²</text>
          <text x="155" y="32" textAnchor="middle" fontSize="10" className="fill-purple-500" fontWeight="bold">ρσ<tspan baselineShift="sub" fontSize="7">x</tspan>σ<tspan baselineShift="sub" fontSize="7">y</tspan></text>
          <text x="90" y="58" textAnchor="middle" fontSize="10" className="fill-purple-500" fontWeight="bold">ρσ<tspan baselineShift="sub" fontSize="7">x</tspan>σ<tspan baselineShift="sub" fontSize="7">y</tspan></text>
          <text x="155" y="58" textAnchor="middle" fontSize="11" className="fill-amber-500" fontWeight="bold">σ<tspan baselineShift="sub" fontSize="8">y</tspan>²</text>
          {/* label */}
          <text x="30" y="48" textAnchor="middle" fontSize="14" className="fill-gray-600 dark:fill-gray-300" fontWeight="bold">Σ =</text>
        </svg>
        <div className="flex flex-wrap gap-3 justify-center mt-1 text-[10px]">
          <span className="text-amber-500">&#9632; diagonal = individual spread</span>
          <span className="text-purple-500">&#9632; off-diagonal = correlation</span>
        </div>
      </StepCard>

      {/* ── Step 9 ─────────────────────────────────── */}
      <StepCard num={9} title="Why the INVERSE appears in the exponent">
        <StepQuestion>The exponent uses Σ&minus;1, not Σ. Why?</StepQuestion>
        <StepIntuition>
          Σ tells you "how spread out" the data is. Σ&minus;1 tells you "how tightly packed."
          In the exponent we are <em>penalizing</em> distance &mdash; the tighter a direction, the
          more a point is penalized for deviating along it. This generalized distance is called the
          <b> Mahalanobis distance</b>.
        </StepIntuition>
        <StepFormula>
          (<b>x</b>&minus;<span className="text-blue-500">μ</span>)<sup>T</sup>{' '}
          <span className="text-amber-500">Σ<sup>&minus;1</sup></span>{' '}
          (<b>x</b>&minus;<span className="text-blue-500">μ</span>) = Mahalanobis distance²
        </StepFormula>
        {/* Visual: Euclidean circles vs Mahalanobis ellipses */}
        <svg viewBox="0 0 240 80" className="w-full max-w-[240px] mx-auto" aria-label="Euclidean circles vs Mahalanobis ellipses">
          {/* Euclidean */}
          <circle cx="65" cy="40" r="22" fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="65" cy="40" r="14" fill="none" stroke="#9ca3af" strokeWidth="1" />
          <circle cx="65" cy="40" r="2" fill="#6b7280" />
          <text x="65" y="72" textAnchor="middle" fontSize="8" className="fill-gray-400">Euclidean (Σ=I)</text>

          {/* arrow */}
          <text x="120" y="44" textAnchor="middle" fontSize="12" className="fill-gray-400">&rarr;</text>

          {/* Mahalanobis */}
          <ellipse cx="175" cy="40" rx="28" ry="14" transform="rotate(-30,175,40)"
            fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
          <ellipse cx="175" cy="40" rx="18" ry="9" transform="rotate(-30,175,40)"
            fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="175" cy="40" r="2" fill="#f59e0b" />
          <text x="175" y="72" textAnchor="middle" fontSize="8" className="fill-amber-500">Mahalanobis (Σ&ne;I)</text>
        </svg>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          Same "distance" from the center, but the Mahalanobis version accounts for spread and tilt.
        </p>
      </StepCard>

      {/* ── Step 10 ────────────────────────────────── */}
      <StepCard num={10} title="The determinant — normalization in higher dimensions">
        <StepQuestion>In 1D we divided by σ&radic;(2π). What is the equivalent in 2D and beyond?</StepQuestion>
        <StepIntuition>
          The determinant |Σ| measures the "volume" of the spread. It replaces σ in the
          normalization constant. As correlation approaches &pm;1, the determinant shrinks toward
          zero &mdash; the distribution collapses onto a line.
        </StepIntuition>
        <StepFormula>
          |Σ|<sup>1/2</sup> replaces <span className="text-amber-500">σ</span>
        </StepFormula>
        {/* Visual: ellipse area shrinking */}
        <svg viewBox="0 0 260 65" className="w-full max-w-[260px] mx-auto" aria-label="Ellipse area shrinking as correlation increases">
          {[0, 0.7, 0.95].map((r, idx) => {
            const cx = 50 + idx * 85;
            const cy = 30;
            const rx = 25;
            const ry = 25 * Math.sqrt(1 - r * r);
            const angle = r * 40;
            return (
              <g key={idx}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={Math.max(ry, 1.5)}
                  transform={`rotate(${-angle},${cx},${cy})`}
                  fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1.5" />
                <text x={cx} y="60" textAnchor="middle" fontSize="8" className="fill-emerald-500">|Σ|={(1 - r * r).toFixed(2)}</text>
              </g>
            );
          })}
        </svg>
      </StepCard>

      {/* ── Step 11 ────────────────────────────────── */}
      <StepCard num={11} title="The complete multivariate formula">
        <StepQuestion>Putting every piece together:</StepQuestion>
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 mb-2">
          <div className="font-mono text-sm text-center overflow-x-auto text-gray-800 dark:text-gray-200 leading-relaxed">
            f(<b>x</b>) ={' '}
            <span className="text-emerald-500">(2π)<sup>&minus;k/2</sup></span>{' '}
            <span className="text-emerald-500">|<span className="text-amber-500">Σ</span>|<sup>&minus;1/2</sup></span>{' '}
            exp(&minus;½{' '}
            (<b>x</b>&minus;<span className="text-blue-500">μ</span>)<sup>T</sup>{' '}
            <span className="text-amber-500">Σ</span><sup>&minus;1</sup>{' '}
            (<b>x</b>&minus;<span className="text-blue-500">μ</span>))
          </div>
        </div>

        {/* Color legend linking back to steps */}
        <div className="grid grid-cols-2 gap-1 text-[10px] leading-relaxed">
          <div><span className="text-blue-500 font-bold">&#9632; μ</span> <span className="text-gray-500 dark:text-gray-400">= center (Step 1)</span></div>
          <div><span className="text-amber-500 font-bold">&#9632; Σ</span> <span className="text-gray-500 dark:text-gray-400">= spread + correlation (Step 8)</span></div>
          <div><span className="text-amber-500 font-bold">&#9632; Σ&minus;1</span> <span className="text-gray-500 dark:text-gray-400">= penalty matrix (Step 9)</span></div>
          <div><span className="text-emerald-500 font-bold">&#9632; (2π)&minus;k/2|Σ|&minus;1/2</span> <span className="text-gray-500 dark:text-gray-400">= normalization (Steps 5 &amp; 10)</span></div>
        </div>

        <div className="mt-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <b>Sanity check:</b> for k=1, Σ is just [σ²], so |Σ|<sup>1/2</sup>=σ,
            Σ<sup>&minus;1</sup>=1/σ², and the quadratic form becomes (x&minus;μ)²/σ².
            The formula collapses to exactly the univariate formula from Step 5.
          </p>
        </div>
      </StepCard>

      {/* ── Step 12 ────────────────────────────────── */}
      <StepCard num={12} title="Eigenvectors — the natural axes">
        <StepQuestion>Can we simplify the tilted ellipse back into an axis-aligned one?</StepQuestion>
        <StepIntuition>
          Every covariance matrix can be decomposed into rotation and scaling.
          The eigenvectors point along the ellipse axes. The eigenvalues tell you
          the variance along each axis. PCA simply rotates to these natural axes,
          making Σ diagonal (no correlation).
        </StepIntuition>
        <StepFormula>
          Σ = <span className="text-purple-500">Q</span> <span className="text-amber-500">Λ</span> <span className="text-purple-500">Q<sup>T</sup></span>
        </StepFormula>
        <div className="flex flex-wrap gap-3 justify-center text-[10px] mb-2">
          <span className="text-purple-500"><b>Q</b> = eigenvectors (rotation)</span>
          <span className="text-amber-500"><b>Λ</b> = eigenvalues (scaling)</span>
        </div>
        {/* Visual: ellipse with eigenvector arrows */}
        <svg viewBox="0 0 200 120" className="w-full max-w-[200px] mx-auto" aria-label="Contour ellipse with eigenvector arrows">
          <defs>
            <marker id="arrowPurp" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#8b5cf6" />
            </marker>
            <marker id="arrowAmb2" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>
          {/* ellipse */}
          <ellipse cx="100" cy="55" rx="55" ry="25" transform="rotate(-25,100,55)"
            fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1.5" />
          {/* eigenvector 1 (major axis) */}
          <line x1="100" y1="55"
            x2={100 + 50 * Math.cos(-25 * Math.PI / 180)} y2={55 + 50 * Math.sin(-25 * Math.PI / 180)}
            stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowPurp)" />
          <text
            x={100 + 54 * Math.cos(-25 * Math.PI / 180)}
            y={55 + 54 * Math.sin(-25 * Math.PI / 180) - 4}
            fontSize="9" className="fill-purple-500" fontWeight="bold">q1</text>
          {/* eigenvector 2 (minor axis) */}
          <line x1="100" y1="55"
            x2={100 + 22 * Math.cos((-25 + 90) * Math.PI / 180)} y2={55 + 22 * Math.sin((-25 + 90) * Math.PI / 180)}
            stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowAmb2)" />
          <text
            x={100 + 26 * Math.cos((-25 + 90) * Math.PI / 180) - 6}
            y={55 + 26 * Math.sin((-25 + 90) * Math.PI / 180)}
            fontSize="9" className="fill-amber-500" fontWeight="bold">q2</text>
          {/* center */}
          <circle cx="100" cy="55" r="3" fill="#6b7280" />
          {/* labels */}
          <text x="155" y="38" fontSize="8" className="fill-purple-400">length = &radic;λ1</text>
          <text x="46" y="28" fontSize="8" className="fill-amber-400">length = &radic;λ2</text>
          <text x="100" y="112" textAnchor="middle" fontSize="8" className="fill-gray-400">
            PCA rotates to q1,q2 axes &mdash; making Σ diagonal
          </text>
        </svg>
      </StepCard>

      {/* Final note */}
      <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <b>That is the entire Gaussian, derived from scratch.</b> Every piece of the formula
          exists for a reason: subtracting the mean centers it, dividing by σ normalizes scale,
          squaring removes sign, the exponential converts distance to likelihood, and the matrix
          machinery generalizes all of it to any number of correlated dimensions. Go back to Tabs 1-3
          and see each piece in action.
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
