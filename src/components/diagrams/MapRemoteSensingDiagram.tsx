export default function MapRemoteSensingDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 535 375"
        className="w-full"
        role="img"
        aria-label="Remote sensing: satellite capturing images in visible, infrared, and radar wavelengths"
      >
        <rect width="500" height="340" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Remote Sensing
        </text>

        {/* Satellite */}
        <g>
          <rect x="225" y="50" width="50" height="30" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          {/* Solar panels */}
          <rect x="190" y="55" width="30" height="20" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.8" />
          <rect x="280" y="55" width="30" height="20" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.8" />
          {/* Sensor lens */}
          <circle cx="250" cy="80" r="5" className="fill-gray-100 dark:fill-slate-800" stroke="#94a3b8" strokeWidth="0.8" />
          <text x="250" y="46" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">Satellite sensor</text>
        </g>

        {/* Scan beam — cone of observation */}
        <path d="M245,82 L140,170 L360,170Z" fill="#fbbf24" opacity="0.08" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 2" />

        {/* Earth surface strip */}
        <rect x="100" y="170" width="300" height="30" rx="3" fill="#166534" stroke="#4ade80" strokeWidth="0.8" />
        <text x="250" y="189" textAnchor="middle" fontSize="9" fill="#bbf7d0" fontFamily="sans-serif">Earth's surface</text>

        {/* Three wavelength panels below */}
        {/* Visible */}
        <g>
          <rect x="30" y="218" width="130" height="80" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
          <text x="95" y="234" textAnchor="middle" fontSize="10" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">
            Visible Light
          </text>
          {/* Simplified landscape — what we see */}
          <rect x="40" y="242" width="110" height="40" rx="2" fill="#1e3a5f" />
          <path d="M40,275 Q60,255 80,265 Q100,255 120,260 Q140,250 150,270" fill="#166534" />
          <path d="M60,270 Q75,260 90,270" fill="#15803d" />
          <circle cx="135" cy="250" r="6" fill="#fbbf24" opacity="0.6" />
          <text x="95" y="292" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            What our eyes see
          </text>
        </g>

        {/* Infrared */}
        <g>
          <rect x="185" y="218" width="130" height="80" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#ef4444" strokeWidth="1" />
          <text x="250" y="234" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f87171" fontFamily="sans-serif">
            Infrared
          </text>
          {/* Vegetation health — red/green patches */}
          <rect x="195" y="242" width="110" height="40" rx="2" className="fill-gray-100 dark:fill-slate-800" />
          <rect x="200" y="247" width="30" height="15" fill="#ef4444" opacity="0.6" rx="2" />
          <rect x="235" y="247" width="35" height="15" fill="#22c55e" opacity="0.7" rx="2" />
          <rect x="275" y="247" width="25" height="15" fill="#ef4444" opacity="0.4" rx="2" />
          <rect x="200" y="265" width="40" height="12" fill="#22c55e" opacity="0.5" rx="2" />
          <rect x="245" y="265" width="30" height="12" fill="#f59e0b" opacity="0.5" rx="2" />
          <text x="220" y="257" fontSize="6" fill="#fef2f2" fontFamily="sans-serif">stressed</text>
          <text x="252" y="257" fontSize="6" fill="#dcfce7" fontFamily="sans-serif">healthy</text>
          <text x="250" y="292" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            Vegetation health
          </text>
        </g>

        {/* Radar */}
        <g>
          <rect x="340" y="218" width="130" height="80" rx="4" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1" />
          <text x="405" y="234" textAnchor="middle" fontSize="10" fontWeight="600" fill="#a78bfa" fontFamily="sans-serif">
            Radar (SAR)
          </text>
          {/* Through clouds */}
          <rect x="350" y="242" width="110" height="40" rx="2" className="fill-gray-100 dark:fill-slate-800" />
          {/* Cloud shapes */}
          <ellipse cx="380" cy="248" rx="15" ry="6" className="fill-gray-400 dark:fill-slate-500" opacity="0.5" />
          <ellipse cx="420" cy="250" rx="18" ry="7" className="fill-gray-400 dark:fill-slate-500" opacity="0.4" />
          {/* Terrain visible below clouds */}
          <path d="M355,272 Q375,260 395,268 Q415,258 435,265 Q450,260 455,275" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="405" y="292" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            Sees through clouds
          </text>
        </g>

        {/* Wavelength arrows from satellite */}
        <line x1="240" y1="85" x2="95" y2="215" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="250" y1="85" x2="250" y2="215" stroke="#f87171" strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="260" y1="85" x2="405" y2="215" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="3 2" />

        {/* Bottom caption */}
        <text x="250" y="325" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Satellites see what our eyes cannot — heat, moisture, and through clouds.
        </text>
      </svg>
    </div>
  );
}
