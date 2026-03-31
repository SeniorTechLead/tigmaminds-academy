export default function FrogVocalSacDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Frog vocal sac as a resonating chamber: air from lungs vibrates vocal cords and inflates the sac to amplify sound"
      >
        <rect width="700" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Frog Vocal Sac: Nature's Amplifier
        </text>

        {/* Frog body outline */}
        <ellipse cx="350" cy="260" rx="160" ry="100" className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" />

        {/* Eyes */}
        <circle cx="270" cy="190" r="18" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="2" />
        <circle cx="430" cy="190" r="18" className="fill-emerald-200 dark:fill-emerald-800" stroke="#065f46" strokeWidth="2" />
        <circle cx="270" cy="188" r="8" className="fill-gray-800 dark:fill-slate-200" />
        <circle cx="430" cy="188" r="8" className="fill-gray-800 dark:fill-slate-200" />

        {/* Vocal sac - inflated */}
        <ellipse cx="350" cy="340" rx="80" ry="60" className="fill-emerald-200/60 dark:fill-emerald-700/40" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />

        {/* Sound waves emanating from sac */}
        {[40, 55, 70].map((r, i) => (
          <path key={i} d={`M ${350 - r * 1.2} ${340 - r * 0.5} Q ${350} ${340 - r * 0.8} ${350 + r * 1.2} ${340 - r * 0.5}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity={0.7 - i * 0.15} strokeDasharray="4 3" />
        ))}
        {[40, 55, 70].map((r, i) => (
          <path key={`b${i}`} d={`M ${350 - r * 1.3} ${340 + r * 0.3} Q ${350} ${340 + r * 0.7} ${350 + r * 1.3} ${340 + r * 0.3}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity={0.7 - i * 0.15} strokeDasharray="4 3" />
        ))}

        {/* Lungs */}
        <ellipse cx="300" cy="260" rx="35" ry="25" className="fill-rose-100 dark:fill-rose-900/40" stroke="#e11d48" strokeWidth="1.5" />
        <ellipse cx="400" cy="260" rx="35" ry="25" className="fill-rose-100 dark:fill-rose-900/40" stroke="#e11d48" strokeWidth="1.5" />
        <text x="300" y="264" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-rose-700 dark:fill-rose-300">Lung</text>
        <text x="400" y="264" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-rose-700 dark:fill-rose-300">Lung</text>

        {/* Vocal cords */}
        <rect x="340" y="290" width="20" height="6" rx="2" className="fill-purple-400 dark:fill-purple-500" />
        <text x="350" y="286" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">Vocal cords</text>

        {/* Air flow arrows */}
        <path d="M 330 268 C 330 280 342 290 350 293" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue-frog)" />
        <path d="M 370 268 C 370 280 358 290 350 293" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue-frog)" />
        <path d="M 350 296 L 350 320" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrow-blue-frog)" />

        <defs>
          <marker id="arrow-blue-frog" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Labels */}
        <text x="350" y="346" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">
          Vocal Sac (resonator)
        </text>
        <text x="350" y="362" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Amplifies specific frequencies
        </text>

        {/* Comparison: guitar body */}
        <rect x="520" y="100" width="160" height="140" rx="8" className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="600" y="120" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Compare: Guitar</text>
        <ellipse cx="600" cy="170" rx="40" ry="30" className="fill-amber-100 dark:fill-amber-900/40" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="600" cy="170" r="8" fill="none" stroke="#d97706" strokeWidth="1" />
        <text x="600" y="216" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">Sound box amplifies</text>
        <text x="600" y="228" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">string vibrations</text>

        {/* Key fact */}
        <rect x="40" y="420" width="620" height="44" rx="8" className="fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-200 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="350" y="440" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          Larger sac = lower frequency = deeper voice
        </text>
        <text x="350" y="455" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Females assess male body size from pitch alone (100 dB \u2014 as loud as a motorcycle)
        </text>
      </svg>
    </div>
  );
}
