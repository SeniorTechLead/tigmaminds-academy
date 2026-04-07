import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanchenjungaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualizing the temperature profile — lapse rate in action',
      concept: `**Orographic precipitation** is the process by which moist air is forced upward by a mountain, cools, and drops its moisture as rain or snow. Kanchenjunga intercepts monsoon air from the Bay of Bengal, creating some of the heaviest snowfall in the Himalayas.

As air rises, it cools at the **dry adiabatic lapse rate** (10°C/km) until it reaches its dew point, then at the **moist adiabatic lapse rate** (~5-6°C/km) as water vapor condenses and releases latent heat.

This means the windward side (east) of Kanchenjunga is wet and cloud-covered, while the leeward side (west) is drier — a **rain shadow**. The eastern glaciers (like Zemu) receive far more snow than western ones.

Plotting temperature vs. altitude reveals this dual-rate structure: a steep drop in dry air, a gentler drop in moist air, with the transition at the cloud base.

📚 *We will use matplotlib to create clear, informative scientific plots with proper labels and styling.*`,
      analogy: 'Imagine wringing out a wet towel as you carry it upstairs. Each floor (altitude), you squeeze out more water (precipitation). By the top floor, the towel is dry. Going back down the other side, you have a dry towel — no more water to squeeze out. That is why one side of a mountain is wet and the other is dry.',
      storyConnection: 'The story\'s "five treasures" are sustained by moisture from the Bay of Bengal. The monsoon winds climb Kanchenjunga\'s eastern flanks, depositing snow that builds the glaciers. Without this orographic process, there would be no glaciers, no rivers, and the treasures would never have formed.',
      checkQuestion: 'If air starts at 30°C at sea level with a dew point of 20°C, at what altitude does it start forming clouds? (Use dry lapse rate = 10°C/km)',
      checkAnswer: 'The air must cool by 30 - 20 = 10°C. At 10°C/km dry rate: altitude = 10/10 = 1 km = 1,000 m. Above this, the moist lapse rate takes over. This is the Lifting Condensation Level (LCL) — the cloud base altitude.',
      codeIntro: 'Plot the dual lapse rate temperature profile from sea level to the summit of Kanchenjunga.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dual lapse rate model
sea_temp = 30       # °C at sea level
dew_point = 20      # °C
dry_rate = 10       # °C/km
moist_rate = 5.5    # °C/km

# Cloud base where temp = dew point
lcl = (sea_temp - dew_point) / dry_rate  # km

# Altitude arrays
alt_dry = np.linspace(0, lcl, 50)
alt_moist = np.linspace(lcl, 8.586, 100)

# Temperature arrays
temp_dry = sea_temp - dry_rate * alt_dry
temp_moist = temp_dry[-1] - moist_rate * (alt_moist - lcl)

fig, ax = plt.subplots(figsize=(8, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax.plot(temp_dry, alt_dry, 'r-', linewidth=2.5, label='Dry adiabatic (10°C/km)')
ax.plot(temp_moist, alt_moist, 'b-', linewidth=2.5, label='Moist adiabatic (5.5°C/km)')
ax.axhline(y=lcl, color='gray', linestyle='--', alpha=0.7, label=f'Cloud base ({lcl:.1f} km)')
ax.axhline(y=8.586, color='gold', linestyle=':', alpha=0.7, label='Summit (8,586 m)')
ax.axvline(x=0, color='cyan', linestyle=':', alpha=0.5, label='Freezing (0°C)')

# Mark key points
ax.plot(0, (sea_temp) / dry_rate if lcl > sea_temp/dry_rate else (sea_temp - 0)/dry_rate, 'c*', markersize=0)
summit_temp = temp_moist[-1]
ax.annotate(f'Summit: {summit_temp:.1f}°C', xy=(summit_temp, 8.586),
            xytext=(summit_temp + 5, 8), color='gold', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='gold'))

ax.set_xlabel('Temperature (°C)', color='white', fontsize=12)
ax.set_ylabel('Altitude (km)', color='white', fontsize=12)
ax.set_title('Temperature Profile: Sea Level to Kanchenjunga Summit', color='white', fontsize=13, fontweight='bold')
ax.legend(fontsize=9, facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.2)
plt.tight_layout()
plt.savefig('temperature_profile.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Cloud base: {lcl:.1f} km ({lcl*1000:.0f} m)")
print(f"Summit temperature: {summit_temp:.1f}°C")`,
      challenge: 'Add a second curve showing a dry winter day (sea level 15°C, dew point 0°C). How does the cloud base differ? What does this mean for winter snowfall?',
      successHint: 'You have created your first scientific plot with dual data series, annotations, and a legend. The dual lapse rate is why mountains create their own weather — and why Kanchenjunga\'s eastern glaciers are fed by monsoon moisture.',
    },
    {
      title: 'Ice core data — reading the climate diary',
      concept: `**Ice cores** are cylinders of ice drilled from glaciers. Each layer preserves a record of past climate — like tree rings, but spanning thousands of years.

What ice cores reveal:
- **Oxygen isotope ratios (δ¹⁸O)**: heavier isotopes evaporate less easily. Warmer periods = more ¹⁸O in precipitation = higher δ¹⁸O values. A proxy for temperature.
- **Trapped air bubbles**: contain ancient atmosphere — direct measurements of past CO₂, methane, etc.
- **Dust layers**: volcanic eruptions, desert winds, forest fires
- **Annual layers**: seasonal variation in density/chemistry allows year-by-year counting

A core from a Kanchenjunga glacier might span 200-500 years (thinner than polar cores because Himalayan ice flows faster and ablates more).

Scientists at the Birbal Sahni Institute have studied ice cores from nearby glaciers. The data show clear warming trends since the 1850s, correlating with industrial CO₂ rise.

📚 *We will use numpy arrays and matplotlib bar charts to analyze simulated ice core data.*`,
      analogy: 'An ice core is like a diary that wrote itself. Each year\'s snowfall is a new page. The chemistry of each page records the temperature, the air quality, and even distant volcanic eruptions. We drill down through the pages to read history backward — the surface is today, the bottom is centuries ago.',
      storyConnection: 'The five treasures of Kanchenjunga include "sacred texts." In a scientific sense, ice cores are the sacred texts of climate science — they hold records of atmospheric conditions written by nature itself. Reading these frozen manuscripts tells us how the world\'s climate has changed.',
      checkQuestion: 'Why do ice cores from Kanchenjunga only span hundreds of years, while Antarctic cores span 800,000 years?',
      checkAnswer: 'Three reasons: (1) Himalayan glaciers flow much faster, so old ice gets pushed to the terminus and melts. (2) They are much thinner — hundreds of meters vs. 3 km in Antarctica. (3) Higher temperatures cause more basal melting, destroying the oldest layers. Antarctica\'s extreme cold and minimal flow preserve ancient ice.',
      codeIntro: 'Create a bar chart of simulated ice core δ¹⁸O values to visualize temperature trends over 200 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated ice core δ18O values (higher = warmer)
years = np.arange(1824, 2024)
n = len(years)

# Base trend: gradual warming with acceleration after 1950
baseline = -18 + 0.005 * (years - 1824)
acceleration = np.where(years > 1950, 0.015 * (years - 1950), 0)
noise = np.random.normal(0, 0.3, n)
d18o = baseline + acceleration + noise

# Decadal averages for clearer trend
decade_starts = np.arange(1824, 2024, 10)
decade_means = [d18o[(years >= d) & (years < d+10)].mean() for d in decade_starts]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')

# Annual data
ax1.plot(years, d18o, color='#60a5fa', alpha=0.5, linewidth=0.8, label='Annual δ¹⁸O')
# Moving average
window = 11
smoothed = np.convolve(d18o, np.ones(window)/window, mode='valid')
ax1.plot(years[window//2:-(window//2)], smoothed, color='#f59e0b', linewidth=2, label=f'{window}-year average')
ax1.set_title('Simulated Ice Core: Kanchenjunga Glacier', color='white', fontsize=13, fontweight='bold')
ax1.set_ylabel('δ¹⁸O (‰)', color='white', fontsize=11)
ax1.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='white')
ax1.grid(alpha=0.2)

# Decadal bars
colors = ['#3b82f6' if m < np.mean(decade_means) else '#ef4444' for m in decade_means]
ax2.bar(decade_starts + 5, decade_means, width=8, color=colors, alpha=0.8)
ax2.axhline(y=np.mean(decade_means), color='white', linestyle='--', alpha=0.5, label='200-year mean')
ax2.set_title('Decadal Averages (blue = cooler, red = warmer)', color='white', fontsize=13, fontweight='bold')
ax2.set_xlabel('Year', color='white', fontsize=11)
ax2.set_ylabel('Mean δ¹⁸O (‰)', color='white', fontsize=11)
ax2.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='white')
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.savefig('ice_core.png', dpi=100, facecolor='#1f2937')
plt.show()

print(f"1824-1850 mean δ¹⁸O: {d18o[:26].mean():.2f}‰")
print(f"2000-2023 mean δ¹⁸O: {d18o[-24:].mean():.2f}‰")
print(f"Warming signal: {d18o[-24:].mean() - d18o[:26].mean():.2f}‰")`,
      challenge: 'Add a volcanic eruption signature: drop δ¹⁸O by 1.0 at year 1883 (Krakatoa). How visible is it in the annual data vs. the smoothed curve?',
      successHint: 'You have created a publication-quality dual-panel plot. Ice core analysis is real science — the patterns you see in this simulation mirror actual data from Himalayan cores. The post-1950 acceleration is one of the clearest signals of human-caused warming.',
    },
    {
      title: 'Mass balance — the glacier\'s annual health checkup',
      concept: `**Mass balance** is the difference between what a glacier gains (accumulation) and what it loses (ablation) over a year, typically measured in meters of water equivalent (m w.e.).

- **Positive mass balance**: glacier is growing (gaining more than losing)
- **Negative mass balance**: glacier is shrinking
- **Equilibrium**: gains = losses (steady state)

Glaciologists measure mass balance by:
1. **Stakes**: metal poles drilled into the ice. Measure how much ice melts around them.
2. **Snow pits**: dig to last summer\'s surface, measure new snow depth and density.
3. **Geodetic**: compare satellite/aerial photos over time to measure volume change.
4. **Gravimetric**: GRACE satellites measure tiny changes in Earth\'s gravity field caused by ice loss.

The World Glacier Monitoring Service reports that Himalayan glaciers have had predominantly negative mass balance since the 1990s, averaging about -0.5 to -0.8 m w.e./year.

📚 *We will use numpy and matplotlib to plot mass balance data and identify long-term trends.*`,
      analogy: 'Mass balance is like weighing yourself every year. Positive means you gained weight (the glacier grew). Negative means you lost weight (the glacier shrank). A string of negative years means the glacier is on a long-term diet — an involuntary one caused by climate change.',
      storyConnection: 'If the five treasures represent Kanchenjunga\'s wealth, mass balance is the annual audit. Year after year of negative balance is like a treasury being drained. The story\'s eternal protector is slowly going bankrupt.',
      checkQuestion: 'If a glacier has a mass balance of -0.6 m w.e./year and is 200 m thick, how many years until it disappears (assuming constant rate)?',
      checkAnswer: 'Converting: 200 m of ice = 200 × (900/1000) = 180 m water equivalent. At -0.6 m w.e./year: 180/0.6 = 300 years. But mass balance gets more negative as the glacier thins (less high-altitude area = less accumulation), so the real timeline is shorter — maybe 150-200 years.',
      codeIntro: 'Plot 30 years of simulated mass balance data for the Zemu Glacier with cumulative loss tracking.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(17)

years = np.arange(1994, 2024)
n = len(years)

# Mass balance: trending negative with variability
trend = -0.3 - 0.015 * np.arange(n)  # worsening over time
variability = np.random.normal(0, 0.2, n)
mass_balance = trend + variability

cumulative = np.cumsum(mass_balance)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')

# Annual mass balance bars
colors = ['#3b82f6' if mb >= 0 else '#ef4444' for mb in mass_balance]
ax1.bar(years, mass_balance, color=colors, alpha=0.8, width=0.8)
ax1.axhline(y=0, color='white', linewidth=0.5)
ax1.set_title('Annual Mass Balance — Zemu Glacier (simulated)', color='white', fontsize=13, fontweight='bold')
ax1.set_ylabel('Mass Balance (m w.e.)', color='white', fontsize=11)
ax1.tick_params(colors='white')
ax1.grid(alpha=0.2, axis='y')

# Add trend line
z = np.polyfit(years, mass_balance, 1)
ax1.plot(years, np.polyval(z, years), 'gold', linewidth=2, linestyle='--', label=f'Trend: {z[0]:.3f} m w.e./yr²')
ax1.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')

# Cumulative
ax2.fill_between(years, cumulative, 0, alpha=0.3, color='#ef4444')
ax2.plot(years, cumulative, 'r-', linewidth=2)
ax2.set_title('Cumulative Mass Loss', color='white', fontsize=13, fontweight='bold')
ax2.set_xlabel('Year', color='white', fontsize=11)
ax2.set_ylabel('Cumulative (m w.e.)', color='white', fontsize=11)
ax2.tick_params(colors='white')
ax2.grid(alpha=0.2, axis='y')

plt.tight_layout()
plt.savefig('mass_balance.png', dpi=100, facecolor='#1f2937')
plt.show()

positive_years = np.sum(mass_balance >= 0)
print(f"Positive balance years: {positive_years}/{n}")
print(f"Total ice lost: {abs(cumulative[-1]):.1f} m water equivalent")
print(f"Average annual loss: {mass_balance.mean():.2f} m w.e./yr")
print(f"Trend: mass balance worsening by {abs(z[0]):.3f} m w.e. each year")`,
      challenge: 'What if a massive volcanic eruption in 2010 cooled the climate for 2 years (add +0.5 to mass balance for 2010-2011)? Does it change the overall trend?',
      successHint: 'You have built a mass balance analysis with trend detection. The accelerating negative trend is the central story of Himalayan glaciology — and the data you see here mirrors real measurements from WGMS monitoring stations.',
    },
    {
      title: 'Glacier area vs. elevation — the hypsometric curve',
      concept: `A **hypsometric curve** shows how a glacier\'s area is distributed across different elevations. This matters because:
- Area at high elevation = accumulation zone (gains ice)
- Area at low elevation = ablation zone (loses ice)

A "top-heavy" glacier (more area at high altitude) is healthier — it has a large accumulation zone. A "bottom-heavy" glacier is vulnerable — too much area is in the warm ablation zone.

As glaciers retreat, they lose their low-elevation tongues first. This actually makes the ratio better temporarily — but only because they are losing area entirely, not because they are gaining at the top.

The shape of the hypsometric curve also affects a glacier\'s sensitivity to warming:
- **Flat summit plateau + steep tongue**: warming raises ELA across a huge area suddenly
- **Evenly distributed**: gradual response to warming
- **Narrow valley glacier**: retreat is linear with warming

Kanchenjunga\'s glaciers vary widely — from broad cirque glaciers to narrow valley tongues — giving them different vulnerabilities.

📚 *We will use numpy histograms and matplotlib to build and interpret hypsometric curves.*`,
      analogy: 'Think of a glacier\'s hypsometric curve like a cross-section of a wedding cake. A cake wider at the top (more area at high elevation) is stable — it has a strong foundation of accumulation. A cake wider at the bottom (more area at low elevation) is top-heavy in reverse — vulnerable to having its base melted away.',
      storyConnection: 'The five treasures are said to rest at different heights on Kanchenjunga. The hypsometric curve tells us which heights hold the most ice — the glacier\'s real treasure. As the ELA rises, entire elevation bands switch from accumulation to ablation, unlocking (destroying) the frozen treasure.',
      checkQuestion: 'Two glaciers have the same total area. Glacier A has 70% above the ELA. Glacier B has 40% above the ELA. Which is healthier and why?',
      checkAnswer: 'Glacier A is much healthier. With 70% of its area in the accumulation zone, it has a strong surplus of snowfall over melt. Glacier B, with only 40% above the ELA, is likely in negative mass balance — more of it is melting than growing. The Accumulation Area Ratio (AAR) of 0.7 is considered healthy; below 0.5 signals decline.',
      codeIntro: 'Build a hypsometric curve for the Zemu Glacier and analyze its vulnerability to a rising ELA.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(7)

# Simulated Zemu Glacier area distribution
# Elevation bands from 4800m to 8200m
elevations = np.arange(4800, 8200, 100)
n_bands = len(elevations)

# Area in each band (km²) — typical valley glacier shape
# Most area at mid-elevations, less at top and bottom
mid = 6200
area = 2.5 * np.exp(-0.5 * ((elevations - mid) / 600) ** 2)
area += np.random.uniform(0, 0.3, n_bands)
area = np.maximum(area, 0.05)

total_area = area.sum()
ela = 5500  # current ELA in meters

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')

# Hypsometric curve (area vs elevation)
colors = ['#3b82f6' if e >= ela else '#ef4444' for e in elevations]
ax1.barh(elevations, area, height=80, color=colors, alpha=0.8)
ax1.axhline(y=ela, color='gold', linewidth=2, linestyle='--', label=f'ELA ({ela}m)')
ax1.set_xlabel('Area (km²)', color='white', fontsize=11)
ax1.set_ylabel('Elevation (m)', color='white', fontsize=11)
ax1.set_title('Hypsometric Curve — Zemu Glacier', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='white')
ax1.grid(alpha=0.2, axis='x')

# AAR for different ELAs
elas = np.arange(5000, 6500, 100)
aars = []
for e in elas:
    accum = area[elevations >= e].sum()
    aars.append(accum / total_area)

ax2.plot(elas, aars, 'cyan', linewidth=2.5)
ax2.axhline(y=0.5, color='#ef4444', linestyle='--', alpha=0.7, label='Critical AAR = 0.5')
ax2.axhline(y=0.7, color='#22c55e', linestyle='--', alpha=0.7, label='Healthy AAR = 0.7')
ax2.axvline(x=ela, color='gold', linestyle=':', alpha=0.7, label=f'Current ELA ({ela}m)')

ax2.set_xlabel('ELA (m)', color='white', fontsize=11)
ax2.set_ylabel('Accumulation Area Ratio', color='white', fontsize=11)
ax2.set_title('AAR Sensitivity to ELA Rise', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='white')
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.savefig('hypsometry.png', dpi=100, facecolor='#1f2937')
plt.show()

accum_area = area[elevations >= ela].sum()
aar = accum_area / total_area
print(f"Total glacier area: {total_area:.1f} km²")
print(f"Accumulation zone: {accum_area:.1f} km² ({aar*100:.0f}%)")
print(f"Current AAR: {aar:.2f} — {'Healthy' if aar >= 0.5 else 'Critical!'}")
print(f"\\nIf ELA rises 200m to {ela+200}m:")
new_accum = area[elevations >= ela+200].sum()
print(f"  New AAR: {new_accum/total_area:.2f} — {'Healthy' if new_accum/total_area >= 0.5 else 'Critical!'}") `,
      challenge: 'Create a "what-if" scenario: if the lower 5 elevation bands (below 5300m) melt away entirely (area = 0), recalculate the AAR. Does losing the ablation zone actually improve the ratio?',
      successHint: 'You have built a hypsometric analysis — one of the core tools glaciologists use to assess glacier health. The AAR sensitivity plot is especially powerful: it shows exactly how much warming the glacier can tolerate before crossing into decline.',
    },
    {
      title: 'Meltwater discharge — from ice to river',
      concept: `Glaciers are frozen reservoirs that release water slowly through the warm months. **Meltwater discharge** is the volume of water flowing from a glacier per unit time, typically measured in cubic meters per second (m³/s).

The Teesta River, Sikkim\'s lifeline, receives significant flow from Kanchenjunga\'s glaciers. Glacier melt contributes:
- **30-50%** of Teesta flow in summer
- **Nearly 100%** in spring (before monsoon rains begin)
- **Critical baseflow** in drought years when rainfall fails

Meltwater discharge follows a daily cycle:
- **Minimum**: early morning (4-6 AM) — overnight cooling freezes surface
- **Maximum**: late afternoon (3-5 PM) — solar heating peaks around noon, melt takes time to flow through glacier plumbing
- **Lag**: 3-5 hours between peak solar input and peak discharge

As glaciers shrink, an alarming pattern emerges:
- **Short term**: more meltwater (thinner glacier, more exposed ice)
- **Peak water**: maximum discharge when glacier retreat rate peaks
- **Long term**: less meltwater as the glacier disappears — rivers decline

Many Himalayan rivers may have already passed "peak water."

📚 *We will combine numpy array operations with matplotlib to model and plot meltwater discharge patterns.*`,
      analogy: 'A glacier melting into a river is like spending your savings. At first, you have plenty to spend (the glacier is large). You might even spend more than you earn (meltwater exceeds snowfall). But your savings shrink. Eventually, you hit zero — no glacier, no summer meltwater, just whatever rain falls.',
      storyConnection: 'The Teesta River, born from Kanchenjunga\'s glaciers, is sacred in Sikkimese culture. The five treasures include grain — and grain needs irrigation. As glaciers disappear, the Teesta\'s flow will diminish, threatening the agriculture that feeds Sikkim. The story\'s treasures are interconnected.',
      checkQuestion: 'Why does peak meltwater discharge occur in the late afternoon, not at noon when the sun is strongest?',
      checkAnswer: 'Three reasons for the 3-5 hour lag: (1) Ice takes time to absorb enough heat to melt — thermal inertia. (2) Meltwater must travel through the glacier\'s internal plumbing (crevasses, moulins, subglacial channels). (3) The surface continues absorbing heat after solar noon because incoming radiation exceeds outgoing radiation until mid-afternoon.',
      codeIntro: 'Model and plot the daily and seasonal meltwater discharge cycle for a Kanchenjunga glacier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Daily discharge cycle
hours = np.linspace(0, 24, 100)
# Peak at 4PM (16:00), minimum at 5AM
daily_pattern = 1.5 + 1.2 * np.sin(2 * np.pi * (hours - 10) / 24)
daily_pattern = np.maximum(daily_pattern, 0.3)

# Seasonal discharge pattern
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
# Summer peak with monsoon + melt
seasonal = np.array([0.8, 0.7, 1.0, 2.5, 5.0, 12.0, 18.0, 16.0, 10.0, 4.0, 1.5, 0.9])

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Daily cycle
ax = axes[0]
ax.set_facecolor('#1f2937')
ax.fill_between(hours, daily_pattern, alpha=0.3, color='#3b82f6')
ax.plot(hours, daily_pattern, '#60a5fa', linewidth=2.5)
ax.axvline(x=12, color='gold', linestyle=':', alpha=0.5, label='Solar noon')
ax.axvline(x=16, color='#ef4444', linestyle='--', alpha=0.7, label='Peak discharge')
ax.set_xlabel('Hour of day', color='white', fontsize=11)
ax.set_ylabel('Discharge (m³/s)', color='white', fontsize=11)
ax.set_title('Daily Meltwater Cycle (July)', color='white', fontsize=13, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.set_xticks([0, 4, 8, 12, 16, 20, 24])
ax.grid(alpha=0.2)

# Seasonal cycle
ax = axes[1]
ax.set_facecolor('#1f2937')
# Stacked: glacier melt + rain
glacier_melt = seasonal * 0.4  # 40% from glacier
rain_runoff = seasonal * 0.6    # 60% from rain
ax.bar(months, glacier_melt, color='#3b82f6', alpha=0.8, label='Glacier melt')
ax.bar(months, rain_runoff, bottom=glacier_melt, color='#22c55e', alpha=0.8, label='Rain runoff')
ax.set_xlabel('Month', color='white', fontsize=11)
ax.set_ylabel('Discharge (m³/s)', color='white', fontsize=11)
ax.set_title('Seasonal Teesta Discharge', color='white', fontsize=13, fontweight='bold')
ax.set_xticks(months)
ax.set_xticklabels(month_names, fontsize=8)
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.2, axis='y')

plt.tight_layout()
plt.savefig('discharge.png', dpi=100, facecolor='#1f2937')
plt.show()

total = seasonal.sum()
glacier_pct = glacier_melt.sum() / total * 100
print(f"Annual glacier melt contribution: {glacier_pct:.0f}%")
print(f"Peak month: {month_names[np.argmax(seasonal)]} ({seasonal.max():.1f} m³/s)")
print(f"Spring (Mar-May) glacier share: critical when no rain falls")`,
      challenge: 'Model the "peak water" effect: create 3 scenarios (healthy glacier, half-sized glacier, no glacier) and compare their seasonal discharge curves. When does losing the glacier hurt most?',
      successHint: 'You have created a comprehensive discharge analysis with daily and seasonal cycles. The stacked bar chart clearly shows glacier melt\'s role — and makes it obvious what Sikkim stands to lose as Kanchenjunga\'s glaciers shrink.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Climate data visualization with matplotlib</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
