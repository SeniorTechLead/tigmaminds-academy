import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'circuits-basics',
  title: 'Circuits & Electronics',
  category: 'electronics',
  tags: ['physics', 'math'],
  keywords: ['resistor', 'capacitor', 'LED', 'series', 'parallel', 'ohms law', 'voltage divider', 'breadboard'],
  icon: '⚡',
  tagline: 'The foundation of every electronic device',
  relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret', 'bridge-that-grew', 'festival-lights'],

  understand: [
    {
      title: 'What Electricity Is',
      beginnerContent:
        'Everything is made of atoms, and atoms contain tiny particles called electrons. ' +
        'When electrons flow through a wire, that flow is electricity — like water flowing ' +
        'through a pipe. The wire is the pipe, the battery is the pump, and the electrons ' +
        'are the water. This flow is called *current*.',
      intermediateContent:
        'Electricity is the flow of electrons through a conductor. **Voltage** (V) is the "pressure" pushing electrons — like water pressure in a pipe. **Current** (I, in Amperes) is the flow rate — how many electrons pass per second. **Resistance** (R, in Ohms) opposes flow — like a narrow pipe. Ohm\'s Law: V = I × R. A 9V battery with a 1kΩ resistor: I = 9/1000 = 9 mA. Power: P = V × I = 9 × 0.009 = 0.081 W. An AA battery can supply about 1.5V at up to 500 mA for a few hours.',
      advancedContent:
        '**Drift velocity vs signal speed — why the light switch works instantly:**\n\n' +
        'Individual electrons in a copper wire crawl at ~0.1 mm/s (drift velocity). A wire 3 meters long would take ' +
        '~8 hours for an electron to traverse. Yet when you flip a switch, the light turns on instantly. Why?\n\n' +
        'The electric field propagates at ~2/3 the speed of light through the wire. Think of a tube full of marbles: push one in at one end ' +
        'and one immediately pops out the other end. No marble travelled the full length, but the SIGNAL did. ' +
        'Each electron only moves a tiny bit, but they all start moving at once.\n\n' +
        '**Semiconductors — the material that made computers possible:**\n' +
        'Pure silicon barely conducts. But add tiny amounts of impurities (doping):\n' +
        '- **Phosphorus** (5 valence electrons in a 4-electron lattice) → extra free electrons → **n-type** (negative carriers)\n' +
        '- **Boron** (3 valence electrons) → missing electrons ("holes") → **p-type** (positive carriers)\n\n' +
        'Put n-type and p-type together → **p-n junction** (a diode). Stack them differently → **transistor** (a voltage-controlled switch). ' +
        'A MOSFET has three terminals: source, drain, gate. Apply voltage to the gate → current flows between source and drain. ' +
        'Remove voltage → current stops. This ON/OFF switching IS the 1/0 of digital logic. Modern chips pack billions of these on a fingernail-sized die.',
      diagram: 'StaticElectricityDiagram',
    },
    {
      title: 'Complete Circuits — A Loop',
      beginnerContent:
        'Electricity only flows in a complete loop (circuit). If there\'s a break anywhere — a ' +
        'disconnected wire, an open switch — the flow stops entirely. Think of it as a ' +
        'circular track: if you remove a section of track, the train can\'t complete the loop. ' +
        'A switch is like a drawbridge on that track — open it to stop the train, close it to ' +
        'let it through.',
      intermediateContent:
        'Current flows only in complete circuits — a closed loop from battery positive terminal, through the components, back to negative. An open switch breaks the loop; current stops everywhere instantly. Short circuit: a low-resistance path directly connecting battery terminals — enormous current flows, the wire heats up, and the battery may be damaged. Always include a load (resistor, LED, motor) in the circuit. Circuit diagrams use standard symbols: battery (long/short parallel lines), resistor (zigzag), LED (triangle with arrows), switch (gap with a lever).',
      advancedContent:
        'Kirchhoff\'s laws solve complex circuits. **KVL** (Voltage Law): voltages around any closed loop sum to zero — energy is conserved. Walk around a loop: battery gives +9V, resistor drops -5V, LED drops -2V, second resistor drops -2V → 9 - 5 - 2 - 2 = 0 ✓. **KCL** (Current Law): currents entering a node equal currents leaving — charge is conserved. At a junction: 10 mA in = 6 mA branch + 4 mA branch. These two laws, plus Ohm\'s Law, can solve any circuit. Mesh analysis (applying KVL to independent loops) and nodal analysis (applying KCL to nodes) are systematic methods for circuits with many components.',
      diagram: 'CircuitDiagram',
    },
    {
      title: 'Voltage, Current, and Resistance',
      beginnerContent:
        'Three quantities define every circuit. *Voltage* (V) is the pressure pushing ' +
        'electrons — like water pressure in a pipe. *Current* (I, in Amps) is the flow rate — ' +
        'how many electrons pass per second. *Resistance* (R, in Ohms) is how much the wire ' +
        'or component restricts flow — like a narrow section of pipe. Ohm\'s Law ties them ' +
        'together: V = I x R. A 9V battery pushing through 100 Ohms gives 0.09 Amps (90 mA).',
      intermediateContent:
        'Ohm\'s Law: **V = IR**. A 220Ω resistor with 5V across it draws I = 5/220 = 22.7 mA. Power: P = VI = I²R = V²/R. That resistor dissipates P = 5²/220 = 0.114 W — a 1/4W resistor is sufficient. For an LED: forward voltage ~2V, desired current ~20 mA. Series resistor R = (5V − 2V)/0.02A = **150Ω**. Resistor color code: brown-black-brown = 100Ω, red-violet-red = 2,700Ω = 2.7 kΩ. Kirchhoff\'s Voltage Law: voltages around a closed loop sum to zero. Kirchhoff\'s Current Law: currents entering a node equal currents leaving.',
      advancedContent:
        '**Thévenin\'s theorem — simplifying any circuit to two components:**\n\n' +
        'Any circuit (no matter how complex) connected to two terminals can be replaced by a single voltage source V_th in series with a resistance R_th.\n\n' +
        '**Worked example:** A circuit has a 12V battery, a 4Ω resistor in series, and a 6Ω resistor in parallel with the output terminals.\n' +
        '1. **Find V_th** (open-circuit voltage): Remove the load. Current flows through 4Ω only (6Ω has no current path). ' +
        'Voltage divider: V_th = 12V × 6/(4+6) = **7.2V**\n' +
        '2. **Find R_th** (equivalent resistance): Set voltage source to zero (replace with wire). ' +
        '4Ω and 6Ω are now in parallel: R_th = (4 × 6)/(4 + 6) = **2.4Ω**\n' +
        '3. **Result:** The entire circuit looks like a 7.2V source with a 2.4Ω series resistance.\n' +
        '4. **Use it:** Connect a 2.4Ω load → current = 7.2/(2.4+2.4) = 1.5A. Power in load = 1.5² × 2.4 = **5.4W**.\n\n' +
        '**Maximum power transfer:** When R_load = R_th, the load receives maximum power. This is why audio amplifiers are impedance-matched to speakers (8Ω amp → 8Ω speaker) and why antenna impedance must match the transmission line (50Ω).',
      diagram: 'CircuitDiagram',
      interactive: {
        type: 'slider',
        props: {
          component: 'OhmsLawCalculator',
          title: 'Ohm\'s Law Calculator',
          description: 'Adjust voltage and resistance to see how current changes.',
        },
      },
    },
    {
      title: 'Why LEDs Need Resistors',
      beginnerContent:
        'An LED (Light Emitting Diode) converts electrical energy into light, but it\'s ' +
        'delicate — too much current will burn it out instantly. A resistor limits the current ' +
        'to a safe level. For a typical LED that needs 20 mA and drops 2V, on a 5V Arduino: ' +
        'R = (5V - 2V) / 0.02A = 150 Ohms. Always use a resistor with an LED.',
      intermediateContent:
        'An LED (Light Emitting Diode) has a fixed forward voltage drop (red: ~2V, green: ~2.2V, blue/white: ~3.3V) and no internal current limiting. Without a resistor, current is limited only by wire and battery resistance — far too much, destroying the LED instantly. The series resistor limits current to a safe level (typically 10-20 mA). Formula: R = (V_supply - V_LED) / I_desired. For a red LED on 5V at 15 mA: R = (5 - 2) / 0.015 = **200Ω** (use standard 220Ω). Brightness is proportional to current up to the rated maximum.',
      advancedContent:
        '**How LEDs make light — the physics of the p-n junction:**\n\n' +
        'An LED is a p-n junction. When current flows forward, electrons from the n-side cross into the p-side. ' +
        'Each electron "falls" into a hole, releasing energy as a photon. The photon\'s wavelength (color) is determined by the bandgap energy: E = hf = hc/λ.\n\n' +
        '| Material | Bandgap (eV) | Color | Forward voltage |\n' +
        '|---|---|---|---|\n' +
        '| GaP | 2.26 | Green | ~2.2V |\n' +
        '| GaAsP | 1.8-2.0 | Red/Yellow | ~1.8-2.0V |\n' +
        '| InGaN | 2.6-3.4 | Blue/UV | ~3.0-3.4V |\n\n' +
        '**How white LEDs work:** A blue InGaN chip (emits blue light at ~450 nm) is coated with yellow phosphor. ' +
        'The phosphor absorbs some blue photons and re-emits them as yellow. Blue + yellow = white (to human eyes). ' +
        'The blue/yellow ratio determines the "color temperature" — more blue = "cool white," more yellow = "warm white."\n\n' +
        '**The efficiency revolution:**\n' +
        '| Technology | Efficiency (lumens/watt) | Heat waste |\n' +
        '|---|---|---|\n' +
        '| Incandescent (1879) | 15 lm/W | 95% of energy is heat |\n' +
        '| Fluorescent (1930s) | 100 lm/W | Contains mercury |\n' +
        '| LED (2020s) | 200+ lm/W | Minimal heat, no mercury |\n\n' +
        'LED lighting is the single largest energy-saving technology adopted in the 21st century.',
      diagram: 'OhmsLawDiagram',
    },
    {
      title: 'PWM — Flickering Too Fast to See',
      beginnerContent:
        'Pulse Width Modulation (PWM) switches a pin on and off thousands of times per second. ' +
        'Your eye can\'t see the flickering, so an LED appears dimmer when it\'s off half the ' +
        'time (50% duty cycle) and brighter at 100%. This trick lets a digital pin (which can ' +
        'only be fully on or fully off) simulate any brightness level — or control motor speed.',
      intermediateContent:
        'PWM (Pulse Width Modulation) switches a digital pin between HIGH and LOW very rapidly. The duty cycle (% of time HIGH) determines the average voltage. 50% duty → average 2.5V (on a 5V Arduino). analogWrite(pin, 127) = 50% duty (127/255). At 490 Hz, each cycle is ~2 ms — your eye sees only the average brightness. PWM controls LED brightness (analogWrite(3, 64) = dim), motor speed (via a transistor), and servo position (servo angle ∝ pulse width between 1-2 ms). It does NOT produce true analog voltage — use an RC filter to smooth if needed.',
      advancedContent:
        '**PWM frequency and resolution — the engineering tradeoffs:**\n\n' +
        '| Parameter | Arduino Uno | ESP32 | Effect |\n' +
        '|---|---|---|---|\n' +
        '| Resolution | 8-bit (256 levels) | Up to 16-bit (65,536 levels) | More levels = smoother fading |\n' +
        '| Default frequency | 490 Hz (pins 3,9,10,11) or 976 Hz (pins 5,6) | Configurable 1 Hz - 40 MHz | Higher = less flicker |\n\n' +
        '**Frequency tradeoffs:**\n' +
        '- Too low (<100 Hz): visible LED flicker, audible motor whine (human hearing starts at ~20 Hz)\n' +
        '- Sweet spot (1-20 kHz): no visible flicker, no audible whine\n' +
        '- Too high (>100 kHz): switching losses heat up the transistor (energy wasted charging/discharging gate capacitance)\n\n' +
        '**RGB color mixing with 3 PWM channels:**\n' +
        '```\n' +
        'analogWrite(redPin, 255);   // full red\n' +
        'analogWrite(greenPin, 128); // half green\n' +
        'analogWrite(bluePin, 0);    // no blue\n' +
        '// Result: orange (red + some green)\n' +
        '```\n' +
        'This is additive color mixing — the same principle behind every pixel on your phone screen. ' +
        'With 256 levels per channel, you get 256³ = 16.7 million possible colors — the same "16 million colors" advertised for displays.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'PWM switches a pin on and off thousands of times per second to simulate analog output.', answer: true, explanation: 'At 50% duty cycle the pin is HIGH half the time, making an LED appear half-bright or a motor run at half speed.' },
            { text: 'A 25% duty cycle means the LED is on 75% of the time.', answer: false, explanation: 'A 25% duty cycle means the pin is HIGH only 25% of the time — the LED appears dim, not bright.' },
            { text: 'All Arduino pins support PWM output.', answer: false, explanation: 'Only pins marked with a ~ symbol support PWM. On an Uno, those are pins 3, 5, 6, 9, 10, and 11.' },
          ],
        },
      },
    },
  ],

  build: [
    {
      title: 'Ohm\'s Law Calculations',
      beginnerContent:
        'V = I x R is the fundamental equation. Rearrange it to find any unknown.',
      code: `# Ohm's Law: V = I * R

def ohms_law(V=None, I=None, R=None):
  """Given any two, calculate the third."""
  if V is None:
      return I * R
  elif I is None:
      return V / R
  elif R is None:
      return V / I

# Example: LED on a 5V Arduino
V_supply = 5.0    # volts
V_led = 2.0       # LED forward voltage
V_resistor = V_supply - V_led  # 3.0V across resistor
I_desired = 0.020  # 20 mA

R = ohms_law(V=V_resistor, I=I_desired)
print(f"Resistor needed: {R:.0f} Ω")  # 150 Ω

# Power dissipated by the resistor
P = V_resistor * I_desired
print(f"Power: {P*1000:.0f} mW")  # 60 mW`,
    },
    {
      title: 'Series and Parallel Circuits',
      beginnerContent:
        'In series, resistances add up. In parallel, the total resistance decreases.',
      intermediateContent:
        'Series resistors: R_total = R₁ + R₂ + R₃. Three 100Ω resistors in series: R = **300Ω**. Parallel resistors: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Three 100Ω in parallel: R = **33.3Ω**. For just two parallel resistors: R = R₁R₂/(R₁+R₂). Voltage divider: V_out = V_in × R₂/(R₁+R₂). With R₁=1kΩ, R₂=2kΩ, V_in=9V: V_out = 9 × 2/3 = **6V**. Current divider: I₁ = I_total × R₂/(R₁+R₂). These formulas are the building blocks of all circuit analysis.',
      advancedContent:
        'Capacitors and inductors add frequency-dependent behavior. A capacitor\'s impedance Z_C = 1/(2πfC) decreases with frequency — it blocks DC but passes AC (used in coupling and filtering). An inductor\'s impedance Z_L = 2πfL increases with frequency — it passes DC but blocks AC (used in power supply filtering). An RC low-pass filter (resistor in series, capacitor to ground) has cutoff frequency f_c = 1/(2πRC). For R=10kΩ, C=100nF: f_c = 1/(2π×10⁴×10⁻⁷) = **159 Hz** — it passes bass frequencies and blocks treble. LC resonant circuits combine at f_r = 1/(2π√(LC)), enabling radio tuning — the exact frequency selection principle behind every radio, TV, and WiFi receiver.',
      diagram: 'SeriesParallelCircuitDiagram',
      code: `# Series: R_total = R1 + R2 + R3
def series(*resistors):
  return sum(resistors)

# Parallel: 1/R_total = 1/R1 + 1/R2 + ...
def parallel(*resistors):
  return 1 / sum(1/r for r in resistors)

# Three 100Ω resistors in series
print(f"Series:   {series(100, 100, 100)} Ω")     # 300 Ω

# Three 100Ω resistors in parallel
print(f"Parallel: {parallel(100, 100, 100):.1f} Ω")  # 33.3 Ω

# Mixed: two 200Ω in parallel, then in series with 50Ω
r_par = parallel(200, 200)   # 100 Ω
r_total = series(r_par, 50)  # 150 Ω
print(f"Mixed:    {r_total:.0f} Ω")`,
    },
    {
      title: 'LED with Resistor (Arduino)',
      beginnerContent:
        'The classic first circuit: control an LED brightness using PWM.',
      code: `// Arduino: Fade an LED using PWM
const int ledPin = 9;  // must be a PWM pin (~)

void setup() {
pinMode(ledPin, OUTPUT);
}

void loop() {
// Fade up
for (int brightness = 0; brightness <= 255; brightness += 5) {
  analogWrite(ledPin, brightness);  // PWM: 0-255
  delay(30);
}
// Fade down
for (int brightness = 255; brightness >= 0; brightness -= 5) {
  analogWrite(ledPin, brightness);
  delay(30);
}
}`,
    },
    {
      title: 'Voltage Divider',
      beginnerContent:
        'Two resistors in series create a lower voltage — essential for connecting 5V sensors to 3.3V boards.',
      code: `# Voltage divider: V_out = V_in * R2 / (R1 + R2)

def voltage_divider(V_in, R1, R2):
  V_out = V_in * R2 / (R1 + R2)
  return V_out

# 5V to ~3.3V using standard resistors
V_out = voltage_divider(5.0, 1000, 2000)
print(f"V_out: {V_out:.2f} V")  # 3.33 V

# Find R2 for a target voltage
def find_R2(V_in, V_out, R1):
  return R1 * V_out / (V_in - V_out)

R2 = find_R2(5.0, 3.3, 10000)
print(f"R2 needed: {R2:.0f} Ω")  # 19412 Ω ≈ 20kΩ`,
    },
    {
      title: 'Capacitors — Storing Charge',
      beginnerContent:
        'A capacitor stores energy like a small rechargeable tank. It charges and discharges following an exponential curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# RC circuit: capacitor charging through a resistor
R = 10_000   # 10 kΩ
C = 0.0001   # 100 µF
tau = R * C  # time constant = 1 second
V_supply = 5.0

t = np.linspace(0, 5 * tau, 500)
V_charge = V_supply * (1 - np.exp(-t / tau))
V_discharge = V_supply * np.exp(-t / tau)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

ax1.plot(t, V_charge, "b-", linewidth=2)
ax1.axhline(V_supply * 0.632, color="gray", linestyle="--",
          label=f"63.2% at τ = {tau:.1f}s")
ax1.set_title("Charging")
ax1.set_xlabel("Time (s)")
ax1.set_ylabel("Voltage (V)")
ax1.legend()
ax1.grid(True)

ax2.plot(t, V_discharge, "r-", linewidth=2)
ax2.axhline(V_supply * 0.368, color="gray", linestyle="--",
          label=f"36.8% at τ = {tau:.1f}s")
ax2.set_title("Discharging")
ax2.set_xlabel("Time (s)")
ax2.legend()
ax2.grid(True)

plt.suptitle(f"RC Circuit (R={R/1000:.0f}kΩ, C={C*1e6:.0f}µF, τ={tau:.1f}s)")
plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Reading a Circuit Schematic',
      beginnerContent:
        'Common schematic symbols and how to trace current flow.',
      code: `# This section is conceptual — no runnable code.
# Common schematic symbols:
#
#   ─────  Wire (conductor)
#   ─┤├─   Capacitor
#   ─/\\/\\/─  Resistor
#   ─▶|─   LED (diode with light)
#   ─|+  -|─  Battery
#   ┤      Transistor (switch controlled by current)
#
# To read a schematic:
# 1. Find the power source (battery / USB)
# 2. Trace from + terminal through components back to -
# 3. Current flows from high voltage to low voltage
# 4. At junctions, current splits (parallel paths)
# 5. Switches break or complete the loop`,
    },
  ],
};
