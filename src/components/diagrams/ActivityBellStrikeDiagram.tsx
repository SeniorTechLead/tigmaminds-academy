export default function ActivityBellStrikeDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 320"
        className="w-full h-auto"
        role="img"
        aria-label="Activity diagram showing how to explore bell sounds with household objects"
      >
        <style>{`
          .abs-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .abs-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .abs-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .abs-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="560" height="320" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" className="abs-title fill-gray-700 dark:fill-gray-200">
          Activity: Strike, Listen, Compare
        </text>

        {/* Step 1: Gather objects */}
        <rect x="20" y="45" width="160" height="120" rx="6"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-600" strokeWidth="1" />
        <text x="100" y="64" textAnchor="middle" className="abs-bold fill-amber-700 dark:fill-amber-300">
          Step 1: Gather
        </text>

        {/* Glass icon */}
        <rect x="40" y="78" width="20" height="32" rx="2"
          className="fill-blue-100 dark:fill-blue-800 stroke-blue-400" strokeWidth="1" />
        <text x="50" y="125" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Glass
        </text>

        {/* Pot icon */}
        <ellipse cx="95" cy="90" rx="18" ry="12"
          className="fill-gray-200 dark:fill-gray-700 stroke-gray-400" strokeWidth="1" />
        <rect x="77" y="90" width="36" height="18" rx="1"
          className="fill-gray-200 dark:fill-gray-700 stroke-gray-400" strokeWidth="1" />
        <text x="95" y="125" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Pot
        </text>

        {/* Spoon icon */}
        <line x1="140" y1="80" x2="140" y2="108"
          className="stroke-gray-400 dark:stroke-gray-300" strokeWidth="3" />
        <ellipse cx="140" cy="78" rx="8" ry="5"
          className="fill-gray-300 dark:fill-gray-600 stroke-gray-400" strokeWidth="1" />
        <text x="140" y="125" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Spoon
        </text>

        {/* Step 2: Strike and listen */}
        <rect x="200" y="45" width="160" height="120" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x="280" y="64" textAnchor="middle" className="abs-bold fill-blue-700 dark:fill-blue-300">
          Step 2: Strike
        </text>
        <text x="280" y="82" textAnchor="middle" className="abs-small fill-gray-600 dark:fill-gray-300">
          Tap each with a spoon
        </text>
        <text x="280" y="98" textAnchor="middle" className="abs-small fill-gray-600 dark:fill-gray-300">
          Listen: which is higher?
        </text>
        <text x="280" y="114" textAnchor="middle" className="abs-small fill-gray-600 dark:fill-gray-300">
          Which rings longer?
        </text>

        {/* Sound wave animation hints */}
        {[0, 1, 2].map(i => (
          <path key={i}
            d={`M ${248 + i * 8} ${128} Q ${252 + i * 8} ${140} ${248 + i * 8} ${152}`}
            fill="none" className="stroke-blue-400 dark:stroke-blue-300"
            strokeWidth="1" opacity={0.7 - i * 0.2} />
        ))}

        {/* Step 3: Water test */}
        <rect x="380" y="45" width="160" height="120" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="460" y="64" textAnchor="middle" className="abs-bold fill-emerald-700 dark:fill-emerald-300">
          Step 3: Add Water
        </text>

        {/* Glass with water levels */}
        <rect x="410" y="82" width="24" height="40" rx="2"
          className="fill-blue-100 dark:fill-blue-800 stroke-blue-400" strokeWidth="1" />
        <rect x="412" y="104" width="20" height="16" rx="1"
          className="fill-blue-300 dark:fill-blue-500" opacity="0.5" />
        <text x="422" y="135" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Low
        </text>

        <rect x="448" y="82" width="24" height="40" rx="2"
          className="fill-blue-100 dark:fill-blue-800 stroke-blue-400" strokeWidth="1" />
        <rect x="450" y="92" width="20" height="28" rx="1"
          className="fill-blue-300 dark:fill-blue-500" opacity="0.5" />
        <text x="460" y="135" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Med
        </text>

        <rect x="486" y="82" width="24" height="40" rx="2"
          className="fill-blue-100 dark:fill-blue-800 stroke-blue-400" strokeWidth="1" />
        <rect x="488" y="85" width="20" height="35" rx="1"
          className="fill-blue-300 dark:fill-blue-500" opacity="0.5" />
        <text x="498" y="135" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          Full
        </text>

        {/* Result box */}
        <rect x="20" y="180" width="520" height="60" rx="6"
          className="fill-violet-50 dark:fill-violet-900/20 stroke-violet-300 dark:stroke-violet-600" strokeWidth="1" />
        <text x="280" y="200" textAnchor="middle" className="abs-bold fill-violet-700 dark:fill-violet-300">
          What to record
        </text>
        <text x="280" y="218" textAnchor="middle" className="abs-small fill-violet-600 dark:fill-violet-400">
          Object → Pitch (high/medium/low) → Duration (short/long) → Water level effect
        </text>
        <text x="280" y="232" textAnchor="middle" className="abs-small fill-gray-500 dark:fill-gray-400">
          More water = less vibrating material = higher pitch. Touch the glass while ringing to feel the vibration stop.
        </text>

        {/* Key takeaway */}
        <rect x="20" y="252" width="520" height="55" rx="6"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-600" strokeWidth="1" />
        <text x="280" y="272" textAnchor="middle" className="abs-bold fill-amber-700 dark:fill-amber-300">
          Key Takeaway
        </text>
        <text x="280" y="290" textAnchor="middle" className="abs-small fill-gray-600 dark:fill-gray-300">
          Sound is vibration. Bigger/heavier objects vibrate slower (low pitch). Touch a ringing glass
        </text>
        <text x="280" y="302" textAnchor="middle" className="abs-small fill-gray-600 dark:fill-gray-300">
          and the sound stops — because you stopped the vibration. No vibration = no sound.
        </text>
      </svg>
    </div>
  );
}
