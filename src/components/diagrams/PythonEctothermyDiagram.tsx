export default function PythonEctothermyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Ectothermy: python body temperature tracks environment while mammal stays constant"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Ectothermy: Cold-Blooded Is Not Cold
        </text>

        {/* Temperature graph */}
        <g transform="translate(100, 70)">
          {/* Axes */}
          <line x1="0" y1="0" x2="0" y2="200" stroke="#6b7280" strokeWidth="1.5" />
          <line x1="0" y1="200" x2="550" y2="200" stroke="#6b7280" strokeWidth="1.5" />
          <text x="275" y="228" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Time of Day</text>
          <text x="-50" y="100" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90, -50, 100)">
            Body Temperature ({"\u00B0"}C)
          </text>

          {/* Y axis ticks */}
          {[10, 20, 30, 37, 40].map((temp) => {
            const y = 200 - ((temp - 5) / 40) * 200;
            return (
              <g key={temp}>
                <line x1="-5" y1={y} x2="0" y2={y} stroke="#6b7280" strokeWidth="1" />
                <text x="-10" y={y + 4} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{temp}</text>
              </g>
            );
          })}

          {/* X axis labels */}
          {['6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((label, i) => (
            <text key={label} x={i * 100 + 25} y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{label}</text>
          ))}

          {/* Environment temp curve */}
          <path d="M 25,150 Q 100,120 175,80 Q 275,50 350,55 Q 425,70 475,120 Q 520,150 525,160"
            fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="6,3" />
          <text x="540" y="165" fontSize="10" className="fill-gray-500 dark:fill-slate-400">air temp</text>

          {/* Mammal body temp - constant line at 37C */}
          <path d="M 25,40 L 525,40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <text x="540" y="44" fontSize="10" fontWeight="600" className="fill-red-500 dark:fill-red-400">mammal (37{"\u00B0"}C)</text>

          {/* Python body temp - tracks environment with slight lag */}
          <path d="M 25,155 Q 120,128 190,88 Q 290,55 365,62 Q 440,78 485,125 Q 525,155 530,162"
            fill="none" stroke="#22c55e" strokeWidth="2.5" />
          <text x="545" y="168" fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-400">python</text>

          {/* Behavioral annotations */}
          <g transform="translate(40, -15)">
            <text x="0" y="0" fontSize="9" className="fill-green-500 dark:fill-green-400">basking</text>
            <line x1="10" y1="5" x2="10" y2="25" stroke="#22c55e" strokeWidth="0.8" />
          </g>
          <g transform="translate(300, -10)">
            <text x="0" y="0" fontSize="9" className="fill-green-500 dark:fill-green-400">active</text>
            <line x1="10" y1="5" x2="10" y2="15" stroke="#22c55e" strokeWidth="0.8" />
          </g>
          <g transform="translate(470, 90)">
            <text x="0" y="0" fontSize="9" className="fill-green-500 dark:fill-green-400">shelter</text>
            <line x1="10" y1="5" x2="10" y2="20" stroke="#22c55e" strokeWidth="0.8" />
          </g>
        </g>

        {/* Energy comparison */}
        <g transform="translate(390, 310)">
          <rect x="-330" y="0" width="660" height="80" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Energy Efficiency: Python vs Mammal
          </text>

          {/* Food bars */}
          <g transform="translate(-180, 38)">
            <rect x="0" y="0" width="200" height="14" rx="3" fill="#ef4444" opacity="0.5" />
            <text x="210" y="12" fontSize="10" className="fill-red-500 dark:fill-red-400">Mammal: 100% food intake</text>
          </g>
          <g transform="translate(-180, 58)">
            <rect x="0" y="0" width="20" height="14" rx="3" fill="#22c55e" opacity="0.7" />
            <text x="30" y="12" fontSize="10" className="fill-green-600 dark:fill-green-400">Python: only 10% needed (no heating cost!)</text>
          </g>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Bornali chose Mrin{"\u2019"}s warm house because the raised bamboo floor trapped heat {"\u2014"} free thermoregulation
        </text>
      </svg>
    </div>
  );
}
