export default function ElephantTrainTestDiagram() {
  // Elephant silhouette
  const elephant =
    'M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z';

  const barX = 60;
  const barY = 70;
  const barW = 480;
  const barH = 40;
  const trainW = barW * 0.8;
  const testW = barW * 0.2;

  return (
    <svg
      viewBox="0 0 630 338"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Train-test split: 80% of data for training, 20% held out for testing to verify the model truly learned"
    >
      {/* Dark background */}
      <rect width="600" height="320" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        Train / Test Split
      </text>

      {/* ── Horizontal bar ── */}
      {/* Training section (green) */}
      <rect x={barX} y={barY} width={trainW} height={barH} rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1.5" />
      <text x={barX + trainW / 2} y={barY + barH / 2 - 5} textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="700">
        Training data
      </text>
      <text x={barX + trainW / 2} y={barY + barH / 2 + 9} textAnchor="middle" fill="#86efac" fontSize="10">
        80%
      </text>

      {/* Test section (blue) */}
      <rect x={barX + trainW} y={barY} width={testW} height={barH} rx="6" fill="#0c1e3d" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={barX + trainW + testW / 2} y={barY + barH / 2 + 3} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700">
        20%
      </text>

      {/* Test label above */}
      <text x={barX + trainW + testW / 2} y={barY - 8} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">
        Test data
      </text>

      {/* Divider line */}
      <line
        x1={barX + trainW}
        y1={barY - 4}
        x2={barX + trainW}
        y2={barY + barH + 4}
        stroke="#fbbf24"
        strokeWidth="2"
        strokeDasharray="4,3"
      />

      {/* ── Left elephant: studying ── */}
      <g transform="translate(140, 140)">
        <rect x="-40" y="-10" width="120" height="90" rx="8" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />
        {/* Elephant */}
        <g transform="translate(-10, 8) scale(1.4)">
          <path d={elephant} fill="#22c55e" opacity="0.7" />
        </g>
        {/* Book icon */}
        <rect x="52" y="12" width="18" height="22" rx="2" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1" />
        <line x1="55" y1="18" x2="67" y2="18" stroke="#86efac" strokeWidth="0.8" />
        <line x1="55" y1="22" x2="67" y2="22" stroke="#86efac" strokeWidth="0.8" />
        <line x1="55" y1="26" x2="67" y2="26" stroke="#86efac" strokeWidth="0.8" />
        <line x1="55" y1="30" x2="63" y2="30" stroke="#86efac" strokeWidth="0.8" />
        {/* Label */}
        <text x="20" y="70" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="600">
          Studying
        </text>
      </g>

      {/* ── Right elephant: taking exam ── */}
      <g transform="translate(380, 140)">
        <rect x="-40" y="-10" width="120" height="90" rx="8" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />
        {/* Elephant */}
        <g transform="translate(-10, 8) scale(1.4)">
          <path d={elephant} fill="#60a5fa" opacity="0.7" />
        </g>
        {/* Exam paper icon */}
        <rect x="52" y="10" width="18" height="24" rx="2" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
        <text x="61" y="22" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="700">
          A+
        </text>
        <text x="61" y="30" textAnchor="middle" fill="#60a5fa" fontSize="6">
          ?
        </text>
        {/* Label */}
        <text x="20" y="70" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="600">
          Exam time
        </text>
      </g>

      {/* ── No cheating arrow with X ── */}
      {/* Arrow trying to go from test back to training */}
      <line x1="360" y1="178" x2="260" y2="178" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
      <polygon points="260,174 252,178 260,182" fill="#ef4444" />

      {/* Big X over the arrow */}
      <g transform="translate(300, 170)">
        <line x1="-10" y1="-10" x2="10" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="-10" x2="-10" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* No cheating label */}
      <text x="300" y="200" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="700">
        No cheating!
      </text>

      {/* Never seen label */}
      <text x="440" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">
        Never seen during training
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="288" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        Train on 80%, test on 20% — if it still works, the model truly learned
      </text>
    </svg>
  );
}
