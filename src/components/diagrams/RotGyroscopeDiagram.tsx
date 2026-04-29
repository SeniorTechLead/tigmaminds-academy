export default function RotGyroscopeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 532 400" className="w-full h-auto" role="img"
        aria-label="Diagram showing angular momentum keeping a spinning gyroscope upright, compared to a bicycle wheel">
        <defs>
          <marker id="rg-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="rg-arr-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
          </marker>
          <marker id="rg-arr-e" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
        </defs>

        <rect width="520" height="400" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Angular Momentum: Why Spinning Things Stay Upright
        </text>

        {/* === LEFT: Gyroscope === */}
        <text x="140" y="58" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-purple-600 dark:fill-purple-400">
          Gyroscope
        </text>

        {/* Stand */}
        <line x1="140" y1="300" x2="140" y2="260" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="3" />
        <rect x="110" y="300" width="60" height="8" rx="3" className="fill-slate-300 dark:fill-slate-600" />

        {/* Support arm */}
        <line x1="140" y1="260" x2="140" y2="150" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Spinning wheel — ellipse viewed at angle */}
        <ellipse cx="140" cy="150" rx="60" ry="20" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" />

        {/* Axle */}
        <line x1="80" y1="150" x2="200" y2="150" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2.5" />

        {/* Spin arrows */}
        <path d="M 140,128 A 60,20 0 0,1 195,140" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rg-arr-a)" />
        <text x="200" y="128" fontSize="10" fontWeight="bold" fill="#f59e0b">Spin!</text>

        {/* Angular momentum vector pointing up */}
        <line x1="140" y1="125" x2="140" y2="80" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#rg-arr-p)" />
        <text x="162" y="85" fontSize="10" fontWeight="bold" fill="#a855f7">L</text>
        <text x="162" y="98" fontSize="10" fill="#a855f7">(angular</text>
        <text x="162" y="110" fontSize="10" fill="#a855f7">momentum)</text>

        {/* Gravity arrow */}
        <line x1="200" y1="150" x2="200" y2="185" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#rg-arr-a)" />
        <text x="218" y="175" fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">mg</text>

        {/* === RIGHT: Bicycle wheel === */}
        <text x="390" y="58" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">
          Bicycle Wheel
        </text>

        {/* Wheel — circle with spokes */}
        <circle cx="390" cy="185" r="65" fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="3" />
        <circle cx="390" cy="185" r="8" className="fill-slate-400 dark:fill-slate-500" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`sp-${angle}`}
              x1={390 + 8 * Math.cos(rad)} y1={185 + 8 * Math.sin(rad)}
              x2={390 + 62 * Math.cos(rad)} y2={185 + 62 * Math.sin(rad)}
              className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
          );
        })}

        {/* Spin arrow */}
        <path d="M 420,118 A 65,65 0 0,1 455,165" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rg-arr-a)" />

        {/* Angular momentum arrow */}
        <line x1="382" y1="185" x2="320" y2="185" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#rg-arr-p)" />
        <text x="308" y="180" fontSize="10" fontWeight="bold" fill="#a855f7">L</text>

        {/* Upright arrow */}
        <line x1="390" y1="260" x2="390" y2="280" stroke="#10b981" strokeWidth="2" markerEnd="url(#rg-arr-e)" />
        <text x="390" y="298" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981">Stays upright</text>
        <text x="390" y="311" textAnchor="middle" fontSize="10" fill="#10b981">while spinning!</text>

        {/* Ground */}
        <line x1="325" y1="253" x2="455" y2="253" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Formula box */}
        <rect x="60" y="325" width="400" height="60" rx="8" className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1.5" />
        <text x="260" y="348" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-purple-700 dark:fill-purple-300">
          L = I × ω     (Angular momentum = Moment of inertia × Angular velocity)
        </text>
        <text x="260" y="370" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          The faster it spins (higher ω) or the heavier the rim (higher I), the harder it is to tip over.
        </text>
      </svg>
    </div>
  );
}
