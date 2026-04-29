export default function ValleyAcousticsDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Cross-section of a valley showing how sound reflects off rock faces to create multiple echoes">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="320" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="25" textAnchor="middle" className="title fill-purple-700 dark:fill-purple-300">
          Valley Acoustics — Why Mountains Echo
        </text>

        {/* Sky */}
        <rect x="0" y="30" width="620" height="130" rx="0" fill="#dbeafe" opacity="0.15" className="dark:fill-blue-900/10" />

        {/* Left mountain */}
        <polygon points="0,240 30,100 80,80 120,110 140,240" fill="#6b7280" opacity="0.6" stroke="#4b5563" strokeWidth="1" className="dark:fill-slate-600/60" />
        <polygon points="0,240 20,120 60,95 100,120 130,240" fill="#9ca3af" opacity="0.4" className="dark:fill-slate-500/40" />
        <text x="65" y="75" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Rock face</text>

        {/* Right mountain */}
        <polygon points="620,240 590,100 540,85 500,115 480,240" fill="#6b7280" opacity="0.6" stroke="#4b5563" strokeWidth="1" className="dark:fill-slate-600/60" />
        <polygon points="620,240 600,120 560,100 520,125 490,240" fill="#9ca3af" opacity="0.4" className="dark:fill-slate-500/40" />
        <text x="555" y="80" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Rock face</text>

        {/* Valley floor */}
        <rect x="130" y="230" width="360" height="20" rx="2" fill="#86efac" opacity="0.3" className="dark:fill-emerald-900/20" />

        {/* Person in valley */}
        <circle cx="310" cy="205" r="8" fill="#fbbf24" />
        <line x1="310" y1="213" x2="310" y2="230" stroke="#fbbf24" strokeWidth="2" />
        <text x="310" y="200" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">shout!</text>

        {/* Sound bouncing - first bounce off left wall */}
        <line x1="310" y1="210" x2="120" y2="150" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#val-arr)" />
        <line x1="120" y1="150" x2="310" y2="210" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#val-arr-back)" />
        <text x="180" y="168" className="small fill-purple-600 dark:fill-purple-400">Echo 1</text>

        {/* Sound bouncing off right wall */}
        <line x1="310" y1="210" x2="500" y2="155" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#val-arr)" />
        <line x1="500" y1="155" x2="310" y2="210" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#val-arr-back)" />
        <text x="440" y="168" className="small fill-purple-600 dark:fill-purple-400">Echo 2</text>

        {/* Second bounce (left→right→back) */}
        <path d="M 120 140 L 500 145" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" />
        <path d="M 500 145 L 310 210" fill="none" stroke="#f0abfc" strokeWidth="1" strokeDasharray="3,3" />
        <text x="310" y="132" textAnchor="middle" className="small fill-purple-400 dark:fill-purple-500">Echo 3 (double bounce, quieter)</text>

        {/* Properties box */}
        <rect x="40" y="258" width="540" height="50" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth="1" className="dark:fill-purple-900/10 dark:stroke-purple-700" />
        <text x="310" y="276" textAnchor="middle" className="small fill-purple-700 dark:fill-purple-400" fontWeight="600">Why mountain echoes are so clear:</text>
        <text x="310" y="296" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Large rock faces (broad reflection) + Hard surface (low absorption) + Wide spacing (clear delay)</text>

        <defs>
          <marker id="val-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
          <marker id="val-arr-back" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#ec4899" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
