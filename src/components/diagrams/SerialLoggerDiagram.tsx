'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Sensor = 'temperature' | 'light' | 'distance';

interface Reading {
  id: number;
  value: number;
  alert: boolean;
}

const SENSOR_CONFIG: Record<Sensor, { label: string; unit: string; min: number; max: number; defaultThreshold: number }> = {
  temperature: { label: 'Temperature', unit: '\u00B0C', min: 18, max: 40, defaultThreshold: 35 },
  light: { label: 'Light Level', unit: 'lux', min: 0, max: 1000, defaultThreshold: 800 },
  distance: { label: 'Distance', unit: 'cm', min: 2, max: 200, defaultThreshold: 30 },
};

export default function SerialLoggerDiagram() {
  const [sensor, setSensor] = useState<Sensor>('temperature');
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [threshold, setThreshold] = useState(SENSOR_CONFIG.temperature.defaultThreshold);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const config = SENSOR_CONFIG[sensor];

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const generateReading = useCallback((): number => {
    const c = SENSOR_CONFIG[sensor];
    const range = c.max - c.min;
    const base = c.min + range * 0.4;
    const noise = (Math.random() - 0.5) * range * 0.4;
    // Occasional spikes
    const spike = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) * range * 0.3 : 0;
    const val = base + noise + spike;
    return Math.round(Math.max(c.min, Math.min(c.max, val)) * 10) / 10;
  }, [sensor]);

  useEffect(() => {
    cleanup();
    if (!running) return;
    const tick = () => {
      counterRef.current++;
      const value = generateReading();
      const alert = sensor === 'distance'
        ? value < threshold
        : value > threshold;
      const reading: Reading = { id: counterRef.current, value, alert };
      setReadings(prev => [...prev.slice(-49), reading]);
    };
    tick();
    intervalRef.current = setInterval(tick, speed);
    return cleanup;
  }, [running, speed, sensor, threshold, generateReading, cleanup]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [readings]);

  const clearTerminal = () => {
    setReadings([]);
    counterRef.current = 0;
  };

  const switchSensor = (s: Sensor) => {
    setRunning(false);
    clearTerminal();
    setSensor(s);
    setThreshold(SENSOR_CONFIG[s].defaultThreshold);
  };

  // Chart data — last 20 readings
  const chartData = readings.slice(-20);
  const chartWidth = 380;
  const chartHeight = 120;
  const chartPadX = 30;
  const chartPadY = 10;
  const plotW = chartWidth - chartPadX * 2;
  const plotH = chartHeight - chartPadY * 2;

  const getY = (val: number) => {
    const ratio = (val - config.min) / (config.max - config.min);
    return chartPadY + plotH - ratio * plotH;
  };
  const thresholdY = getY(threshold);

  let linePath = '';
  let dots: { x: number; y: number; alert: boolean }[] = [];
  if (chartData.length > 0) {
    chartData.forEach((r, i) => {
      const x = chartPadX + (i / Math.max(chartData.length - 1, 1)) * plotW;
      const y = getY(r.value);
      dots.push({ x, y, alert: r.alert });
      if (i === 0) linePath += `M ${x} ${y}`;
      else linePath += ` L ${x} ${y}`;
    });
  }

  const lastReading = readings.length > 0 ? readings[readings.length - 1] : null;

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 text-gray-900 dark:text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-teal-400 mb-4">
        Talking to the Computer — Serial Monitor
      </h3>

      {/* Sensor selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {(Object.keys(SENSOR_CONFIG) as Sensor[]).map(s => (
          <button
            key={s}
            onClick={() => switchSensor(s)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              sensor === s ? 'bg-teal-600 ring-2 ring-teal-400 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            {SENSOR_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Serial monitor terminal */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-t-lg px-3 py-1.5 border-b border-gray-300 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Serial Monitor — 9600 baud</span>
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${running ? 'bg-green-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'}`} />
              <button onClick={clearTerminal} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Clear</button>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="bg-white dark:bg-black rounded-b-lg p-3 h-64 overflow-y-auto text-xs leading-relaxed border border-gray-200 dark:border-gray-800"
          >
            {readings.length === 0 && (
              <p className="text-gray-400 dark:text-gray-600">// Waiting for data...</p>
            )}
            {readings.map(r => (
              <div key={r.id} className={r.alert ? 'text-red-400' : 'text-green-400'}>
                {r.alert && <span className="text-red-500 font-bold">** ALERT ** </span>}
                Reading #{r.id}: {r.value}{config.unit}
                {r.alert && (
                  <span className="text-red-500"> [{sensor === 'distance' ? 'TOO CLOSE' : 'OVER THRESHOLD'}]</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live chart */}
        <div className="flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg px-3 py-1.5 border-b border-gray-300 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Live Chart (last 20 readings)</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-950 rounded-b-lg p-2 border border-gray-200 dark:border-gray-800 flex-1 flex items-center justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid */}
              <rect x={chartPadX} y={chartPadY} width={plotW} height={plotH} fill="none" stroke="#1f2937" strokeWidth="1" />
              {/* Y-axis labels */}
              <text x={chartPadX - 3} y={chartPadY + 4} textAnchor="end" fill="#6b7280" fontSize="7" fontFamily="monospace">
                {config.max}
              </text>
              <text x={chartPadX - 3} y={chartPadY + plotH + 3} textAnchor="end" fill="#6b7280" fontSize="7" fontFamily="monospace">
                {config.min}
              </text>
              {/* Threshold line */}
              <line
                x1={chartPadX}
                y1={thresholdY}
                x2={chartPadX + plotW}
                y2={thresholdY}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text x={chartPadX + plotW + 2} y={thresholdY + 3} fill="#ef4444" fontSize="7" fontFamily="monospace">
                {threshold}
              </text>
              {/* Data line */}
              {chartData.length > 1 && (
                <path d={linePath} fill="none" stroke="#2dd4bf" strokeWidth="2" />
              )}
              {/* Alert segments */}
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={3} fill={d.alert ? '#ef4444' : '#2dd4bf'} />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setRunning(r => !r)}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            running ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {running ? 'Stop' : 'Start Sensor'}
        </button>

        <div className="flex flex-col items-center">
          <label className="text-[10px] text-gray-500 dark:text-gray-500">Read speed: {speed}ms</label>
          <input
            type="range"
            min={200}
            max={3000}
            step={100}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-32 accent-teal-400 cursor-pointer"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-[10px] text-gray-500 dark:text-gray-500">
            Alert threshold: {threshold}{config.unit}
          </label>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={sensor === 'temperature' ? 0.5 : sensor === 'light' ? 10 : 5}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="w-32 accent-red-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Current reading display */}
      {lastReading && (
        <div className={`text-center mb-4 py-2 rounded-lg ${
          lastReading.alert ? 'bg-red-900/30 border border-red-700' : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
        }`}>
          <span className={`text-2xl font-bold ${lastReading.alert ? 'text-red-400' : 'text-teal-400'}`}>
            {lastReading.value}{config.unit}
          </span>
          {lastReading.alert && <span className="text-red-400 text-sm ml-3 animate-pulse">ALERT!</span>}
        </div>
      )}

      {/* Live code */}
      <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-300 dark:border-gray-700 text-sm">
        <p className="text-gray-500 mb-2">// Arduino Code:</p>
        <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
{`void setup() {
  Serial.begin(9600);  // start serial at 9600 baud
}

int count = 0;
float threshold = ${threshold};

void loop() {
  float reading = analogRead(A0) * ${
    sensor === 'temperature' ? '0.0488' : sensor === 'light' ? '0.977' : '0.196'
  };
  count++;

  Serial.print("Reading #");
  Serial.print(count);
  Serial.print(": ");
  Serial.print(reading);
  Serial.println("${config.unit}");

  if (reading ${sensor === 'distance' ? '<' : '>'} threshold) {
    Serial.println("** ALERT **");
  }

  delay(${speed});  // wait between readings
}`}
        </pre>
      </div>

      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <p className="text-teal-400 font-bold mb-1">Key idea:</p>
        <p><code className="text-green-400">Serial.println(value)</code> sends data from your Arduino to your computer. The Serial Monitor shows it as text, just like a chat window. This is how you <span className="text-teal-400">debug your code</span> and <span className="text-teal-400">see sensor values</span> in real time. Set the baud rate to <code className="text-green-400">9600</code> in both your code and the monitor.</p>
      </div>
    </div>
  );
}
