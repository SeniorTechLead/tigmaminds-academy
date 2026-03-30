export default function ElephantSpectrogramDiagram() {
  // ── Waveform data (amplitude vs time) ──
  const N = 200;
  const wavePoints = Array.from({ length: N }, (_, i) => {
    const t = i / N;
    // Elephant rumble-like waveform with amplitude variation
    const envelope = 0.5 + 0.4 * Math.sin(2 * Math.PI * 1.5 * t);
    const signal =
      Math.sin(2 * Math.PI * 8 * t) * 0.7 +
      Math.sin(2 * Math.PI * 20 * t) * 0.3;
    return { t, y: signal * envelope };
  });

  // Layout constants
  const panelX = 100;
  const panelW = 380;

  // Top panel: waveform
  const waveY = 70;
  const waveH = 80;
  const waveMid = waveY + waveH / 2;

  // Bottom panel: spectrogram
  const specY = 200;
  const specH = 80;

  const wavePath = wavePoints
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${(panelX + p.t * panelW).toFixed(1)},${(waveMid - p.y * (waveH / 2 - 4)).toFixed(1)}`
    )
    .join(' ');

  // ── Spectrogram heatmap data ──
  // Rows = frequency bands (bottom = low, top = high)
  // Columns = time bins
  const cols = 38;
  const freqBands = 8;
  const cellW = panelW / cols;
  const cellH = specH / freqBands;

  // Frequency band labels (Hz) — bottom to top
  const bandLabels = ['20', '40', '60', '80', '100', '120', '160', '200'];

  // Generate spectrogram intensities
  // Band index 3 (≈80 Hz) is the brightest — elephant infrasound
  const spectroData = Array.from({ length: freqBands }, (_, band) =>
    Array.from({ length: cols }, (_, col) => {
      const t = col / cols;
      // Strong energy at band 3 (80 Hz), some at 2 and 4
      const dist = Math.abs(band - 3);
      let base = Math.max(0, 1 - dist * 0.35);
      // Add time variation matching the waveform envelope
      const envelope = 0.5 + 0.4 * Math.sin(2 * Math.PI * 1.5 * t);
      base *= envelope;
      // Add a touch of noise
      base += (Math.sin(col * 7 + band * 13) * 0.08);
      return Math.max(0, Math.min(1, base));
    })
  );

  // Inferno-like color mapping: dark → orange → yellow
  const infernoColor = (v: number) => {
    if (v < 0.2) return `rgb(${Math.round(v * 5 * 40)}, ${Math.round(v * 5 * 10)}, ${Math.round(v * 5 * 60)})`;
    if (v < 0.5) {
      const t = (v - 0.2) / 0.3;
      return `rgb(${Math.round(40 + t * 180)}, ${Math.round(10 + t * 40)}, ${Math.round(60 - t * 30)})`;
    }
    if (v < 0.8) {
      const t = (v - 0.5) / 0.3;
      return `rgb(${Math.round(220 + t * 35)}, ${Math.round(50 + t * 120)}, ${Math.round(30 - t * 20)})`;
    }
    const t = (v - 0.8) / 0.2;
    return `rgb(${255}, ${Math.round(170 + t * 75)}, ${Math.round(10 + t * 90)})`;
  };

  return (
    <svg
      viewBox="0 0 630 406"
      className="w-full max-w-lg mx-auto my-4"
      role="img"
      aria-label="Comparison of waveform and spectrogram views of an elephant rumble, showing how the spectrogram reveals frequency structure"
    >
      {/* Dark background */}
      <rect width="600" height="380" rx="8" className="fill-slate-900" />

      {/* ══════════ TOP PANEL: WAVEFORM ══════════ */}
      <text x={panelX} y={waveY - 22} className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="700">
        Waveform
      </text>
      <text x={panelX + 68} y={waveY - 22} className="fill-gray-500 dark:fill-slate-400" fontSize="10">
        — shows VOLUME over time
      </text>

      {/* Waveform box */}
      <rect
        x={panelX}
        y={waveY}
        width={panelW}
        height={waveH}
        rx="4"
        className="fill-white dark:fill-slate-950"
        stroke="#334155"
        strokeWidth="0.5"
      />

      {/* Center line */}
      <line
        x1={panelX}
        y1={waveMid}
        x2={panelX + panelW}
        y2={waveMid}
        stroke="#334155"
        strokeWidth="0.5"
        strokeDasharray="3,3"
      />

      {/* Waveform path */}
      <path d={wavePath} fill="none" stroke="#22c55e" strokeWidth="1.5" />

      {/* Y-axis label */}
      <text
        x={panelX - 14}
        y={waveMid}
        textAnchor="middle"
        className="fill-gray-400 dark:fill-slate-500"
        fontSize="8"
        transform={`rotate(-90,${panelX - 14},${waveMid})`}
      >
        Amplitude
      </text>

      {/* Annotation arrow: "Can see: loud/quiet" */}
      <line
        x1={panelX + panelW + 10}
        y1={waveMid}
        x2={panelX + panelW + 4}
        y2={waveMid}
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <line
        x1={panelX + panelW + 10}
        y1={waveMid}
        x2={panelX + panelW + 50}
        y2={waveMid}
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <text x={panelX + panelW + 14} y={waveMid - 6} fill="#fbbf24" fontSize="9" fontWeight="600">
        Can see:
      </text>
      <text x={panelX + panelW + 14} y={waveMid + 6} fill="#fbbf24" fontSize="9" fontWeight="600">
        loud / quiet
      </text>

      {/* ══════════ BOTTOM PANEL: SPECTROGRAM ══════════ */}
      <text x={panelX} y={specY - 22} className="fill-gray-700 dark:fill-slate-200" fontSize="11" fontWeight="700">
        Spectrogram
      </text>
      <text x={panelX + 82} y={specY - 22} className="fill-gray-500 dark:fill-slate-400" fontSize="10">
        — shows FREQUENCY over time
      </text>

      {/* Spectrogram box */}
      <rect
        x={panelX}
        y={specY}
        width={panelW}
        height={specH}
        rx="4"
        className="fill-white dark:fill-slate-950"
        stroke="#334155"
        strokeWidth="0.5"
      />

      {/* Heatmap cells — bands drawn bottom-up (low freq at bottom) */}
      {spectroData.map((band, bandIdx) =>
        band.map((intensity, colIdx) => (
          <rect
            key={`${bandIdx}-${colIdx}`}
            x={panelX + colIdx * cellW}
            y={specY + specH - (bandIdx + 1) * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill={infernoColor(intensity)}
          />
        ))
      )}

      {/* Frequency axis labels */}
      {[0, 3, 7].map((i) => (
        <text
          key={i}
          x={panelX - 6}
          y={specY + specH - (i + 0.5) * cellH + 3}
          textAnchor="end"
          className="fill-gray-400 dark:fill-slate-500"
          fontSize="7"
        >
          {bandLabels[i]} Hz
        </text>
      ))}

      {/* Y-axis label */}
      <text
        x={panelX - 32}
        y={specY + specH / 2}
        textAnchor="middle"
        className="fill-gray-400 dark:fill-slate-500"
        fontSize="8"
        transform={`rotate(-90,${panelX - 32},${specY + specH / 2})`}
      >
        Frequency
      </text>

      {/* Bright band indicator — arrow pointing at 80 Hz band */}
      <line
        x1={panelX + panelW + 10}
        y1={specY + specH - 3.5 * cellH}
        x2={panelX + panelW + 4}
        y2={specY + specH - 3.5 * cellH}
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <line
        x1={panelX + panelW + 10}
        y1={specY + specH - 3.5 * cellH}
        x2={panelX + panelW + 50}
        y2={specY + specH - 3.5 * cellH}
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <text
        x={panelX + panelW + 14}
        y={specY + specH - 3.5 * cellH - 12}
        fill="#fbbf24"
        fontSize="9"
        fontWeight="600"
      >
        Can see: which
      </text>
      <text
        x={panelX + panelW + 14}
        y={specY + specH - 3.5 * cellH - 2}
        fill="#fbbf24"
        fontSize="9"
        fontWeight="600"
      >
        frequencies +
      </text>
      <text
        x={panelX + panelW + 14}
        y={specY + specH - 3.5 * cellH + 8}
        fill="#fbbf24"
        fontSize="9"
        fontWeight="600"
      >
        how they change
      </text>

      {/* Shared X-axis label */}
      <text x={panelX + panelW / 2} y={specY + specH + 18} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500" fontSize="9">
        Time (seconds)
      </text>

      {/* ── Elephant silhouette with 80 Hz label ── */}
      <g transform="translate(16, 210)">
        {/* Simple elephant body */}
        <path
          d="M12,32 Q8,28 10,20 Q12,10 20,8 Q26,6 30,12 L32,10 Q34,8 34,12 L32,14 Q34,18 32,24 L32,34 L28,34 L28,28 L22,28 L22,34 L18,34 L18,26 Q14,30 12,32 Z"
          className="fill-gray-500 dark:fill-slate-400"
          opacity="0.7"
          transform="scale(1.4)"
        />
        <text x="22" y="56" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700">
          80 Hz
        </text>
      </g>

      {/* ── Bottom summary ── */}
      <text x="300" y="356" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        The spectrogram reveals structure the waveform hides
      </text>
    </svg>
  );
}
