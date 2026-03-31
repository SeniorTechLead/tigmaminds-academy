export default function BlueMountainScatteringDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Why distant mountains appear blue: scattered blue light accumulates between viewer and mountain"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Why Distant Mountains Look Blue
        </text>

        {/* Scene: viewer, atmosphere, mountains at different distances */}
        {/* Sky gradient background */}
        <rect x="40" y="55" width="700" height="200" rx="6" fill="#bfdbfe" opacity="0.15" />

        {/* Eye/viewer */}
        <g transform="translate(80, 220)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#f5f5f4" stroke="#6b7280" strokeWidth="1.5" />
          <circle cx="3" cy="0" r="4" fill="#1e3a5f" />
          <text x="0" y="22" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">You</text>
        </g>

        {/* Near mountain (true color - green) */}
        <g transform="translate(250, 120)">
          <path d="M -40,120 L 0,0 L 40,120 Z" fill="#22c55e" opacity="0.7" />
          <text x="0" y="140" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-400">
            1 km away
          </text>
          <text x="0" y="154" textAnchor="middle" fontSize="10" className="fill-green-500 dark:fill-green-400">
            True color: green
          </text>
          {/* Thin atmospheric layer */}
          <rect x="-35" y="10" width="70" height="100" rx="4" fill="#93c5fd" opacity="0.05" />
        </g>

        {/* Mid-distance mountain (blue-green) */}
        <g transform="translate(430, 100)">
          <path d="M -50,140 L 0,0 L 50,140 Z" fill="#22d3ee" opacity="0.5" />
          <text x="0" y="158" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-cyan-600 dark:fill-cyan-400">
            10 km away
          </text>
          <text x="0" y="172" textAnchor="middle" fontSize="10" className="fill-cyan-500 dark:fill-cyan-400">
            Blue-green tint
          </text>
          {/* Thicker atmospheric layer */}
          <rect x="-45" y="10" width="90" height="120" rx="4" fill="#93c5fd" opacity="0.1" />
        </g>

        {/* Far mountain (distinctly blue) */}
        <g transform="translate(600, 80)">
          <path d="M -60,160 L 0,0 L 60,160 Z" fill="#3b82f6" opacity="0.5" />
          <text x="0" y="178" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            50 km away
          </text>
          <text x="0" y="192" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">
            Distinctly blue
          </text>
          {/* Thick atmospheric veil */}
          <rect x="-55" y="10" width="110" height="140" rx="4" fill="#93c5fd" opacity="0.2" />
        </g>

        {/* Light path from eye to far mountain */}
        <line x1="95" y1="220" x2="600" y2="140" stroke="#6b7280" strokeWidth="1" strokeDasharray="4,3" />
        <text x="350" y="195" textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400">
          {"\u2190"} scattered blue light enters your line of sight along this path {"\u2192"}
        </text>

        {/* Scattered blue dots along path */}
        {[150, 220, 290, 360, 430, 500].map((x, i) => (
          <circle key={i} cx={x} cy={220 - (x - 95) * 0.15} r={2 + i * 0.3} fill="#3b82f6" opacity={0.2 + i * 0.08} />
        ))}

        {/* Bottom explanation */}
        <g transform="translate(390, 290)">
          <rect x="-330" y="0" width="660" height="90" rx="8" className="fill-blue-50 dark:fill-blue-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
            Atmospheric Perspective (Aerial Perspective)
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            More atmosphere between you and the mountain = more scattered blue light added to the view
          </text>
          <text x="0" y="60" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            Leonardo da Vinci described this in the 1400s {"\u2014"} painters have used it for centuries
          </text>
          <text x="0" y="78" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            The mountains of Haflong are green forests that appear blue because of Rayleigh scattering
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Distance creates a blue veil: the farther the mountain, the bluer it appears
        </text>
      </svg>
    </div>
  );
}
