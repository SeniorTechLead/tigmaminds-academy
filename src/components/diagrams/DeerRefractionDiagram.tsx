export default function DeerRefractionDiagram() {
  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        Refraction — How Light Bends and Prisms Split White Light
      </p>
      <svg viewBox="0 0 640 340" className="w-full max-w-2xl mx-auto">
        {/* LEFT: Bending at interface */}
        <text x="150" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#38bdf8">
          Light Bends at a Boundary
        </text>

        {/* Air region */}
        <rect x="20" y="40" width="260" height="100" rx={0} fill="rgba(56,189,248,0.04)" />
        <text x="40" y="60" fontSize="10" fill="#38bdf8">Air (fast)</text>
        <text x="40" y="73" fontSize="10" fill="#6b7280">n = 1.00</text>

        {/* Water region */}
        <rect x="20" y="140" width="260" height="110" rx={0} fill="rgba(56,189,248,0.1)" />
        <text x="40" y="160" fontSize="10" fill="#38bdf8">Water (slow)</text>
        <text x="40" y="173" fontSize="10" fill="#6b7280">n = 1.33</text>

        {/* Interface line */}
        <line x1="20" y1="140" x2="280" y2="140" stroke="#38bdf8" strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Normal */}
        <line x1="160" y1="55" x2="160" y2="235" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,3" />
        <text x="168" y="68" fontSize="10" fill="#6b7280">normal</text>

        {/* Incident ray */}
        <line x1="90" y1="55" x2="160" y2="140" stroke="white" strokeWidth={2.5} opacity={0.85} />
        <polygon points="90,55 98,63 86,65" fill="white" opacity={0.85} />

        {/* Refracted ray — bends toward normal (slower medium) */}
        <line x1="160" y1="140" x2="210" y2="235" stroke="#38bdf8" strokeWidth={2.5} />
        <polygon points="210,235 202,227 214,227" fill="#38bdf8" />

        {/* Angle labels */}
        <path d="M160,115 Q148,120 140,128" fill="none" stroke="white" strokeWidth={1} opacity={0.5} />
        <text x="130" y="118" fontSize="10" fill="white" opacity={0.7}>θ₁</text>
        <path d="M160,165 Q167,168 172,178" fill="none" stroke="#38bdf8" strokeWidth={1} opacity={0.5} />
        <text x="175" y="172" fontSize="10" fill="#38bdf8" opacity={0.7}>θ₂</text>

        {/* Snell's law */}
        <rect x="30" y="260" width="240" height="34" rx={6} fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth={1} />
        <text x="150" y="282" textAnchor="middle" fontSize="11" fontWeight="700" fill="#38bdf8">
          Snell’s law: n₁ sinθ₁ = n₂ sinθ₂
        </text>

        {/* RIGHT: Prism splitting white light */}
        <text x="480" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
          Prism Splits White Light
        </text>

        {/* Prism triangle */}
        <polygon points="420,230 480,70 540,230" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
        <text x="480" y="180" textAnchor="middle" fontSize="10" fill="#9ca3af">Glass</text>
        <text x="480" y="193" textAnchor="middle" fontSize="10" fill="#6b7280">n = 1.52</text>

        {/* White light in */}
        <line x1="340" y1="140" x2="445" y2="140" stroke="white" strokeWidth={3} opacity={0.7} />
        <text x="360" y="132" fontSize="10" fill="white">White light</text>

        {/* Refracted colours exiting prism */}
        {[
          { color: '#ef4444', label: 'Red (700 nm)', y: 118, angle: -12 },
          { color: '#f97316', label: 'Orange', y: 126, angle: -8 },
          { color: '#eab308', label: 'Yellow', y: 134, angle: -4 },
          { color: '#22c55e', label: 'Green', y: 142, angle: 0 },
          { color: '#3b82f6', label: 'Blue', y: 150, angle: 4 },
          { color: '#8b5cf6', label: 'Violet (380 nm)', y: 158, angle: 8 },
        ].map((ray, i) => {
          const exitX = 519 + i * 2;
          const exitY = 140 + (i - 2.5) * 14;
          const endX = 620;
          const endY = exitY + (i - 2.5) * 8;
          return (
            <g key={i}>
              <line x1={exitX} y1={exitY} x2={endX} y2={endY} stroke={ray.color} strokeWidth={2} opacity={0.8} />
              <text x={endX - 2} y={endY + 4} textAnchor="end" fontSize="9" fill={ray.color}>{ray.label}</text>
            </g>
          );
        })}

        {/* Explanation below prism */}
        <rect x="360" y="260" width="250" height="48" rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <text x="485" y="278" textAnchor="middle" fontSize="10" fill="#d1d5db">
          Different wavelengths bend by different amounts.
        </text>
        <text x="485" y="293" textAnchor="middle" fontSize="10" fill="#d1d5db">
          Violet bends most (short λ), red bends least (long λ).
        </text>

        {/* Divider */}
        <line x1="310" y1="40" x2="310" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      </svg>
    </div>
  );
}
