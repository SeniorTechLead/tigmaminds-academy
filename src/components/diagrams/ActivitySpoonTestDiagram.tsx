export default function ActivitySpoonTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Activity: test thermal conductivity by placing metal, wood, and plastic spoons in hot water">
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ef4444">Try This: The Three-Spoon Test</text>
        <text x="350" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">You need: a metal spoon, a wooden spoon, a plastic spoon, a mug of hot water</text>

        {/* Mug */}
        <rect x="250" y="130" width="200" height="140" rx="8" className="fill-gray-200 dark:fill-slate-700" opacity="0.3" />
        <rect x="250" y="130" width="200" height="140" rx="8" fill="none" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="2" />
        {/* Water */}
        <rect x="254" y="145" width="192" height="121" rx="4" fill="#3b82f6" opacity="0.1" />
        {/* Steam wisps */}
        {[300, 350, 400].map((x, i) => (
          <path key={i} d={`M${x},135 Q${x - 5},120 ${x + 5},108 Q${x - 3},96 ${x},85`} fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
        ))}
        <text x="350" y="230" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Hot water (not boiling)</text>

        {/* Three spoons */}
        {/* Metal */}
        <line x1="280" y1="155" x2="230" y2="80" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <text x="215" y="75" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Metal</text>
        <text x="215" y="90" textAnchor="middle" fontSize="10" fill="#ef4444">HOT fast</text>

        {/* Wood */}
        <line x1="350" y1="155" x2="350" y2="80" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
        <text x="350" y="75" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Wood</text>
        <text x="350" y="90" textAnchor="middle" fontSize="10" fill="#22c55e">stays cool</text>

        {/* Plastic */}
        <line x1="420" y1="155" x2="470" y2="80" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
        <text x="485" y="75" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Plastic</text>
        <text x="485" y="90" textAnchor="middle" fontSize="10" fill="#22c55e">stays cool</text>

        {/* Steps */}
        {[
          { n: '1', text: 'Place all three spoons in the mug at the same time' },
          { n: '2', text: 'Wait 2 minutes, then carefully touch each handle' },
          { n: '3', text: 'Rank from hottest to coolest \u2014 hottest = best conductor' },
          { n: '4', text: 'Think: if charcoal conducts even worse than wood, why doesn\u2019t it burn feet?' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={120} cy={300 + i * 26} r="10" fill="#ef4444" opacity="0.15" />
            <text x={120} y={304 + i * 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">{s.n}</text>
            <text x={140} y={304 + i * 26} fontSize="12" className="fill-gray-700 dark:fill-slate-200">{s.text}</text>
          </g>
        ))}

        <text x="350" y="410" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Same water temperature, different handle temperatures \u2014 that\u2019s thermal conductivity in action</text>
      </svg>
    </div>
  );
}
