export default function SilkStructureDiagram() {
  // Color constants
  const gold = '#C8962E';
  const goldLight = '#E8B84B';
  const sericin = '#9E9E9E';
  const sericinLight = '#BDBDBD';
  const hBondBlue = '#5C9CE6';
  const amorphousTeal = '#6DBFA0';

  return (
    <svg
      viewBox="0 0 630 396"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Silk fiber protein structure diagram showing three zoom levels: whole fiber, cross-section with fibroin and sericin, and molecular beta-sheet crystal structure"
    >
      <defs>
        {/* Shimmer animation on beta-sheet crystals */}
        <style>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          .beta-crystal {
            animation: shimmer 2.4s ease-in-out infinite;
          }
          .beta-crystal-delayed {
            animation: shimmer 2.4s ease-in-out 0.8s infinite;
          }
          .beta-crystal-delayed2 {
            animation: shimmer 2.4s ease-in-out 1.6s infinite;
          }
          @media (prefers-color-scheme: dark) {
            .silk-bg { fill: #1a1a2e; }
            .silk-text { fill: #e0e0e0; }
            .silk-text-sub { fill: #b0b0b0; }
            .silk-arrow { stroke: #888; fill: #888; }
            .silk-fiber-stroke { stroke: #D4A843; }
            .sericin-fill { fill: #6b6b6b; }
            .sericin-stroke { stroke: #888; }
          }
          @media (prefers-color-scheme: light) {
            .silk-bg { fill: #fafaf8; }
            .silk-text { fill: #1a1a1a; }
            .silk-text-sub { fill: #555; }
            .silk-arrow { stroke: #555; fill: #555; }
            .silk-fiber-stroke { stroke: ${gold}; }
            .sericin-fill { fill: ${sericinLight}; }
            .sericin-stroke { stroke: ${sericin}; }
          }
        `}</style>

        {/* Arrowhead marker */}
        <marker
          id="silk-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="silk-arrow" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="600" height="350" rx="8" className="silk-bg dark:fill-[#1a1a2e] fill-[#fafaf8]" />

      {/* ===== LAYER 1: Whole silk fiber (top) ===== */}
      <text x="28" y="28" fontSize="11" fontWeight="600" className="dark:fill-[#e0e0e0] fill-[#1a1a1a]">
        1. Silk fibre
      </text>

      {/* Curved silk strand */}
      <path
        d="M 60 55 Q 150 35, 250 55 Q 350 75, 440 55 Q 490 45, 540 55"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="dark:stroke-[#D4A843] stroke-[#C8962E]"
      />
      {/* Subtle sheen line */}
      <path
        d="M 80 53 Q 160 34, 250 53 Q 340 72, 430 53 Q 480 44, 530 53"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        className="dark:stroke-[#F5D98A] stroke-[#F5D98A]"
      />

      {/* Zoom arrow 1→2 */}
      <line
        x1="300" y1="70" x2="300" y2="95"
        strokeWidth="1.5"
        markerEnd="url(#silk-arrow)"
        className="dark:stroke-[#888] stroke-[#555]"
      />

      {/* ===== LAYER 2: Cross-section (middle) ===== */}
      <text x="28" y="110" fontSize="11" fontWeight="600" className="dark:fill-[#e0e0e0] fill-[#1a1a1a]">
        2. Cross-section
      </text>

      {/* Sericin coating (outer ellipse) */}
      <ellipse
        cx="300" cy="140" rx="110" ry="32"
        className="dark:fill-[#6b6b6b] fill-[#BDBDBD]"
        stroke={sericin}
        strokeWidth="1"
      />
      {/* Fibroin core (inner ellipse) */}
      <ellipse
        cx="300" cy="140" rx="72" ry="20"
        fill={goldLight}
        stroke={gold}
        strokeWidth="1.5"
      />

      {/* Labels */}
      <text x="300" y="144" fontSize="10" fontWeight="600" textAnchor="middle" fill="#3a2a0a">
        Fibroin (core)
      </text>
      <text x="435" y="135" fontSize="9" textAnchor="start" className="dark:fill-[#b0b0b0] fill-[#555]">
        Sericin
      </text>
      <text x="435" y="147" fontSize="9" textAnchor="start" className="dark:fill-[#b0b0b0] fill-[#555]">
        (coating)
      </text>
      {/* Pointer line to sericin */}
      <line x1="412" y1="138" x2="433" y2="138" strokeWidth="1" strokeDasharray="2,2" className="dark:stroke-[#888] stroke-[#555]" />

      {/* Zoom arrow 2→3 */}
      <line
        x1="300" y1="175" x2="300" y2="200"
        strokeWidth="1.5"
        markerEnd="url(#silk-arrow)"
        className="dark:stroke-[#888] stroke-[#555]"
      />

      {/* ===== LAYER 3: Molecular structure (bottom) ===== */}
      <text x="28" y="218" fontSize="11" fontWeight="600" className="dark:fill-[#e0e0e0] fill-[#1a1a1a]">
        3. Molecular structure
      </text>

      {/* --- Beta-sheet crystal region (left side) --- */}
      {/* Stacked rectangular sheets */}
      {[0, 1, 2, 3].map((i) => {
        const y = 232 + i * 22;
        const className = i % 3 === 0 ? 'beta-crystal' : i % 3 === 1 ? 'beta-crystal-delayed' : 'beta-crystal-delayed2';
        return (
          <g key={`sheet-${i}`}>
            <rect
              x={100} y={y} width={160} height={10} rx={2}
              fill={goldLight} stroke={gold} strokeWidth="1"
              className={className}
            />
            {/* Zigzag hydrogen bonds between sheets */}
            {i < 3 && (
              <g>
                {[0, 1, 2, 3, 4, 5].map((j) => {
                  const bx = 118 + j * 24;
                  const by1 = y + 10;
                  const by2 = y + 22;
                  const mid = (by1 + by2) / 2;
                  return (
                    <line
                      key={`hbond-${i}-${j}`}
                      x1={bx} y1={by1 + 1}
                      x2={bx} y2={by2 - 1}
                      stroke={hBondBlue}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.7"
                    />
                  );
                })}
              </g>
            )}
          </g>
        );
      })}

      {/* Label: beta-sheet crystals */}
      <text x="180" y="335" fontSize="9.5" fontWeight="600" textAnchor="middle" fill={gold}>
        β-sheet crystals
      </text>
      <text x="180" y="346" fontSize="8.5" textAnchor="middle" className="dark:fill-[#b0b0b0] fill-[#555]">
        → strength
      </text>

      {/* H-bond label */}
      <line x1="268" y1="260" x2="285" y2="260" stroke={hBondBlue} strokeWidth="1" strokeDasharray="2,2" />
      <text x="290" y="263" fontSize="8" fill={hBondBlue}>
        H-bonds
      </text>

      {/* --- Amorphous region (right side) --- */}
      {/* Wavy tangled lines representing disordered regions */}
      <g opacity="0.85">
        <path
          d="M 380 240 Q 395 232, 410 242 Q 425 252, 440 240 Q 455 228, 470 242 Q 485 256, 500 240"
          fill="none" stroke={amorphousTeal} strokeWidth="2" strokeLinecap="round"
        />
        <path
          d="M 385 260 Q 400 248, 418 262 Q 435 276, 450 258 Q 462 244, 478 260 Q 492 274, 505 258"
          fill="none" stroke={amorphousTeal} strokeWidth="2" strokeLinecap="round"
        />
        <path
          d="M 375 280 Q 392 268, 412 282 Q 430 296, 448 278 Q 460 264, 480 280 Q 496 296, 510 278"
          fill="none" stroke={amorphousTeal} strokeWidth="2" strokeLinecap="round"
        />
        <path
          d="M 390 300 Q 405 288, 422 302 Q 440 316, 458 298 Q 472 284, 490 300 Q 502 312, 510 298"
          fill="none" stroke={amorphousTeal} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
        />
      </g>

      {/* Label: amorphous regions */}
      <text x="445" y="335" fontSize="9.5" fontWeight="600" textAnchor="middle" fill={amorphousTeal}>
        Amorphous regions
      </text>
      <text x="445" y="346" fontSize="8.5" textAnchor="middle" className="dark:fill-[#b0b0b0] fill-[#555]">
        → flexibility
      </text>

      {/* Divider between crystal and amorphous sections */}
      <line
        x1="340" y1="225" x2="340" y2="320"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.3"
        className="dark:stroke-[#888] stroke-[#555]"
      />
    </svg>
  );
}
