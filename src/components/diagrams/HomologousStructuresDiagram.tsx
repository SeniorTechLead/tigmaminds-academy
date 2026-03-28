export default function HomologousStructuresDiagram() {
  /* Bone colors consistent across all four limbs */
  const humerusClass = 'fill-red-400 dark:fill-red-500';
  const radiusClass = 'fill-blue-400 dark:fill-blue-500';
  const ulnaClass = 'fill-green-400 dark:fill-green-500';
  const carpalsClass = 'fill-amber-300 dark:fill-amber-500';
  const digitsClass = 'fill-purple-300 dark:fill-purple-500';

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 250" className="w-full max-w-xl mx-auto" role="img" aria-label="Homologous structures in four vertebrate forelimbs">
        {/* Title */}
        <text x="270" y="16" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Homologous Structures — Same Bones, Different Functions</text>

        {/* === 1. Human Arm === */}
        <g>
          <text x="70" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Human</text>
          {/* Humerus */}
          <rect x="60" y="48" width="18" height="50" rx="5" className={humerusClass} />
          {/* Radius */}
          <rect x="55" y="102" width="12" height="45" rx="4" className={radiusClass} />
          {/* Ulna */}
          <rect x="72" y="102" width="12" height="45" rx="4" className={ulnaClass} />
          {/* Carpals */}
          <rect x="52" y="150" width="35" height="12" rx="3" className={carpalsClass} />
          {/* Digits (fingers) */}
          {[52, 60, 68, 76, 84].map((x, i) => (
            <rect key={i} x={x} y={165} width="5" height="25" rx="2" className={digitsClass} />
          ))}
          <text x="70" y="203" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Grasping</text>
        </g>

        {/* === 2. Whale Flipper === */}
        <g>
          <text x="200" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Whale</text>
          {/* Flipper outline */}
          <path d="M 180,45 Q 175,100 170,130 Q 165,160 180,185 Q 200,195 220,185 Q 230,160 225,130 Q 222,100 218,45 Z"
            className="fill-gray-100 dark:fill-gray-800" stroke="#9ca3af" strokeWidth="1" />
          {/* Humerus (short) */}
          <rect x="192" y="50" width="16" height="25" rx="5" className={humerusClass} />
          {/* Radius */}
          <rect x="186" y="78" width="12" height="30" rx="4" className={radiusClass} />
          {/* Ulna */}
          <rect x="202" y="78" width="12" height="30" rx="4" className={ulnaClass} />
          {/* Carpals */}
          <rect x="183" y="112" width="35" height="10" rx="3" className={carpalsClass} />
          {/* Digits (elongated for flipper) */}
          {[183, 191, 199, 207, 215].map((x, i) => (
            <rect key={i} x={x} y={125} width="5" height="50" rx="2" className={digitsClass} />
          ))}
          <text x="200" y="203" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Swimming</text>
        </g>

        {/* === 3. Bat Wing === */}
        <g>
          <text x="340" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Bat</text>
          {/* Humerus */}
          <rect x="332" y="48" width="14" height="35" rx="5" className={humerusClass} />
          {/* Radius */}
          <rect x="328" y="86" width="10" height="30" rx="4" className={radiusClass} />
          {/* Ulna */}
          <rect x="342" y="86" width="10" height="30" rx="4" className={ulnaClass} />
          {/* Carpals */}
          <rect x="325" y="118" width="30" height="8" rx="3" className={carpalsClass} />
          {/* Wing membrane + elongated digits */}
          <path d="M 325,128 L 290,95 L 300,90 L 330,125 Z" className="fill-amber-100 dark:fill-amber-900" opacity="0.5" stroke="#d97706" strokeWidth="0.5" />
          <path d="M 335,128 L 310,70 L 318,68 L 340,125 Z" className="fill-amber-100 dark:fill-amber-900" opacity="0.5" stroke="#d97706" strokeWidth="0.5" />
          <path d="M 345,128 L 360,70 L 367,72 L 352,125 Z" className="fill-amber-100 dark:fill-amber-900" opacity="0.5" stroke="#d97706" strokeWidth="0.5" />
          <path d="M 350,128 L 385,95 L 390,100 L 355,130 Z" className="fill-amber-100 dark:fill-amber-900" opacity="0.5" stroke="#d97706" strokeWidth="0.5" />
          {/* Digit bones */}
          <line x1="327" y1="128" x2="295" y2="92" className={`stroke-purple-400 dark:stroke-purple-500`} strokeWidth="3" strokeLinecap="round" />
          <line x1="337" y1="128" x2="314" y2="69" className={`stroke-purple-400 dark:stroke-purple-500`} strokeWidth="3" strokeLinecap="round" />
          <line x1="347" y1="128" x2="363" y2="71" className={`stroke-purple-400 dark:stroke-purple-500`} strokeWidth="3" strokeLinecap="round" />
          <line x1="352" y1="128" x2="387" y2="97" className={`stroke-purple-400 dark:stroke-purple-500`} strokeWidth="3" strokeLinecap="round" />
          <text x="340" y="203" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Flying</text>
        </g>

        {/* === 4. Horse Leg === */}
        <g>
          <text x="480" y="38" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">Horse</text>
          {/* Humerus */}
          <rect x="473" y="48" width="16" height="40" rx="5" className={humerusClass} />
          {/* Radius */}
          <rect x="471" y="92" width="11" height="40" rx="4" className={radiusClass} />
          {/* Ulna (fused, thin) */}
          <rect x="484" y="92" width="8" height="40" rx="4" className={ulnaClass} />
          {/* Carpals */}
          <rect x="472" y="136" width="18" height="10" rx="3" className={carpalsClass} />
          {/* Single digit (hoof) */}
          <rect x="474" y="149" width="14" height="35" rx="3" className={digitsClass} />
          {/* Hoof */}
          <path d="M 472,184 Q 481,192 490,184" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" fill="none" />
          <text x="480" y="203" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Running</text>
        </g>

        {/* Color Legend */}
        <rect x="30" y="218" width="14" height="10" rx="2" className={humerusClass} />
        <text x="48" y="227" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Humerus</text>

        <rect x="110" y="218" width="14" height="10" rx="2" className={radiusClass} />
        <text x="128" y="227" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Radius</text>

        <rect x="185" y="218" width="14" height="10" rx="2" className={ulnaClass} />
        <text x="203" y="227" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Ulna</text>

        <rect x="245" y="218" width="14" height="10" rx="2" className={carpalsClass} />
        <text x="263" y="227" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Carpals</text>

        <rect x="318" y="218" width="14" height="10" rx="2" className={digitsClass} />
        <text x="336" y="227" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Digits</text>

        <text x="270" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Same ancestral bones adapted for different functions — evidence of common descent</text>
      </svg>
    </div>
  );
}
