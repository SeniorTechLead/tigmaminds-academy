export default function CircadianClockDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="24-hour circadian clock showing sleep, alertness, and hormone cycles">
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Your Internal Clock: The 24-Hour Cycle Inside You</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Your body runs on a ~24-hour rhythm even without seeing the sun</text>

        {/* Clock circle */}
        <g transform="translate(290, 290)">
          {/* Outer ring with day/night gradient */}
          <circle r="195" fill="none" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-700" />

          {/* Night arc (top: 10pm-6am) */}
          <path d="M 0 -195 A 195 195 0 0 1 195 0" fill="#1e293b" opacity="0.15" />
          <path d="M 0 -195 A 195 195 0 0 0 -195 0" fill="#1e293b" opacity="0.15" />

          {/* Day arc (bottom: 6am-10pm) */}
          <path d="M -195 0 A 195 195 0 0 0 0 195" fill="#fef3c7" opacity="0.15" />
          <path d="M 0 195 A 195 195 0 0 0 195 0" fill="#fef3c7" opacity="0.15" />

          {/* Hour markers */}
          {[0, 3, 6, 9, 12, 15, 18, 21].map(h => {
            const angle = ((h - 6) / 24) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 175;
            const y = Math.sin(angle) * 175;
            const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
            return (
              <g key={h}>
                <line x1={Math.cos(angle) * 185} y1={Math.sin(angle) * 185} x2={Math.cos(angle) * 195} y2={Math.sin(angle) * 195} stroke="#94a3b8" strokeWidth="2" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">{label}</text>
              </g>
            );
          })}

          {/* Events on the clock */}
          {[
            { h: 6, label: '☀️ Wake up signal', r: 140, color: '#f59e0b' },
            { h: 8, label: '⬆️ Peak alertness', r: 130, color: '#22c55e' },
            { h: 10, label: '🧠 Best focus', r: 140, color: '#3b82f6' },
            { h: 14, label: '😴 Post-lunch dip', r: 130, color: '#f97316' },
            { h: 17, label: '💪 Peak strength', r: 140, color: '#ef4444' },
            { h: 21, label: '🌙 Melatonin rises', r: 130, color: '#8b5cf6' },
            { h: 2, label: '💤 Deepest sleep', r: 140, color: '#1e293b' },
            { h: 4.5, label: '🐦 Cuckoo calls!', r: 120, color: '#f59e0b' },
          ].map((e, i) => {
            const angle = ((e.h - 6) / 24) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * e.r;
            const y = Math.sin(angle) * e.r;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill={e.color} />
                <text x={x + (x > 0 ? 10 : -10)} y={y + 4} textAnchor={x > 0 ? 'start' : 'end'} fontSize="10" fontWeight="600" fill={e.color}>{e.label}</text>
              </g>
            );
          })}

          {/* Center */}
          <circle r="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-950/30" />
          <text x="0" y="-4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f59e0b">SCN</text>
          <text x="0" y="10" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Master</text>
          <text x="0" y="19" textAnchor="middle" fontSize="8" className="fill-gray-500 dark:fill-slate-400">Clock</text>
        </g>

        {/* Side labels */}
        <text x="95" y="162" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-400 dark:fill-slate-500">NIGHT</text>
        <text x="95" y="410" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">DAY</text>

        {/* SCN explanation */}
        <rect x="530" y="80" width="230" height="110" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="645" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f59e0b">SCN = Suprachiasmatic Nucleus</text>
        <text x="645" y="120" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">A tiny cluster of ~20,000 neurons</text>
        <text x="645" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">in your brain that acts as the</text>
        <text x="645" y="150" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">master clock for your whole body.</text>
        <text x="645" y="175" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Light resets it every morning.</text>

        {/* Key insight */}
        <rect x="530" y="210" width="230" height="80" rx="8" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="1" />
        <text x="645" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f59e0b">Why cuckoos call at dawn:</text>
        <text x="645" y="252" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Their SCN triggers singing when</text>
        <text x="645" y="267" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">light reaches a specific threshold</text>
        <text x="645" y="282" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">— same clock, same mechanism as yours</text>
      </svg>
    </div>
  );
}
