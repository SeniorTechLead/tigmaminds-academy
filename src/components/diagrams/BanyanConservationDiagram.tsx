export default function BanyanConservationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 538 455" className="w-full max-w-lg mx-auto" role="img" aria-label="Conservation value of old trees as carbon stores, biodiversity hotspots, and cultural heritage with cost-benefit comparison">
        <rect width="500" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Conservation Value of Old Trees</text>
        <text x="250" y="44" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Why preservation outweighs removal</text>

        {/* === Three Pillars === */}

        {/* Pillar 1: Carbon Storage */}
        <rect x="20" y="60" width="145" height="155" rx="8" className="fill-green-900" opacity="0.4" />
        {/* Tree icon */}
        <rect x="82" y="78" width="10" height="25" rx="2" className="fill-amber-700" />
        <ellipse cx="87" cy="75" rx="20" ry="14" className="fill-green-600" opacity="0.7" />
        {/* CO2 label */}
        <text x="87" y="73" textAnchor="middle" className="fill-green-200" fontSize="7" fontWeight="bold">CO₂</text>
        <text x="92" y="118" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="bold">Carbon Store</text>
        <text x="92" y="135" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">40 tonnes C stored</text>
        <text x="92" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">= 150 tonnes CO₂</text>
        <text x="92" y="161" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">kept from atmosphere</text>
        <text x="92" y="180" textAnchor="middle" className="fill-green-400" fontSize="8" fontWeight="bold">Irreplaceable on</text>
        <text x="92" y="192" textAnchor="middle" className="fill-green-400" fontSize="8" fontWeight="bold">human timescales</text>
        <text x="92" y="207" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">(500 years to regrow)</text>

        {/* Pillar 2: Biodiversity */}
        <rect x="178" y="60" width="145" height="155" rx="8" className="fill-green-900" opacity="0.4" />
        {/* Ecosystem icon */}
        <ellipse cx="250" cy="80" rx="25" ry="15" className="fill-green-600" opacity="0.5" />
        {/* Bird */}
        <ellipse cx="240" cy="75" rx="4" ry="2.5" className="fill-amber-400" />
        {/* Insect */}
        <circle cx="260" cy="78" r="2" className="fill-yellow-400" />
        <text x="250" y="118" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="bold">Biodiversity</text>
        <text x="250" y="135" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">100+ species depend</text>
        <text x="250" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">on a single old tree</text>
        <text x="250" y="161" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Cavities, epiphytes,</text>
        <text x="250" y="174" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">microhabitats</text>
        <text x="250" y="193" textAnchor="middle" className="fill-green-400" fontSize="8" fontWeight="bold">Old trees are hotspots</text>
        <text x="250" y="207" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">(young trees lack these)</text>

        {/* Pillar 3: Cultural Heritage */}
        <rect x="336" y="60" width="145" height="155" rx="8" className="fill-green-900" opacity="0.4" />
        {/* Heritage icon - temple shape */}
        <rect x="398" y="85" width="20" height="15" className="fill-amber-600" opacity="0.5" />
        <polygon points="398,85 408,70 418,85" className="fill-amber-500" opacity="0.5" />
        <text x="408" y="118" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">Cultural Heritage</text>
        <text x="408" y="135" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Sacred groves, village</text>
        <text x="408" y="148" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">gathering places</text>
        <text x="408" y="161" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">Living monuments</text>
        <text x="408" y="174" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">connecting generations</text>
        <text x="408" y="193" textAnchor="middle" className="fill-amber-400" fontSize="8" fontWeight="bold">Cannot be replanted</text>
        <text x="408" y="207" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">(history is embedded)</text>

        {/* === Cost-Benefit Comparison === */}
        <text x="250" y="240" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="bold">Cost-Benefit Analysis</text>

        {/* Preserve column */}
        <rect x="30" y="255" width="210" height="130" rx="8" className="fill-green-900" opacity="0.4" />
        <text x="135" y="275" textAnchor="middle" className="fill-green-300" fontSize="11" fontWeight="bold">Preserve</text>
        <text x="135" y="295" textAnchor="middle" className="fill-green-400" fontSize="8">+ 150 tonnes CO₂ stored forever</text>
        <text x="135" y="310" textAnchor="middle" className="fill-green-400" fontSize="8">+ Biodiversity maintained</text>
        <text x="135" y="325" textAnchor="middle" className="fill-green-400" fontSize="8">+ Cultural value preserved</text>
        <text x="135" y="340" textAnchor="middle" className="fill-green-400" fontSize="8">+ Ecosystem services (shade, water)</text>
        <text x="135" y="358" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">- Opportunity cost of land</text>
        <text x="135" y="373" textAnchor="middle" className="fill-green-200" fontSize="9" fontWeight="bold">Net: overwhelmingly positive</text>

        {/* Remove column */}
        <rect x="260" y="255" width="210" height="130" rx="8" className="fill-amber-900" opacity="0.3" />
        <text x="365" y="275" textAnchor="middle" className="fill-amber-300" fontSize="11" fontWeight="bold">Remove</text>
        <text x="365" y="295" textAnchor="middle" className="fill-amber-400" fontSize="8">+ Timber: ~$5,000 one-time</text>
        <text x="365" y="310" textAnchor="middle" className="fill-amber-400" fontSize="8">+ Land cleared</text>
        <text x="365" y="325" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">- 150 tonnes CO₂ released</text>
        <text x="365" y="340" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">- 100+ species displaced</text>
        <text x="365" y="358" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">- 500 years to replace</text>
        <text x="365" y="373" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Net: massive long-term loss</text>

        {/* Bottom */}
        <text x="250" y="405" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="bold">An old tree is worth more standing than felled — by every measure</text>
      </svg>
    </div>
  );
}
