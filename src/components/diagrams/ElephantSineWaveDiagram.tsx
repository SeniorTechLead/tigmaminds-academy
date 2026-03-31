export default function ElephantSineWaveDiagram() {
  const pathStr = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // --- TOP section: 4-cycle sine wave ---
  const mainWave = Array.from({ length: 300 }, (_, i) => {
    const t = i / 300;
    const y = Math.sin(2 * Math.PI * 4 * t); // 4 complete cycles
    return { x: 60 + i * 1.6, y: 340 - y * 30 };
  });

  // --- BOTTOM section: comparison waves ---
  const slow20Hz = Array.from({ length: 120 }, (_, i) => {
    const t = i / 120;
    const y = Math.sin(2 * Math.PI * 2 * t); // 2 cycles
    return { x: 30 + i * 1.8, y: 540 - y * 20 };
  });

  const fast80Hz = Array.from({ length: 120 }, (_, i) => {
    const t = i / 120;
    const y = Math.sin(2 * Math.PI * 8 * t); // 8 cycles
    return { x: 310 + i * 1.8, y: 540 - y * 20 };
  });

  // Vibration ripple arcs radiating from elephant foot
  const ripples = [30, 55, 80, 105, 130].map((r) => {
    const cx = 110;
    const cy = 140;
    return `M${cx - r},${cy} A${r},${r * 0.5} 0 0,1 ${cx + r},${cy}`;
  });

  return (
    <svg
      viewBox="0 0 675 651"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Elephant sine wave diagram showing vibrations through ground, a sine wave with labels, and frequency comparison"
    >
      {/* Dark background */}
      <rect width="560" height="620" rx="8" className="fill-white dark:fill-slate-900" />

      {/* ============================================ */}
      {/* TOP: Cross-section — elephant, soil, girl    */}
      {/* ============================================ */}

      <text x="280" y="24" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="700">
        How elephant vibrations travel through the ground
      </text>

      {/* Ground line */}
      <line x1="20" y1="140" x2="540" y2="140" className="stroke-amber-800" strokeWidth="2" />
      <text x="540" y="155" textAnchor="end" className="fill-amber-700" fontSize="9">ground surface</text>

      {/* Soil fill below ground */}
      <rect x="20" y="140" width="520" height="60" fill="#78350f" opacity="0.2" />

      {/* Elephant silhouette (simple) — left side */}
      {/* Body */}
      <ellipse cx="90" cy="100" rx="40" ry="28" className="fill-gray-500 dark:fill-gray-400" />
      {/* Head */}
      <ellipse cx="55" cy="88" rx="20" ry="18" className="fill-gray-500 dark:fill-gray-400" />
      {/* Trunk */}
      <path d="M38,95 Q25,110 30,125" fill="none" className="stroke-gray-400" strokeWidth="4" strokeLinecap="round" />
      {/* Ear */}
      <ellipse cx="62" cy="82" rx="10" ry="14" className="fill-gray-500" />
      {/* Front legs */}
      <rect x="68" y="120" width="8" height="20" rx="3" className="fill-gray-500 dark:fill-gray-400" />
      <rect x="82" y="120" width="8" height="20" rx="3" className="fill-gray-500 dark:fill-gray-400" />
      {/* Back legs */}
      <rect x="104" y="120" width="8" height="20" rx="3" className="fill-gray-500 dark:fill-gray-400" />
      <rect x="118" y="120" width="8" height="20" rx="3" className="fill-gray-500 dark:fill-gray-400" />
      {/* Eye */}
      <circle cx="48" cy="84" r="2" className="fill-white dark:fill-slate-900" />

      {/* Foot pressing ground — impact lines */}
      <line x1="72" y1="138" x2="72" y2="145" className="stroke-emerald-400" strokeWidth="1.5" />
      <line x1="86" y1="138" x2="86" y2="145" className="stroke-emerald-400" strokeWidth="1.5" />

      {/* Vibration ripples through soil */}
      {ripples.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="1.2"
          opacity={1 - i * 0.17}
          strokeDasharray={i > 2 ? '4,3' : 'none'}
        />
      ))}

      {/* Girl (Rongpharpi) silhouette — lying on ground, ear pressed down, right side */}
      {/* Body lying horizontal */}
      <ellipse cx="420" cy="132" rx="28" ry="7" className="fill-gray-500 dark:fill-gray-400" />
      {/* Head — ear on ground */}
      <circle cx="450" cy="132" r="9" className="fill-gray-500 dark:fill-gray-400" />
      {/* Hair */}
      <path d="M453,124 Q462,118 458,128" className="fill-gray-500" />
      {/* Legs */}
      <line x1="392" y1="132" x2="380" y2="140" className="stroke-gray-400" strokeWidth="4" strokeLinecap="round" />
      <line x1="395" y1="135" x2="383" y2="143" className="stroke-gray-400" strokeWidth="4" strokeLinecap="round" />
      {/* Arm propping */}
      <line x1="435" y1="128" x2="430" y2="118" className="stroke-gray-400" strokeWidth="3" strokeLinecap="round" />

      {/* Label for girl */}
      <text x="420" y="112" textAnchor="middle" className="fill-amber-400" fontSize="9" fontWeight="600">
        Rongpharpi
      </text>

      {/* Distance arrow */}
      <line x1="130" y1="175" x2="390" y2="175" className="stroke-amber-500" strokeWidth="1" markerStart="url(#arrowLeft)" markerEnd="url(#arrowRight)" />
      <text x="260" y="188" textAnchor="middle" className="fill-amber-400" fontSize="9" fontWeight="600">
        ~ 50 metres
      </text>

      {/* Vibration note */}
      <text x="260" y="210" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
        Vibrations travel through soil as seismic waves
      </text>

      {/* ============================================ */}
      {/* MIDDLE: Annotated sine wave                  */}
      {/* ============================================ */}

      {/* Separator */}
      <line x1="40" y1="228" x2="520" y2="228" className="stroke-slate-700" strokeWidth="1" />

      <text x="280" y="250" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="700">
        What that vibration looks like as a wave
      </text>

      {/* Y-axis */}
      <line x1="60" y1="275" x2="60" y2="405" className="stroke-gray-500" strokeWidth="1" />
      <text x="28" y="342" textAnchor="middle" className="fill-amber-400" fontSize="8" fontWeight="600" transform="rotate(-90,28,342)">
        Ground movement
      </text>

      {/* X-axis */}
      <line x1="60" y1="340" x2="545" y2="340" className="stroke-gray-500" strokeWidth="1" />
      <text x="545" y="355" textAnchor="end" className="fill-amber-400" fontSize="9" fontWeight="600">
        Time →
      </text>

      {/* Tick marks on x-axis */}
      {[0, 1, 2, 3, 4].map((n) => {
        const tx = 60 + n * (480 / 4);
        return (
          <g key={n}>
            <line x1={tx} y1={340} x2={tx} y2={346} className="stroke-gray-500" strokeWidth="1" />
          </g>
        );
      })}

      {/* Zero line dashed */}
      <line x1="60" y1="340" x2="540" y2="340" className="stroke-gray-600" strokeWidth="0.5" strokeDasharray="4,4" />

      {/* Sine wave — 4 cycles */}
      <path d={pathStr(mainWave)} fill="none" className="stroke-emerald-400" strokeWidth="2.5" />

      {/* === Annotation: 1 cycle bracket === */}
      {(() => {
        const cycleStart = 60;
        const cycleEnd = 60 + 480 / 4; // one cycle width
        const bracketY = 400;
        return (
          <g>
            <line x1={cycleStart} y1={bracketY} x2={cycleEnd} y2={bracketY} className="stroke-amber-500" strokeWidth="1.5" />
            <line x1={cycleStart} y1={bracketY - 5} x2={cycleStart} y2={bracketY + 5} className="stroke-amber-500" strokeWidth="1.5" />
            <line x1={cycleEnd} y1={bracketY - 5} x2={cycleEnd} y2={bracketY + 5} className="stroke-amber-500" strokeWidth="1.5" />
            <text x={(cycleStart + cycleEnd) / 2} y={bracketY + 14} textAnchor="middle" className="fill-amber-400" fontSize="9" fontWeight="600">
              1 cycle
            </text>
          </g>
        );
      })()}

      {/* === Annotation: Amplitude arrow === */}
      {(() => {
        // Peak of first half-cycle ~x=90
        const ax = 90;
        const peakY = 340 - 30; // amplitude top
        const troughY = 340 + 30; // amplitude bottom
        return (
          <g>
            <line x1={ax} y1={peakY} x2={ax} y2={troughY} className="stroke-amber-500" strokeWidth="1.5" markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
            <text x={ax + 8} y={peakY - 4} className="fill-amber-400" fontSize="8" fontWeight="600">
              Amplitude
            </text>
            <text x={ax + 8} y={peakY + 8} className="fill-amber-400" fontSize="7">
              (how strong)
            </text>
          </g>
        );
      })()}

      {/* Frequency label */}
      <text x="400" y="285" textAnchor="middle" className="fill-emerald-400" fontSize="11" fontWeight="700">
        80 Hz = 80 cycles per second
      </text>

      {/* ============================================ */}
      {/* BOTTOM: Frequency comparison                 */}
      {/* ============================================ */}

      {/* Separator */}
      <line x1="40" y1="440" x2="520" y2="440" className="stroke-slate-700" strokeWidth="1" />

      <text x="280" y="462" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="700">
        Low frequency vs. high frequency
      </text>

      {/* --- Left: 20 Hz (slow, 2 cycles) --- */}
      {/* Axis */}
      <line x1="30" y1="540" x2="246" y2="540" className="stroke-gray-600" strokeWidth="0.5" strokeDasharray="3,3" />
      {/* Wave */}
      <path d={pathStr(slow20Hz)} fill="none" className="stroke-emerald-400" strokeWidth="2" />
      {/* Label */}
      <text x="138" y="490" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="700">
        20 Hz
      </text>
      <text x="138" y="502" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
        you can feel each pulse
      </text>

      {/* Divider */}
      <line x1="275" y1="475" x2="275" y2="580" className="stroke-slate-700" strokeWidth="1" strokeDasharray="3,4" />

      {/* --- Right: 80 Hz (fast, 8 cycles) --- */}
      {/* Axis */}
      <line x1="310" y1="540" x2="526" y2="540" className="stroke-gray-600" strokeWidth="0.5" strokeDasharray="3,3" />
      {/* Wave */}
      <path d={pathStr(fast80Hz)} fill="none" className="stroke-emerald-400" strokeWidth="2" />
      {/* Label */}
      <text x="418" y="490" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="700">
        80 Hz
      </text>
      <text x="418" y="502" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
        feels like a continuous hum
      </text>

      {/* Bottom summary */}
      <text x="280" y="600" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
        Same time window — higher frequency packs more cycles in
      </text>

      {/* ============================================ */}
      {/* Defs: arrow markers                          */}
      {/* ============================================ */}
      <defs>
        <marker id="arrowDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,0 L5,10 Z" className="fill-amber-500" />
        </marker>
        <marker id="arrowUp" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,10 L10,10 L5,0 Z" className="fill-amber-500" />
        </marker>
        <marker id="arrowRight" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" className="fill-amber-500" />
        </marker>
        <marker id="arrowLeft" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M10,0 L0,5 L10,10 Z" className="fill-amber-500" />
        </marker>
      </defs>
    </svg>
  );
}
