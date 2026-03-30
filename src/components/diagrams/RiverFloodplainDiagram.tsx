export default function RiverFloodplainDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a river floodplain showing the river channel, natural levees, floodplain, and flood water level"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="640" height="380" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          River Floodplain — Cross Section
        </text>

        {/* Sky region */}
        <rect x="20" y="45" width="600" height="100" rx="4" fill="#bae6fd" opacity="0.15" />

        {/* Ground surface profile with levees and channel */}
        <path
          d="M20,200 L120,200 Q160,200 180,185 L200,170 Q210,165 220,170 L240,185
             Q260,200 280,200 L310,200 Q320,220 340,250 Q360,220 370,200 L400,200
             Q420,200 440,185 L460,170 Q470,165 480,170 L500,185 Q520,200 540,200
             L620,200"
          fill="none" className="stroke-gray-700 dark:stroke-slate-300" strokeWidth="2"
        />

        {/* Left floodplain fill */}
        <path
          d="M20,200 L120,200 Q160,200 180,185 L200,170 Q210,165 220,170 L240,185
             Q260,200 280,200 L310,200 L310,300 L20,300 Z"
          fill="#a16207" opacity="0.3"
        />

        {/* Right floodplain fill */}
        <path
          d="M370,200 L400,200 Q420,200 440,185 L460,170 Q470,165 480,170 L500,185
             Q520,200 540,200 L620,200 L620,300 L370,300 Z"
          fill="#a16207" opacity="0.3"
        />

        {/* River channel fill */}
        <path
          d="M310,200 Q320,220 340,250 Q360,220 370,200 Z"
          fill="#0ea5e9" opacity="0.6"
        />

        {/* Normal water level */}
        <path d="M315,215 Q340,220 365,215" fill="none" stroke="#0284c7" strokeWidth="1.5" />
        <text x="340" y="232" textAnchor="middle" className="sm fill-blue-600 dark:fill-blue-400">Normal</text>
        <text x="340" y="242" textAnchor="middle" className="sm fill-blue-600 dark:fill-blue-400">water level</text>

        {/* Flood water level (dashed line across) */}
        <line x1="40" y1="155" x2="600" y2="155" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="580" y="150" textAnchor="end" className="sm fill-red-600 dark:fill-red-400" fontWeight="600">Flood water level</text>

        {/* Flood water fill (translucent) */}
        <path
          d="M40,155 L600,155 L600,200 L540,200 Q520,200 500,185 L480,170 Q470,165 460,170
             L440,185 Q420,200 400,200 L370,200 Q360,220 340,250 Q320,220 310,200
             L280,200 Q260,200 240,185 L220,170 Q210,165 200,170 L180,185 Q160,200 120,200
             L40,200 Z"
          fill="#38bdf8" opacity="0.12"
        />

        {/* Silt deposition layer */}
        <rect x="40" y="200" width="250" height="6" rx="1" fill="#d97706" opacity="0.4" />
        <rect x="390" y="200" width="210" height="6" rx="1" fill="#d97706" opacity="0.4" />

        {/* Labels */}
        {/* Left levee */}
        <line x1="210" y1="165" x2="210" y2="120" stroke="#78716c" strokeWidth="0.8" />
        <text x="210" y="115" textAnchor="middle" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Natural levee</text>

        {/* Right levee */}
        <line x1="470" y1="165" x2="470" y2="120" stroke="#78716c" strokeWidth="0.8" />
        <text x="470" y="115" textAnchor="middle" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Natural levee</text>

        {/* Floodplain labels */}
        <text x="80" y="195" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Floodplain</text>
        <text x="560" y="195" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Floodplain</text>

        {/* River channel label */}
        <text x="340" y="268" textAnchor="middle" className="label fill-blue-700 dark:fill-blue-300" fontWeight="600">River channel</text>

        {/* Silt label */}
        <text x="160" y="220" textAnchor="middle" className="sm fill-amber-600 dark:fill-amber-400">Silt deposits (fertile)</text>

        {/* Cross-section indicator */}
        <text x="320" y="56" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          ← Looking downstream →
        </text>

        {/* Small icons on floodplain */}
        {/* Rice paddy */}
        <g transform="translate(80, 170)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#65a30d" strokeWidth="1" />
          <line x1="-3" y1="2" x2="3" y2="2" stroke="#65a30d" strokeWidth="0.8" />
          <line x1="8" y1="0" x2="8" y2="12" stroke="#65a30d" strokeWidth="1" />
          <line x1="5" y1="2" x2="11" y2="2" stroke="#65a30d" strokeWidth="0.8" />
        </g>
        <text x="85" y="166" textAnchor="middle" className="sm fill-green-600 dark:fill-green-400" style={{ fontSize: '8px' }}>Crops</text>

        {/* Tea garden on right */}
        <g transform="translate(530, 170)">
          <circle cx="0" cy="4" r="5" fill="#65a30d" opacity="0.5" />
          <line x1="0" y1="4" x2="0" y2="12" stroke="#78716c" strokeWidth="1" />
          <circle cx="12" cy="4" r="5" fill="#65a30d" opacity="0.5" />
          <line x1="12" y1="4" x2="12" y2="12" stroke="#78716c" strokeWidth="1" />
        </g>
        <text x="536" y="166" textAnchor="middle" className="sm fill-green-600 dark:fill-green-400" style={{ fontSize: '8px' }}>Tea</text>

        {/* Explanation at bottom */}
        <g transform="translate(20, 315)">
          <rect x="0" y="0" width="600" height="50" rx="4" className="fill-gray-50 dark:fill-slate-900" />
          <text x="300" y="18" textAnchor="middle" className="sm fill-gray-600 dark:fill-slate-400">
            During floods, water spills over the levees and deposits nutrient-rich silt.
          </text>
          <text x="300" y="32" textAnchor="middle" className="sm fill-gray-600 dark:fill-slate-400">
            This creates fertile farmland but also causes devastating damage to communities.
          </text>
        </g>
      </svg>
    </div>
  );
}
