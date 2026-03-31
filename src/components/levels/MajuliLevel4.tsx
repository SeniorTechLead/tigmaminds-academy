import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MajuliLevel4() {
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
      title: 'Project Architecture: River Island Change Detector',
      concept: `This capstone builds a complete geospatial analysis tool: a River Island Change Detector that ingests multi-temporal satellite data, quantifies erosion and deposition, predicts future island area, and produces risk maps for community planning. This is the kind of tool that organizations like the Brahmaputra Board and ISRO actually use.

The system has five modules:

1. **Data Ingestion & Preprocessing**: Generates synthetic multi-temporal NDWI imagery representing decades of satellite observations. Handles cloud masking, geometric alignment, and seasonal normalization. In a real deployment, this module would read GeoTIFF files from Landsat/Sentinel-2 archives.

2. **Classification Engine**: Converts NDWI images into binary water/land maps using adaptive thresholding. Accounts for mixed pixels at the water-land boundary using sub-pixel classification. Calculates island area with uncertainty bounds.

3. **Change Analysis Module**: Compares classified images across time to identify erosion (land-to-water) and deposition (water-to-land). Computes erosion rates along specific bank segments. Identifies spatial patterns and hotspots.

4. **Prediction Engine**: Fits statistical models (exponential decay, logistic) to the historical area time series. Incorporates flood frequency analysis to project area under different climate scenarios. Generates probabilistic forecasts with confidence intervals.

5. **Risk Mapping & Dashboard**: Produces a multi-panel output showing historical change, current status, predicted future, and risk zones. Generates actionable recommendations for protection prioritization.

Each lesson builds one module. The final product is a portfolio-quality geospatial analysis tool.`,
      analogy: 'This project is like building a weather station, but for land change. A weather station has sensors (our satellite images), data processing (our classification engine), analysis (our change detection), forecasting (our prediction engine), and communication (our dashboard). Just as a weather station turns raw temperature readings into actionable forecasts, our tool turns raw satellite pixels into actionable erosion predictions.',
      storyConnection: 'The people of Majuli do not need abstract science — they need answers to urgent questions: "Will my village be safe next monsoon?" "Where should we relocate?" "Which bank needs protection first?" Our River Island Change Detector answers these questions with maps and predictions, not guesswork. It transforms the story\'s lament ("the island is disappearing") into engineering intelligence ("the southwest bank will retreat 50 meters this monsoon; evacuate Zone C by May").',
      checkQuestion: 'Why build 5 separate modules instead of one monolithic analysis script?',
      checkAnswer: 'Modularity provides testability (each module can be validated independently against known data), maintainability (updating the prediction model does not require touching the classification code), reusability (the classification engine can serve other projects — any island, any river), and extensibility (adding a new data source, like radar imagery, only requires modifying the ingestion module). This is standard software engineering practice for scientific tools.',
      codeIntro: 'Define the project architecture and build Module 1: Data Ingestion with synthetic multi-temporal satellite imagery.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# RIVER ISLAND CHANGE DETECTOR — Module 1: Data Ingestion
# ============================================================

class IslandImageGenerator:
    """Generates synthetic satellite NDWI imagery of a river island over time."""

    def __init__(self, grid_size=200, island_center=(100, 100),
                 initial_a=70, initial_b=30, pixel_size_m=30):
        self.grid_size = grid_size
        self.center = island_center
        self.initial_a = initial_a  # semi-major axis (pixels)
        self.initial_b = initial_b  # semi-minor axis (pixels)
        self.pixel_size = pixel_size_m
        self.pixel_area_km2 = (pixel_size_m ** 2) / 1e6

    def _island_mask(self, a, b, erosion_profile=None):
        """Create island mask with optional spatially-varying erosion."""
        y, x = np.mgrid[0:self.grid_size, 0:self.grid_size]
        cx, cy = self.center

        # Base elliptical shape with irregularity
        theta = np.arctan2(y - cy, x - cx)
        r_base = 1.0 / np.sqrt((np.cos(theta)/a)**2 + (np.sin(theta)/b)**2)

        # Add natural irregularity (fractal-like coastline)
        irregularity = 0.05 * np.sin(5*theta) + 0.03 * np.sin(11*theta) + 0.02 * np.sin(17*theta)
        r_base *= (1 + irregularity)

        # Apply spatially-varying erosion
        if erosion_profile is not None:
            erosion_factor = 1.0
            for angle_center, angle_width, amount in erosion_profile:
                angular_dist = np.abs(np.mod(theta - angle_center + np.pi, 2*np.pi) - np.pi)
                erosion_factor -= amount * np.exp(-(angular_dist / angle_width)**2)
            r_base *= np.maximum(erosion_factor, 0.3)

        distance = np.sqrt((x - cx)**2 + (y - cy)**2)
        mask = distance < r_base

        return mask

    def generate_ndwi(self, year, base_year=1970):
        """Generate NDWI image for a given year."""
        elapsed = year - base_year

        # Erosion model: southern bank erodes fastest
        erosion_south = min(0.4, 0.005 * elapsed)    # gradual
        erosion_west = min(0.3, 0.004 * elapsed)      # slower
        erosion_east = min(0.15, 0.002 * elapsed)     # slowest

        # Deposition on north bank
        deposition_north = min(0.1, 0.001 * elapsed)

        # Current effective dimensions
        a = self.initial_a * (1 - 0.001 * elapsed)
        b = self.initial_b * (1 - 0.002 * elapsed)

        erosion_profile = [
            (np.pi * 1.5, 0.8, erosion_south),   # south
            (np.pi, 0.6, erosion_west),            # west
            (0, 0.4, erosion_east),                # east
            (np.pi * 0.5, 0.5, -deposition_north), # north (negative = growth)
        ]

        mask = self._island_mask(a, b, erosion_profile)

        # NDWI values
        ndwi = np.where(mask, -0.3 + np.random.normal(0, 0.05, (self.grid_size, self.grid_size)),
                         0.5 + np.random.normal(0, 0.05, (self.grid_size, self.grid_size)))

        # Transition zone (mixed pixels at boundary)
        from scipy.ndimage import binary_dilation, binary_erosion
        boundary = binary_dilation(mask, iterations=2) & ~binary_erosion(mask, iterations=1)
        ndwi[boundary] = np.random.uniform(-0.1, 0.2, np.sum(boundary))

        # Cloud contamination
        cloud_fraction = np.random.uniform(0.01, 0.08)
        cloud_mask = np.random.random((self.grid_size, self.grid_size)) < cloud_fraction
        ndwi[cloud_mask] = np.nan

        return ndwi, mask

    def generate_time_series(self, years):
        """Generate NDWI images for multiple years."""
        series = {}
        for year in years:
            ndwi, mask = self.generate_ndwi(year)
            area_km2 = np.sum(mask) * self.pixel_area_km2
            series[year] = {
                'ndwi': ndwi,
                'true_mask': mask,
                'true_area_km2': area_km2,
            }
        return series

# --- Generate 50-year dataset ---
generator = IslandImageGenerator(grid_size=200, initial_a=70, initial_b=30, pixel_size_m=30)
years = list(range(1975, 2026, 5))
dataset = generator.generate_time_series(years)

# --- Visualize ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Module 1: Synthetic Satellite NDWI Time Series',
             color='white', fontsize=14, fontweight='bold')

display_years = [1975, 1985, 1995, 2005, 2015, 2025]
for idx, (ax, year) in enumerate(zip(axes.flat, display_years)):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    data = dataset[year]
    ndwi = data['ndwi']

    # Display NDWI
    im = ax.imshow(ndwi, cmap='RdYlGn_r', vmin=-0.5, vmax=0.7, aspect='equal')

    # Overlay true boundary
    from matplotlib.colors import ListedColormap
    boundary = np.zeros_like(ndwi)
    mask = data['true_mask']
    # Find boundary pixels
    for dy in [-1, 0, 1]:
        for dx in [-1, 0, 1]:
            shifted = np.roll(np.roll(mask.astype(int), dy, axis=0), dx, axis=1)
            boundary += np.abs(mask.astype(int) - shifted)
    boundary = boundary > 0
    ax.contour(boundary, levels=[0.5], colors=['white'], linewidths=1, alpha=0.7)

    area = data['true_area_km2']
    ax.set_title(f'{year} — {area:.0f} km\²', color='white', fontsize=11)

    # Cloud pixel count
    n_cloud = np.sum(np.isnan(ndwi))
    cloud_pct = n_cloud / ndwi.size * 100
    ax.text(5, 190, f'Cloud: {cloud_pct:.1f}%', color='white', fontsize=8,
            bbox=dict(boxstyle='round', facecolor='#1f2937', alpha=0.8))

plt.tight_layout()
plt.show()

# Summary
print("Data Ingestion Module — Dataset Summary")
print("=" * 55)
print(f"Grid size: {generator.grid_size} x {generator.grid_size} pixels")
print(f"Pixel size: {generator.pixel_size}m ({generator.pixel_area_km2*1e6:.0f} m\²)")
print(f"Time span: {years[0]} - {years[-1]} ({len(years)} images)")
print()
print(f"{'Year':<8} {'Area (km2)':>12} {'Cloud %':>10}")
print("-" * 35)
for year in years:
    d = dataset[year]
    cloud_pct = np.sum(np.isnan(d['ndwi'])) / d['ndwi'].size * 100
    print(f"{year:<8} {d['true_area_km2']:>12.1f} {cloud_pct:>10.1f}")
print()
print(f"Total area change: {dataset[years[0]]['true_area_km2']:.0f} -> {dataset[years[-1]]['true_area_km2']:.0f} km\²")
print(f"Loss: {dataset[years[0]]['true_area_km2'] - dataset[years[-1]]['true_area_km2']:.0f} km\² "
      f"({(1 - dataset[years[-1]]['true_area_km2']/dataset[years[0]]['true_area_km2'])*100:.0f}%)")`,
      challenge: 'Add seasonal variation: generate two images per year (January dry season and August monsoon). The monsoon image should show 10-15% more water area due to flooding of low-lying island margins, even without actual erosion. How does this seasonal effect complicate change detection?',
      successHint: 'Module 1 delivers a realistic synthetic dataset that mimics the challenges of real satellite data: cloud contamination, mixed pixels at boundaries, and progressive erosion concentrated on specific bank segments.',
    },
    {
      title: 'Classification Engine — turning pixels into maps',
      concept: `Module 2 converts raw NDWI values into binary water/land classification. This seems simple (positive NDWI = water, negative = land) but real-world complications make it a significant engineering challenge.

**Adaptive thresholding**: A fixed threshold of NDWI = 0 works in ideal conditions, but in practice the optimal threshold varies with: (1) atmospheric conditions (haze shifts NDWI values), (2) water turbidity (sediment-laden Brahmaputra water has lower NDWI than clear water), and (3) wet soil on the island (waterlogged fields have slightly positive NDWI even though they are "land"). We use **Otsu's method** — an automatic threshold selection algorithm that finds the threshold that minimizes the within-class variance of the NDWI histogram. It works by treating the NDWI image as a bimodal histogram (water peak and land peak) and finding the valley between them.

**Sub-pixel classification**: At 30m Landsat resolution, many coastal pixels are mixed — partly water, partly land. A hard classifier assigns the entire pixel to one class, introducing a systematic error at the boundary. Sub-pixel classification estimates the fraction of water in each pixel using linear spectral unmixing: NDWI_pixel = f_water * NDWI_pure_water + (1 - f_water) * NDWI_pure_land. Solving for f_water gives the water fraction in [0, 1]. This improves area estimates by approximately 5-10%.

**Uncertainty quantification**: Every classification has uncertainty. We quantify it by: (1) varying the threshold by +/- 0.05 and computing the area range, (2) Monte Carlo perturbation of NDWI values within their noise range, and (3) comparing cloud-free vs cloud-masked results. The output is not a single area number but a confidence interval: "Island area = 385 +/- 12 km^2 (95% CI)."`,
      analogy: 'The classification engine is like a sorting machine at a recycling plant. Mixed waste (raw NDWI pixels) comes in on the conveyor belt. The machine must sort every item into "water" or "land." Most items are easy (clearly blue water or clearly green land), but the items on the boundary are ambiguous (wet mud, shallow water, floating vegetation). The quality of the sorting — and the confidence interval on the result — depends on how well the machine handles these ambiguous items.',
      storyConnection: 'When researchers report that "Majuli lost 2.3 km^2 last year," that number came from exactly this kind of classification. The uncertainty matters: if the true loss could be anywhere from 1.5 to 3.1 km^2, the policy response might differ. Our module quantifies this uncertainty, giving decision-makers honest error bars rather than false precision.',
      checkQuestion: 'Why is Otsu\'s method better than a fixed threshold of NDWI = 0 for classifying Brahmaputra imagery?',
      checkAnswer: 'The Brahmaputra is one of the world\'s most sediment-laden rivers. Heavy sediment load reduces water\'s NIR absorption, shifting the NDWI of water downward (closer to 0 or even slightly negative). Meanwhile, wet alluvial soil on the island shifts land\'s NDWI upward. These effects narrow the gap between water and land peaks and shift the optimal threshold away from 0. Otsu\'s method automatically finds the threshold at the valley between the two peaks, adapting to local conditions in each image. A fixed threshold of 0 would misclassify turbid water as land and wet soil as water.',
      codeIntro: 'Build the classification engine with Otsu\'s thresholding, sub-pixel analysis, and uncertainty quantification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# RIVER ISLAND CHANGE DETECTOR — Module 2: Classification Engine
# ============================================================

class ClassificationEngine:
    """Classifies NDWI images into water/land with uncertainty."""

    def __init__(self):
        self.results = {}

    def otsu_threshold(self, ndwi):
        """Find optimal threshold using Otsu's method."""
        # Remove NaN (cloud) pixels
        valid = ndwi[~np.isnan(ndwi)].flatten()

        # Create histogram
        n_bins = 256
        hist, bin_edges = np.histogram(valid, bins=n_bins, range=(-1, 1))
        bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2

        # Otsu's algorithm: find threshold that minimizes within-class variance
        total = hist.sum()
        best_threshold = 0
        best_variance = 0

        sum_total = np.sum(bin_centers * hist)
        sum_bg = 0
        weight_bg = 0

        for i in range(n_bins):
            weight_bg += hist[i]
            if weight_bg == 0:
                continue
            weight_fg = total - weight_bg
            if weight_fg == 0:
                break

            sum_bg += bin_centers[i] * hist[i]
            mean_bg = sum_bg / weight_bg
            mean_fg = (sum_total - sum_bg) / weight_fg

            variance = weight_bg * weight_fg * (mean_bg - mean_fg) ** 2
            if variance > best_variance:
                best_variance = variance
                best_threshold = bin_centers[i]

        return best_threshold

    def classify(self, ndwi, threshold=None):
        """Classify NDWI into water (1), land (0), cloud (-1)."""
        if threshold is None:
            threshold = self.otsu_threshold(ndwi)

        classified = np.full_like(ndwi, -1.0)  # default: cloud/no-data
        valid = ~np.isnan(ndwi)
        classified[valid & (ndwi > threshold)] = 1.0   # water
        classified[valid & (ndwi <= threshold)] = 0.0   # land
        return classified, threshold

    def subpixel_water_fraction(self, ndwi, pure_water=0.5, pure_land=-0.3):
        """Estimate sub-pixel water fraction using linear unmixing."""
        fraction = (ndwi - pure_land) / (pure_water - pure_land)
        fraction = np.clip(fraction, 0, 1)
        fraction[np.isnan(ndwi)] = np.nan
        return fraction

    def area_with_uncertainty(self, ndwi, pixel_area_km2, n_mc=100):
        """Calculate island area with confidence interval."""
        # Base classification
        classified, threshold = self.classify(ndwi)
        base_area = np.sum(classified == 0) * pixel_area_km2

        # Sub-pixel area
        water_frac = self.subpixel_water_fraction(ndwi)
        land_frac = 1 - water_frac
        land_frac[np.isnan(land_frac)] = 0
        subpixel_area = np.sum(land_frac) * pixel_area_km2

        # Monte Carlo uncertainty
        mc_areas = []
        valid_mask = ~np.isnan(ndwi)
        noise_std = 0.05  # NDWI measurement noise
        for _ in range(n_mc):
            perturbed = ndwi.copy()
            perturbed[valid_mask] += np.random.normal(0, noise_std, np.sum(valid_mask))
            cls, _ = self.classify(perturbed, threshold)
            mc_areas.append(np.sum(cls == 0) * pixel_area_km2)

        # Threshold sensitivity
        areas_thresh = []
        for dt in np.linspace(-0.05, 0.05, 20):
            cls, _ = self.classify(ndwi, threshold + dt)
            areas_thresh.append(np.sum(cls == 0) * pixel_area_km2)

        return {
            'hard_area': base_area,
            'subpixel_area': subpixel_area,
            'mc_mean': np.mean(mc_areas),
            'mc_std': np.std(mc_areas),
            'mc_ci_95': (np.percentile(mc_areas, 2.5), np.percentile(mc_areas, 97.5)),
            'threshold': threshold,
            'threshold_sensitivity': (min(areas_thresh), max(areas_thresh)),
        }

# --- Generate test image ---
def generate_test_ndwi(size=200, island_a=60, island_b=25):
    y, x = np.mgrid[0:size, 0:size]
    cx, cy = size//2, size//2
    theta = np.arctan2(y-cy, x-cx)
    r = np.sqrt((x-cx)**2 + (y-cy)**2)
    r_island = 1.0 / np.sqrt((np.cos(theta)/island_a)**2 + (np.sin(theta)/island_b)**2)
    r_island *= (1 + 0.05*np.sin(7*theta) + 0.03*np.sin(13*theta))
    is_land = r < r_island
    ndwi = np.where(is_land, -0.3 + np.random.normal(0, 0.06, (size, size)),
                     0.5 + np.random.normal(0, 0.06, (size, size)))
    # Turbid water zone
    near_coast = (r > r_island * 0.9) & (r < r_island * 1.2) & ~is_land
    ndwi[near_coast] = 0.1 + np.random.normal(0, 0.08, np.sum(near_coast))
    # Cloud
    cloud = np.random.random((size, size)) < 0.03
    ndwi[cloud] = np.nan
    return ndwi, is_land

ndwi_test, true_mask = generate_test_ndwi()
engine = ClassificationEngine()

# --- Full analysis ---
result = engine.area_with_uncertainty(ndwi_test, pixel_area_km2=900e-6)
classified, threshold = engine.classify(ndwi_test)
water_frac = engine.subpixel_water_fraction(ndwi_test)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Classification Engine: NDWI to Water/Land Map',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Raw NDWI
ax = axes[0, 0]
im = ax.imshow(ndwi_test, cmap='RdYlGn_r', vmin=-0.6, vmax=0.8)
ax.set_title('Raw NDWI image', color='white', fontsize=11)
plt.colorbar(im, ax=ax, shrink=0.8, label='NDWI')

# Plot 2: NDWI histogram with Otsu threshold
ax = axes[0, 1]
valid_ndwi = ndwi_test[~np.isnan(ndwi_test)].flatten()
ax.hist(valid_ndwi, bins=100, color='#3b82f6', edgecolor='none', alpha=0.8, density=True)
ax.axvline(x=threshold, color='#ef4444', linewidth=2, linestyle='--',
           label=f'Otsu threshold = {threshold:.3f}')
ax.axvline(x=0, color='#f59e0b', linewidth=1, linestyle=':',
           label='Fixed threshold = 0')
ax.set_xlabel('NDWI', color='white', fontsize=11)
ax.set_ylabel('Density', color='white', fontsize=11)
ax.set_title('NDWI histogram + Otsu threshold', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Hard classification
ax = axes[0, 2]
display = np.where(classified == 0, 0, np.where(classified == 1, 1, 0.5))
ax.imshow(display, cmap='RdYlBu', vmin=0, vmax=1)
ax.set_title('Hard classification (Otsu)', color='white', fontsize=11)

# Plot 4: Sub-pixel water fraction
ax = axes[1, 0]
im = ax.imshow(water_frac, cmap='Blues', vmin=0, vmax=1)
ax.set_title('Sub-pixel water fraction', color='white', fontsize=11)
plt.colorbar(im, ax=ax, shrink=0.8, label='Water fraction')

# Plot 5: Classification accuracy
ax = axes[1, 1]
# Compare to ground truth
true_cls = true_mask.astype(float)  # 1=land, 0=water
predicted_land = (classified == 0)
valid = classified >= 0  # exclude clouds

tp = np.sum(predicted_land & true_mask & valid)  # correct land
tn = np.sum(~predicted_land & ~true_mask & valid)  # correct water
fp = np.sum(predicted_land & ~true_mask & valid)  # water called land
fn = np.sum(~predicted_land & true_mask & valid)  # land called water

accuracy = (tp + tn) / np.sum(valid)
precision = tp / (tp + fp) if (tp + fp) > 0 else 0
recall = tp / (tp + fn) if (tp + fn) > 0 else 0

# Confusion matrix
conf = np.array([[tn, fp], [fn, tp]])
ax.imshow(conf, cmap='Blues', alpha=0.8)
for (j, i), val in np.ndenumerate(conf):
    ax.text(i, j, f'{val}', ha='center', va='center', color='white', fontsize=14, fontweight='bold')
ax.set_xticks([0, 1]); ax.set_xticklabels(['Pred Water', 'Pred Land'], color='white')
ax.set_yticks([0, 1]); ax.set_yticklabels(['True Water', 'True Land'], color='white')
ax.set_title(f'Confusion matrix (Acc={accuracy:.3f})', color='white', fontsize=11)

# Plot 6: Uncertainty analysis
ax = axes[1, 2]
n_mc = 200
mc_areas = []
valid_mask = ~np.isnan(ndwi_test)
for _ in range(n_mc):
    perturbed = ndwi_test.copy()
    perturbed[valid_mask] += np.random.normal(0, 0.05, np.sum(valid_mask))
    cls, _ = engine.classify(perturbed, threshold)
    mc_areas.append(np.sum(cls == 0) * 900e-6)

ax.hist(mc_areas, bins=40, color='#22c55e', edgecolor='none', alpha=0.8, density=True)
ax.axvline(x=result['hard_area'], color='#ef4444', linewidth=2, label='Hard classification')
ax.axvline(x=result['subpixel_area'], color='#3b82f6', linewidth=2, label='Sub-pixel')
ci = result['mc_ci_95']
ax.axvspan(ci[0], ci[1], alpha=0.2, color='#f59e0b', label='95% CI')
ax.set_xlabel('Island area (km\²)', color='white', fontsize=11)
ax.set_ylabel('Density', color='white', fontsize=11)
ax.set_title('Area uncertainty (Monte Carlo)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Classification Engine Results")
print("=" * 55)
print(f"Otsu threshold: {threshold:.4f} (vs fixed 0.0)")
print(f"Hard classification area: {result['hard_area']:.1f} km\²")
print(f"Sub-pixel area: {result['subpixel_area']:.1f} km\²")
print(f"Monte Carlo mean: {result['mc_mean']:.1f} +/- {result['mc_std']:.1f} km\²")
print(f"95% CI: [{ci[0]:.1f}, {ci[1]:.1f}] km\²")
print()
print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"Misclassified pixels: {fp + fn} out of {np.sum(valid)}")`,
      challenge: 'Implement a multi-image composite: generate 5 images for the same year with different cloud patterns, classify each, and take the pixel-wise mode (most common class) as the final classification. Show how this reduces classification error compared to a single image.',
      successHint: 'Module 2 delivers classified maps with honest uncertainty bounds. The Otsu threshold adapts to each image, and the Monte Carlo analysis gives decision-makers confidence intervals rather than false precision.',
    },
    {
      title: 'Change Analysis Module — measuring erosion and deposition',
      concept: `Module 3 compares classified images from different dates to quantify where and how much the island has changed. This is the core analytical engine.

**Pixel-level change detection**: For each pixel, compare classification at time t1 and t2. Four outcomes: (1) Land-Land = stable island. (2) Water-Water = stable water. (3) Land-Water = erosion. (4) Water-Land = deposition. Count pixels in each category and multiply by pixel area to get erosion/deposition in km^2.

**Bank segment analysis**: Rather than reporting a single island-wide erosion number, divide the coastline into segments (N, NE, E, SE, S, SW, W, NW) and compute erosion rate for each. This reveals which banks are eroding fastest — critical for prioritizing protection. The bank retreat rate (m/year) is computed by measuring the distance the water-land boundary has moved along transects perpendicular to the bank.

**Temporal trend analysis**: Plot erosion rate over time to identify acceleration, deceleration, or episodic events. Sudden spikes correspond to major flood events. Gradual trends correspond to climate or land-use changes. The distinction matters: episodic events need emergency response; gradual trends need long-term planning.

**Spatial autocorrelation**: Erosion is not random — it is spatially clustered. Areas near a recently eroded section are more likely to erode next (positive feedback: bank failure undercuts adjacent sections). We compute **Moran's I** (a measure of spatial clustering) to identify erosion hotspots that are likely to expand.`,
      analogy: 'Change analysis is like a time-lapse video of the island, but instead of just watching, you are measuring every change. Imagine placing a grid over the island and checking each square annually: "This square was land, now it is water — erosion." "This square was water, now it is land — deposition." After checking every square for every year, you have a complete quantitative history of the island\'s transformation.',
      storyConnection: 'The villagers of Majuli know which banks are eroding — they have watched their homes fall into the river. Our change analysis module quantifies their experience: "The southern bank retreated 85 meters this year. The western bank retreated 40 meters. The northern bank gained 5 meters." This data validates local knowledge and adds precision for engineering decisions.',
      checkQuestion: 'A change detection between 2020 and 2021 shows 1200 pixels changed from land to water (erosion) and 300 pixels changed from water to land (deposition). At 30m resolution, what is the net area change? Why might the deposition number be an overestimate?',
      checkAnswer: 'Erosion: 1200 * 900 m^2 = 1,080,000 m^2 = 1.08 km^2. Deposition: 300 * 900 m^2 = 270,000 m^2 = 0.27 km^2. Net loss: 0.81 km^2. The deposition might be overestimated because: (1) Some "deposition" pixels may be seasonal — low water level in one image exposed sand bars that were submerged in the other, not true deposition. (2) Geometric misregistration between images creates false changes at high-contrast edges. (3) The 2020 image may have had higher cloud cover, causing more cloud-shadow pixels to be misclassified as water, which then appear as "deposition" when correctly classified in 2021.',
      codeIntro: 'Build the change analysis module with pixel-level detection, bank segment analysis, and erosion trend computation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# RIVER ISLAND CHANGE DETECTOR — Module 3: Change Analysis
# ============================================================

class ChangeAnalyzer:
    """Analyzes land cover changes between classified images."""

    def __init__(self, pixel_area_km2=900e-6):
        self.pixel_area = pixel_area_km2

    def detect_change(self, cls_t1, cls_t2):
        """Pixel-level change detection between two classified images."""
        # Only consider pixels valid in both dates
        valid = (cls_t1 >= 0) & (cls_t2 >= 0)

        stable_land = valid & (cls_t1 == 0) & (cls_t2 == 0)
        stable_water = valid & (cls_t1 == 1) & (cls_t2 == 1)
        erosion = valid & (cls_t1 == 0) & (cls_t2 == 1)
        deposition = valid & (cls_t1 == 1) & (cls_t2 == 0)

        return {
            'stable_land': stable_land,
            'stable_water': stable_water,
            'erosion': erosion,
            'deposition': deposition,
            'erosion_km2': np.sum(erosion) * self.pixel_area,
            'deposition_km2': np.sum(deposition) * self.pixel_area,
            'net_change_km2': (np.sum(deposition) - np.sum(erosion)) * self.pixel_area,
        }

    def bank_segment_analysis(self, erosion_mask, island_center, n_segments=8):
        """Compute erosion area by angular bank segment."""
        y_coords, x_coords = np.where(erosion_mask)
        if len(y_coords) == 0:
            return {f'Segment {i}': 0 for i in range(n_segments)}

        cy, cx = island_center
        angles = np.arctan2(y_coords - cy, x_coords - cx)
        angles = np.mod(angles, 2 * np.pi)

        segment_size = 2 * np.pi / n_segments
        segment_names = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE']
        results = {}
        for i, name in enumerate(segment_names):
            angle_start = i * segment_size
            angle_end = (i + 1) * segment_size
            in_segment = (angles >= angle_start) & (angles < angle_end)
            results[name] = np.sum(in_segment) * self.pixel_area
        return results

    def retreat_rate(self, cls_t1, cls_t2, island_center, n_transects=36, years_between=5):
        """Measure bank retreat along radial transects."""
        cy, cx = island_center
        size = cls_t1.shape[0]
        retreat_rates = {}

        for i in range(n_transects):
            angle = 2 * np.pi * i / n_transects
            direction = ['E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW',
                         'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE',
                         'E2', 'ENE2', 'NE2', 'NNE2', 'N2', 'NNW2', 'NW2', 'WNW2',
                         'W2', 'WSW2', 'SW2', 'SSW2', 'S2', 'SSE2', 'SE2', 'ESE2',
                         'E3', 'ENE3', 'NE3', 'NNE3'][i]

            # Walk along transect from center outward
            max_r = min(size // 2 - 5, 90)
            r_values = np.arange(1, max_r)

            boundary_t1 = None
            boundary_t2 = None
            for r in r_values:
                x = int(cx + r * np.cos(angle))
                y = int(cy + r * np.sin(angle))
                if 0 <= x < size and 0 <= y < size:
                    if boundary_t1 is None and cls_t1[y, x] == 1:
                        boundary_t1 = r
                    if boundary_t2 is None and cls_t2[y, x] == 1:
                        boundary_t2 = r

            if boundary_t1 is not None and boundary_t2 is not None:
                retreat_pixels = boundary_t1 - boundary_t2
                retreat_m = retreat_pixels * 30  # 30m pixels
                retreat_rates[i * 360 // n_transects] = retreat_m / years_between
            else:
                retreat_rates[i * 360 // n_transects] = 0

        return retreat_rates

# --- Generate multi-date classified images ---
def make_island_classified(size=200, a=60, b=25, erosion_south=0, erosion_west=0):
    y, x = np.mgrid[0:size, 0:size]
    cx, cy = size//2, size//2
    theta = np.arctan2(y-cy, x-cx)
    r = np.sqrt((x-cx)**2 + (y-cy)**2)

    # Spatially varying erosion
    b_eff = np.where(theta > np.pi/4, b - erosion_south * np.sin(theta - np.pi/4)**2, b)
    b_eff = np.where(np.abs(theta - np.pi) < np.pi/3, b_eff - erosion_west * np.cos(theta - np.pi)**2, b_eff)
    r_island = 1.0 / np.sqrt((np.cos(theta)/a)**2 + (np.sin(theta)/np.maximum(b_eff, 5))**2)
    r_island *= (1 + 0.04*np.sin(7*theta))

    classified = np.where(r < r_island, 0.0, 1.0)  # 0=land, 1=water
    cloud = np.random.random((size, size)) < 0.02
    classified[cloud] = -1.0
    return classified

dates = [2000, 2005, 2010, 2015, 2020, 2024]
erosion_s = [0, 3, 7, 12, 16, 19]
erosion_w = [0, 2, 4, 7, 9, 11]
classifications = [make_island_classified(erosion_south=es, erosion_west=ew)
                   for es, ew in zip(erosion_s, erosion_w)]

analyzer = ChangeAnalyzer()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Change Analysis: Erosion Detection & Bank Retreat',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1-3: Change maps for selected periods
periods = [(0, 1), (2, 3), (4, 5)]
for idx, (i1, i2) in enumerate(periods):
    ax = axes[0, idx]
    change = analyzer.detect_change(classifications[i1], classifications[i2])

    # Create change map
    change_map = np.full(classifications[0].shape, 0.5)  # gray = no data
    change_map[change['stable_land']] = 0.0    # land = brown
    change_map[change['stable_water']] = 1.0   # water = blue
    change_map[change['erosion']] = 0.8         # erosion = red
    change_map[change['deposition']] = 0.2      # deposition = green

    # Custom colormap
    from matplotlib.colors import LinearSegmentedColormap
    colors_custom = ['#22c55e', '#78350f', '#4b5563', '#ef4444', '#3b82f6']
    cmap = LinearSegmentedColormap.from_list('change', colors_custom, N=256)
    ax.imshow(change_map, cmap=cmap, vmin=0, vmax=1)
    ax.set_title(f'{dates[i1]}-{dates[i2]}: erosion={change["erosion_km2"]:.2f} km\²',
                 color='white', fontsize=10)

# Plot 4: Erosion by bank segment (polar plot)
ax = axes[1, 0]
# Full period change
full_change = analyzer.detect_change(classifications[0], classifications[-1])
segments = analyzer.bank_segment_analysis(full_change['erosion'], (100, 100))

segment_names = list(segments.keys())
segment_values = list(segments.values())

# Create polar-like bar chart
x_pos = np.arange(len(segment_names))
colors_seg = ['#ef4444' if v > np.mean(segment_values) else '#f59e0b' for v in segment_values]
ax.bar(x_pos, segment_values, color=colors_seg, edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels(segment_names, color='white', fontsize=10)
ax.set_ylabel('Erosion area (km\²)', color='white', fontsize=10)
ax.set_title(f'Erosion by bank segment ({dates[0]}-{dates[-1]})', color='white', fontsize=11)

# Plot 5: Erosion & deposition time series
ax = axes[1, 1]
erosion_series = []
deposition_series = []
for i in range(1, len(classifications)):
    change = analyzer.detect_change(classifications[i-1], classifications[i])
    years_gap = dates[i] - dates[i-1]
    erosion_series.append(change['erosion_km2'] / years_gap)
    deposition_series.append(change['deposition_km2'] / years_gap)

mid_dates = [(dates[i] + dates[i-1])/2 for i in range(1, len(dates))]
ax.bar(np.array(mid_dates) - 0.8, erosion_series, 1.5, color='#ef4444',
       label='Erosion rate', edgecolor='none')
ax.bar(np.array(mid_dates) + 0.8, deposition_series, 1.5, color='#22c55e',
       label='Deposition rate', edgecolor='none')
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Rate (km\²/year)', color='white', fontsize=11)
ax.set_title('Erosion vs deposition rates', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Bank retreat polar diagram
ax = axes[1, 2]
retreat = analyzer.retreat_rate(classifications[0], classifications[-1], (100, 100),
                                 n_transects=36, years_between=dates[-1]-dates[0])
angles_deg = list(retreat.keys())
rates = list(retreat.values())

# Polar-like visualization
theta_plot = np.deg2rad(angles_deg)
rates_arr = np.array(rates)
colors_retreat = ['#ef4444' if r > 0 else '#22c55e' for r in rates]

ax_polar = fig.add_axes(ax.get_position(), projection='polar')
ax_polar.set_facecolor('#111827')
ax_polar.bar(theta_plot, np.abs(rates_arr), width=2*np.pi/36,
             color=colors_retreat, alpha=0.8, edgecolor='none')
ax_polar.set_title('Bank retreat rate (m/yr)', color='white', fontsize=11, pad=20)
ax_polar.tick_params(colors='gray')
ax_polar.set_theta_zero_location('E')
ax.set_visible(False)  # hide the cartesian axes behind

plt.tight_layout()
plt.show()

print("Change Analysis Summary ({}-{})".format(dates[0], dates[-1]))
print("=" * 55)
print(f"Total erosion: {full_change['erosion_km2']:.2f} km\²")
print(f"Total deposition: {full_change['deposition_km2']:.2f} km\²")
print(f"Net change: {full_change['net_change_km2']:+.2f} km\²")
print()
print("Erosion by bank segment:")
for name, area in sorted(segments.items(), key=lambda x: -x[1]):
    print(f"  {name:4s}: {area:.3f} km\² {'*** HOTSPOT' if area > np.mean(segment_values)*1.5 else ''}")
print()
print("Erosion rate trend:")
for d, e, dep in zip(mid_dates, erosion_series, deposition_series):
    print(f"  {d:.0f}: erosion={e:.3f}, deposition={dep:.3f}, net={dep-e:+.3f} km\²/yr")`,
      challenge: 'Add a persistence filter: only count a pixel as eroded if it remains water in at least 3 consecutive images (to filter out temporary flooding). How does this change the erosion estimates?',
      successHint: 'Module 3 delivers the quantitative change analysis that conservation agencies need. The bank segment breakdown reveals where protection money should be spent, and the erosion rate trend shows whether the situation is improving or worsening.',
    },
    {
      title: 'Prediction Engine — forecasting Majuli\'s future',
      concept: `Module 4 uses the historical area time series to predict future island area. This is the module that answers the critical question: "How much of Majuli will remain in 2050?"

**Model selection**: We fit three models to the historical data and select the best one:

1. **Linear decay**: A = A0 - r*t. Simple but assumes constant erosion rate regardless of island size. Physically unrealistic for long projections (predicts negative area).

2. **Exponential decay**: A = A0 * exp(-k*t). Assumes erosion rate is proportional to island size. More realistic — as the island shrinks, less bank is exposed, so absolute erosion decreases. But the percentage loss rate stays constant.

3. **Logistic model**: A = A_min + (A0 - A_min) / (1 + exp(k*(t - t_half))). Assumes the island stabilizes at some minimum area A_min (a resistant core). Most realistic — some parts of the island are higher, harder, and more protected, so they resist erosion.

**Climate scenarios**: The prediction engine runs each model under three scenarios: (1) Current climate (historical discharge statistics continue). (2) Moderate climate change (15% increase in extreme floods by 2050). (3) Severe climate change (30% increase in extreme floods by 2050, plus longer monsoon). Each scenario scales the erosion rate parameter.

**Probabilistic forecasting**: Rather than a single prediction, we generate ensemble forecasts by varying model parameters within their uncertainty ranges (estimated from the fitting process). The output is a probability distribution of future area, from which we extract the median, 25th/75th percentiles, and 5th/95th percentiles.`,
      analogy: 'The prediction engine is like a financial projections model. A financial analyst fits a model to historical revenue data, considers economic scenarios (recession, growth, stagnation), and generates probabilistic forecasts ("70% chance revenue exceeds $10M next year"). Our engine does the same with island area instead of revenue, climate scenarios instead of economic scenarios, and erosion physics instead of market dynamics.',
      storyConnection: 'Every news article about Majuli leads with a prediction: "Majuli will disappear by 2050!" But how confident should we be in such claims? Our prediction engine shows that the answer depends heavily on the model chosen and the climate scenario assumed. The exponential model predicts 240 km^2 in 2050; the logistic model predicts 280 km^2. The "disappearing by 2050" headline is sensationalist — but the loss of 20-30% of remaining area is a genuine and quantifiable threat.',
      checkQuestion: 'Why is the logistic model (which predicts the island stabilizes at some minimum area) the most physically realistic of the three models?',
      checkAnswer: 'The logistic model is most realistic because: (1) Not all parts of the island are equally erodible — the core is higher ground with more cohesive sediment, surrounded by higher banks. (2) As the island shrinks, it may reach a shape where the remaining banks are sheltered from the main channel flow. (3) Erosion requires the river to have access to the bank; as channels migrate, previously eroding banks may become sheltered behind new bars. (4) The island\'s central areas have deeper root systems from vegetation that resist erosion more effectively than the margins. The linear and exponential models ignore these stabilizing feedbacks.',
      codeIntro: 'Build the prediction engine with three models, climate scenarios, and probabilistic forecasts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# RIVER ISLAND CHANGE DETECTOR — Module 4: Prediction Engine
# ============================================================

class PredictionEngine:
    """Predicts future island area using multiple models and scenarios."""

    def __init__(self, years, areas):
        self.years = np.array(years, dtype=float)
        self.areas = np.array(areas, dtype=float)
        self.t0 = self.years[0]
        self.A0 = self.areas[0]
        self.models = {}

    def fit_linear(self):
        """Fit linear decay: A = A0 + r*(t-t0)."""
        t = self.years - self.t0
        coeffs = np.polyfit(t, self.areas, 1)
        r = coeffs[0]
        intercept = coeffs[1]
        residuals = self.areas - (r * t + intercept)
        rmse = np.sqrt(np.mean(residuals**2))
        self.models['linear'] = {'r': r, 'intercept': intercept, 'rmse': rmse}
        return self.models['linear']

    def fit_exponential(self):
        """Fit exponential decay: A = A0 * exp(-k*(t-t0))."""
        t = self.years - self.t0
        # Log-linear fit
        log_areas = np.log(self.areas)
        coeffs = np.polyfit(t, log_areas, 1)
        k = -coeffs[0]
        A0_fit = np.exp(coeffs[1])
        predicted = A0_fit * np.exp(-k * t)
        rmse = np.sqrt(np.mean((self.areas - predicted)**2))
        self.models['exponential'] = {'k': k, 'A0': A0_fit, 'rmse': rmse}
        return self.models['exponential']

    def fit_logistic(self, A_min_guess=150):
        """Fit logistic: A = A_min + (A0 - A_min) / (1 + exp(k*(t-t_half)))."""
        t = self.years - self.t0
        # Grid search for best A_min, k, t_half
        best_rmse = np.inf
        best_params = None

        for A_min in np.linspace(50, 300, 50):
            for k_val in np.linspace(0.01, 0.1, 30):
                for t_half in np.linspace(10, 80, 30):
                    predicted = A_min + (self.A0 - A_min) / (1 + np.exp(k_val * (t - t_half)))
                    rmse = np.sqrt(np.mean((self.areas - predicted)**2))
                    if rmse < best_rmse:
                        best_rmse = rmse
                        best_params = (A_min, k_val, t_half)

        A_min, k, t_half = best_params
        self.models['logistic'] = {'A_min': A_min, 'k': k, 't_half': t_half + self.t0,
                                    'rmse': best_rmse}
        return self.models['logistic']

    def predict(self, future_years, model_name, climate_factor=1.0):
        """Predict area for future years under a climate scenario."""
        t = np.array(future_years) - self.t0

        if model_name == 'linear':
            m = self.models['linear']
            return np.maximum(0, m['intercept'] + m['r'] * climate_factor * t)

        elif model_name == 'exponential':
            m = self.models['exponential']
            return m['A0'] * np.exp(-m['k'] * climate_factor * t)

        elif model_name == 'logistic':
            m = self.models['logistic']
            t_half_adj = m['t_half'] - self.t0
            A_min_adj = m['A_min'] / climate_factor
            return A_min_adj + (self.A0 - A_min_adj) / (1 + np.exp(m['k'] * climate_factor * (t - t_half_adj)))

    def ensemble_forecast(self, future_years, model_name, climate_factor=1.0, n_ensemble=500):
        """Generate ensemble forecast with parameter uncertainty."""
        m = self.models[model_name]
        rmse = m['rmse']

        forecasts = np.zeros((n_ensemble, len(future_years)))
        for i in range(n_ensemble):
            # Perturb parameters
            noise_factor = 1 + np.random.normal(0, 0.1)
            base_pred = self.predict(future_years, model_name, climate_factor * noise_factor)
            # Add observation noise
            forecasts[i] = base_pred + np.random.normal(0, rmse, len(future_years))

        return {
            'median': np.median(forecasts, axis=0),
            'p25': np.percentile(forecasts, 25, axis=0),
            'p75': np.percentile(forecasts, 75, axis=0),
            'p5': np.percentile(forecasts, 5, axis=0),
            'p95': np.percentile(forecasts, 95, axis=0),
        }

# --- Historical data ---
hist_years = [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]
hist_areas = [720, 650, 590, 520, 470, 420, 395, 375, 360, 350, 345]

engine = PredictionEngine(hist_years, hist_areas)

# Fit all models
engine.fit_linear()
engine.fit_exponential()
engine.fit_logistic()

# Future years
future = np.arange(2025, 2076)

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Prediction Engine: Majuli Island Area Forecasting',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Model comparison
ax = axes[0, 0]
ax.plot(hist_years, hist_areas, 'o', color='white', markersize=8, zorder=5, label='Observed')

all_years = np.arange(1975, 2076)
for name, color, ls in [('linear', '#ef4444', '-'),
                         ('exponential', '#f59e0b', '--'),
                         ('logistic', '#22c55e', '-.')]:
    pred = engine.predict(all_years, name)
    rmse = engine.models[name]['rmse']
    ax.plot(all_years, pred, color=color, linewidth=2, linestyle=ls,
            label=f'{name.title()} (RMSE={rmse:.1f})')

ax.axvline(x=2024, color='white', linestyle=':', alpha=0.3)
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Island area (km\²)', color='white', fontsize=11)
ax.set_title('Model comparison', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 800)

# Plot 2: Climate scenario comparison (logistic model)
ax = axes[0, 1]
ax.plot(hist_years, hist_areas, 'o', color='white', markersize=6, zorder=5)

scenarios = [
    ('Current climate', 1.0, '#3b82f6'),
    ('Moderate change (+15%)', 1.15, '#f59e0b'),
    ('Severe change (+30%)', 1.30, '#ef4444'),
    ('With protection (-30%)', 0.70, '#22c55e'),
]

for label, factor, color in scenarios:
    pred = engine.predict(future, 'logistic', factor)
    ax.plot(future, pred, color=color, linewidth=2, label=label)

ax.axvline(x=2024, color='white', linestyle=':', alpha=0.3)
ax.axhline(y=200, color='white', linestyle='--', alpha=0.3, label='Critical area')
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Island area (km\²)', color='white', fontsize=11)
ax.set_title('Climate scenarios (logistic model)', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Ensemble forecast with confidence intervals
ax = axes[1, 0]
forecast = engine.ensemble_forecast(future, 'logistic', 1.0, n_ensemble=1000)

ax.fill_between(future, forecast['p5'], forecast['p95'], alpha=0.15, color='#3b82f6',
                label='90% CI')
ax.fill_between(future, forecast['p25'], forecast['p75'], alpha=0.3, color='#3b82f6',
                label='50% CI')
ax.plot(future, forecast['median'], color='#3b82f6', linewidth=2.5, label='Median forecast')
ax.plot(hist_years, hist_areas, 'o', color='white', markersize=6, zorder=5, label='Observed')
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Island area (km\²)', color='white', fontsize=11)
ax.set_title('Probabilistic forecast (logistic, current climate)', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Probability of reaching critical thresholds
ax = axes[1, 1]
thresholds = [300, 250, 200, 150, 100]
for thresh in thresholds:
    # For each year, what fraction of ensemble members are below threshold?
    all_forecasts = np.zeros((1000, len(future)))
    for i in range(1000):
        noise_factor = 1 + np.random.normal(0, 0.1)
        pred = engine.predict(future, 'logistic', noise_factor)
        all_forecasts[i] = pred + np.random.normal(0, engine.models['logistic']['rmse'], len(future))

    prob_below = np.mean(all_forecasts < thresh, axis=0)
    ax.plot(future, prob_below * 100, linewidth=2,
            label=f'P(A < {thresh} km\²)')

ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Probability (%)', color='white', fontsize=11)
ax.set_title('Probability of reaching critical thresholds', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 100)

plt.tight_layout()
plt.show()

# Summary
print("Prediction Engine Results")
print("=" * 60)
print()
print("Model fits:")
for name in ['linear', 'exponential', 'logistic']:
    m = engine.models[name]
    print(f"  {name.title():15s}: RMSE = {m['rmse']:.1f} km\²")

print()
print("Predicted area at 2050 (logistic model):")
for label, factor, _ in scenarios:
    pred = engine.predict([2050], 'logistic', factor)[0]
    print(f"  {label:30s}: {pred:.0f} km\²")

print()
print("Probabilistic forecast at 2050 (current climate):")
print(f"  Median: {forecast['median'][2050-2025]:.0f} km\²")
print(f"  50% CI: [{forecast['p25'][2050-2025]:.0f}, {forecast['p75'][2050-2025]:.0f}] km\²")
print(f"  90% CI: [{forecast['p5'][2050-2025]:.0f}, {forecast['p95'][2050-2025]:.0f}] km\²")`,
      challenge: 'Implement model selection using the Akaike Information Criterion (AIC): AIC = n*ln(RSS/n) + 2k, where n is the number of data points, RSS is the residual sum of squares, and k is the number of parameters. Which model does AIC select, and why?',
      successHint: 'Module 4 delivers probabilistic forecasts that honestly represent uncertainty. The ensemble approach shows that while we cannot predict exact future area, we can quantify the probability of crossing critical thresholds.',
    },
    {
      title: 'Risk Mapping Dashboard — the complete River Island Change Detector',
      concept: `Module 5 integrates all previous modules into a single, deployable dashboard. This is the final product — a tool that takes satellite imagery and produces actionable risk maps and predictions for community planning.

The dashboard has six panels:
1. **Historical change map**: Color-coded island showing stable areas, eroded areas, and deposited areas over the full analysis period.
2. **Area time series**: Observed area with fitted model and future projection including confidence intervals.
3. **Bank segment risk**: Polar diagram showing erosion rate by bank direction, highlighting the most threatened segments.
4. **Monthly risk calendar**: Which months are highest risk, and what is the expected erosion during each.
5. **Scenario comparison**: Side-by-side predictions under current climate, climate change, and with protection measures.
6. **Action recommendations**: Specific, prioritized actions (which banks to protect first, when to evacuate, where to relocate).

The dashboard is designed for two audiences: (1) Technical users (engineers, geologists) who need the quantitative details. (2) Community leaders and policy makers who need clear recommendations in plain language. Every panel serves both audiences — the visualization conveys the message; the numbers provide the precision.`,
      analogy: 'The dashboard is the mission control screen for Majuli\'s survival. Just as NASA\'s mission control integrates telemetry from thousands of sensors into actionable displays that operators can act on in real time, our dashboard integrates satellite data, physics models, and statistical forecasts into actionable recommendations that planners can implement. Each panel is a "flight parameter" for the island.',
      storyConnection: 'The story of Majuli is ongoing — it does not have an ending yet. Our dashboard helps write a better ending. Instead of "the island disappeared because nobody did anything," it enables: "The island stabilized at 280 km^2 because planners used data-driven protection, prioritized the right banks, and allocated resources where the physics said they would be most effective." This is the power of quantitative science applied to a real human crisis.',
      checkQuestion: 'A policy maker looks at the dashboard and asks: "Just tell me — is Majuli going to disappear or not?" How should you answer, and what from the dashboard supports your answer?',
      checkAnswer: 'Answer: "No, Majuli will not disappear, but it will shrink significantly." Evidence: (1) The logistic model (best fit) predicts stabilization around 200-280 km^2, not zero. (2) The ensemble forecast shows less than 5% probability of area dropping below 150 km^2 by 2075 under current climate. (3) With protection measures (the green scenario), area stabilizes around 310 km^2. BUT: (4) Under severe climate change without protection, the 90% CI includes areas as low as 180 km^2 by 2075 — a 50% loss from today. So the island survives, but potentially loses half its remaining area unless protection is implemented.',
      codeIntro: 'Build the complete integrated dashboard combining all modules into a 6-panel risk assessment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# RIVER ISLAND CHANGE DETECTOR — Complete Dashboard
# ============================================================

class IslandChangeDetector:
    """Integrated River Island Change Detection System."""

    def __init__(self, name='Majuli Island'):
        self.name = name

    def generate_dashboard(self):
        # Historical data
        hist_years = np.array([1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024])
        hist_areas = np.array([720, 650, 590, 520, 470, 420, 395, 375, 360, 350, 345])

        # Fit logistic model
        t = hist_years - 1975
        best_rmse, best_p = np.inf, None
        for A_min in np.linspace(100, 300, 40):
            for k in np.linspace(0.02, 0.12, 30):
                for t_half in np.linspace(15, 60, 30):
                    pred = A_min + (720 - A_min) / (1 + np.exp(k * (t - t_half)))
                    rmse = np.sqrt(np.mean((hist_areas - pred)**2))
                    if rmse < best_rmse:
                        best_rmse, best_p = rmse, (A_min, k, t_half)

        A_min, k_fit, t_half = best_p

        def logistic_predict(years, climate_f=1.0):
            t_pred = np.array(years) - 1975
            Amin_adj = A_min / climate_f
            return Amin_adj + (720 - Amin_adj) / (1 + np.exp(k_fit * climate_f * (t_pred - t_half)))

        future_years = np.arange(2025, 2076)

        fig = plt.figure(figsize=(20, 13))
        fig.patch.set_facecolor('#1f2937')
        fig.suptitle(f'RIVER ISLAND CHANGE DETECTOR — {self.name}\\n'
                     f'Analysis period: 1975-2024 | Projection: 2025-2075',
                     color='white', fontsize=16, fontweight='bold')

        # PANEL 1: Historical change map
        ax1 = fig.add_subplot(2, 3, 1)
        ax1.set_facecolor('#111827')
        ax1.tick_params(colors='gray')

        # Create synthetic change map
        size = 150
        y, x = np.mgrid[0:size, 0:size]
        cx, cy = size//2, size//2
        theta = np.arctan2(y-cy, x-cx)
        r = np.sqrt((x-cx)**2 + (y-cy)**2)

        # Historical extent
        a1, b1 = 65, 28
        r_hist = 1.0/np.sqrt((np.cos(theta)/a1)**2 + (np.sin(theta)/b1)**2)
        r_hist *= (1 + 0.04*np.sin(7*theta))

        # Current extent (eroded)
        a2, b2 = 55, 20
        erosion_profile = np.ones_like(theta)
        erosion_profile -= 0.15 * np.exp(-((theta - np.pi*1.5)/0.8)**2)  # south
        erosion_profile -= 0.10 * np.exp(-((theta - np.pi)/0.6)**2)       # west
        r_curr = 1.0/np.sqrt((np.cos(theta)/a2)**2 + (np.sin(theta)/(b2*erosion_profile))**2)
        r_curr *= (1 + 0.04*np.sin(7*theta))

        change_map = np.full((size, size, 3), np.array([0.067, 0.094, 0.157]))  # water #111827
        # Historical island (now eroded) - red
        hist_land = r < r_hist
        change_map[hist_land] = [0.937, 0.267, 0.267]  # #ef4444
        # Current island - green
        curr_land = r < r_curr
        change_map[curr_land] = [0.133, 0.773, 0.369]  # #22c55e

        ax1.imshow(change_map, aspect='equal')
        ax1.set_title('Historical change map', color='white', fontsize=11)
        ax1.text(5, 10, '1975 extent', color='#ef4444', fontsize=8,
                bbox=dict(facecolor='#1f2937', alpha=0.8, boxstyle='round'))
        ax1.text(5, 20, '2024 extent', color='#22c55e', fontsize=8,
                bbox=dict(facecolor='#1f2937', alpha=0.8, boxstyle='round'))

        # PANEL 2: Area time series with projection
        ax2 = fig.add_subplot(2, 3, 2)
        ax2.set_facecolor('#111827')
        ax2.tick_params(colors='gray')

        ax2.plot(hist_years, hist_areas, 'o', color='white', markersize=7, zorder=5, label='Observed')

        # Ensemble forecast
        n_ens = 500
        all_preds = np.zeros((n_ens, len(future_years)))
        for i in range(n_ens):
            cf = 1.0 + np.random.normal(0, 0.08)
            all_preds[i] = logistic_predict(future_years, cf) + np.random.normal(0, best_rmse, len(future_years))

        p5 = np.percentile(all_preds, 5, axis=0)
        p25 = np.percentile(all_preds, 25, axis=0)
        p50 = np.median(all_preds, axis=0)
        p75 = np.percentile(all_preds, 75, axis=0)
        p95 = np.percentile(all_preds, 95, axis=0)

        ax2.fill_between(future_years, p5, p95, alpha=0.12, color='#3b82f6', label='90% CI')
        ax2.fill_between(future_years, p25, p75, alpha=0.25, color='#3b82f6', label='50% CI')
        ax2.plot(future_years, p50, color='#3b82f6', linewidth=2, label='Median forecast')
        ax2.plot(np.arange(1975, 2025), logistic_predict(np.arange(1975, 2025)),
                 '--', color='#3b82f6', linewidth=1, alpha=0.5)
        ax2.axvline(x=2024, color='white', linestyle=':', alpha=0.3)
        ax2.set_xlabel('Year', color='white')
        ax2.set_ylabel('Area (km\²)', color='white')
        ax2.set_title('Area projection with uncertainty', color='white', fontsize=11)
        ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 3: Bank segment risk (polar)
        ax3 = fig.add_subplot(2, 3, 3, projection='polar')
        ax3.set_facecolor('#111827')
        ax3.tick_params(colors='gray')

        segments = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE']
        erosion_by_segment = [0.05, 0.03, 0.01, 0.04, 0.12, 0.18, 0.25, 0.10]
        theta_seg = np.linspace(0, 2*np.pi, len(segments), endpoint=False)
        colors_seg = ['#ef4444' if e > 0.1 else '#f59e0b' if e > 0.05 else '#22c55e'
                      for e in erosion_by_segment]

        bars = ax3.bar(theta_seg, erosion_by_segment, width=2*np.pi/len(segments)*0.8,
                       color=colors_seg, alpha=0.8, edgecolor='none')
        ax3.set_thetagrids(np.degrees(theta_seg), segments)
        ax3.set_title('Erosion by bank segment\\n(km\²/year)', color='white', fontsize=10, pad=15)

        # PANEL 4: Monthly risk calendar
        ax4 = fig.add_subplot(2, 3, 4)
        ax4.set_facecolor('#111827')
        ax4.tick_params(colors='gray')

        month_names = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
        monthly_erosion = [0.01, 0.01, 0.02, 0.05, 0.08, 0.15, 0.20, 0.18, 0.10, 0.04, 0.02, 0.01]
        risk_level = ['LOW', 'LOW', 'LOW', 'MED', 'HIGH', 'CRIT', 'CRIT', 'CRIT', 'HIGH', 'MED', 'LOW', 'LOW']
        colors_month = ['#22c55e' if r=='LOW' else '#f59e0b' if r=='MED' else '#ef4444' if r=='HIGH' else '#dc2626'
                        for r in risk_level]

        bars = ax4.bar(month_names, monthly_erosion, color=colors_month, edgecolor='none')
        for i, (m, e, r) in enumerate(zip(month_names, monthly_erosion, risk_level)):
            ax4.text(i, e + 0.005, r, ha='center', color='white', fontsize=7, fontweight='bold')
        ax4.set_ylabel('Erosion (km\²/month)', color='white')
        ax4.set_title('Monthly erosion risk calendar', color='white', fontsize=11)
        ax4.tick_params(axis='x', labelcolor='white')

        # PANEL 5: Scenario comparison
        ax5 = fig.add_subplot(2, 3, 5)
        ax5.set_facecolor('#111827')
        ax5.tick_params(colors='gray')

        scenarios = [
            ('Current climate', 1.0, '#3b82f6'),
            ('Climate +15%', 1.15, '#f59e0b'),
            ('Climate +30%', 1.30, '#ef4444'),
            ('With protection', 0.70, '#22c55e'),
        ]

        for label, cf, color in scenarios:
            pred = logistic_predict(future_years, cf)
            ax5.plot(future_years, pred, color=color, linewidth=2, label=label)

        ax5.axhline(y=200, color='white', linestyle=':', alpha=0.3)
        ax5.text(2070, 205, 'Critical threshold', color='white', fontsize=8)
        ax5.set_xlabel('Year', color='white')
        ax5.set_ylabel('Area (km\²)', color='white')
        ax5.set_title('Scenario comparison', color='white', fontsize=11)
        ax5.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 6: Action recommendations
        ax6 = fig.add_subplot(2, 3, 6)
        ax6.set_facecolor('#111827')
        ax6.axis('off')

        actions = [
            ('URGENT', '#dc2626', 'Protect S/SW bank (porcupine + vegetation)'),
            ('URGENT', '#dc2626', 'Establish 200m setback for new construction'),
            ('HIGH', '#ef4444', 'Deploy sediment monitoring network'),
            ('HIGH', '#ef4444', 'Update flood early warning system'),
            ('MEDIUM', '#f59e0b', 'Relocate villages within 500m of S bank'),
            ('MEDIUM', '#f59e0b', 'Lobby for upstream dam sediment management'),
            ('LOW', '#22c55e', 'Annual satellite monitoring (October)'),
            ('LOW', '#22c55e', 'Community awareness: monsoon safety protocols'),
        ]

        ax6.text(0.5, 0.98, 'ACTION RECOMMENDATIONS', color='white',
                fontsize=12, fontweight='bold', ha='center', va='top',
                transform=ax6.transAxes)

        for i, (priority, color, text) in enumerate(actions):
            y_pos = 0.88 - i * 0.11
            ax6.text(0.05, y_pos, f'[{priority}]', color=color, fontsize=9,
                    fontweight='bold', transform=ax6.transAxes, va='center')
            ax6.text(0.22, y_pos, text, color='white', fontsize=9,
                    transform=ax6.transAxes, va='center')

        plt.tight_layout(rect=[0, 0, 1, 0.93])
        plt.show()

        return logistic_predict, future_years, p50

# --- Run complete dashboard ---
detector = IslandChangeDetector('Majuli Island, Brahmaputra River')
predict_fn, future_yrs, median_forecast = detector.generate_dashboard()

# Comprehensive text report
print("=" * 70)
print("RIVER ISLAND CHANGE DETECTOR — ASSESSMENT REPORT")
print("=" * 70)
print()
print("ISLAND: Majuli, Brahmaputra River, Assam, India")
print("ANALYSIS: 1975-2024 (49 years of satellite data)")
print()
print("KEY FINDINGS")
print("-" * 70)
print(f"  Area in 1975: ~720 km\²")
print(f"  Area in 2024: ~345 km\²")
print(f"  Total loss: ~375 km\² (52%)")
print(f"  Mean erosion rate: 7.7 km\²/year")
print(f"  Current erosion rate: ~0.8 km\²/year (declining)")
print()
print("PREDICTIONS (logistic model, current climate)")
print(f"  2030: {predict_fn([2030])[0]:.0f} km\²")
print(f"  2040: {predict_fn([2040])[0]:.0f} km\²")
print(f"  2050: {predict_fn([2050])[0]:.0f} km\²")
print(f"  2075: {predict_fn([2075])[0]:.0f} km\²")
print(f"  Stabilization area: ~{predict_fn([2200])[0]:.0f} km\²")
print()
print("CRITICAL BANKS (prioritize for protection)")
print("  1. South bank: 0.25 km\²/year — CRITICAL")
print("  2. Southwest bank: 0.18 km\²/year — CRITICAL")
print("  3. West bank: 0.12 km\²/year — HIGH")
print()
print("SEASONAL RISK: 80% of annual erosion occurs June-September")
print("  Peak risk: July (0.20 km\² in one month)")
print()
print("CLIMATE CHANGE IMPACT")
print(f"  +15% floods: area at 2050 = {predict_fn([2050], 1.15)[0]:.0f} km\² vs {predict_fn([2050])[0]:.0f} baseline")
print(f"  +30% floods: area at 2050 = {predict_fn([2050], 1.30)[0]:.0f} km\²")
print(f"  With protection: area at 2050 = {predict_fn([2050], 0.70)[0]:.0f} km\²")
print()
print("RECOMMENDATION: Implement protection on S/SW banks immediately.")
print("Cost estimate: $5-10M for porcupine + vegetation hybrid approach.")
print("Expected benefit: stabilize area at 310+ km\² instead of 270.")
print()
print("Report generated by River Island Change Detector v1.0")
print("Based on satellite remote sensing, geomorphic modeling, and flood analysis")`,
      challenge: 'Add an interactive "What If" analysis: allow the user to specify a protection budget (in USD) and automatically allocate it across bank segments based on erosion rate and cost-effectiveness. Show the resulting area projection compared to no-protection baseline.',
      successHint: 'You have built a complete geospatial analysis tool from first principles. It integrates remote sensing (satellite classification), geomorphology (change detection), statistics (prediction models), and engineering (risk assessment and recommendations) into a deployable dashboard. This is the kind of tool that ISRO and the Brahmaputra Board actually use to monitor Majuli — and you built it from scratch.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (fluvial geomorphology foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete River Island Change Detector. Click to start.</p>
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
