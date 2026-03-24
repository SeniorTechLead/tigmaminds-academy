export default function VariablesDiagram() {
  return (
    <svg viewBox="0 0 600 180" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Three labeled jars representing variables">
      {/* Jar 1: frequency */}
      <g transform="translate(60, 20)">
        {/* Jar body */}
        <rect x="0" y="40" width="100" height="100" rx="12" className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400" strokeWidth="2" />
        <rect x="20" y="30" width="60" height="20" rx="6" className="fill-amber-200 dark:fill-amber-800/40 stroke-amber-400" strokeWidth="2" />
        {/* Value inside */}
        <text x="50" y="100" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="28" fontWeight="bold" fontFamily="monospace">80</text>
        {/* Label */}
        <text x="50" y="165" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="13" fontWeight="600" fontFamily="monospace">frequency</text>
      </g>

      {/* Jar 2: pulse_rate */}
      <g transform="translate(250, 20)">
        <rect x="0" y="40" width="100" height="100" rx="12" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="2" />
        <rect x="20" y="30" width="60" height="20" rx="6" className="fill-sky-200 dark:fill-sky-800/40 stroke-sky-400" strokeWidth="2" />
        <text x="50" y="100" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="28" fontWeight="bold" fontFamily="monospace">0.5</text>
        <text x="50" y="165" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="13" fontWeight="600" fontFamily="monospace">pulse_rate</text>
      </g>

      {/* Jar 3: name */}
      <g transform="translate(440, 20)">
        <rect x="0" y="40" width="100" height="100" rx="12" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400" strokeWidth="2" />
        <rect x="20" y="30" width="60" height="20" rx="6" className="fill-emerald-200 dark:fill-emerald-800/40 stroke-emerald-400" strokeWidth="2" />
        <text x="50" y="100" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="22" fontWeight="bold" fontFamily="monospace">"calm"</text>
        <text x="50" y="165" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="13" fontWeight="600" fontFamily="monospace">name</text>
      </g>

      {/* Equals signs */}
      <text x="30" y="95" className="fill-gray-400" fontSize="20" fontFamily="monospace">=</text>
      <text x="220" y="95" className="fill-gray-400" fontSize="20" fontFamily="monospace">=</text>
      <text x="410" y="95" className="fill-gray-400" fontSize="20" fontFamily="monospace">=</text>
    </svg>
  );
}
