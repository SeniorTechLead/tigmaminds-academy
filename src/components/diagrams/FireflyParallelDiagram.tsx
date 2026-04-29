export default function FireflyParallelDiagram() {
  const w = 520, h = 380;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Series vs parallel LED circuits showing failure modes">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Series vs Parallel Circuits</text>

        {/* --- SERIES CIRCUIT (left) --- */}
        <text x="130" y="58" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="600">Series</text>
        <text x="130" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">One path for current</text>

        {/* Battery */}
        <rect x="40" y="85" width="40" height="20" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" />
        <text x="60" y="99" textAnchor="middle" fill="#fbbf24" fontSize="8">9V</text>

        {/* Wire from battery top */}
        <line x1="80" y1="95" x2="100" y2="95" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* LED 1 - working */}
        <polygon points="100,88 100,102 115,95" fill="#4ade80" opacity="0.8" />
        <line x1="115" y1="88" x2="115" y2="102" stroke="#22c55e" strokeWidth="1.5" />
        <text x="107" y="82" textAnchor="middle" fill="#4ade80" fontSize="7">ON</text>

        <line x1="115" y1="95" x2="135" y2="95" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* LED 2 - BROKEN (red X) */}
        <polygon points="135,88 135,102 150,95" fill="#ef4444" opacity="0.5" />
        <line x1="150" y1="88" x2="150" y2="102" stroke="#ef4444" strokeWidth="1.5" />
        <text x="142" y="82" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">✕</text>

        <line x1="150" y1="95" x2="170" y2="95" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* LED 3 - off because chain broken */}
        <polygon points="170,88 170,102 185,95" fill="#475569" opacity="0.5" />
        <line x1="185" y1="88" x2="185" y2="102" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="177" y="82" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">OFF</text>

        {/* Wire back to battery */}
        <line x1="185" y1="95" x2="210" y2="95" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="210" y1="95" x2="210" y2="120" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="210" y1="120" x2="40" y2="120" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="40" y1="120" x2="40" y2="105" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* Failure callout */}
        <rect x="30" y="135" width="200" height="28" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#ef4444" strokeWidth="1" />
        <text x="130" y="153" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600">One fails → ALL go dark!</text>

        {/* --- PARALLEL CIRCUIT (right) --- */}
        <text x="390" y="58" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="600">Parallel</text>
        <text x="390" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Each LED has its own path</text>

        {/* Battery */}
        <rect x="290" y="85" width="40" height="20" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" />
        <text x="310" y="99" textAnchor="middle" fill="#fbbf24" fontSize="8">9V</text>

        {/* Main bus lines */}
        <line x1="330" y1="95" x2="340" y2="95" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="340" y1="82" x2="340" y2="130" stroke="#f59e0b" strokeWidth="2" />
        <line x1="470" y1="82" x2="470" y2="130" stroke="#94a3b8" strokeWidth="2" />

        {/* Branch 1 - working */}
        <line x1="340" y1="85" x2="370" y2="85" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <polygon points="370,78 370,92 385,85" fill="#4ade80" opacity="0.8" />
        <line x1="385" y1="78" x2="385" y2="92" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="377" cy="85" r="8" fill="#4ade80" opacity="0.1" />
        <line x1="385" y1="85" x2="470" y2="85" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="427" y="80" textAnchor="middle" fill="#4ade80" fontSize="7">ON</text>

        {/* Branch 2 - BROKEN */}
        <line x1="340" y1="106" x2="370" y2="106" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <polygon points="370,99 370,113 385,106" fill="#ef4444" opacity="0.5" />
        <line x1="385" y1="99" x2="385" y2="113" stroke="#ef4444" strokeWidth="1.5" />
        <text x="377" y="95" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">✕</text>
        <line x1="385" y1="106" x2="470" y2="106" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Branch 3 - still working! */}
        <line x1="340" y1="127" x2="370" y2="127" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <polygon points="370,120 370,134 385,127" fill="#4ade80" opacity="0.8" />
        <line x1="385" y1="120" x2="385" y2="134" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="377" cy="127" r="8" fill="#4ade80" opacity="0.1" />
        <line x1="385" y1="127" x2="470" y2="127" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="427" y="122" textAnchor="middle" fill="#4ade80" fontSize="7">ON</text>

        {/* Wire back */}
        <line x1="470" y1="106" x2="490" y2="106" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="490" y1="106" x2="490" y2="140" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="490" y1="140" x2="290" y2="140" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="290" y1="140" x2="290" y2="105" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* Success callout */}
        <rect x="295" y="155" width="200" height="28" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1" />
        <text x="395" y="173" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="600">One fails → others still glow!</text>

        {/* --- FIREFLY ANALOGY (bottom) --- */}
        <line x1="20" y1="205" x2={w - 20} y2="205" stroke="#334155" strokeWidth="0.5" />

        <text x={w / 2} y="228" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">Parallel = Independent, Like Real Fireflies</text>

        {/* Firefly field */}
        <rect x="60" y="242" width="400" height="110" rx="10" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Fireflies as glowing dots */}
        {[
          { x: 120, y: 275, on: true },
          { x: 190, y: 290, on: true },
          { x: 250, y: 260, on: false },
          { x: 310, y: 300, on: true },
          { x: 370, y: 270, on: true },
          { x: 160, y: 320, on: true },
          { x: 280, y: 330, on: true },
          { x: 400, y: 310, on: true },
        ].map((f, i) => (
          <g key={i}>
            {f.on && <circle cx={f.x} cy={f.y} r="12" fill="#a3e635" opacity="0.08" />}
            {f.on && <circle cx={f.x} cy={f.y} r="7" fill="#a3e635" opacity="0.15" />}
            <circle cx={f.x} cy={f.y} r="3" fill={f.on ? '#a3e635' : '#475569'} />
          </g>
        ))}

        <text x={w / 2} y="365" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Each firefly glows independently — if one stops, the field still shimmers</text>
      </svg>
    </div>
  );
}
