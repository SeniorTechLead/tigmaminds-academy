'use client';
import { useState, useMemo } from 'react';

interface TechPreset {
  label: string;
  p: number;
  q: number;
  currentPct: number;
  year: string;
}

const PRESETS: Record<string, TechPreset> = {
  smartphones: { label: 'Smartphones', p: 0.03, q: 0.45, currentPct: 92, year: '2007-2024' },
  ev: { label: 'Electric Vehicles', p: 0.01, q: 0.30, currentPct: 18, year: '2010-present' },
  internet: { label: 'Internet', p: 0.02, q: 0.38, currentPct: 99, year: '1990-2020' },
};

const CATEGORIES = [
  { name: 'Innovators', pct: 2.5, color: '#ef4444' },
  { name: 'Early Adopters', pct: 13.5, color: '#f97316' },
  { name: 'Early Majority', pct: 34, color: '#eab308' },
  { name: 'Late Majority', pct: 34, color: '#22c55e' },
  { name: 'Laggards', pct: 16, color: '#6366f1' },
];

// Bass diffusion model: F(t) = (1 - e^(-(p+q)t)) / (1 + (q/p)e^(-(p+q)t))
function bassF(t: number, p: number, q: number): number {
  const r = p + q;
  const exp = Math.exp(-r * t);
  return (1 - exp) / (1 + (q / p) * exp);
}

// Bass density: f(t) = derivative of F(t)
function bassf(t: number, p: number, q: number): number {
  const r = p + q;
  const exp = Math.exp(-r * t);
  const denom = 1 + (q / p) * exp;
  return (r * (q / p) * exp + r * exp * 0) / (denom * denom);
  // Correct formula: f(t) = (p+q)^2/p * exp(-(p+q)t) / (1 + q/p * exp(-(p+q)t))^2
}

function bassDensity(t: number, p: number, q: number): number {
  const r = p + q;
  const exp = Math.exp(-r * t);
  const denom = 1 + (q / p) * exp;
  return ((r * r) / p) * exp / (denom * denom);
}

export default function TechDiffusionDiagram() {
  const [preset, setPreset] = useState<string>('smartphones');
  const [customP, setCustomP] = useState(PRESETS.smartphones.p);
  const [customQ, setCustomQ] = useState(PRESETS.smartphones.q);

  const tech = PRESETS[preset];
  const p = customP;
  const q = customQ;

  // Chart area
  const cx = 55, cy = 30, cw = 370, ch = 100;
  const bellCy = 165, bellCh = 70;

  // Time range: find when adoption reaches ~99%
  const tMax = useMemo(() => {
    for (let t = 1; t <= 50; t++) {
      if (bassF(t, p, q) > 0.995) return t + 1;
    }
    return 30;
  }, [p, q]);

  // S-curve points
  const sPoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * tMax;
      const f = bassF(t, p, q);
      const x = cx + (i / 200) * cw;
      const y = cy + ch - f * ch;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [p, q, tMax]);

  // Bell curve points & max density for normalization
  const { bellPoints, bellSegments, maxDensity } = useMemo(() => {
    let maxD = 0;
    const densities: { t: number; d: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * tMax;
      const d = bassDensity(t, p, q);
      densities.push({ t, d });
      if (d > maxD) maxD = d;
    }
    const pts = densities.map((item, i) => {
      const x = cx + (i / 200) * cw;
      const y = bellCy + bellCh - (item.d / maxD) * bellCh;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Compute segments for colored areas
    const segments: { catIdx: number; points: string }[] = [];
    let cumPct = 0;
    CATEGORIES.forEach((cat, catIdx) => {
      const startPct = cumPct / 100;
      cumPct += cat.pct;
      const endPct = cumPct / 100;
      // Find time range where F(t) is in [startPct, endPct]
      const segPts: string[] = [];
      let started = false;
      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * tMax;
        const f = bassF(t, p, q);
        if (f >= startPct && f <= endPct + 0.01) {
          const x = cx + (i / 200) * cw;
          const d = bassDensity(t, p, q);
          const y = bellCy + bellCh - (d / maxD) * bellCh;
          if (!started) {
            segPts.push(`${x.toFixed(1)},${(bellCy + bellCh).toFixed(1)}`);
            started = true;
          }
          segPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
      }
      if (segPts.length > 1) {
        // Close the polygon back to baseline
        const lastX = segPts[segPts.length - 1].split(',')[0];
        segPts.push(`${lastX},${(bellCy + bellCh).toFixed(1)}`);
        segments.push({ catIdx, points: segPts.join(' ') });
      }
    });

    return { bellPoints: pts, bellSegments: segments, maxDensity: maxD };
  }, [p, q, tMax]);

  // Current adoption marker position on S-curve
  const currentT = useMemo(() => {
    for (let i = 0; i <= 1000; i++) {
      const t = (i / 1000) * tMax;
      if (bassF(t, p, q) * 100 >= tech.currentPct) return t;
    }
    return tMax;
  }, [p, q, tMax, tech.currentPct]);

  const markerX = cx + (currentT / tMax) * cw;
  const markerY = cy + ch - (tech.currentPct / 100) * ch;

  // Determine which category the current adoption falls in
  const currentCategory = useMemo(() => {
    let cum = 0;
    for (const cat of CATEGORIES) {
      cum += cat.pct;
      if (tech.currentPct <= cum) return cat.name;
    }
    return 'Laggards';
  }, [tech.currentPct]);

  // The chasm location: between Early Adopters (16%) and Early Majority
  const chasmPct = 16; // 2.5 + 13.5
  const chasmT = useMemo(() => {
    for (let i = 0; i <= 1000; i++) {
      const t = (i / 1000) * tMax;
      if (bassF(t, p, q) * 100 >= chasmPct) return t;
    }
    return tMax * 0.2;
  }, [p, q, tMax]);

  const chasmX = cx + (chasmT / tMax) * cw;

  const handlePreset = (key: string) => {
    setPreset(key);
    setCustomP(PRESETS[key].p);
    setCustomQ(PRESETS[key].q);
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-2 items-center justify-center">
        {Object.entries(PRESETS).map(([key, val]) => (
          <button key={key} onClick={() => handlePreset(key)}
            className={`px-3 py-1 rounded text-xs font-semibold ${preset === key ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200'}`}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-slate-400">p (innovation)</span>
          <input type="range" min={1} max={10} value={Math.round(customP * 100)}
            onChange={e => setCustomP(Number(e.target.value) / 100)}
            className="w-24 accent-blue-500" />
          <span className="text-xs font-mono w-8">{customP.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-slate-400">q (imitation)</span>
          <input type="range" min={10} max={60} value={Math.round(customQ * 100)}
            onChange={e => setCustomQ(Number(e.target.value) / 100)}
            className="w-24 accent-green-500" />
          <span className="text-xs font-mono w-8">{customQ.toFixed(2)}</span>
        </div>
      </div>

      <svg viewBox="0 0 460 280" className="w-full h-auto" role="img" aria-label="Technology diffusion S-curve and adoption bell curve">
        <rect width="460" height="280" rx="8" className="fill-white dark:fill-slate-950" />
        <text x="230" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          The S-Curve of Technology Adoption
        </text>
        <text x="230" y="28" textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">
          {tech.label} ({tech.year})
        </text>

        {/* S-Curve */}
        <g>
          {/* Axes */}
          <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
          <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
          <text x={cx - 6} y={cy + 4} textAnchor="end" fontSize="7" className="fill-gray-400">100%</text>
          <text x={cx - 6} y={cy + ch / 2 + 3} textAnchor="end" fontSize="7" className="fill-gray-400">50%</text>
          <text x={cx - 6} y={cy + ch + 3} textAnchor="end" fontSize="7" className="fill-gray-400">0%</text>
          {/* Gridline at 50% */}
          <line x1={cx} y1={cy + ch / 2} x2={cx + cw} y2={cy + ch / 2} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3" />

          {/* S-curve line */}
          <polyline points={sPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

          {/* Current marker */}
          <line x1={markerX} y1={cy} x2={markerX} y2={cy + ch} stroke="#ef4444" strokeWidth="1" strokeDasharray="4" opacity="0.7" />
          <circle cx={markerX} cy={markerY} r={5} fill="#ef4444" stroke="#fff" strokeWidth="1.5">
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x={markerX} y={cy - 2} textAnchor="middle" fontSize="8" fontWeight="700" fill="#ef4444">
            {tech.currentPct}%
          </text>

          {/* Chasm marker */}
          <line x1={chasmX} y1={cy} x2={chasmX} y2={cy + ch} stroke="#f97316" strokeWidth="1.5" strokeDasharray="2,3" />
          <text x={chasmX + 3} y={cy + 10} fontSize="7" fontWeight="600" fill="#f97316">THE CHASM</text>
        </g>

        {/* Bell curve with colored segments */}
        <g>
          <line x1={cx} y1={bellCy + bellCh} x2={cx + cw} y2={bellCy + bellCh} stroke="#94a3b8" strokeWidth="1" />

          {/* Colored segments */}
          {bellSegments.map(seg => (
            <polygon key={seg.catIdx} points={seg.points} fill={CATEGORIES[seg.catIdx].color} opacity="0.35" />
          ))}

          {/* Bell curve outline */}
          <polyline points={bellPoints} fill="none" stroke="#64748b" strokeWidth="1.5" />

          {/* Category labels */}
          {(() => {
            let cum = 0;
            return CATEGORIES.map((cat, i) => {
              const startPct = cum;
              cum += cat.pct;
              const midPct = (startPct + cum) / 2 / 100;
              // Find time for midPct
              let midT = 0;
              for (let j = 0; j <= 500; j++) {
                const t = (j / 500) * tMax;
                if (bassF(t, p, q) >= midPct) { midT = t; break; }
              }
              const labelX = cx + (midT / tMax) * cw;
              return (
                <g key={i}>
                  <text x={labelX} y={bellCy + bellCh + 11} textAnchor="middle" fontSize="6" fontWeight="600" fill={cat.color}>
                    {cat.name}
                  </text>
                  <text x={labelX} y={bellCy + bellCh + 19} textAnchor="middle" fontSize="6" className="fill-gray-400">
                    {cat.pct}%
                  </text>
                </g>
              );
            });
          })()}
        </g>

        {/* Axis label */}
        <text x={cx + cw / 2} y={272} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Time</text>
      </svg>

      {/* Description */}
      <p className="text-center text-sm mt-2 px-4 font-semibold text-gray-700 dark:text-slate-300">
        {tech.label}: currently at {tech.currentPct}% adoption, in the <span style={{ color: CATEGORIES.find(c => c.name === currentCategory)?.color }}>{currentCategory}</span> phase.
      </p>
      <p className="text-center text-xs mt-1 px-4 text-gray-500 dark:text-slate-400 italic">
        Adjust p (innovation coefficient) and q (imitation coefficient) to see how word-of-mouth vs. advertising reshapes adoption.
      </p>
    </div>
  );
}
