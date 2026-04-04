import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import ArduinoPlayground from '../ArduinoPlayground';
import { renderMarkdown } from '../MiniLesson';

interface SonarLesson {
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


function SonarMiniLesson({ lesson, number }: { lesson: SonarLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L1-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
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
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code — think about this:</p>
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
        <ArduinoPlayground starterCode={lesson.code} title={`Sonar ${number}`} ledCount={lesson.ledCount || 1} />
      </div>
      {lesson.challenge && (
        <div className="px-6 py-3 bg-sky-50 dark:bg-sky-900/20 border-t border-sky-200 dark:border-sky-800">
          <p className="text-sm text-sky-800 dark:text-sky-300"><strong>Experiment:</strong> {lesson.challenge}</p>
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

export default function DolphinLevel1() {
  const lessons: SonarLesson[] = [
    {
      title: 'Sound travels — and bounces back',
      concept: `The Gangetic river dolphin navigates murky water using **echolocation**: it sends out a click and listens for the echo. The time between click and echo tells it how far away objects are.

This is the same principle behind **sonar** (used by submarines), **ultrasonic sensors** (used by robots and cars), and **medical ultrasound** (used to image organs and babies).

The math is simple: **distance = speed × time / 2**. We divide by 2 because the sound travels to the object AND back. Sound travels at about **343 meters per second** in air (1,500 m/s in water). So if an echo returns in 0.01 seconds, the object is 343 × 0.01 / 2 = **1.7 meters** away.`,
      analogy: 'Shout in a canyon. If your echo comes back in 2 seconds, the canyon wall is about 343m away (343 m/s × 2s / 2 = 343m). A shorter echo delay = closer wall. The dolphin does this thousands of times per second, building a sound-picture of its world.',
      storyConnection: 'Nabajit\'s father said "Follow the dolphin. She knows where the deep channel is." The dolphin was mapping the river bottom with sonar — clicking, listening, building a mental model of every sandbar and channel. The HC-SR04 sensor does the same thing in air.',
      checkQuestion: 'An ultrasonic sensor sends a pulse and the echo returns in 0.006 seconds. Sound speed is 343 m/s. How far is the object?',
      checkAnswer: 'Distance = 343 × 0.006 / 2 = 1.029 meters ≈ 103 cm. The sensor measured about 1 meter. In Arduino code, we use microseconds (6000 μs) and centimeters: distance_cm = duration_μs × 0.0343 / 2.',
      codeIntro: 'Simulate a sonar distance reading and display it on the serial monitor.',
      code: `// Lesson 1: Basic distance measurement
// HC-SR04 sensor: trigger on pin 2, echo on pin 3

void setup() {
  pinMode(2, OUTPUT);  // Trigger pin
  pinMode(3, INPUT);   // Echo pin
  Serial.println("=== Sonar Range Finder ===");
  Serial.println("Speed of sound: 343 m/s");
  Serial.println("");
}

void loop() {
  // Ping and measure
  Serial.println("Ping! Measuring...");
  Serial.println("Echo time: 1450 microseconds");
  Serial.println("Distance: 24.9 cm");
  analogWrite(2, 200);
  delay(500);

  Serial.println("");
  Serial.println("Ping! Measuring...");
  Serial.println("Echo time: 5830 microseconds");
  Serial.println("Distance: 100.0 cm");
  analogWrite(2, 60);
  delay(500);

  Serial.println("");
  Serial.println("Ping! Measuring...");
  Serial.println("Echo time: 580 microseconds");
  Serial.println("Distance: 9.9 cm — CLOSE!");
  analogWrite(2, 255);
  delay(500);

  analogWrite(2, 0);
  delay(300);
}`,
      ledCount: 1,
      challenge: 'Change the echo time to 3000 microseconds. What distance does that give? (3000 × 0.0343 / 2 = 51.5 cm)',
      successHint: 'One formula — distance = speed × time / 2 — is all you need. The sensor handles the physics; your code does the math.',
    },
    {
      title: 'Proximity alert — using distance to trigger actions',
      concept: `Measuring distance is useful. But acting on it is powerful. A **proximity alert** uses the distance reading to trigger an action: if something is closer than a threshold, do something.

Real applications:
- **Parking sensors**: beep faster as you approach the wall
- **Automatic doors**: open when someone approaches
- **Robots**: stop or turn when obstacle is detected
- **Anti-poaching systems**: alert when large animals approach a fence

The pattern is always the same: measure → compare to threshold → act.`,
      analogy: 'It\'s like a night guard with a flashlight. They sweep the area (measure), check if anything is within range (compare), and sound the alarm if needed (act). The sensor sweeps with sound instead of light.',
      storyConnection: 'When Nabajit and his father followed the dolphin through fog, they were navigating by sound proximity. The dolphin\'s clicks detected the deep channel — and the sandbar to avoid. Our proximity alert is the same principle: measure, decide, act.',
      checkQuestion: 'A parking sensor beeps every 500ms when an object is 100cm away, and every 100ms when it\'s 20cm away. How would you calculate the beep interval from distance?',
      checkAnswer: 'Linear mapping: interval = distance × 5 (in ms). At 100cm: 500ms. At 20cm: 100ms. At 0cm: 0ms (continuous beep). Real parking sensors use a formula like this — the beep rate communicates distance through sound.',
      codeIntro: 'Build a 3-zone proximity alert: safe (green LED), warning (medium), danger (bright).',
      code: `// Lesson 2: Proximity alert with LED indicator
// LED brightness indicates distance

void setup() {
  pinMode(2, OUTPUT);  // Alert LED
  Serial.println("=== Proximity Alert ===");
  Serial.println("Green LED: brightness = closeness");
  Serial.println("");
}

void loop() {
  // Simulate decreasing distance
  Serial.println("Distance: 80 cm — Safe");
  analogWrite(2, 30);
  delay(400);

  Serial.println("Distance: 50 cm — Approaching");
  analogWrite(2, 100);
  delay(400);

  Serial.println("Distance: 25 cm — Warning!");
  analogWrite(2, 180);
  delay(400);

  Serial.println("Distance: 10 cm — DANGER!");
  analogWrite(2, 255);
  delay(400);

  Serial.println("Distance: 5 cm — TOO CLOSE!");
  analogWrite(2, 255);
  delay(200);
  analogWrite(2, 0);
  delay(200);

  Serial.println("");
  analogWrite(2, 0);
  delay(500);
}`,
      ledCount: 1,
      challenge: 'The LED blinks at 5cm (danger zone). In a real circuit, you\'d add a buzzer that beeps faster as distance decreases — same PWM principle as the LED.',
      successHint: 'Measure → threshold → action. This pattern is everywhere: thermostats, smoke detectors, airbags, self-driving cars. The sensor changes, the formula changes, but the logic is identical.',
    },
    {
      title: 'Scanning — building a picture from echoes',
      concept: `The dolphin doesn't just measure distance to one point — it sweeps its head side to side, clicking rapidly, building a **3D map** of the river. Each click gives one distance reading. Hundreds of clicks per second, aimed in different directions, create a complete picture.

We can do the same by mounting the ultrasonic sensor on a **servo motor** — a small motor that rotates to precise angles. The Arduino tells the servo to rotate 1°, take a reading, rotate 1° more, read again... sweeping from 0° to 180° and back. The result: an array of (angle, distance) pairs that form a **radar sweep**.

This is literally how submarine sonar works. And how LiDAR in self-driving cars works — just with light instead of sound, and 360° instead of 180°.`,
      analogy: 'Imagine standing blindfolded in a room, holding a tape measure. You extend it straight ahead and note the distance. Turn 10° left, measure again. Keep turning and measuring until you\'ve covered 180°. Now you have a rough map of the room — that\'s a sonar scan.',
      storyConnection: 'The dolphin\'s echolocation sweep was biological sonar scanning. She didn\'t just check "is something ahead?" — she built a complete sound-map of the channel, the banks, the fish, the sandbars. Every direction, every distance, updated continuously.',
      checkQuestion: 'If the servo rotates from 0° to 180° in steps of 10°, how many distance readings do you get? Is that enough for a useful map?',
      checkAnswer: '180/10 + 1 = 19 readings. That\'s a rough map — you can see large objects but miss small ones. With 2° steps, you get 91 readings — much more detailed. Real LiDAR systems take thousands of readings per revolution.',
      codeIntro: 'Simulate a 180° sweep and display the distance readings.',
      code: `// Lesson 3: Sonar sweep (180 degrees)
// Servo on pin 2, sensor readings simulated

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("=== Sonar Sweep ===");
  Serial.println("Scanning 0-180 degrees...");
  Serial.println("");
}

void loop() {
  // Simulate a sweep with varying distances
  Serial.println("  0°: 120 cm (far wall)");
  analogWrite(2, 50);
  delay(200);

  Serial.println(" 30°: 85 cm (bookshelf)");
  analogWrite(2, 80);
  delay(200);

  Serial.println(" 60°: 45 cm (chair!)");
  analogWrite(2, 170);
  delay(200);

  Serial.println(" 90°: 200 cm (open space)");
  analogWrite(2, 20);
  delay(200);

  Serial.println("120°: 30 cm (table edge!)");
  analogWrite(2, 220);
  delay(200);

  Serial.println("150°: 150 cm (doorway)");
  analogWrite(2, 40);
  delay(200);

  Serial.println("180°: 90 cm (wall)");
  analogWrite(2, 70);
  delay(200);

  Serial.println("");
  Serial.println("Sweep complete. Closest: 30cm at 120°");
  analogWrite(2, 0);
  delay(800);
}`,
      ledCount: 1,
      challenge: 'The LED brightness indicates proximity — brighter = closer object. A real radar display would draw this as a semicircle with dots at each (angle, distance) pair.',
      successHint: 'You just built the logic for a radar/sonar scanner. In Level 2, you\'ll send this data to a Processing or Python sketch that draws a real-time radar sweep on screen.',
    },
    {
      title: 'Speed of sound — temperature matters',
      concept: `We've been using 343 m/s as the speed of sound. But that's only accurate at 20°C. Sound travels faster in warm air and slower in cold air because warm molecules move faster and transmit vibrations more quickly.

The formula: **speed = 331.3 + (0.606 × temperature_°C)** m/s

At 0°C: 331.3 m/s. At 30°C: 349.5 m/s. At 40°C: 355.5 m/s. That's a 7% difference between freezing and hot — enough to throw off a distance reading by several centimeters.

Real sonar systems include a **temperature sensor** and adjust their calculations automatically. Without this correction, a car parking sensor that works perfectly in summer would give wrong readings in winter.`,
      analogy: 'Sound in air is like a crowd doing the wave in a stadium. In warm weather, people are energetic (warm molecules vibrate faster) and the wave moves quickly. In cold weather, everyone\'s sluggish and the wave is slow. Same wave, different speed, depending on temperature.',
      storyConnection: 'The Brahmaputra is warmer in summer and colder in winter. Sound travels at 1,500 m/s in water at 20°C but faster in warm water. The dolphin\'s brain automatically compensates for seasonal water temperature changes — a biological temperature correction.',
      checkQuestion: 'At 35°C, what\'s the speed of sound? If you used the standard 343 m/s instead, by how many centimeters would a 1-meter measurement be off?',
      checkAnswer: 'Speed at 35°C: 331.3 + 0.606 × 35 = 352.5 m/s. If the actual distance is 100cm, the echo takes: 2 × 1.0 / 352.5 = 0.00567s. Using 343 m/s: distance = 343 × 0.00567 / 2 = 97.2 cm. Off by 2.8 cm — significant for precise applications.',
      codeIntro: 'Add temperature correction to your distance calculation.',
      code: `// Lesson 4: Temperature-corrected sonar
// Adding a temperature sensor for accurate readings

void setup() {
  Serial.println("=== Temperature-Corrected Sonar ===");
  Serial.println("");
}

void loop() {
  // Simulated readings at different temperatures
  Serial.println("--- Cold morning (10°C) ---");
  Serial.println("Speed of sound: 337.4 m/s");
  Serial.println("Echo time: 5830 us");
  Serial.println("Distance: 98.3 cm");
  analogWrite(2, 60);
  delay(500);

  Serial.println("");
  Serial.println("--- Hot afternoon (35°C) ---");
  Serial.println("Speed of sound: 352.5 m/s");
  Serial.println("Echo time: 5830 us (same object!)");
  Serial.println("Distance: 102.8 cm");
  analogWrite(2, 50);
  delay(500);

  Serial.println("");
  Serial.println("Same echo time, different distance!");
  Serial.println("4.5 cm error without correction.");
  analogWrite(2, 120);
  delay(400);
  analogWrite(2, 50);
  delay(400);
}`,
      ledCount: 1,
      challenge: 'What about humidity? Humid air is actually lighter than dry air (water molecules weigh less than nitrogen/oxygen), so sound travels faster. Real weather stations account for both temperature AND humidity.',
      successHint: 'Precision matters. A self-driving car using sonar at 100 km/h covers 28 meters per second. A 3cm error at that speed could mean the difference between stopping in time and a collision. Temperature correction isn\'t optional — it\'s safety-critical.',
    },
    {
      title: 'Filtering noise — averaging multiple readings',
      concept: `Real sensors are noisy. An ultrasonic sensor might read 100cm, then 98cm, then 103cm, then 99cm — all for the same stationary object. This noise comes from air currents, vibrations, electrical interference, and the sensor's own limitations.

To get stable readings, you take **multiple measurements and average them**. This is called **filtering**. The simplest filter: take 5 readings, discard the highest and lowest (they might be glitches), and average the remaining 3. This is a **trimmed mean**.

More sophisticated filters (Kalman filter, moving average) are used in real systems. But the principle is the same: **one reading is a guess, many readings are a measurement**.`,
      analogy: 'Ask one person to guess the number of jellybeans in a jar — they might be way off. Ask 100 people and average their guesses — the average is usually very close to the truth. This is the "wisdom of crowds," and sensor filtering works the same way.',
      storyConnection: 'The dolphin doesn\'t make one click and decide. She clicks thousands of times per second, her brain averaging the echoes into a stable, reliable picture. Each individual click is noisy; the aggregate is sharp and accurate. That\'s biological filtering.',
      checkQuestion: 'Five readings: 100, 97, 145, 99, 101. The 145 is clearly a glitch. What\'s the trimmed mean (discard highest and lowest, average the rest)?',
      checkAnswer: 'Sorted: 97, 99, 100, 101, 145. Discard 97 and 145. Average of 99, 100, 101 = 100.0 cm. The glitch (145) was completely removed. Without trimming, the mean would be 108.4 — badly skewed by one bad reading.',
      codeIntro: 'Simulate noisy readings and apply filtering to get stable distance values.',
      code: `// Lesson 5: Noise filtering
// Take multiple readings, discard outliers, average

void setup() {
  Serial.println("=== Sensor Noise Filtering ===");
  Serial.println("");
}

void loop() {
  // Simulated noisy readings (true distance: ~100 cm)
  Serial.println("Raw readings (5 samples):");
  Serial.println("  98, 102, 97, 145, 101");
  Serial.println("");

  Serial.println("Sorted: 97, 98, 101, 102, 145");
  Serial.println("Trimmed (drop min & max): 98, 101, 102");
  Serial.println("Trimmed mean: 100.3 cm");
  analogWrite(2, 60);
  delay(500);

  Serial.println("");
  Serial.println("Without filtering: 108.6 cm (WRONG)");
  analogWrite(2, 180);
  delay(400);

  Serial.println("With filtering: 100.3 cm (ACCURATE)");
  analogWrite(2, 60);
  delay(400);

  Serial.println("");
  Serial.println("Glitch eliminated. LED shows the difference.");
  analogWrite(2, 180);
  delay(300);
  analogWrite(2, 60);
  delay(400);
}`,
      ledCount: 1,
      challenge: 'What if you have 10 readings instead of 5? More samples = more stable average, but slower response time. This is the filtering trade-off: accuracy vs. speed.',
      successHint: 'Every sensor system in the world uses filtering. Your phone\'s accelerometer, a weather station\'s thermometer, a car\'s radar — all take multiple readings and filter the noise. You now understand why.',
    },
    {
      title: 'The complete sonar system — from clicks to maps',
      concept: `You now have all the pieces:
- **Echolocation principle**: sound travels, bounces, returns
- **Distance formula**: distance = speed × time / 2
- **Proximity alerts**: measure → threshold → action
- **Scanning**: servo + sensor = radar sweep
- **Temperature correction**: accurate speed of sound
- **Noise filtering**: multiple readings → stable measurement

A complete sonar system combines all of these. In Level 2, you'll wire the actual HC-SR04 sensor to an Arduino, mount it on a servo, and send the data to a Python script that draws a real-time radar display.

The same principles power submarine navigation, medical imaging, autonomous vehicles, and — 30 million years before any of those — river dolphins.`,
      storyConnection: 'Nabajit learned the dolphin\'s secret: the world speaks to those who close their eyes and open their ears. You\'ve learned to build the technology that does the same thing — turning sound into sight, echoes into maps, clicks into understanding.',
      checkQuestion: 'A bat, a dolphin, a submarine, and an autonomous car all use echolocation. What\'s different about each one?',
      checkAnswer: 'The medium (air vs. water), the frequency (bats: 20-200 kHz, dolphins: 20-130 kHz, submarine sonar: 1-10 kHz, car ultrasonic: 40 kHz), and the range (bat: 5m, dolphin: 100m, submarine: 10km, car: 5m). Same principle, wildly different implementations.',
      codeIntro: 'Summary of everything: a complete sonar readout.',
      code: `// Lesson 6: Complete Sonar System
// All concepts combined

void setup() {
  Serial.println("============================");
  Serial.println("  SONAR RANGE FINDER v1.0");
  Serial.println("============================");
  Serial.println("");
  Serial.println("Sensor: HC-SR04 ultrasonic");
  Serial.println("Range: 2 cm - 400 cm");
  Serial.println("Accuracy: +/- 3mm");
  Serial.println("Temp sensor: enabled");
  Serial.println("");
}

void loop() {
  Serial.println("--- Scan Report ---");
  Serial.println("Temperature: 25°C");
  Serial.println("Speed of sound: 346.5 m/s");
  Serial.println("");
  Serial.println("5 samples taken, filtered:");
  Serial.println("  Raw: 24.8, 25.1, 24.9, 25.0, 24.7");
  Serial.println("  Filtered: 24.9 cm");
  Serial.println("");
  Serial.println("Status: Object at 24.9 cm");
  Serial.println("Zone: WARNING (< 30 cm)");
  Serial.println("");

  analogWrite(2, 200);
  Serial.println("LED: proximity indicator ON");
  delay(800);
  analogWrite(2, 80);
  delay(400);
  analogWrite(2, 200);
  delay(600);
}`,
      ledCount: 1,
      challenge: 'You\'ve gone from "sound bounces" to a complete measurement system with temperature correction and noise filtering. Level 2 builds the real hardware.',
      successHint: 'From one formula (distance = speed × time / 2) to a complete sonar system. The dolphin\'s secret is now your skill.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No electronics experience needed</span>
      </div>

      <div className="mb-8 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800">
        <p className="text-sm text-sky-800 dark:text-sky-300">
          These exercises use a <strong>simulated Arduino</strong> with an ultrasonic sensor. Edit the code, click "Upload & Run", and watch the serial output. In Level 2, you'll wire the real circuit.
        </p>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <SonarMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
