export default function FrogChorusDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Chorus coordination: frogs avoid overlap by calling at different frequencies, times, and locations"
      >
        <rect width="700" height="500" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-teal-600 dark:fill-teal-400">
          Acoustic Niche Partitioning: Avoiding Overlap
        </text>
        <text x="350" y="52" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Like radio stations on different channels
        </text>

        {/* 3D-ish partition diagram: Frequency (Y) x Time (X) x Location (layers) */}
        {/* Background grid */}
        <rect x="80" y="80" width="540" height="320" rx="6" className="fill-gray-50 dark:fill-slate-900/50" stroke="none" />

        {/* X axis: Time of night */}
        <line x1="80" y1="400" x2="620" y2="400" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="350" y="430" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400">Time of Night</text>
        {['Dusk', 'Early Night', 'Midnight', 'Pre-dawn'].map((t, i) => (
          <text key={t} x={130 + i * 140} y="416" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-500">{t}</text>
        ))}

        {/* Y axis: Frequency */}
        <line x1="80" y1="80" x2="80" y2="400" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="30" y="240" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-400" transform="rotate(-90 30 240)">Frequency (Hz)</text>
        {['8000', '5000', '2000', '500', '100'].map((f, i) => (
          <text key={f} x="72" y={110 + i * 72} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-500">{f}</text>
        ))}

        {/* Species blocks - each occupies a unique frequency x time niche */}
        {/* Species A: Bull frog - low freq, early night */}
        <rect x="200" y="310" width="120" height="60" rx="6" fill="#ef4444" opacity="0.25" stroke="#ef4444" strokeWidth="1.5" />
        <text x="260" y="338" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-red-700 dark:fill-red-300">Bull Frog</text>
        <text x="260" y="354" textAnchor="middle" fontSize="10" className="fill-red-600 dark:fill-red-400">100\u2013500 Hz</text>

        {/* Species B: Tree frog - mid freq, dusk */}
        <rect x="100" y="190" width="120" height="55" rx="6" fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="160" y="216" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">Tree Frog</text>
        <text x="160" y="232" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">2000\u20134000 Hz</text>

        {/* Species C: Cricket frog - high freq, midnight */}
        <rect x="340" y="100" width="130" height="55" rx="6" fill="#10b981" opacity="0.25" stroke="#10b981" strokeWidth="1.5" />
        <text x="405" y="126" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">Cricket Frog</text>
        <text x="405" y="142" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">5000\u20138000 Hz</text>

        {/* Species D: Paddy frog - mid-low freq, pre-dawn */}
        <rect x="480" y="240" width="120" height="55" rx="6" fill="#f59e0b" opacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="540" y="266" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Paddy Frog</text>
        <text x="540" y="282" textAnchor="middle" fontSize="10" className="fill-amber-600 dark:fill-amber-400">1000\u20132000 Hz</text>

        {/* No overlap arrows */}
        <text x="350" y="470" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-teal-700 dark:fill-teal-300">
          No two species occupy the same frequency + time slot \u2192 everyone gets heard
        </text>

        {/* Location layer icons */}
        <g transform="translate(610, 140)">
          <rect x="0" y="0" width="75" height="120" rx="6" className="fill-gray-100 dark:fill-slate-800/50 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="37" y="18" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Location</text>
          <text x="37" y="40" textAnchor="middle" fontSize="10" className="fill-blue-600 dark:fill-blue-400">\ud83c\udf33 Canopy</text>
          <text x="37" y="60" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">\ud83c\udf3f Ground</text>
          <text x="37" y="80" textAnchor="middle" fontSize="10" className="fill-cyan-600 dark:fill-cyan-400">\ud83d\udca7 Water</text>
          <text x="37" y="105" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-500">3rd dimension</text>
        </g>
      </svg>
    </div>
  );
}
