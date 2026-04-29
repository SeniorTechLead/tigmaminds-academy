export default function EchoSpeedOutputDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 637 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Project output showing speed of sound measurement results with bar chart comparing student value to accepted value">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="320" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-purple-700 dark:fill-purple-300">
          Project Output: Measuring Speed of Sound
        </text>

        {/* Data table */}
        <rect x="40" y="45" width="260" height="140" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="170" y="65" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Sample Data</text>

        {/* Table headers */}
        <text x="80" y="85" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400" fontWeight="600">Trial</text>
        <text x="160" y="85" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400" fontWeight="600">Echo time (s)</text>
        <text x="250" y="85" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400" fontWeight="600">Speed (m/s)</text>
        <line x1="50" y1="90" x2="290" y2="90" stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-600" />

        {[
          { trial: '1', time: '0.310', speed: '323' },
          { trial: '2', time: '0.295', speed: '339' },
          { trial: '3', time: '0.288', speed: '347' },
          { trial: '4', time: '0.300', speed: '333' },
          { trial: '5', time: '0.292', speed: '342' },
        ].map((row, i) => (
          <g key={i}>
            <text x="80" y={105 + i * 15} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{row.trial}</text>
            <text x="160" y={105 + i * 15} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{row.time}</text>
            <text x="250" y={105 + i * 15} textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">{row.speed}</text>
          </g>
        ))}

        {/* Average */}
        <line x1="50" y1="175" x2="290" y2="175" stroke="#8b5cf6" strokeWidth="1" />
        <text x="120" y="188" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400" fontWeight="600">Average:</text>
        <text x="250" y="188" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400" fontWeight="600">337 m/s</text>

        {/* Bar chart comparison */}
        <g>
          <text x="450" y="60" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Result Comparison</text>

          {/* Y-axis */}
          <line x1="350" y1="80" x2="350" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <text x="345" y="85" textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">350</text>
          <text x="345" y="115" textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">340</text>
          <text x="345" y="145" textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">330</text>
          <text x="345" y="175" textAnchor="end" className="small fill-slate-500 dark:fill-slate-400">320</text>

          {/* Grid lines */}
          {[80, 110, 140, 170].map(y => (
            <line key={y} x1="350" y1={y} x2="550" y2={y} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
          ))}

          {/* Student bar: 337 m/s → height from 320 baseline */}
          {/* 320 = y:170, 350 = y:80, so 337 maps to 170 - (337-320)/(350-320)*90 = 170-51 = 119 */}
          <rect x="390" y="119" width="50" height="51" rx="3" fill="#8b5cf6" opacity="0.7" />
          <text x="415" y="115" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400" fontWeight="600">337</text>
          <text x="415" y="195" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Your result</text>

          {/* Accepted bar: 343 m/s → 170 - (343-320)/30*90 = 170-69 = 101 */}
          <rect x="470" y="101" width="50" height="69" rx="3" fill="#10b981" opacity="0.7" />
          <text x="495" y="97" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">343</text>
          <text x="495" y="195" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Accepted</text>
        </g>

        {/* Error analysis */}
        <rect x="40" y="210" width="540" height="95" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth="1" className="dark:fill-purple-900/10 dark:stroke-purple-700" />
        <text x="310" y="230" textAnchor="middle" className="label fill-purple-700 dark:fill-purple-300" fontWeight="600">Error Analysis</text>
        <text x="60" y="248" className="small fill-slate-600 dark:fill-slate-400">Percentage error: |(343 - 337) / 343| × 100 = 1.75% — excellent for a hand-clap experiment!</text>
        <text x="60" y="266" className="small fill-slate-700 dark:fill-slate-300" fontWeight="600">Sources of error:</text>
        <text x="60" y="282" className="small fill-slate-600 dark:fill-slate-400">• Reaction time delay (adds ~0.02 s)  • Wind carrying sound  • Temperature affects speed</text>
        <text x="60" y="298" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Averaging multiple trials reduces random error — a core principle of experimental science</text>
      </svg>
    </div>
  );
}
