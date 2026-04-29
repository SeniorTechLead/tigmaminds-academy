export default function AgniFlameColorDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 560 360"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing flame zones and colours at different temperatures"
      >
        <style>{`
          .afc-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .afc-label { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .afc-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .afc-temp { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="560" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" className="afc-title fill-gray-700 dark:fill-gray-200">
          Anatomy of a Candle Flame
        </text>

        {/* Candle body */}
        <rect x="115" y="290" width="50" height="60" rx="3"
          className="fill-yellow-100 dark:fill-yellow-900/40 stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1" />
        <line x1="140" y1="290" x2="140" y2="275" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        <text x="140" y="326" textAnchor="middle" className="afc-small fill-gray-500 dark:fill-gray-400">Wax</text>
        <text x="140" y="340" textAnchor="middle" className="afc-small fill-gray-500 dark:fill-gray-400">Wick</text>

        {/* Flame - outer (blue) */}
        <ellipse cx="140" cy="195" rx="40" ry="80"
          className="fill-blue-200/50 dark:fill-blue-600/20 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" strokeDasharray="3,2" />

        {/* Flame - middle (yellow/orange) */}
        <ellipse cx="140" cy="210" rx="28" ry="62"
          className="fill-yellow-300/60 dark:fill-yellow-500/30 stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="1" />

        {/* Flame - inner (dark zone) */}
        <ellipse cx="140" cy="245" rx="12" ry="26"
          className="fill-gray-800/40 dark:fill-gray-600/30 stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" strokeDasharray="2,2" />

        {/* Flame - tip (hottest, pale blue) */}
        <ellipse cx="140" cy="135" rx="8" ry="18"
          className="fill-blue-100/60 dark:fill-blue-400/20 stroke-blue-300 dark:stroke-blue-400" strokeWidth="1" />

        {/* Annotation lines + labels */}
        {/* Tip */}
        <line x1="152" y1="135" x2="280" y2="90" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="285" y="84" className="afc-label fill-blue-600 dark:fill-blue-300">Tip (hottest)</text>
        <text x="285" y="97" className="afc-temp fill-red-600 dark:fill-red-400">~1,400°C</text>
        <text x="285" y="110" className="afc-small fill-gray-500 dark:fill-gray-400">Complete combustion → faint blue</text>

        {/* Outer zone */}
        <line x1="178" y1="175" x2="280" y2="145" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="285" y="140" className="afc-label fill-blue-500 dark:fill-blue-300">Outer zone</text>
        <text x="285" y="153" className="afc-temp fill-red-600 dark:fill-red-400">~1,200°C</text>
        <text x="285" y="166" className="afc-small fill-gray-500 dark:fill-gray-400">Lots of O₂ → blue tint</text>

        {/* Luminous zone */}
        <line x1="170" y1="220" x2="280" y2="200" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="285" y="195" className="afc-label fill-yellow-600 dark:fill-yellow-300">Luminous zone</text>
        <text x="285" y="208" className="afc-temp fill-red-600 dark:fill-red-400">~1,000°C</text>
        <text x="285" y="221" className="afc-small fill-gray-500 dark:fill-gray-400">Soot particles glow yellow/orange</text>
        <text x="285" y="234" className="afc-small fill-gray-500 dark:fill-gray-400">Incomplete combustion of wax vapour</text>

        {/* Dark zone */}
        <line x1="155" y1="250" x2="280" y2="268" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="285" y="263" className="afc-label fill-gray-700 dark:fill-gray-300">Dark zone</text>
        <text x="285" y="276" className="afc-temp fill-red-600 dark:fill-red-400">~600°C</text>
        <text x="285" y="289" className="afc-small fill-gray-500 dark:fill-gray-400">Wax vapour, no burning yet</text>
        <text x="285" y="302" className="afc-small fill-gray-500 dark:fill-gray-400">Too cool for ignition</text>

        {/* Temperature scale bar */}
        <defs>
          <linearGradient id="afc-temp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <rect x="30" y="120" width="14" height="180" rx="4" fill="url(#afc-temp-grad)" opacity="0.7" />
        <text x="37" y="115" textAnchor="middle" className="afc-small fill-gray-500 dark:fill-gray-400">Hot</text>
        <text x="37" y="315" textAnchor="middle" className="afc-small fill-gray-500 dark:fill-gray-400">Cool</text>

        {/* Key insight */}
        <text x="280" y="348" textAnchor="middle" className="afc-small fill-gray-500 dark:fill-gray-400">
          Colour reveals temperature: blue &gt; yellow &gt; orange &gt; red (cooler)
        </text>
      </svg>
    </div>
  );
}
