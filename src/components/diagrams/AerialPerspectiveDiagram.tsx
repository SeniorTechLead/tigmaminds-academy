export default function AerialPerspectiveDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Aerial perspective in art: how painters use blue tinting and reduced contrast to show depth"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Aerial Perspective: From Physics to Art
        </text>

        {/* Painting-style scene showing depth through color */}
        <g transform="translate(390, 60)">
          {/* Sky */}
          <rect x="-340" y="0" width="680" height="200" rx="8" fill="#93c5fd" opacity="0.15" />

          {/* Far mountains - most blue, least contrast */}
          <path d="M -340,200 L -280,80 L -200,120 L -100,60 L 0,100 L 100,50 L 200,90 L 300,70 L 340,200 Z"
            fill="#93c5fd" opacity="0.3" />
          <text x="270" y="90" fontSize="10" className="fill-blue-400 dark:fill-blue-500">Far: blue, faded</text>

          {/* Mid mountains - blue-green */}
          <path d="M -340,200 L -250,120 L -150,150 L -50,100 L 50,140 L 150,110 L 250,130 L 340,200 Z"
            fill="#67e8f9" opacity="0.4" />
          <text x="260" y="140" fontSize="10" className="fill-cyan-500 dark:fill-cyan-400">Mid: blue-green</text>

          {/* Near hills - green with detail */}
          <path d="M -340,200 L -200,150 L -100,170 L 0,145 L 100,165 L 200,155 L 340,200 Z"
            fill="#22c55e" opacity="0.5" />
          <text x="260" y="172" fontSize="10" className="fill-green-500 dark:fill-green-400">Near: green, sharp</text>

          {/* Foreground - most saturated, most detail */}
          <rect x="-340" y="195" width="680" height="10" fill="#15803d" opacity="0.4" />

          {/* Depth arrows */}
          <line x1="-300" y1="210" x2="-300" y2="60" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#depth-arr)" />
          <defs>
            <marker id="depth-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M 0,0 L 8,3 L 0,6 Z" fill="#6b7280" />
            </marker>
          </defs>
          <text x="-310" y="140" textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, -310, 140)">
            increasing distance
          </text>
        </g>

        {/* Rules of aerial perspective */}
        <g transform="translate(390, 285)">
          <rect x="-330" y="0" width="660" height="100" rx="8" className="fill-indigo-50 dark:fill-indigo-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">
            Three Rules of Aerial Perspective (Leonardo da Vinci, c. 1490)
          </text>

          {[
            { label: '1. Colour shifts blue', desc: 'More atmosphere = more blue scattering', x: -200 },
            { label: '2. Contrast decreases', desc: 'Darks become lighter, lights become darker', x: 0 },
            { label: '3. Detail fades', desc: 'Edges blur as light scatters in all directions', x: 200 },
          ].map((rule) => (
            <g key={rule.label} transform={`translate(${rule.x}, 42)`}>
              <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">
                {rule.label}
              </text>
              <text x="0" y="16" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
                {rule.desc}
              </text>
            </g>
          ))}

          <text x="0" y="82" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            Every landscape painter uses these rules to create the illusion of depth on a flat canvas
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          The same Rayleigh scattering that makes Haflong{"\u2019"}s mountains blue is a painting technique used for 500 years
        </text>
      </svg>
    </div>
  );
}
