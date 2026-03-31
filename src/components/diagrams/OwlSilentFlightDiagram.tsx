export default function OwlSilentFlightDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three feather adaptations for silent owl flight: leading-edge serrations, trailing-edge fringes, and velvety surface pile reducing noise by 18 decibels"
      >
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Silent Flight: Three Feather Secrets
        </text>

        {/* Feather overview */}
        <g transform="translate(50, 55)">
          {/* Feather shape */}
          <path
            d="M30,250 Q40,200 50,150 Q70,80 120,30 Q160,10 200,20 Q280,50 340,100 Q380,130 400,170 Q420,210 410,250 Z"
            className="fill-amber-100 dark:fill-amber-900/20"
            stroke="#92400e"
            strokeWidth="1.5"
          />

          {/* Rachis (central shaft) */}
          <line x1="30" y1="250" x2="280" y2="30" stroke="#78350f" strokeWidth="2" />

          {/* Zone 1: Leading edge serrations */}
          <g>
            <rect x="50" y="45" width="75" height="55" rx="4" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
            <text x="88" y="40" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-red-600 dark:fill-red-400">1</text>
            {/* Serration teeth */}
            {[50, 57, 64, 71, 78, 85, 92, 99, 106, 113].map((x, i) => (
              <path key={i} d={`M${x},55 L${x + 3},48 L${x + 6},55`} fill="none" stroke="#ef4444" strokeWidth="1.2" />
            ))}
          </g>

          {/* Zone 2: Trailing edge fringes */}
          <g>
            <rect x="310" y="160" width="80" height="55" rx="4" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
            <text x="350" y="155" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">2</text>
            {/* Fringe lines */}
            {[315, 325, 335, 345, 355, 365, 375].map((x, i) => (
              <line key={i} x1={x} y1={210} x2={x + 3} y2={225} stroke="#3b82f6" strokeWidth="0.8" />
            ))}
          </g>

          {/* Zone 3: Velvety surface */}
          <g>
            <rect x="150" y="100" width="100" height="70" rx="4" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 2" />
            <text x="200" y="95" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-green-600 dark:fill-green-400">3</text>
            {/* Tiny dots for velvet texture */}
            {Array.from({ length: 35 }).map((_, i) => (
              <circle
                key={i}
                cx={160 + (i % 7) * 13}
                cy={110 + Math.floor(i / 7) * 12}
                r="2"
                fill="#16a34a"
                opacity="0.3"
              />
            ))}
          </g>
        </g>

        {/* Right panel: details */}
        <g transform="translate(420, 55)">
          {/* Feature 1 */}
          <g>
            <rect width="240" height="90" rx="6" className="fill-red-50 dark:fill-red-950/20" stroke="#ef4444" strokeWidth="1" />
            <circle cx="15" cy="18" r="10" fill="#ef4444" opacity="0.3" />
            <text x="15" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">1</text>
            <text x="35" y="22" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">Leading-Edge Serrations</text>
            <text x="15" y="42" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Comb-like teeth break airflow</text>
            <text x="15" y="56" fontSize="10" className="fill-gray-600 dark:fill-gray-400">into tiny micro-turbulences,</text>
            <text x="15" y="70" fontSize="10" className="fill-gray-600 dark:fill-gray-400">preventing large noisy vortices.</text>
            <text x="15" y="84" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Inspired: quieter wind turbines</text>
          </g>

          {/* Feature 2 */}
          <g transform="translate(0, 100)">
            <rect width="240" height="90" rx="6" className="fill-blue-50 dark:fill-blue-950/20" stroke="#3b82f6" strokeWidth="1" />
            <circle cx="15" cy="18" r="10" fill="#3b82f6" opacity="0.3" />
            <text x="15" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">2</text>
            <text x="35" y="22" fontSize="12" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Trailing-Edge Fringes</text>
            <text x="15" y="42" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Soft, flexible barbs at the back</text>
            <text x="15" y="56" fontSize="10" className="fill-gray-600 dark:fill-gray-400">edge of each feather suppress</text>
            <text x="15" y="70" fontSize="10" className="fill-gray-600 dark:fill-gray-400">trailing-edge noise generation.</text>
            <text x="15" y="84" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Like a soft brush smoothing airflow</text>
          </g>

          {/* Feature 3 */}
          <g transform="translate(0, 200)">
            <rect width="240" height="90" rx="6" className="fill-green-50 dark:fill-green-950/20" stroke="#16a34a" strokeWidth="1" />
            <circle cx="15" cy="18" r="10" fill="#16a34a" opacity="0.3" />
            <text x="15" y="22" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">3</text>
            <text x="35" y="22" fontSize="12" fontWeight="700" className="fill-green-700 dark:fill-green-300">Velvety Surface Pile</text>
            <text x="15" y="42" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Tiny hair-like structures on top</text>
            <text x="15" y="56" fontSize="10" className="fill-gray-600 dark:fill-gray-400">of feathers absorb remaining</text>
            <text x="15" y="70" fontSize="10" className="fill-gray-600 dark:fill-gray-400">high-frequency sound energy.</text>
            <text x="15" y="84" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">Acts like acoustic foam on wings</text>
          </g>
        </g>

        {/* Bottom result */}
        <rect x="50" y="375" width="600" height="36" rx="6" className="fill-indigo-50 dark:fill-indigo-950/30" stroke="#6366f1" strokeWidth="1" />
        <text x="350" y="393" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">
          Combined: \u221218 dB (1/60th the loudness of a pigeon)
        </text>
        <text x="350" y="407" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          At frequencies above 2 kHz, owl flight falls below the hearing threshold of mice
        </text>
      </svg>
    </div>
  );
}
