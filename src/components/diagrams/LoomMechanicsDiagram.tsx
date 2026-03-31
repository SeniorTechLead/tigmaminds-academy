export default function LoomMechanicsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Side-view diagram of a backstrap loom showing how heddle lifts warp threads to create a shed for the shuttle"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          How a Loom Works: The 3-Step Cycle
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Every row of weaving follows: shed {'\u2192'} shuttle {'\u2192'} beat
        </text>

        {/* Step 1: Shed */}
        <rect x="30" y="75" width="230" height="270" rx="10" className="fill-white dark:fill-slate-900" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="55" cy="100" r="14" fill="#6366f1" fillOpacity="0.2" />
        <text x="55" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6366f1">1</text>
        <text x="78" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Open the shed</text>

        {/* Warp threads - some up, some down */}
        <g transform="translate(45, 130)">
          {/* Upper threads */}
          {[0, 2, 4, 6, 8].map(i => (
            <line key={`u${i}`} x1={20 + i * 20} y1="0" x2={20 + i * 20} y2="70" stroke="#6366f1" strokeWidth="2" />
          ))}
          {/* Lower threads */}
          {[1, 3, 5, 7, 9].map(i => (
            <line key={`d${i}`} x1={20 + i * 20} y1="30" x2={20 + i * 20} y2="100" stroke="#6366f1" strokeWidth="2" opacity="0.5" />
          ))}
          {/* Shed opening - V shape */}
          <path d="M10,0 L105,35 L200,0" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
          <path d="M10,100 L105,65 L200,100" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
          <text x="105" y="55" textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="600">
            {'\u2190'} shed {'\u2192'}
          </text>
          {/* Heddle bar */}
          <rect x="5" y="-8" width="200" height="6" rx="2" fill="#8b6914" />
          <text x="105" y="-14" textAnchor="middle" fontSize="10" fill="#a16207">heddle bar (lifts odd threads)</text>
        </g>
        <text x="145" y="260" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The heddle lifts every other
        </text>
        <text x="145" y="274" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          warp thread, creating a gap
        </text>
        <text x="145" y="288" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          (the "shed") for the shuttle
        </text>

        {/* Step 2: Shuttle */}
        <rect x="280" y="75" width="220" height="270" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="305" cy="100" r="14" fill="#f59e0b" fillOpacity="0.2" />
        <text x="305" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">2</text>
        <text x="328" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Pass the shuttle</text>

        <g transform="translate(295, 130)">
          {/* Warp threads with shed */}
          {[0, 2, 4, 6, 8].map(i => (
            <line key={`u${i}`} x1={15 + i * 18} y1="0" x2={15 + i * 18} y2="55" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
          ))}
          {[1, 3, 5, 7, 9].map(i => (
            <line key={`d${i}`} x1={15 + i * 18} y1="45" x2={15 + i * 18} y2="100" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
          ))}
          {/* Shuttle moving through */}
          <rect x="30" y="32" width="50" height="14" rx="6" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />
          {/* Weft trail */}
          <line x1="0" y1="39" x2="30" y2="39" stroke="#f59e0b" strokeWidth="2" />
          {/* Arrow */}
          <path d="M85,39 L105,39" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#loom-arrow)" />
        </g>
        <text x="390" y="260" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The shuttle carries the weft
        </text>
        <text x="390" y="274" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          thread through the shed from
        </text>
        <text x="390" y="288" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          one side to the other
        </text>

        {/* Step 3: Beat */}
        <rect x="520" y="75" width="230" height="270" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="545" cy="100" r="14" fill="#22c55e" fillOpacity="0.2" />
        <text x="545" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">3</text>
        <text x="568" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Beat the weft tight</text>

        <g transform="translate(535, 130)">
          {/* Tight weave */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <line key={`w${i}`} x1={10 + i * 18} y1="0" x2={10 + i * 18} y2="100" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`r${i}`} x1="0" y1={60 + i * 8} x2="190" y2={60 + i * 8} stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
          ))}
          {/* Beater bar */}
          <rect x="-5" y="50" width="200" height="8" rx="2" fill="#a16207" />
          <path d="M95,45 L95,25" stroke="#a16207" strokeWidth="1.5" markerEnd="url(#loom-arrow2)" />
          <text x="95" y="20" textAnchor="middle" fontSize="10" fill="#a16207">push!</text>
        </g>
        <text x="635" y="260" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The beater pushes the new
        </text>
        <text x="635" y="274" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          weft row tightly against the
        </text>
        <text x="635" y="288" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          previous ones {'\u2192'} dense fabric
        </text>

        {/* Cycle arrow */}
        <rect x="100" y="370" width="580" height="90" rx="10" fill="#6366f1" fillOpacity="0.05" stroke="#6366f1" strokeWidth="1" />
        <text x="390" y="395" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6366f1">
          Then switch which threads are up/down and repeat!
        </text>
        <text x="390" y="415" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Row 1: odd threads up, even down. Row 2: even threads up, odd down.
        </text>
        <text x="390" y="435" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          This alternating pattern is called plain weave {'\u2014'} the simplest and strongest weave structure.
        </text>
        <text x="390" y="452" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6366f1">
          A skilled Tawang weaver repeats this cycle ~5,000 times for one shawl
        </text>

        <defs>
          <marker id="loom-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
          <marker id="loom-arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#a16207" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
