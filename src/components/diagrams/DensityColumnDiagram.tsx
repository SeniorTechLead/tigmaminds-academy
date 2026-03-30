export default function DensityColumnDiagram() {
  const colX = 140;
  const colW = 120;
  const colTop = 55;
  const layerH = 44;

  const layers = [
    { name: 'Rubbing Alcohol', density: 0.79, fill: 'fill-purple-200 dark:fill-purple-700/60', text: 'fill-purple-700 dark:fill-purple-200' },
    { name: 'Vegetable Oil', density: 0.92, fill: 'fill-yellow-200 dark:fill-yellow-600/60', text: 'fill-yellow-700 dark:fill-yellow-200' },
    { name: 'Water', density: 1.00, fill: 'fill-blue-200 dark:fill-blue-500/50', text: 'fill-blue-700 dark:fill-blue-200' },
    { name: 'Dish Soap', density: 1.06, fill: 'fill-green-200 dark:fill-green-600/50', text: 'fill-green-700 dark:fill-green-200' },
    { name: 'Honey', density: 1.42, fill: 'fill-amber-300 dark:fill-amber-600/60', text: 'fill-amber-800 dark:fill-amber-200' },
  ];

  const objects = [
    { name: 'Cork', yIndex: 0.8, color: 'fill-orange-400 dark:fill-orange-500', r: 8 },
    { name: 'Grape', yIndex: 2.6, color: 'fill-purple-500 dark:fill-purple-400', r: 9 },
    { name: 'Coin', yIndex: 4.5, color: 'fill-slate-400 dark:fill-slate-300', r: 7 },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 420 340"
        className="w-full h-auto"
        role="img"
        aria-label="Density column showing 5 liquid layers with floating objects"
      >
        <style>{`
          .dc-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .dc-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .dc-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .dc-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .dc-density { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="420" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="26" textAnchor="middle" className="dc-title fill-gray-700 dark:fill-gray-200">
          Density Column
        </text>

        {/* Beaker outline */}
        <rect x={colX - 2} y={colTop - 2} width={colW + 4} height={layerH * 5 + 4} rx="4"
          className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Liquid layers (top = lightest, bottom = heaviest) */}
        {layers.map((layer, i) => {
          const y = colTop + i * layerH;
          return (
            <g key={layer.name}>
              <rect x={colX} y={y} width={colW} height={layerH}
                className={layer.fill} />

              {/* Layer name inside */}
              <text x={colX + colW / 2} y={y + layerH / 2 - 4} textAnchor="middle"
                className={`dc-bold ${layer.text}`}>
                {layer.name}
              </text>
              <text x={colX + colW / 2} y={y + layerH / 2 + 10} textAnchor="middle"
                className={`dc-small ${layer.text}`} opacity="0.8">
                {layer.density} g/cm³
              </text>

              {/* Density value on right */}
              <text x={colX + colW + 18} y={y + layerH / 2 + 4} textAnchor="start"
                className="dc-density fill-gray-500 dark:fill-gray-400">
                {layer.density}
              </text>
            </g>
          );
        })}

        {/* Density label on right */}
        <text x={colX + colW + 18} y={colTop - 8} textAnchor="start"
          className="dc-small fill-gray-500 dark:fill-gray-400">
          Density
        </text>
        <text x={colX + colW + 18} y={colTop + 2} textAnchor="start"
          className="dc-small fill-gray-500 dark:fill-gray-400">
          (g/cm³)
        </text>

        {/* Arrow on far left: "Less dense" at top, "More dense" at bottom */}
        <defs>
          <marker id="dc-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
        <line x1="40" y1="60" x2="40" y2="270"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#dc-arrow)" />
        <text x="35" y="70" textAnchor="end" className="dc-small fill-gray-500 dark:fill-gray-400">Less</text>
        <text x="35" y="82" textAnchor="end" className="dc-small fill-gray-500 dark:fill-gray-400">dense</text>
        <text x="35" y="263" textAnchor="end" className="dc-small fill-gray-500 dark:fill-gray-400">More</text>
        <text x="35" y="275" textAnchor="end" className="dc-small fill-gray-500 dark:fill-gray-400">dense</text>

        {/* Floating objects */}
        {objects.map((obj) => {
          const cy = colTop + obj.yIndex * layerH;
          const cx = colX + colW / 2 + 38;
          return (
            <g key={obj.name}>
              <circle cx={cx} cy={cy} r={obj.r} className={obj.color} />
              <line x1={cx + obj.r + 3} y1={cy} x2={cx + obj.r + 20} y2={cy}
                className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
              <text x={cx + obj.r + 24} y={cy + 4}
                className="dc-label fill-gray-600 dark:fill-gray-300">
                {obj.name}
              </text>
            </g>
          );
        })}

        {/* Bottom note */}
        <text x="210" y="300" textAnchor="middle" className="dc-small fill-gray-500 dark:fill-gray-400">
          Objects float where their density matches the liquid layer
        </text>
        <text x="210" y="314" textAnchor="middle" className="dc-small fill-gray-400 dark:fill-gray-500">
          Like the treasures rising at different stages during the churning
        </text>
      </svg>
    </div>
  );
}
