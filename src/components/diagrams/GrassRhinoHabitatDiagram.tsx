export default function GrassRhinoHabitatDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 798 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Kaziranga ecosystem showing elephant grass habitat supporting rhinos, elephants, and wild buffalo in a symbiotic relationship"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Kaziranga: Grass ↔ Rhino Symbiosis
        </text>

        {/* Tall grass background */}
        <rect x="50" y="60" width="600" height="200" rx="8" className="fill-emerald-50 dark:fill-emerald-950/30" />
        {Array.from({ length: 30 }).map((_, i) => (
          <line
            key={i}
            x1={70 + i * 20}
            y1={260}
            x2={70 + i * 20 + (i % 3 === 0 ? 5 : i % 3 === 1 ? -5 : 0)}
            y2={80 + (i % 4) * 10}
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.5 + (i % 3) * 0.15}
          />
        ))}

        {/* Height marker */}
        <line x1="660" y1="80" x2="660" y2="260" stroke="#6b7280" strokeWidth="1" strokeDasharray="4 2" />
        <text x="667" y="170" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-gray-400" transform="rotate(90, 667, 170)">5–6 meters tall</text>

        {/* Rhino silhouette */}
        <g transform="translate(200, 170)">
          <ellipse cx="0" cy="0" rx="55" ry="30" fill="#6b7280" opacity="0.6" />
          <ellipse cx="-50" cy="-10" rx="20" ry="15" fill="#6b7280" opacity="0.6" />
          <path d="M-68,-18 L-78,-30 L-70,-20" fill="#6b7280" opacity="0.6" />
          <text x="0" y="50" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Indian Rhino</text>
          <text x="0" y="64" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Hidden in tall grass</text>
        </g>

        {/* Symbiosis arrows */}
        <g transform="translate(350, 280)">
          <rect x="-160" y="0" width="320" height="110" rx="8" className="fill-amber-50 dark:fill-amber-950/30" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="20" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">Mutualism</text>

          {/* Rhino helps grass */}
          <g transform="translate(-120, 35)">
            <circle cx="0" cy="0" r="10" fill="#6b7280" opacity="0.4" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">R</text>
            <line x1="12" y1="0" x2="55" y2="0" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#arr-hab)" />
            <circle cx="67" cy="0" r="10" fill="#16a34a" opacity="0.3" />
            <text x="67" y="4" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-700 dark:fill-green-300">G</text>
          </g>
          <text x="-50" y="55" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Hooves churn soil + spread seeds in dung</text>

          {/* Grass helps rhino */}
          <g transform="translate(60, 70)">
            <circle cx="67" cy="0" r="10" fill="#6b7280" opacity="0.4" />
            <text x="67" y="4" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">R</text>
            <line x1="55" y1="0" x2="12" y2="0" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#arr-hab-rev)" />
            <circle cx="0" cy="0" r="10" fill="#16a34a" opacity="0.3" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-700 dark:fill-green-300">G</text>
          </g>
          <text x="50" y="90" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Tall grass provides cover + food for rhinos</text>
        </g>

        {/* Stats */}
        <g transform="translate(530, 290)">
          <rect x="0" y="0" width="130" height="90" rx="6" className="fill-emerald-50 dark:fill-emerald-950/30" stroke="#16a34a" strokeWidth="1" />
          <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Kaziranga</text>
          <text x="65" y="38" textAnchor="middle" fontSize="22" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">2,613</text>
          <text x="65" y="55" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Indian rhinos</text>
          <text x="65" y="72" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">World’s largest</text>
          <text x="65" y="85" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">population</text>
        </g>

        <defs>
          <marker id="arr-hab" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#16a34a" />
          </marker>
          <marker id="arr-hab-rev" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
            <path d="M8,0 L0,4 L8,8" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
