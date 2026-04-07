import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DholDrumLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Chladni patterns — making vibrations visible',
      concept: `In 1787, Ernst Chladni sprinkled sand on a metal plate and bowed the edge with a violin bow. The sand collected along **nodal lines** — lines where the plate was not vibrating. The resulting patterns are stunningly geometric.

Chladni patterns are the 2D equivalent of what happens on a drum membrane. Different frequencies produce different patterns. Higher frequencies produce more complex patterns with more nodal lines.

For a square plate, the pattern depends on two mode numbers (m,n) and the frequency follows:
f_mn proportional to (m^2 + n^2)

For a circular plate (like a drum), the patterns are described by Bessel functions and the two mode numbers (m,n) we saw in Level 1.

Chladni patterns have practical applications:
- **Violin makers** sprinkle sand on the top plate of a violin to check the vibration modes. A well-made plate has specific, symmetric patterns.
- **Speaker design**: engineers visualize cone vibration to minimize distortion
- **Structural testing**: vibration patterns reveal stress concentrations in aircraft wings and bridges`,
      analogy: 'Chladni patterns are like watching wind blow across a sandy beach. The wind does not move sand everywhere equally — it creates ridges and valleys. On a vibrating plate, the sand collects where nothing moves (nodes) and clears away from where the vibration is strongest (antinodes). The pattern is a map of the vibration.',
      storyConnection: 'If the dhol\'s membrane were transparent and we could sprinkle fine sand on it while it thundered, we would see Chladni patterns — concentric circles and radial lines, dancing with every strike. The "voice within a voice" from the story would become visible as geometry.',
      checkQuestion: 'Chladni showed his experiments to Napoleon, who was so impressed he funded further research. Why would a military leader care about vibration patterns on metal plates?',
      checkAnswer: 'Napoleon was interested in the physics of sound and vibration for military applications: understanding how cannon barrels vibrate (affecting accuracy), how bridge structures resonate under marching troops (resonance can collapse bridges), and how ship hulls respond to ocean waves. Fundamental physics research has always had dual applications.',
      codeIntro: 'Generate Chladni patterns for a square plate at different frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Chladni patterns on a square plate
# Displacement: z(x,y) = cos(m*pi*x/L)*cos(n*pi*y/L) - cos(n*pi*x/L)*cos(m*pi*y/L)
# Sand collects where |z| is small

L = 1.0
x = np.linspace(0, L, 300)
y = np.linspace(0, L, 300)
X, Y = np.meshgrid(x, y)

modes = [(1, 2), (2, 3), (3, 4), (3, 5), (4, 5), (5, 6)]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Chladni Patterns on a Square Plate', color='white', fontsize=14)

for ax, (m, n) in zip(axes.flat, modes):
    Z = (np.cos(m * np.pi * X / L) * np.cos(n * np.pi * Y / L) -
         np.cos(n * np.pi * X / L) * np.cos(m * np.pi * Y / L))

    # Sand collects near nodes (where |Z| is small)
    sand = np.exp(-50 * Z**2)  # high where Z is near 0

    ax.set_facecolor('#111827')
    ax.imshow(sand, cmap='hot', extent=[0, L, 0, L], origin='lower')
    freq_ratio = m**2 + n**2
    ax.set_title(f'Mode ({m},{n}) — f ∝ {freq_ratio}', color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("Chladni patterns reveal:")
print("  Bright lines = nodal lines (no vibration, sand accumulates)")
print("  Dark areas = antinodes (maximum vibration, sand clears)")
print()
print("Pattern complexity increases with frequency:")
for m, n in modes:
    print(f"  Mode ({m},{n}): relative frequency ∝ {m**2 + n**2}")
print()
print("These patterns appear in every vibrating 2D surface:")
print("drum membranes, violin plates, speaker cones, and")
print("even the surface of stars (asteroseismology).")`,
      challenge: 'Generate a Chladni pattern for a circular plate instead of a square one. Use polar coordinates and Bessel function approximations: Z = cos(m*theta) * (1 - r^2) * cos(n*pi*r).',
      successHint: 'Chladni patterns are where physics becomes art. The same mathematics that describes drum vibrations creates patterns of remarkable beauty — evidence that nature\'s deep structure is geometric.',
    },
    {
      title: 'Modal analysis — decomposing complex vibrations',
      concept: `When you strike a drum, you don't excite just one mode — you excite many simultaneously. **Modal analysis** is the process of decomposing the complex vibration into its individual modes.

This is the vibrational equivalent of breaking white light into a rainbow with a prism. A prism decomposes light into its constituent wavelengths. A **Fourier transform** decomposes a complex vibration into its constituent frequencies.

The Fourier transform takes a signal in the **time domain** (amplitude vs. time) and converts it to the **frequency domain** (amplitude vs. frequency). The result is the **spectrum** — it tells you which modes are present and how strong each one is.

For drum analysis:
1. Strike the drum and record the sound (microphone -> digital audio)
2. Apply the Fast Fourier Transform (FFT) to the recording
3. The resulting spectrum shows peaks at each mode frequency
4. The height of each peak shows how strongly that mode was excited

Where you hit the drum changes which modes are excited:
- Centre hit: emphasizes mode (0,1) — deepest sound
- Off-centre hit: excites more asymmetric modes — brighter, more complex
- Edge hit: suppresses fundamental, emphasizes higher modes — thin, cracky sound`,
      analogy: 'Modal analysis is like listening to an orchestra and identifying each instrument. The full sound is complex (time domain). But a trained ear — or a Fourier transform — can separate the violins from the cellos from the trumpets (frequency domain). Each instrument is a "mode" contributing to the total sound.',
      storyConnection: 'The dhol\'s thunder contains "many voices" — the fundamental boom, the overtone ring, the attack crack. Modal analysis separates these voices mathematically, letting us understand exactly what makes the dhol sound the way it does. The many voices of the mythical drum become individual, measurable frequencies.',
      checkQuestion: 'If a drum is struck at exactly the centre, mode (1,1) — which has a nodal line through the centre — should not be excited at all. Why?',
      checkAnswer: 'Mode (1,1) has zero displacement at the centre (it is a node point). Striking at a node cannot excite that mode because the input force and the mode shape are orthogonal there. This is why centre hits sound "deeper" — they preferentially excite the symmetric modes (0,1), (0,2), etc. and suppress the asymmetric modes that add brightness.',
      codeIntro: 'Simulate a drum strike, compute its FFT spectrum, and show how strike position affects the spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate drum sound with multiple modes
sample_rate = 44100  # Hz
duration = 1.0  # seconds
t = np.arange(0, duration, 1/sample_rate)

# Circular membrane mode frequencies (relative to fundamental)
mode_ratios = [1.000, 1.594, 2.136, 2.296, 2.653, 2.918, 3.156, 3.501]
mode_labels = ['(0,1)', '(1,1)', '(2,1)', '(0,2)', '(3,1)', '(1,2)', '(4,1)', '(2,2)']

f_fundamental = 100  # Hz

def drum_sound(strike_position='centre', fundamental=100):
    """Generate drum sound for different strike positions."""
    signal = np.zeros_like(t)

    if strike_position == 'centre':
        amplitudes = [1.0, 0.0, 0.0, 0.6, 0.0, 0.3, 0.0, 0.15]
        decays = [15, 20, 25, 20, 30, 25, 35, 30]
    elif strike_position == 'half_radius':
        amplitudes = [0.8, 0.6, 0.4, 0.4, 0.3, 0.25, 0.2, 0.15]
        decays = [15, 20, 25, 20, 30, 25, 35, 30]
    else:  # edge
        amplitudes = [0.3, 0.8, 0.7, 0.2, 0.6, 0.5, 0.4, 0.3]
        decays = [20, 18, 22, 25, 20, 22, 25, 28]

    for ratio, amp, decay in zip(mode_ratios, amplitudes, decays):
        freq = fundamental * ratio
        signal += amp * np.sin(2 * np.pi * freq * t) * np.exp(-decay * t)

    return signal

# Generate three different strike positions
centre = drum_sound('centre')
mid = drum_sound('half_radius')
edge = drum_sound('edge')

# Compute FFTs
def compute_spectrum(signal, sr):
    N = len(signal)
    fft = np.abs(np.fft.rfft(signal)) / N
    freqs = np.fft.rfftfreq(N, 1/sr)
    return freqs, fft

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

signals = [('Centre strike', centre, '#f59e0b'),
           ('Half-radius strike', mid, '#22c55e'),
           ('Edge strike', edge, '#3b82f6')]

for i, (title, signal, color) in enumerate(signals):
    # Waveform (first 50ms)
    ax = axes[0, i]
    ax.set_facecolor('#111827')
    mask = t < 0.05
    ax.plot(t[mask] * 1000, signal[mask], color=color, linewidth=1)
    ax.fill_between(t[mask] * 1000, signal[mask], alpha=0.2, color=color)
    ax.set_xlabel('Time (ms)', color='white')
    ax.set_ylabel('Amplitude', color='white')
    ax.set_title(title, color=color, fontsize=11)
    ax.tick_params(colors='gray')

    # Spectrum
    ax = axes[1, i]
    ax.set_facecolor('#111827')
    freqs, spectrum = compute_spectrum(signal, sample_rate)
    ax.plot(freqs, spectrum, color=color, linewidth=1)
    ax.fill_between(freqs, spectrum, alpha=0.2, color=color)
    ax.set_xlim(0, 500)
    ax.set_xlabel('Frequency (Hz)', color='white')
    ax.set_ylabel('Magnitude', color='white')
    ax.tick_params(colors='gray')

    # Mark modes
    for ratio, label in zip(mode_ratios, mode_labels):
        f = f_fundamental * ratio
        if f < 500:
            ax.axvline(f, color='gray', linestyle=':', linewidth=0.3)
            ax.text(f, max(spectrum) * 0.95, label, color='gray', fontsize=6, ha='center', rotation=90)

plt.tight_layout()
plt.show()

print("Modal analysis results:")
print("  Centre: strong (0,1) and (0,2) — deep, boomy")
print("  Half-radius: all modes present — full, balanced")
print("  Edge: strong (1,1), (2,1) — thin, bright, cracky")
print()
print("This is why drummers vary strike position for different sounds.")
print("The Fourier transform makes these differences quantifiable.")`,
      challenge: 'Apply a simple low-pass filter (remove frequencies above 200 Hz) to the edge strike. How does the sound change? This is what a bass drum beater pad does — it dampens high frequencies.',
      successHint: 'The FFT is one of the most important algorithms in science and engineering. It turns complex, time-varying signals into clean frequency components. From drum analysis to medical imaging to WiFi — the Fourier transform is everywhere.',
    },
    {
      title: 'Bessel functions simplified — the mathematics of drums',
      concept: `The vibration modes of a circular drum membrane are described by **Bessel functions** — a family of mathematical functions discovered by Friedrich Bessel in 1824.

For a drum, the displacement at any point is:
z(r, theta, t) = J_m(k_mn * r) * cos(m * theta) * cos(omega_mn * t)

Where:
- J_m is the Bessel function of the first kind, order m
- k_mn is determined by the condition that J_m(k_mn * R) = 0 (the membrane is fixed at the rim)
- m = number of nodal diameters
- n = nth zero of J_m (number of nodal circles + 1)

What Bessel functions look like:
- J_0(x): starts at 1, oscillates with decreasing amplitude (like a dampened cosine). Its zeros are at x = 2.405, 5.520, 8.654...
- J_1(x): starts at 0, rises, then oscillates. Zeros at x = 3.832, 7.016, 10.174...
- J_2(x): starts at 0 more slowly, then oscillates. Zeros at x = 5.136, 8.417, 11.620...

The frequency ratios we used in Level 1 (1.000, 1.594, 2.136...) come directly from these Bessel function zeros. They are not arbitrary — they are determined by the mathematics of waves on circular membranes.`,
      analogy: 'Bessel functions are like the sine and cosine functions, but for circles instead of straight lines. Sine describes vibrations on a string (1D). Bessel functions describe vibrations on a circular membrane (2D). They oscillate, they have zeros, and they form the building blocks for more complex patterns.',
      storyConnection: 'The dhol\'s complex sound — the thunder with many voices — exists because Bessel functions have inharmonic zeros. If the zeros were at 1, 2, 3, 4... the dhol would sound like a pitched instrument. Instead, the zeros are at 1.000, 1.594, 2.136... giving the dhol its characteristic unpitched, thunderous quality. The mathematics of Bessel encoded the thunder of the story.',
      checkQuestion: 'The tabla has near-harmonic overtones (1, 2, 3, 4...) despite being a circular membrane. How does the syahi paste accomplish this mathematically?',
      checkAnswer: 'The syahi adds mass to the centre, changing the effective density distribution from uniform to radially varying. This changes the wave equation from the standard Bessel equation to a modified one with different boundary conditions. The zeros of the modified equation can be tuned (by adjusting the mass distribution) to fall at approximately integer ratios. The tabla maker is solving a boundary-value problem by adjusting material parameters.',
      codeIntro: 'Plot Bessel functions and show how their zeros determine drum mode frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bessel functions (approximate using series expansion)
def bessel_j(n, x, terms=20):
    """Approximate Bessel function J_n(x) using series expansion."""
    result = np.zeros_like(x, dtype=float)
    for k in range(terms):
        num = (-1)**k * (x/2)**(2*k + n)
        denom = 1.0
        for i in range(1, k+1):
            denom *= i
        for i in range(1, k+n+1):
            denom *= i
        result += num / denom
    return result

x = np.linspace(0, 15, 500)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot Bessel functions J0, J1, J2
ax = axes[0, 0]
ax.set_facecolor('#111827')

colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444']
zeros_data = {
    0: [2.405, 5.520, 8.654, 11.792],
    1: [3.832, 7.016, 10.174],
    2: [5.136, 8.417, 11.620],
}

for n, c in zip([0, 1, 2], colors[:3]):
    y = bessel_j(n, x)
    ax.plot(x, y, linewidth=2, color=c, label=f'J_{n}(x)')
    # Mark zeros
    for z in zeros_data.get(n, []):
        ax.plot(z, 0, 'o', color=c, markersize=6)
        ax.annotate(f'{z:.3f}', xy=(z, 0), xytext=(z, 0.1),
                    color=c, fontsize=7, ha='center')

ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('x', color='white')
ax.set_ylabel('J_n(x)', color='white')
ax.set_title('Bessel Functions of the First Kind', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Mode frequency table
ax = axes[0, 1]
ax.set_facecolor('#111827')

mode_data = [
    ('(0,1)', 2.405, 1.000),
    ('(1,1)', 3.832, 1.594),
    ('(2,1)', 5.136, 2.136),
    ('(0,2)', 5.520, 2.296),
    ('(3,1)', 6.380, 2.653),
    ('(1,2)', 7.016, 2.918),
    ('(4,1)', 7.588, 3.156),
    ('(2,2)', 8.417, 3.501),
]

modes = [m[0] for m in mode_data]
zeros = [m[1] for m in mode_data]
ratios = [m[2] for m in mode_data]

bars = ax.barh(modes, ratios, color=plt.cm.viridis(np.linspace(0.2, 0.9, len(modes))))
ax.set_xlabel('Frequency ratio (relative to fundamental)', color='white')
ax.set_title('Drum Mode Frequencies from Bessel Zeros', color='white', fontsize=11)
ax.tick_params(colors='gray')

for bar, z, r in zip(bars, zeros, ratios):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            f'zero={z:.3f}, ratio={r:.3f}', va='center', color='white', fontsize=8)

# Harmonic vs inharmonic comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')

harmonic = list(range(1, 9))
drum_ratios = [r for _, _, r in mode_data]

x_pos = np.arange(8)
w = 0.35
ax.bar(x_pos - w/2, harmonic, w, color='#3b82f6', label='Harmonic (string)')
ax.bar(x_pos + w/2, drum_ratios, w, color='#f59e0b', label='Drum (Bessel zeros)')
ax.set_xticks(x_pos)
ax.set_xticklabels([f'Mode {i+1}' for i in range(8)], color='white', fontsize=8)
ax.set_ylabel('Frequency ratio', color='white')
ax.set_title('String (harmonic) vs Drum (inharmonic)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Radial mode shapes
ax = axes[1, 1]
ax.set_facecolor('#111827')
r_range = np.linspace(0, 1, 200)

for n_mode, zero_val, c in [(1, 2.405, '#f59e0b'), (2, 5.520, '#22c55e'), (3, 8.654, '#3b82f6')]:
    shape = bessel_j(0, zero_val * r_range)
    ax.plot(r_range, shape, linewidth=2, color=c, label=f'J_0 mode n={n_mode}')
    ax.fill_between(r_range, shape, alpha=0.1, color=c)

ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Radial position (0=centre, 1=rim)', color='white')
ax.set_ylabel('Displacement', color='white')
ax.set_title('Radial Mode Shapes (J_0)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bessel function zeros determine drum frequencies:")
print("  f_mn = (zero_mn / (2*pi*R)) * sqrt(T/sigma)")
print()
for mode, zero, ratio in mode_data:
    print(f"  Mode {mode}: zero = {zero:.3f}, freq ratio = {ratio:.3f}")`,
      challenge: 'The ratio between the first two zeros of J_0 is 5.520/2.405 = 2.296. For a harmonic string, the ratio would be 2.000. The difference (0.296) is what makes drums sound "unpitched." Calculate all ratios and find which one is closest to an integer.',
      successHint: 'Bessel functions are the mathematical signature of circular geometry in physics. They appear in drum acoustics, electromagnetic waveguides, heat conduction in cylinders, and quantum mechanics of the hydrogen atom. The dhol\'s thunder is written in the language of Bessel.',
    },
    {
      title: 'Electronic drums and triggering — digital percussion',
      concept: `Electronic drums convert the physical act of striking into a digital signal, then generate the sound electronically.

The chain:
1. **Trigger pad**: a rubber or mesh surface with a **piezoelectric sensor** underneath. When struck, the sensor generates a voltage proportional to the force.
2. **Trigger-to-MIDI converter**: the analog voltage is converted to a MIDI (Musical Instrument Digital Interface) message: which pad was hit, how hard (velocity 0-127), and the timestamp.
3. **Sound module / synthesizer**: receives the MIDI message and plays back a sampled or synthesized drum sound through speakers or headphones.

Key technologies:
- **Piezoelectric sensors**: crystals (like PZT ceramics) that generate voltage when deformed. The faster and harder the deformation, the higher the voltage. Perfect for detecting drum impacts.
- **Cross-talk rejection**: when one pad is hit, vibrations travel through the rack to other pads. The module must distinguish real hits from transmitted vibrations.
- **Positional sensing**: some pads detect WHERE on the surface you hit (centre vs. edge), triggering different sounds.
- **Mesh heads**: fabric drum heads stretched over a frame. They feel like real drums and can be tuned, but produce almost no acoustic sound — all sound comes from the module.`,
      analogy: 'An electronic drum is like a touch-screen keyboard. The physical input (finger press / drumstick strike) is converted to an electrical signal, then to a digital event, then to audio output. The physical surface feels satisfying to interact with, but the actual sound is generated entirely in software. The trigger pad is just a very fast button.',
      storyConnection: 'The dhol\'s thunder was a gift from the gods — a sound that could not be replicated. Electronic drums challenge this: they can replicate any drum sound, including the dhol. A dhol sample loaded into an electronic module lets anyone play "the thunder" anywhere. Is this democratization of sound, or the loss of something sacred?',
      checkQuestion: 'Why do electronic drums use piezoelectric sensors instead of microphones to detect hits?',
      checkAnswer: 'Microphones would pick up ambient sound (other instruments, audience, HVAC noise) along with the drum hit. Piezoelectric sensors respond only to physical impact on the pad — they are immune to airborne sound. This gives clean trigger signals even on a noisy stage. It is the same reason seismographs use accelerometers instead of microphones to detect earthquakes.',
      codeIntro: 'Simulate the electronic drum signal chain: piezo hit -> voltage -> MIDI -> sound synthesis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
t = np.arange(0, 0.5, 1/sample_rate)

# 1. Piezoelectric sensor response to a drum hit
# Impact creates a short voltage spike that decays quickly
hit_force = 0.8  # normalized (0-1)
piezo_response = hit_force * np.exp(-200 * t) * np.sin(2 * np.pi * 500 * t)
piezo_response *= (t < 0.03)  # signal dies after ~30ms

# 2. Trigger detection: find when signal crosses threshold
threshold = 0.1
trigger_time = t[np.argmax(piezo_response > threshold)] if any(piezo_response > threshold) else None
midi_velocity = int(min(127, hit_force * 127))

# 3. Synthesized drum sound (Karplus-Strong-like for simplicity)
freq = 100  # dhol fundamental
harmonics = [(1.0, 1.000, 15), (0.5, 1.594, 20), (0.3, 2.136, 25),
             (0.6, 2.296, 18), (0.2, 2.653, 30)]

synth_sound = np.zeros_like(t)
for amp, ratio, decay in harmonics:
    synth_sound += amp * hit_force * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-decay * t)

# Add noise burst for attack
noise_burst = 0.5 * hit_force * np.random.randn(len(t)) * np.exp(-100 * t)
synth_sound += noise_burst

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Piezo response
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(t * 1000, piezo_response, color='#f59e0b', linewidth=1)
ax.fill_between(t * 1000, piezo_response, alpha=0.2, color='#f59e0b')
ax.axhline(threshold, color='#ef4444', linestyle='--', linewidth=1, label=f'Threshold: {threshold}')
if trigger_time is not None:
    ax.axvline(trigger_time * 1000, color='#22c55e', linestyle='--', linewidth=1, label=f'Trigger: {trigger_time*1000:.1f}ms')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage', color='white')
ax.set_title('1. Piezoelectric Sensor Response', color='#f59e0b', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlim(0, 50)

# MIDI message visualization
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Show velocity curve: how hit force maps to MIDI velocity
forces = np.linspace(0, 1, 100)
# Typical velocity curve (logarithmic)
linear_vel = forces * 127
log_vel = np.log10(forces * 9 + 1) * 127
exp_vel = (forces ** 0.5) * 127

ax.plot(forces, linear_vel, color='#3b82f6', linewidth=2, label='Linear')
ax.plot(forces, log_vel, color='#22c55e', linewidth=2, label='Logarithmic')
ax.plot(forces, exp_vel, color='#f59e0b', linewidth=2, label='Square root')
ax.plot(hit_force, midi_velocity, 'o', color='#ef4444', markersize=10, label=f'This hit: v={midi_velocity}')
ax.set_xlabel('Hit force (normalized)', color='white')
ax.set_ylabel('MIDI velocity (0-127)', color='white')
ax.set_title('2. Force-to-Velocity Mapping', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Synthesized sound
ax = axes[1, 0]
ax.set_facecolor('#111827')
mask = t < 0.1
ax.plot(t[mask] * 1000, synth_sound[mask], color='#22c55e', linewidth=0.5)
ax.fill_between(t[mask] * 1000, synth_sound[mask], alpha=0.2, color='#22c55e')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('3. Synthesized Drum Sound', color='#22c55e', fontsize=11)
ax.tick_params(colors='gray')

# Complete signal chain diagram
ax = axes[1, 1]
ax.set_facecolor('#111827')
steps = ['Hit pad\\n(physical)', 'Piezo\\n(voltage)', 'ADC\\n(digital)', 'MIDI\\n(message)', 'Synth\\n(audio)', 'Speaker\\n(sound)']
step_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

for i, (step, sc) in enumerate(zip(steps, step_colors)):
    y = len(steps) - i
    ax.barh(y, 1, color=sc, alpha=0.6, height=0.6)
    ax.text(0.5, y, step, color='white', fontsize=10, ha='center', va='center', fontweight='bold')
    if i < len(steps) - 1:
        ax.annotate('', xy=(0.5, y - 0.4), xytext=(0.5, y - 0.6),
                     arrowprops=dict(arrowstyle='->', color='white', linewidth=2))
    # Timing
    latencies = [0, 0.5, 0.1, 0.05, 1.0, 0.5]
    ax.text(1.1, y, f'+{latencies[i]:.1f}ms', color='gray', fontsize=8, va='center')

ax.set_xlim(-0.1, 1.5)
ax.set_title('4. Electronic Drum Signal Chain', color='white', fontsize=11)
ax.axis('off')

plt.tight_layout()
plt.show()

total_latency = sum([0, 0.5, 0.1, 0.05, 1.0, 0.5])
print(f"Total system latency: ~{total_latency:.1f} ms")
print(f"Human perception threshold: ~10 ms")
print(f"Electronic drums must stay under 10 ms to feel 'real'.")
print()
print(f"This hit: force={hit_force:.1f}, MIDI velocity={midi_velocity}")
print(f"Trigger detected at: {trigger_time*1000:.1f} ms after impact")`,
      challenge: 'Add a "ghost note" — a very soft hit (force=0.1) that should produce MIDI velocity ~13. Does the threshold detection still work? What if noise pushes the piezo above the threshold?',
      successHint: 'Electronic drums are a complete signal processing pipeline: analog sensor -> digital conversion -> symbolic representation (MIDI) -> synthesis -> audio output. Understanding this chain is an introduction to embedded systems, DSP, and audio engineering.',
    },
    {
      title: 'Audio synthesis of drums — creating sound from math',
      concept: `Instead of recording real drums (sampling), we can **synthesize** drum sounds from mathematical equations. This is how drum machines and synthesizers work.

Three main synthesis methods for percussion:

**1. Subtractive synthesis**: start with noise (all frequencies), filter out unwanted frequencies, shape the volume over time.
- Kick drum: low-pass filtered noise + pitch envelope (pitch drops rapidly from ~150 Hz to ~50 Hz)
- Snare: bandpass filtered noise + tonal component at ~200 Hz
- Hi-hat: high-pass filtered noise with very short decay

**2. FM synthesis** (frequency modulation): one oscillator (modulator) controls the frequency of another (carrier). Produces metallic, bell-like tones perfect for toms and cymbals.

**3. Physical modelling**: simulate the actual physics of the membrane and body. Use the wave equation, Bessel functions, and boundary conditions. Most realistic but most computationally expensive.

The key parameter for all percussion synthesis is the **envelope** — how the sound's volume changes over time:
- **Attack**: how quickly the sound reaches maximum (drums: very fast, ~1 ms)
- **Decay**: how quickly it falls from maximum (drums: fast, ~50-500 ms)
- **Sustain**: steady-state level (drums: usually zero)
- **Release**: how sound dies after the note ends (drums: merged with decay)`,
      analogy: 'Drum synthesis is like cooking: you start with raw ingredients (oscillators, noise generators), apply techniques (filtering, modulation, enveloping), and produce a dish (the drum sound). A good synthesist is like a good chef — they know which ingredients and techniques produce which results, and can recreate any "dish" from scratch.',
      storyConnection: 'The dhol\'s thunder was gifted by the gods and could not be replicated. Drum synthesis says otherwise: with the right mathematical recipe (Bessel function mode frequencies, exponential decay envelopes, noise bursts for attack), you can recreate any drum sound digitally. The thunder can be computed.',
      checkQuestion: 'Why does a synthesized kick drum need its pitch to drop rapidly at the start (pitch envelope)?',
      checkAnswer: 'When a real bass drum is struck, the membrane initially vibrates at a higher frequency (the impact excites higher modes briefly) before settling into its fundamental. This pitch drop from ~150 Hz to ~50 Hz in the first 10-20 ms gives the "punch" or "attack" of the kick. Without the pitch envelope, the synthesized kick sounds flat and lifeless — like a test tone, not a drum.',
      codeIntro: 'Synthesize drum sounds from scratch: kick, snare, and hi-hat using subtractive synthesis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
duration = 0.5

def synthesize_kick(duration=0.5, sr=44100):
    t = np.arange(0, duration, 1/sr)
    # Pitch envelope: starts at 150 Hz, drops to 50 Hz
    pitch = 50 + 100 * np.exp(-30 * t)
    # Phase from instantaneous frequency
    phase = 2 * np.pi * np.cumsum(pitch) / sr
    # Sine oscillator with pitch envelope
    osc = np.sin(phase)
    # Amplitude envelope
    amp = np.exp(-8 * t)
    # Add sub-bass click
    click = 0.5 * np.exp(-200 * t) * np.sin(2 * np.pi * 3000 * t)
    return (osc * amp + click) * 0.8, t

def synthesize_snare(duration=0.3, sr=44100):
    t = np.arange(0, duration, 1/sr)
    # Tonal component (body)
    body = np.sin(2 * np.pi * 200 * t) * np.exp(-20 * t) * 0.6
    # Noise component (snare wires)
    noise = np.random.randn(len(t)) * np.exp(-15 * t) * 0.4
    return body + noise, t

def synthesize_hihat(duration=0.1, sr=44100):
    t = np.arange(0, duration, 1/sr)
    # Metallic noise (band-limited)
    noise = np.random.randn(len(t))
    # High-pass effect: differentiate
    filtered = np.diff(noise, prepend=0) * 0.8
    # Very short envelope
    amp = np.exp(-50 * t)
    return filtered * amp * 0.5, t

# Generate sounds
kick, t_k = synthesize_kick()
snare, t_s = synthesize_snare()
hihat, t_h = synthesize_hihat()

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

drums = [('Kick Drum', kick, t_k, '#ef4444'),
         ('Snare Drum', snare, t_s, '#f59e0b'),
         ('Hi-Hat', hihat, t_h, '#22c55e')]

for i, (name, sound, t, color) in enumerate(drums):
    # Waveform
    ax = axes[i, 0]
    ax.set_facecolor('#111827')
    ax.plot(t * 1000, sound, color=color, linewidth=0.5)
    ax.fill_between(t * 1000, sound, alpha=0.2, color=color)
    ax.set_xlabel('Time (ms)', color='white')
    ax.set_ylabel('Amplitude', color='white')
    ax.set_title(f'{name} — Waveform', color=color, fontsize=11)
    ax.tick_params(colors='gray')

    # Spectrum
    ax = axes[i, 1]
    ax.set_facecolor('#111827')
    N = len(sound)
    fft = np.abs(np.fft.rfft(sound)) / N
    freqs = np.fft.rfftfreq(N, 1/sample_rate)
    ax.plot(freqs, fft, color=color, linewidth=1)
    ax.fill_between(freqs, fft, alpha=0.2, color=color)
    ax.set_xlim(0, 5000 if name == 'Hi-Hat' else 1000)
    ax.set_xlabel('Frequency (Hz)', color='white')
    ax.set_ylabel('Magnitude', color='white')
    ax.set_title(f'{name} — Spectrum', color=color, fontsize=11)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Synthesis recipes:")
print()
print("  Kick: sine wave + pitch envelope (150->50 Hz) + click")
print("  Snare: sine (200 Hz) + filtered noise (snare wires)")
print("  Hi-hat: high-pass noise + very short envelope")
print()
print("Every drum machine since the Roland TR-808 (1980)")
print("uses variations of these techniques.")
print("The TR-808 kick is arguably the most influential")
print("drum sound in music history.")`,
      challenge: 'Modify the kick synthesis to create a dhol-like sound: lower the pitch envelope to 30-80 Hz, add a second membrane resonance at 120 Hz, and increase the decay time. How does it compare to the simple kick?',
      successHint: 'Drum synthesis is where physics meets creativity. Every parameter (frequency, decay, envelope shape) has a physical meaning AND a musical effect. Understanding both lets you design any percussive sound imaginable.',
    },
    {
      title: 'Acoustic design of performance spaces — room acoustics',
      concept: `The same dhol sounds different in a field, a small room, and a concert hall. **Room acoustics** explains why, and lets architects design spaces that sound great.

Key concepts:
- **Reverberation time (RT60)**: how long (in seconds) a sound takes to decay by 60 dB after the source stops. A concert hall: 1.5-2.5s. A recording studio: 0.3-0.5s. An open field: 0s (no reflections).
- **Sabine equation**: RT60 = 0.161 * V / A, where V = room volume (m^3) and A = total absorption (sabins)
- **Absorption coefficient**: each surface absorbs a fraction of sound. Concrete: ~0.02 (reflects 98%). Carpet: ~0.40. Acoustic foam: ~0.80. People in seats: ~0.50.
- **Early reflections**: sound that bounces once off a wall and reaches the listener within 50ms of the direct sound. These reinforce the direct sound and add "presence."
- **Late reflections**: sound that bounces many times, arriving >50ms later. These create the "reverb tail" — the sense of space.

For percussion in NE India:
- Open Bihu fields: no reverberation, sound is direct and clear (the audience surrounds the performers)
- Namghar (prayer halls): moderate reverberation from wooden walls
- Modern auditoriums: carefully designed RT60 for the specific music type`,
      analogy: 'Room acoustics is like throwing a ball in different rooms. In an open field, the ball flies away and never returns (no reflections). In a small bathroom, the ball bounces back immediately (short reverb). In a cathedral, the ball bounces many times before stopping (long reverb). Sound does exactly the same thing, just much faster.',
      storyConnection: 'The dhol\'s thunder in the story "echoed across the valley, bouncing from mountain to mountain." This is real acoustics: sound reflecting off large surfaces (mountains, valley walls) with delays proportional to distance. The story describes natural reverberation — the same physics that architects design into concert halls.',
      checkQuestion: 'Why do you sound better singing in the shower than in the living room?',
      checkAnswer: 'The shower is a small, hard-surfaced room (tile, glass) that reflects almost all sound. This creates dense, short reverberation that adds fullness and sustain to your voice — essentially a natural reverb effect. It also smooths out pitch imperfections. The living room has soft surfaces (carpet, furniture, curtains) that absorb sound, giving you a "dry," honest representation of your voice.',
      codeIntro: 'Simulate room acoustics using the Sabine equation and model reverb decay for different spaces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sabine equation: RT60 = 0.161 * V / A
# A = sum of (surface_area * absorption_coefficient)

def rt60(volume, surfaces):
    """Calculate RT60 from volume and surface data."""
    A = sum(area * alpha for area, alpha in surfaces)
    return 0.161 * volume / A if A > 0 else float('inf')

# Define spaces
spaces = {
    'Open Bihu field': {
        'volume': 100000,  # effectively infinite
        'surfaces': [(10000, 0.99)],  # ground absorbs almost everything (no walls)
        'color': '#22c55e'
    },
    'Small practice room': {
        'volume': 50,  # 4x4x3 metres
        'surfaces': [(32, 0.15), (16, 0.40), (16, 0.05)],  # walls, carpet, ceiling
        'color': '#3b82f6'
    },
    'Namghar (wood hall)': {
        'volume': 500,  # 10x10x5 metres
        'surfaces': [(200, 0.10), (100, 0.30), (100, 0.08), (50, 0.50)],  # wood walls, floor, ceiling, people
        'color': '#f59e0b'
    },
    'Concert hall': {
        'volume': 15000,  # large hall
        'surfaces': [(2000, 0.08), (1000, 0.40), (1000, 0.06), (500, 0.50)],
        'color': '#a855f7'
    },
    'Concrete warehouse': {
        'volume': 5000,
        'surfaces': [(1500, 0.02), (500, 0.03), (500, 0.02)],  # all hard surfaces
        'color': '#ef4444'
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# RT60 comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(spaces.keys())
rt60_values = [rt60(s['volume'], s['surfaces']) for s in spaces.values()]
colors = [s['color'] for s in spaces.values()]
bars = ax.barh(names, rt60_values, color=colors, alpha=0.8)
ax.set_xlabel('RT60 (seconds)', color='white')
ax.set_title('Reverberation Time by Space', color='white', fontsize=13)
ax.tick_params(colors='gray')
for bar, val in zip(bars, rt60_values):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{val:.2f}s', va='center', color='white', fontsize=10)

# Reverb decay curves
ax = axes[0, 1]
ax.set_facecolor('#111827')
time = np.linspace(0, 5, 500)

for name, data in spaces.items():
    rt = rt60(data['volume'], data['surfaces'])
    if rt > 0 and rt < 100:
        decay = 60 * (1 - time / rt)
        decay = np.clip(decay, -60, 0)
        ax.plot(time, decay, color=data['color'], linewidth=2, label=f'{name} ({rt:.1f}s)')

ax.axhline(-60, color='gray', linestyle=':', linewidth=0.5)
ax.text(4.5, -58, '-60 dB (RT60)', color='gray', fontsize=8)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Sound level (dB)', color='white')
ax.set_title('Sound Decay After Drum Strike', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
ax.set_ylim(-70, 5)

# Absorption coefficients by material
ax = axes[1, 0]
ax.set_facecolor('#111827')
materials = ['Concrete', 'Glass', 'Wood\\npanel', 'Carpet', 'Acoustic\\nfoam', 'Audience\\n(people)']
alphas = [0.02, 0.05, 0.10, 0.40, 0.80, 0.50]
bar_colors = plt.cm.RdYlGn(np.array(alphas))
bars = ax.bar(materials, alphas, color=bar_colors)
ax.set_ylabel('Absorption coefficient', color='white')
ax.set_title('Sound Absorption by Material', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=8)
for bar, a in zip(bars, alphas):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{a:.2f}', ha='center', color='white', fontsize=9)

# Impulse response simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
t_ir = np.linspace(0, 2, 10000)

# Simulated impulse response (simplified)
# Direct sound at t=0
ir = np.zeros_like(t_ir)
ir[0] = 1.0  # direct

# Early reflections (discrete echoes)
np.random.seed(42)
for delay_ms in [15, 22, 35, 42, 55]:
    idx = int(delay_ms / 1000 * 10000 / 2)
    if idx < len(ir):
        ir[idx] = 0.5 * np.random.uniform(0.3, 0.8)

# Late reverb (exponential noise decay)
reverb_noise = np.random.randn(len(t_ir)) * np.exp(-3 * t_ir) * 0.1
ir += reverb_noise * (t_ir > 0.06)

ax.plot(t_ir * 1000, ir, color='#f59e0b', linewidth=0.5)
ax.fill_between(t_ir * 1000, ir, alpha=0.3, color='#f59e0b')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Room Impulse Response (Namghar)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xlim(0, 500)

ax.annotate('Direct\\nsound', xy=(0, 1), xytext=(20, 0.8), color='white', fontsize=8,
            arrowprops=dict(arrowstyle='->', color='white'))
ax.annotate('Early\\nreflections', xy=(35, 0.4), xytext=(80, 0.6), color='white', fontsize=8,
            arrowprops=dict(arrowstyle='->', color='white'))
ax.annotate('Late reverb\\n(diffuse)', xy=(200, 0.05), xytext=(250, 0.3), color='white', fontsize=8,
            arrowprops=dict(arrowstyle='->', color='white'))

plt.tight_layout()
plt.show()

print("Room acoustics design:")
print("  Speech clarity: RT60 = 0.5-1.0s")
print("  Orchestra music: RT60 = 1.5-2.5s")
print("  Percussion ensemble: RT60 = 0.8-1.2s")
print("  Recording studio: RT60 = 0.2-0.4s")
print()
print("The Bihu dhol is designed for outdoor performance (RT60 ≈ 0)")
print("Its powerful, low-frequency sound carries across open fields")
print("without relying on room reflections for support.")`,
      challenge: 'Design a room for a dhol ensemble: 200 m^3 volume, target RT60 of 1.0 seconds. Using the Sabine equation, calculate the total absorption needed, then choose materials from the chart to achieve it.',
      successHint: 'Room acoustics closes the loop from drum physics to listener experience. The sound of the dhol is not just in the membrane and the body — it is in the space. Every room is part of the instrument. From Chladni patterns to Bessel functions to synthesis to room acoustics — you have traced the complete physics of percussion.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 percussion physics concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for vibration analysis and audio synthesis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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