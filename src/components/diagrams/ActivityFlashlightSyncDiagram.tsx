export default function ActivityFlashlightSyncDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Flashlight synchronization activity: five people sync their flashlights without a leader, like fireflies"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
          @keyframes blink-sync {
            0%, 45% { opacity: 0; }
            50%, 95% { opacity: 1; }
            100% { opacity: 0; }
          }
          .sync-blink { animation: blink-sync 1.5s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="640" height="420" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="320" y="25" textAnchor="middle" className="title fill-amber-300">
          Try This: Sync Flashlights With Friends
        </text>

        {/* --- Step 1: Random blinking (top left) --- */}
        <rect x="15" y="38" width="190" height="158" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />
        <text x="110" y="56" textAnchor="middle" className="step fill-red-400">Step 1</text>
        <text x="110" y="72" textAnchor="middle" className="small fill-slate-400">All blink randomly</text>

        {/* 5 people in circle — staggered lights */}
        {[
          { x: 70, y: 112, on: true },
          { x: 110, y: 90, on: false },
          { x: 150, y: 112, on: true },
          { x: 135, y: 152, on: false },
          { x: 85, y: 152, on: true },
        ].map(({ x, y, on }, i) => (
          <g key={i}>
            {/* Head */}
            <circle cx={x} cy={y} r={6} fill="#d4a574" />
            {/* Body */}
            <line x1={x} y1={y + 6} x2={x} y2={y + 20} stroke="#64748b" strokeWidth="2" />
            {/* Flashlight glow */}
            {on ? (
              <circle cx={x} cy={y - 10} r={8} fill="#fbbf24" opacity="0.6" />
            ) : (
              <circle cx={x} cy={y - 10} r={4} fill="#334155" opacity="0.5" />
            )}
            {/* Flashlight */}
            <rect x={x - 2} y={y - 8} width="4" height="8" rx="1"
              fill={on ? '#fbbf24' : '#475569'} />
          </g>
        ))}

        {/* Timing bars showing stagger */}
        <g transform="translate(30, 176)">
          {[0, 15, 30, 45, 60].map((offset, i) => {
            const segments = [
              { x: offset % 40, w: 12 },
              { x: (offset + 25) % 60, w: 10 },
            ];
            return (
              <g key={i}>
                <rect x="0" y={i * 4} width="160" height="3" rx="1" className="fill-gray-100 dark:fill-slate-800" />
                {segments.map((s, j) => (
                  <rect key={j} x={s.x} y={i * 4} width={s.w} height="3" rx="1"
                    fill="#fbbf24" opacity="0.7" />
                ))}
              </g>
            );
          })}
        </g>

        {/* --- Step 2: Watching neighbors (top middle) --- */}
        <rect x="220" y="38" width="190" height="158" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="1" />
        <text x="315" y="56" textAnchor="middle" className="step fill-amber-400">Step 2</text>
        <text x="315" y="72" textAnchor="middle" className="small fill-slate-400">Watch neighbors, adjust</text>

        {/* 5 people — some syncing */}
        {[
          { x: 275, y: 112, on: true },
          { x: 315, y: 90, on: true },
          { x: 355, y: 112, on: false },
          { x: 340, y: 152, on: true },
          { x: 290, y: 152, on: false },
        ].map(({ x, y, on }, i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={6} fill="#d4a574" />
            <line x1={x} y1={y + 6} x2={x} y2={y + 20} stroke="#64748b" strokeWidth="2" />
            {on ? (
              <circle cx={x} cy={y - 10} r={8} fill="#fbbf24" opacity="0.6" />
            ) : (
              <circle cx={x} cy={y - 10} r={4} fill="#334155" opacity="0.5" />
            )}
            <rect x={x - 2} y={y - 8} width="4" height="8" rx="1"
              fill={on ? '#fbbf24' : '#475569'} />
          </g>
        ))}

        {/* Eye/watching arrows */}
        <path d="M 285 110 Q 295 97 305 94" fill="none" stroke="#60a5fa" strokeWidth="0.8"
          strokeDasharray="2,2" />
        <path d="M 350 110 Q 335 97 325 94" fill="none" stroke="#60a5fa" strokeWidth="0.8"
          strokeDasharray="2,2" />
        <path d="M 295 150 Q 280 132 277 120" fill="none" stroke="#60a5fa" strokeWidth="0.8"
          strokeDasharray="2,2" />

        {/* Timing bars — partially aligned */}
        <g transform="translate(235, 176)">
          {[5, 7, 15, 6, 12].map((offset, i) => (
            <g key={i}>
              <rect x="0" y={i * 4} width="160" height="3" rx="1" className="fill-gray-100 dark:fill-slate-800" />
              <rect x={offset} y={i * 4} width="14" height="3" rx="1" fill="#fbbf24" opacity="0.7" />
              <rect x={offset + 40} y={i * 4} width="14" height="3" rx="1" fill="#fbbf24" opacity="0.7" />
            </g>
          ))}
        </g>

        {/* --- Step 3: All synced (top right) --- */}
        <rect x="425" y="38" width="190" height="158" rx="6" className="fill-white dark:fill-slate-950" stroke="#22c55e" strokeWidth="1.5" />
        <text x="520" y="56" textAnchor="middle" className="step fill-green-400">Step 3</text>
        <text x="520" y="72" textAnchor="middle" className="small fill-slate-400">All blinking together!</text>

        {/* 5 people — all ON together */}
        {[
          { x: 480, y: 112 },
          { x: 520, y: 90 },
          { x: 560, y: 112 },
          { x: 545, y: 152 },
          { x: 495, y: 152 },
        ].map(({ x, y }, i) => (
          <g key={i} className="sync-blink">
            <circle cx={x} cy={y} r={6} fill="#d4a574" />
            <line x1={x} y1={y + 6} x2={x} y2={y + 20} stroke="#64748b" strokeWidth="2" />
            <circle cx={x} cy={y - 10} r={10} fill="#fbbf24" opacity="0.5" />
            <circle cx={x} cy={y - 10} r={6} fill="#fef3c7" opacity="0.7" />
            <rect x={x - 2} y={y - 8} width="4" height="8" rx="1" fill="#fbbf24" />
          </g>
        ))}

        {/* Timing bars — all aligned */}
        <g transform="translate(440, 176)">
          {[0, 0, 0, 0, 0].map((offset, i) => (
            <g key={i}>
              <rect x="0" y={i * 4} width="160" height="3" rx="1" className="fill-gray-100 dark:fill-slate-800" />
              <rect x="5" y={i * 4} width="14" height="3" rx="1" fill="#22c55e" opacity="0.8" />
              <rect x="45" y={i * 4} width="14" height="3" rx="1" fill="#22c55e" opacity="0.8" />
              <rect x="85" y={i * 4} width="14" height="3" rx="1" fill="#22c55e" opacity="0.8" />
              <rect x="125" y={i * 4} width="14" height="3" rx="1" fill="#22c55e" opacity="0.8" />
            </g>
          ))}
        </g>

        {/* Arrows between steps */}
        <line x1="206" y1="117" x2="218" y2="117" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="220,117 214,113 214,121" className="fill-gray-500 dark:fill-slate-400" />
        <line x1="411" y1="117" x2="423" y2="117" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="425,117 419,113 419,121" className="fill-gray-500 dark:fill-slate-400" />

        {/* --- Rules section (bottom) --- */}
        <rect x="30" y="214" width="580" height="88" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="320" y="236" textAnchor="middle" className="label fill-cyan-300">
          The Rules
        </text>

        <g transform="translate(60, 252)">
          <circle cx="0" cy="0" r="4" fill="#ef4444" />
          <text x="12" y="4" className="label fill-slate-300">No talking — watch only</text>
        </g>
        <g transform="translate(60, 274)">
          <circle cx="0" cy="0" r="4" fill="#f59e0b" />
          <text x="12" y="4" className="label fill-slate-300">No leader — everyone adjusts to neighbors</text>
        </g>
        <g transform="translate(370, 252)">
          <circle cx="0" cy="0" r="4" fill="#22c55e" />
          <text x="12" y="4" className="label fill-slate-300">Blink on/off every ~1 second</text>
        </g>
        <g transform="translate(370, 274)">
          <circle cx="0" cy="0" r="4" fill="#3b82f6" />
          <text x="12" y="4" className="label fill-slate-300">If neighbor blinks, speed up a tiny bit</text>
        </g>

        {/* --- Bottom result --- */}
        <rect x="110" y="318" width="420" height="48" rx="6" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
        <text x="320" y="340" textAnchor="middle" className="step fill-green-300">
          2 minutes to sync — no leader needed
        </text>
        <text x="320" y="358" textAnchor="middle" className="small fill-green-200">
          This is exactly how fireflies synchronize across an entire riverbank
        </text>

        {/* Firefly decoration */}
        {[80, 150, 490, 560].map((x, i) => (
          <g key={i} className="sync-blink">
            <circle cx={x} cy={380 + (i % 2) * 15} r={3} fill="#fbbf24" opacity="0.6" />
            <circle cx={x} cy={380 + (i % 2) * 15} r={6} fill="#fbbf24" opacity="0.15" />
          </g>
        ))}

        {/* Materials */}
        <text x="320" y="410" textAnchor="middle" className="small fill-slate-600">
          You need: 3-5 friends, each with a phone flashlight, a dark room
        </text>
      </svg>
    </div>
  );
}
