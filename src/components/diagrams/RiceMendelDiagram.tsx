export default function RiceMendelDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Punnett square showing Mendelian genetics of tall versus dwarf rice varieties in the Green Revolution">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="400" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-green-700 dark:fill-green-300">
          Mendelian Genetics in Rice Breeding
        </text>
        <text x="310" y="48" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          How the Green Revolution created semi-dwarf, high-yield varieties
        </text>

        {/* Tall vs Dwarf illustration */}
        <g>
          <text x="120" y="78" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Tall Parent (Tt)</text>
          <line x1="120" y1="90" x2="120" y2="140" stroke="#16a34a" strokeWidth="2.5" />
          <path d="M 115 95 Q 110 90 105 92" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M 125 98 Q 130 93 135 95" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <text x="120" y="155" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">120 cm</text>
        </g>

        <text x="220" y="118" textAnchor="middle" className="label fill-slate-500 dark:fill-slate-400">\u00D7</text>

        <g>
          <text x="320" y="78" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Dwarf Parent (tt)</text>
          <line x1="320" y1="110" x2="320" y2="140" stroke="#16a34a" strokeWidth="3" />
          <path d="M 315 115 Q 310 110 305 112" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M 325 118 Q 330 113 335 115" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <text x="320" y="155" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">60 cm</text>
        </g>

        {/* Punnett Square */}
        <text x="490" y="78" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Punnett Square (F1 \u00D7 F1)</text>

        {/* Grid */}
        <rect x="430" y="88" width="55" height="28" rx="2" fill="#86efac" opacity="0.3" stroke="#16a34a" strokeWidth="1" />
        <text x="457" y="106" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">T</text>
        <rect x="485" y="88" width="55" height="28" rx="2" fill="#86efac" opacity="0.3" stroke="#16a34a" strokeWidth="1" />
        <text x="512" y="106" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">t</text>

        {/* Row headers */}
        <rect x="375" y="116" width="55" height="40" rx="2" fill="#86efac" opacity="0.3" stroke="#16a34a" strokeWidth="1" />
        <text x="402" y="140" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">T</text>
        <rect x="375" y="156" width="55" height="40" rx="2" fill="#86efac" opacity="0.3" stroke="#16a34a" strokeWidth="1" />
        <text x="402" y="180" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">t</text>

        {/* Cells */}
        <rect x="430" y="116" width="55" height="40" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-green-900/20" />
        <text x="457" y="140" textAnchor="middle" className="small fill-green-800 dark:fill-green-300" fontWeight="700">TT</text>
        <rect x="485" y="116" width="55" height="40" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-green-900/20" />
        <text x="512" y="140" textAnchor="middle" className="small fill-green-800 dark:fill-green-300" fontWeight="700">Tt</text>
        <rect x="430" y="156" width="55" height="40" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" className="dark:fill-green-900/20" />
        <text x="457" y="180" textAnchor="middle" className="small fill-green-800 dark:fill-green-300" fontWeight="700">Tt</text>
        <rect x="485" y="156" width="55" height="40" rx="2" fill="#fef9c3" stroke="#d97706" strokeWidth="1.5" className="dark:fill-amber-900/20" />
        <text x="512" y="180" textAnchor="middle" className="small fill-amber-800 dark:fill-amber-300" fontWeight="700">tt</text>

        {/* Ratio */}
        <text x="490" y="215" textAnchor="middle" className="small fill-slate-700 dark:fill-slate-300">Ratio: 3 tall : 1 dwarf</text>
        <text x="490" y="230" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">tt = desired semi-dwarf variety</text>

        {/* Green Revolution section */}
        <rect x="30" y="250" width="560" height="130" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="310" y="272" textAnchor="middle" className="label fill-green-700 dark:fill-green-300" fontWeight="600">The Green Revolution (1960s\u20131970s)</text>

        {/* Before and After */}
        <rect x="50" y="285" width="240" height="80" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" className="dark:fill-red-900/10 dark:stroke-red-800" />
        <text x="170" y="302" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Before: Traditional tall rice</text>
        <text x="170" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Yield: ~1 tonne/hectare</text>
        <text x="170" y="333" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Tall stems lodge (fall over) in wind</text>
        <text x="170" y="348" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">High genetic diversity</text>

        <rect x="330" y="285" width="240" height="80" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/10 dark:stroke-emerald-800" />
        <text x="450" y="302" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">After: HYV semi-dwarf rice</text>
        <text x="450" y="318" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Yield: 2\u20134 tonnes/hectare</text>
        <text x="450" y="333" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Short stems resist lodging</text>
        <text x="450" y="348" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Needs fertilizer, pesticides, water</text>

        <defs>
          <marker id="rice-mendel-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
