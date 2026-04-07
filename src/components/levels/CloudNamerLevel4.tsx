import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudNamerLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone — Build a Cloud Type Classifier using a decision tree',
      concept: `In this capstone you will build a decision tree classifier from scratch that identifies cloud types from their physical features. A decision tree makes predictions by asking a sequence of yes/no questions about input features, splitting the data at each node to maximize the separation between classes. The key metric is information gain — based on entropy or Gini impurity.

Your classifier will take five features as input: optical depth (τ), cloud top temperature (K), cloud base height (km), cloud thickness (km), and liquid water path (g/m²). These are the features available from satellite and radiosonde observations. The tree will learn to classify 6 cloud types: cirrus, cumulus, cumulonimbus, stratus, stratocumulus, and altostratus.

You will implement the full decision tree algorithm: (1) compute Gini impurity for candidate splits, (2) select the feature and threshold that minimizes impurity, (3) recursively split until a stopping criterion (max depth, min samples, or pure nodes) is reached. Then you will evaluate the tree on held-out test data using accuracy, per-class precision and recall, and a confusion matrix. Finally, you will visualize the tree structure itself — showing which features the model finds most informative for cloud classification. This is the cloud namer\'s art, translated into an algorithm.`,
      analogy: 'A decision tree is like a field guide for identifying birds. The guide asks a series of questions: "Is it larger than a crow?" If yes, go to page 10. "Does it have webbed feet?" If yes, it is a duck. Each question splits possibilities until you reach an identification. A cloud classification decision tree does the same thing: "Is optical depth > 20?" "Is cloud top temperature < 230K?" Each answer narrows down the cloud type until the algorithm reaches a classification.',
      storyConnection: 'The cloud namer in the story learned to classify clouds by experience — observing features and associating them with names over years. Your decision tree does the same thing in seconds, learning which features matter most from labeled training data. The tree\'s first split will reveal the single most important feature for telling clouds apart — the algorithmic equivalent of the cloud namer\'s most fundamental observation.',
      checkQuestion: 'A decision tree splits first on cloud top temperature at 240K. Left branch (< 240K) contains mostly cirrus and cumulonimbus. It then splits on optical depth at 20. What does each resulting leaf predict, and why are these two features sufficient to separate these cloud types?',
      checkAnswer: 'Left-left (temp < 240K AND τ < 20): Cirrus — cold and thin. Left-right (temp < 240K AND τ > 20): Cumulonimbus — cold and thick. These two features separate high clouds by their optical thickness. Cirrus is ice-only and thin; cumulonimbus extends from near-surface to tropopause and is optically dense. Temperature tells you it is a high cloud; optical depth tells you whether it is wispy (cirrus) or towering (Cb).',
      codeIntro: 'Implement a decision tree classifier from scratch, train it on cloud feature data, visualize the tree structure, and evaluate classification accuracy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate training data: 6 cloud types with 5 features ---
def generate_cloud_dataset(n_per_class=100):
    X, y = [], []
    # Features: [optical_depth, cloud_top_temp(K), base_height(km), thickness(km), LWP(g/m²)]
    specs = {
        'Cirrus':       ([1.5, 218, 8, 1.5, 5],    [1.0, 10, 1.5, 0.8, 3]),
        'Cumulus':       ([8, 272, 1.5, 2.5, 50],   [4, 8, 0.5, 1.0, 20]),
        'Cumulonimbus': ([55, 212, 0.5, 12, 500],   [15, 8, 0.3, 3, 150]),
        'Stratus':       ([18, 280, 0.3, 0.5, 80],  [8, 5, 0.2, 0.3, 30]),
        'Stratocumulus': ([12, 276, 1.0, 1.2, 60],  [5, 6, 0.4, 0.5, 25]),
        'Altostratus':   ([10, 255, 3, 2.0, 40],    [5, 10, 1.0, 1.0, 20]),
    }
    for name, (means, stds) in specs.items():
        samples = np.random.normal(means, stds, (n_per_class, 5))
        samples = np.maximum(samples, 0.1)  # no negatives
        X.append(samples)
        y.extend([name] * n_per_class)
    return np.vstack(X), np.array(y)

X, y = generate_cloud_dataset()
feature_names = ['Optical depth', 'Cloud top temp (K)', 'Base height (km)',
                 'Thickness (km)', 'LWP (g/m²)']
classes = np.unique(y)

# --- Decision Tree from scratch ---
def gini_impurity(y):
    if len(y) == 0: return 0
    classes_local, counts = np.unique(y, return_counts=True)
    p = counts / len(y)
    return 1 - np.sum(p**2)

def best_split(X, y):
    best_gini = 1.0
    best_feat = 0
    best_thresh = 0
    for feat in range(X.shape[1]):
        thresholds = np.percentile(X[:, feat], np.arange(10, 100, 5))
        for thresh in thresholds:
            left = y[X[:, feat] <= thresh]
            right = y[X[:, feat] > thresh]
            if len(left) == 0 or len(right) == 0:
                continue
            gini = (len(left) * gini_impurity(left) + len(right) * gini_impurity(right)) / len(y)
            if gini < best_gini:
                best_gini = gini
                best_feat = feat
                best_thresh = thresh
    return best_feat, best_thresh, best_gini

class DecisionNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, prediction=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.prediction = prediction

def build_tree(X, y, depth=0, max_depth=5, min_samples=5):
    if len(np.unique(y)) == 1:
        return DecisionNode(prediction=y[0])
    if depth >= max_depth or len(y) < min_samples:
        vals, counts = np.unique(y, return_counts=True)
        return DecisionNode(prediction=vals[np.argmax(counts)])

    feat, thresh, gini = best_split(X, y)
    left_mask = X[:, feat] <= thresh
    right_mask = ~left_mask

    if left_mask.sum() == 0 or right_mask.sum() == 0:
        vals, counts = np.unique(y, return_counts=True)
        return DecisionNode(prediction=vals[np.argmax(counts)])

    left_node = build_tree(X[left_mask], y[left_mask], depth+1, max_depth, min_samples)
    right_node = build_tree(X[right_mask], y[right_mask], depth+1, max_depth, min_samples)
    return DecisionNode(feature=feat, threshold=thresh, left=left_node, right=right_node)

def predict_one(node, x):
    if node.prediction is not None:
        return node.prediction
    if x[node.feature] <= node.threshold:
        return predict_one(node.left, x)
    return predict_one(node.right, x)

def predict(node, X):
    return np.array([predict_one(node, x) for x in X])

# Train-test split
idx = np.random.permutation(len(X))
n_train = int(0.7 * len(X))
X_train, X_test = X[idx[:n_train]], X[idx[n_train:]]
y_train, y_test = y[idx[:n_train]], y[idx[n_train:]]

# Build tree
tree = build_tree(X_train, y_train, max_depth=6)
y_pred = predict(tree, X_test)
accuracy = np.mean(y_pred == y_test)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Feature importance (by counting splits)
ax = axes[0, 0]
ax.set_facecolor('#111827')

def count_feature_splits(node, counts=None):
    if counts is None:
        counts = np.zeros(5)
    if node.prediction is not None:
        return counts
    counts[node.feature] += 1
    count_feature_splits(node.left, counts)
    count_feature_splits(node.right, counts)
    return counts

feat_counts = count_feature_splits(tree)
feat_importance = feat_counts / feat_counts.sum() if feat_counts.sum() > 0 else feat_counts
colors_f = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7']
bars = ax.barh(feature_names, feat_importance, color=colors_f, alpha=0.8,
               edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, feat_importance):
    ax.text(val + 0.01, bar.get_y() + bar.get_height()/2,
            f'{val:.0%}', va='center', color='white', fontsize=10)
ax.set_xlabel('Feature importance (split frequency)', color='white')
ax.set_title('Decision Tree Feature Importance', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Confusion matrix
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
class_to_idx = {c: i for i, c in enumerate(classes)}
conf = np.zeros((len(classes), len(classes)), dtype=int)
for true, pred in zip(y_test, y_pred):
    conf[class_to_idx[true], class_to_idx[pred]] += 1

im = ax2.imshow(conf, cmap='Blues', aspect='auto')
ax2.set_xticks(range(len(classes)))
ax2.set_yticks(range(len(classes)))
ax2.set_xticklabels([c[:6] for c in classes], fontsize=8, rotation=45)
ax2.set_yticklabels([c[:6] for c in classes], fontsize=8)
for i in range(len(classes)):
    for j in range(len(classes)):
        ax2.text(j, i, str(conf[i, j]), ha='center', va='center',
                color='white' if conf[i, j] > conf.max()/2 else 'gray',
                fontsize=10, fontweight='bold')
ax2.set_xlabel('Predicted', color='white')
ax2.set_ylabel('True', color='white')
ax2.set_title(f'Confusion Matrix (acc = {accuracy:.1%})', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Decision boundary (2D projection: optical depth vs cloud top temp)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
xx, yy = np.meshgrid(np.linspace(0, 80, 150), np.linspace(195, 295, 150))
# Use mean values for other features
grid_data = np.column_stack([
    xx.ravel(), yy.ravel(),
    np.full(xx.size, X[:, 2].mean()),
    np.full(xx.size, X[:, 3].mean()),
    np.full(xx.size, X[:, 4].mean()),
])
grid_pred = predict(tree, grid_data)
grid_nums = np.array([class_to_idx[p] for p in grid_pred]).reshape(xx.shape)

from matplotlib.colors import ListedColormap
class_colors_list = ['#22c55e', '#818cf8', '#ef4444', '#3b82f6', '#f59e0b', '#6366f1']
cmap = ListedColormap(class_colors_list[:len(classes)])
ax3.contourf(xx, yy, grid_nums, alpha=0.3, cmap=cmap, levels=np.arange(-0.5, len(classes)))
for cls, color in zip(classes, class_colors_list):
    mask = y == cls
    ax3.scatter(X[mask, 0], X[mask, 1], c=color, s=10, alpha=0.5, label=cls)
ax3.set_xlabel('Optical depth (τ)', color='white')
ax3.set_ylabel('Cloud top temperature (K)', color='white')
ax3.set_title('Decision Boundary (2D projection)', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white',
           markerscale=2)
ax3.tick_params(colors='gray')

# Plot 4: Accuracy vs tree depth
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
depths = range(1, 12)
train_accs = []
test_accs = []
for d in depths:
    t = build_tree(X_train, y_train, max_depth=d)
    train_accs.append(np.mean(predict(t, X_train) == y_train))
    test_accs.append(np.mean(predict(t, X_test) == y_test))

ax4.plot(list(depths), train_accs, 'o-', color='#3b82f6', linewidth=2, label='Train accuracy')
ax4.plot(list(depths), test_accs, 's-', color='#ef4444', linewidth=2, label='Test accuracy')
ax4.fill_between(list(depths), train_accs, test_accs, alpha=0.1, color='#f59e0b',
                  label='Overfitting gap')
best_depth = list(depths)[np.argmax(test_accs)]
ax4.axvline(best_depth, color='#fbbf24', linewidth=1.5, linestyle='--',
            label=f'Best depth = {best_depth}')
ax4.set_xlabel('Max tree depth', color='white')
ax4.set_ylabel('Accuracy', color='white')
ax4.set_title('Train vs Test Accuracy by Depth', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Print report
print("=" * 65)
print("    CLOUD TYPE DECISION TREE CLASSIFIER — REPORT")
print("=" * 65)
print(f"\\\nDataset: {len(X)} samples, {len(classes)} classes, {len(feature_names)} features")
print(f"Train/test split: {n_train}/{len(X)-n_train}")
print(f"\\\nOverall test accuracy: {accuracy:.1%}")
print(f"Best tree depth: {best_depth} (test acc: {max(test_accs):.1%})")
print()
print("Per-class metrics:")
print(f"{'Class':<18} {'Precision':>10} {'Recall':>10} {'Count':>8}")
print("-" * 48)
for cls in classes:
    true_pos = sum((y_test == cls) & (y_pred == cls))
    pred_pos = sum(y_pred == cls)
    actual_pos = sum(y_test == cls)
    precision = true_pos / max(pred_pos, 1)
    recall = true_pos / max(actual_pos, 1)
    print(f"{cls:<18} {precision:>9.0%} {recall:>9.0%} {actual_pos:>8}")

print(f"\\\nFeature importance (split frequency):")
for name, imp in sorted(zip(feature_names, feat_importance), key=lambda x: -x[1]):
    print(f"  {name:<25} {imp:.0%}")

print(f"\\\nThe tree's first split reveals the most informative feature for")
print(f"distinguishing cloud types — the algorithmic cloud namer's key insight.")`,
      challenge: 'Implement a random forest by building 10 decision trees, each trained on a bootstrap sample of the data with a random subset of features at each split. Combine their predictions by majority vote and show how the ensemble outperforms any individual tree.',
      successHint: 'You have built a machine learning classifier from first principles — no libraries, just numpy. The decision tree is the foundation of many powerful algorithms (random forests, gradient boosting). Your cloud classifier translates the cloud namer\'s experiential knowledge into a reproducible, automated system.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Cloud Type Classifier using a decision tree from scratch</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a decision tree classifier from scratch. Click to start.</p>
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
