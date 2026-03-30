export default function StarAtmosphereLayersDiagram() {
  const layers = [
    { name: 'Thermosphere', top: 60, h: 30, color: '#0f172a', desc: '80-500km', effect: 'Aurora, ionized gas' },
    { name: 'Mesosphere', top: 90, h: 30, color: '#1e293b', desc: '50-80km', effect: 'Meteors burn here' },
    { name: 'Stratosphere', top: 120, h: 40, color: '#1e3a5f', desc: '12-50km', effect: 'Stable, ozone layer' },
    { name: 'Troposphere', top: 160, h: 50, color: '#1e40af', desc: '0-12km', effect: 'Weather, turbulence' },
  ];

  return (
    <svg viewBox="0 0 610 343" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Atmospheric layers affecting astronomical observation">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Atmosphere & Star Observation</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">More atmosphere at horizon = worse seeing</text>

      {/* Layers */}
      {layers.map((l) => (
        <g key={l.name}>
          <rect x="120" y={l.top} width="280" height={l.h} fill={l.color} stroke="#334155" strokeWidth="0.5" />
          <text x="135" y={l.top + l.h / 2 + 4} className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">{l.name}</text>
          <text x="395" y={l.top + l.h / 2 + 1} className="fill-gray-500 dark:fill-slate-400" fontSize="8">{l.desc}</text>
          <text x="395" y={l.top + l.h / 2 + 12} className="fill-gray-400 dark:fill-slate-500" fontSize="7">{l.effect}</text>
        </g>
      ))}

      {/* Ground */}
      <rect x="120" y="210" width="280" height="15" fill="#334155" rx="0" />
      <text x="260" y="222" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Ground (Ziro Valley)</text>

      {/* Space label */}
      <text x="260" y="56" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="9">SPACE</text>

      {/* Star overhead */}
      <circle cx="260" cy="50" r="3" fill="#fef3c7" />
      {/* Vertical light path (zenith) */}
      <line x1="260" y1="53" x2="260" y2="210" stroke="#fef3c7" strokeWidth="1.5" opacity={0.5} />
      <text x="260" y="240" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">Zenith: 1× atmosphere</text>
      <text x="260" y="252" textAnchor="middle" fill="#22c55e" fontSize="8">Clearest view</text>

      {/* Star at angle (horizon) */}
      <circle cx="60" cy="50" r="3" fill="#fef3c7" />
      {/* Diagonal light path (long) */}
      <line x1="60" y1="53" x2="120" y2="210" stroke="#fca5a5" strokeWidth="1.5" opacity={0.4} />
      <text x="55" y="240" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="600">Horizon:</text>
      <text x="55" y="252" textAnchor="middle" fill="#f87171" fontSize="8">~38× atmosphere</text>

      {/* Turbulence squiggles in troposphere */}
      {[145, 170, 190, 200].map((y, i) => (
        <path key={i} d={`M${155 + i * 30},${y} q5,-4 10,0 q5,4 10,0 q5,-4 10,0`} fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity={0.4} />
      ))}
      <text x="480" y="185" textAnchor="end" fill="#f59e0b" fontSize="8">Turbulence</text>

      {/* Comparison box */}
      <rect x="40" y="265" width="440" height="35" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="280" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Tip: Observe stars when they are high in the sky</text>
      <text x="260" y="293" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Less atmosphere = less distortion, less twinkling, less dimming</text>
    </svg>
  );
}
