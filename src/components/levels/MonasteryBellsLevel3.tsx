import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BellHarmonicsDiagram from '../diagrams/BellHarmonicsDiagram';
import BellFourierDiagram from '../diagrams/BellFourierDiagram';
import BellFrequencyDiagram from '../diagrams/BellFrequencyDiagram';
import BellSoundWaveDiagram from '../diagrams/BellSoundWaveDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import ActivityBellStrikeDiagram from '../diagrams/ActivityBellStrikeDiagram';

export default function MonasteryBellsLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Modal analysis \u2014 how a bell vibrates in 2D',
      concept: `In Levels 1 and 2 you treated standing waves as one-dimensional (a vibrating string). But a bell is a **two-dimensional** vibrating surface. Its rim can vibrate in patterns called **modes**, described by two numbers: (m, n) where m counts nodal lines around the circumference and n counts nodal circles from rim to crown.

The simplest mode (2,0) has 4 nodal points around the rim \u2014 the bell flexes into an ellipse. Mode (3,0) has 6 nodal points \u2014 a triangular shape. Mode (4,0) has 8 nodal points. Each mode has its own frequency.

A bell\u2019s sound is the superposition of all excited modes. The specific ratios between mode frequencies determine whether the bell sounds harmonious or dissonant. Bell-makers manipulate these ratios by adjusting the bell\u2019s profile (wall thickness at different heights).

The code computes and visualises these 2D vibration patterns.`,
      analogy: 'Sprinkle sand on a metal plate and bow the edge with a violin bow. The sand collects at the nodal lines (where the plate does not vibrate) and bounces away from the antinodes (where it vibrates most). These patterns, called Chladni figures, are the 2D equivalent of the nodes on a vibrating string.',
      storyConnection: 'A master bell-maker would recognise each mode by ear. Tapping the bell at different points excites different mode combinations. Dr. Lhamo\u2019s analysis of Sangha would have shown that the crack disrupted specific modes \u2014 those whose nodal lines pass near the crack location.',
      checkQuestion: 'If you touch a vibrating bell at a nodal point, what happens to the sound?',
      checkAnswer: 'The modes that have a node at that point are unaffected (they are already not vibrating there). But modes that have an antinode at that point are damped \u2014 you remove energy from those modes. The timbre changes because the balance of harmonics shifts. This is how bell-makers test which modes are active.',
      codeIntro: 'Visualise 2D vibration modes of a circular bell rim.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bell rim vibration modes
# Mode (m, n): m nodal diameters, n nodal circles
# For simplicity, we show modes on a circular cross-section

theta = np.linspace(0, 2 * np.pi, 500)

fig, axes = plt.subplots(2, 3, figsize=(12, 8))

modes = [
    (2, 0, 'Mode (2,0): 4 nodes'), (3, 0, 'Mode (3,0): 6 nodes'),
    (4, 0, 'Mode (4,0): 8 nodes'), (5, 0, 'Mode (5,0): 10 nodes'),
    (2, 1, 'Mode (2,1): 4+ring'),  (3, 1, 'Mode (3,1): 6+ring'),
]

# Approximate frequencies relative to fundamental
freq_ratios = [1.0, 1.56, 2.09, 2.56, 3.65, 4.28]

for idx, (m, n, title) in enumerate(modes):
    ax = axes[idx // 3][idx % 3]
    r = np.linspace(0.3, 1.0, 100)
    T, R = np.meshgrid(theta, r)

    # Radial component (simplified Bessel-like)
    radial = np.cos(n * np.pi * (R - 0.3) / 0.7) if n > 0 else np.ones_like(R)
    # Angular component
    displacement = radial * np.cos(m * T)

    # Convert to Cartesian for contour plot
    X = R * np.cos(T)
    Y = R * np.sin(T)

    c = ax.contourf(X, Y, displacement, levels=20, cmap='RdBu_r')
    ax.contour(X, Y, displacement, levels=[0], colors='white', linewidths=1.5)
    ax.set_aspect('equal')
    ax.set_title(f'{title}\\nf = {freq_ratios[idx]:.2f} × f₁', fontsize=10, color='white')
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.tick_params(labelsize=7)

plt.suptitle('Bell Rim Vibration Modes (white lines = nodes)', fontsize=14, color='white', y=1.02)
plt.tight_layout()
plt.show()

print("=== Bell Vibration Modes ===")
print("Red/blue = regions moving in opposite directions")
print("White lines = nodal lines (no movement)")
print()
for (m, n, title), fr in zip(modes, freq_ratios):
    f = 200 * fr
    print(f"  {title}: {f:.0f} Hz ({fr:.2f}× fundamental)")
print()
print("A well-tuned bell has specific ratios between these modes.")
print("A crack disrupts modes whose nodal lines pass near it.")`,
      challenge: 'For a tuned carillon bell, the ideal ratio for mode (3,0) is exactly 2\u00D7 the fundamental (an octave). Real bells deviate from this. Calculate the detuning in Hz if mode (3,0) is at 1.56\u00D7 instead of 2.0\u00D7. How many cents off is that? (1 cent = one hundredth of a semitone.)',
      successHint: 'Modal analysis is used to design everything from bells to guitar bodies to airplane wings. Understanding how a 2D surface vibrates is the bridge between simple wave theory and real engineering.',
    },
    {
      title: 'Windowed FFT \u2014 how bell sound evolves over time',
      concept: `A bell\u2019s sound is not static. In the first millisecond, the strike excites all modes with a burst of broadband noise. Over the next second, high harmonics decay faster than low ones (higher frequency = more energy lost per cycle). The fundamental lingers longest.

A standard FFT gives you the frequency content of the **entire** signal. But to see how the spectrum changes over time, you need a **Short-Time Fourier Transform (STFT)** \u2014 also called a spectrogram. It slices the signal into short windows and applies FFT to each one.

The result is a 2D plot: time on x-axis, frequency on y-axis, colour representing amplitude. You can literally see harmonics fading from top to bottom as the bell decays.

The code generates a realistic bell signal with decaying harmonics and computes its spectrogram.`,
      analogy: 'A photograph captures a scene at one instant. A video captures how it changes over time. An FFT is a photograph of the frequency content. A spectrogram is a video \u2014 it shows you the frequency content frame by frame as the sound evolves.',
      storyConnection: 'Dr. Lhamo\u2019s laptop showed the frequency spectrum as a series of bars. A more advanced view would be the spectrogram, where she could watch Sangha\u2019s cracked harmonics wobble and split over time \u2014 each beat frequency visible as a pulsing band in the spectrogram.',
      checkQuestion: 'Why do high harmonics in a bell decay faster than the fundamental?',
      checkAnswer: 'Higher frequency vibrations involve more rapid flexing of the metal. Each flex cycle dissipates energy through internal friction (hysteresis) in the bronze. More cycles per second = more energy lost per second. Additionally, higher frequencies radiate sound more efficiently (radiation resistance increases with f\u00B2), which means they transfer energy to the air faster. Both effects cause high harmonics to decay more quickly.',
      codeIntro: 'Generate a decaying bell sound and visualise its spectrogram.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate a realistic bell sound with decaying harmonics
fundamental = 200  # Hz
sample_rate = 44100
duration = 3.0  # seconds
t = np.linspace(0, duration, int(sample_rate * duration))

# Each harmonic decays at a different rate (higher = faster decay)
bell = np.zeros_like(t)
harmonics_info = []
for n in range(1, 9):
    freq = n * fundamental
    amplitude = 1.0 / n
    decay_rate = n * 1.5  # higher harmonics decay faster
    harmonic = amplitude * np.exp(-decay_rate * t) * np.sin(2 * np.pi * freq * t)
    bell += harmonic
    harmonics_info.append((n, freq, amplitude, decay_rate))

# Add initial strike noise (brief broadband burst)
noise_duration = 0.01  # 10 ms
noise_samples = int(noise_duration * sample_rate)
strike_noise = np.zeros_like(t)
strike_noise[:noise_samples] = 0.5 * np.random.randn(noise_samples) * np.exp(-np.linspace(0, 5, noise_samples))
bell += strike_noise

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 10))

# Waveform
ax1.plot(t, bell, color='#a855f7', linewidth=0.3)
ax1.set_xlabel('Time (s)', fontsize=10)
ax1.set_ylabel('Amplitude', fontsize=10)
ax1.set_title('Bell Waveform \u2014 Notice the Decay', fontsize=12)
ax1.grid(alpha=0.2)

# Spectrogram (STFT)
window_size = 2048
overlap = window_size // 2

# Manual STFT
num_windows = (len(bell) - window_size) // (window_size - overlap)
spec = np.zeros((window_size // 2, num_windows))
times_stft = np.zeros(num_windows)

for i in range(num_windows):
    start = i * (window_size - overlap)
    window = bell[start:start + window_size] * np.hanning(window_size)
    fft_vals = np.abs(np.fft.fft(window))[:window_size // 2]
    spec[:, i] = fft_vals
    times_stft[i] = (start + window_size / 2) / sample_rate

freqs_stft = np.fft.fftfreq(window_size, 1/sample_rate)[:window_size // 2]

# Limit to 0-2000 Hz
freq_mask = freqs_stft < 2000
ax2.pcolormesh(times_stft, freqs_stft[freq_mask], spec[freq_mask, :],
              cmap='magma', shading='gouraud')
for n in range(1, 9):
    ax2.axhline(n * fundamental, color='white', linewidth=0.5, alpha=0.3)
    ax2.text(2.8, n * fundamental + 10, f'{n}f={n*fundamental}Hz',
            fontsize=7, color='white', alpha=0.7)
ax2.set_xlabel('Time (s)', fontsize=10)
ax2.set_ylabel('Frequency (Hz)', fontsize=10)
ax2.set_title('Spectrogram \u2014 High Harmonics Fade First', fontsize=12)

# Decay rates
for n, freq, amp, decay in harmonics_info:
    envelope = amp * np.exp(-decay * t)
    ax3.plot(t, envelope, linewidth=1.5, label=f'{n}× ({freq} Hz)')

ax3.set_xlabel('Time (s)', fontsize=10)
ax3.set_ylabel('Amplitude envelope', fontsize=10)
ax3.set_title('Decay Rates of Each Harmonic', fontsize=12)
ax3.legend(fontsize=7, ncol=4)
ax3.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Harmonic Decay Analysis ===")
for n, freq, amp, decay in harmonics_info:
    half_life = np.log(2) / decay
    print(f"  Harmonic {n} ({freq} Hz): half-life = {half_life:.2f}s")`,
      challenge: 'Modify the code so that the 3rd harmonic has a slightly wrong frequency (e.g., 590 Hz instead of 600 Hz). In the spectrogram, can you see the beat pattern as a pulsing band? This simulates what Dr. Lhamo would see when analysing Sangha.',
      successHint: 'Spectrograms are the standard tool for analysing any time-varying signal: speech recognition, music analysis, earthquake detection, medical monitoring. The ability to see frequency content evolve over time is indispensable.',
    },
    {
      title: 'Impedance matching \u2014 why bell shape matters',
      concept: `A bell is not just a piece of metal that vibrates. It is a precision-engineered **transducer** that converts mechanical vibration into acoustic radiation. The bell\u2019s shape determines how efficiently it transfers energy from the vibrating metal to the surrounding air.

**Acoustic impedance** is the resistance a medium presents to a sound wave. Metal has very high impedance; air has very low impedance. When there is a mismatch, most energy bounces back instead of transmitting. This is why you can barely hear a vibrating tuning fork held in the air \u2014 but press it against a table, and the room fills with sound.

A bell\u2019s flared shape acts as an **impedance transformer**. The vibrating rim couples to the air through a large surface area, gradually transitioning from the high impedance of bronze to the low impedance of air. The flare is not decorative \u2014 it is acoustic engineering.`,
      analogy: 'Think of a funnel. Pouring water from a wide bucket into a narrow pipe is inefficient \u2014 most water splashes back. But a funnel smoothly transitions from wide to narrow, directing nearly all the water into the pipe. A bell\u2019s shape is an acoustic funnel, matching the \u201Cwide\u201D impedance of metal to the \u201Cnarrow\u201D impedance of air.',
      storyConnection: 'Tawang\u2019s bell-makers spent generations perfecting bell profiles. They did not know the word \u201Cimpedance,\u201D but they knew that certain shapes projected sound further. The monastery\u2019s bells have a specific flare and wall thickness profile that maximises acoustic output \u2014 empirical impedance matching.',
      checkQuestion: 'Why does pressing a tuning fork against a table make it louder?',
      checkAnswer: 'The fork alone has a tiny surface area and cannot push much air. The table has a large, flat surface. When the fork vibrates the table, the table\u2019s large surface pushes a much bigger volume of air. The table acts as an impedance-matching surface, converting the fork\u2019s high-impedance vibration into a low-impedance acoustic wave efficiently. The sound dies faster though, because energy transfers to air more quickly.',
      codeIntro: 'Model how bell shape affects acoustic radiation efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Acoustic radiation efficiency depends on the ratio
# of vibrating surface size to wavelength
# Radiation efficiency η ≈ (ka)² / (1 + (ka)²)
# where k = 2π/λ, a = effective radius

frequencies = np.linspace(50, 3000, 500)
v = 334  # m/s at Tawang

# Three scenarios: tuning fork, small bell, large bell
sources = [
    ('Tuning fork (a=0.5cm)', 0.005, '#6b7280'),
    ('Small bell (a=10cm)', 0.10, '#3b82f6'),
    ('Sangha (a=40cm)', 0.40, '#f59e0b'),
    ('Ideal radiator (a=∞)', 100, '#10b981'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for name, a, color in sources:
    k = 2 * np.pi * frequencies / v
    ka = k * a
    efficiency = ka**2 / (1 + ka**2)
    ax1.plot(frequencies, efficiency * 100, linewidth=2, color=color, label=name)

ax1.set_xlabel('Frequency (Hz)', fontsize=10)
ax1.set_ylabel('Radiation efficiency (%)', fontsize=10)
ax1.set_title('How Efficiently Does the Source Radiate?', fontsize=12)
ax1.legend(fontsize=8)
ax1.grid(alpha=0.3)

# Bell profile cross-section
# Typical bell profile: y = thickness as function of height
heights = np.linspace(0, 1, 200)  # 0=rim, 1=crown
# Bell wall (outer)
outer = 0.5 * (1 - 0.3 * heights**0.5)
# Bell wall (inner) — thicker at rim (soundbow), thinner at waist
thickness = 0.04 + 0.06 * np.exp(-((heights - 0.1) / 0.15)**2)
inner = outer - thickness

ax2.fill_betweenx(heights, outer, inner, color='#f59e0b', alpha=0.6, label='Bronze wall')
ax2.fill_betweenx(heights, -outer, -inner, color='#f59e0b', alpha=0.6)
ax2.plot(outer, heights, color='#b45309', linewidth=2)
ax2.plot(inner, heights, color='#b45309', linewidth=2)
ax2.plot(-outer, heights, color='#b45309', linewidth=2)
ax2.plot(-inner, heights, color='#b45309', linewidth=2)

# Labels
ax2.annotate('Soundbow\\n(thickest)', xy=(0.45, 0.1), fontsize=9, color='lightgray',
            arrowprops=dict(arrowstyle='->', color='lightgray'), xytext=(0.6, 0.15))
ax2.annotate('Waist\\n(thinnest)', xy=(0.35, 0.5), fontsize=9, color='lightgray',
            arrowprops=dict(arrowstyle='->', color='lightgray'), xytext=(0.6, 0.5))
ax2.annotate('Crown', xy=(0.15, 0.95), fontsize=9, color='lightgray',
            arrowprops=dict(arrowstyle='->', color='lightgray'), xytext=(0.5, 0.9))

ax2.set_xlabel('Radius (normalized)', fontsize=10)
ax2.set_ylabel('Height (normalized)', fontsize=10)
ax2.set_title('Bell Profile Cross-Section', fontsize=12)
ax2.set_aspect('equal')
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("=== Impedance Matching ===")
print("The bell's shape gradually transitions from high-impedance")
print("metal vibration to low-impedance air radiation.")
print()
print("Radiation efficiency at 200 Hz:")
for name, a, _ in sources:
    k = 2 * np.pi * 200 / v
    ka = k * a
    eff = ka**2 / (1 + ka**2)
    print(f"  {name}: {eff*100:.1f}%")`,
      challenge: 'Church bells have a different profile from Tibetan singing bowls. Research the two shapes and hypothesise how the profile difference affects which modes are emphasised. Can you modify the profile to simulate a singing bowl?',
      successHint: 'Impedance matching is a universal engineering concept. It appears in audio speaker design, antenna engineering, optical coatings, and even in how your ear\u2019s middle ear bones match the impedance of air to the fluid-filled cochlea.',
    },
    {
      title: 'Psychoacoustics \u2014 how your brain hears a bell',
      concept: `Your ear does not hear frequencies directly. The cochlea (inner ear) performs a mechanical Fourier transform: different positions along the basilar membrane respond to different frequencies. High frequencies excite the base; low frequencies excite the tip.

But **perception** is more complex than detection. Your brain performs additional processing:
- **Missing fundamental**: if a bell produces harmonics at 400, 600, 800 Hz but the 200 Hz fundamental is removed, you still \u201Chear\u201D 200 Hz. Your brain infers the fundamental from the pattern of harmonics.
- **Loudness perception**: 3 dB increase doubles intensity, but you need about 10 dB to perceive \u201Ctwice as loud.\u201D
- **Masking**: a loud tone at 200 Hz makes nearby frequencies (180-220 Hz) inaudible.

The code demonstrates the missing fundamental phenomenon and equal-loudness contours.`,
      analogy: 'Your brain is like a detective solving a puzzle. It does not need to see every clue \u2014 it can infer the missing piece from the pattern. If someone hums harmonics at 400, 600, and 800 Hz, your brain \u201Csees\u201D the pattern (all multiples of 200) and fills in the missing fundamental. You hear a note at 200 Hz even though no energy exists at that frequency.',
      storyConnection: 'When Dorji heard the bells, his auditory cortex was performing millions of computations per second: separating the bell from wind noise, tracking the decay envelope, identifying which bell it was by its harmonic signature. The \u201Cbeauty\u201D of the bell\u2019s tone is not in the physics alone \u2014 it is in how the brain processes the physics.',
      checkQuestion: 'Small speakers (like phone speakers) cannot reproduce low bass notes. Yet you can still hear the bass line of a song on your phone. How?',
      checkAnswer: 'The phone speaker cannot produce 80 Hz, but it CAN produce the harmonics: 160, 240, 320 Hz. Your brain detects these harmonics, recognises the pattern (multiples of 80), and infers the missing 80 Hz fundamental. You \u201Chear\u201D bass that the speaker never actually produced. This is the missing fundamental effect, and audio engineers exploit it to give small speakers perceived bass.',
      codeIntro: 'Explore psychoacoustic phenomena: missing fundamental and masking.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
duration = 0.05  # 50 ms for visualisation
t = np.linspace(0, duration, int(sample_rate * duration))

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 1. Full bell (with fundamental)
fundamental = 200
full_bell = sum(np.sin(2 * np.pi * n * fundamental * t) / n for n in range(1, 6))
axes[0, 0].plot(t * 1000, full_bell, color='#10b981', linewidth=1.5)
axes[0, 0].set_title('Full bell (200, 400, 600, 800, 1000 Hz)', fontsize=10, color='white')
axes[0, 0].set_ylabel('Pressure', fontsize=9)
axes[0, 0].grid(alpha=0.2)

# 2. Missing fundamental (no 200 Hz)
missing_fund = sum(np.sin(2 * np.pi * n * fundamental * t) / n for n in range(2, 6))
axes[0, 1].plot(t * 1000, missing_fund, color='#f59e0b', linewidth=1.5)
axes[0, 1].set_title('Missing fundamental (400, 600, 800, 1000 Hz)', fontsize=10, color='white')
axes[0, 1].set_ylabel('Pressure', fontsize=9)
axes[0, 1].grid(alpha=0.2)
axes[0, 1].text(25, 0, 'You still "hear" 200 Hz!', fontsize=10, color='#f59e0b',
               ha='center', style='italic')

# 3. FFT comparison
for ax, signal, title, color in [
    (axes[1, 0], full_bell, 'Spectrum: Full bell', '#10b981'),
    (axes[1, 1], missing_fund, 'Spectrum: Missing fundamental', '#f59e0b')]:
    fft = np.abs(np.fft.fft(signal))
    freqs = np.fft.fftfreq(len(t), 1/sample_rate)
    mask = (freqs > 0) & (freqs < 1500)
    ax.plot(freqs[mask], fft[mask] / fft[mask].max(), color=color, linewidth=2)
    ax.set_xlabel('Frequency (Hz)', fontsize=9)
    ax.set_ylabel('Amplitude', fontsize=9)
    ax.set_title(title, fontsize=10, color='white')
    ax.grid(alpha=0.3)

    for n in range(1, 6):
        ax.axvline(n * fundamental, color='white', linewidth=0.3, alpha=0.3)

# Highlight missing 200 Hz
axes[1, 1].annotate('No energy at 200 Hz!\\nBut brain still perceives it',
                    xy=(200, 0), xytext=(400, 0.5),
                    fontsize=9, color='#ef4444',
                    arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print("=== Missing Fundamental ===")
print("Full bell harmonics: 200, 400, 600, 800, 1000 Hz")
print("Missing-fundamental: 400, 600, 800, 1000 Hz (no 200!)")
print()
print("Your brain recognises the PATTERN (all multiples of 200)")
print("and infers the fundamental. You hear 200 Hz even though")
print("no acoustic energy exists at that frequency.")
print()
print("This is why phone speakers can produce 'bass' —")
print("they play the harmonics, and your brain fills in the rest.")`,
      challenge: 'Create a signal with harmonics at 500, 750, 1000, 1250 Hz. What fundamental does your brain infer? (Hint: find the greatest common divisor.) Now try 400, 600, 1000 Hz \u2014 is the inferred fundamental unambiguous?',
      successHint: 'Psychoacoustics reveals that hearing is not passive recording \u2014 it is active construction by the brain. Audio engineers exploit these perceptual shortcuts in MP3 compression, speaker design, and virtual surround sound.',
    },
    {
      title: 'The bell as a filter \u2014 transfer functions',
      concept: `When you strike a bell, the mallet delivers a brief impulse of force. That impulse contains ALL frequencies simultaneously (a perfect impulse has infinite bandwidth). The bell then selects which frequencies to amplify (its resonant modes) and which to suppress. The bell is acting as a **filter**.

The bell\u2019s **transfer function** H(f) describes how it transforms any input into output. If H(f) is large at 200 Hz, the bell amplifies that frequency. If H(f) is zero at 350 Hz, the bell suppresses it.

The output spectrum = input spectrum \u00D7 H(f).

This is the same mathematics used in audio equalisers, radio receivers, and digital signal processing. A bell is a mechanical band-pass filter.`,
      analogy: 'Think of a coffee filter. You pour in a mixture (water + coffee grounds). The filter lets water through but blocks grounds. A bell is a frequency filter: you pour in noise (the strike impulse contains all frequencies) and the bell lets through only its resonant frequencies while blocking everything else.',
      storyConnection: 'Every bell in the monastery is a different filter. The smallest lets through high frequencies; the largest lets through low ones. When all eight ring together, the combined sound is the sum of eight different filters applied to eight impulses \u2014 a rich acoustic tapestry.',
      checkQuestion: 'If you could strike a bell with a pure 200 Hz tone (instead of an impulse), what would happen?',
      checkAnswer: 'If 200 Hz is one of the bell\u2019s resonant frequencies, the bell would build up a strong vibration at 200 Hz (resonance). The output would be much louder than the input \u2014 the transfer function H(200) is large. If 200 Hz is NOT a resonant frequency, the bell would barely respond. This is selective amplification \u2014 the essence of filtering.',
      codeIntro: 'Model the bell as a filter and compute its transfer function.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bell transfer function: sum of resonant peaks
# Each mode contributes a Lorentzian peak
fundamental = 200
modes = [(n, fundamental * n, 5 * n, 1/n) for n in range(1, 8)]
# (mode number, frequency, bandwidth, amplitude)

frequencies = np.linspace(0, 2000, 5000)

# Build transfer function
H = np.zeros_like(frequencies)
for n, f0, bw, amp in modes:
    H += amp / np.sqrt(1 + ((frequencies - f0) / (bw/2))**2)

# Impulse response (FFT of transfer function)
# Simulate: impulse → bell → output
impulse = np.zeros(44100)
impulse[0] = 1.0

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Transfer function
axes[0, 0].plot(frequencies, H / H.max(), color='#f59e0b', linewidth=2)
for n, f0, bw, amp in modes:
    axes[0, 0].axvline(f0, color='white', linewidth=0.3, alpha=0.3)
    axes[0, 0].text(f0, 1.02, f'f{n}', fontsize=8, ha='center', color='lightgray')
axes[0, 0].set_xlabel('Frequency (Hz)', fontsize=10)
axes[0, 0].set_ylabel('|H(f)|', fontsize=10)
axes[0, 0].set_title('Bell Transfer Function (what it amplifies)', fontsize=11)
axes[0, 0].grid(alpha=0.3)

# Input spectrum (impulse = flat)
axes[0, 1].axhline(1, color='#3b82f6', linewidth=2)
axes[0, 1].set_xlabel('Frequency (Hz)', fontsize=10)
axes[0, 1].set_ylabel('Amplitude', fontsize=10)
axes[0, 1].set_title('Strike Impulse Spectrum (all frequencies)', fontsize=11)
axes[0, 1].set_xlim(0, 2000)
axes[0, 1].set_ylim(0, 1.5)
axes[0, 1].grid(alpha=0.3)
axes[0, 1].text(1000, 0.5, 'A perfect impulse\\ncontains ALL frequencies\\nequally', fontsize=10,
               ha='center', color='#3b82f6', style='italic')

# Output = Input × H(f)
output_spectrum = 1.0 * H  # impulse × transfer function
axes[1, 0].fill_between(frequencies, output_spectrum / output_spectrum.max(),
                        color='#10b981', alpha=0.4)
axes[1, 0].plot(frequencies, output_spectrum / output_spectrum.max(),
               color='#10b981', linewidth=2)
axes[1, 0].set_xlabel('Frequency (Hz)', fontsize=10)
axes[1, 0].set_ylabel('Amplitude', fontsize=10)
axes[1, 0].set_title('Output = Input × H(f) (what you hear)', fontsize=11)
axes[1, 0].grid(alpha=0.3)

# Different inputs produce different outputs
input_types = {
    'Impulse (hard mallet)': np.ones(500),
    'Soft mallet (low-pass)': np.exp(-frequencies[:500] / 500),
    'Singing bowl (rubbing)': np.exp(-((frequencies[:500] - 200) / 50)**2),
}

for name, input_spec in input_types.items():
    output = input_spec * H[:500] / H[:500].max()
    axes[1, 1].plot(frequencies[:500], output / output.max(),
                   linewidth=2, label=name)

axes[1, 1].set_xlabel('Frequency (Hz)', fontsize=10)
axes[1, 1].set_ylabel('Output amplitude', fontsize=10)
axes[1, 1].set_title('Different Strikes → Different Sounds', fontsize=11)
axes[1, 1].legend(fontsize=8)
axes[1, 1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Bell as a Filter ===")
print("Input: strike impulse (all frequencies)")
print("Filter: bell transfer function (resonant peaks)")
print("Output: Input × H(f) = only resonant frequencies survive")
print()
print("A hard mallet excites all modes equally.")
print("A soft mallet excites mainly low modes.")
print("Rubbing (singing bowl) drives one specific mode.")`,
      challenge: 'Create a \u201Ccracked bell\u201D transfer function by splitting each peak into two close peaks (e.g., 200 Hz becomes 198 + 202 Hz). Plot the new H(f) and compute the output. Can you see the beat-producing pairs?',
      successHint: 'Transfer functions are the backbone of signal processing. Every audio equaliser, radio receiver, and digital filter is described by H(f). A bell taught you the same maths that powers your phone\u2019s voice codec.',
    },
    {
      title: 'Digital audio \u2014 sampling the bell',
      concept: `To store a bell\u2019s sound on a computer, you must convert the continuous pressure wave into discrete numbers. This is **sampling**: measuring the wave\u2019s amplitude at regular intervals.

The **Nyquist-Shannon theorem** says: to perfectly reconstruct a signal, you must sample at least **twice** the highest frequency present. Human hearing goes to 20 kHz, so CD audio samples at 44,100 Hz (44.1 kHz) \u2014 just over twice 20 kHz.

If you sample too slowly (**undersampling**), high frequencies masquerade as low ones \u2014 a phenomenon called **aliasing**. A 10 kHz tone sampled at 8 kHz appears as a phantom 2 kHz tone.

The code demonstrates sampling, reconstruction, and aliasing using the bell signal.`,
      analogy: 'Imagine filming a spinning wheel. If the camera captures 24 frames per second and the wheel spins at exactly 12 revolutions per second (twice per frame), the wheel appears to stand still. If it spins faster \u2014 say 13 revolutions per second \u2014 it appears to spin slowly backward. That \u201Cbackward spin\u201D is aliasing: the sample rate is too low to capture the true motion.',
      storyConnection: 'Dr. Lhamo recorded the bells digitally. Her equipment sampled at 44,100 Hz \u2014 capturing frequencies up to 22,050 Hz, well above the bells\u2019 highest harmonics. If she had used a cheap recorder sampling at only 8,000 Hz (phone quality), harmonics above 4,000 Hz would alias, corrupting her frequency analysis.',
      checkQuestion: 'A bell produces harmonics up to 5,000 Hz. What is the minimum sample rate needed to record it without aliasing?',
      checkAnswer: '10,000 Hz (2 \u00D7 5,000). In practice, you would use a higher rate (e.g., 16,000 or 44,100 Hz) because the Nyquist theorem assumes perfect reconstruction, which requires an ideal anti-aliasing filter. Real filters need headroom. CD quality (44,100 Hz) provides comfortable margin for all audible frequencies.',
      codeIntro: 'Demonstrate sampling, reconstruction, and aliasing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Original bell signal (continuous approximation)
fundamental = 200
duration = 0.02  # 20 ms
t_continuous = np.linspace(0, duration, 100000)
bell_continuous = sum(np.sin(2 * np.pi * n * fundamental * t_continuous) / n
                     for n in range(1, 6))

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 1. Good sampling (44100 Hz)
sr_good = 44100
t_good = np.arange(0, duration, 1/sr_good)
bell_good = sum(np.sin(2 * np.pi * n * fundamental * t_good) / n for n in range(1, 6))

axes[0, 0].plot(t_continuous * 1000, bell_continuous, color='#6b7280', linewidth=0.5, alpha=0.5)
axes[0, 0].stem(t_good * 1000, bell_good, linefmt='#10b981', markerfmt='o',
               basefmt=' ', label=f'{sr_good} Hz sampling')
axes[0, 0].set_title(f'Good: {sr_good} Hz (Nyquist OK)', fontsize=11, color='white')
axes[0, 0].set_ylabel('Amplitude', fontsize=9)
axes[0, 0].set_xlim(0, 5)
axes[0, 0].legend(fontsize=8)
axes[0, 0].grid(alpha=0.2)

# 2. Marginal sampling (2000 Hz)
sr_marginal = 2000
t_marg = np.arange(0, duration, 1/sr_marginal)
bell_marg = sum(np.sin(2 * np.pi * n * fundamental * t_marg) / n for n in range(1, 6))

axes[0, 1].plot(t_continuous * 1000, bell_continuous, color='#6b7280', linewidth=0.5, alpha=0.5)
axes[0, 1].stem(t_marg * 1000, bell_marg, linefmt='#f59e0b', markerfmt='o',
               basefmt=' ', label=f'{sr_marginal} Hz sampling')
axes[0, 1].set_title(f'Marginal: {sr_marginal} Hz (barely OK for 1kHz)', fontsize=11, color='white')
axes[0, 1].set_ylabel('Amplitude', fontsize=9)
axes[0, 1].set_xlim(0, 5)
axes[0, 1].legend(fontsize=8)
axes[0, 1].grid(alpha=0.2)

# 3. Aliasing demo: undersample a pure tone
f_signal = 800  # Hz
sr_alias = 600  # Hz (below Nyquist!)
t_alias = np.arange(0, 0.01, 1/sr_alias)
t_fine = np.linspace(0, 0.01, 10000)

original = np.sin(2 * np.pi * f_signal * t_fine)
sampled = np.sin(2 * np.pi * f_signal * t_alias)

# The aliased frequency
f_alias = abs(f_signal - sr_alias)  # 800 - 600 = 200 Hz
aliased = np.sin(2 * np.pi * f_alias * t_fine)

axes[1, 0].plot(t_fine * 1000, original, color='#3b82f6', linewidth=1, alpha=0.5, label=f'True: {f_signal} Hz')
axes[1, 0].plot(t_fine * 1000, aliased, color='#ef4444', linewidth=2, label=f'Alias: {f_alias} Hz')
axes[1, 0].stem(t_alias * 1000, sampled, linefmt='#ef4444', markerfmt='o', basefmt=' ')
axes[1, 0].set_title(f'Aliasing: {f_signal} Hz sampled at {sr_alias} Hz', fontsize=11, color='white')
axes[1, 0].set_xlabel('Time (ms)', fontsize=9)
axes[1, 0].set_ylabel('Amplitude', fontsize=9)
axes[1, 0].legend(fontsize=8)
axes[1, 0].grid(alpha=0.2)

# 4. Nyquist diagram
sample_rates = np.linspace(100, 50000, 500)
max_freq = sample_rates / 2  # Nyquist frequency

axes[1, 1].plot(sample_rates / 1000, max_freq / 1000, color='#a855f7', linewidth=2.5)
axes[1, 1].axhline(20, color='#f59e0b', linewidth=1.5, linestyle='--')
axes[1, 1].text(35, 21, 'Human hearing limit (20 kHz)', fontsize=9, color='#f59e0b')
axes[1, 1].scatter([44.1], [22.05], color='white', edgecolor='#10b981', s=80, zorder=5, linewidth=2)
axes[1, 1].annotate('CD quality\\n44.1 kHz → 22.05 kHz max', xy=(44.1, 22.05),
                   xytext=(30, 25), fontsize=9, color='lightgray',
                   arrowprops=dict(arrowstyle='->', color='lightgray'))
axes[1, 1].set_xlabel('Sample rate (kHz)', fontsize=10)
axes[1, 1].set_ylabel('Max recordable frequency (kHz)', fontsize=10)
axes[1, 1].set_title('Nyquist Theorem: f_max = sample_rate / 2', fontsize=11)
axes[1, 1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Nyquist-Shannon Sampling Theorem ===")
print(f"To capture up to f_max, sample at ≥ 2 × f_max")
print()
for sr, name in [(8000, 'Phone'), (22050, 'FM radio'), (44100, 'CD'), (96000, 'Studio')]:
    print(f"  {name}: {sr} Hz → captures up to {sr//2} Hz")`,
      challenge: 'The bell\u2019s 5th harmonic is at 1000 Hz. What is the minimum sample rate to capture it? Record the bell at that rate and at half that rate. Compare the FFTs \u2014 can you spot the alias?',
      successHint: 'Sampling theory is the foundation of all digital audio, digital photography, and digital communications. Every time you record sound, take a photo, or stream video, the Nyquist theorem determines what quality you get.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced wave physics and signal processing</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced acoustics and signal processing. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[BellHarmonicsDiagram, BellFourierDiagram, BellFrequencyDiagram, BellSoundWaveDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i] ? createElement([BellHarmonicsDiagram, BellFourierDiagram, BellFrequencyDiagram, BellSoundWaveDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
