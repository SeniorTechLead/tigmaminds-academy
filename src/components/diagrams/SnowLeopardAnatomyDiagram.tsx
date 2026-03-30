export default function SnowLeopardAnatomyDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 453"
        className="w-full"
        role="img"
        aria-label="Snow leopard anatomy showing adaptations for high altitude: thick fur, large nasal passages, wide paws, long tail, and powerful chest"
      >
        <rect x="0" y="0" width="600" height="420" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Snow Leopard — Built for Altitude
        </text>

        {/* Mountain background hint */}
        <polygon points="0,420 80,300 180,200 280,130 340,160 420,220 520,300 600,350 600,420" className="fill-gray-800/40" />
        <polygon points="240,150 280,130 320,145 300,142" className="fill-white/15" />

        {/* Snow leopard body — simplified side view silhouette */}
        <g transform="translate(300, 260)">
          {/* Tail — long and thick */}
          <path
            d="M-80,10 Q-120,30 -145,15 Q-160,8 -155,-5 Q-150,-12 -138,-5 Q-125,5 -80,5"
            className="fill-gray-400"
          />

          {/* Body */}
          <ellipse cx="0" cy="0" rx="75" ry="32" className="fill-gray-400" />

          {/* Fur texture — spots */}
          {[
            { x: -40, y: -10 }, { x: -20, y: 15 }, { x: 0, y: -15 },
            { x: 20, y: 10 }, { x: 40, y: -8 }, { x: -30, y: 5 },
            { x: 10, y: -5 }, { x: 35, y: 5 }, { x: -50, y: 0 },
            { x: -10, y: -20 }, { x: 25, y: -18 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r="4" className="fill-gray-500/60" />
          ))}

          {/* Hind legs */}
          <rect x="-45" y="25" width="14" height="35" rx="5" className="fill-gray-400" />
          <rect x="-28" y="25" width="14" height="30" rx="5" className="fill-gray-500" />

          {/* Front legs */}
          <rect x="35" y="25" width="14" height="35" rx="5" className="fill-gray-400" />
          <rect x="52" y="25" width="14" height="30" rx="5" className="fill-gray-500" />

          {/* Wide paws */}
          <ellipse cx="-38" cy="62" rx="10" ry="5" className="fill-gray-400" />
          <ellipse cx="42" cy="62" rx="10" ry="5" className="fill-gray-400" />

          {/* Head */}
          <circle cx="85" cy="-12" r="24" className="fill-gray-400" />
          {/* Ears */}
          <circle cx="75" cy="-34" r="7" className="fill-gray-400" />
          <circle cx="95" cy="-32" r="7" className="fill-gray-400" />
          <circle cx="75" cy="-34" r="4" className="fill-gray-500/60" />
          <circle cx="95" cy="-32" r="4" className="fill-gray-500/60" />
          {/* Eyes */}
          <circle cx="92" cy="-18" r="3.5" className="fill-gray-700" />
          <circle cx="93" cy="-19" r="1.5" className="fill-white/60" />
          {/* Nose */}
          <ellipse cx="106" cy="-10" rx="5" ry="4" className="fill-gray-600" />
          {/* Mouth line */}
          <path d="M103,-6 Q106,-3 109,-6" fill="none" className="stroke-gray-600" strokeWidth="1" />

          {/* Chest area — larger */}
          <ellipse cx="55" cy="5" rx="28" ry="30" className="fill-gray-400" />
        </g>

        {/* ADAPTATION LABELS with arrows */}

        {/* 1. Thick fur */}
        <g>
          <line x1="195" y1="230" x2="240" y2="255" className="stroke-blue-300" strokeWidth="1.5" />
          <circle cx="195" cy="230" r="2" className="fill-blue-300" />
          <rect x="90" y="215" width="105" height="30" rx="4" className="fill-blue-900/50" />
          <text x="142" y="228" textAnchor="middle" fontSize="9" className="fill-blue-300" fontWeight="700">
            Thick fur
          </text>
          <text x="142" y="240" textAnchor="middle" fontSize="7" className="fill-gray-400">
            Insulation at -40°C
          </text>
        </g>

        {/* 2. Large nasal passages */}
        <g>
          <line x1="450" y1="210" x2="405" y2="248" className="stroke-green-300" strokeWidth="1.5" />
          <circle cx="450" cy="210" r="2" className="fill-green-300" />
          <rect x="430" y="195" width="130" height="30" rx="4" className="fill-green-900/50" />
          <text x="495" y="208" textAnchor="middle" fontSize="9" className="fill-green-300" fontWeight="700">
            Large nasal passages
          </text>
          <text x="495" y="220" textAnchor="middle" fontSize="7" className="fill-gray-400">
            Warm thin cold air
          </text>
        </g>

        {/* 3. Wide paws */}
        <g>
          <line x1="215" y1="340" x2="260" y2="322" className="stroke-amber-300" strokeWidth="1.5" />
          <circle cx="215" cy="340" r="2" className="fill-amber-300" />
          <rect x="110" y="335" width="105" height="30" rx="4" className="fill-amber-900/50" />
          <text x="162" y="348" textAnchor="middle" fontSize="9" className="fill-amber-300" fontWeight="700">
            Wide paws
          </text>
          <text x="162" y="360" textAnchor="middle" fontSize="7" className="fill-gray-400">
            Natural snowshoes
          </text>
        </g>

        {/* 4. Long tail */}
        <g>
          <line x1="120" y1="280" x2="158" y2="272" className="stroke-white/70" strokeWidth="1.5" />
          <circle cx="120" cy="280" r="2" className="fill-white/70" />
          <rect x="20" y="268" width="100" height="30" rx="4" className="fill-gray-700/60" />
          <text x="70" y="281" textAnchor="middle" fontSize="9" className="fill-gray-200" fontWeight="700">
            Long thick tail
          </text>
          <text x="70" y="293" textAnchor="middle" fontSize="7" className="fill-gray-400">
            Balance + face warmer
          </text>
        </g>

        {/* 5. Powerful chest */}
        <g>
          <line x1="410" y1="290" x2="365" y2="268" className="stroke-red-300" strokeWidth="1.5" />
          <circle cx="410" cy="290" r="2" className="fill-red-300" />
          <rect x="400" y="280" width="140" height="30" rx="4" className="fill-red-900/40" />
          <text x="470" y="293" textAnchor="middle" fontSize="9" className="fill-red-300" fontWeight="700">
            Powerful chest
          </text>
          <text x="470" y="305" textAnchor="middle" fontSize="7" className="fill-gray-400">
            Efficient breathing at altitude
          </text>
        </g>

        {/* Insight bar */}
        <rect x="40" y="388" width="520" height="22" rx="4" className="fill-slate-800" />
        <text x="300" y="403" textAnchor="middle" fontSize="9" className="fill-gray-300" fontWeight="600">
          Every feature helps the snow leopard thrive at 3 000–5 500 m
        </text>
      </svg>
    </div>
  );
}
