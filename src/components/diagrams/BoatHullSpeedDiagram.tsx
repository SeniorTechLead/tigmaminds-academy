export default function BoatHullSpeedDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hull speed formula: maximum displacement speed depends on waterline length"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
          Hull Speed: Why Long Boats Are Faster
        </text>

        {/* Formula */}
        <g transform="translate(390, 75)">
          <rect x="-200" y="-20" width="400" height="45" rx="8" className="fill-cyan-50 dark:fill-cyan-950" opacity="0.6" />
          <text x="0" y="8" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-cyan-700 dark:fill-cyan-300">
            V{"\u2095"}{"\u1D64"}{"\u2097"}{"\u2097"} = 1.34 {"\u00D7"} {"\u221A"}L{"\u2098"}{"\u2090"}{"\u209C"}{"\u2091"}{"\u2097"}{"\u2097"}{"\u1D62"}{"\u2099"}{"\u2091"}
          </text>
        </g>
        <text x="390" y="110" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          V in knots, L in feet {"\u2014"} a boat makes a bow wave it cannot outrun
        </text>

        {/* Short boat with large bow wave */}
        <g transform="translate(200, 170)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Short, Wide Boat
          </text>
          {/* Hull */}
          <path d="M -60,30 Q -65,50 -50,55 L 50,55 Q 65,50 60,30 Z" fill="#6b7280" opacity="0.4" />
          <line x1="-55" y1="30" x2="55" y2="30" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,2" />
          <text x="0" y="26" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">L = 3m</text>
          {/* Bow wave - large */}
          <path d="M -65,45 Q -80,35 -90,45 Q -80,55 -65,45" fill="#3b82f6" opacity="0.3" />
          <path d="M -70,42 Q -85,30 -100,42" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          {/* Stern wave */}
          <path d="M 65,45 Q 80,55 90,45" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="0" y="75" textAnchor="middle" fontSize="11" className="fill-red-500 dark:fill-red-400">
            Hull speed: {"\u2248"} 4.2 knots
          </text>
          <text x="0" y="92" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Big bow wave wastes energy
          </text>
          {/* Wave stuck to boat */}
          <text x="-95" y="35" fontSize="10" className="fill-blue-500 dark:fill-blue-400">bow wave</text>
        </g>

        {/* Long boat with small bow wave */}
        <g transform="translate(570, 170)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Long, Narrow Boat (racing)
          </text>
          {/* Hull */}
          <path d="M -100,30 Q -105,45 -90,50 L 90,50 Q 105,45 100,30 Z" fill="#0891b2" opacity="0.4" />
          <line x1="-95" y1="30" x2="95" y2="30" stroke="#0891b2" strokeWidth="1" strokeDasharray="3,2" />
          <text x="0" y="26" textAnchor="middle" fontSize="10" className="fill-cyan-400 dark:fill-cyan-500">L = 10m</text>
          {/* Bow wave - small */}
          <path d="M -105,40 Q -112,36 -115,40" fill="none" stroke="#3b82f6" strokeWidth="1" />
          <text x="0" y="68" textAnchor="middle" fontSize="11" className="fill-emerald-500 dark:fill-emerald-400">
            Hull speed: {"\u2248"} 7.7 knots
          </text>
          <text x="0" y="85" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Longer waterline = higher max speed
          </text>
        </g>

        {/* Why explanation */}
        <g transform="translate(390, 310)">
          <rect x="-330" y="0" width="660" height="70" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Why? A boat creates a wave as long as itself
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            At hull speed, the bow wave wavelength = boat length. The boat is trapped in its own wave trough.
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Longer boat {"\u2192"} longer wave {"\u2192"} faster wave speed {"\u2192"} higher hull speed limit
          </text>
        </g>

        <text x="390" y="405" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Majuli{"\u2019"}s racing boats are long and narrow for maximum hull speed on the Brahmaputra
        </text>
      </svg>
    </div>
  );
}
