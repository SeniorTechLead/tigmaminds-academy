export default function CropHealthOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Crop health detector output showing classification of rice leaf images as healthy or diseased">
        <rect width="780" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f43f5e">Your Project: Crop Health Detector</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Upload a rice leaf photo → AI classifies it as healthy or diseased</text>

        {/* Input images */}
        {[
          { x: 60, label: 'Healthy', color: '#22c55e', bg: '#4ade80', conf: '94%' },
          { x: 280, label: 'Rice Blast', color: '#ef4444', bg: '#fca5a5', conf: '87%' },
          { x: 500, label: 'Brown Spot', color: '#f59e0b', bg: '#fcd34d', conf: '91%' },
        ].map((img, i) => (
          <g key={i} transform={`translate(${img.x}, 80)`}>
            <rect width="200" height="120" rx="6" fill={img.bg} opacity="0.2" stroke={img.color} strokeWidth="1.5" />
            <text x="100" y="55" textAnchor="middle" fontSize="28">{['🌿', '🍂', '🟤'][i]}</text>
            <text x="100" y="80" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Rice leaf photo</text>

            {/* Arrow down */}
            <line x1="100" y1="125" x2="100" y2="155" stroke={img.color} strokeWidth="2" />
            <polygon points="93,155 100,165 107,155" fill={img.color} />

            {/* Classification result */}
            <rect y="170" width="200" height="50" rx="6" fill={img.color} opacity="0.1" stroke={img.color} strokeWidth="1.5" />
            <text x="100" y="192" textAnchor="middle" fontSize="13" fontWeight="700" fill={img.color}>{img.label}</text>
            <text x="100" y="210" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Confidence: {img.conf}</text>
          </g>
        ))}

        {/* Bottom bar */}
        <rect x="60" y="320" width="660" height="44" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="340" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Level 4 project: train a MobileNet model on rice leaf images, then build a web interface
        </text>
        <text x="390" y="356" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Same tech used by DJI agricultural drones scanning fields across India
        </text>
      </svg>
    </div>
  );
}
