export default function MithunKeystoneDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing the mithun at the center of Naga culture: currency, ritual, status, genetics"
      >
        <rect width="780" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Mithun as Cultural Keystone Species
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          One animal, many roles in Northeast Indian tribal life
        </text>

        {/* Central mithun icon */}
        <circle cx="390" cy="250" r="65" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2" />
        <text x="390" y="244" textAnchor="middle" fontSize="28">&#x1F402;</text>
        <text x="390" y="268" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">MITHUN</text>

        {/* Role nodes */}
        {[
          { x: 165, y: 130, icon: '\uD83D\uDCB0', title: 'Currency', desc: 'Used as bride price,', desc2: 'trade, and debt payment' },
          { x: 615, y: 130, icon: '\uD83C\uDF89', title: 'Ritual', desc: 'Central to festivals,', desc2: 'feasts, and ceremonies' },
          { x: 165, y: 370, icon: '\uD83C\uDFC6', title: 'Status', desc: 'Owning many mithun', desc2: 'marks social rank' },
          { x: 615, y: 370, icon: '\uD83E\uDDEC', title: 'Genetics', desc: 'Carries unique genes', desc2: 'for harsh terrain survival' },
          { x: 390, y: 430, icon: '\uD83C\uDF3F', title: 'Ecology', desc: 'Grazes forests, disperses', desc2: 'seeds, maintains clearings' },
        ].map((node, i) => (
          <g key={i}>
            {/* Connecting line */}
            <line x1="390" y1="250" x2={node.x} y2={node.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.5" />
            {/* Node */}
            <circle cx={node.x} cy={node.y} r="50" className="fill-white dark:fill-slate-900" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={node.x} y={node.y - 16} textAnchor="middle" fontSize="22">{node.icon}</text>
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">{node.title}</text>
            <text x={node.x} y={node.y + 20} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{node.desc}</text>
            <text x={node.x} y={node.y + 32} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{node.desc2}</text>
          </g>
        ))}

        {/* Top/bottom emphasis */}
        <rect x="200" y="72" width="380" height="24" rx="6" fill="#f59e0b" fillOpacity="0.08" />
        <text x="390" y="88" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-amber-300">
          A keystone species is one whose removal would drastically change the system
        </text>
      </svg>
    </div>
  );
}
