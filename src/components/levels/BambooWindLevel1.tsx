import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooWindLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forced vs natural vibration — when objects shake',
      concept: `In "How the Bamboo Taught the Wind to Dance," a child hears bamboo singing in the breeze. Every hollow tube, string, and membrane has a **natural frequency** — the frequency at which it vibrates most easily.

**Natural vibration** (free vibration):
- Pull a guitar string and release → it vibrates at its natural frequency
- Tap a tuning fork → it rings at 440 Hz (if it's an A4 fork)
- The frequency depends on the object's mass, stiffness, and dimensions
- For a string: f = (1/2L) * sqrt(T/mu) where L = length, T = tension, mu = mass per unit length

**Forced vibration**:
- An external force pushes the object at some frequency
- The object vibrates at the FORCING frequency, not its natural one
- Example: a speaker cone vibrates at whatever frequency the amplifier sends
- The amplitude depends on how close the forcing frequency is to the natural frequency

**Key difference**: natural vibration decays (friction drains energy). Forced vibration continues as long as the external force continues. When the forcing frequency matches the natural frequency, something special happens — **resonance**.`,
      analogy: 'A child on a swing has a natural frequency (determined by the length of the chain). If you push at that natural frequency (once per swing), the child goes higher and higher (resonance). Push at the wrong frequency and the swing barely moves (off-resonance forced vibration). Stop pushing and the swing gradually stops (natural vibration decaying).',
      storyConnection: 'The bamboo in the story "sings" when the wind blows. The wind provides the forcing vibration. The bamboo\'s hollow tube has a natural frequency. When the wind speed creates vortices at the right frequency, the bamboo resonates — producing the haunting sound that the child hears.',
      checkQuestion: 'Why does a wine glass shatter when a singer hits the right note?',
      checkAnswer: 'The singer\'s voice forces the glass to vibrate. When the singing frequency matches the glass\'s natural frequency, resonance occurs. The amplitude builds until it exceeds the glass\'s breaking strain. This requires sustained forcing at precisely the right frequency — most people cannot do it, but trained singers can.',
      codeIntro: 'Model free vibration (decaying) vs. forced vibration at different frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 2, 2000)  # 2 seconds

# Natural frequency of system
f_natural = 10  # Hz
omega_n = 2 * np.pi * f_natural
damping = 2.0  # damping coefficient

# Free vibration: decaying sinusoid
free_vib = np.exp(-damping * t) * np.cos(omega_n * t)

# Forced vibration at different frequencies
forcing_freqs = [5, 10, 15]  # Hz
labels = ['Below resonance (5 Hz)', 'AT resonance (10 Hz)', 'Above resonance (15 Hz)']
colors = ['#3b82f6', '#ef4444', '#22c55e']

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Free vibration
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(t, free_vib, color='#f59e0b', linewidth=1.5)
ax.plot(t, np.exp(-damping * t), '--', color='#f59e0b', alpha=0.3, linewidth=1)
ax.plot(t, -np.exp(-damping * t), '--', color='#f59e0b', alpha=0.3, linewidth=1)
ax.set_title(f'Free vibration (natural freq = {f_natural} Hz, decaying)', color='#f59e0b', fontsize=10)
ax.set_ylabel('Amplitude', color='white', fontsize=9)
ax.tick_params(colors='gray')

# Forced vibrations
for i, (f_force, label, color) in enumerate(zip(forcing_freqs, labels, colors)):
    ax = axes[i + 1]
    ax.set_facecolor('#111827')

    omega_f = 2 * np.pi * f_force
    # Steady-state amplitude (from transfer function)
    amplitude = 1.0 / np.sqrt((omega_n**2 - omega_f**2)**2 + (2*damping*omega_f)**2)
    phase = np.arctan2(2*damping*omega_f, omega_n**2 - omega_f**2)

    # Transient + steady state
    forced = amplitude * np.sin(omega_f * t - phase) * (1 - np.exp(-damping * t))

    ax.plot(t, forced, color=color, linewidth=1.5)
    ax.set_title(f'{label} — amplitude: {amplitude:.2f}', color=color, fontsize=10)
    ax.set_ylabel('Amplitude', color='white', fontsize=9)
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Free vs Forced Vibration', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Natural frequency: 10 Hz")
print(f"  Forced at 5 Hz:  amplitude = {1.0 / np.sqrt((omega_n**2 - (2*np.pi*5)**2)**2 + (2*damping*2*np.pi*5)**2):.3f}")
print(f"  Forced at 10 Hz: amplitude = {1.0 / np.sqrt((omega_n**2 - (2*np.pi*10)**2)**2 + (2*damping*2*np.pi*10)**2):.3f} (RESONANCE)")
print(f"  Forced at 15 Hz: amplitude = {1.0 / np.sqrt((omega_n**2 - (2*np.pi*15)**2)**2 + (2*damping*2*np.pi*15)**2):.3f}")
print()
print("At resonance, the amplitude is MAXIMUM.")
print("This is why matching frequencies matters so much.")`,
      challenge: 'Reduce the damping from 2.0 to 0.5. How does the resonance peak change? With less damping, resonance becomes more dramatic — and more dangerous.',
      successHint: 'The distinction between free and forced vibration is fundamental to all of acoustics and structural engineering. Every musical instrument, building, and bridge must be understood in these terms.',
    },
    {
      title: 'Resonance frequency — when pushing matches swinging',
      concept: `**Resonance** occurs when a forcing frequency matches the natural frequency of a system. At resonance, energy transfers from the forcing source to the vibrating object with maximum efficiency, and amplitude reaches its peak.

**The resonance curve** (frequency response):
- Plot amplitude vs. forcing frequency
- The curve has a peak at the natural frequency
- The peak's height and width depend on **damping**
  - Low damping: tall, narrow peak (sharp resonance — glass, tuning fork)
  - High damping: short, wide peak (broad resonance — car suspension)

**The quality factor (Q)**:
- Q = f_natural / bandwidth (bandwidth = width of resonance peak at half-maximum)
- High Q: sharp resonance, long ringing (crystal oscillator: Q ~ 100,000)
- Low Q: broad resonance, quick decay (drum: Q ~ 10)

**Resonance in everyday life:**
- Musical instruments (strings, air columns, membranes)
- Radio tuning (electronic resonance selects one frequency)
- MRI scanners (nuclear magnetic resonance)
- Microwave ovens (water molecule resonance at 2.45 GHz)
- Earthquake damage (building resonance matches ground shaking frequency)`,
      analogy: 'Resonance is like a perfect catch in cricket. The bat (forcing) must meet the ball (natural vibration) at exactly the right timing and angle. A perfect match sends the ball to the boundary with minimal effort. Miss the timing, and most of the energy is wasted. Resonance is the perfect timing of energy transfer.',
      storyConnection: 'The bamboo "sings" only when the wind is at the right speed. Too slow, and the bamboo barely sways. Too fast, and the wind passes over without coupling. At just the right speed, vortices shed from the bamboo at its natural frequency, and resonance produces a clear, sustained tone — the Aeolian harp effect.',
      checkQuestion: 'Soldiers break step when crossing a bridge. Why?',
      checkAnswer: 'Marching in step creates a periodic force at the stepping frequency. If that frequency matches the bridge\'s natural frequency, resonance could cause dangerous oscillations. Breaking step randomises the forcing, preventing resonance. This became military doctrine after the Broughton Suspension Bridge collapsed in 1831 when 74 soldiers marched across it in step.',
      codeIntro: 'Plot resonance curves for different damping values and calculate Q factors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

f_natural = 100  # Hz
omega_n = 2 * np.pi * f_natural

# Frequency range
f = np.linspace(1, 200, 1000)
omega = 2 * np.pi * f

# Different damping ratios
zeta_values = [0.02, 0.1, 0.3, 0.7]
labels = ['Crystal (ζ=0.02)', 'Tuning fork (ζ=0.1)', 'Guitar string (ζ=0.3)', 'Car suspension (ζ=0.7)']
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Frequency response (amplitude)
ax1.set_facecolor('#111827')
for zeta, label, color in zip(zeta_values, labels, colors):
    amplitude = 1.0 / np.sqrt((1 - (omega/omega_n)**2)**2 + (2*zeta*omega/omega_n)**2)
    ax1.plot(f, amplitude, color=color, linewidth=2, label=label)

    # Q factor
    Q = 1 / (2 * zeta)
    peak_amp = amplitude.max()
    ax1.annotate(f'Q={Q:.0f}', xy=(f_natural, peak_amp),
                 xytext=(f_natural + 20, peak_amp * 0.9),
                 color=color, fontsize=8,
                 arrowprops=dict(arrowstyle='->', color=color, linewidth=0.5))

ax1.axvline(f_natural, color='white', linestyle=':', alpha=0.2)
ax1.set_xlabel('Forcing frequency (Hz)', color='white')
ax1.set_ylabel('Amplitude (normalised)', color='white')
ax1.set_title('Resonance Curves: Effect of Damping', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_ylim(0, 30)
ax1.tick_params(colors='gray')

# Time-domain response at resonance for each damping
ax2.set_facecolor('#111827')
t = np.linspace(0, 0.2, 2000)
for zeta, label, color in zip(zeta_values, labels, colors):
    omega_d = omega_n * np.sqrt(1 - zeta**2)
    response = np.exp(-zeta * omega_n * t) * np.cos(omega_d * t)
    ax2.plot(t * 1000, response, color=color, linewidth=1.5, label=label)

ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('Free Vibration Decay: Higher Q = Longer Ringing', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Quality factor Q = how 'selective' the resonance is:")
for zeta, label in zip(zeta_values, labels):
    Q = 1 / (2 * zeta)
    print(f"  {label}: Q = {Q:.0f}")
print()
print("High Q → sharp resonance, long ringing (good for frequency selection)")
print("Low Q → broad resonance, quick decay (good for absorbing energy)")
print()
print("A bamboo tube: Q ≈ 20-50 (moderate — sings clearly but not forever)")`,
      challenge: 'A crystal oscillator in a watch has Q = 25,000. Calculate its damping ratio. How many cycles does it ring before the amplitude drops to 1/e of its initial value? This explains why quartz watches are so accurate.',
      successHint: 'The resonance curve is one of the most important plots in all of physics. It appears in mechanics, electronics, optics, quantum physics, and acoustics. The same math describes a vibrating bamboo, a radio receiver, and a laser cavity.',
    },
    {
      title: 'Aeolian sound — when wind makes music',
      concept: `When wind flows past a cylindrical object (wire, pole, bamboo), it creates **vortices** that shed alternately from each side. This is called a **von Karman vortex street**. Each vortex creates a small pressure pulse. The alternating pulses produce a tone.

**The frequency of Aeolian sound:**
**f = St * V / D**
- St = Strouhal number (~0.2 for cylinders at moderate wind speeds)
- V = wind velocity (m/s)
- D = diameter of the cylinder (m)

**Examples:**
- Telephone wire (D = 3mm, wind = 10 m/s): f = 0.2 × 10 / 0.003 = 667 Hz (high pitch)
- Bamboo (D = 5cm, wind = 5 m/s): f = 0.2 × 5 / 0.05 = 20 Hz (low hum)
- Bridge cable (D = 15cm, wind = 20 m/s): f = 0.2 × 20 / 0.15 = 27 Hz (infrasound)

**Aeolian harps** are instruments designed to be played by the wind:
- Strings of different diameters produce different notes
- The wind speed determines which strings "speak"
- Ancient Greeks attributed the sound to Aeolus, god of wind
- The bamboo groves of Northeast India are natural Aeolian harps

The Aeolian sound becomes loudest when the vortex shedding frequency matches the natural frequency of the object — **lock-in resonance**. Then the bamboo doesn't just respond to the wind; it captures the wind's energy.`,
      analogy: 'Vortex shedding is like flicking a flag. When wind passes around a pole, the air "flaps" from side to side behind the pole, just like a flag flaps. Each flap creates a pressure pulse. If the pole can vibrate (like bamboo), it catches these flaps and converts them into sound — the same way a flag snaps when the wind is right.',
      storyConnection: 'The child in the story hears bamboo singing in the breeze. The Strouhal number explains exactly which wind speed produces the tone. For a 5cm bamboo, a gentle 5 m/s breeze creates 20 Hz vibrations — just at the edge of human hearing, felt more than heard. A stronger 15 m/s wind would produce 60 Hz — a clear, low hum.',
      checkQuestion: 'Why do power lines hum on windy days but not on calm days?',
      checkAnswer: 'No wind means no vortex shedding, so no Aeolian tone. On windy days, vortices shed from the wire at a frequency determined by wind speed and wire diameter. Power lines also hum at 50/60 Hz from the alternating current, but the Aeolian hum varies with wind speed. On very windy days, the two can interact dramatically.',
      codeIntro: 'Calculate Aeolian frequencies for different objects and wind speeds, and visualise the vortex street.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: Aeolian frequency map
ax1.set_facecolor('#111827')
St = 0.2  # Strouhal number

diameters = np.logspace(-3, 0, 100)  # 1mm to 1m
wind_speeds = [2, 5, 10, 20]
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for v, color in zip(wind_speeds, colors):
    freq = St * v / diameters
    ax1.loglog(diameters * 100, freq, color=color, linewidth=2, label=f'Wind = {v} m/s')

# Audible range
ax1.axhspan(20, 20000, alpha=0.05, color='white')
ax1.axhline(20, color='white', linestyle=':', alpha=0.3)
ax1.axhline(20000, color='white', linestyle=':', alpha=0.3)
ax1.text(0.15, 25, 'Human hearing range', color='gray', fontsize=8)

# Mark specific objects
objects = {'Wire (3mm)': 0.3, 'Bamboo (5cm)': 5, 'Bridge cable (15cm)': 15}
for name, d_cm in objects.items():
    for v in [5]:
        freq = St * v / (d_cm / 100)
        ax1.plot(d_cm, freq, 'o', color='white', markersize=8)
        ax1.annotate(name, (d_cm, freq), xytext=(d_cm*1.5, freq*1.3),
                     color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='gray'))

ax1.set_xlabel('Diameter (cm)', color='white')
ax1.set_ylabel('Aeolian frequency (Hz)', color='white')
ax1.set_title('Aeolian Frequency: f = 0.2 × V / D', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Right: Vortex street visualisation
ax2.set_facecolor('#111827')
ax2.set_xlim(-2, 12)
ax2.set_ylim(-3, 3)
ax2.set_aspect('equal')

# Cylinder (bamboo cross-section)
circle = plt.Circle((0, 0), 0.5, color='#f59e0b', alpha=0.8)
ax2.add_patch(circle)
ax2.text(0, 0, 'Bamboo', ha='center', va='center', color='white', fontsize=8)

# Wind arrow
ax2.annotate('', xy=(-0.5, 0), xytext=(-2, 0),
             arrowprops=dict(arrowstyle='->', color='#3b82f6', linewidth=2))
ax2.text(-1.5, 0.5, 'Wind', color='#3b82f6', fontsize=10)

# Von Karman vortex street
for i in range(6):
    x = 1.5 + i * 1.5
    y_sign = 1 if i % 2 == 0 else -1
    y = y_sign * 0.8

    # Vortex spiral
    theta = np.linspace(0, 4*np.pi, 100)
    r = 0.5 * np.exp(-theta / (4*np.pi))
    vx = x + r * np.cos(theta) * y_sign
    vy = y + r * np.sin(theta)
    ax2.plot(vx, vy, color='#60a5fa', linewidth=1, alpha=0.5 - i*0.06)

    # Rotation arrow
    circle_v = plt.Circle((x, y), 0.4, fill=False, edgecolor='#60a5fa', linewidth=1, alpha=0.5 - i*0.06)
    ax2.add_patch(circle_v)
    direction = '↻' if y_sign > 0 else '↺'
    ax2.text(x, y, direction, ha='center', va='center', color='#60a5fa', fontsize=12, alpha=0.7 - i*0.08)

ax2.set_title('Von Kármán Vortex Street', color='white', fontsize=12)
ax2.axis('off')

plt.tight_layout()
plt.show()

# Calculate specific examples
print("Aeolian frequencies (St = 0.2):")
for name, d_m in [('Telephone wire', 0.003), ('Bamboo pole', 0.05), ('Bridge cable', 0.15)]:
    for v in [5, 10, 20]:
        f = St * v / d_m
        audible = "audible" if 20 <= f <= 20000 else "infrasound" if f < 20 else "ultrasound"
        print(f"  {name} at {v} m/s wind: {f:.0f} Hz ({audible})")`,
      challenge: 'Calculate what bamboo diameter would produce a perfect A4 (440 Hz) in a 5 m/s breeze. Then calculate the diameter for a perfect C4 (262 Hz) at the same wind speed. Could you build a bamboo "wind piano" with different diameters for different notes?',
      successHint: 'Aeolian sound connects fluid dynamics (vortex shedding) to acoustics (sound production). It explains singing wires, humming chimneys, and the haunting music of bamboo groves — all from one equation: f = St × V / D.',
    },
    {
      title: 'Standing waves in tubes — how bamboo makes specific notes',
      concept: `A bamboo tube is an **acoustic resonator** — it selects specific frequencies from the noise of the wind. The physics depends on whether the tube is open or closed at each end.

**Open-open tube** (bamboo with both ends cut):
- Standing waves form with pressure nodes at both ends
- Fundamental frequency: f1 = v / (2L) where v = speed of sound (343 m/s), L = tube length
- Harmonics: f_n = n × f1 (all harmonics: 1st, 2nd, 3rd...)

**Closed-open tube** (bamboo with one end sealed by a node):
- Standing wave has a pressure node at the open end and antinode at the closed end
- Fundamental: f1 = v / (4L)
- Only ODD harmonics: f_n = n × f1 where n = 1, 3, 5, 7...
- This gives a "hollower" sound (missing even harmonics)

**Example (50cm bamboo tube):**
- Open-open: f1 = 343 / (2 × 0.5) = 343 Hz (roughly E4)
- Closed-open: f1 = 343 / (4 × 0.5) = 171.5 Hz (roughly F3, one octave lower)

The bamboo flute (bansuri) exploits these physics: the player's lip covers one end (closed-open for the fundamental), and finger holes effectively change the tube length, producing different notes.`,
      analogy: 'A tube is like a hallway where you shout and hear an echo. The echo bounces back and forth between the walls. If the hallway is the right length, certain shouts reinforce themselves (standing waves) while others cancel out. The hallway "selects" specific frequencies — just as a bamboo tube selects specific notes from wind noise.',
      storyConnection: 'In the story, different bamboo tubes produce different tones in the wind. The child notices that longer tubes sound deeper. This is exactly f = v / (2L): a tube twice as long produces a note one octave lower. The bamboo grove is a natural organ, with each tube length producing a different pitch.',
      checkQuestion: 'A didgeridoo is a long, closed-open tube (~1.5m). Why does it sound so deep and "droney" compared to a flute?',
      checkAnswer: 'Two reasons: (1) It is a closed-open tube, so its fundamental is f = 343/(4×1.5) = 57 Hz — a very low Bb. (2) As a closed-open tube, it only produces odd harmonics (1st, 3rd, 5th), giving it a hollow, drone-like quality. The flute, being shorter and open-open, has a higher fundamental and all harmonics, giving it a brighter, fuller tone.',
      codeIntro: 'Visualise standing wave patterns in open and closed tubes, and calculate their frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')

L = 0.5  # tube length (m)
v_sound = 343  # m/s
x = np.linspace(0, L, 200)

# Open-open tube: harmonics 1, 2, 3
for i, n in enumerate([1, 2, 3]):
    ax = axes[0, i]
    ax.set_facecolor('#111827')

    freq = n * v_sound / (2 * L)
    wavelength = v_sound / freq

    # Pressure standing wave
    pressure = np.cos(n * np.pi * x / L)
    # Displacement standing wave (90° out of phase with pressure)
    displacement = np.sin(n * np.pi * x / L)

    ax.plot(x * 100, pressure, color='#ef4444', linewidth=2, label='Pressure')
    ax.plot(x * 100, displacement, color='#3b82f6', linewidth=2, label='Displacement')
    ax.fill_between(x * 100, pressure, alpha=0.1, color='#ef4444')

    # Draw tube
    ax.plot([0, 0], [-1.3, 1.3], color='#f59e0b', linewidth=3)
    ax.plot([L*100, L*100], [-1.3, 1.3], color='#f59e0b', linewidth=3)
    ax.plot([0, L*100], [-1.3, -1.3], color='#f59e0b', linewidth=1, alpha=0.3)
    ax.plot([0, L*100], [1.3, 1.3], color='#f59e0b', linewidth=1, alpha=0.3)

    ax.set_title(f'Open-open: harmonic {n}\
f = {freq:.0f} Hz', color='white', fontsize=10)
    ax.set_ylim(-1.5, 1.5)
    ax.set_xlabel('Position (cm)', color='white', fontsize=8)
    ax.tick_params(colors='gray')
    if i == 0:
        ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# Closed-open tube: harmonics 1, 3, 5 (odd only)
for i, n in enumerate([1, 3, 5]):
    ax = axes[1, i]
    ax.set_facecolor('#111827')

    freq = n * v_sound / (4 * L)
    pressure = np.cos(n * np.pi * x / (2 * L))
    displacement = np.sin(n * np.pi * x / (2 * L))

    ax.plot(x * 100, pressure, color='#ef4444', linewidth=2, label='Pressure')
    ax.plot(x * 100, displacement, color='#3b82f6', linewidth=2, label='Displacement')
    ax.fill_between(x * 100, pressure, alpha=0.1, color='#ef4444')

    # Draw tube (closed at left)
    ax.fill_between([0, 2], -1.3, 1.3, color='#f59e0b', alpha=0.3)  # closed end
    ax.plot([0, 0], [-1.3, 1.3], color='#f59e0b', linewidth=5)
    ax.plot([L*100, L*100], [-1.3, 1.3], color='#f59e0b', linewidth=3)
    ax.plot([0, L*100], [-1.3, -1.3], color='#f59e0b', linewidth=1, alpha=0.3)
    ax.plot([0, L*100], [1.3, 1.3], color='#f59e0b', linewidth=1, alpha=0.3)

    ax.set_title(f'Closed-open: harmonic {n}\
f = {freq:.0f} Hz', color='white', fontsize=10)
    ax.set_ylim(-1.5, 1.5)
    ax.set_xlabel('Position (cm)', color='white', fontsize=8)
    ax.tick_params(colors='gray')

plt.suptitle(f'Standing Waves in Tubes (L = {L*100:.0f}cm, v = {v_sound} m/s)', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print(f"Tube length: {L*100:.0f}cm")
print()
print("Open-open tube frequencies:")
for n in range(1, 7):
    f = n * v_sound / (2 * L)
    print(f"  Harmonic {n}: {f:.0f} Hz")

print()
print("Closed-open tube frequencies (ODD harmonics only):")
for n in [1, 3, 5, 7, 9, 11]:
    f = n * v_sound / (4 * L)
    print(f"  Harmonic {n}: {f:.0f} Hz")`,
      challenge: 'A bamboo flute (bansuri) has 6 finger holes. Calculate the effective tube lengths for each note of a major scale (Sa Re Ga Ma Pa Dha Ni) and plot the hole positions on the tube.',
      successHint: 'The physics of tubes explains every wind instrument ever built — from bamboo flutes to organ pipes to brass instruments. The formula f = v/(2L) or f = v/(4L) is the master key to wind instrument design.',
    },
    {
      title: 'Harmonic series — the DNA of musical sound',
      concept: `When a bamboo tube resonates, it doesn't produce a single frequency. It produces a **harmonic series**: the fundamental frequency plus its integer multiples (overtones).

**The harmonic series for a fundamental of 100 Hz:**
- 1st harmonic (fundamental): 100 Hz
- 2nd harmonic: 200 Hz (one octave above)
- 3rd harmonic: 300 Hz (octave + perfect fifth)
- 4th harmonic: 400 Hz (two octaves)
- 5th harmonic: 500 Hz (two octaves + major third)
- 6th harmonic: 600 Hz (two octaves + perfect fifth)

**Why harmonics matter:**
The relative strength of each harmonic determines the **timbre** (tone colour) of an instrument. This is why a flute and a trumpet playing the same note sound completely different:
- Flute: strong fundamental, weak upper harmonics (pure tone)
- Trumpet: strong mid harmonics (2nd-6th) (bright tone)
- Clarinet: strong odd harmonics (closed-open tube) (hollow tone)
- Bamboo: moderate harmonics, decays quickly (woody, airy tone)

**Connection to music theory:**
The harmonic series is the physical basis of musical intervals:
- 2:1 ratio = octave (2nd harmonic)
- 3:2 ratio = perfect fifth (3rd to 2nd harmonic)
- 4:3 ratio = perfect fourth
- 5:4 ratio = major third
Music theory is applied physics of vibrating objects.`,
      analogy: 'The harmonic series is like white light passing through a prism. White light is a mixture of all colours. A musical note is a mixture of all harmonics. The prism separates the colours; a spectrum analyser separates the harmonics. Each instrument has its own "colour spectrum" — its unique mix of harmonics that defines its character.',
      storyConnection: 'The child in the story hears bamboo singing "in many voices at once." This is literally true: the bamboo produces multiple harmonics simultaneously. The "voice" is the unique combination of harmonic strengths — the timbre. No two bamboo tubes have exactly the same voice, just as no two voices are exactly alike.',
      checkQuestion: 'When you whistle, you produce an almost pure tone (mostly fundamental, very weak harmonics). When you sing "ahh," you produce many strong harmonics. Why the difference?',
      checkAnswer: 'Whistling creates sound from a thin stream of air over a sharp lip (like a flute — simple resonator, few harmonics). Singing "ahh" uses vocal cords (complex vibrator with many harmonics) amplified by the throat and mouth (resonant cavities that boost certain harmonics). The vocal tract shapes the harmonic spectrum — this is what makes vowels sound different from each other.',
      codeIntro: 'Build and compare harmonic spectra for different instruments, then synthesise the sounds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

fundamental = 220  # Hz (A3)
n_harmonics = 12

# Harmonic amplitudes for different instruments
instruments = {
    'Bamboo flute': [1.0, 0.3, 0.1, 0.05, 0.02, 0.01, 0, 0, 0, 0, 0, 0],
    'Clarinet': [1.0, 0.05, 0.7, 0.05, 0.4, 0.05, 0.2, 0.05, 0.1, 0.05, 0.05, 0.05],
    'Trumpet': [0.5, 1.0, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.03],
    'Violin': [1.0, 0.9, 0.7, 0.5, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08],
}
colors = {'Bamboo flute': '#22c55e', 'Clarinet': '#a855f7', 'Trumpet': '#f59e0b', 'Violin': '#ef4444'}

# Frequency spectrum (bar chart)
ax1.set_facecolor('#111827')
x = np.arange(1, n_harmonics + 1)
width = 0.2
for i, (name, amps) in enumerate(instruments.items()):
    offset = (i - 1.5) * width
    bars = ax1.bar(x + offset, amps, width, label=name, color=colors[name], alpha=0.8)

ax1.set_xlabel('Harmonic number', color='white')
ax1.set_ylabel('Relative amplitude', color='white')
ax1.set_title(f'Harmonic Spectra (fundamental = {fundamental} Hz)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Add frequency labels
for n in range(1, n_harmonics + 1):
    ax1.text(n, -0.08, f'{n*fundamental}', ha='center', color='gray', fontsize=7, rotation=45)

# Time-domain waveforms (synthesised)
ax2.set_facecolor('#111827')
t = np.linspace(0, 0.01, 2000)  # 10ms (about 2 cycles at 220Hz)

for name, amps in instruments.items():
    wave = np.zeros_like(t)
    for n, amp in enumerate(amps, 1):
        wave += amp * np.sin(2 * np.pi * n * fundamental * t)
    # Normalise
    wave = wave / np.max(np.abs(wave))
    ax2.plot(t * 1000, wave, color=colors[name], linewidth=1.5, label=name, alpha=0.8)

ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('Synthesised Waveforms (same note, different timbres)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Musical intervals from the harmonic series:")
intervals = [
    (2, 1, 'Octave'), (3, 2, 'Perfect fifth'), (4, 3, 'Perfect fourth'),
    (5, 4, 'Major third'), (6, 5, 'Minor third'), (5, 3, 'Major sixth'),
]
for a, b, name in intervals:
    ratio = a / b
    cents = 1200 * np.log2(ratio)
    print(f"  {a}:{b} = {name} ({ratio:.3f}, {cents:.0f} cents)")
print()
print("The harmonic series IS music theory.")
print("Every scale, chord, and interval is a relationship between harmonics.")`,
      challenge: 'Synthesise a bamboo wind sound: start with the harmonic spectrum, add slight randomness to each harmonic\'s amplitude (wind is turbulent), and multiply by a slow amplitude envelope (wind gusts). How realistic does it sound?',
      successHint: 'From the wind vibrating a bamboo tube, to vortex shedding, to standing waves, to the harmonic series — you have traced the complete physics of how bamboo teaches the wind to dance. Level 2 takes you into vibration engineering: damping, resonance disasters, and how to control the forces that make structures sing.',
    },
    {
      title: 'Musical intervals from physics — why harmonies work',
      concept: `The harmonic series explains WHY certain note combinations sound pleasant (consonant) and others clash (dissonant). It comes down to **frequency ratios**.

**Consonant intervals** (simple ratios):
- Octave: 2:1 (the 2nd and 1st harmonics overlap perfectly)
- Perfect fifth: 3:2 (harmonics of each note frequently coincide)
- Perfect fourth: 4:3
- Major third: 5:4

**Dissonant intervals** (complex ratios):
- Minor second: 16:15 (harmonics rarely overlap → beating, roughness)
- Tritone: 45:32 (the "devil's interval" — most dissonant)

**Why simple ratios sound pleasant:**
When two notes have a simple frequency ratio, their harmonics overlap (align). The brain perceives overlapping harmonics as "one complex sound." Complex ratios create harmonics that are close but not aligned, producing **beating** (wavering intensity) that the brain interprets as roughness.

**Tuning systems:**
- **Just intonation**: uses exact ratios (pure intervals, but some keys sound bad)
- **Equal temperament**: divides octave into 12 equal steps (each a ratio of 2^(1/12) ≈ 1.0595). Slightly out of tune everywhere, but equally so in all keys
- **Pythagorean tuning**: built entirely from 3:2 ratios (great fifths, bad thirds)

Every piano in the world is slightly "wrong" mathematically — but equally wrong in every key.`,
      analogy: 'Frequency ratios in music are like gear ratios in a bicycle. Simple gear ratios (2:1, 3:2) mesh smoothly — the teeth align cleanly. Complex ratios (16:15) cause grinding — the teeth almost but don\'t quite align. Your ear is like a mechanic who can hear whether the gears are meshing smoothly (consonance) or grinding (dissonance).',
      storyConnection: 'In the story, multiple bamboo tubes singing together create a "harmony that seemed to come from the forest itself." When bamboo tubes with lengths in simple ratios (2:1, 3:2) sing simultaneously, their harmonics overlap, creating natural consonance. The forest is a natural orchestra tuned by physics.',
      checkQuestion: 'Why does a piano use equal temperament instead of just intonation, even though just intonation is more "pure"?',
      checkAnswer: 'Just intonation sounds perfect in one key but terrible in others. The intervals between notes change depending on the key, so you would need to retune for every new key. Equal temperament makes every interval slightly impure (about 14 cents off for thirds) but makes all keys equally usable. It is a compromise that enables modulation (changing keys mid-piece), which is essential for Western music since Bach.',
      codeIntro: 'Visualise consonance and dissonance using overlapping waveforms and beating.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 0.05, 5000)  # 50ms
base_freq = 220  # A3

intervals = [
    ('Unison (1:1)', 1.0, '#22c55e'),
    ('Octave (2:1)', 2.0, '#3b82f6'),
    ('Perfect fifth (3:2)', 3/2, '#f59e0b'),
    ('Major third (5:4)', 5/4, '#a855f7'),
    ('Minor second (16:15)', 16/15, '#ef4444'),
    ('Tritone (45:32)', 45/32, '#ec4899'),
]

fig, axes = plt.subplots(len(intervals), 1, figsize=(12, 12), sharex=True)
fig.patch.set_facecolor('#1f2937')

consonance_scores = []

for ax, (name, ratio, color) in zip(axes, intervals):
    ax.set_facecolor('#111827')

    f2 = base_freq * ratio
    wave1 = np.sin(2 * np.pi * base_freq * t)
    wave2 = np.sin(2 * np.pi * f2 * t)
    combined = (wave1 + wave2) / 2

    ax.plot(t * 1000, combined, color=color, linewidth=1, alpha=0.8)
    ax.fill_between(t * 1000, combined, alpha=0.1, color=color)

    # Calculate consonance (based on ratio simplicity)
    # Simple measure: how smooth is the envelope?
    envelope = np.abs(combined)
    roughness = np.std(np.diff(envelope))
    consonance = 1 / (1 + roughness * 50)
    consonance_scores.append((name, consonance))

    ax.set_ylabel(f'{name}\
{base_freq}+{f2:.0f}Hz', color=color, fontsize=8,
                   rotation=0, labelpad=90, va='center', ha='left')
    ax.set_ylim(-1.2, 1.2)
    ax.tick_params(colors='gray')
    ax.set_yticks([])

    # Label consonance
    label = 'Consonant' if ratio in [1.0, 2.0, 3/2] else ('Mild' if ratio == 5/4 else 'Dissonant')
    ax.text(49, 0.8, label, ha='right', color=color, fontsize=9, fontweight='bold')

axes[-1].set_xlabel('Time (ms)', color='white')
axes[0].set_title(f'Musical Intervals: Consonance to Dissonance (base = {base_freq} Hz)', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Interval analysis:")
print(f"{'Interval':<25} {'Ratio':<10} {'Frequencies':<15}")
print("-" * 50)
for name, ratio, _ in intervals:
    f2 = base_freq * ratio
    beat_freq = abs(f2 - base_freq)
    print(f"{name:<25} {ratio:<10.4f} {base_freq} + {f2:.0f} Hz")

print()
print("The simpler the ratio, the fewer 'beating' artifacts.")
print("Beating occurs when two close frequencies create amplitude")
print("fluctuation at their difference frequency.")
print()
print("Equal temperament approximations:")
for name, ratio, _ in intervals:
    et_ratio = 2 ** (round(12 * np.log2(ratio)) / 12)
    error_cents = 1200 * abs(np.log2(ratio) - np.log2(et_ratio))
    print(f"  {name}: {error_cents:.1f} cents off pure ({ratio:.4f} vs {et_ratio:.4f})")`,
      challenge: 'Add the harmonic series of BOTH notes and highlight where their harmonics overlap. Consonant intervals will show many overlaps; dissonant intervals will show few. This visual explanation of consonance was first described by Helmholtz in 1863.',
      successHint: 'Music is applied physics. The intervals that sound "beautiful" are not cultural conventions — they are mathematical properties of wave interference. Every musical tradition in the world uses octaves and fifths because the physics is universal. From bamboo in a forest to a concert hall, the harmonic series governs what we call music.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Resonance & Harmonics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for acoustics and vibration simulations. Click to start.</p>
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
