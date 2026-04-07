import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudNamerLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Supervised classification — teaching a computer to sort',
      concept: `In Level 1, humans classified things: clouds by shape, organisms by traits. In Level 2, we teach **computers** to classify. The most common approach is **supervised classification**: you give the computer labeled examples, and it learns the rules.

Steps:
1. **Collect data**: measurements of the things you want to classify
2. **Label it**: tell the computer which class each example belongs to (training data)
3. **Train a model**: the algorithm finds patterns that distinguish the classes
4. **Test it**: give the model new, unlabeled data and see if it classifies correctly

Example: classifying iris flowers by petal and sepal measurements. This is the "Hello, World" of machine learning, created by Ronald Fisher in 1936. Three species, four measurements, 150 samples — and a computer can learn to distinguish them with >95% accuracy.`,
      analogy: 'Supervised classification is like training a new employee at a sorting facility. You show them examples: "This goes in bin A, this in bin B." After enough examples, they can sort new items on their own. The more examples, the better they get. Machine learning is the same — but the "employee" is an algorithm.',
      storyConnection: 'The child who named the clouds was doing supervised classification by hand — she learned from examples (someone pointed out cumulus vs. stratus) and then applied those rules to new clouds. Machine learning automates this process, handling millions of examples instead of a few.',
      checkQuestion: 'If you train a classifier on only pictures of dogs and cats, and then show it a picture of a horse, what happens?',
      checkAnswer: 'It will classify the horse as either a dog or a cat — whichever it resembles more in the features the model learned. The model has no concept of "none of the above." This is a fundamental limitation of supervised classification: it can only recognize classes it was trained on. Handling unknown classes requires special techniques like anomaly detection.',
      codeIntro: 'Implement supervised classification on the Iris dataset from scratch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate synthetic iris-like data (3 species, 2 features)
n = 50
setosa = np.random.multivariate_normal([1.5, 0.3], [[0.1, 0.02],[0.02, 0.02]], n)
versicolor = np.random.multivariate_normal([4.3, 1.3], [[0.2, 0.05],[0.05, 0.08]], n)
virginica = np.random.multivariate_normal([5.5, 2.0], [[0.3, 0.1],[0.1, 0.12]], n)

X = np.vstack([setosa, versicolor, virginica])
y = np.array([0]*n + [1]*n + [2]*n)

# Simple nearest-centroid classifier
centroids = np.array([X[y==i].mean(axis=0) for i in range(3)])

# Classify by nearest centroid
def classify(point, centroids):
    dists = np.sqrt(((centroids - point)**2).sum(axis=1))
    return np.argmin(dists)

# Create decision boundary mesh
xx, yy = np.meshgrid(np.linspace(0, 7, 200), np.linspace(-0.5, 3, 200))
grid = np.c_[xx.ravel(), yy.ravel()]
Z = np.array([classify(p, centroids) for p in grid]).reshape(xx.shape)

fig, ax = plt.subplots(figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

colors = ['#22c55e', '#3b82f6', '#a855f7']
names = ['Setosa', 'Versicolor', 'Virginica']

ax.contourf(xx, yy, Z, alpha=0.15, colors=colors, levels=[-0.5, 0.5, 1.5, 2.5])

for i, (name, color) in enumerate(zip(names, colors)):
    mask = y == i
    ax.scatter(X[mask, 0], X[mask, 1], c=color, label=name, s=30, alpha=0.7, edgecolors='white', linewidths=0.5)

for i, (name, color) in enumerate(zip(names, colors)):
    ax.plot(centroids[i, 0], centroids[i, 1], '*', color=color, markersize=20, markeredgecolor='white', markeredgewidth=1.5)

ax.set_xlabel('Petal length (cm)', color='white')
ax.set_ylabel('Petal width (cm)', color='white')
ax.set_title('Supervised Classification — Nearest Centroid', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate accuracy
predictions = np.array([classify(p, centroids) for p in X])
accuracy = (predictions == y).mean()
print(f"Nearest centroid accuracy: {accuracy:.1%}")
print(f"Stars = centroids (class centers)")
print(f"Colored regions = decision boundaries")
print(f"A new point is classified to the nearest star.")`,
      challenge: 'What happens if you add noise by increasing the covariance? Change [[0.1, 0.02],[0.02, 0.02]] to [[0.5, 0.1],[0.1, 0.5]] for setosa. How does accuracy change?',
      successHint: 'Nearest centroid is the simplest classifier, but the principle — learn from labeled examples, find boundaries — is the foundation of all supervised learning.',
    },
    {
      title: 'Decision trees — classification as a flowchart',
      concept: `A **decision tree** is the machine learning version of the dichotomous key from Level 1. It asks a series of questions about the data, splitting it into smaller and smaller groups until each group contains only one class.

How a decision tree learns:
1. Look at all features (measurements)
2. Find the **best split**: the feature and threshold that most cleanly separates the classes
3. Split the data into two groups
4. Repeat for each group until the groups are pure (all one class) or you hit a stopping rule

The "best split" is measured by **information gain** or **Gini impurity**:
- **Gini impurity** = probability that a randomly chosen item would be misclassified
- A pure group (all one class) has Gini = 0
- A maximally mixed group has Gini = 0.5 (for 2 classes)

Decision trees are popular because they're **interpretable** — you can see exactly why the model made each decision.`,
      analogy: 'A decision tree is like a game of Akinator (the web genie that guesses who you\'re thinking of). It asks questions that eliminate the most possibilities at each step. The better the questions, the fewer steps needed. In a decision tree, the algorithm chooses the "questions" (feature thresholds) that maximize information gain.',
      storyConnection: 'The child who named the clouds built a mental decision tree: "Is it high up? → cirrus family. Is it puffy? → cumulus. Is it flat and gray? → stratus." A machine learning decision tree does the same thing, but finds the optimal questions automatically from data.',
      checkQuestion: 'A decision tree trained on a dataset achieves 100% accuracy on the training data. Is this good?',
      checkAnswer: 'Not necessarily — it might be overfitting. If the tree is too deep, it memorizes the training data (including noise) rather than learning general patterns. It would perform poorly on new data. This is like a student who memorizes exam answers without understanding the concepts — they\'ll fail on different questions.',
      codeIntro: 'Build a decision tree classifier from scratch and visualize the splits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Two classes: circles and squares in 2D space
n = 80
class_a = np.random.randn(n, 2) * 0.8 + np.array([2, 2])
class_b = np.random.randn(n, 2) * 0.8 + np.array([4, 4])
# Add some overlap
class_a = np.vstack([class_a, np.random.randn(20, 2) * 0.5 + np.array([3.5, 2.5])])
class_b = np.vstack([class_b, np.random.randn(20, 2) * 0.5 + np.array([2.5, 3.5])])

X = np.vstack([class_a, class_b])
y = np.array([0]*len(class_a) + [1]*len(class_b))

def gini(y):
    if len(y) == 0: return 0
    p = np.bincount(y, minlength=2) / len(y)
    return 1 - np.sum(p**2)

def best_split(X, y):
    best_gain, best_feat, best_thresh = -1, 0, 0
    parent_gini = gini(y)
    for feat in range(X.shape[1]):
        thresholds = np.percentile(X[:, feat], np.arange(10, 100, 10))
        for thresh in thresholds:
            left = y[X[:, feat] <= thresh]
            right = y[X[:, feat] > thresh]
            if len(left) == 0 or len(right) == 0: continue
            gain = parent_gini - (len(left)*gini(left) + len(right)*gini(right)) / len(y)
            if gain > best_gain:
                best_gain, best_feat, best_thresh = gain, feat, thresh
    return best_feat, best_thresh, best_gain

# Find first 3 splits
feat1, thresh1, gain1 = best_split(X, y)
mask_l = X[:, feat1] <= thresh1
feat2, thresh2, gain2 = best_split(X[mask_l], y[mask_l])
feat3, thresh3, gain3 = best_split(X[~mask_l], y[~mask_l])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: data with decision boundaries
ax1.set_facecolor('#111827')
ax1.scatter(X[y==0, 0], X[y==0, 1], c='#22c55e', label='Class A', s=20, alpha=0.6)
ax1.scatter(X[y==1, 0], X[y==1, 1], c='#3b82f6', label='Class B', s=20, alpha=0.6)

feat_names = ['X₁', 'X₂']
if feat1 == 0:
    ax1.axvline(thresh1, color='#f59e0b', linewidth=2, linestyle='--', label=f'Split 1: {feat_names[feat1]}={thresh1:.1f}')
else:
    ax1.axhline(thresh1, color='#f59e0b', linewidth=2, linestyle='--', label=f'Split 1: {feat_names[feat1]}={thresh1:.1f}')

ax1.set_xlabel('Feature X₁', color='white')
ax1.set_ylabel('Feature X₂', color='white')
ax1.set_title('Decision Tree Splits on Data', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Right: Gini impurity at each split
ax2.set_facecolor('#111827')
splits = ['Parent', 'After Split 1\\\n(left)', 'After Split 1\\\n(right)']
gini_values = [gini(y), gini(y[mask_l]), gini(y[~mask_l])]
colors = ['#f59e0b', '#22c55e', '#3b82f6']
bars = ax2.bar(splits, gini_values, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)

for bar, val in zip(bars, gini_values):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
             f'{val:.3f}', ha='center', color='white', fontsize=11, fontweight='bold')

ax2.set_ylabel('Gini Impurity', color='white')
ax2.set_title('Gini Impurity Decreases with Each Split', color='white', fontsize=12)
ax2.set_ylim(0, 0.6)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Best first split: Feature {feat_names[feat1]} at {thresh1:.2f}")
print(f"  Information gain: {gain1:.4f}")
print(f"  Parent Gini: {gini(y):.4f}")
print(f"  Left child Gini: {gini(y[mask_l]):.4f} ({mask_l.sum()} samples)")
print(f"  Right child Gini: {gini(y[~mask_l]):.4f} ({(~mask_l).sum()} samples)")`,
      challenge: 'Increase the overlap between classes (move class_b center from [4,4] to [3,3]). How does this affect the Gini impurity and the quality of the splits?',
      successHint: 'Decision trees are the workhorse of interpretable ML. Random forests (500+ trees voting together) are one of the most powerful algorithms in data science — and they\'re just many decision trees combined.',
    },
    {
      title: 'K-means clustering — unsupervised classification',
      concept: `What if you don't have labels? What if nobody told you which class each data point belongs to? Then you need **unsupervised classification** — finding structure in data without a teacher.

**K-means clustering** is the simplest approach:
1. Choose K (the number of clusters you want)
2. Place K random "centroids" in the data space
3. Assign each data point to the nearest centroid
4. Move each centroid to the center of its assigned points
5. Repeat steps 3-4 until centroids stop moving

The algorithm converges when no points change their cluster assignment. The result: K groups of similar data points, discovered without any labels.

The big question: how do you choose K? Common methods include the **elbow method** (plot distortion vs. K, look for the "elbow"), and the **silhouette score** (measures how well each point fits its cluster).`,
      analogy: 'K-means is like a teacher dividing students into study groups without knowing their grades. She randomly assigns group leaders, students join the nearest leader, the leader moves to the center of their group, and the process repeats. Eventually, similar students end up together — not because the teacher knew their abilities, but because the algorithm found natural groupings.',
      storyConnection: 'Imagine the cloud-naming child had never seen a cloud classification book. She\'d still notice natural groupings — some clouds are puffy, some flat, some wispy. K-means is the mathematical version of this natural instinct to see patterns in unlabeled data.',
      checkQuestion: 'You run K-means with K=3 on data that actually has 5 natural clusters. What happens?',
      checkAnswer: 'The algorithm will merge some natural clusters together. Two clusters might be forced into one group because you told it to find only 3. This is why choosing K is critical — too few clusters loses real structure, too many creates artificial divisions. The elbow method and silhouette score help find the right K.',
      codeIntro: 'Implement K-means from scratch and watch it converge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 3 natural clusters
c1 = np.random.randn(60, 2) * 0.7 + [2, 2]
c2 = np.random.randn(60, 2) * 0.8 + [7, 3]
c3 = np.random.randn(60, 2) * 0.6 + [4, 7]
X = np.vstack([c1, c2, c3])

K = 3
# Initialize centroids randomly from data points
idx = np.random.choice(len(X), K, replace=False)
centroids = X[idx].copy()

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
cluster_colors = ['#22c55e', '#3b82f6', '#f59e0b']

for iteration in range(6):
    ax = axes[iteration // 3][iteration % 3]
    ax.set_facecolor('#111827')

    # Assign points to nearest centroid
    dists = np.sqrt(((X[:, None, :] - centroids[None, :, :])**2).sum(axis=2))
    labels = np.argmin(dists, axis=1)

    # Plot
    for k in range(K):
        mask = labels == k
        ax.scatter(X[mask, 0], X[mask, 1], c=cluster_colors[k], s=15, alpha=0.5)
        ax.plot(centroids[k, 0], centroids[k, 1], '*', color=cluster_colors[k],
                markersize=15, markeredgecolor='white', markeredgewidth=1.5)

    ax.set_title(f'Iteration {iteration + 1}', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 10)

    # Update centroids
    new_centroids = np.array([X[labels == k].mean(axis=0) for k in range(K)])
    movement = np.sqrt(((centroids - new_centroids)**2).sum())
    centroids = new_centroids.copy()

    ax.text(0.02, 0.98, f'Movement: {movement:.2f}', transform=ax.transAxes,
            color='#9ca3af', fontsize=8, va='top')

plt.suptitle('K-Means Clustering — Watch It Converge', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("K-means algorithm:")
print("  1. Place K random centroids (stars)")
print("  2. Assign each point to nearest centroid")
print("  3. Move centroids to cluster centers")
print("  4. Repeat until centroids stop moving")
print()
print(f"Final centroids:")
for k in range(K):
    n_points = (labels == k).sum()
    print(f"  Cluster {k+1}: center=({centroids[k,0]:.1f}, {centroids[k,1]:.1f}), {n_points} points")`,
      challenge: 'Change K from 3 to 5. The data has 3 natural clusters, but K=5 forces it to find 5. What happens to the cluster boundaries? This demonstrates the importance of choosing the right K.',
      successHint: 'K-means is used everywhere: customer segmentation, image compression (reducing colors), document clustering, genome analysis. It\'s the gateway algorithm to unsupervised learning.',
    },
    {
      title: 'Confusion matrices — measuring classification accuracy',
      concept: `How do you know if your classifier is any good? You need a **confusion matrix** — a table that shows what the classifier predicted vs. what the true labels are.

For two classes (e.g., "spam" vs. "not spam"):

|                 | Predicted Spam | Predicted Not Spam |
|-----------------|:-:|:-:|
| **Actually Spam**     | True Positive (TP) | False Negative (FN) |
| **Actually Not Spam** | False Positive (FP) | True Negative (TN) |

Key metrics from the confusion matrix:
- **Accuracy** = (TP + TN) / Total — overall correctness
- **Precision** = TP / (TP + FP) — "of all I called spam, how many really were?"
- **Recall** = TP / (TP + FN) — "of all actual spam, how many did I catch?"
- **F1 score** = 2 × (Precision × Recall) / (Precision + Recall) — harmonic mean

The trade-off: high precision means few false alarms but might miss some real cases. High recall means catching everything but with more false alarms.`,
      analogy: 'Imagine a smoke detector. High recall means it catches every fire (but also goes off when you\'re cooking — false positives). High precision means it only goes off for real fires (but might miss a small one — false negatives). You want both, but there\'s always a trade-off. A confusion matrix quantifies exactly where your "detector" succeeds and fails.',
      storyConnection: 'If the cloud-naming child classified a cirrus cloud as cumulus, that would be a "false positive for cumulus" and a "false negative for cirrus." A confusion matrix for her cloud classification would show exactly which clouds she confuses most — probably cirrostratus vs. altostratus (they look similar).',
      checkQuestion: 'A medical test for a rare disease (1 in 10,000 people) has 99% accuracy. You test positive. What\'s the probability you actually have the disease?',
      checkAnswer: 'Only about 1%! This is the base rate fallacy. With 99% accuracy on 10,000 people: ~1 true positive, ~100 false positives (1% of 9,999 healthy people). So P(disease | positive) ≈ 1/101 ≈ 1%. Accuracy alone is misleading when classes are imbalanced — you need to look at the full confusion matrix.',
      codeIntro: 'Build and visualize a confusion matrix for a multi-class classifier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a 3-class classifier's predictions
classes = ['Cumulus', 'Stratus', 'Cirrus']
n_samples = 200

# True labels (balanced)
true = np.random.choice(3, n_samples, p=[0.35, 0.35, 0.3])

# Simulated predictions (mostly correct, some confusion)
pred = true.copy()
# Cumulus sometimes confused with stratus
confuse_mask = (true == 0) & (np.random.rand(n_samples) < 0.15)
pred[confuse_mask] = 1
# Stratus sometimes confused with cirrus
confuse_mask = (true == 1) & (np.random.rand(n_samples) < 0.12)
pred[confuse_mask] = 2
# Cirrus sometimes confused with stratus
confuse_mask = (true == 2) & (np.random.rand(n_samples) < 0.1)
pred[confuse_mask] = 1

# Build confusion matrix
cm = np.zeros((3, 3), dtype=int)
for t, p in zip(true, pred):
    cm[t, p] += 1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Confusion matrix heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(cm, cmap='YlGnBu', aspect='auto')
for i in range(3):
    for j in range(3):
        color = 'white' if cm[i, j] > cm.max()/2 else '#d1d5db'
        ax1.text(j, i, str(cm[i, j]), ha='center', va='center', color=color, fontsize=16, fontweight='bold')
ax1.set_xticks(range(3))
ax1.set_yticks(range(3))
ax1.set_xticklabels(classes, color='white')
ax1.set_yticklabels(classes, color='white')
ax1.set_xlabel('Predicted', color='white', fontsize=11)
ax1.set_ylabel('Actual', color='white', fontsize=11)
ax1.set_title('Confusion Matrix', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Per-class metrics
ax2.set_facecolor('#111827')
metrics = {}
for i, name in enumerate(classes):
    tp = cm[i, i]
    fp = cm[:, i].sum() - tp
    fn = cm[i, :].sum() - tp
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    metrics[name] = (precision, recall, f1)

x = np.arange(3)
width = 0.25
for i, (metric, color) in enumerate(zip(['Precision', 'Recall', 'F1'], ['#22c55e', '#3b82f6', '#f59e0b'])):
    vals = [metrics[c][i] for c in classes]
    ax2.bar(x + i*width, vals, width, label=metric, color=color, alpha=0.8)

ax2.set_xticks(x + width)
ax2.set_xticklabels(classes, color='white')
ax2.set_ylabel('Score', color='white')
ax2.set_title('Per-Class Metrics', color='white', fontsize=13)
ax2.set_ylim(0, 1.1)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

accuracy = np.trace(cm) / cm.sum()
print(f"Overall accuracy: {accuracy:.1%}")
print()
for name, (p, r, f) in metrics.items():
    print(f"  {name}: Precision={p:.2f}, Recall={r:.2f}, F1={f:.2f}")`,
      challenge: 'Make the classifier terrible at one class: set the confusion rate for Cirrus to 50% (change 0.1 to 0.5). How do the metrics for Cirrus change compared to the other classes?',
      successHint: 'A confusion matrix is the single most important diagnostic tool for any classifier. Always look at it before trusting an accuracy number — accuracy can be misleading, especially with imbalanced classes.',
    },
    {
      title: 'Taxonomy databases — digital classification at scale',
      concept: `Modern taxonomy is digital. The world's biodiversity data lives in massive databases:

- **NCBI Taxonomy**: 2.3 million species, linked to DNA sequences (GenBank)
- **GBIF** (Global Biodiversity Information Facility): 2.3 billion occurrence records
- **IUCN Red List**: conservation status of 150,000+ species
- **Catalogue of Life**: aims to list every known species (~2 million)
- **BOLD** (Barcode of Life Data): DNA barcodes for species identification

These databases allow:
- **DNA barcoding**: identify a species from a short DNA sequence (~650 base pairs of the COI gene for animals)
- **Phylogenetic analysis**: build evolutionary trees from DNA comparisons
- **Biodiversity monitoring**: track species distributions over time
- **Conservation planning**: identify endangered species and critical habitats

The key insight: classification isn't just academic — it's the backbone of conservation, agriculture, medicine, and environmental policy.`,
      analogy: 'Taxonomy databases are like the DNS (Domain Name System) of the internet. DNS maps human-readable names (google.com) to machine-readable addresses (142.250.80.46). Taxonomy databases map species names to DNA sequences, locations, conservation status, and evolutionary relationships. Without DNS, the internet doesn\'t work. Without taxonomy databases, biology doesn\'t work.',
      storyConnection: 'The child who named the clouds kept her classifications in her head. Modern taxonomy keeps them in databases with millions of entries, cross-referenced with DNA sequences, photographs, geographic coordinates, and ecological data. The instinct is the same — the scale is planetary.',
      checkQuestion: 'A researcher finds an unknown insect in Assam. How would they use DNA barcoding to identify it?',
      checkAnswer: 'Extract DNA from the insect, sequence the COI gene (~650 bp), and search the BOLD database for matches. If a >97% match exists, the species is identified. If not, it might be a new species — which happens more often than you\'d think. About 80% of insect species are still undescribed.',
      codeIntro: 'Simulate a DNA barcoding database search.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate DNA barcodes (simplified: 100 positions, 4 bases)
bases = ['A', 'T', 'C', 'G']

def generate_barcode(reference, mutation_rate):
    barcode = list(reference)
    for i in range(len(barcode)):
        if np.random.rand() < mutation_rate:
            barcode[i] = np.random.choice([b for b in bases if b != barcode[i]])
    return ''.join(barcode)

# Reference barcodes for 5 species
ref_length = 100
species_names = ['Morpho butterfly', 'Monarch butterfly', 'Painted lady',
                 'Swallowtail', 'Atlas moth']
references = [''.join(np.random.choice(bases, ref_length)) for _ in range(5)]

# Generate database entries (10 samples per species, slight variation)
database = {}
for name, ref in zip(species_names, references):
    database[name] = [generate_barcode(ref, 0.02) for _ in range(10)]

# Unknown sample (from species 2 with some mutations)
unknown = generate_barcode(references[1], 0.03)

# Calculate similarity to all database entries
def similarity(seq1, seq2):
    matches = sum(a == b for a, b in zip(seq1, seq2))
    return matches / len(seq1)

results = {}
for name, entries in database.items():
    sims = [similarity(unknown, entry) for entry in entries]
    results[name] = (np.mean(sims), np.std(sims))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Bar chart of similarity scores
ax1.set_facecolor('#111827')
names = list(results.keys())
means = [results[n][0] for n in names]
stds = [results[n][1] for n in names]
colors = ['#22c55e' if m == max(means) else '#3b82f6' for m in means]
bars = ax1.barh(names, means, xerr=stds, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
ax1.axvline(0.97, color='#f59e0b', linestyle='--', linewidth=1.5, label='97% threshold')
ax1.set_xlabel('Sequence similarity', color='white')
ax1.set_title('DNA Barcode Search Results', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0.5, 1.05)

# Sequence alignment visualization (first 50 bases)
ax2.set_facecolor('#111827')
base_colors = {'A': '#22c55e', 'T': '#ef4444', 'C': '#3b82f6', 'G': '#f59e0b'}
best_match_idx = np.argmax(means)
best_ref = references[best_match_idx]

display_len = 50
for i in range(display_len):
    # Unknown
    ax2.text(i, 1, unknown[i], ha='center', va='center', fontsize=6,
             color=base_colors[unknown[i]], fontfamily='monospace')
    # Reference
    ax2.text(i, 0, best_ref[i], ha='center', va='center', fontsize=6,
             color=base_colors[best_ref[i]], fontfamily='monospace')
    # Match indicator
    if unknown[i] == best_ref[i]:
        ax2.text(i, 0.5, '|', ha='center', va='center', fontsize=6, color='#4b5563')
    else:
        ax2.text(i, 0.5, 'X', ha='center', va='center', fontsize=6, color='#ef4444', fontweight='bold')

ax2.text(-2, 1, 'Unknown:', ha='right', va='center', fontsize=8, color='white')
ax2.text(-2, 0, 'Best match:', ha='right', va='center', fontsize=8, color='white')
ax2.set_xlim(-5, display_len)
ax2.set_ylim(-0.5, 1.5)
ax2.set_title('Sequence Alignment (first 50 bases)', color='white', fontsize=11)
ax2.axis('off')

plt.tight_layout()
plt.show()

best_name = names[best_match_idx]
best_sim = means[best_match_idx]
print(f"Unknown sample best match: {best_name}")
print(f"  Similarity: {best_sim:.1%}")
print(f"  {'IDENTIFIED' if best_sim > 0.97 else 'Possible new species!'}")`,
      challenge: 'Increase the mutation rate of the unknown sample from 0.03 to 0.15 (simulating a more distant relative). At what point does the similarity drop below 97% and the sample becomes "unidentifiable"?',
      successHint: 'DNA barcoding has revolutionized species identification. A ranger in the field can now identify a species from a feather, a leaf, or even environmental DNA (eDNA) in water — all by comparing sequences to a database.',
    },
    {
      title: 'Machine learning classifiers — beyond simple rules',
      concept: `Decision trees and nearest-centroid are interpretable but limited. Modern ML uses more powerful classifiers:

**Support Vector Machines (SVM)**: Find the boundary (hyperplane) that maximizes the margin between classes. Works even when data isn't linearly separable by using the "kernel trick" to project data into higher dimensions.

**k-Nearest Neighbors (kNN)**: Classify a point by majority vote of its k nearest neighbors. No training needed — the model IS the data.

**Neural Networks**: Layers of simple functions composed together can learn arbitrarily complex classification boundaries. The universal approximation theorem guarantees this.

**Random Forests**: Hundreds of decision trees, each trained on a random subset of data and features, voting together. Reduces overfitting through ensemble diversity.

Each classifier has trade-offs: accuracy vs. interpretability, speed vs. flexibility, data efficiency vs. generalization. There's no single "best" classifier — only the best one for your specific problem and data.`,
      analogy: 'Different classifiers are like different voting systems. Nearest centroid is a dictator (one center decides). kNN is direct democracy (neighbors vote). Decision trees are a series of referendums. Random forests are a parliament (many trees vote). Neural networks are a complex bureaucracy (layers of simple decisions). Each system has strengths and failure modes.',
      storyConnection: 'The child who named the clouds used the simplest classifier: her own pattern recognition. But modern cloud classification uses satellite imagery analyzed by neural networks — millions of pixels processed by deep learning to identify cloud types, predict weather, and track climate change. From a child\'s instinct to planetary-scale ML.',
      checkQuestion: 'Why do random forests (many trees) usually outperform a single decision tree?',
      checkAnswer: 'Wisdom of crowds. A single tree overfits to quirks in the training data. Many trees, each trained on different random subsets, make different mistakes. When they vote, individual errors cancel out, but correct patterns are reinforced. This is called ensemble learning, and it\'s one of the most powerful ideas in ML.',
      codeIntro: 'Compare three classifiers on the same dataset.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a non-linearly separable dataset (moons)
n = 200
t = np.linspace(0, np.pi, n)
moon1 = np.column_stack([np.cos(t), np.sin(t)]) + np.random.randn(n, 2) * 0.15
moon2 = np.column_stack([1 + np.cos(t), 1 - np.sin(t) - 0.5]) + np.random.randn(n, 2) * 0.15
X = np.vstack([moon1, moon2])
y = np.array([0]*n + [1]*n)

# Three classifiers
def nearest_centroid(X_train, y_train, X_test):
    centroids = np.array([X_train[y_train==i].mean(axis=0) for i in range(2)])
    dists = np.sqrt(((X_test[:, None, :] - centroids[None, :, :])**2).sum(axis=2))
    return np.argmin(dists, axis=1)

def knn_classify(X_train, y_train, X_test, k=5):
    preds = []
    for x in X_test:
        dists = np.sqrt(((X_train - x)**2).sum(axis=1))
        nearest = y_train[np.argsort(dists)[:k]]
        preds.append(int(nearest.sum() > k/2))
    return np.array(preds)

def decision_stump_ensemble(X_train, y_train, X_test, n_stumps=50):
    predictions = np.zeros((len(X_test), n_stumps))
    for s in range(n_stumps):
        idx = np.random.choice(len(X_train), len(X_train), replace=True)
        Xs, ys = X_train[idx], y_train[idx]
        feat = np.random.randint(2)
        thresh = np.random.choice(Xs[:, feat])
        left_label = int(ys[Xs[:, feat] <= thresh].mean() > 0.5) if (Xs[:, feat] <= thresh).any() else 0
        right_label = 1 - left_label
        predictions[:, s] = np.where(X_test[:, feat] <= thresh, left_label, right_label)
    return (predictions.mean(axis=1) > 0.5).astype(int)

# Create mesh for decision boundaries
xx, yy = np.meshgrid(np.linspace(X[:,0].min()-0.5, X[:,0].max()+0.5, 150),
                      np.linspace(X[:,1].min()-0.5, X[:,1].max()+0.5, 150))
grid = np.c_[xx.ravel(), yy.ravel()]

classifiers = [
    ('Nearest Centroid', lambda: nearest_centroid(X, y, grid)),
    ('5-NN', lambda: knn_classify(X, y, grid, k=5)),
    ('Ensemble (50 stumps)', lambda: decision_stump_ensemble(X, y, grid)),
]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax, (name, clf_func) in zip(axes, classifiers):
    ax.set_facecolor('#111827')
    Z = clf_func().reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.2, colors=['#22c55e', '#3b82f6'], levels=[-0.5, 0.5, 1.5])
    ax.scatter(X[y==0, 0], X[y==0, 1], c='#22c55e', s=10, alpha=0.5)
    ax.scatter(X[y==1, 0], X[y==1, 1], c='#3b82f6', s=10, alpha=0.5)

    pred = nearest_centroid(X, y, X) if 'Centroid' in name else (knn_classify(X, y, X) if 'NN' in name else decision_stump_ensemble(X, y, X))
    acc = (pred == y).mean()
    ax.set_title(f'{name}\\\nAccuracy: {acc:.1%}', color='white', fontsize=11)
    ax.tick_params(colors='gray', labelsize=7)

plt.suptitle('Three Classifiers on Non-Linear Data', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Classifier comparison:")
print("  Nearest Centroid: fast, simple, but can't handle non-linear boundaries")
print("  k-NN: flexible, but slow on large datasets (compares to ALL points)")
print("  Ensemble: robust, reduces overfitting through averaging")
print()
print("Key insight: more complex boundaries need more complex classifiers.")
print("But complexity also risks overfitting — the eternal trade-off.")`,
      challenge: 'Change k in kNN from 5 to 1 (1-nearest neighbor) and to 50 (50-nearest neighbor). How do the decision boundaries change? Which overfits? Which underfits?',
      successHint: 'From Howard\'s cloud names to neural network classifiers — classification has evolved from human intuition to algorithms that process satellite imagery, genomic data, and medical scans at planetary scale. The principle hasn\'t changed: find patterns, draw boundaries, assign labels.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Data Classification — some math and coding experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for machine learning simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}