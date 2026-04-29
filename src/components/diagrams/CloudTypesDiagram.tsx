const CloudTypesDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 667 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing four main cloud types at different altitudes: cirrus, cumulus, stratus, and cumulonimbus"
      >
        <style>{`
          @keyframes drift {
            0% { transform: translateX(0); }
            50% { transform: translateX(6px); }
            100% { transform: translateX(0); }
          }
          .drift-slow { animation: drift 8s ease-in-out infinite; }
          .drift-med { animation: drift 6s ease-in-out 2s infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .cloud-name { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; }
          .altitude-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="620" height="500" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="310" y="26" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Reading the Sky &#8212; The Four Main Cloud Types
        </text>

        {/* Sky gradient background */}
        <defs>
          <linearGradient id="ct-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="40%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#87CEEB" />
          </linearGradient>
        </defs>
        <rect x="60" y="38" width="500" height="380" rx="6" fill="url(#ct-sky)" opacity="0.15" />

        {/* Altitude scale on left */}
        <line x1="55" y1="48" x2="55" y2="410" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="48" y="60" textAnchor="end" className="altitude-text fill-slate-500 dark:fill-slate-400">12 km</text>
        <line x1="52" y1="58" x2="58" y2="58" className="stroke-slate-400" strokeWidth="1" />
        <text x="48" y="130" textAnchor="end" className="altitude-text fill-slate-500 dark:fill-slate-400">8 km</text>
        <line x1="52" y1="128" x2="58" y2="128" className="stroke-slate-400" strokeWidth="1" />
        <text x="48" y="200" textAnchor="end" className="altitude-text fill-slate-500 dark:fill-slate-400">6 km</text>
        <line x1="52" y1="198" x2="58" y2="198" className="stroke-slate-400" strokeWidth="1" />
        <text x="48" y="290" textAnchor="end" className="altitude-text fill-slate-500 dark:fill-slate-400">2 km</text>
        <line x1="52" y1="288" x2="58" y2="288" className="stroke-slate-400" strokeWidth="1" />
        <text x="48" y="410" textAnchor="end" className="altitude-text fill-slate-500 dark:fill-slate-400">0 km</text>
        <line x1="52" y1="408" x2="58" y2="408" className="stroke-slate-400" strokeWidth="1" />

        {/* Altitude zone labels */}
        <rect x="62" y="42" width="60" height="16" rx="3" className="fill-blue-200 dark:fill-blue-800" opacity="0.5" />
        <text x="92" y="54" textAnchor="middle" className="altitude-text fill-blue-700 dark:fill-blue-300">HIGH</text>
        <rect x="62" y="170" width="60" height="16" rx="3" className="fill-green-200 dark:fill-green-800" opacity="0.5" />
        <text x="92" y="182" textAnchor="middle" className="altitude-text fill-green-700 dark:fill-green-300">MIDDLE</text>
        <rect x="62" y="260" width="60" height="16" rx="3" className="fill-orange-200 dark:fill-orange-800" opacity="0.5" />
        <text x="92" y="272" textAnchor="middle" className="altitude-text fill-orange-700 dark:fill-orange-300">LOW</text>

        {/* Ground */}
        <rect x="60" y="408" width="500" height="10" rx="3"
          className="fill-green-200 dark:fill-green-900" opacity="0.5" />

        {/* 1. CIRRUS - high altitude, wispy */}
        <g className="drift-slow">
          <path d="M 180 80 Q 200 70 220 78 Q 240 68 260 75 Q 280 68 300 80"
            fill="none" className="stroke-white dark:stroke-gray-400" strokeWidth="1.5" opacity="0.7" />
          <path d="M 200 90 Q 220 82 240 88 Q 260 80 275 86"
            fill="none" className="stroke-white dark:stroke-gray-400" strokeWidth="1" opacity="0.5" />
        </g>
        {/* Cirrus info box */}
        <rect x="310" y="60" width="220" height="60" rx="6"
          className="fill-blue-50 dark:fill-blue-900/30" stroke="#60a5fa" strokeWidth="1" />
        <text x="420" y="76" textAnchor="middle" className="cloud-name fill-blue-700 dark:fill-blue-300">Cirrus</text>
        <text x="420" y="90" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Thin, wispy ice crystals at 6&#8211;12 km</text>
        <text x="420" y="102" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Predict: Fair weather now,</text>
        <text x="420" y="114" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">possible change in 24&#8211;48 hours</text>

        {/* 2. CUMULUS - mid-low altitude, puffy */}
        <g className="drift-med">
          <ellipse cx="180" cy="220" rx="35" ry="15" className="fill-white dark:fill-gray-400" opacity="0.7" />
          <ellipse cx="165" cy="215" rx="22" ry="14" className="fill-gray-100 dark:fill-gray-300" opacity="0.6" />
          <ellipse cx="198" cy="215" rx="25" ry="12" className="fill-gray-100 dark:fill-gray-300" opacity="0.6" />
          <ellipse cx="180" cy="208" rx="28" ry="12" className="fill-white dark:fill-gray-200" opacity="0.5" />
          <rect x="157" y="220" width="46" height="12" rx="2" className="fill-gray-300 dark:fill-gray-500" opacity="0.4" />
        </g>
        {/* Cumulus info box */}
        <rect x="310" y="190" width="220" height="60" rx="6"
          className="fill-green-50 dark:fill-green-900/30" stroke="#22c55e" strokeWidth="1" />
        <text x="420" y="206" textAnchor="middle" className="cloud-name fill-green-700 dark:fill-green-300">Cumulus</text>
        <text x="420" y="220" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">Puffy, cotton-ball shape, 1&#8211;6 km</text>
        <text x="420" y="232" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">Predict: Fair weather (small ones)</text>
        <text x="420" y="244" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">Growing tall = possible storms</text>

        {/* 3. STRATUS - low altitude, flat sheet */}
        <rect x="100" y="310" width="200" height="14" rx="4"
          className="fill-gray-300 dark:fill-gray-600" opacity="0.6" />
        <rect x="110" y="306" width="180" height="10" rx="3"
          className="fill-gray-200 dark:fill-gray-500" opacity="0.5" />
        {/* Stratus info box */}
        <rect x="310" y="290" width="220" height="52" rx="6"
          className="fill-orange-50 dark:fill-orange-900/30" stroke="#f97316" strokeWidth="1" />
        <text x="420" y="306" textAnchor="middle" className="cloud-name fill-orange-700 dark:fill-orange-300">Stratus</text>
        <text x="420" y="320" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400">Flat, grey blanket below 2 km</text>
        <text x="420" y="332" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400">Predict: Drizzle, overcast, fog</text>

        {/* 4. CUMULONIMBUS - all altitudes, tower */}
        <g>
          {/* Base */}
          <rect x="80" y="365" width="60" height="40" rx="2"
            className="fill-gray-500 dark:fill-gray-700" opacity="0.6" />
          {/* Tower */}
          <rect x="85" y="180" width="50" height="185" rx="4"
            className="fill-gray-400 dark:fill-gray-600" opacity="0.5" />
          {/* Anvil top */}
          <path d="M 60 180 Q 80 155 110 150 Q 140 155 160 180 L 60 180 Z"
            className="fill-gray-300 dark:fill-gray-500" opacity="0.6" />
          <path d="M 130 165 Q 145 155 170 165 Q 185 158 195 168"
            fill="none" className="stroke-gray-300 dark:stroke-gray-500" strokeWidth="2" opacity="0.5" />
          {/* Lightning */}
          <path d="M 105 360 L 100 375 L 108 372 L 103 400"
            fill="none" className="stroke-yellow-400" strokeWidth="1.5" />
        </g>

        {/* Cb connecting line */}
        <line x1="160" y1="360" x2="310" y2="370" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="3,3" />

        {/* Cumulonimbus info box */}
        <rect x="310" y="355" width="220" height="60" rx="6"
          className="fill-red-50 dark:fill-red-900/30" stroke="#ef4444" strokeWidth="1" />
        <text x="420" y="371" textAnchor="middle" className="cloud-name fill-red-700 dark:fill-red-300">Cumulonimbus</text>
        <text x="420" y="385" textAnchor="middle" className="label-text fill-red-600 dark:fill-red-400">Towering storm cloud, 1&#8211;12+ km</text>
        <text x="420" y="397" textAnchor="middle" className="label-text fill-red-600 dark:fill-red-400">Predict: Heavy rain, thunder,</text>
        <text x="420" y="409" textAnchor="middle" className="label-text fill-red-600 dark:fill-red-400">lightning, hail, strong winds</text>

        {/* Bottom: quick identification guide */}
        <rect x="60" y="430" width="500" height="58" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="310" y="448" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="700">
          Quick Guide: What the Clouds Tell You
        </text>
        <text x="310" y="462" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Thin + high = fair &#x2022; Puffy + growing = watch out &#x2022; Flat + grey = drizzle &#x2022; Towering + dark = take shelter
        </text>
        <text x="310" y="476" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Meghi was a cumulonimbus &#8212; dark, heavy, and packed with rain. She just needed the right push to release it.
        </text>
      </svg>
    </div>
  );
};

export default CloudTypesDiagram;
