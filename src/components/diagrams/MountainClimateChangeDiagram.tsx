export default function MountainClimateChangeDiagram() {
  const bottom = 310;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 695 440"
        className="w-full"
        role="img"
        aria-label="Comparison of glacier retreat between 1980 and 2020, showing smaller glaciers and a rising snowline"
      >
        <rect x="0" y="0" width="600" height="400" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Glacial Retreat — Climate Change on Mountains
        </text>

        {/* Divider */}
        <line x1="300" y1="40" x2="300" y2={bottom + 10} className="stroke-gray-600" strokeWidth="1" strokeDasharray="4 3" />

        {/* ── LEFT: 1980 ── */}
        <text x="150" y="55" textAnchor="middle" fontSize="14" className="fill-blue-300" fontWeight="800">
          1980
        </text>

        {/* Mountain 1980 */}
        <polygon
          points={`40,${bottom} 80,240 130,160 180,100 210,75 240,100 270,170 290,${bottom}`}
          className="fill-gray-700/50"
        />
        <polygon
          points={`40,${bottom} 80,240 130,160 180,100 210,75 240,100 270,170 290,${bottom}`}
          fill="none"
          className="stroke-gray-400"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Large glacier 1980 */}
        <path
          d="M140,155 Q170,95 210,75 Q235,88 255,130 Q265,180 260,220 Q250,245 230,250 Q200,240 175,215 Q155,190 140,155 Z"
          className="fill-blue-200/40 stroke-blue-300"
          strokeWidth="1.5"
        />
        <text x="200" y="165" textAnchor="middle" fontSize="8" className="fill-blue-200" fontWeight="600">
          Glacier
        </text>

        {/* Snowline 1980 — lower */}
        <line x1="50" y1="175" x2="285" y2="175" className="stroke-white/50" strokeWidth="1" strokeDasharray="4 3" />
        <text x="55" y="172" fontSize="7" className="fill-white/60">
          Snowline 1980
        </text>

        {/* Snow coverage below snowline */}
        {[120, 140, 160, 180, 200, 220, 240, 130, 170, 210, 250].map((x, i) => (
          <circle key={`s80-${i}`} cx={x} cy={135 + (i * 11) % 35} r="1.2" className="fill-white/30" />
        ))}

        {/* ── RIGHT: 2020 ── */}
        <text x="450" y="55" textAnchor="middle" fontSize="14" className="fill-red-300" fontWeight="800">
          2020
        </text>

        {/* Mountain 2020 — same shape */}
        <polygon
          points={`310,${bottom} 350,240 400,160 450,100 480,75 510,100 540,170 560,${bottom}`}
          className="fill-gray-700/50"
        />
        <polygon
          points={`310,${bottom} 350,240 400,160 450,100 480,75 510,100 540,170 560,${bottom}`}
          fill="none"
          className="stroke-gray-400"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Smaller glacier 2020 */}
        <path
          d="M425,135 Q455,95 480,80 Q500,92 515,120 Q520,145 510,165 Q495,175 480,170 Q455,160 440,145 Q430,140 425,135 Z"
          className="fill-blue-200/25 stroke-blue-300/60"
          strokeWidth="1.5"
        />
        <text x="475" y="135" textAnchor="middle" fontSize="8" className="fill-blue-200/70" fontWeight="600">
          Glacier
        </text>
        <text x="475" y="147" textAnchor="middle" fontSize="7" className="fill-red-300">
          (much smaller)
        </text>

        {/* Exposed rock where glacier was */}
        {[440, 455, 465, 430, 450, 475, 485, 495].map((x, i) => (
          <circle key={`rock-${i}`} cx={x} cy={170 + (i * 9) % 30} r="2" className="fill-gray-500/40" />
        ))}
        <text x="470" y="210" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">
          Exposed rock
        </text>

        {/* Snowline 2020 — higher */}
        <line x1="315" y1="135" x2="555" y2="135" className="stroke-white/50" strokeWidth="1" strokeDasharray="4 3" />
        <text x="320" y="132" fontSize="7" className="fill-white/60">
          Snowline 2020
        </text>

        {/* Upward arrow showing snowline shift */}
        <defs>
          <marker id="upArrCC" markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
            <path d="M0,8 L3,0 L6,8" className="fill-red-400" />
          </marker>
        </defs>
        <line x1="560" y1="180" x2="560" y2="138" className="stroke-red-400" strokeWidth="2" markerEnd="url(#upArrCC)" />
        <text x="565" y="165" fontSize="7" className="fill-red-300" fontWeight="600" transform="rotate(90,565,165)">
          Snowline rising
        </text>

        {/* Temperature arrow */}
        <g transform="translate(300, 290)">
          <defs>
            <marker id="tempUpArr" markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
              <path d="M0,8 L3,0 L6,8" className="fill-red-400" />
            </marker>
          </defs>
          <line x1="0" y1="15" x2="0" y2="-5" className="stroke-red-400" strokeWidth="2" markerEnd="url(#tempUpArr)" />
          <text x="0" y="27" textAnchor="middle" fontSize="8" className="fill-red-300" fontWeight="700">
            Warming
          </text>
        </g>

        {/* Stats boxes */}
        <rect x="40" y={bottom + 20} width="250" height="50" rx="5" className="fill-blue-900/30" />
        <text x="55" y={bottom + 38} fontSize="9" className="fill-blue-300" fontWeight="700">
          1980: Large glaciers, lower snowline
        </text>
        <text x="55" y={bottom + 52} fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          Stable ice cover built over centuries
        </text>

        <rect x="310" y={bottom + 20} width="250" height="50" rx="5" className="fill-red-900/25" />
        <text x="325" y={bottom + 38} fontSize="9" className="fill-red-300" fontWeight="700">
          2020: Glaciers shrunk 30-50%
        </text>
        <text x="325" y={bottom + 52} fontSize="8" className="fill-gray-500 dark:fill-gray-400">
          Snowline moved up hundreds of metres
        </text>

        {/* Insight */}
        <rect x="40" y="378" width="520" height="18" rx="3" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="390" textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="700">
          Mountains warm 2x faster than lowlands — glaciers are disappearing
        </text>
      </svg>
    </div>
  );
}
