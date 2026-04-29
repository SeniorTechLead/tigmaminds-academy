export default function MieVsRayleighDiagram() {
  return (
    <div className="bg-gradient-to-r from-sky-950 to-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        Rayleigh vs Mie Scattering — Why Clouds Are White and Skies Are Blue
      </p>
      <svg viewBox="0 0 756 340" className="w-full max-w-xl mx-auto">
        {/* === LEFT: Rayleigh === */}
        <text x="165" y="28" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">Rayleigh Scattering</text>
        <text x="165" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Tiny molecules (N₂, O₂) — much smaller than light</text>

        {/* Air molecule */}
        <circle cx="165" cy="115" r="5" fill="#60a5fa" opacity={0.8} />
        <text x="165" y="140" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">~0.3 nm</text>

        {/* Incoming white light */}
        <line x1="40" y1="115" x2="148" y2="115" stroke="white" strokeWidth={3} opacity={0.6} />
        <text x="40" y="105" fontSize="10" fill="#e5e7eb">White light →</text>

        {/* Blue scattered in all directions */}
        {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
          <line key={i}
            x1={165 + Math.cos(angle * Math.PI / 180) * 10}
            y1={115 + Math.sin(angle * Math.PI / 180) * 10}
            x2={165 + Math.cos(angle * Math.PI / 180) * 45}
            y2={115 + Math.sin(angle * Math.PI / 180) * 45}
            stroke="#3b82f6" strokeWidth={1.8} opacity={0.6}
          />
        ))}
        <text x="220" y="78" fontSize="11" fontWeight="600" fill="#3b82f6">Blue scatters</text>
        <text x="220" y="92" fontSize="11" fill="#3b82f6">in all directions</text>

        {/* Red passes through */}
        <line x1="182" y1="115" x2="280" y2="115" stroke="#ef4444" strokeWidth={3} opacity={0.7} />
        <text x="275" y="105" fontSize="10" fill="#ef4444">Red passes through →</text>

        {/* Result */}
        <rect x="45" y="175" width="240" height="60" rx="8" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth={1.5} />
        <text x="165" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="#60a5fa">Result: Blue sky</text>
        <text x="165" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Short wavelengths scatter 5-6× more — Intensity ∝ 1/λ⁴</text>
        <text x="165" y="230" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">This is why the overhead sky is blue</text>

        {/* Divider */}
        <line x1="340" y1="15" x2="340" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="5 4" />

        {/* === RIGHT: Mie === */}
        <text x="530" y="28" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">Mie Scattering</text>
        <text x="530" y="46" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Large particles (dust, water drops) — size ≈ wavelength</text>

        {/* Large particle */}
        <circle cx="530" cy="115" r="18" fill="rgba(200,200,200,0.25)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
        <text x="530" y="145" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">~1000 nm</text>

        {/* Incoming white light */}
        <line x1="390" y1="115" x2="505" y2="115" stroke="white" strokeWidth={3} opacity={0.6} />

        {/* ALL colors scattered */}
        {[0, 15, -15, 30, -30, 160, 180, 200].map((angle, i) => {
          const len = Math.abs(angle) > 90 ? 22 : 42;
          const op = Math.abs(angle) > 90 ? 0.3 : 0.6;
          return (
            <line key={i}
              x1={530 + Math.cos(angle * Math.PI / 180) * 22}
              y1={115 + Math.sin(angle * Math.PI / 180) * 22}
              x2={530 + Math.cos(angle * Math.PI / 180) * (22 + len)}
              y2={115 + Math.sin(angle * Math.PI / 180) * (22 + len)}
              stroke="white" strokeWidth={1.8} opacity={op}
            />
          );
        })}
        <text x="600" y="78" fontSize="11" fontWeight="600" fill="white">All colours scatter</text>
        <text x="600" y="92" fontSize="11" fill="#d1d5db">equally (mostly forward)</text>

        {/* Result */}
        <rect x="395" y="175" width="270" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
        <text x="530" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="white">Result: White clouds / haze</text>
        <text x="530" y="215" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">All wavelengths scatter equally → white = all colours mixed</text>
        <text x="530" y="230" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">This is why clouds are white, not blue</text>

        {/* Bottom comparison */}
        <rect x="120" y="265" width="500" height="28" rx="6" fill="rgba(251,191,36,0.08)" />
        <text x="370" y="284" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f59e0b">
          Particle size relative to wavelength determines which type of scattering occurs
        </text>
      </svg>
    </div>
  );
}
