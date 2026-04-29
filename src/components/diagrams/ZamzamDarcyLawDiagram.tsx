/**
 * ZamzamDarcyLawDiagram — Visual explanation of Darcy’s law: Q = -KA(dh/dL).
 * Shows a tube of porous material with head difference driving flow.
 */
export default function ZamzamDarcyLawDiagram() {
  const tubeY = 90;
  const tubeH = 60;
  const tubeLeft = 60;
  const tubeRight = 340;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 400 280" className="w-full" role="img" aria-label="Darcy’s law: flow through porous material driven by hydraulic head difference">
        <rect width="400" height="280" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Darcy’s Law: How Fast Groundwater Flows</text>

        {/* Equation */}
        <text x="200" y="44" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">Q = K × A × (Δh / L)</text>
        <text x="200" y="58" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Flow rate = hydraulic conductivity × area × hydraulic gradient</text>

        {/* Tube of porous material */}
        <rect x={tubeLeft} y={tubeY} width={tubeRight - tubeLeft} height={tubeH} rx="4" className="fill-gray-200 dark:fill-slate-700" stroke="#64748b" strokeWidth="1.5" />

        {/* Grain fill inside tube */}
        {Array.from({ length: 40 }).map((_, i) => {
          const gx = tubeLeft + 10 + (i % 10) * 27;
          const gy = tubeY + 10 + Math.floor(i / 10) * 14;
          return <circle key={i} cx={gx} cy={gy} r="4" fill="#a16207" opacity="0.4" />;
        })}
        <text x={200} y={tubeY + tubeH / 2 + 4} textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="bold">Porous Material (K)</text>

        {/* Left reservoir (high head) */}
        <rect x={20} y={70} width={40} height={100} rx="3" fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="1" />
        <rect x={21} y={78} width={38} height={91} fill="#60a5fa" opacity="0.4" />
        <text x={40} y={185} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="bold">h₁</text>
        <text x={40} y="198" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">(High)</text>

        {/* Right reservoir (low head) */}
        <rect x={340} y={70} width={40} height={100} rx="3" fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="1" />
        <rect x={341} y={100} width={38} height={69} fill="#60a5fa" opacity="0.4" />
        <text x={360} y={185} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="bold">h₂</text>
        <text x={360} y="198" textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="9">(Low)</text>

        {/* Head difference annotation */}
        <line x1="30" y1="78" x2="30" y2="100" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="25" y1="78" x2="35" y2="78" stroke="#ef4444" strokeWidth="1" />
        <line x1="25" y1="100" x2="35" y2="100" stroke="#ef4444" strokeWidth="1" />
        <text x="16" y="92" className="fill-red-600 dark:fill-red-400" fontSize="9" fontWeight="bold">Δh</text>

        {/* Length annotation */}
        <line x1={tubeLeft} y1={tubeY + tubeH + 15} x2={tubeRight} y2={tubeY + tubeH + 15} stroke="#64748b" strokeWidth="1" />
        <line x1={tubeLeft} y1={tubeY + tubeH + 10} x2={tubeLeft} y2={tubeY + tubeH + 20} stroke="#64748b" strokeWidth="1" />
        <line x1={tubeRight} y1={tubeY + tubeH + 10} x2={tubeRight} y2={tubeY + tubeH + 20} stroke="#64748b" strokeWidth="1" />
        <text x="200" y={tubeY + tubeH + 28} textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="10" fontWeight="bold">L (length of flow path)</text>

        {/* Flow arrows */}
        {[100, 170, 240, 300].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={tubeY + tubeH / 2} x2={x + 18} y2={tubeY + tubeH / 2} stroke="#3b82f6" strokeWidth="2" />
            <polygon points={`${x + 18},${tubeY + tubeH / 2} ${x + 14},${tubeY + tubeH / 2 - 3} ${x + 14},${tubeY + tubeH / 2 + 3}`} fill="#3b82f6" />
          </g>
        ))}

        {/* Variable explanations */}
        {[
          { label: 'Q', desc: 'Flow rate (m³/s)', color: '#3b82f6', x: 50 },
          { label: 'K', desc: 'Hydraulic conductivity (m/s)', color: '#a16207', x: 155 },
          { label: 'A', desc: 'Cross-section area (m²)', color: '#059669', x: 270 },
        ].map((v, i) => (
          <g key={i}>
            <rect x={v.x} y={210} width={100} height={32} rx="4" className="fill-gray-50 dark:fill-slate-800" stroke={v.color} strokeWidth="1" />
            <text x={v.x + 50} y={224} textAnchor="middle" fill={v.color} fontSize="11" fontWeight="bold">{v.label}</text>
            <text x={v.x + 50} y={237} textAnchor="middle" className="fill-gray-600 dark:fill-slate-400" fontSize="8">{v.desc}</text>
          </g>
        ))}

        {/* Key insight */}
        <text x="200" y="262" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="bold">Steeper gradient (Δh/L) or more permeable rock (K) = faster flow</text>
      </svg>
    </div>
  );
}
