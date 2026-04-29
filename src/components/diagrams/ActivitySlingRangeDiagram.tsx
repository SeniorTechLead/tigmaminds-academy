export default function ActivitySlingRangeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Sock sling experiment guide showing setup, release angles, and results table"
      >
        <defs>
          <marker id="asr-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
          <marker id="asr-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="460" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Activity: Sock Sling Range Experiment
        </text>

        {/* === TOP LEFT: Sock sling setup === */}
        <rect x="20" y="42" width="200" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800/50 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="120" y="60" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Your Sling
        </text>

        {/* Sock shape */}
        <path d="M 70,90 Q 65,100 65,120 Q 65,140 80,145 L 90,145 Q 105,140 105,120 Q 105,100 100,90 Z"
          className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="85" y="125" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-700 dark:fill-blue-300">Sock</text>

        {/* Tennis ball in toe */}
        <circle cx="85" cy="138" r="10"
          className="fill-yellow-300 dark:fill-yellow-500 stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="1" />
        <text x="85" y="142" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-yellow-800 dark:fill-yellow-100" fontWeight="bold">●</text>

        {/* Grip end */}
        <rect x="75" y="78" width="20" height="14" rx="3"
          className="fill-blue-300 dark:fill-blue-700 stroke-blue-500" strokeWidth="1" />
        <text x="85" y="89" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-700 dark:fill-blue-300">Grip</text>

        {/* Labels */}
        <line x1="110" y1="138" x2="145" y2="138"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="148" y="142" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Tennis ball</text>
        <text x="148" y="154" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">in the toe</text>

        {/* === TOP RIGHT: Overhead swing === */}
        <rect x="240" y="42" width="240" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800/50 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="360" y="60" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Overhead Swing (top view)
        </text>

        {/* Stick figure hand at center */}
        <circle cx="360" cy="115" r="6" className="fill-amber-400 dark:fill-amber-500" />
        <text x="360" y="136" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-300">Hand</text>

        {/* Circular swing path */}
        <circle cx="360" cy="115" r="40" fill="none"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="6,4" />

        {/* Rotation arrow */}
        <path d="M 395,90 A 40,40 0 0,1 400,120" fill="none"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#asr-arrow-amber)" />

        {/* Ball on path */}
        <circle cx="400" cy="115" r="5"
          className="fill-yellow-400 dark:fill-yellow-500" />

        {/* Speed labels */}
        <text x="430" y="78" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">Swing 3-4</text>
        <text x="430" y="90" fontFamily="system-ui, sans-serif" fontSize="10"
          className="fill-slate-600 dark:fill-slate-300">times, then</text>
        <text x="430" y="102" fontFamily="system-ui, sans-serif" fontSize="10"
          fontWeight="bold" className="fill-amber-600 dark:fill-amber-300">RELEASE!</text>

        {/* === MIDDLE: Release angles === */}
        <text x="250" y="195" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Try Three Release Angles (side view)
        </text>

        {/* Ground */}
        <line x1="40" y1="310" x2="470" y2="310"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={45 + i * 20} y1={310} x2={55 + i * 20} y2={320}
            className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        ))}

        {/* Launch point */}
        <circle cx="60" cy="308" r="4" className="fill-slate-700 dark:fill-slate-200" />
        <text x="60" y="335" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Launch</text>

        {/* Low angle arc (20°) */}
        <path d="M 60,308 Q 140,275 220,308" fill="none"
          stroke="#f97316" strokeWidth="2" />
        <circle cx="220" cy="308" r="5" className="fill-orange-400 dark:fill-orange-500" />
        <text x="140" y="270" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" fill="#f97316">Low (~20°)</text>
        <text x="220" y="300" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#f97316">Short</text>

        {/* Medium angle arc (45°) */}
        <path d="M 60,308 Q 230,180 400,308" fill="none"
          stroke="#22c55e" strokeWidth="2.5" />
        <circle cx="400" cy="308" r="5" className="fill-green-500 dark:fill-green-400" />
        <text x="230" y="200" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" fill="#22c55e">Medium (~45°)</text>
        <text x="400" y="300" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#22c55e">Farthest!</text>

        {/* High angle arc (70°) */}
        <path d="M 60,308 Q 110,180 160,308" fill="none"
          stroke="#a855f7" strokeWidth="2" />
        <circle cx="160" cy="308" r="5" className="fill-purple-400 dark:fill-purple-500" />
        <text x="80" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" fill="#a855f7">High (~70°)</text>
        <text x="160" y="300" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#a855f7">High but short</text>

        {/* === BOTTOM: Results table === */}
        <text x="250" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Record Your Results
        </text>

        {/* Table outline */}
        <rect x="60" y="370" width="380" height="75" rx="4"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Header row */}
        <rect x="60" y="370" width="380" height="22" rx="4"
          className="fill-slate-200 dark:fill-slate-700" />
        <text x="130" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Trial</text>
        <text x="230" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Release Angle</text>
        <text x="340" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Distance (paces)</text>

        {/* Divider lines */}
        <line x1="175" y1="370" x2="175" y2="445"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="285" y1="370" x2="285" y2="445"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="60" y1="392" x2="440" y2="392"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Row 1 */}
        <line x1="60" y1="410" x2="440" y2="410"
          className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="130" y="405" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">1 - Low</text>
        <text x="230" y="405" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#f97316">~20°</text>
        <text x="340" y="405" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-400 dark:fill-slate-500">______</text>

        {/* Row 2 */}
        <line x1="60" y1="428" x2="440" y2="428"
          className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="130" y="423" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">2 - Medium</text>
        <text x="230" y="423" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#22c55e">~45°</text>
        <text x="340" y="423" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-400 dark:fill-slate-500">______</text>

        {/* Row 3 */}
        <text x="130" y="441" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">3 - High</text>
        <text x="230" y="441" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fill="#a855f7">~70°</text>
        <text x="340" y="441" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-400 dark:fill-slate-500">______</text>
      </svg>
    </div>
  );
}
