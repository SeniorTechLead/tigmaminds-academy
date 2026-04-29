export default function ActivitySoundLocateDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 729 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Offline activity: blindfold test for sound localization from 8 directions, then repeat with one ear blocked to see how accuracy drops"
      >
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Test Your Sound Localization
        </text>
        <text x="350" y="50" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          You need: a blindfold, a friend, a room with some space
        </text>

        {/* Compass directions diagram */}
        <g transform="translate(180, 210)">
          {/* Circle */}
          <circle cx="0" cy="0" r="100" fill="none" stroke="#6b7280" strokeWidth="1" strokeDasharray="4 2" />

          {/* Person in center */}
          <circle cx="0" cy="0" r="15" className="fill-indigo-200 dark:fill-indigo-800/40" stroke="#6366f1" strokeWidth="1.5" />
          <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">You</text>
          <text x="0" y="17" textAnchor="middle" fontSize="8" className="fill-indigo-500 dark:fill-indigo-400">(blindfolded)</text>

          {/* 8 directions */}
          {[
            { angle: -90, label: 'Front', x: 0, y: -115 },
            { angle: -45, label: 'FR', x: 80, y: -80 },
            { angle: 0, label: 'Right', x: 115, y: 5 },
            { angle: 45, label: 'BR', x: 80, y: 80 },
            { angle: 90, label: 'Back', x: 0, y: 115 },
            { angle: 135, label: 'BL', x: -80, y: 80 },
            { angle: 180, label: 'Left', x: -115, y: 5 },
            { angle: -135, label: 'FL', x: -80, y: -80 },
          ].map((d, i) => {
            const rad = (d.angle * Math.PI) / 180;
            const cx = Math.cos(rad) * 100;
            const cy = Math.sin(rad) * 100;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="8" className="fill-amber-100 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
                <text x={d.x} y={d.y} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">{d.label}</text>
              </g>
            );
          })}

          <text x="0" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Friend snaps fingers from each direction</text>
        </g>

        {/* Instructions */}
        <g transform="translate(360, 75)">
          <rect width="300" height="250" rx="8" className="fill-indigo-50 dark:fill-indigo-950/20" stroke="#6366f1" strokeWidth="1" />
          <text x="150" y="22" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Instructions</text>

          {[
            'Blindfold the volunteer. Stand 2m away.',
            'Snap fingers from each of 8 directions.',
            'Volunteer points to the sound source.',
            'Record: correct direction? How far off?',
            'Repeat 3\u00d7 per direction.',
            '',
            'THEN: block one ear with a hand.',
            'Repeat all 8 directions.',
            'Compare two-ear vs one-ear accuracy!',
          ].map((step, i) => (
            <text key={i} x="15" y={42 + i * 22} fontSize="11" className={i === 6 ? "fill-red-600 dark:fill-red-400 font-bold" : "fill-gray-700 dark:fill-gray-300"}>
              {i < 5 ? `${i + 1}. ` : ''}{step}
            </text>
          ))}
        </g>

        {/* Expected results */}
        <rect x="50" y="340" width="600" height="50" rx="8" className="fill-emerald-50 dark:fill-emerald-950/30" stroke="#16a34a" strokeWidth="1" />
        <text x="350" y="358" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
          Expected: Two ears → good accuracy (especially left/right). One ear → front/back confusion!
        </text>
        <text x="350" y="376" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Owls solve front/back AND up/down with asymmetric ears — their accuracy is 1–2°, enough to catch mice in pitch darkness
        </text>
      </svg>
    </div>
  );
}
