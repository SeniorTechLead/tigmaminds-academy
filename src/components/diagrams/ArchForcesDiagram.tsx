const ArchForcesDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 540 330"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of forces in round arch vs pointed arch showing how pointed arches reduce lateral thrust"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <defs>
          <marker id="arch-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="arch-arrow-orange" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>
          <marker id="arch-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="520" height="310" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Round Arch vs Pointed Arch — Force Comparison
        </text>

        {/* === LEFT: Round Arch === */}
        <text x="130" y="50" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          Round (Semicircular)
        </text>

        {/* Ground line */}
        <line x1="40" y1="220" x2="220" y2="220"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Arch shape */}
        <path d="M 60 220 A 70 70 0 0 1 200 220"
          fill="none" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="6" />

        {/* Voussoirs hint */}
        <line x1="100" y1="162" x2="110" y2="185" className="stroke-amber-800 dark:stroke-amber-300" strokeWidth="0.5" />
        <line x1="130" y1="150" x2="130" y2="175" className="stroke-amber-800 dark:stroke-amber-300" strokeWidth="0.5" />
        <line x1="160" y1="162" x2="150" y2="185" className="stroke-amber-800 dark:stroke-amber-300" strokeWidth="0.5" />

        {/* Weight arrow (down) */}
        <line x1="130" y1="135" x2="130" y2="105"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arch-arrow-red)" />
        <text x="130" y="100" textAnchor="middle" className="small-text fill-red-500 dark:fill-red-400">
          Weight
        </text>

        {/* Large thrust arrows (sideways) */}
        <line x1="55" y1="210" x2="15" y2="210"
          stroke="#f97316" strokeWidth="3" markerEnd="url(#arch-arrow-orange)" />
        <line x1="205" y1="210" x2="245" y2="210"
          stroke="#f97316" strokeWidth="3" markerEnd="url(#arch-arrow-orange)" />
        <text x="15" y="200" className="small-text fill-orange-500 dark:fill-orange-400">
          Large thrust
        </text>
        <text x="215" y="200" className="small-text fill-orange-500 dark:fill-orange-400">
          Large thrust
        </text>

        {/* Buttress needed label */}
        <text x="130" y="245" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Needs thick walls / buttresses
        </text>

        {/* === RIGHT: Pointed Arch === */}
        <text x="390" y="50" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          Pointed (Gothic)
        </text>

        {/* Ground line */}
        <line x1="300" y1="220" x2="480" y2="220"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Pointed arch shape */}
        <path d="M 320 220 Q 350 100, 390 95 Q 430 100, 460 220"
          fill="none" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="6" />

        {/* Weight arrow (down at keystone) */}
        <line x1="390" y1="82" x2="390" y2="52"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arch-arrow-red)" />
        <text x="390" y="47" textAnchor="middle" className="small-text fill-red-500 dark:fill-red-400">
          Weight
        </text>

        {/* Smaller thrust arrows */}
        <line x1="316" y1="210" x2="296" y2="210"
          stroke="#22c55e" strokeWidth="2" markerEnd="url(#arch-arrow-green)" />
        <line x1="464" y1="210" x2="484" y2="210"
          stroke="#22c55e" strokeWidth="2" markerEnd="url(#arch-arrow-green)" />
        <text x="280" y="200" className="small-text fill-green-600 dark:fill-green-400" textAnchor="end">
          Small
        </text>
        <text x="488" y="200" className="small-text fill-green-600 dark:fill-green-400">
          Small
        </text>

        {/* Efficient label */}
        <text x="390" y="245" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Forces directed more vertically
        </text>

        {/* Divider */}
        <line x1="260" y1="40" x2="260" y2="260"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* Bottom comparison */}
        <text x="260" y="278" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontStyle: 'italic' }}>
          Pointed arches redirect weight more vertically, reducing lateral thrust
        </text>
        <text x="260" y="295" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          This allowed Gothic cathedrals to have thinner walls and larger windows
        </text>
      </svg>
    </div>
  );
};

export default ArchForcesDiagram;
