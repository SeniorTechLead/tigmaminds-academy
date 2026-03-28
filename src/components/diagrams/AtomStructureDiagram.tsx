export default function AtomStructureDiagram() {
  const cx = 200, cy = 200;
  const shell1R = 70, shell2R = 130;

  // Nucleus: 6 protons (red) and 6 neutrons (gray) packed together
  const nucleusParticles: { x: number; y: number; type: 'proton' | 'neutron' }[] = [
    { x: -8, y: -10, type: 'proton' },
    { x: 8, y: -10, type: 'neutron' },
    { x: -12, y: 4, type: 'neutron' },
    { x: 4, y: 4, type: 'proton' },
    { x: -4, y: -2, type: 'proton' },
    { x: 12, y: -2, type: 'neutron' },
    { x: 0, y: 12, type: 'proton' },
    { x: -8, y: 14, type: 'neutron' },
    { x: 8, y: 14, type: 'proton' },
    { x: -14, y: -4, type: 'neutron' },
    { x: 14, y: 6, type: 'proton' },
    { x: 0, y: -14, type: 'neutron' },
  ];

  // Electron positions evenly spaced on each shell
  const shell1Electrons = [0, 180]; // 2 electrons
  const shell2Electrons = [0, 90, 180, 270]; // 4 electrons

  return (
    <div className="my-4">
      <style>{`
        @keyframes orbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
      <svg viewBox="0 0 400 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Bohr model of a carbon atom">
        {/* Shell orbit circles */}
        <circle cx={cx} cy={cy} r={shell1R} fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="6,4" />
        <circle cx={cx} cy={cy} r={shell2R} fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="6,4" />

        {/* Nucleus particles */}
        {nucleusParticles.map((p, i) => (
          <circle key={i} cx={cx + p.x} cy={cy + p.y} r="7"
            className={p.type === 'proton' ? 'fill-red-500' : 'fill-gray-400 dark:fill-gray-500'} />
        ))}
        {nucleusParticles.filter(p => p.type === 'proton').map((p, i) => (
          <text key={`p${i}`} x={cx + p.x} y={cy + p.y + 3.5} textAnchor="middle"
            className="fill-white" fontSize="9" fontWeight="bold">+</text>
        ))}

        {/* Shell 1 electrons — animated orbit */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'orbit1 6s linear infinite' }}>
          {shell1Electrons.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={`e1-${i}`} cx={cx + Math.cos(rad) * shell1R} cy={cy + Math.sin(rad) * shell1R}
                r="6" className="fill-blue-500" />
            );
          })}
        </g>

        {/* Shell 2 electrons — animated orbit (opposite direction) */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'orbit2 10s linear infinite' }}>
          {shell2Electrons.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle key={`e2-${i}`} cx={cx + Math.cos(rad) * shell2R} cy={cy + Math.sin(rad) * shell2R}
                r="6" className="fill-blue-500" />
            );
          })}
        </g>

        {/* Labels */}
        <text x={cx} y={cy + 35} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">Nucleus</text>

        {/* Shell labels */}
        <text x={cx + shell1R + 10} y={cy - shell1R + 15} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Shell 1 (max 2)</text>
        <text x={cx + shell2R + 10} y={cy - shell2R + 15} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Shell 2 (max 8)</text>

        {/* Legend */}
        <circle cx={30} cy={365} r="6" className="fill-red-500" />
        <text x={40} y={369} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Protons (+)</text>

        <circle cx={130} cy={365} r="6" className="fill-gray-400 dark:fill-gray-500" />
        <text x={140} y={369} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Neutrons</text>

        <circle cx={230} cy={365} r="6" className="fill-blue-500" />
        <text x={240} y={369} className="fill-gray-600 dark:fill-gray-300" fontSize="10">Electrons (−)</text>

        {/* Title */}
        <text x={cx} y={20} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Carbon Atom (6 protons, 6 neutrons, 6 electrons)</text>
      </svg>
    </div>
  );
}
