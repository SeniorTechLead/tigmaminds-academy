export default function FiveKingdomsDiagram() {
  const kingdoms = [
    {
      name: 'Monera',
      example: 'Bacteria',
      features: ['No nucleus', 'Unicellular', 'Microscopic'],
      bgColor: 'fill-sky-200 dark:fill-sky-900/50',
      borderColor: 'stroke-sky-400',
      textColor: 'fill-sky-700 dark:fill-sky-300',
      icon: (x: number) => (
        <g>
          {/* Simple bacterium — rod shape */}
          <ellipse cx={x + 45} cy={58} rx="16" ry="8" className="fill-sky-400 dark:fill-sky-500" />
          <line x1={x + 25} y1={48} x2={x + 20} y2={40} className="stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ),
    },
    {
      name: 'Protista',
      example: 'Amoeba',
      features: ['Has nucleus', 'Mostly unicellular', 'Diverse'],
      bgColor: 'fill-emerald-200 dark:fill-emerald-900/50',
      borderColor: 'stroke-emerald-400',
      textColor: 'fill-emerald-700 dark:fill-emerald-300',
      icon: (x: number) => (
        <g>
          {/* Amoeba blob */}
          <path d={`M ${x + 35},45 Q ${x + 55},38 ${x + 58},52 Q ${x + 65},62 ${x + 50},68 Q ${x + 35},72 ${x + 28},58 Q ${x + 22},45 ${x + 35},45 Z`}
            className="fill-emerald-400 dark:fill-emerald-500" opacity="0.8" />
          <circle cx={x + 44} cy={55} r="4" className="fill-emerald-700 dark:fill-emerald-300" opacity="0.5" />
        </g>
      ),
    },
    {
      name: 'Fungi',
      example: 'Mushroom',
      features: ['Has nucleus', 'Decomposers', 'Cell walls (chitin)'],
      bgColor: 'fill-amber-200 dark:fill-amber-900/50',
      borderColor: 'stroke-amber-400',
      textColor: 'fill-amber-700 dark:fill-amber-300',
      icon: (x: number) => (
        <g>
          {/* Mushroom */}
          <rect x={x + 42} y={55} width="6" height="18" rx="2" className="fill-amber-300 dark:fill-amber-500" />
          <ellipse cx={x + 45} cy={52} rx="16" ry="10" className="fill-amber-400 dark:fill-amber-600" />
        </g>
      ),
    },
    {
      name: 'Plantae',
      example: 'Tree',
      features: ['Photosynthesis', 'Multicellular', 'Cell walls (cellulose)'],
      bgColor: 'fill-green-200 dark:fill-green-900/50',
      borderColor: 'stroke-green-400',
      textColor: 'fill-green-700 dark:fill-green-300',
      icon: (x: number) => (
        <g>
          {/* Simple tree */}
          <rect x={x + 42} y={58} width="6" height="15" rx="1" className="fill-amber-700 dark:fill-amber-600" />
          <polygon points={`${x + 45},35 ${x + 28},60 ${x + 62},60`} className="fill-green-500 dark:fill-green-600" />
        </g>
      ),
    },
    {
      name: 'Animalia',
      example: 'Elephant',
      features: ['No cell wall', 'Multicellular', 'Heterotrophs'],
      bgColor: 'fill-rose-200 dark:fill-rose-900/50',
      borderColor: 'stroke-rose-400',
      textColor: 'fill-rose-700 dark:fill-rose-300',
      icon: (x: number) => (
        <g>
          {/* Simple elephant silhouette */}
          <ellipse cx={x + 45} cy={55} rx="18" ry="12" className="fill-rose-400 dark:fill-rose-500" />
          <circle cx={x + 30} cy={48} r="8" className="fill-rose-400 dark:fill-rose-500" />
          {/* Trunk */}
          <path d={`M ${x + 23},50 Q ${x + 18},58 ${x + 20},65`} fill="none" className="stroke-rose-400 dark:stroke-rose-500" strokeWidth="3" strokeLinecap="round" />
          {/* Legs */}
          <line x1={x + 36} y1={66} x2={x + 36} y2={73} className="stroke-rose-400 dark:stroke-rose-500" strokeWidth="3" />
          <line x1={x + 54} y1={66} x2={x + 54} y2={73} className="stroke-rose-400 dark:stroke-rose-500" strokeWidth="3" />
        </g>
      ),
    },
  ];

  const colWidth = 90;
  const startX = 10;

  return (
    <div className="my-4">
      <svg viewBox="0 0 567 262" className="w-full max-w-2xl mx-auto" role="img" aria-label="Five kingdoms of life classification">
        {/* Title */}
        <text x="270" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          Five Kingdoms of Life
        </text>

        {kingdoms.map((k, i) => {
          const x = startX + i * (colWidth + 10);
          return (
            <g key={k.name}>
              {/* Column background */}
              <rect x={x} y="30" width={colWidth} height="210" rx="8" className={`${k.bgColor} ${k.borderColor}`} strokeWidth="1.5" />

              {/* Icon */}
              {k.icon(x)}

              {/* Kingdom name */}
              <text x={x + 45} y={92} textAnchor="middle" className={k.textColor} fontSize="12" fontWeight="bold">{k.name}</text>

              {/* Example */}
              <text x={x + 45} y={108} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">({k.example})</text>

              {/* Features */}
              {k.features.map((feat, fi) => (
                <text key={fi} x={x + 45} y={132 + fi * 16} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
                  {feat}
                </text>
              ))}

              {/* Cell type indicator */}
              <rect x={x + 8} y={192} width={colWidth - 16} height={20} rx="4" className="fill-white/50 dark:fill-black/20" />
              <text x={x + 45} y={206} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="9" fontWeight="600">
                {i === 0 ? 'Prokaryote' : 'Eukaryote'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
