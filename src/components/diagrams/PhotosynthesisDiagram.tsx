export default function PhotosynthesisDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 320" className="w-full max-w-lg mx-auto" role="img" aria-label="Photosynthesis diagram">
        {/* Sun */}
        <circle cx="400" cy="50" r="30" className="fill-yellow-400" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={angle}
              x1={400 + Math.cos(rad) * 35} y1={50 + Math.sin(rad) * 35}
              x2={400 + Math.cos(rad) * 48} y2={50 + Math.sin(rad) * 48}
              className="stroke-yellow-400" strokeWidth="2" strokeLinecap="round" />
          );
        })}
        <text x="400" y="55" textAnchor="middle" className="fill-yellow-800" fontSize="10" fontWeight="bold">Sun</text>

        {/* Light rays hitting leaf */}
        <line x1="370" y1="70" x2="280" y2="140" className="stroke-yellow-400" strokeWidth="2" strokeDasharray="6,4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
        </line>
        <text x="340" y="100" className="fill-yellow-600 dark:fill-yellow-400" fontSize="9" transform="rotate(-30, 340, 100)">Light energy</text>

        {/* Leaf shape */}
        <path d="M 150,140 Q 250,100 350,140 Q 300,200 250,220 Q 200,200 150,140 Z"
          className="fill-emerald-400 dark:fill-emerald-500" opacity="0.8" />
        <path d="M 250,140 L 250,220" className="stroke-emerald-700 dark:stroke-emerald-300" strokeWidth="1.5" />
        <path d="M 250,160 L 200,150 M 250,175 L 300,165 M 250,190 L 200,185"
          className="stroke-emerald-700 dark:stroke-emerald-300" strokeWidth="1" />
        <text x="250" y="175" textAnchor="middle" className="fill-white dark:fill-gray-100" fontSize="11" fontWeight="bold">Leaf</text>
        <text x="250" y="190" textAnchor="middle" className="fill-emerald-100 dark:fill-emerald-300" fontSize="10">(chloroplasts)</text>

        {/* CO2 input (from air) */}
        <g>
          <rect x="30" y="130" width="70" height="30" rx="15" className="fill-gray-200 dark:fill-gray-600" />
          <text x="65" y="150" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">CO₂</text>
          <line x1="100" y1="145" x2="150" y2="155" className="stroke-gray-400" strokeWidth="1.5" markerEnd="url(#arrowhead)">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
          </line>
          <text x="60" y="125" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">from air</text>
        </g>

        {/* Water input (from roots) */}
        <g>
          <rect x="30" y="200" width="70" height="30" rx="15" className="fill-blue-200 dark:fill-blue-800" />
          <text x="65" y="220" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="600">H₂O</text>
          <line x1="100" y1="215" x2="155" y2="195" className="stroke-blue-400" strokeWidth="1.5" />
          <text x="60" y="240" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">from roots</text>
        </g>

        {/* O2 output */}
        <g>
          <line x1="350" y1="170" x2="410" y2="160" className="stroke-sky-400" strokeWidth="1.5" />
          <rect x="410" y="145" width="60" height="30" rx="15" className="fill-sky-200 dark:fill-sky-800" />
          <text x="440" y="165" textAnchor="middle" className="fill-sky-700 dark:fill-sky-200" fontSize="10" fontWeight="600">O₂</text>
          <text x="440" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">released</text>
        </g>

        {/* Sugar output */}
        <g>
          <line x1="280" y1="220" x2="320" y2="260" className="stroke-amber-400" strokeWidth="1.5" />
          <rect x="300" y="255" width="80" height="30" rx="15" className="fill-amber-200 dark:fill-amber-800" />
          <text x="340" y="275" textAnchor="middle" className="fill-amber-700 dark:fill-amber-200" fontSize="10" fontWeight="600">C₆H₁₂O₆</text>
          <text x="340" y="295" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">sugar (glucose)</text>
        </g>

        {/* Equation at bottom */}
        <text x="250" y="315" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          CO₂ + H₂O + Light → C₆H₁₂O₆ + O₂
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
