export default function PeriodicTrendsDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-lg mx-auto" role="img" aria-label="Periodic trends diagram showing atomic radius and electronegativity trends">
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Periodic Trends</text>

        {/* Table outline - simplified grid */}
        <defs>
          <linearGradient id="radiusLR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="radiusTB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="enLR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="enTB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Atomic Radius section */}
        <text x="135" y="50" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">Atomic Radius</text>

        {/* Grid with gradient */}
        <rect x="30" y="60" width="210" height="150" rx="4" fill="url(#radiusLR)" />
        <rect x="30" y="60" width="210" height="150" rx="4" fill="url(#radiusTB)" />
        <rect x="30" y="60" width="210" height="150" rx="4" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map(i => (
          <line key={`rh${i}`} x1="30" y1={60 + i * 25} x2="240" y2={60 + i * 25} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <line key={`rv${i}`} x1={30 + i * 26.25} y1="60" x2={30 + i * 26.25} y2="210" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
        ))}

        {/* Arrows */}
        <line x1="45" y1="225" x2="225" y2="225" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#ptArrowB)" />
        <text x="135" y="242" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10" fontWeight="600">Decreases →</text>

        <line x1="15" y1="75" x2="15" y2="195" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#ptArrowB)" />
        <text x="10" y="145" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10" fontWeight="600" transform="rotate(-90, 10, 145)">Increases ↓</text>

        {/* Sample atoms showing size */}
        <circle cx="56" cy="85" r="5" className="fill-blue-300 dark:fill-blue-500" opacity="0.7" />
        <circle cx="214" cy="85" r="3" className="fill-blue-300 dark:fill-blue-500" opacity="0.7" />
        <circle cx="56" cy="185" r="8" className="fill-blue-400 dark:fill-blue-500" opacity="0.7" />

        {/* Electronegativity section */}
        <text x="375" y="50" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="bold">Electronegativity</text>

        <rect x="270" y="60" width="210" height="150" rx="4" fill="url(#enLR)" />
        <rect x="270" y="60" width="210" height="150" rx="4" fill="url(#enTB)" />
        <rect x="270" y="60" width="210" height="150" rx="4" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {[1, 2, 3, 4, 5].map(i => (
          <line key={`eh${i}`} x1="270" y1={60 + i * 25} x2="480" y2={60 + i * 25} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <line key={`ev${i}`} x1={270 + i * 26.25} y1="60" x2={270 + i * 26.25} y2="210" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" />
        ))}

        <line x1="285" y1="225" x2="465" y2="225" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#ptArrowR)" />
        <text x="375" y="242" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="600">Increases →</text>

        <line x1="255" y1="195" x2="255" y2="75" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#ptArrowR)" />
        <text x="250" y="145" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="600" transform="rotate(-90, 250, 145)">Increases ↑</text>

        {/* Key values */}
        <text x="455" y="80" textAnchor="middle" className="fill-red-600 dark:fill-red-300" fontSize="10" fontWeight="bold">F: 4.0</text>
        <text x="296" y="200" textAnchor="middle" className="fill-red-400 dark:fill-red-500" fontSize="10">Cs: 0.7</text>

        {/* Summary */}
        <text x="250" y="268" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Atomic radius and electronegativity trend in opposite directions</text>
        <text x="250" y="283" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Smaller atoms hold electrons tighter → higher electronegativity</text>

        <defs>
          <marker id="ptArrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="ptArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
