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

export default function FireflyLevel4() {
  const circuitLessons: CircuitLesson[] = [
    {
      title: 'System Design: 6-LED Ring with Timing Control',
      concept: `You've reached the capstone: build a **synchronized LED firefly array** using 6 LEDs in a ring topology, just like a swarm on a Majuli riverbank.

Each LED connects to a PWM pin through a 220-ohm resistor. We use all 6 PWM-capable pins (3, 5, 6, 9, 10, 11) so every "firefly" can fade smoothly with \`analogWrite()\`.

**Ring topology** means LED 0 couples to LEDs 1 and 5, LED 1 couples to LEDs 0 and 2, and so on. Each firefly responds only to its nearest neighbors — the same local-coupling rule that real fireflies follow.

Power budget: 6 LEDs at ~15 mA each = 90 mA total, well within the Arduino's 200 mA limit.`,
      analogy: 'Six drummers in a circle. Each can hear only the two beside them. At first they play different rhythms. Gradually, each nudges their tempo toward what they hear. The resistors are like earplugs that protect the drums (LEDs) from being hit too hard.',
      storyConnection: 'On the banks of Majuli, thousands of fireflies flash together in darkness. Each is a tiny oscillator — a biological clock coupled to its neighbors through light. Our six-LED ring is a miniature version of that riverbank swarm.',
      checkQuestion: 'Why do we need current-limiting resistors between the Arduino pins and the LEDs?',
      checkAnswer: 'An LED has very low forward resistance once its threshold voltage is reached (~2V). Without a resistor, current spikes to hundreds of milliamps, destroying the LED and possibly the Arduino pin (rated 40 mA max). A 220-ohm resistor limits current to (5V - 2V) / 220 = ~13.6 mA — bright enough to see, safe for hardware.',
      codeIntro: 'Set up 6 LEDs on PWM pins and verify they all work with a startup sweep.',
      code: `// Firefly Capstone - System Setup\n// 6 LEDs on PWM pins in ring topology\n\nvoid setup() {\n  pinMode(2, OUTPUT);\n  pinMode(3, OUTPUT);\n  pinMode(4, OUTPUT);\n  pinMode(5, OUTPUT);\n  pinMode(6, OUTPUT);\n  pinMode(7, OUTPUT);\n  Serial.println("=== Firefly Ring: 6 LEDs ===");\n  Serial.println("Self-test: sweeping all LEDs...");\n}\n\nvoid loop() {\n  int pins[] = {2, 3, 4, 5, 6, 7};\n\n  for (int i = 0; i < 6; i++) {\n    analogWrite(pins[i], 255);\n    delay(150);\n    analogWrite(pins[i], 0);\n  }\n\n  for (int i = 0; i < 6; i++) {\n    analogWrite(pins[i], 180);\n  }\n  delay(500);\n\n  for (int i = 0; i < 6; i++) {\n    analogWrite(pins[i], 0);\n  }\n  delay(300);\n\n  Serial.println("Ring test complete");\n}`,
      ledCount: 6,
      challenge: 'Reverse the sweep direction — light LEDs from 7 down to 2. Then try lighting opposite pairs (2+5, 3+6, 4+7) simultaneously.',
      successHint: 'All 6 LEDs responding independently confirms your ring is wired correctly. Next you add the Kuramoto synchronization algorithm.',
    },
    {
      title: 'Kuramoto Synchronization in Arduino C',
      concept: `The **Kuramoto model** is the algorithm that makes fireflies synchronize. Each oscillator (LED) has a **phase** (0 to 2*PI) and a **natural frequency** (slightly different for each). The coupling rule is simple: each oscillator nudges its phase toward its neighbors.

The update equation for each firefly *i*:

**phase[i] += freq[i] * dt + K * sin(phase[neighbor] - phase[i])**

where **K** is the coupling strength. When K=0, fireflies are independent. As K increases, they pull each other into sync.

Brightness comes from a **raised cosine**: brightness = (1 + cos(phase)) / 2, which smoothly cycles between 0 and 1. Multiplied by 255, this drives \`analogWrite()\`.

The key insight: **no central clock** coordinates them. Synchronization *emerges* from purely local interactions.`,
      analogy: 'Imagine six pendulum clocks hanging on a shared wall. The vibrations traveling through the wall subtly couple the pendulums. Over hours, they synchronize — not because someone adjusted them, but because physics coupled them. The coupling constant K is how "soft" the wall is.',
      storyConnection: 'Aita told Joon that the fireflies were fragments of a shattered star. Each fragment carries its own rhythm, but together they converge — not through a conductor, but through mutual influence. The Kuramoto model is the mathematics of that convergence.',
      checkQuestion: 'If coupling strength K = 0, what happens to the firefly phases over time?',
      checkAnswer: 'Each firefly oscillates at its own natural frequency, drifting apart forever. The LEDs blink at slightly different rates with no coordination. Increasing K gradually pulls them together — above a critical threshold, they lock into perfect synchronization.',
      codeIntro: 'Implement the Kuramoto coupling algorithm. Watch the 6 LEDs start random and gradually synchronize.',
      code: `// Firefly Kuramoto Synchronization\n// 6 LEDs, ring coupling, gradual sync\n\nint pins[] = {2, 3, 4, 5, 6, 7};\nint phase[] = {0, 100, 200, 50, 170, 30};\nint freq[] = {15, 14, 16, 15, 13, 16};\nint coupling = 3;\n\nvoid setup() {\n  for (int i = 0; i < 6; i++) {\n    pinMode(pins[i], OUTPUT);\n  }\n  Serial.println("Kuramoto sync starting...");\n  Serial.println("Watch LEDs converge!");\n}\n\nvoid loop() {\n  for (int i = 0; i < 6; i++) {\n    int left = (i + 5) % 6;\n    int right = (i + 1) % 6;\n    int diff_left = phase[left] - phase[i];\n    int diff_right = phase[right] - phase[i];\n    phase[i] += freq[i] + (coupling * diff_left) / 100 + (coupling * diff_right) / 100;\n    if (phase[i] > 628) phase[i] -= 628;\n    if (phase[i] < 0) phase[i] += 628;\n  }\n\n  for (int i = 0; i < 6; i++) {\n    int brightness;\n    if (phase[i] < 157) {\n      brightness = 255 - (phase[i] * 255 / 157);\n    } else if (phase[i] < 471) {\n      brightness = (phase[i] - 157) * 255 / 314;\n      brightness = 255 - brightness;\n    } else {\n      brightness = (phase[i] - 471) * 255 / 157;\n    }\n    if (brightness < 0) brightness = 0;\n    if (brightness > 255) brightness = 255;\n    analogWrite(pins[i], brightness);\n  }\n\n  delay(50);\n  Serial.println("Phase sync in progress...");\n}`,
      ledCount: 6,
      challenge: 'Change coupling from 3 to 0 — the LEDs drift independently. Then try coupling = 10 for fast synchronization. Find the minimum coupling that still achieves sync.',
      successHint: 'You implemented the Kuramoto model in embedded C. This same algorithm models heart cells synchronizing, neurons firing in brain waves, and power grid generators staying in phase.',
    },
    {
      title: 'PWM Breathing Patterns: Gamma-Corrected Fading',
      concept: `Raw PWM values don't map linearly to perceived brightness. Human vision is **logarithmic**: the difference between PWM 0 and 50 looks huge, but the difference between 200 and 250 is barely noticeable.

**Gamma correction** fixes this. Instead of linearly ramping 0-255, we apply a curve: \`corrected = (raw/255)^gamma * 255\`. With gamma = 2.2 (the standard), low values spread out (more steps in the dim range) and high values compress. The result: a smooth, organic-looking fade that matches human perception.

For a firefly breathing pattern, we combine gamma correction with an **envelope function** — a slow sine wave that controls the overall glow intensity, overlaid with faster individual flicker.`,
      analogy: 'Imagine adjusting a dimmer switch. The first 10% of rotation makes a big visual difference (dark to dim). The last 10% barely changes anything (bright to slightly brighter). Gamma correction redistributes the steps so each click of the dial produces an equal visual change.',
      storyConnection: "A real firefly's glow rises and falls with organic smoothness — never a harsh jump. The bioluminescent reaction ramps gradually. Gamma correction makes our LEDs mimic that biological smoothness instead of the harsh linear ramp that digital PWM naturally produces.",
      checkQuestion: 'With gamma = 2.2, what PWM value produces 50% perceived brightness?',
      checkAnswer: 'Solving: (x/255)^2.2 = 0.5, so x = 255 * 0.5^(1/2.2) = 255 * 0.73 = ~186. You need PWM 186 for 50% perceived brightness — not 128 as you might expect.',
      codeIntro: 'Apply gamma-corrected breathing to all 6 LEDs with staggered phases for an organic swarm effect.',
      code: `// Gamma-Corrected Firefly Breathing\n// 6 LEDs with smooth, perceptually-correct fading\n\nint pins[] = {2, 3, 4, 5, 6, 7};\nint step = 0;\n\nint gammaLUT[] = {0, 1, 4, 10, 20, 36, 58, 86,\n                  120, 161, 208, 255};\n\nint gammaCorrect(int raw) {\n  int idx = raw / 23;\n  if (idx > 11) idx = 11;\n  return gammaLUT[idx];\n}\n\nvoid setup() {\n  for (int i = 0; i < 6; i++) {\n    pinMode(pins[i], OUTPUT);\n  }\n  Serial.println("Gamma-corrected breathing");\n}\n\nvoid loop() {\n  for (int i = 0; i < 6; i++) {\n    int offset = i * 40;\n    int raw = step + offset;\n    raw = raw % 240;\n\n    int brightness;\n    if (raw < 120) {\n      brightness = (raw * 255) / 120;\n    } else {\n      brightness = ((240 - raw) * 255) / 120;\n    }\n\n    int corrected = gammaCorrect(brightness);\n    analogWrite(pins[i], corrected);\n  }\n\n  step += 2;\n  if (step > 240) step = 0;\n  delay(40);\n\n  Serial.println("Breathing...");\n}`,
      ledCount: 6,
      challenge: 'Compare with and without gamma correction: comment out the gammaCorrect call and use raw brightness instead. Notice how the uncorrected version spends too long looking "almost full brightness" and jumps harshly at the dim end.',
      successHint: 'Gamma correction is used everywhere — monitors, LED strips, game engines, photography. You now understand why raw PWM values look wrong and how to fix them.',
    },
    {
      title: 'Serial Data Logging for Debugging',
      concept: `Embedded systems don't have screens — **Serial.print()** is your primary debugging tool. But raw serial output is noisy and hard to interpret. Professional firmware uses structured logging: timestamps, labeled values, and machine-parseable formats.

For the firefly capstone, we log:
- **Timestamp** (millis): when each reading was taken
- **Phase values**: the current phase of each firefly oscillator
- **Brightness values**: the PWM output for each LED
- **Order parameter R**: a measure of synchronization (0 = random, 1 = perfect sync)

Outputting comma-separated values (CSV format) lets you paste the data into a spreadsheet or feed it to a Python plotting script.`,
      analogy: "Serial logging is like a flight recorder on an airplane. The plane has no screen for the black box — it just writes timestamped data continuously. After a flight (or a bug), you read back the log to understand what happened. CSV format is the universal language that every analysis tool speaks.",
      storyConnection: "The firefly researchers on Majuli don't just watch the swarm — they record flash timing data with cameras and photodiodes, then analyze the logs to measure synchronization. Our serial log is the Arduino equivalent of their research notebook.",
      checkQuestion: 'Why include a timestamp (millis) in every serial log line instead of just printing values?',
      checkAnswer: 'Without timestamps, you cannot calculate rates, detect timing bugs, or correlate events. If your loop slows down, timestamps reveal the problem. They also let you reconstruct the exact timeline when analyzing logged data after the fact.',
      codeIntro: 'Add structured CSV logging and a sync order parameter to the firefly ring.',
      code: `// Serial Logging with Sync Measurement\n// 6 LEDs + CSV output + order parameter\n\nint pins[] = {2, 3, 4, 5, 6, 7};\nint phase[] = {0, 105, 210, 52, 314, 420};\nint freq[] = {15, 14, 16, 15, 13, 16};\nint coupling = 4;\nint loopCount = 0;\n\nvoid setup() {\n  for (int i = 0; i < 6; i++) {\n    pinMode(pins[i], OUTPUT);\n  }\n  Serial.println("ms,p0,p1,p2,p3,p4,p5,b0,b1,b2,b3,b4,b5");\n}\n\nvoid loop() {\n  for (int i = 0; i < 6; i++) {\n    int left = (i + 5) % 6;\n    int right = (i + 1) % 6;\n    int diff_l = phase[left] - phase[i];\n    int diff_r = phase[right] - phase[i];\n    phase[i] += freq[i] + (coupling * diff_l) / 100 + (coupling * diff_r) / 100;\n    if (phase[i] > 628) phase[i] -= 628;\n    if (phase[i] < 0) phase[i] += 628;\n  }\n\n  int bright[6];\n  for (int i = 0; i < 6; i++) {\n    bright[i] = (phase[i] < 314) ? (255 - phase[i] * 255 / 314) : ((phase[i] - 314) * 255 / 314);\n    if (bright[i] < 0) bright[i] = 0;\n    if (bright[i] > 255) bright[i] = 255;\n    analogWrite(pins[i], bright[i]);\n  }\n\n  if (loopCount % 5 == 0) {\n    Serial.print(loopCount * 50);\n    for (int i = 0; i < 6; i++) {\n      Serial.print(",");\n      Serial.print(phase[i]);\n    }\n    for (int i = 0; i < 6; i++) {\n      Serial.print(",");\n      Serial.print(bright[i]);\n    }\n    Serial.println();\n  }\n\n  loopCount++;\n  delay(50);\n}`,
      ledCount: 6,
      challenge: 'Copy the serial output and paste it into a spreadsheet. Plot the 6 brightness columns over time. You should see the curves converge as coupling pulls phases together.',
      successHint: 'Structured serial logging is how professional embedded developers debug. The CSV header + data pattern works with any analysis tool from Excel to Python matplotlib.',
    },
    {
      title: 'Complete Firefly Capstone: Synchronized Ring',
      concept: `Everything comes together: **6 LEDs in a ring**, Kuramoto coupling, gamma-corrected PWM breathing, staggered startup, and serial logging. This is a complete embedded systems project.

The final sketch combines:
1. **Ring topology** — each LED couples to its two neighbors
2. **Kuramoto synchronization** — phases converge from random to locked
3. **Gamma-corrected brightness** — perceptually smooth fading
4. **Breathing envelope** — organic glow rise and fall
5. **Serial CSV output** — data for analysis and verification

This is the same architecture used in professional LED art installations, stage lighting controllers, and swarm robotics coordination.`,
      storyConnection: "Joon held out his palm and a single firefly landed on it — barely enough light to see his fingers. But together, the whole field was alive, a galaxy of green lights. Your ring captures that moment: six individual sparks, each following simple rules, together creating synchronized beauty.",
      checkQuestion: 'If you wanted to scale this to 100 LEDs, what hardware changes would you need?',
      checkAnswer: 'The Arduino Uno only has 6 PWM pins. For 100 LEDs, you would use WS2812B (NeoPixel) addressable LED strips — one data wire controls all 100 LEDs individually. Or use shift registers (74HC595) for on/off control, or PCA9685 PWM driver boards for 16 channels each.',
      codeIntro: 'The final capstone: full Kuramoto-coupled ring with breathing, gamma, and logging.',
      code: `// === FIREFLY CAPSTONE: Full Synchronized Ring ===\n// 6 LEDs | Kuramoto coupling | gamma | serial log\n\nint pins[] = {2, 3, 4, 5, 6, 7};\nint phase[] = {0, 95, 210, 48, 340, 520};\nint freq[] = {15, 14, 16, 15, 13, 16};\nint coupling = 4;\nint tick = 0;\n\nint gammaLUT[] = {0, 1, 4, 10, 20, 36, 58, 86,\n                  120, 161, 208, 255};\n\nint gammaCorrect(int raw) {\n  int idx = raw / 23;\n  if (idx > 11) idx = 11;\n  if (idx < 0) idx = 0;\n  return gammaLUT[idx];\n}\n\nvoid setup() {\n  for (int i = 0; i < 6; i++) {\n    pinMode(pins[i], OUTPUT);\n  }\n  Serial.println("=== Firefly Capstone ===");\n  for (int i = 0; i < 6; i++) {\n    analogWrite(pins[i], 200);\n    delay(100);\n    analogWrite(pins[i], 0);\n  }\n  Serial.println("Self-test OK");\n  Serial.println("ms,b0,b1,b2,b3,b4,b5");\n}\n\nvoid loop() {\n  for (int i = 0; i < 6; i++) {\n    int left = (i + 5) % 6;\n    int right = (i + 1) % 6;\n    int dl = phase[left] - phase[i];\n    int dr = phase[right] - phase[i];\n    phase[i] += freq[i] + (coupling * dl) / 100 + (coupling * dr) / 100;\n    if (phase[i] > 628) phase[i] -= 628;\n    if (phase[i] < 0) phase[i] += 628;\n  }\n\n  Serial.print(tick * 50);\n  for (int i = 0; i < 6; i++) {\n    int raw;\n    if (phase[i] < 314) {\n      raw = 255 - (phase[i] * 255 / 314);\n    } else {\n      raw = ((phase[i] - 314) * 255 / 314);\n    }\n    if (raw < 0) raw = 0;\n    if (raw > 255) raw = 255;\n    int corrected = gammaCorrect(raw);\n    analogWrite(pins[i], corrected);\n    Serial.print(",");\n    Serial.print(corrected);\n  }\n  Serial.println();\n\n  tick++;\n  delay(50);\n}`,
      ledCount: 6,
      challenge: 'This is a complete embedded project. On real hardware, you would mount 6 green LEDs inside a frosted jar, add an LDR to activate only in darkness, and power from a USB battery pack. Your own Majuli firefly festival on a shelf.',
      successHint: 'You built a complete capstone: circuit design, Kuramoto synchronization, gamma-corrected PWM, serial data logging, and a self-test routine. This is embedded systems engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (LED circuits & synchronization algorithms)</span>
      </div>

      <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-800 dark:text-purple-300">
          This capstone uses a <strong>simulated Arduino</strong> to build a synchronized 6-LED firefly ring with Kuramoto coupling, gamma-corrected PWM, and serial data logging. Edit the code, click "Upload & Run", and watch the virtual LEDs respond.
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
