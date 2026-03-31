export default function MusicalWavesDiagram() {
  // Generate a sine wave path string within a tube
  // yCenter: vertical center of the wave, halfHeight: amplitude, wavelengths: how many half-waves fit
  const standingWave = (
    xStart: number,
    tubeHeight: number,
    yTop: number,
    halfWaves: number,
    color: string,
    animId: string,
  ) => {
    const points = 120;
    const pts = Array.from({ length: points + 1 }, (_, i) => {
      const t = i / points;
      const x = xStart;
      const y = yTop + t * tubeHeight;
      const amplitude = 18 * Math.sin(Math.PI * halfWaves * t);
      return { x: x + amplitude, y };
    });
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return (
      <g key={animId}>
        <style>{`
          @keyframes ${animId} {
            0%   { transform: scaleX(1); }
            50%  { transform: scaleX(-1); }
            100% { transform: scaleX(1); }
          }
          .${animId} {
            animation: ${animId} 1.2s ease-in-out infinite;
            transform-origin: ${xStart}px ${yTop + tubeHeight / 2}px;
          }
        `}</style>
        <path className={animId} d={d} fill="none" stroke={color} strokeWidth="2.5" />
      </g>
    );
  };

  // Tube dimensions
  const tubes = [
    { label: 'Low pitch', height: 140, freq: '~262 Hz', x: 80, halfWaves: 1 },
    { label: 'Medium pitch', height: 100, freq: '~392 Hz', x: 200, halfWaves: 1 },
    { label: 'High pitch', height: 65, freq: '~523 Hz', x: 320, halfWaves: 1 },
  ];
  const tubeWidth = 50;
  const tubeBottom = 185;

  // Harmonics section
  const harmonicTube = { x: 470, height: 140, width: 60 };
  const harmonicTop = tubeBottom - harmonicTube.height;
  const harmonicColors = [
    { halfWaves: 1, color: '#34d399', label: '1st (fundamental)' },
    { halfWaves: 2, color: '#60a5fa', label: '2nd harmonic' },
    { halfWaves: 3, color: '#f472b6', label: '3rd harmonic' },
  ];

  return (
    <svg
      viewBox="0 0 630 333"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Diagram showing how tube length determines musical pitch, with standing waves and harmonics"
    >
      {/* Background */}
      <rect width="600" height="300" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="210" y="22" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        Tube Length and Pitch
      </text>
      <text x="470" y="22" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        Harmonics
      </text>

      {/* === Three tubes with standing waves === */}
      {tubes.map((tube, idx) => {
        const yTop = tubeBottom - tube.height;
        const xLeft = tube.x - tubeWidth / 2;
        return (
          <g key={idx}>
            {/* Tube body (brown bamboo rectangle) */}
            <rect
              x={xLeft}
              y={yTop}
              width={tubeWidth}
              height={tube.height}
              rx="4"
              fill="#92400e"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Bamboo segment lines */}
            {Array.from({ length: Math.floor(tube.height / 30) }, (_, si) => (
              <line
                key={si}
                x1={xLeft + 2}
                y1={yTop + 25 + si * 30}
                x2={xLeft + tubeWidth - 2}
                y2={yTop + 25 + si * 30}
                stroke="#a16207"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            {/* Open top indicator */}
            <line x1={xLeft - 4} y1={yTop} x2={xLeft + tubeWidth + 4} y2={yTop} stroke="#d97706" strokeWidth="2" />
            {/* Closed bottom indicator */}
            <rect x={xLeft - 2} y={tubeBottom - 3} width={tubeWidth + 4} height="6" rx="2" fill="#78350f" />

            {/* Standing wave inside tube */}
            {standingWave(tube.x, tube.height - 8, yTop + 4, tube.halfWaves, '#34d399', `wave${idx}`)}

            {/* Pitch label */}
            <text x={tube.x} y={tubeBottom + 18} textAnchor="middle" className="fill-emerald-400" fontSize="11" fontWeight="600">
              {tube.label}
            </text>
            {/* Frequency */}
            <text x={tube.x} y={tubeBottom + 32} textAnchor="middle" className="fill-gray-500" fontSize="9">
              {tube.freq}
            </text>
          </g>
        );
      })}

      {/* Wavelength annotation between first two tubes */}
      <line x1={80} y1={tubeBottom + 44} x2={200} y2={tubeBottom + 44} stroke="#6b7280" strokeWidth="1" />
      <text x={140} y={tubeBottom + 58} textAnchor="middle" className="fill-gray-500" fontSize="9">
        shorter tube = higher pitch
      </text>
      <path d="M90,{tubeBottom + 44} L80,{tubeBottom + 41} L80,{tubeBottom + 47}Z" className="fill-gray-500 dark:fill-gray-500" />

      {/* Divider */}
      <line x1="390" y1="30" x2="390" y2="280" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

      {/* === Harmonics section: one tube with 3 overlaid wave patterns === */}
      <g>
        {/* Tube */}
        <rect
          x={harmonicTube.x - harmonicTube.width / 2}
          y={harmonicTop}
          width={harmonicTube.width}
          height={harmonicTube.height}
          rx="4"
          fill="#92400e"
          stroke="#b45309"
          strokeWidth="1.5"
        />
        {/* Bamboo segments */}
        {[0, 1, 2, 3].map((si) => (
          <line
            key={si}
            x1={harmonicTube.x - harmonicTube.width / 2 + 2}
            y1={harmonicTop + 25 + si * 30}
            x2={harmonicTube.x + harmonicTube.width / 2 - 2}
            y2={harmonicTop + 25 + si * 30}
            stroke="#a16207"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {/* Open top */}
        <line
          x1={harmonicTube.x - harmonicTube.width / 2 - 4}
          y1={harmonicTop}
          x2={harmonicTube.x + harmonicTube.width / 2 + 4}
          y2={harmonicTop}
          stroke="#d97706"
          strokeWidth="2"
        />
        {/* Closed bottom */}
        <rect
          x={harmonicTube.x - harmonicTube.width / 2 - 2}
          y={tubeBottom - 3}
          width={harmonicTube.width + 4}
          height="6"
          rx="2"
          fill="#78350f"
        />

        {/* Three harmonics overlaid */}
        {harmonicColors.map((h, i) =>
          standingWave(
            harmonicTube.x,
            harmonicTube.height - 8,
            harmonicTop + 4,
            h.halfWaves,
            h.color,
            `harmonic${i}`,
          ),
        )}
      </g>

      {/* Harmonics legend */}
      {harmonicColors.map((h, i) => (
        <g key={i}>
          <line
            x1="410"
            y1={tubeBottom + 14 + i * 18}
            x2="430"
            y2={tubeBottom + 14 + i * 18}
            stroke={h.color}
            strokeWidth="3"
          />
          <text x="436" y={tubeBottom + 18 + i * 18} className="fill-gray-600 dark:fill-gray-300" fontSize="10">
            {h.label}
          </text>
        </g>
      ))}

      {/* Bottom note */}
      <rect x="30" y="268" width="340" height="22" rx="5" className="fill-gray-800" stroke="#374151" strokeWidth="1" />
      <text x="200" y="283" textAnchor="middle" className="fill-amber-400" fontSize="10" fontFamily="monospace" fontWeight="600">
        frequency = speed of sound / (2 x tube length)
      </text>
    </svg>
  );
}
