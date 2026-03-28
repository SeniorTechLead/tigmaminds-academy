export default function HydroelectricDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-xl mx-auto" role="img" aria-label="Hydroelectric dam cross-section">
        <defs>
          <marker id="hydroArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="500" height="80" className="fill-sky-100 dark:fill-gray-900" />

        {/* Reservoir water */}
        <rect x="0" y="80" width="200" height="100" className="fill-blue-300 dark:fill-blue-800" opacity="0.6" />
        <text x="100" y="120" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="12" fontWeight="bold">Reservoir</text>
        <text x="100" y="138" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10">(Potential Energy)</text>

        {/* Water surface ripples */}
        <path d="M 5,80 Q 25,76 50,80 Q 75,84 100,80 Q 125,76 150,80 Q 175,84 200,80" fill="none" className="stroke-blue-400 dark:stroke-blue-600" strokeWidth="1">
          <animate attributeName="d" values="M 5,80 Q 25,76 50,80 Q 75,84 100,80 Q 125,76 150,80 Q 175,84 200,80;M 5,80 Q 25,84 50,80 Q 75,76 100,80 Q 125,84 150,80 Q 175,76 200,80;M 5,80 Q 25,76 50,80 Q 75,84 100,80 Q 125,76 150,80 Q 175,84 200,80" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Dam wall */}
        <polygon points="200,55 230,55 240,250 200,250" className="fill-gray-400 dark:fill-gray-600 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <text x="220" y="155" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="bold" transform="rotate(-5, 220, 155)">Dam</text>

        {/* Penstock (pipe) */}
        <path d="M 205,160 Q 230,180 260,200 Q 280,210 290,220" fill="none" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="10" strokeLinecap="round" />
        <path d="M 205,160 Q 230,180 260,200 Q 280,210 290,220" fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="6" strokeLinecap="round" />
        <text x="248" y="188" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600" transform="rotate(30, 248, 188)">Penstock</text>

        {/* Water flow arrows in penstock */}
        <line x1="225" y1="175" x2="250" y2="195" className="stroke-white dark:stroke-blue-200" strokeWidth="1.5" markerEnd="url(#hydroArrow)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
        </line>

        {/* Turbine */}
        <circle cx="310" cy="230" r="22" className="fill-gray-200 dark:fill-gray-700 stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={angle}
              x1={310 + Math.cos(rad) * 5} y1={230 + Math.sin(rad) * 5}
              x2={310 + Math.cos(rad) * 18} y2={230 + Math.sin(rad) * 18}
              className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from={`0 310 230`} to={`360 310 230`} dur="2s" repeatCount="indefinite" />
            </line>
          );
        })}
        <text x="310" y="262" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Turbine</text>
        <text x="310" y="274" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">(Kinetic → Mechanical)</text>

        {/* Generator */}
        <rect x="350" y="215" width="50" height="30" rx="6" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500" strokeWidth="1.5" />
        <text x="375" y="234" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Generator</text>
        <text x="375" y="258" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">(Mechanical → Electrical)</text>

        {/* Connection turbine to generator */}
        <line x1="332" y1="230" x2="350" y2="230" className="stroke-gray-400" strokeWidth="3" />

        {/* Power lines */}
        <line x1="400" y1="225" x2="490" y2="100" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        {/* Power line tower */}
        <line x1="485" y1="60" x2="485" y2="110" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="3" />
        <line x1="475" y1="70" x2="495" y2="70" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
        <line x1="475" y1="85" x2="495" y2="85" className="stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />

        <text x="460" y="55" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="600">Power lines</text>
        <text x="460" y="125" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">(Electrical Energy)</text>

        {/* Downstream water */}
        <rect x="290" y="250" width="110" height="30" className="fill-blue-200 dark:fill-blue-900" opacity="0.4" />
        <text x="345" y="292" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="9">Downstream river</text>

        {/* Energy conversion chain at bottom */}
        <rect x="10" y="290" width="390" height="0" rx="0" fill="none" />

        {/* Ground */}
        <rect x="230" y="250" width="270" height="25" className="fill-amber-200 dark:fill-amber-900" opacity="0.5" />
      </svg>
    </div>
  );
}
