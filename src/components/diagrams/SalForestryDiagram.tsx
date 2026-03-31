export default function SalForestryDiagram() {
  const stages = [
    { x: 90, label: 'Plant', icon: '\uD83C\uDF31', years: 'Year 0', desc: 'Seedling planted', h: 20 },
    { x: 230, label: 'Thin', icon: '\uD83C\uDF32', years: 'Year 15', desc: 'Remove weak trees', h: 55 },
    { x: 370, label: 'Grow', icon: '\uD83C\uDF33', years: 'Year 30', desc: 'Canopy closes', h: 90 },
    { x: 510, label: 'Harvest', icon: '\uD83E\uDE93', years: 'Year 60', desc: 'Select mature trees', h: 130 },
    { x: 650, label: 'Replant', icon: '\uD83C\uDF31', years: 'Year 61', desc: 'Cycle restarts', h: 25 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Timeline showing the sustainable forestry cycle for sal trees: plant, thin, grow, harvest, replant"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Sustainable Forestry: The Sal Tree Cycle
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Harvesting and replanting so the forest lasts forever
        </text>

        {/* Ground line */}
        <line x1="30" y1="310" x2="750" y2="310" stroke="#22c55e" strokeWidth="2" />
        <rect x="30" y="310" width="720" height="20" fill="#22c55e" fillOpacity="0.08" />

        {/* Timeline arrows */}
        {[0, 1, 2, 3].map(i => (
          <line
            key={i}
            x1={stages[i].x + 40}
            y1={340}
            x2={stages[i + 1].x - 40}
            y2={340}
            stroke="#f59e0b"
            strokeWidth="2"
            markerEnd="url(#forestry-arrow)"
          />
        ))}

        <defs>
          <marker id="forestry-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Stages */}
        {stages.map((s, i) => (
          <g key={i}>
            {/* Tree representation */}
            <rect x={s.x + 12} y={310 - s.h} width={16} height={s.h} rx="3" fill="#8b6914" fillOpacity="0.7" />
            {s.h > 40 && (
              <ellipse cx={s.x + 20} cy={310 - s.h - 15} rx={s.h * 0.4} ry={s.h * 0.25} fill="#22c55e" fillOpacity="0.4" />
            )}

            {/* Label */}
            <text x={s.x + 20} y={340} textAnchor="middle" fontSize="22">{s.icon}</text>
            <text x={s.x + 20} y={368} textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">{s.label}</text>
            <text x={s.x + 20} y={385} textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">{s.years}</text>
            <text x={s.x + 20} y={400} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{s.desc}</text>
          </g>
        ))}

        {/* Cycle arrow from replant back to plant */}
        <path d="M680,415 Q390,450 100,415" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 3" markerEnd="url(#cycle-arrow)" />
        <defs>
          <marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#22c55e" />
          </marker>
        </defs>
        <text x="390" y="435" textAnchor="middle" fontSize="11" fill="#22c55e" fontWeight="600">
          Continuous cycle {'\u2014'} forest is never fully cleared
        </text>

        {/* Key principle */}
        <rect x="120" y="80" width="540" height="55" rx="10" fill="#22c55e" fillOpacity="0.08" stroke="#22c55e" strokeWidth="1" />
        <text x="390" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22c55e">
          The Rule: Never harvest faster than the forest can regrow
        </text>
        <text x="390" y="118" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Sal takes 60+ years to mature. Sustainable forestry plans decades ahead.
        </text>
      </svg>
    </div>
  );
}
