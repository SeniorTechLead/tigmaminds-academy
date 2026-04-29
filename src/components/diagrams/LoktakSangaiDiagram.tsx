export default function LoktakSangaiDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 420" className="w-full max-w-2xl mx-auto" role="img" aria-label="Sangai deer adaptations for life on floating phumdis">
        <rect width="560" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Sangai: Built for a Floating World</text>

        {/* Phumdi surface */}
        <path d="M20,300 Q100,285 200,295 Q300,280 400,290 Q480,282 540,300 L540,340 Q480,350 400,345 Q300,355 200,348 Q100,355 20,340 Z" fill="#166534" opacity="0.5" />
        <path d="M20,300 Q100,285 200,295 Q300,280 400,290 Q480,282 540,300" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />

        {/* Water below phumdi */}
        <rect x="20" y="340" width="520" height="50" fill="#1e3a5f" opacity="0.4" rx="4" />

        {/* Simplified deer body */}
        <g transform="translate(160, 140)">
          {/* Body */}
          <ellipse cx="100" cy="80" rx="70" ry="35" fill="#b45309" opacity="0.8" />
          {/* Neck */}
          <path d="M40,65 Q20,30 30,0" fill="none" stroke="#b45309" strokeWidth="18" strokeLinecap="round" />
          {/* Head */}
          <ellipse cx="28" cy="-5" rx="20" ry="14" fill="#92400e" />
          {/* Antler */}
          <path d="M20,-15 Q10,-40 5,-50 M20,-15 Q25,-45 35,-50" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M5,-50 Q0,-55 -5,-48 M35,-50 Q40,-55 42,-46" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="20" cy="-6" r="3" fill="#fbbf24" />
          <circle cx="20" cy="-6" r="1.5" fill="#1f2937" />

          {/* Front legs — high-stepping "dancing" gait */}
          <line x1="55" y1="105" x2="45" y2="145" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          <line x1="65" y1="105" x2="75" y2="130" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          {/* Lifted front leg */}
          <line x1="75" y1="130" x2="85" y2="125" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />

          {/* Back legs */}
          <line x1="140" y1="105" x2="135" y2="150" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          <line x1="150" y1="105" x2="160" y2="148" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />

          {/* Broad hooves */}
          <ellipse cx="43" cy="148" rx="8" ry="4" fill="#78350f" />
          <ellipse cx="134" cy="153" rx="8" ry="4" fill="#78350f" />
          <ellipse cx="159" cy="151" rx="8" ry="4" fill="#78350f" />
        </g>

        {/* Adaptation callouts */}
        {/* 1. Broad hooves */}
        <line x1="295" y1="295" x2="350" y2="340" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="310" y="342" width="220" height="36" rx="5" fill="#78350f" opacity="0.3" />
        <text x="420" y="356" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Broad, splayed hooves</text>
        <text x="420" y="370" textAnchor="middle" fontSize="8" fill="#fcd34d">Spread weight like snowshoes on soft phumdi</text>

        {/* 2. Short legs / low center of gravity */}
        <line x1="330" y1="250" x2="420" y2="220" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="400" y="205" width="150" height="36" rx="5" fill="#1e3a5f" opacity="0.3" />
        <text x="475" y="219" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#93c5fd">Short, sturdy legs</text>
        <text x="475" y="233" textAnchor="middle" fontSize="8" fill="#7dd3fc">Low centre of gravity for balance</text>

        {/* 3. Dancing gait */}
        <line x1="240" y1="260" x2="130" y2="250" stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="20" y="235" width="160" height="36" rx="5" fill="#831843" opacity="0.3" />
        <text x="100" y="249" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f9a8d4">High-stepping gait</text>
        <text x="100" y="263" textAnchor="middle" fontSize="8" fill="#f472b6">The "dance" = testing each step</text>

        {/* 4. Antlers */}
        <line x1="195" y1="100" x2="100" y2="80" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" />
        <rect x="10" y="62" width="140" height="36" rx="5" fill="#78350f" opacity="0.3" />
        <text x="80" y="76" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">Brow antlers</text>
        <text x="80" y="90" textAnchor="middle" fontSize="8" fill="#fcd34d">Distinctive forward-curving tines</text>

        {/* Population count */}
        <rect x="380" y="44" width="160" height="42" rx="8" fill="#7f1d1d" opacity="0.4" />
        <text x="460" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">~260 remaining</text>
        <text x="460" y="78" textAnchor="middle" fontSize="9" fill="#fca5a5" opacity="0.8">All on Loktak Lake</text>

        {/* Weight distribution diagram */}
        <rect x="20" y="385" width="520" height="25" rx="5" fill="#065f46" opacity="0.25" />
        <text x="280" y="402" textAnchor="middle" fontSize="10" fill="#6ee7b7">Snowshoe principle: wider base = less pressure per cm2 = phumdi holds</text>
      </svg>
    </div>
  );
}
