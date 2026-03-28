import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function ElephantLevel4() {
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
      title: 'Project Design: Elephant Rumble Classifier Pipeline',
      concept: `In Level 3 you learned feature engineering and train/test splits using elephant audio data. Now you build the complete system: a production-grade Elephant Rumble Classifier that takes raw audio and outputs a mood prediction with confidence scores.

Elephants produce at least six distinct vocalization types, each encoding emotional state: **rumbles** (contact, reassurance — low frequency 14-35 Hz), **trumpets** (excitement, alarm — broadband 300-3000 Hz), **roars** (aggression — mid-frequency with strong harmonics), **barks** (playfulness — short staccato bursts), **cries** (distress — high fundamental with wavering pitch), and **snorts** (contentment — broadband noise, no tonal structure).

Our classifier pipeline has four stages. First, **audio ingestion**: loading and preprocessing raw recordings (resampling, normalization, silence removal). Second, **feature extraction**: computing a feature vector from each clip using spectral, temporal, and cepstral features. Third, **classification**: training a model to map feature vectors to mood labels, with probability calibration. Fourth, **evaluation**: confusion matrix analysis, per-class precision/recall, and identification of failure modes. By the end of this capstone you will have a deployable system that a conservation team could use in the field.`,
      analogy: 'Building this classifier is like training a new field researcher to identify elephant moods. You do not just hand them a textbook — you play hundreds of recordings, teach them what to listen for (feature extraction), quiz them with clips they have never heard (train/test split), grade their answers (confusion matrix), and identify which calls they confuse most often (error analysis). Only after this full pipeline are they ready for fieldwork.',
      storyConnection: 'The girl who spoke to elephants had years of immersive experience to develop her intuition about elephant mood. Our classifier replicates that intuition computationally — extracting the same acoustic cues she uses (pitch, rhythm, intensity, timbre) and learning the same category boundaries. The difference is that our system can be deployed on dozens of monitoring stations simultaneously, scaling one person\'s expertise across an entire elephant corridor.',
      checkQuestion: 'Why do we need at least six mood categories rather than a simple binary "calm vs. agitated" classifier?',
      checkAnswer: 'Different moods require different conservation responses. A contact rumble (calm) needs no intervention. A distress cry requires immediate investigation. An aggression roar near a village border triggers a conflict-prevention protocol. A binary classifier would conflate alarm trumpets with playful barks, both being "agitated." Fine-grained classification enables fine-grained response — which is essential for effective wildlife management.',
      codeIntro: 'Define the six mood categories, generate synthetic audio for each, and build the feature extraction pipeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050  # sample rate
duration = 2.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# --- Define 6 elephant mood categories ---
MOODS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}

def generate_envelope(env_type, length):
    """Generate amplitude envelope for different call types."""
    t_env = np.linspace(0, 1, length)
    if env_type == 'sustained':
        return np.ones(length) * 0.8 + 0.2 * np.sin(2 * np.pi * 0.5 * t_env)
    elif env_type == 'attack':
        return np.exp(-3 * t_env) * (1 - np.exp(-50 * t_env))
    elif env_type == 'crescendo':
        return t_env ** 1.5
    elif env_type == 'staccato':
        return (np.sin(2 * np.pi * 4 * t_env) > 0).astype(float) * 0.8
    elif env_type == 'wavering':
        return 0.5 + 0.5 * np.sin(2 * np.pi * 3 * t_env)
    elif env_type == 'burst':
        return np.exp(-8 * t_env)
    return np.ones(length)

def synthesize_call(mood_name, sample_rate=22050, dur=2.0, variation=0.1):
    """Synthesize a realistic elephant call with random variation."""
    params = MOODS[mood_name]
    n = int(sample_rate * dur)
    t_local = np.linspace(0, dur, n, endpoint=False)

    # Frequency variation
    freq_var = 1 + np.random.uniform(-variation, variation)
    base_freq = params['freq'] * freq_var

    # Build tonal component
    signal = np.zeros(n)
    if base_freq > 0:
        signal += 0.6 * np.sin(2 * np.pi * base_freq * t_local)
        for i, h in enumerate(params['harmonics']):
            amp = 0.3 / (i + 1)
            signal += amp * np.sin(2 * np.pi * h * freq_var * t_local)

    # Add noise component
    signal += params['noise'] * np.random.randn(n)

    # Apply envelope
    envelope = generate_envelope(params['envelope'], n)
    signal *= envelope

    # Normalize
    peak = np.max(np.abs(signal))
    if peak > 0:
        signal = signal / peak * 0.9

    return signal

# --- Generate dataset: 50 samples per mood ---
samples_per_class = 50
X_raw = []
y_labels = []
mood_names = list(MOODS.keys())

for mood in mood_names:
    for _ in range(samples_per_class):
        clip = synthesize_call(mood, variation=0.15)
        X_raw.append(clip)
        y_labels.append(mood)

X_raw = np.array(X_raw)
y_labels = np.array(y_labels)
print(f"Dataset: {X_raw.shape[0]} clips, {X_raw.shape[1]} samples each")
print(f"Classes: {mood_names}")
print(f"Samples per class: {samples_per_class}")

# --- Visualize one example per mood ---
fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Elephant Vocalization Types — One Example Each',
             color='white', fontsize=14, fontweight='bold')

colors = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899']
for i, (mood, color) in enumerate(zip(mood_names, colors)):
    ax = axes.flat[i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    idx = i * samples_per_class  # first sample of each class
    ax.plot(t[:4000], X_raw[idx, :4000], color=color, linewidth=0.5)
    ax.set_title(mood.replace('_', ' ').title(), color='white', fontsize=10)
    ax.set_xlabel('Time (s)', color='white', fontsize=8)
    ax.set_ylabel('Amplitude', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print()
print("Pipeline stage 1 complete: audio synthesis and dataset creation.")
print("Each mood has distinct acoustic signatures visible in the waveforms.")
print("Next: extract numerical features from these raw waveforms.")`,
      challenge: 'Add a seventh mood category: "greeting_rumble" — similar to contact_rumble but with a rising pitch (frequency modulation). Synthesize it and visually confirm it looks different from the flat contact_rumble.',
      successHint: 'A well-defined taxonomy and realistic synthetic data are the foundation of any classification system. In real conservation work, these categories come from decades of ethological research. Your synthetic data captures the essential acoustic distinctions that a classifier needs to learn.',
    },
    {
      title: 'Feature Extraction: From Waveforms to Feature Vectors',
      concept: `Raw audio is too high-dimensional for direct classification. A 2-second clip at 22050 Hz contains 44,100 numbers. We need to compress this into a small, informative feature vector — typically 10-20 numbers that capture what matters about the sound.

The most powerful features for animal vocalization classification are:

**Spectral features** (what frequencies are present):
- **Spectral centroid**: center of mass of the frequency spectrum. Rumbles have low centroids (~30 Hz); trumpets have high centroids (~1000 Hz).
- **Spectral bandwidth**: spread of frequencies. Pure tones have narrow bandwidth; noisy calls have wide bandwidth.
- **Spectral rolloff**: frequency below which 85% of energy sits.

**Temporal features** (how the sound evolves over time):
- **RMS energy**: overall loudness of the signal.
- **Zero-crossing rate (ZCR)**: how often the signal crosses zero. High for noise, low for tonal sounds.
- **Envelope variance**: how much the amplitude changes over time. Staccato barks have high variance; sustained rumbles have low variance.

**Cepstral features** (compact representation of spectral shape):
- **MFCCs (Mel-Frequency Cepstral Coefficients)**: the standard feature for audio classification. They capture the shape of the spectral envelope on a perceptually-motivated frequency scale. We compute a simplified version using the DCT of the log-magnitude spectrum.

Together, these features create a compact "fingerprint" of each vocalization that a classifier can learn to distinguish.`,
      analogy: 'Feature extraction is like a wine sommelier describing a wine. They do not describe every molecule — they note color, aroma, body, tannins, acidity, finish. These six descriptors are enough to distinguish a Cabernet from a Pinot Noir. Our spectral features are the acoustic equivalent — a compact description that captures what makes each elephant call unique.',
      storyConnection: 'When the girl listened to the elephants, she did not process 22,050 air pressure measurements per second consciously. Her auditory system automatically extracted features: pitch (spectral centroid), loudness (RMS), roughness (bandwidth), and temporal pattern (envelope). Our feature extraction pipeline replicates this biological signal processing in code.',
      checkQuestion: 'Why would using only the spectral centroid be insufficient to distinguish a distress cry from a playful bark, even though they have different fundamental frequencies?',
      checkAnswer: 'Both calls have moderate fundamental frequencies (400-500 Hz), so their spectral centroids could overlap. The key difference is temporal: barks are staccato (high envelope variance, short bursts) while cries are wavering (sinusoidal amplitude modulation). You need temporal features like envelope variance and ZCR to separate them. This is why multi-dimensional feature vectors outperform any single feature.',
      codeIntro: 'Build a complete feature extraction pipeline computing 8 features per audio clip, then visualize the feature space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050
duration = 2.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# --- Mood definitions and synthesis (from Lesson 1) ---
MOODS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}
mood_names = list(MOODS.keys())

def generate_envelope(env_type, length):
    t_env = np.linspace(0, 1, length)
    if env_type == 'sustained': return np.ones(length) * 0.8 + 0.2 * np.sin(2*np.pi*0.5*t_env)
    elif env_type == 'attack': return np.exp(-3*t_env) * (1 - np.exp(-50*t_env))
    elif env_type == 'crescendo': return t_env ** 1.5
    elif env_type == 'staccato': return (np.sin(2*np.pi*4*t_env) > 0).astype(float) * 0.8
    elif env_type == 'wavering': return 0.5 + 0.5 * np.sin(2*np.pi*3*t_env)
    elif env_type == 'burst': return np.exp(-8*t_env)
    return np.ones(length)

def synthesize_call(mood_name, variation=0.15):
    params = MOODS[mood_name]
    n = int(sr * duration)
    t_local = np.linspace(0, duration, n, endpoint=False)
    freq_var = 1 + np.random.uniform(-variation, variation)
    base_freq = params['freq'] * freq_var
    signal = np.zeros(n)
    if base_freq > 0:
        signal += 0.6 * np.sin(2*np.pi*base_freq*t_local)
        for i, h in enumerate(params['harmonics']):
            signal += (0.3/(i+1)) * np.sin(2*np.pi*h*freq_var*t_local)
    signal += params['noise'] * np.random.randn(n)
    signal *= generate_envelope(params['envelope'], n)
    peak = np.max(np.abs(signal))
    if peak > 0: signal = signal / peak * 0.9
    return signal

# --- Feature extraction pipeline ---
def extract_features(signal, sample_rate=22050, frame_size=2048):
    """Extract 8 acoustic features from an audio signal."""
    # Spectral features (from middle frame)
    window = np.hanning(frame_size)
    start = len(signal) // 2 - frame_size // 2
    frame = signal[start:start+frame_size] * window
    spectrum = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(frame_size, d=1.0/sample_rate)

    spec_sum = np.sum(spectrum) + 1e-10
    p = spectrum / spec_sum

    centroid = np.sum(freqs * p)
    bandwidth = np.sqrt(np.sum(((freqs - centroid)**2) * p))
    cumulative = np.cumsum(spectrum)
    rolloff_idx = np.searchsorted(cumulative, 0.85 * cumulative[-1])
    rolloff = freqs[min(rolloff_idx, len(freqs)-1)]

    # Temporal features
    rms = np.sqrt(np.mean(signal**2))
    zcr = np.sum(np.abs(np.diff(np.sign(signal)))) / (2 * len(signal))

    # Envelope variance (amplitude modulation depth)
    frame_len = sample_rate // 10  # 100ms frames
    n_frames = len(signal) // frame_len
    frame_energies = [np.sqrt(np.mean(signal[i*frame_len:(i+1)*frame_len]**2))
                      for i in range(n_frames)]
    env_var = np.var(frame_energies) if len(frame_energies) > 1 else 0

    # Simplified MFCCs: DCT of log-magnitude spectrum (first 2 coefficients)
    log_spec = np.log(spectrum + 1e-10)
    n_coeffs = min(20, len(log_spec))
    dct_basis = np.cos(np.pi * np.arange(n_coeffs)[:, None] *
                       (np.arange(len(log_spec)) + 0.5) / len(log_spec))
    mfcc = dct_basis @ log_spec / len(log_spec)

    return np.array([centroid, bandwidth, rolloff, rms, zcr, env_var, mfcc[1], mfcc[2]])

FEATURE_NAMES = ['Centroid', 'Bandwidth', 'Rolloff', 'RMS', 'ZCR',
                 'EnvVar', 'MFCC1', 'MFCC2']

# --- Generate dataset and extract features ---
samples_per_class = 60
X_features = []
y_labels = []

for mood in mood_names:
    for _ in range(samples_per_class):
        clip = synthesize_call(mood)
        feat = extract_features(clip)
        X_features.append(feat)
        y_labels.append(mood)

X = np.array(X_features)
y = np.array(y_labels)

# Standardize features
X_mean = X.mean(axis=0)
X_std = X.std(axis=0) + 1e-10
X_norm = (X - X_mean) / X_std

print(f"Feature matrix: {X.shape} ({X.shape[0]} samples x {X.shape[1]} features)")
print(f"\\nFeature statistics:")
print(f"{'Feature':<12} {'Mean':>10} {'Std':>10} {'Min':>10} {'Max':>10}")
print("-" * 54)
for i, name in enumerate(FEATURE_NAMES):
    print(f"{name:<12} {X[:,i].mean():>10.3f} {X[:,i].std():>10.3f} "
          f"{X[:,i].min():>10.3f} {X[:,i].max():>10.3f}")

# --- Visualize feature distributions by mood ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Feature Distributions by Elephant Mood', color='white', fontsize=14, fontweight='bold')

colors = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899']
for i, (fname, ax) in enumerate(zip(FEATURE_NAMES, axes.flat)):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    for j, mood in enumerate(mood_names):
        mask = y == mood
        ax.hist(X_norm[mask, i], bins=15, alpha=0.5, color=colors[j],
                label=mood.split('_')[0] if i == 0 else '', edgecolor='none')
    ax.set_title(fname, color='white', fontsize=10)
    ax.set_xlabel('Standardized value', color='white', fontsize=8)

axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
plt.tight_layout()
plt.show()

print("\\nKey observations:")
print("- Centroid cleanly separates rumbles (low) from trumpets (high)")
print("- ZCR distinguishes tonal calls from noisy snorts")
print("- EnvVar separates staccato barks from sustained rumbles")
print("- No single feature separates ALL six classes — we need the full vector")`,
      challenge: 'Add spectral flatness as a 9th feature: the geometric mean of the spectrum divided by the arithmetic mean. This measures how "noise-like" vs "tonal" a sound is. Does it help distinguish content_snort from other categories?',
      successHint: 'Eight features compress 44,100 raw samples into 8 informative numbers — a 5,500x compression with minimal information loss for classification. The feature space visualization shows that moods cluster in distinct regions, which is exactly what a classifier needs.',
    },
    {
      title: 'Building the Classifier: K-Nearest Neighbors from Scratch',
      concept: `With features extracted, we need an algorithm that learns the mapping from feature vectors to mood labels. We will implement **K-Nearest Neighbors (KNN)** from scratch — it is conceptually simple but surprisingly effective, and understanding it deeply prepares you for more complex algorithms.

**How KNN works:**
1. Store all training examples (feature vectors + labels) in memory.
2. When a new sample arrives, compute its **distance** to every training example.
3. Find the **K closest** training examples (the "neighbors").
4. The predicted label is the **majority vote** among those K neighbors.
5. The **confidence** is the fraction of neighbors voting for the winning label.

**Key design decisions:**
- **Distance metric**: Euclidean distance is standard, but for audio features with different scales, we must standardize first. Manhattan distance (L1) is more robust to outliers.
- **K value**: Too small (K=1) overfits to noise — one mislabeled training example corrupts predictions. Too large (K=50) oversmooths — distant, irrelevant examples dilute the vote. Cross-validation finds the sweet spot.
- **Weighted voting**: Instead of equal votes, weight each neighbor by 1/distance — closer neighbors have more influence.

**Why KNN before neural networks?** KNN has zero training time, is fully interpretable (you can inspect which neighbors drove the decision), and requires no gradient descent. It is the ideal baseline classifier — if KNN works well, the features are good. If it fails, no algorithm will save bad features.`,
      analogy: 'KNN is like asking your neighbors for restaurant recommendations. If the 5 people closest to your house all recommend the same Thai place, it is probably good. But if you ask your 50 nearest neighbors (including people in the next town), their recommendations dilute into noise. K controls how local your polling is.',
      storyConnection: 'The girl who spoke to elephants learned by association. When she heard a new sound, she compared it to every sound she remembered (her "training set"), found the most similar ones, and concluded the new sound meant the same thing. This is exactly KNN — classify by similarity to stored examples. Her years of experience gave her a large, diverse training set.',
      checkQuestion: 'With K=1 and a training set containing one mislabeled example (a rumble accidentally labeled as a trumpet), what happens when a new rumble arrives that is closest to the mislabeled example?',
      checkAnswer: 'It gets classified as a trumpet — completely wrong. With K=1, a single mislabeled neighbor is fatal. With K=5, the four correctly-labeled rumble neighbors would outvote the one mislabeled example. This is why K>1 provides robustness to label noise. In field data, mislabeling is common (recorders malfunction, annotations are ambiguous), so robustness matters.',
      codeIntro: 'Implement KNN from scratch with distance-weighted voting, train/test split, and accuracy evaluation across different K values.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050; duration = 2.0

# --- Compact data generation (from Lessons 1-2) ---
MOODS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}
mood_names = list(MOODS.keys())

def gen_env(env_type, n):
    te = np.linspace(0,1,n)
    if env_type=='sustained': return np.ones(n)*0.8+0.2*np.sin(2*np.pi*0.5*te)
    if env_type=='attack': return np.exp(-3*te)*(1-np.exp(-50*te))
    if env_type=='crescendo': return te**1.5
    if env_type=='staccato': return (np.sin(2*np.pi*4*te)>0).astype(float)*0.8
    if env_type=='wavering': return 0.5+0.5*np.sin(2*np.pi*3*te)
    if env_type=='burst': return np.exp(-8*te)
    return np.ones(n)

def synth(mood, var=0.15):
    p=MOODS[mood]; n=int(sr*duration); tl=np.linspace(0,duration,n,endpoint=False)
    fv=1+np.random.uniform(-var,var); bf=p['freq']*fv; s=np.zeros(n)
    if bf>0:
        s+=0.6*np.sin(2*np.pi*bf*tl)
        for i,h in enumerate(p['harmonics']): s+=(0.3/(i+1))*np.sin(2*np.pi*h*fv*tl)
    s+=p['noise']*np.random.randn(n); s*=gen_env(p['envelope'],n)
    pk=np.max(np.abs(s)); return s/pk*0.9 if pk>0 else s

def extract_feat(sig):
    fs=2048; w=np.hanning(fs); st=len(sig)//2-fs//2
    fr=sig[st:st+fs]*w; sp=np.abs(np.fft.rfft(fr)); fq=np.fft.rfftfreq(fs,d=1.0/sr)
    ss=np.sum(sp)+1e-10; p=sp/ss
    cent=np.sum(fq*p); bw=np.sqrt(np.sum(((fq-cent)**2)*p))
    cum=np.cumsum(sp); ri=np.searchsorted(cum,0.85*cum[-1]); ro=fq[min(ri,len(fq)-1)]
    rms=np.sqrt(np.mean(sig**2)); zcr=np.sum(np.abs(np.diff(np.sign(sig))))/(2*len(sig))
    fl=sr//10; nf=len(sig)//fl
    ev=np.var([np.sqrt(np.mean(sig[i*fl:(i+1)*fl]**2)) for i in range(nf)]) if nf>1 else 0
    ls=np.log(sp+1e-10); nc=min(20,len(ls))
    dct=np.cos(np.pi*np.arange(nc)[:,None]*(np.arange(len(ls))+0.5)/len(ls))
    mfcc=dct@ls/len(ls)
    return np.array([cent,bw,ro,rms,zcr,ev,mfcc[1],mfcc[2]])

# Generate data
spc = 60
X_all, y_all = [], []
for mood in mood_names:
    for _ in range(spc):
        X_all.append(extract_feat(synth(mood)))
        y_all.append(mood)
X_all = np.array(X_all); y_all = np.array(y_all)

# Standardize
mu, sigma = X_all.mean(0), X_all.std(0)+1e-10
X_norm = (X_all - mu) / sigma

# --- Train/test split ---
idx = np.random.permutation(len(X_norm))
split = int(0.75 * len(idx))
X_train, X_test = X_norm[idx[:split]], X_norm[idx[split:]]
y_train, y_test = y_all[idx[:split]], y_all[idx[split:]]

print(f"Train: {len(X_train)} samples | Test: {len(X_test)} samples")

# --- KNN from scratch ---
class KNNClassifier:
    def __init__(self, k=5, weighted=True):
        self.k = k
        self.weighted = weighted
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        self.X_train = X.copy()
        self.y_train = y.copy()
        return self

    def predict_one(self, x):
        dists = np.sqrt(np.sum((self.X_train - x)**2, axis=1))
        nn_idx = np.argsort(dists)[:self.k]
        nn_labels = self.y_train[nn_idx]
        nn_dists = dists[nn_idx]

        # Weighted voting
        votes = {}
        for label, d in zip(nn_labels, nn_dists):
            w = 1.0 / (d + 1e-10) if self.weighted else 1.0
            votes[label] = votes.get(label, 0) + w

        winner = max(votes, key=votes.get)
        confidence = votes[winner] / sum(votes.values())
        return winner, confidence

    def predict(self, X):
        preds, confs = [], []
        for x in X:
            p, c = self.predict_one(x)
            preds.append(p)
            confs.append(c)
        return np.array(preds), np.array(confs)

    def score(self, X, y):
        preds, _ = self.predict(X)
        return np.mean(preds == y)

# --- Find optimal K ---
k_values = [1, 3, 5, 7, 9, 11, 15, 21]
train_scores, test_scores = [], []

for k in k_values:
    knn = KNNClassifier(k=k).fit(X_train, y_train)
    train_scores.append(knn.score(X_train, y_train))
    test_scores.append(knn.score(X_test, y_test))

best_k = k_values[np.argmax(test_scores)]
best_acc = max(test_scores)

# --- Plot K vs accuracy ---
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827'); ax1.tick_params(colors='gray')
ax1.plot(k_values, train_scores, 'o-', color='#3b82f6', linewidth=2, label='Train')
ax1.plot(k_values, test_scores, 's-', color='#ef4444', linewidth=2, label='Test')
ax1.axvline(best_k, color='#22c55e', linestyle='--', alpha=0.7, label=f'Best K={best_k}')
ax1.set_xlabel('K (number of neighbors)', color='white')
ax1.set_ylabel('Accuracy', color='white')
ax1.set_title('KNN: Training vs Test Accuracy', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.set_ylim(0.5, 1.05)

# --- 2D projection of test predictions ---
knn_best = KNNClassifier(k=best_k).fit(X_train, y_train)
preds, confs = knn_best.predict(X_test)

ax2.set_facecolor('#111827'); ax2.tick_params(colors='gray')
colors_map = {m: c for m, c in zip(mood_names, ['#22c55e','#ef4444','#f59e0b','#3b82f6','#a855f7','#ec4899'])}
for mood in mood_names:
    mask = y_test == mood
    correct = preds[mask] == y_test[mask]
    ax2.scatter(X_test[mask, 0], X_test[mask, 4], c=[colors_map[mood]],
               marker='o' if True else 'x', alpha=0.7, s=30,
               label=mood.split('_')[0])
    wrong = ~correct
    if np.any(wrong):
        ax2.scatter(X_test[mask][wrong, 0], X_test[mask][wrong, 4],
                   facecolors='none', edgecolors='white', s=100, linewidth=2)

ax2.set_xlabel('Centroid (standardized)', color='white')
ax2.set_ylabel('ZCR (standardized)', color='white')
ax2.set_title(f'Test Set Predictions (K={best_k}) — circles=misclassified', color='white', fontsize=11)
ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"\\nBest K={best_k}, Test accuracy={best_acc:.1%}")
print(f"Train accuracy at best K: {train_scores[k_values.index(best_k)]:.1%}")
print(f"Gap indicates {'some overfitting' if train_scores[k_values.index(best_k)] - best_acc > 0.05 else 'good generalization'}")`,
      challenge: 'Implement Manhattan distance (L1 norm) as an alternative to Euclidean distance. Compare test accuracy. Which works better for this dataset, and why might that be?',
      successHint: 'KNN is the ultimate interpretable baseline. When it achieves high accuracy, it proves the features are well-separated. When it fails, it tells you exactly where — you can inspect the misclassified neighbors to understand confusion patterns.',
    },
    {
      title: 'Confusion Matrix Analysis: Understanding Failure Modes',
      concept: `Overall accuracy is a dangerous metric. A classifier that is 90% accurate sounds great — but what if it never detects distress calls? In conservation, missing a distress call could mean an injured elephant goes unrescued. Missing an aggression warning near a village could mean a deadly human-elephant conflict.

The **confusion matrix** reveals what accuracy hides. It is an N x N grid where rows represent true labels and columns represent predicted labels. Each cell (i, j) counts how many samples with true label i were predicted as label j. The diagonal shows correct predictions; off-diagonal cells show errors.

From the confusion matrix, we compute **per-class metrics**:
- **Precision** for class C: of all samples PREDICTED as C, what fraction truly are C? Low precision means many false alarms.
- **Recall** for class C: of all samples that truly ARE C, what fraction were correctly predicted? Low recall means many missed detections.
- **F1 score**: harmonic mean of precision and recall — balances both.

In conservation, recall for distress_cry and aggression_roar matters more than precision — you would rather investigate a false alarm than miss a real emergency. This is called **asymmetric cost**, and it changes how you evaluate and tune the classifier.`,
      analogy: 'A confusion matrix is like a teacher reviewing exam answers category by category. Instead of saying "the class got 85% overall," the teacher notes: "everyone got algebra right, but 40% confused sine and cosine, and nobody could do integration." That detailed breakdown reveals exactly where to focus remedial teaching — which is much more useful than the aggregate score.',
      storyConnection: 'If the girl who spoke to elephants confused a distress cry with a playful bark, the consequences would be severe — she might ignore a calf in danger. The confusion matrix quantifies exactly this risk: how often does the system confuse safety-critical categories? In her case, years of practice drove the confusion rate to near zero. Our classifier aims for the same reliability.',
      checkQuestion: 'A classifier has 95% recall for alarm_trumpet but only 60% precision. What does this mean in practice for a ranger station receiving alerts?',
      checkAnswer: 'The ranger station catches 95% of real alarm trumpets (high recall — very few emergencies are missed). But 40% of the alerts it sends are false alarms (low precision — other sounds misclassified as trumpets). The rangers would be dispatched frequently for non-emergencies, leading to alert fatigue. The fix is either better features to reduce false positives, or a confirmation step where a second model verifies the alert.',
      codeIntro: 'Build a full confusion matrix analysis with per-class precision, recall, F1, and a visual heatmap identifying the most-confused pairs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050; duration = 2.0

# --- Compact pipeline (from Lessons 1-3) ---
MOODS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}
mood_names = list(MOODS.keys())
short_names = ['Rumble', 'Trumpet', 'Roar', 'Bark', 'Cry', 'Snort']

def gen_env(et, n):
    te=np.linspace(0,1,n)
    if et=='sustained': return np.ones(n)*0.8+0.2*np.sin(2*np.pi*0.5*te)
    if et=='attack': return np.exp(-3*te)*(1-np.exp(-50*te))
    if et=='crescendo': return te**1.5
    if et=='staccato': return (np.sin(2*np.pi*4*te)>0).astype(float)*0.8
    if et=='wavering': return 0.5+0.5*np.sin(2*np.pi*3*te)
    if et=='burst': return np.exp(-8*te)
    return np.ones(n)

def synth(mood, var=0.15):
    p=MOODS[mood]; n=int(sr*duration); tl=np.linspace(0,duration,n,endpoint=False)
    fv=1+np.random.uniform(-var,var); bf=p['freq']*fv; s=np.zeros(n)
    if bf>0:
        s+=0.6*np.sin(2*np.pi*bf*tl)
        for i,h in enumerate(p['harmonics']): s+=(0.3/(i+1))*np.sin(2*np.pi*h*fv*tl)
    s+=p['noise']*np.random.randn(n); s*=gen_env(p['envelope'],n)
    pk=np.max(np.abs(s)); return s/pk*0.9 if pk>0 else s

def extract_feat(sig):
    fs=2048; w=np.hanning(fs); st=len(sig)//2-fs//2
    fr=sig[st:st+fs]*w; sp=np.abs(np.fft.rfft(fr)); fq=np.fft.rfftfreq(fs,d=1.0/sr)
    ss=np.sum(sp)+1e-10; p=sp/ss
    cent=np.sum(fq*p); bw=np.sqrt(np.sum(((fq-cent)**2)*p))
    cum=np.cumsum(sp); ri=np.searchsorted(cum,0.85*cum[-1]); ro=fq[min(ri,len(fq)-1)]
    rms=np.sqrt(np.mean(sig**2)); zcr=np.sum(np.abs(np.diff(np.sign(sig))))/(2*len(sig))
    fl=sr//10; nf=len(sig)//fl
    ev=np.var([np.sqrt(np.mean(sig[i*fl:(i+1)*fl]**2)) for i in range(nf)]) if nf>1 else 0
    ls=np.log(sp+1e-10); nc=min(20,len(ls))
    dct=np.cos(np.pi*np.arange(nc)[:,None]*(np.arange(len(ls))+0.5)/len(ls))
    mfcc=dct@ls/len(ls)
    return np.array([cent,bw,ro,rms,zcr,ev,mfcc[1],mfcc[2]])

# Generate dataset
spc = 60
X, y = [], []
for mood in mood_names:
    for _ in range(spc): X.append(extract_feat(synth(mood))); y.append(mood)
X = np.array(X); y = np.array(y)
mu, sigma = X.mean(0), X.std(0)+1e-10; X = (X-mu)/sigma

# Train/test split
idx = np.random.permutation(len(X)); split = int(0.75*len(idx))
X_tr, X_te = X[idx[:split]], X[idx[split:]]
y_tr, y_te = y[idx[:split]], y[idx[split:]]

# KNN prediction
def knn_predict(X_tr, y_tr, X_te, k=5):
    preds = []
    for x in X_te:
        d = np.sqrt(np.sum((X_tr-x)**2, axis=1))
        nn = np.argsort(d)[:k]
        votes = {}
        for lb, di in zip(y_tr[nn], d[nn]):
            votes[lb] = votes.get(lb, 0) + 1.0/(di+1e-10)
        preds.append(max(votes, key=votes.get))
    return np.array(preds)

preds = knn_predict(X_tr, y_tr, X_te, k=5)

# --- Build confusion matrix ---
n_classes = len(mood_names)
cm = np.zeros((n_classes, n_classes), dtype=int)
for true, pred in zip(y_te, preds):
    i = mood_names.index(true)
    j = mood_names.index(pred)
    cm[i, j] += 1

# Per-class metrics
precision = np.zeros(n_classes)
recall = np.zeros(n_classes)
f1 = np.zeros(n_classes)

for i in range(n_classes):
    tp = cm[i, i]
    fp = cm[:, i].sum() - tp
    fn = cm[i, :].sum() - tp
    precision[i] = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall[i] = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1[i] = 2 * precision[i] * recall[i] / (precision[i] + recall[i]) if (precision[i] + recall[i]) > 0 else 0

# --- Visualization ---
fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.patch.set_facecolor('#1f2937')

# Confusion matrix heatmap
ax = axes[0]
ax.set_facecolor('#111827')
im = ax.imshow(cm, cmap='YlOrRd', aspect='auto')
ax.set_xticks(range(n_classes)); ax.set_yticks(range(n_classes))
ax.set_xticklabels(short_names, rotation=45, ha='right', color='white', fontsize=9)
ax.set_yticklabels(short_names, color='white', fontsize=9)
ax.set_xlabel('Predicted', color='white', fontsize=11)
ax.set_ylabel('True', color='white', fontsize=11)
ax.set_title('Confusion Matrix', color='white', fontsize=13, fontweight='bold')

for i in range(n_classes):
    for j in range(n_classes):
        val = cm[i, j]
        color = 'white' if val > cm.max()/2 else 'black'
        ax.text(j, i, str(val), ha='center', va='center', color=color, fontsize=11, fontweight='bold')

# Per-class metrics bar chart
ax = axes[1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
x_pos = np.arange(n_classes)
w = 0.25
ax.bar(x_pos - w, precision, w, color='#3b82f6', label='Precision')
ax.bar(x_pos, recall, w, color='#22c55e', label='Recall')
ax.bar(x_pos + w, f1, w, color='#f59e0b', label='F1')
ax.set_xticks(x_pos)
ax.set_xticklabels(short_names, rotation=45, ha='right', color='white', fontsize=9)
ax.set_ylabel('Score', color='white')
ax.set_title('Per-Class Precision, Recall, F1', color='white', fontsize=13, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.15)

# Add values on bars
for i in range(n_classes):
    ax.text(i-w, precision[i]+0.02, f'{precision[i]:.2f}', ha='center', color='#3b82f6', fontsize=7)
    ax.text(i, recall[i]+0.02, f'{recall[i]:.2f}', ha='center', color='#22c55e', fontsize=7)
    ax.text(i+w, f1[i]+0.02, f'{f1[i]:.2f}', ha='center', color='#f59e0b', fontsize=7)

plt.tight_layout()
plt.show()

# Print detailed report
overall_acc = np.trace(cm) / cm.sum()
print(f"Overall accuracy: {overall_acc:.1%}")
print(f"\\nPer-class report:")
print(f"{'Class':<20} {'Precision':>10} {'Recall':>10} {'F1':>10} {'Support':>10}")
print("-" * 62)
for i, name in enumerate(mood_names):
    print(f"{name:<20} {precision[i]:>10.3f} {recall[i]:>10.3f} {f1[i]:>10.3f} {cm[i,:].sum():>10d}")

# Find most confused pairs
print(f"\\nMost confused pairs:")
cm_off = cm.copy(); np.fill_diagonal(cm_off, 0)
for _ in range(3):
    i, j = np.unravel_index(cm_off.argmax(), cm_off.shape)
    if cm_off[i,j] > 0:
        print(f"  {mood_names[i]} -> {mood_names[j]}: {cm_off[i,j]} misclassifications")
        cm_off[i,j] = 0`,
      challenge: 'Compute a "conservation risk score" by weighting misclassifications asymmetrically: confusing distress_cry or aggression_roar with a benign class costs 10x more than other errors. Report the weighted error rate alongside the unweighted one.',
      successHint: 'The confusion matrix is the most important evaluation tool in applied ML. It reveals not just how often the model is wrong, but HOW it is wrong — which errors are dangerous, which are benign, and where to focus improvement efforts.',
    },
    {
      title: 'Cross-Validation and Model Comparison',
      concept: `A single train/test split gives you one number. But how reliable is that number? If you happened to put all the easy examples in the test set, accuracy looks inflated. If all the hard examples landed there, accuracy looks deflated. You need to measure **stability**.

**K-fold cross-validation** solves this:
1. Shuffle the data and split it into K equal folds (e.g., K=5).
2. For each fold i: train on all folds EXCEPT i, test on fold i.
3. You get K accuracy scores. Report the **mean** and **standard deviation**.
4. The mean estimates true performance; the std tells you how much it varies.

This also enables fair **model comparison**. To compare KNN vs a different classifier, run both through the same K folds. The model with higher mean accuracy (or F1) wins — but only if the difference exceeds the standard deviation. A difference of 1% with std=5% is meaningless; a difference of 8% with std=2% is significant.

We will also implement a simple **centroid classifier** as a second model: compute the mean feature vector for each class in the training set, then classify new samples by nearest centroid. It is much faster than KNN (no need to store all training data) but less flexible (assumes spherical class boundaries).`,
      analogy: 'K-fold cross-validation is like testing a student with 5 different exams instead of one. If they score 90, 88, 92, 87, 91, you are confident they are an A student (mean=89.6, low variance). If they score 95, 60, 85, 40, 90, the average is 74 but the variance is huge — their performance is unstable and you cannot trust the mean alone.',
      storyConnection: 'The girl who spoke to elephants was "tested" every day by different herds in different conditions — monsoon rain muffling sounds, dense forest absorbing frequencies, multiple elephants vocalizing simultaneously. Each day was a different "fold." Her consistent accuracy across these varied conditions proved she had truly learned, not just memorized.',
      checkQuestion: 'You run 5-fold CV and get test accuracies of [92%, 55%, 91%, 90%, 89%]. What does the outlier fold (55%) suggest?',
      checkAnswer: 'One fold contains a cluster of data that is fundamentally different from the rest — perhaps recordings made with a different microphone, in different weather, or of an elephant subspecies not well-represented in other folds. This is a data quality issue, not a model issue. You should investigate fold 2 to understand why it is so different, and potentially stratify your splits to ensure each fold has representative diversity.',
      codeIntro: 'Implement K-fold cross-validation, compare KNN vs centroid classifier, and visualize performance stability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050; duration = 2.0

# --- Compact pipeline (reused from earlier lessons) ---
MOODS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}
mood_names = list(MOODS.keys())
short_names = ['Rumble', 'Trumpet', 'Roar', 'Bark', 'Cry', 'Snort']

def gen_env(et, n):
    te=np.linspace(0,1,n)
    envs = {'sustained': lambda: np.ones(n)*0.8+0.2*np.sin(2*np.pi*0.5*te),
            'attack': lambda: np.exp(-3*te)*(1-np.exp(-50*te)),
            'crescendo': lambda: te**1.5,
            'staccato': lambda: (np.sin(2*np.pi*4*te)>0).astype(float)*0.8,
            'wavering': lambda: 0.5+0.5*np.sin(2*np.pi*3*te),
            'burst': lambda: np.exp(-8*te)}
    return envs.get(et, lambda: np.ones(n))()

def synth(mood, var=0.15):
    p=MOODS[mood]; n=int(sr*duration); tl=np.linspace(0,duration,n,endpoint=False)
    fv=1+np.random.uniform(-var,var); bf=p['freq']*fv; s=np.zeros(n)
    if bf>0:
        s+=0.6*np.sin(2*np.pi*bf*tl)
        for i,h in enumerate(p['harmonics']): s+=(0.3/(i+1))*np.sin(2*np.pi*h*fv*tl)
    s+=p['noise']*np.random.randn(n); s*=gen_env(p['envelope'],n)
    pk=np.max(np.abs(s)); return s/pk*0.9 if pk>0 else s

def extract_feat(sig):
    fs=2048; w=np.hanning(fs); st=len(sig)//2-fs//2
    fr=sig[st:st+fs]*w; sp=np.abs(np.fft.rfft(fr)); fq=np.fft.rfftfreq(fs,d=1.0/sr)
    ss=np.sum(sp)+1e-10; p=sp/ss
    cent=np.sum(fq*p); bw=np.sqrt(np.sum(((fq-cent)**2)*p))
    cum=np.cumsum(sp); ri=np.searchsorted(cum,0.85*cum[-1]); ro=fq[min(ri,len(fq)-1)]
    rms=np.sqrt(np.mean(sig**2)); zcr=np.sum(np.abs(np.diff(np.sign(sig))))/(2*len(sig))
    fl=sr//10; nf=len(sig)//fl
    ev=np.var([np.sqrt(np.mean(sig[i*fl:(i+1)*fl]**2)) for i in range(nf)]) if nf>1 else 0
    ls=np.log(sp+1e-10); nc=min(20,len(ls))
    dct=np.cos(np.pi*np.arange(nc)[:,None]*(np.arange(len(ls))+0.5)/len(ls))
    mfcc=dct@ls/len(ls)
    return np.array([cent,bw,ro,rms,zcr,ev,mfcc[1],mfcc[2]])

# Generate full dataset
spc = 60
X, y = [], []
for mood in mood_names:
    for _ in range(spc): X.append(extract_feat(synth(mood))); y.append(mood)
X = np.array(X); y = np.array(y)
mu, sigma = X.mean(0), X.std(0)+1e-10; X = (X-mu)/sigma

# --- Classifiers ---
def knn_predict(X_tr, y_tr, X_te, k=5):
    preds = []
    for x in X_te:
        d = np.sqrt(np.sum((X_tr-x)**2, axis=1))
        nn = np.argsort(d)[:k]
        votes = {}
        for lb, di in zip(y_tr[nn], d[nn]):
            votes[lb] = votes.get(lb, 0) + 1.0/(di+1e-10)
        preds.append(max(votes, key=votes.get))
    return np.array(preds)

def centroid_predict(X_tr, y_tr, X_te):
    """Nearest centroid classifier."""
    centroids = {}
    for mood in mood_names:
        mask = y_tr == mood
        centroids[mood] = X_tr[mask].mean(axis=0)
    preds = []
    for x in X_te:
        dists = {m: np.sqrt(np.sum((x - c)**2)) for m, c in centroids.items()}
        preds.append(min(dists, key=dists.get))
    return np.array(preds)

# --- K-fold cross-validation ---
n_folds = 5
idx = np.random.permutation(len(X))
fold_size = len(X) // n_folds
folds = [idx[i*fold_size:(i+1)*fold_size] for i in range(n_folds)]

knn_scores = []
centroid_scores = []
knn_f1s = []
centroid_f1s = []

for fold_i in range(n_folds):
    test_idx = folds[fold_i]
    train_idx = np.concatenate([folds[j] for j in range(n_folds) if j != fold_i])

    X_tr, X_te = X[train_idx], X[test_idx]
    y_tr, y_te = y[train_idx], y[test_idx]

    # KNN
    knn_preds = knn_predict(X_tr, y_tr, X_te, k=5)
    knn_acc = np.mean(knn_preds == y_te)
    knn_scores.append(knn_acc)

    # Centroid
    cent_preds = centroid_predict(X_tr, y_tr, X_te)
    cent_acc = np.mean(cent_preds == y_te)
    centroid_scores.append(cent_acc)

    # Macro F1 for each
    for preds_arr, f1_list in [(knn_preds, knn_f1s), (cent_preds, centroid_f1s)]:
        f1s = []
        for mood in mood_names:
            tp = np.sum((preds_arr == mood) & (y_te == mood))
            fp = np.sum((preds_arr == mood) & (y_te != mood))
            fn = np.sum((preds_arr != mood) & (y_te == mood))
            prec = tp/(tp+fp) if (tp+fp)>0 else 0
            rec = tp/(tp+fn) if (tp+fn)>0 else 0
            f1s.append(2*prec*rec/(prec+rec) if (prec+rec)>0 else 0)
        f1_list.append(np.mean(f1s))

# --- Visualization ---
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# Fold-by-fold accuracy
ax = axes[0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
x = np.arange(n_folds)
ax.bar(x-0.15, knn_scores, 0.3, color='#3b82f6', label='KNN (k=5)')
ax.bar(x+0.15, centroid_scores, 0.3, color='#f59e0b', label='Centroid')
ax.set_xticks(x); ax.set_xticklabels([f'Fold {i+1}' for i in range(n_folds)], color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Accuracy per Fold', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0.5, 1.05)

# Summary statistics
ax = axes[1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
models = ['KNN (k=5)', 'Centroid']
means = [np.mean(knn_scores), np.mean(centroid_scores)]
stds = [np.std(knn_scores), np.std(centroid_scores)]
f1_means = [np.mean(knn_f1s), np.mean(centroid_f1s)]

bars = ax.bar([0, 1], means, yerr=stds, capsize=8, color=['#3b82f6', '#f59e0b'],
              edgecolor='white', linewidth=1)
ax.scatter([0, 1], f1_means, color='#ef4444', s=100, zorder=5, marker='D', label='Macro F1')
ax.set_xticks([0, 1]); ax.set_xticklabels(models, color='white')
ax.set_ylabel('Score', color='white')
ax.set_title('CV Summary (mean +/- std)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0.5, 1.1)

for i, (m, s) in enumerate(zip(means, stds)):
    ax.text(i, m+s+0.02, f'{m:.1%} +/- {s:.1%}', ha='center', color='white', fontsize=9)

# Stability comparison
ax = axes[2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.boxplot([knn_scores, centroid_scores], labels=models,
           boxprops=dict(color='white'), whiskerprops=dict(color='white'),
           medianprops=dict(color='#22c55e', linewidth=2),
           capprops=dict(color='white'), flierprops=dict(markeredgecolor='white'))
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Performance Stability', color='white', fontsize=12, fontweight='bold')
ax.tick_params(axis='x', colors='white')

plt.tight_layout()
plt.show()

print(f"5-Fold Cross-Validation Results:")
print(f"{'Model':<15} {'Mean Acc':>10} {'Std':>8} {'Mean F1':>10}")
print("-" * 45)
print(f"{'KNN (k=5)':<15} {np.mean(knn_scores):>10.1%} {np.std(knn_scores):>8.1%} {np.mean(knn_f1s):>10.3f}")
print(f"{'Centroid':<15} {np.mean(centroid_scores):>10.1%} {np.std(centroid_scores):>8.1%} {np.mean(centroid_f1s):>10.3f}")

winner = 'KNN' if np.mean(knn_scores) > np.mean(centroid_scores) else 'Centroid'
diff = abs(np.mean(knn_scores) - np.mean(centroid_scores))
max_std = max(np.std(knn_scores), np.std(centroid_scores))
sig = "statistically meaningful" if diff > max_std else "within noise — not significant"
print(f"\\nWinner: {winner} (difference: {diff:.1%}, {sig})")`,
      challenge: 'Add a third classifier: "random forest lite" — train 10 KNN classifiers, each using a random subset of 5 features (out of 8), and combine their predictions by majority vote. Does this ensemble beat both KNN and centroid?',
      successHint: 'Cross-validation transforms a single unreliable number into a distribution of scores. The mean tells you expected performance; the standard deviation tells you how much to trust it. Fair model comparison requires the same folds for all models.',
    },
    {
      title: 'Deployment: Complete Elephant Rumble Classifier',
      concept: `The final step is packaging everything into a clean, deployable system. A conservation team does not want to run six Jupyter notebooks — they want a single class they can instantiate and call: \`classifier.predict(audio_clip)\` returning a mood label and confidence score.

Our deployed system needs:
- **Clean API**: one method to train, one to predict, one to evaluate.
- **Input validation**: handle wrong sample rates, clipped audio, silence, and impossibly short clips.
- **Confidence thresholds**: if confidence is below a threshold (e.g., 70%), return "uncertain" rather than guessing. False confidence is worse than admitted uncertainty.
- **Calibrated probabilities**: the confidence scores should match reality — when the system says "80% confident," it should be correct 80% of the time.
- **Logging**: record every prediction with timestamp, features, confidence, and the raw audio fingerprint for later auditing.
- **Performance summary**: a comprehensive report covering accuracy, per-class metrics, confusion patterns, and known limitations.

This lesson builds the complete, documented, validated classifier as a Python class with all these production features.`,
      analogy: 'Deploying a classifier is like graduating from medical school and opening a practice. The student (model) has been trained and tested. But running a practice requires more: patient intake forms (input validation), triage (confidence thresholds), medical records (logging), malpractice awareness (known limitations), and clear communication with patients (interpretable outputs). The diagnosis skill alone is not enough.',
      storyConnection: 'The girl who spoke to elephants eventually trained others in her skill — she did not just understand elephants herself, she created a teachable, transferable system. Our deployed classifier does the same: it encapsulates years of acoustic research into a tool that any ranger, regardless of experience, can use to interpret elephant vocalizations. Scaling expertise through technology is the ultimate conservation multiplier.',
      checkQuestion: 'A ranger receives a prediction: "aggression_roar, confidence 52%." Should the system trigger an alert? What design decision must you make?',
      checkAnswer: 'At 52% confidence the system is barely better than random for a 6-class problem (where random is 17%). For safety-critical categories like aggression, you might set a lower alert threshold (e.g., 40%) than for non-critical ones (e.g., 70% for content_snort). The design decision is: define per-class confidence thresholds based on the cost of false negatives vs false positives for each category. Missing real aggression is much costlier than a false alarm.',
      codeIntro: 'Build the final polished Elephant Rumble Classifier with a clean API, input validation, confidence calibration, and a comprehensive demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ================================================================
# ELEPHANT RUMBLE CLASSIFIER — Final Deployed Version
# ================================================================
# A complete ML pipeline for classifying elephant vocalizations
# into 6 mood categories from raw audio signals.
#
# Based on: spectral analysis, temporal features, MFCCs, KNN
#
# Limitations:
#   - Trained on synthetic audio (real deployment needs real recordings)
#   - Single-channel mono audio only
#   - Assumes low background noise
#   - KNN scales linearly with training set size
# ================================================================

class ElephantRumbleClassifier:
    """Classify elephant vocalizations into mood categories.

    Usage:
        clf = ElephantRumbleClassifier()
        clf.train(audio_clips, labels)
        result = clf.predict(new_clip)
    """

    MOOD_CATEGORIES = [
        'contact_rumble', 'alarm_trumpet', 'aggression_roar',
        'playful_bark', 'distress_cry', 'content_snort'
    ]

    SAFETY_CRITICAL = {'alarm_trumpet', 'aggression_roar', 'distress_cry'}

    FEATURE_NAMES = ['Centroid', 'Bandwidth', 'Rolloff', 'RMS',
                     'ZCR', 'EnvVar', 'MFCC1', 'MFCC2']

    def __init__(self, k=5, confidence_threshold=0.6, sample_rate=22050):
        self.k = k
        self.confidence_threshold = confidence_threshold
        self.sr = sample_rate
        self.X_train = None
        self.y_train = None
        self.mu = None
        self.sigma = None
        self.is_trained = False

    def _validate_audio(self, signal):
        """Validate and preprocess audio input."""
        warnings = []
        if len(signal) < self.sr * 0.1:
            warnings.append("Clip too short (<0.1s) — unreliable features")
        rms = np.sqrt(np.mean(signal**2))
        if rms < 0.001:
            warnings.append("Near-silent audio — may be noise only")
        if np.max(np.abs(signal)) > 0.99:
            warnings.append("Audio appears clipped — peak limiting detected")
        # Normalize
        peak = np.max(np.abs(signal))
        if peak > 0:
            signal = signal / peak * 0.9
        return signal, warnings

    def _extract_features(self, signal):
        """Extract 8 acoustic features from a signal."""
        fs = 2048; w = np.hanning(fs)
        st = max(0, len(signal)//2 - fs//2)
        end = min(len(signal), st + fs)
        frame = np.zeros(fs)
        frame[:end-st] = signal[st:end]
        frame[:fs] *= w

        sp = np.abs(np.fft.rfft(frame))
        fq = np.fft.rfftfreq(fs, d=1.0/self.sr)
        ss = np.sum(sp) + 1e-10; p = sp / ss

        centroid = np.sum(fq * p)
        bandwidth = np.sqrt(np.sum(((fq - centroid)**2) * p))
        cum = np.cumsum(sp)
        ri = np.searchsorted(cum, 0.85 * cum[-1])
        rolloff = fq[min(ri, len(fq)-1)]
        rms = np.sqrt(np.mean(signal**2))
        zcr = np.sum(np.abs(np.diff(np.sign(signal)))) / (2*len(signal))

        fl = self.sr // 10; nf = len(signal) // fl
        ev = np.var([np.sqrt(np.mean(signal[i*fl:(i+1)*fl]**2))
                     for i in range(nf)]) if nf > 1 else 0

        ls = np.log(sp + 1e-10); nc = min(20, len(ls))
        dct = np.cos(np.pi*np.arange(nc)[:,None] *
                     (np.arange(len(ls))+0.5)/len(ls))
        mfcc = dct @ ls / len(ls)

        return np.array([centroid, bandwidth, rolloff, rms, zcr, ev, mfcc[1], mfcc[2]])

    def train(self, audio_clips, labels):
        """Train the classifier on a set of audio clips and labels."""
        features = np.array([self._extract_features(clip) for clip in audio_clips])
        self.mu = features.mean(axis=0)
        self.sigma = features.std(axis=0) + 1e-10
        self.X_train = (features - self.mu) / self.sigma
        self.y_train = np.array(labels)
        self.is_trained = True
        return self

    def predict(self, signal):
        """Predict mood from a single audio clip.

        Returns:
            dict with 'mood', 'confidence', 'probabilities', 'warnings',
                       'is_safety_critical', 'features'
        """
        assert self.is_trained, "Classifier not trained. Call train() first."

        signal, warnings = self._validate_audio(signal)
        feat = self._extract_features(signal)
        feat_norm = (feat - self.mu) / self.sigma

        # KNN with distance weighting
        dists = np.sqrt(np.sum((self.X_train - feat_norm)**2, axis=1))
        nn_idx = np.argsort(dists)[:self.k]

        votes = {}
        for label, d in zip(self.y_train[nn_idx], dists[nn_idx]):
            votes[label] = votes.get(label, 0) + 1.0/(d + 1e-10)

        total = sum(votes.values())
        probs = {m: votes.get(m, 0)/total for m in self.MOOD_CATEGORIES}

        winner = max(probs, key=probs.get)
        confidence = probs[winner]

        if confidence < self.confidence_threshold:
            mood = 'uncertain'
            warnings.append(f"Low confidence ({confidence:.0%}) — below threshold ({self.confidence_threshold:.0%})")
        else:
            mood = winner

        return {
            'mood': mood,
            'confidence': round(confidence, 4),
            'probabilities': {k: round(v, 4) for k, v in sorted(probs.items(), key=lambda x: -x[1])},
            'warnings': warnings,
            'is_safety_critical': mood in self.SAFETY_CRITICAL,
            'features': {name: round(float(val), 4) for name, val in zip(self.FEATURE_NAMES, feat)},
        }

    def evaluate(self, audio_clips, labels):
        """Evaluate classifier and return comprehensive metrics."""
        labels = np.array(labels)
        preds = []; confs = []
        for clip in audio_clips:
            r = self.predict(clip)
            preds.append(r['mood']); confs.append(r['confidence'])
        preds = np.array(preds); confs = np.array(confs)

        # Confusion matrix
        n = len(self.MOOD_CATEGORIES)
        cm = np.zeros((n, n), dtype=int)
        for true, pred in zip(labels, preds):
            if pred == 'uncertain': continue
            i = self.MOOD_CATEGORIES.index(true)
            j = self.MOOD_CATEGORIES.index(pred)
            cm[i, j] += 1

        acc = np.mean(preds == labels)
        return {'accuracy': acc, 'confusion_matrix': cm, 'predictions': preds, 'confidences': confs}

# ================================================================
# DEMONSTRATION
# ================================================================

# --- Synthesize training and test data ---
sr = 22050; dur = 2.0
SYNTH_PARAMS = {
    'contact_rumble': {'freq': 22, 'harmonics': [44, 66], 'noise': 0.03, 'envelope': 'sustained'},
    'alarm_trumpet':  {'freq': 800, 'harmonics': [1600, 2400], 'noise': 0.15, 'envelope': 'attack'},
    'aggression_roar': {'freq': 150, 'harmonics': [300, 450, 600], 'noise': 0.20, 'envelope': 'crescendo'},
    'playful_bark':   {'freq': 400, 'harmonics': [800], 'noise': 0.10, 'envelope': 'staccato'},
    'distress_cry':   {'freq': 500, 'harmonics': [1000, 1500], 'noise': 0.08, 'envelope': 'wavering'},
    'content_snort':  {'freq': 0, 'harmonics': [], 'noise': 0.40, 'envelope': 'burst'},
}

def gen_env(et, n):
    te=np.linspace(0,1,n)
    envs={'sustained':lambda:np.ones(n)*0.8+0.2*np.sin(2*np.pi*0.5*te),
          'attack':lambda:np.exp(-3*te)*(1-np.exp(-50*te)),
          'crescendo':lambda:te**1.5, 'staccato':lambda:(np.sin(2*np.pi*4*te)>0).astype(float)*0.8,
          'wavering':lambda:0.5+0.5*np.sin(2*np.pi*3*te), 'burst':lambda:np.exp(-8*te)}
    return envs.get(et,lambda:np.ones(n))()

def synth_clip(mood, var=0.15):
    p=SYNTH_PARAMS[mood]; n=int(sr*dur); tl=np.linspace(0,dur,n,endpoint=False)
    fv=1+np.random.uniform(-var,var); bf=p['freq']*fv; s=np.zeros(n)
    if bf>0:
        s+=0.6*np.sin(2*np.pi*bf*tl)
        for i,h in enumerate(p['harmonics']): s+=(0.3/(i+1))*np.sin(2*np.pi*h*fv*tl)
    s+=p['noise']*np.random.randn(n); s*=gen_env(p['envelope'],n)
    pk=np.max(np.abs(s)); return s/pk*0.9 if pk>0 else s

# Build training data
train_clips, train_labels = [], []
for mood in ElephantRumbleClassifier.MOOD_CATEGORIES:
    for _ in range(50):
        train_clips.append(synth_clip(mood))
        train_labels.append(mood)

# Build test data
test_clips, test_labels = [], []
for mood in ElephantRumbleClassifier.MOOD_CATEGORIES:
    for _ in range(15):
        test_clips.append(synth_clip(mood, var=0.20))  # higher variation
        test_labels.append(mood)

# Train and evaluate
clf = ElephantRumbleClassifier(k=5, confidence_threshold=0.5)
clf.train(train_clips, train_labels)
results = clf.evaluate(test_clips, test_labels)

# --- Sample predictions ---
print("ELEPHANT RUMBLE CLASSIFIER — Deployment Demo")
print("=" * 65)
print(f"Training: {len(train_clips)} clips | Test: {len(test_clips)} clips")
print(f"Overall test accuracy: {results['accuracy']:.1%}")
print()

# Show 3 example predictions
print("Sample predictions:")
for i, mood in enumerate(['contact_rumble', 'alarm_trumpet', 'distress_cry']):
    clip = synth_clip(mood, var=0.18)
    r = clf.predict(clip)
    crit = " ** SAFETY CRITICAL **" if r['is_safety_critical'] else ""
    print(f"  True: {mood:<20} Pred: {r['mood']:<20} Conf: {r['confidence']:.0%}{crit}")
    if r['warnings']:
        for w in r['warnings']: print(f"    WARNING: {w}")

# --- Final showcase plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Elephant Rumble Classifier — Final Showcase', color='white', fontsize=16, fontweight='bold')

# Panel 1: Confusion matrix
ax = axes[0, 0]; ax.set_facecolor('#111827')
cm = results['confusion_matrix']
short = ['Rumble', 'Trumpet', 'Roar', 'Bark', 'Cry', 'Snort']
im = ax.imshow(cm, cmap='YlOrRd', aspect='auto')
ax.set_xticks(range(6)); ax.set_yticks(range(6))
ax.set_xticklabels(short, rotation=45, ha='right', color='white', fontsize=8)
ax.set_yticklabels(short, color='white', fontsize=8)
ax.set_xlabel('Predicted', color='white'); ax.set_ylabel('True', color='white')
ax.set_title('Confusion Matrix', color='white', fontsize=11)
for i in range(6):
    for j in range(6):
        c = 'white' if cm[i,j]>cm.max()/2 else 'black'
        ax.text(j,i,str(cm[i,j]),ha='center',va='center',color=c,fontsize=10,fontweight='bold')

# Panel 2: Confidence distribution
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
correct = results['predictions'] == np.array(test_labels)
ax.hist(results['confidences'][correct], bins=20, alpha=0.7, color='#22c55e', label='Correct')
ax.hist(results['confidences'][~correct], bins=20, alpha=0.7, color='#ef4444', label='Wrong')
ax.axvline(0.5, color='white', linestyle='--', label='Threshold')
ax.set_xlabel('Confidence', color='white'); ax.set_ylabel('Count', color='white')
ax.set_title('Confidence Distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Feature importance (variance ratio)
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
between_var = np.zeros(8)
overall_mean = clf.X_train.mean(axis=0)
for mood in clf.MOOD_CATEGORIES:
    mask = clf.y_train == mood
    class_mean = clf.X_train[mask].mean(axis=0)
    between_var += mask.sum() * (class_mean - overall_mean)**2
within_var = np.zeros(8)
for mood in clf.MOOD_CATEGORIES:
    mask = clf.y_train == mood
    within_var += np.sum((clf.X_train[mask] - clf.X_train[mask].mean(axis=0))**2, axis=0)
f_ratio = between_var / (within_var + 1e-10)
f_ratio_norm = f_ratio / f_ratio.max()

colors_feat = ['#3b82f6' if v > 0.5 else '#6b7280' for v in f_ratio_norm]
ax.barh(range(8), f_ratio_norm, color=colors_feat, edgecolor='white', linewidth=0.5)
ax.set_yticks(range(8))
ax.set_yticklabels(clf.FEATURE_NAMES, color='white', fontsize=9)
ax.set_xlabel('Discriminative Power (F-ratio, normalized)', color='white')
ax.set_title('Feature Importance', color='white', fontsize=11)

# Panel 4: API reference
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
doc = """API Reference
------------------------------
clf = ElephantRumbleClassifier(
    k=5,
    confidence_threshold=0.6
)

clf.train(audio_clips, labels)

result = clf.predict(audio_clip)
  result['mood']       -> 'contact_rumble'
  result['confidence'] -> 0.87
  result['is_safety_critical'] -> False
  result['probabilities'] -> {dict}
  result['warnings']   -> []

Mood Categories
------------------------------
  contact_rumble   (safe)
  alarm_trumpet    (CRITICAL)
  aggression_roar  (CRITICAL)
  playful_bark     (safe)
  distress_cry     (CRITICAL)
  content_snort    (safe)"""

ax.text(0.05, 0.95, doc, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built an Elephant Rumble Classifier from scratch:")
print("  1. Defined 6 mood categories with synthetic audio generation")
print("  2. Extracted 8 acoustic features (spectral + temporal + cepstral)")
print("  3. Implemented KNN classifier with distance-weighted voting")
print("  4. Analyzed errors via confusion matrix and per-class metrics")
print("  5. Validated with 5-fold cross-validation and model comparison")
print("  6. Deployed as a clean API with validation and safety alerts")
print()
print("Skills demonstrated: audio signal processing, feature engineering,")
print("classification, model evaluation, software design, conservation tech.")`,
      challenge: 'Add a real-time monitoring mode: simulate a continuous audio stream (concatenated random clips) and have the classifier process 2-second windows with 50% overlap, printing mood predictions as they arrive. Flag any safety-critical detections with a timestamp.',
      successHint: 'You have completed a full capstone project: from raw audio to deployed classifier. This is the shape of real conservation technology — not a single algorithm, but a pipeline where domain knowledge (elephant ethology), signal processing, machine learning, and software engineering all work together. The classifier is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (machine learning foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Elephant Rumble Classifier. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
