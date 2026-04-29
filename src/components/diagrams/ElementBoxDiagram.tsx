export default function ElementBoxDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 440 337" className="w-full max-w-2xl mx-auto" role="img" aria-label="Periodic table element box for Iron">
        {/* Element box */}
        <rect x="100" y="40" width="150" height="180" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="3" />

        {/* Atomic number */}
        <text x="120" y="70" className="fill-gray-700 dark:fill-gray-200" fontSize="16" fontWeight="600">26</text>

        {/* Symbol */}
        <text x="175" y="140" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="48" fontWeight="bold">Fe</text>

        {/* Name */}
        <text x="175" y="170" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="600">Iron</text>

        {/* Atomic mass */}
        <text x="175" y="195" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="13">55.845</text>

        {/* Electron config */}
        <text x="175" y="212" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">[Ar] 3d⁶ 4s²</text>

        {/* Label lines pointing to each field */}
        {/* Atomic number label */}
        <line x1="120" y1="65" x2="55" y2="50" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <rect x="2" y="38" width="55" height="20" rx="4" className="fill-emerald-100 dark:fill-emerald-900/40" />
        <text x="29" y="52" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="600">Atomic #</text>

        {/* Symbol label */}
        <line x1="250" y1="125" x2="290" y2="110" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <rect x="275" y="98" width="55" height="20" rx="4" className="fill-blue-100 dark:fill-blue-900/40" />
        <text x="302" y="112" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">Symbol</text>

        {/* Name label */}
        <line x1="250" y1="166" x2="290" y2="155" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <rect x="275" y="143" width="68" height="20" rx="4" className="fill-violet-100 dark:fill-violet-900/40" />
        <text x="309" y="157" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="10" fontWeight="600">Element name</text>

        {/* Atomic mass label */}
        <line x1="250" y1="192" x2="290" y2="192" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <rect x="275" y="182" width="70" height="20" rx="4" className="fill-amber-100 dark:fill-amber-900/40" />
        <text x="310" y="196" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">Atomic mass</text>

        {/* Electron config label */}
        <line x1="175" y1="220" x2="175" y2="245" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <rect x="117" y="245" width="116" height="20" rx="4" className="fill-rose-100 dark:fill-rose-900/40" />
        <text x="175" y="259" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" fontSize="10" fontWeight="600">Electron configuration</text>

        {/* Category indicator */}
        <rect x="100" y="272" width="150" height="22" rx="6" className="fill-gray-200 dark:fill-gray-700" />
        <text x="175" y="287" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Transition Metal | Group 8 | Period 4</text>
      </svg>
    </div>
  );
}
