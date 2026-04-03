/**
 * Arduino setup/loop execution flow diagram.
 * Shows: Power on → setup() runs once → loop() runs forever (with cycle arrow).
 */
export default function SetupLoopDiagram() {
  const totalW = 420;
  const totalH = 180;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-md mx-auto my-6" role="img" aria-label="Arduino setup runs once then loop runs forever">
      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Arduino Execution Flow
      </text>

      {/* Power on */}
      <g transform="translate(30, 50)">
        <circle cx="20" cy="20" r="18" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400" strokeWidth="2" />
        <text x="20" y="16" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="14">⚡</text>
        <text x="20" y="28" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="7" fontWeight="700">ON</text>
      </g>

      {/* Arrow: power → setup */}
      <line x1="68" y1="70" x2="108" y2="70" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" markerEnd="url(#arrow)" />

      {/* setup() box */}
      <g transform="translate(110, 45)">
        <rect x="0" y="0" width="100" height="50" rx="10"
          className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" fontSize="13" fontWeight="800" fontFamily="monospace">
          setup()
        </text>
        <text x="50" y="38" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontSize="8" fontWeight="600">
          runs ONCE
        </text>
      </g>

      {/* Arrow: setup → loop */}
      <line x1="210" y1="70" x2="250" y2="70" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" />

      {/* loop() box */}
      <g transform="translate(252, 45)">
        <rect x="0" y="0" width="100" height="50" rx="10"
          className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="13" fontWeight="800" fontFamily="monospace">
          loop()
        </text>
        <text x="50" y="38" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="8" fontWeight="600">
          runs FOREVER
        </text>
      </g>

      {/* Loop-back arrow (curves under and back) */}
      <path d="M 352 80 C 380 80, 390 120, 350 120 L 280 120 C 240 120, 240 95, 252 95"
        fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" strokeDasharray="5 3" />
      <text x="310" y="138" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontWeight="600">
        repeats forever ↻
      </text>

      {/* Timeline annotation */}
      <line x1="110" y1="155" x2="352" y2="155" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
      <text x="160" y="168" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="7">once</text>
      <text x="302" y="168" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="7">∞ times</text>

      {/* Arrow marker def */}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400 dark:fill-gray-500" />
        </marker>
      </defs>
    </svg>
  );
}
