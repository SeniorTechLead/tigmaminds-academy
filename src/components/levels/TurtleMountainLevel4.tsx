import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TurtleMountainLevel4() {
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
      title: 'Capstone Part 1: Terrain and climate data model for nest site selection',
      concept: `The Nest Site Selector capstone builds a tool that predicts optimal nesting locations on a mountain given terrain, temperature, and ecological constraints. A female turtle must choose a site that balances incubation temperature (for sex ratio), predation risk, flood risk, and accessibility.

The terrain model represents a mountain as a 2D elevation grid. Each cell has properties derived from elevation: temperature (lapse rate), slope, aspect (compass direction the slope faces), soil type, vegetation cover, and proximity to water. These are the input features for the nest site scoring algorithm.

Key terrain-derived variables:
- **Temperature** = base_temp - (elevation * lapse_rate), with aspect correction (south-facing slopes are warmer in the northern hemisphere)
- **Slope** = gradient magnitude (too steep = eggs roll, too flat = flooding)
- **Soil moisture** = function of elevation, slope, and proximity to streams
- **Solar exposure** = hours of direct sun per day, affected by slope and aspect
- **Predator density** = function of vegetation cover and distance from forest edge`,
      analogy: 'Building the terrain model is like creating a detailed hiking map that shows not just elevation but temperature, soil quality, and danger zones at every point. The turtle needs this multi-layer map to make her nesting decision — and we are building it computationally from basic topographic data.',
      storyConnection: 'The turtle climbing the mountain is surveying potential nest sites with every step. Each sun-warmed clearing, each sandy bank, each sheltered hollow is evaluated against her innate criteria. Our model formalizes the calculation she performs instinctively.',
      checkQuestion: 'Two sites at the same elevation have different aspects: one faces south, the other north. In the northern hemisphere, which is warmer and by how much approximately?',
      checkAnswer: 'The south-facing slope receives more direct sunlight and is warmer — typically 2-5 degrees C warmer than the north-facing slope at the same elevation. This is because the sun\'s path is in the southern sky (in the northern hemisphere), so south-facing slopes intercept more solar radiation per unit area. This aspect effect can be as significant as a 300-750m elevation difference.',
      codeIntro: 'Build the terrain and climate model for the mountain nest site selector.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_mountain(size=100, peak_height=2000):
    """Generate a mountain elevation grid with realistic features."""
    x = np.linspace(-3, 3, size)
    y = np.linspace(-3, 3, size)
    X, Y = np.meshgrid(x, y)

    # Main peak + secondary features
    elevation = peak_height * np.exp(-(X**2 + Y**2) / 2)
    elevation += 300 * np.exp(-((X-1)**2 + (Y+1)**2) / 0.5)  # ridge
    elevation += 200 * np.exp(-((X+1.5)**2 + (Y-0.5)**2) / 0.3)  # secondary peak

    # Add noise for realism
    noise = np.random.normal(0, 30, (size, size))
    for scale in [3, 7, 15]:
        noise += np.random.normal(0, 50/scale, (size, size))
    elevation += noise
    elevation = np.maximum(elevation, 50)  # minimum elevation

    return elevation, X, Y

def compute_terrain_properties(elevation, cell_size=60):
    """Derive slope, aspect, and other properties from elevation grid."""
    # Slope (degrees)
    dy, dx = np.gradient(elevation, cell_size)
    slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))

    # Aspect (compass direction of downhill, 0=N, 90=E, 180=S, 270=W)
    aspect = np.degrees(np.arctan2(-dx, -dy)) % 360

    return slope, aspect

def compute_nest_climate(elevation, aspect, base_temp=32, lapse_rate=6.5):
    """Temperature model including aspect correction."""
    # Base temperature from lapse rate
    T = base_temp - elevation * lapse_rate / 1000

    # Aspect correction: south-facing warmer (northern hemisphere)
    # Maximum correction at aspect=180 (south), minimum at 0/360 (north)
    aspect_correction = 3.0 * np.cos(np.radians(aspect - 180))
    T += aspect_correction

    # Solar hours: depends on slope and aspect
    solar_hours = 8 + 4 * np.cos(np.radians(aspect - 180)) * np.clip(1 - elevation/2000, 0, 1)

    return T, solar_hours

# Generate terrain
size = 100
elevation, X, Y = generate_mountain(size)
slope, aspect = compute_terrain_properties(elevation)
temperature, solar_hours = compute_nest_climate(elevation, aspect)

# Soil moisture: higher near streams (low points) and with lower slope
flow_accumulation = np.zeros_like(elevation)
for i in range(1, size-1):
    for j in range(1, size-1):
        if elevation[i,j] < np.mean(elevation[max(0,i-2):i+3, max(0,j-2):j+3]):
            flow_accumulation[i,j] = 1
soil_moisture = 0.3 + 0.5 * flow_accumulation - 0.01 * slope
soil_moisture = np.clip(soil_moisture, 0.05, 0.95)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Elevation
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(elevation, cmap='terrain', origin='lower')
ax.set_title('Elevation (m)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 2: Slope
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(slope, cmap='YlOrRd', origin='lower', vmin=0, vmax=45)
ax.set_title('Slope (degrees)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 3: Aspect
ax = axes[0, 2]
ax.set_facecolor('#111827')
im = ax.imshow(aspect, cmap='hsv', origin='lower', vmin=0, vmax=360)
ax.set_title('Aspect (0=N, 180=S)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 4: Temperature
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(temperature, cmap='RdYlBu_r', origin='lower')
ax.set_title('Nest temperature (°C)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 5: Solar hours
ax = axes[1, 1]
ax.set_facecolor('#111827')
im = ax.imshow(solar_hours, cmap='YlOrRd', origin='lower')
ax.set_title('Solar hours/day', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 6: Soil moisture
ax = axes[1, 2]
ax.set_facecolor('#111827')
im = ax.imshow(soil_moisture, cmap='Blues', origin='lower', vmin=0, vmax=1)
ax.set_title('Soil moisture', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

plt.tight_layout()
plt.show()

print("Terrain model generated:")
print(f"  Grid: {size}x{size} cells ({size*60/1000:.1f} km x {size*60/1000:.1f} km)")
print(f"  Elevation: {elevation.min():.0f} - {elevation.max():.0f} m")
print(f"  Temperature range: {temperature.min():.1f} - {temperature.max():.1f} °C")
print(f"  Slope range: {slope.min():.1f} - {slope.max():.1f} degrees")
print(f"  Solar hours: {solar_hours.min():.1f} - {solar_hours.max():.1f} hr/day")`,
      challenge: 'Add stream channels derived from flow accumulation (water flows downhill). Mark areas within 10m of streams as flood-risk zones. How does this change the available nesting area?',
      successHint: 'Geographic Information Systems (GIS) compute exactly these terrain derivatives from elevation data. The slope, aspect, and solar radiation calculations you just implemented are the core algorithms in every terrain analysis toolkit.',
    },
    {
      title: 'Capstone Part 2: Nest temperature prediction — thermal modeling at depth',
      concept: `A turtle nest is typically 15-30 cm deep in soil. The temperature at nest depth is not the same as the surface temperature — it is buffered by the thermal mass of the soil. Understanding this buffering is critical for predicting sex ratios.

The soil temperature at depth z and time t follows the heat diffusion equation:
T(z,t) = T_mean + A_surface * exp(-z * sqrt(omega / (2 * alpha))) * cos(omega*t - z * sqrt(omega / (2*alpha)))

where:
- **T_mean**: annual mean surface temperature
- **A_surface**: amplitude of surface temperature variation
- **omega**: angular frequency (2*pi / period)
- **alpha**: thermal diffusivity of soil (m^2/s)
- **z**: depth below surface

Key insights from this equation:
- Temperature amplitude **decreases exponentially** with depth — deeper nests have more stable temperatures
- Temperature variation is **phase-delayed** with depth — the hottest part of the day at the surface arrives later at depth
- Different soil types (sand vs. clay) have different diffusivities, changing both damping and lag`,
      analogy: 'Soil acts like a thermal blanket with a built-in delay. A thick blanket (deep nest) smooths out the hot and cold spikes. But it also means yesterday\'s heat arrives at the nest today. The turtle exploits this buffering — she does not need the perfect surface temperature, she needs the right depth and soil combination to produce the target nest temperature.',
      storyConnection: 'When the turtle in our story digs her nest, the depth she chooses is not arbitrary. It is a thermal engineering decision. Dig too shallow and the eggs experience dangerous temperature swings. Dig too deep and she cannot reach them — and the temperature may be too cool. The optimal depth depends on the soil and the climate.',
      checkQuestion: 'A nest at 20cm depth in sandy soil has a daily temperature range of 5 degrees. If the turtle digs to 40cm instead, what happens to the daily range?',
      checkAnswer: 'The temperature amplitude decreases exponentially with depth. Doubling the depth roughly squares the damping factor: if the amplitude was reduced to 60% at 20cm, it would be 60%^2 = 36% at 40cm. So the 5-degree range at 20cm might become about 1.8 degrees at 40cm. The exact value depends on the soil\'s thermal diffusivity and the period of the temperature cycle.',
      codeIntro: 'Implement the soil thermal model and predict nest temperatures at different depths and soil types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Soil thermal model for turtle nest temperature prediction
def soil_temperature(z_cm, time_hours, T_mean, T_amplitude, alpha_m2s, period_hours=24):
    """Compute soil temperature at depth z and time t using heat diffusion."""
    z = z_cm / 100  # convert to meters
    omega = 2 * np.pi / (period_hours * 3600)  # rad/s

    damping = np.exp(-z * np.sqrt(omega / (2 * alpha_m2s)))
    phase_lag = z * np.sqrt(omega / (2 * alpha_m2s))

    t = time_hours * 3600  # convert to seconds
    T = T_mean + T_amplitude * damping * np.cos(omega * t - phase_lag)
    return T

# Soil thermal diffusivities (m^2/s)
soils = {
    'Dry sand': 4.0e-7,
    'Wet sand': 7.0e-7,
    'Clay': 2.5e-7,
    'Loam': 3.5e-7,
}

# Time and depth arrays
hours = np.linspace(0, 72, 500)  # 3 days
depths = np.linspace(0, 50, 200)  # 0 to 50 cm

T_mean = 29.0  # °C
T_amplitude = 8.0  # °C daily swing at surface

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Temperature at different depths (dry sand)
ax = axes[0, 0]
ax.set_facecolor('#111827')
alpha = soils['Dry sand']
for z, clr in [(0, '#ef4444'), (10, '#f59e0b'), (20, '#22c55e'), (30, '#3b82f6'), (40, '#a855f7')]:
    T = soil_temperature(z, hours, T_mean, T_amplitude, alpha)
    ax.plot(hours, T, color=clr, linewidth=2, label=f'{z} cm')
ax.axhline(29, color='gray', linewidth=1, linestyle='--', label='Pivotal T')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature at depth (dry sand)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Depth-time heatmap
ax = axes[0, 1]
ax.set_facecolor('#111827')
T_grid = np.zeros((len(depths), len(hours)))
for i, z in enumerate(depths):
    T_grid[i] = soil_temperature(z, hours, T_mean, T_amplitude, alpha)
im = ax.imshow(T_grid, aspect='auto', origin='lower',
               extent=[0, 72, 0, 50], cmap='RdYlBu_r', vmin=20, vmax=38)
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Temperature heatmap (depth vs time)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='°C')

# Plot 3: Amplitude vs depth for different soils
ax = axes[0, 2]
ax.set_facecolor('#111827')
depth_range = np.linspace(0, 50, 100)
colors_soil = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
for (name, alpha), clr in zip(soils.items(), colors_soil):
    omega = 2 * np.pi / (24 * 3600)
    damping = np.exp(-depth_range/100 * np.sqrt(omega / (2 * alpha)))
    amplitude = T_amplitude * damping
    ax.plot(depth_range, amplitude, color=clr, linewidth=2, label=name)
ax.set_xlabel('Depth (cm)', color='white')
ax.set_ylabel('Temperature amplitude (°C)', color='white')
ax.set_title('Damping by soil type', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Phase lag vs depth
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, alpha), clr in zip(soils.items(), colors_soil):
    omega = 2 * np.pi / (24 * 3600)
    phase_lag_hours = depth_range/100 * np.sqrt(omega / (2 * alpha)) / omega / 3600
    ax.plot(depth_range, phase_lag_hours, color=clr, linewidth=2, label=name)
ax.set_xlabel('Depth (cm)', color='white')
ax.set_ylabel('Phase lag (hours)', color='white')
ax.set_title('Temperature delay with depth', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Optimal nest depth for target temperature
ax = axes[1, 1]
ax.set_facecolor('#111827')
# For each depth, compute the time-averaged temperature and daily range
for (name, alpha), clr in zip(soils.items(), colors_soil):
    daily_ranges = []
    mean_temps = []
    for z in depth_range:
        T = soil_temperature(z, np.linspace(0, 24, 100), T_mean, T_amplitude, alpha)
        daily_ranges.append(T.max() - T.min())
        mean_temps.append(T.mean())
    ax.plot(depth_range, daily_ranges, color=clr, linewidth=2, label=name)
ax.axhline(2, color='gray', linewidth=1, linestyle=':', label='Target range < 2°C')
ax.set_xlabel('Depth (cm)', color='white')
ax.set_ylabel('Daily temperature range (°C)', color='white')
ax.set_title('Depth for thermal stability', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Sex ratio prediction at different depths
ax = axes[1, 2]
ax.set_facecolor('#111827')
def sex_ratio(T, Tp=29.0, k=1.5):
    return 1 / (1 + np.exp(-k * (T - Tp)))

alpha_sand = soils['Dry sand']
for z, clr in [(10, '#ef4444'), (15, '#f59e0b'), (20, '#22c55e'), (25, '#3b82f6'), (30, '#a855f7')]:
    T_over_time = soil_temperature(z, np.linspace(0, 24*60, 2000), T_mean, T_amplitude, alpha_sand)
    # Average sex ratio over incubation
    sr = sex_ratio(T_over_time).mean() * 100
    ax.bar(z, sr, width=4, color=clr, label=f'{z}cm: {sr:.0f}% F')
ax.axhline(50, color='gray', linewidth=1, linestyle='--', label='50% target')
ax.set_xlabel('Nest depth (cm)', color='white')
ax.set_ylabel('% Female', color='white')
ax.set_title('Sex ratio vs nest depth', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Nest thermal model:")
print(f"  Surface: {T_mean}°C ± {T_amplitude}°C")
print(f"  At 20cm in dry sand: amplitude = {T_amplitude * np.exp(-0.2*np.sqrt(2*np.pi/(24*3600)/(2*soils['Dry sand']))):.1f}°C")
print(f"  Phase lag at 20cm: {0.2*np.sqrt(2*np.pi/(24*3600)/(2*soils['Dry sand']))/(2*np.pi/(24*3600))/3600:.1f} hours")
print(f"  Deeper nests = more thermal stability = more predictable sex ratio")`,
      challenge: 'Add seasonal temperature variation (period = 365 days) in addition to daily variation. How deep must a nest be for the seasonal cycle to be damped by 90%? This is important for species that nest at different times of year.',
      successHint: 'The heat diffusion equation is one of the most important PDEs in physics and engineering. The same math that predicts nest temperature also models building insulation, semiconductor cooling, and even financial option pricing (the Black-Scholes equation is mathematically identical).',
    },
    {
      title: 'Capstone Part 3: Predation risk mapping — spatial ecology of nest predators',
      concept: `A perfect temperature means nothing if the nest is destroyed by a predator. Nest predation is the largest source of turtle egg mortality in most populations. The predation risk at any location depends on:

1. **Predator density**: varies with habitat type (forest edge has more predators than open grassland)
2. **Predator movement patterns**: most nest predators (raccoons, monitor lizards, crows) follow predictable paths along trails and edges
3. **Detection probability**: some nest sites are more concealed by vegetation
4. **Distance from cover**: predators prefer sites with nearby escape routes

We model predation risk as a **risk surface** — a continuous map of predation probability at each location. This requires combining multiple spatial layers:

Risk(x,y) = w1 * predator_density(x,y) + w2 * detection_prob(x,y) + w3 * edge_distance(x,y)

The risk surface interacts with the thermal map: optimal temperature sites near forest edges may have high predation risk, forcing the turtle to trade off temperature optimality against safety. This trade-off is the core of the nest site selection problem.`,
      analogy: 'Mapping predation risk is like mapping crime rates in a city. Some neighborhoods are safer than others, and the risk depends on multiple factors: street lighting (detection), proximity to highways (movement corridors), building density (cover). A house buyer balances location convenience against safety — exactly as a nesting turtle does.',
      storyConnection: 'The turtle in our story did not choose the first sandy spot she found. She surveyed the area, tested the soil, checked the surroundings. That careful selection process is predation risk assessment — she is building a mental risk map and choosing the safest viable site.',
      checkQuestion: 'A turtle nest is 50m from the forest edge and 200m from a river. A second site is 200m from the forest edge and 50m from the river. Which has lower predation risk and why?',
      checkAnswer: 'The site 200m from the forest edge likely has lower predation risk. Most nest predators are forest-associated (monitor lizards, crows, mammals) and their density drops rapidly with distance from forest. The river may attract some predators (crocodiles, herons) but these are less important for nest predation in most ecosystems. However, the river-close site may have higher flood risk — demonstrating that each location involves multiple trade-offs.',
      codeIntro: 'Build a predation risk surface by combining habitat, predator movement, and detection layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_forest_map(size=100):
    """Generate a binary forest/open map."""
    forest = np.zeros((size, size))
    # Forest patches
    for _ in range(5):
        cx, cy = np.random.randint(10, size-10, 2)
        r = np.random.randint(10, 25)
        Y, X = np.ogrid[:size, :size]
        mask = (X - cx)**2 + (Y - cy)**2 < r**2
        forest[mask] = 1
    return forest

def distance_from_edge(forest_map):
    """Compute distance to nearest forest edge for each cell."""
    from scipy.ndimage import distance_transform_edt
    # Use simple iterative approach (no scipy needed)
    size = forest_map.shape[0]
    edge = np.zeros_like(forest_map)
    for i in range(1, size-1):
        for j in range(1, size-1):
            neighborhood = forest_map[max(0,i-1):i+2, max(0,j-1):j+2]
            if forest_map[i,j] != neighborhood.mean():
                edge[i,j] = 1

    # Distance transform (simplified)
    dist = np.full_like(forest_map, 999.0)
    edge_points = np.argwhere(edge > 0)
    for i in range(size):
        for j in range(size):
            if len(edge_points) > 0:
                dists = np.sqrt((edge_points[:, 0] - i)**2 + (edge_points[:, 1] - j)**2)
                dist[i, j] = dists.min()
    return dist

def predation_risk_surface(size, forest, elevation):
    """Compute predation risk at each cell."""
    # Component 1: Distance from forest edge (closer = higher risk)
    # Simplified distance calculation
    edge_dist = np.zeros((size, size))
    for i in range(size):
        for j in range(size):
            # Check distance to nearest forest/non-forest boundary
            min_d = size
            for di in range(-20, 21, 2):
                for dj in range(-20, 21, 2):
                    ni, nj = i + di, j + dj
                    if 0 <= ni < size and 0 <= nj < size:
                        if forest[ni, nj] != forest[i, j]:
                            d = np.sqrt(di**2 + dj**2)
                            min_d = min(min_d, d)
            edge_dist[i, j] = min_d

    # Risk components
    edge_risk = np.exp(-edge_dist / 8)  # decay with distance from edge
    forest_risk = forest * 0.3  # inside forest has moderate base risk
    elevation_risk = np.exp(-elevation / 1000)  # lower elevations have more predators

    # Predator trail network (random paths)
    trail_risk = np.zeros((size, size))
    for _ in range(3):
        x, y = np.random.randint(0, size), 0
        for step in range(size * 2):
            if 0 <= x < size and 0 <= y < size:
                for dx in range(-2, 3):
                    for dy in range(-2, 3):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < size and 0 <= ny < size:
                            trail_risk[nx, ny] += 0.1 * np.exp(-(dx**2 + dy**2) / 2)
            x += np.random.choice([-1, 0, 1])
            y += 1

    # Combine
    risk = 0.4 * edge_risk + 0.2 * forest_risk + 0.2 * elevation_risk + 0.2 * np.clip(trail_risk, 0, 1)
    return np.clip(risk, 0, 1), edge_risk, trail_risk

# Generate landscape
size = 80  # smaller for speed
forest = generate_forest_map(size)
elevation = np.zeros((size, size))
x = np.linspace(-3, 3, size)
y = np.linspace(-3, 3, size)
X, Y = np.meshgrid(x, y)
elevation = 1500 * np.exp(-(X**2 + Y**2) / 2) + 100

risk, edge_risk, trail_risk = predation_risk_surface(size, forest, elevation)

# Vegetation concealment
concealment = 1 - forest * 0.5 - np.random.uniform(0, 0.3, (size, size))
concealment = np.clip(concealment, 0.1, 1.0)

# Effective risk = raw risk * (1 - concealment)
effective_risk = risk * (1 - concealment * 0.5)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Forest map
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(forest, cmap='Greens', origin='lower')
ax.set_title('Forest cover', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Edge distance risk
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(edge_risk, cmap='YlOrRd', origin='lower', vmin=0, vmax=1)
ax.set_title('Edge proximity risk', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 3: Trail network risk
ax = axes[0, 2]
ax.set_facecolor('#111827')
im = ax.imshow(np.clip(trail_risk, 0, 1), cmap='YlOrRd', origin='lower')
ax.set_title('Predator trail risk', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 4: Combined predation risk
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(risk, cmap='RdYlGn_r', origin='lower', vmin=0, vmax=1)
ax.contour(forest, levels=[0.5], colors='white', linewidths=1)
ax.set_title('Combined predation risk', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 5: Concealment map
ax = axes[1, 1]
ax.set_facecolor('#111827')
im = ax.imshow(concealment, cmap='YlGn', origin='lower', vmin=0, vmax=1)
ax.set_title('Vegetation concealment', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 6: Effective risk (after concealment)
ax = axes[1, 2]
ax.set_facecolor('#111827')
im = ax.imshow(effective_risk, cmap='RdYlGn_r', origin='lower', vmin=0, vmax=1)
ax.contour(forest, levels=[0.5], colors='white', linewidths=1)
ax.set_title('Effective risk (risk × exposure)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

plt.tight_layout()
plt.show()

mean_risk = risk.mean()
safe_cells = (risk < 0.3).sum()
print(f"Predation risk analysis:")
print(f"  Grid: {size}x{size}")
print(f"  Forest cover: {forest.mean()*100:.0f}%")
print(f"  Mean risk: {mean_risk:.3f}")
print(f"  Safe cells (risk < 0.3): {safe_cells} ({safe_cells/(size*size)*100:.0f}%)")
print(f"  Most dangerous: forest edges within 5 cells of boundary")`,
      challenge: 'Add temporal variation: nocturnal predators (raccoons) vs. diurnal predators (crows). Generate separate risk maps for day and night. How does the optimal nesting time change when nocturnal predation dominates?',
      successHint: 'Spatial risk modeling is used in wildlife management, urban planning, epidemiology, and military strategy. The same principles of combining multiple risk layers into a composite risk surface apply across all these domains.',
    },
    {
      title: 'Capstone Part 4: Multi-criteria site scoring — integrating temperature, risk, and accessibility',
      concept: `With terrain data (Part 1), thermal predictions (Part 2), and predation risk (Part 3), we can now build the integrated nest site scoring algorithm. Each candidate site receives a composite score based on multiple weighted criteria:

**Score(x,y) = w_temp * TempScore + w_risk * SafetyScore + w_slope * SlopeScore + w_soil * SoilScore + w_access * AccessScore**

Where:
- **TempScore**: how close the predicted nest temperature is to the pivotal temperature (29°C). Scored as exp(-((T - Tp) / sigma)^2), a Gaussian penalty for deviation.
- **SafetyScore**: 1 - predation_risk. Lower risk = higher score.
- **SlopeScore**: penalty for too steep (eggs roll) or too flat (flooding). Optimal around 5-15 degrees.
- **SoilScore**: sandy, well-drained soil scores highest. Saturated or rocky soil scores low.
- **AccessScore**: can the turtle physically reach this site? Based on travel cost from starting position.

The weights can be adjusted for different conservation objectives: maximize population growth (weight temperature heavily for balanced sex ratio), minimize nest failure (weight safety heavily), or balance all factors.

The algorithm produces a ranked map of candidate sites, which conservation managers can use to predict natural nest locations or choose sites for assisted nesting programs.`,
      analogy: 'The scoring algorithm is like a real estate evaluation. A perfect house (temperature) in a dangerous neighborhood (predation) is not worth much. A safe neighborhood with no houses is useless. The best value is the site that scores well across all criteria — and different buyers (conservation goals) weight the criteria differently.',
      storyConnection: 'The turtle has been doing this multi-criteria evaluation her entire climb. Every spot she passed and rejected had something wrong: too steep, too exposed, wrong soil, too far from water. The site she finally chooses is the one that passes all her filters — the computational optimum of her innate scoring algorithm.',
      checkQuestion: 'A site scores 0.9 on temperature, 0.2 on safety, and 0.8 on soil. Another scores 0.6 on all three. With equal weights, which scores higher? Which would you recommend and why?',
      checkAnswer: 'Site 1: (0.9 + 0.2 + 0.8)/3 = 0.63. Site 2: (0.6 + 0.6 + 0.6)/3 = 0.60. Site 1 scores slightly higher by the linear model. But the 0.2 safety score is dangerous — there is a 70%+ chance of nest predation. A multiplicative model gives Site 1: (0.9 * 0.2 * 0.8)^(1/3) = 0.53 vs Site 2: 0.6. Under the multiplicative model, Site 2 wins because its consistent quality beats Site 1\'s Achilles heel. This demonstrates why the choice of scoring method matters enormously.',
      codeIntro: 'Build the integrated nest site scorer combining all environmental layers with configurable weights.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate all environmental layers
size = 80
x = np.linspace(-3, 3, size)
y = np.linspace(-3, 3, size)
X, Y = np.meshgrid(x, y)

# Elevation
elevation = 1500 * np.exp(-(X**2 + Y**2) / 2) + 100 + np.random.normal(0, 20, (size, size))

# Temperature from elevation + aspect
dy, dx = np.gradient(elevation, 60)
slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
aspect = np.degrees(np.arctan2(-dx, -dy)) % 360
temperature = 32 - elevation * 6.5/1000 + 3 * np.cos(np.radians(aspect - 180))

# Predation risk (simplified)
forest = np.zeros((size, size))
for _ in range(4):
    cx, cy = np.random.randint(15, size-15, 2)
    r = np.random.randint(8, 20)
    mask = (np.arange(size)[:, None] - cy)**2 + (np.arange(size)[None, :] - cx)**2 < r**2
    forest[mask] = 1
pred_risk = 0.3 + 0.4 * forest + np.random.uniform(0, 0.2, (size, size))
pred_risk = np.clip(pred_risk, 0, 1)

# Soil quality (sand fraction: 0=clay, 1=sand)
soil_sand = 0.5 + 0.3 * np.sin(X * 2) * np.cos(Y * 1.5) + np.random.normal(0, 0.1, (size, size))
soil_sand = np.clip(soil_sand, 0, 1)

# Soil moisture
soil_moisture = 0.4 - 0.01 * slope + 0.2 * (1 - soil_sand) + np.random.normal(0, 0.05, (size, size))
soil_moisture = np.clip(soil_moisture, 0, 1)

# Scoring functions
def temp_score(T, Tp=29.0, sigma=2.0):
    """Gaussian penalty for deviation from pivotal temperature."""
    return np.exp(-((T - Tp) / sigma)**2)

def slope_score(s, optimal_min=5, optimal_max=15):
    """Optimal slope range for nesting."""
    score = np.ones_like(s)
    too_flat = s < optimal_min
    too_steep = s > optimal_max
    score[too_flat] = s[too_flat] / optimal_min
    score[too_steep] = np.exp(-(s[too_steep] - optimal_max) / 10)
    return score

def soil_score(sand_fraction, moisture):
    """Sandy, well-drained soil is best."""
    sand_s = sand_fraction  # more sand = better
    drain_s = 1 - np.clip(moisture, 0, 0.8)  # lower moisture = better
    return 0.6 * sand_s + 0.4 * drain_s

def access_score(elevation, slope, start_pos=(size//2, size-1)):
    """Accessibility from starting position (cost of travel)."""
    # Simple: cost increases with distance and slope
    si, sj = start_pos
    Y_idx, X_idx = np.mgrid[:size, :size]
    distance = np.sqrt((Y_idx - si)**2 + (X_idx - sj)**2)
    cost = distance + slope * 0.5 + np.maximum(0, elevation - 500) * 0.01
    max_cost = cost.max()
    return 1 - cost / max_cost

def composite_score(weights, T, risk, slp, sand, moist, elev):
    """Weighted composite nest site score."""
    t_s = temp_score(T)
    safe_s = 1 - risk
    slp_s = slope_score(slp)
    soil_s = soil_score(sand, moist)
    acc_s = access_score(elev, slp)

    scores = {
        'Temperature': t_s,
        'Safety': safe_s,
        'Slope': slp_s,
        'Soil': soil_s,
        'Access': acc_s,
    }

    # Weighted sum
    w = weights
    total = (w[0]*t_s + w[1]*safe_s + w[2]*slp_s + w[3]*soil_s + w[4]*acc_s) / sum(w)

    # Also compute multiplicative
    mult = (t_s**w[0] * safe_s**w[1] * slp_s**w[2] * soil_s**w[3] * acc_s**w[4]) ** (1/sum(w))

    return total, mult, scores

# Default weights: [temp, safety, slope, soil, access]
default_w = [0.35, 0.25, 0.15, 0.15, 0.10]
linear_score, mult_score, component_scores = composite_score(
    default_w, temperature, pred_risk, slope, soil_sand, soil_moisture, elevation)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Temperature score
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(component_scores['Temperature'], cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
ax.set_title('Temperature score', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 2: Safety score
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(component_scores['Safety'], cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
ax.contour(forest, levels=[0.5], colors='red', linewidths=1)
ax.set_title('Safety score (1-predation)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 3: Soil score
ax = axes[0, 2]
ax.set_facecolor('#111827')
im = ax.imshow(component_scores['Soil'], cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
ax.set_title('Soil score', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 4: Linear composite score
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(linear_score, cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
# Mark top 10 sites
flat_idx = np.argsort(linear_score.ravel())[-10:]
top_y, top_x = np.unravel_index(flat_idx, linear_score.shape)
ax.scatter(top_x, top_y, s=50, c='#ef4444', marker='*', zorder=5)
ax.set_title('Linear composite (stars=top 10)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 5: Multiplicative score
ax = axes[1, 1]
ax.set_facecolor('#111827')
im = ax.imshow(mult_score, cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
flat_idx_m = np.argsort(mult_score.ravel())[-10:]
top_ym, top_xm = np.unravel_index(flat_idx_m, mult_score.shape)
ax.scatter(top_xm, top_ym, s=50, c='#3b82f6', marker='*', zorder=5)
ax.set_title('Multiplicative composite (stars=top 10)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 6: Compare top sites
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Show component breakdown for best linear vs best mult site
best_lin_idx = np.unravel_index(linear_score.argmax(), linear_score.shape)
best_mul_idx = np.unravel_index(mult_score.argmax(), mult_score.shape)
comp_names = list(component_scores.keys())
lin_vals = [component_scores[c][best_lin_idx] for c in comp_names]
mul_vals = [component_scores[c][best_mul_idx] for c in comp_names]
x_pos = np.arange(len(comp_names))
ax.bar(x_pos - 0.2, lin_vals, 0.35, color='#ef4444', label='Best linear')
ax.bar(x_pos + 0.2, mul_vals, 0.35, color='#3b82f6', label='Best multiplicative')
ax.set_xticks(x_pos)
ax.set_xticklabels([c[:5] for c in comp_names], color='white', fontsize=8)
ax.set_ylabel('Component score', color='white')
ax.set_title('Best site comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

best_lin = linear_score.max()
best_mul = mult_score.max()
print(f"Nest Site Scoring Results:")
print(f"  Best linear score: {best_lin:.3f} at {best_lin_idx}")
print(f"  Best multiplicative score: {best_mul:.3f} at {best_mul_idx}")
print(f"  Top linear site components: {dict(zip(comp_names, [f'{v:.2f}' for v in lin_vals]))}")
print(f"  Top mult site components: {dict(zip(comp_names, [f'{v:.2f}' for v in mul_vals]))}")
print(f"  Multiplicative penalizes weak dimensions more -> safer overall choices")`,
      challenge: 'Implement a Pareto frontier analysis: find all sites that are not dominated (beaten on every criterion by another site). How many Pareto-optimal sites exist? Show them on the map.',
      successHint: 'Multi-criteria spatial analysis is the backbone of land-use planning, habitat conservation, and environmental impact assessment. The scoring framework you built here is used by real conservation GIS analysts to prioritize protection areas.',
    },
    {
      title: 'Capstone Part 5: Climate change scenarios — future nest site viability',
      concept: `The nest site selector must work not just for today but for the coming decades. Climate change alters the temperature map, shifts predator ranges, changes vegetation cover, and modifies soil moisture patterns. A site optimal today may be non-viable in 30 years.

To project future viability, we run the scorer under multiple climate scenarios:
1. **RCP 2.6** (optimistic): +1°C by 2050, warming slows
2. **RCP 4.5** (moderate): +1.8°C by 2050, continued warming
3. **RCP 8.5** (pessimistic): +3.5°C by 2050, accelerating warming

For each scenario, we adjust:
- Temperature: add warming increment
- Predator ranges: shift upslope as species track isotherms
- Vegetation: treeline shifts upward, changing forest cover
- Soil moisture: altered rainfall patterns

The critical output is a **temporal viability map**: which sites remain viable across all scenarios and decades? These **climate-resilient** sites are the highest conservation priority — they will function as nesting habitat regardless of which emissions path we follow.`,
      analogy: 'Climate scenario planning is like testing a building design against different earthquake intensities. You do not just check if it survives a small quake — you test it against moderate and severe ones too. Sites that survive all scenarios are the equivalent of earthquake-proof buildings: climate-proof habitat.',
      storyConnection: 'The mountain the turtle climbs today may be her grandchildren\'s lowland in a warming world. As temperatures shift upslope, nesting habitat migrates too. The mountain that seems like an unusual choice today may be the only viable option in a century — the turtle\'s instinct is building climate resilience.',
      checkQuestion: 'Under 3°C warming, a low-elevation nest site that currently produces 55% females would produce approximately what ratio?',
      checkAnswer: 'Using the TSD sigmoid with Tp=29°C and k=1.5, if the current temperature is about 29.3°C (giving 55% female), adding 3°C brings it to 32.3°C. P(female) = 1/(1+exp(-1.5*(32.3-29))) = 1/(1+exp(-4.95)) = 99.3%. The site would produce almost exclusively females — functionally useless for balanced population growth. This is why climate projections are essential for conservation planning.',
      codeIntro: 'Project nest site viability under climate change scenarios and identify climate-resilient sites.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Recreate base landscape
size = 80
x = np.linspace(-3, 3, size)
y = np.linspace(-3, 3, size)
X, Y = np.meshgrid(x, y)
elevation = 1500 * np.exp(-(X**2 + Y**2) / 2) + 100 + np.random.normal(0, 20, (size, size))
dy, dx = np.gradient(elevation, 60)
slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
aspect = np.degrees(np.arctan2(-dx, -dy)) % 360

# Base temperature
base_temp = 32 - elevation * 6.5/1000 + 3 * np.cos(np.radians(aspect - 180))

# Climate scenarios: warming by decade
decades = np.arange(2025, 2105, 10)
scenarios = {
    'RCP 2.6': 0.12 * (decades - 2025) / 10 * np.exp(-0.02 * (decades - 2025)),
    'RCP 4.5': 0.22 * (decades - 2025) / 10,
    'RCP 8.5': 0.15 * (decades - 2025) / 10 + 0.01 * ((decades - 2025) / 10)**2,
}
# Normalize to realistic totals
scenarios['RCP 2.6'] = np.cumsum(np.full(len(decades), 0.12))
scenarios['RCP 4.5'] = np.cumsum(np.full(len(decades), 0.22))
scenarios['RCP 8.5'] = 0.35 * (decades - 2025) / 10 + 0.015 * ((decades - 2025)/10)**2

def sex_ratio(T, Tp=29.0, k=1.5):
    return 1 / (1 + np.exp(-k * (T - Tp)))

def viability_score(temperature, slope, pred_risk=0.3):
    """Simple viability: good temp + acceptable slope + low risk."""
    t_score = np.exp(-((temperature - 29) / 2)**2)
    s_score = np.where((slope > 3) & (slope < 20), 1.0, 0.3)
    return t_score * s_score * (1 - pred_risk)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
scenario_colors = {'RCP 2.6': '#22c55e', 'RCP 4.5': '#f59e0b', 'RCP 8.5': '#ef4444'}

# Plot 1: Warming trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, warming in scenarios.items():
    ax.plot(decades, warming, color=scenario_colors[name], linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Warming (°C)', color='white')
ax.set_title('Climate warming scenarios', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Viable area over time (% of grid with good sex ratio)
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, warming in scenarios.items():
    viable_pct = []
    for w in warming:
        T_future = base_temp + w
        sr = sex_ratio(T_future)
        # "Viable" = sex ratio between 30% and 70% female
        viable = ((sr > 0.3) & (sr < 0.7)).mean() * 100
        viable_pct.append(viable)
    ax.plot(decades, viable_pct, color=scenario_colors[name], linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('% viable area (30-70% female)', color='white')
ax.set_title('Viable nesting area shrinks', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Mean sex ratio over time
ax = axes[0, 2]
ax.set_facecolor('#111827')
for name, warming in scenarios.items():
    mean_sr = [sex_ratio(base_temp + w).mean() * 100 for w in warming]
    ax.plot(decades, mean_sr, color=scenario_colors[name], linewidth=2, label=name)
ax.axhline(50, color='gray', linewidth=1, linestyle='--')
ax.axhline(90, color='#ef4444', linewidth=1, linestyle=':', label='Critical feminization')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mean % female', color='white')
ax.set_title('Population feminization', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4-6: Viability maps at 2025, 2055, 2085 (RCP 4.5)
for idx, (year_idx, year) in enumerate([(0, 2025), (3, 2055), (6, 2085)]):
    ax = axes[1, idx]
    ax.set_facecolor('#111827')
    w = scenarios['RCP 4.5'][year_idx]
    T_future = base_temp + w
    v_score = viability_score(T_future, slope)
    im = ax.imshow(v_score, cmap='RdYlGn', origin='lower', vmin=0, vmax=1)

    # Mark viable zones
    viable_mask = v_score > 0.5
    contour_data = viable_mask.astype(float)
    ax.contour(contour_data, levels=[0.5], colors='white', linewidths=1)

    # Elevation contours
    ax.contour(elevation, levels=[500, 1000, 1500], colors='gray', linewidths=0.5, linestyles='--')

    viable_pct = viable_mask.mean() * 100
    ax.set_title(f'{year} RCP4.5 (+{w:.1f}°C) — {viable_pct:.0f}% viable', color='white', fontsize=10)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Climate resilience analysis
print("Climate Resilience Analysis:")
print(f"{'Year':<8}", end='')
for name in scenarios: print(f"{name:>12}", end='')
print()
for i, year in enumerate(decades):
    print(f"{year:<8}", end='')
    for name, warming in scenarios.items():
        T = base_temp + warming[i]
        viable = ((sex_ratio(T) > 0.3) & (sex_ratio(T) < 0.7)).mean() * 100
        print(f"{viable:>11.0f}%", end='')
    print()

# Find climate-resilient sites (viable under ALL scenarios at 2085)
resilient = np.ones((size, size), dtype=bool)
for name, warming in scenarios.items():
    T_2085 = base_temp + warming[6]
    sr = sex_ratio(T_2085)
    resilient &= (sr > 0.3) & (sr < 0.7) & (slope > 3) & (slope < 20)
print(f"\\nClimate-resilient sites (viable under ALL scenarios in 2085):")
print(f"  {resilient.sum()} cells ({resilient.sum()/(size*size)*100:.1f}% of landscape)")
if resilient.sum() > 0:
    resilient_elevations = elevation[resilient]
    print(f"  Elevation range: {resilient_elevations.min():.0f} - {resilient_elevations.max():.0f} m")`,
      challenge: 'Add an "assisted migration" module: if viable area drops below a threshold, identify new suitable areas at higher elevation that could be prepared as nesting habitat. Estimate the cost of site preparation (clearing, soil amendment) for each candidate.',
      successHint: 'Climate adaptation planning for wildlife is one of the most urgent applications of computational ecology. The tools you built here — scenario analysis, viability projection, resilience mapping — are used by conservation agencies worldwide to prioritize habitat protection under uncertainty.',
    },
    {
      title: 'Capstone Part 6: Complete Nest Site Selector — interactive parameter exploration',
      concept: `The final module integrates all five previous components into a complete, configurable Nest Site Selector. The user can adjust:

1. Species parameters: pivotal temperature, nest depth preference, mobility
2. Landscape parameters: mountain height, forest cover, soil types
3. Climate scenario: warming rate, time horizon
4. Conservation weights: how much to prioritize temperature vs. safety vs. accessibility
5. Management options: shade structures, predator control, assisted nesting

The system outputs:
- A ranked list of optimal nest sites with scores and component breakdowns
- A viability timeline showing how many sites remain viable over decades
- Conservation recommendations: which interventions would have the greatest impact
- Sensitivity analysis: which parameters most affect the outcome

This is a complete decision support tool — the kind of system that real conservation managers need when planning turtle nesting habitat management. It translates complex ecological modeling into actionable recommendations.`,
      analogy: 'The complete system is like a GPS navigation app for conservation. It takes your destination (population viability), considers the terrain (landscape data), checks traffic conditions (climate scenarios), and recommends the best route (management actions). Different settings give different routes — the system helps you explore the trade-offs.',
      storyConnection: 'The turtle in our story completes her climb and chooses a nest site. Our simulator can now tell us whether her choice was optimal — and whether her grandchildren will have any viable sites left on this mountain. The story of one turtle connects to the fate of an entire population through computational ecology.',
      checkQuestion: 'If budget allows only ONE intervention — shade structures at low-elevation sites OR predator fencing at high-elevation sites — which would you recommend under RCP 4.5, and what analysis would you run to decide?',
      checkAnswer: 'Run the simulator twice: once with shade structures reducing low-elevation temperature by 2-3°C, once with predator fencing reducing high-elevation predation risk to near zero. Compare the total viable area and projected sex ratios under each intervention at 2050 and 2080. The answer likely depends on the timeline: shade structures may be more effective short-term (buying time at existing sites), while predator fencing at high elevation invests in future viability as warming pushes nesting upslope. The simulator quantifies this trade-off precisely.',
      codeIntro: 'Build the complete Nest Site Selector with configurable parameters and generate conservation recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class NestSiteSelector:
    """Complete nest site selection and viability tool."""

    def __init__(self, grid_size=80, peak_height=1800, base_temp=32):
        self.size = grid_size
        self.peak = peak_height
        self.base_temp = base_temp
        self._build_landscape()

    def _build_landscape(self):
        s = self.size
        x = np.linspace(-3, 3, s)
        y = np.linspace(-3, 3, s)
        X, Y = np.meshgrid(x, y)

        self.elevation = self.peak * np.exp(-(X**2+Y**2)/2) + 100 + np.random.normal(0, 25, (s, s))
        self.elevation = np.maximum(self.elevation, 50)

        dy, dx = np.gradient(self.elevation, 60)
        self.slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
        self.aspect = np.degrees(np.arctan2(-dx, -dy)) % 360

        self.temperature = self.base_temp - self.elevation*6.5/1000 + 3*np.cos(np.radians(self.aspect-180))

        self.forest = np.zeros((s, s))
        for _ in range(4):
            cx, cy = np.random.randint(10, s-10, 2)
            r = np.random.randint(8, 18)
            mask = (np.arange(s)[:,None]-cy)**2 + (np.arange(s)[None,:]-cx)**2 < r**2
            self.forest[mask] = 1

        self.pred_risk = 0.25 + 0.4*self.forest + np.random.uniform(0, 0.15, (s, s))
        self.pred_risk = np.clip(self.pred_risk, 0.05, 0.95)

        self.soil_quality = 0.5 + 0.3*np.sin(np.linspace(0,6,s)[:,None]) + np.random.normal(0, 0.1, (s, s))
        self.soil_quality = np.clip(self.soil_quality, 0.1, 1.0)

    def score_sites(self, Tp=29.0, weights=None, warming=0, shade_cooling=0, pred_reduction=0):
        """Score all sites under given conditions."""
        if weights is None:
            weights = [0.35, 0.25, 0.15, 0.15, 0.10]

        T = self.temperature + warming - shade_cooling
        risk = np.clip(self.pred_risk - pred_reduction, 0, 1)

        scores = {
            'Temperature': np.exp(-((T - Tp)/2)**2),
            'Safety': 1 - risk,
            'Slope': np.where((self.slope > 3) & (self.slope < 20), 1.0,
                             np.where(self.slope < 3, self.slope/3, np.exp(-(self.slope-20)/10))),
            'Soil': self.soil_quality,
            'Access': 1 - np.clip(self.elevation / self.peak, 0, 1) * 0.5,
        }

        w = np.array(weights)
        w = w / w.sum()
        composite = sum(w[i] * list(scores.values())[i] for i in range(5))

        sex_ratio = 1 / (1 + np.exp(-1.5 * (T - Tp)))

        return composite, scores, sex_ratio, T

    def find_top_sites(self, composite, n=10):
        """Find top n sites."""
        flat = composite.ravel()
        top_idx = np.argsort(flat)[-n:][::-1]
        sites = []
        for idx in top_idx:
            r, c = np.unravel_index(idx, composite.shape)
            sites.append({'row': r, 'col': c, 'score': flat[idx],
                         'elevation': self.elevation[r, c],
                         'temperature': self.temperature[r, c]})
        return sites

    def viability_projection(self, warming_rates, decades, Tp=29.0):
        """Project viable area over time for multiple warming scenarios."""
        results = {}
        for name, rate in warming_rates.items():
            viable_history = []
            sr_history = []
            for d in decades:
                w = rate * (d - decades[0]) / 10
                _, _, sr, _ = self.score_sites(Tp=Tp, warming=w)
                viable = ((sr > 0.3) & (sr < 0.7)).mean() * 100
                viable_history.append(viable)
                sr_history.append(sr.mean() * 100)
            results[name] = {'viable': viable_history, 'sex_ratio': sr_history}
        return results

# Build selector
nss = NestSiteSelector()

# Run base analysis
composite, scores, sex_ratio, temp = nss.score_sites()
top_sites = nss.find_top_sites(composite)

# Run interventions
comp_shade, _, sr_shade, _ = nss.score_sites(shade_cooling=2.0)
comp_fence, _, sr_fence, _ = nss.score_sites(pred_reduction=0.3)
comp_both, _, sr_both, _ = nss.score_sites(shade_cooling=2.0, pred_reduction=0.3)

# Viability projection
decades = np.arange(2025, 2105, 10)
warmings = {'Low (+0.12/dec)': 0.12, 'Medium (+0.22/dec)': 0.22, 'High (+0.35/dec)': 0.35}
projections = nss.viability_projection(warmings, decades)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Composite score map
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(composite, cmap='RdYlGn', origin='lower', vmin=0, vmax=1)
for site in top_sites[:5]:
    ax.plot(site['col'], site['row'], '*', color='#ef4444', markersize=12)
ax.contour(nss.elevation, levels=[500, 1000, 1500], colors='gray', linewidths=0.5, linestyles='--')
ax.set_title(f'Nest site scores (top 5 starred)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 2: Sex ratio map
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(sex_ratio * 100, cmap='RdYlBu_r', origin='lower', vmin=20, vmax=80)
ax.contour(sex_ratio, levels=[0.3, 0.5, 0.7], colors=['#3b82f6', 'white', '#ef4444'], linewidths=2)
ax.set_title('Sex ratio (% female)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='% Female')

# Plot 3: Intervention comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
interventions = ['None', 'Shade\n(-2°C)', 'Fence\n(-0.3 risk)', 'Both']
comps = [composite, comp_shade, comp_fence, comp_both]
viable_areas = [((sr > 0.3) & (sr < 0.7)).mean()*100 for sr in [sex_ratio, sr_shade, sr_fence, sr_both]]
mean_scores = [c.mean() for c in comps]
x_pos = np.arange(4)
bars = ax.bar(x_pos, viable_areas, color=['#94a3b8', '#22c55e', '#3b82f6', '#a855f7'], width=0.6)
for bar, v in zip(bars, viable_areas):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{v:.0f}%', ha='center', color='white', fontweight='bold', fontsize=9)
ax.set_xticks(x_pos)
ax.set_xticklabels(interventions, color='white', fontsize=8)
ax.set_ylabel('% Viable area', color='white')
ax.set_title('Intervention impact', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Viability projection
ax = axes[1, 0]
ax.set_facecolor('#111827')
proj_colors = ['#22c55e', '#f59e0b', '#ef4444']
for (name, proj), clr in zip(projections.items(), proj_colors):
    ax.plot(decades, proj['viable'], color=clr, linewidth=2, label=name)
ax.axhline(10, color='#ef4444', linewidth=1, linestyle=':', label='Critical minimum')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('% Viable area', color='white')
ax.set_title('Long-term viability', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Top site profiles
ax = axes[1, 1]
ax.set_facecolor('#111827')
comp_names = list(scores.keys())
for i, site in enumerate(top_sites[:3]):
    vals = [scores[c][site['row'], site['col']] for c in comp_names]
    ax.plot(comp_names, vals, 'o-', linewidth=2, markersize=6,
            label=f'#{i+1} ({site["elevation"]:.0f}m, {site["score"]:.2f})')
ax.set_ylabel('Component score', color='white')
ax.set_title('Top 3 site profiles', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xticklabels(comp_names, rotation=15, fontsize=8, color='white')

# Plot 6: Sensitivity analysis
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Vary each weight and see effect on top site score
base_score = composite.max()
sensitivities = []
w_names = ['Temp', 'Safety', 'Slope', 'Soil', 'Access']
for i in range(5):
    w_high = [0.35, 0.25, 0.15, 0.15, 0.10]
    w_high[i] *= 2
    c_high, _, _, _ = nss.score_sites(weights=w_high)
    w_low = [0.35, 0.25, 0.15, 0.15, 0.10]
    w_low[i] *= 0.5
    c_low, _, _, _ = nss.score_sites(weights=w_low)
    sensitivities.append(c_high.max() - c_low.max())

bars = ax.barh(w_names, sensitivities,
               color=['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#94a3b8'], height=0.5)
ax.set_xlabel('Score change (2x vs 0.5x weight)', color='white')
ax.set_title('Weight sensitivity analysis', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=== NEST SITE SELECTOR: COMPLETE ANALYSIS ===")
print(f"\\nTop 5 recommended sites:")
for i, s in enumerate(top_sites[:5]):
    print(f"  #{i+1}: Score={s['score']:.3f}, Elev={s['elevation']:.0f}m, Temp={s['temperature']:.1f}°C")
print(f"\\nIntervention analysis:")
for name, va in zip(interventions, viable_areas):
    print(f"  {name.replace(chr(10),' ')}: {va:.0f}% viable area")
print(f"\\nConservation recommendations:")
best_intervention = ['None', 'Shade', 'Fence', 'Both'][np.argmax(viable_areas)]
print(f"  Best single intervention: {best_intervention}")
print(f"  Most weight-sensitive factor: {w_names[np.argmax(np.abs(sensitivities))]}")
most_sens = w_names[np.argmax(np.abs(sensitivities))]
print(f"  -> Invest in accurate {most_sens.lower()} data for best predictions")`,
      challenge: 'Add an economic module: each intervention has a cost per hectare. Given a fixed budget, find the optimal combination of shade structures and predator fencing that maximizes viable area. This is a constrained optimization problem.',
      successHint: 'You have built a complete conservation decision support tool. This is not a toy — it is a simplified version of real systems used by the IUCN, WWF, and national wildlife agencies to plan habitat management. The skills you developed — spatial modeling, scenario analysis, multi-criteria optimization — are directly applicable to professional conservation work.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Nest Site Selector
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete nest site selection tool using temperature modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a full nest site selection tool. Python with numpy and matplotlib required.</p>
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
