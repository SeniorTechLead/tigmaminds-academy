export default function StructTriangleDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" role="img"
        aria-label="Diagram comparing triangle rigidity vs square deformation in structures">
        <defs>
          <marker id="st-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        <rect width="520" height="400" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          The Triangle: Nature's Strongest Shape
        </text>

        {/* Left side — SQUARE collapses */}
        <text x="130" y="56" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-red-500 dark:fill-red-400">
          Square (weak)
        </text>

        {/* Original square */}
        <rect x="60" y="80" width="100" height="100" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2.5" />
        <circle cx="60" cy="80" r="4" className="fill-slate-400 dark:fill-slate-500" />
        <circle cx="160" cy="80" r="4" className="fill-slate-400 dark:fill-slate-500" />
        <circle cx="60" cy="180" r="4" className="fill-slate-400 dark:fill-slate-500" />
        <circle cx="160" cy="180" r="4" className="fill-slate-400 dark:fill-slate-500" />

        {/* Force arrow pushing square sideways */}
        <line x1="32" y1="80" x2="55" y2="80" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#st-arr)" />
        <text x="22" y="76" fontSize="10" fontWeight="bold" fill="#ef4444">F</text>

        {/* Collapsed parallelogram */}
        <polygon points="75,220 185,220 165,310 55,310" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" />
        <circle cx="75" cy="220" r="4" fill="#ef4444" />
        <circle cx="185" cy="220" r="4" fill="#ef4444" />
        <circle cx="55" cy="310" r="4" fill="#ef4444" />
        <circle cx="165" cy="310" r="4" fill="#ef4444" />

        <text x="130" y="340" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">
          Joints rotate freely
        </text>
        <text x="130" y="354" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">
          = structure collapses!
        </text>

        {/* Right side — TRIANGLE holds */}
        <text x="390" y="56" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-emerald-500 dark:fill-emerald-400">
          Triangle (strong)
        </text>

        {/* Triangle */}
        <polygon points="390,80 330,180 450,180" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <circle cx="390" cy="80" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
        <circle cx="330" cy="180" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
        <circle cx="450" cy="180" r="4" className="fill-emerald-500 dark:fill-emerald-400" />

        {/* Force arrow */}
        <line x1="355" y1="80" x2="384" y2="80" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#st-arr)" />
        <text x="345" y="76" fontSize="10" fontWeight="bold" fill="#ef4444">F</text>

        {/* Same triangle below — still rigid */}
        <polygon points="390,220 330,320 450,320" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />
        <circle cx="390" cy="220" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
        <circle cx="330" cy="320" r="4" className="fill-emerald-500 dark:fill-emerald-400" />
        <circle cx="450" cy="320" r="4" className="fill-emerald-500 dark:fill-emerald-400" />

        <text x="390" y="340" textAnchor="middle" fontSize="10" className="fill-emerald-500 dark:fill-emerald-400">
          Cannot deform without
        </text>
        <text x="390" y="354" textAnchor="middle" fontSize="10" className="fill-emerald-500 dark:fill-emerald-400">
          breaking a side = rigid!
        </text>

        {/* Divider */}
        <line x1="260" y1="50" x2="260" y2="370" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,4" />

        {/* Bottom insight */}
        <text x="260" y="386" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">
          This is why bridges, cranes, and the Eiffel Tower are all made of triangles (trusses).
        </text>
      </svg>
    </div>
  );
}
