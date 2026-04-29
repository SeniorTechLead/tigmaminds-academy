export default function BeeRobotDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 546 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="RoboBee diagram showing bee-inspired flight mechanics">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">RoboBee: Bee-Inspired Robotics</text>
        <text x="260" y="46" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Harvard&apos;s micro-aerial vehicle inspired by bee flight</text>

        {/* Real bee — left side */}
        <g transform="translate(140, 180)">
          <text x="0" y="-80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#eab308">Real Bee</text>

          {/* Wings */}
          <ellipse cx="-10" cy="-35" rx="35" ry="12" fill="#bfdbfe" opacity="0.2" stroke="#93c5fd" strokeWidth="0.8" transform="rotate(-15, -10, -35)" />
          <ellipse cx="10" cy="-35" rx="35" ry="12" fill="#bfdbfe" opacity="0.2" stroke="#93c5fd" strokeWidth="0.8" transform="rotate(15, 10, -35)" />

          {/* Body */}
          <ellipse cx="0" cy="-10" rx="14" ry="10" fill="#eab308" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="0" cy="15" rx="18" ry="22" fill="#eab308" stroke="#d97706" strokeWidth="1" />
          {/* Stripes */}
          <line x1="-12" y1="8" x2="12" y2="8" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="3" />
          <line x1="-14" y1="18" x2="14" y2="18" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="3" />
          <line x1="-12" y1="28" x2="12" y2="28" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="3" />
          {/* Head */}
          <circle cx="0" cy="-22" r="8" className="fill-gray-100 dark:fill-slate-800" />
          {/* Compound eyes */}
          <circle cx="-5" cy="-24" r="3" fill="#78350f" />
          <circle cx="5" cy="-24" r="3" fill="#78350f" />
          {/* Antennae */}
          <line x1="-3" y1="-30" x2="-10" y2="-45" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />
          <line x1="3" y1="-30" x2="10" y2="-45" className="stroke-gray-200 dark:stroke-slate-800" strokeWidth="1.5" />

          {/* Flight pattern annotation */}
          <path d="M -40,-40 Q -45,-30 -40,-20" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="-55" y="-25" fontSize="7" fill="#fcd34d">Figure-8</text>
          <text x="-55" y="-16" fontSize="7" fill="#fcd34d">wing stroke</text>

          {/* Stats */}
          <text x="0" y="55" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Weight: ~100 mg</text>
          <text x="0" y="66" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Wing beat: 230 Hz</text>
          <text x="0" y="77" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Speed: 24 km/h</text>
        </g>

        {/* Inspiration arrow */}
        <g transform="translate(260, 180)">
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="30,0 24,-4 24,4" fill="#fbbf24" />
          <text x="0" y="-10" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fbbf24">Inspires</text>
        </g>

        {/* RoboBee — right side */}
        <g transform="translate(380, 180)">
          <text x="0" y="-80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">RoboBee</text>

          {/* Wings — thin mechanical */}
          <line x1="-40" y1="-35" x2="-5" y2="-15" stroke="#93c5fd" strokeWidth="2" />
          <line x1="40" y1="-35" x2="5" y2="-15" stroke="#93c5fd" strokeWidth="2" />
          {/* Wing membrane */}
          <polygon points="-40,-35 -45,-25 -5,-15" fill="#93c5fd" opacity="0.15" stroke="#93c5fd" strokeWidth="0.5" />
          <polygon points="40,-35 45,-25 5,-15" fill="#93c5fd" opacity="0.15" stroke="#93c5fd" strokeWidth="0.5" />

          {/* Actuators at wing joints */}
          <rect x="-8" y="-18" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.6" />
          <rect x="2" y="-18" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.6" />

          {/* Body — circuit board style */}
          <rect x="-10" y="-10" width="20" height="40" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#60a5fa" strokeWidth="1.5" />
          {/* Circuit traces */}
          <line x1="-6" y1="-5" x2="6" y2="-5" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" />
          <line x1="-6" y1="5" x2="6" y2="5" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" />
          <line x1="-6" y1="15" x2="6" y2="15" stroke="#60a5fa" strokeWidth="0.8" opacity="0.4" />
          {/* IMU chip */}
          <rect x="-4" y="0" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.4" />
          {/* Sensor */}
          <circle cx="0" cy="-5" r="2" fill="#22c55e" opacity="0.6" />

          {/* Legs / landing gear */}
          <line x1="-6" y1="30" x2="-10" y2="40" stroke="#60a5fa" strokeWidth="1" />
          <line x1="6" y1="30" x2="10" y2="40" stroke="#60a5fa" strokeWidth="1" />

          {/* Piezoelectric label */}
          <line x1="15" y1="-15" x2="40" y2="-25" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
          <text x="42" y="-22" fontSize="7" fill="#93c5fd">Piezoelectric</text>
          <text x="42" y="-14" fontSize="7" fill="#93c5fd">actuators</text>

          {/* Stats */}
          <text x="0" y="55" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Weight: ~80 mg</text>
          <text x="0" y="66" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Wing beat: 120 Hz</text>
          <text x="0" y="77" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Wingspan: 3 cm</text>
        </g>

        {/* Bio-inspired features comparison — bottom */}
        <g transform="translate(260, 320)">
          <text x="0" y="-15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Key Bio-Inspired Features</text>

          {[
            { bee: "Figure-8 wing motion", robot: "Piezo-driven flapping", icon: "✈️" },
            { bee: "Compound eye vision", robot: "Optical flow sensors", icon: "👁️" },
            { bee: "Hive coordination", robot: "Multi-robot swarm AI", icon: "🤖" },
            { bee: "Pollen basket grip", robot: "Electrostatic adhesion", icon: "🔧" },
          ].map((feat, i) => (
            <g key={i}>
              <text x={-220} y={i * 18 + 5} fontSize="8" fill="#eab308">{feat.bee}</text>
              <text x={0} y={i * 18 + 5} textAnchor="middle" fontSize="8" fill="#fbbf24">→</text>
              <text x={20} y={i * 18 + 5} fontSize="8" fill="#93c5fd">{feat.robot}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
