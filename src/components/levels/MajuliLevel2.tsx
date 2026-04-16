import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MajuliLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Topographic maps — reading elevation data',
      concept: `A topographic map represents the three-dimensional shape of the land on a flat surface using **contour lines** — lines that connect points of equal elevation. Understanding topographic maps is essential for studying Majuli, because the island's elevation profile reveals why certain areas flood first and which zones are most vulnerable to erosion.

Key principles of contour lines:
- **Closely spaced lines** indicate steep terrain (the elevation changes rapidly over a short distance)
- **Widely spaced lines** indicate gentle slopes or flat terrain
- **Closed loops** indicate hilltops or depressions (depressions are marked with tick marks pointing inward)
- **V-shapes pointing upstream** indicate river valleys

Majuli's topographic profile is remarkably flat — most of the island sits only 2-5 meters above the average river level. This is why even a small rise in the Brahmaputra's water level can inundate vast areas. The highest points (old natural levees along former river channels) are where settlements concentrate.

Topographic data today comes primarily from satellite-based systems like **SRTM** (Shuttle Radar Topography Mission) and **LiDAR** (Light Detection and Ranging), which can measure elevation to centimeter precision.`,
      analogy: 'Contour lines on a map are like the rings inside a tree stump — each ring represents a different level. If you filled a bathtub shaped like a landscape, each water level would trace one contour line. Drain it slowly, and you would see the contour map appear on the surface, ring by ring.',
      storyConnection: 'Majuli\'s flatness is both its beauty and its vulnerability. The island is a vast, low-lying plain barely above the river — a topographic map reveals just how precarious this position is. Every centimeter of elevation matters when the Brahmaputra rises 5 meters during monsoon.',
      checkQuestion: 'On a topographic map of Majuli, contour lines are spaced 1 meter apart. If you see lines at 85m, 86m, 87m, 88m packed within 50 meters of horizontal distance on the southern bank, but only 85m and 86m lines spread over 500 meters on the island\'s interior — what does this tell you about the terrain?',
      checkAnswer: 'The southern bank is steep (4m rise over 50m horizontal = 8% grade) — likely a cut bank actively being eroded by the river. The interior is very flat (1m rise over 500m = 0.2% grade) — typical flood-deposited terrain. The steep bank is where erosion is most active, and the flat interior is where floods spread easily.',
      codeIntro: 'Generate a synthetic topographic map of a river island and visualize it with contour lines.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate synthetic elevation data for a river island
np.random.seed(42)

# Grid
x = np.linspace(0, 20, 200)  # km
y = np.linspace(0, 10, 100)  # km
X, Y = np.meshgrid(x, y)

# Base island shape: elongated ellipse
cx, cy = 10, 5  # center
rx, ry = 7, 3.5  # radii
island_mask = ((X - cx)/rx)**2 + ((Y - cy)/ry)**2

# Elevation: highest at center, drops toward edges
# Base elevation above sea level: 85m
base_elev = 85
island_elev = base_elev + 5 * np.exp(-2 * island_mask)

# Add some natural levees (ridges along old river channels)
levee1 = 1.5 * np.exp(-((Y - 3.5)**2) / 0.3) * np.exp(-((X - 8)**2) / 8)
levee2 = 1.0 * np.exp(-((Y - 6.5)**2) / 0.3) * np.exp(-((X - 12)**2) / 10)

# Add gentle random terrain variation
noise = 0.3 * np.random.randn(*X.shape)
noise = np.convolve(noise.ravel(), np.ones(25)/25, mode='same').reshape(X.shape)

elevation = island_elev + levee1 + levee2 + noise

# River: low elevation around the island
river_level = 83
elevation = np.where(island_mask > 1.2, river_level - 2 + np.random.randn(*X.shape) * 0.3, elevation)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Filled contour map
ax1.set_facecolor('#111827')
levels = np.arange(80, 93, 0.5)
cf = ax1.contourf(X, Y, elevation, levels=levels, cmap='terrain')
cs = ax1.contour(X, Y, elevation, levels=np.arange(83, 92, 1), colors='black', linewidths=0.5, alpha=0.5)
ax1.clabel(cs, fontsize=7, fmt='%d m')

# Mark key features
ax1.plot(cx, cy, '*', color='red', markersize=12)
ax1.annotate('Highest point\
(settlement area)', xy=(cx, cy), xytext=(cx+2, cy+1.5),
             color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='white'))
ax1.annotate('Natural levee', xy=(8, 3.5), xytext=(3, 2),
             color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='white'))
ax1.annotate('Steep cut bank\
(erosion zone)', xy=(10, 1.3), xytext=(14, 1),
             color='#ef4444', fontsize=8, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

cbar = plt.colorbar(cf, ax=ax1)
cbar.set_label('Elevation (m)', color='white')
cbar.ax.tick_params(colors='gray')
ax1.set_xlabel('Distance (km)', color='white')
ax1.set_ylabel('Distance (km)', color='white')
ax1.set_title('Topographic Map of a River Island', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Cross-section (transect)
ax2.set_facecolor('#111827')
mid_idx = 50  # middle row
transect = elevation[mid_idx, :]
ax2.fill_between(x, river_level, transect, where=transect > river_level,
                 alpha=0.3, color='#22c55e', label='Island above river')
ax2.fill_between(x, 78, river_level, alpha=0.2, color='#3b82f6', label='River')
ax2.plot(x, transect, color='#22c55e', linewidth=2)
ax2.axhline(river_level, color='#3b82f6', linewidth=1, linestyle='--', label=f'River level ({river_level}m)')
ax2.axhline(river_level + 5, color='#ef4444', linewidth=1, linestyle=':', label='Monsoon flood level (+5m)')
ax2.fill_between(x, river_level, river_level + 5, where=transect < river_level + 5,
                 alpha=0.1, color='#ef4444')
ax2.set_xlim(0, 20)
ax2.set_ylim(78, 95)
ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Cross-Section Through Island Center', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Topographic analysis:")
island_elevs = elevation[island_mask < 1.0]
print(f"  Island min elevation: {island_elevs.min():.1f} m")
print(f"  Island max elevation: {island_elevs.max():.1f} m")
print(f"  Island mean elevation: {island_elevs.mean():.1f} m")
print(f"  River level: {river_level} m")
print(f"  Freeboard (mean): {island_elevs.mean() - river_level:.1f} m")
print()
print("During monsoon (+5m flood):")
flooded = np.sum(island_elevs < river_level + 5) / len(island_elevs) * 100
print(f"  {flooded:.0f}% of island would be flooded")
print("  This is why Majuli's flatness is so dangerous.")`,
      challenge: 'Modify the flood level from +5m to +3m, +4m, +5m, +6m, and +7m. For each, calculate the percentage of the island that floods. Plot flood level vs. percentage flooded. At what level does the entire island submerge?',
      successHint: 'Topographic maps are not just academic exercises — they are the foundation of flood risk assessment, land-use planning, and disaster preparedness. For Majuli, every meter of elevation is the difference between dry ground and submerged farmland.',
    },
    {
      title: 'River flow calculations — discharge = area x velocity',
      concept: `The fundamental equation of river hydrology is deceptively simple:

**Q = A x V**

Where:
- **Q** = discharge (volume of water per second, m³/s)
- **A** = cross-sectional area of the channel (m²)
- **V** = average flow velocity (m/s)

This equation — the **continuity equation** — tells us that the same volume of water must pass through every cross-section of the river per unit time. If the channel narrows, velocity must increase (and vice versa). This has profound consequences:

**At a constriction** (narrow point): A decreases, so V increases. Faster water = more erosion. This is why bridge pilings and rock outcrops cause local scour.

**At a wide section**: A increases, so V decreases. Slower water = more deposition. This is why river islands and bars form where channels widen.

For the Brahmaputra near Majuli:
- Dry season: width ~3 km, depth ~5 m, velocity ~1 m/s, Q = 15,000 m³/s
- Monsoon: width ~8 km, depth ~12 m, velocity ~2.5 m/s, Q = 240,000 m³/s

The monsoon discharge is **16 times** the dry season — and the velocity increase means exponentially more erosive power.`,
      analogy: 'Put your thumb over the end of a garden hose. The opening (A) gets smaller, so the water (V) shoots out faster — but the total flow (Q) doesn\'t change. Rivers work the same way: squeeze a river through a narrow gorge and it accelerates. Let it spread across a wide floodplain and it slows down.',
      storyConnection: 'Majuli exists at a point where the Brahmaputra widens and slows, dropping sediment. But during monsoon, the discharge surges so dramatically that even the wide channel cannot prevent high velocities. The continuity equation explains both Majuli\'s creation (low velocity = deposition) and its erosion (high velocity = bank collapse).',
      checkQuestion: 'A river has a rectangular cross-section 50m wide and 3m deep, flowing at 1.5 m/s. It enters a gorge that is only 20m wide. If the depth stays at 3m, what is the new velocity? What if the depth also increases to 5m in the gorge?',
      checkAnswer: 'Using Q = A x V: Original Q = 50 x 3 x 1.5 = 225 m³/s. In the gorge at 3m depth: 225 = 20 x 3 x V, so V = 3.75 m/s (2.5x faster). If depth increases to 5m: 225 = 20 x 5 x V, so V = 2.25 m/s. Deeper gorges partially offset the velocity increase by providing more cross-sectional area. This is why natural gorges are often deep — the river scours the bottom until the area is large enough to bring velocity to a sustainable level.',
      codeIntro: 'Simulate river flow through varying channel widths and calculate velocity and erosive power.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River channel profile: width varies along its length
distance = np.linspace(0, 50, 500)  # km along river

# Channel width profile (km) - narrows, widens, island splits
width = 3.0 + 2.0 * np.sin(distance / 8) + 1.0 * np.sin(distance / 3)
width = np.clip(width, 1.0, 8.0)

# Island creates a constriction at km 25-35
island_mask = np.exp(-((distance - 30)**2) / 20)
effective_width = width - 2.5 * island_mask  # island takes up space
effective_width = np.clip(effective_width, 0.8, None)

# Constant discharge (monsoon)
Q_monsoon = 50000  # m^3/s
depth = 8  # m (average, simplified)

# Velocity = Q / (width_m * depth)
velocity = Q_monsoon / (effective_width * 1000 * depth)

# Erosive power proportional to velocity^3 (stream power)
erosive_power = velocity**3
erosive_power_normalized = erosive_power / erosive_power.max() * 100

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Channel width
ax = axes[0]
ax.set_facecolor('#111827')
ax.fill_between(distance, -effective_width/2, effective_width/2, color='#3b82f6', alpha=0.3, label='Channel')
ax.fill_between(distance, -width/2, -effective_width/2, where=island_mask > 0.1,
                color='#22c55e', alpha=0.5, label='Island')
ax.fill_between(distance, effective_width/2, width/2, where=island_mask > 0.1,
                color='#22c55e', alpha=0.5)
ax.set_ylabel('Width (km)', color='white')
ax.set_title('River Channel Profile (Plan View)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Velocity
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(distance, velocity, color='#f59e0b', linewidth=2)
ax.fill_between(distance, velocity, alpha=0.15, color='#f59e0b')
ax.axhline(2.0, color='#ef4444', linestyle=':', alpha=0.5)
ax.text(2, 2.05, 'Bank erosion threshold (~2 m/s)', color='#ef4444', fontsize=8)
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title(f'Flow Velocity (Q = {Q_monsoon:,} m³/s, depth = {depth}m)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Erosive power
ax = axes[2]
ax.set_facecolor('#111827')
ax.fill_between(distance, erosive_power_normalized, color='#ef4444', alpha=0.3)
ax.plot(distance, erosive_power_normalized, color='#ef4444', linewidth=2)
ax.set_ylabel('Relative erosive power (%)', color='white')
ax.set_xlabel('Distance along river (km)', color='white')
ax.set_title('Erosive Power (∝ velocity³)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Mark the island zone
for ax in axes:
    ax.axvspan(25, 35, alpha=0.05, color='white')

plt.tight_layout()
plt.show()

print("Key results at the island constriction (km 30):")
idx_island = np.argmin(np.abs(distance - 30))
idx_wide = np.argmin(np.abs(distance - 15))
print(f"  Upstream (wide, km 15): width={effective_width[idx_wide]:.1f}km, velocity={velocity[idx_wide]:.2f}m/s")
print(f"  At island (km 30):      width={effective_width[idx_island]:.1f}km, velocity={velocity[idx_island]:.2f}m/s")
print(f"  Velocity increase: {velocity[idx_island]/velocity[idx_wide]:.1f}x")
print(f"  Erosive power increase: {(velocity[idx_island]/velocity[idx_wide])**3:.1f}x")
print()
print("Erosive power scales with velocity CUBED.")
print("A 2x velocity increase means 8x more erosion.")
print("This is why island edges erode so aggressively during floods.")`,
      challenge: 'Change the discharge from monsoon (50,000 m³/s) to dry season (5,000 m³/s). How does the velocity profile change? At what discharge does velocity at the island constriction drop below the erosion threshold of 2 m/s?',
      successHint: 'The continuity equation is the most fundamental tool in hydrology. It connects river geometry to flow behavior, and flow behavior to erosion. Every engineer working on Majuli\'s protection uses this equation daily.',
    },
    {
      title: 'Erosion rates — measuring land loss over time',
      concept: `Measuring erosion is not as simple as looking at a riverbank. Scientists use multiple methods to quantify how fast Majuli is losing land:

**Direct measurement methods:**
- **Bank pins**: metal rods hammered into the bank. Measure how much rod is exposed after each monsoon — that length is the erosion distance.
- **Survey stakes**: permanent markers set back from the bank edge. Measure the distance to the bank each year.
- **GPS transects**: walk along the bank with a GPS and record the position. Compare positions year to year.

**Remote sensing methods:**
- **Satellite imagery comparison**: overlay images from different years and calculate area change
- **LiDAR difference maps**: subtract elevation models from two different dates to find volume change
- **Aerial photography**: historical photos provide decades of shoreline positions

**Calculating erosion rates:**
- **Linear erosion rate**: meters of bank retreat per year (m/yr)
- **Area loss rate**: km² of land lost per year
- **Volume loss rate**: m³ of material removed per year (area x depth)

For Majuli, measured rates vary dramatically by location:
- Southern bank (facing main channel): 30-100 m/yr retreat
- Northern bank (facing Subansiri): 5-20 m/yr
- Eastern tip: 10-40 m/yr
- Western edge: relatively stable (protected by embankments)

These are staggering numbers. A retreat of 100 m/yr means that in a single monsoon season, entire villages can be swallowed by the river.`,
      analogy: 'Measuring erosion is like tracking weight loss on a diet. You can measure the waistline (bank retreat), step on a scale (area loss), or measure body composition (volume loss). Each tells part of the story. And just like weight loss, erosion rates vary — some months are dramatic, others are stable. You need long-term data to see the real trend.',
      storyConnection: 'The numbers make Majuli\'s crisis concrete. When we say "the island is shrinking," we mean specific villages are losing 50-100 meters of land per year. Families watch their homes approach the river edge year after year. Quantifying this erosion is the first step toward fighting it effectively — you can\'t manage what you don\'t measure.',
      checkQuestion: 'A village on Majuli\'s southern bank measured 80m of bank retreat in 2015 and 120m in 2016. Does this mean erosion is accelerating? What additional data would you need to draw that conclusion?',
      checkAnswer: 'Two data points are not enough to claim acceleration — the 2016 monsoon may simply have been more severe. To identify a trend, you need: (1) Many years of data (at least 10-20 years). (2) Monsoon discharge records for each year (to normalize for flood severity). (3) Measurements at multiple points along the bank. (4) Knowledge of any upstream changes (new dams, deforestation) that might affect sediment supply. One bad year is weather; a decade-long trend is climate.',
      codeIntro: 'Analyze bank erosion data over multiple years and calculate retreat rates with statistical significance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated bank position measurements at 5 locations over 20 years
years = np.arange(2004, 2025)
n_years = len(years)

# Base retreat rates (m/yr) at different locations
locations = {
    'South bank (village A)': {'rate': 60, 'variability': 25},
    'South bank (village B)': {'rate': 85, 'variability': 35},
    'North bank': {'rate': 12, 'variability': 8},
    'Eastern tip': {'rate': 35, 'variability': 20},
    'Western edge (protected)': {'rate': 5, 'variability': 4},
}

colors_loc = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#22c55e']

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Bank position over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
retreat_data = {}
for (name, params), color in zip(locations.items(), colors_loc):
    # Annual retreat with random monsoon variation
    annual_retreat = np.random.normal(params['rate'], params['variability'], n_years)
    annual_retreat = np.clip(annual_retreat, 0, None)  # no negative erosion
    cumulative = np.cumsum(annual_retreat)
    retreat_data[name] = {'annual': annual_retreat, 'cumulative': cumulative}
    ax.plot(years, cumulative, 'o-', color=color, linewidth=2, markersize=3, label=name)

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total retreat (m)', color='white')
ax.set_title('Cumulative Bank Retreat by Location', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper left')
ax.tick_params(colors='gray')

# Annual retreat rates (south bank village B - worst case)
ax = axes[0, 1]
ax.set_facecolor('#111827')
worst = retreat_data['South bank (village B)']['annual']
avg_rate = np.mean(worst)
bars = ax.bar(years, worst, color='#ef4444', alpha=0.7)
ax.axhline(avg_rate, color='#f59e0b', linestyle='--', linewidth=2, label=f'Mean: {avg_rate:.0f} m/yr')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Annual retreat (m)', color='white')
ax.set_title('South Bank Village B: Annual Erosion', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
plt.setp(ax.get_xticklabels(), rotation=45, fontsize=8)

# Retreat rate vs monsoon discharge
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simulated monsoon peak discharge (correlated with erosion)
monsoon_discharge = 30000 + 20000 * np.random.rand(n_years)  # m3/s peak
# Erosion correlates with discharge
for (name, data), color in zip(retreat_data.items(), colors_loc):
    ax.scatter(monsoon_discharge, data['annual'], color=color, s=20, alpha=0.7)

# Fit line for south bank B
z = np.polyfit(monsoon_discharge, retreat_data['South bank (village B)']['annual'], 1)
p = np.poly1d(z)
x_fit = np.linspace(monsoon_discharge.min(), monsoon_discharge.max(), 50)
ax.plot(x_fit, p(x_fit), '--', color='white', linewidth=1.5, label=f'Trend (Village B)')
r_squared = np.corrcoef(monsoon_discharge, retreat_data['South bank (village B)']['annual'])[0,1]**2
ax.text(32000, 130, f'R² = {r_squared:.2f}', color='white', fontsize=10)
ax.set_xlabel('Peak monsoon discharge (m³/s)', color='white')
ax.set_ylabel('Annual retreat (m)', color='white')
ax.set_title('Erosion vs Monsoon Severity', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Statistics summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
stats_text = "EROSION STATISTICS (2004-2024)\
" + "=" * 38 + "\
\
"
for name, data in retreat_data.items():
    annual = data['annual']
    stats_text += f"{name}:\
"
    stats_text += f"  Mean: {np.mean(annual):.1f} m/yr\
"
    stats_text += f"  Max:  {np.max(annual):.1f} m/yr\
"
    stats_text += f"  Total: {data['cumulative'][-1]:.0f} m in {n_years} years\
\
"
ax.text(0.05, 0.95, stats_text, transform=ax.transAxes, color='white', fontsize=9,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='gray'))

plt.tight_layout()
plt.show()

print("Summary of 20-year erosion data:")
total_area_loss = 0
for name, data in retreat_data.items():
    bank_length = 5  # km (approximate segment length)
    area_lost = data['cumulative'][-1] * bank_length * 1000 / 1e6  # km^2
    total_area_loss += area_lost
    print(f"  {name}: {data['cumulative'][-1]:.0f}m retreat, ~{area_lost:.1f} km² lost")
print(f"\
Estimated total area lost: ~{total_area_loss:.0f} km² in 20 years")`,
      challenge: 'Calculate the correlation coefficient between monsoon discharge and erosion rate for each location. Which location is most sensitive to flood intensity? Which is least? What might explain the difference?',
      successHint: 'Erosion measurement is where field work meets data science. The ability to quantify erosion rates, correlate them with environmental variables, and project future trends is what transforms concern into actionable policy. This is exactly the kind of analysis that informs Majuli\'s conservation planning.',
    },
    {
      title: 'Satellite imagery — tracking changes from space',
      concept: `Satellites have revolutionized our ability to monitor Majuli's erosion. Instead of ground surveys that cover small areas, satellites provide a bird's-eye view of the entire island at regular intervals.

**Key satellite platforms for monitoring Majuli:**
- **Landsat** (NASA/USGS): 30m resolution, images since 1972. The longest continuous Earth observation record.
- **Sentinel-2** (ESA): 10m resolution, images every 5 days since 2015.
- **Google Earth**: composites of multiple satellite sources, with historical imagery back to the 1980s.

**How satellite analysis works:**
1. **Acquire images** from the same season (usually post-monsoon) across multiple years
2. **Classify pixels**: distinguish water, land, vegetation, bare soil using spectral signatures
3. **Extract shorelines**: find the boundary between land and water pixels
4. **Overlay shorelines**: compare positions from different years
5. **Calculate change**: measure area, perimeter, and retreat distance

**Spectral indices used:**
- **NDVI** (Normalized Difference Vegetation Index): measures greenness. Healthy vegetation reflects strongly in near-infrared but absorbs red. NDVI = (NIR - Red) / (NIR + Red). Values range from -1 (water) to +1 (dense vegetation).
- **NDWI** (Normalized Difference Water Index): distinguishes water from land. Uses green and NIR bands.
- **MNDWI** (Modified NDWI): uses shortwave infrared for better water detection in turbid rivers like the Brahmaputra.

These indices allow automated detection of land-water boundaries with high precision, enabling scientists to map Majuli's changing shoreline with each new satellite pass.`,
      analogy: 'Satellite monitoring is like a time-lapse camera pointed at the island from space. Each image is a snapshot. String them together over decades and you get a movie of Majuli shrinking. Spectral indices are like putting on special glasses that make water glow blue and plants glow green — they let the computer "see" the boundary automatically.',
      storyConnection: 'Before satellites, Majuli\'s erosion was a local story — villagers watched their land disappear, but the outside world couldn\'t see it at scale. Satellite imagery made the crisis visible to the entire world. The same technology that tracks deforestation in the Amazon and ice loss in Antarctica now monitors every meter of Majuli\'s shoreline.',
      checkQuestion: 'A satellite image from October 2015 shows Majuli with an area of 524 km². An image from October 2016 shows 502 km². Can you trust this 22 km² difference as real erosion? What could cause false changes?',
      checkAnswer: 'You should be cautious. Possible sources of false change: (1) Different water levels at time of imaging — a slightly higher river would make the island look smaller. (2) Cloud shadows misclassified as water. (3) Seasonal flooding not yet receded. (4) Different satellite sensors with different resolutions. To confirm real erosion, you need: same-season imagery, water level records, multiple images per year, and ideally ground-truth verification at selected sites.',
      codeIntro: 'Simulate NDVI-based land classification and shoreline change detection from satellite data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate satellite-derived island maps for multiple years
grid_size = 200
x = np.linspace(0, 20, grid_size)
y = np.linspace(0, 10, grid_size)
X, Y = np.meshgrid(x, y)
cx, cy = 10, 5

def make_island(rx, ry, noise_level=0.3):
    """Generate island shape with given radii and noise."""
    dist = ((X - cx)/rx)**2 + ((Y - cy)/ry)**2
    noise = noise_level * np.random.randn(*X.shape)
    noise = np.convolve(noise.ravel(), np.ones(16)/16, mode='same').reshape(X.shape)
    is_land = (dist + noise) < 1.0
    return is_land

# Simulate shrinking island over time
scenarios = [
    (1990, 7.5, 3.8),
    (2000, 6.8, 3.5),
    (2010, 6.2, 3.2),
    (2020, 5.7, 3.0),
]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

areas = []
shoreline_lengths = []

for idx, (year, rx, ry) in enumerate(scenarios):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')

    island = make_island(rx, ry)
    area = np.sum(island) * (x[1]-x[0]) * (y[1]-y[0])
    areas.append((year, area))

    # Simulate NDVI values
    ndvi = np.where(island, 0.3 + 0.4 * np.random.rand(*X.shape), -0.2 + 0.15 * np.random.rand(*X.shape))

    im = ax.imshow(ndvi, extent=[0, 20, 0, 10], origin='lower', cmap='RdYlGn',
                   vmin=-0.3, vmax=0.8, aspect='auto')

    # Shoreline contour
    ax.contour(X, Y, island.astype(float), levels=[0.5], colors='white', linewidths=1.5)

    # Previous year's shoreline for comparison
    if idx > 0:
        prev_rx, prev_ry = scenarios[idx-1][1], scenarios[idx-1][2]
        prev_island = make_island(prev_rx, prev_ry)
        ax.contour(X, Y, prev_island.astype(float), levels=[0.5],
                   colors='#ef4444', linewidths=1, linestyles='dashed')

    ax.set_title(f'{year}  |  Area: {area:.0f} km²', color='white', fontsize=11)
    ax.set_xlabel('km', color='white')
    ax.set_ylabel('km', color='white')
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Summary plot
fig2, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
fig2.patch.set_facecolor('#1f2937')

# Area decline
ax1.set_facecolor('#111827')
yrs = [a[0] for a in areas]
ars = [a[1] for a in areas]
ax1.plot(yrs, ars, 'o-', color='#ef4444', linewidth=2, markersize=8)
ax1.fill_between(yrs, ars, alpha=0.15, color='#ef4444')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Area (km²)', color='white')
ax1.set_title('Island Area from Satellite Classification', color='white', fontsize=11)
ax1.tick_params(colors='gray')
for yr, ar in areas:
    ax1.annotate(f'{ar:.0f} km²', xy=(yr, ar), xytext=(yr, ar+5),
                 color='white', fontsize=9, ha='center')

# Decadal loss
ax2.set_facecolor('#111827')
decade_loss = [ars[i] - ars[i+1] for i in range(len(ars)-1)]
decade_labels = [f'{yrs[i]}-{yrs[i+1]}' for i in range(len(yrs)-1)]
bars = ax2.bar(decade_labels, decade_loss, color='#f59e0b')
ax2.set_ylabel('Area lost (km²)', color='white')
ax2.set_title('Land Loss by Decade', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for bar, loss in zip(bars, decade_loss):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             f'{loss:.0f} km²', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Satellite-derived area measurements:")
for year, area in areas:
    print(f"  {year}: {area:.0f} km²")
print(f"\
Total loss ({areas[0][0]}-{areas[-1][0]}): {areas[0][1]-areas[-1][1]:.0f} km²")
print(f"Average rate: {(areas[0][1]-areas[-1][1])/(areas[-1][0]-areas[0][0]):.1f} km²/year")
print()
print("NDVI classification accuracy depends on:")
print("  - Cloud-free imagery (a challenge in monsoon season)")
print("  - Consistent water levels at time of capture")
print("  - Resolution: Landsat (30m) vs Sentinel-2 (10m)")
print("  - Atmospheric correction (haze, aerosols)")`,
      challenge: 'NDVI values above 0.3 typically indicate healthy vegetation, 0.1-0.3 sparse vegetation or bare soil, and below 0.1 water or barren ground. Modify the code to calculate what percentage of the island has healthy vegetation, sparse vegetation, and bare soil for each year. Does vegetation health change as the island shrinks?',
      successHint: 'Satellite remote sensing is one of the most powerful tools in environmental science. It allows continuous, objective monitoring of large areas over long time periods. For Majuli, it transforms a local tragedy into a measurable, trackable, and ultimately manageable problem.',
    },
    {
      title: 'Flood prediction — using historical data to forecast',
      concept: `Predicting floods is critical for Majuli, where the difference between a normal monsoon and a catastrophic flood can mean the displacement of thousands of people. Flood prediction combines historical data, statistical analysis, and physical modeling.

**Return period analysis** is the most common statistical approach:
- A **10-year flood** is a discharge level expected to be exceeded once every 10 years (10% probability in any given year)
- A **50-year flood** has a 2% annual probability
- A **100-year flood** has a 1% annual probability

The key tool is the **flood frequency curve**: plot historical peak discharges, rank them, and fit a statistical distribution. The most commonly used distributions are:
- **Log-normal**: assumes log-transformed discharges are normally distributed
- **Gumbel (extreme value type I)**: designed specifically for extreme events
- **Log-Pearson Type III**: the US standard for flood frequency analysis

**For Majuli, key flood levels:**
- Annual flood (50% probability): ~45,000 m³/s — normal monsoon, some low-lying areas flooded
- 10-year flood: ~65,000 m³/s — significant flooding, bank erosion accelerates
- 50-year flood: ~80,000 m³/s — catastrophic, large areas submerged for weeks
- 100-year flood: ~90,000 m³/s — island-wide devastation

A crucial caveat: climate change is shifting the distribution. What was a "100-year flood" in 1950 may be a "50-year flood" in 2025 — the historical data underestimates future risk.`,
      analogy: 'Flood prediction is like predicting the highest wave that will hit a seawall. You can watch waves for a year and record the highest one. But the wave that hits next year might be bigger. Statistical analysis lets you estimate how high a wave COULD be, even if you have never seen one that big. The longer your records, the better your estimate — but surprises are always possible.',
      storyConnection: 'For Majuli\'s residents, flood prediction is not an academic exercise — it determines when to evacuate, where to build, and how high to raise embankments. A community that knows "this area floods in a 10-year event" can plan accordingly. The data transforms fear of the unknown into calculable risk.',
      checkQuestion: 'A politician says "We just had a 100-year flood, so we\'re safe for the next 99 years." Why is this reasoning wrong?',
      checkAnswer: 'A "100-year flood" means a 1% probability each year, independently. Having one this year does not reduce the probability next year — just like flipping heads does not make tails more likely next time. In fact, over 100 years, the probability of experiencing at least one "100-year flood" is 1 - 0.99^100 = 63.4%. And with climate change increasing extreme event frequency, the true probability may be even higher.',
      codeIntro: 'Perform flood frequency analysis using the Gumbel distribution on simulated Brahmaputra discharge data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated annual peak discharge data (m^3/s) - 50 years
# Based on approximate Brahmaputra statistics
n_years = 50
mu = 48000  # mean annual peak discharge
sigma = 12000  # standard deviation

# Generate from Gumbel distribution (appropriate for extremes)
# Gumbel: location parameter and scale parameter
beta = sigma * np.sqrt(6) / np.pi  # scale
mu_gumbel = mu - 0.5772 * beta  # location (Euler-Mascheroni correction)

annual_peaks = mu_gumbel + beta * (-np.log(-np.log(np.random.rand(n_years))))
annual_peaks = np.sort(annual_peaks)

# Plotting positions (Weibull formula)
rank = np.arange(1, n_years + 1)
prob_exceed = rank / (n_years + 1)  # probability of exceedance
return_period = 1 / (1 - prob_exceed)  # return period in years

# Fit Gumbel distribution
mean_peaks = np.mean(annual_peaks)
std_peaks = np.std(annual_peaks)
beta_fit = std_peaks * np.sqrt(6) / np.pi
mu_fit = mean_peaks - 0.5772 * beta_fit

# Generate fitted curve
rp_curve = np.logspace(0.3, 2.5, 100)  # 2 to ~300 year return periods
prob_curve = 1 - 1/rp_curve
# Gumbel quantile: x = mu + beta * (-ln(-ln(p)))
q_curve = mu_fit + beta_fit * (-np.log(-np.log(prob_curve)))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Flood frequency curve
ax1.set_facecolor('#111827')
ax1.semilogx(return_period, annual_peaks / 1000, 'o', color='#3b82f6', markersize=5, label='Observed peaks')
ax1.semilogx(rp_curve, q_curve / 1000, '-', color='#f59e0b', linewidth=2, label='Gumbel fit')

# Mark key return periods
key_rps = [2, 10, 25, 50, 100]
for rp in key_rps:
    p = 1 - 1/rp
    q = mu_fit + beta_fit * (-np.log(-np.log(p)))
    ax1.plot(rp, q/1000, 's', color='#ef4444', markersize=8, zorder=5)
    ax1.annotate(f'{rp}-yr: {q/1000:.0f}k m³/s', xy=(rp, q/1000),
                 xytext=(rp*1.3, q/1000 + 2), color='#ef4444', fontsize=8,
                 arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Return period (years)', color='white')
ax1.set_ylabel('Peak discharge (thousand m³/s)', color='white')
ax1.set_title('Flood Frequency Curve (Gumbel Distribution)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.grid(True, alpha=0.1)

# Probability of experiencing a flood in N years
ax2.set_facecolor('#111827')
n_range = np.arange(1, 101)  # planning horizon
for rp, color, label in [(10, '#22c55e', '10-yr flood'),
                          (25, '#f59e0b', '25-yr flood'),
                          (50, '#ef4444', '50-yr flood'),
                          (100, '#a855f7', '100-yr flood')]:
    p_annual = 1/rp
    p_at_least_one = 1 - (1 - p_annual)**n_range
    ax2.plot(n_range, p_at_least_one * 100, color=color, linewidth=2, label=label)

ax2.axhline(50, color='gray', linestyle=':', alpha=0.3)
ax2.text(2, 52, '50% probability', color='gray', fontsize=8)
ax2.set_xlabel('Planning horizon (years)', color='white')
ax2.set_ylabel('Probability of at least one event (%)', color='white')
ax2.set_title('Flood Risk Over Time', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print("Flood frequency analysis results:")
print(f"  Mean annual peak: {mean_peaks/1000:.0f}k m³/s")
print(f"  Gumbel parameters: location={mu_fit/1000:.1f}k, scale={beta_fit/1000:.1f}k")
print()
for rp in [2, 10, 25, 50, 100, 200]:
    p = 1 - 1/rp
    q = mu_fit + beta_fit * (-np.log(-np.log(p)))
    print(f"  {rp:4d}-year flood: {q/1000:6.0f}k m³/s ({100/rp:.1f}% annual probability)")
print()
print("Probability of a 100-year flood in the next 30 years:")
print(f"  {(1 - (1-0.01)**30)*100:.1f}%")
print("That's nearly 1 in 4! 'Rare' events are not as rare as they sound.")`,
      challenge: 'Climate change may increase the mean peak discharge by 10% and the variability by 20% over the next 50 years. Recalculate the Gumbel parameters with these changes. How does the 100-year flood discharge change? What was a 100-year event before becomes what return period under the new climate?',
      successHint: 'Flood frequency analysis is where statistics meets life-or-death decision-making. Every dam, levee, bridge, and evacuation plan is designed around return period estimates. For Majuli, these calculations determine whether a village gets an embankment or a relocation order.',
    },
    {
      title: 'Engineering solutions — embankments, bamboo porcupines, mangroves',
      concept: `Protecting Majuli requires a portfolio of engineering solutions, each with quantifiable performance characteristics. Let us analyze three key approaches in detail:

**1. Embankments (levees)**
Earthen walls 3-5m high, built along threatened riverbanks. They work by physically blocking floodwater.
- Design equation: the embankment must withstand hydrostatic pressure P = ρgh, where h is the flood height
- Failure modes: overtopping (flood exceeds design height), piping (water seeps through), scour (river undermines the base)
- Majuli has ~100 km of embankments; many are poorly maintained and breach during major floods

**2. Bamboo porcupines**
Lattice structures made from bamboo poles arranged in a criss-cross pattern, placed in the river near eroding banks.
- They work by reducing water velocity in their vicinity (creating a "shadow zone")
- Velocity reduction: typically 40-60% immediately behind the structure
- Sediment accumulates in the low-velocity zone, building new land
- Lifespan: 3-7 years before bamboo degrades (but sediment and vegetation may have stabilized by then)

**3. Mangrove/vegetation bioengineering**
Planting deep-rooted species (vetiver grass, bamboo, native trees) along riverbanks.
- Root networks increase soil shear strength by 200-400%
- Above-ground biomass reduces wave energy and flow velocity
- Self-maintaining: plants grow and strengthen over time (unlike structures that deteriorate)
- Challenge: establishing plants on actively eroding banks requires initial protection

The most effective approach combines all three: embankments for immediate protection, porcupines for medium-term sediment trapping, and vegetation for long-term stabilization.`,
      analogy: 'Protecting a riverbank is like treating a patient with a severe wound. Embankments are emergency surgery — fast, effective, but the wound can reopen. Porcupines are like a cast — they hold things in place while healing happens. Vegetation is the body\'s own healing process — slow but permanent. The best outcome uses all three in sequence.',
      storyConnection: 'Majuli\'s story does not have to end in disappearance. The same scientific understanding of river dynamics, sediment transport, and erosion that explains the island\'s decline also provides the tools to fight back. Engineering solutions are how science translates understanding into action — and for Majuli, action is urgent.',
      checkQuestion: 'An embankment is designed to protect against a 25-year flood (80,000 m³/s). A 50-year flood (90,000 m³/s) strikes. The embankment is overtopped by 0.5 m. Why is the damage from overtopping often WORSE than if there were no embankment at all?',
      checkAnswer: 'When water overtops an embankment, it falls from the crest to the land side, creating enormous erosive force (like a waterfall). This scours the back of the embankment, causing rapid structural failure — the wall collapses in a sudden breach. Without the embankment, the flood would rise gradually, allowing time for evacuation. The embankment gives a false sense of security, then fails catastrophically. This is called the "levee effect" — protection infrastructure can paradoxically increase damage from extreme events.',
      codeIntro: 'Model the effectiveness of bamboo porcupines in reducing flow velocity and trapping sediment over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model: Porcupine structures reduce velocity, causing sediment deposition

# Spatial model: 1D cross-section perpendicular to river flow
distance = np.linspace(-50, 200, 500)  # meters from porcupine (negative = upstream)

# Baseline velocity (no porcupine)
v_baseline = 2.5  # m/s (monsoon flow)

# Velocity profile with porcupine at x=0
# Upstream: slight increase (flow diverts around)
# At structure: major reduction
# Downstream: gradual recovery (wake zone)
def velocity_profile(x, reduction=0.5, wake_length=80):
    v = np.ones_like(x) * v_baseline
    # Upstream speedup (Bernoulli effect)
    upstream = x < 0
    v[upstream] = v_baseline * (1 + 0.15 * np.exp(x[upstream] / 10))
    # Wake zone behind porcupine
    downstream = x >= 0
    recovery = 1 - reduction * np.exp(-x[downstream] / wake_length)
    v[downstream] = v_baseline * recovery
    return v

# Single vs multiple porcupines
v_single = velocity_profile(distance)

# Three porcupines at x=0, 60, 120
v_multi = velocity_profile(distance, reduction=0.5, wake_length=80)
for offset in [60, 120]:
    v_add = velocity_profile(distance - offset, reduction=0.4, wake_length=60)
    # Take minimum velocity (combined shadow zones)
    v_multi = np.minimum(v_multi, v_add)

# Sediment deposition rate: proportional to (v_baseline - v) when v < v_baseline
dep_single = np.maximum(0, v_baseline - v_single) * 5  # arbitrary scale (cm/monsoon)
dep_multi = np.maximum(0, v_baseline - v_multi) * 5

fig, axes = plt.subplots(3, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Velocity profiles
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(distance, np.ones_like(distance) * v_baseline, '--', color='gray', linewidth=1, label='No porcupine')
ax.plot(distance, v_single, color='#3b82f6', linewidth=2, label='Single porcupine')
ax.plot(distance, v_multi, color='#22c55e', linewidth=2, label='Three porcupines')
ax.axhline(1.5, color='#f59e0b', linestyle=':', label='Deposition threshold (~1.5 m/s)')
for px in [0, 60, 120]:
    ax.axvline(px, color='#ef4444', linestyle='-', alpha=0.3, linewidth=3)
ax.text(0, 0.3, 'P1', color='#ef4444', fontsize=10, ha='center', fontweight='bold')
ax.text(60, 0.3, 'P2', color='#ef4444', fontsize=10, ha='center', fontweight='bold')
ax.text(120, 0.3, 'P3', color='#ef4444', fontsize=10, ha='center', fontweight='bold')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title('Flow Velocity Behind Bamboo Porcupines', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Deposition rate
ax = axes[1]
ax.set_facecolor('#111827')
ax.fill_between(distance, dep_single, alpha=0.3, color='#3b82f6', label='Single porcupine')
ax.fill_between(distance, dep_multi, alpha=0.3, color='#22c55e', label='Three porcupines')
ax.plot(distance, dep_single, color='#3b82f6', linewidth=2)
ax.plot(distance, dep_multi, color='#22c55e', linewidth=2)
ax.set_ylabel('Deposition rate (cm/monsoon)', color='white')
ax.set_title('Sediment Deposition Behind Porcupines', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cumulative land built over 5 years
ax = axes[2]
ax.set_facecolor('#111827')
years_sim = [1, 2, 3, 4, 5]
for yr in years_sim:
    total_dep = dep_multi * yr
    # Land builds up where deposition exceeds threshold
    land_height = np.cumsum(dep_multi) * 0.001  # crude approximation
    ax.fill_between(distance, total_dep * 0, total_dep,
                    alpha=0.15 + 0.1 * yr / 5,
                    color='#f59e0b')
ax.fill_between(distance, dep_multi * 5, alpha=0.5, color='#f59e0b', label='After 5 monsoons')
ax.fill_between(distance, dep_multi * 1, alpha=0.8, color='#22c55e', label='After 1 monsoon')
ax.set_xlabel('Distance from first porcupine (m)', color='white')
ax.set_ylabel('Total deposition (cm)', color='white')
ax.set_title('Sediment Accumulation Over 5 Years', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate total sediment trapped
total_single = np.trapz(dep_single[distance >= 0], distance[distance >= 0])
total_multi = np.trapz(dep_multi[distance >= 0], distance[distance >= 0])

print("Porcupine effectiveness analysis:")
print(f"  Single porcupine:")
print(f"    Velocity reduction: {(1 - v_single[distance >= 0].min() / v_baseline) * 100:.0f}%")
print(f"    Deposition per monsoon: {total_single:.0f} cm·m (integrated)")
print(f"  Three porcupines (spaced 60m):")
print(f"    Velocity reduction: {(1 - v_multi[distance >= 0].min() / v_baseline) * 100:.0f}%")
print(f"    Deposition per monsoon: {total_multi:.0f} cm·m (integrated)")
print(f"    Improvement over single: {total_multi/total_single:.1f}x")
print()
print("After 5 monsoons with three porcupines:")
print(f"  Max sediment depth: {dep_multi.max() * 5:.0f} cm ({dep_multi.max() * 5 / 100:.1f} m)")
print(f"  This new land, if stabilized by vegetation,")
print(f"  becomes permanent protection for the original bank.")
print()
print("Cost comparison:")
print(f"  Bamboo porcupine: ~15 lakh INR / km")
print(f"  Rock revetment:   ~200 lakh INR / km")
print(f"  Porcupines are 13x cheaper and use local materials!")`,
      challenge: 'The porcupine model assumes constant monsoon velocity. In reality, velocity varies: low at season start, peaks mid-monsoon, then drops. Modify the model to simulate a 4-month monsoon with a velocity curve that peaks at month 2. How does the time-varying flow change the total deposition pattern?',
      successHint: 'Engineering Majuli\'s protection is not about choosing one solution — it is about designing an integrated system where each component compensates for the others\' weaknesses. Embankments for immediate safety, porcupines for sediment trapping, vegetation for permanent stabilization. This layered approach is the future of river island conservation worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 — basic geography and math recommended</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for earth science data analysis and modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
