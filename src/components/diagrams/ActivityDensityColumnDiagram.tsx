export default function ActivityDensityColumnDiagram() {
  const glassX = 80;
  const glassW = 80;
  const glassTop = 55;
  const glassH = 200;
  const layerH = glassH / 5;

  const steps = [
    { num: 1, liquid: 'Honey', color: 'fill-amber-400 dark:fill-amber-500', instruction: 'Pour honey into the glass first — it is the densest.' },
    { num: 2, liquid: 'Dish Soap', color: 'fill-green-400 dark:fill-green-500', instruction: 'Slowly pour dish soap along the side of the glass.' },
    { num: 3, liquid: 'Water', color: 'fill-blue-300 dark:fill-blue-500', instruction: 'Add water (dye it with food colouring) gently.' },
    { num: 4, liquid: 'Vegetable Oil', color: 'fill-yellow-300 dark:fill-yellow-500', instruction: 'Pour oil slowly — it floats on the water.' },
    { num: 5, liquid: 'Rubbing Alcohol', color: 'fill-purple-300 dark:fill-purple-500', instruction: 'Add alcohol last — it sits on top of the oil.' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 330"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step guide to building a density column with 5 liquids"
      >
        <style>{`
          .adc-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .adc-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .adc-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .adc-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .adc-step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        {/* Background */}
        <rect width="520" height="330" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="260" y="26" textAnchor="middle" className="adc-title fill-gray-700 dark:fill-gray-200">
          Activity: Build Your Own Density Column
        </text>

        {/* Subtitle */}
        <text x="260" y="44" textAnchor="middle" className="adc-small fill-gray-500 dark:fill-gray-400">
          You need: a tall glass, honey, dish soap, water, oil, rubbing alcohol
        </text>

        {/* Glass outline */}
        <rect x={glassX} y={glassTop} width={glassW} height={glassH} rx="4"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Final result layers (bottom to top) */}
        {steps.map((step, i) => {
          const layerIndex = steps.length - 1 - i; // reverse: step 1 at bottom
          const y = glassTop + layerIndex * layerH;

          return (
            <g key={step.num}>
              {/* Layer fill */}
              <rect x={glassX + 1} y={y + 1} width={glassW - 2} height={layerH - 1}
                className={step.color} opacity="0.7" />

              {/* Layer label inside glass */}
              <text x={glassX + glassW / 2} y={y + layerH / 2 + 4} textAnchor="middle"
                className="adc-small fill-gray-800 dark:fill-gray-100" fontWeight="600">
                {step.liquid}
              </text>
            </g>
          );
        })}

        {/* Glass label */}
        <text x={glassX + glassW / 2} y={glassTop + glassH + 18} textAnchor="middle"
          className="adc-bold fill-gray-600 dark:fill-gray-300">
          Final Result
        </text>

        {/* Step-by-step instructions on the right */}
        {steps.map((step, i) => {
          const y = glassTop + 6 + i * 38;
          const circleX = 200;
          const textX = 220;

          return (
            <g key={step.num}>
              {/* Step number circle */}
              <circle cx={circleX} cy={y + 8} r="10" className={step.color} opacity="0.8" />
              <text x={circleX} y={y + 12} textAnchor="middle"
                className="adc-step fill-gray-800 dark:fill-gray-100">
                {step.num}
              </text>

              {/* Step text */}
              <text x={textX} y={y + 6} className="adc-bold fill-gray-700 dark:fill-gray-200">
                {step.liquid}
              </text>
              <text x={textX} y={y + 20} className="adc-small fill-gray-500 dark:fill-gray-400">
                {step.instruction}
              </text>
            </g>
          );
        })}

        {/* Tip at bottom */}
        <text x="260" y="300" textAnchor="middle"
          className="adc-bold fill-emerald-600 dark:fill-emerald-400">
          Tip: Pour each liquid slowly along the side of the glass!
        </text>
        <text x="260" y="316" textAnchor="middle"
          className="adc-small fill-gray-400 dark:fill-gray-500">
          Try dropping small objects in — where do they float?
        </text>
      </svg>
    </div>
  );
}
