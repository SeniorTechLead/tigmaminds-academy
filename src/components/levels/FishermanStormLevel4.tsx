import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import CycloneCrossSectionDiagram from '../diagrams/CycloneCrossSectionDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import MonsoonDiagram from '../diagrams/MonsoonDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import ClimateZonesDiagram from '../diagrams/ClimateZonesDiagram';

export default function FishermanStormLevel4() {
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
      title: 'Capstone Project Design — Building a Cyclone Tracker',
      concept: `In Levels 1-3 you learned the physics of storms: pressure gradients, Coriolis rotation, sea surface temperature, numerical weather prediction, storm surge, and climate impacts. Now you will integrate everything into a single project — a **Bay of Bengal Cyclone Tracker** that ingests historical cyclone data, visualizes tracks, predicts future motion, estimates intensity, and assesses coastal impact.

Real operational cyclone trackers (like those used by the India Meteorological Department or JTWC) combine satellite imagery, radar, weather station data, and numerical model output. Our simplified version will use the same core algorithms but with synthetic data modeled on real Bay of Bengal cyclone statistics. The key components are:

1. **Data layer**: Historical cyclone tracks with position, intensity, and timing. We will generate realistic synthetic data based on published Bay of Bengal cyclone climatology.
2. **Visualization layer**: Map-based display of tracks, intensity color-coding, and statistical overlays showing common tracks and landfall zones.
3. **Prediction layer**: A persistence-climatology model (CLIPER) that predicts future motion by blending a cyclone's recent movement with historical average motion at that location and time of year.
4. **Intensity layer**: A simplified Dvorak-like technique that estimates intensity from environmental parameters (SST, wind shear, distance from land).
5. **Impact layer**: Storm surge estimation from pressure deficit and wind speed, applied to Bay of Bengal coastal profiles.

Each of the remaining five mini-lessons builds one of these components. By the end, you will have a complete, working cyclone analysis tool.`,
      analogy: 'Building a cyclone tracker is like assembling a weather station from components. Each sensor (barometer, anemometer, rain gauge) is useful alone, but the real power comes from integrating them into a dashboard that tells a coherent story. Your data module is the sensor array, your prediction model is the brain, and your visualization is the display panel.',
      storyConnection: 'The fisherman\'s daughter had no satellite imagery or computer models — she had her father\'s experience and the color of the sky. But the tracker you will build encodes the same knowledge: where storms tend to form, how they tend to move, what makes them strengthen or weaken. Every algorithm in this project translates a piece of traditional maritime knowledge into quantitative code that can warn thousands of fishing families along the Brahmaputra delta.',
      checkQuestion: 'Why is a "persistence-climatology" model (CLIPER) used as a baseline for cyclone track forecasting instead of simply extrapolating the current motion (pure persistence)?',
      checkAnswer: 'Pure persistence assumes the cyclone will keep moving in the same direction at the same speed indefinitely. This fails because cyclones curve — especially in the Bay of Bengal where they often recurve northward and then northeastward as they interact with mid-latitude westerlies. Climatology captures this average curvature. Blending persistence (recent motion) with climatology (what storms historically do at this location and season) gives a baseline that is surprisingly hard to beat for short-range forecasts. Any model that cannot outperform CLIPER is not worth using.',
      codeIntro: 'Set up the project framework: define data structures for cyclone tracks, create the synthetic data generator calibrated to Bay of Bengal statistics, and build the base visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CYCLONE TRACKER: Project Framework & Data Structures
# ============================================================

class CycloneTrack:
    """Represents a single cyclone's life history."""
    def __init__(self, name, year, season, lats, lons, winds, pressures, times):
        self.name = name
        self.year = year
        self.season = season  # 'pre-monsoon' or 'post-monsoon'
        self.lats = np.array(lats)
        self.lons = np.array(lons)
        self.winds = np.array(winds)       # max sustained wind (m/s)
        self.pressures = np.array(pressures)  # central pressure (hPa)
        self.times = np.array(times)        # hours since genesis
        self.n_points = len(lats)

    def category(self):
        """Saffir-Simpson category from max wind."""
        vmax = self.winds.max()
        if vmax >= 70: return 5
        if vmax >= 58: return 4
        if vmax >= 50: return 3
        if vmax >= 43: return 2
        if vmax >= 33: return 1
        return 0  # tropical storm or depression

    def landfall_point(self):
        """Find approximate landfall (first point where lat > 20 and lon < 92)."""
        for i in range(self.n_points):
            if self.lats[i] > 20 and self.lons[i] < 92:
                return self.lats[i], self.lons[i], self.winds[i]
        return None

def generate_bob_cyclone(name, year, season):
    """
    Generate a realistic Bay of Bengal cyclone track.
    Based on published BoB cyclone statistics:
    - Genesis: 8-15°N, 82-92°E
    - Motion: generally NW to NNE
    - Recurvature common above 18°N
    - Typical lifespan: 3-10 days
    """
    # Genesis location
    if season == 'pre-monsoon':
        lat0 = np.random.uniform(8, 13)
        lon0 = np.random.uniform(84, 92)
    else:
        lat0 = np.random.uniform(7, 14)
        lon0 = np.random.uniform(82, 90)

    # Track generation: random walk with NW bias + recurvature
    n_steps = np.random.randint(20, 60)  # 6-hourly positions
    dt_hours = 6

    lats, lons = [lat0], [lon0]
    # Base motion: NW with some randomness
    base_dlat = np.random.uniform(0.15, 0.35)  # degrees per 6 hours northward
    base_dlon = np.random.uniform(-0.25, -0.05)  # westward

    for i in range(1, n_steps):
        # Recurvature: above 18°N, start turning NE
        if lats[-1] > 18:
            dlat = base_dlat * max(0.3, 1 - 0.05 * (lats[-1] - 18))
            dlon = base_dlon + 0.02 * (lats[-1] - 18)
        else:
            dlat = base_dlat
            dlon = base_dlon

        # Add stochastic wobble
        dlat += np.random.normal(0, 0.08)
        dlon += np.random.normal(0, 0.08)

        new_lat = lats[-1] + dlat
        new_lon = lons[-1] + dlon

        # Stop if goes too far north (over land) or out of basin
        if new_lat > 26 or new_lon < 78 or new_lon > 100:
            break
        lats.append(new_lat)
        lons.append(new_lon)

    n = len(lats)
    times = np.arange(n) * dt_hours

    # Intensity profile: ramp up, peak, decay
    peak_idx = np.random.randint(n // 3, 2 * n // 3)
    max_wind = np.random.choice([25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                                 p=[0.15, 0.15, 0.15, 0.15, 0.12, 0.10, 0.08, 0.05, 0.03, 0.02])

    winds = np.zeros(n)
    for i in range(n):
        if i <= peak_idx:
            winds[i] = 15 + (max_wind - 15) * (i / peak_idx)**1.5
        else:
            decay = (i - peak_idx) / (n - peak_idx)
            winds[i] = max_wind * (1 - decay**1.2)
            winds[i] = max(winds[i], 10)
    winds += np.random.normal(0, 2, n)
    winds = np.clip(winds, 10, 80)

    # Pressure from wind (empirical: P = 1010 - 0.7 * V_max)
    pressures = 1010 - 0.7 * winds + np.random.normal(0, 2, n)

    return CycloneTrack(name, year, season, lats, lons, winds, pressures, times)

# Generate 30 years of cyclone data (1990-2020)
cyclone_names = [
    'Aila', 'Nargis', 'Sidr', 'Phailin', 'Hudhud', 'Titli', 'Fani',
    'Bulbul', 'Amphan', 'Yaas', 'Vardah', 'Ockhi', 'Gaja', 'Madi',
    'Lehar', 'Helen', 'Mora', 'Roanu', 'Komen', 'Chapala',
    'Kyant', 'Nada', 'Daye', 'Phethai', 'Jawad', 'Gulab', 'Shaheen',
    'Asani', 'Sitrang', 'Mandous'
]

all_cyclones = []
for i, name in enumerate(cyclone_names):
    year = 1990 + i
    season = 'post-monsoon' if np.random.random() > 0.35 else 'pre-monsoon'
    cyclone = generate_bob_cyclone(name, year, season)
    all_cyclones.append(cyclone)

# Visualization: overview map of all tracks
fig, ax = plt.subplots(1, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#0c1220')

# Draw simplified coastline (Bay of Bengal outline)
coast_lats = [5, 8, 10, 13, 15, 16, 18, 20, 21, 22, 23, 22, 21, 20, 18, 15, 12, 8, 5]
coast_lons = [80, 77, 76, 75, 78, 80, 82, 85, 87, 89, 90, 92, 93, 94, 95, 96, 97, 98, 100]
ax.fill(coast_lons, coast_lats, color='#2d3a2d', alpha=0.3)
ax.plot(coast_lons, coast_lats, color='#4a5a4a', linewidth=1.5)

# Color tracks by category
cat_colors = {0: '#6b7280', 1: '#22c55e', 2: '#3b82f6', 3: '#f59e0b', 4: '#f97316', 5: '#ef4444'}
cat_labels = {0: 'TD/TS', 1: 'Cat 1', 2: 'Cat 2', 3: 'Cat 3', 4: 'Cat 4', 5: 'Cat 5'}

plotted_cats = set()
for cyc in all_cyclones:
    cat = cyc.category()
    label = cat_labels[cat] if cat not in plotted_cats else None
    ax.plot(cyc.lons, cyc.lats, color=cat_colors[cat], linewidth=1.2, alpha=0.7, label=label)
    ax.plot(cyc.lons[0], cyc.lats[0], 'o', color=cat_colors[cat], markersize=3)
    plotted_cats.add(cat)

ax.set_xlim(75, 100)
ax.set_ylim(5, 26)
ax.set_title('Bay of Bengal Cyclone Tracks (30-year synthetic dataset)', color='white', fontsize=14)
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.tick_params(colors='gray')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax.grid(True, alpha=0.1, color='gray')

# Mark key locations
locations = {'Kolkata': (88.4, 22.6), 'Chittagong': (91.8, 22.3),
             'Visakhapatnam': (83.3, 17.7), 'Chennai': (80.3, 13.1)}
for city, (lon, lat) in locations.items():
    ax.plot(lon, lat, 's', color='white', markersize=5)
    ax.annotate(city, (lon + 0.3, lat + 0.3), color='white', fontsize=8)

plt.tight_layout()
plt.show()

# Summary statistics
cats = [c.category() for c in all_cyclones]
print("Bay of Bengal Cyclone Tracker — Dataset Summary")
print("=" * 55)
print(f"Total cyclones: {len(all_cyclones)}")
print(f"Time period: {all_cyclones[0].year}-{all_cyclones[-1].year}")
print(f"Category distribution:")
for cat in sorted(set(cats)):
    count = cats.count(cat)
    print(f"  {cat_labels[cat]}: {count} ({count/len(cats)*100:.0f}%)")
print(f"\\nLandfall analysis:")
landfalls = [c.landfall_point() for c in all_cyclones if c.landfall_point()]
print(f"  Cyclones making landfall: {len(landfalls)}/{len(all_cyclones)}")
if landfalls:
    lf_winds = [lf[2] for lf in landfalls]
    print(f"  Mean landfall wind: {np.mean(lf_winds):.1f} m/s")
    print(f"  Max landfall wind:  {np.max(lf_winds):.1f} m/s")`,
      challenge: 'Enhance the data generator to include rapid intensification events (wind speed increase of 15+ m/s in 24 hours). What fraction of your cyclones undergo RI? How does this compare to the observed ~10-15% rate in the Bay of Bengal?',
      successHint: 'Good synthetic data is the foundation of any analysis tool. By calibrating your generator to real statistics, you can test algorithms without needing access to restricted operational datasets. This is a standard technique in meteorological research.',
    },
    {
      title: 'Historical Data Analysis — Cyclone Track Climatology',
      concept: `Before building any predictive model, you must understand the data. Cyclone climatology — the statistical study of where, when, and how storms behave — reveals patterns that form the backbone of every forecasting system. For the Bay of Bengal, the key climatological facts are:

**Seasonality**: Two distinct cyclone seasons — pre-monsoon (April-June) and post-monsoon (October-December). Post-monsoon produces more and stronger cyclones because the Bay retains summer heat while atmospheric conditions become favorable for organized convection.

**Genesis zones**: Most Bay of Bengal cyclones form between 8-14°N and 82-92°E. The central and southern Bay is the nursery. The Andaman Sea contributes some storms, especially in the post-monsoon season.

**Track patterns**: The dominant motion is northwestward, driven by the subtropical ridge. However, many storms recurve — turning northward and then northeastward as they interact with mid-latitude troughs. The recurvature point is critical: it determines whether a storm hits the Indian coast (Odisha, Andhra Pradesh) or curves toward Bangladesh and Myanmar.

Analyzing these patterns quantitatively — computing track density maps, landfall probability distributions, intensity statistics by location — gives you the "climatology" half of the CLIPER (CLImatology and PERsistence) forecasting model. Every point in the Bay of Bengal has an average cyclone motion vector derived from decades of historical data. This vector tells you: "storms passing through this grid cell, at this time of year, typically move in direction X at speed Y."`,
      analogy: 'Cyclone climatology is like studying traffic patterns on a highway. Most cars (cyclones) travel in the same general direction, at similar speeds, with predictable rush hours (cyclone seasons). Some take the main exit (landfall on the Indian coast), others continue straight (cross into Bangladesh). By counting thousands of trips, you learn the most probable routes — even though individual cars deviate.',
      storyConnection: 'The fisherman\'s elders on the Brahmaputra knew that October and November were the dangerous months. They knew storms approached from the south-southeast. They knew that a storm moving slowly was more dangerous than a fast-moving one because it dumped more rain. This was climatological knowledge — accumulated over generations of observation. Your analysis code formalizes the same wisdom into probability maps and statistical distributions.',
      checkQuestion: 'Why is track density (number of cyclone positions per grid cell) more useful than simply counting the number of cyclones that form in each grid cell?',
      checkAnswer: 'A cyclone that forms elsewhere can still pass through your grid cell. Track density captures total exposure — the number of times any cyclone occupies a given location, regardless of where it formed. A coastal grid cell might have zero genesis events but very high track density because it sits on a common approach path. For risk assessment, track density (exposure) matters more than genesis density (origin).',
      codeIntro: 'Perform a full climatological analysis of the synthetic dataset: track density maps, monthly distribution, intensity statistics by region, and average motion vectors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate cyclone dataset (same as MiniLesson 1)
class CycloneTrack:
    def __init__(self, name, year, season, lats, lons, winds, pressures, times):
        self.name, self.year, self.season = name, year, season
        self.lats, self.lons = np.array(lats), np.array(lons)
        self.winds, self.pressures = np.array(winds), np.array(pressures)
        self.times, self.n_points = np.array(times), len(lats)
    def category(self):
        vmax = self.winds.max()
        if vmax >= 70: return 5
        if vmax >= 58: return 4
        if vmax >= 50: return 3
        if vmax >= 43: return 2
        if vmax >= 33: return 1
        return 0

def generate_bob_cyclone(name, year, season):
    lat0 = np.random.uniform(8, 13) if season == 'pre-monsoon' else np.random.uniform(7, 14)
    lon0 = np.random.uniform(84, 92) if season == 'pre-monsoon' else np.random.uniform(82, 90)
    n_steps = np.random.randint(20, 60)
    lats, lons = [lat0], [lon0]
    base_dlat = np.random.uniform(0.15, 0.35)
    base_dlon = np.random.uniform(-0.25, -0.05)
    for i in range(1, n_steps):
        if lats[-1] > 18:
            dlat = base_dlat * max(0.3, 1 - 0.05 * (lats[-1] - 18))
            dlon = base_dlon + 0.02 * (lats[-1] - 18)
        else:
            dlat, dlon = base_dlat, base_dlon
        dlat += np.random.normal(0, 0.08)
        dlon += np.random.normal(0, 0.08)
        new_lat, new_lon = lats[-1] + dlat, lons[-1] + dlon
        if new_lat > 26 or new_lon < 78 or new_lon > 100: break
        lats.append(new_lat); lons.append(new_lon)
    n = len(lats)
    times = np.arange(n) * 6
    peak_idx = np.random.randint(n // 3, 2 * n // 3)
    max_wind = np.random.choice([25,30,35,40,45,50,55,60,65,70],
                                 p=[.15,.15,.15,.15,.12,.10,.08,.05,.03,.02])
    winds = np.zeros(n)
    for i in range(n):
        if i <= peak_idx: winds[i] = 15 + (max_wind - 15) * (i / peak_idx)**1.5
        else:
            decay = (i - peak_idx) / (n - peak_idx)
            winds[i] = max(max_wind * (1 - decay**1.2), 10)
    winds = np.clip(winds + np.random.normal(0, 2, n), 10, 80)
    pressures = 1010 - 0.7 * winds + np.random.normal(0, 2, n)
    return CycloneTrack(name, year, season, lats, lons, winds, pressures, times)

names = ['Aila','Nargis','Sidr','Phailin','Hudhud','Titli','Fani','Bulbul',
         'Amphan','Yaas','Vardah','Ockhi','Gaja','Madi','Lehar','Helen',
         'Mora','Roanu','Komen','Chapala','Kyant','Nada','Daye','Phethai',
         'Jawad','Gulab','Shaheen','Asani','Sitrang','Mandous']
cyclones = [generate_bob_cyclone(n, 1990+i,
            'post-monsoon' if np.random.random() > 0.35 else 'pre-monsoon')
            for i, n in enumerate(names)]

# ============================================================
# CLIMATOLOGICAL ANALYSIS
# ============================================================

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# 1. Track density map (2x2 degree grid)
ax = axes[0, 0]
ax.set_facecolor('#0c1220')
lat_bins = np.arange(5, 27, 2)
lon_bins = np.arange(75, 101, 2)
density = np.zeros((len(lat_bins)-1, len(lon_bins)-1))

for cyc in cyclones:
    for lat, lon in zip(cyc.lats, cyc.lons):
        li = np.searchsorted(lat_bins, lat) - 1
        lj = np.searchsorted(lon_bins, lon) - 1
        if 0 <= li < len(lat_bins)-1 and 0 <= lj < len(lon_bins)-1:
            density[li, lj] += 1

lon_centers = (lon_bins[:-1] + lon_bins[1:]) / 2
lat_centers = (lat_bins[:-1] + lat_bins[1:]) / 2
LON, LAT = np.meshgrid(lon_centers, lat_centers)

im = ax.pcolormesh(lon_bins, lat_bins, density, cmap='hot', shading='flat')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Track points per grid cell', color='white')
cbar.ax.tick_params(colors='gray')
# Coastline
coast_lats = [5,8,10,13,15,16,18,20,21,22,23,22,21,20,18,15,12,8,5]
coast_lons = [80,77,76,75,78,80,82,85,87,89,90,92,93,94,95,96,97,98,100]
ax.plot(coast_lons, coast_lats, color='#4a5a4a', linewidth=1.5)
ax.set_title('Track Density Map', color='white', fontsize=12)
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.tick_params(colors='gray')

# 2. Average motion vectors per grid cell
ax = axes[0, 1]
ax.set_facecolor('#0c1220')

motion_u = np.zeros_like(density)
motion_v = np.zeros_like(density)
motion_count = np.zeros_like(density)

for cyc in cyclones:
    for k in range(len(cyc.lats) - 1):
        lat, lon = cyc.lats[k], cyc.lons[k]
        li = np.searchsorted(lat_bins, lat) - 1
        lj = np.searchsorted(lon_bins, lon) - 1
        if 0 <= li < len(lat_bins)-1 and 0 <= lj < len(lon_bins)-1:
            motion_u[li, lj] += (cyc.lons[k+1] - cyc.lons[k])
            motion_v[li, lj] += (cyc.lats[k+1] - cyc.lats[k])
            motion_count[li, lj] += 1

mask = motion_count > 0
motion_u[mask] /= motion_count[mask]
motion_v[mask] /= motion_count[mask]
speed = np.sqrt(motion_u**2 + motion_v**2)

im = ax.pcolormesh(lon_bins, lat_bins, speed, cmap='viridis', shading='flat', alpha=0.5)
ax.quiver(LON[mask], LAT[mask], motion_u[mask], motion_v[mask],
          color='white', scale=3, width=0.005)
ax.plot(coast_lons, coast_lats, color='#4a5a4a', linewidth=1.5)
ax.set_title('Average Cyclone Motion Vectors', color='white', fontsize=12)
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.tick_params(colors='gray')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Speed (deg/6hr)', color='white')
cbar.ax.tick_params(colors='gray')

# 3. Intensity distribution by latitude band
ax = axes[1, 0]
ax.set_facecolor('#111827')
lat_bands = [(5, 12, 'South BoB (5-12°N)'), (12, 18, 'Central BoB (12-18°N)'),
             (18, 26, 'North BoB (18-26°N)')]
band_colors = ['#3b82f6', '#f59e0b', '#ef4444']

for (lat_lo, lat_hi, label), color in zip(lat_bands, band_colors):
    band_winds = []
    for cyc in cyclones:
        mask = (cyc.lats >= lat_lo) & (cyc.lats < lat_hi)
        if mask.any():
            band_winds.extend(cyc.winds[mask])
    if band_winds:
        ax.hist(band_winds, bins=20, alpha=0.5, color=color, label=label, density=True)

ax.set_title('Wind Speed Distribution by Latitude', color='white', fontsize=12)
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Density', color='white')
ax.tick_params(colors='gray')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Genesis density and landfall histogram
ax = axes[1, 1]
ax.set_facecolor('#111827')
genesis_lons = [cyc.lons[0] for cyc in cyclones]
genesis_lats = [cyc.lats[0] for cyc in cyclones]

# Landfall latitudes (approximate: first point with lon < 90 and lat > 18)
landfall_lats = []
for cyc in cyclones:
    for k in range(cyc.n_points):
        if cyc.lats[k] > 18 and cyc.lons[k] < 91:
            landfall_lats.append(cyc.lats[k])
            break

ax.hist(genesis_lats, bins=12, alpha=0.5, color='#22c55e', label='Genesis latitude', density=True)
if landfall_lats:
    ax.hist(landfall_lats, bins=8, alpha=0.5, color='#ef4444', label='Landfall latitude', density=True)
ax.set_title('Genesis vs Landfall Latitude Distribution', color='white', fontsize=12)
ax.set_xlabel('Latitude (°N)', color='white')
ax.set_ylabel('Density', color='white')
ax.tick_params(colors='gray')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Cyclone Climatology Analysis")
print("=" * 50)
print(f"Dataset: {len(cyclones)} cyclones over {cyclones[-1].year - cyclones[0].year + 1} years")
print(f"\\nGenesis statistics:")
print(f"  Mean genesis latitude:  {np.mean(genesis_lats):.1f}°N")
print(f"  Mean genesis longitude: {np.mean(genesis_lons):.1f}°E")
print(f"\\nLandfall statistics:")
print(f"  Cyclones reaching north BoB: {len(landfall_lats)}/{len(cyclones)}")
if landfall_lats:
    print(f"  Mean landfall latitude: {np.mean(landfall_lats):.1f}°N")
print(f"\\nMotion vectors show the dominant NW track")
print(f"with recurvature above 18°N — exactly matching")
print(f"observed Bay of Bengal cyclone behavior.")`,
      challenge: 'Compute the "return period" for different intensity thresholds at a specific coastal grid cell (e.g., near Kolkata at 88°E, 22°N). How often does a Cat 3+ cyclone pass within 200 km? Express it as "once every N years."',
      successHint: 'Climatology is the foundation of probabilistic forecasting. Every number you computed — average motion, track density, intensity distribution — feeds directly into the prediction model. Without climatology, prediction is just extrapolation. With it, prediction becomes informed estimation.',
    },
    {
      title: 'Track Prediction — Persistence-Climatology Model (CLIPER)',
      concept: `The simplest useful cyclone track forecast blends two ideas: **persistence** (the storm will keep doing what it has been doing) and **climatology** (the storm will do what storms historically do at this location and season). This combination is called **CLIPER** (CLImatology and PERsistence), and it has been the official baseline for cyclone track forecasting since the 1970s.

Persistence extrapolates the cyclone's recent motion (over the past 12-24 hours) forward in time. If a storm has been moving northwest at 20 km/h, persistence says it will continue northwest at 20 km/h. This works well for 6-12 hours but degrades quickly because cyclones curve, accelerate, and decelerate.

Climatology uses the average motion vector at the cyclone's current location and time of year, derived from the historical database. It captures the large-scale steering patterns (e.g., the subtropical ridge pushes Bay of Bengal storms northwest, mid-latitude westerlies cause recurvature) but ignores the current storm's specific behavior.

CLIPER blends the two with time-dependent weights: at short forecast horizons (6-12 hours), persistence gets most of the weight because the storm's recent motion is more informative than the historical average. At longer horizons (48-72 hours), climatology dominates because persistence has decayed to uselessness. The formula is: **forecast_motion = alpha(t) * persistence + (1 - alpha(t)) * climatology**, where alpha(t) decreases from ~0.8 at 6 hours to ~0.2 at 72 hours. Any operational model that cannot beat CLIPER is considered to have no skill.`,
      analogy: 'Predicting a cyclone\'s path with CLIPER is like predicting where a taxi will be in 10 minutes. For the next 2 minutes, you just extend its current direction (persistence). For the next 10 minutes, you also consider that most taxis in this area are heading toward the airport (climatology). You weight your prediction toward the current direction for near-term and toward the common destination for longer-term.',
      storyConnection: 'When the fisherman\'s daughter watched a storm approach from the south-southeast over two days, the elders combined their immediate observation ("it is heading straight for us") with decades of memory ("storms like this usually curve east before reaching our village"). They were computing a CLIPER forecast in their heads — blending persistence with climatology. Sometimes the climatology saved them. Sometimes the storm defied the average.',
      checkQuestion: 'At a 72-hour forecast horizon, a CLIPER model gives 80% weight to climatology and 20% to persistence. A new ML model beats CLIPER at 72 hours by 15%. Is this impressive? What about beating it by 2%?',
      checkAnswer: 'Beating CLIPER by 15% at 72 hours is genuinely impressive — it means the ML model captures steering patterns that neither persistence nor historical averages encode (likely from current atmospheric state data). Beating it by only 2% is marginal — it could be noise or overfitting. The bar for "skillful" is consistently beating CLIPER. For operational use, a model needs to beat it by a meaningful margin across many storms, not just on average. CLIPER is deceptively hard to beat because it encodes so much information in a simple formula.',
      codeIntro: 'Implement a full CLIPER model: compute persistence from recent track points, look up climatological motion vectors, blend them with time-dependent weights, and evaluate forecast skill.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate dataset (compact version)
def gen_cyclone(seed_offset=0):
    rs = np.random.RandomState(42 + seed_offset)
    lat0 = rs.uniform(8, 14)
    lon0 = rs.uniform(82, 92)
    n_steps = rs.randint(25, 55)
    lats, lons = [lat0], [lon0]
    bdlat, bdlon = rs.uniform(0.15, 0.35), rs.uniform(-0.25, -0.05)
    for i in range(1, n_steps):
        dl = bdlat * (max(0.3, 1 - 0.05*(lats[-1]-18)) if lats[-1]>18 else 1)
        dn = bdlon + (0.02*(lats[-1]-18) if lats[-1]>18 else 0)
        dl += rs.normal(0, 0.08); dn += rs.normal(0, 0.08)
        nl, nn = lats[-1]+dl, lons[-1]+dn
        if nl > 26 or nn < 78 or nn > 100: break
        lats.append(nl); lons.append(nn)
    return np.array(lats), np.array(lons)

# Generate training set (20 cyclones) and test set (5 cyclones)
train_cyclones = [gen_cyclone(i) for i in range(20)]
test_cyclones = [gen_cyclone(i + 100) for i in range(5)]

# Build climatology grid: average motion per 2-degree cell
lat_bins = np.arange(5, 27, 2)
lon_bins = np.arange(75, 101, 2)
clim_dlat = np.zeros((len(lat_bins)-1, len(lon_bins)-1))
clim_dlon = np.zeros((len(lat_bins)-1, len(lon_bins)-1))
clim_count = np.zeros((len(lat_bins)-1, len(lon_bins)-1))

for lats, lons in train_cyclones:
    for k in range(len(lats) - 1):
        li = np.searchsorted(lat_bins, lats[k]) - 1
        lj = np.searchsorted(lon_bins, lons[k]) - 1
        if 0 <= li < clim_dlat.shape[0] and 0 <= lj < clim_dlat.shape[1]:
            clim_dlat[li, lj] += lats[k+1] - lats[k]
            clim_dlon[li, lj] += lons[k+1] - lons[k]
            clim_count[li, lj] += 1

mask = clim_count > 0
clim_dlat[mask] /= clim_count[mask]
clim_dlon[mask] /= clim_count[mask]

# Default motion for cells with no data
default_dlat = np.mean(clim_dlat[mask]) if mask.any() else 0.2
default_dlon = np.mean(clim_dlon[mask]) if mask.any() else -0.1

def get_climatology(lat, lon):
    """Look up average motion vector for this location."""
    li = np.searchsorted(lat_bins, lat) - 1
    lj = np.searchsorted(lon_bins, lon) - 1
    if 0 <= li < clim_dlat.shape[0] and 0 <= lj < clim_dlat.shape[1] and clim_count[li, lj] > 0:
        return clim_dlat[li, lj], clim_dlon[li, lj]
    return default_dlat, default_dlon

def persistence(lats, lons, n_back=2):
    """Compute persistence motion from last n_back points."""
    if len(lats) < 2:
        return default_dlat, default_dlon
    n = min(n_back, len(lats) - 1)
    dlat = (lats[-1] - lats[-1 - n]) / n
    dlon = (lons[-1] - lons[-1 - n]) / n
    return dlat, dlon

def cliper_forecast(lats, lons, n_steps_ahead=12):
    """
    CLIPER forecast: blend persistence and climatology.
    alpha(t) = 0.8 * exp(-t/8) — decays from 0.8 to ~0.2 over 12 steps.
    Each step = 6 hours.
    """
    fc_lats = [lats[-1]]
    fc_lons = [lons[-1]]

    p_dlat, p_dlon = persistence(lats, lons)

    for t in range(1, n_steps_ahead + 1):
        alpha = 0.8 * np.exp(-t / 8.0)  # persistence weight
        c_dlat, c_dlon = get_climatology(fc_lats[-1], fc_lons[-1])

        dlat = alpha * p_dlat + (1 - alpha) * c_dlat
        dlon = alpha * p_dlon + (1 - alpha) * c_dlon

        fc_lats.append(fc_lats[-1] + dlat)
        fc_lons.append(fc_lons[-1] + dlon)

    return np.array(fc_lats), np.array(fc_lons)

def pure_persistence_forecast(lats, lons, n_steps_ahead=12):
    """Pure persistence: just extrapolate recent motion."""
    p_dlat, p_dlon = persistence(lats, lons)
    fc_lats = [lats[-1]]
    fc_lons = [lons[-1]]
    for _ in range(n_steps_ahead):
        fc_lats.append(fc_lats[-1] + p_dlat)
        fc_lons.append(fc_lons[-1] + p_dlon)
    return np.array(fc_lats), np.array(fc_lons)

# Evaluate on test cyclones
# Start forecast from 40% into the track, predict the rest
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

all_errors_cliper = {6: [], 12: [], 24: [], 48: [], 72: []}
all_errors_persist = {6: [], 12: [], 24: [], 48: [], 72: []}

for idx, (lats, lons) in enumerate(test_cyclones):
    n = len(lats)
    start = int(n * 0.4)  # Start forecast from 40% into track
    n_ahead = n - start

    if n_ahead < 5:
        continue

    # Known track
    known_lats, known_lons = lats[:start], lons[:start]
    # Truth
    truth_lats, truth_lons = lats[start:], lons[start:]

    # Forecasts
    fc_lats_c, fc_lons_c = cliper_forecast(known_lats, known_lons, n_ahead)
    fc_lats_p, fc_lons_p = pure_persistence_forecast(known_lats, known_lons, n_ahead)

    # Compute errors (great circle approx: 1 degree ~ 111 km)
    for hr_key in all_errors_cliper:
        step = hr_key // 6
        if step < n_ahead:
            err_c = 111 * np.sqrt((fc_lats_c[step] - truth_lats[step])**2 +
                                  (fc_lons_c[step] - truth_lons[step])**2 *
                                  np.cos(np.radians(truth_lats[step]))**2)
            err_p = 111 * np.sqrt((fc_lats_p[step] - truth_lats[step])**2 +
                                  (fc_lons_p[step] - truth_lons[step])**2 *
                                  np.cos(np.radians(truth_lats[step]))**2)
            all_errors_cliper[hr_key].append(err_c)
            all_errors_persist[hr_key].append(err_p)

    # Plot first 5 cyclones
    if idx < 5:
        ax_row = idx // 3
        ax_col = idx % 3
        ax = axes[ax_row, ax_col]
        ax.set_facecolor('#0c1220')
        ax.plot(lons[:start], lats[:start], 'o-', color='#6b7280', markersize=2,
                linewidth=1, label='Known track')
        ax.plot(truth_lons, truth_lats, 'o-', color='#22c55e', markersize=2,
                linewidth=2, label='Actual')
        ax.plot(fc_lons_c[1:], fc_lats_c[1:], 's--', color='#3b82f6', markersize=3,
                linewidth=1.5, label='CLIPER')
        ax.plot(fc_lons_p[1:], fc_lats_p[1:], 'x--', color='#ef4444', markersize=3,
                linewidth=1, label='Persistence')
        ax.set_title(f'Test cyclone {idx + 1}', color='white', fontsize=10)
        ax.tick_params(colors='gray')
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
        ax.grid(True, alpha=0.1, color='gray')

# Error summary in last panel
ax = axes[1, 2]
ax.set_facecolor('#111827')
hours = sorted(all_errors_cliper.keys())
mean_c = [np.mean(all_errors_cliper[h]) if all_errors_cliper[h] else 0 for h in hours]
mean_p = [np.mean(all_errors_persist[h]) if all_errors_persist[h] else 0 for h in hours]
ax.plot(hours, mean_c, 'o-', color='#3b82f6', linewidth=2, markersize=6, label='CLIPER')
ax.plot(hours, mean_p, 's--', color='#ef4444', linewidth=2, markersize=6, label='Persistence')
ax.set_title('Forecast Error vs Lead Time', color='white', fontsize=10)
ax.set_xlabel('Forecast hour', color='white')
ax.set_ylabel('Track error (km)', color='white')
ax.tick_params(colors='gray')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.1, color='gray')

plt.tight_layout()
plt.show()

print("CLIPER Track Forecast Evaluation")
print("=" * 50)
print(f"Training cyclones: 20, Test cyclones: {len(test_cyclones)}")
print(f"\\nMean track error (km):")
print(f"{'Hour':<8} {'Persistence':>14} {'CLIPER':>10} {'Improvement':>14}")
print("-" * 48)
for h in hours:
    mc = np.mean(all_errors_cliper[h]) if all_errors_cliper[h] else 0
    mp = np.mean(all_errors_persist[h]) if all_errors_persist[h] else 0
    imp = (mp - mc) / max(mp, 1) * 100
    print(f"{h:>4}h    {mp:>10.1f} km  {mc:>8.1f} km  {imp:>10.1f}%")
print(f"\\nCLIPER consistently beats persistence at longer lead times.")
print(f"This is because climatology captures the average recurvature")
print(f"that pure persistence misses.")`,
      challenge: 'Implement an "analog" forecaster: find the 3 most similar historical tracks (based on recent motion and position), and average their future paths. Compare it to CLIPER. Does the analog method beat CLIPER?',
      successHint: 'CLIPER is elegant in its simplicity — two ingredients, one blending formula, and it provides a surprisingly good baseline. This is a recurring lesson in forecasting: simple models calibrated to good data often outperform complex models trained on poor data. Always benchmark against the simple baseline first.',
    },
    {
      title: 'Intensity Estimation — Simplified Dvorak Technique',
      concept: `Predicting where a cyclone goes (track) and how strong it is (intensity) are two different problems. Track forecasting has improved dramatically over the past 30 years, but intensity forecasting remains stubbornly difficult. The **Dvorak technique**, developed by Vernon Dvorak in the 1970s, is the foundation of operational intensity estimation from satellite imagery.

The original Dvorak technique is a pattern-matching method: trained analysts compare satellite cloud patterns to a set of templates and assign a "T-number" (intensity score from 1.0 to 8.0) based on the degree of organization. Key features include: the presence of an eye, the temperature difference between the warm eye and cold surrounding clouds, the symmetry of the cloud pattern, and the spiral banding structure. Higher T-numbers correspond to stronger winds: T1.0 = 25 knots, T8.0 = 170 knots.

For our simplified computational version, we estimate intensity from **environmental parameters** rather than cloud imagery. The key predictors are: (1) **Sea surface temperature** — warmer water provides more energy. (2) **Vertical wind shear** — the difference in wind speed/direction between the surface and upper atmosphere. High shear tears a cyclone apart; low shear allows it to intensify. (3) **Distance from land** — land interaction weakens storms. (4) **Upper ocean heat content** — deep warm water sustains intensity even after wind mixing. These four variables explain roughly 70% of intensity variance in statistical models, making them a reasonable proxy for the full Dvorak analysis.`,
      analogy: 'The Dvorak technique is like diagnosing a patient from an X-ray. A radiologist does not need to take the patient\'s temperature or blood pressure — they can estimate health from the image pattern alone. Similarly, a Dvorak analyst estimates cyclone intensity from cloud pattern shapes without needing direct wind measurements. Our simplified version is like a nurse using a checklist (SST, shear, distance) instead of the X-ray — less precise but faster and automated.',
      storyConnection: 'Before satellites, the fisherman\'s daughter\'s only intensity information came from the old men reading the sky: "The clouds are building tall and the wind is backing — this will be a strong one." The Dvorak technique formalized this visual pattern recognition. Today, India Meteorological Department analysts in Delhi estimate the intensity of Bay of Bengal cyclones that threaten Brahmaputra delta communities using the same core pattern-matching logic — augmented by algorithms that run in seconds instead of hours.',
      checkQuestion: 'Why is high vertical wind shear destructive to a developing cyclone? Think about the cyclone as a vertical stack of rotating air.',
      checkAnswer: 'A cyclone is a vertically coherent vortex — the rotation must be aligned from the ocean surface to the upper troposphere. High wind shear means the upper-level winds blow in a different direction or speed than the surface winds. This tilts the vortex, displacing the warm core aloft from the surface circulation. The feedback loop (warm core -> low pressure -> inflow -> evaporation -> more warming) breaks down because the energy release aloft is no longer positioned above the surface low. The cyclone becomes lopsided and weakens. Think of it as trying to spin a top while someone pushes the top sideways — the spin cannot maintain itself.',
      codeIntro: 'Build a statistical intensity model using environmental predictors (SST, shear, distance from land, ocean heat content). Evaluate it against a simple persistence baseline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# INTENSITY ESTIMATION MODEL
# ============================================================

# Generate synthetic environmental data for cyclone positions
n_samples = 500

# Environmental predictors
sst = np.random.uniform(25, 32, n_samples)           # SST (°C)
shear = np.random.uniform(2, 30, n_samples)           # wind shear (m/s)
dist_land = np.random.uniform(0, 800, n_samples)      # distance from land (km)
ohc = np.random.uniform(10, 120, n_samples)           # ocean heat content (kJ/cm²)

# True intensity model (simplified physics):
# V_max depends on SST (positive), shear (negative), dist_land (positive then plateau),
# and OHC (positive)
def true_intensity(sst, shear, dist_land, ohc, noise_std=5):
    """Simplified intensity model based on environmental parameters."""
    # SST contribution: ramps up above 26.5°C
    sst_term = np.maximum(0, (sst - 26.5)) * 12

    # Shear penalty: strong negative effect
    shear_term = -1.5 * shear

    # Distance from land: weakens near coast
    land_term = 10 * (1 - np.exp(-dist_land / 200))

    # OHC: additional energy reservoir
    ohc_term = 0.1 * ohc

    intensity = 20 + sst_term + shear_term + land_term + ohc_term
    intensity += np.random.normal(0, noise_std, len(sst))
    return np.clip(intensity, 10, 80)

wind_true = true_intensity(sst, shear, dist_land, ohc)

# Split into train/test
n_train = 400
X = np.column_stack([sst, shear, dist_land, ohc])
y = wind_true

X_train, X_test = X[:n_train], X[n_train:]
y_train, y_test = y[:n_train], y[n_train:]

# Multiple linear regression from scratch
def fit_linear_regression(X, y):
    """Ordinary least squares: beta = (X^T X)^{-1} X^T y."""
    X_bias = np.column_stack([np.ones(len(X)), X])
    beta = np.linalg.lstsq(X_bias, y, rcond=None)[0]
    return beta

def predict_linear(X, beta):
    X_bias = np.column_stack([np.ones(len(X)), X])
    return X_bias @ beta

beta = fit_linear_regression(X_train, y_train)
y_pred_train = predict_linear(X_train, beta)
y_pred_test = predict_linear(X_test, beta)

# Persistence baseline: predict current intensity = previous intensity
# Simulate as: y_persist = y_true + random walk noise
y_persist_test = y_test + np.random.normal(0, 8, len(y_test))

# Dvorak T-number mapping
def wind_to_dvorak(wind_ms):
    """Convert wind speed to approximate Dvorak T-number."""
    wind_kt = wind_ms * 1.944  # m/s to knots
    if wind_kt < 25: return 1.0
    if wind_kt < 35: return 1.5
    if wind_kt < 45: return 2.0
    if wind_kt < 55: return 2.5
    if wind_kt < 65: return 3.0
    if wind_kt < 77: return 3.5
    if wind_kt < 90: return 4.0
    if wind_kt < 102: return 4.5
    if wind_kt < 115: return 5.0
    if wind_kt < 127: return 5.5
    if wind_kt < 140: return 6.0
    if wind_kt < 155: return 6.5
    if wind_kt < 170: return 7.0
    return 8.0

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Feature importance (regression coefficients)
ax = axes[0, 0]
feature_names = ['SST (°C)', 'Wind Shear (m/s)', 'Dist from Land (km)', 'OHC (kJ/cm²)']
coefs = beta[1:]  # skip intercept
# Normalize by feature std for comparable importance
feature_stds = X_train.std(axis=0)
normalized_coefs = coefs * feature_stds
colors_feat = ['#ef4444' if c < 0 else '#22c55e' for c in normalized_coefs]
ax.barh(feature_names, normalized_coefs, color=colors_feat, height=0.5)
ax.axvline(0, color='white', linewidth=0.5)
ax.set_title('Feature Importance (normalized coefficients)', color='white', fontsize=10)
ax.set_xlabel('Relative contribution to intensity', color='white')

# 2. Predicted vs actual (test set)
ax = axes[0, 1]
ax.scatter(y_test, y_pred_test, alpha=0.6, s=20, color='#3b82f6', label='Model')
ax.scatter(y_test, y_persist_test, alpha=0.3, s=15, color='#ef4444', label='Persistence')
ax.plot([10, 80], [10, 80], '--', color='#22c55e', linewidth=2, label='Perfect')
ax.set_title('Predicted vs Actual Intensity (test)', color='white', fontsize=10)
ax.set_xlabel('Actual wind (m/s)', color='white')
ax.set_ylabel('Predicted wind (m/s)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Intensity vs SST with shear coloring
ax = axes[0, 2]
sc = ax.scatter(sst, wind_true, c=shear, cmap='RdYlGn_r', s=15, alpha=0.6)
cbar = plt.colorbar(sc, ax=ax)
cbar.set_label('Wind shear (m/s)', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_title('Intensity vs SST (colored by shear)', color='white', fontsize=10)
ax.set_xlabel('SST (°C)', color='white')
ax.set_ylabel('Wind speed (m/s)', color='white')

# 4. Shear vs intensity relationship
ax = axes[1, 0]
shear_bins = np.arange(0, 32, 4)
shear_centers = (shear_bins[:-1] + shear_bins[1:]) / 2
mean_winds = []
for i in range(len(shear_bins) - 1):
    mask = (shear >= shear_bins[i]) & (shear < shear_bins[i+1])
    mean_winds.append(wind_true[mask].mean() if mask.any() else 0)
ax.bar(shear_centers, mean_winds, width=3, color='#a855f7', alpha=0.7)
ax.set_title('Mean Intensity vs Wind Shear', color='white', fontsize=10)
ax.set_xlabel('Wind shear (m/s)', color='white')
ax.set_ylabel('Mean wind speed (m/s)', color='white')

# 5. Distance from land effect
ax = axes[1, 1]
dist_bins = np.arange(0, 850, 100)
dist_centers = (dist_bins[:-1] + dist_bins[1:]) / 2
mean_winds_d = []
for i in range(len(dist_bins) - 1):
    mask = (dist_land >= dist_bins[i]) & (dist_land < dist_bins[i+1])
    mean_winds_d.append(wind_true[mask].mean() if mask.any() else 0)
ax.bar(dist_centers, mean_winds_d, width=80, color='#f59e0b', alpha=0.7)
ax.set_title('Mean Intensity vs Distance from Land', color='white', fontsize=10)
ax.set_xlabel('Distance from land (km)', color='white')
ax.set_ylabel('Mean wind speed (m/s)', color='white')

# 6. Dvorak T-number distribution
ax = axes[1, 2]
t_numbers = [wind_to_dvorak(w) for w in wind_true]
t_unique, t_counts = np.unique(t_numbers, return_counts=True)
dvorak_colors = plt.cm.YlOrRd(np.linspace(0.2, 1.0, len(t_unique)))
ax.bar(t_unique, t_counts, width=0.4, color=dvorak_colors)
ax.set_title('Dvorak T-Number Distribution', color='white', fontsize=10)
ax.set_xlabel('Dvorak T-number', color='white')
ax.set_ylabel('Count', color='white')

plt.tight_layout()
plt.show()

# Error metrics
rmse_model = np.sqrt(np.mean((y_pred_test - y_test)**2))
rmse_persist = np.sqrt(np.mean((y_persist_test - y_test)**2))
mae_model = np.mean(np.abs(y_pred_test - y_test))
mae_persist = np.mean(np.abs(y_persist_test - y_test))

print("Intensity Estimation Model Evaluation")
print("=" * 50)
print(f"Regression coefficients:")
print(f"  Intercept: {beta[0]:.2f}")
for name, coef in zip(feature_names, beta[1:]):
    print(f"  {name}: {coef:+.4f}")
print(f"\\nTest set performance:")
print(f"  {'Metric':<12} {'Model':>10} {'Persistence':>14}")
print(f"  {'RMSE':<12} {rmse_model:>8.1f} m/s {rmse_persist:>10.1f} m/s")
print(f"  {'MAE':<12} {mae_model:>8.1f} m/s {mae_persist:>10.1f} m/s")
print(f"  Skill: {(1 - rmse_model/rmse_persist)*100:.1f}% improvement over persistence")
print(f"\\nKey finding: shear is the strongest negative predictor.")
print(f"SST provides the energy, but shear determines whether")
print(f"the cyclone can use it. This is why intensity forecasting")
print(f"requires both ocean AND atmospheric data.")`,
      challenge: 'Add a "rapid intensification" detector: flag samples where intensity increases by more than 15 m/s in 24 hours. What environmental conditions are associated with RI events? Build a logistic regression classifier to predict RI probability.',
      successHint: 'Intensity forecasting is the hardest problem in tropical meteorology. Even with satellites, AI, and supercomputers, 24-hour intensity forecasts still have average errors of 5-10 m/s. Understanding the key predictors — SST, shear, ocean heat content — is the first step toward reducing those errors.',
    },
    {
      title: 'Impact Assessment — Storm Surge from Pressure & Wind',
      concept: `The final step in our cyclone tracker converts meteorological data (wind speed, pressure deficit) into **human impact metrics** — specifically, storm surge height. This is where physics meets consequence. A cyclone with 60 m/s winds over the open ocean is a scientific phenomenon. The same cyclone pushing a 5-meter wall of water into a fishing village is a disaster.

The total water level at the coast during a cyclone is the sum of: (1) **Astronomical tide** — the normal tidal cycle. A cyclone arriving at high tide adds its surge on top of an already elevated ocean. (2) **Inverse barometer effect** — 1 cm rise per 1 hPa pressure deficit. (3) **Wind setup** — onshore wind stress pushing water against the coast. This is the dominant term and depends on wind speed squared, duration, fetch (distance over water), and shelf bathymetry. (4) **Wave setup** — breaking waves near shore push additional water up the beach.

A simplified but useful formula for total surge height is: **S = 0.01 * (1013 - P_center) + C * V_max^2 * L / (g * D)**, where P_center is central pressure, V_max is maximum wind, L is the fetch length over shallow shelf, D is the average shelf depth, g is gravity, and C is a drag coefficient. For the Bay of Bengal with its wide shallow shelf (D ~ 30m, L ~ 300km), this formula predicts catastrophic surges for any major cyclone. The 1970 Bhola cyclone (P_center ~ 966 hPa, V_max ~ 55 m/s) produced a 10-meter surge — the deadliest natural disaster of the 20th century.`,
      analogy: 'Computing storm surge from cyclone parameters is like computing flood damage from rainfall: you need to know the rain (wind/pressure), the terrain (bathymetry), and the drainage (how fast water can flow away). A heavy rainstorm on a mountain drains quickly. The same rain in a flat valley floods. Similarly, a strong cyclone on a steep coast produces modest surge, while the same cyclone on a shallow shelf creates a catastrophe.',
      storyConnection: 'For the fisherman\'s daughter, storm surge was not a number in a model — it was the water that took her uncle\'s boat, flooded the rice paddies with salt, and left her family sleeping on the school roof for a week. The surge calculator you build converts the same atmospheric variables that weather services track into the water levels that determine whether a village evacuates in time. Every meter of predicted surge corresponds to thousands of lives and livelihoods along the Brahmaputra delta.',
      checkQuestion: 'A cyclone has P_center = 960 hPa and V_max = 55 m/s. It approaches the coast at high tide (0.8m above mean sea level). The shelf is 300 km wide and 25m deep on average. Qualitatively, would you expect a larger surge component from the inverse barometer effect or from the wind setup? Why?',
      checkAnswer: 'The wind setup dominates. The inverse barometer effect gives 0.01 * (1013 - 960) = 0.53 meters — significant but not catastrophic. The wind setup over a 300 km, 25m-deep shelf with 55 m/s winds is much larger — typically 3-7 meters depending on exact geometry and friction. Wind stress scales with V_max squared and is amplified by the shallow depth and long fetch. The inverse barometer is a linear, modest effect. Wind setup is a quadratic, geometry-amplified monster. Total surge: 0.53 (IB) + ~5 (wind) + 0.8 (tide) = ~6.3 meters.',
      codeIntro: 'Build a surge calculator that takes cyclone parameters (pressure, wind, track) and coastal parameters (shelf profile, tide) to estimate total water level at the coast. Apply it to historical Bay of Bengal scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# STORM SURGE IMPACT CALCULATOR
# ============================================================

def compute_total_surge(p_center, v_max, shelf_depth, shelf_width,
                        tide_level=0.0, Cd=0.002, rho_air=1.2, rho_water=1025, g=9.81):
    """
    Compute total storm surge at the coast.

    Parameters:
    - p_center: central pressure (hPa)
    - v_max: maximum sustained wind (m/s)
    - shelf_depth: average shelf depth (m)
    - shelf_width: shelf width (m)
    - tide_level: astronomical tide (m above MSL)
    """
    # 1. Inverse barometer effect
    ib_surge = 0.01 * (1013 - p_center)

    # 2. Wind setup (simplified)
    wind_stress = Cd * rho_air * v_max**2
    wind_surge = wind_stress * shelf_width / (rho_water * g * shelf_depth)

    # 3. Wave setup (empirical: ~15% of wind surge for energetic seas)
    wave_surge = 0.15 * wind_surge

    total = ib_surge + wind_surge + wave_surge + tide_level
    return {
        'inverse_barometer': ib_surge,
        'wind_setup': wind_surge,
        'wave_setup': wave_surge,
        'tide': tide_level,
        'total': total
    }

# Historical Bay of Bengal cyclone scenarios
scenarios = {
    'Bhola 1970': {'p': 966, 'v': 55, 'depth': 25, 'width': 300e3, 'tide': 0.5,
                   'observed_surge': 10.0, 'deaths': 300000},
    'Sidr 2007':  {'p': 944, 'v': 70, 'depth': 30, 'width': 250e3, 'tide': 0.3,
                   'observed_surge': 5.0, 'deaths': 3400},
    'Nargis 2008': {'p': 962, 'v': 55, 'depth': 35, 'width': 200e3, 'tide': 0.4,
                    'observed_surge': 4.0, 'deaths': 138000},
    'Aila 2009':  {'p': 968, 'v': 40, 'depth': 20, 'width': 280e3, 'tide': 0.8,
                   'observed_surge': 3.0, 'deaths': 339},
    'Amphan 2020': {'p': 920, 'v': 85, 'depth': 25, 'width': 300e3, 'tide': 0.2,
                    'observed_surge': 5.0, 'deaths': 128},
    'Fani 2019':  {'p': 932, 'v': 75, 'depth': 40, 'width': 150e3, 'tide': 0.1,
                   'observed_surge': 1.5, 'deaths': 89},
}

# Compute surge for each scenario
results = {}
for name, params in scenarios.items():
    results[name] = compute_total_surge(
        params['p'], params['v'], params['depth'], params['width'], params['tide'])
    results[name]['observed'] = params['observed_surge']
    results[name]['deaths'] = params['deaths']

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Surge component breakdown for each scenario
ax = axes[0, 0]
storm_names = list(results.keys())
ib_vals = [results[n]['inverse_barometer'] for n in storm_names]
wind_vals = [results[n]['wind_setup'] for n in storm_names]
wave_vals = [results[n]['wave_setup'] for n in storm_names]
tide_vals = [results[n]['tide'] for n in storm_names]

x = np.arange(len(storm_names))
width = 0.6
ax.bar(x, ib_vals, width, color='#3b82f6', label='Inv. barometer')
ax.bar(x, wind_vals, width, bottom=ib_vals, color='#ef4444', label='Wind setup')
ax.bar(x, wave_vals, width, bottom=np.array(ib_vals)+np.array(wind_vals),
       color='#f59e0b', label='Wave setup')
ax.bar(x, tide_vals, width,
       bottom=np.array(ib_vals)+np.array(wind_vals)+np.array(wave_vals),
       color='#22c55e', label='Tide')
# Observed markers
obs_vals = [results[n]['observed'] for n in storm_names]
ax.scatter(x, obs_vals, color='white', marker='_', s=200, linewidths=3,
           label='Observed', zorder=5)
ax.set_xticks(x)
ax.set_xticklabels([n.split()[0] for n in storm_names], rotation=45, ha='right', color='white', fontsize=8)
ax.set_title('Surge Components by Storm', color='white', fontsize=10)
ax.set_ylabel('Surge height (m)', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2. Predicted vs observed surge
ax = axes[0, 1]
pred_totals = [results[n]['total'] for n in storm_names]
ax.scatter(obs_vals, pred_totals, s=80, color='#3b82f6', zorder=5)
for i, name in enumerate(storm_names):
    ax.annotate(name.split()[0], (obs_vals[i] + 0.15, pred_totals[i]),
                color='white', fontsize=7)
max_val = max(max(obs_vals), max(pred_totals)) + 1
ax.plot([0, max_val], [0, max_val], '--', color='#22c55e', linewidth=2, label='Perfect')
ax.set_title('Predicted vs Observed Surge', color='white', fontsize=10)
ax.set_xlabel('Observed surge (m)', color='white')
ax.set_ylabel('Predicted surge (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Surge vs wind speed (parametric)
ax = axes[0, 2]
v_range = np.linspace(20, 90, 70)
for depth, color, label in [(20, '#ef4444', '20m shelf'),
                             (40, '#f59e0b', '40m shelf'),
                             (80, '#22c55e', '80m shelf')]:
    surges = [compute_total_surge(1013 - 0.7*v, v, depth, 250e3)['total'] for v in v_range]
    ax.plot(v_range, surges, color=color, linewidth=2, label=label)
ax.set_title('Surge vs Wind Speed (different shelf depths)', color='white', fontsize=10)
ax.set_xlabel('Max wind speed (m/s)', color='white')
ax.set_ylabel('Total surge (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Surge timeline simulation (approaching cyclone)
ax = axes[1, 0]
hours = np.arange(-48, 7)
# Simulate cyclone approaching: wind increases, pressure drops
v_approach = np.clip(10 + 2 * (hours + 48), 10, 60)
v_approach[hours > 0] = np.clip(60 - 15 * hours[hours > 0], 15, 60)
p_approach = 1013 - 0.7 * v_approach
surge_timeline = [compute_total_surge(p, v, 25, 300e3, tide_level=0.5*np.sin(2*np.pi*h/12.42))['total']
                  for h, p, v in zip(hours, p_approach, v_approach)]
ax.fill_between(hours, 0, surge_timeline, alpha=0.3, color='#ef4444')
ax.plot(hours, surge_timeline, color='#ef4444', linewidth=2)
ax.axvline(0, color='white', linestyle='--', linewidth=1, label='Landfall')
ax.axhline(2, color='#f59e0b', linestyle=':', linewidth=1, label='Danger level (2m)')
ax.set_title('Surge Timeline (48h approach)', color='white', fontsize=10)
ax.set_xlabel('Hours relative to landfall', color='white')
ax.set_ylabel('Surge height (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Impact: deaths vs surge height
ax = axes[1, 1]
death_vals = [results[n]['deaths'] for n in storm_names]
ax.scatter(obs_vals, death_vals, s=100, color='#ef4444', zorder=5)
for i, name in enumerate(storm_names):
    ax.annotate(name.split()[0], (obs_vals[i] + 0.15, death_vals[i] * 1.1),
                color='white', fontsize=7)
ax.set_yscale('log')
ax.set_title('Deaths vs Storm Surge Height', color='white', fontsize=10)
ax.set_xlabel('Observed surge (m)', color='white')
ax.set_ylabel('Deaths (log scale)', color='white')
ax.annotate('Early warning saves lives:\\nAmphan 2020 was stronger\\nthan Bhola 1970 but killed\\n2000x fewer people.',
            (5, 200), color='#22c55e', fontsize=8,
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#22c55e'))

# 6. Risk zones along BoB coast
ax = axes[1, 2]
ax.set_facecolor('#0c1220')
coast_lat = np.array([10, 12, 14, 16, 18, 20, 22])
coast_names = ['Chennai', 'Machilipatnam', 'Visakhapatnam', 'Gopalpur',
               'Paradip', 'Kolkata', 'Chittagong']
shelf_depths = np.array([60, 45, 50, 35, 25, 20, 20])
shelf_widths = np.array([80, 120, 100, 150, 250, 300, 280]) * 1e3

# Cat 3 cyclone surge at each location
cat3_surges = [compute_total_surge(960, 50, d, w)['total']
               for d, w in zip(shelf_depths, shelf_widths)]

colors_risk = ['#22c55e' if s < 2 else '#f59e0b' if s < 4 else '#ef4444' for s in cat3_surges]
bars = ax.barh(coast_names, cat3_surges, color=colors_risk, height=0.5)
ax.axvline(2, color='#f59e0b', linestyle='--', linewidth=1, label='Moderate risk (2m)')
ax.axvline(5, color='#ef4444', linestyle='--', linewidth=1, label='Extreme risk (5m)')
ax.set_title('Cat 3 Surge Risk by Coastal City', color='white', fontsize=10)
ax.set_xlabel('Predicted surge (m)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Storm Surge Impact Assessment")
print("=" * 55)
print(f"{'Storm':<16} {'Observed':>10} {'Predicted':>10} {'Deaths':>10}")
print("-" * 48)
for name in storm_names:
    r = results[name]
    print(f"{name:<16} {r['observed']:>8.1f}m  {r['total']:>8.1f}m  {r['deaths']:>8,}")
print(f"\\nSurge components for Amphan 2020 (strongest recent BoB cyclone):")
a = results['Amphan 2020']
print(f"  Inverse barometer: {a['inverse_barometer']:.2f}m")
print(f"  Wind setup:        {a['wind_setup']:.2f}m")
print(f"  Wave setup:        {a['wave_setup']:.2f}m")
print(f"  Tide:              {a['tide']:.2f}m")
print(f"  TOTAL:             {a['total']:.2f}m")
print(f"\\nCritical insight: Bhola 1970 killed 300,000. Amphan 2020")
print(f"was stronger but killed 128. The difference: early warning")
print(f"systems and evacuation. Accurate surge prediction saves lives.")`,
      challenge: 'Add sea level rise to the analysis: for each historical cyclone, compute how much higher the surge would be with +0.5m SLR (projected for 2070). Which cities face the largest increase in risk? Express the risk change as a percentage of current surge.',
      successHint: 'Storm surge estimation closes the loop between atmospheric science and human safety. The same physics that governs pressure gradients and wind stress determines whether a fishing village floods or stays dry. Accurate surge models, combined with early warning, have already saved hundreds of thousands of lives in the Bay of Bengal.',
    },
    {
      title: 'Portfolio — Complete Cyclone Tracker Dashboard',
      concept: `Your cyclone tracker is now complete. Over the past five mini-lessons, you have built: (1) a synthetic data generator calibrated to Bay of Bengal cyclone statistics, (2) a climatological analysis module that maps track density, motion vectors, and intensity distributions, (3) a CLIPER track prediction model that blends persistence with climatology, (4) a statistical intensity estimator based on environmental predictors, and (5) a storm surge impact calculator that converts meteorological data into coastal water levels.

This final lesson integrates all five components into a single dashboard that demonstrates the full analysis pipeline. Given a "current" cyclone position, the dashboard will: visualize the historical context, run the CLIPER track forecast, estimate intensity along the forecast track, compute storm surge at potential landfall points, and produce a summary risk assessment.

This is the workflow that operational meteorologists follow — from data ingestion through analysis to risk communication. The tools are more sophisticated at agencies like IMD or JTWC (ensemble NWP models, Dvorak satellite analysis, coupled ocean-atmosphere models), but the logical flow is identical. You have built, from first principles, a miniature version of the system that protects millions of lives along the Bay of Bengal coast.

The key lesson is integration. Each component alone is incomplete. A track forecast without intensity estimation does not tell you how dangerous the storm is. Intensity without surge estimation does not tell you how high the water will rise. Surge without risk context does not tell you who needs to evacuate. Only the complete pipeline — track + intensity + surge + risk — provides actionable information.`,
      analogy: 'A cyclone tracker dashboard is like a pilot\'s instrument panel. The altimeter, airspeed indicator, compass, and fuel gauge each tell you one thing. But flight safety requires reading them together — altitude is meaningless without airspeed, heading is meaningless without fuel. Your dashboard reads pressure, track, intensity, and surge together to paint a complete picture of the threat.',
      storyConnection: 'If the fisherman\'s daughter had access to this dashboard, she could have seen the storm forming in the central Bay, watched its predicted track curve toward the Brahmaputra delta, read its intensifying winds, and computed the surge height at her village — all 48 hours before landfall. That information, communicated clearly, is the difference between evacuation and tragedy. Every component you built translates atmospheric physics into the single question that matters: "Is my village safe?"',
      checkQuestion: 'Your dashboard shows a cyclone 500 km south of the Brahmaputra delta, moving NW at 20 km/h, with winds of 50 m/s over 29°C water with low shear. The CLIPER model predicts landfall in 25 hours. What is your risk assessment — and what information is still missing that would change your confidence?',
      checkAnswer: 'Risk is very high. The cyclone is already Cat 3 (50 m/s), the environment favors further intensification (warm SST, low shear), and the CLIPER track points at the most surge-vulnerable coast on Earth. Expected surge: 4-7 meters on the shallow northern Bay shelf, arriving in ~25 hours. Missing information: (1) the current tide state — high tide at landfall would add 0.5-1m; (2) current river levels — monsoon-swollen Brahmaputra would compound the surge; (3) ensemble forecast spread — how confident is the CLIPER track? (4) local bathymetry at the exact landfall point; (5) whether evacuation has begun. The physical forecast is only useful if it reaches the people who need to act on it.',
      codeIntro: 'Build the integrated cyclone tracker dashboard: a single visualization that shows the full analysis pipeline from track to impact for a simulated Bay of Bengal cyclone.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from matplotlib.collections import LineCollection

np.random.seed(42)

# ============================================================
# INTEGRATED CYCLONE TRACKER DASHBOARD
# ============================================================

# --- Simulate a "live" cyclone approaching the BoB coast ---
# Current position: central Bay of Bengal, moving NW
known_lats = np.array([10.0, 10.8, 11.5, 12.3, 13.0, 13.8, 14.5, 15.2])
known_lons = np.array([89.0, 88.5, 88.1, 87.6, 87.2, 86.7, 86.3, 85.8])
known_winds = np.array([25, 30, 35, 42, 48, 55, 58, 62])
known_pressures = 1013 - 0.7 * known_winds

# --- CLIPER Track Forecast ---
def cliper_forecast(lats, lons, n_ahead=16):
    # Persistence from last 3 points
    p_dlat = (lats[-1] - lats[-3]) / 2
    p_dlon = (lons[-1] - lons[-3]) / 2
    # BoB climatology: NW motion with recurvature
    c_dlat, c_dlon = 0.22, -0.12

    fc_lats, fc_lons = [lats[-1]], [lons[-1]]
    for t in range(1, n_ahead + 1):
        alpha = 0.8 * np.exp(-t / 8.0)
        dlat = alpha * p_dlat + (1 - alpha) * c_dlat
        dlon = alpha * p_dlon + (1 - alpha) * c_dlon
        fc_lats.append(fc_lats[-1] + dlat)
        fc_lons.append(fc_lons[-1] + dlon)
    return np.array(fc_lats), np.array(fc_lons)

fc_lats, fc_lons = cliper_forecast(known_lats, known_lons, n_ahead=16)

# --- Intensity forecast along track ---
def forecast_intensity(fc_lats, fc_lons, current_wind=62):
    """Simplified intensity forecast based on SST and distance from land."""
    winds = [current_wind]
    for i in range(1, len(fc_lats)):
        lat, lon = fc_lats[i], fc_lons[i]
        # SST decreases with latitude (simplified)
        sst = 30.0 - 0.3 * (lat - 10)
        # Shear increases with latitude
        shear = 5 + 1.5 * (lat - 10)
        # Distance from land (rough: lon < 84 or lat > 21 is near land)
        dist_land = min(abs(lon - 82) * 111, abs(21 - lat) * 111, 500)

        # Intensity tendency
        sst_factor = max(0, (sst - 26.5)) * 0.5
        shear_factor = -0.3 * shear
        land_factor = -max(0, (200 - dist_land)) * 0.02

        d_wind = sst_factor + shear_factor + land_factor + np.random.normal(0, 1)
        new_wind = np.clip(winds[-1] + d_wind, 15, 80)
        winds.append(new_wind)
    return np.array(winds)

fc_winds = forecast_intensity(fc_lats, fc_lons)
fc_pressures = 1013 - 0.7 * fc_winds

# --- Ensemble spread (simulate uncertainty cone) ---
n_ensemble = 20
ensemble_lats = np.zeros((n_ensemble, len(fc_lats)))
ensemble_lons = np.zeros((n_ensemble, len(fc_lats)))
for e in range(n_ensemble):
    noise_lat = np.cumsum(np.random.normal(0, 0.05, len(fc_lats)))
    noise_lon = np.cumsum(np.random.normal(0, 0.05, len(fc_lats)))
    ensemble_lats[e] = fc_lats + noise_lat
    ensemble_lons[e] = fc_lons + noise_lon

# --- Surge calculation at potential landfall ---
def compute_surge(p_center, v_max, shelf_depth=25, shelf_width=300e3, tide=0.4):
    ib = 0.01 * (1013 - p_center)
    tau = 0.002 * 1.2 * v_max**2
    wind_s = tau * shelf_width / (1025 * 9.81 * shelf_depth)
    wave_s = 0.15 * wind_s
    return ib + wind_s + wave_s + tide

# Find predicted landfall (first point where lat > 20)
landfall_idx = None
for i in range(len(fc_lats)):
    if fc_lats[i] > 20:
        landfall_idx = i
        break

# ============================================================
# DASHBOARD VISUALIZATION
# ============================================================
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')

# Layout: main map (left), 4 small panels (right)
ax_map = fig.add_axes([0.03, 0.08, 0.55, 0.85])
ax_int = fig.add_axes([0.62, 0.56, 0.35, 0.36])
ax_surge = fig.add_axes([0.62, 0.08, 0.35, 0.36])

for ax in [ax_map, ax_int, ax_surge]:
    ax.set_facecolor('#0c1220')
    ax.tick_params(colors='gray')

# === MAIN MAP ===
# Coastline
coast_lats = [5,8,10,13,15,16,18,20,21,22,23,22,21,20,18,15,12,8,5]
coast_lons = [80,77,76,75,78,80,82,85,87,89,90,92,93,94,95,96,97,98,100]
ax_map.fill(coast_lons, coast_lats, color='#2d3a2d', alpha=0.4)
ax_map.plot(coast_lons, coast_lats, color='#4a5a4a', linewidth=2)

# Ensemble cone (uncertainty)
for e in range(n_ensemble):
    ax_map.plot(ensemble_lons[e], ensemble_lats[e],
                color='#3b82f6', alpha=0.08, linewidth=1)

# Uncertainty cone (2-sigma envelope)
lat_mean = ensemble_lats.mean(axis=0)
lon_mean = ensemble_lons.mean(axis=0)
lat_std = ensemble_lats.std(axis=0)
lon_std = ensemble_lons.std(axis=0)

for i in range(1, len(fc_lats)):
    radius = 2 * np.sqrt(lat_std[i]**2 + lon_std[i]**2)
    circle = Circle((lon_mean[i], lat_mean[i]), radius,
                     fill=True, facecolor='#3b82f6', alpha=0.05,
                     edgecolor='#3b82f6', linewidth=0.5)
    ax_map.add_patch(circle)

# Known track (color by intensity)
cat_colors_map = {0: '#6b7280', 1: '#22c55e', 2: '#3b82f6', 3: '#f59e0b', 4: '#f97316', 5: '#ef4444'}
for i in range(len(known_lats)):
    v = known_winds[i]
    cat = 5 if v>=70 else 4 if v>=58 else 3 if v>=50 else 2 if v>=43 else 1 if v>=33 else 0
    ax_map.plot(known_lons[i], known_lats[i], 'o', color=cat_colors_map[cat],
                markersize=6, zorder=5)
ax_map.plot(known_lons, known_lats, '-', color='white', linewidth=1.5, alpha=0.8, zorder=4)

# Forecast track (color by forecast intensity)
for i in range(1, len(fc_lats)):
    v = fc_winds[i]
    cat = 5 if v>=70 else 4 if v>=58 else 3 if v>=50 else 2 if v>=43 else 1 if v>=33 else 0
    ax_map.plot(fc_lons[i], fc_lats[i], 's', color=cat_colors_map[cat],
                markersize=5, zorder=5)
ax_map.plot(fc_lons, fc_lats, '--', color='white', linewidth=1, alpha=0.6, zorder=4)

# Current position (big marker)
ax_map.plot(known_lons[-1], known_lats[-1], '*', color='#ef4444',
            markersize=20, zorder=10, markeredgecolor='white', markeredgewidth=1)

# Time labels on forecast track
for i in [4, 8, 12, 16]:
    if i < len(fc_lats):
        ax_map.annotate(f'+{i*6}h', (fc_lons[i]+0.3, fc_lats[i]+0.2),
                        color='white', fontsize=8, fontweight='bold',
                        bbox=dict(boxstyle='round,pad=0.2', facecolor='#1f2937', edgecolor='gray'))

# Landfall marker
if landfall_idx and landfall_idx < len(fc_lats):
    ax_map.plot(fc_lons[landfall_idx], fc_lats[landfall_idx], 'X',
                color='#ef4444', markersize=15, zorder=10, markeredgecolor='white')
    ax_map.annotate(f'Landfall ~+{landfall_idx*6}h',
                    (fc_lons[landfall_idx]+0.3, fc_lats[landfall_idx]),
                    color='#ef4444', fontsize=10, fontweight='bold')

# Cities
cities = {'Kolkata': (88.4, 22.6), 'Chittagong': (91.8, 22.3),
          'Visakhapatnam': (83.3, 17.7), 'Paradip': (86.7, 20.3),
          'Bhubaneswar': (85.8, 20.3)}
for city, (lon, lat) in cities.items():
    ax_map.plot(lon, lat, 's', color='white', markersize=4, zorder=5)
    ax_map.annotate(city, (lon + 0.3, lat + 0.15), color='white', fontsize=7)

ax_map.set_xlim(75, 98)
ax_map.set_ylim(5, 25)
ax_map.set_title('BAY OF BENGAL CYCLONE TRACKER — Live Dashboard',
                 color='white', fontsize=14, fontweight='bold')
ax_map.set_xlabel('Longitude (°E)', color='white')
ax_map.set_ylabel('Latitude (°N)', color='white')
ax_map.grid(True, alpha=0.1, color='gray')

# Legend
from matplotlib.lines import Line2D
legend_elements = [
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#6b7280', markersize=8, label='TD/TS', linestyle=''),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#22c55e', markersize=8, label='Cat 1', linestyle=''),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#3b82f6', markersize=8, label='Cat 2', linestyle=''),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#f59e0b', markersize=8, label='Cat 3', linestyle=''),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#f97316', markersize=8, label='Cat 4', linestyle=''),
    Line2D([0], [0], marker='o', color='w', markerfacecolor='#ef4444', markersize=8, label='Cat 5', linestyle=''),
    Line2D([0], [0], marker='*', color='w', markerfacecolor='#ef4444', markersize=12, label='Current', linestyle=''),
]
ax_map.legend(handles=legend_elements, loc='lower left', fontsize=7,
              facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=4)

# === INTENSITY FORECAST PANEL ===
hours_known = np.arange(len(known_winds)) * 6
hours_fc = np.arange(len(fc_winds)) * 6 + hours_known[-1]

ax_int.plot(hours_known, known_winds, 'o-', color='white', linewidth=2,
            markersize=4, label='Observed')
ax_int.plot(hours_fc, fc_winds, 's--', color='#3b82f6', linewidth=2,
            markersize=3, label='CLIPER forecast')

# Category thresholds
for thresh, cat_label, color in [(33, 'Cat 1', '#22c55e'), (43, 'Cat 2', '#3b82f6'),
                                  (50, 'Cat 3', '#f59e0b'), (58, 'Cat 4', '#f97316'),
                                  (70, 'Cat 5', '#ef4444')]:
    ax_int.axhline(thresh, color=color, linestyle=':', linewidth=0.8, alpha=0.5)
    ax_int.text(hours_fc[-1] + 2, thresh, cat_label, color=color, fontsize=7, va='center')

ax_int.axvline(hours_known[-1], color='gray', linestyle='--', linewidth=1)
ax_int.annotate('NOW', (hours_known[-1], fc_winds.max() + 3), color='gray',
                fontsize=9, ha='center')
ax_int.set_title('Intensity Forecast', color='white', fontsize=12)
ax_int.set_xlabel('Hours since genesis', color='white')
ax_int.set_ylabel('Max wind (m/s)', color='white')
ax_int.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax_int.grid(True, alpha=0.1, color='gray')

# === SURGE RISK PANEL ===
if landfall_idx and landfall_idx < len(fc_winds):
    lf_wind = fc_winds[landfall_idx]
    lf_pressure = fc_pressures[landfall_idx]

    # Surge for different tide scenarios
    tide_range = np.linspace(-0.5, 1.0, 50)
    surge_range = [compute_surge(lf_pressure, lf_wind, tide=t) for t in tide_range]

    ax_surge.fill_between(tide_range, 0, surge_range, alpha=0.3, color='#ef4444')
    ax_surge.plot(tide_range, surge_range, color='#ef4444', linewidth=2)
    ax_surge.axhline(3, color='#f59e0b', linestyle='--', linewidth=1, label='Moderate risk (3m)')
    ax_surge.axhline(5, color='#ef4444', linestyle='--', linewidth=1, label='Extreme risk (5m)')

    # Current tide estimate
    current_tide = 0.4
    current_surge = compute_surge(lf_pressure, lf_wind, tide=current_tide)
    ax_surge.plot(current_tide, current_surge, '*', color='white', markersize=15, zorder=5)
    ax_surge.annotate(f'{current_surge:.1f}m', (current_tide + 0.05, current_surge + 0.3),
                      color='white', fontsize=12, fontweight='bold')

    ax_surge.set_title(f'Storm Surge at Landfall (V={lf_wind:.0f} m/s, P={lf_pressure:.0f} hPa)',
                       color='white', fontsize=11)
    ax_surge.set_xlabel('Tide level (m above MSL)', color='white')
    ax_surge.set_ylabel('Total surge (m)', color='white')
    ax_surge.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax_surge.grid(True, alpha=0.1, color='gray')

plt.tight_layout(pad=1.5)
plt.show()

# === TEXT SUMMARY ===
print("=" * 60)
print("  CYCLONE TRACKER — RISK ASSESSMENT BULLETIN")
print("=" * 60)
print(f"\\n  CURRENT STATUS:")
print(f"    Position:    {known_lats[-1]:.1f}°N, {known_lons[-1]:.1f}°E")
print(f"    Max wind:    {known_winds[-1]} m/s (Category {'5' if known_winds[-1]>=70 else '4' if known_winds[-1]>=58 else '3' if known_winds[-1]>=50 else '2' if known_winds[-1]>=43 else '1' if known_winds[-1]>=33 else 'TS'})")
print(f"    Pressure:    {known_pressures[-1]:.0f} hPa")
print(f"    Motion:      NW at ~{111*np.sqrt((known_lats[-1]-known_lats[-2])**2 + (known_lons[-1]-known_lons[-2])**2)/6:.0f} km/h")

if landfall_idx and landfall_idx < len(fc_winds):
    lf_hours = landfall_idx * 6
    lf_surge = compute_surge(fc_pressures[landfall_idx], fc_winds[landfall_idx])
    print(f"\\n  FORECAST:")
    print(f"    Predicted landfall: ~{lf_hours} hours ({lf_hours//24}d {lf_hours%24}h)")
    print(f"    Landfall location:  {fc_lats[landfall_idx]:.1f}°N, {fc_lons[landfall_idx]:.1f}°E")
    print(f"    Landfall intensity: {fc_winds[landfall_idx]:.0f} m/s")
    print(f"    Expected surge:     {lf_surge:.1f} m")
    print(f"    Uncertainty cone:   ±{2*lat_std[landfall_idx]*111:.0f} km at landfall")

    print(f"\\n  RISK LEVEL: {'EXTREME' if lf_surge > 5 else 'HIGH' if lf_surge > 3 else 'MODERATE'}")
    print(f"    Brahmaputra delta communities: IMMEDIATE EVACUATION ADVISED")
    print(f"    Fishing boats: RETURN TO PORT IMMEDIATELY")
    print(f"    Surge will penetrate {lf_surge * 2:.0f}+ km inland on flat terrain")

print(f"\\n  COMPONENTS USED:")
print(f"    [1] Track forecast:     CLIPER (persistence + climatology)")
print(f"    [2] Intensity forecast: Statistical (SST + shear + land)")
print(f"    [3] Surge estimate:     Wind setup + IB + wave + tide")
print(f"    [4] Uncertainty:        {n_ensemble}-member ensemble cone")
print(f"\\n{'=' * 60}")
print(f"  Cyclone Tracker v1.0 — Built from first principles")
print(f"  TigmaMinds Academy: The Fisherman's Daughter & the Storm")
print(f"{'=' * 60}")`,
      challenge: 'Add a "what-if" module: allow the user to change the cyclone\'s current intensity and direction, and show how the risk assessment changes in real time. This is how emergency managers use operational tools — exploring scenarios to make evacuation decisions.',
      successHint: 'You have built a cyclone tracker from scratch — data generation, climatological analysis, track prediction, intensity estimation, surge calculation, and integrated visualization. Every component connects atmospheric physics to human safety. The fisherman\'s daughter\'s village deserves this tool. Across the Bay of Bengal, systems built on these same principles save thousands of lives every cyclone season.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Build a Cyclone Tracker
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (ocean science & storm physics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete cyclone tracker. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[CycloneCrossSectionDiagram, CorrelationDiagram, LinearGraphDiagram, MonsoonDiagram, BuoyancyDiagram, ClimateZonesDiagram][i] ? createElement([CycloneCrossSectionDiagram, CorrelationDiagram, LinearGraphDiagram, MonsoonDiagram, BuoyancyDiagram, ClimateZonesDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
