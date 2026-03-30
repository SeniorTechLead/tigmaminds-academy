export default function ForestCarbonCycleDiagram() {
  return (
    <svg viewBox="0 0 680 400" className="w-full rounded-xl">
      <rect width="680" height="400" rx="16" className="fill-white dark:fill-slate-950" />
      <text x="340" y="28" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" style={{ fontSize: 16, fontWeight: 700 }}>How a Tree Captures Carbon</text>

      {/* Sun */}
      <circle cx="580" cy="70" r="28" fill="#FBBF24" opacity={0.9} />
      <text x="580" y="74" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill="#92400E">Sun</text>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r1 = 32, r2 = 42;
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={580 + r1 * Math.cos(rad)} y1={70 + r1 * Math.sin(rad)} x2={580 + r2 * Math.cos(rad)} y2={70 + r2 * Math.sin(rad)} stroke="#FBBF24" strokeWidth="2" />;
      })}

      {/* CO2 in atmosphere */}
      <rect x="30" y="50" width="140" height="44" rx="10" fill="#EF4444" opacity={0.15} stroke="#EF4444" strokeWidth="1.5" />
      <text x="100" y="70" textAnchor="middle" style={{ fontSize: 12, fontWeight: 600 }} fill="#EF4444">CO₂ in atmosphere</text>
      <text x="100" y="84" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">420 ppm (2024)</text>

      {/* O2 released */}
      <rect x="230" y="50" width="120" height="44" rx="10" fill="#3B82F6" opacity={0.15} stroke="#3B82F6" strokeWidth="1.5" />
      <text x="290" y="70" textAnchor="middle" style={{ fontSize: 12, fontWeight: 600 }} fill="#3B82F6">O₂ released</text>
      <text x="290" y="84" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">breathable air</text>

      {/* Tree */}
      <rect x="310" y="180" width="20" height="130" rx="4" fill="#6B4226" />
      {/* Canopy */}
      <ellipse cx="320" cy="160" rx="70" ry="55" fill="#22C55E" opacity={0.8} />
      <ellipse cx="290" cy="180" rx="40" ry="35" fill="#16A34A" opacity={0.7} />
      <ellipse cx="350" cy="175" rx="45" ry="38" fill="#15803D" opacity={0.7} />

      {/* Leaves label */}
      <text x="320" y="145" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill="#fff">Photosynthesis</text>
      <text x="320" y="158" textAnchor="middle" style={{ fontSize: 10 }} fill="#E0FFE0">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</text>

      {/* Carbon stored in wood */}
      <rect x="380" y="210" width="130" height="50" rx="8" fill="#A16207" opacity={0.2} stroke="#A16207" strokeWidth="1.5" />
      <text x="445" y="230" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill="#A16207">Carbon in wood</text>
      <text x="445" y="248" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">~50% of dry mass</text>
      <line x1="330" y1="230" x2="380" y2="230" stroke="#A16207" strokeWidth="1.5" strokeDasharray="4,3" />

      {/* Roots */}
      {[-60, -30, 0, 30, 60].map((dx, i) => (
        <line key={i} x1={320} y1={310} x2={320 + dx} y2={350 + Math.abs(dx) * 0.4} stroke="#6B4226" strokeWidth={3 - Math.abs(dx) * 0.03} opacity={0.7} />
      ))}

      {/* Soil carbon */}
      <rect x="30" y="320" width="240" height="60" rx="10" fill="#78716C" opacity={0.2} stroke="#78716C" strokeWidth="1.5" />
      <text x="150" y="342" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-700 dark:fill-slate-300">Soil organic carbon</text>
      <text x="150" y="358" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Dead leaves, roots decompose</text>
      <text x="150" y="372" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">50–100 tonnes C/hectare</text>

      {/* Arrow: CO2 absorbed */}
      <path d="M100,95 C100,130 250,130 300,140" fill="none" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowR)" />
      <text x="170" y="120" textAnchor="middle" style={{ fontSize: 10, fontWeight: 600 }} fill="#EF4444">CO₂ absorbed</text>

      {/* Arrow: O2 released */}
      <path d="M300,135 C280,120 290,105 290,95" fill="none" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowB)" />
      <text x="260" y="112" textAnchor="middle" style={{ fontSize: 10, fontWeight: 600 }} fill="#3B82F6">O₂ out</text>

      {/* Arrow: sunlight */}
      <path d="M555,85 C500,110 380,130 340,145" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="5,3" />
      <text x="470" y="108" textAnchor="middle" style={{ fontSize: 10, fontWeight: 600 }} fill="#D97706">sunlight energy</text>

      {/* Arrow: leaf litter to soil */}
      <path d="M280,215 C260,280 220,300 200,320" fill="none" stroke="#78716C" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowG)" />
      <text x="230" y="285" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">leaf litter</text>

      {/* Key number */}
      <rect x="430" y="320" width="220" height="60" rx="10" fill="#22C55E" opacity={0.1} stroke="#22C55E" strokeWidth="1.5" />
      <text x="540" y="340" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill="#16A34A">One mature tree absorbs</text>
      <text x="540" y="358" textAnchor="middle" style={{ fontSize: 13, fontWeight: 700 }} fill="#16A34A">~22 kg CO₂ / year</text>
      <text x="540" y="372" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">enough O₂ for 2 people</text>

      <defs>
        <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#EF4444" /></marker>
        <marker id="arrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#3B82F6" /></marker>
        <marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#78716C" /></marker>
      </defs>
    </svg>
  );
}
