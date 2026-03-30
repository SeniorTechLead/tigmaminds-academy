export default function FireflyPWMDiagram() {
  const w = 520, h = 360;

  // Square wave path generator
  const squareWave = (startX: number, y: number, width: number, dutyPercent: number, periods: number) => {
    const periodW = width / periods;
    const onW = periodW * (dutyPercent / 100);
    const offW = periodW - onW;
    const amp = 30;
    let d = `M${startX},${y + amp}`;
    for (let i = 0; i < periods; i++) {
      const px = startX + i * periodW;
      d += ` L${px},${y} L${px + onW},${y} L${px + onW},${y + amp} L${px + periodW},${y + amp}`;
    }
    return d;
  };

  const duties = [25, 50, 75];
  const labels = ['25% Duty', '50% Duty', '75% Duty'];
  const brightness = ['Dim', 'Medium', 'Bright'];
  const ledOpacity = [0.25, 0.55, 0.9];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label="PWM duty cycles at 25%, 50%, and 75% controlling LED brightness">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">PWM: Pulse Width Modulation</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Rapid on/off looks like smooth dimming to your eyes</text>

        {duties.map((duty, i) => {
          const yBase = 75 + i * 95;
          return (
            <g key={duty}>
              {/* Label */}
              <text x="20" y={yBase + 15} fill="#f59e0b" fontSize="11" fontWeight="600">{labels[i]}</text>

              {/* Square wave */}
              <path d={squareWave(100, yBase, 260, duty, 5)} fill="none" stroke="#4ade80" strokeWidth="2" />

              {/* ON/OFF axis labels */}
              <text x="92" y={yBase + 4} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">ON</text>
              <text x="92" y={yBase + 34} textAnchor="end" className="fill-gray-500 dark:fill-slate-400" fontSize="8">OFF</text>

              {/* Shaded ON area */}
              {Array.from({ length: 5 }).map((_, p) => {
                const periodW = 260 / 5;
                const onW = periodW * (duty / 100);
                const px = 100 + p * periodW;
                return (
                  <rect key={p} x={px} y={yBase} width={onW} height={30} fill="#4ade80" opacity={0.1} />
                );
              })}

              {/* LED glow indicator */}
              <circle cx="410" cy={yBase + 15} r="18" fill="#4ade80" opacity={ledOpacity[i] * 0.15} />
              <circle cx="410" cy={yBase + 15} r="12" fill="#4ade80" opacity={ledOpacity[i] * 0.3} />
              <circle cx="410" cy={yBase + 15} r="6" fill="#4ade80" opacity={ledOpacity[i]} />

              {/* Brightness label */}
              <text x="440" y={yBase + 12} fill="#4ade80" fontSize="10" fontWeight="600">{brightness[i]}</text>
              <text x="440" y={yBase + 25} className="fill-gray-500 dark:fill-slate-400" fontSize="9">{duty}% on-time</text>

              {/* Divider line */}
              {i < 2 && <line x1="20" y1={yBase + 60} x2={w - 20} y2={yBase + 60} stroke="#334155" strokeWidth="0.5" />}
            </g>
          );
        })}

        {/* Bottom note */}
        <rect x="60" y="310" width="400" height="35" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x={w / 2} y="328" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Arduino runs PWM at ~490 Hz — too fast for your eyes to see the flicker</text>
        <text x={w / 2} y="340" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">analogWrite(pin, 0) = off | analogWrite(pin, 127) = 50% | analogWrite(pin, 255) = full</text>
      </svg>
    </div>
  );
}
