export default function PythonPitOrganDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Python pit organs: infrared heat sensors that detect warm-blooded prey in total darkness"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Pit Organs: How Pythons See Heat
        </text>

        {/* Snake head with pit organ location */}
        <g transform="translate(220, 130)">
          {/* Head outline */}
          <path d="M -60,0 Q -80,-30 -60,-50 Q -20,-65 30,-55 Q 70,-40 80,-15 Q 85,10 70,30 Q 30,45 -20,40 Q -60,30 -60,0 Z"
            fill="#65a30d" opacity="0.3" stroke="#4d7c0f" strokeWidth="2" />
          {/* Scales pattern */}
          {[[-40, -20], [-20, -35], [0, -40], [20, -35], [40, -25], [-30, 0], [-10, 10], [10, 5], [30, 0], [50, -5]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill="none" stroke="#4d7c0f" strokeWidth="0.5" opacity="0.4" />
          ))}

          {/* Eye */}
          <ellipse cx="30" cy="-30" rx="8" ry="10" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          <ellipse cx="30" cy="-30" rx="2" ry="9" fill="#1e3a5f" />
          <text x="50" y="-35" fontSize="10" className="fill-gray-500 dark:fill-slate-400">eye</text>

          {/* Nostril */}
          <circle cx="65" cy="-8" r="3" fill="#1e3a5f" opacity="0.5" />
          <text x="78" y="-4" fontSize="10" className="fill-gray-500 dark:fill-slate-400">nostril</text>

          {/* PIT ORGAN - highlighted */}
          <g>
            <circle cx="48" cy="-18" r="5" fill="#ef4444" opacity="0.5" />
            <circle cx="48" cy="-18" r="8" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="56" y1="-18" x2="120" y2="-18" stroke="#ef4444" strokeWidth="1.5" />
            <text x="125" y="-22" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">Pit Organ</text>
            <text x="125" y="-8" fontSize="10" className="fill-red-400 dark:fill-red-400">infrared sensor</text>
          </g>

          {/* Tongue */}
          <path d="M 80,-12 L 105,-20 M 80,-12 L 105,-4" stroke="#ef4444" strokeWidth="1" />
          <line x1="70" y1="-12" x2="80" y2="-12" stroke="#ef4444" strokeWidth="1.5" />
          <text x="115" y="-12" fontSize="9" className="fill-gray-500 dark:fill-slate-400">tongue</text>
          <text x="115" y="-2" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(chemical sensor)</text>
        </g>

        {/* Pit organ cross-section */}
        <g transform="translate(570, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Pit Organ Cross-Section
          </text>
          {/* Pit cavity */}
          <path d="M -30,20 L -30,70 Q 0,80 30,70 L 30,20" fill="none" stroke="#6b7280" strokeWidth="2" />
          {/* Membrane */}
          <line x1="-25" y1="45" x2="25" y2="45" stroke="#ef4444" strokeWidth="2" />
          <text x="40" y="48" fontSize="10" className="fill-red-500 dark:fill-red-400">membrane</text>
          <text x="40" y="60" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(thermoreceptors)</text>
          {/* IR waves entering */}
          <path d="M 0,-10 Q -5,5 0,20" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M -15,-5 Q -12,8 -10,20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
          <path d="M 15,-5 Q 12,8 10,20" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
          <text x="0" y="-15" textAnchor="middle" fontSize="10" className="fill-amber-500 dark:fill-amber-400">infrared radiation</text>
          {/* Nerve */}
          <path d="M 0,80 Q 5,100 0,120" stroke="#a78bfa" strokeWidth="2" />
          <text x="15" y="110" fontSize="10" className="fill-purple-500 dark:fill-purple-400">to brain</text>
        </g>

        {/* Thermal image view */}
        <g transform="translate(390, 240)">
          <rect x="-330" y="0" width="660" height="65" rx="8" className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
            What Pythons {"\u201C"}See{"\u201D"} with Pit Organs
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Resolution: {"\u223C"}0.003{"\u00B0"}C temperature difference {"\u2014"} detects a mouse at 1 meter in total darkness
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            The brain merges IR data with visual data to create a {"\u201C"}thermal image{"\u201D"} of the world
          </text>
        </g>

        {/* Constriction mechanics brief */}
        <g transform="translate(390, 320)">
          <rect x="-330" y="0" width="660" height="65" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Constriction: Not Crushing, But Stopping Blood Flow
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Pythons don{"\u2019"}t crush bones {"\u2014"} they squeeze just enough to stop the heart from pumping blood
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            They can sense the prey{"\u2019"}s heartbeat through their coils and tighten with each exhale
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Pit organs give pythons a thermal sixth sense {"\u2014"} they literally see the heat your body emits
        </text>
      </svg>
    </div>
  );
}
