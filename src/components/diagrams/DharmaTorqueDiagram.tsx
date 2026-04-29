export default function DharmaTorqueDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 536 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing torque as force times lever arm on a wheel, with angular momentum vector"
      >
        <defs>
          <marker id="dtq-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="dtq-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="dtq-arrow-purple" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
          </marker>
          <marker id="dtq-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Torque and Angular Momentum
        </text>

        {/* --- Main Wheel --- */}
        {/* Outer rim */}
        <circle cx="200" cy="195" r="100" fill="none"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" />

        {/* Hub */}
        <circle cx="200" cy="195" r="10"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" />

        {/* 8 spokes for Dharma Wheel */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`spoke-${angle}`}
              x1={200 + 10 * Math.cos(rad)} y1={195 + 10 * Math.sin(rad)}
              x2={200 + 97 * Math.cos(rad)} y2={195 + 97 * Math.sin(rad)}
              className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" />
          );
        })}

        {/* Rotation arrow (curved) */}
        <path d="M 240,100 A 95,95 0 0,1 295,165" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2"
          markerEnd="url(#dtq-arrow-amber)" />
        <text x="285" y="120" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-300">ω</text>
        <text x="285" y="133" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-500 dark:fill-amber-400">(angular</text>
        <text x="285" y="145" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-500 dark:fill-amber-400">velocity)</text>

        {/* Force applied at rim (tangent) */}
        <line x1="200" y1="95" x2="280" y2="95"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          markerEnd="url(#dtq-arrow-blue)" />
        <text x="265" y="88" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">F (force)</text>

        {/* Radius line highlighted */}
        <line x1="200" y1="195" x2="200" y2="95"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" strokeDasharray="5,3" />
        <text x="186" y="150" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-red-500 dark:fill-red-400">r</text>

        {/* Right angle marker */}
        <rect x="200" y="95" width="8" height="8" fill="none"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1" />

        {/* Angular momentum vector coming out of page */}
        <circle cx="200" cy="195" r="18" fill="none"
          className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
        <circle cx="200" cy="195" r="3"
          className="fill-purple-500 dark:fill-purple-400" />
        <text x="200" y="225" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-purple-500 dark:fill-purple-400">L (out of page)</text>

        {/* Formula boxes */}
        <rect x="320" y="170" width="165" height="55" rx="8"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="402" y="190" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">Torque</text>
        <text x="402" y="212" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="16" fontWeight="bold" className="fill-blue-800 dark:fill-blue-100">
          τ = F × r
        </text>

        <rect x="320" y="235" width="165" height="55" rx="8"
          className="fill-purple-50 dark:fill-purple-900/30 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1.5" />
        <text x="402" y="255" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-purple-700 dark:fill-purple-300">Angular Momentum</text>
        <text x="402" y="277" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="16" fontWeight="bold" className="fill-purple-800 dark:fill-purple-100">
          L = I × ω
        </text>

        {/* Key insight box at bottom */}
        <rect x="30" y="315" width="440" height="110" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="250" y="338" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Rotational ↔ Linear Equivalents
        </text>
        <text x="130" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">Force (F) → Torque (τ)</text>
        <text x="370" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">Mass (m) → Moment of inertia (I)</text>
        <text x="130" y="380" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">Velocity (v) → Angular velocity (ω)</text>
        <text x="370" y="380" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">Momentum (p) → Angular momentum (L)</text>
        <text x="250" y="405" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">
          Every linear physics concept has a rotational twin — and the Dharma Wheel uses all of them.
        </text>

        {/* Legend */}
        <line x1="30" y1="52" x2="50" y2="52" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="55" y="56" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Force (tangent to rim)</text>
        <line x1="30" y1="67" x2="50" y2="67" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
        <text x="55" y="71" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Radius (lever arm)</text>
        <circle cx="40" cy="82" r="5" fill="none" stroke="#a855f7" strokeWidth="2" />
        <circle cx="40" cy="82" r="2" fill="#a855f7" />
        <text x="55" y="86" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Angular momentum (out of page)</text>
      </svg>
    </div>
  );
}
