export default function ActivityEpiphyteSurveyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: survey epiphytes on trees near you by recording type, height, and host tree"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Epiphyte Survey Walk
        </text>
        <text x="390" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: a notebook, pencil, and a magnifying glass (optional)
        </text>

        {/* Tree with survey zones */}
        <g transform="translate(200, 80)">
          {/* Tree trunk */}
          <rect x="-15" y="0" width="30" height="260" rx="8" fill="#92400e" opacity="0.4" />
          {/* Branches */}
          <line x1="0" y1="40" x2="-80" y2="20" stroke="#92400e" strokeWidth="5" />
          <line x1="0" y1="40" x2="80" y2="10" stroke="#92400e" strokeWidth="5" />
          <line x1="0" y1="100" x2="-60" y2="85" stroke="#92400e" strokeWidth="4" />
          <line x1="0" y1="140" x2="70" y2="130" stroke="#92400e" strokeWidth="4" />
          {/* Canopy */}
          <circle cx="0" cy="20" r="70" fill="#22c55e" opacity="0.15" />

          {/* Height zones */}
          <line x1="40" y1="0" x2="55" y2="0" stroke="#3b82f6" strokeWidth="1" />
          <line x1="40" y1="85" x2="55" y2="85" stroke="#3b82f6" strokeWidth="1" />
          <line x1="40" y1="170" x2="55" y2="170" stroke="#3b82f6" strokeWidth="1" />
          <line x1="40" y1="260" x2="55" y2="260" stroke="#3b82f6" strokeWidth="1" />

          <text x="65" y="45" fontSize="10" className="fill-blue-500 dark:fill-blue-400">High canopy</text>
          <text x="65" y="130" fontSize="10" className="fill-blue-500 dark:fill-blue-400">Mid trunk</text>
          <text x="65" y="218" fontSize="10" className="fill-blue-500 dark:fill-blue-400">Base/roots</text>

          {/* Example epiphytes */}
          <circle cx="-70" cy="18" r="6" fill="#d946ef" opacity="0.6" />
          <text x="-70" y="5" textAnchor="middle" fontSize="9" className="fill-fuchsia-500 dark:fill-fuchsia-400">orchid</text>
          <rect x="65" y="6" width="15" height="10" rx="2" fill="#22c55e" opacity="0.5" />
          <text x="72" y="4" textAnchor="middle" fontSize="9" className="fill-green-500 dark:fill-green-400">fern</text>
          <circle cx="-10" cy="120" r="8" fill="#84cc16" opacity="0.4" />
          <text x="-10" y="108" textAnchor="middle" fontSize="9" className="fill-lime-500 dark:fill-lime-400">moss</text>
          <circle cx="5" cy="230" r="5" fill="#a3a3a3" opacity="0.4" />
          <text x="5" y="245" textAnchor="middle" fontSize="9" className="fill-gray-400 dark:fill-slate-500">lichen</text>
        </g>

        {/* Recording table */}
        <g transform="translate(530, 80)">
          <rect x="-180" y="0" width="360" height="200" rx="8" className="fill-fuchsia-50 dark:fill-fuchsia-950" opacity="0.4" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-fuchsia-700 dark:fill-fuchsia-300">
            What to Record
          </text>
          {[
            '1. Which tree? (species, bark type)',
            '2. What epiphyte? (moss, fern, orchid, lichen)',
            '3. Where on the tree? (height, which side)',
            '4. How much light reaches it?',
            '5. Is the bark rough or smooth?',
            '6. How many epiphytes on this tree total?',
          ].map((line, i) => (
            <text key={i} x="-155" y={45 + i * 22} fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              {line}
            </text>
          ))}

          {/* Pattern box */}
          <g transform="translate(0, 175)">
            <text x="0" y="25" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400">
              Look for Patterns
            </text>
            <text x="0" y="45" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Do epiphytes prefer north or south side?
            </text>
            <text x="0" y="62" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              Rough bark or smooth bark?
            </text>
            <text x="0" y="79" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
              More epiphytes in shade or sun?
            </text>
          </g>
        </g>

        <text x="390" y="400" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Survey 5{"\u201310"} trees and map the vertical distribution of epiphytes from base to canopy
        </text>
      </svg>
    </div>
  );
}
