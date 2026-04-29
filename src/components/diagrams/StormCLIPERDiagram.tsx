const StormCLIPERDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 456"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="CLIPER model showing past track plus average historical path producing a predicted future track with widening uncertainty cone"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .small-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="clip-past" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="clip-pred" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          CLIPER Model — Climatology + Persistence
        </text>

        {/* What is CLIPER box */}
        <rect x="30" y="42" width="240" height="55" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="150" y="60" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          CLIPER = CL(imatology) + (PER)sistence
        </text>
        <text x="150" y="75" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Climatology: Where do storms usually go?
        </text>
        <text x="150" y="88" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Persistence: Keep going in the same direction
        </text>

        {/* Main map area */}
        <rect x="30" y="105" width="540" height="240" rx="6"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />

        {/* Simple ocean/land */}
        <path d="M 30 105 L 30 250 Q 60 280 100 310 Q 140 340 180 345 L 30 345 Z"
          className="fill-green-300 dark:fill-green-800" opacity="0.5" />
        <text x="55" y="200" className="small-text fill-green-700 dark:fill-green-300">Coast</text>

        {/* PAST TRACK (solid blue line with dots) */}
        <path d="M 450 320 Q 420 290 390 265 Q 360 240 330 220 Q 300 200 280 185"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />

        {/* Past track time markers */}
        {[
          { x: 450, y: 320, t: '-48h' },
          { x: 390, y: 265, t: '-24h' },
          { x: 330, y: 220, t: '-12h' },
          { x: 280, y: 185, t: 'Now' },
        ].map((pt) => (
          <g key={pt.t}>
            <circle cx={pt.x} cy={pt.y} r={pt.t === 'Now' ? 6 : 4}
              className={pt.t === 'Now' ? 'fill-red-500 dark:fill-red-400' : 'fill-blue-500 dark:fill-blue-400'} />
            <text x={pt.x + 10} y={pt.y - 5}
              className="small-text fill-blue-700 dark:fill-blue-300" fontWeight="600">
              {pt.t}
            </text>
          </g>
        ))}

        {/* PERSISTENCE line (dashed, same direction) */}
        <path d="M 280 185 Q 250 170 220 155 Q 190 140 160 128"
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2"
          strokeDasharray="6,4" />
        <text x="195" y="125" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Persistence
        </text>
        <text x="195" y="137" textAnchor="middle"
          className="small-text fill-amber-600 dark:fill-amber-400">
          (keep going straight)
        </text>

        {/* CLIMATOLOGY line (dashed, curves north) */}
        <path d="M 280 185 Q 240 175 200 170 Q 160 168 120 170"
          fill="none" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2"
          strokeDasharray="6,4" />
        <text x="160" y="165" textAnchor="middle"
          className="small-text fill-green-600 dark:fill-green-400" fontWeight="600">
          Climatology
        </text>
        <text x="160" y="177" textAnchor="middle"
          className="small-text fill-green-600 dark:fill-green-400">
          (historical average)
        </text>

        {/* PREDICTED TRACK (solid red, between the two) */}
        <path d="M 280 185 Q 245 172 210 160 Q 175 150 140 145"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="3"
          markerEnd="url(#clip-pred)" />

        {/* Predicted track time markers */}
        {[
          { x: 245, y: 172, t: '+12h' },
          { x: 210, y: 160, t: '+24h' },
          { x: 175, y: 150, t: '+48h' },
          { x: 140, y: 145, t: '+72h' },
        ].map((pt) => (
          <g key={pt.t}>
            <circle cx={pt.x} cy={pt.y} r="4"
              className="fill-red-500 dark:fill-red-400" />
            <text x={pt.x} y={pt.y + 15}
              className="small-text fill-red-600 dark:fill-red-400" textAnchor="middle">
              {pt.t}
            </text>
          </g>
        ))}

        {/* Uncertainty cone (widening) */}
        <path d="M 280 185 Q 240 162 210 148 Q 175 136 140 128
                 M 280 185 Q 250 182 210 172 Q 175 165 140 162"
          fill="none" className="stroke-red-300 dark:stroke-red-600" strokeWidth="1"
          strokeDasharray="3,3" />
        {/* Cone fill */}
        <path d="M 280 185 Q 240 162 140 128 L 140 162 Q 250 182 280 185 Z"
          className="fill-red-200 dark:fill-red-800" opacity="0.3" />

        <text x="115" y="140" textAnchor="middle"
          className="small-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Uncertainty
        </text>
        <text x="115" y="152" textAnchor="middle"
          className="small-text fill-red-500 dark:fill-red-400">
          cone widens
        </text>

        {/* Legend */}
        <rect x="360" y="110" width="200" height="100" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.8"
          stroke="#64748b" strokeWidth="1" />
        <text x="460" y="128" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">Legend</text>

        <line x1="375" y1="142" x2="405" y2="142" stroke="#3b82f6" strokeWidth="3" />
        <text x="412" y="146" className="small-text fill-slate-600 dark:fill-slate-300">Past track (observed)</text>

        <line x1="375" y1="158" x2="405" y2="158" stroke="#ef4444" strokeWidth="3" />
        <text x="412" y="162" className="small-text fill-slate-600 dark:fill-slate-300">CLIPER prediction</text>

        <line x1="375" y1="174" x2="405" y2="174" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
        <text x="412" y="178" className="small-text fill-slate-600 dark:fill-slate-300">Persistence only</text>

        <line x1="375" y1="190" x2="405" y2="190" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,3" />
        <text x="412" y="194" className="small-text fill-slate-600 dark:fill-slate-300">Climatology only</text>

        {/* Formula */}
        <rect x="80" y="352" width="440" height="28" rx="6"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7" />
        <text x="300" y="370" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          CLIPER forecast = weight × persistence + weight × climatology
        </text>

        {/* Bottom caption */}
        <rect x="60" y="390" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="406" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          CLIPER is the simplest forecast — a baseline to beat with better models
        </text>
      </svg>
    </div>
  );
};

export default StormCLIPERDiagram;
