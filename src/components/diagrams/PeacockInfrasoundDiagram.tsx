export default function PeacockInfrasoundDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Infrasound in peacock displays: tail vibrations at 10 Hz detected by peahen crest feathers"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">
          Infrasound: The Hidden Signal
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Peacock tail vibrations produce sound below human hearing
        </text>

        {/* Frequency spectrum bar */}
        <rect x="60" y="75" width="580" height="50" rx="6" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Infrasound region */}
        <rect x="60" y="78" width="120" height="44" rx="4" fill="#8b5cf6" opacity="0.2" />
        <text x="120" y="96" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">Infrasound</text>
        <text x="120" y="112" textAnchor="middle" fontSize="10" className="fill-purple-600 dark:fill-purple-400">&lt; 20 Hz</text>

        {/* Human hearing region */}
        <rect x="180" y="78" width="320" height="44" rx="4" fill="#3b82f6" opacity="0.15" />
        <text x="340" y="96" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">Human Hearing Range</text>
        <text x="340" y="112" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">20 Hz \u2013 20,000 Hz</text>

        {/* Ultrasound region */}
        <rect x="500" y="78" width="140" height="44" rx="4" fill="#06b6d4" opacity="0.15" />
        <text x="570" y="96" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-cyan-700 dark:fill-cyan-300">Ultrasound</text>
        <text x="570" y="112" textAnchor="middle" fontSize="10" className="fill-cyan-600 dark:fill-cyan-400">&gt; 20,000 Hz</text>

        {/* Peacock marker */}
        <line x1="100" y1="125" x2="100" y2="150" stroke="#8b5cf6" strokeWidth="2" />
        <text x="100" y="165" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-purple-600 dark:fill-purple-400">~10 Hz</text>
        <text x="100" y="178" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Peacock tail</text>

        {/* Peacock display */}
        <g transform="translate(200, 260)">
          {/* Tail fan */}
          {[-50, -35, -20, -5, 10, 25, 40].map((angle, i) => (
            <line key={i} x1="0" y1="0" x2={Math.sin(angle * Math.PI / 180) * 100} y2={-Math.cos(angle * Math.PI / 180) * 100}
              stroke="#1e40af" strokeWidth="2" opacity="0.5" />
          ))}
          {/* Body */}
          <ellipse cx="0" cy="20" rx="18" ry="28" className="fill-blue-600 dark:fill-blue-500" />
          <circle cx="0" cy="-12" r="10" className="fill-blue-500 dark:fill-blue-400" />
          {/* Crest */}
          <line x1="-3" y1="-22" x2="-6" y2="-32" stroke="#1e40af" strokeWidth="1.5" />
          <line x1="0" y1="-22" x2="0" y2="-34" stroke="#1e40af" strokeWidth="1.5" />
          <line x1="3" y1="-22" x2="6" y2="-32" stroke="#1e40af" strokeWidth="1.5" />
        </g>

        {/* Vibration waves from tail */}
        {[30, 50, 70].map((r, i) => (
          <circle key={i} cx="200" cy="240" r={r} fill="none" stroke="#8b5cf6" strokeWidth="1" opacity={0.5 - i * 0.12} strokeDasharray="4 4" />
        ))}
        <text x="200" y="340" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">
          Tail vibrates \u2192 infrasound waves
        </text>

        {/* Peahen receiving */}
        <g transform="translate(480, 260)">
          <ellipse cx="0" cy="20" rx="15" ry="24" className="fill-amber-600 dark:fill-amber-700" />
          <circle cx="0" cy="-8" r="9" className="fill-amber-500 dark:fill-amber-600" />
          {/* Crest feathers - highlighted as receivers */}
          <line x1="-3" y1="-17" x2="-6" y2="-30" stroke="#f59e0b" strokeWidth="2" />
          <line x1="0" y1="-17" x2="0" y2="-32" stroke="#f59e0b" strokeWidth="2" />
          <line x1="3" y1="-17" x2="6" y2="-30" stroke="#f59e0b" strokeWidth="2" />
          {/* Resonance indicator */}
          {[-10, 0, 10].map((dx, i) => (
            <path key={i} d={`M ${dx - 5 - 3} ${-35 - i * 2} Q ${dx - 3} ${-40 - i * 2} ${dx + 5 - 3} ${-35 - i * 2}`}
              fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
          ))}
        </g>
        <text x="480" y="340" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">
          Crest feathers resonate at ~10 Hz
        </text>
        <text x="480" y="356" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Like tiny antennas tuned to the signal
        </text>

        {/* Arrow showing signal path */}
        <defs>
          <marker id="arrow-purple-pi" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>
        <line x1="280" y1="260" x2="440" y2="260" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrow-purple-pi)" strokeDasharray="6 4" />
        <text x="360" y="252" textAnchor="middle" fontSize="10" className="fill-purple-500 dark:fill-purple-400">Infrasound at 10 Hz</text>

        {/* Key insight */}
        <rect x="60" y="400" width="580" height="48" rx="8" className="fill-purple-50 dark:fill-purple-950/30 stroke-purple-200 dark:stroke-purple-800" strokeWidth="1" />
        <text x="350" y="420" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">
          We see the display. Peahens also FEEL it.
        </text>
        <text x="350" y="438" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The tail is a visual AND acoustic signal \u2014 a dual-channel communication system
        </text>
      </svg>
    </div>
  );
}
