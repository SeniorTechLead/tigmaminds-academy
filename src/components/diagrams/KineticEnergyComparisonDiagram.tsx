export default function KineticEnergyComparisonDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Kinetic energy comparison showing a small fast sling stone has more energy than a large slow bowling ball"
      >
        <defs>
          <marker id="kec-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="30" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Kinetic Energy: Speed vs. Mass
        </text>

        {/* Divider */}
        <line x1="250" y1="50" x2="250" y2="280"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="5,5" />
        <text x="125" y="58" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-500 dark:fill-slate-400">
          BOWLING BALL
        </text>
        <text x="375" y="58" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-500 dark:fill-slate-400">
          SLING STONE
        </text>

        {/* === LEFT: Bowling ball === */}
        {/* Big ball */}
        <circle cx="125" cy="140" r="45" className="fill-slate-600 dark:fill-slate-500" />
        <circle cx="125" cy="140" r="42" className="fill-slate-500 dark:fill-slate-400" />
        {/* Finger holes */}
        <circle cx="115" cy="125" r="5" className="fill-slate-700 dark:fill-slate-600" />
        <circle cx="130" cy="120" r="5" className="fill-slate-700 dark:fill-slate-600" />
        <circle cx="135" cy="135" r="5" className="fill-slate-700 dark:fill-slate-600" />

        {/* Speed arrow - small */}
        <line x1="175" y1="140" x2="210" y2="140"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          markerEnd="url(#kec-arrow)" />
        <text x="193" y="132" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-500 dark:fill-blue-400">slow</text>

        {/* Stats */}
        <text x="125" y="210" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          m = 10 kg
        </text>
        <text x="125" y="228" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">
          v = 2 m/s
        </text>

        {/* Calculation */}
        <text x="125" y="252" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          KE = ½ × 10 × 2²
        </text>

        {/* Result box */}
        <rect x="65" y="260" width="120" height="30" rx="6"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-600" strokeWidth="1.5" />
        <text x="125" y="280" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          KE = 20 J
        </text>

        {/* === RIGHT: Sling stone === */}
        {/* Tiny stone */}
        <circle cx="375" cy="140" r="8" className="fill-amber-700 dark:fill-amber-500" />
        <circle cx="373" cy="138" r="2" className="fill-amber-500 dark:fill-amber-300" opacity="0.5" />

        {/* Speed arrow - long */}
        <line x1="388" y1="140" x2="465" y2="140"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5"
          markerEnd="url(#kec-arrow)" />
        <text x="427" y="132" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-400">FAST!</text>

        {/* Stats */}
        <text x="375" y="210" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          m = 0.05 kg
        </text>
        <text x="375" y="228" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-red-600 dark:fill-red-400">
          v = 35 m/s
        </text>

        {/* Calculation */}
        <text x="375" y="252" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          KE = ½ × 0.05 × 35²
        </text>

        {/* Result box */}
        <rect x="315" y="260" width="120" height="30" rx="6"
          className="fill-red-100 dark:fill-red-900/40 stroke-red-400 dark:stroke-red-600" strokeWidth="1.5" />
        <text x="375" y="280" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="bold" className="fill-red-700 dark:fill-red-300">
          KE = 30.6 J
        </text>

        {/* VS */}
        <text x="250" y="280" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-500 dark:fill-slate-400">
          vs
        </text>

        {/* Formula box */}
        <rect x="130" y="305" width="240" height="40" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="250" y="325" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="16" fontWeight="bold" className="fill-slate-800 dark:fill-slate-100">
          KE = ½mv²
        </text>
        <text x="250" y="340" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Kinetic Energy (Joules)
        </text>

        {/* Key insight */}
        <rect x="100" y="355" width="300" height="35" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="250" y="372" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
          v² is the key! Double the speed = 4× the energy
        </text>
        <text x="250" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          David's tiny stone carried MORE energy than a bowling ball!
        </text>
      </svg>
    </div>
  );
}
