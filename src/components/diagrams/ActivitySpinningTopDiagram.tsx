export default function ActivitySpinningTopDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step spinning top experiment showing how spin speed affects stability time"
      >
        {/* Background */}
        <rect width="500" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Activity: The Spinning Top Experiment
        </text>

        {/* Step 1 */}
        <rect x="20" y="48" width="140" height="140" rx="8"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="90" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">Step 1: Spin gently</text>

        {/* Top tilting */}
        <line x1="90" y1="135" x2="85" y2="95"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <ellipse cx="85" cy="93" rx="25" ry="8" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <circle cx="85" cy="93" r="3" className="fill-amber-500 dark:fill-amber-400" />
        {/* Wobble arrow */}
        <path d="M 65,85 Q 55,75 68,70" fill="none"
          className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" />
        <text x="90" y="155" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">Wobbles, falls in</text>
        <text x="90" y="167" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">~3 seconds</text>
        <text x="90" y="182" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">Low L</text>

        {/* Step 2 */}
        <rect x="180" y="48" width="140" height="140" rx="8"
          className="fill-green-50 dark:fill-green-900/20 stroke-green-300 dark:stroke-green-700" strokeWidth="1.5" />
        <text x="250" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-green-700 dark:fill-green-300">Step 2: Spin hard</text>

        {/* Top upright, spinning fast */}
        <line x1="250" y1="135" x2="250" y2="90"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <ellipse cx="250" cy="88" rx="25" ry="8" fill="none"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" />
        <circle cx="250" cy="88" r="3" className="fill-amber-500 dark:fill-amber-400" />
        {/* Speed lines */}
        <path d="M 228,82 A 20,6 0 0,1 272,82" fill="none"
          className="stroke-green-400 dark:stroke-green-500" strokeWidth="1.5" />
        <path d="M 230,79 A 18,5 0 0,1 270,79" fill="none"
          className="stroke-green-400 dark:stroke-green-500" strokeWidth="1" />
        <text x="250" y="155" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">Stays upright for</text>
        <text x="250" y="167" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-600 dark:fill-green-400">30+ seconds</text>
        <text x="250" y="182" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-green-600 dark:fill-green-300">High L</text>

        {/* Step 3 */}
        <rect x="340" y="48" width="140" height="140" rx="8"
          className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1.5" />
        <text x="410" y="68" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-purple-700 dark:fill-purple-300">Step 3: Record</text>

        {/* Table representation */}
        <rect x="355" y="80" width="110" height="90" rx="4" fill="none"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="355" y1="100" x2="465" y2="100" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="410" y1="80" x2="410" y2="170" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="382" y="94" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Spin</text>
        <text x="437" y="94" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Time (s)</text>
        <text x="382" y="118" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Gentle</text>
        <text x="437" y="118" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">3</text>
        <text x="382" y="136" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Medium</text>
        <text x="437" y="136" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">12</text>
        <text x="382" y="154" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Hard</text>
        <text x="437" y="154" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">35</text>
        <text x="410" y="183" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-purple-600 dark:fill-purple-400">Plot spin vs time</text>

        {/* Materials list */}
        <rect x="20" y="205" width="220" height="80" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="130" y="225" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">You need:</text>
        <text x="35" y="245" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• A spinning top (or coin on edge)</text>
        <text x="35" y="260" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• A phone timer (stopwatch)</text>
        <text x="35" y="275" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• A smooth flat surface (table, floor)</text>

        {/* What to observe */}
        <rect x="260" y="205" width="220" height="80" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="370" y="225" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Observe:</text>
        <text x="275" y="245" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• Does it wobble more at start or end?</text>
        <text x="275" y="260" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• Does the axis trace a slow circle?</text>
        <text x="275" y="275" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">• That slow circle IS precession!</text>

        {/* Key insight */}
        <rect x="30" y="300" width="440" height="85" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1.5" />
        <text x="250" y="323" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
          The Physics You Just Proved
        </text>
        <text x="250" y="343" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Faster spin = more angular momentum (L = Iω) = more resistance to falling.
        </text>
        <text x="250" y="358" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          As friction slows the top, L decreases, wobble increases, and eventually it falls.
        </text>
        <text x="250" y="373" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          This is exactly how a bicycle stays upright: the wheels act as gyroscopes.
        </text>
      </svg>
    </div>
  );
}
