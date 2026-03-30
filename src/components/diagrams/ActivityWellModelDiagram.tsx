/**
 * ActivityWellModelDiagram — Instructions for building a simple well model
 * using a plastic bottle, gravel, sand, and water.
 */
export default function ActivityWellModelDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="DIY well model using a plastic bottle with gravel, sand, and soil layers">
        <rect width="400" height="300" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Build a Well Model</text>
        <text x="200" y="38" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Materials: 2-litre bottle, gravel, sand, soil, straw, water</text>

        {/* Bottle outline */}
        <path d="M 140 60 L 140 250 Q 140 265, 200 265 Q 260 265, 260 250 L 260 60 Q 260 50, 200 50 Q 140 50, 140 60 Z" fill="none" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Layer 1: Gravel (bottom) */}
        <path d="M 140 220 L 140 250 Q 140 265, 200 265 Q 260 265, 260 250 L 260 220 Z" fill="#a16207" opacity="0.4" />
        {[155, 175, 195, 215, 235, 245, 165, 185, 225].map((x, i) => (
          <circle key={i} cx={x} cy={235 + (i % 3) * 8} r="5" fill="#a16207" opacity="0.6" />
        ))}
        <text x="310" y="242" className="fill-amber-700 dark:fill-amber-400" fontSize="10" fontWeight="bold">1. Gravel</text>
        <text x="310" y="255" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(Large pores)</text>

        {/* Layer 2: Coarse sand */}
        <rect x="140" y="180" width="120" height="40" fill="#ca8a04" opacity="0.3" />
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={148 + (i % 10) * 12} cy={188 + Math.floor(i / 10) * 15} r="2" fill="#ca8a04" opacity="0.5" />
        ))}
        <text x="310" y="200" className="fill-yellow-700 dark:fill-yellow-400" fontSize="10" fontWeight="bold">2. Coarse Sand</text>
        <text x="310" y="213" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(Medium pores)</text>

        {/* Layer 3: Fine sand */}
        <rect x="140" y="140" width="120" height="40" fill="#fbbf24" opacity="0.2" />
        <text x="310" y="160" className="fill-yellow-600 dark:fill-yellow-300" fontSize="10" fontWeight="bold">3. Fine Sand</text>
        <text x="310" y="173" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(Small pores)</text>

        {/* Layer 4: Soil */}
        <rect x="140" y="100" width="120" height="40" fill="#92400e" opacity="0.3" />
        <text x="310" y="120" className="fill-amber-800 dark:fill-amber-300" fontSize="10" fontWeight="bold">4. Soil</text>
        <text x="310" y="133" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(Finest filter)</text>

        {/* Straw (well) */}
        <rect x="195" y="55" width="10" height="210" fill="#78716c" opacity="0.6" stroke="#57534e" strokeWidth="0.5" />
        <text x="200" y="48" textAnchor="middle" className="fill-gray-700 dark:fill-slate-300" fontSize="10" fontWeight="bold">Straw</text>
        <text x="200" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">(Poke holes at the bottom = well screen)</text>

        {/* Water being poured */}
        <path d="M 90 70 Q 100 60, 110 75 L 135 85" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <polygon points="135,85 128,82 130,88" fill="#60a5fa" />
        <text x="80" y="65" className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="bold">Pour water</text>

        {/* Water level rising in straw */}
        <rect x="196" y="200" width="8" height="65" fill="#60a5fa" opacity="0.4" />

        {/* Steps on the left */}
        <text x="25" y="80" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="bold">Steps:</text>
        <text x="25" y="95" className="fill-gray-600 dark:fill-slate-400" fontSize="9">1. Cut bottle bottom off</text>
        <text x="25" y="108" className="fill-gray-600 dark:fill-slate-400" fontSize="9">2. Invert (neck = drain)</text>
        <text x="25" y="121" className="fill-gray-600 dark:fill-slate-400" fontSize="9">3. Layer gravel → sand → soil</text>
        <text x="25" y="134" className="fill-gray-600 dark:fill-slate-400" fontSize="9">4. Insert straw with holes</text>
        <text x="25" y="147" className="fill-gray-600 dark:fill-slate-400" fontSize="9">5. Pour muddy water on top</text>
        <text x="25" y="160" className="fill-gray-600 dark:fill-slate-400" fontSize="9">6. Suck straw — clear water!</text>

        {/* Observe box */}
        <rect x="20" y="170" width="105" height="50" rx="4" className="fill-emerald-50 dark:fill-emerald-900/30" stroke="#10b981" strokeWidth="1" />
        <text x="72" y="186" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="bold">Observe:</text>
        <text x="72" y="199" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Which layer filters most?</text>
        <text x="72" y="212" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">Does water reach straw?</text>
      </svg>
    </div>
  );
}
