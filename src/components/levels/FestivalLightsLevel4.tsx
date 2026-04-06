import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FestivalLightsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'System Design: LDR Sensor + LED Strip + Arduino',
      concept: `In previous levels you explored the physics of light, LED circuits, and photometry. Now you build an **ambient-responsive LED installation** — a light sculpture that senses its environment and adapts its display in real time. As daylight fades during a festival evening, the installation gradually brightens. When someone shines a flashlight at it, it responds with a burst of color. When clouds pass overhead, it shifts to warmer tones.

The core sensing element is a **Light-Dependent Resistor (LDR)**, also called a photoresistor. An LDR is made of cadmium sulfide (CdS), a semiconductor whose resistance decreases when exposed to light. In darkness, its resistance can be 1 megaohm or more. In bright light, it drops to a few hundred ohms. By placing the LDR in a **voltage divider** with a fixed resistor, we convert this resistance change into a voltage that the Arduino's ADC (Analog-to-Digital Converter) can read.

The voltage divider circuit: 5V --> LDR --> junction point --> 10k ohm resistor --> GND. The Arduino analog pin (A0) connects to the junction point. In bright light (LDR low resistance), the junction voltage is high (~4V). In darkness (LDR high resistance), the junction voltage is low (~0.5V). The ADC reads this as a value from 0 (dark) to 1023 (bright).

For the LED output, we use an **RGB LED strip** (common anode or WS2812B NeoPixel). For this lesson, we start with three individual LEDs (red, green, blue) on PWM pins, representing one RGB pixel. In the final build, these map directly to the R, G, B channels of each pixel in a strip.

The system architecture: **Sensor** (LDR on A0) --> **Processing** (Arduino: read, map, decide mode) --> **Output** (RGB LEDs on PWM pins 9, 10, 11). A potentiometer on A1 lets the user set sensitivity. A pushbutton on pin 2 cycles through display modes.

Power: Three LEDs at 20 mA each = 60 mA. For a full WS2812B strip (30 pixels), each pixel draws up to 60 mA at full white = 1.8A total. That exceeds the Arduino's 5V regulator (500 mA), so a strip requires an external 5V power supply. We design for this from the start.`,
      analogy: 'Think of the LDR as a pupil in your eye. In bright light, the pupil contracts (low resistance = high voltage reading) to reduce light intake. In darkness, it dilates (high resistance = low voltage reading) to gather more light. Our circuit reads the "pupil size" and adjusts the LED brightness accordingly — bright LEDs when the environment is dark, dim LEDs when it is bright. The installation is, in effect, a single giant artificial eye that responds to its surroundings.',
      storyConnection: 'The festival lights in the story transform as evening falls — starting as subtle glimmers in the afternoon haze, growing to a dazzling display at nightfall. Our light-responsive installation does the same thing automatically. The LDR senses the fading daylight, and the Arduino smoothly increases LED brightness. The installation becomes part of the festival rhythm, responding to the same sunset that the celebrants are watching.',
      checkQuestion: 'Why do we use a 10k ohm fixed resistor in the voltage divider with the LDR, rather than a 100 ohm or 1M ohm resistor?',
      checkAnswer: 'The fixed resistor should be in the same range as the LDR resistance in the middle of the operating range. An LDR typically varies from ~1k (bright) to ~100k (dim). A 10k fixed resistor puts the voltage divider output in the middle of the ADC range under typical indoor lighting. With 100 ohms, the voltage would be near 5V for all but the brightest light (no dynamic range in the dark). With 1M, the voltage would be near 0V except in near-total darkness. The 10k value maximizes sensitivity across the useful light range.',
      codeIntro: 'Set up the hardware interface: LDR reading, RGB LED output, potentiometer for sensitivity, and button for mode selection.',
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Festival Light Installation - System Setup
// LDR sensor + RGB LEDs + user controls
const int LDR_PIN = A0, POT_PIN = A1, BUTTON_PIN = 2;
const int LED_R = 9, LED_G = 10, LED_B = 11;
int ldrMin = 50, ldrMax = 900;

void setup() {
  Serial.begin(115200);
  // Self-test: ramp R, G, B channels
  // Calibration: read LDR for 3 seconds
}
void loop() {
  int ldrRaw = analogRead(LDR_PIN);
  int mapped = map(constrain(ldrRaw, ldrMin, ldrMax), ldrMin, ldrMax, 0, 255);
  int brightness = 255 - mapped;  // dark = bright LEDs
  analogWrite(LED_R, brightness);
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION of LDR sensor + RGB LED system
# ============================================================
import numpy as np

print("\n=== Python Simulation: Festival Light Installation ===\n")
print("Self-test: RGB channels...")
for c in ["Red", "Green", "Blue"]: print("  {} ramp... OK".format(c))

np.random.seed(42)
cal_readings = np.random.randint(80, 850, 150)
cal_min, cal_max = int(np.min(cal_readings)), int(np.max(cal_readings))
print("\nCalibration: min={} max={}".format(cal_min, cal_max))

print("\n--- Voltage Divider (LDR + 10k) ---")
print("LDR_R (ohm)\tVoltage\tADC\tCondition")
for r_ldr in [500, 1000, 5000, 10000, 50000, 100000]:
    v = 5.0 * 10000 / (r_ldr + 10000)
    adc = int(v / 5.0 * 1023)
    cond = "bright" if r_ldr < 2000 else "indoor" if r_ldr < 20000 else "dark"
    print("{}\t\t{:.2f}\t{}\t{}".format(r_ldr, v, adc, cond))

print("\n--- Mode 0: Auto Brightness ---")
print("ldr_raw\tmapped\tR\tG\tB")
for ldr_raw in np.linspace(850, 100, 15):
    ldr_raw = int(ldr_raw + np.random.normal(0, 5))
    clamped = max(cal_min, min(cal_max, ldr_raw))
    mapped = int((clamped - cal_min) / (cal_max - cal_min) * 255)
    br = 255 - mapped
    print("{}\t{}\t{}\t{}\t{}".format(ldr_raw, mapped, br, br, br))

print("\nAs ambient light fades, LED brightness increases.")`,
      challenge: 'Add a second LDR on pin A2 positioned at a different angle. Compare the two readings to determine the direction of the brightest light source (left vs right). Use this to create a "sunflower" mode where the LED color shifts to indicate which side the light is coming from.',
      successHint: 'You have the complete hardware interface working: the LDR reads ambient light, the potentiometer adjusts sensitivity, the button cycles modes, and the RGB LEDs respond. This is the sensory backbone of the installation. In the next lessons, you will build the processing intelligence: color mapping, state machines, and pattern generation.',
    },
    {
      title: 'Analog Reading from LDR (Light-Dependent Resistor)',
      concept: `The Arduino's ADC (Analog-to-Digital Converter) is the bridge between the continuous analog world and the discrete digital world your code operates in. Understanding its characteristics and limitations is essential for building reliable sensor systems.

The ATmega328P has a **10-bit successive approximation ADC** with 6 input channels (A0-A5). "10-bit" means it divides the 0-5V input range into 2^10 = 1024 steps. Each step = 5V / 1024 = 4.88 mV. When you call \`analogRead(A0)\`, the ADC takes approximately 112 microseconds to sample and convert the voltage.

But the ADC introduces **noise**. Even with a perfectly stable voltage, consecutive readings will fluctuate by +/-2 to +/-5 counts due to digital switching noise on the power supply, capacitive coupling from nearby digital pins, and the ADC's own quantization noise. For our LDR circuit, this means readings at a stable light level might bounce between, say, 510 and 518.

We address this with **oversampling and averaging**: take multiple rapid readings and compute the mean. Taking 16 samples and averaging reduces noise by a factor of sqrt(16) = 4, effectively giving us 12-bit resolution (4 times finer). The cost is time: 16 * 112 us = ~1.8 ms per averaged reading, still fast enough for our 50 Hz update rate.

The LDR response is **logarithmic**: its resistance changes roughly as R = R0 * (Lux)^(-gamma), where gamma is about 0.7 for typical CdS cells. This means the voltage divider output compresses bright light into a narrow range at the top of the ADC and spreads dim light across a wide range at the bottom. For perceptually uniform brightness mapping, we can apply a log transform: \`mappedValue = log(rawValue)\`, which linearizes the perceived brightness response.

We also need to handle the LDR's **response time**. Unlike a photodiode (nanosecond response), a CdS LDR takes 20-50 ms to respond to a brightness increase and 200-500 ms to respond to a decrease (going from bright to dark). This asymmetric response means our filtering must account for the sensor physics, not just electrical noise.`,
      analogy: 'The ADC is like a ruler with 1024 tick marks between 0 and 5 volts. When you measure a voltage, you read off the nearest tick mark. But the ruler is slightly wobbly (noise), so you measure three times and take the average. The LDR is like a person whose eyes adjust to darkness slowly but adapt to brightness quickly — it "remembers" the dark for a while, so your readings lag behind reality when lights come on.',
      storyConnection: 'The festival unfolds over hours — from bright afternoon to deep twilight. The light changes gradually, not in sudden jumps. Our oversampled, filtered ADC reading captures this gradual transition faithfully, just as a photographer adjusts exposure throughout a long time-lapse of the festival. Every fraction of a lux matters for smooth, responsive lighting.',
      checkQuestion: 'Why does taking 16 ADC samples and averaging improve effective resolution from 10 bits to approximately 12 bits?',
      checkAnswer: 'Oversampling works because the noise is random: some readings are above the true value, some below. Averaging N samples reduces random noise by a factor of sqrt(N). With N=16, noise drops by 4x. Since each "bit" of resolution halves the noise floor, reducing noise by 4x adds log2(4) = 2 extra bits of effective resolution: 10 + 2 = 12 bits. This only works if the noise is truly random and uncorrelated — which is approximately true for ADC quantization noise.',
      codeIntro: 'Implement oversampled ADC reading with logarithmic mapping and adaptive filtering for the LDR.',
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// LDR Analog Reading - Deep ADC Techniques
// Oversampling (16x), logarithmic mapping, adaptive filtering
float readLDR_oversampled() {
  long sum = 0;
  for (int i = 0; i < 16; i++) sum += analogRead(A0);
  return sum / 16.0;
}
int logMap(float raw, int inMin, int inMax) {
  float norm = (raw - inMin) / (float)(inMax - inMin);
  return (int)(log(1.0 + norm * (exp(1.0) - 1.0)) * 255);
}
float adaptiveFilter(float newVal, float old) {
  float alpha = (newVal > old) ? 0.3 : 0.08;
  return alpha * newVal + (1-alpha) * old;
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: ADC oversampling, log mapping, filtering
# ============================================================
import numpy as np

LDR_MIN, LDR_MAX = 30, 950

def log_map(raw, in_min, in_max):
    norm = max(0, min(1, (raw - in_min) / (in_max - in_min)))
    return int(np.log(1.0 + norm * (np.e - 1.0)) * 255)

print("\n=== Python Simulation: LDR Analog Reading ===\n")

np.random.seed(42)
raw_10 = 500 + np.random.randint(-5, 6, 10)
over_10 = [np.mean(500 + np.random.randint(-5, 6, 16)) for _ in range(10)]
print("--- Noise Comparison (at ~500 ADC) ---")
print("  Raw stddev:  {:.2f}".format(np.std(raw_10)))
print("  Over stddev: {:.2f}  (4x reduction)\n".format(np.std(over_10)))

print("--- Log Mapping Curve ---")
print("  ADC\tLinear\tLog-mapped")
for p in [50, 200, 400, 600, 800, 950]:
    lin = int((p - LDR_MIN) / (LDR_MAX - LDR_MIN) * 255)
    log_val = log_map(p, LDR_MIN, LDR_MAX)
    print("  {}\t{}\t{}".format(p, lin, log_val))

print("\n--- Adaptive Filter: Light Transition ---")
print("raw\tfiltered\tlog_mapped")
filtered = 800.0
for t in np.arange(0, 10.0, 0.2):
    true_l = float(np.interp(t, [0,2,4,6,8,10], [800,800,100,100,800,800]))
    raw = true_l + np.random.normal(0, 3)
    alpha = 0.3 if raw > filtered else 0.08
    filtered = alpha * raw + (1 - alpha) * filtered
    mapped = log_map(filtered, LDR_MIN, LDR_MAX)
    if abs(t % 1.0) < 0.01:
        print("{:.0f}\t{:.1f}\t\t{}".format(raw, filtered, mapped))

print("\nFilter: FAST to brightening (0.3), SLOW to darkening (0.08)")`,
      challenge: 'Implement auto-calibration: continuously track the minimum and maximum ADC readings over a rolling 60-second window, and use those as the mapping endpoints. This means the installation self-adjusts to any venue without manual calibration. Add a Serial command "CAL" that prints the current auto-calibrated range.',
      successHint: 'You now understand the full analog signal chain: from photons hitting the CdS semiconductor, through the voltage divider, into the ADC, through oversampling and filtering, to a perceptually-linear brightness value. Each stage addresses a specific problem — noise, nonlinearity, temporal lag — and together they transform a noisy analog world into clean digital data.',
    },
    {
      title: 'Mapping Sensor Values to LED Patterns',
      concept: `The Arduino \`map()\` function is the workhorse of sensor-to-output conversion: \`map(value, fromLow, fromHigh, toLow, toHigh)\` performs linear interpolation. But for creative LED patterns, linear mapping is just the beginning.

We need to map a single sensor value (ambient light level, 0-255) into a **three-dimensional color space** (R, G, B, each 0-255). This is where the art of lighting design meets programming.

**Color temperature mapping**: Real-world light has color temperature measured in Kelvin. Candles are ~1800K (warm orange), daylight is ~5500K (neutral white), and overcast sky is ~7000K (cool blue). We can map our LDR reading to simulate this natural progression: dark environment = warm orange (like indoor candlelight), bright environment = cool blue-white (like outdoor daylight). The RGB values for color temperature follow well-known formulas.

**HSV color space**: Instead of thinking in R/G/B, it is often easier to work in **Hue-Saturation-Value (HSV)**. Hue is the color (0-360 degrees: red-yellow-green-cyan-blue-magenta). Saturation is the color intensity (0=gray, 100=vivid). Value is brightness (0=black, 100=full). We can map the LDR to hue (creating a rainbow response) while keeping saturation and value fixed.

The HSV-to-RGB conversion is a standard algorithm involving six sectors of the color wheel. We implement it as a function that takes H (0-360), S (0-255), V (0-255) and returns R, G, B values. This is the same conversion used in every LED strip controller, stage lighting desk, and graphics program.

**Pattern blending**: For smooth transitions between modes, we use **linear interpolation (lerp)** between two color states: \`result = colorA * (1-t) + colorB * t\`, where t transitions from 0.0 to 1.0 over time. This prevents jarring color jumps when the light level crosses a threshold.`,
      analogy: 'Mapping sensor values to colors is like a DJ mixing music. The DJ has one slider (the sensor reading) but controls multiple channels — bass, treble, volume, effects. Moving the slider smoothly changes the mix. Our map() function is the simplest mixer: one slider to one channel. HSV is like a professional mixing board with separate knobs for which instrument (hue), how loud (value), and how much reverb (saturation).',
      storyConnection: 'Festival lighting is never a single color — it is a composition that shifts with the mood of the evening. The warm glow of oil lamps at dusk, the vivid colors of electric garlands at midnight, the soft dawn light as the festival winds down. Our color mapping recreates this progression automatically, letting the ambient light tell the installation what mood to express.',
      checkQuestion: 'Why is HSV color space easier to work with than RGB for lighting effects?',
      checkAnswer: 'HSV separates the three perceptual dimensions of color: what color (hue), how vivid (saturation), and how bright (value). To create a rainbow, you just sweep hue from 0 to 360 while holding S and V constant. In RGB, the same rainbow requires coordinated changes to all three channels following complex sine-wave relationships. Similarly, to dim a color without changing its hue, you just reduce V in HSV — but in RGB you must scale all three channels proportionally while being careful about rounding errors.',
      codeIntro: 'Implement HSV-to-RGB conversion and multiple color mapping modes driven by the LDR sensor.',
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Sensor-to-LED Pattern Mapping
// HSV color space, color temperature, 4 display modes
void hsvToRgb(int h, int s, int v, int* r, int* g, int* b) {
  // Standard 6-sector HSV conversion
}
void colorTemperature(int level, int* r, int* g, int* b) {
  // level 0 = warm candle (255,147,41)
  // level 255 = cool daylight (201,226,255)
}
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: HSV, color temperature, 4 display modes
# ============================================================
import numpy as np

def hsv_to_rgb(h, s, v):
    h = h % 360
    region = h // 60
    rem = (h % 60) * 255 // 60
    p = (v * (255 - s)) // 255
    q = (v * (255 - (s * rem) // 255)) // 255
    t = (v * (255 - (s * (255 - rem)) // 255)) // 255
    if region == 0: return v, t, p
    elif region == 1: return q, v, p
    elif region == 2: return p, v, t
    elif region == 3: return p, q, v
    elif region == 4: return t, p, v
    else: return v, p, q

def color_temp(level):
    if level < 128:
        t = level / 128.0
        return 255, int(147 + t * 97), int(41 + t * 188)
    t = (level - 128) / 127.0
    return int(255 - t * 54), int(244 - t * 18), int(229 + t * 26)

print("\n=== Python Simulation: Sensor-to-LED Mapping ===\n")

print("--- Color Temperature Gradient ---")
print("Level\tR\tG\tB")
for lev in range(0, 256, 32):
    r, g, b = color_temp(lev)
    print("{}\t{}\t{}\t{}".format(lev, r, g, b))

print("\n--- HSV Rainbow ---")
print("Hue\tR\tG\tB")
for hue in range(0, 360, 30):
    r, g, b = hsv_to_rgb(hue, 255, 255)
    print("{}\t{}\t{}\t{}".format(hue, r, g, b))

print("\n--- 4 Display Modes ---")
levels = np.linspace(0, 255, 8).astype(int)
mode_names = ["Auto Brightness", "Color Temperature", "Breathing Pulse", "Rainbow Cycle"]
for mode in range(4):
    print("\nMode {}: {}".format(mode, mode_names[mode]))
    print("  Level\tR\tG\tB")
    for i, lev in enumerate(levels):
        if mode == 0:
            br = 255 - lev
            r, g, b = br, (br*200)//255, (br*150)//255
        elif mode == 1:
            r, g, b = color_temp(lev)
            sc = 255 - lev // 2
            r, g, b = (r*sc)//255, (g*sc)//255, (b*sc)//255
        elif mode == 2:
            breathe = (1 + np.cos(i/len(levels) * 2 * np.pi)) / 2
            br = int(breathe * (255 - lev // 2))
            r, g, b = br, (br*180)//255, (br*100)//255
        else:
            hue = int(i / len(levels) * 360)
            r, g, b = hsv_to_rgb(hue, 255, 255 - lev // 3)
        print("  {}\t{}\t{}\t{}".format(lev, r, g, b))`,
      challenge: 'Add a "fire" mode: use random flickering between orange and red tones, with the flicker intensity controlled by the LDR (more ambient light = calmer fire, darkness = wild flickering). Use random() with constrained ranges for each RGB channel to create realistic candle simulation.',
      successHint: 'You can now map a single sensor value into an infinite variety of lighting effects. The HSV color space gives you independent control over hue, saturation, and brightness. The color temperature function recreates the natural light progression of a festival evening. And the pattern modes demonstrate that the same sensor data can drive completely different visual experiences depending on how you map it.',
    },
    {
      title: 'State Machine for Different Lighting Modes',
      concept: `A **finite state machine (FSM)** is one of the most powerful patterns in embedded programming. Instead of tangled if/else chains, you define **states** (what the system is doing), **transitions** (what causes a change), and **actions** (what happens in each state and during transitions).

Our festival light installation has four primary states: **AMBIENT** (normal light-responsive mode), **ALERT** (rapid change detected — flash response), **PARTY** (manual override — fast color cycling), and **SLEEP** (low power — minimal glow). The transitions between states are triggered by sensor events and user input.

We implement the FSM with an enum for states, a struct for transition rules, and a \`switch\` statement in the main loop that dispatches to the current state's update function. Each state has:

- **entry action**: runs once when entering the state (e.g., print status, set initial color)
- **update action**: runs every loop iteration while in the state (e.g., update LEDs)
- **exit action**: runs once when leaving the state (e.g., save settings)
- **transition conditions**: checked every iteration (e.g., "if LDR drops below 100 for 2 seconds, go to SLEEP")

The FSM pattern prevents a common Arduino bug: **state tangling**, where a \`delay()\` in one mode blocks the button handler, or a flag from one mode is accidentally read by another. With a proper FSM, each state is self-contained. The button handler always works because it is outside the state logic. Transitions are explicit and traceable.

We also add **timed transitions**: the ALERT state automatically returns to AMBIENT after 3 seconds (a flash response should not last forever). The PARTY state has a 60-second timeout to prevent leaving the installation in override mode. These timeouts use \`millis()\` comparisons, not \`delay()\`, so the LEDs keep updating smoothly.`,
      analogy: 'A traffic light is a state machine. It has three states (GREEN, YELLOW, RED), with timed transitions between them. The light does not "think about" all three states simultaneously — it is always in exactly one state, doing that state action (showing that color). When the timer expires, it transitions to the next state. Our lighting installation is a more complex traffic light: more states, more transition triggers, but the same clean, predictable structure.',
      storyConnection: 'A festival has distinct phases: preparation (setting up lights during the day), opening (the moment of first illumination at dusk), celebration (the vibrant heart of the evening), and closing (the gradual dimming at dawn). Our state machine mirrors these phases: SLEEP during the day, AMBIENT at dusk, ALERT when the crowd surges, PARTY at the peak of celebration. The installation lives the festival rhythm.',
      checkQuestion: 'Why is a state machine better than nested if/else statements for managing multiple modes?',
      checkAnswer: 'Nested if/else statements create "spaghetti code" where the logic for one mode leaks into another through shared variables and conditions. Adding a new mode means modifying every branch. A state machine isolates each mode: its logic, its variables, and its transitions are self-contained. Adding a new state means adding one new case to the switch, one entry/exit pair, and defining its transitions. The rest of the code is untouched. This modularity is why FSMs are used in everything from elevator controllers to video game AI.',
      codeIntro: 'Implement a full state machine with four states, timed and event-triggered transitions, and per-state LED behavior.',
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// Festival Lights - State Machine Controller
// 4 states: AMBIENT, ALERT, PARTY, SLEEP
// Transitions:
//   AMBIENT -> ALERT: sudden LDR change (>150)
//   ALERT -> AMBIENT: 3s timeout
//   AMBIENT -> PARTY: button
//   PARTY -> AMBIENT: 60s timeout or button
//   AMBIENT -> SLEEP: bright light for 10s
//   SLEEP -> AMBIENT: darkness or button
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: Finite State Machine
# ============================================================
import numpy as np

def hsv_to_rgb(h, s, v):
    h = h % 360
    region = h // 60
    rem = (h % 60) * 255 // 60
    p = (v*(255-s))//255
    q = (v*(255-(s*rem)//255))//255
    t = (v*(255-(s*(255-rem))//255))//255
    if region == 0: return v, t, p
    elif region == 1: return q, v, p
    elif region == 2: return p, v, t
    elif region == 3: return p, q, v
    elif region == 4: return t, p, v
    else: return v, p, q

print("\n=== Python Simulation: Festival Light State Machine ===\n")

events = [
    (0,500,False), (2,500,False), (4,500,False),
    (5,200,False), (6,200,False), (8,200,False),
    (9,200,False), (10,200,True), (12,200,False),
    (15,200,True), (17,200,False), (20,900,False),
    (25,900,False), (30,900,False), (33,900,False),
    (35,100,False), (38,100,False),
]

state = "AMBIENT"
state_start = 0.0
prev_ldr = 500
log = []

print("[ENTER AMBIENT]\n")
print("time\tstate\t\tldr\tR\tG\tB\ttransition")
print("-" * 75)

for time_s, ldr, button in events:
    elapsed = time_s - state_start
    transition = ""
    if state == "AMBIENT":
        lev = max(0, min(255, int((ldr - 50) / 850 * 255)))
        br = 255 - lev
        r, g, b = br, (br*200)//255, (br*140)//255
        if abs(ldr - prev_ldr) > 150:
            transition = "-> ALERT"
            state, state_start = "ALERT", time_s
        elif ldr > 800 and elapsed > 10:
            transition = "-> SLEEP"
            state, state_start = "SLEEP", time_s
        elif button:
            transition = "-> PARTY"
            state, state_start = "PARTY", time_s
    elif state == "ALERT":
        p = int((1 + np.cos(elapsed * 5 * 2 * np.pi)) / 2 * 255)
        r, g, b = p, p, p
        if elapsed > 3 or button:
            transition = "-> AMBIENT"
            state, state_start = "AMBIENT", time_s
    elif state == "PARTY":
        hue = int((elapsed * 200) % 360)
        r, g, b = hsv_to_rgb(hue, 255, 255)
        if elapsed > 60 or button:
            transition = "-> AMBIENT"
            state, state_start = "AMBIENT", time_s
    elif state == "SLEEP":
        glow = 10 + int((1 + np.cos(time_s % 4 / 4 * 2 * np.pi)) / 2 * 15)
        r, g, b = glow, glow // 2, 0
        if ldr < 200 or button:
            transition = "-> AMBIENT"
            state, state_start = "AMBIENT", time_s

    st = state + "\t" if len(state) < 7 else state
    print("{}\t{}\t{}\t{}\t{}\t{}\t{}".format(time_s, st, ldr, r, g, b, transition))
    if transition: log.append((time_s, transition))
    prev_ldr = ldr

print("\n=== Transition Log ===")
for t, tr in log: print("  t={}s: {}".format(t, tr))
print("Total transitions: {}".format(len(log)))`,
      challenge: 'Add a SUNRISE state that activates at a specific time (configurable via Serial command). The SUNRISE state slowly ramps from deep red to warm orange to full white over 5 minutes, simulating a dawn wake-up light. Add a simple clock using millis() and a "SET HH:MM" serial command to set the current time.',
      successHint: 'The state machine makes the installation behavior predictable, debuggable, and extensible. Each state is isolated — you can modify PARTY mode without touching AMBIENT. Transitions are explicit and logged. Timeouts prevent stuck states. This FSM pattern is the same one used in industrial PLCs, traffic light controllers, and spacecraft mission sequencers.',
    },
    {
      title: 'Documentation and Installation Guide',
      concept: `A festival light installation is not a lab experiment — it goes into a real venue, is handled by non-engineers, and must work reliably for hours without supervision. The documentation must address three realities: **setup** (getting it working at the venue), **operation** (how staff interact with it), and **failure recovery** (what to do when something goes wrong at 9 PM with a hundred people watching).

The installation guide differs from lab documentation in important ways. Lab docs assume the reader is a fellow engineer with a bench, tools, and time. Installation docs assume the reader is a festival volunteer with a screwdriver, a flashlight, and ten minutes before the crowd arrives.

We write the guide at three levels of detail:

**Quick Start** (1 page): For the person who just needs it working. Power on, verify LED self-test, aim LDR toward the festival area, press button to select mode. Done.

**Setup Guide** (3 pages): For the person installing it. Mounting the Arduino enclosure, routing wires to the LED strip, positioning the LDR, connecting the power supply, waterproofing for outdoor use, and running the calibration routine.

**Technical Reference** (5 pages): For the person who needs to modify or repair it. Complete circuit description, code architecture, state machine diagram, calibration procedures, component specifications, and replacement instructions.

We also write a **pre-event checklist**: a numbered list of tests to run before the festival opens. Self-test passes? Check. LDR responding to light changes? Check. Button cycling modes? Check. Buzzer/speaker working? Check. Power supply warm but not hot? Check. Backup Arduino and LED strip on hand? Check. This checklist is the difference between a smooth opening and a panicked scramble.`,
      analogy: 'An installation guide is like the safety card in an airplane seat pocket. It must work for everyone — engineers, artists, volunteers, people who do not speak the language fluently. It uses pictures, numbered steps, and clear warnings. It covers normal operation ("how to adjust your seat") and emergencies ("if the lights stop working"). Our guide follows the same principles: clarity, brevity, and coverage of what to do when things go wrong.',
      storyConnection: 'Festival traditions survive because the knowledge of how to organize them is carefully passed down. Who hangs the lanterns? Where do the oil lamps go? How do you keep them lit in the wind? Our installation guide is the modern equivalent of that oral tradition — a written record that ensures the light display can be set up, operated, and maintained by anyone, year after year.',
      checkQuestion: 'Why do we include a "failure recovery" section in installation documentation for a simple LED project?',
      checkAnswer: 'Because failures happen at the worst possible time — during the festival, in the dark, with an audience. A loose wire, a drained battery, a corrupted upload. Without a troubleshooting guide, the installer is helpless. With one, they can diagnose and fix the most common issues in minutes: "LEDs not responding? Check the data wire connection at pin 11. Still nothing? Swap to the backup Arduino." The troubleshooting section is often the most-used part of any installation guide.',
      codeIntro: 'Create the complete capstone sketch with full documentation header, self-test, state machine, and all subsystems integrated.',
      code: `# ============================================================
# ARDUINO CODE (copy to Arduino IDE to run on hardware)
# ============================================================
arduino_code = """
// FESTIVAL LIGHT INSTALLATION - CAPSTONE
// LDR sensor | RGB LEDs | 4-state FSM
//
// BOM: Arduino Uno, LDR + 10k, 3 LEDs + 220R, pot, button ($10-20)
// CIRCUIT:
//   LDR: 5V -> LDR -> A0 -> 10k -> GND
//   LEDs: Pin 9->RED, Pin 10->GREEN, Pin 11->BLUE (via 220R)
//   Button: Pin 2 -> button -> GND (internal pull-up)
//
// STATE MACHINE:
//   AMBIENT <-> ALERT (sudden light change, 3s timeout)
//   AMBIENT <-> PARTY (button, 60s timeout)
//   AMBIENT <-> SLEEP (bright 10s / darkness wakes)
//
// TROUBLESHOOTING:
//   No LEDs:      Check pin/polarity
//   Always bright: LDR disconnected
//   Stuck SLEEP:   Press button or cover LDR
"""
print("=== Arduino Code (copy to Arduino IDE) ===")
print(arduino_code)

# ============================================================
# PYTHON SIMULATION: Complete capstone
# ============================================================
import numpy as np

def hsv_to_rgb(h, s, v):
    h = h % 360
    region = h // 60
    rem = (h % 60) * 255 // 60
    p = (v*(255-s))//255
    q = (v*(255-(s*rem)//255))//255
    t = (v*(255-(s*(255-rem))//255))//255
    if region == 0: return v, t, p
    elif region == 1: return q, v, p
    elif region == 2: return p, v, t
    elif region == 3: return p, q, v
    elif region == 4: return t, p, v
    else: return v, p, q

print("\n=== FESTIVAL LIGHT INSTALLATION CAPSTONE ===\n")

print("--- SELF TEST ---")
for c in ["Red", "Green", "Blue"]: print("  {} ramp... OK".format(c))
print("  LDR: 520 (normal indoor)")
print("--- SELF TEST COMPLETE ---\n")

scenario = [
    (0,500,False,"Evening begins"), (3,500,False,""),
    (5,200,False,"Sudden dark"), (7,200,False,"ALERT pulsing"),
    (8,200,False,"Timeout->AMBIENT"), (10,200,True,"Button->PARTY"),
    (12,200,False,"Rainbow"), (15,200,True,"Button->AMBIENT"),
    (18,200,False,"Warm glow"), (20,900,False,"Dawn rising"),
    (25,900,False,"Bright 5s"), (30,900,False,"10s->SLEEP"),
    (33,900,False,"Dim glow"), (35,100,False,"Dark->WAKE"),
    (38,100,False,"Ready"),
]

state = "AMBIENT"
state_start = 0.0
prev_ldr = 500
transitions = []

print("[ENTER AMBIENT]")
print("time\tstate\t\tldr\tR\tG\tB\tnote")
print("-" * 75)

for time_s, ldr, btn, note in scenario:
    elapsed = time_s - state_start
    tr = ""
    if state == "AMBIENT":
        lev = max(0, min(255, int((ldr-50)/850*255)))
        br = 255 - lev
        r, g, b = br, (br*200)//255, (br*140)//255
        if abs(ldr-prev_ldr) > 150: tr="->ALERT"; state="ALERT"; state_start=time_s
        elif ldr > 800 and elapsed > 10: tr="->SLEEP"; state="SLEEP"; state_start=time_s
        elif btn: tr="->PARTY"; state="PARTY"; state_start=time_s
    elif state == "ALERT":
        p = int((1+np.cos(elapsed*5*2*np.pi))/2*255)
        r, g, b = p, p, p
        if elapsed > 3 or btn: tr="->AMBIENT"; state="AMBIENT"; state_start=time_s
    elif state == "PARTY":
        hue = int((elapsed*200)%360)
        r, g, b = hsv_to_rgb(hue, 255, 255)
        if elapsed > 60 or btn: tr="->AMBIENT"; state="AMBIENT"; state_start=time_s
    elif state == "SLEEP":
        glow = 10+int((1+np.cos(time_s%4/4*2*np.pi))/2*15)
        r, g, b = glow, glow//2, 0
        if ldr < 200 or btn: tr="->AMBIENT"; state="AMBIENT"; state_start=time_s

    st = state+"\t" if len(state) < 7 else state
    print("{}\t{}\t{}\t{}\t{}\t{}\t{}".format(time_s, st, ldr, r, g, b, note))
    if tr: transitions.append((time_s, tr))
    prev_ldr = ldr

print("\n=== CAPSTONE COMPLETE ===")
print("Transitions: {}".format(len(transitions)))
for t, tr in transitions: print("  t={}s: {}".format(t, tr))
print("\nSkills: analog sensing, ADC oversampling, voltage dividers,")
print("  log mapping, HSV color, state machines, adaptive filtering")`,
      challenge: 'Extend the installation with a WS2812B NeoPixel strip (30 pixels) using the Adafruit NeoPixel library. Each pixel responds to the same state machine but with a spatial gradient: pixel 0 is the "leader" that follows the LDR directly, and each subsequent pixel follows the previous one with a slight delay (creating a wave effect). Add a "waterfall" animation in PARTY mode.',
      successHint: 'You have built a complete, documented, installation-ready festival light system. The LDR senses the environment. The state machine manages behavior. The HSV color mapping creates beautiful effects. The documentation ensures anyone can set it up, operate it, and fix it. This is the full engineering cycle: concept, design, build, test, document, deploy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (LED circuit design & photometry)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Arduino C/C++ to build a light-responsive LED festival installation with LDR sensing, HSV color mapping, state machine control, and professional documentation. Click to start the code environment.</p>
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
