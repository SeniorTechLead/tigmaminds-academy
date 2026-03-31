export default function HoliNaturalDyeDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Natural vs synthetic dyes: plant-based pigments compared with industrial chemical dyes"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-rose-600 dark:fill-rose-400">
          Natural vs Synthetic Dyes
        </text>

        {/* Natural dyes panel */}
        <rect x="40" y="55" width="300" height="260" rx="10" className="fill-green-50 dark:fill-green-950/20 stroke-green-300 dark:stroke-green-700" strokeWidth="1.5" />
        <text x="190" y="78" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-green-700 dark:fill-green-300">Natural Dyes</text>
        <text x="190" y="94" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Extracted from plants, insects, minerals</text>

        {[
          { y: 115, color: '#fbbf24', source: 'Turmeric (Curcuma longa)', gives: 'Yellow', molecule: 'Curcumin' },
          { y: 150, color: '#ef4444', source: 'Hibiscus petals', gives: 'Red', molecule: 'Anthocyanins' },
          { y: 185, color: '#3b82f6', source: 'Indigo (Indigofera)', gives: 'Blue', molecule: 'Indigotin' },
          { y: 220, color: '#10b981', source: 'Neem / Henna leaves', gives: 'Green', molecule: 'Chlorophyll' },
          { y: 255, color: '#a855f7', source: 'Lac insect secretion', gives: 'Purple-red', molecule: 'Laccaic acid' },
        ].map(({ y, color, source, gives, molecule }) => (
          <g key={source}>
            <circle cx="65" cy={y} r="8" fill={color} opacity="0.6" />
            <text x="80" y={y + 1} fontSize="10" className="fill-gray-700 dark:fill-slate-300">{source}</text>
            <text x="80" y={y + 13} fontSize="9" className="fill-gray-500 dark:fill-slate-400">{gives} \u2014 {molecule}</text>
          </g>
        ))}

        <text x="190" y="290" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">
          Biodegradable \u2022 Skin-safe \u2022 Fade over time
        </text>

        {/* Synthetic dyes panel */}
        <rect x="360" y="55" width="300" height="260" rx="10" className="fill-violet-50 dark:fill-violet-950/20 stroke-violet-300 dark:stroke-violet-700" strokeWidth="1.5" />
        <text x="510" y="78" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-violet-700 dark:fill-violet-300">Synthetic Dyes</text>
        <text x="510" y="94" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Made from petroleum-based chemicals</text>

        {[
          { y: 120, fact: 'First synthetic dye: Mauveine (1856)' },
          { y: 142, fact: 'Made from coal tar / petroleum derivatives' },
          { y: 164, fact: 'Much cheaper to mass-produce' },
          { y: 186, fact: 'Extremely vivid and consistent colors' },
          { y: 208, fact: 'Highly color-fast (don\u2019t fade easily)' },
        ].map(({ y, fact }) => (
          <text key={y} x="385" y={y} fontSize="10" className="fill-gray-600 dark:fill-slate-400">\u2022 {fact}</text>
        ))}

        <text x="510" y="240" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          BUT: some cause skin irritation,
        </text>
        <text x="510" y="254" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          pollute waterways, not biodegradable
        </text>

        <text x="510" y="290" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-violet-600 dark:fill-violet-400">
          Vivid \u2022 Cheap \u2022 Environmental cost
        </text>

        {/* Key chemistry */}
        <rect x="60" y="330" width="580" height="110" rx="8" className="fill-rose-50 dark:fill-rose-950/30 stroke-rose-200 dark:stroke-rose-800" strokeWidth="1" />
        <text x="350" y="352" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-rose-700 dark:fill-rose-300">
          Why Colors Are Colors: Light Absorption
        </text>
        <text x="350" y="375" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          A dye molecule absorbs certain wavelengths of light and reflects the rest.
        </text>
        <text x="350" y="395" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Turmeric absorbs blue/violet light \u2192 reflects yellow/orange \u2192 looks yellow.
        </text>
        <text x="350" y="415" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          The molecular structure determines WHICH wavelengths are absorbed.
        </text>
        <text x="350" y="432" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-rose-600 dark:fill-rose-400">
          Change the molecule = change the color
        </text>
      </svg>
    </div>
  );
}
