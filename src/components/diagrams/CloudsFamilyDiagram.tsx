export default function CloudsFamilyDiagram() {
  const w = 720;
  const h = 520;

  const clouds = [
    {
      name: "Cirrus",
      alt: 55,
      altLabel: "Above 6 000 m",
      desc: "Thin, wispy, ice crystals",
      weather: "Fair now — rain in 24–48 h",
      fill: "#e0e7ff",
      opacity: 0.5,
      shape: "wispy",
    },
    {
      name: "Cumulus",
      alt: 190,
      altLabel: "1 000–6 000 m",
      desc: "Puffy, flat base, cotton-ball",
      weather: "Fair weather (small ones)",
      fill: "#f1f5f9",
      opacity: 0.85,
      shape: "puffy",
    },
    {
      name: "Stratus",
      alt: 310,
      altLabel: "Below 2 000 m",
      desc: "Flat grey sheet, covers sky",
      weather: "Drizzle, overcast",
      fill: "#94a3b8",
      opacity: 0.7,
      shape: "flat",
    },
    {
      name: "Cumulonimbus",
      alt: 130,
      altLabel: "All levels — up to 15 000 m",
      desc: "Massive tower, anvil top",
      weather: "Thunder, heavy rain, hail",
      fill: "#475569",
      opacity: 0.9,
      shape: "tower",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label="Four main cloud families: cirrus at high altitude, cumulus in the middle, stratus low, and cumulonimbus towering through all levels"
      >
        <defs>
          <linearGradient id="cfam-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <rect width={w} height={h} rx="10" fill="url(#cfam-sky)" />

        {/* Title */}
        <text x={w / 2} y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f0f9ff">
          The Four Cloud Families
        </text>

        {/* Altitude scale on left */}
        {[
          { label: "12 000 m", y: 55 },
          { label: "6 000 m", y: 155 },
          { label: "2 000 m", y: 290 },
          { label: "Ground", y: 450 },
        ].map((t) => (
          <g key={t.label}>
            <line x1="70" y1={t.y} x2={w - 20} y2={t.y} stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <text x="65" y={t.y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {t.label}
            </text>
          </g>
        ))}

        {/* Ground */}
        <rect x="0" y="445" width={w} height="75" rx="0" fill="#166534" fillOpacity="0.3" />

        {/* CIRRUS — wispy lines */}
        <g>
          <path d="M120,60 Q160,50 200,62 Q240,55 260,65" fill="none" stroke={clouds[0].fill} strokeWidth="2" strokeOpacity="0.7" />
          <path d="M150,72 Q190,60 230,74 Q250,68 280,76" fill="none" stroke={clouds[0].fill} strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M130,80 Q170,70 210,82" fill="none" stroke={clouds[0].fill} strokeWidth="1" strokeOpacity="0.4" />
          <rect x="290" y="50" width="200" height="42" rx="4" fill="#1e293b" fillOpacity="0.7" />
          <text x="300" y="66" fontSize="13" fontWeight="700" fill="#e0e7ff">Cirrus</text>
          <text x="300" y="80" fontSize="10" fill="#cbd5e1">{clouds[0].desc}</text>
          <rect x="500" y="50" width="190" height="42" rx="4" fill="#1e3a5f" fillOpacity="0.7" />
          <text x="510" y="66" fontSize="10" fill="#86efac" fontWeight="600">{"☁ Weather signal:"}</text>
          <text x="510" y="80" fontSize="10" fill="#fde68a">{clouds[0].weather}</text>
        </g>

        {/* CUMULUS — puffy */}
        <g>
          <ellipse cx="160" cy="200" rx="45" ry="22" fill={clouds[1].fill} fillOpacity={clouds[1].opacity} />
          <ellipse cx="140" cy="190" rx="30" ry="18" fill="#f8fafc" fillOpacity="0.85" />
          <ellipse cx="175" cy="192" rx="28" ry="16" fill="#f8fafc" fillOpacity="0.8" />
          <ellipse cx="158" cy="182" rx="22" ry="14" fill="#ffffff" fillOpacity="0.9" />
          <rect x="290" y="175" width="200" height="42" rx="4" fill="#1e293b" fillOpacity="0.7" />
          <text x="300" y="191" fontSize="13" fontWeight="700" fill="#f1f5f9">Cumulus</text>
          <text x="300" y="205" fontSize="10" fill="#cbd5e1">{clouds[1].desc}</text>
          <rect x="500" y="175" width="190" height="42" rx="4" fill="#1e3a5f" fillOpacity="0.7" />
          <text x="510" y="191" fontSize="10" fill="#86efac" fontWeight="600">{"☁ Weather signal:"}</text>
          <text x="510" y="205" fontSize="10" fill="#fde68a">{clouds[1].weather}</text>
        </g>

        {/* STRATUS — flat sheet */}
        <g>
          <rect x="90" y="310" width="180" height="22" rx="10" fill={clouds[2].fill} fillOpacity={clouds[2].opacity} />
          <rect x="100" y="316" width="160" height="12" rx="6" fill="#64748b" fillOpacity="0.5" />
          <rect x="290" y="303" width="200" height="42" rx="4" fill="#1e293b" fillOpacity="0.7" />
          <text x="300" y="319" fontSize="13" fontWeight="700" fill="#94a3b8">Stratus</text>
          <text x="300" y="333" fontSize="10" fill="#cbd5e1">{clouds[2].desc}</text>
          <rect x="500" y="303" width="190" height="42" rx="4" fill="#1e3a5f" fillOpacity="0.7" />
          <text x="510" y="319" fontSize="10" fill="#86efac" fontWeight="600">{"☁ Weather signal:"}</text>
          <text x="510" y="333" fontSize="10" fill="#fde68a">{clouds[2].weather}</text>
        </g>

        {/* CUMULONIMBUS — tower */}
        <g>
          <rect x="90" y="105" width="100" height="330" rx="6" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
          {/* Dark base */}
          <rect x="80" y="370" width="120" height="60" rx="8" fill="#1e293b" fillOpacity="0.9" />
          {/* Tower body */}
          <path d="M90,370 Q85,260 100,170 Q110,130 140,110 Q170,130 180,170 Q195,260 190,370 Z" fill="#334155" fillOpacity="0.9" />
          {/* Anvil top */}
          <ellipse cx="140" cy="108" rx="70" ry="20" fill="#475569" fillOpacity="0.85" />
          <ellipse cx="140" cy="100" rx="50" ry="15" fill="#64748b" fillOpacity="0.7" />
          {/* Lightning bolt */}
          <path d="M135,380 L128,400 L138,398 L130,430" fill="none" stroke="#fde68a" strokeWidth="2" />
          {/* Rain */}
          {[100, 120, 140, 160].map((x) => (
            <line key={x} x1={x} y1={432} x2={x - 3} y2={444} stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          ))}

          <rect x="290" y="390" width="200" height="42" rx="4" fill="#1e293b" fillOpacity="0.7" />
          <text x="300" y="406" fontSize="13" fontWeight="700" fill="#64748b">Cumulonimbus</text>
          <text x="300" y="420" fontSize="10" fill="#cbd5e1">{clouds[3].desc}</text>
          <rect x="500" y="390" width="190" height="42" rx="4" fill="#1e3a5f" fillOpacity="0.7" />
          <text x="510" y="406" fontSize="10" fill="#86efac" fontWeight="600">{"☁ Weather signal:"}</text>
          <text x="510" y="420" fontSize="10" fill="#ef4444">{clouds[3].weather}</text>
        </g>

        {/* Bottom note */}
        <text x={w / 2} y={h - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">
          Dawan’s "grumpy Bah Rum" = cumulonimbus · "shy scout Ka Lum" = early cumulus · "steady Kong Lynshing" = stratus
        </text>
      </svg>
    </div>
  );
}
