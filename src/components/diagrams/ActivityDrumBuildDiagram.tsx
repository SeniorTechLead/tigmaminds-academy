export default function ActivityDrumBuildDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Offline activity showing how to build a simple drum from a bowl and plastic wrap to observe vibration patterns">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="280" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="25" textAnchor="middle" className="title fill-red-700 dark:fill-red-300">
          Activity: Build a Drum and See Vibration Patterns
        </text>

        {/* Step 1: Bowl */}
        <g>
          <text x="100" y="55" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Step 1: Bowl + wrap</text>
          <path d="M 55 90 Q 55 130 100 130 Q 145 130 145 90" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700" />
          <line x1="55" y1="90" x2="145" y2="90" stroke="#d97706" strokeWidth="2" />
          <text x="100" y="84" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">plastic wrap</text>
          <text x="100" y="148" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Stretch tightly</text>
          <text x="100" y="161" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">over a bowl</text>
        </g>

        {/* Step 2: Add salt */}
        <g>
          <text x="260" y="55" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Step 2: Sprinkle salt</text>
          <path d="M 215 90 Q 215 130 260 130 Q 305 130 305 90" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700" />
          <line x1="215" y1="90" x2="305" y2="90" stroke="#d97706" strokeWidth="2" />
          {/* Salt grains */}
          {[230, 240, 250, 260, 270, 280, 290, 245, 255, 265, 275].map((x, i) => (
            <circle key={i} cx={x} cy={87 - Math.random() * 3} r="1.2" fill="#fbbf24" />
          ))}
          <text x="260" y="148" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Fine salt or sand</text>
          <text x="260" y="161" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">on the surface</text>
        </g>

        {/* Step 3: Tap and observe */}
        <g>
          <text x="420" y="55" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Step 3: Tap! Watch the salt</text>
          <path d="M 375 90 Q 375 130 420 130 Q 465 130 465 90" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700" />
          <line x1="375" y1="90" x2="465" y2="90" stroke="#d97706" strokeWidth="2" />
          {/* Salt moved to nodal lines pattern */}
          <circle cx="420" cy="87" r="1.2" fill="#fbbf24" />
          {[395, 405, 415, 425, 435, 445].map((x, i) => (
            <circle key={i} cx={x} cy={88} r="1.2" fill="#fbbf24" />
          ))}
          {/* Tap indicator */}
          <line x1="380" y1="70" x2="390" y2="85" stroke="#ef4444" strokeWidth="2" />
          <text x="370" y="68" className="small fill-red-500 dark:fill-red-400">tap!</text>
          <text x="420" y="148" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Salt collects on</text>
          <text x="420" y="161" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">nodal lines!</text>
        </g>

        {/* Step 4: Change tension */}
        <g>
          <text x="560" y="55" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Step 4: Vary tension</text>
          <path d="M 515 90 Q 515 130 560 130 Q 605 130 605 90" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700" />
          <line x1="515" y1="90" x2="605" y2="90" stroke="#d97706" strokeWidth="2" />
          {/* Arrows showing pull tighter */}
          <line x1="510" y1="88" x2="500" y2="88" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#drum-arr)" />
          <line x1="610" y1="88" x2="620" y2="88" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#drum-arr-r)" />
          <text x="560" y="148" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Pull tighter = </text>
          <text x="560" y="161" textAnchor="middle" className="small fill-blue-500 dark:fill-blue-400" fontWeight="600">higher pitch!</text>
        </g>

        {/* Questions to investigate */}
        <rect x="40" y="178" width="540" height="88" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="60" y="198" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Questions to investigate:</text>
        <text x="60" y="216" className="small fill-slate-600 dark:fill-slate-400">• Does tapping the center vs the edge produce different salt patterns?</text>
        <text x="60" y="232" className="small fill-slate-600 dark:fill-slate-400">• Does pulling the wrap tighter change the patterns? What about the pitch?</text>
        <text x="60" y="248" className="small fill-slate-600 dark:fill-slate-400">• Try a bigger bowl vs a smaller one — which produces a deeper sound?</text>
        <text x="60" y="264" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">You are seeing Chladni patterns — the same physics that drives every drum, from dhol to tabla!</text>

        <defs>
          <marker id="drum-arr" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#3b82f6" />
          </marker>
          <marker id="drum-arr-r" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
