export default function OceanWaveAnatomyDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" role="img"
        aria-label="Diagram showing ocean wave anatomy including crest, trough, wavelength, and amplitude">
        <rect width="520" height="340" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Wave Anatomy: Energy Traveling, Not Water
        </text>

        {/* Still water line */}
        <line x1="40" y1="160" x2="490" y2="160" stroke="#475569" strokeWidth="1" strokeDasharray="6,4" />
        <text x="495" y="158" textAnchor="end" fontSize="10" fill="#64748b">Still water level</text>

        {/* Wave shape */}
        <path
          d="M 40 160 Q 80 90, 120 90 Q 160 90, 200 160 Q 240 230, 280 230 Q 320 230, 360 160 Q 400 90, 440 90 Q 470 90, 490 140"
          fill="none" stroke="#3b82f6" strokeWidth="2.5"
        />
        {/* Water fill */}
        <path
          d="M 40 160 Q 80 90, 120 90 Q 160 90, 200 160 Q 240 230, 280 230 Q 320 230, 360 160 Q 400 90, 440 90 Q 470 90, 490 140 L 490 280 L 40 280 Z"
          fill="#1e3a5f" opacity="0.4"
        />

        {/* Crest label */}
        <line x1="120" y1="82" x2="120" y2="60" stroke="#60a5fa" strokeWidth="1" />
        <text x="120" y="54" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">Crest</text>
        <circle cx="120" cy="90" r="4" fill="#60a5fa" />

        {/* Trough label */}
        <line x1="280" y1="238" x2="280" y2="260" stroke="#a78bfa" strokeWidth="1" />
        <text x="280" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a78bfa">Trough</text>
        <circle cx="280" cy="230" r="4" fill="#a78bfa" />

        {/* Second crest */}
        <circle cx="440" cy="90" r="4" fill="#60a5fa" />

        {/* Wavelength arrow */}
        <line x1="120" y1="44" x2="440" y2="44" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowY)" markerStart="url(#arrowYL)" />
        <text x="280" y="40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Wavelength (crest to crest)</text>

        {/* Amplitude arrows */}
        <line x1="50" y1="90" x2="50" y2="160" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowG)" markerStart="url(#arrowGL)" />
        <text x="56" y="128" fontSize="10" fontWeight="bold" fill="#34d399">Amplitude</text>

        <line x1="50" y1="160" x2="50" y2="230" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowG)" markerStart="url(#arrowGL)" />
        <text x="56" y="200" fontSize="10" fontWeight="bold" fill="#34d399">Amplitude</text>

        {/* Circular motion of water molecule */}
        <circle cx="370" cy="160" r="22" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
        <circle cx="370" cy="138" r="4" fill="#f97316" />
        <text x="370" y="130" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316">Water molecule</text>
        <text x="370" y="198" textAnchor="middle" fontSize="10" fill="#fb923c">Moves in circles,</text>
        <text x="370" y="210" textAnchor="middle" fontSize="10" fill="#fb923c">stays in place!</text>

        {/* Direction of wave travel */}
        <line x1="160" y1="290" x2="330" y2="290" stroke="#e2e8f0" strokeWidth="1.5" markerEnd="url(#arrowW)" />
        <text x="245" y="308" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e2e8f0">Direction of wave energy</text>

        {/* Seagull */}
        <text x="437" y="82" textAnchor="middle" fontSize="16">&#x1F426;</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#fbbf24" strokeWidth="1" />
          </marker>
          <marker id="arrowYL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8 0 L 0 3 L 8 6" fill="none" stroke="#fbbf24" strokeWidth="1" />
          </marker>
          <marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#34d399" strokeWidth="1" />
          </marker>
          <marker id="arrowGL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8 0 L 0 3 L 8 6" fill="none" stroke="#34d399" strokeWidth="1" />
          </marker>
          <marker id="arrowW" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
