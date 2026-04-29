export default function ActivityPaperPlaneDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 639 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Paper airplane experiment showing three different designs and how to measure distance, hang time, and flight path"
      >
        <defs>
          <marker id="app-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="app-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Paper Airplane Experiment
        </text>

        {/* --- 3 plane designs --- */}

        {/* Design 1: Dart (narrow, long) */}
        <g>
          <path d="M 60,80 L 120,95 L 60,110 Z"
            className="fill-blue-200 dark:fill-blue-700 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
          <line x1="60" y1="95" x2="120" y2="95"
            className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" />
          <text x="90" y="130" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">Dart</text>
          <text x="90" y="144" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">Low drag</text>
          <text x="90" y="157" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">Fast, straight</text>
        </g>

        {/* Design 2: Glider (wide wings) */}
        <g>
          <path d="M 210,85 L 270,95 L 210,105 Z"
            className="fill-green-200 dark:fill-green-700 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
          <line x1="225" y1="75" x2="225" y2="115"
            className="stroke-green-400 dark:stroke-green-500" strokeWidth="3" strokeLinecap="round" />
          <text x="240" y="130" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="11" fontWeight="bold" className="fill-green-600 dark:fill-green-300">Glider</text>
          <text x="240" y="144" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">High lift</text>
          <text x="240" y="157" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">Slow, floats</text>
        </g>

        {/* Design 3: Stunt (folded wingtips) */}
        <g>
          <path d="M 370,85 L 430,95 L 370,105 Z"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          <path d="M 385,85 L 380,78" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" strokeLinecap="round" />
          <path d="M 385,105 L 380,112" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" strokeLinecap="round" />
          <text x="400" y="130" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-300">Stunt</text>
          <text x="400" y="144" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">Wingtip flaps</text>
          <text x="400" y="157" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="10" className="fill-slate-500 dark:fill-slate-400">Loops, curves</text>
        </g>

        {/* --- Measurement section --- */}
        <line x1="20" y1="175" x2="500" y2="175"
          className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Flight path illustration */}
        <text x="260" y="198" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          What to Measure
        </text>

        {/* Launch point */}
        <circle cx="60" cy="250" r="5" className="fill-slate-500 dark:fill-slate-400" />
        <text x="60" y="275" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Launch</text>

        {/* Flight arc */}
        <path d="M 65,250 Q 250,170 460,260" fill="none"
          className="stroke-green-400 dark:stroke-green-500" strokeWidth="2" strokeDasharray="6,3" />

        {/* Landing point */}
        <circle cx="460" cy="260" r="5" className="fill-red-500 dark:fill-red-400" />
        <text x="460" y="283" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-400">Landing</text>

        {/* Distance arrow */}
        <line x1="60" y1="295" x2="455" y2="295"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2"
          markerEnd="url(#app-arrow-blue)" />
        <text x="260" y="310" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">
          1. Distance (metres)
        </text>

        {/* Hang time indicator */}
        <text x="250" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-green-600 dark:fill-green-300">
          2. Hang time (seconds in air)
        </text>
        <line x1="250" y1="220" x2="250" y2="235"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5"
          markerEnd="url(#app-arrow-green)" />

        {/* Data table */}
        <rect x="30" y="325" width="460" height="42" rx="5"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="40" y="342" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Record:</text>
        <text x="40" y="358" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Design | Trial 1 | Trial 2 | Trial 3 | Avg Distance | Avg Hang Time | Flight Path (straight / curve / loop)</text>

        {/* Variable labels */}
        <rect x="320" y="84" width="30" height="18" rx="3"
          className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400" strokeWidth="1" />
        <text x="335" y="97" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-purple-600 dark:fill-purple-300">IV</text>
        <text x="370" y="97" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-purple-500 dark:fill-purple-400">= wing shape</text>

        <rect x="320" y="106" width="30" height="18" rx="3"
          className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400" strokeWidth="1" />
        <text x="335" y="119" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-300">DV</text>
        <text x="370" y="119" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-emerald-500 dark:fill-emerald-400">= distance, time</text>
      </svg>
    </div>
  );
}
