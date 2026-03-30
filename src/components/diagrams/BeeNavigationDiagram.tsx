export default function BeeNavigationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Bee navigation diagram showing sun compass, polarized light, and magnetic sense">
        <rect width="570" height="420" rx="12" className="fill-slate-900" />

        <text x="285" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee Navigation Systems</text>
        <text x="285" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Three methods bees use to find their way</text>

        {/* Method 1: Sun Compass — left */}
        <g transform="translate(105, 200)">
          <rect x="-80" y="-100" width="160" height="225" rx="8" fill="#f59e0b" opacity="0.06" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="-80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">Sun Compass</text>

          {/* Sun */}
          <circle cx="0" cy="-45" r="14" fill="#fbbf24" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={Math.cos((a * Math.PI) / 180) * 18}
              y1={-45 + Math.sin((a * Math.PI) / 180) * 18}
              x2={Math.cos((a * Math.PI) / 180) * 24}
              y2={-45 + Math.sin((a * Math.PI) / 180) * 24}
              stroke="#fbbf24" strokeWidth="2"
            />
          ))}

          {/* Hive */}
          <polygon points="-20,60 0,45 20,60 20,80 -20,80" fill="#78350f" opacity="0.5" stroke="#a16207" strokeWidth="1" />
          <text x="0" y="73" textAnchor="middle" fontSize="10" fill="#d97706">Hive</text>

          {/* Bee */}
          <ellipse cx="35" cy="15" rx="8" ry="5" fill="#eab308" />
          <circle cx="40" cy="13" r="3" className="fill-gray-100 dark:fill-slate-800" />

          {/* Angle from sun to flight direction */}
          <line x1="0" y1="-30" x2="0" y2="50" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
          <line x1="0" y1="50" x2="35" y2="15" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d="M 0,35 A 18 18 0 0 1 12,25" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="18" y="35" fontSize="10" fill="#f59e0b">angle</text>

          <text x="0" y="103" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Measures angle between</text>
          <text x="0" y="117" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">sun and flight path</text>
        </g>

        {/* Method 2: Polarized Light — center */}
        <g transform="translate(285, 200)">
          <rect x="-80" y="-100" width="160" height="225" rx="8" fill="#60a5fa" opacity="0.06" stroke="#60a5fa" strokeWidth="1" />
          <text x="0" y="-80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Polarized Light</text>

          {/* Sky patch */}
          <circle cx="0" cy="-30" r="35" fill="#1e3a5f" opacity="0.4" stroke="#60a5fa" strokeWidth="1" />

          {/* Polarization pattern lines */}
          {[-25, -15, -5, 5, 15, 25].map((y, i) => (
            <line
              key={i}
              x1={-30 + Math.abs(y)} y1={-30 + y}
              x2={30 - Math.abs(y)} y2={-30 + y}
              stroke="#60a5fa" strokeWidth="1" opacity={0.3 + (i % 2) * 0.3}
            />
          ))}

          {/* E-vector arrows */}
          <line x1="-20" y1="-30" x2="20" y2="-30" stroke="#93c5fd" strokeWidth="2" />
          <polygon points="20,-30 16,-33 16,-27" fill="#93c5fd" />
          <polygon points="-20,-30 -16,-33 -16,-27" fill="#93c5fd" />
          <text x="0" y="-40" textAnchor="middle" fontSize="10" fill="#93c5fd">E-vector</text>

          {/* Bee eye detecting */}
          <g transform="translate(0, 30)">
            <ellipse cx="0" cy="0" rx="12" ry="15" fill="#78350f" opacity="0.5" stroke="#a16207" strokeWidth="1" />
            {/* POL neurons */}
            {[-5, 0, 5].map((y) => (
              <line key={y} x1="-6" y1={y} x2="6" y2={y} stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
            ))}
            <text x="0" y="26" textAnchor="middle" fontSize="10" fill="#60a5fa">POL neurons</text>
          </g>

          <text x="0" y="85" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Detects polarization</text>
          <text x="0" y="99" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">pattern even on cloudy days</text>
        </g>

        {/* Method 3: Magnetic Sense — right */}
        <g transform="translate(465, 200)">
          <rect x="-80" y="-100" width="160" height="225" rx="8" fill="#a855f7" opacity="0.06" stroke="#a855f7" strokeWidth="1" />
          <text x="0" y="-80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a855f7">Magnetic Sense</text>

          {/* Earth magnetic field lines */}
          <ellipse cx="0" cy="-20" rx="45" ry="35" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
          <ellipse cx="0" cy="-20" rx="30" ry="22" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />

          {/* N-S labels */}
          <text x="0" y="-60" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">N</text>
          <text x="0" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">S</text>

          {/* Field lines with arrows */}
          <path d="M -25,-55 Q -50,-20 -25,15" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
          <path d="M 25,-55 Q 50,-20 25,15" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />

          {/* Bee abdomen with magnetite */}
          <g transform="translate(0, 50)">
            <ellipse cx="0" cy="0" rx="20" ry="12" fill="#eab308" opacity="0.6" />
            <line x1="-8" y1="0" x2="8" y2="0" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" />
            {/* Magnetite crystals */}
            <rect x="-4" y="-3" width="3" height="3" fill="#a855f7" opacity="0.8" />
            <rect x="1" y="-3" width="3" height="3" fill="#a855f7" opacity="0.8" />
            <text x="0" y="22" textAnchor="middle" fontSize="10" fill="#c4b5fd">Iron oxide (magnetite)</text>
            <text x="0" y="35" textAnchor="middle" fontSize="10" fill="#c4b5fd">in abdomen</text>
          </g>

          <text x="0" y="103" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Detects Earth&apos;s magnetic</text>
          <text x="0" y="117" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">field for orientation</text>
        </g>

        {/* Bottom summary */}
        <g transform="translate(285, 400)">
          <text x="0" y="0" textAnchor="middle" fontSize="10" fill="#fcd34d">Combined: bees navigate up to 10 km from hive and return accurately</text>
        </g>
      </svg>
    </div>
  );
}
