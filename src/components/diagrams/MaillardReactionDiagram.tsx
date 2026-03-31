export default function MaillardReactionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Maillard reaction showing amino acids plus sugars plus heat producing golden-brown color and flavor compounds">
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d97706">The Maillard Reaction: Why Browning = Delicious</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Amino acids + sugars + heat above 140°C → golden color + 1000+ flavor molecules</text>

        {/* Reactants */}
        <g transform="translate(60, 90)">
          <rect width="180" height="100" rx="8" fill="#fde68a" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="90" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">Amino Acids</text>
          <text x="90" y="45" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">(from rice proteins)</text>
          <text x="90" y="65" textAnchor="middle" fontSize="20">🥚</text>
          <text x="90" y="88" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">NH₂ group reacts</text>
        </g>

        <text x="275" y="145" textAnchor="middle" fontSize="24" fontWeight="700" fill="#f59e0b">+</text>

        <g transform="translate(310, 90)">
          <rect width="180" height="100" rx="8" fill="#fef3c7" opacity="0.2" stroke="#d97706" strokeWidth="1.5" />
          <text x="90" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#d97706">Reducing Sugars</text>
          <text x="90" y="45" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">(glucose from jaggery)</text>
          <text x="90" y="65" textAnchor="middle" fontSize="20">🍯</text>
          <text x="90" y="88" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">C=O group reacts</text>
        </g>

        <text x="525" y="145" textAnchor="middle" fontSize="24" fontWeight="700" fill="#ef4444">+</text>

        <g transform="translate(560, 90)">
          <rect width="180" height="100" rx="8" fill="#fef2f2" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="90" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">Heat &gt; 140°C</text>
          <text x="90" y="45" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">(hot pan or oil)</text>
          <text x="90" y="65" textAnchor="middle" fontSize="20">🔥</text>
          <text x="90" y="88" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Energy to start reaction</text>
        </g>

        {/* Arrow down */}
        <line x1="390" y1="200" x2="390" y2="250" stroke="#d97706" strokeWidth="3" />
        <polygon points="383,250 390,264 397,250" fill="#d97706" />
        <text x="430" y="230" fontSize="11" fontWeight="600" fill="#d97706">Cascade of reactions</text>

        {/* Products */}
        <g transform="translate(90, 275)">
          <rect width="600" height="80" rx="8" fill="#d97706" opacity="0.08" stroke="#d97706" strokeWidth="1.5" />
          <text x="300" y="25" textAnchor="middle" fontSize="14" fontWeight="700" fill="#d97706">Products</text>

          <g transform="translate(30, 40)">
            <rect width="120" height="30" rx="4" fill="#92400e" opacity="0.2" />
            <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">Melanoidins</text>
          </g>
          <text x="180" y="62" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(golden-brown color)</text>

          <g transform="translate(240, 40)">
            <rect width="130" height="30" rx="4" fill="#f59e0b" opacity="0.2" />
            <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill="#b45309">1000+ volatiles</text>
          </g>
          <text x="370" y="62" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(nutty, toasty aromas)</text>

          <g transform="translate(445, 40)">
            <rect width="120" height="30" rx="4" fill="#fbbf24" opacity="0.2" />
            <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">New flavors</text>
          </g>
          <text x="510" y="62" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(savory complexity)</text>
        </g>

        {/* Pitha examples */}
        <text x="390" y="390" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">See it in action:</text>
        {[
          { name: 'Til Pitha', desc: 'Sesame toasts on hot pan → Maillard', emoji: '🫓', x: 120 },
          { name: 'Ghila Pitha', desc: 'Dough fried in oil → deep Maillard', emoji: '🍩', x: 390 },
          { name: 'Toast vs Bread', desc: 'Same ingredients, heat added → flavor', emoji: '🍞', x: 660 },
        ].map((p, i) => (
          <g key={i}>
            <text x={p.x} y={415} textAnchor="middle" fontSize="16">{p.emoji}</text>
            <text x={p.x} y={435} textAnchor="middle" fontSize="11" fontWeight="600" fill="#d97706">{p.name}</text>
            <text x={p.x} y={452} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.desc}</text>
        </g>
        ))}

        {/* Not caramelization */}
        <rect x="120" y="460" width="540" height="12" rx="3" fill="none" />
        <text x="390" y="472" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-400 dark:fill-slate-500">
          Not the same as caramelization (sugars only, &gt;160°C) — Maillard needs BOTH sugars AND proteins
        </text>
      </svg>
    </div>
  );
}
