export default function PostmanGraphTheoryDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Graph theory basics: a map of hill villages represented as nodes connected by weighted edges showing distance and elevation"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Graph Theory: Maps as Mathematics
        </text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Every map can be represented as nodes (villages) connected by edges (paths)
        </text>

        {/* Left: actual map */}
        <g transform="translate(30, 70)">
          <rect width="280" height="290" rx="8" className="fill-emerald-50 dark:fill-emerald-950/20" stroke="#16a34a" strokeWidth="1" />
          <text x="140" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Map View</text>

          {/* Mountain terrain */}
          <path d="M20,250 Q60,200 100,220 Q140,180 180,200 Q220,170 260,250" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.3" />
          <path d="M20,260 Q80,220 140,240 Q200,210 260,260" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.2" />

          {/* Villages as dots */}
          {[
            { x: 50, y: 80, name: 'Laitlyngkot', h: '1200m' },
            { x: 200, y: 60, name: 'Cherrapunji', h: '1484m' },
            { x: 130, y: 150, name: 'Nongstoin', h: '1300m' },
            { x: 240, y: 160, name: 'Sohra', h: '1400m' },
            { x: 70, y: 230, name: 'Mawsynram', h: '1401m' },
          ].map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r="6" className="fill-blue-500 dark:fill-blue-400" />
              <text x={v.x} y={v.y - 12} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">{v.name}</text>
              <text x={v.x} y={v.y + 18} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{v.h}</text>
            </g>
          ))}

          {/* Winding paths */}
          <path d="M50,80 Q80,100 130,150" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M50,80 Q130,50 200,60" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M130,150 Q185,120 200,60" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M130,150 Q190,155 240,160" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M50,80 Q55,160 70,230" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M130,150 Q100,190 70,230" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 2" />
        </g>

        {/* Arrow between */}
        <text x="330" y="215" textAnchor="middle" fontSize="22" className="fill-gray-400 dark:fill-gray-600">\u2192</text>
        <text x="330" y="235" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Abstract</text>

        {/* Right: graph representation */}
        <g transform="translate(370, 70)">
          <rect width="300" height="290" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="150" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Graph View</text>

          {/* Nodes */}
          {[
            { x: 60, y: 80, label: 'A' },
            { x: 210, y: 60, label: 'B' },
            { x: 140, y: 150, label: 'C' },
            { x: 250, y: 160, label: 'D' },
            { x: 80, y: 230, label: 'E' },
          ].map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="18" className="fill-blue-100 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="2" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">{n.label}</text>
            </g>
          ))}

          {/* Edges with weights */}
          {[
            { x1: 60, y1: 80, x2: 140, y2: 150, w: '4km \u2191300m', mx: 85, my: 108 },
            { x1: 60, y1: 80, x2: 210, y2: 60, w: '7km \u2191284m', mx: 135, my: 58 },
            { x1: 140, y1: 150, x2: 210, y2: 60, w: '5km \u2193100m', mx: 190, my: 100 },
            { x1: 140, y1: 150, x2: 250, y2: 160, w: '6km \u2191100m', mx: 195, my: 142 },
            { x1: 60, y1: 80, x2: 80, y2: 230, w: '8km \u2191200m', mx: 48, my: 155 },
            { x1: 140, y1: 150, x2: 80, y2: 230, w: '3km \u2191100m', mx: 95, my: 195 },
          ].map((e, i) => (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#93c5fd" strokeWidth="1.5" />
              <text x={e.mx} y={e.my} textAnchor="middle" fontSize="9" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">{e.w}</text>
            </g>
          ))}
        </g>

        {/* Bottom: key concepts */}
        <rect x="50" y="375" width="600" height="36" rx="6" className="fill-indigo-50 dark:fill-indigo-950/30" stroke="#6366f1" strokeWidth="1" />
        <text x="175" y="395" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">
          Node = village
        </text>
        <text x="350" y="395" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">
          Edge = path between villages
        </text>
        <text x="540" y="395" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-700 dark:fill-indigo-300">
          Weight = distance + elevation
        </text>
      </svg>
    </div>
  );
}
