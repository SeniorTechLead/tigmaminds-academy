export default function RhythmBeatDiagram() {
  /* 4/4 time: beats 1 and 3 strong, 2 and 4 weak */
  const fourFour = [
    { beat: 1, strong: true },
    { beat: 2, strong: false },
    { beat: 3, strong: true },
    { beat: 4, strong: false },
  ];

  /* 3/4 time: beat 1 strong, beats 2 and 3 weak */
  const threeQuarter = [
    { beat: 1, strong: true },
    { beat: 2, strong: false },
    { beat: 3, strong: false },
  ];

  const beatSpacing = 60;

  return (
    <svg
      viewBox="0 0 580 340"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Animated rhythm diagram showing 4/4 and 3/4 time signatures with strong and weak beats pulsing at 100 BPM"
    >
      <style>{`
        @keyframes rbPulseStrong {
          0%, 100% { r: 14; opacity: 0.7; }
          15% { r: 20; opacity: 1; }
          30% { r: 14; opacity: 0.7; }
        }
        @keyframes rbPulseWeak {
          0%, 100% { r: 8; opacity: 0.5; }
          15% { r: 11; opacity: 0.8; }
          30% { r: 8; opacity: 0.5; }
        }
        @keyframes rbRipple {
          0% { r: 14; opacity: 0.5; }
          100% { r: 30; opacity: 0; }
        }
        .rb-s1 { animation: rbPulseStrong 2.4s ease-out infinite; }
        .rb-s2 { animation: rbPulseStrong 2.4s ease-out infinite 0.6s; }
        .rb-s3 { animation: rbPulseStrong 2.4s ease-out infinite 1.2s; }
        .rb-s4 { animation: rbPulseStrong 2.4s ease-out infinite 1.8s; }
        .rb-w1 { animation: rbPulseWeak 2.4s ease-out infinite; }
        .rb-w2 { animation: rbPulseWeak 2.4s ease-out infinite 0.6s; }
        .rb-w3 { animation: rbPulseWeak 2.4s ease-out infinite 1.2s; }
        .rb-w4 { animation: rbPulseWeak 2.4s ease-out infinite 1.8s; }
        .rb-ripple1 { animation: rbRipple 2.4s ease-out infinite; }
        .rb-ripple2 { animation: rbRipple 2.4s ease-out infinite 0.6s; }
        .rb-ripple3 { animation: rbRipple 2.4s ease-out infinite 1.2s; }
        .rb-ripple4 { animation: rbRipple 2.4s ease-out infinite 1.8s; }
        /* 3/4 uses 1.8s period (3 beats) */
        .rb-3s1 { animation: rbPulseStrong 1.8s ease-out infinite; }
        .rb-3s2 { animation: rbPulseStrong 1.8s ease-out infinite 0.6s; }
        .rb-3s3 { animation: rbPulseStrong 1.8s ease-out infinite 1.2s; }
        .rb-3w1 { animation: rbPulseWeak 1.8s ease-out infinite; }
        .rb-3w2 { animation: rbPulseWeak 1.8s ease-out infinite 0.6s; }
        .rb-3w3 { animation: rbPulseWeak 1.8s ease-out infinite 1.2s; }
        .rb-3r1 { animation: rbRipple 1.8s ease-out infinite; }
        .rb-3r2 { animation: rbRipple 1.8s ease-out infinite 0.6s; }
        .rb-3r3 { animation: rbRipple 1.8s ease-out infinite 1.2s; }
        @keyframes rbSweep {
          0% { transform: translateX(0); }
          100% { transform: translateX(240px); }
        }
        .rb-sweep44 {
          animation: rbSweep 2.4s linear infinite;
        }
        @keyframes rbSweep3 {
          0% { transform: translateX(0); }
          100% { transform: translateX(180px); }
        }
        .rb-sweep34 {
          animation: rbSweep3 1.8s linear infinite;
        }
      `}</style>

      {/* Background */}
      <rect width="580" height="340" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="290" y="24" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="14" fontWeight="700">
        Rhythm and Time Signatures
      </text>
      <text x="290" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        Strong beats (large) vs weak beats (small) pulsing at ~100 BPM
      </text>

      {/* ---- 4/4 TIME ---- */}
      <text x="155" y="70" textAnchor="middle" className="fill-emerald-400" fontSize="13" fontWeight="700">
        4/4 Time
      </text>
      <text x="155" y="86" textAnchor="middle" className="fill-gray-500" fontSize="10">
        March, rock, pop, Bihu
      </text>

      {/* Timeline */}
      <line x1="40" y1="130" x2="280" y2="130" stroke="#4b5563" strokeWidth="1" />

      {/* Sweep indicator */}
      <g className="rb-sweep44">
        <line x1="40" y1="110" x2="40" y2="150" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* Beats */}
      {fourFour.map((b, i) => {
        const cx = 40 + i * beatSpacing;
        const rippleClass = `rb-ripple${i + 1}`;
        const pulseClass = b.strong ? `rb-s${i + 1}` : `rb-w${i + 1}`;
        return (
          <g key={`44-${i}`}>
            {/* Ripple on strong beats */}
            {b.strong && (
              <circle cx={cx} cy={130} className={rippleClass} fill="none" stroke="#34d399" strokeWidth="1" />
            )}
            {/* Beat circle */}
            <circle cx={cx} cy={130} className={pulseClass} fill={b.strong ? '#34d399' : '#6b7280'} />
            {/* Beat number */}
            <text x={cx} y={165} textAnchor="middle" fontSize="11" fill={b.strong ? '#34d399' : '#6b7280'} fontWeight={b.strong ? '700' : '400'}>
              {b.beat}
            </text>
            {/* Label */}
            <text x={cx} y={178} textAnchor="middle" fontSize="9" className="fill-gray-600">
              {b.strong ? 'STRONG' : 'weak'}
            </text>
          </g>
        );
      })}

      {/* Pattern label */}
      <text x="155" y="198" textAnchor="middle" className="fill-gray-500" fontSize="10">
        ONE two THREE four | ONE two THREE four ...
      </text>

      {/* Measure bar */}
      <line x1="280" y1="115" x2="280" y2="145" stroke="#6b7280" strokeWidth="2" />
      <text x="295" y="134" className="fill-gray-600" fontSize="9">bar</text>

      {/* ---- 3/4 TIME ---- */}
      <text x="445" y="70" textAnchor="middle" className="fill-violet-400" fontSize="13" fontWeight="700">
        3/4 Time
      </text>
      <text x="445" y="86" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Waltz, many folk dances
      </text>

      {/* Timeline */}
      <line x1="350" y1="130" x2="530" y2="130" stroke="#4b5563" strokeWidth="1" />

      {/* Sweep indicator */}
      <g className="rb-sweep34">
        <line x1="350" y1="110" x2="350" y2="150" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* Beats */}
      {threeQuarter.map((b, i) => {
        const cx = 350 + i * beatSpacing;
        const rippleClass = `rb-3r${i + 1}`;
        const pulseClass = b.strong ? `rb-3s${i + 1}` : `rb-3w${i + 1}`;
        return (
          <g key={`34-${i}`}>
            {b.strong && (
              <circle cx={cx} cy={130} className={rippleClass} fill="none" stroke="#a78bfa" strokeWidth="1" />
            )}
            <circle cx={cx} cy={130} className={pulseClass} fill={b.strong ? '#a78bfa' : '#6b7280'} />
            <text x={cx} y={165} textAnchor="middle" fontSize="11" fill={b.strong ? '#a78bfa' : '#6b7280'} fontWeight={b.strong ? '700' : '400'}>
              {b.beat}
            </text>
            <text x={cx} y={178} textAnchor="middle" fontSize="9" className="fill-gray-600">
              {b.strong ? 'STRONG' : 'weak'}
            </text>
          </g>
        );
      })}

      <text x="445" y="198" textAnchor="middle" className="fill-gray-500" fontSize="10">
        ONE two three | ONE two three ...
      </text>

      {/* Measure bar */}
      <line x1="530" y1="115" x2="530" y2="145" stroke="#6b7280" strokeWidth="2" />
      <text x="545" y="134" className="fill-gray-600" fontSize="9">bar</text>

      {/* Comparison section */}
      <line x1="30" y1="220" x2="550" y2="220" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

      <text x="290" y="245" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="12" fontWeight="600">
        Feel the Difference
      </text>

      {/* 4/4 grid visual */}
      <g>
        <text x="100" y="270" textAnchor="middle" className="fill-emerald-400" fontSize="11" fontWeight="600">4/4</text>
        {[0, 1, 2, 3].map(i => (
          <rect key={`g44-${i}`} x={40 + i * 50} y="278" width="44" height="20" rx="4"
            fill={i % 2 === 0 ? '#065f46' : '#1f2937'} stroke={i % 2 === 0 ? '#34d399' : '#4b5563'} strokeWidth="1" />
        ))}
        <text x="100" y="312" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Even, marching feel
        </text>
      </g>

      {/* 3/4 grid visual */}
      <g>
        <text x="410" y="270" textAnchor="middle" className="fill-violet-400" fontSize="11" fontWeight="600">3/4</text>
        {[0, 1, 2].map(i => (
          <rect key={`g34-${i}`} x={350 + i * 50} y="278" width="44" height="20" rx="4"
            fill={i === 0 ? '#4c1d95' : '#1f2937'} stroke={i === 0 ? '#a78bfa' : '#4b5563'} strokeWidth="1" />
        ))}
        <text x="410" y="312" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Swaying, dance-like feel
        </text>
      </g>
    </svg>
  );
}
