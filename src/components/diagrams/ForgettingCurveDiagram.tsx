export default function ForgettingCurveDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Ebbinghaus forgetting curve showing memory decay over time and how spaced repetition resets the curve"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          The Ebbinghaus Forgetting Curve
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Without review, you forget ~70% within 24 hours
        </text>

        {/* Axes */}
        <line x1="100" y1="360" x2="700" y2="360" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="100" y1="80" x2="100" y2="360" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Y-axis labels */}
        <text x="90" y="88" textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-slate-400">100%</text>
        <text x="90" y="158" textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-slate-400">75%</text>
        <text x="90" y="228" textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-slate-400">50%</text>
        <text x="90" y="298" textAnchor="end" fontSize="11" className="fill-gray-500 dark:fill-slate-400">25%</text>
        <text x="50" y="220" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90, 50, 220)">
          Memory Retention
        </text>

        {/* X-axis labels */}
        <text x="100" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Learn</text>
        <text x="220" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 hr</text>
        <text x="340" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 day</text>
        <text x="460" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">3 days</text>
        <text x="580" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 week</text>
        <text x="700" y="378" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 month</text>
        <text x="400" y="398" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">
          Time After Learning
        </text>

        {/* Forgetting curve (no review) */}
        <path
          d="M 100 84 Q 160 140 220 230 Q 300 290 400 310 Q 500 325 600 330 L 700 335"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />
        <text x="710" y="330" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">
          ~10%
        </text>
        <text x="450" y="340" fontSize="11" className="fill-red-400 dark:fill-red-500" fontWeight="600">
          No review
        </text>

        {/* Spaced repetition curve */}
        {/* First review at 1hr */}
        <path
          d="M 100 84 Q 160 140 220 200"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
        />
        {/* After review 1 */}
        <path
          d="M 220 110 Q 280 140 340 175"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
        />
        {/* After review 2 */}
        <path
          d="M 340 110 Q 400 128 460 150"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
        />
        {/* After review 3 */}
        <path
          d="M 460 100 Q 540 112 620 125 L 700 130"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
        />

        {/* Review markers */}
        {[220, 340, 460].map((x) => (
          <g key={x}>
            <line x1={x} y1={x === 220 ? 200 : x === 340 ? 175 : 150} x2={x} y2={x === 220 ? 110 : 100} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx={x} cy={x === 220 ? 110 : x === 340 ? 110 : 100} r="4" fill="#22c55e" />
            <text x={x} y={x === 220 ? 200 : x === 340 ? 175 : 150} dy="14" textAnchor="middle" fontSize="9" className="fill-green-600 dark:fill-green-400" fontWeight="600">
              Review!
            </text>
          </g>
        ))}

        <text x="710" y="125" fontSize="11" fontWeight="600" className="fill-green-500 dark:fill-green-400">
          ~90%
        </text>
        <text x="630" y="105" fontSize="11" className="fill-green-600 dark:fill-green-400" fontWeight="600">
          With spaced review
        </text>

        {/* Legend */}
        <rect x="100" y="410" width="580" height="36" rx="8" className="fill-indigo-50 dark:fill-indigo-950" stroke="#6366f1" strokeWidth="1.5" />
        <line x1="130" y1="428" x2="170" y2="428" stroke="#ef4444" strokeWidth="3" />
        <text x="178" y="432" fontSize="11" className="fill-gray-600 dark:fill-slate-400">No review (exponential decay)</text>
        <line x1="420" y1="428" x2="460" y2="428" stroke="#22c55e" strokeWidth="3" />
        <text x="468" y="432" fontSize="11" className="fill-gray-600 dark:fill-slate-400">With spaced repetition</text>
      </svg>
    </div>
  );
}
