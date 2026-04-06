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
      code: `// =============================================
// Festival Light Installation — System Setup
// LDR sensor + RGB LEDs + user controls
// =============================================

// --- Pin Assignments ---
const int LDR_PIN = A0;       // Light-Dependent Resistor (voltage divider)
const int POT_PIN = A1;       // Potentiometer for sensitivity adjustment
const int BUTTON_PIN = 2;     // Mode select button (with internal pull-up)

const int LED_R = 9;          // Red channel (PWM)
const int LED_G = 10;         // Green channel (PWM)
const int LED_B = 11;         // Blue channel (PWM)

// --- Sensor Calibration ---
// These values depend on YOUR specific LDR and lighting conditions.
// Run the calibration routine (below) to find your values.
int ldrMin = 50;     // ADC reading in near-darkness
int ldrMax = 900;    // ADC reading in bright light
int ldrRaw = 0;      // latest raw ADC reading
int ldrMapped = 0;   // mapped to 0-255 range

// --- Sensitivity (from potentiometer) ---
float sensitivity = 1.0;  // 0.5 to 2.0, controlled by pot

// --- Display Mode ---
int currentMode = 0;
const int NUM_MODES = 4;
const char* modeNames[] = {
  "Auto Brightness",   // Mode 0: brightness follows ambient light
  "Color Temperature",  // Mode 1: warm in dark, cool in bright
  "Pulse",              // Mode 2: breathing pulse, rate follows light
  "Rainbow Cycle"       // Mode 3: cycling hue, speed follows light
};

// --- Button debounce ---
bool lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long DEBOUNCE_DELAY = 50;

// --- Timing ---
unsigned long lastReadTime = 0;
unsigned long lastPrintTime = 0;
const int READ_INTERVAL_MS = 20;   // 50 Hz sensor reading
const int PRINT_INTERVAL_MS = 200; // 5 Hz serial output

void setup() {
  Serial.begin(115200);
  Serial.println("=== Festival Light Installation ===");
  Serial.println("LDR Sensor | RGB LEDs | 4 Display Modes");
  Serial.println();

  // Configure pins
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // internal pull-up resistor

  // Self-test: cycle through R, G, B
  Serial.println("Self-test: RGB channels...");
  int pins[] = {LED_R, LED_G, LED_B};
  const char* colors[] = {"Red", "Green", "Blue"};
  for (int i = 0; i < 3; i++) {
    for (int b = 0; b <= 255; b += 5) {
      analogWrite(pins[i], b);
      delay(2);
    }
    delay(200);
    for (int b = 255; b >= 0; b -= 5) {
      analogWrite(pins[i], b);
      delay(2);
    }
    Serial.print("  ");
    Serial.print(colors[i]);
    Serial.println(" OK");
  }

  // Calibration: read LDR for 3 seconds
  Serial.println();
  Serial.println("Calibration: reading LDR for 3 seconds...");
  Serial.println("  (cover and uncover the sensor for best calibration)");
  int calMin = 1023, calMax = 0;
  unsigned long calStart = millis();
  while (millis() - calStart < 3000) {
    int val = analogRead(LDR_PIN);
    if (val < calMin) calMin = val;
    if (val > calMax) calMax = val;
    delay(20);
  }

  if (calMax - calMin > 50) {
    ldrMin = calMin;
    ldrMax = calMax;
    Serial.print("  Calibrated: min=");
    Serial.print(ldrMin);
    Serial.print(" max=");
    Serial.println(ldrMax);
  } else {
    Serial.println("  Using defaults (not enough variation detected)");
  }

  Serial.println();
  Serial.print("Starting in mode: ");
  Serial.println(modeNames[currentMode]);
  Serial.println("Press button to cycle modes.");
  Serial.println();
  Serial.println("ldr_raw\\tldr_mapped\\tsensitivity\\tmode\\tR\\tG\\tB");

  lastReadTime = millis();
  lastPrintTime = millis();
}

void setRGB(int r, int g, int b) {
  analogWrite(LED_R, constrain(r, 0, 255));
  analogWrite(LED_G, constrain(g, 0, 255));
  analogWrite(LED_B, constrain(b, 0, 255));
}

void loop() {
  // --- Read sensor at 50 Hz ---
  if (millis() - lastReadTime >= READ_INTERVAL_MS) {
    lastReadTime = millis();

    // Read and map LDR
    ldrRaw = analogRead(LDR_PIN);
    ldrMapped = map(constrain(ldrRaw, ldrMin, ldrMax), ldrMin, ldrMax, 0, 255);

    // Read sensitivity pot (0-1023 -> 0.5-2.0)
    int potVal = analogRead(POT_PIN);
    sensitivity = 0.5 + (potVal / 1023.0) * 1.5;

    // Apply sensitivity
    int adjusted = constrain((int)(ldrMapped * sensitivity), 0, 255);

    // --- Mode 0: Auto Brightness (inverse: dark room = bright LEDs) ---
    if (currentMode == 0) {
      int brightness = 255 - adjusted;  // invert: dark = bright
      setRGB(brightness, brightness, brightness);  // warm white
    }
  }

  // --- Button handling with debounce ---
  bool reading = digitalRead(BUTTON_PIN);
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }
  if (millis() - lastDebounceTime > DEBOUNCE_DELAY) {
    if (reading == LOW && lastButtonState == HIGH) {
      currentMode = (currentMode + 1) % NUM_MODES;
      Serial.print(">MODE: ");
      Serial.println(modeNames[currentMode]);
    }
  }
  lastButtonState = reading;

  // --- Serial output at 5 Hz ---
  if (millis() - lastPrintTime >= PRINT_INTERVAL_MS) {
    lastPrintTime = millis();
    Serial.print(ldrRaw);
    Serial.print("\\t");
    Serial.print(ldrMapped);
    Serial.print("\\t");
    Serial.print(sensitivity, 1);
    Serial.print("\\t");
    Serial.print(currentMode);
    Serial.print("\\t");
    // Read back actual PWM values would need tracking; print mapped instead
    Serial.print(255 - ldrMapped);
    Serial.print("\\t");
    Serial.print(255 - ldrMapped);
    Serial.print("\\t");
    Serial.println(255 - ldrMapped);
  }
}

// Upload and open Serial Monitor at 115200.
// Cover the LDR with your hand: LEDs should brighten.
// Shine a flashlight on it: LEDs should dim.
// Press the button: mode changes (modes 1-3 implemented in next lessons).`,
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
      code: `// =============================================
// LDR Analog Reading — Deep ADC Techniques
// Oversampling, log mapping, adaptive filtering
// =============================================

const int LDR_PIN = A0;
const int LED_R = 9;
const int LED_G = 10;
const int LED_B = 11;

// --- Oversampling Configuration ---
const int OVERSAMPLE_COUNT = 16;  // 16 samples -> ~12-bit effective resolution
const int OVERSAMPLE_BITS = 2;    // extra bits gained: log2(sqrt(16)) = 2

// --- Calibration ---
int ldrMin = 30;     // ADC value in near-darkness
int ldrMax = 950;    // ADC value in bright light

// --- Adaptive filter ---
// Different smoothing rates for brightening vs dimming
// (matches LDR physics: fast response to light, slow to dark)
float filteredValue = 0.0;
const float ALPHA_BRIGHTEN = 0.3;  // fast: light increase
const float ALPHA_DARKEN = 0.08;   // slow: light decrease (LDR lag)
bool filterInit = false;

// --- Noise statistics ---
float noiseSum = 0.0;
float noiseSumSq = 0.0;
int noiseCount = 0;

unsigned long lastReadTime = 0;
unsigned long lastPrintTime = 0;
const int READ_INTERVAL_MS = 20;
const int PRINT_INTERVAL_MS = 200;

// --- Oversampled ADC read ---
// Takes OVERSAMPLE_COUNT readings and returns the average
// Result is in the 10-bit range (0-1023), but with reduced noise
float readLDR_oversampled() {
  long sum = 0;
  for (int i = 0; i < OVERSAMPLE_COUNT; i++) {
    sum += analogRead(LDR_PIN);
    // Small delay between samples to allow ADC to settle
    delayMicroseconds(50);
  }
  return (float)sum / OVERSAMPLE_COUNT;
}

// --- Logarithmic mapping ---
// Converts ADC reading to perceptually-linear brightness (0-255)
// Uses log mapping to compensate for LDR's logarithmic response
int logMap(float rawValue, int inMin, int inMax) {
  // Clamp input
  if (rawValue < inMin) rawValue = inMin;
  if (rawValue > inMax) rawValue = inMax;

  // Normalize to 0.0-1.0
  float normalized = (rawValue - inMin) / (float)(inMax - inMin);

  // Apply logarithmic curve (compensates LDR log response)
  // log(1) = 0, log(e) = 1; we use a shifted log for 0-1 input
  // mapped = log(1 + normalized * (e-1)) which gives 0 when norm=0, 1 when norm=1
  float mapped = log(1.0 + normalized * (exp(1.0) - 1.0));

  return (int)(mapped * 255);
}

// --- Adaptive exponential filter ---
// Uses different alpha values for rising vs falling signals
float adaptiveFilter(float newValue) {
  if (!filterInit) {
    filteredValue = newValue;
    filterInit = true;
    return filteredValue;
  }

  float alpha;
  if (newValue > filteredValue) {
    alpha = ALPHA_BRIGHTEN;  // light increasing: respond fast
  } else {
    alpha = ALPHA_DARKEN;    // light decreasing: respond slowly (like LDR)
  }

  filteredValue = alpha * newValue + (1.0 - alpha) * filteredValue;
  return filteredValue;
}

// --- Track noise level ---
void trackNoise(float rawValue) {
  noiseSum += rawValue;
  noiseSumSq += rawValue * rawValue;
  noiseCount++;
}

float getNoiseStdDev() {
  if (noiseCount < 2) return 0.0;
  float mean = noiseSum / noiseCount;
  float variance = (noiseSumSq / noiseCount) - (mean * mean);
  if (variance < 0) variance = 0;  // numerical protection
  return sqrt(variance);
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== LDR Analog Reading — ADC Deep Dive ===");
  Serial.println("Oversampling: 16x | Mapping: logarithmic | Filter: adaptive");
  Serial.println();

  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  // Demonstrate raw vs oversampled noise
  Serial.println("--- Noise Comparison (sensor held still) ---");
  Serial.println("10 raw readings vs 10 oversampled readings:");
  Serial.print("  Raw:         ");
  for (int i = 0; i < 10; i++) {
    Serial.print(analogRead(LDR_PIN));
    if (i < 9) Serial.print(", ");
    delay(5);
  }
  Serial.println();

  Serial.print("  Oversampled: ");
  for (int i = 0; i < 10; i++) {
    Serial.print(readLDR_oversampled(), 1);
    if (i < 9) Serial.print(", ");
  }
  Serial.println();
  Serial.println("  (Oversampled values should have tighter spread)");
  Serial.println();

  // Show log mapping curve
  Serial.println("--- Log Mapping Curve ---");
  Serial.println("  ADC -> Linear -> Log-mapped");
  int testPoints[] = {50, 200, 400, 600, 800, 950};
  for (int i = 0; i < 6; i++) {
    int linear = map(testPoints[i], ldrMin, ldrMax, 0, 255);
    int logged = logMap(testPoints[i], ldrMin, ldrMax);
    Serial.print("  ");
    Serial.print(testPoints[i]);
    Serial.print("\\t-> ");
    Serial.print(linear);
    Serial.print("\\t-> ");
    Serial.println(logged);
  }
  Serial.println("  (Log mapping spreads out the dark end for better sensitivity)");
  Serial.println();

  Serial.println("raw\\toversampled\\tfiltered\\tlog_mapped\\tnoise_sd");
  lastReadTime = millis();
  lastPrintTime = millis();
}

void loop() {
  if (millis() - lastReadTime >= READ_INTERVAL_MS) {
    lastReadTime = millis();

    // Step 1: Oversampled reading (reduces ADC noise)
    float oversampled = readLDR_oversampled();

    // Track noise statistics
    trackNoise(oversampled);

    // Step 2: Adaptive filter (smooths temporal variation)
    float filtered = adaptiveFilter(oversampled);

    // Step 3: Logarithmic mapping (perceptually linear 0-255)
    int mapped = logMap(filtered, ldrMin, ldrMax);

    // Step 4: Apply to LEDs (inverted: dark room = bright LEDs)
    int brightness = 255 - mapped;
    analogWrite(LED_R, brightness);
    analogWrite(LED_G, brightness);
    analogWrite(LED_B, brightness);
  }

  // Serial output at 5 Hz
  if (millis() - lastPrintTime >= PRINT_INTERVAL_MS) {
    lastPrintTime = millis();
    int rawSingle = analogRead(LDR_PIN);
    float oversampled = readLDR_oversampled();
    int mapped = logMap(filteredValue, ldrMin, ldrMax);

    Serial.print(rawSingle);
    Serial.print("\\t");
    Serial.print(oversampled, 1);
    Serial.print("\\t");
    Serial.print(filteredValue, 1);
    Serial.print("\\t");
    Serial.print(mapped);
    Serial.print("\\t");
    Serial.println(getNoiseStdDev(), 2);

    // Reset noise tracking every 50 readings (10 seconds)
    if (noiseCount >= 50) {
      noiseSum = 0; noiseSumSq = 0; noiseCount = 0;
    }
  }
}

// Open Serial Plotter: you will see 4 lines:
// - raw (jittery), oversampled (less jittery), filtered (smooth), mapped (smooth + remapped)
// Cover the LDR slowly: the filtered line should follow smoothly.
// Flash a light quickly: the filtered line responds faster (adaptive alpha).`,
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
      code: `// =============================================
// Sensor-to-LED Pattern Mapping
// HSV color space, color temperature, rainbow cycle
// =============================================

const int LDR_PIN = A0;
const int POT_PIN = A1;
const int BUTTON_PIN = 2;
const int LED_R = 9;
const int LED_G = 10;
const int LED_B = 11;

// --- HSV to RGB conversion ---
// H: 0-360 (degrees), S: 0-255, V: 0-255
// Returns R, G, B via pointers (0-255 each)
void hsvToRgb(int h, int s, int v, int* r, int* g, int* b) {
  // Normalize H to 0-360
  h = h % 360;
  if (h < 0) h += 360;

  int region = h / 60;
  int remainder = (h % 60) * 255 / 60;

  int p = (v * (255 - s)) / 255;
  int q = (v * (255 - (s * remainder) / 255)) / 255;
  int t = (v * (255 - (s * (255 - remainder)) / 255)) / 255;

  switch (region) {
    case 0:  *r = v; *g = t; *b = p; break;
    case 1:  *r = q; *g = v; *b = p; break;
    case 2:  *r = p; *g = v; *b = t; break;
    case 3:  *r = p; *g = q; *b = v; break;
    case 4:  *r = t; *g = p; *b = v; break;
    default: *r = v; *g = p; *b = q; break;
  }
}

// --- Color Temperature Mapping ---
// Maps a value 0-255 (dark to bright) to warm-to-cool white
// Approximation of blackbody radiation colors
void colorTemperature(int level, int* r, int* g, int* b) {
  // level 0 (dark room) = warm candle (255, 147, 41)
  // level 128 (medium)  = neutral white (255, 244, 229)
  // level 255 (bright)  = cool daylight (201, 226, 255)

  if (level < 128) {
    float t = level / 128.0;
    *r = 255;
    *g = 147 + (int)(t * (244 - 147));
    *b = 41  + (int)(t * (229 - 41));
  } else {
    float t = (level - 128) / 127.0;
    *r = 255 - (int)(t * (255 - 201));
    *g = 244 - (int)(t * (244 - 226));
    *b = 229 + (int)(t * (255 - 229));
  }
}

// --- Lerp (linear interpolation) for smooth transitions ---
int lerpColor(int a, int b, float t) {
  return a + (int)((b - a) * t);
}

// --- State ---
int currentMode = 0;
const int NUM_MODES = 4;
float filteredLDR = 0.0;
bool filterInit = false;
unsigned long cycleOffset = 0;  // for rainbow timing

// Button debounce
bool lastBtn = HIGH;
unsigned long lastDebounce = 0;

unsigned long lastRead = 0;
unsigned long lastPrint = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("=== Sensor-to-LED Pattern Mapping ===");
  Serial.println("4 modes: Auto | ColorTemp | Pulse | Rainbow");
  Serial.println();

  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Demo: show color temperature gradient
  Serial.println("Color temperature gradient (dark to bright):");
  for (int i = 0; i <= 255; i += 32) {
    int r, g, b;
    colorTemperature(i, &r, &g, &b);
    Serial.print("  level=");
    Serial.print(i);
    Serial.print(" -> RGB(");
    Serial.print(r);
    Serial.print(",");
    Serial.print(g);
    Serial.print(",");
    Serial.print(b);
    Serial.println(")");
  }
  Serial.println();

  Serial.println("mode\\tldr\\tR\\tG\\tB\\thue");
  lastRead = millis();
  lastPrint = millis();
  cycleOffset = millis();
}

void setRGB(int r, int g, int b) {
  analogWrite(LED_R, constrain(r, 0, 255));
  analogWrite(LED_G, constrain(g, 0, 255));
  analogWrite(LED_B, constrain(b, 0, 255));
}

int outR = 0, outG = 0, outB = 0;
int currentHue = 0;

void loop() {
  // --- Sensor reading at 50 Hz ---
  if (millis() - lastRead >= 20) {
    lastRead = millis();

    // Oversampled LDR
    long sum = 0;
    for (int i = 0; i < 8; i++) sum += analogRead(LDR_PIN);
    float raw = sum / 8.0;

    // Adaptive filter
    float alpha = (raw > filteredLDR) ? 0.3 : 0.08;
    if (!filterInit) { filteredLDR = raw; filterInit = true; }
    else { filteredLDR = alpha * raw + (1.0 - alpha) * filteredLDR; }

    int level = map(constrain((int)filteredLDR, 50, 900), 50, 900, 0, 255);

    // --- Mode 0: Auto Brightness (warm white, brightness follows light) ---
    if (currentMode == 0) {
      int brightness = 255 - level;
      outR = brightness;
      outG = (brightness * 200) / 255;  // slight warm tint
      outB = (brightness * 150) / 255;
    }

    // --- Mode 1: Color Temperature ---
    else if (currentMode == 1) {
      colorTemperature(level, &outR, &outG, &outB);
      // Scale brightness inversely with ambient light
      int scale = 255 - level / 2;  // never fully dark
      outR = (outR * scale) / 255;
      outG = (outG * scale) / 255;
      outB = (outB * scale) / 255;
    }

    // --- Mode 2: Breathing Pulse (rate follows ambient light) ---
    else if (currentMode == 2) {
      // Pulse period: dark = slow (3s), bright = fast (0.5s)
      float period = 0.5 + (level / 255.0) * 2.5;  // 0.5 to 3.0 seconds
      float t = fmod((millis() - cycleOffset) / 1000.0, period) / period;
      float breathe = (1.0 + cos(t * TWO_PI)) / 2.0;

      int brightness = (int)(breathe * (255 - level / 2));
      outR = brightness;
      outG = (brightness * 180) / 255;
      outB = (brightness * 100) / 255;
    }

    // --- Mode 3: Rainbow Cycle (speed follows ambient light) ---
    else if (currentMode == 3) {
      // Cycle speed: dark = slow (10s per revolution), bright = fast (1s)
      float cyclePeriod = 1.0 + ((255 - level) / 255.0) * 9.0;
      float elapsed = (millis() - cycleOffset) / 1000.0;
      currentHue = (int)(fmod(elapsed / cyclePeriod, 1.0) * 360);

      int brightness = 255 - level / 3;  // dim slightly in bright light
      hsvToRgb(currentHue, 255, brightness, &outR, &outG, &outB);
    }

    setRGB(outR, outG, outB);
  }

  // --- Button ---
  bool btn = digitalRead(BUTTON_PIN);
  if (btn != lastBtn) lastDebounce = millis();
  if (millis() - lastDebounce > 50 && btn == LOW && lastBtn == HIGH) {
    currentMode = (currentMode + 1) % NUM_MODES;
    cycleOffset = millis();
    Serial.print(">MODE ");
    Serial.println(currentMode);
  }
  lastBtn = btn;

  // --- Serial output ---
  if (millis() - lastPrint >= 200) {
    lastPrint = millis();
    Serial.print(currentMode);
    Serial.print("\\t");
    Serial.print((int)filteredLDR);
    Serial.print("\\t");
    Serial.print(outR);
    Serial.print("\\t");
    Serial.print(outG);
    Serial.print("\\t");
    Serial.print(outB);
    Serial.print("\\t");
    Serial.println(currentHue);
  }
}

// Press button to cycle through modes:
// Mode 0: Warm white, brightness tracks darkness
// Mode 1: Color temperature shifts warm-to-cool with light
// Mode 2: Breathing pulse, speed changes with ambient light
// Mode 3: Rainbow cycle, hue rotates, speed follows light`,
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
      code: `// =============================================
// Festival Lights — State Machine Controller
// 4 states with entry/update/exit actions and timed transitions
// =============================================

const int LDR_PIN = A0;
const int BUTTON_PIN = 2;
const int LED_R = 9;
const int LED_G = 10;
const int LED_B = 11;

// --- State Definitions ---
enum LightState {
  STATE_AMBIENT,   // Normal: light-responsive display
  STATE_ALERT,     // Rapid light change detected: flash response
  STATE_PARTY,     // Manual override: fast rainbow cycling
  STATE_SLEEP      // Low power: dim warm glow
};

const char* stateNames[] = {"AMBIENT", "ALERT", "PARTY", "SLEEP"};

LightState currentState = STATE_AMBIENT;
LightState previousState = STATE_AMBIENT;
unsigned long stateEnteredAt = 0;

// --- Transition Timeouts ---
const unsigned long ALERT_TIMEOUT_MS = 3000;    // auto-return to AMBIENT
const unsigned long PARTY_TIMEOUT_MS = 60000;   // 60s max in party mode
const unsigned long SLEEP_LIGHT_THRESHOLD = 800; // ADC value for "bright enough to sleep"
const unsigned long SLEEP_DARK_THRESHOLD = 200;  // ADC value for "dark enough to wake"

// --- Sensor State ---
float filteredLDR = 500.0;
float prevFilteredLDR = 500.0;
const float LDR_CHANGE_THRESHOLD = 150.0;  // sudden change triggers ALERT

// --- HSV helper ---
void hsvToRgb(int h, int s, int v, int* r, int* g, int* b) {
  h = h % 360;
  int region = h / 60;
  int rem = (h % 60) * 255 / 60;
  int p = (v * (255 - s)) / 255;
  int q = (v * (255 - (s * rem) / 255)) / 255;
  int t = (v * (255 - (s * (255 - rem)) / 255)) / 255;
  switch (region) {
    case 0:  *r = v; *g = t; *b = p; break;
    case 1:  *r = q; *g = v; *b = p; break;
    case 2:  *r = p; *g = v; *b = t; break;
    case 3:  *r = p; *g = q; *b = v; break;
    case 4:  *r = t; *g = p; *b = v; break;
    default: *r = v; *g = p; *b = q; break;
  }
}

void setRGB(int r, int g, int b) {
  analogWrite(LED_R, constrain(r, 0, 255));
  analogWrite(LED_G, constrain(g, 0, 255));
  analogWrite(LED_B, constrain(b, 0, 255));
}

// --- State Transition ---
void transitionTo(LightState newState) {
  if (newState == currentState) return;

  // Exit action for current state
  Serial.print("[EXIT ");
  Serial.print(stateNames[currentState]);
  Serial.print("] after ");
  Serial.print((millis() - stateEnteredAt) / 1000.0, 1);
  Serial.println("s");

  previousState = currentState;
  currentState = newState;
  stateEnteredAt = millis();

  // Entry action for new state
  Serial.print("[ENTER ");
  Serial.print(stateNames[currentState]);
  Serial.println("]");

  switch (currentState) {
    case STATE_AMBIENT:
      // Smooth fade to current ambient level
      break;
    case STATE_ALERT:
      // Flash white briefly on entry
      setRGB(255, 255, 255);
      break;
    case STATE_PARTY:
      Serial.println("  Party mode! 60s timeout.");
      break;
    case STATE_SLEEP:
      Serial.println("  Sleep mode. Bright light or button to wake.");
      setRGB(20, 10, 0);  // dim warm glow
      break;
  }
}

// --- Button ---
bool lastBtn = HIGH;
unsigned long lastDebounce = 0;
bool buttonPressed = false;

void checkButton() {
  bool btn = digitalRead(BUTTON_PIN);
  if (btn != lastBtn) lastDebounce = millis();
  buttonPressed = false;
  if (millis() - lastDebounce > 50 && btn == LOW && lastBtn == HIGH) {
    buttonPressed = true;
  }
  lastBtn = btn;
}

// --- Per-state update functions ---
void updateAmbient() {
  int level = map(constrain((int)filteredLDR, 50, 900), 50, 900, 0, 255);
  int brightness = 255 - level;

  // Warm white responsive to ambient light
  setRGB(brightness, (brightness * 200) / 255, (brightness * 140) / 255);

  // Transition: sudden light change -> ALERT
  if (abs(filteredLDR - prevFilteredLDR) > LDR_CHANGE_THRESHOLD) {
    transitionTo(STATE_ALERT);
    return;
  }

  // Transition: very bright (daytime) for 10s -> SLEEP
  if (filteredLDR > SLEEP_LIGHT_THRESHOLD &&
      millis() - stateEnteredAt > 10000) {
    transitionTo(STATE_SLEEP);
    return;
  }

  // Transition: button -> PARTY
  if (buttonPressed) {
    transitionTo(STATE_PARTY);
  }
}

void updateAlert() {
  // Rapid pulsing white/color for attention
  unsigned long elapsed = millis() - stateEnteredAt;
  float t = (elapsed % 200) / 200.0;  // 5 Hz pulse
  int pulse = (int)((1.0 + cos(t * TWO_PI)) / 2.0 * 255);
  setRGB(pulse, pulse, pulse);

  // Auto-return to AMBIENT after timeout
  if (elapsed > ALERT_TIMEOUT_MS) {
    transitionTo(STATE_AMBIENT);
    return;
  }

  // Button skips back to AMBIENT immediately
  if (buttonPressed) {
    transitionTo(STATE_AMBIENT);
  }
}

void updateParty() {
  // Fast rainbow cycling
  unsigned long elapsed = millis() - stateEnteredAt;
  int hue = (int)((elapsed / 5) % 360);  // full cycle every 1.8 seconds
  int r, g, b;
  hsvToRgb(hue, 255, 255, &r, &g, &b);
  setRGB(r, g, b);

  // Timeout -> return to AMBIENT
  if (elapsed > PARTY_TIMEOUT_MS) {
    transitionTo(STATE_AMBIENT);
    return;
  }

  // Button -> back to AMBIENT
  if (buttonPressed) {
    transitionTo(STATE_AMBIENT);
  }
}

void updateSleep() {
  // Minimal warm glow, very low power
  float t = (millis() % 4000) / 4000.0;  // very slow breathe (4s period)
  int glow = 10 + (int)((1.0 + cos(t * TWO_PI)) / 2.0 * 15);  // 10-25 range
  setRGB(glow, glow / 2, 0);

  // Wake on darkness (someone turned off the lights = festival starting)
  if (filteredLDR < SLEEP_DARK_THRESHOLD) {
    transitionTo(STATE_AMBIENT);
    return;
  }

  // Button -> wake to AMBIENT
  if (buttonPressed) {
    transitionTo(STATE_AMBIENT);
  }
}

// --- Timing ---
unsigned long lastRead = 0;
unsigned long lastPrint = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("=== Festival Light State Machine ===");
  Serial.println("States: AMBIENT | ALERT | PARTY | SLEEP");
  Serial.println();

  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  stateEnteredAt = millis();
  lastRead = millis();
  lastPrint = millis();

  Serial.println("[ENTER AMBIENT]");
  Serial.println("state\\tldr\\telapsed_s");
}

void loop() {
  // Sensor reading at 50 Hz
  if (millis() - lastRead >= 20) {
    lastRead = millis();

    long sum = 0;
    for (int i = 0; i < 8; i++) sum += analogRead(LDR_PIN);
    float raw = sum / 8.0;

    prevFilteredLDR = filteredLDR;
    float alpha = (raw > filteredLDR) ? 0.2 : 0.05;
    filteredLDR = alpha * raw + (1.0 - alpha) * filteredLDR;
  }

  // Button check
  checkButton();

  // State machine dispatch
  switch (currentState) {
    case STATE_AMBIENT: updateAmbient(); break;
    case STATE_ALERT:   updateAlert();   break;
    case STATE_PARTY:   updateParty();   break;
    case STATE_SLEEP:   updateSleep();   break;
  }

  // Serial output at 5 Hz
  if (millis() - lastPrint >= 200) {
    lastPrint = millis();
    Serial.print(stateNames[currentState]);
    Serial.print("\\t");
    Serial.print((int)filteredLDR);
    Serial.print("\\t");
    Serial.println((millis() - stateEnteredAt) / 1000.0, 1);
  }
}

// Watch state transitions in Serial Monitor:
// - Cover/uncover LDR quickly -> ALERT (3s flash, auto-returns)
// - Press button -> PARTY (60s rainbow, button returns early)
// - Leave in bright light 10s -> SLEEP (wakes on darkness or button)
// Each transition is logged with entry/exit timestamps.`,
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
      code: `// =============================================================
// FESTIVAL LIGHT INSTALLATION — CAPSTONE PROJECT
// =============================================================
//
// PROJECT: Light-Responsive LED Installation for Festival Venues
// PLATFORM: Arduino Uno (ATmega328P, 16 MHz)
// AUTHOR: [Your Name]
// DATE: [Date]
// LICENSE: MIT
//
// OVERVIEW:
//   An ambient-responsive LED installation that senses environmental
//   light via an LDR and automatically adjusts its display. Four
//   modes: AMBIENT (auto-brightness), ALERT (flash response),
//   PARTY (rainbow cycling), and SLEEP (low power). Designed for
//   unattended operation at festival venues.
//
// BILL OF MATERIALS:
//   1x  Arduino Uno (or Nano)                    ~$5-8
//   1x  LDR (CdS photoresistor, 1k-100k range)  ~$0.20
//   1x  10k ohm resistor (for LDR voltage divider) ~$0.05
//   3x  LEDs (red, green, blue; 5mm, 20mA)      ~$0.30
//   3x  220 ohm resistors (for LEDs)             ~$0.10
//   1x  10k potentiometer (sensitivity control)   ~$0.50
//   1x  Tactile pushbutton                        ~$0.10
//   1x  Breadboard or perfboard                   ~$2
//   ~20 Jumper wires                              ~$1
//   1x  USB cable + 5V phone charger (power)
//   Optional: WS2812B LED strip (30 pixels)       ~$5-8
//   Optional: 5V 2A power supply (for LED strip)  ~$3
//   Total: $10-20 USD / 700-1400 INR
//
// CIRCUIT CONNECTIONS:
//   LDR Voltage Divider:
//     5V --> LDR --> A0 --> 10k resistor --> GND
//     (A0 reads high in bright light, low in dark)
//
//   Potentiometer:
//     Left pin --> GND
//     Center pin --> A1
//     Right pin --> 5V
//
//   Button:
//     Pin 2 --> button --> GND
//     (uses internal pull-up; reads LOW when pressed)
//
//   LEDs:
//     Pin 9  --> 220R --> RED LED    --> GND
//     Pin 10 --> 220R --> GREEN LED  --> GND
//     Pin 11 --> 220R --> BLUE LED   --> GND
//
// STATE MACHINE:
//
//     +----------+     sudden light     +----------+
//     |          |------- change ------>|          |
//     | AMBIENT  |                      |  ALERT   |
//     |          |<--- 3s timeout ------|          |
//     +----------+                      +----------+
//        |    ^
//   btn  |    | btn / timeout / darkness
//        v    |
//     +----------+
//     |  PARTY   |-------- 60s timeout ----+
//     +----------+                         |
//        ^                                 v
//        |                           (back to AMBIENT)
//     +----------+
//     |  SLEEP   |<--- bright light 10s --- AMBIENT
//     |          |---- darkness/button ---> AMBIENT
//     +----------+
//
// QUICK START:
//   1. Connect circuit as described above
//   2. Upload this sketch (Arduino IDE, Board: Uno)
//   3. Open Serial Monitor at 115200 baud
//   4. Self-test runs: all 3 LEDs light in sequence
//   5. Installation enters AMBIENT mode automatically
//   6. Press button to cycle: AMBIENT -> PARTY -> AMBIENT
//   7. Aim LDR toward the festival area
//
// PRE-EVENT CHECKLIST:
//   [ ] Self-test: all 3 LEDs light correctly
//   [ ] LDR responds: cover sensor = LEDs brighten
//   [ ] Button works: cycles to PARTY and back
//   [ ] Serial output visible at 115200 baud
//   [ ] Power supply stable (no flickering)
//   [ ] LDR positioned toward audience/ambient area
//   [ ] Potentiometer set to mid-range sensitivity
//   [ ] Backup Arduino + LEDs available
//
// TROUBLESHOOTING:
//   Symptom              | Likely Cause         | Fix
//   ---------------------|----------------------|-------------------------
//   No LEDs light        | Wrong pin or polarity| Check wiring, flip LED
//   Always full bright   | LDR disconnected     | Check A0 wiring
//   Always dim           | LDR + resistor swap  | Swap LDR and 10k positions
//   Button not working   | Missing ground wire  | Check button to GND
//   Stuck in SLEEP       | Bright venue light   | Press button or cover LDR
//   Serial garbled       | Wrong baud rate      | Set to 115200
// =============================================================

const int LDR_PIN = A0;
const int POT_PIN = A1;
const int BUTTON_PIN = 2;
const int LED_R = 9;
const int LED_G = 10;
const int LED_B = 11;

// State machine
enum LightState { ST_AMBIENT, ST_ALERT, ST_PARTY, ST_SLEEP };
const char* stNames[] = {"AMBIENT", "ALERT", "PARTY", "SLEEP"};
LightState state = ST_AMBIENT;
unsigned long stateStart = 0;

// Sensor
float filtLDR = 500.0;
float prevLDR = 500.0;

// Button
bool lastBtn = HIGH;
unsigned long lastDeb = 0;
bool btnPress = false;

// Timing
unsigned long lastSensor = 0;
unsigned long lastPrint = 0;
unsigned long sessionStart = 0;

void hsvToRgb(int h, int s, int v, int* r, int* g, int* b) {
  h = h % 360;
  int reg = h / 60, rem = (h % 60) * 255 / 60;
  int p = (v*(255-s))/255, q = (v*(255-(s*rem)/255))/255;
  int t = (v*(255-(s*(255-rem))/255))/255;
  switch(reg) {
    case 0: *r=v;*g=t;*b=p; break; case 1: *r=q;*g=v;*b=p; break;
    case 2: *r=p;*g=v;*b=t; break; case 3: *r=p;*g=q;*b=v; break;
    case 4: *r=t;*g=p;*b=v; break; default:*r=v;*g=p;*b=q; break;
  }
}

void setRGB(int r, int g, int b) {
  analogWrite(LED_R, constrain(r,0,255));
  analogWrite(LED_G, constrain(g,0,255));
  analogWrite(LED_B, constrain(b,0,255));
}

void goState(LightState ns) {
  if (ns == state) return;
  Serial.print("[");
  Serial.print(stNames[state]);
  Serial.print(" -> ");
  Serial.print(stNames[ns]);
  Serial.print("] at ");
  Serial.print((millis()-sessionStart)/1000.0, 1);
  Serial.println("s");
  state = ns;
  stateStart = millis();
}

void selfTest() {
  Serial.println("--- SELF TEST ---");
  int pins[] = {LED_R, LED_G, LED_B};
  const char* names[] = {"Red","Green","Blue"};
  for (int i = 0; i < 3; i++) {
    for (int b = 0; b <= 255; b += 10) { analogWrite(pins[i], b); delay(3); }
    delay(200);
    for (int b = 255; b >= 0; b -= 10) { analogWrite(pins[i], b); delay(3); }
    Serial.print("  "); Serial.print(names[i]); Serial.println(" OK");
  }

  Serial.print("  LDR reading: ");
  Serial.print(analogRead(LDR_PIN));
  Serial.println(" (expect 100-900 for normal indoor light)");

  Serial.println("--- SELF TEST COMPLETE ---");
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  Serial.println("=== FESTIVAL LIGHT INSTALLATION CAPSTONE ===");
  Serial.println("LDR sensor | RGB LEDs | 4-state FSM");
  Serial.println();

  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  selfTest();

  // Initial LDR reading
  filtLDR = analogRead(LDR_PIN);
  prevLDR = filtLDR;

  Serial.println("[ENTER AMBIENT]");
  Serial.println("state\\tldr\\telapsed\\tR\\tG\\tB");

  sessionStart = millis();
  stateStart = millis();
  lastSensor = millis();
  lastPrint = millis();
}

int outR = 0, outG = 0, outB = 0;

void loop() {
  // --- Sensor at 50 Hz ---
  if (millis() - lastSensor >= 20) {
    lastSensor = millis();
    long sum = 0;
    for (int i = 0; i < 8; i++) sum += analogRead(LDR_PIN);
    float raw = sum / 8.0;
    prevLDR = filtLDR;
    float a = (raw > filtLDR) ? 0.2 : 0.05;
    filtLDR = a * raw + (1.0 - a) * filtLDR;
  }

  // --- Button ---
  bool btn = digitalRead(BUTTON_PIN);
  if (btn != lastBtn) lastDeb = millis();
  btnPress = false;
  if (millis() - lastDeb > 50 && btn == LOW && lastBtn == HIGH) btnPress = true;
  lastBtn = btn;

  // --- State Machine ---
  int level = map(constrain((int)filtLDR, 50, 900), 50, 900, 0, 255);
  unsigned long elapsed = millis() - stateStart;

  switch (state) {
    case ST_AMBIENT: {
      int br = 255 - level;
      outR = br; outG = (br*200)/255; outB = (br*140)/255;
      setRGB(outR, outG, outB);
      if (abs(filtLDR - prevLDR) > 150) goState(ST_ALERT);
      else if (filtLDR > 800 && elapsed > 10000) goState(ST_SLEEP);
      else if (btnPress) goState(ST_PARTY);
      break;
    }
    case ST_ALERT: {
      float t = (elapsed % 200) / 200.0;
      int p = (int)((1.0+cos(t*TWO_PI))/2.0*255);
      outR = p; outG = p; outB = p;
      setRGB(outR, outG, outB);
      if (elapsed > 3000 || btnPress) goState(ST_AMBIENT);
      break;
    }
    case ST_PARTY: {
      int hue = (int)((elapsed / 5) % 360);
      hsvToRgb(hue, 255, 255, &outR, &outG, &outB);
      setRGB(outR, outG, outB);
      if (elapsed > 60000 || btnPress) goState(ST_AMBIENT);
      break;
    }
    case ST_SLEEP: {
      float t = (millis() % 4000) / 4000.0;
      int glow = 10 + (int)((1.0+cos(t*TWO_PI))/2.0*15);
      outR = glow; outG = glow/2; outB = 0;
      setRGB(outR, outG, outB);
      if (filtLDR < 200 || btnPress) goState(ST_AMBIENT);
      break;
    }
  }

  // --- Serial at 5 Hz ---
  if (millis() - lastPrint >= 200) {
    lastPrint = millis();
    Serial.print(stNames[state]);
    Serial.print("\\t");
    Serial.print((int)filtLDR);
    Serial.print("\\t");
    Serial.print(elapsed / 1000.0, 1);
    Serial.print("\\t");
    Serial.print(outR);
    Serial.print("\\t");
    Serial.print(outG);
    Serial.print("\\t");
    Serial.println(outB);
  }
}

// INSTALLATION NOTES:
// - Mount Arduino in a weatherproof enclosure (IP54 minimum for outdoor use)
// - Route LDR through a small hole in the enclosure lid, facing outward
// - Seal cable entry points with silicone
// - Use a 5V/2A phone charger as power supply (USB connection)
// - For WS2812B strip: connect data pin to pin 6, power to external 5V supply
//   (do NOT power strip from Arduino 5V — max current exceeded)
// - Zip-tie all connections for vibration resistance
//
// CAPSTONE COMPLETE
// Skills: analog sensing, ADC oversampling, voltage dividers, logarithmic
// mapping, HSV color space, state machines, debouncing, adaptive filtering,
// serial protocols, and professional installation documentation.`,
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
