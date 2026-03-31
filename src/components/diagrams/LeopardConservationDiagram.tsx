export default function LeopardConservationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 460"
        className="w-full"
        role="img"
        aria-label="Conservation technology diagram showing habitat fragmentation and how wildlife corridors, GPS tracking, and camera traps help protect clouded leopards"
      >
        <rect x="0" y="0" width="600" height="460" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          Why Conservation Needs Technology
        </text>

        {/* Top half: Fragmentation problem */}
        <text x="300" y="52" textAnchor="middle" fontSize="11" className="fill-red-300" fontWeight="600">
          The Problem: Habitat Fragmentation
        </text>

        {/* Forest patches */}
        {[
          { x: 70, y: 110, w: 100, h: 80, label: 'Forest A', pop: '3 leopards' },
          { x: 260, y: 95, w: 80, h: 70, label: 'Forest B', pop: '2 leopards' },
          { x: 430, y: 105, w: 110, h: 85, label: 'Forest C', pop: '4 leopards' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="8" className="fill-emerald-800/50" stroke="#059669" strokeWidth="1.5" />
            <text x={f.x + f.w / 2} y={f.y + 18} textAnchor="middle" fontSize="10" className="fill-emerald-300" fontWeight="600">{f.label}</text>
            <text x={f.x + f.w / 2} y={f.y + 32} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">{f.pop}</text>
            {/* Leopard dots */}
            {Array.from({ length: parseInt(f.pop) }).map((_, j) => (
              <circle key={j} cx={f.x + 25 + j * 22} cy={f.y + f.h - 22} r="6" className="fill-amber-500/70" />
            ))}
          </g>
        ))}

        {/* Barriers between patches */}
        <rect x="175" y="80" width="80" height="120" rx="2" className="fill-gray-700/40" />
        <text x="215" y="145" textAnchor="middle" fontSize="9" className="fill-red-400">Road</text>
        <rect x="345" y="80" width="80" height="120" rx="2" className="fill-amber-800/30" />
        <text x="385" y="145" textAnchor="middle" fontSize="9" className="fill-red-400">Farmland</text>

        {/* Isolated = danger */}
        <text x="300" y="210" textAnchor="middle" fontSize="10" className="fill-red-300">
          Isolated small populations → inbreeding → disease vulnerability → extinction
        </text>

        {/* Divider */}
        <line x1="20" y1="228" x2="580" y2="228" stroke="#4b5563" strokeWidth="1" strokeDasharray="4,3" />

        {/* Bottom half: Technology solutions */}
        <text x="300" y="248" textAnchor="middle" fontSize="11" className="fill-emerald-300" fontWeight="600">
          The Solution: Technology-Driven Conservation
        </text>

        {/* Four solution panels */}
        {[
          {
            x: 20, y: 265, icon: '📡',
            title: 'GPS Collars',
            lines: ['Track movement 24/7', 'Map home ranges', 'Find corridor routes'],
          },
          {
            x: 165, y: 265, icon: '📷',
            title: 'Camera Traps',
            lines: ['ID individuals by spots', 'Count populations', 'Monitor activity times'],
          },
          {
            x: 310, y: 265, icon: '🗺️',
            title: 'GIS Mapping',
            lines: ['Map habitat patches', 'Identify barriers', 'Design corridors'],
          },
          {
            x: 455, y: 265, icon: '📊',
            title: 'Data Analysis',
            lines: ['Population models', 'Viability forecasts', 'Prioritize actions'],
          },
        ].map((panel, i) => (
          <g key={i}>
            <rect x={panel.x} y={panel.y} width="130" height="100" rx="6" className="fill-slate-800/80" stroke="#374151" strokeWidth="1" />
            <text x={panel.x + 65} y={panel.y + 20} textAnchor="middle" fontSize="16">{panel.icon}</text>
            <text x={panel.x + 65} y={panel.y + 38} textAnchor="middle" fontSize="10" className="fill-sky-300" fontWeight="600">{panel.title}</text>
            {panel.lines.map((line, j) => (
              <text key={j} x={panel.x + 65} y={panel.y + 54 + j * 14} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-gray-400">
                {line}
              </text>
            ))}
          </g>
        ))}

        {/* Corridor result */}
        <rect x="20" y="378" width="560" height="70" rx="6" className="fill-emerald-950/40" stroke="#059669" strokeWidth="1" />
        <text x="300" y="398" textAnchor="middle" fontSize="11" className="fill-emerald-300" fontWeight="600">
          Result: Wildlife Corridor
        </text>

        {/* Connected patches */}
        <rect x="60" y="408" width="60" height="28" rx="6" className="fill-emerald-700/50" />
        <text x="90" y="425" textAnchor="middle" fontSize="9" className="fill-emerald-200">A</text>

        <rect x="135" y="415" width="100" height="14" rx="3" className="fill-emerald-600/30" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
        <text x="185" y="425" textAnchor="middle" fontSize="8" className="fill-emerald-400">corridor</text>

        <rect x="250" y="408" width="50" height="28" rx="6" className="fill-emerald-700/50" />
        <text x="275" y="425" textAnchor="middle" fontSize="9" className="fill-emerald-200">B</text>

        <rect x="315" y="415" width="100" height="14" rx="3" className="fill-emerald-600/30" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
        <text x="365" y="425" textAnchor="middle" fontSize="8" className="fill-emerald-400">corridor</text>

        <rect x="430" y="408" width="70" height="28" rx="6" className="fill-emerald-700/50" />
        <text x="465" y="425" textAnchor="middle" fontSize="9" className="fill-emerald-200">C</text>

        {/* Arrow showing gene flow */}
        <text x="300" y="448" textAnchor="middle" fontSize="10" className="fill-amber-300">
          Connected patches = gene flow = healthy populations = survival
        </text>
      </svg>
    </div>
  );
}
