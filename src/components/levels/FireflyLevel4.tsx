import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FireflyLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'System Design: LED Array with Timing Control',
      concept: `In previous levels you explored the biology of firefly bioluminescence and the mathematics of synchronization. Now you build the real thing: an **Arduino-controlled LED array** that synchronizes its flashing patterns, just like a swarm of fireflies on a Majuli riverbank.

The hardware design uses an **Arduino Uno** (ATmega328P, 16 MHz, 14 digital pins, 6 PWM-capable). We connect **6 LEDs** to PWM pins (3, 5, 6, 9, 10, 11) through 220-ohm current-limiting resistors. Each LED represents one "firefly" — an independent oscillator with its own phase and natural frequency, coupled to its neighbors through the Kuramoto model.

Why PWM pins? Because fireflies do not simply flash on/off — they produce a smooth **breathing glow** that rises and falls. PWM (Pulse Width Modulation) lets us control brightness continuously from 0 (off) to 255 (full brightness) using \`analogWrite()\`. The Arduino toggles the pin at ~490 Hz, varying the duty cycle. Our eyes see the average brightness, not the flickering.

The circuit layout matters. We arrange LEDs in a **ring topology**: LED 0 couples to LED 1 and LED 5, LED 1 couples to LED 0 and LED 2, and so on. This nearest-neighbor coupling mirrors how real fireflies respond primarily to the flash of their closest neighbors, not distant ones.

Power budget: each LED draws ~15 mA at full brightness. Six LEDs = 90 mA total, well within the Arduino's 200 mA per-pin group limit and the 500 mA USB supply. We add a decoupling capacitor (100 nF) near the Arduino's power pins to smooth voltage fluctuations during rapid PWM switching.`,
      analogy: 'Think of the circuit as a circle of six drummers, each with their own rhythm. Each drummer can hear only the two neighbors beside them. At first they are out of sync — a cacophony. But gradually, each drummer nudges their tempo to match what they hear nearby. The resistors are like earplugs that protect the drums (LEDs) from being hit too hard (overcurrent).',
      storyConnection: 'On the banks of Majuli, thousands of fireflies flash together in the darkness. Each one is a tiny oscillator — a biological clock coupled to its neighbors through light. Our six-LED ring is a miniature version of that riverbank swarm, with Arduino code replacing biochemistry.',
      checkQuestion: 'Why do we need current-limiting resistors between the Arduino pins and the LEDs?',
      checkAnswer: 'An LED has very low forward resistance once its threshold voltage is reached (~2V for green, ~1.8V for red). Without a resistor, the current would spike to hundreds of milliamps, destroying the LED and possibly damaging the Arduino pin (rated for 40 mA max). A 220-ohm resistor limits current to (5V - 2V) / 220 = ~13.6 mA — bright enough to see, safe for the hardware.',
      codeIntro: 'Set up the Arduino sketch with pin definitions, LED array configuration, and the basic timing framework.',
      code: `// =============================================
// Firefly LED Synchronization — System Setup
// Arduino Uno | 6 LEDs on PWM pins in ring topology
// =============================================

// --- Hardware Pin Assignments ---
// Each LED connects: Arduino PWM pin -> 220 ohm resistor -> LED anode -> LED cathode -> GND
const int NUM_FIREFLIES = 6;
const int ledPins[NUM_FIREFLIES] = {3, 5, 6, 9, 10, 11};  // All PWM-capable

// --- Oscillator State ---
// Each firefly has a phase (0 to TWO_PI) and a natural frequency
float phase[NUM_FIREFLIES];
float naturalFreq[NUM_FIREFLIES];  // radians per second
float brightness[NUM_FIREFLIES];   // 0.0 to 1.0

// --- Timing ---
unsigned long lastUpdateMicros = 0;
const unsigned long UPDATE_INTERVAL_US = 10000;  // 10 ms = 100 Hz update rate
float dt;  // delta time in seconds

// --- Ring Topology: each firefly couples to its two neighbors ---
// neighbor[i][0] = left neighbor, neighbor[i][1] = right neighbor
int neighbor[NUM_FIREFLIES][2];

void setupNeighbors() {
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    neighbor[i][0] = (i - 1 + NUM_FIREFLIES) % NUM_FIREFLIES;  // left
    neighbor[i][1] = (i + 1) % NUM_FIREFLIES;                   // right
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== Firefly LED Synchronization ===");
  Serial.println("6 LEDs | Ring Topology | Kuramoto Model");
  Serial.println();

  // Configure LED pins as outputs
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    pinMode(ledPins[i], OUTPUT);
    analogWrite(ledPins[i], 0);  // start dark
  }

  // Initialize oscillators with random phases and slightly different frequencies
  randomSeed(analogRead(A0));  // seed from floating analog pin
  float baseFreq = 1.5;  // ~1.5 Hz base flash rate

  for (int i = 0; i < NUM_FIREFLIES; i++) {
    phase[i] = random(0, 628) / 100.0;  // random phase 0 to 2*PI
    naturalFreq[i] = baseFreq + (random(-20, 21) / 100.0);  // +/- 0.2 Hz variation
    brightness[i] = 0.0;
  }

  setupNeighbors();

  // Print initial state
  Serial.println("Initial oscillator state:");
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    Serial.print("  Firefly ");
    Serial.print(i);
    Serial.print(": phase=");
    Serial.print(phase[i], 2);
    Serial.print(" freq=");
    Serial.print(naturalFreq[i], 2);
    Serial.print(" Hz  neighbors=[");
    Serial.print(neighbor[i][0]);
    Serial.print(",");
    Serial.print(neighbor[i][1]);
    Serial.println("]");
  }
  Serial.println();

  lastUpdateMicros = micros();
}

void loop() {
  unsigned long now = micros();
  if (now - lastUpdateMicros >= UPDATE_INTERVAL_US) {
    dt = (now - lastUpdateMicros) / 1000000.0;  // convert to seconds
    lastUpdateMicros = now;

    // Phase update will go here (next lesson: Kuramoto coupling)

    // For now: each firefly runs independently
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      phase[i] += TWO_PI * naturalFreq[i] * dt;
      if (phase[i] > TWO_PI) phase[i] -= TWO_PI;

      // Brightness = raised cosine: peaks at phase=0, dark at phase=PI
      brightness[i] = (1.0 + cos(phase[i])) / 2.0;

      int pwmVal = (int)(brightness[i] * 255);
      analogWrite(ledPins[i], pwmVal);
    }
  }
}

// --- Serial output (called from loop every ~500ms for monitoring) ---
// Upload, open Serial Monitor at 115200 baud.
// You should see 6 LEDs glowing at slightly different rates.
// They will NOT yet synchronize — that requires Kuramoto coupling (Lesson 2).`,
      challenge: 'Modify the pin assignments to use 8 LEDs instead of 6 (add pins 2 and 4 as digital-only pins using digitalWrite for simple on/off). Update the neighbor array for an 8-node ring. What changes in the power budget?',
      successHint: 'You have the hardware foundation: six independent oscillators, each producing a smooth breathing glow at its own natural frequency. The LEDs flash at similar but not identical rates — like fireflies that have not yet heard each other. The Kuramoto algorithm in Lesson 2 will add the coupling that pulls them into synchrony.',
    },
    {
      title: 'Kuramoto Synchronization Algorithm in Arduino C',
      concept: `The **Kuramoto model** is the mathematical heart of firefly synchronization. Each oscillator (firefly) adjusts its phase based on the phase difference with its coupled neighbors:

**d(phase_i)/dt = omega_i + (K/N) * sum(sin(phase_j - phase_i))**

where omega_i is the natural frequency of oscillator i, K is the coupling strength, and the sum runs over all coupled neighbors j. The \`sin(phase_j - phase_i)\` term is the key: when neighbor j is ahead in phase, this is positive, pulling oscillator i forward. When j is behind, it pulls i back. Over time, all oscillators converge to a common frequency — they synchronize.

On an Arduino, we implement this with fixed-point-friendly floating-point arithmetic. The ATmega328P has no hardware FPU, so \`sin()\` and floating-point operations are emulated in software (~100 clock cycles per multiply, ~600 per sin). At 16 MHz with 6 oscillators and 2 neighbors each, we need ~12 sin() calls per update = ~7200 cycles. At 100 Hz update rate, that is 720,000 cycles per second — only 4.5% of CPU budget. Plenty of headroom.

The coupling constant K controls how fast synchronization happens. Too low: oscillators never lock. Too high: they snap together instantly (boring). The critical coupling Kc for our system is approximately \`Kc = 2 * delta_omega\`, where delta_omega is the spread in natural frequencies. We set K slightly above Kc for a gradual, visually pleasing convergence over 5-10 seconds.

We also compute an **order parameter** R: the magnitude of the average phase vector. R=0 means completely desynchronized (phases uniformly distributed), R=1 means perfect synchrony. This single number tells us how "together" the swarm is.`,
      analogy: 'Imagine six clocks hanging on a wall, each ticking at a slightly different speed. The Kuramoto coupling is like connecting them with weak springs. Each spring pulls a clock toward its neighbors timing. The coupling strength K is how stiff the springs are — too loose and the clocks drift apart, stiff enough and they all tick together. The order parameter R is like standing back and asking: do the second hands line up?',
      storyConnection: 'The fireflies of Majuli do not have a conductor. No single firefly controls the swarm. Yet thousands synchronize spontaneously through local coupling — each one adjusting its flash timing based on the flashes it sees nearby. Our Kuramoto algorithm captures this decentralized, emergent coordination in twelve lines of C code.',
      checkQuestion: 'What happens to the Kuramoto order parameter R if we set coupling strength K to zero?',
      checkAnswer: 'With K=0, there is no coupling. Each oscillator runs at its own natural frequency independently. Since the natural frequencies differ slightly, the phases drift apart over time. The order parameter R fluctuates around a small value (roughly 1/sqrt(N) for N oscillators due to random phase alignment) but never approaches 1. The fireflies flash randomly, never synchronizing.',
      codeIntro: 'Add the Kuramoto coupling algorithm to the loop, computing phase adjustments and the order parameter R.',
      code: `// =============================================
// Firefly LED Synchronization — Kuramoto Coupling
// Adds neighbor-based phase coupling to the oscillator array
// =============================================

const int NUM_FIREFLIES = 6;
const int ledPins[NUM_FIREFLIES] = {3, 5, 6, 9, 10, 11};

float phase[NUM_FIREFLIES];
float naturalFreq[NUM_FIREFLIES];
float brightness[NUM_FIREFLIES];
int neighbor[NUM_FIREFLIES][2];

// --- Kuramoto Parameters ---
float couplingK = 2.5;   // coupling strength (tune this!)
float orderR = 0.0;      // order parameter: 0=chaos, 1=sync
float orderPsi = 0.0;    // mean phase angle

unsigned long lastUpdateMicros = 0;
unsigned long lastPrintMillis = 0;
const unsigned long UPDATE_INTERVAL_US = 10000;  // 10 ms
const unsigned long PRINT_INTERVAL_MS = 500;     // print every 500 ms

void setupNeighbors() {
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    neighbor[i][0] = (i - 1 + NUM_FIREFLIES) % NUM_FIREFLIES;
    neighbor[i][1] = (i + 1) % NUM_FIREFLIES;
  }
}

// --- Compute Kuramoto order parameter ---
void computeOrderParameter() {
  float sumCos = 0.0;
  float sumSin = 0.0;
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    sumCos += cos(phase[i]);
    sumSin += sin(phase[i]);
  }
  sumCos /= NUM_FIREFLIES;
  sumSin /= NUM_FIREFLIES;
  orderR = sqrt(sumCos * sumCos + sumSin * sumSin);
  orderPsi = atan2(sumSin, sumCos);
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== Firefly Kuramoto Synchronization ===");
  Serial.print("Coupling K = ");
  Serial.println(couplingK);

  for (int i = 0; i < NUM_FIREFLIES; i++) {
    pinMode(ledPins[i], OUTPUT);
    analogWrite(ledPins[i], 0);
  }

  randomSeed(analogRead(A0));
  float baseFreq = 1.5;
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    phase[i] = random(0, 628) / 100.0;
    naturalFreq[i] = baseFreq + (random(-20, 21) / 100.0);
    brightness[i] = 0.0;
  }
  setupNeighbors();
  lastUpdateMicros = micros();
  lastPrintMillis = millis();
}

void loop() {
  unsigned long now = micros();
  if (now - lastUpdateMicros >= UPDATE_INTERVAL_US) {
    float dt = (now - lastUpdateMicros) / 1000000.0;
    lastUpdateMicros = now;

    // --- Kuramoto phase update ---
    float dPhase[NUM_FIREFLIES];
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      // Start with natural frequency
      dPhase[i] = TWO_PI * naturalFreq[i];

      // Add coupling from each neighbor
      float coupling = 0.0;
      for (int n = 0; n < 2; n++) {
        int j = neighbor[i][n];
        coupling += sin(phase[j] - phase[i]);
      }
      // Normalize by number of neighbors (2 in ring)
      dPhase[i] += couplingK * coupling / 2.0;
    }

    // Apply phase updates and compute brightness
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      phase[i] += dPhase[i] * dt;

      // Wrap phase to [0, TWO_PI]
      while (phase[i] > TWO_PI) phase[i] -= TWO_PI;
      while (phase[i] < 0)      phase[i] += TWO_PI;

      // Brightness: smooth raised cosine envelope
      brightness[i] = (1.0 + cos(phase[i])) / 2.0;
      int pwmVal = (int)(brightness[i] * 255);
      analogWrite(ledPins[i], pwmVal);
    }

    // Compute order parameter
    computeOrderParameter();
  }

  // --- Periodic serial output ---
  if (millis() - lastPrintMillis >= PRINT_INTERVAL_MS) {
    lastPrintMillis = millis();
    Serial.print("R=");
    Serial.print(orderR, 3);
    Serial.print(" | phases: ");
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      Serial.print(phase[i], 2);
      if (i < NUM_FIREFLIES - 1) Serial.print(", ");
    }
    Serial.println();
  }
}

// Upload and watch: LEDs start flashing independently, then gradually
// synchronize over 5-10 seconds. The Serial Monitor shows R climbing
// from ~0.3 toward 1.0 as phases converge.
// Try changing couplingK: lower values take longer; below ~1.0 they may never sync.`,
      challenge: 'Add a potentiometer on analog pin A1 to control the coupling strength K in real time. Map the 0-1023 ADC reading to K in the range 0.0 to 5.0. Observe how the LEDs respond as you turn the knob — can you find the critical coupling threshold where synchronization just barely emerges?',
      successHint: 'The Kuramoto algorithm is running on real hardware. You can see synchronization emerge — the order parameter R climbing from chaos toward unity as six independent oscillators, coupled only to their nearest neighbors, spontaneously find a common rhythm. This is the same mathematics that governs firefly swarms, cardiac pacemaker cells, and power grid generators.',
    },
    {
      title: 'Serial Communication for Debugging and Data Logging',
      concept: `A blinking LED tells you the system is running, but it cannot tell you *why* it is behaving a certain way. **Serial communication** is the Arduino engineer's debugger, oscilloscope, and data logger rolled into one.

The ATmega328P has a hardware **UART** (Universal Asynchronous Receiver/Transmitter) on pins 0 (RX) and 1 (TX). When you call \`Serial.begin(115200)\`, you configure this UART to transmit at 115200 bits per second. Each byte takes ~87 microseconds to transmit (10 bits: 1 start + 8 data + 1 stop). At this baud rate, you can send roughly 11,500 characters per second — enough for detailed logging without slowing the main loop.

But serial output is **not free**. Each \`Serial.print()\` blocks until the hardware transmit buffer (64 bytes on the Uno) has room. If you print too much data in a tight loop, the CPU stalls waiting for the UART. The solution: **rate-limit serial output**. We print a data packet every 100 ms (10 Hz), which is fast enough for real-time plotting but light enough to leave 99% of CPU time for the Kuramoto algorithm.

We design a **structured data format** for the Arduino Serial Plotter. The Plotter expects tab-separated or comma-separated numeric values, one sample per line, with optional labels on the first line. We send: timestamp, order parameter R, and all 6 brightness values. This lets us visualize synchronization dynamics in real time — watching R climb from disorder to order while individual brightness curves merge into a unified pulse.

For post-experiment analysis, we can also log to a PC using a Python serial reader that saves CSV files. The Arduino becomes a **data acquisition system**, and the PC handles storage and analysis.`,
      analogy: 'Serial communication is like a field biologist sitting in the dark, whispering observations into a tape recorder. The fireflies (LEDs) are doing their thing — flashing, synchronizing. The biologist (Serial output) records timestamps, brightness levels, and synchronization metrics. Later, back at the lab (the PC), the biologist reviews the recordings to understand what happened and when.',
      storyConnection: 'When researchers study the fireflies of Majuli, they cannot just watch — they need data. They set up cameras, light sensors, and loggers to capture the exact timing of each flash. Our Serial output serves the same purpose: turning the ephemeral beauty of synchronized flashing into quantitative data we can analyze, plot, and share.',
      checkQuestion: 'Why do we rate-limit serial output to 10 Hz instead of printing every loop iteration at 100 Hz?',
      checkAnswer: 'At 100 Hz with ~80 characters per line, we would generate ~8000 characters per second. The UART at 115200 baud can handle ~11500 chars/sec, so it would barely keep up — and the Serial.print() calls would block the CPU for a significant fraction of each loop iteration, degrading the timing accuracy of the Kuramoto algorithm. At 10 Hz we send only ~800 chars/sec, using <7% of UART bandwidth and minimal CPU time.',
      codeIntro: 'Build a comprehensive serial logging system with structured output for the Arduino Serial Plotter and CSV export.',
      code: `// =============================================
// Firefly Synchronization — Serial Data Logger
// Structured output for Serial Plotter + CSV logging
// =============================================

const int NUM_FIREFLIES = 6;
const int ledPins[NUM_FIREFLIES] = {3, 5, 6, 9, 10, 11};

float phase[NUM_FIREFLIES];
float naturalFreq[NUM_FIREFLIES];
float brightness[NUM_FIREFLIES];
int neighbor[NUM_FIREFLIES][2];

float couplingK = 2.5;
float orderR = 0.0;

unsigned long lastUpdateMicros = 0;
unsigned long lastPlotMillis = 0;
unsigned long startMillis = 0;
const unsigned long UPDATE_INTERVAL_US = 10000;
const unsigned long PLOT_INTERVAL_MS = 100;  // 10 Hz for Serial Plotter

// --- Statistics tracking ---
float maxR = 0.0;
float minR = 1.0;
unsigned long syncTimeMs = 0;    // time when R first exceeds 0.95
bool syncAchieved = false;
int sampleCount = 0;

void setupNeighbors() {
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    neighbor[i][0] = (i - 1 + NUM_FIREFLIES) % NUM_FIREFLIES;
    neighbor[i][1] = (i + 1) % NUM_FIREFLIES;
  }
}

void computeOrderParameter() {
  float sumCos = 0.0, sumSin = 0.0;
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    sumCos += cos(phase[i]);
    sumSin += sin(phase[i]);
  }
  orderR = sqrt(sumCos * sumCos + sumSin * sumSin) / NUM_FIREFLIES;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }  // wait for Serial Monitor to open

  // Print header for CSV-compatible logging
  Serial.println("# Firefly Synchronization Data Logger");
  Serial.println("# Coupling K = 2.5 | 6 LEDs | Ring topology");
  Serial.println("#");

  // Column headers (Arduino Serial Plotter reads the first label line)
  Serial.println("time_ms\\tR\\tLED0\\tLED1\\tLED2\\tLED3\\tLED4\\tLED5");

  for (int i = 0; i < NUM_FIREFLIES; i++) {
    pinMode(ledPins[i], OUTPUT);
    analogWrite(ledPins[i], 0);
  }

  randomSeed(analogRead(A0));
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    phase[i] = random(0, 628) / 100.0;
    naturalFreq[i] = 1.5 + (random(-20, 21) / 100.0);
  }
  setupNeighbors();

  startMillis = millis();
  lastUpdateMicros = micros();
  lastPlotMillis = millis();
}

void loop() {
  // --- High-frequency Kuramoto update (100 Hz) ---
  unsigned long now = micros();
  if (now - lastUpdateMicros >= UPDATE_INTERVAL_US) {
    float dt = (now - lastUpdateMicros) / 1000000.0;
    lastUpdateMicros = now;

    float dPhase[NUM_FIREFLIES];
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      dPhase[i] = TWO_PI * naturalFreq[i];
      float coupling = 0.0;
      for (int n = 0; n < 2; n++) {
        int j = neighbor[i][n];
        coupling += sin(phase[j] - phase[i]);
      }
      dPhase[i] += couplingK * coupling / 2.0;
    }

    for (int i = 0; i < NUM_FIREFLIES; i++) {
      phase[i] += dPhase[i] * dt;
      while (phase[i] > TWO_PI) phase[i] -= TWO_PI;
      while (phase[i] < 0)      phase[i] += TWO_PI;
      brightness[i] = (1.0 + cos(phase[i])) / 2.0;
      analogWrite(ledPins[i], (int)(brightness[i] * 255));
    }

    computeOrderParameter();

    // Track statistics
    if (orderR > maxR) maxR = orderR;
    if (orderR < minR) minR = orderR;
    if (!syncAchieved && orderR > 0.95) {
      syncAchieved = true;
      syncTimeMs = millis() - startMillis;
    }
  }

  // --- Low-frequency serial output (10 Hz) ---
  if (millis() - lastPlotMillis >= PLOT_INTERVAL_MS) {
    lastPlotMillis = millis();
    sampleCount++;
    unsigned long elapsed = millis() - startMillis;

    // Tab-separated values for Serial Plotter
    Serial.print(elapsed);
    Serial.print("\\t");
    Serial.print(orderR, 3);
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      Serial.print("\\t");
      Serial.print(brightness[i], 2);
    }
    Serial.println();

    // Print summary every 5 seconds
    if (elapsed % 5000 < PLOT_INTERVAL_MS) {
      Serial.print("# Summary at ");
      Serial.print(elapsed / 1000.0, 1);
      Serial.print("s: R=");
      Serial.print(orderR, 3);
      Serial.print(" maxR=");
      Serial.print(maxR, 3);
      if (syncAchieved) {
        Serial.print(" SYNC at ");
        Serial.print(syncTimeMs / 1000.0, 1);
        Serial.print("s");
      }
      Serial.println();
    }
  }
}

// Open Tools > Serial Plotter to see real-time graphs.
// The R line (order parameter) should climb from ~0.3 to ~1.0.
// Individual LED brightness curves start scattered, then merge
// into a single synchronized pulse.`,
      challenge: 'Add a command interface: if the user sends "R" over Serial, respond with the current order parameter. If they send "K=3.0", update the coupling strength in real time. Use Serial.available() and Serial.readStringUntil() to parse incoming commands. This turns the Arduino into an interactive experiment.',
      successHint: 'You now have a complete data pipeline: the Arduino runs the physics, logs structured data over Serial, and the PC captures and plots it. This is how real embedded systems are debugged — not with breakpoints (the LEDs would stop!), but with streaming telemetry. The same pattern applies to any sensor project: sample fast, log selectively, analyze offline.',
    },
    {
      title: 'PWM Breathing Patterns: Analog LED Fading',
      concept: `A real firefly does not flash like a square wave — it produces a smooth, organic glow that rises gently, peaks briefly, and fades slowly. Replicating this requires mastering **PWM waveform shaping**.

The Arduino's \`analogWrite(pin, value)\` sets the **duty cycle** of a ~490 Hz square wave. A value of 0 means the pin is always LOW (LED off). A value of 127 means the pin is HIGH 50% of the time. A value of 255 means always HIGH (full brightness). The LED integrates this fast switching into a perceived brightness proportional to the duty cycle.

But there is a catch: **human brightness perception is logarithmic**, not linear. A PWM value of 128 (50% duty cycle) does not look "half as bright" as 255 — it looks about 75% as bright. To create perceptually smooth fading, we need **gamma correction**: \`perceived_brightness = (linear_input)^gamma\`, where gamma is typically 2.2 for LEDs viewed in a dark room.

We implement this with a **lookup table** (LUT) — a 256-byte array precomputed in \`setup()\` that maps linear brightness (0-255) to gamma-corrected PWM values. Using a LUT avoids calling \`pow()\` in the main loop, which would cost ~2000 clock cycles per call.

Beyond simple sine-wave breathing, we can create complex firefly-like waveforms: a **fast attack** (rapid brightening over ~100 ms), a brief **peak hold** (~50 ms at full brightness), and a **slow exponential decay** (fading over ~500 ms). This asymmetric envelope looks far more natural than a symmetric sine wave and closely matches recorded firefly flash profiles.`,
      analogy: 'Think of a pianist playing a single note. The hammer strikes the string (fast attack), the note rings at full volume briefly (peak), then fades gradually as the string loses energy (slow decay). A square wave would be like a robot pressing the key at full force, holding it, then releasing instantly — mechanical and lifeless. The shaped envelope gives the note its musical character, just as the shaped brightness gives the firefly its organic charm.',
      storyConnection: 'The children in the story describe the firefly glow as "breathing light" — not a harsh flash but a gentle pulse, like the forest itself is inhaling and exhaling. Our PWM breathing pattern captures that poetic description in precise engineering: a gamma-corrected, asymmetric envelope that makes each LED glow with the warmth of a living thing.',
      checkQuestion: 'Why does a linear ramp from PWM 0 to 255 appear to "jump" to bright quickly and then barely change at the top?',
      checkAnswer: 'Because human vision perceives brightness logarithmically (the Weber-Fechner law). The difference between PWM 0 and 10 is very noticeable (dark to dim), but the difference between 245 and 255 is almost invisible (both look like full brightness). Gamma correction compensates by spending more PWM steps in the low-brightness range, where our eyes are most sensitive, creating a perceptually uniform fade.',
      codeIntro: 'Implement gamma-corrected brightness with a lookup table and an asymmetric firefly flash envelope.',
      code: `// =============================================
// Firefly Breathing Patterns — PWM Waveform Shaping
// Gamma correction + asymmetric flash envelope
// =============================================

const int NUM_FIREFLIES = 6;
const int ledPins[NUM_FIREFLIES] = {3, 5, 6, 9, 10, 11};

// --- Gamma Correction Lookup Table ---
// Maps linear brightness [0-255] to perceptually-corrected PWM values
uint8_t gammaLUT[256];
const float GAMMA = 2.2;

void buildGammaTable() {
  for (int i = 0; i < 256; i++) {
    float normalized = i / 255.0;                   // 0.0 to 1.0
    float corrected = pow(normalized, GAMMA);        // apply gamma curve
    gammaLUT[i] = (uint8_t)(corrected * 255 + 0.5); // round to nearest byte
  }
  // Verify endpoints
  // gammaLUT[0]   = 0   (off is off)
  // gammaLUT[255] = 255 (full is full)
  // gammaLUT[128] = 55  (50% linear -> 21.6% PWM, looks like 50% brightness)
}

// --- Asymmetric Flash Envelope ---
// Firefly flash profile: fast attack, brief peak, slow exponential decay
// Phase 0.0 to 1.0 maps through the envelope

// Envelope timing (as fractions of one flash cycle)
const float ATTACK_END  = 0.15;  // 0.00 - 0.15: fast rise
const float PEAK_END    = 0.25;  // 0.15 - 0.25: hold at peak
const float DECAY_END   = 0.80;  // 0.25 - 0.80: slow exponential decay
// 0.80 - 1.00: dark (inter-flash interval)

float fireflyEnvelope(float t) {
  // t is normalized time within one flash cycle [0, 1)
  if (t < ATTACK_END) {
    // Fast quadratic attack (accelerating rise)
    float x = t / ATTACK_END;
    return x * x;  // quadratic: starts slow, ends fast
  }
  else if (t < PEAK_END) {
    // Peak hold at full brightness
    return 1.0;
  }
  else if (t < DECAY_END) {
    // Slow exponential decay
    float x = (t - PEAK_END) / (DECAY_END - PEAK_END);
    return exp(-3.0 * x);  // e^-3 at end = ~0.05 (nearly dark)
  }
  else {
    // Dark interval between flashes
    return 0.0;
  }
}

// --- Oscillator state ---
float phase[NUM_FIREFLIES];
float naturalFreq[NUM_FIREFLIES];
float brightness[NUM_FIREFLIES];
int neighbor[NUM_FIREFLIES][2];
float couplingK = 2.5;

unsigned long lastUpdateMicros = 0;
const unsigned long UPDATE_INTERVAL_US = 10000;

void setupNeighbors() {
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    neighbor[i][0] = (i - 1 + NUM_FIREFLIES) % NUM_FIREFLIES;
    neighbor[i][1] = (i + 1) % NUM_FIREFLIES;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== Firefly PWM Breathing Patterns ===");
  Serial.println("Gamma correction + asymmetric envelope");

  buildGammaTable();

  // Print gamma table samples
  Serial.println("Gamma LUT samples (linear -> corrected):");
  int samples[] = {0, 16, 32, 64, 128, 192, 255};
  for (int k = 0; k < 7; k++) {
    int i = samples[k];
    Serial.print("  ");
    Serial.print(i);
    Serial.print(" -> ");
    Serial.println(gammaLUT[i]);
  }

  for (int i = 0; i < NUM_FIREFLIES; i++) {
    pinMode(ledPins[i], OUTPUT);
  }

  randomSeed(analogRead(A0));
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    phase[i] = random(0, 628) / 100.0;
    naturalFreq[i] = 1.5 + (random(-20, 21) / 100.0);
  }
  setupNeighbors();
  lastUpdateMicros = micros();
}

void loop() {
  unsigned long now = micros();
  if (now - lastUpdateMicros >= UPDATE_INTERVAL_US) {
    float dt = (now - lastUpdateMicros) / 1000000.0;
    lastUpdateMicros = now;

    // Kuramoto phase update
    float dPhase[NUM_FIREFLIES];
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      dPhase[i] = TWO_PI * naturalFreq[i];
      float coupling = 0.0;
      for (int n = 0; n < 2; n++) {
        int j = neighbor[i][n];
        coupling += sin(phase[j] - phase[i]);
      }
      dPhase[i] += couplingK * coupling / 2.0;
    }

    for (int i = 0; i < NUM_FIREFLIES; i++) {
      phase[i] += dPhase[i] * dt;
      while (phase[i] > TWO_PI) phase[i] -= TWO_PI;
      while (phase[i] < 0)      phase[i] += TWO_PI;

      // Convert phase to normalized time [0, 1) for envelope
      float t = phase[i] / TWO_PI;

      // Apply firefly envelope (asymmetric flash shape)
      float rawBrightness = fireflyEnvelope(t);

      // Scale to 0-255 linear, then apply gamma correction via LUT
      uint8_t linearPWM = (uint8_t)(rawBrightness * 255);
      uint8_t correctedPWM = gammaLUT[linearPWM];

      brightness[i] = rawBrightness;
      analogWrite(ledPins[i], correctedPWM);
    }
  }
}

// The LEDs now produce a natural firefly glow:
// - Fast brightening (quadratic attack)
// - Brief peak hold
// - Slow exponential fade
// - Dark pause before next flash
// Combined with gamma correction, the fade looks perfectly smooth
// to the human eye. Compare with/without gamma by replacing
// gammaLUT[linearPWM] with just linearPWM to see the difference.`,
      challenge: 'Create three different species of firefly by varying the envelope parameters (attack time, decay rate, dark interval) across LED pairs. LEDs 0-1 flash fast with short pauses (like Photinus pyralis). LEDs 2-3 flash with a long, slow glow (like Photuris). LEDs 4-5 produce a double-flash pattern (two quick blinks per cycle). All three species should still synchronize through Kuramoto coupling.',
      successHint: 'You have transformed a simple on/off LED into a convincing firefly simulation. The gamma-corrected, envelope-shaped PWM produces a glow that looks alive — rising eagerly, holding at peak, fading reluctantly into darkness. This is the difference between engineering and art: the math is the same, but the parameters create beauty.',
    },
    {
      title: 'Documentation and Circuit Diagram Description',
      concept: `A capstone project is not finished when the code compiles — it is finished when someone else can **build it, understand it, and extend it**. Documentation transforms a personal experiment into a shared resource.

Engineering documentation has three audiences: **builders** (how to wire and upload), **users** (how to operate and interpret), and **future developers** (how the code works and how to modify it). Each audience needs different information presented differently.

For the builder, we provide a **Bill of Materials** (BOM) listing every component with quantity, specifications, and approximate cost. We describe the circuit with a **textual schematic** — not a graphical diagram (which requires specialized tools) but a precise, unambiguous description of every connection. We specify the **assembly sequence**: what to connect first, how to test incrementally, and common mistakes to avoid.

For the user, we write **operating instructions**: upload procedure, expected behavior at each stage, how to interpret Serial output, and troubleshooting steps for when things go wrong (LED not lighting? Check polarity. No Serial output? Check baud rate).

For the developer, we document the **code architecture**: the relationship between the Kuramoto algorithm, the envelope shaper, the gamma LUT, and the serial logger. We explain the **design decisions**: why ring topology, why 100 Hz update rate, why K=2.5. And we describe **extension points**: how to add more LEDs, change the topology, or connect to a PC visualization.

This documentation practice is not busywork — it is the skill that separates a hobbyist from a professional engineer. NASA, SpaceX, and every medical device company require documentation that meets standards far more rigorous than ours. Starting now builds a habit that will serve you throughout your career.`,
      analogy: 'Documentation is like a recipe in a cookbook. The dish might be delicious, but without the recipe — ingredients, quantities, steps, timing, and tips — no one else can recreate it. A great recipe also explains *why*: why sear the meat first (Maillard reaction), why rest the dough (gluten relaxation). Our documentation does the same for the circuit and code.',
      storyConnection: 'The firefly festival exists because generations of villagers preserved knowledge about where and when the fireflies gather, how to reach the riverbank safely at night, and what conditions produce the best displays. That oral documentation — passed down through stories — is what makes the festival possible. Our written documentation serves the same purpose for the engineering project.',
      checkQuestion: 'Why do we describe the circuit as text rather than providing a graphical schematic?',
      checkAnswer: 'A textual circuit description is version-controllable (it lives in code comments or markdown), does not require specialized schematic software (like KiCad or Fritzing), and is accessible to screen readers. For a simple circuit with 6 LEDs and resistors, a precise text description is unambiguous and often clearer than a cluttered graphical diagram. For complex circuits with ICs and buses, graphical schematics become essential — but for our project, text suffices.',
      codeIntro: 'Create a comprehensive documentation header and a self-test routine that validates the hardware setup.',
      code: `// =============================================================
// FIREFLY LED SYNCHRONIZATION — CAPSTONE PROJECT
// =============================================================
//
// PROJECT: Synchronized LED Array using Kuramoto Model
// PLATFORM: Arduino Uno (ATmega328P, 16 MHz)
// AUTHOR: [Your Name]
// DATE: [Date]
// LICENSE: MIT
//
// DESCRIPTION:
//   Six LEDs arranged in a ring topology synchronize their
//   flashing patterns using the Kuramoto coupled oscillator
//   model. Each LED represents a firefly with its own natural
//   frequency. Nearest-neighbor coupling causes spontaneous
//   synchronization, mimicking real firefly swarms.
//
// BILL OF MATERIALS:
//   1x  Arduino Uno (or compatible: Nano, Pro Mini)
//   6x  LEDs (green recommended, 20mA, Vf ~2.0V)
//   6x  220 ohm resistors (1/4W, 5%)
//   1x  100 nF ceramic capacitor (decoupling, optional)
//   1x  Breadboard (half-size minimum)
//   ~20 Jumper wires (male-to-male)
//   1x  USB-A to USB-B cable (for Uno)
//   Estimated cost: $12-15 USD / 800-1000 INR
//
// CIRCUIT CONNECTIONS:
//   Arduino Pin 3  --> 220 ohm --> LED 0 anode --> LED 0 cathode --> GND
//   Arduino Pin 5  --> 220 ohm --> LED 1 anode --> LED 1 cathode --> GND
//   Arduino Pin 6  --> 220 ohm --> LED 2 anode --> LED 2 cathode --> GND
//   Arduino Pin 9  --> 220 ohm --> LED 3 anode --> LED 3 cathode --> GND
//   Arduino Pin 10 --> 220 ohm --> LED 4 anode --> LED 4 cathode --> GND
//   Arduino Pin 11 --> 220 ohm --> LED 5 anode --> LED 5 cathode --> GND
//   (LED anode = long leg; cathode = short leg / flat side)
//
//   Optional: 100 nF capacitor between Arduino 5V and GND pins
//   Optional: Potentiometer on A1 (center pin) for K control
//
// RING TOPOLOGY (nearest-neighbor coupling):
//        LED 0
//       /     \\
//    LED 5     LED 1
//      |         |
//    LED 4     LED 2
//       \\     /
//        LED 3
//
// ASSEMBLY SEQUENCE:
//   1. Insert 6 LEDs into breadboard (note polarity!)
//   2. Connect 220 ohm resistor from each LED anode row to a free row
//   3. Connect jumper from each resistor row to the Arduino PWM pin
//   4. Connect all LED cathode rows to the GND rail
//   5. Connect Arduino GND to breadboard GND rail
//   6. Upload this sketch and open Serial Monitor at 115200 baud
//   7. Run self-test (automatic on startup)
//
// OPERATING INSTRUCTIONS:
//   - Upload sketch via Arduino IDE (Board: Arduino Uno, correct port)
//   - Open Serial Monitor at 115200 baud
//   - Self-test runs automatically: each LED lights in sequence
//   - After self-test, LEDs begin independent flashing
//   - Over 5-10 seconds, Kuramoto coupling causes synchronization
//   - Order parameter R is printed every 500ms (R=1.0 = perfect sync)
//   - Use Serial Plotter (Tools > Serial Plotter) for real-time graphs
//
// TROUBLESHOOTING:
//   LED not lighting:  Check polarity (long leg to resistor side)
//   LED very dim:      Check resistor value (220 ohm, not 2.2k)
//   No Serial output:  Check baud rate matches (115200)
//   LEDs dont sync:    Increase couplingK (try 3.0 or 4.0)
//   Sync too fast:     Decrease couplingK (try 1.0 or 1.5)
//
// CODE ARCHITECTURE:
//   setup()              - Pin config, gamma LUT, initial phases, self-test
//   loop()               - 100 Hz Kuramoto update + 10 Hz serial output
//   computeOrderParam()  - Kuramoto order parameter R (sync metric)
//   fireflyEnvelope()    - Asymmetric flash shape (attack/peak/decay)
//   gammaLUT[]           - 256-byte lookup for perceptual brightness
//   selfTest()           - Sequential LED test on startup
// =============================================================

const int NUM_FIREFLIES = 6;
const int ledPins[NUM_FIREFLIES] = {3, 5, 6, 9, 10, 11};

uint8_t gammaLUT[256];
float phase[NUM_FIREFLIES];
float naturalFreq[NUM_FIREFLIES];
int neighbor[NUM_FIREFLIES][2];
float couplingK = 2.5;
float orderR = 0.0;

unsigned long lastUpdateMicros = 0;
unsigned long lastPrintMillis = 0;

// --- Self-Test: lights each LED in sequence to verify wiring ---
void selfTest() {
  Serial.println("--- SELF TEST ---");
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    Serial.print("  Testing LED ");
    Serial.print(i);
    Serial.print(" on pin ");
    Serial.print(ledPins[i]);
    Serial.println("...");

    // Ramp up
    for (int b = 0; b <= 255; b += 5) {
      analogWrite(ledPins[i], b);
      delay(2);
    }
    delay(200);  // hold at full brightness

    // Ramp down
    for (int b = 255; b >= 0; b -= 5) {
      analogWrite(ledPins[i], b);
      delay(2);
    }
    Serial.println("    OK");
  }

  // All-on test
  Serial.println("  All LEDs on...");
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    analogWrite(ledPins[i], 128);
  }
  delay(500);
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    analogWrite(ledPins[i], 0);
  }
  Serial.println("--- SELF TEST COMPLETE ---");
  Serial.println("If any LED did not light, check wiring and polarity.");
  Serial.println();
}

void buildGammaTable() {
  for (int i = 0; i < 256; i++) {
    float n = i / 255.0;
    gammaLUT[i] = (uint8_t)(pow(n, 2.2) * 255 + 0.5);
  }
}

float fireflyEnvelope(float t) {
  if (t < 0.15)       return (t / 0.15) * (t / 0.15);
  else if (t < 0.25)  return 1.0;
  else if (t < 0.80)  return exp(-3.0 * (t - 0.25) / 0.55);
  else                 return 0.0;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }
  Serial.println("=== FIREFLY LED SYNCHRONIZATION CAPSTONE ===");
  Serial.println("6 LEDs | Ring Topology | Kuramoto Model");
  Serial.println("Gamma-corrected | Asymmetric envelope");
  Serial.println();

  for (int i = 0; i < NUM_FIREFLIES; i++) {
    pinMode(ledPins[i], OUTPUT);
  }

  buildGammaTable();
  selfTest();

  randomSeed(analogRead(A0));
  for (int i = 0; i < NUM_FIREFLIES; i++) {
    phase[i] = random(0, 628) / 100.0;
    naturalFreq[i] = 1.5 + (random(-20, 21) / 100.0);
    neighbor[i][0] = (i - 1 + NUM_FIREFLIES) % NUM_FIREFLIES;
    neighbor[i][1] = (i + 1) % NUM_FIREFLIES;
  }

  Serial.println("Synchronization starting...");
  Serial.println("R\\tLED0\\tLED1\\tLED2\\tLED3\\tLED4\\tLED5");
  lastUpdateMicros = micros();
  lastPrintMillis = millis();
}

void loop() {
  unsigned long now = micros();
  if (now - lastUpdateMicros >= 10000) {
    float dt = (now - lastUpdateMicros) / 1000000.0;
    lastUpdateMicros = now;

    float dPhase[NUM_FIREFLIES];
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      dPhase[i] = TWO_PI * naturalFreq[i];
      for (int n = 0; n < 2; n++) {
        int j = neighbor[i][n];
        dPhase[i] += couplingK * sin(phase[j] - phase[i]) / 2.0;
      }
    }

    float sumCos = 0, sumSin = 0;
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      phase[i] += dPhase[i] * dt;
      while (phase[i] > TWO_PI) phase[i] -= TWO_PI;
      while (phase[i] < 0)      phase[i] += TWO_PI;

      float env = fireflyEnvelope(phase[i] / TWO_PI);
      uint8_t pwm = gammaLUT[(uint8_t)(env * 255)];
      analogWrite(ledPins[i], pwm);

      sumCos += cos(phase[i]);
      sumSin += sin(phase[i]);
    }
    orderR = sqrt(sumCos * sumCos + sumSin * sumSin) / NUM_FIREFLIES;
  }

  if (millis() - lastPrintMillis >= 500) {
    lastPrintMillis = millis();
    Serial.print(orderR, 3);
    for (int i = 0; i < NUM_FIREFLIES; i++) {
      Serial.print("\\t");
      Serial.print(phase[i], 2);
    }
    Serial.println();
  }
}`,
      challenge: 'Write a companion Python script (to run on the PC) that reads the Serial data, plots real-time synchronization curves using matplotlib, and saves a CSV log file. The script should detect when R exceeds 0.95 and timestamp the synchronization event. This completes the full embedded-to-desktop data pipeline.',
      successHint: 'You have built a complete, documented capstone project: from circuit design through Kuramoto synchronization, gamma-corrected PWM breathing, serial data logging, and professional documentation. Every component is tested, every design decision is explained, and anyone can build it from your documentation alone. This is embedded systems engineering.',
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
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Arduino C/C++ to build a synchronized LED firefly array with Kuramoto coupling, PWM breathing patterns, and serial data logging. Click to start the code environment.</p>
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
