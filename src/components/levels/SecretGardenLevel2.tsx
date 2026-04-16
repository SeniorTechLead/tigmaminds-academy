import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SecretGardenLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Remote sensing — monitoring wetlands from space',
      concept: `How do scientists track the health of a 287 km² lake? They cannot walk every meter. Instead, they use **remote sensing** — satellite or drone imagery that captures information invisible to the naked eye.

Key remote sensing tools for wetlands:
- **NDVI** (Normalized Difference Vegetation Index): uses near-infrared and red light to measure plant health. Healthy plants reflect lots of NIR and absorb red → high NDVI.
- **NDWI** (Normalized Difference Water Index): distinguishes water from vegetation using green and NIR bands.
- **SAR** (Synthetic Aperture Radar): penetrates clouds and works at night — critical during monsoon season.

NDVI formula: (NIR - Red) / (NIR + Red)
- Values near +1: dense, healthy vegetation
- Values near 0: bare soil, water, or dead vegetation
- Values near -1: water bodies

By comparing NDVI maps from different years, scientists can track phumdi expansion, degradation, and seasonal cycles — all without setting foot on the floating islands.`,
      analogy: 'Remote sensing is like a doctor using an X-ray instead of surgery to see inside a patient. The satellite sees wavelengths of light that human eyes cannot, revealing the health of vegetation (NDVI = the plant\'s pulse) and water extent (NDWI = the lake\'s blood pressure) without disturbing the ecosystem.',
      storyConnection: 'The secret garden was hidden from view — only those who knew where to look could find it. Remote sensing reveals hidden patterns in landscapes: a phumdi that looks healthy to the eye might show declining NDVI, warning scientists of trouble before it becomes visible.',
      checkQuestion: 'Why do healthy plants appear green but reflect strongly in near-infrared (which we cannot see)?',
      checkAnswer: 'Chlorophyll absorbs red and blue light for photosynthesis (reflecting green, which is why we see them as green). But the mesophyll cell structure strongly reflects NIR light — it passes through the leaf and bounces off internal air-cell interfaces. This NIR reflectance is like a fingerprint for living vegetation. Dead or stressed plants lose this internal structure, so their NIR reflectance drops.',
      codeIntro: 'Simulate NDVI calculation from satellite band data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a satellite image of Loktak Lake area (50x50 pixels)
size = 50

# Create land use map
land_use = np.zeros((size, size))
# Water (0), Healthy phumdi (1), Degraded phumdi (2), Agriculture (3), Urban (4)
# Center: lake
for i in range(size):
    for j in range(size):
        dist = np.sqrt((i-25)**2 + (j-25)**2)
        if dist < 15:
            land_use[i,j] = 0  # water
            # Add phumdis
            if 8 < dist < 14 and np.random.random() > 0.4:
                land_use[i,j] = 1  # healthy phumdi
            if 5 < dist < 9 and np.random.random() > 0.6:
                land_use[i,j] = 2  # degraded phumdi
        elif dist < 22:
            land_use[i,j] = 3  # agriculture
        else:
            land_use[i,j] = 4 if np.random.random() > 0.7 else 3

# Simulate spectral bands
nir = np.where(land_use == 0, 0.05, np.where(land_use == 1, 0.5, np.where(land_use == 2, 0.25, np.where(land_use == 3, 0.4, 0.1))))
red = np.where(land_use == 0, 0.03, np.where(land_use == 1, 0.08, np.where(land_use == 2, 0.12, np.where(land_use == 3, 0.1, 0.15))))

# Add noise
nir += np.random.normal(0, 0.02, (size, size))
red += np.random.normal(0, 0.01, (size, size))
nir = np.clip(nir, 0, 1)
red = np.clip(red, 0, 1)

# Calculate NDVI
ndvi = (nir - red) / (nir + red + 1e-10)

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

# Red band
axes[0].set_facecolor('#111827')
axes[0].imshow(red, cmap='Reds', vmin=0, vmax=0.3)
axes[0].set_title('Red Band', color='white', fontsize=11)
axes[0].tick_params(colors='gray')

# NIR band
axes[1].set_facecolor('#111827')
axes[1].imshow(nir, cmap='gray', vmin=0, vmax=0.6)
axes[1].set_title('Near-Infrared Band', color='white', fontsize=11)
axes[1].tick_params(colors='gray')

# NDVI
axes[2].set_facecolor('#111827')
im = axes[2].imshow(ndvi, cmap='RdYlGn', vmin=-0.5, vmax=0.9)
axes[2].set_title('NDVI (Vegetation Health)', color='white', fontsize=11)
axes[2].tick_params(colors='gray')
plt.colorbar(im, ax=axes[2], shrink=0.8)

plt.tight_layout()
plt.show()

# Statistics
print("NDVI statistics by land type:")
for val, name in [(0, 'Water'), (1, 'Healthy phumdi'), (2, 'Degraded phumdi'), (3, 'Agriculture'), (4, 'Urban')]:
    mask = land_use == val
    if np.sum(mask) > 0:
        print(f"  {name}: mean NDVI = {ndvi[mask].mean():.3f} (n={np.sum(mask)} pixels)")`,
      challenge: 'Calculate NDWI using green and NIR bands: NDWI = (Green - NIR) / (Green + NIR). Where Green = 0.1 for water, 0.1 for vegetation, 0.15 for soil. How does NDWI complement NDVI for wetland mapping?',
      successHint: 'Remote sensing is how we monitor Earth-scale environmental changes. The same NDVI calculation you just coded runs on petabytes of satellite data in Google Earth Engine every day.',
    },
    {
      title: 'Trophic cascades — when one species changes everything',
      concept: `A **trophic cascade** is when a change at one level of a food chain ripples through all other levels. In Loktak Lake:

- Top predator: large fish (catfish, snakehead)
- Middle: small fish, insects
- Bottom: algae, aquatic plants

If large fish are overfished:
1. Small fish populations explode (no predator control)
2. Small fish eat more zooplankton
3. Zooplankton can no longer control algae
4. Algal blooms cover the lake, blocking sunlight
5. Submerged plants die, phumdis degrade
6. Fish habitat is destroyed, collapsing fisheries further

This is called a **top-down cascade**. The most famous example: when wolves were reintroduced to Yellowstone, they reduced deer populations → forests recovered → rivers changed course (beavers returned) → the entire ecosystem restructured.

Understanding trophic cascades is critical for managing Loktak Lake: protecting predator fish may be the cheapest way to prevent algal blooms.`,
      analogy: 'A trophic cascade is like removing a boss from a company. Without oversight, middle managers do whatever they want (small fish eat all the zooplankton). Without middle management restraint, entry-level chaos ensues (algal blooms). One change at the top restructures the entire organization.',
      storyConnection: 'The secret garden was balanced — each plant and creature played a role. If one key species were removed, the garden would unravel. This is not fantasy but ecology. In Loktak Lake, every species is connected to every other through trophic cascades, and removing any one can cause unexpected consequences.',
      checkQuestion: 'Counterintuitively, ADDING nutrients to a lake can REDUCE total fish catch. How?',
      checkAnswer: 'More nutrients → more algae → algal blooms block light → submerged plants die → fish lose habitat and spawning grounds → fish populations crash. Additionally, when algal blooms decompose, bacteria consume oxygen, creating "dead zones" where fish suffocate. The nutrient enrichment that was supposed to "help" actually collapses the system.',
      codeIntro: 'Model a four-level trophic cascade in Loktak Lake.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lotka-Volterra trophic cascade model (simplified)
# 4 levels: algae, zooplankton, small fish, large fish
dt = 0.01
steps = 20000
t = np.arange(steps) * dt

# State variables (population sizes, normalized)
algae = np.zeros(steps)
zoo = np.zeros(steps)  # zooplankton
small_fish = np.zeros(steps)
large_fish = np.zeros(steps)

# Initial conditions
algae[0] = 50
zoo[0] = 30
small_fish[0] = 15
large_fish[0] = 5

# Parameters
r_algae = 1.0   # algae growth rate
K_algae = 100   # algae carrying capacity
a_za = 0.02     # zooplankton grazing on algae
a_sz = 0.03     # small fish eating zooplankton
a_ls = 0.04     # large fish eating small fish
d_z = 0.3       # zooplankton death rate
d_s = 0.2       # small fish death rate
d_l = 0.1       # large fish death rate
e_z = 0.5       # conversion efficiency
e_s = 0.4
e_l = 0.3

for i in range(1, steps):
    dA = r_algae * algae[i-1] * (1 - algae[i-1]/K_algae) - a_za * zoo[i-1] * algae[i-1]
    dZ = e_z * a_za * zoo[i-1] * algae[i-1] - a_sz * small_fish[i-1] * zoo[i-1] - d_z * zoo[i-1]
    dS = e_s * a_sz * small_fish[i-1] * zoo[i-1] - a_ls * large_fish[i-1] * small_fish[i-1] - d_s * small_fish[i-1]
    dL = e_l * a_ls * large_fish[i-1] * small_fish[i-1] - d_l * large_fish[i-1]

    algae[i] = max(0.1, algae[i-1] + dA * dt)
    zoo[i] = max(0.1, zoo[i-1] + dZ * dt)
    small_fish[i] = max(0.1, small_fish[i-1] + dS * dt)
    large_fish[i] = max(0.1, large_fish[i-1] + dL * dt)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Normal ecosystem
ax1.set_facecolor('#111827')
ax1.plot(t, algae, color='#22c55e', linewidth=1.5, label='Algae')
ax1.plot(t, zoo, color='#3b82f6', linewidth=1.5, label='Zooplankton')
ax1.plot(t, small_fish, color='#f59e0b', linewidth=1.5, label='Small fish')
ax1.plot(t, large_fish, color='#ef4444', linewidth=1.5, label='Large fish')
ax1.set_ylabel('Population', color='white')
ax1.set_title('Healthy Ecosystem: All Trophic Levels Present', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Now remove large fish at t=100
algae2 = algae.copy()
zoo2 = zoo.copy()
small_fish2 = small_fish.copy()
large_fish2 = large_fish.copy()

remove_step = int(100 / dt)
large_fish2[remove_step] = 0.1  # remove large fish

for i in range(remove_step + 1, steps):
    dA = r_algae * algae2[i-1] * (1 - algae2[i-1]/K_algae) - a_za * zoo2[i-1] * algae2[i-1]
    dZ = e_z * a_za * zoo2[i-1] * algae2[i-1] - a_sz * small_fish2[i-1] * zoo2[i-1] - d_z * zoo2[i-1]
    dS = e_s * a_sz * small_fish2[i-1] * zoo2[i-1] - d_s * small_fish2[i-1]  # no predation
    dL = 0  # removed

    algae2[i] = max(0.1, algae2[i-1] + dA * dt)
    zoo2[i] = max(0.1, zoo2[i-1] + dZ * dt)
    small_fish2[i] = max(0.1, small_fish2[i-1] + dS * dt)
    large_fish2[i] = 0.1

ax2.set_facecolor('#111827')
ax2.plot(t, algae2, color='#22c55e', linewidth=1.5, label='Algae')
ax2.plot(t, zoo2, color='#3b82f6', linewidth=1.5, label='Zooplankton')
ax2.plot(t, small_fish2, color='#f59e0b', linewidth=1.5, label='Small fish')
ax2.plot(t, large_fish2, color='#ef4444', linewidth=1.5, label='Large fish')
ax2.axvline(100, color='#ef4444', linestyle='--', alpha=0.5)
ax2.text(102, 80, 'Large fish\
removed', color='#ef4444', fontsize=9)
ax2.set_xlabel('Time', color='white')
ax2.set_ylabel('Population', color='white')
ax2.set_title('Trophic Cascade: Large Fish Removed', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cascade effect after removing large fish:")
print("  Large fish: removed (overfished)")
print("  Small fish: increase (no predator)")
print("  Zooplankton: decrease (more predation by small fish)")
print("  Algae: increase (less grazing by zooplankton)")
print()
print("Result: algal bloom → oxygen depletion → ecosystem collapse")`,
      challenge: 'Instead of removing large fish entirely, reduce them by 50%. Is the cascade still as severe? Is there a threshold below which the ecosystem cannot recover?',
      successHint: 'Trophic cascades explain why ecosystem management cannot focus on single species. Saving Loktak requires understanding the entire food web — from algae to top predators.',
    },
    {
      title: 'Dissolved oxygen dynamics — why fish need more than water',
      concept: `Fish breathe oxygen dissolved in water. The amount of **dissolved oxygen (DO)** depends on:

- **Temperature**: cold water holds more O₂ than warm water (at 10°C: ~11 mg/L; at 30°C: ~7.5 mg/L)
- **Photosynthesis**: plants and algae produce O₂ during the day
- **Respiration**: all organisms consume O₂ day and night
- **Decomposition**: bacteria consuming dead matter use enormous amounts of O₂
- **Mixing**: wind and waves mix atmospheric O₂ into the water surface

The **diel (daily) oxygen cycle** in a lake:
- Dawn: DO at minimum (night respiration depleted it)
- Afternoon: DO at maximum (peak photosynthesis)
- Dusk: DO starts declining (photosynthesis stops, respiration continues)

When DO drops below 4 mg/L, fish become stressed. Below 2 mg/L, most fish die. This is called a **hypoxic zone** or "dead zone." Loktak Lake experiences hypoxia during warm nights after algal blooms.`,
      analogy: 'Dissolved oxygen in water is like cash flow in a business. Income (photosynthesis, atmospheric mixing) must exceed expenses (respiration, decomposition). If expenses exceed income for too long, the business (ecosystem) goes bankrupt (hypoxia). Temperature is like inflation — it increases expenses (higher respiration rates) while reducing the total money supply (lower O₂ solubility).',
      storyConnection: 'The secret garden floated on water that had to breathe. Beneath the phumdis, water circulates slowly, and oxygen can be depleted by the decomposing organic mat above. The garden survives because its roots release small amounts of oxygen into the water — a process called radial oxygen loss — literally breathing life into the water below.',
      checkQuestion: 'Why are algal blooms dangerous even though algae PRODUCE oxygen?',
      checkAnswer: 'During the day, algal blooms overproduce oxygen (sometimes supersaturating the water). But at night, the same massive algal population consumes oxygen through respiration. When the bloom dies, decomposing bacteria consume even more oxygen. The net effect is severe nighttime and post-bloom oxygen depletion — enough to create dead zones that kill fish.',
      codeIntro: 'Model the daily dissolved oxygen cycle in a lake with and without an algal bloom.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Diel dissolved oxygen model
hours = np.linspace(0, 48, 500)  # 2 days

# Photosynthesis rate (peaks at solar noon)
def photo_rate(t, max_rate):
    # Sinusoidal, only positive during daytime (6am - 6pm)
    hour_of_day = t % 24
    if 6 <= hour_of_day <= 18:
        return max_rate * np.sin(np.pi * (hour_of_day - 6) / 12)
    return 0

photo_vec = np.vectorize(photo_rate)

# Respiration (constant, day and night)
resp_normal = 0.3  # mg/L/hour
resp_bloom = 0.8   # mg/L/hour (during algal bloom)

# Atmospheric reaeration
def reaeration(DO, DO_sat=8.0, k=0.1):
    return k * (DO_sat - DO)  # positive when DO < saturation

# Normal conditions
DO_normal = np.zeros(len(hours))
DO_normal[0] = 7.0  # starting DO
photo_normal = photo_vec(hours, 0.5)

for i in range(1, len(hours)):
    dt = hours[i] - hours[i-1]
    dDO = photo_normal[i] - resp_normal + reaeration(DO_normal[i-1])
    DO_normal[i] = max(0, DO_normal[i-1] + dDO * dt)

# Algal bloom conditions
DO_bloom = np.zeros(len(hours))
DO_bloom[0] = 7.0
photo_bloom = photo_vec(hours, 1.5)  # more photosynthesis during day

for i in range(1, len(hours)):
    dt = hours[i] - hours[i-1]
    dDO = photo_bloom[i] - resp_bloom + reaeration(DO_bloom[i-1])
    DO_bloom[i] = max(0, DO_bloom[i-1] + dDO * dt)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Normal
ax1.set_facecolor('#111827')
ax1.plot(hours, DO_normal, color='#3b82f6', linewidth=2)
ax1.axhline(4, color='#f59e0b', linestyle='--', label='Fish stress threshold')
ax1.axhline(2, color='#ef4444', linestyle='--', label='Lethal threshold')
ax1.fill_between(hours, 0, DO_normal, alpha=0.1, color='#3b82f6')
# Shade nighttime
for start in [0, 18, 42]:
    ax1.axvspan(start, min(start+12, 48), alpha=0.1, color='gray')
ax1.set_ylabel('Dissolved O₂ (mg/L)', color='white')
ax1.set_title('Normal Conditions: Stable DO Cycle', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 12)

# Bloom
ax2.set_facecolor('#111827')
ax2.plot(hours, DO_bloom, color='#22c55e', linewidth=2)
ax2.axhline(4, color='#f59e0b', linestyle='--', label='Fish stress threshold')
ax2.axhline(2, color='#ef4444', linestyle='--', label='Lethal threshold')
ax2.fill_between(hours, 0, 2, alpha=0.15, color='#ef4444')
ax2.fill_between(hours, 2, 4, alpha=0.1, color='#f59e0b')
for start in [0, 18, 42]:
    ax2.axvspan(start, min(start+12, 48), alpha=0.1, color='gray')
ax2.set_xlabel('Hours', color='white')
ax2.set_ylabel('Dissolved O₂ (mg/L)', color='white')
ax2.set_title('Algal Bloom: Extreme DO Swings', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 12)

plt.tight_layout()
plt.show()

print("Normal conditions:")
print(f"  DO range: {DO_normal.min():.1f} - {DO_normal.max():.1f} mg/L")
print(f"  Hours below stress: {np.sum(DO_normal < 4) * (48/len(hours)):.1f}h")
print()
print("Algal bloom:")
print(f"  DO range: {DO_bloom.min():.1f} - {DO_bloom.max():.1f} mg/L")
print(f"  Hours below stress: {np.sum(DO_bloom < 4) * (48/len(hours)):.1f}h")
print(f"  Hours below lethal: {np.sum(DO_bloom < 2) * (48/len(hours)):.1f}h")`,
      challenge: 'Add a third scenario: algal bloom die-off. After the bloom dies, photosynthesis drops to zero but respiration (decomposition) stays high for 48 hours. Plot the DO crash.',
      successHint: 'Dissolved oxygen monitoring is one of the most important water quality measurements worldwide. A single DO sensor can reveal the health of an entire water body.',
    },
    {
      title: 'Peat formation — making fossil fuels in real time',
      concept: `The dead organic matter in phumdis is **peat** — partially decomposed plant material that accumulates in waterlogged, oxygen-poor conditions. Peat is forming right now in Loktak Lake, just as it has been forming in wetlands for hundreds of millions of years.

The peat → coal pathway:
1. **Peat** (present): partially decomposed plants, 60% carbon, waterlogged
2. **Lignite** (millions of years): compressed peat, 65-70% carbon
3. **Sub-bituminous coal** (tens of millions of years): further compressed, 70-80% carbon
4. **Bituminous coal** (hundreds of millions of years): 80-90% carbon
5. **Anthracite** (extreme pressure/heat): 90-95% carbon

Every piece of coal on Earth was once a wetland like Loktak. The Carboniferous period (359-299 million years ago) had massive swamp forests that became today's coal deposits. Those swamps were doing the same thing Loktak's phumdis are doing now — accumulating organic matter in waterlogged conditions.

Peatlands store ~600 gigatons of carbon — twice as much as all the world's forests combined. Draining peatlands releases this stored carbon as CO₂.`,
      analogy: 'Peat formation is like pressing flowers in a heavy book. The flower (plant) is placed between pages (sediment layers), the book is closed (waterlogging prevents decay), and over millions of years, the weight of more books on top (geological pressure) compresses it into a thin, hard sheet (coal).',
      storyConnection: 'The secret garden floated on layers of dead plants — peat. Beneath the living garden was a record of all the gardens that came before, compressed and preserved. The phumdi is a living layer on top of a fossil record — a garden standing on the shoulders of its ancestors.',
      checkQuestion: 'Peat accumulates at about 1mm per year. Loktak\'s phumdis are up to 2 meters thick. Approximately how old are the deepest layers?',
      checkAnswer: 'About 2000 years (2000mm / 1mm per year). However, accumulation rates vary — during warm, productive periods, peat grows faster; during dry periods, it may decompose. The deepest phumdi layers may represent vegetation that grew when the Roman Empire was at its peak.',
      codeIntro: 'Model peat accumulation and carbon sequestration over centuries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Peat accumulation model
years = np.arange(0, 2000)

# Net peat accumulation = production - decomposition
# Both are temperature-dependent
base_production = 1.5  # mm/year
base_decomposition = 0.5  # mm/year

# Temperature variation (Medieval Warm Period, Little Ice Age, etc.)
temp_anomaly = 0.5 * np.sin(2 * np.pi * years / 500) + 0.3 * np.sin(2 * np.pi * years / 200)

# Temperature affects both production and decomposition
production = base_production * (1 + 0.2 * temp_anomaly)
decomposition = base_decomposition * (1 + 0.4 * temp_anomaly)  # decomposition more sensitive

net_accumulation = production - decomposition
thickness = np.cumsum(net_accumulation)  # mm

# Carbon content (roughly 50 kg C per m³ of peat)
carbon_density = 50  # kg C / m³
# Per hectare, 1mm of peat = 10 m³/ha
carbon_stored = thickness * 10 * carbon_density / 1000  # tonnes C / ha

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Peat thickness
ax1.set_facecolor('#111827')
ax1.plot(years, thickness, color='#854d0e', linewidth=2)
ax1.fill_between(years, 0, thickness, alpha=0.2, color='#854d0e')
ax1.set_ylabel('Peat thickness (mm)', color='white')
ax1.set_title('Peat Accumulation Over 2000 Years', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark historical periods
periods = [(0, 'Roman era', 'white'), (500, 'Medieval\
Warm Period', '#ef4444'),
           (1200, 'Little\
Ice Age', '#3b82f6'), (1800, 'Industrial\
era', '#f59e0b')]
for yr, label, color in periods:
    ax1.axvline(yr, color=color, linestyle=':', alpha=0.3)
    ax1.text(yr + 20, thickness.max() * 0.9, label, color=color, fontsize=8)

# Carbon stored
ax2.set_facecolor('#111827')
ax2.plot(years, carbon_stored, color='#22c55e', linewidth=2)
ax2.fill_between(years, 0, carbon_stored, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Years ago → present', color='white')
ax2.set_ylabel('Carbon stored (tonnes C/ha)', color='white')
ax2.set_title('Cumulative Carbon Sequestration', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Annotate current value
ax2.annotate(f'{carbon_stored[-1]:.0f} tonnes C/ha\
stored today', xy=(years[-1], carbon_stored[-1]),
            xytext=(years[-1]-400, carbon_stored[-1]*0.7), color='#22c55e', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

print(f"Total peat thickness: {thickness[-1]:.0f} mm ({thickness[-1]/1000:.1f} m)")
print(f"Total carbon stored: {carbon_stored[-1]:.0f} tonnes C/ha")
print(f"Loktak Lake (287 km²): ~{carbon_stored[-1] * 28700 / 1e6:.1f} million tonnes C")
print()
print("If this peat were drained and decomposed:")
print(f"  CO₂ released: ~{carbon_stored[-1] * 28700 * 3.67 / 1e6:.0f} million tonnes CO₂")
print("  That's comparable to a small country's annual emissions.")`,
      challenge: 'What happens if climate change increases temperature anomaly by 2°C? Rerun with stronger temp_anomaly. Does peat accumulation increase (more production) or decrease (more decomposition)?',
      successHint: 'Peatlands are one of the most important carbon stores on Earth. Understanding their formation and vulnerability is essential for climate science — and it all starts with the simple accumulation of dead plants in waterlogged ground.',
    },
    {
      title: 'Hydrological modeling — water balance of a lake',
      concept: `Every lake obeys a simple water balance equation:

**ΔStorage = Inflow - Outflow**

For Loktak Lake:
- **Inflows**: rivers (7 major rivers), direct rainfall, groundwater seepage
- **Outflows**: Ithai Barrage discharge, evaporation, downstream flow, groundwater seepage

The lake level depends on the balance between these flows, which vary seasonally:
- Monsoon (June-September): massive inflow → lake level rises 3-4 meters
- Dry season (November-April): low inflow → lake level drops

The Ithai Barrage (1983) disrupted this balance by maintaining artificially high water levels year-round for hydropower. This caused:
- Permanent flooding of low-lying areas
- Phumdi waterlogging (no dry-season grounding)
- Reduced seasonal nutrient flushing
- Habitat loss for terrestrial species

Hydrological models use differential equations to predict lake levels under different management scenarios — essential for deciding when and how much water to release.`,
      analogy: 'A lake\'s water balance is like a bathtub. Rain and rivers are the tap. Evaporation and outflow are the drain. The lake level rises when the tap is on faster than the drain can empty. The Ithai Barrage is like partially plugging the drain — the tub overflows during monsoon and never fully empties.',
      storyConnection: 'The secret garden floated higher or lower depending on the water level. In reality, Loktak\'s phumdis respond to hydrological cycles. The garden\'s health depends on a water balance it cannot control — just as all floating ecosystems are at the mercy of the hydrology around them.',
      checkQuestion: 'The Ithai Barrage generates 105 MW of hydropower. Is this worth the ecological damage to the lake?',
      checkAnswer: 'This is a genuine trade-off with no easy answer. 105 MW powers about 100,000 homes. But the ecological damage includes loss of the Sangai deer habitat, reduced fisheries affecting 100,000 families, and degraded ecosystem services worth millions annually. The economic case for modified barrage operation (allowing seasonal fluctuations) is strong — but requires political will.',
      codeIntro: 'Build a simple water balance model for Loktak Lake.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly water balance model for Loktak Lake
months = np.arange(0, 24)  # 2 years
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D'] * 2

# Monthly rainfall (mm) - typical for Manipur
rainfall = np.array([15, 20, 45, 100, 200, 320, 350, 280, 220, 120, 30, 10] * 2)

# River inflow (million m³/month)
river_inflow = np.array([20, 15, 25, 60, 150, 300, 350, 280, 200, 100, 40, 25] * 2)

# Evaporation (mm/month)
evaporation = np.array([50, 60, 80, 100, 90, 60, 40, 45, 55, 70, 55, 45] * 2)

# Lake area for volume conversion
lake_area = 287e6  # m²

# Convert rainfall/evap to volume (million m³)
rain_volume = rainfall * lake_area / 1e9
evap_volume = evaporation * lake_area / 1e9

# Without barrage (natural)
outflow_natural = river_inflow * 0.8  # 80% of inflow leaves downstream

# With barrage (controlled)
barrage_capacity = 150  # max release million m³/month
outflow_barrage = np.minimum(river_inflow * 0.5, barrage_capacity)

# Lake level simulation
level_natural = np.zeros(24)
level_barrage = np.zeros(24)
level_natural[0] = 768.0  # meters above sea level
level_barrage[0] = 768.5  # higher due to barrage

level_per_volume = 0.003  # m per million m³ (simplified)

for i in range(1, 24):
    net_natural = rain_volume[i] + river_inflow[i] - evap_volume[i] - outflow_natural[i]
    net_barrage = rain_volume[i] + river_inflow[i] - evap_volume[i] - outflow_barrage[i]
    level_natural[i] = level_natural[i-1] + net_natural * level_per_volume
    level_barrage[i] = level_barrage[i-1] + net_barrage * level_per_volume

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Inflows and outflows
ax1.set_facecolor('#111827')
ax1.bar(months - 0.2, rain_volume + river_inflow, 0.4, label='Total inflow', color='#3b82f6', alpha=0.8)
ax1.bar(months + 0.2, evap_volume + outflow_natural, 0.4, label='Total outflow (natural)', color='#ef4444', alpha=0.6)
ax1.bar(months + 0.2, evap_volume + outflow_barrage, 0.4, label='Total outflow (barrage)', color='#f59e0b', alpha=0.4)
ax1.set_xticks(months)
ax1.set_xticklabels(month_names, color='white', fontsize=8)
ax1.set_ylabel('Volume (million m³)', color='white')
ax1.set_title('Monthly Water Budget', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Lake levels
ax2.set_facecolor('#111827')
ax2.plot(months, level_natural, 'o-', color='#3b82f6', linewidth=2, label='Natural')
ax2.plot(months, level_barrage, 's-', color='#ef4444', linewidth=2, label='With Ithai Barrage')
ax2.axhline(769, color='#f59e0b', linestyle='--', alpha=0.5)
ax2.text(0.5, 769.1, 'Phumdi grounding level', color='#f59e0b', fontsize=8)
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, color='white', fontsize=8)
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Lake level (m above sea level)', color='white')
ax2.set_title('Lake Level: Natural vs Barrage-Controlled', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

natural_range = level_natural.max() - level_natural.min()
barrage_range = level_barrage.max() - level_barrage.min()
print(f"Natural lake level range: {natural_range:.1f} m")
print(f"Barrage lake level range: {barrage_range:.1f} m")
print(f"Natural: phumdis ground in dry season (level drops below 769m)")
print(f"Barrage: level stays high year-round (phumdis never ground)")`,
      challenge: 'Design a "managed seasonal release" from the barrage: release more water in Nov-Feb (allowing lake level to drop) and store more in Jun-Sep. Can you match the natural seasonal pattern while still generating some hydropower?',
      successHint: 'Hydrological modeling is how water managers decide dam releases, predict floods, and plan irrigation. The same equations that describe Loktak Lake describe every reservoir, river, and watershed on Earth.',
    },
    {
      title: 'Constructed wetlands — engineering nature\'s design',
      concept: `If natural wetlands are such effective water filters, can we build artificial ones? Yes — **constructed wetlands** are engineered ecosystems designed to treat wastewater using the same biological processes as natural wetlands.

Types of constructed wetlands:
- **Free water surface**: shallow basins with emergent plants (like a miniature Loktak)
- **Horizontal subsurface flow**: water flows through gravel beds planted with reeds
- **Vertical subsurface flow**: water percolates down through layered media
- **Floating treatment wetlands**: plants on floating mats (directly inspired by phumdis!)

Design parameters:
- **Hydraulic loading rate**: how much water per unit area per day
- **Retention time**: how long water stays in the wetland (typically 5-14 days)
- **Plant species**: Phragmites (reeds), Typha (cattails), and Canna are most common
- **Substrate**: gravel size affects flow rate and filtration

Constructed wetlands remove:
- 80-95% of suspended solids
- 60-90% of nitrogen
- 50-80% of phosphorus
- 95-99% of pathogenic bacteria
- Heavy metals (variably, through plant uptake and soil binding)

They cost 50-90% less than conventional treatment plants and require minimal maintenance.`,
      analogy: 'A constructed wetland is like a recipe derived from watching a master chef (nature). Scientists observed what natural wetlands do — filter water, cycle nutrients, remove pathogens — and reverse-engineered the process into a buildable, scalable system. The recipe is not as elegant as the chef\'s intuition, but it works.',
      storyConnection: 'The secret garden purified the water around it simply by existing. Constructed wetlands do the same — they are human-made secret gardens, designed to clean polluted water. Loktak\'s phumdis are the original design; floating treatment wetlands are our copies.',
      checkQuestion: 'Why would a floating treatment wetland be better than a conventional one for treating a polluted urban lake?',
      checkAnswer: 'A floating wetland can be deployed directly on the lake surface — no land needed, no plumbing required. The plants uptake nutrients directly from the lake water while their dangling roots filter particles and harbor beneficial microbes. It is in-situ treatment: cleaning the water where the pollution is, rather than pumping water to a treatment plant. Loktak\'s phumdis naturally do this.',
      codeIntro: 'Design a constructed wetland by calculating the required area for a given pollution load.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constructed wetland design calculator
# First-order kinetics: C_out = C_in * exp(-k * t)
# Where t = retention time = Area * depth / flow_rate

# Input parameters
flow_rate = 1000  # m³/day (small town wastewater)
depth = 0.5  # m (typical free-water-surface)

# Pollutant removal parameters
pollutants = {
    'BOD': {'C_in': 200, 'target': 20, 'k': 0.15, 'unit': 'mg/L', 'color': '#ef4444'},
    'Nitrogen': {'C_in': 40, 'target': 10, 'k': 0.06, 'unit': 'mg/L', 'color': '#3b82f6'},
    'Phosphorus': {'C_in': 8, 'target': 2, 'k': 0.04, 'unit': 'mg/L', 'color': '#f59e0b'},
    'Bacteria': {'C_in': 1e7, 'target': 1000, 'k': 0.8, 'unit': 'CFU/100mL', 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Concentration vs wetland area
areas = np.linspace(100, 10000, 200)
ax1.set_facecolor('#111827')

required_areas = {}
for name, p in pollutants.items():
    retention = areas * depth / flow_rate  # days
    C_out = p['C_in'] * np.exp(-p['k'] * retention)
    removal_pct = (1 - C_out / p['C_in']) * 100

    ax1.plot(areas, removal_pct, color=p['color'], linewidth=2, label=name)

    # Find required area
    req_t = -np.log(p['target'] / p['C_in']) / p['k']
    req_area = req_t * flow_rate / depth
    required_areas[name] = req_area
    if req_area < 10000:
        ax1.plot(req_area, (1-p['target']/p['C_in'])*100, 'o', color=p['color'], markersize=8)

ax1.set_xlabel('Wetland area (m²)', color='white')
ax1.set_ylabel('Removal efficiency (%)', color='white')
ax1.set_title('Pollutant Removal vs Wetland Size', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Required areas comparison
ax2.set_facecolor('#111827')
names = list(required_areas.keys())
areas_req = list(required_areas.values())
colors_req = [pollutants[n]['color'] for n in names]

bars = ax2.barh(names, [min(a, 15000) for a in areas_req], color=colors_req, alpha=0.8)
ax2.set_xlabel('Required wetland area (m²)', color='white')
ax2.set_title('Area Needed to Meet Targets', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, area in zip(bars, areas_req):
    label = f'{area:.0f} m²' if area < 15000 else f'{area:.0f} m² (!)'
    ax2.text(min(bar.get_width(), 14000) + 100, bar.get_y() + bar.get_height()/2,
            label, va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Constructed Wetland Design:")
print(f"  Flow rate: {flow_rate} m³/day")
print(f"  Depth: {depth} m")
print()
design_area = max(required_areas.values())
print(f"  Limiting factor: {max(required_areas, key=required_areas.get)}")
print(f"  Required area: {design_area:.0f} m² ({design_area/10000:.2f} hectares)")
print(f"  Retention time: {design_area * depth / flow_rate:.1f} days")
print()
print(f"  Cost estimate: {design_area * 50:,.0f} (vs {flow_rate * 365 * 2:,.0f}/yr for conventional)")`,
      challenge: 'A village produces 500 m³/day of wastewater. Design a constructed wetland to reduce BOD from 300 to 30 mg/L. What area is needed? How does it compare to the village size?',
      successHint: 'Constructed wetlands are one of the most elegant engineering solutions ever developed — we copied nature\'s billion-year-old design and applied it to our waste problem. From Loktak\'s phumdis to engineered floating gardens, the principle is the same.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced wetland modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
