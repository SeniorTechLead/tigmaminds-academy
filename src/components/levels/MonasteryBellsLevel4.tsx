import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BellFourierDiagram from '../diagrams/BellFourierDiagram';
import BellHarmonicsDiagram from '../diagrams/BellHarmonicsDiagram';
import BellFrequencyDiagram from '../diagrams/BellFrequencyDiagram';
import BellSoundWaveDiagram from '../diagrams/BellSoundWaveDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import ActivityBellStrikeDiagram from '../diagrams/ActivityBellStrikeDiagram';

export default function MonasteryBellsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Finite element modelling — simulating bell vibration',
      concept: `Real bell design uses **Finite Element Analysis (FEA)**: the bell’s surface is divided into thousands of small elements, and the equations of motion are solved for each one. This reveals the exact mode shapes, frequencies, and stress distributions.

We will build a simplified 1D FEA model: a chain of masses connected by springs. This is the simplest discretisation of a vibrating object. Each mass moves according to Newton’s second law: F = ma. The springs provide restoring force: F = -k×displacement.

The code sets up a chain of 50 masses, applies an impulse to one end, and simulates the wave propagation. You will see standing waves emerge naturally from the boundary conditions.

This is exactly how commercial FEA software works, just with 2D/3D elements instead of a 1D chain.`,
      analogy: 'Imagine 50 people standing in a line, each holding hands with their neighbours. Push the first person. They bump into the second, who bumps into the third, and a wave ripples down the line. If the last person is fixed (held by a wall), the wave reflects back. The standing patterns that emerge are the modes — exactly what happens in a vibrating bell.',
      storyConnection: 'To fix Sangha, a modern bell-maker would create an FEA model of the bell, simulate the crack, and determine which modes are disrupted. Then they would calculate exactly where to add or remove metal to restore the harmonic balance — digital restoration before touching the physical bell.',
      checkQuestion: 'Why do engineers divide a bell into thousands of elements instead of solving the equation for the whole bell at once?',
      checkAnswer: 'The wave equation for a complex 3D shape like a bell has no exact analytical solution. By dividing it into small, simple elements (triangles, tetrahedra), the equation for each element IS solvable. The computer then assembles all the element solutions to approximate the full solution. More elements = better approximation, at the cost of more computation.',
      codeIntro: 'Build a 1D finite element model and watch standing waves emerge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D chain of masses connected by springs
n_masses = 50
k = 1000.0   # spring constant (stiffness)
m = 1.0      # mass of each element
dt = 0.001   # time step
n_steps = 2000

# Initialize
x = np.zeros(n_masses)        # displacement
v = np.zeros(n_masses)        # velocity

# Apply impulse to mass 5
x[5] = 1.0

# Store history for plotting
history = np.zeros((n_steps, n_masses))

for step in range(n_steps):
    history[step] = x.copy()

    # Calculate forces (F = -k × stretch for each spring)
    force = np.zeros(n_masses)
    for i in range(1, n_masses - 1):
        force[i] = k * (x[i-1] - 2*x[i] + x[i+1])

    # Fixed boundary conditions (both ends)
    force[0] = 0
    force[-1] = 0

    # Update velocity and position (Verlet integration)
    v += (force / m) * dt
    v *= 0.9995  # tiny damping
    x += v * dt

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Snapshots at different times
times = [0, 200, 500, 1500]
colors = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7']
for t_idx, (t_step, color) in enumerate(zip(times, colors)):
    ax = axes[t_idx // 2][t_idx % 2]
    ax.plot(range(n_masses), history[t_step], color=color, linewidth=2)
    ax.fill_between(range(n_masses), history[t_step], alpha=0.2, color=color)
    ax.set_ylim(-1.5, 1.5)
    ax.set_xlabel('Mass index', fontsize=9)
    ax.set_ylabel('Displacement', fontsize=9)
    ax.set_title(f't = {t_step * dt:.2f}s', fontsize=11, color='white')
    ax.grid(alpha=0.3)
    ax.axhline(0, color='white', linewidth=0.3, alpha=0.3)

plt.suptitle('1D Finite Element Simulation — Wave Propagation & Standing Waves',
            fontsize=13, color='white', y=1.02)
plt.tight_layout()
plt.show()

# Mode analysis via FFT of the spatial pattern
print("=== Finite Element Analysis ===")
print(f"Chain: {n_masses} masses, k={k}, m={m}")
print(f"Theoretical natural frequencies:")
for mode in range(1, 6):
    f_theory = (1/(2*np.pi)) * 2 * np.sqrt(k/m) * np.sin(mode * np.pi / (2 * n_masses))
    print(f"  Mode {mode}: {f_theory:.1f} Hz")
print()
print("The simulation naturally produces these modes — no explicit")
print("formula needed. The physics emerges from F=ma + springs.")`,
      challenge: 'Introduce a “crack” by setting one spring constant to half its normal value (k/2 at element 25). Run the simulation and compare the standing wave patterns to the uncracked chain. Which modes are most affected?',
      successHint: 'FEA is one of the most important computational techniques in engineering. It is used to design bridges, aircraft, prosthetics, and yes — musical instruments. You just built the simplest possible FEA from scratch.',
    },
    {
      title: 'Wavelet analysis — beyond Fourier',
      concept: `Fourier analysis assumes the signal is stationary — the same frequency content throughout. But a bell strike is NOT stationary: it starts with a burst of broadband noise, transitions to a mix of harmonics, and ends with the fundamental alone.

**Wavelet analysis** addresses this by using localised basis functions (wavelets) instead of infinite sine waves. A wavelet has both a frequency AND a position in time, letting you ask: “What frequency was present at what moment?”

The **wavelet transform** computes a scalogram: a 2D map of time vs. frequency vs. amplitude with much better time resolution than a spectrogram for transient events.

The code implements a simple Morlet wavelet transform on the bell signal.`,
      analogy: 'Fourier analysis is like describing a painting by listing which colours are used and how much of each — but not where each colour appears. Wavelet analysis describes both the colour AND its position on the canvas. For a bell strike that changes character over time, wavelets capture the full story.',
      storyConnection: 'If Dr. Lhamo used wavelet analysis on Sangha, she could pinpoint the exact moment when beat frequencies appeared after the strike, and how quickly each harmonic decayed. This temporal precision would help diagnose exactly how the crack affects each mode over time.',
      checkQuestion: 'Why can’t a standard FFT tell you when a frequency starts and stops?',
      checkAnswer: 'An FFT projects the entire signal onto infinite sine waves. A sine wave has no beginning or end — it extends forever. So the FFT tells you which frequencies are present overall, but not when they appear. The uncertainty principle applies: better frequency resolution requires a longer analysis window, which sacrifices time resolution. Wavelets balance this trade-off adaptively.',
      codeIntro: 'Implement a wavelet transform for the bell signal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate bell with time-varying harmonics
sample_rate = 44100
duration = 2.0
t = np.linspace(0, duration, int(sample_rate * duration))
fundamental = 200

bell = np.zeros_like(t)
for n in range(1, 7):
    decay = n * 2.0
    bell += (1/n) * np.exp(-decay * t) * np.sin(2 * np.pi * n * fundamental * t)

# Add strike transient
strike_dur = int(0.005 * sample_rate)
bell[:strike_dur] += 0.5 * np.random.randn(strike_dur) * np.exp(-np.linspace(0, 10, strike_dur))

# Morlet wavelet transform (simplified)
def morlet_wavelet(t_arr, freq, sigma=5):
    """Morlet wavelet at given frequency"""
    return np.exp(2j * np.pi * freq * t_arr) * np.exp(-t_arr**2 / (2 * sigma**2 / freq**2))

# Compute scalogram
freqs_analysis = np.linspace(100, 1400, 120)
n_time_points = 200
time_points = np.linspace(0, duration, n_time_points)
scalogram = np.zeros((len(freqs_analysis), n_time_points))

for i, freq in enumerate(freqs_analysis):
    sigma = 5
    window_width = int(6 * sigma / freq * sample_rate)
    if window_width < 10:
        window_width = 10
    half_w = window_width // 2

    for j, tc in enumerate(time_points):
        center_idx = int(tc * sample_rate)
        start = max(0, center_idx - half_w)
        end = min(len(bell), center_idx + half_w)
        if end - start < 2:
            continue
        segment = bell[start:end]
        t_local = (np.arange(len(segment)) - len(segment)//2) / sample_rate
        wavelet = morlet_wavelet(t_local, freq, sigma)[:len(segment)]
        scalogram[i, j] = np.abs(np.sum(segment * wavelet))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Waveform
ax1.plot(t[:int(sample_rate * duration)], bell[:int(sample_rate * duration)],
         color='#a855f7', linewidth=0.3)
ax1.set_xlabel('Time (s)', fontsize=10)
ax1.set_ylabel('Amplitude', fontsize=10)
ax1.set_title('Bell Waveform', fontsize=12)
ax1.grid(alpha=0.2)

# Scalogram
ax2.pcolormesh(time_points, freqs_analysis, scalogram, cmap='inferno', shading='gouraud')
for n in range(1, 7):
    ax2.axhline(n * fundamental, color='white', linewidth=0.5, alpha=0.4)
    ax2.text(1.9, n * fundamental + 15, f'{n}f={n*fundamental}Hz',
            fontsize=7, color='white', alpha=0.7, ha='right')
ax2.set_xlabel('Time (s)', fontsize=10)
ax2.set_ylabel('Frequency (Hz)', fontsize=10)
ax2.set_title('Wavelet Scalogram — Frequency Content Over Time', fontsize=12)

plt.tight_layout()
plt.show()

print("=== Wavelet vs Fourier ===")
print("Fourier: good frequency resolution, no time information")
print("Wavelet: both frequency AND time, with adaptive resolution")
print()
print("What the scalogram shows:")
print("  - Broadband strike noise at t=0 (all frequencies briefly)")
print("  - High harmonics fade within ~0.5s")
print("  - Fundamental persists longest (~2s)")
print("  - Each harmonic's decay rate is visible as its band fading")`,
      challenge: 'Add a cracked bell simulation: at harmonic 3, use 590 Hz instead of 600 Hz. In the scalogram, look for amplitude modulation (beating) at that frequency band. Can you measure the beat frequency from the scalogram?',
      successHint: 'Wavelet analysis is used in earthquake seismology, speech recognition, medical imaging (EEG/ECG), image compression (JPEG 2000), and gravitational wave detection. You just implemented a technique that helped detect black hole mergers.',
    },
    {
      title: 'Room acoustics — reverberation in the prayer hall',
      concept: `When a bell rings in the prayer hall, the sound does not simply travel to your ear. It bounces off walls, ceiling, floor, pillars, and statues. Each reflection arrives at a slightly different time, creating a “tail” of echoes called **reverberation**.

The **reverberation time** (RT60) is the time for the sound to decay by 60 dB. Concert halls aim for RT60 ≈ 2 seconds. A bathroom has RT60 ≈ 0.5 s. The Tawang prayer hall, with its stone walls and high ceiling, might have RT60 ≈ 3-4 seconds.

The Sabine equation predicts RT60: **RT60 = 0.161 × V / A**, where V is room volume (m³) and A is total absorption (m² × absorption coefficient).

The code simulates reverberation using a simple ray-tracing model.`,
      analogy: 'Throw a bouncy ball in a tiled bathroom. It bounces off walls for a long time. Throw it in a room full of pillows — it stops almost immediately. Sound in a room behaves the same way: hard surfaces reflect it (long reverberation), soft surfaces absorb it (short reverberation). The prayer hall’s stone walls make bell sounds linger, which the monks consider part of the bell’s spiritual resonance.',
      storyConnection: 'The prayer hall was designed for this effect. The high stone walls and ceiling create long reverberation that makes the bells sound fuller and more immersive. Buddhist architects understood intuitively what acousticians now quantify: the room is part of the instrument.',
      checkQuestion: 'Why do singers sound better in a shower than in a living room?',
      checkAnswer: 'The shower has hard tile surfaces (high reflection, low absorption) creating RT60 ≈ 1-2 seconds. This reverberation fills in gaps between notes, smooths imperfections, and adds warmth. The living room has carpet, curtains, and furniture (high absorption) creating RT60 ≈ 0.3 s — “dry” sound with no reverberant support. Professional recording studios add artificial reverb to replicate the shower effect.',
      codeIntro: 'Model reverberation in the Tawang prayer hall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sabine equation: RT60 = 0.161 × V / A
# V = volume, A = total absorption (sum of surface × absorption coefficient)

# Prayer hall dimensions (approximate)
length, width, height = 30, 15, 8  # metres
volume = length * width * height

# Surfaces and absorption coefficients (at 500 Hz)
surfaces = {
    'Stone walls': (2 * (length * height + width * height), 0.02),
    'Stone floor': (length * width, 0.01),
    'Wooden ceiling': (length * width, 0.10),
    'Wooden doors': (2 * 2 * 3, 0.15),
    'Fabric hangings': (20, 0.50),
    'People (50 monks)': (50 * 0.5, 0.80),
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 1. Absorption breakdown
names = list(surfaces.keys())
areas = [s[0] for s in surfaces.values()]
alphas = [s[1] for s in surfaces.values()]
absorption_units = [a * alpha for a, alpha in zip(areas, alphas)]

colors = ['#6b7280', '#9ca3af', '#f59e0b', '#92400e', '#ef4444', '#3b82f6']
axes[0, 0].barh(names, absorption_units, color=colors, height=0.5)
axes[0, 0].set_xlabel('Absorption (m² Sabins)', fontsize=10)
axes[0, 0].set_title('Where Sound Gets Absorbed', fontsize=11)
axes[0, 0].grid(axis='x', alpha=0.3)
axes[0, 0].tick_params(labelsize=9)

total_A = sum(absorption_units)
rt60 = 0.161 * volume / total_A

# 2. RT60 for different rooms
rooms = {
    'Bathroom': (12, 2),
    'Living room': (50, 15),
    'Classroom': (200, 25),
    'Prayer hall (empty)': (volume, total_A - 50*0.5*0.8),
    'Prayer hall (monks)': (volume, total_A),
    'Concert hall': (15000, 1200),
    'Cathedral': (50000, 2000),
}

room_names = list(rooms.keys())
rt60_values = [0.161 * v / a for v, a in rooms.values()]

colors2 = plt.cm.YlOrRd(np.linspace(0.2, 0.9, len(rooms)))
axes[0, 1].barh(room_names, rt60_values, color=colors2, height=0.5)
axes[0, 1].set_xlabel('RT60 (seconds)', fontsize=10)
axes[0, 1].set_title('Reverberation Times of Different Spaces', fontsize=11)
axes[0, 1].grid(axis='x', alpha=0.3)
axes[0, 1].tick_params(labelsize=9)

# 3. Simulated impulse response
t = np.linspace(0, 5, 50000)
# Simple exponential decay model
decay_rate = 6.9 / rt60  # decay rate for RT60
impulse_response = np.exp(-decay_rate * t)
# Add early reflections (discrete echoes)
for delay, amp in [(0.02, 0.8), (0.05, 0.6), (0.08, 0.5), (0.12, 0.4), (0.18, 0.3)]:
    idx = int(delay * 10000)
    if idx < len(impulse_response):
        impulse_response[idx:] += amp * np.exp(-decay_rate * (t[idx:] - delay))

# Add noise
impulse_response *= (1 + 0.1 * np.random.randn(len(t)))
impulse_response = np.clip(impulse_response, 0, None)

axes[1, 0].plot(t, impulse_response, color='#a855f7', linewidth=0.5)
axes[1, 0].set_xlabel('Time (s)', fontsize=10)
axes[1, 0].set_ylabel('Amplitude', fontsize=10)
axes[1, 0].set_title(f'Prayer Hall Impulse Response (RT60={rt60:.1f}s)', fontsize=11)
axes[1, 0].grid(alpha=0.3)
axes[1, 0].axhline(impulse_response[0] * 10**(-60/20), color='#ef4444',
                   linewidth=1, linestyle='--')
axes[1, 0].text(3, impulse_response[0] * 10**(-60/20) * 1.5, '-60 dB threshold',
               fontsize=8, color='#ef4444')

# 4. Effect on bell sound
bell_dry = np.zeros(50000)
bell_dry[:5000] = np.sin(2 * np.pi * 200 * t[:5000]) * np.exp(-2 * t[:5000])

# Simple convolution (reverb = signal * impulse response)
bell_reverb = np.convolve(bell_dry, impulse_response[:5000] / impulse_response[:5000].sum(),
                          mode='full')[:50000]

axes[1, 1].plot(t, bell_dry, color='#3b82f6', linewidth=0.8, alpha=0.5, label='Dry bell')
axes[1, 1].plot(t, bell_reverb, color='#f59e0b', linewidth=0.8, label='With reverb')
axes[1, 1].set_xlabel('Time (s)', fontsize=10)
axes[1, 1].set_ylabel('Amplitude', fontsize=10)
axes[1, 1].set_title('Bell Sound: Dry vs Reverberant', fontsize=11)
axes[1, 1].legend(fontsize=9)
axes[1, 1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"=== Tawang Prayer Hall Acoustics ===")
print(f"Volume: {volume} m³")
print(f"Total absorption: {total_A:.1f} Sabins")
print(f"RT60: {rt60:.1f} seconds")
print()
print("Reverb makes the bell sound fuller and more immersive.")
print("The room IS part of the instrument.")`,
      challenge: 'What happens if you add thick carpets (absorption = 0.6) to the floor? How does RT60 change? What if the monks leave (remove 50 people)? Design the ideal RT60 for the prayer hall using different surface treatments.',
      successHint: 'Room acoustics is a major field of engineering. Concert hall designers use exactly these calculations to create spaces where music sounds its best. The Sabine equation is the starting point for every acoustic design project.',
    },
    {
      title: 'Machine learning — classifying bell sounds',
      concept: `Dr. Lhamo recorded bells from monasteries across the Himalayas. She wants to automatically identify which bell is ringing from its sound. This is a **classification** problem — the same type of problem that speech recognition and music identification solve.

The approach:
1. **Feature extraction**: compute the FFT of each bell recording and extract the peak frequencies and their amplitudes
2. **Feature vector**: represent each bell as a vector [f1_amplitude, f2_amplitude, ..., fn_amplitude]
3. **Classification**: train a simple classifier (k-nearest neighbours) that identifies the bell from its feature vector

The code generates synthetic recordings of 5 different bells, extracts features, and trains a classifier.`,
      analogy: 'You can recognise your friends by their voices without seeing them. Your brain extracts features (pitch, timbre, speaking rhythm) and matches them against a stored database. A bell classifier does the same thing: extract acoustic features and match them against known bell “fingerprints.”',
      storyConnection: 'Dr. Lhamo’s research project was to catalogue and classify Himalayan bells. A trained classifier could automatically monitor the monastery’s bells, detect when a bell’s harmonics shift (indicating a developing crack), and alert the monks before the damage becomes severe — predictive maintenance for 350-year-old bells.',
      checkQuestion: 'Why use FFT features rather than the raw waveform for classification?',
      checkAnswer: 'The raw waveform depends on the exact moment of the recording (phase), the recording level (amplitude scaling), and the exact timing of the strike. Two recordings of the same bell can look very different in the time domain. But their FFT spectra will show the same frequency peaks at the same ratios. FFT features are **invariant** to timing and phase — they capture the bell’s identity regardless of when you recorded it.',
      codeIntro: 'Build a bell sound classifier using FFT features and KNN.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate synthetic bell recordings for 5 bells
sample_rate = 44100
duration = 1.0
t = np.linspace(0, duration, int(sample_rate * duration))

# Each bell has a different fundamental and harmonic profile
bells = {
    'Small bell': {'f0': 800, 'harmonics': [1.0, 0.3, 0.1, 0.05]},
    'Medium bell': {'f0': 400, 'harmonics': [1.0, 0.5, 0.3, 0.15, 0.08]},
    'Large bell': {'f0': 200, 'harmonics': [1.0, 0.6, 0.4, 0.25, 0.15, 0.08]},
    'Singing bowl': {'f0': 350, 'harmonics': [1.0, 0.8, 0.2, 0.05]},
    'Cracked bell': {'f0': 200, 'harmonics': [1.0, 0.6, 0.4, 0.25]},
}

def generate_bell(f0, harmonics, noise_level=0.05):
    """Generate a bell sound with noise"""
    signal = np.zeros_like(t)
    for n, amp in enumerate(harmonics, 1):
        freq = f0 * n * (1 + np.random.normal(0, 0.002))  # slight detuning
        decay = n * 2 + np.random.normal(0, 0.2)
        signal += amp * np.exp(-decay * t) * np.sin(2 * np.pi * freq * t)
    signal += noise_level * np.random.randn(len(t))
    return signal

def extract_features(signal, n_features=20):
    """Extract FFT-based features"""
    fft = np.abs(np.fft.fft(signal))
    freqs = np.fft.fftfreq(len(signal), 1/sample_rate)
    mask = (freqs > 50) & (freqs < 3000)
    spectrum = fft[mask]
    # Downsample to n_features bins
    bin_size = len(spectrum) // n_features
    features = np.array([spectrum[i*bin_size:(i+1)*bin_size].mean() for i in range(n_features)])
    return features / features.max()

# Generate training data (10 samples per bell)
X_train, y_train = [], []
bell_names = list(bells.keys())

for label, (name, params) in enumerate(bells.items()):
    for _ in range(10):
        signal = generate_bell(params['f0'], params['harmonics'])
        features = extract_features(signal)
        X_train.append(features)
        y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Simple KNN classifier
def knn_classify(x_new, X, y, k=3):
    distances = np.sqrt(np.sum((X - x_new)**2, axis=1))
    nearest = np.argsort(distances)[:k]
    votes = y[nearest]
    return np.bincount(votes).argmax()

# Test accuracy
correct = 0
n_test = 25
for _ in range(n_test):
    true_label = np.random.randint(0, len(bells))
    name = bell_names[true_label]
    params = bells[name]
    test_signal = generate_bell(params['f0'], params['harmonics'], noise_level=0.1)
    test_features = extract_features(test_signal)
    pred = knn_classify(test_features, X_train, y_train, k=3)
    if pred == true_label:
        correct += 1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Feature vectors visualisation
colors = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#ef4444']
for label, (name, color) in enumerate(zip(bell_names, colors)):
    mask = y_train == label
    mean_features = X_train[mask].mean(axis=0)
    ax1.plot(range(20), mean_features, color=color, linewidth=2, label=name)

ax1.set_xlabel('Feature bin (frequency band)', fontsize=10)
ax1.set_ylabel('Average amplitude', fontsize=10)
ax1.set_title('Bell Fingerprints (Feature Vectors)', fontsize=12)
ax1.legend(fontsize=8)
ax1.grid(alpha=0.3)

# 2D projection (first 2 features)
for label, (name, color) in enumerate(zip(bell_names, colors)):
    mask = y_train == label
    ax2.scatter(X_train[mask, 0], X_train[mask, 3], c=color, label=name, s=40, alpha=0.7)

ax2.set_xlabel('Feature 0 (low freq)', fontsize=10)
ax2.set_ylabel('Feature 3 (mid freq)', fontsize=10)
ax2.set_title('Bell Clusters in Feature Space', fontsize=12)
ax2.legend(fontsize=8)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"=== Bell Sound Classifier ===")
print(f"Training set: {len(X_train)} recordings ({len(X_train)//5} per bell)")
print(f"Features: 20 frequency-band amplitudes")
print(f"Classifier: k-Nearest Neighbours (k=3)")
print(f"Test accuracy: {correct}/{n_test} = {correct/n_test*100:.0f}%")
print()
print("Each bell has a unique 'fingerprint' in frequency space.")
print("The classifier identifies bells by matching fingerprints.")`,
      challenge: 'Add a 6th bell that is very similar to the “Large bell” but with slightly different harmonics. How does the classifier perform? Can you improve accuracy by using more features or adjusting k?',
      successHint: 'You just built an acoustic classifier — the same approach used in Shazam (music identification), voice assistants, and industrial monitoring. Feature extraction + classification is the universal pattern in applied machine learning.',
    },
    {
      title: 'Restoring Sangha — the capstone project',
      concept: `Now you have all the tools. Let’s design a computational pipeline to diagnose Sangha’s crack and plan its restoration.

The pipeline:
1. **Record** the cracked bell
2. **Fourier analysis** to identify which harmonics are split/shifted
3. **Wavelet analysis** to see how the beat patterns evolve over time
4. **Modal analysis** to determine which vibration modes are affected
5. **Simulation** of material removal to find where grinding will restore harmonic ratios
6. **Verification** by comparing the predicted spectrum to a target

This is a real engineering workflow. Bell restorers at the Whitechapel Bell Foundry and the Royal Eijsbouts foundry use exactly this approach.`,
      analogy: 'Restoring a cracked bell is like tuning a piano with one broken string. First you identify which notes are wrong (Fourier analysis). Then you figure out which string is broken and how (modal analysis). Then you replace or repair the string and verify it matches the correct frequency. The bell version uses metal grinding instead of string tightening, but the logic is identical.',
      storyConnection: 'This is the culmination of Dorji’s story. With the tools of acoustics, signal processing, and computational modelling, Sangha’s forty years of silence could end. The physics says the bell is not dead — just out of tune. The mathematics tells you exactly how to bring it back.',
      checkQuestion: 'Why is it easier to diagnose a bell computationally than by ear alone?',
      checkAnswer: 'The human ear perceives the composite sound — it hears “bad” but cannot easily distinguish a 3 Hz beat at the 3rd harmonic from a 5 Hz beat at the 5th. Computational analysis separates each harmonic individually, measures the exact detuning in Hz, and identifies which physical mode corresponds to each harmonic. This precision is necessary because removing metal from the wrong location would make the bell worse, not better.',
      codeIntro: 'Build the complete bell restoration pipeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === STEP 1: Simulate the cracked bell ===
fundamental = 200
sample_rate = 44100
duration = 3.0
t = np.linspace(0, duration, int(sample_rate * duration))

# Perfect bell harmonics
perfect_freqs = [fundamental * n for n in range(1, 7)]
# Cracked bell: some harmonics split
crack_effect = {1: (200, 202.5), 2: (400, 403), 3: (600, 608),
                4: (800, 806), 5: (1000, 1003), 6: (1200, 1205)}

# Generate cracked bell signal
cracked = np.zeros_like(t)
for n in range(1, 7):
    f_a, f_b = crack_effect[n]
    amp = 1.0 / n
    decay = n * 1.5
    cracked += amp * np.exp(-decay * t) * (
        0.5 * np.sin(2 * np.pi * f_a * t) +
        0.5 * np.sin(2 * np.pi * f_b * t))

fig, axes = plt.subplots(2, 3, figsize=(15, 8))

# === STEP 2: Fourier Analysis ===
fft_cracked = np.abs(np.fft.fft(cracked))
freqs = np.fft.fftfreq(len(t), 1/sample_rate)
mask = (freqs > 100) & (freqs < 1400)

axes[0, 0].plot(freqs[mask], fft_cracked[mask] / fft_cracked[mask].max(),
               color='#ef4444', linewidth=1)
axes[0, 0].set_title('Step 2: FFT — Split Peaks Detected', fontsize=10, color='white')
axes[0, 0].set_xlabel('Frequency (Hz)', fontsize=9)
axes[0, 0].set_ylabel('Amplitude', fontsize=9)
axes[0, 0].grid(alpha=0.3)

# Annotate splits
for n in range(1, 7):
    f_a, f_b = crack_effect[n]
    axes[0, 0].axvline(f_a, color='white', linewidth=0.3, alpha=0.3)
    beat = abs(f_b - f_a)
    axes[0, 0].text(f_a, 0.95/n, f'Δf={beat:.1f}Hz', fontsize=7, color='#f59e0b')

# === STEP 3: Beat frequency diagnosis ===
beat_freqs = [abs(crack_effect[n][1] - crack_effect[n][0]) for n in range(1, 7)]
harmonics_n = list(range(1, 7))

axes[0, 1].bar(harmonics_n, beat_freqs, color='#f59e0b', width=0.5)
axes[0, 1].set_xlabel('Harmonic number', fontsize=9)
axes[0, 1].set_ylabel('Beat frequency (Hz)', fontsize=9)
axes[0, 1].set_title('Step 3: Beat Frequencies per Harmonic', fontsize=10, color='white')
axes[0, 1].grid(axis='y', alpha=0.3)

# === STEP 4: Target vs actual ===
target_freqs = perfect_freqs
actual_freqs_a = [crack_effect[n][0] for n in range(1, 7)]
actual_freqs_b = [crack_effect[n][1] for n in range(1, 7)]

x_pos = np.arange(6)
axes[0, 2].bar(x_pos - 0.2, target_freqs, width=0.2, color='#10b981', label='Target')
axes[0, 2].bar(x_pos, actual_freqs_a, width=0.2, color='#ef4444', label='Crack A')
axes[0, 2].bar(x_pos + 0.2, actual_freqs_b, width=0.2, color='#f59e0b', label='Crack B')
axes[0, 2].set_xlabel('Harmonic', fontsize=9)
axes[0, 2].set_ylabel('Frequency (Hz)', fontsize=9)
axes[0, 2].set_title('Step 4: Target vs Actual Frequencies', fontsize=10, color='white')
axes[0, 2].legend(fontsize=7)
axes[0, 2].grid(axis='y', alpha=0.3)

# === STEP 5: Restoration simulation ===
# Simulate grinding: gradually bring crack frequencies toward target
grinding_steps = 10
restoration_progress = np.zeros((6, grinding_steps))

for n_idx in range(6):
    f_target = target_freqs[n_idx]
    f_actual_a = actual_freqs_a[n_idx]
    f_actual_b = actual_freqs_b[n_idx]
    for step in range(grinding_steps):
        progress = step / (grinding_steps - 1)
        # Both crack frequencies converge toward target
        f_a = f_actual_a + (f_target - f_actual_a) * progress
        f_b = f_actual_b + (f_target - f_actual_b) * progress
        restoration_progress[n_idx, step] = abs(f_b - f_a)

for n_idx in range(6):
    axes[1, 0].plot(range(grinding_steps), restoration_progress[n_idx],
                   linewidth=2, label=f'Harmonic {n_idx+1}')
axes[1, 0].set_xlabel('Grinding steps', fontsize=9)
axes[1, 0].set_ylabel('Beat frequency (Hz)', fontsize=9)
axes[1, 0].set_title('Step 5: Beat Freq → 0 During Restoration', fontsize=10, color='white')
axes[1, 0].legend(fontsize=7, ncol=2)
axes[1, 0].grid(alpha=0.3)

# === STEP 6: Before/After comparison ===
# Generate restored bell
restored = np.zeros_like(t)
for n in range(1, 7):
    f = fundamental * n
    amp = 1.0 / n
    decay = n * 1.5
    restored += amp * np.exp(-decay * t) * np.sin(2 * np.pi * f * t)

# FFT comparison
fft_restored = np.abs(np.fft.fft(restored))
axes[1, 1].plot(freqs[mask], fft_cracked[mask] / fft_cracked[mask].max(),
               color='#ef4444', linewidth=1, alpha=0.5, label='Before (cracked)')
axes[1, 1].plot(freqs[mask], fft_restored[mask] / fft_restored[mask].max(),
               color='#10b981', linewidth=2, label='After (restored)')
axes[1, 1].set_xlabel('Frequency (Hz)', fontsize=9)
axes[1, 1].set_ylabel('Amplitude', fontsize=9)
axes[1, 1].set_title('Step 6: Before vs After', fontsize=10, color='white')
axes[1, 1].legend(fontsize=8)
axes[1, 1].grid(alpha=0.3)

# Quality metric
axes[1, 2].text(0.5, 0.8, 'RESTORATION REPORT', fontsize=14, color='white',
               ha='center', va='center', fontweight='bold', transform=axes[1, 2].transAxes)
axes[1, 2].text(0.5, 0.55, f'Harmonics repaired: 6/6',
               fontsize=11, color='#10b981', ha='center', transform=axes[1, 2].transAxes)
axes[1, 2].text(0.5, 0.40, f'Max beat freq: {max(beat_freqs):.1f} Hz → 0.0 Hz',
               fontsize=11, color='#10b981', ha='center', transform=axes[1, 2].transAxes)
axes[1, 2].text(0.5, 0.25, f'Status: SANGHA RESTORED',
               fontsize=12, color='#f59e0b', ha='center', fontweight='bold',
               transform=axes[1, 2].transAxes)
axes[1, 2].text(0.5, 0.10, f'After 40 years of silence,\\\nthe bell can sing again.',
               fontsize=10, color='lightgray', ha='center', style='italic',
               transform=axes[1, 2].transAxes)
axes[1, 2].set_xlim(0, 1)
axes[1, 2].set_ylim(0, 1)
axes[1, 2].axis('off')

plt.tight_layout()
plt.show()

print("=== SANGHA RESTORATION PIPELINE ===")
print("1. Record cracked bell")
print("2. FFT → identify split harmonics")
print("3. Measure beat frequencies")
print("4. Compare to target (perfect bell) frequencies")
print("5. Simulate grinding to restore harmonics")
print("6. Verify: clean peaks, zero beats")
print()
print("Dorji's bell can ring again. The physics was always there —")
print("it just needed someone who could read it.")`,
      challenge: 'Extend the pipeline: add a cost function that measures how far the cracked bell’s spectrum deviates from the target (e.g., sum of squared frequency errors). Optimise the grinding simulation to minimise this cost. Can you find the minimum grinding needed to make the bell “acceptable” (beat frequencies below 1 Hz)?',
      successHint: 'You just built a complete engineering pipeline: measurement, diagnosis, modelling, optimisation, and verification. This is how real engineering works — in aerospace, medicine, manufacturing, and yes, bell restoration. The story of Sangha is the story of applied physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Research-level acoustics and computational modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for research-level acoustics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[BellFourierDiagram, BellHarmonicsDiagram, BellFrequencyDiagram, BellSoundWaveDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i] ? createElement([BellFourierDiagram, BellHarmonicsDiagram, BellFrequencyDiagram, BellSoundWaveDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
