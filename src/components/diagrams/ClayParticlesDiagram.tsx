export default function ClayParticlesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Clay mineral structure showing layered silicate sheets with water molecules between them"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Clay Mineral Structure: Layered Silicates
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Water between layers lets them slide — that is why wet clay is shapeable
        </text>

        {/* Layer 1 — Silicate sheet */}
        {[0, 1, 2].map((i) => {
          const y = 90 + i * 120;
          return (
            <g key={i}>
              {/* Tetrahedral layer (Si-O) */}
              <rect x="120" y={y} width="540" height="28" rx="4" fill="#7c3aed" opacity="0.75" />
              <text x="390" y={y + 19} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                Si\u2013O Tetrahedral Layer
              </text>
              {/* Octahedral layer (Al-O) */}
              <rect x="120" y={y + 30} width="540" height="28" rx="4" fill="#059669" opacity="0.75" />
              <text x="390" y={y + 49} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                Al\u2013O Octahedral Layer
              </text>
              {/* Water molecules between layers */}
              {i < 2 && (
                <g>
                  {[180, 280, 380, 480, 580].map((wx) => (
                    <g key={wx}>
                      <circle cx={wx} cy={y + 76} r="8" fill="#3b82f6" opacity="0.5" />
                      <text x={wx} y={y + 80} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                        H\u2082O
                      </text>
                    </g>
                  ))}
                  <text x="80" y={y + 80} textAnchor="middle" fontSize="10" className="fill-blue-500 dark:fill-blue-400" fontWeight="600">
                    Water
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Arrows showing sliding */}
        <g>
          <line x1="690" y1="130" x2="720" y2="130" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-clay)" />
          <line x1="690" y1="250" x2="660" y2="250" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-clay)" />
          <text x="740" y="135" fontSize="10" className="fill-amber-600 dark:fill-amber-400" fontWeight="600">slide</text>
          <text x="640" y="265" fontSize="10" className="fill-amber-600 dark:fill-amber-400" fontWeight="600" textAnchor="end">slide</text>
        </g>

        <defs>
          <marker id="arrow-clay" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Key insight box */}
        <rect x="120" y="420" width="540" height="44" rx="8" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="390" y="440" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          Key: Water lets layers slide over each other like a deck of wet cards.
        </text>
        <text x="390" y="456" textAnchor="middle" fontSize="11" className="fill-amber-600 dark:fill-amber-400">
          Too much water = soup. Too little = cracking. The potter controls this balance.
        </text>
      </svg>
    </div>
  );
}
