export default function RiverOxbowDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Four-step diagram showing how a meander evolves into an oxbow lake"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .step-num { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
        `}</style>

        <rect width="640" height="440" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Meander to Oxbow Lake — 4 Steps
        </text>

        {/* Step 1: Gentle meander */}
        <g transform="translate(10, 50)">
          <rect x="5" y="0" width="295" height="165" rx="6" className="fill-gray-50 dark:fill-slate-900" />
          <text x="20" y="20" className="step-num fill-blue-600 dark:fill-blue-400">1</text>
          <text x="40" y="20" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Gentle meander forms</text>

          {/* Floodplain */}
          <rect x="15" y="30" width="275" height="120" rx="4" fill="#65a30d" opacity="0.08" />

          {/* River with gentle curve */}
          <path
            d="M20,90 Q80,90 120,70 Q160,50 200,70 Q240,90 280,90"
            fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" opacity="0.6"
          />

          {/* Erosion arrows on outside of bend */}
          <defs>
            <marker id="erode-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L6,2.5 L0,5 Z" fill="#ef4444" />
            </marker>
          </defs>
          <line x1="120" y1="70" x2="120" y2="55" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#erode-arrow)" />
          <line x1="200" y1="70" x2="200" y2="85" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#erode-arrow)" />

          <text x="105" y="50" className="sm fill-red-600 dark:fill-red-400">Erosion</text>
          <text x="185" y="100" className="sm fill-red-600 dark:fill-red-400">Erosion</text>

          {/* Deposition on inside */}
          <text x="155" y="58" className="sm fill-amber-600 dark:fill-amber-400">Deposit</text>
          <text x="155" y="88" className="sm fill-amber-600 dark:fill-amber-400">Deposit</text>
        </g>

        {/* Step 2: Pronounced meander */}
        <g transform="translate(330, 50)">
          <rect x="5" y="0" width="295" height="165" rx="6" className="fill-gray-50 dark:fill-slate-900" />
          <text x="20" y="20" className="step-num fill-blue-600 dark:fill-blue-400">2</text>
          <text x="40" y="20" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Meander becomes pronounced</text>

          <rect x="15" y="30" width="275" height="120" rx="4" fill="#65a30d" opacity="0.08" />

          {/* More curved river */}
          <path
            d="M20,90 Q60,90 90,55 Q120,20 150,55 Q180,90 180,90 Q180,90
               210,125 Q240,155 270,120 Q280,105 280,90"
            fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" opacity="0.6"
          />

          {/* Neck getting narrow */}
          <line x1="85" y1="90" x2="95" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="195" y1="90" x2="185" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />

          <text x="140" y="100" textAnchor="middle" className="sm fill-red-600 dark:fill-red-400">Neck</text>
          <text x="140" y="112" textAnchor="middle" className="sm fill-red-600 dark:fill-red-400">narrows</text>
        </g>

        {/* Step 3: River breaks through */}
        <g transform="translate(10, 240)">
          <rect x="5" y="0" width="295" height="175" rx="6" className="fill-gray-50 dark:fill-slate-900" />
          <text x="20" y="20" className="step-num fill-blue-600 dark:fill-blue-400">3</text>
          <text x="40" y="20" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">River breaks through the neck</text>

          <rect x="15" y="30" width="275" height="130" rx="4" fill="#65a30d" opacity="0.08" />

          {/* Old meander (fading) */}
          <path
            d="M90,90 Q120,30 150,60 Q180,90 180,90 Q180,90 210,130 Q240,155 265,120"
            fill="none" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" opacity="0.3"
          />

          {/* New straight channel */}
          <path
            d="M20,95 Q60,95 90,95 L200,95 Q240,95 280,95"
            fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" opacity="0.7"
          />

          {/* Breakthrough point */}
          <circle cx="140" cy="95" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
          <text x="140" y="78" textAnchor="middle" className="sm fill-amber-600 dark:fill-amber-400" fontWeight="600">Breakthrough!</text>

          <text x="150" y="140" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">River takes the shorter path</text>
        </g>

        {/* Step 4: Oxbow lake forms */}
        <g transform="translate(330, 240)">
          <rect x="5" y="0" width="295" height="175" rx="6" className="fill-gray-50 dark:fill-slate-900" />
          <text x="20" y="20" className="step-num fill-blue-600 dark:fill-blue-400">4</text>
          <text x="40" y="20" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Oxbow lake (beel) forms</text>

          <rect x="15" y="30" width="275" height="130" rx="4" fill="#65a30d" opacity="0.08" />

          {/* Straight river channel */}
          <path
            d="M20,95 Q80,95 150,95 Q220,95 280,95"
            fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" opacity="0.7"
          />

          {/* Oxbow lake (crescent) — cut off */}
          <path
            d="M90,85 Q120,35 155,55 Q190,75 190,95 Q190,115 155,135 Q120,155 90,105"
            fill="#38bdf8" fillOpacity="0.3" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"
          />

          {/* Sediment blocking the connections */}
          <ellipse cx="90" cy="92" rx="8" ry="12" fill="#d6b560" opacity="0.6" />
          <ellipse cx="190" cy="95" rx="8" ry="12" fill="#d6b560" opacity="0.6" />

          {/* Label */}
          <text x="145" y="100" textAnchor="middle" className="label fill-blue-700 dark:fill-blue-300" fontWeight="600">Oxbow</text>
          <text x="145" y="113" textAnchor="middle" className="label fill-blue-700 dark:fill-blue-300" fontWeight="600">lake</text>

          {/* Beel label */}
          <text x="145" y="145" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">(locally called a beel)</text>
        </g>

        {/* Bottom note */}
        <text x="320" y="432" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
          Satellite images of the Brahmaputra valley reveal dozens of oxbow lakes across the floodplain
        </text>
      </svg>
    </div>
  );
}
