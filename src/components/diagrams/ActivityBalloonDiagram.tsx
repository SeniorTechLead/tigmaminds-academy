export default function ActivityBalloonDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 670 442"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Balloon pressure experiment: measure a balloon at ground level and on a hilltop to see it expand"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .measure { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="600" height="400" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Balloon at Different Heights
        </text>

        {/* --- Left: Ground level --- */}
        <text x="150" y="58" textAnchor="middle" className="measure fill-blue-400">Ground Level</text>

        {/* Ground */}
        <rect x="30" y="310" width="240" height="40" rx="2" fill="#365314" opacity="0.5" />
        <line x1="30" y1="310" x2="270" y2="310" stroke="#4ade80" strokeWidth="1.5" />
        {/* Grass tufts */}
        {[50, 80, 110, 140, 170, 200, 230].map(x => (
          <g key={x}>
            <line x1={x} y1="310" x2={x - 3} y2="303" stroke="#4ade80" strokeWidth="1" />
            <line x1={x} y1="310" x2={x + 3} y2="304" stroke="#4ade80" strokeWidth="1" />
          </g>
        ))}

        {/* Balloon — normal size */}
        <ellipse cx="150" cy="180" rx="50" ry="65" fill="#ef4444" opacity="0.7" />
        <ellipse cx="150" cy="180" rx="50" ry="65" fill="none" stroke="#dc2626" strokeWidth="1.5" />
        {/* Shine */}
        <ellipse cx="133" cy="155" rx="10" ry="18" fill="#fca5a5" opacity="0.4" />
        {/* Knot */}
        <polygon points="150,245 146,252 154,252" fill="#dc2626" />
        {/* String */}
        <path d="M 150 252 Q 145 275 150 295 Q 155 305 150 310"
          fill="none" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Measurement string around balloon */}
        <ellipse cx="150" cy="180" rx="52" ry="8" fill="none"
          stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3" />
        <text x="215" y="175" className="small fill-amber-400">Measure</text>
        <text x="215" y="186" className="small fill-amber-400">around here</text>

        {/* Measurement value */}
        <rect x="95" y="260" width="110" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="150" y="279" textAnchor="middle" className="measure fill-cyan-300">62 cm</text>

        {/* Pressure arrows pushing inward */}
        {[
          [85, 160, 105, 170], [85, 200, 105, 195],
          [215, 160, 195, 170], [215, 200, 195, 195],
          [150, 100, 150, 118], [150, 260, 150, 242]
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#press-arrow)" />
        ))}
        <defs>
          <marker id="press-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
        </defs>
        <text x="75" y="145" className="small fill-blue-400">High</text>
        <text x="75" y="155" className="small fill-blue-400">pressure</text>

        {/* Altitude label */}
        <text x="150" y="365" textAnchor="middle" className="small fill-slate-500">
          Sea level: more air above = more pressure
        </text>

        {/* --- Arrow between --- */}
        <line x1="280" y1="200" x2="320" y2="200" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="325,200 315,195 315,205" className="fill-gray-500 dark:fill-slate-400" />
        <text x="300" y="190" textAnchor="middle" className="small fill-slate-400">Go up</text>
        <text x="300" y="220" textAnchor="middle" className="small fill-slate-400">a hill</text>

        {/* --- Right: Hilltop --- */}
        <text x="450" y="58" textAnchor="middle" className="measure fill-green-400">Hilltop</text>

        {/* Hill */}
        <path d="M 330 340 Q 400 260 450 270 Q 500 260 570 340 Z"
          fill="#365314" opacity="0.5" />
        <path d="M 330 340 Q 400 260 450 270 Q 500 260 570 340"
          fill="none" stroke="#4ade80" strokeWidth="1.5" />

        {/* Balloon — BIGGER */}
        <ellipse cx="450" cy="155" rx="60" ry="75" fill="#ef4444" opacity="0.7" />
        <ellipse cx="450" cy="155" rx="60" ry="75" fill="none" stroke="#dc2626" strokeWidth="1.5" />
        {/* Shine */}
        <ellipse cx="430" cy="125" rx="12" ry="22" fill="#fca5a5" opacity="0.4" />
        {/* Knot */}
        <polygon points="450,230 446,237 454,237" fill="#dc2626" />
        {/* String */}
        <path d="M 450 237 Q 445 255 450 268"
          fill="none" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Measurement string around balloon */}
        <ellipse cx="450" cy="155" rx="62" ry="8" fill="none"
          stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3" />

        {/* Measurement value */}
        <rect x="395" y="243" width="110" height="28" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="450" y="262" textAnchor="middle" className="measure fill-cyan-300">66 cm</text>
        <text x="450" y="243" textAnchor="middle" className="small fill-green-400">+4 cm bigger!</text>

        {/* Fewer/weaker pressure arrows */}
        {[
          [378, 135, 395, 145], [378, 175, 395, 170],
          [522, 135, 505, 145], [522, 175, 505, 170],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#60a5fa" strokeWidth="1" opacity="0.5" markerEnd="url(#press-arrow)" />
        ))}
        <text x="540" y="125" className="small fill-blue-300" opacity="0.6">Less</text>
        <text x="540" y="135" className="small fill-blue-300" opacity="0.6">pressure</text>

        {/* Altitude label */}
        <text x="450" y="365" textAnchor="middle" className="small fill-slate-500">
          Higher up: less air above = less pressure
        </text>

        {/* Bottom explanation */}
        <rect x="130" y="378" width="340" height="18" rx="3" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="392" textAnchor="middle" className="label fill-cyan-300">
          Higher = less pressure = balloon expands
        </text>
      </svg>
    </div>
  );
}
