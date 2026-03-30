/**
 * ActivitySilkTestDiagram — Offline activity: test fabrics at home.
 * Shows a simple experiment: hold fabric to light, stretch, drop water.
 * Three-panel layout matching other Activity diagrams.
 */

export default function ActivitySilkTestDiagram() {
  const gold = '#C8962E';
  const waterBlue = '#5C9CE6';

  return (
    <svg
      viewBox="0 0 600 280"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Three-panel diagram showing how to test different fabrics at home: hold to light, stretch gently, and drop water on each"
    >
      <rect width="600" height="280" rx="8" className="fill-[#fafaf8] dark:fill-[#1a1a2e]" />

      <text x="300" y="22" fontSize="12" fontWeight="700" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100">
        Try This: Test Fabrics at Home
      </text>

      {/* === Panel 1: Light test === */}
      <g>
        <rect x="15" y="40" width="180" height="190" rx="6" className="fill-amber-50 dark:fill-amber-900/10" stroke={gold} strokeWidth="1" />

        <text x="105" y="60" fontSize="10" fontWeight="700" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
          1. Light Test
        </text>

        {/* Hand holding fabric to window */}
        {/* Window */}
        <rect x="55" y="75" width="50" height="60" rx="2" fill="none" stroke="#90A4AE" strokeWidth="1.5" />
        <line x1="80" y1="75" x2="80" y2="135" stroke="#90A4AE" strokeWidth="0.5" />
        <line x1="55" y1="105" x2="105" y2="105" stroke="#90A4AE" strokeWidth="0.5" />
        {/* Sun rays through window */}
        {[65, 80, 95].map((x, i) => (
          <line key={`ray-${i}`} x1={x} y1={80} x2={x} y2={90} stroke="#FDE68A" strokeWidth="1.5" opacity="0.6" />
        ))}

        {/* Fabric swatch */}
        <rect x="120" y="85" width="40" height="30" rx="2" fill={gold} opacity="0.3" stroke={gold} strokeWidth="1" />

        {/* Arrow: light through fabric */}
        <line x1="105" y1="100" x2="118" y2="100" stroke="#FDE68A" strokeWidth="1.5" />

        <text x="105" y="155" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          Hold fabric to sunlight.
        </text>
        <text x="105" y="166" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          Does light pass through?
        </text>
        <text x="105" y="177" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          What colour do you see?
        </text>

        <text x="105" y="198" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontStyle="italic">
          Silk glows; cotton is opaque
        </text>

        <text x="105" y="218" fontSize="7" textAnchor="middle" fill={gold} fontWeight="600">
          Record: transparent / translucent / opaque
        </text>
      </g>

      {/* === Panel 2: Stretch test === */}
      <g>
        <rect x="210" y="40" width="180" height="190" rx="6" className="fill-blue-50 dark:fill-blue-900/10" stroke={waterBlue} strokeWidth="1" />

        <text x="300" y="60" fontSize="10" fontWeight="700" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
          2. Stretch Test
        </text>

        {/* Two hands pulling thread */}
        {/* Left grip */}
        <rect x="230" y="93" width="15" height="20" rx="3" className="fill-gray-300 dark:fill-gray-600" />
        {/* Right grip */}
        <rect x="350" y="93" width="15" height="20" rx="3" className="fill-gray-300 dark:fill-gray-600" />
        {/* Thread between */}
        <line x1="245" y1="103" x2="350" y2="103" stroke={gold} strokeWidth="1.5" />
        {/* Arrows showing pull direction */}
        <line x1="235" y1="103" x2="220" y2="103" stroke="#888" strokeWidth="1" markerEnd="url(#mp-arrow)" />
        <line x1="360" y1="103" x2="375" y2="103" stroke="#888" strokeWidth="1" markerEnd="url(#mp-arrow)" />
        {/* Stretch indicator */}
        <text x="300" y="95" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
          Pull gently
        </text>

        <text x="300" y="140" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          Pull a single thread gently.
        </text>
        <text x="300" y="151" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          How far does it stretch
        </text>
        <text x="300" y="162" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          before it breaks?
        </text>

        <text x="300" y="183" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontStyle="italic">
          Silk stretches ~20%; cotton barely stretches
        </text>

        <text x="300" y="218" fontSize="7" textAnchor="middle" fill={waterBlue} fontWeight="600">
          Record: stretch amount + breaking ease
        </text>
      </g>

      {/* === Panel 3: Water test === */}
      <g>
        <rect x="405" y="40" width="180" height="190" rx="6" className="fill-cyan-50 dark:fill-cyan-900/10" stroke="#26C6DA" strokeWidth="1" />

        <text x="495" y="60" fontSize="10" fontWeight="700" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">
          3. Water Drop Test
        </text>

        {/* Fabric swatch */}
        <rect x="450" y="85" width="90" height="40" rx="2" className="fill-gray-200 dark:fill-gray-600" />

        {/* Water drop falling */}
        <path d="M495,72 Q498,65 501,72 Q498,78 495,72" fill={waterBlue} opacity="0.7" />
        <line x1="498" y1="78" x2="498" y2="85" stroke={waterBlue} strokeWidth="0.5" strokeDasharray="2,2" />

        {/* Drop sitting on surface (beading) */}
        <ellipse cx="498" cy="87" rx="6" ry="3" fill={waterBlue} opacity="0.4" />

        <text x="495" y="140" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          Drop water on each fabric.
        </text>
        <text x="495" y="151" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          Does it bead up or soak in?
        </text>
        <text x="495" y="162" fontSize="7.5" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
          How fast does it absorb?
        </text>

        <text x="495" y="183" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontStyle="italic">
          Silk beads briefly; cotton absorbs instantly
        </text>

        <text x="495" y="218" fontSize="7" textAnchor="middle" fill="#00ACC1" fontWeight="600">
          Record: beads / slow absorb / instant absorb
        </text>
      </g>

      {/* Bottom instruction */}
      <rect x="15" y="242" width="570" height="28" rx="4" className="fill-gray-50 dark:fill-gray-800" stroke="#E0E0E0" strokeWidth="0.5" />
      <text x="300" y="258" fontSize="8" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
        Test at least 3 different fabrics. Make a table: Fabric name | Light test | Stretch test | Water test. Compare results.
      </text>
      <text x="300" y="268" fontSize="7" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400">
        You are doing materials science. Every lab starts with observation.
      </text>
    </svg>
  );
}
