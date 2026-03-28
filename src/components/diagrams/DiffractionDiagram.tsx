export default function DiffractionDiagram() {
  // Generate incoming wavefronts (left side, straight lines)
  const incomingWaves = [];
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 30;
    incomingWaves.push(
      <line key={i} x1={x} y1="40" x2={x} y2="210"
        className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2" opacity={0.6 + i * 0.06} />
    );
  }

  // Generate diffracted wavefronts (right side, circular arcs)
  const diffractedWaves = [];
  const slitX = 240;
  const slitY = 125;
  for (let i = 1; i <= 5; i++) {
    const r = i * 30;
    diffractedWaves.push(
      <path key={i}
        d={`M ${slitX + r * Math.cos(Math.PI / 2.5)},${slitY - r * Math.sin(Math.PI / 2.5)} A ${r},${r} 0 0 1 ${slitX + r * Math.cos(Math.PI / 2.5)},${slitY + r * Math.sin(Math.PI / 2.5)}`}
        fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2"
        opacity={0.8 - i * 0.1} />
    );
  }

  return (
    <div className="my-4">
      <svg viewBox="0 0 450 250" className="w-full max-w-lg mx-auto" role="img" aria-label="Diffraction through a slit diagram">
        {/* Title */}
        <text x="225" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Diffraction: Waves Bending Through a Slit
        </text>

        {/* Incoming wavefronts */}
        {incomingWaves}

        {/* Direction arrow for incoming waves */}
        <line x1="30" y1="230" x2="100" y2="230" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <polygon points="100,226 112,230 100,234" className="fill-gray-500 dark:fill-gray-400" />
        <text x="70" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Incoming wave
        </text>

        {/* Barrier with slit */}
        <rect x="230" y="30" width="12" height="80" rx="2"
          className="fill-gray-600 dark:fill-gray-500" />
        <rect x="230" y="140" width="12" height="80" rx="2"
          className="fill-gray-600 dark:fill-gray-500" />

        {/* Slit gap indicator */}
        <line x1="225" y1="110" x2="225" y2="140" className="stroke-amber-500" strokeWidth="1" />
        <line x1="222" y1="110" x2="228" y2="110" className="stroke-amber-500" strokeWidth="1" />
        <line x1="222" y1="140" x2="228" y2="140" className="stroke-amber-500" strokeWidth="1" />
        <text x="215" y="128" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="10">slit</text>

        {/* Diffracted wavefronts (curved, spreading) */}
        {diffractedWaves}

        {/* Labels */}
        <text x="140" y="38" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">
          Plane wavefronts
        </text>
        <text x="360" y="38" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">
          Circular wavefronts
        </text>

        {/* Spreading arrows */}
        <path d="M 290,80 Q 330,60 370,55" fill="none" className="stroke-gray-400" strokeWidth="1" />
        <path d="M 290,170 Q 330,190 370,195" fill="none" className="stroke-gray-400" strokeWidth="1" />
        <text x="380" y="60" className="fill-gray-500 dark:fill-gray-400" fontSize="10">spreads</text>
        <text x="380" y="200" className="fill-gray-500 dark:fill-gray-400" fontSize="10">spreads</text>

        {/* Bottom note */}
        <text x="225" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Waves bend around obstacles and spread through narrow openings
        </text>
      </svg>
    </div>
  );
}
