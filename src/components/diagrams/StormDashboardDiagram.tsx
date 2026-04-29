const StormDashboardDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 697 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Complete cyclone tracker dashboard mock-up with map panel showing track, chart panel showing intensity over time, alert panel with warnings, and status indicators"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .small-text { font-family: system-ui, sans-serif; font-size: 8.5px; }
          .panel-title { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700; }
          .dash-title { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; }
        `}</style>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Complete Cyclone Tracker Dashboard
        </text>

        {/* Dashboard frame */}
        <rect x="15" y="32" width="570" height="395" rx="6"
          className="fill-slate-800 dark:fill-slate-950" />

        {/* Top bar */}
        <rect x="15" y="32" width="570" height="28" rx="6"
          className="fill-slate-700 dark:fill-slate-800" />
        <circle cx="32" cy="46" r="5" className="fill-red-500" opacity="0.8" />
        <circle cx="48" cy="46" r="5" className="fill-amber-500" opacity="0.8" />
        <circle cx="64" cy="46" r="5" className="fill-green-500" opacity="0.8" />
        <text x="300" y="50" textAnchor="middle"
          className="dash-title fill-slate-200">
          Cyclone Tracker v1.0 — Bay of Bengal
        </text>

        {/* Status indicators (top right) */}
        <circle cx="530" cy="46" r="4" className="fill-green-400" />
        <text x="540" y="49" className="small-text fill-green-400">LIVE</text>

        {/* PANEL 1: Map Panel (top left - largest) */}
        <rect x="22" y="65" width="280" height="200" rx="4"
          className="fill-slate-900 dark:fill-black" />
        <rect x="22" y="65" width="280" height="18" rx="4"
          className="fill-blue-900" opacity="0.8" />
        <text x="162" y="77" textAnchor="middle"
          className="panel-title fill-blue-300">
          TRACK MAP
        </text>

        {/* Ocean background */}
        <rect x="25" y="85" width="274" height="177" rx="2"
          className="fill-blue-950" opacity="0.8" />

        {/* Simple coastline */}
        <path d="M 25 85 L 25 180 Q 50 210 80 240 Q 100 255 120 262 L 25 262 Z"
          className="fill-green-800" opacity="0.5" />

        {/* Cyclone track */}
        <path d="M 250 240 Q 230 210 210 185 Q 190 165 170 150 Q 150 140 130 135"
          fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Track dots with colors */}
        <circle cx="250" cy="240" r="3" className="fill-green-500" />
        <circle cx="210" cy="185" r="3" className="fill-yellow-500" />
        <circle cx="170" cy="150" r="4" className="fill-red-500" />

        {/* Uncertainty cone */}
        <path d="M 170 150 Q 150 135 130 120 M 170 150 Q 145 150 120 150"
          fill="none" className="stroke-red-400" strokeWidth="1" strokeDasharray="3,2" />
        <path d="M 130 120 L 120 150 L 170 150 Z"
          className="fill-red-500" opacity="0.15" />

        {/* Current position marker */}
        <circle cx="170" cy="150" r="6" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="170" cy="150" r="2" className="fill-red-500" />

        {/* Position label */}
        <text x="185" y="147" className="small-text fill-red-400">
          16.2°N, 87.5°E
        </text>

        {/* Map legend */}
        <rect x="200" y="88" width="95" height="40" rx="3"
          className="fill-slate-800" opacity="0.8" />
        <circle cx="210" cy="97" r="2" className="fill-green-500" />
        <text x="217" y="100" className="small-text fill-slate-400">Depression</text>
        <circle cx="210" cy="109" r="2" className="fill-yellow-500" />
        <text x="217" y="112" className="small-text fill-slate-400">Storm</text>
        <circle cx="210" cy="121" r="2" className="fill-red-500" />
        <text x="217" y="124" className="small-text fill-slate-400">Severe</text>

        {/* PANEL 2: Intensity Chart (top right) */}
        <rect x="308" y="65" width="270" height="200" rx="4"
          className="fill-slate-900 dark:fill-black" />
        <rect x="308" y="65" width="270" height="18" rx="4"
          className="fill-amber-900" opacity="0.8" />
        <text x="443" y="77" textAnchor="middle"
          className="panel-title fill-amber-300">
          INTENSITY OVER TIME
        </text>

        {/* Chart area */}
        {/* Y axis */}
        <line x1="340" y1="92" x2="340" y2="248"
          className="stroke-slate-600" strokeWidth="1" />
        {/* X axis */}
        <line x1="340" y1="248" x2="565" y2="248"
          className="stroke-slate-600" strokeWidth="1" />

        {/* Y labels */}
        <text x="335" y="100" textAnchor="end" className="small-text fill-slate-500">200</text>
        <text x="335" y="140" textAnchor="end" className="small-text fill-slate-500">150</text>
        <text x="335" y="180" textAnchor="end" className="small-text fill-slate-500">100</text>
        <text x="335" y="220" textAnchor="end" className="small-text fill-slate-500">50</text>
        <text x="335" y="250" textAnchor="end" className="small-text fill-slate-500">0</text>
        <text x="320" y="170" textAnchor="middle" className="small-text fill-slate-400"
          transform="rotate(-90, 320, 170)">km/h</text>

        {/* X labels */}
        <text x="370" y="258" textAnchor="middle" className="small-text fill-slate-500">-48h</text>
        <text x="415" y="258" textAnchor="middle" className="small-text fill-slate-500">-36h</text>
        <text x="460" y="258" textAnchor="middle" className="small-text fill-slate-500">-24h</text>
        <text x="505" y="258" textAnchor="middle" className="small-text fill-slate-500">-12h</text>
        <text x="550" y="258" textAnchor="middle" className="small-text fill-slate-500">Now</text>

        {/* Grid lines */}
        {[100, 140, 180, 220].map((y) => (
          <line key={`gy-${y}`} x1="340" y1={y} x2="565" y2={y}
            className="stroke-slate-700" strokeWidth="0.5" />
        ))}

        {/* Intensity line (rising) */}
        <polyline
          points="370,230 395,215 415,200 440,180 460,155 480,130 505,115 530,105 550,98"
          fill="none" stroke="#f59e0b" strokeWidth="2" />

        {/* Category thresholds */}
        <line x1="340" y1="195" x2="565" y2="195"
          stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <text x="567" y="198" className="small-text fill-red-500">Cat 1</text>

        <line x1="340" y1="145" x2="565" y2="145"
          stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <text x="567" y="148" className="small-text fill-red-500">Cat 3</text>

        {/* Current intensity marker */}
        <circle cx="550" cy="98" r="4" className="fill-amber-400" />

        {/* PANEL 3: Alert Panel (bottom left) */}
        <rect x="22" y="270" width="200" height="150" rx="4"
          className="fill-slate-900 dark:fill-black" />
        <rect x="22" y="270" width="200" height="18" rx="4"
          className="fill-red-900" opacity="0.8" />
        <text x="122" y="282" textAnchor="middle"
          className="panel-title fill-red-300">
          ALERTS & WARNINGS
        </text>

        {/* Alert items */}
        {[
          { icon: '!', bg: 'fill-red-800', text: 'RED ALERT: Landfall in 18h', color: 'fill-red-400' },
          { icon: '!', bg: 'fill-amber-800', text: 'Surge warning: 4.5m expected', color: 'fill-amber-400' },
          { icon: 'i', bg: 'fill-blue-800', text: 'Evacuation zone: 8km inland', color: 'fill-blue-400' },
          { icon: '>', bg: 'fill-green-800', text: 'Shelters activated: 47 centers', color: 'fill-green-400' },
        ].map((alert, i) => (
          <g key={`alert-${i}`}>
            <rect x="28" y={295 + i * 28} width="188" height="24" rx="3"
              className={alert.bg} opacity="0.5" />
            <circle cx="40" cy={307 + i * 28} r="7"
              className={alert.bg} opacity="0.8" />
            <text x="40" y={311 + i * 28} textAnchor="middle"
              className="small-text" fill="white" fontWeight="700">{alert.icon}</text>
            <text x="52" y={310 + i * 28}
              className={`small-text ${alert.color}`}>{alert.text}</text>
          </g>
        ))}

        {/* PANEL 4: Status Panel (bottom center) */}
        <rect x="228" y="270" width="170" height="150" rx="4"
          className="fill-slate-900 dark:fill-black" />
        <rect x="228" y="270" width="170" height="18" rx="4"
          className="fill-sky-900" opacity="0.8" />
        <text x="313" y="282" textAnchor="middle"
          className="panel-title fill-sky-300">
          STORM STATUS
        </text>

        {[
          { label: 'Name', value: 'DANA' },
          { label: 'Category', value: 'Cat 3 — Severe' },
          { label: 'Wind', value: '185 km/h' },
          { label: 'Pressure', value: '960 mb' },
          { label: 'Movement', value: 'NW at 18 km/h' },
          { label: 'Landfall', value: '~18 hours' },
        ].map((item, i) => (
          <g key={`stat-${i}`}>
            <text x="238" y={305 + i * 20}
              className="small-text fill-slate-500">{item.label}</text>
            <text x="390" y={305 + i * 20} textAnchor="end"
              className="small-text fill-slate-200" fontWeight="600">{item.value}</text>
          </g>
        ))}

        {/* PANEL 5: Surge Panel (bottom right) */}
        <rect x="404" y="270" width="174" height="150" rx="4"
          className="fill-slate-900 dark:fill-black" />
        <rect x="404" y="270" width="174" height="18" rx="4"
          className="fill-orange-900" opacity="0.8" />
        <text x="491" y="282" textAnchor="middle"
          className="panel-title fill-orange-300">
          SURGE RISK
        </text>

        {/* Surge meter */}
        <rect x="420" y="296" width="30" height="110" rx="4"
          className="fill-slate-700" />
        {/* Fill level */}
        <rect x="423" y="340" width="24" height="63" rx="3"
          className="fill-red-500" opacity="0.8" />
        {/* Scale marks */}
        {[0, 2, 4, 6, 8].map((m, i) => (
          <g key={`sm-${i}`}>
            <line x1="452" y1={400 - i * 14} x2="458" y2={400 - i * 14}
              className="stroke-slate-500" strokeWidth="1" />
            <text x="462" y={403 - i * 14}
              className="small-text fill-slate-400">{m}m</text>
          </g>
        ))}

        {/* Current reading */}
        <line x1="420" y1="340" x2="460" y2="340"
          className="stroke-amber-400" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="486" y="344"
          className="step-text fill-amber-400">4.5m</text>

        {/* Risk zones */}
        <rect x="500" y="300" width="70" height="18" rx="3"
          className="fill-red-800" opacity="0.7" />
        <text x="535" y="313" textAnchor="middle"
          className="small-text fill-red-400">EXTREME</text>

        <rect x="500" y="322" width="70" height="18" rx="3"
          className="fill-amber-800" opacity="0.5" />
        <text x="535" y="335" textAnchor="middle"
          className="small-text fill-amber-400">HIGH</text>

        <rect x="500" y="344" width="70" height="18" rx="3"
          className="fill-yellow-800" opacity="0.3" />
        <text x="535" y="357" textAnchor="middle"
          className="small-text fill-yellow-400">MODERATE</text>

        <text x="535" y="380" textAnchor="middle"
          className="small-text fill-slate-400">
          Population at risk:
        </text>
        <text x="535" y="395" textAnchor="middle"
          className="small-text fill-red-400" fontWeight="700">
          ~2.4 million
        </text>

        {/* Bottom caption */}
        <rect x="50" y="430" width="500" height="0" rx="0" />
      </svg>
    </div>
  );
};

export default StormDashboardDiagram;
