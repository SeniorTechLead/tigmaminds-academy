/**
 * MuezzinCityPropagationDiagram — Sound propagation through a city:
 * diffraction around buildings, reflection off walls, absorption by surfaces.
 */
export default function MuezzinCityPropagationDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 460 280" className="w-full" role="img" aria-label="Sound propagation in a city showing diffraction, reflection, and absorption">
        <rect width="420" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="210" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Sound Travelling Through a City</text>

        {/* Minaret */}
        <rect x="30" y="80" width="16" height="120" fill="#a16207" opacity="0.6" />
        <rect x="26" y="72" width="24" height="12" rx="3" fill="#ca8a04" />
        <circle cx="38" cy="66" r="8" fill="#f59e0b" opacity="0.8" />
        <text x="38" y="69" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">♪</text>
        <text x="38" y="212" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Minaret</text>

        {/* Ground line */}
        <line x1="0" y1="200" x2="420" y2="200" stroke="#64748b" strokeWidth="1" />

        {/* Building 1 */}
        <rect x="110" y="130" width="40" height="70" rx="2" fill="#475569" opacity="0.5" />
        <text x="130" y="165" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bldg</text>

        {/* Building 2 */}
        <rect x="200" y="110" width="50" height="90" rx="2" fill="#475569" opacity="0.5" />
        <text x="225" y="155" textAnchor="middle" fill="#e2e8f0" fontSize="10">Bldg</text>

        {/* Building 3 (smaller) */}
        <rect x="310" y="150" width="35" height="50" rx="2" fill="#475569" opacity="0.5" />

        {/* Direct sound wave (line of sight, blocked) */}
        <line x1="50" y1="90" x2="110" y2="135" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="80" y="100" fill="#ef4444" fontSize="9">Blocked!</text>

        {/* Diffraction around building 1 */}
        <path d="M 50 80 Q 80 70, 110 80 Q 130 85, 150 100 Q 165 110, 170 130" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M 50 95 Q 80 120, 110 130 Q 130 145, 145 170 Q 155 185, 170 190" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="155" y="88" fill="#3b82f6" fontSize="9" fontWeight="bold">Diffraction</text>
        <text x="155" y="99" fill="#3b82f6" fontSize="9">(bends around)</text>

        {/* Reflection off building 2 */}
        <line x1="50" y1="75" x2="200" y2="120" stroke="#10b981" strokeWidth="1.5" />
        <line x1="200" y1="120" x2="280" y2="170" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx="200" cy="120" r="3" fill="#10b981" />
        <text x="265" y="140" fill="#10b981" fontSize="9" fontWeight="bold">Reflection</text>

        {/* Absorption by soft surface */}
        <rect x="310" y="170" width="35" height="5" fill="#a78bfa" opacity="0.5" />
        <text x="370" y="178" className="fill-purple-600 dark:fill-purple-400" fontSize="9" fontWeight="bold">Absorption</text>
        <text x="370" y="190" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(carpet, garden)</text>

        {/* Listener */}
        <circle cx="380" cy="190" r="6" className="fill-gray-600 dark:fill-slate-400" />
        <line x1="380" y1="196" x2="380" y2="200" className="stroke-gray-600 dark:stroke-slate-400" strokeWidth="2" />
        <text x="380" y="215" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Listener</text>

        {/* Height advantage explanation */}
        <path d="M 46 66 L 380 155" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="210" y="55" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">Height clears obstacles → direct path</text>

        {/* Legend */}
        <g transform="translate(20,230)">
          <line x1="0" y1="8" x2="20" y2="8" stroke="#3b82f6" strokeWidth="2" />
          <text x="25" y="12" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Diffraction (bending)</text>
          <line x1="140" y1="8" x2="160" y2="8" stroke="#10b981" strokeWidth="2" />
          <text x="165" y="12" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Reflection (bouncing)</text>
          <rect x="280" y="3" width="15" height="10" fill="#a78bfa" opacity="0.5" />
          <text x="300" y="12" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Absorption (dampening)</text>
        </g>

        <text x="210" y="265" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">A 30m minaret gives a clear acoustic path over most city buildings</text>
      </svg>
    </div>
  );
}
