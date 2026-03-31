const FrogSkinBreathingDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 540"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cutaneous respiration in frogs showing how oxygen and carbon dioxide pass through moist permeable skin"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tiny { font-family: system-ui, sans-serif; font-size: 9px; }
          @keyframes breathe { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
          .pulse { animation: breathe 3s ease-in-out infinite; }
        `}</style>

        <rect width="640" height="540" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Breathing Through Skin — Cutaneous Respiration
        </text>

        {/* Main skin cross-section */}
        <text x="320" y="56" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Cross-Section of Frog Skin
        </text>

        {/* Air above */}
        <rect x="60" y="68" width="520" height="50" rx="4"
          className="fill-sky-50 dark:fill-sky-900/10" />
        <text x="320" y="88" textAnchor="middle" className="small fill-sky-600 dark:fill-sky-400">
          AIR (21% O₂, 0.04% CO₂)
        </text>
        <text x="320" y="102" textAnchor="middle" className="tiny fill-sky-500 dark:fill-sky-500">
          or thin film of water on skin surface
        </text>

        {/* Mucus layer */}
        <rect x="60" y="118" width="520" height="28" rx="0"
          fill="#60a5fa" opacity="0.2" stroke="#60a5fa" strokeWidth="1" />
        <text x="320" y="136" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Mucus layer (keeps skin moist — gases dissolve here first)
        </text>

        {/* Epidermis */}
        <rect x="60" y="146" width="520" height="35" rx="0"
          className="fill-emerald-100 dark:fill-emerald-900/20 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1" />
        <text x="90" y="168" className="small fill-emerald-700 dark:fill-emerald-300" fontWeight="600">
          Epidermis
        </text>
        <text x="250" y="168" className="tiny fill-emerald-600 dark:fill-emerald-400">
          Thin in frogs (1–2 cells thick) — unlike human skin (15–20 cells)
        </text>

        {/* Dermis with capillaries */}
        <rect x="60" y="181" width="520" height="80" rx="0"
          className="fill-rose-50 dark:fill-rose-900/10 stroke-rose-300 dark:stroke-rose-700" strokeWidth="1" />
        <text x="90" y="200" className="small fill-rose-700 dark:fill-rose-300" fontWeight="600">
          Dermis
        </text>

        {/* Capillary network */}
        {[140, 240, 340, 440, 520].map((cx, i) => (
          <g key={i}>
            <ellipse cx={cx} cy={220} rx="30" ry="8"
              fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
            <ellipse cx={cx} cy={220} rx="30" ry="8"
              fill="#ef4444" opacity="0.1" />
          </g>
        ))}
        <text x="350" y="248" className="tiny fill-red-500 dark:fill-red-400">
          Dense capillary network (blood vessels very close to surface)
        </text>

        {/* Blood below */}
        <rect x="60" y="261" width="520" height="30" rx="0"
          fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="0.8" />
        <text x="320" y="280" textAnchor="middle" className="small fill-red-600 dark:fill-red-300">
          Bloodstream (carries O₂ to organs, brings CO₂ back)
        </text>

        {/* Gas exchange arrows */}
        {/* O2 going in */}
        {[160, 360].map((x, i) => (
          <g key={`o2-${i}`}>
            <line x1={x} y1={80} x2={x} y2={260} stroke="#3b82f6" strokeWidth="2.5"
              markerEnd="url(#blueArrow)" className="pulse" style={{ animationDelay: `\${i * 1.5}s` }} />
            <text x={x + 6} y={170} className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">
              O₂ ↓
            </text>
          </g>
        ))}

        {/* CO2 going out */}
        {[260, 460].map((x, i) => (
          <g key={`co2-${i}`}>
            <line x1={x} y1={260} x2={x} y2={80} stroke="#f59e0b" strokeWidth="2.5"
              markerEnd="url(#amberArrow)" className="pulse" style={{ animationDelay: `\${i * 1.5 + 0.7}s` }} />
            <text x={x + 6} y={170} className="label fill-amber-600 dark:fill-amber-400" fontWeight="600">
              CO₂ ↑
            </text>
          </g>
        ))}

        <defs>
          <marker id="blueArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="amberArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Key requirement */}
        <rect x="60" y="302" width="520" height="38" rx="6"
          className="fill-blue-50 dark:fill-blue-900/15 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="320" y="318" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Critical requirement: skin must stay MOIST
        </text>
        <text x="320" y="332" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-400">
          O₂ and CO₂ can only cross the skin when dissolved in water. Dry skin = no breathing = death.
        </text>

        {/* Comparison: how much oxygen from skin vs lungs */}
        <text x="320" y="362" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Where Do Frogs Get Their Oxygen?
        </text>

        {/* Bar charts for 3 frog types */}
        {[
          { name: 'Bullfrog (15 cm)', skin: 20, lungs: 70, mouth: 10, x: 110, color: '#8b5cf6' },
          { name: 'Tree frog (4 cm)', skin: 40, lungs: 45, mouth: 15, x: 320, color: '#3b82f6' },
          { name: 'Tiny frog (8 mm)', skin: 80, lungs: 10, mouth: 10, x: 530, color: '#22c55e' },
        ].map((f, i) => {
          const barX = f.x - 30;
          const barW = 60;
          const totalH = 120;
          const skinH = totalH * f.skin / 100;
          const lungsH = totalH * f.lungs / 100;
          const mouthH = totalH * f.mouth / 100;
          const baseY = 490;
          return (
            <g key={i}>
              {/* Mouth */}
              <rect x={barX} y={baseY - mouthH} width={barW} height={mouthH} rx="0"
                fill="#f59e0b" opacity="0.5" />
              {/* Lungs */}
              <rect x={barX} y={baseY - mouthH - lungsH} width={barW} height={lungsH} rx="0"
                fill="#ef4444" opacity="0.5" />
              {/* Skin */}
              <rect x={barX} y={baseY - totalH} width={barW} height={skinH} rx="2"
                fill={f.color} opacity="0.6" />

              {/* Percentage labels */}
              {skinH > 15 && (
                <text x={f.x} y={baseY - totalH + skinH / 2 + 4} textAnchor="middle"
                  className="tiny" fill="white" fontWeight="600">{f.skin}% skin</text>
              )}
              {lungsH > 15 && (
                <text x={f.x} y={baseY - mouthH - lungsH / 2 + 4} textAnchor="middle"
                  className="tiny" fill="white" fontWeight="600">{f.lungs}% lungs</text>
              )}

              <text x={f.x} y={baseY + 14} textAnchor="middle"
                className="small" fill={f.color} fontWeight="600">{f.name}</text>

              {/* Outline */}
              <rect x={barX} y={baseY - totalH} width={barW} height={totalH} rx="2"
                fill="none" stroke={f.color} strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Legend */}
        <rect x="60" y="510" width="12" height="10" rx="2" fill="#22c55e" opacity="0.6" />
        <text x="76" y="519" className="tiny fill-slate-600 dark:fill-slate-300">Skin</text>
        <rect x="110" y="510" width="12" height="10" rx="2" fill="#ef4444" opacity="0.5" />
        <text x="126" y="519" className="tiny fill-slate-600 dark:fill-slate-300">Lungs</text>
        <rect x="160" y="510" width="12" height="10" rx="2" fill="#f59e0b" opacity="0.5" />
        <text x="176" y="519" className="tiny fill-slate-600 dark:fill-slate-300">Mouth lining</text>

        <text x="530" y="519" textAnchor="middle" className="tiny fill-emerald-500 dark:fill-emerald-400">
          Tiny frogs breathe 80% through their skin!
        </text>
      </svg>
    </div>
  );
};

export default FrogSkinBreathingDiagram;
