export default function MountainBodyAdaptDiagram() {
  const left = 60;
  const right = 550;
  const top = 60;
  const bottom = 240;
  const timelineY = (bottom + top) / 2;

  const milestones = [
    { day: 1, label: "Breathing rate\nincreases", color: "fill-blue-400", x: 0 },
    { day: 3, label: "More red blood\ncells produced", color: "fill-amber-400", x: 0 },
    { day: 7, label: "Hemoglobin\nlevels rise", color: "fill-orange-400", x: 0 },
    { day: 14, label: "Fully\nacclimatized", color: "fill-green-400", x: 0 },
  ];

  /* Compute x positions */
  const dayToX = (d: number) => left + (d / 14) * (right - left);
  milestones.forEach(m => { m.x = dayToX(m.day); });

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 388"
        className="w-full"
        role="img"
        aria-label="Acclimatization timeline showing body adaptations from day 1 to day 14 at high altitude"
      >
        <rect x="0" y="0" width="600" height="370" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Acclimatization Timeline
        </text>
        <text x="300" y="44" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
          How your body adapts to high altitude over 14 days
        </text>

        {/* Timeline axis */}
        <defs>
          <marker id="timeArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
        <line
          x1={left - 10}
          y1={timelineY}
          x2={right + 20}
          y2={timelineY}
          className="stroke-gray-500"
          strokeWidth="2"
          markerEnd="url(#timeArr)"
        />

        {/* Day markers */}
        {[0, 1, 3, 5, 7, 10, 14].map((d, i) => (
          <g key={i}>
            <line
              x1={dayToX(d)}
              y1={timelineY - 4}
              x2={dayToX(d)}
              y2={timelineY + 4}
              className="stroke-gray-400"
              strokeWidth="1"
            />
            <text
              x={dayToX(d)}
              y={timelineY + 16}
              textAnchor="middle"
              fontSize="8"
              className="fill-gray-500 dark:fill-gray-400"
            >
              Day {d}
            </text>
          </g>
        ))}

        {/* Progress bar gradient */}
        <defs>
          <linearGradient id="adaptGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect x={left} y={timelineY - 3} width={right - left} height="6" rx="3" fill="url(#adaptGrad)" />

        {/* Milestones */}
        {milestones.map((m, i) => {
          const above = i % 2 === 0;
          const textY = above ? timelineY - 50 : timelineY + 35;
          return (
            <g key={i}>
              {/* Connector line */}
              <line
                x1={m.x}
                y1={timelineY}
                x2={m.x}
                y2={above ? timelineY - 28 : timelineY + 28}
                className="stroke-gray-500"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              {/* Circle marker */}
              <circle cx={m.x} cy={timelineY} r="6" className={m.color} />
              <text
                x={m.x}
                y={timelineY + 3}
                textAnchor="middle"
                fontSize="7"
                className="fill-white dark:fill-slate-900"
                fontWeight="800"
              >
                {m.day}
              </text>
              {/* Label — split lines */}
              {m.label.split("\n").map((line, li) => (
                <text
                  key={li}
                  x={m.x}
                  y={textY + li * 12}
                  textAnchor="middle"
                  fontSize="9"
                  className="fill-gray-200"
                  fontWeight="600"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* Icons for each milestone */}
        {/* Lungs for breathing */}
        <g transform={`translate(${milestones[0].x}, ${timelineY - 75})`}>
          <ellipse cx="-5" cy="0" rx="5" ry="8" className="fill-blue-400/50" />
          <ellipse cx="5" cy="0" rx="5" ry="8" className="fill-blue-400/50" />
          <rect x="-1" y="-10" width="2" height="5" rx="1" className="fill-blue-400/50" />
        </g>

        {/* Blood cell for red blood cells */}
        <g transform={`translate(${milestones[1].x}, ${timelineY + 65})`}>
          <circle cx="0" cy="0" r="7" className="fill-red-500/50" />
          <circle cx="0" cy="0" r="3" className="fill-red-700/50" />
        </g>

        {/* Hemoglobin molecule (simplified) */}
        <g transform={`translate(${milestones[2].x}, ${timelineY - 78})`}>
          <circle cx="-5" cy="-3" r="4" className="fill-orange-400/50" />
          <circle cx="5" cy="-3" r="4" className="fill-orange-400/50" />
          <circle cx="-5" cy="5" r="4" className="fill-orange-400/50" />
          <circle cx="5" cy="5" r="4" className="fill-orange-400/50" />
        </g>

        {/* Checkmark for fully adapted */}
        <g transform={`translate(${milestones[3].x}, ${timelineY + 62})`}>
          <circle cx="0" cy="0" r="9" className="fill-green-900/60 stroke-green-400" strokeWidth="1.5" />
          <path d="M-4,0 L-1,4 L5,-4" fill="none" className="stroke-green-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Snow leopard comparison */}
        <rect x="40" y="280" width="520" height="70" rx="6" className="fill-gray-800/60" />

        {/* Snow leopard silhouette */}
        <g transform="translate(85, 315)">
          <ellipse cx="0" cy="0" rx="16" ry="8" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="18" cy="-5" r="7" className="fill-gray-500 dark:fill-gray-400" />
          <path d="M-16,0 Q-30,10 -34,-3" className="stroke-gray-400" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="15" cy="-12" r="2.5" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="22" cy="-10" r="2.5" className="fill-gray-500 dark:fill-gray-400" />
        </g>

        <text x="125" y="300" fontSize="10" className="fill-gray-200" fontWeight="700">
          Snow Leopard — Already Adapted
        </text>
        <text x="125" y="314" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          Larger lungs for more air per breath
        </text>
        <text x="125" y="326" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          Higher hemoglobin for efficient O₂ transport
        </text>
        <text x="125" y="338" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          Evolved over millions of years — no acclimatization needed
        </text>
      </svg>
    </div>
  );
}
