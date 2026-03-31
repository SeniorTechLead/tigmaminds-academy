export default function DeeporBeelDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 620"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Deepor Beel wetland: Ramsar site near Guwahati showing migratory birds, biodiversity, and the conflict between urbanisation and dark skies"
      >
        <defs>
          <linearGradient id="db-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c0a1a" />
            <stop offset="60%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="db-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="db-city" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="db-moon" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>

        {/* Night sky */}
        <rect width="780" height="620" fill="url(#db-sky)" />

        {/* Stars */}
        {[[80,25],[180,50],[300,18],[420,40],[530,12],[650,35],[720,60],[110,80],[380,65],[590,75],[240,42],[460,28],[140,100],[550,55],[680,90],[350,95],[90,55],[500,48],[260,70],[620,22]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 2 : 1} fill="#e0e7ff" opacity={0.3 + (i % 3) * 0.2} />
        ))}

        {/* Milky Way band */}
        <ellipse cx="390" cy="50" rx="300" ry="35" fill="#818cf8" opacity="0.04" />

        {/* Moon */}
        <circle cx="680" cy="70" r="18" fill="url(#db-moon)" />

        {/* Title */}
        <text x="390" y="130" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Deepor Beel \u2014 A Wetland Under the Stars
        </text>
        <text x="390" y="150" textAnchor="middle" fontSize="11" fill="#c4b5fd">
          Ramsar Site \u00B7 Guwahati, Assam \u00B7 One of India\u2019s most important urban wetlands
        </text>

        {/* City glow on right side */}
        <rect x="580" y="300" width="200" height="320" fill="url(#db-city)" />

        {/* City skyline (right) */}
        <g transform="translate(620, 350)">
          {[[0,0,20,50],[25,10,15,40],[45,5,18,45],[68,15,12,35],[85,0,22,50],[112,8,16,42]].map(([x,y,w,h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
              {/* Windows */}
              {Array.from({length: Math.floor(h / 10)}, (_, j) => (
                <rect key={j} x={x + 3} y={y + 5 + j * 10} width={w - 6} height={4} fill="#fbbf24" opacity={0.3 + Math.random() * 0.3} rx="0.5" />
              ))}
            </g>
          ))}
          <text x="60" y="65" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="600">Guwahati</text>
        </g>

        {/* Light pollution arrows */}
        <g opacity="0.4">
          {[[640,340,620,290],[670,340,660,280],[700,340,710,285]].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          ))}
        </g>
        <text x="665" y="272" textAnchor="middle" fontSize="10" fill="#fbbf24" opacity="0.6">Light pollution</text>

        {/* Wetland water body */}
        <ellipse cx="330" cy="440" rx="280" ry="80" fill="url(#db-water)" stroke="#1e40af" strokeWidth="1" opacity="0.7" />

        {/* Water surface reflections */}
        {[[180,425],[250,445],[300,455],[370,440],[420,430],[280,460],[350,465],[230,435]].map(([x,y], i) => (
          <line key={i} x1={x} y1={y} x2={x + 12} y2={y} stroke="#60a5fa" strokeWidth="0.5" opacity="0.3" />
        ))}

        {/* Lotus flowers */}
        {[[220,420],[310,460],[400,435],[260,450]].map(([x,y], i) => (
          <g key={i} transform={`translate(\${x},\${y})`}>
            <ellipse cx="0" cy="2" rx="8" ry="3" fill="#166534" opacity="0.5" />
            <path d="M 0 0 Q -4 -6 0 -10 Q 4 -6 0 0" fill="#f9a8d4" opacity="0.7" />
            <path d="M 0 0 Q -6 -4 -3 -9 Q 0 -6 0 0" fill="#fda4af" opacity="0.5" />
            <path d="M 0 0 Q 6 -4 3 -9 Q 0 -6 0 0" fill="#fda4af" opacity="0.5" />
          </g>
        ))}

        {/* Reeds on left shore */}
        {[[60,400],[75,395],[85,405],[50,410],[95,398]].map(([x,y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 2} y2={y - 35 - i * 3} stroke="#166534" strokeWidth="1.5" />
            <ellipse cx={x + 2} cy={y - 37 - i * 3} rx="2" ry="5" fill="#15803d" opacity="0.6" />
          </g>
        ))}

        {/* Migratory birds */}
        {/* Bar-headed geese in V formation */}
        <g transform="translate(250, 200)" opacity="0.8">
          {[[-30,15],[-15,8],[0,0],[15,8],[30,15]].map(([x,y], i) => (
            <path key={i} d={`M \${x-6} \${y+2} Q \${x} \${y-4} \${x+6} \${y+2}`} fill="none" stroke="#e0e7ff" strokeWidth="1.5" />
          ))}
        </g>
        <text x="280" y="228" textAnchor="middle" fontSize="10" fill="#c4b5fd">Bar-headed geese</text>

        {/* Pelican on water */}
        <g transform="translate(370, 420)">
          <ellipse cx="0" cy="0" rx="10" ry="5" fill="#e0e7ff" opacity="0.6" />
          <path d="M -8 -3 Q -4 -12 2 -8 Q 6 -4 10 -6" fill="none" stroke="#e0e7ff" strokeWidth="1" />
          <circle cx="-6" cy="-9" r="3" fill="#e0e7ff" opacity="0.5" />
        </g>

        {/* Dark sky vs light sky comparison */}
        <rect x="30" y="490" width="340" height="100" rx="8" fill="#0f172a" stroke="#818cf8" strokeWidth="1" />
        <text x="200" y="512" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818cf8">Dark Sky (Deepor Beel side)</text>
        <text x="200" y="530" textAnchor="middle" fontSize="11" fill="#c4b5fd">Milky Way visible</text>
        <text x="200" y="546" textAnchor="middle" fontSize="11" fill="#c4b5fd">Migratory birds navigate by stars</text>
        <text x="200" y="562" textAnchor="middle" fontSize="11" fill="#c4b5fd">Natural circadian rhythm maintained</text>
        <text x="200" y="580" textAnchor="middle" fontSize="11" fill="#22c55e">Bortle Class 3\u20134</text>

        <rect x="410" y="490" width="340" height="100" rx="8" fill="#1c1917" stroke="#fbbf24" strokeWidth="1" />
        <text x="580" y="512" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">Light Pollution (City side)</text>
        <text x="580" y="530" textAnchor="middle" fontSize="11" fill="#fde68a">Only brightest stars visible</text>
        <text x="580" y="546" textAnchor="middle" fontSize="11" fill="#fde68a">Confuses nocturnal wildlife &amp; birds</text>
        <text x="580" y="562" textAnchor="middle" fontSize="11" fill="#fde68a">Wastes energy, disrupts ecosystems</text>
        <text x="580" y="580" textAnchor="middle" fontSize="11" fill="#ef4444">Bortle Class 7\u20138</text>
      </svg>
    </div>
  );
}
