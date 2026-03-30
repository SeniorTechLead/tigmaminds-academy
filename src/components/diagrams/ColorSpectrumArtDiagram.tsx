export default function ColorSpectrumArtDiagram() {
  /* Visible spectrum colors with wavelengths */
  const spectrumColors = [
    { color: '#8b00ff', nm: 380 },
    { color: '#6600ff', nm: 410 },
    { color: '#0000ff', nm: 450 },
    { color: '#0066ff', nm: 475 },
    { color: '#00ccff', nm: 490 },
    { color: '#00ff00', nm: 530 },
    { color: '#66ff00', nm: 560 },
    { color: '#ffff00', nm: 580 },
    { color: '#ffaa00', nm: 600 },
    { color: '#ff6600', nm: 620 },
    { color: '#ff0000', nm: 660 },
    { color: '#cc0000', nm: 700 },
  ];

  const barX = 40;
  const barWidth = 500;
  const barY = 55;
  const barH = 30;
  const segW = barWidth / spectrumColors.length;

  return (
    <svg
      viewBox="0 0 580 390"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Color science diagram with visible spectrum, RGB additive mixing circles, and a slowly spinning color wheel"
    >
      <style>{`
        @keyframes csWheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .cs-wheel {
          animation: csWheelSpin 20s linear infinite;
          transform-origin: 460px 280px;
        }
        @keyframes csGlow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.55; }
        }
        .cs-glow { animation: csGlow 2s ease-in-out infinite; }
        @keyframes csShimmer {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .cs-shimmer { animation: csShimmer 3s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <rect width="580" height="390" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="290" y="24" textAnchor="middle" className="fill-gray-300" fontSize="14" fontWeight="700">
        The Visible Spectrum and Color Mixing
      </text>
      <text x="290" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        Light wavelengths, additive RGB mixing, and the color wheel
      </text>

      {/* ---- SPECTRUM BAR ---- */}
      {spectrumColors.map((c, i) => (
        <rect key={i} x={barX + i * segW} y={barY} width={segW + 1} height={barH} fill={c.color} />
      ))}
      {/* Border */}
      <rect x={barX} y={barY} width={barWidth} height={barH} rx="4" fill="none" stroke="#4b5563" strokeWidth="1" />

      {/* Wavelength labels */}
      <text x={barX} y={barY + barH + 14} className="fill-violet-400" fontSize="10">380 nm</text>
      <text x={barX + barWidth / 4} y={barY + barH + 14} textAnchor="middle" className="fill-blue-400" fontSize="10">~470</text>
      <text x={barX + barWidth / 2} y={barY + barH + 14} textAnchor="middle" className="fill-green-400" fontSize="10">~530</text>
      <text x={barX + barWidth * 3 / 4} y={barY + barH + 14} textAnchor="middle" className="fill-orange-400" fontSize="10">~610</text>
      <text x={barX + barWidth} y={barY + barH + 14} textAnchor="end" className="fill-red-400" fontSize="10">700 nm</text>

      {/* UV / IR labels */}
      <text x={barX - 5} y={barY + 20} textAnchor="end" className="fill-gray-600" fontSize="9">UV</text>
      <text x={barX + barWidth + 5} y={barY + 20} className="fill-gray-600" fontSize="9">IR</text>

      {/* ---- RGB ADDITIVE MIXING ---- */}
      <text x="155" y="125" textAnchor="middle" className="fill-gray-400" fontSize="12" fontWeight="600">
        Additive Mixing (Light)
      </text>
      <text x="155" y="140" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Screens, projectors
      </text>

      {/* Three overlapping circles with mix-blend-mode equivalent via opacity */}
      <g className="cs-glow">
        {/* Red circle */}
        <circle cx="130" cy="200" r="42" fill="#ff0000" opacity="0.5" />
        {/* Green circle */}
        <circle cx="175" cy="200" r="42" fill="#00ff00" opacity="0.5" />
        {/* Blue circle */}
        <circle cx="152" cy="235" r="42" fill="#0000ff" opacity="0.5" />
      </g>

      {/* Labels for overlaps */}
      <text x="152" y="188" textAnchor="middle" className="fill-yellow-300" fontSize="9" fontWeight="600">Yellow</text>
      <text x="120" y="224" textAnchor="middle" className="fill-fuchsia-400" fontSize="9" fontWeight="600">Magenta</text>
      <text x="185" y="224" textAnchor="middle" className="fill-cyan-400" fontSize="9" fontWeight="600">Cyan</text>
      <text x="152" y="215" textAnchor="middle" className="fill-white cs-shimmer" fontSize="10" fontWeight="700">White</text>

      {/* Primary labels */}
      <text x="108" y="195" textAnchor="end" className="fill-red-400" fontSize="10" fontWeight="600">R</text>
      <text x="198" y="195" className="fill-green-400" fontSize="10" fontWeight="600">G</text>
      <text x="152" y="260" textAnchor="middle" className="fill-blue-400" fontSize="10" fontWeight="600">B</text>

      <text x="155" y="285" textAnchor="middle" className="fill-gray-500" fontSize="10">
        R + G + B = White
      </text>

      {/* Divider */}
      <line x1="290" y1="120" x2="290" y2="380" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

      {/* ---- COLOR WHEEL ---- */}
      <text x="440" y="125" textAnchor="middle" className="fill-gray-400" fontSize="12" fontWeight="600">
        Color Wheel
      </text>
      <text x="440" y="140" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Slowly spinning
      </text>

      <g className="cs-wheel">
        {/* 12 color wheel segments */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const nextAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
          const cx = 460;
          const cy = 280;
          const r = 65;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          const x2 = cx + r * Math.cos(nextAngle);
          const y2 = cy + r * Math.sin(nextAngle);
          const hue = i * 30;
          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`}
              fill={`hsl(${hue}, 80%, 55%)`}
              stroke="#1f2937"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Center circle */}
        <circle cx="460" cy="280" r="20" className="fill-gray-900" stroke="#4b5563" strokeWidth="1" />
      </g>

      {/* Complementary pairs note */}
      <text x="440" y="360" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Opposite colors are complementary
      </text>
      <text x="440" y="375" textAnchor="middle" className="fill-gray-500" fontSize="10">
        (e.g., red-cyan, blue-orange)
      </text>

      {/* Bottom note */}
      <text x="155" y="310" textAnchor="middle" className="fill-gray-600" fontSize="10">
        Paint mixing is SUBTRACTIVE
      </text>
      <text x="155" y="325" textAnchor="middle" className="fill-gray-600" fontSize="10">
        (C + M + Y = Black)
      </text>
    </svg>
  );
}
