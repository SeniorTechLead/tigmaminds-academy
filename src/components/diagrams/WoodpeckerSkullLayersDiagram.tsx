export default function WoodpeckerSkullLayersDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Four protection layers of a woodpecker skull: hyoid seatbelt, spongy bone, tight brain fit, straight strike"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .num { font-family: system-ui, sans-serif; font-size: 16px; font-weight: 700; }
          .desc { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <rect width="700" height="420" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          4 Layers of Woodpecker Skull Protection
        </text>

        {/* Central skull cross-section */}
        <g transform="translate(260, 60)">
          {/* Outer skull */}
          <ellipse cx="90" cy="100" rx="80" ry="90" fill="none" stroke="#d97706" strokeWidth="3" />
          {/* Dense outer bone */}
          <ellipse cx="90" cy="100" rx="74" ry="84" fill="none" stroke="#92400e" strokeWidth="6" opacity="0.5" />
          {/* Spongy middle */}
          <ellipse cx="90" cy="100" rx="66" ry="76" fill="#78350f" opacity="0.3" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
          {/* Dense inner bone */}
          <ellipse cx="90" cy="100" rx="58" ry="68" fill="none" stroke="#92400e" strokeWidth="4" opacity="0.5" />
          {/* Brain (tight fit) */}
          <ellipse cx="90" cy="100" rx="52" ry="62" fill="#86efac" opacity="0.25" stroke="#22c55e" strokeWidth="2" />
          {/* Brain detail */}
          <path d="M65,85 Q90,70 115,85" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
          <path d="M65,100 Q90,90 115,100" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
          <path d="M70,115 Q90,108 110,115" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />

          {/* Hyoid wrapping */}
          <path d="M170,80 C185,60 185,140 170,120" fill="none" stroke="#dc2626" strokeWidth="3" />
          <path d="M170,80 C140,30 40,30 10,80" fill="none" stroke="#dc2626" strokeWidth="3" />
          <path d="M170,120 C140,170 40,170 10,120" fill="none" stroke="#dc2626" strokeWidth="3" />

          {/* Beak */}
          <polygon points="170,95 240,93 240,107 170,105" fill="#d97706" stroke="#b45309" strokeWidth="1" />

          {/* Impact arrow */}
          <line x1="260" y1="100" x2="245" y2="100" stroke="#ef4444" strokeWidth="3" markerEnd="url(#wp-arrow)" />
          <text x="268" y="104" className="label" fill="#fca5a5">IMPACT</text>

          {/* Eye */}
          <circle cx="140" cy="85" r="6" className="fill-gray-100 dark:fill-slate-800" stroke="#f8fafc" strokeWidth="1" />
          <circle cx="141" cy="84" r="2" className="fill-gray-900 dark:fill-slate-50" />

          {/* Red crest */}
          <path d="M50,20 Q90,0 130,20 Q100,35 70,35 Z" fill="#dc2626" opacity="0.8" />
        </g>

        <defs>
          <marker id="wp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* 4 protection labels */}
        {[
          { n: 1, title: 'Hyoid Seatbelt', desc: 'Bone wraps around skull,', desc2: 'absorbs shock like a belt', color: '#dc2626', y: 270 },
          { n: 2, title: 'Spongy Bone', desc: 'Dense-spongy-dense sandwich', desc2: 'crushes to absorb energy', color: '#d97706', y: 270 },
          { n: 3, title: 'Tight Brain Fit', desc: 'No room to slosh — brain', desc2: 'stays locked in place', color: '#22c55e', y: 270 },
          { n: 4, title: 'Straight Strike', desc: 'Perfectly aligned hit =', desc2: 'zero rotational force', color: '#38bdf8', y: 270 },
        ].map((item, i) => (
          <g key={i} transform={`translate(${18 + i * 168}, ${item.y})`}>
            <rect x="0" y="0" width="155" height="115" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke={item.color} strokeWidth="1.5" />
            <circle cx="78" cy="22" r="14" fill={item.color} opacity="0.2" />
            <text x="78" y="27" textAnchor="middle" className="num" fill={item.color}>{item.n}</text>
            <text x="78" y="52" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">{item.title}</text>
            <text x="78" y="72" textAnchor="middle" className="desc fill-gray-500 dark:fill-slate-400">{item.desc}</text>
            <text x="78" y="86" textAnchor="middle" className="desc fill-gray-500 dark:fill-slate-400">{item.desc2}</text>
          </g>
        ))}

        <text x="350" y="410" textAnchor="middle" className="desc fill-gray-400 dark:fill-slate-500">
          Each layer works together to protect a 2-gram brain from 1200g impacts
        </text>
      </svg>
    </div>
  );
}
