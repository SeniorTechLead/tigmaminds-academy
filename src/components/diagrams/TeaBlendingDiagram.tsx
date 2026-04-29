/**
 * Bipin works as a tea blender. He mixes three teas in fixed proportions:
 * 60% Assam (strong), 25% Darjeeling (light), 15% Nilgiri (smooth).
 * Visual: three jars showing relative volumes, plus a bar chart of the mix.
 *
 * Used in the Real-World Applications section.
 */
import Bipin from './people/Bipin';

export default function TeaBlendingDiagram() {
  const W = 720, H = 410;
  const groundY = 330;

  // Three jars
  const jars = [
    { name: 'Assam',     pct: 60, x: 280, color: '#7c2d12', flavor: 'Strong, malty' },
    { name: 'Darjeeling', pct: 25, x: 410, color: '#a16207', flavor: 'Light, floral' },
    { name: 'Nilgiri',   pct: 15, x: 540, color: '#854d0e', flavor: 'Smooth, aromatic' },
  ];

  const jarMaxH = 150;
  const jarW = 60;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Bipin blends three teas: 60 percent Assam, 25 percent Darjeeling, 15 percent Nilgiri">

        <rect x="0" y="0" width={W} height={H} fill="#f0fdf4" className="dark:fill-gray-900" />

        {/* Counter */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Bipin's tea blend
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Three teas, mixed in fixed percentages.
        </text>

        {/* Bipin on left, holding measuring spoon */}
        <Bipin x={130} y={groundY} scale={1.1} pose="pointing" />

        {/* Three jars with fill height proportional to percentage */}
        {jars.map((jar) => {
          const fillH = (jar.pct / 60) * jarMaxH; // scale so 60% fills the largest
          const yTop = groundY - fillH;
          return (
            <g key={jar.name}>
              {/* Jar body */}
              <rect x={jar.x - jarW / 2} y={groundY - jarMaxH - 14} width={jarW} height={jarMaxH + 14} rx="3"
                fill="white" stroke="#475569" strokeWidth="1.8" className="dark:fill-gray-800 dark:stroke-gray-400" opacity="0.9" />
              {/* Jar neck */}
              <rect x={jar.x - jarW / 2 + 8} y={groundY - jarMaxH - 24} width={jarW - 16} height="12" rx="2"
                fill="white" stroke="#475569" strokeWidth="1.8" className="dark:fill-gray-800 dark:stroke-gray-400" />
              {/* Jar lid */}
              <rect x={jar.x - jarW / 2 + 4} y={groundY - jarMaxH - 32} width={jarW - 8} height="10" rx="3"
                fill="#475569" stroke="#1e293b" strokeWidth="1" />

              {/* Tea fill */}
              <rect x={jar.x - jarW / 2 + 3} y={yTop} width={jarW - 6} height={fillH} fill={jar.color} opacity="0.85" />
              {/* Surface line of the fill */}
              <ellipse cx={jar.x} cy={yTop} rx={(jarW - 6) / 2} ry="3" fill="#fef9c3" opacity="0.5" />

              {/* Percentage label INSIDE the jar */}
              <text x={jar.x} y={yTop + 22} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
                {jar.pct}%
              </text>

              {/* Name below jar */}
              <text x={jar.x} y={groundY + 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
                {jar.name}
              </text>
              <text x={jar.x} y={groundY + 32} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">
                {jar.flavor}
              </text>
            </g>
          );
        })}

        {/* Total bar chart at the top showing how they sum to 100% */}
        <g transform="translate(220, 80)">
          <text x="220" y="-10" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
            One kilogram of blend, by percentage
          </text>
          {/* 100% bar, segmented */}
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width={(60 / 100) * 440} height="22" rx="0" fill="#7c2d12" stroke="#0f172a" strokeWidth="1" />
            <rect x={(60 / 100) * 440} y="0" width={(25 / 100) * 440} height="22" rx="0" fill="#a16207" stroke="#0f172a" strokeWidth="1" />
            <rect x={(85 / 100) * 440} y="0" width={(15 / 100) * 440} height="22" rx="0" fill="#854d0e" stroke="#0f172a" strokeWidth="1" />

            {/* Inline labels */}
            <text x={(30 / 100) * 440} y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">600g Assam</text>
            <text x={(72.5 / 100) * 440} y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">250g Darj.</text>
            <text x={(92.5 / 100) * 440} y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">150g Nil.</text>

            {/* 100% indicator */}
            <text x="0" y="36" fontSize="10" fill="#475569">0%</text>
            <text x="440" y="36" textAnchor="end" fontSize="10" fill="#475569">100%</text>
          </g>
        </g>

        {/* Footer formula */}
        <rect x={W / 2 - 200} y={H - 36} width="400" height="24" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          60% + 25% + 15% = 100% ✓ (every kilogram adds up)
        </text>
      </svg>
    </div>
  );
}
