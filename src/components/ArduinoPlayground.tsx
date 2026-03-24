import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square, RotateCcw, Cpu } from 'lucide-react';

interface ArduinoPlaygroundProps {
  starterCode: string;
  title?: string;
  /** Number of LEDs to simulate visually */
  ledCount?: number;
  /** Description text */
  description?: string;
}

interface LedState {
  pin: number;
  brightness: number; // 0-255
}

// Simple Arduino C++ interpreter for LED demos
function simulateArduino(code: string, ledCount: number, onLedUpdate: (leds: LedState[]) => void, onSerial: (text: string) => void, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const leds: LedState[] = Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 }));
    const output: string[] = [];

    // Parse the code for key patterns
    const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('#'));

    // Extract delay value
    const getDelay = (line: string): number => {
      const m = line.match(/delay\((\d+)\)/);
      return m ? parseInt(m[1]) : 0;
    };

    // Extract analogWrite/digitalWrite
    const getWrite = (line: string): { pin: number; value: number } | null => {
      const aw = line.match(/analogWrite\((\d+),\s*(\d+)\)/);
      if (aw) return { pin: parseInt(aw[1]), value: parseInt(aw[2]) };
      const dw = line.match(/digitalWrite\((\d+),\s*(HIGH|LOW|1|0)\)/);
      if (dw) return { pin: parseInt(dw[1]), value: dw[2] === 'HIGH' || dw[2] === '1' ? 255 : 0 };
      return null;
    };

    // Extract Serial.println
    const getSerial = (line: string): string | null => {
      const m = line.match(/Serial\.println?\("([^"]+)"\)/);
      if (m) return m[1];
      const mv = line.match(/Serial\.println?\((.+)\)/);
      if (mv) return mv[1];
      return null;
    };

    // Find loop() body
    const loopStart = lines.findIndex(l => l.startsWith('void loop()'));
    const setupStart = lines.findIndex(l => l.startsWith('void setup()'));

    // Execute setup
    if (setupStart >= 0) {
      for (let i = setupStart + 1; i < lines.length && i < (loopStart >= 0 ? loopStart : lines.length); i++) {
        const serial = getSerial(lines[i]);
        if (serial) output.push(serial);
      }
      if (output.length > 0) onSerial(output.join('\n'));
    }

    // Execute loop iterations
    if (loopStart < 0) { resolve(); return; }

    const loopBody = [];
    let braceCount = 0;
    let inLoop = false;
    for (let i = loopStart; i < lines.length; i++) {
      if (lines[i].includes('{')) { braceCount++; inLoop = true; }
      if (inLoop && braceCount > 0) loopBody.push(lines[i]);
      if (lines[i].includes('}')) braceCount--;
      if (inLoop && braceCount === 0) break;
    }

    let iteration = 0;
    const maxIterations = 20;

    // Process lines sequentially with real delays so LED state changes are visible
    const processLines = async () => {
      for (let iter = 0; iter < maxIterations; iter++) {
        if (signal.aborted) break;

        for (const line of loopBody) {
          if (signal.aborted) break;

          const write = getWrite(line);
          if (write) {
            const ledIdx = leds.findIndex(l => l.pin === write.pin);
            if (ledIdx >= 0) {
              leds[ledIdx] = { ...leds[ledIdx], brightness: write.value };
              onLedUpdate(leds.map(l => ({ ...l })));
            }
          }

          const serial = getSerial(line);
          if (serial) {
            output.push(serial);
            onSerial(output.join('\n'));
          }

          const delay = getDelay(line);
          if (delay > 0) {
            // Real delay (capped and sped up 4x) so React can re-render
            await new Promise(r => setTimeout(r, Math.min(delay, 500) / 4));
          }
        }
      }
      resolve();
    };

    processLines();
  });
}

export default function ArduinoPlayground({
  starterCode,
  title = 'Arduino Simulator',
  ledCount = 3,
  description,
}: ArduinoPlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [leds, setLeds] = useState<LedState[]>(Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 })));
  const [serialOutput, setSerialOutput] = useState('');
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setRunning(false);
    setLeds(Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 })));
  }, [ledCount]);

  const run = useCallback(() => {
    stop();
    const ac = new AbortController();
    abortRef.current = ac;
    setRunning(true);
    setSerialOutput('');

    simulateArduino(
      code,
      ledCount,
      (newLeds) => setLeds(newLeds),
      (text) => setSerialOutput(text),
      ac.signal,
    ).then(() => setRunning(false));
  }, [code, ledCount, stop]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const lineCount = code.split('\n').length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const s = ta.selectionStart, end = ta.selectionEnd;
      setCode(code.substring(0, s) + '  ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-teal-400" />
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <span className="text-xs text-teal-400 bg-teal-900/30 px-2 py-0.5 rounded-full">Simulated</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setCode(starterCode); stop(); setSerialOutput(''); }} className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={running ? stop : run}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${running ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
          >
            {running ? <><Square className="w-4 h-4" />Stop</> : <><Play className="w-4 h-4" />Upload & Run</>}
          </button>
        </div>
      </div>

      {description && (
        <div className="px-6 py-2 bg-gray-800/50 border-b border-gray-700">
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Code editor */}
        <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-gray-700">
          <div className="flex max-h-[350px] overflow-y-auto">
            <div className="flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r border-gray-700" aria-hidden>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6 text-xs font-mono text-gray-600">{i + 1}</div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={lineCount}
                className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>
        </div>

        {/* LED visualization + serial */}
        <div className="w-full lg:w-72 flex-shrink-0">
          {/* LED board */}
          <div className="p-6 bg-gray-800/50 border-b border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 font-semibold">Breadboard</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {leds.map((led, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-8 h-12 rounded-full mx-auto transition-all duration-150"
                    style={{
                      backgroundColor: led.brightness > 0
                        ? `rgba(34, 197, 94, ${led.brightness / 255})`
                        : '#1f2937',
                      boxShadow: led.brightness > 0
                        ? `0 0 ${led.brightness / 10}px ${led.brightness / 20}px rgba(34, 197, 94, ${led.brightness / 300})`
                        : 'none',
                      border: '2px solid #374151',
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2 font-mono">Pin {led.pin}</p>
                  <p className="text-xs text-gray-600 font-mono">{led.brightness > 0 ? led.brightness : 'OFF'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Serial monitor */}
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Serial Monitor</p>
            <pre className="text-xs text-teal-400 font-mono whitespace-pre-wrap max-h-[100px] overflow-y-auto bg-gray-950 rounded p-2">
              {serialOutput || '(waiting for output...)'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
