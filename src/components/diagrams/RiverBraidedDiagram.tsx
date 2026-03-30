export default function RiverBraidedDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Overhead view of a braided river with multiple channels, sandbars, and islands like the Brahmaputra"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="640" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Braided River — Overhead View
        </text>
        <text x="320" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Like the Brahmaputra in Assam — up to 10 km wide during monsoon
        </text>

        {/* Floodplain background */}
        <rect x="20" y="60" width="600" height="300" rx="6" fill="#65a30d" opacity="0.1" />

        {/* Bank labels */}
        <text x="40" y="78" className="sm fill-green-700 dark:fill-green-400">North bank</text>
        <text x="40" y="350" className="sm fill-green-700 dark:fill-green-400">South bank</text>

        {/* Main river area (wide, light blue) */}
        <path
          d="M20,130 Q100,120 200,140 Q300,160 400,135 Q500,110 620,130
             L620,290 Q500,310 400,285 Q300,260 200,280 Q100,300 20,290 Z"
          fill="#0ea5e9" opacity="0.2"
        />

        {/* Main channels (darker blue braided paths) */}
        <path
          d="M20,170 Q80,160 140,175 Q200,190 250,175 Q300,160 350,170
             Q400,180 450,165 Q500,150 560,160 Q600,165 620,170"
          fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" opacity="0.7"
        />
        <path
          d="M20,210 Q80,220 140,210 Q180,200 220,215 Q270,230 320,220
             Q380,205 430,220 Q480,235 530,225 Q580,215 620,220"
          fill="none" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" opacity="0.6"
        />
        <path
          d="M20,250 Q60,245 120,255 Q180,265 230,250 Q280,235 340,248
             Q400,260 460,250 Q520,240 580,252 Q610,258 620,260"
          fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" opacity="0.5"
        />

        {/* Connecting channels (thinner, between main channels) */}
        <path d="M150,178 Q165,195 160,210" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
        <path d="M300,165 Q310,185 305,215" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
        <path d="M460,168 Q470,190 465,218" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
        <path d="M220,218 Q230,235 225,248" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
        <path d="M400,222 Q410,238 405,250" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
        <path d="M540,225 Q545,238 545,252" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />

        {/* Sand bars / islands */}
        <ellipse cx="190" cy="195" rx="25" ry="10" fill="#d6b560" opacity="0.8" />
        <text x="190" y="198" textAnchor="middle" className="sm fill-amber-800 dark:fill-amber-300" style={{ fontSize: '8px' }}>sandbar</text>

        <ellipse cx="350" cy="195" rx="22" ry="9" fill="#d6b560" opacity="0.8" />

        <ellipse cx="510" cy="190" rx="20" ry="8" fill="#d6b560" opacity="0.8" />

        {/* Larger island (Majuli-like) */}
        <ellipse cx="280" cy="238" rx="35" ry="14" fill="#86efac" opacity="0.6" stroke="#22c55e" strokeWidth="1" />
        <text x="280" y="242" textAnchor="middle" className="sm fill-green-800 dark:fill-green-300" style={{ fontSize: '9px' }}>River island</text>

        <ellipse cx="480" cy="240" rx="28" ry="11" fill="#86efac" opacity="0.5" stroke="#22c55e" strokeWidth="1" />

        {/* Flow direction arrow */}
        <defs>
          <marker id="braid-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#0284c7" />
          </marker>
        </defs>
        <line x1="560" y1="130" x2="610" y2="135" stroke="#0284c7" strokeWidth="2" markerEnd="url(#braid-arrow)" />
        <text x="585" y="125" textAnchor="middle" className="sm fill-blue-600 dark:fill-blue-400">Flow</text>

        {/* Key at bottom */}
        <g transform="translate(40, 370)">
          <rect x="0" y="-6" width="14" height="8" rx="2" fill="#0284c7" opacity="0.6" />
          <text x="20" y="2" className="sm fill-gray-600 dark:fill-slate-400">Water channels</text>

          <ellipse cx="130" cy="-2" rx="10" ry="5" fill="#d6b560" opacity="0.8" />
          <text x="148" y="2" className="sm fill-gray-600 dark:fill-slate-400">Sandbars</text>

          <ellipse cx="240" cy="-2" rx="10" ry="5" fill="#86efac" opacity="0.6" stroke="#22c55e" strokeWidth="0.8" />
          <text x="258" y="2" className="sm fill-gray-600 dark:fill-slate-400">Vegetated islands</text>

          <text x="420" y="2" className="sm fill-gray-500 dark:fill-slate-400">Channels shift constantly with sediment load</text>
        </g>
      </svg>
    </div>
  );
}
