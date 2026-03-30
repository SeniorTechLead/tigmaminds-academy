export default function ActivityTreeMeasureDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 670 425"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tree measurement activity: wrap string around trunk, lay it straight, measure, and calculate diameter"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .formula { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        {/* Background */}
        <rect width="600" height="400" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Measure a Tree
        </text>

        {/* --- Step 1: Wrap string (left) --- */}
        <text x="155" y="58" textAnchor="middle" className="step fill-orange-400">1. Wrap</text>

        {/* Tree trunk */}
        <rect x="120" y="70" width="70" height="230" rx="8" fill="#78350f" />
        {/* Bark texture */}
        <line x1="135" y1="80" x2="135" y2="120" stroke="#92400e" strokeWidth="1" opacity="0.4" />
        <line x1="155" y1="90" x2="155" y2="150" stroke="#92400e" strokeWidth="1" opacity="0.3" />
        <line x1="170" y1="75" x2="170" y2="130" stroke="#92400e" strokeWidth="1" opacity="0.4" />
        <line x1="145" y1="160" x2="145" y2="220" stroke="#92400e" strokeWidth="1" opacity="0.3" />
        <line x1="165" y1="180" x2="165" y2="250" stroke="#92400e" strokeWidth="1" opacity="0.4" />

        {/* Ground */}
        <line x1="50" y1="300" x2="260" y2="300" stroke="#4ade80" strokeWidth="1.5" />
        <path d="M 50 300 Q 80 295 110 300 Q 140 305 170 300 Q 200 295 230 300 L 260 300 L 260 310 L 50 310 Z"
          fill="#365314" opacity="0.3" />

        {/* String wrapped around trunk at chest height */}
        <ellipse cx="155" cy="170" rx="40" ry="10" fill="none"
          stroke="#fbbf24" strokeWidth="3" />
        {/* String end dangling */}
        <path d="M 195 170 Q 200 175 198 185" stroke="#fbbf24" strokeWidth="2.5" fill="none" />

        {/* Person figure wrapping */}
        <g transform="translate(220, 140)">
          {/* Head */}
          <circle cx="0" cy="0" r="10" fill="#d4a574" />
          {/* Body */}
          <line x1="0" y1="10" x2="0" y2="50" stroke="#64748b" strokeWidth="3" />
          {/* Arms reaching around tree */}
          <path d="M 0 20 Q -15 15 -30 25" stroke="#64748b" strokeWidth="2.5" fill="none" />
          <path d="M 0 20 Q -20 30 -35 35" stroke="#64748b" strokeWidth="2.5" fill="none" />
          {/* Legs */}
          <line x1="0" y1="50" x2="-10" y2="75" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="8" y2="75" stroke="#64748b" strokeWidth="2.5" />
        </g>

        {/* Height label */}
        <line x1="100" y1="170" x2="100" y2="300" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3,3" />
        <text x="85" y="240" className="small fill-slate-400" transform="rotate(-90,85,240)">
          chest height
        </text>

        {/* Canopy hint */}
        <ellipse cx="155" cy="55" rx="80" ry="30" fill="#166534" opacity="0.3" />

        {/* --- Step 2: Lay straight (center) --- */}
        <text x="380" y="58" textAnchor="middle" className="step fill-green-400">2. Measure</text>

        {/* String laid straight */}
        <line x1="290" y1="120" x2="530" y2="120" stroke="#fbbf24" strokeWidth="3" />
        {/* String ends */}
        <circle cx="290" cy="120" r="4" fill="#fbbf24" />
        <circle cx="530" cy="120" r="4" fill="#fbbf24" />

        {/* Ruler underneath */}
        <rect x="290" y="130" width="240" height="18" rx="2" className="fill-gray-700 dark:fill-slate-200" />
        {/* Ruler marks */}
        {Array.from({ length: 25 }, (_, i) => {
          const x = 290 + i * 10;
          const h = i % 10 === 0 ? 12 : i % 5 === 0 ? 9 : 5;
          return (
            <g key={i}>
              <line x1={x} y1="130" x2={x} y2={130 + h} className="stroke-gray-200 dark:stroke-slate-800" strokeWidth={i % 10 === 0 ? 1 : 0.5} />
              {i % 10 === 0 && (
                <text x={x} y="146" textAnchor="middle" className="small fill-gray-100 dark:fill-slate-800">
                  {i * 5}
                </text>
              )}
            </g>
          );
        })}
        <text x="540" y="143" className="small fill-gray-100 dark:fill-slate-800">cm</text>

        {/* Measurement bracket */}
        <line x1="290" y1="108" x2="530" y2="108" stroke="#60a5fa" strokeWidth="1" />
        <line x1="290" y1="104" x2="290" y2="112" stroke="#60a5fa" strokeWidth="1" />
        <line x1="530" y1="104" x2="530" y2="112" stroke="#60a5fa" strokeWidth="1" />
        <text x="410" y="104" textAnchor="middle" className="label fill-blue-400">
          Circumference = 188 cm
        </text>

        {/* --- Step 3: Calculate (bottom right) --- */}
        <text x="410" y="185" textAnchor="middle" className="step fill-cyan-400">3. Calculate</text>

        {/* Calculation box */}
        <rect x="300" y="195" width="260" height="90" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="430" y="220" textAnchor="middle" className="formula fill-cyan-300">
          circumference ÷ 3.14 = diameter
        </text>
        <line x1="320" y1="230" x2="540" y2="230" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <text x="430" y="250" textAnchor="middle" className="label fill-slate-300">
          188 cm ÷ 3.14 = 59.9 cm diameter
        </text>
        <text x="430" y="270" textAnchor="middle" className="small fill-slate-400">
          Diameter tells you how old the tree might be
        </text>

        {/* --- Cross-section diagram (bottom left) --- */}
        <g transform="translate(155, 340)">
          {/* Tree cross section circle */}
          <circle cx="0" cy="0" r="40" fill="#92400e" opacity="0.5" />
          {/* Growth rings */}
          <circle cx="0" cy="0" r="32" fill="none" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="3" fill="#78350f" />

          {/* Diameter line */}
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="0" y="-6" textAnchor="middle" className="small fill-amber-400">diameter</text>

          {/* Circumference hint */}
          <circle cx="0" cy="0" r="42" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4,3" />
        </g>

        <text x="155" y="305" textAnchor="middle" className="small fill-slate-500">Cross section</text>

        {/* Bottom instruction */}
        <text x="410" y="315" textAnchor="middle" className="label fill-slate-400">
          Measure → calculate → estimate age
        </text>
        <text x="410" y="335" textAnchor="middle" className="small fill-slate-500">
          Rough rule: 2.5 cm diameter per year of growth
        </text>
        <text x="410" y="350" textAnchor="middle" className="small fill-green-400">
          59.9 cm ÷ 2.5 ≈ 24 years old!
        </text>

        {/* Materials */}
        <text x="410" y="375" textAnchor="middle" className="small fill-slate-600">
          You need: string, ruler or measuring tape
        </text>
      </svg>
    </div>
  );
}
