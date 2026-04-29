export default function SubatomicParticlesDiagram() {
  return (
    <div className="my-4">
      <svg
        viewBox="0 0 525 240"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Comparison of subatomic particles: proton, neutron, and electron"
      >
        {/* Header row */}
        <text x="80" y="22" textAnchor="middle" fontSize="12" fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200">Particle</text>
        <text x="195" y="22" textAnchor="middle" fontSize="12" fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200">Charge</text>
        <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200">Mass (amu)</text>
        <text x="395" y="22" textAnchor="middle" fontSize="12" fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200">Size</text>

        <line x1="15" y1="30" x2="435" y2="30"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* Proton row */}
        <circle cx="40" cy="62" r="20" className="fill-red-400 dark:fill-red-500" />
        <text x="40" y="67" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">p⁺</text>
        <text x="100" y="67" fontSize="12" fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200">Proton</text>
        <text x="195" y="67" textAnchor="middle" fontSize="14" fontWeight="bold"
          className="fill-red-600 dark:fill-red-400">+1</text>
        <text x="290" y="67" textAnchor="middle" fontSize="12"
          className="fill-gray-600 dark:fill-gray-300">1.0073</text>
        <circle cx="395" cy="62" r="16" className="fill-red-200 dark:fill-red-800" opacity="0.5" />

        <line x1="15" y1="90" x2="435" y2="90"
          className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />

        {/* Neutron row */}
        <circle cx="40" cy="120" r="20" className="fill-gray-400 dark:fill-gray-500" />
        <text x="40" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-white">n⁰</text>
        <text x="100" y="125" fontSize="12" fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200">Neutron</text>
        <text x="195" y="125" textAnchor="middle" fontSize="14" fontWeight="bold"
          className="fill-gray-500 dark:fill-gray-400">0</text>
        <text x="290" y="125" textAnchor="middle" fontSize="12"
          className="fill-gray-600 dark:fill-gray-300">1.0087</text>
        <circle cx="395" cy="120" r="16" className="fill-gray-200 dark:fill-gray-700" opacity="0.5" />

        <line x1="15" y1="148" x2="435" y2="148"
          className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />

        {/* Electron row */}
        <circle cx="40" cy="172" r="5" className="fill-blue-500 dark:fill-blue-400" />
        <text x="100" y="177" fontSize="12" fontWeight="600"
          className="fill-gray-700 dark:fill-gray-200">Electron</text>
        <text x="195" y="177" textAnchor="middle" fontSize="14" fontWeight="bold"
          className="fill-blue-600 dark:fill-blue-400">-1</text>
        <text x="290" y="177" textAnchor="middle" fontSize="12"
          className="fill-gray-600 dark:fill-gray-300">≈ 0.0005</text>
        <circle cx="395" cy="172" r="3" className="fill-blue-200 dark:fill-blue-700" opacity="0.5" />
        <text x="40" y="190" textAnchor="middle" fontSize="10"
          className="fill-blue-500 dark:fill-blue-400">e⁻</text>

        {/* Size note */}
        <text x="395" y="198" textAnchor="middle" fontSize="10"
          className="fill-gray-400 dark:fill-gray-500">
          (to scale)
        </text>
      </svg>
    </div>
  );
}
