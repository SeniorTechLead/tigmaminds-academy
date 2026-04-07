import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooFluteLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Speed of sound in different media',
      concept: `Sound is a mechanical wave — it needs a medium to travel through. The speed depends on two properties of the medium: its **bulk modulus** (stiffness) and its **density**.

For fluids the relationship is:

**v = sqrt(B / rho)**

where B is the bulk modulus (Pa) and rho is the density (kg/m^3).

In air at 20 degrees C, sound travels at about 343 m/s. The speed increases with temperature because warmer air molecules move faster and transmit vibrations more quickly:

**v_air = 331.3 + 0.606 * T** (T in Celsius)

In water (B ~ 2.2 GPa, rho ~ 1000 kg/m^3) sound travels at ~1480 m/s — over 4x faster than in air. In steel (B ~ 160 GPa, rho ~ 7800 kg/m^3) it reaches ~5100 m/s. The pattern: stiffer materials transmit sound faster, and the stiffness effect dominates over the density increase.

For solids, the relevant modulus depends on the type of wave. Longitudinal waves use the Young's modulus (approximately): v = sqrt(E / rho). Bamboo has a Young's modulus around 15-20 GPa and density around 600-800 kg/m^3, giving speeds of ~4000-5000 m/s along the grain.`,
      analogy: 'Think of sound speed like passing a message through a crowd. In a tightly packed, disciplined crowd (steel), each person nudges the next instantly — the message flies. In a loose, relaxed crowd (air), people are far apart and react slowly — the message crawls. The stiffness of the connections matters more than how many people are packed together.',
      storyConnection: 'When a Naga musician plays a bamboo flute outdoors on a cool mountain morning versus inside a warm hut, the notes are subtly different in tuning. The speed of sound shifts with the air temperature inside the flute bore, changing the resonant frequencies. Instrument makers in Nagaland craft flutes knowing that bamboo itself carries vibrations along its walls at thousands of meters per second, while the air column inside resonates at a much slower 340-odd m/s.',
      checkQuestion: 'A bamboo flute is played at 10 degrees C and then at 30 degrees C. In which case is the fundamental frequency higher, and why?',
      checkAnswer: 'At 30 degrees C the speed of sound in air is higher (v = 331.3 + 0.606 * 30 = 349.5 m/s vs 337.4 m/s at 10 degrees). Since frequency = v / wavelength, and the wavelength is fixed by the flute length, the frequency is higher at 30 degrees C. The flute plays slightly sharp in warm air.',
      codeIntro: 'Compute and visualize the speed of sound across different media and temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed of sound in air vs temperature
temps = np.linspace(-20, 50, 200)
v_air = 331.3 + 0.606 * temps

# Speed in different media using v = sqrt(B/rho)
media = {
    'Air (20C)': {'B': 1.42e5, 'rho': 1.2, 'color': '#60a5fa'},
    'Helium': {'B': 1.01e5, 'rho': 0.164, 'color': '#a78bfa'},
    'Water': {'B': 2.2e9, 'rho': 1000, 'color': '#22d3ee'},
    'Bamboo (along grain)': {'B': 17e9, 'rho': 700, 'color': '#4ade80'},
    'Steel': {'B': 160e9, 'rho': 7800, 'color': '#f87171'},
}

speeds = {name: np.sqrt(m['B'] / m['rho']) for name, m in media.items()}

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Left: speed vs temperature in air
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(temps, v_air, color='#60a5fa', linewidth=2)
ax.axvline(20, color='#fbbf24', linestyle='--', alpha=0.5, label='20C (room temp)')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Speed of sound (m/s)', color='white')
ax.set_title('Speed of sound in air vs temperature', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Annotate flute tuning shift
v10 = 331.3 + 0.606 * 10
v30 = 331.3 + 0.606 * 30
ax.annotate(f'10C: {v10:.1f} m/s', xy=(10, v10), fontsize=8, color='#fca5a5',
            xytext=(15, v10 - 5), arrowprops=dict(arrowstyle='->', color='#fca5a5'))
ax.annotate(f'30C: {v30:.1f} m/s', xy=(30, v30), fontsize=8, color='#86efac',
            xytext=(35, v30 + 3), arrowprops=dict(arrowstyle='->', color='#86efac'))

# Right: bar chart of speed in different media
ax2 = axes[1]
ax2.set_facecolor('#111827')
names = list(speeds.keys())
vals = [speeds[n] for n in names]
colors = [media[n]['color'] for n in names]
bars = ax2.barh(names, vals, color=colors, edgecolor='white', linewidth=0.5)
ax2.set_xlabel('Speed of sound (m/s)', color='white')
ax2.set_title('Speed of sound in different media', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for bar, v in zip(bars, vals):
    ax2.text(v + 50, bar.get_y() + bar.get_height() / 2, f'{v:.0f} m/s',
             va='center', fontsize=9, color='white')
ax2.set_xlim(0, max(vals) * 1.25)

plt.tight_layout()
plt.show()

# Flute tuning calculation
flute_length = 0.35  # 35 cm bamboo flute
wavelength = 2 * flute_length  # open-open pipe fundamental
f10 = v10 / wavelength
f30 = v30 / wavelength
print(f"Bamboo flute (35 cm) fundamental frequency:")
print(f"  At 10C: {f10:.1f} Hz")
print(f"  At 30C: {f30:.1f} Hz")
print(f"  Shift:  {f30 - f10:.1f} Hz ({(f30 - f10) / f10 * 100:.1f}%)")
print(f"\\\nThis is why Naga musicians tune their flutes to the ambient temperature.")`,
      challenge: 'Add CO2 (B = 1.41e5 Pa, rho = 1.98 kg/m^3) and hydrogen (B = 1.01e5 Pa, rho = 0.082 kg/m^3) to the bar chart. Which gas would make a flute sound highest in pitch?',
      successHint: 'Hydrogen has extremely low density, giving it a sound speed around 1100 m/s — about 3x faster than air. A flute filled with hydrogen would play about 3x higher in pitch. This is the physics behind the "squeaky voice" helium effect.',
    },
    {
      title: 'Acoustic waveguides — how sound propagates in tubes',
      concept: `A bamboo flute is an acoustic waveguide — a tube that constrains sound to travel in specific patterns called **modes**.

In a cylindrical tube, sound waves reflect off the walls and interfere with each other. Only certain patterns survive — these are the **modes** of the waveguide.

For a tube of diameter d, the lowest-order mode (plane wave mode) has no cutoff frequency — it propagates at all frequencies. This is the mode that dominates in musical instruments. Higher-order modes have a **cutoff frequency**:

**f_cutoff = 1.841 * v / (pi * d)**

Below this frequency, only the plane wave mode propagates. Above it, the sound field becomes more complex with transverse patterns. For a typical bamboo flute with a bore diameter of 2 cm, the cutoff for the first higher mode is about 10,000 Hz — well above most musical notes.

The resonant frequencies of an open-open tube (both ends open) are:

**f_n = n * v / (2L)** for n = 1, 2, 3, ...

For a closed-open tube (one end stopped):

**f_n = n * v / (4L)** for n = 1, 3, 5, ... (odd harmonics only)

This is why stopped flutes sound "hollow" — they are missing even harmonics.`,
      analogy: 'A waveguide is like a bowling lane with bumpers. The ball (sound) can only travel in patterns that fit between the bumpers. A straight roll down the middle works at any speed (plane wave mode). But a zigzag pattern only works if the ball is moving fast enough to bounce properly between bumpers (higher modes above cutoff). Slow balls that try to zigzag just die out.',
      storyConnection: 'The bamboo flute of Nagaland uses bamboo segments of varying inner diameter. Thicker bamboo produces a richer, darker tone because the wider bore allows higher waveguide modes to partially propagate, adding complexity to the sound. Thin-bore flutes sound purer and simpler. The Naga craftsman selecting the right bamboo culm is intuitively choosing waveguide properties.',
      checkQuestion: 'A bamboo flute has a bore diameter of 1.5 cm and is 40 cm long. What is the cutoff frequency for the first higher waveguide mode, and does this affect the musical range of the instrument?',
      checkAnswer: 'f_cutoff = 1.841 * 343 / (pi * 0.015) = ~13,400 Hz. The fundamental of this 40 cm flute is about 343 / (2 * 0.4) = 429 Hz, and even the 10th harmonic is only 4290 Hz. The cutoff is far above the musical range, so only the plane wave mode matters for normal playing. This is why simple 1D acoustic models work well for flutes.',
      codeIntro: 'Model waveguide modes and resonant frequencies for different flute geometries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v_sound = 343.0  # m/s at 20C

# Resonant frequencies for open-open and closed-open tubes
def open_open_freqs(L, v, n_modes=10):
    """f_n = n * v / (2L) for n = 1, 2, 3, ..."""
    ns = np.arange(1, n_modes + 1)
    return ns, ns * v / (2 * L)

def closed_open_freqs(L, v, n_modes=10):
    """f_n = n * v / (4L) for n = 1, 3, 5, ... (odd only)"""
    ns = np.arange(1, 2 * n_modes, 2)[:n_modes]
    return ns, ns * v / (4 * L)

# Waveguide cutoff frequency
def waveguide_cutoff(diameter, v):
    """First higher-order mode cutoff: f = 1.841 * v / (pi * d)"""
    return 1.841 * v / (np.pi * diameter)

# Bamboo flute parameters
lengths = [0.30, 0.35, 0.40, 0.45, 0.50]  # meters
bore_diameters = [0.015, 0.020, 0.025, 0.030]  # meters

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Open vs closed tube harmonics
L = 0.35
ns_open, freqs_open = open_open_freqs(L, v_sound, 8)
ns_closed, freqs_closed = closed_open_freqs(L, v_sound, 8)

ax = axes[0, 0]
ax.bar(ns_open - 0.15, freqs_open, 0.3, color='#60a5fa', label='Open-open (all harmonics)')
# For closed-open, plot at the same x positions but label with actual mode numbers
ax.bar(np.arange(1, 9) + 0.15, freqs_closed, 0.3, color='#f97316', label='Closed-open (odd only)')
ax.set_xlabel('Harmonic index', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title(f'Harmonics of a 35 cm tube', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2. Fundamental vs tube length
ax2 = axes[0, 1]
L_range = np.linspace(0.20, 0.60, 100)
f1_open = v_sound / (2 * L_range)
f1_closed = v_sound / (4 * L_range)
ax2.plot(L_range * 100, f1_open, color='#60a5fa', linewidth=2, label='Open-open')
ax2.plot(L_range * 100, f1_closed, color='#f97316', linewidth=2, label='Closed-open')

# Mark standard Naga flute lengths
for l in [30, 35, 40]:
    f = v_sound / (2 * l / 100)
    ax2.plot(l, f, 'o', color='#4ade80', markersize=8, zorder=5)
    ax2.annotate(f'{l} cm\\\n{f:.0f} Hz', xy=(l, f), fontsize=8, color='#4ade80',
                 xytext=(l + 2, f + 40))
ax2.set_xlabel('Tube length (cm)', color='white')
ax2.set_ylabel('Fundamental frequency (Hz)', color='white')
ax2.set_title('Fundamental vs tube length', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Waveguide cutoff vs bore diameter
ax3 = axes[1, 0]
d_range = np.linspace(0.005, 0.040, 100)
f_cut = waveguide_cutoff(d_range, v_sound)
ax3.plot(d_range * 1000, f_cut, color='#a78bfa', linewidth=2)
ax3.axhline(4000, color='#fbbf24', linestyle='--', alpha=0.5, label='Typical musical range limit')
ax3.fill_between(d_range * 1000, f_cut, 20000, alpha=0.1, color='#a78bfa')
ax3.set_xlabel('Bore diameter (mm)', color='white')
ax3.set_ylabel('Cutoff frequency (Hz)', color='white')
ax3.set_title('First higher-mode cutoff vs bore diameter', color='white', fontsize=11)
ax3.set_ylim(0, 20000)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark typical bamboo flute bores
for d_mm in [15, 20, 25]:
    f = waveguide_cutoff(d_mm / 1000, v_sound)
    ax3.plot(d_mm, f, 'o', color='#4ade80', markersize=8, zorder=5)
    ax3.annotate(f'{d_mm} mm: {f:.0f} Hz', xy=(d_mm, f), fontsize=8, color='#4ade80',
                 xytext=(d_mm + 1.5, f + 500))

# 4. Standing wave patterns in a tube
ax4 = axes[1, 1]
x = np.linspace(0, 1, 500)
colors = ['#60a5fa', '#4ade80', '#f97316', '#f472b6']
for n in range(1, 5):
    y = np.sin(n * np.pi * x)
    offset = (n - 1) * 2.5
    ax4.plot(x, y + offset, color=colors[n - 1], linewidth=2)
    ax4.axhline(offset, color='gray', linewidth=0.3, alpha=0.5)
    f = n * v_sound / (2 * 0.35)
    ax4.text(1.02, offset, f'n={n} ({f:.0f} Hz)', fontsize=9, color=colors[n - 1], va='center')
ax4.set_xlabel('Position along tube (normalized)', color='white')
ax4.set_title('Standing wave patterns (open-open, 35 cm)', color='white', fontsize=11)
ax4.set_yticks([])
ax4.set_xlim(-0.02, 1.2)

plt.tight_layout()
plt.show()

print("Bamboo flute waveguide summary (35 cm, 20 mm bore):")
print(f"  Fundamental (open-open): {v_sound / (2 * 0.35):.1f} Hz")
print(f"  First cutoff mode:       {waveguide_cutoff(0.020, v_sound):.0f} Hz")
print(f"  Ratio cutoff/fundamental: {waveguide_cutoff(0.020, v_sound) / (v_sound / (2 * 0.35)):.0f}x")
print(f"\\\nOnly the plane wave mode matters for normal playing.")
print(f"The tube acts as a simple 1D resonator for all musical notes.")`,
      challenge: 'Model a tube with finger holes by computing the effective length when a hole is open (shortens the air column). Plot how the fundamental changes as you open holes progressively from the far end.',
      successHint: 'Each open finger hole acts approximately like a new open end for the tube. The effective length shortens, raising the pitch. This is exactly how a bamboo flute produces different notes — each finger position creates a different effective tube length.',
    },
    {
      title: 'Psychoacoustics — how the ear perceives sound',
      concept: `The ear does not perceive sound the way a microphone records it. Three key differences:

**1. Pitch perception is logarithmic.** Doubling the frequency raises the perceived pitch by one octave — whether you go from 100 to 200 Hz or from 1000 to 2000 Hz. The ear maps frequency on a log scale. This is why musical notes are spaced by multiplicative ratios, not additive intervals.

**2. Loudness perception is nonlinear and frequency-dependent.** The **Fletcher-Munson curves** (equal-loudness contours) show that the ear is most sensitive around 2000-5000 Hz and much less sensitive at very low and very high frequencies. A 50 Hz tone needs far more acoustic power to sound as loud as a 3000 Hz tone. This is why bass speakers need much more wattage than tweeters.

**3. Timbre comes from harmonic content.** Two instruments playing the same note at the same loudness sound different because of their **harmonic spectrum** — the relative strengths of the fundamental and its overtones. A flute has a strong fundamental with weak harmonics (pure tone). A violin has rich harmonics. A clarinet emphasizes odd harmonics. The ear fuses all these frequencies into a single perceived "color" of sound.

The ear also has remarkable time resolution: it can detect inter-aural time differences of just 10 microseconds, allowing us to localize sounds in space.`,
      analogy: 'The ear is like a photo editor that automatically adjusts contrast and color balance. A camera captures raw light linearly, but our eyes (and Photoshop) apply curves: compressing highlights, boosting shadows, emphasizing certain colors. Similarly, the ear compresses the enormous dynamic range of sound (a factor of 10^12 in power from threshold to pain) into a manageable perceptual range, and it "color-corrects" by being more sensitive to speech frequencies.',
      storyConnection: 'Naga tribal music uses bamboo flutes, drums, and vocal chanting. The flute carries melody in the 500-2000 Hz range where the ear is most sensitive — it cuts through even in noisy outdoor festivals. The drums provide rhythm at lower frequencies that you feel as much as hear. The ear naturally separates these two streams because of their different frequency ranges and timbres. Traditional Naga musicians discovered the Fletcher-Munson curves empirically: flute melodies are played at moderate levels but still dominate over louder drums.',
      checkQuestion: 'Why does music sound "thin" and lacking bass when played at low volume, but full and balanced at higher volume?',
      checkAnswer: 'The Fletcher-Munson curves show that at low sound levels, the ear is far less sensitive to bass frequencies than to midrange. At low volume, the bass is below the ear sensitivity threshold even if the midrange is audible. At higher volume, both bass and midrange exceed threshold, so the bass becomes perceptible and the sound feels "full." This is why many audio systems have a "loudness" button that boosts bass at low volumes.',
      codeIntro: 'Model logarithmic pitch perception, approximate Fletcher-Munson curves, and compare harmonic spectra of different instruments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Logarithmic pitch perception — octaves on linear vs log scale
ax = axes[0, 0]
octave_freqs = [55, 110, 220, 440, 880, 1760, 3520]
note_names = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7']

# Linear scale: octaves bunch up at the low end
ax.scatter(octave_freqs, [1] * len(octave_freqs), color='#f97316', s=100, zorder=5)
for f, n in zip(octave_freqs, note_names):
    ax.annotate(n, (f, 1.05), fontsize=8, color='#f97316', ha='center')

# Log scale: equally spaced
ax.scatter(octave_freqs, [0.5] * len(octave_freqs), color='#60a5fa', s=100, zorder=5)
for f, n in zip(octave_freqs, note_names):
    ax.annotate(n, (f, 0.55), fontsize=8, color='#60a5fa', ha='center')

ax.set_xscale('log')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_yticks([0.5, 1.0])
ax.set_yticklabels(['Log scale (perception)', 'Linear scale (physics)'], color='white', fontsize=8)
ax.set_title('Pitch perception is logarithmic', color='white', fontsize=11)
ax.set_ylim(0.2, 1.3)

# 2. Approximate Fletcher-Munson equal-loudness contours
ax2 = axes[0, 1]
freqs = np.logspace(np.log10(20), np.log10(20000), 500)

def fletcher_munson_approx(freq, phon):
    """Rough approximation of equal-loudness contours."""
    # Ear is most sensitive around 3500 Hz
    sensitivity = 1.0 / (1.0 + ((np.log10(freq / 3500)) ** 2) * 8)
    # Scale by phon level (higher phon = flatter curve)
    flatness = 0.3 + 0.7 * (phon / 100)
    spl = phon - 30 * sensitivity * (1 - flatness)
    return spl

phon_levels = [20, 40, 60, 80]
colors_fm = ['#60a5fa', '#4ade80', '#fbbf24', '#f97316']
for phon, color in zip(phon_levels, colors_fm):
    spl = fletcher_munson_approx(freqs, phon)
    ax2.plot(freqs, spl, color=color, linewidth=2, label=f'{phon} phon')

ax2.set_xscale('log')
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Sound pressure level (dB SPL)', color='white')
ax2.set_title('Fletcher-Munson equal-loudness contours (approx.)', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.axvspan(500, 2000, alpha=0.08, color='#4ade80', label='Flute range')
ax2.text(1000, 10, 'Flute range', fontsize=8, color='#4ade80', ha='center')

# 3. Harmonic spectra of different instrument timbres
ax3 = axes[1, 0]
n_harmonics = 12
harmonics = np.arange(1, n_harmonics + 1)

# Approximate harmonic amplitudes
flute_amps = np.array([1.0, 0.2, 0.05, 0.02, 0.01, 0.005, 0, 0, 0, 0, 0, 0])
violin_amps = np.array([1.0, 0.8, 0.6, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02])
clarinet_amps = np.array([1.0, 0.1, 0.7, 0.05, 0.4, 0.03, 0.2, 0.02, 0.1, 0.01, 0.05, 0.005])
bamboo_flute_amps = np.array([1.0, 0.35, 0.15, 0.08, 0.04, 0.03, 0.02, 0.01, 0, 0, 0, 0])

width = 0.2
ax3.bar(harmonics - 1.5 * width, flute_amps, width, color='#60a5fa', label='Western flute')
ax3.bar(harmonics - 0.5 * width, bamboo_flute_amps, width, color='#4ade80', label='Bamboo flute')
ax3.bar(harmonics + 0.5 * width, violin_amps, width, color='#f97316', label='Violin')
ax3.bar(harmonics + 1.5 * width, clarinet_amps, width, color='#f472b6', label='Clarinet (odd)')
ax3.set_xlabel('Harmonic number', color='white')
ax3.set_ylabel('Relative amplitude', color='white')
ax3.set_title('Harmonic spectra define timbre', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Synthesize and compare waveforms
ax4 = axes[1, 1]
sr = 44100
t = np.linspace(0, 0.01, int(sr * 0.01))  # 10 ms window
f0 = 440  # A4

def synthesize(t, f0, amps):
    signal = np.zeros_like(t)
    for n, a in enumerate(amps, 1):
        signal += a * np.sin(2 * np.pi * f0 * n * t)
    return signal / np.max(np.abs(signal))

for name, amps, color in [
    ('Western flute', flute_amps, '#60a5fa'),
    ('Bamboo flute', bamboo_flute_amps, '#4ade80'),
    ('Violin', violin_amps, '#f97316'),
]:
    wave = synthesize(t, f0, amps)
    ax4.plot(t * 1000, wave, color=color, linewidth=1.5, label=name, alpha=0.8)

ax4.set_xlabel('Time (ms)', color='white')
ax4.set_ylabel('Amplitude', color='white')
ax4.set_title('Same pitch, different timbre (A4 = 440 Hz)', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Key psychoacoustic facts:")
print("  - Pitch: logarithmic. Doubling frequency = +1 octave always")
print("  - Loudness: ear most sensitive at 2000-5000 Hz (speech/flute range)")
print("  - Timbre: determined by harmonic content")
print("  - Bamboo flute: strong fundamental, few harmonics -> pure, breathy tone")
print("  - Naga festival insight: flute melody (mid-freq) pierces above drum rhythm (low-freq)")`,
      challenge: 'Generate audio samples of the bamboo flute and violin timbres at A4, and compute their spectral centroids. Which has a higher centroid, and how does that relate to the perceived brightness?',
      successHint: 'The violin has a higher spectral centroid because its energy is spread across many harmonics, pulling the center of mass upward. The bamboo flute concentrates energy at the fundamental, giving a lower centroid. Higher centroid = brighter perceived timbre. Spectral centroid is one of the best single predictors of perceived brightness.',
    },
    {
      title: 'Room acoustics and reverberation',
      concept: `When you clap your hands in a room, the sound does not simply travel from your hands to your ears. It bounces off every surface — walls, ceiling, floor, furniture — creating a complex pattern of reflections.

**Echo vs. reverb:** If a reflection arrives more than about 50 ms after the direct sound (requiring a round-trip path difference of ~17 meters), the ear perceives it as a distinct echo. Shorter delays blur together into **reverberation** — a smooth decay that gives a sense of space.

**RT60** (reverberation time) is defined as the time it takes for sound to decay by 60 dB (a factor of 1,000,000 in power). It depends on room volume and surface absorption:

**RT60 = 0.161 * V / A**

where V is room volume (m^3) and A is the total absorption (sum of surface area * absorption coefficient for each material). This is the **Sabine equation**.

Absorption coefficients range from ~0.01 (concrete — highly reflective) to ~0.9 (thick carpet, acoustic panels). A bathroom with hard tiles has RT60 around 1.5-2 seconds. A recording studio is designed for RT60 around 0.3-0.5 seconds. A concert hall aims for 1.5-2.2 seconds — enough reverb for warmth, not so much that notes blur together.`,
      analogy: 'Room acoustics are like throwing a ball in different rooms. In a tiled bathroom, the ball bounces wildly off every hard surface and keeps bouncing for a long time (long reverb). In a room stuffed with pillows and blankets, the ball dies almost immediately (short reverb, "dead" room). Concert halls are like carefully designed ball courts — the angles and surfaces are chosen so the ball bounces back to the audience in a pleasing pattern.',
      storyConnection: 'Naga tribal music is traditionally performed outdoors in open village grounds during festivals, where there is minimal reverberation — the sound travels outward and does not return. But some ceremonies take place inside large wooden morungs (community halls). The wooden walls of a morung have moderate absorption coefficients, creating a warm, short reverb that wraps around the bamboo flute melodies. Naga musicians instinctively adapt their playing style to the space — slower, more sustained notes in reverberant morungs, faster articulation outdoors.',
      checkQuestion: 'A morung (Naga community hall) is 10 m long, 6 m wide, and 4 m high. The wooden walls have absorption coefficient 0.10, and the dirt floor has coefficient 0.05. Estimate the RT60.',
      checkAnswer: 'Volume V = 10 * 6 * 4 = 240 m^3. Surface areas: two walls 10*4 = 80 m^2, two walls 6*4 = 48 m^2, ceiling 60 m^2 (assume wood, 0.10), floor 60 m^2 (dirt, 0.05). Total A = (80 + 48 + 60) * 0.10 + 60 * 0.05 = 18.8 + 3.0 = 21.8 sabins. RT60 = 0.161 * 240 / 21.8 = 1.77 seconds. That is a moderately reverberant space, suitable for sustained flute tones.',
      codeIntro: 'Simulate room acoustics using the Sabine equation and visualize reverb decay for different spaces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sabine_rt60(volume, surfaces):
    """Compute RT60 using Sabine equation.
    surfaces: list of (area_m2, absorption_coefficient)"""
    total_absorption = sum(area * coeff for area, coeff in surfaces)
    if total_absorption == 0:
        return float('inf')
    return 0.161 * volume / total_absorption

# Define different spaces
spaces = {
    'Tiled bathroom': {
        'volume': 2.5 * 2.0 * 2.5,  # small room
        'surfaces': [(2 * (2.5 * 2.5 + 2.0 * 2.5 + 2.5 * 2.0), 0.02)],  # all tile
        'color': '#60a5fa',
    },
    'Naga morung (wood hall)': {
        'volume': 10 * 6 * 4,
        'surfaces': [(188, 0.10), (60, 0.05)],  # wood walls+ceiling, dirt floor
        'color': '#4ade80',
    },
    'Living room': {
        'volume': 5 * 4 * 2.8,
        'surfaces': [(56, 0.08), (20, 0.40), (20, 0.03)],  # walls, carpet, windows
        'color': '#fbbf24',
    },
    'Concert hall': {
        'volume': 40 * 25 * 15,
        'surfaces': [(2000, 0.12), (1000, 0.70)],  # walls/ceiling, seats
        'color': '#f97316',
    },
    'Recording studio': {
        'volume': 6 * 5 * 3,
        'surfaces': [(126, 0.60)],  # acoustic treatment everywhere
        'color': '#a78bfa',
    },
    'Open field (Naga festival)': {
        'volume': 50 * 50 * 10,
        'surfaces': [(2500, 0.99), (7000, 0.50)],  # ground + "open walls"
        'color': '#f472b6',
    },
}

rt60_values = {}
for name, space in spaces.items():
    rt60_values[name] = sabine_rt60(space['volume'], space['surfaces'])

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. RT60 comparison bar chart
ax = axes[0, 0]
names = list(rt60_values.keys())
vals = [rt60_values[n] for n in names]
colors = [spaces[n]['color'] for n in names]
bars = ax.barh(range(len(names)), vals, color=colors, edgecolor='white', linewidth=0.5)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=8, color='white')
ax.set_xlabel('RT60 (seconds)', color='white')
ax.set_title('Reverberation time by space', color='white', fontsize=11)
for bar, v in zip(bars, vals):
    ax.text(v + 0.05, bar.get_y() + bar.get_height() / 2,
            f'{v:.2f}s', va='center', fontsize=9, color='white')

# 2. Reverb decay curves
ax2 = axes[0, 1]
t = np.linspace(0, 3, 1000)
for name in ['Tiled bathroom', 'Naga morung (wood hall)', 'Recording studio']:
    rt60 = rt60_values[name]
    # Exponential decay: amplitude = 10^(-3 * t / RT60) (60 dB = factor of 1000)
    decay_db = -60 * t / rt60
    ax2.plot(t, decay_db, color=spaces[name]['color'], linewidth=2, label=f'{name} (RT60={rt60:.2f}s)')

ax2.axhline(-60, color='gray', linestyle='--', alpha=0.5, linewidth=1)
ax2.text(2.5, -58, '-60 dB threshold', fontsize=8, color='gray')
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Sound level (dB)', color='white')
ax2.set_title('Reverb decay curves', color='white', fontsize=11)
ax2.set_ylim(-80, 5)
ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Impulse response simulation (simplified)
ax3 = axes[1, 0]
sr = 44100
duration = 2.0
t_ir = np.linspace(0, duration, int(sr * duration))

def simple_impulse_response(rt60, sr, duration, n_reflections=50):
    """Generate simplified impulse response."""
    n_samples = int(sr * duration)
    ir = np.zeros(n_samples)
    ir[0] = 1.0  # direct sound

    # Random reflections with exponential decay
    np.random.seed(42)
    for i in range(n_reflections):
        delay = np.random.exponential(rt60 / 10)
        if delay < duration:
            idx = int(delay * sr)
            amplitude = 10 ** (-3 * delay / rt60) * (0.5 + 0.5 * np.random.random())
            if np.random.random() > 0.5:
                amplitude *= -1  # random phase
            ir[idx] += amplitude
    return ir

for name, rt60 in [('Naga morung (wood hall)', rt60_values['Naga morung (wood hall)']),
                     ('Recording studio', rt60_values['Recording studio'])]:
    ir = simple_impulse_response(rt60, sr, duration)
    ax3.plot(t_ir[:int(0.5 * sr)], ir[:int(0.5 * sr)],
             color=spaces[name]['color'], linewidth=0.5, alpha=0.8, label=name)

ax3.set_xlabel('Time (seconds)', color='white')
ax3.set_ylabel('Amplitude', color='white')
ax3.set_title('Simplified impulse responses', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Absorption coefficient by material
ax4 = axes[1, 1]
materials = {
    'Concrete': 0.02,
    'Glass': 0.04,
    'Brick': 0.05,
    'Hardwood floor': 0.07,
    'Wood paneling': 0.10,
    'Carpet (thin)': 0.20,
    'Heavy curtain': 0.50,
    'Carpet (thick)': 0.40,
    'Acoustic foam': 0.70,
    'Open window': 1.00,
}
mat_names = list(materials.keys())
mat_vals = list(materials.values())
mat_colors = plt.cm.RdYlGn(np.array(mat_vals))
bars = ax4.barh(range(len(mat_names)), mat_vals, color=mat_colors, edgecolor='white', linewidth=0.5)
ax4.set_yticks(range(len(mat_names)))
ax4.set_yticklabels(mat_names, fontsize=8, color='white')
ax4.set_xlabel('Absorption coefficient (0 = perfect reflection, 1 = perfect absorption)', color='white', fontsize=8)
ax4.set_title('Sound absorption coefficients at 1 kHz', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Room acoustics summary:")
for name, rt60 in sorted(rt60_values.items(), key=lambda x: x[1]):
    category = "dead" if rt60 < 0.5 else "moderate" if rt60 < 1.5 else "reverberant" if rt60 < 2.5 else "echoey"
    print(f"  {name:<28s}  RT60 = {rt60:.2f}s  ({category})")
print(f"\\\nNaga morung: warm reverb ({rt60_values['Naga morung (wood hall)']:.2f}s) — suits sustained flute notes")
print(f"Open festival ground: almost dry — suits fast rhythmic drumming")`,
      challenge: 'Add audience absorption to the morung (30 seated people, each with ~0.5 sabins of absorption). How does this change the RT60? Why do concert halls sound different when empty vs. full?',
      successHint: 'Adding 30 people adds 15 sabins to the morung, reducing RT60 from ~1.77s to ~1.05s. Audiences are significant absorbers. This is why concert halls are tuned with seats that have similar absorption whether occupied or empty — so the acoustics do not change between rehearsal and performance.',
    },
    {
      title: 'Musical intervals and scales',
      concept: `Musical notes are defined by frequency ratios, not absolute differences. The fundamental intervals:

- **Octave**: 2:1 ratio. A4 = 440 Hz, A5 = 880 Hz.
- **Perfect fifth**: 3:2 ratio. A4 to E5 = 440 * 3/2 = 660 Hz.
- **Perfect fourth**: 4:3 ratio. A4 to D5 = 440 * 4/3 = 586.7 Hz.

These small-integer ratios sound **consonant** (pleasant together) because their waveforms reinforce each other regularly. Complex ratios like 45:32 (tritone) sound **dissonant** because the patterns never quite align.

**Equal temperament** divides the octave into 12 equal steps. Each semitone is a frequency ratio of 2^(1/12) = 1.0595. This is a compromise — no interval except the octave is a pure ratio, but every key sounds equally good (or equally imperfect).

A **major scale** selects 7 of these 12 notes: whole, whole, half, whole, whole, whole, half steps (W-W-H-W-W-W-H). A **minor scale** uses W-H-W-W-H-W-W.

The **pentatonic scale** uses only 5 notes and is found in music worldwide — from Naga tribal melodies to blues to Chinese traditional music. The major pentatonic is: root, major 2nd, major 3rd, perfect 5th, major 6th (semitone pattern: 2-2-3-2-3). It avoids the half-step intervals that create tension, making it universally pleasant.`,
      analogy: 'Musical intervals are like gear ratios in a bicycle. Simple ratios (2:1, 3:2) mesh smoothly — the gears turn in sync. Complex ratios cause the gears to fight each other, creating grinding (dissonance). The pentatonic scale picks only the smoothest gear ratios, which is why it sounds good in every culture — it is the universal "easy gear" of music.',
      storyConnection: 'Naga traditional music is predominantly pentatonic. The bamboo flute of Nagaland plays five-note scales that resemble the major pentatonic pattern, sometimes with microtonal inflections that sit between Western semitones. When multiple flutes play together in a Naga festival, the pentatonic scale ensures harmonious blending even without formal training in harmony. The five-note constraint is not a limitation — it is a design feature that makes communal music-making robust and beautiful.',
      checkQuestion: 'If the fundamental of a bamboo flute is 490 Hz (approximately B4), what are the frequencies of the major pentatonic scale starting from that note?',
      checkAnswer: 'Major pentatonic intervals from the root: unison (1:1), major 2nd (9:8), major 3rd (5:4), perfect 5th (3:2), major 6th (5:3). Frequencies: 490 Hz, 551.3 Hz (490*9/8), 612.5 Hz (490*5/4), 735 Hz (490*3/2), 816.7 Hz (490*5/3). In equal temperament these would be slightly different, but the just-intonation ratios are what Naga flute makers approximate by ear.',
      codeIntro: 'Build musical scales from frequency ratios and visualize the difference between just intonation and equal temperament.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fundamental frequency ratios for just intonation
just_ratios = {
    'Unison': 1/1,
    'Minor 2nd': 16/15,
    'Major 2nd': 9/8,
    'Minor 3rd': 6/5,
    'Major 3rd': 5/4,
    'Perfect 4th': 4/3,
    'Tritone': 45/32,
    'Perfect 5th': 3/2,
    'Minor 6th': 8/5,
    'Major 6th': 5/3,
    'Minor 7th': 9/5,
    'Major 7th': 15/8,
    'Octave': 2/1,
}

# Equal temperament: each semitone = 2^(n/12)
et_semitones = np.arange(0, 13)
et_ratios = 2 ** (et_semitones / 12)
et_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C']

# Scales as semitone patterns
scales = {
    'Major (W-W-H-W-W-W-H)': [0, 2, 4, 5, 7, 9, 11, 12],
    'Minor (W-H-W-W-H-W-W)': [0, 2, 3, 5, 7, 8, 10, 12],
    'Major pentatonic': [0, 2, 4, 7, 9, 12],
    'Minor pentatonic': [0, 3, 5, 7, 10, 12],
    'Naga folk (approx.)': [0, 2, 4, 7, 9, 12],  # Similar to major pentatonic
}

f0 = 490  # B4-ish, a common bamboo flute fundamental

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Just intonation vs equal temperament
ax = axes[0, 0]
just_cents = [1200 * np.log2(r) for r in just_ratios.values()]
et_cents = [1200 * np.log2(r) for r in et_ratios]
just_names_short = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']

# Difference between just and equal temperament in cents
diffs = [j - e for j, e in zip(just_cents, et_cents)]
colors_diff = ['#4ade80' if abs(d) < 5 else '#fbbf24' if abs(d) < 15 else '#f87171' for d in diffs]
ax.bar(range(13), diffs, color=colors_diff, edgecolor='white', linewidth=0.5)
ax.set_xticks(range(13))
ax.set_xticklabels(just_names_short, fontsize=8, color='white')
ax.set_ylabel('Deviation (cents)', color='white')
ax.set_title('Just intonation vs equal temperament', color='white', fontsize=11)
ax.axhline(0, color='gray', linewidth=0.5)
ax.text(6, max(diffs) * 0.8, 'Green: <5 cents (inaudible)\\\nYellow: 5-15 cents (subtle)\\\nRed: >15 cents (noticeable)',
        fontsize=7, color='white', ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='gray'))

# 2. Scales on a pitch circle
ax2 = axes[0, 1]
theta = np.linspace(0, 2 * np.pi, 13)[:-1]  # 12 equally spaced points
circle_x = np.cos(theta - np.pi / 2)
circle_y = np.sin(theta - np.pi / 2)

# Draw the chromatic circle
ax2.plot(np.append(circle_x, circle_x[0]), np.append(circle_y, circle_y[0]),
         'o-', color='gray', markersize=6, linewidth=0.5, alpha=0.3)
for i, name in enumerate(et_names[:-1]):
    ax2.text(circle_x[i] * 1.15, circle_y[i] * 1.15, name, fontsize=8,
             color='gray', ha='center', va='center')

# Overlay pentatonic scale
penta = scales['Major pentatonic'][:-1]  # exclude repeated octave
penta_x = [circle_x[i] for i in penta]
penta_y = [circle_y[i] for i in penta]
penta_x.append(penta_x[0])
penta_y.append(penta_y[0])
ax2.fill(penta_x, penta_y, alpha=0.15, color='#4ade80')
ax2.plot(penta_x, penta_y, 'o-', color='#4ade80', markersize=10, linewidth=2, label='Pentatonic')

# Overlay major scale
major = scales['Major (W-W-H-W-W-W-H)'][:-1]
major_x = [circle_x[i] for i in major]
major_y = [circle_y[i] for i in major]
major_x.append(major_x[0])
major_y.append(major_y[0])
ax2.plot(major_x, major_y, 's--', color='#60a5fa', markersize=7, linewidth=1.5, alpha=0.7, label='Major')

ax2.set_xlim(-1.5, 1.5)
ax2.set_ylim(-1.5, 1.5)
ax2.set_aspect('equal')
ax2.set_title('Scales on the pitch circle', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='lower right')
ax2.axis('off')

# 3. Consonance: waveform alignment for different intervals
ax3 = axes[1, 0]
sr = 44100
t = np.linspace(0, 0.02, int(sr * 0.02))

intervals = [
    ('Octave (2:1)', 2/1, '#4ade80'),
    ('Fifth (3:2)', 3/2, '#60a5fa'),
    ('Tritone (45:32)', 45/32, '#f87171'),
]

for i, (name, ratio, color) in enumerate(intervals):
    combined = np.sin(2 * np.pi * f0 * t) + np.sin(2 * np.pi * f0 * ratio * t)
    offset = i * 3
    ax3.plot(t * 1000, combined + offset, color=color, linewidth=1, label=name)
    ax3.axhline(offset, color='gray', linewidth=0.3, alpha=0.3)

ax3.set_xlabel('Time (ms)', color='white')
ax3.set_title('Consonance vs dissonance (combined waveforms)', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.set_yticks([])

# 4. Bamboo flute pentatonic scale — frequencies and intervals
ax4 = axes[1, 1]
penta_just_ratios = [1, 9/8, 5/4, 3/2, 5/3]
penta_note_names = ['Root', 'Maj 2nd', 'Maj 3rd', 'Perf 5th', 'Maj 6th']
penta_freqs = [f0 * r for r in penta_just_ratios]
penta_et_freqs = [f0 * 2 ** (s / 12) for s in [0, 2, 4, 7, 9]]

x = range(len(penta_note_names))
ax4.bar([xi - 0.15 for xi in x], penta_freqs, 0.3, color='#4ade80', label='Just intonation')
ax4.bar([xi + 0.15 for xi in x], penta_et_freqs, 0.3, color='#60a5fa', label='Equal temperament')

for xi, fj, fe in zip(x, penta_freqs, penta_et_freqs):
    diff_cents = 1200 * np.log2(fj / fe)
    ax4.text(xi, max(fj, fe) + 10, f'{diff_cents:+.1f}c', fontsize=8, color='white', ha='center')

ax4.set_xticks(list(x))
ax4.set_xticklabels(penta_note_names, fontsize=9, color='white')
ax4.set_ylabel('Frequency (Hz)', color='white')
ax4.set_title(f'Naga bamboo flute pentatonic scale (root = {f0} Hz)', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Pentatonic scale from {f0} Hz (just intonation):")
for name, ratio, freq in zip(penta_note_names, penta_just_ratios, penta_freqs):
    print(f"  {name:<12s}  ratio {ratio:<6.3f}  freq {freq:.1f} Hz")
print(f"\\\nThe pentatonic scale avoids semitone intervals,")
print(f"making it universally consonant across all cultures.")
print(f"Naga tribal music uses this same 5-note framework.")`,
      challenge: 'Implement the Pythagorean comma: stack 12 perfect fifths (each 3:2) and compare to 7 octaves (2^7). The mismatch shows why equal temperament was invented. How big is the difference in cents?',
      successHint: '12 perfect fifths = (3/2)^12 = 129.746. 7 octaves = 2^7 = 128. The difference is the Pythagorean comma: 129.746/128 = 1.01364, or about 23.5 cents. This is nearly a quarter of a semitone — clearly audible. Equal temperament shrinks each fifth by ~2 cents to make the circle close perfectly.',
    },
    {
      title: 'Sound synthesis methods',
      concept: `Sound synthesis is the art of generating audio waveforms electronically (or computationally). Four major methods:

**1. Additive synthesis:** Build a sound by summing individual sine waves (harmonics). Based on Fourier's theorem: any periodic sound can be decomposed into a sum of sines. You control the amplitude, frequency, and phase of each harmonic independently. Powerful but computationally expensive for complex sounds.

**2. Subtractive synthesis:** Start with a harmonically rich waveform (sawtooth, square, noise) and remove frequencies using filters. A low-pass filter removes high harmonics (makes the sound darker/warmer). A high-pass filter removes bass. Resonant filters boost a narrow band, creating "wah" effects. This is the basis of classic analog synthesizers.

**3. FM synthesis (frequency modulation):** One oscillator (modulator) controls the frequency of another (carrier). When the modulator frequency is in the audio range, it creates complex sidebands that produce metallic, bell-like, or percussive timbres. The ratio of carrier:modulator frequencies determines the harmonic content. FM synthesis can create sounds that additive synthesis would need hundreds of harmonics to replicate.

**4. Wavetable synthesis:** Store one cycle of a complex waveform in a table and read through it repeatedly. You can morph between different wavetables to create evolving timbres. Modern wavetable synths store hundreds of waveforms and interpolate between them in real time.

Each method has strengths: additive for precision, subtractive for warmth, FM for metallic/bell tones, wavetable for evolving textures.`,
      analogy: 'Think of painting. Additive synthesis is like pointillism — you place individual dots of color (sine waves) that merge into an image when viewed from distance. Subtractive synthesis is like sculpture — you start with a block of marble (rich waveform) and chisel away material (filter frequencies). FM synthesis is like interference patterns in water — two simple ripples create complex, unexpected patterns. Wavetable is like a flipbook — you cycle through pre-drawn frames.',
      storyConnection: 'A bamboo flute is a natural additive synthesizer: the air column produces a fundamental plus specific harmonics whose amplitudes depend on the bore shape, finger hole positions, and blowing pressure. If you wanted to recreate the sound of a Naga bamboo flute electronically, you would measure its harmonic spectrum and use additive synthesis to reconstruct it. FM synthesis could approximate the breathy attack transient. The goal of sound synthesis is to understand natural sounds deeply enough to recreate and transform them.',
      checkQuestion: 'Why can FM synthesis produce bell-like sounds that would require dozens of harmonics in additive synthesis?',
      checkAnswer: 'FM synthesis generates sidebands at frequencies carrier +/- n*modulator for all integer n. When the carrier:modulator ratio is not a simple integer (e.g., 1:1.414), the sidebands fall at inharmonic frequencies — exactly what gives bells their metallic, non-periodic quality. In additive synthesis, you would need to manually specify each of these inharmonic frequencies and their amplitudes. FM generates them automatically from just two oscillators.',
      codeIntro: 'Implement all four synthesis methods and compare their spectral characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sr = 44100
duration = 0.05  # 50ms for visualization
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
f0 = 490  # Bamboo flute fundamental

fig, axes = plt.subplots(4, 2, figsize=(14, 16))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# ---- 1. ADDITIVE SYNTHESIS ----
# Bamboo flute approximation: fundamental + decaying harmonics
harmonics_amps = [(1, 1.0), (2, 0.35), (3, 0.15), (4, 0.08), (5, 0.04), (6, 0.03)]
additive = np.zeros_like(t)
for n, amp in harmonics_amps:
    additive += amp * np.sin(2 * np.pi * f0 * n * t)
additive /= np.max(np.abs(additive))

axes[0, 0].plot(t * 1000, additive, color='#4ade80', linewidth=1)
axes[0, 0].set_title('Additive: Bamboo flute (6 harmonics)', color='white', fontsize=10)
axes[0, 0].set_xlabel('Time (ms)', color='white')

# Spectrum
freqs_fft = np.fft.rfftfreq(len(t), 1 / sr)
spectrum = np.abs(np.fft.rfft(additive))
axes[0, 1].plot(freqs_fft[:500], spectrum[:500], color='#4ade80', linewidth=1)
axes[0, 1].set_title('Additive spectrum', color='white', fontsize=10)
axes[0, 1].set_xlabel('Frequency (Hz)', color='white')

# ---- 2. SUBTRACTIVE SYNTHESIS ----
# Start with sawtooth, apply simple low-pass filter
sawtooth = 2 * (f0 * t % 1) - 1

# Simple moving average as crude low-pass
kernel_size = 5
kernel = np.ones(kernel_size) / kernel_size
subtractive = np.convolve(sawtooth, kernel, mode='same')
subtractive /= np.max(np.abs(subtractive))

axes[1, 0].plot(t * 1000, sawtooth, color='gray', linewidth=0.5, alpha=0.5, label='Raw sawtooth')
axes[1, 0].plot(t * 1000, subtractive, color='#60a5fa', linewidth=1, label='Filtered')
axes[1, 0].set_title('Subtractive: Filtered sawtooth', color='white', fontsize=10)
axes[1, 0].set_xlabel('Time (ms)', color='white')
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

spectrum_sub = np.abs(np.fft.rfft(subtractive))
spectrum_raw = np.abs(np.fft.rfft(sawtooth))
axes[1, 1].plot(freqs_fft[:500], spectrum_raw[:500], color='gray', linewidth=0.5, alpha=0.5, label='Unfiltered')
axes[1, 1].plot(freqs_fft[:500], spectrum_sub[:500], color='#60a5fa', linewidth=1, label='Low-pass filtered')
axes[1, 1].set_title('Subtractive spectrum', color='white', fontsize=10)
axes[1, 1].set_xlabel('Frequency (Hz)', color='white')
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# ---- 3. FM SYNTHESIS ----
# Bell-like sound: carrier:modulator ratio = 1:1.414 (inharmonic)
carrier_freq = f0
mod_freq = f0 * 1.414  # irrational ratio for bell character
mod_index = 5  # higher = more sidebands

fm = np.sin(2 * np.pi * carrier_freq * t + mod_index * np.sin(2 * np.pi * mod_freq * t))

axes[2, 0].plot(t * 1000, fm, color='#f97316', linewidth=1)
axes[2, 0].set_title(f'FM: Bell (c={carrier_freq:.0f}, m={mod_freq:.0f} Hz, idx={mod_index})', color='white', fontsize=10)
axes[2, 0].set_xlabel('Time (ms)', color='white')

spectrum_fm = np.abs(np.fft.rfft(fm))
axes[2, 1].plot(freqs_fft[:1000], spectrum_fm[:1000], color='#f97316', linewidth=1)
axes[2, 1].set_title('FM spectrum (inharmonic sidebands)', color='white', fontsize=10)
axes[2, 1].set_xlabel('Frequency (Hz)', color='white')

# ---- 4. WAVETABLE SYNTHESIS ----
# Create a wavetable by blending two different single-cycle waveforms
table_size = 2048
wt_t = np.linspace(0, 2 * np.pi, table_size, endpoint=False)

# Wavetable A: smooth flute-like
wt_a = np.sin(wt_t) + 0.3 * np.sin(2 * wt_t) + 0.1 * np.sin(3 * wt_t)
wt_a /= np.max(np.abs(wt_a))

# Wavetable B: buzzy/nasal
wt_b = np.sin(wt_t) + 0.5 * np.sin(3 * wt_t) + 0.3 * np.sin(5 * wt_t) + 0.2 * np.sin(7 * wt_t)
wt_b /= np.max(np.abs(wt_b))

# Morph from A to B over time
n_samples = len(t)
morph = np.linspace(0, 1, n_samples)
wavetable_signal = np.zeros(n_samples)
for i in range(n_samples):
    # Phase position in wavetable
    phase = (f0 * t[i] * table_size) % table_size
    idx = int(phase)
    frac = phase - idx
    # Interpolated wavetable
    wt_current = (1 - morph[i]) * wt_a + morph[i] * wt_b
    wavetable_signal[i] = wt_current[idx] * (1 - frac) + wt_current[(idx + 1) % table_size] * frac

wavetable_signal /= np.max(np.abs(wavetable_signal))

axes[3, 0].plot(t * 1000, wavetable_signal, color='#a78bfa', linewidth=1)
axes[3, 0].set_title('Wavetable: Morphing flute -> nasal', color='white', fontsize=10)
axes[3, 0].set_xlabel('Time (ms)', color='white')

spectrum_wt = np.abs(np.fft.rfft(wavetable_signal))
axes[3, 1].plot(freqs_fft[:500], spectrum_wt[:500], color='#a78bfa', linewidth=1)
axes[3, 1].set_title('Wavetable spectrum', color='white', fontsize=10)
axes[3, 1].set_xlabel('Frequency (Hz)', color='white')

for row in axes:
    for ax in row:
        ax.set_ylabel('Amplitude', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Synthesis method comparison:")
print(f"  Additive:    Sum of {len(harmonics_amps)} sines -> clean bamboo flute tone")
print(f"  Subtractive: Sawtooth + low-pass -> warm, analog character")
print(f"  FM:          2 oscillators -> complex bell/metallic timbre")
print(f"  Wavetable:   Morphing tables -> evolving, animated texture")
print()
print("To recreate the bamboo flute of Nagaland electronically:")
print("  1. Measure its harmonic spectrum (additive model)")
print("  2. FM for the breathy attack transient")
print("  3. Wavetable for the evolving sustain as breath pressure varies")`,
      challenge: 'Implement a simple resonant filter for subtractive synthesis: boost frequencies near a "resonant frequency" while cutting others. Apply it to white noise to create a vowel-like sound (hint: vocal formants are at ~500 Hz for "ah" and ~300 Hz for "oo").',
      successHint: 'A resonant filter applied to noise creates formant-like peaks — exactly how the human vocal tract works. The throat and mouth shape the broadband noise of the vocal cords into specific vowel sounds. Subtractive synthesis with resonant filters can model any sound that starts as broadband noise and gets shaped by resonance: wind instruments, voices, and even some bamboo flute timbres.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Sound Physics Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (sound wave fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real acoustics and synthesis implementations. Click to start.</p>
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
