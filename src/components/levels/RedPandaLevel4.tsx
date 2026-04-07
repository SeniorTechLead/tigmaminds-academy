import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone overview — Species Threat Classifier',
      concept: `In this capstone you will build a machine learning classifier that predicts **IUCN Red List status** from measurable species attributes. This is a real research problem — conservation biologists need rapid assessment tools for the thousands of species that have not yet been formally evaluated.

The pipeline:

1. **Dataset construction**: Generate realistic species data with features like population size, range area, habitat loss rate, body mass, reproductive rate, and human pressure index
2. **Feature engineering**: Transform raw attributes into informative features for classification
3. **Multi-class classifier**: Build a model that predicts LC, NT, VU, EN, or CR status
4. **Evaluation and interpretation**: Assess accuracy, identify which features matter most, and understand where the model fails

Why this matters: The IUCN has assessed ~150,000 species, but there are an estimated 8.7 million species on Earth. A reliable threat classifier could prioritize which species need urgent formal assessment, potentially saving hundreds of species from unnoticed extinction.

The classifier will use **decision trees** and **random forests** — interpretable models where you can trace exactly why a species was classified as endangered.`,
      analogy: 'Building a threat classifier is like training a medical resident to diagnose patients. You show them hundreds of case studies (species assessments) with symptoms (population size, range, decline rate) and diagnoses (IUCN status). After enough training, they can diagnose new patients (unassessed species) they have never seen. The decision tree is literally the diagnostic flowchart they learn.',
      storyConnection: 'The red panda is Endangered. But what about the hundreds of other species in its mountain forest that have never been assessed? This classifier could screen every species in the ecosystem and flag the ones most likely to be at risk — giving conservationists a priority list instead of guessing.',
      checkQuestion: 'Why might a classifier trained on well-studied mammals perform poorly on amphibians or insects?',
      checkAnswer: 'The features that predict threat in mammals (body mass, range size, reproductive rate) may have different distributions or importance in other taxa. Amphibians are threatened primarily by disease (chytrid fungus) and insects by pesticides — factors not captured by mammalian trait data. A good classifier needs training data from the target taxon, or at minimum, taxa-specific features.',
      codeIntro: 'Stage 1: Generate a realistic dataset of species attributes and IUCN classifications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_species_dataset(n_species=500):
    """
    Generate realistic species data with correlated attributes.
    Features based on real correlates of extinction risk.
    """
    data = {}

    # Population size (log-normal: most species are common, few are rare)
    log_pop = np.random.normal(8, 3, n_species)  # log10 population
    log_pop = np.clip(log_pop, 1, 12)
    data['population'] = 10 ** log_pop

    # Geographic range (km², correlated with population)
    log_range = 0.6 * log_pop + np.random.normal(2, 1.5, n_species)
    log_range = np.clip(log_range, 0, 8)
    data['range_km2'] = 10 ** log_range

    # Body mass (kg, log-normal)
    log_mass = np.random.normal(0, 2, n_species)
    data['body_mass_kg'] = 10 ** np.clip(log_mass, -3, 4)

    # Generation time (years, correlated with body mass)
    data['generation_years'] = 1 + 3 * np.log10(data['body_mass_kg'] + 1) + np.random.exponential(2, n_species)
    data['generation_years'] = np.clip(data['generation_years'], 0.5, 30)

    # Habitat loss rate (% per year)
    data['habitat_loss_pct'] = np.random.exponential(1.5, n_species)
    data['habitat_loss_pct'] = np.clip(data['habitat_loss_pct'], 0, 15)

    # Human pressure index (0-100)
    data['human_pressure'] = np.random.beta(2, 3, n_species) * 100

    # Reproductive rate (offspring per year, inversely related to body mass)
    data['repro_rate'] = 10 / (data['body_mass_kg'] ** 0.25 + 1) + np.random.exponential(0.5, n_species)

    # Fragmentation index (0-1)
    data['fragmentation'] = np.random.beta(2, 5, n_species)
    data['fragmentation'] += 0.3 * data['habitat_loss_pct'] / 15  # more loss = more fragmented
    data['fragmentation'] = np.clip(data['fragmentation'], 0, 1)

    # Assign IUCN status based on realistic rules
    # Population decline over 3 generations
    decline_3gen = (data['habitat_loss_pct'] * data['generation_years'] * 3 *
                   (1 + data['human_pressure']/200))
    decline_3gen = np.clip(decline_3gen, 0, 99)

    status = np.full(n_species, 'LC', dtype='U2')

    # Criterion A: population decline
    status[decline_3gen >= 20] = 'NT'
    status[decline_3gen >= 30] = 'VU'
    status[decline_3gen >= 50] = 'EN'
    status[decline_3gen >= 80] = 'CR'

    # Criterion C: small population + decline
    small_declining = (data['population'] < 10000) & (decline_3gen > 10)
    status[small_declining & (data['population'] < 10000)] = np.where(
        status[small_declining & (data['population'] < 10000)] < 'VU', 'VU',
        status[small_declining & (data['population'] < 10000)])

    very_small = data['population'] < 2500
    status[very_small & (decline_3gen > 5)] = 'EN'
    status[data['population'] < 250] = 'CR'

    # Criterion B: small range + fragmented
    status[(data['range_km2'] < 5000) & (data['fragmentation'] > 0.5)] = np.maximum(
        status[(data['range_km2'] < 5000) & (data['fragmentation'] > 0.5)], 'EN')

    # Add some noise (real classifications have subjective elements)
    for i in range(n_species):
        if np.random.random() < 0.05:  # 5% random reclassification
            cats = ['LC', 'NT', 'VU', 'EN', 'CR']
            idx = cats.index(status[i])
            new_idx = max(0, min(4, idx + np.random.choice([-1, 1])))
            status[i] = cats[new_idx]

    data['status'] = status
    data['decline_3gen'] = decline_3gen
    return data

data = generate_species_dataset(500)

# Feature matrix
feature_names = ['log_population', 'log_range', 'log_body_mass',
                 'generation_years', 'habitat_loss_pct', 'human_pressure',
                 'repro_rate', 'fragmentation']
X = np.column_stack([
    np.log10(data['population']),
    np.log10(data['range_km2']),
    np.log10(data['body_mass_kg']),
    data['generation_years'],
    data['habitat_loss_pct'],
    data['human_pressure'],
    data['repro_rate'],
    data['fragmentation'],
])

# Encode labels
cat_order = ['LC', 'NT', 'VU', 'EN', 'CR']
y = np.array([cat_order.index(s) for s in data['status']])

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Class distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
cats, counts = np.unique(data['status'], return_counts=True)
cat_colors = {'LC': '#3b82f6', 'NT': '#22c55e', 'VU': '#eab308', 'EN': '#f59e0b', 'CR': '#ef4444'}
ordered = [(c, counts[list(cats).index(c)] if c in cats else 0) for c in cat_order]
ax.bar([o[0] for o in ordered], [o[1] for o in ordered],
       color=[cat_colors[o[0]] for o in ordered], edgecolor='none')
ax.set_xlabel('IUCN Status', color='white')
ax.set_ylabel('Number of species', color='white')
ax.set_title('Dataset class distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Population vs range colored by status
ax = axes[0, 1]
ax.set_facecolor('#111827')
for cat in cat_order:
    mask = data['status'] == cat
    ax.scatter(np.log10(data['population'][mask]), np.log10(data['range_km2'][mask]),
               s=15, color=cat_colors[cat], alpha=0.6, label=cat)
ax.set_xlabel('log10(Population)', color='white')
ax.set_ylabel('log10(Range km²)', color='white')
ax.set_title('Population vs Range by status', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Feature distributions by status
ax = axes[1, 0]
ax.set_facecolor('#111827')
for cat in ['LC', 'EN', 'CR']:
    mask = data['status'] == cat
    ax.hist(data['habitat_loss_pct'][mask], bins=20, alpha=0.5,
            color=cat_colors[cat], label=cat, density=True)
ax.set_xlabel('Habitat loss rate (%/year)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Habitat loss distribution by status', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Correlation heatmap
ax = axes[1, 1]
ax.set_facecolor('#111827')
corr_with_status = np.array([np.corrcoef(X[:, i], y)[0, 1] for i in range(X.shape[1])])
sort_idx = np.argsort(np.abs(corr_with_status))[::-1]
ax.barh(range(len(feature_names)), corr_with_status[sort_idx],
        color=['#ef4444' if c > 0 else '#3b82f6' for c in corr_with_status[sort_idx]],
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(feature_names)))
ax.set_yticklabels([feature_names[i] for i in sort_idx], color='white', fontsize=9)
ax.set_xlabel('Correlation with threat level', color='white')
ax.set_title('Feature importance (correlation)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dataset summary:")
print(f"  Total species: {len(data['status'])}")
for cat in cat_order:
    n = np.sum(data['status'] == cat)
    print(f"  {cat}: {n} ({100*n/len(data['status']):.0f}%)")
print(f"\\nFeatures: {len(feature_names)}")
print(f"Most predictive: {feature_names[sort_idx[0]]} (r={corr_with_status[sort_idx[0]]:.3f})")`,
      challenge: 'Add two more features: (1) island_endemic (boolean, 0 or 1 — island species are more vulnerable) and (2) specialized_diet (0-1, specialists are more at risk). Regenerate the dataset and check if these features improve prediction of threat status.',
      successHint: 'A good dataset with well-chosen features is 80% of any ML project. The remaining 20% is choosing and tuning the model. Never skip the data exploration stage.',
    },
    {
      title: 'Decision tree classifier — interpretable threat prediction',
      concept: `A **decision tree** splits the data using a series of yes/no questions, each based on a single feature threshold. At each node, it chooses the split that best separates the classes.

The splitting criterion is **Gini impurity** (or information gain):

Gini(S) = 1 - Σ pᵢ²

Where pᵢ is the proportion of class i in set S. Pure nodes (all one class) have Gini = 0. Maximum impurity (all classes equally represented) has Gini near 1.

At each node, the algorithm:
1. Considers every feature and every possible threshold
2. Computes the weighted Gini impurity after splitting
3. Chooses the split that reduces impurity the most

Decision trees are **interpretable** — you can trace exactly why a species was classified as Endangered: "population < 5000? yes → habitat loss > 3%? yes → range < 10000 km²? yes → Endangered." This transparency is essential for conservation decisions where stakeholders need to understand the reasoning.

**Overfitting risk**: a deep tree with many splits will memorize the training data. Pruning (limiting tree depth) or requiring minimum samples per leaf prevents this.`,
      analogy: 'A decision tree is like a field guide for identifying birds. "Is it larger than a sparrow? → Does it have webbed feet? → Is its bill hooked? → It is a hawk." Each question narrows the possibilities. The order of questions matters — you start with the most discriminating features (size, habitat) before subtle ones (bill shape). A decision tree learns this ordering from data.',
      storyConnection: 'If a field biologist in the red panda\'s forest discovers an unknown species, the decision tree would be their rapid assessment tool. Input the species\' population estimate, range size, and habitat loss rate, and the tree outputs a predicted IUCN status — all without waiting for a formal multi-year assessment.',
      checkQuestion: 'A decision tree classifies all species with population < 500 as Critically Endangered. But one species in this group has a stable population and wide range. What went wrong?',
      checkAnswer: 'The tree used a single feature (population) without considering context. That species has a naturally small but stable population — it is a specialist with low numbers but no actual decline. A better tree would split on population AND decline rate, not population alone. This is why multiple features and deeper trees are needed for nuanced classification.',
      codeIntro: 'Build a decision tree classifier from scratch using Gini impurity, with visualization of the tree structure and decision boundaries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate dataset
n = 500
log_pop = np.clip(np.random.normal(8, 3, n), 1, 12)
population = 10**log_pop
log_range = np.clip(0.6*log_pop + np.random.normal(2, 1.5, n), 0, 8)
range_km2 = 10**log_range
habitat_loss = np.clip(np.random.exponential(1.5, n), 0, 15)
human_pressure = np.random.beta(2, 3, n) * 100
gen_years = np.clip(1 + np.random.exponential(3, n), 0.5, 30)
fragmentation = np.clip(np.random.beta(2, 5, n) + 0.3*habitat_loss/15, 0, 1)

decline = np.clip(habitat_loss * gen_years * 3 * (1 + human_pressure/200), 0, 99)
status = np.zeros(n, dtype=int)  # 0=LC, 1=NT, 2=VU, 3=EN, 4=CR
status[decline >= 20] = 1
status[decline >= 30] = 2
status[decline >= 50] = 3
status[decline >= 80] = 4
status[population < 2500] = np.maximum(status[population < 2500], 3)
status[population < 250] = 4

X = np.column_stack([log_pop, log_range, habitat_loss, human_pressure, gen_years, fragmentation])
y = status
feat_names = ['log_pop', 'log_range', 'habitat_loss', 'human_pressure', 'gen_years', 'frag']
cat_names = ['LC', 'NT', 'VU', 'EN', 'CR']

# Train/test split
idx = np.random.permutation(n)
split = int(0.8 * n)
X_train, X_test = X[idx[:split]], X[idx[split:]]
y_train, y_test = y[idx[:split]], y[idx[split:]]

# ---- Decision Tree from scratch ----
class DecisionTreeNode:
    def __init__(self, depth=0, max_depth=5, min_samples=5):
        self.depth = depth
        self.max_depth = max_depth
        self.min_samples = min_samples
        self.feature = None
        self.threshold = None
        self.left = None
        self.right = None
        self.prediction = None
        self.gini = None
        self.n_samples = 0

    def gini_impurity(self, y):
        if len(y) == 0: return 0
        classes, counts = np.unique(y, return_counts=True)
        probs = counts / len(y)
        return 1 - np.sum(probs**2)

    def best_split(self, X, y):
        best_gini = float('inf')
        best_feat, best_thresh = None, None
        n = len(y)
        current_gini = self.gini_impurity(y)

        for f in range(X.shape[1]):
            thresholds = np.unique(X[:, f])
            if len(thresholds) > 20:
                thresholds = np.percentile(X[:, f], np.linspace(5, 95, 20))
            for t in thresholds:
                left_mask = X[:, f] <= t
                right_mask = ~left_mask
                if left_mask.sum() < self.min_samples or right_mask.sum() < self.min_samples:
                    continue
                weighted_gini = (left_mask.sum()/n * self.gini_impurity(y[left_mask]) +
                                right_mask.sum()/n * self.gini_impurity(y[right_mask]))
                if weighted_gini < best_gini:
                    best_gini = weighted_gini
                    best_feat = f
                    best_thresh = t

        return best_feat, best_thresh, best_gini

    def fit(self, X, y):
        self.n_samples = len(y)
        self.gini = self.gini_impurity(y)
        classes, counts = np.unique(y, return_counts=True)
        self.prediction = classes[np.argmax(counts)]
        self.class_dist = {c: int(cnt) for c, cnt in zip(classes, counts)}

        if self.depth >= self.max_depth or len(y) < 2 * self.min_samples or self.gini == 0:
            return

        feat, thresh, gini = self.best_split(X, y)
        if feat is None:
            return

        self.feature = feat
        self.threshold = thresh
        left_mask = X[:, feat] <= thresh

        self.left = DecisionTreeNode(self.depth+1, self.max_depth, self.min_samples)
        self.left.fit(X[left_mask], y[left_mask])

        self.right = DecisionTreeNode(self.depth+1, self.max_depth, self.min_samples)
        self.right.fit(X[~left_mask], y[~left_mask])

    def predict_one(self, x):
        if self.feature is None:
            return self.prediction
        if x[self.feature] <= self.threshold:
            return self.left.predict_one(x)
        return self.right.predict_one(x)

    def predict(self, X):
        return np.array([self.predict_one(x) for x in X])

# Train tree
tree = DecisionTreeNode(max_depth=5, min_samples=10)
tree.fit(X_train, y_train)

train_acc = np.mean(tree.predict(X_train) == y_train)
test_acc = np.mean(tree.predict(X_test) == y_test)

# Feature importance (based on Gini reduction)
def feature_importance(node, importances=None):
    if importances is None:
        importances = np.zeros(X.shape[1])
    if node.feature is not None:
        importances[node.feature] += node.n_samples * node.gini
        if node.left: feature_importance(node.left, importances)
        if node.right: feature_importance(node.right, importances)
    return importances

imp = feature_importance(tree)
imp = imp / imp.sum()

# Confusion matrix
y_pred = tree.predict(X_test)
n_classes = 5
conf = np.zeros((n_classes, n_classes), dtype=int)
for true, pred in zip(y_test, y_pred):
    conf[true, pred] += 1

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Accuracy comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
depths = range(1, 12)
train_accs, test_accs = [], []
for d in depths:
    t = DecisionTreeNode(max_depth=d, min_samples=5)
    t.fit(X_train, y_train)
    train_accs.append(np.mean(t.predict(X_train) == y_train))
    test_accs.append(np.mean(t.predict(X_test) == y_test))
ax.plot(list(depths), train_accs, 'o-', color='#22c55e', label='Train')
ax.plot(list(depths), test_accs, 'o-', color='#ef4444', label='Test')
ax.set_xlabel('Max tree depth', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Overfitting: depth vs accuracy', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Feature importance
ax = axes[0, 1]
ax.set_facecolor('#111827')
sort_idx = np.argsort(imp)
ax.barh(range(len(feat_names)), imp[sort_idx], color='#a855f7', edgecolor='none', height=0.6)
ax.set_yticks(range(len(feat_names)))
ax.set_yticklabels([feat_names[i] for i in sort_idx], color='white')
ax.set_xlabel('Importance', color='white')
ax.set_title('Feature importance (Gini reduction)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Confusion matrix
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(conf, cmap='YlOrRd', aspect='auto')
for i in range(n_classes):
    for j in range(n_classes):
        ax.text(j, i, str(conf[i,j]), ha='center', va='center',
                color='white' if conf[i,j] > conf.max()/2 else 'black', fontsize=11)
ax.set_xticks(range(n_classes))
ax.set_yticks(range(n_classes))
ax.set_xticklabels(cat_names, color='white')
ax.set_yticklabels(cat_names, color='white')
ax.set_xlabel('Predicted', color='white')
ax.set_ylabel('True', color='white')
ax.set_title(f'Confusion matrix (acc={test_acc:.1%})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Per-class accuracy
ax = axes[1, 1]
ax.set_facecolor('#111827')
per_class = []
for c in range(n_classes):
    mask = y_test == c
    if mask.sum() > 0:
        per_class.append(np.mean(y_pred[mask] == c))
    else:
        per_class.append(0)
cat_colors = ['#3b82f6', '#22c55e', '#eab308', '#f59e0b', '#ef4444']
ax.bar(cat_names, per_class, color=cat_colors, edgecolor='none', width=0.5)
ax.set_ylabel('Per-class accuracy', color='white')
ax.set_title('Accuracy by IUCN category', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.1)

plt.tight_layout()
plt.show()

print(f"Decision tree results (max_depth=5):")
print(f"  Train accuracy: {train_acc:.1%}")
print(f"  Test accuracy:  {test_acc:.1%}")
print(f"  Most important feature: {feat_names[np.argmax(imp)]}")
print(f"\\nPer-class accuracy:")
for cat, acc in zip(cat_names, per_class):
    print(f"  {cat}: {acc:.1%}")`,
      challenge: 'Print the decision path for a specific species (the red panda: population=10000, range=15000, habitat_loss=3, human_pressure=40, gen_years=6, fragmentation=0.5). Trace which features the tree uses to classify it. Does the reasoning make biological sense?',
      successHint: 'Decision trees are the only ML model where you can fully explain every prediction. In conservation, where decisions affect species survival, this interpretability is not optional — it is essential.',
    },
    {
      title: 'Random forest — ensemble power for robust prediction',
      concept: `A single decision tree is brittle — small changes in training data can produce very different trees. A **random forest** fixes this by training many trees on random subsets of the data and having them vote.

The algorithm:
1. For each tree (say 100 trees):
   a. **Bootstrap sample**: randomly select N training examples WITH replacement (some duplicated, some omitted)
   b. **Feature subsampling**: at each split, consider only a random subset of features (typically √p where p is total features)
   c. Train the tree on this modified dataset

2. For prediction: each tree votes, and the majority class wins

Why this works:
- **Bootstrap aggregating (bagging)** reduces variance. Each tree overfits differently, but their average does not.
- **Feature subsampling** decorrelates the trees. Without it, every tree would split on the same dominant feature first, making them all similar.
- **Out-of-bag (OOB) error**: each tree has ~37% of data not used in training (the bootstrap omitted them). We can evaluate each tree on its OOB samples for a free cross-validation estimate.

Random forests also provide **feature importance** rankings: measure how much accuracy drops when a feature is randomly permuted. Features that matter most cause the largest accuracy drop when scrambled.`,
      analogy: 'A random forest is like a jury trial. Each juror (tree) hears a slightly different version of the evidence (bootstrap sample), focuses on different aspects (feature subsampling), and reaches an independent verdict. The final verdict comes from the majority vote. A single biased juror is outvoted by the majority. This is why juries (and random forests) make better decisions than individuals.',
      storyConnection: 'Assessing the red panda\'s threat status based on a single criterion could be misleading — maybe population alone says Vulnerable but habitat loss says Endangered. A random forest considers all criteria simultaneously across hundreds of independent assessments and reaches a consensus. It is a democratic, robust assessment tool.',
      checkQuestion: 'A random forest with 100 trees gives 75% accuracy. You increase to 1000 trees but accuracy stays at 75%. Why does adding more trees not help?',
      checkAnswer: 'Random forests have a theoretical accuracy ceiling determined by the strength of individual trees and their correlation. Once you have enough trees to average out the variance (typically 50-200), adding more trees does not improve accuracy — it just makes predictions more stable. To improve accuracy beyond this ceiling, you need better features, more training data, or a fundamentally different model architecture.',
      codeIntro: 'Build a random forest from scratch using bootstrapped decision trees, and compare its performance to a single tree.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate dataset (compact)
n = 500
log_pop = np.clip(np.random.normal(8, 3, n), 1, 12)
pop = 10**log_pop
log_rng = np.clip(0.6*log_pop + np.random.normal(2, 1.5, n), 0, 8)
hl = np.clip(np.random.exponential(1.5, n), 0, 15)
hp = np.random.beta(2, 3, n) * 100
gy = np.clip(1 + np.random.exponential(3, n), 0.5, 30)
frag = np.clip(np.random.beta(2, 5, n) + 0.3*hl/15, 0, 1)
decline = np.clip(hl * gy * 3 * (1 + hp/200), 0, 99)
y = np.zeros(n, dtype=int)
y[decline>=20]=1; y[decline>=30]=2; y[decline>=50]=3; y[decline>=80]=4
y[pop<2500]=np.maximum(y[pop<2500],3); y[pop<250]=4

X = np.column_stack([log_pop, log_rng, hl, hp, gy, frag])
feat_names = ['log_pop', 'log_range', 'hab_loss', 'human_press', 'gen_years', 'frag']
cat_names = ['LC', 'NT', 'VU', 'EN', 'CR']

idx = np.random.permutation(n)
sp = int(0.8*n)
Xtr, Xte, ytr, yte = X[idx[:sp]], X[idx[sp:]], y[idx[:sp]], y[idx[sp:]]

# Simple decision tree (reused, compact)
class TreeNode:
    def __init__(self, depth=0, max_d=4, min_s=8, max_features=None):
        self.depth=depth; self.max_d=max_d; self.min_s=min_s
        self.max_features=max_features
        self.feat=None; self.thresh=None; self.left=None; self.right=None
        self.pred=None

    def gini(self, y):
        if len(y)==0: return 0
        _,c = np.unique(y, return_counts=True)
        p=c/len(y); return 1-np.sum(p**2)

    def fit(self, X, y):
        _,c = np.unique(y, return_counts=True)
        self.pred = np.unique(y)[np.argmax(c)] if len(y)>0 else 0
        if self.depth>=self.max_d or len(y)<2*self.min_s or self.gini(y)==0: return

        n_feat = X.shape[1]
        feat_subset = range(n_feat)
        if self.max_features and self.max_features < n_feat:
            feat_subset = np.random.choice(n_feat, self.max_features, replace=False)

        best_g, best_f, best_t = float('inf'), None, None
        for f in feat_subset:
            vals = np.unique(X[:,f])
            if len(vals)>15: vals = np.percentile(X[:,f], np.linspace(10,90,15))
            for t in vals:
                l=X[:,f]<=t; r=~l
                if l.sum()<self.min_s or r.sum()<self.min_s: continue
                wg = l.sum()/len(y)*self.gini(y[l]) + r.sum()/len(y)*self.gini(y[r])
                if wg < best_g: best_g,best_f,best_t = wg,f,t

        if best_f is None: return
        self.feat, self.thresh = best_f, best_t
        l = X[:,best_f]<=best_t
        self.left = TreeNode(self.depth+1, self.max_d, self.min_s, self.max_features)
        self.left.fit(X[l], y[l])
        self.right = TreeNode(self.depth+1, self.max_d, self.min_s, self.max_features)
        self.right.fit(X[~l], y[~l])

    def predict_one(self, x):
        if self.feat is None: return self.pred
        return self.left.predict_one(x) if x[self.feat]<=self.thresh else self.right.predict_one(x)

    def predict(self, X):
        return np.array([self.predict_one(x) for x in X])

# ---- Random Forest ----
class RandomForest:
    def __init__(self, n_trees=50, max_depth=4, min_samples=8, max_features=None):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.min_samples = min_samples
        self.max_features = max_features or int(np.sqrt(X.shape[1]))
        self.trees = []
        self.oob_indices = []

    def fit(self, X, y):
        n = len(y)
        self.trees = []
        self.oob_indices = []
        oob_predictions = np.full((n, self.n_trees), -1, dtype=int)

        for t in range(self.n_trees):
            # Bootstrap sample
            boot_idx = np.random.choice(n, n, replace=True)
            oob_idx = np.setdiff1d(np.arange(n), np.unique(boot_idx))

            tree = TreeNode(max_d=self.max_depth, min_s=self.min_samples,
                           max_features=self.max_features)
            tree.fit(X[boot_idx], y[boot_idx])
            self.trees.append(tree)

            # OOB predictions
            if len(oob_idx) > 0:
                preds = tree.predict(X[oob_idx])
                oob_predictions[oob_idx, t] = preds

        # Compute OOB error
        oob_votes = np.zeros((n, 5))
        for i in range(n):
            valid = oob_predictions[i] >= 0
            if valid.any():
                for c in oob_predictions[i, valid]:
                    oob_votes[i, c] += 1
        has_oob = oob_votes.sum(axis=1) > 0
        oob_preds = np.argmax(oob_votes[has_oob], axis=1)
        self.oob_accuracy = np.mean(oob_preds == y[has_oob])

    def predict(self, X):
        all_preds = np.array([tree.predict(X) for tree in self.trees])
        # Majority vote
        result = np.zeros(len(X), dtype=int)
        for i in range(len(X)):
            classes, counts = np.unique(all_preds[:, i], return_counts=True)
            result[i] = classes[np.argmax(counts)]
        return result

    def feature_importance(self, X, y, n_repeats=5):
        base_acc = np.mean(self.predict(X) == y)
        importances = np.zeros(X.shape[1])
        for f in range(X.shape[1]):
            drop = 0
            for _ in range(n_repeats):
                X_perm = X.copy()
                X_perm[:, f] = np.random.permutation(X_perm[:, f])
                drop += base_acc - np.mean(self.predict(X_perm) == y)
            importances[f] = drop / n_repeats
        return importances

# Train models
single_tree = TreeNode(max_d=5, min_s=8)
single_tree.fit(Xtr, ytr)

rf = RandomForest(n_trees=50, max_depth=5, min_samples=8)
rf.fit(Xtr, ytr)

tree_acc = np.mean(single_tree.predict(Xte) == yte)
rf_acc = np.mean(rf.predict(Xte) == yte)

# Feature importance
rf_imp = rf.feature_importance(Xte, yte)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Accuracy comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
models = ['Single tree', 'Random forest\\n(50 trees)', 'RF OOB']
accs = [tree_acc, rf_acc, rf.oob_accuracy]
colors = ['#f59e0b', '#22c55e', '#3b82f6']
bars = ax.bar(models, accs, color=colors, edgecolor='none', width=0.5)
for bar, acc in zip(bars, accs):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.01,
            f'{acc:.1%}', ha='center', color='white', fontsize=12, fontweight='bold')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Model comparison', color='white', fontsize=11)
ax.set_ylim(0, 1.1)
ax.tick_params(colors='gray')

# RF feature importance
ax = axes[0, 1]
ax.set_facecolor('#111827')
si = np.argsort(rf_imp)
ax.barh(range(len(feat_names)), rf_imp[si], color='#a855f7', edgecolor='none', height=0.6)
ax.set_yticks(range(len(feat_names)))
ax.set_yticklabels([feat_names[i] for i in si], color='white')
ax.set_xlabel('Permutation importance', color='white')
ax.set_title('Random forest feature importance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Number of trees vs accuracy
ax = axes[1, 0]
ax.set_facecolor('#111827')
n_tree_range = [1, 5, 10, 20, 30, 50, 75, 100]
rf_accs = []
for nt in n_tree_range:
    r = RandomForest(n_trees=nt, max_depth=5)
    r.fit(Xtr, ytr)
    rf_accs.append(np.mean(r.predict(Xte) == yte))
ax.plot(n_tree_range, rf_accs, 'o-', color='#22c55e', linewidth=2)
ax.axhline(tree_acc, color='#f59e0b', linestyle='--', label=f'Single tree ({tree_acc:.1%})')
ax.set_xlabel('Number of trees', color='white')
ax.set_ylabel('Test accuracy', color='white')
ax.set_title('Accuracy vs number of trees', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Confusion matrix for RF
ax = axes[1, 1]
ax.set_facecolor('#111827')
rf_pred = rf.predict(Xte)
conf = np.zeros((5, 5), dtype=int)
for t, p in zip(yte, rf_pred): conf[t, p] += 1
im = ax.imshow(conf, cmap='YlOrRd', aspect='auto')
for i in range(5):
    for j in range(5):
        ax.text(j, i, str(conf[i,j]), ha='center', va='center',
                color='white' if conf[i,j]>conf.max()/2 else 'black', fontsize=11)
ax.set_xticks(range(5)); ax.set_yticks(range(5))
ax.set_xticklabels(cat_names, color='white'); ax.set_yticklabels(cat_names, color='white')
ax.set_xlabel('Predicted', color='white'); ax.set_ylabel('True', color='white')
ax.set_title(f'RF confusion matrix (acc={rf_acc:.1%})', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Results:")
print(f"  Single tree:   {tree_acc:.1%} test accuracy")
print(f"  Random forest: {rf_acc:.1%} test accuracy (+{100*(rf_acc-tree_acc):.1f}%)")
print(f"  OOB estimate:  {rf.oob_accuracy:.1%}")
print(f"  Top features:  {feat_names[np.argmax(rf_imp)]}, {feat_names[np.argsort(rf_imp)[-2]]}")`,
      challenge: 'Implement a "confidence" score for each prediction: the fraction of trees that voted for the winning class. Species where only 40% of trees agree are uncertain — flag them for manual review. Which IUCN categories have the lowest confidence?',
      successHint: 'Random forests are the workhorse of applied ecology. They handle messy, real-world data with missing values and nonlinear relationships. More importantly, they quantify uncertainty through tree disagreement.',
    },
    {
      title: 'Model evaluation — precision, recall, and conservation trade-offs',
      concept: `Accuracy alone is misleading for conservation. Consider: if 80% of species are Least Concern, a model that always predicts "LC" gets 80% accuracy but misses every threatened species.

**Per-class metrics** reveal the full picture:

- **Precision** = TP / (TP + FP): Of species we predicted as Endangered, what fraction actually are? High precision means few false alarms.
- **Recall (sensitivity)** = TP / (TP + FN): Of species that actually ARE Endangered, what fraction did we catch? High recall means few missed cases.
- **F1-score** = 2 × (precision × recall) / (precision + recall): harmonic mean of precision and recall.

In conservation, the **costs of errors are asymmetric**:
- **False positive** (predict EN, actually LC): wastes conservation resources on a safe species. Cost: money.
- **False negative** (predict LC, actually EN): a threatened species goes unprotected. Cost: extinction.

Since false negatives are catastrophic and irreversible, conservation classifiers should prioritize **recall** over precision for threatened categories. It is better to investigate 10 species flagged as Endangered (even if 3 are false alarms) than to miss 3 truly Endangered species.

This trade-off is controlled by adjusting the **decision threshold** — lowering it catches more true positives at the cost of more false positives.`,
      analogy: 'Think of airport security screening. High recall means catching every actual threat (even if it means pulling aside many innocent travelers for secondary screening). High precision means never bothering innocent travelers (but potentially missing threats). For airport security and species conservation alike, recall matters more — the cost of missing a real threat is catastrophic.',
      storyConnection: 'If the threat classifier misses the red panda — predicting it as Least Concern when it is actually Endangered — the species could lose critical conservation funding and protection. A false negative for the red panda means one step closer to extinction. The classifier must be calibrated to never make this mistake, even at the cost of occasionally over-classifying safe species.',
      checkQuestion: 'A classifier has 95% precision and 60% recall for Critically Endangered species. Is this acceptable for conservation screening?',
      checkAnswer: 'No. 60% recall means 40% of CR species are missed — classified as less threatened and potentially denied urgent protection. For a conservation screening tool, you need high recall (>90%) for the most threatened categories, even if precision drops. You can always do a detailed follow-up assessment on the flagged species. You cannot bring back an extinct species you failed to flag.',
      codeIntro: 'Compute comprehensive evaluation metrics and analyze the precision-recall trade-off for conservation decision-making.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Quick dataset + RF (reusing compact code)
n = 500
log_pop = np.clip(np.random.normal(8, 3, n), 1, 12)
pop = 10**log_pop
hl = np.clip(np.random.exponential(1.5, n), 0, 15)
hp = np.random.beta(2, 3, n) * 100
gy = np.clip(1 + np.random.exponential(3, n), 0.5, 30)
frag = np.clip(np.random.beta(2, 5, n) + 0.3*hl/15, 0, 1)
decline = np.clip(hl * gy * 3 * (1 + hp/200), 0, 99)
y = np.zeros(n, dtype=int)
y[decline>=20]=1; y[decline>=30]=2; y[decline>=50]=3; y[decline>=80]=4
y[pop<2500]=np.maximum(y[pop<2500],3); y[pop<250]=4

X = np.column_stack([log_pop, np.clip(0.6*log_pop+np.random.normal(2,1.5,n),0,8), hl, hp, gy, frag])
cat_names = ['LC', 'NT', 'VU', 'EN', 'CR']
cat_colors = ['#3b82f6', '#22c55e', '#eab308', '#f59e0b', '#ef4444']

idx = np.random.permutation(n)
sp = int(0.8*n)
Xtr, Xte, ytr, yte = X[idx[:sp]], X[idx[sp:]], y[idx[:sp]], y[idx[sp:]]

# Simple RF prediction (using vote proportions)
class SimpleRF:
    def __init__(self, n_trees=80, max_d=5):
        self.trees = []
        self.n_trees = n_trees
        self.max_d = max_d

    def fit(self, X, y):
        for _ in range(self.n_trees):
            boot = np.random.choice(len(y), len(y), replace=True)
            from collections import Counter
            tree_data = {'X': X[boot], 'y': y[boot]}
            self.trees.append(tree_data)

    def predict_proba(self, X):
        """Return class vote proportions for each sample."""
        votes = np.zeros((len(X), 5))
        for td in self.trees:
            # Nearest centroid per tree (simplified)
            centroids = {}
            for c in range(5):
                mask = td['y'] == c
                if mask.sum() > 0:
                    centroids[c] = td['X'][mask].mean(axis=0)
            for i, x in enumerate(X):
                best_c, best_d = 0, float('inf')
                for c, cent in centroids.items():
                    d = np.linalg.norm(x - cent)
                    if d < best_d:
                        best_d, best_c = d, c
                votes[i, best_c] += 1
        return votes / self.n_trees

    def predict(self, X):
        return np.argmax(self.predict_proba(X), axis=1)

rf = SimpleRF(n_trees=80)
rf.fit(Xtr, ytr)
y_pred = rf.predict(Xte)
y_proba = rf.predict_proba(Xte)

# Compute metrics
def compute_metrics(y_true, y_pred, n_classes=5):
    metrics = {}
    for c in range(n_classes):
        tp = np.sum((y_pred == c) & (y_true == c))
        fp = np.sum((y_pred == c) & (y_true != c))
        fn = np.sum((y_pred != c) & (y_true == c))
        tn = np.sum((y_pred != c) & (y_true != c))
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        metrics[c] = {'precision': precision, 'recall': recall, 'f1': f1,
                      'tp': tp, 'fp': fp, 'fn': fn, 'support': tp + fn}
    return metrics

metrics = compute_metrics(yte, y_pred)

# Binary: threatened (VU/EN/CR) vs not threatened (LC/NT)
y_binary_true = (yte >= 2).astype(int)
y_binary_pred = (y_pred >= 2).astype(int)

# Threshold analysis for threatened detection
threat_score = y_proba[:, 2:].sum(axis=1)  # P(VU or EN or CR)
thresholds = np.linspace(0, 1, 100)
precisions, recalls = [], []
for thresh in thresholds:
    pred = (threat_score >= thresh).astype(int)
    tp = np.sum((pred == 1) & (y_binary_true == 1))
    fp = np.sum((pred == 1) & (y_binary_true == 0))
    fn = np.sum((pred == 0) & (y_binary_true == 1))
    prec = tp / (tp + fp) if (tp + fp) > 0 else 1.0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    precisions.append(prec)
    recalls.append(rec)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Per-class metrics
ax = axes[0, 0]
ax.set_facecolor('#111827')
x = np.arange(5)
w = 0.25
precs = [metrics[c]['precision'] for c in range(5)]
recs = [metrics[c]['recall'] for c in range(5)]
f1s = [metrics[c]['f1'] for c in range(5)]
ax.bar(x - w, precs, w, color='#3b82f6', label='Precision', edgecolor='none')
ax.bar(x, recs, w, color='#22c55e', label='Recall', edgecolor='none')
ax.bar(x + w, f1s, w, color='#a855f7', label='F1', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(cat_names, color='white')
ax.set_ylabel('Score', color='white')
ax.set_title('Per-class precision, recall, F1', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.1)

# Precision-recall trade-off
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(recalls, precisions, color='#22c55e', linewidth=2)
ax.scatter([recalls[50]], [precisions[50]], s=100, color='#f59e0b', zorder=5,
           label=f'Default threshold')
# Find 90% recall point
idx_90 = np.argmin(np.abs(np.array(recalls) - 0.9))
ax.scatter([recalls[idx_90]], [precisions[idx_90]], s=100, color='#ef4444', zorder=5,
           label=f'90% recall (prec={precisions[idx_90]:.2f})')
ax.set_xlabel('Recall (sensitivity)', color='white')
ax.set_ylabel('Precision', color='white')
ax.set_title('Precision-recall curve: threatened species', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cost analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
fn_cost = 100  # cost of missing a threatened species (arbitrary units)
fp_cost = 10   # cost of false alarm
total_costs = []
for thresh in thresholds:
    pred = (threat_score >= thresh).astype(int)
    fp = np.sum((pred == 1) & (y_binary_true == 0))
    fn = np.sum((pred == 0) & (y_binary_true == 1))
    total_costs.append(fp * fp_cost + fn * fn_cost)
ax.plot(thresholds, total_costs, color='#ef4444', linewidth=2)
opt_thresh = thresholds[np.argmin(total_costs)]
ax.axvline(opt_thresh, color='#22c55e', linestyle='--',
           label=f'Optimal threshold: {opt_thresh:.2f}')
ax.set_xlabel('Decision threshold', color='white')
ax.set_ylabel('Total cost (FN=100, FP=10)', color='white')
ax.set_title('Cost-sensitive threshold optimization', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Classification report
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
report = "SPECIES THREAT CLASSIFIER REPORT\\n"
report += "=" * 45 + "\\n"
report += f"{'Category':<8} {'Prec':>6} {'Recall':>7} {'F1':>6} {'Support':>8}\\n"
report += "-" * 45 + "\\n"
for c in range(5):
    m = metrics[c]
    report += f"{cat_names[c]:<8} {m['precision']:>6.2f} {m['recall']:>7.2f} {m['f1']:>6.2f} {m['support']:>8}\\n"
report += "-" * 45 + "\\n"
acc = np.mean(y_pred == yte)
report += f"{'Overall':<8} {'':>6} {'':>7} {'':>6} {len(yte):>8}\\n"
report += f"Accuracy: {acc:.1%}\\n\\n"
report += "CONSERVATION RECOMMENDATION:\\n"
report += f"Use threshold {opt_thresh:.2f} for screening\\n"
report += f"This gives {recalls[np.argmin(np.abs(thresholds-opt_thresh))]:.0%} recall\\n"
report += f"for threatened species detection"
ax.text(0.05, 0.95, report, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print("Per-class metrics:")
for c in range(5):
    m = metrics[c]
    print(f"  {cat_names[c]}: prec={m['precision']:.2f} recall={m['recall']:.2f} F1={m['f1']:.2f} (n={m['support']})")
print(f"\\nOptimal threshold (cost-sensitive): {opt_thresh:.2f}")
print(f"Conservation principle: NEVER sacrifice recall for threatened species.")`,
      challenge: 'Change the cost ratio: set FN_cost = 1000 (extinction is permanent) and FP_cost = 1. How does the optimal threshold change? At what point would you classify EVERY species as threatened just to avoid missing any?',
      successHint: 'Understanding the precision-recall trade-off in the context of conservation is perhaps the most important machine learning lesson. The cost of a missed endangered species is permanent and irreversible.',
    },
    {
      title: 'Capstone finale — deploy the classifier on new species',
      concept: `The final stage brings everything together: apply your trained classifier to **unassessed species** and produce a conservation priority report.

In real research, this is called **predictive Red Listing** — using machine learning to screen species that have not yet been formally evaluated by the IUCN. Key studies have applied this approach to:
- 600+ data-deficient mammals (Bland et al., 2015)
- 20,000+ unassessed plant species (Nic Lughadha et al., 2020)
- All 10,000+ reptile species (Bland & Böhm, 2016)

The output is not a final IUCN assessment — it is a **triage tool** that identifies which species most urgently need formal evaluation. Species flagged as likely Endangered or Critically Endangered go to the front of the queue.

For each prediction, we report:
1. **Predicted status** with confidence score
2. **Contributing factors** — which features drove the prediction
3. **Uncertainty flag** — species where the model is unsure
4. **Priority ranking** — ordered by predicted threat level and confidence`,
      analogy: 'This is like an AI-assisted medical screening program for a population. You cannot give every person a full diagnostic workup — there are not enough doctors. Instead, a screening tool identifies the most at-risk individuals who need immediate attention. The species classifier does the same: screen all species, flag the urgent cases, and direct expert attention where it matters most.',
      storyConnection: 'The red panda shares its forest with hundreds of lesser-known species — small mammals, amphibians, insects — most never assessed by the IUCN. This classifier could screen every species in the ecosystem and reveal which ones are silently sliding toward extinction, invisible to conservation efforts focused only on charismatic megafauna.',
      checkQuestion: 'Your classifier flags a species as "likely Critically Endangered" with 55% confidence. Should this species receive conservation attention?',
      checkAnswer: 'Yes. Even 55% confidence that a species is CR warrants investigation. The cost of ignoring a true CR is extinction; the cost of investigating a false alarm is time and money. At 55%, there is still a 45% chance it is NOT CR — so you do not divert maximum resources immediately, but you do prioritize it for formal assessment. The confidence score determines the urgency and resource level, not a binary act/ignore decision.',
      codeIntro: 'Apply the classifier to unassessed species, generate predictions with confidence scores, and produce a conservation priority report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Training data (compact)
n = 500
log_pop = np.clip(np.random.normal(8, 3, n), 1, 12)
pop = 10**log_pop
hl = np.clip(np.random.exponential(1.5, n), 0, 15)
hp = np.random.beta(2, 3, n) * 100
gy = np.clip(1 + np.random.exponential(3, n), 0.5, 30)
frag = np.clip(np.random.beta(2, 5, n) + 0.3*hl/15, 0, 1)
decline = np.clip(hl * gy * 3 * (1 + hp/200), 0, 99)
y = np.zeros(n, dtype=int)
y[decline>=20]=1; y[decline>=30]=2; y[decline>=50]=3; y[decline>=80]=4
y[pop<2500]=np.maximum(y[pop<2500],3); y[pop<250]=4
X = np.column_stack([log_pop, np.clip(0.6*log_pop+np.random.normal(2,1.5,n),0,8), hl, hp, gy, frag])
feat_names = ['log_pop', 'log_range', 'hab_loss', 'human_press', 'gen_years', 'frag']
cat_names = ['LC', 'NT', 'VU', 'EN', 'CR']
cat_colors = ['#3b82f6', '#22c55e', '#eab308', '#f59e0b', '#ef4444']

# Train ensemble of nearest-centroid classifiers (simple RF proxy)
class EnsembleClassifier:
    def __init__(self, n_models=100):
        self.models = []
        self.n_models = n_models

    def fit(self, X, y):
        for _ in range(self.n_models):
            boot = np.random.choice(len(y), len(y), replace=True)
            feat_sub = np.random.choice(X.shape[1], max(2, X.shape[1]//2), replace=False)
            centroids = {}
            for c in np.unique(y):
                mask = y[boot] == c
                if mask.sum() > 0:
                    centroids[c] = X[boot][:, feat_sub][mask].mean(axis=0)
            self.models.append((feat_sub, centroids))

    def predict_proba(self, X):
        votes = np.zeros((len(X), 5))
        for feat_sub, centroids in self.models:
            X_sub = X[:, feat_sub]
            for i, x in enumerate(X_sub):
                best_c, best_d = 0, float('inf')
                for c, cent in centroids.items():
                    d = np.linalg.norm(x - cent)
                    if d < best_d:
                        best_d, best_c = d, c
                votes[i, best_c] += 1
        return votes / self.n_models

    def predict(self, X):
        return np.argmax(self.predict_proba(X), axis=1)

clf = EnsembleClassifier(n_models=100)
clf.fit(X, y)

# ---- Generate unassessed species ----
unassessed_names = [
    'Himalayan flying squirrel', 'Mishmi takin', 'Assam roofed turtle',
    'Namdapha flying squirrel', 'Leaf-nosed bat sp.', 'Golden langur',
    'Pygmy hog', 'Hispid hare', 'Hoolock gibbon', 'Capped langur',
    'Marbled cat', 'Binturong', 'Slow loris', 'Pangolin sp.',
    'Mountain weasel', 'Fishing cat', 'Dhole', 'Gaur',
    'Wild water buffalo', 'Swamp deer',
]

# Realistic attributes for unassessed species
np.random.seed(123)
n_un = len(unassessed_names)
un_pop = 10 ** np.clip(np.random.normal(5, 2.5, n_un), 1.5, 10)
un_rng = 10 ** np.clip(np.random.normal(3.5, 1.5, n_un), 1, 7)
un_hl = np.clip(np.random.exponential(2.5, n_un), 0.5, 12)
un_hp = np.random.beta(3, 2, n_un) * 100
un_gy = np.clip(2 + np.random.exponential(4, n_un), 1, 20)
un_frag = np.clip(np.random.beta(3, 3, n_un) + 0.2*un_hl/10, 0, 1)

X_unassessed = np.column_stack([
    np.log10(un_pop), np.log10(un_rng), un_hl, un_hp, un_gy, un_frag
])

# Predict
proba = clf.predict_proba(X_unassessed)
predicted = np.argmax(proba, axis=1)
confidence = np.max(proba, axis=1)

# Threat score (weighted sum of threatened probabilities)
threat_score = proba[:, 2] * 1 + proba[:, 3] * 2 + proba[:, 4] * 3
priority_order = np.argsort(-threat_score)

fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')

# Priority ranking
ax = axes[0, 0]
ax.set_facecolor('#111827')
top_20 = priority_order[:20]
names_sorted = [unassessed_names[i] for i in top_20]
scores_sorted = threat_score[top_20]
pred_sorted = predicted[top_20]
colors_sorted = [cat_colors[p] for p in pred_sorted]
bars = ax.barh(range(len(names_sorted)), scores_sorted, color=colors_sorted,
               edgecolor='none', height=0.7)
ax.set_yticks(range(len(names_sorted)))
ax.set_yticklabels(names_sorted, color='white', fontsize=8)
ax.set_xlabel('Threat score', color='white')
ax.set_title('Conservation priority ranking', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.invert_yaxis()
for i, (bar, p) in enumerate(zip(bars, pred_sorted)):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            cat_names[p], va='center', color='white', fontsize=8, fontweight='bold')

# Prediction confidence
ax = axes[0, 1]
ax.set_facecolor('#111827')
for c in range(5):
    mask = predicted == c
    if mask.any():
        ax.scatter(threat_score[mask], confidence[mask], s=60,
                   color=cat_colors[c], label=cat_names[c], alpha=0.7, edgecolors='white', linewidth=0.5)
ax.axhline(0.5, color='gray', linestyle='--', alpha=0.5, label='Low confidence')
ax.set_xlabel('Threat score', color='white')
ax.set_ylabel('Prediction confidence', color='white')
ax.set_title('Confidence vs threat level', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Class probabilities for top 5 priority species
ax = axes[1, 0]
ax.set_facecolor('#111827')
top5 = priority_order[:5]
x = np.arange(5)
width = 0.15
for i, sp_idx in enumerate(top5):
    bottom = 0
    for c in range(5):
        ax.bar(i, proba[sp_idx, c], bottom=bottom, width=0.6,
               color=cat_colors[c], edgecolor='none')
        if proba[sp_idx, c] > 0.1:
            ax.text(i, bottom + proba[sp_idx, c]/2, f'{proba[sp_idx,c]:.0%}',
                    ha='center', va='center', color='white', fontsize=7)
        bottom += proba[sp_idx, c]
ax.set_xticks(range(5))
ax.set_xticklabels([unassessed_names[i][:15] for i in top5], color='white',
                    fontsize=8, rotation=15, ha='right')
ax.set_ylabel('Class probability', color='white')
ax.set_title('Top 5 priority: class probabilities', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Summary report
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
report = "PREDICTIVE RED LIST SCREENING REPORT\\n"
report += "=" * 50 + "\\n"
report += f"Species screened: {n_un}\\n"
report += f"Model: Ensemble classifier (100 models)\\n\\n"
report += "PREDICTED STATUS DISTRIBUTION:\\n"
for c in range(5):
    n_c = np.sum(predicted == c)
    report += f"  {cat_names[c]}: {n_c} species\\n"
report += f"\\nHIGH-PRIORITY SPECIES (predicted EN/CR):\\n"
for i in priority_order:
    if predicted[i] >= 3:
        report += f"  {unassessed_names[i]}: {cat_names[predicted[i]]} "
        report += f"({confidence[i]:.0%} conf)\\n"
report += f"\\nUNCERTAIN (confidence < 50%):\\n"
uncertain = np.where(confidence < 0.5)[0]
for i in uncertain[:5]:
    report += f"  {unassessed_names[i]}: needs expert review\\n"
report += f"\\nRECOMMENDATION: Formal IUCN assessment\\n"
report += f"for {np.sum(predicted >= 3)} high-priority species"

ax.text(0.02, 0.98, report, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print("CAPSTONE COMPLETE: Species Threat Classifier")
print("=" * 50)
print(f"Screened {n_un} unassessed species")
print(f"Predicted threatened (VU+EN+CR): {np.sum(predicted >= 2)}")
print(f"High priority (EN+CR): {np.sum(predicted >= 3)}")
print(f"Low confidence (need review): {np.sum(confidence < 0.5)}")
print()
print("This tool enables conservation triage at scale —")
print("screening thousands of species to identify those")
print("most likely to need urgent protection.")`,
      challenge: 'Add the red panda to the unassessed list with its real attributes (population=10000, range=15000 km², habitat_loss=3%/yr, human_pressure=45, generation=6yr, fragmentation=0.55). Does the classifier correctly predict Endangered? If not, which features are misleading it?',
      successHint: 'You have built a complete species threat classification pipeline — from data to model to deployment. This exact approach is used in real conservation research, screening data-deficient species and prioritizing IUCN assessments. The red panda would approve.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Species Threat Classifier
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (conservation biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete ML threat classifier in Python. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
