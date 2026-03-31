export default function CitizenScienceScaleDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="How citizen science scales research: one scientist vs thousands of volunteers">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">How Citizen Science Scales Research</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">One scientist can\u2019t be everywhere \u2014 thousands of volunteers can</text>

        {/* LEFT: Professional team */}
        <rect x="40" y="75" width="280" height="160" rx="8" className="fill-blue-50 dark:fill-blue-900/10" stroke="#3b82f6" strokeWidth="1" />
        <text x="180" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b82f6">Professional Team</text>
        <text x="180" y="135" textAnchor="middle" fontSize="28">\uD83D\uDC69\u200D\uD83D\uDD2C \uD83D\uDC68\u200D\uD83D\uDD2C \uD83D\uDC69\u200D\uD83D\uDD2C</text>
        <text x="180" y="165" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">3 researchers</text>
        <text x="180" y="182" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">10\u201320 sites per season</text>
        <text x="180" y="220" textAnchor="middle" fontSize="11" fill="#ef4444">Limited by funding &amp; time</text>

        {/* RIGHT: Citizen science */}
        <rect x="380" y="75" width="280" height="160" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="520" y="100" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">Citizen Science Network</text>
        {/* Many people icons */}
        <text x="520" y="135" textAnchor="middle" fontSize="14">
          {'\uD83D\uDC64'.repeat(8)}
        </text>
        <text x="520" y="155" textAnchor="middle" fontSize="14">
          {'\uD83D\uDC64'.repeat(8)}
        </text>
        <text x="520" y="175" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Thousands of volunteers</text>
        <text x="520" y="192" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Thousands of sites simultaneously</text>
        <text x="520" y="220" textAnchor="middle" fontSize="11" fill="#22c55e">Scales to entire countries</text>

        {/* VS arrow */}
        <text x="350" y="160" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-400 dark:fill-slate-500">vs</text>

        {/* Real examples */}
        <rect x="60" y="260" width="580" height="90" rx="8" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="282" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">Real-World Impact</text>
        {[
          { platform: 'eBird', data: '1 billion+ observations', what: 'Birds worldwide' },
          { platform: 'iNaturalist', data: '150 million+ observations', what: 'All species' },
          { platform: 'Big Butterfly Month (India)', data: '1,000s of volunteers', what: 'Butterfly trends' },
        ].map((p, i) => (
          <g key={i}>
            <text x={100 + i * 200} y={305} fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{p.platform}</text>
            <text x={100 + i * 200} y={320} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.data}</text>
            <text x={100 + i * 200} y={335} fontSize="10" className="fill-gray-500 dark:fill-slate-400">{p.what}</text>
          </g>
        ))}

        <text x="350" y="370" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Talo\u2019s butterfly notebooks are real citizen science \u2014 data that professionals couldn\u2019t collect alone</text>
      </svg>
    </div>
  );
}
