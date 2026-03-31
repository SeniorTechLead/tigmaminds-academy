export default function ActivityPrismDiagram() {
  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        Activity — Split Sunlight with a Glass of Water
      </p>
      <svg viewBox="0 0 580 320" className="w-full max-w-xl mx-auto">
        {/* Sun icon */}
        <circle cx="60" cy="60" r="22" fill="#fbbf24" opacity={0.2} />
        <circle cx="60" cy="60" r="14" fill="#fbbf24" opacity={0.6} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i}
              x1={60 + Math.cos(rad) * 18} y1={60 + Math.sin(rad) * 18}
              x2={60 + Math.cos(rad) * 28} y2={60 + Math.sin(rad) * 28}
              stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" opacity={0.5}
            />
          );
        })}
        <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#fbbf24">Sunlight</text>

        {/* Light beam going to glass */}
        <line x1="88" y1="60" x2="210" y2="130" stroke="#fbbf24" strokeWidth={3} opacity={0.5} />
        <line x1="88" y1="60" x2="210" y2="130" stroke="white" strokeWidth={1.5} opacity={0.3} />

        {/* Glass of water */}
        <rect x="200" y="110" width="60" height="90" rx={4} fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.4)" strokeWidth={2} />
        {/* Water level */}
        <rect x="202" y="130" width="56" height="68" rx={2} fill="rgba(56,189,248,0.15)" />
        <text x="230" y="178" textAnchor="middle" fontSize="10" fill="#38bdf8">Water</text>
        <text x="230" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">Glass</text>

        {/* Refracted rainbow exiting */}
        {[
          { color: '#ef4444', y: 122, label: 'Red' },
          { color: '#f97316', y: 130 },
          { color: '#eab308', y: 138, label: 'Yellow' },
          { color: '#22c55e', y: 146, label: 'Green' },
          { color: '#3b82f6', y: 154, label: 'Blue' },
          { color: '#8b5cf6', y: 162, label: 'Violet' },
        ].map((ray, i) => (
          <g key={i}>
            <line x1="262" y1={ray.y} x2="400" y2={ray.y + (i - 2.5) * 12}
              stroke={ray.color} strokeWidth={2.5} opacity={0.7} />
            {ray.label && (
              <text x="408" y={ray.y + (i - 2.5) * 12 + 4} fontSize="10" fill={ray.color}>{ray.label}</text>
            )}
          </g>
        ))}

        {/* White wall/paper */}
        <rect x="440" y="70" width="12" height="150" rx={3} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        <text x="470" y="145" fontSize="10" className="fill-gray-400 dark:fill-gray-400" textAnchor="start">White</text>
        <text x="470" y="158" fontSize="10" className="fill-gray-400 dark:fill-gray-400" textAnchor="start">paper</text>

        {/* Rainbow on paper */}
        {[
          { color: '#ef4444', y: 96 },
          { color: '#f97316', y: 106 },
          { color: '#eab308', y: 116 },
          { color: '#22c55e', y: 126 },
          { color: '#3b82f6', y: 136 },
          { color: '#8b5cf6', y: 146 },
        ].map((band, i) => (
          <rect key={i} x="441" y={band.y} width="10" height="12" fill={band.color} opacity={0.6} />
        ))}

        {/* Steps */}
        {[
          { n: '1', text: 'Fill a clear glass with water', y: 245 },
          { n: '2', text: 'Hold it in a beam of sunlight', y: 265 },
          { n: '3', text: 'Place white paper behind the glass', y: 285 },
          { n: '4', text: 'Tilt slowly until a rainbow appears', y: 305 },
        ].map((step, i) => (
          <g key={i}>
            <circle cx="45" cy={step.y} r="10" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth={1} />
            <text x="45" y={step.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fbbf24">{step.n}</text>
            <text x="65" y={step.y + 4} fontSize="11" className="fill-gray-400 dark:fill-gray-400">{step.text}</text>
          </g>
        ))}

        {/* Question prompt */}
        <rect x="310" y="240" width="250" height="56" rx={8} fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth={1} />
        <text x="435" y="258" textAnchor="middle" fontSize="10" fontWeight="700" fill="#22c55e">
          Questions to answer:
        </text>
        <text x="435" y="273" textAnchor="middle" fontSize="10" fill="#86efac">
          Which colour band is widest?
        </text>
        <text x="435" y="288" textAnchor="middle" fontSize="10" fill="#86efac">
          Which bends the most? The least?
        </text>
      </svg>
    </div>
  );
}
