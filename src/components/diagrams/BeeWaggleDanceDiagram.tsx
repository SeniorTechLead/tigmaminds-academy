export default function BeeWaggleDanceDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee waggle dance diagram showing direction and distance encoding">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">The Waggle Dance</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">How bees communicate food source location</text>

        {/* Figure-8 dance pattern — left side */}
        <g transform="translate(140, 220)">
          <text x="0" y="-110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#eab308">Dance Pattern</text>

          {/* Figure-8 loops */}
          <ellipse cx="0" cy="-50" rx="40" ry="30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
          <ellipse cx="0" cy="50" rx="40" ry="30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

          {/* Waggle run — center line */}
          <line x1="0" y1="-25" x2="0" y2="25" stroke="#f59e0b" strokeWidth="3" />
          {/* Waggle squiggles */}
          <path d="M -5,-20 Q 5,-15 -5,-10 Q 5,-5 -5,0 Q 5,5 -5,10 Q 5,15 -5,20" fill="none" stroke="#fbbf24" strokeWidth="2" />

          {/* Bee on waggle run */}
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#eab308" />
          <line x1="-4" y1="0" x2="4" y2="0" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />

          {/* Direction arrow */}
          <line x1="0" y1="-30" x2="0" y2="-70" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#bwd-arrow)" />
          <text x="20" y="-50" fontSize="9" fill="#fcd34d">Direction</text>
          <text x="20" y="-40" fontSize="9" fill="#fcd34d">to food</text>

          {/* Loop arrows */}
          <path d="M 30,-50 A 30 30 0 0 1 -30,-50" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#bwd-arrow-gray)" />
          <path d="M -30,50 A 30 30 0 0 1 30,50" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#bwd-arrow-gray)" />

          <text x="0" y="95" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Return loops</text>
        </g>

        {/* Sun and angle — right side */}
        <g transform="translate(370, 180)">
          <text x="0" y="-100" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#eab308">Direction Encoding</text>

          {/* Sun */}
          <circle cx="0" cy="-70" r="16" fill="#fbbf24" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={Math.cos((angle * Math.PI) / 180) * 20}
              y1={-70 + Math.sin((angle * Math.PI) / 180) * 20}
              x2={Math.cos((angle * Math.PI) / 180) * 26}
              y2={-70 + Math.sin((angle * Math.PI) / 180) * 26}
              stroke="#fbbf24"
              strokeWidth="2"
            />
          ))}
          <text x="0" y="-67" textAnchor="middle" fontSize="7" className="fill-gray-100 dark:fill-slate-800" fontWeight="bold">SUN</text>

          {/* Vertical gravity line */}
          <line x1="0" y1="-45" x2="0" y2="60" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
          <text x="14" y="55" fontSize="8" className="fill-gray-400 dark:fill-slate-500">gravity</text>

          {/* Angle arc */}
          <path d="M 0,-20 A 25 25 0 0 1 18,5" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="22" y="-5" fontSize="10" fontWeight="bold" fill="#f59e0b">45°</text>

          {/* Direction to food arrow */}
          <line x1="0" y1="0" x2="50" y2="40" stroke="#22c55e" strokeWidth="2" markerEnd="url(#bwd-arrow-green)" />
          <text x="60" y="30" fontSize="9" fill="#22c55e">To food</text>

          {/* Flower */}
          <circle cx="70" cy="55" r="8" fill="#22c55e" opacity="0.3" />
          <circle cx="70" cy="55" r="4" fill="#fbbf24" />
        </g>

        {/* Distance encoding — bottom */}
        <g transform="translate(260, 340)">
          <text x="0" y="-25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#eab308">Distance = Waggle Duration</text>

          {/* Short waggle */}
          <rect x="-190" y="-10" width="60" height="20" rx="4" fill="#f59e0b" opacity="0.3" />
          <text x="-160" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Short</text>
          <text x="-160" y="25" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">~100m away</text>

          {/* Medium waggle */}
          <rect x="-50" y="-10" width="100" height="20" rx="4" fill="#f59e0b" opacity="0.5" />
          <text x="0" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Medium</text>
          <text x="0" y="25" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">~500m away</text>

          {/* Long waggle */}
          <rect x="80" y="-10" width="140" height="20" rx="4" fill="#f59e0b" opacity="0.7" />
          <text x="150" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Long</text>
          <text x="150" y="25" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">~2km+ away</text>
        </g>

        <defs>
          <marker id="bwd-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
          <marker id="bwd-arrow-gray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
          <marker id="bwd-arrow-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
