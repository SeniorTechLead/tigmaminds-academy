import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BellSoundWaveDiagram from '../diagrams/BellSoundWaveDiagram';
import BellFrequencyDiagram from '../diagrams/BellFrequencyDiagram';
import BellHarmonicsDiagram from '../diagrams/BellHarmonicsDiagram';
import BellFourierDiagram from '../diagrams/BellFourierDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import ActivityBellStrikeDiagram from '../diagrams/ActivityBellStrikeDiagram';

export default function MonasteryBellsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The wave equation — deriving v = fλ from first principles',
      concept: `In Level 1 you used the formula v = f × λ without proof. Now let’s derive it.

Imagine watching one point in space as a sound wave passes. The pressure rises and falls in a repeating cycle. The time for one complete cycle is the **period** T (seconds). Frequency is the inverse: **f = 1/T**.

Now imagine taking a snapshot of the wave at one instant. The distance from one peak to the next is the **wavelength** λ (metres).

In one period T, the wave front advances by one wavelength λ. Speed = distance/time:

**v = λ / T = λ × (1/T) = λ × f**

That’s the derivation: v = fλ falls directly from the definitions of speed, period, and wavelength. The code below verifies this numerically and explores what happens when you change each variable.`,
      analogy: 'Picture waves at a beach. You count that 5 waves arrive in 10 seconds (frequency = 0.5 Hz, period = 2 seconds). You measure the distance between wave crests: 4 metres. Speed = 4 m × 0.5 Hz = 2 m/s. You can verify by timing how long one crest takes to travel a measured distance.',
      storyConnection: 'The monastery bells send out sound waves that must obey v = fλ. At Tawang’s altitude, v ≈ 334 m/s. A 200 Hz bell therefore has λ = 334/200 = 1.67 m. This wavelength determines how the sound diffracts around corners and through doorways.',
      checkQuestion: 'A sound wave has a wavelength of 0.5 m and a frequency of 686 Hz. What is the speed of sound in this medium?',
      checkAnswer: 'v = fλ = 686 × 0.5 = 343 m/s. This is the speed of sound in air at about 20°C. If you got a different speed, the medium must be different (water, steel, etc.).',
      codeIntro: 'Verify v = fλ numerically and explore parameter relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v_sound = 343  # m/s at 20°C

# Range of frequencies
frequencies = np.linspace(20, 2000, 500)  # 20 Hz to 2 kHz
wavelengths = v_sound / frequencies
periods = 1 / frequencies

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

# Wavelength vs frequency
axes[0].plot(frequencies, wavelengths, color='#3b82f6', linewidth=2)
axes[0].set_xlabel('Frequency (Hz)', fontsize=10)
axes[0].set_ylabel('Wavelength (m)', fontsize=10)
axes[0].set_title('λ = v / f', fontsize=12)
axes[0].grid(alpha=0.3)

# Mark the Tawang bell
axes[0].scatter([200], [v_sound/200], color='#f59e0b', s=80, zorder=5)
axes[0].annotate('Tawang bell\\n200 Hz, λ=1.72m', xy=(200, v_sound/200),
                xytext=(400, v_sound/200 + 3), fontsize=9, color='lightgray',
                arrowprops=dict(arrowstyle='->', color='lightgray'))

# Period vs frequency
axes[1].plot(frequencies, periods * 1000, color='#10b981', linewidth=2)
axes[1].set_xlabel('Frequency (Hz)', fontsize=10)
axes[1].set_ylabel('Period (ms)', fontsize=10)
axes[1].set_title('T = 1 / f', fontsize=12)
axes[1].grid(alpha=0.3)

# Verification: v = f × λ should always equal 343
verification = frequencies * wavelengths
axes[2].plot(frequencies, verification, color='#a855f7', linewidth=2)
axes[2].set_xlabel('Frequency (Hz)', fontsize=10)
axes[2].set_ylabel('f × λ (m/s)', fontsize=10)
axes[2].set_title('Verification: f × λ = v = const', fontsize=12)
axes[2].set_ylim(340, 346)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Wave Equation: v = f × λ ===")
print(f"Speed of sound: {v_sound} m/s")
print()
for f in [50, 200, 440, 1000, 4000]:
    wl = v_sound / f
    T = 1/f
    print(f"  f={f:>5} Hz → λ={wl:>6.2f} m, T={T*1000:>6.2f} ms, v=f×λ={f*wl:.0f} m/s ✓")`,
      challenge: 'Calculate wavelengths for the same frequencies but in water (v = 1480 m/s). A whale singing at 50 Hz underwater — what is the wavelength? Could that wave fit inside a swimming pool?',
      successHint: 'v = fλ is not just a formula to memorise. It is a logical consequence of what speed, frequency, and wavelength mean. If you understand why it works, you can derive it yourself any time.',
    },
    {
      title: 'Resonance — why the bell rings and the table does not',
      concept: `Strike a bell and it rings for seconds. Strike a table and you get a dull thud. Why?

Every object has **natural frequencies** — the frequencies at which it prefers to vibrate. A bell is designed so that its natural frequencies produce clean, sustained tones. A table’s natural frequencies are heavily **damped** — the energy is absorbed quickly by the wood.

**Resonance** occurs when you drive an object at one of its natural frequencies. The vibrations build up, growing larger and larger. This is how an opera singer can shatter a glass: they match the glass’s natural frequency, and the amplitude builds until the glass cannot flex any more.

The code models a damped oscillator driven at different frequencies. At the natural frequency, the amplitude peaks dramatically.`,
      analogy: 'Push a child on a swing. If you push at random times, nothing much happens. But if you push at exactly the right moment (matching the swing’s natural frequency), the swing goes higher and higher. That is resonance: small, well-timed inputs building to large oscillations.',
      storyConnection: 'Sangha was designed to resonate at specific frequencies. The bronze alloy, bell profile, and thickness were all chosen so that certain modes vibrate strongly and sustain long after being struck. The crack disrupted this design, damping some modes and detuning others.',
      checkQuestion: 'Soldiers are told to break step when crossing a bridge. Why?',
      checkAnswer: 'If soldiers march in step, their footfalls are periodic and could match the bridge’s natural frequency. This would drive the bridge into resonance, causing dangerously large oscillations. The Tacoma Narrows Bridge collapsed in 1940 partly due to wind-driven resonance. Breaking step ensures no single frequency is reinforced.',
      codeIntro: 'Model a driven oscillator and find the resonance peak.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Damped driven oscillator response
# Amplitude ∝ 1 / sqrt((f₀² - f²)² + (γf)²)
f0 = 200       # natural frequency (Hz)
gamma = 10     # damping coefficient (higher = more damping)

frequencies = np.linspace(50, 400, 1000)

# Calculate amplitude response for different damping levels
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for g, color, label in [(5, '#ef4444', 'Low damping (bell)'),
                         (20, '#f59e0b', 'Medium damping (drum)'),
                         (80, '#6b7280', 'High damping (table)')]:
    amplitude = 1 / np.sqrt((f0**2 - frequencies**2)**2 + (g * frequencies)**2)
    amplitude = amplitude / amplitude.max()  # normalize
    ax1.plot(frequencies, amplitude, linewidth=2, color=color, label=label)

ax1.axvline(f0, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
ax1.set_xlabel('Driving frequency (Hz)', fontsize=11)
ax1.set_ylabel('Amplitude response (normalized)', fontsize=11)
ax1.set_title('Resonance: Response vs Driving Frequency', fontsize=13)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Time-domain: bell ring decaying over time
t = np.linspace(0, 2, 10000)  # 2 seconds
for g, color, label in [(3, '#ef4444', 'Bell (γ=3, rings long)'),
                         (15, '#f59e0b', 'Drum (γ=15, fades fast)'),
                         (60, '#6b7280', 'Table (γ=60, instant decay)')]:
    decay = np.exp(-g * t) * np.sin(2 * np.pi * f0 * t)
    ax2.plot(t, decay, linewidth=1, color=color, label=label, alpha=0.8)

ax2.set_xlabel('Time (seconds)', fontsize=11)
ax2.set_ylabel('Amplitude', fontsize=11)
ax2.set_title('How Long Does the Sound Last?', fontsize=13)
ax2.legend(fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Low damping (bell): sharp resonance peak, long sustain")
print("High damping (table): flat response, instant decay")
print()
print("Q factor (quality) = f₀ / bandwidth of resonance peak")
print(f"Bell Q ≈ {f0/5:.0f} (sharp, selective)")
print(f"Drum Q ≈ {f0/20:.0f} (moderate)")
print(f"Table Q ≈ {f0/80:.0f} (barely resonant)")`,
      challenge: 'Find the Q factor (f₀ / damping) for each material. A crystal wine glass has Q ≈ 1000. What would its resonance curve look like? Add it to the plot.',
      successHint: 'Resonance is everywhere: musical instruments, radio tuning, microwave ovens, MRI machines, and bridges. Understanding it means understanding how energy builds up in any vibrating system.',
    },
    {
      title: 'Superposition — when waves meet',
      concept: `When two sound waves arrive at the same point, they do not bounce off each other. They pass right through and simply **add**. This is the **principle of superposition**: at every point, the total displacement equals the sum of individual displacements.

When peaks align with peaks: **constructive interference** — the result is louder.
When peaks align with troughs: **destructive interference** — the result is quieter or silent.

This is the physics behind noise-cancelling headphones: they detect incoming sound, generate a wave that is the exact inverse (flipped), and add it. Peak + trough = zero = silence.

The code demonstrates superposition with two waves of different frequencies and shows how interference creates complex patterns.`,
      analogy: 'Drop two stones in a pond. Where two ripple crests meet, the water humps up extra high (constructive). Where a crest meets a trough, the water stays flat (destructive). The stones do not “block” each other’s ripples — the waves pass through and add.',
      storyConnection: 'In the monastery prayer hall, eight bells ring simultaneously. Their sound waves overlap and superpose. At some spots in the room, certain frequencies are amplified (constructive interference). At others, they partially cancel. This is why the bell sounds different depending on where you stand — something Dorji would have noticed instinctively.',
      checkQuestion: 'If two identical waves with amplitude A meet perfectly in phase (peaks aligned), what is the resulting amplitude?',
      checkAnswer: '2A. Perfect constructive interference doubles the amplitude. Since loudness (intensity) is proportional to amplitude squared, the sound is 4× as intense (about 6 dB louder). This is why choir sections are louder than solo singers — constructive interference of in-phase voices.',
      codeIntro: 'Visualize constructive and destructive interference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 0.02, 5000)  # 20 ms

# Two waves
f1, f2 = 300, 350  # Hz

wave1 = np.sin(2 * np.pi * f1 * t)
wave2 = np.sin(2 * np.pi * f2 * t)
combined = wave1 + wave2

fig, axes = plt.subplots(3, 1, figsize=(10, 8), sharex=True)

axes[0].plot(t * 1000, wave1, color='#3b82f6', linewidth=1.5, label=f'{f1} Hz')
axes[0].set_title(f'Wave 1: {f1} Hz', fontsize=11, color='white')
axes[0].set_ylabel('Pressure', fontsize=9)
axes[0].grid(alpha=0.2)

axes[1].plot(t * 1000, wave2, color='#f59e0b', linewidth=1.5, label=f'{f2} Hz')
axes[1].set_title(f'Wave 2: {f2} Hz', fontsize=11, color='white')
axes[1].set_ylabel('Pressure', fontsize=9)
axes[1].grid(alpha=0.2)

axes[2].plot(t * 1000, combined, color='#10b981', linewidth=1.5)
# Show interference regions
for i in range(len(t) - 1):
    if combined[i] > 1.5:
        axes[2].axvspan(t[i]*1000, t[i+1]*1000, color='green', alpha=0.05)
    elif abs(combined[i]) < 0.3:
        axes[2].axvspan(t[i]*1000, t[i+1]*1000, color='red', alpha=0.05)

axes[2].set_title('Sum: Superposition (green = constructive, red = destructive)',
                  fontsize=11, color='white')
axes[2].set_xlabel('Time (ms)', fontsize=11)
axes[2].set_ylabel('Pressure', fontsize=9)
axes[2].grid(alpha=0.2)

plt.tight_layout()
plt.show()

beat = abs(f2 - f1)
print(f"Wave 1: {f1} Hz")
print(f"Wave 2: {f2} Hz")
print(f"Beat frequency: {beat} Hz")
print()
print("Where peaks align → constructive interference → louder")
print("Where peak meets trough → destructive interference → softer")
print()
print("Noise-cancelling headphones use destructive interference:")
print("  They generate the INVERSE of incoming noise → sum = silence")`,
      challenge: 'Set f2 = f1 (same frequency). What happens? Now set f2 = f1 but shift it by half a period (add np.pi to the phase). That is perfect destructive interference — total silence from two sound sources.',
      successHint: 'Superposition explains beat frequencies, noise cancellation, room acoustics, and even the bright and dark bands in diffraction patterns. Waves adding is one of the most fundamental concepts in physics.',
    },
    {
      title: 'The decibel scale — measuring loudness',
      concept: `Human hearing spans an enormous range. The quietest sound you can hear has an intensity of about 10⁻¹² W/m². A rock concert is about 1 W/m². That is a ratio of **one trillion to one**.

Working with such huge ranges requires a **logarithmic** scale. The **decibel (dB)** scale compresses this range:

**dB = 10 × log₁₀(I / I₀)**

where I₀ = 10⁻¹² W/m² (threshold of hearing).

Key landmarks: 0 dB = threshold of hearing. 60 dB = conversation. 85 dB = damage begins with prolonged exposure. 120 dB = pain threshold. 194 dB = loudest possible in air.

Every increase of 10 dB means the sound is 10× more intense. Every 3 dB is a doubling of intensity. The code explores this scale and places monastery bells in context.`,
      analogy: 'The Richter scale for earthquakes works the same way. A magnitude 5 earthquake is not 25% stronger than magnitude 4 — it is **10 times** stronger. The decibel scale uses the same logic: each step of 10 dB means 10× more energy. This logarithmic compression matches how our ears actually perceive loudness.',
      storyConnection: 'A large bronze bell like Sangha, struck with a heavy mallet, produces about 90-100 dB at 1 metre. At 5 km distance, atmospheric absorption and distance reduce this to perhaps 30-40 dB — still audible in the mountain silence. The thin air at Tawang’s altitude actually absorbs slightly less sound per kilometre than sea level air.',
      checkQuestion: 'A sound of 70 dB is how many times more intense than a sound of 40 dB?',
      checkAnswer: '1,000 times. The difference is 30 dB. Each 10 dB = 10×. So 30 dB = 10 × 10 × 10 = 1,000×. Alternatively: 10^(30/10) = 10³ = 1,000. Despite being 1,000× more intense, 70 dB only *sounds* about 8× louder — our perception is logarithmic too.',
      codeIntro: 'Explore the decibel scale and place everyday sounds on it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Common sounds and their approximate dB levels
sounds = [
    ('Threshold of hearing', 0),
    ('Rustling leaves', 10),
    ('Whisper', 20),
    ('Quiet library', 30),
    ('Tawang at dawn (ambient)', 25),
    ('Normal conversation', 60),
    ('Bell at 100m', 70),
    ('Bell at 1m', 95),
    ('Bell strike (contact)', 110),
    ('Damage threshold (85+ dB)', 85),
    ('Pain threshold', 120),
]

sounds.sort(key=lambda x: x[1])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))

# Bar chart of dB levels
names = [s[0] for s in sounds]
levels = [s[1] for s in sounds]
colors = ['#10b981' if l < 70 else '#f59e0b' if l < 85 else '#ef4444' for l in levels]

ax1.barh(names, levels, color=colors, height=0.6)
ax1.axvline(85, color='red', linewidth=1.5, linestyle='--', alpha=0.5)
ax1.text(86, 0.5, 'Damage\\nthreshold', color='red', fontsize=8)
ax1.set_xlabel('Loudness (dB)', fontsize=11)
ax1.set_title('Sound Levels of Monastery Bells in Context', fontsize=12)
ax1.grid(axis='x', alpha=0.3)
ax1.tick_params(labelsize=9)

# dB vs intensity (logarithmic relationship)
db_range = np.linspace(0, 130, 500)
intensity = 1e-12 * 10 ** (db_range / 10)

ax2.semilogy(db_range, intensity, color='#a855f7', linewidth=2.5)
ax2.set_xlabel('Decibels (dB)', fontsize=11)
ax2.set_ylabel('Intensity (W/m²)', fontsize=11)
ax2.set_title('dB is Logarithmic: 10 dB = 10× Intensity', fontsize=12)
ax2.grid(alpha=0.3)

# Mark key points
for db_val, label in [(0, '0 dB'), (60, '60 dB'), (95, '95 dB (bell)'), (120, '120 dB')]:
    I = 1e-12 * 10 ** (db_val / 10)
    ax2.scatter([db_val], [I], color='white', edgecolor='#a855f7', s=60, zorder=5, linewidth=2)
    ax2.annotate(f'{label}\\n{I:.1e} W/m²', xy=(db_val, I),
                xytext=(db_val + 5, I * 5), fontsize=8, color='lightgray',
                arrowprops=dict(arrowstyle='->', color='lightgray'))

plt.tight_layout()
plt.show()

print("=== Decibel Comparisons ===")
print("  60 dB (conversation) → 70 dB: 10× more intense")
print("  70 dB → 100 dB (bell at 1m): 1,000× more intense")
print("  0 dB → 120 dB (pain): 1,000,000,000,000× (10¹² times)")
print()
print("Your ears compress this trillion-fold range into")
print("a manageable perception. That is why we use dB.")`,
      challenge: 'A bell produces 95 dB at 1 metre. Sound intensity drops as 1/r² (inverse square law). Calculate the dB level at 10m, 100m, and 5000m. At what distance does it drop below 30 dB (library quiet)?',
      successHint: 'The decibel scale is used everywhere: audio engineering, acoustics, electronics, telecommunications. Understanding logarithmic scales is essential for any quantitative field.',
    },
    {
      title: 'Diffraction — how sound bends around corners',
      concept: `You can hear someone talking around a corner even though you cannot see them. Light does not bend around corners (much), but sound does. Why?

The answer is **diffraction**: waves bend around obstacles and spread through openings when the obstacle or opening is comparable in size to the wavelength.

Sound at 200 Hz has λ ≈ 1.7 m. Doorways are about 1 m wide. Since the opening is comparable to λ, the sound wave bends dramatically through the doorway and spreads into the room beyond. Light has λ ≈ 0.0005 mm — millions of times smaller than a doorway — so it barely diffracts at all.

This explains why you can hear the monastery bell from behind walls but need a window to see the bell tower.`,
      analogy: 'Imagine water flowing through a gap in a wall. If the gap is much wider than the wavelength of the ripples, the water flows straight through as a beam. But if the gap is about the same size as the wavelength, the ripples spread out in a fan shape on the other side. Sound through a doorway is exactly this — the doorway acts as a new source of spreading waves.',
      storyConnection: 'The monastery’s prayer hall has thick walls and narrow doorways. Low-frequency bell sounds (long wavelength) diffract through doorways and around corners easily, filling the whole monastery. High-frequency sounds (short wavelength) are more directional. This is why the deep bells were heard throughout the complex while the small, bright bells were mainly heard in the prayer hall.',
      checkQuestion: 'Bass notes from a subwoofer can be heard equally well in every corner of a room. Treble notes from a tweeter are loudest directly in front of it. Why?',
      checkAnswer: 'Bass notes (low frequency, long wavelength ~2-17 m) diffract strongly around furniture and walls, filling the room evenly. Treble notes (high frequency, short wavelength ~2-17 cm) barely diffract — they travel in straight beams like light. This is why subwoofer placement barely matters, but tweeter placement and orientation are critical in audio design.',
      codeIntro: 'Model diffraction through a monastery doorway for different frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Diffraction through a slit (doorway)
# Intensity pattern: I(θ) ∝ (sin(β)/β)² where β = π × a × sin(θ) / λ
doorway_width = 1.0  # metres
v_sound = 334  # m/s at Tawang altitude

frequencies = [100, 200, 500, 1000, 2000]
colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7']

theta = np.linspace(-90, 90, 1000)  # degrees
theta_rad = np.radians(theta)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for f, c in zip(frequencies, colors):
    wavelength = v_sound / f
    beta = np.pi * doorway_width * np.sin(theta_rad) / wavelength
    # Avoid division by zero
    with np.errstate(divide='ignore', invalid='ignore'):
        intensity = np.where(np.abs(beta) < 1e-10, 1.0, (np.sin(beta) / beta) ** 2)
    ax1.plot(theta, intensity, linewidth=2, color=c,
             label=f'{f} Hz (λ={wavelength:.2f}m)')

ax1.set_xlabel('Angle from doorway centre (degrees)', fontsize=10)
ax1.set_ylabel('Relative intensity', fontsize=10)
ax1.set_title('Sound Diffraction Through a 1m Doorway', fontsize=12)
ax1.legend(fontsize=8, loc='upper right')
ax1.grid(alpha=0.3)

# Ratio of wavelength to doorway
freqs_range = np.linspace(50, 4000, 500)
lambdas = v_sound / freqs_range
ratio = lambdas / doorway_width

ax2.plot(freqs_range, ratio, color='#3b82f6', linewidth=2.5)
ax2.axhline(1, color='#f59e0b', linewidth=1.5, linestyle='--')
ax2.text(3000, 1.1, 'λ = doorway width', color='#f59e0b', fontsize=9)
ax2.fill_between(freqs_range, ratio, 1, where=ratio > 1,
                 color='#10b981', alpha=0.1)
ax2.fill_between(freqs_range, ratio, 1, where=ratio < 1,
                 color='#ef4444', alpha=0.1)

ax2.annotate('Strong diffraction\\n(sound fills room)', xy=(100, 3),
            fontsize=9, color='#10b981')
ax2.annotate('Weak diffraction\\n(sound is directional)', xy=(2000, 0.3),
            fontsize=9, color='#ef4444')

ax2.set_xlabel('Frequency (Hz)', fontsize=10)
ax2.set_ylabel('λ / doorway width', fontsize=10)
ax2.set_title('When Does Sound Bend Around Corners?', fontsize=12)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Rule of thumb: if λ > opening size → strong diffraction")
print()
for f in frequencies:
    wl = v_sound / f
    ratio = wl / doorway_width
    diff = 'STRONG' if ratio > 1 else 'moderate' if ratio > 0.5 else 'WEAK'
    print(f"  {f:>5} Hz: λ = {wl:.2f}m, λ/door = {ratio:.1f} → {diff} diffraction")`,
      challenge: 'What happens if the doorway is 3 metres wide (a large gate)? What about a tiny window of 0.3 m? Recalculate which frequencies diffract through each opening.',
      successHint: 'Diffraction explains why you can hear around corners, why concert halls have specific shapes, and why whale songs travel across oceans. The ratio of wavelength to obstacle size is the key parameter in all wave physics.',
    },
    {
      title: 'Inverse square law — how bell sounds fade with distance',
      concept: `As sound spreads outward from the bell, it covers an ever-larger area. At distance r from the source, the sound energy is spread over a sphere of area 4πr². Double the distance → 4× the area → 1/4 the intensity.

This is the **inverse square law**: **I ∝ 1/r²**.

In decibels, doubling the distance reduces the level by about 6 dB.

The code calculates how Sangha’s sound fades as it travels from the tower to distant villages, accounting for both the inverse square law and atmospheric absorption.`,
      analogy: 'Imagine painting a balloon. As you inflate it, the paint stretches thinner over a larger surface. Sound energy does the same: the same total energy is spread over a sphere that grows as r², so the energy per unit area shrinks as 1/r².',
      storyConnection: 'Yak herders 5 km away could hear Sangha. At 5,000 m, the inverse square law alone would reduce a 95 dB bell to about 21 dB. But atmospheric absorption adds further loss. Mountain silence (ambient ~20 dB) means even 25 dB is audible. The monastery was positioned on a ridge where the sound could radiate freely into the valley.',
      checkQuestion: 'A speaker produces 100 dB at 1 metre. What is the level at 10 metres? At 100 metres?',
      checkAnswer: 'At 10 m: 100 − 20×log₁₀(10) = 100 − 20 = 80 dB. At 100 m: 100 − 20×log₁₀(100) = 100 − 40 = 60 dB. Each factor of 10 in distance reduces level by 20 dB (because 10² = 100, and 10×log₁₀(100) = 20).',
      codeIntro: 'Model how bell sound fades with distance using the inverse square law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bell produces 95 dB at 1 metre
dB_at_1m = 95
distances = np.logspace(0, 4, 500)  # 1 m to 10 km

# Inverse square law: dB drops by 20 × log10(r)
dB_inv_sq = dB_at_1m - 20 * np.log10(distances)

# Atmospheric absorption (approx 0.005 dB/m at 200 Hz, sea level)
# At altitude, slightly less: 0.003 dB/m
absorption_rate = 0.003  # dB per metre at altitude
dB_with_absorption = dB_inv_sq - absorption_rate * distances

fig, ax = plt.subplots(figsize=(10, 6))

ax.semilogx(distances, dB_inv_sq, color='#3b82f6', linewidth=2.5,
            label='Inverse square law only')
ax.semilogx(distances, dB_with_absorption, color='#ef4444', linewidth=2.5,
            label='+ Atmospheric absorption')

# Key thresholds
ax.axhline(85, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.text(1.5, 86, 'Hearing damage threshold (85 dB)', fontsize=8, color='#f59e0b')
ax.axhline(30, color='#10b981', linewidth=1, linestyle='--', alpha=0.5)
ax.text(1.5, 31, 'Quiet mountain ambient (30 dB)', fontsize=8, color='#10b981')
ax.axhline(0, color='white', linewidth=0.5, linestyle=':', alpha=0.3)

# Mark key distances
for d, label in [(1, '1m (bell tower)'), (50, '50m (courtyard)'),
                 (500, '500m (village)'), (5000, '5km (yak herders)')]:
    db_val = dB_at_1m - 20 * np.log10(d) - absorption_rate * d
    ax.scatter([d], [db_val], color='white', edgecolor='#ef4444', s=60, zorder=5, linewidth=2)
    ax.annotate(f'{label}\\n{db_val:.0f} dB', xy=(d, db_val),
               xytext=(d * 1.5, db_val + 5), fontsize=8, color='lightgray',
               arrowprops=dict(arrowstyle='->', color='lightgray'))

ax.set_xlabel('Distance from bell (metres)', fontsize=11)
ax.set_ylabel('Sound level (dB)', fontsize=11)
ax.set_title('Sangha\'s Sound Fading Across the Tawang Valley', fontsize=13)
ax.legend(fontsize=10)
ax.grid(alpha=0.3)
ax.set_xlim(1, 10000)
ax.set_ylim(-10, 100)

plt.tight_layout()
plt.show()

print("=== Bell at Key Distances ===")
for d in [1, 10, 50, 100, 500, 1000, 5000]:
    db = dB_at_1m - 20 * np.log10(d) - absorption_rate * d
    print(f"  {d:>5}m: {db:>5.1f} dB {'✓ audible' if db > 25 else '✗ below ambient'}")`,
      challenge: 'What if the bell produces 110 dB at 1m (a very hard strike)? How far can it be heard? What about in water where absorption is much lower (0.0001 dB/m)?',
      successHint: 'The inverse square law governs all radiation: sound, light, gravity, radio signals. It is why you need to stand close to a candle to feel warmth, why stars look dimmer when farther away, and why the monastery positioned its bell tower on the highest point.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced acoustics simulations. Click to start.</p>
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
            diagram={[BellSoundWaveDiagram, BellHarmonicsDiagram, BellFrequencyDiagram, BellFourierDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i] ? createElement([BellSoundWaveDiagram, BellHarmonicsDiagram, BellFrequencyDiagram, BellFourierDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
