/* FishBiomechanicsDiagram – Physics of a fish jump: C-start, tail thrust, projectile motion */

export default function FishBiomechanicsDiagram() {
  // Projectile trajectory points
  const pts: string[] = [];
  const v0 = 6; // m/s
  const angle = 70 * (Math.PI / 180);
  const g = 9.81;
  const tMax = (2 * v0 * Math.sin(angle)) / g;
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * tMax;
    const px = 240 + (v0 * Math.cos(angle) * t) * 55;
    const py = 210 - (v0 * Math.sin(angle) * t - 0.5 * g * t * t) * 55;
    pts.push(`${px},${py}`);
  }
  const maxH = ((v0 * Math.sin(angle)) ** 2) / (2 * g);

  return (
    <svg
      viewBox="0 0 592 380"
      className="w-full max-w-lg mx-auto my-6"
      role="img"
      aria-label="Physics of a fish jump showing C-start muscle contraction, launch angle, and projectile trajectory"
    >
      {/* Title */}
      <text x="296" y="20" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-gray-200">
        The Physics of a Fish Jump
      </text>
      <text x="296" y="36" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">
        From C-start muscle burst to projectile arc
      </text>

      {/* LEFT: C-Start sequence */}
      <text x="110" y="58" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">
        C-Start Launch Sequence
      </text>

      {/* Phase 1: Coil */}
      <rect x="15" y="68" width="65" height="90" rx="5" className="fill-blue-50 dark:fill-blue-950" stroke="#3b82f6" strokeWidth="1" />
      <text x="47" y="82" textAnchor="middle" fontSize="8" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">1. Coil</text>
      {/* C-shape fish */}
      <path d="M30,120 C30,100 55,95 60,110 C65,125 50,140 30,120" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="118" r="3" className="fill-blue-500" />
      <text x="47" y="152" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Muscles coil</text>

      {/* Phase 2: Snap */}
      <rect x="90" y="68" width="65" height="90" rx="5" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
      <text x="122" y="82" textAnchor="middle" fontSize="8" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">2. Snap</text>
      {/* Straight fish */}
      <line x1="103" y1="130" x2="145" y2="100" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="103" cy="130" r="3" className="fill-amber-500" />
      {/* Thrust arrow */}
      <line x1="140" y1="103" x2="148" y2="92" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRedFish)" />
      <text x="155" y="90" fontSize="7" className="fill-red-500 dark:fill-red-400">Thrust</text>
      <text x="122" y="152" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Tail drives water</text>

      {/* Phase 3: Launch */}
      <rect x="165" y="68" width="65" height="90" rx="5" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="197" y="82" textAnchor="middle" fontSize="8" fontWeight="600" className="fill-green-700 dark:fill-green-300">3. Launch</text>
      {/* Fish leaving water */}
      <line x1="182" y1="140" x2="212" y2="90" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="212" cy="90" r="3" className="fill-green-500" />
      {/* Water surface */}
      <path d="M170,130 Q185,125 200,130 Q215,135 225,130" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      <text x="197" y="152" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-gray-400">Breaks surface!</text>

      {/* Newton's 3rd law note */}
      <rect x="15" y="166" width="215" height="28" rx="4" className="fill-purple-50 dark:fill-purple-950" stroke="#a855f7" strokeWidth="1" />
      <text x="122" y="183" textAnchor="middle" fontSize="8" className="fill-purple-700 dark:fill-purple-300">
        Newton’s 3rd law: tail pushes water back → water pushes fish up
      </text>

      {/* RIGHT: Projectile trajectory */}
      <text x="410" y="58" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-400">
        Projectile Motion in Air
      </text>

      {/* Water surface line */}
      <rect x="238" y="210" width="340" height="50" rx="0" fill="#3b82f620" />
      <line x1="238" y1="210" x2="578" y2="210" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="550" y="230" textAnchor="end" fontSize="8" className="fill-blue-500 dark:fill-blue-400">
        Water surface
      </text>

      {/* Trajectory arc */}
      <polyline points={pts.join(' ')} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,3" />

      {/* Launch angle */}
      <line x1="240" y1="210" x2="280" y2="210" stroke="#6b7280" strokeWidth="1" />
      <path d="M255,210 A15,15 0 0,0 244,198" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="260" y="202" fontSize="8" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">70°</text>

      {/* Max height indicator */}
      {(() => {
        const peakY = 210 - maxH * 55;
        const peakX = 240 + (v0 * Math.cos(angle) * (tMax / 2)) * 55;
        return (
          <g>
            <line x1={peakX} y1={210} x2={peakX} y2={peakY} stroke="#a855f7" strokeWidth="1" strokeDasharray="3,3" />
            <text x={peakX + 6} y={(210 + peakY) / 2} fontSize="8" fontWeight="600" className="fill-purple-600 dark:fill-purple-400">
              {maxH.toFixed(1)} m
            </text>
            <circle cx={peakX} cy={peakY} r="4" fill="#22c55e" opacity="0.6" />
            <text x={peakX} y={peakY - 8} textAnchor="middle" fontSize="7" className="fill-green-600 dark:fill-green-400">Peak</text>
          </g>
        );
      })()}

      {/* Velocity arrow at launch */}
      <line x1="240" y1="210" x2="255" y2="186" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRedFish)" />
      <text x="230" y="193" fontSize="7" className="fill-red-500 dark:fill-red-400">v₀ = 6 m/s</text>

      {/* Gravity arrow */}
      <text x="420" y="130" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-gray-400">g = 9.81 m/s²</text>
      <line x1="420" y1="134" x2="420" y2="155" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

      {/* Equations */}
      <rect x="240" y="268" width="338" height="55" rx="6" className="fill-gray-50 dark:fill-gray-800" stroke="#6b7280" strokeWidth="1" />
      <text x="260" y="286" fontSize="9" fontWeight="600" className="fill-gray-700 dark:fill-gray-200">Key equations:</text>
      <text x="260" y="302" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        Max height: h = v² sin²θ / 2g = 1.62 m
      </text>
      <text x="260" y="314" fontSize="8" className="fill-gray-600 dark:fill-gray-300">
        KE at surface → PE at peak: ½mv² = mgh
      </text>

      {/* Bottom summary */}
      <rect x="60" y="340" width="472" height="30" rx="5" className="fill-green-50 dark:fill-green-950" stroke="#22c55e" strokeWidth="1" />
      <text x="296" y="360" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-green-700 dark:fill-green-300">
        A 3 kg salmon at 6 m/s can clear a 1.6 m waterfall — the same energy trade-off as throwing a ball
      </text>

      <defs>
        <marker id="arrowRedFish" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
        </marker>
        <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
          <path d="M0,0 L4,6 L8,0" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
}
