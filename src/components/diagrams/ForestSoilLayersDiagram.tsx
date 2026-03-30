export default function ForestSoilLayersDiagram() {
  const layers = [
    { y: 70, h: 30, label: 'Leaf Litter (O horizon)', desc: 'Dead leaves, twigs, decomposing matter', color: '#5C4033', textColor: '#FDE68A' },
    { y: 100, h: 55, label: 'Topsoil (A horizon)', desc: 'Rich in humus, earthworms, nutrients — where roots feed', color: '#6B4226', textColor: '#FDE68A' },
    { y: 155, h: 65, label: 'Subsoil (B horizon)', desc: 'Clay, minerals washed down from above; deep roots reach here', color: '#A0785A', textColor: '#fff' },
    { y: 220, h: 55, label: 'Parent Rock (C horizon)', desc: 'Broken rock fragments slowly becoming soil', color: '#B8A08A', textColor: '#3B2716' },
    { y: 275, h: 45, label: 'Bedrock (R horizon)', desc: 'Solid rock — the foundation under everything', color: '#9CA3AF', textColor: '#1F2937' },
  ];

  return (
    <svg viewBox="0 0 660 380" className="w-full rounded-xl">
      <rect width="660" height="380" rx="16" className="fill-white dark:fill-slate-950" />
      <text x="330" y="28" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" style={{ fontSize: 16, fontWeight: 700 }}>Soil Layers Under a Forest</text>

      {/* Sky */}
      <rect x="30" y="42" width="380" height="28" rx="6" fill="#DBEAFE" />
      <text x="220" y="60" textAnchor="middle" style={{ fontSize: 11 }} fill="#1E40AF">atmosphere</text>

      {/* Tree above ground */}
      <rect x="198" y="20" width="10" height="50" fill="#6B4226" />
      <ellipse cx="203" cy="18" rx="32" ry="18" fill="#22C55E" opacity={0.85} />
      <rect x="340" y="30" width="8" height="40" fill="#6B4226" />
      <ellipse cx="344" cy="28" rx="22" ry="14" fill="#16A34A" opacity={0.85} />

      {/* Soil layers */}
      {layers.map((l, i) => (
        <g key={i}>
          <rect x="30" y={l.y} width="380" height={l.h} fill={l.color} opacity={0.85} />
          <text x="220" y={l.y + l.h / 2 - 5} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600 }} fill={l.textColor}>{l.label}</text>
          <text x="220" y={l.y + l.h / 2 + 10} textAnchor="middle" style={{ fontSize: 10 }} fill={l.textColor} opacity={0.8}>{l.desc}</text>
        </g>
      ))}

      {/* Roots going down */}
      <path d="M203,70 C203,90 190,100 180,120" stroke="#8B6F47" strokeWidth="3" fill="none" />
      <path d="M203,70 C205,95 215,110 230,130" stroke="#8B6F47" strokeWidth="3" fill="none" />
      <path d="M203,70 C200,100 195,130 185,155" stroke="#8B6F47" strokeWidth="2.5" fill="none" />
      <path d="M203,70 C210,110 220,140 225,170" stroke="#8B6F47" strokeWidth="2" fill="none" />
      {/* Thin root hairs */}
      <path d="M180,120 C170,125 165,130 160,135" stroke="#8B6F47" strokeWidth="1" fill="none" />
      <path d="M230,130 C240,135 245,140 250,148" stroke="#8B6F47" strokeWidth="1" fill="none" />
      <path d="M185,155 C175,165 170,175 168,185" stroke="#8B6F47" strokeWidth="1" fill="none" />

      {/* Second tree roots */}
      <path d="M344,70 C344,90 355,105 365,120" stroke="#8B6F47" strokeWidth="2.5" fill="none" />
      <path d="M344,70 C340,95 330,110 320,130" stroke="#8B6F47" strokeWidth="2" fill="none" />
      <path d="M344,70 C348,110 355,140 358,160" stroke="#8B6F47" strokeWidth="1.5" fill="none" />

      {/* Earthworm dots in topsoil */}
      {[70, 130, 250, 320, 180].map((ex, i) => (
        <circle key={i} cx={ex} cy={115 + (i % 3) * 10} r="2" fill="#FDE68A" opacity={0.6} />
      ))}

      {/* Annotations on right side */}
      <rect x="430" y="50" width="210" height="270" rx="10" className="fill-white dark:fill-slate-950" stroke="#D1D5DB" strokeWidth="1" opacity={0.9} />
      <text x="535" y="72" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} className="fill-gray-900 dark:fill-slate-50">Why Roots Matter</text>

      <text x="445" y="95" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">1. Hold soil in place</text>
      <text x="455" y="110" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Without roots, rain washes</text>
      <text x="455" y="122" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">topsoil away (erosion)</text>

      <text x="445" y="145" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">2. Create soil structure</text>
      <text x="455" y="160" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Root channels let water and</text>
      <text x="455" y="172" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">air penetrate deeper</text>

      <text x="445" y="195" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">3. Feed the food web</text>
      <text x="455" y="210" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">Dead roots feed earthworms,</text>
      <text x="455" y="222" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">fungi, bacteria</text>

      <text x="445" y="245" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">4. Absorb water</text>
      <text x="455" y="260" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">A large tree can absorb</text>
      <text x="455" y="272" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">200+ litres of water per day</text>

      <text x="445" y="295" style={{ fontSize: 11, fontWeight: 600 }} className="fill-gray-900 dark:fill-slate-50">5. Store carbon underground</text>
      <text x="455" y="310" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400">30–50% of tree carbon</text>

      {/* Depth scale */}
      <text x="18" y="105" textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500 dark:fill-slate-400" transform="rotate(-90,18,105)">depth →</text>

      {/* Caption */}
      <text x="330" y="368" textAnchor="middle" style={{ fontSize: 11 }} className="fill-gray-500 dark:fill-slate-400">Healthy forest soil took centuries to form. Erosion can destroy it in a single monsoon.</text>
    </svg>
  );
}
