export default function MemoryOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Project output: a forgetting curve graph plotted from your own memory test data"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Project Output: Your Personal Forgetting Curve
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Matplotlib plot of recall percentage vs time elapsed
        </text>

        {/* Chart frame */}
        <rect x="100" y="75" width="580" height="280" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#94a3b8" strokeWidth="1" />

        {/* Grid lines */}
        {[130, 185, 240, 295].map((y) => (
          <line key={y} x1="100" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
        ))}

        {/* Y-axis */}
        <text x="90" y="87" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">100%</text>
        <text x="90" y="135" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">80%</text>
        <text x="90" y="190" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">60%</text>
        <text x="90" y="245" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">40%</text>
        <text x="90" y="300" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">20%</text>
        <text x="90" y="350" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">0%</text>

        {/* X-axis labels */}
        {[
          [120, '0'], [220, '1h'], [350, '1d'], [480, '3d'], [600, '7d'], [670, '30d'],
        ].map(([x, label]) => (
          <text key={label as string} x={x as number} y={370} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            {label as string}
          </text>
        ))}

        {/* No-review curve (red) */}
        <path
          d="M 120 83 L 220 190 L 350 270 L 480 300 L 600 320 L 670 330"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
        />
        {[
          [120, 83], [220, 190], [350, 270], [480, 300], [600, 320], [670, 330],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#ef4444" />
        ))}

        {/* With-review curve (green) */}
        <path
          d="M 120 83 L 220 95 L 350 105 L 480 112 L 600 118 L 670 122"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
        />
        {[
          [120, 83], [220, 95], [350, 105], [480, 112], [600, 118], [670, 122],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#22c55e" />
        ))}

        {/* Curve labels */}
        <text x="680" y="338" fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">No review</text>
        <text x="680" y="118" fontSize="10" fontWeight="600" className="fill-green-500 dark:fill-green-400">Daily review</text>

        {/* Axis labels */}
        <text x="390" y="395" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">
          Time After Learning
        </text>
        <text x="50" y="220" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90, 50, 220)">
          Recall %
        </text>

        {/* Bottom note */}
        <text x="390" y="414" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Generated with Python + Matplotlib from your own test data
        </text>
      </svg>
    </div>
  );
}
