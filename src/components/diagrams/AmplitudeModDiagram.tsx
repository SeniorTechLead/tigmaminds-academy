export default function AmplitudeModDiagram() {
  const N = 300;

  const generate = (freq: number, pulseRate: number) =>
    Array.from({ length: N }, (_, i) => {
      const t = i / N * 3;
      const rumble = Math.sin(2 * Math.PI * freq * t);
      const pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * pulseRate * t);
      return { rumble, pulse, combined: rumble * pulse, t };
    });

  const calm = generate(12, 0.5); // visual frequencies (not real Hz — scaled to fit SVG)

  const toPath = (data: { t: number; y: number }[], yCenter: number, yScale: number) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${(40 + d.t / 3 * 520).toFixed(1)},${(yCenter - d.y * yScale).toFixed(1)}`).join(' ');

  const rumblePath = toPath(calm.map(d => ({ t: d.t, y: d.rumble })), 55, 28);
  const pulsePath = toPath(calm.map(d => ({ t: d.t, y: d.pulse - 0.5 })), 130, 28);
  const combinedPath = toPath(calm.map(d => ({ t: d.t, y: d.combined })), 210, 28);

  // Envelope (upper and lower bounds)
  const envelopeUpper = toPath(calm.map(d => ({ t: d.t, y: d.pulse })), 210, 28);
  const envelopeLower = toPath(calm.map(d => ({ t: d.t, y: -d.pulse })), 210, 28);

  return (
    <svg viewBox="0 0 600 280" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Three waves: rumble, pulse envelope, and combined amplitude-modulated signal">

      {/* Row 1: Rumble */}
      <line x1="40" y1="55" x2="560" y2="55" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="3,3" />
      <text x="30" y="30" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontWeight="600">Rumble (fast)</text>
      <path d={rumblePath} fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

      {/* Row 2: Pulse */}
      <line x1="40" y1="130" x2="560" y2="130" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="3,3" />
      <text x="30" y="105" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">Pulse (slow)</text>
      <path d={pulsePath} fill="none" className="stroke-amber-500" strokeWidth="2" />

      {/* Multiply sign */}
      <text x="300" y="168" textAnchor="middle" className="fill-gray-400" fontSize="18" fontWeight="bold">×</text>

      {/* Row 3: Combined */}
      <line x1="40" y1="210" x2="560" y2="210" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.5" strokeDasharray="3,3" />
      <text x="30" y="185" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">Combined</text>

      {/* Envelope (dashed) */}
      <path d={envelopeUpper} fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
      <path d={envelopeLower} fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />

      {/* Combined signal */}
      <path d={combinedPath} fill="none" className="stroke-emerald-500" strokeWidth="2" />

      {/* Annotations */}
      <text x="565" y="58" className="fill-gray-400" fontSize="9">constant</text>
      <text x="565" y="133" className="fill-amber-500" fontSize="9">0.5 Hz</text>
      <text x="565" y="213" className="fill-emerald-500" fontSize="9">breathes</text>

      {/* Bottom label */}
      <text x="300" y="260" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">
        The pulse wave controls the volume of the rumble — the signal "breathes"
      </text>
      <text x="300" y="275" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        Slow pulse = calm | Fast pulse = nervous | Frantic = danger
      </text>
    </svg>
  );
}
