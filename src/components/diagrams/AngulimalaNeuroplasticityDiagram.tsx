export default function AngulimalaNeuroplasticityDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 520 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing neuroplasticity: how neural pathways strengthen with use and weaken with disuse"
      >
        <defs>
          <marker id="np-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <linearGradient id="np-strong" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="np-weak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        <rect width="520" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Neuroplasticity — The Brain Rewires Itself
        </text>

        {/* Left side: Old pathway (thick, strong) */}
        <text x="130" y="60" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-red-500 dark:fill-red-400">
          Old Habit (strong pathway)
        </text>

        {/* Neuron A */}
        <circle cx="50" cy="120" r="18" className="fill-red-200 dark:fill-red-800 stroke-red-500" strokeWidth="2" />
        <text x="50" y="124" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-200">A</text>

        {/* Thick connection A-B */}
        <line x1="68" y1="120" x2="132" y2="120" stroke="#ef4444" strokeWidth="6" opacity="0.8" />

        {/* Neuron B */}
        <circle cx="150" cy="120" r="18" className="fill-red-200 dark:fill-red-800 stroke-red-500" strokeWidth="2" />
        <text x="150" y="124" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-200">B</text>

        {/* Thick connection B-C */}
        <line x1="168" y1="120" x2="232" y2="120" stroke="#ef4444" strokeWidth="6" opacity="0.8" />

        {/* Neuron C */}
        <circle cx="250" cy="120" r="18" className="fill-red-200 dark:fill-red-800 stroke-red-500" strokeWidth="2" />
        <text x="250" y="124" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-200">C</text>

        <text x="150" y="155" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Thick connections = frequently used
        </text>

        {/* Arrow down: "With effort and time" */}
        <line x1="260" y1="170" x2="260" y2="210" stroke="#60a5fa" strokeWidth="2"
          strokeDasharray="4,3" markerEnd="url(#np-arrow)" />
        <text x="260" y="200" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-blue-500 dark:fill-blue-400">
          With repeated practice...
        </text>

        {/* Right side: New pathway forming (below) */}
        <text x="260" y="240" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-emerald-500 dark:fill-emerald-400">
          New Habit (pathway strengthening)
        </text>

        {/* Neuron D */}
        <circle cx="50" cy="300" r="18" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="2" />
        <text x="50" y="304" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-200">D</text>

        {/* Growing connection D-E */}
        <line x1="68" y1="300" x2="132" y2="300" stroke="#10b981" strokeWidth="4" opacity="0.9" />

        {/* Neuron E */}
        <circle cx="150" cy="300" r="18" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="2" />
        <text x="150" y="304" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-200">E</text>

        {/* Growing connection E-F */}
        <line x1="168" y1="300" x2="232" y2="300" stroke="#10b981" strokeWidth="4" opacity="0.9" />

        {/* Neuron F */}
        <circle cx="250" cy="300" r="18" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="2" />
        <text x="250" y="304" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-200">F</text>

        {/* Growing connection F-G */}
        <line x1="268" y1="300" x2="332" y2="300" stroke="#10b981" strokeWidth="3" opacity="0.7" />

        {/* Neuron G */}
        <circle cx="350" cy="300" r="18" className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500" strokeWidth="2" />
        <text x="350" y="304" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-200">G</text>

        <text x="200" y="340" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          New connections grow thicker with each repetition
        </text>

        {/* Meanwhile old pathway weakens */}
        <text x="130" y="175" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-400 dark:fill-slate-500">
          (Old pathway weakens from disuse)
        </text>

        {/* Key insight box */}
        <rect x="310" y="80" width="195" height="90" rx="6"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="407" y="100" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
          Hebb’s Rule
        </text>
        <text x="407" y="118" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          &quot;Neurons that fire together
        </text>
        <text x="407" y="132" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          wire together.&quot;
        </text>
        <text x="407" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Use it or lose it.
        </text>

        {/* Story connection */}
        <rect x="310" y="250" width="195" height="70" rx="6"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="407" y="270" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          Angulimala’s Transformation
        </text>
        <text x="407" y="288" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Old violent pathways weakened.
        </text>
        <text x="407" y="302" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          New compassionate pathways grew.
        </text>

        {/* Bottom label */}
        <text x="260" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-500 dark:fill-slate-400">
          The brain physically changes shape based on what you practice
        </text>
      </svg>
    </div>
  );
}
