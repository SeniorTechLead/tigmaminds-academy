export default function ActivityHerbIdentifyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 380" className="w-full max-w-2xl mx-auto" role="img" aria-label="Offline activity: identify local plants using leaf shape, smell, and a simple key">
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Activity: Be a Plant Detective
        </text>
        <text x="260" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Collect 5 leaves from your yard. Observe and classify them.
        </text>

        {/* Step 1: Collect */}
        <rect x="20" y="60" width="150" height="90" rx="10"
          className="fill-green-100 dark:fill-green-900/30 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
        <text x="95" y="80" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">1. Collect</text>
        <text x="95" y="96" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Pick 5 different leaves</text>
        <text x="95" y="108" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">from plants near you.</text>
        <text x="95" y="120" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Press flat in a book.</text>
        {/* Leaf icon */}
        <ellipse cx="95" cy="138" rx="12" ry="7" className="fill-green-400 dark:fill-green-500" transform="rotate(-20 95 138)" />

        {/* Step 2: Observe */}
        <rect x="185" y="60" width="150" height="90" rx="10"
          className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
        <text x="260" y="80" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">2. Observe</text>
        <text x="260" y="96" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Shape: oval? heart? lance?</text>
        <text x="260" y="108" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Edge: smooth or toothed?</text>
        <text x="260" y="120" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Vein pattern: parallel or net?</text>
        {/* Eye icon */}
        <circle cx="260" cy="138" r="7" className="fill-blue-300 dark:fill-blue-500 stroke-blue-500" strokeWidth="1" />
        <circle cx="260" cy="138" r="3" className="fill-blue-600 dark:fill-blue-300" />

        {/* Step 3: Record */}
        <rect x="350" y="60" width="150" height="90" rx="10"
          className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <text x="425" y="80" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="11" fontWeight="bold">3. Record</text>
        <text x="425" y="96" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Draw each leaf.</text>
        <text x="425" y="108" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Note smell, texture.</text>
        <text x="425" y="120" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Measure length in cm.</text>
        {/* Pencil icon */}
        <line x1="420" y1="140" x2="432" y2="128" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" />
        <circle cx="432" cy="128" r="2" className="fill-amber-600 dark:fill-amber-400" />

        {/* Recording table */}
        <rect x="40" y="175" width="440" height="125" rx="8"
          className="fill-gray-50 dark:fill-gray-800/40 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="260" y="195" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Your Plant Data Table</text>

        {/* Header row */}
        <line x1="60" y1="205" x2="460" y2="205" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        {['Leaf #', 'Shape', 'Edge', 'Veins', 'Smell', 'Length'].map((h, i) => (
          <text key={i} x={90 + i * 70} y="218" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontWeight="bold">{h}</text>
        ))}
        <line x1="60" y1="222" x2="460" y2="222" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="0.5" />

        {/* Example row */}
        {['1', 'Oval', 'Smooth', 'Net', 'Minty', '6 cm'].map((v, i) => (
          <text key={i} x={90 + i * 70} y="237" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontStyle="italic">{v}</text>
        ))}
        {[242, 252, 262, 272].map((y, i) => (
          <g key={i}>
            <text x={90} y={y} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">{i + 2}</text>
            <line x1="115" y1={y - 3} x2="460" y2={y - 3} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="3 3" />
          </g>
        ))}

        {/* Bottom instruction */}
        <rect x="60" y="310" width="400" height="50" rx="8"
          className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1" />
        <text x="260" y="330" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="bold">Challenge: Build Your Own Key</text>
        <text x="260" y="346" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">
          Write yes/no questions that separate your 5 leaves into unique groups.
        </text>
      </svg>
    </div>
  );
}
