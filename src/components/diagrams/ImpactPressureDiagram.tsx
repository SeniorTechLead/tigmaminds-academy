export default function ImpactPressureDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Pressure equals force over area diagram comparing pillow and stone impact, plus helmet force spreading"
      >
        <defs>
          <marker id="ip-arrow-down" viewBox="0 0 10 10" refX="5" refY="9"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#ef4444" />
          </marker>
          <marker id="ip-arrow-out" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Force Concentration: Why Small = Deadly
        </text>

        {/* Divider */}
        <line x1="250" y1="42" x2="250" y2="240"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="5,5" />

        {/* === LEFT: Pillow (large area) === */}
        <text x="125" y="55" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">
          Pillow Hit
        </text>

        {/* Force arrow */}
        <line x1="125" y1="70" x2="125" y2="105"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ip-arrow-down)" />
        <text x="145" y="90" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="bold" className="fill-red-500 dark:fill-red-400">F = 50 N</text>

        {/* Pillow shape */}
        <ellipse cx="125" cy="130" rx="60" ry="20"
          className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="125" y="134" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-700 dark:fill-blue-300">Pillow</text>

        {/* Wide contact area indicator */}
        <line x1="65" y1="155" x2="185" y2="155"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <text x="125" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          A = 500 cm²
        </text>

        {/* Surface */}
        <rect x="50" y="145" width="150" height="12" rx="2"
          className="fill-slate-200 dark:fill-slate-700" />

        {/* Pressure result */}
        <rect x="50" y="185" width="150" height="45" rx="6"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x="125" y="203" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">
          P = 50 / 0.05 = 1,000 Pa
        </text>
        <text x="125" y="222" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          Barely felt!
        </text>

        {/* === RIGHT: Stone (tiny area) === */}
        <text x="375" y="55" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-red-600 dark:fill-red-300">
          Stone Impact
        </text>

        {/* Force arrow */}
        <line x1="375" y1="70" x2="375" y2="105"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ip-arrow-down)" />
        <text x="395" y="90" fontFamily="system-ui, sans-serif" fontSize="11"
          fontWeight="bold" className="fill-red-500 dark:fill-red-400">F = 50 N</text>

        {/* Stone */}
        <circle cx="375" cy="125" r="6"
          className="fill-amber-600 dark:fill-amber-500 stroke-amber-800 dark:stroke-amber-400" strokeWidth="1" />

        {/* Tiny contact point */}
        <line x1="371" y1="155" x2="379" y2="155"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="375" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">
          A = 0.5 cm²
        </text>

        {/* Surface with crack */}
        <rect x="300" y="145" width="150" height="12" rx="2"
          className="fill-slate-200 dark:fill-slate-700" />
        <line x1="373" y1="145" x2="370" y2="157" className="stroke-red-400" strokeWidth="1" />
        <line x1="377" y1="145" x2="380" y2="157" className="stroke-red-400" strokeWidth="1" />

        {/* Pressure result */}
        <rect x="300" y="185" width="150" height="45" rx="6"
          className="fill-red-50 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-600" strokeWidth="1" />
        <text x="375" y="203" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">
          P = 50 / 0.00005 = 1,000,000 Pa
        </text>
        <text x="375" y="222" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-red-700 dark:fill-red-300">
          1000× more pressure!
        </text>

        {/* Formula */}
        <rect x="150" y="245" width="200" height="35" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="250" y="268" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="16" fontWeight="bold" className="fill-slate-800 dark:fill-slate-100">
          P = F / A
        </text>

        {/* === BOTTOM: Helmet diagram === */}
        <line x1="20" y1="295" x2="480" y2="295"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="250" y="315" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          How a Helmet Protects (Goliath's Missing Advantage)
        </text>

        {/* Head without helmet */}
        <circle cx="130" cy="380" r="25"
          className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="1.5" />
        <text x="130" y="384" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-700 dark:fill-amber-300">Head</text>
        {/* Stone hitting */}
        <circle cx="130" cy="352" r="5" className="fill-stone-500 dark:fill-stone-400" />
        <line x1="130" y1="340" x2="130" y2="350"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#ip-arrow-down)" />
        <text x="130" y="335" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">
          All force on one point
        </text>

        {/* Arrow between */}
        <text x="250" y="383" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-500 dark:fill-slate-400">vs</text>

        {/* Head with helmet */}
        <circle cx="370" cy="385" r="22"
          className="fill-amber-200 dark:fill-amber-800" />
        {/* Helmet shell */}
        <path d="M 340,378 Q 345,345 370,340 Q 395,345 400,378"
          fill="none" className="stroke-green-500 dark:stroke-green-400" strokeWidth="3" />
        <text x="370" y="390" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-700 dark:fill-amber-300">Head</text>

        {/* Force spreading arrows */}
        <line x1="370" y1="340" x2="350" y2="358"
          stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#ip-arrow-out)" />
        <line x1="370" y1="340" x2="370" y2="360"
          stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#ip-arrow-out)" />
        <line x1="370" y1="340" x2="390" y2="358"
          stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#ip-arrow-out)" />

        <text x="370" y="330" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-green-600 dark:fill-green-400">
          Force spread over area
        </text>

        {/* Bottom labels */}
        <text x="130" y="420" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">
          High pressure — dangerous
        </text>
        <text x="370" y="420" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">
          Low pressure — survivable
        </text>
      </svg>
    </div>
  );
}
