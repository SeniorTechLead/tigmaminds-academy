export default function ElephantFeaturesDiagram() {
  // Waveform data
  const N = 120;
  const wavePath = Array.from({ length: N }, (_, i) => {
    const t = i / N;
    const envelope = 0.5 + 0.4 * Math.sin(2 * Math.PI * 1.5 * t);
    const signal =
      Math.sin(2 * Math.PI * 8 * t) * 0.6 +
      Math.sin(2 * Math.PI * 18 * t) * 0.3 +
      Math.sin(2 * Math.PI * 3 * t) * 0.2;
    const y = signal * envelope;
    return `${i === 0 ? 'M' : 'L'}${(40 + t * 160).toFixed(1)},${(140 - y * 50).toFixed(1)}`;
  }).join(' ');

  // Elephant silhouette
  const elephant =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';

  const features = [
    { label: 'Centroid', value: '80 Hz' },
    { label: 'Bandwidth', value: '60 Hz' },
    { label: 'Rolloff', value: '150 Hz' },
    { label: 'ZCR', value: '0.02' },
  ];

  return (
    <svg
      viewBox="0 0 640 324"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Feature engineering: extracting 4 informative numbers from a raw audio signal of 110,250 samples"
    >
      {/* Dark background */}
      <rect width="600" height="300" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Feature Engineering: Compress Without Losing Meaning
      </text>

      {/* ── LEFT: Waveform panel ── */}
      <rect x="30" y="95" width="180" height="90" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />

      {/* Center line */}
      <line x1="30" y1="140" x2="210" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />

      {/* Waveform */}
      <path d={wavePath} fill="none" stroke="#22c55e" strokeWidth="1.5" />

      {/* Label above */}
      <text x="120" y="88" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
        Raw signal: 110,250 numbers
      </text>

      {/* Elephant silhouette */}
      <g transform="translate(32, 48)">
        <path d={elephant} fill="#22c55e" opacity="0.6" transform="scale(1.0)" />
      </g>

      {/* ── ARROW: Extract features ── */}
      <line x1="220" y1="140" x2="310" y2="140" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="310,136 318,140 310,144" className="fill-gray-400 dark:fill-slate-500" />

      {/* Arrow label */}
      <text x="268" y="128" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
        Extract
      </text>
      <text x="268" y="138" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
        features
      </text>

      {/* ── RIGHT: Feature card ── */}
      <rect x="330" y="82" width="200" height="120" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Feature rows */}
      {features.map((f, i) => {
        const rowY = 106 + i * 24;
        return (
          <g key={f.label}>
            {/* Alternating row background */}
            {i % 2 === 0 && (
              <rect x="334" y={rowY - 10} width="192" height="22" rx="2" className="fill-white dark:fill-slate-950" opacity="0.5" />
            )}
            <text x="346" y={rowY + 4} className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">
              {f.label}:
            </text>
            <text x="510" y={rowY + 4} textAnchor="end" fill="#60a5fa" fontSize="11" fontWeight="700">
              {f.value}
            </text>
          </g>
        );
      })}

      {/* Card label */}
      <text x="430" y="222" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
        4 numbers that capture
      </text>
      <text x="430" y="234" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
        everything important
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="274" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        Feature engineering: 110,250 numbers → 4 informative numbers
      </text>
    </svg>
  );
}
