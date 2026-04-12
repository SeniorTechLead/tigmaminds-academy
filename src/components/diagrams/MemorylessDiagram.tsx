'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * The Memoryless Property — two timelines showing exponential wait.
 * λ = 0.1 (mean wait = 10 min). Shows P(wait > t) = e^(-λt).
 * Timeline A: just arrived. Timeline B: already waited 15 min.
 * Both have the same remaining-wait distribution.
 */

const LAMBDA = 0.1;
const ALREADY_WAITED = 15;

export default function MemorylessDiagram() {
  const [animating, setAnimating] = useState(false);
  const [busPos, setBusPos] = useState<{ a: number; b: number }>({ a: 0, b: 0 });
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const W = 460, H = 270;
  const mx = 35, mr = 15;
  const pw = W - mx - mr;

  // Timeline params
  const tMax = 30; // max minutes shown
  const tlAY = 80;
  const tlBY = 170;
  const sx = (t: number) => mx + (t / tMax) * pw;

  // Exponential survival curve points
  const curvePts = (yBase: number, tStart: number, height: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * tMax;
      const prob = Math.exp(-LAMBDA * t); // P(remaining wait > t)
      const x = sx(t + tStart > tMax ? tMax : t + tStart);
      if (t + tStart > tMax) break;
      const y = yBase - prob * height;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  // Animation
  useEffect(() => {
    if (!animating) return;
    startRef.current = performance.now();
    const duration = 4000; // 4 seconds
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const frac = Math.min(elapsed / duration, 1);
      const tA = frac * tMax;
      const tB = ALREADY_WAITED + frac * (tMax - ALREADY_WAITED);
      setBusPos({ a: tA, b: tB });
      if (frac < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [animating]);

  const pWait5 = Math.exp(-LAMBDA * 5);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex gap-2 mb-2 justify-center">
        <button
          onClick={() => { setBusPos({ a: 0, b: 0 }); setAnimating(true); }}
          className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          {animating ? 'Animating...' : 'Start Bus Animation'}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Memoryless property of exponential distribution"
      >
        <rect width={W} height={H} rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x={W / 2} y={18} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          The Memoryless Property
        </text>

        {/* --- Timeline A: Just arrived --- */}
        <text x={mx} y={tlAY - 32} fill="#3b82f6" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
          A: Just arrived (t = 0)
        </text>

        {/* Timeline line */}
        <line x1={sx(0)} y1={tlAY} x2={sx(tMax)} y2={tlAY} stroke="#475569" strokeWidth="1.5" />
        {/* Tick marks */}
        {[0, 5, 10, 15, 20, 25, 30].map(t => (
          <g key={`a-${t}`}>
            <line x1={sx(t)} y1={tlAY - 3} x2={sx(t)} y2={tlAY + 3} stroke="#64748b" strokeWidth="1" />
            <text x={sx(t)} y={tlAY + 13} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">{t}</text>
          </g>
        ))}

        {/* Survival curve A */}
        <polyline points={curvePts(tlAY, 0, 28)} fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />

        {/* 5-min marker */}
        <line x1={sx(5)} y1={tlAY - 28} x2={sx(5)} y2={tlAY} stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" />
        <text x={sx(5) + 3} y={tlAY - 18} fill="#22c55e" fontSize="7" fontFamily="system-ui, sans-serif">
          P({'>'} 5) = {pWait5.toFixed(3)}
        </text>

        {/* Bus icon A */}
        {animating && (
          <g transform={`translate(${sx(busPos.a)}, ${tlAY - 8})`}>
            <rect x="-8" y="-6" width="16" height="10" rx="2" fill="#f59e0b" />
            <circle cx="-4" cy="5" r="2" fill="#1e293b" />
            <circle cx="4" cy="5" r="2" fill="#1e293b" />
          </g>
        )}

        {/* --- Timeline B: Already waited 15 min --- */}
        <text x={mx} y={tlBY - 32} fill="#ef4444" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
          B: Already waited 15 min
        </text>

        {/* Timeline line */}
        <line x1={sx(0)} y1={tlBY} x2={sx(tMax)} y2={tlBY} stroke="#475569" strokeWidth="1.5" />
        {/* Tick marks */}
        {[0, 5, 10, 15, 20, 25, 30].map(t => (
          <g key={`b-${t}`}>
            <line x1={sx(t)} y1={tlBY - 3} x2={sx(t)} y2={tlBY + 3} stroke="#64748b" strokeWidth="1" />
            <text x={sx(t)} y={tlBY + 13} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">{t}</text>
          </g>
        ))}

        {/* Gray zone: already waited */}
        <rect x={sx(0)} y={tlBY - 25} width={sx(ALREADY_WAITED) - sx(0)} height={25} fill="#64748b" opacity="0.15" />
        <text x={sx(ALREADY_WAITED / 2)} y={tlBY - 12} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">
          waited 15 min
        </text>

        {/* Survival curve B — same shape, offset to start at t=15 */}
        <polyline points={curvePts(tlBY, ALREADY_WAITED, 28)} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7" />

        {/* 5-more-min marker from t=15 */}
        <line x1={sx(20)} y1={tlBY - 28} x2={sx(20)} y2={tlBY} stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" />
        <text x={sx(20) + 3} y={tlBY - 18} fill="#22c55e" fontSize="7" fontFamily="system-ui, sans-serif">
          P({'>'} 5 more) = {pWait5.toFixed(3)}
        </text>

        {/* Bus icon B */}
        {animating && (
          <g transform={`translate(${sx(busPos.b)}, ${tlBY - 8})`}>
            <rect x="-8" y="-6" width="16" height="10" rx="2" fill="#f59e0b" />
            <circle cx="-4" cy="5" r="2" fill="#1e293b" />
            <circle cx="4" cy="5" r="2" fill="#1e293b" />
          </g>
        )}

        {/* Connecting annotation */}
        <text x={W / 2} y={H - 42} textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
          Both curves are identical — the remaining wait has the same distribution!
        </text>
        <text x={W / 2} y={H - 28} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="system-ui, sans-serif">
          P(wait {'>'} 5 | just arrived) = P(wait {'>'} 5 more | already waited 15) = e^(-0.5) = 0.607
        </text>
        <text x={W / 2} y={H - 14} textAnchor="middle" fill="#64748b" fontSize="8" fontStyle="italic" fontFamily="system-ui, sans-serif">
          &quot;The bus doesn&apos;t owe you anything for your past wait.&quot;
        </text>
      </svg>
    </div>
  );
}
