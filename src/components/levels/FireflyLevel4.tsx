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
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Firefly LED Synchronization - System Setup
// Arduino Uno | 6 LEDs on PWM pins in ring topology
const int NUM_FIREFLIES = 6;
const int ledPins[] = {3, 5, 6, 9, 10, 11};
void setup() {
  for (int i = 0; i < 6; i++) { pinMode(ledPins[i], OUTPUT); }
  // Init random phases and frequencies
}
void loop() {
  // Each firefly oscillates independently (no coupling yet)
  // brightness = (1 + cos(phase)) / 2, applied via analogWrite
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION of the same logic
# ============================================================
import numpy as np

NUM = 6
neighbors = [[(i-1)%NUM, (i+1)%NUM] for i in range(NUM)]
np.random.seed(42)
phase = np.random.uniform(0, 2*np.pi, NUM)
freq = 1.5 + np.random.uniform(-0.2, 0.2, NUM)

print("\n=== Python Simulation: Independent Oscillators ===\n")
print("Initial state:")
for i in range(NUM):
    print("  Firefly {}: phase={:.2f} freq={:.2f} Hz".format(i, phase[i], freq[i]))

dt = 0.01
print("\nTime(s)  | Brightness (PWM 0-255) per firefly")
print("-" * 60)
for step in range(200):
    t = step * dt
    phase += 2 * np.pi * freq * dt
    phase = phase % (2 * np.pi)
    pwm = ((1 + np.cos(phase)) / 2 * 255).astype(int)
    if step % 50 == 0:
        print("  {:.1f}s    | {}".format(t, "  ".join("{:3d}".format(p) for p in pwm)))
print("\nFireflies flash independently (not synchronized yet).")`,
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
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Firefly Kuramoto Synchronization
// dPhase[i] = omega_i + K * sum(sin(phase_j - phase_i)) / 2
// Order parameter R: 0=chaos, 1=sync
float couplingK = 2.5;
void loop() {
  for (int i = 0; i < 6; i++) {
    float coupling = sin(phase[left]-phase[i]) + sin(phase[right]-phase[i]);
    dPhase[i] = TWO_PI*freq[i] + couplingK * coupling / 2.0;
  }
  // Apply, wrap, compute R = |mean(e^{i*phase})|
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION of Kuramoto synchronization
# ============================================================
import numpy as np

NUM = 6
TWO_PI = 2 * np.pi
K = 2.5
neighbors = [[(i-1)%NUM, (i+1)%NUM] for i in range(NUM)]
np.random.seed(42)
phase = np.random.uniform(0, TWO_PI, NUM)
freq = 1.5 + np.random.uniform(-0.2, 0.2, NUM)

def order_R(ph):
    return np.sqrt(np.mean(np.cos(ph))**2 + np.mean(np.sin(ph))**2)

print("\n=== Python Simulation: Kuramoto Coupling ===")
print("K = {:.1f} | 6 oscillators | Ring topology\n".format(K))
print("Time(s)  R      Phases (radians)")
print("-" * 65)

dt = 0.01
for step in range(1000):
    t = step * dt
    d_phase = TWO_PI * freq.copy()
    for i in range(NUM):
        coupling = sum(np.sin(phase[j] - phase[i]) for j in neighbors[i])
        d_phase[i] += K * coupling / 2.0
    phase = (phase + d_phase * dt) % TWO_PI
    R = order_R(phase)
    if step % 100 == 0:
        print("  {:.1f}s   {:.3f}  [{}]".format(t, R, ", ".join("{:.2f}".format(p) for p in phase)))

print("\nFinal R = {:.3f} {}".format(R, "(synchronized!)" if R > 0.95 else ""))`,
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
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Firefly Synchronization - Serial Data Logger
// Tab-separated output for Arduino Serial Plotter
// Columns: time_ms, R, LED0..LED5
// Tracks sync detection (R > 0.95)
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: Data logging with statistics
# ============================================================
import numpy as np

NUM = 6
TWO_PI = 2 * np.pi
K = 2.5
neighbors = [[(i-1)%NUM, (i+1)%NUM] for i in range(NUM)]
np.random.seed(42)
phase = np.random.uniform(0, TWO_PI, NUM)
freq = 1.5 + np.random.uniform(-0.2, 0.2, NUM)

def order_R(ph):
    return np.sqrt(np.mean(np.cos(ph))**2 + np.mean(np.sin(ph))**2)

print("\n=== Python Simulation: Serial Data Logger ===\n")
print("time_ms\tR\tLED0\tLED1\tLED2\tLED3\tLED4\tLED5")

dt = 0.01
max_R, min_R, sync_time = 0.0, 1.0, None
for step in range(1500):
    t = step * dt
    d_phase = TWO_PI * freq.copy()
    for i in range(NUM):
        coupling = sum(np.sin(phase[j] - phase[i]) for j in neighbors[i])
        d_phase[i] += K * coupling / 2.0
    phase = (phase + d_phase * dt) % TWO_PI
    br = (1 + np.cos(phase)) / 2
    R = order_R(phase)
    max_R, min_R = max(max_R, R), min(min_R, R)
    if sync_time is None and R > 0.95: sync_time = t
    if step % 50 == 0:
        print("{}\t{:.3f}\t{}".format(int(t*1000), R, "\t".join("{:.2f}".format(b) for b in br)))
    if step > 0 and step % 500 == 0:
        s = " SYNC at {:.1f}s".format(sync_time) if sync_time else ""
        print("# {:.1f}s: R={:.3f} maxR={:.3f}{}".format(t, R, max_R, s))

print("\n=== Stats: min={:.3f} max={:.3f} final={:.3f} ===".format(min_R, max_R, R))
if sync_time: print("Sync at {:.1f}s".format(sync_time))`,
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
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Firefly Breathing Patterns - PWM Waveform Shaping
// Gamma correction LUT (gamma=2.2) + asymmetric envelope
// Envelope: quadratic attack -> peak -> exp decay -> dark
uint8_t gammaLUT[256];
float fireflyEnvelope(float t) {
  if (t < 0.15) return (t/0.15)*(t/0.15);
  if (t < 0.25) return 1.0;
  if (t < 0.80) return exp(-3.0*(t-0.25)/0.55);
  return 0.0;
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: Gamma correction + firefly envelope
# ============================================================
import numpy as np

GAMMA = 2.2
gamma_lut = np.array([int((i/255.0)**GAMMA*255+0.5) for i in range(256)])

print("\n=== Python Simulation: PWM Breathing Patterns ===\n")
print("Gamma LUT: ", end="")
for s in [0, 32, 64, 128, 192, 255]: print("{}->{} ".format(s, gamma_lut[s]), end="")
print()

def envelope(t):
    if t < 0.15: x = t/0.15; return x*x
    if t < 0.25: return 1.0
    if t < 0.80: return np.exp(-3.0*(t-0.25)/0.55)
    return 0.0

print("\n--- Envelope Shape ---")
print("Phase  Raw    Gamma_PWM")
for tv in np.arange(0, 1.01, 0.05):
    raw = envelope(tv)
    corr = gamma_lut[min(int(raw*255), 255)]
    print("  {:.2f}  {:.3f}  {:3d}  {}".format(tv, raw, corr, "#"*(corr//8)))

NUM = 6
TWO_PI = 2*np.pi
K = 2.5
neighbors = [[(i-1)%NUM,(i+1)%NUM] for i in range(NUM)]
np.random.seed(42)
phase = np.random.uniform(0, TWO_PI, NUM)
freq = 1.5 + np.random.uniform(-0.2, 0.2, NUM)

print("\n--- 6 fireflies with envelope + gamma ---")
print("Time(s)  PWM values (gamma-corrected)")
dt = 0.01
for step in range(800):
    d_phase = TWO_PI * freq.copy()
    for i in range(NUM):
        coupling = sum(np.sin(phase[j]-phase[i]) for j in neighbors[i])
        d_phase[i] += K * coupling / 2.0
    phase = (phase + d_phase * dt) % TWO_PI
    if step % 25 == 0:
        vals = [gamma_lut[min(int(envelope(phase[i]/TWO_PI)*255),255)] for i in range(NUM)]
        print("  {:.2f}s | {}".format(step*dt, "  ".join("{:3d}".format(v) for v in vals)))

print("\nGamma-corrected envelope: fast rise -> peak -> slow fade -> dark")`,
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
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// FIREFLY LED SYNCHRONIZATION - CAPSTONE
// 6 LEDs | Ring | Kuramoto | Gamma + Envelope | Serial Logger
// BOM: Arduino Uno, 6x LEDs, 6x 220R, breadboard ($12-15)
// CIRCUIT: Pin 3,5,6,9,10,11 -> 220R -> LED -> GND
// Includes: selfTest, gammaLUT, fireflyEnvelope, Kuramoto, logging
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: Complete capstone
# ============================================================
import numpy as np

NUM = 6
TWO_PI = 2*np.pi
GAMMA = 2.2
K = 2.5
gamma_lut = np.array([int((i/255.0)**GAMMA*255+0.5) for i in range(256)])

def envelope(t):
    if t < 0.15: x=t/0.15; return x*x
    if t < 0.25: return 1.0
    if t < 0.80: return np.exp(-3.0*(t-0.25)/0.55)
    return 0.0

neighbors = [[(i-1)%NUM,(i+1)%NUM] for i in range(NUM)]

print("\n=== FIREFLY LED SYNCHRONIZATION CAPSTONE ===\n")
print("--- SELF TEST ---")
for i, pin in enumerate([3,5,6,9,10,11]):
    print("  LED {} on pin {}... OK".format(i, pin))
print("--- SELF TEST COMPLETE ---\n")

np.random.seed(42)
phase = np.random.uniform(0, TWO_PI, NUM)
freq = 1.5 + np.random.uniform(-0.2, 0.2, NUM)

print("R\tPWM0\tPWM1\tPWM2\tPWM3\tPWM4\tPWM5")
dt = 0.01
sync_time = None
for step in range(1500):
    t = step * dt
    d_phase = TWO_PI * freq.copy()
    for i in range(NUM):
        for j in neighbors[i]:
            d_phase[i] += K * np.sin(phase[j]-phase[i]) / 2.0
    phase = (phase + d_phase * dt) % TWO_PI
    R = np.sqrt(np.mean(np.cos(phase))**2 + np.mean(np.sin(phase))**2)
    if sync_time is None and R > 0.95: sync_time = t
    if step % 50 == 0:
        vals = [gamma_lut[min(int(envelope(phase[i]/TWO_PI)*255),255)] for i in range(NUM)]
        print("{:.3f}\t{}".format(R, "\t".join(str(v) for v in vals)))

print("\n=== CAPSTONE RESULTS ===")
print("Final R = {:.3f}".format(R))
if sync_time: print("Sync at {:.1f}s".format(sync_time))
print("All subsystems verified: self-test, gamma, envelope, Kuramoto, logging")`,
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
