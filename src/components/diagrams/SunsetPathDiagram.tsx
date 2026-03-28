export default function SunsetPathDiagram() {
  // Colours of the spectrum for the light beam
  const spectrumColors = [
    { color: '#8B00FF', label: 'Violet', survives: false },
    { color: '#4169E1', label: 'Blue', survives: false },
    { color: '#00A86B', label: 'Green', survives: false },
    { color: '#FFD700', label: 'Yellow', survives: 'partial' as const },
    { color: '#FF8C00', label: 'Orange', survives: true },
    { color: '#DC143C', label: 'Red', survives: true },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-indigo-950 to-orange-950 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
        Why Sunsets Are Orange — The Path Length Effect
      </p>
      <svg viewBox="0 0 520 280" className="w-full max-w-xl mx-auto">
        {/* Stars */}
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i} cx={30 + Math.random() * 460} cy={10 + Math.random() * 40} r={0.8} fill="white" opacity={0.3} />
        ))}

        {/* Earth surface curve */}
        <path d="M 0 250 Q 260 220 520 250 L 520 280 L 0 280 Z" fill="#2d5016" />
        <path d="M 0 252 Q 260 222 520 252" stroke="#4a7c28" strokeWidth={1} fill="none" />

        {/* Atmosphere band */}
        <path d="M 0 200 Q 260 170 520 200 L 520 250 Q 260 220 0 250 Z" fill="rgba(135,206,235,0.12)" />
        <text x="460" y="215" className="text-[8px]" fill="rgba(135,206,235,0.5)" textAnchor="end">atmosphere</text>

        {/* === NOON: Short path (left side) === */}
        {/* Sun */}
        <circle cx="130" cy="30" r="18" fill="#FFF8DC" />
        <circle cx="130" cy="30" r="14" fill="#FFD700" />
        {/* Rays */}
        {[0, 30, -30, 60, -60].map((angle, i) => (
          <line key={i} x1={130 + Math.sin(angle * Math.PI / 180) * 22} y1={30 + Math.cos(angle * Math.PI / 180) * 22}
            x2={130 + Math.sin(angle * Math.PI / 180) * 30} y2={30 + Math.cos(angle * Math.PI / 180) * 30}
            stroke="#FFD700" strokeWidth={1.5} />
        ))}

        {/* Noon light beam — short, all colours arrive */}
        <line x1="130" y1="48" x2="130" y2="200" stroke="white" strokeWidth={3} opacity={0.6} />
        <line x1="130" y1="200" x2="130" y2="240" stroke="white" strokeWidth={3} opacity={0.8} />

        {/* Person at noon */}
        <circle cx="130" cy="232" r="5" fill="#e5c07b" />
        <line x1="130" y1="237" x2="130" y2="248" stroke="#e5c07b" strokeWidth={1.5} />

        {/* Noon label */}
        <text x="130" y="268" textAnchor="middle" className="text-[10px] font-bold" fill="white">NOON</text>
        <text x="130" y="148" textAnchor="middle" className="text-[8px]" fill="rgba(255,255,255,0.7)">Short path</text>
        <text x="130" y="158" textAnchor="middle" className="text-[8px]" fill="rgba(255,255,255,0.7)">~20 km of air</text>

        {/* Colour dots arriving at noon — all survive */}
        {spectrumColors.map((c, i) => (
          <circle key={i} cx={108 + i * 9} cy="185" r={3.5} fill={c.color} opacity={0.9} />
        ))}
        <text x="130" y="178" textAnchor="middle" className="text-[7px]" fill="rgba(255,255,255,0.6)">All colours arrive</text>

        {/* === SUNSET: Long path (right side) === */}
        {/* Sun at horizon */}
        <circle cx="480" cy="225" r="18" fill="#FF6B35" opacity={0.8} />
        <circle cx="480" cy="225" r="14" fill="#FF4500" />

        {/* Sunset light beam — long, angled through atmosphere */}
        <line x1="466" y1="222" x2="370" y2="235" stroke="#FF8C00" strokeWidth={2.5} opacity={0.5} strokeDasharray="4 2" />
        <line x1="370" y1="235" x2="370" y2="240" stroke="#FF4500" strokeWidth={2.5} opacity={0.8} />

        {/* Person at sunset */}
        <circle cx="370" cy="232" r="5" fill="#e5c07b" />
        <line x1="370" y1="237" x2="370" y2="248" stroke="#e5c07b" strokeWidth={1.5} />

        {/* Sunset label */}
        <text x="370" y="268" textAnchor="middle" className="text-[10px] font-bold" fill="#FF8C00">SUNSET</text>

        {/* Long path label */}
        <text x="420" y="208" textAnchor="middle" className="text-[8px]" fill="rgba(255,165,0,0.7)">Long path</text>
        <text x="420" y="218" textAnchor="middle" className="text-[8px]" fill="rgba(255,165,0,0.7)">~300 km of air</text>

        {/* Colours being scattered away along the path */}
        {/* Violet — scattered early */}
        <circle cx="460" cy="215" r={2.5} fill="#8B00FF" opacity={0.4} />
        <line x1="460" y1="215" x2="455" y2="195" stroke="#8B00FF" strokeWidth={0.8} opacity={0.3} />
        <text x="455" y="190" className="text-[6px]" fill="#8B00FF" textAnchor="middle" opacity={0.5}>scattered</text>

        {/* Blue — scattered mid-path */}
        <circle cx="440" cy="222" r={2.5} fill="#4169E1" opacity={0.4} />
        <line x1="440" y1="222" x2="435" y2="200" stroke="#4169E1" strokeWidth={0.8} opacity={0.3} />

        {/* Green — scattered later */}
        <circle cx="420" cy="228" r={2.5} fill="#00A86B" opacity={0.3} />
        <line x1="420" y1="228" x2="415" y2="208" stroke="#00A86B" strokeWidth={0.8} opacity={0.3} />

        {/* Only orange and red survive */}
        <circle cx="385" cy="232" r={3.5} fill="#FF8C00" opacity={0.9} />
        <circle cx="395" cy="232" r={3.5} fill="#DC143C" opacity={0.9} />
        <text x="390" y="225" textAnchor="middle" className="text-[7px]" fill="rgba(255,165,0,0.8)">Only these survive</text>

        {/* Comparison arrow */}
        <text x="260" y="130" textAnchor="middle" className="text-[9px] font-semibold" fill="rgba(255,255,255,0.5)">More air = more scattering</text>
        <text x="260" y="142" textAnchor="middle" className="text-[9px] font-semibold" fill="rgba(255,255,255,0.5)">= fewer short wavelengths survive</text>

        {/* Bottom summary */}
        <rect x="60" y="85" width="160" height="28" rx="6" fill="rgba(255,255,255,0.08)" />
        <text x="140" y="98" textAnchor="middle" className="text-[8px]" fill="white">
          <tspan fontWeight="bold">Noon:</tspan> white-yellow sun
        </text>
        <text x="140" y="108" textAnchor="middle" className="text-[8px]" fill="rgba(255,255,255,0.7)">All colours arrive ✓</text>

        <rect x="300" y="85" width="160" height="28" rx="6" fill="rgba(255,140,0,0.15)" />
        <text x="380" y="98" textAnchor="middle" className="text-[8px]" fill="#FF8C00">
          <tspan fontWeight="bold">Sunset:</tspan> orange-red sun
        </text>
        <text x="380" y="108" textAnchor="middle" className="text-[8px]" fill="rgba(255,165,0,0.7)">Blue, green scattered away ✗</text>
      </svg>
    </div>
  );
}
