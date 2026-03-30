export default function HeartDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 520" className="w-full max-w-lg mx-auto" role="img" aria-label="Human heart cross-section diagram showing four chambers, valves, and blood flow">
        <defs>
          <marker id="heart-arrow-red" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#dc2626" />
          </marker>
          <marker id="heart-arrow-blue" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#2563eb" />
          </marker>
        </defs>

        {/* Title */}
        <text x="280" y="24" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="15" fontWeight="bold">The Human Heart</text>
        <text x="280" y="42" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Cross-section showing blood flow</text>

        {/* Legend */}
        <g transform="translate(165, 54)">
          <rect x="0" y="0" width="12" height="12" fill="#2563eb" rx="2" />
          <text x="16" y="10" className="fill-gray-600 dark:fill-gray-300" fontSize="11">Deoxygenated</text>
          <rect x="120" y="0" width="12" height="12" fill="#dc2626" rx="2" />
          <text x="136" y="10" className="fill-gray-600 dark:fill-gray-300" fontSize="11">Oxygenated</text>
        </g>

        {/* Outer heart shape — centered */}
        <path d="M 280,440 C 160,395 75,295 95,210 C 105,155 150,120 200,120 C 238,120 260,142 280,165
                 C 300,142 322,120 360,120 C 410,120 455,155 465,210 C 485,295 400,395 280,440 Z"
          className="fill-rose-100 dark:fill-rose-950" stroke="#be123c" strokeWidth="3" />

        {/* Septum */}
        <line x1="280" y1="155" x2="280" y2="415" stroke="#be123c" strokeWidth="3" />

        {/* Horizontal division */}
        <path d="M 130,265 Q 205,282 280,265 Q 355,282 430,265" fill="none" stroke="#be123c" strokeWidth="2" />

        {/* ---- RIGHT SIDE (viewer's left = deoxygenated) ---- */}

        {/* Right atrium */}
        <rect x="145" y="175" width="120" height="75" rx="10" className="fill-blue-200 dark:fill-blue-800" opacity="0.7" />
        <text x="205" y="210" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="12" fontWeight="bold">Right</text>
        <text x="205" y="226" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="12" fontWeight="bold">Atrium</text>

        {/* Right ventricle */}
        <rect x="145" y="290" width="120" height="105" rx="10" className="fill-blue-200 dark:fill-blue-800" opacity="0.7" />
        <text x="205" y="340" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="12" fontWeight="bold">Right</text>
        <text x="205" y="356" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="12" fontWeight="bold">Ventricle</text>

        {/* ---- LEFT SIDE (viewer's right = oxygenated) ---- */}

        {/* Left atrium */}
        <rect x="295" y="175" width="120" height="75" rx="10" className="fill-red-200 dark:fill-red-800" opacity="0.7" />
        <text x="355" y="210" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="12" fontWeight="bold">Left</text>
        <text x="355" y="226" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="12" fontWeight="bold">Atrium</text>

        {/* Left ventricle */}
        <rect x="295" y="290" width="120" height="105" rx="10" className="fill-red-200 dark:fill-red-800" opacity="0.7" />
        <text x="355" y="340" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="12" fontWeight="bold">Left</text>
        <text x="355" y="356" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="12" fontWeight="bold">Ventricle</text>

        {/* ---- VALVES ---- */}

        {/* Tricuspid valve */}
        <path d="M 175,270 L 205,282 L 235,270" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <text x="205" y="262" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="600">Tricuspid</text>

        {/* Mitral valve */}
        <path d="M 325,270 L 355,282 L 385,270" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <text x="355" y="262" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10" fontWeight="600">Mitral</text>

        {/* ---- BLOOD VESSELS (labels outside the heart) ---- */}

        {/* Superior vena cava */}
        <path d="M 120,90 L 120,130 Q 120,160 155,178" fill="none" stroke="#2563eb" strokeWidth="5" />
        <text x="45" y="82" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">Superior</text>
        <text x="45" y="96" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">vena cava</text>

        {/* Inferior vena cava */}
        <path d="M 130,460 L 130,425 Q 130,405 158,393" fill="none" stroke="#2563eb" strokeWidth="5" />
        <text x="45" y="468" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">Inferior</text>
        <text x="45" y="482" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">vena cava</text>

        {/* Pulmonary artery */}
        <path d="M 180,290 Q 155,170 190,115 L 220,100" fill="none" stroke="#2563eb" strokeWidth="4" />
        <text x="195" y="88" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">Pulmonary artery</text>

        {/* Pulmonary vein */}
        <path d="M 460,100 L 425,120 Q 415,155 410,178" fill="none" stroke="#dc2626" strokeWidth="4" />
        <text x="440" y="88" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="600">Pulmonary</text>
        <text x="440" y="102" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="600">vein</text>

        {/* Aorta */}
        <path d="M 355,290 Q 380,180 365,125 L 335,105" fill="none" stroke="#dc2626" strokeWidth="5" />
        <text x="345" y="95" className="fill-red-700 dark:fill-red-300" fontSize="11" fontWeight="600">Aorta</text>

        {/* ---- BLOOD FLOW ARROWS ---- */}

        {/* Into RA from SVC */}
        <path d="M 158,190 L 180,200" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* RA → RV through tricuspid */}
        <path d="M 205,248 L 205,298" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* RV → pulmonary artery */}
        <path d="M 185,305 L 168,240" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* Into LA from pulmonary vein */}
        <path d="M 405,192 L 380,200" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* LA → LV through mitral */}
        <path d="M 355,248 L 355,298" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* LV → aorta */}
        <path d="M 370,305 L 378,240" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* Bottom annotation */}
        <text x="280" y="508" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="11">
          Blue = deoxygenated blood (to lungs) | Red = oxygenated blood (to body)
        </text>
      </svg>
    </div>
  );
}
