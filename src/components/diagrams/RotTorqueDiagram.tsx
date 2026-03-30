export default function RotTorqueDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing torque as force times lever arm using a door handle and wrench analogy">
        <defs>
          <marker id="rt-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="rt-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="rt-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        <rect width="520" height="380" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Torque: The Twisting Force
        </text>
        <text x="260" y="44" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
          Torque = Force x Distance from pivot
        </text>

        {/* === LEFT: Door analogy === */}
        <text x="140" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">
          Door Handle
        </text>

        {/* Door — top view */}
        <rect x="40" y="100" width="180" height="16" rx="2" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />

        {/* Hinge */}
        <circle cx="40" cy="108" r="8" className="fill-slate-500 dark:fill-slate-400 stroke-slate-700 dark:stroke-slate-300" strokeWidth="1.5" />
        <text x="40" y="135" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Hinge</text>
        <text x="40" y="147" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">(pivot)</text>

        {/* Handle */}
        <circle cx="210" cy="108" r="6" className="fill-slate-400 dark:fill-slate-500 stroke-slate-600 dark:stroke-slate-400" strokeWidth="1.5" />

        {/* Force at handle */}
        <line x1="210" y1="100" x2="210" y2="60" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#rt-arr-b)" />
        <text x="230" y="72" fontSize="11" fontWeight="bold" fill="#3b82f6">F</text>

        {/* Distance r */}
        <line x1="48" y1="125" x2="203" y2="125" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
        <text x="125" y="122" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">r (long = easy)</text>

        {/* Pushing near hinge */}
        <text x="140" y="175" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Push near the hinge?</text>
        <text x="140" y="188" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Nearly impossible!</text>
        <text x="140" y="201" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Small r = small torque.</text>

        {/* === RIGHT: Wrench analogy === */}
        <text x="390" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">
          Wrench on a Bolt
        </text>

        {/* Bolt (pivot) */}
        <circle cx="340" cy="150" r="10" className="fill-slate-500 dark:fill-slate-400 stroke-slate-700 dark:stroke-slate-300" strokeWidth="1.5" />
        <text x="340" y="154" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white dark:fill-slate-900">+</text>

        {/* Wrench handle */}
        <rect x="350" y="145" width="120" height="10" rx="3" className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />

        {/* Force at end of wrench */}
        <line x1="465" y1="145" x2="465" y2="100" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#rt-arr-b)" />
        <text x="480" y="115" fontSize="11" fontWeight="bold" fill="#3b82f6">F</text>

        {/* Distance */}
        <line x1="348" y1="170" x2="460" y2="170" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
        <text x="405" y="187" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">r (lever arm)</text>

        {/* Rotation arrow */}
        <path d="M 365,120 A 35,35 0 0,1 380,105" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rt-arr-a)" />

        {/* === Formula Box === */}
        <rect x="130" y="225" width="260" height="60" rx="8" className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="260" y="248" textAnchor="middle" fontSize="13" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          Torque (τ) = Force (F) × Distance (r)
        </text>
        <text x="260" y="268" textAnchor="middle" fontSize="11" className="fill-blue-600 dark:fill-blue-400">
          Units: Newton-metres (N·m)
        </text>

        {/* Key insight */}
        <rect x="40" y="300" width="440" height="65" rx="8" className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="260" y="320" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
          Why door handles are placed far from the hinge:
        </text>
        <text x="260" y="338" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Double the distance from the pivot = double the torque with the same push.
        </text>
        <text x="260" y="353" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          That's why longer wrenches make stubborn bolts easier to turn!
        </text>
      </svg>
    </div>
  );
}
