export default function TejimolaTraditionalMedicineDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        className="w-full h-auto"
        role="img"
        aria-label="Traditional plant knowledge to modern genetics pipeline showing tulsi, neem, and turmeric with their active compounds and modern applications"
      >
        <rect width="600" height="440" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">From Myth to Medicine: Plants to Genes</text>

        {/* Timeline arrow across top */}
        <line x1="50" y1="52" x2="550" y2="52" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" markerEnd="url(#arrowMed)" />
        <text x="120" y="48" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Traditional knowledge</text>
        <text x="480" y="48" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Modern genetics</text>

        {/* Three plant examples */}
        {[
          {
            y: 75,
            plant: 'Tulsi (Holy Basil)',
            trad: 'Used for colds, fever, stress for 3,000+ years',
            compound: 'Eugenol',
            action: 'Antimicrobial — kills bacteria on contact',
            gene: 'EGS gene family encodes eugenol synthase enzyme',
            modern: 'CRISPR editing to boost eugenol production',
            plantColor: '#22c55e',
          },
          {
            y: 195,
            plant: 'Neem',
            trad: 'Natural insecticide, skin treatment, toothbrush',
            compound: 'Azadirachtin',
            action: 'Disrupts insect hormone systems',
            gene: 'Terpenoid biosynthesis pathway (CYP genes)',
            modern: 'Bio-pesticides replacing synthetic chemicals',
            plantColor: '#34d399',
          },
          {
            y: 315,
            plant: 'Turmeric (Haldi)',
            trad: 'Anti-inflammatory, wound healing, cooking spice',
            compound: 'Curcumin',
            action: 'Reduces inflammation via NF-kB pathway',
            gene: 'CURS genes control curcumin biosynthesis',
            modern: 'Clinical trials for cancer, Alzheimer research',
            plantColor: '#f59e0b',
          },
        ].map((p, i) => (
          <g key={i}>
            {/* Background row */}
            <rect x="20" y={p.y} width="560" height="105" rx="8" fill={p.plantColor} opacity="0.05" />

            {/* Plant name + icon */}
            <circle cx="55" cy={p.y + 28} r="18" fill={p.plantColor} opacity="0.2" />
            {/* Leaf icon */}
            <ellipse cx="55" cy={p.y + 25} rx="8" ry="12" fill={p.plantColor} opacity="0.6" transform={`rotate(-30,55,${p.y + 25})`} />
            <text x="55" y={p.y + 32} textAnchor="middle" fontSize="10" fill={p.plantColor}>{i + 1}</text>
            <text x="85" y={p.y + 20} fontSize="12" fontWeight="bold" fill={p.plantColor}>{p.plant}</text>
            <text x="85" y={p.y + 35} fontSize="9" className="fill-gray-500 dark:fill-slate-400">{p.trad}</text>

            {/* Four-step pipeline */}
            {[
              { x: 40, label: 'Traditional use', value: p.trad.split(',')[0], color: '#94a3b8' },
              { x: 175, label: 'Active compound', value: p.compound, color: '#22d3ee' },
              { x: 335, label: 'How it works', value: p.action.substring(0, 35), color: '#c084fc' },
              { x: 470, label: 'Modern genetics', value: p.modern.substring(0, 35), color: '#f472b6' },
            ].map((step, j) => (
              <g key={j}>
                <rect x={step.x} y={p.y + 48} width="130" height="45" rx="5" fill={step.color} opacity="0.08" />
                <text x={step.x + 65} y={p.y + 62} textAnchor="middle" fontSize="9" fontWeight="bold" fill={step.color}>{step.label}</text>
                <text x={step.x + 65} y={p.y + 78} textAnchor="middle" fontSize="9" fill="#d1d5db">{step.value}</text>
                {j < 3 && (
                  <line x1={step.x + 130} y1={p.y + 70} x2={step.x + 140} y2={p.y + 70} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" markerEnd="url(#arrowMed)" />
                )}
              </g>
            ))}
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="80" y="428" width="440" height="5" rx="2" fill="#fbbf24" opacity="0.3" />

        <defs>
          <marker id="arrowMed" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <path d="M0,0 L7,2.5 L0,5" fill="#475569" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
