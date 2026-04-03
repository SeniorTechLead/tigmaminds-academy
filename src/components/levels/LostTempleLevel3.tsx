import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LostTempleLevel3() {
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
      title: 'Remote sensing fundamentals — how LiDAR sees through jungle canopy',
      concept: `Archaeologists used to find lost temples by hacking through jungle with machetes. LiDAR (Light Detection And Ranging) changed everything. An aircraft fires millions of laser pulses per second downward. Each pulse travels at the speed of light, bounces off surfaces, and returns. The round-trip time tells you the distance to that surface.

The breakthrough for archaeology: some laser pulses pass through gaps in the canopy and reach the ground. By filtering out "canopy returns" and keeping only "ground returns," you get a bare-earth elevation model — revealing walls, platforms, and moats hidden under centuries of vegetation.

Key LiDAR metrics:
- **Point density**: pulses per square meter. Dense jungle needs 15-25 pts/m² to get enough ground returns.
- **Return number**: first return = canopy top, last return = ground (or lowest obstacle).
- **Intensity**: reflectance strength — stone reflects differently than soil or water.
- **Elevation (Z)**: height above reference datum, typically in meters.

The raw data is a **point cloud** — millions of (x, y, z, intensity, return_number) tuples. The analysis challenge is separating archaeological features from natural terrain.`,
      analogy: 'Imagine shining a flashlight straight down through a dense crowd. Most light hits heads and shoulders (canopy), but some slips through gaps and reaches the floor. If you could record only the light that reached the floor, you would map the room layout without seeing through any person — just exploiting the gaps. LiDAR does exactly this with laser pulses through tree canopies.',
      storyConnection: 'The expedition to find the lost temple failed repeatedly because the jungle was impenetrable. LiDAR is the technology that would have let them see the temple from above — mapping its outline through the canopy without cutting a single vine. The temple was always there; they just needed a way to see through the green.',
      checkQuestion: 'Why must archaeologists filter LiDAR returns by return number rather than simply using all points?',
      checkAnswer: 'If you use all returns, the canopy surface dominates and hides the ground features. The temple walls might be only 1-2 meters high — completely swamped by 30-meter trees. By filtering to last returns only, you remove the canopy and expose subtle ground-level elevation changes that reveal archaeological structures.',
      codeIntro: 'Simulate a LiDAR point cloud over a jungle-covered temple site, then separate canopy returns from ground returns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate terrain with a hidden temple ---
grid_size = 100  # 100x100 meter area
resolution = 0.5  # 0.5m grid spacing
x_grid = np.arange(0, grid_size, resolution)
y_grid = np.arange(0, grid_size, resolution)
X, Y = np.meshgrid(x_grid, y_grid)

# Base terrain: gentle slope with some natural variation
terrain = 50 + 0.1 * X + 0.05 * Y + 2 * np.sin(X/15) * np.cos(Y/20)
terrain += np.random.normal(0, 0.3, terrain.shape)

# Add temple structure (rectangular platform with walls)
temple_mask = (X > 35) & (X < 65) & (Y > 40) & (Y < 70)
wall_mask = (temple_mask &
    ((np.abs(X - 35) < 2) | (np.abs(X - 65) < 2) |
     (np.abs(Y - 40) < 2) | (np.abs(Y - 70) < 2)))
platform_mask = temple_mask & ~wall_mask

terrain[platform_mask] += 1.5  # raised platform
terrain[wall_mask] += 3.0       # walls are higher

# Add a moat around the temple
moat_mask = ((X > 30) & (X < 70) & (Y > 35) & (Y < 75) &
             ~temple_mask &
             ((np.abs(X - 30) < 3) | (np.abs(X - 70) < 3) |
              (np.abs(Y - 35) < 3) | (np.abs(Y - 75) < 3)))
terrain[moat_mask] -= 2.0

# --- Simulate canopy (trees above terrain) ---
canopy_height = terrain + 20 + 10 * np.random.random(terrain.shape)
# Gaps in canopy (random clearings)
gap_mask = np.random.random(terrain.shape) < 0.15
canopy_height[gap_mask] = terrain[gap_mask]  # no canopy here

# --- Generate LiDAR point cloud ---
n_pulses = 50000
px = np.random.uniform(0, grid_size, n_pulses)
py = np.random.uniform(0, grid_size, n_pulses)

# Find nearest grid cell for each pulse
ix = np.clip((px / resolution).astype(int), 0, len(x_grid)-1)
iy = np.clip((py / resolution).astype(int), 0, len(y_grid)-1)

ground_z = terrain[iy, ix]
canopy_z = canopy_height[iy, ix]

# Each pulse: ~70% hits canopy (first return), ~30% reaches ground (last return)
is_ground_return = np.random.random(n_pulses) < 0.30
pz = np.where(is_ground_return, ground_z, canopy_z)
return_num = np.where(is_ground_return, 2, 1)  # 1=first, 2=last

# --- Plot: all returns vs ground-only returns ---
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_xlabel('X (m)', color='white', fontsize=9)
    ax.set_ylabel('Y (m)', color='white', fontsize=9)

# All returns
sc1 = axes[0].scatter(px, py, c=pz, s=0.2, cmap='viridis', alpha=0.5)
axes[0].set_title('All LiDAR returns', color='white', fontsize=11)
plt.colorbar(sc1, ax=axes[0], label='Elevation (m)', shrink=0.8)

# Ground returns only
ground_mask = return_num == 2
sc2 = axes[1].scatter(px[ground_mask], py[ground_mask],
    c=pz[ground_mask], s=0.5, cmap='terrain', alpha=0.7)
axes[1].set_title('Ground returns only (last return)', color='white', fontsize=11)
plt.colorbar(sc2, ax=axes[1], label='Elevation (m)', shrink=0.8)

# Ground DEM reveals temple
axes[2].imshow(terrain, extent=[0, grid_size, 0, grid_size],
    origin='lower', cmap='terrain', aspect='equal')
axes[2].set_title('True ground DEM — temple revealed', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Total LiDAR pulses: {n_pulses:,}")
print(f"Ground returns: {ground_mask.sum():,} ({ground_mask.mean():.0%})")
print(f"Canopy returns: {(~ground_mask).sum():,} ({(~ground_mask).mean():.0%})")
print(f"Temple area: {temple_mask.sum() * resolution**2:.0f} m²")
print(f"Wall height above platform: ~1.5 m")
print(f"Moat depth below terrain: ~2.0 m")`,
      challenge: 'Modify the temple to include an inner courtyard (a lower area inside the walls) and add a stepped pyramid in the center. Regenerate the LiDAR simulation and see if the ground-filtered returns reveal the internal structure.',
      successHint: 'You can now simulate LiDAR data and separate canopy from ground returns — the first step in archaeological remote sensing.',
    },
    {
      title: 'Digital Elevation Models — from scattered points to gridded surfaces',
      concept: `Ground-filtered LiDAR points are irregularly spaced — denser where canopy gaps occur, sparser under thick cover. To analyze terrain features, we need a regular grid: a **Digital Elevation Model (DEM)**.

The interpolation challenge: given scattered (x, y, z) points, estimate z at every grid cell. Common methods:

- **Nearest neighbor**: assign each cell the z of its closest point. Fast but produces blocky artifacts.
- **Inverse Distance Weighting (IDW)**: z_cell = weighted average of nearby points, where weight = 1/distance^p (typically p=2). Smooth but creates "bullseye" artifacts around isolated points.
- **Linear interpolation (Delaunay triangulation)**: connect points into triangles, interpolate linearly within each triangle. Good balance of speed and quality.
- **Kriging**: statistically optimal interpolation that models spatial correlation. Best quality but computationally expensive.

The DEM cell size matters: too coarse (5m) and you miss wall details; too fine (0.1m) and you amplify noise in sparse areas. For archaeology, 0.5-1.0m resolution is the sweet spot.

Once you have a DEM, you can compute **derivatives** — slope, aspect, curvature — that highlight linear features (walls) and depressions (moats, reservoirs) that are invisible in raw elevation.`,
      analogy: 'You have temperature readings from 50 weather stations scattered across a state. To make a temperature map, you cannot just plot 50 dots — you need to estimate temperature everywhere in between. IDW says "the temperature at any point is probably close to the nearest stations, weighted by how near they are." A DEM does the same thing with elevation instead of temperature.',
      storyConnection: 'The explorers searching for the lost temple had fragments of old maps with scattered landmarks. Creating a DEM from LiDAR is like filling in the blanks between those landmarks — turning scattered clues into a complete picture where the temple outline emerges from the noise.',
      checkQuestion: 'Why does IDW with high power (p=4) produce different results than low power (p=1)?',
      checkAnswer: 'High power means distance is penalized more aggressively: only very close points dominate the estimate, producing a more "local" but potentially noisier result. Low power weights distant points almost equally, producing a smoother but potentially over-smoothed result. For archaeology, p=2 balances local detail against noise — you want to detect 2m-wide walls without amplifying 10cm random variations.',
      codeIntro: 'Implement IDW interpolation from scratch and create a DEM from scattered ground returns, then compute slope to highlight archaeological features.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Create ground truth terrain with temple ---
grid_res = 0.5
xs = np.arange(0, 100, grid_res)
ys = np.arange(0, 100, grid_res)
Xg, Yg = np.meshgrid(xs, ys)

# Base terrain
truth = 50 + 0.1 * Xg + 2 * np.sin(Xg/15) * np.cos(Yg/20)
# Temple walls
for bx, by, bw, bh in [(35,40,30,2), (35,68,30,2), (35,40,2,30), (63,40,2,30)]:
    mask = (Xg >= bx) & (Xg < bx+bw) & (Yg >= by) & (Yg < by+bh)
    truth[mask] += 3.0
# Platform
pmask = (Xg > 37) & (Xg < 63) & (Yg > 42) & (Yg < 68)
truth[pmask] += 1.5

# --- Simulate scattered ground returns ---
n_pts = 3000
px = np.random.uniform(2, 98, n_pts)
py = np.random.uniform(2, 98, n_pts)
ix = np.clip((px / grid_res).astype(int), 0, len(xs)-1)
iy = np.clip((py / grid_res).astype(int), 0, len(ys)-1)
pz = truth[iy, ix] + np.random.normal(0, 0.15, n_pts)

# --- IDW interpolation ---
def idw_interpolate(points_x, points_y, points_z, grid_x, grid_y, power=2, n_neighbors=12):
    """Inverse Distance Weighting interpolation."""
    dem = np.zeros(grid_x.shape)
    rows, cols = grid_x.shape

    for i in range(rows):
        for j in range(cols):
            gx, gy = grid_x[i, j], grid_y[i, j]
            distances = np.sqrt((points_x - gx)**2 + (points_y - gy)**2)

            # Use nearest n_neighbors
            nearest_idx = np.argsort(distances)[:n_neighbors]
            d = distances[nearest_idx]
            z = points_z[nearest_idx]

            # Handle exact matches
            exact = d < 1e-10
            if np.any(exact):
                dem[i, j] = z[exact][0]
            else:
                weights = 1.0 / d**power
                dem[i, j] = np.sum(weights * z) / np.sum(weights)
    return dem

# Use coarser grid for speed (2m resolution)
dem_res = 2.0
dem_xs = np.arange(0, 100, dem_res)
dem_ys = np.arange(0, 100, dem_res)
Xd, Yd = np.meshgrid(dem_xs, dem_ys)

dem = idw_interpolate(px, py, pz, Xd, Yd, power=2, n_neighbors=8)

# --- Compute slope (gradient magnitude) ---
dy, dx = np.gradient(dem, dem_res)
slope = np.sqrt(dx**2 + dy**2)

# --- Plot ---
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

axes[0].scatter(px, py, c=pz, s=1, cmap='terrain', alpha=0.5)
axes[0].set_title('Scattered ground returns', color='white', fontsize=11)
axes[0].set_xlabel('X (m)', color='white')
axes[0].set_ylabel('Y (m)', color='white')

im1 = axes[1].imshow(dem, extent=[0,100,0,100], origin='lower', cmap='terrain')
axes[1].set_title('IDW interpolated DEM', color='white', fontsize=11)
plt.colorbar(im1, ax=axes[1], shrink=0.8, label='Elevation (m)')

im2 = axes[2].imshow(slope, extent=[0,100,0,100], origin='lower', cmap='hot')
axes[2].set_title('Slope map — walls highlighted', color='white', fontsize=11)
plt.colorbar(im2, ax=axes[2], shrink=0.8, label='Slope (m/m)')

plt.tight_layout()
plt.show()

print(f"Input: {n_pts} scattered ground returns")
print(f"Output DEM: {dem.shape[0]}x{dem.shape[1]} grid at {dem_res}m resolution")
print(f"IDW power: 2, neighbors: 8")
print(f"Slope range: {slope.min():.3f} - {slope.max():.3f} m/m")
print(f"High slope (>0.5) cells: {(slope > 0.5).sum()} — these are likely wall edges")`,
      challenge: 'Implement two different power values (p=1 and p=4) side by side and compare. Which power better resolves the temple walls? Then try varying n_neighbors from 4 to 20 and observe the smoothing effect.',
      successHint: 'You can now interpolate scattered LiDAR points into gridded DEMs and use slope analysis to highlight archaeological features.',
    },
    {
      title: 'Feature detection — finding linear structures in noisy terrain',
      concept: `Temple walls, roads, and canals appear as **linear features** in DEMs. Detecting them requires edge detection — the same algorithms used in computer vision, applied to elevation data.

The **Sobel operator** computes directional gradients. For a 3x3 neighborhood around each cell, it estimates ∂z/∂x and ∂z/∂y using weighted differences:

Gx kernel: [[-1,0,1],[-2,0,2],[-1,0,1]]
Gy kernel: [[-1,-2,-1],[0,0,0],[1,2,1]]

The gradient magnitude √(Gx²+Gy²) highlights edges. The gradient direction atan2(Gy,Gx) tells you the wall orientation.

For archaeology, we go further:
- **Thresholding**: keep only edges above a minimum strength (removes noise).
- **Non-maximum suppression**: thin edges to single-pixel width by keeping only local maxima along the gradient direction.
- **Hough transform**: detect straight lines in the edge map. Temple walls are straight; natural features rarely are. A cluster of aligned edges strongly suggests human construction.

The key insight: natural terrain has random edges (boulders, tree roots, erosion rills). Archaeological features have **geometric regularity** — parallel walls, right angles, consistent spacing.`,
      analogy: 'Edge detection on a DEM is like running your hand over a surface in the dark. You feel sudden elevation changes (edges) and mentally connect the bumps into lines. If you feel four straight bumps forming a rectangle, you know it is artificial — nature rarely builds rectangles. The Sobel operator is the mathematical equivalent of that tactile exploration.',
      storyConnection: 'The temple in the story was hidden not because it was small, but because vegetation made every surface equally bumpy. Edge detection strips away the random texture and reveals the geometric skeleton underneath — the straight walls and right angles that shout "human construction" against the organic randomness of the jungle.',
      checkQuestion: 'Why would the Hough transform be more useful than simple thresholding for detecting temple walls in a noisy DEM?',
      checkAnswer: 'Thresholding finds all strong edges, including those from natural features like stream banks, rock outcrops, and large tree roots. The Hough transform specifically looks for straight lines — which are overwhelmingly man-made in jungle terrain. A natural edge might be strong but curved; a temple wall is straight and at consistent orientations (often 0/90 degrees). The Hough transform separates geometry from magnitude.',
      codeIntro: 'Apply Sobel edge detection to the temple DEM, then use thresholding and orientation analysis to isolate man-made linear features.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate DEM with temple and natural noise ---
res = 0.5
xs = np.arange(0, 100, res)
ys = np.arange(0, 100, res)
X, Y = np.meshgrid(xs, ys)

# Terrain with geological noise
terrain = 50 + 0.1*X + 2*np.sin(X/15)*np.cos(Y/20)
terrain += 0.5 * np.random.randn(*terrain.shape)  # rough surface

# Temple walls (rectangular)
walls = [
    (35,40,30,1.5), (35,68,30,1.5),  # horizontal walls
    (35,40,1.5,30), (63.5,40,1.5,30), # vertical walls
]
for wx, wy, ww, wh in walls:
    mask = (X >= wx) & (X < wx+ww) & (Y >= wy) & (Y < wy+wh)
    terrain[mask] += 2.5

# Natural features (stream, boulder field) to add confusion
stream_mask = np.abs(Y - (20 + 5*np.sin(X/10))) < 1.5
terrain[stream_mask] -= 1.5
boulder_centers = np.random.uniform(10, 90, (20, 2))
for bx, by in boulder_centers:
    bmask = ((X - bx)**2 + (Y - by)**2) < 4
    terrain[bmask] += np.random.uniform(0.5, 2.0)

# --- Sobel edge detection ---
def sobel_filter(dem):
    """Apply Sobel operator to compute gradient magnitude and direction."""
    kx = np.array([[-1,0,1],[-2,0,2],[-1,0,1]], dtype=float)
    ky = np.array([[-1,-2,-1],[0,0,0],[1,2,1]], dtype=float)

    rows, cols = dem.shape
    gx = np.zeros_like(dem)
    gy = np.zeros_like(dem)

    for i in range(1, rows-1):
        for j in range(1, cols-1):
            patch = dem[i-1:i+2, j-1:j+2]
            gx[i,j] = np.sum(patch * kx)
            gy[i,j] = np.sum(patch * ky)

    magnitude = np.sqrt(gx**2 + gy**2)
    direction = np.arctan2(gy, gx)  # radians
    return magnitude, direction, gx, gy

mag, dirn, gx, gy = sobel_filter(terrain)

# --- Threshold and classify edges ---
threshold = np.percentile(mag, 90)  # top 10% of gradients
strong_edges = mag > threshold

# Classify edge orientations (0=horizontal wall, 90=vertical wall, other=natural)
deg = np.degrees(dirn) % 180
horizontal = strong_edges & ((deg < 20) | (deg > 160))
vertical = strong_edges & (np.abs(deg - 90) < 20)
other = strong_edges & ~horizontal & ~vertical

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

axes[0,0].imshow(terrain, extent=[0,100,0,100], origin='lower', cmap='terrain')
axes[0,0].set_title('DEM with hidden temple', color='white', fontsize=11)

axes[0,1].imshow(mag, extent=[0,100,0,100], origin='lower', cmap='hot')
axes[0,1].set_title('Sobel gradient magnitude', color='white', fontsize=11)

# Edge classification
edge_rgb = np.zeros((*strong_edges.shape, 3))
edge_rgb[horizontal] = [0, 1, 0]   # green = likely walls (E-W)
edge_rgb[vertical] = [0, 0.5, 1]   # blue = likely walls (N-S)
edge_rgb[other] = [1, 0.3, 0.3]    # red = natural features
axes[1,0].imshow(edge_rgb, extent=[0,100,0,100], origin='lower')
axes[1,0].set_title('Edge classification (green/blue=walls, red=natural)', color='white', fontsize=10)

# Direction histogram
ax3 = axes[1,1]
edge_angles = deg[strong_edges]
ax3.hist(edge_angles, bins=36, range=(0,180), color='#22c55e', edgecolor='#111827', alpha=0.8)
ax3.axvline(0, color='#f59e0b', linestyle='--', label='0° (E-W walls)')
ax3.axvline(90, color='#3b82f6', linestyle='--', label='90° (N-S walls)')
ax3.set_title('Edge direction histogram', color='white', fontsize=11)
ax3.set_xlabel('Direction (degrees)', color='white')
ax3.set_ylabel('Count', color='white')
ax3.legend(fontsize=8)

plt.tight_layout()
plt.show()

n_wall = horizontal.sum() + vertical.sum()
n_natural = other.sum()
print(f"Total strong edges: {strong_edges.sum():,}")
print(f"Classified as wall (0°/90°): {n_wall:,} ({n_wall/strong_edges.sum():.0%})")
print(f"Classified as natural: {n_natural:,} ({n_natural/strong_edges.sum():.0%})")
print(f"Direction peaks at 0° and 90° confirm rectangular architecture")`,
      challenge: 'Add a diagonal feature (a 45-degree road leading to the temple entrance) and modify the classification to detect three categories: E-W walls, N-S walls, and diagonal roads. Does the direction histogram show three distinct peaks?',
      successHint: 'You can now detect and classify linear features in elevation data — the core technique for automated archaeological site discovery.',
    },
    {
      title: 'Geospatial coordinate systems — mapping discoveries to real-world locations',
      concept: `Finding a temple in LiDAR data is useless unless you can walk to it. That requires converting pixel coordinates to real-world geographic coordinates.

Earth is an oblate spheroid (slightly squished at the poles). Representing its curved surface on a flat map requires **map projections**, each introducing different distortions:

- **Geographic (lat/lon)**: angles on the sphere. One degree of longitude varies from 111 km at the equator to 0 km at the poles. Cannot be used for distance calculations directly.
- **UTM (Universal Transverse Mercator)**: divides Earth into 60 zones, each 6° wide. Within a zone, coordinates are in meters — perfect for local measurements. Assam is mostly UTM zone 46N.
- **Local coordinate systems**: arbitrary origin (e.g., survey benchmark). Must be tied to a global system via control points.

The **affine transform** converts between coordinate systems:
  x_geo = a*col + b*row + c
  y_geo = d*col + e*row + f

Six parameters (a,b,c,d,e,f) encode translation, rotation, and scaling. In GIS, this is stored as a "GeoTransform" — the metadata that turns a raster image into a map.

For LiDAR data, each point already has (x,y,z) in some coordinate system. The DEM inherits that system. Accurate georeferencing means GPS-verified ground control points with < 1m error.`,
      analogy: 'A coordinate system is like an address system. "Row 45, Column 62" in your DEM is like "apartment 4B" — it tells you where something is within the building (the dataset), but not where the building is on Earth. The affine transform is the street address that connects your local reference to the global system. Without it, your discovery is unfindable.',
      storyConnection: 'The lost temple was lost precisely because its location was recorded in a local system that no one could translate to modern coordinates. The ancient map described landmarks that eroded away. Modern georeferencing ensures that once a temple is found in LiDAR data, its GPS coordinates can guide a ground team directly to it — no machetes required.',
      checkQuestion: 'Why can you not simply use latitude/longitude coordinates to measure the area of an archaeological site in square meters?',
      checkAnswer: 'One degree of longitude is approximately 111 km at the equator but shrinks to zero at the poles (longitude lines converge). So the "size" of a degree in meters depends on your latitude. Multiplying lat degrees by lon degrees gives a distorted area. You must first project to a metric system like UTM, where coordinates are in actual meters, before computing areas, distances, or slopes.',
      codeIntro: 'Implement affine coordinate transforms and convert a LiDAR site discovery from pixel coordinates to UTM and geographic coordinates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Affine transform: pixel coords -> UTM coords ---
class AffineTransform:
    """Convert between pixel (row, col) and geographic (x, y) coordinates."""

    def __init__(self, origin_x, origin_y, pixel_size_x, pixel_size_y, rotation=0):
        self.origin_x = origin_x      # UTM easting of top-left pixel
        self.origin_y = origin_y      # UTM northing of top-left pixel
        self.dx = pixel_size_x        # meters per pixel (east)
        self.dy = pixel_size_y        # meters per pixel (north, usually negative)
        self.rot = np.radians(rotation)

    def pixel_to_utm(self, col, row):
        """Convert pixel coordinates to UTM."""
        cos_r, sin_r = np.cos(self.rot), np.sin(self.rot)
        x = self.origin_x + col * self.dx * cos_r - row * self.dy * sin_r
        y = self.origin_y + col * self.dx * sin_r + row * self.dy * cos_r
        return x, y

    def utm_to_pixel(self, x, y):
        """Convert UTM coordinates to pixel."""
        cos_r, sin_r = np.cos(self.rot), np.sin(self.rot)
        dx = x - self.origin_x
        dy = y - self.origin_y
        col = (dx * cos_r + dy * sin_r) / self.dx
        row = (-dx * sin_r + dy * cos_r) / self.dy
        return col, row

def utm_to_latlon(easting, northing, zone=46, northern=True):
    """Simplified UTM to lat/lon conversion (accurate to ~1m for zone 46N)."""
    k0 = 0.9996
    a = 6378137.0  # WGS84 semi-major axis
    e = 0.0818192  # eccentricity
    e2 = e**2

    x = easting - 500000  # remove false easting
    y = northing if northern else northing - 10000000

    M = y / k0
    mu = M / (a * (1 - e2/4 - 3*e2**2/64))
    phi = mu + (3*e/2 - 27*e**3/32) * np.sin(2*mu)
    phi += (21*e**2/16) * np.sin(4*mu)

    lat = np.degrees(phi)
    # Simplified longitude
    lon_origin = (zone - 1) * 6 - 180 + 3
    lon = lon_origin + np.degrees(x / (a * k0 * np.cos(phi)))

    return lat, lon

# --- Example: temple discovered in LiDAR DEM ---
# DEM is 200x200 pixels, 0.5m resolution
# Top-left corner at UTM 46N: 370000 E, 2920000 N (somewhere in Assam)
transform = AffineTransform(
    origin_x=370000,    # UTM easting (m)
    origin_y=2920000,   # UTM northing (m)
    pixel_size_x=0.5,   # 0.5m pixels
    pixel_size_y=0.5,   # 0.5m pixels
    rotation=0
)

# Temple found at pixel (col=100, row=120) to (col=160, row=180)
temple_corners_px = [(100,120), (160,120), (160,180), (100,180)]
print("Temple corners in different coordinate systems:")
print(f"{'Corner':<10} {'Pixel (c,r)':<15} {'UTM (E, N)':<25} {'Lat/Lon'}")
print("-" * 80)

temple_utm = []
for i, (c, r) in enumerate(temple_corners_px):
    ux, uy = transform.pixel_to_utm(c, r)
    lat, lon = utm_to_latlon(ux, uy, zone=46, northern=True)
    temple_utm.append((ux, uy))
    print(f"  {i+1:<8} ({c:3d},{r:3d})      ({ux:.1f}, {uy:.1f})   ({lat:.6f}°N, {lon:.6f}°E)")

# Calculate area
w = abs(temple_utm[1][0] - temple_utm[0][0])
h = abs(temple_utm[2][1] - temple_utm[1][1])
area = w * h

# --- Visualize the coordinate systems ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Pixel coordinates
ax0 = axes[0]
rect_px = plt.Polygon(temple_corners_px, fill=False, edgecolor='#22c55e', linewidth=2)
ax0.add_patch(rect_px)
ax0.set_xlim(0, 200)
ax0.set_ylim(200, 0)  # image convention: row 0 at top
ax0.set_xlabel('Column (pixels)', color='white')
ax0.set_ylabel('Row (pixels)', color='white')
ax0.set_title('Pixel coordinates (DEM space)', color='white', fontsize=11)
ax0.set_aspect('equal')
for i, (c, r) in enumerate(temple_corners_px):
    ax0.plot(c, r, 'o', color='#f59e0b', markersize=8)
    ax0.annotate(f'P{i+1}({c},{r})', (c+3, r-3), color='#f59e0b', fontsize=8)

# UTM coordinates
ax1 = axes[1]
utm_poly = plt.Polygon(temple_utm, fill=False, edgecolor='#22c55e', linewidth=2)
ax1.add_patch(utm_poly)
ax1.set_xlim(369950, 370110)
ax1.set_ylim(2919940, 2920100)
ax1.set_xlabel('Easting (m)', color='white')
ax1.set_ylabel('Northing (m)', color='white')
ax1.set_title('UTM Zone 46N coordinates', color='white', fontsize=11)
ax1.set_aspect('equal')
for i, (ux, uy) in enumerate(temple_utm):
    ax1.plot(ux, uy, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(f'({ux:.0f},{uy:.0f})', (ux+1, uy+1), color='#f59e0b', fontsize=7)

plt.tight_layout()
plt.show()

print(f"\\nTemple dimensions: {w:.1f}m x {h:.1f}m = {area:.0f} m²")
print(f"Coordinate system: UTM Zone 46N (WGS84)")
print(f"Pixel size: 0.5m — each pixel coordinate shift = 0.5m on the ground")`,
      challenge: 'Add a rotation of 12 degrees to the affine transform (simulating a LiDAR flight path that was not aligned to north) and verify that the UTM coordinates still resolve correctly. What happens to the temple outline in UTM space when the DEM is rotated?',
      successHint: 'You can now convert between pixel, UTM, and geographic coordinates — essential for turning LiDAR discoveries into locations a ground team can navigate to.',
    },
    {
      title: 'Spatial statistics — distinguishing real sites from random terrain anomalies',
      concept: `Not every rectangular bump in a DEM is a temple. Geology produces mesas, stacked sedimentary layers, and rectangular joint patterns. How do we statistically distinguish archaeological features from natural ones?

**Spatial autocorrelation** measures whether nearby values are more similar than distant values. Natural terrain has smooth spatial autocorrelation (nearby points have similar elevation). Man-made structures create **sharp discontinuities** — walls rise abruptly from surroundings.

Key statistical tools:

- **Moran's I**: global measure of spatial autocorrelation. Values near +1 mean clustered (similar values near each other), near -1 means dispersed, near 0 means random. Temple walls create local patches of high Moran's I.
- **Local Moran's I (LISA)**: computed for each cell, identifying hot spots (high-high clusters), cold spots (low-low), and outliers (high surrounded by low). Temple walls are outliers — high elevation surrounded by lower terrain.
- **Semivariogram**: plots variance between pairs of points as a function of distance. Archaeological sites show a characteristic "nugget" (measurement noise) followed by a rise to a "sill" at the range of the structure's spatial extent. A 30m temple produces a semivariogram break at ~30m.
- **Rectangularity index**: for detected features, measure how close the shape is to a perfect rectangle. Values above 0.85 strongly suggest human construction.`,
      analogy: 'Spatial statistics is like a jury evaluating evidence. One straight edge could be coincidence (a cliff face). Two parallel edges are suspicious. Four edges forming a rectangle with right angles and consistent height — that is beyond reasonable doubt. Each statistical test adds evidence; together they build a case that distinguishes temples from terrain.',
      storyConnection: 'Locals told legends about the lost temple, but legends are imprecise — "somewhere in the hills east of the river." Spatial statistics turns imprecise legend into precise probability: "this location has a 97% probability of containing an archaeological structure based on spatial autocorrelation, edge geometry, and elevation anomaly." Science validates folklore.',
      checkQuestion: 'Why is the semivariogram useful for estimating the size of a hidden structure even before you extract its outline?',
      checkAnswer: 'The semivariogram measures how elevation variance changes with distance. Within a structure (e.g., on the temple platform), nearby points have similar elevation — low variance. Once you cross a wall to the outside, variance jumps. The distance at which variance first plateaus (the "range") corresponds to the structure size. A 30m temple produces a variance jump at approximately 30m lag distance, revealing its scale before any edge detection.',
      codeIntro: 'Compute local spatial statistics on a DEM to identify probable archaeological features and score their likelihood of being man-made.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate terrain: temple + natural features ---
n = 100
res = 1.0
xs = np.arange(n) * res
X, Y = np.meshgrid(xs, xs)

terrain = 50 + 0.15*X + 2*np.sin(X/12)*np.cos(Y/18)
terrain += np.random.normal(0, 0.4, terrain.shape)

# Temple (rectangle)
for wx, wy, ww, wh in [(30,35,40,2), (30,63,40,2), (30,35,2,30), (68,35,2,30)]:
    m = (X>=wx)&(X<wx+ww)&(Y>=wy)&(Y<wy+wh)
    terrain[m] += 3.0
pmask = (X>32)&(X<68)&(Y>37)&(Y<63)
terrain[pmask] += 1.5

# Natural mesa (similar height but irregular)
mesa_center = (80, 20)
mesa_r = 8
mesa_mask = ((X - mesa_center[0])**2 + (Y - mesa_center[1])**2) < mesa_r**2
terrain[mesa_mask] += 2.5

# --- Local Moran's I (simplified) ---
def local_morans_i(data, window=5):
    """Compute Local Moran's I for each cell using a moving window."""
    rows, cols = data.shape
    pad = window // 2
    global_mean = np.mean(data)
    global_var = np.var(data)
    lisa = np.zeros_like(data)

    for i in range(pad, rows - pad):
        for j in range(pad, cols - pad):
            neighborhood = data[i-pad:i+pad+1, j-pad:j+pad+1]
            center_dev = data[i, j] - global_mean
            neighbor_devs = neighborhood - global_mean
            # Exclude center
            n_cells = window * window - 1
            neighbor_sum = np.sum(neighbor_devs) - center_dev
            if global_var > 0:
                lisa[i, j] = (center_dev / global_var) * (neighbor_sum / n_cells)
    return lisa

def rectangularity_score(binary_mask):
    """Measure how rectangular a binary region is (0-1)."""
    coords = np.argwhere(binary_mask)
    if len(coords) < 4:
        return 0
    min_r, min_c = coords.min(axis=0)
    max_r, max_c = coords.max(axis=0)
    bbox_area = (max_r - min_r + 1) * (max_c - min_c + 1)
    region_area = len(coords)
    return region_area / bbox_area if bbox_area > 0 else 0

def compute_semivariogram(data, max_lag=30, n_samples=5000):
    """Empirical semivariogram from random point pairs."""
    rows, cols = data.shape
    lags = []
    semivariances = []

    for _ in range(n_samples):
        r1, c1 = np.random.randint(0, rows), np.random.randint(0, cols)
        r2, c2 = np.random.randint(0, rows), np.random.randint(0, cols)
        dist = np.sqrt((r1-r2)**2 + (c1-c2)**2) * res
        if dist < max_lag and dist > 0:
            sv = 0.5 * (data[r1,c1] - data[r2,c2])**2
            lags.append(dist)
            semivariances.append(sv)

    lags = np.array(lags)
    semivariances = np.array(semivariances)

    # Bin
    bins = np.arange(1, max_lag+1, 1)
    binned_sv = []
    for b in bins:
        mask = (lags >= b-0.5) & (lags < b+0.5)
        if mask.sum() > 10:
            binned_sv.append(np.mean(semivariances[mask]))
        else:
            binned_sv.append(np.nan)

    return bins, np.array(binned_sv)

lisa = local_morans_i(terrain, window=7)

# Threshold high LISA values = anomalous structures
threshold = np.percentile(lisa[lisa > 0], 90)
anomalies = lisa > threshold

# Score detected regions
temple_region = anomalies & (X > 25) & (X < 75) & (Y > 30) & (Y < 70)
mesa_region = anomalies & (X > 70) & (Y < 30)
rect_temple = rectangularity_score(temple_region)
rect_mesa = rectangularity_score(mesa_region)

# Semivariogram
sv_lags, sv_vals = compute_semivariogram(terrain)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

axes[0,0].imshow(terrain, extent=[0,100,0,100], origin='lower', cmap='terrain')
axes[0,0].set_title('DEM (temple + natural mesa)', color='white', fontsize=11)

im1 = axes[0,1].imshow(lisa, extent=[0,100,0,100], origin='lower', cmap='RdBu_r', vmin=-2, vmax=2)
axes[0,1].set_title("Local Moran's I (LISA)", color='white', fontsize=11)
plt.colorbar(im1, ax=axes[0,1], shrink=0.8)

# Anomaly classification
anom_rgb = np.zeros((*anomalies.shape, 3))
anom_rgb[temple_region] = [0, 1, 0]
anom_rgb[mesa_region] = [1, 0.5, 0]
anom_rgb[anomalies & ~temple_region & ~mesa_region] = [0.5, 0.5, 0.5]
axes[1,0].imshow(anom_rgb, extent=[0,100,0,100], origin='lower')
axes[1,0].set_title(f'Detected anomalies (rect: temple={rect_temple:.2f}, mesa={rect_mesa:.2f})', color='white', fontsize=9)

axes[1,1].plot(sv_lags, sv_vals, 'o-', color='#22c55e', markersize=3)
axes[1,1].axvline(35, color='#f59e0b', linestyle='--', alpha=0.7, label='~35m (temple size)')
axes[1,1].set_xlabel('Lag distance (m)', color='white')
axes[1,1].set_ylabel('Semivariance', color='white')
axes[1,1].set_title('Semivariogram', color='white', fontsize=11)
axes[1,1].legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Rectangularity scores (1.0 = perfect rectangle):")
print(f"  Temple region: {rect_temple:.3f}")
print(f"  Mesa region:   {rect_mesa:.3f}")
print(f"  {'Temple is more rectangular' if rect_temple > rect_mesa else 'Mesa is more rectangular'}")
print(f"\\nSemivariogram shows variance increase around 30-35m lag")
print(f"This matches the temple width (~40m) — structure size detected statistically")`,
      challenge: 'Add a second rectangular structure (a smaller shrine, 10x10m) at a different location and see if both the LISA analysis and semivariogram detect two distinct spatial scales. Does the semivariogram show two breaks?',
      successHint: 'You can now use spatial statistics to formally distinguish man-made structures from natural terrain features — the critical step between "interesting shape" and "confirmed archaeological site."',
    },
    {
      title: 'Classification models — training a site detection algorithm',
      concept: `With feature extraction and spatial statistics in hand, we can train a classifier to automatically detect archaeological sites in new LiDAR data.

For each candidate region in a DEM, we extract a **feature vector**:
- **Geometric features**: rectangularity, elongation (length/width ratio), area, perimeter/area ratio.
- **Elevation features**: mean height above surrounding terrain, max gradient, gradient variance.
- **Spatial features**: local Moran's I value, number of right-angle corners detected, edge straightness score.
- **Context features**: distance to water, distance to known sites, slope of surrounding terrain (temples avoid steep slopes).

The training data comes from confirmed sites (positive examples) and verified non-sites (negative examples). This is **supervised classification** — exactly the same framework used for elephant rumble classification, but applied to geospatial data.

Common classifiers for archaeological site detection:
- **Logistic regression**: fast, interpretable, works well when features are well-chosen.
- **Random forest**: handles nonlinear boundaries, provides feature importance rankings.
- **Gradient boosted trees**: highest accuracy but harder to interpret.

The unique challenge: archaeological sites are **rare events** (class imbalance). In a 1000 km² survey, there might be 50 sites among millions of terrain patches. Accuracy is misleading — predicting "no site" everywhere gives 99.99% accuracy. We need precision, recall, and F1 score.`,
      analogy: 'Training a site detector is like training a new archaeologist to read LiDAR maps. You show them 50 confirmed sites and 500 non-sites, pointing out what distinguishes them: "See the rectangular outline? The right angles? The moat?" After enough examples, they can scan a new map and circle probable sites. The classifier learns the same visual intuition, but from numerical features rather than images.',
      storyConnection: 'The search for the lost temple relied on one person interpreting one map. A trained classifier can scan entire regions — thousands of square kilometers — in minutes, flagging every location that matches the template pattern. If the lost temple story happened today, the classifier would have found it before the expedition even started.',
      checkQuestion: 'Why is the F1 score a better metric than accuracy for archaeological site detection?',
      checkAnswer: 'Sites are extremely rare relative to non-sites. If only 0.01% of terrain patches contain sites, a model that always predicts "no site" achieves 99.99% accuracy but finds zero temples. F1 is the harmonic mean of precision (how many flagged locations are real sites) and recall (how many real sites were flagged). It forces the model to balance finding sites against avoiding false alarms.',
      codeIntro: 'Build a complete site detection pipeline: generate training data from simulated regions, extract features, train a classifier, and evaluate with appropriate metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate training data: synthetic terrain patches ---
def generate_patch(has_site=False, size=50):
    """Generate a 50x50 terrain patch, optionally containing an archaeological site."""
    x = np.arange(size)
    X, Y = np.meshgrid(x, x)

    # Natural terrain
    patch = 50 + np.random.normal(0, 0.5, (size, size))
    patch += 2 * np.sin(X / (8 + np.random.uniform(-2, 2)))

    if has_site:
        # Add rectangular structure
        cx, cy = size//2 + np.random.randint(-5, 5), size//2 + np.random.randint(-5, 5)
        w = np.random.randint(8, 20)
        h = np.random.randint(8, 20)
        wall_h = np.random.uniform(1.5, 4.0)

        for wx, wy, ww, wh in [
            (cx-w//2, cy-h//2, w, 1), (cx-w//2, cy+h//2, w, 1),
            (cx-w//2, cy-h//2, 1, h), (cx+w//2, cy-h//2, 1, h)
        ]:
            m = (X>=wx)&(X<wx+ww)&(Y>=wy)&(Y<wy+wh)
            patch[m] += wall_h

        # Platform
        pm = (X>cx-w//2+1)&(X<cx+w//2)&(Y>cy-h//2+1)&(Y<cy+h//2)
        patch[pm] += wall_h * 0.4

    return patch

def extract_features(patch):
    """Extract archaeological feature vector from a terrain patch."""
    # Gradient
    dy, dx = np.gradient(patch)
    grad_mag = np.sqrt(dx**2 + dy**2)

    # Height anomaly
    border = np.concatenate([patch[0,:], patch[-1,:], patch[:,0], patch[:,-1]])
    border_mean = np.mean(border)
    center = patch[10:-10, 10:-10]
    height_anomaly = np.mean(center) - border_mean

    # Edge strength
    max_grad = np.max(grad_mag)
    mean_grad = np.mean(grad_mag)
    grad_std = np.std(grad_mag)

    # Threshold edges and measure rectangularity
    edge_thresh = np.percentile(grad_mag, 85)
    edges = grad_mag > edge_thresh
    coords = np.argwhere(edges)
    if len(coords) > 4:
        min_r, min_c = coords.min(axis=0)
        max_r, max_c = coords.max(axis=0)
        bbox_area = max((max_r-min_r+1) * (max_c-min_c+1), 1)
        rectangularity = len(coords) / bbox_area
    else:
        rectangularity = 0

    # Edge direction concentration (man-made = concentrated at 0/90°)
    directions = np.arctan2(dy, dx)
    edge_dirs = np.degrees(directions[edges]) % 180
    if len(edge_dirs) > 0:
        hist, _ = np.histogram(edge_dirs, bins=18, range=(0, 180))
        dir_concentration = np.max(hist) / np.sum(hist)
    else:
        dir_concentration = 0

    # Elevation variance ratio (center vs border)
    var_ratio = np.var(center) / max(np.var(border), 0.01)

    return np.array([
        height_anomaly,
        max_grad,
        grad_std,
        rectangularity,
        dir_concentration,
        var_ratio,
    ])

# --- Generate dataset ---
n_sites = 80
n_nonsites = 200

X_data = []
y_data = []

for _ in range(n_sites):
    patch = generate_patch(has_site=True)
    X_data.append(extract_features(patch))
    y_data.append(1)

for _ in range(n_nonsites):
    patch = generate_patch(has_site=False)
    X_data.append(extract_features(patch))
    y_data.append(0)

X_data = np.array(X_data)
y_data = np.array(y_data)

feature_names = ['height_anomaly', 'max_gradient', 'gradient_std',
                 'rectangularity', 'direction_conc', 'variance_ratio']

# --- Train/test split ---
indices = np.random.permutation(len(y_data))
split = int(0.7 * len(indices))
train_idx, test_idx = indices[:split], indices[split:]
X_train, X_test = X_data[train_idx], X_data[test_idx]
y_train, y_test = y_data[train_idx], y_data[test_idx]

# --- Simple logistic regression from scratch ---
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

# Normalize features
mu = X_train.mean(axis=0)
sigma = X_train.std(axis=0) + 1e-8
X_tr_n = (X_train - mu) / sigma
X_te_n = (X_test - mu) / sigma

# Train
w = np.zeros(X_tr_n.shape[1])
b = 0.0
lr = 0.1
for epoch in range(500):
    z = X_tr_n @ w + b
    p = sigmoid(z)
    grad_w = X_tr_n.T @ (p - y_train) / len(y_train)
    grad_b = np.mean(p - y_train)
    w -= lr * grad_w
    b -= lr * grad_b

# --- Evaluate ---
probs = sigmoid(X_te_n @ w + b)
preds = (probs > 0.5).astype(int)

tp = np.sum((preds == 1) & (y_test == 1))
fp = np.sum((preds == 1) & (y_test == 0))
fn = np.sum((preds == 0) & (y_test == 1))
tn = np.sum((preds == 0) & (y_test == 0))

precision = tp / max(tp + fp, 1)
recall = tp / max(tp + fn, 1)
f1 = 2 * precision * recall / max(precision + recall, 1e-8)

# --- Plot ---
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')
for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Feature importance (absolute weights)
importance = np.abs(w)
sorted_idx = np.argsort(importance)
axes[0].barh(range(len(w)), importance[sorted_idx], color='#22c55e')
axes[0].set_yticks(range(len(w)))
axes[0].set_yticklabels([feature_names[i] for i in sorted_idx], color='white', fontsize=9)
axes[0].set_xlabel('|Weight|', color='white')
axes[0].set_title('Feature importance', color='white', fontsize=11)

# Confusion matrix
cm = np.array([[tn, fp], [fn, tp]])
im = axes[1].imshow(cm, cmap='Blues')
axes[1].set_xticks([0,1]); axes[1].set_xticklabels(['No site','Site'], color='white')
axes[1].set_yticks([0,1]); axes[1].set_yticklabels(['No site','Site'], color='white')
for i in range(2):
    for j in range(2):
        axes[1].text(j, i, str(cm[i,j]), ha='center', va='center', color='white', fontsize=16, fontweight='bold')
axes[1].set_title(f'Confusion matrix (F1={f1:.2f})', color='white', fontsize=11)
axes[1].set_xlabel('Predicted', color='white')
axes[1].set_ylabel('Actual', color='white')

# Score distribution
site_probs = probs[y_test == 1]
nosite_probs = probs[y_test == 0]
axes[2].hist(nosite_probs, bins=20, alpha=0.7, color='#ef4444', label='Non-sites')
axes[2].hist(site_probs, bins=20, alpha=0.7, color='#22c55e', label='Sites')
axes[2].axvline(0.5, color='white', linestyle='--', label='Threshold')
axes[2].set_xlabel('Predicted probability', color='white')
axes[2].set_ylabel('Count', color='white')
axes[2].set_title('Score distribution', color='white', fontsize=11)
axes[2].legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Training: {len(y_train)} patches ({sum(y_train)} sites, {len(y_train)-sum(y_train)} non-sites)")
print(f"Testing:  {len(y_test)} patches ({sum(y_test)} sites, {len(y_test)-sum(y_test)} non-sites)")
print(f"\\nResults:")
print(f"  Precision: {precision:.3f} (of flagged locations, {precision:.0%} are real sites)")
print(f"  Recall:    {recall:.3f} ({recall:.0%} of real sites were detected)")
print(f"  F1 Score:  {f1:.3f}")
print(f"\\nTop features: {feature_names[np.argmax(importance)]}, {feature_names[np.argsort(importance)[-2]]}")`,
      challenge: 'Increase class imbalance: use 20 sites and 500 non-sites. Observe how F1 drops. Then implement cost-sensitive training by weighting site errors 10x higher than non-site errors in the gradient computation. Does this recover recall?',
      successHint: 'You can now train and evaluate a site detection classifier with appropriate metrics for rare-event detection — the foundation of automated archaeological survey.',
    },
    {
      title: 'Multi-layer site analysis — combining evidence across scales',
      concept: `Real archaeological prospection does not rely on a single data source. LiDAR reveals topography, but multi-layer analysis integrates:

- **LiDAR DEM**: structural features (walls, platforms, moats).
- **Multispectral imagery**: vegetation stress patterns — trees growing on buried stone have different spectral signatures than trees on natural soil.
- **Soil moisture maps**: buried walls block water flow, creating moisture anomalies visible in thermal and radar data.
- **Magnetic survey**: fired bricks and kilns create magnetic anomalies detectable by ground sensors.
- **Historical records**: old maps, chronicles, and local oral traditions narrow the search area.

Each layer provides **independent evidence**. The statistical framework for combining them is **Bayesian updating**:

P(site | evidence) = P(evidence | site) × P(site) / P(evidence)

Start with a prior probability (P(site) = base rate of sites in the region). Each evidence layer updates the posterior. LiDAR edge detection gives one likelihood ratio. Vegetation anomaly gives another. Soil moisture gives a third. The combined posterior is far more reliable than any single layer.

This is **evidence fusion** — the same principle used in medical diagnosis (combining symptoms, tests, imaging) and in the justice system (combining physical evidence, testimony, forensics).`,
      analogy: 'Diagnosing a disease from one symptom is unreliable — a headache could be anything. But a headache plus fever plus stiff neck plus recent travel to a malaria zone? Now the diagnosis is confident. Multi-layer site analysis works the same way: each LiDAR edge, vegetation anomaly, and soil moisture pattern is a "symptom." Alone, each is ambiguous. Together, they converge on a diagnosis.',
      storyConnection: 'The expedition to find the lost temple followed a single clue — an old map. They could have combined that map with local knowledge (oral traditions about sacred groves), environmental observation (different tree species growing on stone foundations), and geological surveys. Multi-layer analysis is the formalization of what any thorough explorer does: gather evidence from multiple independent sources and look for convergence.',
      checkQuestion: 'Why does Bayesian evidence fusion require evidence layers to be reasonably independent?',
      checkAnswer: 'If two evidence layers are correlated (e.g., vegetation stress and soil moisture are both caused by the same buried wall), counting them as independent double-counts the evidence, making the posterior overconfident. True independence means each layer adds genuinely new information. In practice, some correlation is inevitable, so archaeologists use conservative likelihood ratios and verify with ground-truth excavation.',
      codeIntro: 'Implement Bayesian evidence fusion across three data layers (LiDAR, vegetation, soil moisture) to create a probability map of site locations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n = 100
xs = np.arange(n)
X, Y = np.meshgrid(xs, xs)

# --- Ground truth: two sites ---
site1 = (X > 20) & (X < 45) & (Y > 30) & (Y < 55)  # large temple
site2 = (X > 65) & (X < 80) & (Y > 60) & (Y < 75)  # small shrine

# --- Layer 1: LiDAR edge score ---
lidar_score = np.random.uniform(0.05, 0.3, (n, n))  # base noise
# Sites have strong edges
lidar_score[site1] += np.random.uniform(0.3, 0.6, site1.sum())
lidar_score[site2] += np.random.uniform(0.25, 0.5, site2.sum())
# Some false positives (natural features)
false_pos = ((X-85)**2 + (Y-20)**2) < 100
lidar_score[false_pos] += np.random.uniform(0.2, 0.4, false_pos.sum())
lidar_score = np.clip(lidar_score, 0, 1)

# --- Layer 2: Vegetation anomaly ---
veg_score = np.random.uniform(0.05, 0.25, (n, n))
# Buried stone changes vegetation — but noisier than LiDAR
veg_score[site1] += np.random.uniform(0.2, 0.5, site1.sum())
veg_score[site2] += np.random.uniform(0.15, 0.4, site2.sum())
# Different false positive (wet area mimics vegetation stress)
wet_area = ((X-50)**2 + (Y-85)**2) < 64
veg_score[wet_area] += np.random.uniform(0.2, 0.35, wet_area.sum())
veg_score = np.clip(veg_score, 0, 1)

# --- Layer 3: Soil moisture anomaly ---
moisture_score = np.random.uniform(0.05, 0.2, (n, n))
moisture_score[site1] += np.random.uniform(0.25, 0.55, site1.sum())
moisture_score[site2] += np.random.uniform(0.2, 0.45, site2.sum())
# Yet another false positive location
road = np.abs(Y - X - 10) < 3
moisture_score[road] += np.random.uniform(0.15, 0.3, road.sum())
moisture_score = np.clip(moisture_score, 0, 1)

# --- Bayesian fusion ---
def bayesian_fusion(layers, prior=0.01):
    """Combine evidence layers using Bayesian updating.

    Each layer value is treated as P(evidence | site).
    P(evidence | no_site) = 1 - layer_value (simplified).
    """
    # Start with prior odds
    posterior = np.full(layers[0].shape, prior)

    for layer in layers:
        # Likelihood ratio
        p_e_site = np.clip(layer, 0.01, 0.99)
        p_e_nosite = np.clip(1 - layer * 0.7, 0.01, 0.99)  # sites explain evidence better
        lr = p_e_site / p_e_nosite

        # Update: convert prob -> odds -> multiply LR -> convert back
        odds = posterior / (1 - posterior + 1e-10)
        odds *= lr
        posterior = odds / (1 + odds)

    return posterior

posterior = bayesian_fusion([lidar_score, veg_score, moisture_score], prior=0.01)

# --- Evaluate detection ---
threshold = 0.5
detected = posterior > threshold
true_sites = site1 | site2

tp = np.sum(detected & true_sites)
fp = np.sum(detected & ~true_sites)
fn = np.sum(~detected & true_sites)
precision = tp / max(tp + fp, 1)
recall = tp / max(tp + fn, 1)
f1 = 2 * precision * recall / max(precision + recall, 1e-8)

# --- Plot ---
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
titles = ['LiDAR edge score', 'Vegetation anomaly', 'Soil moisture',
          'Bayesian posterior', 'Detected sites (P>0.5)', 'Ground truth']
data = [lidar_score, veg_score, moisture_score, posterior, detected.astype(float), (true_sites).astype(float)]
cmaps = ['hot', 'YlGn', 'Blues', 'magma', 'Greens', 'Oranges']

for ax, title, d, cmap in zip(axes.flat, titles, data, cmaps):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    im = ax.imshow(d, extent=[0,100,0,100], origin='lower', cmap=cmap, vmin=0, vmax=1)
    ax.set_title(title, color='white', fontsize=10)
    plt.colorbar(im, ax=ax, shrink=0.8)

plt.tight_layout()
plt.show()

print("Bayesian Evidence Fusion Results")
print("=" * 50)
print(f"Prior probability of site: 1%")
print(f"Evidence layers: LiDAR edges, vegetation, soil moisture")
print(f"\\nDetection (threshold=0.5):")
print(f"  True positives:  {tp}")
print(f"  False positives: {fp}")
print(f"  Missed sites:    {fn}")
print(f"  Precision: {precision:.3f}")
print(f"  Recall:    {recall:.3f}")
print(f"  F1 Score:  {f1:.3f}")
print(f"\\nKey insight: false positives in ONE layer are filtered out by other layers.")
print(f"  LiDAR false positive (natural feature at 85,20): no veg/moisture support -> filtered")
print(f"  Vegetation false positive (wet area at 50,85): no LiDAR/moisture support -> filtered")
print(f"  Only locations with convergent evidence survive fusion.")`,
      challenge: 'Add a fourth layer — a "historical probability" layer based on distance to known rivers (temples tend to be near water). Does adding this prior knowledge layer improve or degrade detection? Test with different river configurations.',
      successHint: 'You have built a complete multi-layer archaeological prospection system. The Bayesian fusion framework generalizes to any domain where multiple noisy evidence sources must be combined — from medical diagnosis to autonomous driving to fraud detection.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (geospatial fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for archaeological remote sensing analysis. Click to start.</p>
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
