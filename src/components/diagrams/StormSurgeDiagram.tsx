const StormSurgeDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 695 438"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how storm surge pushes water onto the coast"
      >
        <style>{`
          @keyframes surgeWave {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          @keyframes spiralPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .surge-move {
            animation: surgeWave 2s ease-in-out infinite;
          }
          .spiral-pulse {
            animation: spiralPulse 1.5s ease-in-out infinite;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .small-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .danger-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 700;
          }
        `}</style>

        <defs>
          <marker id="surge-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="surge-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="surge-arrow-white" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-700 dark:fill-slate-200" />
          </marker>
          {/* Water gradient */}
          <linearGradient id="ocean-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="surge-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          How Storm Surge Works
        </text>

        {/* ===== SKY AREA ===== */}

        {/* Cyclone spiral symbol */}
        <path d="M 250 75 A 30 30 0 1 1 250 74.9" fill="none"
          className="stroke-slate-400 dark:stroke-slate-300 spiral-pulse" strokeWidth="2.5" />
        <path d="M 250 85 A 20 20 0 1 1 250 84.9" fill="none"
          className="stroke-slate-400 dark:stroke-slate-300 spiral-pulse" strokeWidth="2" />
        <path d="M 250 91 A 14 14 0 1 1 250 90.9" fill="none"
          className="stroke-slate-500 dark:stroke-slate-200 spiral-pulse" strokeWidth="1.5" />
        <circle cx="250" cy="82" r="4"
          className="fill-slate-300 dark:fill-slate-400" />

        <text x="250" y="52" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Cyclone
        </text>

        {/* Large arrows pushing water toward shore */}
        <line x1="290" y1="80" x2="370" y2="130"
          stroke="#60a5fa" strokeWidth="4" markerEnd="url(#surge-arrow-blue)"
          className="surge-move" />
        <line x1="280" y1="100" x2="350" y2="145"
          stroke="#60a5fa" strokeWidth="3.5" markerEnd="url(#surge-arrow-blue)"
          className="surge-move" />
        <line x1="270" y1="115" x2="330" y2="155"
          stroke="#60a5fa" strokeWidth="3" markerEnd="url(#surge-arrow-blue)"
          className="surge-move" />
        <text x="340" y="100" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          Wind pushes
        </text>
        <text x="340" y="112" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          water shoreward
        </text>

        {/* ===== SEABED — angled upward toward coast ===== */}
        <polygon points="0,350 0,300 430,265 530,200 600,200 600,350"
          className="fill-amber-700 dark:fill-amber-900" opacity="0.7" />
        {/* Seabed surface line */}
        <line x1="0" y1="300" x2="430" y2="265"
          className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="2" />
        <line x1="430" y1="265" x2="530" y2="200"
          className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="2" />

        {/* Seabed label */}
        <text x="200" y="315" textAnchor="middle"
          className="label-text fill-amber-400 dark:fill-amber-300" fontWeight="600">
          Shallow seabed forces water UP
        </text>
        <path d="M 320 308 Q 370 280 400 268" fill="none"
          className="stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5"
          markerEnd="url(#surge-arrow-white)" />

        {/* ===== NORMAL SEA LEVEL — dashed line ===== */}
        <line x1="0" y1="210" x2="460" y2="210"
          stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="45" y="206" textAnchor="start"
          className="small-text fill-slate-400 dark:fill-slate-500">
          Normal sea level
        </text>

        {/* ===== OPEN OCEAN WATER (left side, at normal level) ===== */}
        <polygon points="0,210 220,210 220,300 0,300"
          fill="url(#ocean-grad)" />
        {/* Wave surface */}
        <path d="M 0 210 Q 20 205 40 210 Q 60 215 80 210 Q 100 205 120 210 Q 140 215 160 210 Q 180 205 200 210 L 220 210"
          fill="none" className="stroke-blue-300 dark:stroke-blue-400" strokeWidth="1.5" />

        <text x="110" y="250" textAnchor="middle"
          className="label-text fill-blue-200 dark:fill-blue-300" fontWeight="600">
          Open Ocean
        </text>
        <text x="110" y="264" textAnchor="middle"
          className="small-text fill-blue-200 dark:fill-blue-300">
          (normal level)
        </text>

        {/* ===== STORM SURGE WATER — raised mass approaching shore ===== */}
        {/* The surge water: rises from normal level (210) up to 160 (5m surge) */}
        <polygon points="220,210 460,210 460,265 530,200 530,160 420,160 340,165 260,170 220,180"
          fill="url(#surge-grad)" className="surge-move" />
        {/* Surge surface wave */}
        <path d="M 220 180 Q 260 168 300 165 Q 350 162 400 160 Q 430 160 460 158 Q 490 158 520 160 L 530 160"
          fill="none" stroke="#93c5fd" strokeWidth="2" className="surge-move" />

        {/* ===== COAST / LAND (right side) ===== */}
        <polygon points="530,200 530,40 600,40 600,200"
          className="fill-amber-600 dark:fill-amber-800" />
        {/* Land texture */}
        <rect x="530" y="40" width="70" height="160"
          className="fill-amber-500 dark:fill-amber-700" opacity="0.5" />

        <text x="565" y="80" textAnchor="middle"
          className="label-text fill-amber-200 dark:fill-amber-300" fontWeight="600">
          Coast
        </text>

        {/* ===== HOUSE partially submerged ===== */}
        {/* House body */}
        <rect x="535" y="132" width="30" height="30"
          className="fill-slate-200 dark:fill-slate-400" stroke="#94a3b8" strokeWidth="1" />
        {/* Roof */}
        <polygon points="532,132 550,115 568,132"
          className="fill-red-500 dark:fill-red-600" stroke="#dc2626" strokeWidth="1" />
        {/* Door */}
        <rect x="545" y="148" width="10" height="14"
          className="fill-amber-800 dark:fill-amber-900" />
        {/* Window */}
        <rect x="538" y="138" width="7" height="7"
          className="fill-sky-300 dark:fill-sky-500" stroke="#94a3b8" strokeWidth="0.5" />

        {/* Water covering lower part of house */}
        <rect x="530" y="160" width="40" height="10"
          className="fill-blue-500 dark:fill-blue-600" opacity="0.5" />

        {/* ===== 5m STORM SURGE LABEL ===== */}
        {/* Measurement bracket */}
        <line x1="500" y1="160" x2="500" y2="210"
          stroke="#ef4444" strokeWidth="2" />
        {/* Top tick */}
        <line x1="495" y1="160" x2="505" y2="160"
          stroke="#ef4444" strokeWidth="2" />
        {/* Bottom tick */}
        <line x1="495" y1="210" x2="505" y2="210"
          stroke="#ef4444" strokeWidth="2" />
        {/* Label */}
        <text x="492" y="190" textAnchor="end"
          className="danger-text fill-red-500 dark:fill-red-400">
          5m
        </text>
        <text x="492" y="200" textAnchor="end"
          className="small-text fill-red-400 dark:fill-red-400">
          storm surge
        </text>

        {/* ===== BAY OF BENGAL FUNNEL ANNOTATION ===== */}
        {/* Funnel shape */}
        <line x1="20" y1="345" x2="100" y2="370"
          className="stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5" />
        <line x1="200" y1="345" x2="100" y2="370"
          className="stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5" />
        {/* Arrow at narrow end */}
        <line x1="100" y1="370" x2="100" y2="380"
          className="stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5"
          markerEnd="url(#surge-arrow-white)" />

        <text x="110" y="340" textAnchor="start"
          className="label-text fill-amber-400 dark:fill-amber-300" fontWeight="600">
          Bay of Bengal: funnel-shaped
        </text>
        <text x="110" y="352" textAnchor="start"
          className="small-text fill-amber-400 dark:fill-amber-300">
          coast concentrates the surge
        </text>

        {/* Danger warning */}
        <text x="350" y="388" textAnchor="start"
          className="small-text fill-red-400 dark:fill-red-400">
          Storm surge causes 90% of cyclone deaths
        </text>
      </svg>
    </div>
  );
};

export default StormSurgeDiagram;
