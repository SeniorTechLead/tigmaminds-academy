export default function OwlAsymmetricEarsDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Owl asymmetric ears: one ear higher than the other allows 3D sound location using time and intensity differences between ears"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Asymmetric Ears: 3D Sound Mapping
        </text>

        {/* Owl face front view */}
        <g transform="translate(180, 200)">
          {/* Facial disc */}
          <ellipse cx="0" cy="0" rx="90" ry="100" className="fill-amber-100 dark:fill-amber-900/20" stroke="#92400e" strokeWidth="1.5" />

          {/* Heart shape */}
          <path d="M-60,-40 Q-70,-80 0,-90 Q70,-80 60,-40 Q50,20 0,80 Q-50,20 -60,-40 Z" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="4 2" />
          <text x="0" y="-95" textAnchor="middle" fontSize="10" className="fill-amber-700 dark:fill-amber-300">Facial disc</text>
          <text x="0" y="-82" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(parabolic sound collector)</text>

          {/* Eyes */}
          <circle cx="-28" cy="-20" r="22" className="fill-amber-200 dark:fill-amber-800/40" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="28" cy="-20" r="22" className="fill-amber-200 dark:fill-amber-800/40" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="-28" cy="-20" r="12" fill="#1e1b4b" />
          <circle cx="28" cy="-20" r="12" fill="#1e1b4b" />
          <circle cx="-25" cy="-23" r="4" fill="white" opacity="0.5" />
          <circle cx="31" cy="-23" r="4" fill="white" opacity="0.5" />

          {/* Beak */}
          <path d="M-8,10 L0,25 L8,10" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />

          {/* Left ear (higher) */}
          <g>
            <rect x="-88" y="-55" width="18" height="25" rx="3" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
            <text x="-110" y="-45" fontSize="10" fontWeight="700" className="fill-red-600 dark:fill-red-400">L</text>
            <text x="-110" y="-32" fontSize="9" className="fill-red-500 dark:fill-red-400">Higher</text>
          </g>

          {/* Right ear (lower) */}
          <g>
            <rect x="70" y="-20" width="18" height="25" rx="3" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="95" y="-10" fontSize="10" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">R</text>
            <text x="95" y="3" fontSize="9" className="fill-blue-500 dark:fill-blue-400">Lower</text>
          </g>

          {/* Height difference line */}
          <line x1="-79" y1="-42" x2="79" y2="-7" stroke="#9333ea" strokeWidth="1" strokeDasharray="4 2" />
          <text x="50" y="-50" fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">Offset!</text>
        </g>

        {/* Right panel: how it works */}
        <g transform="translate(380, 65)">
          <rect width="280" height="310" rx="8" className="fill-indigo-50 dark:fill-indigo-950/20" stroke="#6366f1" strokeWidth="1" />
          <text x="140" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">How 3D Localization Works</text>

          {/* Horizontal */}
          <g transform="translate(15, 45)">
            <rect width="250" height="75" rx="6" className="fill-blue-100 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1" />
            <text x="125" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Horizontal Direction</text>
            <text x="125" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Sound arrives at left ear first?</text>
            <text x="125" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">\u2192 Source is to the LEFT</text>
            <text x="125" y="66" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Uses: time difference between ears</text>
          </g>

          {/* Vertical */}
          <g transform="translate(15, 135)">
            <rect width="250" height="75" rx="6" className="fill-red-100 dark:fill-red-900/20" stroke="#ef4444" strokeWidth="1" />
            <text x="125" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-red-700 dark:fill-red-300">Vertical Direction</text>
            <text x="125" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Sound louder in higher ear?</text>
            <text x="125" y="50" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">\u2192 Source is ABOVE</text>
            <text x="125" y="66" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Uses: intensity difference (asymmetric ears)</text>
          </g>

          {/* Result */}
          <g transform="translate(15, 225)">
            <rect width="250" height="70" rx="6" className="fill-emerald-100 dark:fill-emerald-900/20" stroke="#16a34a" strokeWidth="1" />
            <text x="125" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Result: 3D Sound Map</text>
            <text x="125" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Accuracy: 1\u20132\u00b0 in both planes</text>
            <text x="125" y="52" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Barn owls strike prey in TOTAL darkness</text>
            <text x="125" y="65" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">Sound \u2192 strike in \u223c100 milliseconds</text>
          </g>
        </g>

        {/* Bottom */}
        <rect x="50" y="390" width="600" height="24" rx="6" className="fill-purple-50 dark:fill-purple-950/30" stroke="#9333ea" strokeWidth="1" />
        <text x="350" y="407" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-purple-800 dark:fill-purple-200">
          Human ears are symmetric \u2192 we can locate left/right but struggle with up/down. Owls can do both.
        </text>
      </svg>
    </div>
  );
}
