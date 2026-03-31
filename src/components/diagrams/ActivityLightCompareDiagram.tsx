export default function ActivityLightCompareDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: compare brightness and heat of different light sources at home"
      >
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Compare Light Sources at Home
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Test brightness, heat, and color from different lamps
        </text>

        {/* Steps */}
        <rect x="60" y="70" width="660" height="220" rx="10" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1.5" />

        {[
          { n: '1', text: 'Gather: a candle, incandescent bulb (if available), LED bulb, phone with light meter app' },
          { n: '2', text: 'Set each source on a table. Place your phone 30 cm away.' },
          { n: '3', text: 'Measure brightness (lux) with the app. Record each value.' },
          { n: '4', text: 'Hold your hand 5 cm from each source for 10 seconds. Rate warmth 1\u20135.' },
          { n: '5', text: 'Note the color: warm yellow? cool white? orange? Record as warm/neutral/cool.' },
          { n: '6', text: 'Calculate efficiency: lux per watt for electrical sources.' },
        ].map((step, i) => (
          <g key={i}>
            <circle cx="95" cy={100 + i * 30} r="12" fill="#f59e0b" opacity="0.8" />
            <text x="95" y={105 + i * 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
              {step.n}
            </text>
            <text x="118" y={105 + i * 30} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
              {step.text}
            </text>
          </g>
        ))}

        {/* Results table */}
        <text x="390" y="315" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-300">
          Your Results Table
        </text>

        <rect x="80" y="325" width="620" height="26" rx="4" fill="#f59e0b" opacity="0.7" />
        {['Source', 'Brightness (lux)', 'Watts', 'Heat (1\u20135)', 'Color', 'Lux/Watt'].map((h, i) => (
          <text key={i} x={80 + 12 + i * 104} y="342" fontSize="10" fontWeight="700" fill="#fff">
            {h}
          </text>
        ))}

        {[
          ['Candle', '10\u201315', '~1W (chem)', '\u2605\u2605\u2605\u2605', 'Warm', '\u2014'],
          ['Incandescent', '200\u2013300', '60W', '\u2605\u2605\u2605\u2605\u2605', 'Warm', '~4'],
          ['LED', '200\u2013300', '8W', '\u2605', 'Cool/Warm', '~30'],
        ].map((row, ri) => (
          <g key={ri}>
            <rect x="80" y={353 + ri * 26} width="620" height="24" rx="2" className={ri % 2 === 0 ? 'fill-amber-50 dark:fill-amber-950' : 'fill-white dark:fill-slate-900'} opacity="0.7" />
            {row.map((cell, ci) => (
              <text key={ci} x={80 + 12 + ci * 104} y={369 + ri * 26} fontSize="10" className="fill-gray-700 dark:fill-slate-300" fontWeight={ci === 0 ? '600' : '400'}>
                {cell}
              </text>
            ))}
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="100" y="440" width="580" height="28" rx="6" className="fill-amber-50 dark:fill-amber-950" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="459" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          LEDs produce the same brightness as incandescent bulbs using ~85% less electricity
        </text>
      </svg>
    </div>
  );
}
