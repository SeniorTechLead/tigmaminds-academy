export default function PeacockIridescenceDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Iridescence in peacock feathers: thin-film interference produces structural color, not pigments"
      >
        <rect width="700" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Iridescence: Color Without Pigment
        </text>

        {/* Feather barbule cross-section */}
        <rect x="40" y="55" width="340" height="260" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="210" y="78" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Feather Barbule Cross-Section</text>

        {/* Layered structure */}
        {[
          { y: 100, fill: '#1e3a5f', label: 'Melanin rod layer' },
          { y: 130, fill: '#60a5fa', label: 'Keratin film (air gap)' },
          { y: 160, fill: '#1e3a5f', label: 'Melanin rod layer' },
          { y: 190, fill: '#60a5fa', label: 'Keratin film (air gap)' },
          { y: 220, fill: '#1e3a5f', label: 'Melanin rod layer' },
        ].map(({ y, fill, label }, i) => (
          <g key={i}>
            <rect x="60" y={y} width="200" height="22" rx="2" fill={fill} opacity={fill.startsWith('#1') ? 0.7 : 0.25} />
            <text x="275" y={y + 15} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{label}</text>
          </g>
        ))}

        {/* Incoming white light */}
        <line x1="100" y1="55" x2="140" y2="100" stroke="#fef3c7" strokeWidth="3" />
        <text x="75" y="60" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">White light</text>

        {/* Reflected rays - constructive interference for blue */}
        <line x1="140" y1="100" x2="180" y2="55" stroke="#3b82f6" strokeWidth="2" />
        <line x1="140" y1="130" x2="175" y2="55" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
        <text x="190" y="55" fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-400">Blue reflected</text>

        {/* Film thickness label */}
        <line x1="55" y1="100" x2="55" y2="130" stroke="#f59e0b" strokeWidth="1" />
        <line x1="50" y1="100" x2="60" y2="100" stroke="#f59e0b" strokeWidth="1" />
        <line x1="50" y1="130" x2="60" y2="130" stroke="#f59e0b" strokeWidth="1" />
        <text x="48" y="120" textAnchor="end" fontSize="9" className="fill-amber-600 dark:fill-amber-400">~150 nm</text>

        {/* Angle change demo */}
        <text x="210" y="270" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Tilt the feather \u2192 path length changes \u2192 color shifts
        </text>

        {/* Right panel: what it looks like */}
        <rect x="400" y="55" width="280" height="260" rx="8" className="fill-gray-50 dark:fill-slate-900/50 stroke-gray-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="540" y="78" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">How It Looks</text>

        {/* Eyespot */}
        <circle cx="540" cy="170" r="60" fill="#1e3a5f" />
        <circle cx="540" cy="170" r="48" fill="#1e40af" />
        <circle cx="540" cy="170" r="35" fill="#10b981" />
        <circle cx="540" cy="170" r="22" fill="#3b82f6" />
        <circle cx="540" cy="170" r="12" fill="#1e3a5f" />

        {/* Angle arrows showing color change */}
        <text x="450" y="160" fontSize="10" className="fill-blue-500 dark:fill-blue-400">\u2190 Blue at 0\u00b0</text>
        <text x="450" y="200" fontSize="10" className="fill-emerald-500 dark:fill-emerald-400">\u2190 Green at 15\u00b0</text>
        <text x="590" y="140" fontSize="10" className="fill-amber-500 dark:fill-amber-400">Gold at 30\u00b0 \u2192</text>

        <text x="540" y="260" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          No pigment! Grind it up and color vanishes
        </text>

        {/* Comparison examples */}
        <text x="350" y="345" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-blue-600 dark:fill-blue-400">
          Same Physics, Different Places
        </text>

        {[
          { x: 120, icon: '\ud83e\udee7', label: 'Soap bubble', desc: 'Thin water film' },
          { x: 270, icon: '\ud83d\udee2\ufe0f', label: 'Oil slick', desc: 'Thin oil film' },
          { x: 420, icon: '\ud83d\udcf7', label: 'Camera lens', desc: 'Anti-reflective coat' },
          { x: 570, icon: '\ud83d\udcb5', label: 'Currency ink', desc: 'Security hologram' },
        ].map(({ x, icon, label, desc }) => (
          <g key={label}>
            <text x={x} y="385" textAnchor="middle" fontSize="20">{icon}</text>
            <text x={x} y="408" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{label}</text>
            <text x={x} y="422" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{desc}</text>
          </g>
        ))}

        {/* Key idea */}
        <rect x="60" y="445" width="580" height="40" rx="8" className="fill-blue-50 dark:fill-blue-950/30 stroke-blue-200 dark:stroke-blue-800" strokeWidth="1" />
        <text x="350" y="462" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
          Structural color = nanostructure + interference. No pigment needed. Color depends on viewing angle.
        </text>
        <text x="350" y="478" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Wavelength \u2248 2 \u00d7 film thickness \u00d7 cos(\u03b8) for constructive interference
        </text>
      </svg>
    </div>
  );
}
