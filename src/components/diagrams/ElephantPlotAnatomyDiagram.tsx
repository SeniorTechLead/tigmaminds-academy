export default function ElephantPlotAnatomyDiagram() {
  // Generate a sine-wave-like "calm rumble" data line
  const N = 120;
  const points = Array.from({ length: N }, (_, i) => {
    const t = i / N;
    const y =
      Math.sin(2 * Math.PI * 3 * t) * 0.6 +
      Math.sin(2 * Math.PI * 7 * t) * 0.25 +
      Math.sin(2 * Math.PI * 1.2 * t) * 0.15;
    return { t, y };
  });

  // Chart area
  const cx = 140; // chart left
  const cy = 60; // chart top
  const cw = 320; // chart width
  const ch = 160; // chart height
  const midY = cy + ch / 2;

  const dataPath = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${(cx + p.t * cw).toFixed(1)},${(midY - p.y * (ch / 2 - 10)).toFixed(1)}`
    )
    .join(' ');

  return (
    <svg
      viewBox="0 0 630 390"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Anatomy of a scientific chart showing title, x-axis, y-axis, and data line using elephant vibration data"
    >
      {/* Dark background */}
      <rect width="600" height="360" rx="8" className="fill-slate-900" />

      {/* ── Chart axes ── */}
      {/* Y-axis */}
      <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1.5" />
      {/* X-axis */}
      <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1.5" />

      {/* Axis tick marks */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={`xt-${f}`}
          x1={cx + f * cw}
          y1={cy + ch}
          x2={cx + f * cw}
          y2={cy + ch + 4}
          stroke="#94a3b8"
          strokeWidth="1"
        />
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={`yt-${f}`}
          x1={cx - 4}
          y1={cy + f * ch}
          x2={cx}
          y2={cy + f * ch}
          stroke="#94a3b8"
          strokeWidth="1"
        />
      ))}

      {/* Grid lines (subtle) */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={`gx-${f}`}
          x1={cx + f * cw}
          y1={cy}
          x2={cx + f * cw}
          y2={cy + ch}
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
      ))}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={`gy-${f}`}
          x1={cx}
          y1={cy + f * ch}
          x2={cx + cw}
          y2={cy + f * ch}
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
      ))}

      {/* ── Data line ── */}
      <path d={dataPath} fill="none" stroke="#22c55e" strokeWidth="2" />

      {/* ── Title text on the chart ── */}
      <text x={cx + cw / 2} y={cy - 14} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Calm Elephant Rumble
      </text>

      {/* ── Axis labels ── */}
      <text x={cx + cw / 2} y={cy + ch + 24} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">
        Time (seconds)
      </text>
      <text
        x={cx - 18}
        y={midY}
        textAnchor="middle"
        className="fill-gray-500 dark:fill-slate-400"
        fontSize="10"
        transform={`rotate(-90,${cx - 18},${midY})`}
      >
        Vibration strength
      </text>

      {/* ── Arrow definitions ── */}
      <defs>
        <marker id="plotArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#fbbf24" />
        </marker>
      </defs>

      {/* ── Annotation 1: Title ── */}
      <line
        x1={cx + cw / 2 + 80}
        y1={cy - 18}
        x2={cx + cw / 2 + 30}
        y2={cy - 14}
        stroke="#fbbf24"
        strokeWidth="1"
        markerEnd="url(#plotArrow)"
      />
      <text x={cx + cw / 2 + 84} y={cy - 22} fill="#fbbf24" fontSize="9" fontWeight="600">
        Title — what you&apos;re looking at
      </text>

      {/* ── Annotation 2: X-axis ── */}
      <line
        x1={cx + cw + 20}
        y1={cy + ch + 24}
        x2={cx + cw / 2 + 50}
        y2={cy + ch + 4}
        stroke="#fbbf24"
        strokeWidth="1"
        markerEnd="url(#plotArrow)"
      />
      <text x={cx + cw + 24} y={cy + ch + 20} fill="#fbbf24" fontSize="9" fontWeight="600">
        X-axis —
      </text>
      <text x={cx + cw + 24} y={cy + ch + 30} fill="#fbbf24" fontSize="9" fontWeight="600">
        the horizontal ruler
      </text>

      {/* ── Annotation 3: Y-axis ── */}
      <line
        x1={cx - 60}
        y1={cy + 20}
        x2={cx - 4}
        y2={cy + ch * 0.3}
        stroke="#fbbf24"
        strokeWidth="1"
        markerEnd="url(#plotArrow)"
      />
      <text x={10} y={cy + 10} fill="#fbbf24" fontSize="9" fontWeight="600">
        Y-axis —
      </text>
      <text x={10} y={cy + 20} fill="#fbbf24" fontSize="9" fontWeight="600">
        the vertical ruler
      </text>

      {/* ── Annotation 4: Data line ── */}
      <line
        x1={cx + cw + 20}
        y1={midY - 30}
        x2={cx + cw * 0.7}
        y2={midY - 10}
        stroke="#fbbf24"
        strokeWidth="1"
        markerEnd="url(#plotArrow)"
      />
      <text x={cx + cw + 24} y={midY - 36} fill="#fbbf24" fontSize="9" fontWeight="600">
        Data line —
      </text>
      <text x={cx + cw + 24} y={midY - 26} fill="#fbbf24" fontSize="9" fontWeight="600">
        your measurements
      </text>

      {/* ── Elephant foot icon with vibration lines ── */}
      <g transform="translate(20, 280)">
        {/* Foot shape */}
        <ellipse cx="20" cy="20" rx="16" ry="12" fill="#22c55e" opacity="0.7" />
        <ellipse cx="20" cy="18" rx="12" ry="8" fill="#16a34a" opacity="0.5" />
        {/* Toes */}
        {[-8, -3, 3, 8].map((dx) => (
          <circle key={dx} cx={20 + dx} cy={10} r="3" fill="#22c55e" opacity="0.6" />
        ))}
        {/* Vibration arcs */}
        {[28, 34, 40].map((r, i) => (
          <path
            key={r}
            d={`M${20 - r * 0.6},${20 + r * 0.3} A${r},${r} 0 0,1 ${20 + r * 0.6},${20 + r * 0.3}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="1"
            opacity={0.5 - i * 0.12}
          />
        ))}
      </g>

      {/* ── Bottom summary ── */}
      <text x="300" y="340" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        Every scientific chart has these 4 parts
      </text>
    </svg>
  );
}
