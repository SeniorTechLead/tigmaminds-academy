export default function EriLifeCycleDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Eri silkworm complete metamorphosis life cycle: egg, larva, pupa in cocoon, adult moth"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
          .glow { animation: pulse 2.5s ease-in-out infinite; }
          @keyframes flutter { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(3deg); } }
          .flutter { animation: flutter 2s ease-in-out infinite; transform-origin: center; }
        `}</style>

        <rect width="620" height="420" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="30" textAnchor="middle" className="title fill-emerald-700 dark:fill-emerald-300">
          Eri Silkworm Life Cycle — Complete Metamorphosis
        </text>

        {/* Center circle */}
        <circle cx="310" cy="220" r="55" fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3" className="dark:stroke-emerald-600" />
        <text x="310" y="216" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Holometabolism</text>
        <text x="310" y="230" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">(4 stages)</text>

        {/* Stage 1: Eggs (top-left) */}
        <g>
          <text x="130" y="80" textAnchor="middle" className="label fill-amber-600 dark:fill-amber-300" fontWeight="700">1. Eggs</text>
          {[0,1,2,3,4,5].map(i => (
            <ellipse key={i} cx={110 + (i % 3) * 16} cy={100 + Math.floor(i / 3) * 14} rx="5" ry="3.5"
              fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          ))}
          <text x="130" y="138" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">200–300 eggs</text>
          <text x="130" y="150" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">on castor leaves</text>
        </g>

        {/* Arrow 1→2 */}
        <path d="M 180 120 Q 230 100 280 120" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-arrow)" />

        {/* Stage 2: Larva (top-right) */}
        <g>
          <text x="470" y="80" textAnchor="middle" className="label fill-green-600 dark:fill-green-300" fontWeight="700">2. Larva (Caterpillar)</text>
          {/* Caterpillar body */}
          <g className="glow">
            {[0,1,2,3,4].map(i => (
              <circle key={i} cx={430 + i * 18} cy={110} r="9" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
            ))}
            <circle cx={430 + 5 * 18} cy={110} r="7" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
            <circle cx={430 + 5 * 18 - 2} cy={106} r="1.5" fill="#1a1a1a" />
          </g>
          <text x="470" y="138" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">5 instars, eats castor</text>
          <text x="470" y="150" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">leaves for 25–30 days</text>
        </g>

        {/* Arrow 2→3 */}
        <path d="M 470 165 Q 500 230 470 290" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-arrow)" />

        {/* Stage 3: Pupa/Cocoon (bottom-right) */}
        <g>
          <text x="470" y="310" textAnchor="middle" className="label fill-stone-600 dark:fill-stone-300" fontWeight="700">3. Pupa (Cocoon)</text>
          {/* Cocoon shape */}
          <ellipse cx="470" cy="350" rx="35" ry="22" fill="#e8d5b7" stroke="#a3845c" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-600" />
          <ellipse cx="470" cy="350" rx="25" ry="15" fill="none" stroke="#c9a96e" strokeWidth="0.8" strokeDasharray="3,2" />
          {/* Open end indicator */}
          <path d="M 504 345 Q 510 350 504 355" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <text x="530" y="348" className="small fill-red-500 dark:fill-red-400">open end!</text>
          <text x="470" y="392" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Open cocoon — moth</text>
          <text x="470" y="404" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">can exit alive</text>
        </g>

        {/* Arrow 3→4 */}
        <path d="M 420 350 Q 350 380 280 350" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-arrow)" />

        {/* Stage 4: Adult Moth (bottom-left) */}
        <g className="flutter">
          <text x="130" y="290" textAnchor="middle" className="label fill-purple-600 dark:fill-purple-300" fontWeight="700">4. Adult Moth</text>
          {/* Moth body */}
          <ellipse cx="130" cy="335" rx="8" ry="18" fill="#d4c5a9" stroke="#8b7355" strokeWidth="1" className="dark:fill-stone-600 dark:stroke-stone-400" />
          {/* Wings */}
          <ellipse cx="100" cy="328" rx="25" ry="16" fill="#f5e6d3" stroke="#c9a96e" strokeWidth="1" opacity="0.8" className="dark:fill-stone-700/60" />
          <ellipse cx="160" cy="328" rx="25" ry="16" fill="#f5e6d3" stroke="#c9a96e" strokeWidth="1" opacity="0.8" className="dark:fill-stone-700/60" />
          {/* Antennae */}
          <path d="M 126 317 Q 120 300 112 295" fill="none" stroke="#8b7355" strokeWidth="1" className="dark:stroke-stone-400" />
          <path d="M 134 317 Q 140 300 148 295" fill="none" stroke="#8b7355" strokeWidth="1" className="dark:stroke-stone-400" />
          {/* Feathery tips */}
          <circle cx="112" cy="295" r="3" fill="none" stroke="#8b7355" strokeWidth="0.8" className="dark:stroke-stone-400" />
          <circle cx="148" cy="295" r="3" fill="none" stroke="#8b7355" strokeWidth="0.8" className="dark:stroke-stone-400" />
        </g>
        <text x="130" y="373" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Emerges alive!</text>
        <text x="130" y="385" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Lays eggs → cycle repeats</text>

        {/* Arrow 4→1 */}
        <path d="M 130 260 Q 110 200 130 165" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-arrow)" />

        {/* Key insight box */}
        <rect x="220" y="260" width="180" height="40" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/20 dark:stroke-emerald-700" />
        <text x="310" y="278" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300" fontWeight="600">Ahimsa = moth lives</text>
        <text x="310" y="292" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300">Silk harvested AFTER exit</text>

        <defs>
          <marker id="eri-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
