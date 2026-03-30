export default function ChurningIntermolecularDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 560 240" className="w-full h-auto" role="img" aria-label="Three types of intermolecular forces: Van der Waals, dipole-dipole, and hydrogen bonds with relative strengths">
        <style>{`
          .im-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .im-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .im-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="560" height="240" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="24" textAnchor="middle" className="im-title fill-gray-700 dark:fill-gray-200">Intermolecular Forces (Weakest to Strongest)</text>

        {/* Van der Waals */}
        <rect x="20" y="45" width="160" height="130" rx="6" className="fill-gray-50 dark:fill-gray-800/50 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="100" y="63" textAnchor="middle" className="im-label fill-gray-600 dark:fill-gray-300" fontWeight="600">Van der Waals</text>
        <text x="100" y="76" textAnchor="middle" className="im-small fill-gray-500 dark:fill-gray-400">(London dispersion)</text>
        {/* Two nonpolar molecules */}
        <circle cx="70" cy="115" r="18" className="fill-gray-300 dark:fill-gray-600" />
        <circle cx="130" cy="115" r="18" className="fill-gray-300 dark:fill-gray-600" />
        <line x1="88" y1="115" x2="112" y2="115" className="stroke-gray-400" strokeWidth="1" strokeDasharray="3 3" />
        <text x="100" y="155" textAnchor="middle" className="im-small fill-gray-500 dark:fill-gray-400">Temporary dipoles</text>
        <text x="100" y="167" textAnchor="middle" className="im-small fill-red-500 dark:fill-red-400" fontWeight="600">Weak (~1 kJ/mol)</text>

        {/* Dipole-Dipole */}
        <rect x="200" y="45" width="160" height="130" rx="6" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x="280" y="63" textAnchor="middle" className="im-label fill-blue-600 dark:fill-blue-300" fontWeight="600">Dipole-Dipole</text>
        {/* Two polar molecules */}
        <circle cx="250" cy="110" r="16" className="fill-red-300 dark:fill-red-500" opacity="0.6" />
        <text x="250" y="114" textAnchor="middle" className="im-small fill-white" fontWeight="600">d-</text>
        <circle cx="270" cy="125" r="10" className="fill-blue-300 dark:fill-blue-500" opacity="0.6" />
        <text x="270" y="129" textAnchor="middle" className="im-small fill-white" fontWeight="600">d+</text>

        <circle cx="300" cy="100" r="10" className="fill-blue-300 dark:fill-blue-500" opacity="0.6" />
        <text x="300" y="104" textAnchor="middle" className="im-small fill-white" fontWeight="600">d+</text>
        <circle cx="320" cy="115" r="16" className="fill-red-300 dark:fill-red-500" opacity="0.6" />
        <text x="320" y="119" textAnchor="middle" className="im-small fill-white" fontWeight="600">d-</text>

        <line x1="278" y1="118" x2="294" y2="108" className="stroke-blue-400" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="280" y="155" textAnchor="middle" className="im-small fill-gray-500 dark:fill-gray-400">Permanent charge attraction</text>
        <text x="280" y="167" textAnchor="middle" className="im-small fill-amber-500 dark:fill-amber-400" fontWeight="600">Medium (~5 kJ/mol)</text>

        {/* Hydrogen Bonds */}
        <rect x="380" y="45" width="160" height="130" rx="6" className="fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-300 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="460" y="63" textAnchor="middle" className="im-label fill-emerald-600 dark:fill-emerald-300" fontWeight="600">Hydrogen Bond</text>
        {/* Water molecules H-bonding */}
        <circle cx="430" cy="105" r="14" className="fill-red-400" opacity="0.6" />
        <text x="430" y="109" textAnchor="middle" className="im-small fill-white" fontWeight="600">O</text>
        <circle cx="418" cy="125" r="8" className="fill-blue-300" opacity="0.7" />
        <text x="418" y="128" textAnchor="middle" className="im-small fill-white">H</text>
        <circle cx="448" cy="125" r="8" className="fill-blue-300" opacity="0.7" />
        <text x="448" y="128" textAnchor="middle" className="im-small fill-white">H</text>

        {/* H-bond dotted line */}
        <line x1="453" y1="118" x2="470" y2="108" className="stroke-emerald-500" strokeWidth="2" strokeDasharray="3 3" />

        <circle cx="485" cy="100" r="14" className="fill-red-400" opacity="0.6" />
        <text x="485" y="104" textAnchor="middle" className="im-small fill-white" fontWeight="600">O</text>
        <circle cx="500" cy="118" r="8" className="fill-blue-300" opacity="0.7" />

        <text x="460" y="155" textAnchor="middle" className="im-small fill-gray-500 dark:fill-gray-400">H bonded to O, N, or F</text>
        <text x="460" y="167" textAnchor="middle" className="im-small fill-emerald-500 dark:fill-emerald-400" fontWeight="600">Strong (~20 kJ/mol)</text>

        {/* Strength bar */}
        <defs>
          <linearGradient id="im-strength" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <rect x="60" y="195" width="440" height="8" rx="4" fill="url(#im-strength)" opacity="0.5" />
        <text x="60" y="220" className="im-small fill-gray-400">Weakest</text>
        <text x="500" y="220" textAnchor="end" className="im-small fill-emerald-500">Strongest</text>
        <text x="280" y="235" textAnchor="middle" className="im-small fill-gray-400 dark:fill-gray-500">These forces determine whether substances mix, separate, boil, or freeze</text>
      </svg>
    </div>
  );
}
