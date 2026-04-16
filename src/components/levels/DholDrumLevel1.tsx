import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DholDrumLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'How drums make sound — vibrating membranes',
      concept: `In the story, the dhol drum gets its thunder from the sky itself — a rumble so deep it makes the earth tremble. In physics, a drum makes sound through a simple but powerful mechanism:

1. **Strike**: a stick (or hand) hits the drum membrane
2. **Vibrate**: the membrane oscillates back and forth rapidly
3. **Push air**: the vibrating membrane pushes and pulls the air molecules next to it
4. **Sound wave**: these pushes and pulls travel outward through the air as a compression wave
5. **Hear**: the wave reaches your ear, vibrates your eardrum, and your brain interprets it as sound

The key physics: **sound is a pressure wave in air**. When the drum membrane pushes forward, it compresses the air (high pressure). When it pulls back, it creates a rarefaction (low pressure). These alternating compressions travel at ~343 metres per second (the speed of sound in air at 20°C).

The dhol produces its characteristic deep, powerful sound because:
- It has a large diameter membrane (~40 cm), which vibrates slowly (low frequency = deep pitch)
- It has a barrel-shaped body that amplifies the sound
- It is struck with a heavy stick, which transfers more energy to the membrane`,
      analogy: 'A drum is like dropping a stone into a still pond. The stone (drumstick) hits the water (membrane), creating ripples (sound waves) that spread outward in all directions. Bigger stone = bigger ripples. Bigger membrane = lower-pitched sound. The pond carries the ripples; the air carries the sound.',
      storyConnection: 'The story says the dhol\'s thunder comes from a gift of the sky god — the sound is so powerful it reaches across villages. In physics, this is a large membrane (low frequency travels far) struck with great force (high amplitude). Low-frequency sounds travel farther because they diffract around obstacles and lose energy more slowly.',
      checkQuestion: 'Why can you hear a dhol from much farther away than a small tabla? Both are drums.',
      checkAnswer: 'The dhol produces lower frequencies (larger membrane) and higher amplitude (heavier stick, larger body). Low-frequency sound waves diffract more around obstacles (trees, buildings) and are absorbed less by the atmosphere. High-frequency sounds from a tabla are more directional and decay faster. This is also why you hear the bass before the treble from a distant concert.',
      codeIntro: 'Visualize sound wave propagation from a drum strike.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sound wave from a drum strike
time = np.linspace(0, 0.05, 2000)  # 50 milliseconds

# Dhol: low frequency (~100 Hz), high amplitude
freq_dhol = 100  # Hz
amp_dhol = 1.0
decay_dhol = 30  # decay rate
dhol_wave = amp_dhol * np.sin(2 * np.pi * freq_dhol * time) * np.exp(-decay_dhol * time)

# Tabla: higher frequency (~250 Hz), lower amplitude
freq_tabla = 250
amp_tabla = 0.6
decay_tabla = 50
tabla_wave = amp_tabla * np.sin(2 * np.pi * freq_tabla * time) * np.exp(-decay_tabla * time)

# Add harmonics for realism
dhol_wave += 0.5 * np.sin(2 * np.pi * 200 * time) * np.exp(-40 * time)
dhol_wave += 0.3 * np.sin(2 * np.pi * 300 * time) * np.exp(-50 * time)
tabla_wave += 0.3 * np.sin(2 * np.pi * 500 * time) * np.exp(-60 * time)
tabla_wave += 0.2 * np.sin(2 * np.pi * 750 * time) * np.exp(-70 * time)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Dhol waveform
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(time * 1000, dhol_wave, color='#f59e0b', linewidth=1)
ax.fill_between(time * 1000, dhol_wave, alpha=0.2, color='#f59e0b')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Dhol Waveform (deep, powerful)', color='#f59e0b', fontsize=11)
ax.tick_params(colors='gray')

# Tabla waveform
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(time * 1000, tabla_wave, color='#3b82f6', linewidth=1)
ax.fill_between(time * 1000, tabla_wave, alpha=0.2, color='#3b82f6')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Tabla Waveform (crisp, tonal)', color='#3b82f6', fontsize=11)
ax.tick_params(colors='gray')

# Frequency spectrum (simplified)
ax = axes[1, 0]
ax.set_facecolor('#111827')
freqs = np.linspace(0, 1000, 500)
dhol_spectrum = (np.exp(-((freqs - 100) / 30)**2) +
                 0.5 * np.exp(-((freqs - 200) / 25)**2) +
                 0.3 * np.exp(-((freqs - 300) / 20)**2))
tabla_spectrum = (np.exp(-((freqs - 250) / 20)**2) +
                  0.3 * np.exp(-((freqs - 500) / 15)**2) +
                  0.2 * np.exp(-((freqs - 750) / 12)**2))

ax.plot(freqs, dhol_spectrum, color='#f59e0b', linewidth=2, label='Dhol')
ax.plot(freqs, tabla_spectrum, color='#3b82f6', linewidth=2, label='Tabla')
ax.fill_between(freqs, dhol_spectrum, alpha=0.15, color='#f59e0b')
ax.fill_between(freqs, tabla_spectrum, alpha=0.15, color='#3b82f6')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Intensity', color='white')
ax.set_title('Frequency Spectrum', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Sound propagation distance
ax = axes[1, 1]
ax.set_facecolor('#111827')
distance = np.linspace(1, 500, 200)  # metres
# Sound intensity drops with 1/r^2, but low freq is absorbed less
dhol_intensity = 1 / distance**2 * np.exp(-0.001 * distance)   # low absorption
tabla_intensity = 1 / distance**2 * np.exp(-0.005 * distance)  # higher absorption

ax.plot(distance, dhol_intensity / dhol_intensity[0] * 100, color='#f59e0b', linewidth=2, label='Dhol (100 Hz)')
ax.plot(distance, tabla_intensity / tabla_intensity[0] * 100, color='#3b82f6', linewidth=2, label='Tabla (250 Hz)')
ax.set_xlabel('Distance (metres)', color='white')
ax.set_ylabel('Relative intensity (%)', color='white')
ax.set_title('Sound Reaches Farther at Low Frequencies', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_yscale('log')

plt.tight_layout()
plt.show()

print("Dhol vs Tabla:")
print(f"  Dhol fundamental: ~{freq_dhol} Hz (diameter ~40cm)")
print(f"  Tabla fundamental: ~{freq_tabla} Hz (diameter ~15cm)")
print()
print("Why the dhol is louder:")
print("  1. Larger membrane = more air moved per cycle")
print("  2. Lower frequency = less atmospheric absorption")
print("  3. Heavier stick = more energy per strike")`,
      challenge: 'Add a snare drum (fundamental ~200 Hz with lots of high-frequency noise from the snare wires). How does its waveform and spectrum compare to the dhol and tabla?',
      successHint: 'Every drum you have ever heard works by this simple mechanism: a membrane vibrates, pushes air, and creates a pressure wave. The physics is elementary; the music is infinite.',
    },
    {
      title: 'Membrane vibration modes — why drums sound complex',
      concept: `A drum membrane does not vibrate in just one simple pattern. It vibrates in many **modes** simultaneously, each at a different frequency:

- **Fundamental mode (0,1)**: the entire membrane moves up and down together. This is the lowest frequency and loudest sound.
- **Mode (1,1)**: the membrane is split in half — one half goes up while the other goes down. A line of no motion (a **nodal line**) divides them.
- **Mode (2,1)**: two nodal lines divide the membrane into four sections
- **Mode (0,2)**: a circular nodal line — the centre moves one way, the rim moves the other

These modes are described by two numbers (m,n):
- m = number of nodal diameters (lines through the centre)
- n = number of nodal circles

The frequencies of these modes are NOT whole-number multiples of the fundamental (unlike a guitar string). This is why drums produce a "noisy" sound rather than a clear musical pitch. The modes are **inharmonic** — their ratios are irrational numbers.

Exception: the Indian tabla has a special paste (syahi) applied to one head, which adds mass to the centre and shifts the mode frequencies into near-harmonic ratios. This is why the tabla sounds "tonal" — an ancient engineering solution to a physics problem.`,
      analogy: 'Vibration modes are like the patterns you see when you sprinkle sand on a shaking plate. Each frequency creates a different geometric pattern — circles, lines, grids. The sand collects on the nodal lines (where nothing moves). A drum head does exactly this, but with air instead of sand.',
      storyConnection: 'The dhol\'s thunder in the story is described as having "a voice within a voice within a voice." This is physically accurate — every drum strike excites dozens of vibration modes simultaneously. The "thunder" is not one frequency but a rich mixture, all produced by a single membrane in a single instant.',
      checkQuestion: 'If drums are inharmonic (modes are not nice multiples of the fundamental), how did tabla makers discover that adding a paste to the centre makes it sound tonal?',
      checkAnswer: 'Centuries of empirical experimentation. Tabla makers discovered that adding the right weight to the right location shifted the higher modes to be closer to harmonics of the fundamental. This is a specific mass distribution problem — solved by trial and error over generations, rediscovered by physicists (like C.V. Raman, who studied it in 1934) as a beautiful application of physics to music.',
      codeIntro: 'Visualize the first several vibration modes of a circular drum membrane.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Vibration modes of a circular membrane
# Using simplified mode shapes (not exact Bessel functions, but illustrative)
theta = np.linspace(0, 2 * np.pi, 200)
r = np.linspace(0, 1, 100)
R, Theta = np.meshgrid(r, theta)
X = R * np.cos(Theta)
Y = R * np.sin(Theta)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Drum Membrane Vibration Modes', color='white', fontsize=14)

modes = [
    ((0, 1), 'Mode (0,1): Fundamental', 1.000),
    ((1, 1), 'Mode (1,1)', 1.594),
    ((2, 1), 'Mode (2,1)', 2.136),
    ((0, 2), 'Mode (0,2)', 2.296),
    ((3, 1), 'Mode (3,1)', 2.653),
    ((1, 2), 'Mode (1,2)', 2.918),
]

for ax, ((m, n), title, ratio) in zip(axes.flat, modes):
    # Approximate mode shape
    # Radial part: use polynomial approximation of Bessel zeros
    if n == 1:
        radial = 1 - R**2  # simplified
    else:
        radial = (1 - R**2) * np.cos(np.pi * (n-1) * R)

    # Angular part
    angular = np.cos(m * Theta)

    Z = radial * angular

    ax.set_facecolor('#111827')
    cmap = plt.cm.coolwarm
    ax.pcolormesh(X, Y, Z, cmap=cmap, shading='auto')
    ax.set_aspect('equal')
    ax.set_title(f'{title}\
Freq ratio: {ratio:.3f}', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)

    # Draw nodal lines (where Z ≈ 0)
    ax.contour(X, Y, Z, levels=[0], colors='white', linewidths=1.5)

    # Draw drum rim
    circle = plt.Circle((0, 0), 1, fill=False, color='white', linewidth=2)
    ax.add_patch(circle)
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)

plt.tight_layout()
plt.show()

print("Circular membrane mode frequencies (relative to fundamental):")
print("  Mode (0,1): 1.000 (fundamental)")
print("  Mode (1,1): 1.594 (NOT a nice fraction)")
print("  Mode (2,1): 2.136")
print("  Mode (0,2): 2.296")
print("  Mode (3,1): 2.653")
print("  Mode (1,2): 2.918")
print()
print("Compare with a guitar string (harmonic):")
print("  Mode 1: 1.000 | Mode 2: 2.000 | Mode 3: 3.000")
print()
print("Drums are inharmonic -> complex, percussive sound")
print("Strings are harmonic -> clear musical pitch")
print("The tabla bridges this gap with its syahi paste.")`,
      challenge: 'The white lines show nodal lines (no motion). If you placed your finger on a nodal line and struck the drum, which modes would you suppress? What would the drum sound like?',
      successHint: 'Vibration modes explain why every drum has its own voice. The same membrane, struck in different places, excites different mode combinations and sounds different. Drummers exploit this intuitively — hitting the centre for a deep boom, the edge for a sharp crack.',
    },
    {
      title: 'Drum tuning — tension, diameter, and pitch',
      concept: `What determines the pitch of a drum? Three factors:

**Frequency formula for a circular membrane**:
f = (alpha_mn / (2 * pi * R)) * sqrt(T / sigma)

Where:
- alpha_mn = mode constant (from Bessel function zeros, e.g., 2.405 for mode (0,1))
- R = radius of the membrane
- T = tension (force per unit length around the rim)
- sigma = surface density (mass per unit area of the membrane)

This tells us:
- **Higher tension** (T up) -> higher pitch. Tightening the tuning ropes on a dhol raises its pitch.
- **Larger diameter** (R up) -> lower pitch. A big dhol is deeper than a small dholak.
- **Heavier membrane** (sigma up) -> lower pitch. A thick goatskin head sounds deeper than a thin one.

How drums are tuned:
- **Dhol**: rope tension and wooden pegs (lacing system around the barrel)
- **Tabla**: hammering the wooden dowels (gatta) around the rim to adjust tension
- **Western drums**: lug bolts around the rim, turned with a drum key
- **Frame drums** (like the daph): heated near a fire — heat tightens the membrane and raises pitch (this is why drummers warm their drums before playing)`,
      analogy: 'A drum membrane is like a rubber sheet stretched over a frame. Pull it tighter (more tension) and it vibrates faster (higher pitch) — like stretching a rubber band makes a higher sound when plucked. Make the sheet bigger (larger diameter) and it vibrates slower (lower pitch) — like a longer rubber band vibrates more slowly.',
      storyConnection: 'The story says the dhol\'s thunder was tuned by the gods to match the rumble of monsoon clouds. In reality, dhol makers tune their instrument by adjusting rope tension — pulling the lacing tighter or looser until the pitch matches the desired note. The "divine tuning" is really the physics of tension and membrane mass.',
      checkQuestion: 'On a hot, humid day in Assam, a dhol sounds different than on a cool, dry evening. Why?',
      checkAnswer: 'Humidity adds moisture to the goatskin membrane, increasing its mass (sigma). By the formula, higher sigma means lower frequency — the drum sounds deeper and less responsive. Temperature affects the skin\'s elasticity (changing effective tension). Dhol players compensate by tightening the ropes. This is why you see drummers adjusting tuning before every performance.',
      codeIntro: 'Model how tension, diameter, and membrane density affect drum pitch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# f = (alpha_01 / (2 * pi * R)) * sqrt(T / sigma)
alpha_01 = 2.405  # first zero of J0 (Bessel function)

# Base values: typical dhol
R_base = 0.20      # radius in metres (40 cm diameter)
T_base = 5000      # tension in N/m
sigma_base = 0.5   # surface density in kg/m²

f_base = (alpha_01 / (2 * np.pi * R_base)) * np.sqrt(T_base / sigma_base)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# 1. Frequency vs tension
ax = axes[0]
ax.set_facecolor('#111827')
T_range = np.linspace(1000, 10000, 200)
f_T = (alpha_01 / (2 * np.pi * R_base)) * np.sqrt(T_range / sigma_base)
ax.plot(T_range, f_T, color='#f59e0b', linewidth=2)
ax.axvline(T_base, color='gray', linestyle=':', linewidth=0.5)
ax.axhline(f_base, color='gray', linestyle=':', linewidth=0.5)
ax.plot(T_base, f_base, 'o', color='#f59e0b', markersize=8)
ax.annotate(f'Dhol: {f_base:.0f} Hz', xy=(T_base, f_base), xytext=(T_base + 500, f_base + 20),
            color='#f59e0b', fontsize=9)
ax.set_xlabel('Tension (N/m)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Pitch vs Tension\
(tighter = higher)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 2. Frequency vs diameter
ax = axes[1]
ax.set_facecolor('#111827')
R_range = np.linspace(0.05, 0.40, 200)
f_R = (alpha_01 / (2 * np.pi * R_range)) * np.sqrt(T_base / sigma_base)
ax.plot(R_range * 200, f_R, color='#3b82f6', linewidth=2)  # diameter in cm

# Mark common drums
drums = [('Tabla', 0.075), ('Dholak', 0.125), ('Dhol', 0.20), ('Bass drum', 0.35)]
for name, radius in drums:
    freq = (alpha_01 / (2 * np.pi * radius)) * np.sqrt(T_base / sigma_base)
    ax.plot(radius * 200, freq, 'o', color='#ef4444', markersize=8)
    ax.annotate(f'{name}\
{freq:.0f} Hz', xy=(radius * 200, freq),
                xytext=(radius * 200 + 3, freq + 15), color='white', fontsize=8)

ax.set_xlabel('Diameter (cm)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Pitch vs Diameter\
(bigger = deeper)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Frequency vs membrane density
ax = axes[2]
ax.set_facecolor('#111827')
sigma_range = np.linspace(0.1, 2.0, 200)
f_sigma = (alpha_01 / (2 * np.pi * R_base)) * np.sqrt(T_base / sigma_range)
ax.plot(sigma_range, f_sigma, color='#22c55e', linewidth=2)

# Mark membrane types
membranes = [('Thin synthetic', 0.2), ('Goatskin', 0.5), ('Buffalo hide', 1.0), ('Thick cowhide', 1.5)]
for name, sigma in membranes:
    freq = (alpha_01 / (2 * np.pi * R_base)) * np.sqrt(T_base / sigma)
    ax.plot(sigma, freq, 'o', color='#a855f7', markersize=8)
    ax.annotate(f'{name}\
{freq:.0f} Hz', xy=(sigma, freq),
                xytext=(sigma + 0.1, freq + 10), color='white', fontsize=8)

ax.set_xlabel('Surface density (kg/m²)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Pitch vs Membrane Weight\
(heavier = deeper)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Dhol baseline: R={R_base*100:.0f}cm, T={T_base}N/m, sigma={sigma_base}kg/m²")
print(f"  Fundamental frequency: {f_base:.0f} Hz")
print()
print("To raise pitch by one octave (double frequency):")
print(f"  Quadruple tension: {T_base} -> {T_base * 4} N/m")
print(f"  OR halve diameter: {R_base*200:.0f} -> {R_base*100:.0f} cm")
print(f"  OR quarter the membrane mass: {sigma_base} -> {sigma_base/4} kg/m²")`,
      challenge: 'A dhol player wants to tune from 100 Hz to 120 Hz by tightening the ropes. By what percentage must tension increase? (Hint: f is proportional to sqrt(T).)',
      successHint: 'The tuning formula connects three physical quantities to one audible result. Every drummer who tightens a rope or warms a membrane is solving this equation, whether they know the math or not.',
    },
    {
      title: 'Resonance in percussion — amplifying the sound',
      concept: `A drum head alone makes a quiet, thin sound. The **drum body** (shell) dramatically amplifies and shapes the sound through **resonance**.

Resonance occurs when a vibrating object causes another object to vibrate at its natural frequency. The drum membrane vibrates, and the air column inside the shell resonates, amplifying certain frequencies.

How the drum body affects sound:
- **Depth of shell**: deeper shells emphasize lower frequencies. A deep dhol has more "body" than a shallow frame drum.
- **Diameter of shell**: larger diameter = larger volume of resonating air = more bass amplification
- **Shell material**: wood absorbs some frequencies (warm sound). Metal reflects all frequencies (bright, loud sound). Fibreglass is between.
- **Air port / hole**: a small hole (like in a cajon) creates a Helmholtz resonance — the air mass in the hole bounces on the air spring inside, amplifying bass dramatically.

The **Helmholtz resonance** formula:
f = (c / (2 * pi)) * sqrt(A / (V * L))

Where c = speed of sound, A = area of the hole, V = volume of the body, L = length of the neck. This is the same physics as blowing across a bottle.`,
      analogy: 'The drum body is like a megaphone for the membrane. Without the body, the membrane is like someone whispering. With the body, the air inside resonates and amplifies specific frequencies — like cupping your hands around your mouth makes your voice louder and deeper.',
      storyConnection: 'The story says the dhol\'s barrel was carved from a sacred tree, and the choice of wood gave it its thunder. In acoustics, the wood species genuinely affects the sound: dense woods (like teak) reflect more sound (louder, brighter), while softer woods (like jackfruit, traditionally used for dhol) absorb some high frequencies (warmer, deeper).',
      checkQuestion: 'Concert bass drums are very large (up to 90 cm diameter) but relatively thin (about 50 cm deep). Why not make them deeper?',
      checkAnswer: 'Diminishing returns. The resonant frequency of the air column decreases with depth, but below about 30 Hz, human hearing loses sensitivity rapidly. Making the drum much deeper would amplify sub-bass frequencies that humans can feel but not really hear. The current proportions optimize the audible bass range (40-80 Hz) while keeping the drum portable.',
      codeIntro: 'Model Helmholtz resonance and how drum body dimensions affect the resonant frequency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

c = 343  # speed of sound in air (m/s)

# Helmholtz resonance: f = (c / 2*pi) * sqrt(A / (V * L_eff))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Resonance frequency vs drum volume
ax = axes[0, 0]
ax.set_facecolor('#111827')
A = 0.001  # port area (m²) — small hole
L_eff = 0.05  # effective length of port
volumes = np.linspace(0.005, 0.1, 200)  # m³
f_helmholtz = (c / (2 * np.pi)) * np.sqrt(A / (volumes * L_eff))

ax.plot(volumes * 1000, f_helmholtz, color='#f59e0b', linewidth=2)
ax.set_xlabel('Drum body volume (litres)', color='white')
ax.set_ylabel('Helmholtz resonance (Hz)', color='white')
ax.set_title('Resonance vs Volume\
(bigger body = deeper resonance)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark common drums
drum_bodies = [('Tabla', 0.008), ('Dholak', 0.025), ('Dhol', 0.05), ('Bass drum', 0.09)]
for name, vol in drum_bodies:
    freq = (c / (2 * np.pi)) * np.sqrt(A / (vol * L_eff))
    ax.plot(vol * 1000, freq, 'o', color='#ef4444', markersize=8)
    ax.annotate(name, xy=(vol * 1000, freq), xytext=(vol * 1000 + 3, freq + 10),
                color='white', fontsize=9)

# 2. Resonance amplification curve
ax = axes[0, 1]
ax.set_facecolor('#111827')
freqs = np.linspace(20, 500, 1000)
f0 = 80  # resonance frequency of dhol body
Q = 5    # quality factor

# Resonance curve (Lorentzian)
response = 1 / np.sqrt((1 - (freqs/f0)**2)**2 + (freqs/(f0*Q))**2)
response /= max(response)

ax.plot(freqs, response, color='#22c55e', linewidth=2)
ax.fill_between(freqs, response, alpha=0.2, color='#22c55e')
ax.axvline(f0, color='#f59e0b', linestyle='--', linewidth=1)
ax.text(f0 + 5, 0.9, f'Resonance: {f0} Hz', color='#f59e0b', fontsize=10)
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Amplification', color='white')
ax.set_title('Resonance Amplification Curve', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Shell material comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
materials = ['Jackfruit\
(dhol)', 'Maple\
(snare)', 'Metal\
(steel)', 'Fibre-\
glass', 'Clay\
(mridanga)']
brightness = [4, 7, 9, 6, 5]   # how reflective (bright sound)
warmth = [8, 6, 3, 5, 7]       # how absorptive (warm sound)
sustain = [6, 7, 9, 7, 5]      # how long the sound rings

x = np.arange(len(materials))
w = 0.25
ax.bar(x - w, brightness, w, label='Brightness', color='#f59e0b')
ax.bar(x, warmth, w, label='Warmth', color='#22c55e')
ax.bar(x + w, sustain, w, label='Sustain', color='#3b82f6')
ax.set_xticks(x)
ax.set_xticklabels(materials, color='white', fontsize=8)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Shell Material Sound Character', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Frequency response: with vs without body
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Membrane alone: broad, flat response
membrane_only = 0.3 * np.exp(-((freqs - 150) / 100)**2)
# With body: amplified at resonance
with_body = membrane_only * (1 + 2 * response)

ax.plot(freqs, membrane_only, color='#ef4444', linewidth=2, linestyle='--', label='Membrane only')
ax.plot(freqs, with_body, color='#22c55e', linewidth=2, label='With drum body')
ax.fill_between(freqs, membrane_only, with_body, alpha=0.15, color='#22c55e')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Sound intensity', color='white')
ax.set_title('Body Amplification Effect', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("How the drum body shapes sound:")
print(f"  Helmholtz resonance frequency: {f0} Hz")
print(f"  Amplification at resonance: ~{max(response) * 3:.0f}x")
print(f"  Quality factor Q: {Q} (higher = sharper resonance)")
print()
print("Traditional dhol design choices:")
print("  Jackfruit wood: warm tone, moderate sustain")
print("  Barrel shape: large volume, deep resonance")
print("  No sound hole: all energy directed through membranes")`,
      challenge: 'If you drill a 5 cm diameter hole in the dhol body, what Helmholtz resonance frequency would it add? Use the formula with A = pi * 0.025^2, V = 0.05 m^3, L = 0.02 m.',
      successHint: 'Resonance is how drums amplify sound without electricity. The body is an acoustic amplifier, tuned by its dimensions and materials. Every drum maker is an acoustic engineer.',
    },
    {
      title: 'Tonal vs non-tonal drums — and cultural significance',
      concept: `Drums fall into two categories based on their sound:

**Non-tonal (indefinite pitch)**: snare drum, bass drum, dhol, cymbals. They produce a sound perceived as having no specific musical pitch. The harmonics are inharmonic (not integer multiples of the fundamental).

**Tonal (definite pitch)**: timpani, tabla, mridanga, talking drums of West Africa. They produce a recognizable musical pitch. This requires harmonic (or near-harmonic) overtones.

What makes a drum tonal:
- **Timpani**: a large, deep, bowl-shaped shell. The hemisphere forces the air to resonate at near-harmonic intervals.
- **Tabla**: the syahi paste (a mixture of iron powder, rice paste, and gum) adds mass to the centre of the head, shifting modes into harmonic alignment.
- **Mridanga**: similar loading technique with a paste on the right head.

Cultural significance of drums in NE India:
- **Dhol**: the heartbeat of Bihu celebrations. Its rhythm patterns (matras) encode specific emotional and narrative content.
- **Khol** (clay drum): used in Vaishnavite devotional music. Its tonal quality carries melodic information.
- **Pepa** (buffalo horn): technically a wind instrument, but paired with dhol in Bihu.

In many NE Indian traditions, the drum is not just an instrument — it is a communicator. Specific rhythm patterns signal specific events: celebration, mourning, harvest, war.`,
      analogy: 'A non-tonal drum is like a bell that rings with a complex sound — rich but without a clear note. A tonal drum is like a bell tuned to sing a specific note — clear and melodic. The difference is whether the overtones align harmonically. Tuning a drum is like tuning a bell: adjusting the shape and mass distribution until the overtones line up.',
      storyConnection: 'The dhol in the story does not just make noise — it "speaks." In Assamese Bihu, the dhol player communicates through rhythm: a fast pattern for joy, a slow pattern for longing, a specific pattern to call dancers to the circle. The drum is a language. Physics provides the sound; culture provides the meaning.',
      checkQuestion: 'African talking drums can mimic tonal languages by changing pitch while playing. How do they change pitch in real time?',
      checkAnswer: 'Talking drums (like the Nigerian dundun) have strings connecting the two heads. By squeezing the strings under the arm, the player increases membrane tension, raising the pitch — sometimes by a full octave. In tonal languages like Yoruba, pitch changes carry meaning (the same syllable at different pitches means different things). The drum replicates these pitch contours, and listeners decode them as words.',
      codeIntro: 'Compare harmonic structure of tonal vs. non-tonal drums and visualize Bihu rhythm patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Harmonic vs inharmonic overtones
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Dhol (inharmonic): frequency ratios from circular membrane
dhol_ratios = [1.000, 1.594, 2.136, 2.296, 2.653, 2.918, 3.156]
dhol_amps = [1.0, 0.6, 0.4, 0.35, 0.25, 0.2, 0.15]
f_dhol = 100  # fundamental

# Tabla (near-harmonic, thanks to syahi)
tabla_ratios = [1.000, 2.000, 3.010, 4.000, 5.010, 5.990, 7.000]
tabla_amps = [1.0, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08]
f_tabla = 250

for ratio, amp in zip(dhol_ratios, dhol_amps):
    ax.bar(ratio * f_dhol, amp, width=8, color='#f59e0b', alpha=0.8)

for ratio, amp in zip(tabla_ratios, tabla_amps):
    ax.bar(ratio * f_tabla, amp, width=8, color='#3b82f6', alpha=0.8)

# Mark harmonics
for n in range(1, 8):
    ax.axvline(n * f_tabla, color='gray', linestyle=':', linewidth=0.3, alpha=0.5)

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Dhol (inharmonic) vs Tabla (near-harmonic)', color='white', fontsize=11)
ax.legend(['Dhol harmonics', 'Tabla harmonics', 'Perfect harmonics'],
          facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. How syahi shifts modes
ax = axes[0, 1]
ax.set_facecolor('#111827')
modes = ['(0,1)', '(1,1)', '(2,1)', '(0,2)', '(3,1)', '(1,2)']
bare_ratios = [1.000, 1.594, 2.136, 2.296, 2.653, 2.918]
syahi_ratios = [1.000, 2.000, 3.010, 4.000, 5.010, 5.990]
harmonic_targets = [1, 2, 3, 4, 5, 6]

x_pos = np.arange(len(modes))
w = 0.25
ax.bar(x_pos - w, bare_ratios, w, color='#ef4444', label='Bare membrane')
ax.bar(x_pos, syahi_ratios, w, color='#22c55e', label='With syahi')
ax.bar(x_pos + w, harmonic_targets, w, color='#3b82f6', alpha=0.5, label='Perfect harmonic')
ax.set_xticks(x_pos)
ax.set_xticklabels(modes, color='white')
ax.set_xlabel('Vibration mode', color='white')
ax.set_ylabel('Frequency ratio', color='white')
ax.set_title('Syahi Shifts Modes to Harmonic Ratios', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Bihu dhol rhythm pattern
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Bihu rhythm: 8 beats in a cycle (simplified)
# 1 = strong hit, 0.5 = light hit, 0 = rest
beats = np.arange(0, 8, 0.25)  # 32 subdivisions
bihu_pattern = np.zeros(32)
# Traditional Bihu jeng-bihu pattern (simplified)
strong = [0, 4, 6, 8, 12, 14, 16, 20, 22, 24, 28, 30]  # subdivisions with hits
light = [2, 10, 18, 26]
for s in strong:
    if s < 32: bihu_pattern[s] = 1.0
for l in light:
    if l < 32: bihu_pattern[l] = 0.5

ax.bar(beats, bihu_pattern, width=0.2, color='#f59e0b', alpha=0.8)
ax.set_xlabel('Beat position', color='white')
ax.set_ylabel('Hit intensity', color='white')
ax.set_title('Bihu Dhol Rhythm Pattern (one cycle)', color='#f59e0b', fontsize=11)
ax.tick_params(colors='gray')

# Mark main beats
for i in range(8):
    ax.axvline(i, color='gray', linestyle=':', linewidth=0.3)
    ax.text(i, 1.1, f'{i+1}', color='gray', fontsize=9, ha='center')

# 4. Cultural significance chart
ax = axes[1, 1]
ax.set_facecolor('#111827')
drums_ne = ['Dhol\
(Assam)', 'Khol\
(Assam)', 'Pung\
(Manipur)', 'Dholak\
(general)', 'Nagara\
(ceremonial)']
ritual_use = [9, 8, 10, 5, 10]
musical_use = [7, 9, 9, 8, 3]
community = [10, 7, 8, 6, 9]

x = np.arange(len(drums_ne))
w = 0.25
ax.bar(x - w, ritual_use, w, label='Ritual significance', color='#a855f7')
ax.bar(x, musical_use, w, label='Musical use', color='#22c55e')
ax.bar(x + w, community, w, label='Community role', color='#f59e0b')
ax.set_xticks(x)
ax.set_xticklabels(drums_ne, color='white', fontsize=8)
ax.set_ylabel('Significance (0-10)', color='white')
ax.set_title('NE India Drums: Cultural Roles', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight:")
print("  The tabla is one of the only drums in the world that")
print("  produces true musical pitch. The syahi (black paste)")
print("  is an ancient engineering solution discovered centuries")
print("  before the mathematics (Bessel functions) were invented")
print("  to explain why it works.")
print()
print("  C.V. Raman, India's Nobel laureate in physics,")
print("  studied this in the 1930s and called it 'one of the")
print("  most fascinating problems in acoustics.'")`,
      challenge: 'The Manipuri pung drum is also tonal (uses a paste similar to syahi). Research: is the pung paste composition the same as tabla syahi? What cultural exchange might explain the similarity?',
      successHint: 'The distinction between tonal and non-tonal drums is one of the most fascinating intersections of physics and culture. The tabla\'s syahi paste is an ancient engineering solution that predated the mathematics needed to explain it by centuries.',
    },
    {
      title: 'Cultural significance — the drum as communicator',
      concept: `In many NE Indian traditions, the drum is not just a musical instrument — it is a **communicator**. Specific rhythm patterns signal specific events: celebration, mourning, harvest, war, prayer.

**Dhol in Bihu**: the heartbeat of Assamese Rongali Bihu. The dhol player (dhulia) leads the celebration, and different rhythm patterns (matras) communicate specific moods and instructions:
- Fast, syncopated patterns = joy, invitation to dance
- Slow, measured patterns = longing, seasonal transition
- Specific sequences = signal to form a circle, change dance formation, or end

**Khol in Vaishnavite music**: the clay drum used in Sattriya dance and Borgeet devotional music. Its tonal quality carries melodic information alongside rhythm.

**Pung in Manipur**: central to Meitei martial arts (thang-ta) and Raas Leela performances. The pung player is considered the "director" of the performance.

**Nagara (kettledrum)**: ceremonial drum of royal courts and temples across NE India. Its deep boom announces important events — it was the "public address system" before electricity.

The drum encodes cultural knowledge: a trained listener can identify the occasion, the region, and even the specific village tradition from the rhythm alone. This is an oral tradition preserved in muscle memory rather than written notation.`,
      analogy: 'Drums as communicators are like a language with vocabulary (individual sounds), grammar (rhythm patterns), and dialects (regional variations). A Bihu dhol pattern is a "sentence" — it conveys specific meaning to listeners who know the "language." Just as spoken language varies by region, drum languages vary by community.',
      storyConnection: 'The dhol in the story does not just make noise — it "speaks." The thunder carries a message across villages. This is not metaphor — in traditional Assamese communities, the dhol genuinely communicated: announcing Bihu, calling villagers to assembly, marking festivals. The drum was the village\'s voice before the loudspeaker.',
      checkQuestion: 'If drum rhythms encode cultural knowledge, what happens when younger generations stop learning them?',
      checkAnswer: 'The knowledge is lost — permanently. Unlike written traditions, drum language exists only in the bodies and memories of practitioners. When a master dhulia dies without teaching, their specific rhythmic vocabulary dies with them. This is why UNESCO and organizations like Sangeet Natak Akademi document and archive traditional drum performances. Digital recording preserves the sound; apprenticeship preserves the understanding.',
      codeIntro: 'Visualize and compare rhythm patterns from different NE Indian drum traditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Drum Rhythm Patterns of NE India', color='white', fontsize=14)

# Helper: create a rhythm pattern visualization
def plot_rhythm(ax, pattern, name, color, beats_per_cycle=8):
    subdivisions = len(pattern)
    x = np.arange(subdivisions)
    ax.set_facecolor('#111827')
    ax.bar(x, pattern, width=0.6, color=color, alpha=0.8)
    ax.set_ylim(0, 1.3)
    ax.set_title(name, color=color, fontsize=11, fontweight='bold')
    ax.set_xlabel('Subdivisions', color='white', fontsize=8)
    ax.tick_params(colors='gray', labelsize=7)
    # Mark main beats
    for i in range(0, subdivisions, subdivisions // beats_per_cycle):
        ax.axvline(i, color='gray', linestyle=':', linewidth=0.3)

# 1. Bihu Dhol - Jeng Bihu (fast, celebratory)
bihu_fast = [1, 0, 0.5, 0, 1, 0, 0.8, 0, 1, 0, 0.5, 0, 0.8, 0, 1, 0,
             1, 0, 0.5, 0, 1, 0, 0.8, 0, 0.5, 0, 1, 0, 0.8, 0.5, 1, 0]
plot_rhythm(axes[0, 0], bihu_fast, 'Bihu Dhol — Jeng Bihu (celebration)', '#f59e0b')

# 2. Bihu Dhol - slow pattern (Husori)
bihu_slow = [1, 0, 0, 0, 0.5, 0, 0, 0, 0.8, 0, 0, 0, 0.5, 0, 0, 0,
             1, 0, 0, 0, 0.5, 0, 0, 0, 0.8, 0, 0, 0, 0.3, 0, 0.5, 0]
plot_rhythm(axes[0, 1], bihu_slow, 'Bihu Dhol — Husori (devotional)', '#22c55e')

# 3. Khol pattern (Borgeet)
khol = [0.8, 0, 0.4, 0, 0.6, 0, 0.3, 0, 0.8, 0, 0.4, 0, 0.5, 0.3, 0.7, 0,
        0.8, 0, 0.4, 0, 0.6, 0, 0.3, 0, 0.9, 0, 0.5, 0.3, 0.7, 0.4, 0.8, 0]
plot_rhythm(axes[1, 0], khol, 'Khol — Borgeet (devotional song)', '#3b82f6')

# 4. Pung - Manipuri Raas Leela
pung = [1, 0, 0.6, 0.3, 0, 0.5, 0, 0.8, 0.3, 0, 0.6, 0, 1, 0, 0.5, 0,
        0.8, 0.3, 0, 0.6, 0, 0.5, 0.3, 0.8, 0, 0.6, 0, 1, 0.3, 0, 0.5, 0]
plot_rhythm(axes[1, 1], pung, 'Pung — Raas Leela (Manipuri dance)', '#a855f7')

# 5. Comparative analysis radar chart
ax = axes[2, 0]
ax.set_facecolor('#111827')
drums = ['Dhol\
(Assam)', 'Khol\
(Assam)', 'Pung\
(Manipur)', 'Nagara\
(ceremonial)']
tempo = [9, 5, 7, 3]
complexity = [7, 8, 9, 4]
volume = [10, 5, 7, 10]
spiritual = [6, 9, 9, 8]

x = np.arange(len(drums))
w = 0.2
ax.bar(x - 1.5*w, tempo, w, label='Tempo', color='#f59e0b')
ax.bar(x - 0.5*w, complexity, w, label='Complexity', color='#22c55e')
ax.bar(x + 0.5*w, volume, w, label='Volume', color='#3b82f6')
ax.bar(x + 1.5*w, spiritual, w, label='Spiritual role', color='#a855f7')
ax.set_xticks(x)
ax.set_xticklabels(drums, color='white', fontsize=8)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Drum Traditions Compared', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 6. Pattern density (notes per cycle)
ax = axes[2, 1]
ax.set_facecolor('#111827')
patterns = {'Bihu fast': bihu_fast, 'Bihu slow': bihu_slow, 'Khol': khol, 'Pung': pung}
names = list(patterns.keys())
densities = [sum(1 for x in p if x > 0) for p in patterns.values()]
avg_intensities = [np.mean([x for x in p if x > 0]) for p in patterns.values()]
pattern_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

ax.scatter(densities, avg_intensities, s=[200]*4, c=pattern_colors, edgecolors='white', linewidth=1)
for name, d, ai, c in zip(names, densities, avg_intensities, pattern_colors):
    ax.annotate(name, xy=(d, ai), xytext=(d + 0.3, ai + 0.02), color=c, fontsize=10)

ax.set_xlabel('Notes per cycle (density)', color='white')
ax.set_ylabel('Average intensity', color='white')
ax.set_title('Rhythm Character Map', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NE India drum traditions:")
print("  Bihu Dhol: the voice of celebration, community gathering")
print("  Khol: the companion of devotional song (Borgeet)")
print("  Pung: the director of Manipuri classical performance")
print("  Nagara: the announcer of ceremony and authority")
print()
print("Each tradition encodes cultural knowledge in rhythm.")
print("The patterns are not random — they are a language.")
print("When a master drummer dies without passing on their")
print("repertoire, a vocabulary is lost forever.")`,
      challenge: 'Create a "fusion" rhythm that combines the Bihu dhol\'s energy with the khol\'s melodic complexity. What musical rules would you follow to make it feel authentic rather than random?',
      successHint: 'Drums are where physics meets culture. The same vibrating membrane that obeys Bessel function mathematics also carries stories, signals celebrations, and defines community identity. Understanding the physics deepens appreciation for the music, not diminishes it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics or music experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for percussion physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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