import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DragonflyLevel4() {
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
      title: 'Project Design: Crop Health Monitor Pipeline',
      concept: `In Level 3 you learned convolution kernels and image processing for drone imagery. Now you build the complete system: a Crop Health Monitor that analyzes paddy field images to detect diseased regions, estimate crop health percentages, and generate actionable reports.

Real crop monitoring uses **vegetation indices** — mathematical combinations of spectral bands that highlight plant health. The most important is **NDVI (Normalized Difference Vegetation Index)**:

NDVI = (NIR - Red) / (NIR + Red)

Healthy vegetation strongly reflects near-infrared (NIR) light and absorbs red light (for photosynthesis). Diseased or stressed plants reflect less NIR and more red. NDVI values range from -1 to 1: water gives negative values, bare soil gives ~0.1-0.2, stressed vegetation gives 0.2-0.5, and healthy vegetation gives 0.6-0.9.

Our pipeline has four stages:
1. **Image simulation**: generate realistic multispectral paddy field images with healthy, stressed, and diseased regions.
2. **Index computation**: calculate NDVI and other vegetation indices.
3. **Classification**: segment the image into health categories using thresholds and machine learning.
4. **Reporting**: generate field-level health statistics, disease maps, and treatment recommendations.

For the Brahmaputra Valley's paddy fields, common diseases include **blast** (brown lesions, NDVI drops to 0.2-0.3), **bacterial blight** (yellow-brown streaks, NDVI 0.3-0.4), and **sheath blight** (irregular patches, NDVI 0.25-0.35). Our classifier must distinguish these from healthy paddy (NDVI 0.6-0.85).`,
      analogy: 'A crop health monitor is like a doctor using medical imaging. An X-ray reveals internal structures invisible to the naked eye. Similarly, multispectral imaging reveals plant health invisible in normal photos — stressed plants that look green to human eyes already show reduced NIR reflectance. NDVI is the "X-ray" for plants.',
      storyConnection: 'Bonti\'s dragonfly drone in the story flew over paddy fields spotting brown patches among the green. Our Crop Health Monitor does exactly this, but systematically: it scans the entire field, computes health indices for every pixel, classifies disease types, and reports which sections need treatment. It transforms Bonti\'s dragonfly vision into a quantitative agricultural tool.',
      checkQuestion: 'A paddy field has NDVI values between 0.3-0.4 uniformly. Is this necessarily diseased, or could there be another explanation?',
      checkAnswer: 'Not necessarily diseased. Young paddy seedlings recently transplanted have low NDVI because there is more exposed water and soil than leaf area. The NDVI will rise as the plants grow. Similarly, recently harvested fields have low NDVI (stubble). The growth stage must be known to interpret NDVI correctly — a value of 0.35 is alarming at peak growth but normal at transplanting. Temporal context is essential for accurate health assessment.',
      codeIntro: 'Generate realistic multispectral paddy field images with health variations and compute vegetation indices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Paddy Field Image Simulator ---
FIELD_SIZE = 128  # 128x128 pixel field image

def generate_paddy_field(size=128, disease_fraction=0.15, stress_fraction=0.10):
    """Generate a synthetic multispectral paddy field image.

    Returns:
        red, nir, green channels (each size x size)
        labels: 0=healthy, 1=stressed, 2=blast, 3=blight, 4=water, 5=soil
    """
    labels = np.zeros((size, size), dtype=int)

    # Base: healthy paddy
    # Healthy paddy: low red reflectance, high NIR, moderate green
    red = np.random.uniform(0.05, 0.10, (size, size))
    nir = np.random.uniform(0.45, 0.55, (size, size))
    green = np.random.uniform(0.15, 0.25, (size, size))

    # Add spatial texture (paddy rows)
    for i in range(0, size, 8):
        row_offset = np.random.uniform(-0.02, 0.02)
        red[i:i+2, :] += 0.03 + row_offset  # row gaps show soil
        nir[i:i+2, :] -= 0.05
        green[i:i+2, :] -= 0.03

    # Water channels (between field sections)
    for i in [32, 64, 96]:
        width = np.random.randint(2, 4)
        labels[i:i+width, :] = 4
        red[i:i+width, :] = np.random.uniform(0.03, 0.06, (width, size))
        nir[i:i+width, :] = np.random.uniform(0.02, 0.05, (width, size))
        green[i:i+width, :] = np.random.uniform(0.04, 0.08, (width, size))

    # Soil patches (field borders)
    labels[:3, :] = 5; labels[-3:, :] = 5; labels[:, :3] = 5; labels[:, -3:] = 5
    for mask_region in [labels == 5]:
        red[mask_region] = np.random.uniform(0.15, 0.22, mask_region.sum())
        nir[mask_region] = np.random.uniform(0.20, 0.28, mask_region.sum())
        green[mask_region] = np.random.uniform(0.12, 0.18, mask_region.sum())

    # Disease: Blast (circular patches, brown)
    n_blast = int(disease_fraction * 0.6 * (size * size) / 200)
    for _ in range(n_blast):
        cx, cy = np.random.randint(15, size-15, 2)
        r = np.random.randint(4, 12)
        yy, xx = np.ogrid[-cx:size-cx, -cy:size-cy]
        mask = (xx**2 + yy**2 <= r**2) & (labels == 0)
        labels[mask] = 2
        red[mask] = np.random.uniform(0.18, 0.28, mask.sum())
        nir[mask] = np.random.uniform(0.15, 0.25, mask.sum())
        green[mask] = np.random.uniform(0.10, 0.16, mask.sum())

    # Disease: Blight (elongated streaks)
    n_blight = int(disease_fraction * 0.4 * (size * size) / 300)
    for _ in range(n_blight):
        cx = np.random.randint(10, size-10)
        cy = np.random.randint(10, size-10)
        length = np.random.randint(15, 35)
        width = np.random.randint(2, 5)
        angle = np.random.uniform(0, np.pi)
        for t in np.linspace(0, length, length*3):
            px = int(cx + t * np.cos(angle))
            py = int(cy + t * np.sin(angle))
            for dx in range(-width//2, width//2+1):
                for dy in range(-width//2, width//2+1):
                    nx, ny = px+dx, py+dy
                    if 0 <= nx < size and 0 <= ny < size and labels[nx, ny] == 0:
                        labels[nx, ny] = 3
                        red[nx, ny] = np.random.uniform(0.15, 0.22)
                        nir[nx, ny] = np.random.uniform(0.18, 0.28)
                        green[nx, ny] = np.random.uniform(0.12, 0.18)

    # Stress: general chlorosis (scattered, mild)
    stress_mask = (np.random.random((size, size)) < stress_fraction) & (labels == 0)
    labels[stress_mask] = 1
    red[stress_mask] = np.random.uniform(0.10, 0.16, stress_mask.sum())
    nir[stress_mask] = np.random.uniform(0.30, 0.40, stress_mask.sum())
    green[stress_mask] = np.random.uniform(0.14, 0.20, stress_mask.sum())

    return np.clip(red, 0, 1), np.clip(nir, 0, 1), np.clip(green, 0, 1), labels

# --- Vegetation Indices ---
def compute_ndvi(red, nir):
    return (nir - red) / (nir + red + 1e-10)

def compute_gndvi(green, nir):
    """Green NDVI — sensitive to chlorophyll concentration."""
    return (nir - green) / (nir + green + 1e-10)

def compute_evi(red, nir, blue=None):
    """Enhanced Vegetation Index — reduces atmospheric effects."""
    if blue is None:
        blue = red * 0.8  # approximate
    return 2.5 * (nir - red) / (nir + 6*red - 7.5*blue + 1 + 1e-10)

# --- Generate and analyze ---
red, nir, green, labels = generate_paddy_field(FIELD_SIZE, disease_fraction=0.15, stress_fraction=0.12)
ndvi = compute_ndvi(red, nir)
gndvi = compute_gndvi(green, nir)

# Class statistics
CLASS_NAMES = ['Healthy', 'Stressed', 'Blast', 'Blight', 'Water', 'Soil']
CLASS_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#dc2626', '#3b82f6', '#a0845c']

print("CROP HEALTH MONITOR — Field Analysis")
print("=" * 55)
print(f"Field size: {FIELD_SIZE}x{FIELD_SIZE} pixels")
print(f"\\n{'Class':<12} {'Pixels':>8} {'%':>7} {'NDVI mean':>10} {'NDVI std':>10}")
print("-" * 50)
for i, name in enumerate(CLASS_NAMES):
    mask = labels == i
    n = mask.sum()
    pct = n / labels.size * 100
    ndvi_mean = ndvi[mask].mean() if n > 0 else 0
    ndvi_std = ndvi[mask].std() if n > 0 else 0
    print(f"{name:<12} {n:>8} {pct:>6.1f}% {ndvi_mean:>10.3f} {ndvi_std:>10.3f}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Paddy Field Multispectral Analysis', color='white', fontsize=14, fontweight='bold')

# RGB composite
ax = axes[0, 0]; ax.set_facecolor('#111827')
rgb = np.stack([red*2, green*2, np.zeros_like(red)], axis=-1)
rgb = np.clip(rgb, 0, 1)
ax.imshow(rgb); ax.set_title('False Color (R-G)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# NIR band
ax = axes[0, 1]; ax.set_facecolor('#111827')
im = ax.imshow(nir, cmap='RdYlGn', vmin=0, vmax=0.6)
ax.set_title('NIR Band', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# NDVI
ax = axes[0, 2]; ax.set_facecolor('#111827')
im = ax.imshow(ndvi, cmap='RdYlGn', vmin=-0.2, vmax=0.9)
ax.set_title('NDVI', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# Ground truth labels
ax = axes[1, 0]; ax.set_facecolor('#111827')
label_rgb = np.zeros((*labels.shape, 3))
hex_to_rgb = lambda h: [int(h[i:i+2], 16)/255 for i in (1, 3, 5)]
for i, color in enumerate(CLASS_COLORS):
    mask = labels == i
    label_rgb[mask] = hex_to_rgb(color)
ax.imshow(label_rgb); ax.set_title('Ground Truth', color='white', fontsize=10)
ax.tick_params(colors='gray')

# NDVI histogram by class
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for i, (name, color) in enumerate(zip(CLASS_NAMES[:4], CLASS_COLORS[:4])):
    mask = labels == i
    if mask.sum() > 0:
        ax.hist(ndvi[mask].flatten(), bins=30, alpha=0.5, color=color,
                label=name, edgecolor='none', density=True)
ax.set_xlabel('NDVI', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('NDVI Distribution by Class', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# GNDVI
ax = axes[1, 2]; ax.set_facecolor('#111827')
im = ax.imshow(gndvi, cmap='RdYlGn', vmin=-0.2, vmax=0.7)
ax.set_title('GNDVI (Green NDVI)', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

plt.tight_layout()
plt.show()

print("\\nNDVI clearly separates healthy paddy from diseased regions.")
print("Blast patches show lowest NDVI (dead tissue). Blight shows moderate reduction.")
print("Next: build a classifier to automate this analysis.")`,
      challenge: 'Add a "moisture stress index" using NDVI temporal difference: generate two images (same field, one month apart) and compute delta-NDVI. Regions where NDVI dropped more than 0.15 are likely experiencing moisture stress.',
      successHint: 'Multispectral vegetation indices are the foundation of precision agriculture. NDVI transforms invisible spectral differences into a simple health score that any farmer can understand. The synthetic data captures the key spectral signatures of healthy and diseased paddy.',
    },
    {
      title: 'Image Classification: Thresholding and Feature-Based Segmentation',
      concept: `With NDVI computed, we need to classify each pixel into health categories. Two approaches:

**1. Threshold-based classification**: Set NDVI breakpoints: NDVI > 0.6 = healthy, 0.4-0.6 = stressed, 0.2-0.4 = diseased, < 0.2 = dead/water/soil. Simple, fast, interpretable. But it cannot distinguish blast from blight (both have NDVI 0.2-0.4).

**2. Multi-feature classification**: Use multiple indices (NDVI, GNDVI, EVI) plus texture features (local variance, edge density) as a feature vector for each pixel. Then apply a classifier (KNN or decision boundaries) to map feature vectors to disease types.

Texture features are crucial for distinguishing diseases. **Blast** creates circular patches with sharp boundaries — high local edge density. **Blight** creates elongated streaks — directional texture. **Stress** is spatially scattered — low spatial autocorrelation. These textural differences are invisible in a single-pixel NDVI value but become clear when you analyze the neighborhood.

We compute two texture features per pixel:
- **Local variance** (in a 5x5 window): high variance means the pixel is near a boundary between healthy and diseased tissue.
- **Directional gradient ratio**: the ratio of horizontal to vertical gradient magnitude. Blight streaks create strong directional gradients; blast patches are isotropic.`,
      analogy: 'Threshold classification is like sorting fruit by size only: all small fruit in one bin, all large in another. It works when categories differ mainly in size. Multi-feature classification is like a produce inspector who checks size, color, texture, and smell — multiple cues that together identify the exact variety and quality. Diseases that look similar in NDVI (same "size") are distinguished by texture (different "smell").',
      storyConnection: 'Bonti\'s dragonfly could distinguish different types of crop damage from the air — a brown circular spot (blast) looks different from a yellow streak (blight) even at altitude. The dragonfly is doing multi-feature visual classification. Our algorithm replicates this: NDVI gives the overall health score, but texture features distinguish the specific disease type.',
      checkQuestion: 'A paddy field has uniform NDVI of 0.45 everywhere. Threshold classification says "stressed." But the actual condition varies: some areas are young seedlings (healthy but immature) and others are nitrogen-deficient (truly stressed). How would you distinguish them?',
      checkAnswer: 'Temporal data (NDVI from last month) or spatial context (proximity to recently transplanted areas). Young seedlings will have been lower last month and are trending up; nitrogen-deficient areas were higher and are trending down. Alternatively, if you have multispectral data, the red edge position differs: nitrogen deficiency shifts the red edge to shorter wavelengths, while immature plants have a normally-positioned but lower-amplitude red edge. Single-date NDVI alone cannot distinguish them.',
      codeIntro: 'Implement threshold-based and multi-feature classification, compare their accuracy, and visualize the results.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Reuse field generation from Lesson 1 ---
SIZE = 128

def gen_field(size=128, df=0.15, sf=0.12):
    labels = np.zeros((size, size), dtype=int)
    red = np.random.uniform(0.05, 0.10, (size, size))
    nir = np.random.uniform(0.45, 0.55, (size, size))
    green = np.random.uniform(0.15, 0.25, (size, size))
    for i in range(0, size, 8):
        red[i:i+2, :] += 0.03; nir[i:i+2, :] -= 0.05; green[i:i+2, :] -= 0.03
    for i in [32, 64, 96]:
        w = np.random.randint(2, 4); labels[i:i+w, :] = 4
        red[i:i+w, :] = 0.04; nir[i:i+w, :] = 0.03; green[i:i+w, :] = 0.05
    labels[:3,:]=5; labels[-3:,:]=5; labels[:,:3]=5; labels[:,-3:]=5
    red[labels==5]=0.18; nir[labels==5]=0.24; green[labels==5]=0.15
    for _ in range(int(df*0.6*size**2/200)):
        cx,cy = np.random.randint(15,size-15,2); r=np.random.randint(4,12)
        yy,xx = np.ogrid[-cx:size-cx,-cy:size-cy]
        m = (xx**2+yy**2<=r**2)&(labels==0); labels[m]=2
        red[m]=np.random.uniform(0.18,0.28,m.sum())
        nir[m]=np.random.uniform(0.15,0.25,m.sum())
        green[m]=np.random.uniform(0.10,0.16,m.sum())
    for _ in range(int(df*0.4*size**2/300)):
        cx,cy = np.random.randint(10,size-10,2)
        ln=np.random.randint(15,35); wd=np.random.randint(2,5); ang=np.random.uniform(0,np.pi)
        for t in np.linspace(0,ln,ln*3):
            px,py=int(cx+t*np.cos(ang)),int(cy+t*np.sin(ang))
            for dx in range(-wd//2,wd//2+1):
                for dy in range(-wd//2,wd//2+1):
                    nx,ny=px+dx,py+dy
                    if 0<=nx<size and 0<=ny<size and labels[nx,ny]==0:
                        labels[nx,ny]=3; red[nx,ny]=0.18; nir[nx,ny]=0.22; green[nx,ny]=0.15
    sm=(np.random.random((size,size))<sf)&(labels==0); labels[sm]=1
    red[sm]=np.random.uniform(0.10,0.16,sm.sum())
    nir[sm]=np.random.uniform(0.30,0.40,sm.sum())
    green[sm]=np.random.uniform(0.14,0.20,sm.sum())
    return np.clip(red,0,1), np.clip(nir,0,1), np.clip(green,0,1), labels

red, nir, green, labels = gen_field(SIZE)
ndvi = (nir - red) / (nir + red + 1e-10)
gndvi = (nir - green) / (nir + green + 1e-10)

# --- Method 1: Threshold classification ---
def threshold_classify(ndvi):
    result = np.zeros_like(ndvi, dtype=int)
    result[ndvi >= 0.55] = 0  # healthy
    result[(ndvi >= 0.35) & (ndvi < 0.55)] = 1  # stressed
    result[(ndvi >= 0.10) & (ndvi < 0.35)] = 2  # diseased (generic)
    result[ndvi < 0.10] = 4  # water/soil
    return result

thresh_pred = threshold_classify(ndvi)

# --- Texture features ---
def local_variance(image, window=5):
    """Compute local variance in a sliding window."""
    pad = window // 2
    padded = np.pad(image, pad, mode='reflect')
    var_map = np.zeros_like(image)
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            patch = padded[i:i+window, j:j+window]
            var_map[i, j] = np.var(patch)
    return var_map

def gradient_ratio(image):
    """Ratio of horizontal to vertical gradient (detects directional patterns)."""
    gx = np.abs(np.diff(image, axis=1, prepend=image[:, :1]))
    gy = np.abs(np.diff(image, axis=0, prepend=image[:1, :]))
    return gx / (gy + 1e-10)

ndvi_var = local_variance(ndvi, window=5)
grad_ratio = gradient_ratio(ndvi)

# --- Method 2: Multi-feature KNN classification ---
# Build feature vectors for each pixel
features = np.stack([ndvi.ravel(), gndvi.ravel(),
                     ndvi_var.ravel(), grad_ratio.ravel()], axis=1)

# Simple training: sample labeled pixels as training data
n_train = 2000
train_idx = np.random.choice(SIZE*SIZE, n_train, replace=False)
X_train = features[train_idx]
y_train = labels.ravel()[train_idx]

# Standardize
mu = X_train.mean(axis=0); sig = X_train.std(axis=0) + 1e-10
X_train_n = (X_train - mu) / sig
X_all_n = (features - mu) / sig

# KNN predict (k=5) — use subset for speed
def knn_classify(X_train, y_train, X_test, k=5, batch_size=500):
    preds = np.zeros(len(X_test), dtype=int)
    for start in range(0, len(X_test), batch_size):
        end = min(start + batch_size, len(X_test))
        batch = X_test[start:end]
        for i, x in enumerate(batch):
            dists = np.sum((X_train - x)**2, axis=1)
            nn = np.argsort(dists)[:k]
            votes = {}
            for label in y_train[nn]:
                votes[label] = votes.get(label, 0) + 1
            preds[start + i] = max(votes, key=votes.get)
    return preds

# Classify all pixels
knn_pred = knn_classify(X_train_n, y_train, X_all_n, k=5).reshape(SIZE, SIZE)

# --- Accuracy comparison ---
CLASS_NAMES = ['Healthy', 'Stressed', 'Blast', 'Blight', 'Water', 'Soil']

# Threshold accuracy (note: threshold can only predict 0,1,2,4 — not 3 or 5)
thresh_acc = np.mean(thresh_pred.ravel() == labels.ravel())
knn_acc = np.mean(knn_pred.ravel() == labels.ravel())

# Per-class for KNN
print(f"Classification Accuracy:")
print(f"  Threshold (NDVI only): {thresh_acc:.1%}")
print(f"  KNN (4 features):     {knn_acc:.1%}")
print(f"\\nKNN per-class accuracy:")
for i, name in enumerate(CLASS_NAMES):
    mask = labels.ravel() == i
    if mask.sum() > 0:
        acc = np.mean(knn_pred.ravel()[mask] == i)
        print(f"  {name:<10}: {acc:.1%} ({mask.sum()} pixels)")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Crop Health Classification — Threshold vs Multi-Feature',
             color='white', fontsize=14, fontweight='bold')

hex_to_rgb = lambda h: [int(h[i:i+2],16)/255 for i in (1,3,5)]
COLORS = ['#22c55e','#f59e0b','#ef4444','#dc2626','#3b82f6','#a0845c']

def label_to_rgb(label_map):
    rgb = np.zeros((*label_map.shape, 3))
    for i, c in enumerate(COLORS):
        rgb[label_map == i] = hex_to_rgb(c)
    return rgb

# Ground truth
ax = axes[0,0]; ax.imshow(label_to_rgb(labels)); ax.set_title('Ground Truth', color='white', fontsize=10); ax.tick_params(colors='gray')
# Threshold
ax = axes[0,1]; ax.imshow(label_to_rgb(thresh_pred)); ax.set_title(f'Threshold ({thresh_acc:.0%})', color='white', fontsize=10); ax.tick_params(colors='gray')
# KNN
ax = axes[0,2]; ax.imshow(label_to_rgb(knn_pred)); ax.set_title(f'KNN 4-Feature ({knn_acc:.0%})', color='white', fontsize=10); ax.tick_params(colors='gray')

# Texture features
ax = axes[1,0]; ax.set_facecolor('#111827')
im = ax.imshow(ndvi_var, cmap='hot', vmin=0); ax.set_title('Local NDVI Variance', color='white', fontsize=10)
ax.tick_params(colors='gray'); plt.colorbar(im, ax=ax, fraction=0.046)

ax = axes[1,1]; ax.set_facecolor('#111827')
im = ax.imshow(np.clip(grad_ratio, 0, 3), cmap='coolwarm'); ax.set_title('Gradient Ratio (directional)', color='white', fontsize=10)
ax.tick_params(colors='gray'); plt.colorbar(im, ax=ax, fraction=0.046)

# Error map
ax = axes[1,2]; ax.set_facecolor('#111827')
errors = (knn_pred != labels).astype(float)
ax.imshow(errors, cmap='Reds', vmin=0, vmax=1); ax.set_title('KNN Error Map (red=wrong)', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("\\nTexture features enable blast/blight distinction that NDVI alone cannot make.")
print("Local variance highlights disease boundaries; gradient ratio detects streak patterns.")`,
      challenge: 'Implement a "disease boundary detector": apply a Sobel edge filter to the KNN classification map to find the boundaries of diseased regions. Compute the total boundary perimeter and average patch size for each disease type.',
      successHint: 'Multi-feature classification dramatically outperforms simple thresholding because diseases differ in texture, not just spectral values. This is a general principle in remote sensing: spatial features complement spectral features.',
    },
    {
      title: 'Spatial Analysis: Disease Mapping and Clustering',
      concept: `Individual pixel classification is only the first step. For actionable agricultural intelligence, we need spatial analysis: grouping classified pixels into **patches** (connected regions of disease), measuring their **size and shape**, tracking their **spatial distribution**, and estimating **spread risk**.

We implement **connected component labeling** — an algorithm that identifies contiguous regions of the same class. Two pixels belong to the same component if they share an edge (4-connectivity) or edge/corner (8-connectivity) and have the same label.

The algorithm (two-pass):
1. **First pass**: scan left-to-right, top-to-bottom. Assign a label to each disease pixel: same as left/above neighbor if they match, or new label if not. When two labels are found to be equivalent (connected through a path), record the equivalence.
2. **Second pass**: resolve all equivalences and relabel.

For each patch, we compute:
- **Area**: number of pixels (proportional to physical area if pixel size is known).
- **Centroid**: center of mass (average x, y coordinates).
- **Bounding box**: smallest rectangle containing the patch.
- **Compactness**: 4*pi*area/perimeter^2 — circles have compactness 1, elongated shapes have lower values. Blast patches (circular) have high compactness; blight streaks have low compactness.

This spatial analysis transforms a pixel map into a disease report: "3 blast patches averaging 45 sq meters, largest in northeast quadrant; 2 blight streaks along rows 40-50, trending southwest."`,
      analogy: 'Connected component labeling is like identifying islands on a map. Individual pixels are like individual grid cells. A connected component is an island — a contiguous land mass. Measuring the island\'s area, shape, and position is spatial analysis. The disease map is our ocean; healthy paddy is water; diseased patches are the islands we need to catalog.',
      storyConnection: 'When Bonti\'s dragonfly flew over the fields, it did not just see "some brown pixels" — it perceived patches: "a large circular brown spot near the irrigation channel, two thin streaks running north-south along the third row." That is spatial analysis. Our connected component algorithm replicates this perceptual grouping computationally.',
      checkQuestion: 'A field has 100 diseased pixels scattered uniformly (one every 10 pixels in each direction) versus 100 diseased pixels in a single cluster. The total disease count is the same. Which is more concerning for the farmer, and why?',
      checkAnswer: 'The cluster is more concerning because it indicates an active disease front that is spreading locally — neighboring plants are infecting each other. Scattered disease could be random stress (nutrient deficiency, individual pest damage) with no contagion. A cluster suggests the disease will continue to expand exponentially. The spatial pattern (clustered vs scattered) contains information that total counts miss.',
      codeIntro: 'Implement connected component labeling, compute patch statistics, and generate a spatial disease report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
SIZE = 128

# --- Generate field (compact version) ---
def gen_field(size=128):
    labels = np.zeros((size,size),dtype=int)
    red=np.random.uniform(0.05,0.10,(size,size))
    nir=np.random.uniform(0.45,0.55,(size,size))
    green=np.random.uniform(0.15,0.25,(size,size))
    for i in [32,64,96]:
        w=3; labels[i:i+w,:]=4; red[i:i+w,:]=0.04; nir[i:i+w,:]=0.03
    labels[:3,:]=5; labels[-3:,:]=5; labels[:,:3]=5; labels[:,-3:]=5
    red[labels==5]=0.18; nir[labels==5]=0.24
    for _ in range(8):
        cx,cy=np.random.randint(15,size-15,2); r=np.random.randint(5,12)
        yy,xx=np.ogrid[-cx:size-cx,-cy:size-cy]
        m=(xx**2+yy**2<=r**2)&(labels==0); labels[m]=2
        red[m]=0.22; nir[m]=0.20
    for _ in range(5):
        cx,cy=np.random.randint(10,size-10,2)
        ln=np.random.randint(15,30); wd=3; ang=np.random.uniform(0,np.pi)
        for t in np.linspace(0,ln,ln*3):
            px,py=int(cx+t*np.cos(ang)),int(cy+t*np.sin(ang))
            for dx in range(-1,2):
                for dy in range(-1,2):
                    nx,ny=px+dx,py+dy
                    if 0<=nx<size and 0<=ny<size and labels[nx,ny]==0:
                        labels[nx,ny]=3; red[nx,ny]=0.18; nir[nx,ny]=0.22
    sm=(np.random.random((size,size))<0.10)&(labels==0); labels[sm]=1
    return np.clip(red,0,1),np.clip(nir,0,1),np.clip(green,0,1),labels

red, nir, green, labels = gen_field(SIZE)

# --- Connected Component Labeling ---
def find_connected_components(binary_map, connectivity=8):
    """Label connected components in a binary map using two-pass algorithm."""
    rows, cols = binary_map.shape
    labeled = np.zeros_like(binary_map, dtype=int)
    next_label = 1
    equivalences = {}  # label -> root label

    def find_root(label):
        while equivalences.get(label, label) != label:
            label = equivalences[label]
        return label

    def union(a, b):
        ra, rb = find_root(a), find_root(b)
        if ra != rb:
            equivalences[max(ra, rb)] = min(ra, rb)

    # Neighbor offsets
    if connectivity == 8:
        offsets = [(-1,-1),(-1,0),(-1,1),(0,-1)]
    else:
        offsets = [(-1,0),(0,-1)]

    # First pass
    for i in range(rows):
        for j in range(cols):
            if binary_map[i, j] == 0:
                continue
            neighbors = []
            for di, dj in offsets:
                ni, nj = i+di, j+dj
                if 0 <= ni < rows and 0 <= nj < cols and labeled[ni, nj] > 0:
                    neighbors.append(labeled[ni, nj])
            if not neighbors:
                labeled[i, j] = next_label
                equivalences[next_label] = next_label
                next_label += 1
            else:
                min_label = min(find_root(n) for n in neighbors)
                labeled[i, j] = min_label
                for n in neighbors:
                    union(n, min_label)

    # Second pass: resolve equivalences
    for i in range(rows):
        for j in range(cols):
            if labeled[i, j] > 0:
                labeled[i, j] = find_root(labeled[i, j])

    # Renumber consecutively
    unique = np.unique(labeled[labeled > 0])
    remap = {old: new+1 for new, old in enumerate(unique)}
    for i in range(rows):
        for j in range(cols):
            if labeled[i, j] > 0:
                labeled[i, j] = remap[labeled[i, j]]

    return labeled

# --- Analyze disease patches ---
def analyze_patches(labels, class_id, class_name):
    """Find and characterize connected components for a disease class."""
    binary = (labels == class_id).astype(int)
    components = find_connected_components(binary)
    n_components = components.max()

    patches = []
    for comp_id in range(1, n_components + 1):
        mask = components == comp_id
        area = mask.sum()
        if area < 3:  # skip tiny noise
            continue
        ys, xs = np.where(mask)
        centroid = (ys.mean(), xs.mean())
        bbox = (ys.min(), xs.min(), ys.max(), xs.max())

        # Compactness = 4*pi*area / perimeter^2
        # Perimeter: count boundary pixels (pixels with at least one non-mask neighbor)
        perim = 0
        for y, x in zip(ys, xs):
            for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
                ny, nx = y+dy, x+dx
                if ny < 0 or ny >= labels.shape[0] or nx < 0 or nx >= labels.shape[1] or not mask[ny, nx]:
                    perim += 1
        compactness = 4 * np.pi * area / (perim**2 + 1e-10)

        patches.append({
            'id': comp_id, 'area': area, 'centroid': centroid,
            'bbox': bbox, 'perimeter': perim, 'compactness': compactness,
            'class': class_name
        })

    return patches, components

blast_patches, blast_comp = analyze_patches(labels, 2, 'Blast')
blight_patches, blight_comp = analyze_patches(labels, 3, 'Blight')

all_patches = blast_patches + blight_patches

print("DISEASE PATCH ANALYSIS")
print("=" * 65)
print(f"Blast patches:  {len(blast_patches)}")
print(f"Blight patches: {len(blight_patches)}")
print(f"\\n{'Type':<8} {'ID':>3} {'Area':>6} {'Perim':>6} {'Compact':>8} {'Centroid'}")
print("-" * 60)
for p in sorted(all_patches, key=lambda x: -x['area'])[:12]:
    print(f"{p['class']:<8} {p['id']:>3} {p['area']:>6} {p['perimeter']:>6} "
          f"{p['compactness']:>8.3f} ({p['centroid'][0]:.0f}, {p['centroid'][1]:.0f})")

print(f"\\nBlast avg compactness: {np.mean([p['compactness'] for p in blast_patches]):.3f} (circular)")
print(f"Blight avg compactness: {np.mean([p['compactness'] for p in blight_patches]):.3f} (elongated)")

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spatial Disease Analysis — Connected Components',
             color='white', fontsize=14, fontweight='bold')

# Disease map with patch boundaries
ax = axes[0, 0]; ax.set_facecolor('#111827')
hex_to_rgb = lambda h: [int(h[i:i+2],16)/255 for i in (1,3,5)]
COLORS = ['#22c55e','#f59e0b','#ef4444','#dc2626','#3b82f6','#a0845c']
lrgb = np.zeros((*labels.shape,3))
for i,c in enumerate(COLORS): lrgb[labels==i]=hex_to_rgb(c)
ax.imshow(lrgb)
# Draw bounding boxes
for p in all_patches:
    y0,x0,y1,x1 = p['bbox']
    color = '#ef4444' if p['class']=='Blast' else '#f59e0b'
    rect = plt.Rectangle((x0-0.5,y0-0.5),x1-x0+1,y1-y0+1,
                         linewidth=1.5, edgecolor=color, facecolor='none')
    ax.add_patch(rect)
    ax.text(x0, y0-2, f"{p['class'][0]}{p['id']}", color=color, fontsize=6)
ax.set_title('Disease Patches with Bounding Boxes', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Compactness distribution
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
if blast_patches:
    ax.hist([p['compactness'] for p in blast_patches], bins=10, alpha=0.7,
            color='#ef4444', label=f'Blast (n={len(blast_patches)})', edgecolor='none')
if blight_patches:
    ax.hist([p['compactness'] for p in blight_patches], bins=10, alpha=0.7,
            color='#f59e0b', label=f'Blight (n={len(blight_patches)})', edgecolor='none')
ax.set_xlabel('Compactness (1=circle, 0=elongated)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Compactness Separates Blast from Blight', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Area distribution
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
areas = [p['area'] for p in all_patches]
types = [p['class'] for p in all_patches]
blast_a = [a for a, t in zip(areas, types) if t == 'Blast']
blight_a = [a for a, t in zip(areas, types) if t == 'Blight']
ax.scatter(range(len(blast_a)), sorted(blast_a, reverse=True),
           color='#ef4444', s=50, label='Blast')
ax.scatter(range(len(blight_a)), sorted(blight_a, reverse=True),
           color='#f59e0b', s=50, label='Blight')
ax.set_xlabel('Patch rank', color='white')
ax.set_ylabel('Area (pixels)', color='white')
ax.set_title('Patch Size Distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Spatial density map
ax = axes[1, 1]; ax.set_facecolor('#111827')
density = np.zeros((SIZE, SIZE))
for p in all_patches:
    cy, cx = p['centroid']
    r = int(np.sqrt(p['area'] / np.pi)) + 5
    yy, xx = np.ogrid[max(0,int(cy)-r):min(SIZE,int(cy)+r),
                       max(0,int(cx)-r):min(SIZE,int(cx)+r)]
    dist = np.sqrt((yy-cy)**2 + (xx-cx)**2)
    mask_d = dist < r
    density[max(0,int(cy)-r):min(SIZE,int(cy)+r),
            max(0,int(cx)-r):min(SIZE,int(cx)+r)] += mask_d * p['area']

im = ax.imshow(density, cmap='hot', interpolation='bilinear')
ax.set_title('Disease Density Heatmap', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

plt.tight_layout()
plt.show()

print("\\nCompactness distinguishes disease types: blast ~ 0.5+ (circular), blight ~ 0.1-0.3 (streaks)")
print("The density heatmap shows disease hotspots for targeted treatment.")`,
      challenge: 'Implement a "spread risk" model: for each disease patch, compute the distance to the nearest healthy paddy edge. Patches closer to healthy tissue have higher spread risk. Generate a risk-ranked list of patches requiring immediate treatment.',
      successHint: 'Spatial analysis transforms pixel-level classification into field-level intelligence. Connected components, patch characterization, and density mapping are the same techniques used in medical imaging (tumor detection), ecology (habitat mapping), and urban planning (land use classification).',
    },
    {
      title: 'Temporal Analysis: Multi-Date Change Detection',
      concept: `A single image is a snapshot. Real crop monitoring requires **temporal analysis**: comparing images over time to detect changes. Is disease spreading? Is treatment working? Is the crop recovering?

We implement **change detection** — comparing two images of the same field taken at different times:

**1. NDVI difference**: Simply subtract NDVI_date2 - NDVI_date1. Negative values indicate deterioration; positive values indicate recovery.

**2. Change classification**: Threshold the difference into categories: significant improvement (> +0.15), minor improvement (+0.05 to +0.15), stable (-0.05 to +0.05), minor deterioration (-0.15 to -0.05), significant deterioration (< -0.15).

**3. Trend analysis**: With 3+ dates, fit a linear trend to each pixel's NDVI history. The slope indicates the rate of change: positive slope = improving, negative slope = worsening, near-zero = stable.

**4. Anomaly detection**: Compare current NDVI to the historical mean at this growth stage. Pixels more than 2 standard deviations below the mean are anomalies — potentially new disease outbreaks.

This temporal dimension is what makes precision agriculture actionable. A farmer does not just need to know "where is the disease" but "where is the disease spreading" and "where is treatment working." Change detection answers both.`,
      analogy: 'Temporal analysis is like a doctor tracking a patient\'s blood pressure over months. A single reading of 135/85 is mildly concerning. But if the trend shows it was 120/80 six months ago and rising steadily, that is much more alarming — the trajectory matters more than the snapshot. Similarly, an NDVI of 0.4 could be a healthy field getting sick or a sick field recovering. Only the temporal context tells you which.',
      storyConnection: 'Bonti\'s dragonfly did not visit the fields just once — it patrolled regularly, noting which brown spots were growing, which were shrinking, and which were new. This repeated observation is exactly temporal monitoring. Our change detection algorithm formalizes the dragonfly\'s pattern: compare today\'s field to last week\'s and quantify every change.',
      checkQuestion: 'A region shows NDVI improvement from 0.30 to 0.45 between two dates. Can you conclude the treatment worked?',
      checkAnswer: 'Not necessarily. The improvement might be due to: (1) natural recovery (some diseases are self-limiting), (2) rainfall after drought (nothing to do with treatment), (3) crop growth stage progression (young plants naturally increase NDVI), or (4) the treatment actually working. To attribute causation, you need a control area: nearby untreated fields with the same initial conditions. If treated areas improved and controls did not, the treatment likely worked. Correlation (NDVI went up after treatment) does not prove causation.',
      codeIntro: 'Simulate multi-date field imagery, implement change detection, trend analysis, and anomaly detection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
SIZE = 100  # slightly smaller for speed

def gen_field_simple(size, disease_pct=0.10, disease_centers=None):
    """Generate a field with controllable disease locations."""
    ndvi = np.random.uniform(0.60, 0.80, (size, size))  # healthy base
    labels = np.zeros((size, size), dtype=int)

    # Add disease at specified centers (or random)
    if disease_centers is None:
        n_patches = max(1, int(disease_pct * size**2 / 150))
        disease_centers = [(np.random.randint(15, size-15),
                           np.random.randint(15, size-15),
                           np.random.randint(5, 12)) for _ in range(n_patches)]

    for cy, cx, r in disease_centers:
        yy, xx = np.ogrid[-cy:size-cy, -cx:size-cx]
        mask = (xx**2 + yy**2 <= r**2)
        labels[mask] = 1
        ndvi[mask] = np.random.uniform(0.15, 0.35, mask.sum())

    # Stressed buffer around disease
    from scipy.ndimage import binary_dilation
    try:
        stressed = binary_dilation(labels > 0, iterations=3) & (labels == 0)
    except:
        # Manual dilation if scipy unavailable
        stressed = np.zeros_like(labels, dtype=bool)
        for i in range(size):
            for j in range(size):
                if labels[i, j] == 0:
                    for di in range(-3, 4):
                        for dj in range(-3, 4):
                            ni, nj = i+di, j+dj
                            if 0<=ni<size and 0<=nj<size and labels[ni, nj] > 0:
                                stressed[i, j] = True
                                break
                        if stressed[i, j]: break
    ndvi[stressed] = np.random.uniform(0.40, 0.55, stressed.sum())

    return ndvi + np.random.normal(0, 0.02, (size, size))

# --- Simulate 4 dates with evolving disease ---
# Disease starts small and spreads
centers_t0 = [(40, 30, 5), (70, 80, 4)]  # initial outbreak

dates = ['Week 1', 'Week 3', 'Week 5', 'Week 7']
fields = []

for t, date in enumerate(dates):
    # Disease grows over time
    evolved_centers = [(cy, cx, min(r + t*2, r+8)) for cy, cx, r in centers_t0]
    # New outbreaks at later dates
    if t >= 2:
        evolved_centers.append((25, 60, 3 + (t-2)*2))
    if t >= 3:
        evolved_centers.append((85, 40, 3))

    ndvi = gen_field_simple(SIZE, disease_centers=evolved_centers)
    ndvi = np.clip(ndvi, 0, 1)
    fields.append(ndvi)

# --- Change Detection ---
def compute_change(ndvi_before, ndvi_after):
    """Compute NDVI change and classify."""
    diff = ndvi_after - ndvi_before
    change_class = np.zeros_like(diff, dtype=int)
    change_class[diff > 0.15] = 2   # strong improvement
    change_class[(diff > 0.05) & (diff <= 0.15)] = 1   # mild improvement
    change_class[(diff >= -0.05) & (diff <= 0.05)] = 0  # stable
    change_class[(diff >= -0.15) & (diff < -0.05)] = -1  # mild deterioration
    change_class[diff < -0.15] = -2  # strong deterioration
    return diff, change_class

# --- Trend Analysis (linear fit per pixel) ---
def compute_trends(field_series):
    """Fit linear trend to each pixel across dates."""
    n_dates = len(field_series)
    slopes = np.zeros_like(field_series[0])
    t = np.arange(n_dates)

    for i in range(field_series[0].shape[0]):
        for j in range(field_series[0].shape[1]):
            values = [f[i, j] for f in field_series]
            # Linear regression: slope = cov(t, v) / var(t)
            mean_t = t.mean()
            mean_v = np.mean(values)
            slope = np.sum((t - mean_t) * (np.array(values) - mean_v)) / (np.sum((t - mean_t)**2) + 1e-10)
            slopes[i, j] = slope
    return slopes

# --- Anomaly detection ---
def detect_anomalies(current_ndvi, historical_mean, historical_std, threshold=2.0):
    """Flag pixels with NDVI significantly below historical average."""
    z_score = (current_ndvi - historical_mean) / (historical_std + 1e-10)
    anomalies = z_score < -threshold
    return anomalies, z_score

# Compute analyses
diff_01, change_01 = compute_change(fields[0], fields[1])
diff_02, change_02 = compute_change(fields[0], fields[2])
diff_03, change_03 = compute_change(fields[0], fields[3])

trends = compute_trends(fields)
hist_mean = np.mean(fields[:3], axis=0)
hist_std = np.std(fields[:3], axis=0)
anomalies, z_scores = detect_anomalies(fields[-1], hist_mean, hist_std)

# --- Visualization ---
fig, axes = plt.subplots(2, 4, figsize=(18, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Temporal Crop Health Analysis — 4-Week Monitoring',
             color='white', fontsize=14, fontweight='bold')

# Top row: NDVI at each date
for t, (ndvi, date) in enumerate(zip(fields, dates)):
    ax = axes[0, t]; ax.set_facecolor('#111827')
    im = ax.imshow(ndvi, cmap='RdYlGn', vmin=0, vmax=0.9)
    ax.set_title(date, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    # Mean NDVI
    ax.text(5, SIZE-8, f'Mean: {ndvi.mean():.2f}', color='white', fontsize=8,
            bbox=dict(facecolor='black', alpha=0.5))

# Bottom row: change maps and trend
cmap_change = plt.cm.RdBu
ax = axes[1, 0]; ax.set_facecolor('#111827')
im = ax.imshow(diff_01, cmap='RdBu', vmin=-0.4, vmax=0.4)
ax.set_title('Change: W1->W3', color='white', fontsize=10); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

ax = axes[1, 1]; ax.set_facecolor('#111827')
im = ax.imshow(diff_03, cmap='RdBu', vmin=-0.4, vmax=0.4)
ax.set_title('Change: W1->W7', color='white', fontsize=10); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

ax = axes[1, 2]; ax.set_facecolor('#111827')
im = ax.imshow(trends, cmap='RdBu', vmin=-0.05, vmax=0.05)
ax.set_title('NDVI Trend (slope/week)', color='white', fontsize=10); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

ax = axes[1, 3]; ax.set_facecolor('#111827')
anomaly_display = np.zeros((*anomalies.shape, 3))
anomaly_display[:,:,1] = fields[-1]  # green = current NDVI
anomaly_display[anomalies, 0] = 1.0   # red overlay = anomaly
anomaly_display[anomalies, 1] = 0
ax.imshow(anomaly_display)
ax.set_title(f'Anomalies ({anomalies.sum()} pixels)', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Report
total_px = SIZE * SIZE
deteriorated = np.sum(diff_03 < -0.15)
print(f"\\n4-Week Change Report:")
print(f"  Mean NDVI: {fields[0].mean():.2f} -> {fields[-1].mean():.2f} (delta: {fields[-1].mean()-fields[0].mean():.3f})")
print(f"  Pixels deteriorated (>0.15 drop): {deteriorated} ({deteriorated/total_px*100:.1f}%)")
print(f"  Anomaly pixels (last date): {anomalies.sum()} ({anomalies.sum()/total_px*100:.1f}%)")
print(f"  Negative trend pixels: {np.sum(trends < -0.02)} ({np.sum(trends < -0.02)/total_px*100:.1f}%)")`,
      challenge: 'Add a "treatment simulation": at Week 3, apply treatment to the largest disease patch (set its NDVI trend to positive). Regenerate Weeks 5 and 7 with the treatment effect. Show that the treated patch improves while untreated patches continue to worsen.',
      successHint: 'Temporal analysis is what separates surveillance from monitoring. A single image tells you where disease IS. Multiple images tell you where disease is GOING. The trend slope and anomaly detection provide early warning for emerging outbreaks before they become visible in raw NDVI.',
    },
    {
      title: 'Deployment: Complete Crop Health Monitor',
      concept: `The final step is packaging everything into a clean, deployable system. An agricultural extension officer should be able to upload field imagery, get an automated health report, and receive treatment recommendations.

Our deployed system includes:
- **Clean API**: \`monitor.analyze(image)\` returns health classification, patch analysis, and recommendations.
- **Multi-date support**: \`monitor.track(images, dates)\` provides temporal analysis and trend reports.
- **Treatment recommendations**: based on disease type, severity, and spatial extent, recommend specific interventions.
- **Report generation**: summary statistics, disease maps, priority areas, and estimated yield impact.
- **Known limitations**: synthetic data only (real system needs calibrated multispectral imagery), no atmospheric correction, simplified disease taxonomy, no soil-type adjustment.

This is a portfolio-ready precision agriculture system demonstrating remote sensing, image classification, spatial analysis, and temporal monitoring.`,
      analogy: 'Deploying the crop monitor is like opening a diagnostic clinic. The equipment (algorithms) is tested, the protocols (pipeline) are established, and the staff (API) is trained. Opening day means real patients (fields) with real conditions, and the system must deliver accurate, actionable, timely results. Documentation, limitations, and confidence intervals are as important as the diagnosis itself.',
      storyConnection: 'Bonti dreamed of a dragonfly that could monitor every paddy field in the Brahmaputra Valley. Our deployed Crop Health Monitor is that dream realized: a system that takes drone or satellite imagery and automatically produces the health reports that farmers need. It scales Bonti\'s dragonfly vision from one field to an entire agricultural region.',
      checkQuestion: 'The system reports "blast detected, 12% of field affected, recommend fungicide application." But the farmer cannot afford fungicide for the whole field. What should the system recommend instead?',
      checkAnswer: 'Targeted application: the system should provide a precise disease map showing exactly which patches need treatment, along with the total area (not percentage of the whole field). If 12% of 1 hectare is affected, that is 1200 sq meters. The system should also prioritize patches by spread risk (largest, most compact, nearest to healthy tissue) so the farmer treats the highest-risk areas first with limited resources. Precision agriculture means precision recommendations, not one-size-fits-all advice.',
      codeIntro: 'Build the final polished Crop Health Monitor with a clean API, treatment recommendations, and comprehensive demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ================================================================
# CROP HEALTH MONITOR — Final Polished Version
# ================================================================
# A complete image analysis pipeline for detecting crop disease
# from multispectral drone/satellite imagery.
#
# Based on: NDVI, multi-feature classification, connected
#           component analysis, temporal change detection
#
# Limitations:
#   - Synthetic data (needs real calibrated imagery)
#   - No atmospheric correction
#   - Simplified disease taxonomy (3 categories)
#   - No soil-type adjustment
# ================================================================

class CropHealthMonitor:
    """Analyze paddy field health from multispectral imagery.

    Usage:
        monitor = CropHealthMonitor()
        report = monitor.analyze(red_band, nir_band, green_band)
    """

    HEALTH_CLASSES = {
        0: {'name': 'Healthy', 'color': '#22c55e', 'action': 'None needed'},
        1: {'name': 'Stressed', 'color': '#f59e0b', 'action': 'Monitor closely, check irrigation'},
        2: {'name': 'Blast', 'color': '#ef4444', 'action': 'Apply tricyclazole fungicide to affected area'},
        3: {'name': 'Blight', 'color': '#dc2626', 'action': 'Apply streptomycin + copper hydroxide'},
        4: {'name': 'Water', 'color': '#3b82f6', 'action': 'N/A'},
        5: {'name': 'Soil', 'color': '#a0845c', 'action': 'N/A'},
    }

    NDVI_THRESHOLDS = {'healthy': 0.55, 'stressed': 0.35, 'diseased': 0.10}

    def __init__(self, pixel_size_m=0.5):
        self.pixel_size = pixel_size_m  # meters per pixel

    def _compute_indices(self, red, nir, green=None):
        ndvi = (nir - red) / (nir + red + 1e-10)
        result = {'ndvi': ndvi}
        if green is not None:
            result['gndvi'] = (nir - green) / (nir + green + 1e-10)
        return result

    def _classify(self, ndvi):
        """Threshold-based classification."""
        classes = np.zeros_like(ndvi, dtype=int)
        classes[ndvi >= self.NDVI_THRESHOLDS['healthy']] = 0
        classes[(ndvi >= self.NDVI_THRESHOLDS['stressed']) &
                (ndvi < self.NDVI_THRESHOLDS['healthy'])] = 1
        classes[(ndvi >= self.NDVI_THRESHOLDS['diseased']) &
                (ndvi < self.NDVI_THRESHOLDS['stressed'])] = 2  # generic disease
        classes[ndvi < self.NDVI_THRESHOLDS['diseased']] = 4
        return classes

    def _find_patches(self, labels, class_id):
        """Simple connected component analysis."""
        binary = (labels == class_id).astype(int)
        size = binary.shape[0]
        labeled = np.zeros_like(binary, dtype=int)
        next_label = 1
        equiv = {}

        def root(l):
            while equiv.get(l, l) != l: l = equiv[l]
            return l

        for i in range(size):
            for j in range(binary.shape[1]):
                if binary[i, j] == 0: continue
                nbrs = []
                if i > 0 and labeled[i-1, j] > 0: nbrs.append(labeled[i-1, j])
                if j > 0 and labeled[i, j-1] > 0: nbrs.append(labeled[i, j-1])
                if not nbrs:
                    labeled[i, j] = next_label
                    equiv[next_label] = next_label
                    next_label += 1
                else:
                    mn = min(root(n) for n in nbrs)
                    labeled[i, j] = mn
                    for n in nbrs:
                        rn = root(n)
                        if rn != mn: equiv[max(rn, mn)] = min(rn, mn)

        for i in range(size):
            for j in range(binary.shape[1]):
                if labeled[i, j] > 0:
                    labeled[i, j] = root(labeled[i, j])

        patches = []
        for lid in np.unique(labeled):
            if lid == 0: continue
            mask = labeled == lid
            area = mask.sum()
            if area < 5: continue
            ys, xs = np.where(mask)
            patches.append({
                'area_px': area,
                'area_m2': area * self.pixel_size**2,
                'centroid': (float(ys.mean()), float(xs.mean())),
                'bbox': (int(ys.min()), int(xs.min()), int(ys.max()), int(xs.max())),
            })
        return patches

    def analyze(self, red, nir, green=None):
        """Analyze a single multispectral image."""
        indices = self._compute_indices(red, nir, green)
        ndvi = indices['ndvi']
        classes = self._classify(ndvi)

        # Patch analysis for diseases
        disease_patches = self._find_patches(classes, 2)

        # Summary statistics
        total = classes.size
        field_area = total * self.pixel_size**2

        summary = {}
        for cid, info in self.HEALTH_CLASSES.items():
            count = (classes == cid).sum()
            summary[info['name']] = {
                'pixels': int(count),
                'percent': float(count / total * 100),
                'area_m2': float(count * self.pixel_size**2),
                'mean_ndvi': float(ndvi[classes == cid].mean()) if count > 0 else 0,
            }

        # Generate recommendations
        recommendations = []
        disease_pct = summary.get('Blast', {}).get('percent', 0) + summary.get('Stressed', {}).get('percent', 0)
        if disease_pct > 20:
            recommendations.append("URGENT: >20% of field affected. Immediate treatment required.")
        elif disease_pct > 10:
            recommendations.append("WARNING: 10-20% affected. Schedule treatment within 1 week.")
        elif disease_pct > 5:
            recommendations.append("CAUTION: 5-10% affected. Monitor daily, prepare treatment.")
        else:
            recommendations.append("Field is largely healthy. Continue routine monitoring.")

        if disease_patches:
            largest = max(disease_patches, key=lambda p: p['area_px'])
            recommendations.append(
                f"Largest disease patch: {largest['area_m2']:.0f} m2 "
                f"at position ({largest['centroid'][0]:.0f}, {largest['centroid'][1]:.0f}). "
                f"Prioritize treatment here."
            )

        return {
            'ndvi': ndvi,
            'classification': classes,
            'summary': summary,
            'disease_patches': disease_patches,
            'recommendations': recommendations,
            'field_area_m2': field_area,
            'mean_ndvi': float(ndvi.mean()),
        }

# ================================================================
# DEMONSTRATION
# ================================================================
monitor = CropHealthMonitor(pixel_size_m=0.5)

# Generate test field
SIZE = 120
np.random.seed(42)
red = np.random.uniform(0.05, 0.10, (SIZE, SIZE))
nir = np.random.uniform(0.45, 0.55, (SIZE, SIZE))
green = np.random.uniform(0.15, 0.25, (SIZE, SIZE))

# Add disease patches
for cy, cx, r in [(35, 40, 10), (80, 90, 8), (60, 20, 6), (25, 80, 5)]:
    yy, xx = np.ogrid[-cy:SIZE-cy, -cx:SIZE-cx]
    mask = (xx**2+yy**2<=r**2)
    red[mask]=np.random.uniform(0.18,0.25,mask.sum())
    nir[mask]=np.random.uniform(0.15,0.25,mask.sum())

# Stress ring around disease
for cy, cx, r in [(35, 40, 15), (80, 90, 13)]:
    yy, xx = np.ogrid[-cy:SIZE-cy, -cx:SIZE-cx]
    ring = (xx**2+yy**2<=r**2)&(xx**2+yy**2>(r-4)**2)
    nir[ring] = np.random.uniform(0.30, 0.40, ring.sum())

# Analyze
report = monitor.analyze(red, nir, green)

print("CROP HEALTH MONITOR — Field Report")
print("=" * 65)
print(f"Field area: {report['field_area_m2']:.0f} m2 ({report['field_area_m2']/10000:.2f} ha)")
print(f"Mean NDVI: {report['mean_ndvi']:.3f}")
print(f"Disease patches found: {len(report['disease_patches'])}")

print(f"\\n{'Class':<12} {'Pixels':>8} {'%':>7} {'Area (m2)':>10} {'NDVI':>7}")
print("-" * 48)
for name, stats in report['summary'].items():
    if stats['pixels'] > 0:
        print(f"{name:<12} {stats['pixels']:>8} {stats['percent']:>6.1f}% "
              f"{stats['area_m2']:>10.0f} {stats['mean_ndvi']:>7.3f}")

print(f"\\nRecommendations:")
for rec in report['recommendations']:
    print(f"  {rec}")

# --- Final showcase ---
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Crop Health Monitor — Final Showcase', color='white', fontsize=16, fontweight='bold')

# NDVI map
ax = axes[0, 0]; ax.set_facecolor('#111827')
im = ax.imshow(report['ndvi'], cmap='RdYlGn', vmin=0, vmax=0.9)
ax.set_title(f'NDVI Map (mean={report["mean_ndvi"]:.2f})', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# Classification map
ax = axes[0, 1]; ax.set_facecolor('#111827')
hex_to_rgb = lambda h: [int(h[i:i+2],16)/255 for i in (1,3,5)]
cls_rgb = np.zeros((*report['classification'].shape, 3))
for cid, info in monitor.HEALTH_CLASSES.items():
    cls_rgb[report['classification'] == cid] = hex_to_rgb(info['color'])
ax.imshow(cls_rgb)
# Draw patch bounding boxes
for p in report['disease_patches']:
    y0,x0,y1,x1 = p['bbox']
    rect = plt.Rectangle((x0-0.5,y0-0.5),x1-x0+1,y1-y0+1,
                         linewidth=2, edgecolor='white', facecolor='none')
    ax.add_patch(rect)
    ax.text(x0, y0-3, f'{p["area_m2"]:.0f}m2', color='white', fontsize=7,
            bbox=dict(facecolor='black', alpha=0.5))
ax.set_title('Health Classification', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Summary pie chart
ax = axes[1, 0]; ax.set_facecolor('#111827')
active_classes = {n: s for n, s in report['summary'].items() if s['pixels'] > 0}
colors_pie = [hex_to_rgb(monitor.HEALTH_CLASSES[i]['color']) for i in range(6)
              if monitor.HEALTH_CLASSES[i]['name'] in active_classes]
ax.pie([s['percent'] for s in active_classes.values()],
       labels=list(active_classes.keys()), colors=colors_pie,
       autopct='%1.1f%%', textprops={'color': 'white', 'fontsize': 9})
ax.set_title('Health Distribution', color='white', fontsize=11)

# API reference
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
doc = """API Reference
------------------------------
monitor = CropHealthMonitor(
    pixel_size_m=0.5  # GSD
)

report = monitor.analyze(
    red, nir, green
)
  report['ndvi']           -> array
  report['classification'] -> array
  report['summary']        -> dict
  report['disease_patches']-> list
  report['recommendations']-> list

Health Classes
------------------------------
  0: Healthy   (NDVI > 0.55)
  1: Stressed  (0.35 - 0.55)
  2: Diseased  (0.10 - 0.35)
  4: Water     (NDVI < 0.10)

Limitations
------------------------------
  Synthetic data only
  No atmospheric correction
  Simplified taxonomy
  Single-date analysis"""

ax.text(0.05, 0.95, doc, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Crop Health Monitor from scratch:")
print("  1. Simulated multispectral paddy field imagery (Red, NIR, Green)")
print("  2. Computed vegetation indices (NDVI, GNDVI)")
print("  3. Classified pixels using thresholds and multi-feature KNN")
print("  4. Analyzed spatial patterns with connected component labeling")
print("  5. Implemented temporal change detection and trend analysis")
print("  6. Deployed as clean API with recommendations and reporting")
print()
print("Skills demonstrated: remote sensing, image classification,")
print("spatial analysis, temporal monitoring, precision agriculture.")`,
      challenge: 'Add yield estimation: using the empirical relationship yield_tons_per_ha = 2.5 * mean_NDVI (simplified), estimate total field yield and compute the yield loss from disease compared to a fully healthy field (NDVI=0.75). Report the economic loss at Rs 20,000 per ton.',
      successHint: 'You have completed a full capstone project: from raw spectral bands to deployed crop health monitoring system. This is the shape of real precision agriculture — remote sensing, image analysis, spatial statistics, temporal tracking, and actionable recommendations. The system is portfolio-ready and demonstrates the full pipeline of agricultural AI.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (computer vision foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Crop Health Monitor. Click to start.</p>
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
