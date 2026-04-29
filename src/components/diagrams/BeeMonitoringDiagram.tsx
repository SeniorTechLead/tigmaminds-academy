export default function BeeMonitoringDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 440" className="w-full max-w-2xl mx-auto" role="img" aria-label="Bee hive monitoring diagram with weight, temperature, and sound sensors feeding a health dashboard">
        <rect width="570" height="440" rx="12" className="fill-slate-900" />

        <text x="285" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Smart Hive Monitoring</text>
        <text x="285" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">IoT sensors for real-time colony health tracking</text>

        {/* Hive with sensors — left side */}
        <g transform="translate(130, 180)">
          {/* Hive body */}
          <rect x="-55" y="-50" width="110" height="30" rx="4" fill="#a16207" opacity="0.4" stroke="#d97706" strokeWidth="1" />
          <rect x="-55" y="-18" width="110" height="30" rx="4" fill="#a16207" opacity="0.5" stroke="#d97706" strokeWidth="1" />
          <rect x="-55" y="14" width="110" height="30" rx="4" fill="#a16207" opacity="0.6" stroke="#d97706" strokeWidth="1" />
          {/* Roof */}
          <polygon points="-60,-55 0,-75 60,-55" fill="#78350f" opacity="0.5" stroke="#a16207" strokeWidth="1" />
          {/* Entrance */}
          <rect x="-10" y="44" width="20" height="6" rx="2" className="fill-gray-100 dark:fill-slate-800" />

          {/* Sensor 1: Temperature (inside) */}
          <circle cx="-30" cy="-3" r="6" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="-30" y="1" textAnchor="middle" fontSize="10" fill="#ef4444">T</text>

          {/* Sensor 2: Weight (bottom) */}
          <rect x="-55" y="48" width="110" height="8" rx="2" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
          <text x="0" y="55" textAnchor="middle" fontSize="10" fill="#3b82f6">SCALE</text>

          {/* Sensor 3: Microphone */}
          <circle cx="30" cy="-3" r="6" fill="#22c55e" opacity="0.3" stroke="#22c55e" strokeWidth="1" />
          <text x="30" y="1" textAnchor="middle" fontSize="10" fill="#22c55e">🎤</text>

          {/* Sensor 4: Humidity */}
          <circle cx="0" cy="-35" r="6" fill="#a855f7" opacity="0.3" stroke="#a855f7" strokeWidth="1" />
          <text x="0" y="-32" textAnchor="middle" fontSize="10" fill="#a855f7">H</text>

          <text x="0" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Instrumented Hive</text>
        </g>

        {/* Data flow arrows */}
        <defs>
          <marker id="bmon-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#fbbf24" />
          </marker>
        </defs>

        {/* WiFi symbol */}
        <g transform="translate(260, 150)">
          {[10, 16, 22].map((r, i) => (
            <path
              key={i}
              d={`M ${-r * 0.7},${r * 0.3} A ${r} ${r} 0 0 1 ${r * 0.7},${r * 0.3}`}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity={0.3 + i * 0.2}
              transform="rotate(180)"
            />
          ))}
          <circle cx="0" cy="0" r="2" fill="#fbbf24" />
          <text x="0" y="30" textAnchor="middle" fontSize="10" fill="#fcd34d">WiFi / LoRa</text>
        </g>

        <line x1="195" y1="170" x2="235" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bmon-arrow)" opacity="0.5" />
        <line x1="278" y1="160" x2="310" y2="100" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#bmon-arrow)" opacity="0.5" />

        {/* Dashboard — right side */}
        <g transform="translate(410, 180)">
          <rect x="-100" y="-100" width="200" height="210" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="2" />
          <text x="0" y="-82" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Health Dashboard</text>

          {/* Temperature gauge */}
          <g transform="translate(-55, -50)">
            <rect x="-30" y="-12" width="60" height="45" rx="4" fill="#ef4444" opacity="0.08" stroke="#ef4444" strokeWidth="0.8" />
            <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Temperature</text>
            <text x="0" y="18" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ef4444">35.2°</text>
            <text x="0" y="30" textAnchor="middle" fontSize="10" fill="#22c55e">Normal</text>
          </g>

          {/* Weight gauge */}
          <g transform="translate(45, -50)">
            <rect x="-35" y="-12" width="70" height="45" rx="4" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" strokeWidth="0.8" />
            <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">Weight</text>
            <text x="0" y="18" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b82f6">42 kg</text>
            <text x="0" y="30" textAnchor="middle" fontSize="10" fill="#22c55e">+0.3 today</text>
          </g>

          {/* Sound level */}
          <g transform="translate(-55, 20)">
            <rect x="-30" y="-12" width="60" height="45" rx="4" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="0.8" />
            <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22c55e">Sound</text>
            <text x="0" y="18" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#22c55e">250Hz</text>
            <text x="0" y="30" textAnchor="middle" fontSize="10" fill="#22c55e">Queen OK</text>
          </g>

          {/* Humidity */}
          <g transform="translate(45, 20)">
            <rect x="-35" y="-12" width="70" height="45" rx="4" fill="#a855f7" opacity="0.08" stroke="#a855f7" strokeWidth="0.8" />
            <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7">Humidity</text>
            <text x="0" y="18" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a855f7">65%</text>
            <text x="0" y="30" textAnchor="middle" fontSize="10" fill="#22c55e">Normal</text>
          </g>

          {/* Overall status */}
          <rect x="-75" y="68" width="150" height="24" rx="4" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
          <text x="0" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Colony Health: GOOD</text>
        </g>

        {/* Alert conditions — bottom */}
        <g transform="translate(285, 350)">
          <text x="0" y="-5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Alert Triggers</text>

          {[
            { label: "Temp drop", trigger: "<32°C", means: "Queen may be dead", color: "#ef4444" },
            { label: "Weight crash", trigger: "-2kg/day", means: "Swarm or robbing", color: "#3b82f6" },
            { label: "Sound change", trigger: "200→400Hz", means: "Queenless colony", color: "#22c55e" },
            { label: "Humidity spike", trigger: ">80%", means: "Ventilation issue", color: "#a855f7" },
          ].map((alert, i) => (
            <g key={i}>
              <circle cx={-195 + i * 130} cy="20" r="4" fill={alert.color} opacity="0.5" />
              <text x={-195 + i * 130} y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill={alert.color}>{alert.label}</text>
              <text x={-195 + i * 130} y="50" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{alert.trigger}</text>
              <text x={-195 + i * 130} y="64" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{alert.means}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
