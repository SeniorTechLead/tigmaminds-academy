export default function MapMercatorMathDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 610 375"
        className="w-full"
        role="img"
        aria-label="Mercator projection math: cylinder wrapping globe, x equals longitude, y equals log tangent formula, with area distortion shown"
      >
        <rect width="500" height="340" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          The Math Behind Mercator
        </text>

        {/* Left: Globe with cylinder */}
        <g>
          <text x="120" y="55" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
            Globe inside cylinder
          </text>

          {/* Cylinder (transparent) */}
          <rect x="50" y="65" width="140" height="160" rx="3" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />

          {/* Globe */}
          <circle cx="120" cy="145" r="65" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2" />

          {/* Latitude lines on globe */}
          {[-50, -25, 0, 25, 50].map((lat) => {
            const y = 145 - lat * 1.1;
            const hw = Math.sqrt(Math.max(0, 65 * 65 - (lat * 1.1) * (lat * 1.1)));
            return (
              <line key={lat} x1={120 - hw} y1={y} x2={120 + hw} y2={y} stroke="#f59e0b" strokeWidth={lat === 0 ? 1.2 : 0.5} opacity="0.6" />
            );
          })}

          {/* Projection rays from globe to cylinder */}
          {[-50, -25, 25, 50].map((lat) => {
            const globeY = 145 - lat * 1.1;
            const cylY = lat === 50 ? 72 : lat === 25 ? 100 : lat === -25 ? 190 : 218;
            return (
              <line key={`ray-${lat}`} x1={120 + 65} y1={globeY} x2={190} y2={cylY} stroke="#ef4444" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
            );
          })}

          {/* Cylinder labels */}
          <text x="195" y="72" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">50°N</text>
          <text x="195" y="100" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">25°N</text>
          <text x="195" y="148" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">0°</text>
          <text x="195" y="193" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">25°S</text>
          <text x="195" y="221" fontSize="7" fill="#fbbf24" fontFamily="sans-serif">50°S</text>

          {/* Note: spacing increases toward poles */}
          <text x="120" y="240" textAnchor="middle" fontSize="8" fill="#f87171" fontFamily="sans-serif">
            Lines spread apart at poles
          </text>
        </g>

        {/* Right: Formulas */}
        <g>
          <rect x="250" y="55" width="230" height="120" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
          <text x="365" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">
            Mercator Formulas
          </text>

          {/* X formula */}
          <text x="270" y="98" fontSize="11" fill="#60a5fa" fontFamily="monospace">
            x = R . λ
          </text>
          <text x="370" y="98" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            (simple — just longitude)
          </text>

          {/* Y formula */}
          <text x="270" y="125" fontSize="11" fill="#f87171" fontFamily="monospace">
            {"y = R . ln(tan(π/4 + φ/2))"}
          </text>

          {/* Explanation */}
          <text x="270" y="148" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            λ = longitude, φ = latitude, R = Earth radius
          </text>
          <text x="270" y="163" fontSize="9" fill="#d1d5db" fontFamily="sans-serif">
            The log-tangent makes y grow faster near poles
          </text>
        </g>

        {/* Area distortion visualization */}
        <g>
          <text x="365" y="200" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">
            Area Distortion
          </text>

          {/* Grid showing stretching */}
          {[0, 1, 2, 3, 4].map((row) => {
            const cellH = 10 + row * 6; // cells get taller near "poles"
            const y = 210 + [0, 10, 24, 44, 72][row];
            return (
              <g key={row}>
                {[0, 1, 2, 3, 4].map((col) => (
                  <rect
                    key={col}
                    x={280 + col * 35}
                    y={y}
                    width="35"
                    height={cellH}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.6"
                  />
                ))}
                <text x="270" y={y + cellH / 2 + 3} textAnchor="end" fontSize="7" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
                  {["80°N", "60°N", "40°N", "20°N", "0° eq."][row]}
                </text>
              </g>
            );
          })}

          {/* Arrow showing increasing distortion */}
          <line x1="465" y1="285" x2="465" y2="215" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowMerc)" />
          <text x="480" y="250" fontSize="7" fill="#ef4444" fontFamily="sans-serif" transform="rotate(-90,480,250)">
            more distortion
          </text>
        </g>

        <defs>
          <marker id="arrowMerc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Bottom caption */}
        <text x="250" y="325" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Mercator preserves angles (great for navigation) but wildly distorts area near the poles.
        </text>
      </svg>
    </div>
  );
}
