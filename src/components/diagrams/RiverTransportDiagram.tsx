export default function RiverTransportDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 370"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing sediment transport: traction, saltation, suspension, and solution, plus deposition when river slows"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes bounce-rock {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .saltation { animation: bounce-rock 0.8s ease-in-out infinite; }
          @keyframes drift {
            0% { transform: translateX(0); }
            100% { transform: translateX(10px); }
          }
          .suspend { animation: drift 1.5s ease-in-out infinite alternate; }
        `}</style>

        <rect width="640" height="370" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          River Transportation and Deposition
        </text>

        {/* Water body - fast section */}
        <rect x="20" y="80" width="600" height="130" rx="4" fill="#0ea5e9" opacity="0.15" />
        <text x="320" y="72" textAnchor="middle" className="sm fill-blue-600 dark:fill-blue-400">Water flow →</text>

        {/* Flow arrows */}
        <defs>
          <marker id="flow-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5 Z" fill="#0284c7" />
          </marker>
        </defs>
        {[140, 300, 460].map((x) => (
          <line key={x} x1={x} y1="90" x2={x + 50} y2="90" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#flow-arrow)" />
        ))}

        {/* Riverbed */}
        <rect x="20" y="210" width="600" height="12" rx="2" fill="#78716c" />
        <text x="30" y="240" className="sm fill-gray-500 dark:fill-slate-400">Riverbed</text>

        {/* 1. TRACTION - large boulder rolling along bed */}
        <g transform="translate(60, 190)">
          <circle cx="0" cy="0" r="12" fill="#a8a29e" stroke="#78716c" strokeWidth="1.5" />
          <line x1="-8" y1="12" x2="8" y2="12" stroke="#78716c" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="-18" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Traction</text>
          <text x="0" y="35" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Boulders roll</text>
          <text x="0" y="46" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">along bed</text>
        </g>

        {/* 2. SALTATION - pebbles bouncing */}
        <g transform="translate(200, 170)">
          <g className="saltation">
            <circle cx="0" cy="0" r="6" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
          </g>
          <path d="M-20,20 Q-10,0 0,20 Q10,0 20,20" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="0" y="-18" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Saltation</text>
          <text x="0" y="42" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Pebbles bounce</text>
        </g>

        {/* 3. SUSPENSION - fine particles floating */}
        <g transform="translate(340, 130)">
          <g className="suspend">
            <circle cx="-8" cy="0" r="2" fill="#a8a29e" opacity="0.8" />
            <circle cx="5" cy="-6" r="1.5" fill="#a8a29e" opacity="0.7" />
            <circle cx="12" cy="4" r="2.5" fill="#a8a29e" opacity="0.6" />
            <circle cx="-3" cy="8" r="1.8" fill="#a8a29e" opacity="0.7" />
            <circle cx="18" cy="-2" r="1.5" fill="#a8a29e" opacity="0.5" />
          </g>
          <text x="5" y="-22" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Suspension</text>
          <text x="5" y="30" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Silt and sand</text>
          <text x="5" y="41" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">carried in water</text>
        </g>

        {/* 4. SOLUTION - dissolved minerals (invisible) */}
        <g transform="translate(500, 120)">
          <rect x="-30" y="-10" width="60" height="24" rx="4" fill="#0ea5e9" opacity="0.25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
          <text x="0" y="4" textAnchor="middle" className="sm fill-blue-600 dark:fill-blue-400">Dissolved</text>
          <text x="0" y="-22" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Solution</text>
          <text x="0" y="30" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Minerals invisible</text>
          <text x="0" y="41" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">in water</text>
        </g>

        {/* DEPOSITION section */}
        <line x1="20" y1="275" x2="620" y2="275" stroke="#e5e7eb" strokeWidth="0.5" className="stroke-gray-200 dark:stroke-slate-700" />
        <text x="320" y="295" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">
          Deposition: When the River Slows Down
        </text>

        {/* Deposition illustration - gradient from large to small particles */}
        <g transform="translate(60, 310)">
          {/* Fast to slow gradient bar */}
          <rect x="0" y="0" width="520" height="8" rx="4" fill="url(#speed-grad)" />
          <defs>
            <linearGradient id="speed-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <text x="0" y="-4" className="sm fill-blue-600 dark:fill-blue-400">Fast</text>
          <text x="510" y="-4" textAnchor="end" className="sm fill-blue-600 dark:fill-blue-400">Slow</text>

          {/* Deposited particles: large first, then smaller */}
          <circle cx="80" cy="24" r="10" fill="#78716c" />
          <text x="80" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Boulders</text>
          <circle cx="200" cy="26" r="6" fill="#a8a29e" />
          <text x="200" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Gravel</text>
          <circle cx="320" cy="28" r="4" fill="#d6d3d1" />
          <text x="320" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Sand</text>
          <circle cx="440" cy="29" r="2" fill="#e5e7eb" />
          <text x="440" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Silt/clay</text>
        </g>
      </svg>
    </div>
  );
}
