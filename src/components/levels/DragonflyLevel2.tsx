import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DragonflyLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Histograms — summarizing an image in one chart',
      concept: `In Level 1 you looked at individual pixels and color channels. But a 1000×1000 image has a million pixels — you can't inspect them one by one. You need a **summary**.

A **histogram** counts how many pixels have each brightness value (0-255). A healthy crop image has most pixels clustered around bright green values. A diseased crop has pixels shifted toward brown/yellow. The histogram shape tells you the health of the entire field in a single glance.

This is a critical concept in computer vision: instead of analyzing every pixel, you extract a **statistical summary** (the histogram) and analyze that. The summary is called a **feature** — a compact representation of the data that captures what matters and discards what doesn't.`,
      analogy: 'A histogram is like a census. Instead of interviewing every person in a city, you count how many are in each age bracket: 0-10, 10-20, 20-30, etc. The distribution tells you if it\'s a young city or old one — without knowing any individual. A color histogram does the same for pixels.',
      storyConnection: 'When Bonti looked at her field, she didn\'t examine each individual rice stalk. She saw the overall color — "the field looks green and healthy" or "there\'s a brown patch over there." Her brain was computing a spatial histogram without knowing it. We\'re teaching the computer the same skill.',
      checkQuestion: 'If a healthy field\'s green channel histogram peaks around value 140, and a stressed field peaks around 90, what does a histogram peaking at 115 suggest?',
      checkAnswer: 'Partially stressed — the green values are between healthy and stressed levels. The field might be early-stage stressed (trending toward brown) or a mix of healthy and stressed patches. You\'d want to also check the spatial distribution, not just the histogram.',
      codeIntro: 'Compare histograms of healthy vs. stressed crop patches.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate two 50x50 patches
healthy = np.random.normal(140, 15, (50, 50)).clip(0, 255).astype(np.uint8)
stressed = np.random.normal(90, 20, (50, 50)).clip(0, 255).astype(np.uint8)

fig, axes = plt.subplots(2, 2, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')

# Show patches
axes[0, 0].imshow(np.stack([healthy*0.2, healthy, healthy*0.1], axis=2).astype(np.uint8))
axes[0, 0].set_title('Healthy patch', color='white', fontsize=10)

axes[0, 1].imshow(np.stack([stressed*1.2, stressed, stressed*0.3], axis=2).clip(0,255).astype(np.uint8))
axes[0, 1].set_title('Stressed patch', color='white', fontsize=10)

# Histograms
for ax in axes.flat: ax.set_facecolor('#111827'); ax.tick_params(colors='gray')

axes[1, 0].hist(healthy.ravel(), bins=50, color='#22c55e', alpha=0.8, edgecolor='none')
axes[1, 0].set_title('Green channel histogram (healthy)', color='white', fontsize=9)
axes[1, 0].axvline(np.mean(healthy), color='white', linestyle='--', linewidth=1)

axes[1, 1].hist(stressed.ravel(), bins=50, color='#f59e0b', alpha=0.8, edgecolor='none')
axes[1, 1].set_title('Green channel histogram (stressed)', color='white', fontsize=9)
axes[1, 1].axvline(np.mean(stressed), color='white', linestyle='--', linewidth=1)

plt.tight_layout()
plt.show()

print(f"Healthy: mean green = {np.mean(healthy):.1f}, std = {np.std(healthy):.1f}")
print(f"Stressed: mean green = {np.mean(stressed):.1f}, std = {np.std(stressed):.1f}")
print()
print("The histograms have different shapes and centers.")
print("Mean and std are our first 'features' — numbers that")
print("summarize a whole image patch in just 2 values.")`,
      challenge: 'Add a third patch: "mixed" with np.random.normal(115, 25, ...). Its histogram should overlap both. This is why classification is hard — categories aren\'t always cleanly separated.',
      successHint: 'You just extracted your first features: mean and standard deviation of the green channel. Two numbers that summarize 2,500 pixels. Feature extraction is the bridge between raw images and classifiers.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Compute histograms for all 3 channels (R, G, B) of a healthy patch. Which channel has the highest mean?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n# Healthy rice: low red, high green, low blue\npatch = np.zeros((50, 50, 3), dtype=np.uint8)\npatch[:,:,0] = np.random.normal(40, 10, (50,50)).clip(0,255)  # Red\npatch[:,:,1] = np.random.normal(140, 15, (50,50)).clip(0,255)  # Green\npatch[:,:,2] = np.random.normal(25, 8, (50,50)).clip(0,255)   # Blue\n\nfig, axes = plt.subplots(1, 3, figsize=(12, 3))\nfig.patch.set_facecolor('#1f2937')\nfor ax, ch, name, color in zip(axes, [0,1,2], ['Red','Green','Blue'], ['#ef4444','#22c55e','#3b82f6']):\n    ax.hist(patch[:,:,ch].ravel(), bins=40, color=color, alpha=0.8, edgecolor='none')\n    ax.set_title(f'{name}: mean={np.mean(patch[:,:,ch]):.0f}', color='white', fontsize=9)\n    ax.set_facecolor('#111827')\n    ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
        },
        {
          label: 'Apply',
          prompt: 'Create a function that takes any image patch and returns [mean_r, mean_g, mean_b, std_r, std_g, std_b] — 6 features.',
          starterCode: `import numpy as np\n\ndef extract_color_features(patch):\n    """Extract 6 color features from an image patch."""\n    features = []\n    for ch in range(3):\n        features.append(np.mean(patch[:,:,ch]))\n        features.append(np.std(patch[:,:,ch]))\n    return features\n\n# Test it\nhealthy = np.random.normal(0, 1, (50, 50, 3))\nhealthy[:,:,0] = np.random.normal(40, 10, (50, 50))  # R\nhealthy[:,:,1] = np.random.normal(140, 15, (50, 50))  # G\nhealthy[:,:,2] = np.random.normal(25, 8, (50, 50))  # B\n\nf = extract_color_features(healthy.clip(0,255))\nprint("Features: [mean_R, std_R, mean_G, std_G, mean_B, std_B]")\nprint([f"{v:.1f}" for v in f])`,
          hint: 'This function turns any image patch (thousands of pixels) into just 6 numbers. That\'s feature extraction.',
        },
        {
          label: 'Challenge',
          prompt: 'Plot the feature distributions of 100 healthy and 100 stressed patches. Do they overlap?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\ndef extract_features(patch):\n    return [np.mean(patch[:,:,ch]) for ch in range(3)]\n\nhealthy_features = []\nstressed_features = []\n\nfor _ in range(100):\n    h = np.zeros((20,20,3)); h[:,:,0]=np.random.normal(40,10,(20,20)); h[:,:,1]=np.random.normal(140,15,(20,20)); h[:,:,2]=np.random.normal(25,8,(20,20))\n    s = np.zeros((20,20,3)); s[:,:,0]=np.random.normal(130,15,(20,20)); s[:,:,1]=np.random.normal(90,20,(20,20)); s[:,:,2]=np.random.normal(35,10,(20,20))\n    healthy_features.append(extract_features(h.clip(0,255)))\n    stressed_features.append(extract_features(s.clip(0,255)))\n\nhf = np.array(healthy_features)\nsf = np.array(stressed_features)\n\nfig, ax = plt.subplots(figsize=(8, 6))\nfig.patch.set_facecolor('#1f2937')\nax.set_facecolor('#111827')\nax.scatter(hf[:,1], hf[:,0], c='#22c55e', alpha=0.5, label='Healthy', s=20)\nax.scatter(sf[:,1], sf[:,0], c='#f59e0b', alpha=0.5, label='Stressed', s=20)\nax.set_xlabel('Mean Green', color='white')\nax.set_ylabel('Mean Red', color='white')\nax.set_title('Feature space: Green vs Red', color='white')\nax.legend()\nax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\nprint("If the clusters are separated, a classifier can learn the boundary")`,
          hint: 'This scatter plot IS the feature space. Each dot is one image patch, summarized as 2 numbers. A classifier draws a line between the clusters.',
        },
      ],
    },
    {
      title: 'Feature vectors — describing an image as a list of numbers',
      concept: `In Level 1 you classified pixels by color thresholds — simple rules on individual values. But real images are complex. A single mean value isn't enough to distinguish "healthy rice with morning dew" from "stressed rice in afternoon sun" — both might have similar green levels.

A **feature vector** is a list of multiple measurements that together describe an image more completely than any single measurement could:
- Mean and std of each color channel (6 values)
- Green-to-red ratio (1 value — our simple vegetation index)
- Edge density (1 value — how many boundaries exist)
- Texture roughness (1 value — smooth healthy leaves vs. blotchy disease)

Together, these 9+ numbers form a **point in feature space** — a mathematical space where similar images cluster together and different images are far apart. A classifier learns where to draw the boundary between clusters.`,
      analogy: 'Imagine describing a person to a sketch artist. "Tall" alone isn\'t enough. "Tall, thin, curly hair, brown eyes, round face" — now the artist can draw them. Each descriptor is a feature. Together, they\'re a feature vector. The more features, the more precisely you describe the person — or the image.',
      storyConnection: 'Nila didn\'t identify pests by color alone. She used size, shape, movement speed, and position on the stalk. Multiple features combined into a split-second decision: pest or harmless? Our feature vector is Nila\'s decision process made explicit.',
      checkQuestion: 'Two image patches have identical mean green values (130). But patch A has std=5 (uniform) and patch B has std=40 (patchy). What might this mean?',
      checkAnswer: 'Patch A is uniformly green — probably healthy rice of one variety. Patch B has wildly varying green — probably a mix of healthy spots, bare soil, and maybe early disease patches. Same mean, completely different reality. That\'s why you need multiple features.',
      codeIntro: 'Build a complete feature extraction function and visualize the feature space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def extract_features(patch):
    """Extract a feature vector from an image patch."""
    features = {}

    # Color statistics (6 features)
    for ch, name in enumerate(['red', 'green', 'blue']):
        features[f'{name}_mean'] = np.mean(patch[:,:,ch])
        features[f'{name}_std'] = np.std(patch[:,:,ch])

    # Vegetation index (1 feature)
    total = patch.sum(axis=2).astype(float) + 1
    features['veg_index'] = np.mean(patch[:,:,1].astype(float) / total)

    # Edge density (1 feature)
    gray = np.mean(patch.astype(float), axis=2)
    edges = np.sqrt(np.diff(gray, axis=0)[:,:-1]**2 + np.diff(gray, axis=1)[:-1,:]**2)
    features['edge_density'] = np.mean(edges > 15)

    return features

# Generate sample patches
np.random.seed(42)
samples = []
for label, r, g, b in [
    ('healthy', 35, 145, 20),
    ('stressed', 140, 95, 35),
    ('soil', 120, 80, 50),
]:
    for _ in range(5):
        p = np.stack([
            np.random.normal(r, 12, (30,30)),
            np.random.normal(g, 15, (30,30)),
            np.random.normal(b, 8, (30,30)),
        ], axis=2).clip(0, 255).astype(np.uint8)
        f = extract_features(p)
        f['label'] = label
        samples.append(f)

# Print feature table
print(f"{'Label':10s} {'R mean':>7s} {'G mean':>7s} {'Veg Idx':>7s} {'Edge':>7s}")
print("-" * 42)
for s in samples:
    print(f"{s['label']:10s} {s['red_mean']:7.1f} {s['green_mean']:7.1f} {s['veg_index']:7.3f} {s['edge_density']:7.3f}")`,
      challenge: 'Add a "texture" feature: compute the standard deviation of pixel values in a small neighborhood. Rough textures (disease) have high std, smooth textures (healthy leaves) have low std.',
      successHint: 'You just built a real feature extraction pipeline. Each 30×30 patch (2,700 pixels × 3 channels = 8,100 values) becomes ~9 numbers. That\'s a 900:1 compression — keeping only what matters for classification.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Print the full feature vector as a simple Python list. How many features do you have?',
          starterCode: `import numpy as np\n\ndef extract_features(patch):\n    feats = []\n    for ch in range(3):\n        feats.append(np.mean(patch[:,:,ch]))\n        feats.append(np.std(patch[:,:,ch]))\n    total = patch.sum(axis=2).astype(float) + 1\n    feats.append(np.mean(patch[:,:,1].astype(float) / total))\n    gray = np.mean(patch.astype(float), axis=2)\n    edges = np.sqrt(np.diff(gray, axis=0)[:,:-1]**2 + np.diff(gray, axis=1)[:-1,:]**2)\n    feats.append(np.mean(edges > 15))\n    return feats\n\npatch = np.random.randint(0, 255, (30, 30, 3), dtype=np.uint8)\nfv = extract_features(patch)\nprint(f"Feature vector ({len(fv)} features):")\nprint([f"{v:.2f}" for v in fv])\nprint()\nprint("Names: [R_mean, R_std, G_mean, G_std, B_mean, B_std, veg_index, edge_density]")`,
        },
        {
          label: 'Apply',
          prompt: 'Plot 50 healthy and 50 stressed patches in 2D feature space (green_mean vs red_mean). Can you see the boundary?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nhealthy_g, healthy_r = [], []\nstressed_g, stressed_r = [], []\n\nfor _ in range(50):\n    h = np.stack([np.random.normal(35,12,(20,20)),np.random.normal(145,15,(20,20)),np.random.normal(20,8,(20,20))],axis=2).clip(0,255)\n    s = np.stack([np.random.normal(140,15,(20,20)),np.random.normal(95,20,(20,20)),np.random.normal(35,10,(20,20))],axis=2).clip(0,255)\n    healthy_g.append(np.mean(h[:,:,1])); healthy_r.append(np.mean(h[:,:,0]))\n    stressed_g.append(np.mean(s[:,:,1])); stressed_r.append(np.mean(s[:,:,0]))\n\nfig, ax = plt.subplots(figsize=(7, 6))\nfig.patch.set_facecolor('#1f2937')\nax.set_facecolor('#111827')\nax.scatter(healthy_g, healthy_r, c='#22c55e', label='Healthy', s=30, alpha=0.7)\nax.scatter(stressed_g, stressed_r, c='#f59e0b', label='Stressed', s=30, alpha=0.7)\nax.set_xlabel('Mean Green', color='white')\nax.set_ylabel('Mean Red', color='white')\nax.set_title('Feature Space', color='white')\nax.legend()\nax.tick_params(colors='gray')\n\n# Draw a rough decision boundary\nax.plot([80, 180], [120, 40], 'w--', linewidth=1, alpha=0.5, label='Boundary?')\nplt.tight_layout()\nplt.show()`,
          hint: 'The dashed white line is a linear decision boundary. Everything above-left is classified as stressed, below-right as healthy.',
        },
        {
          label: 'Challenge',
          prompt: 'What happens when you add noise to the features? Increase the std of both healthy and stressed patches. At what point does classification fail?',
          starterCode: `import numpy as np\n\nnp.random.seed(42)\n\nfor noise in [10, 20, 40, 80]:\n    correct = 0\n    total = 100\n    for _ in range(total):\n        if np.random.random() < 0.5:\n            g = np.random.normal(145, noise)\n            r = np.random.normal(35, noise)\n            true_label = 'healthy'\n        else:\n            g = np.random.normal(95, noise)\n            r = np.random.normal(140, noise)\n            true_label = 'stressed'\n        pred = 'healthy' if g > r else 'stressed'\n        if pred == true_label: correct += 1\n    print(f"Noise std={noise:3d}: accuracy = {correct}%")\n\nprint()\nprint("More noise = more overlap = harder to classify")\nprint("This is why real drones need good cameras and multiple features")`,
        },
      ],
    },
    {
      title: 'Distance — how classifiers measure similarity',
      concept: `A classifier needs to decide: is this new image more like the healthy examples or the stressed examples? It answers by measuring **distance** in feature space.

**Euclidean distance** is the straight-line distance between two points — the same formula you learned in geometry: √((x₂-x₁)² + (y₂-y₁)²). In feature space with 8 features, it's the same idea but in 8 dimensions.

The simplest classifier is **k-Nearest Neighbors (k-NN)**: given a new image, find the k closest labeled examples in feature space, and vote. If 3 out of 5 nearest neighbors are "healthy," classify as healthy. No training phase, no complex math — just measuring distance and voting.`,
      analogy: 'You\'re at a party and don\'t know anyone. You walk up to the 5 people standing closest to you and ask what they\'re drinking. If 4 out of 5 say coffee, you\'re probably in the coffee corner. k-NN works the same way: classify by asking your neighbors.',
      storyConnection: 'When a new pattern appeared in Rongpharpi\'s vibrations (from the elephant story) or a new bug appeared on Bonti\'s rice, they classified it by comparing it to similar things they\'d seen before. "This looks like that pest from last year." k-NN formalizes this: find the most similar past examples and copy their label.',
      checkQuestion: 'Two healthy patches have features [140, 35] (green, red). A new patch has features [120, 50]. A stressed patch has features [90, 130]. Which is the new patch closer to?',
      checkAnswer: 'Distance to healthy: √((140-120)² + (35-50)²) = √(400+225) = √625 = 25. Distance to stressed: √((90-120)² + (130-50)²) = √(900+6400) = √7300 ≈ 85. Much closer to healthy. Classified as healthy.',
      codeIntro: 'Build a k-NN classifier from scratch — no libraries, just distance and voting.',
      code: `import numpy as np

def euclidean_distance(a, b):
    """Distance between two feature vectors."""
    return np.sqrt(np.sum((np.array(a) - np.array(b)) ** 2))

def knn_classify(new_point, labeled_data, k=3):
    """Classify by majority vote of k nearest neighbors."""
    distances = []
    for features, label in labeled_data:
        d = euclidean_distance(new_point, features)
        distances.append((d, label))

    # Sort by distance, take k nearest
    distances.sort(key=lambda x: x[0])
    nearest = distances[:k]

    # Vote
    votes = {}
    for _, label in nearest:
        votes[label] = votes.get(label, 0) + 1

    winner = max(votes, key=votes.get)
    return winner, nearest

# Training data: [green_mean, red_mean] -> label
np.random.seed(42)
training = []
for _ in range(20):
    training.append(([np.random.normal(145, 10), np.random.normal(35, 8)], 'healthy'))
    training.append(([np.random.normal(90, 12), np.random.normal(140, 10)], 'stressed'))
    training.append(([np.random.normal(80, 8), np.random.normal(120, 8)], 'soil'))

# Test on new points
test_points = [
    ([140, 40], 'healthy'),
    ([85, 135], 'stressed'),
    ([75, 125], 'soil'),
    ([115, 85], '???'),  # ambiguous!
]

print(f"{'Actual':10s} {'Predicted':10s} {'Nearest 3':30s}")
print("-" * 52)
for features, actual in test_points:
    pred, nearest = knn_classify(features, training, k=3)
    nn_str = ', '.join([f"{l}({d:.0f})" for d, l in nearest])
    status = "✓" if pred == actual or actual == '???' else "✗"
    print(f"{actual:10s} {pred:10s} {nn_str}")`,
      challenge: 'Change k from 3 to 1 (nearest single neighbor) and k=7 (more neighbors). How does it affect the ambiguous point [115, 85]?',
      successHint: 'You built a k-NN classifier from scratch. No scipy, no sklearn — just distance and voting. This is the same algorithm used in real image classification, just at larger scale.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Calculate the Euclidean distance between [10, 20, 30] and [13, 24, 30] by hand, then verify with code.',
          starterCode: `import numpy as np\n\na = np.array([10, 20, 30])\nb = np.array([13, 24, 30])\n\n# By formula: sqrt((13-10)^2 + (24-20)^2 + (30-30)^2)\nmanual = (3**2 + 4**2 + 0**2) ** 0.5\nprint(f"By hand: sqrt(9 + 16 + 0) = sqrt(25) = {manual}")\n\n# With NumPy\nauto = np.sqrt(np.sum((a - b) ** 2))\nprint(f"With NumPy: {auto}")\n\n# They should match\nprint(f"Match: {abs(manual - auto) < 0.001}")`,
        },
        {
          label: 'Apply',
          prompt: 'Test your k-NN classifier with k=1, k=3, k=5, k=10 on the ambiguous point. Which k gives the most stable answer?',
          starterCode: `import numpy as np\n\ndef knn(point, data, k):\n    dists = sorted([(np.sqrt(sum((a-b)**2 for a,b in zip(point, f))), l) for f, l in data])\n    votes = {}\n    for _, l in dists[:k]: votes[l] = votes.get(l, 0) + 1\n    return max(votes, key=votes.get)\n\nnp.random.seed(42)\ndata = []\nfor _ in range(30):\n    data.append(([np.random.normal(145,10), np.random.normal(35,8)], 'healthy'))\n    data.append(([np.random.normal(90,12), np.random.normal(140,10)], 'stressed'))\n\nambiguous = [115, 85]\nfor k in [1, 3, 5, 7, 10, 15]:\n    pred = knn(ambiguous, data, k)\n    print(f"k={k:2d}: {pred}")`,
          hint: 'Small k is sensitive to noise (one weird neighbor flips the vote). Large k is smoother but might miss local patterns.',
        },
        {
          label: 'Challenge',
          prompt: 'What if features have different scales? Green ranges 0-255 but edge density ranges 0-1. Which dominates the distance?',
          starterCode: `import numpy as np\n\n# Two patches: same green, different edge density\na = [140, 0.1]  # green_mean, edge_density\nb = [140, 0.9]  # same green, very different edges\nc = [100, 0.1]  # different green, same edges\n\ndef dist(x, y):\n    return np.sqrt(sum((a-b)**2 for a,b in zip(x, y)))\n\nprint(f"Distance A-B (same green, diff edges): {dist(a, b):.3f}")\nprint(f"Distance A-C (diff green, same edges): {dist(a, c):.3f}")\nprint()\nprint("Green dominates! A tiny difference in green (40 units)")\nprint("overwhelms a huge difference in edges (0.8 units).")\nprint()\nprint("Solution: normalize features to 0-1 range before computing distance.")\nprint("This is called 'feature scaling' — essential for k-NN.")`,
          hint: 'Divide each feature by its range so they\'re all on the same 0-1 scale. This is called min-max normalization.',
        },
      ],
    },
    {
      title: 'Building a crop health classifier',
      concept: `Time to put everything together. You'll build a complete pipeline that takes a synthetic drone image, splits it into patches, extracts features from each patch, classifies each patch using k-NN, and produces a color-coded health map.

This is exactly the pipeline that real agricultural drone systems use:
1. **Capture** — drone flies over field, takes a photo
2. **Tile** — split the image into small patches (e.g., 20×20 pixels)
3. **Extract** — compute features for each patch
4. **Classify** — k-NN (or a more sophisticated model) labels each patch
5. **Map** — color-code the results for the farmer
6. **Report** — summarize: X% healthy, Y% stressed, Z% soil`,
      storyConnection: 'This is the full version of what Nila did instinctively: patrol the entire field, assess each section, report back by eating more pests where they were concentrated. Your classifier patrols digitally and reports by coloring a map.',
      checkQuestion: 'If you split a 200×200 image into 20×20 patches, how many patches do you get? How many feature vectors?',
      checkAnswer: '200/20 = 10 patches per row × 10 patches per column = 100 patches total. Each patch produces one feature vector. So 100 feature vectors, each with ~8 features. The classifier runs 100 times — once per patch.',
      codeIntro: 'Build the complete drone → classify → map pipeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === Step 1: Create a synthetic drone image ===
field = np.zeros((200, 200, 3), dtype=np.uint8)
# Healthy regions
field[:120, :140] = [30, 140, 18]
field[:120, :140] += np.random.randint(0, 25, (120, 140, 3), dtype=np.uint8)
# Stressed patch
field[40:100, 100:180] = [145, 100, 35]
field[40:100, 100:180] += np.random.randint(0, 20, (60, 80, 3), dtype=np.uint8)
# Soil
field[120:, :] = [115, 78, 48]
field[120:, :] += np.random.randint(0, 20, (80, 200, 3), dtype=np.uint8)

# === Step 2: Training data (known patches) ===
def make_patch(r, g, b, n=20):
    return np.stack([np.random.normal(r,10,(n,n)), np.random.normal(g,12,(n,n)), np.random.normal(b,8,(n,n))], axis=2).clip(0,255).astype(np.uint8)

def features(p):
    return [np.mean(p[:,:,ch]) for ch in range(3)] + [np.std(p[:,:,1])]

training = []
for _ in range(15):
    training.append((features(make_patch(30, 140, 18)), 'healthy'))
    training.append((features(make_patch(145, 100, 35)), 'stressed'))
    training.append((features(make_patch(115, 78, 48)), 'soil'))

# === Step 3: Classify each 20x20 patch ===
def knn(point, data, k=3):
    dists = sorted([(np.sqrt(sum((a-b)**2 for a,b in zip(point, f))), l) for f, l in data])
    votes = {}
    for _, l in dists[:k]: votes[l] = votes.get(l, 0) + 1
    return max(votes, key=votes.get)

patch_size = 20
rows, cols = 200 // patch_size, 200 // patch_size
result_map = np.zeros((rows, cols, 3), dtype=np.uint8)
colors = {'healthy': [0, 200, 0], 'stressed': [255, 180, 0], 'soil': [139, 90, 43]}
counts = {'healthy': 0, 'stressed': 0, 'soil': 0}

for r in range(rows):
    for c in range(cols):
        patch = field[r*patch_size:(r+1)*patch_size, c*patch_size:(c+1)*patch_size]
        f = features(patch)
        label = knn(f, training, k=3)
        result_map[r, c] = colors[label]
        counts[label] += 1

# === Step 4: Display ===
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
fig.patch.set_facecolor('#1f2937')
ax1.imshow(field); ax1.set_title('Drone image', color='white')
ax2.imshow(result_map); ax2.set_title('Classification map', color='white')
for ax in [ax1, ax2]: ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

total = sum(counts.values())
print("=== FIELD REPORT ===")
for label, count in counts.items():
    print(f"  {label:10s}: {count:3d} patches ({count/total*100:.1f}%)")`,
      challenge: 'The stressed patch in the original image has a sharp boundary. Does the classifier detect the exact same boundary, or is it slightly different? Why?',
      successHint: 'You built a complete computer vision pipeline from scratch. Drone image → patches → features → k-NN → map → report. This is real precision agriculture.',
    },
    {
      title: 'Measuring accuracy — confusion matrices',
      concept: `How good is your classifier? Saying "it works" isn't enough. You need to measure **exactly how often it's right and wrong**, and **what kinds of mistakes it makes**.

A **confusion matrix** shows this: rows are the true labels, columns are predicted labels. The diagonal shows correct predictions. Off-diagonal shows mistakes. For example, if the classifier confuses stressed crops with soil (both brownish), you'll see a high number in the stressed-row, soil-column cell.

Key metrics from a confusion matrix:
- **Accuracy**: total correct / total predictions
- **Precision**: of everything predicted as "stressed", how many actually were?
- **Recall**: of all actual stressed patches, how many did we catch?

In agriculture, recall matters more for stress detection — missing a diseased patch costs more than a false alarm.`,
      analogy: 'A smoke alarm with high recall goes off for every puff of smoke (catches all fires, but also burnt toast). One with high precision only goes off for real fires (no false alarms, but might miss a small one). In crop monitoring, you want high recall — better to investigate a false alarm than miss real stress.',
      storyConnection: 'If Nila missed a real pest (low recall), the rice would be eaten. If she chased a harmless bug (low precision), she wasted energy but nothing died. For pest control, recall > precision. Same for drone-based crop health: catch every stressed patch, even if you investigate a few healthy ones by mistake.',
      checkQuestion: 'A classifier correctly identifies 45 out of 50 stressed patches, but also incorrectly labels 10 healthy patches as stressed. What\'s its recall and precision for "stressed"?',
      checkAnswer: 'Recall = 45/50 = 90% (caught 90% of actual stressed patches). Precision = 45/(45+10) = 45/55 = 81.8% (82% of what it called "stressed" actually was). Good recall, decent precision.',
      codeIntro: 'Evaluate your classifier with a confusion matrix and accuracy metrics.',
      code: `import numpy as np

np.random.seed(42)

# Generate test data with known labels
def make_patch(r, g, b, n=20):
    return np.stack([np.random.normal(r,12,(n,n)), np.random.normal(g,15,(n,n)), np.random.normal(b,10,(n,n))], axis=2).clip(0,255)

def features(p):
    return [np.mean(p[:,:,ch]) for ch in range(3)]

# Training data
training = []
for _ in range(20):
    training.append((features(make_patch(30, 140, 18)), 'healthy'))
    training.append((features(make_patch(145, 100, 35)), 'stressed'))
    training.append((features(make_patch(115, 78, 48)), 'soil'))

def knn(point, data, k=3):
    dists = sorted([(np.sqrt(sum((a-b)**2 for a,b in zip(point, f))), l) for f, l in data])
    votes = {}
    for _, l in dists[:k]: votes[l] = votes.get(l, 0) + 1
    return max(votes, key=votes.get)

# Test data (50 per class)
labels = ['healthy', 'stressed', 'soil']
params = {'healthy': (30, 140, 18), 'stressed': (145, 100, 35), 'soil': (115, 78, 48)}

true_labels = []
pred_labels = []

for label in labels:
    r, g, b = params[label]
    for _ in range(50):
        p = make_patch(r, g, b)
        f = features(p)
        pred = knn(f, training, k=3)
        true_labels.append(label)
        pred_labels.append(pred)

# Build confusion matrix
print("CONFUSION MATRIX")
print(f"{'':12s}", end='')
for l in labels: print(f"{'Pred '+l:>14s}", end='')
print()
print("-" * 54)

for true in labels:
    print(f"True {true:8s}", end='')
    for pred in labels:
        count = sum(1 for t, p in zip(true_labels, pred_labels) if t == true and p == pred)
        marker = " ✓" if true == pred else ""
        print(f"{count:>12d}{marker}", end='')
    print()

# Metrics
correct = sum(1 for t, p in zip(true_labels, pred_labels) if t == p)
total = len(true_labels)
print(f"\\\nOverall accuracy: {correct}/{total} = {correct/total*100:.1f}%")

# Per-class recall
print("\\\nPer-class recall:")
for label in labels:
    true_count = sum(1 for t in true_labels if t == label)
    correct_count = sum(1 for t, p in zip(true_labels, pred_labels) if t == label and p == label)
    print(f"  {label:10s}: {correct_count}/{true_count} = {correct_count/true_count*100:.1f}%")`,
      challenge: 'Which class has the lowest recall? That\'s where your classifier struggles most. Try increasing k to 5 or 7 — does it help?',
      successHint: 'You can now measure exactly how good a classifier is, what mistakes it makes, and where to improve. This is how real ML systems are evaluated — not just "it works" but precise metrics.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Calculate precision for each class from the confusion matrix. Which class has the best precision?',
          starterCode: `# From the confusion matrix above:\n# Suppose these are the counts:\n#              Pred healthy  Pred stressed  Pred soil\n# True healthy       48            1            1\n# True stressed       2           46            2\n# True soil           3            4           43\n\n# Precision = correct / total predicted as that class\nhealthy_precision = 48 / (48 + 2 + 3)\nstressed_precision = 46 / (1 + 46 + 4)\nsoil_precision = 43 / (1 + 2 + 43)\n\nprint(f"Healthy precision:  {healthy_precision*100:.1f}%")\nprint(f"Stressed precision: {stressed_precision*100:.1f}%")\nprint(f"Soil precision:     {soil_precision*100:.1f}%")`,
        },
        {
          label: 'Apply',
          prompt: 'Add more noise to the test data and re-run. How does accuracy degrade?',
          starterCode: `import numpy as np\n\nnp.random.seed(42)\n\ndef knn(point, data, k=3):\n    dists = sorted([(np.sqrt(sum((a-b)**2 for a,b in zip(point, f))), l) for f, l in data])\n    votes = {}\n    for _, l in dists[:k]: votes[l] = votes.get(l, 0) + 1\n    return max(votes, key=votes.get)\n\ntraining = []\nfor _ in range(20):\n    training.append(([np.random.normal(140,10), np.random.normal(35,8)], 'healthy'))\n    training.append(([np.random.normal(90,12), np.random.normal(140,10)], 'stressed'))\n\nfor noise in [5, 10, 20, 40, 60]:\n    correct = 0\n    for _ in range(100):\n        true = 'healthy' if np.random.random() < 0.5 else 'stressed'\n        if true == 'healthy':\n            f = [np.random.normal(140, noise), np.random.normal(35, noise)]\n        else:\n            f = [np.random.normal(90, noise), np.random.normal(140, noise)]\n        if knn(f, training) == true: correct += 1\n    print(f"Noise std={noise:2d}: accuracy = {correct}%")`,
        },
        {
          label: 'Challenge',
          prompt: 'Implement F1 score: the harmonic mean of precision and recall. F1 = 2 × (precision × recall) / (precision + recall)',
          starterCode: `# Given these values:\nprecision = 0.85  # 85% of predictions were correct\nrecall = 0.92     # caught 92% of actual cases\n\nf1 = 2 * (precision * recall) / (precision + recall)\nprint(f"Precision: {precision*100:.1f}%")\nprint(f"Recall: {recall*100:.1f}%")\nprint(f"F1 Score: {f1*100:.1f}%")\nprint()\nprint("F1 balances precision and recall.")\nprint("If either is low, F1 drops significantly.")\nprint()\n\n# What if precision is great but recall is terrible?\nprecision2 = 0.95\nrecall2 = 0.30\nf1_2 = 2 * (precision2 * recall2) / (precision2 + recall2)\nprint(f"High precision ({precision2*100:.0f}%), low recall ({recall2*100:.0f}%): F1 = {f1_2*100:.1f}%")\nprint("F1 punishes imbalance — you need both to be good.")`,
          hint: 'F1 is the standard metric in ML. It\'s used because accuracy alone can be misleading — a classifier that always says "healthy" gets 60% accuracy if 60% of the field is healthy, but catches zero stress.',
        },
      ],
    },
    {
      title: 'From here to real drones — what Level 3 adds',
      concept: `You've built a complete computer vision pipeline: pixels → features → k-NN → classification map → accuracy metrics. This is genuinely how precision agriculture works. But there are gaps between your synthetic pipeline and a real drone system:

**What you built (Level 1-2):**
- Synthetic images with known labels
- Hand-picked color features (mean, std)
- k-NN classifier with manual thresholds
- 3 categories (healthy, stressed, soil)

**What real systems add (Level 3):**
- **Real images** from cameras (noise, lighting variation, shadows)
- **Learned features** — convolutional neural networks (CNNs) that discover which features matter, rather than you choosing them
- **Transfer learning** — start with a model pre-trained on millions of images (ImageNet), fine-tune on your crop data
- **Infrared channels** — cameras that see wavelengths invisible to humans (NDVI)
- **Temporal analysis** — compare the same field across weeks to detect trends
- **GPS integration** — map detections to exact field coordinates

The jump from k-NN to CNNs is the biggest — instead of you designing features, the neural network learns which pixel patterns matter. But everything you've learned (histograms, feature spaces, distance, accuracy metrics) still applies.`,
      storyConnection: 'Nila\'s compound eyes were a biological CNN — thousands of lenses feeding into a neural network (her brain) that learned from experience which patterns meant "pest" and which meant "harmless." Level 3 builds the digital version of Nila\'s brain.',
      checkQuestion: 'Why would a CNN be better than your hand-picked color features for classifying real drone images?',
      checkAnswer: 'Real images have variation you can\'t anticipate: shadows change colors, wet leaves look different from dry ones, different rice varieties have different greens. A CNN sees millions of examples and learns which patterns reliably indicate stress — including patterns you\'d never think to check, like leaf texture or stem angle.',
      codeIntro: 'Summarize everything you\'ve built and preview what Level 3 adds.',
      code: `print("=" * 50)
print("  YOUR COMPUTER VISION JOURNEY")
print("=" * 50)
print()
print("Level 1 — What you learned:")
print("  ✓ Pixels: images are grids of RGB numbers")
print("  ✓ Color channels: R, G, B reveal different info")
print("  ✓ Thresholds: simplest detection method")
print("  ✓ NumPy: process millions of pixels at once")
print("  ✓ Counting: pixels → percentages → reports")
print("  ✓ Edge detection: finding boundaries")
print()
print("Level 2 — What you built:")
print("  ✓ Histograms: summarize an image in one chart")
print("  ✓ Feature vectors: describe an image as numbers")
print("  ✓ Distance: measure similarity between images")
print("  ✓ k-NN classifier: classify by nearest neighbors")
print("  ✓ Full pipeline: drone image → classification map")
print("  ✓ Confusion matrix: measure exactly how good it is")
print()
print("Level 3 — What comes next:")
print("  → Real images with noise, shadows, variation")
print("  → CNNs that learn features automatically")
print("  → Transfer learning from pre-trained models")
print("  → Infrared channels (NDVI) for plant health")
print("  → Training on labeled datasets")
print("  → Deploying on actual drone hardware")
print()
print("You understand the foundations. Level 3 scales them up.")`,
      challenge: 'Before you move on: what\'s the single weakest part of your current pipeline? What would break first on a real image? That weakness is what Level 3 addresses first.',
      successHint: 'You\'ve completed the full Builder track for Computer Vision. From "what is a pixel?" to "build a crop classifier with accuracy metrics" — all through the lens of Nila protecting Biren and Bonti\'s paddy field.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" />
          Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Some coding experience (or completed Level 1)</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to code? Load Python to start the lessons below.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Zap className="w-5 h-5" />Load Python Environment</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
            practice={lesson.practice}
           
           
           
          />
        ))}
      </div>
    </div>
  );
}
