export default function DeerLightSpectrumDiagram() {
  const bands = [
    { label: 'Radio', range: '> 1 m', color: '#6b7280', x: 10, w: 70 },
    { label: 'Micro\u00ADwave', range: '1 m\u20131 mm', color: '#9ca3af', x: 82, w: 60 },
    { label: 'Infrared', range: '1 mm\u2013700 nm', color: '#ef4444', x: 144, w: 60 },
    { label: 'UV', range: '400\u201310 nm', color: '#a855f7', x: 388, w: 55 },
    { label: 'X-ray', range: '10\u20130.01 nm', color: '#3b82f6', x: 445, w: 55 },
    { label: 'Gamma', range: '< 0.01 nm', color: '#14b8a6', x: 502, w: 58 },
  ];

  const visColors = [
    { nm: 380, hex: '#8b00ff' },
    { nm: 420, hex: '#4400ff' },
    { nm: 460, hex: '#0044ff' },
    { nm: 490, hex: '#00aaff' },
    { nm: 510, hex: '#00cc44' },
    { nm: 540, hex: '#44dd00' },
    { nm: 570, hex: '#ccdd00' },
    { nm: 590, hex: '#ffaa00' },
    { nm: 620, hex: '#ff4400' },
    { nm: 650, hex: '#dd0000' },
    { nm: 700, hex: '#aa0000' },
  ];

  const visX = 206;
  const visW = 180;

  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        The Electromagnetic Spectrum \u2014 Where Visible Light Lives
      </p>
      <svg viewBox="0 0 570 260" className="w-full max-w-2xl mx-auto">
        {/* Long wavelength label */}
        <text x="40" y="22" textAnchor="middle" fontSize="10" fill="#9ca3af">Long \u03bb</text>
        <text x="40" y="33" textAnchor="middle" fontSize="10" fill="#9ca3af">Low energy</text>

        {/* Short wavelength label */}
        <text x="530" y="22" textAnchor="middle" fontSize="10" fill="#9ca3af">Short \u03bb</text>
        <text x="530" y="33" textAnchor="middle" fontSize="10" fill="#9ca3af">High energy</text>

        {/* Arrow across top */}
        <line x1="80" y1="27" x2="490" y2="27" stroke="#6b7280" strokeWidth={1} markerEnd="url(#arrowGray)" />
        <defs>
          <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* Non-visible bands */}
        {bands.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={50} width={b.w} height={40} rx={4} fill={b.color} opacity={0.18} stroke={b.color} strokeWidth={1} strokeOpacity={0.4} />
            <text x={b.x + b.w / 2} y={66} textAnchor="middle" fontSize="10" fontWeight="700" fill={b.color}>{b.label}</text>
            <text x={b.x + b.w / 2} y={80} textAnchor="middle" fontSize="9" fill="#9ca3af">{b.range}</text>
          </g>
        ))}

        {/* Visible light band - rainbow gradient */}
        <defs>
          <linearGradient id="visGrad" x1="0" y1="0" x2="1" y2="0">
            {visColors.map((c, i) => (
              <stop key={i} offset={`${(i / (visColors.length - 1)) * 100}%`} stopColor={c.hex} />
            ))}
          </linearGradient>
        </defs>
        <rect x={visX} y={50} width={visW} height={40} rx={4} fill="url(#visGrad)" stroke="white" strokeWidth={1.5} strokeOpacity={0.6} />
        <text x={visX + visW / 2} y={66} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          Visible Light
        </text>
        <text x={visX + visW / 2} y={80} textAnchor="middle" fontSize="9" fill="white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          380\u2013700 nm
        </text>

        {/* Expansion of visible band below */}
        <line x1={visX} y1={92} x2={30} y2={130} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="3,2" />
        <line x1={visX + visW} y1={92} x2={540} y2={130} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="3,2" />

        {/* Expanded visible spectrum */}
        <defs>
          <linearGradient id="visExpGrad" x1="0" y1="0" x2="1" y2="0">
            {visColors.map((c, i) => (
              <stop key={i} offset={`${(i / (visColors.length - 1)) * 100}%`} stopColor={c.hex} />
            ))}
          </linearGradient>
        </defs>
        <rect x={30} y={130} width={510} height={30} rx={6} fill="url(#visExpGrad)" />

        {/* Wavelength ticks */}
        {visColors.map((c, i) => {
          const x = 30 + (i / (visColors.length - 1)) * 510;
          return (
            <g key={i}>
              <line x1={x} y1={160} x2={x} y2={170} stroke="white" strokeWidth={1} opacity={0.6} />
              <text x={x} y={182} textAnchor="middle" fontSize="10" fill="#d1d5db">{c.nm}</text>
            </g>
          );
        })}
        <text x={285} y={198} textAnchor="middle" fontSize="10" fill="#9ca3af">Wavelength (nm)</text>

        {/* Golden deer highlight */}
        {(() => {
          const goldStart = 30 + ((570 - 380) / (700 - 380)) * 510;
          const goldEnd = 30 + ((600 - 380) / (700 - 380)) * 510;
          return (
            <g>
              <rect x={goldStart} y={125} width={goldEnd - goldStart} height={40} fill="none" stroke="#fbbf24" strokeWidth={2} rx={3} />
              <line x1={(goldStart + goldEnd) / 2} y1={125} x2={(goldStart + goldEnd) / 2} y2={215} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3,2" />
              <rect x={(goldStart + goldEnd) / 2 - 75} y={215} width={150} height={36} rx={6} fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth={1} />
              <text x={(goldStart + goldEnd) / 2} y={230} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">
                Gold: 570\u2013600 nm
              </text>
              <text x={(goldStart + goldEnd) / 2} y={244} textAnchor="middle" fontSize="10" fill="#d4a017">
                The golden deer\u2019s colour
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
