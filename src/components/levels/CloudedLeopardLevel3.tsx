import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudedLeopardLevel3() {
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
      title: 'Predator-prey dynamics — the Lotka-Volterra equations',
      concept: `The clouded leopard does not exist in isolation — its survival is mathematically coupled to its prey. The **Lotka-Volterra equations** describe this dance between predator and prey populations:

- **dR/dt = aR - bRF** — prey (R) grow exponentially at rate *a*, but get eaten at rate *b* proportional to encounters with predators (F)
- **dF/dt = cbRF - dF** — predators grow when they eat (conversion efficiency *c*), but die at rate *d* without food

These two coupled differential equations produce **oscillating populations**: prey boom → predators boom → prey crash → predators crash → repeat. The oscillations are never perfectly in sync — predator peaks lag behind prey peaks because it takes time for births to translate into population growth.

In real ecosystems, these clean cycles get complicated by carrying capacity, multiple prey species, refugia (safe hiding spots), and environmental stochasticity. But the core insight holds: predator and prey populations are locked in a feedback loop.`,
      analogy: 'Think of a thermostat. When the room gets cold, the heater turns on. When it gets hot, the heater turns off. The temperature oscillates around the set point. Predator-prey dynamics work the same way — too many prey triggers predator growth, which triggers prey decline, which triggers predator decline, which lets prey recover.',
      storyConnection: 'The clouded leopard in the story moved like a ghost through the canopy, rarely seen but always present. That rarity is the Lotka-Volterra equations in action — apex predators are always less abundant than their prey because energy is lost at each trophic level. The leopard\'s secretive nature is an evolutionary response to being on the knife edge of population viability.',
      checkQuestion: 'If you removed all predators from an ecosystem, would prey populations grow forever? What eventually limits them?',
      checkAnswer: 'No. Without predators, prey populations hit their carrying capacity — the maximum the environment can support given food, water, and space. They would overshoot, degrade their habitat (overgrazing), and crash due to starvation and disease. Predators actually stabilize prey populations below carrying capacity, preventing these boom-bust cycles.',
      codeIntro: 'Simulate Lotka-Volterra predator-prey dynamics using Euler integration and visualize the population oscillations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotka-Volterra parameters
a = 1.0    # prey growth rate
b = 0.02   # predation rate
c = 0.5    # conversion efficiency (prey eaten -> new predators)
d = 0.8    # predator death rate

# Initial populations
R0 = 100   # prey (e.g., barking deer)
F0 = 15    # predators (clouded leopards)

# Euler integration
dt = 0.01
T = 30  # simulate 30 years
steps = int(T / dt)

R = np.zeros(steps)
F = np.zeros(steps)
t = np.linspace(0, T, steps)

R[0], F[0] = R0, F0

for i in range(1, steps):
    dR = (a * R[i-1] - b * R[i-1] * F[i-1]) * dt
    dF = (c * b * R[i-1] * F[i-1] - d * F[i-1]) * dt
    R[i] = max(R[i-1] + dR, 0)
    F[i] = max(F[i-1] + dF, 0)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Time series
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(t, R, color='#22c55e', linewidth=2, label='Prey (barking deer)')
ax.plot(t, F, color='#ef4444', linewidth=2, label='Predator (clouded leopard)')
ax.set_xlabel('Time (years)', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Lotka-Volterra predator-prey oscillations', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Phase portrait
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(R, F, color='#a855f7', linewidth=1, alpha=0.8)
ax.plot(R[0], F[0], 'o', color='#22c55e', markersize=10, label='Start')
ax.set_xlabel('Prey population', color='white')
ax.set_ylabel('Predator population', color='white')
ax.set_title('Phase portrait (closed orbit)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Find peaks
from numpy import diff, sign
prey_peaks = np.where((diff(sign(diff(R))) < 0))[0]
pred_peaks = np.where((diff(sign(diff(F))) < 0))[0]

print("Lotka-Volterra simulation results:")
print(f"  Prey oscillation range: {R.min():.0f} - {R.max():.0f}")
print(f"  Predator oscillation range: {F.min():.0f} - {F.max():.0f}")
if len(prey_peaks) > 1:
    period = np.mean(np.diff(t[prey_peaks]))
    print(f"  Approximate cycle period: {period:.1f} years")
print(f"  Equilibrium prey: d/(cb) = {d/(c*b):.0f}")
print(f"  Equilibrium predator: a/b = {a/b:.0f}")
print()
print("Key insight: predator peaks LAG behind prey peaks.")
print("The phase portrait shows a closed orbit — the system cycles forever.")`,
      challenge: 'Add a carrying capacity K for prey: change dR/dt to aR(1-R/K) - bRF. Try K=200. How does the phase portrait change? The orbit should spiral inward to a stable equilibrium instead of cycling forever.',
      successHint: 'You have simulated one of the most famous models in ecology. Every wildlife management plan for clouded leopards must account for these predator-prey dynamics — saving the leopard means saving enough prey habitat to sustain the oscillation.',
    },
    {
      title: 'Camouflage and crypsis — the optics of invisibility',
      concept: `The clouded leopard\'s cloud-shaped markings are not decorative — they are an optical weapon. **Crypsis** is the ability to avoid detection, and it works through multiple mechanisms:

- **Background matching**: colors and patterns that blend with the visual background (bark, dappled light through leaves)
- **Disruptive coloration**: bold patches that break up the animal\'s outline, making it harder to recognize as a coherent shape. The clouded leopard\'s large irregular spots do exactly this.
- **Countershading**: darker on top, lighter below, which counteracts the shadow cast by overhead light, making the animal look flat instead of 3D.

From a physics perspective, camouflage exploits the limitations of visual processing. A predator\'s brain detects edges using **contrast gradients** — sudden changes in brightness or color. Disruptive markings create false edges that do not align with the body outline, confusing the prey\'s edge-detection system.

We can quantify camouflage effectiveness by measuring **contrast energy**: the total edge energy (sum of squared gradient magnitudes) at the body boundary versus inside the pattern. Good camouflage minimizes boundary contrast relative to internal contrast.`,
      analogy: 'Imagine trying to find a puzzle piece that has been placed on top of a completed puzzle. If the piece perfectly continues the surrounding picture, you cannot see its edges. That is background matching. Now imagine a piece painted with bold random stripes — your eye is drawn to the stripes and cannot find the actual edge of the piece. That is disruptive coloration.',
      storyConnection: 'The story describes the clouded leopard appearing and disappearing among the branches as if made of mist. That is disruptive coloration in action — the cloud-shaped patches on its fur break up its body outline against the dappled forest canopy, making it nearly invisible to both prey looking up and observers looking sideways.',
      checkQuestion: 'Why do clouded leopards have large, irregular spots rather than thin stripes like a tiger? Think about the visual background each encounters.',
      checkAnswer: 'Tigers hunt in tall grass where vertical stripes match the grass stems. Clouded leopards live in the forest canopy where light filters through leaves creating large, irregular patches of light and shadow. Their spot pattern matches the spatial frequency of dappled light. Camouflage must match the statistical properties of the specific background habitat.',
      codeIntro: 'Simulate a forest canopy background, generate leopard spot patterns, and measure camouflage effectiveness using edge detection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
size = 200

# Generate dappled forest canopy background using overlapping Gaussian blobs
def make_dappled_background(size, n_blobs=60):
    bg = np.ones((size, size)) * 0.3
    for _ in range(n_blobs):
        cx, cy = np.random.randint(0, size, 2)
        r = np.random.randint(8, 30)
        brightness = np.random.uniform(0.4, 0.9)
        y, x = np.ogrid[-cx:size-cx, -cy:size-cy]
        mask = (x*x + y*y) <= r*r
        bg[mask] = brightness
    return bg

# Generate leopard spot pattern (cloud-shaped blobs)
def make_cloud_spots(size, n_spots=15):
    pattern = np.ones((size, size)) * 0.7  # base tawny color
    for _ in range(n_spots):
        cx, cy = np.random.randint(20, size-20, 2)
        rx, ry = np.random.randint(8, 25, 2)
        angle = np.random.uniform(0, np.pi)
        y, x = np.ogrid[0:size, 0:size]
        xr = (x - cx) * np.cos(angle) + (y - cy) * np.sin(angle)
        yr = -(x - cx) * np.sin(angle) + (y - cy) * np.cos(angle)
        mask = (xr/rx)**2 + (yr/ry)**2 <= 1
        pattern[mask] = np.random.uniform(0.15, 0.35)
    return pattern

# Generate uniform coloring (no camouflage)
def make_uniform(size):
    return np.ones((size, size)) * 0.55

# Compute edge energy (sum of squared gradients)
def edge_energy(img):
    gx = np.diff(img, axis=1)
    gy = np.diff(img, axis=0)
    return np.mean(gx**2) + np.mean(gy**2)

# Create body mask (ellipse in center)
body_mask = np.zeros((size, size), dtype=bool)
cy, cx = size//2, size//2
for y in range(size):
    for x in range(size):
        if ((x-cx)/60)**2 + ((y-cy)/35)**2 <= 1:
            body_mask[y, x] = True

bg = make_dappled_background(size)
spots = make_cloud_spots(size)
uniform = make_uniform(size)

# Composite: place animal on background
scene_camo = bg.copy()
scene_camo[body_mask] = spots[body_mask]

scene_uniform = bg.copy()
scene_uniform[body_mask] = uniform[body_mask]

# Measure boundary contrast
from scipy import ndimage
boundary = ndimage.binary_dilation(body_mask) & ~body_mask

def boundary_contrast(scene, boundary_mask):
    inner = scene[ndimage.binary_erosion(body_mask)]
    outer = scene[boundary_mask]
    return np.mean(np.abs(np.mean(inner) - outer))

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

titles = ['Forest canopy', 'Cloud-spotted leopard', 'Uniform (no camo)',
          'Background edges', 'Camouflaged edges', 'Uniform edges']
images = [bg, scene_camo, scene_uniform]

# Sobel edge detection
def sobel_edges(img):
    gx = np.zeros_like(img)
    gy = np.zeros_like(img)
    gx[:, 1:-1] = img[:, 2:] - img[:, :-2]
    gy[1:-1, :] = img[2:, :] - img[:-2, :]
    return np.sqrt(gx**2 + gy**2)

edges = [sobel_edges(img) for img in images]

for i, (ax, img, title) in enumerate(zip(axes[0], images, titles[:3])):
    ax.imshow(img, cmap='YlGn', vmin=0, vmax=1)
    if i > 0:
        from matplotlib.patches import Ellipse
        ax.add_patch(Ellipse((cx, cy), 120, 70, fill=False,
                     edgecolor='red', linewidth=1, linestyle='--', alpha=0.5))
    ax.set_title(title, color='white', fontsize=10)
    ax.axis('off')

for ax, img, title in zip(axes[1], edges, titles[3:]):
    ax.imshow(img, cmap='hot', vmin=0, vmax=0.5)
    ax.set_title(title, color='white', fontsize=10)
    ax.axis('off')

plt.tight_layout()
plt.show()

e_bg = edge_energy(bg)
e_camo = edge_energy(scene_camo)
e_uni = edge_energy(scene_uniform)

print("Camouflage analysis (edge energy — lower boundary = better camo):")
print(f"  Background only:        edge energy = {e_bg:.6f}")
print(f"  Cloud-spotted leopard:   edge energy = {e_camo:.6f}")
print(f"  Uniform coloring:       edge energy = {e_uni:.6f}")
print(f"  Camo disruption ratio:  {e_camo/e_bg:.3f} (closer to 1.0 = better blending)")
print(f"  Uniform disruption:     {e_uni/e_bg:.3f}")
print()
print("Disruptive coloration works by adding internal edges (spots)")
print("that mask the body outline. The predator's visual system")
print("cannot separate body edges from pattern edges.")`,
      challenge: 'Generate tiger-stripe camouflage (vertical lines) and test it against the same dappled background. Then create a grass background (vertical texture) and compare. Each pattern should perform best in its matching habitat.',
      successHint: 'You have quantified what wildlife photographers know intuitively — the clouded leopard is one of the hardest cats to photograph because its markings genuinely disrupt edge detection, both biological and computational.',
    },
    {
      title: 'Home range analysis — GPS telemetry and spatial statistics',
      concept: `Every clouded leopard occupies a **home range** — the area it uses for foraging, mating, and shelter. Understanding home ranges is critical for conservation: if you protect too small an area, it cannot sustain a viable population.

GPS collars on tagged leopards produce a time series of (latitude, longitude, time) points. From these, ecologists estimate home ranges using several methods:

- **Minimum Convex Polygon (MCP)**: the smallest convex shape enclosing all points. Simple but overestimates area by including unused spaces.
- **Kernel Density Estimation (KDE)**: places a probability "bump" (kernel) at each GPS point and sums them. The resulting surface shows where the animal spends most time. The 95% contour is the home range; the 50% contour is the **core area** (most intensively used).
- **Utilization Distribution (UD)**: the probability density of finding the animal at any point. Derived from KDE.

Key metrics:
- **Home range overlap**: how much two animals share space (competition, mating)
- **Core area ratio**: core area / total range — indicates whether the animal concentrates activity or spreads evenly
- **Temporal patterns**: does the animal use different parts of its range at different times?`,
      analogy: 'Your phone tracks your location all day. If you plotted every GPS point for a month, you would see dense clusters at home, work, and the grocery store (core areas) with thin lines connecting them (travel corridors). Your "home range" is the whole area; your core areas are where you actually spend time. A clouded leopard\'s GPS data looks remarkably similar.',
      storyConnection: 'The clouded leopard in the story had its secret places — the tall tree where it slept, the stream crossing where it hunted, the ridgeline it patrolled at dusk. Each of these is a core area within its home range. The researchers tracking it would see dense GPS clusters at exactly these locations.',
      checkQuestion: 'A male clouded leopard has a home range of 40 km² and a female has 15 km². Why the difference, and what does this tell conservationists about reserve size?',
      checkAnswer: 'Males need larger ranges to overlap with multiple female territories for mating opportunities. This means a reserve must be large enough to contain several male ranges (hundreds of km²) to maintain genetic diversity. A reserve of only 40 km² might hold just one male — a genetic dead end. Conservation planning must account for the sex with the larger range requirement.',
      codeIntro: 'Simulate GPS telemetry data for two clouded leopards, compute home ranges using MCP and KDE, and analyze spatial overlap.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate GPS telemetry for two leopards
def simulate_gps(center, core_areas, n_points=500, noise=0.3):
    """Simulate realistic GPS tracks with core areas and movement."""
    points = []
    weights = [0.4, 0.35, 0.25]  # time spent in each core area
    for ca, w in zip(core_areas, weights):
        n = int(n_points * w)
        pts = np.random.multivariate_normal(ca, [[noise, 0], [0, noise]], n)
        points.append(pts)
    return np.vstack(points)

# Leopard A: male, larger range
cores_a = [[2, 3], [4, 5], [1, 6]]
gps_a = simulate_gps([2.5, 4.5], cores_a, 600, 0.4)

# Leopard B: female, smaller range
cores_b = [[3, 4], [4, 3.5], [3.5, 5]]
gps_b = simulate_gps([3.5, 4], cores_b, 400, 0.25)

# Minimum Convex Polygon
def convex_hull_area(points):
    """Compute MCP area using the shoelace formula on convex hull."""
    from functools import reduce
    # Graham scan for convex hull
    def cross(O, A, B):
        return (A[0]-O[0])*(B[1]-O[1]) - (A[1]-O[1])*(B[0]-O[0])
    pts = sorted(map(tuple, points))
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    hull = lower[:-1] + upper[:-1]
    # Shoelace formula
    n = len(hull)
    area = 0
    for i in range(n):
        j = (i + 1) % n
        area += hull[i][0] * hull[j][1]
        area -= hull[j][0] * hull[i][1]
    return abs(area) / 2, np.array(hull)

area_a, hull_a = convex_hull_area(gps_a)
area_b, hull_b = convex_hull_area(gps_b)

# Kernel Density Estimation
def kde_2d(points, grid_size=100, bandwidth=0.3):
    xmin, xmax = points[:, 0].min()-1, points[:, 0].max()+1
    ymin, ymax = points[:, 1].min()-1, points[:, 1].max()+1
    x_grid = np.linspace(xmin, xmax, grid_size)
    y_grid = np.linspace(ymin, ymax, grid_size)
    X, Y = np.meshgrid(x_grid, y_grid)
    density = np.zeros_like(X)
    for p in points:
        density += np.exp(-((X - p[0])**2 + (Y - p[1])**2) / (2 * bandwidth**2))
    density /= (len(points) * 2 * np.pi * bandwidth**2)
    return X, Y, density, x_grid, y_grid

X_a, Y_a, D_a, _, _ = kde_2d(gps_a)
X_b, Y_b, D_b, _, _ = kde_2d(gps_b)

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# MCP plot
ax = axes[0]
ax.set_facecolor('#111827')
ax.scatter(gps_a[:, 0], gps_a[:, 1], s=3, alpha=0.3, color='#22c55e', label='Male')
ax.scatter(gps_b[:, 0], gps_b[:, 1], s=3, alpha=0.3, color='#f59e0b', label='Female')
hull_a_closed = np.vstack([hull_a, hull_a[0]])
hull_b_closed = np.vstack([hull_b, hull_b[0]])
ax.plot(hull_a_closed[:, 0], hull_a_closed[:, 1], '-', color='#22c55e', linewidth=2)
ax.plot(hull_b_closed[:, 0], hull_b_closed[:, 1], '-', color='#f59e0b', linewidth=2)
ax.set_title(f'MCP: Male={area_a:.1f} km² | Female={area_b:.1f} km²', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlabel('Easting (km)', color='white')
ax.set_ylabel('Northing (km)', color='white')

# KDE - Male
ax = axes[1]
ax.set_facecolor('#111827')
ax.contourf(X_a, Y_a, D_a, levels=20, cmap='Greens', alpha=0.8)
ax.contour(X_a, Y_a, D_a, levels=[np.percentile(D_a, 50), np.percentile(D_a, 95)],
           colors=['white', '#22c55e'], linewidths=[1, 2])
ax.set_title('KDE: Male leopard utilization', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_xlabel('Easting (km)', color='white')

# KDE overlap
ax = axes[2]
ax.set_facecolor('#111827')
ax.contour(X_a, Y_a, D_a, levels=5, colors=['#22c55e'], alpha=0.6, linewidths=1)
ax.contour(X_b, Y_b, D_b, levels=5, colors=['#f59e0b'], alpha=0.6, linewidths=1)
ax.contourf(X_a, Y_a, np.minimum(D_a, D_b), levels=10, cmap='Purples', alpha=0.7)
ax.set_title('Home range overlap', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_xlabel('Easting (km)', color='white')

plt.tight_layout()
plt.show()

# Compute overlap index (Bhattacharyya coefficient)
D_a_norm = D_a / D_a.sum()
D_b_norm = D_b / D_b.sum()
overlap = np.sum(np.sqrt(D_a_norm * D_b_norm))

print("Home range analysis:")
print(f"  Male MCP area:   {area_a:.1f} km²")
print(f"  Female MCP area: {area_b:.1f} km²")
print(f"  Male/female ratio: {area_a/area_b:.1f}x (typical for solitary felids)")
print(f"  Overlap index (Bhattacharyya): {overlap:.3f}")
print(f"    0 = no overlap, 1 = identical ranges")
print()
print("Conservation implication:")
print(f"  To sustain 10 breeding pairs, you need ~{10*area_a:.0f} km² minimum")
print(f"  Plus corridors connecting habitat patches.")`,
      challenge: 'Add a third leopard whose range partially overlaps with the male. Compute pairwise overlap indices for all three pairs. In real conservation, high male-male overlap indicates territorial conflict or insufficient habitat.',
      successHint: 'Home range analysis from GPS telemetry is the backbone of modern wildlife conservation. Every protected area boundary should be informed by this kind of spatial analysis.',
    },
    {
      title: 'Spatial statistics — point pattern analysis for wildlife surveys',
      concept: `When ecologists survey an area, they record where they found signs of clouded leopards (scat, scratch marks, camera trap photos). The resulting **point pattern** contains information about the animal's spatial behavior:

- **Complete spatial randomness (CSR)**: points are scattered like confetti — no preference for any location. This is the null hypothesis.
- **Clustering**: points bunch together, indicating preferred habitats or social aggregation.
- **Regularity**: points are evenly spaced, indicating territorial behavior or competition.

The standard tool for analyzing point patterns is **Ripley's K-function**:

K(r) = (area / n²) * Σᵢ Σⱼ I(dᵢⱼ ≤ r) for i ≠ j

Where I() is 1 if the distance between points i and j is ≤ r. For CSR, K(r) = πr². If K(r) > πr², points are clustered at scale r. If K(r) < πr², points are regular.

We often use L(r) = √(K(r)/π) - r, which is 0 for CSR, positive for clustering, and negative for regularity. This makes visual interpretation easier.`,
      analogy: 'Imagine dropping 100 balls onto a floor with hidden magnets. If magnets attract balls, you get clusters (clustered pattern). If balls repel each other, you get even spacing (regular pattern). If there are no magnets, you get random scatter (CSR). Ripley\'s K-function tells you which type of "magnets" are at work, and at what spatial scale.',
      storyConnection: 'The researchers tracking the clouded leopard placed camera traps across the forest. Some areas had many sightings, others none. Was this because the leopard preferred certain habitats (clustering), or just random chance? Spatial statistics answers this question rigorously, separating habitat preference from sampling noise.',
      checkQuestion: 'Camera trap data shows clouded leopard sightings clustered near water sources. Does this prove the leopard prefers water sources, or could there be an alternative explanation?',
      checkAnswer: 'Clustering near water could also mean (1) camera traps were preferentially placed near water because researchers expected sightings there (sampling bias), (2) prey congregates near water so the leopard follows prey not water (indirect effect), or (3) vegetation is denser near water making camera traps more effective (detection bias). Spatial statistics tells you IF clustering exists, but you need ecological reasoning to determine WHY.',
      codeIntro: 'Generate clustered, random, and regular point patterns, then compute and compare Ripley\'s K-function for each.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
area_size = 10.0
n_points = 80

# Generate three types of point patterns
# 1. Complete Spatial Randomness (CSR)
csr = np.random.uniform(0, area_size, (n_points, 2))

# 2. Clustered (around 5 habitat patches)
def make_clustered(n, n_clusters=5, cluster_std=0.5):
    centers = np.random.uniform(1, area_size-1, (n_clusters, 2))
    points = []
    per_cluster = n // n_clusters
    for c in centers:
        pts = np.random.normal(c, cluster_std, (per_cluster, 2))
        points.append(pts)
    result = np.vstack(points)
    return np.clip(result, 0, area_size)

clustered = make_clustered(n_points)

# 3. Regular (territorial, minimum spacing)
def make_regular(n, min_dist=0.8):
    points = []
    attempts = 0
    while len(points) < n and attempts < 10000:
        p = np.random.uniform(0, area_size, 2)
        if len(points) == 0 or all(np.linalg.norm(p - np.array(q)) > min_dist for q in points):
            points.append(p)
        attempts += 1
    return np.array(points)

regular = make_regular(n_points)

# Ripley's K-function
def ripleys_k(points, area, radii):
    n = len(points)
    area_total = area ** 2
    K = np.zeros(len(radii))
    for ri, r in enumerate(radii):
        count = 0
        for i in range(n):
            dists = np.sqrt(np.sum((points - points[i])**2, axis=1))
            count += np.sum((dists <= r) & (dists > 0))
        K[ri] = (area_total / (n * (n - 1))) * count
    return K

def L_function(K, radii):
    return np.sqrt(K / np.pi) - radii

radii = np.linspace(0.1, 3.0, 30)

K_csr = ripleys_k(csr, area_size, radii)
K_clust = ripleys_k(clustered, area_size, radii)
K_reg = ripleys_k(regular, area_size, radii)

L_csr = L_function(K_csr, radii)
L_clust = L_function(K_clust, radii)
L_reg = L_function(K_reg, radii)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

patterns = [csr, clustered, regular]
names = ['Random (CSR)', 'Clustered (habitat patches)', 'Regular (territorial)']
colors = ['#3b82f6', '#ef4444', '#22c55e']
L_vals = [L_csr, L_clust, L_reg]

for i, (ax, pts, name, color) in enumerate(zip(axes[0], patterns, names, colors)):
    ax.set_facecolor('#111827')
    ax.scatter(pts[:, 0], pts[:, 1], s=20, color=color, alpha=0.7)
    ax.set_xlim(0, area_size)
    ax.set_ylim(0, area_size)
    ax.set_aspect('equal')
    ax.set_title(f'{name} (n={len(pts)})', color='white', fontsize=10)
    ax.tick_params(colors='gray')

for i, (ax, L, name, color) in enumerate(zip(axes[1], L_vals, names, colors)):
    ax.set_facecolor('#111827')
    ax.plot(radii, L, color=color, linewidth=2, label=name)
    ax.axhline(0, color='gray', linestyle='--', linewidth=1, label='CSR expectation')
    ax.fill_between(radii, -0.3, 0.3, alpha=0.1, color='gray')
    ax.set_xlabel('Distance r', color='white')
    ax.set_ylabel('L(r) - r', color='white')
    ax.set_title(f'L-function: {name}', color='white', fontsize=10)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Spatial pattern analysis:")
print(f"  Random (CSR):   L(1.0) = {L_csr[np.argmin(np.abs(radii-1))]:.3f}  (near 0 = random)")
print(f"  Clustered:      L(1.0) = {L_clust[np.argmin(np.abs(radii-1))]:.3f}  (positive = clustered)")
print(f"  Regular:        L(1.0) = {L_reg[np.argmin(np.abs(radii-1))]:.3f}  (negative = regular)")
print()
print("Interpretation for clouded leopard surveys:")
print("  - Clustered sightings suggest habitat preference (specific forest patches)")
print("  - Regular spacing suggests territorial behavior")
print("  - The scale at which clustering peaks tells you the habitat patch size")`,
      challenge: 'Generate a pattern that is clustered at small scales (within habitat patches) but regular at large scales (patches are evenly spaced due to territorial boundaries). This mixed pattern is common in real wildlife data. Compute L(r) and verify it is positive for small r and negative for large r.',
      successHint: 'Spatial statistics gives conservationists a rigorous framework for understanding wildlife distribution. Without it, you are just drawing circles on a map and hoping for the best.',
    },
    {
      title: 'Species distribution modeling — predicting where leopards could live',
      concept: `You know where clouded leopards HAVE been seen. But where COULD they live? **Species Distribution Modeling (SDM)** answers this by relating occurrence points to environmental variables:

- **Predictor variables**: elevation, canopy cover, distance to water, rainfall, temperature, human disturbance
- **Response variable**: presence (1) or absence (0) at each location

The simplest SDM is **logistic regression**: fit a sigmoid curve that predicts probability of presence as a function of environmental variables. The output is a continuous probability surface — a map showing where conditions are suitable.

Key concepts:
- **Pseudo-absences**: we rarely know for certain where a species is absent. We generate random background points as pseudo-absences.
- **Environmental envelope**: the range of conditions where the species can survive. Outside this envelope, probability drops to zero.
- **Niche**: the set of environmental conditions where a species can persist. SDMs estimate the realized niche (where it actually lives), which may be smaller than the fundamental niche (where it COULD live) due to competition, predation, or barriers to dispersal.

Model evaluation uses **AUC** (Area Under the ROC Curve): 0.5 = random, 1.0 = perfect discrimination.`,
      analogy: 'Imagine you are a real estate agent who knows a client\'s preferences from houses they have visited (liked: quiet, near park, 3 bedrooms; disliked: noisy, no yard). You can now predict which other houses in the city they would like, even ones they have never seen. SDMs do the same thing for species and habitats — learn preferences from known locations, predict suitability everywhere.',
      storyConnection: 'The story mentions that the clouded leopard was found in dense, undisturbed forest at middle elevations. An SDM would take those observations and identify every other patch of forest in the region with similar conditions — potential habitat corridors and new populations waiting to be discovered.',
      checkQuestion: 'An SDM predicts high suitability for clouded leopards in a forest patch, but no leopards are found there. What are possible explanations?',
      checkAnswer: 'Several: (1) the area is suitable but isolated — no leopards can reach it (dispersal barrier), (2) the area was recently deforested and is recovering — the SDM uses current data but leopards have not returned yet, (3) human disturbance (poaching, roads) makes it unsuitable despite good habitat, (4) a competitor (tiger) excludes the leopard. SDMs predict environmental suitability, not actual presence. The gap between them reveals conservation opportunities and threats.',
      codeIntro: 'Build a species distribution model using logistic regression from scratch — generate environmental layers, fit the model, and produce a habitat suitability map.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
grid_size = 100

# Generate environmental layers
x = np.linspace(0, 10, grid_size)
y = np.linspace(0, 10, grid_size)
X, Y = np.meshgrid(x, y)

# Elevation: increases toward northeast
elevation = 200 + 150 * (X/10) + 100 * (Y/10) + 30 * np.random.randn(grid_size, grid_size)

# Canopy cover: higher in center, lower at edges and high elevation
canopy = 80 - 0.1 * (elevation - 300)**2 / 100 + 10 * np.random.randn(grid_size, grid_size)
canopy = np.clip(canopy, 0, 100)

# Distance to water: distance from two river lines
river1 = 3 + 0.3 * np.sin(X)
river2 = 7 - 0.2 * np.cos(X * 0.5)
dist_water = np.minimum(np.abs(Y - river1), np.abs(Y - river2))

# Human disturbance: high near southwest corner (village)
disturbance = 80 * np.exp(-((X-1)**2 + (Y-1)**2) / 8) + 5 * np.random.randn(grid_size, grid_size)
disturbance = np.clip(disturbance, 0, 100)

# True habitat suitability (for generating presence points)
# Leopard prefers: mid-elevation, high canopy, near water, low disturbance
true_suit = (
    np.exp(-((elevation - 350) / 100)**2) *
    (canopy / 100) *
    np.exp(-(dist_water / 2)**2) *
    (1 - disturbance / 100)
)
true_suit = true_suit / true_suit.max()

# Generate presence points from true suitability
n_presence = 60
n_absence = 200
flat_suit = true_suit.flatten()
probs = flat_suit / flat_suit.sum()
presence_idx = np.random.choice(len(probs), n_presence, replace=False, p=probs)
absence_idx = np.random.choice(len(probs), n_absence, replace=False)

# Extract environmental values at presence/absence points
def get_env_values(indices):
    rows, cols = np.unravel_index(indices, (grid_size, grid_size))
    return np.column_stack([
        elevation[rows, cols],
        canopy[rows, cols],
        dist_water[rows, cols],
        disturbance[rows, cols]
    ])

X_pres = get_env_values(presence_idx)
X_abs = get_env_values(absence_idx)
X_all = np.vstack([X_pres, X_abs])
y_all = np.concatenate([np.ones(n_presence), np.zeros(n_absence)])

# Normalize
mu = X_all.mean(axis=0)
sigma = X_all.std(axis=0)
X_norm = (X_all - mu) / sigma

# Logistic regression from scratch
def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -250, 250)))

def logistic_regression(X, y, lr=0.1, epochs=1000):
    n, d = X.shape
    X_b = np.column_stack([np.ones(n), X])  # add bias
    w = np.zeros(d + 1)
    losses = []
    for epoch in range(epochs):
        z = X_b @ w
        p = sigmoid(z)
        loss = -np.mean(y * np.log(p + 1e-10) + (1-y) * np.log(1-p + 1e-10))
        losses.append(loss)
        grad = X_b.T @ (p - y) / n
        w -= lr * grad
    return w, losses

w, losses = logistic_regression(X_norm, y_all)

# Predict across entire grid
env_grid = np.column_stack([
    elevation.flatten(), canopy.flatten(),
    dist_water.flatten(), disturbance.flatten()
])
env_norm = (env_grid - mu) / sigma
env_b = np.column_stack([np.ones(len(env_norm)), env_norm])
pred_suit = sigmoid(env_b @ w).reshape(grid_size, grid_size)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

layers = [elevation, canopy, dist_water, disturbance, true_suit, pred_suit]
titles = ['Elevation (m)', 'Canopy cover (%)', 'Distance to water',
          'Human disturbance', 'True suitability', 'Predicted suitability (SDM)']
cmaps = ['terrain', 'Greens', 'Blues_r', 'Reds', 'YlGn', 'YlGn']

for ax, layer, title, cmap in zip(axes.flat, layers, titles, cmaps):
    ax.set_facecolor('#111827')
    im = ax.imshow(layer, cmap=cmap, origin='lower', extent=[0,10,0,10])
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    plt.colorbar(im, ax=ax, fraction=0.046)
    if 'suitability' in title.lower() or 'SDM' in title:
        pres_rows, pres_cols = np.unravel_index(presence_idx, (grid_size, grid_size))
        ax.scatter(x[pres_cols], y[pres_rows], s=8, color='red', alpha=0.5, label='Sightings')

plt.tight_layout()
plt.show()

# AUC computation
preds_all = sigmoid(np.column_stack([np.ones(len(X_norm)), X_norm]) @ w)
def compute_auc(y_true, y_pred):
    pos = y_pred[y_true == 1]
    neg = y_pred[y_true == 0]
    auc = 0
    for p in pos:
        auc += np.sum(neg < p) + 0.5 * np.sum(neg == p)
    return auc / (len(pos) * len(neg))

auc = compute_auc(y_all, preds_all)
corr = np.corrcoef(true_suit.flatten(), pred_suit.flatten())[0, 1]

print("Species Distribution Model results:")
print(f"  AUC: {auc:.3f} (>0.7 = useful, >0.9 = excellent)")
print(f"  Correlation with true suitability: {corr:.3f}")
print(f"  Coefficients: elevation={w[1]:.3f}, canopy={w[2]:.3f}, water={w[3]:.3f}, disturbance={w[4]:.3f}")
print()
print("Interpretation:")
if w[2] > 0: print("  + Canopy cover: leopard prefers dense forest")
if w[4] < 0: print("  - Disturbance: leopard avoids human activity")
if w[3] < 0: print("  - Water distance: leopard prefers areas near water")
print()
print("This map tells conservationists exactly where to focus protection efforts.")`,
      challenge: 'Add a climate change scenario: increase elevation by 200m (simulating treeline shift upward) and increase disturbance by 20%. Recompute the suitability map and calculate how much suitable habitat (>0.5 probability) is lost.',
      successHint: 'Species distribution models are used worldwide for conservation planning. Every major wildlife corridor design, reserve boundary, and reintroduction plan relies on SDMs to predict where species can and cannot persist.',
    },
    {
      title: 'Camera trap density estimation — counting the uncountable',
      concept: `You cannot count clouded leopards directly — they are nocturnal, arboreal, and masters of camouflage. Instead, ecologists use **camera traps** and statistical models to estimate population density.

The gold standard is **spatially explicit capture-recapture (SECR)**. Here is how it works:

1. Deploy a grid of camera traps across the study area
2. Over a survey period, cameras photograph animals. Individual leopards are identified by their unique spot patterns.
3. Each individual is "captured" (photographed) at specific trap locations. The pattern of captures reveals:
   - **Detection probability**: how likely a camera is to photograph a leopard that passes by
   - **Movement range**: how far individuals range from their activity center (σ parameter)
   - **Density**: the number of activity centers per unit area (D parameter)

The detection function: the probability of detecting an individual at distance d from its activity center follows a half-normal:

g(d) = g₀ × exp(-d² / 2σ²)

Where g₀ is baseline detection probability and σ is the spatial scale parameter. SECR fits D, g₀, and σ simultaneously using maximum likelihood, properly accounting for animals whose home ranges extend beyond the trap array (edge effects).`,
      analogy: 'Imagine you want to count how many people live in your neighborhood, but you can only observe who passes by a few specific windows. Some people walk by your window often (they live nearby), others rarely (they live far away), some you never see (they exist but are beyond your view). SECR uses the pattern of who you see, where, and how often to estimate the total number of people — including those you never directly observe.',
      storyConnection: 'The researchers studying the clouded leopard would set up camera traps along forest trails and near scratch trees. Each time the leopard triggered a camera, its unique cloud pattern identified it. Over weeks of data, the pattern of captures at different traps revealed not just this leopard, but an estimate of the total population in the forest — including individuals no camera ever photographed.',
      checkQuestion: 'A camera trap survey detects 5 individual clouded leopards. Can you conclude the population is exactly 5? Why or why not?',
      checkAnswer: 'No. Those 5 are just the detected individuals. There are certainly more leopards whose activity centers are far from any trap (low detection probability), or who happened not to trigger any camera during the survey. SECR estimates the total density by modeling the detection process. The actual population could be 8, 12, or even 20 depending on detection probability and the spatial scale of movement. Reporting "we saw 5" without accounting for imperfect detection is the most common error in wildlife surveys.',
      codeIntro: 'Simulate a camera trap survey with known population density, then use maximum likelihood to estimate density from capture histories.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Study area
area_size = 20.0  # km
area = area_size ** 2

# True parameters
true_D = 0.5    # density: 0.5 leopards per km²
true_g0 = 0.15  # baseline detection probability
true_sigma = 2.0  # movement range (km)

# Camera trap grid
trap_spacing = 3.0
trap_x = np.arange(2, area_size - 1, trap_spacing)
trap_y = np.arange(2, area_size - 1, trap_spacing)
traps = np.array([(x, y) for x in trap_x for y in trap_y])
n_traps = len(traps)

# Generate true population
n_animals = np.random.poisson(true_D * area)
activity_centers = np.random.uniform(0, area_size, (n_animals, 2))

# Simulate survey occasions
n_occasions = 10
captures = np.zeros((n_animals, n_traps, n_occasions), dtype=int)

for i in range(n_animals):
    for j in range(n_traps):
        d = np.linalg.norm(activity_centers[i] - traps[j])
        p = true_g0 * np.exp(-d**2 / (2 * true_sigma**2))
        captures[i, j, :] = np.random.binomial(1, p, n_occasions)

# Identify detected individuals (at least one capture)
detected = np.any(captures.reshape(n_animals, -1), axis=1)
n_detected = detected.sum()
det_captures = captures[detected]
det_centers = activity_centers[detected]

# Capture frequency per trap (for detected individuals)
cap_freq = det_captures.sum(axis=2)  # n_detected x n_traps

# Simplified SECR likelihood (maximum likelihood estimation)
def neg_log_likelihood(params, cap_freq, traps, area, n_occasions):
    D, g0, sigma = params
    if D <= 0 or g0 <= 0 or g0 >= 1 or sigma <= 0:
        return 1e10
    n_det = len(cap_freq)
    # Integration points for undetected animals
    n_grid = 20
    gx = np.linspace(0, area_size, n_grid)
    gy = np.linspace(0, area_size, n_grid)
    cell_area = (area_size / n_grid) ** 2

    # Log-likelihood for detected animals
    ll_det = 0
    for i in range(n_det):
        # Integrate over possible activity centers
        likes = []
        for sx in gx:
            for sy in gy:
                s = np.array([sx, sy])
                dists = np.sqrt(np.sum((traps - s)**2, axis=1))
                p_traps = g0 * np.exp(-dists**2 / (2 * sigma**2))
                # Binomial likelihood for this capture history given this center
                log_p = 0
                for j in range(len(traps)):
                    k = cap_freq[i, j]
                    n = n_occasions
                    p = max(min(p_traps[j], 0.999), 0.001)
                    log_p += k * np.log(p) + (n - k) * np.log(1 - p)
                likes.append(np.exp(log_p) * D * cell_area)
        ll_det += np.log(max(sum(likes), 1e-300))

    # Probability of being detected at least once (for any activity center)
    p_detected_total = 0
    for sx in gx:
        for sy in gy:
            s = np.array([sx, sy])
            dists = np.sqrt(np.sum((traps - s)**2, axis=1))
            p_traps = g0 * np.exp(-dists**2 / (2 * sigma**2))
            p_not_det = np.prod((1 - p_traps) ** n_occasions)
            p_detected_total += (1 - p_not_det) * D * cell_area

    # Poisson likelihood for number detected
    expected_detected = max(p_detected_total, 0.01)
    ll_n = n_det * np.log(expected_detected) - expected_detected

    return -(ll_det + ll_n - n_det * np.log(max(p_detected_total, 1e-10)))

# Grid search for best parameters (simplified)
best_nll = 1e10
best_params = None
for D_try in np.arange(0.2, 1.2, 0.1):
    for g0_try in np.arange(0.05, 0.35, 0.05):
        for sig_try in np.arange(1.0, 4.0, 0.5):
            nll = neg_log_likelihood([D_try, g0_try, sig_try], cap_freq, traps, area, n_occasions)
            if nll < best_nll:
                best_nll = nll
                best_params = [D_try, g0_try, sig_try]

est_D, est_g0, est_sigma = best_params

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Study area with traps and animals
ax = axes[0]
ax.set_facecolor('#111827')
ax.scatter(traps[:, 0], traps[:, 1], marker='s', s=50, color='#f59e0b', label='Camera traps', zorder=3)
ax.scatter(activity_centers[~detected, 0], activity_centers[~detected, 1],
           s=30, color='gray', alpha=0.4, label=f'Undetected (n={n_animals-n_detected})')
ax.scatter(det_centers[:, 0], det_centers[:, 1],
           s=50, color='#22c55e', edgecolors='white', linewidth=1, label=f'Detected (n={n_detected})', zorder=4)
ax.set_xlim(0, area_size)
ax.set_ylim(0, area_size)
ax.set_aspect('equal')
ax.set_title('Camera trap array & leopard locations', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper left')
ax.tick_params(colors='gray')
ax.set_xlabel('km', color='white')
ax.set_ylabel('km', color='white')

# Plot 2: Capture frequency heatmap
ax = axes[1]
ax.set_facecolor('#111827')
total_caps = det_captures.sum(axis=(0, 2))
scatter = ax.scatter(traps[:, 0], traps[:, 1], c=total_caps, cmap='hot',
                     s=100, marker='s', edgecolors='gray', linewidth=0.5)
plt.colorbar(scatter, ax=ax, label='Total captures')
ax.set_xlim(0, area_size)
ax.set_ylim(0, area_size)
ax.set_aspect('equal')
ax.set_title('Captures per trap', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_xlabel('km', color='white')

# Plot 3: Detection function
ax = axes[2]
ax.set_facecolor('#111827')
d_range = np.linspace(0, 8, 100)
det_true = true_g0 * np.exp(-d_range**2 / (2 * true_sigma**2))
det_est = est_g0 * np.exp(-d_range**2 / (2 * est_sigma**2))
ax.plot(d_range, det_true, color='#22c55e', linewidth=2, label=f'True: g0={true_g0}, σ={true_sigma}')
ax.plot(d_range, det_est, color='#f59e0b', linewidth=2, linestyle='--',
        label=f'Estimated: g0={est_g0:.2f}, σ={est_sigma:.1f}')
ax.set_xlabel('Distance from activity center (km)', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Half-normal detection function', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Camera trap SECR results:")
print(f"  True population:  {n_animals} leopards in {area:.0f} km²")
print(f"  True density:     {true_D:.2f} /km²")
print(f"  Detected:         {n_detected} individuals ({100*n_detected/n_animals:.0f}%)")
print(f"  Estimated density: {est_D:.2f} /km² (true: {true_D:.2f})")
print(f"  Estimated g0:      {est_g0:.2f} (true: {true_g0:.2f})")
print(f"  Estimated sigma:   {est_sigma:.1f} km (true: {true_sigma:.1f})")
print(f"  Estimated population: {est_D * area:.0f} (true: {n_animals})")
print()
print("Key insight: we detected only {:.0f}% of the population.".format(100*n_detected/n_animals))
print("Without SECR, naive count would underestimate by {:.0f}%.".format(100*(1 - n_detected/n_animals)))`,
      challenge: 'Try different trap spacings (2 km, 4 km, 6 km). How does spacing relative to sigma affect estimation accuracy? When trap spacing >> sigma, many animals fall between traps and are never detected.',
      successHint: 'SECR is the state-of-the-art for estimating wildlife density. Every credible clouded leopard population estimate uses some form of this method. You have built the core from scratch.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Conservation Ecologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real ecology simulations. Click to start.</p>
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
