export default function WhiskerSpatialMapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Tiger face showing whisker fan spanning body width, creating a 3D spatial map in darkness">
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Spatial Awareness: How Whiskers Map the Dark</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Whiskers spread to body width — if they fit, the tiger fits</text>

        {/* Tiger face - simplified front view */}
        <g transform="translate(390, 220)">
          {/* Head outline */}
          <ellipse cx="0" cy="0" rx="70" ry="80" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="2" />
          {/* Ears */}
          <ellipse cx="-55" cy="-65" rx="20" ry="28" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
          <ellipse cx="55" cy="-65" rx="20" ry="28" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Eyes */}
          <ellipse cx="-25" cy="-15" rx="12" ry="8" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="-25" cy="-15" r="5" fill="#92400e" />
          <ellipse cx="25" cy="-15" rx="12" ry="8" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="25" cy="-15" r="5" fill="#92400e" />
          {/* Nose */}
          <path d="M -8 15 Q 0 22 8 15 Q 4 12 0 15 Q -4 12 -8 15" fill="#92400e" />
          {/* Stripes */}
          <line x1="-40" y1="-50" x2="-30" y2="-30" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-50" y1="-35" x2="-38" y2="-18" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="-50" x2="30" y2="-30" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="-35" x2="38" y2="-18" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Whiskers - fanning out */}
          {[
            { x: -160, y: -30, startX: -20, startY: 10 },
            { x: -170, y: 0, startX: -20, startY: 18 },
            { x: -155, y: 30, startX: -18, startY: 28 },
            { x: -140, y: 55, startX: -15, startY: 35 },
            { x: 160, y: -30, startX: 20, startY: 10 },
            { x: 170, y: 0, startX: 20, startY: 18 },
            { x: 155, y: 30, startX: 18, startY: 28 },
            { x: 140, y: 55, startX: 15, startY: 35 },
          ].map((w, i) => (
            <line key={i} x1={w.startX} y1={w.startY} x2={w.x} y2={w.y} stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </g>

        {/* Body width indication */}
        <line x1="225" y1="340" x2="555" y2="340" stroke="#8b5cf6" strokeWidth="2" />
        <line x1="225" y1="335" x2="225" y2="345" stroke="#8b5cf6" strokeWidth="2" />
        <line x1="555" y1="335" x2="555" y2="345" stroke="#8b5cf6" strokeWidth="2" />
        <text x="390" y="360" textAnchor="middle" fontSize="12" fontWeight="600" fill="#8b5cf6">Whisker span ≈ body width</text>

        {/* Gap test illustration */}
        <g transform="translate(90, 130)">
          <rect width="100" height="200" rx="6" className="fill-gray-200 dark:fill-slate-700" opacity="0.5" />
          <text x="50" y="-8" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Narrow gap</text>
          <rect x="85" y="0" width="30" height="200" fill="none" />
          <rect x="115" y="0" width="50" height="200" rx="6" className="fill-gray-200 dark:fill-slate-700" opacity="0.5" />
          {/* Whisker hitting wall */}
          <line x1="85" y1="80" x2="50" y2="95" stroke="#78350f" strokeWidth="1.5" />
          <line x1="85" y1="100" x2="115" y2="100" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="115" cy="100" r="4" fill="#ef4444" opacity="0.5" />
          <text x="115" y="130" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="600">Contact!</text>
          <text x="85" y="180" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Whisker touches</text>
          <text x="85" y="194" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">wall = too narrow</text>
        </g>

        {/* Wide gap */}
        <g transform="translate(590, 130)">
          <rect width="60" height="200" rx="6" className="fill-gray-200 dark:fill-slate-700" opacity="0.5" />
          <text x="65" y="-8" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Wide gap</text>
          <rect x="130" y="0" width="60" height="200" rx="6" className="fill-gray-200 dark:fill-slate-700" opacity="0.5" />
          {/* Whiskers not touching */}
          <line x1="60" y1="80" x2="105" y2="75" stroke="#78350f" strokeWidth="1.5" />
          <line x1="130" y1="80" x2="90" y2="75" stroke="#78350f" strokeWidth="1.5" />
          <text x="95" y="120" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">Clear!</text>
          <text x="95" y="180" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">No contact</text>
          <text x="95" y="194" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">= safe to pass</text>
        </g>

        {/* Key insight */}
        <rect x="100" y="385" width="580" height="38" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="409" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">
          Like a blind person's cane — but 30 canes operating simultaneously, detecting airflow and contact
        </text>
      </svg>
    </div>
  );
}
