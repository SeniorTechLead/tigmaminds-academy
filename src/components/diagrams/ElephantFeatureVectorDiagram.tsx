export default function ElephantFeatureVectorDiagram() {
  // Waveform path
  const wave = Array.from({ length: 80 }, (_, i) => {
    const t = i / 80;
    const y =
      Math.sin(2 * Math.PI * 4 * t) * 0.6 +
      Math.sin(2 * Math.PI * 11 * t) * 0.25 +
      Math.sin(2 * Math.PI * 7 * t) * 0.15;
    return `${i === 0 ? 'M' : 'L'}${(20 + t * 140).toFixed(1)},${(120 - y * 50).toFixed(1)}`;
  }).join(' ');

  const features = [
    { name: 'centroid', value: '312 Hz' },
    { name: 'bandwidth', value: '189 Hz' },
    { name: 'rolloff', value: '640 Hz' },
    { name: 'zcr', value: '0.042' },
    { name: 'rms', value: '0.31' },
    { name: 'duration', value: '2.4 s' },
    { name: 'spectral_flat', value: '0.18' },
    { name: 'peak_freq', value: '48 Hz' },
  ];

  const tableX = 370;
  const tableY = 46;
  const rowH = 22;

  return (
    <svg
      viewBox="0 0 630 315"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Waveform converted to a feature vector of 8 named features with example values"
    >
      {/* Dark background */}
      <rect width="600" height="300" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        From Waveform to Feature Vector
      </text>

      {/* ── Left: Waveform ── */}
      <rect x={14} y={50} width={160} height={140} rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />
      {/* Axes */}
      <line x1={30} y1={60} x2={30} y2={180} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <line x1={30} y1={180} x2={164} y2={180} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
      <text x={94} y={196} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">
        time
      </text>
      <text x={22} y={120} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7" transform="rotate(-90,22,120)">
        amplitude
      </text>
      {/* Waveform */}
      <path d={wave} fill="none" stroke="#22c55e" strokeWidth="1.5" />
      <text x={94} y={210} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">
        Raw audio clip
      </text>

      {/* ── Arrow ── */}
      <g>
        <line x1={190} y1={120} x2={340} y2={120} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="340,116 348,120 340,124" className="fill-gray-400 dark:fill-slate-500" />
        <rect x={220} y={106} width={90} height={28} rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" />
        <text x={265} y={118} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">
          Extract
        </text>
        <text x={265} y={129} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">
          8 features
        </text>
      </g>

      {/* ── Right: Feature Vector Table ── */}
      <rect x={tableX - 10} y={tableY - 4} width={220} height={rowH * 8 + 16} rx="6" className="fill-white dark:fill-slate-950" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Header */}
      <text x={tableX + 10} y={tableY + 10} fill="#60a5fa" fontSize="9" fontWeight="700">
        Feature
      </text>
      <text x={tableX + 150} y={tableY + 10} fill="#60a5fa" fontSize="9" fontWeight="700">
        Value
      </text>
      <line x1={tableX} y1={tableY + 15} x2={tableX + 200} y2={tableY + 15} stroke="#334155" strokeWidth="0.5" />

      {features.map((f, i) => {
        const y = tableY + 30 + i * rowH;
        return (
          <g key={f.name}>
            {/* Alternating row backgrounds */}
            {i % 2 === 0 && (
              <rect x={tableX - 4} y={y - 12} width={208} height={rowH} rx="2" className="fill-gray-100 dark:fill-slate-800" opacity="0.5" />
            )}
            {/* Index */}
            <text x={tableX} y={y} fill="#475569" fontSize="8" fontFamily="monospace">
              {i}
            </text>
            {/* Feature name */}
            <text x={tableX + 16} y={y} fill="#86efac" fontSize="9" fontFamily="monospace" fontWeight="600">
              {f.name}
            </text>
            {/* Value */}
            <text x={tableX + 150} y={y} fill="#fde68a" fontSize="9" fontFamily="monospace">
              {f.value}
            </text>
          </g>
        );
      })}

      {/* ── Bottom summary ── */}
      <rect x={140} y={260} width={320} height={26} rx="5" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
      <text x={300} y={277} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        One clip → one row of 8 numbers
      </text>
    </svg>
  );
}
