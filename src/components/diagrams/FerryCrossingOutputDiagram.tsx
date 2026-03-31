export default function FerryCrossingOutputDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Project output showing ferry crossing paths at different angles plotted on a river diagram">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="340" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-cyan-700 dark:fill-cyan-300">
          Project Output: Optimal Ferry Crossing Angle
        </text>

        {/* River */}
        <rect x="80" y="55" width="460" height="200" rx="4" fill="#0c4a6e" opacity="0.1" className="dark:fill-blue-900/15" />
        <text x="310" y="50" textAnchor="middle" className="small fill-blue-500 dark:fill-blue-400">River: 200 m wide, current = 3 m/s \u2192, ferry speed = 5 m/s</text>

        {/* Banks */}
        <rect x="70" y="55" width="12" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />
        <text x="65" y="155" textAnchor="end" className="small fill-amber-700 dark:fill-amber-400">Start</text>
        <rect x="538" y="55" width="12" height="200" rx="2" fill="#92400e" opacity="0.5" className="dark:fill-amber-900/40" />
        <text x="558" y="155" className="small fill-amber-700 dark:fill-amber-400">Goal</text>

        {/* Starting point */}
        <circle cx="82" cy="155" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

        {/* Path 1: 0 degrees (straight across) - most drift */}
        <line x1="82" y1="155" x2="538" y2="83" stroke="#ef4444" strokeWidth="2" />
        <circle cx="538" cy="83" r="4" fill="#ef4444" />
        <text x="548" y="80" className="small fill-red-500 dark:fill-red-400">0\u00B0 (120m drift)</text>

        {/* Path 2: 15 degrees upstream */}
        <line x1="82" y1="155" x2="538" y2="110" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="538" cy="110" r="4" fill="#f59e0b" />
        <text x="548" y="107" className="small fill-amber-500 dark:fill-amber-400">15\u00B0 (75m drift)</text>

        {/* Path 3: 37 degrees (straight crossing) */}
        <line x1="82" y1="155" x2="538" y2="155" stroke="#10b981" strokeWidth="3" />
        <circle cx="538" cy="155" r="5" fill="#10b981" />
        <text x="548" y="152" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">37\u00B0 (0m drift) \u2713</text>

        {/* Path 4: 50 degrees */}
        <line x1="82" y1="155" x2="538" y2="192" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="538" cy="192" r="4" fill="#3b82f6" />
        <text x="548" y="189" className="small fill-blue-500 dark:fill-blue-400">50\u00B0 (drifts upstream)</text>

        {/* Path 5: 90 degrees (heading straight into current) */}
        <line x1="82" y1="155" x2="538" y2="237" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6,3" />
        <circle cx="538" cy="237" r="4" fill="#8b5cf6" />
        <text x="548" y="234" className="small fill-purple-500 dark:fill-purple-400">90\u00B0 (slowest crossing)</text>

        {/* Current direction */}
        <line x1="200" y1="248" x2="400" y2="248" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#fc-curr)" />
        <text x="300" y="244" textAnchor="middle" className="small fill-blue-400 dark:fill-blue-500">current direction</text>

        {/* Analysis */}
        <rect x="40" y="268" width="540" height="60" rx="6" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1" className="dark:fill-teal-900/10 dark:stroke-teal-700" />
        <text x="310" y="286" textAnchor="middle" className="small fill-teal-700 dark:fill-teal-400" fontWeight="600">Analysis: 37\u00B0 upstream gives a straight crossing (zero drift)</text>
        <text x="310" y="302" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">But the crossing takes longer (50 s) than pointing straight across (40 s, but 120 m of drift).</text>
        <text x="310" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Trade-off: minimum drift vs minimum time. Real ferrymen optimize for safety, not speed.</text>

        <defs>
          <marker id="fc-curr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="leaf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
          <marker id="leaf-arr-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
