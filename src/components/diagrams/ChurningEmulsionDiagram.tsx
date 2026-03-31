export default function ChurningEmulsionDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 320"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing emulsion breaking into separated oil and water layers"
      >
        <style>{`
          .ce-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .ce-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .ce-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .ce-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <defs>
          <marker id="ce-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="560" height="320" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" className="ce-title fill-gray-700 dark:fill-gray-200">
          Churning Breaks an Emulsion
        </text>

        {/* ===== LEFT: Mixed Emulsion ===== */}
        <text x="130" y="52" textAnchor="middle" className="ce-bold fill-amber-600 dark:fill-amber-400">
          Mixed Emulsion
        </text>

        {/* Beaker */}
        <rect x="55" y="65" width="150" height="180" rx="6"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Oil droplets scattered in water */}
        {[
          [90, 100], [140, 90], [110, 130], [160, 120], [80, 155],
          [130, 160], [170, 150], [100, 185], [155, 190], [120, 210],
          [75, 120], [165, 175], [95, 200], [145, 225], [110, 170],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={6 + (i % 3) * 2}
            className="fill-yellow-300 dark:fill-yellow-500" opacity="0.7" />
        ))}

        {/* Water background label */}
        <text x="130" y="260" textAnchor="middle" className="ce-small fill-blue-600 dark:fill-blue-300">
          Water (polar molecules)
        </text>
        <text x="130" y="274" textAnchor="middle" className="ce-small fill-yellow-600 dark:fill-yellow-300">
          Oil droplets (non-polar)
        </text>
        <text x="130" y="288" textAnchor="middle" className="ce-small fill-gray-500 dark:fill-gray-400">
          Cloudy &amp; mixed
        </text>

        {/* ===== ARROW ===== */}
        <line x1="220" y1="145" x2="310" y2="145"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#ce-arrow)" />
        <text x="265" y="130" textAnchor="middle" className="ce-small fill-gray-600 dark:fill-gray-300">
          Churning breaks
        </text>
        <text x="265" y="143" textAnchor="middle" className="ce-small fill-gray-600 dark:fill-gray-300">
          emulsion
        </text>

        <line x1="220" y1="180" x2="310" y2="180"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" markerEnd="url(#ce-arrow)" />
        <text x="265" y="175" textAnchor="middle" className="ce-small fill-gray-600 dark:fill-gray-300">
          Gravity separates
        </text>
        <text x="265" y="188" textAnchor="middle" className="ce-small fill-gray-600 dark:fill-gray-300">
          by density
        </text>

        {/* ===== RIGHT: Separated Layers ===== */}
        <text x="420" y="52" textAnchor="middle" className="ce-bold fill-emerald-600 dark:fill-emerald-400">
          Separated Layers
        </text>

        {/* Beaker */}
        <rect x="345" y="65" width="150" height="180" rx="6"
          className="fill-transparent stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Oil layer (top) */}
        <rect x="346" y="66" width="148" height="70" rx="5"
          className="fill-yellow-200 dark:fill-yellow-600/50" />
        <text x="420" y="95" textAnchor="middle" className="ce-bold fill-yellow-700 dark:fill-yellow-300">
          Oil Layer
        </text>
        <text x="420" y="110" textAnchor="middle" className="ce-small fill-yellow-600 dark:fill-yellow-400">
          density 0.92 g/cm³
        </text>

        {/* Boundary line */}
        <line x1="346" y1="136" x2="494" y2="136"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="4,3" />

        {/* Water layer (bottom) */}
        <rect x="346" y="137" width="148" height="107" rx="5"
          className="fill-blue-200 dark:fill-blue-700/50" />
        <text x="420" y="180" textAnchor="middle" className="ce-bold fill-blue-700 dark:fill-blue-300">
          Water Layer
        </text>
        <text x="420" y="195" textAnchor="middle" className="ce-small fill-blue-600 dark:fill-blue-400">
          density 1.00 g/cm³
        </text>

        {/* Right-side density labels */}
        <text x="510" y="100" className="ce-small fill-gray-500 dark:fill-gray-400">
          lighter
        </text>
        <text x="510" y="115" className="ce-small fill-gray-500 dark:fill-gray-400">
          (floats)
        </text>
        <text x="510" y="185" className="ce-small fill-gray-500 dark:fill-gray-400">
          heavier
        </text>
        <text x="510" y="200" className="ce-small fill-gray-500 dark:fill-gray-400">
          (sinks)
        </text>

        {/* Molecular explanation */}
        <text x="420" y="265" textAnchor="middle" className="ce-small fill-gray-500 dark:fill-gray-400">
          Non-polar oil cannot mix
        </text>
        <text x="420" y="279" textAnchor="middle" className="ce-small fill-gray-500 dark:fill-gray-400">
          with polar water molecules
        </text>

        {/* Bottom note */}
        <text x="280" y="310" textAnchor="middle" className="ce-small fill-gray-400 dark:fill-gray-500">
          Like churning the ocean — vigorous mixing then separation by density
        </text>
      </svg>
    </div>
  );
}
