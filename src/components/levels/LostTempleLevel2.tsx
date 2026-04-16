import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LostTempleLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Radiometric decay equations — the mathematics of deep time',
      concept: `In Level 1, we learned that radiocarbon dating uses ¹⁴C decay with a 5,730-year half-life. But ¹⁴C only works up to ~50,000 years. For older objects — the granite foundations of Madan Kamdev, the geological formations beneath it — we need other radiometric systems.

The general decay equation: **N(t) = N₀ × e^(-λt)**

Where:
- N(t) = atoms remaining at time t
- N₀ = initial atoms
- λ = decay constant = ln(2) / half-life
- t = time elapsed

Different parent-daughter systems:
- **¹⁴C → ¹⁴N**: half-life 5,730 years (archaeology, recent geology)
- **⁴⁰K → ⁴⁰Ar**: half-life 1.25 billion years (volcanic rocks, early human sites)
- **²³⁸U → ²⁰⁶Pb**: half-life 4.47 billion years (Earth's age, oldest rocks)
- **⁸⁷Rb → ⁸⁷Sr**: half-life 48.8 billion years (crustal evolution)

The key insight: by measuring the ratio of parent to daughter isotopes, you can solve for t even if you don't know N₀. This is because **parent + daughter = constant** (a closed system).

The **isochron method**: plot ⁸⁷Sr/⁸⁶Sr vs. ⁸⁷Rb/⁸⁶Sr for multiple minerals from the same rock. The slope of the line gives the age. No assumptions about initial composition needed.`,
      analogy: 'Radiometric dating is like figuring out when someone lit a candle by measuring the stub and the puddle of wax. You don\'t need to know the original candle length — the stub (parent) + puddle (daughter) = original candle. Measure both, know the burn rate (half-life), and you can calculate when it was lit.',
      storyConnection: 'The granite used to build Madan Kamdev is far older than the temple. Potassium-argon dating of the granite gives an age of ~500 million years — the stone formed during the Cambrian period. The builders unknowingly used material half a billion years old to construct a temple that would last barely a millennium.',
      checkQuestion: 'Why can\'t we use radiocarbon dating on the granite blocks of Madan Kamdev, even if we\'re only interested in when the temple was built?',
      checkAnswer: 'Two reasons: 1) Granite is inorganic — it never contained ¹⁴C from the atmosphere. 2) Even if we could date the rock, we\'d get the age of the granite formation (500 million years), not when it was quarried and placed in the temple. To date construction, we need organic material associated with the building event: charcoal in mortar, wood from scaffolding, or straw in plaster.',
      codeIntro: 'Implement the radiometric decay equation for multiple isotope systems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Radiometric decay for multiple systems
systems = {
    '¹⁴C → ¹⁴N': {'half_life': 5730, 'color': '#22c55e', 'range': (0, 60000)},
    '⁴⁰K → ⁴⁰Ar': {'half_life': 1.25e9, 'color': '#3b82f6', 'range': (0, 5e9)},
    '²³⁸U → ²⁰⁶Pb': {'half_life': 4.47e9, 'color': '#f59e0b', 'range': (0, 15e9)},
    '⁸⁷Rb → ⁸⁷Sr': {'half_life': 4.88e10, 'color': '#a855f7', 'range': (0, 50e9)},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

for ax, (name, sys) in zip(axes.flat, systems.items()):
    ax.set_facecolor('#111827')
    hl = sys['half_life']
    lam = np.log(2) / hl
    t = np.linspace(*sys['range'], 300)

    parent = np.exp(-lam * t)
    daughter = 1 - parent

    ax.plot(t / hl, parent * 100, color=sys['color'], linewidth=2, label='Parent')
    ax.plot(t / hl, daughter * 100, color='#ef4444', linewidth=2, linestyle='--', label='Daughter')
    ax.fill_between(t / hl, parent * 100, alpha=0.1, color=sys['color'])

    # Mark half-lives
    for n in range(1, 4):
        if n * hl <= sys['range'][1]:
            ax.axvline(n, color='gray', linestyle=':', linewidth=0.5)
            ax.text(n, 105, f'{n} t½', ha='center', color='gray', fontsize=7)

    ax.set_xlabel(f'Half-lives (t½ = {hl:.2e} yr)' if hl > 1e6 else f'Half-lives (t½ = {hl:,.0f} yr)', color='white', fontsize=8)
    ax.set_ylabel('% of original', color='white')
    ax.set_title(name, color=sys['color'], fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='gray')
    ax.set_ylim(-5, 115)

plt.tight_layout()
plt.show()

print("Radiometric dating systems and their applications:")
print(f"  ¹⁴C → ¹⁴N:    t½ = 5,730 yr → archaeology (<50,000 yr)")
print(f"  ⁴⁰K → ⁴⁰Ar:   t½ = 1.25 Gyr → volcanic rocks, early humans")
print(f"  ²³⁸U → ²⁰⁶Pb:  t½ = 4.47 Gyr → Earth's age, Moon rocks")
print(f"  ⁸⁷Rb → ⁸⁷Sr:   t½ = 48.8 Gyr → crustal evolution")
print()
print("Each system has a useful range of ~10 half-lives.")
print("After that, too little parent remains to measure accurately.")`,
      challenge: 'The Earth is 4.54 billion years old. What fraction of original ²³⁸U remains? Calculate: e^(-ln(2) × 4.54/4.47). What about ⁴⁰K? Which isotope is more "used up" and why does this matter for dating very old rocks?',
      successHint: 'Radiometric dating gives us the absolute timescale of Earth history. Without it, we\'d know the order of events (stratigraphy) but not when they happened. It\'s the difference between "chapter 1 before chapter 2" and "chapter 1 was written in 1920."',
    },
    {
      title: 'Isotope analysis — reading diet and migration in ancient bones',
      concept: `The atoms in your bones came from the food you ate. Different foods have different isotope ratios, and those ratios get locked into your skeleton. By analyzing ancient bones, we can reconstruct what people ate and where they lived.

Key isotope systems:
- **δ¹³C** (carbon-13/carbon-12 ratio): distinguishes C3 plants (rice, wheat, most trees: δ¹³C ≈ -26‰) from C4 plants (millet, maize, sugarcane: δ¹³C ≈ -12‰)
- **δ¹⁵N** (nitrogen-15/nitrogen-14 ratio): increases with trophic level. Plants ≈ 0-5‰, herbivores ≈ 5-9‰, carnivores ≈ 9-15‰, top predators ≈ 15-20‰
- **⁸⁷Sr/⁸⁶Sr** (strontium): varies with local geology. Teeth form in childhood, bones remodel throughout life. If tooth strontium ≠ bone strontium, the person migrated.
- **δ¹⁸O** (oxygen-18): varies with rainfall and temperature. Correlates with latitude and altitude.

At a site like Madan Kamdev, isotope analysis of buried remains could tell us: were the temple builders eating rice (C3) or millet (C4)? Were they vegetarian (low δ¹⁵N) or fish-eaters (high δ¹⁵N)? Were they local or immigrants from distant regions?`,
      analogy: 'Isotope analysis is like reading a food diary written in your bones. Every meal leaves a chemical signature. Eat rice for 20 years → your bones say "C3 plant eater." Switch to millet → your bones gradually shift. Move from the Brahmaputra valley to the Meghalaya hills → your strontium ratio changes. Your skeleton is an autobiography written in atoms.',
      storyConnection: 'If archaeologists could analyze bones from the Madan Kamdev burial grounds, they might discover that the master stone carvers came from a different region — their strontium ratios would differ from the locals. Were they itinerant artisans who traveled from temple to temple? Isotopes could answer questions no inscription addresses.',
      checkQuestion: 'A skeleton has δ¹³C of -20‰ and δ¹⁵N of 12‰. What did this person likely eat?',
      checkAnswer: 'The δ¹³C of -20‰ is between pure C3 (-26‰) and C4 (-12‰), suggesting a mixed diet — probably rice (C3) supplemented with some millet (C4). The δ¹⁵N of 12‰ is well above herbivore range (5-9‰), indicating significant animal protein — likely fish, since we\'re in riverine Assam. Summary: rice + fish diet, consistent with Brahmaputra valley culture.',
      codeIntro: 'Plot isotope ratios to reconstruct ancient diets.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated isotope data from Madan Kamdev burials
n_individuals = 30

# Generate diet groups
groups = np.random.choice(
    ['Rice farmer', 'Fisher', 'Herder', 'Possible migrant'],
    n_individuals, p=[0.40, 0.30, 0.15, 0.15])

# Generate isotope values based on diet
d13C = np.zeros(n_individuals)
d15N = np.zeros(n_individuals)

for i, g in enumerate(groups):
    if g == 'Rice farmer':
        d13C[i] = np.random.normal(-24, 1.5)  # C3 dominant
        d15N[i] = np.random.normal(7, 1.0)    # moderate trophic level
    elif g == 'Fisher':
        d13C[i] = np.random.normal(-21, 1.5)  # C3 + some aquatic
        d15N[i] = np.random.normal(12, 1.5)   # high (fish = high trophic)
    elif g == 'Herder':
        d13C[i] = np.random.normal(-18, 2.0)  # C4 influence (millet-fed animals)
        d15N[i] = np.random.normal(9, 1.0)    # moderate-high
    else:  # Migrant - distinct isotope signature
        d13C[i] = np.random.normal(-15, 1.5)  # heavy C4 (from millet region)
        d15N[i] = np.random.normal(8, 1.5)    # variable

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Carbon vs Nitrogen isotope plot
ax1.set_facecolor('#111827')
group_colors = {'Rice farmer': '#22c55e', 'Fisher': '#3b82f6',
                'Herder': '#f59e0b', 'Possible migrant': '#ef4444'}

for group, color in group_colors.items():
    mask = groups == group
    ax1.scatter(d13C[mask], d15N[mask], c=color, s=60, label=group, alpha=0.8, edgecolors='white', linewidths=0.5)

# Reference zones
ax1.axvspan(-28, -22, alpha=0.08, color='#22c55e')
ax1.text(-25, 16, 'C3 plants\
(rice, wheat)', color='#22c55e', fontsize=8, ha='center')
ax1.axvspan(-16, -10, alpha=0.08, color='#f59e0b')
ax1.text(-13, 16, 'C4 plants\
(millet, maize)', color='#f59e0b', fontsize=8, ha='center')

ax1.axhspan(0, 5, alpha=0.05, color='white')
ax1.text(-28, 3, 'Plants', color='gray', fontsize=8)
ax1.axhspan(5, 9, alpha=0.05, color='white')
ax1.text(-28, 7, 'Herbivores', color='gray', fontsize=8)
ax1.axhspan(9, 15, alpha=0.05, color='white')
ax1.text(-28, 12, 'Carnivores/Fish eaters', color='gray', fontsize=8)

ax1.set_xlabel('δ¹³C (‰)', color='white')
ax1.set_ylabel('δ¹⁵N (‰)', color='white')
ax1.set_title('Dietary Reconstruction from Bone Isotopes', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Strontium migration analysis
ax2.set_facecolor('#111827')

# Local geological Sr ratio for Guwahati area
local_sr = 0.715
sr_range = 0.003  # natural variation

# Tooth Sr (childhood location) vs Bone Sr (adult location)
tooth_sr = np.random.normal(local_sr, sr_range, n_individuals)
bone_sr = np.random.normal(local_sr, sr_range * 0.7, n_individuals)

# Migrants have different tooth Sr
migrant_mask = groups == 'Possible migrant'
tooth_sr[migrant_mask] = np.random.normal(0.722, 0.002, np.sum(migrant_mask))

ax2.scatter(tooth_sr[~migrant_mask], bone_sr[~migrant_mask], c='#22c55e',
           s=60, label='Locals', alpha=0.8, edgecolors='white', linewidths=0.5)
ax2.scatter(tooth_sr[migrant_mask], bone_sr[migrant_mask], c='#ef4444',
           s=80, label='Migrants', alpha=0.8, edgecolors='white', linewidths=0.5, marker='D')

# Local range box
rect = plt.Rectangle((local_sr - sr_range*2, local_sr - sr_range*2),
                       sr_range*4, sr_range*4, fill=False, edgecolor='#22c55e',
                       linestyle='--', linewidth=1)
ax2.add_patch(rect)
ax2.text(local_sr, local_sr + sr_range*2.5, 'Local range', color='#22c55e', fontsize=9, ha='center')

# 1:1 line
sr_min, sr_max = 0.708, 0.728
ax2.plot([sr_min, sr_max], [sr_min, sr_max], ':', color='gray', linewidth=0.5)

ax2.set_xlabel('Tooth ⁸⁷Sr/⁸⁶Sr (childhood)', color='white')
ax2.set_ylabel('Bone ⁸⁷Sr/⁸⁶Sr (adulthood)', color='white')
ax2.set_title('Migration Detection: Tooth vs Bone Strontium', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dietary reconstruction:")
for group in group_colors:
    mask = groups == group
    print(f"  {group}: mean δ¹³C = {d13C[mask].mean():.1f}‰, mean δ¹⁵N = {d15N[mask].mean():.1f}‰")
print()
print("Migration analysis:")
print(f"  Local ⁸⁷Sr/⁸⁶Sr: {local_sr:.3f} ± {sr_range:.3f}")
print(f"  Migrants detected: {np.sum(migrant_mask)} out of {n_individuals}")
print("  Migrants have higher tooth Sr → childhood in a different geological region")`,
      challenge: 'The "possible migrants" have tooth Sr of ~0.722 but bone Sr of ~0.715. This means they grew up somewhere else but spent their adult life in the Guwahati area. What geological region has Sr ~0.722? (Hint: granite-rich areas have higher Sr.) Could these be artisans from the Deccan Plateau?',
      successHint: 'Isotope analysis transforms anonymous skeletons into individuals with stories — where they grew up, what they ate, when they moved. It\'s chemistry in service of biography, atoms as autobiography.',
    },
    {
      title: 'GIS in archaeology — mapping the invisible',
      concept: `**GIS** (Geographic Information System) is a computer system for capturing, storing, analyzing, and displaying spatial data. In archaeology, GIS transforms scattered finds into comprehensive maps of ancient landscapes.

How GIS works in archaeology:
1. **Data layers**: each type of information is a separate layer — topography, artifact locations, soil types, vegetation, water sources
2. **Spatial analysis**: overlay layers to find patterns. Where artifacts cluster near water, you find settlements. Where they cluster near mineral deposits, you find workshops.
3. **Predictive modeling**: if known sites share features (elevation 200-400m, within 500m of water, south-facing slope), search for un-excavated sites with the same features
4. **Viewshed analysis**: what could ancient people see from a given point? Temples are often placed at viewshed maxima — visible from the greatest area
5. **Least-cost path analysis**: the most efficient route between two points considering terrain. Ancient roads often follow least-cost paths.

At Madan Kamdev, GIS reveals that the temple complex is positioned on a hillside with a commanding view of the Brahmaputra valley — visible from a vast area, likely intentional for both religious and political signaling.`,
      analogy: 'GIS is like stacking transparent maps on a light table. One map shows rivers, another shows elevation, another shows artifact locations. When you stack them, patterns emerge that no single map reveals: "every major site is within 1km of a river, above 100m elevation, on a south-facing slope." The combination is more powerful than any individual layer.',
      storyConnection: 'When the old teacher overlaid a topographic map, a water source map, and the artifact distribution map, a pattern emerged: the temple complex at Madan Kamdev was positioned at the exact point where three criteria intersected — hilltop visibility, spring water access, and granite quarry proximity. The builders chose this site with engineering precision.',
      checkQuestion: 'If you wanted to find undiscovered temple sites in Assam similar to Madan Kamdev, what GIS layers would you need and what criteria would you set?',
      checkAnswer: 'Essential layers: 1) Elevation model (look for hilltops 100-300m). 2) Water sources (within 500m of spring or stream). 3) Geology (near sandstone or granite outcrops for building material). 4) Known site locations (for training the model). 5) Satellite imagery (look for geometric anomalies under vegetation). The predictive model would intersect all criteria and rank candidate sites by how many criteria they match.',
      codeIntro: 'Build a simple GIS site prediction model using overlapping data layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a simplified landscape (50×50 km area)
grid_size = 100
x = np.linspace(0, 50, grid_size)
y = np.linspace(0, 50, grid_size)
X, Y = np.meshgrid(x, y)

# Layer 1: Elevation (hills and valleys)
elevation = (80 * np.sin(X/8) * np.cos(Y/10) +
             60 * np.sin(X/5 + Y/7) +
             200 + 50 * np.random.rand(grid_size, grid_size) * 0.3)

# Layer 2: Distance to water (rivers follow valleys)
# Simplified: water at low elevation
water_distance = np.abs(elevation - elevation.min()) / elevation.ptp() * 5  # km

# Layer 3: Slope (steeper = less suitable)
slope_x = np.gradient(elevation, axis=1)
slope_y = np.gradient(elevation, axis=0)
slope = np.sqrt(slope_x**2 + slope_y**2)

# Site suitability model
# Ideal: high elevation (visibility), low water distance, moderate slope
elev_score = np.clip((elevation - 200) / 100, 0, 1)  # prefer high
water_score = np.clip(1 - water_distance / 3, 0, 1)   # prefer near water
slope_score = np.clip(1 - slope / 20, 0, 1)            # prefer moderate slope

suitability = elev_score * 0.4 + water_score * 0.35 + slope_score * 0.25

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

layers = [
    (elevation, 'Elevation (m)', 'terrain'),
    (water_distance, 'Distance to Water (km)', 'Blues_r'),
    (slope, 'Slope (degrees)', 'YlOrRd'),
    (elev_score, 'Elevation Score', 'Greens'),
    (water_score, 'Water Proximity Score', 'Blues'),
    (suitability, 'SITE SUITABILITY', 'YlOrRd'),
]

for ax, (data, title, cmap) in zip(axes.flat, layers):
    ax.set_facecolor('#111827')
    im = ax.imshow(data, origin='lower', extent=[0, 50, 0, 50], cmap=cmap, aspect='equal')
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    plt.colorbar(im, ax=ax, fraction=0.046)

# Mark known site (Madan Kamdev analog) on suitability map
ax = axes[1, 2]
# Find top 5 suitability cells
flat_idx = np.argsort(suitability.flat)[-5:]
top_y, top_x = np.unravel_index(flat_idx, suitability.shape)
ax.scatter(x[top_x], y[top_y], c='white', marker='*', s=100, zorder=5, label='Predicted sites')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("GIS Site Prediction Model:")
print("  Weights: elevation (40%) + water proximity (35%) + slope (25%)")
print()
print("Top 5 predicted site locations:")
for i, (ty, tx) in enumerate(zip(top_y, top_x)):
    print(f"  Site {i+1}: ({x[tx]:.1f}, {y[ty]:.1f}) km — "
          f"elev={elevation[ty,tx]:.0f}m, "
          f"water={water_distance[ty,tx]:.1f}km, "
          f"score={suitability[ty,tx]:.3f}")
print()
print("Real GIS uses many more layers: geology, vegetation,")
print("existing road networks, soil type, satellite anomalies...")`,
      challenge: 'Add a fourth layer: "viewshed score" — how much area is visible from each point. Use elevation and count how many cells at lower elevation are within 10km. High viewshed = high score. Temples are often placed for maximum visibility.',
      successHint: 'GIS transforms archaeology from "digging where you hope" to "predicting where to look." The same GIS techniques are used in urban planning, military intelligence, environmental management, and disaster response.',
    },
    {
      title: 'Remote sensing — seeing the unseen from above',
      concept: `Some of the most important archaeological discoveries of the 21st century were made not by digging, but by looking from above. **Remote sensing** uses satellite imagery, aerial photography, and airborne sensors to detect features invisible from the ground.

Key technologies:
- **Multispectral imaging**: cameras that see beyond visible light. Buried walls affect soil moisture, which changes plant growth, which shows up in near-infrared images.
- **LiDAR** (Light Detection and Ranging): fires millions of laser pulses from an aircraft. Measures the time each pulse takes to bounce back. Creates a 3D model of the ground surface — even through thick forest canopy.
- **Synthetic Aperture Radar (SAR)**: radar from satellites penetrates clouds, vegetation, and even shallow soil. Detects buried structures by their effect on surface moisture.
- **Thermal imaging**: buried structures heat and cool at different rates than surrounding soil. At dawn, ancient walls appear as warm lines.

LiDAR revolutionized tropical archaeology: the ancient Maya city of Caracol (Belize), invisible under jungle canopy, was mapped in 2009 — revealing 60,000 structures across 177 km² in just 4 days of LiDAR flying.`,
      analogy: 'Remote sensing is like a doctor\'s medical imaging. Visible light photography is like looking at the patient\'s skin. Multispectral is like an X-ray (sees through surface). LiDAR is like a CT scan (builds 3D model). SAR is like an MRI (penetrates soft tissue/vegetation). Each technology reveals different layers of information beneath the surface.',
      storyConnection: 'In 2023, researchers used satellite multispectral imagery to identify previously unknown mounds near Madan Kamdev that might be buried structures. The vegetation above these mounds showed different near-infrared reflectance — the plants were struggling because their roots hit stone foundations beneath the soil. This "crop mark" technique has revealed entire cities.',
      checkQuestion: 'How can LiDAR "see through" a dense forest canopy to map the ground surface?',
      checkAnswer: 'LiDAR fires millions of laser pulses per second. While most pulses hit leaves and branches (first returns), some pass through gaps in the canopy and hit the ground (last returns). By filtering out the first returns and keeping only the last returns, you get a bare-earth model. With hundreds of thousands of pulses per square meter, even a 1% gap rate gives you dense ground coverage. It\'s like seeing through a chain-link fence by looking through the holes.',
      codeIntro: 'Simulate LiDAR detection of buried archaeological features.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a landscape with buried structures
grid_size = 200
x = np.linspace(0, 100, grid_size)  # meters
y = np.linspace(0, 100, grid_size)
X, Y = np.meshgrid(x, y)

# Natural terrain (gentle hill)
terrain = 50 + 5 * np.sin(X / 30) + 3 * np.cos(Y / 25) + np.random.rand(grid_size, grid_size) * 0.3

# Buried temple foundation (rectangular, slightly raised)
temple_mask = ((X > 30) & (X < 55) & (Y > 35) & (Y < 65) &
               ~((X > 35) & (X < 50) & (Y > 40) & (Y < 60)))
terrain[temple_mask] += 0.3  # subtle rise from buried walls

# Buried road (linear feature)
road_mask = (np.abs(Y - 0.8 * X - 10) < 2) & (X > 10) & (X < 80)
terrain[road_mask] += 0.15

# Canopy layer (hides everything in normal imagery)
canopy = terrain + 15 + 5 * np.random.rand(grid_size, grid_size)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Satellite photo (just sees canopy)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(canopy, origin='lower', extent=[0, 100, 0, 100], cmap='Greens', aspect='equal')
ax.set_title('Satellite Photo (visible light)', color='white', fontsize=11)
ax.text(50, 5, 'Dense forest — nothing visible', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

# 2. LiDAR bare-earth model
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(terrain, origin='lower', extent=[0, 100, 0, 100], cmap='terrain', aspect='equal')
ax.set_title('LiDAR Bare-Earth Model', color='white', fontsize=11)
ax.text(50, 5, 'Forest removed — structures visible!', ha='center', color='white', fontsize=9)
plt.colorbar(im, ax=ax, label='Elevation (m)')
ax.tick_params(colors='gray')

# 3. Slope analysis (enhances edges of features)
slope_x = np.gradient(terrain, axis=1)
slope_y = np.gradient(terrain, axis=0)
slope = np.sqrt(slope_x**2 + slope_y**2)

ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(slope, origin='lower', extent=[0, 100, 0, 100], cmap='magma', aspect='equal')
ax.set_title('Slope Analysis (edge detection)', color='white', fontsize=11)
ax.text(50, 5, 'Walls and roads appear as high-slope lines', ha='center', color='white', fontsize=9)
plt.colorbar(im, ax=ax, label='Slope')
ax.tick_params(colors='gray')

# 4. Annotated interpretation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.imshow(slope, origin='lower', extent=[0, 100, 0, 100], cmap='magma', aspect='equal', alpha=0.5)

# Annotate discovered features
rect = plt.Rectangle((30, 35), 25, 30, fill=False, edgecolor='#22c55e', linewidth=2, linestyle='--')
ax.add_patch(rect)
ax.text(42.5, 67, 'Temple foundation\
(25×30m)', ha='center', color='#22c55e', fontsize=9)

# Road
road_x = np.array([10, 80])
road_y = 0.8 * road_x + 10
ax.plot(road_x, road_y, '--', color='#f59e0b', linewidth=2)
ax.text(60, 55, 'Ancient road', color='#f59e0b', fontsize=9, rotation=38)

ax.set_title('Archaeological Interpretation', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("LiDAR remote sensing workflow:")
print("  1. Fly aircraft with LiDAR sensor over forest")
print("  2. Filter point cloud: separate canopy from ground returns")
print("  3. Generate bare-earth Digital Elevation Model (DEM)")
print("  4. Apply slope/aspect analysis to enhance subtle features")
print("  5. Identify anomalies: walls, roads, platforms, moats")
print()
print("Results from simulation:")
print("  - Temple foundation detected: 25×30m rectangular anomaly")
print("  - Ancient road: ~70m long, 4m wide, NE-SW orientation")
print("  - Both invisible from satellite photos under forest canopy")`,
      challenge: 'Add a circular mound (perhaps a stupa) at position (75, 25) with radius 8m and height 0.5m above terrain. Does the slope analysis detect it as well as it detects the rectangular temple? Circular features are harder to distinguish from natural hills — why?',
      successHint: 'Remote sensing has made more archaeological discoveries in the last 20 years than the previous 200 years of field archaeology combined. The same technologies are used for climate monitoring, urban planning, disaster assessment, and military surveillance.',
    },
    {
      title: 'Digital reconstruction — rebuilding the past in 3D',
      concept: `From the scattered ruins of Madan Kamdev, can we reconstruct what the temple complex looked like at its peak? **Digital reconstruction** uses architectural evidence, comparative studies, and computational modeling to create 3D models of ancient structures.

The process:
1. **Photogrammetry**: take hundreds of photographs of the ruins from every angle. Software matches features across photos and generates a 3D point cloud. Accuracy: ~1mm.
2. **Comparative analysis**: study intact temples of the same period and style (Pala, Sena, Kamarupa traditions) to infer missing elements.
3. **Structural modeling**: apply physics — load calculations, material properties, structural limits — to determine what shapes could have stood.
4. **Texture mapping**: apply realistic materials (sandstone, laterite, plaster) based on surviving fragments.
5. **Uncertainty visualization**: distinguish between "known" (measured from ruins), "probable" (inferred from parallels), and "speculative" (artistic interpretation).

Modern tools: Agisoft Metashape for photogrammetry, Blender/3ds Max for 3D modeling, Unity/Unreal for interactive visualization. Some reconstructions are now in VR — you can "walk through" a temple that hasn't existed for 800 years.`,
      analogy: 'Digital reconstruction is like forensic facial reconstruction from a skull. The skull (ruins) provides the framework. Knowledge of anatomy (architectural rules) fills in soft tissue. Comparative examples (other faces/temples of the same type) guide the details. The result is an educated estimate, not a photograph — but it\'s far better than nothing.',
      storyConnection: 'The old teacher showed the children a printed 3D reconstruction of Madan Kamdev at its peak: a cluster of ornate temples with tall shikharas rising above the trees, a stone gateway, a sacred tank. "We can\'t know the exact colours or the flags that flew," he said, "but the proportions and structure — those are in the stones."',
      checkQuestion: 'A reconstruction shows a 25-meter tower on the Madan Kamdev temple. How confident should we be in this number?',
      checkAnswer: 'Moderately confident. The base dimensions are measured directly from the ruins. Architectural texts (Shilpashastras) prescribe tower-to-base ratios (typically 2:1 to 3:1). Comparable surviving temples from the same period provide reference points. Structural analysis confirms a 25m sandstone tower was feasible. The exact height might be ±3 meters, but the order of magnitude is reliable. This is why good reconstructions mark confidence levels: measured (green), inferred (yellow), speculative (red).',
      codeIntro: 'Build a simple 3D wireframe reconstruction of a temple using proportional rules.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

fig = plt.figure(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax = fig.add_subplot(111, projection='3d')
ax.set_facecolor('#111827')

# Temple proportions based on Shilpashastra rules
sanctum_w = 6   # meters
sanctum_d = 6
sanctum_h = 4
tower_h = 18    # ~3× base width
mandapa_w = 9
mandapa_d = 12
mandapa_h = 5
plinth_h = 1.5

def draw_box(ax, x0, y0, z0, w, d, h, color, alpha=0.3, label=None):
    """Draw a 3D box"""
    vertices = [
        [x0, y0, z0], [x0+w, y0, z0], [x0+w, y0+d, z0], [x0, y0+d, z0],
        [x0, y0, z0+h], [x0+w, y0, z0+h], [x0+w, y0+d, z0+h], [x0, y0+d, z0+h],
    ]
    faces = [
        [vertices[j] for j in [0,1,2,3]],
        [vertices[j] for j in [4,5,6,7]],
        [vertices[j] for j in [0,1,5,4]],
        [vertices[j] for j in [2,3,7,6]],
        [vertices[j] for j in [1,2,6,5]],
        [vertices[j] for j in [0,3,7,4]],
    ]
    poly = Poly3DCollection(faces, alpha=alpha, facecolor=color, edgecolor='white', linewidth=0.5)
    ax.add_collection3d(poly)

# Plinth
draw_box(ax, -2, -2, 0, mandapa_w + sanctum_w + 6, mandapa_d + 4, plinth_h, '#8B7355', alpha=0.4)

# Mandapa (hall) - green = inferred
draw_box(ax, 0, 0, plinth_h, mandapa_w, mandapa_d, mandapa_h, '#22c55e', alpha=0.3)

# Antarala (vestibule)
draw_box(ax, mandapa_w, 2, plinth_h, 2, 8, sanctum_h, '#3b82f6', alpha=0.3)

# Garbhagriha (sanctum) - yellow = measured from ruins
draw_box(ax, mandapa_w + 2, 3, plinth_h, sanctum_w, sanctum_d, sanctum_h, '#f59e0b', alpha=0.4)

# Shikhara (tower) - red = speculative height
# Simplified as tapered box layers
tower_x = mandapa_w + 2
tower_y = 3
layers = 8
for i in range(layers):
    frac = i / layers
    shrink = frac * 2
    layer_h = tower_h / layers
    draw_box(ax, tower_x + shrink, tower_y + shrink, plinth_h + sanctum_h + i * layer_h,
             sanctum_w - 2*shrink, sanctum_d - 2*shrink, layer_h,
             '#ef4444' if frac > 0.5 else '#f59e0b', alpha=0.3)

# Finial (amalaka + kalasha) on top
ax.scatter([tower_x + sanctum_w/2], [tower_y + sanctum_d/2],
           [plinth_h + sanctum_h + tower_h + 1], color='#f59e0b', s=100, zorder=5)

ax.set_xlabel('East (m)', color='white')
ax.set_ylabel('North (m)', color='white')
ax.set_zlabel('Height (m)', color='white')
ax.set_title('Digital Reconstruction: Madan Kamdev Temple', color='white', fontsize=13, pad=20)

# Confidence legend (text only since 3D legends are tricky)
ax.text2D(0.02, 0.95, 'Confidence levels:', transform=ax.transAxes, color='white', fontsize=10)
ax.text2D(0.02, 0.90, '  ■ Measured from ruins', transform=ax.transAxes, color='#f59e0b', fontsize=9)
ax.text2D(0.02, 0.85, '  ■ Inferred from parallels', transform=ax.transAxes, color='#22c55e', fontsize=9)
ax.text2D(0.02, 0.80, '  ■ Speculative', transform=ax.transAxes, color='#ef4444', fontsize=9)

ax.tick_params(colors='gray')
ax.set_xlim(-5, 25)
ax.set_ylim(-5, 20)
ax.set_zlim(0, 30)
ax.view_init(elev=20, azim=-60)

plt.tight_layout()
plt.show()

print("Reconstruction parameters:")
print(f"  Plinth: {mandapa_w + sanctum_w + 6}×{mandapa_d + 4}m, height {plinth_h}m [measured]")
print(f"  Mandapa: {mandapa_w}×{mandapa_d}m, height {mandapa_h}m [inferred]")
print(f"  Sanctum: {sanctum_w}×{sanctum_d}m, height {sanctum_h}m [measured]")
print(f"  Tower: base {sanctum_w}×{sanctum_d}m, height {tower_h}m [speculative]")
print(f"  Total height: {plinth_h + sanctum_h + tower_h:.1f}m")
print()
print("The reconstruction distinguishes three confidence levels:")
print("  Gold: directly measured from surviving ruins")
print("  Green: inferred from architectural parallels and texts")
print("  Red: speculative, based on proportional rules")`,
      challenge: 'The Shilpashastra says tower height should be 2-3× base width. Change tower_h to 12 (2×) and 18 (3×). How does the proportional "feel" change? Which looks more like surviving temples of the same era?',
      successHint: 'Digital reconstruction democratizes archaeology — anyone with a web browser can explore an ancient temple. It also enables hypothesis testing: "would this design be structurally stable?" The same 3D modeling tools are used in architecture, film, game design, and surgical planning.',
    },
    {
      title: 'Cultural heritage management — who owns the past?',
      concept: `Madan Kamdev is an ASI (Archaeological Survey of India) protected site. But "protection" raises complex questions: Who decides what gets protected? Who benefits from heritage tourism? How do you balance preservation with the needs of local communities?

**Cultural heritage management** (CHM) is the field that addresses these questions. It operates at the intersection of archaeology, law, economics, ethics, and community engagement.

Key frameworks:
- **UNESCO World Heritage**: global recognition, but criteria favor monumental architecture (bias against non-Western heritage forms)
- **Intangible heritage**: traditions, languages, rituals — can't be "excavated" but are equally valuable
- **Community archaeology**: involving local people in excavation, interpretation, and benefit-sharing
- **Repatriation**: returning stolen artifacts to their countries/communities of origin
- **Digital preservation**: 3D scanning creates permanent records independent of physical survival

The economics: heritage tourism generates revenue, but it also causes wear, commercialization, and sometimes displaces local communities. The challenge is finding models where heritage preservation benefits the people who live with it.

Data-driven CHM uses quantitative methods: visitor impact modeling, risk assessment (natural disasters, climate change), cost-benefit analysis of conservation interventions, and priority ranking of sites competing for limited preservation budgets.`,
      analogy: 'Cultural heritage management is like managing a family photo album. Everyone agrees it should be preserved, but: Who gets to keep it? Can others make copies? Should damaged photos be restored or left as-is? If the house catches fire, which photos do you save first? These are the same questions CHM faces, but at national and global scale.',
      storyConnection: 'The old teacher\'s final lesson was the hardest. "The stones of Madan Kamdev belong to everyone and no one. The ASI protects them, but the local villagers have worshipped here for generations. Tourists bring money but also erosion. Scientists want to excavate but each dig destroys what it reveals. There are no easy answers — only better questions."',
      checkQuestion: 'If you had a limited budget and could either fully restore one small temple at Madan Kamdev or do basic stabilization of ten crumbling structures, which would you choose and why?',
      checkAnswer: 'Most heritage managers would choose stabilization of ten structures. Reasons: 1) Stabilization prevents irreversible loss — you can always restore later, but you can\'t un-collapse a ruin. 2) Diversity is valuable — ten structures preserve more information than one perfect reconstruction. 3) Full restoration involves interpretation choices that may be wrong. 4) Cost-benefit: preventing loss is cheaper than reversing it. The triage principle from emergency medicine applies: save the most with the least.',
      codeIntro: 'Build a heritage site risk assessment model with multiple threat factors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Heritage site risk assessment model
# Score each site on multiple threat dimensions

sites = {
    'Madan Kamdev': {'weathering': 7, 'vegetation': 8, 'tourism': 5, 'development': 3, 'looting': 4, 'climate': 7, 'funding': 3},
    'Kamakhya Temple': {'weathering': 4, 'vegetation': 3, 'tourism': 9, 'development': 6, 'looting': 2, 'climate': 5, 'funding': 8},
    'Rang Ghar': {'weathering': 8, 'vegetation': 5, 'tourism': 4, 'development': 7, 'looting': 3, 'climate': 6, 'funding': 5},
    'Talatal Ghar': {'weathering': 6, 'vegetation': 6, 'tourism': 3, 'development': 4, 'looting': 5, 'climate': 6, 'funding': 2},
    'Ahom Maidams': {'weathering': 5, 'vegetation': 9, 'tourism': 2, 'development': 5, 'looting': 7, 'climate': 7, 'funding': 2},
}

threats = ['weathering', 'vegetation', 'tourism', 'development', 'looting', 'climate', 'funding']
threat_weights = [0.20, 0.15, 0.10, 0.15, 0.15, 0.15, 0.10]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Heatmap of threat scores
ax1.set_facecolor('#111827')
site_names = list(sites.keys())
data = np.array([[sites[s][t] for t in threats] for s in site_names])

im = ax1.imshow(data, cmap='YlOrRd', aspect='auto', vmin=0, vmax=10)
ax1.set_xticks(range(len(threats)))
ax1.set_xticklabels([t.capitalize() for t in threats], rotation=45, ha='right', color='white', fontsize=8)
ax1.set_yticks(range(len(site_names)))
ax1.set_yticklabels(site_names, color='white', fontsize=9)
ax1.set_title('Heritage Threat Assessment Matrix', color='white', fontsize=12)
plt.colorbar(im, ax=ax1, label='Threat level (0-10)')

# Add text annotations
for i in range(len(site_names)):
    for j in range(len(threats)):
        ax1.text(j, i, str(data[i, j]), ha='center', va='center',
                color='white' if data[i, j] > 5 else 'black', fontsize=9)

ax1.tick_params(colors='gray')

# 2. Weighted risk score and priority ranking
ax2.set_facecolor('#111827')
risk_scores = {}
for name in site_names:
    score = sum(sites[name][t] * w for t, w in zip(threats, threat_weights))
    risk_scores[name] = score

# Sort by risk
sorted_sites = sorted(risk_scores.items(), key=lambda x: x[1], reverse=True)
names_sorted = [s[0] for s in sorted_sites]
scores_sorted = [s[1] for s in sorted_sites]

colors_risk = ['#ef4444' if s > 6 else '#f59e0b' if s > 4.5 else '#22c55e' for s in scores_sorted]
bars = ax2.barh(names_sorted, scores_sorted, color=colors_risk)

ax2.set_xlabel('Weighted Risk Score', color='white')
ax2.set_title('Conservation Priority Ranking', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, score in zip(bars, scores_sorted):
    priority = 'URGENT' if score > 6 else 'HIGH' if score > 4.5 else 'MODERATE'
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'{score:.1f} ({priority})', va='center', color='white', fontsize=9)

ax2.axvline(6, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)
ax2.text(6.1, -0.3, 'Urgent threshold', color='#ef4444', fontsize=8)

plt.tight_layout()
plt.show()

print("Heritage Risk Assessment Results:")
print(f"  Threat weights: {dict(zip(threats, threat_weights))}")
print()
for name, score in sorted_sites:
    priority = 'URGENT' if score > 6 else 'HIGH' if score > 4.5 else 'MODERATE'
    print(f"  {name}: {score:.1f}/10 — {priority} priority")
    top_threats = sorted(threats, key=lambda t: sites[name][t], reverse=True)[:3]
    print(f"    Top threats: {', '.join(top_threats)}")
print()
print("Budget allocation principle: URGENT sites get 50% of budget,")
print("HIGH get 35%, MODERATE get 15%. This maximizes heritage preserved per dollar.")`,
      challenge: 'The Ahom Maidams are on the UNESCO tentative list. If they get World Heritage status, their "funding" score would change from 2 to 8 (more money). Recalculate. Does this change their priority ranking? What does this tell you about the power of international recognition?',
      successHint: 'Cultural heritage management turns philosophical questions ("what\'s worth saving?") into quantitative decisions ("this site has a risk score of 6.5 and needs $50,000 for stabilization"). From Madan Kamdev to Machu Picchu, the framework is the same — data-driven triage of an irreplaceable, finite resource.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Archaeological Science — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for archaeological science simulations. Click to start.</p>
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