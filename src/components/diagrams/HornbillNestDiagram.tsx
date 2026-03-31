export default function HornbillNestDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 420" className="w-full max-w-lg mx-auto" role="img" aria-label="Hornbill sealed nesting cavity showing female inside, mud wall, and feeding slit">
        <rect width="520" height="420" rx="12" className="fill-slate-900" />
        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Why Hornbills Seal Themselves In</text>

        {/* Tree trunk */}
        <rect x="120" y="50" width="280" height="340" rx="20" fill="#5c3d1e" stroke="#7c5a34" strokeWidth="2" />
        {/* Bark texture */}
        {[80, 130, 180, 230, 280, 330].map((y) => (
          <path key={y} d={`M 130,${y} Q 200,${y - 5} 260,${y + 3} Q 330,${y - 2} 390,${y}`} fill="none" stroke="#4a3015" strokeWidth="1.5" opacity="0.5" />
        ))}

        {/* Cavity inside tree */}
        <ellipse cx="260" cy="230" rx="95" ry="120" fill="#2d1b0e" stroke="#3d2815" strokeWidth="2" />

        {/* Nest material at bottom */}
        <ellipse cx="260" cy="320" rx="80" ry="25" fill="#7c5a34" />
        {[230, 250, 270, 290].map((x, i) => (
          <line key={i} x1={x - 10} y1="310" x2={x + 10} y2="325" stroke="#a67c52" strokeWidth="1.5" />
        ))}

        {/* Eggs */}
        <ellipse cx="240" cy="305" rx="10" ry="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
        <ellipse cx="260" cy="308" rx="10" ry="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
        <ellipse cx="278" cy="306" rx="10" ry="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />

        {/* Female hornbill inside cavity */}
        <g transform="translate(260, 220)">
          {/* Body */}
          <ellipse cx="0" cy="20" rx="30" ry="45" fill="#1c1917" />
          {/* Head */}
          <circle cx="-5" cy="-25" r="18" fill="#4a3728" />
          {/* Eye */}
          <circle cx="-12" cy="-28" r="5" fill="#fefce8" />
          <circle cx="-13" cy="-29" r="2.5" fill="#1c1917" />
          {/* Small casque */}
          <path d="M -5,-42 Q 5,-50 15,-42 Q 12,-38 -5,-38 Z" fill="#d97706" />
          {/* Bill pointing toward slit */}
          <path d="M 5,-30 Q 30,-28 50,-25" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
          {/* Wing */}
          <ellipse cx="10" cy="10" rx="22" ry="35" fill="#292524" />
          {/* Tail */}
          <rect x="-10" y="50" width="20" height="20" rx="3" fill="#fefce8" />
        </g>

        {/* Mud seal wall */}
        <path d="M 350,120 Q 355,180 358,230 Q 355,280 350,340" fill="none" stroke="#b45309" strokeWidth="12" strokeLinecap="round" />
        {/* Mud texture dots */}
        {[140, 170, 200, 230, 260, 290, 320].map((y, i) => (
          <circle key={i} cx={352 + (i % 2) * 4} cy={y} r="3" fill="#92400e" opacity="0.6" />
        ))}

        {/* Feeding slit */}
        <rect x="348" y="190" width="16" height="25" rx="3" fill="#2d1b0e" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="350" y="186" fontSize="8" fill="#fbbf24" fontWeight="bold">Slit</text>

        {/* Male hornbill outside */}
        <g transform="translate(430, 195)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="22" ry="30" fill="#1c1917" />
          {/* Head */}
          <circle cx="-10" cy="-25" r="14" fill="#4a3728" />
          {/* Eye */}
          <circle cx="-16" cy="-28" r="4" fill="#fefce8" />
          <circle cx="-17" cy="-29" r="2" fill="#1c1917" />
          {/* Casque (larger on male) */}
          <path d="M -10,-38 Q 5,-52 18,-38 Q 12,-32 -10,-34 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          {/* Bill with fruit */}
          <path d="M -20,-25 Q -40,-22 -55,-20" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
          {/* Fruit in bill */}
          <circle cx="-55" cy="-20" r="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
          {/* Wing */}
          <ellipse cx="8" cy="-5" rx="18" ry="25" fill="#292524" />
          {/* Tail */}
          <rect x="-6" y="22" width="14" height="16" rx="2" fill="#fefce8" />
        </g>

        {/* Labels */}
        {/* Female label */}
        <line x1="230" y1="170" x2="100" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="30" y="85" fontSize="10" fontWeight="bold" fill="#fbbf24">♀ Female</text>
        <text x="30" y="97" fontSize="8" className="fill-slate-400">Sealed inside for</text>
        <text x="30" y="108" fontSize="8" className="fill-slate-400">2–4 months</text>

        {/* Male label */}
        <line x1="445" y1="160" x2="470" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="420" y="85" fontSize="10" fontWeight="bold" fill="#fbbf24">♂ Male</text>
        <text x="410" y="97" fontSize="8" className="fill-slate-400">Feeds family</text>
        <text x="410" y="108" fontSize="8" className="fill-slate-400">through slit</text>

        {/* Mud wall label */}
        <line x1="358" y1="150" x2="390" y2="70" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="370" y="60" fontSize="10" fontWeight="bold" fill="#d97706">Mud + Droppings Wall</text>
        <text x="370" y="72" fontSize="8" className="fill-slate-400">Sealed by the female</text>

        {/* Bottom: why they seal */}
        <g transform="translate(20, 386)">
          <text x="0" y="0" fontSize="10" fill="#34d399" fontWeight="bold">Why seal?</text>
          <text x="65" y="0" fontSize="10" className="fill-slate-400">Protects eggs from snakes, monitor lizards, and other predators.</text>
          <text x="0" y="14" fontSize="10" fill="#34d399" fontWeight="bold">Who feeds?</text>
          <text x="80" y="14" fontSize="10" className="fill-slate-400">The male delivers fruit 50–70 times per day through the slit.</text>
        </g>
      </svg>
    </div>
  );
}
