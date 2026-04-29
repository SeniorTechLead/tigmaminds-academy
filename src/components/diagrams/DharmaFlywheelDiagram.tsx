export default function DharmaFlywheelDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 552 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Flywheel energy storage diagram showing a heavy spinning disc storing kinetic energy"
      >
        <defs>
          <marker id="dfw-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="dfw-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="dfw-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
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
          Flywheels — Storing Energy in Spinning Mass
        </text>

        {/* --- Cross-section of flywheel --- */}
        {/* Outer ring (heavy rim) */}
        <circle cx="170" cy="190" r="95" fill="none"
          className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="4" />
        <circle cx="170" cy="190" r="80" fill="none"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3,3" />

        {/* Rim fill to show mass concentration */}
        <path d="M 170,95 A 95,95 0 1,1 169.99,95 Z" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="0" />
        <circle cx="170" cy="190" r="95" className="fill-slate-200/50 dark:fill-slate-700/50" />
        <circle cx="170" cy="190" r="70" className="fill-white dark:fill-slate-900" />

        {/* Rim label */}
        <text x="170" y="105" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Heavy rim</text>

        {/* Hub */}
        <circle cx="170" cy="190" r="15"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <circle cx="170" cy="190" r="5"
          className="fill-slate-500 dark:fill-slate-400" />

        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`fw-spoke-${angle}`}
              x1={170 + 15 * Math.cos(rad)} y1={190 + 15 * Math.sin(rad)}
              x2={170 + 78 * Math.cos(rad)} y2={190 + 78 * Math.sin(rad)}
              className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          );
        })}

        {/* Spin arrow */}
        <path d="M 220,100 A 90,90 0 0,1 265,155" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2"
          markerEnd="url(#dfw-arrow-amber)" />
        <text x="258" y="115" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-300">ω</text>

        {/* --- Energy flow diagram (right side) --- */}
        {/* Energy IN (charging) */}
        <rect x="310" y="70" width="170" height="55" rx="8"
          className="fill-green-50 dark:fill-green-900/30 stroke-green-400 dark:stroke-green-600" strokeWidth="1.5" />
        <text x="395" y="90" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-green-700 dark:fill-green-300">Energy IN (motor)</text>
        <text x="395" y="107" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">Electricity → spins up flywheel</text>
        <text x="395" y="120" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">Stores as rotational KE</text>

        {/* Arrow down */}
        <line x1="395" y1="125" x2="395" y2="148"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="2"
          markerEnd="url(#dfw-arrow-green)" />

        {/* Stored energy */}
        <rect x="310" y="150" width="170" height="60" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="395" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">Stored Energy</text>
        <text x="395" y="190" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="15" fontWeight="bold" className="fill-amber-800 dark:fill-amber-100">
          KE = ½ Iω²
        </text>
        <text x="395" y="205" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">Double speed → 4× energy!</text>

        {/* Arrow down */}
        <line x1="395" y1="210" x2="395" y2="233"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2"
          markerEnd="url(#dfw-arrow-red)" />

        {/* Energy OUT (generating) */}
        <rect x="310" y="235" width="170" height="55" rx="8"
          className="fill-red-50 dark:fill-red-900/30 stroke-red-400 dark:stroke-red-600" strokeWidth="1.5" />
        <text x="395" y="255" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-red-700 dark:fill-red-300">Energy OUT (generator)</text>
        <text x="395" y="272" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">Flywheel slows → electricity</text>
        <text x="395" y="285" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-600 dark:fill-red-400">Instant response, no chemicals</text>

        {/* Key insight box */}
        <rect x="30" y="320" width="440" height="105" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="250" y="343" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Why Flywheels?
        </text>
        <text x="250" y="363" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Batteries store energy chemically (slow, degrades). Flywheels store it as motion (instant, lasts decades).
        </text>
        <text x="250" y="378" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Modern flywheels: carbon fibre, vacuum chamber, magnetic bearings, 50,000+ RPM.
        </text>
        <text x="250" y="393" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Used in: NASA spacecraft, Formula 1 (KERS), power grid stabilisation, UPS systems.
        </text>
        <text x="250" y="413" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">
          The same principle as a potter’s wheel — spin it fast, and it stores energy for later.
        </text>
      </svg>
    </div>
  );
}
