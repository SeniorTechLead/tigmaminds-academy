export default function FireflyForLoopDiagram() {
  const w = 520, h = 360;
  const ledCount = 10;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="For-loop visualization: counter 0 to 9 lighting LEDs in sequence">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">The For-Loop: Lighting LEDs One by One</text>

        {/* Code block */}
        <rect x="40" y="48" width="260" height="55" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="55" y="68" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="600">for</text>
        <text x="78" y="68" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontFamily="monospace"> i </text>
        <text x="93" y="68" fill="#c084fc" fontSize="10" fontFamily="monospace">in</text>
        <text x="108" y="68" fill="#fbbf24" fontSize="10" fontFamily="monospace"> range(10)</text>
        <text x="185" y="68" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontFamily="monospace">:</text>
        <text x="70" y="88" fill="#4ade80" fontSize="10" fontFamily="monospace">    light_LED(i)</text>

        {/* Loop arrow */}
        <path d="M310,65 Q340,40 340,75 Q340,100 310,88" fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#loopArrow)" />
        <text x="355" y="72" fill="#f59e0b" fontSize="9">repeat</text>
        <text x="355" y="84" fill="#f59e0b" fontSize="9">10 times</text>

        {/* Counter visualization */}
        <text x="40" y="130" fill="#f59e0b" fontSize="11" fontWeight="600">Counter i:</text>
        {Array.from({ length: ledCount }).map((_, i) => {
          const x = 120 + i * 38;
          const isActive = i === 6; // Show i=6 as current
          return (
            <g key={i}>
              <rect
                x={x}
                y="115"
                width="32"
                height="24"
                rx="4"
                fill={isActive ? '#4ade80' : '#1e293b'}
                stroke={isActive ? '#22c55e' : '#334155'}
                strokeWidth={isActive ? 2 : 1}
              />
              <text
                x={x + 16}
                y="131"
                textAnchor="middle"
                fill={isActive ? '#0f172a' : '#94a3b8'}
                fontSize="11"
                fontWeight={isActive ? '700' : '400'}
              >{i}</text>
            </g>
          );
        })}

        {/* Current pointer */}
        <polygon points="272,146 282,146 277,155" fill="#f59e0b" />
        <text x="277" y="168" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">i = 6</text>

        {/* LED strip */}
        <text x="40" y="200" fill="#f59e0b" fontSize="11" fontWeight="600">LED strip:</text>
        {Array.from({ length: ledCount }).map((_, i) => {
          const x = 120 + i * 38;
          const isLit = i <= 6;
          return (
            <g key={i}>
              {/* Glow */}
              {isLit && <circle cx={x + 16} cy="215" r="16" fill="#4ade80" opacity="0.08" />}
              {isLit && <circle cx={x + 16} cy="215" r="10" fill="#4ade80" opacity="0.15" />}
              {/* LED body */}
              <circle
                cx={x + 16}
                cy="215"
                r="8"
                fill={isLit ? '#4ade80' : '#1e293b'}
                stroke={isLit ? '#22c55e' : '#475569'}
                strokeWidth="1.5"
              />
              {/* Index */}
              <text x={x + 16} y="240" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">[{i}]</text>
            </g>
          );
        })}

        {/* Arrow connecting counter to LEDs */}
        <line x1="277" y1="170" x2="277" y2="196" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 2" />

        {/* Execution trace */}
        <rect x="40" y="260" width="440" height="80" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="55" y="280" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontFamily="monospace">i=0 → LED[0] ON ✓</text>
        <text x="55" y="293" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontFamily="monospace">i=1 → LED[1] ON ✓</text>
        <text x="55" y="306" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontFamily="monospace">i=2 → LED[2] ON ✓  ...</text>
        <text x="55" y="319" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="600">i=6 → LED[6] ON ← now here</text>
        <text x="55" y="332" className="fill-gray-400 dark:fill-slate-500" fontSize="9" fontFamily="monospace">i=7 → LED[7] ... (next)</text>

        <text x="300" y="290" fill="#f59e0b" fontSize="10" fontWeight="600">Each iteration:</text>
        <text x="300" y="306" className="fill-gray-500 dark:fill-slate-400" fontSize="9">1. Check: is i &lt; 10?</text>
        <text x="300" y="320" className="fill-gray-500 dark:fill-slate-400" fontSize="9">2. Run: light_LED(i)</text>
        <text x="300" y="334" className="fill-gray-500 dark:fill-slate-400" fontSize="9">3. Increment: i = i + 1</text>

        <defs>
          <marker id="loopArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
