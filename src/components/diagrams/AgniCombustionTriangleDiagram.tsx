export default function AgniCombustionTriangleDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 380"
        className="w-full h-auto"
        role="img"
        aria-label="The combustion triangle showing fuel, oxygen, and heat as three requirements for fire"
      >
        <style>{`
          .act-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .act-label { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .act-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .act-mid { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        {/* Background */}
        <rect width="520" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="28" textAnchor="middle" className="act-title fill-gray-700 dark:fill-gray-200">
          The Combustion Triangle (Fire Triangle)
        </text>

        {/* Triangle */}
        <polygon points="260,70 80,310 440,310"
          className="fill-orange-50 dark:fill-orange-900/20 stroke-orange-500 dark:stroke-orange-400" strokeWidth="2.5" />

        {/* Inner fire glow */}
        <circle cx="260" cy="220" r="45"
          className="fill-orange-400/30 dark:fill-orange-500/20" />
        <circle cx="260" cy="220" r="28"
          className="fill-yellow-400/40 dark:fill-yellow-500/30" />

        {/* Fire label in centre */}
        <text x="260" y="216" textAnchor="middle" className="act-label fill-orange-700 dark:fill-orange-300">
          FIRE
        </text>
        <text x="260" y="232" textAnchor="middle" className="act-small fill-orange-600 dark:fill-orange-400">
          (combustion)
        </text>

        {/* Top vertex: HEAT */}
        <circle cx="260" cy="62" r="28" className="fill-red-100 dark:fill-red-900/40 stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
        <text x="260" y="56" textAnchor="middle" className="act-label fill-red-700 dark:fill-red-300">
          HEAT
        </text>
        <text x="260" y="70" textAnchor="middle" className="act-small fill-red-600 dark:fill-red-400">
          (ignition)
        </text>

        {/* Bottom-left vertex: FUEL */}
        <circle cx="80" cy="318" r="28" className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <text x="80" y="312" textAnchor="middle" className="act-label fill-amber-700 dark:fill-amber-300">
          FUEL
        </text>
        <text x="80" y="326" textAnchor="middle" className="act-small fill-amber-600 dark:fill-amber-400">
          (wood, gas)
        </text>

        {/* Bottom-right vertex: OXYGEN */}
        <circle cx="440" cy="318" r="28" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
        <text x="440" y="312" textAnchor="middle" className="act-label fill-blue-700 dark:fill-blue-300">
          OXYGEN
        </text>
        <text x="440" y="326" textAnchor="middle" className="act-small fill-blue-600 dark:fill-blue-400">
          (from air)
        </text>

        {/* Edge labels */}
        <text x="155" y="180" textAnchor="middle" className="act-small fill-gray-600 dark:fill-gray-400" transform="rotate(-55, 155, 180)">
          Remove fuel → fire dies
        </text>
        <text x="365" y="180" textAnchor="middle" className="act-small fill-gray-600 dark:fill-gray-400" transform="rotate(55, 365, 180)">
          Remove O₂ → fire dies
        </text>
        <text x="260" y="348" textAnchor="middle" className="act-small fill-gray-600 dark:fill-gray-400">
          Remove heat → fire dies
        </text>

        {/* Key insight */}
        <text x="260" y="372" textAnchor="middle" className="act-small fill-gray-500 dark:fill-gray-400">
          Remove ANY one side and the fire goes out — this is how firefighters work
        </text>
      </svg>
    </div>
  );
}
