import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import HanumanDichotomousKeyDiagram from '../diagrams/HanumanDichotomousKeyDiagram';
import HanumanMedicineDiagram from '../diagrams/HanumanMedicineDiagram';
import HanumanAltitudeZonesDiagram from '../diagrams/HanumanAltitudeZonesDiagram';
import HanumanTectonicDiagram from '../diagrams/HanumanTectonicDiagram';
import ActivityHerbIdentifyDiagram from '../diagrams/ActivityHerbIdentifyDiagram';
import DecisionTreeDiagram from '../diagrams/DecisionTreeDiagram';

export default function HanumanMountainLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Feature engineering for plant images — from pixels to classification',
      concept: `Real plant identification apps (iNaturalist, PlantNet) use **image classification** — feeding a photo of a leaf or flower to a neural network that predicts the species.

But before deep learning, botanists used **hand-crafted features** extracted from images:
- **Shape descriptors**: aspect ratio, perimeter-to-area ratio, number of lobes
- **Color histograms**: distribution of green, brown, yellow in the leaf
- **Texture features**: smoothness, roughness, vein density
- **Edge features**: serrated, smooth, lobed

These features turn an image into a **feature vector** — a list of numbers that a classifier can work with. The process: image → feature extraction → feature vector → classification.

The code below simulates extracting shape features from leaf measurements and using them for classification.`,
      analogy: 'Feature engineering is like a witness describing a suspect to a sketch artist. Instead of showing the photo (raw pixels), you describe key features: "tall, brown hair, round face, scar on left cheek." Each feature is a number, and the combination uniquely identifies the person. Plant features work the same way.',
      storyConnection: 'An app that could identify the Sanjeevani herb from a photo would extract features like leaf shape, flower color, and growth pattern, convert them to numbers, and match against a database of known species. This is the modern version of Hanuman\'s search — knowledge replaces strength.',
      checkQuestion: 'Why might color alone be insufficient to identify a plant species?',
      checkAnswer: 'Many unrelated species have similar leaf colors (green varies little). Color also changes with season, age, and health. Shape and texture are more reliable because they are genetically determined and stable. The best classifiers use ALL features together — color, shape, texture, and context (altitude, habitat).',
      codeIntro: 'Extract shape features from simulated leaf measurements and classify species.',
      code: `import numpy as np

# Simulated leaf measurements for 6 species
# Features: [length, width, aspect_ratio, perimeter, n_lobes, is_serrate]
species_data = {
    "Tulsi":      {"samples": [[4.2, 2.5, 1.68, 14, 0, 0],
                                [3.8, 2.3, 1.65, 13, 0, 0],
                                [4.5, 2.7, 1.67, 15, 0, 0]]},
    "Neem":       {"samples": [[6.0, 1.5, 4.00, 18, 7, 1],
                                [5.5, 1.3, 4.23, 17, 7, 1],
                                [6.3, 1.6, 3.94, 19, 8, 1]]},
    "Aconite":    {"samples": [[5.0, 3.0, 1.67, 20, 5, 1],
                                [4.8, 2.8, 1.71, 19, 5, 1],
                                [5.2, 3.2, 1.63, 21, 5, 1]]},
    "Pine":       {"samples": [[8.0, 0.1, 80.0, 16, 0, 0],
                                [7.5, 0.1, 75.0, 15, 0, 0],
                                [8.5, 0.12, 70.8, 17, 0, 0]]},
}

# Simple nearest-centroid classifier
centroids = {}
for sp, data in species_data.items():
    centroids[sp] = np.mean(data["samples"], axis=0)
    print(f"{sp:10s} centroid: {centroids[sp][:3]}")

# Classify a new sample
test = np.array([5.1, 2.9, 1.76, 20, 5, 1])
print(f"\\\nTest sample: length={test[0]}, width={test[1]}, lobes={test[4]}")

distances = {}
for sp, centroid in centroids.items():
    d = np.linalg.norm(test - centroid)
    distances[sp] = d

predicted = min(distances, key=distances.get)
print(f"\\\nPredicted species: {predicted}")
print("Distances:", {k: f"{v:.2f}" for k, v in distances.items()})`,
      challenge: 'Add Rhododendron (large broad leaves, ~12cm x 5cm, no lobes, smooth edges) and Juniper (tiny needles, ~1.5cm x 0.2cm). Run the classifier on a test sample [10, 4.5, 2.22, 30, 0, 0]. What does it predict?',
      successHint: 'You built a nearest-centroid classifier — the simplest form of machine learning for classification. Real plant ID apps use the same principle with thousands of features extracted from photos by convolutional neural networks.',
    },
    {
      title: 'K-Nearest Neighbours — improving plant classification',
      concept: `The centroid classifier has a weakness: it only uses the average of each species. Outliers and within-species variation are ignored.

**K-Nearest Neighbours (KNN)** improves on this by looking at the K closest training samples to the test point and taking a **majority vote**. If K=5 and three of the five nearest neighbours are "Aconite," the prediction is Aconite.

KNN advantages:
- No training phase (just store the data)
- Handles complex decision boundaries
- Easy to understand and implement

KNN disadvantages:
- Slow for large datasets (must compute distance to every sample)
- Sensitive to irrelevant features (need feature normalisation)
- K must be chosen carefully (too small = noisy, too large = blurry)

This is the same KNN you would use in a real plant identification system.`,
      analogy: 'KNN is like asking your 5 nearest neighbours what species a mystery plant is. If 3 say "Tulsi" and 2 say "Neem," you go with the majority: Tulsi. More neighbours means more opinions, reducing the chance of a wrong answer from one confused neighbour.',
      storyConnection: 'If Hanuman had a KNN classifier trained on Himalayan plant data, he could measure features of each plant on the mountain, find the K most similar plants in the database, and identify the Sanjeevani by majority vote. The algorithm searches the data so he does not have to search the mountain.',
      checkQuestion: 'If K=1 and the nearest neighbour is mislabeled in the database, what happens?',
      checkAnswer: 'The prediction is wrong. With K=1, a single noisy data point can mislead you. With K=5, one bad neighbour is outvoted by four good ones. This is why K>1 is generally more robust. But K too large (e.g., K=100) would average over too many species and lose specificity.',
      codeIntro: 'Implement KNN for plant classification and visualise the decision boundary.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate sample data for 3 species (2D: altitude, leaf_width)
np.random.seed(42)
n = 20

species = {
    'Tulsi': np.random.normal([500, 2.5], [200, 0.5], (n, 2)),
    'Pine': np.random.normal([3000, 0.15], [400, 0.05], (n, 2)),
    'Aconite': np.random.normal([4000, 3.0], [300, 0.6], (n, 2)),
}

colors = {'Tulsi': '#2ecc71', 'Pine': '#3498db', 'Aconite': '#9b59b6'}

# KNN implementation
def knn_predict(test_point, data, k=5):
    all_dists = []
    for sp, points in data.items():
        for pt in points:
            d = np.linalg.norm(test_point - pt)
            all_dists.append((d, sp))
    all_dists.sort()
    votes = [sp for _, sp in all_dists[:k]]
    from collections import Counter
    return Counter(votes).most_common(1)[0][0]

fig, ax = plt.subplots(figsize=(8, 6))
for sp, points in species.items():
    ax.scatter(points[:, 0], points[:, 1], c=colors[sp],
               label=sp, s=40, alpha=0.7, edgecolor='white')

# Classify test points on a grid
x_range = np.linspace(-200, 5500, 40)
y_range = np.linspace(-1, 5, 40)
for x in x_range:
    for y in y_range:
        pred = knn_predict(np.array([x, y]), species, k=5)
        ax.plot(x, y, '.', color=colors[pred], alpha=0.08, markersize=8)

ax.set_xlabel('Altitude (m)')
ax.set_ylabel('Leaf Width (cm)')
ax.set_title('KNN Plant Classification (K=5)')
ax.legend(fontsize=10)
ax.grid(alpha=0.15)
plt.show()

test = np.array([3500, 2.0])
pred = knn_predict(test, species, k=5)
print(f"Test: altitude=3500m, leaf_width=2.0cm")
print(f"KNN prediction (K=5): {pred}")`,
      challenge: 'Try K=1 and K=15. Plot all three decision boundaries. Which value of K gives the smoothest boundary? Which gives the most accurate one?',
      successHint: 'KNN is the workhorse of plant identification apps. The real versions use image features instead of manual measurements, but the algorithm is identical — find the nearest neighbours and vote.',
    },
    {
      title: 'Confusion matrix — measuring classifier accuracy',
      concept: `How good is your plant classifier? A **confusion matrix** shows, for each species, how many samples were correctly classified and how many were confused with other species.

Rows = actual species. Columns = predicted species. The diagonal shows correct predictions. Off-diagonal entries show errors.

From the confusion matrix, you compute:
- **Accuracy**: (total correct) / (total samples)
- **Precision**: for species X, what fraction of "predicted X" are actually X?
- **Recall**: for species X, what fraction of actual X were correctly identified?

A good classifier has high values on the diagonal and near-zero everywhere else. If Aconite is frequently confused with Tulsi, that tells you the features distinguishing them are weak — you need better features.`,
      analogy: 'A confusion matrix is like a teacher grading multiple-choice answers. Each row is the correct answer (A, B, C, D). Each column is what the student chose. The diagonal shows correct answers; off-diagonal shows specific mistakes. "Students often choose B when the answer is C" tells the teacher exactly where confusion lies.',
      storyConnection: 'Misidentifying a plant can be lethal — Aconite looks superficially like some harmless herbs but is highly toxic. A confusion matrix reveals exactly which species are being confused, so you can add distinguishing features (like altitude or flower structure) to eliminate dangerous errors.',
      checkQuestion: 'If a classifier has 95% accuracy overall but 0% recall for Aconite (it never correctly identifies Aconite), is it a good classifier?',
      checkAnswer: 'No. High overall accuracy can hide poor performance on rare or important classes. If Aconite is 5% of the data, ignoring it costs only 5% accuracy but is catastrophically dangerous. You must check per-class recall, especially for critical species. This is why accuracy alone is misleading.',
      codeIntro: 'Build a confusion matrix for the KNN plant classifier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated confusion matrix for 4 species
species_names = ['Tulsi', 'Neem', 'Aconite', 'Pine']
# Rows = actual, Cols = predicted
confusion = np.array([
    [18, 1, 1, 0],   # Actual Tulsi
    [2, 16, 0, 2],   # Actual Neem
    [1, 0, 17, 2],   # Actual Aconite
    [0, 1, 1, 18],   # Actual Pine
])

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(confusion, cmap='YlOrRd')

for i in range(4):
    for j in range(4):
        color = 'white' if confusion[i, j] > 10 else 'black'
        ax.text(j, i, str(confusion[i, j]), ha='center',
                va='center', fontsize=14, fontweight='bold', color=color)

ax.set_xticks(range(4)); ax.set_yticks(range(4))
ax.set_xticklabels(species_names, fontsize=10)
ax.set_yticklabels(species_names, fontsize=10)
ax.set_xlabel('Predicted')
ax.set_ylabel('Actual')
ax.set_title('Confusion Matrix: Plant Classifier')
plt.colorbar(im, ax=ax, shrink=0.8)
plt.tight_layout()
plt.show()

# Compute metrics
total = confusion.sum()
correct = np.trace(confusion)
accuracy = correct / total
print(f"Overall accuracy: {accuracy:.1%}")
print(f"\\\nPer-species metrics:")
for i, name in enumerate(species_names):
    tp = confusion[i, i]
    precision = tp / confusion[:, i].sum()
    recall = tp / confusion[i, :].sum()
    print(f"  {name}: precision={precision:.0%}, recall={recall:.0%}")`,
      challenge: 'Make Aconite harder to identify: change its row to [3, 2, 12, 3]. Recompute metrics. Which species is it most confused with? What feature could you add to improve Aconite classification?',
      successHint: 'The confusion matrix is the standard evaluation tool for classifiers in machine learning, medicine, and security. It tells you not just how often you are wrong, but exactly how you are wrong — which is far more useful for fixing the problem.',
    },
    {
      title: 'Molecular docking — simulating drug-target interaction',
      concept: `You have identified a promising plant compound. But does it fit the target enzyme? **Molecular docking** is a computational technique that predicts how well a drug molecule fits into a protein's active site.

The algorithm:
1. Load the 3D structure of the target protein (from databases like PDB)
2. Load the 3D structure of the drug molecule
3. Try thousands of orientations and positions
4. For each position, calculate a **binding score** based on shape complementarity, hydrogen bonds, and electrostatic attraction
5. The pose with the best (lowest) score is the predicted binding mode

A binding score of -8 to -12 kcal/mol indicates strong binding. Below -6 is weak.

The code below simulates a simplified docking search — finding the optimal position of a "molecule" in a "binding pocket."`,
      analogy: 'Molecular docking is like trying a key in a lock from every possible angle. You jiggle it left, right, tilted, reversed — testing thousands of positions. A computer does this for a drug molecule in an enzyme pocket, scoring each position by how snugly it fits. The best-fitting position is the predicted binding mode.',
      storyConnection: 'If we knew the molecular structure of the Sanjeevani compound and its target enzyme, we could simulate their interaction computationally — testing whether the drug fits the target without needing the physical plant. This is how modern drug discovery works: compute first, synthesise later.',
      checkQuestion: 'Why do we test thousands of orientations instead of just placing the molecule in the most obvious position?',
      checkAnswer: 'Proteins have complex 3D pockets with grooves, charges, and flexible regions. The "obvious" position may not be the best one — a slightly rotated orientation might form additional hydrogen bonds or avoid steric clashes. Exhaustive search finds the global optimum, not just a local one.',
      codeIntro: 'Simulate molecular docking — find the best position for a drug in a binding pocket.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate a 2D binding pocket (energy landscape)
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)

# Energy landscape: lower = better binding
# Main pocket at (1, -1), secondary at (-2, 2)
E = (5 * np.exp(-((X-1)**2 + (Y+1)**2) / 1.5)
   + 3 * np.exp(-((X+2)**2 + (Y-2)**2) / 2.0))
E = -E + 2  # Invert so binding is negative

fig, ax = plt.subplots(figsize=(7, 6))
contour = ax.contourf(X, Y, E, levels=20, cmap='RdYlGn')
plt.colorbar(contour, ax=ax, label='Binding Energy (kcal/mol)')

# Find best position (lowest energy)
min_idx = np.unravel_index(E.argmin(), E.shape)
best_x, best_y = X[min_idx], Y[min_idx]
best_e = E[min_idx]

ax.plot(best_x, best_y, 'r*', markersize=20, label=f'Best pose')
ax.annotate(f'E = {best_e:.1f} kcal/mol',
            (best_x, best_y), xytext=(15, 15),
            textcoords='offset points', fontsize=10,
            color='white', arrowprops=dict(arrowstyle='->',
            color='white'))

# Mark secondary pocket
ax.plot(-2, 2, 'wo', markersize=10, markerfacecolor='none',
        linewidth=2, label='Secondary site')

ax.set_xlabel('X position (Angstroms)')
ax.set_ylabel('Y position (Angstroms)')
ax.set_title('Molecular Docking: Energy Landscape')
ax.legend(fontsize=9, loc='lower right')
plt.show()

print(f"Best binding position: ({best_x:.1f}, {best_y:.1f})")
print(f"Binding energy: {best_e:.1f} kcal/mol")
print(f"Strong binding is < -8 kcal/mol")`,
      challenge: 'Add a random search: generate 500 random (x, y) positions, evaluate their energy, and find the best. How many random trials does it take to find a position within 0.5 kcal/mol of the true optimum?',
      successHint: 'You just simulated the core algorithm of computational drug design. Real docking programs (AutoDock, Glide) do this in 3D with real molecular structures, testing millions of poses to find drugs that fit their targets.',
    },
    {
      title: 'Building a plant ID pipeline — from image to species',
      concept: `Let's bring everything together into a complete plant identification pipeline:

1. **Input**: leaf measurements (simulating image feature extraction)
2. **Preprocessing**: normalise features to 0-1 range
3. **Classification**: KNN with K=5
4. **Validation**: confusion matrix and accuracy
5. **Output**: species name + medicinal properties + conservation status

This is the architecture of a real plant ID app. The only difference is that real apps extract features from photos using a convolutional neural network (CNN) instead of manual measurements.

The code below builds the complete pipeline — a mini PlantNet.`,
      analogy: 'The pipeline is like an assembly line in a factory. Raw materials (leaf photos) enter at one end. Station 1 extracts features. Station 2 normalises them. Station 3 classifies. Station 4 checks quality. At the end, a labeled product (species ID) emerges. Each station does one job well.',
      storyConnection: 'This pipeline is the modern Sanjeevani search. Instead of Hanuman flying to the Himalayas and lifting a mountain, you photograph an unknown plant, the pipeline identifies it in seconds, and tells you its medicinal properties, dosage, and conservation status. Knowledge is the real superpower.',
      checkQuestion: 'Why is feature normalisation important before running KNN?',
      checkAnswer: 'Without normalisation, features with large ranges (altitude: 0-5000) dominate the distance calculation, making small-range features (leaf width: 0-5) nearly invisible. Normalising to 0-1 ensures every feature contributes equally. Otherwise KNN would classify mostly by altitude, ignoring useful morphological data.',
      codeIntro: 'Build a complete plant identification pipeline from input to species output.',
      code: `import numpy as np
from collections import Counter

# === PLANT DATABASE ===
db = {
    "Tulsi":    {"feats": [[4.2,2.5,0,0,500], [3.8,2.3,0,0,600],
                            [4.5,2.7,0,0,450]],
                 "use": "Anti-inflammatory", "status": "Common"},
    "Neem":     {"feats": [[6.0,1.5,1,1,300], [5.5,1.3,1,1,250],
                            [6.3,1.6,1,1,350]],
                 "use": "Antibacterial", "status": "Common"},
    "Aconite":  {"feats": [[5.0,3.0,0,1,4000], [4.8,2.8,0,1,4200],
                            [5.2,3.2,0,1,3800]],
                 "use": "Pain (TOXIC)", "status": "Vulnerable"},
    "Yew":      {"feats": [[2.0,0.3,0,0,3000], [1.8,0.25,0,0,3200],
                            [2.2,0.35,0,0,2800]],
                 "use": "Anti-cancer (taxol)", "status": "Endangered"},
}

# === PREPROCESSING: normalise features ===
all_feats = []
all_labels = []
for sp, data in db.items():
    for f in data["feats"]:
        all_feats.append(f)
        all_labels.append(sp)

X = np.array(all_feats, dtype=float)
mins = X.min(axis=0)
maxs = X.max(axis=0)
X_norm = (X - mins) / (maxs - mins + 1e-10)

# === KNN CLASSIFIER ===
def classify(sample, k=3):
    sample_norm = (np.array(sample) - mins) / (maxs - mins + 1e-10)
    dists = np.linalg.norm(X_norm - sample_norm, axis=1)
    idx = np.argsort(dists)[:k]
    votes = [all_labels[i] for i in idx]
    return Counter(votes).most_common(1)[0][0]

# === TEST ===
test_samples = [
    [4.0, 2.4, 0, 0, 550],   # Should be Tulsi
    [5.8, 1.4, 1, 1, 280],   # Should be Neem
    [4.9, 2.9, 0, 1, 4100],  # Should be Aconite
    [2.1, 0.3, 0, 0, 3100],  # Should be Yew
]

print("=== Plant ID Pipeline Results ===\\\n")
for sample in test_samples:
    pred = classify(sample, k=3)
    info = db[pred]
    print(f"Input: len={sample[0]}, width={sample[1]}, alt={sample[4]}m")
    print(f"  Species: {pred}")
    print(f"  Medicinal use: {info['use']}")
    print(f"  Conservation: {info['status']}\\\n")`,
      challenge: 'Add a "confidence score" — the fraction of K neighbours that agree on the prediction. A confidence of 3/3 = 100% is strong; 2/3 = 67% suggests the plant is borderline between species. Test with a sample at [4.9, 1.5, 0, 1, 2000] — is the classifier confident?',
      successHint: 'You have built a complete plant identification system from scratch — database, preprocessing, classification, and output. This is the capstone of the Hanuman Mountain lesson: knowledge, structured as code, replaces brute force. Hanuman lifted a mountain; your algorithm searches it in milliseconds.',
    },
    {
      title: 'Capstone — the Hanuman problem solved with science',
      concept: `Let's revisit the original story through the lens of everything you have learned:

**The problem**: Lakshmana is injured. The Sanjeevani herb, growing on a specific Himalayan peak, is the cure. Hanuman cannot identify the herb, so he lifts the entire mountain.

**The scientific solution**:
1. **Geology** (Levels 1-2): The herb grows in the Himalayas because tectonic forces created extreme altitude environments
2. **Botany** (Levels 1-2): Altitude zones restrict the herb to a narrow band; dichotomous keys and databases can identify it
3. **Pharmacology** (Level 3): The herb's healing power comes from secondary metabolites produced under altitude stress; dose-response curves determine safe usage
4. **Technology** (Level 4): Image classification, KNN, and molecular docking can find and validate the herb computationally

The capstone code combines all these into a single simulation: given an altitude and leaf measurements, identify the herb and predict its medicinal activity.`,
      analogy: 'Science is Hanuman\'s power expressed through knowledge. He used physical strength to lift a mountain. A scientist uses geology to know WHERE to look, botany to know WHAT to look for, chemistry to know WHY it works, and computation to do it all without needing to visit the mountain at all.',
      storyConnection: 'The story of Hanuman lifting the mountain is not just about strength — it is about the desperate need for knowledge. Hanuman had the power to fly to the Himalayas but not the knowledge to identify one herb among thousands. Every science you have learned in this lesson fills that gap.',
      checkQuestion: 'If you could add one more technology to the Sanjeevani search pipeline, what would it be and why?',
      checkAnswer: 'DNA barcoding — sequencing a short DNA region from the plant that uniquely identifies the species, even from a fragment. It works like a product barcode. Combined with image classification and chemical analysis, it would provide triple verification: the plant looks right, its DNA matches, and it produces the expected compound.',
      codeIntro: 'The Sanjeevani Search — combine geology, botany, pharmacology, and ML in one pipeline.',
      code: `import numpy as np

# === THE COMPLETE SANJEEVANI SEARCH PIPELINE ===

# Step 1: Geological filter — altitude zone
def geological_filter(target_alt):
    if 3500 <= target_alt <= 5500:
        return "Alpine/Subalpine zone — medicinal herbs likely"
    return "Outside medicinal herb altitude range"

# Step 2: Botanical classifier (KNN)
herb_db = {
    "Sanjeevani": [4500, 3.5, 0, 1],
    "Aconite":    [4000, 3.0, 0, 1],
    "Juniper":    [3500, 0.2, 0, 0],
    "Alpine Grass": [4800, 0.5, 0, 0],
}

def identify_herb(sample, k=1):
    dists = {}
    for name, feats in herb_db.items():
        d = np.linalg.norm(np.array(sample) - np.array(feats))
        dists[name] = d
    return min(dists, key=dists.get)

# Step 3: Pharmacological assessment
def assess_potency(compound_name):
    potency = {"Sanjeevani": 9.5, "Aconite": 7.0,
               "Juniper": 3.0, "Alpine Grass": 0.5}
    score = potency.get(compound_name, 0)
    if score > 8:
        return f"STRONG candidate (score: {score}/10)"
    elif score > 5:
        return f"Moderate candidate (score: {score}/10)"
    return f"Weak candidate (score: {score}/10)"

# === RUN THE SEARCH ===
print("=" * 50)
print("  THE SANJEEVANI SEARCH PIPELINE")
print("=" * 50)

# Input: field measurements
altitude = 4500
leaf_data = [4500, 3.5, 0, 1]  # alt, width, compound, serrate

print(f"\\\n1. GEOLOGY: Altitude = {altitude} m")
print(f"   {geological_filter(altitude)}")

print(f"\\\n2. BOTANY: Leaf width=3.5cm, serrate edge")
species = identify_herb(leaf_data)
print(f"   Identified: {species}")

print(f"\\\n3. PHARMACOLOGY: Assessing {species}")
print(f"   {assess_potency(species)}")

print(f"\\\n4. RECOMMENDATION:")
if species == "Sanjeevani":
    print("   MATCH FOUND. Proceed to extraction and testing.")
    print("   WARNING: Verify with DNA barcoding before use.")
else:
    print(f"   Not Sanjeevani. Continue searching.")

print("\\\n" + "=" * 50)
print("  Hanuman lifted a mountain.")
print("  Science lifts the uncertainty.")
print("=" * 50)`,
      challenge: 'Add a "safety check" step: if the identified species is Aconite, print a toxicity warning and recommend gloves. Add a "conservation check": if the species is Endangered, recommend taking only a small sample and recording GPS coordinates for monitoring.',
      successHint: 'You have built a complete scientific pipeline that solves the Hanuman problem — from geology to botany to pharmacology to machine learning. This is what STEM education does: it gives you the tools to solve problems that once required miracles.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant ID app with image classification, molecular docking, and full pipeline</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build a complete plant identification and drug discovery pipeline. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
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
            diagram={[HanumanDichotomousKeyDiagram, HanumanAltitudeZonesDiagram, HanumanMedicineDiagram, HanumanTectonicDiagram, ActivityHerbIdentifyDiagram, DecisionTreeDiagram][i] ? createElement([HanumanDichotomousKeyDiagram, HanumanAltitudeZonesDiagram, HanumanMedicineDiagram, HanumanTectonicDiagram, ActivityHerbIdentifyDiagram, DecisionTreeDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
