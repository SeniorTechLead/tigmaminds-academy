export default function HeartDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 420 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Human heart cross-section diagram">
        <defs>
          <marker id="heart-arrow-red" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#dc2626" />
          </marker>
          <marker id="heart-arrow-blue" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#2563eb" />
          </marker>
          <marker id="heart-arrow-label" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Title */}
        <text x="210" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">The Human Heart</text>

        {/* Outer heart shape */}
        <path d="M 210,360 C 100,320 30,230 50,150 C 60,100 100,70 145,70 C 180,70 200,90 210,110
                 C 220,90 240,70 275,70 C 320,70 360,100 370,150 C 390,230 320,320 210,360 Z"
          className="fill-rose-100 dark:fill-rose-950" stroke="#be123c" strokeWidth="3" />

        {/* Septum (dividing wall) */}
        <line x1="210" y1="100" x2="210" y2="340" stroke="#be123c" strokeWidth="3" />

        {/* Horizontal division (between atria and ventricles) */}
        <path d="M 80,200 Q 145,215 210,200 Q 275,215 340,200" fill="none" stroke="#be123c" strokeWidth="2" />

        {/* ---- LEFT SIDE (viewer's left = anatomical right = deoxygenated) ---- */}

        {/* Right atrium (top-left in viewer perspective) */}
        <rect x="85" y="115" width="110" height="70" rx="8" className="fill-blue-300 dark:fill-blue-700" opacity="0.6" />
        <text x="140" y="148" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="11" fontWeight="bold">Right</text>
        <text x="140" y="162" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="11" fontWeight="bold">Atrium</text>

        {/* Right ventricle (bottom-left) */}
        <rect x="85" y="220" width="110" height="100" rx="8" className="fill-blue-300 dark:fill-blue-700" opacity="0.6" />
        <text x="140" y="268" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="11" fontWeight="bold">Right</text>
        <text x="140" y="282" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100" fontSize="11" fontWeight="bold">Ventricle</text>

        {/* ---- RIGHT SIDE (viewer's right = anatomical left = oxygenated) ---- */}

        {/* Left atrium (top-right) */}
        <rect x="225" y="115" width="110" height="70" rx="8" className="fill-red-300 dark:fill-red-700" opacity="0.6" />
        <text x="280" y="148" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="11" fontWeight="bold">Left</text>
        <text x="280" y="162" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="11" fontWeight="bold">Atrium</text>

        {/* Left ventricle (bottom-right) */}
        <rect x="225" y="220" width="110" height="100" rx="8" className="fill-red-300 dark:fill-red-700" opacity="0.6" />
        <text x="280" y="268" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="11" fontWeight="bold">Left</text>
        <text x="280" y="282" textAnchor="middle" className="fill-red-900 dark:fill-red-100" fontSize="11" fontWeight="bold">Ventricle</text>

        {/* ---- VALVES ---- */}

        {/* Tricuspid valve (between RA and RV) */}
        <path d="M 115,205 L 140,215 L 165,205" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <text x="140" y="200" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10">Tricuspid</text>

        {/* Mitral/bicuspid valve (between LA and LV) */}
        <path d="M 255,205 L 280,215 L 305,205" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <text x="280" y="200" textAnchor="middle" className="fill-purple-700 dark:fill-purple-300" fontSize="10">Mitral</text>

        {/* ---- BLOOD VESSELS ---- */}

        {/* Superior vena cava (entering RA from top, blue) */}
        <path d="M 60,40 L 60,70 Q 60,95 85,110" fill="none" stroke="#2563eb" strokeWidth="4" />
        <text x="15" y="38" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">Superior</text>
        <text x="15" y="49" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">vena cava</text>

        {/* Inferior vena cava (entering RA from bottom, blue) */}
        <path d="M 70,380 L 70,350 Q 70,330 95,318" fill="none" stroke="#2563eb" strokeWidth="4" />
        <text x="15" y="385" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">Inferior</text>
        <text x="15" y="396" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">vena cava</text>

        {/* Pulmonary artery (leaving RV to lungs, blue) */}
        <path d="M 120,220 Q 105,100 130,60 L 160,45" fill="none" stroke="#2563eb" strokeWidth="4" />
        <text x="130" y="42" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">Pulmonary</text>
        <text x="130" y="53" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="600">artery</text>

        {/* Pulmonary vein (entering LA from lungs, red) */}
        <path d="M 370,55 L 340,70 Q 340,95 335,115" fill="none" stroke="#dc2626" strokeWidth="4" />
        <text x="355" y="42" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="600">Pulmonary</text>
        <text x="355" y="53" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="600">vein</text>

        {/* Aorta (leaving LV, red) */}
        <path d="M 280,220 Q 300,120 290,70 L 260,48" fill="none" stroke="#dc2626" strokeWidth="5" />
        <text x="250" y="42" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="600">Aorta</text>

        {/* ---- BLOOD FLOW ARROWS ---- */}

        {/* Into RA */}
        <path d="M 95,130 L 125,140" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* RA to RV */}
        <path d="M 140,185 L 140,230" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* RV out to pulmonary artery */}
        <path d="M 125,235 L 112,180" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#heart-arrow-blue)" />

        {/* Into LA */}
        <path d="M 325,130 L 300,140" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* LA to LV */}
        <path d="M 280,185 L 280,230" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* LV out to aorta */}
        <path d="M 290,235 L 295,180" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#heart-arrow-red)" />

        {/* Legend */}
        <g transform="translate(5, 10)">
          <rect x="0" y="0" width="10" height="10" fill="#2563eb" rx="2" />
          <text x="14" y="9" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Deoxygenated</text>
          <rect x="105" y="0" width="10" height="10" fill="#dc2626" rx="2" />
          <text x="119" y="9" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Oxygenated</text>
        </g>
      </svg>
    </div>
  );
}
