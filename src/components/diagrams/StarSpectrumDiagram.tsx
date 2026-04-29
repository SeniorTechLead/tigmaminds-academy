export default function StarSpectrumDiagram() {
  const colors = [
    { x: 100, w: 40, fill: '#7c3aed', label: 'Violet' },
    { x: 140, w: 35, fill: '#3b82f6', label: 'Blue' },
    { x: 175, w: 35, fill: '#22d3ee', label: 'Cyan' },
    { x: 210, w: 40, fill: '#22c55e', label: 'Green' },
    { x: 250, w: 40, fill: '#eab308', label: 'Yellow' },
    { x: 290, w: 35, fill: '#f97316', label: 'Orange' },
    { x: 325, w: 45, fill: '#ef4444', label: 'Red' },
  ];

  const absorptionLines = [125, 158, 195, 228, 270, 310, 348];

  return (
    <svg viewBox="0 0 546 310" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Stellar spectrum with prism splitting starlight into rainbow with absorption lines">
      <rect width="520" height="280" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Stellar Spectrum</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Each star has a unique fingerprint</text>

      {/* Starlight beam */}
      <line x1="30" y1="120" x2="70" y2="120" stroke="#fef3c7" strokeWidth="4" />
      <circle cx="22" cy="120" r="5" fill="#fef3c7" />
      <text x="22" y="108" textAnchor="middle" fill="#fbbf24" fontSize="9">Star</text>
      <text x="50" y="110" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">White light</text>

      {/* Prism */}
      <polygon points="72,90 92,150 52,150" className="fill-gray-100 dark:fill-slate-800" stroke="#60a5fa" strokeWidth="2" />
      <text x="72" y="165" textAnchor="middle" fill="#60a5fa" fontSize="9">Prism</text>

      {/* Dispersed beams */}
      {colors.map((c, i) => {
        const y1 = 95 + i * 8;
        const y2 = 80 + i * 10;
        return (
          <line key={i} x1="88" y1={120 + (i - 3) * 4} x2={c.x} y2={y2} stroke={c.fill} strokeWidth="1.5" opacity={0.6} />
        );
      })}

      {/* Spectrum band */}
      <g>
        {colors.map((c) => (
          <rect key={c.label} x={c.x} y="72" width={c.w} height="55" fill={c.fill} opacity={0.85} />
        ))}

        {/* Absorption lines (dark gaps) */}
        {absorptionLines.map((x, i) => (
          <rect key={i} x={x} y="72" width="3" height="55" className="fill-white dark:fill-slate-950" opacity={0.85} />
        ))}

        {/* Border */}
        <rect x="100" y="72" width="270" height="55" fill="none" stroke="#334155" strokeWidth="1" rx="2" />
      </g>

      {/* Wavelength labels */}
      <text x="100" y="142" className="fill-gray-500 dark:fill-slate-400" fontSize="8">400nm</text>
      <text x="360" y="142" textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">700nm</text>

      {/* Absorption line labels */}
      <line x1="158" y1="130" x2="158" y2="160" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="158" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Hydrogen</text>

      <line x1="228" y1="130" x2="228" y2="185" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="228" y="195" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Sodium</text>

      <line x1="310" y1="130" x2="310" y2="160" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="310" y="170" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Oxygen</text>

      {/* Explanation box */}
      <rect x="100" y="210" width="320" height="55" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="230" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Dark lines = elements absorbing specific colors</text>
      <text x="260" y="248" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Different elements → different line patterns</text>
      <text x="260" y="260" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">This is how we know what stars are made of!</text>
    </svg>
  );
}
