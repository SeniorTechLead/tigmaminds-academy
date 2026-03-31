export default function ActivityClayTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hands-on activity: test clay hardness and porosity at different drying temperatures"
      >
        <rect width="780" height="500" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Clay Temperature Test
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Compare how clay changes at different temperatures
        </text>

        {/* Three samples */}
        {[
          { x: 140, label: 'Air-dried', temp: '25\u00b0C (2 days)', color: '#d4a373', result: 'Soft, crumbly', porous: 'Very porous', hardness: '\u2605\u2606\u2606\u2606\u2606' },
          { x: 390, label: 'Oven-baked', temp: '200\u00b0C (2 hrs)', color: '#c2956a', result: 'Firm, some give', porous: 'Still porous', hardness: '\u2605\u2605\u2605\u2606\u2606' },
          { x: 640, label: 'Kiln-fired', temp: '1000\u00b0C+', color: '#9a3412', result: 'Hard, rings when tapped', porous: 'Low porosity', hardness: '\u2605\u2605\u2605\u2605\u2605' },
        ].map((s) => (
          <g key={s.x}>
            <text x={s.x} y="90" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-700 dark:fill-slate-300">
              {s.label}
            </text>
            <text x={s.x} y="108" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
              {s.temp}
            </text>

            {/* Clay sample */}
            <rect x={s.x - 40} y="120" width="80" height="50" rx="8" fill={s.color} opacity="0.8" stroke="#78350f" strokeWidth="1.5" />

            <text x={s.x} y="190" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">
              {s.result}
            </text>
            <text x={s.x} y="210" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
              {s.porous}
            </text>
            <text x={s.x} y="230" textAnchor="middle" fontSize="14" className="fill-amber-500 dark:fill-amber-400">
              {s.hardness}
            </text>
          </g>
        ))}

        {/* Test instructions */}
        <rect x="80" y="260" width="620" height="200" rx="10" className="fill-amber-50 dark:fill-amber-950" stroke="#d97706" strokeWidth="1.5" />
        <text x="390" y="286" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">
          How to Test Your Samples
        </text>

        {[
          { n: '1', text: 'Make 6 identical clay balls (same size, same clay)' },
          { n: '2', text: 'Air-dry 2 for 2 days. Bake 2 in an oven at 200\u00b0C for 2 hours. Fire 2 if you have access to a kiln.' },
          { n: '3', text: 'Scratch test: drag a nail across each. Rate hardness 1\u20135.' },
          { n: '4', text: 'Water test: weigh each, soak in water 1 hour, weigh again. More weight = more porous.' },
          { n: '5', text: 'Color test: note how color changes with temperature (iron oxide reddens at higher temps).' },
        ].map((step, i) => (
          <g key={i}>
            <circle cx="110" cy={310 + i * 26} r="10" fill="#d97706" opacity="0.8" />
            <text x="110" y={314 + i * 26} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              {step.n}
            </text>
            <text x="130" y={314 + i * 26} fontSize="11" className="fill-gray-700 dark:fill-slate-300">
              {step.text}
            </text>
          </g>
        ))}

        {/* Bottom insight */}
        <text x="390" y="484" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You are testing the same thing potters discovered 20,000 years ago: heat transforms clay.
        </text>
      </svg>
    </div>
  );
}
