export default function StructForcesDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 540 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing compression, tension, and shear forces acting on structural elements">
        <defs>
          <marker id="sf-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="sf-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="sf-arr-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
          </marker>
        </defs>

        <rect width="540" height="380" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="270" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Three Forces Every Structure Must Handle
        </text>

        {/* Ground */}
        <rect x="0" y="330" width="540" height="50" rx="0" className="fill-slate-200 dark:fill-slate-800" />
        <line x1="0" y1="330" x2="540" y2="330" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* === COMPRESSION — left === */}
        <g>
          <rect x="50" y="170" width="60" height="150" rx="4" className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
          <text x="80" y="250" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">Column</text>

          {/* Arrows pushing inward */}
          <line x1="80" y1="110" x2="80" y2="165" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sf-arr-r)" />
          <text x="80" y="102" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444">Weight</text>

          <line x1="80" y1="330" x2="80" y2="325" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#sf-arr-r)" />

          <text x="80" y="142" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ef4444">COMPRESSION</text>
          <text x="80" y="58" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Squeezing force</text>
          <text x="80" y="72" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Imagine squashing</text>
          <text x="80" y="84" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">a sponge between hands</text>
        </g>

        {/* === TENSION — centre === */}
        <g>
          <rect x="205" y="210" width="30" height="30" rx="3" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
          <rect x="305" y="210" width="30" height="30" rx="3" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
          <line x1="235" y1="225" x2="305" y2="225" stroke="#3b82f6" strokeWidth="3" />

          {/* Pull-apart arrows */}
          <line x1="200" y1="225" x2="172" y2="225" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#sf-arr-b)" />
          <line x1="340" y1="225" x2="368" y2="225" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#sf-arr-b)" />

          <text x="270" y="142" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#3b82f6">TENSION</text>
          <text x="270" y="58" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Pulling-apart force</text>
          <text x="270" y="72" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Like a tug-of-war rope</text>
          <text x="270" y="84" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">being stretched tight</text>
          <text x="270" y="265" textAnchor="middle" fontSize="10" fill="#3b82f6">Steel cable under load</text>
        </g>

        {/* === SHEAR — right === */}
        <g>
          <rect x="420" y="195" width="70" height="28" rx="3" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
          <rect x="430" y="230" width="70" height="28" rx="3" className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />

          <line x1="490" y1="209" x2="510" y2="209" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#sf-arr-p)" />
          <line x1="430" y1="244" x2="410" y2="244" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#sf-arr-p)" />

          <text x="460" y="142" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#a78bfa">SHEAR</text>
          <text x="460" y="58" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-300">Sliding/slicing force</text>
          <text x="460" y="72" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Like cutting paper</text>
          <text x="460" y="84" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">with scissors</text>
          <text x="460" y="285" textAnchor="middle" fontSize="10" fill="#a78bfa">Layers slide past each other</text>
        </g>

        {/* Bottom insight */}
        <text x="270" y="360" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-amber-600 dark:fill-amber-400">
          Every structure on Earth must resist some combination of these three forces.
        </text>
      </svg>
    </div>
  );
}
