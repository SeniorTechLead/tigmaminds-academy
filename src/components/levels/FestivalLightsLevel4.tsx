import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, HelpCircle, Cpu } from 'lucide-react';
import ArduinoPlayground from '../ArduinoPlayground';
import { renderMarkdown } from '../MiniLesson';

interface CircuitLesson {
  title: string;
  concept: string;
  analogy?: string;
  storyConnection?: string;
  checkQuestion?: string;
  checkAnswer?: string;
  codeIntro?: string;
  code: string;
  ledCount?: number;
  challenge?: string;
  successHint?: string;
}


function CircuitMiniLesson({ lesson, number }: { lesson: CircuitLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L4-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.concept) }} />

        {lesson.analogy && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed"><strong>Think of it this way:</strong> {lesson.analogy}</p>
          </div>
        )}
        {lesson.storyConnection && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed"><strong>In the story:</strong> {lesson.storyConnection}</p>
          </div>
        )}
        {lesson.checkQuestion && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code — think about this:</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{lesson.checkQuestion}</p>
                {lesson.checkAnswer && (
                  <>
                    <button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {showAnswer ? 'Hide answer' : 'Show answer'}
                    </button>
                    {showAnswer && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{lesson.checkAnswer}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {lesson.codeIntro && (
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Now try it:</strong> {lesson.codeIntro}</p>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700">
        <ArduinoPlayground starterCode={lesson.code} title={`Circuit ${number}`} ledCount={lesson.ledCount || 3} />
      </div>

      {lesson.challenge && (
        <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-800 dark:text-purple-300"><strong>Experiment:</strong> {lesson.challenge}</p>
        </div>
      )}
      {lesson.successHint && (
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300"><CheckCircle className="w-4 h-4 inline mr-1" />{lesson.successHint}</p>
        </div>
      )}
    </div>
  );
}

export default function FestivalLightsLevel4() {
  const circuitLessons: CircuitLesson[] = [
    {
      title: 'System Design: LDR Sensor + 6-LED RGB Installation',
      concept: `You've reached the capstone: build an **ambient-responsive LED installation** that senses its environment and adapts in real time. As daylight fades during a festival evening, the installation gradually brightens.

The core sensor is a **Light-Dependent Resistor (LDR)** — a cadmium sulfide semiconductor whose resistance decreases in light. In darkness: ~1 megaohm. In bright light: ~200 ohms. A **voltage divider** (5V -> LDR -> junction -> 10k resistor -> GND) converts this to a voltage the Arduino ADC reads on pin A0.

The output is **6 LEDs** on PWM pins, representing an RGB strip installation:
- Pins 2, 3: Red channel pair
- Pins 4, 5: Green channel pair
- Pins 6, 7: Blue channel pair

Each pair lets us create two "pixels" of full RGB color. The ADC reads 0-1023 (dark to bright), which we map to LED patterns using different display modes.`,
      analogy: "The LDR is like a pupil in your eye. In bright light, the pupil contracts (low resistance = high voltage). In darkness, it dilates (high resistance = low voltage). Our circuit reads the 'pupil size' and adjusts LED brightness accordingly.",
      storyConnection: "The festival lights transform as evening falls — starting as subtle glimmers in afternoon haze, growing to a dazzling display at nightfall. Our installation does the same automatically. The LDR senses fading daylight and the Arduino smoothly increases LED brightness.",
      checkQuestion: 'Why do we use a 10k ohm fixed resistor in the voltage divider with the LDR, rather than 100 ohms or 1M ohms?',
      checkAnswer: "The fixed resistor should match the LDR's mid-range resistance. An LDR varies from ~1k (bright) to ~100k (dim). A 10k resistor puts the divider output in the middle of the ADC range under typical indoor lighting. With 100 ohms, voltage would be near 5V for all but the brightest light. With 1M, voltage would be near 0V except in total darkness. 10k maximizes sensitivity across the useful range.",
      codeIntro: 'Set up the 6-LED RGB installation with a self-test that cycles through red, green, and blue.',
      code: `// Festival Light Installation - System Setup\\n// 6 LEDs: 2 Red, 2 Green, 2 Blue (RGB pairs)\\n\\nvoid setup() {\\n  pinMode(2, OUTPUT);\\n  pinMode(3, OUTPUT);\\n  pinMode(4, OUTPUT);\\n  pinMode(5, OUTPUT);\\n  pinMode(6, OUTPUT);\\n  pinMode(7, OUTPUT);\\n  Serial.println("=== Festival Lights ===");\\n  Serial.println("Self-test: RGB channels...");\\n\\n  analogWrite(2, 200); analogWrite(3, 200);\\n  delay(400);\\n  analogWrite(2, 0); analogWrite(3, 0);\\n\\n  analogWrite(4, 200); analogWrite(5, 200);\\n  delay(400);\\n  analogWrite(4, 0); analogWrite(5, 0);\\n\\n  analogWrite(6, 200); analogWrite(7, 200);\\n  delay(400);\\n  analogWrite(6, 0); analogWrite(7, 0);\\n  Serial.println("Self-test OK");\\n}\\n\\nvoid loop() {\\n  int ambient = random(100, 900);\\n  int brightness = 255 - (ambient * 255 / 1023);\\n\\n  analogWrite(2, brightness);\\n  analogWrite(3, brightness);\\n  analogWrite(4, brightness);\\n  analogWrite(5, brightness);\\n  analogWrite(6, brightness);\\n  analogWrite(7, brightness);\\n\\n  Serial.print("Ambient: ");\\n  Serial.print(ambient);\\n  Serial.print(" -> Brightness: ");\\n  Serial.println(brightness);\\n  delay(300);\\n}`,
      ledCount: 6,
      challenge: 'Instead of white (all channels equal), try warm white: Red at full brightness, Green at 70%, Blue at 30%. This produces a candlelight tone more suitable for a festival atmosphere.',
      successHint: 'The auto-brightness response is the foundation of every adaptive lighting system — from phone screens to smart home bulbs. Next you add color temperature mapping.',
    },
    {
      title: 'Analog Reading: LDR Sensor with Calibration',
      concept: `The Arduino ADC converts the voltage divider output to a 10-bit number (0-1023). But raw ADC readings need **calibration** — your specific LDR, resistor tolerance, and lighting conditions affect the actual range.

Calibration procedure:
1. Cover the LDR completely (darkness) — record the ADC value as \`ldrMin\`
2. Shine a bright light directly on it — record as \`ldrMax\`
3. Map all future readings to a 0-255 range using: \`mapped = map(raw, ldrMin, ldrMax, 0, 255)\`

We also apply **smoothing** — averaging the last few readings to avoid LED flicker from sensor noise. A simple exponential moving average works well: \`smoothed = 0.8 * smoothed + 0.2 * newReading\`.`,
      analogy: "Calibration is like zeroing a kitchen scale before weighing ingredients. Every scale has a slightly different zero point. By setting your specific zero (darkness) and max (bright light), all measurements in between become accurate.",
      storyConnection: "A festival lighting designer doesn't just install lights — they calibrate them on-site. The venue's ambient light at sunset is different from a dark indoor hall. Our calibration routine adapts the installation to its specific environment.",
      checkQuestion: 'If your LDR reads 50 in darkness and 900 in bright light, what ADC value corresponds to "twilight" (50% brightness)?',
      checkAnswer: 'The midpoint between 50 and 900 is (50 + 900) / 2 = 475. After mapping: map(475, 50, 900, 0, 255) = 127. So twilight maps to brightness level 127.',
      codeIntro: 'Implement LDR calibration and smoothed reading with visual feedback on the LEDs.',
      code: `// LDR Calibration and Smoothed Reading\\n// 6 LEDs respond to simulated light level\\n\\nint ldrMin = 50;\\nint ldrMax = 900;\\nint smoothed = 128;\\nint tick = 0;\\n\\nvoid setup() {\\n  for (int i = 2; i <= 7; i++) {\\n    pinMode(i, OUTPUT);\\n  }\\n  Serial.println("=== LDR Calibration ===");\\n  Serial.println("raw,smoothed,mapped,leds_on");\\n}\\n\\nvoid loop() {\\n  int raw;\\n  int cycle = tick % 60;\\n  if (cycle < 20) {\\n    raw = ldrMin + (cycle * (ldrMax - ldrMin)) / 20;\\n  } else if (cycle < 40) {\\n    raw = ldrMax - ((cycle - 20) * 100) / 20;\\n  } else {\\n    raw = ldrMax - ((cycle - 40) * (ldrMax - ldrMin)) / 20;\\n  }\\n  raw += random(-20, 21);\\n\\n  smoothed = (smoothed * 4 + raw) / 5;\\n\\n  int mapped = (smoothed - ldrMin) * 255 / (ldrMax - ldrMin);\\n  if (mapped < 0) mapped = 0;\\n  if (mapped > 255) mapped = 255;\\n\\n  int brightness = 255 - mapped;\\n  int ledsOn = 1 + (brightness * 5) / 255;\\n  for (int i = 2; i <= 7; i++) {\\n    if (i - 2 < ledsOn) {\\n      analogWrite(i, brightness);\\n    } else {\\n      analogWrite(i, 0);\\n    }\\n  }\\n\\n  Serial.print(raw);\\n  Serial.print(",");\\n  Serial.print(smoothed);\\n  Serial.print(",");\\n  Serial.print(mapped);\\n  Serial.print(",");\\n  Serial.println(ledsOn);\\n\\n  tick++;\\n  delay(200);\\n}`,
      ledCount: 6,
      challenge: 'Change the smoothing ratio from 4:1 (80/20) to 1:1 (50/50). The LEDs respond faster but flicker more. Then try 9:1 (90/10) — very smooth but sluggish.',
      successHint: 'Sensor calibration and smoothing are essential in every embedded system. Without calibration, your code only works in one environment. Without smoothing, sensor noise makes outputs jittery.',
    },
    {
      title: 'Color Temperature Mapping: Warm to Cool',
      concept: `Effective festival lighting shifts **color temperature** with ambient conditions. In low ambient light (dusk), warm tones (reds and oranges) feel natural. In bright ambient light (daylight), cool tones (blues and whites) match.

Color temperature in Kelvin:
- **1800K** — candlelight, deep orange-red
- **2700K** — warm white, incandescent
- **4000K** — neutral white
- **6500K** — daylight, blue-white

We map the LDR reading to RGB ratios:
- Dark ambient -> warm: R=255, G=140, B=20 (candlelight)
- Bright ambient -> cool: R=180, G=220, B=255 (daylight)`,
      analogy: "Think of how sunlight changes throughout the day. At sunrise and sunset, the sky is warm orange-red. At noon, it's cool blue-white. Our installation mimics this natural color shift automatically.",
      storyConnection: "Festival lighting evolves through the evening — warm oil lamps at twilight, bright displays at night, soft amber as the celebration winds down. Our color temperature mapping recreates this progression automatically.",
      checkQuestion: 'Why does warm light (low color temperature) have MORE red and LESS blue, even though higher Kelvin numbers are called "cooler"?',
      checkAnswer: 'The naming comes from blackbody radiation. A metal heated to 1800K glows red-orange. At 6500K it glows blue-white. In interior design the meaning flipped: "warm" = cozy orange, "cool" = clinical blue.',
      codeIntro: 'Map ambient light to color temperature, with smooth RGB transitions across 6 LEDs.',
      code: `// Color Temperature Mapping\\n// 6 LEDs shift from warm (dark) to cool (bright)\\n\\nint tick = 0;\\n\\nvoid setup() {\\n  for (int i = 2; i <= 7; i++) {\\n    pinMode(i, OUTPUT);\\n  }\\n  Serial.println("=== Color Temperature ===");\\n  Serial.println("ambient,R,G,B,temp_K");\\n}\\n\\nvoid loop() {\\n  int cycle = tick % 100;\\n  int ambient;\\n  if (cycle < 50) {\\n    ambient = cycle * 20;\\n  } else {\\n    ambient = (100 - cycle) * 20;\\n  }\\n\\n  int level = ambient * 255 / 1000;\\n  if (level > 255) level = 255;\\n\\n  int r = 255 - (level * 75 / 255);\\n  int g = 140 + (level * 80 / 255);\\n  int b = 20 + (level * 235 / 255);\\n\\n  int brightness = 255 - level;\\n  r = r * brightness / 255;\\n  g = g * brightness / 255;\\n  b = b * brightness / 255;\\n\\n  analogWrite(2, r); analogWrite(3, r);\\n  analogWrite(4, g); analogWrite(5, g);\\n  analogWrite(6, b); analogWrite(7, b);\\n\\n  int temp = 1800 + (level * 4700 / 255);\\n\\n  Serial.print(ambient);\\n  Serial.print(",R=");\\n  Serial.print(r);\\n  Serial.print(",G=");\\n  Serial.print(g);\\n  Serial.print(",B=");\\n  Serial.print(b);\\n  Serial.print(",");\\n  Serial.print(temp);\\n  Serial.println("K");\\n\\n  tick++;\\n  delay(150);\\n}`,
      ledCount: 6,
      challenge: 'Add a "sunset mode" — when ambient drops below 200, shift to deep orange (R=255, G=80, B=0) instead of the standard warm mapping.',
      successHint: 'Color temperature mapping is how smart bulbs (Philips Hue, LIFX) create their "adaptive lighting" modes. Your simulation demonstrates the core algorithm that drives a multi-billion dollar industry.',
    },
    {
      title: 'State Machine: Multiple Display Modes',
      concept: `A professional light installation needs multiple **display modes**. A **state machine** is the cleanest implementation: the system is always in exactly one state, and inputs cause transitions.

Our four modes:
- **Mode 0: Auto Brightness** — white light, intensity follows ambient
- **Mode 1: Color Temperature** — warm in dark, cool in bright
- **Mode 2: Pulse** — breathing rhythm, speed follows ambient
- **Mode 3: Rainbow Cycle** — cycling hue, speed follows ambient

A button (simulated with a timer) cycles through modes. This pattern scales to any number of modes without spaghetti code.`,
      analogy: "A traffic light is a state machine: always in exactly one state (red, yellow, green). A timer triggers transitions. Our display modes work the same way — one mode active at a time, button presses cycle through them.",
      storyConnection: "A festival has phases — the quiet anticipation before sunset, the first lights, the peak celebration, the wind-down. Our state machine gives the installation these distinct personalities.",
      checkQuestion: 'Why use a state machine instead of nested if-else statements for multiple modes?',
      checkAnswer: 'A state machine separates "which mode am I in?" from "what does this mode do?" Each mode is independent. Adding a new mode means adding one case — not threading logic through if-else chains. It also makes debugging easier.',
      codeIntro: 'Implement a 4-mode state machine with automatic mode cycling.',
      code: `// State Machine: 4 Display Modes\\n// Auto-cycles every 30 ticks for demo\\n// Beep on mode transitions, tone tracks brightness\\n\\nint mode = 0;\\nint tick = 0;\\nint breathStep = 0;\\nint hueStep = 0;\\n\\nvoid setup() {\\n  for (int i = 2; i <= 7; i++) {\\n    pinMode(i, OUTPUT);\\n  }\\n  Serial.println("=== Mode: Auto Brightness ===");\\n}\\n\\nvoid allOff() {\\n  for (int i = 2; i <= 7; i++) analogWrite(i, 0);\\n}\\n\\nvoid loop() {\\n  if (tick > 0 && tick % 30 == 0) {\\n    mode = (mode + 1) % 4;\\n    allOff();\\n    tone(8, 1000);\\n    delay(80);\\n    noTone(8);\\n    if (mode == 0) Serial.println("=== Mode: Auto Brightness ===");\\n    if (mode == 1) Serial.println("=== Mode: Color Temperature ===");\\n    if (mode == 2) Serial.println("=== Mode: Pulse ===");\\n    if (mode == 3) Serial.println("=== Mode: Rainbow ===");\\n  }\\n\\n  int ambient = 400 + random(-50, 51);\\n\\n  if (mode == 0) {\\n    int b = 255 - (ambient * 255 / 1023);\\n    for (int i = 2; i <= 7; i++) analogWrite(i, b);\\n    tone(8, 200 + b * 3);\\n  }\\n  else if (mode == 1) {\\n    int level = ambient * 255 / 1023;\\n    int r = (255 - level * 75 / 255) * (255 - level) / 255;\\n    int g = (140 + level * 80 / 255) * (255 - level) / 255;\\n    int b = (20 + level * 235 / 255) * (255 - level) / 255;\\n    analogWrite(2, r); analogWrite(3, r);\\n    analogWrite(4, g); analogWrite(5, g);\\n    analogWrite(6, b); analogWrite(7, b);\\n  }\\n  else if (mode == 2) {\\n    breathStep = (breathStep + 3) % 510;\\n    int b = (breathStep < 255) ? breathStep : (510 - breathStep);\\n    for (int i = 2; i <= 7; i++) analogWrite(i, b);\\n  }\\n  else if (mode == 3) {\\n    hueStep = (hueStep + 5) % 765;\\n    int r = 0, g = 0, b = 0;\\n    if (hueStep < 255) { r = 255 - hueStep; g = hueStep; }\\n    else if (hueStep < 510) { g = 510 - hueStep; b = hueStep - 255; }\\n    else { b = 765 - hueStep; r = hueStep - 510; }\\n    analogWrite(2, r); analogWrite(3, r);\\n    analogWrite(4, g); analogWrite(5, g);\\n    analogWrite(6, b); analogWrite(7, b);\\n  }\\n  if (mode != 0) noTone(8);\\n\\n  tick++;\\n  delay(100);\\n}`,
      ledCount: 6,
      challenge: 'Add a 5th mode: "Strobe" — all LEDs flash on/off at maximum brightness. Remember to update the mode cycle count.',
      successHint: 'State machines are the backbone of embedded programming — from washing machines to space probes. Every multi-mode device runs on this exact pattern.',
    },
    {
      title: 'Complete Festival Lights Capstone: Sensor + Modes + RGB',
      concept: `Everything comes together: **6-LED RGB installation** with LDR sensing, calibrated analog input, smoothed readings, color temperature mapping, and a 4-mode state machine.

The final sketch combines:
1. **LDR sensor with calibration** — normalized 0-255, exponential smoothing
2. **Auto brightness** — inverse mapping, dark = bright LEDs
3. **Color temperature** — warm candlelight to cool daylight
4. **Pulse mode** — breathing with ambient-adaptive speed
5. **Rainbow cycle** — hue rotation with adaptive speed
6. **Gamma correction** — perceptually smooth fading

On real hardware: 6 LEDs, an LDR, a 10k resistor, a pushbutton, and an Arduino Uno. Total under $10.`,
      storyConnection: "The festival lights weren't just decoration — they were part of the experience, responding to the evening, the weather, the crowd. Your installation does the same: it reads its environment and adapts. Technology in service of celebration.",
      checkQuestion: 'How would you add a "sound reactive" mode that pulses LEDs to music?',
      checkAnswer: 'Add an electret microphone on an analog pin. Read amplitude, apply peak detection, and map peaks to LED brightness. For beat detection, compare current amplitude to a running average — spikes indicate beats.',
      codeIntro: 'The final capstone: full installation with sensor, smoothing, 4 modes, gamma correction, and logging.',
      code: `// === FESTIVAL LIGHTS CAPSTONE ===\\n// LDR sensor + 4 modes + RGB + logging\\n\\nint mode = 0;\\nint tick = 0;\\nint smoothed = 500;\\nint breathStep = 0;\\nint hueStep = 0;\\n\\nint gammaLUT[] = {0, 1, 4, 10, 20, 36, 58, 86,\\n                  120, 161, 208, 255};\\n\\nint gc(int raw) {\\n  int idx = raw / 23;\\n  if (idx > 11) idx = 11;\\n  if (idx < 0) idx = 0;\\n  return gammaLUT[idx];\\n}\\n\\nvoid setup() {\\n  for (int i = 2; i <= 7; i++) pinMode(i, OUTPUT);\\n  Serial.println("=== Festival Lights Capstone ===");\\n  for (int i = 2; i <= 7; i++) {\\n    analogWrite(i, 180); delay(100); analogWrite(i, 0);\\n  }\\n  Serial.println("Self-test OK");\\n  Serial.println("ms,mode,ambient,r,g,b");\\n}\\n\\nvoid loop() {\\n  if (tick > 0 && tick % 40 == 0) {\\n    mode = (mode + 1) % 4;\\n    for (int i = 2; i <= 7; i++) analogWrite(i, 0);\\n    tone(8, 1000);\\n    delay(80);\\n    noTone(8);\\n  }\\n\\n  int cycle = tick % 80;\\n  int ambient;\\n  if (cycle < 40) ambient = 100 + cycle * 20;\\n  else ambient = 900 - (cycle - 40) * 20;\\n  ambient += random(-30, 31);\\n\\n  smoothed = (smoothed * 4 + ambient) / 5;\\n  int level = (smoothed - 50) * 255 / 850;\\n  if (level < 0) level = 0;\\n  if (level > 255) level = 255;\\n\\n  int r = 0, g = 0, b = 0;\\n\\n  if (mode == 0) {\\n    int brt = gc(255 - level);\\n    r = brt; g = brt; b = brt;\\n  }\\n  else if (mode == 1) {\\n    int brt = 255 - level;\\n    r = gc((255 - level * 75 / 255) * brt / 255);\\n    g = gc((140 + level * 80 / 255) * brt / 255);\\n    b = gc((20 + level * 235 / 255) * brt / 255);\\n  }\\n  else if (mode == 2) {\\n    int speed = 2 + level / 40;\\n    breathStep = (breathStep + speed) % 510;\\n    int brt = (breathStep < 255) ? breathStep : (510 - breathStep);\\n    r = gc(brt); g = gc(brt); b = gc(brt);\\n  }\\n  else if (mode == 3) {\\n    int speed = 3 + level / 30;\\n    hueStep = (hueStep + speed) % 765;\\n    if (hueStep < 255) { r = gc(255 - hueStep); g = gc(hueStep); }\\n    else if (hueStep < 510) { g = gc(510 - hueStep); b = gc(hueStep - 255); }\\n    else { b = gc(765 - hueStep); r = gc(hueStep - 510); }\\n  }\\n\\n  analogWrite(2, r); analogWrite(3, r);\\n  analogWrite(4, g); analogWrite(5, g);\\n  analogWrite(6, b); analogWrite(7, b);\\n\\n  if (tick % 4 == 0) {\\n    Serial.print(tick * 100);\\n    Serial.print(",");\\n    Serial.print(mode);\\n    Serial.print(",");\\n    Serial.print(smoothed);\\n    Serial.print(",");\\n    Serial.print(r);\\n    Serial.print(",");\\n    Serial.print(g);\\n    Serial.print(",");\\n    Serial.println(b);\\n  }\\n\\n  tick++;\\n  delay(100);\\n}`,
      ledCount: 6,
      challenge: 'On real hardware: connect an LDR + 10k voltage divider to A0, a pushbutton to pin 8, and replace the simulated ambient with analogRead(A0). Add debouncing for reliable mode switching.',
      successHint: 'You\'ve written the code for a complete ambient-responsive light installation: sensor calibration, smoothing, color temperature, multiple display modes, gamma correction, and data logging. This is the architecture behind smart home lighting and interactive art.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (LED circuits & sensor integration)</span>
      </div>

      <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-800 dark:text-purple-300">
          This capstone uses a <strong>simulated Arduino</strong> to build an ambient-responsive festival lighting installation with LDR sensing, color temperature mapping, and multiple display modes. Edit the code, click "Upload & Run", and watch the virtual LEDs respond.
        </p>
      </div>

      <div className="space-y-8">
        {circuitLessons.map((lesson, i) => (
          <CircuitMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
