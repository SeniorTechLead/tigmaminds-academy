export default function BoatRowingBiomechanicsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Rowing biomechanics: lever action of oar, catch and drive phases, efficiency"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
          Rowing Biomechanics: The Oar as a Lever
        </text>

        {/* Lever diagram */}
        <g transform="translate(390, 120)">
          {/* Oarlock (fulcrum) */}
          <polygon points="0,-5 -8,10 8,10" fill="#6b7280" />
          <text x="0" y="28" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Fulcrum (oarlock)</text>

          {/* Oar shaft */}
          <line x1="-180" y1="0" x2="140" y2="0" stroke="#92400e" strokeWidth="4" />

          {/* Effort (rower's hand) */}
          <g transform="translate(-160, 0)">
            <circle cx="0" cy="0" r="10" fill="#3b82f6" opacity="0.3" />
            <line x1="0" y1="0" x2="0" y2="-35" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#effort-arr)" />
            <defs>
              <marker id="effort-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#3b82f6" />
              </marker>
            </defs>
            <text x="0" y="-42" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Effort</text>
            <text x="0" y="-30" textAnchor="middle" fontSize="9" className="fill-blue-500 dark:fill-blue-400">(rower pulls)</text>
          </g>

          {/* Load (water resistance) */}
          <g transform="translate(120, 0)">
            {/* Blade */}
            <rect x="-5" y="-12" width="30" height="24" rx="3" fill="#0891b2" opacity="0.5" />
            <line x1="15" y1="0" x2="15" y2="35" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#load-arr)" />
            <defs>
              <marker id="load-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M 0,0 L 8,3 L 0,6 Z" fill="#ef4444" />
              </marker>
            </defs>
            <text x="15" y="50" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-red-500 dark:fill-red-400">Load</text>
            <text x="15" y="62" textAnchor="middle" fontSize="9" className="fill-red-400 dark:fill-red-400">(water pushes back)</text>
          </g>

          {/* Lever arms labeled */}
          <line x1="-160" y1="15" x2="0" y2="15" stroke="#3b82f6" strokeWidth="1" />
          <text x="-80" y="30" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">inboard length</text>
          <line x1="0" y1="15" x2="120" y2="15" stroke="#ef4444" strokeWidth="1" />
          <text x="60" y="30" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">outboard length</text>
        </g>

        {/* Stroke phases */}
        <g transform="translate(390, 215)">
          <text x="0" y="0" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            The Rowing Stroke: Four Phases
          </text>

          {[
            { x: -280, name: 'Catch', desc: 'Blade enters water\nat full reach', color: '#3b82f6' },
            { x: -95, name: 'Drive', desc: 'Legs push, back swings,\narms pull', color: '#22c55e' },
            { x: 90, name: 'Finish', desc: 'Blade exits water,\nhands drop', color: '#f59e0b' },
            { x: 275, name: 'Recovery', desc: 'Hands away, body\nslides forward', color: '#a78bfa' },
          ].map((phase) => (
            <g key={phase.name} transform={`translate(${phase.x}, 20)`}>
              <rect x="-75" y="0" width="150" height="65" rx="6" fill={phase.color} opacity="0.1" />
              <text x="0" y="18" textAnchor="middle" fontSize="12" fontWeight="600" fill={phase.color}>
                {phase.name}
              </text>
              {phase.desc.split('\n').map((line, i) => (
                <text key={i} x="0" y={35 + i * 14} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">
                  {line}
                </text>
              ))}
            </g>
          ))}
          {/* Arrows between phases */}
          {[-185, 0, 185].map((x, i) => (
            <line key={i} x1={x - 10} y1="48" x2={x + 10} y2="48" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#phase-arr)" />
          ))}
          <defs>
            <marker id="phase-arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <path d="M 0,0 L 6,2.5 L 0,5 Z" fill="#6b7280" />
            </marker>
          </defs>
        </g>

        {/* Efficiency insight */}
        <g transform="translate(390, 325)">
          <rect x="-330" y="0" width="660" height="60" rx="8" className="fill-cyan-50 dark:fill-cyan-950" opacity="0.5" />
          <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-cyan-700 dark:fill-cyan-300">
            Jonaki{"\u2019"}s Advantage: Steady Stroke Rate
          </text>
          <text x="0" y="40" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Consistent 28 strokes/min is more efficient than 40 spm bursts {"\u2014"} drag grows with speed{"\u00B2"},
            so sprinting wastes 4{"\u00D7"} more energy per unit distance
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          The oar is a class-3 lever: short effort arm trades force for blade speed in the water
        </text>
      </svg>
    </div>
  );
}
