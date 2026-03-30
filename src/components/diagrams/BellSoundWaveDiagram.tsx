export default function BellSoundWaveDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 340"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how a bell creates sound waves through vibration"
      >
        <style>{`
          .bsw-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .bsw-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .bsw-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .bsw-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="560" height="340" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" className="bsw-title fill-gray-700 dark:fill-gray-200">
          Sound as Vibration
        </text>

        {/* Bell on the left */}
        <path d="M 80 100 Q 80 60 120 55 Q 160 60 160 100 L 160 160 Q 120 180 80 160 Z"
          className="fill-amber-200 dark:fill-amber-700 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="120" y1="55" x2="120" y2="40"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />
        <circle cx="120" cy="38" r="4" className="fill-gray-500 dark:fill-gray-400" />

        {/* Clapper */}
        <line x1="120" y1="80" x2="120" y2="150"
          className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" />
        <circle cx="120" cy="155" r="8" className="fill-gray-500 dark:fill-gray-400" />

        {/* Vibration lines around bell */}
        {[0, 1, 2].map(i => (
          <path key={`vl-${i}`}
            d={`M ${165 + i * 12} ${90 + i * 5} Q ${170 + i * 12} ${120} ${165 + i * 12} ${150 - i * 5}`}
            fill="none" className="stroke-orange-400 dark:stroke-orange-300" strokeWidth="1.2" opacity={0.8 - i * 0.2} />
        ))}
        {[0, 1, 2].map(i => (
          <path key={`vr-${i}`}
            d={`M ${75 - i * 12} ${90 + i * 5} Q ${70 - i * 12} ${120} ${75 - i * 12} ${150 - i * 5}`}
            fill="none" className="stroke-orange-400 dark:stroke-orange-300" strokeWidth="1.2" opacity={0.8 - i * 0.2} />
        ))}

        <text x="120" y="200" textAnchor="middle" className="bsw-bold fill-amber-600 dark:fill-amber-400">
          Bell Vibrates
        </text>
        <text x="120" y="215" textAnchor="middle" className="bsw-small fill-gray-500 dark:fill-gray-400">
          Metal flexes back and forth
        </text>

        {/* Arrow to wave */}
        <defs>
          <marker id="bsw-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>
        <line x1="195" y1="120" x2="225" y2="120"
          className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" markerEnd="url(#bsw-arr)" />

        {/* Compression / rarefaction zones */}
        <text x="390" y="52" textAnchor="middle" className="bsw-bold fill-blue-600 dark:fill-blue-400">
          Air Pressure Wave
        </text>

        {/* Compressed air (dots close together) */}
        {[0, 1, 2, 3].map(band => {
          const bx = 240 + band * 80;
          const isCompressed = band % 2 === 0;
          const count = isCompressed ? 8 : 4;
          const spacing = isCompressed ? 8 : 16;
          const startX = bx + (80 - count * spacing) / 2;
          return Array.from({ length: count }, (_, j) => (
            <circle key={`dot-${band}-${j}`}
              cx={startX + j * spacing} cy={100 + (j % 2) * 10}
              r={3}
              className="fill-blue-400 dark:fill-blue-300" opacity={0.7} />
          ));
        })}

        {/* Compression labels */}
        <text x="280" y="135" textAnchor="middle" className="bsw-small fill-blue-600 dark:fill-blue-400">
          Compressed
        </text>
        <text x="360" y="135" textAnchor="middle" className="bsw-small fill-gray-500 dark:fill-gray-400">
          Rarefied
        </text>
        <text x="440" y="135" textAnchor="middle" className="bsw-small fill-blue-600 dark:fill-blue-400">
          Compressed
        </text>
        <text x="520" y="135" textAnchor="middle" className="bsw-small fill-gray-500 dark:fill-gray-400">
          Rarefied
        </text>

        {/* Sine wave below showing pressure pattern */}
        <text x="390" y="170" textAnchor="middle" className="bsw-bold fill-violet-600 dark:fill-violet-400">
          Pressure Graph
        </text>
        <line x1="240" y1="230" x2="540" y2="230"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="545" y="234" className="bsw-small fill-gray-500 dark:fill-gray-400">
          time
        </text>
        <text x="237" y="195" textAnchor="end" className="bsw-small fill-gray-500 dark:fill-gray-400">
          +
        </text>
        <text x="237" y="270" textAnchor="end" className="bsw-small fill-gray-500 dark:fill-gray-400">
          −
        </text>

        {/* Sine wave path */}
        <path
          d="M 240 230 Q 260 180 280 230 Q 300 280 320 230 Q 340 180 360 230 Q 380 280 400 230 Q 420 180 440 230 Q 460 280 480 230 Q 500 180 520 230"
          fill="none" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" />

        {/* Wavelength bracket */}
        <line x1="280" y1="285" x2="280" y2="295"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
        <line x1="280" y1="290" x2="360" y2="290"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
        <line x1="360" y1="285" x2="360" y2="295"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />
        <text x="320" y="308" textAnchor="middle" className="bsw-bold fill-emerald-600 dark:fill-emerald-400">
          1 wavelength (λ)
        </text>

        {/* Amplitude arrow */}
        <line x1="250" y1="230" x2="250" y2="195"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="252" y="210" className="bsw-small fill-red-500 dark:fill-red-400">
          Amplitude
        </text>

        {/* Bottom summary */}
        <text x="280" y="332" textAnchor="middle" className="bsw-small fill-gray-500 dark:fill-gray-400">
          A bell pushes air molecules together (compression) and apart (rarefaction) = sound wave
        </text>
      </svg>
    </div>
  );
}
