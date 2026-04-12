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
        <ArduinoPlayground starterCode={lesson.code} title={`Circuit ${number}`} ledCount={lesson.ledCount || 3} sonarMode />
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

export default function DolphinLevel4() {
  const circuitLessons: CircuitLesson[] = [
    {
      title: 'System Design: Ultrasonic Sonar with LED Distance Indicator',
      concept: `You've reached the capstone: build a **sonar ranging system** inspired by river dolphin echolocation. The system uses an HC-SR04 ultrasonic sensor to measure distance, a piezo buzzer for proximity alerts, and **3 LEDs** as a distance indicator (close/medium/far).

The **HC-SR04** is a time-of-flight sensor: it emits a 40 kHz ultrasonic pulse and listens for the echo. The Arduino measures the round-trip time and calculates distance using the speed of sound (~343 m/s at 20 degrees C).

Hardware layout:
- **HC-SR04**: TRIG on pin 7, ECHO on pin 8 (simulated via serial in our playground)
- **LED indicators**: Red (pin 2) = close, Yellow (pin 3) = medium, Green (pin 4) = far
- **Buzzer**: pin 5 (simulated as LED brightness = beep rate)

The measurement cycle takes ~60 ms (maximum range timeout), giving about 16 readings per second. This is fast enough for a handheld distance scanner but slow enough to avoid echo interference between consecutive pulses.`,
      analogy: 'The HC-SR04 is a simplified dolphin: the transmitter is the melon (the dolphin forehead organ that focuses outgoing clicks) and the receiver is the lower jaw (which channels returning echoes to the inner ear). The buzzer alerts the operator like a dolphin alerting its pod. The LEDs form a visual "mental image" of the surroundings.',
      storyConnection: 'The river dolphin navigates the murky Brahmaputra by emitting clicks and interpreting echoes — a biological sonar perfected over millions of years. Our HC-SR04 project recreates this: emit a pulse, time the echo, calculate distance, and alert the operator.',
      checkQuestion: 'Why does the HC-SR04 use 40 kHz ultrasound instead of audible sound frequencies?',
      checkAnswer: 'Higher frequencies are more directional (shorter wavelength = tighter beam), improving spatial resolution and reducing false echoes. 40 kHz is above human hearing (20 kHz), so the sensor operates silently. The tradeoff: higher frequencies attenuate faster, limiting range to about 4 meters. Dolphins use up to 150 kHz for even tighter beams.',
      codeIntro: 'Set up the sonar system with LED indicators and a self-test routine.',
      code: `// Dolphin Sonar Capstone - System Setup
// 3 LEDs: Red(close) Yellow(mid) Green(far)

void setup() {
  pinMode(2, OUTPUT);  // Red - CLOSE
  pinMode(3, OUTPUT);  // Yellow - MEDIUM
  pinMode(4, OUTPUT);  // Green - FAR
  Serial.println("=== Dolphin Sonar System ===");
  Serial.println("Self-test: cycling LEDs...");

  // Self-test: light each LED
  digitalWrite(2, HIGH); delay(300);
  digitalWrite(2, LOW);
  digitalWrite(3, HIGH); delay(300);
  digitalWrite(3, LOW);
  digitalWrite(4, HIGH); delay(300);
  digitalWrite(4, LOW);
  Serial.println("Self-test OK");
}

void loop() {
  // Simulate distance reading (replace with HC-SR04 on real hardware)
  int dist = random(10, 300);  // cm

  // Clear all LEDs
  digitalWrite(2, LOW);
  digitalWrite(3, LOW);
  digitalWrite(4, LOW);

  // Light the appropriate indicator
  if (dist < 30) {
    digitalWrite(2, HIGH);  // RED = close
    Serial.print(dist);
    Serial.println(" cm - CLOSE!");
  } else if (dist < 100) {
    digitalWrite(3, HIGH);  // YELLOW = medium
    Serial.print(dist);
    Serial.println(" cm - medium");
  } else {
    digitalWrite(4, HIGH);  // GREEN = far
    Serial.print(dist);
    Serial.println(" cm - far");
  }

  delay(200);
}`,
      ledCount: 3,
      challenge: 'Change the distance thresholds: try 20 cm for close and 80 cm for medium. On real hardware, you would tune these to your room size.',
      successHint: 'The 3-LED indicator gives instant visual feedback on distance zones. Next you add the actual timing-based measurement.',
    },
    {
      title: 'Distance Measurement: Pulse Timing in Arduino C',
      concept: `The HC-SR04 measurement sequence:
1. Send a 10-microsecond HIGH pulse on TRIG
2. The sensor emits 8 cycles of 40 kHz ultrasound
3. ECHO pin goes HIGH when the echo returns
4. Measure the ECHO pulse duration with \`pulseIn()\`
5. Calculate distance: **distance_cm = duration_us / 58.2**

Why 58.2? Sound travels 343 m/s = 0.0343 cm/us. The pulse travels to the object AND back (round trip), so divide by 2: 0.01715 cm/us. Invert to get us/cm: **58.2 us per cm** of round-trip distance.

Edge cases matter in sonar:
- **No echo** (object too far or angled away): pulseIn() returns 0 after timeout
- **Too close** (< 2 cm): the echo overlaps with the outgoing pulse
- **Noise**: temperature, humidity, and surface texture affect readings`,
      analogy: 'Imagine shouting into a canyon and timing the echo with a stopwatch. If the echo takes 1 second and sound travels 343 m/s, the canyon wall is 343/2 = 171.5 m away (divide by 2 because the sound went there and back). The HC-SR04 does exactly this, but with ultrasound instead of your voice and microsecond precision instead of a stopwatch.',
      storyConnection: 'The dolphin\'s brain processes echo timing with extraordinary precision — it can distinguish objects just centimeters apart in murky water. Our Arduino does the same calculation: measure time, multiply by speed, divide by two. The math is identical; the dolphin just does it faster.',
      checkQuestion: 'If the ECHO pulse duration is 1164 microseconds, how far away is the object?',
      checkAnswer: '1164 / 58.2 = 20.0 cm. At this distance, the Red (CLOSE) LED should light up and the buzzer should beep rapidly.',
      codeIntro: 'Implement the full distance calculation with the 58.2 constant and LED zone mapping.',
      code: `// Sonar Distance Measurement
// Simulated HC-SR04 with LED indicators

int ledClose = 2;   // Red
int ledMid = 3;      // Yellow
int ledFar = 4;      // Green

// Speed of sound constant
// 58.2 microseconds per cm (round trip)
int step = 0;

void setup() {
  pinMode(ledClose, OUTPUT);
  pinMode(ledMid, OUTPUT);
  pinMode(ledFar, OUTPUT);
  Serial.println("echo_us,dist_cm,zone");
}

void loop() {
  // Simulate object moving closer then farther
  // (On real hardware: pulseIn(ECHO, HIGH))
  int distances[] = {250, 200, 150, 100, 80, 60, 40, 25, 15, 10,
                     15, 25, 40, 60, 80, 100, 150, 200, 250, 300};
  int dist = distances[step % 20];
  int echo_us = dist * 58;  // reverse: duration from distance

  // Add simulated noise (+/- 3mm)
  dist = dist + random(-1, 2);

  // Clear LEDs
  digitalWrite(ledClose, LOW);
  digitalWrite(ledMid, LOW);
  digitalWrite(ledFar, LOW);

  // Zone detection with LED indicator
  if (dist < 30) {
    analogWrite(ledClose, 255);  // Red bright
    Serial.print(echo_us);
    Serial.print(",");
    Serial.print(dist);
    Serial.println(",CLOSE");
  } else if (dist < 100) {
    analogWrite(ledMid, 180);    // Yellow medium
    Serial.print(echo_us);
    Serial.print(",");
    Serial.print(dist);
    Serial.println(",MEDIUM");
  } else {
    analogWrite(ledFar, 100);    // Green dim
    Serial.print(echo_us);
    Serial.print(",");
    Serial.print(dist);
    Serial.println(",FAR");
  }

  step++;
  delay(250);
}`,
      ledCount: 3,
      challenge: 'Add a "no echo" case: when dist > 400 (beyond HC-SR04 range), turn all LEDs off and print "OUT_OF_RANGE". This handles the timeout condition.',
      successHint: 'You now understand the core sonar equation: distance = time * speed / 2. This same principle drives parking sensors, robotic obstacle avoidance, and submarine navigation.',
    },
    {
      title: 'Signal Processing: Filtering Noisy Readings',
      concept: `Raw sensor data is always noisy. The HC-SR04 has ~3mm accuracy, but single readings can spike due to multipath reflections, surface angles, or electrical interference. A **moving average filter** smooths these spikes.

A moving average keeps the last N readings in a buffer and outputs their average. With N=5:
- Reading arrives: 100, 102, 98, 150 (spike!), 101
- Average: (100+102+98+150+101)/5 = 110.2
- Next reading: 99 replaces 100 in the buffer
- New average: (102+98+150+101+99)/5 = 110.0

The spike at 150 is diluted by the 4 good readings. Larger N = smoother output but slower response to real changes. N=5 is a good balance for sonar.

On Arduino, we implement this with a **circular buffer** — an array where the write index wraps around, overwriting the oldest value.`,
      analogy: 'Imagine asking 5 friends to estimate a distance by eye. One friend guesses wildly high. But when you average all 5 guesses, the wild guess barely moves the needle. That\'s a moving average: the group is more reliable than any individual.',
      storyConnection: 'The dolphin\'s brain doesn\'t rely on a single click-echo pair. It fires rapid bursts of clicks and integrates the echoes over time, building a filtered "image" of the surroundings. Our moving average mimics this biological signal processing.',
      checkQuestion: 'With a 5-sample moving average, how many consecutive bad readings does it take to significantly corrupt the output?',
      checkAnswer: 'At least 3 out of 5. If only 1-2 readings are bad, the other 3-4 good readings dominate the average. This is why N=5 is robust: it takes a sustained fault, not a single spike, to fool the filter.',
      codeIntro: 'Implement a moving average filter with a circular buffer and watch how it smooths the LED transitions.',
      code: `// Moving Average Filter for Sonar
// Smooths noisy distance readings

int ledClose = 2;  // Red
int ledMid = 3;    // Yellow
int ledFar = 4;    // Green

// Circular buffer for moving average
int buffer[] = {100, 100, 100, 100, 100};
int bufIdx = 0;
int bufSize = 5;
int tick = 0;

int getAverage() {
  int sum = 0;
  for (int i = 0; i < bufSize; i++) {
    sum += buffer[i];
  }
  return sum / bufSize;
}

void setup() {
  pinMode(ledClose, OUTPUT);
  pinMode(ledMid, OUTPUT);
  pinMode(ledFar, OUTPUT);
  Serial.println("raw,filtered,zone");
}

void loop() {
  // Simulate noisy readings (object at ~80 cm)
  int raw = 80 + random(-5, 6);

  // Inject occasional spike
  if (random(0, 8) == 0) {
    raw = raw + random(40, 80);  // spike!
  }

  // Add to circular buffer
  buffer[bufIdx] = raw;
  bufIdx = (bufIdx + 1) % bufSize;

  // Filtered value
  int filtered = getAverage();

  // Clear LEDs
  digitalWrite(ledClose, LOW);
  digitalWrite(ledMid, LOW);
  digitalWrite(ledFar, LOW);

  // Display filtered zone
  if (filtered < 30) {
    analogWrite(ledClose, 255);
  } else if (filtered < 100) {
    analogWrite(ledMid, 200);
  } else {
    analogWrite(ledFar, 120);
  }

  Serial.print(raw);
  Serial.print(",");
  Serial.print(filtered);
  if (filtered < 30) Serial.println(",CLOSE");
  else if (filtered < 100) Serial.println(",MEDIUM");
  else Serial.println(",FAR");

  tick++;
  delay(200);
}`,
      ledCount: 3,
      challenge: 'Change bufSize to 1 (no filtering) and watch how spikes cause the LEDs to jump zones erratically. Then try bufSize = 10 — very smooth but slow to respond. Find the sweet spot for your use case.',
      successHint: 'Moving average filtering is used in every sensor system: weather stations, fitness trackers, industrial controllers, self-driving cars. You just learned a universal signal processing technique.',
    },
    {
      title: 'Proximity Alert: Buzzer Frequency Mapping',
      concept: `A sonar system needs an **audio alert** — beeping faster as objects get closer, like a parking sensor. On Arduino, we simulate this with LED brightness (the playground doesn't have audio, but the code maps directly to a real piezo buzzer).

The mapping is **inverse**: closer distance = higher frequency = faster blinking. We use a formula:

**beepInterval = map(distance, 10, 300, 50, 800)**

At 10 cm: beep every 50 ms (frantic). At 300 cm: beep every 800 ms (lazy). Between: linear interpolation.

For the buzzer tone itself, we also map distance to **pitch**: close = 2000 Hz (high, urgent), far = 500 Hz (low, calm). The \`tone(pin, frequency, duration)\` function generates the square wave.

The three LEDs continue to show the distance zone while the buzzer (simulated as LED 2 brightness pulsing) provides the audio alert pattern.`,
      analogy: 'Think of a Geiger counter near radioactive material — the closer you get, the faster it clicks. Our sonar buzzer follows the same principle: the click rate encodes the distance. Your brain processes the rhythm faster than it could read a number on a display.',
      storyConnection: 'When the dolphin detects something close, its click rate increases dramatically — up to 600 clicks per second in a "buzz" that gives maximum resolution at close range. Our beep-rate mapping mirrors this biological strategy: more information when it matters most.',
      checkQuestion: 'Why use an inverse mapping (closer = faster beeps) instead of a direct mapping (closer = slower beeps)?',
      checkAnswer: 'Urgency naturally associates with faster rates in human perception. A rapid beeping triggers alertness — you instinctively know something needs attention. Slow beeping feels calm and safe. This matches the priority: close objects are dangerous and need fast reaction.',
      codeIntro: 'Map distance to beep rate. The closer the object, the faster LED 2 pulses.',
      code: `// Proximity Alert with Beep Rate
// LED pulse rate increases as distance decreases

int ledClose = 2;  // Red - also pulses as "buzzer"
int ledMid = 3;    // Yellow
int ledFar = 4;    // Green

int dist = 200;
int direction = -5;  // object approaching
int beepTimer = 0;
int beepState = 0;

void setup() {
  pinMode(ledClose, OUTPUT);
  pinMode(ledMid, OUTPUT);
  pinMode(ledFar, OUTPUT);
  Serial.println("=== Proximity Alert ===");
  Serial.println("dist_cm,beep_ms");
}

void loop() {
  // Simulate object approaching and retreating
  dist += direction;
  if (dist < 10) direction = 5;
  if (dist > 300) direction = -5;

  // Map distance to beep interval
  // Close (10cm) = fast (50ms), Far (300cm) = slow (800ms)
  int beepInterval;
  if (dist < 10) beepInterval = 50;
  else if (dist > 300) beepInterval = 800;
  else beepInterval = 50 + ((dist - 10) * 750) / 290;

  // Zone LEDs
  digitalWrite(ledMid, LOW);
  digitalWrite(ledFar, LOW);

  if (dist < 30) {
    // CLOSE: red LED pulses rapidly
    beepTimer += 60;
    if (beepTimer >= beepInterval) {
      beepState = 1 - beepState;
      beepTimer = 0;
    }
    analogWrite(ledClose, beepState * 255);
  } else if (dist < 100) {
    // MEDIUM: yellow steady, red pulses slowly
    digitalWrite(ledMid, HIGH);
    beepTimer += 60;
    if (beepTimer >= beepInterval) {
      beepState = 1 - beepState;
      beepTimer = 0;
    }
    analogWrite(ledClose, beepState * 128);
  } else {
    // FAR: green steady, no buzzer
    digitalWrite(ledFar, HIGH);
    analogWrite(ledClose, 0);
    beepTimer = 0;
  }

  Serial.print(dist);
  Serial.print(",");
  Serial.println(beepInterval);

  delay(200);
}`,
      ledCount: 3,
      challenge: 'Change the mapping to non-linear: use beepInterval = 50 + (dist * dist) / 120 for a quadratic curve. This makes the alert ramp up much faster at close range, which feels more natural for collision avoidance.',
      successHint: 'Frequency-mapped alerts are everywhere: parking sensors, medical monitors, radiation detectors, submarine sonar. The distance-to-rate mapping is a fundamental human-computer interaction pattern.',
    },
    {
      title: 'Complete Sonar Capstone: Distance + Filter + Alert',
      concept: `Everything comes together: **3-LED distance indicator**, time-of-flight measurement, moving average filtering, and proximity alert beeping. This is a complete embedded sonar system.

The final sketch combines:
1. **Distance measurement** — simulated HC-SR04 pulse timing (58.2 us/cm)
2. **Moving average filter** — 5-sample circular buffer smooths noise
3. **Zone LEDs** — Red/Yellow/Green for close/medium/far
4. **Proximity alert** — LED pulse rate maps inversely to distance
5. **Serial CSV logging** — timestamped data for analysis

On real hardware, this project uses an HC-SR04 ($2), a piezo buzzer ($0.50), 3 LEDs, and an Arduino Uno. Total cost under $15.`,
      storyConnection: 'The river dolphin combines echolocation, signal filtering, and alert behavior into one seamless system — click, listen, filter, respond. Your Arduino capstone does the same: sense, process, display, alert. The dolphin has millions of years of evolution; you built yours in five lessons.',
      checkQuestion: 'How would you extend this to measure direction (not just distance) — like a dolphin that knows WHERE an object is, not just how far?',
      checkAnswer: 'Use two HC-SR04 sensors spaced apart (like dolphin ears). If the left sensor reads 50 cm and the right reads 55 cm, the object is slightly to the left. The angle can be calculated using the difference in distances and the sensor spacing (trigonometry). This is called "binaural ranging" — exactly how dolphins (and humans) localize sound sources.',
      codeIntro: 'The final capstone: full sonar system with filtering, zone display, proximity alert, and data logging.',
      code: `// === DOLPHIN SONAR CAPSTONE ===
// Distance + Filter + Zone LEDs + Alert + Logging

int ledClose = 2;  // Red
int ledMid = 3;    // Yellow
int ledFar = 4;    // Green
int buzzer = 5;    // Piezo buzzer

// Moving average filter
int buf[] = {150, 150, 150, 150, 150};
int bIdx = 0;
int dist = 200;
int dir = -3;
int tick = 0;

int avgFilter() {
  int s = 0;
  for (int i = 0; i < 5; i++) s += buf[i];
  return s / 5;
}

void setup() {
  pinMode(ledClose, OUTPUT);
  pinMode(ledMid, OUTPUT);
  pinMode(ledFar, OUTPUT);
  pinMode(buzzer, OUTPUT);

  // Self-test: flash LEDs + beep
  Serial.println("=== Dolphin Sonar Capstone ===");
  digitalWrite(ledFar, HIGH); tone(buzzer, 800, 150); delay(200);
  digitalWrite(ledFar, LOW);
  digitalWrite(ledMid, HIGH); tone(buzzer, 1200, 150); delay(200);
  digitalWrite(ledMid, LOW);
  digitalWrite(ledClose, HIGH); tone(buzzer, 1800, 150); delay(200);
  digitalWrite(ledClose, LOW); noTone(buzzer);
  Serial.println("Self-test OK — LEDs + buzzer working");
  Serial.println("ms,raw,filtered,zone,beep_ms");
}

void loop() {
  // Simulate approaching/retreating object
  dist += dir;
  if (dist < 8) dir = 3;
  if (dist > 300) dir = -3;

  // Add noise + occasional spike
  int raw = dist + random(-3, 4);
  if (random(0, 10) == 0) raw += random(30, 60);

  // Filter
  buf[bIdx] = raw;
  bIdx = (bIdx + 1) % 5;
  int filtered = avgFilter();

  // Beep interval
  int beepInt;
  if (filtered < 10) beepInt = 50;
  else if (filtered > 300) beepInt = 800;
  else beepInt = 50 + ((filtered - 10) * 750) / 290;

  // Clear LEDs
  digitalWrite(ledClose, LOW);
  digitalWrite(ledMid, LOW);
  digitalWrite(ledFar, LOW);

  // Zone display + audio alert
  if (filtered < 30) {
    analogWrite(ledClose, 255);
    tone(buzzer, 2000 - filtered * 30, beepInt);
  } else if (filtered < 100) {
    digitalWrite(ledMid, HIGH);
    tone(buzzer, 1500 - filtered * 8, beepInt);
  } else {
    digitalWrite(ledFar, HIGH);
    noTone(buzzer);
  }

  // CSV log
  Serial.print(tick * 60);
  Serial.print(",");
  Serial.print(raw);
  Serial.print(",");
  Serial.print(filtered);
  if (filtered < 30) Serial.print(",CLOSE,");
  else if (filtered < 100) Serial.print(",MEDIUM,");
  else Serial.print(",FAR,");
  Serial.println(beepInt);

  tick++;
  delay(200);
}`,
      ledCount: 3,
      challenge: 'Try changing the tone frequencies — what happens if you map closer objects to higher pitches? On real hardware, connect an HC-SR04 (TRIG to pin 7, ECHO to pin 8) and replace the simulated distance with pulseIn(ECHO, HIGH) / 58.2.',
      successHint: 'You\'ve built a working sonar system — LEDs show distance zones, audio pitch changes with proximity, and the serial monitor logs data. Upload this code to a real Arduino with an HC-SR04 sensor and it works identically.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (sonar physics & signal processing)</span>
      </div>

      <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-800 dark:text-purple-300">
          This capstone uses a <strong>simulated Arduino</strong> to build a sonar ranging system with HC-SR04 distance measurement, moving average filtering, and proximity alerts. Edit the code, click "Upload & Run", and watch the virtual LEDs respond.
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
