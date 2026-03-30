export default function BanyanDendrochronologyDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 580 433" className="w-full max-w-lg mx-auto" role="img" aria-label="Dendrochronology cross-dating technique matching ring patterns across multiple trees to build a centuries-long timeline">
        <rect width="500" height="400" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Dendrochronology: Cross-Dating</text>
        <text x="250" y="44" textAnchor="middle" className="fill-slate-400" fontSize="10">Matching ring patterns to build a timeline</text>

        {/* === Tree core sample A (living tree, recent) === */}
        <text x="30" y="78" className="fill-green-300" fontSize="9" fontWeight="bold">Living tree</text>
        <text x="30" y="90" className="fill-slate-400" fontSize="8">felled 2024</text>

        {/* Core sample A - horizontal bar */}
        <rect x="30" y="100" width="440" height="30" rx="4" className="fill-amber-800" />
        {/* Ring pattern A - varying widths */}
        {[40, 50, 62, 70, 82, 100, 108, 122, 140, 150, 158, 170, 188, 200, 215, 230, 242, 260, 272, 285, 300, 318, 332, 345, 360, 378, 390, 405, 420, 440, 455].map((x, i) => (
          <line key={`a-${i}`} x1={x} y1={100} x2={x} y2={130} className="stroke-amber-950" strokeWidth={i % 5 === 0 ? 1.5 : 0.8} opacity={0.7} />
        ))}
        {/* Highlight matching zone */}
        <rect x="30" y="97" width="180" height="36" rx="2" className="stroke-green-400" strokeWidth="1.5" fill="none" strokeDasharray="4,2" />

        {/* === Tree core sample B (old beam) === */}
        <text x="30" y="165" className="fill-amber-300" fontSize="9" fontWeight="bold">Old building beam</text>
        <text x="30" y="177" className="fill-slate-400" fontSize="8">from 1850s structure</text>

        <rect x="30" y="187" width="350" height="30" rx="4" className="fill-amber-700" />
        {[40, 50, 62, 70, 82, 100, 108, 122, 140, 150, 158, 170, 188, 200, 215, 230, 242, 260, 272, 285, 300, 318, 332, 345, 360].map((x, i) => (
          <line key={`b-${i}`} x1={x} y1={187} x2={x} y2={217} className="stroke-amber-950" strokeWidth={i % 5 === 0 ? 1.5 : 0.8} opacity={0.7} />
        ))}
        {/* Overlap zone with A */}
        <rect x="30" y="184" width="180" height="36" rx="2" className="stroke-green-400" strokeWidth="1.5" fill="none" strokeDasharray="4,2" />
        {/* Earlier overlap with C */}
        <rect x="200" y="184" width="180" height="36" rx="2" className="stroke-amber-400" strokeWidth="1.5" fill="none" strokeDasharray="4,2" />

        {/* Matching arrows between A and B overlap */}
        <text x="120" y="148" textAnchor="middle" className="fill-green-400" fontSize="8" fontWeight="bold">patterns match!</text>
        <line x1="80" y1="130" x2="80" y2="187" className="stroke-green-500" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="150" y1="130" x2="150" y2="187" className="stroke-green-500" strokeWidth="1" strokeDasharray="2,2" />

        {/* === Tree core sample C (ancient timber) === */}
        <text x="30" y="252" className="fill-amber-300" fontSize="9" fontWeight="bold">Ancient temple timber</text>
        <text x="30" y="264" className="fill-slate-400" fontSize="8">from 1600s ruins</text>

        <rect x="120" y="274" width="350" height="30" rx="4" className="fill-amber-600" />
        {[130, 142, 155, 165, 178, 195, 208, 222, 240, 255, 268, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 458].map((x, i) => (
          <line key={`c-${i}`} x1={x} y1={274} x2={x} y2={304} className="stroke-amber-950" strokeWidth={i % 5 === 0 ? 1.5 : 0.8} opacity={0.7} />
        ))}
        {/* Overlap zone with B */}
        <rect x="200" y="271" width="180" height="36" rx="2" className="stroke-amber-400" strokeWidth="1.5" fill="none" strokeDasharray="4,2" />

        {/* Matching arrows between B and C overlap */}
        <text x="290" y="237" textAnchor="middle" className="fill-amber-400" fontSize="8" fontWeight="bold">patterns match!</text>
        <line x1="250" y1="217" x2="250" y2="274" className="stroke-amber-500" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="330" y1="217" x2="330" y2="274" className="stroke-amber-500" strokeWidth="1" strokeDasharray="2,2" />

        {/* Timeline at bottom */}
        <line x1="30" y1="340" x2="470" y2="340" className="stroke-amber-400" strokeWidth="2" markerEnd="url(#dendroArrow)" />
        <text x="30" y="358" className="fill-slate-400" fontSize="8">1600</text>
        <text x="140" y="358" className="fill-slate-400" fontSize="8">1700</text>
        <text x="250" y="358" className="fill-slate-400" fontSize="8">1800</text>
        <text x="360" y="358" className="fill-slate-400" fontSize="8">1900</text>
        <text x="450" y="358" className="fill-slate-400" fontSize="8">2024</text>

        {/* Tick marks */}
        {[30, 140, 250, 360, 450].map((x, i) => (
          <line key={`tick-${i}`} x1={x} y1={336} x2={x} y2={344} className="stroke-amber-400" strokeWidth="1.5" />
        ))}

        {/* Combined timeline label */}
        <rect x="80" y="368" width="340" height="22" rx="6" className="fill-green-900" opacity="0.6" />
        <text x="250" y="383" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">Combined: 400+ years of continuous climate record from overlapping samples</text>

        <defs>
          <marker id="dendroArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
