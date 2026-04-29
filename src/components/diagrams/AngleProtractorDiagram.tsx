/**
 * Tara holds up a protractor against a partially-open laptop lid. The lid
 * makes an obtuse angle (~130°). The diagram shows three angles found
 * around her: a book corner (90°, right), the laptop lid (obtuse), and a
 * folded paper (acute, ~30°). Acute / right / obtuse all in one scene.
 *
 * Used to open the Types of Angles section.
 */
import Tara from './people/Tara';

export default function AngleProtractorDiagram() {
  const W = 760, H = 380;
  const groundY = 320;

  // Layout: Tara on left, three angle objects across the rest
  // 1. Book corner (right angle, 90°)
  // 2. Laptop lid (obtuse, ~130°)
  // 3. Open scissors / folded paper (acute, ~30°)

  // Helper to draw an angle with arc and label
  const Angle = ({ cx, cy, deg, color, label, range }: {
    cx: number; cy: number; deg: number; color: string; label: string; range: string;
  }) => {
    // Arc from horizontal (0°) up to deg degrees, sweeping counter-clockwise
    const r = 30;
    const ar = (deg * Math.PI) / 180;
    const x2 = cx + r * Math.cos(-ar);
    const y2 = cy + r * Math.sin(-ar);
    const largeArc = deg > 180 ? 1 : 0;
    return (
      <g>
        <path d={`M ${cx + r} ${cy} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth="2.5" />
        {/* Angle text */}
        <text x={cx + r + 16} y={cy - r/2 - 4} fontSize="13" fontWeight="700" fill={color}>{deg}°</text>
        <text x={cx + r + 16} y={cy - r/2 + 10} fontSize="10" fill="#475569" className="dark:fill-gray-300">{range}</text>
        {/* Label below */}
        <text x={cx} y={cy + 56} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{label}</text>
      </g>
    );
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Three kinds of angles found in everyday objects: acute, right, and obtuse">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Counter / table */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          What kind of angle is this?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Three everyday objects, three angle families.
        </text>

        {/* Tara on far left */}
        <Tara x={90} y={groundY} scale={1.0} pose="pointing" />

        {/* Object 1: A book at right angle (the corner of an open book) */}
        <g transform="translate(220, 230)">
          {/* Book — two pages forming a 90° corner */}
          <path d="M 0 0 L 80 0 L 80 4 L 0 4 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.2" />
          <path d="M 0 0 L 0 70 L 4 70 L 4 0 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.2" />
          {/* Right-angle marker */}
          <polyline points="14 4 14 18 4 18" fill="none" stroke="#475569" strokeWidth="1" />
          <Angle cx={0} cy={0} deg={90} color="#16a34a" label="Open book corner" range="Right angle" />
        </g>

        {/* Object 2: Laptop lid at obtuse angle (~130°) */}
        <g transform="translate(420, 280)">
          {/* Base */}
          <rect x="-40" y="-4" width="80" height="6" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          {/* Screen — tilted back */}
          <g transform="rotate(-130)">
            <rect x="-40" y="-4" width="80" height="6" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <rect x="-38" y="-30" width="76" height="26" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Screen content */}
            <rect x="-32" y="-26" width="64" height="18" fill="#0c4a6e" />
            <line x1="-30" y1="-23" x2="-10" y2="-23" stroke="#67e8f9" strokeWidth="0.6" />
            <line x1="-30" y1="-19" x2="-15" y2="-19" stroke="#67e8f9" strokeWidth="0.6" />
            <line x1="-30" y1="-15" x2="-20" y2="-15" stroke="#67e8f9" strokeWidth="0.6" />
          </g>
          <Angle cx={0} cy={0} deg={130} color="#dc2626" label="Open laptop lid" range="Obtuse (>90°)" />
        </g>

        {/* Object 3: Acute angle — open scissors / fan / paper fold */}
        <g transform="translate(620, 280)">
          {/* Closed-fan triangle */}
          {/* Lower blade */}
          <line x1="0" y1="0" x2="60" y2="0" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          {/* Upper blade — rotated by acute angle (e.g., 30°) */}
          <g transform="rotate(-30)">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* Vertex pin */}
          <circle cx="0" cy="0" r="3" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
          <Angle cx={0} cy={0} deg={30} color="#7c3aed" label="Folded paper" range="Acute (<90°)" />
        </g>

        {/* Reminder strip at bottom */}
        <rect x="20" y={H - 36} width={W - 40} height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 21} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Acute &lt; 90° &lt; Right (90°) &lt; Obtuse &lt; 180° &lt; Reflex &lt; 360°
        </text>
      </svg>
    </div>
  );
}
