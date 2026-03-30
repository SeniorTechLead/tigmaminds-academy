const StormHistoricalTracksDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 655 468"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Historical cyclone tracks on a simplified Bay of Bengal map showing curved paths from ocean toward coast with intensity indicated by color"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .map-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .storm-name { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Historical Cyclone Tracks — Bay of Bengal
        </text>

        {/* Map area */}
        <rect x="30" y="45" width="420" height="340" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.5" />

        {/* Grid lines (lat/lon) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`grid-${i}`}>
            <line x1="30" y1={45 + i * 85} x2="450" y2={45 + i * 85}
              className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.5" opacity="0.5" />
            <line x1={30 + i * 105} y1="45" x2={30 + i * 105} y2="385"
              className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.5" opacity="0.5" />
          </g>
        ))}

        {/* Latitude labels */}
        <text x="25" y="52" textAnchor="end" className="map-text fill-slate-500 dark:fill-slate-400">25°N</text>
        <text x="25" y="137" textAnchor="end" className="map-text fill-slate-500 dark:fill-slate-400">20°N</text>
        <text x="25" y="222" textAnchor="end" className="map-text fill-slate-500 dark:fill-slate-400">15°N</text>
        <text x="25" y="307" textAnchor="end" className="map-text fill-slate-500 dark:fill-slate-400">10°N</text>
        <text x="25" y="387" textAnchor="end" className="map-text fill-slate-500 dark:fill-slate-400">5°N</text>

        {/* India coastline (west side) */}
        <path d="M 30 45 L 30 150 Q 60 200 80 250 Q 100 300 130 340 Q 150 370 180 385 L 30 385 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.6" />
        <text x="55" y="120" className="map-text fill-green-700 dark:fill-green-300">India</text>

        {/* Sri Lanka */}
        <ellipse cx="130" cy="310" rx="18" ry="25"
          className="fill-green-300 dark:fill-green-800" opacity="0.6" />
        <text x="130" y="313" textAnchor="middle" className="map-text fill-green-700 dark:fill-green-300" style={{ fontSize: '7px' }}>Sri Lanka</text>

        {/* Myanmar coastline (east side) */}
        <path d="M 420 45 L 420 100 Q 400 150 380 200 Q 370 230 365 260 Q 370 300 380 340 L 450 340 L 450 45 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.6" />
        <text x="420" y="85" className="map-text fill-green-700 dark:fill-green-300">Myanmar</text>

        {/* Bangladesh (top) */}
        <path d="M 250 45 L 310 45 Q 340 50 360 60 Q 380 70 420 45 L 250 45 Z"
          className="fill-green-400 dark:fill-green-700" opacity="0.6" />
        <text x="310" y="58" textAnchor="middle" className="map-text fill-green-800 dark:fill-green-200" style={{ fontSize: '7px' }}>Bangladesh</text>

        {/* Track 1: Fani (2019) — SW to NE, strengthening */}
        <path d="M 200 360 Q 210 320 220 280 Q 230 240 235 200 Q 238 160 240 120 Q 245 90 260 65"
          fill="none" strokeWidth="2.5"
          stroke="url(#track1-grad)" />
        <defs>
          <linearGradient id="track1-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Track dots */}
        <circle cx="200" cy="360" r="3" className="fill-green-500" />
        <circle cx="220" cy="280" r="3" className="fill-yellow-500" />
        <circle cx="235" cy="200" r="4" className="fill-red-500" />
        <circle cx="240" cy="120" r="4" className="fill-purple-500" />
        <text x="248" cy="115" y="118" className="storm-name fill-purple-600 dark:fill-purple-400">Fani (2019)</text>

        {/* Track 2: Amphan (2020) — S to N, strong */}
        <path d="M 280 350 Q 275 300 270 260 Q 268 220 272 180 Q 278 140 290 100 Q 298 70 310 55"
          fill="none" strokeWidth="2.5"
          stroke="url(#track2-grad)" />
        <defs>
          <linearGradient id="track2-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="280" cy="350" r="3" className="fill-green-500" />
        <circle cx="270" cy="260" r="3" className="fill-yellow-500" />
        <circle cx="272" cy="180" r="4" className="fill-red-500" />
        <circle cx="298" cy="70" r="4" className="fill-purple-500" />
        <text x="312" y="68" className="storm-name fill-purple-600 dark:fill-purple-400">Amphan (2020)</text>

        {/* Track 3: Hudhud (2014) — E to W */}
        <path d="M 350 310 Q 320 280 280 250 Q 240 230 190 210 Q 140 195 100 188"
          fill="none" strokeWidth="2"
          stroke="url(#track3-grad)" />
        <defs>
          <linearGradient id="track3-grad" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle cx="350" cy="310" r="3" className="fill-green-500" />
        <circle cx="240" cy="230" r="3" className="fill-yellow-500" />
        <circle cx="100" cy="188" r="4" className="fill-red-500" />
        <text x="80" y="180" className="storm-name fill-red-600 dark:fill-red-400">Hudhud (2014)</text>

        {/* Track 4: Nargis (2008) — unusual E track */}
        <path d="M 250 300 Q 280 280 310 265 Q 340 255 370 248"
          fill="none" strokeWidth="2"
          stroke="url(#track4-grad)" />
        <defs>
          <linearGradient id="track4-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle cx="250" cy="300" r="3" className="fill-green-500" />
        <circle cx="310" cy="265" r="3" className="fill-yellow-500" />
        <circle cx="370" cy="248" r="4" className="fill-red-500" />
        <text x="375" y="242" className="storm-name fill-red-600 dark:fill-red-400">Nargis (2008)</text>

        {/* Legend */}
        <rect x="465" y="50" width="120" height="170" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.8"
          stroke="#64748b" strokeWidth="1" />
        <text x="525" y="70" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">Intensity</text>

        {[
          { color: 'fill-green-500', label: 'Depression', wind: '<62 km/h' },
          { color: 'fill-yellow-500', label: 'Cyclone', wind: '62-88 km/h' },
          { color: 'fill-red-500', label: 'Severe', wind: '89-167 km/h' },
          { color: 'fill-purple-500', label: 'Very severe', wind: '168+ km/h' },
        ].map((item, i) => (
          <g key={`legend-${i}`}>
            <circle cx="480" cy={92 + i * 30} r="5" className={item.color} />
            <text x="490" y={89 + i * 30} className="map-text fill-slate-600 dark:fill-slate-300">
              {item.label}
            </text>
            <text x="490" y={100 + i * 30} className="map-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '7px' }}>
              {item.wind}
            </text>
          </g>
        ))}

        {/* Pattern note */}
        <rect x="465" y="240" width="120" height="80" rx="6"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.7" />
        <text x="525" y="258" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          Pattern:
        </text>
        <text x="525" y="275" textAnchor="middle"
          className="map-text fill-amber-600 dark:fill-amber-400">
          Most storms curve
        </text>
        <text x="525" y="288" textAnchor="middle"
          className="map-text fill-amber-600 dark:fill-amber-400">
          NW toward India
        </text>
        <text x="525" y="301" textAnchor="middle"
          className="map-text fill-amber-600 dark:fill-amber-400">
          or Bangladesh
        </text>

        {/* Bottom caption */}
        <rect x="60" y="400" width="480" height="28" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="418" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Historical tracks reveal patterns — your tracker will learn from these paths
        </text>
      </svg>
    </div>
  );
};

export default StormHistoricalTracksDiagram;
