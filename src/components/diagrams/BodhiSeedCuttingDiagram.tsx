export default function BodhiSeedCuttingDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 400" className="w-full max-w-2xl mx-auto" role="img" aria-label="Seeds vs cuttings: sexual vs asexual plant reproduction">
        <rect width="570" height="400" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="285" y="28" textAnchor="middle" className="fill-emerald-400" fontSize="14" fontWeight="bold">Seeds vs Cuttings</text>

        {/* Left: Sexual Reproduction (Seeds) */}
        <text x="145" y="55" textAnchor="middle" className="fill-amber-300" fontSize="12" fontWeight="bold">Sexual Reproduction</text>
        <text x="145" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">(Seeds)</text>

        {/* Parent A flower */}
        <circle cx="90" cy="110" r="18" className="fill-pink-700" />
        <circle cx="90" cy="110" r="8" className="fill-yellow-400" />
        <text x="90" y="114" textAnchor="middle" className="fill-yellow-900" fontSize="7" fontWeight="bold">♀</text>
        <text x="90" y="142" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Parent A</text>

        {/* Parent B flower */}
        <circle cx="200" cy="110" r="18" className="fill-pink-700" />
        <circle cx="200" cy="110" r="8" className="fill-yellow-400" />
        <text x="200" y="114" textAnchor="middle" className="fill-yellow-900" fontSize="7" fontWeight="bold">♂</text>
        <text x="200" y="142" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Parent B</text>

        {/* Pollen arrow */}
        <path d="M 170,105 Q 145,85 120,105" fill="none" className="stroke-yellow-400" strokeWidth="1.5" strokeDasharray="4,3">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <text x="145" y="85" textAnchor="middle" className="fill-yellow-400" fontSize="8">pollen</text>

        {/* Down arrow to seed */}
        <line x1="145" y1="148" x2="145" y2="175" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#bodhiArr)" />

        {/* Seed */}
        <ellipse cx="145" cy="195" rx="12" ry="8" className="fill-amber-700" />
        <text x="145" y="198" textAnchor="middle" className="fill-amber-300" fontSize="7">Seed</text>
        <text x="145" y="218" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">DNA from both parents</text>

        {/* Down arrow to seedling */}
        <line x1="145" y1="225" x2="145" y2="250" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#bodhiArr)" />

        {/* Seedling - unique */}
        <line x1="145" y1="280" x2="145" y2="260" className="stroke-green-600" strokeWidth="2" />
        <ellipse cx="135" cy="260" rx="12" ry="6" className="fill-green-500" />
        <ellipse cx="155" cy="258" rx="11" ry="5" className="fill-green-600" />
        <line x1="145" y1="280" x2="145" y2="295" className="stroke-amber-800" strokeWidth="2" />
        <text x="145" y="315" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">Unique offspring</text>
        <text x="145" y="330" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Different from both parents</text>

        {/* Divider */}
        <line x1="285" y1="45" x2="285" y2="370" className="stroke-slate-700" strokeWidth="1" strokeDasharray="6,4" />

        {/* Right: Asexual Reproduction (Cuttings) */}
        <text x="425" y="55" textAnchor="middle" className="fill-emerald-300" fontSize="12" fontWeight="bold">Asexual Reproduction</text>
        <text x="425" y="72" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">(Cuttings)</text>

        {/* Parent tree */}
        <line x1="425" y1="140" x2="425" y2="100" className="stroke-amber-800" strokeWidth="4" />
        <ellipse cx="425" cy="95" rx="30" ry="18" className="fill-green-600" />
        <text x="425" y="160" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Parent Tree</text>

        {/* Scissors cutting branch */}
        <line x1="445" y1="108" x2="480" y2="100" className="stroke-green-500" strokeWidth="2" />
        <text x="497" y="95" textAnchor="middle" className="fill-red-400" fontSize="14">✂</text>
        <text x="497" y="108" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">cut</text>

        {/* Arrow down to cutting */}
        <line x1="425" y1="168" x2="425" y2="195" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#bodhiArr)" />

        {/* Cutting in water/soil */}
        <rect x="405" y="200" width="40" height="30" rx="4" className="fill-amber-900" opacity="0.6" />
        <line x1="425" y1="200" x2="425" y2="185" className="stroke-green-500" strokeWidth="2" />
        <ellipse cx="418" cy="185" rx="8" ry="4" className="fill-green-500" />
        <ellipse cx="432" cy="183" rx="7" ry="4" className="fill-green-600" />
        {/* Roots forming */}
        <path d="M 420,230 Q 415,245 410,255" fill="none" className="stroke-amber-600" strokeWidth="1" />
        <path d="M 425,230 L 425,258" fill="none" className="stroke-amber-600" strokeWidth="1" />
        <path d="M 430,230 Q 435,245 440,255" fill="none" className="stroke-amber-600" strokeWidth="1" />
        <text x="425" y="270" textAnchor="middle" className="fill-amber-400" fontSize="8">new roots</text>

        {/* Arrow to clone */}
        <line x1="425" y1="278" x2="425" y2="295" className="stroke-slate-500" strokeWidth="1.5" markerEnd="url(#bodhiArr)" />

        {/* Clone - identical */}
        <text x="425" y="315" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">Exact clone</text>
        <text x="425" y="330" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">100% same DNA as parent</text>

        {/* Key insight box */}
        <rect x="70" y="350" width="430" height="38" rx="8" className="fill-emerald-900" opacity="0.5" />
        <text x="285" y="368" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">The Sri Maha Bodhi in Sri Lanka is a cutting from the original Bodhi Tree</text>
        <text x="285" y="382" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Planted ~288 BCE -- genetically identical to the tree under which the Buddha sat</text>

        <defs>
          <marker id="bodhiArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-slate-400" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
