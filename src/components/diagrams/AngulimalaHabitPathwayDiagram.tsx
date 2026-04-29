export default function AngulimalaHabitPathwayDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 520 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing habit formation as a neural loop: cue, routine, reward, and the basal ganglia habit loop"
      >
        <defs>
          <marker id="hp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
          </marker>
        </defs>

        <rect width="520" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          The Habit Loop — How Neural Pathways Automate Behaviour
        </text>

        {/* Habit loop circle */}
        {/* Cue */}
        <circle cx="260" cy="100" r="40" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-500" strokeWidth="2" />
        <text x="260" y="96" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">CUE</text>
        <text x="260" y="110" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">Trigger</text>

        {/* Routine */}
        <circle cx="400" cy="220" r="40" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-500" strokeWidth="2" />
        <text x="400" y="216" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">ROUTINE</text>
        <text x="400" y="230" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-600 dark:fill-blue-400">Behaviour</text>

        {/* Reward */}
        <circle cx="120" cy="220" r="40" className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-500" strokeWidth="2" />
        <text x="120" y="216" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">REWARD</text>
        <text x="120" y="230" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">Dopamine</text>

        {/* Arrows between loop nodes */}
        <path d="M 295 115 Q 360 140 385 185" fill="none" stroke="#a78bfa" strokeWidth="2.5"
          markerEnd="url(#hp-arrow)" />
        <path d="M 365 240 Q 300 280 170 240" fill="none" stroke="#a78bfa" strokeWidth="2.5"
          markerEnd="url(#hp-arrow)" />
        <path d="M 135 185 Q 160 140 225 105" fill="none" stroke="#a78bfa" strokeWidth="2.5"
          markerEnd="url(#hp-arrow)" />

        {/* Centre label */}
        <text x="260" y="200" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">
          Basal Ganglia
        </text>
        <text x="260" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          (automates repeated loops)
        </text>

        {/* Repetition strengthens */}
        <text x="340" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400" transform="rotate(-30,340,170)">
          Each repetition
        </text>

        {/* Bottom: old vs new habit comparison */}
        <line x1="20" y1="290" x2="500" y2="290" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Old habit */}
        <rect x="30" y="305" width="220" height="95" rx="6"
          className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-800" strokeWidth="1" />
        <text x="140" y="325" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          Angulimala’s Old Loop
        </text>
        <text x="140" y="345" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Cue: Fear/anger → Routine: Violence
        </text>
        <text x="140" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Reward: Sense of power
        </text>
        <text x="140" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">
          ✘ Deeply grooved pathway
        </text>

        {/* New habit */}
        <rect x="270" y="305" width="230" height="95" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="385" y="325" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">
          Angulimala’s New Loop
        </text>
        <text x="385" y="345" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Cue: Same trigger → Routine: Compassion
        </text>
        <text x="385" y="360" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Reward: Inner peace
        </text>
        <text x="385" y="385" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-emerald-500 dark:fill-emerald-400">
          ✔ New pathway built through practice
        </text>
      </svg>
    </div>
  );
}
