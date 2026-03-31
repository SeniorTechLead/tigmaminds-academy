export default function CorridorGeneFlowDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Gene flow through corridors: migration between patches prevents inbreeding and enables recolonization"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-teal-600 dark:fill-teal-400">
          Why Corridors Matter: Gene Flow &amp; Migration
        </text>

        {/* Three forest patches as circles */}
        <circle cx="140" cy="200" r="70" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="2" />
        <text x="140" y="180" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Kaziranga</text>
        <text x="140" y="195" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Pop: 1,200</text>
        <text x="140" y="215" textAnchor="middle" fontSize="18">{'\ud83d\udc18'}</text>

        <circle cx="350" cy="160" r="55" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="2" />
        <text x="350" y="145" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Nameri</text>
        <text x="350" y="160" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Pop: 200</text>
        <text x="350" y="180" textAnchor="middle" fontSize="14">{'\ud83d\udc18'}</text>

        <circle cx="560" cy="200" r="65" className="fill-emerald-100 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="2" />
        <text x="560" y="183" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Manas</text>
        <text x="560" y="198" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">Pop: 800</text>
        <text x="560" y="218" textAnchor="middle" fontSize="16">{'\ud83d\udc18'}</text>

        {/* Corridors connecting them */}
        <defs>
          <marker id="arrow-teal-cf" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#14b8a6" />
          </marker>
        </defs>

        {/* Corridor 1: Kaziranga - Nameri */}
        <path d="M 200 175 C 240 150 270 145 300 155" fill="none" stroke="#14b8a6" strokeWidth="8" opacity="0.2" />
        <path d="M 200 175 C 240 150 270 145 300 155" fill="none" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrow-teal-cf)" />
        <path d="M 300 165 C 270 155 240 160 200 185" fill="none" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrow-teal-cf)" strokeDasharray="5 3" />

        {/* Corridor 2: Nameri - Manas */}
        <path d="M 400 170 C 440 175 470 185 500 190" fill="none" stroke="#14b8a6" strokeWidth="8" opacity="0.2" />
        <path d="M 400 170 C 440 175 470 185 500 190" fill="none" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrow-teal-cf)" />
        <path d="M 500 200 C 470 195 440 185 400 180" fill="none" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrow-teal-cf)" strokeDasharray="5 3" />

        {/* Gene flow label */}
        <text x="250" y="140" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-teal-600 dark:fill-teal-400">Gene flow</text>
        <text x="450" y="162" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-teal-600 dark:fill-teal-400">Gene flow</text>

        {/* Benefits list */}
        <rect x="60" y="290" width="580" height="130" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="350" y="312" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-teal-700 dark:fill-teal-300">
          What Migration Through Corridors Provides
        </text>

        {[
          { x: 160, icon: '\ud83e\uddec', title: 'Genetic Diversity', desc: 'Prevents inbreeding depression\nin small populations' },
          { x: 350, icon: '\ud83d\udce6', title: 'Recolonization', desc: 'If one patch loses its elephants,\nmigrants can restore it' },
          { x: 540, icon: '\ud83c\udf3f', title: 'Seasonal Access', desc: 'Reach food and water sources\nthat vary by season' },
        ].map(({ x, icon, title, desc }) => (
          <g key={title}>
            <text x={x} y="340" textAnchor="middle" fontSize="16">{icon}</text>
            <text x={x} y="358" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{title}</text>
            {desc.split('\n').map((line, i) => (
              <text key={i} x={x} y={374 + i * 13} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
