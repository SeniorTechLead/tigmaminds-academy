import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import ArduinoPlayground from '../ArduinoPlayground';
import { renderMarkdown } from '../MiniLesson';

interface SonarLesson { title: string; concept: string; analogy?: string; storyConnection?: string; checkQuestion?: string; checkAnswer?: string; codeIntro?: string; code: string; ledCount?: number; challenge?: string; successHint?: string; }


function SonarMiniLesson({ lesson, number }: { lesson: SonarLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div id={`L2-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.concept) }} />
        {lesson.analogy && (<div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4"><p className="text-sm text-sky-800 dark:text-sky-300"><strong>Think of it this way:</strong> {lesson.analogy}</p></div>)}
        {lesson.storyConnection && (<div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4"><p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>In the story:</strong> {lesson.storyConnection}</p></div>)}
        {lesson.checkQuestion && (<div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2"><div className="flex items-start gap-3"><HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><div className="flex-1"><p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code:</p><p className="text-sm text-amber-800 dark:text-amber-300">{lesson.checkQuestion}</p>{lesson.checkAnswer && (<><button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600">{showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{showAnswer ? 'Hide' : 'Show answer'}</button>{showAnswer && <p className="mt-2 text-sm text-amber-700 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{lesson.checkAnswer}</p>}</>)}</div></div></div>)}
      </div>
      {lesson.codeIntro && (<div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700"><p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Now try it:</strong> {lesson.codeIntro}</p></div>)}
      <div className="border-t border-gray-200 dark:border-gray-700"><ArduinoPlayground starterCode={lesson.code} title={`Sonar ${number}`} ledCount={lesson.ledCount || 1} /></div>
      {lesson.challenge && (<div className="px-6 py-3 bg-sky-50 dark:bg-sky-900/20 border-t border-sky-200 dark:border-sky-800"><p className="text-sm text-sky-800 dark:text-sky-300"><strong>Experiment:</strong> {lesson.challenge}</p></div>)}
      {lesson.successHint && (<div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800"><p className="text-sm text-emerald-800 dark:text-emerald-300"><CheckCircle className="w-4 h-4 inline mr-1" />{lesson.successHint}</p></div>)}
    </div>
  );
}

export default function DolphinLevel2() {
  const lessons: SonarLesson[] = [
    {
      title: 'Wiring the HC-SR04 — from simulation to real hardware',
      concept: `In Level 1 you simulated sonar readings. Now it's time for real hardware. The **HC-SR04** ultrasonic sensor has 4 pins: VCC (5V power), GND (ground), TRIG (trigger — you pulse this to send a ping), and ECHO (returns a pulse whose duration = travel time).

The wiring: VCC → 5V, GND → GND, TRIG → any digital pin, ECHO → any digital pin. The code sends a 10μs HIGH pulse on TRIG, then uses \`pulseIn(echoPin, HIGH)\` to measure how long the ECHO pin stays HIGH. That duration (in microseconds) is the round-trip time.

**Safety**: the HC-SR04 ECHO pin outputs 5V, which is fine for Arduino Uno but can damage a 3.3V board (Raspberry Pi, ESP32). Use a voltage divider if needed.`,
      analogy: 'The TRIG pin is your voice shouting into a canyon. The ECHO pin is your ear timing the echo. pulseIn() is your stopwatch. The formula converts stopwatch time to distance.',
      storyConnection: 'When Nabajit\'s father told him to listen for the dolphin\'s breathing — *pfffsshh* — that was the echo. The dolphin\'s internal "TRIG" was its jaw muscles sending a click, and its melon (forehead) was the "ECHO" receiver focusing the returning sound.',
      checkQuestion: 'The HC-SR04 has a maximum range of ~4 meters. If the speed of sound is 343 m/s, what\'s the maximum echo time you\'d measure?',
      checkAnswer: '4m there and 4m back = 8m total. Time = 8m / 343 m/s = 0.0233 seconds = 23,300 microseconds. If pulseIn() returns more than ~23,000μs, the object is out of range (or there\'s no object).',
      codeIntro: 'Simulate the real HC-SR04 timing sequence.',
      code: `// Level 2, Lesson 1: HC-SR04 wiring and timing
// Real code uses pulseIn() — we simulate the result

void setup() {
  pinMode(2, OUTPUT);  // TRIG
  pinMode(3, INPUT);   // ECHO
  Serial.println("=== HC-SR04 Sonar ===");
  Serial.println("TRIG: pin 2, ECHO: pin 3");
  Serial.println("VCC: 5V, GND: GND");
  Serial.println("");
}

void loop() {
  // Send trigger pulse
  // Real: digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  Serial.println("TRIG: 10us pulse sent");

  // Measure echo
  // Real: long duration = pulseIn(ECHO, HIGH);
  Serial.println("ECHO: waiting...");
  Serial.println("ECHO: 1457 microseconds");
  Serial.println("Distance: 25.0 cm");
  analogWrite(2, 180);
  delay(400);

  Serial.println("");
  Serial.println("ECHO: 4380 microseconds");
  Serial.println("Distance: 75.1 cm");
  analogWrite(2, 80);
  delay(400);

  Serial.println("");
  Serial.println("ECHO: 582 microseconds");
  Serial.println("Distance: 10.0 cm — CLOSE!");
  analogWrite(2, 255);
  delay(400);
}`,
      ledCount: 1,
      challenge: 'The real code is just 5 lines in loop(): trigger pulse, pulseIn(), calculate, print. The sensor does all the hard physics — your code just times it.',
      successHint: 'You now understand exactly what the hardware does and how the code talks to it. The jump from simulation to real circuit is just wiring 4 pins.',
    },
    {
      title: 'Servo scanning — sweeping 180 degrees',
      concept: `A single distance reading tells you "something is 25cm ahead." But what about left? Right? Behind? To build a map, you need to **scan** — take readings in many directions.

A **servo motor** rotates to precise angles (0° to 180°) based on a PWM signal. Mount the HC-SR04 on top, and you have a scanning sonar head. The Arduino code: rotate to 0°, read distance, rotate to 10°, read distance... sweep to 180° and back. Each (angle, distance) pair is one point on your map.

The key insight: servo accuracy limits map quality. A cheap servo has ±2° error. At 1 meter range, that's ±3.5cm positional error. For precise mapping, you need better servos — or statistical averaging across multiple sweeps.`,
      storyConnection: 'The dolphin sweeps its head side to side while clicking — a biological servo scan. Each click at a different angle gives one data point. Hundreds of points per second builds a complete 3D sound-map of the river.',
      checkQuestion: 'A servo sweep from 0° to 180° in 5° steps takes a distance reading at each step. How many readings per sweep? If each reading takes 50ms, how long is one full sweep?',
      checkAnswer: '180/5 + 1 = 37 readings. At 50ms each: 37 × 50 = 1,850ms ≈ 1.85 seconds per sweep. That\'s about 0.5 sweeps per second — slow but sufficient for a stationary mapper.',
      codeIntro: 'Simulate a servo sweep with distance readings at each angle.',
      code: `// Level 2, Lesson 2: Servo sweep
// Rotate sensor, read at each angle

void setup() {
  pinMode(2, OUTPUT);  // LED brightness = proximity
  Serial.println("=== Servo Sweep ===");
  Serial.println("0° to 180° in 30° steps");
  Serial.println("");
}

void loop() {
  // Sweep forward
  Serial.println("Sweep: 0° → 180°");

  analogWrite(2, 50);
  Serial.println("  0°: 120cm (wall)");
  delay(200);

  analogWrite(2, 80);
  Serial.println("  30°: 85cm (shelf)");
  delay(200);

  analogWrite(2, 200);
  Serial.println("  60°: 32cm (obstacle!)");
  delay(200);

  analogWrite(2, 20);
  Serial.println("  90°: 200cm (open)");
  delay(200);

  analogWrite(2, 220);
  Serial.println("  120°: 28cm (table!)");
  delay(200);

  analogWrite(2, 40);
  Serial.println("  150°: 150cm (door)");
  delay(200);

  analogWrite(2, 70);
  Serial.println("  180°: 95cm (wall)");
  delay(200);

  Serial.println("Closest: 28cm at 120°");
  Serial.println("");
  analogWrite(2, 0);
  delay(500);
}`,
      ledCount: 1,
      challenge: 'The LED brightness maps to proximity (brighter = closer). In Level 3, you\'d send this data over serial to a Python script that draws a real radar arc.',
      successHint: 'You have angle + distance pairs — that\'s a polar coordinate map. Convert to Cartesian (x = distance × cos(angle), y = distance × sin(angle)) and you have a room layout.',
    },
    {
      title: 'Data logging — recording measurements over time',
      concept: `A single sweep gives a snapshot. But the world moves — people walk by, doors open, objects shift. To track changes, you need **data logging**: recording measurements with timestamps so you can analyze patterns over time.

In Arduino, you send data over Serial in a structured format (CSV): \`timestamp, angle, distance\`. A Python script on the connected computer reads this stream, parses it, and stores it in a file or database. This is how real sensor networks work — Arduino collects, computer analyzes.

The format matters: consistent delimiters (commas), consistent units, and a header row make the data usable long after collection.`,
      analogy: 'Data logging is like a security camera that records timestamps. A single photo tells you what\'s there now. A video with timestamps tells you when things appeared, how long they stayed, and when they left. Sensor logging is the numerical version of security footage.',
      storyConnection: 'Scientists studying the Gangetic river dolphin deploy underwater microphones that record clicks 24/7. Months of data reveal: which parts of the river the dolphins use, when they\'re most active, and whether the population is growing or shrinking. One click is noise. A year of logged clicks is conservation science.',
      checkQuestion: 'If you log data every 100ms for 1 hour, how many data points do you collect? At 20 bytes per line (CSV), how big is the file?',
      checkAnswer: '1 hour = 3,600 seconds = 36,000 readings (at 10 per second). At 20 bytes each: 36,000 × 20 = 720,000 bytes ≈ 700 KB. Very manageable. Real sensor networks run for months.',
      codeIntro: 'Output structured CSV data that a Python script could read.',
      code: `// Level 2, Lesson 3: Data logging in CSV format
// Output structured data for Python analysis

void setup() {
  Serial.println("timestamp_ms,angle_deg,distance_cm,temp_c");
  Serial.println("=== Data logging started ===");
}

void loop() {
  // Simulated sweep with CSV output
  Serial.println("1000,0,120.3,24.5");
  delay(150);
  Serial.println("1200,30,85.1,24.5");
  delay(150);
  Serial.println("1400,60,32.7,24.6");
  analogWrite(2, 200);
  delay(150);
  Serial.println("1600,90,198.4,24.5");
  analogWrite(2, 20);
  delay(150);
  Serial.println("1800,120,28.2,24.6");
  analogWrite(2, 230);
  delay(150);
  Serial.println("2000,150,152.0,24.5");
  analogWrite(2, 40);
  delay(150);
  Serial.println("2200,180,94.8,24.5");
  analogWrite(2, 60);
  delay(150);

  Serial.println("");
  Serial.println("=== Sweep complete (7 readings) ===");
  analogWrite(2, 0);
  delay(500);
}`,
      ledCount: 1,
      challenge: 'The CSV format (comma-separated values) is universal. Python reads it with one line: data = pandas.read_csv(\'sonar.csv\'). That one line turns your Arduino output into a DataFrame ready for analysis.',
      successHint: 'Structured data output is the bridge between embedded systems (Arduino) and data science (Python). You just built that bridge.',
    },
    {
      title: 'Polar to Cartesian — drawing the map',
      concept: `Your sonar data is in **polar coordinates**: (angle, distance). But screens use **Cartesian coordinates**: (x, y). To draw a map, you convert:
- **x = distance × cos(angle)**
- **y = distance × sin(angle)**

This is trigonometry in action. At angle 0° (straight ahead), x = distance, y = 0. At 90° (hard right), x = 0, y = distance. Every point on your radar sweep becomes an (x, y) position on the map.

A Python script reads the CSV data, converts each (angle, distance) pair to (x, y), and plots them as points on a 2D canvas. Connect the dots and you have a room layout drawn by sound.`,
      analogy: 'Imagine you\'re blindfolded in a room with a compass and a tape measure. You measure 3m at 45° northeast. On a map, that\'s x = 3 × cos(45°) = 2.1m east and y = 3 × sin(45°) = 2.1m north. Each measurement adds one point to your map.',
      storyConnection: 'The dolphin\'s brain does this conversion automatically — it clicks in a direction, measures the echo time, and builds an internal map of the river. The conversion from "echo from the left at 50 milliseconds" to "sandbar 37 meters to port" is biological polar-to-Cartesian.',
      checkQuestion: 'A reading at 60° shows 100cm. What are the Cartesian coordinates? (cos(60°) = 0.5, sin(60°) = 0.866)',
      checkAnswer: 'x = 100 × cos(60°) = 100 × 0.5 = 50cm. y = 100 × sin(60°) = 100 × 0.866 = 86.6cm. The object is 50cm to the right and 86.6cm forward.',
      codeIntro: 'Show the conversion from polar to Cartesian for each reading.',
      code: `// Level 2, Lesson 4: Polar to Cartesian conversion
// Convert sonar readings to map coordinates

void setup() {
  Serial.println("=== Polar → Cartesian ===");
  Serial.println("angle, distance → x, y");
  Serial.println("");
}

void loop() {
  // Simulated readings with conversion
  // cos/sin values pre-calculated
  Serial.println("  0°, 120cm → x=120.0, y=  0.0");
  Serial.println(" 30°,  85cm → x= 73.6, y= 42.5");
  Serial.println(" 60°,  32cm → x= 16.0, y= 27.7");
  Serial.println(" 90°, 200cm → x=  0.0, y=200.0");
  Serial.println("120°,  28cm → x=-14.0, y= 24.2");
  Serial.println("150°, 150cm → x=-129.9, y= 75.0");
  Serial.println("180°,  95cm → x=-95.0, y=  0.0");
  Serial.println("");
  Serial.println("Plot these (x,y) points and connect");
  Serial.println("them — that's your room map!");

  analogWrite(2, 100);
  delay(500);
  analogWrite(2, 180);
  delay(500);
  analogWrite(2, 100);
  delay(500);
}`,
      ledCount: 1,
      challenge: 'In Python: x = distance * math.cos(math.radians(angle)). Plot all points with plt.scatter(xs, ys) and you get a radar map.',
      successHint: 'Polar to Cartesian conversion is the math behind every radar display, GPS map, and game physics engine. You just learned it through sonar.',
    },
    {
      title: 'Obstacle avoidance — making decisions from sonar data',
      concept: `The ultimate purpose of sonar isn't to make pretty maps — it's to **make decisions**. A robot needs to know: "Is it safe to go forward? Should I turn left or right? Is there a gap I can fit through?"

**Obstacle avoidance** reads sonar data and chooses an action:
1. Scan forward ±30° (the robot's path width)
2. If all readings > safe distance → go forward
3. If obstacle detected → scan left and right
4. Turn toward the side with more open space
5. Repeat

This is a **reactive controller** — it responds to current sensor data without a map. More advanced systems build a map (SLAM) and plan a path. But reactive avoidance is how most hobby robots and even some industrial ones operate.`,
      storyConnection: 'The dolphin doesn\'t plan a route through the river. She swims forward, clicking continuously, and turns when echoes indicate a sandbar or bank. It\'s pure reactive navigation — the same algorithm your robot would use. Millions of years of evolution produced the same solution as modern robotics.',
      checkQuestion: 'A robot is 20cm wide. Its sonar reads: left (60°) = 40cm, center (90°) = 15cm, right (120°) = 80cm. What should it do?',
      checkAnswer: 'The center reading (15cm) is dangerously close — stop forward motion. Right (80cm) has much more space than left (40cm). Turn right. The decision rule: pick the direction with the largest distance reading.',
      codeIntro: 'Simulate a robot making navigation decisions from sonar.',
      code: `// Level 2, Lesson 5: Obstacle avoidance
// Read sonar, decide direction

void setup() {
  pinMode(2, OUTPUT);  // LED: brightness = danger level
  Serial.println("=== Robot Navigation ===");
  Serial.println("");
}

void loop() {
  // Scenario 1: Clear path
  Serial.println("--- Scan ---");
  Serial.println("Left (60°): 150cm");
  Serial.println("Center (90°): 200cm");
  Serial.println("Right (120°): 180cm");
  Serial.println("Decision: GO FORWARD ✓");
  analogWrite(2, 30);
  delay(800);

  // Scenario 2: Obstacle ahead
  Serial.println("");
  Serial.println("--- Scan ---");
  Serial.println("Left (60°): 45cm");
  Serial.println("Center (90°): 18cm ← OBSTACLE!");
  Serial.println("Right (120°): 90cm");
  Serial.println("Decision: TURN RIGHT (more space)");
  analogWrite(2, 220);
  delay(800);

  // Scenario 3: Narrow gap
  Serial.println("");
  Serial.println("--- Scan ---");
  Serial.println("Left (60°): 25cm");
  Serial.println("Center (90°): 35cm");
  Serial.println("Right (120°): 22cm");
  Serial.println("Decision: SLOW FORWARD (tight but passable)");
  analogWrite(2, 150);
  delay(800);

  Serial.println("");
  analogWrite(2, 0);
  delay(400);
}`,
      ledCount: 1,
      challenge: 'What if all three readings are < 20cm? The robot is cornered. The fallback: reverse and re-scan. Good obstacle avoidance always has a "stuck" recovery strategy.',
      successHint: 'You just designed a robot brain — sense, decide, act. The same three-step loop runs in every autonomous vehicle, from toy robots to self-driving cars.',
    },
    {
      title: 'The complete sonar system — from dolphin to robot',
      concept: `You've built a complete sonar engineering pipeline:

**Level 1**: Physics (sound + echoes), distance formula, proximity alerts, temperature correction, noise filtering

**Level 2**: Real hardware (HC-SR04), servo scanning, data logging, coordinate conversion, obstacle avoidance

**Level 3** would add: SLAM (Simultaneous Localization and Mapping), Kalman filtering, sensor fusion (sonar + camera + IMU), and ROS (Robot Operating System) integration.

The same principles power:
- **Parking sensors** in every car
- **Autonomous vacuum robots** (Roomba uses IR + bump + optional LiDAR)
- **Underwater ROVs** for ocean exploration
- **Medical ultrasound** — same physics, different frequency
- **Bat and dolphin echolocation** — nature's original sonar`,
      storyConnection: 'Nabajit closed his eyes and learned to see with sound. You\'ve learned to build the technology that does the same — and to teach a robot to navigate the way a dolphin does. The river dolphin\'s secret is no longer a secret. It\'s an engineering specification.',
      codeIntro: 'Summary of the complete system.',
      code: `// Level 2, Lesson 6: Complete Sonar System
// Everything combined

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("================================");
  Serial.println("  SONAR NAVIGATION SYSTEM v2.0");
  Serial.println("================================");
  Serial.println("");
  Serial.println("Hardware:");
  Serial.println("  HC-SR04 ultrasonic sensor");
  Serial.println("  SG90 servo motor (0-180°)");
  Serial.println("  Arduino Uno");
  Serial.println("");
  Serial.println("Capabilities:");
  Serial.println("  ✓ Distance measurement (2-400cm)");
  Serial.println("  ✓ Temperature correction");
  Serial.println("  ✓ Noise filtering (trimmed mean)");
  Serial.println("  ✓ 180° servo sweep");
  Serial.println("  ✓ CSV data logging");
  Serial.println("  ✓ Polar→Cartesian mapping");
  Serial.println("  ✓ Obstacle avoidance logic");
  Serial.println("");
  Serial.println("From one formula: d = v × t / 2");
  Serial.println("To a complete navigation system.");
}

void loop() {
  Serial.println("Scanning...");
  analogWrite(2, 100);
  delay(500);
  Serial.println("Clear path detected. Moving forward.");
  analogWrite(2, 30);
  delay(1000);
}`,
      ledCount: 1,
      challenge: 'The entire system — from physics to robot navigation — grew from one formula and one story about a blind dolphin who sees with sound.',
      successHint: 'From "the dolphin\'s secret" to a complete sonar engineering toolkit. You understand the physics, the hardware, the data, and the decisions. Level 3 adds SLAM and sensor fusion.',
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
      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <SonarMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
