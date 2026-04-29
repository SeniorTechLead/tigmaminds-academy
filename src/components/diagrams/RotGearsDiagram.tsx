export default function RotGearsDiagram() {
  const teeth = (cx: number, cy: number, r: number, n: number, color: string) => {
    const toothSize = 6;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const x = cx + (r + toothSize / 2) * Math.cos(angle);
      const y = cy + (r + toothSize / 2) * Math.sin(angle);
      return (
        <circle key={`t-${cx}-${i}`} cx={x} cy={y} r={toothSize / 2} fill={color} />
      );
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 420" className="w-full h-auto" role="img"
        aria-label="Diagram showing how gears trade speed for force, with a small driving gear turning a large driven gear">
        <defs>
          <marker id="rgr-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="rgr-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        <rect width="520" height="420" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Gears: Trading Speed for Force
        </text>

        {/* === SMALL GEAR (driver) — 10 teeth === */}
        <circle cx="175" cy="200" r="40" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />
        <circle cx="175" cy="200" r="8" className="fill-blue-400 dark:fill-blue-500" />
        {teeth(175, 200, 40, 10, '#3b82f6')}

        {/* Rotation arrow */}
        <path d="M 155,158 A 42,42 0 0,1 200,165" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#rgr-arr-b)" />
        <text x="175" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">Fast!</text>

        {/* Labels */}
        <text x="175" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">
          Small gear (driver)
        </text>
        <text x="175" y="275" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">
          10 teeth
        </text>

        {/* === LARGE GEAR (driven) — 20 teeth === */}
        <circle cx="315" cy="200" r="80" fill="none" className="stroke-red-400 dark:stroke-red-400" strokeWidth="3" />
        <circle cx="315" cy="200" r="10" className="fill-red-400 dark:fill-red-500" />
        {teeth(315, 200, 80, 20, '#ef4444')}

        {/* Rotation arrow — opposite direction */}
        <path d="M 350,124 A 82,82 0 0,0 285,128" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#rgr-arr-r)" />
        <text x="315" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Slow but powerful!</text>

        {/* Labels */}
        <text x="315" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-red-500 dark:fill-red-400">
          Large gear (driven)
        </text>
        <text x="315" y="310" textAnchor="middle" fontSize="10" className="fill-red-400 dark:fill-red-400">
          20 teeth
        </text>

        {/* Mesh point */}
        <circle cx="219" cy="186" r="5" className="fill-amber-400 dark:fill-amber-500" />
        <text x="219" y="176" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">Mesh</text>

        {/* === Explanation boxes === */}
        <rect x="30" y="330" width="220" height="75" rx="8" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="140" y="352" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          Low gear on a bicycle
        </text>
        <text x="140" y="368" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Small gear drives large gear
        </text>
        <text x="140" y="382" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          = Less speed, MORE force
        </text>
        <text x="140" y="396" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">
          Great for climbing hills!
        </text>

        <rect x="270" y="330" width="220" height="75" rx="8" className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="380" y="352" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-red-700 dark:fill-red-300">
          High gear on a bicycle
        </text>
        <text x="380" y="368" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Large gear drives small gear
        </text>
        <text x="380" y="382" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          = MORE speed, less force
        </text>
        <text x="380" y="396" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-red-600 dark:fill-red-400">
          Great for flat roads!
        </text>
      </svg>
    </div>
  );
}
