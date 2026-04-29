export default function WoodpeckerSensorDesignDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Accelerometer and gyroscope on a helmet measuring g-forces during impact"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          .val { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <rect width="640" height="430" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Smart Helmet: Impact Sensor Design
        </text>

        {/* Helmet with sensors */}
        <g transform="translate(40, 50)">
          {/* Helmet shell */}
          <path d="M30,140 Q100,10 210,140" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
          <path d="M40,135 Q100,20 200,135" fill="none" stroke="#818cf8" strokeWidth="10" opacity="0.3" />
          <path d="M50,130 Q100,30 190,130" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />

          {/* Head */}
          <ellipse cx="120" cy="120" rx="55" ry="40" className="fill-gray-900 dark:fill-slate-50" opacity="0.06" stroke="#64748b" strokeWidth="1" />

          {/* Sensor 1: Accelerometer (top) */}
          <rect x="100" y="20" width="30" height="18" rx="3" fill="#22c55e" stroke="#86efac" strokeWidth="1" />
          <text x="115" y="32" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">ACC</text>

          {/* Sensor 2: Gyroscope (side) */}
          <rect x="50" y="70" width="30" height="18" rx="3" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1" />
          <text x="65" y="82" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">GYR</text>

          {/* Sensor 3: Another accelerometer (other side) */}
          <rect x="165" y="70" width="30" height="18" rx="3" fill="#22c55e" stroke="#86efac" strokeWidth="1" />
          <text x="180" y="82" textAnchor="middle" className="sm fill-white dark:fill-slate-950" fontWeight="600">ACC</text>

          {/* Wires */}
          <path d="M115,38 L115,55 L65,65 L65,70" fill="none" stroke="#86efac" strokeWidth="1" />
          <path d="M115,55 L180,65 L180,70" fill="none" stroke="#86efac" strokeWidth="1" />

          {/* Bluetooth chip */}
          <rect x="100" y="90" width="30" height="14" rx="2" fill="#38bdf8" opacity="0.5" stroke="#38bdf8" strokeWidth="1" />
          <text x="115" y="100" textAnchor="middle" className="sm fill-gray-900 dark:fill-slate-50" style={{ fontSize: '7px' }}>BLE</text>

          {/* Labels */}
          <line x1="130" y1="29" x2="240" y2="25" stroke="#86efac" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="245" y="22" className="sm" fill="#86efac">3-axis accelerometer</text>
          <text x="245" y="35" className="sm fill-gray-400 dark:fill-slate-500">Measures linear g-force</text>

          <line x1="50" y1="79" x2="0" y2="95" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="-5" y="92" textAnchor="end" className="sm" fill="#fbbf24">3-axis gyroscope</text>
          <text x="-5" y="105" textAnchor="end" className="sm fill-gray-400 dark:fill-slate-500">Measures rotation</text>
        </g>

        {/* Data flow */}
        <g transform="translate(330, 55)">
          <rect x="0" y="0" width="280" height="155" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="140" y="20" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">Sensor Data Pipeline</text>

          {/* Flow boxes */}
          {[
            { label: 'Accelerometer', sub: 'x, y, z (m/s2)', color: '#22c55e', y: 32 },
            { label: 'Gyroscope', sub: 'roll, pitch, yaw (deg/s)', color: '#f59e0b', y: 60 },
          ].map((s, i) => (
            <g key={i}>
              <rect x="10" y={s.y} width="110" height="22" rx="4" fill={s.color} opacity="0.15" stroke={s.color} strokeWidth="1" />
              <text x="65" y={s.y + 15} textAnchor="middle" className="sm" fill={s.color}>{s.label}</text>
            </g>
          ))}

          {/* Arrows */}
          <line x1="120" y1="48" x2="140" y2="58" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <line x1="120" y1="71" x2="140" y2="65" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

          {/* Processing */}
          <rect x="140" y="48" width="55" height="28" rx="4" fill="#38bdf8" opacity="0.15" stroke="#38bdf8" strokeWidth="1" />
          <text x="168" y="66" textAnchor="middle" className="sm" fill="#7dd3fc">MCU</text>

          <line x1="195" y1="62" x2="215" y2="62" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

          {/* Output */}
          <rect x="215" y="48" width="55" height="28" rx="4" fill="#a78bfa" opacity="0.15" stroke="#a78bfa" strokeWidth="1" />
          <text x="242" y="60" textAnchor="middle" className="sm" fill="#c4b5fd">BLE</text>
          <text x="242" y="72" textAnchor="middle" className="sm" fill="#c4b5fd">Out</text>

          {/* Readings display */}
          <rect x="10" y="92" width="260" height="55" rx="4" className="fill-white dark:fill-slate-950" />
          <text x="140" y="107" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Sample output during impact:</text>
          <text x="140" y="122" textAnchor="middle" className="val" fill="#22c55e" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            Peak: 45g | Duration: 12ms
          </text>
          <text x="140" y="137" textAnchor="middle" className="val" fill="#f59e0b" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            Rotation: 2800 deg/s
          </text>
        </g>

        {/* Alert thresholds */}
        <g transform="translate(40, 228)">
          <text x="280" y="0" textAnchor="middle" className="label" fill="#fbbf24" fontWeight="600">Impact Severity Classification</text>

          {/* Threshold bars */}
          {[
            { range: '0-20g', level: 'Minor', color: '#22c55e', w: 90 },
            { range: '20-50g', level: 'Moderate', color: '#f59e0b', w: 130 },
            { range: '50-80g', level: 'Severe', color: '#f97316', w: 130 },
            { range: '80g+', level: 'DANGER', color: '#ef4444', w: 210 },
          ].map((t, i) => {
            const x = i === 0 ? 0 : i === 1 ? 90 : i === 2 ? 220 : 350;
            return (
              <g key={i} transform={`translate(${x}, 14)`}>
                <rect x="0" y="0" width={t.w} height="28" rx="0" fill={t.color} opacity="0.2" stroke={t.color} strokeWidth="1" />
                <text x={t.w / 2} y="12" textAnchor="middle" className="sm" fill={t.color} fontWeight="600">{t.level}</text>
                <text x={t.w / 2} y="24" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">{t.range}</text>
              </g>
            );
          })}
        </g>

        {/* Phone alert visualization */}
        <g transform="translate(40, 290)">
          <rect x="0" y="0" width="560" height="120" rx="8" className="fill-gray-100 dark:fill-slate-800" />
          <text x="280" y="20" textAnchor="middle" className="label fill-gray-900 dark:fill-slate-50" fontWeight="600">Phone App Dashboard</text>

          {/* Mini phone */}
          <rect x="15" y="30" width="95" height="78" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
          <text x="62" y="46" textAnchor="middle" className="sm" fill="#ef4444" fontWeight="600">! ALERT</text>
          <text x="62" y="60" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Impact: 62g</text>
          <text x="62" y="74" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Rotation: High</text>
          <rect x="25" y="82" width="65" height="16" rx="3" fill="#ef4444" opacity="0.3" />
          <text x="58" y="94" textAnchor="middle" className="sm" fill="#fca5a5">Seek eval</text>

          {/* Timeline graph */}
          <g transform="translate(135, 30)">
            <text x="195" y="0" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Impact Timeline (last 10 seconds)</text>
            <line x1="0" y1="14" x2="0" y2="68" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
            <line x1="0" y1="68" x2="400" y2="68" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

            {/* Flatline then spike */}
            <path d="M0,66 L110,66 L130,66 L140,62 L150,22 L155,58 L165,66 L400,66"
              fill="none" stroke="#22c55e" strokeWidth="2" />

            {/* Spike label */}
            <line x1="150" y1="22" x2="220" y2="16" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
            <text x="225" y="20" className="sm" fill="#ef4444">62g peak</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
