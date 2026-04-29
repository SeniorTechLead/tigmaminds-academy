export default function ElephantTimeAxisDiagram() {
  const coarsePoints = Array.from({ length: 10 }, (_, i) => (i * 3) / 9);
  const zoomTicks = Array.from({ length: 12 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 670 441"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Diagram comparing coarse and fine time axes using np.linspace, with a geophone sensor and elephant silhouette"
    >
      {/* Background */}
      <rect width="620" height="420" rx="12" className="fill-slate-900" />

      {/* === TOP SECTION: Geophone + Elephant === */}
      <g transform="translate(0, 20)">
        {/* Geophone icon — triangle with antenna */}
        <g transform="translate(60, 25)">
          {/* Antenna */}
          <line x1="0" y1="-18" x2="0" y2="-4" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="0" cy="-20" r="2.5" className="fill-gray-500 dark:fill-slate-400" />
          {/* Triangle body */}
          <polygon points="-12,16 12,16 0,-4" className="fill-gray-400 dark:fill-slate-500" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Ground line */}
          <line x1="-18" y1="16" x2="18" y2="16" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
        </g>
        <text x="60" y="68" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9.5" fontWeight="600">
          Ground sensor
        </text>
        <text x="60" y="80" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">
          8,000 samples/sec
        </text>

        {/* Elephant silhouette — simplified walking pose */}
        <g transform="translate(480, 8)">
          {/* Body oval */}
          <ellipse cx="0" cy="22" rx="34" ry="18" fill="#475569" />
          {/* Head */}
          <ellipse cx="-30" cy="12" rx="14" ry="12" fill="#475569" />
          {/* Trunk */}
          <path d="M-42,16 Q-52,30 -46,42" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Ear */}
          <ellipse cx="-22" cy="10" rx="10" ry="13" fill="#526077" />
          {/* Eye */}
          <circle cx="-34" cy="8" r="1.5" className="fill-gray-600 dark:fill-slate-300" />
          {/* Legs */}
          <rect x="-16" y="34" width="7" height="20" rx="3" fill="#475569" />
          <rect x="6" y="34" width="7" height="20" rx="3" fill="#475569" />
          <rect x="-24" y="34" width="7" height="18" rx="3" fill="#3e4a5c" />
          <rect x="16" y="34" width="7" height="18" rx="3" fill="#3e4a5c" />
          {/* Tail */}
          <path d="M34,18 Q44,10 40,4" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Tusk */}
          <path d="M-42,14 Q-48,20 -44,24" stroke="#e2e8f0" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <text x="480" y="75" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9.5" fontWeight="600">
          Elephant walking past
        </text>

        {/* Vibration waves from elephant to sensor */}
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx={180 + i * 80}
            cy="40"
            rx={6 + i * 3}
            ry={10 + i * 4}
            fill="none"
            className="stroke-gray-300 dark:stroke-slate-600"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity={0.6 - i * 0.15}
          />
        ))}
      </g>

      {/* Divider */}
      <line x1="30" y1="100" x2="590" y2="100" stroke="#334155" strokeWidth="1" />

      {/* === RULER 1: Coarse (10 points) === */}
      <g transform="translate(50, 120)">
        <text x="0" y="0" fill="#9ca3af" fontSize="12" fontWeight="700">
          10 points
        </text>
        <text x="520" y="0" textAnchor="end" fill="#6b7280" fontSize="10" fontFamily="monospace">
          np.linspace(0, 3, 10)
        </text>

        {/* Rail */}
        <line x1="0" y1="28" x2="520" y2="28" stroke="#4b5563" strokeWidth="2" />

        {/* Ticks and dots */}
        {coarsePoints.map((val, i) => {
          const x = (val / 3) * 520;
          return (
            <g key={i}>
              <line x1={x} y1="18" x2={x} y2="38" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={x} cy="28" r="4.5" fill="#6b7280" />
              {i % 3 === 0 && (
                <text x={x} y="54" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="monospace">
                  {val.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
        <text x="540" y="32" fill="#6b7280" fontSize="10">sec</text>

        {/* Coarse label */}
        <text x="260" y="70" textAnchor="middle" fill="#9ca3af" fontSize="10" fontStyle="italic">
          Coarse — misses detail
        </text>
      </g>

      {/* === RULER 2: Fine (24,000 points) === */}
      <g transform="translate(50, 220)">
        <text x="0" y="0" fill="#34d399" fontSize="12" fontWeight="700">
          24,000 points
        </text>
        <text x="520" y="0" textAnchor="end" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
          np.linspace(0, 3, 24000)
        </text>

        {/* Rail — solid bar to represent dense ticks */}
        <rect x="0" y="22" width="520" height="12" rx="2" fill="#065f46" />
        <rect x="0" y="24" width="520" height="8" rx="1" fill="#059669" opacity="0.7" />

        {/* Tick marks at ends and key points to show labels */}
        {[0, 1, 2, 3].map((s) => {
          const x = (s / 3) * 520;
          return (
            <text key={s} x={x} y="50" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
              {s.toFixed(1)}
            </text>
          );
        })}
        <text x="540" y="32" fill="#6ee7b7" fontSize="10">sec</text>

        {/* Fine label */}
        <text x="260" y="66" textAnchor="middle" fill="#34d399" fontSize="10" fontStyle="italic">
          Fine — captures every vibration
        </text>
      </g>

      {/* === ZOOM CALLOUT === */}
      <g transform="translate(360, 274)">
        {/* Callout line from ruler to box */}
        <line x1="-10" y1="-10" x2="10" y2="10" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Callout box */}
        <rect x="10" y="10" width="180" height="56" rx="6" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="100" y="26" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
          Zoomed in (0.001s window)
        </text>

        {/* Individual ticks visible in zoom */}
        <line x1="20" y1="44" x2="180" y2="44" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
        {zoomTicks.map((i) => {
          const x = 24 + i * 13.3;
          return (
            <g key={i}>
              <line x1={x} y1="38" x2={x} y2="50" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx={x} cy="44" r="2" fill="#fbbf24" />
            </g>
          );
        })}
        <text x="100" y="62" textAnchor="middle" fill="#d97706" fontSize="8">
          each tick = 1 sample
        </text>
      </g>

      {/* === BOTTOM ANNOTATION === */}
      <g transform="translate(50, 380)">
        {/* Arrow line spanning the width */}
        <defs>
          <marker id="eta-arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
        </defs>
        <line x1="80" y1="8" x2="440" y2="8" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#eta-arrowhead)" markerStart="url(#eta-arrowhead)" />
        <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="600">
          More points = more detail = better recording
        </text>
      </g>
    </svg>
  );
}
