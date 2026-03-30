export default function OceanStormSurgeDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Cross-section diagram showing storm surge pushing ocean water onto land">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Storm Surge: Wind Pushes the Ocean onto Land
        </text>

        {/* Sky */}
        <rect x="10" y="40" width="500" height="110" rx="4" fill="#1e293b" opacity="0.5" />

        {/* Cyclone symbol */}
        <circle cx="200" cy="80" r="40" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3" />
        <circle cx="200" cy="80" r="15" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="200" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Eye</text>
        <text x="200" y="38" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">Cyclone</text>

        {/* Low pressure label */}
        <text x="200" y="130" textAnchor="middle" fontSize="10" fill="#fb923c">Low pressure lifts water</text>
        <text x="200" y="142" textAnchor="middle" fontSize="10" fill="#fb923c">(like sucking on a straw)</text>

        {/* Wind arrows pushing right */}
        <line x1="100" y1="90" x2="145" y2="90" stroke="#93c5fd" strokeWidth="2" markerEnd="url(#surgArrow)" />
        <line x1="90" y1="105" x2="140" y2="105" stroke="#93c5fd" strokeWidth="2" markerEnd="url(#surgArrow)" />
        <text x="70" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Wind</text>

        {/* Normal sea level line */}
        <line x1="10" y1="220" x2="510" y2="220" stroke="#475569" strokeWidth="1" strokeDasharray="5,4" />
        <text x="50" y="216" textAnchor="middle" fontSize="10" fill="#64748b">Normal sea level</text>

        {/* Ocean water - normal */}
        <rect x="10" y="220" width="200" height="100" fill="#1e3a5f" opacity="0.5" />

        {/* Storm surge water - raised */}
        <path d="M 210 220 Q 260 155, 340 165 L 420 165 L 420 320 L 210 320 Z" fill="#2563eb" opacity="0.4" />
        <path d="M 210 220 Q 260 155, 340 165 L 420 165" fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Surge height bracket */}
        <line x1="430" y1="165" x2="430" y2="220" stroke="#f87171" strokeWidth="2" markerEnd="url(#surgArrowR)" markerStart="url(#surgArrowRL)" />
        <text x="476" y="188" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">Storm</text>
        <text x="476" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f87171">surge</text>
        <text x="476" y="214" textAnchor="middle" fontSize="10" fill="#fca5a5">3-10 m</text>

        {/* Land/coast */}
        <polygon points="350,220 510,220 510,320 350,320" fill="#713f12" opacity="0.6" />
        <polygon points="350,220 380,200 420,190 460,195 510,220" fill="#854d0e" opacity="0.7" />

        {/* Houses on coast */}
        <rect x="400" y="195" width="16" height="18" fill="#94a3b8" />
        <polygon points="396,195 408,183 420,195" fill="#dc2626" />
        <rect x="440" y="200" width="14" height="14" fill="#94a3b8" />
        <polygon points="436,200 447,190 458,200" fill="#dc2626" />

        {/* Flooded area */}
        <path d="M 340 165 L 420 165 L 420 210 Q 400 175, 340 185 Z" fill="#3b82f6" opacity="0.3" />
        <text x="385" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Flooding</text>

        {/* Seabed slope */}
        <line x1="10" y1="320" x2="350" y2="220" stroke="#a16207" strokeWidth="2" />
        <text x="160" y="290" textAnchor="middle" fontSize="10" fill="#ca8a04">Gently sloping seabed</text>
        <text x="160" y="302" textAnchor="middle" fontSize="10" fill="#ca8a04">(amplifies surge)</text>

        {/* Key factors */}
        <rect x="15" y="335" width="490" height="34" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="352" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Surge severity depends on: storm intensity + coastline shape + seabed slope + timing with tide
        </text>
        <text x="260" y="364" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">
          1970 Bhola cyclone: 10 m surge killed 300,000+ people
        </text>

        <defs>
          <marker id="surgArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          </marker>
          <marker id="surgArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6" fill="none" stroke="#f87171" strokeWidth="1" />
          </marker>
          <marker id="surgArrowRL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M 8 0 L 0 3 L 8 6" fill="none" stroke="#f87171" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
