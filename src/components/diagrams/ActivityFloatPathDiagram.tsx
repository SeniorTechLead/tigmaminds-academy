export default function ActivityFloatPathDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Offline activity: observe how a leaf drifts in a stream to visualize current patterns and vector addition">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="280" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="25" textAnchor="middle" className="title fill-cyan-700 dark:fill-cyan-300">
          Activity: Map Water Flow with a Floating Leaf
        </text>

        {/* Stream top view */}
        <rect x="40" y="50" width="540" height="100" rx="6" fill="#0c4a6e" opacity="0.12" stroke="#60a5fa" strokeWidth="1" className="dark:fill-blue-900/15" />
        <text x="310" y="45" textAnchor="middle" className="small fill-blue-500 dark:fill-blue-400">Stream or drain (top view)</text>

        {/* Banks */}
        <rect x="40" y="48" width="540" height="4" rx="2" fill="#92400e" opacity="0.4" />
        <rect x="40" y="148" width="540" height="4" rx="2" fill="#92400e" opacity="0.4" />

        {/* Leaf path 1: Center (fast, straight) */}
        <path d="M 60 100 L 250 98 L 400 96 L 560 95" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#leaf-arr)" />
        {/* Leaf icon */}
        <ellipse cx="60" cy="100" rx="6" ry="4" fill="#4ade80" stroke="#16a34a" strokeWidth="0.8" transform="rotate(10, 60, 100)" />
        <text x="250" y="92" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Center: fast, straight path</text>

        {/* Leaf path 2: Near bank (slow, wobbly) */}
        <path d="M 60 70 Q 120 72 180 75 Q 250 72 320 78 Q 400 74 480 80 Q 530 78 560 82" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#leaf-arr-y)" />
        <ellipse cx="60" cy="70" rx="6" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" transform="rotate(-5, 60, 70)" />
        <text x="250" y="66" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">Near bank: slower (friction with bank)</text>

        {/* Leaf path 3: Around obstacle */}
        <circle cx="400" cy="120" r="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" className="dark:fill-slate-500" />
        <text x="400" y="124" textAnchor="middle" className="small fill-white" style={{ fontSize: '8px' }}>rock</text>
        <path d="M 60 130 Q 200 128 370 120 Q 390 108 415 112 Q 430 118 430 130 Q 425 140 410 138 Q 395 135 390 130" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <ellipse cx="60" cy="130" rx="6" ry="4" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.8" transform="rotate(5, 60, 130)" />
        <text x="475" y="138" className="small fill-red-500 dark:fill-red-400">Trapped in eddy!</text>

        {/* Instructions */}
        <rect x="40" y="165" width="540" height="105" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="60" y="185" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">How to do this experiment:</text>
        <text x="60" y="205" className="small fill-slate-600 dark:fill-slate-400">1. Find a slow stream, gutter with flowing water, or run water through a tray with obstacles</text>
        <text x="60" y="221" className="small fill-slate-600 dark:fill-slate-400">2. Drop small leaves or paper scraps at different positions (center, near edge, upstream of a rock)</text>
        <text x="60" y="237" className="small fill-slate-600 dark:fill-slate-400">3. Time how long each takes to travel 1 metre — center should be fastest</text>
        <text x="60" y="253" className="small fill-slate-600 dark:fill-slate-400">4. Sketch the paths from above. Do any leaves get caught in circular eddies behind obstacles?</text>
        <text x="60" y="268" className="small fill-cyan-600 dark:fill-cyan-400" fontWeight="600">You are mapping the velocity field of a fluid — the same thing CFD software does with math!</text>
      </svg>
    </div>
  );
}
