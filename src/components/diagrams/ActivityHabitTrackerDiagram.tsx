export default function ActivityHabitTrackerDiagram() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  // Sample data: 1 = completed, 0 = missed
  const data = [
    [1, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 480 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Habit tracker grid showing how daily practice builds stronger neural pathways over four weeks"
      >
        <rect width="480" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="240" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Habit Tracker — Watch Your Neural Pathways Grow
        </text>

        <text x="240" y="48" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">
          Each green square = one day of practice = stronger connection
        </text>

        {/* Day headers */}
        {days.map((day, i) => (
          <text key={day} x={115 + i * 48} y="75" textAnchor="middle" fontFamily="system-ui, sans-serif"
            fontSize="11" fontWeight="600" className="fill-slate-600 dark:fill-slate-300">{day}</text>
        ))}

        {/* Week rows */}
        {weeks.map((week, wi) => (
          <g key={week}>
            <text x="45" y={110 + wi * 50} textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize="10" fontWeight="600" className="fill-slate-500 dark:fill-slate-400">{week}</text>
            {days.map((_, di) => (
              <rect key={di} x={91 + di * 48} y={90 + wi * 50} width="38" height="38" rx="6"
                className={data[wi][di]
                  ? 'fill-emerald-400 dark:fill-emerald-600 stroke-emerald-500 dark:stroke-emerald-400'
                  : 'fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600'}
                strokeWidth="1" />
            ))}
            {/* Pathway thickness indicator */}
            <rect x="435" y={95 + wi * 50} width={8 + wi * 5} height="28" rx="4"
              className="fill-purple-400 dark:fill-purple-500" opacity={0.4 + wi * 0.2} />
          </g>
        ))}

        {/* Pathway label */}
        <text x="455" y="80" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">Path</text>
        <text x="455" y="92" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-purple-500 dark:fill-purple-400">width</text>

        {/* Bottom insight */}
        <rect x="30" y="300" width="420" height="65" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="240" y="322" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">
          Offline Activity: Build Your Own Habit Tracker
        </text>
        <text x="240" y="340" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Pick one small habit. Track it daily for 4 weeks on paper.
        </text>
        <text x="240" y="355" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Notice: it gets easier each week. That is neuroplasticity at work.
        </text>
      </svg>
    </div>
  );
}
