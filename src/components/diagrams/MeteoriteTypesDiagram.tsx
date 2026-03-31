export default function MeteoriteTypesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three types of meteorites: iron, stony, and stony-iron, with composition and what they reveal about the solar system"
      >
        <defs>
          <linearGradient id="mt-iron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
          <linearGradient id="mt-stony" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>
          <linearGradient id="mt-stonyiron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#9ca3af" />
            <stop offset="60%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <radialGradient id="mt-olivine" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#65a30d" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="780" height="600" rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-amber-300">
          From Space Rock to Treasure: Meteorite Types
        </text>
        <text x="390" y="56" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Each type reveals a different part of the solar system\u2019s history
        </text>

        {/* --- Iron Meteorite --- */}
        <g transform="translate(130, 130)">
          {/* Cross-section */}
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="url(#mt-iron)" />
          {/* Widmanst\u00E4tten pattern lines */}
          {[[-40,-30,20,35],[-55,10,40,-25],[15,-50,-30,40],[-20,-55,30,20],[35,-10,-40,30],[-50,-20,45,5]].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth="0.8" opacity="0.5" />
          ))}
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="none" stroke="#9ca3af" strokeWidth="2" />
          <text x="0" y="95" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Iron Meteorite</text>
          <text x="0" y="112" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">~5% of finds</text>
        </g>

        {/* Iron details */}
        <g transform="translate(130, 270)">
          <rect x="-110" y="0" width="220" height="115" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#9ca3af" strokeWidth="0.8" />
          <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Composition</text>
          <text x="0" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">90\u201395% iron, 5\u201310% nickel</text>
          <text x="0" y="56" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Signature</text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Widmanst\u00E4tten pattern (crystal</text>
          <text x="0" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">lattice that took millions of yrs)</text>
          <text x="0" y="105" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">Origin: core of a destroyed protoplanet</text>
        </g>

        {/* --- Stony Meteorite --- */}
        <g transform="translate(390, 130)">
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="url(#mt-stony)" />
          {/* Chondrules (round grains) */}
          {[[-30,-20],[15,-35],[35,10],[-20,25],[0,-5],[25,-15],[-40,5],[10,30],[-10,-40],[40,-25],[-25,40],[30,35]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r={4 + (i % 3)} fill="#d97706" opacity="0.4" stroke="#92400e" strokeWidth="0.5" />
          ))}
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="none" stroke="#a16207" strokeWidth="2" />
          <text x="0" y="95" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Stony Meteorite</text>
          <text x="0" y="112" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">~94% of finds</text>
        </g>

        {/* Stony details */}
        <g transform="translate(390, 270)">
          <rect x="-110" y="0" width="220" height="115" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#a16207" strokeWidth="0.8" />
          <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Composition</text>
          <text x="0" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Silicate minerals (olivine, pyroxene)</text>
          <text x="0" y="56" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Signature</text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Chondrules: tiny round grains from</text>
          <text x="0" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">the birth of the solar system (4.6 Gyr)</text>
          <text x="0" y="105" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">Origin: the original building blocks of planets</text>
        </g>

        {/* --- Stony-Iron Meteorite --- */}
        <g transform="translate(650, 130)">
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="url(#mt-stonyiron)" />
          {/* Olivine crystals embedded in metal */}
          {[[-25,-15],[15,-30],[30,15],[-15,30],[0,0],[20,-5],[-35,10],[10,25],[-10,-35]].map(([x,y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={6 + (i % 3)} ry={5 + (i % 2) * 2} fill="url(#mt-olivine)" stroke="#4d7c0f" strokeWidth="0.5" />
          ))}
          <ellipse cx="0" cy="0" rx="75" ry="70" fill="none" stroke="#6b7280" strokeWidth="2" />
          <text x="0" y="95" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Stony-Iron</text>
          <text x="0" y="112" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">~1% of finds</text>
        </g>

        {/* Stony-iron details */}
        <g transform="translate(650, 270)">
          <rect x="-110" y="0" width="220" height="115" rx="6" className="fill-gray-50 dark:fill-slate-900" stroke="#6b7280" strokeWidth="0.8" />
          <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Composition</text>
          <text x="0" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">~50% iron-nickel, ~50% silicate</text>
          <text x="0" y="56" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Signature</text>
          <text x="0" y="72" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Pallasites: green olivine crystals</text>
          <text x="0" y="85" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">suspended in iron-nickel matrix</text>
          <text x="0" y="105" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">Origin: core\u2013mantle boundary of protoplanet</text>
        </g>

        {/* Solar system connection */}
        <rect x="40" y="410" width="700" height="60" rx="8" className="fill-indigo-50 dark:fill-indigo-950" stroke="#818cf8" strokeWidth="1" />
        <text x="390" y="432" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">
          Why meteorites matter: They are time capsules from 4.6 billion years ago
        </text>
        <text x="390" y="450" textAnchor="middle" fontSize="11" className="fill-indigo-600 dark:fill-indigo-400">
          Iron \u2192 tells us about planetary cores | Stony \u2192 pristine solar nebula material | Stony-iron \u2192 boundary layers
        </text>
        <text x="390" y="464" textAnchor="middle" fontSize="11" className="fill-indigo-600 dark:fill-indigo-400">
          Together, they reveal how rocky planets like Earth formed and differentiated into layers.
        </text>

        {/* Fun fact */}
        <rect x="40" y="490" width="700" height="90" rx="8" className="fill-amber-50 dark:fill-amber-950/40" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="512" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          Check Yourself
        </text>
        <text x="390" y="530" textAnchor="middle" fontSize="11" className="fill-amber-700 dark:fill-amber-400">
          If you found a heavy, metallic rock in a field with a strange criss-cross crystal pattern inside,
        </text>
        <text x="390" y="546" textAnchor="middle" fontSize="11" className="fill-amber-700 dark:fill-amber-400">
          what type of meteorite would it be? What part of a destroyed protoplanet did it come from?
        </text>
        <text x="390" y="566" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-500">
          Answer: Iron meteorite with Widmanst\u00E4tten pattern \u2014 from the metal core of a body that formed and broke apart billions of years ago.
        </text>
      </svg>
    </div>
  );
}
