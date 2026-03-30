const StormIntensityScaleDiagram = () => {
  const categories = [
    { cat: 1, color: 'fill-green-500', bg: 'fill-green-100 dark:fill-green-900', text: 'fill-green-700 dark:fill-green-300', wind: '119–153 km/h', damage: 'Minimal — some roof damage, branches', example: 'Nisha (2008)' },
    { cat: 2, color: 'fill-yellow-500', bg: 'fill-yellow-100 dark:fill-yellow-900', text: 'fill-yellow-700 dark:fill-yellow-300', wind: '154–177 km/h', damage: 'Moderate — major roof, tree damage', example: 'Vardah (2016)' },
    { cat: 3, color: 'fill-amber-500', bg: 'fill-amber-100 dark:fill-amber-900', text: 'fill-amber-700 dark:fill-amber-300', wind: '178–208 km/h', damage: 'Extensive — structural damage', example: 'Hudhud (2014)' },
    { cat: 4, color: 'fill-orange-600', bg: 'fill-orange-100 dark:fill-orange-900', text: 'fill-orange-700 dark:fill-orange-300', wind: '209–251 km/h', damage: 'Catastrophic — severe destruction', example: 'Fani (2019)' },
    { cat: 5, color: 'fill-red-600', bg: 'fill-red-100 dark:fill-red-900', text: 'fill-red-700 dark:fill-red-300', wind: '252+ km/h', damage: 'Total destruction of area', example: 'Amphan (2020)' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 660 468"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Saffir-Simpson scale showing five hurricane categories with wind speeds and damage descriptions"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .cat-label { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Saffir-Simpson Hurricane Wind Scale
        </text>

        {/* Column headers */}
        <text x="55" y="55" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" fontWeight="600">Category</text>
        <text x="175" y="55" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" fontWeight="600">Wind Speed</text>
        <text x="360" y="55" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" fontWeight="600">Damage</text>
        <text x="530" y="55" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" fontWeight="600">Example</text>

        {categories.map((c, i) => {
          const y = 72 + i * 64;
          const barWidth = 80 + i * 25;
          return (
            <g key={c.cat}>
              {/* Row background */}
              <rect x="15" y={y} width="570" height="54" rx="6"
                className={c.bg} opacity="0.5" />

              {/* Category number */}
              <text x="55" y={y + 24} textAnchor="middle"
                className={`cat-label ${c.text}`}>
                Cat {c.cat}
              </text>

              {/* Colored bar */}
              <rect x="115" y={y + 8} width={barWidth} height="14" rx="4"
                className={c.color} opacity="0.8" />

              {/* Wind speed */}
              <text x="175" y={y + 42} textAnchor="middle"
                className={`step-text ${c.text}`}>
                {c.wind}
              </text>

              {/* Damage description */}
              <text x="280" y={y + 30} textAnchor="start"
                className={`label-text ${c.text}`}>
                {c.damage}
              </text>

              {/* Example storm */}
              <text x="530" y={y + 30} textAnchor="middle"
                className={`label-text ${c.text}`}>
                {c.example}
              </text>
            </g>
          );
        })}

        {/* Bottom caption */}
        <rect x="70" y="400" width="460" height="28" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="418" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Each category step means dramatically more destruction
        </text>
      </svg>
    </div>
  );
};

export default StormIntensityScaleDiagram;
