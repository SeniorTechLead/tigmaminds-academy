export default function MusicDecibelDiagram() {
  const levels = [
    { db: 0, label: 'Hearing threshold', color: '#6ee7b7', y: 320 },
    { db: 20, label: 'Whisper', color: '#86efac', y: 280 },
    { db: 40, label: 'Quiet library', color: '#a3e635', y: 240 },
    { db: 60, label: 'Conversation', color: '#facc15', y: 200 },
    { db: 80, label: 'Busy traffic', color: '#fb923c', y: 160 },
    { db: 100, label: 'Dhol drum', color: '#f87171', y: 120 },
    { db: 120, label: 'Pain threshold', color: '#ef4444', y: 80 },
    { db: 140, label: 'Jet engine', color: '#dc2626', y: 40 },
  ];

  return (
    <svg
      viewBox="0 0 580 380"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Decibel scale diagram from 0 dB hearing threshold to 140 dB jet engine with animated pulsing circles"
    >
      <style>{`
        @keyframes mdPulse0 {
          0%, 100% { r: 3; opacity: 0.7; }
          50% { r: 5; opacity: 1; }
        }
        @keyframes mdPulse20 {
          0%, 100% { r: 5; opacity: 0.7; }
          50% { r: 8; opacity: 1; }
        }
        @keyframes mdPulse40 {
          0%, 100% { r: 7; opacity: 0.7; }
          50% { r: 11; opacity: 1; }
        }
        @keyframes mdPulse60 {
          0%, 100% { r: 10; opacity: 0.6; }
          50% { r: 15; opacity: 0.9; }
        }
        @keyframes mdPulse80 {
          0%, 100% { r: 14; opacity: 0.6; }
          50% { r: 20; opacity: 0.9; }
        }
        @keyframes mdPulse100 {
          0%, 100% { r: 18; opacity: 0.5; }
          50% { r: 26; opacity: 0.85; }
        }
        @keyframes mdPulse120 {
          0%, 100% { r: 22; opacity: 0.5; }
          50% { r: 32; opacity: 0.8; }
        }
        @keyframes mdPulse140 {
          0%, 100% { r: 28; opacity: 0.4; }
          50% { r: 40; opacity: 0.75; }
        }
        .md-p0   { animation: mdPulse0   1.8s ease-in-out infinite; }
        .md-p20  { animation: mdPulse20  1.6s ease-in-out infinite; }
        .md-p40  { animation: mdPulse40  1.4s ease-in-out infinite; }
        .md-p60  { animation: mdPulse60  1.2s ease-in-out infinite; }
        .md-p80  { animation: mdPulse80  1.0s ease-in-out infinite; }
        .md-p100 { animation: mdPulse100 0.85s ease-in-out infinite; }
        .md-p120 { animation: mdPulse120 0.7s ease-in-out infinite; }
        .md-p140 { animation: mdPulse140 0.55s ease-in-out infinite; }
        @keyframes mdDanger {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .md-danger-zone {
          animation: mdDanger 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <rect width="580" height="380" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="290" y="24" textAnchor="middle" className="fill-gray-300" fontSize="14" fontWeight="700">
        The Decibel Scale
      </text>
      <text x="290" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        From the softest whisper to a roaring jet engine
      </text>

      {/* Danger zone background */}
      <rect x="55" y="55" width="40" height="50" rx="4" fill="#991b1b" className="md-danger-zone" />
      <text x="75" y="108" textAnchor="middle" className="fill-red-400" fontSize="8" fontWeight="600">
        DANGER
      </text>

      {/* Safe zone label */}
      <text x="75" y="298" textAnchor="middle" className="fill-green-500" fontSize="8" fontWeight="600">
        SAFE
      </text>

      {/* Vertical scale bar */}
      <line x1="75" y1="40" x2="75" y2="330" stroke="#4b5563" strokeWidth="2" />

      {/* Gradient overlay on scale */}
      <defs>
        <linearGradient id="dbGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#facc15" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="70" y="40" width="10" height="290" fill="url(#dbGrad)" rx="3" />

      {/* Each level */}
      {levels.map((level, i) => {
        const pulseClass = `md-p${level.db}`;
        const circleX = 250;
        return (
          <g key={i}>
            {/* Tick mark on scale */}
            <line x1="65" y1={level.y} x2="85" y2={level.y} stroke={level.color} strokeWidth="1.5" />

            {/* dB label */}
            <text x="55" y={level.y + 4} textAnchor="end" fill={level.color} fontSize="11" fontWeight="600">
              {level.db} dB
            </text>

            {/* Connector line */}
            <line x1="85" y1={level.y} x2={circleX - 45} y2={level.y} stroke="#374151" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Pulsing circle */}
            <circle cx={circleX} cy={level.y} className={pulseClass} fill={level.color} />

            {/* Sound label */}
            <text x={circleX + 50} y={level.y + 4} className="fill-gray-300" fontSize="11">
              {level.label}
            </text>

            {/* Description */}
            {level.db === 60 && (
              <text x={circleX + 50} y={level.y + 17} className="fill-gray-500" fontSize="9">
                Normal talking, ~1 m away
              </text>
            )}
            {level.db === 100 && (
              <text x={circleX + 50} y={level.y + 17} className="fill-gray-500" fontSize="9">
                Bihu celebration up close
              </text>
            )}
            {level.db === 120 && (
              <text x={circleX + 50} y={level.y + 17} className="fill-gray-500" fontSize="9">
                Sustained exposure damages hearing
              </text>
            )}
          </g>
        );
      })}

      {/* Logarithmic note */}
      <rect x="370" y="280" width="190" height="75" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="465" y="298" textAnchor="middle" className="fill-gray-400" fontSize="10" fontWeight="600">
        Logarithmic scale
      </text>
      <text x="465" y="314" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Every +10 dB sounds
      </text>
      <text x="465" y="328" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="700">
        roughly 2x louder
      </text>
      <text x="465" y="344" textAnchor="middle" className="fill-gray-500" fontSize="10">
        but carries 10x more energy
      </text>
    </svg>
  );
}
