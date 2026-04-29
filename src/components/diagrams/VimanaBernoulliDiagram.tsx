export default function VimanaBernoulliDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 570 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a wing showing faster airflow above and slower airflow below, creating lift via Bernoulli effect"
      >
        <defs>
          <marker id="vb-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="vb-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="vb-arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
          <marker id="vb-arrow-teal" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="30" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Bernoulli’s Principle: How Wings Create Lift
        </text>

        {/* Airfoil / wing cross-section */}
        <path d="M 100,200 C 140,150 300,130 420,195 L 420,200 C 300,215 140,220 100,200 Z"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-600 dark:stroke-slate-300" strokeWidth="2" />

        {/* Leading edge label */}
        <text x="85" y="205" textAnchor="end" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Leading</text>
        <text x="85" y="217" textAnchor="end" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">edge</text>

        {/* Trailing edge label */}
        <text x="435" y="200" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Trailing</text>
        <text x="435" y="212" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">edge</text>

        {/* UPPER airflow streamlines (faster, longer path) */}
        <path d="M 60,170 C 130,110 280,90 450,170" fill="none"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-cyan)" />
        <path d="M 60,150 C 130,100 280,75 450,145" fill="none"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-cyan)" />
        <path d="M 60,130 C 130,90 280,65 450,120" fill="none"
          className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-cyan)" />

        {/* LOWER airflow streamlines (slower, shorter path) */}
        <path d="M 60,230 C 150,245 320,250 450,230" fill="none"
          className="stroke-teal-500 dark:stroke-teal-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-teal)" />
        <path d="M 60,250 C 150,260 320,265 450,250" fill="none"
          className="stroke-teal-500 dark:stroke-teal-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-teal)" />
        <path d="M 60,270 C 150,275 320,278 450,270" fill="none"
          className="stroke-teal-500 dark:stroke-teal-400" strokeWidth="1.5"
          markerEnd="url(#vb-arrow-teal)" />

        {/* Labels: fast/slow */}
        <text x="260" y="80" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-cyan-600 dark:fill-cyan-300">
          FASTER airflow
        </text>
        <text x="260" y="95" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-cyan-600 dark:fill-cyan-400">
          Lower pressure above wing
        </text>

        <text x="260" y="278" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-teal-600 dark:fill-teal-300">
          SLOWER airflow
        </text>
        <text x="260" y="293" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-teal-600 dark:fill-teal-400">
          Higher pressure below wing
        </text>

        {/* Net lift arrow */}
        <line x1="260" y1="180" x2="260" y2="110"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3"
          markerEnd="url(#vb-arrow-blue)" />
        <text x="282" y="140" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">NET LIFT</text>

        {/* Pressure arrows: push up from below, weak push down from above */}
        <line x1="200" y1="225" x2="200" y2="208"
          className="stroke-red-400 dark:stroke-red-500" strokeWidth="2"
          markerEnd="url(#vb-arrow-red)" />
        <line x1="300" y1="222" x2="300" y2="205"
          className="stroke-red-400 dark:stroke-red-500" strokeWidth="2"
          markerEnd="url(#vb-arrow-red)" />

        {/* Formula and explanation box */}
        <rect x="20" y="310" width="480" height="75" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="260" y="332" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Bernoulli’s Equation: P + ½pv² + pgh = constant
        </text>
        <text x="260" y="352" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          As air speed (v) increases above the wing, pressure (P) decreases.
        </text>
        <text x="260" y="367" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          The pressure difference between lower and upper surfaces creates an upward net force: lift.
        </text>
        <text x="260" y="382" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontStyle="italic" className="fill-slate-500 dark:fill-slate-400">
          The curved upper surface forces air to travel a longer path in the same time = faster speed = lower pressure.
        </text>
      </svg>
    </div>
  );
}
