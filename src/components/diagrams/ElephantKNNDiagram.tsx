export default function ElephantKNNDiagram() {
  // Scatter plot area
  const plotX = 80;
  const plotY = 60;
  const plotW = 340;
  const plotH = 200;

  // Elephant call cluster (green, bottom-left)
  const elephantDots = [
    { x: 0.12, y: 0.72 },
    { x: 0.18, y: 0.80 },
    { x: 0.24, y: 0.68 },
    { x: 0.10, y: 0.85 },
    { x: 0.28, y: 0.75 },
    { x: 0.20, y: 0.90 },
    { x: 0.15, y: 0.65 },
    { x: 0.30, y: 0.82 },
    { x: 0.22, y: 0.58 },
    { x: 0.08, y: 0.78 },
    { x: 0.34, y: 0.70 },
    { x: 0.26, y: 0.62 },
  ];

  // Bird call cluster (amber, top-right)
  const birdDots = [
    { x: 0.72, y: 0.22 },
    { x: 0.78, y: 0.15 },
    { x: 0.82, y: 0.28 },
    { x: 0.68, y: 0.18 },
    { x: 0.85, y: 0.12 },
    { x: 0.75, y: 0.32 },
    { x: 0.90, y: 0.20 },
    { x: 0.70, y: 0.25 },
    { x: 0.80, y: 0.38 },
    { x: 0.88, y: 0.30 },
    { x: 0.65, y: 0.35 },
  ];

  // New unknown point (red star)
  const starX = 0.42;
  const starY = 0.52;

  // 5 nearest neighbors: 3 elephant (green), 2 bird (amber)
  const neighbors = [
    { ...elephantDots[2], color: '#22c55e' },  // 0.24, 0.68
    { ...elephantDots[8], color: '#22c55e' },  // 0.22, 0.58
    { ...elephantDots[11], color: '#22c55e' }, // 0.26, 0.62
    { ...birdDots[5], color: '#f59e0b' },      // 0.75, 0.32
    { ...birdDots[10], color: '#f59e0b' },     // 0.65, 0.35
  ];

  const toScreenX = (x: number) => plotX + x * plotW;
  const toScreenY = (y: number) => plotY + (1 - y) * plotH;

  // Star shape path
  const starPath = (cx: number, cy: number, r: number) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 2) + (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? r : r * 0.45;
      pts.push(`${i === 0 ? 'M' : 'L'}${(cx + Math.cos(angle) * rad).toFixed(1)},${(cy - Math.sin(angle) * rad).toFixed(1)}`);
    }
    return pts.join(' ') + ' Z';
  };

  return (
    <svg
      viewBox="0 0 630 384"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="k-Nearest Neighbors: a new unknown sound is classified by the majority vote of its 5 closest neighbors in feature space"
    >
      {/* Dark background */}
      <rect width="600" height="360" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        k-Nearest Neighbors (k = 5)
      </text>

      {/* Plot area */}
      <rect x={plotX} y={plotY} width={plotW} height={plotH} rx="4" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />

      {/* Axis labels */}
      <text
        x={plotX - 18}
        y={plotY + plotH / 2}
        textAnchor="middle"
        className="fill-gray-400 dark:fill-slate-500"
        fontSize="8"
        transform={`rotate(-90,${plotX - 18},${plotY + plotH / 2})`}
      >
        Bandwidth (Hz)
      </text>
      <text x={plotX + plotW / 2} y={plotY + plotH + 18} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">
        Centroid (Hz)
      </text>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((v) => (
        <g key={v}>
          <line
            x1={plotX}
            y1={toScreenY(v)}
            x2={plotX + plotW}
            y2={toScreenY(v)}
            className="stroke-gray-200 dark:stroke-slate-800"
            strokeWidth="0.5"
          />
          <line
            x1={toScreenX(v)}
            y1={plotY}
            x2={toScreenX(v)}
            y2={plotY + plotH}
            className="stroke-gray-200 dark:stroke-slate-800"
            strokeWidth="0.5"
          />
        </g>
      ))}

      {/* Elephant dots (green) */}
      {elephantDots.map((d, i) => (
        <circle
          key={`e-${i}`}
          cx={toScreenX(d.x)}
          cy={toScreenY(d.y)}
          r="5"
          fill="#22c55e"
          opacity="0.8"
        />
      ))}

      {/* Bird dots (amber) */}
      {birdDots.map((d, i) => (
        <circle
          key={`b-${i}`}
          cx={toScreenX(d.x)}
          cy={toScreenY(d.y)}
          r="5"
          fill="#f59e0b"
          opacity="0.8"
        />
      ))}

      {/* Dashed lines to 5 nearest neighbors */}
      {neighbors.map((n, i) => (
        <line
          key={`n-${i}`}
          x1={toScreenX(starX)}
          y1={toScreenY(starY)}
          x2={toScreenX(n.x)}
          y2={toScreenY(n.y)}
          stroke={n.color}
          strokeWidth="1"
          strokeDasharray="4,3"
          opacity="0.7"
        />
      ))}

      {/* Red star (unknown sound) */}
      <path
        d={starPath(toScreenX(starX), toScreenY(starY), 10)}
        fill="#ef4444"
        stroke="#fca5a5"
        strokeWidth="1"
      />

      {/* Star label */}
      <text x={toScreenX(starX) + 14} y={toScreenY(starY) - 8} fill="#fca5a5" fontSize="9" fontWeight="600">
        New unknown
      </text>
      <text x={toScreenX(starX) + 14} y={toScreenY(starY) + 3} fill="#fca5a5" fontSize="9" fontWeight="600">
        sound
      </text>

      {/* Legend */}
      <g transform={`translate(${plotX + plotW + 20}, ${plotY + 10})`}>
        <circle cx="6" cy="6" r="5" fill="#22c55e" opacity="0.8" />
        <text x="16" y="10" fill="#86efac" fontSize="9">Elephant calls</text>

        <circle cx="6" cy="28" r="5" fill="#f59e0b" opacity="0.8" />
        <text x="16" y="32" fill="#fde68a" fontSize="9">Bird calls</text>

        <path d={starPath(6, 50, 6)} fill="#ef4444" />
        <text x="16" y="54" fill="#fca5a5" fontSize="9">Unknown</text>
      </g>

      {/* Vote result box */}
      <rect x="100" y="278" width="400" height="30" rx="5" fill="#052e16" stroke="#22c55e" strokeWidth="1" />
      <text x="300" y="297" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">
        5 nearest neighbors: 3 elephant, 2 bird → classify as ELEPHANT
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="334" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        k-NN: find the k closest examples, let them vote
      </text>
    </svg>
  );
}
