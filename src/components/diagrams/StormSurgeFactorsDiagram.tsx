const StormSurgeFactorsDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 471"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three panels showing factors that worsen storm surge: wind speed, shallow continental shelf, and funnel-shaped coastline"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .panel-title { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="surge-wind" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="surge-water" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Three Factors That Worsen Storm Surge
        </text>

        {/* Panel 1: Wind Speed */}
        <rect x="15" y="48" width="180" height="260" rx="8"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.6"
          stroke="#3b82f6" strokeWidth="1.5" />
        <text x="105" y="70" textAnchor="middle"
          className="panel-title fill-blue-700 dark:fill-blue-300">
          1. Wind Speed
        </text>

        {/* Ocean surface */}
        <rect x="25" y="220" width="160" height="40" rx="4"
          className="fill-blue-200 dark:fill-blue-800" opacity="0.6" />
        <path d="M 25 220 Q 45 215 65 220 Q 85 225 105 220 Q 125 215 145 220 Q 165 225 185 220"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Wind arrows pushing water */}
        {[120, 145, 170, 195].map((y) => (
          <line key={`wind-${y}`} x1="30" y1={y} x2="140" y2={y}
            stroke="#3b82f6" strokeWidth="2" markerEnd="url(#surge-wind)" />
        ))}

        {/* Water piling up on right */}
        <path d="M 155 220 Q 170 195 175 180 L 185 180 L 185 260 L 155 260 Z"
          className="fill-blue-300 dark:fill-blue-600" opacity="0.6" />

        {/* Coast on right */}
        <rect x="175" y="150" width="15" height="110" rx="2"
          className="fill-green-400 dark:fill-green-700" />

        <text x="105" y="278" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Stronger wind pushes
        </text>
        <text x="105" y="292" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          more water toward coast
        </text>

        {/* Panel 2: Shallow Shelf */}
        <rect x="210" y="48" width="180" height="260" rx="8"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.6"
          stroke="#f59e0b" strokeWidth="1.5" />
        <text x="300" y="70" textAnchor="middle"
          className="panel-title fill-amber-700 dark:fill-amber-300">
          2. Shallow Shelf
        </text>

        {/* Deep ocean (left) */}
        <rect x="220" y="130" width="60" height="130" rx="2"
          className="fill-blue-400 dark:fill-blue-600" opacity="0.5" />

        {/* Angled seabed rising to coast */}
        <path d="M 280 260 L 380 200 L 380 260 Z"
          className="fill-amber-300 dark:fill-amber-700" opacity="0.7" />

        {/* Water over shelf */}
        <rect x="220" y="130" width="160" height="70" rx="0"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.4" />

        {/* Coast */}
        <rect x="370" y="130" width="12" height="130" rx="2"
          className="fill-green-400 dark:fill-green-700" />

        {/* Water level comparison */}
        <line x1="230" y1="130" x2="230" y2="145"
          className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2" />
        <text x="230" y="125" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">Low</text>

        {/* Water piling up at shore */}
        <path d="M 340 130 Q 360 100 370 90"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="360" y="85" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">High!</text>

        {/* Seabed label */}
        <text x="330" y="245" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300">
          Seabed
        </text>

        <text x="300" y="278" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Shallow water has nowhere
        </text>
        <text x="300" y="292" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          to go but UP
        </text>

        {/* Panel 3: Funnel Shape */}
        <rect x="405" y="48" width="180" height="260" rx="8"
          className="fill-red-50 dark:fill-red-950" opacity="0.6"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="495" y="70" textAnchor="middle"
          className="panel-title fill-red-700 dark:fill-red-300">
          3. Funnel Coast
        </text>

        {/* Converging coastline (funnel shape) */}
        {/* Left coast */}
        <path d="M 415 250 L 460 130"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="4" />
        {/* Right coast */}
        <path d="M 575 250 L 530 130"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="4" />

        {/* Water filling funnel */}
        <path d="M 420 240 L 455 150 L 535 150 L 570 240 Z"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.5" />

        {/* Water arrows converging */}
        <line x1="435" y1="220" x2="470" y2="160"
          stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#surge-water)" />
        <line x1="555" y1="220" x2="520" y2="160"
          stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#surge-water)" />
        <line x1="495" y1="230" x2="495" y2="165"
          stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#surge-water)" />

        {/* Surge at narrow end */}
        <path d="M 460 150 Q 480 110 495 100 Q 510 110 530 150"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="495" y="95" textAnchor="middle"
          className="step-text fill-red-600 dark:fill-red-400">
          Surge!
        </text>

        <text x="495" y="278" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Converging coast squeezes
        </text>
        <text x="495" y="292" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          water higher and higher
        </text>

        {/* Bay of Bengal note */}
        <rect x="60" y="325" width="480" height="65" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="345" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Bay of Bengal has all three — making it one of the worst places for storm surge
        </text>
        <text x="300" y="365" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          The Bangladesh coast is flat, shallow, and funnel-shaped where the Ganges meets the sea.
        </text>
        <text x="300" y="380" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Cyclone Bhola (1970) killed 300,000+ people — mostly from storm surge.
        </text>

        {/* Bottom caption */}
        <rect x="60" y="405" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="421" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Storm surge kills more people than wind — understanding it saves lives
        </text>
      </svg>
    </div>
  );
};

export default StormSurgeFactorsDiagram;
