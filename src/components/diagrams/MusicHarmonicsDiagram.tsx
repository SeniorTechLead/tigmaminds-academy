export default function MusicHarmonicsDiagram() {
  /* Generate a sine wave with given harmonics */
  const makeWavePath = (
    harmonics: { n: number; amp: number }[],
    xStart: number,
    y: number,
    width: number,
    baseAmp: number,
  ) => {
    const pts = 200;
    const d = Array.from({ length: pts + 1 }, (_, i) => {
      const t = i / pts;
      const x = xStart + t * width;
      let val = 0;
      for (const h of harmonics) {
        val += h.amp * Math.sin(2 * Math.PI * h.n * t);
      }
      const yVal = y - val * baseAmp;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${yVal.toFixed(1)}`;
    }).join(' ');
    return d;
  };

  const guitarHarmonics = [
    { n: 1, amp: 1.0 },
    { n: 2, amp: 0.7 },
    { n: 3, amp: 0.45 },
    { n: 4, amp: 0.3 },
    { n: 5, amp: 0.15 },
    { n: 6, amp: 0.08 },
  ];

  const fluteHarmonics = [
    { n: 1, amp: 1.0 },
    { n: 2, amp: 0.15 },
    { n: 3, amp: 0.05 },
  ];

  const waveWidth = 240;
  const baseAmp = 18;

  return (
    <svg
      viewBox="0 0 600 380"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Diagram comparing guitar and flute harmonics showing how different overtones create different timbres"
    >
      <style>{`
        @keyframes mhWaveOsc {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-8px); }
          100% { transform: translateX(0); }
        }
        .mh-wave-guitar {
          animation: mhWaveOsc 1.5s ease-in-out infinite;
        }
        .mh-wave-flute {
          animation: mhWaveOsc 1.5s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        @keyframes mhPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .mh-note-pulse {
          animation: mhPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <rect width="600" height="380" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="300" y="24" textAnchor="middle" className="fill-gray-300" fontSize="14" fontWeight="700">
        Why Guitar and Flute Sound Different
      </text>
      <text x="300" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        Same note (middle C, 262 Hz) — different harmonic overtones
      </text>

      {/* ---- Guitar section ---- */}
      <text x="145" y="62" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="600">
        Guitar
      </text>

      {/* Individual harmonics */}
      {guitarHarmonics.map((h, i) => {
        const y = 90 + i * 28;
        const alpha = 0.3 + h.amp * 0.5;
        return (
          <g key={`gh${i}`}>
            <text x="20" y={y + 4} className="fill-gray-500" fontSize="10">
              {h.n === 1 ? 'Fund.' : `${h.n}x`}
            </text>
            <rect
              x="50"
              y={y - 5}
              width={h.amp * 100}
              height="10"
              rx="3"
              fill="#f59e0b"
              opacity={alpha}
            />
            <text x={58 + h.amp * 100} y={y + 4} className="fill-gray-500" fontSize="9">
              {(h.amp * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}

      {/* Combined guitar waveform */}
      <text x="145" y="270" textAnchor="middle" className="fill-amber-300" fontSize="11" fontWeight="600">
        Combined waveform
      </text>
      <g className="mh-wave-guitar">
        <path
          d={makeWavePath(guitarHarmonics, 25, 310, waveWidth, baseAmp)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />
      </g>
      {/* Axis line */}
      <line x1="25" y1="310" x2={25 + waveWidth} y2="310" stroke="#4b5563" strokeWidth="0.5" strokeDasharray="3,3" />

      {/* ---- Flute section ---- */}
      <text x="445" y="62" textAnchor="middle" className="fill-sky-400" fontSize="12" fontWeight="600">
        Flute
      </text>

      {fluteHarmonics.map((h, i) => {
        const y = 90 + i * 28;
        const alpha = 0.3 + h.amp * 0.5;
        return (
          <g key={`fh${i}`}>
            <text x="320" y={y + 4} className="fill-gray-500" fontSize="10">
              {h.n === 1 ? 'Fund.' : `${h.n}x`}
            </text>
            <rect
              x="350"
              y={y - 5}
              width={h.amp * 100}
              height="10"
              rx="3"
              fill="#38bdf8"
              opacity={alpha}
            />
            <text x={358 + h.amp * 100} y={y + 4} className="fill-gray-500" fontSize="9">
              {(h.amp * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}

      {/* Almost pure - note */}
      <text x="445" y="170" textAnchor="middle" className="fill-gray-500 mh-note-pulse" fontSize="10">
        Nearly pure sine wave
      </text>

      {/* Combined flute waveform */}
      <text x="445" y="270" textAnchor="middle" className="fill-sky-300" fontSize="11" fontWeight="600">
        Combined waveform
      </text>
      <g className="mh-wave-flute">
        <path
          d={makeWavePath(fluteHarmonics, 325, 310, waveWidth, baseAmp)}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
        />
      </g>
      <line x1="325" y1="310" x2={325 + waveWidth} y2="310" stroke="#4b5563" strokeWidth="0.5" strokeDasharray="3,3" />

      {/* Divider */}
      <line x1="295" y1="50" x2="295" y2="360" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

      {/* Bottom labels */}
      <text x="145" y="355" textAnchor="middle" className="fill-amber-500" fontSize="10">
        Rich, complex shape = warm, rich timbre
      </text>
      <text x="445" y="355" textAnchor="middle" className="fill-sky-500" fontSize="10">
        Simple, smooth shape = pure, clear timbre
      </text>

      {/* Musical note icon */}
      <text x="300" y="375" textAnchor="middle" className="fill-gray-600 mh-note-pulse" fontSize="12">
        Both playing middle C (262 Hz)
      </text>
    </svg>
  );
}
