export default function TurtleEarthquakeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Earthquake mechanism: friction locks plates, stress builds, plates suddenly slip releasing seismic waves from the focus point"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Earthquakes: When Friction Gives Way
        </text>

        {/* Three stages */}
        {/* Stage 1: Locked */}
        <g transform="translate(30, 60)">
          <rect width="200" height="180" rx="8" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
          <text x="100" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">1. Stress Builds</text>

          {/* Two plates locked */}
          <rect x="10" y="80" width="85" height="60" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="105" y="80" width="85" height="60" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1.5" />

          {/* Friction lock symbol */}
          <text x="100" y="115" textAnchor="middle" fontSize="16">\u{1F512}</text>

          {/* Arrows pushing */}
          <line x1="25" y1="110" x2="70" y2="110" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-eq-y)" />
          <line x1="175" y1="110" x2="130" y2="110" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arr-eq-g)" />

          <text x="100" y="160" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Friction locks the boundary.</text>
          <text x="100" y="174" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Plates deform elastically.</text>
        </g>

        {/* Stage 2: Rupture */}
        <g transform="translate(250, 60)">
          <rect width="200" height="180" rx="8" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1" />
          <text x="100" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">2. Sudden Slip!</text>

          {/* Plates separated/slipped */}
          <rect x="10" y="80" width="75" height="60" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1.5" transform="translate(5,3)" />
          <rect x="115" y="80" width="75" height="60" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280" strokeWidth="1.5" transform="translate(-5,-3)" />

          {/* Crack/rupture */}
          <path d="M95,70 L100,85 L90,100 L100,115 L92,130 L98,145" fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {/* Seismic waves radiating */}
          {[20, 35, 50].map((r, i) => (
            <circle key={i} cx="96" cy="108" r={r} fill="none" stroke="#ef4444" strokeWidth="1" opacity={0.5 - i * 0.15} />
          ))}

          <text x="100" y="165" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Stress exceeds friction!</text>
          <text x="100" y="178" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Energy released as waves.</text>
        </g>

        {/* Stage 3: Seismic waves */}
        <g transform="translate(470, 60)">
          <rect width="200" height="180" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
          <text x="100" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">3. Waves Spread</text>

          {/* Surface with buildings */}
          <line x1="10" y1="70" x2="190" y2="70" stroke="#78350f" strokeWidth="2" />

          {/* Focus underground */}
          <circle cx="100" cy="130" r="8" fill="#ef4444" />
          <text x="100" y="153" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-red-600 dark:fill-red-400">Focus</text>
          <text x="100" y="166" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(underground origin)</text>

          {/* Epicenter on surface */}
          <line x1="100" y1="70" x2="100" y2="120" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="100" cy="70" r="5" fill="#f59e0b" />
          <text x="100" y="62" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Epicenter</text>

          {/* Surface waves */}
          <path d="M30,70 Q45,60 60,70 Q75,80 90,70" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M110,70 Q125,80 140,70 Q155,60 170,70" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Little shaking buildings */}
          <rect x="50" y="50" width="12" height="20" rx="1" fill="#6b7280" opacity="0.5" transform="rotate(-3, 56, 60)" />
          <rect x="140" y="50" width="12" height="20" rx="1" fill="#6b7280" opacity="0.5" transform="rotate(3, 146, 60)" />
        </g>

        {/* Richter scale */}
        <g transform="translate(50, 270)">
          <rect width="600" height="110" rx="8" className="fill-gray-50 dark:fill-gray-900/30" stroke="#6b7280" strokeWidth="1" />
          <text x="300" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-gray-300">Earthquake Magnitude Scale</text>

          {/* Scale bar */}
          {[
            { mag: '3', desc: 'Minor', color: '#22c55e', w: 30 },
            { mag: '5', desc: 'Moderate', color: '#f59e0b', w: 60 },
            { mag: '7', desc: 'Major', color: '#f97316', w: 120 },
            { mag: '9', desc: 'Devastating', color: '#ef4444', w: 240 },
          ].map((s, i) => (
            <g key={i} transform={`translate(${30 + i * 140}, 40)`}>
              <rect width={Math.min(s.w, 120)} height="20" rx="4" fill={s.color} opacity="0.4" />
              <text x="0" y="15" fontSize="14" fontWeight="700" fill={s.color}>{s.mag}</text>
              <text x={Math.min(s.w, 120) + 5} y="15" fontSize="10" className="fill-gray-600 dark:fill-gray-400">{s.desc}</text>
            </g>
          ))}

          <text x="300" y="82" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">
            Each whole number = 32\u00d7 more energy released
          </text>
          <text x="300" y="98" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            The 1950 Assam earthquake was magnitude 8.6 \u2014 one of the strongest ever recorded
          </text>
        </g>

        <defs>
          <marker id="arr-eq-y" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f59e0b" />
          </marker>
          <marker id="arr-eq-g" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#6b7280" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
