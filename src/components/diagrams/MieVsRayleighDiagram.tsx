export default function MieVsRayleighDiagram() {
  return (
    <div className="bg-gradient-to-r from-sky-950 to-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Rayleigh vs Mie Scattering — Why Clouds Are White and Skies Are Blue
      </p>
      <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto">
        {/* === LEFT: Rayleigh === */}
        <text x="125" y="22" textAnchor="middle" className="text-[11px] font-bold" fill="white">Rayleigh Scattering</text>
        <text x="125" y="35" textAnchor="middle" className="text-[8px]" fill="#94a3b8">Tiny molecules (N₂, O₂) — much smaller than light</text>

        {/* Air molecule */}
        <circle cx="125" cy="90" r="4" fill="#60a5fa" opacity={0.8} />
        <text x="125" y="110" textAnchor="middle" className="text-[7px]" fill="#94a3b8">~0.3 nm</text>

        {/* Incoming white light */}
        <line x1="30" y1="90" x2="110" y2="90" stroke="white" strokeWidth={2.5} opacity={0.6} />
        <text x="30" y="82" className="text-[7px]" fill="#e5e7eb">White light</text>

        {/* Blue scattered strongly in all directions */}
        {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
          <line key={i}
            x1={125 + Math.cos(angle * Math.PI / 180) * 8}
            y1={90 + Math.sin(angle * Math.PI / 180) * 8}
            x2={125 + Math.cos(angle * Math.PI / 180) * 35}
            y2={90 + Math.sin(angle * Math.PI / 180) * 35}
            stroke="#3b82f6" strokeWidth={1.5} opacity={0.6}
          />
        ))}
        <text x="168" y="62" className="text-[8px] font-semibold" fill="#3b82f6">Blue scatters</text>
        <text x="168" y="72" className="text-[8px]" fill="#3b82f6">in all directions</text>

        {/* Red passes through */}
        <line x1="140" y1="90" x2="220" y2="90" stroke="#ef4444" strokeWidth={2.5} opacity={0.7} />
        <text x="215" y="82" className="text-[7px]" fill="#ef4444">Red passes through →</text>

        {/* Result */}
        <rect x="40" y="140" width="170" height="45" rx="8" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth={1} />
        <text x="125" y="157" textAnchor="middle" className="text-[9px] font-semibold" fill="#60a5fa">Result: Blue sky</text>
        <text x="125" y="170" textAnchor="middle" className="text-[7px]" fill="#94a3b8">Short wavelengths scatter 5-6× more</text>
        <text x="125" y="180" textAnchor="middle" className="text-[7px]" fill="#94a3b8">Intensity ∝ 1/λ⁴</text>

        {/* Divider */}
        <line x1="250" y1="15" x2="250" y2="230" stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4 4" />

        {/* === RIGHT: Mie === */}
        <text x="375" y="22" textAnchor="middle" className="text-[11px] font-bold" fill="white">Mie Scattering</text>
        <text x="375" y="35" textAnchor="middle" className="text-[8px]" fill="#94a3b8">Large particles (dust, water drops) — similar size to light</text>

        {/* Large particle */}
        <circle cx="375" cy="90" r="14" fill="rgba(200,200,200,0.3)" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        <text x="375" y="110" textAnchor="middle" className="text-[7px]" fill="#94a3b8">~1000 nm</text>

        {/* Incoming white light */}
        <line x1="280" y1="90" x2="355" y2="90" stroke="white" strokeWidth={2.5} opacity={0.6} />

        {/* ALL colors scattered (mostly forward) */}
        {[0, 15, -15, 30, -30, 160, 180, 200].map((angle, i) => {
          const len = angle > 90 || angle < -90 ? 20 : 35;
          const opacity = angle > 90 || angle < -90 ? 0.3 : 0.6;
          return (
            <line key={i}
              x1={375 + Math.cos(angle * Math.PI / 180) * 18}
              y1={90 + Math.sin(angle * Math.PI / 180) * 18}
              x2={375 + Math.cos(angle * Math.PI / 180) * (18 + len)}
              y2={90 + Math.sin(angle * Math.PI / 180) * (18 + len)}
              stroke="white" strokeWidth={1.5} opacity={opacity}
            />
          );
        })}
        <text x="430" y="65" className="text-[8px] font-semibold" fill="white">All colors scatter</text>
        <text x="430" y="75" className="text-[8px]" fill="#d1d5db">equally (mostly forward)</text>

        {/* Result */}
        <rect x="290" y="140" width="170" height="45" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        <text x="375" y="157" textAnchor="middle" className="text-[9px] font-semibold" fill="white">Result: White clouds / haze</text>
        <text x="375" y="170" textAnchor="middle" className="text-[7px]" fill="#94a3b8">All wavelengths scatter equally</text>
        <text x="375" y="180" textAnchor="middle" className="text-[7px]" fill="#94a3b8">White = all colors mixed</text>

        {/* Bottom comparison */}
        <text x="250" y="220" textAnchor="middle" className="text-[9px]" fill="#f59e0b">
          Particle size relative to wavelength determines which type of scattering occurs
        </text>
      </svg>
    </div>
  );
}
