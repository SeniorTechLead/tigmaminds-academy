import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PitcherPlantLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone overview — Carnivorous Plant Classifier',
      concept: `In this capstone you will build a **machine learning classifier** that identifies carnivorous plant trap types from morphological measurements. Given features like leaf shape, trap dimensions, surface texture, and gland density, your classifier will predict whether a plant uses a pitfall, snap, flypaper, or bladder trap.

This is a classic **supervised classification** problem with four classes. You will:
1. **Generate synthetic morphological data** based on real trait distributions for each trap type
2. **Engineer features** that capture the key differences between trap types
3. **Implement a k-nearest neighbors (k-NN) classifier** from scratch
4. **Build a decision tree classifier** for interpretable predictions
5. **Evaluate using cross-validation** and confusion matrices
6. **Visualize decision boundaries** to understand what the classifier learned

The same approach is used by botanists in the field: when they find an unknown plant, they measure morphological traits and compare against known species. Your classifier automates this process.`,
      analogy: 'Building a plant classifier is like training a new botanist. You show them hundreds of examples: "this tubular leaf with slippery rim is a pitfall trap, this flat leaf with rapid closure is a snap trap." Eventually they learn the diagnostic features and can classify new plants they have never seen. Your algorithm learns the same way — from labeled examples.',
      storyConnection: 'Meghalaya\'s Khasi Hills harbor at least 5 Nepenthes species, several Drosera sundews, and numerous Utricularia bladderworts. Field botanists must distinguish them quickly during surveys. A morphological classifier trained on key features could assist with rapid identification in remote field conditions where molecular tools are unavailable.',
      checkQuestion: 'Why use morphological features instead of DNA sequencing for classification? When would DNA be better?',
      checkAnswer: 'Morphological classification is fast, cheap, and non-destructive — you measure the plant without taking tissue samples. DNA sequencing is definitive but requires lab equipment, takes hours-days, and destroys tissue. Morphological classifiers are better for rapid field surveys; DNA is better for resolving ambiguous cases, identifying cryptic species (look-alikes with different DNA), and building evolutionary trees.',
      codeIntro: 'Generate synthetic morphological data for four carnivorous plant trap types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_trap_data(n_per_class=100):
    """Generate synthetic morphological measurements for 4 trap types."""
    data = []
    labels = []

    # Pitfall traps (Nepenthes, Sarracenia)
    # Features: [tube_length_cm, rim_width_mm, fluid_volume_ml, gland_density, wall_angle_deg, texture_score]
    for _ in range(n_per_class):
        tube = np.random.normal(15, 5)      # long tubes
        rim = np.random.normal(12, 3)       # wide rims
        fluid = np.random.normal(20, 8)     # significant fluid
        glands = np.random.normal(50, 15)   # moderate glands
        angle = np.random.normal(80, 10)    # near-vertical walls
        texture = np.random.normal(2, 0.5)  # smooth (low score)
        data.append([tube, rim, fluid, glands, angle, texture])
        labels.append(0)  # pitfall

    # Snap traps (Dionaea, Aldrovanda)
    for _ in range(n_per_class):
        tube = np.random.normal(3, 1)       # short (flat leaves)
        rim = np.random.normal(2, 0.5)      # narrow
        fluid = np.random.normal(0, 0.1)    # no fluid
        glands = np.random.normal(30, 10)   # trigger hairs (few but critical)
        angle = np.random.normal(20, 8)     # flat/hinged
        texture = np.random.normal(5, 1)    # spiny (high score)
        data.append([tube, rim, fluid, glands, angle, texture])
        labels.append(1)  # snap

    # Flypaper traps (Drosera, Pinguicula)
    for _ in range(n_per_class):
        tube = np.random.normal(2, 0.8)     # flat rosettes
        rim = np.random.normal(1, 0.3)      # no distinct rim
        fluid = np.random.normal(0.5, 0.3)  # sticky mucilage
        glands = np.random.normal(200, 50)  # very high gland density!
        angle = np.random.normal(10, 5)     # flat
        texture = np.random.normal(8, 1.5)  # very sticky (high)
        data.append([tube, rim, fluid, glands, angle, texture])
        labels.append(2)  # flypaper

    # Bladder traps (Utricularia)
    for _ in range(n_per_class):
        tube = np.random.normal(0.3, 0.1)   # tiny traps
        rim = np.random.normal(0.2, 0.05)   # tiny opening
        fluid = np.random.normal(0.01, 0.005)  # vacuum (near-zero)
        glands = np.random.normal(80, 20)   # moderate
        angle = np.random.normal(60, 15)    # spherical
        texture = np.random.normal(3, 0.8)  # smooth
        data.append([tube, rim, fluid, glands, angle, texture])
        labels.append(3)  # bladder

    return np.array(data), np.array(labels)

X, y = generate_trap_data()
feature_names = ['Tube length', 'Rim width', 'Fluid vol', 'Gland density', 'Wall angle', 'Texture']
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']
class_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Carnivorous Plant Morphological Data', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Feature distributions by class
for i, (ax, fname) in enumerate(zip(axes.flat, feature_names)):
    for c in range(4):
        vals = X[y == c, i]
        ax.hist(vals, bins=20, alpha=0.5, color=class_colors[c], label=class_names[c], density=True)
    ax.set_xlabel(fname, color='white')
    ax.set_ylabel('Density', color='white')
    ax.set_title(f'{fname} distribution', color='white', fontsize=10)
    if i == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Dataset summary:")
print(f"  Total samples: {len(X)}")
print(f"  Features: {len(feature_names)}")
print(f"  Classes: {class_names}")
print(f"  Samples per class: {[np.sum(y==c) for c in range(4)]}")
print(f"\\\nFeature statistics:")
for i, fname in enumerate(feature_names):
    print(f"  {fname:<16}: mean={X[:,i].mean():.2f}, std={X[:,i].std():.2f}, range=[{X[:,i].min():.1f}, {X[:,i].max():.1f}]")`,
      challenge: 'Compute the correlation matrix between all features. Which features are most correlated? Which are most independent? Independent features are more useful for classification.',
      successHint: 'Good synthetic data captures the real-world distributions of each class. The key is that classes overlap on some features but separate on others — just like real biological data.',
    },
    {
      title: 'Feature engineering — diagnostic measurements',
      concept: `Raw measurements alone may not be the best inputs for a classifier. **Feature engineering** transforms and combines raw features into more informative ones.

For carnivorous plant classification, useful derived features include:

- **Trap aspect ratio** = tube_length / rim_width — pitfall traps have high ratios (tall and narrow), snap traps have low ratios
- **Volume per unit length** = fluid_volume / tube_length — distinguishes fluid-filled pitchers from dry traps
- **Gland-to-surface ratio** = gland_density / (tube_length * rim_width) — flypaper traps have extremely high values
- **Size category** = log(tube_length * rim_width) — bladder traps are orders of magnitude smaller

Feature **standardization** is also critical: tube length ranges from 0.3-25 cm while gland density ranges from 10-300. Without scaling, large-valued features dominate distance calculations. We use **z-score normalization**: z = (x - mean) / std.

Feature engineering is where domain knowledge becomes a competitive advantage. Knowing that gland density is the key diagnostic feature for flypaper traps lets you engineer features that emphasize this distinction.`,
      analogy: 'Feature engineering is like a detective combining clues. The raw evidence is fingerprints, shoe size, hair color, and time of entry. But the detective creates derived features: "shoe-to-height ratio" identifies gender, "fingerprint pattern complexity" narrows age range. Each engineered feature combines raw data into something more discriminative than any single measurement.',
      storyConnection: 'Khasi botanists in Meghalaya identify carnivorous plants using exactly these morphological ratios. A Nepenthes pitcher with a wide, flared peristome and deep fluid pool is clearly a pitfall trap. A tiny Utricularia bladder with a trapdoor is unmistakable. The classifier formalizes this expert knowledge into numbers.',
      checkQuestion: 'Why might the ratio tube_length/rim_width be more useful than either measurement alone?',
      checkAnswer: 'Individual measurements vary with plant age and size — a young pitcher is smaller than a mature one in both tube length and rim width. But the ratio stays roughly constant because both scale proportionally. Ratios are size-invariant features: they capture shape rather than size. A pitfall trap has a high ratio whether it is 5 cm or 25 cm tall.',
      codeIntro: 'Engineer derived features, standardize the data, and visualize separability in feature space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data
def generate_trap_data(n=100):
    data, labels = [], []
    for _ in range(n):
        data.append([np.random.normal(15,5), np.random.normal(12,3), np.random.normal(20,8),
                      np.random.normal(50,15), np.random.normal(80,10), np.random.normal(2,0.5)])
        labels.append(0)
    for _ in range(n):
        data.append([np.random.normal(3,1), np.random.normal(2,0.5), np.random.normal(0,0.1),
                      np.random.normal(30,10), np.random.normal(20,8), np.random.normal(5,1)])
        labels.append(1)
    for _ in range(n):
        data.append([np.random.normal(2,0.8), np.random.normal(1,0.3), np.random.normal(0.5,0.3),
                      np.random.normal(200,50), np.random.normal(10,5), np.random.normal(8,1.5)])
        labels.append(2)
    for _ in range(n):
        data.append([np.random.normal(0.3,0.1), np.random.normal(0.2,0.05), np.random.normal(0.01,0.005),
                      np.random.normal(80,20), np.random.normal(60,15), np.random.normal(3,0.8)])
        labels.append(3)
    return np.array(data), np.array(labels)

X_raw, y = generate_trap_data()
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']
class_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

# Engineer new features
tube, rim, fluid, glands, angle, texture = X_raw.T

aspect_ratio = tube / np.maximum(rim, 0.01)
vol_per_length = fluid / np.maximum(tube, 0.01)
gland_surface_ratio = glands / np.maximum(tube * rim, 0.01)
log_size = np.log10(np.maximum(tube * rim, 0.001))

# Combine into feature matrix
X_eng = np.column_stack([tube, rim, fluid, glands, angle, texture,
                          aspect_ratio, vol_per_length, gland_surface_ratio, log_size])
eng_names = ['Tube', 'Rim', 'Fluid', 'Glands', 'Angle', 'Texture',
             'Aspect ratio', 'Vol/length', 'Gland/surface', 'Log size']

# Standardize (z-score)
means = X_eng.mean(axis=0)
stds = X_eng.std(axis=0)
X_std = (X_eng - means) / np.maximum(stds, 1e-10)

# Calculate feature discriminative power (F-statistic)
f_scores = []
for j in range(X_std.shape[1]):
    class_means = [X_std[y == c, j].mean() for c in range(4)]
    overall_mean = X_std[:, j].mean()
    between = sum(np.sum(y == c) * (cm - overall_mean)**2 for c, cm in enumerate(class_means)) / 3
    within = sum(np.sum((X_std[y == c, j] - cm)**2) for c, cm in enumerate(class_means)) / (len(y) - 4)
    f_scores.append(between / max(within, 1e-10))

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Feature Engineering for Trap Classification', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Feature importance ranking
sorted_idx = np.argsort(f_scores)[::-1]
axes[0, 0].barh(range(len(eng_names)), [f_scores[i] for i in sorted_idx],
                  color=['#22c55e' if i >= 6 else '#3b82f6' for i in sorted_idx], alpha=0.8)
axes[0, 0].set_yticks(range(len(eng_names)))
axes[0, 0].set_yticklabels([eng_names[i] for i in sorted_idx], fontsize=8, color='white')
axes[0, 0].set_xlabel('F-score (discriminative power)', color='white')
axes[0, 0].set_title('Feature ranking (green=engineered)', color='white', fontsize=10)

# Best 2 features scatter
best1, best2 = sorted_idx[0], sorted_idx[1]
for c in range(4):
    mask = y == c
    axes[0, 1].scatter(X_std[mask, best1], X_std[mask, best2],
                        c=class_colors[c], s=30, alpha=0.6, label=class_names[c])
axes[0, 1].set_xlabel(eng_names[best1], color='white')
axes[0, 1].set_ylabel(eng_names[best2], color='white')
axes[0, 1].set_title(f'Best 2 features', color='white', fontsize=10)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3rd and 4th best features
best3, best4 = sorted_idx[2], sorted_idx[3]
for c in range(4):
    mask = y == c
    axes[0, 2].scatter(X_std[mask, best3], X_std[mask, best4],
                        c=class_colors[c], s=30, alpha=0.6, label=class_names[c])
axes[0, 2].set_xlabel(eng_names[best3], color='white')
axes[0, 2].set_ylabel(eng_names[best4], color='white')
axes[0, 2].set_title(f'3rd & 4th best features', color='white', fontsize=10)
axes[0, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Engineered vs raw feature comparison
raw_f = f_scores[:6]
eng_f = f_scores[6:]
axes[1, 0].bar(range(6), raw_f, color='#3b82f6', alpha=0.8, label='Raw')
axes[1, 0].bar(range(6, 10), eng_f, color='#22c55e', alpha=0.8, label='Engineered')
axes[1, 0].set_xticks(range(10))
axes[1, 0].set_xticklabels([n[:6] for n in eng_names], fontsize=7, color='white', rotation=45)
axes[1, 0].set_ylabel('F-score', color='white')
axes[1, 0].set_title('Raw vs engineered features', color='white', fontsize=10)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Standardization effect
axes[1, 1].boxplot([X_raw[:, i] for i in range(6)], positions=range(6), patch_artist=True,
                    boxprops=dict(facecolor='#ef4444', alpha=0.5),
                    medianprops=dict(color='white'))
axes[1, 1].set_xticks(range(6))
axes[1, 1].set_xticklabels([n[:5] for n in eng_names[:6]], fontsize=7, color='white')
axes[1, 1].set_title('Before standardization (different scales!)', color='white', fontsize=10)

axes[1, 2].boxplot([X_std[:, i] for i in range(6)], positions=range(6), patch_artist=True,
                    boxprops=dict(facecolor='#22c55e', alpha=0.5),
                    medianprops=dict(color='white'))
axes[1, 2].set_xticks(range(6))
axes[1, 2].set_xticklabels([n[:5] for n in eng_names[:6]], fontsize=7, color='white')
axes[1, 2].set_title('After standardization (same scale)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Feature ranking by discriminative power:")
for rank, idx in enumerate(sorted_idx):
    source = "ENGINEERED" if idx >= 6 else "raw"
    print(f"  {rank+1}. {eng_names[idx]:<18} F={f_scores[idx]:>8.1f}  [{source}]")
print(f"\\\nTop features are the most useful for classification.")
print(f"Engineered features often outrank raw ones because they capture shape, not just size.")`,
      challenge: 'Add two more engineered features of your own design. Does adding them improve the F-score ranking? Think about what distinguishes each trap type and create features that capture those differences.',
      successHint: 'Feature engineering is where domain knowledge meets machine learning. The best features are those that a botanist would use intuitively — you are just expressing that intuition mathematically.',
    },
    {
      title: 'k-NN classifier — classification by similarity',
      concept: `The **k-nearest neighbors (k-NN)** algorithm is the simplest and most intuitive classifier: to classify a new sample, find the k closest training samples and take a majority vote.

**Algorithm:**
1. Compute the distance from the new sample to every training sample
2. Sort by distance, select the k nearest
3. Count the class labels among those k neighbors
4. Assign the most frequent class (majority vote)

**Distance metric** matters: we use **Euclidean distance** in standardized feature space: d(a,b) = sqrt(sum((a_i - b_i)^2)). Standardization ensures all features contribute equally.

**Choosing k:**
- k=1: classifies based on the single nearest neighbor — low bias, high variance (noisy)
- k=large: smooths out noise but may miss local patterns — high bias, low variance
- Odd k avoids ties in binary classification
- Typical: k = sqrt(n_samples) as a starting point, then tune via cross-validation

**Strengths:** No training phase, handles any number of classes, non-parametric (no assumptions about data distribution).
**Weaknesses:** Slow at prediction time (must compute all distances), sensitive to irrelevant features, curse of dimensionality in high dimensions.`,
      analogy: 'k-NN is like asking your neighbors for a restaurant recommendation. If you ask 1 neighbor (k=1), you might get a biased answer. If you ask 100 neighbors (k=100), the recommendation will be safe but generic. k=5-10 usually gives the best balance: enough votes to be reliable, few enough to capture local preferences.',
      storyConnection: 'When a Khasi botanist finds an unknown carnivorous plant, they compare it to the most similar species they have seen before — the plant equivalent of k-NN. "The leaves look like this Drosera, the glands look like that Pinguicula..." They are computing similarity in a mental feature space and voting among the closest matches.',
      checkQuestion: 'You have a sample that is nearest to 2 pitfall traps and 3 flypaper traps (k=5). But the 2 pitfall neighbors are much closer (distance 0.1) than the 3 flypaper neighbors (distance 0.9). Standard k-NN classifies it as flypaper. Is this right?',
      checkAnswer: 'Standard k-NN says flypaper (3 vs 2 votes). But distance-weighted k-NN would weight each vote by 1/distance: pitfall score = 1/0.1 + 1/0.1 = 20, flypaper score = 1/0.9 * 3 = 3.3. Distance-weighted k-NN says pitfall — which is likely correct since the sample is much closer to pitfall examples. Distance weighting is almost always better than uniform voting.',
      codeIntro: 'Implement k-NN from scratch and evaluate it on the carnivorous plant dataset.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate and prepare data
def gen_data(n=100):
    data, labels = [], []
    specs = [(15,5,12,3,20,8,50,15,80,10,2,0.5,0),
             (3,1,2,0.5,0,0.1,30,10,20,8,5,1,1),
             (2,0.8,1,0.3,0.5,0.3,200,50,10,5,8,1.5,2),
             (0.3,0.1,0.2,0.05,0.01,0.005,80,20,60,15,3,0.8,3)]
    for s in specs:
        for _ in range(n):
            data.append([np.random.normal(s[0],s[1]), np.random.normal(s[2],s[3]),
                         np.random.normal(s[4],s[5]), np.random.normal(s[6],s[7]),
                         np.random.normal(s[8],s[9]), np.random.normal(s[10],s[11])])
            labels.append(s[12])
    return np.array(data), np.array(labels)

X, y = gen_data()
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']
class_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

# Standardize
mu, sigma = X.mean(0), X.std(0)
X_std = (X - mu) / sigma

# Train/test split
indices = np.random.permutation(len(X))
split = int(0.8 * len(X))
train_idx, test_idx = indices[:split], indices[split:]
X_train, y_train = X_std[train_idx], y[train_idx]
X_test, y_test = X_std[test_idx], y[test_idx]

# k-NN implementation
def knn_predict(X_train, y_train, X_test, k=5, weighted=False):
    predictions = []
    for x in X_test:
        distances = np.sqrt(np.sum((X_train - x) ** 2, axis=1))
        nearest_idx = np.argsort(distances)[:k]
        nearest_labels = y_train[nearest_idx]
        nearest_dists = distances[nearest_idx]

        if weighted:
            weights = 1.0 / np.maximum(nearest_dists, 1e-10)
            class_scores = np.zeros(4)
            for label, w in zip(nearest_labels, weights):
                class_scores[label] += w
            predictions.append(np.argmax(class_scores))
        else:
            counts = np.bincount(nearest_labels, minlength=4)
            predictions.append(np.argmax(counts))
    return np.array(predictions)

# Test different k values
k_values = [1, 3, 5, 7, 11, 15, 21, 31]
accuracies_uniform = []
accuracies_weighted = []

for k in k_values:
    pred_u = knn_predict(X_train, y_train, X_test, k=k, weighted=False)
    pred_w = knn_predict(X_train, y_train, X_test, k=k, weighted=True)
    accuracies_uniform.append(np.mean(pred_u == y_test))
    accuracies_weighted.append(np.mean(pred_w == y_test))

# Best k
best_k = k_values[np.argmax(accuracies_weighted)]
best_pred = knn_predict(X_train, y_train, X_test, k=best_k, weighted=True)

# Confusion matrix
conf = np.zeros((4, 4), dtype=int)
for true, pred in zip(y_test, best_pred):
    conf[true, pred] += 1

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'k-NN Classifier (best k={best_k}, acc={max(accuracies_weighted):.1%})', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# k vs accuracy
axes[0, 0].plot(k_values, accuracies_uniform, 'o-', color='#f59e0b', linewidth=2, label='Uniform')
axes[0, 0].plot(k_values, accuracies_weighted, 's-', color='#22c55e', linewidth=2, label='Weighted')
axes[0, 0].set_xlabel('k (neighbors)', color='white')
axes[0, 0].set_ylabel('Accuracy', color='white')
axes[0, 0].set_title('k vs accuracy', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Confusion matrix
im = axes[0, 1].imshow(conf, cmap='Blues', aspect='auto')
axes[0, 1].set_xticks(range(4)); axes[0, 1].set_yticks(range(4))
axes[0, 1].set_xticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_yticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_xlabel('Predicted', color='white')
axes[0, 1].set_ylabel('True', color='white')
axes[0, 1].set_title('Confusion matrix', color='white', fontsize=10)
for i in range(4):
    for j in range(4):
        axes[0, 1].text(j, i, str(conf[i, j]), ha='center', va='center',
                         color='white' if conf[i, j] > conf.max()/2 else 'gray', fontsize=12, fontweight='bold')

# Per-class accuracy
class_acc = [conf[i, i] / max(conf[i].sum(), 1) for i in range(4)]
axes[0, 2].bar(class_names, class_acc, color=class_colors, alpha=0.8)
axes[0, 2].set_ylabel('Accuracy', color='white')
axes[0, 2].set_title('Per-class accuracy', color='white', fontsize=10)
axes[0, 2].set_ylim(0, 1.1)
for i, v in enumerate(class_acc):
    axes[0, 2].text(i, v + 0.02, f'{v:.0%}', ha='center', color='white', fontsize=10)

# Decision boundary visualization (using 2 best features)
# Find 2 most discriminative features
from_idx = [0, 3]  # tube length, gland density
X_2d_train = X_train[:, from_idx]
X_2d_test = X_test[:, from_idx]

# Create grid
x_min, x_max = X_2d_train[:, 0].min() - 1, X_2d_train[:, 0].max() + 1
y_min, y_max = X_2d_train[:, 1].min() - 1, X_2d_train[:, 1].max() + 1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100), np.linspace(y_min, y_max, 100))
grid_points = np.column_stack([xx.ravel(), yy.ravel()])

# Classify grid
grid_pred = knn_predict(X_2d_train, y_train, grid_points, k=best_k, weighted=True)
Z = grid_pred.reshape(xx.shape)

cmap_bg = plt.cm.colors.ListedColormap(['#ef444433', '#f59e0b33', '#22c55e33', '#3b82f633'])
axes[1, 0].contourf(xx, yy, Z, levels=[-0.5, 0.5, 1.5, 2.5, 3.5], colors=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'], alpha=0.15)
for c in range(4):
    mask = y_train == c
    axes[1, 0].scatter(X_2d_train[mask, 0], X_2d_train[mask, 1],
                        c=class_colors[c], s=20, alpha=0.5, label=class_names[c])
axes[1, 0].set_xlabel('Tube length (std)', color='white')
axes[1, 0].set_ylabel('Gland density (std)', color='white')
axes[1, 0].set_title('Decision boundaries (2D projection)', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Nearest neighbor distances distribution
all_dists = []
for x in X_test:
    dists = np.sqrt(np.sum((X_train - x) ** 2, axis=1))
    all_dists.append(np.sort(dists)[:best_k].mean())
axes[1, 1].hist(all_dists, bins=20, color='#a855f7', alpha=0.7)
axes[1, 1].set_xlabel('Mean distance to k nearest', color='white')
axes[1, 1].set_ylabel('Count', color='white')
axes[1, 1].set_title('Distance distribution', color='white', fontsize=10)

# Misclassified samples analysis
wrong = best_pred != y_test
if np.any(wrong):
    axes[1, 2].scatter(X_test[~wrong, from_idx[0]], X_test[~wrong, from_idx[1]],
                        c=[class_colors[c] for c in y_test[~wrong]], s=30, alpha=0.3, marker='o')
    axes[1, 2].scatter(X_test[wrong, from_idx[0]], X_test[wrong, from_idx[1]],
                        c='white', s=80, marker='x', linewidths=2, label='Misclassified')
    axes[1, 2].set_xlabel('Tube length (std)', color='white')
    axes[1, 2].set_ylabel('Gland density (std)', color='white')
    axes[1, 2].set_title(f'Errors: {np.sum(wrong)} misclassified', color='white', fontsize=10)
    axes[1, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
else:
    axes[1, 2].text(0.5, 0.5, 'Perfect classification!', ha='center', va='center',
                     color='#22c55e', fontsize=16, fontweight='bold', transform=axes[1, 2].transAxes)
    axes[1, 2].set_title('No errors', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"k-NN Results (k={best_k}, distance-weighted):")
print(f"  Overall accuracy: {np.mean(best_pred == y_test):.1%}")
for i, name in enumerate(class_names):
    print(f"  {name}: {class_acc[i]:.0%} ({conf[i,i]}/{conf[i].sum()})")
print(f"  Misclassified: {np.sum(best_pred != y_test)} / {len(y_test)}")`,
      challenge: 'Implement a "confidence score" for each prediction: the fraction of k neighbors that agree on the class. Which predictions have low confidence? Are those the same ones that are misclassified?',
      successHint: 'k-NN is powerful because it makes no assumptions about the shape of class boundaries. It can handle any decision boundary shape, as long as you have enough training data and the right features.',
    },
    {
      title: 'Decision tree — interpretable classification',
      concept: `While k-NN is accurate, it is a black box — you cannot easily explain *why* it classified a sample a certain way. **Decision trees** solve this by learning a series of if/then rules that are human-readable.

A decision tree works by recursively splitting the data:
1. At each node, find the feature and threshold that best separates the classes
2. Split the data into left (feature <= threshold) and right (feature > threshold) subsets
3. Repeat recursively until leaves are pure (all one class) or a stopping criterion is met

**Splitting criterion** — how to measure "best separates":
- **Gini impurity**: Gini = 1 - sum(p_i^2) for each class proportion p_i. Low Gini = purer node.
- **Information gain** (entropy): Entropy = -sum(p_i * log2(p_i)). Information gain = parent entropy minus weighted child entropy.

**Advantages of decision trees:**
- Interpretable: you can read the rules ("if gland_density > 100 and tube_length < 3, then flypaper")
- No need for feature standardization
- Handle both numerical and categorical features
- Capture non-linear relationships and feature interactions

**Disadvantages:** Prone to overfitting (solved by pruning or ensemble methods like Random Forest).`,
      analogy: 'A decision tree is like a field identification key in a botany guidebook. "Is the leaf tubular? If yes, is there digestive fluid? If yes, it is a pitfall trap." Each question narrows down the possibilities until you reach an answer. The tree learns the most efficient sequence of questions from data.',
      storyConnection: 'Botanical field guides for NE India use exactly this structure. "Leaf forms a closed tube -> check for digestive fluid -> Nepenthes. Leaf flat with sticky tentacles -> Drosera. Tiny aquatic bladders -> Utricularia." Your decision tree algorithm discovers these rules automatically from morphological data.',
      checkQuestion: 'If a decision tree perfectly classifies the training data (100% accuracy), is this good or bad? Explain.',
      checkAnswer: 'Usually bad — it means the tree is overfitting. A perfect training accuracy means the tree has memorized every training sample, including noise. It will likely perform poorly on new data. The solution is pruning: limit tree depth, require minimum samples per leaf, or use ensemble methods. A simpler tree that gets 95% training accuracy often gets better test accuracy than a perfect training tree.',
      codeIntro: 'Implement a decision tree classifier from scratch with Gini impurity splitting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate data (same as before)
def gen_data(n=100):
    data, labels = [], []
    specs = [(15,5,12,3,20,8,50,15,80,10,2,0.5,0),
             (3,1,2,0.5,0,0.1,30,10,20,8,5,1,1),
             (2,0.8,1,0.3,0.5,0.3,200,50,10,5,8,1.5,2),
             (0.3,0.1,0.2,0.05,0.01,0.005,80,20,60,15,3,0.8,3)]
    for s in specs:
        for _ in range(n):
            data.append([np.random.normal(s[0],s[1]), np.random.normal(s[2],s[3]),
                         np.random.normal(s[4],s[5]), np.random.normal(s[6],s[7]),
                         np.random.normal(s[8],s[9]), np.random.normal(s[10],s[11])])
            labels.append(s[12])
    return np.array(data), np.array(labels)

X, y = gen_data()
feat_names = ['Tube', 'Rim', 'Fluid', 'Glands', 'Angle', 'Texture']
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']

# Split
idx = np.random.permutation(len(X))
X_tr, y_tr = X[idx[:320]], y[idx[:320]]
X_te, y_te = X[idx[320:]], y[idx[320:]]

# Decision Tree from scratch
class DecisionTree:
    def __init__(self, max_depth=5, min_samples=5):
        self.max_depth = max_depth
        self.min_samples = min_samples
        self.tree = None

    def gini(self, labels):
        if len(labels) == 0: return 0
        probs = np.bincount(labels, minlength=4) / len(labels)
        return 1 - np.sum(probs ** 2)

    def best_split(self, X, y):
        best_gain, best_feat, best_thresh = -1, None, None
        parent_gini = self.gini(y)
        n = len(y)

        for f in range(X.shape[1]):
            thresholds = np.percentile(X[:, f], np.arange(10, 100, 10))
            for t in thresholds:
                left = y[X[:, f] <= t]
                right = y[X[:, f] > t]
                if len(left) < self.min_samples or len(right) < self.min_samples:
                    continue
                gain = parent_gini - (len(left)/n * self.gini(left) + len(right)/n * self.gini(right))
                if gain > best_gain:
                    best_gain = gain
                    best_feat = f
                    best_thresh = t
        return best_feat, best_thresh, best_gain

    def build(self, X, y, depth=0):
        # Leaf conditions
        if depth >= self.max_depth or len(y) < self.min_samples or self.gini(y) == 0:
            return {'leaf': True, 'class': np.bincount(y, minlength=4).argmax(),
                    'counts': np.bincount(y, minlength=4), 'n': len(y)}

        feat, thresh, gain = self.best_split(X, y)
        if feat is None:
            return {'leaf': True, 'class': np.bincount(y, minlength=4).argmax(),
                    'counts': np.bincount(y, minlength=4), 'n': len(y)}

        left_mask = X[:, feat] <= thresh
        return {
            'leaf': False, 'feature': feat, 'threshold': thresh, 'gain': gain,
            'left': self.build(X[left_mask], y[left_mask], depth+1),
            'right': self.build(X[~left_mask], y[~left_mask], depth+1),
        }

    def fit(self, X, y):
        self.tree = self.build(X, y)

    def predict_one(self, x, node=None):
        if node is None: node = self.tree
        if node['leaf']: return node['class']
        if x[node['feature']] <= node['threshold']:
            return self.predict_one(x, node['left'])
        return self.predict_one(x, node['right'])

    def predict(self, X):
        return np.array([self.predict_one(x) for x in X])

    def get_rules(self, node=None, rules=None, path=""):
        if node is None: node = self.tree
        if rules is None: rules = []
        if node['leaf']:
            rules.append(f"{path} => {class_names[node['class']]} (n={node['n']})")
            return rules
        fname = feat_names[node['feature']]
        self.get_rules(node['left'], rules, f"{path} {fname}<={node['threshold']:.1f}")
        self.get_rules(node['right'], rules, f"{path} {fname}>{node['threshold']:.1f}")
        return rules

# Train trees with different depths
depths = [1, 2, 3, 4, 5, 7, 10]
train_accs, test_accs = [], []

for d in depths:
    tree = DecisionTree(max_depth=d)
    tree.fit(X_tr, y_tr)
    train_accs.append(np.mean(tree.predict(X_tr) == y_tr))
    test_accs.append(np.mean(tree.predict(X_te) == y_te))

# Best tree
best_depth = depths[np.argmax(test_accs)]
best_tree = DecisionTree(max_depth=best_depth)
best_tree.fit(X_tr, y_tr)
pred = best_tree.predict(X_te)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Decision Tree Classifier (depth={best_depth}, acc={max(test_accs):.1%})', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Depth vs accuracy
axes[0, 0].plot(depths, train_accs, 'o-', color='#f59e0b', linewidth=2, label='Train')
axes[0, 0].plot(depths, test_accs, 's-', color='#22c55e', linewidth=2, label='Test')
axes[0, 0].set_xlabel('Tree depth', color='white')
axes[0, 0].set_ylabel('Accuracy', color='white')
axes[0, 0].set_title('Depth vs accuracy (overfitting visible)', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Confusion matrix
conf = np.zeros((4, 4), dtype=int)
for t, p in zip(y_te, pred): conf[t, p] += 1
im = axes[0, 1].imshow(conf, cmap='Greens', aspect='auto')
axes[0, 1].set_xticks(range(4)); axes[0, 1].set_yticks(range(4))
axes[0, 1].set_xticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_yticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_title('Confusion matrix', color='white', fontsize=10)
for i in range(4):
    for j in range(4):
        axes[0, 1].text(j, i, str(conf[i, j]), ha='center', va='center',
                         color='white' if conf[i, j] > conf.max()/2 else 'gray', fontsize=12, fontweight='bold')

# Feature importance (by gain)
importance = np.zeros(len(feat_names))
def count_importance(node):
    if node['leaf']: return
    importance[node['feature']] += node['gain'] * node.get('n', 1) if 'n' in node else node['gain']
    count_importance(node['left']); count_importance(node['right'])
count_importance(best_tree.tree)
if importance.sum() > 0: importance /= importance.sum()

sorted_fi = np.argsort(importance)[::-1]
axes[0, 2].barh(range(len(feat_names)), [importance[i] for i in sorted_fi],
                  color='#a855f7', alpha=0.8)
axes[0, 2].set_yticks(range(len(feat_names)))
axes[0, 2].set_yticklabels([feat_names[i] for i in sorted_fi], fontsize=9, color='white')
axes[0, 2].set_xlabel('Importance', color='white')
axes[0, 2].set_title('Feature importance', color='white', fontsize=10)

# Decision rules (text)
rules = best_tree.get_rules()
rule_text = "\\\n".join(rules[:12])  # show first 12 rules
axes[1, 0].text(0.02, 0.98, rule_text, transform=axes[1, 0].transAxes,
                 fontsize=6, color='#22c55e', family='monospace',
                 verticalalignment='top')
axes[1, 0].set_title('Decision rules (first 12)', color='white', fontsize=10)

# Decision boundary (2D, features 0 and 3)
f1, f2 = 0, 3
x_min, x_max = X_tr[:, f1].min()-1, X_tr[:, f1].max()+1
y_min, y_max = X_tr[:, f2].min()-1, X_tr[:, f2].max()+1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100), np.linspace(y_min, y_max, 100))
grid = np.column_stack([xx.ravel(), np.zeros(10000), np.zeros(10000),
                         yy.ravel(), np.zeros(10000), np.zeros(10000)])
# Fill other features with means
for i in range(6):
    if i not in [f1, f2]:
        grid[:, i] = X_tr[:, i].mean()
grid_pred = best_tree.predict(grid)
Z = grid_pred.reshape(xx.shape)

axes[1, 1].contourf(xx, yy, Z, levels=[-0.5,0.5,1.5,2.5,3.5],
                      colors=['#ef4444','#f59e0b','#22c55e','#3b82f6'], alpha=0.2)
for c in range(4):
    mask = y_tr == c
    axes[1, 1].scatter(X_tr[mask, f1], X_tr[mask, f2], c=['#ef4444','#f59e0b','#22c55e','#3b82f6'][c],
                        s=15, alpha=0.5, label=class_names[c])
axes[1, 1].set_xlabel(feat_names[f1], color='white')
axes[1, 1].set_ylabel(feat_names[f2], color='white')
axes[1, 1].set_title('Decision boundaries (axis-aligned)', color='white', fontsize=10)
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Comparison: k-NN vs Decision Tree
def knn_pred(Xtr, ytr, Xte, k=5):
    preds = []
    for x in Xte:
        d = np.sqrt(np.sum((Xtr - x)**2, axis=1))
        preds.append(np.bincount(ytr[np.argsort(d)[:k]], minlength=4).argmax())
    return np.array(preds)

knn_acc = np.mean(knn_pred(X_tr, y_tr, X_te) == y_te)
dt_acc = np.mean(pred == y_te)
axes[1, 2].bar(['k-NN', 'Decision Tree'], [knn_acc, dt_acc],
                color=['#3b82f6', '#22c55e'], alpha=0.8)
axes[1, 2].set_ylabel('Test accuracy', color='white')
axes[1, 2].set_title('Model comparison', color='white', fontsize=10)
axes[1, 2].set_ylim(0, 1.1)
for i, v in enumerate([knn_acc, dt_acc]):
    axes[1, 2].text(i, v + 0.02, f'{v:.1%}', ha='center', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print(f"Decision Tree Results (depth={best_depth}):")
print(f"  Test accuracy: {dt_acc:.1%}")
print(f"  k-NN accuracy: {knn_acc:.1%}")
print(f"\\\nTop decision rules:")
for rule in rules[:5]:
    print(f"  {rule}")`,
      challenge: 'Implement a simple Random Forest: train 10 decision trees, each on a random 80% subset of features and 80% subset of data. Average their predictions. Does the ensemble beat the single tree?',
      successHint: 'Decision trees are the foundation of modern ML. Random Forests, Gradient Boosting (XGBoost, LightGBM), and many competition-winning models are all based on ensembles of decision trees.',
    },
    {
      title: 'Cross-validation and model evaluation',
      concept: `A single train/test split can give misleading results — you might get lucky or unlucky with which samples end up in the test set. **K-fold cross-validation** solves this by testing on every sample exactly once.

**K-fold procedure:**
1. Divide data into K equal folds (typically K=5 or 10)
2. For each fold: use it as the test set, train on the remaining K-1 folds
3. Record accuracy for each fold
4. Report mean and standard deviation across folds

**Additional metrics beyond accuracy:**
- **Precision** for class c: what fraction of samples predicted as c are actually c? Precision = TP / (TP + FP)
- **Recall** for class c: what fraction of actual class c samples are correctly identified? Recall = TP / (TP + FN)
- **F1-score**: harmonic mean of precision and recall = 2 * P * R / (P + R)
- **Macro-average**: average metrics across all classes (treats each class equally)
- **Weighted average**: weight by class frequency (better for imbalanced datasets)

For our 4-class problem, a **confusion matrix** is essential: it shows which classes are confused with each other. If pitfall traps are often misclassified as snap traps, that tells you the features do not adequately distinguish those two classes — you need better features or more data.`,
      analogy: 'Cross-validation is like testing a medical student. Instead of one final exam, you give them 5 different exams throughout the year, each covering different patients. Their average score is more reliable than any single exam. If they ace exam 1 but fail exam 5, the average reveals they have gaps.',
      storyConnection: 'In botanical surveys of Meghalaya, researchers visit multiple sites across different seasons. A classifier trained on data from one site might fail at another due to environmental variation. Cross-validation simulates this by ensuring the model is tested on "unseen" data from different parts of the dataset.',
      checkQuestion: 'Your 4-class classifier has 95% overall accuracy but only 60% recall for bladder traps. Should you be concerned?',
      checkAnswer: 'Very concerned. 95% accuracy can mask poor performance on rare or difficult classes. If bladder traps are 10% of the data, the classifier could get 95% accuracy by being perfect on the other three classes while getting bladder traps half-wrong. Recall by class is essential for identifying weak spots. You might need more bladder trap training data, better features for distinguishing them, or class weighting in the loss function.',
      codeIntro: 'Implement k-fold cross-validation and compute comprehensive evaluation metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate data
def gen_data(n=100):
    data, labels = [], []
    specs = [(15,5,12,3,20,8,50,15,80,10,2,0.5,0),
             (3,1,2,0.5,0,0.1,30,10,20,8,5,1,1),
             (2,0.8,1,0.3,0.5,0.3,200,50,10,5,8,1.5,2),
             (0.3,0.1,0.2,0.05,0.01,0.005,80,20,60,15,3,0.8,3)]
    for s in specs:
        for _ in range(n):
            data.append([np.random.normal(s[0],s[1]), np.random.normal(s[2],s[3]),
                         np.random.normal(s[4],s[5]), np.random.normal(s[6],s[7]),
                         np.random.normal(s[8],s[9]), np.random.normal(s[10],s[11])])
            labels.append(s[12])
    return np.array(data), np.array(labels)

X, y = gen_data()
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']
class_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

# k-NN implementation
def knn(X_tr, y_tr, X_te, k=5):
    preds = []
    for x in X_te:
        d = np.sqrt(np.sum(((X_tr - X_tr.mean(0)) / X_tr.std(0) - (x - X_tr.mean(0)) / X_tr.std(0))**2, axis=1))
        preds.append(np.bincount(y_tr[np.argsort(d)[:k]], minlength=4).argmax())
    return np.array(preds)

# K-fold cross-validation
def k_fold_cv(X, y, k_folds=5, k_nn=5):
    n = len(X)
    indices = np.random.permutation(n)
    fold_size = n // k_folds
    fold_accs = []
    all_preds = np.zeros(n, dtype=int)
    all_true = np.zeros(n, dtype=int)

    for fold in range(k_folds):
        test_start = fold * fold_size
        test_end = test_start + fold_size if fold < k_folds - 1 else n
        test_idx = indices[test_start:test_end]
        train_idx = np.concatenate([indices[:test_start], indices[test_end:]])

        X_tr, y_tr = X[train_idx], y[train_idx]
        X_te, y_te = X[test_idx], y[test_idx]

        pred = knn(X_tr, y_tr, X_te, k=k_nn)
        acc = np.mean(pred == y_te)
        fold_accs.append(acc)

        all_preds[test_idx] = pred
        all_true[test_idx] = y_te

    return fold_accs, all_preds, all_true

# Run 5-fold CV
fold_accs, all_preds, all_true = k_fold_cv(X, y, k_folds=5, k_nn=7)

# Compute metrics
conf = np.zeros((4, 4), dtype=int)
for t, p in zip(all_true, all_preds): conf[t, p] += 1

precision = np.array([conf[c, c] / max(conf[:, c].sum(), 1) for c in range(4)])
recall = np.array([conf[c, c] / max(conf[c, :].sum(), 1) for c in range(4)])
f1 = 2 * precision * recall / np.maximum(precision + recall, 1e-10)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'5-Fold Cross-Validation Results (mean acc: {np.mean(fold_accs):.1%} +/- {np.std(fold_accs):.1%})',
              color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Fold accuracies
axes[0, 0].bar(range(1, 6), fold_accs, color='#22c55e', alpha=0.8)
axes[0, 0].axhline(np.mean(fold_accs), color='white', linestyle='--', linewidth=2, label=f'Mean: {np.mean(fold_accs):.1%}')
axes[0, 0].set_xlabel('Fold', color='white')
axes[0, 0].set_ylabel('Accuracy', color='white')
axes[0, 0].set_title('Accuracy per fold', color='white', fontsize=10)
axes[0, 0].set_ylim(0.7, 1.05)
axes[0, 0].legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Confusion matrix
im = axes[0, 1].imshow(conf, cmap='Blues', aspect='auto')
for i in range(4):
    for j in range(4):
        axes[0, 1].text(j, i, str(conf[i, j]), ha='center', va='center',
                         color='white' if conf[i, j] > conf.max()/2 else 'gray', fontsize=12, fontweight='bold')
axes[0, 1].set_xticks(range(4)); axes[0, 1].set_yticks(range(4))
axes[0, 1].set_xticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_yticklabels(class_names, fontsize=8, color='white')
axes[0, 1].set_xlabel('Predicted', color='white'); axes[0, 1].set_ylabel('True', color='white')
axes[0, 1].set_title('Confusion matrix (all folds)', color='white', fontsize=10)

# Precision, Recall, F1
x_pos = np.arange(4)
axes[0, 2].bar(x_pos - 0.2, precision, 0.2, color='#ef4444', label='Precision', alpha=0.8)
axes[0, 2].bar(x_pos, recall, 0.2, color='#3b82f6', label='Recall', alpha=0.8)
axes[0, 2].bar(x_pos + 0.2, f1, 0.2, color='#22c55e', label='F1', alpha=0.8)
axes[0, 2].set_xticks(x_pos)
axes[0, 2].set_xticklabels(class_names, fontsize=9, color='white')
axes[0, 2].set_ylabel('Score', color='white')
axes[0, 2].set_title('Per-class metrics', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 2].set_ylim(0, 1.15)

# Normalized confusion matrix (row-normalized)
conf_norm = conf / conf.sum(axis=1, keepdims=True).astype(float)
im2 = axes[1, 0].imshow(conf_norm, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
for i in range(4):
    for j in range(4):
        axes[1, 0].text(j, i, f'{conf_norm[i,j]:.0%}', ha='center', va='center',
                         color='black' if conf_norm[i,j] > 0.5 else 'white', fontsize=11, fontweight='bold')
axes[1, 0].set_xticks(range(4)); axes[1, 0].set_yticks(range(4))
axes[1, 0].set_xticklabels(class_names, fontsize=8, color='white')
axes[1, 0].set_yticklabels(class_names, fontsize=8, color='white')
axes[1, 0].set_title('Normalized confusion (row=true class)', color='white', fontsize=10)

# k sensitivity with CV
k_range = [1, 3, 5, 7, 11, 15, 21]
k_cv_means = []
k_cv_stds = []
for k in k_range:
    accs, _, _ = k_fold_cv(X, y, k_folds=5, k_nn=k)
    k_cv_means.append(np.mean(accs))
    k_cv_stds.append(np.std(accs))

axes[1, 1].errorbar(k_range, k_cv_means, yerr=k_cv_stds, fmt='o-', color='#a855f7',
                      linewidth=2, capsize=5, capthick=2)
axes[1, 1].set_xlabel('k (neighbors)', color='white')
axes[1, 1].set_ylabel('CV accuracy', color='white')
axes[1, 1].set_title('k tuning via cross-validation', color='white', fontsize=10)
best_k_idx = np.argmax(k_cv_means)
axes[1, 1].annotate(f'Best: k={k_range[best_k_idx]}',
                      xy=(k_range[best_k_idx], k_cv_means[best_k_idx]),
                      xytext=(k_range[best_k_idx]+3, k_cv_means[best_k_idx]-0.03),
                      color='white', fontsize=9, arrowprops=dict(arrowstyle='->', color='white'))

# Summary metrics
metrics_text = f"""CLASSIFICATION REPORT
{'='*40}
{'Class':<12} {'Prec':>6} {'Recall':>6} {'F1':>6} {'Support':>8}
{'-'*40}"""
for c in range(4):
    metrics_text += f"\\n{class_names[c]:<12} {precision[c]:>6.2f} {recall[c]:>6.2f} {f1[c]:>6.2f} {conf[c].sum():>8}"
metrics_text += f"\\n{'-'*40}"
metrics_text += f"\\n{'Macro avg':<12} {precision.mean():>6.2f} {recall.mean():>6.2f} {f1.mean():>6.2f} {conf.sum():>8}"
metrics_text += f"\\n{'Accuracy':<12} {'':>6} {'':>6} {np.mean(all_preds==all_true):>6.2f} {len(all_true):>8}"

axes[1, 2].text(0.05, 0.95, metrics_text, transform=axes[1, 2].transAxes,
                 fontsize=8, color='#22c55e', family='monospace', verticalalignment='top')
axes[1, 2].set_title('Classification report', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(metrics_text)`,
      challenge: 'Implement stratified k-fold: ensure each fold has the same class proportions as the full dataset. Compare results to regular k-fold. Does stratification matter when classes are balanced?',
      successHint: 'Cross-validation is the gold standard for model evaluation. Any result reported from a single train/test split should be treated with suspicion until confirmed by cross-validation.',
    },
    {
      title: 'Capstone finale — complete classifier pipeline',
      concept: `Your Carnivorous Plant Classifier is complete. In this final lesson, you assemble the full pipeline: data generation, feature engineering, model training, cross-validation, and prediction on new samples.

The pipeline also includes a **prediction explainer** that tells you *why* the classifier made each decision. For k-NN, the explanation is "these are the k most similar known plants." For decision trees, the explanation is the path of rules from root to leaf.

Interpretability matters in biology. A botanist using your classifier needs to know: "This is classified as a pitfall trap because its tube length (18 cm) and fluid volume (25 ml) match the pitfall training data, even though its gland density (90) is higher than typical pitfall traps." Unexplained predictions are useless in science.

Your complete system:
1. Measures 6 morphological features
2. Engineers 4 derived features
3. Runs both k-NN and decision tree classifiers
4. Cross-validates with 5 folds
5. Reports accuracy, precision, recall, F1 per class
6. Explains individual predictions
7. Identifies the most diagnostic features`,
      analogy: 'The complete pipeline is like a medical diagnostic system. A patient walks in with symptoms (features). The system runs multiple tests (classifiers), cross-checks against its database (training data), gives a diagnosis (prediction) with confidence (probability), and explains its reasoning (interpretation). The doctor reviews everything before making a final call.',
      storyConnection: 'Imagine a young botanist exploring a remote Meghalaya hillside and finding a plant they have never seen. They measure its morphological features, enter them into your classifier, and get: "87% likely to be a Drosera-type flypaper trap, based on high gland density (185) and low tube length (2.3 cm). Closest known match: Drosera burmannii from Khasi Hills." That is the power of the system you have built.',
      checkQuestion: 'Your classifier achieves 96% accuracy on the synthetic dataset. Would you expect similar performance on real botanical data? Why or why not?',
      checkAnswer: 'Likely lower on real data. Synthetic data has clean, well-separated distributions with no missing values, measurement errors, or ambiguous specimens. Real data has noise, outliers, intermediate forms (hybrids), seasonal variation, and geographic variation. A realistic expectation would be 80-90% on clean real data. The gap between synthetic and real performance is called the "sim-to-real gap" and is a universal challenge in ML.',
      codeIntro: 'Build the complete prediction pipeline with explanation and a new-sample demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === COMPLETE CLASSIFIER PIPELINE ===

# 1. Data generation
def gen_data(n=100):
    data, labels = [], []
    specs = [(15,5,12,3,20,8,50,15,80,10,2,0.5,0),
             (3,1,2,0.5,0,0.1,30,10,20,8,5,1,1),
             (2,0.8,1,0.3,0.5,0.3,200,50,10,5,8,1.5,2),
             (0.3,0.1,0.2,0.05,0.01,0.005,80,20,60,15,3,0.8,3)]
    for s in specs:
        for _ in range(n):
            data.append([np.random.normal(s[0],s[1]), np.random.normal(s[2],s[3]),
                         np.random.normal(s[4],s[5]), np.random.normal(s[6],s[7]),
                         np.random.normal(s[8],s[9]), np.random.normal(s[10],s[11])])
            labels.append(s[12])
    return np.array(data), np.array(labels)

X, y = gen_data(150)
feat_names = ['Tube_cm', 'Rim_mm', 'Fluid_ml', 'Gland_density', 'Wall_angle', 'Texture']
class_names = ['Pitfall', 'Snap', 'Flypaper', 'Bladder']
class_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

# 2. Feature engineering
def engineer_features(X):
    tube, rim, fluid, glands, angle, texture = X.T
    aspect = tube / np.maximum(rim, 0.01)
    vol_len = fluid / np.maximum(tube, 0.01)
    gland_surf = glands / np.maximum(tube * rim, 0.01)
    log_size = np.log10(np.maximum(tube * rim, 0.001))
    return np.column_stack([X, aspect, vol_len, gland_surf, log_size])

X_full = engineer_features(X)
mu, sigma = X_full.mean(0), X_full.std(0)
X_norm = (X_full - mu) / np.maximum(sigma, 1e-10)

# 3. k-NN with explanation
def knn_classify(X_tr, y_tr, x_new, k=7):
    dists = np.sqrt(np.sum((X_tr - x_new)**2, axis=1))
    nn_idx = np.argsort(dists)[:k]
    nn_labels = y_tr[nn_idx]
    nn_dists = dists[nn_idx]

    # Weighted vote
    weights = 1.0 / np.maximum(nn_dists, 1e-10)
    scores = np.zeros(4)
    for l, w in zip(nn_labels, weights): scores[l] += w
    probs = scores / scores.sum()
    pred = np.argmax(probs)

    return pred, probs, nn_idx, nn_dists

# 4. Cross-validate
idx = np.random.permutation(len(X))
n_folds = 5
fold_size = len(X) // n_folds
cv_preds = np.zeros(len(X), dtype=int)

for fold in range(n_folds):
    te = idx[fold*fold_size:(fold+1)*fold_size if fold < n_folds-1 else len(X)]
    tr = np.setdiff1d(idx, te)
    for i in te:
        pred, _, _, _ = knn_classify(X_norm[tr], y[tr], X_norm[i])
        cv_preds[i] = pred

cv_acc = np.mean(cv_preds == y)

# 5. New sample predictions with explanations
new_samples = [
    [16, 11, 22, 45, 78, 2.1],    # Likely pitfall
    [2.5, 1.8, 0, 28, 22, 4.8],   # Likely snap
    [1.8, 0.9, 0.4, 210, 12, 7.5], # Likely flypaper
    [0.4, 0.18, 0.01, 75, 55, 2.8], # Likely bladder
    [8, 5, 10, 120, 45, 5],        # Ambiguous!
]

new_X = engineer_features(np.array(new_samples))
new_norm = (new_X - mu) / np.maximum(sigma, 1e-10)

fig, axes = plt.subplots(2, 3, figsize=(16, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Carnivorous Plant Classifier — Complete Pipeline (CV acc: {cv_acc:.1%})',
              color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Predictions for new samples
pred_labels = []
pred_probs = []
for i, x in enumerate(new_norm):
    pred, probs, nn_idx, nn_dists = knn_classify(X_norm, y, x)
    pred_labels.append(pred)
    pred_probs.append(probs)

# 1: Confidence bars for each new sample
bar_width = 0.15
for i, probs in enumerate(pred_probs):
    for c in range(4):
        axes[0, 0].bar(i + c * bar_width - 0.2, probs[c], bar_width,
                        color=class_colors[c], alpha=0.8)
axes[0, 0].set_xticks(range(len(new_samples)))
axes[0, 0].set_xticklabels([f'Sample {i+1}' for i in range(len(new_samples))], fontsize=8, color='white')
axes[0, 0].set_ylabel('Probability', color='white')
axes[0, 0].set_title('Predictions for 5 new samples', color='white', fontsize=10)
# Add prediction labels
for i, (pl, pp) in enumerate(zip(pred_labels, pred_probs)):
    axes[0, 0].text(i, max(pp) + 0.02, class_names[pl], ha='center', color='white', fontsize=8, fontweight='bold')

# 2: Feature comparison: new sample vs class means
class_means = np.array([X[y==c].mean(axis=0) for c in range(4)])
sample_idx = 4  # the ambiguous sample
axes[0, 1].plot(range(6), new_samples[sample_idx], 'wo-', linewidth=2, markersize=8, label='New sample', zorder=5)
for c in range(4):
    axes[0, 1].plot(range(6), class_means[c], '--', color=class_colors[c], linewidth=1.5, label=class_names[c], alpha=0.7)
axes[0, 1].set_xticks(range(6))
axes[0, 1].set_xticklabels([n[:5] for n in feat_names], fontsize=8, color='white')
axes[0, 1].set_title(f'Ambiguous sample vs class means', color='white', fontsize=10)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3: 2D scatter with new samples overlaid
f1, f2 = 0, 3  # tube, glands
for c in range(4):
    mask = y == c
    axes[0, 2].scatter(X[mask, f1], X[mask, f2], c=class_colors[c], s=15, alpha=0.3)
for i, s in enumerate(new_samples):
    axes[0, 2].scatter(s[f1], s[f2], c='white', s=150, marker='*', zorder=5, edgecolors=class_colors[pred_labels[i]], linewidths=2)
    axes[0, 2].annotate(f'S{i+1}', (s[f1], s[f2]), color='white', fontsize=8, fontweight='bold',
                          xytext=(5, 5), textcoords='offset points')
axes[0, 2].set_xlabel('Tube length (cm)', color='white')
axes[0, 2].set_ylabel('Gland density', color='white')
axes[0, 2].set_title('New samples in feature space', color='white', fontsize=10)

# 4: Cross-validation confusion matrix
conf = np.zeros((4, 4), dtype=int)
for t, p in zip(y, cv_preds): conf[t, p] += 1
conf_pct = conf / conf.sum(axis=1, keepdims=True)
im = axes[1, 0].imshow(conf_pct, cmap='RdYlGn', vmin=0, vmax=1)
for i in range(4):
    for j in range(4):
        axes[1, 0].text(j, i, f'{conf_pct[i,j]:.0%}', ha='center', va='center',
                         color='black' if conf_pct[i,j] > 0.5 else 'white', fontsize=11, fontweight='bold')
axes[1, 0].set_xticks(range(4)); axes[1, 0].set_yticks(range(4))
axes[1, 0].set_xticklabels(class_names, fontsize=8, color='white')
axes[1, 0].set_yticklabels(class_names, fontsize=8, color='white')
axes[1, 0].set_title('CV confusion matrix', color='white', fontsize=10)

# 5: Per-class metrics
prec = np.array([conf[c,c]/max(conf[:,c].sum(),1) for c in range(4)])
rec = np.array([conf[c,c]/max(conf[c,:].sum(),1) for c in range(4)])
f1_score = 2*prec*rec/np.maximum(prec+rec, 1e-10)
x = np.arange(4)
axes[1, 1].bar(x-0.2, prec, 0.18, color='#ef4444', label='Precision')
axes[1, 1].bar(x, rec, 0.18, color='#3b82f6', label='Recall')
axes[1, 1].bar(x+0.2, f1_score, 0.18, color='#22c55e', label='F1')
axes[1, 1].set_xticks(x)
axes[1, 1].set_xticklabels(class_names, fontsize=9, color='white')
axes[1, 1].set_title('Classification metrics', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Prediction report
report = "PREDICTION REPORT\\\n" + "="*45
for i, (s, pl, pp) in enumerate(zip(new_samples, pred_labels, pred_probs)):
    report += f"\\\n\\\nSample {i+1}: [{', '.join(f'{v:.1f}' for v in s)}]"
    report += f"\\\n  Prediction: {class_names[pl]} ({pp[pl]*100:.0f}% confidence)"
    runner_up = np.argsort(pp)[-2]
    report += f"\\\n  Runner-up: {class_names[runner_up]} ({pp[runner_up]*100:.0f}%)"
    report += f"\\\n  {'CONFIDENT' if pp[pl] > 0.7 else 'AMBIGUOUS - manual review needed'}"

axes[1, 2].text(0.05, 0.95, report, transform=axes[1, 2].transAxes,
                 fontsize=7, color='#22c55e', family='monospace', verticalalignment='top')
axes[1, 2].set_title('Prediction explanations', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(report)
print(f"\\\n{'='*45}")
print(f"SYSTEM PERFORMANCE: {cv_acc:.1%} cross-validated accuracy")
print(f"Macro F1: {f1_score.mean():.2f}")
print(f"\\\nThis classifier can identify carnivorous plant trap types")
print(f"from 6 morphological measurements with {cv_acc:.0%} accuracy.")`,
      challenge: 'Add a "reject option": if the maximum predicted probability is below 0.5, the classifier should say "uncertain" instead of making a forced prediction. How many of the test samples would be rejected?',
      successHint: 'You built a complete machine learning pipeline from scratch: data, features, models, evaluation, and explanation. This same workflow applies to any classification problem in biology, medicine, or engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Carnivorous Plant Classifier
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Classify trap types from morphological features</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete ML classifier. Click to load Python.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
