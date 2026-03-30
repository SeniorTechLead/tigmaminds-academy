export default function RiverDeltaDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bird's eye view of delta formation where a river meets the sea, showing distributary channels and sediment deposits"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="640" height="420" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Delta Formation — Bird's Eye View
        </text>

        {/* Sea / ocean at bottom */}
        <path
          d="M20,300 Q200,290 320,300 Q440,310 620,300 L620,400 L20,400 Z"
          fill="#0ea5e9" opacity="0.2"
        />
        <text x="540" y="380" className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">Sea</text>

        {/* Land on either side */}
        <rect x="20" y="55" width="120" height="250" rx="4" fill="#65a30d" opacity="0.1" />
        <rect x="500" y="55" width="120" height="250" rx="4" fill="#65a30d" opacity="0.1" />
        <text x="80" y="75" textAnchor="middle" className="sm fill-green-700 dark:fill-green-400">Land</text>
        <text x="560" y="75" textAnchor="middle" className="sm fill-green-700 dark:fill-green-400">Land</text>

        {/* Main river approaching from top */}
        <path
          d="M300,55 Q310,90 315,120 Q318,140 320,160"
          fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round"
        />
        <text x="340" y="70" className="label fill-blue-700 dark:fill-blue-300" fontWeight="600">River</text>

        {/* Delta fan shape — sediment deposit */}
        <path
          d="M260,180 Q320,160 380,180 Q440,220 480,290 Q400,330 320,340
             Q240,330 160,290 Q200,220 260,180 Z"
          fill="#d6b560" opacity="0.4"
        />

        {/* Inner delta (finer sediment) */}
        <path
          d="M280,200 Q320,185 360,200 Q400,240 430,300 Q380,325 320,330
             Q260,325 210,300 Q240,240 280,200 Z"
          fill="#d6b560" opacity="0.3"
        />

        {/* Distributary channels splitting out */}
        <path d="M320,160 Q280,200 220,270 Q190,300 170,330" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M320,160 Q300,210 290,260 Q280,300 275,340" fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
        <path d="M320,160 Q320,220 320,280 Q320,310 320,345" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M320,160 Q340,210 355,260 Q365,300 370,340" fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
        <path d="M320,160 Q360,200 420,270 Q450,300 470,330" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

        {/* Sediment plume in sea */}
        <ellipse cx="320" cy="350" rx="160" ry="30" fill="#d6b560" opacity="0.15" />
        <ellipse cx="320" cy="365" rx="120" ry="20" fill="#d6b560" opacity="0.1" />

        {/* Labels on distributaries */}
        <text x="165" y="310" className="sm fill-blue-600 dark:fill-blue-400" transform="rotate(-50 165 310)">Distributary</text>
        <text x="475" y="310" className="sm fill-blue-600 dark:fill-blue-400" transform="rotate(50 475 310)">Distributary</text>

        {/* Sediment deposit labels */}
        <g transform="translate(420, 230)">
          <line x1="0" y1="0" x2="50" y2="-20" stroke="#a16207" strokeWidth="0.8" />
          <text x="55" y="-18" className="sm fill-amber-700 dark:fill-amber-400">Coarse sediment</text>
          <text x="55" y="-7" className="sm fill-amber-700 dark:fill-amber-400">(near mouth)</text>
        </g>

        <g transform="translate(380, 320)">
          <line x1="0" y1="0" x2="60" y2="10" stroke="#a16207" strokeWidth="0.8" />
          <text x="65" y="14" className="sm fill-amber-700 dark:fill-amber-400">Fine silt/clay</text>
          <text x="65" y="25" className="sm fill-amber-700 dark:fill-amber-400">(carried furthest)</text>
        </g>

        {/* Mangrove indicator */}
        <g transform="translate(190, 275)">
          <circle cx="0" cy="0" r="4" fill="#22c55e" opacity="0.6" />
          <circle cx="10" cy="-3" r="3.5" fill="#22c55e" opacity="0.5" />
          <circle cx="20" cy="0" r="4" fill="#22c55e" opacity="0.6" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#78716c" strokeWidth="0.8" />
          <line x1="10" y1="-3" x2="10" y2="6" stroke="#78716c" strokeWidth="0.8" />
          <line x1="20" y1="0" x2="20" y2="6" stroke="#78716c" strokeWidth="0.8" />
        </g>
        <text x="210" y="292" textAnchor="middle" className="sm fill-green-700 dark:fill-green-400" style={{ fontSize: '8px' }}>Mangroves</text>

        {/* Flow direction */}
        <defs>
          <marker id="delta-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#0284c7" />
          </marker>
        </defs>
        <line x1="305" y1="80" x2="305" y2="110" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#delta-arrow)" />

        {/* Info box */}
        <g transform="translate(20, 395)">
          <text x="300" y="10" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            The Ganges-Brahmaputra delta is the world's largest — about 100,000 km²
          </text>
        </g>
      </svg>
    </div>
  );
}
