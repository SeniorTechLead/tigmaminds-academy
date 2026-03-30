export default function ClimateChangeDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" role="img"
        aria-label="Diagram showing the greenhouse effect and global temperature trend">
        <rect width="520" height="400" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Climate Change: The Enhanced Greenhouse Effect
        </text>

        {/* Greenhouse effect section */}
        {/* Sun */}
        <circle cx="80" cy="70" r="22" fill="#fbbf24" opacity="0.8" />
        <text x="80" y="74" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#451a03">Sun</text>

        {/* Incoming solar radiation */}
        <line x1="100" y1="82" x2="200" y2="140" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#ccArrowY)" />
        <text x="140" y="100" fontSize="10" fill="#fbbf24">Solar</text>
        <text x="140" y="112" fontSize="10" fill="#fbbf24">energy</text>

        {/* Atmosphere layer */}
        <rect x="150" y="130" width="340" height="35" rx="4" fill="#7c3aed" opacity="0.15" />
        <text x="320" y="148" textAnchor="middle" fontSize="10" fill="#a78bfa">Atmosphere (CO2, CH4, N2O)</text>
        <text x="320" y="160" textAnchor="middle" fontSize="10" fill="#a78bfa">420+ ppm CO2 (was 280 ppm pre-industrial)</text>

        {/* Earth surface */}
        <rect x="150" y="180" width="340" height="30" rx="4" fill="#166534" opacity="0.3" />
        <text x="320" y="198" textAnchor="middle" fontSize="10" fill="#4ade80">Earth's surface absorbs and re-emits heat</text>

        {/* Heat going back up */}
        <line x1="250" y1="180" x2="250" y2="165" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#ccArrowR)" />
        <line x1="300" y1="180" x2="300" y2="165" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#ccArrowR)" />
        <line x1="350" y1="180" x2="350" y2="165" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#ccArrowR)" />

        {/* Some escapes */}
        <line x1="250" y1="130" x2="240" y2="95" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#ccArrowR)" />
        <text x="225" y="85" fontSize="10" fill="#fca5a5">Some escapes</text>

        {/* Some trapped */}
        <line x1="320" y1="140" x2="340" y2="175" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#ccArrowR)" />
        <line x1="370" y1="140" x2="390" y2="175" stroke="#f87171" strokeWidth="1.5" markerEnd="url(#ccArrowR)" />
        <text x="415" y="140" fontSize="10" fontWeight="bold" fill="#f87171">Greenhouse</text>
        <text x="415" y="152" fontSize="10" fontWeight="bold" fill="#f87171">gases trap heat</text>

        {/* Thicker greenhouse = more trapping */}
        <text x="485" y="118" textAnchor="end" fontSize="10" fill="#c4b5fd">More CO2 =</text>
        <text x="485" y="130" textAnchor="end" fontSize="10" fill="#c4b5fd">more heat trapped</text>

        {/* Temperature trend graph */}
        <rect x="30" y="225" width="460" height="160" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="245" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#e2e8f0">Global Temperature Anomaly (1880-2024)</text>

        {/* Axes */}
        <line x1="80" y1="260" x2="80" y2="370" stroke="#475569" strokeWidth="1" />
        <line x1="80" y1="330" x2="460" y2="330" stroke="#475569" strokeWidth="1" strokeDasharray="4,4" />
        <text x="75" y="272" textAnchor="end" fontSize="10" fill="#fca5a5">+1.2 degrees C</text>
        <text x="75" y="335" textAnchor="end" fontSize="10" fill="#64748b">0 degrees C baseline</text>
        <text x="75" y="370" textAnchor="end" fontSize="10" fill="#93c5fd">-0.4 degrees C</text>

        {/* Year labels */}
        <text x="90" y="382" fontSize="10" fill="#64748b">1880</text>
        <text x="210" y="382" fontSize="10" fill="#64748b">1940</text>
        <text x="330" y="382" fontSize="10" fill="#64748b">1980</text>
        <text x="430" y="382" fontSize="10" fill="#64748b">2024</text>

        {/* Temperature line - gradual then steep rise */}
        <polyline
          points="90,345 110,348 130,342 150,346 170,340 190,338 210,335 230,332 250,330 270,326 290,320 310,315 330,310 350,300 370,295 390,286 410,278 430,270 450,264"
          fill="none" stroke="#f87171" strokeWidth="2"
        />

        {/* Highlight recent acceleration */}
        <rect x="340" y="252" width="120" height="18" rx="3" fill="#991b1b" opacity="0.3" />
        <text x="400" y="264" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fca5a5">Accelerating</text>

        {/* Paris target */}
        <line x1="80" y1="282" x2="460" y2="282" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
        <text x="460" y="280" textAnchor="end" fontSize="10" fill="#fbbf24">1.5 degrees C Paris target</text>

        <defs>
          <marker id="ccArrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </marker>
          <marker id="ccArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#f87171" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
