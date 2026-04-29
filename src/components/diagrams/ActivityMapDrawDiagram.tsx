export default function ActivityMapDrawDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 650 408"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Map drawing activity: draw a route from memory then compare with the actual path"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="600" height="380" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Draw a Map From Memory
        </text>

        {/* --- Left: Memory sketch --- */}
        <text x="150" y="55" textAnchor="middle" className="step fill-orange-400">
          1. From Memory
        </text>

        {/* Paper */}
        <rect x="25" y="65" width="250" height="240" rx="4" fill="#fefce8" />
        {/* Slightly crumpled/sketchy feel — grid lines */}
        {[90, 115, 140, 165, 190, 215, 240, 265].map(y => (
          <line key={y} x1="35" y1={y} x2="265" y2={y} stroke="#e5e7eb" strokeWidth="0.3" />
        ))}

        {/* Sketchy hand-drawn route */}
        <path d="M 60 270 Q 65 250 70 230 Q 75 210 85 200 Q 100 185 120 180 L 180 180 Q 200 178 210 160 Q 215 140 220 120 Q 225 100 240 90"
          fill="none" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="2" strokeLinecap="round" />

        {/* Home marker */}
        <circle cx="60" cy="270" r="6" fill="#ef4444" opacity="0.8" />
        <text x="70" y="282" className="small fill-gray-100 dark:fill-slate-800">Home</text>

        {/* School marker */}
        <circle cx="240" cy="90" r="6" fill="#3b82f6" opacity="0.8" />
        <text x="220" y="84" className="small fill-gray-100 dark:fill-slate-800">School</text>

        {/* Landmarks — sketchy */}
        {/* Tree */}
        <circle cx="85" cy="195" r="8" fill="#4ade80" opacity="0.5" />
        <line x1="85" y1="203" x2="85" y2="212" stroke="#92400e" strokeWidth="1.5" />
        <text x="98" y="210" className="small fill-gray-100 dark:fill-slate-800">Tree</text>

        {/* Shop — simple rectangle */}
        <rect x="165" y="166" width="14" height="10" fill="#fbbf24" opacity="0.6" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
        <text x="182" y="175" className="small fill-gray-100 dark:fill-slate-800">Shop</text>

        {/* Turn marked */}
        <path d="M 205 165 L 215 155" stroke="#ef4444" strokeWidth="1" />
        <text x="216" y="150" className="small" fill="#ef4444">Turn?</text>

        {/* Missing landmark — question mark */}
        <text x="130" y="145" className="small fill-gray-500 dark:fill-slate-400">???</text>

        {/* Pencil icon */}
        <g transform="translate(250, 275) rotate(-30)">
          <rect x="0" y="0" width="6" height="30" rx="1" fill="#fbbf24" />
          <polygon points="3,-5 0,0 6,0" className="fill-gray-100 dark:fill-slate-800" />
          <rect x="0" y="26" width="6" height="4" rx="1" fill="#fda4af" />
        </g>

        {/* --- Arrow between --- */}
        <g transform="translate(287, 180)">
          <line x1="0" y1="0" x2="25" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="30,0 20,-5 20,5" className="fill-gray-500 dark:fill-slate-400" />
          <text x="15" y="-10" textAnchor="middle" className="small fill-slate-400">Walk</text>
          <text x="15" y="18" textAnchor="middle" className="small fill-slate-400">& check</text>
        </g>

        {/* --- Right: Actual route --- */}
        <text x="450" y="55" textAnchor="middle" className="step fill-green-400">
          2. After Walking
        </text>

        {/* Paper */}
        <rect x="325" y="65" width="250" height="240" rx="4" fill="#fefce8" />
        {[90, 115, 140, 165, 190, 215, 240, 265].map(y => (
          <line key={y} x1="335" y1={y} x2="565" y2={y} stroke="#e5e7eb" strokeWidth="0.3" />
        ))}

        {/* Original route — faded */}
        <path d="M 360 270 Q 365 250 370 230 Q 375 210 385 200 Q 400 185 420 180 L 480 180 Q 500 178 510 160 Q 515 140 520 120 Q 525 100 540 90"
          fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Corrected actual route */}
        <path d="M 360 270 Q 365 248 375 232 Q 380 218 390 205 Q 405 192 425 185 L 460 182 Q 475 180 485 170 Q 492 155 500 140 Q 510 120 520 105 Q 530 95 540 90"
          fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />

        {/* Home marker */}
        <circle cx="360" cy="270" r="6" fill="#ef4444" opacity="0.8" />
        <text x="370" y="282" className="small fill-gray-100 dark:fill-slate-800">Home</text>

        {/* School marker */}
        <circle cx="540" cy="90" r="6" fill="#3b82f6" opacity="0.8" />
        <text x="520" y="84" className="small fill-gray-100 dark:fill-slate-800">School</text>

        {/* Tree — confirmed */}
        <circle cx="390" cy="200" r="8" fill="#4ade80" opacity="0.5" />
        <line x1="390" y1="208" x2="390" y2="217" stroke="#92400e" strokeWidth="1.5" />
        <text x="403" y="215" className="small" fill="#16a34a">Tree ✓</text>

        {/* Shop — confirmed but wrong position */}
        <rect x="455" y="168" width="14" height="10" fill="#fbbf24" opacity="0.6" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
        <text x="472" y="177" className="small" fill="#16a34a">Shop ✓</text>

        {/* Discovered landmark — mosque/temple */}
        <rect x="495" y="126" width="12" height="14" rx="1" fill="#a78bfa" opacity="0.6" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.5" />
        <text x="512" y="138" className="small" fill="#7c3aed">Mosque!</text>
        <text x="512" y="148" className="small" fill="#7c3aed">(missed this)</text>

        {/* Difference callout */}
        <circle cx="485" cy="170" r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="502" y="158" className="small" fill="#f59e0b">Curve was</text>
        <text x="502" y="168" className="small" fill="#f59e0b">sharper!</text>

        {/* Legend */}
        <line x1="340" y1="290" x2="355" y2="290" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="360" y="293" className="small fill-gray-500 dark:fill-slate-400">Memory</text>
        <line x1="400" y1="290" x2="415" y2="290" stroke="#16a34a" strokeWidth="2" />
        <text x="420" y="293" className="small" fill="#16a34a">Actual</text>

        {/* --- Bottom steps --- */}
        <rect x="50" y="320" width="500" height="50" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="340" textAnchor="middle" className="label fill-slate-300">
          Draw from memory → walk and check → learn what you missed
        </text>
        <text x="300" y="358" textAnchor="middle" className="small fill-slate-500">
          Your brain stores landmarks, not exact distances — that is why maps need measurement
        </text>
      </svg>
    </div>
  );
}
