export default function FireflyArrayDiagram() {
  const w = 520, h = 380;
  const values = [0, 50, 100, 150, 200, 255, 200, 150, 100, 50];
  const barStartX = 80;
  const barSpacing = 42;
  const maxBarH = 140;
  const barW = 30;
  const chartBottom = 260;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Array of LED brightness values showing fade-in-fade-out bar chart pattern">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Arrays Store LED Brightness</text>

        {/* Array notation */}
        <rect x="30" y="48" width="460" height="30" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="40" y="68" fill="#c084fc" fontSize="10" fontFamily="monospace">brightness = [</text>
        {values.map((v, i) => (
          <text key={i} x={168 + i * 30} y="68" fill="#4ade80" fontSize="10" fontFamily="monospace">{v}{i < 9 ? ',' : ''}</text>
        ))}
        <text x="468" y="68" fill="#c084fc" fontSize="10" fontFamily="monospace">]</text>

        {/* Y axis */}
        <line x1="65" y1="100" x2="65" y2={chartBottom} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="60" y="108" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">255</text>
        <text x="60" y="153" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">190</text>
        <text x="60" y="198" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">128</text>
        <text x="60" y="243" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">64</text>
        <text x="60" y={chartBottom + 5} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">0</text>

        {/* Grid lines */}
        {[100, 140, 180, 220].map(y => (
          <line key={y} x1="66" y1={y} x2={barStartX + 10 * barSpacing} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        ))}

        {/* Bars */}
        {values.map((v, i) => {
          const barH = (v / 255) * maxBarH;
          const x = barStartX + i * barSpacing;
          const y = chartBottom - barH;
          const opacity = 0.4 + (v / 255) * 0.6;
          return (
            <g key={i}>
              {/* Bar */}
              <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#4ade80" opacity={opacity} />
              <rect x={x} y={y} width={barW} height={barH} rx="3" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.6" />

              {/* Value on top */}
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="600">{v}</text>

              {/* Index below */}
              <text x={x + barW / 2} y={chartBottom + 15} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">[{i}]</text>
            </g>
          );
        })}

        {/* X axis */}
        <line x1="65" y1={chartBottom} x2={barStartX + 10 * barSpacing} y2={chartBottom} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x={w / 2} y={chartBottom + 30} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Array index →</text>
        <text x="30" y="180" className="fill-gray-500 dark:fill-slate-400" fontSize="8" transform="rotate(-90, 30, 180)">Brightness</text>

        {/* Fade curve overlay */}
        <polyline
          points={values.map((v, i) => `${barStartX + i * barSpacing + barW / 2},${chartBottom - (v / 255) * maxBarH}`).join(' ')}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* Annotation */}
        <rect x="60" y="310" width="400" height="50" rx="6" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x={w / 2} y="328" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Fade-in, peak, fade-out — one complete firefly pulse</text>
        <text x={w / 2} y="344" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Loop through the array: analogWrite(led, brightness[i]) then delay(50)</text>
        <text x={w / 2} y="356" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">The dashed curve shows how it looks to your eye — a smooth glow</text>
      </svg>
    </div>
  );
}
