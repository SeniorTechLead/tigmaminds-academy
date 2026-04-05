const ChainReactionDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Nuclear chain reaction diagram showing neutrons splitting nuclei across three generations"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-style: italic;
          }
          .gen-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          <marker id="chain-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="300" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Nuclear Chain Reaction
        </text>

        {/* Generation labels */}
        <text x="60" y="48" textAnchor="middle" className="gen-text fill-slate-400">Gen 1</text>
        <text x="200" y="48" textAnchor="middle" className="gen-text fill-slate-400">Gen 2</text>
        <text x="400" y="48" textAnchor="middle" className="gen-text fill-slate-400">Gen 3</text>

        {/* Incoming neutron */}
        <circle cx="20" cy="150" r="4" fill="#f59e0b" />
        <line x1="24" y1="150" x2="42" y2="150"
          stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#chain-arrow)" />

        {/* Gen 1: 1 nucleus */}
        <circle cx="60" cy="150" r="14" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />
        <text x="60" y="154" textAnchor="middle" className="label-text" fill="#dc2626" style={{ fontSize: '8px' }}>U-235</text>

        {/* Fission products gen 1 — two fragments */}
        <circle cx="90" cy="130" r="6" fill="#6366f1" opacity="0.4" stroke="#6366f1" strokeWidth="1" />
        <circle cx="90" cy="170" r="6" fill="#6366f1" opacity="0.4" stroke="#6366f1" strokeWidth="1" />

        {/* Neutrons from gen 1 → gen 2 (3 neutrons) */}
        <line x1="78" y1="138" x2="108" y2="80" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#chain-arrow)" />
        <line x1="78" y1="150" x2="108" y2="150" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#chain-arrow)" />
        <line x1="78" y1="162" x2="108" y2="220" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#chain-arrow)" />

        {/* Gen 2: 3 nuclei */}
        {[80, 150, 220].map((cy) => (
          <g key={`g2-${cy}`}>
            <circle cx="120" cy={cy} r="14" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />
            <circle cx="150" cy={cy - 12} r="5" fill="#6366f1" opacity="0.35" stroke="#6366f1" strokeWidth="1" />
            <circle cx="150" cy={cy + 12} r="5" fill="#6366f1" opacity="0.35" stroke="#6366f1" strokeWidth="1" />
          </g>
        ))}

        {/* Neutrons from gen 2 → gen 3 (9 lines, 3 from each) */}
        {[
          { from: [138, 72], to: [260, 55] },
          { from: [138, 80], to: [260, 82] },
          { from: [138, 88], to: [260, 108] },
          { from: [138, 142], to: [260, 134] },
          { from: [138, 150], to: [260, 160] },
          { from: [138, 158], to: [260, 186] },
          { from: [138, 212], to: [260, 208] },
          { from: [138, 220], to: [260, 234] },
          { from: [138, 228], to: [260, 260] },
        ].map((l, i) => (
          <line key={`n2-${i}`}
            x1={l.from[0]} y1={l.from[1]}
            x2={l.to[0]} y2={l.to[1]}
            stroke="#f59e0b" strokeWidth="1" markerEnd="url(#chain-arrow)" opacity="0.7" />
        ))}

        {/* Gen 3: 9 nuclei */}
        {[55, 82, 108, 134, 160, 186, 208, 234, 260].map((cy) => (
          <circle key={`g3-${cy}`} cx="272" cy={cy} r="10" fill="#ef4444" opacity="0.25" stroke="#ef4444" strokeWidth="1.5" />
        ))}

        {/* Expanding cone shape hint */}
        <text x="272" y="285" textAnchor="middle" className="label-text fill-red-500" style={{ fontSize: '9px' }}>
          9 fissions...
        </text>

        {/* Legend */}
        <g transform="translate(360, 60)">
          <circle cx="0" cy="0" r="4" fill="#f59e0b" />
          <text x="10" y="4" className="label-text fill-slate-600 dark:fill-slate-300">= neutron</text>

          <circle cx="0" cy="22" r="8" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
          <text x="14" y="26" className="label-text fill-slate-600 dark:fill-slate-300">= U-235 nucleus</text>

          <circle cx="0" cy="46" r="5" fill="#6366f1" opacity="0.4" stroke="#6366f1" strokeWidth="1" />
          <text x="10" y="50" className="label-text fill-slate-600 dark:fill-slate-300">= fission fragment</text>
        </g>

        {/* Exponential note */}
        <rect x="350" y="130" width="170" height="50" rx="6"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"
          className="dark:fill-yellow-900/30 dark:stroke-yellow-600" />
        <text x="435" y="150" textAnchor="middle"
          className="formula-text fill-amber-800 dark:fill-amber-200" style={{ fontSize: '11px' }}>
          Each fission releases
        </text>
        <text x="435" y="168" textAnchor="middle"
          className="formula-text fill-amber-800 dark:fill-amber-200" style={{ fontSize: '11px', fontWeight: 600 }}>
          2-3 neutrons → exponential
        </text>

        {/* Bottom formula */}
        <text x="435" y="210" textAnchor="middle"
          className="formula-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '12px' }}>
          Gen n: ~3ⁿ fissions
        </text>

        <text x="435" y="228" textAnchor="middle"
          className="label-text fill-slate-400" style={{ fontSize: '9px' }}>
          1 → 3 → 9 → 27 → 81 → ...
        </text>
      </svg>
    </div>
  );
};

export default ChainReactionDiagram;
