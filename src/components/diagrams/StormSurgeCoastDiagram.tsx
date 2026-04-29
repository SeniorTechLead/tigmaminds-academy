const StormSurgeCoastDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 690 437"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Side-view cross section showing storm surge pushing ocean water onto a coastal area, submerging a house"
      >
        <style>{`
          @keyframes wavePush {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          @keyframes surgeRise {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          .wave-push { animation: wavePush 2s ease-in-out infinite; }
          .surge-pulse { animation: surgeRise 2.5s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        <defs>
          <marker id="ss-arrow-wind" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 dark:fill-slate-300" />
          </marker>
          <marker id="ss-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="ss-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <clipPath id="ss-surge-clip">
            <rect x="0" y="0" width="600" height="400" />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width="600" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Storm Surge — The Deadliest Part of a Cyclone
        </text>

        {/* Sky */}
        <rect x="1" y="35" width="598" height="165" rx="0"
          className="fill-gray-100 dark:fill-gray-900" opacity="0.3" />

        {/* Storm cloud above ocean — left side */}
        <ellipse cx="150" cy="70" rx="100" ry="35"
          className="fill-gray-400 dark:fill-gray-600" opacity="0.6" />
        <ellipse cx="130" cy="60" rx="70" ry="25"
          className="fill-gray-500 dark:fill-gray-500" opacity="0.5" />
        <ellipse cx="170" cy="65" rx="60" ry="22"
          className="fill-gray-500 dark:fill-gray-500" opacity="0.5" />
        <text x="150" y="72" textAnchor="middle"
          className="label-text fill-gray-700 dark:fill-gray-200" fontWeight="600">
          Cyclone
        </text>

        {/* Wind arrows pushing water toward shore */}
        {[100, 120, 140].map((y) => (
          <line key={`wind-${y}`} x1="120" y1={y} x2="250" y2={y}
            className="stroke-slate-500 dark:stroke-slate-300 wave-push" strokeWidth="2"
            markerEnd="url(#ss-arrow-wind)" />
        ))}
        <text x="185" y="162" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Wind pushes water
        </text>

        {/* Sea floor — slopes up toward right (coast) */}
        <path d="M 0 340 L 300 310 L 430 260 L 500 230 L 600 220 L 600 400 L 0 400 Z"
          className="fill-amber-200 dark:fill-amber-900" opacity="0.6" />
        <path d="M 0 340 L 300 310 L 430 260 L 500 230 L 600 220"
          fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="350" y="350" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-400">
          Shallow sea floor
        </text>

        {/* Normal sea level — open ocean */}
        <rect x="0" y="200" width="300" height="140" rx="0"
          className="fill-blue-400 dark:fill-blue-800" opacity="0.4" />
        <path d="M 0 200 Q 15 196 30 200 Q 45 204 60 200 Q 75 196 90 200 Q 105 204 120 200 Q 135 196 150 200 Q 165 204 180 200 Q 195 196 210 200 Q 225 204 240 200 Q 255 196 270 200 Q 285 204 300 200"
          fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Normal sea level reference line */}
        <line x1="0" y1="200" x2="600" y2="200"
          className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1" strokeDasharray="6,3" />
        <text x="55" y="195" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Normal sea level
        </text>

        {/* Storm surge water — piling up toward coast */}
        <path d="M 200 200 Q 280 185 350 165 Q 410 145 470 130 Q 520 120 560 115 L 600 115 L 600 220 L 500 230 L 430 260 L 300 310 L 200 340 Z"
          className="fill-blue-500 dark:fill-blue-600 surge-pulse" opacity="0.5" />
        {/* Surge wave surface */}
        <path d="M 200 200 Q 280 185 350 165 Q 410 145 470 130 Q 520 120 560 115 L 600 115"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />

        {/* Water behind house */}
        <rect x="480" y="140" width="120" height="80" rx="0"
          className="fill-blue-500 dark:fill-blue-600" opacity="0.4" />

        {/* Storm surge height marker */}
        <line x1="445" y1="200" x2="445" y2="130"
          stroke="#ef4444" strokeWidth="2" />
        <line x1="438" y1="200" x2="452" y2="200" stroke="#ef4444" strokeWidth="2" />
        <line x1="438" y1="130" x2="452" y2="130" stroke="#ef4444" strokeWidth="2" />
        <text x="460" y="160" textAnchor="start"
          className="label-text fill-red-600 dark:fill-red-400" fontWeight="700">
          ~5 m
        </text>
        <text x="460" y="172" textAnchor="start"
          className="label-text fill-red-500 dark:fill-red-400">
          surge
        </text>

        {/* House — partially submerged */}
        {/* House body */}
        <rect x="510" y="155" width="50" height="55" rx="1"
          className="fill-amber-100 dark:fill-amber-800" stroke="#92400e" strokeWidth="1.5" />
        {/* Roof */}
        <path d="M 505 155 L 535 130 L 565 155 Z"
          className="fill-red-500 dark:fill-red-600" stroke="#991b1b" strokeWidth="1" />
        {/* Door */}
        <rect x="527" y="180" width="16" height="28" rx="1"
          className="fill-amber-700 dark:fill-amber-600" />
        {/* Window */}
        <rect x="515" y="162" width="10" height="10" rx="1"
          className="fill-sky-200 dark:fill-sky-700" stroke="#92400e" strokeWidth="0.5" />
        <rect x="545" y="162" width="10" height="10" rx="1"
          className="fill-sky-200 dark:fill-sky-700" stroke="#92400e" strokeWidth="0.5" />
        {/* Water covering lower half of house */}
        <rect x="505" y="175" width="60" height="35" rx="0"
          className="fill-blue-500 dark:fill-blue-600" opacity="0.55" />

        {/* Ground / shore line */}
        <path d="M 470 220 L 600 220"
          fill="none" className="stroke-green-600 dark:stroke-green-500" strokeWidth="2" />
        <text x="560" y="242" textAnchor="middle"
          className="label-text fill-green-700 dark:fill-green-400">
          Coast
        </text>

        {/* Open ocean label */}
        <text x="80" y="270" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Open ocean
        </text>
        <text x="80" y="283" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          (normal level)
        </text>

        {/* Bottom caption */}
        <rect x="80" y="370" width="440" height="24" rx="6"
          className="fill-red-50 dark:fill-red-950" opacity="0.8" />
        <text x="300" y="387" textAnchor="middle"
          className="caption-text fill-red-600 dark:fill-red-400" fontWeight="700">
          Storm surge causes 90% of cyclone deaths
        </text>
      </svg>
    </div>
  );
};

export default StormSurgeCoastDiagram;
