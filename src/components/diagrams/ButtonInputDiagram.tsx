'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Mode = 'direct' | 'toggle' | 'counter';

export default function ButtonInputDiagram() {
  const [mode, setMode] = useState<Mode>('direct');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [counter, setCounter] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [blinksLeft, setBlinksLeft] = useState(0);
  const blinkRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPressed = useRef(false);

  const cleanupBlink = useCallback(() => {
    if (blinkRef.current) clearInterval(blinkRef.current);
    blinkRef.current = null;
  }, []);

  // Handle button press/release effects
  useEffect(() => {
    const wasPressed = prevPressed.current;
    prevPressed.current = buttonPressed;
    const justPressed = buttonPressed && !wasPressed;

    if (mode === 'direct') {
      setLedOn(buttonPressed);
    } else if (mode === 'toggle' && justPressed) {
      setToggleState(prev => !prev);
    } else if (mode === 'counter' && justPressed) {
      setCounter(prev => prev + 1);
    }
  }, [buttonPressed, mode]);

  // Toggle mode: LED follows toggleState
  useEffect(() => {
    if (mode === 'toggle') setLedOn(toggleState);
  }, [toggleState, mode]);

  // Counter mode: blink N times on button release
  useEffect(() => {
    if (mode !== 'counter') return;
    if (buttonPressed) return; // wait for release
    if (counter === 0) return;

    cleanupBlink();
    setBlinking(true);
    setBlinksLeft(counter);
    let remaining = counter * 2; // on + off per blink
    let on = true;

    setLedOn(true);
    blinkRef.current = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        cleanupBlink();
        setLedOn(false);
        setBlinking(false);
        setBlinksLeft(0);
        setCounter(0);
        return;
      }
      on = !on;
      setLedOn(on);
      setBlinksLeft(Math.ceil(remaining / 2));
    }, 300);

    return cleanupBlink;
    // Only trigger on button release in counter mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonPressed, mode]);

  const resetAll = () => {
    setButtonPressed(false);
    setLedOn(false);
    setToggleState(false);
    setCounter(0);
    setBlinking(false);
    setBlinksLeft(0);
    cleanupBlink();
  };

  const switchMode = (m: Mode) => {
    resetAll();
    setMode(m);
  };

  const pinState = buttonPressed ? 'HIGH' : 'LOW';

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 text-white font-mono select-none">
      <h3 className="text-center text-lg font-bold text-orange-400 mb-4">
        Reading Input — Buttons and Decisions
      </h3>

      {/* Mode selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {([
          ['direct', 'Direct', 'LED on while pressed'],
          ['toggle', 'Toggle', 'Each press flips LED'],
          ['counter', 'Counter', 'Press to count, release to blink'],
        ] as [Mode, string, string][]).map(([m, label, desc]) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === m
                ? 'bg-orange-600 ring-2 ring-orange-400'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span>{label}</span>
            <span className="block text-[10px] font-normal text-gray-300">{desc}</span>
          </button>
        ))}
      </div>

      {/* Circuit display */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            onMouseLeave={() => setButtonPressed(false)}
            onTouchStart={e => { e.preventDefault(); setButtonPressed(true); }}
            onTouchEnd={() => setButtonPressed(false)}
            disabled={blinking}
            className={`w-20 h-20 rounded-xl border-4 font-bold text-sm transition-all active:scale-95 ${
              buttonPressed
                ? 'bg-orange-500 border-orange-300 shadow-lg shadow-orange-500/50 translate-y-1'
                : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
            } ${blinking ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {buttonPressed ? 'PRESSED' : 'PUSH'}
          </button>
          <span className="text-xs text-gray-400">Pin 7 (input)</span>
          <span className="text-xs text-gray-500">{mode === 'direct' ? 'Hold to light' : mode === 'toggle' ? 'Click to toggle' : 'Click to count'}</span>
        </div>

        {/* Wire */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-1 bg-orange-400 rounded" />
          <span className="text-[9px] text-orange-300 mt-1">signal</span>
        </div>

        {/* Arduino logic */}
        <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-700 text-center">
          <p className="text-[10px] text-blue-300 mb-1">Arduino decides:</p>
          <p className="text-xs text-green-300">
            if (pin7 == {pinState})
          </p>
          <p className="text-xs text-yellow-300">
            → {ledOn ? 'LED ON' : 'LED OFF'}
          </p>
        </div>

        {/* Wire */}
        <div className="w-12 h-1 bg-green-400 rounded" />

        {/* LED */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-20 h-20 rounded-full border-4 transition-all duration-75"
            style={{
              borderColor: ledOn ? '#22c55e' : '#374151',
              backgroundColor: ledOn ? '#22c55e' : '#111827',
              boxShadow: ledOn
                ? '0 0 35px 12px rgba(34,197,94,0.5), 0 0 70px 25px rgba(34,197,94,0.2)'
                : 'none',
            }}
          />
          <span className="text-xs text-gray-400">Pin 2 (output)</span>
        </div>
      </div>

      {/* Pin state display */}
      <div className="flex justify-center gap-8 mb-4">
        <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
          buttonPressed ? 'bg-orange-900/50 text-orange-300 ring-1 ring-orange-500' : 'bg-gray-800 text-gray-500'
        }`}>
          Pin 7: <span className={buttonPressed ? 'text-orange-400' : 'text-gray-400'}>{pinState}</span>
        </div>
        <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
          ledOn ? 'bg-green-900/50 text-green-300 ring-1 ring-green-500' : 'bg-gray-800 text-gray-500'
        }`}>
          Pin 2: <span className={ledOn ? 'text-green-400' : 'text-gray-400'}>{ledOn ? 'HIGH' : 'LOW'}</span>
        </div>
        {mode === 'counter' && (
          <div className="px-4 py-2 rounded-lg text-sm font-bold bg-purple-900/50 text-purple-300 ring-1 ring-purple-500">
            Count: <span className="text-purple-400 text-lg">{blinking ? blinksLeft : counter}</span>
          </div>
        )}
        {mode === 'toggle' && (
          <div className="px-4 py-2 rounded-lg text-sm font-bold bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500">
            State: <span className="text-cyan-400">{toggleState ? 'ON' : 'OFF'}</span>
          </div>
        )}
      </div>

      {/* Live code */}
      <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 text-sm">
        <p className="text-gray-500 mb-2">// Arduino Code — {mode} mode:</p>
        <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
{mode === 'direct' ? `void setup() {
  pinMode(7, INPUT);   // button
  pinMode(2, OUTPUT);  // LED
}

void loop() {
  if (digitalRead(7) == HIGH) {
    digitalWrite(2, HIGH);  // button pressed → LED on
  } else {
    digitalWrite(2, LOW);   // button released → LED off
  }
}` : mode === 'toggle' ? `int ledState = ${toggleState ? 'HIGH' : 'LOW'};
int lastButton = LOW;

void loop() {
  int btn = digitalRead(7);
  if (btn == HIGH && lastButton == LOW) {
    // button just pressed — flip the LED
    ledState = !ledState;
    digitalWrite(2, ledState);
  }
  lastButton = btn;
  delay(50);  // debounce
}` : `int count = ${counter};

void loop() {
  if (digitalRead(7) == HIGH) {
    count++;             // button pressed → add 1
    delay(300);          // wait for release
  }
  // When you release, blink 'count' times
  for (int i = 0; i < count; i++) {
    digitalWrite(2, HIGH);
    delay(300);
    digitalWrite(2, LOW);
    delay(300);
  }
}`}
        </pre>
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-3 text-sm text-gray-300 leading-relaxed">
        <p className="text-orange-400 font-bold mb-1">Key idea:</p>
        <p><code className="text-green-400">digitalRead(pin)</code> checks if a button is pressed (<span className="text-orange-400">HIGH</span>) or not (<span className="text-gray-400">LOW</span>). Your code uses <code className="text-green-400">if</code> statements to decide what to do based on the input. This is how Arduino reacts to the real world!</p>
      </div>
    </div>
  );
}
