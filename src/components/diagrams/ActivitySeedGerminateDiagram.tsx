export default function ActivitySeedGerminateDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 360" className="w-full max-w-2xl mx-auto" role="img" aria-label="Home seed germination experiment: compare storage conditions">
        <rect width="520" height="360" rx="12" className="fill-white dark:fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" className="fill-lime-400" fontSize="14" fontWeight="bold">Activity: Seed Germination Experiment</text>

        {/* Materials section */}
        <text x="260" y="52" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">You need: 30 seeds (mustard, bean, or chilli) • cotton wool • 3 containers • water</text>

        {/* Three experimental conditions */}
        {/* Condition A: Room temp, damp */}
        <g transform="translate(25, 70)">
          <rect width="150" height="120" rx="8" className="fill-emerald-900/30 stroke-emerald-500" strokeWidth="1" />
          <text x="75" y="20" textAnchor="middle" className="fill-emerald-400" fontSize="11" fontWeight="bold">A: Warm + Damp</text>
          {/* Container */}
          <rect x="35" y="35" width="80" height="50" rx="4" className="fill-slate-700 stroke-slate-500" strokeWidth="1" />
          {/* Cotton */}
          <rect x="40" y="55" width="70" height="15" rx="3" className="fill-blue-200/30" />
          {/* Seeds on cotton */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <circle key={i} cx={48 + (i % 5) * 14} cy={60 + Math.floor(i / 5) * 6} r="2.5" className="fill-amber-600" />
          ))}
          {/* Water drops */}
          <circle cx="55" cy="50" r="2" className="fill-blue-400" opacity="0.5" />
          <circle cx="85" cy="48" r="1.5" className="fill-blue-400" opacity="0.5" />
          <text x="75" y="100" textAnchor="middle" className="fill-emerald-300" fontSize="9">Room temp, keep moist</text>
          <text x="75" y="112" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="bold">≈ 25°C</text>
        </g>

        {/* Condition B: Fridge, damp */}
        <g transform="translate(185, 70)">
          <rect width="150" height="120" rx="8" className="fill-blue-900/30 stroke-blue-500" strokeWidth="1" />
          <text x="75" y="20" textAnchor="middle" className="fill-blue-400" fontSize="11" fontWeight="bold">B: Cold + Damp</text>
          {/* Container */}
          <rect x="35" y="35" width="80" height="50" rx="4" className="fill-slate-700 stroke-slate-500" strokeWidth="1" />
          {/* Cotton */}
          <rect x="40" y="55" width="70" height="15" rx="3" className="fill-blue-200/30" />
          {/* Seeds */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <circle key={i} cx={48 + (i % 5) * 14} cy={60 + Math.floor(i / 5) * 6} r="2.5" className="fill-amber-600" />
          ))}
          {/* Snowflake */}
          <text x="105" y="48" className="fill-blue-300" fontSize="12">❄</text>
          <text x="75" y="100" textAnchor="middle" className="fill-blue-300" fontSize="9">Refrigerator, keep moist</text>
          <text x="75" y="112" textAnchor="middle" className="fill-blue-400" fontSize="10" fontWeight="bold">≈ 4°C</text>
        </g>

        {/* Condition C: Room temp, dry */}
        <g transform="translate(345, 70)">
          <rect width="150" height="120" rx="8" className="fill-orange-900/30 stroke-orange-500" strokeWidth="1" />
          <text x="75" y="20" textAnchor="middle" className="fill-orange-400" fontSize="11" fontWeight="bold">C: Warm + Dry</text>
          {/* Container */}
          <rect x="35" y="35" width="80" height="50" rx="4" className="fill-slate-700 stroke-slate-500" strokeWidth="1" />
          {/* Dry surface */}
          <rect x="40" y="65" width="70" height="5" rx="2" className="fill-amber-800/40" />
          {/* Seeds */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <circle key={i} cx={48 + (i % 5) * 14} cy={60 + Math.floor(i / 5) * 6} r="2.5" className="fill-amber-600" />
          ))}
          <text x="75" y="100" textAnchor="middle" className="fill-orange-300" fontSize="9">Room temp, no water</text>
          <text x="75" y="112" textAnchor="middle" className="fill-orange-400" fontSize="10" fontWeight="bold">≈ 25°C</text>
        </g>

        {/* Results table */}
        <text x="260" y="215" textAnchor="middle" className="fill-lime-400" fontSize="12" fontWeight="bold">Record Results (Day 7)</text>

        {/* Table */}
        <rect x="40" y="225" width="440" height="22" rx="4" className="fill-slate-700" />
        <text x="145" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="bold">Condition</text>
        <text x="295" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="bold">Sprouted / 10</text>
        <text x="420" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="10" fontWeight="bold">Rate (%)</text>

        {/* Row A */}
        <rect x="40" y="249" width="440" height="22" rx="0" className="fill-emerald-900/20" />
        <text x="145" y="264" textAnchor="middle" className="fill-emerald-300" fontSize="10">A: Warm + Damp</text>
        <text x="295" y="264" textAnchor="middle" className="fill-emerald-300" fontSize="10">_____ / 10</text>
        <text x="420" y="264" textAnchor="middle" className="fill-emerald-300" fontSize="10">_____%</text>

        {/* Row B */}
        <rect x="40" y="273" width="440" height="22" rx="0" className="fill-blue-900/20" />
        <text x="145" y="288" textAnchor="middle" className="fill-blue-300" fontSize="10">B: Cold + Damp</text>
        <text x="295" y="288" textAnchor="middle" className="fill-blue-300" fontSize="10">_____ / 10</text>
        <text x="420" y="288" textAnchor="middle" className="fill-blue-300" fontSize="10">_____%</text>

        {/* Row C */}
        <rect x="40" y="297" width="440" height="22" rx="0" className="fill-orange-900/20" />
        <text x="145" y="312" textAnchor="middle" className="fill-orange-300" fontSize="10">C: Warm + Dry</text>
        <text x="295" y="312" textAnchor="middle" className="fill-orange-300" fontSize="10">_____ / 10</text>
        <text x="420" y="312" textAnchor="middle" className="fill-orange-300" fontSize="10">_____%</text>

        {/* Expected pattern hint */}
        <rect x="40" y="328" width="440" height="28" rx="6" className="fill-amber-900/30" />
        <text x="260" y="340" textAnchor="middle" className="fill-amber-300" fontSize="10">Prediction: A should sprout most (water + warmth), C should sprout least (no water).</text>
        <text x="260" y="352" textAnchor="middle" className="fill-amber-300" fontSize="10">This is why seed banks store seeds cold AND dry — to PREVENT germination.</text>
      </svg>
    </div>
  );
}
