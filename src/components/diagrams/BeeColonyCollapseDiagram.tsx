export default function BeeColonyCollapseDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 430" className="w-full max-w-2xl mx-auto" role="img" aria-label="Colony collapse disorder diagram showing threats from pesticides, mites, and habitat loss">
        <rect width="560" height="430" rx="12" className="fill-slate-900" />

        <text x="280" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ef4444">Colony Collapse Disorder</text>
        <text x="280" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Multiple stressors threatening bee populations worldwide</text>

        {/* Central hive — weakening */}
        <g transform="translate(280, 200)">
          <circle cx="0" cy="0" r="50" fill="#78350f" opacity="0.15" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
          <polygon points="-20,-15 0,-30 20,-15 20,10 -20,10" fill="#a16207" opacity="0.3" stroke="#d97706" strokeWidth="1" />
          <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Colony</text>
          <text x="0" y="18" textAnchor="middle" fontSize="10" fill="#ef4444">Under stress</text>
          {/* Danger pulse */}
          <circle cx="0" cy="0" r="55" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.2">
            <animate attributeName="r" values="50;65;50" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Threat 1: Pesticides — top left */}
        <g transform="translate(105, 110)">
          <rect x="-70" y="-30" width="140" height="75" rx="8" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Pesticides</text>
          {/* Spray droplets */}
          {[[-20, 5], [-8, 10], [5, 3], [18, 12], [-15, 20], [10, 22]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="3" fill="#ef4444" opacity="0.3" />
          ))}
          <text x="0" y="52" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Neonicotinoids disrupt</text>
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">navigation &amp; immunity</text>
        </g>
        {/* Arrow to hive */}
        <line x1="155" y1="140" x2="230" y2="180" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

        {/* Threat 2: Varroa Mites — top right */}
        <g transform="translate(455, 110)">
          <rect x="-70" y="-30" width="140" height="75" rx="8" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Varroa Mites</text>
          {/* Mite on bee */}
          <ellipse cx="-10" cy="10" rx="14" ry="9" fill="#eab308" opacity="0.5" />
          {/* Mite */}
          <ellipse cx="-5" cy="5" rx="6" ry="5" fill="#991b1b" opacity="0.8" />
          <circle cx="-7" cy="3" r="1" fill="#fca5a5" />
          <circle cx="-3" cy="3" r="1" fill="#fca5a5" />
          <text x="0" y="52" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Parasites feed on bee</text>
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">blood, spread viruses</text>
        </g>
        <line x1="405" y1="140" x2="330" y2="180" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

        {/* Threat 3: Habitat Loss — bottom left */}
        <g transform="translate(105, 300)">
          <rect x="-70" y="-30" width="140" height="75" rx="8" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Habitat Loss</text>
          {/* Monoculture field */}
          <rect x="-35" y="0" width="70" height="25" rx="3" fill="#78350f" opacity="0.2" />
          {[-25, -15, -5, 5, 15, 25].map((xOff, i) => (
            <line key={i} x1={xOff} y1="0" x2={xOff} y2="25" stroke="#22c55e" strokeWidth="2" opacity="0.3" />
          ))}
          <text x="0" y="52" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Monoculture farming</text>
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">eliminates wildflowers</text>
        </g>
        <line x1="155" y1="280" x2="230" y2="230" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

        {/* Threat 4: Climate Change — bottom right */}
        <g transform="translate(455, 300)">
          <rect x="-70" y="-30" width="140" height="75" rx="8" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="1" />
          <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Climate Change</text>
          {/* Temperature arrow */}
          <line x1="-20" y1="20" x2="20" y2="0" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="20,0 14,-4 14,4" fill="#f59e0b" />
          <text x="0" y="52" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bloom timing mismatch</text>
          <text x="0" y="65" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">with bee emergence</text>
        </g>
        <line x1="405" y1="280" x2="330" y2="230" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

        {/* Statistics bar at bottom */}
        <g transform="translate(280, 405)">
          <text x="-195" y="0" fontSize="10" fontWeight="bold" fill="#ef4444">40%</text>
          <text x="-155" y="0" fontSize="10" className="fill-gray-500 dark:fill-slate-400">of insect pollinators face extinction</text>
          <text x="85" y="0" fontSize="10" fontWeight="bold" fill="#ef4444">| 30%</text>
          <text x="120" y="0" fontSize="10" className="fill-gray-500 dark:fill-slate-400">US colonies lost yearly</text>
        </g>
      </svg>
    </div>
  );
}
