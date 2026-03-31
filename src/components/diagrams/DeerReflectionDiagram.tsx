export default function DeerReflectionDiagram() {
  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        Specular vs Diffuse Reflection — Why Gold Shines
      </p>
      <svg viewBox="0 0 620 320" className="w-full max-w-2xl mx-auto">
        {/* LEFT SIDE: Specular reflection */}
        <text x="155" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fbbf24">
          Specular (Mirror)
        </text>
        <text x="155" y="40" textAnchor="middle" fontSize="10" fill="#9ca3af">
          Smooth surface — one direction
        </text>

        {/* Smooth surface */}
        <rect x="50" y="180" width="210" height="8" rx={2} fill="#fbbf24" opacity={0.3} />
        <line x1="50" y1="180" x2="260" y2="180" stroke="#fbbf24" strokeWidth={2} />

        {/* Normal line */}
        <line x1="155" y1="110" x2="155" y2="180" stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeDasharray="4,3" />
        <text x="162" y="120" fontSize="10" fill="#6b7280">normal</text>

        {/* Incident ray */}
        <line x1="80" y1="70" x2="155" y2="180" stroke="white" strokeWidth={2.5} opacity={0.8} />
        <polygon points="80,70 88,78 76,80" fill="white" opacity={0.8} />
        <text x="86" y="115" fontSize="10" fill="white" transform="rotate(-45,86,115)">incoming</text>

        {/* Reflected ray */}
        <line x1="155" y1="180" x2="230" y2="70" stroke="#fbbf24" strokeWidth={2.5} />
        <polygon points="230,70 222,78 234,80" fill="#fbbf24" />
        <text x="210" y="115" fontSize="10" fill="#fbbf24" transform="rotate(45,210,115)">reflected</text>

        {/* Angle arcs */}
        <path d="M155,155 Q140,160 133,170" fill="none" stroke="white" strokeWidth={1} opacity={0.5} />
        <text x="125" y="160" fontSize="10" fill="white" opacity={0.6}>θᵢ</text>
        <path d="M155,155 Q170,160 177,170" fill="none" stroke="#fbbf24" strokeWidth={1} opacity={0.5} />
        <text x="178" y="160" fontSize="10" fill="#fbbf24" opacity={0.6}>θᵣ</text>

        {/* Law label */}
        <rect x="70" y="200" width="170" height="28" rx={5} fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth={1} />
        <text x="155" y="219" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">
          θᵢ = θᵣ always
        </text>

        {/* RIGHT SIDE: Diffuse reflection */}
        <text x="465" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#a78bfa">
          Diffuse (Matte)
        </text>
        <text x="465" y="40" textAnchor="middle" fontSize="10" fill="#9ca3af">
          Rough surface — many directions
        </text>

        {/* Rough surface */}
        <path d="M360,180 l8,-4 l6,6 l10,-5 l7,5 l9,-3 l6,4 l8,-6 l10,4 l7,-3 l9,5 l8,-4 l10,5 l7,-4 l9,3 l8,-5 l7,4 l10,-3 l6,5 l8,-4"
          stroke="#a78bfa" strokeWidth={2} fill="none" />
        <rect x="360" y="183" width="210" height="5" rx={2} fill="#a78bfa" opacity={0.15} />

        {/* Incoming ray */}
        <line x1="390" y1="70" x2="465" y2="180" stroke="white" strokeWidth={2.5} opacity={0.8} />
        <polygon points="390,70 398,78 386,80" fill="white" opacity={0.8} />

        {/* Scattered reflected rays */}
        {[
          { x2: 420, y2: 70, c: '#c4b5fd' },
          { x2: 440, y2: 55, c: '#a78bfa' },
          { x2: 465, y2: 50, c: '#8b5cf6' },
          { x2: 490, y2: 55, c: '#a78bfa' },
          { x2: 510, y2: 70, c: '#c4b5fd' },
          { x2: 460, y2: 80, c: '#8b5cf6' },
          { x2: 500, y2: 90, c: '#c4b5fd' },
        ].map((ray, i) => (
          <line key={i} x1="465" y1="180" x2={ray.x2} y2={ray.y2} stroke={ray.c} strokeWidth={1.5} opacity={0.6} />
        ))}

        {/* Explanation boxes */}
        <rect x="365" y="200" width="200" height="28" rx={5} fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth={1} />
        <text x="465" y="219" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a78bfa">
          Light scatters in all directions
        </text>

        {/* Bottom comparison */}
        <rect x="30" y="248" width="260" height="58" rx={8} fill="rgba(251,191,36,0.06)" stroke="#fbbf24" strokeWidth={1} strokeOpacity={0.3} />
        <text x="160" y="268" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">Metals (gold, silver, mirrors)</text>
        <text x="160" y="284" textAnchor="middle" fontSize="10" fill="#d4a017">Free electrons reflect light coherently.</text>
        <text x="160" y="298" textAnchor="middle" fontSize="10" fill="#d4a017">Gold absorbs blue, reflects yellow-red → golden shine.</text>

        <rect x="330" y="248" width="260" height="58" rx={8} fill="rgba(167,139,250,0.06)" stroke="#a78bfa" strokeWidth={1} strokeOpacity={0.3} />
        <text x="460" y="268" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a78bfa">Rough surfaces (paper, cloth, fur)</text>
        <text x="460" y="284" textAnchor="middle" fontSize="10" fill="#c4b5fd">Bumps scatter light in many directions.</text>
        <text x="460" y="298" textAnchor="middle" fontSize="10" fill="#c4b5fd">Visible from all angles, but no sharp image.</text>
      </svg>
    </div>
  );
}
