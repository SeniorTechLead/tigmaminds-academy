export default function TransverseLongitudinalDiagram() {
  const w = 500, h = 280;
  const panelTop1 = 30, panelTop2 = 160;
  const leftMargin = 60, rightMargin = 460;
  const numParticles = 20;
  const spacing = (rightMargin - leftMargin) / (numParticles - 1);

  // Transverse wave: particles displaced vertically in a sine pattern
  const transverseY = panelTop1 + 55;
  const amplitude = 30;
  const transverseParticles = Array.from({ length: numParticles }, (_, i) => {
    const x = leftMargin + i * spacing;
    const phase = (i / numParticles) * 4 * Math.PI; // 2 full wavelengths
    const dy = amplitude * Math.sin(phase);
    return { x, y: transverseY + dy, dy };
  });

  // Sine wave path for transverse
  const sinePath = Array.from({ length: 200 }, (_, i) => {
    const x = leftMargin + (i / 199) * (rightMargin - leftMargin);
    const phase = (i / 199) * 4 * Math.PI;
    const y = transverseY + amplitude * Math.sin(phase);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Longitudinal wave: particles displaced horizontally (compressed/rarefied)
  const longY = panelTop2 + 55;
  const longAmplitude = spacing * 0.4;
  const longitudinalParticles = Array.from({ length: numParticles }, (_, i) => {
    const baseX = leftMargin + i * spacing;
    const phase = (i / numParticles) * 4 * Math.PI;
    const dx = longAmplitude * Math.sin(phase);
    return { x: baseX + dx, y: longY, dx };
  });

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Comparison of transverse and longitudinal waves">
        {/* === Panel 1: Transverse wave === */}
        <text x="250" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">
          Transverse (light, rope)
        </text>

        {/* Equilibrium line */}
        <line x1={leftMargin} y1={transverseY} x2={rightMargin} y2={transverseY} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Sine wave curve */}
        <path d={sinePath} fill="none" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" opacity="0.5" />

        {/* Particles with vertical motion arrows */}
        {transverseParticles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" className="fill-indigo-500 dark:fill-indigo-400" />
            {/* Arrow showing direction of motion (perpendicular = vertical) */}
            {Math.abs(p.dy) > 3 && (
              <>
                <line
                  x1={p.x} y1={p.y + (p.dy > 0 ? 8 : -8)}
                  x2={p.x} y2={p.y + (p.dy > 0 ? 18 : -18)}
                  className="stroke-rose-500 dark:stroke-rose-400" strokeWidth="1.5"
                />
                <polygon
                  points={p.dy > 0
                    ? `${p.x - 3},${p.y + 15} ${p.x},${p.y + 20} ${p.x + 3},${p.y + 15}`
                    : `${p.x - 3},${p.y - 15} ${p.x},${p.y - 20} ${p.x + 3},${p.y - 15}`
                  }
                  className="fill-rose-500 dark:fill-rose-400"
                />
              </>
            )}
          </g>
        ))}

        {/* Wavelength annotation */}
        <text x={leftMargin + 10} y={transverseY + amplitude + 35} className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Particles move ↑↓ perpendicular to wave direction
        </text>

        {/* Wave direction arrow */}
        <line x1={rightMargin - 80} y1={panelTop1 + 110} x2={rightMargin - 20} y2={panelTop1 + 110} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
        <polygon points={`${rightMargin - 23},${panelTop1 + 107} ${rightMargin - 17},${panelTop1 + 110} ${rightMargin - 23},${panelTop1 + 113}`} className="fill-emerald-500 dark:fill-emerald-400" />
        <text x={rightMargin - 50} y={panelTop1 + 124} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">
          Wave dir.
        </text>

        {/* Divider */}
        <line x1="40" y1="145" x2="460" y2="145" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* === Panel 2: Longitudinal wave === */}
        <text x="250" y="157" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">
          Longitudinal (sound, spring)
        </text>

        {/* Center line */}
        <line x1={leftMargin} y1={longY} x2={rightMargin} y2={longY} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Particles with horizontal motion arrows */}
        {longitudinalParticles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" className="fill-amber-500 dark:fill-amber-400" />
            {/* Arrow showing horizontal motion */}
            {Math.abs(p.dx) > 2 && (
              <>
                <line
                  x1={p.x + (p.dx > 0 ? 8 : -8)} y1={p.y}
                  x2={p.x + (p.dx > 0 ? 18 : -18)} y2={p.y}
                  className="stroke-rose-500 dark:stroke-rose-400" strokeWidth="1.5"
                />
                <polygon
                  points={p.dx > 0
                    ? `${p.x + 15},${p.y - 3} ${p.x + 20},${p.y} ${p.x + 15},${p.y + 3}`
                    : `${p.x - 15},${p.y - 3} ${p.x - 20},${p.y} ${p.x - 15},${p.y + 3}`
                  }
                  className="fill-rose-500 dark:fill-rose-400"
                />
              </>
            )}
          </g>
        ))}

        {/* Compression / rarefaction labels */}
        <text x={leftMargin + 50} y={longY - 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Compression</text>
        <text x={leftMargin + 150} y={longY - 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Rarefaction</text>
        <text x={leftMargin + 250} y={longY - 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Compression</text>
        <text x={leftMargin + 350} y={longY - 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">Rarefaction</text>

        {/* Annotation */}
        <text x={leftMargin + 10} y={longY + 30} className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Particles move ←→ parallel to wave direction
        </text>

        {/* Wave direction arrow */}
        <line x1={rightMargin - 80} y1={panelTop2 + 100} x2={rightMargin - 20} y2={panelTop2 + 100} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
        <polygon points={`${rightMargin - 23},${panelTop2 + 97} ${rightMargin - 17},${panelTop2 + 100} ${rightMargin - 23},${panelTop2 + 103}`} className="fill-emerald-500 dark:fill-emerald-400" />
        <text x={rightMargin - 50} y={panelTop2 + 114} textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">
          Wave dir.
        </text>
      </svg>
    </div>
  );
}
