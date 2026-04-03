import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FrogSingLevel3() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Bioacoustics — the science of animal sounds',
      concept: `Bioacoustics is the study of sound production, transmission, and reception in animals. Frog calls are among the most studied bioacoustic signals because they are loud, species-specific, and essential for reproduction.

A frog call is a **pressure wave** that can be completely described by its **spectrogram** — a visual representation showing frequency content over time:

- **Frequency (Hz)**: the pitch of the call. Each frog species has a characteristic frequency range, typically 500-5000 Hz.
- **Duration (ms)**: how long each note lasts. Some species produce brief clicks, others sustained trills.
- **Repetition rate**: how many calls per second. Temperature directly affects this — warmer frogs call faster.
- **Modulation**: changes in frequency (FM) or amplitude (AM) within a single call. Some species sweep up in frequency, others pulse in amplitude.

The **Short-Time Fourier Transform (STFT)** is the mathematical tool that converts a time-domain waveform into a spectrogram. It works by sliding a window across the signal, computing the FFT of each window, and stacking the results:

STFT(t, f) = |∫ x(τ) × w(τ - t) × e^(-j2πfτ) dτ|²

where w is the window function. The window size creates a fundamental trade-off: short windows give good time resolution but poor frequency resolution, and vice versa.`,
      analogy: 'A spectrogram is like sheet music for frogs. Just as sheet music shows which notes (frequencies) are played when (time) and how loud (intensity), a spectrogram shows the same information for any sound. A trained bioacoustician can "read" a spectrogram and identify the species, just as a musician can read sheet music and name the composer.',
      storyConnection: 'The story says frogs sing before rain. That "singing" is a chorus of species-specific calls, each with a unique acoustic signature. A spectrogram of the pre-rain chorus would reveal a dozen species calling simultaneously, each occupying its own frequency band — a biological orchestra tuned by millions of years of evolution.',
      checkQuestion: 'Why do smaller frogs generally produce higher-pitched calls than larger frogs?',
      checkAnswer: 'The pitch of a frog call is determined by the size and tension of its vocal cords (and the resonant properties of its vocal sac). Smaller frogs have smaller vocal apparatus, which vibrates at higher frequencies — the same physics that makes a violin string produce higher notes than a cello string. This relationship (body size inversely correlated with call frequency) is so reliable that you can estimate a frog\'s size from its call alone.',
      codeIntro: 'Synthesize realistic frog calls for multiple species and compute their spectrograms using the Short-Time Fourier Transform.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050  # sample rate

def synthesize_frog_call(species_params, duration=2.0):
    """Generate a realistic frog call from species parameters."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    signal = np.zeros_like(t)

    fund_freq = species_params['freq']
    call_rate = species_params['rate']  # calls per second
    call_dur = species_params['call_duration']  # seconds
    fm_depth = species_params.get('fm_depth', 0)
    am_rate = species_params.get('am_rate', 0)

    # Generate repeated calls
    call_period = 1.0 / call_rate
    for start in np.arange(0, duration, call_period):
        end = start + call_dur
        mask = (t >= start) & (t < end)
        if not mask.any():
            continue
        t_local = t[mask] - start

        # Fundamental + harmonics
        freq_mod = fund_freq + fm_depth * np.sin(2 * np.pi * 5 * t_local)
        phase = 2 * np.pi * np.cumsum(freq_mod) / sr
        call = 0.6 * np.sin(phase)
        call += 0.3 * np.sin(2 * phase)  # 2nd harmonic
        call += 0.1 * np.sin(3 * phase)  # 3rd harmonic

        # Amplitude modulation (pulsing)
        if am_rate > 0:
            call *= 0.5 + 0.5 * np.sin(2 * np.pi * am_rate * t_local)

        # Envelope (attack-sustain-release)
        env = np.ones_like(t_local)
        attack = int(0.01 * sr)
        release = int(0.02 * sr)
        if len(env) > attack:
            env[:attack] = np.linspace(0, 1, attack)
        if len(env) > release:
            env[-release:] = np.linspace(1, 0, release)

        signal[mask] = call * env

    # Add background noise
    signal += 0.02 * np.random.randn(len(t))
    return t, signal

# Define 4 frog species with distinct acoustic signatures
species = {
    'Tree frog': {'freq': 2800, 'rate': 4, 'call_duration': 0.08, 'fm_depth': 200, 'am_rate': 0},
    'Bull frog': {'freq': 500, 'rate': 1.5, 'call_duration': 0.4, 'fm_depth': 0, 'am_rate': 15},
    'Cricket frog': {'freq': 3500, 'rate': 8, 'call_duration': 0.03, 'fm_depth': 500, 'am_rate': 0},
    'Chorus frog': {'freq': 1800, 'rate': 3, 'call_duration': 0.15, 'fm_depth': 100, 'am_rate': 30},
}

def compute_spectrogram(signal, sr, window_size=512, hop_size=128):
    """Compute spectrogram using STFT."""
    n_windows = (len(signal) - window_size) // hop_size + 1
    window = np.hanning(window_size)
    spec = np.zeros((window_size // 2 + 1, n_windows))

    for i in range(n_windows):
        start = i * hop_size
        frame = signal[start:start + window_size] * window
        spectrum = np.abs(np.fft.rfft(frame)) ** 2
        spec[:, i] = 10 * np.log10(spectrum + 1e-10)

    freqs = np.fft.rfftfreq(window_size, 1/sr)
    times = np.arange(n_windows) * hop_size / sr
    return times, freqs, spec

fig, axes = plt.subplots(4, 2, figsize=(14, 14))
fig.patch.set_facecolor('#1f2937')

colors_list = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
for i, (name, params) in enumerate(species.items()):
    t, signal = synthesize_frog_call(params)
    times, freqs, spec = compute_spectrogram(signal, sr)

    # Waveform
    ax = axes[i, 0]
    ax.set_facecolor('#111827')
    ax.plot(t[:4000], signal[:4000], color=colors_list[i], linewidth=0.5)
    ax.set_title(f'{name} — waveform', color='white', fontsize=10)
    ax.set_xlabel('Time (s)', color='white')
    ax.tick_params(colors='gray')

    # Spectrogram
    ax = axes[i, 1]
    ax.set_facecolor('#111827')
    ax.pcolormesh(times, freqs, spec, cmap='magma', shading='auto',
                  vmin=spec.max()-60, vmax=spec.max())
    ax.set_ylim(0, 6000)
    ax.set_title(f'{name} — spectrogram ({params["freq"]} Hz)', color='white', fontsize=10)
    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('Frequency (Hz)', color='white')
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bioacoustic signatures:")
for name, params in species.items():
    print(f"  {name}:")
    print(f"    Fundamental: {params['freq']} Hz, Rate: {params['rate']}/s, Duration: {params['call_duration']*1000:.0f} ms")
    bw = 'FM sweep' if params['fm_depth'] > 0 else 'pure tone'
    pulse = f", AM pulse {params['am_rate']} Hz" if params['am_rate'] > 0 else ''
    print(f"    Modulation: {bw}{pulse}")
print()
print("Each species occupies a unique region in time-frequency space.")
print("This is the basis for automated species identification.")`,
      challenge: 'Create a mixed chorus recording by summing all four species (with random timing offsets and amplitude variation). Then compute the spectrogram of the mixture. Can you visually identify each species in the combined spectrogram?',
      successHint: 'The spectrogram is the fundamental representation for all bioacoustic analysis. Every automated species identification system starts here.',
    },
    {
      title: 'Call spectrograms — extracting features from frequency-time images',
      concept: `A spectrogram is a 2D image (time x frequency), and we can extract features from it just like from any image. For frog call classification, the key features are:

**Temporal features:**
- **Call duration**: time between onset and offset of energy
- **Inter-call interval**: time between successive calls
- **Call rate**: calls per second (strongly temperature-dependent)
- **Rise time**: how quickly amplitude reaches peak

**Spectral features:**
- **Dominant frequency**: the frequency with the most energy
- **Bandwidth**: frequency range occupied by the call (max - min freq)
- **Harmonic structure**: presence and spacing of harmonics (integer multiples of fundamental)
- **Spectral entropy**: how spread out the energy is across frequencies (pure tone = low entropy, noise = high entropy)

**Spectrogram features:**
- **Spectral centroid trajectory**: how the center frequency changes over time (FM calls sweep up or down)
- **Temporal envelope**: the amplitude shape over time
- **Mel-frequency cepstral coefficients (MFCCs)**: compact features that capture spectral shape, widely used in speech and bioacoustics

These features form a **feature vector** that uniquely identifies each species — the acoustic fingerprint.`,
      analogy: 'Extracting features from a spectrogram is like describing a painting to someone who cannot see it. You report the dominant colors (dominant frequency), the contrast level (spectral entropy), the composition (harmonic structure), and the brush strokes (modulation). A good description lets the listener identify the painting. A good feature vector lets the algorithm identify the species.',
      storyConnection: 'Each frog species before the rain has its own acoustic fingerprint — the tree frog\'s high-pitched chirp, the bull frog\'s deep croak, the chorus frog\'s pulsing trill. The feature extraction process quantifies exactly what makes each call unique, turning the subjective experience of "hearing different frogs" into a precise numerical description.',
      checkQuestion: 'Two frog species have the same dominant frequency (2000 Hz) but one produces short clicks and the other produces long trills. Which features would distinguish them?',
      checkAnswer: 'Call duration (short vs long), call rate (many clicks vs few trills), temporal envelope shape (sharp attack vs gradual onset), and spectral entropy (clicks have broader bandwidth than sustained tones). Dominant frequency alone is insufficient — you need temporal features to capture the differences in call structure. This is why multi-dimensional feature vectors are essential.',
      codeIntro: 'Extract a comprehensive feature vector from each frog species\' spectrogram and visualize feature space separation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050

# Resynthesize calls
species_params = {
    'Tree frog':    {'freq': 2800, 'rate': 4, 'call_duration': 0.08, 'fm_depth': 200, 'am_rate': 0},
    'Bull frog':    {'freq': 500,  'rate': 1.5, 'call_duration': 0.4, 'fm_depth': 0, 'am_rate': 15},
    'Cricket frog': {'freq': 3500, 'rate': 8, 'call_duration': 0.03, 'fm_depth': 500, 'am_rate': 0},
    'Chorus frog':  {'freq': 1800, 'rate': 3, 'call_duration': 0.15, 'fm_depth': 100, 'am_rate': 30},
}

def synth(params, duration=2.0, temp_offset=0):
    t = np.linspace(0, duration, int(sr*duration), endpoint=False)
    sig = np.zeros_like(t)
    freq = params['freq'] + np.random.normal(0, 30)
    rate = params['rate'] * (1 + 0.05*temp_offset) + np.random.normal(0, 0.2)
    dur = params['call_duration'] * (1 + np.random.normal(0, 0.1))
    period = 1.0/max(rate, 0.5)
    for start in np.arange(np.random.uniform(0, 0.1), duration, period):
        end = start + dur
        m = (t >= start) & (t < end)
        if not m.any(): continue
        tl = t[m] - start
        fm = params.get('fm_depth', 0) * np.sin(2*np.pi*5*tl)
        ph = 2*np.pi*np.cumsum(freq + fm)/sr
        c = 0.6*np.sin(ph) + 0.3*np.sin(2*ph) + 0.1*np.sin(3*ph)
        if params.get('am_rate', 0) > 0:
            c *= 0.5 + 0.5*np.sin(2*np.pi*params['am_rate']*tl)
        env = np.ones_like(tl)
        att = min(int(0.01*sr), len(env)-1)
        rel = min(int(0.02*sr), len(env)-1)
        if att > 0: env[:att] = np.linspace(0, 1, att)
        if rel > 0: env[-rel:] = np.linspace(1, 0, rel)
        sig[m] = c * env
    sig += 0.02*np.random.randn(len(t))
    return t, sig

def extract_features(signal, sr):
    """Extract comprehensive acoustic features from a recording."""
    # Spectral analysis (single frame, center of signal)
    frame_size = 2048
    mid = len(signal)//2
    frame = signal[mid-frame_size//2:mid+frame_size//2] * np.hanning(frame_size)
    spectrum = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(frame_size, 1/sr)

    # Normalize spectrum
    spec_sum = max(spectrum.sum(), 1e-10)
    p = spectrum / spec_sum

    # Dominant frequency
    dom_freq = freqs[np.argmax(spectrum)]

    # Spectral centroid
    centroid = np.sum(freqs * p)

    # Bandwidth (IQR of spectral energy)
    cumsum = np.cumsum(p)
    q25 = freqs[np.searchsorted(cumsum, 0.25)]
    q75 = freqs[np.searchsorted(cumsum, 0.75)]
    bandwidth = q75 - q25

    # Spectral entropy
    p_nonzero = p[p > 0]
    entropy = -np.sum(p_nonzero * np.log2(p_nonzero)) / np.log2(len(p_nonzero))

    # Temporal features
    envelope = np.abs(signal)
    # Smooth envelope
    kernel = np.ones(int(0.01*sr)) / int(0.01*sr)
    env_smooth = np.convolve(envelope, kernel, mode='same')
    threshold = 0.1 * env_smooth.max()

    # Detect call onsets
    above = env_smooth > threshold
    onsets = np.where(np.diff(above.astype(int)) == 1)[0]
    offsets = np.where(np.diff(above.astype(int)) == -1)[0]

    if len(onsets) > 1:
        call_rate = len(onsets) / (len(signal)/sr)
        inter_call = np.mean(np.diff(onsets)) / sr
        # Mean call duration
        if len(offsets) >= len(onsets):
            call_dur = np.mean(offsets[:len(onsets)] - onsets) / sr
        else:
            call_dur = 0.1
    else:
        call_rate = 1.0
        inter_call = 1.0
        call_dur = 0.1

    # Zero crossing rate
    zcr = np.sum(np.abs(np.diff(np.sign(signal)))) / (2*len(signal))

    return {
        'dom_freq': dom_freq,
        'centroid': centroid,
        'bandwidth': bandwidth,
        'entropy': entropy,
        'call_rate': call_rate,
        'call_duration': call_dur * 1000,  # ms
        'inter_call': inter_call * 1000,   # ms
        'zcr': zcr,
    }

# Generate multiple samples per species (with variation)
n_samples = 30
all_features = []
all_labels = []
sp_names = list(species_params.keys())

for sp_idx, (name, params) in enumerate(species_params.items()):
    for _ in range(n_samples):
        _, sig = synth(params, temp_offset=np.random.normal(0, 2))
        feats = extract_features(sig, sr)
        all_features.append(list(feats.values()))
        all_labels.append(sp_idx)

X = np.array(all_features)
y = np.array(all_labels)
feat_names = list(extract_features(np.zeros(sr), sr).keys())

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

# Feature space: dominant freq vs call rate
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, name in enumerate(sp_names):
    mask = y == i
    ax.scatter(X[mask, 0], X[mask, 4], s=40, color=colors[i], alpha=0.7, label=name)
ax.set_xlabel('Dominant frequency (Hz)', color='white')
ax.set_ylabel('Call rate (calls/s)', color='white')
ax.set_title('Feature space: frequency vs call rate', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Bandwidth vs entropy
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, name in enumerate(sp_names):
    mask = y == i
    ax.scatter(X[mask, 2], X[mask, 3], s=40, color=colors[i], alpha=0.7, label=name)
ax.set_xlabel('Bandwidth (Hz)', color='white')
ax.set_ylabel('Spectral entropy', color='white')
ax.set_title('Feature space: bandwidth vs entropy', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Feature distributions
ax = axes[1, 0]
ax.set_facecolor('#111827')
feature_idx = 0  # dominant frequency
for i, name in enumerate(sp_names):
    mask = y == i
    ax.hist(X[mask, feature_idx], bins=15, alpha=0.5, color=colors[i], label=name, density=True)
ax.set_xlabel('Dominant frequency (Hz)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Dominant frequency distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Feature importance (correlation with species label)
ax = axes[1, 1]
ax.set_facecolor('#111827')
corrs = np.abs([np.corrcoef(X[:, i], y)[0, 1] for i in range(X.shape[1])])
sort_idx = np.argsort(corrs)
ax.barh(range(len(feat_names)), corrs[sort_idx], color='#a855f7', edgecolor='none', height=0.6)
ax.set_yticks(range(len(feat_names)))
ax.set_yticklabels([feat_names[i] for i in sort_idx], color='white', fontsize=9)
ax.set_xlabel('|Correlation| with species', color='white')
ax.set_title('Feature discriminative power', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Feature extraction results (mean per species):")
print(f"{'Feature':<18} " + " ".join(f'{n:>12}' for n in sp_names))
print("-" * 70)
for fi, fn in enumerate(feat_names):
    vals = [f'{X[y==si, fi].mean():>12.1f}' for si in range(4)]
    print(f"{fn:<18} " + " ".join(vals))`,
      challenge: 'Add a 5th species that overlaps in frequency with the Tree frog but has a very different temporal pattern (slower rate, longer calls). Can the feature set still separate them? If not, which additional feature would help?',
      successHint: 'Feature extraction is the bridge between raw audio and machine learning. The features you design determine the ceiling of classifier performance — no algorithm can overcome bad features.',
    },
    {
      title: 'Barometric pressure sensing — how frogs predict rain',
      concept: `Frogs genuinely do call more before rain, and the mechanism involves **barometric pressure sensing**. As a storm approaches, atmospheric pressure drops. Frogs can detect this pressure change and increase their calling activity.

The physics of barometric pressure:
- **Standard atmospheric pressure**: 1013.25 hPa (hectopascals) at sea level
- **Storm approach**: pressure typically drops 5-20 hPa over 12-24 hours
- **Rate of change**: more important than absolute value. A drop of >3 hPa/hour usually indicates an approaching storm.

How frogs sense pressure changes:
- **Tympanic membrane**: the eardrum is a thin membrane separating the middle ear (connected to the mouth via the Eustachian tube, hence at atmospheric pressure) from the air outside. Pressure changes cause tiny deflections detected by mechanoreceptors.
- **Swim bladder analog**: some evidence suggests that frogs\' lungs may act as pressure-sensitive organs, similar to fish swim bladders.
- **Behavioral response**: dropping pressure → increased calling activity, especially in species that breed in temporary rain pools (calling before rain ensures mates arrive when pools form).

This is a **biological barometer** — the frog converts a physical stimulus (pressure change) into a behavioral response (increased calling) that observers interpret as "predicting rain."`,
      analogy: 'Your body is a crude barometer too. Some people feel joint pain or headaches when a storm approaches — pressure changes affect fluid dynamics in joints and sinuses. Frogs are far more sensitive: their entire lifestyle depends on water availability, so evolution has tuned them to detect even small pressure drops. They are living weather stations.',
      storyConnection: 'The story asks why frogs sing before rain. The answer is barometric pressure. When atmospheric pressure drops as a storm approaches, frogs detect the change through their tympanic membranes and increase calling to attract mates. The rain that follows fills the pools where they will breed. The singing is not prediction — it is preparation.',
      checkQuestion: 'If you brought frogs into a sealed laboratory and artificially decreased the air pressure, would they start calling? What would this prove?',
      checkAnswer: 'Yes, they should increase calling if pressure sensing is the mechanism — and experiments have confirmed this. It proves that the response is directly triggered by pressure change, not by other pre-rain cues (humidity, temperature, light changes, wind). However, in nature, all these cues likely work together. The laboratory experiment isolates one variable to establish causation.',
      codeIntro: 'Simulate barometric pressure changes and model frog calling response as a function of pressure drop rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 72 hours of barometric pressure data
hours = 72
dt = 0.1  # 6-minute intervals
t = np.arange(0, hours, dt)
n_points = len(t)

# Base pressure with diurnal variation
pressure = 1013.25 + 2 * np.sin(2 * np.pi * t / 24)

# Add storm event (pressure drop at ~hour 36)
storm_center = 40
storm_width = 8
storm_drop = -15  # hPa
pressure += storm_drop * np.exp(-((t - storm_center)**2) / (2 * storm_width**2))

# Add realistic noise
pressure += np.cumsum(np.random.normal(0, 0.05, n_points))

# Compute pressure change rate (hPa per hour)
dp_dt = np.gradient(pressure, dt)

# Frog calling model
def frog_calling_response(dp_dt, baseline_rate=2.0, sensitivity=1.5, threshold=-0.5):
    """
    Model frog calling rate as a function of pressure change rate.

    Negative dp/dt (falling pressure) increases calling.
    sensitivity: how strongly frogs respond to pressure drops
    threshold: pressure change rate below which calling increases
    """
    response = np.full_like(dp_dt, baseline_rate)
    dropping = dp_dt < threshold
    response[dropping] = baseline_rate + sensitivity * np.abs(dp_dt[dropping] - threshold)

    # Add circadian rhythm (frogs call more at dusk/night)
    hour_of_day = t % 24
    circadian = 0.5 + 0.5 * np.maximum(0, np.sin(np.pi * (hour_of_day - 18) / 12))
    response *= circadian

    # Add stochastic variation
    response += np.random.exponential(0.3, len(response))
    return np.clip(response, 0, None)

call_rate = frog_calling_response(dp_dt)

# Simulate actual call events (Poisson process)
calls_per_interval = np.random.poisson(call_rate * dt)

# Also model humidity response
humidity = 60 + 20 * np.exp(-((t - storm_center + 3)**2) / (2 * 6**2))
humidity += np.random.normal(0, 3, n_points)
humidity = np.clip(humidity, 30, 100)

fig, axes = plt.subplots(4, 1, figsize=(14, 14), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Barometric pressure
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(t, pressure, color='#3b82f6', linewidth=1.5)
ax.axvline(storm_center, color='#ef4444', linestyle='--', alpha=0.5, label='Storm center')
ax.set_ylabel('Pressure (hPa)', color='white')
ax.set_title('Barometric pressure over 72 hours', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Pressure change rate
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(t, dp_dt, color='#f59e0b', linewidth=1)
ax.axhline(0, color='gray', linestyle='-', linewidth=0.5)
ax.axhline(-0.5, color='#ef4444', linestyle='--', alpha=0.5, label='Calling threshold')
ax.fill_between(t, dp_dt, -0.5, where=dp_dt < -0.5, alpha=0.2, color='#ef4444')
ax.set_ylabel('dP/dt (hPa/hr)', color='white')
ax.set_title('Pressure change rate (negative = falling)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Frog calling rate
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(t, call_rate, color='#22c55e', linewidth=1.5, label='Calling rate model')
ax.fill_between(t, 0, call_rate, alpha=0.2, color='#22c55e')
ax.set_ylabel('Calls per minute', color='white')
ax.set_title('Frog calling activity (pressure + circadian)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Cross-correlation
ax = axes[3]
ax.set_facecolor('#111827')
# Compute cross-correlation between -dp/dt and calling rate
max_lag_hours = 12
max_lag = int(max_lag_hours / dt)
lags = np.arange(-max_lag, max_lag + 1) * dt
xcorr = np.correlate(call_rate - call_rate.mean(),
                     -dp_dt - (-dp_dt).mean(), mode='full')
xcorr = xcorr / (len(call_rate) * call_rate.std() * dp_dt.std())
center = len(xcorr) // 2
xcorr_segment = xcorr[center - max_lag:center + max_lag + 1]
ax.plot(lags, xcorr_segment, color='#a855f7', linewidth=2)
peak_lag = lags[np.argmax(xcorr_segment)]
ax.axvline(peak_lag, color='#ef4444', linestyle='--',
           label=f'Peak lag: {peak_lag:.1f} hours')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Cross-correlation', color='white')
ax.set_title('Calling rate vs pressure drop (cross-correlation)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Statistics
storm_period = (t > storm_center - 10) & (t < storm_center + 5)
normal_period = (t < storm_center - 15)
print("Barometric pressure response analysis:")
print(f"  Normal calling rate: {call_rate[normal_period].mean():.1f} calls/min")
print(f"  Pre-storm calling rate: {call_rate[storm_period].mean():.1f} calls/min")
print(f"  Increase factor: {call_rate[storm_period].mean()/max(call_rate[normal_period].mean(), 0.01):.1f}x")
print(f"  Peak pressure drop: {dp_dt.min():.2f} hPa/hour")
print(f"  Peak-lag: calling peaks {abs(peak_lag):.1f} hours {'before' if peak_lag < 0 else 'after'} max pressure drop")
print()
print("Frogs begin calling BEFORE the storm arrives,")
print("responding to the pressure gradient, not the rain itself.")`,
      challenge: 'Model two species with different pressure sensitivities: a rain-pool breeder (very sensitive, threshold=-0.3) and a stream breeder (less sensitive, threshold=-1.5). Plot both species\' calling patterns. Which species is a better "rain predictor" and why?',
      successHint: 'You have modeled the mechanism behind one of nature\'s most famous weather predictions. The frog is not mystical — it is a biological barometer tuned by evolution to detect pressure changes that signal incoming rain and breeding opportunities.',
    },
    {
      title: 'Circadian and seasonal rhythms — biological clocks in amphibians',
      concept: `Frog calling is not random — it follows **circadian rhythms** (daily cycles) and **seasonal rhythms** (annual cycles), both driven by internal biological clocks:

**Circadian rhythm (daily):**
- Most frogs call primarily at dusk and through the night (nocturnal chorus)
- The internal clock is set by the **suprachiasmatic nucleus** (SCN), which receives light input from the retina
- The SCN drives rhythmic release of melatonin (high at night → calling behavior)
- Period is approximately 24 hours but requires daily light cues (**zeitgebers**) to stay synchronized

**Seasonal rhythm (annual):**
- Calling peaks during breeding season, which is triggered by photoperiod (day length) and temperature
- In tropical regions: tied to monsoon onset (pressure + humidity cues)
- In temperate regions: tied to spring warming (temperature + day length)

The mathematical model is a **coupled oscillator**:
- The SCN acts as the master oscillator
- Hormonal cycles (testosterone, corticosterone) act as slave oscillators
- Environmental cues (light, temperature, rain) act as forcing functions

Phase relationships matter: frogs that call at different times avoid acoustic interference, which leads to temporal niche partitioning — different species dominate the chorus at different hours.`,
      analogy: 'Your sleep-wake cycle is a circadian rhythm. You get sleepy at night and alert in the morning even without an alarm clock — your SCN drives the cycle. Jet lag happens when the external light cycle (zeitgeber) shifts but your internal clock takes days to adjust. Frogs have the same system, but instead of sleep, their output is calling behavior.',
      storyConnection: 'The story says frogs sing "before rain," but they also sing at specific times of day and year. The pre-rain chorus happens at dusk during the monsoon season — a convergence of circadian timing (dusk), seasonal timing (monsoon), and pressure sensing (storm approach). All three clocks must align for the full chorus.',
      checkQuestion: 'If you kept frogs in constant darkness and constant temperature, would they still show a daily calling pattern?',
      checkAnswer: 'Yes, for several days — this is the definition of an endogenous circadian rhythm. The internal clock free-runs with a period close to but not exactly 24 hours. Without light cues (zeitgebers), the rhythm gradually drifts out of sync with the real day-night cycle. This experiment was how circadian rhythms were first proven to be internal, not just responses to external light.',
      codeIntro: 'Model circadian and seasonal rhythms in frog calling, including phase relationships between species and the effect of environmental zeitgebers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model parameters
days = 14  # simulate 2 weeks
hours_per_day = 24
dt = 0.1  # hours
t = np.arange(0, days * hours_per_day, dt)
n = len(t)

# ---- Circadian oscillator (Goodwin model simplified) ----
def circadian_oscillator(t, period=24.0, amplitude=1.0, phase=0):
    """Simple sinusoidal circadian oscillator."""
    return amplitude * (0.5 + 0.5 * np.sin(2 * np.pi * (t - phase) / period))

# ---- Seasonal modulation ----
def seasonal_modulation(day_of_year, peak_day=180, width=60):
    """Gaussian-shaped breeding season centered on peak_day."""
    return np.exp(-((day_of_year - peak_day)**2) / (2 * width**2))

# ---- Multi-species temporal partitioning ----
species_timing = {
    'Early dusk frog': {'phase': 18, 'peak_hour': 19, 'width': 1.5},
    'Midnight frog':   {'phase': 22, 'peak_hour': 0,  'width': 2.0},
    'Pre-dawn frog':   {'phase': 2,  'peak_hour': 4,  'width': 1.5},
    'Twilight frog':   {'phase': 6,  'peak_hour': 5.5,'width': 1.0},
}

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

# Light-dark cycle (zeitgeber)
sunrise = 6.0
sunset = 18.5
hour_of_day = t % 24
light = ((hour_of_day >= sunrise) & (hour_of_day <= sunset)).astype(float)

# Temperature cycle
temp = 22 + 5 * np.sin(2 * np.pi * (hour_of_day - 14) / 24)  # peak at 2pm
temp += np.random.normal(0, 0.5, n)

# Compute calling patterns
calling_patterns = {}
for name, params in species_timing.items():
    # Circadian component
    circadian = np.exp(-((hour_of_day - params['peak_hour']) % 24)**2 / (2*params['width']**2))
    # Also check wrapped version (for species calling near midnight)
    circadian2 = np.exp(-(24 - (hour_of_day - params['peak_hour']) % 24)**2 / (2*params['width']**2))
    circadian = np.maximum(circadian, circadian2)

    # Temperature modulation (warmer = more calling)
    temp_mod = np.clip((temp - 15) / 10, 0, 1)

    # Combined
    rate = circadian * temp_mod * 10  # max 10 calls/min
    rate += np.random.exponential(0.2, n)
    calling_patterns[name] = np.clip(rate, 0, None)

# Free-running experiment (constant darkness from day 7)
darkness_start = 7 * 24  # hour 168
free_run_patterns = {}
for name, params in species_timing.items():
    rate = calling_patterns[name].copy()
    # After darkness onset, rhythm drifts
    drift_rate = 0.3  # hours per day of drift
    for i, ti in enumerate(t):
        if ti >= darkness_start:
            days_in_dark = (ti - darkness_start) / 24
            drifted_phase = params['peak_hour'] + drift_rate * days_in_dark
            h = ti % 24
            circadian = np.exp(-((h - drifted_phase) % 24)**2 / (2*params['width']**2))
            circadian2 = np.exp(-(24 - (h - drifted_phase) % 24)**2 / (2*params['width']**2))
            rate[i] = max(circadian, circadian2) * 8 + np.random.exponential(0.2)
    free_run_patterns[name] = rate

fig, axes = plt.subplots(3, 2, figsize=(16, 14))
fig.patch.set_facecolor('#1f2937')

# Light-dark and temperature
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax2 = ax.twinx()
# Show only 48 hours
mask48 = t < 48
ax.fill_between(t[mask48], 0, light[mask48], alpha=0.15, color='#f59e0b', label='Daylight')
ax2.plot(t[mask48], temp[mask48], color='#ef4444', linewidth=1.5, label='Temperature')
ax.set_ylabel('Light (0=dark, 1=light)', color='#f59e0b')
ax2.set_ylabel('Temperature (°C)', color='#ef4444')
ax.set_title('Environmental zeitgebers (48 hours)', color='white', fontsize=11)
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')
ax.set_xlabel('Hours', color='white')

# Temporal partitioning (48 hours)
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, (name, rate) in enumerate(calling_patterns.items()):
    ax.plot(t[mask48], rate[mask48], color=colors[i], linewidth=1.5, alpha=0.8, label=name)
ax.fill_between(t[mask48], 0, 0, where=~light[mask48].astype(bool),
                alpha=0.1, color='gray', label='Night')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Calling rate', color='white')
ax.set_title('Temporal niche partitioning (48 hours)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Average diel pattern
ax = axes[1, 0]
ax.set_facecolor('#111827')
hour_bins = np.arange(0, 24, 0.5)
for i, (name, rate) in enumerate(calling_patterns.items()):
    hourly = [rate[(hour_of_day >= h) & (hour_of_day < h+0.5)].mean() for h in hour_bins]
    ax.plot(hour_bins, hourly, color=colors[i], linewidth=2, label=name)
ax.axvspan(sunset, 24, alpha=0.1, color='gray')
ax.axvspan(0, sunrise, alpha=0.1, color='gray')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Mean calling rate', color='white')
ax.set_title('Average diel calling pattern', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Free-running experiment
ax = axes[1, 1]
ax.set_facecolor('#111827')
mask_late = t > 120  # show last 5 days
for i, (name, rate) in enumerate(free_run_patterns.items()):
    ax.plot(t[mask_late], rate[mask_late], color=colors[i], linewidth=1, alpha=0.8, label=name)
ax.axvline(darkness_start, color='#ef4444', linestyle='--', linewidth=2, label='Constant darkness starts')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Calling rate', color='white')
ax.set_title('Free-running rhythm in constant darkness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Seasonal pattern
ax = axes[2, 0]
ax.set_facecolor('#111827')
doy = np.arange(1, 366)
months = ['J','F','M','A','M','J','J','A','S','O','N','D']
for peak, label, color in [(90, 'Spring breeder', '#22c55e'),
                             (180, 'Summer breeder', '#f59e0b'),
                             (210, 'Monsoon breeder', '#3b82f6')]:
    season = seasonal_modulation(doy, peak_day=peak)
    ax.plot(doy, season, color=color, linewidth=2, label=label)
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Breeding intensity', color='white')
ax.set_title('Seasonal breeding patterns', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xticks(np.linspace(15, 350, 12))
ax.set_xticklabels(months, color='white')

# Actogram (raster plot)
ax = axes[2, 1]
ax.set_facecolor('#111827')
name0 = list(calling_patterns.keys())[0]
rate0 = calling_patterns[name0]
for day in range(min(14, days)):
    day_mask = (t >= day*24) & (t < (day+1)*24)
    hours = t[day_mask] % 24
    rates = rate0[day_mask]
    ax.scatter(hours, np.full_like(hours, day), c=rates, cmap='Greens',
               s=2, vmin=0, vmax=rate0.max())
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Day', color='white')
ax.set_title(f'Actogram: {name0}', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("Circadian rhythm analysis:")
for name, params in species_timing.items():
    print(f"  {name}: peak calling at {params['peak_hour']:02.0f}:00, width ±{params['width']:.1f} hr")
print()
print("Temporal niche partitioning minimizes acoustic interference.")
print("Each species has evolved to call when competitors are quiet.")`,
      challenge: 'Model the effect of light pollution: in areas near a city, the light cycle is disrupted (never truly dark). Reduce the calling amplitude during "light-polluted nights" by 60%. How does this affect each species? Which species is most vulnerable to light pollution?',
      successHint: 'Biological rhythms govern nearly all animal behavior. Understanding them explains not just when frogs call, but how human activities (artificial light, noise, climate shift) disrupt natural cycles.',
    },
    {
      title: 'Acoustic niche partitioning — how species share the soundscape',
      concept: `In a frog chorus, multiple species call simultaneously. How do they avoid interfering with each other? Through **acoustic niche partitioning** — dividing the acoustic space along multiple dimensions:

1. **Frequency partitioning**: species call at different frequencies (e.g., Species A at 1000 Hz, Species B at 3000 Hz)
2. **Temporal partitioning**: species call at different times of day or in alternating patterns
3. **Spatial partitioning**: species call from different locations (pond edge vs. canopy vs. underwater)
4. **Call structure**: species use different modulation patterns even at similar frequencies

This is an extension of the **competitive exclusion principle** into acoustic space. If two species have identical calls, one will outcompete the other for mates (females cannot distinguish them). Natural selection pushes species to diverge acoustically — **character displacement** in the acoustic domain.

The **acoustic niche hypothesis** (Krause, 1993) states that in undisturbed habitats, each species occupies a unique spectro-temporal niche, and the combined soundscape fills the available acoustic space like a jigsaw puzzle. Noise pollution (roads, machines, cities) disrupts this by masking niches, effectively "occupying" acoustic space without producing useful signals.`,
      analogy: 'Radio stations use frequency partitioning: each station broadcasts on a unique frequency so they do not interfere. AM, FM, and satellite radio use different "modulation schemes" (like call structure differences). If two stations broadcast on the same frequency, you hear static. Frogs face the same problem and solve it the same way — spectral and temporal separation.',
      storyConnection: 'The story\'s pre-rain chorus is not chaos — it is a precisely organized acoustic ecosystem. Each frog species calls at its own frequency and time, like instruments in an orchestra. The chorus sounds rich and layered because every species fills its own acoustic niche without masking others. Human noise pollution is like a rude audience member shouting over the performance.',
      checkQuestion: 'A new frog species colonizes a pond where another species already calls at 2000 Hz. What will happen over evolutionary time?',
      checkAnswer: 'Character displacement. If both call at 2000 Hz, females of both species make mistakes (mating with the wrong species = wasted reproductive effort). Natural selection favors individuals of the new species that call at slightly different frequencies. Over generations, the new species\' call shifts away from 2000 Hz. Where the species co-occur, their calls are more different than where each lives alone — this pattern is the signature of character displacement.',
      codeIntro: 'Simulate an acoustic niche model: generate a multi-species soundscape, quantify niche overlap, and demonstrate the effect of noise pollution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Define acoustic niches for 8 frog species
species_niches = [
    {'name': 'Pond treefrog',     'freq': 2800, 'bw': 400, 'time': 19.0, 'tw': 1.5},
    {'name': 'Bullfrog',          'freq': 500,  'bw': 200, 'time': 21.0, 'tw': 3.0},
    {'name': 'Cricket frog',      'freq': 3500, 'bw': 300, 'time': 20.0, 'tw': 2.0},
    {'name': 'Chorus frog',       'freq': 1800, 'bw': 350, 'time': 19.5, 'tw': 1.0},
    {'name': 'Spring peeper',     'freq': 3000, 'bw': 250, 'time': 18.5, 'tw': 1.5},
    {'name': 'Green frog',        'freq': 1200, 'bw': 400, 'time': 22.0, 'tw': 2.5},
    {'name': 'Narrow-mouth toad', 'freq': 4200, 'bw': 200, 'time': 20.5, 'tw': 1.0},
    {'name': 'Barking treefrog',  'freq': 700,  'bw': 300, 'time': 23.0, 'tw': 2.0},
]

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

# Compute niche overlap between species pairs
def niche_overlap(sp1, sp2):
    """Compute spectro-temporal overlap using Gaussian kernels."""
    # Frequency overlap
    freq_overlap = np.exp(-(sp1['freq']-sp2['freq'])**2 / (2*(sp1['bw']**2 + sp2['bw']**2)))
    # Temporal overlap
    time_diff = min(abs(sp1['time']-sp2['time']), 24-abs(sp1['time']-sp2['time']))
    time_overlap = np.exp(-time_diff**2 / (2*(sp1['tw']**2 + sp2['tw']**2)))
    return freq_overlap * time_overlap

n_sp = len(species_niches)
overlap_matrix = np.zeros((n_sp, n_sp))
for i in range(n_sp):
    for j in range(n_sp):
        overlap_matrix[i, j] = niche_overlap(species_niches[i], species_niches[j])

# Noise pollution scenarios
def noise_mask(freq, noise_freq=1000, noise_bw=500, noise_level=0.8):
    """Compute how much noise masks a species' signal."""
    return noise_level * np.exp(-(freq - noise_freq)**2 / (2 * noise_bw**2))

# Traffic noise (low frequency, broadband)
traffic_mask = np.array([noise_mask(sp['freq'], 800, 600, 0.7) for sp in species_niches])

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Spectro-temporal niche map
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, sp in enumerate(species_niches):
    from matplotlib.patches import Ellipse
    ellipse = Ellipse((sp['time'], sp['freq']), sp['tw']*2, sp['bw']*2,
                       color=colors[i], alpha=0.4)
    ax.add_patch(ellipse)
    ax.plot(sp['time'], sp['freq'], 'o', color=colors[i], markersize=8)
    ax.annotate(sp['name'], (sp['time'], sp['freq']),
                textcoords="offset points", xytext=(10, 5),
                fontsize=7, color='white')
ax.set_xlim(17, 25)
ax.set_ylim(0, 5000)
ax.set_xlabel('Time of day (hours)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Acoustic niche map (spectro-temporal)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Overlap matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(overlap_matrix, cmap='YlOrRd', vmin=0, vmax=1, aspect='auto')
names_short = [sp['name'][:8] for sp in species_niches]
ax.set_xticks(range(n_sp)); ax.set_yticks(range(n_sp))
ax.set_xticklabels(names_short, rotation=45, ha='right', color='white', fontsize=7)
ax.set_yticklabels(names_short, color='white', fontsize=7)
for i in range(n_sp):
    for j in range(n_sp):
        ax.text(j, i, f'{overlap_matrix[i,j]:.2f}', ha='center', va='center',
                fontsize=6, color='white' if overlap_matrix[i,j] > 0.5 else 'black')
ax.set_title('Pairwise niche overlap', color='white', fontsize=11)
plt.colorbar(im, ax=ax)

# Soundscape spectrum (simulated)
ax = axes[1, 0]
ax.set_facecolor('#111827')
freqs = np.linspace(0, 5000, 1000)
total_energy = np.zeros_like(freqs)
for i, sp in enumerate(species_niches):
    energy = np.exp(-(freqs - sp['freq'])**2 / (2 * sp['bw']**2))
    ax.fill_between(freqs, 0, energy, alpha=0.3, color=colors[i], label=sp['name'][:10])
    total_energy += energy

# Add traffic noise
traffic_energy = 0.7 * np.exp(-(freqs - 800)**2 / (2 * 600**2))
ax.fill_between(freqs, 0, traffic_energy, alpha=0.3, color='gray', label='Traffic noise')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Energy', color='white')
ax.set_title('Soundscape spectrum (natural + noise)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6,
          ncol=3, loc='upper right')
ax.tick_params(colors='gray')

# Noise impact
ax = axes[1, 1]
ax.set_facecolor('#111827')
sp_names = [sp['name'][:12] for sp in species_niches]
ax.barh(range(n_sp), traffic_mask * 100, color=colors, edgecolor='none', height=0.6)
ax.set_yticks(range(n_sp))
ax.set_yticklabels(sp_names, color='white', fontsize=8)
ax.set_xlabel('Signal masking by traffic noise (%)', color='white')
ax.set_title('Species vulnerability to noise pollution', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, mask in enumerate(traffic_mask):
    ax.text(mask*100 + 1, i, f'{mask*100:.0f}%', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Acoustic niche analysis:")
mean_overlap = (overlap_matrix.sum() - n_sp) / (n_sp * (n_sp - 1))
print(f"  Mean pairwise overlap: {mean_overlap:.3f} (lower = better partitioning)")
print(f"  Most overlapping pair: ", end='')
np.fill_diagonal(overlap_matrix, 0)
i, j = np.unravel_index(overlap_matrix.argmax(), overlap_matrix.shape)
print(f"{species_niches[i]['name']} & {species_niches[j]['name']} ({overlap_matrix[i,j]:.3f})")
print()
print("Noise pollution impact:")
most_affected = np.argmax(traffic_mask)
least_affected = np.argmin(traffic_mask)
print(f"  Most affected: {species_niches[most_affected]['name']} ({traffic_mask[most_affected]*100:.0f}% masked)")
print(f"  Least affected: {species_niches[least_affected]['name']} ({traffic_mask[least_affected]*100:.0f}% masked)")
print(f"  Low-frequency species are most vulnerable to traffic noise.")`,
      challenge: 'Add construction noise (centered at 2000 Hz, bandwidth 1000 Hz). Now mid-frequency species are also affected. Compute the total "acoustic habitat loss" (fraction of species with >30% masking) for traffic noise alone vs traffic + construction.',
      successHint: 'Acoustic niche partitioning is a beautiful example of how evolution structures communities. Noise pollution disrupts these ancient arrangements, silencing species that cannot shift their calls. Bioacoustic monitoring can detect this before species disappear.',
    },
    {
      title: 'Citizen science bioacoustic monitoring — scaling up with technology',
      concept: `Individual researchers cannot monitor every wetland. **Citizen science** combined with **automated recording units (ARUs)** scales bioacoustic monitoring to continental levels.

The monitoring pipeline:

1. **ARU deployment**: waterproof recorders (AudioMoth, ~$50) placed at sites across a landscape. Each records hours of audio nightly.
2. **Data upload**: citizens collect SD cards or units transmit data wirelessly.
3. **Automated species detection**: ML algorithms scan recordings for species-specific calls.
4. **Occupancy modeling**: statistical models estimate which species are present at each site, accounting for imperfect detection (a species may be present but not calling, or calling but not detected).

**Occupancy models** separate two probabilities:
- **ψ (psi)**: probability a species is present at a site
- **p**: probability of detecting the species given it is present

From repeated surveys (multiple nights of recording), you can estimate both:
- If detected at least once → definitely present (ψ=1 for that site)
- If never detected → either absent OR present but undetected
- Multiple non-detections make absence more likely: P(absent | never detected in K surveys) = (1-ψ) / [(1-ψ) + ψ(1-p)^K]

This framework is identical in structure to the camera trap SECR used for the clouded leopard — imperfect detection is a universal challenge in ecology.`,
      analogy: 'Citizen science bioacoustic monitoring is like a network of security cameras for biodiversity. Each camera (ARU) watches one location continuously. The footage is analyzed by AI (species detection algorithms). A central database tracks who is where and when. Just as a security system does not need a human watching every camera in real time, bioacoustic monitoring scales to thousands of sites through automation.',
      storyConnection: 'The frogs that sing before rain could be monitored across entire river basins using ARU networks. If the chorus diminishes year over year, it signals environmental degradation. The story\'s single observation of frogs singing becomes, through technology, a continental-scale early warning system for amphibian decline — the most threatened vertebrate class on Earth.',
      checkQuestion: 'An ARU at a wetland records for 5 nights but never detects a species known to be in the region. Does this mean the species is absent?',
      checkAnswer: 'Not necessarily. If per-night detection probability p = 0.3, the probability of missing a present species in 5 nights is (1-0.3)^5 = 0.168, or about 17%. You need more nights to be confident of absence. The formula: to achieve 95% confidence of absence, you need K ≥ log(0.05) / log(1-p) nights. With p=0.3, that is K ≥ 9 nights. Occupancy models formalize this reasoning.',
      codeIntro: 'Simulate a citizen science monitoring network: deploy ARUs, detect species, and estimate occupancy using the multi-site occupancy model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ---- Landscape simulation ----
n_sites = 40
n_surveys = 8  # nights per site
n_species = 6

species_names = ['Tree frog', 'Bull frog', 'Cricket frog',
                 'Chorus frog', 'Spring peeper', 'Green frog']

# Site environmental covariates
np.random.seed(42)
site_x = np.random.uniform(0, 10, n_sites)
site_y = np.random.uniform(0, 10, n_sites)
site_wetland_area = np.random.exponential(2, n_sites)  # ha
site_forest_cover = np.random.beta(3, 2, n_sites) * 100  # %
site_noise_level = np.random.exponential(1, n_sites)  # relative

# True occupancy probabilities (depend on habitat)
true_psi = np.zeros((n_sites, n_species))
for sp in range(n_species):
    # Each species has different habitat preferences
    psi_base = [0.8, 0.6, 0.5, 0.7, 0.4, 0.6][sp]
    wetland_effect = [0.1, 0.2, 0.05, 0.1, 0.05, 0.15][sp]
    noise_effect = [-0.1, -0.05, -0.15, -0.1, -0.2, -0.08][sp]

    logit_psi = (np.log(psi_base/(1-psi_base)) +
                 wetland_effect * (site_wetland_area - 2) +
                 noise_effect * site_noise_level)
    true_psi[:, sp] = 1 / (1 + np.exp(-logit_psi))

# True detection probabilities
true_p = np.array([0.4, 0.6, 0.3, 0.45, 0.25, 0.5])

# Generate true presence/absence
true_Z = np.zeros((n_sites, n_species), dtype=int)
for i in range(n_sites):
    for sp in range(n_species):
        true_Z[i, sp] = np.random.binomial(1, true_psi[i, sp])

# Generate detection histories
detection = np.zeros((n_sites, n_species, n_surveys), dtype=int)
for i in range(n_sites):
    for sp in range(n_species):
        if true_Z[i, sp] == 1:
            detection[i, sp, :] = np.random.binomial(1, true_p[sp], n_surveys)

# ---- Occupancy model estimation ----
def estimate_occupancy(detections, n_surveys):
    """
    Simple single-season occupancy model estimation.
    detections: n_sites x n_surveys binary matrix for one species
    """
    n_sites = detections.shape[0]

    # Sites where species was detected at least once
    detected = detections.sum(axis=1) > 0
    n_detected = detected.sum()
    n_not_detected = n_sites - n_detected

    # MLE for p: among detected sites, fraction of surveys with detection
    if n_detected > 0:
        p_hat = detections[detected].sum() / (n_detected * n_surveys)
    else:
        p_hat = 0.01

    # MLE for psi using the likelihood
    # For detected sites: contribute psi * (1-(1-p)^K) to likelihood
    # For non-detected: contribute (1-psi) + psi*(1-p)^K
    best_psi = 0
    best_ll = -np.inf

    for psi_try in np.linspace(0.01, 0.99, 200):
        ll = 0
        p_at_least_one = 1 - (1 - p_hat)**n_surveys
        for i in range(n_sites):
            if detected[i]:
                # Definitely present, likelihood of detection history
                prob = psi_try
                for k in range(n_surveys):
                    if detections[i, k]:
                        prob *= p_hat
                    else:
                        prob *= (1 - p_hat)
                ll += np.log(max(prob, 1e-15))
            else:
                # Could be absent or present but undetected
                prob = (1 - psi_try) + psi_try * (1 - p_hat)**n_surveys
                ll += np.log(max(prob, 1e-15))

        if ll > best_ll:
            best_ll = ll
            best_psi = psi_try

    # Naive occupancy (just fraction of sites detected)
    naive_psi = n_detected / n_sites

    return {
        'psi_hat': best_psi,
        'p_hat': p_hat,
        'naive_psi': naive_psi,
        'n_detected': n_detected,
        'n_sites': n_sites,
    }

# Estimate for each species
results = []
for sp in range(n_species):
    r = estimate_occupancy(detection[:, sp, :], n_surveys)
    r['true_psi'] = true_psi[:, sp].mean()
    r['true_p'] = true_p[sp]
    r['name'] = species_names[sp]
    results.append(r)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Site map with species richness
ax = axes[0, 0]
ax.set_facecolor('#111827')
richness = true_Z.sum(axis=1)
scatter = ax.scatter(site_x, site_y, c=richness, cmap='YlGn', s=site_wetland_area*30+20,
                     edgecolors='white', linewidth=0.5, vmin=0, vmax=n_species)
ax.set_xlabel('X (km)', color='white')
ax.set_ylabel('Y (km)', color='white')
ax.set_title('Site map (color=richness, size=wetland area)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(scatter, ax=ax, label='Species richness')

# Naive vs model estimates
ax = axes[0, 1]
ax.set_facecolor('#111827')
x = np.arange(n_species)
w = 0.25
true_psis = [r['true_psi'] for r in results]
naive_psis = [r['naive_psi'] for r in results]
model_psis = [r['psi_hat'] for r in results]
ax.bar(x - w, true_psis, w, color='#22c55e', label='True', edgecolor='none')
ax.bar(x, naive_psis, w, color='#ef4444', label='Naive (detected/total)', edgecolor='none')
ax.bar(x + w, model_psis, w, color='#3b82f6', label='Model estimate', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([r['name'][:8] for r in results], color='white', fontsize=8, rotation=30)
ax.set_ylabel('Occupancy probability', color='white')
ax.set_title('Occupancy: true vs naive vs model', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Detection probability estimates
ax = axes[1, 0]
ax.set_facecolor('#111827')
true_ps = [r['true_p'] for r in results]
est_ps = [r['p_hat'] for r in results]
ax.bar(x - 0.15, true_ps, 0.3, color='#22c55e', label='True p', edgecolor='none')
ax.bar(x + 0.15, est_ps, 0.3, color='#3b82f6', label='Estimated p', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([r['name'][:8] for r in results], color='white', fontsize=8, rotation=30)
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Detection probability estimates', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Survey adequacy: nights needed for 95% detection confidence
ax = axes[1, 1]
ax.set_facecolor('#111827')
nights_needed = []
for r in results:
    p = r['p_hat']
    if p > 0:
        k = int(np.ceil(np.log(0.05) / np.log(1 - p)))
    else:
        k = 100
    nights_needed.append(k)
bar_colors = ['#22c55e' if k <= n_surveys else '#ef4444' for k in nights_needed]
ax.bar(x, nights_needed, color=bar_colors, edgecolor='none', width=0.5)
ax.axhline(n_surveys, color='white', linestyle='--', label=f'Survey effort ({n_surveys} nights)')
ax.set_xticks(x)
ax.set_xticklabels([r['name'][:8] for r in results], color='white', fontsize=8, rotation=30)
ax.set_ylabel('Nights needed (95% confidence)', color='white')
ax.set_title('Survey adequacy assessment', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Citizen science monitoring results:")
print(f"{'Species':<16} {'True psi':>8} {'Naive':>8} {'Model':>8} {'True p':>7} {'Est p':>7} {'Nights':>7}")
print("-" * 73)
for r, k in zip(results, nights_needed):
    print(f"{r['name']:<16} {r['true_psi']:>8.2f} {r['naive_psi']:>8.2f} {r['psi_hat']:>8.2f} "
          f"{r['true_p']:>7.2f} {r['p_hat']:>7.2f} {k:>7}")
print()
print("Key insight: naive occupancy UNDERESTIMATES true occupancy")
print("because it ignores imperfect detection. The model corrects this bias.")`,
      challenge: 'Add a "data quality" dimension: some citizen scientists place ARUs in good locations (high p) while others place them poorly (low p). Model heterogeneous detection probability across sites and see how it affects occupancy estimates.',
      successHint: 'Citizen science combined with occupancy modeling enables biodiversity monitoring at scales impossible for professional scientists alone. You have built the complete analytical framework from first principles.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Bioacoustics Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (sound and ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real bioacoustic analysis. Click to start.</p>
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
