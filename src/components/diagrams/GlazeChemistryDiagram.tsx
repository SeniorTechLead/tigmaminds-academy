export default function GlazeChemistryDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Glaze chemistry: how glass-forming silica, flux, and colorant oxides create a ceramic coating"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-teal-600 dark:fill-teal-400">
          Glaze Chemistry: Glass on Clay
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Three ingredients melt together to form a glassy coating
        </text>

        {/* Three ingredient boxes */}
        {/* Glass Former */}
        <rect x="60" y="80" width="190" height="130" rx="10" fill="#0d9488" opacity="0.15" stroke="#0d9488" strokeWidth="1.5" />
        <text x="155" y="102" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-teal-700 dark:fill-teal-300">
          Glass Former
        </text>
        <text x="155" y="122" textAnchor="middle" fontSize="12" className="fill-teal-600 dark:fill-teal-400">
          SiO\u2082 (silica)
        </text>
        <text x="155" y="142" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Creates the glass network
        </text>
        <text x="155" y="160" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Melts at \u22481700\u00b0C alone
        </text>
        <text x="155" y="196" textAnchor="middle" fontSize="22">&#x1F52C;</text>

        {/* Flux */}
        <rect x="290" y="80" width="190" height="130" rx="10" fill="#dc2626" opacity="0.12" stroke="#dc2626" strokeWidth="1.5" />
        <text x="385" y="102" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-red-700 dark:fill-red-300">
          Flux
        </text>
        <text x="385" y="122" textAnchor="middle" fontSize="12" className="fill-red-600 dark:fill-red-400">
          Na\u2082O, K\u2082O, CaO
        </text>
        <text x="385" y="142" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Lowers melting point
        </text>
        <text x="385" y="160" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          to 900\u20131200\u00b0C
        </text>
        <text x="385" y="196" textAnchor="middle" fontSize="22">&#x1F525;</text>

        {/* Colorant */}
        <rect x="520" y="80" width="200" height="130" rx="10" fill="#7c3aed" opacity="0.12" stroke="#7c3aed" strokeWidth="1.5" />
        <text x="620" y="102" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-violet-700 dark:fill-violet-300">
          Colorant Oxides
        </text>
        <text x="620" y="122" textAnchor="middle" fontSize="12" className="fill-violet-600 dark:fill-violet-400">
          Metal oxides
        </text>
        <text x="620" y="145" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          CuO \u2192 green/blue
        </text>
        <text x="620" y="162" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          Fe\u2082O\u2083 \u2192 brown/red
        </text>
        <text x="620" y="179" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          CoO \u2192 deep blue
        </text>
        <text x="620" y="196" textAnchor="middle" fontSize="22">&#x1F3A8;</text>

        {/* Arrows down to combined result */}
        {[155, 385, 620].map((x) => (
          <line key={x} x1={x} y1="215" x2={390} y2="270" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
        ))}

        {/* Fired glaze cross-section */}
        <text x="390" y="268" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
          Cross-section of glazed pot wall
        </text>

        {/* Glaze layer */}
        <rect x="140" y="290" width="500" height="40" rx="4" fill="#67e8f9" opacity="0.6" stroke="#06b6d4" strokeWidth="1.5" />
        <text x="390" y="315" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-cyan-800 dark:fill-cyan-200">
          Glaze (glass layer) \u2014 waterproof, smooth, colored
        </text>

        {/* Interface */}
        <rect x="140" y="332" width="500" height="16" rx="2" fill="#a78bfa" opacity="0.4" />
        <text x="390" y="344" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-violet-700 dark:fill-violet-300">
          Interface zone (glaze bonds to clay)
        </text>

        {/* Clay body */}
        <rect x="140" y="350" width="500" height="55" rx="4" fill="#d97706" opacity="0.5" stroke="#92400e" strokeWidth="1.5" />
        <text x="390" y="383" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-amber-800 dark:fill-amber-200">
          Fired clay body (sintered ceramic)
        </text>

        {/* Summary */}
        <rect x="120" y="420" width="540" height="44" rx="8" className="fill-teal-50 dark:fill-teal-950" stroke="#0d9488" strokeWidth="1.5" />
        <text x="390" y="440" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-teal-700 dark:fill-teal-300">
          Glaze = glass former + flux + colorant, melted onto the pot surface
        </text>
        <text x="390" y="456" textAnchor="middle" fontSize="11" className="fill-teal-600 dark:fill-teal-400">
          It seals pores, adds color, and bonds chemically to the clay beneath
        </text>
      </svg>
    </div>
  );
}
