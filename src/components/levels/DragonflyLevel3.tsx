import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DragonflyLevel3() {
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
      title: 'Convolution — the kernel operation that powers all modern CV',
      concept: `In Levels 1 and 2 you worked with pixels and color channels. But raw pixels are a terrible representation for understanding images — a one-pixel shift of a dragonfly creates a completely different pixel array, even though it is the same dragonfly.

**Convolution** solves this. It slides a small matrix (the **kernel**) across the image, computing a weighted sum at each position. The output is a new image — a **feature map** — that highlights specific patterns.

The math is simple. For a 3x3 kernel K applied at position (i,j) of image I:

output(i,j) = sum over m,n of I(i+m, j+n) * K(m, n)

This operation is:
- **Translation equivariant**: the same pattern is detected everywhere in the image
- **Local**: each output pixel depends only on a small neighborhood
- **Parameter efficient**: one kernel (9 numbers for a 3x3) is applied across the entire image

Different kernels detect different patterns. A horizontal edge kernel detects horizontal boundaries. A blur kernel smooths noise. A sharpen kernel enhances detail. The entire field of classical computer vision is built on choosing the right kernels. Deep learning's breakthrough was **learning** the kernels automatically from data.`,
      analogy: 'Convolution is like running your finger across a page of braille. At each position, you feel the local pattern (the kernel operation). You don\'t need to see the whole page to recognize a letter — just the local bumps under your fingertip. Slide across the entire page, and you\'ve "read" it all using the same local operation repeated everywhere.',
      storyConnection: 'Bonti\'s dragonfly drone needed to scan the entire paddy field looking for brown spots (disease) among green (healthy). Convolution is exactly how it would work: a small detection kernel slides across the drone\'s camera feed, computing a "disease score" at every position. The kernel does not care WHERE in the field the disease is — it detects the same pattern everywhere.',
      checkQuestion: 'A 3x3 kernel has 9 parameters. If your image is 1000x1000 pixels, how many multiplications does a single convolution require? Why is this still much faster than a fully-connected layer?',
      checkAnswer: 'About 9 million multiplications (1000*1000*9). A fully-connected layer connecting every input pixel to every output pixel would need 1000*1000*1000*1000 = 1 trillion multiplications. Convolution is ~100,000x cheaper because it reuses the same 9 weights at every position. This parameter sharing is why CNNs are tractable on large images.',
      codeIntro: 'Implement 2D convolution from scratch and apply different kernels to a synthetic paddy field image.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a synthetic paddy field image (64x64 grayscale)
# Green field with brown disease patches and some texture
field = np.ones((64, 64)) * 0.6  # base green brightness

# Add random texture (leaf variation)
field += np.random.normal(0, 0.05, (64, 64))

# Add disease patches (dark spots)
for _ in range(5):
    cx, cy = np.random.randint(10, 54, 2)
    r = np.random.randint(3, 8)
    yy, xx = np.ogrid[-cx:64-cx, -cy:64-cy]
    mask = xx**2 + yy**2 <= r**2
    field[mask] -= 0.3 + np.random.uniform(0, 0.1)

# Add some bright spots (flowers/reflections)
for _ in range(3):
    cx, cy = np.random.randint(5, 59, 2)
    field[cx-1:cx+2, cy-1:cy+2] = 0.9

field = np.clip(field, 0, 1)

def convolve2d(image, kernel):
    """Implement 2D convolution from scratch."""
    ih, iw = image.shape
    kh, kw = kernel.shape
    pad_h, pad_w = kh // 2, kw // 2

    # Zero-pad the image
    padded = np.zeros((ih + 2*pad_h, iw + 2*pad_w))
    padded[pad_h:pad_h+ih, pad_w:pad_w+iw] = image

    output = np.zeros_like(image)

    for i in range(ih):
        for j in range(iw):
            region = padded[i:i+kh, j:j+kw]
            output[i, j] = np.sum(region * kernel)

    return output

# Define classic kernels
kernels = {
    'Identity': np.array([[0, 0, 0], [0, 1, 0], [0, 0, 0]], dtype=float),
    'Blur (box)': np.ones((3, 3)) / 9.0,
    'Sharpen': np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float),
    'Horizontal edge': np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float),
    'Vertical edge': np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float),
    'Emboss': np.array([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]], dtype=float),
}

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

# Show original
axes[0, 0].imshow(field, cmap='YlGn', vmin=0, vmax=1)
axes[0, 0].set_title('Original field', color='white', fontsize=10)

# Apply each kernel
for idx, (name, kernel) in enumerate(kernels.items()):
    row = (idx + 1) // 4
    col = (idx + 1) % 4
    result = convolve2d(field, kernel)

    ax = axes[row, col]
    if 'edge' in name.lower() or name == 'Emboss':
        ax.imshow(np.abs(result), cmap='hot', vmin=0, vmax=np.percentile(np.abs(result), 99))
    else:
        ax.imshow(result, cmap='YlGn', vmin=0, vmax=1)
    ax.set_title(name, color='white', fontsize=10)

# Show kernel values for last empty spot
ax = axes[1, 3]
ax.set_facecolor('#111827')
ax.text(0.5, 0.95, 'Convolution operation:', color='white', fontsize=11,
        ha='center', va='top', transform=ax.transAxes, fontweight='bold')
ax.text(0.5, 0.75, 'output(i,j) =', color='#f59e0b', fontsize=10,
        ha='center', va='top', transform=ax.transAxes, family='monospace')
ax.text(0.5, 0.6, 'SUM( image[i+m, j+n]', color='#22c55e', fontsize=9,
        ha='center', va='top', transform=ax.transAxes, family='monospace')
ax.text(0.5, 0.48, '     * kernel[m, n] )', color='#22c55e', fontsize=9,
        ha='center', va='top', transform=ax.transAxes, family='monospace')
ax.text(0.5, 0.28, f'Image: {field.shape[0]}x{field.shape[1]} = {field.size} pixels', color='gray', fontsize=9,
        ha='center', va='top', transform=ax.transAxes)
ax.text(0.5, 0.15, 'Kernel: 3x3 = 9 parameters', color='gray', fontsize=9,
        ha='center', va='top', transform=ax.transAxes)
ax.text(0.5, 0.02, f'Multiplications: {field.size * 9:,}', color='gray', fontsize=9,
        ha='center', va='top', transform=ax.transAxes)

for ax in axes.flat:
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

print("Kernel effects:")
print("  Identity  — no change (sanity check)")
print("  Blur      — smooths noise, reduces detail")
print("  Sharpen   — enhances edges and fine detail")
print("  H. edge   — detects horizontal boundaries (field rows)")
print("  V. edge   — detects vertical boundaries (field edges)")
print("  Emboss    — creates 3D lighting effect")
print()
print("Same operation (convolution), different kernel = different output.")
print("A CNN learns which kernels to use automatically from data.")`,
      challenge: 'Create a custom 3x3 kernel that detects diagonal edges (top-left to bottom-right). Test it on the field image. Hint: it should have positive values on one diagonal side and negative on the other.',
      successHint: 'Convolution is the most important operation in computer vision. Every CNN, from the original LeNet (1998) to modern Vision Transformers, uses convolution or an attention-based variant of it. Understanding convolution deeply is non-negotiable for CV work.',
    },
    {
      title: 'Edge detection kernels — Sobel, Prewitt, and Laplacian',
      concept: `In Level 1 you detected edges with simple thresholding. That is fragile — it breaks with different lighting, noise, or contrast. Real edge detection uses the **gradient** of the image: the rate of change in intensity.

At an edge, intensity changes rapidly. In a flat region, it stays constant. The gradient magnitude tells you edge strength; the gradient direction tells you edge orientation.

Three classic approaches:

**Prewitt**: estimates the gradient using a simple average
- Gx = [[-1,0,1],[-1,0,1],[-1,0,1]] (horizontal gradient)
- Gy = [[-1,-1,-1],[0,0,0],[1,1,1]] (vertical gradient)

**Sobel**: like Prewitt but weights the center row/column more heavily (smoother)
- Gx = [[-1,0,1],[-2,0,2],[-1,0,1]]
- Gy = [[-1,-2,-1],[0,0,0],[1,2,1]]

**Laplacian**: detects edges using the **second derivative** (rate of change of the rate of change)
- L = [[0,1,0],[1,-4,1],[0,1,0]]
- Detects edges in ALL directions simultaneously but is sensitive to noise

Gradient magnitude = sqrt(Gx^2 + Gy^2)
Gradient direction = arctan2(Gy, Gx)

This is the mathematical foundation behind Level 1's simple edge detection.`,
      analogy: 'The gradient is like the slope of a hill. On flat ground (uniform color), the slope is zero. At a cliff edge (sharp boundary between field and path), the slope is steep. Prewitt and Sobel measure the slope; the Laplacian measures how the slope itself is changing (convex hilltop vs concave valley). You need all three perspectives to fully understand terrain — and images.',
      storyConnection: 'Bonti\'s drone flying over the paddy field needs to detect the edges of disease patches precisely. The boundary between healthy green rice and brown diseased rice is an edge in the drone\'s camera image. Sobel filters extract exactly these boundaries, letting the software measure how large each disease patch is and how fast it is spreading.',
      checkQuestion: 'The Laplacian kernel [[0,1,0],[1,-4,1],[0,1,0]] sums to zero. Why is this important? What would happen if the kernel summed to a non-zero value?',
      checkAnswer: 'A kernel that sums to zero produces zero output on uniform regions (where all pixel values are the same). This is exactly what you want for edge detection — no response in flat areas, strong response at edges. If the kernel summed to a positive value, it would produce a non-zero output even on uniform regions, making it impossible to distinguish edges from flat areas. The zero-sum property is what makes it a derivative operator rather than a blur or amplification.',
      codeIntro: 'Implement Sobel, Prewitt, and Laplacian edge detection from scratch with gradient magnitude and direction visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a more realistic test image: geometric shapes on noisy background
img = np.ones((80, 80)) * 0.3 + np.random.normal(0, 0.02, (80, 80))

# Rectangle (disease patch)
img[15:35, 10:30] = 0.8 + np.random.normal(0, 0.02, (20, 20))

# Circle (another disease spot)
yy, xx = np.ogrid[:80, :80]
circle_mask = (yy - 50)**2 + (xx - 55)**2 <= 12**2
img[circle_mask] = 0.7 + np.random.normal(0, 0.02, np.sum(circle_mask))

# Diagonal line (irrigation channel)
for i in range(60):
    row = 10 + i
    col = 40 + i // 3
    if row < 80 and col < 80:
        img[row, max(0, col-1):min(80, col+2)] = 0.1

img = np.clip(img, 0, 1)

def convolve2d(image, kernel):
    ih, iw = image.shape
    kh, kw = kernel.shape
    pad_h, pad_w = kh // 2, kw // 2
    padded = np.zeros((ih + 2*pad_h, iw + 2*pad_w))
    padded[pad_h:pad_h+ih, pad_w:pad_w+iw] = image
    output = np.zeros_like(image)
    for i in range(ih):
        for j in range(iw):
            output[i, j] = np.sum(padded[i:i+kh, j:j+kw] * kernel)
    return output

# Define edge detection kernels
sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=float)
sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=float)

prewitt_x = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float)
prewitt_y = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float)

laplacian = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float)

# Apply Sobel
sx = convolve2d(img, sobel_x)
sy = convolve2d(img, sobel_y)
sobel_mag = np.sqrt(sx**2 + sy**2)
sobel_dir = np.arctan2(sy, sx)

# Apply Prewitt
px = convolve2d(img, prewitt_x)
py = convolve2d(img, prewitt_y)
prewitt_mag = np.sqrt(px**2 + py**2)

# Apply Laplacian
lap = convolve2d(img, laplacian)

# Gaussian blur first, then Laplacian (LoG - Laplacian of Gaussian)
gaussian_3x3 = np.array([[1, 2, 1], [2, 4, 2], [1, 2, 1]], dtype=float) / 16.0
img_smooth = convolve2d(img, gaussian_3x3)
lap_of_gauss = convolve2d(img_smooth, laplacian)

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

plots = [
    (axes[0, 0], img, 'Original image', 'YlGn', None),
    (axes[0, 1], sobel_mag, 'Sobel magnitude', 'hot', None),
    (axes[0, 2], prewitt_mag, 'Prewitt magnitude', 'hot', None),
    (axes[0, 3], np.abs(lap), 'Laplacian (abs)', 'hot', None),
    (axes[1, 0], sx, 'Sobel Gx (horizontal)', 'RdBu_r', None),
    (axes[1, 1], sy, 'Sobel Gy (vertical)', 'RdBu_r', None),
    (axes[1, 2], sobel_dir, 'Gradient direction', 'hsv', None),
    (axes[1, 3], np.abs(lap_of_gauss), 'Laplacian of Gaussian', 'hot', None),
]

for ax, data, title, cmap, _ in plots:
    ax.set_facecolor('#111827')
    if cmap == 'RdBu_r':
        vmax = np.percentile(np.abs(data), 98)
        ax.imshow(data, cmap=cmap, vmin=-vmax, vmax=vmax)
    elif cmap == 'hot':
        ax.imshow(data, cmap=cmap, vmin=0, vmax=np.percentile(data, 98))
    else:
        ax.imshow(data, cmap=cmap)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

# Quantitative comparison
def edge_snr(mag, img, threshold_pct=75):
    """Signal-to-noise ratio: edge strength at true edges vs flat regions."""
    threshold = np.percentile(mag, threshold_pct)
    edge_pixels = mag[mag > threshold]
    flat_pixels = mag[mag <= threshold]
    return np.mean(edge_pixels) / (np.mean(flat_pixels) + 1e-10)

print("Edge detection comparison:")
print(f"{'Method':<25} {'Max gradient':>12} {'SNR':>8}")
print("-" * 47)
print(f"{'Sobel':<25} {np.max(sobel_mag):>12.3f} {edge_snr(sobel_mag, img):>8.1f}")
print(f"{'Prewitt':<25} {np.max(prewitt_mag):>12.3f} {edge_snr(prewitt_mag, img):>8.1f}")
print(f"{'Laplacian':<25} {np.max(np.abs(lap)):>12.3f} {edge_snr(np.abs(lap), img):>8.1f}")
print(f"{'Laplacian of Gaussian':<25} {np.max(np.abs(lap_of_gauss)):>12.3f} {edge_snr(np.abs(lap_of_gauss), img):>8.1f}")
print()
print("Sobel: best all-around. Directional (gives Gx and Gy separately).")
print("Prewitt: slightly noisier than Sobel (no center weighting).")
print("Laplacian: detects all edges but amplifies noise badly.")
print("LoG: Gaussian blur first kills noise, then Laplacian finds clean edges.")
print()
print("In practice, Sobel is the default first choice.")
print("Canny edge detection (the industry standard) uses Sobel internally.")`,
      challenge: 'Add Gaussian noise to the image (sigma=0.1) and re-run all detectors. Which one is most robust to noise? Try applying a 5x5 Gaussian blur before edge detection. How does pre-smoothing change the results?',
      successHint: 'Edge detection is the foundation of all higher-level CV tasks: object detection, segmentation, tracking. A CNN learns its own edge detectors in the first layer — and when you visualize them, they look almost identical to Sobel and Gabor filters. The network rediscovers what mathematicians worked out decades ago.',
    },
    {
      title: 'Feature maps — how CNNs build hierarchical representations',
      concept: `A single convolution produces one feature map. A CNN applies **many kernels** at each layer, producing many feature maps. Then it stacks another layer of convolutions on top of those feature maps, and another, and another.

The result is a **hierarchy of features**:
- **Layer 1**: detects edges, corners, color gradients (like Sobel filters)
- **Layer 2**: combines edges into textures, simple shapes (leaf veins, rice stalk patterns)
- **Layer 3**: combines textures into object parts (a leaf, a flower, a disease spot)
- **Layer 4+**: combines parts into whole objects (healthy plant, diseased plant, weed)

Each layer sees a larger **receptive field** — the area of the input image that influences one output pixel. Layer 1 sees a 3x3 patch. Layer 2 sees a 5x5 patch (because each of its inputs already summarizes a 3x3 patch). By layer 5, a single neuron might "see" the entire image.

Between convolution layers, two operations are critical:
- **Activation function (ReLU)**: max(0, x) — kills negative values, introduces non-linearity
- **Pooling (max pool)**: shrinks the feature map by taking the max in each 2x2 block — reduces computation and adds translation invariance`,
      analogy: 'A CNN reads an image the way you read a paragraph. First you see individual letters (edges). Then you recognize words (textures/shapes). Then phrases (object parts). Then you understand the full sentence (the complete object). Each level of understanding builds on the one below. You can\'t understand the sentence without first recognizing the letters — and a CNN can\'t classify a disease without first detecting the edges that form its boundary.',
      storyConnection: 'Bonti\'s drone camera captures 4K video of the paddy field. A CNN processes each frame hierarchically: first it finds edges between healthy and diseased zones (layer 1), then it recognizes the texture of healthy rice vs. brown disease patches (layer 2), then it identifies individual disease spots and their shapes (layer 3), then it classifies the type of disease — blast, blight, or sheath rot (layer 4). Each layer builds on the one below.',
      checkQuestion: 'If layer 1 has 32 kernels (each 3x3) applied to a 1-channel grayscale image, how many parameters does layer 1 have? What about layer 2 with 64 kernels applied to the 32 feature maps from layer 1?',
      checkAnswer: 'Layer 1: 32 kernels * (3*3*1 weights + 1 bias) = 32 * 10 = 320 parameters. Layer 2: 64 kernels * (3*3*32 weights + 1 bias) = 64 * 289 = 18,496 parameters. Layer 2 has far more parameters because each kernel must process all 32 input channels. This is why deeper layers are more computationally expensive.',
      codeIntro: 'Simulate a 3-layer CNN forward pass from scratch: convolution, ReLU activation, max pooling, and visualize what each layer "sees".',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a test image with known structure: healthy field + disease patches
img = np.ones((64, 64)) * 0.5

# Healthy rice: vertical-ish texture (rice stalks)
for col in range(0, 64, 3):
    img[:, col] += 0.15 * np.random.uniform(0.5, 1.0)

# Disease patch 1: circular, brown (low intensity), rough texture
yy, xx = np.ogrid[:64, :64]
d1 = (yy - 20)**2 + (xx - 15)**2 <= 8**2
img[d1] = 0.25 + np.random.normal(0, 0.05, np.sum(d1))

# Disease patch 2: irregular
d2 = ((yy - 45)**2 / 36 + (xx - 50)**2 / 64) <= 1
img[d2] = 0.2 + np.random.normal(0, 0.04, np.sum(d2))

img = np.clip(img, 0, 1)

def convolve2d(image, kernel):
    ih, iw = image.shape
    kh, kw = kernel.shape
    ph, pw = kh // 2, kw // 2
    padded = np.zeros((ih + 2*ph, iw + 2*pw))
    padded[ph:ph+ih, pw:pw+iw] = image
    out = np.zeros_like(image)
    for i in range(ih):
        for j in range(iw):
            out[i, j] = np.sum(padded[i:i+kh, j:j+kw] * kernel)
    return out

def relu(x):
    return np.maximum(0, x)

def max_pool_2x2(x):
    h, w = x.shape
    h2, w2 = h // 2, w // 2
    out = np.zeros((h2, w2))
    for i in range(h2):
        for j in range(w2):
            out[i, j] = np.max(x[2*i:2*i+2, 2*j:2*j+2])
    return out

# Layer 1 kernels: hand-designed (in a real CNN these are learned)
layer1_kernels = {
    'Horizontal edge': np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float),
    'Vertical edge': np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float),
    'Spot detector': np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], dtype=float) / 3,
    'Diagonal': np.array([[2, -1, -1], [-1, 2, -1], [-1, -1, 2]], dtype=float) / 3,
}

# Forward pass: Layer 1
layer1_maps = {}
layer1_pooled = {}
for name, kernel in layer1_kernels.items():
    conv_out = convolve2d(img, kernel)
    activated = relu(conv_out)
    pooled = max_pool_2x2(activated)
    layer1_maps[name] = activated
    layer1_pooled[name] = pooled

# Layer 2: combine layer 1 outputs
# Simulate "disease boundary detector" that combines horizontal + vertical edges
pooled_list = list(layer1_pooled.values())
pooled_stack = np.stack(pooled_list, axis=0)  # (4, 32, 32)

# Manual layer 2 kernel: weighted combination of all layer 1 features
# Weight horizontal and vertical edges high, spot detector high
weights = np.array([0.3, 0.3, 0.3, 0.1])
layer2_combined = np.tensordot(weights, pooled_stack, axes=([0], [0]))
layer2_activated = relu(layer2_combined)
layer2_pooled = max_pool_2x2(layer2_activated)

# Layer 3: further combination and pooling
# Simple thresholded version to show final "detection"
layer3 = max_pool_2x2(layer2_pooled)
layer3_norm = layer3 / (layer3.max() + 1e-10)

fig, axes = plt.subplots(3, 5, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('CNN Forward Pass: Layer by Layer', color='white', fontsize=14)

# Row 1: Original + Layer 1 feature maps
axes[0, 0].imshow(img, cmap='YlGn')
axes[0, 0].set_title('Input image', color='white', fontsize=9)

for idx, (name, fmap) in enumerate(layer1_maps.items()):
    ax = axes[0, idx + 1]
    ax.imshow(fmap, cmap='hot')
    ax.set_title(f'L1: {name}', color='white', fontsize=8)

# Row 2: Pooled Layer 1 + Layer 2
for idx, (name, fmap) in enumerate(layer1_pooled.items()):
    ax = axes[1, idx]
    ax.imshow(fmap, cmap='hot')
    ax.set_title(f'L1 pooled: {name[:12]}', color='white', fontsize=8)

axes[1, 4].imshow(layer2_activated, cmap='hot')
axes[1, 4].set_title('L2: combined features', color='white', fontsize=9)

# Row 3: Layer 2 pooled, Layer 3, and receptive field illustration
axes[2, 0].imshow(layer2_pooled, cmap='hot')
axes[2, 0].set_title('L2 pooled (16x16)', color='white', fontsize=9)

axes[2, 1].imshow(layer3_norm, cmap='hot')
axes[2, 1].set_title('L3 output (8x8)', color='white', fontsize=9)

# Detection overlay on original
axes[2, 2].imshow(img, cmap='YlGn')
# Upsample layer 3 to original size for overlay
l3_up = np.kron(layer3_norm, np.ones((8, 8)))
axes[2, 2].imshow(l3_up, cmap='Reds', alpha=0.4)
axes[2, 2].set_title('Detection overlay', color='white', fontsize=9)

# Receptive field diagram
ax = axes[2, 3]
ax.set_facecolor('#111827')
sizes = [('Layer 1\n3x3 kernel', 3, '#22c55e'),
         ('After pool 1\nRF = 6x6', 6, '#3b82f6'),
         ('Layer 2\nRF = 10x10', 10, '#f59e0b'),
         ('After pool 2\nRF = 20x20', 20, '#ef4444')]
for i, (label, size, color) in enumerate(sizes):
    rect = plt.Rectangle((32-size/2, 32-size/2), size, size,
                          linewidth=2, edgecolor=color, facecolor='none')
    ax.add_patch(rect)
    ax.text(32+12, 32 - 12 + i*7, label, color=color, fontsize=7, va='center')
ax.set_xlim(10, 55)
ax.set_ylim(10, 55)
ax.set_title('Receptive field growth', color='white', fontsize=9)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Summary
ax = axes[2, 4]
ax.set_facecolor('#111827')
ax.axis('off')
summary = [
    ('Input', f'{img.shape[0]}x{img.shape[1]}', '1 ch'),
    ('Layer 1', f'{list(layer1_maps.values())[0].shape[0]}x{list(layer1_maps.values())[0].shape[1]}', '4 maps'),
    ('Pool 1', f'{list(layer1_pooled.values())[0].shape[0]}x{list(layer1_pooled.values())[0].shape[1]}', '4 maps'),
    ('Layer 2', f'{layer2_activated.shape[0]}x{layer2_activated.shape[1]}', '1 map'),
    ('Pool 2', f'{layer2_pooled.shape[0]}x{layer2_pooled.shape[1]}', '1 map'),
    ('Layer 3', f'{layer3.shape[0]}x{layer3.shape[1]}', '1 map'),
]
ax.text(0.5, 0.97, 'Architecture', color='white', fontsize=11, ha='center',
        va='top', transform=ax.transAxes, fontweight='bold')
for i, (name, size, ch) in enumerate(summary):
    y = 0.82 - i * 0.13
    ax.text(0.1, y, name, color='#22c55e', fontsize=9, transform=ax.transAxes, family='monospace')
    ax.text(0.55, y, size, color='white', fontsize=9, transform=ax.transAxes, family='monospace')
    ax.text(0.82, y, ch, color='gray', fontsize=9, transform=ax.transAxes, family='monospace')

for ax in axes.flat:
    ax.tick_params(colors='gray', labelsize=5)

plt.tight_layout()
plt.show()

print("CNN hierarchy:")
print(f"  Layer 1: {img.shape} -> 4 feature maps of {list(layer1_maps.values())[0].shape}")
print(f"  Pool 1:  4 maps of {list(layer1_pooled.values())[0].shape} (2x downsampled)")
print(f"  Layer 2: combined -> {layer2_activated.shape}")
print(f"  Pool 2:  {layer2_pooled.shape}")
print(f"  Layer 3: {layer3.shape} (each pixel represents an 8x8 region of the input)")
print()
print("Spatial resolution decreases (64 -> 32 -> 16 -> 8)")
print("Semantic meaning increases (pixels -> edges -> textures -> objects)")
print("This is the fundamental trade-off of deep architectures.")`,
      challenge: 'Add a 5th kernel to layer 1 that detects circular shapes (hint: a difference-of-Gaussians kernel). How does the layer 2 output change when you include circle detection?',
      successHint: 'You just built a CNN forward pass from scratch. Real frameworks (PyTorch, TensorFlow) do the same operations but with GPU acceleration and automatic gradient computation. The concepts are identical — convolution, ReLU, pooling, stacking layers. Everything else is engineering optimization.',
    },
    {
      title: 'Transfer learning — using pre-trained models for crop classification',
      concept: `Training a CNN from scratch requires millions of labeled images and days of GPU time. Most real-world projects do not have that luxury. **Transfer learning** is the solution: take a model already trained on a massive dataset (ImageNet: 14 million images, 1000 classes) and adapt it to your specific task.

The key insight: the early layers of a CNN learn generic features (edges, textures, colors) that are useful for almost any image task. Only the final layers are task-specific (distinguishing dogs from cats, or healthy rice from diseased rice).

Transfer learning workflow:
1. **Load a pre-trained model** (ResNet, VGG, EfficientNet)
2. **Freeze early layers** (keep their weights fixed — edges and textures are universal)
3. **Replace the final classification layer** (from 1000 ImageNet classes to your 3 crop disease classes)
4. **Fine-tune** on your small dataset (100-1000 labeled crop images)

This works because visual features are hierarchical and transferable. A "horizontal edge" is the same whether it is in a photo of a cat or a photo of rice blight.

In practice, transfer learning reduces training data requirements by 10-100x and training time by 100-1000x.`,
      analogy: 'Transfer learning is like hiring an experienced chef to cook a new cuisine. They already know knife skills, heat control, timing, and plating (generic features). They only need to learn the specific recipes and ingredients of the new cuisine (task-specific features). Starting from scratch — teaching someone who has never cooked — would take years instead of weeks.',
      storyConnection: 'Imagine Bonti\'s drone was first trained to identify animals in Kaziranga National Park (a rich dataset of tigers, rhinos, elephants). Now she wants it to identify crop diseases — a completely different task. Transfer learning lets her reuse the animal detector\'s visual skills (edge detection, texture analysis, shape recognition) and only retrain the final decision layer. The drone becomes a crop disease expert in days instead of months.',
      checkQuestion: 'You fine-tune a ResNet model pre-trained on ImageNet for crop disease classification. After fine-tuning, the model classifies diseases well but also still responds to "cat" and "dog" patterns in the frozen layers. Is this a problem?',
      checkAnswer: 'No. The frozen layers detect generic features (edges, textures, shapes), not specific objects. The "cat" and "dog" patterns are really edge patterns, fur textures, and shape outlines that happen to be useful for cats and dogs — and also for rice leaves and disease spots. The final (unfrozen) layer is what decides "this texture pattern means bacterial blight," not "this is a cat." Generic features are features, not decisions.',
      codeIntro: 'Simulate the transfer learning workflow: train a model from scratch vs. fine-tuning a pre-trained model, showing the dramatic difference in convergence speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate transfer learning by comparing learning curves
# Instead of real CNNs, we simulate the effect with feature extractors

# Generate crop disease classification data (3 classes)
# 50 training samples per class (small dataset!)
n_train = 50
n_test = 30
n_classes = 3

# Raw pixel features (what training from scratch sees): 20-dim noisy
def generate_raw_features(n, class_id, n_dims=20):
    base = np.zeros(n_dims)
    base[class_id * 6:(class_id + 1) * 6] = 1.0  # signal in different dims per class
    noise = np.random.randn(n, n_dims) * 0.8
    return noise + base

# Pre-trained features (what transfer learning sees): cleaner, lower-dim
def generate_pretrained_features(n, class_id, n_dims=10):
    base = np.zeros(n_dims)
    base[class_id * 3:(class_id + 1) * 3] = 2.0  # stronger signal
    noise = np.random.randn(n, n_dims) * 0.3  # less noise
    return noise + base

# Build datasets
X_raw_train, X_pre_train, y_train = [], [], []
X_raw_test, X_pre_test, y_test = [], [], []

for c in range(n_classes):
    X_raw_train.append(generate_raw_features(n_train, c))
    X_pre_train.append(generate_pretrained_features(n_train, c))
    y_train.extend([c] * n_train)

    X_raw_test.append(generate_raw_features(n_test, c))
    X_pre_test.append(generate_pretrained_features(n_test, c))
    y_test.extend([c] * n_test)

X_raw_train = np.vstack(X_raw_train)
X_pre_train = np.vstack(X_pre_train)
X_raw_test = np.vstack(X_raw_test)
X_pre_test = np.vstack(X_pre_test)
y_train = np.array(y_train)
y_test = np.array(y_test)

# Shuffle
idx = np.random.permutation(len(y_train))
X_raw_train, X_pre_train, y_train = X_raw_train[idx], X_pre_train[idx], y_train[idx]

class SimpleNeuralNet:
    """Single hidden layer neural network for classification."""
    def __init__(self, input_dim, hidden_dim, output_dim, lr=0.01):
        self.W1 = np.random.randn(input_dim, hidden_dim) * 0.1
        self.b1 = np.zeros(hidden_dim)
        self.W2 = np.random.randn(hidden_dim, output_dim) * 0.1
        self.b2 = np.zeros(output_dim)
        self.lr = lr

    def softmax(self, z):
        z = z - z.max(axis=1, keepdims=True)
        exp_z = np.exp(z)
        return exp_z / exp_z.sum(axis=1, keepdims=True)

    def forward(self, X):
        self.z1 = X @ self.W1 + self.b1
        self.a1 = np.maximum(0, self.z1)  # ReLU
        self.z2 = self.a1 @ self.W2 + self.b2
        self.probs = self.softmax(self.z2)
        return self.probs

    def loss(self, X, y):
        probs = self.forward(X)
        n = len(y)
        log_probs = -np.log(probs[range(n), y] + 1e-10)
        return np.mean(log_probs)

    def accuracy(self, X, y):
        probs = self.forward(X)
        preds = np.argmax(probs, axis=1)
        return np.mean(preds == y)

    def train_step(self, X, y):
        n = len(y)
        probs = self.forward(X)

        # Backprop
        dz2 = probs.copy()
        dz2[range(n), y] -= 1
        dz2 /= n

        dW2 = self.a1.T @ dz2
        db2 = dz2.sum(axis=0)

        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)  # ReLU derivative

        dW1 = X.T @ dz1
        db1 = dz1.sum(axis=0)

        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2

# Train from scratch
model_scratch = SimpleNeuralNet(20, 32, 3, lr=0.05)
scratch_train_acc = []
scratch_test_acc = []
scratch_loss = []

for epoch in range(200):
    model_scratch.train_step(X_raw_train, y_train)
    scratch_train_acc.append(model_scratch.accuracy(X_raw_train, y_train))
    scratch_test_acc.append(model_scratch.accuracy(X_raw_test, y_test))
    scratch_loss.append(model_scratch.loss(X_raw_train, y_train))

# Train with transfer learning (pre-trained features, smaller model)
model_transfer = SimpleNeuralNet(10, 16, 3, lr=0.1)
transfer_train_acc = []
transfer_test_acc = []
transfer_loss = []

for epoch in range(200):
    model_transfer.train_step(X_pre_train, y_train)
    transfer_train_acc.append(model_transfer.accuracy(X_pre_train, y_train))
    transfer_test_acc.append(model_transfer.accuracy(X_pre_test, y_test))
    transfer_loss.append(model_transfer.loss(X_pre_train, y_train))

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Training loss
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(scratch_loss, color='#ef4444', linewidth=1.5, label='From scratch', alpha=0.8)
ax.plot(transfer_loss, color='#22c55e', linewidth=1.5, label='Transfer learning', alpha=0.8)
ax.set_xlabel('Epoch', color='white')
ax.set_ylabel('Loss', color='white')
ax.set_title('Training loss', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Test accuracy
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(scratch_test_acc, color='#ef4444', linewidth=1.5, label='From scratch', alpha=0.8)
ax.plot(transfer_test_acc, color='#22c55e', linewidth=1.5, label='Transfer learning', alpha=0.8)
ax.axhline(1/3, color='gray', linestyle=':', linewidth=1, label='Random guess')
ax.set_xlabel('Epoch', color='white')
ax.set_ylabel('Accuracy', color='white')
ax.set_title('Test accuracy', color='white', fontsize=11)
ax.set_ylim(0, 1.05)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Data efficiency
ax = axes[2]
ax.set_facecolor('#111827')
data_sizes = [10, 20, 30, 50, 80, 100, 150]
scratch_final_accs = []
transfer_final_accs = []

for n in data_sizes:
    n_per = min(n, n_train)
    idx_sub = np.random.choice(len(y_train), n_per * 3, replace=n_per * 3 > len(y_train))

    m = SimpleNeuralNet(20, 32, 3, lr=0.05)
    for _ in range(200):
        m.train_step(X_raw_train[idx_sub[:n_per*3]], y_train[idx_sub[:n_per*3]])
    scratch_final_accs.append(m.accuracy(X_raw_test, y_test))

    m = SimpleNeuralNet(10, 16, 3, lr=0.1)
    for _ in range(200):
        m.train_step(X_pre_train[idx_sub[:n_per*3]], y_train[idx_sub[:n_per*3]])
    transfer_final_accs.append(m.accuracy(X_pre_test, y_test))

ax.plot(data_sizes, scratch_final_accs, 'o-', color='#ef4444', linewidth=2, label='From scratch')
ax.plot(data_sizes, transfer_final_accs, 'o-', color='#22c55e', linewidth=2, label='Transfer learning')
ax.set_xlabel('Training samples', color='white')
ax.set_ylabel('Test accuracy', color='white')
ax.set_title('Data efficiency', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Transfer learning vs. training from scratch:")
print(f"  Final test accuracy (scratch):   {scratch_test_acc[-1]:.1%}")
print(f"  Final test accuracy (transfer):  {transfer_test_acc[-1]:.1%}")
print()

# Find epoch where transfer learning reaches 80% accuracy
thresh = 0.8
scratch_80 = next((i for i, a in enumerate(scratch_test_acc) if a >= thresh), -1)
transfer_80 = next((i for i, a in enumerate(transfer_test_acc) if a >= thresh), -1)
if transfer_80 >= 0 and scratch_80 >= 0:
    print(f"  Epochs to reach {thresh:.0%}: scratch={scratch_80}, transfer={transfer_80}")
    print(f"  Transfer learning is {scratch_80/(transfer_80+1):.0f}x faster")
elif transfer_80 >= 0:
    print(f"  Transfer reaches {thresh:.0%} at epoch {transfer_80}; scratch never does")
print()
print("Transfer learning is the default approach for real-world CV.")
print("You almost NEVER train from scratch unless you have ImageNet-scale data.")`,
      challenge: 'Simulate "fine-tuning" vs "feature extraction": in feature extraction, only the final layer trains (freeze W1). In fine-tuning, both layers train. Implement both and compare. When does fine-tuning help over feature extraction?',
      successHint: 'Transfer learning is why computer vision works in practice. A farmer with 200 labeled crop images can build a disease classifier that rivals one trained on millions of images. It democratizes AI — and it is how Bonti\'s drone would actually be built.',
    },
    {
      title: 'Data augmentation — creating training data from thin air',
      concept: `The biggest bottleneck in deep learning is not model architecture or compute — it is **labeled data**. Labeling images is expensive and slow. A doctor might label 50 disease images per hour. You need thousands.

**Data augmentation** creates new training samples by applying random transformations to existing ones:

- **Geometric**: rotation, flipping (horizontal/vertical), scaling, cropping, translation
- **Color**: brightness shift, contrast adjustment, saturation change, color jitter
- **Noise**: Gaussian noise, blur, JPEG compression artifacts
- **Advanced**: cutout (mask random patches), mixup (blend two images), mosaic (combine four images)

The key principle: transformations must preserve the label. Rotating a diseased leaf by 30 degrees does not change the disease. Flipping horizontally does not change the species. But rotating 180 degrees might make "top" and "bottom" ambiguous for some tasks.

Augmentation acts as a **regularizer** — it forces the model to learn features that are invariant to transformations it should not care about. A disease classifier that only works on perfectly centered, well-lit images is useless in the field where the drone camera angle varies constantly.`,
      analogy: 'Data augmentation is like studying for an exam by rephrasing the same practice question multiple ways. "What is 2+3?" "What is 3+2?" "If you have 2 apples and receive 3 more, how many?" "Solve: x = 2+3." Same answer, different presentation. By the time you see a new phrasing on the real exam, you recognize the underlying concept because you have seen so many variations.',
      storyConnection: 'Bonti has only 200 photos of rice blast disease. Her drone captures images at different angles, times of day, and weather conditions. Data augmentation simulates this natural variation: rotating images mimics different camera angles, adjusting brightness mimics different lighting, adding blur mimics camera motion during flight. One photo becomes ten training samples.',
      checkQuestion: 'You are training a classifier to detect whether rice is planted in rows (organized farming) vs. scattered (traditional broadcasting). Would random rotation be a valid augmentation?',
      checkAnswer: 'No. Rotation would destroy the very pattern you are trying to detect. Rows at 0 degrees rotated by 45 degrees might look like scattered planting. Valid augmentations for this task would be: color jitter, brightness changes, horizontal flipping (rows are still rows when flipped), scaling, and adding noise. The augmentation must preserve the label.',
      codeIntro: 'Implement common augmentation transforms from scratch and demonstrate their effect on a synthetic crop image, including the impact on model training with limited data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a synthetic disease leaf image (64x64, 3 channels: RGB)
img = np.zeros((64, 64, 3))

# Green background (healthy tissue)
img[:, :, 0] = 0.15  # R
img[:, :, 1] = 0.55  # G
img[:, :, 2] = 0.1   # B

# Add leaf texture (veins)
for row in range(0, 64, 8):
    img[row:row+1, :, 1] += 0.1

# Disease spot (brown/yellow circle)
yy, xx = np.ogrid[:64, :64]
spot1 = (yy - 25)**2 + (xx - 30)**2 <= 7**2
img[spot1, 0] = 0.6
img[spot1, 1] = 0.35
img[spot1, 2] = 0.1

# Second smaller spot
spot2 = (yy - 40)**2 + (xx - 45)**2 <= 4**2
img[spot2, 0] = 0.5
img[spot2, 1] = 0.3
img[spot2, 2] = 0.08

img = np.clip(img, 0, 1)

# --- Augmentation functions (all from scratch) ---

def flip_horizontal(image):
    return image[:, ::-1, :].copy()

def flip_vertical(image):
    return image[::-1, :, :].copy()

def rotate_90(image, k=1):
    """Rotate by k * 90 degrees."""
    return np.rot90(image, k, axes=(0, 1)).copy()

def adjust_brightness(image, factor):
    """Multiply all pixels by factor."""
    return np.clip(image * factor, 0, 1)

def adjust_contrast(image, factor):
    """Scale pixel values around the mean."""
    mean = image.mean()
    return np.clip((image - mean) * factor + mean, 0, 1)

def add_gaussian_noise(image, sigma=0.05):
    noise = np.random.randn(*image.shape) * sigma
    return np.clip(image + noise, 0, 1)

def color_jitter(image, hue_shift=0.05, sat_shift=0.2):
    """Simple color jitter: shift individual channels."""
    result = image.copy()
    for c in range(3):
        shift = np.random.uniform(-sat_shift, sat_shift)
        result[:, :, c] = np.clip(result[:, :, c] + shift, 0, 1)
    return result

def random_crop_and_resize(image, crop_fraction=0.8):
    """Randomly crop a portion and resize back to original dimensions."""
    h, w = image.shape[:2]
    crop_h = int(h * crop_fraction)
    crop_w = int(w * crop_fraction)
    top = np.random.randint(0, h - crop_h + 1)
    left = np.random.randint(0, w - crop_w + 1)
    cropped = image[top:top+crop_h, left:left+crop_w]
    # Nearest-neighbor resize back to original
    resized = np.zeros_like(image)
    for i in range(h):
        for j in range(w):
            src_i = min(int(i * crop_h / h), crop_h - 1)
            src_j = min(int(j * crop_w / w), crop_w - 1)
            resized[i, j] = cropped[src_i, src_j]
    return resized

def cutout(image, patch_size=16):
    """Mask a random square patch with zeros."""
    result = image.copy()
    h, w = result.shape[:2]
    top = np.random.randint(0, h - patch_size + 1)
    left = np.random.randint(0, w - patch_size + 1)
    result[top:top+patch_size, left:left+patch_size] = 0
    return result

# Generate augmented samples
augmentations = [
    ('Original', img),
    ('H-flip', flip_horizontal(img)),
    ('V-flip', flip_vertical(img)),
    ('Rotate 90', rotate_90(img, 1)),
    ('Bright +30%', adjust_brightness(img, 1.3)),
    ('Bright -30%', adjust_brightness(img, 0.7)),
    ('High contrast', adjust_contrast(img, 1.5)),
    ('Low contrast', adjust_contrast(img, 0.6)),
    ('Gaussian noise', add_gaussian_noise(img, 0.08)),
    ('Color jitter', color_jitter(img)),
    ('Random crop', random_crop_and_resize(img, 0.75)),
    ('Cutout', cutout(img, 20)),
]

fig, axes = plt.subplots(3, 4, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Data Augmentation: 1 Image -> 12 Training Samples', color='white', fontsize=14)

for idx, (name, aug_img) in enumerate(augmentations):
    row, col = idx // 4, idx % 4
    ax = axes[row, col]
    ax.imshow(aug_img)
    ax.set_title(name, color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=5)

plt.tight_layout()
plt.show()

# Demonstrate the effect on training: compare with/without augmentation
# Simulate: small dataset of 20 images, classify disease vs healthy
def make_dataset(n_per_class, augment=False, n_augments=5):
    """Generate simple features from images."""
    X_list, y_list = [], []
    for c in range(2):
        for _ in range(n_per_class):
            # Create a simple image
            base = np.random.normal(0.5 + c * 0.3, 0.1, (64, 64, 3)).clip(0, 1)
            # Extract simple features: mean RGB + std RGB
            features = list(base.mean(axis=(0, 1))) + list(base.std(axis=(0, 1)))
            X_list.append(features)
            y_list.append(c)

            if augment:
                for _ in range(n_augments):
                    aug = base.copy()
                    aug = adjust_brightness(aug, np.random.uniform(0.7, 1.3))
                    aug = add_gaussian_noise(aug, np.random.uniform(0, 0.1))
                    if np.random.random() > 0.5:
                        aug = flip_horizontal(aug)
                    features_aug = list(aug.mean(axis=(0, 1))) + list(aug.std(axis=(0, 1)))
                    X_list.append(features_aug)
                    y_list.append(c)

    return np.array(X_list), np.array(y_list)

# Test set (never augmented)
X_test, y_test = make_dataset(50, augment=False)

# Train without augmentation
X_train_small, y_train_small = make_dataset(10, augment=False)

# Train with augmentation (5x more samples)
X_train_aug, y_train_aug = make_dataset(10, augment=True, n_augments=5)

# Simple classifier: nearest centroid
def nc_accuracy(X_train, y_train, X_test, y_test):
    c0 = X_train[y_train == 0].mean(axis=0)
    c1 = X_train[y_train == 1].mean(axis=0)
    preds = []
    for x in X_test:
        d0 = np.linalg.norm(x - c0)
        d1 = np.linalg.norm(x - c1)
        preds.append(0 if d0 < d1 else 1)
    return np.mean(np.array(preds) == y_test)

acc_no_aug = nc_accuracy(X_train_small, y_train_small, X_test, y_test)
acc_with_aug = nc_accuracy(X_train_aug, y_train_aug, X_test, y_test)

print(f"\\nTraining set sizes:")
print(f"  Without augmentation: {len(y_train_small)} samples")
print(f"  With augmentation:    {len(y_train_aug)} samples")
print()
print(f"Test accuracy:")
print(f"  Without augmentation: {acc_no_aug:.1%}")
print(f"  With augmentation:    {acc_with_aug:.1%}")
print()
print("Augmentation is free labeled data.")
print("The original 20 images became 120 training samples.")
print("Each augmented version teaches the model a new invariance:")
print("  - Flips: orientation doesn't matter")
print("  - Brightness: lighting doesn't matter")
print("  - Noise: camera quality doesn't matter")
print("  - Cutout: partial occlusion doesn't matter")`,
      challenge: 'Implement mixup: blend two random images (new = alpha*img1 + (1-alpha)*img2, alpha ~ Beta(0.2, 0.2)). The label is also blended. This is one of the most powerful augmentation techniques. Add it to the training pipeline and measure the effect.',
      successHint: 'Data augmentation is the single most impactful technique for improving model performance on small datasets. It is used in every serious CV pipeline. Bonti does not need 10,000 labeled images of rice diseases — she needs 500 good ones and smart augmentation.',
    },
    {
      title: 'Deployment — quantization, edge inference, and drone-mounted pipelines',
      concept: `A model that runs on a beefy GPU in a lab is interesting. A model that runs on a $35 Raspberry Pi mounted on a drone over a paddy field is **useful**. The gap between lab and field is the deployment gap, and closing it requires several techniques:

**Model quantization**: neural network weights are typically 32-bit floating point numbers (4 bytes each). Quantization converts them to 8-bit integers (1 byte) or even 4-bit. This:
- Reduces model size by 4-8x
- Speeds up inference by 2-4x on hardware with integer math units
- Slightly reduces accuracy (typically 1-2% drop)

**Pruning**: many weights in a trained model are near zero and contribute little. Removing them (setting to exactly zero) creates a **sparse** model that skips zero-weight computations.

**Knowledge distillation**: train a large, accurate "teacher" model, then train a small "student" model to mimic the teacher's outputs. The student learns from the teacher's soft probability distributions, not just hard labels.

**Edge inference pipeline** for a drone:
1. Camera captures frame (12 MP, ~4 MB)
2. Resize to model input (224x224, ~150 KB)
3. Run quantized model (~50ms on edge hardware)
4. Classify: healthy / blast / blight / sheath rot
5. Log GPS coordinates of diseased patches
6. Transmit summary (not raw images) over LoRa radio`,
      analogy: 'Deployment is like translating a research paper into a field manual. The paper has all the theory, proofs, and nuance (the full-precision model). The field manual has step-by-step instructions that a soldier can follow under fire (the quantized edge model). Some nuance is lost, but the core information survives. The field manual is smaller, faster to read, and works without a library.',
      storyConnection: 'Bonti\'s dragonfly drone does not have a GPU. It has a small processor, a camera, a battery that lasts 30 minutes, and a radio. Every milliwatt matters. Every millisecond of inference time means less battery for flying. The model must be tiny, fast, and accurate enough — not perfect, just good enough to flag disease patches so a farmer can investigate on foot.',
      checkQuestion: 'Your drone model runs at 200ms per frame on a Raspberry Pi. The drone flies at 5 m/s at 10m altitude and the camera covers a 15m x 15m area per frame. How many frames per second do you need, and does 200ms inference meet that requirement?',
      checkAnswer: 'At 5 m/s, the drone moves 5 meters per second. To cover the ground without gaps (15m frame width, moving forward), you need a frame roughly every 15/5 = 3 seconds. At 200ms per frame, you can process 5 frames per second — far more than needed. You can actually process multiple frames and average predictions for better accuracy. Real bottleneck is usually the camera capture rate, not inference speed.',
      codeIntro: 'Simulate the full deployment pipeline: model quantization, inference speed benchmarking, and end-to-end drone field scanning with GPS logging.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === Part 1: Quantization simulation ===
# A model's weights are float32. Quantization maps them to int8.

# Simulate model weights (10000 parameters, normally distributed)
float32_weights = np.random.randn(10000).astype(np.float32) * 0.5

def quantize_to_int8(weights):
    """Symmetric quantization: map float range to [-127, 127]."""
    abs_max = np.max(np.abs(weights))
    scale = abs_max / 127.0
    quantized = np.round(weights / scale).astype(np.int8)
    return quantized, scale

def dequantize(quantized, scale):
    return quantized.astype(np.float32) * scale

q_weights, scale = quantize_to_int8(float32_weights)
reconstructed = dequantize(q_weights, scale)
quant_error = float32_weights - reconstructed

# === Part 2: Inference speed simulation ===
# Simulate matrix multiplication (the core of neural net inference)
# Compare float32 vs int8 compute

def simulate_inference(weights, input_data, n_layers=4):
    """Simulate forward pass timing."""
    x = input_data.copy()
    for _ in range(n_layers):
        # Dense layer simulation
        w = weights[:len(x)]
        if len(w) < len(x):
            w = np.resize(weights, len(x))
        x = x * w  # simplified element-wise (real would be matmul)
        x = np.maximum(0, x)  # ReLU
    return x

# === Part 3: Drone field scanning simulation ===
# Simulate a 200m x 200m paddy field, drone flying in grid pattern

field_size = 200  # meters
frame_coverage = 15  # meters per frame
drone_speed = 5  # m/s
inference_time = 0.2  # seconds (200ms)
flight_altitude = 10  # meters

# Create field with disease patches
field = np.zeros((field_size, field_size))
# Add 5 disease patches at random locations
disease_patches = []
for _ in range(5):
    cx = np.random.randint(20, field_size - 20)
    cy = np.random.randint(20, field_size - 20)
    r = np.random.randint(5, 15)
    disease_patches.append((cx, cy, r))
    yy, xx = np.ogrid[:field_size, :field_size]
    mask = (yy - cy)**2 + (xx - cx)**2 <= r**2
    field[mask] = 1.0

# Simulate drone flight path (boustrophedon / lawn-mower pattern)
frame_centers = []
row_spacing = frame_coverage * 0.8  # 20% overlap
col_spacing = frame_coverage * 0.8

y_positions = np.arange(frame_coverage/2, field_size - frame_coverage/2, row_spacing)
for i, y in enumerate(y_positions):
    x_positions = np.arange(frame_coverage/2, field_size - frame_coverage/2, col_spacing)
    if i % 2 == 1:
        x_positions = x_positions[::-1]  # reverse every other row
    for x in x_positions:
        frame_centers.append((x, y))

# Process each frame: check if disease is present
detections = []
n_true_positive = 0
n_false_negative = 0
n_true_negative = 0
n_false_positive = 0

for fx, fy in frame_centers:
    # Extract frame region
    x1 = max(0, int(fx - frame_coverage/2))
    x2 = min(field_size, int(fx + frame_coverage/2))
    y1 = max(0, int(fy - frame_coverage/2))
    y2 = min(field_size, int(fy + frame_coverage/2))
    frame = field[y1:y2, x1:x2]

    # Ground truth: is there disease in this frame?
    has_disease = np.mean(frame) > 0.05

    # Model prediction (simulated 92% accuracy)
    correct = np.random.random() < 0.92
    predicted_disease = has_disease if correct else not has_disease

    if has_disease and predicted_disease:
        n_true_positive += 1
        detections.append((fx, fy, 'TP'))
    elif has_disease and not predicted_disease:
        n_false_negative += 1
        detections.append((fx, fy, 'FN'))
    elif not has_disease and predicted_disease:
        n_false_positive += 1
        detections.append((fx, fy, 'FP'))
    else:
        n_true_negative += 1

total_frames = len(frame_centers)
total_flight_time = total_frames * frame_coverage / drone_speed
total_distance = total_frames * frame_coverage

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Quantization error distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.hist(quant_error, bins=50, color='#f59e0b', alpha=0.8, edgecolor='none')
ax.axvline(0, color='white', linestyle='--', linewidth=1)
ax.set_title(f'Quantization error (max={np.max(np.abs(quant_error)):.4f})', color='white', fontsize=10)
ax.set_xlabel('Error (float32 - int8)', color='white')
ax.set_ylabel('Count', color='white')
ax.tick_params(colors='gray')

# Plot 2: Weight distributions comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.hist(float32_weights, bins=50, alpha=0.6, color='#3b82f6', label='Float32', edgecolor='none')
ax.hist(reconstructed, bins=50, alpha=0.6, color='#22c55e', label='Int8 (dequantized)', edgecolor='none')
ax.set_title('Weight distribution: original vs quantized', color='white', fontsize=10)
ax.set_xlabel('Weight value', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Model size comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
sizes = {
    'Float32\n(original)': 10000 * 4 / 1024,
    'Int8\n(quantized)': 10000 * 1 / 1024,
    'Pruned 50%\n+ Int8': 5000 * 1 / 1024,
}
bars = ax.bar(sizes.keys(), sizes.values(),
              color=['#3b82f6', '#22c55e', '#a855f7'], edgecolor='none', width=0.5)
ax.set_ylabel('Model size (KB)', color='white')
ax.set_title('Model compression', color='white', fontsize=10)
ax.tick_params(colors='gray')
for bar, size in zip(bars, sizes.values()):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{size:.1f} KB', ha='center', color='white', fontsize=10)

# Plot 4: Drone flight path and detections
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.imshow(field, cmap='RdYlGn_r', extent=[0, field_size, 0, field_size], alpha=0.5)

# Draw flight path
path_x = [fc[0] for fc in frame_centers]
path_y = [fc[1] for fc in frame_centers]
ax.plot(path_x, path_y, color='gray', linewidth=0.3, alpha=0.5)

# Mark detections
for fx, fy, dtype in detections:
    if dtype == 'TP':
        ax.plot(fx, fy, 's', color='#ef4444', markersize=4, alpha=0.8)
    elif dtype == 'FP':
        ax.plot(fx, fy, 'x', color='#f59e0b', markersize=4, alpha=0.8)
    elif dtype == 'FN':
        ax.plot(fx, fy, 'o', color='#3b82f6', markersize=4, alpha=0.6)

ax.set_title('Drone scan: disease detections', color='white', fontsize=10)
ax.set_xlabel('East (m)', color='white')
ax.set_ylabel('North (m)', color='white')
ax.tick_params(colors='gray')

# Plot 5: Confusion matrix
ax = axes[1, 1]
ax.set_facecolor('#111827')
conf = np.array([[n_true_negative, n_false_positive], [n_false_negative, n_true_positive]])
im = ax.imshow(conf, cmap='YlOrRd', aspect='auto')
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(['Pred: Clean', 'Pred: Disease'], color='white', fontsize=9)
ax.set_yticklabels(['True: Clean', 'True: Disease'], color='white', fontsize=9)
labels = ['TN', 'FP', 'FN', 'TP']
for i in range(2):
    for j in range(2):
        ax.text(j, i, f'{labels[i*2+j]}\n{conf[i, j]}',
                ha='center', va='center', color='black', fontsize=12, fontweight='bold')
ax.set_title('Field scan confusion matrix', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 6: Mission summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')

precision = n_true_positive / (n_true_positive + n_false_positive + 1e-10)
recall = n_true_positive / (n_true_positive + n_false_negative + 1e-10)
f1 = 2 * precision * recall / (precision + recall + 1e-10)

summary_lines = [
    ('MISSION SUMMARY', '', '#f59e0b'),
    ('', '', ''),
    ('Field size:', f'{field_size}m x {field_size}m ({field_size**2/10000:.1f} hectares)', 'white'),
    ('Disease patches:', f'{len(disease_patches)}', 'white'),
    ('Total frames:', f'{total_frames}', 'white'),
    ('Flight distance:', f'{total_distance:.0f}m', 'white'),
    ('Flight time:', f'{total_flight_time/60:.1f} minutes', 'white'),
    ('Inference/frame:', f'{inference_time*1000:.0f}ms', 'white'),
    ('', '', ''),
    ('DETECTION METRICS', '', '#f59e0b'),
    ('Precision:', f'{precision:.1%}', '#22c55e'),
    ('Recall:', f'{recall:.1%}', '#22c55e'),
    ('F1 Score:', f'{f1:.1%}', '#22c55e'),
    ('', '', ''),
    ('MODEL SPECS', '', '#f59e0b'),
    ('Original size:', f'{10000*4/1024:.1f} KB (float32)', '#3b82f6'),
    ('Quantized size:', f'{10000*1/1024:.1f} KB (int8)', '#3b82f6'),
    ('Compression:', f'{4:.0f}x', '#3b82f6'),
]

for i, (label, value, color) in enumerate(summary_lines):
    y = 0.95 - i * 0.055
    ax.text(0.05, y, label, color=color, fontsize=9, transform=ax.transAxes,
            family='monospace', fontweight='bold' if 'SUMMARY' in label or 'METRICS' in label or 'SPECS' in label else 'normal')
    ax.text(0.55, y, value, color='white', fontsize=9, transform=ax.transAxes, family='monospace')

plt.tight_layout()
plt.show()

print("End-to-end drone deployment pipeline:")
print(f"  1. Camera: {total_frames} frames at {frame_coverage}m coverage each")
print(f"  2. Resize: 12MP -> 224x224 (150 KB per frame)")
print(f"  3. Inference: {inference_time*1000:.0f}ms per frame (quantized int8 model)")
print(f"  4. Results: {n_true_positive} true positives, {n_false_positive} false alarms")
print(f"  5. Transmit: {n_true_positive + n_false_positive} GPS coordinates (< 1 KB total)")
print()
print("The farmer receives: a map with red dots where disease was detected.")
print("Total data transmitted: a few hundred bytes over LoRa radio.")
print("Total flight time: {:.0f} minutes for {:.1f} hectares.".format(total_flight_time/60, field_size**2/10000))
print()
print("This is the complete pipeline: from convolution kernels (L3-1)")
print("through feature maps (L3-3), transfer learning (L3-4),")
print("augmented training data (L3-5), to a deployed, quantized model")
print("running on a drone over a paddy field. Engineering, not magic.")`,
      challenge: 'Add a power budget: the Raspberry Pi draws 5W, the drone motors draw 50W, and the battery is 50Wh. How long can the drone fly? How much of the field can it cover? What if you reduce inference frequency to every other frame to save CPU power?',
      successHint: 'The journey from "convolution is a kernel sliding over an image" to "a drone scanning a paddy field and transmitting disease locations over radio" is the journey from theory to engineering. Every step matters. A brilliant model that cannot deploy is worth nothing. A mediocre model that runs on a $35 board and saves a farmer\'s crop is worth everything.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Computer Vision Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (image processing fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real CV implementations. Click to start.</p>
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
