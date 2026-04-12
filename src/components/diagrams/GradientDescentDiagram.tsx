'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// Loss function: (w1 - 3)^2 + 2*(w2 - 2)^2, minimum at (3, 2)
const loss = (w1: number, w2: number) => (w1 - 3) ** 2 + 2 * (w2 - 2) ** 2;
const gradW1 = (w1: number) => 2 * (w1 - 3);
const gradW2 = (w2: number) => 4 * (w2 - 2);

// Domain: w1 in [-1, 7], w2 in [-1, 5] mapped to SVG
const W1_MIN = -1, W1_MAX = 7, W2_MIN = -1, W2_MAX = 5;
const PAD_LEFT = 44, PAD_TOP = 40, PAD_RIGHT = 16, PAD_BOTTOM = 32;
const SVG_W = 460, SVG_H = 280;
const PLOT_W = SVG_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

const toSvgX = (w1: number) => PAD_LEFT + ((w1 - W1_MIN) / (W1_MAX - W1_MIN)) * PLOT_W;
const toSvgY = (w2: number) => PAD_TOP + ((W2_MAX - w2) / (W2_MAX - W2_MIN)) * PLOT_H;

function randomStart(): [number, number] {
  // Random point in outer region (high loss)
  const angle = Math.random() * 2 * Math.PI;
  const r = 2.5 + Math.random() * 1.5;
  return [3 + r * Math.cos(angle) * 0.8, 2 + r * Math.sin(angle) * 0.6];
}

const presets = [
  { label: 'Too slow (lr=0.01)', lr: 0.01 },
  { label: 'Just right (lr=0.1)', lr: 0.1 },
  { label: 'Too fast (lr=0.9)', lr: 0.9 },
];

// Contour levels
const contourLevels = [0.5, 2, 5, 10, 18, 28, 40];

export default function GradientDescentDiagram() {
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState<[number, number][]>(() => {
    const s = randomStart();
    return [[s[0], s[1]]];
  });
  const [animating, setAnimating] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = path[path.length - 1];
  const currentLoss = loss(current[0], current[1]);

  const step = useCallback(() => {
    setPath(prev => {
      const [w1, w2] = prev[prev.length - 1];
      const nw1 = w1 - lr * gradW1(w1);
      const nw2 = w2 - lr * gradW2(w2);
      // Clamp to domain
      const cw1 = Math.max(W1_MIN, Math.min(W1_MAX, nw1));
      const cw2 = Math.max(W2_MIN, Math.min(W2_MAX, nw2));
      return [...prev, [cw1, cw2]];
    });
  }, [lr]);

  const reset = useCallback(() => {
    if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }
    setAnimating(false);
    const s = randomStart();
    setPath([[s[0], s[1]]]);
  }, []);

  const toggleAnimate = useCallback(() => {
    if (animating) {
      if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }
      setAnimating(false);
    } else {
      setAnimating(true);
    }
  }, [animating]);

  useEffect(() => {
    if (animating) {
      animRef.current = setInterval(() => {
        step();
      }, 300);
      return () => { if (animRef.current) clearInterval(animRef.current); };
    }
  }, [animating, step]);

  // Stop animation if loss is very small or path too long
  useEffect(() => {
    if ((currentLoss < 0.01 || path.length > 200) && animating) {
      if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }
      setAnimating(false);
    }
  }, [currentLoss, path.length, animating]);

  // Build contour ellipses: loss = (w1-3)^2 + 2*(w2-2)^2 = L
  // Ellipse: semi-axis a = sqrt(L), b = sqrt(L/2)
  const contours = contourLevels.map(L => {
    const a = Math.sqrt(L);
    const b = Math.sqrt(L / 2);
    // Convert to SVG coordinates
    const cx = toSvgX(3);
    const cy = toSvgY(2);
    const rx = (a / (W1_MAX - W1_MIN)) * PLOT_W;
    const ry = (b / (W2_MAX - W2_MIN)) * PLOT_H;
    return { L, cx, cy, rx, ry };
  });

  // Color scale for contours: low loss = dark green, high = light yellow
  const contourColor = (L: number) => {
    const t = Math.min(L / 40, 1);
    const r = Math.round(34 + t * 220);
    const g = Math.round(139 + t * 100);
    const b = Math.round(34 + t * 30);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => { setLr(p.lr); reset(); }}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
              Math.abs(lr - p.lr) < 0.001
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-2 justify-center">
        <label className="text-xs font-medium text-gray-600 dark:text-slate-400">
          Learning rate: {lr.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.01"
          max="1.0"
          step="0.01"
          value={lr}
          onChange={e => { setLr(parseFloat(e.target.value)); reset(); }}
          className="w-32 accent-indigo-600"
        />
      </div>

      <div className="flex gap-2 mb-3 justify-center">
        <button
          onClick={step}
          disabled={animating || currentLoss < 0.01}
          className="px-3 py-1 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
        >
          Step
        </button>
        <button
          onClick={toggleAnimate}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            animating
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {animating ? 'Pause' : 'Animate'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 rounded text-xs font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Gradient descent on a 2D loss landscape contour plot"
      >
        <rect width={SVG_W} height={SVG_H} rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x={SVG_W / 2} y="16" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Finding the Best Weights — Gradient Descent
        </text>

        {/* Plot background */}
        <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT_W} height={PLOT_H} rx="4" fill="#f0fdf4" className="dark:fill-slate-900" />

        {/* Contour ellipses (outer first) */}
        {[...contours].reverse().map(c => (
          <ellipse
            key={c.L}
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            fill={contourColor(c.L)}
            opacity="0.25"
            stroke={contourColor(c.L)}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        ))}

        {/* Contour labels */}
        {contours.filter((_, i) => i % 2 === 0).map(c => (
          <text
            key={`label-${c.L}`}
            x={c.cx + c.rx + 2}
            y={c.cy - 2}
            fontSize="7"
            className="fill-gray-500 dark:fill-slate-400"
          >
            L={c.L}
          </text>
        ))}

        {/* Minimum marker */}
        <circle cx={toSvgX(3)} cy={toSvgY(2)} r="4" fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
        <text x={toSvgX(3) + 7} y={toSvgY(2) + 3} fontSize="8" fontWeight="600" fill="#16a34a">
          min
        </text>

        {/* Path trail */}
        {path.length > 1 && (
          <polyline
            points={path.map(([w1, w2]) => `${toSvgX(w1)},${toSvgY(w2)}`).join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.7"
          />
        )}

        {/* Path dots */}
        {path.map(([w1, w2], i) => (
          <circle
            key={i}
            cx={toSvgX(w1)}
            cy={toSvgY(w2)}
            r={i === path.length - 1 ? 5 : 2}
            fill={i === path.length - 1 ? '#dc2626' : '#6366f1'}
            stroke={i === path.length - 1 ? '#fff' : 'none'}
            strokeWidth={i === path.length - 1 ? 1.5 : 0}
            opacity={i === path.length - 1 ? 1 : 0.5}
          />
        ))}

        {/* Axes labels */}
        <text x={SVG_W / 2} y={SVG_H - 4} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">
          Weight 1 (w₁)
        </text>
        <text
          x="12"
          y={PAD_TOP + PLOT_H / 2}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          className="fill-gray-600 dark:fill-slate-400"
          transform={`rotate(-90, 12, ${PAD_TOP + PLOT_H / 2})`}
        >
          Weight 2 (w₂)
        </text>

        {/* Axis ticks */}
        {[0, 2, 4, 6].map(v => (
          <g key={`x-${v}`}>
            <line x1={toSvgX(v)} y1={PAD_TOP + PLOT_H} x2={toSvgX(v)} y2={PAD_TOP + PLOT_H + 4} stroke="#94a3b8" strokeWidth="0.7" />
            <text x={toSvgX(v)} y={PAD_TOP + PLOT_H + 13} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{v}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map(v => (
          <g key={`y-${v}`}>
            <line x1={PAD_LEFT - 4} y1={toSvgY(v)} x2={PAD_LEFT} y2={toSvgY(v)} stroke="#94a3b8" strokeWidth="0.7" />
            <text x={PAD_LEFT - 7} y={toSvgY(v) + 3} textAnchor="end" fontSize="8" className="fill-gray-400 dark:fill-slate-500">{v}</text>
          </g>
        ))}

        {/* Stats overlay */}
        <rect x={SVG_W - 148} y={PAD_TOP + 2} width="140" height="46" rx="5" fill="#fff" fillOpacity="0.85" stroke="#e2e8f0" strokeWidth="0.7" className="dark:fill-slate-800/90 dark:stroke-slate-700" />
        <text x={SVG_W - 142} y={PAD_TOP + 15} fontSize="9" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Loss: {currentLoss.toFixed(2)}
        </text>
        <text x={SVG_W - 142} y={PAD_TOP + 27} fontSize="8" className="fill-gray-500 dark:fill-slate-400">
          Steps: {path.length - 1} | lr: {lr.toFixed(2)}
        </text>
        <text x={SVG_W - 142} y={PAD_TOP + 39} fontSize="8" className="fill-gray-500 dark:fill-slate-400">
          w₁={current[0].toFixed(2)}, w₂={current[1].toFixed(2)}
        </text>

        {/* Hint text at bottom of plot */}
        <text x={SVG_W / 2} y={PAD_TOP + PLOT_H - 4} textAnchor="middle" fontSize="7.5" className="fill-gray-400 dark:fill-slate-500" opacity="0.8">
          loss = (w₁−3)² + 2·(w₂−2)² — minimum at (3, 2)
        </text>
      </svg>
    </div>
  );
}
