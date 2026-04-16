'use client';
import { useState } from 'react';

type Panel = 'innate' | 'adaptive' | 'timeline';

const PANELS: { key: Panel; label: string }[] = [
  { key: 'innate', label: 'Innate (Fast)' },
  { key: 'adaptive', label: 'Adaptive (Targeted)' },
  { key: 'timeline', label: 'Response Timeline' },
];

export default function ImmuneResponseDiagram() {
  const [panel, setPanel] = useState<Panel>('innate');

  const W = 460, H = 300;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {PANELS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPanel(p.key)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              panel === p.key
                ? 'bg-teal-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Immune response diagram">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        {panel === 'innate' && (
          <>
            <text x={W / 2} y={22} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
              Innate Immune Response
            </text>
            <text x={W / 2} y={38} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              First line of defence — fast, non-specific (minutes to hours)
            </text>

            {/* Pathogen */}
            <circle cx={60} cy={100} r={14} fill="#ef4444" opacity={0.8} />
            <text x={60} y={104} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">🦠</text>
            <text x={60} y={130} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="8" fontWeight="600">Pathogen</text>

            {/* Arrow */}
            <line x1={80} y1={100} x2={115} y2={100} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow)" />

            {/* Skin barrier */}
            <rect x={120} y={60} width={70} height={80} rx={4} className="fill-amber-100 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={155} y={78} textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="700">Physical</text>
            <text x={155} y={78 + 13} textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="700">Barriers</text>
            <text x={155} y={108} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Skin</text>
            <text x={155} y={119} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Mucus membranes</text>
            <text x={155} y={130} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Stomach acid</text>

            {/* If breached */}
            <line x1={195} y1={100} x2={225} y2={100} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow)" />
            <text x={210} y={93} textAnchor="middle" className="fill-gray-400" fontSize="7">breached?</text>

            {/* Inflammatory response */}
            <rect x={230} y={55} width={90} height={95} rx={4} className="fill-orange-100 dark:fill-orange-900/30" stroke="#f97316" strokeWidth="1.5" />
            <text x={275} y={72} textAnchor="middle" fill="#ea580c" fontSize="9" fontWeight="700">Inflammatory</text>
            <text x={275} y={84} textAnchor="middle" fill="#ea580c" fontSize="9" fontWeight="700">Response</text>
            <text x={275} y={100} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Neutrophils engulf</text>
            <text x={275} y={111} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Macrophages eat</text>
            <text x={275} y={122} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Fever slows microbes</text>
            <text x={275} y={133} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">NK cells kill infected</text>

            {/* Complement */}
            <rect x={340} y={70} width={100} height={65} rx={4} className="fill-cyan-100 dark:fill-cyan-900/30" stroke="#06b6d4" strokeWidth="1.5" />
            <text x={390} y={88} textAnchor="middle" fill="#0891b2" fontSize="9" fontWeight="700">Complement</text>
            <text x={390} y={100} textAnchor="middle" fill="#0891b2" fontSize="9" fontWeight="700">System</text>
            <text x={390} y={115} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">~30 proteins</text>
            <text x={390} y={126} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Punch holes in bacteria</text>

            {/* Summary */}
            <rect x={30} y={170} width={W - 60} height={50} rx={6} className="fill-teal-50 dark:fill-teal-900/20" stroke="#14b8a6" strokeWidth="1" />
            <text x={W / 2} y={188} textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="9" fontWeight="600">Key features: Non-specific — attacks ALL invaders the same way</text>
            <text x={W / 2} y={202} textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="9">Response time: 0–12 hours | No memory | Born with it</text>

            <defs>
              <marker id="imm-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
          </>
        )}

        {panel === 'adaptive' && (
          <>
            <text x={W / 2} y={22} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
              Adaptive Immune Response
            </text>
            <text x={W / 2} y={38} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              Second line — specific, creates memory (days to weeks)
            </text>

            {/* Antigen presented */}
            <circle cx={50} cy={90} r={12} fill="#ef4444" opacity={0.7} />
            <text x={50} y={94} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">Ag</text>
            <text x={50} y={115} textAnchor="middle" className="fill-red-500" fontSize="7">Antigen</text>

            <line x1={65} y1={90} x2={95} y2={90} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow2)" />

            {/* APC */}
            <ellipse cx={120} cy={90} rx={22} ry={16} className="fill-orange-200 dark:fill-orange-800" stroke="#f97316" strokeWidth="1" />
            <text x={120} y={88} textAnchor="middle" className="fill-orange-800 dark:fill-orange-200" fontSize="7" fontWeight="600">APC</text>
            <text x={120} y={97} textAnchor="middle" className="fill-orange-800 dark:fill-orange-200" fontSize="6">presents</text>

            {/* Branch to T and B cells */}
            <line x1={145} y1={82} x2={195} y2={60} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow2)" />
            <line x1={145} y1={98} x2={195} y2={130} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow2)" />

            {/* T cells branch */}
            <rect x={200} y={42} width={85} height={55} rx={6} className="fill-blue-100 dark:fill-blue-900/30" stroke="#3b82f6" strokeWidth="1.5" />
            <text x={242} y={56} textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="700">T Cells</text>
            <text x={242} y={68} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Helper T → activate B</text>
            <text x={242} y={79} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Killer T → destroy</text>
            <text x={242} y={90} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">infected cells directly</text>

            {/* B cells branch */}
            <rect x={200} y={110} width={85} height={55} rx={6} className="fill-green-100 dark:fill-green-900/30" stroke="#22c55e" strokeWidth="1.5" />
            <text x={242} y={124} textAnchor="middle" fill="#16a34a" fontSize="9" fontWeight="700">B Cells</text>
            <text x={242} y={136} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Produce antibodies</text>
            <text x={242} y={147} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Y-shaped proteins</text>
            <text x={242} y={158} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Lock onto antigens</text>

            {/* Antibodies */}
            <line x1={290} y1={137} x2={330} y2={137} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow2)" />
            {[0, 1, 2].map((i) => (
              <text key={i} x={340 + i * 20} y={140} fill="#16a34a" fontSize="14">Y</text>
            ))}
            <text x={370} y={155} textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="7" fontWeight="600">Antibodies</text>

            {/* Memory cells */}
            <line x1={290} y1={70} x2={330} y2={70} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#imm-arrow2)" />
            <rect x={335} y={55} width={90} height={35} rx={6} className="fill-purple-100 dark:fill-purple-900/30" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x={380} y={70} textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="700">Memory Cells</text>
            <text x={380} y={82} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="7">Remember for years!</text>

            {/* Summary */}
            <rect x={30} y={180} width={W - 60} height={40} rx={6} className="fill-teal-50 dark:fill-teal-900/20" stroke="#14b8a6" strokeWidth="1" />
            <text x={W / 2} y={196} textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="9" fontWeight="600">
              Specific to each pathogen | Creates lasting memory | Basis of vaccines
            </text>
            <text x={W / 2} y={210} textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="9">
              First exposure: 7–14 days | Second exposure: 1–2 days (memory!)
            </text>

            <defs>
              <marker id="imm-arrow2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
          </>
        )}

        {panel === 'timeline' && (
          <>
            <text x={W / 2} y={22} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
              Primary vs Secondary Immune Response
            </text>

            {/* Axes */}
            {(() => {
              const mx2 = 55, mt2 = 50, ph2 = 160, pw2 = W - mx2 - 30;
              const toX = (d: number) => mx2 + (d / 28) * pw2;
              const toY = (v: number) => mt2 + ph2 - (v / 100) * ph2;

              // Primary: slow rise, moderate peak ~day 10-14
              const primary: [number, number][] = [];
              for (let d = 0; d <= 28; d++) {
                let v = 0;
                if (d >= 3 && d <= 14) v = 35 * Math.sin(((d - 3) / 11) * Math.PI);
                else if (d > 14) v = 35 * Math.exp(-0.15 * (d - 14));
                primary.push([d, v]);
              }

              // Secondary: faster, higher peak ~day 3-5 after re-exposure at day 14
              const secondary: [number, number][] = [];
              for (let d = 14; d <= 28; d++) {
                const t = d - 14;
                let v = 0;
                if (t >= 1 && t <= 5) v = 90 * Math.sin(((t - 1) / 4) * Math.PI);
                else if (t > 5) v = 90 * Math.exp(-0.12 * (t - 5));
                secondary.push([d, v]);
              }

              const pathD = (pts: [number, number][]) =>
                pts.map(([d, v], i) => `${i === 0 ? 'M' : 'L'} ${toX(d).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');

              return (
                <>
                  {/* Y axis */}
                  <line x1={mx2} y1={mt2} x2={mx2} y2={mt2 + ph2} stroke="#94a3b8" strokeWidth="1" />
                  <text x={15} y={mt2 + ph2 / 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8" transform={`rotate(-90, 15, ${mt2 + ph2 / 2})`}>
                    Antibody level
                  </text>

                  {/* X axis */}
                  <line x1={mx2} y1={mt2 + ph2} x2={mx2 + pw2} y2={mt2 + ph2} stroke="#94a3b8" strokeWidth="1" />
                  {[0, 7, 14, 21, 28].map((d) => (
                    <g key={d}>
                      <line x1={toX(d)} y1={mt2 + ph2} x2={toX(d)} y2={mt2 + ph2 + 4} stroke="#94a3b8" strokeWidth="1" />
                      <text x={toX(d)} y={mt2 + ph2 + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">Day {d}</text>
                    </g>
                  ))}

                  {/* Re-exposure marker */}
                  <line x1={toX(14)} y1={mt2} x2={toX(14)} y2={mt2 + ph2} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
                  <text x={toX(14)} y={mt2 - 4} textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="600">2nd exposure</text>

                  {/* Primary curve */}
                  <path d={pathD(primary)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                  <text x={toX(10)} y={toY(35) - 8} textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">Primary (slow, low)</text>

                  {/* Secondary curve */}
                  <path d={pathD(secondary)} fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <text x={toX(19)} y={toY(90) - 8} textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="600">Secondary (fast, high)</text>

                  {/* Annotation */}
                  <text x={W / 2} y={mt2 + ph2 + 35} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
                    Memory cells enable a faster, stronger response on re-infection
                  </text>
                </>
              );
            })()}
          </>
        )}
      </svg>
    </div>
  );
}
