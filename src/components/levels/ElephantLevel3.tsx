import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ElephantFeaturesDiagram from '../diagrams/ElephantFeaturesDiagram';
import ElephantTrainTestDiagram from '../diagrams/ElephantTrainTestDiagram';
import ElephantKNNDiagram from '../diagrams/ElephantKNNDiagram';
import ElephantBoundaryDiagram from '../diagrams/ElephantBoundaryDiagram';
import ElephantConfusionDiagram from '../diagrams/ElephantConfusionDiagram';
import ElephantPerceptronDiagram from '../diagrams/ElephantPerceptronDiagram';

export default function ElephantLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

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
      codeIntro: 'Compute spectral features for elephant and bird sounds — compressing 44,000 numbers into 4.',
      code: `import numpy as np

sr = 22050
t = np.linspace(0, 2, sr * 2, endpoint=False)

# Elephant: low rumble (25 Hz + harmonics)
elephant = 0.6*np.sin(2*np.pi*25*t) + 0.3*np.sin(2*np.pi*50*t) + 0.05*np.random.randn(len(t))
# Bird: high call (3000 Hz with FM)
bird = 0.5*np.sin(2*np.pi*3000*t + 4*np.sin(2*np.pi*8*t)) + 0.03*np.random.randn(len(t))

def extract_features(signal, sample_rate):
    # FFT on a windowed frame from the middle
    frame = signal[len(signal)//2 - 1024 : len(signal)//2 + 1024] * np.hanning(2048)
    spectrum = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(2048, 1/sample_rate)

    p = spectrum / (spectrum.sum() + 1e-10)  # normalize as distribution
    centroid = np.sum(freqs * p)               # weighted mean frequency
    bandwidth = np.sqrt(np.sum((freqs - centroid)**2 * p))  # spread
    rolloff_idx = np.searchsorted(np.cumsum(spectrum), 0.85 * spectrum.sum())
    rolloff = freqs[min(rolloff_idx, len(freqs)-1)]   # 85% energy cutoff
    zcr = np.mean(np.abs(np.diff(np.sign(signal)))) / 2  # zero crossings

    return centroid, bandwidth, rolloff, zcr

e = extract_features(elephant, sr)
b = extract_features(bird, sr)

print(f"{'Feature':<20} {'Elephant':>10} {'Bird':>10}")
print("-" * 42)
for name, ev, bv in [("Centroid (Hz)", e[0], b[0]),
                      ("Bandwidth (Hz)", e[1], b[1]),
                      ("Rolloff (Hz)", e[2], b[2]),
                      ("Zero-crossing", e[3], b[3])]:
    print(f"{name:<20} {ev:>10.1f} {bv:>10.1f}")

print("\
44,100 samples → 4 numbers. That's feature engineering.")`,
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
      codeIntro: 'Split data into train and test sets, then see what happens when a model "cheats" by seeing the test data.',
      code: `import numpy as np

np.random.seed(42)
n = 100  # per class

# Elephant features (low centroid, low zcr)
elephant = np.column_stack([np.random.normal(80, 30, n), np.random.normal(0.02, 0.008, n)])
bird = np.column_stack([np.random.normal(3500, 800, n), np.random.normal(0.35, 0.08, n)])

X = np.vstack([elephant, bird])
y = np.array([0]*n + [1]*n)

# Shuffle and split: 80% train, 20% test
idx = np.random.permutation(len(y))
split = int(0.8 * len(y))
X_train, X_test = X[idx[:split]], X[idx[split:]]
y_train, y_test = y[idx[:split]], y[idx[split:]]

# Simple classifier: assign to nearest class centroid
def classify(X_tr, y_tr, X_eval):
    c0 = X_tr[y_tr == 0].mean(axis=0)
    c1 = X_tr[y_tr == 1].mean(axis=0)
    d0 = np.linalg.norm(X_eval - c0, axis=1)
    d1 = np.linalg.norm(X_eval - c1, axis=1)
    return (d1 < d0).astype(int)

train_acc = np.mean(classify(X_train, y_train, X_train) == y_train)
test_acc = np.mean(classify(X_train, y_train, X_test) == y_test)

# 5-fold cross-validation
fold_accs = []
fold_size = len(y) // 5
for i in range(5):
    te = idx[i*fold_size:(i+1)*fold_size]
    tr = np.concatenate([idx[:i*fold_size], idx[(i+1)*fold_size:]])
    preds = classify(X[tr], y[tr], X[te])
    fold_accs.append(np.mean(preds == y[te]))

print(f"Train accuracy: {train_acc:.1%} (sees all training data)")
print(f"Test accuracy:  {test_acc:.1%} (unseen data)")
print(f"5-fold CV:      {np.mean(fold_accs):.1%} ± {np.std(fold_accs):.1%}")
print(f"  Folds: {', '.join(f'{a:.1%}' for a in fold_accs)}")
print()
print("If train >> test, the model is overfitting (memorizing, not learning).")`,
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
      codeIntro: 'Build k-NN from scratch — find neighbors, let them vote, and pick the best k.',
      code: `import numpy as np

np.random.seed(42)
n = 60

# 3-class dataset: elephant, bird, insect (2 features each)
elephant = np.column_stack([np.random.normal(80, 25, n), np.random.normal(0.02, 0.007, n)])
bird = np.column_stack([np.random.normal(3500, 600, n), np.random.normal(0.35, 0.06, n)])
insect = np.column_stack([np.random.normal(1500, 400, n), np.random.normal(0.15, 0.04, n)])

X = np.vstack([elephant, bird, insect])
y = np.array([0]*n + [1]*n + [2]*n)

# Normalize (z-score) so both features matter equally
X = (X - X.mean(axis=0)) / X.std(axis=0)

# Train/test split
idx = np.random.permutation(len(y))
X_tr, X_te = X[idx[:144]], X[idx[144:]]
y_tr, y_te = y[idx[:144]], y[idx[144:]]

def knn_predict(X_train, y_train, X_new, k=5):
    preds = []
    for x in X_new:
        dists = np.sqrt(np.sum((X_train - x)**2, axis=1))
        nearest = y_train[np.argsort(dists)[:k]]
        classes, counts = np.unique(nearest, return_counts=True)
        preds.append(classes[np.argmax(counts)])
    return np.array(preds)

# Try different k values
for k in [1, 3, 5, 11, 21]:
    train_acc = np.mean(knn_predict(X_tr, y_tr, X_tr, k) == y_tr)
    test_acc = np.mean(knn_predict(X_tr, y_tr, X_te, k) == y_te)
    print(f"k={k:2d}  train={train_acc:.1%}  test={test_acc:.1%}"
          f"  {'← overfits' if k == 1 else '← best' if k == 5 else ''}")

print("\
k=1: memorizes noise. k=21: too smooth. k=5: sweet spot.")
print("The algorithm: find k nearest, let them vote. That's it.")`,
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
      codeIntro: 'Compare k=1 (jagged, overfitting) vs k=15 (smooth) decision boundaries on elephant data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n = 80

# Elephant vs bird (2D for visualization)
X = np.vstack([
    np.column_stack([np.random.normal(-1.5, 0.8, n), np.random.normal(-1.5, 0.8, n)]),
    np.column_stack([np.random.normal(1.5, 0.8, n), np.random.normal(1.5, 0.8, n)])
])
y = np.array([0]*n + [1]*n)

def knn_grid(X, y, k, xx, yy):
    mesh = np.column_stack([xx.ravel(), yy.ravel()])
    preds = []
    for pt in mesh:
        dists = np.sqrt(np.sum((X - pt)**2, axis=1))
        nearest = y[np.argsort(dists)[:k]]
        cls, cnt = np.unique(nearest, return_counts=True)
        preds.append(cls[np.argmax(cnt)])
    return np.array(preds).reshape(xx.shape)

h = 0.1
xx, yy = np.meshgrid(np.arange(-4, 4, h), np.arange(-4, 4, h))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

for ax, k, title in [(ax1, 1, 'k=1 (overfitting)'), (ax2, 15, 'k=15 (smooth)')]:
    Z = knn_grid(X, y, k, xx, yy)
    colors = np.zeros((*Z.shape, 3))
    colors[Z == 0] = (0.13, 0.77, 0.37)
    colors[Z == 1] = (0.96, 0.62, 0.04)
    ax.imshow(colors, extent=[-4,4,-4,4], origin='lower', alpha=0.3, aspect='auto')
    ax.scatter(X[y==0,0], X[y==0,1], c='#22c55e', s=15, label='Elephant')
    ax.scatter(X[y==1,0], X[y==1,1], c='#f59e0b', s=15, label='Bird')
    ax.set_title(title, color='white')
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("k=1: jagged boundary follows every point (including noise)")
print("k=15: smooth boundary captures the real pattern")
print("More neighbors = smoother = better generalization")`,
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
      codeIntro: 'Compute the confusion matrix, precision, recall, and F1 for an elephant detector — and see why accuracy lies.',
      code: `import numpy as np

np.random.seed(42)

# Realistic scenario: 500 audio clips, only 50 are elephant calls
n_pos, n_neg = 50, 450
scores = np.concatenate([np.random.beta(5, 2, n_pos), np.random.beta(2, 5, n_neg)])
labels = np.array([1]*n_pos + [0]*n_neg)
idx = np.random.permutation(500)
scores, labels = scores[idx], labels[idx]

def evaluate(y_true, y_pred):
    tp = np.sum((y_pred == 1) & (y_true == 1))
    fp = np.sum((y_pred == 1) & (y_true == 0))
    fn = np.sum((y_pred == 0) & (y_true == 1))
    tn = np.sum((y_pred == 0) & (y_true == 0))
    prec = tp / (tp + fp) if (tp + fp) else 0
    rec = tp / (tp + fn) if (tp + fn) else 0
    f1 = 2*prec*rec / (prec + rec) if (prec + rec) else 0
    acc = (tp + tn) / len(y_true)
    return tp, fp, fn, tn, prec, rec, f1, acc

# Compare three thresholds
for thresh in [0.5, 0.35, 0.2]:
    preds = (scores >= thresh).astype(int)
    tp, fp, fn, tn, prec, rec, f1, acc = evaluate(labels, preds)

    print(f"--- Threshold = {thresh} ---")
    print(f"  TP={tp:3d}  FP={fp:3d}  (precision={prec:.2f})")
    print(f"  FN={fn:3d}  TN={tn:3d}  (recall={rec:.2f})")
    print(f"  F1={f1:.2f}  Accuracy={acc:.2f}")
    print(f"  Missed elephants: {fn} out of {n_pos}")
    print()

print("Lower threshold → more false alarms but fewer missed elephants.")
print("For poaching detection, high recall matters most.")`,
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
      codeIntro: 'Train a perceptron from scratch — the simplest neural network. Watch it learn to separate elephants from birds.',
      code: `import numpy as np

np.random.seed(42)
n = 100

# Elephant vs bird (2 features, normalized)
X = np.vstack([np.random.normal(-1.5, 0.6, (n, 2)),
               np.random.normal( 1.5, 0.6, (n, 2))])
y = np.array([0.0]*n + [1.0]*n)
idx = np.random.permutation(len(y))
X, y = X[idx], y[idx]

# The perceptron: weighted sum → sigmoid → prediction
def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

w = np.random.randn(2) * 0.01  # 2 weights
b = 0.0                         # 1 bias
lr = 0.5                        # learning rate

# Train with gradient descent
for epoch in range(200):
    y_hat = sigmoid(X @ w + b)         # predict
    error = y_hat - y                   # how wrong?
    w -= lr * (X.T @ error) / len(y)   # nudge weights
    b -= lr * error.mean()              # nudge bias

# Results
preds = (sigmoid(X @ w + b) >= 0.5).astype(float)
acc = np.mean(preds == y)

print(f"Learned weights: w1={w[0]:.3f}, w2={w[1]:.3f}, bias={b:.3f}")
print(f"Accuracy: {acc:.1%}")
print(f"\
The entire model is 3 numbers (2 weights + 1 bias).")
print(f"k-NN stored {len(X)*2} numbers for the same task.")
print(f"That's the power of learning: compress data into weights.")
print(f"\
Level 4 stacks many perceptrons → deep neural network.")`,
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
            diagram={[ElephantFeaturesDiagram, ElephantTrainTestDiagram, ElephantKNNDiagram, ElephantBoundaryDiagram, ElephantConfusionDiagram, ElephantPerceptronDiagram][i] ? createElement([ElephantFeaturesDiagram, ElephantTrainTestDiagram, ElephantKNNDiagram, ElephantBoundaryDiagram, ElephantConfusionDiagram, ElephantPerceptronDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
