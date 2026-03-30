export default function AeroFourForcesDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 340" className="w-full max-w-xl mx-auto" role="img" aria-label="Four forces of flight: lift, weight, thrust, drag">
        <defs>
          <marker id="aero4-arrow-up" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
            <polygon points="0 8, 4 0, 8 8" className="fill-blue-500" />
          </marker>
          <marker id="aero4-arrow-down" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
            <polygon points="0 0, 4 8, 8 0" className="fill-red-500" />
          </marker>
          <marker id="aero4-arrow-right" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" className="fill-green-500" />
          </marker>
          <marker id="aero4-arrow-left" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
            <polygon points="8 0, 0 4, 8 8" className="fill-orange-500" />
          </marker>
        </defs>

        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          The Four Forces of Flight
        </text>

        {/* Aircraft body */}
        <ellipse cx="260" cy="170" rx="75" ry="18" className="fill-slate-300 dark:fill-slate-600" stroke="#64748b" strokeWidth="1.5" />
        {/* Wings */}
        <path d="M 210,170 L 160,155 L 165,165 L 210,170" className="fill-slate-400 dark:fill-slate-500" stroke="#475569" strokeWidth="1" />
        <path d="M 310,170 L 360,155 L 355,165 L 310,170" className="fill-slate-400 dark:fill-slate-500" stroke="#475569" strokeWidth="1" />
        {/* Tail */}
        <path d="M 185,170 L 170,150 L 180,155 L 190,170" className="fill-slate-400 dark:fill-slate-500" stroke="#475569" strokeWidth="1" />
        {/* Nose */}
        <ellipse cx="335" cy="170" rx="8" ry="10" className="fill-slate-200 dark:fill-slate-500" stroke="#64748b" strokeWidth="1" />
        {/* Window */}
        <rect x="300" y="164" width="18" height="8" rx="3" className="fill-sky-300 dark:fill-sky-600" stroke="#0284c7" strokeWidth="0.8" />

        {/* LIFT arrow (up) */}
        <line x1="260" y1="145" x2="260" y2="60" className="stroke-blue-500" strokeWidth="3" markerEnd="url(#aero4-arrow-up)" />
        <text x="260" y="50" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="13" fontWeight="bold">LIFT</text>
        <text x="260" y="42" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(wings push air down)</text>

        {/* WEIGHT arrow (down) */}
        <line x1="260" y1="195" x2="260" y2="280" className="stroke-red-500" strokeWidth="3" markerEnd="url(#aero4-arrow-down)" />
        <text x="260" y="298" textAnchor="middle" className="fill-red-600 dark:fill-red-300" fontSize="13" fontWeight="bold">WEIGHT</text>
        <text x="260" y="312" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(gravity pulls down)</text>

        {/* THRUST arrow (right) */}
        <line x1="345" y1="170" x2="440" y2="170" className="stroke-green-500" strokeWidth="3" markerEnd="url(#aero4-arrow-right)" />
        <text x="460" y="165" className="fill-green-600 dark:fill-green-300" fontSize="13" fontWeight="bold">THRUST</text>
        <text x="460" y="179" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(engine</text>
        <text x="460" y="191" className="fill-gray-500 dark:fill-gray-400" fontSize="10">pushes</text>
        <text x="460" y="203" className="fill-gray-500 dark:fill-gray-400" fontSize="10">forward)</text>

        {/* DRAG arrow (left) */}
        <line x1="175" y1="170" x2="80" y2="170" className="stroke-orange-500" strokeWidth="3" markerEnd="url(#aero4-arrow-left)" />
        <text x="55" y="165" textAnchor="end" className="fill-orange-600 dark:fill-orange-300" fontSize="13" fontWeight="bold">DRAG</text>
        <text x="55" y="179" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">(air resists</text>
        <text x="55" y="191" textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">motion)</text>

        {/* Balance note */}
        <text x="260" y="332" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Steady flight: Lift = Weight and Thrust = Drag
        </text>
      </svg>
    </div>
  );
}
