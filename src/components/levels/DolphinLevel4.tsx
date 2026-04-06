import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DolphinLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'System Design: Ultrasonic Sensor + Buzzer + Display',
      concept: `In previous levels you explored the physics of echolocation and sonar mathematics. Now you build a real **underwater-inspired sonar ranging system** using an Arduino Uno, an HC-SR04 ultrasonic sensor, a piezo buzzer for proximity alerts, and a 16x2 LCD display for distance readout.

The **HC-SR04** is a time-of-flight sensor: it emits a 40 kHz ultrasonic pulse from one transducer and listens for the echo on a second transducer. The Arduino measures the round-trip time and calculates distance using the speed of sound in air (~343 m/s at 20 degrees C). While our sensor works in air rather than water, the principle is identical to dolphin echolocation and submarine sonar.

The hardware architecture has three subsystems connected to the Arduino:

**Sensing**: HC-SR04 with TRIG (digital pin 7) and ECHO (digital pin 8). The TRIG pin receives a 10-microsecond pulse to initiate a measurement. The ECHO pin goes HIGH for a duration proportional to the round-trip time.

**Alert**: Piezo buzzer on PWM pin 3. The buzzer frequency and beep rate change with distance — fast, high-pitched beeps when close (like a parking sensor), slow low beeps when far.

**Display**: 16x2 LCD via I2C (SDA=A4, SCL=A5, address 0x27). Shows distance in centimeters, a bar graph for visual feedback, and the alert status.

Power budget: HC-SR04 draws 15 mA during measurement, LCD backlight draws ~20 mA, buzzer peaks at 30 mA. Total ~65 mA, well within USB power limits. The HC-SR04 operates at 5V logic — compatible with the Uno's pins directly.

The measurement cycle takes ~60 ms (maximum range timeout), giving us about 16 readings per second. This is our **sample rate** — fast enough for a handheld distance scanner but slow enough to avoid echo interference between consecutive pulses.`,
      analogy: 'Think of the system as a simplified dolphin: the HC-SR04 is the melon (the dolphin forehead organ that focuses outgoing clicks) and the lower jaw (which channels returning echoes to the inner ear). The buzzer is the dolphin alerting its pod to nearby obstacles. The LCD is the dolphin brain forming a mental image of the surroundings. Our Arduino ties all three together, just as the dolphin nervous system does.',
      storyConnection: 'The river dolphin navigates the murky Brahmaputra by emitting clicks and interpreting echoes — a biological sonar system perfected over millions of years. Our HC-SR04 project recreates this in electronics: emit a pulse, time the echo, calculate the distance, and alert the operator. The dolphin does this hundreds of times per second; our system manages sixteen, but the physics is identical.',
      checkQuestion: 'Why does the HC-SR04 use 40 kHz ultrasound instead of audible sound frequencies?',
      checkAnswer: 'Higher frequencies are more directional (shorter wavelength = tighter beam), which improves spatial resolution and reduces false echoes from objects to the side. 40 kHz is also above human hearing range (20 kHz), so the sensor operates silently. The tradeoff is that higher frequencies attenuate faster in air, limiting the HC-SR04 maximum range to about 4 meters. Dolphins use even higher frequencies (up to 150 kHz) for the same reason — tighter beams for better resolution.',
      codeIntro: 'Set up the Arduino sketch with pin definitions, LCD initialization, and the basic measurement framework.',
      code: `// =============================================
// Underwater Sonar Capstone — System Setup
// HC-SR04 + Buzzer + LCD on Arduino Uno
// =============================================

// --- Pin Assignments ---
const int TRIG_PIN = 7;     // HC-SR04 trigger
const int ECHO_PIN = 8;     // HC-SR04 echo
const int BUZZER_PIN = 3;   // Piezo buzzer (PWM capable)
const int LED_CLOSE = 9;    // Red LED: object very close
const int LED_MID = 10;     // Yellow LED: medium distance
const int LED_FAR = 11;     // Green LED: far / clear

// --- LCD via I2C (address 0x27, 16 columns x 2 rows) ---
// Requires LiquidCrystal_I2C library
// #include <LiquidCrystal_I2C.h>
// LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Physical Constants ---
const float SPEED_OF_SOUND = 343.0;  // m/s at 20 deg C in air
const float US_PER_CM_ROUNDTRIP = 58.2;  // microseconds per cm (round trip)
// Derivation: 1 cm = 0.01 m; round trip = 0.02 m
// time = 0.02 / 343 = 58.3 microseconds

// --- Measurement Parameters ---
const int MAX_DISTANCE_CM = 400;     // HC-SR04 max range
const int MIN_DISTANCE_CM = 2;       // HC-SR04 min range
const unsigned long TIMEOUT_US = 23200;  // 400cm round-trip timeout
const int MEASUREMENT_DELAY_MS = 60; // minimum between measurements

// --- State Variables ---
float currentDistance = 0.0;   // latest measurement in cm
float filteredDistance = 0.0;  // after running average (Lesson 3)
int measurementCount = 0;
bool objectDetected = false;

unsigned long lastMeasureMillis = 0;
unsigned long lastDisplayMillis = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("=== Underwater Sonar Ranging System ===");
  Serial.println("HC-SR04 | Buzzer | LED indicators");
  Serial.println();

  // Configure pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_CLOSE, OUTPUT);
  pinMode(LED_MID, OUTPUT);
  pinMode(LED_FAR, OUTPUT);

  // Ensure trigger starts LOW
  digitalWrite(TRIG_PIN, LOW);

  // LCD setup (uncomment when hardware connected)
  // lcd.init();
  // lcd.backlight();
  // lcd.setCursor(0, 0);
  // lcd.print("Sonar System");
  // lcd.setCursor(0, 1);
  // lcd.print("Initializing...");

  // Self-test: cycle LEDs
  Serial.println("Self-test: LED sequence...");
  int leds[] = {LED_FAR, LED_MID, LED_CLOSE};
  for (int i = 0; i < 3; i++) {
    digitalWrite(leds[i], HIGH);
    delay(300);
    digitalWrite(leds[i], LOW);
  }

  // Buzzer test: quick chirp
  tone(BUZZER_PIN, 2000, 100);
  delay(200);
  noTone(BUZZER_PIN);
  Serial.println("Self-test complete.");
  Serial.println();

  // Print CSV header for Serial Plotter
  Serial.println("count\\traw_cm\\tstatus");

  lastMeasureMillis = millis();
}

// --- Measure distance using HC-SR04 ---
float measureDistance() {
  // Send 10us trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Measure echo duration
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, TIMEOUT_US);

  if (duration == 0) {
    return -1.0;  // timeout: no echo received
  }

  // Convert to distance in cm
  float distance = duration / US_PER_CM_ROUNDTRIP;

  // Clamp to valid range
  if (distance < MIN_DISTANCE_CM) return MIN_DISTANCE_CM;
  if (distance > MAX_DISTANCE_CM) return MAX_DISTANCE_CM;

  return distance;
}

// --- Update LED indicators based on distance ---
void updateIndicators(float dist) {
  if (dist < 0) {
    // No echo: all LEDs off
    digitalWrite(LED_CLOSE, LOW);
    digitalWrite(LED_MID, LOW);
    digitalWrite(LED_FAR, LOW);
    return;
  }

  if (dist < 30) {
    digitalWrite(LED_CLOSE, HIGH);  // Red: close
    digitalWrite(LED_MID, LOW);
    digitalWrite(LED_FAR, LOW);
  } else if (dist < 100) {
    digitalWrite(LED_CLOSE, LOW);
    digitalWrite(LED_MID, HIGH);    // Yellow: medium
    digitalWrite(LED_FAR, LOW);
  } else {
    digitalWrite(LED_CLOSE, LOW);
    digitalWrite(LED_MID, LOW);
    digitalWrite(LED_FAR, HIGH);    // Green: far / clear
  }
}

void loop() {
  if (millis() - lastMeasureMillis >= MEASUREMENT_DELAY_MS) {
    lastMeasureMillis = millis();
    measurementCount++;

    currentDistance = measureDistance();
    objectDetected = (currentDistance > 0);

    updateIndicators(currentDistance);

    // Serial output
    Serial.print(measurementCount);
    Serial.print("\\t");
    if (objectDetected) {
      Serial.print(currentDistance, 1);
      Serial.print("\\t");
      if (currentDistance < 30) Serial.println("CLOSE");
      else if (currentDistance < 100) Serial.println("MEDIUM");
      else Serial.println("FAR");
    } else {
      Serial.println("-1\\tNO_ECHO");
    }
  }
}

// Upload and open Serial Monitor at 115200.
// Move your hand toward the HC-SR04 sensor and watch
// distance readings update and LEDs change color.`,
      challenge: 'Add temperature compensation: connect a TMP36 sensor to analog pin A0 and calculate the actual speed of sound using v = 331.3 + 0.606 * T (where T is temperature in Celsius). How much does the distance reading change between a cold room (15C) and a warm room (30C)?',
      successHint: 'You have the hardware platform ready: ultrasonic sensing, visual indicators, and serial output. The HC-SR04 trigger-echo protocol is the electronic equivalent of a dolphin click — a brief pulse followed by patient listening. In the next lesson, you will dig into the timing math that converts echo duration to precise distance.',
    },
    {
      title: 'Distance Measurement with HC-SR04 Timing Code',
      concept: `The HC-SR04 measurement cycle has four precise timing phases:

**1. Trigger pulse**: We hold TRIG HIGH for exactly 10 microseconds. The sensor's internal circuit uses this to generate eight 40 kHz ultrasonic pulses (a burst of 8 cycles at 25 microsecond period = 200 microseconds total burst).

**2. Echo wait**: After the burst, the ECHO pin goes HIGH. The Arduino calls \`pulseIn(ECHO_PIN, HIGH, timeout)\`, which blocks and times how long ECHO stays HIGH.

**3. Round-trip calculation**: The echo duration in microseconds divided by 58.2 gives distance in centimeters. Why 58.2? Sound travels 343 m/s = 0.0343 cm/microsecond. Round trip means the sound travels the distance twice: distance = (duration * 0.0343) / 2 = duration / 58.2.

**4. Recovery delay**: We wait at least 60 ms before the next measurement to avoid receiving echoes from the previous pulse (at 400 cm max range, the round-trip time is 23.2 ms, plus safety margin).

The \`pulseIn()\` function is blocking — it halts the CPU until the echo returns or the timeout expires. For a simple project this is fine, but for a system that must do other work while waiting (like updating an LCD or playing buzzer tones), we need **non-blocking measurement** using interrupts or polling \`digitalRead()\` in the loop.

We implement both approaches: the blocking version for simplicity, and a **state machine** version that starts a measurement, continues running other code, and checks for the echo return on each loop iteration. The state machine version is more complex but allows true multitasking — essential for responsive buzzer alerts that should not freeze while waiting for a distant echo.

Accuracy analysis: the Arduino's \`micros()\` has 4-microsecond resolution (on a 16 MHz Uno). At 58.2 us/cm, this gives ~0.07 cm quantization error. In practice, the HC-SR04's accuracy is limited to about +/-3 mm by acoustic beam width, surface angle, and temperature variations — far coarser than the timing resolution.`,
      analogy: 'Imagine standing in a canyon and clapping your hands. You start a stopwatch when you clap, stop it when you hear the echo, and divide by two (the sound traveled to the wall and back). If the echo comes back in 1 second, the wall is ~172 meters away. The HC-SR04 does the same thing at ultrasonic frequencies, and the Arduino is your stopwatch — except it can measure microseconds instead of seconds.',
      storyConnection: 'The river dolphin emits rapid clicks — each one a tiny ultrasonic pulse, just like our HC-SR04 burst. The dolphin brain measures the delay between click and echo with extraordinary precision, building a three-dimensional acoustic image of the riverbed. Our single-sensor system gives one-dimensional distance, but the timing principle is identical.',
      checkQuestion: 'Why do we divide the echo duration by 58.2 rather than just by the speed of sound directly?',
      checkAnswer: 'The raw calculation is: distance = (duration_us * speed_cm_per_us) / 2. Speed of sound = 343 m/s = 34300 cm/s = 0.0343 cm/us. So distance = duration * 0.0343 / 2 = duration / 58.31. The factor 58.2 (commonly rounded) combines the speed of sound and the divide-by-2 for round trip into a single constant, making the code simpler and avoiding a floating-point division in the loop.',
      codeIntro: 'Implement both blocking and non-blocking distance measurement with detailed timing analysis.',
      code: `// =============================================
// HC-SR04 Distance Measurement — Timing Deep Dive
// Blocking and non-blocking measurement modes
// =============================================

const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int BUZZER_PIN = 3;

const float SPEED_OF_SOUND_CM_US = 0.0343;  // cm per microsecond
const unsigned long TIMEOUT_US = 23200;       // ~400 cm max range
const int MEASURE_INTERVAL_MS = 60;

// --- Non-blocking state machine ---
enum MeasureState {
  IDLE,
  TRIGGER_SENT,
  WAITING_ECHO_START,
  TIMING_ECHO
};

MeasureState measureState = IDLE;
unsigned long triggerSentTime = 0;
unsigned long echoStartTime = 0;
unsigned long echoEndTime = 0;
float lastDistance = -1.0;
unsigned long lastMeasureTime = 0;
int readingCount = 0;

// ---- Method 1: Blocking measurement (simple) ----
float measureBlocking() {
  // Send trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Time the echo (BLOCKS until echo returns or timeout)
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, TIMEOUT_US);

  if (duration == 0) return -1.0;  // no echo

  // Distance = (time * speed) / 2 for round trip
  float distance = (duration * SPEED_OF_SOUND_CM_US) / 2.0;
  return distance;
}

// ---- Method 2: Non-blocking state machine ----
// Call this every loop iteration; it progresses through states
// without blocking the CPU.

void startMeasurement() {
  // Send trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);  // brief low (unavoidable short block)
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);  // 10 us trigger (unavoidable short block)
  digitalWrite(TRIG_PIN, LOW);

  triggerSentTime = micros();
  measureState = WAITING_ECHO_START;
}

float updateMeasurement() {
  // Returns distance if measurement complete, -999 if still in progress
  unsigned long now = micros();

  switch (measureState) {
    case IDLE:
      return -999.0;  // nothing happening

    case WAITING_ECHO_START:
      if (digitalRead(ECHO_PIN) == HIGH) {
        echoStartTime = micros();
        measureState = TIMING_ECHO;
      }
      else if (now - triggerSentTime > TIMEOUT_US) {
        measureState = IDLE;
        return -1.0;  // timeout, no echo
      }
      return -999.0;

    case TIMING_ECHO:
      if (digitalRead(ECHO_PIN) == LOW) {
        echoEndTime = micros();
        unsigned long duration = echoEndTime - echoStartTime;
        float distance = (duration * SPEED_OF_SOUND_CM_US) / 2.0;
        measureState = IDLE;
        return distance;
      }
      else if (now - echoStartTime > TIMEOUT_US) {
        measureState = IDLE;
        return -1.0;  // echo too long (beyond max range)
      }
      return -999.0;

    default:
      measureState = IDLE;
      return -999.0;
  }
}

// --- Buzzer alert: pitch and rate based on distance ---
unsigned long lastBeepTime = 0;
bool beepOn = false;

void updateBuzzer(float dist) {
  if (dist < 0) {
    noTone(BUZZER_PIN);
    return;
  }

  // Map distance to beep interval: 30cm=100ms (fast), 200cm=1000ms (slow)
  int beepInterval = map(constrain((int)dist, 30, 200), 30, 200, 100, 1000);

  // Map distance to tone frequency: close=3000Hz (urgent), far=500Hz (gentle)
  int freq = map(constrain((int)dist, 30, 200), 30, 200, 3000, 500);

  if (millis() - lastBeepTime >= (unsigned long)beepInterval) {
    lastBeepTime = millis();
    if (dist < 200) {
      tone(BUZZER_PIN, freq, beepInterval / 3);  // beep for 1/3 of interval
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== HC-SR04 Distance Measurement ===");
  Serial.println("Blocking + Non-blocking modes");
  Serial.println();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);

  // --- Demonstrate blocking mode first (5 readings) ---
  Serial.println("--- Blocking Mode (5 readings) ---");
  for (int i = 0; i < 5; i++) {
    unsigned long t0 = micros();
    float d = measureBlocking();
    unsigned long elapsed = micros() - t0;

    Serial.print("  Reading ");
    Serial.print(i + 1);
    Serial.print(": ");
    if (d > 0) {
      Serial.print(d, 1);
      Serial.print(" cm");
    } else {
      Serial.print("NO ECHO");
    }
    Serial.print("  (took ");
    Serial.print(elapsed);
    Serial.println(" us)");
    delay(MEASURE_INTERVAL_MS);
  }

  Serial.println();
  Serial.println("--- Non-blocking Mode (continuous) ---");
  Serial.println("count\\tdist_cm\\techo_us\\tstatus");

  lastMeasureTime = millis();
}

void loop() {
  // Start a new measurement every MEASURE_INTERVAL_MS
  if (measureState == IDLE && millis() - lastMeasureTime >= MEASURE_INTERVAL_MS) {
    lastMeasureTime = millis();
    startMeasurement();
  }

  // Poll the state machine (non-blocking)
  float result = updateMeasurement();

  if (result > -900) {  // measurement complete (either valid or -1 timeout)
    readingCount++;
    lastDistance = result;

    Serial.print(readingCount);
    Serial.print("\\t");
    if (result > 0) {
      Serial.print(result, 1);
      Serial.print("\\t");
      unsigned long echoDuration = echoEndTime - echoStartTime;
      Serial.print(echoDuration);
      Serial.print("\\t");
      if (result < 30)       Serial.println("CLOSE");
      else if (result < 100) Serial.println("MEDIUM");
      else                   Serial.println("FAR");
    } else {
      Serial.println("-1\\t0\\tNO_ECHO");
    }
  }

  // Buzzer runs independently of measurement (non-blocking benefit!)
  updateBuzzer(lastDistance);
}

// The non-blocking version lets the buzzer beep smoothly even while
// waiting for slow echoes. In blocking mode, the buzzer would stutter
// because pulseIn() freezes the CPU for up to 23 ms per reading.`,
      challenge: 'Add a "speed gun" mode: measure distance twice with a known time gap (e.g., 100 ms), calculate the velocity of a moving object as (d2 - d1) / dt, and display it on Serial. What is the minimum detectable speed given the sensor accuracy of +/-3 mm?',
      successHint: 'You now understand the HC-SR04 at the timing level — not just "call a library function" but exactly how trigger pulses, echo timing, and the speed of sound combine to produce a distance measurement. The non-blocking state machine is a pattern you will use in every Arduino project that needs to do more than one thing at a time.',
    },
    {
      title: 'Signal Processing: Filtering Noisy Readings',
      concept: `Raw ultrasonic readings are **noisy**. Point the HC-SR04 at a flat wall from 50 cm away and take 100 readings: you will get values scattered from 48 to 52 cm, with occasional spikes to 10 cm (a stray echo) or 400 cm (a missed echo). Displaying raw readings on the LCD would produce a jittery, unreadable number. We need **filtering**.

The simplest filter is a **running average** (also called moving average): keep the last N readings in a circular buffer, and output their mean. With N=5, a single spike of 10 cm among readings of [50, 50, 10, 50, 50] produces an average of 42 cm — better than 10, but still pulled down by the outlier.

A better approach for outlier rejection is the **median filter**: sort the last N readings and take the middle value. For [50, 50, 10, 50, 50] sorted = [10, 50, 50, 50, 50], median = 50. The outlier has zero effect. Median filters are computationally expensive for large N (sorting is O(N log N)), but for N=5 the cost is negligible.

We can combine both: first apply a **median filter** (N=5) to reject spikes, then apply an **exponential moving average** (EMA) to smooth the result: \`filtered = alpha * new_reading + (1 - alpha) * filtered\`. The parameter alpha (0 to 1) controls responsiveness: alpha=0.3 gives smooth, laggy output; alpha=0.8 gives responsive, slightly jittery output.

This two-stage filter pipeline (median for outlier rejection + EMA for smoothing) is used in production automotive parking sensors, industrial level measurement, and robotics distance sensing. It is simple, uses minimal memory (5 floats for the median buffer + 1 float for the EMA state), and runs in microseconds.

We also compute **statistics**: standard deviation of recent readings (to quantify noise), and a "confidence" flag that drops to LOW if more than 2 of the last 5 readings were timeouts.`,
      analogy: 'Imagine five friends each estimating the height of a tree. Four say "about 10 meters" and one (who was not paying attention) says "50 meters." If you average all five, you get 18 meters — wrong. If you take the median (sort and pick the middle), you get 10 meters — right. The median filter does the same thing with sensor readings: it ignores the one wild outlier and trusts the consensus.',
      storyConnection: 'The river dolphin processes hundreds of echoes per second in turbulent, debris-filled water. Not every echo is useful — some bounce off floating plants, some are distorted by currents. The dolphin brain filters out the noise and extracts the signal: the shape and distance of fish, the contour of the riverbed. Our median + EMA filter pipeline is a crude approximation of that biological signal processing.',
      checkQuestion: 'Why is a median filter better than a simple average for rejecting single-point outlier spikes?',
      checkAnswer: 'An average is sensitive to extreme values: one reading of 10 cm among four readings of 50 cm pulls the average down to 42 cm. The median, by contrast, is the middle value after sorting — it is completely unaffected by a single outlier as long as fewer than half the readings are corrupted. This "robust" property makes median filtering the standard first stage in noisy sensor pipelines.',
      codeIntro: 'Implement a two-stage filter pipeline: median filter for spike rejection, then EMA for smoothing.',
      code: `// =============================================
// Sonar Signal Processing — Noise Filtering
// Median filter + Exponential Moving Average
// =============================================

const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int BUZZER_PIN = 3;

const float SPEED_OF_SOUND_CM_US = 0.0343;
const unsigned long TIMEOUT_US = 23200;
const int MEASURE_INTERVAL_MS = 60;

// --- Median Filter Buffer ---
const int MEDIAN_SIZE = 5;
float medianBuffer[MEDIAN_SIZE];
int medianIndex = 0;
bool bufferFull = false;

// --- EMA (Exponential Moving Average) ---
float emaValue = 0.0;
float emaAlpha = 0.5;  // 0.0 = max smooth, 1.0 = no smoothing
bool emaInitialized = false;

// --- Statistics ---
float readings[20];     // circular buffer for stats
int statsIndex = 0;
int statsCount = 0;
int timeoutCount = 0;   // recent timeouts out of last 5

// --- Sort helper for median (insertion sort, N=5) ---
void sortArray(float arr[], int n) {
  for (int i = 1; i < n; i++) {
    float key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

float getMedian() {
  if (!bufferFull) return medianBuffer[0];  // not enough data yet

  // Copy buffer, sort, return middle value
  float sorted[MEDIAN_SIZE];
  for (int i = 0; i < MEDIAN_SIZE; i++) {
    sorted[i] = medianBuffer[i];
  }
  sortArray(sorted, MEDIAN_SIZE);
  return sorted[MEDIAN_SIZE / 2];  // middle element
}

// --- Add a reading to the filter pipeline ---
float addReading(float rawDistance) {
  // Stage 1: Add to median buffer
  medianBuffer[medianIndex] = rawDistance;
  medianIndex = (medianIndex + 1) % MEDIAN_SIZE;
  if (medianIndex == 0) bufferFull = true;

  // Get median-filtered value
  float medianValue = getMedian();

  // Stage 2: Apply EMA smoothing
  if (!emaInitialized) {
    emaValue = medianValue;
    emaInitialized = true;
  } else {
    emaValue = emaAlpha * medianValue + (1.0 - emaAlpha) * emaValue;
  }

  // Track statistics
  if (statsCount < 20) statsCount++;
  readings[statsIndex] = rawDistance;
  statsIndex = (statsIndex + 1) % 20;

  return emaValue;
}

// --- Compute standard deviation of recent readings ---
float computeStdDev() {
  if (statsCount < 2) return 0.0;

  float sum = 0.0;
  for (int i = 0; i < statsCount; i++) sum += readings[i];
  float mean = sum / statsCount;

  float sumSq = 0.0;
  for (int i = 0; i < statsCount; i++) {
    float diff = readings[i] - mean;
    sumSq += diff * diff;
  }
  return sqrt(sumSq / (statsCount - 1));
}

// --- Confidence level: based on recent timeout rate ---
int computeConfidence() {
  // Count valid (non-negative) readings in median buffer
  int valid = 0;
  int total = bufferFull ? MEDIAN_SIZE : medianIndex;
  for (int i = 0; i < total; i++) {
    if (medianBuffer[i] > 0) valid++;
  }
  // Return percentage
  if (total == 0) return 0;
  return (valid * 100) / total;
}

// --- HC-SR04 measurement ---
float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, TIMEOUT_US);
  if (duration == 0) return -1.0;
  return (duration * SPEED_OF_SOUND_CM_US) / 2.0;
}

int readingNum = 0;
unsigned long lastMeasure = 0;
unsigned long lastReport = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("=== Sonar Signal Processing ===");
  Serial.println("Median filter (N=5) + EMA (alpha=0.5)");
  Serial.println();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);

  // Initialize buffers
  for (int i = 0; i < MEDIAN_SIZE; i++) medianBuffer[i] = 0;
  for (int i = 0; i < 20; i++) readings[i] = 0;

  Serial.println("count\\traw\\tmedian\\tema\\tstddev\\tconf%");
  lastMeasure = millis();
  lastReport = millis();
}

void loop() {
  if (millis() - lastMeasure >= MEASURE_INTERVAL_MS) {
    lastMeasure = millis();
    readingNum++;

    float raw = measureDistance();

    if (raw > 0) {
      float filtered = addReading(raw);
      float median = getMedian();
      float stddev = computeStdDev();
      int confidence = computeConfidence();

      Serial.print(readingNum);
      Serial.print("\\t");
      Serial.print(raw, 1);
      Serial.print("\\t");
      Serial.print(median, 1);
      Serial.print("\\t");
      Serial.print(filtered, 1);
      Serial.print("\\t");
      Serial.print(stddev, 2);
      Serial.print("\\t");
      Serial.println(confidence);
    } else {
      // Timeout: use last known good value
      Serial.print(readingNum);
      Serial.println("\\t-1\\t-\\t-\\t-\\t-");
    }
  }

  // Summary report every 5 seconds
  if (millis() - lastReport >= 5000) {
    lastReport = millis();
    Serial.print("# STATS: ");
    Serial.print(readingNum);
    Serial.print(" readings, stddev=");
    Serial.print(computeStdDev(), 2);
    Serial.print(" cm, confidence=");
    Serial.print(computeConfidence());
    Serial.println("%");
  }
}

// Watch the "raw" column jitter while "ema" stays smooth.
// Try blocking the sensor briefly — the confidence drops
// but the EMA holds the last good value instead of jumping.`,
      challenge: 'Implement an adaptive alpha: when stddev is low (stable readings), decrease alpha toward 0.2 for maximum smoothing. When stddev spikes (object moving fast), increase alpha toward 0.9 for fast response. This gives you the best of both worlds: stable display for static scenes, fast tracking for moving objects.',
      successHint: 'You have built a production-quality sensor filtering pipeline. The median filter rejects spikes that would fool a simple average. The EMA smooths the remaining jitter into a stable, readable distance value. The statistics and confidence metrics tell you when to trust the readings and when to be cautious. This same two-stage pattern applies to every noisy sensor: accelerometers, temperature probes, air quality monitors.',
    },
    {
      title: 'Serial Plotter: Sending Data for PC Visualization',
      concept: `The Arduino Serial Plotter (Tools > Serial Plotter in the Arduino IDE) is a powerful real-time visualization tool — but it has specific format requirements. Understanding these turns your Arduino into a **streaming data acquisition system**.

The Serial Plotter reads one line of text per sample. Each line contains tab-separated or space-separated numeric values. The first line can optionally contain labels (one per column). Example:

\`\`\`
raw\\tfiltered\\tthreshold
52.3\\t51.8\\t30.0
53.1\\t52.0\\t30.0
\`\`\`

The Plotter draws one line per column, auto-scaling the Y axis. It keeps a scrolling window of the most recent ~500 samples. This is enough for basic real-time monitoring, but for **post-experiment analysis**, we need to save data to a file.

We design a **dual-format output** protocol. Lines starting with \`#\` are comments (ignored by the Plotter but useful for log files). Lines starting with \`>\` are human-readable status messages (displayed in Serial Monitor but ignored by the Plotter). All other lines are tab-separated data for the Plotter.

For PC-side logging, we write a simple protocol: the Arduino sends a special \`>START\` marker when measurement begins and \`>END\` marker when it stops. A PC-side script (Python, Processing, or even a terminal tool like \`screen\`) captures everything between these markers into a CSV file.

We also implement **triggered recording**: the Arduino normally sends data at 10 Hz for the Plotter, but when it detects an "event" (an object enters the sensor range or distance drops below a threshold), it switches to **burst mode** at the full measurement rate (~16 Hz) and flags the event with a \`>EVENT\` marker. This gives high-resolution data exactly when something interesting happens, without flooding the serial link during quiet periods.`,
      analogy: 'Think of the serial output as a wildlife camera trap. Most of the time it takes a photo every 10 seconds (low-rate monitoring). But when the motion sensor detects an animal (event trigger), it switches to burst mode — 5 frames per second — capturing the action in detail. After the animal passes, it returns to low-rate mode. Our Arduino does the same with distance data.',
      storyConnection: 'Researchers monitoring the Brahmaputra river dolphin use hydrophones that record continuously but flag high-activity periods for detailed analysis. You cannot store every second of audio at full bandwidth — the data volume would be enormous. Instead, you monitor at low resolution and burst-record the interesting moments. Our event-triggered serial logging follows the same principle.',
      checkQuestion: 'Why do we use tab-separated values instead of comma-separated for the Arduino Serial Plotter?',
      checkAnswer: 'The Arduino Serial Plotter specifically expects tab-separated or space-separated values. Comma-separated values are treated as a single string and plotted as one flat line. This is a quirk of the IDE implementation, not a fundamental limitation. For CSV file export, we can easily substitute commas, but for real-time plotting compatibility we use tabs.',
      codeIntro: 'Build a dual-mode serial output system with event-triggered burst recording for the Serial Plotter.',
      code: `// =============================================
// Sonar Data Visualization — Serial Plotter Protocol
// Dual-mode: continuous monitoring + event burst recording
// =============================================

const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int BUZZER_PIN = 3;
const int LED_PIN = 13;  // onboard LED for event indicator

const float SPEED_OF_SOUND_CM_US = 0.0343;
const unsigned long TIMEOUT_US = 23200;

// --- Measurement Modes ---
enum OutputMode {
  MODE_MONITOR,   // 10 Hz, for Serial Plotter
  MODE_BURST      // Full rate (~16 Hz), event triggered
};
OutputMode currentMode = MODE_MONITOR;

// --- Timing ---
const int MONITOR_INTERVAL_MS = 100;  // 10 Hz
const int BURST_INTERVAL_MS = 60;     // ~16 Hz
unsigned long lastMeasureMs = 0;

// --- Filter state (from Lesson 3) ---
const int MEDIAN_SIZE = 5;
float medianBuf[MEDIAN_SIZE];
int medIdx = 0;
bool medFull = false;
float emaVal = 0.0;
bool emaInit = false;
const float EMA_ALPHA = 0.4;

// --- Event detection ---
const float EVENT_THRESHOLD = 50.0;  // cm: object closer than this triggers burst
const unsigned long BURST_DURATION_MS = 3000;  // record for 3 seconds after event
unsigned long burstStartMs = 0;
int eventCount = 0;
int sampleCount = 0;

// --- Statistics per session ---
float minDist = 999.0;
float maxDist = 0.0;
unsigned long sessionStartMs = 0;

// --- Helpers ---
float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long dur = pulseIn(ECHO_PIN, HIGH, TIMEOUT_US);
  if (dur == 0) return -1.0;
  return (dur * SPEED_OF_SOUND_CM_US) / 2.0;
}

void sortSmall(float arr[], int n) {
  for (int i = 1; i < n; i++) {
    float key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }
    arr[j+1] = key;
  }
}

float filterReading(float raw) {
  if (raw < 0) return emaVal;  // timeout: keep last value

  medianBuf[medIdx] = raw;
  medIdx = (medIdx + 1) % MEDIAN_SIZE;
  if (medIdx == 0) medFull = true;

  // Median
  float sorted[MEDIAN_SIZE];
  int count = medFull ? MEDIAN_SIZE : medIdx;
  for (int i = 0; i < count; i++) sorted[i] = medianBuf[i];
  sortSmall(sorted, count);
  float median = sorted[count / 2];

  // EMA
  if (!emaInit) { emaVal = median; emaInit = true; }
  else { emaVal = EMA_ALPHA * median + (1.0 - EMA_ALPHA) * emaVal; }

  return emaVal;
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);

  // Session header (comments for log file, ignored by Plotter)
  Serial.println("# =================================");
  Serial.println("# Sonar Data Logger — Session Start");
  Serial.println("# Threshold: 50 cm | Burst: 3 sec");
  Serial.println("# =================================");
  Serial.println(">START");

  // Column labels for Serial Plotter
  Serial.println("raw\\tfiltered\\tthreshold\\tevent");

  for (int i = 0; i < MEDIAN_SIZE; i++) medianBuf[i] = 200.0;

  sessionStartMs = millis();
  lastMeasureMs = millis();
}

void loop() {
  // Determine measurement interval based on mode
  int interval = (currentMode == MODE_BURST) ? BURST_INTERVAL_MS : MONITOR_INTERVAL_MS;

  if (millis() - lastMeasureMs >= (unsigned long)interval) {
    lastMeasureMs = millis();
    sampleCount++;

    float raw = measureDistance();
    float filtered = filterReading(raw);

    // Track session stats
    if (filtered > 0 && filtered < minDist) minDist = filtered;
    if (filtered > maxDist) maxDist = filtered;

    // --- Event detection ---
    float eventFlag = 0.0;  // 0 = no event, 50 = event active
    bool isClose = (filtered > 0 && filtered < EVENT_THRESHOLD);

    if (isClose && currentMode == MODE_MONITOR) {
      // Trigger burst mode
      currentMode = MODE_BURST;
      burstStartMs = millis();
      eventCount++;
      eventFlag = EVENT_THRESHOLD;
      digitalWrite(LED_PIN, HIGH);

      Serial.print(">EVENT ");
      Serial.print(eventCount);
      Serial.print(" at ");
      Serial.print((millis() - sessionStartMs) / 1000.0, 1);
      Serial.print("s, dist=");
      Serial.print(filtered, 1);
      Serial.println(" cm");

      tone(BUZZER_PIN, 2500, 50);  // short chirp
    }

    if (currentMode == MODE_BURST) {
      eventFlag = EVENT_THRESHOLD;
      if (millis() - burstStartMs > BURST_DURATION_MS) {
        // End burst mode
        currentMode = MODE_MONITOR;
        digitalWrite(LED_PIN, LOW);
        noTone(BUZZER_PIN);
        Serial.println(">BURST_END");
      }
    }

    // --- Data output (Plotter-compatible) ---
    if (raw > 0) {
      Serial.print(raw, 1);
    } else {
      Serial.print(filtered, 1);  // substitute filtered on timeout
    }
    Serial.print("\\t");
    Serial.print(filtered, 1);
    Serial.print("\\t");
    Serial.print(EVENT_THRESHOLD, 1);
    Serial.print("\\t");
    Serial.println(eventFlag, 1);
  }

  // Periodic summary (every 10 seconds)
  if (millis() - sessionStartMs > 0 && (millis() - sessionStartMs) % 10000 < 70) {
    Serial.print("# Summary: ");
    Serial.print(sampleCount);
    Serial.print(" samples, ");
    Serial.print(eventCount);
    Serial.print(" events, range=[");
    Serial.print(minDist, 1);
    Serial.print("-");
    Serial.print(maxDist, 1);
    Serial.println("] cm");
  }
}

// Open Tools > Serial Plotter to see:
// - Blue line (raw): jittery real measurements
// - Red line (filtered): smooth EMA output
// - Green line (threshold): flat at 50 cm
// - Purple line (event): spikes to 50 when burst mode active
//
// Move your hand toward the sensor to trigger events.
// The data rate increases during burst mode for higher resolution.`,
      challenge: 'Write a companion Python script using pyserial that connects to the Arduino COM port, reads the serial stream, saves all data lines to a timestamped CSV file, and generates a matplotlib plot at the end. The script should detect >EVENT markers and annotate them on the plot with vertical lines and labels.',
      successHint: 'You have built a complete data acquisition and visualization pipeline. The Arduino handles real-time sensing and filtering; the Serial Plotter provides immediate visual feedback; and the structured protocol supports offline analysis. The event-triggered burst mode captures high-resolution data exactly when it matters, mimicking how professional data acquisition systems work in marine biology, seismology, and industrial monitoring.',
    },
    {
      title: 'Documentation and Deployment Guide',
      concept: `A capstone project must be reproducible. Someone reading your documentation should be able to **buy the parts, wire the circuit, upload the code, and get the same results** without ever talking to you. This is the standard for open-source hardware projects, Arduino community libraries, and professional engineering deliverables.

We structure the documentation in five sections:

**1. Overview**: What does this project do? Who is it for? What will you learn? A two-paragraph summary that helps someone decide whether to build it.

**2. Bill of Materials**: Every component with specifications, quantities, and approximate cost. Include links to common suppliers (Amazon, Robu.in, AliExpress). Specify acceptable substitutes (e.g., "Arduino Uno or Nano or Pro Mini").

**3. Circuit Description**: Unambiguous connection list. For each wire: source pin, destination pin, and any components in between. Include a text-art diagram showing the physical layout on a breadboard. Note safety warnings (e.g., "never exceed 5V on the ECHO pin").

**4. Software Setup**: Arduino IDE version, required libraries (with installation instructions), board selection, upload procedure, and Serial Monitor configuration.

**5. Operation and Calibration**: Step-by-step guide from power-on through self-test, normal operation, event detection, and data export. Include expected Serial output examples so the user can verify their build is working correctly. Describe calibration procedures: how to verify accuracy with a ruler, how to adjust the EMA alpha for their specific environment.

We also include a **troubleshooting matrix**: symptom in the left column, likely cause in the middle, and fix in the right column. This saves hours of forum-posting for common issues like reversed LED polarity, wrong baud rate, or I2C address mismatch.`,
      analogy: 'Good documentation is like a travel guide for a country you have never visited. It does not just list attractions — it tells you how to get there, what to bring, what to expect, and what to do if something goes wrong. A builder reading your documentation is a traveler in unfamiliar territory. Your job is to make their journey smooth and successful.',
      storyConnection: 'The river dolphin researchers publish their monitoring protocols in detail so that other teams on other rivers can replicate the study. Without that documentation, each new team would spend months reinventing methods that already work. Our deployment guide serves the same purpose — it lets anyone, anywhere, build this sonar system and contribute data to the understanding of underwater acoustics.',
      checkQuestion: 'Why do we include expected Serial output examples in the documentation?',
      checkAnswer: 'Expected output examples serve as a verification tool. When a builder uploads the code and opens Serial Monitor, they can compare what they see with what the documentation says they should see. If the output matches, the build is correct. If it differs — wrong numbers, missing lines, garbled text — the discrepancy points directly to the problem (wrong baud rate, miswired sensor, failed component). Without expected output, a builder has no way to know if their results are correct.',
      codeIntro: 'Create the complete capstone sketch with documentation header, self-test, and all subsystems integrated.',
      code: `// =============================================================
// UNDERWATER SONAR RANGING SYSTEM — CAPSTONE PROJECT
// =============================================================
//
// PROJECT: Ultrasonic Distance Measurement with Filtering & Alerts
// PLATFORM: Arduino Uno (ATmega328P, 16 MHz)
// AUTHOR: [Your Name]
// DATE: [Date]
// LICENSE: MIT
//
// OVERVIEW:
//   A sonar ranging system inspired by river dolphin echolocation.
//   Uses an HC-SR04 ultrasonic sensor to measure distance, filters
//   noisy readings with median + EMA pipeline, provides buzzer
//   alerts and LED indicators, and streams data to Serial Plotter
//   with event-triggered burst recording.
//
// BILL OF MATERIALS:
//   1x  Arduino Uno (or Nano, Pro Mini)          ~$5-8
//   1x  HC-SR04 Ultrasonic Sensor                ~$1-2
//   1x  Piezo Buzzer (active or passive)         ~$0.50
//   3x  LEDs (red, yellow, green; 5mm, 20mA)    ~$0.30
//   3x  220 ohm resistors (1/4W)                ~$0.10
//   1x  Breadboard (half-size)                   ~$2
//   ~15 Jumper wires (male-to-male)              ~$1
//   1x  USB cable (A to B for Uno)
//   Total estimated cost: $10-14 USD / 700-1000 INR
//
// CIRCUIT CONNECTIONS:
//   HC-SR04:
//     VCC   --> Arduino 5V
//     TRIG  --> Arduino Pin 7
//     ECHO  --> Arduino Pin 8
//     GND   --> Arduino GND
//
//   Buzzer:
//     (+)   --> Arduino Pin 3 (PWM)
//     (-)   --> Arduino GND
//
//   LEDs (each: pin --> 220 ohm --> LED anode --> cathode --> GND):
//     Pin 9  --> 220R --> RED LED    --> GND   (close alert)
//     Pin 10 --> 220R --> YELLOW LED --> GND   (medium range)
//     Pin 11 --> 220R --> GREEN LED  --> GND   (far / clear)
//
// BREADBOARD LAYOUT (top view):
//     [Arduino Uno]
//        |  |  |  |  |  |  |
//       7T 8E 3B 9R 10Y 11G  GND  5V
//        |  |  |  |  |   |    |    |
//      [HC-SR04 ]  Bz  [220R+LED] x3
//      T  E  G  V   |    |
//                   GND  GND rail
//
// SOFTWARE SETUP:
//   1. Install Arduino IDE 1.8.x or 2.x
//   2. No external libraries required (uses only built-in functions)
//   3. Select Board: "Arduino Uno" (or your board)
//   4. Select Port: (your USB serial port)
//   5. Upload this sketch
//   6. Open Serial Monitor at 115200 baud
//   7. Or open Serial Plotter for real-time graphs
//
// EXPECTED SERIAL OUTPUT (first 10 seconds):
//   === UNDERWATER SONAR CAPSTONE ===
//   Self-test: LEDs...
//     Red OK | Yellow OK | Green OK | Buzzer OK
//   Self-test: HC-SR04...
//     Reading: 47.3 cm — SENSOR OK
//   --- System Ready ---
//   raw  filtered  threshold  zone
//   48.1  47.8  50.0  MEDIUM
//   47.5  47.7  50.0  MEDIUM
//   ...
//
// TROUBLESHOOTING:
//   Symptom              | Likely Cause          | Fix
//   ---------------------|-----------------------|---------------------------
//   Always reads 0 cm    | TRIG/ECHO swapped     | Swap pins 7 and 8
//   Always reads -1      | Sensor not powered    | Check 5V and GND
//   Readings very noisy  | Sensor aimed at angle | Point at flat surface
//   LEDs not lighting    | Polarity reversed     | Flip LED (long leg = +)
//   No Serial output     | Wrong baud rate       | Set Monitor to 115200
//   Buzzer always on     | Pin 3 floating        | Check buzzer ground
// =============================================================

const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int BUZZER_PIN = 3;
const int LED_R = 9;
const int LED_Y = 10;
const int LED_G = 11;

const float SPEED_CM_US = 0.0343;
const unsigned long TIMEOUT_US = 23200;

// Filter state
const int MED_N = 5;
float medBuf[MED_N];
int medIdx = 0;
bool medFull = false;
float emaVal = 0.0;
bool emaInit = false;
const float ALPHA = 0.4;

// Timing
unsigned long lastMeasure = 0;
unsigned long lastReport = 0;
unsigned long startTime = 0;
int sampleNum = 0;
int eventNum = 0;

// --- Core functions ---
float measure() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long d = pulseIn(ECHO_PIN, HIGH, TIMEOUT_US);
  if (d == 0) return -1.0;
  return (d * SPEED_CM_US) / 2.0;
}

float applyFilter(float raw) {
  if (raw < 0) return emaVal;
  medBuf[medIdx] = raw;
  medIdx = (medIdx + 1) % MED_N;
  if (medIdx == 0) medFull = true;

  float sorted[MED_N];
  int n = medFull ? MED_N : medIdx;
  for (int i = 0; i < n; i++) sorted[i] = medBuf[i];
  for (int i = 1; i < n; i++) {
    float k = sorted[i]; int j = i - 1;
    while (j >= 0 && sorted[j] > k) { sorted[j+1] = sorted[j]; j--; }
    sorted[j+1] = k;
  }
  float med = sorted[n / 2];

  if (!emaInit) { emaVal = med; emaInit = true; }
  else { emaVal = ALPHA * med + (1.0 - ALPHA) * emaVal; }
  return emaVal;
}

void setLEDs(float dist) {
  digitalWrite(LED_R, dist > 0 && dist < 30  ? HIGH : LOW);
  digitalWrite(LED_Y, dist >= 30 && dist < 100 ? HIGH : LOW);
  digitalWrite(LED_G, dist >= 100 ? HIGH : LOW);
}

void updateBuzzer(float dist) {
  if (dist < 0 || dist > 200) { noTone(BUZZER_PIN); return; }
  int freq = map(constrain((int)dist, 10, 200), 10, 200, 3000, 500);
  int interval = map(constrain((int)dist, 10, 200), 10, 200, 80, 800);
  if ((millis() / interval) % 2 == 0) tone(BUZZER_PIN, freq);
  else noTone(BUZZER_PIN);
}

// --- Self-test ---
void selfTest() {
  Serial.println("Self-test: LEDs...");
  int pins[] = {LED_R, LED_Y, LED_G};
  const char* names[] = {"Red", "Yellow", "Green"};
  for (int i = 0; i < 3; i++) {
    digitalWrite(pins[i], HIGH);
    delay(300);
    digitalWrite(pins[i], LOW);
    Serial.print("  ");
    Serial.print(names[i]);
    Serial.println(" OK");
  }

  Serial.print("  Buzzer ");
  tone(BUZZER_PIN, 1000, 100);
  delay(150);
  noTone(BUZZER_PIN);
  Serial.println("OK");

  Serial.println("Self-test: HC-SR04...");
  float d = measure();
  Serial.print("  Reading: ");
  if (d > 0) {
    Serial.print(d, 1);
    Serial.println(" cm — SENSOR OK");
  } else {
    Serial.println("NO ECHO — check wiring!");
  }
  Serial.println("--- System Ready ---");
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  Serial.println("=== UNDERWATER SONAR CAPSTONE ===");
  Serial.println("HC-SR04 | Median+EMA filter | Buzzer+LED alerts");
  Serial.println();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_R, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  pinMode(LED_G, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);

  for (int i = 0; i < MED_N; i++) medBuf[i] = 200.0;

  selfTest();

  Serial.println("raw\\tfiltered\\tthreshold\\tzone");
  startTime = millis();
  lastMeasure = millis();
  lastReport = millis();
}

void loop() {
  if (millis() - lastMeasure >= 60) {
    lastMeasure = millis();
    sampleNum++;

    float raw = measure();
    float filt = applyFilter(raw);

    setLEDs(filt);
    updateBuzzer(filt);

    // Plotter-compatible output
    Serial.print(raw > 0 ? raw : filt, 1);
    Serial.print("\\t");
    Serial.print(filt, 1);
    Serial.print("\\t50.0\\t");

    if (filt < 30)       Serial.println("CLOSE");
    else if (filt < 100) Serial.println("MEDIUM");
    else                 Serial.println("FAR");
  }

  // Summary every 10 seconds
  if (millis() - lastReport >= 10000) {
    lastReport = millis();
    unsigned long elapsed = (millis() - startTime) / 1000;
    Serial.print("# ");
    Serial.print(elapsed);
    Serial.print("s: ");
    Serial.print(sampleNum);
    Serial.print(" samples, filtered=");
    Serial.print(emaVal, 1);
    Serial.println(" cm");
  }
}

// CALIBRATION:
// 1. Place a flat object at exactly 30 cm (use a ruler)
// 2. Read the "filtered" column — should show ~30.0 +/- 1 cm
// 3. If consistently off, adjust SPEED_CM_US for your temperature:
//    v = 331.3 + 0.606 * T_celsius (in m/s), then / 10000 for cm/us
// 4. For 25C: v = 346.4 m/s = 0.03464 cm/us
//
// CAPSTONE COMPLETE
// Skills: ultrasonic sensing, timing measurement, median filtering,
// EMA smoothing, PWM buzzer control, serial data protocols, LED
// indicators, self-test routines, and professional documentation.`,
      challenge: 'Add an I2C 16x2 LCD display: show distance with a horizontal bar graph on row 1 (each character represents 20 cm) and zone status (CLOSE/MEDIUM/FAR) with the measurement count on row 2. Requires the LiquidCrystal_I2C library. This completes the "dolphin brain" — a display that forms a visual representation from acoustic data.',
      successHint: 'You have built a complete, documented sonar ranging system from first principles. Every subsystem — sensing, filtering, alerting, displaying, and logging — is tested and documented. The deployment guide means anyone can build it. The troubleshooting matrix means they can fix it. This is professional embedded systems engineering, inspired by millions of years of dolphin evolution.',
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
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Arduino C/C++ to build an ultrasonic sonar ranging system with HC-SR04, signal filtering, buzzer alerts, and serial data visualization. Click to start the code environment.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Code Environment</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
