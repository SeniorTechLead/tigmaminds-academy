export default function RiceDomesticationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Timeline of rice domestication from wild grass to modern cultivated varieties over 10,000 years">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="400" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-green-700 dark:fill-green-300">
          From Wild Grass to Rice — 10,000 Years of Domestication
        </text>

        {/* Timeline arrow */}
        <line x1="50" y1="70" x2="580" y2="70" stroke="#16a34a" strokeWidth="2" markerEnd="url(#rice-arr)" />
        <text x="50" y="62" className="small fill-green-600 dark:fill-green-400">~10,000 BCE</text>
        <text x="530" y="62" className="small fill-green-600 dark:fill-green-400">Today</text>

        {/* Stage 1: Wild rice */}
        <g>
          <rect x="30" y="85" width="130" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-700" />
          <text x="95" y="102" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Wild Rice (O. rufipogon)</text>
          {/* Wild grass - tall, with shattering seeds */}
          <line x1="70" y1="200" x2="70" y2="120" stroke="#16a34a" strokeWidth="1.5" />
          <line x1="90" y1="200" x2="90" y2="125" stroke="#16a34a" strokeWidth="1.5" />
          <line x1="110" y1="200" x2="110" y2="118" stroke="#16a34a" strokeWidth="1.5" />
          {/* Scattered seeds falling */}
          {[65, 75, 85, 95, 105, 115].map((x, i) => (
            <circle key={i} cx={x} cy={130 + (i % 3) * 20 + Math.random() * 5} r="2" fill="#a3845c" opacity="0.6" />
          ))}
          <text x="95" y="183" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Seeds shatter</text>
          <text x="95" y="196" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">(fall off when ripe)</text>
        </g>

        {/* Arrow */}
        <path d="M 165 150 L 185 150" stroke="#16a34a" strokeWidth="2" markerEnd="url(#rice-arr)" />
        <text x="175" y="170" textAnchor="middle" className="small fill-green-600 dark:fill-green-400">Selection</text>

        {/* Stage 2: Early cultivated */}
        <g>
          <rect x="190" y="85" width="130" height="130" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-700" />
          <text x="255" y="102" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Early Cultivated</text>
          {/* Shorter plants, seeds stay on */}
          <line x1="230" y1="200" x2="230" y2="130" stroke="#16a34a" strokeWidth="2" />
          <line x1="255" y1="200" x2="255" y2="128" stroke="#16a34a" strokeWidth="2" />
          <line x1="280" y1="200" x2="280" y2="132" stroke="#16a34a" strokeWidth="2" />
          {/* Seeds attached to stalk */}
          {[225, 235, 250, 260, 275, 285].map((x, i) => (
            <ellipse key={i} cx={x} cy={128 + (i % 2) * 5} rx="3" ry="2" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />
          ))}
          <text x="255" y="183" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Seeds stay on stalk</text>
          <text x="255" y="196" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">(non-shattering trait)</text>
        </g>

        <path d="M 325 150 L 345 150" stroke="#16a34a" strokeWidth="2" markerEnd="url(#rice-arr)" />
        <text x="335" y="170" textAnchor="middle" className="small fill-green-600 dark:fill-green-400">Breeding</text>

        {/* Stage 3: Modern varieties */}
        <g>
          <rect x="350" y="85" width="130" height="130" rx="6" fill="#dcfce7" stroke="#4ade80" strokeWidth="1" className="dark:fill-green-900/15 dark:stroke-green-700" />
          <text x="415" y="102" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Modern (O. sativa)</text>
          {/* Short, thick plants with heavy grain heads */}
          <line x1="390" y1="200" x2="390" y2="140" stroke="#16a34a" strokeWidth="2.5" />
          <line x1="415" y1="200" x2="415" y2="138" stroke="#16a34a" strokeWidth="2.5" />
          <line x1="440" y1="200" x2="440" y2="142" stroke="#16a34a" strokeWidth="2.5" />
          {/* Heavy drooping grain clusters */}
          {[385, 395, 410, 420, 435, 445].map((x, i) => (
            <ellipse key={i} cx={x} cy={135 + (i % 2) * 4} rx="4" ry="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          ))}
          <text x="415" y="183" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Large grains, short</text>
          <text x="415" y="196" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">stems, high yield</text>
        </g>

        <path d="M 485 150 L 505 150" stroke="#16a34a" strokeWidth="2" markerEnd="url(#rice-arr)" />

        {/* Stage 4: Assam varieties */}
        <g>
          <rect x="510" y="85" width="90" height="130" rx="6" fill="#fefce8" stroke="#fbbf24" strokeWidth="1" className="dark:fill-yellow-900/15 dark:stroke-yellow-700" />
          <text x="555" y="100" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Assam</text>
          <text x="555" y="113" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Varieties</text>
          <text x="555" y="135" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Ahu</text>
          <text x="555" y="150" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Sali</text>
          <text x="555" y="165" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Bao</text>
          <text x="555" y="180" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Boro</text>
          <text x="555" y="205" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">100s of</text>
          <text x="555" y="215" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-400">landraces</text>
        </g>

        {/* Key traits selected */}
        <text x="310" y="240" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Key traits selected during domestication:</text>

        {[
          { x: 50, trait: 'Non-shattering', desc: 'Seeds stay on stalk\nfor easy harvest' },
          { x: 190, trait: 'Larger grains', desc: 'More calories\nper seed' },
          { x: 330, trait: 'Shorter stems', desc: 'Less lodging (falling\nover in wind)' },
          { x: 470, trait: 'Uniform ripening', desc: 'All grains ready\nat the same time' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={255} width={120} height={55} rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" className="dark:fill-emerald-900/15 dark:stroke-emerald-700" />
            <text x={t.x + 60} y={273} textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">{t.trait}</text>
            {t.desc.split('\n').map((line, j) => (
              <text key={j} x={t.x + 60} y={290 + j * 12} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Genetic bottleneck note */}
        <rect x="50" y="325" width="520" height="60" rx="6" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="345" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Genetic Bottleneck Warning</text>
        <text x="310" y="362" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Modern high-yield varieties contain only a fraction of wild rice's genetic diversity.</text>
        <text x="310" y="377" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Assam's traditional landraces preserve drought, flood, and pest resistance genes needed for climate adaptation.</text>

        <defs>
          <marker id="rice-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
