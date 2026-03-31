export default function MapScaleDistanceDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram explaining map scale: how 1 cm on a map can represent 10 km in reality, with examples"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Map Scale: Shrinking Reality to Fit on Paper
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Scale tells you how much the real world was shrunk to make the map
        </text>

        {/* Scale bar example */}
        <text x="390" y="85" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b82f6">
          Scale 1:100,000 means "1 cm on map = 1 km in reality"
        </text>

        {/* Map ruler */}
        <rect x="140" y="105" width="500" height="40" rx="4" className="fill-white dark:fill-slate-900" stroke="#3b82f6" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <g key={i}>
            <rect x={140 + i * 100} y="105" width={i % 2 === 0 ? 100 : 100} height="20" fill={i % 2 === 0 ? '#3b82f6' : '#fff'} fillOpacity={i % 2 === 0 ? 0.3 : 0} />
            <line x1={140 + i * 100} y1="105" x2={140 + i * 100} y2="145" stroke="#3b82f6" strokeWidth="1" />
            <text x={140 + i * 100} y="158" textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="600">{i} km</text>
          </g>
        ))}
        <text x="390" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Each division on the map = 1 cm = 1 km in the real world
        </text>

        {/* Three scale examples */}
        <text x="390" y="195" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Different scales show different amounts of detail
        </text>

        {/* Large scale - small area, lots of detail */}
        <rect x="30" y="215" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1.5" />
        <text x="145" y="240" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22c55e">Large Scale (1:10,000)</text>
        <text x="145" y="256" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 cm = 100 meters</text>
        {/* Detailed street view */}
        <rect x="50" y="270" width="190" height="80" rx="4" fill="#22c55e" fillOpacity="0.05" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="80" y1="270" x2="80" y2="350" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="160" y1="270" x2="160" y2="350" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="310" x2="240" y2="310" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="90" y="280" width="20" height="15" rx="2" fill="#94a3b8" fillOpacity="0.3" />
        <rect x="120" y="280" width="15" height="20" rx="2" fill="#94a3b8" fillOpacity="0.3" />
        <rect x="170" y="315" width="25" height="15" rx="2" fill="#94a3b8" fillOpacity="0.3" />
        <text x="145" y="368" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          See individual buildings
        </text>
        <text x="145" y="380" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">Small area, lots of detail</text>

        {/* Medium scale */}
        <rect x="275" y="215" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="390" y="240" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">Medium Scale (1:250,000)</text>
        <text x="390" y="256" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 cm = 2.5 km</text>
        {/* District view */}
        <rect x="295" y="270" width="190" height="80" rx="4" fill="#f59e0b" fillOpacity="0.05" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx="350" cy="300" r="8" fill="#94a3b8" fillOpacity="0.3" />
        <text x="350" y="304" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">town</text>
        <circle cx="430" cy="320" r="5" fill="#94a3b8" fillOpacity="0.3" />
        <path d="M310,310 Q370,290 440,305" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="300" y1="285" x2="480" y2="340" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
        <text x="390" y="368" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          See towns and rivers
        </text>
        <text x="390" y="380" textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="600">Medium area, some detail</text>

        {/* Small scale - large area, no detail */}
        <rect x="520" y="215" width="230" height="170" rx="10" className="fill-white dark:fill-slate-900" stroke="#ef4444" strokeWidth="1.5" />
        <text x="635" y="240" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">Small Scale (1:10,000,000)</text>
        <text x="635" y="256" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">1 cm = 100 km</text>
        {/* Whole region outline */}
        <rect x="540" y="270" width="190" height="80" rx="4" fill="#ef4444" fillOpacity="0.05" stroke="#e5e7eb" strokeWidth="1" />
        <path d="M570,290 Q620,280 660,295 Q700,310 690,340 Q650,340 600,330 Q560,320 570,290 Z" fill="#22c55e" fillOpacity="0.1" stroke="#94a3b8" strokeWidth="1" />
        <text x="635" y="318" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">NE India</text>
        <text x="635" y="368" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          See whole regions
        </text>
        <text x="635" y="380" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="600">Large area, no detail</text>

        {/* Bottom rule */}
        <rect x="120" y="398" width="540" height="16" rx="4" fill="#3b82f6" fillOpacity="0.08" />
        <text x="390" y="410" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b82f6">
          No single map can show everything {'\u2014'} you choose the scale based on what you need
        </text>
      </svg>
    </div>
  );
}
