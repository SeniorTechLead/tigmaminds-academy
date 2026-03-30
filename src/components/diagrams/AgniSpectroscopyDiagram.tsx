export default function AgniSpectroscopyDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 380"
        className="w-full h-auto"
        role="img"
        aria-label="Spectroscopy diagram showing how different elements produce unique flame colours"
      >
        <style>{`
          .asp-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .asp-label { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .asp-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .asp-elem { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="asp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="560" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" className="asp-title fill-gray-700 dark:fill-gray-200">
          Flame Test — Each Element Has a Unique Colour
        </text>

        {/* Element flames in a row */}
        {[
          { name: 'Li', full: 'Lithium', color: '#ef4444', dark: '#f87171', flame: '#dc2626', x: 60 },
          { name: 'Na', full: 'Sodium', color: '#f59e0b', dark: '#fbbf24', flame: '#d97706', x: 150 },
          { name: 'K', full: 'Potassium', color: '#a855f7', dark: '#c084fc', flame: '#7c3aed', x: 240 },
          { name: 'Cu', full: 'Copper', color: '#22c55e', dark: '#4ade80', flame: '#16a34a', x: 330 },
          { name: 'Sr', full: 'Strontium', color: '#ef4444', dark: '#fca5a5', flame: '#b91c1c', x: 420 },
          { name: 'Ba', full: 'Barium', color: '#84cc16', dark: '#a3e635', flame: '#65a30d', x: 510 },
        ].map((el, i) => (
          <g key={i}>
            {/* Flame shape */}
            <ellipse cx={el.x} cy="100" rx="22" ry="50" fill={el.flame} opacity="0.25" />
            <ellipse cx={el.x} cy="110" rx="14" ry="35" fill={el.flame} opacity="0.45" />
            <ellipse cx={el.x} cy="120" rx="7" ry="18" fill={el.flame} opacity="0.65" />

            {/* Burner base */}
            <rect x={el.x - 10} y="150" width="20" height="12" rx="2"
              className="fill-gray-400 dark:fill-gray-500 stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" />

            {/* Element symbol */}
            <text x={el.x} y="180" textAnchor="middle" style={{ fill: el.color }} className="asp-elem">
              {el.name}
            </text>
            <text x={el.x} y="194" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
              {el.full}
            </text>
          </g>
        ))}

        {/* Explanation section */}
        <rect x="30" y="215" width="500" height="70" rx="6"
          className="fill-blue-50 dark:fill-blue-900/10 stroke-blue-200 dark:stroke-blue-700" strokeWidth="1" />
        <text x="280" y="235" textAnchor="middle" className="asp-label fill-blue-700 dark:fill-blue-300">
          Why? Electrons jump to higher energy, then fall back → emit specific light
        </text>
        <text x="280" y="252" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          Heat excites electrons to higher orbits. When they drop back down, they release
        </text>
        <text x="280" y="265" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          a photon with a specific wavelength. Each element has unique energy gaps → unique colours.
        </text>
        <text x="280" y="278" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          This is how astronomers identify elements in distant stars — by reading their light.
        </text>

        {/* Energy level mini diagram */}
        <rect x="30" y="300" width="240" height="70" rx="6"
          className="fill-gray-50 dark:fill-gray-800/50 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

        {/* Ground state and excited state */}
        <line x1="60" y1="350" x2="130" y2="350" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <text x="95" y="365" textAnchor="middle" className="asp-small fill-blue-600 dark:fill-blue-400">Ground state</text>

        <line x1="60" y1="315" x2="130" y2="315" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x="95" y="310" textAnchor="middle" className="asp-small fill-red-600 dark:fill-red-400">Excited state</text>

        {/* Up arrow (absorb) */}
        <line x1="78" y1="347" x2="78" y2="318" className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="1.5" markerEnd="url(#asp-arrow)" />
        <text x="68" y="337" textAnchor="middle" className="asp-small fill-orange-600 dark:fill-orange-400">+E</text>

        {/* Down arrow (emit) */}
        <line x1="112" y1="318" x2="112" y2="347" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" markerEnd="url(#asp-arrow)" />
        <text x="125" y="337" textAnchor="middle" className="asp-small fill-green-600 dark:fill-green-400">γ</text>

        <text x="190" y="325" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">Heat pushes e⁻ up</text>
        <text x="190" y="340" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">e⁻ falls back down</text>
        <text x="190" y="355" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">→ emits photon (colour!)</text>

        {/* Real-world applications */}
        <rect x="285" y="300" width="245" height="70" rx="6"
          className="fill-amber-50 dark:fill-amber-900/10 stroke-amber-200 dark:stroke-amber-700" strokeWidth="1" />
        <text x="408" y="318" textAnchor="middle" className="asp-label fill-amber-700 dark:fill-amber-300">
          Real-World Uses
        </text>
        <text x="408" y="335" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          Fireworks: strontium = red, barium = green
        </text>
        <text x="408" y="350" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          Streetlights: sodium = orange-yellow glow
        </text>
        <text x="408" y="365" textAnchor="middle" className="asp-small fill-gray-600 dark:fill-gray-400">
          Astronomy: identify elements in distant stars
        </text>
      </svg>
    </div>
  );
}
