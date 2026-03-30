export default function BrainPlasticityDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 340" className="w-full max-w-xl mx-auto" role="img" aria-label="Neuroplasticity: how neural connections strengthen with practice">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Neuroplasticity — Your Brain Rewires Itself
        </text>

        {/* BEFORE panel */}
        <rect x="15" y="35" width="235" height="200" rx="8" className="fill-slate-50 dark:fill-slate-800/50" stroke="#94a3b8" strokeWidth="1" />
        <text x="132" y="55" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Before Practice</text>

        {/* Sparse, thin connections */}
        {/* Neuron A */}
        <circle cx="60" cy="100" r="12" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="1.5" />
        <text x="60" y="104" textAnchor="middle" className="fill-purple-700 dark:fill-purple-200" fontSize="10">A</text>
        {/* Neuron B */}
        <circle cx="170" cy="90" r="12" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="1.5" />
        <text x="170" y="94" textAnchor="middle" className="fill-purple-700 dark:fill-purple-200" fontSize="10">B</text>
        {/* Neuron C */}
        <circle cx="120" cy="170" r="12" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="1.5" />
        <text x="120" y="174" textAnchor="middle" className="fill-purple-700 dark:fill-purple-200" fontSize="10">C</text>
        {/* Neuron D */}
        <circle cx="200" cy="180" r="12" className="fill-purple-200 dark:fill-purple-800" stroke="#a855f7" strokeWidth="1.5" />
        <text x="200" y="184" textAnchor="middle" className="fill-purple-700 dark:fill-purple-200" fontSize="10">D</text>

        {/* Thin, sparse connections */}
        <line x1="72" y1="100" x2="158" y2="90" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="65" y1="112" x2="108" y2="160" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <line x1="132" y1="170" x2="188" y2="180" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4 3" />

        <text x="132" y="215" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Weak, few connections</text>

        {/* AFTER panel */}
        <rect x="270" y="35" width="235" height="200" rx="8" className="fill-green-50 dark:fill-green-900/20" stroke="#22c55e" strokeWidth="1" />
        <text x="387" y="55" textAnchor="middle" className="fill-green-700 dark:fill-green-200" fontSize="11" fontWeight="bold">After Practice</text>

        {/* Same neurons but with thick, dense connections */}
        <circle cx="315" cy="100" r="14" className="fill-purple-300 dark:fill-purple-700" stroke="#a855f7" strokeWidth="2" />
        <text x="315" y="104" textAnchor="middle" className="fill-purple-700 dark:fill-purple-100" fontSize="10">A</text>
        <circle cx="425" cy="90" r="14" className="fill-purple-300 dark:fill-purple-700" stroke="#a855f7" strokeWidth="2" />
        <text x="425" y="94" textAnchor="middle" className="fill-purple-700 dark:fill-purple-100" fontSize="10">B</text>
        <circle cx="375" cy="170" r="14" className="fill-purple-300 dark:fill-purple-700" stroke="#a855f7" strokeWidth="2" />
        <text x="375" y="174" textAnchor="middle" className="fill-purple-700 dark:fill-purple-100" fontSize="10">C</text>
        <circle cx="455" cy="180" r="14" className="fill-purple-300 dark:fill-purple-700" stroke="#a855f7" strokeWidth="2" />
        <text x="455" y="184" textAnchor="middle" className="fill-purple-700 dark:fill-purple-100" fontSize="10">D</text>

        {/* Thick, many connections */}
        <line x1="329" y1="100" x2="411" y2="90" className="stroke-yellow-400" strokeWidth="3" />
        <line x1="320" y1="114" x2="361" y2="158" className="stroke-yellow-400" strokeWidth="3" />
        <line x1="389" y1="170" x2="441" y2="180" className="stroke-yellow-400" strokeWidth="3" />
        <line x1="329" y1="95" x2="361" y2="160" className="stroke-yellow-300" strokeWidth="2" />
        <line x1="425" y1="104" x2="455" y2="166" className="stroke-yellow-300" strokeWidth="2" />
        <line x1="315" y1="114" x2="441" y2="170" className="stroke-yellow-300" strokeWidth="1.5" />
        <line x1="375" y1="156" x2="425" y2="104" className="stroke-yellow-300" strokeWidth="1.5" />

        <text x="387" y="215" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="10">Strong, many connections</text>

        {/* Bottom explanation */}
        <rect x="30" y="250" width="460" height="78" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="268" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="10" fontWeight="bold">
          &quot;Neurons that fire together, wire together&quot; — Donald Hebb
        </text>
        <text x="260" y="284" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          Every time you practice a skill, the connections between the neurons involved
        </text>
        <text x="260" y="298" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          get thicker and faster. London taxi drivers who memorize 25,000 streets
        </text>
        <text x="260" y="312" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          develop a measurably larger hippocampus (the brain&apos;s navigation center).
        </text>
      </svg>
    </div>
  );
}
