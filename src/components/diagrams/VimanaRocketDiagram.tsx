export default function VimanaRocketDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 520 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Rocket showing thrust, exhaust, and the concept of escape velocity"
      >
        <defs>
          <marker id="vr-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="vr-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="vr-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <linearGradient id="vr-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="520" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Rocket Propulsion and Escape Velocity
        </text>

        {/* --- LEFT SIDE: Rocket diagram --- */}

        {/* Rocket body */}
        <rect x="135" y="100" width="60" height="160" rx="4"
          className="fill-slate-200 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        {/* Nose cone */}
        <path d="M 135,100 L 165,55 L 195,100 Z"
          className="fill-red-400 dark:fill-red-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        {/* Window */}
        <circle cx="165" cy="140" r="12"
          className="fill-sky-200 dark:fill-sky-700 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1" />
        {/* Fins */}
        <path d="M 135,240 L 115,280 L 135,265 Z"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
        <path d="M 195,240 L 215,280 L 195,265 Z"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />

        {/* Nozzle */}
        <path d="M 140,260 L 130,285 L 200,285 L 190,260 Z"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-600" strokeWidth="1.5" />

        {/* Exhaust flame */}
        <ellipse cx="165" cy="315" rx="25" ry="40" fill="url(#vr-flame)" opacity="0.8" />
        <ellipse cx="165" cy="325" rx="15" ry="28" fill="#facc15" opacity="0.6" />

        {/* Exhaust label */}
        <line x1="210" y1="320" x2="250" y2="340"
          className="stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
        <text x="255" y="345" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-red-500 dark:fill-red-400">
          Exhaust gas
        </text>
        <text x="255" y="358" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-400">
          (pushed down)
        </text>

        {/* Thrust arrow (up) */}
        <line x1="165" y1="90" x2="165" y2="42"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="3"
          markerEnd="url(#vr-arrow-green)" />
        <text x="205" y="52" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-green-600 dark:fill-green-300">THRUST</text>
        <text x="205" y="65" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">(reaction force up)</text>

        {/* Newton 3rd law annotation */}
        <rect x="30" y="165" width="95" height="55" rx="5"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1" />
        <text x="77" y="182" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">Newton’s 3rd</text>
        <text x="77" y="196" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">Every action has</text>
        <text x="77" y="210" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">an equal, opposite</text>
        <text x="77" y="224" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">reaction</text>

        {/* --- RIGHT SIDE: Escape velocity diagram --- */}

        {/* Earth */}
        <circle cx="400" cy="350" r="50"
          className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="400" y="354" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-700 dark:fill-blue-200">Earth</text>

        {/* Gravity arrow */}
        <line x1="400" y1="295" x2="400" y2="270"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2"
          markerEnd="url(#vr-arrow-red)" />
        <text x="400" y="263" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-400">g = 9.8 m/s²</text>

        {/* Trajectory paths */}
        {/* Too slow - falls back */}
        <path d="M 375,298 Q 340,200 365,300" fill="none"
          className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" strokeDasharray="4,3"
          markerEnd="url(#vr-arrow-amber)" />
        <text x="320" y="240" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-500 dark:fill-amber-400">Too slow:</text>
        <text x="320" y="253" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-500 dark:fill-amber-400">falls back</text>

        {/* Fast enough - orbit */}
        <ellipse cx="400" cy="240" rx="65" ry="108" fill="none"
          className="stroke-green-400 dark:stroke-green-500" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="475" y="200" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-500 dark:fill-green-400">Orbital</text>
        <text x="475" y="213" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-500 dark:fill-green-400">7.9 km/s</text>

        {/* Escape velocity - flies away */}
        <line x1="408" y1="298" x2="440" y2="60"
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" strokeDasharray="5,3" />
        <text x="448" y="85" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-purple-600 dark:fill-purple-300">Escape!</text>
        <text x="448" y="98" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-purple-600 dark:fill-purple-400">11.2 km/s</text>

        {/* Formula box at bottom */}
        <rect x="280" y="380" width="220" height="48" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="390" y="400" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          v_escape = √(2GM/r)
        </text>
        <text x="390" y="418" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Earth: 11.2 km/s ≈ 40,320 km/h
        </text>

        {/* Tsiolkovsky equation */}
        <rect x="20" y="380" width="245" height="48" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="142" y="400" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Rocket equation: Δv = v_e · ln(m_0/m_f)
        </text>
        <text x="142" y="418" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          More fuel expelled faster = more speed gained
        </text>
      </svg>
    </div>
  );
}
