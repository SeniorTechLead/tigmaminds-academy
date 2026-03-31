export default function GlutenNetworkDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Gluten network in wheat dough vs rice dough showing why rice pithas are denser and crumblier than bread">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d97706">Why Rice Pitha is Dense and Wheat Bread is Fluffy</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Wheat has gluten (stretchy protein network) — rice does not</text>

        {/* Wheat side */}
        <g transform="translate(40, 80)">
          <rect width="330" height="260" rx="8" fill="#fef3c7" opacity="0.15" stroke="#d97706" strokeWidth="1.5" />
          <text x="165" y="24" textAnchor="middle" fontSize="14" fontWeight="700" fill="#d97706">Wheat Dough (Bread)</text>

          {/* Gluten network - stretchy lines */}
          <g transform="translate(30, 50)">
            {/* Network of connected strands */}
            <path d="M 20 30 Q 50 20 80 35 Q 110 50 140 30 Q 170 10 200 25 Q 230 40 260 30" fill="none" stroke="#d97706" strokeWidth="2" />
            <path d="M 30 60 Q 60 50 90 65 Q 120 80 150 60 Q 180 40 210 55 Q 240 70 270 60" fill="none" stroke="#d97706" strokeWidth="2" />
            <path d="M 15 90 Q 45 80 75 95 Q 105 110 135 90 Q 165 70 195 85 Q 225 100 255 90" fill="none" stroke="#d97706" strokeWidth="2" />
            {/* Cross-links */}
            <line x1="50" y1="22" x2="60" y2="52" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1="140" y1="30" x2="150" y2="60" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1="90" y1="65" x2="75" y2="95" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1="210" y1="55" x2="195" y2="85" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Gas bubbles trapped */}
            {[[70, 45], [160, 50], [120, 75], [230, 55]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="12" fill="#fff" opacity="0.4" stroke="#94a3b8" strokeWidth="0.5" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="8" className="fill-gray-400 dark:fill-slate-500">CO₂</text>
              </g>
            ))}
          </g>

          <text x="165" y="175" textAnchor="middle" fontSize="11" fontWeight="600" fill="#d97706">Gluten = elastic protein network</text>
          <text x="165" y="195" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Stretches to trap CO₂ gas bubbles</text>
          <text x="165" y="212" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">from yeast → bread rises → fluffy!</text>

          <rect x="30" y="225" width="270" height="25" rx="4" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1" />
          <text x="165" y="242" textAnchor="middle" fontSize="11" fontWeight="600" fill="#22c55e">Result: light, airy, chewy</text>
        </g>

        {/* Rice side */}
        <g transform="translate(410, 80)">
          <rect width="330" height="260" rx="8" fill="#fef3c7" opacity="0.15" stroke="#92400e" strokeWidth="1.5" />
          <text x="165" y="24" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">Rice Dough (Pitha)</text>

          {/* No network - separate starch granules */}
          <g transform="translate(30, 50)">
            {/* Loose starch granules */}
            {[
              [30, 30], [70, 25], [120, 35], [170, 28], [220, 32], [260, 38],
              [50, 60], [100, 55], [150, 65], [200, 58], [240, 62],
              [25, 88], [75, 82], [130, 92], [180, 85], [230, 90], [265, 82],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="10" fill="#92400e" opacity="0.15" stroke="#92400e" strokeWidth="1" />
            ))}
            {/* Small gaps - but no big bubbles */}
            <text x="140" y="110" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">No stretchy network</text>
          </g>

          <text x="165" y="175" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">No gluten in rice!</text>
          <text x="165" y="195" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Starch granules sit loosely together</text>
          <text x="165" y="212" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">CO₂ escapes → dough does not rise</text>

          <rect x="30" y="225" width="270" height="25" rx="4" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="1" />
          <text x="165" y="242" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">Result: dense, crumbly, firm</text>
        </g>

        {/* Bottom insight */}
        <rect x="60" y="360" width="660" height="44" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="382" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          This is why Aita's pithas hold their shape — rice starch gelatinizes into a firm structure instead
        </text>
        <text x="390" y="398" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Traditional pitha-makers control texture by choosing sticky vs non-sticky rice varieties
        </text>
      </svg>
    </div>
  );
}
