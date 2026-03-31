export default function CorridorCameraTrapDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Camera trap monitoring: passive infrared sensors detect body heat and trigger photographs to track wildlife"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          Camera Trap Monitoring: Eyes in the Forest
        </text>

        {/* Camera trap device */}
        <g transform="translate(100, 120)">
          <rect x="-35" y="-25" width="70" height="50" rx="6" className="fill-gray-600 dark:fill-gray-700" />
          <rect x="-25" y="-18" width="20" height="16" rx="3" className="fill-gray-800 dark:fill-gray-600" />
          <circle cx="-15" cy="-10" r="5" className="fill-gray-400 dark:fill-gray-500" />
          {/* IR LEDs */}
          {[-20, -10, 0, 10, 20].map((dx) => (
            <circle key={dx} cx={dx} cy="15" r="2" fill="#ef4444" opacity="0.4" />
          ))}
          <text x="0" y="-32" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Camera Trap</text>
          <text x="0" y="38" textAnchor="middle" fontSize="9" className="fill-red-500 dark:fill-red-400">IR LEDs (night vision)</text>
        </g>

        {/* PIR detection cone */}
        <polygon points="135,130 350,80 350,200" fill="#ef4444" opacity="0.06" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
        <text x="250" y="110" textAnchor="middle" fontSize="10" className="fill-red-500 dark:fill-red-400">PIR detection zone</text>
        <text x="250" y="124" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">(senses body heat)</text>

        {/* Elephant crossing */}
        <text x="350" y="155" textAnchor="middle" fontSize="30">{'\ud83d\udc18'}</text>
        <text x="350" y="185" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">Animal crosses sensor</text>

        {/* How it works steps */}
        <rect x="420" y="70" width="260" height="155" rx="8" className="fill-amber-50 dark:fill-amber-950/20 stroke-amber-200 dark:stroke-amber-700" strokeWidth="1" />
        <text x="550" y="90" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">How Camera Traps Work</text>

        {[
          '1. PIR sensor detects infrared (body heat)',
          '2. Triggers camera shutter automatically',
          '3. IR flash illuminates without disturbing',
          '4. Stamps photo with date/time/location',
          '5. Stores on SD card for weeks/months',
        ].map((text, i) => (
          <text key={i} x="440" y={112 + i * 18} fontSize="10" className="fill-gray-600 dark:fill-slate-400">{text}</text>
        ))}

        {/* What data reveals */}
        <text x="350" y="250" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
          What Camera Trap Data Reveals
        </text>

        {[
          { x: 120, icon: '\ud83d\udcca', title: 'Population Count', desc: 'Identify individuals by\ntusk shape, ear tears, scars' },
          { x: 290, icon: '\ud83d\udd52', title: 'Activity Patterns', desc: 'Elephants use corridors\nmostly at night (10 PM - 4 AM)' },
          { x: 460, icon: '\ud83d\udccd', title: 'Route Mapping', desc: 'Confirm which corridors\nare actively used' },
          { x: 610, icon: '\ud83d\udc23', title: 'Breeding Evidence', desc: 'Calves = corridor supports\nreproduction' },
        ].map(({ x, icon, title, desc }) => (
          <g key={title}>
            <text x={x} y="280" textAnchor="middle" fontSize="16">{icon}</text>
            <text x={x} y="300" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{title}</text>
            {desc.split('\n').map((line, i) => (
              <text key={i} x={x} y={316 + i * 13} textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400">{line}</text>
            ))}
          </g>
        ))}

        {/* Bottom fact */}
        <rect x="60" y="370" width="580" height="56" rx="8" className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-200 dark:stroke-amber-800" strokeWidth="1" />
        <text x="350" y="392" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">
          Non-invasive monitoring: no capture, no disturbance, continuous data
        </text>
        <text x="350" y="410" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          A single camera trap can record thousands of animal passages over months
        </text>
      </svg>
    </div>
  );
}
