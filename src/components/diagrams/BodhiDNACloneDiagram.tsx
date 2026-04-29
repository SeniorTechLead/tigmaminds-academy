export default function BodhiDNACloneDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 570 380" className="w-full max-w-2xl mx-auto" role="img" aria-label="DNA in clones: why clones are genetically identical">
        <rect width="570" height="380" rx="12" className="fill-white dark:fill-slate-900" />
        <text x="285" y="28" textAnchor="middle" className="fill-violet-400" fontSize="14" fontWeight="bold">What Does "Genetically Identical" Mean?</text>

        {/* DNA double helix representation */}
        <text x="285" y="55" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Every cell contains the same DNA blueprint</text>

        {/* Parent tree cell */}
        <rect x="30" y="75" width="155" height="120" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1" />
        <text x="107" y="95" textAnchor="middle" className="fill-green-400" fontSize="11" fontWeight="bold">Parent Cell</text>

        {/* Simplified DNA strands */}
        <path d="M 60,110 Q 75,105 90,115 Q 105,125 120,115 Q 135,105 150,115" fill="none" className="stroke-blue-400" strokeWidth="2" />
        <path d="M 60,125 Q 75,130 90,120 Q 105,110 120,120 Q 135,130 150,120" fill="none" className="stroke-red-400" strokeWidth="2" />
        {/* Base pair rungs */}
        {[68, 82, 97, 112, 127, 142].map((x, i) => (
          <line key={i} x1={x} y1={112 + (i % 2 ? -3 : 3)} x2={x} y2={123 + (i % 2 ? 3 : -3)} className="stroke-slate-500" strokeWidth="1" />
        ))}

        {/* Gene labels */}
        <rect x="50" y="148" width="45" height="16" rx="3" className="fill-blue-800" />
        <text x="72" y="160" textAnchor="middle" className="fill-blue-300" fontSize="8">Gene A</text>
        <rect x="100" y="148" width="45" height="16" rx="3" className="fill-purple-800" />
        <text x="122" y="160" textAnchor="middle" className="fill-purple-300" fontSize="8">Gene B</text>
        <text x="107" y="185" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">A = leaf shape, B = bark color</text>

        {/* Arrow: mitosis / cell division */}
        <line x1="190" y1="135" x2="225" y2="135" className="stroke-yellow-400" strokeWidth="2" markerEnd="url(#bodhiDnaArr)" />
        <text x="207" y="125" textAnchor="middle" className="fill-yellow-400" fontSize="8">mitosis</text>
        <text x="207" y="152" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">exact copy</text>

        {/* Clone cell */}
        <rect x="230" y="75" width="155" height="120" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#4ade80" strokeWidth="1" />
        <text x="307" y="95" textAnchor="middle" className="fill-green-400" fontSize="11" fontWeight="bold">Clone Cell</text>

        {/* Same DNA strands */}
        <path d="M 260,110 Q 275,105 290,115 Q 305,125 320,115 Q 335,105 350,115" fill="none" className="stroke-blue-400" strokeWidth="2" />
        <path d="M 260,125 Q 275,130 290,120 Q 305,110 320,120 Q 335,130 350,120" fill="none" className="stroke-red-400" strokeWidth="2" />
        {[268, 282, 297, 312, 327, 342].map((x, i) => (
          <line key={i} x1={x} y1={112 + (i % 2 ? -3 : 3)} x2={x} y2={123 + (i % 2 ? 3 : -3)} className="stroke-slate-500" strokeWidth="1" />
        ))}

        {/* Same gene labels */}
        <rect x="250" y="148" width="45" height="16" rx="3" className="fill-blue-800" />
        <text x="272" y="160" textAnchor="middle" className="fill-blue-300" fontSize="8">Gene A</text>
        <rect x="300" y="148" width="45" height="16" rx="3" className="fill-purple-800" />
        <text x="322" y="160" textAnchor="middle" className="fill-purple-300" fontSize="8">Gene B</text>
        <text x="307" y="185" textAnchor="middle" className="fill-emerald-400" fontSize="9" fontWeight="bold">Identical genes!</text>

        {/* = sign */}
        <text x="420" y="140" textAnchor="middle" className="fill-yellow-400" fontSize="24" fontWeight="bold">=</text>

        {/* Two identical trees */}
        <g transform="translate(460, 90)">
          <line x1="0" y1="50" x2="0" y2="20" className="stroke-amber-700" strokeWidth="3" />
          <ellipse cx="0" cy="15" rx="20" ry="14" className="fill-green-600" />
          <text x="0" y="70" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Tree 1</text>
        </g>
        <g transform="translate(520, 90)">
          <line x1="0" y1="50" x2="0" y2="20" className="stroke-amber-700" strokeWidth="3" />
          <ellipse cx="0" cy="15" rx="20" ry="14" className="fill-green-600" />
          <text x="0" y="70" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Tree 2</text>
        </g>

        {/* Bottom: Seeds are different */}
        <rect x="30" y="210" width="510" height="155" rx="10" className="fill-gray-100 dark:fill-slate-800" />
        <text x="285" y="235" textAnchor="middle" className="fill-amber-400" fontSize="11" fontWeight="bold">Why Seeds Are Different (Sexual Reproduction)</text>

        {/* Parent A DNA */}
        <rect x="55" y="250" width="90" height="30" rx="6" className="fill-blue-900" />
        <text x="100" y="262" textAnchor="middle" className="fill-blue-300" fontSize="8">Parent A: A1 B1</text>
        <text x="100" y="275" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">tall, dark bark</text>

        {/* + */}
        <text x="175" y="268" textAnchor="middle" className="fill-yellow-400" fontSize="16">+</text>

        {/* Parent B DNA */}
        <rect x="200" y="250" width="90" height="30" rx="6" className="fill-red-900" />
        <text x="245" y="262" textAnchor="middle" className="fill-red-300" fontSize="8">Parent B: A2 B2</text>
        <text x="245" y="275" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="7">short, light bark</text>

        {/* Arrow */}
        <line x1="300" y1="265" x2="330" y2="265" className="stroke-yellow-400" strokeWidth="1.5" markerEnd="url(#bodhiDnaArr)" />

        {/* Possible offspring */}
        <rect x="340" y="245" width="180" height="55" rx="6" className="fill-slate-700" />
        <text x="430" y="260" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">Possible offspring:</text>
        <text x="430" y="275" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">A1B1, A1B2, A2B1, A2B2</text>
        <text x="430" y="290" textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="8">Each one is different!</text>

        {/* Key insight */}
        <rect x="55" y="315" width="460" height="35" rx="6" className="fill-emerald-900" opacity="0.5" />
        <text x="285" y="332" textAnchor="middle" className="fill-emerald-300" fontSize="10" fontWeight="bold">A cutting skips sexual reproduction entirely -- no gene mixing, no variation</text>
        <text x="285" y="346" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">That is why the Bodhi Tree in Sri Lanka has the exact same DNA as the original in Bodh Gaya</text>

        <defs>
          <marker id="bodhiDnaArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-yellow-400" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
