import { useState, useEffect } from 'react';

export default function BioluminescenceReactionDiagram() {
  const [glowPhase, setGlowPhase] = useState(0);

  // Animate the glow pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPhase(prev => (prev + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const w = 540, h = 390;

  // Glow intensity oscillates between 0.4 and 1.0
  const glowIntensity = 0.4 + 0.6 * Math.abs(Math.sin((glowPhase / 60) * Math.PI));
  const glowRadius = 14 + 8 * Math.abs(Math.sin((glowPhase / 60) * Math.PI));

  // Efficiency comparison bars
  const bars = [
    { label: 'Firefly', lightPct: 98, heatPct: 2, lightColor: '#84cc16', heatColor: '#ef4444' },
    { label: 'Light bulb', lightPct: 5, heatPct: 95, lightColor: '#facc15', heatColor: '#ef4444' },
  ];

  const barY = 280;
  const barH = 22;
  const barMaxW = 260;
  const barX = 190;

  return (
    <div className="bg-slate-900 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        How a Firefly Makes Light
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Bioluminescence chemical reaction diagram">
        <defs>
          {/* Glow filter for the photon */}
          <radialGradient id="photon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity={glowIntensity} />
            <stop offset="60%" stopColor="#84cc16" stopOpacity={glowIntensity * 0.5} />
            <stop offset="100%" stopColor="#65a30d" stopOpacity={0} />
          </radialGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* === REACTION EQUATION ROW === */}
        {/* Centered at y=100 */}

        {/* Luciferin molecule icon */}
        <g transform="translate(55, 75)">
          {/* Hexagon shape to suggest a molecule */}
          <polygon
            points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
            fill="#fbbf24"
            fillOpacity={0.25}
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
          <circle cx={0} cy={-10} r={3} fill="#fbbf24" />
          <circle cx={10} cy={5} r={3} fill="#fbbf24" />
          <circle cx={-10} cy={5} r={3} fill="#fbbf24" />
          <text x={0} y={42} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">
            Luciferin
          </text>
          <text x={0} y={56} textAnchor="middle" fill="#a3a3a3" fontSize="10">
            (the fuel)
          </text>
        </g>

        {/* Plus sign */}
        <text x={120} y={82} textAnchor="middle" fill="#9ca3af" fontSize="22" fontWeight="700">+</text>

        {/* Oxygen molecule */}
        <g transform="translate(180, 75)">
          <circle cx={-8} cy={0} r={12} fill="#60a5fa" fillOpacity={0.2} stroke="#60a5fa" strokeWidth={1.5} />
          <circle cx={8} cy={0} r={12} fill="#60a5fa" fillOpacity={0.2} stroke="#60a5fa" strokeWidth={1.5} />
          <text x={0} y={5} textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="700">O&#8322;</text>
          <text x={0} y={42} textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">
            Oxygen
          </text>
        </g>

        {/* Reaction arrow */}
        <defs>
          <marker id="bio-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#a3e635" />
          </marker>
        </defs>
        <line x1={230} y1={78} x2={290} y2={78} stroke="#a3e635" strokeWidth={2.5} markerEnd="url(#bio-arrow)" />

        {/* Enzyme label above arrow */}
        <rect x={226} y={42} width={104} height={26} rx={6} className="fill-gray-100 dark:fill-slate-800" stroke="#a3e635" strokeWidth={1} strokeDasharray="4 2" />
        <text x={278} y={60} textAnchor="middle" fill="#a3e635" fontSize="10" fontWeight="600">
          Luciferase
        </text>
        <text x={278} y={36} textAnchor="middle" fill="#86efac" fontSize="10">
          (the helper enzyme)
        </text>

        {/* Light / photon output — animated glow */}
        <g transform="translate(342, 75)">
          {/* Outer glow */}
          <circle cx={0} cy={0} r={glowRadius + 10} fill="url(#photon-glow)" filter="url(#blur-glow)" />
          {/* Inner glow */}
          <circle cx={0} cy={0} r={glowRadius} fill="url(#photon-glow)" />
          {/* Core */}
          <circle cx={0} cy={0} r={6} fill="#a3e635" opacity={glowIntensity} />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const inner = 10;
            const outer = 10 + 8 * glowIntensity;
            return (
              <line
                key={angle}
                x1={Math.cos(rad) * inner}
                y1={Math.sin(rad) * inner}
                x2={Math.cos(rad) * outer}
                y2={Math.sin(rad) * outer}
                stroke="#a3e635"
                strokeWidth={1.5}
                opacity={glowIntensity * 0.7}
              />
            );
          })}
          <text x={0} y={42} textAnchor="middle" fill="#a3e635" fontSize="11" fontWeight="700">
            Light!
          </text>
          <text x={0} y={56} textAnchor="middle" fill="#86efac" fontSize="10">
            (photon)
          </text>
        </g>

        {/* Plus sign between outputs */}
        <text x={415} y={82} textAnchor="middle" fill="#9ca3af" fontSize="22" fontWeight="700">+</text>

        {/* Oxyluciferin (spent molecule) */}
        <g transform="translate(480, 75)">
          <polygon
            points="0,-18 15,-9 15,9 0,18 -15,9 -15,-9"
            fill="#6b7280"
            fillOpacity={0.2}
            stroke="#6b7280"
            strokeWidth={1.5}
            strokeDasharray="3 2"
          />
          <circle cx={0} cy={-8} r={2.5} fill="#9ca3af" />
          <circle cx={8} cy={4} r={2.5} fill="#9ca3af" />
          <circle cx={-8} cy={4} r={2.5} fill="#9ca3af" />
          <text x={0} y={40} textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="600">
            Oxyluciferin
          </text>
          <text x={0} y={54} textAnchor="middle" fill="#6b7280" fontSize="10">
            (spent fuel)
          </text>
        </g>

        {/* Divider line */}
        <line x1={40} y1={210} x2={500} y2={210} stroke="#334155" strokeWidth={1} />

        {/* === SECTION TITLE === */}
        <text x={w / 2} y={238} textAnchor="middle" fill="#d1d5db" fontSize="12" fontWeight="700">
          Why fireflies are energy superstars
        </text>

        {/* === EFFICIENCY COMPARISON BARS === */}
        {bars.map((bar, i) => {
          const y = barY + i * (barH + 30);
          const lightW = (bar.lightPct / 100) * barMaxW;
          const heatW = (bar.heatPct / 100) * barMaxW;

          return (
            <g key={i}>
              {/* Row label */}
              <text x={barX - 12} y={y + barH / 2 + 4} textAnchor="end" fill="#e5e7eb" fontSize="11" fontWeight="600">
                {bar.label}
              </text>

              {/* Light portion */}
              <rect x={barX} y={y} width={lightW} height={barH} rx={4} fill={bar.lightColor} opacity={0.85} />
              {lightW > 30 && (
                <text x={barX + lightW / 2} y={y + barH / 2 + 4} textAnchor="middle" fill="#1a1a1a" fontSize="10" fontWeight="700">
                  {bar.lightPct}% light
                </text>
              )}
              {lightW <= 30 && (
                <text x={barX + lightW + 4} y={y + barH / 2 + 4} textAnchor="start" fill={bar.lightColor} fontSize="10" fontWeight="600">
                  {bar.lightPct}%
                </text>
              )}

              {/* Heat portion */}
              <rect x={barX + lightW} y={y} width={heatW} height={barH} rx={4} fill={bar.heatColor} opacity={0.5} />
              {heatW > 30 && (
                <text x={barX + lightW + heatW / 2} y={y + barH / 2 + 4} textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="600">
                  {bar.heatPct}% heat
                </text>
              )}
              {heatW <= 30 && (
                <text x={barX + lightW + heatW + 4} y={y + barH / 2 + 4} textAnchor="start" fill="#fca5a5" fontSize="10" fontWeight="600">
                  {bar.heatPct}%
                </text>
              )}
            </g>
          );
        })}

        {/* Bottom annotation */}
        <text x={w / 2} y={h - 10} textAnchor="middle" fill="#6b7280" fontSize="10">
          Fireflies waste almost no energy as heat — nature's most efficient light!
        </text>
      </svg>
    </div>
  );
}
