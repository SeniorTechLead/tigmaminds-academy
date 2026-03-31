export default function PandaMaskFunctionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 480" className="w-full max-w-xl mx-auto" role="img" aria-label="Red panda face mask functions: counter-shading, glare reduction, and bark camouflage">
        <rect width="580" height="480" rx="12" className="fill-slate-900" />

        <text x="290" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fb923c">The Red Panda’s Mask — Three Functions</text>

        {/* ── Central red panda face ── */}
        <g transform="translate(200, 55)">
          {/* Head */}
          <circle cx="90" cy="90" r="65" fill="#c2410c" />

          {/* White face patches */}
          <ellipse cx="60" cy="75" rx="22" ry="18" fill="#fafaf9" />
          <ellipse cx="120" cy="75" rx="22" ry="18" fill="#fafaf9" />

          {/* Dark eye patches (the mask) */}
          <ellipse cx="65" cy="78" rx="10" ry="8" fill="#292524" />
          <ellipse cx="115" cy="78" rx="10" ry="8" fill="#292524" />

          {/* Eyes */}
          <circle cx="65" cy="78" r="4" fill="#fafaf9" />
          <circle cx="115" cy="78" r="4" fill="#fafaf9" />
          <circle cx="66" cy="77" r="2" fill="#1c1917" />
          <circle cx="116" cy="77" r="2" fill="#1c1917" />

          {/* White teardrop marks below eyes */}
          <ellipse cx="60" cy="95" rx="8" ry="5" fill="#fafaf9" opacity="0.8" />
          <ellipse cx="120" cy="95" rx="8" ry="5" fill="#fafaf9" opacity="0.8" />

          {/* Nose */}
          <ellipse cx="90" cy="100" rx="6" ry="4" fill="#1c1917" />

          {/* Mouth line */}
          <path d="M84,106 Q90,112 96,106" fill="none" stroke="#1c1917" strokeWidth="1.5" />

          {/* Ears */}
          <circle cx="40" cy="40" r="18" fill="#c2410c" />
          <circle cx="40" cy="40" r="12" fill="#7c2d12" />
          <circle cx="140" cy="40" r="18" fill="#c2410c" />
          <circle cx="140" cy="40" r="12" fill="#7c2d12" />

          {/* White ear tufts */}
          <circle cx="40" cy="40" r="6" fill="#fafaf9" opacity="0.5" />
          <circle cx="140" cy="40" r="6" fill="#fafaf9" opacity="0.5" />
        </g>

        {/* ── Function 1: Counter-shading ── */}
        <g transform="translate(15, 240)">
          <rect width="170" height="220" rx="8" fill="#fb923c" opacity="0.08" />
          <text x="85" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fb923c">1. Counter-shading</text>

          {/* Sun above */}
          <circle cx="85" cy="55" r="12" fill="#fbbf24" opacity="0.7" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <line key={`ray-${a}`}
              x1={85 + Math.cos(a * Math.PI / 180) * 15}
              y1={55 + Math.sin(a * Math.PI / 180) * 15}
              x2={85 + Math.cos(a * Math.PI / 180) * 20}
              y2={55 + Math.sin(a * Math.PI / 180) * 20}
              stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
          ))}

          {/* Light rays hitting face */}
          <line x1="85" y1="70" x2="85" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="70" y1="72" x2="60" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="100" y1="72" x2="110" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

          {/* Mini panda cross-section */}
          <ellipse cx="85" cy="120" rx="40" ry="20" fill="#c2410c" />
          {/* Dark top, light bottom */}
          <path d="M45,120 Q85,100 125,120" fill="#7c2d12" />
          <path d="M45,120 Q85,140 125,120" fill="#fed7aa" />

          <text x="85" y="160" textAnchor="middle" fontSize="10" fill="#fdba74">Dark on top absorbs</text>
          <text x="85" y="173" textAnchor="middle" fontSize="10" fill="#fdba74">sunlight from above</text>
          <text x="85" y="190" textAnchor="middle" fontSize="10" fill="#d1d5db">Light below reflects</text>
          <text x="85" y="203" textAnchor="middle" fontSize="10" fill="#d1d5db">shadow — flattening</text>
          <text x="85" y="216" textAnchor="middle" fontSize="10" fill="#d1d5db">the 3D shape</text>
        </g>

        {/* ── Function 2: Glare Reduction ── */}
        <g transform="translate(200, 240)">
          <rect width="170" height="220" rx="8" fill="#fb923c" opacity="0.08" />
          <text x="85" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fb923c">2. Glare Reduction</text>

          {/* Sun rays hitting dark patches around eyes */}
          <g transform="translate(35, 50)">
            {/* Eye area */}
            <ellipse cx="50" cy="40" rx="40" ry="25" fill="#fafaf9" opacity="0.3" />
            {/* Dark patches */}
            <ellipse cx="30" cy="40" rx="14" ry="10" fill="#292524" />
            <ellipse cx="70" cy="40" rx="14" ry="10" fill="#292524" />
            {/* Eyes */}
            <circle cx="30" cy="40" r="5" fill="#fafaf9" />
            <circle cx="70" cy="40" r="5" fill="#fafaf9" />
            <circle cx="31" cy="39" r="2.5" fill="#1c1917" />
            <circle cx="71" cy="39" r="2.5" fill="#1c1917" />

            {/* Sun glare arrows bouncing off dark patches */}
            <line x1="10" y1="10" x2="25" y2="32" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="25" y1="32" x2="15" y2="50" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
            <text x="0" y="60" fontSize="9" fill="#fbbf24">absorbed</text>

            <line x1="90" y1="10" x2="75" y2="32" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="75" y1="32" x2="85" y2="50" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
            <text x="75" y="60" fontSize="9" fill="#fbbf24">absorbed</text>
          </g>

          <text x="85" y="140" textAnchor="middle" fontSize="10" fill="#fdba74">Dark fur around eyes</text>
          <text x="85" y="153" textAnchor="middle" fontSize="10" fill="#fdba74">absorbs bright light</text>
          <text x="85" y="172" textAnchor="middle" fontSize="10" fill="#d1d5db">Same reason athletes</text>
          <text x="85" y="185" textAnchor="middle" fontSize="10" fill="#d1d5db">wear black eye paint</text>
          <text x="85" y="198" textAnchor="middle" fontSize="10" fill="#d1d5db">— reduces snow glare</text>
          <text x="85" y="211" textAnchor="middle" fontSize="10" fill="#d1d5db">in bright mountain sun</text>
        </g>

        {/* ── Function 3: Bark Camouflage ── */}
        <g transform="translate(385, 240)">
          <rect width="180" height="220" rx="8" fill="#fb923c" opacity="0.08" />
          <text x="90" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fb923c">3. Bark Camouflage</text>

          {/* Tree trunk */}
          <rect x="55" y="45" width="70" height="120" rx="4" fill="#78350f" />
          {/* Bark texture */}
          {[55, 70, 85, 100, 115, 130, 145].map((y, i) => (
            <line key={`tex-${i}`} x1={60 + (i % 2) * 5} y1={y} x2={120 - (i % 2) * 5} y2={y}
              stroke="#92400e" strokeWidth="1" opacity="0.5" />
          ))}

          {/* Moss patches */}
          <ellipse cx="70" cy="80" rx="12" ry="8" fill="#b45309" opacity="0.6" />
          <ellipse cx="110" cy="100" rx="10" ry="6" fill="#b45309" opacity="0.5" />
          <ellipse cx="80" cy="130" rx="14" ry="7" fill="#92400e" opacity="0.5" />

          {/* Red panda curled on branch */}
          <ellipse cx="90" cy="105" rx="25" ry="15" fill="#c2410c" opacity="0.85" />
          <circle cx="110" cy="98" r="8" fill="#c2410c" opacity="0.85" />
          {/* Tail */}
          <ellipse cx="65" cy="110" rx="15" ry="6" fill="#c2410c" opacity="0.7" transform="rotate(-15, 65, 110)" />

          {/* Raptor eye view arrow */}
          <text x="150" y="60" fontSize="10" fill="#fbbf24">{"🦅"}</text>
          <line x1="155" y1="65" x2="100" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

          <text x="90" y="182" textAnchor="middle" fontSize="10" fill="#fdba74">Reddish-brown fur</text>
          <text x="90" y="195" textAnchor="middle" fontSize="10" fill="#fdba74">matches mossy bark</text>
          <text x="90" y="213" textAnchor="middle" fontSize="10" fill="#d1d5db">From above, a curled</text>
          <text x="90" y="226" textAnchor="middle" fontSize="10" fill="#d1d5db">red panda is invisible</text>
        </g>
      </svg>
    </div>
  );
}
