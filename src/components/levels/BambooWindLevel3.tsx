import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BambooWindLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Standing waves & harmonics',
      concept: `When wind blows across the open end of a bamboo tube, the air inside vibrates. But it does not vibrate randomly. The tube selects specific patterns called **standing waves** — patterns where certain points (nodes) stay perfectly still while other points (antinodes) oscillate with maximum amplitude. The lowest-frequency standing wave is the **fundamental**, and its frequency depends on the tube length: f1 = v / (2L) for a tube open at both ends, where v is the speed of sound (~343 m/s) and L is the tube length.

Above the fundamental come the **overtones** (also called harmonics). For an open tube, all integer multiples of f1 are possible: f2 = 2f1, f3 = 3f1, and so on. Each harmonic has one more node than the previous. The second harmonic has a node at the center of the tube; the third harmonic has nodes at 1/3 and 2/3 of the way along. The specific mixture of harmonics present in a sound is what gives it its characteristic **timbre** — why a bamboo flute sounds different from a metal pipe of the same length playing the same note.

A typical bamboo flute from Assam might be 30-40 cm long, producing a fundamental frequency around 430-570 Hz — right in the range of the musical scale. The bamboo's natural internal diameter, wall thickness, and slight taper all influence which harmonics are stronger or weaker, giving each handcrafted flute a unique voice. The physics is universal, but the personality is local.`,
      analogy: 'Think of standing waves like jumping rope. One person holds each end (those are the nodes — they stay fixed). The rope itself swings up and down in between (the antinode). The fundamental is one big arc. If someone grabs the middle and you jump two smaller arcs, that is the second harmonic — same rope length, double the frequency, twice the number of loops.',
      storyConnection: 'In "The Bamboo That Taught the Wind to Dance," the wind learns to produce specific tones by resonating inside bamboo stalks of different lengths. Each stalk enforces standing waves at frequencies determined by its dimensions. The wind is not creating the music from nothing — it is exciting the natural resonant modes the bamboo already possesses.',
      checkQuestion: 'A bamboo tube open at both ends is 34.3 cm long. What is its fundamental frequency, and what are the first three harmonics? (Use v = 343 m/s.)',
      checkAnswer: 'f1 = 343 / (2 x 0.343) = 500 Hz. The harmonics are f2 = 1000 Hz, f3 = 1500 Hz, f4 = 2000 Hz. For an open-open tube all integer multiples are present. If one end were closed, only odd harmonics would appear (500, 1500, 2500 Hz).',
      codeIntro: 'Visualize the first six standing wave modes in a bamboo tube open at both ends, and generate the corresponding audio waveforms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

L = 0.343  # tube length in meters (34.3 cm bamboo flute)
v = 343.0  # speed of sound m/s
f1 = v / (2 * L)  # fundamental frequency

x = np.linspace(0, L, 500)  # position along tube
t_snapshot = 0.0  # snapshot at t=0 (maximum displacement)

fig, axes = plt.subplots(3, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Standing wave modes in a {L*100:.1f} cm bamboo tube (open-open)',
             color='white', fontsize=14, fontweight='bold')

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

for n, ax in enumerate(axes.flat, start=1):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    # Standing wave: displacement proportional to sin(n*pi*x/L)
    displacement = np.sin(n * np.pi * x / L)
    freq = n * f1

    ax.plot(x * 100, displacement, color=colors[n-1], linewidth=2.5)
    ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')

    # Mark nodes (zeros) and antinodes (extrema)
    nodes = np.array([k * L / n for k in range(n + 1)])
    antinodes = np.array([(k + 0.5) * L / n for k in range(n) if (k + 0.5) * L / n <= L])

    ax.scatter(nodes * 100, [0] * len(nodes), color='white', s=60, zorder=5, label='Nodes')
    ax.scatter(antinodes * 100, np.sin(n * np.pi * antinodes / L),
               color=colors[n-1], s=80, zorder=5, edgecolors='white', linewidth=1.5,
               label='Antinodes')

    ax.set_title(f'Harmonic {n}: f = {freq:.0f} Hz', color='white', fontsize=11)
    ax.set_xlabel('Position along tube (cm)', color='gray', fontsize=9)
    ax.set_ylabel('Displacement', color='gray', fontsize=9)
    ax.set_ylim(-1.4, 1.4)
    if n == 1:
        ax.legend(fontsize=8, loc='upper right')

plt.tight_layout()
plt.show()

# Generate and plot the composite waveform (first 6 harmonics)
sr = 22050
duration = 0.01  # 10 ms to show waveform shape
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# Harmonic amplitudes decrease as 1/n (typical of wind instruments)
composite = sum((1.0 / n) * np.sin(2 * np.pi * n * f1 * t) for n in range(1, 7))

fig2, ax2 = plt.subplots(figsize=(12, 4))
fig2.patch.set_facecolor('#1f2937')
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.plot(t * 1000, composite, color='#22c55e', linewidth=1.5)
ax2.set_title(f'Composite waveform (harmonics 1-6, fundamental = {f1:.0f} Hz)', color='white')
ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Amplitude', color='white')
plt.tight_layout()
plt.show()

print(f"Bamboo tube length: {L*100:.1f} cm")
print(f"Fundamental frequency: {f1:.1f} Hz")
for n in range(1, 7):
    print(f"  Harmonic {n}: {n*f1:.1f} Hz (amplitude weight = 1/{n} = {1/n:.3f})")
print()
print("Key observations:")
print("  - Each harmonic adds one more node inside the tube")
print("  - Higher harmonics oscillate faster but with less energy")
print("  - The composite waveform shape (timbre) depends on the harmonic recipe")`,
      challenge: 'Modify the code to model a tube that is closed at one end (like a stopped bamboo pipe). Only odd harmonics should appear: f1, 3f1, 5f1, etc. The fundamental frequency is f1 = v/(4L). Compare the waveform shape to the open-open tube.',
      successHint: 'Standing waves are the foundation of all wind instruments. Each bamboo flute is a resonant cavity that selects specific frequencies from the broadband noise of blowing air.',
    },
    {
      title: 'Resonance & natural frequency',
      concept: `Every object has **natural frequencies** at which it prefers to vibrate. Push a child on a swing at the right rhythm and the oscillations grow enormous. Push at the wrong rhythm and nothing happens. This frequency-selective amplification is called **resonance**, and it is one of the most powerful phenomena in physics.

Resonance occurs when an external driving force matches the natural frequency of a system. The system absorbs energy efficiently at that frequency, and the amplitude builds over time. The sharpness of the resonance peak is characterized by the **Q factor** (quality factor). A high-Q system resonates at a very precise frequency with large amplitude — like a crystal wine glass that shatters when a singer hits exactly the right note. A low-Q system responds to a broad range of frequencies but with less dramatic amplification — like a cushion that absorbs vibration across many frequencies.

The physics is the same whether the system is a bamboo tube in the wind, a bridge in a storm, or a molecule absorbing infrared light. The Tacoma Narrows Bridge collapsed in 1940 because steady wind excited its natural torsional mode. The bridge was a high-Q resonator at exactly the wrong frequency. Engineers now design structures with deliberate damping to lower Q and prevent catastrophic resonance. In music, resonance is desirable — we want the bamboo tube to amplify certain frequencies. In engineering, resonance can be dangerous.`,
      analogy: 'Resonance is like finding the right key for a lock. You can push energy at any frequency, but only the frequency that matches the natural frequency of the system "unlocks" large-amplitude vibrations. Everything else is wasted effort. A bamboo tube is a lock that accepts only specific frequency keys — its harmonics.',
      storyConnection: 'The wind tries many approaches before discovering the bamboo stalks\' natural frequencies. Once it matches them, the bamboo sings effortlessly. This is resonance: the wind does not force the bamboo to vibrate at arbitrary frequencies. It discovers which frequencies the bamboo already wants to vibrate at and supplies energy at those frequencies.',
      checkQuestion: 'A system has a natural frequency of 440 Hz and a Q factor of 100. Approximately what range of frequencies will produce significant resonant response?',
      checkAnswer: 'The bandwidth of a resonance peak is approximately f_natural / Q = 440 / 100 = 4.4 Hz. So the system responds strongly between roughly 437.8 Hz and 442.2 Hz. Outside that narrow band, the amplitude drops dramatically. A higher Q means a narrower, sharper resonance peak.',
      codeIntro: 'Simulate a driven harmonic oscillator and observe how the response amplitude depends on the driving frequency. Sweep across frequencies to map out the resonance curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def resonance_amplitude(f_drive, f_natural, Q):
    """Amplitude response of a driven damped harmonic oscillator."""
    r = f_drive / f_natural
    return 1.0 / np.sqrt((1 - r**2)**2 + (r / Q)**2)

f_natural = 500.0  # Hz — natural frequency of our bamboo tube
frequencies = np.linspace(100, 900, 2000)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Left: resonance curves for different Q factors
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

q_values = [5, 20, 50, 200]
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for Q, color in zip(q_values, colors):
    amplitude = [resonance_amplitude(f, f_natural, Q) for f in frequencies]
    ax.plot(frequencies, amplitude, color=color, linewidth=2, label=f'Q = {Q}')

ax.axvline(f_natural, color='white', linestyle='--', alpha=0.5, linewidth=1)
ax.set_title('Resonance curves: amplitude vs driving frequency', color='white', fontsize=11)
ax.set_xlabel('Driving frequency (Hz)', color='white')
ax.set_ylabel('Amplitude (relative)', color='white')
ax.legend(fontsize=9)
ax.set_ylim(0, 220)

# Right: time-domain simulation of a driven oscillator
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

dt = 1e-5  # time step
t_end = 0.05  # simulate 50 ms
t = np.arange(0, t_end, dt)
omega_n = 2 * np.pi * f_natural
Q_sim = 30
gamma = omega_n / (2 * Q_sim)  # damping coefficient
F0 = 1.0  # driving force amplitude

# Simulate at resonance vs off-resonance
for f_d, color, label in [(500, '#22c55e', 'At resonance (500 Hz)'),
                            (350, '#ef4444', 'Off resonance (350 Hz)')]:
    omega_d = 2 * np.pi * f_d
    x = np.zeros_like(t)
    v = np.zeros_like(t)

    for i in range(1, len(t)):
        # Driven damped harmonic oscillator: x'' + 2*gamma*x' + omega_n^2*x = F0*cos(omega_d*t)
        a = F0 * np.cos(omega_d * t[i-1]) - 2 * gamma * v[i-1] - omega_n**2 * x[i-1]
        v[i] = v[i-1] + a * dt
        x[i] = x[i-1] + v[i] * dt

    ax2.plot(t * 1000, x, color=color, linewidth=1, label=label, alpha=0.8)

ax2.set_title('Time-domain: resonant vs off-resonant driving', color='white', fontsize=11)
ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Displacement', color='white')
ax2.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Natural frequency: {f_natural} Hz")
print(f"At resonance (Q=30): amplitude builds over time")
print(f"Off resonance: amplitude stays small regardless of driving duration")
print()
print("Real-world resonance examples:")
print("  Bamboo flute: Q ~ 20-50 (moderate, warm tone)")
print("  Crystal glass: Q ~ 1000+ (very sharp, can shatter)")
print("  Tacoma Narrows: Q ~ 5-10 (broad but destructive at matched frequency)")
print("  Guitar string: Q ~ 500-2000 (sustains long after plucking)")`,
      challenge: 'Add a third driving frequency at 250 Hz (the subharmonic) to the time-domain simulation. Even though 250 Hz is not the natural frequency, the nonlinear response of a real system could excite 500 Hz through frequency doubling. Research "subharmonic resonance" and explain when this matters.',
      successHint: 'Resonance explains why specific bamboo tubes produce specific pitches. The tube does not create frequency — it selects and amplifies the matching frequencies from broadband wind noise.',
    },
    {
      title: 'Fourier analysis — decomposing sound into frequencies',
      concept: `In 1822, Joseph Fourier proved something astonishing: **any periodic signal can be expressed as a sum of sine waves**. This means that the complex waveform of a bamboo flute — with its warm, woody timbre — is mathematically equivalent to a specific recipe of pure tones at different frequencies and amplitudes. Fourier analysis decomposes a signal into that recipe.

The **Fourier Transform** takes a time-domain signal (amplitude vs time) and converts it into a frequency-domain representation (amplitude vs frequency). The resulting plot, called the **spectrum**, shows you exactly which frequencies are present and how strong each one is. For a bamboo flute playing A4 (440 Hz), you would see peaks at 440 Hz, 880 Hz, 1320 Hz, etc. — the harmonics — with decreasing amplitudes.

The computational workhorse is the **Fast Fourier Transform (FFT)**, an algorithm that computes the discrete Fourier transform in O(N log N) time instead of O(N^2). The FFT is arguably the most important numerical algorithm ever invented. It powers everything from MP3 compression to MRI imaging to earthquake analysis. When you run np.fft.fft() on a signal, you are using an algorithm whose impact on science and engineering is hard to overstate. Every digital audio system, every spectrum analyzer, every voice recognition model depends on it.`,
      analogy: 'Imagine hearing a chord played on a piano. Your ear hears one combined sound, but a trained musician can pick out the individual notes: "That is C, E, and G together." Fourier analysis is the mathematical version of that skill. It takes the composite waveform arriving at your ear and decomposes it into every individual frequency component, telling you exactly which notes are playing and how loudly.',
      storyConnection: 'When multiple bamboo stalks sing together in the wind, the combined sound is complex. Fourier analysis lets us decompose that chorus back into the individual voices — each bamboo tube contributing its own fundamental and harmonics. The wind hears the whole chord; the FFT hears each stalk separately.',
      checkQuestion: 'You compute the FFT of a 1-second audio clip sampled at 44100 Hz. The FFT output has 44100 complex numbers. What frequency does the 100th bin correspond to, and why does the second half of the FFT output mirror the first half?',
      checkAnswer: 'Bin k corresponds to frequency k * (sample_rate / N) = 100 * (44100 / 44100) = 100 Hz. The second half mirrors the first because for real-valued input signals, the FFT output is conjugate symmetric: X[k] = X*[N-k]. The negative frequencies carry no new information, which is why we typically plot only the first half (positive frequencies) using np.fft.rfft.',
      codeIntro: 'Synthesize a bamboo flute sound with known harmonics, then use the FFT to recover the frequency components. Compare the spectrum of different harmonic recipes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sr = 44100  # sample rate
duration = 0.5  # half second
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
f0 = 500  # fundamental frequency (bamboo flute, ~34 cm tube)

# Create three different "bamboo flute" timbres with different harmonic recipes
timbres = {
    'Bright bamboo (strong overtones)': {
        'amplitudes': [1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15],
        'color': '#f59e0b'
    },
    'Mellow bamboo (weak overtones)': {
        'amplitudes': [1.0, 0.3, 0.1, 0.03, 0.01],
        'color': '#22c55e'
    },
    'Hollow bamboo (odd harmonics only)': {
        'amplitudes': [1.0, 0.0, 0.5, 0.0, 0.3, 0.0, 0.15, 0.0],
        'color': '#3b82f6'
    }
}

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Fourier analysis: three bamboo flute timbres (f0 = {f0} Hz)',
             color='white', fontsize=14, fontweight='bold')

for row, (name, timbre) in enumerate(timbres.items()):
    # Synthesize the signal
    signal = np.zeros_like(t)
    for n, amp in enumerate(timbre['amplitudes'], start=1):
        signal += amp * np.sin(2 * np.pi * n * f0 * t)

    # Normalize
    signal = signal / np.max(np.abs(signal))

    # Plot waveform (just 2 cycles)
    samples_per_cycle = int(sr / f0)
    show_samples = samples_per_cycle * 2

    ax_wave = axes[row, 0]
    ax_wave.set_facecolor('#111827')
    ax_wave.tick_params(colors='gray')
    ax_wave.plot(t[:show_samples] * 1000, signal[:show_samples],
                 color=timbre['color'], linewidth=1.5)
    ax_wave.set_title(f'{name} — waveform', color='white', fontsize=10)
    ax_wave.set_xlabel('Time (ms)', color='gray')
    ax_wave.set_ylabel('Amplitude', color='gray')

    # Compute FFT
    N = len(signal)
    fft_vals = np.fft.rfft(signal)
    fft_magnitude = 2.0 * np.abs(fft_vals) / N
    fft_freqs = np.fft.rfftfreq(N, d=1.0 / sr)

    # Plot spectrum
    ax_fft = axes[row, 1]
    ax_fft.set_facecolor('#111827')
    ax_fft.tick_params(colors='gray')
    ax_fft.plot(fft_freqs, fft_magnitude, color=timbre['color'], linewidth=1)

    # Mark the peaks
    for n, amp in enumerate(timbre['amplitudes'], start=1):
        if amp > 0:
            ax_fft.annotate(f'{n*f0} Hz', xy=(n * f0, amp / np.max(timbre['amplitudes'])),
                          fontsize=7, color='white', ha='center',
                          xytext=(0, 10), textcoords='offset points')

    ax_fft.set_xlim(0, 5000)
    ax_fft.set_title(f'{name} — frequency spectrum (FFT)', color='white', fontsize=10)
    ax_fft.set_xlabel('Frequency (Hz)', color='gray')
    ax_fft.set_ylabel('Magnitude', color='gray')

plt.tight_layout()
plt.show()

print("Fourier analysis results:")
print(f"Fundamental frequency: {f0} Hz")
print()
for name, timbre in timbres.items():
    print(f"{name}:")
    for n, amp in enumerate(timbre['amplitudes'], start=1):
        if amp > 0:
            bar = '#' * int(amp * 20)
            print(f"  Harmonic {n} ({n*f0:5d} Hz): {bar} {amp:.2f}")
    print()
print("The FFT perfectly recovers the harmonic recipe from the composite waveform.")
print("Same note (same f0), completely different character (different spectra).")`,
      challenge: 'Record or synthesize a signal that is the sum of two bamboo flutes playing different notes (e.g., 500 Hz and 750 Hz, a perfect fifth). Use the FFT to identify both fundamentals and all their harmonics. Can you automatically detect which peaks are fundamentals vs harmonics?',
      successHint: 'The FFT is your microscope for sound. It reveals the hidden frequency structure that your ear perceives as timbre. Every digital audio tool — from Shazam to Auto-Tune — depends on this transform.',
    },
    {
      title: 'Acoustic impedance & tube end corrections',
      concept: `When a sound wave traveling through air inside a bamboo tube reaches the open end, not all the energy escapes. Some of it **reflects** back into the tube. This partial reflection is what creates standing waves in the first place. The physics governing this reflection is **acoustic impedance** — a property that describes how much a medium resists the flow of sound energy.

Acoustic impedance Z is defined as the ratio of sound pressure to particle velocity. For a plane wave in open air, Z = rho * c (density times speed of sound, about 413 Pa-s/m at sea level). Inside a narrow tube, the effective impedance depends on the tube's cross-sectional area. When sound moves from the tube interior to open air, it encounters an **impedance mismatch**: the confined tube has high impedance, the open air has low impedance. This mismatch causes reflection, just as light partially reflects when passing from glass to air.

Here is the critical detail for instrument builders: the effective acoustic length of a tube is not exactly its physical length. The sound wave "overshoots" slightly beyond the open end before reflecting back. This overshoot is called the **end correction**, typically about 0.6 times the tube radius for an unflanged open end. For a bamboo flute with a 1 cm radius, the end correction is about 6 mm at each open end — small but significant enough to shift the pitch by a noticeable amount. Traditional flute makers in Assam account for this empirically, trimming tubes slightly shorter than the naive formula would suggest.`,
      analogy: 'Acoustic impedance mismatch is like a ball bouncing between a concrete floor and a trampoline. On concrete (high impedance), the ball bounces back strongly. On a trampoline (low impedance), some energy goes through and some bounces back. The open end of a bamboo tube is like a trampoline — most sound escapes, but enough reflects to sustain the standing wave inside.',
      storyConnection: 'The bamboo tubes in the story are not just passive channels for the wind. They are acoustic resonators where impedance mismatches at the open ends create the reflections necessary for standing waves. The bamboo "teaches" the wind to dance precisely because its boundaries trap and reflect sound energy, building up resonance over many cycles.',
      checkQuestion: 'A bamboo tube is 30 cm long with a 1 cm inner radius, open at both ends. What is the effective acoustic length including end corrections, and how does this change the fundamental frequency compared to the naive calculation?',
      checkAnswer: 'End correction per open end is about 0.6 * r = 0.6 * 0.01 = 0.006 m. With two open ends, the effective length is 0.30 + 2 * 0.006 = 0.312 m. Naive f1 = 343 / (2 * 0.30) = 571.7 Hz. Corrected f1 = 343 / (2 * 0.312) = 549.7 Hz. The end correction lowers the pitch by about 22 Hz — nearly a semitone. This is why flute makers must account for it.',
      codeIntro: 'Model how acoustic impedance mismatch affects reflection at the end of a bamboo tube, and visualize the end correction effect on pitch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Part 1: Reflection coefficient vs frequency at tube opening ---
# Simplified model for radiation impedance of an unflanged circular pipe
# Z_radiation / (rho*c) approx = (k*a)^2/4 + j*0.6*k*a for k*a << 1

rho = 1.225  # air density kg/m^3
c = 343.0    # speed of sound m/s
a = 0.01     # tube inner radius (1 cm, typical bamboo)

freqs = np.linspace(100, 10000, 1000)
k = 2 * np.pi * freqs / c
ka = k * a

# Radiation impedance (normalized)
Z_rad_real = (ka)**2 / 4
Z_rad_imag = 0.6133 * ka

# Reflection coefficient magnitude
# R = (Z_tube - Z_rad) / (Z_tube + Z_rad), where Z_tube = 1 (normalized)
Z_rad = Z_rad_real + 1j * Z_rad_imag
Z_tube = 1.0
R = np.abs((Z_tube - Z_rad) / (Z_tube + Z_rad))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Acoustic impedance & end corrections in bamboo tubes',
             color='white', fontsize=14, fontweight='bold')

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(freqs, R, color='#22c55e', linewidth=2)
ax.set_title('Reflection coefficient at open end', color='white', fontsize=11)
ax.set_xlabel('Frequency (Hz)', color='gray')
ax.set_ylabel('|R| (0=no reflection, 1=total)', color='gray')
ax.axhline(0.5, color='gray', linestyle='--', alpha=0.3)

# --- Part 2: End correction effect on resonant frequencies ---
tube_lengths = np.linspace(0.15, 0.60, 100)  # 15 cm to 60 cm
end_correction = 0.6133 * a  # per open end

f_naive = c / (2 * tube_lengths)
f_corrected = c / (2 * (tube_lengths + 2 * end_correction))

ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.plot(tube_lengths * 100, f_naive, color='#ef4444', linewidth=2, label='Naive (no correction)')
ax2.plot(tube_lengths * 100, f_corrected, color='#22c55e', linewidth=2, label='With end correction')
ax2.fill_between(tube_lengths * 100, f_naive, f_corrected, alpha=0.2, color='#f59e0b')
ax2.set_title('Fundamental freq vs tube length', color='white', fontsize=11)
ax2.set_xlabel('Tube length (cm)', color='gray')
ax2.set_ylabel('Frequency (Hz)', color='gray')
ax2.legend(fontsize=9)

# --- Part 3: Standing wave with end correction visualization ---
L_phys = 0.343  # physical length
L_eff = L_phys + 2 * end_correction
x_full = np.linspace(-end_correction, L_phys + end_correction, 500)
x_tube = np.linspace(0, L_phys, 400)

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

# Standing wave extends beyond physical tube boundaries
for n in [1, 2, 3]:
    wave = np.sin(n * np.pi * (x_full + end_correction) / L_eff)
    ax3.plot(x_full * 100, wave + (n-1) * 2.8, linewidth=2,
             color=['#22c55e', '#3b82f6', '#f59e0b'][n-1],
             label=f'Mode {n}')

ax3.axvline(0, color='white', linewidth=2, linestyle='-', label='Physical tube ends')
ax3.axvline(L_phys * 100, color='white', linewidth=2, linestyle='-')
ax3.axvline(-end_correction * 100, color='#ef4444', linewidth=1.5, linestyle='--', label='Effective ends')
ax3.axvline((L_phys + end_correction) * 100, color='#ef4444', linewidth=1.5, linestyle='--')
ax3.set_title('Standing waves extend beyond tube (end correction)', color='white', fontsize=11)
ax3.set_xlabel('Position (cm)', color='gray')
ax3.legend(fontsize=8, loc='upper right')

# --- Part 4: Open vs closed tube comparison ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

L = 0.343
harmonics_open = [n * c / (2 * L) for n in range(1, 9)]
harmonics_closed = [n * c / (4 * L) for n in range(1, 16, 2)]  # odd only

ax4.barh(range(len(harmonics_open)), harmonics_open, height=0.35,
         color='#22c55e', label='Open-open (all harmonics)')
ax4.barh([x + 0.4 for x in range(len(harmonics_closed))], harmonics_closed,
         height=0.35, color='#f59e0b', label='Open-closed (odd only)')
ax4.set_title('Harmonic series: open vs closed tube', color='white', fontsize=11)
ax4.set_xlabel('Frequency (Hz)', color='gray')
ax4.set_ylabel('Harmonic number', color='gray')
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Tube radius: {a*100:.1f} cm")
print(f"End correction per opening: {end_correction*100:.3f} cm")
print(f"For a {L_phys*100:.1f} cm tube:")
print(f"  Effective length: {L_eff*100:.3f} cm ({2*end_correction*100:.2f} cm longer)")
print(f"  Naive fundamental:     {c/(2*L_phys):.1f} Hz")
print(f"  Corrected fundamental: {c/(2*L_eff):.1f} Hz")
print(f"  Pitch shift: {c/(2*L_phys) - c/(2*L_eff):.1f} Hz lower")`,
      challenge: 'Research how finger holes change the effective acoustic length of a flute. Model a bamboo tube with a single tone hole at a variable position. How does the hole position and size affect the resonant frequency? (Hint: an open hole acts approximately like a new open end at that position.)',
      successHint: 'Acoustic impedance is why flutes work at all. Without impedance mismatch, there would be no reflection, no standing waves, and no resonance. The end correction is a practical consequence that every instrument maker must account for.',
    },
    {
      title: 'Musical temperament & tuning systems',
      concept: `When a bamboo flute maker in Assam drills finger holes, they are making decisions about **tuning** — the mathematical relationships between notes. This seemingly simple craft question leads to one of the deepest problems in music theory, one that has occupied mathematicians for over 2,500 years.

**Just intonation** uses simple frequency ratios derived from the harmonic series. An octave is 2:1, a perfect fifth is 3:2, a perfect fourth is 4:3, a major third is 5:4. These intervals sound pure and beatless because the harmonics of the two notes align perfectly. Pythagorean tuning uses only powers of 3:2 to generate all intervals. The problem is that stacking twelve perfect fifths (3/2)^12 = 129.746 does not equal seven octaves 2^7 = 128. This gap, called the **Pythagorean comma** (about 23.5 cents), means you cannot have all intervals perfectly in tune simultaneously.

**Equal temperament** solves this by dividing the octave into 12 exactly equal semitones, each with a frequency ratio of 2^(1/12) = 1.05946. No interval except the octave is mathematically pure, but every key sounds equally (im)perfect. This compromise, standardized in Europe by the 18th century, enables modulation between keys. Indian classical music and many folk traditions in Northeast India use just intonation instead, which is why their music has a different character — purer intervals but fixed to a specific tonic. A bamboo flute tuned in just intonation sounds sublime in one key but increasingly wrong as you move away from it.`,
      analogy: 'Tuning is like tiling a floor with two slightly incompatible tile sizes. Just intonation uses beautiful, perfectly shaped tiles that fit together in one corner of the room but leave gaps when you try to cover the whole floor. Equal temperament uses tiles that are all slightly imperfect but can cover the entire floor with uniform (small) gaps everywhere. Neither solution is wrong — they serve different purposes.',
      storyConnection: 'Traditional bamboo flute makers in the Brahmaputra valley tune by ear to just intervals, matching the flute to the drone of the tanpura or pepa. The hole positions they choose encode centuries of musical knowledge about which frequency ratios sound right for their musical tradition. When the bamboo teaches the wind to dance, it dances in a specific tuning system.',
      checkQuestion: 'Calculate the frequency of E4 above A4=440 Hz in both equal temperament and just intonation (major third = 5:4 ratio). What is the difference in Hz, and would a trained ear notice it?',
      checkAnswer: 'In equal temperament, E4 is 4 semitones above C4 but we need E4 relative to A4: E4 is 7 semitones below A4, so E4 = 440 / 2^(7/12) = 440 / 1.4983 = 329.63 Hz. In just intonation with A4 as reference, going down a fifth (x2/3) gives D4=293.33, up a major third (x5/4) gives... Actually, E4 below A4 is a perfect fourth down = 440 * 3/4 = 330 Hz. The difference is 0.37 Hz. A trained musician can detect differences of about 2-3 cents; this is about 2 cents, right at the threshold of perception.',
      codeIntro: 'Compare equal temperament and just intonation tuning systems, visualize the frequency differences, and calculate the hole positions on a bamboo flute for each system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define note names and their intervals from the root
note_names = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B', 'C+']

# Equal temperament: each semitone = 2^(1/12)
et_ratios = [2**(i/12) for i in range(13)]

# Just intonation (5-limit, major scale): pure frequency ratios
# Only defined for diatonic notes; chromatic notes approximated
ji_ratios = [1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8, 2]

f_root = 261.63  # C4

et_freqs = [f_root * r for r in et_ratios]
ji_freqs = [f_root * r for r in ji_ratios]

# Difference in cents: 1200 * log2(f_ji / f_et)
cents_diff = [1200 * np.log2(ji / et) if et > 0 else 0
              for ji, et in zip(ji_ratios, et_ratios)]

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Musical temperament: equal temperament vs just intonation',
             color='white', fontsize=14, fontweight='bold')

# --- Plot 1: frequency comparison ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
x = np.arange(13)
ax.bar(x - 0.15, et_freqs, width=0.3, color='#3b82f6', label='Equal temperament')
ax.bar(x + 0.15, ji_freqs, width=0.3, color='#22c55e', label='Just intonation')
ax.set_xticks(x)
ax.set_xticklabels(note_names, fontsize=8, color='gray')
ax.set_title('Frequencies of notes in one octave (C4 root)', color='white', fontsize=11)
ax.set_ylabel('Frequency (Hz)', color='gray')
ax.legend(fontsize=9)

# --- Plot 2: deviation in cents ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
colors_bar = ['#22c55e' if abs(c) < 5 else '#f59e0b' if abs(c) < 15 else '#ef4444'
              for c in cents_diff]
ax2.bar(x, cents_diff, color=colors_bar)
ax2.set_xticks(x)
ax2.set_xticklabels(note_names, fontsize=8, color='gray')
ax2.axhline(0, color='gray', linewidth=0.5)
ax2.set_title('Deviation: just intonation minus equal temperament (cents)', color='white', fontsize=11)
ax2.set_ylabel('Cents', color='gray')
ax2.axhline(5, color='#f59e0b', linestyle='--', alpha=0.5, linewidth=0.8)
ax2.axhline(-5, color='#f59e0b', linestyle='--', alpha=0.5, linewidth=0.8)

# --- Plot 3: Bamboo flute hole positions ---
# For a flute, hole position from the blowing end determines the effective tube length
# Open hole shortens the effective tube -> higher pitch
v_sound = 343.0  # m/s
tube_length = 0.40  # 40 cm bamboo flute

# Calculate hole positions for a major scale (C D E F G A B C)
scale_indices = [0, 2, 4, 5, 7, 9, 11, 12]
scale_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C+']

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

for system, ratios, color, offset in [('Equal temperament', et_ratios, '#3b82f6', 0.12),
                                       ('Just intonation', ji_ratios, '#22c55e', -0.12)]:
    positions = []
    for idx in scale_indices:
        freq = f_root * ratios[idx]
        # Effective length for this frequency: L_eff = v / (2 * f)
        eff_length = v_sound / (2 * freq)
        # Hole position from blowing end = tube_length - eff_length
        hole_pos = tube_length - eff_length
        positions.append(max(hole_pos, 0) * 100)  # cm

    ax3.barh([i + offset for i in range(len(scale_names))], positions,
             height=0.22, color=color, label=system)

ax3.set_yticks(range(len(scale_names)))
ax3.set_yticklabels(scale_names, color='gray')
ax3.set_title('Finger hole positions on 40cm bamboo flute', color='white', fontsize=11)
ax3.set_xlabel('Distance from blowing end (cm)', color='gray')
ax3.legend(fontsize=9)

# --- Plot 4: Beat frequencies between ET and JI ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

t = np.linspace(0, 0.05, 5000)
# Major third: E4
et_e = np.sin(2 * np.pi * et_freqs[4] * t)
ji_e = np.sin(2 * np.pi * ji_freqs[4] * t)

ax4.plot(t * 1000, et_e, color='#3b82f6', linewidth=1, alpha=0.7, label=f'ET E4 = {et_freqs[4]:.2f} Hz')
ax4.plot(t * 1000, ji_e, color='#22c55e', linewidth=1, alpha=0.7, label=f'JI E4 = {ji_freqs[4]:.2f} Hz')
ax4.plot(t * 1000, et_e + ji_e, color='#f59e0b', linewidth=0.8, alpha=0.5, label='Combined (beats)')
ax4.set_title('Beat frequency: ET vs JI major third', color='white', fontsize=11)
ax4.set_xlabel('Time (ms)', color='gray')
ax4.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Tuning system comparison (C4 major scale):")
print(f"{'Note':<6} {'ET (Hz)':<10} {'JI (Hz)':<10} {'Diff (cents)':<12} {'JI ratio'}")
ji_ratio_labels = ['1/1', '16/15', '9/8', '6/5', '5/4', '4/3', '45/32',
                   '3/2', '8/5', '5/3', '9/5', '15/8', '2/1']
for i in scale_indices:
    print(f"{note_names[i]:<6} {et_freqs[i]:<10.2f} {ji_freqs[i]:<10.2f} {cents_diff[i]:<+12.1f} {ji_ratio_labels[i]}")
print()
print("The Pythagorean comma: (3/2)^12 / 2^7 =", (3/2)**12 / 2**7)
print(f"  = {1200 * np.log2((3/2)**12 / 2**7):.1f} cents (about 1/4 of a semitone)")
print()
print("Traditional NE Indian flutes use just intonation — pure intervals")
print("anchored to a drone note. This is why they sound different from")
print("Western concert flutes tuned in equal temperament.")`,
      challenge: 'Implement a 22-shruti scale (Indian microtonal system) and compare it to 12-TET. The 22 shrutis divide the octave into unequal steps based on ratios from the harmonic series. Calculate how many shrutis approximate each Western semitone.',
      successHint: 'Tuning is where physics meets culture. The mathematics are universal, but the choice of which compromises to accept is deeply cultural. A bamboo flute encodes both.',
    },
    {
      title: 'Digital signal processing — sampling, Nyquist, and aliasing',
      concept: `When we record the sound of a bamboo flute with a microphone, we convert a continuous analog pressure wave into a discrete sequence of numbers. This process is called **sampling**, and it introduces a fundamental constraint: you must sample at least twice as fast as the highest frequency in the signal. This is the **Nyquist-Shannon sampling theorem**, and it is the single most important theorem in digital audio.

If the highest frequency in a bamboo flute's sound is 5000 Hz (fundamental plus several harmonics), you need a sampling rate of at least 10,000 Hz. CD audio uses 44,100 Hz, which can perfectly capture any frequency up to 22,050 Hz — well above the range of human hearing (roughly 20 Hz to 20,000 Hz). The frequency equal to half the sampling rate is called the **Nyquist frequency**.

When you violate the Nyquist theorem — sampling too slowly — something sinister happens: high-frequency components disguise themselves as lower frequencies. This is **aliasing**. A 15,000 Hz tone sampled at 10,000 Hz appears as a phantom 5,000 Hz tone that was never in the original signal. There is no way to distinguish the alias from a genuine 5,000 Hz component after the fact. This is why every analog-to-digital converter includes an **anti-aliasing filter** that removes all frequencies above the Nyquist frequency before sampling. Without this filter, digital recordings would be contaminated with phantom frequencies that corrupt the data irrecoverably.`,
      analogy: 'Aliasing is like filming a helicopter rotor with a slow camera. If the rotor spins at 30 revolutions per second and the camera captures 32 frames per second, the rotor appears to spin slowly forward at 2 revolutions per second. If the camera captures 28 frames per second, the rotor appears to spin backward at 2 revolutions per second. The camera is "sampling" the rotation too slowly, and the result is a completely wrong apparent speed — an alias.',
      storyConnection: 'To share the bamboo flute music digitally — on a phone, a website, a streaming service — we must convert the analog sound into numbers. The sampling theorem tells us the minimum rate at which we must capture those numbers to preserve the music faithfully. Sample too slowly, and the delicate overtones of the bamboo flute get mangled by aliasing into phantom tones that corrupt the recording.',
      checkQuestion: 'A bamboo flute produces harmonics up to 8000 Hz. You sample it at 12000 Hz. Which harmonics will be correctly captured, and which will alias? Where will the aliases appear in the spectrum?',
      checkAnswer: 'The Nyquist frequency is 12000/2 = 6000 Hz. Harmonics below 6000 Hz are captured correctly. The harmonic at 7000 Hz aliases to 12000 - 7000 = 5000 Hz. The harmonic at 8000 Hz aliases to 12000 - 8000 = 4000 Hz. These phantom tones at 5000 Hz and 4000 Hz were never in the original signal but now appear indistinguishable from real components. The recording is corrupted.',
      codeIntro: 'Demonstrate the sampling theorem and aliasing visually. Show what happens when you sample a bamboo flute signal at adequate and inadequate rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Continuous signal: bamboo flute with fundamental + harmonics
f0 = 500  # Hz fundamental
harmonics = [1, 2, 3, 4, 5, 6, 7, 8]  # 500 to 4000 Hz
amps = [1.0, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05]

# "Continuous" signal (very high sample rate to approximate analog)
sr_continuous = 100000
t_cont = np.linspace(0, 0.01, int(sr_continuous * 0.01), endpoint=False)
signal_cont = sum(a * np.sin(2 * np.pi * h * f0 * t_cont) for h, a in zip(harmonics, amps))

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sampling theorem, Nyquist frequency, and aliasing',
             color='white', fontsize=14, fontweight='bold')

# --- Row 1: Adequate sampling (sr=44100, Nyquist=22050) ---
sr_good = 44100
t_good = np.arange(0, 0.01, 1/sr_good)
signal_good = sum(a * np.sin(2 * np.pi * h * f0 * t_good) for h, a in zip(harmonics, amps))

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(t_cont * 1000, signal_cont, color='gray', linewidth=0.5, alpha=0.5, label='Analog')
ax.stem(t_good * 1000, signal_good, linefmt='#22c55e', markerfmt='o', basefmt=' ',
        label=f'Sampled @ {sr_good} Hz')
ax.set_title(f'Adequate sampling (sr={sr_good}, Nyquist={sr_good//2} Hz)', color='white', fontsize=10)
ax.set_xlabel('Time (ms)', color='gray')
ax.legend(fontsize=8)

# FFT of well-sampled signal
N = len(signal_good)
fft_good = 2 * np.abs(np.fft.rfft(signal_good)) / N
freqs_good = np.fft.rfftfreq(N, 1/sr_good)

ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.plot(freqs_good, fft_good, color='#22c55e', linewidth=1.5)
ax2.set_xlim(0, 6000)
ax2.set_title('Spectrum: all harmonics correctly captured', color='white', fontsize=10)
ax2.set_xlabel('Frequency (Hz)', color='gray')
ax2.set_ylabel('Magnitude', color='gray')
for h, a in zip(harmonics, amps):
    ax2.axvline(h * f0, color='white', alpha=0.2, linewidth=0.5)

# --- Row 2: Marginal sampling (sr=5000, Nyquist=2500) ---
sr_bad = 5000
t_bad = np.arange(0, 0.01, 1/sr_bad)
# The original signal has frequencies up to 4000 Hz — above Nyquist of 2500
signal_bad = sum(a * np.sin(2 * np.pi * h * f0 * t_bad) for h, a in zip(harmonics, amps))

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
ax3.plot(t_cont * 1000, signal_cont, color='gray', linewidth=0.5, alpha=0.5, label='Analog')
ax3.stem(t_bad * 1000, signal_bad, linefmt='#ef4444', markerfmt='o', basefmt=' ',
         label=f'Sampled @ {sr_bad} Hz')
ax3.set_title(f'Undersampling (sr={sr_bad}, Nyquist={sr_bad//2} Hz)', color='white', fontsize=10)
ax3.set_xlabel('Time (ms)', color='gray')
ax3.legend(fontsize=8)

# FFT of undersampled signal
N_bad = len(signal_bad)
fft_bad = 2 * np.abs(np.fft.rfft(signal_bad)) / N_bad
freqs_bad = np.fft.rfftfreq(N_bad, 1/sr_bad)

ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
ax4.plot(freqs_bad, fft_bad, color='#ef4444', linewidth=1.5)
ax4.axvline(sr_bad/2, color='#f59e0b', linewidth=2, linestyle='--', label=f'Nyquist = {sr_bad//2} Hz')
ax4.set_title('Spectrum: aliased harmonics appear as phantoms', color='white', fontsize=10)
ax4.set_xlabel('Frequency (Hz)', color='gray')
ax4.set_ylabel('Magnitude', color='gray')
ax4.legend(fontsize=9)

# --- Row 3: Aliasing demonstration with single frequency ---
ax5 = axes[2, 0]
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')

f_signal = 3500  # Hz — a harmonic of the flute
sr_alias = 5000
f_alias = sr_alias - f_signal  # = 1500 Hz (the alias)

t_fine = np.linspace(0, 0.005, 10000)
t_sampled = np.arange(0, 0.005, 1/sr_alias)

real_signal = np.sin(2 * np.pi * f_signal * t_fine)
alias_signal = np.sin(2 * np.pi * f_alias * t_fine)
sampled = np.sin(2 * np.pi * f_signal * t_sampled)

ax5.plot(t_fine * 1000, real_signal, color='#3b82f6', linewidth=1, alpha=0.5,
         label=f'Real: {f_signal} Hz')
ax5.plot(t_fine * 1000, alias_signal, color='#ef4444', linewidth=1.5, linestyle='--',
         label=f'Alias: {f_alias} Hz')
ax5.stem(t_sampled * 1000, sampled, linefmt='white', markerfmt='wo', basefmt=' ',
         label='Sample points')
ax5.set_title(f'Aliasing: {f_signal} Hz sampled at {sr_alias} Hz looks like {f_alias} Hz',
              color='white', fontsize=10)
ax5.set_xlabel('Time (ms)', color='gray')
ax5.legend(fontsize=8)

# --- Sampling rate vs frequency fidelity summary ---
ax6 = axes[2, 1]
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')

sample_rates = [2000, 5000, 8000, 11025, 22050, 44100]
max_freq_captured = [sr/2 for sr in sample_rates]
harmonics_captured = [sum(1 for h in harmonics if h * f0 < sr/2) for sr in sample_rates]

colors_sr = ['#ef4444' if hc < len(harmonics) else '#22c55e' for hc in harmonics_captured]
bars = ax6.bar(range(len(sample_rates)), harmonics_captured, color=colors_sr)
ax6.set_xticks(range(len(sample_rates)))
ax6.set_xticklabels([f'{sr} Hz' for sr in sample_rates], fontsize=8, color='gray', rotation=30)
ax6.axhline(len(harmonics), color='#22c55e', linestyle='--', alpha=0.5,
            label=f'All {len(harmonics)} harmonics')
ax6.set_title('Harmonics captured vs sampling rate', color='white', fontsize=10)
ax6.set_ylabel('# harmonics captured correctly', color='gray')
ax6.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Sampling theorem demonstration:")
print(f"Bamboo flute fundamental: {f0} Hz")
print(f"Highest harmonic: {max(harmonics) * f0} Hz")
print(f"Minimum sampling rate needed: {2 * max(harmonics) * f0} Hz")
print()
print("Sampling rate comparison:")
for sr in sample_rates:
    nyq = sr / 2
    captured = sum(1 for h in harmonics if h * f0 < nyq)
    aliased = len(harmonics) - captured
    print(f"  sr={sr:>5} Hz | Nyquist={nyq:>5.0f} Hz | "
          f"captured={captured}/{len(harmonics)} | aliased={aliased}")
print()
print("Key insight: aliasing is IRREVERSIBLE. Once phantom frequencies")
print("are mixed into the signal, no processing can remove them.")
print("Prevention (anti-aliasing filter) is the only solution.")`,
      challenge: 'Implement a simple anti-aliasing filter: before downsampling from 44100 Hz to 5000 Hz, apply a low-pass filter that removes all frequencies above 2500 Hz. Compare the spectrum of the filtered-then-downsampled signal to the directly downsampled signal. The filter should eliminate all aliasing artifacts.',
      successHint: 'The sampling theorem is the bridge between the analog world of bamboo flutes and the digital world of computers. Every time you listen to music on a phone, this theorem is what makes it possible — and anti-aliasing is what makes it correct.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Acoustics & Signal Processing
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (resonance fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real acoustics and signal processing. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
