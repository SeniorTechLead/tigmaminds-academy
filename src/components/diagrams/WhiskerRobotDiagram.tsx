export default function WhiskerRobotDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Biomimicry: robotic whisker sensor inspired by tiger vibrissae, used in pipe inspection robots">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#06b6d4">Biomimicry: From Tiger Whiskers to Robot Sensors</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Engineers copy nature's whisker design for robots that navigate in total darkness</text>

        {/* Tiger side */}
        <g transform="translate(40, 85)">
          <rect width="310" height="260" rx="8" fill="#fef3c7" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="155" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f59e0b">Nature's Design</text>

          {/* Simplified whisker cross-section */}
          <rect x="30" y="50" width="250" height="100" rx="6" className="fill-gray-50 dark:fill-slate-800" />
          <text x="155" y="70" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Tiger Whisker Cross-Section</text>

          {/* Shaft */}
          <line x1="80" y1="95" x2="250" y2="95" stroke="#78350f" strokeWidth="3" />
          <text x="200" y="88" fontSize="10" fill="#78350f">Keratin shaft</text>
          {/* Base with nerve cluster */}
          <circle cx="80" cy="95" r="18" fill="#fbbf24" opacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle key={i} cx={80 + Math.cos(i * Math.PI / 3) * 12} cy={95 + Math.sin(i * Math.PI / 3) * 12} r="2.5" fill="#8b5cf6" />
          ))}
          <text x="80" y="125" textAnchor="middle" fontSize="10" fill="#8b5cf6">Nerve cluster</text>

          {/* Properties */}
          {[
            'Flexible beam amplifies tiny forces',
            'Dense receptor cluster at base',
            'Detects contact AND airflow',
            'Works in total darkness',
          ].map((p, i) => (
            <text key={i} x="35" y={175 + i * 20} fontSize="11" className="fill-gray-600 dark:fill-slate-300">• {p}</text>
          ))}
        </g>

        {/* Arrow */}
        <text x="390" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill="#06b6d4">→ inspires →</text>

        {/* Robot side */}
        <g transform="translate(430, 85)">
          <rect width="310" height="260" rx="8" fill="#ecfeff" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" className="dark:fill-cyan-950/20" />
          <text x="155" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#06b6d4">Robot Copy</text>

          {/* Robot whisker cross-section */}
          <rect x="30" y="50" width="250" height="100" rx="6" className="fill-gray-50 dark:fill-slate-800" />
          <text x="155" y="70" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Robotic Whisker Sensor</text>

          {/* Metal beam */}
          <line x1="80" y1="95" x2="250" y2="95" stroke="#06b6d4" strokeWidth="3" />
          <text x="200" y="88" fontSize="10" fill="#06b6d4">Flexible beam</text>
          {/* Strain gauge at base */}
          <rect x="62" y="82" width="36" height="26" rx="4" fill="#06b6d4" opacity="0.2" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="80" y="98" textAnchor="middle" fontSize="10" fontWeight="600" fill="#06b6d4">SG</text>
          <text x="80" y="125" textAnchor="middle" fontSize="10" fill="#06b6d4">Strain gauge</text>

          {/* Properties */}
          {[
            'Flexible rod mimics keratin shaft',
            'Strain gauge replaces nerve endings',
            'Measures bend angle electrically',
            'Used underwater and in smoke',
          ].map((p, i) => (
            <text key={i} x="35" y={175 + i * 20} fontSize="11" className="fill-gray-600 dark:fill-slate-300">• {p}</text>
          ))}
        </g>

        {/* Applications bar */}
        <rect x="40" y="360" width="700" height="44" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="380" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Real-world uses: pipe inspection robots, underwater exploration, search-and-rescue in smoke
        </text>
        <text x="390" y="396" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Engineers still struggle to match the sensitivity of the biological original
        </text>
      </svg>
    </div>
  );
}
