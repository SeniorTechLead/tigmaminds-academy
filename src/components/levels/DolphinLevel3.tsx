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
    <div id={`L3-{number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
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
        <ArduinoPlayground starterCode={lesson.code} title={`Sonar ${number}`} ledCount={lesson.ledCount || 1} sonarMode />
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

export default function DolphinLevel3() {
  const lessons: SonarLesson[] = [
    {
      title: 'SLAM — simultaneous localization and mapping',
      concept: `The river dolphin navigates murky water where visibility is zero. It must simultaneously figure out **where it is** and **what the environment looks like** — using only sonar echoes. This is the **SLAM problem**, one of the most important challenges in robotics.

**Why SLAM is hard:**
- To know where you are, you need a map (to match your observations against).
- To build a map, you need to know where you are (to place observations correctly).
- Both are unknown. You must solve them together.

**How SLAM works:**
1. **Observe** — take sensor readings (sonar distances, camera images, LiDAR points).
2. **Match** — find features in the new observation that match previously seen features (landmarks).
3. **Estimate position** — based on matched features, calculate where you must be relative to them.
4. **Update map** — add new features to the map at positions relative to your estimated location.
5. **Loop closure** — when you revisit a previously mapped area, use the match to correct accumulated drift errors.

**Types of SLAM:**
- **EKF-SLAM** — uses Extended Kalman Filter, tracks landmarks as Gaussian distributions. Works well with few landmarks (<100).
- **Particle filter SLAM (FastSLAM)** — represents possible positions as particles. Scales better.
- **Graph-based SLAM** — represents poses and landmarks as nodes in a graph, optimizes with least-squares. Used in modern systems.
- **Visual SLAM (vSLAM)** — uses camera images. ORB-SLAM, LSD-SLAM. Your phone's AR features use this.

The dolphin's brain solves SLAM in real-time, continuously, using biological neural networks. Our robots use math.`,
      analogy: 'Imagine waking up in a dark, unfamiliar house. You feel along the walls, counting steps. "I turned left after 5 steps, hit a wall after 3 more." You\'re building a mental map (mapping) while tracking your position in it (localization) — simultaneously. Every step updates both. That\'s SLAM. Now imagine doing it at 10 meters per second underwater.',
      storyConnection: 'When Nabajit\'s dolphin navigated the flood-changed Brahmaputra, the river\'s geography had shifted — old channels were gone, new ones had opened. The dolphin couldn\'t rely on memory alone. It had to re-map the river in real-time while navigating it — biological SLAM under the most challenging conditions imaginable.',
      checkQuestion: 'Your robot has traveled 10 meters down a corridor using wheel odometry. It then sees a landmark it mapped at the start. Odometry says it\'s 10.3m from start, but the landmark match says 9.8m. Which do you trust?',
      checkAnswer: 'Neither completely — you fuse them. Odometry drifts over time (wheel slip, imperfect calibration), so 10.3m has accumulated error. The landmark match is more reliable for absolute position but has its own measurement noise. A Kalman filter would compute a weighted average based on the uncertainty of each: maybe 9.9m. Loop closure (re-observing a known landmark) is the most powerful tool in SLAM for correcting drift.',
      codeIntro: 'Simulate a robot performing simple SLAM in a corridor — building a map while localizing.',
      code: `// SLAM Simulator: Map building + localization
// A robot in a corridor with sonar

void setup() {
  Serial.println("==============================");
  Serial.println("  SLAM: Sonar-Based Mapping");
  Serial.println("==============================");
  Serial.println("Robot: 2-wheel differential drive");
  Serial.println("Sensor: HC-SR04 on servo (0-180°)");
  Serial.println("Environment: L-shaped corridor");
  Serial.println("");
}

void loop() {
  // Step 1: Initial observation
  Serial.println("=== STEP 1: Initial Scan ===");
  Serial.println("Position estimate: (0, 0) [start]");
  Serial.println("Sonar sweep:");
  Serial.println("   0°: 120cm (right wall)");
  Serial.println("  90°: 300cm (corridor ahead)");
  Serial.println(" 180°: 115cm (left wall)");
  Serial.println("");
  Serial.println("Map update: corridor width ~235cm");
  Serial.println("Landmarks: L1(right wall), L2(left wall)");
  analogWrite(2, 100);
  delay(600);

  // Step 2: Move forward
  Serial.println("=== STEP 2: Move Forward 100cm ===");
  Serial.println("Odometry: dx=100cm, dy=0cm");
  Serial.println("Position estimate: (100, 0)");
  Serial.println("Sonar sweep:");
  Serial.println("   0°: 118cm (right wall — drift?)");
  Serial.println("  90°: 200cm (corridor continues)");
  Serial.println(" 180°: 117cm (left wall)");
  Serial.println("");
  Serial.println("Correction: walls should be at same distance");
  Serial.println("  Odometry said x=100, but wall distance");
  Serial.println("  suggests x=101.5 (slight wheel slip)");
  Serial.println("  Corrected position: (101.5, 0)");
  analogWrite(2, 150);
  delay(600);

  // Step 3: Turn detected
  Serial.println("=== STEP 3: Move Forward, Corner! ===");
  Serial.println("Odometry: dx=200cm total");
  Serial.println("Sonar sweep:");
  Serial.println("   0°: 119cm (right wall)");
  Serial.println("  90°:  45cm (WALL AHEAD!)");
  Serial.println(" 135°: 180cm (opening to the left!)");
  Serial.println(" 180°: 116cm (left wall)");
  Serial.println("");
  Serial.println("Map update: T-junction or corner at ~250cm");
  Serial.println("Landmark L3: corner point (245, 0)");
  Serial.println("New corridor extends at 90° left");
  analogWrite(2, 255);
  delay(600);

  // Step 4: Turn and continue
  Serial.println("=== STEP 4: Turn Left 90°, Continue ===");
  Serial.println("Gyro: turned 88° (not exactly 90°)");
  Serial.println("Correcting heading with wall alignment...");
  Serial.println("Position: (245, 0), heading: 90°");
  Serial.println("Sonar sweep:");
  Serial.println("   0°: 200cm (new corridor right wall)");
  Serial.println("  90°: 350cm (long corridor ahead)");
  Serial.println(" 180°: 195cm (new corridor left wall)");
  Serial.println("");
  Serial.println("Map: L-shaped corridor mapped!");
  analogWrite(2, 100);
  delay(600);

  // Step 5: Loop closure
  Serial.println("=== STEP 5: Loop Closure! ===");
  Serial.println("After full circuit, robot returns to start");
  Serial.println("Odometry says position: (8, -5)");
  Serial.println("  (should be (0,0) — 9.4cm drift!)");
  Serial.println("");
  Serial.println("Landmark L1 re-detected (right wall @start)");
  Serial.println("Landmark match: position is (0, 0)");
  Serial.println("Drift correction: 9.4cm over 800cm travel");
  Serial.println("  = 1.2% odometry error (typical)");
  Serial.println("");
  Serial.println("Distributing correction across all poses...");
  Serial.println("Map refined. SLAM loop closed.");
  analogWrite(2, 255);
  delay(300);
  analogWrite(2, 0);
  delay(300);
  analogWrite(2, 255);
  delay(300);
  analogWrite(2, 0);

  Serial.println("");
  Serial.println("=== FINAL MAP ===");
  Serial.println("+-----+");
  Serial.println("|     |");
  Serial.println("|  S  +---+");
  Serial.println("|         |");
  Serial.println("+---------+");
  Serial.println("S = Start, corridor 235cm wide");
  Serial.println("5 landmarks, 1 loop closure");
  Serial.println("Position accuracy: +/- 2cm");
  Serial.println("");

  delay(2000);
}`,
      ledCount: 1,
      challenge: 'The biggest weakness of sonar-based SLAM: specular reflections. If the sonar hits a smooth wall at an angle, the sound bounces away instead of returning — you get a false "no obstacle" reading. Real systems use multiple sensor types to compensate. Consider: how would you detect specular reflection in your readings?',
      successHint: 'SLAM is the foundation of autonomous navigation — from Roomba vacuums to Mars rovers to self-driving cars. The dolphin solves it instinctively; engineers solve it with probability theory. You now understand the core loop: observe, match, estimate, update, close loops.',
    },
    {
      title: 'Sensor fusion — combining sonar, IMU, and encoders',
      concept: `No single sensor tells the whole truth. Sonar is accurate for distance but slow (10 readings/second) and has a narrow beam. An **IMU** (Inertial Measurement Unit) gives angular velocity and acceleration at 100+ Hz but drifts over time. **Wheel encoders** track distance traveled but slip on wet surfaces.

**Sensor fusion** combines multiple imperfect sensors into one reliable estimate. Each sensor has strengths and weaknesses:

| Sensor | Measures | Rate | Strength | Weakness |
|--------|----------|------|----------|----------|
| Sonar | Distance to obstacles | 10 Hz | Absolute distance | Slow, narrow beam, specular |
| IMU (gyro) | Angular velocity | 200 Hz | Fast, no contact | Drift accumulates |
| IMU (accel) | Acceleration | 200 Hz | Absolute tilt reference | Noisy, vibration-sensitive |
| Encoders | Wheel rotation | 100 Hz | Precise short-term | Wheel slip, no absolute ref |

**The fusion strategy:**
- Use **encoders** for short-term position tracking (between sonar readings).
- Use **IMU gyro** for heading (corrected by magnetometer and landmark observations).
- Use **sonar** for absolute distance to landmarks (corrected by temperature).
- Weight each by its **confidence** (inverse of uncertainty). A sensor reading you trust more gets more weight.

**The complementary filter** is the simplest fusion approach:
\`heading = 0.98 × (heading + gyro_rate × dt) + 0.02 × magnetometer_heading\`
This trusts the gyro for short-term changes (fast, smooth) but slowly corrects toward the magnetometer (drift-free but noisy). The 98/2 split is tunable.

In production systems, the **Kalman filter** (next lesson) replaces the complementary filter with an optimal, mathematically rigorous fusion.`,
      analogy: 'Imagine navigating a boat in fog using three advisors: one has a compass (IMU — knows direction but drifts), one counts paddle strokes (encoder — knows distance but misses currents), one shouts and listens for echoes (sonar — knows absolute position but is slow). None is fully reliable alone. But combine their information intelligently — weighing each by reliability — and you navigate accurately. That\'s sensor fusion.',
      storyConnection: 'Nabajit\'s dolphin doesn\'t rely solely on echolocation. It also senses water currents through its skin (like an IMU detecting flow), uses its whiskers to detect nearby objects by water pressure changes (a close-range sensor), and remembers the river\'s geography from past trips (prior map). The dolphin fuses all these inputs instinctively. Our robot must do it with math.',
      checkQuestion: 'Your robot\'s gyro says it turned 92° in the last second. The magnetometer says heading is 87°. The gyro updates 200x/sec (smooth but drifts). The magnetometer updates 10x/sec (noisy but drift-free). How do you combine them?',
      checkAnswer: 'Complementary filter: heading = 0.98 × (prev_heading + gyro_delta) + 0.02 × magnetometer. The gyro dominates short-term (smooth tracking of fast turns) while the magnetometer slowly corrects drift. Over 50 seconds, the magnetometer correction accumulates to dominate: 0.02 × 50/dt eventually corrects any drift. The 98/2 ratio is chosen based on how quickly the gyro drifts vs. how noisy the magnetometer is.',
      codeIntro: 'Simulate sensor fusion: combine noisy sonar, drifting gyro, and slipping encoders into one accurate position estimate.',
      code: `// Sensor Fusion: Combining 3 imperfect sensors
// Sonar + IMU + Encoders -> accurate position

void setup() {
  Serial.println("==============================");
  Serial.println("  SENSOR FUSION ENGINE");
  Serial.println("==============================");
  Serial.println("Sensors:");
  Serial.println("  Sonar HC-SR04: 10 Hz, +/-3cm");
  Serial.println("  IMU MPU6050: 200 Hz, gyro drift 1°/min");
  Serial.println("  Encoders: 100 Hz, 0.5% slip on wet");
  Serial.println("");
}

void loop() {
  // Show individual sensor readings (all imperfect)
  Serial.println("=== RAW SENSOR DATA (t=5.0s) ===");
  Serial.println("True position: x=150cm, heading=45°");
  Serial.println("");

  Serial.println("Encoder odometry:");
  Serial.println("  Distance: 153.2cm (3.2cm drift from slip)");
  Serial.println("  Heading: 44.1° (from differential drive)");
  Serial.println("  Confidence: HIGH short-term, degrades");
  analogWrite(2, 80);
  delay(400);

  Serial.println("");
  Serial.println("IMU (gyroscope):");
  Serial.println("  Heading: 46.8° (1.8° drift accumulated)");
  Serial.println("  Angular rate: 0.0°/s (stationary)");
  Serial.println("  Confidence: HIGH for rotation, LOW absolute");
  delay(400);

  Serial.println("");
  Serial.println("Sonar scan:");
  Serial.println("  Front wall: 47cm (true: 48cm, noise: -1cm)");
  Serial.println("  Right wall: 112cm (true: 110cm, noise: +2cm)");
  Serial.println("  Confidence: HIGH absolute, LOW rate");
  delay(400);

  Serial.println("");
  Serial.println("=== FUSION (Complementary Filter) ===");
  Serial.println("");

  // Heading fusion
  Serial.println("Heading fusion:");
  Serial.println("  Gyro integrated: 46.8°");
  Serial.println("  Wall alignment:  44.5° (from sonar geometry)");
  Serial.println("  Fused: 0.95 x 46.8 + 0.05 x 44.5 = 46.7°");
  Serial.println("  After 20 cycles: converges to ~45.0° (true)");
  delay(400);

  Serial.println("");
  Serial.println("Position fusion:");
  Serial.println("  Encoder: (153.2, 0) rotated by heading");
  Serial.println("  Sonar triangulation: (149.5, 1.2)");
  Serial.println("  Weights: encoder 0.7, sonar 0.3");
  Serial.println("  Fused: (152.1, 0.4)");
  Serial.println("  True:  (150.0, 0.0)");
  Serial.println("  Error: 2.1cm (vs 3.2cm encoder-only)");
  analogWrite(2, 200);
  delay(500);

  Serial.println("");
  Serial.println("=== SENSOR HEALTH MONITOR ===");
  Serial.println("Sensor    | Status  | Noise | Drift");
  Serial.println("----------+---------+-------+------");
  Serial.println("Encoder L |   OK    | 0.5%  | 2.1%");
  Serial.println("Encoder R |   OK    | 0.5%  | 2.3%");
  Serial.println("Gyro Z    |   OK    | 0.2°  | 1.8°");
  Serial.println("Accel X   |   OK    | 15mg  | n/a");
  Serial.println("Sonar     |   OK    | 2cm   | n/a");
  Serial.println("Magneto   | CALIB!  | 5°    | n/a");
  Serial.println("");
  Serial.println("Warning: magnetometer needs recalibration");
  Serial.println("  (likely near ferrous metal)");
  Serial.println("  Reducing magnetometer weight to 0.01");

  analogWrite(2, 0);
  delay(300);
  analogWrite(2, 150);
  delay(300);
  analogWrite(2, 0);
  Serial.println("");

  delay(1500);
}`,
      ledCount: 1,
      challenge: 'What happens when a sensor fails? A robust fusion system detects outliers and reduces that sensor\'s weight to zero. Implement a check: if sonar returns 0 (sensor disconnected) or >400cm (out of range), exclude it from fusion and rely on encoder + IMU until sonar recovers.',
      successHint: 'Sensor fusion is the core of every autonomous system. Self-driving cars fuse LiDAR, cameras, radar, GPS, and IMU. Drones fuse barometer, GPS, IMU, and optical flow. The math scales: more sensors = more redundancy = more accuracy. Your robot is now more reliable than any single sensor.',
    },
    {
      title: 'Kalman filter — optimal state estimation',
      concept: `The complementary filter works, but it's hand-tuned (you pick the 0.98/0.02 ratio by feel). The **Kalman filter** is the mathematically optimal solution — it automatically computes the ideal weight for each sensor based on their measured noise characteristics.

**The Kalman filter in 5 steps:**
1. **Predict** — use the motion model to predict where the robot should be: \`x_predicted = x_previous + velocity × dt\`
2. **Predict uncertainty** — the prediction isn't perfect, so uncertainty grows: \`P_predicted = P_previous + Q\` (Q = process noise)
3. **Update** — take a sensor measurement: \`z = sonar_reading\`
4. **Compute Kalman Gain** — \`K = P_predicted / (P_predicted + R)\` where R = measurement noise. If P is large (uncertain prediction), K is large (trust the measurement more). If R is large (noisy sensor), K is small (trust the prediction more).
5. **Correct** — \`x_corrected = x_predicted + K × (z - x_predicted)\` and \`P_corrected = (1 - K) × P_predicted\`

**The key insight:** K (Kalman Gain) automatically balances prediction vs. measurement. It's not a fixed ratio like the complementary filter — it adapts as uncertainties change.

**Extended Kalman Filter (EKF):** for nonlinear systems (like a robot that can turn), you linearize the motion model at each step using Jacobian matrices. This is what most real robots use.

**Unscented Kalman Filter (UKF):** avoids linearization by propagating "sigma points" through the nonlinear model. More accurate for highly nonlinear systems but computationally heavier.

The Kalman filter was invented in 1960 and used in the Apollo moon missions for navigation. It's still the foundation of GPS, drone flight controllers, and self-driving cars.`,
      analogy: 'You\'re trying to guess your friend\'s location. Your map (prediction) says they should be at the coffee shop. Your phone (measurement) says they\'re at the park. The Kalman Gain asks: "How reliable is the map vs. the phone?" If GPS is good (low R), trust the phone. If the map was recently updated and the friend is predictable (low P), trust the map. The gain automatically computes the perfect blend.',
      storyConnection: 'The dolphin\'s brain is a biological Kalman filter. It predicts where the riverbank should be based on memory and swimming speed (prediction step), then clicks and listens for the echo (measurement step), and adjusts its mental model based on how much the echo differs from expectation (correction step). If the echo is reliable (clear water), it trusts the echo. If muddy and noisy, it relies more on memory.',
      checkQuestion: 'Your robot predicts it\'s at x=100cm (uncertainty P=25cm2). Sonar measures 95cm (sensor noise R=9cm2). What\'s the Kalman Gain? What\'s the corrected position?',
      checkAnswer: 'K = P / (P + R) = 25 / (25 + 9) = 0.735. Corrected: x = 100 + 0.735 × (95 - 100) = 100 - 3.68 = 96.32cm. The filter trusts the sonar more (K=0.735) because the prediction uncertainty (P=25) is larger than the measurement noise (R=9). New uncertainty: P = (1 - 0.735) × 25 = 6.6cm2 — much lower than either source alone. That\'s the Kalman filter\'s superpower: the fused estimate is more accurate than any individual input.',
      codeIntro: 'Implement a 1D Kalman filter that tracks robot position from noisy encoder and sonar data.',
      code: `// Kalman Filter: Optimal State Estimation
// Tracking robot position with noisy sensors

void setup() {
  Serial.println("==============================");
  Serial.println("  KALMAN FILTER DEMO");
  Serial.println("==============================");
  Serial.println("Tracking 1D position of robot in corridor");
  Serial.println("True position moves: 0 -> 200cm");
  Serial.println("");
  Serial.println("Process noise Q: 4 cm^2 (model imperfection)");
  Serial.println("Measurement noise R: 9 cm^2 (sonar noise)");
  Serial.println("");
}

void loop() {
  Serial.println("Step | True | Predict | Measure | Kalman |  K   |  P");
  Serial.println("-----+------+---------+---------+--------+------+-----");

  // Simulate Kalman filter steps
  // Initial state: x=0, P=100 (very uncertain)
  // Robot moves 20cm per step, sonar measures with noise

  // Step 1 — high uncertainty, low confidence tone
  Serial.println("  1  |  20  |  20.0   |  22.3   | 21.9   | 0.92 | 8.3");
  analogWrite(2, 30);
  tone(8, 300);
  delay(350);

  // Step 2 — confidence growing
  Serial.println("  2  |  40  |  41.9   |  38.5   | 39.3   | 0.58 | 5.5");
  analogWrite(2, 60);
  tone(8, 500);
  delay(350);

  // Step 3
  Serial.println("  3  |  60  |  59.3   |  63.1   | 61.0   | 0.51 | 4.8");
  analogWrite(2, 90);
  tone(8, 700);
  delay(350);

  // Step 4
  Serial.println("  4  |  80  |  81.0   |  77.8   | 79.5   | 0.49 | 4.5");
  analogWrite(2, 120);
  tone(8, 900);
  delay(350);

  // Step 5
  Serial.println("  5  | 100  |  99.5   | 102.1   | 100.7  | 0.49 | 4.4");
  analogWrite(2, 150);
  tone(8, 1000);
  delay(350);

  // Step 6 — converging
  Serial.println("  6  | 120  | 120.7   | 118.4   | 119.6  | 0.48 | 4.3");
  analogWrite(2, 180);
  tone(8, 1100);
  delay(350);

  // Step 7
  Serial.println("  7  | 140  | 139.6   | 143.5   | 141.5  | 0.48 | 4.3");
  analogWrite(2, 210);
  tone(8, 1200);
  delay(350);

  // Step 8 — high confidence, high pitch
  Serial.println("  8  | 160  | 161.5   | 158.2   | 159.9  | 0.48 | 4.3");
  analogWrite(2, 240);
  tone(8, 1200);
  delay(350);
  noTone(8);

  Serial.println("");
  Serial.println("=== ANALYSIS ===");
  Serial.println("Kalman Gain K converges to ~0.48");
  Serial.println("  (balances Q=4 process vs R=9 measurement)");
  Serial.println("  Steady-state: K = (-Q + sqrt(Q^2 + 4QR)) / 2");
  Serial.println("             = (-4 + sqrt(16 + 144)) / 2");
  Serial.println("             = (-4 + 12.65) / 2 = 4.32");
  Serial.println("             K = 4.32 / (4.32 + 9) = 0.48");
  Serial.println("");

  Serial.println("Error comparison:");
  Serial.println("  Prediction only (encoder): avg 1.2cm error");
  Serial.println("  Measurement only (sonar):  avg 2.8cm error");
  Serial.println("  Kalman filtered:           avg 0.8cm error");
  Serial.println("  -> 33% better than best single sensor!");
  Serial.println("");

  Serial.println("Uncertainty P converges to 4.3 cm^2");
  Serial.println("  = sqrt(4.3) = 2.1cm standard deviation");
  Serial.println("  95% confidence: position +/- 4.2cm");
  Serial.println("");

  analogWrite(2, 255);
  delay(300);
  analogWrite(2, 0);
  delay(300);
  analogWrite(2, 255);
  delay(300);
  analogWrite(2, 0);

  delay(1500);
}`,
      ledCount: 1,
      challenge: 'What if the sonar suddenly fails (returns 0)? In a robust system, you detect this and set R to infinity for that timestep, making K=0 — the filter ignores the measurement and relies entirely on prediction. This is called "measurement rejection" and is critical for real-world robustness.',
      successHint: 'The Kalman filter is arguably the most important algorithm in engineering. It guided Apollo to the moon, it runs in every GPS receiver, every drone flight controller, every self-driving car. You now understand its core: predict, measure, weight by confidence, correct. The rest is implementation details.',
    },
    {
      title: 'Path planning — A* algorithm and obstacle avoidance',
      concept: `Your robot can localize (SLAM), fuse sensors, and filter noise. Now it needs to **decide where to go**. Path planning answers: "Given a map with obstacles, what's the shortest safe route from A to B?"

**A* (A-star) algorithm:**
The gold standard for grid-based path planning. It combines two costs:
- **g(n)** — actual cost from start to node n (distance traveled)
- **h(n)** — heuristic estimate from n to goal (straight-line distance)
- **f(n) = g(n) + h(n)** — total estimated cost through n

A* explores the node with the lowest f(n) first. The heuristic guides the search toward the goal (unlike Dijkstra's, which explores equally in all directions). If h(n) is admissible (never overestimates), A* is guaranteed to find the optimal path.

**Obstacle avoidance layers:**
1. **Global planner** — A* on the known map. Plans the overall route.
2. **Local planner** — adjusts the path in real-time to avoid unexpected obstacles (a person walking by, a moved chair). Uses algorithms like DWA (Dynamic Window Approach) or VFH (Vector Field Histogram).
3. **Emergency stop** — if an obstacle is too close (< safety margin), stop immediately. No planning, just brakes.

**Costmap:**
The map isn't binary (obstacle/free). It has costs:
- Obstacle cells: infinite cost (impassable)
- Inflation layer: high cost near obstacles (keep a safe distance)
- Unknown cells: moderate cost (proceed cautiously)
- Free space: low cost (preferred)

This means the robot naturally prefers the middle of a corridor over hugging a wall, without explicit rules.`,
      analogy: 'A* is like a smart hiker planning a mountain route. Dijkstra\'s algorithm would explore every trail equally — even ones going away from the summit. A* uses the straight-line distance to the summit as a heuristic, prioritizing trails that head roughly toward the goal. It still considers detours around cliffs (obstacles), but doesn\'t waste time exploring trails to nowhere.',
      storyConnection: 'Nabajit\'s father navigated the flood-stage Brahmaputra by choosing a path that balanced speed (shortest route to the fishing grounds) and safety (avoiding submerged trees and sandbars). The dolphin guided them along this optimal path — her biological path planner accounting for obstacles detected by sonar. A* is the computational version of the dolphin\'s navigation instinct.',
      checkQuestion: 'On a 10x10 grid, the start is (0,0) and the goal is (9,9). There\'s a wall from (5,0) to (5,7). A* with Manhattan distance heuristic would first explore toward the wall. What happens when it hits the wall?',
      checkAnswer: 'A* doesn\'t get "stuck" — it explores the wall cells and finds they have infinite cost (impassable). It then expands nodes above and below the wall gap. Nodes that go around the wall at (5,8) have higher g cost (longer path) but the heuristic still guides them toward the goal. A* automatically finds the path that goes around the wall through the gap at (5,8)-(5,9). Total path length: ~18 cells instead of 18 straight (diagonal) — the wall adds only the detour cost.',
      codeIntro: 'Simulate A* pathfinding on a grid with obstacles and watch the algorithm explore.',
      code: `// A* Path Planning Simulator
// Finding the optimal path through a mapped environment

void setup() {
  Serial.println("==============================");
  Serial.println("  A* PATH PLANNER");
  Serial.println("==============================");
  Serial.println("");
  Serial.println("Grid: 8x6 | Start: S(0,0) | Goal: G(7,5)");
  Serial.println("# = obstacle | . = free | * = path");
  Serial.println("");
}

void loop() {
  // Show the grid
  Serial.println("=== MAP (from SLAM) ===");
  Serial.println("  0 1 2 3 4 5 6 7");
  Serial.println("0 S . . . . . . .");
  Serial.println("1 . . # # # . . .");
  Serial.println("2 . . . . # . . .");
  Serial.println("3 . # # . # . . .");
  Serial.println("4 . . # . . . # .");
  Serial.println("5 . . . . . . . G");
  Serial.println("");
  delay(600);

  // A* exploration
  Serial.println("=== A* EXPLORATION ===");
  Serial.println("Step 1: Start (0,0) f=0+10.6=10.6");
  Serial.println("  Open: [(0,0)]");
  analogWrite(2, 40);
  delay(300);

  Serial.println("Step 2: Expand (0,0) -> neighbors");
  Serial.println("  (1,0) g=1 h=10.0 f=11.0");
  Serial.println("  (0,1) g=1 h=9.9  f=10.9");
  Serial.println("  Open: [(0,1), (1,0)]");
  analogWrite(2, 60);
  delay(300);

  Serial.println("Step 3: Expand (0,1) f=10.9");
  Serial.println("  (1,1) g=2 h=9.2 f=11.2");
  Serial.println("  Skipping (0,2)# = obstacle neighbor");
  analogWrite(2, 80);
  delay(300);

  Serial.println("Step 4-8: Exploring around obstacles...");
  Serial.println("  Nodes explored: 12");
  Serial.println("  Obstacle hits: 4 (backtrack)");
  analogWrite(2, 120);
  delay(300);

  Serial.println("Step 9-15: Finding gap in obstacles...");
  Serial.println("  Path through (3,3) -> (3,4) -> (4,4)");
  Serial.println("  Nodes explored: 23");
  analogWrite(2, 180);
  delay(300);

  Serial.println("Step 16-20: Clear path to goal!");
  Serial.println("  (5,4) -> (5,5) -> (6,5) -> (7,5)");
  Serial.println("  Nodes explored: 28 (of 48 total)");
  analogWrite(2, 255);
  delay(400);

  Serial.println("");
  Serial.println("=== OPTIMAL PATH FOUND ===");
  Serial.println("  0 1 2 3 4 5 6 7");
  Serial.println("0 S . . . . . . .");
  Serial.println("1 * . # # # . . .");
  Serial.println("2 * . . . # . . .");
  Serial.println("3 * # # * # . . .");
  Serial.println("4 . . # * * * # .");
  Serial.println("5 . . . . . * * G");
  Serial.println("");
  Serial.println("Path length: 12 steps");
  Serial.println("Nodes explored: 28 / 48 (42% of grid)");
  Serial.println("  Dijkstra would explore: 45 / 48 (94%)");
  Serial.println("  A* saved: 52% computation!");
  delay(500);

  // Costmap inflation
  Serial.println("");
  Serial.println("=== COSTMAP (with inflation) ===");
  Serial.println("Cost near obstacles inflated for safety:");
  Serial.println("  0 1 2 3 4 5 6 7");
  Serial.println("0 0 0 1 2 2 1 0 0");
  Serial.println("1 0 1 X X X 1 0 0");
  Serial.println("2 0 1 2 2 X 1 0 0");
  Serial.println("3 1 X X 1 X 1 0 0");
  Serial.println("4 0 1 X 1 1 0 1 0");
  Serial.println("5 0 0 1 0 0 0 0 0");
  Serial.println("X=obstacle, 1-2=inflation (avoid)");
  Serial.println("Inflated path avoids wall-hugging!");

  analogWrite(2, 0);
  Serial.println("");
  delay(2000);
}`,
      ledCount: 1,
      challenge: 'Replace Manhattan distance heuristic with Euclidean distance: h = sqrt((gx-x)^2 + (gy-y)^2). Euclidean is tighter (closer to true cost for 8-directional movement) so A* explores even fewer nodes. But Manhattan is faster to compute. In practice, the heuristic choice depends on whether speed or optimality matters more.',
      successHint: 'A* is used in every robot, every game, every GPS navigator. You understand the core: prioritize exploration toward the goal while guaranteeing optimality. Combined with SLAM (map) and sensor fusion (localization), your robot can now navigate autonomously.',
    },
    {
      title: 'ROS introduction — Robot Operating System',
      concept: `Building a robot from scratch means writing code for sensors, motors, path planning, SLAM, and communication — all while making them work together. **ROS** (Robot Operating System) is a framework that handles the plumbing so you can focus on the robotics.

ROS is NOT an operating system. It's a **middleware** — a set of tools and conventions that sit between your OS (Ubuntu Linux) and your robot code. Think of it as a standardized communication bus.

**Core concepts:**

**Nodes** — independent processes that each do one thing. Your robot might have:
- \`/sonar_driver\` — reads HC-SR04, publishes distances
- \`/imu_driver\` — reads MPU6050, publishes orientation
- \`/slam_node\` — subscribes to sonar + IMU, publishes map
- \`/path_planner\` — subscribes to map, publishes waypoints
- \`/motor_controller\` — subscribes to waypoints, drives motors

**Topics** — named channels for data. Nodes publish to and subscribe from topics:
- \`/scan\` — sonar scan data (publisher: sonar_driver, subscriber: slam_node)
- \`/odom\` — odometry (publisher: encoder_driver, subscriber: slam_node)
- \`/cmd_vel\` — velocity commands (publisher: path_planner, subscriber: motor_controller)
- \`/map\` — occupancy grid (publisher: slam_node, subscriber: path_planner)

**Messages** — structured data types. \`sensor_msgs/Range\` has fields: range, min_range, max_range, field_of_view. Standardized so any sonar driver works with any SLAM algorithm.

**Services** — request/response (like REST APIs for robots). \`/set_goal (x, y)\` → returns success/failure.

**Why ROS matters:**
- Swap components without rewriting everything (new SLAM algorithm? Just replace the node)
- Thousands of existing packages (drivers, algorithms, visualizers)
- Record and replay data with \`rosbag\` for debugging
- Visualize in RViz: see sensor data, maps, paths in 3D
- Simulate in Gazebo before building hardware`,
      analogy: 'ROS is like a city\'s road system. Each building (node) is independent — a hospital, a school, a factory. They communicate by sending vehicles (messages) along roads (topics). The city doesn\'t care what happens inside each building; it just provides the infrastructure for them to exchange goods and information. You can tear down and rebuild one building without affecting the others, as long as the roads still connect.',
      storyConnection: 'If Dipankar\'s library network grew to 50 locations, he\'d need a system: each library operates independently (node), sends inventory updates through a central catalog (topic), and follows standardized book formats (messages). ROS is that system for robots — modular, standardized, scalable. The dolphin\'s brain integrates its senses seamlessly; ROS gives our robots the same integration capability.',
      checkQuestion: 'Your robot has a sonar driver node publishing to /scan at 10 Hz, and a SLAM node subscribing. You want to add a second sonar (rear-facing). How does ROS make this easy?',
      checkAnswer: 'Launch a second instance of the sonar driver node, configured for the rear sensor, publishing to /scan_rear. The SLAM node subscribes to BOTH /scan (front) and /scan_rear (rear). No changes to the SLAM code — it just receives more data. In ROS2, you can also remap topics: two identical driver nodes, each remapped to a different topic. Modularity means adding sensors is additive, not multiplicative in complexity.',
      codeIntro: 'Simulate a ROS-like node communication system — publishers, subscribers, and message passing.',
      code: `// ROS Concepts: Node Communication Simulator
// Simulating the pub/sub architecture of ROS

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("==============================");
  Serial.println("  ROS NODE ARCHITECTURE");
  Serial.println("==============================");
  Serial.println("");
  Serial.println("Active Nodes:");
  Serial.println("  [1] /sonar_driver    (pub: /scan)");
  Serial.println("  [2] /imu_driver      (pub: /imu/data)");
  Serial.println("  [3] /encoder_driver  (pub: /odom)");
  Serial.println("  [4] /slam_node       (sub: /scan, /odom)");
  Serial.println("                       (pub: /map)");
  Serial.println("  [5] /path_planner    (sub: /map, /goal)");
  Serial.println("                       (pub: /cmd_vel)");
  Serial.println("  [6] /motor_ctrl      (sub: /cmd_vel)");
  Serial.println("");
}

void loop() {
  // Simulate message flow through the system
  Serial.println("=== MESSAGE FLOW (1 cycle) ===");
  Serial.println("");

  // Sonar publishes
  Serial.println("[sonar_driver] Publishing to /scan:");
  Serial.println("  sensor_msgs/Range {");
  Serial.println("    header: { stamp: 1711234567.42 }");
  Serial.println("    radiation_type: ULTRASOUND");
  Serial.println("    field_of_view: 0.26 rad (15°)");
  Serial.println("    min_range: 0.02 m");
  Serial.println("    max_range: 4.00 m");
  Serial.println("    range: 0.87 m");
  Serial.println("  }");
  analogWrite(2, 80);
  delay(400);

  // IMU publishes
  Serial.println("");
  Serial.println("[imu_driver] Publishing to /imu/data:");
  Serial.println("  sensor_msgs/Imu {");
  Serial.println("    orientation: { x:0, y:0, z:0.38, w:0.92 }");
  Serial.println("    angular_velocity: { z: 0.02 rad/s }");
  Serial.println("    linear_accel: { x: 0.15 m/s2 }");
  Serial.println("  }");
  analogWrite(2, 120);
  delay(400);

  // Encoder publishes
  Serial.println("");
  Serial.println("[encoder_driver] Publishing to /odom:");
  Serial.println("  nav_msgs/Odometry {");
  Serial.println("    position: { x: 1.52, y: 0.03 }");
  Serial.println("    orientation: { yaw: 0.78 rad }");
  Serial.println("    linear_vel: 0.25 m/s");
  Serial.println("  }");
  analogWrite(2, 160);
  delay(400);

  // SLAM processes
  Serial.println("");
  Serial.println("[slam_node] Received /scan + /odom");
  Serial.println("  Fusing sensor data...");
  Serial.println("  Running EKF-SLAM...");
  Serial.println("  Publishing to /map:");
  Serial.println("  nav_msgs/OccupancyGrid {");
  Serial.println("    resolution: 0.05 m/cell");
  Serial.println("    width: 200, height: 200");
  Serial.println("    data: [0,0,0,-1,-1,100,100,...] (10x10m)");
  Serial.println("    // 0=free, 100=obstacle, -1=unknown");
  Serial.println("  }");
  analogWrite(2, 200);
  delay(400);

  // Path planner
  Serial.println("");
  Serial.println("[path_planner] Received /map + /goal(5.0, 3.0)");
  Serial.println("  Running A* on costmap...");
  Serial.println("  Path: 23 waypoints");
  Serial.println("  Publishing to /cmd_vel:");
  Serial.println("  geometry_msgs/Twist {");
  Serial.println("    linear: { x: 0.25 }  // 0.25 m/s forward");
  Serial.println("    angular: { z: 0.10 }  // slight left turn");
  Serial.println("  }");
  analogWrite(2, 240);
  delay(400);

  // Motor controller
  Serial.println("");
  Serial.println("[motor_ctrl] Received /cmd_vel");
  Serial.println("  Left motor:  PWM 180 (0.30 m/s)");
  Serial.println("  Right motor: PWM 160 (0.20 m/s)");
  Serial.println("  -> Robot turns slightly left while moving");
  analogWrite(2, 255);
  delay(400);

  Serial.println("");
  Serial.println("--- Cycle complete: 50ms total ---");
  Serial.println("   Sonar->SLAM->Plan->Move: 4 nodes, 4 topics");
  Serial.println("   Rate: 20 Hz control loop");
  Serial.println("");

  // ROS tools
  Serial.println("=== ROS TOOLS ===");
  Serial.println("$ rostopic list");
  Serial.println("  /scan  /imu/data  /odom  /map  /cmd_vel  /goal");
  Serial.println("$ rostopic hz /scan");
  Serial.println("  average rate: 10.02 Hz");
  Serial.println("$ rosbag record -a");
  Serial.println("  Recording all topics to 2024-03-25.bag");
  Serial.println("  (Replay later for debugging!)");
  Serial.println("");

  analogWrite(2, 0);
  delay(2000);
}`,
      ledCount: 1,
      challenge: 'ROS2 (the modern version) uses DDS (Data Distribution Service) instead of a central master. This means nodes can discover each other automatically on a network — no single point of failure. Research: what\'s the difference between ROS1\'s roscore-based architecture and ROS2\'s decentralized discovery?',
      successHint: 'ROS is the lingua franca of robotics. Every research lab, every robotics company, every autonomous vehicle team uses it (or something very similar). Understanding nodes, topics, and messages gives you the vocabulary to work with any robot system. The dolphin\'s neural network integrates senses; ROS integrates software.',
    },
    {
      title: 'From prototype to product — ruggedizing for the real world',
      concept: `Your sonar robot works on a lab bench. Now it needs to survive the **Brahmaputra** — water, mud, impacts, temperature swings, and weeks of autonomous operation without maintenance. The gap between demo and deployment is where most robotics projects fail.

**Waterproofing (IP ratings):**
- **IP67** — submersible to 1m for 30 minutes. Required for a river robot.
- **IP68** — continuous submersion. For deep-water operation.
- Implementation: O-ring sealed enclosures, potted connectors, conformal-coated PCBs, shaft seals on motors.

**Power for autonomy:**
- **Battery capacity**: a robot drawing 2A at 12V needs 24W. For 8 hours: 192Wh. That's about 4 × 18650 packs (48 cells).
- **Solar charging**: a 20W panel can extend operations indefinitely in good conditions.
- **Hot-swap batteries**: design for field-replaceable packs without powering down.
- **Voltage monitoring**: shut down gracefully before battery damage (Li-ion below 3.0V = permanent capacity loss).

**Communication:**
- **LoRa** — long range (2-15 km), low bandwidth (a few kbps). Perfect for telemetry: GPS position, battery status, obstacle count. Low power.
- **4G/LTE** — high bandwidth, unlimited range (where there's coverage). For sending maps, images, video.
- **WiFi** — short range (50m), high bandwidth. For dockside data download.
- **Redundancy** — use LoRa for critical telemetry, 4G for rich data when available.

**Mechanical durability:**
- **Impact resistance**: foam-padded electronics bay, shock-mounted sensors.
- **Corrosion**: marine-grade stainless fasteners, anodized aluminum frame, sacrificial zinc anodes.
- **Biofouling**: anti-fouling paint on hull surfaces. Algae and barnacles will cover everything within weeks in warm water.
- **Cable management**: strain relief on every connector. Vibration will work loose any connection without it.

**Testing protocol:**
1. Bench test — all systems on a bench, verify software
2. Tethered pool test — waterproofing, motor control, basic nav
3. Open water test (tethered) — currents, waves, turbidity
4. Free-running test — full autonomy, safety boat standing by
5. Endurance test — 48-hour continuous operation, log everything`,
      analogy: 'Building a lab prototype is like writing a song in a studio — controlled environment, unlimited retakes. Deploying to the Brahmaputra is like performing live in a monsoon — everything that can go wrong will, and you don\'t get a second take. Ruggedization is rehearsal: anticipating every failure mode and engineering around it before showtime.',
      storyConnection: 'The river dolphin doesn\'t break down. Its skin resists water intrusion, its muscles work tirelessly, its sonar functions in the muddiest conditions, and it navigates current and debris without external help. Millions of years of evolution produced this robustness. Our engineering challenge is to approach that reliability in months, not millennia. The dolphin is the standard; the robot is our attempt to match it.',
      checkQuestion: 'Your river robot\'s LoRa telemetry reports battery at 11.2V (4S Li-ion pack, nominal 14.8V). Should you recall the robot?',
      checkAnswer: 'YES, immediately. 11.2V on a 4S pack = 2.8V per cell. Li-ion cells suffer permanent damage below 3.0V/cell (12.0V for 4S). At 2.8V, you have minutes before irreversible capacity loss. The robot should have auto-returned at 12.4V (3.1V/cell = safe minimum with margin). This is a firmware bug — the low-voltage cutoff threshold is set too low. In production, this would be caught in the endurance test (step 5).',
      codeIntro: 'Simulate a complete field deployment: power monitoring, communication, environmental sensors, and autonomous mission execution.',
      code: `// Field Deployment: Autonomous River Robot
// Complete system integration for real-world operation

void setup() {
  pinMode(2, OUTPUT);
  Serial.println("=================================");
  Serial.println("  RIVER DOLPHIN ROBOT v1.0");
  Serial.println("  Field Deployment System");
  Serial.println("=================================");
  Serial.println("");
  Serial.println("Enclosure: IP67 aluminum, O-ring sealed");
  Serial.println("Power: 4S 18650 pack (14.8V, 10.4Ah)");
  Serial.println("Comms: LoRa 915MHz + 4G fallback");
  Serial.println("Sensors: 3x sonar, IMU, GPS, depth, temp");
  Serial.println("");
}

void loop() {
  // Pre-mission checklist
  Serial.println("=== PRE-MISSION CHECKLIST ===");
  Serial.println("[OK] Battery: 14.6V (98%) — 10.2Ah");
  Serial.println("[OK] GPS fix: 26.7542°N, 94.2198°E (8 sats)");
  Serial.println("[OK] IMU calibrated: gyro bias -0.3°/s");
  Serial.println("[OK] Sonar front: 142cm (test target at 150cm)");
  Serial.println("[OK] Sonar left: 98cm (dock wall)");
  Serial.println("[OK] Sonar right: 310cm (open water)");
  Serial.println("[OK] Water temp: 24.3°C");
  Serial.println("[OK] LoRa link: RSSI -67dBm (strong)");
  Serial.println("[OK] Motor test: L+R forward/reverse OK");
  Serial.println("[OK] Mission loaded: survey waypoints 1-8");
  Serial.println("");
  Serial.println("All checks passed. Launching mission.");
  analogWrite(2, 100);
  delay(800);

  // Mission execution
  Serial.println("");
  Serial.println("=== MISSION: RIVER SURVEY ===");
  Serial.println("");

  Serial.println("Waypoint 1/8: heading 045°, distance 120m");
  Serial.println("  Speed: 0.8 m/s | Current: 0.3 m/s cross");
  Serial.println("  Sonar: clear ahead (>400cm)");
  Serial.println("  SLAM: mapping riverbed contour");
  analogWrite(2, 150);
  delay(400);

  Serial.println("Waypoint 2/8: heading 090°, distance 85m");
  Serial.println("  Speed: 0.6 m/s | Debris detected!");
  Serial.println("  Local planner: avoiding at 3m clearance");
  Serial.println("  Battery: 14.2V (89%)");
  analogWrite(2, 200);
  delay(400);

  Serial.println("Waypoint 3/8: heading 135°, distance 200m");
  Serial.println("  Depth: 4.2m | Water temp: 23.8°C");
  Serial.println("  Sonar mapping: sandbar detected (1.1m depth)");
  Serial.println("  Adjusting route to avoid shallow");
  analogWrite(2, 180);
  delay(400);

  Serial.println("Waypoint 4/8: heading 180°, distance 150m");
  Serial.println("  LoRa telemetry sent: position, battery, map");
  Serial.println("  Base station ACK received");
  Serial.println("  Battery: 13.8V (78%)");
  delay(400);

  Serial.println("");
  Serial.println("=== TELEMETRY REPORT (LoRa) ===");
  Serial.println("Packet #247 | 32 bytes | RSSI -72dBm");
  Serial.println("{");
  Serial.println("  lat: 26.7548, lon: 94.2214,");
  Serial.println("  battery_v: 13.8, battery_pct: 78,");
  Serial.println("  speed: 0.6, heading: 180,");
  Serial.println("  depth: 3.8, water_temp: 23.8,");
  Serial.println("  obstacles: 2, mission: '4/8',");
  Serial.println("  status: 'NOMINAL'");
  Serial.println("}");
  delay(500);

  // Low battery scenario
  Serial.println("");
  Serial.println("=== POWER MANAGEMENT ===");
  Serial.println("Battery trend:");
  Serial.println("  Start:  14.6V (98%) — full charge");
  Serial.println("  WP 2:   14.2V (89%) — 45 min elapsed");
  Serial.println("  WP 4:   13.8V (78%) — 90 min elapsed");
  Serial.println("  WP 6:   13.2V (62%) — 135 min elapsed");
  Serial.println("  WP 7:   12.8V (48%) — WARNING threshold");
  Serial.println("");
  Serial.println("  AUTO-RETURN triggered at 12.8V");
  Serial.println("  Shortest path to dock: 340m, ~8 min");
  Serial.println("  Estimated arrival voltage: 12.4V (safe)");
  Serial.println("");
  analogWrite(2, 255);
  delay(300);
  analogWrite(2, 100);
  delay(300);
  analogWrite(2, 255);
  delay(300);

  // Mission summary
  Serial.println("=== MISSION SUMMARY ===");
  Serial.println("Waypoints completed: 7/8 (auto-return on 8th)");
  Serial.println("Distance traveled: 1,240m");
  Serial.println("Runtime: 2h 48min");
  Serial.println("Map area covered: 0.8 hectares");
  Serial.println("Obstacles detected: 7");
  Serial.println("Sandbars mapped: 2");
  Serial.println("Max depth: 6.3m | Min depth: 1.1m");
  Serial.println("LoRa packets sent: 312 (100% ACK)");
  Serial.println("GPS drift: <2m (excellent)");
  Serial.println("Battery used: 14.6V -> 12.4V (76% depleted)");
  Serial.println("");
  Serial.println("Status: MISSION SUCCESS");
  Serial.println("Data: 48MB logged, ready for download");
  Serial.println("");

  analogWrite(2, 0);
  delay(2000);
}`,
      ledCount: 1,
      challenge: 'Design a failure mode analysis (FMEA) for the river robot. List 10 things that can go wrong (sensor failure, water ingress, GPS loss, motor jam, battery death, communication loss, collision, software crash, temperature extreme, biofouling). For each: probability, severity, detection method, and mitigation. This is how aerospace and automotive engineers design reliable systems.',
      successHint: 'From a sonar sensor measuring distance on a breadboard to an autonomous river-surveying robot with SLAM, sensor fusion, Kalman filtering, path planning, ROS architecture, and field-hardened deployment. You\'ve traced the entire robotics engineering pipeline — the same one used to build underwater ROVs, Mars rovers, and autonomous vehicles. The dolphin\'s secret is now your engineering practice.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 3: Robotics Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Autonomous navigation and production robotics</span>
      </div>

      <div className="mb-8 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800">
        <p className="text-sm text-sky-800 dark:text-sky-300">
          These lessons cover advanced robotics: SLAM, sensor fusion, Kalman filtering, path planning, ROS, and field deployment. You'll build the complete software stack for an autonomous sonar-navigating robot — the same architecture used in underwater vehicles, drones, and self-driving systems.
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
