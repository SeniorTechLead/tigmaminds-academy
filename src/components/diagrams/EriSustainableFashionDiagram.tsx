export default function EriSustainableFashionDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 620 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Sustainable fashion supply chain for eri silk from caterpillar to ethical garment"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="620" height="380" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="28" textAnchor="middle" className="title fill-emerald-700 dark:fill-emerald-300">
          Eri Silk — Sustainable Fashion Supply Chain
        </text>

        {/* Step 1: Castor plant */}
        <g>
          <rect x="30" y="55" width="100" height="80" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" className="dark:fill-emerald-900/20 dark:stroke-emerald-700" />
          <text x="80" y="75" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Castor Plant</text>
          {/* Simple leaf */}
          <path d="M 65 100 Q 80 85 95 100 Q 80 115 65 100" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
          <line x1="80" y1="100" x2="80" y2="120" stroke="#16a34a" strokeWidth="1" />
          <text x="80" y="130" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Host plant</text>
        </g>

        {/* Arrow */}
        <line x1="135" y1="95" x2="155" y2="95" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-sus-arr)" />

        {/* Step 2: Silkworm feeding */}
        <g>
          <rect x="160" y="55" width="100" height="80" rx="6" fill="#fef9c3" stroke="#fbbf24" strokeWidth="1.5" className="dark:fill-yellow-900/20 dark:stroke-yellow-700" />
          <text x="210" y="75" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Eri Silkworm</text>
          {[0,1,2].map(i => (
            <circle key={i} cx={195 + i * 14} cy={98} r="6" fill="#86efac" stroke="#16a34a" strokeWidth="0.8" />
          ))}
          <text x="210" y="125" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Fed on leaves</text>
        </g>

        <line x1="265" y1="95" x2="285" y2="95" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-sus-arr)" />

        {/* Step 3: Cocoon collection */}
        <g>
          <rect x="290" y="55" width="100" height="80" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/20 dark:stroke-amber-700" />
          <text x="340" y="75" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Empty Cocoons</text>
          <ellipse cx="340" cy="100" rx="18" ry="12" fill="#e8d5b7" stroke="#a3845c" strokeWidth="1" className="dark:fill-amber-900/40" />
          <text x="340" y="125" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Moth exits first</text>
        </g>

        <line x1="395" y1="95" x2="415" y2="95" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-sus-arr)" />

        {/* Step 4: Hand spinning */}
        <g>
          <rect x="420" y="55" width="100" height="80" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" className="dark:fill-emerald-900/20 dark:stroke-emerald-700" />
          <text x="470" y="75" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Hand Spinning</text>
          {/* Spinning wheel icon */}
          <circle cx="470" cy="100" r="14" fill="none" stroke="#92400e" strokeWidth="1.5" className="dark:stroke-amber-600" />
          <circle cx="470" cy="100" r="3" fill="#92400e" className="dark:fill-amber-600" />
          <text x="470" y="125" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Spun by hand</text>
        </g>

        <line x1="525" y1="95" x2="545" y2="95" stroke="#10b981" strokeWidth="2" markerEnd="url(#eri-sus-arr)" />

        {/* Step 5: Fabric */}
        <g>
          <rect x="550" y="55" width="50" height="80" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.5" className="dark:fill-purple-900/20 dark:stroke-purple-700" />
          <text x="575" y="78" textAnchor="middle" className="small fill-purple-700 dark:fill-purple-400" fontWeight="600">Eri</text>
          <text x="575" y="90" textAnchor="middle" className="small fill-purple-700 dark:fill-purple-400" fontWeight="600">Fabric</text>
          <rect x="560" y="98" width="28" height="22" rx="2" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="0.8" className="dark:fill-purple-800/30" />
        </g>

        {/* Environmental benefits row */}
        <text x="310" y="170" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Why eri silk is sustainable:</text>

        {/* Benefit boxes */}
        {[
          { x: 30, title: 'Zero Animal Harm', desc: 'Moth emerges alive;\nno killing required', color: 'emerald' },
          { x: 160, title: 'Low Carbon', desc: 'No industrial boiling;\nhand processing only', color: 'blue' },
          { x: 290, title: 'Biodegradable', desc: '100% protein fiber;\ncomposts naturally', color: 'amber' },
          { x: 420, title: 'Rural Income', desc: 'Supports indigenous\ncommunities in NE India', color: 'purple' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={190} width={120} height={70} rx="6"
              fill={b.color === 'emerald' ? '#ecfdf5' : b.color === 'blue' ? '#eff6ff' : b.color === 'amber' ? '#fffbeb' : '#faf5ff'}
              stroke={b.color === 'emerald' ? '#6ee7b7' : b.color === 'blue' ? '#93c5fd' : b.color === 'amber' ? '#fbbf24' : '#c084fc'}
              strokeWidth="1"
              className={`dark:fill-${b.color === 'emerald' ? 'emerald' : b.color === 'blue' ? 'blue' : b.color === 'amber' ? 'amber' : 'purple'}-900/15 dark:stroke-${b.color === 'emerald' ? 'emerald' : b.color === 'blue' ? 'blue' : b.color === 'amber' ? 'amber' : 'purple'}-700`}
            />
            <text x={b.x + 60} y={210} textAnchor="middle"
              className={`small fill-${b.color === 'emerald' ? 'emerald' : b.color === 'blue' ? 'blue' : b.color === 'amber' ? 'amber' : 'purple'}-700 dark:fill-${b.color === 'emerald' ? 'emerald' : b.color === 'blue' ? 'blue' : b.color === 'amber' ? 'amber' : 'purple'}-400`}
              fontWeight="600">{b.title}</text>
            {b.desc.split('\n').map((line, j) => (
              <text key={j} x={b.x + 60} y={228 + j * 13} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Comparison: fast fashion vs eri */}
        <rect x="30" y="280" width="260" height="85" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/10 dark:stroke-red-800" />
        <text x="160" y="300" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Fast Fashion (Polyester)</text>
        <text x="160" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Petroleum-based, 200+ years to decompose</text>
        <text x="160" y="333" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Microplastic pollution in oceans</text>
        <text x="160" y="348" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Exploitative labor practices</text>

        <rect x="330" y="280" width="260" height="85" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/10 dark:stroke-emerald-800" />
        <text x="460" y="300" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Eri Silk</text>
        <text x="460" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Protein-based, fully biodegradable</text>
        <text x="460" y="333" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Zero microplastic, zero waste</text>
        <text x="460" y="348" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Fair income for rural artisans</text>

        <defs>
          <marker id="eri-sus-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
