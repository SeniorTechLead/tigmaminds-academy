export default function SonarEchoDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" role="img"
        aria-label="Diagram showing sound echo bouncing off a canyon wall to measure distance">
        <defs>
          <marker id="se-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="se-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        <rect width="520" height="360" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Seeing with Sound: The Echo Principle
        </text>

        {/* Canyon walls */}
        {/* Left wall */}
        <path d="M 50,60 L 30,280 L 60,280 L 70,60 Z" className="fill-amber-700 dark:fill-amber-800 stroke-amber-900 dark:stroke-amber-600" strokeWidth="1" />
        <path d="M 50,60 L 70,60 L 80,50 L 40,50 Z" className="fill-amber-600 dark:fill-amber-700" />

        {/* Right wall (cliff face) */}
        <rect x="430" y="50" width="50" height="230" rx="2" className="fill-amber-700 dark:fill-amber-800 stroke-amber-900 dark:stroke-amber-600" strokeWidth="1" />
        <path d="M 430,50 L 480,50 L 490,40 L 420,40 Z" className="fill-amber-600 dark:fill-amber-700" />

        {/* Ground */}
        <rect x="0" y="280" width="520" height="80" className="fill-amber-100 dark:fill-amber-900/30" />
        <line x1="0" y1="280" x2="520" y2="280" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="1.5" />

        {/* Person */}
        <circle cx="120" cy="235" r="12" className="fill-slate-300 dark:fill-slate-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <line x1="120" y1="247" x2="120" y2="275" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <line x1="120" y1="260" x2="105" y2="250" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <line x1="120" y1="260" x2="135" y2="250" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <text x="120" y="298" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-600 dark:fill-slate-300">You</text>

        {/* Outgoing sound wave */}
        <line x1="140" y1="230" x2="420" y2="150" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#se-arr)" />
        <text x="280" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f59e0b">"HELLO!"</text>

        {/* Sound wave arcs */}
        {[160, 200, 240, 280, 320, 360].map((x, i) => (
          <path key={`arc-${i}`} d={`M ${x},${218 - i * 6} A 8,16 0 0,1 ${x},${242 - i * 6}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity={1 - i * 0.12} />
        ))}

        {/* Returning echo */}
        <line x1="420" y1="170" x2="140" y2="250" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#se-arr-b)" strokeDasharray="8,4" />
        <text x="280" y="240" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3b82f6">"...hello..."</text>

        {/* Distance label */}
        <line x1="120" y1="310" x2="430" y2="310" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="275" y="325" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">
          d = (speed of sound × time) ÷ 2
        </text>

        {/* Formula box */}
        <rect x="120" y="335" width="280" height="20" rx="4" className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="260" y="350" textAnchor="middle" fontSize="10" className="fill-emerald-700 dark:fill-emerald-300">
          Divide by 2 because the sound travels there AND back
        </text>

        {/* Clock icon / timer note */}
        <rect x="340" y="260" width="80" height="30" rx="4" className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="380" y="275" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">2 seconds</text>
        <text x="380" y="286" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">= 343 m away</text>
      </svg>
    </div>
  );
}
