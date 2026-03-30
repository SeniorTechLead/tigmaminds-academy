import { useState, useMemo, useCallback } from 'react';

// ─── Math helpers ───────────────────────────────────────────
function gaussPDF2D(
  x: number, y: number,
  mux: number, muy: number,
  sx: number, sy: number,
  rho: number,
): number {
  const dx = (x - mux) / sx;
  const dy = (y - muy) / sy;
  const z = dx * dx - 2 * rho * dx * dy + dy * dy;
  const denom = 2 * Math.PI * sx * sy * Math.sqrt(Math.max(1e-10, 1 - rho * rho));
  return Math.exp(-z / (2 * Math.max(1e-10, 1 - rho * rho))) / denom;
}

// Mountain shape: radial Gaussian bump
function mountainHeight(x: number, y: number): number {
  const r2 = x * x + y * y;
  return Math.exp(-r2 / 0.18) * 1.0;
}

// Viridis-inspired color map (dark purple -> teal -> yellow)
function viridisColor(t: number): string {
  // t in [0,1]
  const c = Math.max(0, Math.min(1, t));
  const r = Math.round(68 + c * (253 - 68));
  const g = Math.round(1 + c * (231 - 1));
  const b = Math.round(84 + (c < 0.5 ? c * 2 * (168 - 84) : (168 + (c - 0.5) * 2 * (37 - 168))));
  return `rgb(${r},${g},${b})`;
}

function plasmaColor(t: number): string {
  const c = Math.max(0, Math.min(1, t));
  // Approximate plasma: purple -> magenta -> orange -> yellow
  let r: number, g: number, b: number;
  if (c < 0.25) {
    const s = c / 0.25;
    r = Math.round(13 + s * (126 - 13));
    g = Math.round(8 + s * (3 - 8));
    b = Math.round(135 + s * (168 - 135));
  } else if (c < 0.5) {
    const s = (c - 0.25) / 0.25;
    r = Math.round(126 + s * (204 - 126));
    g = Math.round(3 + s * (71 - 3));
    b = Math.round(168 + s * (120 - 168));
  } else if (c < 0.75) {
    const s = (c - 0.5) / 0.25;
    r = Math.round(204 + s * (248 - 204));
    g = Math.round(71 + s * (149 - 71));
    b = Math.round(120 + s * (64 - 120));
  } else {
    const s = (c - 0.75) / 0.25;
    r = Math.round(248 + s * (240 - 248));
    g = Math.round(149 + s * (249 - 149));
    b = Math.round(64 + s * (33 - 64));
  }
  return `rgb(${r},${g},${b})`;
}

// ─── Isometric projection ──────────────────────────────────
function isoProject(
  x: number, y: number, z: number,
  angle: number, // 0 = side, 1 = top-down
  cx: number, cy: number, scale: number,
): [number, number] {
  // Blend between isometric and top-down
  const isoX = (x - y) * 0.866;
  const isoY = (x + y) * 0.5;
  const sideX = isoX;
  const sideY = isoY - z;

  const topX = x;
  const topY = y;

  const px = cx + (sideX * (1 - angle) + topX * angle) * scale;
  const py = cy + (sideY * (1 - angle) + topY * angle) * scale;
  return [px, py];
}

// ─── Shared slider ─────────────────────────────────────────
function Slider({
  label, value, min, max, step, onChange, unit = '', color = 'sky',
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string; color?: string;
}) {
  const accent =
    color === 'blue' ? 'accent-blue-500' :
    color === 'purple' ? 'accent-purple-500' :
    color === 'amber' ? 'accent-amber-500' :
    color === 'rose' ? 'accent-rose-500' :
    'accent-sky-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`flex-1 h-1.5 rounded-full cursor-pointer ${accent}`}
      />
      <span className="text-xs font-mono text-gray-700 dark:text-gray-300 w-16 text-right">
        {value.toFixed(step < 0.1 ? 2 : 1)}{unit}
      </span>
    </div>
  );
}

// ─── Annotation bubble ────────────────────────────────────
function Annotation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 ${className}`}>
      {children}
    </div>
  );
}

// ─── SECTION 1: Mountain ───────────────────────────────────
function Section1Mountain() {
  const [viewAngle, setViewAngle] = useState(0.15);

  const W = 400, H = 320;
  const GRID = 30;

  const { mountainSurface, contourRings, slicePlanes } = useMemo(() => {
    const surface: { x: number; y: number; z: number; color: string }[] = [];
    const rings: { level: number; points: [number, number][] }[] = [];
    const levels = [0.2, 0.4, 0.6, 0.8];

    // Build surface grid
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = (i / (GRID - 1) - 0.5) * 2;
        const y = (j / (GRID - 1) - 0.5) * 2;
        const z = mountainHeight(x, y);
        const green = Math.round(80 + z * 120);
        const brown = Math.round(60 + (1 - z) * 60);
        surface.push({ x, y, z, color: `rgb(${brown},${green},${Math.round(40 + z * 30)})` });
      }
    }

    // Extract contour rings at each level
    for (const level of levels) {
      const pts: [number, number][] = [];
      const steps = 64;
      for (let a = 0; a < steps; a++) {
        const theta = (a / steps) * 2 * Math.PI;
        // Find radius where mountainHeight = level via bisection
        let lo = 0, hi = 1.2;
        for (let k = 0; k < 20; k++) {
          const mid = (lo + hi) / 2;
          const val = mountainHeight(mid * Math.cos(theta), mid * Math.sin(theta));
          if (val > level) lo = mid; else hi = mid;
        }
        const r = (lo + hi) / 2;
        pts.push([r * Math.cos(theta), r * Math.sin(theta)]);
      }
      rings.push({ level, points: pts });
    }

    return { mountainSurface: surface, contourRings: rings, slicePlanes: levels };
  }, []);

  const cx = W / 2, cy = H * 0.55;
  const scale = 120;

  // Render contour rings projected
  const renderRings = useCallback(() => {
    const colors = ['#22c55e', '#eab308', '#f97316', '#ef4444'];
    return contourRings.map((ring, ri) => {
      const pathParts = ring.points.map((pt, i) => {
        const z = viewAngle > 0.7 ? 0 : ring.level * (1 - viewAngle);
        const [px, py] = isoProject(pt[0], pt[1], z, viewAngle, cx, cy, scale);
        return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
      });
      return (
        <path
          key={ri}
          d={pathParts.join(' ') + 'Z'}
          fill="none"
          stroke={colors[ri]}
          strokeWidth={2}
          opacity={0.9}
        />
      );
    });
  }, [viewAngle, contourRings, cx, cy, scale]);

  // Render surface as quads (back to front)
  const renderSurface = useCallback(() => {
    if (viewAngle > 0.85) return null; // pure top-down, skip 3D
    const quads: { path: string; color: string; depth: number }[] = [];
    for (let i = 0; i < GRID - 1; i++) {
      for (let j = 0; j < GRID - 1; j++) {
        const idx = (ii: number, jj: number) => ii * GRID + jj;
        const p00 = mountainSurface[idx(i, j)];
        const p10 = mountainSurface[idx(i + 1, j)];
        const p11 = mountainSurface[idx(i + 1, j + 1)];
        const p01 = mountainSurface[idx(i, j + 1)];

        const corners = [p00, p10, p11, p01];
        const projected = corners.map(p =>
          isoProject(p.x, p.y, p.z, viewAngle, cx, cy, scale)
        );
        const avgZ = (p00.z + p10.z + p11.z + p01.z) / 4;
        const avgDepth = corners.reduce((s, p) => s + p.x + p.y, 0) / 4;

        const d = projected.map((pt, k) => `${k === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ') + 'Z';
        const green = Math.round(60 + avgZ * 140);
        const brown = Math.round(70 + (1 - avgZ) * 50);

        quads.push({ path: d, color: `rgb(${brown},${green},${Math.round(30 + avgZ * 40)})`, depth: avgDepth - avgZ * 2 });
      }
    }
    quads.sort((a, b) => a.depth - b.depth);
    return quads.map((q, i) => (
      <path key={i} d={q.path} fill={q.color} stroke={q.color} strokeWidth={0.5} opacity={0.85 - viewAngle * 0.5} />
    ));
  }, [viewAngle, mountainSurface, cx, cy, scale]);

  // Render slice plane indicators
  const renderSlicePlanes = useCallback(() => {
    if (viewAngle > 0.7) return null;
    return slicePlanes.map((level, i) => {
      const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      const projected = corners.map(([x, y]) =>
        isoProject(x, y, level * (1 - viewAngle), viewAngle, cx, cy, scale)
      );
      const d = projected.map((pt, k) => `${k === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ') + 'Z';
      return <path key={i} d={d} fill="rgba(147,197,253,0.08)" stroke="rgba(147,197,253,0.25)" strokeWidth={0.5} />;
    });
  }, [viewAngle, slicePlanes, cx, cy, scale]);

  // Annotations for steepness
  const steepPoint = isoProject(0.15, -0.15, 0, viewAngle, cx, cy, scale);
  const gentlePoint = isoProject(0.7, -0.7, 0, viewAngle, cx, cy, scale);

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
        1. Imagine a Mountain
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        A contour map is what you see when you look straight down at a 3D surface. Drag the slider to rotate
        from a side view to a top-down view and watch the contour rings appear.
      </p>

      <div className="mb-3">
        <Slider
          label="View angle"
          value={viewAngle}
          min={0}
          max={1}
          step={0.01}
          onChange={setViewAngle}
          unit=""
          color="sky"
        />
        <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-500 mt-0.5 px-20">
          <span>3D side</span>
          <span>Top-down map</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" style={{ minHeight: 200 }}>
        <defs>
          <radialGradient id="mtn-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} rx={12} fill="url(#mtn-bg)" />

        {renderSlicePlanes()}
        {renderSurface()}
        {renderRings()}

        {/* Annotations */}
        {viewAngle > 0.6 && (
          <>
            <text x={steepPoint[0] + 20} y={steepPoint[1] - 5} fontSize={11} fill="#fbbf24" fontWeight="bold">
              Close = steep
            </text>
            <text x={gentlePoint[0] - 10} y={gentlePoint[1] + 15} fontSize={11} fill="#86efac" fontWeight="bold">
              Far apart = gentle
            </text>
          </>
        )}
      </svg>

      <Annotation className="mt-2">
        Each colored ring is where a horizontal slice cuts the mountain. Viewed from above, the rings become contour lines on a map.
      </Annotation>
    </div>
  );
}

// ─── SECTION 2: Bell Curve ─────────────────────────────────
function Section2BellCurve() {
  const [sigma, setSigma] = useState(0.5);

  const W = 400, H = 320;
  const GRID = 40;

  const { cells, contourPaths } = useMemo(() => {
    const cellSize = 2.4 / GRID;
    const gridCells: { x: number; y: number; val: number }[] = [];
    const vals: number[][] = [];

    for (let i = 0; i < GRID; i++) {
      vals[i] = [];
      for (let j = 0; j < GRID; j++) {
        const x = (i / (GRID - 1) - 0.5) * 2.4;
        const y = (j / (GRID - 1) - 0.5) * 2.4;
        const val = gaussPDF2D(x, y, 0, 0, sigma, sigma, 0);
        vals[i][j] = val;
        gridCells.push({ x, y, val });
      }
    }

    // Normalize values for coloring
    const maxVal = Math.max(...gridCells.map(c => c.val));

    // Extract contour lines using marching squares (simplified)
    const levels = [0.15, 0.35, 0.55, 0.75, 0.9].map(l => l * maxVal);
    const paths: { level: number; points: [number, number][] }[] = [];

    for (const level of levels) {
      const pts: [number, number][] = [];
      const steps = 64;
      for (let a = 0; a < steps; a++) {
        const theta = (a / steps) * 2 * Math.PI;
        // Bisect to find radius where PDF = level
        let lo = 0, hi = 1.5;
        for (let k = 0; k < 20; k++) {
          const mid = (lo + hi) / 2;
          const val = gaussPDF2D(mid * Math.cos(theta), mid * Math.sin(theta), 0, 0, sigma, sigma, 0);
          if (val > level) lo = mid; else hi = mid;
        }
        const r = (lo + hi) / 2;
        pts.push([r * Math.cos(theta), r * Math.sin(theta)]);
      }
      paths.push({ level, points: pts });
    }

    return {
      cells: gridCells.map(c => ({ ...c, norm: c.val / maxVal })),
      contourPaths: paths,
    };
  }, [sigma]);

  const toSvg = (x: number, y: number): [number, number] => {
    return [W / 2 + x * (W / 2.8), H / 2 + y * (H / 2.8)];
  };

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
        2. Now Replace the Mountain with a Bell Curve
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        A Gaussian (bell curve) in 2D looks like a smooth hill. Viewed from above, it becomes
        concentric circles. The center is the mean. Adjust the spread to see how it changes.
      </p>

      <div className="mb-3">
        <Slider
          label="Spread (\u03C3)"
          value={sigma}
          min={0.2}
          max={1.0}
          step={0.01}
          onChange={setSigma}
          color="purple"
        />
        <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-500 mt-0.5 px-20">
          <span>Narrow (steep)</span>
          <span>Wide (gentle)</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" style={{ minHeight: 200 }}>
        <rect width={W} height={H} rx={12} fill="#0f172a" />

        {/* Heatmap cells */}
        {cells.map((cell, i) => {
          const [sx, sy] = toSvg(cell.x, cell.y);
          const size = (W / GRID) * 0.88;
          return (
            <rect
              key={i}
              x={sx - size / 2} y={sy - size / 2}
              width={size} height={size}
              fill={plasmaColor(cell.norm)}
              opacity={0.85}
            />
          );
        })}

        {/* Contour lines */}
        {contourPaths.map((ring, ri) => {
          const d = ring.points.map((pt, i) => {
            const [sx, sy] = toSvg(pt[0], pt[1]);
            return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
          }).join(' ') + 'Z';
          return <path key={ri} d={d} fill="none" stroke="white" strokeWidth={1.2} opacity={0.7} />;
        })}

        {/* Center mark */}
        <circle cx={W / 2} cy={H / 2} r={3} fill="#fbbf24" />
        <text x={W / 2 + 8} y={H / 2 - 8} fontSize={12} fill="#fbbf24" fontWeight="bold">
          {'\u03BC (mean)'}
        </text>

        {/* Labels */}
        <text x={W / 2 + 50} y={H / 2 + 50} fontSize={11} fill="rgba(255,255,255,0.6)">
          High probability
        </text>
        <text x={W - 70} y={H - 20} fontSize={11} fill="rgba(255,255,255,0.4)">
          Low probability
        </text>
      </svg>

      <Annotation className="mt-2">
        The peak of the bell = the center of the circles = the mean. Tight circles = probability drops steeply. Wide circles = gentle spread.
      </Annotation>
    </div>
  );
}

// ─── SECTION 3: Correlation ────────────────────────────────
function Section3Correlation() {
  const [rho, setRho] = useState(0);

  const W = 400, H = 300;
  const GRID = 40;

  const { cells, contourPaths } = useMemo(() => {
    const sx = 0.5, sy = 0.5;
    const gridCells: { x: number; y: number; val: number }[] = [];
    const range = 1.8;

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = (i / (GRID - 1) - 0.5) * range * 2;
        const y = (j / (GRID - 1) - 0.5) * range * 2;
        const val = gaussPDF2D(x, y, 0, 0, sx, sy, rho);
        gridCells.push({ x, y, val });
      }
    }

    const maxVal = Math.max(...gridCells.map(c => c.val));

    // Contour lines for correlated Gaussian
    const levels = [0.1, 0.3, 0.5, 0.7, 0.9].map(l => l * maxVal);
    const paths: { level: number; points: [number, number][] }[] = [];

    for (const level of levels) {
      const pts: [number, number][] = [];
      const steps = 80;
      for (let a = 0; a < steps; a++) {
        const theta = (a / steps) * 2 * Math.PI;
        let lo = 0, hi = 2.0;
        for (let k = 0; k < 25; k++) {
          const mid = (lo + hi) / 2;
          const val = gaussPDF2D(mid * Math.cos(theta), mid * Math.sin(theta), 0, 0, sx, sy, rho);
          if (val > level) lo = mid; else hi = mid;
        }
        const r = (lo + hi) / 2;
        pts.push([r * Math.cos(theta), r * Math.sin(theta)]);
      }
      paths.push({ level, points: pts });
    }

    return {
      cells: gridCells.map(c => ({ ...c, norm: c.val / maxVal })),
      contourPaths: paths,
    };
  }, [rho]);

  const toSvg = (x: number, y: number): [number, number] => {
    return [W / 2 + x * (W / 4.2), H / 2 + y * (H / 4.2)];
  };

  const rhoLabel = rho === 0 ? 'No correlation' :
    rho > 0 ? `Positive (\u03C1 = ${rho.toFixed(2)})` :
    `Negative (\u03C1 = ${rho.toFixed(2)})`;

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
        3. What Correlation Looks Like from Above
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        When two variables are correlated, the bell surface stretches diagonally. From above,
        the contour circles become tilted ellipses. The tilt <em>is</em> the correlation.
      </p>

      <div className="mb-3">
        <Slider
          label={`\u03C1 (corr)`}
          value={rho}
          min={-0.95}
          max={0.95}
          step={0.01}
          onChange={setRho}
          color="rose"
        />
        <div className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
          {rhoLabel}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" style={{ minHeight: 190 }}>
        <rect width={W} height={H} rx={12} fill="#0f172a" />

        {/* Heatmap */}
        {cells.map((cell, i) => {
          const [sx, sy] = toSvg(cell.x, cell.y);
          const size = (W / GRID) * 0.95;
          return (
            <rect
              key={i}
              x={sx - size / 2} y={sy - size / 2}
              width={size} height={size}
              fill={plasmaColor(cell.norm)}
              opacity={0.85}
            />
          );
        })}

        {/* Contour lines */}
        {contourPaths.map((ring, ri) => {
          const d = ring.points.map((pt, i) => {
            const [sx, sy] = toSvg(pt[0], pt[1]);
            return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
          }).join(' ') + 'Z';
          return (
            <path key={ri} d={d} fill="none" stroke="white" strokeWidth={1.2} opacity={0.65} />
          );
        })}

        {/* Axes */}
        <line x1={30} y1={H / 2} x2={W - 30} y2={H / 2} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <text x={W - 28} y={H / 2 - 6} fontSize={11} fill="rgba(255,255,255,0.5)">x</text>
        <text x={W / 2 + 6} y={24} fontSize={11} fill="rgba(255,255,255,0.5)">y</text>

        {/* Tilt indicator */}
        {Math.abs(rho) > 0.1 && (
          <line
            x1={W / 2 - 60 * Math.sign(rho)} y1={H / 2 + 60}
            x2={W / 2 + 60 * Math.sign(rho)} y2={H / 2 - 60}
            stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}
          />
        )}
      </svg>

      <Annotation className="mt-2">
        <strong>Key insight:</strong> The tilt of the ellipse IS the correlation. The narrowness tells you how strong it is.
        At {'\u03C1'} = 0 the ellipses are circular. Near {'\u03C1'} = {'\u00B1'}1 they collapse into a thin tilted line.
      </Annotation>
    </div>
  );
}

// ─── SECTION 4: Colors ─────────────────────────────────────
function Section4Colors() {
  const [showContourLines, setShowContourLines] = useState(true);

  const W = 400, H = 300;
  const GRID = 45;

  const { cells, contourPaths, maxVal } = useMemo(() => {
    const sx = 0.45, sy = 0.45;
    const gridCells: { x: number; y: number; val: number }[] = [];
    const range = 1.6;

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = (i / (GRID - 1) - 0.5) * range * 2;
        const y = (j / (GRID - 1) - 0.5) * range * 2;
        const val = gaussPDF2D(x, y, 0, 0, sx, sy, 0.4);
        gridCells.push({ x, y, val });
      }
    }

    const mv = Math.max(...gridCells.map(c => c.val));

    const levels = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map(l => l * mv);
    const paths: { level: number; points: [number, number][] }[] = [];

    for (const level of levels) {
      const pts: [number, number][] = [];
      const steps = 80;
      for (let a = 0; a < steps; a++) {
        const theta = (a / steps) * 2 * Math.PI;
        let lo = 0, hi = 2.0;
        for (let k = 0; k < 25; k++) {
          const mid = (lo + hi) / 2;
          const val = gaussPDF2D(mid * Math.cos(theta), mid * Math.sin(theta), 0, 0, 0.45, 0.45, 0.4);
          if (val > level) lo = mid; else hi = mid;
        }
        const r = (lo + hi) / 2;
        pts.push([r * Math.cos(theta), r * Math.sin(theta)]);
      }
      paths.push({ level, points: pts });
    }

    return { cells: gridCells.map(c => ({ ...c, norm: c.val / mv })), contourPaths: paths, maxVal: mv };
  }, []);

  const toSvg = (x: number, y: number): [number, number] => {
    return [W * 0.42 + x * (W / 4.0), H / 2 + y * (H / 3.6)];
  };

  // Color legend
  const legendX = W * 0.82;
  const legendY = 30;
  const legendH = H - 60;
  const legendSteps = 20;

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
        4. Reading the Colors
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Color-filled contour plots use brightness to show probability. The center is brightest (most likely),
        the edges are dark (least likely). This is exactly the same information as the contour lines, just
        painted in.
      </p>

      <div className="mb-3 flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showContourLines}
            onChange={e => setShowContourLines(e.target.checked)}
            className="rounded accent-sky-500"
          />
          Show contour lines
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto" style={{ minHeight: 190 }}>
        <rect width={W} height={H} rx={12} fill="#0f172a" />

        {/* Heatmap */}
        {cells.map((cell, i) => {
          const [sx, sy] = toSvg(cell.x, cell.y);
          const size = (W * 0.84 / GRID) * 1.05;
          return (
            <rect
              key={i}
              x={sx - size / 2} y={sy - size / 2}
              width={size} height={size}
              fill={plasmaColor(cell.norm)}
              opacity={0.9}
            />
          );
        })}

        {/* Contour lines */}
        {showContourLines && contourPaths.map((ring, ri) => {
          const d = ring.points.map((pt, i) => {
            const [sx, sy] = toSvg(pt[0], pt[1]);
            return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
          }).join(' ') + 'Z';
          return (
            <path key={ri} d={d} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
          );
        })}

        {/* Color legend */}
        {Array.from({ length: legendSteps }, (_, i) => {
          const t = 1 - i / (legendSteps - 1);
          const y = legendY + (i / (legendSteps - 1)) * legendH;
          return (
            <rect key={i} x={legendX} y={y} width={18} height={legendH / legendSteps + 1} fill={plasmaColor(t)} />
          );
        })}
        <rect x={legendX} y={legendY} width={18} height={legendH} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} rx={2} />
        <text x={legendX + 22} y={legendY + 10} fontSize={10} fill="rgba(255,255,255,0.7)">High</text>
        <text x={legendX + 22} y={legendY + legendH - 2} fontSize={10} fill="rgba(255,255,255,0.7)">Low</text>
        <text x={legendX - 2} y={legendY - 8} fontSize={10} fill="rgba(255,255,255,0.5)" textAnchor="middle">Probability</text>

        {/* Inner annotation */}
        <text x={W * 0.42} y={H / 2 + 4} fontSize={11} fill="white" fontWeight="bold" textAnchor="middle" opacity={0.8}>
          95% likely
        </text>
      </svg>

      <Annotation className="mt-2">
        <strong>ML connection:</strong> When a model says "this email is 95% spam," it means the data point falls inside the bright inner contour of the "spam" distribution.
      </Annotation>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
const TABS = [
  'The Mountain',
  'The Bell Curve',
  'Correlation',
  'Reading Colors',
] as const;

export default function ContourExplainer() {
  const [tab, setTab] = useState(0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🗺️</span>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Contour Plot Explainer
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          If you can read a hiking map, you can read a Gaussian contour plot. They are the same idea.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
        {TABS.map((label, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === i
                ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {tab === 0 && <Section1Mountain />}
        {tab === 1 && <Section2BellCurve />}
        {tab === 2 && <Section3Correlation />}
        {tab === 3 && <Section4Colors />}
      </div>
    </div>
  );
}
