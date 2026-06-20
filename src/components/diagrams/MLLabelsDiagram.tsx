/**
 * A labelled training example: feature columns + the label column that the
 * expert provides. Shows three rows (calm / nervous / danger) so the
 * features→label structure is concrete.
 *
 * Used in the "Labels — The Teacher's Answer Key" section.
 */
export default function MLLabelsDiagram() {
  const W = 720, H = 320;
  const cols = ['Frequency', 'Pulse rate', 'Amplitude', 'Label'];
  const colX = [60, 230, 400, 560];
  const colW = [150, 150, 150, 140];
  const rows = [
    { v: ['18 Hz', 'slow', 'low', 'calm'], color: '#16a34a', lightFill: '#dcfce7', darkFill: 'dark:fill-green-900/40' },
    { v: ['25 Hz', 'medium', 'med', 'nervous'], color: '#d97706', lightFill: '#fef3c7', darkFill: 'dark:fill-amber-900/40' },
    { v: ['34 Hz', 'fast', 'high', 'danger'], color: '#dc2626', lightFill: '#fee2e2', darkFill: 'dark:fill-red-900/40' },
  ];
  const rowY = [150, 205, 260];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A training example table: three feature columns (frequency, pulse rate, amplitude) plus a label column with calm, nervous, and danger answers supplied by an expert.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />

        <text x="40" y="36" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Features describe; the Label is the correct answer</text>
        <text x="40" y="56" fontSize="11" fill="#475569" className="dark:fill-gray-300">Features + label together = one training example.</text>

        {/* Header band */}
        <rect x="40" y="95" width="640" height="36" rx="6" fill="#e2e8f0" className="dark:fill-gray-700" />
        {cols.map((c, i) => (
          <text key={i} x={colX[i] + colW[i] / 2} y="118" textAnchor="middle" fontSize="12" fontWeight="700"
            fill={i === 3 ? '#7c3aed' : '#334155'} className={i === 3 ? 'dark:fill-purple-300' : 'dark:fill-gray-200'}>{c}</text>
        ))}
        {/* Separator before label column */}
        <line x1="540" y1="95" x2="540" y2={rowY[2] + 22} stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 3" className="dark:stroke-purple-400" />

        {/* Rows */}
        {rows.map((r, ri) => (
          <g key={ri}>
            {r.v.map((cell, ci) => (
              <g key={ci}>
                <rect x={colX[ci]} y={rowY[ri] - 18} width={colW[ci]} height="36" rx="5"
                  fill={ci === 3 ? r.lightFill : '#ffffff'} stroke="#cbd5e1" strokeWidth="1"
                  className={ci === 3 ? r.darkFill + ' dark:stroke-gray-600' : 'dark:fill-gray-800 dark:stroke-gray-600'} />
                <text x={colX[ci] + colW[ci] / 2} y={rowY[ri] + 4} textAnchor="middle" fontSize="12"
                  fontWeight={ci === 3 ? 700 : 500} fill={ci === 3 ? r.color : '#0f172a'}
                  className={ci === 3 ? '' : 'dark:fill-gray-100'}>{cell}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
