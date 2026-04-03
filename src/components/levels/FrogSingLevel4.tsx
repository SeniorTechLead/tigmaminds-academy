import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FrogSingLevel4() {
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
      title: 'Capstone overview — Frog Call Identifier from spectrograms',
      concept: `In this capstone you will build a **spectrogram-based frog species classifier** — the same type of system used in real bioacoustic monitoring apps like FrogID (Australia) and iNaturalist.

The pipeline:
1. **Audio synthesis**: Generate realistic multi-species call recordings with natural variation
2. **Spectrogram computation**: Convert audio to time-frequency images using the STFT
3. **Feature extraction**: Compute spectral and temporal features from spectrogram patches
4. **Classifier training**: Build and evaluate a multi-class species identifier
5. **Field deployment simulation**: Test on noisy, overlapping recordings like real field data

This is a real application with conservation impact. Automated frog call identification enables continent-scale monitoring of amphibian populations — the most threatened vertebrate class on Earth. Over 40% of amphibian species are at risk of extinction, and acoustic monitoring is the most efficient way to track them.`,
      analogy: 'Building a frog call identifier is like building Shazam for wildlife. Shazam converts music to a spectrogram, extracts features (audio fingerprints), and matches them to a database. Your frog identifier does the same thing — but instead of recognizing songs, it recognizes species. Both solve the same pattern recognition problem.',
      storyConnection: 'The pre-rain chorus in the story contains many species singing simultaneously. A human listener might distinguish three or four by ear. This classifier can identify all species in a recording automatically, track their populations over time, and alert conservationists when a species goes silent — turning the story\'s single observation into a powerful monitoring tool.',
      checkQuestion: 'Why is spectrogram-based classification better than waveform-based classification for frog calls?',
      checkAnswer: 'Waveforms are one-dimensional and extremely high-dimensional (22050 samples per second). Two recordings of the same species can have very different waveforms due to timing differences. Spectrograms are two-dimensional (time x frequency) and are invariant to small timing shifts — the frequency pattern is the same regardless of when exactly the call starts. They also separate overlapping species that occupy different frequency bands, which is impossible from a mixed waveform alone.',
      codeIntro: 'Stage 1: Build the audio synthesizer with 6 species, each with natural within-species variation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050

# 6 species with distinct and realistic acoustic signatures
SPECIES = {
    'Polypedates leucomystax': {'freq': 2200, 'bw': 300, 'rate': 3.0, 'dur': 0.12, 'fm': 150, 'am': 0, 'harmonics': 3},
    'Microhyla ornata':        {'freq': 3800, 'bw': 200, 'rate': 6.0, 'dur': 0.04, 'fm': 400, 'am': 0, 'harmonics': 2},
    'Hoplobatrachus tigerinus': {'freq': 600,  'bw': 150, 'rate': 1.5, 'dur': 0.35, 'fm': 0,   'am': 20, 'harmonics': 4},
    'Duttaphrynus melanostictus': {'freq': 1400, 'bw': 250, 'rate': 2.5, 'dur': 0.2, 'fm': 80, 'am': 35, 'harmonics': 3},
    'Euphlyctis cyanophlyctis': {'freq': 2800, 'bw': 350, 'rate': 5.0, 'dur': 0.06, 'fm': 250, 'am': 0, 'harmonics': 2},
    'Fejervarya limnocharis':   {'freq': 1800, 'bw': 200, 'rate': 4.0, 'dur': 0.1, 'fm': 100, 'am': 15, 'harmonics': 3},
}

def synthesize_call(params, duration=3.0, variation=0.15, snr_db=20):
    """Synthesize a frog call with natural variation and noise."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    signal = np.zeros_like(t)

    # Add individual variation
    freq = params['freq'] * (1 + np.random.normal(0, variation * 0.3))
    rate = params['rate'] * (1 + np.random.normal(0, variation))
    dur = params['dur'] * (1 + np.random.normal(0, variation * 0.5))
    fm = params['fm'] * (1 + np.random.normal(0, variation * 0.5))

    period = 1.0 / max(rate, 0.3)
    start_offset = np.random.uniform(0, 0.3)

    for call_start in np.arange(start_offset, duration - dur, period):
        mask = (t >= call_start) & (t < call_start + dur)
        if not mask.any():
            continue
        tl = t[mask] - call_start

        # FM modulation
        freq_inst = freq + fm * np.sin(2 * np.pi * 5 * tl)
        phase = 2 * np.pi * np.cumsum(freq_inst) / sr

        # Harmonics
        call = np.zeros_like(tl)
        for h in range(1, params['harmonics'] + 1):
            amp = 0.7 ** (h - 1)
            call += amp * np.sin(h * phase)

        # AM modulation
        if params['am'] > 0:
            call *= 0.5 + 0.5 * np.sin(2 * np.pi * params['am'] * tl)

        # Envelope
        env = np.ones_like(tl)
        att = min(int(0.008 * sr), len(env) - 1)
        rel = min(int(0.015 * sr), len(env) - 1)
        if att > 0:
            env[:att] = np.linspace(0, 1, att)
        if rel > 0:
            env[-rel:] = np.linspace(1, 0, rel)

        signal[mask] += call * env * (0.7 + 0.3 * np.random.random())

    # Add background noise
    noise_power = np.mean(signal ** 2) / (10 ** (snr_db / 10))
    signal += np.sqrt(max(noise_power, 1e-10)) * np.random.randn(len(t))

    return t, signal

# Generate dataset
n_samples_per_species = 40
species_list = list(SPECIES.keys())
X_audio = []
y_labels = []

for sp_idx, (name, params) in enumerate(SPECIES.items()):
    for _ in range(n_samples_per_species):
        snr = np.random.uniform(10, 30)
        _, sig = synthesize_call(params, duration=2.0, snr_db=snr)
        X_audio.append(sig)
        y_labels.append(sp_idx)

y_labels = np.array(y_labels)
print(f"Generated {len(X_audio)} recordings across {len(SPECIES)} species")
print(f"  {n_samples_per_species} samples per species")
print(f"  Duration: 2.0 seconds each at {sr} Hz")

# Visualize one example per species
fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

for i, (name, params) in enumerate(SPECIES.items()):
    ax = axes.flat[i]
    ax.set_facecolor('#111827')
    t, sig = synthesize_call(params, duration=1.5, snr_db=25)
    # Compute spectrogram
    win = 512
    hop = 128
    nw = (len(sig) - win) // hop + 1
    spec = np.zeros((win // 2 + 1, nw))
    for j in range(nw):
        frame = sig[j*hop:j*hop+win] * np.hanning(win)
        spec[:, j] = 10 * np.log10(np.abs(np.fft.rfft(frame))**2 + 1e-10)
    freqs = np.fft.rfftfreq(win, 1/sr)
    times = np.arange(nw) * hop / sr
    ax.pcolormesh(times, freqs, spec, cmap='magma', shading='auto',
                  vmin=spec.max()-50, vmax=spec.max())
    ax.set_ylim(0, 5000)
    short_name = name.split()[-1]
    ax.set_title(f'{short_name} ({params["freq"]} Hz)', color=colors[i], fontsize=10)
    ax.set_xlabel('Time (s)', color='white', fontsize=8)
    ax.set_ylabel('Hz', color='white', fontsize=8)
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("\\nSpecies acoustic signatures:")
for name, params in SPECIES.items():
    mod = []
    if params['fm'] > 0: mod.append(f"FM±{params['fm']}Hz")
    if params['am'] > 0: mod.append(f"AM@{params['am']}Hz")
    print(f"  {name}: {params['freq']}Hz, {params['rate']}/s, {params['dur']*1000:.0f}ms, {', '.join(mod) or 'pure'}")`,
      challenge: 'Generate a "mixed chorus" recording by summing 3 random species with different amplitudes. Compute its spectrogram. Can you visually identify each species? This is what the classifier must handle in the field.',
      successHint: 'Realistic synthesis with natural variation is essential for training robust classifiers. A model trained on perfect, identical calls would fail on real recordings where every individual sounds slightly different.',
    },
    {
      title: 'Spectrogram feature extraction — from images to numbers',
      concept: `Each spectrogram is a 2D matrix of energy values. We need to convert it into a fixed-length **feature vector** that captures the species-diagnostic information.

The feature extraction pipeline:
1. **Compute spectrogram** (STFT with Hanning window)
2. **Extract global features**: dominant frequency, bandwidth, spectral centroid, entropy
3. **Extract temporal features**: call rate, duration, inter-call interval from the energy envelope
4. **Extract texture features**: spectral flatness, spectral rolloff, temporal modulation rate
5. **Combine into feature vector**: 12-15 numbers that uniquely characterize the recording

This feature vector is what the classifier actually works with — not the raw spectrogram. The art of bioacoustic classification is choosing features that are:
- **Discriminative**: different between species
- **Invariant**: consistent within a species despite individual variation, temperature, and distance
- **Robust**: unaffected by background noise and recording conditions`,
      analogy: 'Feature extraction is like a wine sommelier describing a wine. They do not report the molecular composition (raw spectrogram). Instead, they report key characteristics: "fruity nose, medium body, dry finish, hints of oak" (features). These descriptors are enough to identify the wine. Your feature extractor is the bioacoustic sommelier — distilling complex spectrograms into diagnostic descriptors.',
      storyConnection: 'Each frog in the pre-rain chorus has a distinctive voice. The feature extractor quantifies exactly what makes each voice unique — the tree frog\'s high-pitched chirps vs the bull frog\'s deep pulsing croaks vs the cricket frog\'s rapid clicks. These quantified differences are what allow automated identification.',
      checkQuestion: 'A feature extractor that works perfectly in a quiet lab fails in the field with wind noise. What went wrong?',
      checkAnswer: 'Wind noise is broadband low-frequency energy that affects features like spectral centroid (biased downward), bandwidth (inflated), and zero-crossing rate (inflated). The extractor was not trained on noisy data, so its features shift outside the learned distribution. Solutions: (1) add noise to training data (data augmentation), (2) use noise-robust features (spectral contrast rather than raw centroid), (3) apply noise reduction before feature extraction.',
      codeIntro: 'Build the complete feature extraction pipeline and visualize how well features separate species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050

# Compact synthesis
SPECIES = {
    'P. leucomystax':   {'freq': 2200, 'rate': 3.0, 'dur': 0.12, 'fm': 150, 'am': 0, 'har': 3},
    'M. ornata':        {'freq': 3800, 'rate': 6.0, 'dur': 0.04, 'fm': 400, 'am': 0, 'har': 2},
    'H. tigerinus':     {'freq': 600,  'rate': 1.5, 'dur': 0.35, 'fm': 0,   'am': 20, 'har': 4},
    'D. melanostictus': {'freq': 1400, 'rate': 2.5, 'dur': 0.2, 'fm': 80,  'am': 35, 'har': 3},
    'E. cyanophlyctis': {'freq': 2800, 'rate': 5.0, 'dur': 0.06, 'fm': 250, 'am': 0, 'har': 2},
    'F. limnocharis':   {'freq': 1800, 'rate': 4.0, 'dur': 0.1, 'fm': 100, 'am': 15, 'har': 3},
}

def synth(params, dur=2.0):
    t = np.linspace(0, dur, int(sr*dur), endpoint=False)
    sig = np.zeros_like(t)
    f = params['freq']*(1+np.random.normal(0,0.05))
    r = max(params['rate']*(1+np.random.normal(0,0.15)), 0.3)
    d = params['dur']*(1+np.random.normal(0,0.1))
    per = 1.0/r
    for s in np.arange(np.random.uniform(0,0.2), dur-d, per):
        m = (t>=s)&(t<s+d)
        if not m.any(): continue
        tl = t[m]-s
        ph = 2*np.pi*np.cumsum(f + params['fm']*np.sin(2*np.pi*5*tl))/sr
        c = sum(0.7**(h-1)*np.sin(h*ph) for h in range(1, params['har']+1))
        if params['am']>0: c *= 0.5+0.5*np.sin(2*np.pi*params['am']*tl)
        env = np.ones_like(tl)
        a,r2 = min(int(.008*sr),len(env)-1), min(int(.015*sr),len(env)-1)
        if a>0: env[:a]=np.linspace(0,1,a)
        if r2>0: env[-r2:]=np.linspace(1,0,r2)
        sig[m] += c*env
    snr = np.random.uniform(12,28)
    noise_p = np.mean(sig**2)/(10**(snr/10))
    sig += np.sqrt(max(noise_p,1e-10))*np.random.randn(len(t))
    return sig

def extract_features(signal):
    """Extract 12 acoustic features from a recording."""
    # Spectrogram
    win, hop = 512, 128
    nw = (len(signal)-win)//hop + 1
    spec = np.zeros((win//2+1, nw))
    for i in range(nw):
        frame = signal[i*hop:i*hop+win]*np.hanning(win)
        spec[:, i] = np.abs(np.fft.rfft(frame))**2
    freqs = np.fft.rfftfreq(win, 1/sr)

    # Mean power spectrum
    mean_spec = spec.mean(axis=1)
    total = max(mean_spec.sum(), 1e-10)
    p = mean_spec / total

    # 1. Dominant frequency
    dom_freq = freqs[np.argmax(mean_spec)]
    # 2. Spectral centroid
    centroid = np.sum(freqs * p)
    # 3. Bandwidth (IQR)
    cs = np.cumsum(p)
    q25 = freqs[np.searchsorted(cs, 0.25)]
    q75 = freqs[np.searchsorted(cs, 0.75)]
    bandwidth = q75 - q25
    # 4. Spectral entropy
    pnz = p[p > 0]
    entropy = -np.sum(pnz * np.log2(pnz)) / max(np.log2(len(pnz)), 1)
    # 5. Spectral rolloff (85%)
    rolloff = freqs[np.searchsorted(cs, 0.85)]
    # 6. Spectral flatness
    geo_mean = np.exp(np.mean(np.log(mean_spec + 1e-10)))
    arith_mean = np.mean(mean_spec)
    flatness = geo_mean / max(arith_mean, 1e-10)

    # Temporal features from energy envelope
    energy_env = spec.sum(axis=0)
    smooth_env = np.convolve(energy_env, np.ones(5)/5, mode='same')
    threshold = 0.2 * smooth_env.max()
    above = smooth_env > threshold
    onsets = np.where(np.diff(above.astype(int)) == 1)[0]

    # 7. Call rate
    call_rate = len(onsets) / (len(signal)/sr) if len(onsets) > 0 else 0
    # 8. Mean inter-call interval
    if len(onsets) > 1:
        ici = np.mean(np.diff(onsets)) * hop / sr * 1000
    else:
        ici = 1000
    # 9. Call duty cycle
    duty = above.sum() / len(above)
    # 10. Temporal modulation rate
    env_fft = np.abs(np.fft.rfft(smooth_env - smooth_env.mean()))
    mod_freqs = np.fft.rfftfreq(len(smooth_env), hop/sr)
    mod_rate = mod_freqs[np.argmax(env_fft[1:]) + 1] if len(env_fft) > 1 else 0
    # 11. Peak-to-mean energy ratio
    peak_mean = smooth_env.max() / max(smooth_env.mean(), 1e-10)
    # 12. Harmonic ratio (energy in harmonics / total)
    dom_idx = np.argmax(mean_spec)
    harmonic_energy = 0
    for h in range(2, 5):
        h_idx = dom_idx * h
        if h_idx < len(mean_spec):
            harmonic_energy += mean_spec[max(0,h_idx-5):min(len(mean_spec),h_idx+5)].sum()
    harm_ratio = harmonic_energy / max(total, 1e-10)

    return np.array([dom_freq, centroid, bandwidth, entropy, rolloff, flatness,
                     call_rate, ici, duty, mod_rate, peak_mean, harm_ratio])

FEAT_NAMES = ['dom_freq', 'centroid', 'bandwidth', 'entropy', 'rolloff', 'flatness',
              'call_rate', 'ICI_ms', 'duty_cycle', 'mod_rate', 'peak_mean', 'harm_ratio']

# Extract features for all samples
n_per = 40
sp_names = list(SPECIES.keys())
X_all = []
y_all = []
for si, (name, params) in enumerate(SPECIES.items()):
    for _ in range(n_per):
        sig = synth(params)
        feats = extract_features(sig)
        X_all.append(feats)
        y_all.append(si)
X = np.array(X_all)
y = np.array(y_all)

# Normalize
mu = X.mean(axis=0)
std = X.std(axis=0) + 1e-10
X_norm = (X - mu) / std

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

# Feature pair: dom_freq vs call_rate
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, name in enumerate(sp_names):
    m = y == i
    ax.scatter(X[m, 0], X[m, 6], s=30, color=colors[i], alpha=0.6, label=name[:12])
ax.set_xlabel('Dominant freq (Hz)', color='white')
ax.set_ylabel('Call rate (/s)', color='white')
ax.set_title('Feature space: frequency vs rate', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='gray')

# Feature pair: bandwidth vs entropy
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, name in enumerate(sp_names):
    m = y == i
    ax.scatter(X[m, 2], X[m, 3], s=30, color=colors[i], alpha=0.6, label=name[:12])
ax.set_xlabel('Bandwidth (Hz)', color='white')
ax.set_ylabel('Spectral entropy', color='white')
ax.set_title('Feature space: bandwidth vs entropy', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='gray')

# Feature importance
ax = axes[1, 0]
ax.set_facecolor('#111827')
corrs = np.array([np.abs(np.corrcoef(X_norm[:, i], y)[0, 1]) for i in range(X.shape[1])])
si = np.argsort(corrs)
ax.barh(range(len(FEAT_NAMES)), corrs[si], color='#a855f7', edgecolor='none', height=0.6)
ax.set_yticks(range(len(FEAT_NAMES)))
ax.set_yticklabels([FEAT_NAMES[i] for i in si], color='white', fontsize=8)
ax.set_xlabel('|Correlation| with species', color='white')
ax.set_title('Feature discriminative power', color='white', fontsize=11)
ax.tick_params(colors='gray')

# PCA-like 2D projection (using top 2 features)
ax = axes[1, 1]
ax.set_facecolor('#111827')
top2 = np.argsort(corrs)[-2:]
for i, name in enumerate(sp_names):
    m = y == i
    ax.scatter(X_norm[m, top2[0]], X_norm[m, top2[1]], s=30, color=colors[i], alpha=0.6, label=name[:12])
ax.set_xlabel(f'{FEAT_NAMES[top2[0]]} (normalized)', color='white')
ax.set_ylabel(f'{FEAT_NAMES[top2[1]]} (normalized)', color='white')
ax.set_title('Top 2 features projection', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Feature extraction: {X.shape[1]} features from {len(X)} recordings")
print(f"Top features: {FEAT_NAMES[np.argmax(corrs)]}, {FEAT_NAMES[np.argsort(corrs)[-2]]}")`,
      challenge: 'Add Gaussian noise augmentation to the training data: for each recording, create a noisy copy with SNR=5dB. Does the feature distribution shift? Which features are most robust to noise?',
      successHint: 'Good features make classification trivial; bad features make it impossible. The 12 features you extracted capture the essential acoustic identity of each species in just 12 numbers.',
    },
    {
      title: 'Multi-class species classifier — k-NN and confusion analysis',
      concept: `With 12 features per recording and 6 species to classify, we need a **multi-class classifier**. We will use k-Nearest Neighbors (k-NN), which works naturally for any number of classes.

For each test recording:
1. Compute its 12-dimensional feature vector
2. Find the k nearest training recordings (by Euclidean distance in normalized feature space)
3. The k neighbors vote — the majority species wins

Critical design choices:
- **k value**: k=1 overfits; k=N underfits. Cross-validation finds the sweet spot.
- **Distance metric**: Euclidean distance treats all features equally. If some features are more informative, weighted distance performs better.
- **Normalization**: essential. Without it, features with large values (dominant freq: 500-4000) dominate features with small values (entropy: 0.5-0.9).

The **confusion matrix** reveals which species are confused with each other — usually species with overlapping acoustic niches. This directly informs which features need improvement.`,
      analogy: 'k-NN classification is like the game "Name That Tune." You hear a recording (test sample), compare it to all songs you know (training set), and the closest matches determine your answer. If the 5 most similar songs in your memory are all by the same artist (species), you are confident. If they are split between two artists, you are uncertain.',
      storyConnection: 'When a field biologist hears a frog call and tries to identify the species, they are doing k-NN in their head: "This sounds most like the calls I heard at Kaziranga last monsoon, which were identified as Polypedates leucomystax." The classifier automates this expert judgment, making it available to non-experts and applicable at scale.',
      checkQuestion: 'The classifier confuses Species A and Species B but never confuses either with Species C. What does this tell you about their acoustic relationships?',
      checkAnswer: 'Species A and B have overlapping acoustic niches — their feature vectors are close together in feature space. Species C is acoustically distinct from both. This pattern maps directly onto the acoustic niche partitioning concept from Level 3: A and B may compete for acoustic space and could benefit from character displacement. The confusion matrix is an empirical test of niche overlap.',
      codeIntro: 'Build, train, and evaluate a k-NN classifier with cross-validation, confusion analysis, and per-species performance metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050

# Regenerate dataset (compact)
SPECIES = {
    'P.leucomystax':   {'freq':2200,'rate':3.0,'dur':0.12,'fm':150,'am':0,'har':3},
    'M.ornata':        {'freq':3800,'rate':6.0,'dur':0.04,'fm':400,'am':0,'har':2},
    'H.tigerinus':     {'freq':600, 'rate':1.5,'dur':0.35,'fm':0,  'am':20,'har':4},
    'D.melanostictus': {'freq':1400,'rate':2.5,'dur':0.2, 'fm':80, 'am':35,'har':3},
    'E.cyanophlyctis': {'freq':2800,'rate':5.0,'dur':0.06,'fm':250,'am':0,'har':2},
    'F.limnocharis':   {'freq':1800,'rate':4.0,'dur':0.1, 'fm':100,'am':15,'har':3},
}
sp_names = list(SPECIES.keys())

def synth(p, dur=2.0):
    t = np.linspace(0, dur, int(sr*dur), endpoint=False)
    sig = np.zeros_like(t)
    f=p['freq']*(1+np.random.normal(0,.05)); r=max(p['rate']*(1+np.random.normal(0,.15)),.3)
    d=p['dur']*(1+np.random.normal(0,.1)); per=1.0/r
    for s in np.arange(np.random.uniform(0,.2), dur-d, per):
        m=(t>=s)&(t<s+d)
        if not m.any(): continue
        tl=t[m]-s; ph=2*np.pi*np.cumsum(f+p['fm']*np.sin(2*np.pi*5*tl))/sr
        c=sum(.7**(h-1)*np.sin(h*ph) for h in range(1,p['har']+1))
        if p['am']>0: c*=.5+.5*np.sin(2*np.pi*p['am']*tl)
        env=np.ones_like(tl)
        a=min(int(.008*sr),len(env)-1); r2=min(int(.015*sr),len(env)-1)
        if a>0: env[:a]=np.linspace(0,1,a)
        if r2>0: env[-r2:]=np.linspace(1,0,r2)
        sig[m]+=c*env
    snr=np.random.uniform(12,28)
    sig+=np.sqrt(max(np.mean(sig**2)/(10**(snr/10)),1e-10))*np.random.randn(len(t))
    return sig

def extract(signal):
    win,hop=512,128; nw=(len(signal)-win)//hop+1
    spec=np.zeros((win//2+1,nw))
    for i in range(nw):
        frame=signal[i*hop:i*hop+win]*np.hanning(win)
        spec[:,i]=np.abs(np.fft.rfft(frame))**2
    freqs=np.fft.rfftfreq(win,1/sr); ms=spec.mean(axis=1); t=max(ms.sum(),1e-10); p=ms/t
    dom=freqs[np.argmax(ms)]; cent=np.sum(freqs*p)
    cs=np.cumsum(p); bw=freqs[np.searchsorted(cs,.75)]-freqs[np.searchsorted(cs,.25)]
    pnz=p[p>0]; ent=-np.sum(pnz*np.log2(pnz))/max(np.log2(len(pnz)),1)
    ro=freqs[np.searchsorted(cs,.85)]
    fl=np.exp(np.mean(np.log(ms+1e-10)))/max(np.mean(ms),1e-10)
    ee=spec.sum(axis=0); se=np.convolve(ee,np.ones(5)/5,mode='same')
    th=.2*se.max(); above=se>th; ons=np.where(np.diff(above.astype(int))==1)[0]
    cr=len(ons)/(len(signal)/sr) if len(ons)>0 else 0
    ici=np.mean(np.diff(ons))*hop/sr*1000 if len(ons)>1 else 1000
    duty=above.sum()/len(above)
    ef=np.abs(np.fft.rfft(se-se.mean())); mf=np.fft.rfftfreq(len(se),hop/sr)
    mr=mf[np.argmax(ef[1:])+1] if len(ef)>1 else 0
    pm=se.max()/max(se.mean(),1e-10)
    di=np.argmax(ms); he=0
    for h in range(2,5):
        hi=di*h
        if hi<len(ms): he+=ms[max(0,hi-5):min(len(ms),hi+5)].sum()
    hr=he/max(t,1e-10)
    return np.array([dom,cent,bw,ent,ro,fl,cr,ici,duty,mr,pm,hr])

n_per=50
X_all=[]; y_all=[]
for si,(name,params) in enumerate(SPECIES.items()):
    for _ in range(n_per):
        X_all.append(extract(synth(params))); y_all.append(si)
X=np.array(X_all); y=np.array(y_all)
mu=X.mean(0); std=X.std(0)+1e-10; Xn=(X-mu)/std

# Train/test split
idx=np.random.permutation(len(y)); sp=int(.8*len(y))
Xtr,Xte,ytr,yte = Xn[idx[:sp]],Xn[idx[sp:]],y[idx[:sp]],y[idx[sp:]]

# k-NN classifier
class KNN:
    def __init__(self, k=5):
        self.k = k
    def fit(self, X, y):
        self.X, self.y = X.copy(), y.copy()
    def predict(self, X):
        preds = []
        for x in X:
            dists = np.sqrt(np.sum((self.X - x)**2, axis=1))
            nn = np.argsort(dists)[:self.k]
            classes, counts = np.unique(self.y[nn], return_counts=True)
            preds.append(classes[np.argmax(counts)])
        return np.array(preds)

# Cross-validation for k selection
k_vals = list(range(1, 21, 2))
cv_accs = []
for k in k_vals:
    accs = []
    for fold in range(5):
        val_idx = np.arange(fold*len(Xtr)//5, (fold+1)*len(Xtr)//5)
        tr_idx = np.setdiff1d(np.arange(len(Xtr)), val_idx)
        knn = KNN(k=k)
        knn.fit(Xtr[tr_idx], ytr[tr_idx])
        accs.append(np.mean(knn.predict(Xtr[val_idx]) == ytr[val_idx]))
    cv_accs.append(np.mean(accs))

best_k = k_vals[np.argmax(cv_accs)]
knn = KNN(k=best_k)
knn.fit(Xtr, ytr)
y_pred = knn.predict(Xte)
test_acc = np.mean(y_pred == yte)

# Confusion matrix
n_classes = 6
conf = np.zeros((n_classes, n_classes), dtype=int)
for t, p in zip(yte, y_pred): conf[t, p] += 1

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# k selection
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(k_vals, cv_accs, 'o-', color='#22c55e', linewidth=2)
ax.axvline(best_k, color='#f59e0b', linestyle='--', label=f'Best k={best_k}')
ax.set_xlabel('k', color='white')
ax.set_ylabel('CV accuracy', color='white')
ax.set_title('k-NN: cross-validation for k', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Confusion matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(conf, cmap='YlOrRd', aspect='auto')
for i in range(n_classes):
    for j in range(n_classes):
        ax.text(j, i, str(conf[i,j]), ha='center', va='center',
                color='white' if conf[i,j]>conf.max()/2 else 'black', fontsize=10)
ax.set_xticks(range(n_classes)); ax.set_yticks(range(n_classes))
short = [n[:6] for n in sp_names]
ax.set_xticklabels(short, color='white', fontsize=8, rotation=30)
ax.set_yticklabels(short, color='white', fontsize=8)
ax.set_xlabel('Predicted', color='white'); ax.set_ylabel('True', color='white')
ax.set_title(f'Confusion matrix (acc={test_acc:.1%})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Per-class metrics
ax = axes[1, 0]
ax.set_facecolor('#111827')
prec, rec, f1 = [], [], []
for c in range(n_classes):
    tp=conf[c,c]; fp=conf[:,c].sum()-tp; fn=conf[c,:].sum()-tp
    p=tp/(tp+fp) if (tp+fp)>0 else 0; r=tp/(tp+fn) if (tp+fn)>0 else 0
    f=2*p*r/(p+r) if (p+r)>0 else 0
    prec.append(p); rec.append(r); f1.append(f)
x=np.arange(n_classes); w=0.25
ax.bar(x-w, prec, w, color='#3b82f6', label='Precision', edgecolor='none')
ax.bar(x, rec, w, color='#22c55e', label='Recall', edgecolor='none')
ax.bar(x+w, f1, w, color='#a855f7', label='F1', edgecolor='none')
ax.set_xticks(x); ax.set_xticklabels(short, color='white', fontsize=8, rotation=30)
ax.set_ylabel('Score', color='white')
ax.set_title('Per-species performance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Most confused pairs
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
report = f"FROG CALL CLASSIFIER REPORT\\n{'='*40}\\n"
report += f"Best k: {best_k}\\nTest accuracy: {test_acc:.1%}\\n\\n"
report += f"{'Species':<16} {'Prec':>6} {'Rec':>6} {'F1':>6}\\n{'-'*36}\\n"
for i in range(n_classes):
    report += f"{sp_names[i][:15]:<16} {prec[i]:>6.2f} {rec[i]:>6.2f} {f1[i]:>6.2f}\\n"
# Find most confused pair
np.fill_diagonal(conf, 0)
if conf.max() > 0:
    ci,cj = np.unravel_index(conf.argmax(), conf.shape)
    report += f"\\nMost confused: {sp_names[ci][:10]} <-> {sp_names[cj][:10]}"
ax.text(0.05, 0.95, report, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print(f"k-NN classifier: k={best_k}, accuracy={test_acc:.1%}")
for i in range(n_classes):
    print(f"  {sp_names[i]}: prec={prec[i]:.2f}, rec={rec[i]:.2f}, F1={f1[i]:.2f}")`,
      challenge: 'Implement distance-weighted k-NN: instead of equal votes, weight each neighbor\'s vote by 1/distance. Does this improve accuracy, especially for the most-confused species pair?',
      successHint: 'The confusion matrix is your diagnostic tool. It tells you exactly where to focus improvement efforts — if two species are confused, you need features that distinguish them specifically.',
    },
    {
      title: 'Field deployment — classifying noisy, overlapping recordings',
      concept: `Real field recordings are nothing like clean lab data. A deployed frog call identifier must handle:

- **Background noise**: wind, rain, insects, traffic — all add energy that can confuse spectral features
- **Overlapping calls**: multiple species calling simultaneously creates mixed spectrograms
- **Distance variation**: a frog 1 meter from the microphone sounds very different from one 50 meters away (amplitude, frequency-dependent attenuation)
- **Reverberation**: sound bouncing off water, trees, and terrain smears temporal features

To handle these challenges:
1. **Noise reduction**: spectral subtraction — estimate the noise spectrum from quiet segments and subtract it
2. **Call segmentation**: detect individual calls in the continuous stream before classifying
3. **Confidence thresholds**: reject uncertain classifications rather than guessing
4. **Ensemble methods**: use multiple feature sets and classifiers, take the consensus

The final output is a species list with timestamps and confidence scores — the same data product a human expert would produce, but at a fraction of the time and cost.`,
      analogy: 'Deploying a classifier in the field is like deploying a self-driving car. The lab (test track) is clean and controlled. The real world has rain, glare, construction, pedestrians, and other cars. Both systems must be robust to conditions never seen in training. The solution in both cases: train on diverse data, add noise augmentation, and have a "refuse to classify" option for uncertain cases.',
      storyConnection: 'The pre-rain chorus in the story happens in a complex environment — wind picking up, insects buzzing, rain approaching. A deployed frog call identifier must work in exactly these conditions, extracting species signals from the noisy, overlapping soundscape of a real monsoon evening.',
      checkQuestion: 'Your classifier achieves 95% accuracy on clean test data but only 60% in the field. What are the three most likely causes?',
      checkAnswer: 'In order of likelihood: (1) Domain shift — field recordings have noise, reverberation, and level variation not present in training data. Solution: train on realistic noisy data. (2) Overlapping species — the classifier was trained on single-species recordings but encounters mixtures. Solution: train on multi-species examples or use source separation. (3) New species — the field site has species not in the training set. The classifier forces them into known categories. Solution: add an "unknown" class or use an open-set classifier.',
      codeIntro: 'Simulate field conditions: add noise, overlap species, and test the classifier under realistic deployment conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050

# Compact species + synth + extract (from previous stages)
SP = {
    'P.leuco':  {'freq':2200,'rate':3,'dur':.12,'fm':150,'am':0,'har':3},
    'M.ornata': {'freq':3800,'rate':6,'dur':.04,'fm':400,'am':0,'har':2},
    'H.tiger':  {'freq':600, 'rate':1.5,'dur':.35,'fm':0,'am':20,'har':4},
    'D.melano': {'freq':1400,'rate':2.5,'dur':.2,'fm':80,'am':35,'har':3},
    'E.cyano':  {'freq':2800,'rate':5,'dur':.06,'fm':250,'am':0,'har':2},
    'F.limno':  {'freq':1800,'rate':4,'dur':.1,'fm':100,'am':15,'har':3},
}
sp_names = list(SP.keys())

def synth(p, dur=2.0):
    t=np.linspace(0,dur,int(sr*dur),endpoint=False); sig=np.zeros_like(t)
    f=p['freq']*(1+np.random.normal(0,.05)); r=max(p['rate']*(1+np.random.normal(0,.15)),.3)
    d=p['dur']*(1+np.random.normal(0,.1)); per=1.0/r
    for s in np.arange(np.random.uniform(0,.2),dur-d,per):
        m=(t>=s)&(t<s+d)
        if not m.any(): continue
        tl=t[m]-s; ph=2*np.pi*np.cumsum(f+p['fm']*np.sin(2*np.pi*5*tl))/sr
        c=sum(.7**(h-1)*np.sin(h*ph) for h in range(1,p['har']+1))
        if p['am']>0: c*=.5+.5*np.sin(2*np.pi*p['am']*tl)
        env=np.ones_like(tl)
        a=min(int(.008*sr),len(env)-1); r2=min(int(.015*sr),len(env)-1)
        if a>0: env[:a]=np.linspace(0,1,a)
        if r2>0: env[-r2:]=np.linspace(1,0,r2)
        sig[m]+=c*env
    return sig

def extract(signal):
    win,hop=512,128; nw=(len(signal)-win)//hop+1
    spec=np.zeros((win//2+1,nw))
    for i in range(nw):
        frame=signal[i*hop:i*hop+win]*np.hanning(win)
        spec[:,i]=np.abs(np.fft.rfft(frame))**2
    freqs=np.fft.rfftfreq(win,1/sr); ms=spec.mean(axis=1); t=max(ms.sum(),1e-10); p=ms/t
    dom=freqs[np.argmax(ms)]; cent=np.sum(freqs*p)
    cs=np.cumsum(p); bw=freqs[np.searchsorted(cs,.75)]-freqs[np.searchsorted(cs,.25)]
    pnz=p[p>0]; ent=-np.sum(pnz*np.log2(pnz))/max(np.log2(len(pnz)),1)
    ro=freqs[np.searchsorted(cs,.85)]
    fl=np.exp(np.mean(np.log(ms+1e-10)))/max(np.mean(ms),1e-10)
    ee=spec.sum(axis=0); se=np.convolve(ee,np.ones(5)/5,mode='same')
    th=.2*se.max(); above=se>th; ons=np.where(np.diff(above.astype(int))==1)[0]
    cr=len(ons)/(len(signal)/sr) if len(ons)>0 else 0
    ici=np.mean(np.diff(ons))*hop/sr*1000 if len(ons)>1 else 1000
    duty=above.sum()/len(above)
    ef=np.abs(np.fft.rfft(se-se.mean())); mf=np.fft.rfftfreq(len(se),hop/sr)
    mr=mf[np.argmax(ef[1:])+1] if len(ef)>1 else 0
    pm=se.max()/max(se.mean(),1e-10)
    di=np.argmax(ms); he=0
    for h in range(2,5):
        hi=di*h
        if hi<len(ms): he+=ms[max(0,hi-5):min(len(ms),hi+5)].sum()
    hr=he/max(t,1e-10)
    return np.array([dom,cent,bw,ent,ro,fl,cr,ici,duty,mr,pm,hr])

# Train on clean data
n_per=60; X_train=[]; y_train=[]
for si,(name,params) in enumerate(SP.items()):
    for _ in range(n_per):
        sig=synth(params)
        snr=np.random.uniform(15,30)
        sig+=np.sqrt(max(np.mean(sig**2)/(10**(snr/10)),1e-10))*np.random.randn(len(sig))
        X_train.append(extract(sig)); y_train.append(si)
X_train=np.array(X_train); y_train=np.array(y_train)
mu=X_train.mean(0); std=X_train.std(0)+1e-10
Xn_train=(X_train-mu)/std

class KNN:
    def __init__(self,k=5): self.k=k
    def fit(self,X,y): self.X,self.y=X.copy(),y.copy()
    def predict_conf(self,X):
        preds,confs=[],[]
        for x in X:
            d=np.sqrt(np.sum((self.X-x)**2,axis=1))
            nn=np.argsort(d)[:self.k]
            cl,cnt=np.unique(self.y[nn],return_counts=True)
            preds.append(cl[np.argmax(cnt)]); confs.append(cnt.max()/self.k)
        return np.array(preds),np.array(confs)

knn=KNN(k=7); knn.fit(Xn_train,y_train)

# Field test scenarios
def field_test(scenario_name, signals, true_labels, snr_range):
    X_test=[]; y_test=[]
    for sig, label in zip(signals, true_labels):
        snr = np.random.uniform(*snr_range)
        sig_noisy = sig + np.sqrt(max(np.mean(sig**2)/(10**(snr/10)),1e-10))*np.random.randn(len(sig))
        X_test.append(extract(sig_noisy)); y_test.append(label)
    X_test=np.array(X_test); y_test=np.array(y_test)
    Xn_test=(X_test-mu)/std
    preds,confs = knn.predict_conf(Xn_test)
    acc = np.mean(preds==y_test)
    # With confidence threshold
    threshold = 0.6
    confident = confs >= threshold
    if confident.any():
        acc_conf = np.mean(preds[confident]==y_test[confident])
        coverage = confident.mean()
    else:
        acc_conf, coverage = 0, 0
    return {'name':scenario_name, 'acc':acc, 'acc_conf':acc_conf,
            'coverage':coverage, 'mean_conf':confs.mean(), 'confs':confs,
            'preds':preds, 'true':y_test}

# Scenario 1: Clean (lab conditions)
sigs1=[synth(list(SP.values())[i%6]) for i in range(60)]
labs1=[i%6 for i in range(60)]
r1=field_test('Clean (lab)',sigs1,labs1,(20,30))

# Scenario 2: Noisy (wind + rain)
r2=field_test('Noisy (wind+rain)',sigs1,labs1,(3,10))

# Scenario 3: Mixed species (2 species overlapping)
sigs3=[]; labs3=[]
for i in range(60):
    sp1=i%6; sp2=(i+3)%6
    s1=synth(list(SP.values())[sp1]); s2=synth(list(SP.values())[sp2])*0.5
    sigs3.append(s1+s2); labs3.append(sp1)  # label is dominant species
r3=field_test('Mixed chorus',sigs3,labs3,(10,20))

# Scenario 4: Distant frogs (low amplitude)
sigs4=[synth(list(SP.values())[i%6])*0.1 for i in range(60)]
r4=field_test('Distant (low amp)',sigs4,labs4:=labs1,(8,15))

results = [r1, r2, r3, r4]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Accuracy comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = [r['name'] for r in results]
accs = [r['acc'] for r in results]
accs_conf = [r['acc_conf'] for r in results]
x = np.arange(len(results))
ax.bar(x-0.15, accs, 0.3, color='#3b82f6', label='All predictions', edgecolor='none')
ax.bar(x+0.15, accs_conf, 0.3, color='#22c55e', label='Confident only (>60%)', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(names, color='white', fontsize=8, rotation=15)
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Classifier performance across field conditions', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.1)

# Confidence distributions
ax = axes[0, 1]
ax.set_facecolor('#111827')
field_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for i, r in enumerate(results):
    ax.hist(r['confs'], bins=20, alpha=0.4, color=field_colors[i], label=r['name'], density=True)
ax.axvline(0.6, color='white', linestyle='--', label='Confidence threshold')
ax.set_xlabel('Classification confidence', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Confidence distributions by scenario', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Coverage vs accuracy trade-off
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i, r in enumerate(results):
    thresholds = np.linspace(0, 1, 50)
    t_accs, t_covs = [], []
    for th in thresholds:
        mask = r['confs'] >= th
        if mask.sum() > 0:
            t_accs.append(np.mean(r['preds'][mask]==r['true'][mask]))
            t_covs.append(mask.mean())
        else:
            t_accs.append(1.0); t_covs.append(0)
    ax.plot(t_covs, t_accs, color=field_colors[i], linewidth=2, label=r['name'])
ax.set_xlabel('Coverage (fraction classified)', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Accuracy-coverage trade-off', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Field deployment report
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
report = "FIELD DEPLOYMENT ASSESSMENT\\n"
report += "=" * 42 + "\\n\\n"
for r in results:
    report += f"{r['name']}:\\n"
    report += f"  Accuracy (all):      {r['acc']:.1%}\\n"
    report += f"  Accuracy (conf>60%): {r['acc_conf']:.1%}\\n"
    report += f"  Coverage:            {r['coverage']:.1%}\\n"
    report += f"  Mean confidence:     {r['mean_conf']:.2f}\\n\\n"
report += "RECOMMENDATION:\\n"
report += "Use confidence threshold 0.6\\n"
report += "Flag low-confidence for expert review\\n"
report += "Augment training with noisy data"
ax.text(0.05, 0.95, report, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print("CAPSTONE COMPLETE: Frog Call Identifier")
print("=" * 45)
for r in results:
    print(f"  {r['name']}: {r['acc']:.1%} (conf>60%: {r['acc_conf']:.1%}, coverage: {r['coverage']:.1%})")`,
      challenge: 'Implement noise-augmented training: add copies of each training sample with SNR=5dB, 10dB, and 15dB. Retrain the classifier and test on the noisy field scenarios. How much does noise augmentation improve field performance?',
      successHint: 'You have built a complete bioacoustic species identification pipeline from synthesis through field deployment. This exact workflow powers real conservation monitoring apps used by citizen scientists worldwide. Every frog call you classify is a data point for amphibian conservation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Frog Call Identifier
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (bioacoustics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete spectrogram-based species classifier in Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
