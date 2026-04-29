export default function ActivityRiceSproutDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Offline activity showing how to sprout rice seeds in wet cotton to observe germination">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes grow { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        `}</style>
        <rect width="620" height="300" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-green-700 dark:fill-green-300">
          Activity: Sprout Rice Seeds at Home
        </text>

        {/* Day 1 */}
        <g>
          <text x="90" y="60" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Day 1</text>
          <rect x="45" y="70" width="90" height="60" rx="4" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/15" />
          {/* Plate with wet cotton */}
          <ellipse cx="90" cy="110" rx="35" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" className="dark:fill-slate-700" />
          {/* Cotton */}
          <ellipse cx="90" cy="107" rx="28" ry="5" fill="white" stroke="#cbd5e1" strokeWidth="0.5" className="dark:fill-slate-300" />
          {/* Seeds */}
          {[70, 80, 90, 100, 110].map((x, i) => (
            <ellipse key={i} cx={x} cy={105} rx="3" ry="2" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />
          ))}
          <text x="90" y="148" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Soak seeds overnight,</text>
          <text x="90" y="160" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">place on wet cotton</text>
        </g>

        {/* Arrow */}
        <line x1="145" y1="100" x2="175" y2="100" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#sprout-arr)" />

        {/* Day 3 */}
        <g>
          <text x="230" y="60" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Day 3</text>
          <rect x="185" y="70" width="90" height="60" rx="4" fill="#ecfdf5" stroke="#86efac" strokeWidth="1" className="dark:fill-emerald-900/15" />
          <ellipse cx="230" cy="110" rx="35" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" className="dark:fill-slate-700" />
          <ellipse cx="230" cy="107" rx="28" ry="5" fill="white" stroke="#cbd5e1" strokeWidth="0.5" className="dark:fill-slate-300" />
          {/* Sprouting seeds */}
          {[210, 222, 234, 246].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy={105} rx="3" ry="2" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />
              <line x1={x} y1={103} x2={x} y2={95} stroke="#4ade80" strokeWidth="1.5" />
            </g>
          ))}
          <text x="230" y="148" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Tiny white roots</text>
          <text x="230" y="160" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">and green shoots appear</text>
        </g>

        <line x1="285" y1="100" x2="315" y2="100" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#sprout-arr)" />

        {/* Day 7 */}
        <g>
          <text x="370" y="60" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Day 7</text>
          <rect x="325" y="70" width="90" height="60" rx="4" fill="#dcfce7" stroke="#4ade80" strokeWidth="1" className="dark:fill-green-900/15" />
          <ellipse cx="370" cy="110" rx="35" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" className="dark:fill-slate-700" />
          {/* Taller seedlings */}
          {[350, 362, 374, 386].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={108} x2={x} y2={78} stroke="#16a34a" strokeWidth="2" />
              <path d={`M ${x} ${82} Q ${x - 5} ${76} ${x - 8} ${78}`} fill="none" stroke="#16a34a" strokeWidth="1" />
              <path d={`M ${x} ${86} Q ${x + 5} ${80} ${x + 8} ${82}`} fill="none" stroke="#16a34a" strokeWidth="1" />
            </g>
          ))}
          <text x="370" y="148" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Seedlings 3–5 cm tall</text>
          <text x="370" y="160" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Measure and record!</text>
        </g>

        <line x1="425" y1="100" x2="455" y2="100" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#sprout-arr)" />

        {/* Day 14 */}
        <g>
          <text x="520" y="60" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Day 14</text>
          <rect x="475" y="70" width="90" height="60" rx="4" fill="#bbf7d0" stroke="#22c55e" strokeWidth="1" className="dark:fill-green-900/20" />
          {/* Tall seedling */}
          {[500, 520, 540].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={120} x2={x} y2={72} stroke="#16a34a" strokeWidth="2.5" />
              <path d={`M ${x} ${78} Q ${x - 8} ${68} ${x - 12} ${72}`} fill="none" stroke="#16a34a" strokeWidth="1.5" />
              <path d={`M ${x} ${85} Q ${x + 8} ${75} ${x + 12} ${78}`} fill="none" stroke="#16a34a" strokeWidth="1.5" />
              <path d={`M ${x} ${92} Q ${x - 7} ${84} ${x - 10} ${87}`} fill="none" stroke="#16a34a" strokeWidth="1.5" />
            </g>
          ))}
          <text x="520" y="148" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Ready to transplant</text>
          <text x="520" y="160" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">to soil or pot</text>
        </g>

        {/* Instructions */}
        <rect x="40" y="180" width="540" height="105" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="60" y="200" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">What you need:</text>
        <text x="60" y="218" className="small fill-slate-600 dark:fill-slate-400">Unpolished (brown) rice from a grocery store, cotton wool or paper towel, a plate, water</text>
        <text x="60" y="236" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">What to measure:</text>
        <text x="60" y="254" className="small fill-slate-600 dark:fill-slate-400">Every 2 days: shoot height (mm), number of roots, number of leaves</text>
        <text x="60" y="272" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Plot a growth curve (height vs days) — you are doing real agricultural science!</text>

        <defs>
          <marker id="sprout-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
