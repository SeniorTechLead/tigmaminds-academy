export default function FireflyRandomDiagram() {
  const w = 520, h = 340;

  // Each firefly has random-looking blink timings
  const fireflies = [
    { label: 'Firefly A', pattern: [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0] },
    { label: 'Firefly B', pattern: [0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1] },
    { label: 'Firefly C', pattern: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0] },
    { label: 'Firefly D', pattern: [0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0] },
    { label: 'Firefly E', pattern: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0] },
  ];

  const barW = 20;
  const barH = 28;
  const startX = 130;
  const gap = 2;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Five fireflies with staggered random blink timings shown as timeline bars">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Random Blink Timings</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Each firefly has its own random rhythm — that's what makes the field look alive</text>

        {/* Time axis labels */}
        <text x={startX - 10} y="72" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="9" fontWeight="600">Time →</text>
        {Array.from({ length: 16 }).map((_, i) => (
          <text key={i} x={startX + i * (barW + gap) + barW / 2} y="72" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">{i + 1}</text>
        ))}

        {/* Firefly rows */}
        {fireflies.map((fly, row) => {
          const y = 85 + row * 44;
          return (
            <g key={row}>
              {/* Firefly icon */}
              <circle cx="30" cy={y + barH / 2} r="6" fill="#a3e635" opacity="0.15" />
              <circle cx="30" cy={y + barH / 2} r="3" fill="#a3e635" opacity="0.6" />

              {/* Label */}
              <text x="45" y={y + barH / 2 + 4} className="fill-gray-500 dark:fill-slate-400" fontSize="9">{fly.label}</text>

              {/* Blink bars */}
              {fly.pattern.map((on, col) => (
                <g key={col}>
                  <rect
                    x={startX + col * (barW + gap)}
                    y={y}
                    width={barW}
                    height={barH}
                    rx="3"
                    fill={on ? '#4ade80' : '#1e293b'}
                    stroke={on ? '#22c55e' : '#334155'}
                    strokeWidth="1"
                    opacity={on ? 0.9 : 0.5}
                  />
                  {on && (
                    <circle
                      cx={startX + col * (barW + gap) + barW / 2}
                      cy={y + barH / 2}
                      r="10"
                      fill="#4ade80"
                      opacity="0.08"
                    />
                  )}
                </g>
              ))}
            </g>
          );
        })}

        {/* Legend */}
        <rect x="130" y="312" width="14" height="10" rx="2" fill="#4ade80" opacity="0.9" />
        <text x="150" y="321" className="fill-gray-500 dark:fill-slate-400" fontSize="9">= LED ON (flash)</text>
        <rect x="260" y="312" width="14" height="10" rx="2" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
        <text x="280" y="321" className="fill-gray-500 dark:fill-slate-400" fontSize="9">= LED OFF (dark)</text>

        {/* Bottom insight */}
        <rect x="60" y="280" width="400" height="24" rx="5" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x={w / 2} y="296" textAnchor="middle" fill="#fbbf24" fontSize="10">In code: delay(random(500, 2000)) gives each LED a unique rhythm</text>
      </svg>
    </div>
  );
}
