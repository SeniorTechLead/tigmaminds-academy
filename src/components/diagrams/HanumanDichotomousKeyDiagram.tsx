export default function HanumanDichotomousKeyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 360" className="w-full max-w-2xl mx-auto" role="img" aria-label="Dichotomous key for identifying Himalayan medicinal plants">
        {/* Title */}
        <text x="280" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Dichotomous Key: Himalayan Medicinal Plants
        </text>

        {/* Q1: Leaf shape */}
        <rect x="175" y="38" width="210" height="34" rx="8"
          className="fill-green-100 dark:fill-green-900/40 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
        <text x="280" y="60" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="11" fontWeight="bold">
          Leaves simple or compound?
        </text>

        {/* Simple branch (left) */}
        <line x1="230" y1="72" x2="130" y2="115" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="168" y="92" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="bold">Simple</text>

        {/* Compound branch (right) */}
        <line x1="330" y1="72" x2="430" y2="115" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <text x="375" y="92" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="bold">Compound</text>

        {/* Q2a: Leaf margin */}
        <rect x="35" y="115" width="190" height="34" rx="8"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <text x="130" y="137" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">
          Leaf edge smooth or toothed?
        </text>

        {/* Q2b: Flower color */}
        <rect x="335" y="115" width="190" height="34" rx="8"
          className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-400 dark:stroke-purple-500" strokeWidth="1.5" />
        <text x="430" y="137" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="11" fontWeight="bold">
          Flowers yellow or purple?
        </text>

        {/* Smooth */}
        <line x1="85" y1="149" x2="55" y2="195" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="52" y="175" className="fill-emerald-600 dark:fill-emerald-400" fontSize="9" fontWeight="bold">Smooth</text>

        {/* Toothed */}
        <line x1="175" y1="149" x2="210" y2="195" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="200" y="175" className="fill-red-600 dark:fill-red-400" fontSize="9" fontWeight="bold">Toothed</text>

        {/* Yellow */}
        <line x1="385" y1="149" x2="355" y2="195" className="stroke-yellow-600 dark:stroke-yellow-500" strokeWidth="2" />
        <text x="355" y="175" className="fill-yellow-600 dark:fill-yellow-400" fontSize="9" fontWeight="bold">Yellow</text>

        {/* Purple */}
        <line x1="475" y1="149" x2="505" y2="195" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="2" />
        <text x="495" y="175" className="fill-purple-600 dark:fill-purple-400" fontSize="9" fontWeight="bold">Purple</text>

        {/* Result: Tulsi */}
        <rect x="5" y="200" width="100" height="52" rx="10"
          className="fill-green-200 dark:fill-green-800/50 stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
        <text x="55" y="222" textAnchor="middle" className="fill-green-800 dark:fill-green-200" fontSize="11" fontWeight="bold">Tulsi</text>
        <text x="55" y="236" textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="8">Ocimum sanctum</text>
        <text x="55" y="247" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Anti-inflammatory</text>

        {/* Result: Neem */}
        <rect x="160" y="200" width="100" height="52" rx="10"
          className="fill-teal-200 dark:fill-teal-800/50 stroke-teal-500 dark:stroke-teal-400" strokeWidth="1.5" />
        <text x="210" y="222" textAnchor="middle" className="fill-teal-800 dark:fill-teal-200" fontSize="11" fontWeight="bold">Neem</text>
        <text x="210" y="236" textAnchor="middle" className="fill-teal-600 dark:fill-teal-400" fontSize="8">Azadirachta indica</text>
        <text x="210" y="247" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Antibacterial</text>

        {/* Result: Turmeric */}
        <rect x="305" y="200" width="100" height="52" rx="10"
          className="fill-yellow-200 dark:fill-yellow-800/50 stroke-yellow-500 dark:stroke-yellow-400" strokeWidth="1.5" />
        <text x="355" y="222" textAnchor="middle" className="fill-yellow-800 dark:fill-yellow-200" fontSize="11" fontWeight="bold">Turmeric</text>
        <text x="355" y="236" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400" fontSize="8">Curcuma longa</text>
        <text x="355" y="247" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Antioxidant</text>

        {/* Result: Aconite */}
        <rect x="455" y="200" width="100" height="52" rx="10"
          className="fill-purple-200 dark:fill-purple-800/50 stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.5" />
        <text x="505" y="222" textAnchor="middle" className="fill-purple-800 dark:fill-purple-200" fontSize="11" fontWeight="bold">Aconite</text>
        <text x="505" y="236" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400" fontSize="8">Aconitum spp.</text>
        <text x="505" y="247" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Toxic (used carefully)</text>

        {/* How it works note */}
        <rect x="100" y="280" width="360" height="60" rx="8"
          className="fill-gray-100 dark:fill-gray-800/60 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="280" y="298" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">How a Dichotomous Key Works</text>
        <text x="280" y="312" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">At each step, choose ONE of two options.</text>
        <text x="280" y="324" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="9">Each choice narrows the possibilities until you reach one species.</text>
      </svg>
    </div>
  );
}
