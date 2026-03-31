export default function ActivityAerialPhotoDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Offline activity: compare a ground-level photo with an aerial photo of the same garden patch">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f43f5e">Try This: See Like a Drone</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Photograph the same patch from ground level and from above — compare what you see</text>

        {/* Ground level view */}
        <g transform="translate(40, 80)">
          <rect width="330" height="200" rx="8" stroke="#64748b" strokeWidth="1.5" fill="none" />
          <text x="165" y="-8" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Ground-Level View</text>
          {/* Simple ground scene */}
          <rect width="330" height="120" y="80" fill="#4ade80" opacity="0.3" rx="8" />
          <rect width="330" height="80" fill="#7dd3fc" opacity="0.3" />
          {/* Plants blocking view */}
          <rect x="20" y="60" width="40" height="140" rx="4" fill="#16a34a" opacity="0.5" />
          <rect x="80" y="80" width="35" height="120" rx="4" fill="#22c55e" opacity="0.5" />
          <rect x="140" y="50" width="45" height="150" rx="4" fill="#15803d" opacity="0.5" />
          <rect x="210" y="70" width="38" height="130" rx="4" fill="#16a34a" opacity="0.5" />
          <rect x="270" y="55" width="42" height="145" rx="4" fill="#22c55e" opacity="0.5" />
          <text x="165" y="175" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">Plants block your view</text>

          {/* Person icon */}
          <circle cx="165" cy="195" r="8" fill="#d4a574" />
          <text x="165" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">📷 You</text>
        </g>

        {/* Aerial view */}
        <g transform="translate(410, 80)">
          <rect width="330" height="200" rx="8" stroke="#64748b" strokeWidth="1.5" fill="none" />
          <text x="165" y="-8" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">Aerial View (from above)</text>
          {/* Top-down garden with visible patterns */}
          <rect width="330" height="200" rx="8" fill="#4ade80" opacity="0.15" />
          {/* Rows visible from above */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i}>
              <rect x={15 + i * 52} y="15" width="42" height="170" rx="3" fill="#22c55e" opacity="0.4" />
              {/* Gap / brown spot visible */}
              {i === 2 && <rect x={15 + i * 52} y="60" width="42" height="40" rx="3" fill="#92400e" opacity="0.5" />}
              {i === 3 && <rect x={15 + i * 52} y="100" width="42" height="30" rx="3" fill="#fbbf24" opacity="0.5" />}
            </g>
          ))}
          <text x="145" y="85" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">Brown patch!</text>
          <text x="200" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Yellow stress</text>
          <text x="165" y="210" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Patterns invisible from the ground</text>
        </g>

        {/* Instructions */}
        <rect x="60" y="300" width="660" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="324" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Your Experiment</text>
        {[
          '1. Find a garden or planted area (even potted plants work)',
          '2. Take a photo from eye level (ground view)',
          '3. Stand on a chair or climb stairs and photograph straight down (aerial view)',
          '4. Compare: what patterns appear from above that you could not see from the ground?',
        ].map((step, i) => (
          <text key={i} x="110" y={344 + i * 14} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{step}</text>
        ))}
      </svg>
    </div>
  );
}
