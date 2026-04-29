export default function LotusEngineeringDiagram() {
  const apps = [
    { x: 100, icon: '\uD83C\uDFE2', name: 'Self-cleaning glass', detail: 'Rain cleans building windows' },
    { x: 260, icon: '\uD83D\uDC55', name: 'Stain-proof fabric', detail: 'Coffee rolls right off' },
    { x: 420, icon: '\u2708\uFE0F', name: 'Anti-icing wings', detail: 'Ice can\u2019t grip the surface' },
    { x: 580, icon: '\uD83D\uDD27', name: 'Anti-corrosion', detail: 'Water never touches metal' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="The lotus effect in engineering: self-cleaning glass, stain-proof fabric, anti-icing, and anti-corrosion">
        <rect width="700" height="340" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Lotus Effect in Engineering</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Copy the dual-scale bumps → any surface can become self-cleaning</text>

        {/* Lotus to arrow */}
        <text x="350" y="90" textAnchor="middle" fontSize="28">🌸</text>
        <text x="350" y="115" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Nature’s design</text>

        {/* Arrow down */}
        <line x1="350" y1="125" x2="350" y2="150" stroke="#22c55e" strokeWidth="2" markerEnd="url(#downG)" />
        <defs><marker id="downG" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22c55e" /></marker></defs>
        <text x="400" y="142" fontSize="10" fill="#22c55e" fontWeight="600">Biomimicry</text>

        {/* Applications */}
        {apps.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 55} y="160" width="110" height="120" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
            <text x={a.x} y="195" textAnchor="middle" fontSize="28">{a.icon}</text>
            <text x={a.x} y="225" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{a.name}</text>
            <text x={a.x} y="242" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{a.detail}</text>
            {/* Water drop rolling off */}
            <circle cx={a.x + 30} cy="260" r="5" fill="#3b82f6" opacity="0.3" />
            <path d={`M${a.x + 30},255 L${a.x + 40},260`} stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          </g>
        ))}

        {/* Bottom note */}
        <text x="350" y="310" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">All these coatings use the same trick: micro-bumps + hydrophobic nano-layer</text>
        <text x="350" y="326" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Water contacts &lt;3% of the surface → it cannot stick → it rolls off carrying dirt</text>
      </svg>
    </div>
  );
}
