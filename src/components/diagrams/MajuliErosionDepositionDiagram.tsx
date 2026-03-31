export default function MajuliErosionDepositionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Diagram showing river erosion on the outer bank and deposition on the inner bank of a river bend">
        <defs>
          <linearGradient id="majEDwater" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <marker id="majEDarrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-sky-400" />
          </marker>
          <marker id="majEDarrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-400" />
          </marker>
          <marker id="majEDarrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-400" />
          </marker>
        </defs>

        <rect width="580" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="290" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Erosion and Deposition at a River Bend</text>

        {/* Outer bank - erosion side */}
        <path d="M 80,100 Q 80,200 180,260 Q 280,320 380,280 Q 480,240 500,160" fill="none" className="stroke-amber-700" strokeWidth="40" strokeLinecap="round" opacity="0.4" />

        {/* River channel */}
        <path d="M 100,100 Q 120,200 200,260 Q 300,320 400,280 Q 480,240 490,160" fill="none" stroke="url(#majEDwater)" strokeWidth="60" strokeLinecap="round" opacity="0.7" />

        {/* Inner bank - deposition side */}
        <path d="M 140,110 Q 160,190 230,250 Q 320,300 410,270 Q 470,245 480,175" fill="none" className="stroke-amber-600" strokeWidth="25" strokeLinecap="round" opacity="0.5" />

        {/* Sediment dots on inner bank (deposition) */}
        {[
          [175, 175], [190, 195], [210, 215], [230, 230], [255, 245],
          [280, 255], [305, 260], [330, 260], [355, 255], [380, 245],
          [195, 180], [220, 205], [245, 225], [270, 240], [300, 248],
          [330, 248], [360, 242], [385, 235],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5 + (i % 3)} className="fill-amber-500" opacity={0.6 + (i % 4) * 0.1} />
        ))}

        {/* Flow arrows - faster on outside */}
        <path d="M 90,130 Q 100,190 160,240" fill="none" className="stroke-sky-400" strokeWidth="2" markerEnd="url(#majEDarrow)">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M 200,290 Q 300,330 400,290" fill="none" className="stroke-sky-400" strokeWidth="2.5" markerEnd="url(#majEDarrow)" strokeDasharray="8,4">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M 430,260 Q 475,230 490,175" fill="none" className="stroke-sky-400" strokeWidth="2" markerEnd="url(#majEDarrow)">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>

        {/* Erosion arrows (red, pointing into outer bank) */}
        <line x1="85" y1="160" x2="65" y2="160" className="stroke-red-400" strokeWidth="2" markerEnd="url(#majEDarrowRed)" />
        <line x1="140" y1="235" x2="120" y2="250" className="stroke-red-400" strokeWidth="2" markerEnd="url(#majEDarrowRed)" />
        <line x1="320" y1="310" x2="320" y2="330" className="stroke-red-400" strokeWidth="2" markerEnd="url(#majEDarrowRed)" />
        <line x1="470" y1="200" x2="495" y2="190" className="stroke-red-400" strokeWidth="2" markerEnd="url(#majEDarrowRed)" />

        {/* Deposition arrows (green, pointing to inner bank) */}
        <line x1="195" y1="155" x2="195" y2="170" className="stroke-emerald-400" strokeWidth="2" markerEnd="url(#majEDarrowGreen)" />
        <line x1="280" y1="230" x2="280" y2="248" className="stroke-emerald-400" strokeWidth="2" markerEnd="url(#majEDarrowGreen)" />
        <line x1="380" y1="225" x2="382" y2="240" className="stroke-emerald-400" strokeWidth="2" markerEnd="url(#majEDarrowGreen)" />

        {/* Crumbling bank animation */}
        {[75, 130, 325, 485].map((x, i) => {
          const y = [155, 245, 325, 195][i];
          return (
            <g key={`crumb-${i}`}>
              <rect x={x - 3} y={y - 2} width="6" height="4" rx="1" className="fill-amber-700" opacity="0.7">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
              </rect>
            </g>
          );
        })}

        {/* Labels */}
        {/* Outer bank label */}
        <rect x="15" y="60" width="120" height="32" rx="6" className="fill-red-900" opacity="0.8" />
        <text x="75" y="73" textAnchor="middle" className="fill-red-300" fontSize="11" fontWeight="bold">Outer bank</text>
        <text x="75" y="86" textAnchor="middle" className="fill-red-400" fontSize="10">EROSION</text>

        {/* Inner bank label */}
        <rect x="240" y="175" width="120" height="32" rx="6" className="fill-emerald-900" opacity="0.8" />
        <text x="300" y="188" textAnchor="middle" className="fill-emerald-300" fontSize="11" fontWeight="bold">Inner bank</text>
        <text x="300" y="201" textAnchor="middle" className="fill-emerald-400" fontSize="10">DEPOSITION</text>

        {/* Velocity labels */}
        <text x="340" y="305" textAnchor="middle" className="fill-sky-300" fontSize="10" fontWeight="bold">Fast flow →</text>
        <text x="250" y="210" textAnchor="middle" className="fill-sky-500" fontSize="10">Slow flow</text>

        {/* Explanation box */}
        <rect x="30" y="350" width="520" height="40" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="290" y="368" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="11">Fast water on the <tspan className="fill-red-400" fontWeight="bold">outer bank</tspan> erodes the land. Slow water on the</text>
        <text x="290" y="383" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="11"><tspan className="fill-emerald-400" fontWeight="bold">inner bank</tspan> drops sediment, building new land. This is how rivers reshape the landscape.</text>
      </svg>
    </div>
  );
}
