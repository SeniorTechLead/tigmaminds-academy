import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import ArduinoPlayground from '../ArduinoPlayground';

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

function renderMd(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-300 text-xs font-mono">$1</code>');
}

function CircuitMiniLesson({ lesson, number }: { lesson: CircuitLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L1-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMd(lesson.concept) }} />

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

export default function FireflyLevel1() {
  const lessons: CircuitLesson[] = [
    {
      title: 'Electricity — the invisible river',
      concept: `Before you can build a glowing firefly jar, you need to understand what powers it: **electricity**. Electricity is the flow of tiny charged particles called **electrons** through a material (like a wire). It's invisible, but it follows simple rules.

Three key quantities:
- **Voltage** (V) — the "push" that drives electrons. Measured in volts. An Arduino provides 5V.
- **Current** (I) — how many electrons flow per second. Measured in amps (A) or milliamps (mA).
- **Resistance** (R) — how hard it is for electrons to flow. Measured in ohms (Ω).

**Ohm's Law** ties them together: **V = I × R**. If you know any two, you can calculate the third. This single formula is the foundation of all circuit design.`,
      analogy: 'Electricity is like water flowing through a pipe. Voltage is the water pressure (how hard it pushes). Current is how much water flows per second. Resistance is the pipe width — a narrow pipe (high resistance) lets less water through. Ohm\'s Law says: pressure = flow × narrowness.',
      storyConnection: 'When Junbiri\'s star shattered into a million fireflies, each one needed energy to glow. In the real world, bioluminescence runs on chemical energy — luciferin + oxygen → light. In our circuit, electricity provides that energy. The LED is our artificial luciferin.',
      checkQuestion: 'An Arduino provides 5V. An LED needs about 20mA (0.02A) of current. Using Ohm\'s Law (R = V/I), what resistance should the resistor be?',
      checkAnswer: 'R = 5V / 0.02A = 250Ω. In practice, we use 220Ω (the nearest standard value) — slightly less resistance means slightly more current, which is fine for an LED. Too little resistance = too much current = dead LED.',
      codeIntro: 'Turn on a single LED using digitalWrite — the simplest possible circuit.',
      code: `// Lesson 1: Turn on an LED
// Pin 2 is connected to an LED through a 220Ω resistor

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("LED circuit ready!");
  Serial.println("Voltage: 5V");
  Serial.println("Resistor: 220 ohms");
  Serial.println("Current: ~23mA");
}

void loop() {
  digitalWrite(2, HIGH);  // LED ON (255)
  delay(1000);
  digitalWrite(2, LOW);   // LED OFF (0)
  delay(1000);
}`,
      ledCount: 1,
      challenge: 'Change the delay values: try delay(200) for fast blinking, delay(2000) for slow. The LED turns on/off at the rate you set.',
      successHint: 'You just controlled an LED with code. digitalWrite() is binary: ON or OFF, nothing in between. The next lesson introduces analogWrite() for smooth brightness control — like a real firefly.',
    },
    {
      title: 'PWM — smooth brightness, not just on/off',
      concept: `A real firefly doesn't flash like a strobe light — it **glows**, smoothly fading from dim to bright and back. To recreate this, we need brightness control between 0% and 100%.

**PWM** (Pulse Width Modulation) achieves this by rapidly switching the LED on and off — so fast your eye can't see the flickering. If the LED is on 50% of the time, it appears half-bright. On 10% of the time = very dim. On 90% = nearly full brightness.

In Arduino, \`analogWrite(pin, value)\` takes a value from **0** (always off) to **255** (always on). 128 = 50% brightness. This is how we'll make our LED breathe like a firefly — smoothly ramping the value up and down.`,
      analogy: 'Imagine flicking a light switch on and off 1000 times per second. If it\'s on half the time, the room looks 50% bright — your eyes can\'t follow the rapid switching. PWM is exactly this trick: fast switching that creates the illusion of dimming.',
      storyConnection: 'A firefly\'s glow is chemically smooth — luciferin oxidizes gradually, producing light that rises and falls organically. Our PWM mimics this: the LED switches too fast to see individual flashes, creating what appears to be a smooth, living glow. Almost 100% energy efficient — just like the real thing.',
      checkQuestion: 'If analogWrite(pin, 64) means 25% brightness, and analogWrite(pin, 191) means 75%, what does analogWrite(pin, 0) look like?',
      checkAnswer: 'Completely off. 0/255 = 0% duty cycle. The LED never turns on. analogWrite(pin, 255) = fully on, 100% duty cycle. The range 0-255 gives you 256 brightness levels.',
      codeIntro: 'Make an LED fade smoothly from off to full brightness and back — like breathing.',
      code: `// Lesson 2: Firefly breathing with PWM
// analogWrite(pin, 0-255) controls brightness

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("Firefly breathing started");
}

void loop() {
  // Fade in: 0 -> 255
  analogWrite(2, 0);
  delay(200);
  analogWrite(2, 50);
  delay(200);
  analogWrite(2, 100);
  delay(200);
  analogWrite(2, 180);
  delay(200);
  analogWrite(2, 255);
  delay(200);

  // Fade out: 255 -> 0
  analogWrite(2, 180);
  delay(200);
  analogWrite(2, 100);
  delay(200);
  analogWrite(2, 50);
  delay(200);
  analogWrite(2, 0);
  delay(400);
}`,
      ledCount: 1,
      challenge: 'Add more intermediate steps for a smoother fade. Try steps of 25 instead of 50-80. More steps = smoother glow, but more code.',
      successHint: 'The LED now breathes like a firefly. In a real Arduino project, you\'d use a for-loop to generate the steps automatically — that\'s the next lesson.',
    },
    {
      title: 'Multiple LEDs — a firefly swarm',
      concept: `One firefly is pretty. A thousand are magical. To create a swarm, we wire **multiple LEDs** — each on its own pin, each blinking independently. In the story, Joon saw hundreds of fireflies, each with its own rhythm.

In a circuit, multiple LEDs can be wired in **parallel** — each gets its own connection to the Arduino, its own resistor, and its own pin. This means you can control each one independently: LED 1 fading in while LED 2 is at full brightness while LED 3 is off.

The Arduino Uno has 6 PWM pins (3, 5, 6, 9, 10, 11) — so you can individually control up to 6 LED brightness levels simultaneously. With shift registers, you can control hundreds.`,
      analogy: 'Parallel LEDs are like houses on a street — each has its own connection to the power line. Turning off one house doesn\'t affect the others. Each LED is independent, with its own resistor acting as a "fuse" to protect it.',
      storyConnection: 'When Joon walked into the field, the fireflies were all blinking at different rates — some fast, some slow, some bright, some dim. They were independent but shared the same darkness. Our parallel LEDs do the same: independent brightness, shared power supply.',
      checkQuestion: 'If each LED needs 20mA and you wire 5 LEDs in parallel, how much total current does the Arduino need to supply?',
      checkAnswer: '5 × 20mA = 100mA total. The Arduino Uno can supply up to 200mA from its 5V pin, so 5 LEDs is fine. 10 LEDs (200mA) would be the limit — beyond that you need an external power supply.',
      codeIntro: 'Control 3 LEDs independently, each at a different brightness.',
      code: `// Lesson 3: Multiple fireflies
// 3 LEDs on pins 2, 3, 4 — each independent

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("3 fireflies ready!");
}

void loop() {
  // Firefly 1: bright
  analogWrite(2, 255);
  // Firefly 2: dim
  analogWrite(3, 60);
  // Firefly 3: off
  analogWrite(4, 0);
  delay(500);

  // Shift: 1 dims, 2 brightens, 3 starts glowing
  analogWrite(2, 60);
  analogWrite(3, 255);
  analogWrite(4, 60);
  delay(500);

  // Shift again
  analogWrite(2, 0);
  analogWrite(3, 60);
  analogWrite(4, 255);
  delay(500);
}`,
      ledCount: 3,
      challenge: 'Change the pattern: make all 3 blink together, then try a "chase" where the bright LED moves left to right. Each pattern creates a different visual mood.',
      successHint: 'Three independent LEDs with different rhythms already looks like a tiny firefly swarm. The next lesson adds randomness — because real fireflies don\'t blink in perfect patterns.',
    },
    {
      title: 'Randomness — nature doesn\'t repeat',
      concept: `Fireflies don't blink like a metronome — each one has a slightly different rhythm, and the timing varies naturally. To make our LED swarm look alive, we need **randomness**.

Arduino has a \`random(min, max)\` function that generates a random integer. We can use it for:
- Random brightness: \`random(50, 255)\`
- Random timing: \`delay(random(100, 800))\`
- Random pin selection: choose which LED to light next

The key to convincing organic animation: **constrained randomness**. Pure random looks chaotic. A firefly-like glow needs randomness *within bounds* — never too fast, never too dim, but always slightly different each cycle.`,
      analogy: 'A jazz musician doesn\'t play random notes — they improvise within a structure (key, rhythm, chord progression). The randomness is constrained by musical rules. Our LED randomness is the same: vary within a range that still looks like fireflies, not a broken string of Christmas lights.',
      storyConnection: 'Each of the thousand fireflies on Majuli had its own internal clock — slightly different from every other. That\'s why the field pulsed and shimmered rather than flashing in unison. The randomness IS the beauty.',
      checkQuestion: 'If you write random(100, 500) in a delay(), what\'s the shortest possible pause? The longest?',
      checkAnswer: 'Shortest: 100ms. Longest: 499ms (random returns a value from min up to max-1). So the timing varies by up to 5x — enough to look organic but not chaotic.',
      codeIntro: 'Add randomized brightness and timing to create an organic firefly effect.',
      code: `// Lesson 4: Randomized firefly swarm
// Each LED gets random brightness and timing

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("Random firefly swarm");
}

void loop() {
  // Each firefly gets a random brightness
  analogWrite(2, random(0, 255));
  analogWrite(3, random(0, 255));
  analogWrite(4, random(0, 255));
  delay(random(150, 500));

  // Sometimes one goes dark
  analogWrite(random(2, 5), 0);
  delay(random(100, 300));
}`,
      ledCount: 3,
      challenge: 'Constrain the randomness more: use random(80, 200) instead of random(0, 255). Now the LEDs are never fully off or fully bright — more like real fireflies that always glow faintly.',
      successHint: 'Constrained randomness is how nature works — and how game designers, animators, and generative artists create organic-looking patterns. You just learned a principle that applies far beyond LEDs.',
    },
    {
      title: 'Synchronization — how fireflies coordinate',
      concept: `Here's the most remarkable thing about real fireflies: over time, they **synchronize**. Individual fireflies start blinking randomly, but gradually adjust their timing to match their neighbors. After a few minutes, entire trees flash in unison.

This is called the **Kuramoto model** — each oscillator (firefly) slightly adjusts its phase toward its neighbors. The rule is simple: "if my neighbor just flashed, flash a little sooner next time." Repeated over many cycles, this converges to synchronization.

Scientists study this because the same math applies to:
- Heart cells synchronizing to beat together
- Neurons synchronizing in brain waves
- Power grid generators staying in phase
- Wireless network protocols syncing clocks`,
      analogy: 'Imagine a room full of people clapping randomly. If each person tries to clap at the same time as the person next to them, the whole room gradually converges to clapping in unison. No conductor, no central clock — just local adjustments. That\'s the Kuramoto model.',
      storyConnection: 'Aita told Joon that Junbiri\'s shattered star became a million fireflies — each a separate spark. But together, they turned the island into a sky. The synchronization is what makes them transcend individual sparks into something collective and beautiful.',
      checkQuestion: 'If firefly A flashes every 1.0 seconds and firefly B flashes every 0.9 seconds, and B adjusts 10% toward A\'s timing each cycle, how many cycles until they\'re nearly synchronized?',
      checkAnswer: 'B\'s period: 0.9, then 0.91, 0.919, 0.927... After about 7-8 cycles, they\'re within 1% of each other. The Kuramoto model converges exponentially — fast at first, then fine-tuning. Real firefly swarms synchronize in about 5-10 minutes.',
      codeIntro: 'Simulate fireflies that gradually synchronize their blinking.',
      code: `// Lesson 5: Firefly synchronization
// LEDs start random, gradually sync up

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("Synchronization starting...");
  Serial.println("Watch the LEDs converge!");
}

void loop() {
  // Phase 1: Random (unsynchronized)
  analogWrite(2, 255);
  analogWrite(3, 0);
  analogWrite(4, 128);
  delay(300);

  analogWrite(2, 0);
  analogWrite(3, 255);
  analogWrite(4, 0);
  delay(400);

  analogWrite(2, 128);
  analogWrite(3, 0);
  analogWrite(4, 255);
  delay(350);

  // Phase 2: Partially synced
  analogWrite(2, 255);
  analogWrite(3, 200);
  analogWrite(4, 128);
  delay(300);

  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 50);
  delay(300);

  // Phase 3: Nearly synchronized
  analogWrite(2, 255);
  analogWrite(3, 255);
  analogWrite(4, 230);
  delay(300);

  analogWrite(2, 0);
  analogWrite(3, 0);
  analogWrite(4, 0);
  delay(400);

  Serial.println("Synced!");
}`,
      ledCount: 3,
      challenge: 'The simulation above is scripted. A real Kuramoto simulation would calculate phase adjustments dynamically. In Level 2, you\'ll implement the actual algorithm.',
      successHint: 'You\'ve seen the most beautiful phenomenon in nature: emergence. Simple rules (adjust toward neighbors) creating complex behavior (synchronization). This principle appears everywhere — from biology to engineering.',
    },
    {
      title: 'The complete Firefly Jar — putting it all together',
      concept: `You now have every ingredient:
- **Electricity and Ohm's Law** — powering LEDs safely
- **PWM** — smooth brightness control
- **Multiple LEDs** — independent parallel circuits
- **Randomness** — organic, natural-looking animation
- **Synchronization** — the Kuramoto model for collective behavior

In a real project, you'd solder these onto a circuit board, mount the LEDs inside a glass jar with diffusion paper to soften the light, and add a **light sensor (LDR)** so the jar only activates in darkness — just like real fireflies that emerge at dusk.

Level 2 dives deeper into the Arduino programming: for-loops for smooth fades, arrays for managing many LEDs, and the actual Kuramoto synchronization algorithm in C++.`,
      storyConnection: 'Joon held out his palm and a single firefly landed on it. Its glow was barely enough to see his own fingers. But together, the whole field was alive — a galaxy of green lights. Your jar captures that moment: individual LEDs, each a tiny spark, together creating something magical.',
      checkQuestion: 'A light-dependent resistor (LDR) reads low values in darkness and high values in bright light. How would you use it to make the jar activate only at night?',
      checkAnswer: 'Read the LDR with analogRead(). If the value is below a threshold (e.g., 200 out of 1023), it\'s dark — run the firefly animation. If above threshold, turn all LEDs off. That\'s one if-statement: if (analogRead(ldrPin) < 200) { animate(); } else { allOff(); }',
      codeIntro: 'The final animation combining everything: breathing, randomness, and coordination.',
      code: `// Lesson 6: Complete Firefly Jar
// 3 LEDs with organic breathing pattern

void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("=== Firefly Jar ===");
  Serial.println("3 LEDs, organic glow");
  Serial.println("Ambient light sensor: simulated dark");
}

void loop() {
  // Gentle random glow
  analogWrite(2, random(100, 200));
  analogWrite(3, random(40, 120));
  analogWrite(4, random(0, 80));
  delay(300);

  // Shift brightness
  analogWrite(2, random(40, 120));
  analogWrite(3, random(100, 200));
  analogWrite(4, random(40, 120));
  delay(350);

  // All glow together (partial sync)
  analogWrite(2, random(150, 255));
  analogWrite(3, random(130, 230));
  analogWrite(4, random(140, 240));
  delay(400);

  // Dim together (sync breathing out)
  analogWrite(2, random(10, 50));
  analogWrite(3, random(5, 40));
  analogWrite(4, random(15, 60));
  delay(500);
}`,
      ledCount: 3,
      challenge: 'This is the pattern you\'d load onto a real Arduino. The green LEDs inside a frosted jar, glowing in the dark — your own Majuli firefly festival on a shelf.',
      successHint: 'From "what is voltage?" to a working firefly jar animation. You understand electricity, PWM, parallel circuits, randomness, and synchronization — all from one story about a boy on a river island.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No electronics experience needed</span>
      </div>

      <div className="mb-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
        <p className="text-sm text-teal-800 dark:text-teal-300">
          These exercises use a <strong>simulated Arduino</strong>. Edit the code, click "Upload & Run", and watch the virtual LEDs respond. In Level 2, you'll build the real circuit on a breadboard.
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
