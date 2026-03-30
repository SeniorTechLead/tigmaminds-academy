export default function OceanCurrentDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" role="img"
        aria-label="Diagram showing thermohaline ocean circulation as a global conveyor belt">
        <rect width="520" height="400" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Ocean Currents: Rivers Inside the Ocean
        </text>
        <text x="260" y="44" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
          The Great Ocean Conveyor Belt (thermohaline circulation)
        </text>

        {/* Simplified ocean cross-section */}
        {/* Surface water — warm */}
        <rect x="30" y="80" width="460" height="60" rx="4" className="fill-red-100 dark:fill-red-900/20" />
        <text x="50" y="100" fontSize="10" fontWeight="bold" className="fill-red-600 dark:fill-red-400">WARM SURFACE</text>
        <text x="50" y="115" fontSize="10" className="fill-red-500 dark:fill-red-400">Heated by the Sun near the equator</text>

        {/* Deep water — cold */}
        <rect x="30" y="140" width="460" height="120" rx="4" className="fill-blue-100 dark:fill-blue-900/20" />
        <text x="50" y="165" fontSize="10" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">COLD DEEP WATER</text>
        <text x="50" y="180" fontSize="10" className="fill-blue-500 dark:fill-blue-400">Dense, salty, cold water sinks near the poles</text>

        {/* Warm surface current — flowing right */}
        <path d="M 60,105 Q 150,95 260,105 Q 370,115 460,100" fill="none" stroke="#ef4444" strokeWidth="3" />
        {/* Arrow heads */}
        <polygon points="460,100 448,94 448,106" fill="#ef4444" />
        <text x="260" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Warm current flows toward poles →</text>

        {/* Sinking at poles */}
        <path d="M 465,105 Q 475,140 465,200" fill="none" stroke="#a78bfa" strokeWidth="3" />
        <polygon points="465,200 459,188 471,188" fill="#a78bfa" />
        <text x="490" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a78bfa" transform="rotate(90, 490, 155)">SINKS</text>

        {/* Cold deep current — flowing left */}
        <path d="M 460,210 Q 370,220 260,210 Q 150,200 60,215" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <polygon points="60,215 72,209 72,221" fill="#3b82f6" />
        <text x="260" y="235" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">← Cold current flows along the deep ocean floor</text>

        {/* Rising at equator */}
        <path d="M 55,210 Q 45,175 55,110" fill="none" stroke="#10b981" strokeWidth="3" />
        <polygon points="55,110 49,122 61,122" fill="#10b981" />
        <text x="30" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981" transform="rotate(-90, 30, 165)">RISES</text>

        {/* Labels for poles and equator */}
        <text x="475" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Poles</text>
        <text x="45" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">Equator</text>

        {/* Explanation boxes */}
        <rect x="30" y="275" width="150" height="110" rx="8" className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="105" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-red-600 dark:fill-red-400">Why it moves</text>
        <text x="105" y="313" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Sun heats equatorial</text>
        <text x="105" y="327" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">water. Warm water is</text>
        <text x="105" y="341" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">less dense, so it flows</text>
        <text x="105" y="355" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">along the surface.</text>
        <text x="105" y="373" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">Temperature difference</text>

        <rect x="195" y="275" width="140" height="110" rx="8" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="265" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">Why it sinks</text>
        <text x="265" y="313" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">At the poles, water</text>
        <text x="265" y="327" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">cools and ice forms,</text>
        <text x="265" y="341" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">leaving salt behind.</text>
        <text x="265" y="355" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Cold + salty = dense.</text>
        <text x="265" y="373" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">Salinity difference</text>

        <rect x="350" y="275" width="140" height="110" rx="8" className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="420" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">Why it matters</text>
        <text x="420" y="313" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Carries heat from</text>
        <text x="420" y="327" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">the tropics to the</text>
        <text x="420" y="341" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">poles. One full loop</text>
        <text x="420" y="355" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">takes ~1,000 years!</text>
        <text x="420" y="373" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-emerald-500 dark:fill-emerald-400">Climate regulation</text>
      </svg>
    </div>
  );
}
