export default function HydroPurificationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 320" className="w-full max-w-xl mx-auto" role="img" aria-label="Water purification process: screening, settling, filtering, disinfection">
        <defs>
          <marker id="hydro-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" className="fill-blue-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Water Purification — From Dirty to Drinkable
        </text>

        {/* Step 1: Screening */}
        <rect x="10" y="40" width="105" height="100" rx="6" className="fill-amber-100 dark:fill-amber-900/40" stroke="#d97706" strokeWidth="1.5" />
        <text x="62" y="58" textAnchor="middle" className="fill-amber-700 dark:fill-amber-200" fontSize="10" fontWeight="bold">1. Screening</text>
        {/* Dirty water */}
        <rect x="25" y="65" width="75" height="30" rx="3" className="fill-yellow-700/30 dark:fill-yellow-900/50" />
        <text x="62" y="84" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">Dirty water</text>
        {/* Grid lines */}
        {[40, 50, 60, 70, 80].map(x => (
          <line key={x} x1={x} y1="100" x2={x} y2="120" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        ))}
        <text x="62" y="132" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Remove sticks,</text>
        <text x="62" y="132" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">large debris</text>

        {/* Arrow 1→2 */}
        <line x1="118" y1="90" x2="138" y2="90" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#hydro-arr)" />

        {/* Step 2: Coagulation & Settling */}
        <rect x="142" y="40" width="105" height="100" rx="6" className="fill-sky-100 dark:fill-sky-900/40" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="194" y="58" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="10" fontWeight="bold">2. Settling</text>
        {/* Tank with particles sinking */}
        <rect x="155" y="65" width="80" height="55" rx="3" className="fill-sky-200/50 dark:fill-sky-800/30" stroke="#0ea5e9" strokeWidth="0.8" />
        {/* Floating particles sinking */}
        <circle cx="170" cy="75" r="2" className="fill-amber-500" />
        <circle cx="185" cy="82" r="2.5" className="fill-amber-500" />
        <circle cx="200" cy="90" r="3" className="fill-amber-500" />
        <circle cx="175" cy="100" r="3.5" className="fill-amber-600" />
        <circle cx="210" cy="108" r="4" className="fill-amber-600" />
        {/* Sludge at bottom */}
        <rect x="155" y="112" width="80" height="8" rx="2" className="fill-amber-400 dark:fill-amber-700" />
        <text x="194" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Particles clump</text>
        <text x="194" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">and sink</text>

        {/* Arrow 2→3 */}
        <line x1="250" y1="90" x2="270" y2="90" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#hydro-arr)" />

        {/* Step 3: Filtration */}
        <rect x="274" y="40" width="105" height="100" rx="6" className="fill-blue-100 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="326" y="58" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">3. Filtration</text>
        {/* Filter layers */}
        <rect x="290" y="65" width="72" height="12" rx="2" className="fill-yellow-300 dark:fill-yellow-700" />
        <text x="326" y="74" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10">Sand</text>
        <rect x="290" y="80" width="72" height="12" rx="2" className="fill-gray-300 dark:fill-gray-600" />
        <text x="326" y="89" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10">Gravel</text>
        <rect x="290" y="95" width="72" height="12" rx="2" className="fill-gray-700 dark:fill-gray-400" />
        <text x="326" y="104" textAnchor="middle" className="fill-white dark:fill-gray-200" fontSize="10">Charcoal</text>
        {/* Clean water below */}
        <rect x="290" y="110" width="72" height="15" rx="2" className="fill-blue-200 dark:fill-blue-700" />
        <text x="326" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Traps tiny</text>
        <text x="326" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">particles</text>

        {/* Arrow 3→4 */}
        <line x1="382" y1="90" x2="402" y2="90" className="stroke-blue-400" strokeWidth="2" markerEnd="url(#hydro-arr)" />

        {/* Step 4: Disinfection */}
        <rect x="406" y="40" width="105" height="100" rx="6" className="fill-green-100 dark:fill-green-900/40" stroke="#22c55e" strokeWidth="1.5" />
        <text x="458" y="58" textAnchor="middle" className="fill-green-700 dark:fill-green-200" fontSize="10" fontWeight="bold">4. Disinfect</text>
        {/* UV / Chlorine symbol */}
        <circle cx="458" cy="90" r="20" className="fill-green-200 dark:fill-green-800" stroke="#16a34a" strokeWidth="1.5" />
        <text x="458" y="87" textAnchor="middle" className="fill-green-700 dark:fill-green-200" fontSize="11">Cl₂</text>
        <text x="458" y="100" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontSize="10">or UV</text>
        <text x="458" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Kills bacteria</text>
        <text x="458" y="135" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">and viruses</text>

        {/* Result */}
        <rect x="140" y="160" width="240" height="35" rx="8" className="fill-blue-50 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="260" y="182" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="11" fontWeight="bold">
          💧 Clean, safe drinking water
        </text>

        {/* Try-this box */}
        <rect x="30" y="210" width="460" height="95" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="230" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          Try This: Build a Mini Water Filter
        </text>
        <text x="50" y="248" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          1. Cut the bottom off a plastic bottle and turn it upside down
        </text>
        <text x="50" y="262" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          2. Layer: cotton ball → charcoal → sand → gravel (bottom to top)
        </text>
        <text x="50" y="276" className="fill-amber-700 dark:fill-amber-300" fontSize="10">
          3. Pour muddy water through the top and collect what drips out
        </text>
        <text x="50" y="293" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">
          ⚠ Filtered water looks clear but is NOT safe to drink without boiling or chemical treatment!
        </text>
      </svg>
    </div>
  );
}
