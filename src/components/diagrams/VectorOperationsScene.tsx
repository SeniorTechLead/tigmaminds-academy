/**
 * Three vector operations side by side: addition (tip-to-tail), scalar
 * multiplication (stretch), and dot product (projection).
 *
 * Used in the Vector Operations section.
 */
import Tara from './people/Tara';

export default function VectorOperationsScene() {
  const W = 760, H = 380;

  // Each operation in its own panel
  const panels = [
    { x: 200, label: 'Addition: a + b', desc: 'Tip-to-tail' },
    { x: 420, label: 'Scaling: 2a', desc: 'Stretch' },
    { x: 640, label: 'Dot: a · b', desc: 'Projection' },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three vector operations: tip-to-tail addition, scalar multiplication (stretching), and dot product as projection">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Three things you can do with vectors
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Add. Stretch. Project.
        </text>

        {/* Tara on lower-left */}
        <Tara x={80} y={350} scale={0.8} pose="standing" />

        {/* Panel 1: Addition (tip to tail) */}
        <g transform={`translate(${panels[0].x}, 100)`}>
          <rect x="-80" y="0" width="160" height="180" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{panels[0].label}</text>
          <text x="0" y="38" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">{panels[0].desc}</text>
          {/* Vector a (right) */}
          <line x1={-50} y1={120} x2={-10} y2={100} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arA-vop)" />
          <text x={-30} y={128} fontSize="11" fontWeight="700" fill="#1d4ed8">a</text>
          {/* Vector b from tip of a */}
          <line x1={-10} y1={100} x2={50} y2={70} stroke="#16a34a" strokeWidth="3" markerEnd="url(#arB-vop)" />
          <text x={20} y={94} fontSize="11" fontWeight="700" fill="#15803d">b</text>
          {/* Resultant a+b */}
          <line x1={-50} y1={120} x2={50} y2={70} stroke="#f97316" strokeWidth="3" strokeDasharray="6 3" markerEnd="url(#arAB-vop)" />
          <text x={10} y={155} fontSize="11" fontWeight="700" fill="#c2410c">a + b</text>
        </g>

        {/* Panel 2: Scalar multiplication */}
        <g transform={`translate(${panels[1].x}, 100)`}>
          <rect x="-80" y="0" width="160" height="180" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{panels[1].label}</text>
          <text x="0" y="38" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">{panels[1].desc}</text>
          {/* Vector a — short */}
          <line x1={-30} y1={140} x2={0} y2={100} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arA2-vop)" />
          <text x={-30} y={148} fontSize="11" fontWeight="700" fill="#1d4ed8">a</text>
          {/* 2a — twice as long */}
          <line x1={0} y1={140} x2={60} y2={60} stroke="#dc2626" strokeWidth="3" markerEnd="url(#arA2x-vop)" />
          <text x={56} y={75} fontSize="11" fontWeight="700" fill="#b91c1c">2a</text>
          <text x="0" y={170} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#475569" className="dark:fill-gray-400">
            Same direction, twice as long
          </text>
        </g>

        {/* Panel 3: Dot product (projection) */}
        <g transform={`translate(${panels[2].x}, 100)`}>
          <rect x="-80" y="0" width="160" height="180" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{panels[2].label}</text>
          <text x="0" y="38" textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">{panels[2].desc}</text>
          {/* Two vectors from origin */}
          <line x1={-50} y1={140} x2={50} y2={140} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arA3-vop)" />
          <text x={50} y={155} fontSize="11" fontWeight="700" fill="#1d4ed8">a</text>
          <line x1={-50} y1={140} x2={20} y2={70} stroke="#16a34a" strokeWidth="3" markerEnd="url(#arB3-vop)" />
          <text x={5} y={70} fontSize="11" fontWeight="700" fill="#15803d">b</text>
          {/* Projection (drop perpendicular) */}
          <line x1={20} y1={70} x2={20} y2={140} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={-50} y1={140} x2={20} y2={140} stroke="#dc2626" strokeWidth="3" />
          <text x="0" y={170} textAnchor="middle" fontSize="10" fontStyle="italic" fill="#dc2626">
            shadow of b on a
          </text>
        </g>

        <defs>
          {['arA-vop', 'arB-vop', 'arAB-vop', 'arA2-vop', 'arA2x-vop', 'arA3-vop', 'arB3-vop'].map((id, i) => {
            const colours = ['#3b82f6', '#16a34a', '#f97316', '#3b82f6', '#dc2626', '#3b82f6', '#16a34a'];
            return (
              <marker key={id} id={id} markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill={colours[i]} />
              </marker>
            );
          })}
        </defs>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 26} width="500" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Add tip-to-tail. Multiply by a number to stretch. Dot product = a·b·cos(θ).
        </text>
      </svg>
    </div>
  );
}
