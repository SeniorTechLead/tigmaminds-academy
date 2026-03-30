export default function MapDatumDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 525 345"
        className="w-full"
        role="img"
        aria-label="What a datum is: Earth is not a perfect sphere, and different ellipsoids fit different regions better"
      >
        <rect width="500" height="310" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          What Is a Datum?
        </text>

        {/* Actual Earth shape (exaggerated geoid — lumpy) */}
        <path
          d="M150,165 Q155,110 180,90 Q210,70 250,68 Q290,70 320,90 Q345,110 350,165 Q345,220 320,240 Q290,260 250,262 Q210,260 180,240 Q155,220 150,165Z"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        {/* Bumps to show it's not perfect */}
        <path
          d="M155,140 Q148,135 152,125 Q158,130 155,140"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1"
        />
        <path
          d="M345,190 Q352,185 350,175 Q344,180 345,190"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1"
        />

        {/* Some land masses */}
        <ellipse cx="210" cy="130" rx="25" ry="18" fill="#166534" opacity="0.6" />
        <text x="210" y="134" textAnchor="middle" fontSize="7" fill="#bbf7d0" fontFamily="sans-serif">Europe</text>
        <ellipse cx="300" cy="150" rx="30" ry="22" fill="#166534" opacity="0.6" />
        <text x="300" y="154" textAnchor="middle" fontSize="7" fill="#bbf7d0" fontFamily="sans-serif">Asia</text>

        <text x="250" y="200" textAnchor="middle" fontSize="9" fill="#60a5fa" fontFamily="sans-serif">
          Real Earth (lumpy)
        </text>

        {/* Ellipsoid 1: fits Europe (red, offset slightly left) */}
        <ellipse
          cx="242"
          cy="163"
          rx="95"
          ry="90"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
        <text x="138" y="120" fontSize="9" fontWeight="600" fill="#ef4444" fontFamily="sans-serif">
          Ellipsoid A
        </text>
        <text x="138" y="132" fontSize="8" fill="#fca5a5" fontFamily="sans-serif">
          (fits Europe)
        </text>

        {/* Ellipsoid 2: fits Asia (green, offset slightly right) */}
        <ellipse
          cx="258"
          cy="165"
          rx="98"
          ry="92"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
        <text x="365" y="120" fontSize="9" fontWeight="600" fill="#22c55e" fontFamily="sans-serif">
          Ellipsoid B
        </text>
        <text x="365" y="132" fontSize="8" fill="#86efac" fontFamily="sans-serif">
          (fits Asia)
        </text>

        {/* Gap annotation: show where ellipsoid doesn't match earth */}
        <line x1="165" y1="165" x2="145" y2="165" stroke="#fbbf24" strokeWidth="0.8" />
        <line x1="145" y1="155" x2="145" y2="175" stroke="#fbbf24" strokeWidth="0.8" />
        <text x="125" y="168" textAnchor="end" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">gap</text>

        {/* Bottom section: WGS84 */}
        <rect x="80" y="235" width="340" height="35" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <text x="250" y="250" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
          WGS84 — the global standard datum used by GPS
        </text>
        <text x="250" y="263" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
          A best-fit ellipsoid for the entire Earth (not perfect anywhere, decent everywhere)
        </text>

        {/* Bottom caption */}
        <text x="250" y="295" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          A datum is the reference shape we measure coordinates against.
        </text>
      </svg>
    </div>
  );
}
