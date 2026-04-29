export default function ActivityButterflyCountDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Activity: conduct a 5-day butterfly or insect transect survey along your daily route">
        <rect width="700" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#a855f7">Try This: Your 5-Day Butterfly Count</text>
        <text x="350" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">You need: a notebook, a pen, a route you walk regularly, 5 days</text>

        {/* Sample data table */}
        <rect x="100" y="75" width="500" height="140" rx="6" className="fill-gray-50 dark:fill-slate-800/50" stroke="#94a3b8" strokeWidth="1" />
        <text x="350" y="96" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">Sample Recording Sheet</text>

        {/* Table headers */}
        {['Day', 'Time', 'Weather', 'Count', 'Notes'].map((h, i) => (
          <text key={i} x={130 + i * 100} y={118} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{h}</text>
        ))}
        <line x1="110" y1="122" x2="590" y2="122" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

        {/* Sample rows */}
        {[
          ['Mon', '8:00', 'Sunny', '7', 'Saw 3 yellow ones'],
          ['Tue', '8:00', 'Cloudy', '3', 'Fewer \u2014 colder?'],
          ['Wed', '8:00', 'Sunny', '9', 'New white species!'],
          ['Thu', '8:00', 'Rain', '1', 'Almost none'],
          ['Fri', '8:00', 'Sunny', '8', 'Back to normal'],
        ].map((row, i) => (
          <g key={i}>
            {row.map((cell, j) => (
              <text key={j} x={130 + j * 100} y={140 + i * 14} textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">{cell}</text>
            ))}
          </g>
        ))}

        {/* Bar chart sketch */}
        <rect x="100" y="225" width="240" height="130" rx="6" className="fill-purple-50 dark:fill-purple-900/10" stroke="#a855f7" strokeWidth="1" />
        <text x="220" y="245" textAnchor="middle" fontSize="11" fontWeight="600" fill="#a855f7">Your Bar Chart</text>
        {/* Bars */}
        {[7, 3, 9, 1, 8].map((h, i) => (
          <g key={i}>
            <rect x={125 + i * 40} y={340 - h * 10} width="25" height={h * 10} rx="2" fill="#a855f7" opacity="0.3" />
            <text x={137 + i * 40} y={337 - h * 10} textAnchor="middle" fontSize="9" fill="#a855f7">{h}</text>
            <text x={137 + i * 40} y={350} textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">{'MTWRF'[i]}</text>
          </g>
        ))}

        {/* Steps */}
        <g transform="translate(370, 225)">
          <rect x="0" y="0" width="240" height="130" rx="6" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
          <text x="120" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill="#22c55e">Steps</text>
          {[
            '1. Choose your route (200\u2013500 m)',
            '2. Walk at same time daily, record count',
            '3. Note weather each day',
            '4. After 5 days, plot a bar chart',
            '5. Does weather affect the count?',
          ].map((s, i) => (
            <text key={i} x="15" y={40 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-300">{s}</text>
          ))}
        </g>

        {/* Bottom */}
        <text x="350" y="386" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">Congratulations — you just conducted a real transect survey!</text>
        <text x="350" y="404" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">This is exactly how scientists in Namdapha track butterfly populations</text>
      </svg>
    </div>
  );
}
