export default function PeacockSexualSelectionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Sexual selection: peahens choose males with larger tails, creating a runaway feedback loop"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Sexual Selection: Darwin's Other Big Idea
        </text>

        {/* Natural Selection vs Sexual Selection comparison */}
        <rect x="40" y="60" width="280" height="120" rx="10" className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="180" y="84" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Natural Selection</text>
        <text x="180" y="104" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">Traits that help SURVIVE</text>
        <text x="180" y="122" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">Sharp claws, camouflage,</text>
        <text x="180" y="138" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">fast running, disease resistance</text>
        <text x="180" y="164" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">→ Practical traits win</text>

        <rect x="380" y="60" width="280" height="120" rx="10" className="fill-purple-50 dark:fill-purple-950/30 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1.5" />
        <text x="520" y="84" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">Sexual Selection</text>
        <text x="520" y="104" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">Traits that help REPRODUCE</text>
        <text x="520" y="122" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">Bright colors, long tails,</text>
        <text x="520" y="138" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">loud songs, elaborate dances</text>
        <text x="520" y="164" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">→ Attractive traits win</text>

        {/* Runaway feedback loop */}
        <text x="350" y="210" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          The Runaway Feedback Loop
        </text>

        {/* Circular loop */}
        <ellipse cx="350" cy="340" rx="200" ry="90" fill="none" className="stroke-indigo-300 dark:stroke-indigo-700" strokeWidth="1" strokeDasharray="6 4" />

        {/* Loop steps */}
        {[
          { x: 150, y: 280, label: 'Peahens prefer\nbigger tails', icon: '\u2640' },
          { x: 350, y: 240, label: 'Big-tailed males\nget more mates', icon: '\u2665' },
          { x: 550, y: 280, label: 'Sons inherit\nbig tails', icon: '\ud83e\uddec' },
          { x: 550, y: 400, label: 'Daughters inherit\npreference for big tails', icon: '\ud83e\uddec' },
          { x: 350, y: 430, label: 'Next generation:\neven bigger tails preferred', icon: '\u2191' },
          { x: 150, y: 400, label: 'Tails grow more\nextravagant each gen', icon: '\ud83e\udda2' },
        ].map(({ x, y, label, icon }, i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="30" className="fill-indigo-50 dark:fill-indigo-950/40 stroke-indigo-400 dark:stroke-indigo-600" strokeWidth="1.5" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="14">{icon}</text>
            {label.split('\n').map((line, li) => (
              <text key={li} x={x} y={y + 42 + li * 13} textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Arrows between steps */}
        <defs>
          <marker id="arrow-indigo-ps" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#818cf8" />
          </marker>
        </defs>
        {[
          [180, 275, 320, 250],
          [380, 245, 520, 270],
          [555, 310, 555, 370],
          [520, 410, 380, 425],
          [320, 425, 180, 410],
          [150, 370, 150, 310],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#arrow-indigo-ps)" />
        ))}
      </svg>
    </div>
  );
}
