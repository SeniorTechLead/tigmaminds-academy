export default function ActivityGliderTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: build paper gliders with different wing shapes and measure glide ratio"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Test Paper Glider Designs
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Build, launch, measure, and calculate glide ratio like an aeronautical engineer
        </text>

        {/* Two glider designs */}
        <g transform="translate(200, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-sky-600 dark:fill-sky-400">
            Design A: Wide Wings
          </text>
          {/* Wide wing glider */}
          <path d="M -60 30 L 0 15 L 60 30 L 0 50 Z" fill="#0ea5e9" opacity="0.3" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="-3" y="20" width="6" height="35" rx="1" fill="#0ea5e9" opacity="0.5" />
          <text x="0" y="75" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            More lift, more drag
          </text>
        </g>

        <g transform="translate(570, 100)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-violet-600 dark:fill-violet-400">
            Design B: Narrow Wings
          </text>
          {/* Narrow wing glider */}
          <path d="M -40 30 L 0 18 L 40 30 L 0 45 Z" fill="#8b5cf6" opacity="0.3" stroke="#8b5cf6" strokeWidth="1.5" />
          <rect x="-3" y="22" width="6" height="30" rx="1" fill="#8b5cf6" opacity="0.5" />
          <text x="0" y="75" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Less drag, less lift
          </text>
        </g>

        {/* Launch diagram */}
        <g transform="translate(390, 200)">
          {/* Staircase */}
          <rect x="-150" y="0" width="40" height="80" fill="#94a3b8" opacity="0.3" rx="3" />
          <text x="-130" y="-8" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-400">
            Launch height (h)
          </text>
          {/* Arrow down */}
          <line x1="-130" y1="5" x2="-130" y2="75" stroke="#94a3b8" strokeWidth="1" />

          {/* Glide path */}
          <line x1="-110" y1="10" x2="150" y2="75" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" />
          {/* Distance arrow */}
          <line x1="-110" y1="85" x2="150" y2="85" stroke="#22c55e" strokeWidth="2" markerEnd="url(#glider-arr)" />
          <text x="20" y="100" textAnchor="middle" fontSize="10" className="fill-green-600 dark:fill-green-400" fontWeight="600">
            Horizontal distance (d)
          </text>
        </g>

        <defs>
          <marker id="glider-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Formula */}
        <rect x="200" y="310" width="380" height="30" rx="6" className="fill-sky-50 dark:fill-sky-950" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="390" y="330" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-sky-700 dark:fill-sky-300">
          Glide Ratio = d / h (horizontal / vertical)
        </text>

        {/* Steps */}
        <rect x="80" y="355" width="620" height="105" rx="10" className="fill-sky-50 dark:fill-sky-950" stroke="#0ea5e9" strokeWidth="1" />
        {[
          '1. Build 4 paper gliders: vary wing width, length, and nose weight.',
          '2. Launch each from the same height (e.g. top of a staircase = 2 metres).',
          '3. Measure horizontal distance for each. Calculate glide ratio = distance / height.',
          '4. Add a paper clip to the nose \u2014 does it improve or worsen the glide?',
          '5. Best glide ratio wins! Compare to a flying squirrel\'s 2\u20133:1 ratio.',
        ].map((step, i) => (
          <text key={i} x="100" y={374 + i * 18} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
            {step}
          </text>
        ))}
      </svg>
    </div>
  );
}
