import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FrogSingLevel2() {
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
      title: 'Spectrogram analysis of frog calls — reading the visual language of sound',
      concept: `A **spectrogram** is a visual representation of sound that shows how frequency content changes over time. It is the single most important tool in bioacoustics.

**Axes:**
- **X-axis**: time
- **Y-axis**: frequency (Hz)
- **Color/brightness**: intensity (louder = brighter)

**How spectrograms are made:**
1. Divide the audio into short overlapping windows (typically 10-50 ms)
2. Apply the **Fast Fourier Transform (FFT)** to each window to extract frequency content
3. Stack the frequency snapshots side by side → the spectrogram

**Key spectrogram parameters:**
- **Window size (NFFT)**: larger = better frequency resolution, worse time resolution
- **Overlap**: more overlap = smoother appearance but more computation
- **This is the time-frequency tradeoff**: you can't have perfect resolution in both simultaneously (Heisenberg uncertainty principle applies to signals too!)

**Reading frog calls on spectrograms:**
- **Tonal calls**: appear as clear horizontal lines (constant frequency)
- **Frequency sweeps**: appear as rising or falling lines
- **Harmonics**: appear as parallel lines at integer multiples of the fundamental
- **Pulsed calls**: appear as repeated short bursts
- **Noisy calls**: appear as broad frequency bands

Each frog species has a unique spectrogram "fingerprint" — as distinctive as a human fingerprint.`,
      analogy: 'A spectrogram is like sheet music written by nature. Where a composer uses notes on a staff to indicate pitch over time, a spectrogram shows every frequency present in a sound over time. But unlike sheet music, a spectrogram captures everything — every harmonic, every noise, every overlap between species.',
      storyConnection: 'If someone had recorded the wetland chorus from the story and generated a spectrogram, they would see a stunningly organized image: horizontal bands of frog calls at different frequencies, pulsing insect trills, and occasional bird calls — all neatly partitioned in frequency and time. The beauty of the chorus becomes visible as well as audible.',
      checkQuestion: 'Why does increasing the FFT window size improve frequency resolution but worsen time resolution?',
      checkAnswer: 'A longer window captures more cycles of a wave, allowing more precise frequency measurement (you need several cycles to determine frequency accurately). But a longer window averages over more time, blurring rapid changes. A 100 ms window can resolve frequencies to ~10 Hz but can\'t distinguish events closer than 100 ms apart. A 10 ms window resolves time to 10 ms but frequencies only to ~100 Hz. You always trade one for the other.',
      codeIntro: 'Generate synthetic frog calls and analyze them with spectrograms at different resolutions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate synthetic frog calls
sr = 16000  # sample rate
duration = 3.0  # seconds
t = np.arange(0, duration, 1/sr)
signal = np.zeros_like(t)

# Species 1: Tonal call at 1500 Hz, repeated every 0.5s
for start in np.arange(0.1, duration - 0.15, 0.5):
    idx = (t >= start) & (t < start + 0.15)
    env = np.sin(np.pi * (t[idx] - start) / 0.15)
    signal[idx] += 0.8 * env * np.sin(2 * np.pi * 1500 * t[idx])
    signal[idx] += 0.3 * env * np.sin(2 * np.pi * 3000 * t[idx])  # harmonic

# Species 2: Frequency sweep from 3000 to 4000 Hz
for start in np.arange(0.3, duration - 0.1, 0.7):
    idx = (t >= start) & (t < start + 0.08)
    env = np.sin(np.pi * (t[idx] - start) / 0.08)
    sweep = 3000 + 1000 * (t[idx] - start) / 0.08
    signal[idx] += 0.5 * env * np.sin(2 * np.pi * sweep * t[idx])

# Species 3: Pulsed trill at 5000 Hz
for start in np.arange(0.0, duration - 0.3, 0.8):
    for pulse in np.arange(start, start + 0.3, 0.03):
        idx = (t >= pulse) & (t < pulse + 0.015)
        if np.any(idx):
            env = np.sin(np.pi * (t[idx] - pulse) / 0.015)
            signal[idx] += 0.4 * env * np.sin(2 * np.pi * 5000 * t[idx])

# Add noise
signal += np.random.normal(0, 0.05, len(signal))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spectrogram Analysis: Three Frog Species', color='white', fontsize=14)

# Waveform
ax1 = axes[0][0]
ax1.set_facecolor('#111827')
ax1.plot(t, signal, color='#22c55e', linewidth=0.3)
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Waveform (raw audio)', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# Standard spectrogram
ax2 = axes[0][1]
ax2.set_facecolor('#111827')
ax2.specgram(signal, NFFT=512, Fs=sr, noverlap=480, cmap='viridis', vmin=-60, vmax=-10)
ax2.set_ylim(0, 7000)
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Frequency (Hz)', color='white')
ax2.set_title('Spectrogram (NFFT=512, balanced)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# High frequency resolution
ax3 = axes[1][0]
ax3.set_facecolor('#111827')
ax3.specgram(signal, NFFT=2048, Fs=sr, noverlap=2000, cmap='viridis', vmin=-60, vmax=-10)
ax3.set_ylim(0, 7000)
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Frequency (Hz)', color='white')
ax3.set_title('High freq resolution (NFFT=2048, blurred time)', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# High time resolution
ax4 = axes[1][1]
ax4.set_facecolor('#111827')
ax4.specgram(signal, NFFT=128, Fs=sr, noverlap=100, cmap='viridis', vmin=-60, vmax=-10)
ax4.set_ylim(0, 7000)
ax4.set_xlabel('Time (s)', color='white')
ax4.set_ylabel('Frequency (Hz)', color='white')
ax4.set_title('High time resolution (NFFT=128, blurred freq)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Three species visible in the spectrogram:")
print("  Species 1: Tonal at 1500 Hz + harmonic at 3000 Hz (horizontal bands)")
print("  Species 2: Upward sweep 3000→4000 Hz (diagonal lines)")
print("  Species 3: Pulsed trill at 5000 Hz (dotted band)")
print()
print("Time-frequency tradeoff:")
print("  NFFT=2048: freq resolution = 8 Hz, time resolution = 128 ms")
print("  NFFT=512:  freq resolution = 31 Hz, time resolution = 32 ms")
print("  NFFT=128:  freq resolution = 125 Hz, time resolution = 8 ms")`,
      challenge: 'Add a 4th species that produces a frequency-modulated call oscillating between 2000 and 2500 Hz (like a siren). What does it look like on the spectrogram? How is it different from both tonal calls and sweeps?',
      successHint: 'Spectrogram analysis is the foundation of all bioacoustics research. Every species identification, every population survey, every ecological assessment starts with reading spectrograms. Mastering this skill is like learning to read — it opens up an entire world of information.',
    },
    {
      title: 'Species identification by sound — acoustic fingerprints',
      concept: `Every frog species has a unique call that serves as an **acoustic fingerprint**. Bioacousticians use these fingerprints to identify species from recordings without ever seeing the animal.

**Features used for identification:**
- **Dominant frequency**: the loudest frequency in the call
- **Call duration**: how long each call lasts
- **Call rate**: calls per minute
- **Number of pulses**: some calls consist of repeated pulses
- **Frequency range**: bandwidth of the call
- **Harmonic structure**: presence and strength of overtones
- **Temporal pattern**: rhythm and spacing of call elements

**Feature extraction process:**
1. Isolate individual calls from the recording (segmentation)
2. Measure acoustic features for each call
3. Compare features to a reference database
4. Assign species ID based on closest match

**Challenges:**
- Individual variation (same species, slightly different calls)
- Environmental effects (temperature changes pitch, rain adds noise)
- Overlapping calls (multiple species calling simultaneously)
- Novel species (calls not in the database)

**In NE India**, acoustic surveys have discovered new frog species that were cryptic — visually identical to known species but with distinctly different calls. Sound revealed what sight could not.`,
      analogy: 'Acoustic species identification is like recognizing people by their voice on the phone. You don\'t need to see them — the frequency, rhythm, accent, and cadence are enough. Each frog species has its own "accent" that is unmistakable to a trained ear (or algorithm). The challenge is building a "voice recognition" system for frogs.',
      storyConnection: 'A researcher sitting beside the story\'s wetland with a recording device could identify every frog species present without seeing a single animal. The bullfrog\'s deep boom, the tree frog\'s rapid trill, the peeper\'s ascending whistle — each as distinctive as a name spoken aloud. The chorus is a roll call, and every species is answering.',
      checkQuestion: 'Two frog populations of the same species live on opposite sides of a mountain. Over 10,000 years, their calls drift apart slightly (different frequencies, different rhythms). At what point would you classify them as different species?',
      checkAnswer: 'When females from one population no longer respond to males from the other. Acoustic divergence is one of the earliest signs of speciation in frogs. If a female from population A doesn\'t recognize population B\'s call as "her species," they won\'t mate — reproductive isolation has begun. This is called acoustic speciation, and it has been documented in real time in some frog groups.',
      codeIntro: 'Build a simple species classifier using acoustic features extracted from calls.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate feature data for 5 frog species
# Features: dominant frequency (Hz), call duration (ms), call rate (calls/min)

species_params = {
    'Bullfrog': {'freq': (280, 40), 'dur': (600, 100), 'rate': (8, 3)},
    'Tree frog A': {'freq': (2800, 200), 'dur': (80, 20), 'rate': (60, 15)},
    'Tree frog B': {'freq': (4200, 300), 'dur': (120, 30), 'rate': (40, 10)},
    'Peeper': {'freq': (3200, 150), 'dur': (150, 30), 'rate': (100, 20)},
    'Cricket frog': {'freq': (5500, 400), 'dur': (50, 15), 'rate': (120, 30)},
}

colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']
n_samples = 30  # calls per species

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Feature space: frequency vs duration
ax1.set_facecolor('#111827')
all_features = {}
for (name, params), color in zip(species_params.items(), colors):
    freqs = np.random.normal(params['freq'][0], params['freq'][1], n_samples)
    durs = np.random.normal(params['dur'][0], params['dur'][1], n_samples)
    rates = np.random.normal(params['rate'][0], params['rate'][1], n_samples)
    all_features[name] = {'freq': freqs, 'dur': durs, 'rate': rates}

    ax1.scatter(freqs, durs, s=40, c=color, alpha=0.6, label=name, edgecolors='white', linewidth=0.3)

ax1.set_xlabel('Dominant frequency (Hz)', color='white')
ax1.set_ylabel('Call duration (ms)', color='white')
ax1.set_title('Species in Acoustic Feature Space', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Classification: nearest centroid
# Test with unknown calls
n_test = 20
test_calls = []
true_labels = []
for name, params in species_params.items():
    for _ in range(n_test // len(species_params)):
        f = np.random.normal(params['freq'][0], params['freq'][1] * 1.5)  # wider spread
        d = np.random.normal(params['dur'][0], params['dur'][1] * 1.5)
        test_calls.append((f, d))
        true_labels.append(name)

# Calculate centroids
centroids = {}
for name, feats in all_features.items():
    centroids[name] = (np.mean(feats['freq']), np.mean(feats['dur']))

# Classify each test call
correct = 0
predictions = []
for (f, d), true in zip(test_calls, true_labels):
    distances = {}
    for name, (cf, cd) in centroids.items():
        # Normalize: frequency range ~5000, duration range ~600
        dist = np.sqrt(((f - cf)/1000)**2 + ((d - cd)/100)**2)
        distances[name] = dist
    predicted = min(distances, key=distances.get)
    predictions.append(predicted)
    if predicted == true:
        correct += 1

accuracy = correct / len(true_labels) * 100

# Confusion matrix
ax2.set_facecolor('#111827')
species_list = list(species_params.keys())
n_sp = len(species_list)
confusion = np.zeros((n_sp, n_sp))
for true, pred in zip(true_labels, predictions):
    i = species_list.index(true)
    j = species_list.index(pred)
    confusion[i, j] += 1

im = ax2.imshow(confusion, cmap='Blues', aspect='auto')
ax2.set_xticks(range(n_sp))
ax2.set_yticks(range(n_sp))
short_names = [n.split(' ')[0] for n in species_list]
ax2.set_xticklabels(short_names, color='white', fontsize=8, rotation=45, ha='right')
ax2.set_yticklabels(short_names, color='white', fontsize=8)
ax2.set_xlabel('Predicted', color='white')
ax2.set_ylabel('True', color='white')
ax2.set_title(f'Classification Confusion Matrix ({accuracy:.0f}% accuracy)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for i in range(n_sp):
    for j in range(n_sp):
        ax2.text(j, i, f'{int(confusion[i,j])}', ha='center', va='center',
                color='white' if confusion[i,j] > 1 else '#6b7280', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Species classification results:")
print(f"  Method: Nearest centroid (2 features: frequency + duration)")
print(f"  Training samples: {n_samples} per species")
print(f"  Test samples: {n_test}")
print(f"  Accuracy: {accuracy:.0f}%")
print()
print("Misclassifications are most likely between species with similar features.")
print("Adding more features (rate, harmonics, pulse count) improves accuracy.")`,
      challenge: 'Add a 3rd feature (call rate) to the classifier. Does the accuracy improve? Visualize the 3D feature space using a scatter plot with the third dimension as point size. Which species pairs become easier to separate?',
      successHint: 'Species identification from sound is the practical application of bioacoustics. The classifier we built is the simplest version — real systems use machine learning with dozens of features and can identify hundreds of species from continuous recordings.',
    },
    {
      title: 'Acoustic monitoring networks — listening at scale',
      concept: `A single acoustic recorder monitors a few hectares. To monitor an entire ecosystem, you need a **network** of recorders deployed systematically across the landscape.

**Network design:**
- **Grid deployment**: recorders at regular intervals (e.g., 500m spacing)
- **Stratified deployment**: proportional coverage of different habitat types
- **Clustered deployment**: dense coverage in priority areas (breeding sites, corridors)

**Detection radius**: depends on species, terrain, and background noise
- Loud frogs (bullfrogs): detectable at 500m+
- Quiet frogs (peepers): detectable at 50-100m
- In dense forest: detection radius drops 50%+

**Key network metrics:**
- **Coverage**: what fraction of the study area is within detection range?
- **Occupancy**: what fraction of recorders detect a target species?
- **Detection probability**: given a species is present, what's the chance the recorder detects it?
- **False absence rate**: species is present but not detected (common for rare or quiet species)

**Statistical framework**: **occupancy modeling**
- **ψ (psi)**: true occupancy (fraction of sites where species lives)
- **p**: detection probability per survey
- **Probability of detection over n surveys**: 1 - (1-p)^n
- Example: if p = 0.3 (30% per night), 5 nights gives 1 - 0.7^5 = 83% cumulative detection

**Modern networks:**
- ARBIMON (Puerto Rico): 30+ recorders, continuous monitoring
- Listening Land (Australia): community-driven acoustic monitoring
- Rain Forest Connection: repurposed phones as acoustic monitors in tropical forests`,
      analogy: 'An acoustic monitoring network is like a cellular phone network for wildlife. Each recorder is a "cell tower" that picks up signals (calls) within its range. Gaps between towers mean dropped calls (missed species). Too many towers is expensive. The design challenge is maximum coverage at minimum cost — exactly like optimizing cell tower placement.',
      storyConnection: 'If the story\'s wetland were part of a monitoring network, a grid of 10 recorders would capture the chorus from every angle. Combined, they could map where each species calls from, track how the chorus moves with rainfall, and detect any decline in species diversity year to year. The story captures one night; a network captures every night.',
      checkQuestion: 'A species has a detection probability of p=0.2 per night. How many nights must you record to be 95% confident you\'d detect it if it were present?',
      checkAnswer: 'We need: 1 - (1-0.2)^n >= 0.95. So (0.8)^n <= 0.05. Taking logs: n >= ln(0.05)/ln(0.8) = (-3.00)/(-0.223) = 13.4. You need at least 14 nights of recording. This is why acoustic surveys must run for weeks, not days — rare species require patience.',
      codeIntro: 'Design an acoustic monitoring network and model detection probability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Design a monitoring network for a 2km x 2km wetland
area_size = 2000  # meters

# Deploy recorders in a grid
spacing = 400  # meters between recorders
x_coords = np.arange(spacing/2, area_size, spacing)
y_coords = np.arange(spacing/2, area_size, spacing)
recorder_positions = [(x, y) for x in x_coords for y in y_coords]
n_recorders = len(recorder_positions)

# Detection radius varies by species
species_detection = {
    'Bullfrog': {'radius': 500, 'p_detect': 0.8, 'color': '#22c55e'},
    'Tree frog': {'radius': 150, 'p_detect': 0.5, 'color': '#3b82f6'},
    'Peeper': {'radius': 80, 'p_detect': 0.3, 'color': '#f59e0b'},
    'Rare frog': {'radius': 100, 'p_detect': 0.1, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network layout with detection circles
ax1.set_facecolor('#111827')

# Plot detection circles for tree frog (mid-range)
for x, y in recorder_positions:
    circle = plt.Circle((x, y), 150, fill=False, color='#3b82f6', alpha=0.2, linewidth=0.5)
    ax1.add_patch(circle)
    ax1.plot(x, y, 's', color='#3b82f6', markersize=6)

# Calculate coverage for each species
for name, params in species_detection.items():
    # Create a grid and check coverage
    check_x = np.arange(0, area_size, 10)
    check_y = np.arange(0, area_size, 10)
    covered = 0
    total = len(check_x) * len(check_y)
    for cx in check_x:
        for cy in check_y:
            for rx, ry in recorder_positions:
                if np.sqrt((cx-rx)**2 + (cy-ry)**2) <= params['radius']:
                    covered += 1
                    break
    coverage = covered / total * 100

ax1.set_xlim(0, area_size)
ax1.set_ylim(0, area_size)
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Distance (m)', color='white')
ax1.set_title(f'Recorder Network ({n_recorders} units, {spacing}m spacing)', color='white', fontsize=12)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# Detection probability vs survey nights
ax2.set_facecolor('#111827')
nights = np.arange(1, 31)

for name, params in species_detection.items():
    p = params['p_detect']
    cum_prob = 1 - (1 - p)**nights
    ax2.plot(nights, cum_prob * 100, color=params['color'], linewidth=2,
            label=f'{name} (p={p})')

ax2.axhline(95, color='#6b7280', linestyle='--', linewidth=1)
ax2.text(25, 96, '95% confidence', color='#6b7280', fontsize=9)

ax2.set_xlabel('Survey nights', color='white')
ax2.set_ylabel('Cumulative detection probability (%)', color='white')
ax2.set_title('How Many Nights to Detect Each Species?', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Network design: {n_recorders} recorders, {spacing}m spacing")
print(f"Area: {area_size}m × {area_size}m = {(area_size/1000)**2:.1f} km²")
print()
print("Nights needed for 95% detection confidence:")
for name, params in species_detection.items():
    p = params['p_detect']
    n_needed = int(np.ceil(np.log(0.05) / np.log(1 - p)))
    print(f"  {name:12s} (p={p}): {n_needed:>3} nights")
print()
print("The rare frog (p=0.1) needs 29 nights — nearly a month!")
print("This is why long-term acoustic monitoring is essential")
print("for detecting rare and cryptic species.")`,
      challenge: 'Double the recorder spacing to 800m (halving the number of recorders and cost). How does this affect the detection coverage for each species? Is the cost savings worth the coverage loss? This is the fundamental trade-off in monitoring network design.',
      successHint: 'Acoustic monitoring networks are the infrastructure of acoustic ecology. Designing them requires balancing coverage, cost, and statistical power. The math of detection probability and occupancy modeling determines whether your survey will succeed or miss the species you care about most.',
    },
    {
      title: 'Signal detection in noise — finding calls in the chaos',
      concept: `Real acoustic recordings are noisy. Rain, wind, traffic, other species, and equipment hum all create background noise that can mask the signals you're looking for. **Signal detection theory** provides the mathematical framework for separating signal from noise.

**Signal-to-Noise Ratio (SNR):**
**SNR = 10 × log₁₀(P_signal / P_noise)** (in decibels)
- SNR > 10 dB: signal clearly audible, easy to detect
- SNR = 0 dB: signal and noise are equal strength
- SNR < 0 dB: signal is buried in noise (hard to detect)

**Detection strategies:**
1. **Energy detection**: if total energy in a frequency band exceeds a threshold, flag as detection. Simple but many false positives.
2. **Matched filtering**: correlate the recording with a known call template. High sensitivity but only finds exact matches.
3. **Spectral subtraction**: estimate the noise spectrum, subtract it, leaving the signal.
4. **Band-pass filtering**: only keep frequencies within the species' call range, rejecting noise at other frequencies.

**The detection trade-off (ROC curve):**
- **Sensitivity (recall)**: fraction of real calls detected (high = catch everything)
- **Specificity**: fraction of non-calls correctly rejected (high = few false alarms)
- You can't maximize both — lowering the detection threshold catches more real calls but also more false positives

**In NE India**, monsoon rain creates extreme noise conditions. Rain on leaves can reach 80 dB — louder than many frog calls. Adaptive filtering and frequency-selective analysis are essential.`,
      analogy: 'Finding a frog call in noise is like hearing someone whisper your name at a loud party. Your brain uses selective attention (tuning to the right frequency and pattern), expectation (you know what your name sounds like), and spatial filtering (focusing on one direction). Signal detection algorithms do the same thing computationally: tune to the right frequency, match against a template, and reject everything else.',
      storyConnection: 'The rain in the story didn\'t just trigger the frog chorus — it also created background noise. The frogs had to call loudly enough to be heard above the rain. Some species call at frequencies where rain noise is weakest — an evolutionary adaptation to signal detection in noise. The frogs solved the SNR problem before we named it.',
      checkQuestion: 'A frog species calls at exactly the frequency where rain noise is loudest (around 2,000-5,000 Hz). How might it adapt to still be heard?',
      checkAnswer: 'Several strategies: (1) Call louder (increase signal power). (2) Shift call timing to gaps between rain bursts. (3) Increase call redundancy (repeat the call many times so at least some get through). (4) Use frequency modulation — a sweeping call is easier to detect in broadband noise than a pure tone. (5) Call from locations where rain noise is reduced (under leaf cover). All of these have been documented in tropical frog species.',
      codeIntro: 'Implement signal detection algorithms and visualize the ROC trade-off.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a frog call buried in noise at different SNR levels
sr = 8000
duration = 2.0
t = np.arange(0, duration, 1/sr)

# Clean frog call: tone at 2500 Hz, 100ms duration, at t=1.0s
call_start = 1.0
call_dur = 0.1
call_freq = 2500
clean_call = np.zeros_like(t)
call_idx = (t >= call_start) & (t < call_start + call_dur)
env = np.sin(np.pi * (t[call_idx] - call_start) / call_dur)
clean_call[call_idx] = env * np.sin(2 * np.pi * call_freq * t[call_idx])

# Create signals at different SNR levels
snr_levels = [20, 10, 0, -5]
fig, axes = plt.subplots(len(snr_levels), 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Signal Detection at Different SNR Levels', color='white', fontsize=14)

for idx, snr_db in enumerate(snr_levels):
    # Generate noise
    noise_power = np.mean(clean_call[call_idx]**2) / (10**(snr_db/10))
    noise = np.random.normal(0, np.sqrt(noise_power), len(t))
    noisy_signal = clean_call + noise

    # Waveform
    ax1 = axes[idx][0]
    ax1.set_facecolor('#111827')
    ax1.plot(t, noisy_signal, color='#3b82f6', linewidth=0.3, alpha=0.7)
    ax1.plot(t, clean_call * 3, color='#22c55e', linewidth=1, alpha=0.8)
    ax1.set_ylabel(f'SNR={snr_db}dB', color='white', fontsize=10)
    ax1.tick_params(colors='gray')
    ax1.set_ylim(-1.5, 1.5)
    if idx == 0:
        ax1.set_title('Waveform (green=call, blue=noisy)', color='white', fontsize=11)

    # Spectrogram with detection
    ax2 = axes[idx][1]
    ax2.set_facecolor('#111827')
    ax2.specgram(noisy_signal, NFFT=256, Fs=sr, noverlap=230, cmap='inferno', vmin=-50, vmax=0)
    ax2.set_ylim(0, 4000)
    ax2.tick_params(colors='gray')
    if idx == 0:
        ax2.set_title('Spectrogram (can you see the call?)', color='white', fontsize=11)
    ax2.axhline(call_freq, color='#22c55e', linestyle=':', linewidth=0.5, alpha=0.5)

axes[-1][0].set_xlabel('Time (s)', color='white')
axes[-1][1].set_xlabel('Time (s)', color='white')

plt.tight_layout()
plt.show()

# ROC curve: detection performance at different thresholds
# Use energy in the target frequency band as detector
n_trials = 1000
true_positives = []
false_positives = []
thresholds = np.linspace(0, 2, 50)

for thresh in thresholds:
    tp = 0
    fp = 0
    for _ in range(n_trials // 2):
        # Trial with call (signal present)
        noise = np.random.normal(0, 0.3, int(call_dur * sr))
        signal_with_call = np.sin(2 * np.pi * call_freq * np.arange(len(noise))/sr) * 0.5 + noise
        energy = np.mean(signal_with_call**2)
        if energy > thresh:
            tp += 1

        # Trial without call (noise only)
        noise_only = np.random.normal(0, 0.3, int(call_dur * sr))
        energy_noise = np.mean(noise_only**2)
        if energy_noise > thresh:
            fp += 1

    true_positives.append(tp / (n_trials // 2))
    false_positives.append(fp / (n_trials // 2))

fig2, ax_roc = plt.subplots(figsize=(6, 6))
fig2.patch.set_facecolor('#1f2937')
ax_roc.set_facecolor('#111827')
ax_roc.plot(false_positives, true_positives, 'o-', color='#22c55e', linewidth=2, markersize=3)
ax_roc.plot([0, 1], [0, 1], '--', color='#6b7280', linewidth=1, label='Random (no skill)')
ax_roc.set_xlabel('False positive rate', color='white')
ax_roc.set_ylabel('True positive rate (sensitivity)', color='white')
ax_roc.set_title('ROC Curve: Detection Performance', color='white', fontsize=13)
ax_roc.legend(facecolor='#1f2937', labelcolor='white')
ax_roc.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Detection visibility by SNR:")
print("  +20 dB: Call clearly visible in waveform and spectrogram")
print("  +10 dB: Visible in spectrogram, harder in waveform")
print("    0 dB: Barely visible in spectrogram")
print("   -5 dB: Invisible without advanced filtering")`,
      challenge: 'Implement a matched filter: cross-correlate the noisy signal with a template of the clean call. Plot the cross-correlation and find the peak. Does the matched filter detect the call at -5 dB SNR where the energy detector fails?',
      successHint: 'Signal detection in noise is a fundamental problem that appears everywhere: radar, medical imaging, radio astronomy, and bioacoustics. The math is identical across all domains. The ROC curve quantifies the trade-off between catching true signals and accepting false alarms.',
    },
    {
      title: 'Machine learning for species identification — teaching computers to listen',
      concept: `**Machine learning (ML)** transforms bioacoustics from manual analysis to automated, scalable monitoring. Instead of a human expert listening to thousands of hours of recordings, a trained model can process them in minutes.

**ML pipeline for species ID:**
1. **Data collection**: record thousands of labeled calls per species
2. **Feature extraction**: convert audio to numerical features
   - Mel-frequency cepstral coefficients (MFCCs)
   - Spectrogram images
   - Temporal features (duration, rate, rhythm)
3. **Model training**: feed features and labels to an algorithm
   - **Random Forest**: works well with extracted features
   - **CNN (Convolutional Neural Network)**: works directly on spectrogram images
   - **RNN/LSTM**: captures temporal patterns in call sequences
4. **Validation**: test on held-out data the model hasn't seen
5. **Deployment**: run the trained model on new recordings

**Real-world performance:**
- BirdNET (Cornell): identifies 3,000+ bird species from sound, ~85% accuracy
- Ribbit (for frogs): identifies 50+ species, 80-90% accuracy
- These models run on smartphones — anyone can contribute to monitoring

**Challenges:**
- **Class imbalance**: rare species have few training examples
- **Domain shift**: a model trained in one wetland may fail in another
- **Overlapping calls**: multiple species calling simultaneously confuse classifiers
- **Novel species**: models can only identify what they've been trained on`,
      analogy: 'Training an ML model to identify species is like teaching a child to recognize animals by their sounds. You play many examples ("this is a bullfrog... this is a tree frog..."), and eventually the child learns to identify them independently. The ML model does the same thing but needs thousands of examples instead of dozens, and once trained, it never forgets or gets tired.',
      storyConnection: 'Imagine the story\'s wetland monitored by an ML-powered system. Every night, the recorder captures the chorus. Every morning, the ML model generates a species list with call counts. Over months and years, the data reveals trends: which species are thriving, which are declining, when breeding peaks occur, how rainfall affects the chorus. The story\'s single magical night becomes data-driven conservation.',
      checkQuestion: 'A species ID model achieves 95% accuracy on the test set but only 70% accuracy when deployed in a new wetland. Why the drop, and how would you fix it?',
      checkAnswer: 'This is "domain shift" — the new wetland has different background noise, different call variants (regional dialects), and possibly different species composition. To fix it: (1) Include training data from multiple wetlands. (2) Fine-tune the model on a small labeled dataset from the new site. (3) Use data augmentation: add various noise types, pitch shifts, and time stretches to training data. (4) Use domain adaptation techniques that explicitly handle distribution shifts.',
      codeIntro: 'Build a simple species classifier using acoustic features and a decision boundary.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate training data: 4 species, 2 features each
# Feature 1: dominant frequency (Hz)
# Feature 2: call duration (ms)

species = {
    'Bullfrog': {'freq_mean': 350, 'freq_std': 50, 'dur_mean': 500, 'dur_std': 80, 'color': '#22c55e'},
    'Tree frog': {'freq_mean': 2800, 'freq_std': 200, 'dur_mean': 100, 'dur_std': 25, 'color': '#3b82f6'},
    'Peeper': {'freq_mean': 3200, 'freq_std': 180, 'dur_mean': 200, 'dur_std': 40, 'color': '#f59e0b'},
    'Cricket frog': {'freq_mean': 5000, 'freq_std': 350, 'dur_mean': 60, 'dur_std': 15, 'color': '#ef4444'},
}

n_train = 50  # per species
n_test = 20

# Generate training data
X_train = []
y_train = []
for i, (name, params) in enumerate(species.items()):
    freqs = np.random.normal(params['freq_mean'], params['freq_std'], n_train)
    durs = np.random.normal(params['dur_mean'], params['dur_std'], n_train)
    X_train.extend(zip(freqs, durs))
    y_train.extend([i] * n_train)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Generate test data
X_test = []
y_test = []
for i, (name, params) in enumerate(species.items()):
    freqs = np.random.normal(params['freq_mean'], params['freq_std'] * 1.2, n_test)
    durs = np.random.normal(params['dur_mean'], params['dur_std'] * 1.2, n_test)
    X_test.extend(zip(freqs, durs))
    y_test.extend([i] * n_test)

X_test = np.array(X_test)
y_test = np.array(y_test)

# Simple classifier: K-Nearest Neighbors (K=5)
def knn_classify(X_train, y_train, X_test, k=5):
    predictions = []
    for x in X_test:
        # Normalize features
        dists = np.sqrt(((X_train[:, 0] - x[0])/1000)**2 + ((X_train[:, 1] - x[1])/100)**2)
        nearest = np.argsort(dists)[:k]
        votes = y_train[nearest]
        pred = np.bincount(votes).argmax()
        predictions.append(pred)
    return np.array(predictions)

predictions = knn_classify(X_train, y_train, X_test)
accuracy = np.mean(predictions == y_test) * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Decision boundary visualization
ax1.set_facecolor('#111827')

# Create grid for decision boundary
xx, yy = np.meshgrid(np.linspace(0, 6500, 100), np.linspace(0, 700, 100))
grid_points = np.column_stack([xx.ravel(), yy.ravel()])
grid_preds = knn_classify(X_train, y_train, grid_points, k=5)
grid_preds = grid_preds.reshape(xx.shape)

species_names = list(species.keys())
color_list = [species[n]['color'] for n in species_names]
from matplotlib.colors import ListedColormap
cmap = ListedColormap(color_list)
ax1.contourf(xx, yy, grid_preds, alpha=0.15, cmap=cmap, levels=[-0.5, 0.5, 1.5, 2.5, 3.5])

# Plot training data
for i, (name, params) in enumerate(species.items()):
    mask = y_train == i
    ax1.scatter(X_train[mask, 0], X_train[mask, 1], s=30, c=params['color'],
               alpha=0.5, label=f'{name} (train)')

# Plot test data with borders
for i, (name, params) in enumerate(species.items()):
    mask = y_test == i
    correct = predictions[np.where(np.array(y_test) == i)[0]] == i
    ax1.scatter(X_test[mask, 0], X_test[mask, 1], s=60, c=params['color'],
               edgecolors='white', linewidth=1, marker='D', zorder=5)

ax1.set_xlabel('Dominant frequency (Hz)', color='white')
ax1.set_ylabel('Call duration (ms)', color='white')
ax1.set_title(f'KNN Classification (k=5, accuracy={accuracy:.0f}%)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Accuracy vs K
ax2.set_facecolor('#111827')
k_values = range(1, 21)
accuracies = []
for k in k_values:
    preds = knn_classify(X_train, y_train, X_test, k=k)
    acc = np.mean(preds == y_test) * 100
    accuracies.append(acc)

ax2.plot(k_values, accuracies, 'o-', color='#22c55e', linewidth=2, markersize=6)
best_k = k_values[np.argmax(accuracies)]
ax2.axvline(best_k, color='#f59e0b', linestyle='--', linewidth=1)
ax2.text(best_k + 0.5, max(accuracies) - 2, f'Best K={best_k}', color='#f59e0b', fontsize=10)

ax2.set_xlabel('K (number of neighbors)', color='white')
ax2.set_ylabel('Accuracy (%)', color='white')
ax2.set_title('Classifier Accuracy vs K', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"KNN Species Classifier:")
print(f"  Training: {len(y_train)} calls ({n_train} per species)")
print(f"  Testing:  {len(y_test)} calls ({n_test} per species)")
print(f"  Best K: {best_k}, Accuracy: {max(accuracies):.0f}%")
print()
print("Per-species accuracy:")
for i, name in enumerate(species_names):
    mask = np.array(y_test) == i
    sp_acc = np.mean(predictions[mask] == i) * 100
    print(f"  {name:15s}: {sp_acc:.0f}%")`,
      challenge: 'Add a "noise class" (random background sounds that are not frog calls). Generate 50 noise samples with random features. Can the classifier correctly reject these as "not a frog"? This is the open-set recognition problem — and it\'s harder than closed-set classification.',
      successHint: 'Machine learning for species ID is transforming conservation biology. Models that run on phones let anyone contribute to biodiversity monitoring. The key insight: good data is more important than complex algorithms. A simple classifier with excellent training data outperforms a complex one with poor data.',
    },
    {
      title: 'Soundscape ecology — the health of an ecosystem in its sound',
      concept: `**Soundscape ecology** treats the entire acoustic environment as an ecological indicator. Instead of identifying individual species, it analyzes the overall sound pattern to assess ecosystem health.

**Three components of a soundscape:**
1. **Biophony**: sounds produced by living organisms (frogs, birds, insects)
2. **Geophony**: sounds from non-biological natural sources (wind, rain, water flow)
3. **Anthrophony**: sounds from human activity (traffic, machinery, music)

**Acoustic indices** — single numbers that summarize soundscape properties:
- **ACI** (Acoustic Complexity Index): measures the variability of the spectrogram. Biodiverse sites have higher ACI (more complex sound).
- **H** (Acoustic Entropy): Shannon entropy of the spectrogram. Maximum when energy is evenly distributed across frequencies and time = diverse ecosystem.
- **NDSI** (Normalized Difference Soundscape Index): ratio of biophony to anthrophony. NDSI = (bio - anthro) / (bio + anthro). Range: -1 (all human noise) to +1 (all natural sound).
- **ADI** (Acoustic Diversity Index): number of frequency bands with activity above a threshold.

**The soundscape ecology hypothesis:**
A healthy, biodiverse ecosystem has:
- High biophony (many species calling)
- Low anthrophony (minimal human noise)
- Well-partitioned frequency spectrum (acoustic niches filled)
- Consistent patterns across days/seasons

A degraded ecosystem has:
- Low or patchy biophony (fewer species)
- High anthrophony (noise pollution)
- Gaps in the spectrum (missing species = missing frequencies)
- Irregular, unpredictable patterns

**This means you can assess ecosystem health by recording sound** — no species expertise needed, no trapping, no transects. Just press "record" and calculate indices.`,
      analogy: 'Soundscape ecology is like taking the pulse of an ecosystem. Just as a doctor can assess your health from your heartbeat pattern without opening you up, an ecologist can assess ecosystem health from its sound pattern without surveying every species. A strong, regular pulse = healthy. A weak, irregular pulse = trouble.',
      storyConnection: 'The story\'s wetland chorus was the sound of a healthy ecosystem — rich biophony, minimal anthrophony, well-organized frequency partitioning. If a highway were built nearby, the anthrophony would increase, masking the biophony. Species would decline. The soundscape would degrade from a symphony to noise. Soundscape ecology would detect this decline years before traditional surveys.',
      checkQuestion: 'A wetland near a city has the same number of frog species as a remote wetland, but its soundscape indices (ACI, H, ADI) are all lower. How is this possible?',
      checkAnswer: 'Even though both wetlands have the same species, the city wetland\'s frogs may: (1) Call less frequently (noise-induced stress reduces calling). (2) Call at shifted frequencies to avoid traffic noise, compressing into a narrower band. (3) Have lower call amplitude (not worth calling loudly when masked by traffic). (4) Have shorter active periods (only calling during quiet hours). The species are present but acoustically suppressed — the soundscape reveals a functional degradation that species lists miss.',
      codeIntro: 'Calculate acoustic diversity indices from simulated soundscape recordings.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate three soundscapes: healthy, degraded, and urban
sr = 8000
duration = 10
t = np.arange(0, duration, 1/sr)

def generate_soundscape(n_species, noise_level, human_noise):
    """Generate a synthetic soundscape"""
    signal = np.zeros_like(t)

    # Biophony: multiple species at different frequencies
    for i in range(n_species):
        freq = 500 + i * (6000 / max(n_species, 1))
        rate = np.random.uniform(1, 5)
        amplitude = np.random.uniform(0.2, 0.8)
        for start in np.arange(np.random.uniform(0, 0.5), duration - 0.1, 1/rate):
            dur = np.random.uniform(0.05, 0.2)
            idx = (t >= start) & (t < start + dur)
            if np.any(idx):
                env = np.sin(np.pi * (t[idx] - start) / dur)
                signal[idx] += amplitude * env * np.sin(2 * np.pi * freq * t[idx])

    # Geophony (natural background)
    signal += noise_level * np.random.normal(0, 1, len(t))

    # Anthrophony (human noise: low-frequency rumble)
    if human_noise > 0:
        traffic = human_noise * np.sin(2 * np.pi * 100 * t) * (1 + 0.3 * np.sin(2 * np.pi * 0.5 * t))
        signal += traffic

    return signal

# Generate three scenarios
healthy = generate_soundscape(n_species=10, noise_level=0.05, human_noise=0)
degraded = generate_soundscape(n_species=4, noise_level=0.1, human_noise=0.1)
urban = generate_soundscape(n_species=2, noise_level=0.05, human_noise=0.5)

scenarios = [('Healthy wetland', healthy, '#22c55e'),
             ('Degraded wetland', degraded, '#f59e0b'),
             ('Urban wetland', urban, '#ef4444')]

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for idx, (name, signal, color) in enumerate(scenarios):
    # Spectrogram
    ax1 = axes[idx][0]
    ax1.set_facecolor('#111827')
    ax1.specgram(signal, NFFT=512, Fs=sr, noverlap=480, cmap='viridis', vmin=-60, vmax=-10)
    ax1.set_ylim(0, 4000)
    ax1.set_ylabel('Freq (Hz)', color='white', fontsize=8)
    ax1.set_title(name, color=color, fontsize=11)
    ax1.tick_params(colors='gray')

    # Calculate acoustic indices
    # FFT-based analysis
    window_size = 512
    n_windows = len(signal) // window_size
    spectra = []
    for w in range(n_windows):
        chunk = signal[w*window_size:(w+1)*window_size]
        fft_mag = np.abs(np.fft.rfft(chunk))
        spectra.append(fft_mag)
    spectra = np.array(spectra)

    # Acoustic Complexity Index (ACI): sum of absolute differences
    aci = np.sum(np.abs(np.diff(spectra, axis=0))) / np.sum(spectra[:-1])

    # Acoustic Entropy (H)
    spec_flat = spectra.flatten()
    spec_flat = spec_flat[spec_flat > 0]
    probs = spec_flat / spec_flat.sum()
    h_entropy = -np.sum(probs * np.log(probs)) / np.log(len(probs))

    # NDSI: biophony (2-8kHz) vs anthrophony (0-2kHz)
    freqs = np.fft.rfftfreq(window_size, 1/sr)
    bio_mask = (freqs >= 2000) & (freqs <= 4000)
    anthro_mask = (freqs >= 100) & (freqs <= 1000)
    bio_power = np.mean(spectra[:, bio_mask])
    anthro_power = np.mean(spectra[:, anthro_mask])
    ndsi = (bio_power - anthro_power) / (bio_power + anthro_power + 1e-10)

    # Bar chart of indices
    ax2 = axes[idx][1]
    ax2.set_facecolor('#111827')
    indices = ['ACI', 'Entropy (H)', 'NDSI']
    values = [aci, h_entropy, ndsi]
    idx_colors = ['#22c55e' if v > 0.5 else '#f59e0b' if v > 0 else '#ef4444' for v in values]
    bars = ax2.bar(indices, values, color=idx_colors, edgecolor='none')
    ax2.set_ylim(-1, 1.2)
    ax2.set_title('Acoustic Indices', color='white', fontsize=10)
    ax2.tick_params(colors='gray')
    plt.setp(ax2.get_xticklabels(), color='white', fontsize=9)
    for bar, val in zip(bars, values):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.03,
                f'{val:.2f}', ha='center', color='white', fontsize=9)

axes[-1][0].set_xlabel('Time (s)', color='white')
plt.tight_layout()
plt.show()

print("Soundscape ecology assessment:")
print(f"{'Scenario':<25} {'ACI':>6} {'Entropy':>9} {'NDSI':>7}")
print("-" * 50)
for name, signal, _ in scenarios:
    spectra = []
    for w in range(len(signal) // 512):
        chunk = signal[w*512:(w+1)*512]
        spectra.append(np.abs(np.fft.rfft(chunk)))
    spectra = np.array(spectra)
    aci = np.sum(np.abs(np.diff(spectra, axis=0))) / np.sum(spectra[:-1])
    spec_flat = spectra.flatten()
    spec_flat = spec_flat[spec_flat > 0]
    probs = spec_flat / spec_flat.sum()
    h = -np.sum(probs * np.log(probs)) / np.log(len(probs))
    freqs = np.fft.rfftfreq(512, 1/sr)
    bio = np.mean(spectra[:, (freqs >= 2000) & (freqs <= 4000)])
    ant = np.mean(spectra[:, (freqs >= 100) & (freqs <= 1000)])
    ndsi = (bio - ant) / (bio + ant + 1e-10)
    print(f"{name:<25} {aci:>6.3f} {h:>9.3f} {ndsi:>7.3f}")
print()
print("Healthy: high ACI, high entropy, positive NDSI")
print("Degraded: lower on all metrics")
print("Urban: lowest ACI/entropy, negative NDSI (anthrophony dominates)")`,
      challenge: 'Record the same soundscape at dawn, noon, dusk, and midnight. How do the indices change through the day? A 24-hour "acoustic profile" reveals the daily rhythm of the ecosystem. Plot ACI vs. time of day for each scenario.',
      successHint: 'Soundscape ecology turns every recording device into an ecosystem health monitor. From spectrogram analysis to species ID to monitoring networks to signal detection to machine learning to acoustic indices — you now command the full toolkit of bioacoustics. The frogs that sing after rain are not just making music; they are broadcasting the health of their world, and we finally have the tools to listen.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 acoustics and biology foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for bioacoustics and machine learning simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
