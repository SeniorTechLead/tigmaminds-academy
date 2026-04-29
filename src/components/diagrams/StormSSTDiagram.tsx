const StormSSTDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 685 451"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing sea surface temperature threshold of 26.5 degrees Celsius for cyclone formation with a Bay of Bengal temperature map"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .temp-text { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
          .small-text { font-family: system-ui, sans-serif; font-size: 8.5px; }
        `}</style>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Sea Surface Temperature — The Fuel for Cyclones
        </text>

        {/* LEFT: Thermometer */}
        <rect x="30" y="50" width="180" height="320" rx="8"
          className="fill-slate-50 dark:fill-slate-800" opacity="0.6"
          stroke="#64748b" strokeWidth="1" />

        {/* Thermometer body */}
        <rect x="95" y="70" width="30" height="220" rx="6"
          className="fill-slate-200 dark:fill-slate-700" />

        {/* Cold section (below threshold) */}
        <rect x="98" y="165" width="24" height="122" rx="4"
          className="fill-blue-400 dark:fill-blue-600" />

        {/* Hot section (above threshold) */}
        <rect x="98" y="73" width="24" height="92" rx="4"
          className="fill-red-400 dark:fill-red-600" />

        {/* Thermometer bulb */}
        <circle cx="110" cy="300" r="18"
          className="fill-blue-400 dark:fill-blue-600" />

        {/* Threshold line */}
        <line x1="60" y1="165" x2="145" y2="165"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" />

        {/* Threshold label */}
        <text x="110" y="158" textAnchor="middle"
          className="temp-text fill-amber-600 dark:fill-amber-400">26.5°C</text>

        {/* Above label */}
        <rect x="135" y="100" width="68" height="38" rx="6"
          className="fill-red-100 dark:fill-red-900" opacity="0.8" />
        <text x="169" y="116" textAnchor="middle"
          className="step-text fill-red-600 dark:fill-red-400">
          Cyclone
        </text>
        <text x="169" y="130" textAnchor="middle"
          className="step-text fill-red-600 dark:fill-red-400">
          possible!
        </text>

        {/* Below label */}
        <rect x="135" y="200" width="68" height="38" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.8" />
        <text x="169" y="216" textAnchor="middle"
          className="step-text fill-blue-600 dark:fill-blue-400">
          Too cold
        </text>
        <text x="169" y="230" textAnchor="middle"
          className="step-text fill-blue-600 dark:fill-blue-400">
          for cyclones
        </text>

        {/* Temperature scale */}
        {[20, 22, 24, 26, 28, 30, 32].map((temp, i) => {
          const y = 287 - i * 32;
          return (
            <g key={`temp-${temp}`}>
              <line x1="80" y1={y} x2="95" y2={y}
                className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
              <text x="73" y={y + 3} textAnchor="end"
                className="small-text fill-slate-500 dark:fill-slate-400">{temp}°</text>
            </g>
          );
        })}

        {/* RIGHT: Simplified Bay of Bengal map */}
        <rect x="240" y="50" width="330" height="320" rx="8"
          className="fill-slate-50 dark:fill-slate-800" opacity="0.6"
          stroke="#64748b" strokeWidth="1" />

        <text x="405" y="72" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Bay of Bengal — Sea Surface Temperature
        </text>

        {/* Ocean background */}
        <rect x="260" y="85" width="290" height="230" rx="4"
          className="fill-blue-200 dark:fill-blue-800" opacity="0.5" />

        {/* Temperature bands (warm to cool, north to south conceptually) */}
        <rect x="260" y="85" width="290" height="55"
          className="fill-red-300 dark:fill-red-700" opacity="0.6" />
        <rect x="260" y="140" width="290" height="55"
          className="fill-orange-300 dark:fill-orange-700" opacity="0.6" />
        <rect x="260" y="195" width="290" height="55"
          className="fill-amber-300 dark:fill-amber-700" opacity="0.5" />
        <rect x="260" y="250" width="290" height="65"
          className="fill-yellow-200 dark:fill-yellow-800" opacity="0.5" />

        {/* Simplified coastline of India (left side) */}
        <path d="M 260 85 L 260 200 Q 280 240 310 270 Q 340 300 370 315 L 260 315 L 260 85 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.7" />

        {/* Coastline of Myanmar (right side) */}
        <path d="M 550 85 L 550 180 Q 530 210 510 240 Q 520 270 550 315 L 550 85 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.7" />

        {/* Temperature labels on map */}
        <text x="405" y="115" textAnchor="middle"
          className="step-text fill-red-800 dark:fill-red-200">30-31°C</text>
        <text x="405" y="170" textAnchor="middle"
          className="step-text fill-orange-800 dark:fill-orange-200">28-29°C</text>
        <text x="405" y="225" textAnchor="middle"
          className="step-text fill-amber-800 dark:fill-amber-200">27-28°C</text>
        <text x="420" y="285" textAnchor="middle"
          className="step-text fill-yellow-800 dark:fill-yellow-200">25-26°C</text>

        {/* Threshold line on map */}
        <line x1="260" y1="250" x2="550" y2="250"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2"
          strokeDasharray="6,3" />
        <text x="555" y="248" textAnchor="start"
          className="small-text fill-amber-600 dark:fill-amber-400">26.5°C line</text>

        {/* Cyclone icon in warm zone */}
        <path d="M 420 130 Q 430 120 435 130 Q 440 140 430 145 Q 420 140 415 135 Q 412 128 420 130"
          fill="none" className="stroke-red-600 dark:stroke-red-400" strokeWidth="1.5" />
        <circle cx="425" cy="135" r="3" className="fill-red-600 dark:fill-red-400" />

        {/* Legend */}
        <rect x="260" y="325" width="290" height="35" rx="4"
          className="fill-slate-100 dark:fill-slate-700" opacity="0.8" />
        <rect x="270" y="335" width="15" height="10" rx="2" className="fill-red-300 dark:fill-red-600" />
        <text x="290" y="344" className="small-text fill-slate-600 dark:fill-slate-300">Hot</text>
        <rect x="320" y="335" width="15" height="10" rx="2" className="fill-orange-300 dark:fill-orange-600" />
        <text x="340" y="344" className="small-text fill-slate-600 dark:fill-slate-300">Warm</text>
        <rect x="380" y="335" width="15" height="10" rx="2" className="fill-amber-300 dark:fill-amber-600" />
        <text x="400" y="344" className="small-text fill-slate-600 dark:fill-slate-300">Mild</text>
        <rect x="440" y="335" width="15" height="10" rx="2" className="fill-yellow-200 dark:fill-yellow-600" />
        <text x="460" y="344" className="small-text fill-slate-600 dark:fill-slate-300">Cool</text>

        {/* Bottom caption */}
        <rect x="60" y="385" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="401" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Cyclones need ocean water above 26.5°C — the Bay of Bengal is often warm enough
        </text>
      </svg>
    </div>
  );
};

export default StormSSTDiagram;
