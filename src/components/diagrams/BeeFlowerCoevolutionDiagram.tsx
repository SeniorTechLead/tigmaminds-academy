export default function BeeFlowerCoevolutionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 399" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee and flower coevolution diagram showing UV patterns, nectar guides, and shape matching">
        <rect width="520" height="380" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Bee–Flower Coevolution</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Millions of years of mutual adaptation</text>

        {/* Section 1: UV Patterns */}
        <g transform="translate(90, 140)">
          <text x="0" y="-40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#a855f7">UV Nectar Guides</text>

          {/* Human vision flower */}
          <g transform="translate(-40, 0)">
            <text x="0" y="-22" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Human view</text>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={Math.cos((a * Math.PI) / 180) * 16}
                cy={Math.sin((a * Math.PI) / 180) * 16}
                rx="12" ry="6" fill="#eab308" opacity="0.7"
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 16}, ${Math.sin((a * Math.PI) / 180) * 16})`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#a16207" />
          </g>

          {/* Bee UV vision flower */}
          <g transform="translate(40, 0)">
            <text x="0" y="-22" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Bee UV view</text>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={Math.cos((a * Math.PI) / 180) * 16}
                cy={Math.sin((a * Math.PI) / 180) * 16}
                rx="12" ry="6" fill="#a855f7" opacity="0.5"
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 16}, ${Math.sin((a * Math.PI) / 180) * 16})`}
              />
            ))}
            {/* UV bullseye pattern */}
            <circle cx="0" cy="0" r="10" fill="#7c3aed" opacity="0.8" />
            <circle cx="0" cy="0" r="5" fill="#fbbf24" />
            {/* Landing lines */}
            {[0, 72, 144, 216, 288].map((a) => (
              <line
                key={`l${a}`}
                x1={Math.cos((a * Math.PI) / 180) * 5}
                y1={Math.sin((a * Math.PI) / 180) * 5}
                x2={Math.cos((a * Math.PI) / 180) * 14}
                y2={Math.sin((a * Math.PI) / 180) * 14}
                stroke="#fbbf24" strokeWidth="1.5" opacity="0.8"
              />
            ))}
          </g>

          <text x="0" y="35" textAnchor="middle" fontSize="7" fill="#c4b5fd">Dark center = &quot;landing target&quot;</text>
        </g>

        {/* Section 2: Shape Matching */}
        <g transform="translate(260, 140)">
          <text x="0" y="-40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Shape Matching</text>

          {/* Tubular flower + long tongue */}
          <g transform="translate(-35, 0)">
            <path d="M -10,-15 Q -20,0 -10,15 L 10,15 Q 20,0 10,-15 Z" fill="#ec4899" opacity="0.5" stroke="#ec4899" strokeWidth="1" />
            <rect x="-5" y="15" width="10" height="20" fill="#22c55e" opacity="0.4" />
            <text x="0" y="50" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Tubular</text>
          </g>

          {/* Flat open flower + short tongue */}
          <g transform="translate(35, 0)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx={Math.cos((a * Math.PI) / 180) * 14}
                cy={Math.sin((a * Math.PI) / 180) * 14}
                rx="10" ry="5" fill="#fbbf24" opacity="0.5"
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 14}, ${Math.sin((a * Math.PI) / 180) * 14})`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#f59e0b" />
            <text x="0" y="50" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Open/flat</text>
          </g>

          <text x="0" y="65" textAnchor="middle" fontSize="7" fill="#86efac">Tongue length matches flower depth</text>
        </g>

        {/* Section 3: Color Preferences */}
        <g transform="translate(430, 140)">
          <text x="0" y="-40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Color Spectrum</text>

          {/* Bee visible spectrum */}
          {[
            { color: "#7c3aed", label: "UV", pref: "high" },
            { color: "#3b82f6", label: "Blue", pref: "high" },
            { color: "#22c55e", label: "Green", pref: "med" },
            { color: "#eab308", label: "Yellow", pref: "high" },
            { color: "#ef4444", label: "Red", pref: "low" },
          ].map((c, i) => (
            <g key={i}>
              <rect x="-30" y={-18 + i * 22} width="18" height="16" rx="3" fill={c.color} opacity={c.pref === "high" ? 0.8 : c.pref === "med" ? 0.5 : 0.2} />
              <text x="-5" y={-6 + i * 22} fontSize="8" fill={c.color}>{c.label}</text>
              <rect x="28" y={-18 + i * 22} width={c.pref === "high" ? 40 : c.pref === "med" ? 25 : 10} height="16" rx="3" fill={c.color} opacity="0.3" />
            </g>
          ))}

          <text x="0" y="105" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Bees cannot see red</text>
          <text x="0" y="115" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">but see UV we cannot</text>
        </g>

        {/* Coevolution feedback loop — bottom */}
        <g transform="translate(260, 310)">
          <rect x="-220" y="-35" width="440" height="70" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

          {/* Flower adaptation */}
          <g transform="translate(-120, 0)">
            <circle cx="0" cy="-8" r="16" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="1" />
            <text x="0" y="-5" textAnchor="middle" fontSize="12">🌸</text>
            <text x="0" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22c55e">Flower adapts</text>
            <text x="0" y="28" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Color, scent, shape, nectar</text>
          </g>

          {/* Arrows */}
          <defs>
            <marker id="bfc-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#f59e0b" />
            </marker>
          </defs>
          <line x1="-60" y1="-5" x2="-10" y2="-5" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#bfc-arrow)" />
          <text x="-35" y="-12" textAnchor="middle" fontSize="7" fill="#fcd34d">attracts</text>
          <line x1="10" y1="5" x2="60" y2="5" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#bfc-arrow)" opacity="0.7" />
          <text x="35" y="18" textAnchor="middle" fontSize="7" fill="#fcd34d">selects for</text>

          {/* Bee adaptation */}
          <g transform="translate(120, 0)">
            <circle cx="0" cy="-8" r="16" fill="#eab308" opacity="0.2" stroke="#eab308" strokeWidth="1" />
            <text x="0" y="-5" textAnchor="middle" fontSize="12">🐝</text>
            <text x="0" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#eab308">Bee adapts</text>
            <text x="0" y="28" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">UV vision, tongue, behavior</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
