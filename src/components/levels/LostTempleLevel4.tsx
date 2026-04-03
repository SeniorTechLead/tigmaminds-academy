import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LostTempleLevel4() {
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
      title: 'Capstone Design: Site Discovery Model — from raw LiDAR to confirmed sites',
      concept: `In Level 3 you learned LiDAR filtering, DEM interpolation, edge detection, coordinate transforms, spatial statistics, and classification. Now you build the complete Site Discovery Model: an end-to-end pipeline that ingests raw LiDAR point clouds, processes them through every stage, and outputs a ranked list of probable archaeological sites with confidence scores and GPS coordinates.

The pipeline has six stages:
1. **Point cloud ingestion**: load raw LiDAR data, filter ground returns, compute density statistics.
2. **DEM generation**: IDW interpolation to regular grid, with quality metrics.
3. **Feature extraction**: Sobel edges, gradient statistics, spatial autocorrelation, rectangularity — per candidate region.
4. **Classification**: logistic regression trained on confirmed sites, outputting calibrated probabilities.
5. **Evidence fusion**: combine LiDAR classification with vegetation and moisture layers using Bayesian updating.
6. **Report generation**: ranked site list with coordinates, confidence scores, feature summaries, and visualization.

This is a real-world workflow. Archaeological surveys in Cambodia, Guatemala, and Mexico have discovered thousands of structures using essentially this pipeline — scaled up with more sophisticated classifiers and higher-resolution data.`,
      analogy: 'Building this pipeline is like designing a complete medical screening program. You do not just build a better stethoscope — you design the intake process (point cloud ingestion), the test protocol (feature extraction), the diagnostic algorithm (classification), the second-opinion process (evidence fusion), and the patient report (output). Each stage must work reliably because errors compound through the pipeline.',
      storyConnection: 'The lost temple expedition was ad hoc — follow the map, hack through jungle, hope for the best. The Site Discovery Model is the systematic alternative: scan the entire region from above, process the data through validated algorithms, and rank every candidate location by probability. The temple would appear as the highest-confidence detection in the ranked list, with GPS coordinates accurate to within 1 meter.',
      checkQuestion: 'Why must each pipeline stage produce quality metrics, not just results?',
      checkAnswer: 'Errors propagate and amplify through the pipeline. If ground filtering misclassifies 20% of canopy returns as ground, the DEM will have 20% false elevations, which create false edges, which inflate the feature vectors, which cause false detections. Quality metrics at each stage (e.g., ground return density, DEM interpolation error, edge detection SNR) let you identify where the pipeline is degrading and fix it before errors cascade to the final output.',
      codeIntro: 'Build the point cloud ingestion and ground filtering stage with comprehensive quality metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE: Site Discovery Model
# Stage 1: Point Cloud Ingestion & Ground Filtering
# ============================================================

class LiDARPointCloud:
    """Represents a raw LiDAR point cloud with filtering capabilities."""

    def __init__(self, x, y, z, intensity, return_number, n_returns):
        self.x = np.array(x, dtype=float)
        self.y = np.array(y, dtype=float)
        self.z = np.array(z, dtype=float)
        self.intensity = np.array(intensity, dtype=float)
        self.return_number = np.array(return_number, dtype=int)
        self.n_returns = np.array(n_returns, dtype=int)
        self.n_points = len(x)
        self.classification = np.zeros(self.n_points, dtype=int)  # 0=unclassified

    def summary(self):
        """Print point cloud statistics."""
        return {
            'total_points': self.n_points,
            'x_range': (self.x.min(), self.x.max()),
            'y_range': (self.y.min(), self.y.max()),
            'z_range': (self.z.min(), self.z.max()),
            'mean_intensity': self.intensity.mean(),
            'first_returns': (self.return_number == 1).sum(),
            'last_returns': (self.return_number == self.n_returns).sum(),
            'single_returns': (self.n_returns == 1).sum(),
        }

    def filter_ground(self, cell_size=5.0, height_threshold=2.0):
        """Progressive morphological filter for ground classification.

        Algorithm:
        1. Divide area into cells
        2. Find minimum elevation in each cell (likely ground)
        3. Points within height_threshold of local minimum = ground
        4. Iterate with increasing cell size for robustness
        """
        x_cells = np.floor(self.x / cell_size).astype(int)
        y_cells = np.floor(self.y / cell_size).astype(int)

        # Find minimum Z in each cell
        cell_min = {}
        for i in range(self.n_points):
            key = (x_cells[i], y_cells[i])
            if key not in cell_min or self.z[i] < cell_min[key]:
                cell_min[key] = self.z[i]

        # Classify: points near cell minimum = ground
        for i in range(self.n_points):
            key = (x_cells[i], y_cells[i])
            if self.z[i] - cell_min[key] <= height_threshold:
                self.classification[i] = 2  # ground
            else:
                self.classification[i] = 1  # non-ground (vegetation)

        return self

    def get_ground_points(self):
        mask = self.classification == 2
        return self.x[mask], self.y[mask], self.z[mask]

    def quality_metrics(self):
        """Compute quality metrics for the ground filtering."""
        ground = self.classification == 2
        nonground = self.classification == 1
        area = (self.x.max()-self.x.min()) * (self.y.max()-self.y.min())

        return {
            'ground_points': ground.sum(),
            'ground_pct': ground.mean() * 100,
            'nonground_points': nonground.sum(),
            'point_density': self.n_points / area,
            'ground_density': ground.sum() / area,
            'area_sqm': area,
        }

# --- Simulate realistic LiDAR data ---
area_size = 200  # 200x200m survey area

# True terrain with archaeological features
res = 0.5
gx = np.arange(0, area_size, res)
gy = np.arange(0, area_size, res)
GX, GY = np.meshgrid(gx, gy)
true_terrain = 100 + 0.08*GX + 1.5*np.sin(GX/20)*np.cos(GY/25)

# Temple complex
for wx, wy, ww, wh, wht in [
    (60,70,50,2,3.5), (60,118,50,2,3.5),   # E-W walls
    (60,70,2,50,3.5), (108,70,2,50,3.5),   # N-S walls
    (75,85,20,2,2.0), (75,103,20,2,2.0),   # inner walls
]:
    m = (GX>=wx)&(GX<wx+ww)&(GY>=wy)&(GY<wy+wh)
    true_terrain[m] += wht

# Platform
pm = (GX>62)&(GX<108)&(GY>72)&(GY<118)
true_terrain[pm] += 1.5

# Generate LiDAR points
n_pulses = 80000
px = np.random.uniform(0, area_size, n_pulses)
py = np.random.uniform(0, area_size, n_pulses)

ix = np.clip((px/res).astype(int), 0, len(gx)-1)
iy = np.clip((py/res).astype(int), 0, len(gy)-1)
ground_z = true_terrain[iy, ix] + np.random.normal(0, 0.1, n_pulses)

# Canopy
canopy_z = ground_z + 15 + 12*np.random.random(n_pulses)
is_ground = np.random.random(n_pulses) < 0.25  # 25% penetration
pz = np.where(is_ground, ground_z, canopy_z)
ret_num = np.where(is_ground, 2, 1)
n_ret = np.full(n_pulses, 2)
intensity = np.where(is_ground, 80 + 20*np.random.random(n_pulses),
                     40 + 15*np.random.random(n_pulses))

# Create point cloud and filter
pc = LiDARPointCloud(px, py, pz, intensity, ret_num, n_ret)
pc.filter_ground(cell_size=3.0, height_threshold=2.5)

stats = pc.summary()
quality = pc.quality_metrics()
gx_pts, gy_pts, gz_pts = pc.get_ground_points()

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# All points profile (cross-section)
band = (py > 90) & (py < 95)
axes[0,0].scatter(px[band & (pc.classification==1)], pz[band & (pc.classification==1)],
    s=0.5, c='#22c55e', alpha=0.5, label='Canopy')
axes[0,0].scatter(px[band & (pc.classification==2)], pz[band & (pc.classification==2)],
    s=0.5, c='#f59e0b', alpha=0.5, label='Ground')
axes[0,0].set_title('Cross-section (Y=90-95m)', color='white', fontsize=11)
axes[0,0].set_xlabel('X (m)', color='white')
axes[0,0].set_ylabel('Z (m)', color='white')
axes[0,0].legend(fontsize=8, markerscale=10)

# Ground points top view
sc = axes[0,1].scatter(gx_pts, gy_pts, c=gz_pts, s=0.3, cmap='terrain', alpha=0.6)
axes[0,1].set_title(f'Ground returns ({quality["ground_points"]:,} pts)', color='white', fontsize=11)
axes[0,1].set_aspect('equal')
plt.colorbar(sc, ax=axes[0,1], shrink=0.8, label='Elevation (m)')

# Density map
from collections import Counter
cell_s = 5
density_grid = np.zeros((int(area_size/cell_s), int(area_size/cell_s)))
cx = np.clip((gx_pts/cell_s).astype(int), 0, density_grid.shape[1]-1)
cy = np.clip((gy_pts/cell_s).astype(int), 0, density_grid.shape[0]-1)
for i in range(len(gx_pts)):
    density_grid[cy[i], cx[i]] += 1
density_grid /= cell_s**2  # pts per m²

im = axes[1,0].imshow(density_grid, extent=[0,area_size,0,area_size], origin='lower', cmap='YlOrRd')
axes[1,0].set_title('Ground point density (pts/m²)', color='white', fontsize=11)
plt.colorbar(im, ax=axes[1,0], shrink=0.8)

# Quality metrics text
ax3 = axes[1,1]
metrics_text = f"""Point Cloud Quality Report
{'='*35}
Total points:     {stats['total_points']:>10,}
Survey area:      {quality['area_sqm']:>10,.0f} m²
Point density:    {quality['point_density']:>10.1f} pts/m²

Ground Filtering
{'-'*35}
Ground points:    {quality['ground_points']:>10,}
Ground fraction:  {quality['ground_pct']:>10.1f}%
Ground density:   {quality['ground_density']:>10.1f} pts/m²

Elevation Range
{'-'*35}
Min Z:            {stats['z_range'][0]:>10.1f} m
Max Z:            {stats['z_range'][1]:>10.1f} m
Ground Z range:   {gz_pts.min():>10.1f} - {gz_pts.max():.1f} m"""

ax3.text(0.05, 0.95, metrics_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=8.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax3.set_title('Stage 1: Quality Metrics', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("STAGE 1 COMPLETE: Point Cloud Ingestion & Ground Filtering")
print(f"  {n_pulses:,} pulses -> {quality['ground_points']:,} ground returns")
print(f"  Ground density: {quality['ground_density']:.1f} pts/m² (minimum 2.0 for archaeology)")
print(f"  Status: {'PASS' if quality['ground_density'] > 2.0 else 'FAIL — insufficient density'}")`,
      challenge: 'Implement a second filtering pass with a larger cell size (10m) and compare the ground point counts. Which cell size produces fewer false ground classifications in the canopy?',
      successHint: 'Stage 1 is complete — you have a filtered point cloud with quality metrics ready for DEM generation.',
    },
    {
      title: 'Stage 2: Automated DEM generation with quality assessment',
      concept: `Stage 2 converts the filtered ground points into a gridded DEM with built-in quality assessment. Unlike Level 3 where we implemented basic IDW, the capstone DEM generator must handle real-world complications:

- **Variable point density**: canopy gaps create dense clusters; thick canopy creates voids. The interpolator must detect and flag low-density areas where the DEM is unreliable.
- **Edge artifacts**: IDW produces "bullseye" patterns around isolated points. We detect these by comparing each cell's value to its neighbors.
- **Resolution selection**: too fine creates noise amplification in sparse areas; too coarse loses archaeological detail. We compute an optimal resolution from the point density.
- **Uncertainty quantification**: each DEM cell gets not just an elevation estimate but a confidence interval based on the number and spread of contributing points.

The quality layer is as important as the DEM itself. A DEM cell interpolated from 20 nearby ground returns is trustworthy. A cell interpolated from 2 distant returns is speculative. The classifier downstream must know the difference — otherwise it treats unreliable cells equally, generating false detections in data voids.`,
      analogy: 'A DEM with quality metrics is like a weather forecast with confidence intervals. "Tomorrow will be 25°C" is useful. "Tomorrow will be 25°C ± 2°C with 90% confidence" is much more useful — it tells you how much to trust the prediction. Similarly, "elevation = 52.3m" is useful, but "elevation = 52.3m ± 0.1m based on 15 nearby points" tells the classifier exactly how much to trust that value.',
      storyConnection: 'The old map to the lost temple had no uncertainty markings. Some regions were surveyed carefully; others were sketched from memory. If the map had included confidence zones, the expedition would have known which paths to trust and which to verify. Our DEM quality layer provides exactly that transparency — every cell declares how reliable it is.',
      checkQuestion: 'Why does computing DEM uncertainty from point count alone underestimate the true uncertainty?',
      checkAnswer: 'Point count ignores point distribution. Ten points clustered in one corner of a cell constrain the elevation poorly — the opposite corner is essentially unsampled. Ten points spread evenly across the cell constrain it well. True uncertainty depends on both count and spatial distribution. A robust metric uses the average distance from the cell center to its contributing points: closer and more uniform = lower uncertainty.',
      codeIntro: 'Build the DEM generator with automatic resolution selection, IDW interpolation, and per-cell uncertainty quantification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate ground returns from Stage 1 ---
area = 200
# True terrain with temple
res0 = 0.5
gxs = np.arange(0, area, res0)
gys = np.arange(0, area, res0)
GX, GY = np.meshgrid(gxs, gys)
truth = 100 + 0.08*GX + 1.5*np.sin(GX/20)*np.cos(GY/25)
for wx,wy,ww,wh,wht in [(60,70,50,2,3.5),(60,118,50,2,3.5),(60,70,2,50,3.5),(108,70,2,50,3.5)]:
    m = (GX>=wx)&(GX<wx+ww)&(GY>=wy)&(GY<wy+wh); truth[m] += wht
pm = (GX>62)&(GX<108)&(GY>72)&(GY<118); truth[pm] += 1.5

n_ground = 15000
gx = np.random.uniform(1, area-1, n_ground)
gy = np.random.uniform(1, area-1, n_ground)
ix = np.clip((gx/res0).astype(int), 0, len(gxs)-1)
iy = np.clip((gy/res0).astype(int), 0, len(gys)-1)
gz = truth[iy, ix] + np.random.normal(0, 0.12, n_ground)

# --- DEM Generator ---
class DEMGenerator:
    def __init__(self, points_x, points_y, points_z, area_extent):
        self.px, self.py, self.pz = points_x, points_y, points_z
        self.extent = area_extent  # (xmin, xmax, ymin, ymax)

    def optimal_resolution(self):
        """Compute optimal DEM resolution from point density."""
        area = (self.extent[1]-self.extent[0]) * (self.extent[3]-self.extent[2])
        density = len(self.px) / area
        # Rule of thumb: resolution = 1/sqrt(density) * 2
        res = 2.0 / np.sqrt(density)
        return max(0.5, min(5.0, round(res * 2) / 2))  # snap to 0.5m increments

    def generate(self, resolution=None, n_neighbors=10, power=2):
        """Generate DEM with uncertainty layer."""
        if resolution is None:
            resolution = self.optimal_resolution()

        xmin, xmax, ymin, ymax = self.extent
        dem_x = np.arange(xmin, xmax, resolution)
        dem_y = np.arange(ymin, ymax, resolution)
        DX, DY = np.meshgrid(dem_x, dem_y)

        rows, cols = DX.shape
        dem = np.zeros((rows, cols))
        uncertainty = np.zeros((rows, cols))
        point_count = np.zeros((rows, cols), dtype=int)

        for i in range(rows):
            for j in range(cols):
                cx, cy = DX[i,j], DY[i,j]
                dists = np.sqrt((self.px - cx)**2 + (self.py - cy)**2)
                nearest = np.argsort(dists)[:n_neighbors]
                d = dists[nearest]
                z = self.pz[nearest]

                # IDW
                exact = d < 1e-10
                if np.any(exact):
                    dem[i,j] = z[exact][0]
                    uncertainty[i,j] = 0.05
                else:
                    w = 1.0 / d**power
                    dem[i,j] = np.sum(w * z) / np.sum(w)
                    # Uncertainty: weighted std + distance penalty
                    weighted_var = np.sum(w * (z - dem[i,j])**2) / np.sum(w)
                    dist_penalty = np.mean(d) / 10.0  # farther = less certain
                    uncertainty[i,j] = np.sqrt(weighted_var) + dist_penalty

                # Count points within 2x resolution
                point_count[i,j] = np.sum(dists < resolution * 2)

        return {
            'dem': dem, 'uncertainty': uncertainty, 'point_count': point_count,
            'resolution': resolution, 'x': dem_x, 'y': dem_y,
            'grid_x': DX, 'grid_y': DY,
        }

# --- Generate DEM ---
gen = DEMGenerator(gx, gy, gz, (0, area, 0, area))
opt_res = gen.optimal_resolution()
print(f"Optimal resolution: {opt_res}m (from density {len(gx)/(area**2):.1f} pts/m²)")

result = gen.generate(resolution=2.0, n_neighbors=10)
dem = result['dem']
unc = result['uncertainty']
pc = result['point_count']

# --- Compute slope from DEM ---
dy_grad, dx_grad = np.gradient(dem, 2.0)
slope = np.sqrt(dx_grad**2 + dy_grad**2)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

im0 = axes[0,0].imshow(dem, extent=[0,area,0,area], origin='lower', cmap='terrain')
axes[0,0].set_title(f'DEM (resolution={result["resolution"]}m)', color='white', fontsize=11)
plt.colorbar(im0, ax=axes[0,0], shrink=0.8, label='Elevation (m)')

im1 = axes[0,1].imshow(unc, extent=[0,area,0,area], origin='lower', cmap='YlOrRd')
axes[0,1].set_title('Uncertainty (m)', color='white', fontsize=11)
plt.colorbar(im1, ax=axes[0,1], shrink=0.8, label='Uncertainty (m)')

im2 = axes[1,0].imshow(pc, extent=[0,area,0,area], origin='lower', cmap='viridis')
axes[1,0].set_title('Point count per cell', color='white', fontsize=11)
plt.colorbar(im2, ax=axes[1,0], shrink=0.8, label='Count')

im3 = axes[1,1].imshow(slope, extent=[0,area,0,area], origin='lower', cmap='hot')
axes[1,1].set_title('Slope (edge detection preview)', color='white', fontsize=11)
plt.colorbar(im3, ax=axes[1,1], shrink=0.8, label='Slope (m/m)')

plt.tight_layout()
plt.show()

reliable = unc < 0.5
print(f"\\nSTAGE 2 COMPLETE: DEM Generation")
print(f"  Resolution: {result['resolution']}m")
print(f"  Grid size: {dem.shape[0]} x {dem.shape[1]} cells")
print(f"  Elevation range: {dem.min():.1f} - {dem.max():.1f} m")
print(f"  Reliable cells (uncertainty < 0.5m): {reliable.sum()} ({reliable.mean():.0%})")
print(f"  Mean uncertainty: {unc.mean():.3f} m")
print(f"  Status: {'PASS' if reliable.mean() > 0.7 else 'WARNING — high uncertainty in many cells'}")`,
      challenge: 'Compare DEMs at 1m, 2m, and 4m resolution. At which resolution do the temple walls first become clearly visible in the slope map? What is the trade-off with computation time?',
      successHint: 'Stage 2 is complete — you have a DEM with per-cell uncertainty, ready for feature extraction.',
    },
    {
      title: 'Stage 3: Automated feature extraction over candidate regions',
      concept: `Stage 3 automatically identifies candidate regions in the DEM and extracts feature vectors for each one. This is the bridge between spatial analysis and machine learning.

The candidate detection process:
1. **Compute slope map** from the DEM (Sobel operator).
2. **Threshold** to identify cells with strong gradients (potential edges).
3. **Connected component labeling**: group adjacent high-gradient cells into distinct regions.
4. **Filter by size**: discard regions smaller than 10m² (noise) or larger than 10,000m² (geological features).
5. **Extract bounding box** and compute features for each surviving candidate.

For each candidate, we compute a 10-feature vector:
- Rectangularity, elongation (aspect ratio), area, perimeter-to-area ratio
- Mean elevation anomaly, max gradient, gradient variance
- Direction concentration (how aligned are the edges?)
- Local Moran's I, point density from DEM quality layer

The feature extraction must be robust to noise. A wall partially obscured by vegetation produces weaker gradients — the features should still capture its essential geometry. We use **multi-scale analysis**: compute features at 1m, 2m, and 5m smoothing scales and concatenate them. Real walls persist across scales; noise diminishes.`,
      analogy: 'Candidate detection is like a metal detector on a beach. It beeps at every metallic object — coins, bottle caps, foil wrappers. Feature extraction is the experienced treasure hunter examining each find: "This is round, heavy, has lettering — probably a coin. This is thin, crinkly, lightweight — foil wrapper." The features separate treasure from trash, just as our feature vector separates temples from terrain noise.',
      storyConnection: 'The expedition searched the jungle systematically, grid by grid. When they found something — a mossy stone, a suspicious mound — they examined it carefully: shape, size, orientation, material. That examination is feature extraction. Our algorithm does the same thing across the entire survey area simultaneously, examining every anomaly the way a trained archaeologist would.',
      checkQuestion: 'Why does multi-scale analysis help distinguish archaeological features from noise?',
      checkAnswer: 'Noise is random and scale-dependent — a 1m bump might appear as a strong edge at 1m resolution but vanishes when smoothed to 5m. A 30m temple wall appears at all scales: at 1m it shows fine detail, at 5m it shows gross outline. Features that persist across scales are more likely to be real structures. This is the same principle behind wavelet analysis and image pyramids in computer vision.',
      codeIntro: 'Implement automated candidate detection with connected component labeling and multi-feature extraction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate DEM with multiple features ---
n = 200
res = 1.0
X, Y = np.meshgrid(np.arange(n)*res, np.arange(n)*res)

terrain = 100 + 0.08*X + 1.5*np.sin(X/20)*np.cos(Y/25)
terrain += np.random.normal(0, 0.3, terrain.shape)

# Temple (clear rectangular structure)
for wx,wy,ww,wh in [(60,70,50,2),(60,118,50,2),(60,70,2,50),(108,70,2,50)]:
    m = (X>=wx)&(X<wx+ww)&(Y>=wy)&(Y<wy+wh); terrain[m] += 3.0
terrain[(X>62)&(X<108)&(Y>72)&(Y<118)] += 1.5

# Small shrine
for wx,wy,ww,wh in [(150,30,15,1.5),(150,43.5,15,1.5),(150,30,1.5,15),(163.5,30,1.5,15)]:
    m = (X>=wx)&(X<wx+ww)&(Y>=wy)&(Y<wy+wh); terrain[m] += 2.5

# Natural cliff (linear but not rectangular)
cliff = (Y > 160) & (Y < 163) & (X > 20) & (X < 120)
terrain[cliff] += 4.0

# Boulder field (noise)
for _ in range(30):
    bx, by = np.random.uniform(130,190), np.random.uniform(100,180)
    bm = ((X-bx)**2+(Y-by)**2) < np.random.uniform(4,16)
    terrain[bm] += np.random.uniform(1, 3)

# --- Sobel edge detection ---
def sobel(dem):
    kx = np.array([[-1,0,1],[-2,0,2],[-1,0,1]])
    ky = kx.T
    r, c = dem.shape
    gx, gy = np.zeros_like(dem), np.zeros_like(dem)
    for i in range(1,r-1):
        for j in range(1,c-1):
            p = dem[i-1:i+2, j-1:j+2]
            gx[i,j] = np.sum(p*kx)
            gy[i,j] = np.sum(p*ky)
    return np.sqrt(gx**2+gy**2), np.arctan2(gy, gx)

grad_mag, grad_dir = sobel(terrain)

# --- Connected component labeling ---
def label_components(binary_mask):
    """Simple flood-fill connected component labeling."""
    labels = np.zeros_like(binary_mask, dtype=int)
    current_label = 0
    rows, cols = binary_mask.shape

    for i in range(rows):
        for j in range(cols):
            if binary_mask[i,j] and labels[i,j] == 0:
                current_label += 1
                # BFS flood fill
                queue = [(i,j)]
                while queue:
                    r, c = queue.pop(0)
                    if r<0 or r>=rows or c<0 or c>=cols: continue
                    if not binary_mask[r,c] or labels[r,c] != 0: continue
                    labels[r,c] = current_label
                    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                        queue.append((r+dr, c+dc))

    return labels, current_label

# Threshold edges
edge_thresh = np.percentile(grad_mag, 88)
edges = grad_mag > edge_thresh

# Label connected components
labels, n_components = label_components(edges)

# --- Filter by size and extract features ---
min_area = 15   # m² (at 1m res, = pixels)
max_area = 5000

candidates = []
for lab in range(1, n_components+1):
    mask = labels == lab
    area = mask.sum() * res**2
    if area < min_area or area > max_area:
        continue

    coords = np.argwhere(mask)
    min_r, min_c = coords.min(axis=0)
    max_r, max_c = coords.max(axis=0)

    # Features
    bbox_area = max((max_r-min_r+1)*(max_c-min_c+1), 1)
    rectangularity = mask.sum() / bbox_area
    h = max_r - min_r + 1
    w = max_c - min_c + 1
    elongation = max(h,w) / max(min(h,w), 1)
    perimeter = np.sum(mask & ~(
        np.roll(mask,1,0) & np.roll(mask,-1,0) & np.roll(mask,1,1) & np.roll(mask,-1,1)))
    pa_ratio = perimeter / max(area, 1)

    region_terrain = terrain[min_r:max_r+1, min_c:max_c+1]
    border = np.concatenate([terrain[max(min_r-5,0):min_r, min_c:max_c+1].ravel(),
                            terrain[max_r+1:min(max_r+6,n), min_c:max_c+1].ravel()])
    height_anom = np.mean(region_terrain) - np.mean(border) if len(border) > 0 else 0

    region_grad = grad_mag[min_r:max_r+1, min_c:max_c+1]
    dirs = np.degrees(grad_dir[mask]) % 180
    hist, _ = np.histogram(dirs, bins=18, range=(0,180))
    dir_conc = np.max(hist) / max(np.sum(hist), 1)

    features = {
        'label': lab, 'area': area,
        'bbox': (min_c*res, min_r*res, max_c*res, max_r*res),
        'rectangularity': rectangularity, 'elongation': elongation,
        'pa_ratio': pa_ratio, 'height_anomaly': height_anom,
        'max_gradient': np.max(region_grad), 'grad_std': np.std(region_grad),
        'direction_concentration': dir_conc,
    }
    candidates.append(features)

# --- Score candidates (simple heuristic for now) ---
for c in candidates:
    score = (c['rectangularity'] * 0.3 + (1/max(c['elongation'],1)) * 0.2 +
             min(c['height_anomaly']/3, 1) * 0.3 + c['direction_concentration'] * 0.2)
    c['site_score'] = score

candidates.sort(key=lambda x: x['site_score'], reverse=True)

# --- Plot ---
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')
for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

axes[0].imshow(terrain, extent=[0,n,0,n], origin='lower', cmap='terrain')
axes[0].set_title('DEM', color='white', fontsize=11)

axes[1].imshow(labels > 0, extent=[0,n,0,n], origin='lower', cmap='Greens')
axes[1].set_title(f'Detected edges ({n_components} components)', color='white', fontsize=11)

# Show top candidates
axes[2].imshow(terrain, extent=[0,n,0,n], origin='lower', cmap='terrain', alpha=0.5)
colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']
for i, c in enumerate(candidates[:5]):
    x1,y1,x2,y2 = c['bbox']
    rect = plt.Rectangle((x1,y1), x2-x1, y2-y1, fill=False,
        edgecolor=colors[i%len(colors)], linewidth=2)
    axes[2].add_patch(rect)
    axes[2].text(x1, y2+2, f"#{i+1} ({c['site_score']:.2f})", color=colors[i%len(colors)], fontsize=8)
axes[2].set_title('Top 5 candidates ranked by score', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"STAGE 3 COMPLETE: Feature Extraction")
print(f"  Edge components detected: {n_components}")
print(f"  After size filtering: {len(candidates)} candidates")
print(f"\\nTop 5 candidates:")
for i, c in enumerate(candidates[:5]):
    print(f"  #{i+1}: score={c['site_score']:.3f}, area={c['area']:.0f}m², "
          f"rect={c['rectangularity']:.2f}, height={c['height_anomaly']:.2f}m")`,
      challenge: 'Implement multi-scale analysis: smooth the DEM with 1m, 3m, and 5m Gaussian kernels before edge detection, then combine the candidate lists. Do the true archaeological sites appear in all three scales while noise candidates disappear?',
      successHint: 'Stage 3 is complete — you have candidate regions with feature vectors ready for classification.',
    },
    {
      title: 'Stage 4: Training and evaluating the site classifier',
      concept: `Stage 4 trains a logistic regression classifier on labeled training data and evaluates it with archaeological-appropriate metrics. The key challenge is **class imbalance**: in any survey area, non-sites vastly outnumber sites.

Our training strategy:
1. **Generate balanced training data**: create synthetic terrain patches with and without sites, controlling variation in site size, wall height, and noise level.
2. **Feature normalization**: standardize all features to zero mean, unit variance — essential because features have different scales (area in m² vs. rectangularity in [0,1]).
3. **Train with class weights**: penalize misclassifying a site more heavily than misclassifying a non-site. Weight = n_nonsites / n_sites.
4. **Evaluate with appropriate metrics**: precision, recall, F1, and the precision-recall curve (not ROC, which is misleading under class imbalance).
5. **Threshold optimization**: choose the classification threshold that maximizes F1, not the default 0.5.

The model also needs **calibration**: if it outputs probability 0.8, does that mean 80% of such predictions are actually sites? Poorly calibrated models are dangerous — an overconfident prediction wastes expensive excavation resources on empty ground.`,
      analogy: 'Training the classifier is like training a team of survey assistants. You show them labeled examples of sites and non-sites. You grade their exams (evaluation) with attention to both false alarms (claiming non-sites are sites) and misses (failing to detect real sites). You weight misses more heavily because a missed site is a lost piece of history, while a false alarm is just wasted time. The optimal assistant balances caution with thoroughness.',
      storyConnection: 'The lost temple was found by persistence and luck. A trained classifier replaces luck with probability — systematically scanning the data with learned pattern recognition. It will never have the intuition of a master archaeologist, but it can screen thousands of candidates to find the few worth investigating, like a first-pass filter that ensures no site goes unexamined.',
      checkQuestion: 'Why should we optimize the classification threshold using F1 rather than accuracy?',
      checkAnswer: 'With 99% non-sites, a threshold that always predicts "no site" has 99% accuracy but 0% recall (finds nothing). F1 is the harmonic mean of precision and recall, requiring both to be high. The F1-optimal threshold is typically much lower than 0.5 — perhaps 0.2 — because we want to catch most sites even at the cost of some false alarms. The downstream excavation team can verify candidates; the classifier should err on the side of recall.',
      codeIntro: 'Train a weighted logistic regression classifier with proper evaluation, calibration analysis, and threshold optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate training data ---
def make_patch_features(has_site, n_features=8):
    """Generate synthetic feature vector for a terrain patch."""
    if has_site:
        return np.array([
            np.random.uniform(0.5, 3.0),   # height_anomaly
            np.random.uniform(1.5, 5.0),    # max_gradient
            np.random.uniform(0.3, 1.2),    # gradient_std
            np.random.uniform(0.5, 0.95),   # rectangularity
            np.random.uniform(0.3, 0.7),    # direction_concentration
            np.random.uniform(0.3, 1.5),    # variance_ratio
            np.random.uniform(50, 2000),     # area
            np.random.uniform(1.0, 3.0),    # elongation
        ])
    else:
        return np.array([
            np.random.uniform(-0.5, 1.0),
            np.random.uniform(0.2, 2.5),
            np.random.uniform(0.1, 0.8),
            np.random.uniform(0.1, 0.5),
            np.random.uniform(0.05, 0.3),
            np.random.uniform(0.5, 3.0),
            np.random.uniform(10, 5000),
            np.random.uniform(1.0, 8.0),
        ])

n_sites = 60
n_nonsites = 300  # 5:1 imbalance
X_train_all = []
y_train_all = []
for _ in range(n_sites):
    X_train_all.append(make_patch_features(True))
    y_train_all.append(1)
for _ in range(n_nonsites):
    X_train_all.append(make_patch_features(False))
    y_train_all.append(0)

X_all = np.array(X_train_all)
y_all = np.array(y_train_all)

# Shuffle and split
idx = np.random.permutation(len(y_all))
split = int(0.7 * len(idx))
X_train, X_test = X_all[idx[:split]], X_all[idx[split:]]
y_train, y_test = y_all[idx[:split]], y_all[idx[split:]]

# Normalize
mu, sigma = X_train.mean(0), X_train.std(0) + 1e-8
Xn_train = (X_train - mu) / sigma
Xn_test = (X_test - mu) / sigma

# --- Weighted logistic regression ---
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

# Class weights
n_pos = (y_train == 1).sum()
n_neg = (y_train == 0).sum()
w_pos = n_neg / n_pos  # weight positive class more
w_neg = 1.0

weights = np.where(y_train == 1, w_pos, w_neg)

w = np.zeros(Xn_train.shape[1])
b = 0.0
lr = 0.05

losses = []
for epoch in range(800):
    z = Xn_train @ w + b
    p = sigmoid(z)
    error = p - y_train
    weighted_error = error * weights
    w -= lr * (Xn_train.T @ weighted_error) / len(y_train)
    b -= lr * np.mean(weighted_error)
    loss = -np.mean(weights * (y_train*np.log(p+1e-10) + (1-y_train)*np.log(1-p+1e-10)))
    losses.append(loss)

# --- Threshold optimization ---
probs = sigmoid(Xn_test @ w + b)
thresholds = np.arange(0.1, 0.9, 0.05)
f1_scores = []
for t in thresholds:
    pred = (probs > t).astype(int)
    tp = ((pred==1)&(y_test==1)).sum()
    fp = ((pred==1)&(y_test==0)).sum()
    fn = ((pred==0)&(y_test==1)).sum()
    prec = tp/max(tp+fp,1)
    rec = tp/max(tp+fn,1)
    f1 = 2*prec*rec/max(prec+rec,1e-8)
    f1_scores.append(f1)

best_thresh_idx = np.argmax(f1_scores)
best_thresh = thresholds[best_thresh_idx]
best_f1 = f1_scores[best_thresh_idx]

# Final predictions with optimal threshold
final_pred = (probs > best_thresh).astype(int)
tp = ((final_pred==1)&(y_test==1)).sum()
fp = ((final_pred==1)&(y_test==0)).sum()
fn = ((final_pred==0)&(y_test==1)).sum()
tn = ((final_pred==0)&(y_test==0)).sum()
precision = tp/max(tp+fp,1)
recall = tp/max(tp+fn,1)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Loss curve
axes[0,0].plot(losses, color='#22c55e', linewidth=0.8)
axes[0,0].set_title('Training loss (weighted)', color='white', fontsize=11)
axes[0,0].set_xlabel('Epoch', color='white')
axes[0,0].set_ylabel('Loss', color='white')

# Threshold vs F1
axes[0,1].plot(thresholds, f1_scores, 'o-', color='#f59e0b')
axes[0,1].axvline(best_thresh, color='#22c55e', linestyle='--', label=f'Best: {best_thresh:.2f}')
axes[0,1].set_title(f'Threshold optimization (best F1={best_f1:.3f})', color='white', fontsize=11)
axes[0,1].set_xlabel('Threshold', color='white')
axes[0,1].set_ylabel('F1 Score', color='white')
axes[0,1].legend(fontsize=9)

# Confusion matrix
cm = np.array([[tn,fp],[fn,tp]])
axes[1,0].imshow(cm, cmap='Blues')
for i in range(2):
    for j in range(2):
        axes[1,0].text(j, i, str(cm[i,j]), ha='center', va='center', color='white', fontsize=18, fontweight='bold')
axes[1,0].set_xticks([0,1]); axes[1,0].set_xticklabels(['Non-site','Site'], color='white')
axes[1,0].set_yticks([0,1]); axes[1,0].set_yticklabels(['Non-site','Site'], color='white')
axes[1,0].set_title(f'Confusion matrix', color='white', fontsize=11)

# Score distribution
site_p = probs[y_test==1]
nosite_p = probs[y_test==0]
axes[1,1].hist(nosite_p, bins=20, alpha=0.7, color='#ef4444', label='Non-sites')
axes[1,1].hist(site_p, bins=20, alpha=0.7, color='#22c55e', label='Sites')
axes[1,1].axvline(best_thresh, color='white', linestyle='--', label=f'Threshold={best_thresh:.2f}')
axes[1,1].set_title('Probability distribution', color='white', fontsize=11)
axes[1,1].legend(fontsize=9)
axes[1,1].set_xlabel('Predicted probability', color='white')

plt.tight_layout()
plt.show()

print(f"STAGE 4 COMPLETE: Classifier Training & Evaluation")
print(f"  Training: {n_pos} sites, {n_neg} non-sites (1:{n_neg//n_pos} imbalance)")
print(f"  Class weight for sites: {w_pos:.1f}x")
print(f"  Optimal threshold: {best_thresh:.2f} (vs default 0.50)")
print(f"  Precision: {precision:.3f}")
print(f"  Recall:    {recall:.3f}")
print(f"  F1 Score:  {best_f1:.3f}")`,
      challenge: 'Implement 5-fold cross-validation: split the data into 5 folds, train on 4, test on 1, rotate. Report mean and standard deviation of F1. Does the model performance vary significantly across folds?',
      successHint: 'Stage 4 is complete — the classifier is trained, evaluated, and threshold-optimized for archaeological site detection.',
    },
    {
      title: 'Stage 5: Evidence fusion and final site ranking',
      concept: `Stage 5 combines the classifier output with additional evidence layers using Bayesian fusion, then produces a ranked list of candidate sites.

The fusion pipeline:
1. **Classifier posterior**: the probability from Stage 4's logistic regression.
2. **Vegetation layer**: simulated NDVI anomaly map — buried stone foundations change soil moisture, altering vegetation spectral response.
3. **Historical prior**: probability map based on proximity to rivers, elevation bands, and known site locations.
4. **Bayesian update**: multiply likelihood ratios from each layer to update the posterior.

After fusion, we apply **non-maximum suppression**: if two candidate regions overlap, keep only the higher-scoring one. This prevents double-counting a single large site.

The final output is a ranked site list with:
- GPS coordinates (UTM + lat/lon from Stage 1 coordinate transforms)
- Confidence score (calibrated posterior probability)
- Evidence summary (which layers contributed)
- Recommended action (excavate, ground-survey, or monitor)

This is the deliverable an archaeological survey team would use to plan fieldwork: a prioritized list of locations ranked by discovery probability, with uncertainty quantified.`,
      analogy: 'Evidence fusion is like a detective building a case. The LiDAR classifier is the forensic evidence. The vegetation anomaly is the witness testimony. The historical prior is the criminal profile. Each alone is insufficient for conviction, but together they build a case "beyond reasonable doubt." The final ranked list is the case file — telling the field team where to dig and how confident to be.',
      storyConnection: 'The lost temple was found by one team following one clue. The Site Discovery Model combines every available clue — aerial imagery, vegetation patterns, historical records, geological context — into a unified probability map. If the old map pointed to the wrong valley, the vegetation anomaly over the actual temple would still flag it. Fusion makes the system robust to any single evidence source failing.',
      checkQuestion: 'Why is non-maximum suppression necessary after evidence fusion?',
      checkAnswer: 'A single temple generates multiple overlapping candidate regions — the outer walls, inner walls, platform edges, and moat edges might all be detected as separate candidates. Without NMS, the ranked list would contain five entries for one site, wasting the survey budget and inflating the apparent discovery rate. NMS merges overlapping detections into a single representative, ensuring each physical site appears exactly once.',
      codeIntro: 'Implement evidence fusion, non-maximum suppression, and final site ranking with coordinate conversion and action recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate classifier output + evidence layers ---
n = 100  # 100x100 grid, 2m resolution = 200x200m area
res = 2.0

# True site locations
sites = [
    {'name': 'Large Temple', 'cx': 42, 'cy': 47, 'w': 24, 'h': 24},
    {'name': 'Small Shrine', 'cx': 75, 'cy': 32, 'w': 8, 'h': 8},
    {'name': 'Ancient Road',  'cx': 50, 'cy': 82, 'w': 40, 'h': 3},
]

# Classifier probability map
classifier_prob = np.random.uniform(0.01, 0.15, (n, n))
X, Y = np.meshgrid(np.arange(n), np.arange(n))
for s in sites:
    mask = (np.abs(X-s['cx']) < s['w']//2) & (np.abs(Y-s['cy']) < s['h']//2)
    classifier_prob[mask] = np.random.uniform(0.5, 0.9, mask.sum())

# False positive from classifier
fp_mask = ((X-15)**2 + (Y-70)**2) < 36
classifier_prob[fp_mask] = np.random.uniform(0.3, 0.6, fp_mask.sum())

# Vegetation anomaly layer
veg_layer = np.random.uniform(0.05, 0.2, (n, n))
for s in sites[:2]:  # road less visible in vegetation
    mask = (np.abs(X-s['cx']) < s['w']//2) & (np.abs(Y-s['cy']) < s['h']//2)
    veg_layer[mask] = np.random.uniform(0.4, 0.8, mask.sum())
# Different false positive in vegetation
veg_fp = ((X-85)**2 + (Y-85)**2) < 25
veg_layer[veg_fp] = np.random.uniform(0.3, 0.5, veg_fp.sum())

# Historical prior (based on distance to river at Y=50)
river_dist = np.abs(Y - 50) * res
historical_prior = np.clip(0.3 * np.exp(-river_dist / 50), 0.01, 0.3)

# --- Bayesian fusion ---
def bayesian_fuse(layers, prior):
    posterior = prior.copy()
    for layer in layers:
        p_e_site = np.clip(layer, 0.01, 0.99)
        p_e_nosite = np.clip(1 - layer * 0.6, 0.01, 0.99)
        lr = p_e_site / p_e_nosite
        odds = posterior / (1 - posterior + 1e-10)
        odds *= lr
        posterior = odds / (1 + odds)
    return posterior

fused = bayesian_fuse([classifier_prob, veg_layer], historical_prior)

# --- Detect candidate regions in fused map ---
threshold = 0.4
candidates_mask = fused > threshold

# Connected components (simplified)
def label_regions(mask):
    labels = np.zeros_like(mask, dtype=int)
    current = 0
    for i in range(mask.shape[0]):
        for j in range(mask.shape[1]):
            if mask[i,j] and labels[i,j] == 0:
                current += 1
                queue = [(i,j)]
                while queue:
                    r,c = queue.pop(0)
                    if r<0 or r>=mask.shape[0] or c<0 or c>=mask.shape[1]: continue
                    if not mask[r,c] or labels[r,c]!=0: continue
                    labels[r,c] = current
                    queue.extend([(r-1,c),(r+1,c),(r,c-1),(r,c+1)])
    return labels, current

labels, n_regions = label_regions(candidates_mask)

# Extract region info
regions = []
for lab in range(1, n_regions+1):
    mask = labels == lab
    area = mask.sum() * res**2
    if area < 20: continue  # skip tiny noise

    coords = np.argwhere(mask)
    cy, cx = coords.mean(axis=0)
    max_prob = fused[mask].max()
    mean_prob = fused[mask].mean()

    # UTM coordinates (simulated: origin at 370000E, 2920000N)
    utm_e = 370000 + cx * res
    utm_n = 2920000 + cy * res
    # Simplified lat/lon
    lat = 26.35 + (cy * res) / 111000
    lon = 92.70 + (cx * res) / (111000 * np.cos(np.radians(26.35)))

    # Evidence breakdown
    clf_score = classifier_prob[mask].mean()
    veg_score = veg_layer[mask].mean()
    hist_score = historical_prior[mask].mean()

    regions.append({
        'center_px': (cx, cy), 'area': area,
        'max_prob': max_prob, 'mean_prob': mean_prob,
        'utm': (utm_e, utm_n), 'latlon': (lat, lon),
        'evidence': {'classifier': clf_score, 'vegetation': veg_score, 'historical': hist_score},
    })

# Non-maximum suppression
regions.sort(key=lambda r: r['max_prob'], reverse=True)
kept = []
for r in regions:
    overlap = False
    for k in kept:
        dist = np.sqrt((r['center_px'][0]-k['center_px'][0])**2 +
                       (r['center_px'][1]-k['center_px'][1])**2) * res
        if dist < 20:  # suppress if within 20m of a higher-ranked detection
            overlap = True
            break
    if not overlap:
        kept.append(r)

# Assign actions
for r in kept:
    if r['max_prob'] > 0.7:
        r['action'] = 'EXCAVATE — high confidence'
    elif r['max_prob'] > 0.4:
        r['action'] = 'GROUND SURVEY — moderate confidence'
    else:
        r['action'] = 'MONITOR — low confidence'

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

im0 = axes[0,0].imshow(classifier_prob, extent=[0,n*res,0,n*res], origin='lower', cmap='hot')
axes[0,0].set_title('Classifier probability', color='white', fontsize=11)
plt.colorbar(im0, ax=axes[0,0], shrink=0.8)

im1 = axes[0,1].imshow(veg_layer, extent=[0,n*res,0,n*res], origin='lower', cmap='YlGn')
axes[0,1].set_title('Vegetation anomaly', color='white', fontsize=11)
plt.colorbar(im1, ax=axes[0,1], shrink=0.8)

im2 = axes[1,0].imshow(fused, extent=[0,n*res,0,n*res], origin='lower', cmap='magma', vmin=0, vmax=1)
axes[1,0].set_title('Fused posterior probability', color='white', fontsize=11)
plt.colorbar(im2, ax=axes[1,0], shrink=0.8)

axes[1,1].imshow(fused, extent=[0,n*res,0,n*res], origin='lower', cmap='magma', alpha=0.3, vmin=0, vmax=1)
colors = ['#22c55e','#f59e0b','#3b82f6','#ef4444','#a855f7']
for i, r in enumerate(kept):
    cx, cy = r['center_px']
    axes[1,1].plot(cx*res, cy*res, 'o', color=colors[i%len(colors)], markersize=12)
    axes[1,1].annotate(f"#{i+1} P={r['max_prob']:.2f}", (cx*res+3, cy*res+3),
        color=colors[i%len(colors)], fontsize=9, fontweight='bold')
axes[1,1].set_title(f'Final detections ({len(kept)} sites after NMS)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("STAGE 5 COMPLETE: Evidence Fusion & Site Ranking")
print("=" * 65)
for i, r in enumerate(kept):
    print(f"\\n  Site #{i+1}")
    print(f"    UTM:  {r['utm'][0]:.0f} E, {r['utm'][1]:.0f} N (Zone 46N)")
    print(f"    GPS:  {r['latlon'][0]:.6f}°N, {r['latlon'][1]:.6f}°E")
    print(f"    Area: {r['area']:.0f} m²")
    print(f"    Confidence: {r['max_prob']:.2f} (max), {r['mean_prob']:.2f} (mean)")
    print(f"    Evidence: classifier={r['evidence']['classifier']:.2f}, "
          f"vegetation={r['evidence']['vegetation']:.2f}, historical={r['evidence']['historical']:.2f}")
    print(f"    Action: {r['action']}")`,
      challenge: 'Add a "cost-benefit" layer: each candidate has an estimated excavation cost (based on area, terrain difficulty, access road distance) and an estimated value (based on confidence and size). Rank sites by expected value / cost to optimize the survey budget.',
      successHint: 'Stage 5 is complete — you have fused evidence, suppressed duplicates, and produced a ranked site list with coordinates and action recommendations.',
    },
    {
      title: 'Stage 6: Report generation and system documentation',
      concept: `The final stage produces a comprehensive report: the deliverable that justifies the entire pipeline. A Site Discovery Model report includes:

1. **Survey metadata**: area covered, LiDAR specifications, processing parameters.
2. **Quality assessment**: point density, ground filtering accuracy, DEM reliability.
3. **Detection summary**: total candidates, classification breakdown, confidence distribution.
4. **Site catalog**: ranked list with coordinates, confidence, evidence breakdown, recommended actions.
5. **Methodology documentation**: every parameter choice, algorithm version, training data source.
6. **Limitation statement**: known failure modes, areas of low confidence, recommended follow-up.

Why documentation matters: archaeological fieldwork is expensive. A team spending weeks excavating a false positive wastes resources that could find a real site. The report must honestly communicate uncertainty so the field team can prioritize wisely.

The report is also a **reproducibility record**. If someone questions a detection five years later, the documented parameters let them rerun the analysis. Irreproducible results are scientifically worthless, no matter how impressive the algorithm.`,
      analogy: 'The report is like a medical imaging report. The radiologist does not just say "I see something." They describe the finding, its location, its characteristics, their confidence level, and their recommendation (biopsy, monitor, or dismiss). The referring physician uses this structured information to make treatment decisions. Our report serves the same role for the field archaeologist.',
      storyConnection: 'The expedition to the lost temple left no systematic record of their search. When the next team came, they repeated the same mistakes. The Site Discovery Model report ensures that every observation is captured, every decision is justified, and every future team benefits from past work. The temple is found once and documented forever.',
      checkQuestion: 'Why must the report include a limitation statement even when the model performs well?',
      checkAnswer: 'Every model has failure modes: small structures below the minimum detection size, non-rectangular sites (circular temples), sites under very dense canopy where ground returns are too sparse, and novel construction materials with different spectral signatures. Without stating these limitations, a field team might assume no detections = no sites, when in reality the model simply could not see them. Honest limitation statements prevent false negatives of omission from causing sites to be overlooked permanently.',
      codeIntro: 'Generate the complete Site Discovery Model report with all six sections, including visualizations and quality metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE COMPLETE: Full Report Generation
# ============================================================

# Simulated pipeline results
survey_params = {
    'area_km2': 0.04,  # 200x200m = 0.04 km²
    'lidar_density': 20.0,  # pts/m²
    'ground_penetration': 0.25,
    'dem_resolution': 2.0,
    'classifier_f1': 0.87,
    'fusion_layers': 3,
}

detected_sites = [
    {'id': 1, 'name': 'Primary Temple Complex', 'utm_e': 370084, 'utm_n': 2920094,
     'lat': 26.35085, 'lon': 92.70078, 'area': 1152, 'confidence': 0.92,
     'evidence': {'lidar': 0.88, 'vegetation': 0.79, 'historical': 0.25},
     'action': 'EXCAVATE', 'priority': 'HIGH'},
    {'id': 2, 'name': 'Subsidiary Shrine', 'utm_e': 370150, 'utm_n': 2920064,
     'lat': 26.35058, 'lon': 92.70139, 'area': 128, 'confidence': 0.74,
     'evidence': {'lidar': 0.72, 'vegetation': 0.65, 'historical': 0.20},
     'action': 'GROUND SURVEY', 'priority': 'MEDIUM'},
    {'id': 3, 'name': 'Possible Causeway', 'utm_e': 370100, 'utm_n': 2920164,
     'lat': 26.35148, 'lon': 92.70093, 'area': 240, 'confidence': 0.51,
     'evidence': {'lidar': 0.55, 'vegetation': 0.35, 'historical': 0.18},
     'action': 'GROUND SURVEY', 'priority': 'LOW'},
]

# --- Generate comprehensive report visualization ---
fig = plt.figure(figsize=(16, 20))
fig.patch.set_facecolor('#1f2937')

# 1. Title and metadata
ax_title = fig.add_subplot(5, 2, (1, 2))
ax_title.set_facecolor('#0d1117')
ax_title.set_xlim(0, 1); ax_title.set_ylim(0, 1)
ax_title.axis('off')

title_text = """SITE DISCOVERY MODEL — SURVEY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Survey Area:  200 x 200 m (0.04 km²)
Location:     Assam, India (UTM Zone 46N)
LiDAR:        20.0 pts/m², 25% ground penetration
DEM:          2.0 m resolution, IDW interpolation
Classifier:   Weighted logistic regression (F1=0.87)
Fusion:       3-layer Bayesian (LiDAR + vegetation + historical)
Date:         2024 Archaeological Survey Campaign"""

ax_title.text(0.5, 0.5, title_text, transform=ax_title.transAxes,
    fontsize=10, fontfamily='monospace', color='#22c55e', va='center', ha='center',
    bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d1117', edgecolor='#22c55e'))

# 2. Simulated probability map with detections
ax_map = fig.add_subplot(5, 2, (3, 4))
ax_map.set_facecolor('#111827')
n = 100
prob_map = np.random.uniform(0.01, 0.15, (n, n))
X, Y = np.meshgrid(np.arange(n), np.arange(n))
# Temple
mask1 = (np.abs(X-42)<12) & (np.abs(Y-47)<12)
prob_map[mask1] = np.clip(np.random.normal(0.85, 0.1, mask1.sum()), 0.5, 0.99)
# Shrine
mask2 = (np.abs(X-75)<4) & (np.abs(Y-32)<4)
prob_map[mask2] = np.clip(np.random.normal(0.7, 0.1, mask2.sum()), 0.4, 0.9)
# Road
mask3 = (np.abs(Y-82)<2) & (X>30) & (X<70)
prob_map[mask3] = np.clip(np.random.normal(0.5, 0.1, mask3.sum()), 0.3, 0.7)

im = ax_map.imshow(prob_map, extent=[0,200,0,200], origin='lower', cmap='magma', vmin=0, vmax=1)
plt.colorbar(im, ax=ax_map, shrink=0.8, label='P(site)')
for s in detected_sites:
    px = (s['utm_e'] - 370000)
    py = (s['utm_n'] - 2920000)
    color = '#22c55e' if s['priority'] == 'HIGH' else '#f59e0b' if s['priority'] == 'MEDIUM' else '#3b82f6'
    ax_map.plot(px, py, '*', color=color, markersize=15, markeredgecolor='white', markeredgewidth=0.5)
    ax_map.annotate(f"#{s['id']}", (px+4, py+4), color=color, fontsize=10, fontweight='bold')
ax_map.set_title('Fused Probability Map with Detections', color='white', fontsize=12)
ax_map.set_xlabel('Easting offset (m)', color='white')
ax_map.set_ylabel('Northing offset (m)', color='white')
ax_map.tick_params(colors='gray')

# 3. Site catalog
ax_catalog = fig.add_subplot(5, 2, (5, 6))
ax_catalog.set_facecolor('#0d1117')
ax_catalog.axis('off')

catalog = "SITE CATALOG\\n" + "=" * 60 + "\\n"
for s in detected_sites:
    catalog += f"""
Site #{s['id']}: {s['name']}
  GPS:        {s['lat']:.6f}°N, {s['lon']:.6f}°E
  UTM:        {s['utm_e']} E, {s['utm_n']} N
  Area:       {s['area']} m²
  Confidence: {s['confidence']:.0%}
  Evidence:   LiDAR={s['evidence']['lidar']:.2f}  Veg={s['evidence']['vegetation']:.2f}  Hist={s['evidence']['historical']:.2f}
  Action:     {s['action']} (Priority: {s['priority']})
"""

ax_catalog.text(0.05, 0.95, catalog, transform=ax_catalog.transAxes,
    fontsize=8, fontfamily='monospace', color='#e2e8f0', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#334155'))

# 4. Confidence distribution
ax_conf = fig.add_subplot(5, 2, 7)
ax_conf.set_facecolor('#111827')
confs = [s['confidence'] for s in detected_sites]
colors = ['#22c55e' if c>0.7 else '#f59e0b' if c>0.4 else '#ef4444' for c in confs]
ax_conf.barh([f"Site #{s['id']}" for s in detected_sites], confs, color=colors)
ax_conf.set_xlim(0, 1)
ax_conf.set_xlabel('Confidence', color='white')
ax_conf.set_title('Detection Confidence', color='white', fontsize=11)
ax_conf.tick_params(colors='gray')
ax_conf.axvline(0.7, color='#22c55e', linestyle='--', alpha=0.5, label='High threshold')
ax_conf.axvline(0.4, color='#f59e0b', linestyle='--', alpha=0.5, label='Medium threshold')
ax_conf.legend(fontsize=8)

# 5. Evidence contribution
ax_ev = fig.add_subplot(5, 2, 8)
ax_ev.set_facecolor('#111827')
x_pos = np.arange(len(detected_sites))
w = 0.25
for i, (layer, color) in enumerate([('lidar','#22c55e'),('vegetation','#3b82f6'),('historical','#f59e0b')]):
    vals = [s['evidence'][layer] for s in detected_sites]
    ax_ev.bar(x_pos + i*w, vals, w, color=color, label=layer.capitalize())
ax_ev.set_xticks(x_pos + w)
ax_ev.set_xticklabels([f"#{s['id']}" for s in detected_sites], color='white')
ax_ev.set_ylabel('Evidence score', color='white')
ax_ev.set_title('Evidence Breakdown by Layer', color='white', fontsize=11)
ax_ev.legend(fontsize=8)
ax_ev.tick_params(colors='gray')

# 6. Limitations
ax_lim = fig.add_subplot(5, 2, (9, 10))
ax_lim.set_facecolor('#0d1117')
ax_lim.axis('off')

limitations = """LIMITATIONS & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Known Limitations:
  • Minimum detectable structure: ~10m (limited by DEM resolution and edge detection kernel)
  • Circular/irregular structures not well captured by rectangularity features
  • Dense canopy zones (ground density < 2 pts/m²) have unreliable DEMs
  • Historical prior biased toward river proximity — hilltop sites may be underweighted
  • Single-date vegetation layer — seasonal variation not captured

Recommended Follow-up:
  • Ground-truth Sites #1 and #2 within 30 days (pre-monsoon)
  • Acquire multi-temporal vegetation imagery for seasonal comparison
  • Deploy ground-penetrating radar at Site #3 (low-confidence causeway)
  • Resurvey with higher-density LiDAR (>30 pts/m²) for sub-10m structure detection
  • Cross-reference with local oral traditions and historical texts

Pipeline Reproducibility:
  • All parameters documented above; random seed = 42
  • Code version: Site Discovery Model v1.0
  • Input data hash: [would contain SHA-256 of input files]"""

ax_lim.text(0.05, 0.95, limitations, transform=ax_lim.transAxes,
    fontsize=8.5, fontfamily='monospace', color='#fbbf24', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Site Discovery Model from scratch:")
print("  1. Point cloud ingestion with ground filtering and quality metrics")
print("  2. DEM generation with per-cell uncertainty quantification")
print("  3. Automated feature extraction with connected component analysis")
print("  4. Weighted logistic regression with threshold optimization")
print("  5. Bayesian evidence fusion with non-maximum suppression")
print("  6. Comprehensive report with coordinates, confidence, and limitations")
print()
print("Skills demonstrated: remote sensing, geospatial analysis, interpolation,")
print("edge detection, spatial statistics, classification, evidence fusion,")
print("coordinate transforms, scientific reporting.")`,
      challenge: 'Add an interactive mode: let the user specify a "budget" (number of sites to investigate) and output the optimal subset that maximizes total expected discovery value within the budget constraint. This is a variant of the knapsack problem.',
      successHint: 'You have completed a full capstone project: from raw LiDAR point clouds to a documented, ranked site catalog with GPS coordinates. This is the shape of real archaeological remote sensing — not a single algorithm, but an integrated pipeline where remote sensing, geospatial analysis, machine learning, and scientific communication all work together. The Site Discovery Model is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (archaeological remote sensing)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Site Discovery Model. Click to start.</p>
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
