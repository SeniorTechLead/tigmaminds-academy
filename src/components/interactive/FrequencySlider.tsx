import { useState, useMemo } from "react";

const CONTEXT_LABELS = [
  { hz: 20, label: "20 Hz = elephant rumble" },
  { hz: 262, label: "262 Hz = middle C" },
  { hz: 440, label: "440 Hz = concert A" },
];

const SVG_WIDTH = 600;
const SVG_HEIGHT = 200;
const NUM_POINTS = 200;
const CENTER_Y = SVG_HEIGHT / 2;

function buildWavePath(frequency: number, amplitude: number): string {
  const points: string[] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = (i / NUM_POINTS) * SVG_WIDTH;
    const y =
      CENTER_Y -
      amplitude * (CENTER_Y - 10) * Math.sin((2 * Math.PI * frequency * x) / SVG_WIDTH);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

export default function FrequencySlider() {
  const [frequency, setFrequency] = useState(80);
  const [amplitude, setAmplitude] = useState(0.7);

  const wavePath = useMemo(
    () => buildWavePath(frequency, amplitude),
    [frequency, amplitude]
  );

  return (
    <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800 sm:p-6">
      {/* SVG wave */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full rounded-lg bg-white dark:bg-gray-900"
        style={{ minHeight: 120 }}
        preserveAspectRatio="none"
      >
        {/* center line */}
        <line
          x1="0"
          y1={CENTER_Y}
          x2={SVG_WIDTH}
          y2={CENTER_Y}
          className="stroke-gray-300 dark:stroke-gray-700"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* wave */}
        <path
          d={wavePath}
          fill="none"
          className="stroke-emerald-500 dark:stroke-emerald-400"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Sliders */}
      <div className="mt-4 space-y-4">
        {/* Frequency slider */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <label htmlFor="freq-slider">Frequency (Hz)</label>
            <span className="tabular-nums">{frequency} Hz</span>
          </div>
          <div className="min-h-[44px] flex items-center">
            <input
              id="freq-slider"
              type="range"
              min={1}
              max={500}
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
            />
          </div>
        </div>

        {/* Amplitude slider */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <label htmlFor="amp-slider">Amplitude</label>
            <span className="tabular-nums">{amplitude.toFixed(2)}</span>
          </div>
          <div className="min-h-[44px] flex items-center">
            <input
              id="amp-slider"
              type="range"
              min={10}
              max={100}
              value={Math.round(amplitude * 100)}
              onChange={(e) => setAmplitude(Number(e.target.value) / 100)}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300 accent-emerald-500 dark:bg-gray-700 dark:accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Context labels */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        {CONTEXT_LABELS.map(({ hz, label }) => (
          <span key={hz}>{label}</span>
        ))}
      </div>
    </div>
  );
}
