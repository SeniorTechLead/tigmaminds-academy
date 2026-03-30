export default function ChurningPolarityDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 500 260" className="w-full h-auto" role="img" aria-label="Molecular polarity diagram showing polar water molecule versus nonpolar oil molecule">
        <style>{`
          .cp-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .cp-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .cp-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="500" height="260" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="250" y="24" textAnchor="middle" className="cp-title fill-gray-700 dark:fill-gray-200">Why Oil and Water Don't Mix</text>

        {/* Water molecule - polar */}
        <text x="130" y="52" textAnchor="middle" className="cp-label fill-blue-600 dark:fill-blue-400" fontWeight="600">Water (Polar)</text>
        {/* Oxygen */}
        <circle cx="130" cy="100" r="18" className="fill-red-400 dark:fill-red-500" />
        <text x="130" y="105" textAnchor="middle" className="cp-small fill-white" fontWeight="600">O (delta-)</text>
        {/* Hydrogens */}
        <circle cx="95" cy="135" r="12" className="fill-blue-300 dark:fill-blue-400" />
        <text x="95" y="139" textAnchor="middle" className="cp-small fill-white" fontWeight="600">H+</text>
        <circle cx="165" cy="135" r="12" className="fill-blue-300 dark:fill-blue-400" />
        <text x="165" y="139" textAnchor="middle" className="cp-small fill-white" fontWeight="600">H+</text>
        {/* Bonds */}
        <line x1="118" y1="114" x2="102" y2="126" className="stroke-gray-500" strokeWidth="2" />
        <line x1="142" y1="114" x2="158" y2="126" className="stroke-gray-500" strokeWidth="2" />
        {/* Charge labels */}
        <text x="130" y="170" textAnchor="middle" className="cp-small fill-gray-500 dark:fill-gray-400">Uneven charge distribution</text>
        <text x="130" y="183" textAnchor="middle" className="cp-small fill-gray-500 dark:fill-gray-400">= attracts other polar molecules</text>

        {/* Divider */}
        <line x1="250" y1="45" x2="250" y2="200" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4 3" />
        <text x="250" y="215" textAnchor="middle" className="cp-small fill-red-500 dark:fill-red-400" fontWeight="600">Cannot mix!</text>

        {/* Oil molecule - nonpolar */}
        <text x="370" y="52" textAnchor="middle" className="cp-label fill-yellow-600 dark:fill-yellow-400" fontWeight="600">Oil (Nonpolar)</text>
        {/* Carbon chain */}
        {[320, 345, 370, 395, 420].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={105} r={10} className="fill-gray-600 dark:fill-gray-400" />
            <text x={cx} y={109} textAnchor="middle" className="cp-small fill-white" fontWeight="600">C</text>
            {i < 4 && <line x1={cx + 10} y1={105} x2={cx + 15} y2={105} className="stroke-gray-500" strokeWidth="2" />}
          </g>
        ))}
        {/* Hydrogen atoms on chain */}
        {[320, 345, 370, 395, 420].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={80} r={6} className="fill-blue-200 dark:fill-blue-400" opacity="0.6" />
            <circle cx={cx} cy={130} r={6} className="fill-blue-200 dark:fill-blue-400" opacity="0.6" />
          </g>
        ))}
        <text x="370" y="160" textAnchor="middle" className="cp-small fill-gray-500 dark:fill-gray-400">Even charge distribution</text>
        <text x="370" y="173" textAnchor="middle" className="cp-small fill-gray-500 dark:fill-gray-400">= no attraction to water</text>
        <text x="370" y="186" textAnchor="middle" className="cp-small fill-gray-500 dark:fill-gray-400">= "like dissolves like"</text>

        <text x="250" y="248" textAnchor="middle" className="cp-small fill-gray-400 dark:fill-gray-500">In the churning myth, this is why the ocean's substances separate — polar and nonpolar don't mix</text>
      </svg>
    </div>
  );
}
