export default function PeacockHonestSignalDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Honest signals and the handicap principle: costly traits prove genetic quality because they cannot be faked"
      >
        <rect width="700" height="460" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-rose-600 dark:fill-rose-400">
          Honest Signals: Why Big Tails Can't Be Faked
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Zahavi's Handicap Principle: the cost IS the proof
        </text>

        {/* Two peacocks comparison */}
        {/* Healthy male */}
        <rect x="40" y="70" width="290" height="300" rx="10" className="fill-emerald-50 dark:fill-emerald-950/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="185" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">Healthy Male</text>

        {/* Big tail fan */}
        {[-40, -28, -16, -4, 8, 20, 32].map((angle, i) => (
          <line key={i} x1="185" y1="220" x2={185 + Math.sin(angle * Math.PI / 180) * 90} y2={220 - Math.cos(angle * Math.PI / 180) * 90}
            stroke="#10b981" strokeWidth="3" opacity="0.6" />
        ))}
        {/* Eyespots */}
        {[-40, -16, 8, 32].map((angle, i) => (
          <circle key={`eye${i}`}
            cx={185 + Math.sin(angle * Math.PI / 180) * 80}
            cy={220 - Math.cos(angle * Math.PI / 180) * 80}
            r="6" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" />
        ))}
        <ellipse cx="185" cy="240" rx="14" ry="22" className="fill-blue-600 dark:fill-blue-500" />

        {/* Checkmarks */}
        {[
          'Strong immune system',
          'Well-fed (good territory)',
          'No parasites',
          '150+ eyespots',
        ].map((text, i) => (
          <g key={i}>
            <text x="70" y={286 + i * 18} fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">\u2713</text>
            <text x="85" y={286 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* Weak male */}
        <rect x="370" y="70" width="290" height="300" rx="10" className="fill-red-50 dark:fill-red-950/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1.5" />
        <text x="515" y="94" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-red-700 dark:fill-red-300">Weak/Sick Male</text>

        {/* Small tail fan */}
        {[-20, -8, 4, 16].map((angle, i) => (
          <line key={i} x1="515" y1="220" x2={515 + Math.sin(angle * Math.PI / 180) * 50} y2={220 - Math.cos(angle * Math.PI / 180) * 50}
            stroke="#a3a3a3" strokeWidth="2" opacity="0.4" />
        ))}
        {/* Fewer eyespots */}
        {[-12, 8].map((angle, i) => (
          <circle key={`eye2${i}`}
            cx={515 + Math.sin(angle * Math.PI / 180) * 42}
            cy={220 - Math.cos(angle * Math.PI / 180) * 42}
            r="4" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
        ))}
        <ellipse cx="515" cy="240" rx="12" ry="20" className="fill-gray-500 dark:fill-gray-600" />

        {/* X marks */}
        {[
          'Energy spent fighting parasites',
          'Poor nutrition (weak territory)',
          'Can\u2019t afford metabolic cost',
          'Fewer eyespots, duller colors',
        ].map((text, i) => (
          <g key={i}>
            <text x="395" y={286 + i * 18} fontSize="10" className="fill-red-500 dark:fill-red-400">\u2717</text>
            <text x="410" y={286 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
          </g>
        ))}

        {/* The logic */}
        <rect x="60" y="388" width="580" height="60" rx="8" className="fill-rose-50 dark:fill-rose-950/30 stroke-rose-200 dark:stroke-rose-800" strokeWidth="1" />
        <text x="350" y="408" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-rose-700 dark:fill-rose-300">
          The Handicap Principle
        </text>
        <text x="350" y="426" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">
          "I am so fit that I can survive DESPITE this ridiculous tail."
        </text>
        <text x="350" y="442" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          The signal is honest BECAUSE it is costly \u2014 a weak male cannot fake it.
        </text>
      </svg>
    </div>
  );
}
