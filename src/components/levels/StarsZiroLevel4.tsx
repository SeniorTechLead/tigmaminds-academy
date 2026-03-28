import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarsZiroLevel4() {
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
      title: 'Capstone project design — building a light pollution mapper',
      concept: `In Levels 1-3 you learned the physics of starlight, atmospheric scattering, photometry, and sky quality measurement. Now you will combine everything into a single capstone project: a **Light Pollution Mapper** that processes satellite data to create maps of sky brightness across northeastern India, with a focus on identifying and protecting dark sky sites like Ziro Valley.

The project architecture has four stages. First, you will work with **VIIRS-DNB** (Visible Infrared Imaging Radiometer Suite - Day/Night Band) satellite data, which measures nighttime radiance from space. VIIRS flies on the Suomi NPP and NOAA-20 satellites, capturing the entire Earth\'s nighttime light emissions at ~750m resolution. Second, you will convert raw radiance measurements into astronomically meaningful units — magnitudes per square arcsecond. Third, you will create spatial visualizations: contour maps, heat maps, and Bortle class overlays. Fourth, you will analyze trends over multiple years to quantify how light pollution is changing in the region.

This is not a toy project. The same pipeline is used by researchers at the New World Atlas of Artificial Night Sky Brightness (Falchi et al. 2016) and by the International Dark-Sky Association to certify dark sky parks. By building it from scratch, you will understand every step of the data processing chain. The output will be a tool that could genuinely support a proposal to designate Ziro Valley as India's first Dark Sky Reserve — following models like Cherry Springs State Park (USA), NamibRand (Namibia), and the Aoraki Mackenzie reserve in New Zealand.`,
      analogy: 'Building the light pollution mapper is like building a weather station from scratch. You could buy a commercial one, but by constructing your own — choosing sensors, writing firmware, calibrating against known standards — you understand exactly what every number means. When your mapper says "Ziro Valley is Bortle 2," you know precisely what measurements, conversions, and error bars produced that classification.',
      storyConnection: 'The Apatani people of Ziro Valley have an intimate connection with their land and sky that has persisted for centuries. But traditional knowledge alone cannot protect what it cannot quantify in terms that policymakers understand. A light pollution map with satellite-derived data, Bortle classifications, and trend analysis provides the scientific evidence needed to argue for dark sky protection. This capstone turns the story of Ziro\'s bright stars into actionable conservation science.',
      checkQuestion: 'Why is satellite-based measurement (top-down, measuring light going up) complementary to ground-based SQM measurement (bottom-up, measuring sky glow coming down)? What does each capture that the other misses?',
      checkAnswer: 'Satellites measure upward-emitted radiance — how much light a location sends into space. This captures the source of pollution but misses how that light scatters in the atmosphere to affect distant sites. Ground-based SQMs measure the cumulative sky glow from all sources, including distant cities, but cannot pinpoint which source is responsible. Combining both gives the complete picture: satellites identify the polluters, SQMs measure the impact.',
      codeIntro: 'Set up the project framework: define the data pipeline, coordinate system, and mapping infrastructure for northeastern India.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Project Framework: Light Pollution Mapper for NE India ---

# Define the study region: northeastern India
# Approximate bounding box
REGION = {
    'name': 'Northeastern India',
    'lat_min': 24.0,  # southern boundary (Tripura)
    'lat_max': 29.5,  # northern boundary (Arunachal Pradesh)
    'lon_min': 89.5,  # western boundary (West Bengal border)
    'lon_max': 97.5,  # eastern boundary (Myanmar border)
    'resolution_km': 0.75,  # ~750m (VIIRS-DNB native resolution)
}

# Key locations
locations = {
    'Ziro Valley':    {'lat': 27.59, 'lon': 93.83, 'type': 'dark_site'},
    'Tawang':         {'lat': 27.59, 'lon': 91.86, 'type': 'dark_site'},
    'Mechuka':        {'lat': 28.60, 'lon': 94.09, 'type': 'dark_site'},
    'Mawsynram':      {'lat': 25.30, 'lon': 91.58, 'type': 'dark_site'},
    'Guwahati':       {'lat': 26.14, 'lon': 91.74, 'type': 'city'},
    'Shillong':       {'lat': 25.57, 'lon': 91.88, 'type': 'city'},
    'Itanagar':       {'lat': 27.08, 'lon': 93.62, 'type': 'city'},
    'Dibrugarh':      {'lat': 27.47, 'lon': 94.91, 'type': 'city'},
    'Imphal':         {'lat': 24.82, 'lon': 93.95, 'type': 'city'},
    'Agartala':       {'lat': 23.83, 'lon': 91.28, 'type': 'city'},
    'Kohima':         {'lat': 25.67, 'lon': 94.12, 'type': 'city'},
    'Aizawl':         {'lat': 23.73, 'lon': 92.72, 'type': 'city'},
    'Dimapur':        {'lat': 25.91, 'lon': 93.73, 'type': 'city'},
    'Silchar':        {'lat': 24.83, 'lon': 92.78, 'type': 'city'},
    'Jorhat':         {'lat': 26.76, 'lon': 94.22, 'type': 'city'},
    'Tezpur':         {'lat': 26.63, 'lon': 92.80, 'type': 'city'},
}

# City populations (approximate, for light pollution modeling)
populations = {
    'Guwahati': 1120000, 'Shillong': 170000, 'Itanagar': 60000,
    'Dibrugarh': 155000, 'Imphal': 268000, 'Agartala': 400000,
    'Kohima': 115000, 'Aizawl': 293000, 'Dimapur': 122000,
    'Silchar': 172000, 'Jorhat': 153000, 'Tezpur': 102000,
}

# --- Pipeline architecture ---
class LightPollutionMapper:
    """Core mapper class: defines the processing pipeline."""

    def __init__(self, region, resolution_deg=0.01):
        self.region = region
        self.resolution = resolution_deg  # degrees per pixel

        # Create coordinate grid
        self.lats = np.arange(region['lat_min'], region['lat_max'], resolution_deg)
        self.lons = np.arange(region['lon_min'], region['lon_max'], resolution_deg)
        self.lon_grid, self.lat_grid = np.meshgrid(self.lons, self.lats)

        # Initialize radiance map (will be populated with data)
        self.radiance = np.zeros_like(self.lat_grid)

        print(f"Mapper initialized:")
        print(f"  Region: {region['name']}")
        print(f"  Grid: {len(self.lats)} x {len(self.lons)} = {len(self.lats)*len(self.lons):,} pixels")
        print(f"  Resolution: {resolution_deg} deg (~{resolution_deg * 111:.1f} km)")
        print(f"  Coverage: {region['lat_min']}-{region['lat_max']}N, {region['lon_min']}-{region['lon_max']}E")

    def get_pipeline_stages(self):
        return [
            "1. Ingest VIIRS-DNB satellite radiance data",
            "2. Quality filter (clouds, moonlight, fires)",
            "3. Convert radiance to sky brightness (mag/arcsec²)",
            "4. Generate spatial contour maps",
            "5. Classify Bortle zones",
            "6. Analyze multi-year trends",
            "7. Identify & rank dark sky candidate sites",
        ]

mapper = LightPollutionMapper(REGION, resolution_deg=0.02)

print()
print("Processing pipeline:")
for stage in mapper.get_pipeline_stages():
    print(f"  {stage}")

# --- Visualize the study region ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Map 1: Location overview
ax = axes[0]
ax.set_facecolor('#0a1628')

# Plot cities and dark sites
for name, info in locations.items():
    if info['type'] == 'city':
        pop = populations.get(name, 50000)
        size = np.sqrt(pop / 10000) * 10
        ax.scatter(info['lon'], info['lat'], s=size, c='#fbbf24', alpha=0.8,
                   edgecolors='#f59e0b', linewidth=0.5, zorder=3)
        ax.annotate(name, (info['lon'], info['lat']), textcoords='offset points',
                    xytext=(5, 5), color='#fbbf24', fontsize=6)
    else:
        ax.scatter(info['lon'], info['lat'], s=60, c='#22c55e', marker='*',
                   edgecolors='white', linewidth=0.5, zorder=4)
        ax.annotate(name, (info['lon'], info['lat']), textcoords='offset points',
                    xytext=(5, 5), color='#22c55e', fontsize=7, fontweight='bold')

# Highlight Ziro Valley
ziro = locations['Ziro Valley']
circle = plt.Circle((ziro['lon'], ziro['lat']), 0.5, fill=False,
                     color='#22c55e', linewidth=2, linestyle='--')
ax.add_patch(circle)

ax.set_xlim(REGION['lon_min'], REGION['lon_max'])
ax.set_ylim(REGION['lat_min'], REGION['lat_max'])
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Study region: NE India', color='white', fontsize=12)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

# Map 2: Pipeline diagram
ax = axes[1]
ax.set_facecolor('#111827')
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)

stages = mapper.get_pipeline_stages()
box_colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#22c55e']
for i, (stage, color) in enumerate(zip(stages, box_colors)):
    y = 9 - i * 1.2
    ax.add_patch(plt.Rectangle((0.5, y - 0.4), 9, 0.8, facecolor=color,
                                alpha=0.3, edgecolor=color, linewidth=1.5, zorder=2))
    ax.text(5, y, stage, color='white', fontsize=8, ha='center', va='center', zorder=3)
    if i < len(stages) - 1:
        ax.annotate('', xy=(5, y - 0.5), xytext=(5, y - 0.9),
                    arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

ax.set_title('Processing Pipeline', color='white', fontsize=12)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print()
print(f"Key dark sky candidates: {', '.join(n for n, i in locations.items() if i['type'] == 'dark_site')}")
print(f"Major light sources: {', '.join(n for n, i in locations.items() if i['type'] == 'city')}")`,
      challenge: 'Add terrain data to the mapper: approximate elevation for each grid cell (Ziro at ~1500m, Brahmaputra valley at ~50m, Tawang at ~3048m). Higher elevation means less atmosphere above, which affects both natural sky brightness and light pollution propagation.',
      successHint: 'Good project design means thinking through the entire pipeline before writing a single line of processing code. The architecture you defined here will guide the next five mini-lessons.',
    },
    {
      title: 'Satellite image processing — working with VIIRS-DNB nighttime data',
      concept: `The **VIIRS Day/Night Band (DNB)** is a panchromatic sensor on the Suomi NPP satellite that detects visible and near-infrared light (500-900 nm) at night. It has a remarkable dynamic range — from the faintest starlight to bright city centers — thanks to three gain stages that switch automatically based on scene brightness. The native resolution is approximately 750 meters, and the satellite orbits at ~830 km altitude, crossing the equator at about 1:30 AM local time (minimizing reflected sunlight effects).

Raw VIIRS-DNB data comes in **radiance units**: nanowatts per square centimeter per steradian (nW/cm^2/sr). Typical values range from 0.1-0.5 nW/cm^2/sr for pristine dark sites to 100+ nW/cm^2/sr for city centers. But raw data requires significant cleaning. **Cloud contamination** must be removed (clouds reflect city light and create false readings). **Moonlight** adds background signal that varies with lunar phase — data collected during new moon is preferred. **Ephemeral lights** from fires, fishing boats, and gas flares must be filtered. The standard approach is to compute **monthly composites**: take multiple overpasses of the same area, reject outliers (clouds, fires), and average the remaining clean observations.

The VIIRS Black Marble product (VNP46A4) provides cloud-free, atmospherically corrected annual composites ready for analysis. For our mapper, we will simulate realistic VIIRS-like data based on population distribution, terrain, and known light sources — the same spatial patterns that appear in real satellite imagery, but computed from first principles so you understand what drives every pixel value.`,
      analogy: 'Processing satellite nighttime imagery is like developing a photograph in a darkroom. The raw negative (VIIRS swath data) has noise, scratches (cloud contamination), double exposures (moonlight), and light leaks (stray light). You must carefully process each frame: dodge and burn (gain correction), remove defects (cloud masking), stack multiple exposures (monthly compositing), and calibrate to a standard (absolute radiometric calibration). Only then does the true image of Earth at night emerge.',
      storyConnection: 'From space, Ziro Valley is a dark patch in an increasingly bright landscape. The VIIRS satellite sees Itanagar as a growing glow to the south, the Brahmaputra valley corridor as a chain of lights connecting Guwahati to Dibrugarh, and the hill stations as isolated dim points. The Apatani people cannot see this perspective from the ground, but satellite data reveals their valley\'s darkness in the context of regional development — and shows exactly which light sources threaten it.',
      checkQuestion: 'A VIIRS pixel measures 2.5 nW/cm^2/sr in January (new moon, clear sky) and 8.0 nW/cm^2/sr in July (monsoon season, mostly cloudy). Should you average these two values for an annual composite? Why or why not?',
      checkAnswer: 'No. The July reading is contaminated by cloud reflections, which scatter light from distant cities into areas that are actually dark. Cloud-contaminated pixels must be rejected, not averaged. The standard approach is to use the minimum or a low percentile (e.g., 10th percentile) of all readings for that pixel, which preferentially selects the clearest nights. Alternatively, use a cloud mask from the VIIRS cloud product to exclude cloudy observations before averaging.',
      codeIntro: 'Generate synthetic VIIRS-DNB imagery for northeastern India: model city radiance falloff, terrain shielding, and create a realistic nighttime radiance map.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Synthetic VIIRS-DNB Generator ---
class VIIRSSimulator:
    """Generate realistic VIIRS-like nighttime radiance data."""

    def __init__(self, lat_range, lon_range, resolution_deg=0.02):
        self.lats = np.arange(lat_range[0], lat_range[1], resolution_deg)
        self.lons = np.arange(lon_range[0], lon_range[1], resolution_deg)
        self.lon_grid, self.lat_grid = np.meshgrid(self.lons, self.lats)
        self.resolution = resolution_deg

    def city_radiance(self, city_lat, city_lon, population, spread_factor=0.15):
        """Model radiance from a city using inverse-square falloff."""
        dist = np.sqrt((self.lat_grid - city_lat)**2 + (self.lon_grid - city_lon)**2)
        # Radiance ~ population / distance^2, with exponential decay
        peak_radiance = population / 5000  # nW/cm^2/sr
        radiance = peak_radiance * np.exp(-dist / (spread_factor * np.sqrt(population / 100000)))
        return radiance

    def terrain_mask(self):
        """Simulate terrain: hills block light propagation.
        Higher elevations in north (Arunachal) and east (Nagaland hills)."""
        # Simplified elevation model
        lat_norm = (self.lat_grid - self.lats[0]) / (self.lats[-1] - self.lats[0])
        lon_norm = (self.lon_grid - self.lons[0]) / (self.lons[-1] - self.lons[0])

        # Brahmaputra valley: low elevation band
        valley = np.exp(-((self.lat_grid - 26.5)**2) / (2 * 0.5**2))

        # Hills: higher toward north and edges
        hills = 0.3 + 0.7 * lat_norm + 0.3 * np.sin(lon_norm * 4 * np.pi)

        # Terrain blocking factor: high terrain blocks light spread
        elevation = hills * (1 - 0.5 * valley)
        blocking = 0.3 + 0.7 * np.exp(-elevation * 2)
        return elevation, blocking

    def generate_radiance_map(self, cities):
        """Generate complete radiance map from city data."""
        elevation, blocking = self.terrain_mask()
        total_radiance = np.zeros_like(self.lat_grid)

        for name, (lat, lon, pop) in cities.items():
            city_rad = self.city_radiance(lat, lon, pop)
            total_radiance += city_rad * blocking

        # Add background: natural airglow + scattered galactic light
        natural_background = 0.2 + 0.05 * np.random.randn(*self.lat_grid.shape)
        total_radiance += np.abs(natural_background)

        # Add noise (sensor noise + atmospheric variability)
        noise = np.abs(np.random.normal(0, 0.1, self.lat_grid.shape))
        total_radiance += noise

        return total_radiance, elevation

# --- Generate the map ---
cities = {
    'Guwahati':  (26.14, 91.74, 1120000),
    'Shillong':  (25.57, 91.88, 170000),
    'Itanagar':  (27.08, 93.62, 60000),
    'Dibrugarh': (27.47, 94.91, 155000),
    'Imphal':    (24.82, 93.95, 268000),
    'Agartala':  (23.83, 91.28, 400000),
    'Kohima':    (25.67, 94.12, 115000),
    'Aizawl':    (23.73, 92.72, 293000),
    'Dimapur':   (25.91, 93.73, 122000),
    'Silchar':   (24.83, 92.78, 172000),
    'Jorhat':    (26.76, 94.22, 153000),
    'Tezpur':    (26.63, 92.80, 102000),
    'Nagaon':    (26.35, 92.69, 147000),
}

sim = VIIRSSimulator((24.0, 29.5), (89.5, 97.5), resolution_deg=0.02)
radiance, elevation = sim.generate_radiance_map(cities)

# Dark sky sites
dark_sites = {
    'Ziro Valley': (27.59, 93.83),
    'Tawang':      (27.59, 91.86),
    'Mechuka':     (28.60, 94.09),
    'Mawsynram':   (25.30, 91.58),
}

fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Raw radiance map (log scale)
ax = axes[0, 0]
ax.set_facecolor('#0a0a1a')
rad_log = np.log10(np.clip(radiance, 0.1, None))
im = ax.pcolormesh(sim.lons, sim.lats, rad_log, cmap='hot', shading='auto')
plt.colorbar(im, ax=ax, label='log10(radiance) [nW/cm²/sr]')

for name, (lat, lon, _) in cities.items():
    ax.plot(lon, lat, 'o', color='white', markersize=3)
    ax.annotate(name, (lon, lat), textcoords='offset points', xytext=(3, 3),
                color='white', fontsize=5)
for name, (lat, lon) in dark_sites.items():
    ax.plot(lon, lat, '*', color='#22c55e', markersize=10)
    ax.annotate(name, (lon, lat), textcoords='offset points', xytext=(3, 3),
                color='#22c55e', fontsize=6, fontweight='bold')

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Simulated VIIRS-DNB Nighttime Radiance', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 2: Elevation / terrain
ax = axes[0, 1]
ax.set_facecolor('#0a0a1a')
im2 = ax.pcolormesh(sim.lons, sim.lats, elevation, cmap='terrain', shading='auto')
plt.colorbar(im2, ax=ax, label='Relative elevation')
ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Terrain model (hills block light)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 3: Radiance histogram
ax = axes[1, 0]
ax.set_facecolor('#111827')
rad_flat = radiance.flatten()
ax.hist(rad_flat[rad_flat < 20], bins=100, color='#f59e0b', alpha=0.7, edgecolor='none')
ax.axvline(np.median(rad_flat), color='#22c55e', linestyle='--', linewidth=2,
           label=f'Median: {np.median(rad_flat):.2f}')
ax.axvline(1.0, color='#ef4444', linestyle=':', linewidth=2,
           label='Dark site threshold (<1.0)')
ax.set_xlabel('Radiance (nW/cm²/sr)', color='white')
ax.set_ylabel('Pixel count', color='white')
ax.set_title('Radiance distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Radiance at dark sites vs cities
ax = axes[1, 1]
ax.set_facecolor('#111827')

site_radiances = {}
for name, (lat, lon) in dark_sites.items():
    lat_idx = np.argmin(np.abs(sim.lats - lat))
    lon_idx = np.argmin(np.abs(sim.lons - lon))
    r = 3  # average over ~3 pixel radius
    region = radiance[max(0,lat_idx-r):lat_idx+r, max(0,lon_idx-r):lon_idx+r]
    site_radiances[name] = np.mean(region)

city_radiances = {}
for name, (lat, lon, _) in list(cities.items())[:6]:
    lat_idx = np.argmin(np.abs(sim.lats - lat))
    lon_idx = np.argmin(np.abs(sim.lons - lon))
    r = 3
    region = radiance[max(0,lat_idx-r):lat_idx+r, max(0,lon_idx-r):lon_idx+r]
    city_radiances[name] = np.mean(region)

all_names = list(site_radiances.keys()) + list(city_radiances.keys())
all_values = list(site_radiances.values()) + list(city_radiances.values())
all_colors = ['#22c55e'] * len(site_radiances) + ['#ef4444'] * len(city_radiances)

bars = ax.barh(range(len(all_names)), all_values, color=all_colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(all_names)))
ax.set_yticklabels(all_names, color='white', fontsize=8)
ax.set_xlabel('Mean radiance (nW/cm²/sr)', color='white')
ax.set_title('Dark sites vs cities', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, all_values):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{val:.1f}', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print(f"Grid size: {len(sim.lats)} x {len(sim.lons)} = {len(sim.lats)*len(sim.lons):,} pixels")
print(f"Radiance range: {radiance.min():.2f} - {radiance.max():.1f} nW/cm²/sr")
print()
print("Dark site radiances:")
for name, val in site_radiances.items():
    print(f"  {name}: {val:.2f} nW/cm²/sr")
print()
print("City radiances:")
for name, val in city_radiances.items():
    print(f"  {name}: {val:.1f} nW/cm²/sr")`,
      challenge: 'Add a cloud masking step: generate random cloud cover (more clouds during monsoon months), flag contaminated pixels, and show how monthly compositing with cloud rejection produces cleaner maps than simple averaging.',
      successHint: 'Working with satellite imagery is the foundation of modern environmental monitoring. The same skills apply to deforestation tracking, urbanization mapping, and disaster response. Nighttime lights are just one application of a universal remote sensing workflow.',
    },
    {
      title: 'Radiance to magnitude conversion — from satellite units to sky brightness',
      concept: `The critical step in the light pollution mapper is converting satellite radiance (nW/cm^2/sr) into sky brightness (mag/arcsec^2), the unit that astronomers use and that maps to the Bortle scale. This conversion bridges two worlds: remote sensing and observational astronomy.

The conversion formula starts with the definition of spectral radiance and the magnitude system. A radiance of L nW/cm^2/sr corresponds to a surface brightness of: SB = -2.5 * log10(L) + C, where C is a zero-point constant that depends on the photometric band and calibration. For the VIIRS-DNB bandpass (roughly V-band equivalent), the zero-point is approximately 26.33 mag/arcsec^2. So: SB (mag/arcsec^2) = -2.5 * log10(L_nW) + 26.33, where L_nW is radiance in nW/cm^2/sr. A radiance of 0.17 nW/cm^2/sr corresponds to roughly 22.0 mag/arcsec^2 (a pristine dark sky), while 174 nW/cm^2/sr corresponds to about 20.7 mag/arcsec^2 (suburban sky).

However, satellite-measured radiance is **upward-emitted light**, while sky brightness (mag/arcsec^2) is **downward-scattered light** as seen from the ground. The relationship between them depends on atmospheric conditions, aerosol content, humidity, and geometry. The **Garstang model** and its successors (like the Cinzano-Falchi model used in the World Atlas of Artificial Night Sky Brightness) convert upward radiance to ground-level sky brightness using atmospheric transfer functions. A simplified version: the fraction of upward light that returns to the ground at the source location is roughly 10-20%, depending on aerosol optical depth. At distance d from the source, the contribution falls off roughly as 1/d^2.5 after accounting for atmospheric extinction.`,
      analogy: 'Converting satellite radiance to sky brightness is like converting the wattage of a speaker to the actual loudness you hear in a concert hall. The speaker output (radiance going up) is not the same as what reaches your ears (sky glow coming down), because the sound bounces off walls, is absorbed by the audience, and disperses with distance. You need an acoustic model of the room — or in our case, an atmospheric model of the sky — to make the conversion.',
      storyConnection: 'When a satellite passes over Ziro Valley at 1:30 AM, it sees almost no upward radiance — the Apatani homes emit little light, and there are no streetlights. But the sky brightness that a ground observer experiences includes scattered light from Itanagar, the Brahmaputra valley corridor, and even distant Guwahati. The radiance-to-magnitude conversion must account for this atmospheric long-range transport of light. Ziro\'s sky quality depends not just on local light, but on the entire regional light budget.',
      checkQuestion: 'A satellite measures 1.0 nW/cm^2/sr over a pixel. Using SB = -2.5 * log10(L) + 26.33, what is the sky brightness? Is this a dark or light-polluted site?',
      checkAnswer: 'SB = -2.5 * log10(1.0) + 26.33 = -2.5 * 0 + 26.33 = 26.33 mag/arcsec^2. But wait — this is the upward radiance converted directly. The actual ground-level sky brightness would be darker (higher mag/arcsec^2) because only a fraction of upward light scatters back down. With typical atmospheric correction, the ground-level SB might be about 21.0-21.5 mag/arcsec^2, which corresponds to Bortle 2-3 (a good dark site but not pristine). The raw conversion overestimates sky brightness at the source location.',
      codeIntro: 'Implement the full radiance-to-magnitude conversion pipeline: direct conversion, atmospheric transfer correction, and validation against known Bortle classifications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Radiance to Sky Brightness Conversion ---

def radiance_to_mag_direct(radiance_nw):
    """Direct conversion: radiance (nW/cm²/sr) to mag/arcsec².
    Zero point calibrated to VIIRS-DNB bandpass."""
    radiance_nw = np.clip(radiance_nw, 1e-4, None)  # avoid log(0)
    return -2.5 * np.log10(radiance_nw) + 26.33

def atmospheric_correction(radiance_up, aerosol_tau=0.15, elevation_km=0):
    """Convert upward radiance to ground-level sky brightness.

    Uses simplified Garstang-Cinzano atmospheric model.
    aerosol_tau: aerosol optical depth (0.05=clean, 0.3=hazy)
    elevation_km: observer elevation in km
    """
    # Fraction of upward light that scatters back to ground at source
    # Depends on aerosol loading and molecular (Rayleigh) scattering
    rayleigh_factor = 0.06 * np.exp(-elevation_km / 8.5)  # scale height
    aerosol_factor = 0.12 * (aerosol_tau / 0.15)
    scatter_fraction = rayleigh_factor + aerosol_factor

    # Effective downward radiance at ground
    ground_radiance = radiance_up * scatter_fraction

    return ground_radiance

def radiance_to_bortle(radiance_nw, elevation_km=0, aerosol_tau=0.15):
    """Full pipeline: radiance -> atmospheric correction -> mag -> Bortle."""
    ground_rad = atmospheric_correction(radiance_nw, aerosol_tau, elevation_km)
    # Add natural sky background (~0.17 nW/cm²/sr equivalent at ground)
    total_ground = ground_rad + 0.17
    sky_mag = radiance_to_mag_direct(total_ground)

    # Classify Bortle
    bortle_thresholds = [
        (21.75, 1), (21.6, 2), (21.3, 3), (20.8, 4), (20.3, 5),
        (19.5, 6), (18.5, 7), (17.5, 8), (0, 9)
    ]
    for threshold, bortle in bortle_thresholds:
        if sky_mag >= threshold:
            return sky_mag, bortle
    return sky_mag, 9

# --- Demo: conversion across range of radiances ---
radiances = np.logspace(-1, 3, 500)  # 0.1 to 1000 nW/cm²/sr

# Direct conversion (no atmospheric correction)
mag_direct = radiance_to_mag_direct(radiances)

# With atmospheric correction at different conditions
conditions = [
    ('Clean air, 1500m (Ziro)', 0.10, 1.5),
    ('Average air, sea level', 0.15, 0.0),
    ('Hazy air, sea level', 0.30, 0.0),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Radiance to magnitude conversion curves
ax = axes[0, 0]
ax.set_facecolor('#111827')

ax.semilogx(radiances, mag_direct, '--', color='gray', linewidth=1, label='Direct (satellite)')

colors_cond = ['#22c55e', '#fbbf24', '#ef4444']
for (label, tau, elev), color in zip(conditions, colors_cond):
    ground_rads = atmospheric_correction(radiances, tau, elev)
    ground_total = ground_rads + 0.17
    ground_mag = radiance_to_mag_direct(ground_total)
    ax.semilogx(radiances, ground_mag, color=color, linewidth=2, label=label)

# Bortle class bands
bortle_colors = {1: '#001122', 2: '#001133', 3: '#002244', 4: '#003355',
                 5: '#114466', 6: '#225577', 7: '#446688', 8: '#668899', 9: '#88aaaa'}
bortle_bounds = [(21.75, 22.5, 'B1'), (21.6, 21.75, 'B2'), (21.3, 21.6, 'B3'),
                 (20.8, 21.3, 'B4'), (20.3, 20.8, 'B5'), (19.5, 20.3, 'B6')]
for low, high, label in bortle_bounds:
    ax.axhspan(low, high, alpha=0.1, color='white')
    ax.text(0.12, (low + high) / 2, label, color='gray', fontsize=7, va='center')

ax.set_xlabel('Satellite radiance (nW/cm²/sr)', color='white')
ax.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax.set_title('Radiance → Sky Brightness Conversion', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
ax.set_ylim(17, 23)
ax.invert_yaxis()

# Plot 2: Effect of aerosol optical depth
ax = axes[0, 1]
ax.set_facecolor('#111827')

tau_range = np.linspace(0.02, 0.5, 50)
test_radiances = [0.5, 2.0, 10.0, 50.0]
test_colors = ['#22c55e', '#3b82f6', '#fbbf24', '#ef4444']

for rad, color in zip(test_radiances, test_colors):
    mags = []
    for tau in tau_range:
        ground = atmospheric_correction(rad, tau, 0) + 0.17
        mags.append(radiance_to_mag_direct(ground))
    ax.plot(tau_range, mags, color=color, linewidth=2, label=f'L = {rad} nW')

ax.set_xlabel('Aerosol optical depth', color='white')
ax.set_ylabel('Ground sky brightness (mag/arcsec²)', color='white')
ax.set_title('Aerosol effect on sky brightness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.invert_yaxis()

# Plot 3: Apply to our NE India data
ax = axes[1, 0]
ax.set_facecolor('#0a0a1a')

# Regenerate radiance map (simplified)
lats = np.arange(24.0, 29.5, 0.05)
lons = np.arange(89.5, 97.5, 0.05)
lon_grid, lat_grid = np.meshgrid(lons, lats)
radiance_map = np.full_like(lat_grid, 0.3)  # background

cities_data = {
    'Guwahati': (26.14, 91.74, 1120000), 'Shillong': (25.57, 91.88, 170000),
    'Itanagar': (27.08, 93.62, 60000), 'Imphal': (24.82, 93.95, 268000),
    'Agartala': (23.83, 91.28, 400000), 'Dibrugarh': (27.47, 94.91, 155000),
}

for name, (lat, lon, pop) in cities_data.items():
    dist = np.sqrt((lat_grid - lat)**2 + (lon_grid - lon)**2)
    radiance_map += (pop / 5000) * np.exp(-dist / (0.15 * np.sqrt(pop / 100000)))

# Convert to sky brightness
sky_brightness_map = np.zeros_like(radiance_map)
bortle_map = np.zeros_like(radiance_map)
for i in range(radiance_map.shape[0]):
    for j in range(radiance_map.shape[1]):
        mag, bortle = radiance_to_bortle(radiance_map[i, j], elevation_km=0.5)
        sky_brightness_map[i, j] = mag
        bortle_map[i, j] = bortle

im = ax.pcolormesh(lons, lats, sky_brightness_map, cmap='RdYlGn', shading='auto',
                    vmin=18, vmax=22)
plt.colorbar(im, ax=ax, label='Sky brightness (mag/arcsec²)')

# Mark Ziro
ax.plot(93.83, 27.59, '*', color='white', markersize=12, markeredgecolor='black')
ax.annotate('Ziro', (93.83, 27.59), textcoords='offset points',
            xytext=(8, 5), color='white', fontsize=9, fontweight='bold')

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Sky brightness map (mag/arcsec²)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 4: Bortle classification map
ax = axes[1, 1]
ax.set_facecolor('#0a0a1a')
from matplotlib.colors import ListedColormap
bortle_cmap = ListedColormap(['#001122', '#001133', '#002244', '#003355',
                                '#114466', '#225577', '#446688', '#668899', '#88aaaa'])
im2 = ax.pcolormesh(lons, lats, bortle_map, cmap=bortle_cmap, shading='auto',
                     vmin=1, vmax=9)
cbar = plt.colorbar(im2, ax=ax, ticks=range(1, 10))
cbar.set_label('Bortle class', color='white')
cbar.ax.tick_params(colors='gray')

ax.plot(93.83, 27.59, '*', color='#22c55e', markersize=12, markeredgecolor='white')
ax.annotate('Ziro', (93.83, 27.59), textcoords='offset points',
            xytext=(8, 5), color='#22c55e', fontsize=9, fontweight='bold')

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Bortle class map (NE India)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Print Ziro Valley analysis
ziro_lat_idx = np.argmin(np.abs(lats - 27.59))
ziro_lon_idx = np.argmin(np.abs(lons - 93.83))
ziro_mag = sky_brightness_map[ziro_lat_idx, ziro_lon_idx]
ziro_bortle = int(bortle_map[ziro_lat_idx, ziro_lon_idx])
ziro_rad = radiance_map[ziro_lat_idx, ziro_lon_idx]

print(f"Ziro Valley analysis:")
print(f"  Satellite radiance: {ziro_rad:.2f} nW/cm²/sr")
print(f"  Ground sky brightness: {ziro_mag:.2f} mag/arcsec²")
print(f"  Bortle classification: Class {ziro_bortle}")
print()
print("Conversion pipeline: satellite radiance → atmospheric transfer → sky brightness → Bortle class")`,
      challenge: 'Implement the distance-dependent light pollution model: for each pixel, sum the contributions from ALL cities weighted by 1/d^2.5, then convert. Show how Itanagar (close) contributes more to Ziro\'s sky brightness than Guwahati (far) despite Guwahati being much larger.',
      successHint: 'The radiance-to-magnitude conversion is where physics meets practical measurement. Getting it right means your maps can be validated against ground-truth SQM readings. Getting it wrong means your Bortle classifications are meaningless.',
    },
    {
      title: 'Spatial analysis — creating light pollution contour maps',
      concept: `A contour map transforms a grid of sky brightness values into meaningful spatial features: zones of equal brightness, boundaries between Bortle classes, and corridors of darkness that could serve as protected areas. The mathematics is **isoline extraction**: given a 2D scalar field f(x,y), find the curves where f(x,y) = constant. These isolines (like elevation contours on a topographic map) reveal the spatial structure of light pollution in a way that color maps alone cannot.

The key spatial features for dark sky conservation are: **dark corridors** (connected regions where sky brightness exceeds 21.5 mag/arcsec^2), **light domes** (contour lines around cities showing the extent of their influence), and **transition zones** (the gradient between dark and light areas, which determines how far from a city you must travel to reach dark sky). The gradient of the sky brightness field, |grad(SB)|, tells you how rapidly conditions change — steep gradients mean a short drive from city to darkness (good for accessible astronomy), while shallow gradients mean light pollution extends far (bad for conservation).

For dark sky reserve designation, the **core zone** must be Bortle 1-2 (SB > 21.6 mag/arcsec^2), and the **buffer zone** must be Bortle 3-4 (SB > 20.8). Contour maps immediately reveal whether a candidate site has sufficient area in each zone. The International Dark-Sky Association requires at least 700 acres of core zone for a Dark Sky Park designation. By computing areas enclosed by our contour lines, we can assess whether Ziro Valley meets these criteria.`,
      analogy: 'Light pollution contour maps work like weather pressure maps. Just as isobars (lines of equal pressure) reveal the structure of weather systems — high-pressure centers, low-pressure troughs, fronts — isolines of sky brightness reveal the structure of the light pollution landscape. Cities are high-pressure centers (bright), and dark sky sites are the tranquil eyes of the storm. The contour spacing tells you how quickly conditions change, just as tightly packed isobars indicate strong winds.',
      storyConnection: 'Drawing contour lines around Ziro Valley\'s dark sky is the first step toward protecting it. If you can show that the valley and surrounding hills encompass enough area at Bortle 2 or better — and that the gradient from the Itanagar light dome is steep enough that a modest buffer zone would protect the core — you have the scientific foundation for a Dark Sky Reserve proposal. The Apatani land management system already defines zones (wet rice paddies, fish ponds, bamboo forest); a dark sky reserve would add one more zone to their landscape: the sky itself.',
      checkQuestion: 'A city of 500,000 people creates a light dome. At 20 km, the sky brightness is 19.5 mag/arcsec^2. At 80 km, it is 21.3 mag/arcsec^2. Assuming a power-law falloff, at what distance does the sky reach 21.6 mag/arcsec^2 (Bortle 2)?',
      checkAnswer: 'The brightness decreases by 21.3 - 19.5 = 1.8 mag over 80 - 20 = 60 km. The rate is 1.8/60 = 0.03 mag/km. To go from 21.3 to 21.6 requires 0.3 more magnitudes, or 0.3/0.03 = 10 km further. So Bortle 2 is reached at about 90 km from the city center. (In reality, the falloff is not linear in distance but roughly power-law, so the actual calculation would use log-distance, giving a slightly different answer.)',
      codeIntro: 'Create professional contour maps of sky brightness: extract isolines, compute enclosed areas, identify dark corridors, and assess Ziro Valley\'s dark sky reserve potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

np.random.seed(42)

# --- Regenerate high-resolution sky brightness map ---
lats = np.arange(25.5, 29.0, 0.02)
lons = np.arange(91.0, 96.0, 0.02)
lon_grid, lat_grid = np.meshgrid(lons, lats)

# Cities in the Ziro region
cities = {
    'Itanagar': (27.08, 93.62, 60000),
    'Guwahati': (26.14, 91.74, 1120000),
    'Tezpur':   (26.63, 92.80, 102000),
    'Jorhat':   (26.76, 94.22, 153000),
    'Dimapur':  (25.91, 93.73, 122000),
    'Kohima':   (25.67, 94.12, 115000),
    'North Lakhimpur': (27.24, 94.10, 50000),
    'Naharlagun': (27.10, 93.70, 35000),
}

# Generate radiance map
radiance = np.full_like(lat_grid, 0.2)  # natural background

for name, (lat, lon, pop) in cities.items():
    dist = np.sqrt((lat_grid - lat)**2 + (lon_grid - lon)**2)
    spread = 0.12 * np.sqrt(pop / 100000)
    peak = pop / 5000
    radiance += peak * np.exp(-dist / spread)

# Terrain: Ziro Valley is surrounded by hills that partially block light
# Add hill blocking effect
ziro_lat, ziro_lon = 27.59, 93.83
dist_to_ziro = np.sqrt((lat_grid - ziro_lat)**2 + (lon_grid - ziro_lon)**2)

# Hill ring around Ziro (reduces incoming light)
hill_effect = 1 - 0.4 * np.exp(-((dist_to_ziro - 0.3)**2) / (2 * 0.15**2))
radiance *= hill_effect

# Add some terrain-based noise
radiance += np.abs(0.05 * np.random.randn(*radiance.shape))

# Convert to sky brightness
def rad_to_sb(rad, elev_km=0.5, tau=0.12):
    ground_rad = rad * (0.06 * np.exp(-elev_km/8.5) + 0.12 * (tau/0.15))
    total = ground_rad + 0.17
    return -2.5 * np.log10(np.clip(total, 1e-4, None)) + 26.33

sky_brightness = rad_to_sb(radiance)

# Bortle classification
def sb_to_bortle(sb):
    thresholds = [(21.75, 1), (21.6, 2), (21.3, 3), (20.8, 4), (20.3, 5),
                  (19.5, 6), (18.5, 7), (17.5, 8), (0, 9)]
    result = np.full_like(sb, 9, dtype=int)
    for thresh, bortle in thresholds:
        result[sb >= thresh] = bortle
    return result

bortle = sb_to_bortle(sky_brightness)

fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')

# --- Plot 1: Filled contour map with isolines ---
ax = axes[0, 0]
ax.set_facecolor('#0a0a1a')

levels = [17.0, 18.5, 19.5, 20.3, 20.8, 21.3, 21.6, 21.75, 22.5]
colors_fill = ['#cc3333', '#cc6633', '#cc9933', '#99993a', '#669944',
               '#33994e', '#0a7755', '#004d33']
cs = ax.contourf(lons, lats, sky_brightness, levels=levels, colors=colors_fill, extend='both')
cbar = plt.colorbar(cs, ax=ax, label='mag/arcsec²')
cbar.ax.tick_params(colors='gray')

# Add contour lines with labels
cl = ax.contour(lons, lats, sky_brightness, levels=levels[1:], colors='white',
                linewidths=0.5, alpha=0.5)
ax.clabel(cl, inline=True, fontsize=7, fmt='%.1f', colors='white')

# Mark cities
for name, (lat, lon, pop) in cities.items():
    ax.plot(lon, lat, 'o', color='#fbbf24', markersize=max(3, np.sqrt(pop/50000)*3))
    ax.annotate(name, (lon, lat), textcoords='offset points', xytext=(4, 4),
                color='#fbbf24', fontsize=6)

# Mark Ziro
ax.plot(ziro_lon, ziro_lat, '*', color='white', markersize=15, markeredgecolor='#22c55e',
        markeredgewidth=1.5)
ax.annotate('Ziro Valley', (ziro_lon, ziro_lat), textcoords='offset points',
            xytext=(10, 8), color='#22c55e', fontsize=9, fontweight='bold')

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Sky Brightness Contour Map', color='white', fontsize=12)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# --- Plot 2: Bortle zone map ---
ax = axes[0, 1]
ax.set_facecolor('#0a0a1a')

bortle_cmap = ListedColormap([
    '#001122', '#001a33', '#003355', '#115566',
    '#227744', '#448833', '#779922', '#aa8822', '#cc5522'
])
im = ax.pcolormesh(lons, lats, bortle, cmap=bortle_cmap, shading='auto', vmin=1, vmax=9)
cbar2 = plt.colorbar(im, ax=ax, ticks=range(1, 10))
cbar2.set_label('Bortle class', color='white')
cbar2.ax.tick_params(colors='gray')

# Overlay core zone contour (Bortle 1-2, SB > 21.6)
ax.contour(lons, lats, sky_brightness, levels=[21.6], colors=['#22c55e'],
           linewidths=2, linestyles='--')
ax.contour(lons, lats, sky_brightness, levels=[20.8], colors=['#fbbf24'],
           linewidths=1.5, linestyles=':')

ax.plot(ziro_lon, ziro_lat, '*', color='white', markersize=15)
ax.annotate('Core zone (B1-2)', (92.5, 28.5), color='#22c55e', fontsize=9, fontweight='bold')
ax.annotate('Buffer zone (B3-4)', (92.5, 28.2), color='#fbbf24', fontsize=8)

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Bortle Zone Classification', color='white', fontsize=12)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# --- Plot 3: Cross-section through Ziro Valley ---
ax = axes[1, 0]
ax.set_facecolor('#111827')

# North-south cross section through Ziro longitude
lon_idx = np.argmin(np.abs(lons - ziro_lon))
sb_cross = sky_brightness[:, lon_idx]
lat_cross = lats

# East-west cross section through Ziro latitude
lat_idx = np.argmin(np.abs(lats - ziro_lat))
sb_ew = sky_brightness[lat_idx, :]

ax.plot(lat_cross, sb_cross, color='#3b82f6', linewidth=2, label='N-S cross-section')
ax.plot(lons, sb_ew, color='#f59e0b', linewidth=2, label='E-W cross-section')

# Mark Bortle boundaries
for sb_val, label, style in [(21.6, 'B2 (core)', '--'), (20.8, 'B4 (buffer)', ':')]:
    ax.axhline(sb_val, color='gray', linestyle=style, linewidth=1, alpha=0.5)
    ax.text(lats[0] + 0.1, sb_val + 0.05, label, color='gray', fontsize=7)

ax.axvline(ziro_lat, color='#22c55e', linestyle='--', alpha=0.3)
ax.text(ziro_lat + 0.05, 19, 'Ziro', color='#22c55e', fontsize=9)

ax.set_xlabel('Latitude (°N) / Longitude (°E)', color='white')
ax.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax.set_title('Cross-sections through Ziro Valley', color='white', fontsize=12)
ax.invert_yaxis()
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

# --- Plot 4: Area analysis for dark sky reserve ---
ax = axes[1, 1]
ax.set_facecolor('#111827')

# Compute area in each Bortle class (near Ziro)
# Focus area: 1-degree box around Ziro
mask = (lat_grid > ziro_lat - 0.5) & (lat_grid < ziro_lat + 0.5) & \
       (lon_grid > ziro_lon - 0.5) & (lon_grid < ziro_lon + 0.5)
pixel_area_km2 = (0.02 * 111) ** 2  # approximate km² per pixel

bortle_areas = {}
for b in range(1, 10):
    count = np.sum((bortle == b) & mask)
    bortle_areas[b] = count * pixel_area_km2

classes = list(bortle_areas.keys())
areas = list(bortle_areas.values())
bar_colors = ['#001122', '#001a33', '#003355', '#115566', '#227744',
              '#448833', '#779922', '#aa8822', '#cc5522']

bars = ax.bar(classes, areas, color=bar_colors, edgecolor='#333', width=0.7)
ax.set_xlabel('Bortle class', color='white')
ax.set_ylabel('Area (km²) within 0.5° of Ziro', color='white')
ax.set_title('Dark Sky Reserve Area Analysis', color='white', fontsize=12)
ax.tick_params(colors='gray')

for bar, area in zip(bars, areas):
    if area > 0:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
                f'{area:.0f}', ha='center', color='white', fontsize=8)

# IDA minimum threshold
ax.axhline(700 * 0.00404686, color='#22c55e', linestyle='--', linewidth=1.5,
           label='IDA min core (700 acres)')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("DARK SKY RESERVE ASSESSMENT — ZIRO VALLEY")
print("=" * 55)
print(f"\\nArea within 0.5° of Ziro Valley:")
core_area = sum(bortle_areas.get(b, 0) for b in [1, 2])
buffer_area = sum(bortle_areas.get(b, 0) for b in [3, 4])
print(f"  Core zone (Bortle 1-2): {core_area:.0f} km² ({core_area/2.59:.0f} sq mi)")
print(f"  Buffer zone (Bortle 3-4): {buffer_area:.0f} km² ({buffer_area/2.59:.0f} sq mi)")
print(f"  Total protected area: {core_area + buffer_area:.0f} km²")
print()
ida_min_km2 = 700 * 0.00404686  # 700 acres in km²
print(f"IDA Dark Sky Park minimum: {ida_min_km2:.1f} km² core zone")
print(f"Ziro core: {core_area:.0f} km² — {'QUALIFIES' if core_area > ida_min_km2 else 'INSUFFICIENT'}")
print()

# Ziro specific readings
ziro_sb = sky_brightness[np.argmin(np.abs(lats - ziro_lat)), np.argmin(np.abs(lons - ziro_lon))]
ziro_b = bortle[np.argmin(np.abs(lats - ziro_lat)), np.argmin(np.abs(lons - ziro_lon))]
print(f"Ziro Valley center: {ziro_sb:.2f} mag/arcsec², Bortle {ziro_b}")`,
      challenge: 'Add gradient analysis: compute |grad(sky_brightness)| across the map and identify the steepest gradient zones. These are the boundaries of light domes. Overlay gradient vectors on the contour map to show the "direction of darkness" — which way to travel from any point to find darker sky.',
      successHint: 'Contour maps transform raw data into spatial intelligence. A policymaker who cannot read a data table can immediately understand a contour map showing that Ziro Valley sits inside a protective ring of darkness that is being eroded from the south.',
    },
    {
      title: 'Trend analysis — tracking light pollution changes over years',
      concept: `Light pollution is not static. Globally, artificial light at night is increasing by 2-6% per year, with South and Southeast Asia among the fastest-growing regions. In northeastern India, this growth is driven by urbanization, road construction, and the expansion of the electrical grid into previously unconnected areas. Understanding these trends requires multi-year time series analysis of satellite data.

The **VIIRS-DNB** sensor has been collecting data since 2012, giving us over a decade of nighttime radiance measurements. To detect trends, you compare annual composites pixel by pixel. The analysis involves: **linear regression** of radiance vs year for each pixel (the slope tells you the growth rate), **change detection** (identifying pixels where radiance changed significantly between two dates), and **spatial trend mapping** (showing which areas are brightening fastest and which remain stable). Statistical significance is important — you need enough years of data and careful uncertainty estimation to distinguish real trends from measurement noise and natural variability (monsoon cycles, snow cover, etc.).

For Ziro Valley, the critical questions are: Is light pollution increasing? If so, from which direction? How fast? At the current rate, when will the valley's sky degrade from Bortle 2 to Bortle 3 (losing the zodiacal light)? These projections, presented with uncertainty bounds, are powerful tools for conservation planning. They tell policymakers: "act now, while the sky is still worth saving; in 15 years it may be too late."`,
      analogy: 'Trend analysis is like tracking a patient\'s blood pressure over years. A single reading tells you today\'s state. A decade of readings reveals the trajectory: stable, improving, or deteriorating. If the trend is heading toward a danger zone, you intervene before the crisis. Light pollution trend analysis does the same — it reveals the trajectory of sky quality and sounds the alarm before irreversible damage.',
      storyConnection: 'The Apatani people have oral histories of sky changes: older generations recall seeing things in the night sky that younger generations cannot. These are not imagined losses — they reflect real increases in light pollution as Itanagar and the road network have expanded. Satellite trend analysis puts numbers to these oral histories, validating traditional knowledge with scientific data. When an Apatani elder says "the stars are dimming," the trend maps confirm: radiance over the valley has increased X% per decade.',
      checkQuestion: 'A pixel shows radiance values of 0.5 nW in 2014 and 0.8 nW in 2024. What is the annual growth rate? If this rate continues, when will it reach 2.0 nW (the typical threshold for noticeable sky degradation)?',
      checkAnswer: 'The growth factor over 10 years is 0.8/0.5 = 1.6. Annual growth rate = 1.6^(1/10) - 1 = 0.048 = 4.8% per year. To reach 2.0 nW from 0.8 nW: 0.8 * (1.048)^n = 2.0, so n = ln(2.5)/ln(1.048) = 19.5 years. By about 2044, this pixel would cross the degradation threshold. This timeline is actionable — it is within the planning horizon of most conservation programs.',
      codeIntro: 'Simulate multi-year VIIRS data, perform pixel-level trend analysis, create growth rate maps, and project when Ziro Valley will lose its dark sky status under different scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Multi-year Light Pollution Simulation ---
years = np.arange(2014, 2031)
n_years = len(years)

# Focus region around Ziro
lats = np.arange(26.0, 29.0, 0.03)
lons = np.arange(92.0, 95.5, 0.03)
lon_grid, lat_grid = np.meshgrid(lons, lats)

cities = {
    'Itanagar': (27.08, 93.62, 60000, 0.06),   # lat, lon, pop_2014, annual_growth
    'Guwahati': (26.14, 91.74, 1120000, 0.03),
    'Tezpur':   (26.63, 92.80, 102000, 0.02),
    'Jorhat':   (26.76, 94.22, 153000, 0.02),
    'N.Lakhimpur': (27.24, 94.10, 50000, 0.04),
    'Naharlagun': (27.10, 93.70, 35000, 0.08),  # fast-growing suburb
}

# Generate radiance for each year
annual_radiance = np.zeros((n_years, len(lats), len(lons)))

for yi, year in enumerate(years):
    radiance = np.full_like(lat_grid, 0.2)  # natural background

    for name, (lat, lon, pop_2014, growth) in cities.items():
        pop = pop_2014 * (1 + growth) ** (year - 2014)
        dist = np.sqrt((lat_grid - lat)**2 + (lon_grid - lon)**2)
        spread = 0.12 * np.sqrt(pop / 100000)
        radiance += (pop / 5000) * np.exp(-dist / spread)

    # Road development: gradual illumination along NH-415 (Itanagar to Ziro road)
    road_lat_range = np.linspace(27.08, 27.59, 20)
    road_lon_range = np.linspace(93.62, 93.83, 20)
    road_growth = 0.05 * (year - 2014) / 10  # gradual
    for rl, rn in zip(road_lat_range, road_lon_range):
        dist = np.sqrt((lat_grid - rl)**2 + (lon_grid - rn)**2)
        radiance += road_growth * np.exp(-dist / 0.05)

    # Add noise
    radiance += np.abs(0.03 * np.random.randn(*radiance.shape))
    annual_radiance[yi] = radiance

# --- Trend analysis: linear regression per pixel ---
def pixel_trend(time_series, years):
    """Fit linear trend to a pixel's time series. Returns slope and R²."""
    x = years - years[0]
    n = len(x)
    sum_x = np.sum(x)
    sum_y = np.sum(time_series)
    sum_xy = np.sum(x * time_series)
    sum_x2 = np.sum(x**2)
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x**2)
    intercept = (sum_y - slope * sum_x) / n

    # R²
    y_pred = intercept + slope * x
    ss_res = np.sum((time_series - y_pred)**2)
    ss_tot = np.sum((time_series - np.mean(time_series))**2)
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0

    return slope, intercept, r2

slope_map = np.zeros_like(lat_grid)
r2_map = np.zeros_like(lat_grid)
growth_rate_map = np.zeros_like(lat_grid)

for i in range(len(lats)):
    for j in range(len(lons)):
        ts = annual_radiance[:, i, j]
        slope, intercept, r2 = pixel_trend(ts, years)
        slope_map[i, j] = slope
        r2_map[i, j] = r2
        # Percent growth rate
        if ts[0] > 0.01:
            growth_rate_map[i, j] = (slope / ts[0]) * 100  # % per year

fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.patch.set_facecolor('#1f2937')

ziro_lat, ziro_lon = 27.59, 93.83

# Plot 1: 2014 radiance
ax = axes[0, 0]
ax.set_facecolor('#0a0a1a')
im = ax.pcolormesh(lons, lats, np.log10(np.clip(annual_radiance[0], 0.1, None)),
                    cmap='hot', shading='auto', vmin=-1, vmax=2.5)
ax.plot(ziro_lon, ziro_lat, '*', color='#22c55e', markersize=12)
ax.set_title('2014 radiance', color='white', fontsize=11)
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# Plot 2: 2024 radiance
ax = axes[0, 1]
ax.set_facecolor('#0a0a1a')
idx_2024 = np.argmin(np.abs(years - 2024))
im = ax.pcolormesh(lons, lats, np.log10(np.clip(annual_radiance[idx_2024], 0.1, None)),
                    cmap='hot', shading='auto', vmin=-1, vmax=2.5)
ax.plot(ziro_lon, ziro_lat, '*', color='#22c55e', markersize=12)
ax.set_title('2024 radiance', color='white', fontsize=11)
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# Plot 3: Growth rate map
ax = axes[0, 2]
ax.set_facecolor('#0a0a1a')
im = ax.pcolormesh(lons, lats, np.clip(growth_rate_map, 0, 15),
                    cmap='YlOrRd', shading='auto', vmin=0, vmax=10)
plt.colorbar(im, ax=ax, label='Growth rate (%/year)')
ax.plot(ziro_lon, ziro_lat, '*', color='#22c55e', markersize=12)
ax.contour(lons, lats, growth_rate_map, levels=[2, 5, 8], colors='white',
           linewidths=0.5, alpha=0.5)
ax.set_title('Annual growth rate', color='white', fontsize=11)
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# Plot 4: Ziro Valley time series
ax = axes[1, 0]
ax.set_facecolor('#111827')

ziro_i = np.argmin(np.abs(lats - ziro_lat))
ziro_j = np.argmin(np.abs(lons - ziro_lon))
ziro_ts = annual_radiance[:, ziro_i, ziro_j]

ita_i = np.argmin(np.abs(lats - 27.08))
ita_j = np.argmin(np.abs(lons - 93.62))
ita_ts = annual_radiance[:, ita_i, ita_j]

ax.plot(years, ziro_ts, 'o-', color='#22c55e', linewidth=2, markersize=5, label='Ziro Valley')
ax.plot(years, ita_ts / 50, 'o-', color='#ef4444', linewidth=2, markersize=5,
        label='Itanagar (/50)')

# Trend line for Ziro
slope, intercept, r2 = pixel_trend(ziro_ts, years)
trend_line = intercept + slope * (years - years[0])
ax.plot(years, trend_line, '--', color='#22c55e', linewidth=1, alpha=0.7)

# Project forward
future_years = np.arange(2031, 2051)
future_trend = intercept + slope * (np.concatenate([years, future_years]) - years[0])
ax.plot(np.concatenate([years, future_years]),
        future_trend[:len(years) + len(future_years)],
        ':', color='#fbbf24', linewidth=1.5, alpha=0.7, label='Projected')

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Radiance (nW/cm²/sr)', color='white')
ax.set_title(f'Ziro Valley trend (slope={slope:.4f}/yr, R²={r2:.2f})', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

# Plot 5: Sky brightness trend (converted)
ax = axes[1, 1]
ax.set_facecolor('#111827')

def rad_to_sb(rad):
    ground = rad * 0.15 + 0.17
    return -2.5 * np.log10(np.clip(ground, 1e-4, None)) + 26.33

ziro_sb = [rad_to_sb(r) for r in ziro_ts]
all_years_proj = np.concatenate([years, future_years])
proj_rad = intercept + slope * (all_years_proj - years[0])
proj_sb = [rad_to_sb(r) for r in proj_rad]

ax.plot(years, ziro_sb, 'o-', color='#22c55e', linewidth=2, markersize=5, label='Measured')
ax.plot(all_years_proj, proj_sb, ':', color='#fbbf24', linewidth=1.5, label='Projected')

# Bortle boundaries
ax.axhline(21.6, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(2015, 21.55, 'Bortle 2/3 boundary', color='gray', fontsize=7)
ax.axhline(21.3, color='gray', linestyle=':', linewidth=1, alpha=0.5)
ax.text(2015, 21.25, 'Bortle 3/4 boundary', color='gray', fontsize=7)

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax.set_title('Ziro sky quality projection', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

# Plot 6: Scenario comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')

scenarios = {
    'No action (current trend)': 1.0,
    'Moderate controls': 0.5,
    'Strong controls (shielding)': 0.2,
    'Dark sky reserve (freeze)': 0.0,
}

scenario_colors = ['#ef4444', '#fbbf24', '#3b82f6', '#22c55e']
proj_years = np.arange(2024, 2055)

for (label, factor), color in zip(scenarios.items(), scenario_colors):
    current_slope = slope * factor
    current_val = ziro_ts[idx_2024]
    proj = current_val + current_slope * (proj_years - 2024)
    proj_sb_scen = [rad_to_sb(r) for r in proj]
    ax.plot(proj_years, proj_sb_scen, linewidth=2, color=color, label=label)

ax.axhline(21.6, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(2050, 21.55, 'B2/B3', color='gray', fontsize=7)
ax.axhline(21.3, color='gray', linestyle=':', linewidth=1, alpha=0.5)
ax.text(2050, 21.25, 'B3/B4', color='gray', fontsize=7)

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax.set_title('Policy scenarios for Ziro', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

plt.tight_layout()
plt.show()

print("TREND ANALYSIS SUMMARY")
print("=" * 55)
print(f"Ziro Valley 2014 radiance: {ziro_ts[0]:.3f} nW/cm²/sr")
print(f"Ziro Valley 2024 radiance: {ziro_ts[idx_2024]:.3f} nW/cm²/sr")
print(f"Annual slope: +{slope:.4f} nW/cm²/sr per year")
print(f"Growth rate: {(slope/ziro_ts[0])*100:.1f}% per year")
print(f"R²: {r2:.3f}")
print()
print("Without intervention: Bortle 3 reached by ~{:.0f}".format(
    2024 + (0.5 - ziro_ts[idx_2024]) / slope if slope > 0 else 9999))
print("With strong controls: dark sky preserved indefinitely")`,
      challenge: 'Add seasonal decomposition: separate the annual signal into trend + seasonal + residual components. NE India has strong monsoon seasonality that affects satellite measurements. Show the monsoon dip in "measurable" radiance (clouds block ground lights) and demonstrate that deseasonalized trends give more accurate growth rates.',
      successHint: 'Trend analysis turns snapshots into narratives. A single map shows where light pollution is. A trend analysis shows where it is going. Projections with policy scenarios turn science into action items for decision-makers.',
    },
    {
      title: 'Portfolio — the complete Light Pollution Mapper & dark sky conservation plan',
      concept: `This final lesson brings together every component into a polished, portfolio-ready tool. Your Light Pollution Mapper now has a complete pipeline: satellite data ingestion, radiance-to-magnitude conversion, spatial contour mapping, Bortle classification, multi-year trend analysis, and policy scenario projections. But a tool without context is just code. The portfolio wraps your technical work in a conservation narrative.

The output should include: (1) A **dark sky site ranking** for northeastern India, scoring candidate locations on sky quality, accessibility, area, and trend stability. (2) A **threat assessment** for each site, identifying the nearest growing light sources and projecting when (if ever) they will degrade the site below conservation thresholds. (3) **Conservation recommendations** with specific, actionable items: fixture types, shielding standards, lighting curfews, and buffer zone boundaries. (4) A **validation framework** — what ground-truth measurements (SQM readings, all-sky photography) would be needed to confirm and refine the satellite-based analysis.

This is exactly the kind of analysis that organizations like the International Dark-Sky Association, India's Department of Science and Technology, and state governments in northeastern India need. Professional light pollution assessments follow this same structure. The difference between your student project and a professional report is scale and ground truth — the methodology is identical. You have built a real tool for a real conservation problem.`,
      analogy: 'The portfolio is like a doctor presenting a patient case: history (multi-year trend), diagnosis (current Bortle class), prognosis (projection under current trajectory), and treatment plan (conservation recommendations). Each piece builds on the previous ones, and the whole is far more compelling than any single test result.',
      storyConnection: 'The story of why stars are brighter in Ziro Valley began as a celebration of the Apatani people\'s dark sky heritage. Your capstone project transforms that story into a scientific case for preservation. The Apatani tradition of sustainable land management — rice-fish farming that has sustained them for centuries — now extends to sustainable sky management. The light pollution mapper is the tool that makes that vision measurable, communicable, and actionable.',
      checkQuestion: 'Your mapper shows that Ziro Valley is currently Bortle 2 with a degradation rate of 3% per year due to Itanagar growth. You propose a Dark Sky Reserve with a 20 km buffer zone and shielded lighting ordinance. How would you validate that your proposal is working, five years after implementation?',
      checkAnswer: 'Validation requires multiple data streams: (1) Compare VIIRS satellite data from before and after implementation — has the growth rate in the buffer zone decreased? (2) Install permanent SQM stations at the core site and buffer boundary to provide continuous ground-truth. (3) Conduct annual all-sky photography at fixed positions to track visual changes. (4) Compare actual sky brightness at the 5-year mark against the projected brightness from the "strong controls" scenario. If the data tracks the projection, the policy is working. If it tracks the "no action" scenario, enforcement has failed.',
      codeIntro: 'Build the final portfolio output: site rankings, threat assessments, conservation recommendations, and a complete dark sky mapper report for northeastern India.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

np.random.seed(42)

# --- Dark Sky Site Assessment Engine ---

class DarkSiteAssessment:
    """Complete assessment of a candidate dark sky site."""

    def __init__(self, name, lat, lon, current_sb, current_bortle,
                 trend_slope, area_km2_core, area_km2_buffer,
                 nearest_city, city_dist_km, city_growth_rate):
        self.name = name
        self.lat = lat
        self.lon = lon
        self.current_sb = current_sb
        self.current_bortle = current_bortle
        self.trend_slope = trend_slope  # mag/arcsec²/year (negative = degrading)
        self.area_core = area_km2_core
        self.area_buffer = area_km2_buffer
        self.nearest_city = nearest_city
        self.city_dist = city_dist_km
        self.city_growth = city_growth_rate

    def years_to_bortle3(self):
        """Years until sky degrades to Bortle 3 (SB < 21.6)."""
        if self.current_sb <= 21.6:
            return 0
        if self.trend_slope >= 0:
            return float('inf')
        return (21.6 - self.current_sb) / self.trend_slope

    def conservation_score(self):
        """Score 0-100 based on sky quality, area, stability, accessibility."""
        quality_score = min(25, (self.current_sb - 20.0) * 12.5)
        area_score = min(25, self.area_core / 40)
        stability_score = min(25, max(0, 25 + self.trend_slope * 500))
        # Accessibility: closer to a road/town = more accessible = higher score
        access_score = min(25, max(0, 25 - self.city_dist / 10))
        return quality_score + area_score + stability_score + access_score

    def recommendations(self):
        recs = []
        if self.current_bortle <= 2:
            recs.append("PROTECT: Core zone qualifies for IDA Dark Sky Park")
        if self.trend_slope < -0.02:
            recs.append(f"URGENT: Sky degrading at {abs(self.trend_slope)*100:.1f}% per decade")
        if self.city_dist < 50:
            recs.append(f"SHIELD: {self.nearest_city} ({self.city_dist:.0f}km) needs lighting ordinance")
        if self.area_buffer < 200:
            recs.append("EXPAND: Buffer zone insufficient, extend perimeter")
        recs.append("MONITOR: Install permanent SQM station for validation")
        return recs

# --- Assess NE India dark sky candidates ---
sites = [
    DarkSiteAssessment(
        'Ziro Valley', 27.59, 93.83, 21.72, 2, -0.015, 450, 800,
        'Itanagar', 55, 0.06),
    DarkSiteAssessment(
        'Tawang', 27.59, 91.86, 21.80, 1, -0.005, 600, 1200,
        'Bomdila', 80, 0.03),
    DarkSiteAssessment(
        'Mechuka', 28.60, 94.09, 21.85, 1, -0.003, 800, 1500,
        'Along', 120, 0.02),
    DarkSiteAssessment(
        'Mawsynram', 25.30, 91.58, 21.20, 3, -0.025, 150, 300,
        'Shillong', 35, 0.04),
    DarkSiteAssessment(
        'Dzukou Valley', 25.52, 94.07, 21.50, 3, -0.010, 200, 500,
        'Kohima', 25, 0.03),
    DarkSiteAssessment(
        'Phawngpui Peak', 22.65, 93.02, 21.65, 2, -0.008, 350, 700,
        'Aizawl', 90, 0.04),
]

# Sort by conservation score
sites.sort(key=lambda s: s.conservation_score(), reverse=True)

fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')

# --- Plot 1: Site ranking dashboard ---
ax1 = fig.add_subplot(2, 2, 1)
ax1.set_facecolor('#111827')

names = [s.name for s in sites]
scores = [s.conservation_score() for s in sites]
bar_colors = ['#22c55e' if s > 70 else '#fbbf24' if s > 50 else '#ef4444' for s in scores]

bars = ax1.barh(range(len(sites)), scores, color=bar_colors, edgecolor='none', height=0.6)
ax1.set_yticks(range(len(sites)))
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Conservation Priority Score (0-100)', color='white')
ax1.set_title('Dark Sky Site Rankings — NE India', color='white', fontsize=12, fontweight='bold')
ax1.set_xlim(0, 105)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

for bar, score, site in zip(bars, scores, sites):
    ax1.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{score:.0f} (B{site.current_bortle})', va='center', color='white', fontsize=9)

# --- Plot 2: Threat timeline ---
ax2 = fig.add_subplot(2, 2, 2)
ax2.set_facecolor('#111827')

future_years = np.arange(2024, 2074)
site_colors = ['#22c55e', '#34d399', '#3b82f6', '#fbbf24', '#f97316', '#a78bfa']

for site, color in zip(sites, site_colors):
    sb_proj = site.current_sb + site.trend_slope * (future_years - 2024)
    ax2.plot(future_years, sb_proj, linewidth=2, color=color, label=site.name)
    # Mark when Bortle 3 is reached
    yrs_to_b3 = site.years_to_bortle3()
    if 0 < yrs_to_b3 < 50:
        ax2.plot(2024 + yrs_to_b3, 21.6, 'x', color=color, markersize=10, markeredgewidth=2)

ax2.axhline(21.6, color='white', linestyle='--', linewidth=1, alpha=0.3)
ax2.text(2070, 21.55, 'B2/B3', color='gray', fontsize=7)
ax2.axhline(21.3, color='white', linestyle=':', linewidth=1, alpha=0.3)
ax2.text(2070, 21.25, 'B3/B4', color='gray', fontsize=7)

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax2.set_title('Threat Timeline: When Sites Lose Dark Status', color='white', fontsize=12)
ax2.invert_yaxis()
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, ncol=2)
ax2.tick_params(colors='gray')
ax2.grid(True, alpha=0.1)

# --- Plot 3: Regional map with site scores ---
ax3 = fig.add_subplot(2, 2, 3)
ax3.set_facecolor('#0a0a1a')

# Simple regional background
lats_bg = np.arange(22, 30, 0.1)
lons_bg = np.arange(89, 98, 0.1)
lon_bg, lat_bg = np.meshgrid(lons_bg, lats_bg)
bg = np.zeros_like(lat_bg)

# Add city glow
ne_cities = {
    'Guwahati': (26.14, 91.74, 1120000), 'Shillong': (25.57, 91.88, 170000),
    'Imphal': (24.82, 93.95, 268000), 'Agartala': (23.83, 91.28, 400000),
    'Aizawl': (23.73, 92.72, 293000), 'Dimapur': (25.91, 93.73, 122000),
}
for _, (lat, lon, pop) in ne_cities.items():
    dist = np.sqrt((lat_bg - lat)**2 + (lon_bg - lon)**2)
    bg += (pop / 50000) * np.exp(-dist / 0.5)

ax3.pcolormesh(lons_bg, lats_bg, np.log10(bg + 1), cmap='hot', shading='auto',
                alpha=0.6, vmin=0, vmax=2)

# Plot sites with score-proportional markers
for site, color in zip(sites, site_colors):
    score = site.conservation_score()
    ax3.scatter(site.lon, site.lat, s=score * 3, c=color, edgecolors='white',
                linewidth=1.5, zorder=5)
    ax3.annotate(f'{site.name}\n(Score: {score:.0f})', (site.lon, site.lat),
                 textcoords='offset points', xytext=(12, 5),
                 color='white', fontsize=7, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.3', facecolor='#1f2937', alpha=0.8))

ax3.set_xlim(89, 98)
ax3.set_ylim(22, 30)
ax3.set_xlabel('Longitude (°E)', color='white')
ax3.set_ylabel('Latitude (°N)', color='white')
ax3.set_title('Dark Sky Candidate Sites Map', color='white', fontsize=12)
ax3.set_aspect('equal')
ax3.tick_params(colors='gray')

# --- Plot 4: Conservation recommendations summary ---
ax4 = fig.add_subplot(2, 2, 4)
ax4.set_facecolor('#111827')
ax4.set_xlim(0, 10)
ax4.set_ylim(0, 12)
ax4.set_xticks([]); ax4.set_yticks([])

# Title
ax4.text(5, 11.5, 'CONSERVATION RECOMMENDATIONS', ha='center', color='white',
         fontsize=13, fontweight='bold')
ax4.text(5, 11.0, 'Top 3 Priority Sites', ha='center', color='gray', fontsize=10)

y_pos = 10.0
for i, site in enumerate(sites[:3]):
    # Site header
    score = site.conservation_score()
    color = site_colors[i]
    ax4.add_patch(FancyBboxPatch((0.3, y_pos - 0.4), 9.4, 0.7,
                                  boxstyle="round,pad=0.1",
                                  facecolor=color, alpha=0.15, edgecolor=color))
    ax4.text(0.5, y_pos, f'#{i+1} {site.name}', color=color,
             fontsize=11, fontweight='bold', va='center')
    ax4.text(9.5, y_pos, f'Score: {score:.0f}', color=color,
             fontsize=10, ha='right', va='center')

    y_pos -= 0.8
    recs = site.recommendations()
    for rec in recs[:3]:
        marker = '!' if 'URGENT' in rec else '*'
        rec_color = '#ef4444' if 'URGENT' in rec else '#22c55e' if 'PROTECT' in rec else 'white'
        ax4.text(0.8, y_pos, f'{marker} {rec}', color=rec_color, fontsize=7.5, va='center')
        y_pos -= 0.5

    yrs = site.years_to_bortle3()
    yrs_text = f'{yrs:.0f} years' if yrs < 100 else 'Stable'
    ax4.text(0.8, y_pos, f'  Time to Bortle 3: {yrs_text}', color='gray', fontsize=7, va='center')
    y_pos -= 0.8

ax4.set_title('Action Plan', color='white', fontsize=12)

plt.tight_layout()
plt.show()

# --- Print final report ---
print("=" * 70)
print("  LIGHT POLLUTION MAPPER — NE INDIA DARK SKY ASSESSMENT REPORT")
print("=" * 70)
print()

for i, site in enumerate(sites):
    score = site.conservation_score()
    yrs = site.years_to_bortle3()
    yrs_text = f'{yrs:.0f} years' if yrs < 200 else 'Stable (>200 yr)'
    print(f"#{i+1} {site.name}")
    print(f"   Location: {site.lat:.2f}°N, {site.lon:.2f}°E")
    print(f"   Sky quality: {site.current_sb:.2f} mag/arcsec² (Bortle {site.current_bortle})")
    print(f"   Core area: {site.area_core:.0f} km² | Buffer: {site.area_buffer:.0f} km²")
    print(f"   Trend: {site.trend_slope:+.3f} mag/arcsec²/yr")
    print(f"   Nearest threat: {site.nearest_city} ({site.city_dist:.0f} km, {site.city_growth*100:.0f}% growth)")
    print(f"   Time to Bortle 3: {yrs_text}")
    print(f"   Conservation score: {score:.0f}/100")
    print(f"   Recommendations:")
    for rec in site.recommendations():
        print(f"     - {rec}")
    print()

print("OVERALL RECOMMENDATIONS FOR NE INDIA:")
print("  1. Designate Mechuka and Tawang as Dark Sky Parks (highest scores)")
print("  2. Establish Ziro Valley lighting ordinance before Itanagar growth degrades it")
print("  3. Install SQM monitoring network at all 6 candidate sites")
print("  4. Engage Apatani, Monpa, and Adi tribal communities as sky stewards")
print("  5. Propose NE India Dark Sky Corridor connecting Tawang-Mechuka-Ziro")
print()
print("This analysis was generated by a Light Pollution Mapper built from scratch.")
print("Next steps: validate with ground-truth SQM readings and all-sky photography.")`,
      challenge: 'Add an economic analysis: estimate the eco-tourism potential of each dark sky site based on accessibility, existing infrastructure, and sky quality. Calculate the cost-benefit ratio of lighting ordinance enforcement versus tourism revenue from astro-tourism. Real dark sky reserves like NamibRand and Aoraki Mackenzie generate significant economic returns.',
      successHint: 'You have built a complete scientific tool from first principles: physics, data processing, spatial analysis, trend detection, and policy recommendations. This is real-world conservation science. The same methodology is used by professional researchers, but you built it from scratch and understand every step. That is the difference between using a tool and being an engineer.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Light Pollution Mapper
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (astronomy & light pollution science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build a complete light pollution analysis tool. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
