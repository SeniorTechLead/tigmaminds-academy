export default function BanyanPhotosynthesisDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 395" className="w-full max-w-lg mx-auto" role="img" aria-label="Photosynthesis in a banyan leaf showing sunlight, CO2, and water converting to glucose and oxygen">
        <rect width="500" height="360" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Photosynthesis in a Banyan Leaf</text>

        {/* Sun */}
        <circle cx="420" cy="70" r="28" className="fill-yellow-400" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={angle}
              x1={420 + Math.cos(rad) * 33} y1={70 + Math.sin(rad) * 33}
              x2={420 + Math.cos(rad) * 45} y2={70 + Math.sin(rad) * 45}
              className="stroke-yellow-400" strokeWidth="2" strokeLinecap="round" />
          );
        })}
        <text x="420" y="74" textAnchor="middle" className="fill-yellow-900" fontSize="9" fontWeight="bold">Sunlight</text>

        {/* Light rays to leaf */}
        <line x1="392" y1="90" x2="300" y2="150" className="stroke-yellow-400" strokeWidth="1.5" strokeDasharray="6,4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
        </line>
        <text x="355" y="115" className="fill-yellow-400" fontSize="9" transform="rotate(-28, 355, 115)">Light energy</text>

        {/* Leaf cross-section */}
        <path d="M 120,140 Q 250,90 380,140 Q 320,230 250,260 Q 180,230 120,140 Z"
          className="fill-green-600" opacity="0.85" />
        {/* Leaf veins */}
        <path d="M 250,130 L 250,260" className="stroke-green-300" strokeWidth="1.5" />
        <path d="M 250,160 L 185,145 M 250,180 L 320,168 M 250,200 L 185,195 M 250,220 L 315,212"
          className="stroke-green-300" strokeWidth="1" />
        {/* Chloroplast label */}
        <rect x="210" y="170" width="80" height="24" rx="12" className="fill-green-800" opacity="0.7" />
        <text x="250" y="186" textAnchor="middle" className="fill-green-200" fontSize="10" fontWeight="bold">Chloroplasts</text>

        {/* CO2 input */}
        <rect x="20" y="135" width="65" height="28" rx="14" className="fill-slate-700" />
        <text x="52" y="153" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">CO₂</text>
        <text x="52" y="128" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">from air</text>
        <line x1="85" y1="149" x2="120" y2="155" className="stroke-slate-400" strokeWidth="1.5" markerEnd="url(#banyanPhotoArrow)">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
        </line>

        {/* Water input */}
        <rect x="20" y="220" width="65" height="28" rx="14" className="fill-blue-900" />
        <text x="52" y="238" textAnchor="middle" className="fill-blue-300" fontSize="10" fontWeight="600">H₂O</text>
        <text x="52" y="260" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">from roots</text>
        <line x1="85" y1="234" x2="130" y2="210" className="stroke-blue-400" strokeWidth="1.5" markerEnd="url(#banyanPhotoArrow)" />

        {/* O2 output */}
        <line x1="370" y1="180" x2="410" y2="175" className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#banyanPhotoArrowSky)" />
        <rect x="410" y="160" width="60" height="28" rx="14" className="fill-sky-900" />
        <text x="440" y="178" textAnchor="middle" className="fill-sky-300" fontSize="10" fontWeight="600">O₂</text>
        <text x="440" y="198" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">released</text>

        {/* Glucose output */}
        <line x1="290" y1="250" x2="330" y2="280" className="stroke-amber-400" strokeWidth="1.5" markerEnd="url(#banyanPhotoArrowAmber)" />
        <rect x="310" y="275" width="85" height="28" rx="14" className="fill-amber-900" />
        <text x="352" y="293" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="600">C₆H₁₂O₆</text>
        <text x="352" y="313" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">glucose (sugar)</text>

        {/* Equation */}
        <text x="250" y="345" textAnchor="middle" className="fill-green-300" fontSize="10" fontWeight="600">
          6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="banyanPhotoArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-slate-400" />
          </marker>
          <marker id="banyanPhotoArrowSky" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-sky-400" />
          </marker>
          <marker id="banyanPhotoArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
