export default function ActivityFlowerWatchDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Flower watching activity: observe a flower for 10 minutes and record which insects visit"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .number { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700; }
          @keyframes buzz {
            0%, 100% { transform: translate(0,0); }
            25% { transform: translate(1px,-1px); }
            50% { transform: translate(-1px,1px); }
            75% { transform: translate(1px,0); }
          }
          .buzzing { animation: buzz 0.3s ease-in-out infinite; }
        `}</style>

        {/* Background */}
        <rect width="600" height="380" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: 10-Minute Flower Watch
        </text>

        {/* --- Flower from above (center-left) --- */}
        <g transform="translate(180, 190)">
          {/* Outer petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-55" rx="22" ry="40"
              fill={i % 2 === 0 ? '#f472b6' : '#fb7185'}
              opacity="0.85"
              transform={`rotate(${angle},0,0)`} />
          ))}
          {/* Inner petals */}
          {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => (
            <ellipse key={`inner-${i}`} cx="0" cy="-35" rx="14" ry="25"
              fill="#fda4af" opacity="0.7"
              transform={`rotate(${angle},0,0)`} />
          ))}
          {/* Center disk */}
          <circle cx="0" cy="0" r="22" fill="#fbbf24" />
          <circle cx="0" cy="0" r="15" fill="#f59e0b" />
          {/* Pollen dots */}
          {[[-5,-5],[3,-8],[7,2],[-3,5],[0,0],[5,-3],[-6,3]].map(([x,y],i) => (
            <circle key={`p-${i}`} cx={x} cy={y} r="1.5" fill="#fef3c7" opacity="0.8" />
          ))}
          <text x="0" y="4" textAnchor="middle" className="small" fill="#92400e">center</text>
        </g>

        {/* --- Visitor 1: Bee --- */}
        <g className="buzzing">
          <g transform="translate(120, 130)">
            {/* Bee body */}
            <ellipse cx="0" cy="0" rx="10" ry="7" fill="#fbbf24" />
            <line x1="-4" y1="-7" x2="-4" y2="7" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
            <line x1="2" y1="-7" x2="2" y2="7" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
            {/* Wings */}
            <ellipse cx="-6" cy="-8" rx="7" ry="4" fill="#e0f2fe" opacity="0.6" />
            <ellipse cx="6" cy="-8" rx="7" ry="4" fill="#e0f2fe" opacity="0.6" />
          </g>
        </g>
        {/* Bee number */}
        <circle cx="105" cy="110" r="9" fill="#3b82f6" />
        <text x="105" y="114" textAnchor="middle" className="number fill-white">1</text>
        {/* Dashed path to flower */}
        <path d="M 125 135 Q 140 155 160 170" stroke="#fbbf24" strokeWidth="1"
          strokeDasharray="3,3" fill="none" />

        {/* --- Visitor 2: Butterfly --- */}
        <g transform="translate(260, 110)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="3" ry="10" className="fill-gray-100 dark:fill-slate-800" />
          {/* Wings */}
          <ellipse cx="-14" cy="-4" rx="13" ry="10" fill="#c084fc" opacity="0.8" />
          <ellipse cx="14" cy="-4" rx="13" ry="10" fill="#c084fc" opacity="0.8" />
          <ellipse cx="-10" cy="6" rx="8" ry="6" fill="#a855f7" opacity="0.7" />
          <ellipse cx="10" cy="6" rx="8" ry="6" fill="#a855f7" opacity="0.7" />
          {/* Wing dots */}
          <circle cx="-14" cy="-4" r="3" fill="#f0abfc" opacity="0.6" />
          <circle cx="14" cy="-4" r="3" fill="#f0abfc" opacity="0.6" />
          {/* Antennae */}
          <line x1="-2" y1="-10" x2="-6" y2="-18" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.8" />
          <line x1="2" y1="-10" x2="6" y2="-18" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="0.8" />
          <circle cx="-6" cy="-18" r="1.5" className="fill-gray-100 dark:fill-slate-800" />
          <circle cx="6" cy="-18" r="1.5" className="fill-gray-100 dark:fill-slate-800" />
        </g>
        {/* Butterfly number */}
        <circle cx="288" cy="88" r="9" fill="#3b82f6" />
        <text x="288" y="92" textAnchor="middle" className="number fill-white">2</text>
        {/* Dashed path */}
        <path d="M 255 120 Q 230 150 210 170" stroke="#c084fc" strokeWidth="1"
          strokeDasharray="3,3" fill="none" />

        {/* --- Visitor 3: Fly --- */}
        <g transform="translate(230, 290)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="7" ry="5" fill="#475569" />
          <circle cx="-8" cy="0" r="4" className="fill-gray-400 dark:fill-slate-500" />
          {/* Wings */}
          <ellipse cx="3" cy="-6" rx="9" ry="4" className="fill-gray-600 dark:fill-slate-300" opacity="0.4" />
          <ellipse cx="-3" cy="-6" rx="9" ry="4" className="fill-gray-600 dark:fill-slate-300" opacity="0.4" />
          {/* Eyes */}
          <circle cx="-10" cy="-2" r="2" fill="#ef4444" opacity="0.7" />
          <circle cx="-10" cy="2" r="2" fill="#ef4444" opacity="0.7" />
        </g>
        {/* Fly number */}
        <circle cx="255" cy="305" r="9" fill="#3b82f6" />
        <text x="255" y="309" textAnchor="middle" className="number fill-white">3</text>
        {/* Dashed path */}
        <path d="M 220 285 Q 200 260 195 230" stroke="#64748b" strokeWidth="1"
          strokeDasharray="3,3" fill="none" />

        {/* --- Clipboard on right --- */}
        <g transform="translate(380, 80)">
          {/* Board */}
          <rect x="0" y="0" width="180" height="220" rx="4" fill="#78716c" />
          {/* Clip */}
          <rect x="65" y="-8" width="50" height="16" rx="3" fill="#a8a29e" />
          <rect x="72" y="-4" width="36" height="8" rx="2" fill="#d6d3d1" />
          {/* Paper */}
          <rect x="10" y="15" width="160" height="195" rx="2" fill="#fefce8" />

          {/* Table header */}
          <text x="30" y="35" className="small fill-gray-100 dark:fill-slate-800" fontWeight="600">Type</text>
          <text x="80" y="35" className="small fill-gray-100 dark:fill-slate-800" fontWeight="600">Time</text>
          <text x="130" y="35" className="small fill-gray-100 dark:fill-slate-800" fontWeight="600">Center?</text>
          <line x1="15" y1="40" x2="165" y2="40" stroke="#d6d3d1" strokeWidth="0.5" />

          {/* Row 1 */}
          <text x="30" y="55" className="small" fill="#92400e">Bee</text>
          <text x="80" y="55" className="small" fill="#92400e">0:42</text>
          <text x="140" y="55" className="small" fill="#16a34a">Yes</text>
          <line x1="15" y1="60" x2="165" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Row 2 */}
          <text x="30" y="75" className="small" fill="#92400e">Butterfly</text>
          <text x="80" y="75" className="small" fill="#92400e">1:15</text>
          <text x="140" y="75" className="small" fill="#16a34a">Yes</text>
          <line x1="15" y1="80" x2="165" y2="80" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Row 3 */}
          <text x="30" y="95" className="small" fill="#92400e">Fly</text>
          <text x="80" y="95" className="small" fill="#92400e">2:30</text>
          <text x="140" y="95" className="small" fill="#ef4444">No</text>
          <line x1="15" y1="100" x2="165" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Row 4 */}
          <text x="30" y="115" className="small" fill="#92400e">Bee</text>
          <text x="80" y="115" className="small" fill="#92400e">3:48</text>
          <text x="140" y="115" className="small" fill="#16a34a">Yes</text>
          <line x1="15" y1="120" x2="165" y2="120" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Row 5 */}
          <text x="30" y="135" className="small" fill="#92400e">Ant</text>
          <text x="80" y="135" className="small" fill="#92400e">5:10</text>
          <text x="140" y="135" className="small" fill="#16a34a">Yes</text>
          <line x1="15" y1="140" x2="165" y2="140" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Empty rows */}
          {[155, 170, 185].map(y => (
            <line key={y} x1="15" y1={y} x2="165" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
          ))}

          {/* Summary */}
          <text x="25" y="200" className="small fill-gray-100 dark:fill-slate-800" fontWeight="600">
            Total: 5 visits in 10 min
          </text>
        </g>

        {/* Timer icon */}
        <circle cx="80" cy="330" r="16" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <line x1="80" y1="320" x2="80" y2="330" stroke="#60a5fa" strokeWidth="2" />
        <line x1="80" y1="330" x2="88" y2="326" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="80" y="360" textAnchor="middle" className="label fill-blue-400">10 min</text>

        {/* Bottom note */}
        <text x="350" y="355" textAnchor="middle" className="label fill-slate-400">
          10 minutes of real pollination data
        </text>
        <text x="350" y="370" textAnchor="middle" className="small fill-slate-500">
          Which visitors actually touch the center?
        </text>
      </svg>
    </div>
  );
}
