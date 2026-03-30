export default function ElephantPipelineDiagram() {
  // Arrow connector
  const Arrow = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <g>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke="#64748b" strokeWidth="1.5" />
      <polygon points={`${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}`} className="fill-gray-400 dark:fill-slate-500" />
    </g>
  );

  // Mini waveform path
  const wave = Array.from({ length: 40 }, (_, i) => {
    const t = i / 40;
    const y = Math.sin(2 * Math.PI * 5 * t) * (0.4 + 0.3 * Math.sin(2 * Math.PI * 1.2 * t));
    return `${i === 0 ? 'M' : 'L'}${(t * 36).toFixed(1)},${(14 - y * 10).toFixed(1)}`;
  }).join(' ');

  const midY = 100;

  // Mood icons: small elephant head silhouettes with color
  const moods = [
    { label: 'Rumble', color: '#22c55e' },
    { label: 'Trumpet', color: '#3b82f6' },
    { label: 'Roar', color: '#ef4444' },
    { label: 'Bark', color: '#f59e0b' },
    { label: 'Cry', color: '#f472b6' },
    { label: 'Snort', color: '#a78bfa' },
  ];

  return (
    <svg
      viewBox="0 0 670 298"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Full classifier pipeline: Raw Audio to Feature Extraction to Classification to Mood Output, with six elephant mood categories"
    >
      {/* Dark background */}
      <rect width="600" height="260" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Full Classifier Pipeline
      </text>

      {/* ── Stage 1: Raw Audio ── */}
      <rect x={30} y={midY - 30} width={100} height={60} rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />
      <g transform={`translate(${32}, ${midY - 16})`}>
        <path d={wave} fill="none" stroke="#22c55e" strokeWidth="1.2" />
      </g>
      <text x={80} y={midY + 44} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        Raw Audio
      </text>

      {/* Arrow 1→2 */}
      <Arrow x1={134} x2={170} y={midY} />

      {/* ── Stage 2: Feature Extraction ── */}
      <rect x={170} y={midY - 30} width={120} height={60} rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Grid icon */}
      <g transform={`translate(${190}, ${midY - 18})`}>
        {[0, 10, 20].map((row) =>
          [0, 10, 20].map((col) => (
            <rect key={`${row}-${col}`} x={col} y={row} width={7} height={7} rx="1" fill="#60a5fa" opacity="0.6" />
          ))
        )}
      </g>
      <text x={250} y={midY - 4} fill="#60a5fa" fontSize="10" fontWeight="700">
        Feature
      </text>
      <text x={250} y={midY + 8} fill="#60a5fa" fontSize="10" fontWeight="700">
        Extraction
      </text>
      <text x={230} y={midY + 44} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        8 features per clip
      </text>

      {/* Arrow 2→3 */}
      <Arrow x1={294} x2={330} y={midY} />

      {/* ── Stage 3: Classification ── */}
      <rect x={330} y={midY - 30} width={110} height={60} rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Brain/decision icon */}
      <g transform={`translate(${345}, ${midY - 16})`}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <path d="M7,10 Q12,4 17,10 M7,14 Q12,20 17,14" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="12" cy="12" r="2" fill="#fbbf24" />
      </g>
      <text x={400} y={midY - 4} fill="#fbbf24" fontSize="10" fontWeight="700">
        k-NN
      </text>
      <text x={400} y={midY + 8} fill="#fbbf24" fontSize="10" fontWeight="700">
        Classify
      </text>
      <text x={385} y={midY + 44} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        Vote among neighbors
      </text>

      {/* Arrow 3→4 */}
      <Arrow x1={444} x2={480} y={midY} />

      {/* ── Stage 4: Mood Output ── */}
      <rect x={480} y={midY - 30} width={90} height={60} rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1.5" />
      {/* Elephant silhouette */}
      <g transform={`translate(${496}, ${midY - 18}) scale(0.7)`}>
        <path
          d="M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z"
          fill="#22c55e"
          opacity="0.9"
        />
      </g>
      <text x={540} y={midY - 2} fill="#86efac" fontSize="10" fontWeight="700">
        Mood
      </text>
      <text x={540} y={midY + 10} fill="#86efac" fontSize="10" fontWeight="700">
        Output
      </text>

      {/* ── 6 Mood Icons ── */}
      <text x="300" y={midY + 72} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="600">
        6 Mood Classes
      </text>

      {moods.map((m, i) => {
        const cx = 75 + i * 92;
        const cy = midY + 100;
        return (
          <g key={m.label}>
            {/* Colored dot */}
            <circle cx={cx} cy={cy} r="10" fill={m.color} opacity="0.25" />
            <circle cx={cx} cy={cy} r="6" fill={m.color} opacity="0.8" />
            {/* Mini elephant head */}
            <g transform={`translate(${cx - 4}, ${cy - 4}) scale(0.22)`}>
              <path
                d="M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z"
                fill="#fff"
              />
            </g>
            <text x={cx} y={cy + 20} textAnchor="middle" fill={m.color} fontSize="8" fontWeight="600">
              {m.label}
            </text>
          </g>
        );
      })}

      {/* Bottom summary */}
      <text x="300" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
        Audio in → features → classification → mood label out
      </text>
    </svg>
  );
}
