'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function PWMBrightnessDiagram() {
  const [pwmValue, setPwmValue] = useState(127);
  const [breathing, setBreathing] = useState(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const stopBreathing = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  }, []);

  useEffect(() => {
    if (!breathing) {
      stopBreathing();
      return;
    }
    startRef.current = Date.now();
    const animate = () => {
      const t = (Date.now() - startRef.current) / 1000;
      const val = Math.round(127.5 + 127.5 * Math.sin(t * Math.PI));
      setPwmValue(val);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return stopBreathing;
  }, [breathing, stopBreathing]);

  const dutyCycle = Math.round((pwmValue / 255) * 100);
  const brightness = pwmValue / 255;

  // Generate PWM waveform points for SVG
  const waveWidth = 400;
  const waveHeight = 60;
  const periods = 8;
  const periodWidth = waveWidth / periods;
  const highWidth = periodWidth * (pwmValue / 255);

  let wavePath = '';
  for (let p = 0; p < periods; p++) {
    const x = p * periodWidth;
    if (pwmValue === 0) {
      wavePath += `M ${x} ${waveHeight} L ${x + periodWidth} ${waveHeight} `;
    } else if (pwmValue === 255) {
      wavePath += `M ${x} 5 L ${x + periodWidth} 5 `;
    } else {
      wavePath += `M ${x} ${waveHeight} L ${x} 5 L ${x + highWidth} 5 L ${x + highWidth} ${waveHeight} L ${x + periodWidth} ${waveHeight} `;
    }
  }

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-amber-400 mb-4">
        Analog Output with PWM
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: LED and controls */}
        <div className="flex flex-col items-center gap-4">
          {/* LED with variable brightness */}
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full border-4 transition-all duration-75"
              style={{
                borderColor: pwmValue > 0 ? `rgba(251,191,36,${0.3 + brightness * 0.7})` : '#374151',
                backgroundColor: `rgba(251,191,36,${brightness})`,
                boxShadow: pwmValue > 0
                  ? `0 0 ${20 + brightness * 40}px ${5 + brightness * 15}px rgba(251,191,36,${brightness * 0.6}), 0 0 ${40 + brightness * 80}px ${10 + brightness * 30}px rgba(251,191,36,${brightness * 0.3})`
                  : 'none',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: brightness > 0.5 ? '#000' : '#fff', opacity: 0.8 }}>
                {pwmValue}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Brightness: <span className="text-amber-400 font-bold">{dutyCycle}%</span>
          </p>

          {/* Slider */}
          <div className="w-full max-w-xs">
            <label className="text-xs text-gray-400 block mb-1 text-center">
              PWM Value: <span className="text-amber-400 font-bold">{pwmValue}</span> / 255
            </label>
            <input
              type="range"
              min={0}
              max={255}
              value={pwmValue}
              onChange={e => { setBreathing(false); setPwmValue(Number(e.target.value)); }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0 (off)</span>
              <span>127 (half)</span>
              <span>255 (full)</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[0, 64, 127, 191, 255].map(v => (
              <button
                key={v}
                onClick={() => { setBreathing(false); setPwmValue(v); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  pwmValue === v && !breathing
                    ? 'bg-amber-600 ring-2 ring-amber-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBreathing(b => !b)}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              breathing
                ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-400'
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {breathing ? 'Stop Breathing' : 'Breathing Mode'}
          </button>
        </div>

        {/* Right: PWM waveform */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-2 text-center">PWM Waveform — what the pin actually does:</p>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 w-full">
            <svg viewBox={`-10 -10 ${waveWidth + 20} ${waveHeight + 30}`} className="w-full h-auto">
              {/* Grid lines */}
              <line x1="0" y1="5" x2={waveWidth} y2="5" stroke="#374151" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1={waveHeight} x2={waveWidth} y2={waveHeight} stroke="#374151" strokeWidth="0.5" strokeDasharray="4 4" />
              {/* Labels */}
              <text x="-5" y="8" textAnchor="end" fill="#9ca3af" fontSize="8" fontFamily="monospace">HIGH</text>
              <text x="-5" y={waveHeight + 3} textAnchor="end" fill="#9ca3af" fontSize="8" fontFamily="monospace">LOW</text>
              {/* Waveform */}
              <path d={wavePath} fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Shaded duty cycle area */}
              {pwmValue > 0 && pwmValue < 255 && Array.from({ length: periods }).map((_, p) => (
                <rect
                  key={p}
                  x={p * periodWidth}
                  y={5}
                  width={highWidth}
                  height={waveHeight - 5}
                  fill="rgba(251,191,36,0.15)"
                />
              ))}
              {/* Duty cycle label */}
              <text x={waveWidth / 2} y={waveHeight + 18} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                Duty cycle: {dutyCycle}% ON
              </text>
            </svg>
          </div>

          {/* Visual explanation */}
          <div className="mt-3 bg-gray-800 rounded-lg p-3 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-amber-400 rounded-sm" />
              <span className="text-xs text-gray-300">= pin is HIGH (5V)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-700 rounded-sm border border-gray-600" />
              <span className="text-xs text-gray-300">= pin is LOW (0V)</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              At {dutyCycle}%, the pin is ON for {dutyCycle}% of each cycle and OFF for {100 - dutyCycle}%.
              {pwmValue < 128 ? ' Low brightness — mostly OFF.' : pwmValue > 200 ? ' High brightness — mostly ON.' : ' Medium brightness — about half and half.'}
            </p>
          </div>
        </div>
      </div>

      {/* Live code */}
      <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 text-sm">
        <p className="text-gray-500 mb-2">// Arduino Code:</p>
        <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
{breathing ? `// Breathing effect — smooth fade in and out
void loop() {
  for (int val = 0; val <= 255; val++) {
    analogWrite(9, val);   // fade up
    delay(5);
  }
  for (int val = 255; val >= 0; val--) {
    analogWrite(9, val);   // fade down
    delay(5);
  }
}` : `// Set LED brightness
analogWrite(9, ${pwmValue});  // brightness = ${pwmValue}/255 = ${dutyCycle}%`}
        </pre>
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-3 text-sm text-gray-300 leading-relaxed">
        <p className="text-amber-400 font-bold mb-1">Key idea:</p>
        <p><code className="text-green-400">analogWrite</code> does not output a real voltage between 0V and 5V. Instead it switches the pin on and off <span className="text-amber-400">very fast</span> (about 490 times per second). Writing <code className="text-green-400">analogWrite(9, {pwmValue})</code> means the pin is ON {dutyCycle}% of the time. Your eye sees this rapid blinking as a dimmer light. This technique is called <span className="text-amber-400 font-bold">PWM</span> — Pulse Width Modulation.</p>
      </div>
    </div>
  );
}
