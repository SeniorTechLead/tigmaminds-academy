export default function ContourLinesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how contour lines on a topographic map represent elevation, with close lines meaning steep slopes"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Reading Contour Lines
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Contour lines connect points of equal elevation {'\u2014'} they turn 3D terrain into a 2D map
        </text>

        {/* Left: 3D hill */}
        <text x="200" y="82" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Real Hill (3D view)
        </text>

        {/* 3D hill visualization */}
        <g transform="translate(90, 120)">
          {/* Hill layers from bottom to top */}
          <ellipse cx="110" cy="200" rx="140" ry="40" fill="#22c55e" fillOpacity="0.1" stroke="#22c55e" strokeWidth="1" />
          <text x="260" y="205" fontSize="10" fill="#22c55e">100m</text>
          <ellipse cx="110" cy="175" rx="115" ry="32" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1" />
          <text x="235" y="180" fontSize="10" fill="#22c55e">200m</text>
          <ellipse cx="110" cy="150" rx="90" ry="25" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1" />
          <text x="210" y="155" fontSize="10" fill="#22c55e">300m</text>
          <ellipse cx="110" cy="125" rx="65" ry="18" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1" />
          <text x="185" y="130" fontSize="10" fill="#22c55e">400m</text>
          <ellipse cx="110" cy="100" rx="35" ry="10" fill="#22c55e" fillOpacity="0.35" stroke="#22c55e" strokeWidth="1.5" />
          <text x="155" y="105" fontSize="10" fill="#22c55e" fontWeight="600">500m</text>
        </g>

        {/* Arrow */}
        <path d="M360,230 Q390,215 410,230" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#contour-arr)" />
        <text x="390" y="210" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          view from above
        </text>

        {/* Right: Top-down contour map */}
        <text x="580" y="82" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Contour Map (top view)
        </text>

        <g transform="translate(460, 110)">
          <ellipse cx="120" cy="140" rx="145" ry="130" fill="#22c55e" fillOpacity="0.05" stroke="#22c55e" strokeWidth="1" />
          <text x="270" y="140" fontSize="10" fill="#22c55e">100m</text>
          <ellipse cx="120" cy="140" rx="115" ry="100" fill="#22c55e" fillOpacity="0.08" stroke="#22c55e" strokeWidth="1" />
          <text x="240" y="115" fontSize="10" fill="#22c55e">200m</text>
          <ellipse cx="120" cy="140" rx="85" ry="70" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" />
          <text x="210" y="100" fontSize="10" fill="#22c55e">300m</text>
          <ellipse cx="120" cy="140" rx="55" ry="42" fill="#22c55e" fillOpacity="0.18" stroke="#22c55e" strokeWidth="1" />
          <text x="180" y="115" fontSize="10" fill="#22c55e">400m</text>
          <ellipse cx="120" cy="140" rx="25" ry="16" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="1.5" />
          <text x="120" y="145" textAnchor="middle" fontSize="10" fill="#166534" fontWeight="600">500m</text>
        </g>

        {/* Key rules */}
        <rect x="40" y="365" width="700" height="80" rx="10" fill="#22c55e" fillOpacity="0.06" stroke="#22c55e" strokeWidth="1" />
        <text x="390" y="387" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">
          Three Rules for Reading Contours
        </text>
        <text x="80" y="410" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          {'\u2460'} Lines close together = steep slope
        </text>
        <text x="320" y="410" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          {'\u2461'} Lines far apart = gentle slope
        </text>
        <text x="550" y="410" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
          {'\u2462'} Lines never cross each other
        </text>
        <text x="390" y="435" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The interval between lines (e.g., every 100m) is constant on the same map
        </text>

        <defs>
          <marker id="contour-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
