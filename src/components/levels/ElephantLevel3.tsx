import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function ElephantLevel3() {
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
      title: 'Feature engineering — extracting signal from raw audio',
      concept: `In Levels 1 and 2 you recorded and visualized elephant sounds. But raw audio waveforms are terrible inputs for a classifier — a 5-second clip at 22050 Hz is 110,250 numbers. Most of those numbers are redundant. Feature engineering is the art of compressing raw data into a small set of **informative numbers**.

For audio, the gold standard features come from the **frequency domain**:

- **Spectral centroid**: the "center of mass" of the frequency spectrum — higher means brighter/sharper sounds. Elephant rumbles have low centroids (~50-150 Hz); bird calls have high centroids (~2000-6000 Hz).
- **Spectral bandwidth**: how spread out the frequencies are. A pure tone has zero bandwidth; a complex call has wide bandwidth.
- **Spectral rolloff**: the frequency below which 85% of the energy sits. Tells you where the action ends.
- **Zero-crossing rate**: how often the signal crosses zero — noisy signals cross often, tonal signals cross at regular intervals.

Good features make the classifier's job trivial. Bad features make even the best algorithm fail.`,
      analogy: 'Feature engineering is like a wildlife tracker summarizing a 10-hour trail camera video: "large animal, moved slowly, arrived at dusk, stayed 45 minutes." Those five facts are more useful for species identification than watching all 10 hours. You compress raw data into what matters.',
      storyConnection: 'The girl who spoke to elephants could distinguish a warning rumble from a contact call from a playful trumpet. She was doing feature engineering in her head — extracting pitch, duration, rhythm, and intensity from the raw sound wave and mapping those features to meaning.',
      checkQuestion: 'Why would spectral centroid alone be a poor feature for distinguishing two elephant calls that differ mainly in rhythm (e.g., three short rumbles vs. one long rumble)?',
      checkAnswer: 'Spectral centroid measures the average frequency content, not temporal structure. Both calls might have similar frequency distributions but very different timing patterns. You would need temporal features like duration, onset intervals, or an envelope descriptor. Good feature sets capture multiple axes of variation.',
      codeIntro: 'Generate synthetic elephant and bird sounds, then compute spectral features from scratch using numpy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
sr = 22050  # sample rate
duration = 2.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# Synthesize elephant rumble: low fundamental (~25 Hz) + harmonics + noise
elephant = (0.6 * np.sin(2 * np.pi * 25 * t) +
            0.3 * np.sin(2 * np.pi * 50 * t) +
            0.1 * np.sin(2 * np.pi * 75 * t) +
            0.05 * np.random.randn(len(t)))

# Synthesize bird call: high fundamental (~3000 Hz) + FM modulation
bird = (0.5 * np.sin(2 * np.pi * 3000 * t + 4 * np.sin(2 * np.pi * 8 * t)) +
        0.3 * np.sin(2 * np.pi * 6000 * t) +
        0.03 * np.random.randn(len(t)))

def compute_spectral_features(signal, sample_rate, frame_size=2048):
    """Compute spectral features from scratch using numpy FFT."""
    # Apply Hann window and compute FFT
    window = np.hanning(frame_size)
    # Take a frame from the middle of the signal
    start = len(signal) // 2 - frame_size // 2
    frame = signal[start:start + frame_size] * window

    # Magnitude spectrum (positive frequencies only)
    spectrum = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(frame_size, d=1.0 / sample_rate)

    # Normalize spectrum to act as a probability distribution
    spectrum_sum = np.sum(spectrum)
    if spectrum_sum == 0:
        spectrum_sum = 1e-10
    p = spectrum / spectrum_sum

    # Spectral centroid: weighted mean of frequencies
    centroid = np.sum(freqs * p)

    # Spectral bandwidth: weighted std of frequencies
    bandwidth = np.sqrt(np.sum(((freqs - centroid) ** 2) * p))

    # Spectral rolloff: freq below which 85% of energy sits
    cumulative = np.cumsum(spectrum)
    rolloff_idx = np.searchsorted(cumulative, 0.85 * cumulative[-1])
    rolloff = freqs[min(rolloff_idx, len(freqs) - 1)]

    # Zero-crossing rate
    zcr = np.sum(np.abs(np.diff(np.sign(signal)))) / (2 * len(signal))

    return {
        'centroid': centroid,
        'bandwidth': bandwidth,
        'rolloff': rolloff,
        'zcr': zcr,
        'spectrum': spectrum,
        'freqs': freqs,
    }

e_feat = compute_spectral_features(elephant, sr)
b_feat = compute_spectral_features(bird, sr)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Waveforms
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

axes[0, 0].plot(t[:2000], elephant[:2000], color='#22c55e', linewidth=0.5)
axes[0, 0].set_title('Elephant rumble (waveform)', color='white', fontsize=10)
axes[0, 0].set_xlabel('Time (s)', color='white')

axes[0, 1].plot(t[:2000], bird[:2000], color='#f59e0b', linewidth=0.5)
axes[0, 1].set_title('Bird call (waveform)', color='white', fontsize=10)
axes[0, 1].set_xlabel('Time (s)', color='white')

# Spectra with features marked
for ax, feat, name, color in [
    (axes[1, 0], e_feat, 'Elephant', '#22c55e'),
    (axes[1, 1], b_feat, 'Bird', '#f59e0b')
]:
    ax.plot(feat['freqs'][:500], feat['spectrum'][:500], color=color, linewidth=1)
    ax.axvline(feat['centroid'], color='#ef4444', linestyle='-', linewidth=2, label=f"Centroid: {feat['centroid']:.0f} Hz")
    ax.axvline(feat['rolloff'], color='#3b82f6', linestyle='--', linewidth=2, label=f"Rolloff: {feat['rolloff']:.0f} Hz")
    ax.axvspan(feat['centroid'] - feat['bandwidth'], feat['centroid'] + feat['bandwidth'],
               alpha=0.15, color='#a855f7', label=f"Bandwidth: {feat['bandwidth']:.0f} Hz")
    ax.set_title(f'{name} spectrum + features', color='white', fontsize=10)
    ax.set_xlabel('Frequency (Hz)', color='white')
    ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Feature comparison:")
print(f"{'Feature':<22} {'Elephant':>10} {'Bird':>10}")
print("-" * 44)
print(f"{'Spectral centroid':<22} {e_feat['centroid']:>10.1f} {b_feat['centroid']:>10.1f} Hz")
print(f"{'Spectral bandwidth':<22} {e_feat['bandwidth']:>10.1f} {b_feat['bandwidth']:>10.1f} Hz")
print(f"{'Spectral rolloff':<22} {e_feat['rolloff']:>10.1f} {b_feat['rolloff']:>10.1f} Hz")
print(f"{'Zero-crossing rate':<22} {e_feat['zcr']:>10.4f} {b_feat['zcr']:>10.4f}")
print()
print("Every feature separates elephant from bird.")
print("A classifier given these 4 numbers could easily distinguish them.")
print("That's the power of feature engineering: 44,100 raw samples -> 4 informative numbers.")`,
      challenge: 'Add a third sound class: rain (broadband noise). Generate it with np.random.randn, compute its features, and compare. Does it overlap with elephant or bird in any feature dimension?',
      successHint: 'Feature engineering is where domain expertise meets data science. Knowing that elephant rumbles are infrasonic (below 20 Hz) tells you exactly which features will separate them. The best ML engineers are also domain experts.',
    },
    {
      title: 'Train/test split — the cardinal rule of machine learning',
      concept: `Imagine a student who memorizes every answer on a practice exam, then gets tested on the exact same questions. They score 100% — but did they learn anything? No. They memorized.

A machine learning model can do the same thing. If you train it on data and then test it on the **same data**, it will score perfectly even if it learned nothing useful. This is called **overfitting** — the model memorized the training examples instead of learning the underlying pattern.

The solution: **train/test split**. You randomly split your data into two sets:
- **Training set** (~70-80%): the model learns from these examples
- **Test set** (~20-30%): these are held out — the model never sees them during training. You evaluate performance only on this set.

For even more robust evaluation, use **k-fold cross-validation**: split data into k equal parts, train on k-1 parts, test on the remaining 1, rotate, and average results. This ensures every data point gets used for both training and testing.`,
      analogy: 'Train/test split is like a driving test. You practice on residential streets (training). But the test examiner takes you on roads you have never driven before (test set). If you can only drive the routes you memorized, you fail. If you learned the general skill of driving, you pass anywhere.',
      storyConnection: 'The girl who spoke to elephants learned to interpret rumbles by listening to her own herd for years (training). But the real test came when she encountered a wild herd she had never met (test set). Could she still understand them? If her understanding generalized beyond her own herd, she had truly learned elephant communication.',
      checkQuestion: 'You have 50 elephant call recordings and 50 bird recordings. You train a model on all 100 and it gets 100% accuracy. Should you trust this result?',
      checkAnswer: 'Absolutely not. The model saw every example during training, so 100% accuracy might just mean it memorized the data. You need to hold out a test set it has never seen. If it still gets high accuracy on unseen data, then you can trust it. This is the most common beginner mistake in ML.',
      codeIntro: 'Implement train/test split and k-fold cross-validation from scratch, demonstrating how overfitting inflates training accuracy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 200 samples: 100 elephant calls, 100 bird calls
# Each sample has 4 features: centroid, bandwidth, rolloff, zcr
n_per_class = 100

# Elephant features (low centroid, low rolloff, low zcr)
elephant_features = np.column_stack([
    np.random.normal(80, 30, n_per_class),    # centroid
    np.random.normal(60, 20, n_per_class),    # bandwidth
    np.random.normal(150, 40, n_per_class),   # rolloff
    np.random.normal(0.02, 0.008, n_per_class) # zcr
])

# Bird features (high centroid, high rolloff, high zcr)
bird_features = np.column_stack([
    np.random.normal(3500, 800, n_per_class),
    np.random.normal(1200, 400, n_per_class),
    np.random.normal(5000, 1000, n_per_class),
    np.random.normal(0.35, 0.08, n_per_class)
])

X = np.vstack([elephant_features, bird_features])
y = np.array([0] * n_per_class + [1] * n_per_class)  # 0=elephant, 1=bird

# ---- Manual train/test split ----
def train_test_split(X, y, test_fraction=0.2, seed=42):
    rng = np.random.RandomState(seed)
    n = len(y)
    indices = rng.permutation(n)
    split = int(n * (1 - test_fraction))
    train_idx, test_idx = indices[:split], indices[split:]
    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]

X_train, X_test, y_train, y_test = train_test_split(X, y, 0.2)

# Simple nearest-centroid classifier (for demonstration)
def train_centroid_classifier(X, y):
    classes = np.unique(y)
    centroids = {c: X[y == c].mean(axis=0) for c in classes}
    return centroids

def predict_centroid(X, centroids):
    preds = []
    for x in X:
        dists = {c: np.linalg.norm(x - centroid) for c, centroid in centroids.items()}
        preds.append(min(dists, key=dists.get))
    return np.array(preds)

centroids = train_centroid_classifier(X_train, y_train)
train_preds = predict_centroid(X_train, centroids)
test_preds = predict_centroid(X_test, centroids)

train_acc = np.mean(train_preds == y_train)
test_acc = np.mean(test_preds == y_test)

# ---- K-fold cross-validation ----
def k_fold_cv(X, y, k=5, seed=42):
    rng = np.random.RandomState(seed)
    n = len(y)
    indices = rng.permutation(n)
    fold_size = n // k
    fold_accs = []

    for i in range(k):
        test_idx = indices[i * fold_size:(i + 1) * fold_size]
        train_idx = np.concatenate([indices[:i * fold_size], indices[(i + 1) * fold_size:]])

        centroids = train_centroid_classifier(X[train_idx], y[train_idx])
        preds = predict_centroid(X[test_idx], centroids)
        fold_accs.append(np.mean(preds == y[test_idx]))

    return fold_accs

fold_accs = k_fold_cv(X, y, k=5)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Train vs Test accuracy
ax = axes[0]
ax.set_facecolor('#111827')
bars = ax.bar(['Train', 'Test'], [train_acc, test_acc],
              color=['#22c55e', '#3b82f6'], edgecolor='none', width=0.5)
ax.set_ylim(0, 1.1)
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Train vs Test accuracy', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, acc in zip(bars, [train_acc, test_acc]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{acc:.1%}', ha='center', color='white', fontsize=12, fontweight='bold')

# Plot 2: K-fold results
ax = axes[1]
ax.set_facecolor('#111827')
ax.bar(range(1, 6), fold_accs, color='#a855f7', edgecolor='none', width=0.5)
ax.axhline(np.mean(fold_accs), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean: {np.mean(fold_accs):.1%}')
ax.set_ylim(0, 1.1)
ax.set_xlabel('Fold', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('5-Fold Cross-Validation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: What overfitting looks like (model complexity curve)
ax = axes[2]
ax.set_facecolor('#111827')

# Simulate: as we add noise features, train acc stays high, test acc drops
n_noise = 15
train_accs_curve = [train_acc]
test_accs_curve = [test_acc]

for i in range(1, n_noise + 1):
    noise = np.random.randn(len(X), i) * 50
    X_noisy = np.hstack([X, noise])
    Xtr, Xte, ytr, yte = train_test_split(X_noisy, y, 0.2)
    c = train_centroid_classifier(Xtr, ytr)
    train_accs_curve.append(np.mean(predict_centroid(Xtr, c) == ytr))
    test_accs_curve.append(np.mean(predict_centroid(Xte, c) == yte))

dims = list(range(4, 4 + n_noise + 1))
ax.plot(dims, train_accs_curve, 'o-', color='#22c55e', linewidth=2, label='Train')
ax.plot(dims, test_accs_curve, 'o-', color='#ef4444', linewidth=2, label='Test')
ax.set_xlabel('Number of features', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Overfitting: more noise features', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Simple split:  Train={train_acc:.1%}  Test={test_acc:.1%}")
print(f"5-Fold CV:     {' | '.join(f'{a:.1%}' for a in fold_accs)}  Mean={np.mean(fold_accs):.1%}")
print()
print("Key insight: train accuracy is always >= test accuracy.")
print("If the gap is large, your model is overfitting.")
print("Cross-validation gives a more reliable estimate than a single split.")`,
      challenge: 'Try k=10 and k=20 cross-validation. As k increases, each test fold gets smaller. What happens to the variance of fold accuracies? There is a bias-variance trade-off even in evaluation strategy.',
      successHint: 'Every ML paper, every Kaggle competition, every production model uses train/test splitting. It is the single most important concept in applied machine learning. Get this wrong and nothing else matters.',
    },
    {
      title: 'k-NN classifier — your first real ML algorithm from scratch',
      concept: `k-Nearest Neighbors is beautifully simple: to classify a new point, find the k closest training points and let them vote. If 4 out of 5 nearest neighbors are elephants, classify as elephant.

Despite its simplicity, k-NN is a powerful algorithm with deep theoretical backing:

- **Distance metric**: Euclidean distance is the default, but Manhattan (L1) or Minkowski (Lp) distances work too. The choice matters — Euclidean treats all features equally, which is a problem if features are on different scales.
- **Feature scaling**: Before computing distances, you MUST normalize features. If centroid ranges 0-5000 Hz but ZCR ranges 0-0.5, centroid will dominate all distance calculations. Z-score normalization (subtract mean, divide by std) fixes this.
- **Choosing k**: k=1 overfits (captures noise), k=N underfits (always predicts majority class). The sweet spot is somewhere in between, found via cross-validation.
- **Computational cost**: At prediction time, k-NN computes distances to ALL training points. For N training samples with D features, this is O(N*D) per prediction. It does not scale well.`,
      analogy: 'k-NN is like asking your neighbors for restaurant recommendations. Ask 1 neighbor (k=1) — you get one person\'s taste, which might be weird. Ask 100 neighbors (k=100) — you get the most popular restaurant in town, ignoring your specific location. Ask 5-7 nearby neighbors — you get relevant, reliable advice. The "nearest" part matters as much as the "neighbors" part.',
      storyConnection: 'The girl classified unfamiliar elephant calls by comparing them to calls she had heard before. "This rumble sounds most like the warning calls I heard from the Kaziranga herd" — she was doing k-NN classification using her memory as the training set and tonal similarity as the distance metric.',
      checkQuestion: 'You have 1000 elephant samples and 10 bird samples. With k=5, what problem might arise even if the classifier is working correctly?',
      checkAnswer: 'Class imbalance. With 100x more elephant samples, the 5 nearest neighbors of ANY point are likely to be elephants simply because elephants are everywhere in the feature space. The classifier will predict "elephant" for everything and still get ~99% accuracy (because 99% of samples ARE elephants). You need balanced classes, weighted voting, or different evaluation metrics.',
      codeIntro: 'Implement k-NN from scratch: distance computation, voting, and k selection via cross-validation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 3-class dataset: elephant, bird, insect
# Using 2 features for visualization: centroid and zcr
n = 80

elephant = np.column_stack([
    np.random.normal(80, 25, n),
    np.random.normal(0.02, 0.007, n)
])
bird = np.column_stack([
    np.random.normal(3500, 600, n),
    np.random.normal(0.35, 0.06, n)
])
insect = np.column_stack([
    np.random.normal(1500, 400, n),
    np.random.normal(0.15, 0.04, n)
])

X = np.vstack([elephant, bird, insect])
y = np.array([0]*n + [1]*n + [2]*n)

# Z-score normalization
X_mean = X.mean(axis=0)
X_std = X.std(axis=0)
X_norm = (X - X_mean) / X_std

# Train/test split
indices = np.random.permutation(len(y))
split = int(0.8 * len(y))
train_idx, test_idx = indices[:split], indices[split:]
X_train, X_test = X_norm[train_idx], X_norm[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

class KNNClassifier:
    def __init__(self, k=5):
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        self.X_train = X.copy()
        self.y_train = y.copy()

    def _euclidean_distances(self, x):
        """Compute Euclidean distance from x to all training points."""
        return np.sqrt(np.sum((self.X_train - x) ** 2, axis=1))

    def _manhattan_distances(self, x):
        """Compute Manhattan distance from x to all training points."""
        return np.sum(np.abs(self.X_train - x), axis=1)

    def predict_one(self, x, metric='euclidean'):
        if metric == 'euclidean':
            dists = self._euclidean_distances(x)
        else:
            dists = self._manhattan_distances(x)

        # Find k nearest neighbors
        nearest_idx = np.argsort(dists)[:self.k]
        nearest_labels = self.y_train[nearest_idx]

        # Majority vote
        classes, counts = np.unique(nearest_labels, return_counts=True)
        return classes[np.argmax(counts)]

    def predict(self, X, metric='euclidean'):
        return np.array([self.predict_one(x, metric) for x in X])

# Test different k values
k_values = list(range(1, 31, 2))
train_accs = []
test_accs = []

for k in k_values:
    knn = KNNClassifier(k=k)
    knn.fit(X_train, y_train)
    train_accs.append(np.mean(knn.predict(X_train) == y_train))
    test_accs.append(np.mean(knn.predict(X_test) == y_test))

best_k = k_values[np.argmax(test_accs)]
best_acc = max(test_accs)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Plot 1: The data
ax = axes[0]
ax.set_facecolor('#111827')
colors_map = {0: '#22c55e', 1: '#f59e0b', 2: '#3b82f6'}
labels_map = {0: 'Elephant', 1: 'Bird', 2: 'Insect'}
for c in [0, 1, 2]:
    mask = y_train == c
    ax.scatter(X_train[mask, 0], X_train[mask, 1], c=colors_map[c],
               label=labels_map[c], alpha=0.6, s=30, edgecolors='none')
    mask_test = y_test == c
    ax.scatter(X_test[mask_test, 0], X_test[mask_test, 1], c=colors_map[c],
               marker='x', s=50, linewidths=2, alpha=0.8)
ax.set_xlabel('Spectral centroid (normalized)', color='white')
ax.set_ylabel('Zero-crossing rate (normalized)', color='white')
ax.set_title('Training (dots) & test (crosses)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 2: k selection curve
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(k_values, train_accs, 'o-', color='#22c55e', linewidth=2, label='Train')
ax.plot(k_values, test_accs, 'o-', color='#ef4444', linewidth=2, label='Test')
ax.axvline(best_k, color='#f59e0b', linestyle='--', linewidth=1, label=f'Best k={best_k}')
ax.set_xlabel('k (number of neighbors)', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('k selection: underfitting vs overfitting', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Decision boundary for best k
ax = axes[2]
ax.set_facecolor('#111827')

# Create mesh grid
h = 0.05
x_min, x_max = X_norm[:, 0].min() - 0.5, X_norm[:, 0].max() + 0.5
y_min, y_max = X_norm[:, 1].min() - 0.5, X_norm[:, 1].max() + 0.5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
mesh_points = np.column_stack([xx.ravel(), yy.ravel()])

knn = KNNClassifier(k=best_k)
knn.fit(X_train, y_train)
Z = knn.predict(mesh_points).reshape(xx.shape)

# Custom colormap using RGB arrays
color_array = np.zeros((*Z.shape, 3))
for c, rgb in [(0, (0.13, 0.77, 0.37)), (1, (0.96, 0.62, 0.04)), (2, (0.23, 0.51, 0.96))]:
    mask = Z == c
    for i, v in enumerate(rgb):
        color_array[mask, i] = v

ax.imshow(color_array, extent=[x_min, x_max, y_min, y_max], origin='lower', alpha=0.3, aspect='auto')
for c in [0, 1, 2]:
    mask = y == c
    ax.scatter(X_norm[mask, 0], X_norm[mask, 1], c=colors_map[c],
               label=labels_map[c], alpha=0.7, s=20, edgecolors='none')
ax.set_title(f'Decision boundary (k={best_k})', color='white', fontsize=10)
ax.set_xlabel('Centroid (norm)', color='white')
ax.set_ylabel('ZCR (norm)', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Best k = {best_k} (test accuracy: {best_acc:.1%})")
print(f"k=1 test accuracy: {test_accs[0]:.1%} (overfits — memorizes noise)")
print(f"k=29 test accuracy: {test_accs[-1]:.1%} (underfits — too smooth)")
print()
print("The k-NN algorithm in ~40 lines of numpy.")
print("No gradient descent, no loss function, no training loop.")
print("Just distances and votes. Simple, interpretable, powerful.")`,
      challenge: 'Switch from Euclidean to Manhattan distance by changing the metric parameter. Does the decision boundary change? Which metric gives better test accuracy for this dataset?',
      successHint: 'k-NN is often the first algorithm you should try on a new problem. It gives you a baseline accuracy with minimal assumptions. If k-NN fails, the problem is likely in your features, not your classifier.',
    },
    {
      title: 'Decision boundaries — how classifiers see the world',
      concept: `Every classifier divides feature space into regions. On one side of the boundary, everything is "elephant." On the other side, "bird." The shape of this boundary tells you everything about how the model makes decisions.

Different classifiers produce different boundary shapes:
- **k-NN** (k=1): jagged, follows every data point exactly — overfitting
- **k-NN** (large k): smoother, but still wiggly — data-driven shape
- **Linear classifier**: a straight line (or hyperplane) — simple but can only separate linearly separable classes
- **Quadratic classifier**: a curved boundary — more flexible than linear

The ideal boundary captures the true separation between classes without fitting to noise. Visualizing boundaries is one of the best ways to understand what your model has learned and whether it generalizes.

In 2D we can see boundaries directly. In higher dimensions, we use techniques like t-SNE or PCA to project down to 2D, or we examine slices through the feature space.`,
      analogy: 'Decision boundaries are like national borders on a map. Some borders follow natural features (rivers, mountain ridges) — these are like well-fit boundaries that follow the true data distribution. Some borders are straight lines drawn by colonial powers that ignore geography — these are like linear classifiers forced onto non-linear data. And some borders are so convoluted they trace every neighborhood — overfitting.',
      storyConnection: 'The girl who spoke to elephants had an internal decision boundary: sounds below a certain pitch with a certain rhythm pattern were classified as "elephant," sounds above were "bird" or "other." Her boundary was shaped by experience — the more elephant calls she heard, the more refined her internal boundary became. That is exactly how k-NN boundaries sharpen with more training data.',
      checkQuestion: 'A k-NN classifier with k=1 and a large training set achieves 99% test accuracy. Is this good or should you still try larger k values?',
      checkAnswer: 'If k=1 gets 99%, the classes are very well-separated in feature space — there is little overlap. You should still try larger k values because k=1 is maximally sensitive to noise and outliers. But in practice, well-separated data means most reasonable k values will work well. The 99% is trustworthy only if measured on a proper test set.',
      codeIntro: 'Visualize how decision boundaries change with k value and dataset complexity, and compare linear vs. k-NN boundaries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate two datasets: easy (well-separated) and hard (overlapping)
n = 100

# Easy dataset
easy_A = np.column_stack([np.random.normal(-2, 0.5, n), np.random.normal(-2, 0.5, n)])
easy_B = np.column_stack([np.random.normal(2, 0.5, n), np.random.normal(2, 0.5, n)])
X_easy = np.vstack([easy_A, easy_B])
y_easy = np.array([0]*n + [1]*n)

# Hard dataset: concentric circles (not linearly separable)
theta = np.random.uniform(0, 2 * np.pi, n)
r_inner = np.random.normal(1.0, 0.15, n)
r_outer = np.random.normal(2.5, 0.2, n)
hard_A = np.column_stack([r_inner * np.cos(theta), r_inner * np.sin(theta)])
theta2 = np.random.uniform(0, 2 * np.pi, n)
hard_B = np.column_stack([r_outer * np.cos(theta2), r_outer * np.sin(theta2)])
X_hard = np.vstack([hard_A, hard_B])
y_hard = np.array([0]*n + [1]*n)

def knn_predict_grid(X_train, y_train, xx, yy, k):
    mesh = np.column_stack([xx.ravel(), yy.ravel()])
    preds = []
    for point in mesh:
        dists = np.sqrt(np.sum((X_train - point) ** 2, axis=1))
        nearest = y_train[np.argsort(dists)[:k]]
        classes, counts = np.unique(nearest, return_counts=True)
        preds.append(classes[np.argmax(counts)])
    return np.array(preds).reshape(xx.shape)

def linear_predict_grid(X_train, y_train, xx, yy):
    """Simple linear classifier: find the line that best separates the classes."""
    # Compute class centroids
    c0 = X_train[y_train == 0].mean(axis=0)
    c1 = X_train[y_train == 1].mean(axis=0)
    # Decision boundary is perpendicular bisector of line connecting centroids
    w = c1 - c0  # normal to boundary
    midpoint = (c0 + c1) / 2
    mesh = np.column_stack([xx.ravel(), yy.ravel()])
    # Classify based on which side of the boundary
    projections = (mesh - midpoint) @ w
    preds = (projections > 0).astype(int)
    return preds.reshape(xx.shape)

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Decision Boundaries: k-NN vs Linear, Easy vs Hard', color='white', fontsize=14)

datasets = [('Well-separated', X_easy, y_easy), ('Concentric (non-linear)', X_hard, y_hard)]

for row, (name, X, y_data) in enumerate(datasets):
    x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
    y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
    h = 0.08
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))

    configs = [('k=1', 1), ('k=5', 5), ('k=21', 21), ('Linear', None)]

    for col, (label, k) in enumerate(configs):
        ax = axes[row, col]
        ax.set_facecolor('#111827')

        if k is not None:
            Z = knn_predict_grid(X, y_data, xx, yy, k)
        else:
            Z = linear_predict_grid(X, y_data, xx, yy)

        color_array = np.zeros((*Z.shape, 3))
        color_array[Z == 0] = (0.13, 0.77, 0.37)
        color_array[Z == 1] = (0.96, 0.62, 0.04)

        ax.imshow(color_array, extent=[x_min, x_max, y_min, y_max],
                  origin='lower', alpha=0.3, aspect='auto')
        ax.scatter(X[y_data == 0, 0], X[y_data == 0, 1], c='#22c55e', s=10, edgecolors='none')
        ax.scatter(X[y_data == 1, 0], X[y_data == 1, 1], c='#f59e0b', s=10, edgecolors='none')

        # Compute accuracy
        if k is not None:
            preds = []
            for i, point in enumerate(X):
                dists = np.sqrt(np.sum((np.delete(X, i, axis=0) - point) ** 2, axis=1))
                labels = np.delete(y_data, i)
                nearest = labels[np.argsort(dists)[:k]]
                classes, counts = np.unique(nearest, return_counts=True)
                preds.append(classes[np.argmax(counts)])
            acc = np.mean(np.array(preds) == y_data)
        else:
            c0 = X[y_data == 0].mean(axis=0)
            c1 = X[y_data == 1].mean(axis=0)
            w = c1 - c0
            mid = (c0 + c1) / 2
            projections = (X - mid) @ w
            acc = np.mean((projections > 0).astype(int) == y_data)

        ax.set_title(f'{label} (acc={acc:.0%})', color='white', fontsize=10)
        ax.tick_params(colors='gray', labelsize=6)
        if col == 0:
            ax.set_ylabel(name, color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Key observations:")
print()
print("WELL-SEPARATED DATA:")
print("  - All classifiers work. Even linear gets ~100%.")
print("  - k=1 boundary is jagged but doesn't hurt accuracy here.")
print()
print("CONCENTRIC CIRCLES:")
print("  - Linear FAILS (~50%). A line cannot separate circles.")
print("  - k-NN succeeds because it creates curved boundaries.")
print("  - k=1 is noisy. k=5 or k=21 captures the true circle shape.")
print()
print("The shape of your data determines which classifier you need.")
print("This is the 'no free lunch' theorem: no single algorithm wins everywhere.")`,
      challenge: 'Create a third dataset: two interleaved spirals (X-shaped when plotted). This is notoriously hard for k-NN. How does accuracy change? At what point does the curse of dimensionality overwhelm the algorithm?',
      successHint: 'Visualizing decision boundaries is how you build intuition for model behavior. Every time you train a model, you should ask: "What does the decision boundary look like? Does it match the true structure of the data?"',
    },
    {
      title: 'Model evaluation — precision, recall, F1, ROC, and confusion matrices',
      concept: `Accuracy is a seductive metric — it is also often misleading. If 95% of audio in a forest is wind noise and 5% is elephant calls, a model that always predicts "not elephant" gets 95% accuracy. But it is completely useless for finding elephants.

You need richer metrics:

- **Confusion matrix**: a table showing true positives (TP), false positives (FP), true negatives (TN), false negatives (FN)
- **Precision**: TP / (TP + FP) — "Of all samples I labeled elephant, how many actually were?" High precision = few false alarms.
- **Recall (sensitivity)**: TP / (TP + FN) — "Of all actual elephants, how many did I catch?" High recall = few missed elephants.
- **F1 score**: harmonic mean of precision and recall — 2*P*R / (P+R). Balances both.
- **ROC curve**: plots true positive rate vs false positive rate at every classification threshold. Area under ROC (AUC) = probability that the model ranks a random positive higher than a random negative. AUC=1.0 is perfect, AUC=0.5 is random guessing.

The choice between precision and recall depends on the cost of errors. Missing an elephant poacher (low recall) is worse than a false alarm (low precision).`,
      analogy: 'Precision vs. recall is the difference between a sniper and a shotgun. The sniper (high precision) hits only what they aim at but might miss some targets. The shotgun (high recall) hits everything in the area but also hits bystanders. In conservation, you want the shotgun — better to investigate 10 false alarms than miss one poacher.',
      storyConnection: 'The girl who spoke to elephants needed high recall for danger signals — missing a real warning call could be fatal. She could tolerate low precision (occasionally mistaking a tree creak for a rumble) because the cost of a false alarm was just a moment of caution. Her internal classifier was tuned for recall, not precision.',
      checkQuestion: 'A poacher detection system has 99% precision and 60% recall. Is this acceptable for protecting elephants?',
      checkAnswer: 'No. 60% recall means 40% of poaching events go undetected. You are missing 4 out of every 10 poachers. You should lower the detection threshold to increase recall, even if precision drops. A system with 80% precision and 95% recall is far better — more false alarms, but almost no missed poachers.',
      codeIntro: 'Build a complete model evaluation pipeline: confusion matrix, precision/recall/F1, ROC curve, and threshold tuning.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a realistic scenario: elephant call detection in forest audio
# 500 audio clips, only 50 are elephant calls (10% positive rate)
n_total = 500
n_positive = 50
n_negative = n_total - n_positive

# Model outputs a "confidence score" (0 to 1) for each clip
# Elephants get higher scores on average, but there's overlap
elephant_scores = np.random.beta(5, 2, n_positive)  # skewed high
noise_scores = np.random.beta(2, 5, n_negative)     # skewed low

all_scores = np.concatenate([elephant_scores, noise_scores])
all_labels = np.array([1]*n_positive + [0]*n_negative)

# Shuffle
shuffle_idx = np.random.permutation(n_total)
all_scores = all_scores[shuffle_idx]
all_labels = all_labels[shuffle_idx]

def compute_metrics(y_true, y_pred):
    tp = np.sum((y_pred == 1) & (y_true == 1))
    fp = np.sum((y_pred == 1) & (y_true == 0))
    tn = np.sum((y_pred == 0) & (y_true == 0))
    fn = np.sum((y_pred == 0) & (y_true == 1))

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    accuracy = (tp + tn) / (tp + fp + tn + fn)

    return tp, fp, tn, fn, precision, recall, f1, accuracy

def compute_roc(y_true, scores, n_thresholds=200):
    thresholds = np.linspace(0, 1, n_thresholds)
    tprs, fprs = [], []

    for thresh in thresholds:
        y_pred = (scores >= thresh).astype(int)
        tp = np.sum((y_pred == 1) & (y_true == 1))
        fp = np.sum((y_pred == 1) & (y_true == 0))
        fn = np.sum((y_pred == 0) & (y_true == 1))
        tn = np.sum((y_pred == 0) & (y_true == 0))

        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        tprs.append(tpr)
        fprs.append(fpr)

    # AUC via trapezoidal rule (sort by FPR first)
    sorted_idx = np.argsort(fprs)
    fprs_sorted = np.array(fprs)[sorted_idx]
    tprs_sorted = np.array(tprs)[sorted_idx]
    auc = np.trapz(tprs_sorted, fprs_sorted)

    return fprs, tprs, thresholds, auc

# Evaluate at default threshold (0.5)
y_pred_default = (all_scores >= 0.5).astype(int)
tp, fp, tn, fn, prec, rec, f1, acc = compute_metrics(all_labels, y_pred_default)

# Find optimal threshold for F1
best_f1 = 0
best_thresh = 0.5
for t in np.linspace(0.1, 0.9, 81):
    yp = (all_scores >= t).astype(int)
    _, _, _, _, p, r, f, _ = compute_metrics(all_labels, yp)
    if f > best_f1:
        best_f1 = f
        best_thresh = t

fprs, tprs, thresholds, auc = compute_roc(all_labels, all_scores)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Score distributions
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.hist(all_scores[all_labels == 1], bins=30, alpha=0.7, color='#22c55e',
        label='Elephant calls', density=True, edgecolor='none')
ax.hist(all_scores[all_labels == 0], bins=30, alpha=0.7, color='#ef4444',
        label='Noise', density=True, edgecolor='none')
ax.axvline(0.5, color='#f59e0b', linestyle='--', linewidth=2, label='Default threshold')
ax.axvline(best_thresh, color='#a855f7', linestyle='--', linewidth=2, label=f'Optimal threshold ({best_thresh:.2f})')
ax.set_xlabel('Confidence score', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Score distributions by class', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Confusion matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
conf_matrix = np.array([[tn, fp], [fn, tp]])
im = ax.imshow(conf_matrix, cmap='YlOrRd', aspect='auto')
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(['Pred: Noise', 'Pred: Elephant'], color='white', fontsize=9)
ax.set_yticklabels(['True: Noise', 'True: Elephant'], color='white', fontsize=9)
ax.set_title(f'Confusion Matrix (threshold=0.5)', color='white', fontsize=11)
for i in range(2):
    for j in range(2):
        label = ['TN', 'FP', 'FN', 'TP'][i * 2 + j]
        ax.text(j, i, f'{label}\\n{conf_matrix[i, j]}',
                ha='center', va='center', color='black', fontsize=14, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 3: Precision-Recall vs threshold
ax = axes[1, 0]
ax.set_facecolor('#111827')
threshs = np.linspace(0.1, 0.9, 81)
precs, recs, f1s = [], [], []
for t in threshs:
    yp = (all_scores >= t).astype(int)
    _, _, _, _, p, r, f, _ = compute_metrics(all_labels, yp)
    precs.append(p)
    recs.append(r)
    f1s.append(f)
ax.plot(threshs, precs, color='#3b82f6', linewidth=2, label='Precision')
ax.plot(threshs, recs, color='#22c55e', linewidth=2, label='Recall')
ax.plot(threshs, f1s, color='#f59e0b', linewidth=2, label='F1 Score')
ax.axvline(best_thresh, color='#a855f7', linestyle='--', linewidth=1, label=f'Best F1 at {best_thresh:.2f}')
ax.set_xlabel('Threshold', color='white')
ax.set_ylabel('Score', color='white')
ax.set_title('Precision / Recall / F1 vs Threshold', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: ROC curve
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(fprs, tprs, color='#22c55e', linewidth=2, label=f'ROC curve (AUC={auc:.3f})')
ax.plot([0, 1], [0, 1], color='gray', linestyle='--', linewidth=1, label='Random (AUC=0.5)')
ax.fill_between(fprs, tprs, alpha=0.1, color='#22c55e')
ax.set_xlabel('False Positive Rate', color='white')
ax.set_ylabel('True Positive Rate', color='white')
ax.set_title('ROC Curve', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Dataset: {n_positive} elephant calls + {n_negative} noise clips")
print()
print(f"At threshold 0.50: Precision={prec:.2f}  Recall={rec:.2f}  F1={f1:.2f}  Acc={acc:.2f}")
yp_opt = (all_scores >= best_thresh).astype(int)
_, _, _, _, p_opt, r_opt, f_opt, a_opt = compute_metrics(all_labels, yp_opt)
print(f"At threshold {best_thresh:.2f}: Precision={p_opt:.2f}  Recall={r_opt:.2f}  F1={f_opt:.2f}  Acc={a_opt:.2f}")
print()
print(f"ROC AUC = {auc:.3f} (1.0 = perfect, 0.5 = random)")
print()
print("For conservation: you'd lower threshold further to maximize recall,")
print("accepting more false alarms to catch more real elephant events.")`,
      challenge: 'Change the class balance to 20 elephant calls and 480 noise clips. What happens to precision at the default threshold? This is the class imbalance problem that plagues all real-world detection systems.',
      successHint: 'Accuracy is the first metric beginners learn and the first one experts distrust. Precision, recall, F1, and AUC tell the full story. In any real ML system, you will spend more time on evaluation than on model building.',
    },
    {
      title: 'From k-NN to neural networks — perceptrons, gradient descent, and the path to deep learning',
      concept: `k-NN stores all training data and computes distances at prediction time. It works, but it does not **learn** a compact representation. A neural network does the opposite: it compresses the training data into a set of **weights** that encode the decision boundary.

The simplest neural network is the **perceptron**: a single neuron that computes a weighted sum of inputs, adds a bias, and passes the result through an activation function.

output = activation(w1*x1 + w2*x2 + ... + wn*xn + b)

The perceptron learns by adjusting its weights using **gradient descent**: measure the error, compute how each weight contributed to that error (the gradient), and nudge each weight in the direction that reduces the error. Repeat thousands of times.

What Level 4 would add:
- **Multiple layers**: stack perceptrons to learn non-linear boundaries (the "deep" in deep learning)
- **Backpropagation**: efficiently compute gradients through multiple layers
- **Activation functions**: ReLU, sigmoid, softmax — each with different properties
- **Convolutional layers**: specialized for spatial data (images, spectrograms)
- **Recurrent layers**: specialized for sequential data (audio, text)

The perceptron is where it all begins.`,
      analogy: 'A perceptron is like a judge at a talent show. Each act has several scores (singing, dancing, stage presence). The judge assigns personal importance weights to each category, sums the weighted scores, and if the total exceeds a threshold, the act advances. Training the perceptron is like the judge watching thousands of acts and gradually adjusting their weights based on which acts the audience actually liked.',
      storyConnection: 'The girl who spoke to elephants eventually developed an intuitive "model" in her brain — a neural network of billions of neurons, trained over years of listening. Her brain did not store every elephant call she ever heard (that would be k-NN). Instead, it extracted patterns and compressed them into synaptic weights. We are building the simplest possible version of what her brain does.',
      checkQuestion: 'A single perceptron can learn AND, OR, and NOT logic gates. Why can it NOT learn XOR? (Hint: plot the truth table of XOR in 2D.)',
      checkAnswer: 'XOR is not linearly separable. The points (0,0)=0 and (1,1)=0 are diagonal from (0,1)=1 and (1,0)=1. No single straight line can separate the 0s from the 1s. A perceptron can only draw linear boundaries. You need at least 2 layers (a hidden layer) to solve XOR — this is what motivated the invention of multi-layer perceptrons (MLPs).',
      codeIntro: 'Implement a perceptron from scratch with gradient descent. Train it on the elephant/bird classification problem and visualize the learning process.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 2D elephant vs bird data (same feature space as earlier)
n = 100
elephant = np.column_stack([
    np.random.normal(-1.5, 0.6, n),  # normalized centroid
    np.random.normal(-1.5, 0.6, n)   # normalized zcr
])
bird = np.column_stack([
    np.random.normal(1.5, 0.6, n),
    np.random.normal(1.5, 0.6, n)
])
X = np.vstack([elephant, bird])
y = np.array([0]*n + [1]*n).astype(float)

# Shuffle
idx = np.random.permutation(len(y))
X, y = X[idx], y[idx]

class Perceptron:
    def __init__(self, n_features, learning_rate=0.1):
        self.w = np.random.randn(n_features) * 0.01
        self.b = 0.0
        self.lr = learning_rate
        self.loss_history = []
        self.accuracy_history = []
        self.weight_history = []

    def sigmoid(self, z):
        z = np.clip(z, -500, 500)
        return 1.0 / (1.0 + np.exp(-z))

    def forward(self, X):
        return self.sigmoid(X @ self.w + self.b)

    def compute_loss(self, X, y):
        """Binary cross-entropy loss."""
        y_hat = self.forward(X)
        y_hat = np.clip(y_hat, 1e-10, 1 - 1e-10)
        return -np.mean(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))

    def train_step(self, X, y):
        """One step of gradient descent."""
        m = len(y)
        y_hat = self.forward(X)
        error = y_hat - y  # (m,)

        # Gradients
        dw = (1/m) * (X.T @ error)       # (n_features,)
        db = (1/m) * np.sum(error)        # scalar

        # Update weights
        self.w -= self.lr * dw
        self.b -= self.lr * db

        # Track metrics
        loss = self.compute_loss(X, y)
        preds = (y_hat >= 0.5).astype(float)
        acc = np.mean(preds == y)
        self.loss_history.append(loss)
        self.accuracy_history.append(acc)
        self.weight_history.append((self.w.copy(), self.b))

        return loss, acc

    def fit(self, X, y, epochs=200):
        for epoch in range(epochs):
            loss, acc = self.train_step(X, y)
        return self

# Train
model = Perceptron(n_features=2, learning_rate=0.5)
model.fit(X, y, epochs=200)

# Final predictions
y_hat = model.forward(X)
y_pred = (y_hat >= 0.5).astype(float)
final_acc = np.mean(y_pred == y)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Training loss
axes[0, 0].plot(model.loss_history, color='#ef4444', linewidth=1.5)
axes[0, 0].set_xlabel('Epoch', color='white')
axes[0, 0].set_ylabel('Loss', color='white')
axes[0, 0].set_title('Training loss (binary cross-entropy)', color='white', fontsize=10)

# Plot 2: Training accuracy
axes[0, 1].plot(model.accuracy_history, color='#22c55e', linewidth=1.5)
axes[0, 1].set_xlabel('Epoch', color='white')
axes[0, 1].set_ylabel('Accuracy', color='white')
axes[0, 1].set_title('Training accuracy', color='white', fontsize=10)
axes[0, 1].set_ylim(0, 1.05)

# Plot 3: Weight evolution
w_hist = np.array([wh[0] for wh in model.weight_history])
b_hist = np.array([wh[1] for wh in model.weight_history])
axes[0, 2].plot(w_hist[:, 0], color='#3b82f6', linewidth=1.5, label='w1 (centroid)')
axes[0, 2].plot(w_hist[:, 1], color='#f59e0b', linewidth=1.5, label='w2 (zcr)')
axes[0, 2].plot(b_hist, color='#a855f7', linewidth=1.5, label='bias')
axes[0, 2].set_xlabel('Epoch', color='white')
axes[0, 2].set_ylabel('Value', color='white')
axes[0, 2].set_title('Weight evolution during training', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Decision boundary at epoch 5
ax = axes[1, 0]
h = 0.05
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
mesh = np.column_stack([xx.ravel(), yy.ravel()])

early_w, early_b = model.weight_history[4]
Z_early = (1.0 / (1.0 + np.exp(-(mesh @ early_w + early_b))) >= 0.5).astype(int).reshape(xx.shape)
color_array = np.zeros((*Z_early.shape, 3))
color_array[Z_early == 0] = (0.13, 0.77, 0.37)
color_array[Z_early == 1] = (0.96, 0.62, 0.04)
ax.imshow(color_array, extent=[x_min, x_max, y_min, y_max], origin='lower', alpha=0.3, aspect='auto')
ax.scatter(X[y == 0, 0], X[y == 0, 1], c='#22c55e', s=15, edgecolors='none', label='Elephant')
ax.scatter(X[y == 1, 0], X[y == 1, 1], c='#f59e0b', s=15, edgecolors='none', label='Bird')
ax.set_title('Boundary at epoch 5', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Decision boundary at epoch 50
ax = axes[1, 1]
mid_w, mid_b = model.weight_history[49]
Z_mid = (1.0 / (1.0 + np.exp(-(mesh @ mid_w + mid_b))) >= 0.5).astype(int).reshape(xx.shape)
color_array = np.zeros((*Z_mid.shape, 3))
color_array[Z_mid == 0] = (0.13, 0.77, 0.37)
color_array[Z_mid == 1] = (0.96, 0.62, 0.04)
ax.imshow(color_array, extent=[x_min, x_max, y_min, y_max], origin='lower', alpha=0.3, aspect='auto')
ax.scatter(X[y == 0, 0], X[y == 0, 1], c='#22c55e', s=15, edgecolors='none')
ax.scatter(X[y == 1, 0], X[y == 1, 1], c='#f59e0b', s=15, edgecolors='none')
ax.set_title('Boundary at epoch 50', color='white', fontsize=10)

# Plot 6: Final decision boundary
ax = axes[1, 2]
Z_final = (model.forward(mesh) >= 0.5).astype(int).reshape(xx.shape)
color_array = np.zeros((*Z_final.shape, 3))
color_array[Z_final == 0] = (0.13, 0.77, 0.37)
color_array[Z_final == 1] = (0.96, 0.62, 0.04)
ax.imshow(color_array, extent=[x_min, x_max, y_min, y_max], origin='lower', alpha=0.3, aspect='auto')
ax.scatter(X[y == 0, 0], X[y == 0, 1], c='#22c55e', s=15, edgecolors='none')
ax.scatter(X[y == 1, 0], X[y == 1, 1], c='#f59e0b', s=15, edgecolors='none')
ax.set_title(f'Final boundary (acc={final_acc:.1%})', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Perceptron: {len(model.w)} weights + 1 bias = {len(model.w)+1} learnable parameters")
print(f"Final: w1={model.w[0]:.3f}, w2={model.w[1]:.3f}, b={model.b:.3f}")
print(f"Final accuracy: {final_acc:.1%}")
print()
print("Compare to k-NN:")
print(f"  k-NN stores ALL {len(X)} training points ({len(X)*2} numbers)")
print(f"  Perceptron stores just 3 numbers (2 weights + 1 bias)")
print(f"  Same accuracy, 1000x compression. That's the power of learning.")
print()
print("What a multi-layer network adds (Level 4):")
print("  - Non-linear boundaries (circles, spirals, any shape)")
print("  - Hierarchical features (edges -> textures -> objects)")
print("  - Millions of parameters for complex problems (images, audio)")
print("  - But the same core idea: gradient descent on a loss function.")`,
      challenge: 'Generate the concentric circles dataset from the previous lesson and try to train the perceptron on it. It will fail — why? Then try adding a feature: x1^2 + x2^2 (the radius squared). The perceptron can now separate the circles. This is the kernel trick — transforming features to make them linearly separable.',
      successHint: 'You have gone from raw audio to spectral features, through train/test methodology, k-NN classification, decision boundaries, rigorous evaluation, and now the foundation of neural networks. Level 4 would take the perceptron and stack it into a deep network. You already understand the core mechanics. The rest is scale.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (signal processing fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real ML implementations. Click to start.</p>
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
