export default function SonarSensorDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram of an ultrasonic distance sensor showing transmitter, receiver, and time-of-flight measurement">
        <defs>
          <marker id="ss-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="ss-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        <rect width="520" height="380" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Building a Sonar Sensor (HC-SR04)
        </text>

        {/* Sensor module */}
        <rect x="30" y="100" width="100" height="70" rx="6" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
        <text x="80" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-emerald-700 dark:fill-emerald-300">HC-SR04</text>

        {/* Transmitter cylinder */}
        <circle cx="55" cy="150" r="12" className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <text x="55" y="154" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">T</text>

        {/* Receiver cylinder */}
        <circle cx="105" cy="150" r="12" className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <text x="105" y="154" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">R</text>

        <text x="55" y="178" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Send</text>
        <text x="105" y="178" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Receive</text>

        {/* Target object */}
        <rect x="430" y="90" width="40" height="100" rx="4" className="fill-amber-200 dark:fill-amber-800 stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <text x="450" y="145" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">Wall</text>

        {/* Outgoing pulse */}
        <line x1="70" y1="135" x2="425" y2="110" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#ss-arr-a)" />
        {/* Pulse waves */}
        {[140, 200, 260, 320, 380].map((x, i) => (
          <path key={`pw-${i}`}
            d={`M ${x},${133 - i * 2} A 6,10 0 0,1 ${x},${140 - i * 2}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity={0.9 - i * 0.12} />
        ))}
        <text x="250" y="108" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">40 kHz ultrasound pulse</text>

        {/* Returning echo */}
        <line x1="425" y1="165" x2="120" y2="155" stroke="#3b82f6" strokeWidth="2" strokeDasharray="7,4" markerEnd="url(#ss-arr-b)" />
        <text x="280" y="175" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">Echo returns</text>

        {/* Time measurement */}
        <rect x="140" y="200" width="240" height="55" rx="8" className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1.5" />
        <text x="260" y="222" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-blue-700 dark:fill-blue-300">
          Distance = (Speed × Time) ÷ 2
        </text>
        <text x="260" y="240" textAnchor="middle" fontSize="11" className="fill-blue-600 dark:fill-blue-400">
          d = (343 m/s × t) ÷ 2
        </text>

        {/* Pin diagram */}
        <rect x="30" y="270" width="460" height="95" rx="8" className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="260" y="290" textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Sensor Pins
        </text>

        {/* VCC */}
        <rect x="50" y="300" width="80" height="24" rx="4" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1" />
        <text x="90" y="316" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">VCC (5V)</text>
        <text x="90" y="340" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Power</text>

        {/* TRIG */}
        <rect x="155" y="300" width="80" height="24" rx="4" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1" />
        <text x="195" y="316" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">TRIG</text>
        <text x="195" y="340" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Start pulse</text>

        {/* ECHO */}
        <rect x="260" y="300" width="80" height="24" rx="4" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        <text x="300" y="316" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">ECHO</text>
        <text x="300" y="340" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Measure time</text>

        {/* GND */}
        <rect x="365" y="300" width="80" height="24" rx="4" fill="#6b7280" opacity="0.2" stroke="#6b7280" strokeWidth="1" />
        <text x="405" y="316" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6b7280">GND</text>
        <text x="405" y="340" textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Ground</text>

        {/* Range note */}
        <text x="260" y="365" textAnchor="middle" fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">
          Range: 2 cm to 400 cm | Accuracy: ~3 mm | Cost: less than a cup of tea
        </text>
      </svg>
    </div>
  );
}
