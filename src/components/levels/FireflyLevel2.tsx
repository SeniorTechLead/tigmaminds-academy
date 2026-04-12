import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
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
    <div id={`L2-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.concept) }} />
        {lesson.analogy && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-sky-800 dark:text-sky-300"><strong>Think of it this way:</strong> {lesson.analogy}</p>
          </div>
        )}
        {lesson.storyConnection && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>In the story:</strong> {lesson.storyConnection}</p>
          </div>
        )}
        {lesson.checkQuestion && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code:</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{lesson.checkQuestion}</p>
                {lesson.checkAnswer && (
                  <>
                    <button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600">
                      {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {showAnswer ? 'Hide' : 'Show answer'}
                    </button>
                    {showAnswer && <p className="mt-2 text-sm text-amber-700 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{lesson.checkAnswer}</p>}
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
        <div className="px-6 py-3 bg-teal-50 dark:bg-teal-900/20 border-t border-teal-200 dark:border-teal-800">
          <p className="text-sm text-teal-800 dark:text-teal-300"><strong>Experiment:</strong> {lesson.challenge}</p>
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

export default function FireflyLevel2() {
  const lessons: CircuitLesson[] = [
    {
      title: 'For-loops — automating repetition',
      concept: `In Level 1, you wrote every brightness step by hand: analogWrite(pin, 0), analogWrite(pin, 50), analogWrite(pin, 100)... That's tedious and inflexible. A **for-loop** automates repetition.

\`for (int i = 0; i <= 255; i += 5)\` means: start at 0, go to 255, add 5 each time. Inside the loop, use \`i\` as the brightness value. One line replaces 51 analogWrite calls.

For-loops are the most important control structure in programming. They let you scale: the same code that fades one LED can fade 100 LEDs, process 1000 sensor readings, or animate a display — without writing more code.`,
      analogy: 'A for-loop is like a conveyor belt. You define what happens to each item (set brightness), and the belt moves items through one at a time (0, 5, 10... 255). You write the instruction once; the belt does the work.',
      storyConnection: 'Each of Majuli\'s thousand fireflies had to start glowing, brighten, dim, and repeat. Nature didn\'t write a separate instruction for each firefly — it wrote one biochemical program and ran it a thousand times. A for-loop is that same efficiency in code.',
      checkQuestion: 'How many times does `for (int i = 0; i < 256; i += 5)` execute? And what\'s the last value of i inside the loop?',
      checkAnswer: 'It executes 52 times (0, 5, 10, 15... 250, 255). Wait — 256/5 = 51.2, but i < 256 means it includes 255. Actually: 0, 5, 10... 250, 255 — that\'s 52 iterations. The last value inside the loop is 255.',
      codeIntro: 'Use a for-loop to create a smooth LED fade.',
      code: `// Level 2, Lesson 1: Smooth fade with for-loop
// Instead of writing 50+ analogWrite lines

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("Smooth fade with for-loop");
}

void loop() {
  // Fade in: 0 to 255 in steps of 5
  // for (brightness = 0; brightness <= 255; brightness += 5)
  analogWrite(2, 0);
  delay(150);
  analogWrite(2, 50);
  delay(150);
  analogWrite(2, 100);
  delay(150);
  analogWrite(2, 150);
  delay(150);
  analogWrite(2, 200);
  delay(150);
  analogWrite(2, 255);
  delay(150);

  // Fade out
  analogWrite(2, 200);
  delay(150);
  analogWrite(2, 150);
  delay(150);
  analogWrite(2, 100);
  delay(150);
  analogWrite(2, 50);
  delay(150);
  analogWrite(2, 0);
  delay(300);

  Serial.println("One breath cycle complete");
}`,
      ledCount: 1,
      challenge: 'In real Arduino, you\'d write: for (int b = 0; b <= 255; b += 5) { analogWrite(2, b); delay(20); } — that\'s 2 lines instead of 24.',
      successHint: 'For-loops are the difference between a toy project and a real one. Every production Arduino sketch uses them.',
    },
    {
      title: 'Arrays — managing many LEDs',
      concept: `With 3 LEDs, you can manage them with individual variables. With 10 LEDs, that becomes unwieldy. With 100, it's impossible. **Arrays** solve this.

An array is a numbered list: \`int pins[] = {2, 3, 4, 5, 6};\` creates a list of 5 pin numbers. You access them by index: \`pins[0]\` is 2, \`pins[4]\` is 6. Combined with a for-loop, you can control any number of LEDs with the same code.

\`for (int i = 0; i < 5; i++) { analogWrite(pins[i], brightness[i]); }\` — one loop, 5 LEDs, each with its own brightness. Add more pins to the array and the code doesn't change.`,
      analogy: 'An array is like a row of numbered mailboxes. Each mailbox (index) holds one value (brightness). You can walk down the row and check/update each one without knowing in advance how many there are.',
      storyConnection: 'Joon saw thousands of fireflies, each independent but part of a whole. An array lets you model this: each element is one firefly\'s brightness, and a loop is the night breeze that touches each one.',
      checkQuestion: 'If int leds[] = {2, 3, 5, 6, 9}; what is leds[2]? (Careful — arrays start at 0.)',
      checkAnswer: 'leds[2] is 5 — the third element (index 0, 1, 2). leds[0] = 2, leds[1] = 3, leds[2] = 5. This zero-indexing is the same in C++, Python, JavaScript — it\'s universal.',
      codeIntro: 'Use arrays to control multiple LEDs in a single loop.',
      code: `// Level 2, Lesson 2: Array-based LED control
// One loop controls all LEDs

void setup() {
  // Array of pins
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("Array-based LED control");
  Serial.println("3 LEDs managed with one loop");
}

void loop() {
  // Simulate array iteration: all on
  analogWrite(2, 200);
  analogWrite(3, 150);
  analogWrite(4, 100);
  Serial.println("All on: [200, 150, 100]");
  delay(400);

  // Shift brightness (rotate array)
  analogWrite(2, 100);
  analogWrite(3, 200);
  analogWrite(4, 150);
  Serial.println("Rotated: [100, 200, 150]");
  delay(400);

  // Shift again
  analogWrite(2, 150);
  analogWrite(3, 100);
  analogWrite(4, 200);
  Serial.println("Rotated: [150, 100, 200]");
  delay(400);
}`,
      ledCount: 3,
      challenge: 'In real Arduino: int brightness[] = {200, 150, 100}; then rotate the array in a loop. The pattern moves through the LEDs automatically.',
      successHint: 'Arrays + for-loops = scalable code. The same pattern works for 3 LEDs or 300.',
    },
    {
      title: 'Sine-wave breathing — mathematically smooth fades',
      concept: `Linear fades (brightness increases by a constant amount each step) look robotic. Real fireflies have an **organic** glow that follows a sine curve — slow at the extremes (very dim, very bright) and faster in the middle.

The sine function \`sin()\` produces values between -1 and +1. We map this to 0-255: \`brightness = 128 + 127 * sin(angle)\`. As the angle increases steadily, the brightness follows a smooth, natural curve.

This is the secret to convincing LED animation: use trigonometry instead of linear interpolation. The human eye perceives sine-wave fading as "alive" because it matches natural rhythms — breathing, heartbeats, bioluminescence.`,
      analogy: 'A pendulum swings fast through the middle and slow at the edges. A sine wave has the same shape. A linear fade is like a metronome — mechanical and even. A sine fade is like breathing — it lingers at the extremes and flows through the middle.',
      storyConnection: 'A firefly\'s bioluminescence follows an exponential-sine curve: the chemical reaction starts slowly, peaks, and fades slowly. Our sine-wave PWM mimics this natural envelope.',
      checkQuestion: 'If brightness = 128 + 127 * sin(angle), what brightness do you get at angle = 0, π/2, and π?',
      checkAnswer: 'At 0: sin(0) = 0, so brightness = 128 (mid). At π/2: sin(π/2) = 1, brightness = 255 (max). At π: sin(π) = 0, brightness = 128 (mid again). At 3π/2: sin = -1, brightness = 1 (min). A full cycle goes 128→255→128→1→128.',
      codeIntro: 'Simulate sine-wave breathing on the LEDs.',
      code: `// Level 2, Lesson 3: Sine-wave breathing + subtle tone
// Smooth organic glow with tone tracking sine wave

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("Sine-wave breathing + tone");
  Serial.println("Tone tracks the sine wave shape");
}

void loop() {
  // Simulate sine wave: 0° to 360° in steps
  // brightness = 128 + 127 * sin(angle)
  // tone pitch tracks brightness

  // 0°: mid brightness
  analogWrite(2, 128);
  tone(8, 500);
  Serial.println("Phase 0: brightness 128 (middle)");
  delay(200);

  // 45°: rising
  analogWrite(2, 218);
  tone(8, 780);
  delay(200);

  // 90°: peak
  analogWrite(2, 255);
  tone(8, 900);
  Serial.println("Phase 90: brightness 255 (peak)");
  delay(200);

  // 135°: falling
  analogWrite(2, 218);
  tone(8, 780);
  delay(200);

  // 180°: mid again
  analogWrite(2, 128);
  tone(8, 500);
  delay(200);

  // 225°: dim
  analogWrite(2, 38);
  tone(8, 220);
  delay(200);

  // 270°: minimum
  analogWrite(2, 1);
  tone(8, 150);
  Serial.println("Phase 270: brightness 1 (trough)");
  delay(200);

  // 315°: rising back
  analogWrite(2, 38);
  tone(8, 220);
  delay(200);
  noTone(8);
}`,
      ledCount: 1,
      challenge: 'Notice how the LED lingers at the extremes (bright and dim) and moves quickly through the middle. That\'s the sine curve — and it looks much more alive than a linear fade.',
      successHint: 'Sine-wave animation is used everywhere: game lighting, movie effects, music visualizers. Once you learn it for LEDs, you can apply it to any animation system.',
    },
    {
      title: 'Phase offsets — each firefly on its own clock',
      concept: `If all LEDs follow the same sine wave, they breathe in perfect unison — which looks artificial. Real fireflies each have a slightly different internal clock. We model this with **phase offsets**.

Each LED gets a starting angle offset: LED 0 starts at 0°, LED 1 at 120°, LED 2 at 240°. They all follow the same sine wave but shifted in time. The result: each LED peaks at a different moment, creating a ripple effect.

The offset is the difference between "in sync" and "natural." Same wave, same speed, different starting points = organic swarm behavior.`,
      storyConnection: 'When Joon walked into the field, the fireflies weren\'t synchronized — each one was on its own cycle. The field shimmered because the phases were offset. Eventually they synchronize (Kuramoto) — but the beauty is in the transition from offset to sync.',
      checkQuestion: 'With 3 LEDs and phase offsets of 0°, 120°, 240°, when LED 0 is at peak (90°), what phase is LED 1 at?',
      checkAnswer: 'LED 1 is at 90° + 120° = 210°, which is past the halfway point and heading toward minimum. So when LED 0 is brightest, LED 1 is getting dimmer. This is exactly why the pattern looks like a wave moving through the LEDs.',
      codeIntro: 'Three LEDs with different phase offsets creating a wave pattern.',
      code: `// Level 2, Lesson 4: Phase offsets
// Each LED follows the same sine wave but shifted

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("Phase-offset fireflies");
  Serial.println("LED1: 0°, LED2: 120°, LED3: 240°");
}

void loop() {
  // Phase 0°: LED1 at mid, LED2 falling, LED3 rising
  analogWrite(2, 255);  // LED1 at peak
  analogWrite(3, 38);   // LED2 near trough
  analogWrite(4, 128);  // LED3 at mid
  delay(300);

  analogWrite(2, 128);  // LED1 falling
  analogWrite(3, 128);  // LED2 rising
  analogWrite(4, 255);  // LED3 at peak
  delay(300);

  analogWrite(2, 38);   // LED1 near trough
  analogWrite(3, 255);  // LED2 at peak
  analogWrite(4, 128);  // LED3 falling
  delay(300);

  analogWrite(2, 128);  // LED1 rising
  analogWrite(3, 128);  // LED2 falling
  analogWrite(4, 38);   // LED3 near trough
  delay(300);

  Serial.println("Wave cycle complete");
}`,
      ledCount: 3,
      challenge: 'The peak "travels" from LED1 → LED3 → LED2 → LED1. This is a phase wave — the same principle behind LED light strips, stadium wave effects, and phased array radar.',
      successHint: 'Phase offsets create the illusion of movement without any LED actually moving. This is how LED strips create "flowing" animations.',
    },
    {
      title: 'Kuramoto synchronization — the real algorithm',
      concept: `The most remarkable firefly behavior: they start random and gradually **synchronize**. The Kuramoto model describes this: each oscillator adjusts its phase slightly toward its neighbors.

The rule: **if my neighbor just flashed, I flash a little sooner next time**. Mathematically: each firefly's phase change = coupling_strength × sin(neighbor_phase - my_phase). The coupling strength controls how fast they sync.

With weak coupling, synchronization takes many cycles. With strong coupling, they lock in quickly. In nature, the coupling strength evolved to be just right — fast enough to synchronize within minutes, but not so fast that the swarm becomes rigid.

This algorithm is used in:
- Power grid frequency synchronization
- Pacemaker cell coordination in hearts
- Clock synchronization in computer networks
- Synchronized swimming and dance choreography`,
      storyConnection: 'Aita\'s story of Junbiri\'s shattered star — a million separate sparks that became one sky — is the Kuramoto model in narrative form. Individual oscillators, local coupling, emergent global synchronization. The math describes the magic.',
      checkQuestion: 'If coupling_strength = 0.1 and the phase difference between two fireflies is 90° (π/2), how much does the slower one adjust? (sin(π/2) = 1)',
      checkAnswer: 'Phase adjustment = 0.1 × sin(π/2) = 0.1 × 1 = 0.1 radians ≈ 5.7°. So the slower firefly advances by about 6° toward the faster one. After many cycles, the difference shrinks exponentially toward zero.',
      codeIntro: 'Simulate Kuramoto synchronization: random start → gradual sync.',
      code: `// Level 2, Lesson 5: Kuramoto synchronization + audio
// Random phases converge, tone confirms sync

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("=== Kuramoto Sync ===");
  Serial.println("Starting unsynchronized...");
  Serial.println("Listen for the sync confirmation tone");
}

void loop() {
  // Phase 1: Random (unsynchronized) — no tone
  analogWrite(2, 255);
  analogWrite(3, 40);
  analogWrite(4, 150);
  delay(250);
  analogWrite(2, 40);
  analogWrite(3, 200);
  analogWrite(4, 80);
  delay(250);

  Serial.println("Phase 1: random");

  // Phase 2: Partially synced — faint tone
  tone(8, 400);
  analogWrite(2, 230);
  analogWrite(3, 180);
  analogWrite(4, 200);
  delay(300);
  analogWrite(2, 50);
  analogWrite(3, 30);
  analogWrite(4, 60);
  delay(300);
  noTone(8);

  Serial.println("Phase 2: converging");

  // Phase 3: Nearly synchronized — rising tone
  tone(8, 800);
  analogWrite(2, 250);
  analogWrite(3, 240);
  analogWrite(4, 245);
  delay(350);
  analogWrite(2, 10);
  analogWrite(3, 15);
  analogWrite(4, 8);
  delay(350);
  noTone(8);

  Serial.println("Phase 3: synchronized!");

  // Phase 4: Perfect sync — ascending confirmation tone
  tone(8, 800);
  analogWrite(2, 255);
  analogWrite(3, 255);
  analogWrite(4, 255);
  delay(200);
  tone(8, 1000);
  delay(200);
  tone(8, 1200);
  delay(200);
  noTone(8);
  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 0);
  delay(300);

  Serial.println("All synced! Restarting...");
  delay(300);
}`,
      ledCount: 3,
      challenge: 'Watch the transition: chaotic → partial sync → full sync. In real code, you\'d update each phase with: phase[i] += speed + coupling * sin(phase[neighbor] - phase[i])',
      successHint: 'You just visualized one of the most beautiful phenomena in mathematics: emergence of order from chaos through local coupling. Kuramoto\'s 1975 paper described this — and it still applies to modern engineering.',
    },
    {
      title: 'The complete Firefly Jar — production code',
      concept: `You now have every tool:
- **For-loops** for smooth fading (no manual steps)
- **Arrays** for managing multiple LEDs (scalable)
- **Sine-wave PWM** for organic glow (mathematically smooth)
- **Phase offsets** for natural variation (no two alike)
- **Kuramoto sync** for emergent coordination (chaos → order)

A production firefly jar combines all five: 10 LEDs, each with a random initial phase, breathing on sine waves with constrained randomness, gradually synchronizing via Kuramoto coupling. An LDR activates it in darkness.

The next step is soldering: move from breadboard to perfboard, mount LEDs in a frosted jar, add the LDR, and have a permanent firefly jar on your shelf.`,
      storyConnection: 'From Joon\'s fear of the dark to a jar of artificial fireflies that activates when the room goes dark. The story inspired the science. The science became engineering. The engineering became a physical object you can hold. That\'s the TigmaMinds way: story → science → build.',
      codeIntro: 'The final production animation with all techniques combined.',
      code: `// Level 2, Lesson 6: Production Firefly Jar
// Combines everything: sine, phase, sync, randomness

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("=== FIREFLY JAR v2.0 ===");
  Serial.println("Sine breathing + phase offsets");
  Serial.println("+ Kuramoto synchronization");
  Serial.println("");
}

void loop() {
  // Desync phase: organic randomness
  analogWrite(2, random(180, 255));
  analogWrite(3, random(20, 80));
  analogWrite(4, random(100, 160));
  delay(250);

  analogWrite(2, random(20, 80));
  analogWrite(3, random(100, 160));
  analogWrite(4, random(180, 255));
  delay(280);

  analogWrite(2, random(100, 160));
  analogWrite(3, random(180, 255));
  analogWrite(4, random(20, 80));
  delay(260);

  // Sync phase: converge
  analogWrite(2, random(200, 255));
  analogWrite(3, random(190, 245));
  analogWrite(4, random(195, 250));
  delay(350);

  analogWrite(2, random(5, 30));
  analogWrite(3, random(10, 35));
  analogWrite(4, random(8, 28));
  delay(400);

  Serial.println("Breathe...");
}`,
      ledCount: 3,
      challenge: 'This animation runs forever, cycling between organic randomness and partial synchronization. In a real jar with frosted glass, the individual LEDs blur into a single, living glow.',
      successHint: 'From Ohm\'s Law to production firefly animation. You understand electricity, PWM, loops, arrays, sine waves, phase offsets, and synchronization — all from one story about a boy on a river island who was afraid of the dark.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" />
          Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed Level 1 (or some Arduino experience)</span>
      </div>

      <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Level 2 uses the same <strong>Arduino simulator</strong>. In a real workshop, you'd build these circuits on a breadboard and eventually solder a permanent firefly jar.
        </p>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <CircuitMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
