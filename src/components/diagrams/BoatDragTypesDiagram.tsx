export default function BoatDragTypesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three types of drag on boats: friction drag, form drag, and wave drag"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
          Three Types of Drag on a Boat
        </text>

        {/* Friction drag */}
        <g transform="translate(140, 70)">
          <rect x="-110" y="0" width="220" height="140" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
            Friction Drag
          </text>
          {/* Hull bottom with water molecules */}
          <line x1="-80" y1="55" x2="80" y2="55" stroke="#0891b2" strokeWidth="3" />
          <text x="90" y="58" fontSize="10" className="fill-cyan-500 dark:fill-cyan-400">hull</text>
          {/* Water molecules clinging */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <circle cx={-70 + i * 20} cy={65} r="4" fill="#3b82f6" opacity={0.6 - i * 0.05} />
              <circle cx={-70 + i * 20} cy={78} r="4" fill="#3b82f6" opacity={0.3} />
            </g>
          ))}
          <text x="0" y="100" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
            Water clings to hull surface
          </text>
          <text x="0" y="115" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">
            Depends on: wetted area + roughness
          </text>
          <text x="0" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Fix: oil the hull, reduce draft
          </text>
        </g>

        {/* Form drag */}
        <g transform="translate(390, 70)">
          <rect x="-110" y="0" width="220" height="140" rx="8" className="fill-amber-50 dark:fill-amber-950" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
            Form Drag
          </text>
          {/* Blunt bow pushing water */}
          <g transform="translate(-30, 60)">
            <path d="M 0,0 L 40,0 L 40,30 L 0,30 Z" fill="#f59e0b" opacity="0.3" />
            {/* Water being pushed */}
            <path d="M -5,5 Q -15,15 -5,25" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <path d="M -10,8 Q -22,15 -10,22" fill="none" stroke="#3b82f6" strokeWidth="1" />
            <text x="20" y="-5" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">blunt bow</text>
          </g>
          {/* Pointed bow */}
          <g transform="translate(40, 60)">
            <path d="M 30,0 L 0,15 L 30,30 Z" fill="#22c55e" opacity="0.3" />
            <text x="15" y="-5" textAnchor="middle" fontSize="10" className="fill-green-500 dark:fill-green-400">pointed bow</text>
          </g>
          <text x="0" y="108" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
            Energy spent pushing water aside
          </text>
          <text x="0" y="123" textAnchor="middle" fontSize="10" className="fill-amber-500 dark:fill-amber-400">
            Fix: pointed bow, streamlined shape
          </text>
        </g>

        {/* Wave drag */}
        <g transform="translate(640, 70)">
          <rect x="-110" y="0" width="220" height="140" rx="8" className="fill-purple-50 dark:fill-purple-950" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
            Wave Drag
          </text>
          {/* Boat with waves */}
          <path d="M -60,65 L -40,60 L 40,60 L 60,65 Z" fill="#6b7280" opacity="0.4" />
          {/* Bow wave */}
          <path d="M -65,68 Q -80,58 -95,68 Q -80,78 -65,68" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          {/* Wake waves */}
          <path d="M 65,68 Q 80,60 95,68" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <path d="M 75,75 Q 90,67 105,75" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.6" />
          <text x="0" y="100" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
            Energy lost creating waves
          </text>
          <text x="0" y="115" textAnchor="middle" fontSize="10" className="fill-purple-500 dark:fill-purple-400">
            Grows with speed{"\u00B2"} (dominant at high speed)
          </text>
          <text x="0" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Fix: longer hull, lighter weight
          </text>
        </g>

        {/* Speed vs drag graph */}
        <g transform="translate(390, 240)">
          <rect x="-330" y="0" width="660" height="140" rx="8" className="fill-slate-50 dark:fill-slate-900" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Total Drag = Friction + Form + Wave (drag {"\u221D"} speed{"\u00B2"})
          </text>

          {/* Mini graph */}
          <g transform="translate(-120, 40)">
            <line x1="0" y1="80" x2="250" y2="80" stroke="#6b7280" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="80" stroke="#6b7280" strokeWidth="1" />
            <text x="125" y="98" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Speed</text>
            <text x="-15" y="40" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, -15, 40)">Drag</text>
            {/* Friction drag - linear-ish */}
            <path d="M 0,75 Q 80,68 250,45" fill="none" stroke="#3b82f6" strokeWidth="2" />
            {/* Wave drag - exponential */}
            <path d="M 0,78 Q 120,76 200,50 Q 240,20 250,5" fill="none" stroke="#a78bfa" strokeWidth="2" />
            {/* Total */}
            <path d="M 0,73 Q 100,62 180,35 Q 220,10 250,-10" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <text x="260" y="48" fontSize="10" className="fill-blue-500 dark:fill-blue-400">friction</text>
            <text x="260" y="8" fontSize="10" className="fill-purple-500 dark:fill-purple-400">wave</text>
            <text x="260" y="-8" fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">total</text>
          </g>
          <text x="110" y="125" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Doubling speed = 4{"\u00D7"} the rowing effort
          </text>
        </g>

        <text x="390" y="405" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Jonaki{"\u2019"}s steady pace beat brute-force sprinting because drag grows with the square of speed
        </text>
      </svg>
    </div>
  );
}
