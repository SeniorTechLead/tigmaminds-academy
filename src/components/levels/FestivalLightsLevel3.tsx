import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FestivalLightsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'LED physics: band gaps & photon emission',
      concept: `A Light Emitting Diode (LED) converts electrical energy directly into light through a quantum mechanical process called **electroluminescence**. The key physics happens at the junction between two types of semiconductor: **n-type** (with extra electrons) and **p-type** (with extra "holes" — missing electrons). When current flows through this p-n junction, electrons fall from the conduction band into the valence band, releasing energy as photons.

The color of the light is determined by the **band gap** energy E_g of the semiconductor material. The relationship is: wavelength = hc/E_g, where h is Planck's constant (6.626 x 10^-34 J·s) and c is the speed of light (3 x 10^8 m/s). A band gap of 1.9 eV produces red light (650 nm). A band gap of 2.7 eV produces blue light (460 nm). By choosing different semiconductor materials — gallium arsenide phosphide (GaAsP) for red/orange, indium gallium nitride (InGaN) for blue/green — engineers can produce LEDs of any visible color.

White LEDs are particularly clever: they use a blue LED coated with a yellow phosphor. The blue light excites the phosphor, which emits broad-spectrum yellow light. The combination of blue plus yellow appears white to the human eye. This is called **phosphor conversion**, and it is how the vast majority of LED lighting works today. The efficiency of this process — converting electrical power to visible light — is called **luminous efficacy**, measured in lumens per watt.`,
      analogy: 'Think of the band gap like a waterfall. Water (electrons) flows from a high pool (conduction band) to a low pool (valence band). The height of the fall (band gap) determines how much energy is released. A tall waterfall (large band gap) releases a high-energy, blue-violet photon. A short waterfall (small band gap) releases a low-energy, red photon. The material of the cliff (semiconductor composition) determines the waterfall height.',
      storyConnection: 'In "The Festival of Lights," the village transforms with glowing colors. Modern festival lights use LEDs of precisely engineered colors — each one a tiny quantum machine converting electricity to photons. Understanding LED physics means understanding how to create any color of light, at any brightness, with extraordinary efficiency.',
      checkQuestion: 'A LED has a band gap of 2.25 eV. What color light does it emit? Calculate the wavelength. If the LED draws 20 mA at 2.25 V forward voltage, what is its electrical power consumption?',
      checkAnswer: 'E = 2.25 eV = 2.25 * 1.602e-19 = 3.605e-19 J. Wavelength = hc/E = (6.626e-34 * 3e8) / 3.605e-19 = 551 nm. This is green light. Power = V * I = 2.25V * 0.020A = 0.045 W = 45 mW. If the LED has 30% efficiency, it produces 0.045 * 0.30 = 13.5 mW of light power.',
      codeIntro: 'Model the relationship between band gap energy, wavelength, and color for common LED materials, and visualize the visible spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

h = 6.626e-34  # Planck's constant (J·s)
c = 3e8        # speed of light (m/s)
eV = 1.602e-19 # electron volt in joules

def bandgap_to_wavelength(Eg_eV):
    """Convert band gap energy (eV) to peak wavelength (nm)."""
    return h * c / (Eg_eV * eV) * 1e9

def wavelength_to_rgb(wavelength):
    """Approximate RGB color for a given wavelength (nm)."""
    w = wavelength
    if w < 380 or w > 780: return (0, 0, 0)
    if w < 440: r, g, b = -(w-440)/(440-380), 0, 1
    elif w < 490: r, g, b = 0, (w-440)/(490-440), 1
    elif w < 510: r, g, b = 0, 1, -(w-510)/(510-490)
    elif w < 580: r, g, b = (w-510)/(580-510), 1, 0
    elif w < 645: r, g, b = 1, -(w-645)/(645-580), 0
    else: r, g, b = 1, 0, 0
    # Intensity falloff at edges
    if w < 420: factor = 0.3 + 0.7*(w-380)/40
    elif w > 700: factor = 0.3 + 0.7*(780-w)/80
    else: factor = 1.0
    return (r*factor, g*factor, b*factor)

# LED materials database
led_materials = {
    'AlGaInP (Red)': {'Eg': 1.9, 'color': '#ef4444'},
    'AlGaInP (Orange)': {'Eg': 2.0, 'color': '#f97316'},
    'AlGaInP (Amber)': {'Eg': 2.1, 'color': '#f59e0b'},
    'GaP:N (Yellow-Green)': {'Eg': 2.2, 'color': '#84cc16'},
    'InGaN (Green)': {'Eg': 2.4, 'color': '#22c55e'},
    'InGaN (Cyan)': {'Eg': 2.6, 'color': '#06b6d4'},
    'InGaN (Blue)': {'Eg': 2.75, 'color': '#3b82f6'},
    'InGaN (Violet)': {'Eg': 3.0, 'color': '#8b5cf6'},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED Physics: Band Gaps, Wavelengths & Colors',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Band gap vs wavelength curve
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
Eg_range = np.linspace(1.6, 3.3, 300)
wavelengths = bandgap_to_wavelength(Eg_range)
for i in range(len(Eg_range)-1):
    rgb = wavelength_to_rgb(wavelengths[i])
    ax.plot([Eg_range[i], Eg_range[i+1]], [wavelengths[i], wavelengths[i+1]],
            color=rgb, linewidth=3)
for name, info in led_materials.items():
    wl = bandgap_to_wavelength(info['Eg'])
    ax.scatter([info['Eg']], [wl], color=info['color'], s=80, zorder=5, edgecolors='white')
    ax.annotate(name.split('(')[1].rstrip(')'), (info['Eg'], wl), xytext=(5, 5),
                textcoords='offset points', color='white', fontsize=7)
ax.set_xlabel('Band gap energy (eV)', color='white')
ax.set_ylabel('Peak wavelength (nm)', color='white')
ax.set_title('Band gap determines LED color', color='white', fontsize=11)

# Plot 2: Visible spectrum
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
wavelengths_vis = np.arange(380, 781, 1)
for wl in wavelengths_vis:
    rgb = wavelength_to_rgb(wl)
    ax.axvline(wl, color=rgb, linewidth=2, alpha=0.8)
# Mark LED positions
for name, info in led_materials.items():
    wl = bandgap_to_wavelength(info['Eg'])
    ax.axvline(wl, color='white', linewidth=1.5, linestyle='--', alpha=0.5)
    ax.text(wl, 0.9, name.split('(')[1].strip(')'), color='white', fontsize=7,
            rotation=90, ha='right', va='top')
ax.set_xlim(380, 780)
ax.set_ylim(0, 1)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_title('Visible spectrum with LED wavelengths', color='white', fontsize=11)

# Plot 3: LED I-V characteristic
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
led_types = [('Red (1.9eV)', 1.9, '#ef4444'), ('Green (2.4eV)', 2.4, '#22c55e'),
             ('Blue (2.75eV)', 2.75, '#3b82f6'), ('White (3.0eV)', 3.0, 'white')]
V_range = np.linspace(0, 4, 300)
for name, Vf, col in led_types:
    # Simplified Shockley diode equation
    I_s = 1e-12  # reverse saturation current
    n = 2.0  # ideality factor
    V_t = 0.026  # thermal voltage at room temp
    I = I_s * (np.exp(V_range / (n * V_t)) - 1)
    I = np.minimum(I, 0.1)  # clip at 100 mA
    # Shift by forward voltage
    I_shifted = I_s * (np.exp(np.maximum(V_range - Vf + 0.3, 0) / (n * V_t)) - 1)
    I_shifted = np.minimum(I_shifted, 0.1)
    ax.plot(V_range, I_shifted * 1000, color=col, linewidth=2, label=name)
ax.set_xlabel('Forward voltage (V)', color='white')
ax.set_ylabel('Current (mA)', color='white')
ax.set_title('LED I-V characteristics', color='white', fontsize=11)
ax.set_ylim(0, 50)
ax.legend(fontsize=8)

# Plot 4: Luminous efficacy comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
sources = ['Incandescent', 'Halogen', 'CFL', 'Red LED', 'Green LED', 'Blue LED', 'White LED']
efficacies = [15, 25, 60, 40, 90, 30, 150]
colors_bar = ['#f59e0b', '#f59e0b', '#a855f7', '#ef4444', '#22c55e', '#3b82f6', 'white']
bars = ax.barh(sources, efficacies, color=colors_bar, alpha=0.8)
ax.set_xlabel('Luminous efficacy (lm/W)', color='white')
ax.set_title('Light source efficiency comparison', color='white', fontsize=11)
for bar, e in zip(bars, efficacies):
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{e} lm/W', color='white', va='center', fontsize=9)

plt.tight_layout()
plt.show()

print("LED Physics Summary")
print("=" * 55)
print(f"{'Material':<22} {'Eg(eV)':>7} {'λ(nm)':>7} {'Color'}")
print("-" * 55)
for name, info in led_materials.items():
    wl = bandgap_to_wavelength(info['Eg'])
    print(f"{name:<22} {info['Eg']:>7.2f} {wl:>7.0f} {name.split('(')[1].rstrip(')')}")`,
      challenge: 'Model a white LED as a blue LED (460nm) plus phosphor emission. The phosphor converts 80% of blue photons to a broad yellow spectrum (centered at 560nm, FWHM=100nm). Plot the combined spectrum and calculate the resulting color temperature and CRI (color rendering index).',
      successHint: 'LEDs are quantum devices — each photon is emitted by a single electron transition across a band gap. Understanding this physics lets you engineer light of any color, intensity, and efficiency.',
    },
    {
      title: 'Circuit design: Ohm\'s law, series & parallel',
      concept: `Every LED circuit obeys **Ohm's law**: V = I * R. An LED requires a specific forward voltage (V_f, typically 1.8-3.3V depending on color) and a maximum forward current (usually 20 mA for standard LEDs). Since a power supply typically provides more voltage than V_f, we need a **current-limiting resistor** to prevent the LED from burning out.

The resistor value is: R = (V_supply - V_f) / I_f. For a red LED (V_f = 1.8V) on a 5V supply at 20 mA: R = (5 - 1.8) / 0.020 = 160 ohms. The nearest standard resistor is 180 ohms, giving I = 3.2/180 = 17.8 mA — slightly under the maximum, which is the safe direction.

LEDs can be wired in **series** (one after another) or **parallel** (side by side). In series, the voltages add: V_supply must exceed V_f1 + V_f2 + ... + V_fn, and the same current flows through all LEDs. In parallel, each LED gets the full supply voltage and draws its own current, but each needs its own current-limiting resistor. Series is more power-efficient (one resistor serves all LEDs) but requires higher supply voltage. Parallel is more fault-tolerant (one dead LED does not kill the chain) but uses more power in resistors. Professional LED installations use **constant current drivers** rather than simple resistors, which maintain precise current regardless of voltage variations and temperature changes.`,
      analogy: 'A series circuit is like a single-lane road through multiple toll booths — each car (electron) must pass through every booth (LED), and the total toll (voltage) is the sum of all booths. A parallel circuit is like a multi-lane highway where each lane has its own toll booth — cars can take any lane independently, but you need a booth attendant (resistor) for each lane.',
      storyConnection: 'The festival lights string together dozens of LEDs to create patterns. Understanding series vs parallel wiring determines whether a single burnt LED takes down the whole string (series) or just leaves one dark spot (parallel). Professional festival lighting uses a mix of both: groups of LEDs in series, with groups wired in parallel for reliability.',
      checkQuestion: 'You have a 12V supply and want to light 5 blue LEDs (V_f = 3.0V each, I_f = 20mA). Can you wire them in series? What about 3 in series with a resistor? Calculate the resistor value.',
      checkAnswer: 'Five in series would need 5 * 3.0 = 15V — exceeds the 12V supply, so no. Three in series need 3 * 3.0 = 9V. Remaining voltage across resistor: 12 - 9 = 3V. R = 3V / 0.020A = 150 ohms. Power dissipated in resistor: P = 3V * 20mA = 60 mW. You would then wire the remaining 2 LEDs as a separate series pair with R = (12 - 6) / 0.020 = 300 ohms.',
      codeIntro: 'Design and analyze LED circuits: calculate resistor values, compare series vs parallel configurations, and visualize voltage/current distributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def led_resistor(V_supply, V_forward, I_max_mA):
    """Calculate current-limiting resistor for an LED."""
    I = I_max_mA / 1000
    R = (V_supply - V_forward) / I
    # Find nearest standard E24 resistor
    e24 = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,
           3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1]
    decades = [1, 10, 100, 1000, 10000]
    all_values = [v*d for d in decades for v in e24]
    R_std = min(all_values, key=lambda x: abs(x - R) if x >= R * 0.9 else 1e6)
    I_actual = (V_supply - V_forward) / R_std * 1000
    P_resistor = (V_supply - V_forward)**2 / R_std
    return {'R_calc': R, 'R_std': R_std, 'I_actual_mA': I_actual, 'P_resistor_mW': P_resistor * 1000}

# LED types
leds = {
    'Red':    {'Vf': 1.8, 'color': '#ef4444'},
    'Orange': {'Vf': 2.0, 'color': '#f97316'},
    'Yellow': {'Vf': 2.1, 'color': '#f59e0b'},
    'Green':  {'Vf': 2.2, 'color': '#22c55e'},
    'Blue':   {'Vf': 3.0, 'color': '#3b82f6'},
    'White':  {'Vf': 3.2, 'color': '#e5e7eb'},
}

V_supply = 5.0
I_max = 20  # mA

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED Circuit Design: Resistors, Series & Parallel',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Resistor values for each color at 5V
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
names = list(leds.keys())
R_values = [led_resistor(V_supply, leds[n]['Vf'], I_max)['R_std'] for n in names]
colors_bar = [leds[n]['color'] for n in names]
bars = ax.bar(names, R_values, color=colors_bar, alpha=0.8)
for bar, r in zip(bars, R_values):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+3,
            f'{r:.0f}Ω', ha='center', color='white', fontsize=9)
ax.set_ylabel('Resistor value (Ω)', color='white')
ax.set_title(f'Resistor values at {V_supply}V, {I_max}mA', color='white', fontsize=11)

# Plot 2: Series vs parallel analysis
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_leds = np.arange(1, 11)
V_supplies = [5, 9, 12, 24]
for Vs in V_supplies:
    max_series = []
    for n in n_leds:
        # For green LEDs (Vf=2.2)
        total_Vf = n * 2.2
        if total_Vf < Vs - 0.5:  # need at least 0.5V for resistor
            max_series.append(n)
        else:
            max_series.append(max_series[-1] if max_series else 0)
    ax.step(n_leds, max_series, linewidth=2, where='mid',
            label=f'{Vs}V supply')
ax.set_xlabel('Desired number of green LEDs', color='white')
ax.set_ylabel('Max in series', color='white')
ax.set_title('How many LEDs can be in series?', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 3: Power efficiency comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_range = np.arange(1, 7)
V_s = 12.0
Vf = 2.2  # green LED
I = 0.020

# Series
P_led_series = []
P_resistor_series = []
for n in n_range:
    if n * Vf < V_s:
        P_led = n * Vf * I
        P_r = (V_s - n*Vf) * I
        P_led_series.append(P_led)
        P_resistor_series.append(P_r)
    else:
        P_led_series.append(np.nan)
        P_resistor_series.append(np.nan)

# Parallel (each with own resistor)
P_led_parallel = [n * Vf * I for n in n_range]
P_resistor_parallel = [n * (V_s - Vf) * I for n in n_range]

x = np.arange(len(n_range))
w = 0.35
ax.bar(x - w/2, P_led_series, w, color='#22c55e', alpha=0.8, label='LED power (series)')
ax.bar(x - w/2, P_resistor_series, w, bottom=P_led_series, color='#ef4444', alpha=0.5, label='Wasted (series)')
ax.bar(x + w/2, P_led_parallel, w, color='#3b82f6', alpha=0.8, label='LED power (parallel)')
ax.bar(x + w/2, P_resistor_parallel, w, bottom=P_led_parallel, color='#f59e0b', alpha=0.5, label='Wasted (parallel)')
ax.set_xticks(x)
ax.set_xticklabels(n_range)
ax.set_xlabel('Number of LEDs', color='white')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Power: series vs parallel (12V)', color='white', fontsize=11)
ax.legend(fontsize=7)

# Plot 4: Voltage distribution in series chain
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
chain = ['R', 'Red', 'Green', 'Blue']
voltages = [V_s - 1.8 - 2.2 - 3.0, 1.8, 2.2, 3.0]
colors_chain = ['gray', '#ef4444', '#22c55e', '#3b82f6']
bars = ax.barh(chain, voltages, color=colors_chain, alpha=0.8)
for bar, v in zip(bars, voltages):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{v:.1f}V', color='white', va='center', fontsize=10)
ax.set_xlabel('Voltage drop (V)', color='white')
ax.set_title(f'Voltage distribution in RGB series ({V_s}V)', color='white', fontsize=11)

# Plot 5: Current vs resistor value
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
R_range = np.linspace(50, 500, 200)
for name, info in [('Red', leds['Red']), ('Green', leds['Green']), ('Blue', leds['Blue'])]:
    I_curve = (V_supply - info['Vf']) / R_range * 1000
    ax.plot(R_range, I_curve, color=info['color'], linewidth=2, label=name)
ax.axhline(20, color='white', linewidth=1, linestyle='--', label='Max 20mA')
ax.axhline(10, color='gray', linewidth=1, linestyle=':', label='Dim threshold')
ax.set_xlabel('Resistor value (Ω)', color='white')
ax.set_ylabel('Current (mA)', color='white')
ax.set_title('Current control via resistance', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 6: Summary table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
text = f"LED Circuit Design Summary ({V_supply}V supply)\\n"
text += "=" * 42 + "\\n\\n"
text += f"{'LED':<8} {'Vf':>5} {'R(Ω)':>6} {'I(mA)':>7} {'P_R(mW)':>8}\\n"
text += "-" * 42 + "\\n"
for name in names:
    result = led_resistor(V_supply, leds[name]['Vf'], I_max)
    text += f"{name:<8} {leds[name]['Vf']:>5.1f} {result['R_std']:>6.0f} "
    text += f"{result['I_actual_mA']:>7.1f} {result['P_resistor_mW']:>8.1f}\\n"
text += "\\nSeries advantage: less wasted power\\n"
text += "Parallel advantage: fault tolerance\\n"
text += "Best practice: series groups in parallel"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("Circuit Design Results")
print("=" * 50)
for name in names:
    r = led_resistor(V_supply, leds[name]['Vf'], I_max)
    eff = leds[name]['Vf'] / V_supply * 100
    print(f"  {name:<8} Vf={leds[name]['Vf']}V  R={r['R_std']:.0f}Ω  "
          f"I={r['I_actual_mA']:.1f}mA  Efficiency={eff:.0f}%")`,
      challenge: 'Design a circuit for a string of 50 warm-white LEDs (Vf=3.0V, 20mA each) on a 12V supply. Compare three configurations: (1) all parallel with individual resistors, (2) groups of 3 in series, (3) groups of 4 in series with buck converter. Calculate total power consumption and efficiency for each.',
      successHint: 'Circuit design is where physics meets practical engineering. The same LED can waste 80% of power with a bad circuit or 5% with a good one. The difference is understanding Ohm\'s law and choosing the right topology.',
    },
    {
      title: 'RGB color mixing & additive color theory',
      concept: `The human eye has three types of color receptors (cones): sensitive to red (~570nm), green (~540nm), and blue (~440nm) light. Any color we perceive can be reproduced by mixing appropriate intensities of red, green, and blue (RGB) light. This is **additive color mixing**: combining light adds brightness. Red + Green = Yellow. Red + Blue = Magenta. Green + Blue = Cyan. Red + Green + Blue = White.

An RGB LED contains three separate die (red, green, blue) in a single package. By controlling the current through each die independently, we can produce millions of colors. Each channel has 256 brightness levels (0-255 in 8-bit digital control), giving 256^3 = 16.7 million possible colors. The actual color perceived depends on the exact peak wavelengths and spectral widths of each die, plus the human observer's color sensitivity.

The key challenge is **color accuracy**: specifying an RGB value like (255, 128, 0) should produce a consistent orange regardless of which LED package you use. But different LEDs have different peak wavelengths, different efficiencies, and different temperature dependencies. Professional LED installations use **color calibration** — measuring the actual output of each LED and computing correction factors to achieve the target color. The standard color space for this is **CIE 1931 xy chromaticity**, which maps every visible color to a two-dimensional coordinate.`,
      analogy: 'RGB mixing is like mixing three colors of paint on a palette — except with light, mixing adds brightness (additive) rather than making things darker (subtractive, like paint). Imagine three spotlights: red, green, blue. Where all three overlap on a white wall, you see white. Where red and green overlap, you see yellow. Each spotlight has a dimmer knob (0-255), and the combination of three dimmer positions defines one of 16.7 million possible colors.',
      storyConnection: 'The festival lights create stunning color displays by combining RGB LEDs in patterns. A "sunset gradient" effect might smoothly transition from red (255,100,0) through orange (255,165,0) to gold (255,215,0). Understanding RGB mixing is the key to programming any color effect for the festival.',
      checkQuestion: 'You want to display the color "coral" (RGB 255, 127, 80) on an RGB LED. Each channel draws up to 20mA at full brightness. What current does each channel need? What is the total power if Vf_red=1.8V, Vf_green=2.2V, Vf_blue=3.0V?',
      checkAnswer: 'Current proportional to brightness: I_red = 20 * 255/255 = 20 mA, I_green = 20 * 127/255 = 9.96 mA, I_blue = 20 * 80/255 = 6.27 mA. Power: P_red = 1.8 * 0.020 = 36 mW, P_green = 2.2 * 0.00996 = 21.9 mW, P_blue = 3.0 * 0.00627 = 18.8 mW. Total = 76.7 mW. The red channel dominates both current and power for this warm color.',
      codeIntro: 'Explore RGB color mixing, generate color wheels, and calculate the CIE chromaticity coordinates for LED combinations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rgb_to_normalized(r, g, b):
    """Normalize 0-255 to 0-1."""
    return r/255, g/255, b/255

# RGB color wheel
fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('RGB Color Mixing: Additive Color Theory for LEDs',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Additive mixing demonstration
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
theta = np.linspace(0, 2*np.pi, 100)
# Three overlapping circles
centers = [(0, 0.3), (-0.26, -0.15), (0.26, -0.15)]
colors_rgb = [(1,0,0), (0,1,0), (0,0,1)]
labels = ['Red', 'Green', 'Blue']
for (cx, cy), col, lab in zip(centers, colors_rgb, labels):
    circle = plt.Circle((cx, cy), 0.35, color=col, alpha=0.4)
    ax.add_patch(circle)
    ax.text(cx + 0.15*np.sign(cx), cy + 0.15*np.sign(cy), lab,
            color='white', fontsize=9, ha='center', fontweight='bold')
# Label overlaps
ax.text(0, 0, 'White', color='black', fontsize=8, ha='center', fontweight='bold')
ax.text(0, -0.25, 'Cyan', color='white', fontsize=7, ha='center')
ax.text(-0.15, 0.1, 'Yellow', color='white', fontsize=7, ha='center')
ax.text(0.15, 0.1, 'Magenta', color='white', fontsize=7, ha='center')
ax.set_xlim(-0.8, 0.8); ax.set_ylim(-0.6, 0.8)
ax.set_aspect('equal')
ax.set_title('Additive color mixing', color='white', fontsize=11)

# Plot 2: Color wheel (HSV sweep)
ax = axes[0, 1]
ax.set_facecolor('#111827')
n_hues = 360
for h in range(n_hues):
    theta_h = h * 2 * np.pi / 360
    # HSV to RGB
    h_norm = h / 60
    c = 1.0
    x = c * (1 - abs(h_norm % 2 - 1))
    if h_norm < 1: rgb = (c, x, 0)
    elif h_norm < 2: rgb = (x, c, 0)
    elif h_norm < 3: rgb = (0, c, x)
    elif h_norm < 4: rgb = (0, x, c)
    elif h_norm < 5: rgb = (x, 0, c)
    else: rgb = (c, 0, x)
    ax.bar(theta_h, 1, width=2*np.pi/360, color=rgb, alpha=0.8, bottom=0.3)
ax.set_ylim(0, 1.5)
ax.set_aspect('equal')
ax.set_title('HSV color wheel', color='white', fontsize=11)
# Make it a polar-like display
ax.set_xlim(-0.2, 2*np.pi+0.2)

# Plot 3: RGB channel mixing for festival colors
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
festival_colors = {
    'Warm White': (255, 200, 150),
    'Golden': (255, 180, 0),
    'Sunset Red': (255, 69, 0),
    'Deep Blue': (0, 50, 200),
    'Forest Green': (34, 139, 34),
    'Purple': (128, 0, 128),
    'Coral': (255, 127, 80),
    'Turquoise': (0, 206, 209),
}
y_pos = np.arange(len(festival_colors))
for i, (name, (r, g, b)) in enumerate(festival_colors.items()):
    ax.barh(i, r, height=0.25, left=0, color='red', alpha=0.6)
    ax.barh(i, g, height=0.25, left=r, color='green', alpha=0.6)
    ax.barh(i, b, height=0.25, left=r+g, color='blue', alpha=0.6)
    # Color swatch
    ax.barh(i - 0.35, 50, height=0.25, color=[r/255, g/255, b/255])
    ax.text(-10, i, name, color='white', fontsize=8, ha='right', va='center')
ax.set_xlabel('RGB values (stacked)', color='white')
ax.set_title('Festival color RGB breakdown', color='white', fontsize=11)

# Plot 4: Brightness vs current
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
I_range = np.linspace(0, 20, 200)
# LED brightness is approximately proportional to current
for name, col in [('Red', '#ef4444'), ('Green', '#22c55e'), ('Blue', '#3b82f6')]:
    brightness = I_range / 20 * 100  # normalized
    ax.plot(I_range, brightness, color=col, linewidth=2, label=name)
ax.set_xlabel('Current (mA)', color='white')
ax.set_ylabel('Relative brightness (%)', color='white')
ax.set_title('LED brightness vs current', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 5: Color gradient — sunset simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_steps = 256
for i in range(n_steps):
    t = i / n_steps
    if t < 0.33:
        r, g, b = 1.0, 0.9-t*2, 0.4-t
    elif t < 0.66:
        r = 1.0 - (t-0.33)*1.5
        g = 0.24 - (t-0.33)*0.5
        b = 0.07
    else:
        r = 0.5 - (t-0.66)*1.2
        g = 0.07
        b = 0.07 + (t-0.66)*0.8
    r, g, b = np.clip([r, g, b], 0, 1)
    ax.axvline(i, color=(r, g, b), linewidth=2)
ax.set_xlim(0, 256)
ax.set_title('Sunset color gradient (programmable)', color='white', fontsize=11)
ax.set_xlabel('LED position in string', color='white')

# Plot 6: Power budget for RGB string
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_leds = np.arange(1, 101)
Vf = {'R': 1.8, 'G': 2.2, 'B': 3.0}
# Full white: all channels at 20mA
P_per_led = sum(v * 0.020 for v in Vf.values())
P_total = n_leds * P_per_led
ax.plot(n_leds, P_total, color='white', linewidth=2.5, label=f'White ({P_per_led*1000:.0f}mW/LED)')
# Warm: R=20, G=10, B=5 mA
P_warm = n_leds * (1.8*0.020 + 2.2*0.010 + 3.0*0.005)
ax.plot(n_leds, P_warm, color='#f59e0b', linewidth=2, label='Warm gold')
# Blue: R=0, G=3, B=20 mA
P_blue = n_leds * (2.2*0.003 + 3.0*0.020)
ax.plot(n_leds, P_blue, color='#3b82f6', linewidth=2, label='Deep blue')
ax.set_xlabel('Number of RGB LEDs', color='white')
ax.set_ylabel('Total power (W)', color='white')
ax.set_title('Power budget: color affects power', color='white', fontsize=11)
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("RGB Color Mixing Summary")
print("=" * 50)
for name, (r, g, b) in festival_colors.items():
    I_r, I_g, I_b = r/255*20, g/255*20, b/255*20
    P = 1.8*I_r + 2.2*I_g + 3.0*I_b
    print(f"  {name:<14} ({r:>3},{g:>3},{b:>3})  "
          f"I={I_r+I_g+I_b:.1f}mA  P={P:.1f}mW")`,
      challenge: 'Implement a color temperature system: convert a color temperature (2700K warm, 4000K neutral, 6500K daylight) to RGB values using the Planckian locus in CIE space. Then calculate the LED currents needed to achieve each color temperature with an RGB LED.',
      successHint: 'RGB color mixing is the foundation of all digital color — displays, LED strips, stage lighting. The 16.7 million colors available from three channels give festival designers an enormous palette to work with.',
    },
    {
      title: 'Photometry: luminous flux, intensity & illuminance',
      concept: `**Photometry** measures light as the human eye perceives it, as opposed to radiometry which measures raw electromagnetic power. The distinction matters because the eye is not equally sensitive to all wavelengths — it peaks at 555 nm (green-yellow) and drops to near zero at 400 nm (violet) and 700 nm (deep red). A green LED and a blue LED emitting the same optical power (in watts) will appear dramatically different in brightness because the eye is much more sensitive to green.

**Luminous flux** (measured in **lumens**, lm) is the total perceived brightness of a light source. It is the radiometric power weighted by the eye's sensitivity curve (the luminosity function V(lambda)): Phi = 683 * integral of P(lambda) * V(lambda) d_lambda. The factor 683 lm/W is the maximum luminous efficacy, occurring at 555 nm.

**Luminous intensity** (candelas, cd) is flux per unit solid angle: how much light goes in a specific direction. A standard candle emits about 1 cd. **Illuminance** (lux, lx) is flux per unit area on a surface: how bright a surface appears. Full sunlight is about 100,000 lux; a well-lit office is 500 lux; moonlight is 0.1 lux. For festival lighting, the design goal is achieving sufficient illuminance on the decorated surfaces while creating pleasing patterns of light and shadow.`,
      analogy: 'Lumens measure total light output — like total water from a showerhead. Candelas measure how focused the light is — like a showerhead vs a fire hose (same total water, but the hose concentrates it). Lux measures how much light lands on you — which depends on how far you are from the source and what angle you are at. Standing close to a weak lamp gives more lux than standing far from a strong one.',
      storyConnection: 'Festival lighting must create specific moods: bright and festive in gathering areas, soft and atmospheric along pathways, dramatic spotlighting on decorations. Photometry gives us the tools to design these lighting effects quantitatively — how many LEDs, what brightness, what spacing — to achieve the desired illuminance pattern.',
      checkQuestion: 'A single white LED produces 100 lumens with a beam angle of 120 degrees. What is its luminous intensity in candelas? If it illuminates a surface 2 meters away at normal incidence, what is the illuminance in lux?',
      checkAnswer: 'Solid angle of a 120° cone: Omega = 2*pi*(1-cos(60°)) = 2*pi*(1-0.5) = pi steradians. Intensity I = 100 lm / pi sr = 31.8 cd. Illuminance at 2m: E = I / d^2 = 31.8 / 4 = 7.96 lux. For comparison, this is roughly equivalent to very dim indoor lighting — you would need about 60 such LEDs at 2m distance to achieve office-level illumination (500 lux).',
      codeIntro: 'Calculate photometric quantities for LED arrays, design illumination patterns, and visualize the luminosity function and its impact on perceived brightness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# CIE 1931 Luminosity function V(lambda) — simplified
def luminosity_function(wavelength):
    """Approximate human eye sensitivity."""
    # Gaussian approximation of V(lambda)
    return 1.019 * np.exp(-285.4 * (np.log(wavelength / 555.0))**2)

wavelengths = np.arange(380, 781, 1)
V_lambda = luminosity_function(wavelengths)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Photometry: Measuring Light as the Eye Sees It',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Luminosity function
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for i in range(len(wavelengths)-1):
    w = wavelengths[i]
    if w < 440: rgb = (max(0, (440-w)/60), 0, 1)
    elif w < 510: rgb = (0, (w-440)/70, 1-(w-440)/70)
    elif w < 580: rgb = ((w-510)/70, 1, 0)
    elif w < 645: rgb = (1, 1-(w-580)/65, 0)
    else: rgb = (1, 0, 0)
    ax.fill_between([w, w+1], 0, [V_lambda[i], V_lambda[i+1]], color=rgb, alpha=0.6)
ax.plot(wavelengths, V_lambda, color='white', linewidth=2)
ax.axvline(555, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.text(555, 1.05, '555nm peak', color='white', fontsize=8, ha='center')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative sensitivity V(λ)', color='white')
ax.set_title('Human eye luminosity function', color='white', fontsize=11)

# Plot 2: Same power, different perceived brightness
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
led_peaks = {'Red (630nm)': 630, 'Green (550nm)': 550, 'Blue (460nm)': 460}
led_cols = {'Red (630nm)': '#ef4444', 'Green (550nm)': '#22c55e', 'Blue (460nm)': '#3b82f6'}
P_optical = 0.050  # 50 mW each
for name, peak in led_peaks.items():
    # LED spectrum (narrow Gaussian)
    spectrum = np.exp(-((wavelengths - peak) / 15)**2) * P_optical / 15
    V_weighted = spectrum * V_lambda
    lumens = 683 * np.trapz(V_weighted, wavelengths * 1e-9)
    ax.fill_between(wavelengths, V_weighted * 1e6, color=led_cols[name], alpha=0.5, label=f'{name}: {lumens:.1f} lm')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('V(λ)-weighted power (µW/nm)', color='white')
ax.set_title('Same 50mW optical power, different lumens', color='white', fontsize=10)
ax.legend(fontsize=8)

# Plot 3: Illuminance vs distance (inverse square law)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
distances = np.linspace(0.3, 5, 200)
led_configs = [
    ('1 LED (100 lm)', 100),
    ('10 LEDs (1000 lm)', 1000),
    ('LED panel (5000 lm)', 5000),
]
for name, flux in led_configs:
    # Assuming Lambertian emission (half-sphere)
    I = flux / (2*np.pi)  # average intensity
    E = I / distances**2  # illuminance
    ax.plot(distances, E, linewidth=2, label=name)
ax.axhline(500, color='white', linewidth=1, linestyle='--', alpha=0.5, label='Office (500 lux)')
ax.axhline(50, color='gray', linewidth=1, linestyle=':', alpha=0.5, label='Ambient festival (50 lux)')
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Illuminance (lux)', color='white')
ax.set_title('Inverse square law: E = I/d²', color='white', fontsize=11)
ax.set_ylim(0, 2000)
ax.legend(fontsize=7)

# Plot 4: Festival lighting layout — illuminance map
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# 4 LEDs at corners of a 4m x 4m area, 3m high
led_positions = [(-2, -2), (-2, 2), (2, -2), (2, 2)]
led_flux = 1000  # lumens each
height = 3.0
x_grid = np.linspace(-3, 3, 100)
y_grid = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x_grid, y_grid)
E_total = np.zeros_like(X)
for lx, ly in led_positions:
    d = np.sqrt((X-lx)**2 + (Y-ly)**2 + height**2)
    cos_theta = height / d
    I = led_flux / (2*np.pi)
    E_total += I * cos_theta / d**2
cs = ax.contourf(X, Y, E_total, levels=20, cmap='hot')
plt.colorbar(cs, ax=ax, label='Illuminance (lux)')
for lx, ly in led_positions:
    ax.plot(lx, ly, '*', color='white', markersize=15)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Illuminance map: 4 LEDs at 3m height', color='white', fontsize=10)
ax.set_aspect('equal')

# Plot 5: Beam angle comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
angles = np.linspace(-90, 90, 200)
beam_types = [('Narrow (30°)', 15, '#ef4444'), ('Medium (60°)', 30, '#f59e0b'),
              ('Wide (120°)', 60, '#22c55e'), ('Lambertian (180°)', 90, '#3b82f6')]
for name, half_angle, col in beam_types:
    intensity = np.cos(np.radians(angles))**max(1, np.log(2)/np.log(np.cos(np.radians(min(half_angle,89)))))
    intensity = np.where(np.abs(angles) > half_angle, 0, intensity)
    intensity = np.maximum(intensity, 0)
    ax.plot(angles, intensity, color=col, linewidth=2, label=name)
ax.set_xlabel('Angle from center (degrees)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('LED beam angle profiles', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 6: Efficacy table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
text = "Photometry Quick Reference\\n"
text += "=" * 35 + "\\n\\n"
text += "Quantity    Unit    Meaning\\n"
text += "-" * 35 + "\\n"
text += "Flux        lm      Total light output\\n"
text += "Intensity   cd      Light per solid angle\\n"
text += "Illuminance lux     Light per surface area\\n"
text += "Luminance   cd/m²   Surface brightness\\n"
text += "Efficacy    lm/W    Efficiency\\n\\n"
text += "Typical illuminance levels:\\n"
text += "  Direct sun: 100,000 lux\\n"
text += "  Overcast:   10,000 lux\\n"
text += "  Office:     500 lux\\n"
text += "  Festival:   50-200 lux\\n"
text += "  Moonlight:  0.1 lux"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("Photometry Analysis")
print("=" * 50)
print(f"50 mW optical power at different wavelengths:")
for name, peak in led_peaks.items():
    spectrum = np.exp(-((wavelengths - peak) / 15)**2) * 0.050 / 15
    lumens = 683 * np.trapz(spectrum * V_lambda, wavelengths * 1e-9)
    print(f"  {name}: {lumens:.1f} lumens")
print(f"Green appears {15/2:.0f}x brighter than blue at same optical power!")`,
      challenge: 'Design the lighting for a festival area: 20m x 20m courtyard with a central stage (8m x 8m). The stage needs 1000 lux, pathways need 100 lux, and ambient areas need 30 lux. Calculate the minimum number of LEDs, their positions, beam angles, and total power consumption.',
      successHint: 'Photometry bridges physics and human perception. Designing festival lighting requires understanding not just how much light is produced, but how it is perceived — which depends on wavelength, angle, distance, and the eye\'s own sensitivity curve.',
    },
    {
      title: 'PWM dimming & LED control',
      concept: `LEDs are either on or off — there is no simple way to make them "half bright" by applying half voltage (the I-V curve is exponential, not linear). Instead, we use **Pulse Width Modulation (PWM)**: rapidly switching the LED on and off at a frequency too fast for the eye to see. The ratio of on-time to total cycle time is the **duty cycle**, and it controls the apparent brightness.

At a PWM frequency of 1000 Hz, the LED switches on and off 1000 times per second. At 50% duty cycle, it is on for 0.5 ms and off for 0.5 ms. The eye perceives the time-averaged brightness, which is 50% of maximum. At 25% duty cycle: 0.25 ms on, 0.75 ms off, perceived as 25% brightness. The human eye cannot detect flicker above about 60 Hz (higher for peripheral vision), so PWM at 1000 Hz appears perfectly smooth.

However, human brightness perception is **logarithmic**, not linear. A 50% duty cycle does not look "half as bright" — it looks much brighter than half. To create the perception of uniform dimming from 0-100%, we need to apply a **gamma curve**: duty_cycle = (perceived_brightness)^gamma, where gamma is typically 2.2-2.8. This means to make an LED look "half bright," we need a duty cycle of about (0.5)^2.5 = 0.18, or 18%. This non-linearity is critical for creating smooth, natural-looking lighting effects in festival displays.`,
      analogy: 'PWM is like a strobe light in slow motion. If a strobe flashes for 1 second out of every 2 seconds, the room appears half-lit on average. Speed up the strobe to 1000 flashes per second, and the flickering becomes invisible — you just see a steady half-brightness. The "duty cycle" is like how much of each second the strobe is on. The gamma correction is like adjusting the strobe timing so that "50% brightness" actually looks like 50% to your eyes, not 80%.',
      storyConnection: 'Festival light shows create dynamic effects — fading, pulsing, color transitions. All of these require precise brightness control of individual LEDs. PWM is the technique that makes these effects possible. When festival lights smoothly fade from bright gold to dim amber and back, they are cycling through PWM duty cycles hundreds of times per second.',
      checkQuestion: 'An LED display runs PWM at 500 Hz with gamma = 2.5. To display 50% perceived brightness, what duty cycle is needed? What is the on-time per cycle in microseconds? At what PWM frequency would you start to see flicker?',
      checkAnswer: 'Duty cycle = 0.50^2.5 = 0.177 = 17.7%. Cycle period = 1/500 = 2000 microseconds. On-time = 0.177 * 2000 = 354 microseconds. Flicker becomes visible below about 60 Hz (some people can see up to 90 Hz, especially in peripheral vision). At 500 Hz, no flicker is visible. The CIE recommends > 200 Hz for general lighting to avoid any perceptible flicker effects.',
      codeIntro: 'Simulate PWM signals at different duty cycles, demonstrate gamma correction, and create animated brightness patterns for festival effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def pwm_signal(frequency, duty_cycle, duration, sample_rate=100000):
    """Generate a PWM signal."""
    t = np.linspace(0, duration, int(sample_rate * duration))
    period = 1.0 / frequency
    phase = (t % period) / period
    signal = (phase < duty_cycle).astype(float)
    return t, signal

def gamma_correct(perceived_brightness, gamma=2.5):
    """Convert perceived brightness (0-1) to PWM duty cycle."""
    return perceived_brightness ** gamma

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('PWM Dimming & LED Control',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: PWM signals at different duty cycles
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
duty_cycles = [0.25, 0.50, 0.75, 1.00]
colors_pwm = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for i, (dc, col) in enumerate(zip(duty_cycles, colors_pwm)):
    t, sig = pwm_signal(100, dc, 0.03)
    ax.plot(t*1000, sig + i*1.3, color=col, linewidth=1.5)
    ax.text(-0.5, i*1.3 + 0.5, f'{dc*100:.0f}%', color=col, fontsize=10, fontweight='bold')
ax.set_xlabel('Time (ms)', color='white')
ax.set_title('PWM at different duty cycles (100 Hz)', color='white', fontsize=11)
ax.set_yticks([])

# Plot 2: Gamma correction curve
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
x = np.linspace(0, 1, 200)
gammas = [1.0, 1.8, 2.2, 2.8]
for g in gammas:
    y = x ** g
    ax.plot(x*100, y*100, linewidth=2, label=f'γ={g}')
ax.plot([0, 100], [0, 100], color='gray', linewidth=1, linestyle=':', alpha=0.5)
ax.set_xlabel('Perceived brightness (%)', color='white')
ax.set_ylabel('PWM duty cycle (%)', color='white')
ax.set_title('Gamma correction curves', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 3: Linear vs gamma-corrected fade
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
steps = np.arange(0, 256)
linear_duty = steps / 255
gamma_duty = (steps / 255) ** 2.5
# Perceived brightness (inverse gamma)
linear_perceived = linear_duty ** (1/2.5)
gamma_perceived = gamma_duty ** (1/2.5)  # = steps/255 (linear perceived)
ax.plot(steps, linear_perceived * 100, color='#ef4444', linewidth=2, label='Linear PWM (perceived)')
ax.plot(steps, gamma_perceived * 100, color='#22c55e', linewidth=2, label='Gamma-corrected (perceived)')
ax.set_xlabel('Step (0-255)', color='white')
ax.set_ylabel('Perceived brightness (%)', color='white')
ax.set_title('Linear vs corrected: perception', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 4: Flicker perception threshold
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
frequencies = np.logspace(1, 4, 200)
# Flicker sensitivity (simplified)
# Peaks around 8-10 Hz, drops above 60 Hz
sensitivity = np.exp(-((np.log10(frequencies) - 1)**2) / 0.3)
threshold = np.where(frequencies > 60, 0, sensitivity)
ax.semilogx(frequencies, sensitivity * 100, color='#f59e0b', linewidth=2.5, label='Flicker sensitivity')
ax.fill_between(frequencies, 0, sensitivity * 100, alpha=0.1, color='#f59e0b')
ax.axvline(60, color='#ef4444', linewidth=2, linestyle='--', label='~60 Hz: flicker threshold')
ax.axvline(1000, color='#22c55e', linewidth=2, linestyle=':', label='1 kHz: typical PWM')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Relative sensitivity (%)', color='white')
ax.set_title('Human flicker perception', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 5: Festival effect — breathing/pulsing LED
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
t = np.linspace(0, 4, 1000)
# Breathing effect: sinusoidal perceived brightness
perceived = 0.5 * (1 + np.sin(2*np.pi*0.5*t))  # 0.5 Hz breathing
duty = perceived ** 2.5  # gamma corrected
ax.plot(t, perceived * 100, color='#f59e0b', linewidth=2, label='Perceived brightness')
ax.plot(t, duty * 100, color='#3b82f6', linewidth=2, linestyle='--', label='Actual PWM duty')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Level (%)', color='white')
ax.set_title('Breathing effect: perceived vs PWM duty', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 6: 8-bit resolution and color depth
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
bit_depths = [4, 6, 8, 10, 12]
for bd in bit_depths:
    levels = 2**bd
    steps = np.linspace(0, 1, levels)
    gamma_steps = steps ** (1/2.5)  # what you see
    ax.plot(steps * 100, gamma_steps * 100, linewidth=1.5, label=f'{bd}-bit ({levels} levels)')
ax.set_xlabel('Input level (%)', color='white')
ax.set_ylabel('Perceived brightness (%)', color='white')
ax.set_title('Bit depth: more bits = smoother gradients', color='white', fontsize=11)
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("PWM Control Summary")
print("=" * 50)
print("To achieve perceived brightness:")
print(f"{'Perceived':>10} {'Linear DC':>10} {'γ=2.5 DC':>10}")
print("-" * 35)
for p in [0.1, 0.25, 0.5, 0.75, 1.0]:
    print(f"{p*100:>9.0f}% {p*100:>9.1f}% {gamma_correct(p)*100:>9.1f}%")
print()
print("At γ=2.5, 50% perceived needs only 17.7% duty cycle.")
print("This is why gamma correction is essential for natural-looking dimming.")`,
      challenge: 'Create a 3-channel RGB PWM controller that generates a smooth "rainbow cycle" effect. Each channel (R, G, B) must be gamma-corrected independently. The cycle should go through all hues in 5 seconds. Plot the duty cycles for all three channels over one complete cycle.',
      successHint: 'PWM is the fundamental control technique for all modern LED systems. From phone screens to stadium displays to festival lights, every LED\'s brightness is controlled by switching it on and off thousands of times per second.',
    },
    {
      title: 'Thermal management & LED lifetime',
      concept: `LEDs do not convert all electrical energy to light — a significant fraction becomes heat. A white LED with 40% luminous efficacy still dissipates 60% of its power as heat. This heat must be removed, because LED performance degrades dramatically with temperature. At high junction temperatures (above 85°C), luminous output drops by 20-30%, color shifts toward longer wavelengths, and the LED's **lifetime** — measured as the time until output drops to 70% of initial (called L70) — decreases exponentially.

The thermal path from the LED junction to the ambient air is modeled as a series of **thermal resistances**: R_jc (junction to case), R_cp (case to PCB pad), R_pa (PCB to ambient). The total thermal resistance R_ja determines the junction temperature: T_j = T_ambient + P_dissipated * R_ja. For a typical 1W LED with R_ja = 20 °C/W in a 25°C ambient: T_j = 25 + 1.0 * 20 = 45°C — well within safe limits. But pack 100 such LEDs close together without adequate heatsinking, and the local temperature can soar.

LED lifetime follows **Arrhenius kinetics**: for every 10°C increase in junction temperature, the lifetime roughly halves. An LED rated for 50,000 hours at 85°C junction temperature would last only 25,000 hours at 95°C, but 100,000 hours at 75°C. This is why professional LED installations invest heavily in thermal design — the cheapest way to make LEDs last longer is to keep them cool.`,
      analogy: 'An LED\'s thermal management is like an athlete\'s cooling system. During exercise (generating light), the body (LED) produces heat. Sweating (the heatsink) removes that heat to the air (ambient). If you exercise in a hot room (high ambient temperature) or wear too many layers (high thermal resistance), your body overheats and performance drops. An LED "overheating" does not catch fire — it just gets dimmer and dies sooner.',
      storyConnection: 'Festival lights must operate for hours in warm, humid Assamese weather. Without thermal management, LEDs rated for 50,000 hours could fail in a single season. The traditional oil lamp never had this problem — it dissipated heat efficiently through convection and radiation. Modern LED festival lighting must achieve the same thermal dissipation in a much smaller package.',
      checkQuestion: 'A festival LED string uses 100 LEDs, each dissipating 0.15W of heat. The enclosure has total thermal resistance of 0.5 °C/W to ambient. On a 35°C Assamese summer evening, what is the enclosure temperature? If LED lifetime halves per 10°C above 85°C junction, and R_jc = 50°C/W, estimate the lifetime at this operating point.',
      checkAnswer: 'Total heat: 100 * 0.15 = 15W. Enclosure temp: 35 + 15 * 0.5 = 42.5°C. Each LED dissipates 0.15W with R_jc = 50°C/W: T_j = 42.5 + 0.15 * 50 = 50°C. This is well below 85°C. At 50°C, the LED runs 35°C cooler than the 85°C rating, which means roughly 2^3.5 = 11x longer than rated life. If rated for 50,000 hours at 85°C, expected life is about 550,000 hours — essentially permanent for festival use.',
      codeIntro: 'Model LED thermal behavior, calculate junction temperatures for different configurations, and predict lifetime under various operating conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def led_junction_temp(P_dissipated, R_jc, R_ca, T_ambient):
    """Calculate LED junction temperature."""
    T_j = T_ambient + P_dissipated * (R_jc + R_ca)
    return T_j

def led_lifetime(T_junction, T_rated=85, L70_rated=50000):
    """Estimate L70 lifetime using Arrhenius model."""
    # Lifetime halves for every 10°C increase
    delta_T = T_junction - T_rated
    factor = 2 ** (-delta_T / 10)
    return L70_rated * factor

def led_output_vs_temp(T_junction, T_ref=25):
    """Relative luminous output vs junction temperature."""
    # Typically -0.5%/°C for white LEDs
    return max(0, 1.0 - 0.005 * (T_junction - T_ref))

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('LED Thermal Management & Lifetime',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Junction temperature vs power
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
P_range = np.linspace(0.01, 2.0, 200)
configs = [
    ('No heatsink (R=80°C/W)', 15, 65),
    ('Small heatsink (R=30°C/W)', 15, 15),
    ('Large heatsink (R=15°C/W)', 15, 0),
    ('Active cooling (R=8°C/W)', 8, 0),
]
T_amb = 35  # Assam summer
for name, Rjc, Rca in configs:
    Tj = T_amb + P_range * (Rjc + Rca)
    ax.plot(P_range, Tj, linewidth=2, label=name)
ax.axhline(85, color='#ef4444', linewidth=2, linestyle='--', label='Max safe (85°C)')
ax.axhline(120, color='#ef4444', linewidth=1, linestyle=':', label='Damage (120°C)')
ax.set_xlabel('Power dissipated (W)', color='white')
ax.set_ylabel('Junction temperature (°C)', color='white')
ax.set_title(f'Junction temp vs power (T_amb={T_amb}°C)', color='white', fontsize=11)
ax.legend(fontsize=7)

# Plot 2: Lifetime vs junction temperature
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
Tj_range = np.linspace(30, 130, 200)
lifetime = led_lifetime(Tj_range)
ax.semilogy(Tj_range, lifetime, color='#22c55e', linewidth=2.5)
ax.axvline(85, color='#f59e0b', linewidth=1.5, linestyle='--', label='Rated temp (85°C)')
ax.axhline(50000, color='gray', linewidth=1, linestyle=':', alpha=0.5)
# Mark some points
for tj, col in [(50, '#22c55e'), (70, '#3b82f6'), (85, '#f59e0b'), (100, '#ef4444')]:
    lt = led_lifetime(tj)
    ax.scatter([tj], [lt], color=col, s=80, zorder=5)
    ax.annotate(f'{lt/1000:.0f}k hrs', (tj, lt), xytext=(5, 10),
                textcoords='offset points', color='white', fontsize=8)
ax.set_xlabel('Junction temperature (°C)', color='white')
ax.set_ylabel('L70 lifetime (hours)', color='white')
ax.set_title('Lifetime doubles for every 10°C reduction', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 3: Luminous output vs temperature
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
output = [led_output_vs_temp(t) * 100 for t in Tj_range]
ax.plot(Tj_range, output, color='#f59e0b', linewidth=2.5)
ax.fill_between(Tj_range, output, 70, where=np.array(output) > 70, alpha=0.1, color='#22c55e')
ax.fill_between(Tj_range, output, 70, where=np.array(output) < 70, alpha=0.2, color='#ef4444')
ax.axhline(70, color='#ef4444', linewidth=1, linestyle='--', label='L70 threshold (70%)')
ax.set_xlabel('Junction temperature (°C)', color='white')
ax.set_ylabel('Relative output (%)', color='white')
ax.set_title('Thermal droop: output falls with temperature', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 4: Thermal resistance model
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Visualize thermal resistance chain
components = ['Junction', 'Case', 'Solder', 'PCB', 'Heatsink', 'Air']
R_thermal = [0, 8, 2, 5, 10, 15]  # cumulative °C/W
T_chain = [T_amb + 0.5 * sum(R_thermal)] + [T_amb + 0.5 * sum(R_thermal[:i+1]) for i in range(len(R_thermal)-1)]
T_chain = T_chain[::-1]  # junction is hottest
ax.barh(components, R_thermal, color=['#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#3b82f6', '#60a5fa'],
        alpha=0.8)
ax.set_xlabel('Thermal resistance (°C/W)', color='white')
ax.set_title('Thermal resistance chain', color='white', fontsize=11)

# Plot 5: Cost of cooling vs lifetime savings
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
heatsink_cost = np.linspace(0, 5, 100)  # $ per LED
R_ja = 80 - heatsink_cost * 12  # thermal resistance decreases with cost
R_ja = np.maximum(R_ja, 8)
T_j = T_amb + 0.5 * R_ja  # 0.5W per LED
lifetime_years = led_lifetime(T_j) / (365.25 * 12)  # 12 hrs/day operation
ax.plot(heatsink_cost, lifetime_years, color='#22c55e', linewidth=2.5, label='Lifetime (years)')
ax.set_xlabel('Heatsink cost per LED ($)', color='white')
ax.set_ylabel('Expected lifetime (years, 12h/day)', color='white')
ax.set_title('Investment in cooling pays off', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 6: Festival string thermal simulation
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Simulate temperature rise over time for a packed LED string
time_hrs = np.linspace(0, 8, 200)
P_total = 10  # watts
C_thermal = 50  # J/°C thermal mass
R_total = 5  # °C/W
T_steady = T_amb + P_total * R_total
T_time = T_amb + (T_steady - T_amb) * (1 - np.exp(-time_hrs * 3600 / (C_thermal * R_total)))
ax.plot(time_hrs, T_time, color='#ef4444', linewidth=2.5, label='Enclosure temp')
ax.axhline(T_steady, color='#f59e0b', linewidth=1, linestyle='--',
           label=f'Steady state: {T_steady:.0f}°C')
ax.axhline(T_amb, color='#3b82f6', linewidth=1, linestyle=':', label=f'Ambient: {T_amb}°C')
ax.set_xlabel('Operating time (hours)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Festival string warm-up curve', color='white', fontsize=11)
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Thermal Management Summary")
print("=" * 50)
print(f"Ambient temperature: {T_amb}°C (Assam summer)")
print()
for name, Rjc, Rca in configs:
    Tj = T_amb + 0.5 * (Rjc + Rca)  # at 0.5W
    lt = led_lifetime(Tj)
    out = led_output_vs_temp(Tj) * 100
    print(f"  {name:<30} Tj={Tj:.0f}°C  Output={out:.0f}%  Life={lt/1000:.0f}k hrs")`,
      challenge: 'Design a thermal management system for a 100W LED floodlight for festival use in Assam (ambient up to 40°C). Calculate the required heatsink thermal resistance, minimum heatsink size (using natural convection correlations), and compare with forced-air cooling. What is the cost-optimal solution if electricity costs $0.08/kWh and LED replacement costs $50?',
      successHint: 'Thermal management is the hidden engineering challenge of LED lighting. A well-cooled LED can outlast the building it is installed in. A poorly cooled one can fail in months. The economics of cooling investment vs replacement cost drive real engineering decisions.',
    },
    {
      title: 'Power efficiency & electrical safety',
      concept: `Festival lighting installations consume significant power and must be designed for both **efficiency** (minimizing electricity cost and environmental impact) and **safety** (preventing electric shock, fire, and equipment damage). Power efficiency has three components: LED efficacy (lumens per watt), driver efficiency (converting supply power to LED power), and optical efficiency (getting light where it is needed rather than wasted).

A typical LED system: wall power (230V AC) -> AC/DC converter (90% efficient) -> DC/DC driver (95% efficient) -> LED (40% luminous efficacy). Overall wall-plug efficiency: 0.90 * 0.95 * 0.40 = 34% of electrical power becomes useful light. For comparison, incandescent bulbs achieve 2-3%. The largest loss is in the LED itself — 60% of input power becomes heat. The driver losses (10-15%) are the next largest and can be minimized by using high-quality constant-current drivers.

Electrical safety for outdoor festival installations requires: **IP65 or higher** enclosure rating (protected against water jets and dust), **GFCI/RCD protection** (ground fault circuit interrupter that cuts power within 30 ms if current leaks to ground, preventing electrocution), **proper grounding** of all metal parts, **strain relief** on cable connections, and **fuse protection** sized for the maximum load. Low-voltage DC (12V or 24V) LED systems are inherently safer than mains voltage — even a direct short circuit cannot cause lethal shock at 24V.`,
      analogy: 'Power efficiency in an LED system is like a relay race. The baton (energy) passes from the power grid (first runner) through the AC/DC converter (second runner) to the LED driver (third runner) to the LED itself (anchor). Each handoff loses a little speed (energy). The team\'s total efficiency is the product of all individual efficiencies. Safety is like the rules of the race: lane markings (insulation), medical staff (GFCI protection), and barriers (enclosures) keep everyone safe.',
      storyConnection: 'Festival lights must be safe for outdoor use in Assam\'s humid, monsoon-prone climate. Water and electricity are a dangerous combination, and traditional festival installations with bare wires and makeshift connections have caused injuries. Modern LED systems designed with proper safety standards allow the same festive atmosphere with dramatically reduced risk.',
      checkQuestion: 'A festival installation uses 500 RGB LEDs at 0.3W each, powered by a 230V AC supply through an 88% efficient AC/DC converter and a 92% efficient LED driver. Calculate: (1) total LED power, (2) total wall power, (3) total heat generated, (4) minimum wire gauge for the AC side (assume 230V, safety factor 1.25).',
      checkAnswer: '(1) LED power: 500 * 0.3 = 150W. (2) Driver input: 150/0.92 = 163W. Wall power: 163/0.88 = 185.2W. (3) Heat: 185.2 - (150 * 0.40) = 185.2 - 60 = 125.2W (60W is light, 90W is LED heat, 35.2W is driver/converter heat). (4) AC current: 185.2 / 230 = 0.805A. With 1.25 safety factor: 1.01A. Minimum 0.75mm² wire is sufficient, but 1.5mm² is standard for lighting circuits.',
      codeIntro: 'Analyze power flow through an LED lighting system, calculate efficiencies, and design a safe power distribution layout for a festival installation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Festival installation parameters
n_leds = 500
P_per_led = 0.3  # watts
eff_acdc = 0.88   # AC/DC converter
eff_driver = 0.92  # LED driver
eff_led_light = 0.40  # fraction of LED power that becomes light
V_supply_ac = 230  # volts AC
V_led_dc = 24     # volts DC

# Power flow calculation
P_led_total = n_leds * P_per_led
P_driver_input = P_led_total / eff_driver
P_acdc_input = P_driver_input / eff_acdc  # wall power
P_light = P_led_total * eff_led_light
P_heat_led = P_led_total * (1 - eff_led_light)
P_heat_driver = P_driver_input - P_led_total
P_heat_acdc = P_acdc_input - P_driver_input
P_heat_total = P_heat_led + P_heat_driver + P_heat_acdc

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Power Efficiency & Electrical Safety for Festival Lighting',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Sankey-like power flow
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
stages = ['Wall\\npower', 'After\\nAC/DC', 'After\\ndriver', 'Light\\noutput']
powers = [P_acdc_input, P_driver_input, P_led_total, P_light]
losses = [P_heat_acdc, P_heat_driver, P_heat_led, 0]
colors_stage = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
x = np.arange(len(stages))
bars = ax.bar(x, powers, color=colors_stage, alpha=0.8, width=0.6)
# Stack losses on top in red
for i in range(3):
    ax.bar(x[i], losses[i], bottom=powers[i]-losses[i], color='#ef4444', alpha=0.3, width=0.6)
for bar, p, l in zip(bars, powers, losses):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+2,
            f'{p:.0f}W', ha='center', color='white', fontsize=9)
    if l > 0:
        ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()-l/2,
                f'-{l:.0f}W', ha='center', color='#ef4444', fontsize=8)
ax.set_xticks(x)
ax.set_xticklabels(stages, color='white', fontsize=9)
ax.set_ylabel('Power (W)', color='white')
ax.set_title(f'Power flow: {P_acdc_input:.0f}W in -> {P_light:.0f}W light', color='white', fontsize=10)

# Plot 2: Efficiency comparison with other light sources
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
sources = ['Incandescent', 'Halogen', 'CFL', 'LED (this)', 'LED (best)']
wall_to_light = [2.5, 4, 12, P_light/P_acdc_input*100, 50]
colors_s = ['#f59e0b', '#f59e0b', '#a855f7', '#22c55e', '#22c55e']
bars = ax.barh(sources, wall_to_light, color=colors_s, alpha=0.8)
for bar, e in zip(bars, wall_to_light):
    ax.text(bar.get_width()+1, bar.get_y()+bar.get_height()/2,
            f'{e:.1f}%', color='white', va='center', fontsize=10)
ax.set_xlabel('Wall-to-light efficiency (%)', color='white')
ax.set_title('Efficiency comparison', color='white', fontsize=11)

# Plot 3: Annual cost analysis
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
hours_per_year = 365 * 6  # 6 hours per day for festival/decorative
cost_per_kwh = 5.0  # INR per kWh
annual_kwh_led = P_acdc_input / 1000 * hours_per_year
annual_cost_led = annual_kwh_led * cost_per_kwh
# Compare: same light output with incandescent
P_incandescent = P_light / 0.025  # 2.5% efficiency
annual_kwh_inc = P_incandescent / 1000 * hours_per_year
annual_cost_inc = annual_kwh_inc * cost_per_kwh
categories = ['LED', 'Incandescent']
costs = [annual_cost_led, annual_cost_inc]
ax.bar(categories, costs, color=['#22c55e', '#ef4444'], alpha=0.8, width=0.5)
for i, c in enumerate(costs):
    ax.text(i, c+50, f'₹{c:.0f}/yr', ha='center', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Annual electricity cost (₹)', color='white')
ax.set_title(f'Annual cost: {hours_per_year} hrs/yr', color='white', fontsize=11)

# Plot 4: Wire sizing chart
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# AWG/mm² vs max current (copper, 60°C rating)
wire_sizes = [0.5, 0.75, 1.0, 1.5, 2.5, 4.0, 6.0]
max_currents = [3, 6, 10, 16, 25, 32, 40]
ax.plot(wire_sizes, max_currents, color='#3b82f6', linewidth=2.5, marker='o')
# Mark our requirement
I_ac = P_acdc_input / V_supply_ac * 1.25
ax.axhline(I_ac, color='#f59e0b', linewidth=1.5, linestyle='--', label=f'Our need: {I_ac:.1f}A')
ax.scatter([0.75], [6], color='#22c55e', s=100, zorder=5, label='Selected: 0.75mm²')
ax.set_xlabel('Wire cross-section (mm²)', color='white')
ax.set_ylabel('Max current rating (A)', color='white')
ax.set_title('Wire sizing for safety', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 5: IP rating explanation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
text = "IP RATING GUIDE (for outdoor festivals)\\n"
text += "=" * 40 + "\\n\\n"
text += "IP X Y\\n"
text += "   | |__ Water protection (Y)\\n"
text += "   |____ Dust protection (X)\\n\\n"
text += "Water (Y):  \\n"
text += "  4: Splash proof\\n"
text += "  5: Water jet proof \\n"
text += "  6: Powerful water jet proof\\n"
text += "  7: Temporary immersion\\n"
text += "  8: Continuous submersion\\n\\n"
text += "Festival requirement: IP65 minimum\\n"
text += "(Dust-tight + water jet protection)\\n\\n"
text += "GFCI/RCD: Trips in <30ms at 30mA\\n"
text += "leakage — prevents electrocution"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

# Plot 6: Safety budget summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
safety_items = ['GFCI/RCD', 'IP65 enclosure', 'Fuse/breaker', 'Ground wire', 'Strain relief', 'Cable ties']
costs_safety = [800, 500, 200, 300, 150, 100]
ax.barh(safety_items, costs_safety, color='#22c55e', alpha=0.8)
ax.set_xlabel('Estimated cost (₹)', color='white')
ax.set_title('Safety equipment budget', color='white', fontsize=11)
total_safety = sum(costs_safety)
ax.text(0.95, 0.05, f'Total: ₹{total_safety}', transform=ax.transAxes,
        color='#22c55e', fontsize=12, fontweight='bold', ha='right')

plt.tight_layout()
plt.show()

print("Power & Safety Summary")
print("=" * 55)
print(f"Installation: {n_leds} RGB LEDs at {P_per_led}W each")
print(f"Total wall power: {P_acdc_input:.0f}W")
print(f"Useful light: {P_light:.0f}W ({P_light/P_acdc_input*100:.1f}%)")
print(f"Total heat: {P_heat_total:.0f}W ({P_heat_total/P_acdc_input*100:.1f}%)")
print(f"Wall-to-light efficiency: {P_light/P_acdc_input*100:.1f}%")
print(f"Annual cost at 6h/day: ₹{annual_cost_led:.0f}")
print(f"Savings vs incandescent: ₹{annual_cost_inc - annual_cost_led:.0f}/year")`,
      challenge: 'Design a complete solar-powered festival lighting system for a remote Assam village without grid electricity. Size the solar panel, battery bank, and charge controller for 500 LEDs operating 6 hours per night with 2 days of autonomy. Calculate the total system cost and payback period vs diesel generator.',
      successHint: 'Power engineering for LED systems combines electrical theory, thermal management, safety codes, and economics. A well-designed system is efficient, safe, affordable, and sustainable — turning the physics of photon emission into a practical lighting solution.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: LED Circuit Design & Photometry
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (basic circuits & light)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for LED circuit design, photometry, and power analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
