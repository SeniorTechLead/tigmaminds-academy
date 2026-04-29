const ActivityGearModelDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hands-on activity: build a cardboard gear model to see how gears trade speed for force"
      >
        <style>{`
          .ag-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .ag-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .ag-section { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .ag-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .ag-tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          .ag-step { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" className="ag-title fill-gray-800 dark:fill-slate-100">
          Activity: Build a Cardboard Gear Model
        </text>

        {/* === MATERIALS === */}
        <rect x="20" y="42" width="170" height="130" rx="6"
          className="fill-amber-50 dark:fill-amber-900/15 stroke-amber-300 dark:stroke-amber-800" strokeWidth="1" />
        <text x="105" y="60" textAnchor="middle" className="ag-section fill-amber-600 dark:fill-amber-400">
          Materials Needed
        </text>
        {[
          '• Thick cardboard (cereal box)',
          '• Scissors',
          '• 2 pushpins or nails',
          '• A pencil or marker',
          '• A ruler',
          '• Corrugated cardboard strip',
        ].map((item, i) => (
          <text key={i} x="30" y={78 + i * 14} className="ag-small fill-amber-700 dark:fill-amber-400">
            {item}
          </text>
        ))}

        {/* === STEP 1: Cut circles === */}
        <rect x="200" y="42" width="185" height="130" rx="6"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-800" strokeWidth="1" />
        <text x="292" y="60" textAnchor="middle" className="ag-step fill-blue-600 dark:fill-blue-400">
          Step 1: Cut Two Circles
        </text>

        {/* Large circle */}
        <circle cx="250" cy="108" r="30" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4,3" />
        <circle cx="250" cy="108" r="2" className="fill-blue-500 dark:fill-blue-400" />
        <text x="250" y="148" textAnchor="middle" className="ag-tiny fill-blue-600 dark:fill-blue-400">
          Large: 8 cm diameter
        </text>

        {/* Small circle */}
        <circle cx="340" cy="108" r="18" className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-500" strokeWidth="1.5" strokeDasharray="4,3" />
        <circle cx="340" cy="108" r="2" className="fill-amber-500 dark:fill-amber-400" />
        <text x="340" y="148" textAnchor="middle" className="ag-tiny fill-amber-600 dark:fill-amber-400">
          Small: 4 cm diameter
        </text>

        {/* === STEP 2: Add teeth === */}
        <rect x="395" y="42" width="185" height="130" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-300 dark:stroke-emerald-800" strokeWidth="1" />
        <text x="487" y="60" textAnchor="middle" className="ag-step fill-emerald-600 dark:fill-emerald-400">
          Step 2: Add Teeth
        </text>

        {/* Gear with teeth */}
        <circle cx="460" cy="108" r="28" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400" strokeWidth="1.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 460 + 28 * Math.cos(angle);
          const y1 = 108 + 28 * Math.sin(angle);
          const x2 = 460 + 34 * Math.cos(angle);
          const y2 = 108 + 34 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />;
        })}
        <text x="460" y="152" textAnchor="middle" className="ag-tiny fill-emerald-600 dark:fill-emerald-400">
          Cut triangular notches
        </text>
        <text x="460" y="164" textAnchor="middle" className="ag-tiny fill-emerald-600 dark:fill-emerald-400">
          around the edge (12 teeth)
        </text>

        {/* Divider */}
        <line x1="20" y1="184" x2="580" y2="184" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === STEP 3: Pin them together === */}
        <rect x="20" y="196" width="270" height="110" rx="6"
          className="fill-purple-50 dark:fill-purple-900/15 stroke-purple-300 dark:stroke-purple-800" strokeWidth="1" />
        <text x="155" y="214" textAnchor="middle" className="ag-step fill-purple-600 dark:fill-purple-400">
          Step 3: Pin Gears to Cardboard Base
        </text>

        {/* Base board */}
        <rect x="50" y="228" width="200" height="60" rx="4"
          className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* Large gear on base */}
        <circle cx="120" cy="258" r="26" className="fill-blue-200 dark:fill-blue-900/40 stroke-blue-500" strokeWidth="1.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30) * Math.PI / 180;
          return <line key={i} x1={120 + 26 * Math.cos(a)} y1={258 + 26 * Math.sin(a)}
            x2={120 + 31 * Math.cos(a)} y2={258 + 31 * Math.sin(a)}
            stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />;
        })}
        {/* Pin */}
        <circle cx="120" cy="258" r="3" fill="#7c3aed" />

        {/* Small gear */}
        <circle cx="180" cy="248" r="16" className="fill-amber-200 dark:fill-amber-900/40 stroke-amber-500" strokeWidth="1.5" />
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * 60) * Math.PI / 180;
          return <line key={i} x1={180 + 16 * Math.cos(a)} y1={248 + 16 * Math.sin(a)}
            x2={180 + 21 * Math.cos(a)} y2={248 + 21 * Math.sin(a)}
            stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />;
        })}
        <circle cx="180" cy="248" r="3" fill="#7c3aed" />

        <text x="155" y="300" textAnchor="middle" className="ag-tiny fill-purple-600 dark:fill-purple-400">
          Teeth must mesh! Spin the small gear and watch the large one turn slowly.
        </text>

        {/* === STEP 4: What to observe === */}
        <rect x="300" y="196" width="280" height="110" rx="6"
          className="fill-red-50 dark:fill-red-900/15 stroke-red-300 dark:stroke-red-800" strokeWidth="1" />
        <text x="440" y="214" textAnchor="middle" className="ag-step fill-red-600 dark:fill-red-400">
          Step 4: Observe and Record
        </text>
        {[
          '1. Spin the small gear one full turn.',
          '   How far does the large gear turn?',
          '   (Answer: half a turn — gear ratio 2:1)',
          '',
          '2. Which gear is harder to turn by hand?',
          '   (Answer: the large gear — more torque)',
          '',
          '3. Try turning the large gear instead.',
          '   The small gear spins faster but with less force.',
        ].map((line, i) => (
          <text key={i} x="310" y={232 + i * 12} className="ag-tiny fill-red-700 dark:fill-red-400">
            {line}
          </text>
        ))}

        {/* Divider */}
        <line x1="20" y1="320" x2="580" y2="320" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === KEY TAKEAWAY === */}
        <rect x="20" y="332" width="560" height="96" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="300" y="352" textAnchor="middle" className="ag-section fill-emerald-600 dark:fill-emerald-400">
          What This Teaches You
        </text>

        {/* Three columns */}
        {[
          { x: 35, icon: '⚙️', title: 'Speed ↔ Force', text: 'Gears trade speed for\nforce (or vice versa).\nTotal work stays the same.' },
          { x: 215, icon: '⛰️', title: 'Hill trains use this', text: 'Low gear = slow speed,\nhigh pulling force.\nEssential for steep hills.' },
          { x: 395, icon: '🔧', title: 'Rack railways', text: 'A gear (pinion) meshes\nwith a toothed track (rack)\nfor grades above 8%.' },
        ].map((col, i) => (
          <g key={i}>
            <text x={col.x + 80} y={374} textAnchor="middle" className="ag-small fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
              {col.title}
            </text>
            {col.text.split('\n').map((line, j) => (
              <text key={j} x={col.x + 80} y={390 + j * 13} textAnchor="middle" className="ag-tiny fill-emerald-600 dark:fill-emerald-400">
                {line}
              </text>
            ))}
          </g>
        ))}

      </svg>
    </div>
  );
};

export default ActivityGearModelDiagram;
