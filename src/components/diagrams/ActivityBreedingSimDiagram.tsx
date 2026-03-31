export default function ActivityBreedingSimDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step offline activity: simulate selective breeding using paper creatures across 3 generations"
      >
        <rect width="780" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">
          Try This: Paper Breeding Simulation
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          See how selecting for one trait changes a population in just 3 rounds
        </text>

        {/* Step 1 */}
        <rect x="30" y="75" width="220" height="180" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="60" cy="100" r="16" fill="#f59e0b" fillOpacity="0.2" />
        <text x="60" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f59e0b">1</text>
        <text x="85" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Draw 20 creatures</text>
        <text x="45" y="130" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Give each 3 random traits:</text>
        {/* Mini creatures */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i} transform={`translate(${50 + i * 38}, 145)`}>
            <circle cx="12" cy="12" r={8 + i * 2} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="6" y1="20" x2="4" y2={28 + i * 3} stroke="#94a3b8" strokeWidth="1" />
            <line x1="18" y1="20" x2="20" y2={28 + i * 3} stroke="#94a3b8" strokeWidth="1" />
          </g>
        ))}
        <text x="45" y="210" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Short legs {'\u2194'} Long legs</text>
        <text x="45" y="224" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Big ears {'\u2194'} Small ears</text>
        <text x="45" y="238" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Spotted {'\u2194'} Plain body</text>

        {/* Arrow 1->2 */}
        <path d="M258,165 L278,165" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#act-arrow)" />

        {/* Step 2 */}
        <rect x="285" y="75" width="210" height="180" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="315" cy="100" r="16" fill="#f59e0b" fillOpacity="0.2" />
        <text x="315" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f59e0b">2</text>
        <text x="340" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Select the tallest 5</text>
        <text x="300" y="130" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Keep the 5 with longest legs.</text>
        <text x="300" y="148" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Remove the other 15.</text>
        {/* Selection visual */}
        <rect x="305" y="165" width="170" height="60" rx="6" fill="#22c55e" fillOpacity="0.08" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2" />
        <text x="390" y="185" textAnchor="middle" fontSize="22">{'\u2705\u2705\u2705\u2705\u2705'}</text>
        <text x="390" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          These 5 are the "parents"
        </text>

        {/* Arrow 2->3 */}
        <path d="M503,165 L523,165" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#act-arrow)" />

        {/* Step 3 */}
        <rect x="530" y="75" width="220" height="180" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="560" cy="100" r="16" fill="#f59e0b" fillOpacity="0.2" />
        <text x="560" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f59e0b">3</text>
        <text x="585" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Draw 20 offspring</text>
        <text x="545" y="130" fontSize="11" className="fill-gray-600 dark:fill-slate-300">New creatures look like parents</text>
        <text x="545" y="148" fontSize="11" className="fill-gray-600 dark:fill-slate-300">but with small random changes.</text>
        {/* Taller creatures */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i} transform={`translate(${550 + i * 38}, 160)`}>
            <circle cx="12" cy="12" r={12 + i} fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="6" y1="20" x2="3" y2={36 + i * 2} stroke="#22c55e" strokeWidth="1" />
            <line x1="18" y1="20" x2="21" y2={36 + i * 2} stroke="#22c55e" strokeWidth="1" />
          </g>
        ))}
        <text x="640" y="240" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">
          Already taller on average!
        </text>

        {/* Repeat callout */}
        <rect x="140" y="280" width="500" height="55" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="302" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">
          Repeat steps 2 and 3 for two more "generations"
        </text>
        <text x="390" y="322" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-amber-300">
          Compare your final generation to the original 20 {'\u2014'} the shift is dramatic!
        </text>

        {/* Generation comparison */}
        <text x="140" y="370" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          What you should see:
        </text>
        {/* Gen 1 bar */}
        <text x="140" y="395" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Gen 0:</text>
        <rect x="200" y="383" width="120" height="16" rx="4" fill="#94a3b8" fillOpacity="0.4" />
        <text x="330" y="396" fontSize="10" className="fill-gray-500 dark:fill-slate-400">avg leg = 5</text>
        {/* Gen 2 bar */}
        <text x="140" y="420" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Gen 1:</text>
        <rect x="200" y="408" width="180" height="16" rx="4" fill="#f59e0b" fillOpacity="0.4" />
        <text x="390" y="421" fontSize="10" fill="#f59e0b">avg leg = 7</text>
        {/* Gen 3 bar */}
        <text x="140" y="445" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Gen 2:</text>
        <rect x="200" y="433" width="230" height="16" rx="4" fill="#22c55e" fillOpacity="0.4" />
        <text x="440" y="446" fontSize="10" fill="#22c55e">avg leg = 8.5</text>
        {/* Gen 4 bar */}
        <text x="140" y="470" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Gen 3:</text>
        <rect x="200" y="458" width="280" height="16" rx="4" fill="#3b82f6" fillOpacity="0.4" />
        <text x="490" y="471" fontSize="10" fill="#3b82f6" fontWeight="600">avg leg = 9.5 {'\u2190'} nearly doubled!</text>

        <defs>
          <marker id="act-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
