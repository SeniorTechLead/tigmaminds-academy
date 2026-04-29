export default function BridgeTensileStrengthDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 700 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tensile strength comparison: Ficus elastica root cross-section and how roots vs steel handle tension"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 9.5px; }
          .val { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
        `}</style>

        <rect width="700" height="480" rx="8" className="fill-slate-900" />

        <text x="350" y="28" textAnchor="middle" className="title fill-emerald-300">
          Why Roots Are Stronger Than You Think
        </text>

        {/* --- LEFT: Root cross-section --- */}
        <text x="170" y="58" textAnchor="middle" className="label fill-amber-300" fontWeight="600">
          Root Cross-Section
        </text>

        {/* Outer circle - epidermis */}
        <circle cx="170" cy="170" r="80" fill="#5c4033" opacity="0.3" stroke="#8B7355" strokeWidth="2" />
        {/* Cortex ring */}
        <circle cx="170" cy="170" r="65" fill="#6b7a3d" opacity="0.3" stroke="#7cb342" strokeWidth="1.5" />
        {/* Endodermis */}
        <circle cx="170" cy="170" r="45" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Vascular cylinder */}
        <circle cx="170" cy="170" r="35" fill="#4a6741" opacity="0.5" stroke="#aed581" strokeWidth="1.5" />

        {/* Xylem vessels (star pattern) */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 170 + 20 * Math.cos(rad);
          const y = 170 + 20 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="6" fill="#1e40af" opacity="0.7" stroke="#60a5fa" strokeWidth="1" />;
        })}
        {/* Phloem between xylem */}
        {[36, 108, 180, 252, 324].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 170 + 22 * Math.cos(rad);
          const y = 170 + 22 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="4" fill="#f59e0b" opacity="0.5" />;
        })}

        {/* Labels for layers */}
        <line x1="250" y1="100" x2="230" y2="130" stroke="#8B7355" strokeWidth="0.8" />
        <text x="255" y="100" className="small fill-slate-300">Epidermis (protection)</text>
        <line x1="250" y1="140" x2="225" y2="155" stroke="#7cb342" strokeWidth="0.8" />
        <text x="255" y="140" className="small fill-green-300">Cortex (storage)</text>
        <line x1="250" y1="170" x2="210" y2="170" stroke="#fbbf24" strokeWidth="0.8" />
        <text x="255" y="170" className="small fill-amber-300">Endodermis (barrier)</text>
        <line x1="250" y1="200" x2="205" y2="185" stroke="#60a5fa" strokeWidth="0.8" />
        <text x="255" y="200" className="small fill-blue-300">Xylem (water + lignin = strength)</text>
        <line x1="250" y1="220" x2="195" y2="195" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="255" y="220" className="small fill-amber-400">Phloem (sugar transport)</text>

        {/* Lignin callout */}
        <rect x="40" y="268" width="260" height="38" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />
        <text x="50" y="284" className="small fill-emerald-300" fontWeight="600">Lignin</text>
        <text x="95" y="284" className="small fill-slate-300">= rigid polymer reinforcing xylem walls</text>
        <text x="50" y="298" className="small fill-slate-400">Same molecule that makes wood hard and strong</text>

        {/* --- RIGHT: Bar chart comparison --- */}
        <text x="530" y="58" textAnchor="middle" className="label fill-amber-300" fontWeight="600">
          Tensile Strength (MPa)
        </text>

        {/* Chart area */}
        <line x1="420" y1="75" x2="420" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="420" y1="260" x2="650" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />

        {/* Scale marks */}
        {[0, 100, 200, 300, 400, 500].map((v, i) => {
          const y = 260 - (v / 500) * 180;
          return (
            <g key={i}>
              <line x1="415" y1={y} x2="420" y2={y} className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
              <text x="410" y={y + 4} textAnchor="end" className="small fill-slate-500">{v}</text>
            </g>
          );
        })}

        {/* Bars */}
        {/* Root: 10-40 MPa range */}
        <rect x="435" y={260 - (40 / 500) * 180} width="40" height={(40 / 500) * 180} rx="3" fill="#16a34a" opacity="0.7" />
        <rect x="435" y={260 - (10 / 500) * 180} width="40" height={(10 / 500) * 180} rx="0" fill="#22c55e" opacity="0.4" />
        <text x="455" y="278" textAnchor="middle" className="small fill-green-300">Root</text>
        <text x="455" y="290" textAnchor="middle" className="small fill-green-400">10-40</text>

        {/* Wood: ~100 MPa */}
        <rect x="490" y={260 - (100 / 500) * 180} width="40" height={(100 / 500) * 180} rx="3" fill="#92400e" opacity="0.7" />
        <text x="510" y="278" textAnchor="middle" className="small fill-amber-300">Wood</text>
        <text x="510" y="290" textAnchor="middle" className="small fill-amber-400">~100</text>

        {/* Steel: 400 MPa */}
        <rect x="545" y={260 - (400 / 500) * 180} width="40" height={(400 / 500) * 180} rx="3" className="fill-gray-400 dark:fill-slate-500" opacity="0.7" />
        <text x="565" y="278" textAnchor="middle" className="small fill-slate-300">Steel</text>
        <text x="565" y="290" textAnchor="middle" className="small fill-slate-400">~400</text>

        {/* Spider silk: 500 MPa */}
        <rect x="600" y={260 - (500 / 500) * 180} width="40" height={(500 / 500) * 180} rx="3" fill="#7c3aed" opacity="0.6" />
        <text x="620" y="278" textAnchor="middle" className="small fill-purple-300">Silk</text>
        <text x="620" y="290" textAnchor="middle" className="small fill-purple-400">~500</text>

        {/* --- BOTTOM: The key insight --- */}
        <rect x="30" y="320" width="640" height="140" rx="6" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />

        <text x="350" y="342" textAnchor="middle" className="label fill-emerald-300" fontWeight="600">
          The Root Bridge Advantage: Self-Reinforcement
        </text>

        {/* Steel cable - static */}
        <g transform="translate(80, 365)">
          <rect x="0" y="0" width="220" height="8" rx="2" className="fill-gray-400 dark:fill-slate-500" />
          {/* Force arrows */}
          <polygon points="-15,4 0,0 0,8" fill="#ef4444" />
          <polygon points="235,4 220,0 220,8" fill="#ef4444" />
          <text x="-20" y="5" textAnchor="end" className="small fill-red-400">pull</text>
          <text x="240" y="5" className="small fill-red-400">pull</text>
          <text x="110" y="30" textAnchor="middle" className="small fill-slate-400">Steel cable: fixed thickness</text>
          <text x="110" y="42" textAnchor="middle" className="small fill-slate-500">Eventually fatigues and snaps</text>
        </g>

        {/* Living root - adaptive */}
        <g transform="translate(400, 360)">
          {/* Root that thickens at stress point */}
          <path d="M 0 5 Q 60 5 110 0 Q 130 -3 140 0 Q 150 3 160 5 Q 220 5 260 5"
            fill="none" stroke="#16a34a" strokeWidth="3" />
          <path d="M 0 9 Q 60 9 110 14 Q 130 17 140 14 Q 150 11 160 9 Q 220 9 260 9"
            fill="none" stroke="#16a34a" strokeWidth="3" />
          {/* Thicker region */}
          <ellipse cx="135" cy="7" rx="30" ry="12" fill="#16a34a" opacity="0.3" />
          {/* Force arrows */}
          <polygon points="-15,7 0,3 0,11" fill="#ef4444" />
          <polygon points="275,7 260,3 260,11" fill="#ef4444" />
          <text x="-20" y="8" textAnchor="end" className="small fill-red-400">pull</text>
          <text x="280" y="8" className="small fill-red-400">pull</text>
          <text x="135" y="-10" textAnchor="middle" className="small fill-green-300">grows thicker here!</text>
          <text x="135" y="35" textAnchor="middle" className="small fill-green-400">Living root: thickens where stressed</text>
          <text x="135" y="47" textAnchor="middle" className="small fill-green-500">Gets STRONGER under load</text>
        </g>
      </svg>
    </div>
  );
}
