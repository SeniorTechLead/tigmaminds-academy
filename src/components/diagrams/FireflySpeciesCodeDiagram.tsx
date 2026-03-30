export default function FireflySpeciesCodeDiagram() {
  const w = 520, h = 360;

  // Species flash patterns (1 = flash, 0 = dark, each unit = 200ms)
  const species = [
    {
      name: 'Photinus pyralis',
      common: 'Common Eastern',
      pattern: [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      color: '#a3e635',
      desc: 'Two quick flashes, long pause',
    },
    {
      name: 'Photuris versicolor',
      common: 'Pennsylvania',
      pattern: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      color: '#4ade80',
      desc: 'One long flash, pause',
    },
    {
      name: 'Photinus consimilis',
      common: 'Triple flasher',
      pattern: [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      color: '#facc15',
      desc: 'Three rapid flashes, pause',
    },
  ];

  const barW = 18;
  const barH = 30;
  const gap = 2;
  const startX = 100;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Three firefly species with distinct flash pattern timelines serving as species identification codes">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Flash Pattern = Species ID Code</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Each species has a unique blink signature for mating signals</text>

        {/* Time axis */}
        <text x={startX + (20 * (barW + gap)) / 2} y="70" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Time (each block = 200ms) →</text>

        {species.map((sp, si) => {
          const y = 85 + si * 85;
          return (
            <g key={si}>
              {/* Species label */}
              <circle cx="20" cy={y + 15} r="6" fill={sp.color} opacity="0.5" />
              <circle cx="20" cy={y + 15} r="3" fill={sp.color} />
              <text x="32" y={y + 10} fill={sp.color} fontSize="9" fontWeight="600" fontStyle="italic">{sp.name}</text>
              <text x="32" y={y + 22} className="fill-gray-500 dark:fill-slate-400" fontSize="8">({sp.common})</text>

              {/* Pattern bars */}
              {sp.pattern.map((on, pi) => {
                const bx = startX + pi * (barW + gap);
                return (
                  <g key={pi}>
                    <rect
                      x={bx}
                      y={y + 30}
                      width={barW}
                      height={barH}
                      rx="3"
                      fill={on ? sp.color : '#0f172a'}
                      stroke={on ? sp.color : '#1e293b'}
                      strokeWidth="1"
                      opacity={on ? 0.8 : 0.4}
                    />
                    {on === 1 && (
                      <circle cx={bx + barW / 2} cy={y + 30 + barH / 2} r="10" fill={sp.color} opacity="0.08" />
                    )}
                  </g>
                );
              })}

              {/* Description */}
              <text x={startX} y={y + 75} className="fill-gray-500 dark:fill-slate-400" fontSize="9">{sp.desc}</text>

              {/* Divider */}
              {si < species.length - 1 && (
                <line x1="15" y1={y + 82} x2={w - 15} y2={y + 82} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
              )}
            </g>
          );
        })}

        {/* Bottom insight */}
        <rect x="40" y="340" width="440" height="12" rx="3" fill="none" />
        <rect x="40" y="310" width="440" height="40" rx="6" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x={w / 2} y="328" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Females only respond to their own species' code</text>
        <text x={w / 2} y="343" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Like Morse code — timing and rhythm carry the message, not brightness</text>
      </svg>
    </div>
  );
}
