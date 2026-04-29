export default function ActivityMemoryTestDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Activity: test your own forgetting curve with 20 words over one week"
      >
        <rect width="780" height="500" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Map Your Own Forgetting Curve
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          A one-week self-experiment you can do with just pen and paper
        </text>

        {/* Steps */}
        <rect x="60" y="70" width="660" height="240" rx="10" className="fill-indigo-50 dark:fill-indigo-950" stroke="#6366f1" strokeWidth="1.5" />

        {[
          { n: '1', text: 'Write 20 random, unrelated words on a card (e.g. tiger, purple, bridge, telescope...)' },
          { n: '2', text: 'Study the list for exactly 5 minutes. Then put it away.' },
          { n: '3', text: 'Test immediately: write down as many as you can. Record your score: ___ / 20' },
          { n: '4', text: 'Re-test at: 1 hour, 1 day, 3 days, 1 week. Do NOT re-study between tests.' },
          { n: '5', text: 'Plot your scores on a graph: x-axis = time, y-axis = words remembered.' },
          { n: '6', text: 'Compare with a friend who reviews the list once a day (spaced repetition).' },
        ].map((step, i) => (
          <g key={i}>
            <circle cx="95" cy={100 + i * 34} r="12" fill="#6366f1" opacity="0.8" />
            <text x="95" y={105 + i * 34} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
              {step.n}
            </text>
            <text x="118" y={105 + i * 34} fontSize="12" className="fill-gray-700 dark:fill-slate-300">
              {step.text}
            </text>
          </g>
        ))}

        {/* Data table template */}
        <text x="390" y="340" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-gray-700 dark:fill-slate-300">
          Your Data Table
        </text>

        {/* Table header */}
        <rect x="100" y="350" width="580" height="26" rx="4" fill="#6366f1" opacity="0.8" />
        {['Time', 'Immediately', '1 hour', '1 day', '3 days', '1 week'].map((h, i) => (
          <text key={i} x={100 + 15 + i * 97} y={367} fontSize="11" fontWeight="700" fill="#fff">
            {h}
          </text>
        ))}

        {/* You (no review) row */}
        <rect x="100" y="378" width="580" height="26" rx="2" className="fill-red-50 dark:fill-red-950" />
        <text x="115" y="395" fontSize="11" fontWeight="600" className="fill-red-600 dark:fill-red-400">You</text>
        {['18', '14', '7', '4', '2'].map((v, i) => (
          <text key={i} x={100 + 15 + (i + 1) * 97} y={395} fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            {v}?
          </text>
        ))}

        {/* Friend (with review) row */}
        <rect x="100" y="406" width="580" height="26" rx="2" className="fill-green-50 dark:fill-green-950" />
        <text x="115" y="423" fontSize="11" fontWeight="600" className="fill-green-600 dark:fill-green-400">Friend</text>
        {['18', '17', '16', '15', '14'].map((v, i) => (
          <text key={i} x={100 + 15 + (i + 1) * 97} y={423} fontSize="11" className="fill-gray-500 dark:fill-slate-400">
            {v}?
          </text>
        ))}

        <text x="390" y="450" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          (Sample numbers shown — fill in your real scores)
        </text>

        {/* Bottom insight */}
        <rect x="120" y="462" width="540" height="28" rx="6" className="fill-indigo-50 dark:fill-indigo-950" stroke="#6366f1" strokeWidth="1" />
        <text x="390" y="481" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-600 dark:fill-indigo-400">
          You are replicating Ebbinghaus's 1885 experiment — the foundation of learning science
        </text>
      </svg>
    </div>
  );
}
