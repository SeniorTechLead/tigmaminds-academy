/**
 * Tara holds a traditional Assamese japi hat. The hat's woven pattern has
 * rotational symmetry of order 8 — turning it 45° gives back the same view.
 * Visual: the hat shown four times at 0°, 45°, 90°, 135°, with arrows
 * between them showing the rotations.
 *
 * Used to open the Transformations section.
 */
import Tara from './people/Tara';

export default function JapiRotationDiagram() {
  const W = 760, H = 380;

  // Japi hat — drawn as a top-down view with 8-fold rotational pattern
  const Japi = ({ cx, cy, r, rotation = 0 }: { cx: number; cy: number; r: number; rotation?: number }) => {
    const segments = 8;
    return (
      <g transform={`rotate(${rotation}, ${cx}, ${cy})`}>
        {/* Outer brim */}
        <circle cx={cx} cy={cy} r={r} fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        {/* Inner cone */}
        <circle cx={cx} cy={cy} r={r * 0.45} fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
        {/* Wedges around — 8 alternating coloured segments to show the symmetry */}
        {Array.from({ length: segments }).map((_, i) => {
          const a1 = (i * 360 / segments - 90) * Math.PI / 180;
          const a2 = ((i + 1) * 360 / segments - 90) * Math.PI / 180;
          const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
          const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
          const x1i = cx + r * 0.45 * Math.cos(a1), y1i = cy + r * 0.45 * Math.sin(a1);
          const x2i = cx + r * 0.45 * Math.cos(a2), y2i = cy + r * 0.45 * Math.sin(a2);
          return (
            <path key={i}
              d={`M ${x1i} ${y1i} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x2i} ${y2i} A ${r * 0.45} ${r * 0.45} 0 0 0 ${x1i} ${y1i} Z`}
              fill={i % 2 === 0 ? '#fef3c7' : '#fbbf24'}
              stroke="#92400e" strokeWidth="0.8" />
          );
        })}
        {/* Decorative dots — one per segment, marking rotational positions */}
        {Array.from({ length: segments }).map((_, i) => {
          const a = (i * 360 / segments - 90 + 22.5) * Math.PI / 180;
          const px = cx + r * 0.72 * Math.cos(a);
          const py = cy + r * 0.72 * Math.sin(a);
          // Make ONE dot a different colour to visually track the rotation
          const isMarker = i === 0;
          return (
            <circle key={i} cx={px} cy={py} r={isMarker ? 4 : 3}
              fill={isMarker ? '#dc2626' : '#7c2d12'}
              stroke="white" strokeWidth={isMarker ? 1.5 : 0.8} />
          );
        })}
        {/* Centre cap */}
        <circle cx={cx} cy={cy} r={r * 0.12} fill="#7c2d12" stroke="#451a03" strokeWidth="1" />
      </g>
    );
  };

  // Three small japi hats showing different rotations + one large showing original
  const positions = [
    { cx: 250, cy: 200, rot: 0,   label: '0°' },
    { cx: 400, cy: 200, rot: 45,  label: 'rotate 45°' },
    { cx: 550, cy: 200, rot: 90,  label: 'rotate 90°' },
    { cx: 700, cy: 200, rot: 135, label: 'rotate 135°' },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A japi hat shown at four rotations: 0, 45, 90, and 135 degrees, demonstrating 8-fold rotational symmetry">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Rotational symmetry — the japi hat
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Turn it 45° and the design lands on itself.
        </text>

        {/* Tara on far left, lower */}
        <Tara x={100} y={350} scale={0.8} pose="pointing" />

        {/* Four japi hats at 0°, 45°, 90°, 135° rotation */}
        {positions.map((p, i) => (
          <g key={i}>
            <Japi cx={p.cx} cy={p.cy} r={50} rotation={p.rot} />
            <text x={p.cx} y={p.cy + 70} textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
              {p.label}
            </text>
          </g>
        ))}

        {/* Arrows between successive japis */}
        {positions.slice(0, -1).map((p, i) => {
          const next = positions[i + 1];
          return (
            <g key={`arrow-${i}`}>
              <path d={`M ${p.cx + 56} ${p.cy} Q ${(p.cx + next.cx) / 2} ${p.cy - 30} ${next.cx - 56} ${next.cy}`}
                fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arEnd-jr)" />
            </g>
          );
        })}
        <defs>
          <marker id="arEnd-jr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#16a34a" />
          </marker>
        </defs>

        {/* Tracking dot legend */}
        <rect x={W / 2 - 200} y={290} width="400" height="32" rx="8"
          fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <circle cx={W / 2 - 180} cy="306" r="5" fill="#dc2626" stroke="white" strokeWidth="1.5" />
        <text x={W / 2 - 168} y="310" fontSize="11" fontWeight="600" fill="#475569" className="dark:fill-gray-300">
          Watch the red dot — it moves around the hat as we rotate.
        </text>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 30} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The japi has 8-fold rotational symmetry: 8 different rotations leave it unchanged.
        </text>
      </svg>
    </div>
  );
}
