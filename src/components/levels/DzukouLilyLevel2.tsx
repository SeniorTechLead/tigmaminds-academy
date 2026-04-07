import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DzukouLilyLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting altitude vs pressure — the barometric curve',
      concept: `**Matplotlib** is Python's primary plotting library. It lets us turn numbers into visual stories — and in ecology, a good chart often reveals patterns that tables hide.

The barometric formula gives pressure at altitude h:
**P(h) = P₀ × (1 - Lh/T₀)^(gM/RL)**

Where:
- P₀ = 101,325 Pa (sea level pressure)
- L = 0.0065 K/m (lapse rate)
- T₀ = 288.15 K (sea level temperature)
- g = 9.81 m/s², M = 0.029 kg/mol, R = 8.314 J/(mol·K)

This is an exponential-like decay — pressure drops quickly at first, then more slowly. Plotting it reveals the curve's shape far more clearly than a table.

📚 *In matplotlib, we create figures with plt.figure(), add data with plt.plot(), label axes with plt.xlabel()/plt.ylabel(), and display with plt.show().*`,
      analogy: 'A table of numbers is like reading a recipe — you understand each ingredient. A plot is like seeing the finished dish — the overall pattern is immediately obvious. The barometric curve, when plotted, shows at a glance that most pressure loss happens in the first 3 km.',
      storyConnection: 'The Dzukou Valley sits at the steep part of the pressure curve, where small altitude changes cause significant pressure shifts. This creates distinct ecological zones in a short vertical distance — which is why Dzukou has such unique biodiversity.',
      checkQuestion: 'Why is plotting the curve more useful than just knowing the formula?',
      checkAnswer: 'The formula tells you the exact pressure at one altitude. The plot shows you the entire relationship at once — where the curve is steep (big changes), where it flattens (small changes), and exactly where Dzukou sits on this continuum. Scientists use plots to identify thresholds and transitions that formulas alone do not reveal.',
      codeIntro: 'Create a publication-quality plot of atmospheric pressure vs altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Barometric formula parameters
P0 = 101325; T0 = 288.15; L = 0.0065
g = 9.81; M = 0.029; R = 8.314
exponent = g * M / (R * L)

altitudes = np.linspace(0, 5000, 500)
pressures = P0 * (1 - L * altitudes / T0) ** exponent

fig, ax = plt.subplots(figsize=(8, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax.plot(altitudes, pressures / 1000, color='#10b981', linewidth=2.5)
ax.axhline(y=P0 * (1 - L * 2450 / T0) ** exponent / 1000, color='#f59e0b',
           linestyle='--', alpha=0.7, label='Dzukou Valley (2,450 m)')
ax.axvline(x=2450, color='#f59e0b', linestyle='--', alpha=0.7)

ax.scatter([2450], [P0 * (1 - L * 2450 / T0) ** exponent / 1000],
           color='#f59e0b', s=100, zorder=5)
ax.annotate('Dzukou Valley\\n2,450 m, 75.1 kPa',
            xy=(2450, P0 * (1 - L * 2450 / T0) ** exponent / 1000),
            xytext=(3200, 85), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Altitude (m)', color='white', fontsize=12)
ax.set_ylabel('Pressure (kPa)', color='white', fontsize=12)
ax.set_title('Atmospheric Pressure vs Altitude', color='white', fontsize=14, fontweight='bold')
ax.tick_params(colors='white')
ax.spines['bottom'].set_color('white')
ax.spines['left'].set_color('white')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
plt.tight_layout()
plt.show()
print("Pressure at Dzukou: {:.1f} kPa ({:.1f}% of sea level)".format(
    P0 * (1 - L * 2450 / T0) ** exponent / 1000,
    (1 - L * 2450 / T0) ** exponent * 100))`,
      challenge: 'Add a second line showing the simplified linear approximation P = P₀ - 12*h. At what altitude does the linear model diverge significantly from the real curve?',
      successHint: 'You have created your first scientific plot. The visual immediately reveals that pressure drops fast at low altitudes and slows at high altitudes — an exponential pattern that tables cannot convey as clearly.',
    },
    {
      title: 'UV spectrum at altitude — wavelength matters',
      concept: `Not all UV radiation is equally dangerous. The atmosphere filters shorter wavelengths more aggressively than longer ones, creating a **spectral shift** at altitude.

At sea level, most UV-B (280-315 nm) is absorbed by ozone. But at higher altitudes with less atmosphere above:
- UV-A (315-400 nm): increases modestly (~10% per km)
- UV-B (280-315 nm): increases dramatically (~20% per km)
- UV-C (< 280 nm): still fully blocked by ozone

This spectral shift matters for plants because UV-B causes the most DNA damage. Mountain plants face not just MORE UV, but a more DANGEROUS UV spectrum.

📚 *numpy arrays let us do math on entire datasets at once. Instead of looping through each wavelength, we write: intensity = base * factor — and numpy applies it to every element.*`,
      analogy: 'Imagine a coffee filter. If you pour coffee through one filter (thick atmosphere), most of the fine grounds (short UV-B waves) are caught. Pour through half a filter (thin atmosphere at altitude), and more fine grounds slip through. The coarse grounds (long UV-A waves) pass through either way. Altitude removes part of the filter, and the short dangerous wavelengths benefit most.',
      storyConnection: 'The Dzukou Lily faces disproportionately more UV-B than UV-A compared to lowland flowers. This is why it needs anthocyanins that specifically absorb in the UV-B range — not just any pigment will do.',
      checkQuestion: 'If UV-B increases 20% per km but UV-A increases only 10% per km, what is the UV-B to UV-A ratio at Dzukou (2.45 km) compared to sea level?',
      checkAnswer: 'At sea level, assume ratio is 1:1 for simplicity. At 2.45 km: UV-B factor = 1 + 0.20×2.45 = 1.49, UV-A factor = 1 + 0.10×2.45 = 1.245. New ratio = 1.49/1.245 = 1.20. So UV-B is 20% stronger relative to UV-A at Dzukou. The UV spectrum has shifted toward the more damaging wavelengths.',
      codeIntro: 'Plot the UV spectrum at sea level vs Dzukou Valley altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(280, 400, 200)

# Model UV intensity at sea level (arbitrary units, normalized)
# UV-C is blocked, UV-B partially blocked, UV-A passes through
sea_level = np.where(wavelengths < 295, 0.01,
           np.where(wavelengths < 315,
                    0.3 * ((wavelengths - 280) / 35) ** 2,
                    0.8 + 0.2 * (wavelengths - 315) / 85))

# At altitude, shorter wavelengths gain more
# Increase factor: shorter wavelengths increase more per km
altitude_km = 2.45
gain_per_km = 0.20 - 0.10 * (wavelengths - 280) / 120  # 20% at 280nm, 10% at 400nm
altitude_factor = 1 + gain_per_km * altitude_km
dzukou = sea_level * altitude_factor

fig, ax = plt.subplots(figsize=(8, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax.fill_between(wavelengths, sea_level, alpha=0.3, color='#60a5fa', label='Sea level')
ax.fill_between(wavelengths, dzukou, alpha=0.3, color='#f87171', label='Dzukou (2,450 m)')
ax.plot(wavelengths, sea_level, color='#60a5fa', linewidth=2)
ax.plot(wavelengths, dzukou, color='#f87171', linewidth=2)

# Mark UV-B and UV-A regions
ax.axvspan(280, 315, alpha=0.1, color='#fbbf24', label='UV-B (dangerous)')
ax.axvspan(315, 400, alpha=0.05, color='#a78bfa')
ax.text(295, 1.1, 'UV-B', color='#fbbf24', fontsize=11, ha='center', fontweight='bold')
ax.text(357, 1.1, 'UV-A', color='#a78bfa', fontsize=11, ha='center', fontweight='bold')

ax.set_xlabel('Wavelength (nm)', color='white', fontsize=12)
ax.set_ylabel('Relative Intensity', color='white', fontsize=12)
ax.set_title('UV Spectrum: Sea Level vs Dzukou Valley', color='white', fontsize=14, fontweight='bold')
ax.tick_params(colors='white')
for spine in ax.spines.values(): spine.set_color('white')
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
plt.tight_layout()
plt.show()

ratio_increase = np.mean(dzukou[wavelengths < 315]) / np.mean(sea_level[wavelengths < 315])
print(f"UV-B increases by {(ratio_increase-1)*100:.1f}% at Dzukou altitude")`,
      challenge: 'Add a third curve for Mount Saramati (3,841 m, highest peak in Nagaland). How much more UV-B does it receive compared to Dzukou?',
      successHint: 'You now see why altitude creates a disproportionate UV-B increase. This spectral shift is the key evolutionary pressure driving anthocyanin production in mountain plants.',
    },
    {
      title: 'Anthocyanin absorption spectrum — matching defense to threat',
      concept: `Anthocyanins do not absorb all wavelengths equally. Their absorption spectrum peaks at specific wavelengths depending on the type of anthocyanin:

- **Cyanidin**: peak at ~520 nm (appears red)
- **Delphinidin**: peak at ~546 nm (appears blue-purple)
- **Pelargonidin**: peak at ~503 nm (appears orange-red)

But anthocyanins also have a secondary absorption peak in the UV range (270-290 nm), which is exactly where UV-B is most damaging. This dual absorption makes them effective both as visible pigments AND as UV shields.

The **Beer-Lambert Law** governs how much light is absorbed:
**A = ε × c × l**
Where A = absorbance, ε = molar absorptivity, c = concentration, l = path length.

📚 *Multiple numpy arrays can be combined element-wise: total = array1 + array2 adds corresponding elements. This is called **vectorized** operations.*`,
      analogy: 'An anthocyanin molecule is like a catcher with two baseball gloves — one catches visible blue-green light (making the flower look red/purple) and the other catches UV-B radiation (protecting the DNA). Most pigments only have one "glove." Anthocyanins\' double duty is why evolution favors them in high-UV environments.',
      storyConnection: 'The Dzukou Lily has evolved the perfect anthocyanin cocktail — pigments whose absorption spectrum overlaps precisely with the wavelengths that increase most at altitude. Its color is not decorative; it is a precisely tuned UV shield.',
      checkQuestion: 'If you doubled the anthocyanin concentration in a petal, would it block twice as much UV?',
      checkAnswer: 'Not quite. The Beer-Lambert Law says absorbance (A) doubles, but absorbance is logarithmic. Transmittance T = 10^(-A). If A goes from 1 to 2, transmittance goes from 10% to 1%. So doubling concentration reduces transmitted UV by 10x, not 2x. This is why even small increases in anthocyanin concentration can provide significant additional protection.',
      codeIntro: 'Plot the absorption spectrum of anthocyanins and overlay it with the UV threat spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(250, 650, 500)

# Model anthocyanin absorption spectrum (two peaks)
# UV peak around 280 nm
uv_peak = 0.7 * np.exp(-0.5 * ((wavelengths - 280) / 20) ** 2)
# Visible peak around 520 nm (cyanidin-type)
vis_peak = 1.0 * np.exp(-0.5 * ((wavelengths - 520) / 40) ** 2)
# Combined absorption
absorption = uv_peak + vis_peak

# UV threat at Dzukou altitude (normalized)
uv_threat = np.where(wavelengths < 280, 0,
            np.where(wavelengths < 400,
                     np.exp(-0.5 * ((wavelengths - 340) / 40) ** 2), 0))

fig, ax1 = plt.subplots(figsize=(8, 5))
ax1.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.fill_between(wavelengths, absorption, alpha=0.3, color='#a78bfa')
ax1.plot(wavelengths, absorption, color='#a78bfa', linewidth=2.5, label='Anthocyanin absorption')

ax2 = ax1.twinx()
ax2.fill_between(wavelengths, uv_threat, alpha=0.2, color='#f87171')
ax2.plot(wavelengths, uv_threat, color='#f87171', linewidth=2, linestyle='--', label='UV threat (Dzukou)')

# Highlight the overlap zone
overlap = np.minimum(absorption, uv_threat)
ax1.fill_between(wavelengths, 0, np.where((wavelengths > 260) & (wavelengths < 400),
                 np.minimum(absorption, uv_threat * absorption.max() / uv_threat.max()), 0),
                 alpha=0.4, color='#fbbf24', label='Protection zone')

ax1.annotate('UV peak\\n(280 nm)', xy=(280, 0.7), xytext=(200, 0.85),
             color='#a78bfa', fontsize=9, arrowprops=dict(arrowstyle='->', color='#a78bfa'))
ax1.annotate('Visible peak\\n(520 nm)', xy=(520, 1.0), xytext=(580, 0.85),
             color='#a78bfa', fontsize=9, arrowprops=dict(arrowstyle='->', color='#a78bfa'))

ax1.set_xlabel('Wavelength (nm)', color='white', fontsize=12)
ax1.set_ylabel('Anthocyanin Absorption', color='#a78bfa', fontsize=12)
ax2.set_ylabel('UV Threat Level', color='#f87171', fontsize=12)
ax1.set_title('Anthocyanin Defense vs UV Threat', color='white', fontsize=14, fontweight='bold')
ax1.tick_params(colors='white'); ax2.tick_params(colors='#f87171')
for spine in ax1.spines.values(): spine.set_color('#374151')
ax1.legend(loc='upper left', facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
ax2.legend(loc='upper right', facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
plt.tight_layout()
plt.show()
print("The anthocyanin UV peak at 280 nm overlaps precisely with the most dangerous UV-B wavelengths.")
print("This is not coincidence — it is natural selection at work over millions of years.")`,
      challenge: 'Add a second anthocyanin type (delphinidin, visible peak at 546 nm, UV peak at 275 nm). Plot both types and determine which provides better UV protection.',
      successHint: 'You have visualized one of the most elegant examples of evolutionary fine-tuning: a pigment whose absorption spectrum perfectly matches the threat spectrum. Form follows function in the deepest sense.',
    },
    {
      title: 'Population density heatmap — where do lilies grow?',
      concept: `Real populations are not evenly distributed. The Dzukou Lily grows in patches, influenced by:
- **Slope aspect**: south-facing slopes get more sun (and UV)
- **Soil moisture**: valley bottoms are wetter
- **Altitude**: the lily prefers a narrow altitude band (~2,400-2,600 m)
- **Competition**: other plants crowd out lilies in some areas

A **heatmap** visualizes 2D data using color intensity. Each cell represents a small area of the valley, and its color shows the lily density. This reveals spatial patterns that raw numbers cannot.

📚 *numpy's np.random module generates random data for simulations. np.random.poisson(mean, size) generates counts following a Poisson distribution — perfect for modeling organism counts.*`,
      analogy: 'A heatmap is a weather map for ecology. Just as a temperature map shows hot spots in red and cold spots in blue, a density heatmap shows where lilies are abundant (bright) and scarce (dark). One glance reveals the spatial pattern that would take hours to extract from a data table.',
      storyConnection: 'Conservation managers at Dzukou Valley need to know exactly where the lilies concentrate. A density heatmap tells them which areas to protect most urgently and which trails to reroute to avoid trampling the densest populations.',
      checkQuestion: 'Why would lily density be higher on east-facing slopes than north-facing slopes in Nagaland?',
      checkAnswer: 'East-facing slopes receive morning sun, which is gentler (lower angle, less UV) and helps evaporate dew. North-facing slopes in the Northern Hemisphere receive less direct sunlight overall, so they are cooler and wetter. The lily prefers moderate sun — enough for photosynthesis, not so much that UV damage overwhelms its defenses. East-facing slopes offer this balance.',
      codeIntro: 'Generate and visualize a spatial density map of lily populations across the valley.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model Dzukou Valley as a 50x50 grid (each cell = 10m x 10m)
grid_size = 50
valley = np.zeros((grid_size, grid_size))

# Create altitude map (higher in north, valley in center)
x = np.linspace(0, 1, grid_size)
y = np.linspace(0, 1, grid_size)
X, Y = np.meshgrid(x, y)
altitude = 2350 + 200 * (0.5 - np.abs(Y - 0.5)) + 50 * np.sin(3 * X)

# Lily preference: peaks at 2450m, drops off above/below
altitude_pref = np.exp(-0.5 * ((altitude - 2450) / 40) ** 2)

# Moisture preference: higher in valley center
moisture = np.exp(-0.5 * ((X - 0.5) / 0.3) ** 2)

# Combined habitat suitability
suitability = altitude_pref * moisture
suitability = suitability / suitability.max()

# Generate lily counts (Poisson with spatially varying mean)
max_density = 8  # max lilies per 10m x 10m cell
lily_counts = np.random.poisson(max_density * suitability)

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')

# Altitude map
im1 = axes[0].imshow(altitude, cmap='terrain', origin='lower')
axes[0].set_title('Altitude (m)', color='white', fontsize=12, fontweight='bold')
cb1 = plt.colorbar(im1, ax=axes[0], shrink=0.8)
cb1.ax.yaxis.set_tick_params(color='white')
cb1.ax.yaxis.set_ticklabels(cb1.ax.yaxis.get_ticklabels(), color='white')

# Suitability map
im2 = axes[1].imshow(suitability, cmap='YlGn', origin='lower', vmin=0, vmax=1)
axes[1].set_title('Habitat Suitability', color='white', fontsize=12, fontweight='bold')
cb2 = plt.colorbar(im2, ax=axes[1], shrink=0.8)
cb2.ax.yaxis.set_tick_params(color='white')
cb2.ax.yaxis.set_ticklabels(cb2.ax.yaxis.get_ticklabels(), color='white')

# Lily density heatmap
im3 = axes[2].imshow(lily_counts, cmap='magma', origin='lower')
axes[2].set_title('Lily Count per Cell', color='white', fontsize=12, fontweight='bold')
cb3 = plt.colorbar(im3, ax=axes[2], shrink=0.8)
cb3.ax.yaxis.set_tick_params(color='white')
cb3.ax.yaxis.set_ticklabels(cb3.ax.yaxis.get_ticklabels(), color='white')

for ax in axes:
    ax.set_xlabel('West → East', color='white', fontsize=10)
    ax.set_ylabel('South → North', color='white', fontsize=10)

plt.suptitle('Dzukou Valley Lily Distribution Model', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

total_lilies = lily_counts.sum()
area_km2 = (grid_size * 10 / 1000) ** 2
print(f"Total estimated lilies: {total_lilies:,}")
print(f"Study area: {area_km2:.2f} km²")
print(f"Mean density: {lily_counts.mean():.1f} per cell ({lily_counts.mean()*100:.0f} per hectare)")
print(f"Peak density: {lily_counts.max()} per cell ({lily_counts.max()*100} per hectare)")`,
      challenge: 'Add a "trail" running diagonally across the map (set cells along the trail to 0 lilies). Calculate what percentage of the population is lost if tourists trample a 2-cell-wide trail through the densest area.',
      successHint: 'You have combined altitude modeling, habitat suitability, and spatial statistics into a single visualization. This is how real conservation ecology works — multiple layers of data combined to reveal patterns.',
    },
    {
      title: 'Growth curves — modeling the lily\'s annual cycle',
      concept: `The Dzukou Lily follows a seasonal growth pattern controlled by temperature:
- **Dormant** (Nov-Mar): below ground as a bulb, surviving frost
- **Emergence** (Apr): shoots appear as temperatures cross ~10°C
- **Vegetative growth** (Apr-Jun): leaves expand, photosynthesis builds energy reserves
- **Flowering** (Jul-Aug): the famous bloom period
- **Seed set** (Sep-Oct): fruits develop, seeds disperse
- **Senescence** (Oct-Nov): above-ground parts die back

This can be modeled as a **logistic growth curve**:
**H(t) = H_max / (1 + e^(-k(t - t_mid)))**

Where H is height, H_max is maximum height, k controls growth speed, and t_mid is the time of fastest growth.

📚 *matplotlib's plt.axvspan() shades a vertical region — perfect for marking seasons or phases on a time-series plot.*`,
      analogy: 'The lily\'s growth curve is like a startup company: slow initial progress (emergence), explosive growth in the middle (vegetative phase), then leveling off at maximum size (flowering). The logistic curve captures this S-shape that appears everywhere in biology — from bacteria to populations to individual organisms.',
      storyConnection: 'The villagers near Dzukou know the lily blooms in July-August. The growth model explains why: the plant needs 3-4 months of warm temperatures to build enough energy for flowering. A late spring or early frost shortens this window, reducing blooms — which is why climate change threatens the spectacle.',
      checkQuestion: 'If climate change shifts spring arrival 2 weeks earlier and autumn frost 2 weeks later, does the lily benefit or suffer?',
      checkAnswer: 'It could benefit in the short term — a longer growing season means more time to photosynthesize and produce bigger flowers. But it could suffer if: (1) pollinators do not shift their timing to match, creating a mismatch, (2) competing plants also get a longer season and crowd out the lily, or (3) reduced winter cold fails to break dormancy properly. The net effect depends on which factor dominates.',
      codeIntro: 'Plot the Dzukou Lily growth curve through an entire year.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day of year (1 = Jan 1, 365 = Dec 31)
days = np.arange(1, 366)
months_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

# Logistic growth model
H_max = 60  # cm maximum height
k = 0.06    # growth rate
t_emerge = 100   # day ~Apr 10 (emergence)
t_mid = 155      # day ~Jun 4 (fastest growth)
t_senesce = 280  # day ~Oct 7 (die-back begins)

height = np.zeros_like(days, dtype=float)
for i, d in enumerate(days):
    if d < t_emerge:
        height[i] = 0  # dormant
    elif d < t_senesce:
        height[i] = H_max / (1 + np.exp(-k * (d - t_mid)))
    else:
        # Senescence: exponential decay
        peak_h = H_max / (1 + np.exp(-k * (t_senesce - t_mid)))
        height[i] = peak_h * np.exp(-0.03 * (d - t_senesce))

# Flowering period
bloom_start, bloom_end = 182, 243  # Jul 1 - Aug 31

fig, ax = plt.subplots(figsize=(10, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Phase shading
ax.axvspan(1, t_emerge, alpha=0.15, color='#6366f1', label='Dormant')
ax.axvspan(t_emerge, bloom_start, alpha=0.15, color='#10b981', label='Vegetative growth')
ax.axvspan(bloom_start, bloom_end, alpha=0.2, color='#f59e0b', label='Flowering')
ax.axvspan(bloom_end, t_senesce, alpha=0.15, color='#8b5cf6', label='Seed set')
ax.axvspan(t_senesce, 365, alpha=0.15, color='#6366f1')

ax.plot(days, height, color='#10b981', linewidth=3)
ax.fill_between(days, height, alpha=0.2, color='#10b981')

ax.set_xticks(months_starts)
ax.set_xticklabels(month_names, color='white', fontsize=9)
ax.set_xlabel('Month', color='white', fontsize=12)
ax.set_ylabel('Plant Height (cm)', color='white', fontsize=12)
ax.set_title('Dzukou Lily Annual Growth Cycle', color='white', fontsize=14, fontweight='bold')
ax.tick_params(colors='white')
for spine in ['top', 'right']: ax.spines[spine].set_visible(False)
for spine in ['bottom', 'left']: ax.spines[spine].set_color('white')
ax.legend(loc='upper left', facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
ax.set_xlim(1, 365); ax.set_ylim(0, 70)
plt.tight_layout()
plt.show()

bloom_height = H_max / (1 + np.exp(-k * (210 - t_mid)))
print(f"Peak height during bloom: {bloom_height:.1f} cm")
print(f"Growing season: {t_senesce - t_emerge} days ({(t_senesce-t_emerge)/30:.1f} months)")
print(f"Flowering window: {bloom_end - bloom_start} days")`,
      challenge: 'Model climate change by shifting t_emerge 14 days earlier and t_senesce 14 days later. How does the flowering height change? Does a longer season always mean taller plants?',
      successHint: 'You have modeled a complete biological cycle using a logistic growth curve plus senescence. This type of phenological model is used by ecologists to predict how climate change affects flowering times worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Plant Adaptation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
