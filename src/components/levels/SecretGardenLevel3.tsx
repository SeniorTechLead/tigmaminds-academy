import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SecretGardenLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Wetland hydrology — the water budget of Loktak Lake',
      concept: `A wetland's health is governed by its hydrology — the balance of water inputs and outputs. Loktak Lake in Manipur, the largest freshwater lake in northeast India, receives water from the Manipur River, direct rainfall, and surface runoff from the surrounding hills. Water leaves through evaporation, transpiration by plants, seepage into groundwater, and outflow through the Ithai Barrage.

The water budget equation is simple but powerful: ΔS = P + Qin - ET - Qout - G, where ΔS is the change in water storage, P is precipitation, Qin is river inflow, ET is evapotranspiration, Qout is outflow, and G is groundwater seepage. When inputs exceed outputs, the lake level rises; when outputs dominate, it falls. Seasonal monsoon patterns create dramatic fluctuations — Loktak can expand by 40% during peak monsoon.

The Ithai Barrage, built in 1983 for hydroelectric power, fundamentally altered Loktak's hydrology. By maintaining artificially high water levels year-round, it eliminated the natural flood-drought cycle that sustained the phumdis (floating islands). Understanding the water budget is the first step to understanding why this wetland is under threat.`,
      analogy: 'Think of a bathtub with both the tap running and the drain open. If the tap delivers water faster than the drain removes it, the level rises. If you partly block the drain (like the Ithai Barrage), the level stays higher than natural. A wetland is exactly this — a landscape-scale bathtub where rain and rivers are the taps, and evaporation, outflow, and seepage are the drains.',
      storyConnection: 'The secret garden of Loktak floats on phumdis — mats of organic matter that rise and fall with the water level. When the Ithai Barrage locked water levels high, phumdis that once rested on the lake bottom during dry season became permanently waterlogged and began decomposing. The water budget equation explains why an engineering decision 40 years ago is still threatening this floating garden today.',
      checkQuestion: 'If Loktak Lake receives 1200 mm/year of rain, 800 mm/year of river inflow, loses 900 mm/year to evapotranspiration and 700 mm/year to outflow, what is the annual change in storage? Is the lake gaining or losing water?',
      checkAnswer: 'ΔS = P + Qin - ET - Qout = 1200 + 800 - 900 - 700 = 400 mm/year gain (ignoring groundwater seepage). The lake is gaining water, which would cause levels to rise. In reality, groundwater seepage and barrage releases would balance this, but the calculation shows why the barrage matters — controlling Qout controls the entire system.',
      codeIntro: 'Model Loktak Lake\'s annual water budget with monthly precipitation, inflow, and evapotranspiration data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monthly data for Loktak Lake (approximate, mm)
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
precipitation =    [15, 30, 65, 120, 210, 320, 380, 340, 260, 140, 40, 12]
river_inflow =     [40, 30, 25, 50, 100, 180, 220, 200, 160, 90, 50, 35]
evapotranspiration=[35, 45, 65, 80, 75, 60, 55, 55, 60, 65, 45, 30]
outflow_natural =  [20, 15, 15, 30, 80, 200, 280, 250, 180, 80, 30, 15]
outflow_barrage =  [20, 15, 15, 30, 60, 120, 150, 140, 100, 60, 30, 15]

P = np.array(precipitation)
Qin = np.array(river_inflow)
ET = np.array(evapotranspiration)
Qout_nat = np.array(outflow_natural)
Qout_bar = np.array(outflow_barrage)

# Compute monthly storage change
dS_natural = P + Qin - ET - Qout_nat
dS_barrage = P + Qin - ET - Qout_bar

# Cumulative storage
storage_natural = np.cumsum(dS_natural)
storage_barrage = np.cumsum(dS_barrage)

fig, axes = plt.subplots(3, 1, figsize=(12, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Monthly water budget components
ax = axes[0]
ax.set_facecolor('#111827')
x = np.arange(12)
w = 0.2
ax.bar(x - 1.5*w, P, w, color='#3b82f6', label='Precipitation')
ax.bar(x - 0.5*w, Qin, w, color='#22c55e', label='River inflow')
ax.bar(x + 0.5*w, ET, w, color='#f59e0b', label='Evapotranspiration')
ax.bar(x + 1.5*w, Qout_nat, w, color='#ef4444', label='Natural outflow')
ax.set_xticks(x); ax.set_xticklabels(months)
ax.set_ylabel('mm / month', color='white')
ax.set_title('Loktak Lake Monthly Water Budget Components', color='white', fontsize=13, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Monthly net storage change
ax2 = axes[1]
ax2.set_facecolor('#111827')
colors_nat = ['#22c55e' if v >= 0 else '#ef4444' for v in dS_natural]
colors_bar = ['#3b82f6' if v >= 0 else '#f59e0b' for v in dS_barrage]
ax2.bar(x - 0.15, dS_natural, 0.3, color=colors_nat, alpha=0.7, label='Natural regime')
ax2.bar(x + 0.15, dS_barrage, 0.3, color='#a855f7', alpha=0.7, label='With barrage')
ax2.axhline(0, color='white', linewidth=0.5)
ax2.set_xticks(x); ax2.set_xticklabels(months)
ax2.set_ylabel('ΔS (mm/month)', color='white')
ax2.set_title('Net Monthly Storage Change: Natural vs Barrage', color='white', fontsize=12)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Cumulative storage (lake level proxy)
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(x, storage_natural, 'o-', color='#22c55e', linewidth=2.5, label='Natural regime')
ax3.plot(x, storage_barrage, 's-', color='#a855f7', linewidth=2.5, label='With barrage')
ax3.fill_between(x, storage_natural, storage_barrage, alpha=0.2, color='#ef4444',
                  label='Excess water retained')
ax3.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax3.set_xticks(x); ax3.set_xticklabels(months)
ax3.set_ylabel('Cumulative ΔS (mm)', color='white')
ax3.set_title('Cumulative Water Storage — Lake Level Proxy', color='white', fontsize=12)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Loktak Lake Annual Water Budget Summary:")
print(f"  Total precipitation:      {P.sum():>6.0f} mm/year")
print(f"  Total river inflow:       {Qin.sum():>6.0f} mm/year")
print(f"  Total evapotranspiration: {ET.sum():>6.0f} mm/year")
print(f"  Total outflow (natural):  {Qout_nat.sum():>6.0f} mm/year")
print(f"  Total outflow (barrage):  {Qout_bar.sum():>6.0f} mm/year")
print(f"  Net annual ΔS (natural):  {dS_natural.sum():>+6.0f} mm/year")
print(f"  Net annual ΔS (barrage):  {dS_barrage.sum():>+6.0f} mm/year")
print(f"\\nThe barrage retains {(dS_barrage.sum() - dS_natural.sum()):.0f} mm more water annually.")
print("This excess waterlogging is decomposing the phumdis — Loktak's floating gardens.")`,
      challenge: 'Add a groundwater seepage term (G) that varies seasonally — higher when lake levels are high. Recalculate the budget and see how groundwater acts as a natural buffer.',
      successHint: 'The water budget is the fundamental equation of hydrology. Every wetland, lake, and river system obeys it. Understanding it explains why dams, barrages, and climate change all have such profound effects on aquatic ecosystems.',
    },
    {
      title: 'Phumdi formation — the floating islands of Loktak',
      concept: `Phumdis are heterogeneous masses of vegetation, soil, and organic matter at various stages of decomposition. They float on Loktak Lake and form the foundation of the Keibul Lamjao National Park — the only floating national park in the world. Phumdis range from thin mats a few centimeters thick to massive islands over two meters deep.

The formation process takes decades. Aquatic plants like Zizania latifolia, Saccharum spp., and Phragmites karka grow in shallow areas. As older vegetation dies, it does not fully decompose because waterlogged conditions limit oxygen availability and slow bacterial breakdown. Layer upon layer of partially decomposed organic matter accumulates, creating a buoyant matrix. Trapped gases (methane and carbon dioxide from anaerobic decomposition) further increase buoyancy.

A phumdi floats when its bulk density is less than water (1000 kg/m³). The density depends on the ratio of organic matter to water to trapped gas. Healthy phumdis maintain a balance — about one-third above water and two-thirds below, following Archimedes' principle. When the Ithai Barrage raised water levels permanently, phumdis that once periodically touched the lake bottom lost their ability to absorb nutrients from sediments. Without this grounding cycle, they thin, lose biomass, and eventually disintegrate.`,
      analogy: 'Imagine a layered sponge cake floating in a swimming pool. Each layer is a generation of dead plants compressed by the weight above. Air bubbles (gas from decomposition) are trapped between layers, keeping the whole structure buoyant. If you fill the pool too high, the cake never sits on the bottom to absorb nutrients, and it slowly dissolves from below.',
      storyConnection: 'The secret garden of Loktak is literally a floating garden — phumdis support entire ecosystems, including the endangered Sangai deer (the dancing deer of Manipur). The story captures the wonder of walking on ground that is itself a living raft of centuries of accumulated vegetation, rising and falling with the lake like a breathing landscape.',
      checkQuestion: 'A phumdi is 2.0 meters thick with a bulk density of 850 kg/m³. What fraction sits above water? If the density increases to 950 kg/m³ due to waterlogging, what happens?',
      checkAnswer: 'By Archimedes: fraction submerged = ρ_phumdi / ρ_water = 850/1000 = 0.85. So 85% is underwater and 15% (0.30 m) is above. At 950 kg/m³, the fraction submerged = 0.95, leaving only 5% (0.10 m) above water. The phumdi is nearly sinking — one more step of waterlogging and it goes under. This is exactly what is happening to Loktak\'s phumdis as they absorb excess water from the barrage.',
      codeIntro: 'Model phumdi buoyancy using Archimedes\' principle and simulate how waterlogging changes their floating behavior.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Archimedes' principle: floating body displaces its own weight
# Fraction submerged = rho_object / rho_water
rho_water = 1000  # kg/m^3

# Phumdi composition model
def phumdi_density(organic_fraction, water_fraction, gas_fraction):
    """Compute bulk density from composition fractions."""
    rho_organic = 600    # dry organic matter kg/m^3
    rho_gas = 1.2        # trapped gas kg/m^3
    return (organic_fraction * rho_organic +
            water_fraction * rho_water +
            gas_fraction * rho_gas)

# Simulate phumdi aging and waterlogging
stages = [
    ('Young (5 yr)',    0.30, 0.55, 0.15),
    ('Mature (20 yr)',  0.35, 0.50, 0.15),
    ('Old (50 yr)',     0.25, 0.60, 0.15),
    ('Waterlogged',     0.20, 0.72, 0.08),
    ('Degraded',        0.15, 0.80, 0.05),
    ('Critical',        0.10, 0.87, 0.03),
]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Phumdi cross-section showing above/below water
ax = axes[0, 0]
ax.set_facecolor('#111827')
thickness = 2.0  # meters
for i, (name, org, wat, gas) in enumerate(stages):
    rho = phumdi_density(org, wat, gas)
    frac_sub = min(rho / rho_water, 1.0)
    above = thickness * (1 - frac_sub)
    below = thickness * frac_sub

    x = i * 1.5
    # Below water (darker)
    ax.bar(x, -below, 0.9, color='#1e3a5f', edgecolor='#3b82f6', linewidth=1)
    # Above water (green)
    if above > 0:
        ax.bar(x, above, 0.9, color='#22c55e', edgecolor='#16a34a', linewidth=1)
    ax.text(x, above + 0.05, f'{above:.2f}m', ha='center', color='#22c55e', fontsize=8)
    ax.text(x, -below - 0.1, f'{rho:.0f}', ha='center', color='#93c5fd', fontsize=8)

ax.axhline(0, color='#3b82f6', linewidth=2, label='Water surface')
ax.set_xticks([i * 1.5 for i in range(len(stages))])
ax.set_xticklabels([s[0] for s in stages], rotation=30, fontsize=8)
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Phumdi Cross-Section: Above vs Below Water', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Density vs composition
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
water_frac = np.linspace(0.3, 0.95, 100)
gas_fracs = [0.15, 0.10, 0.05, 0.02]
for gf in gas_fracs:
    organic = 1 - water_frac - gf
    valid = organic >= 0
    densities = phumdi_density(organic[valid], water_frac[valid], gf)
    ax2.plot(water_frac[valid] * 100, densities, linewidth=2,
             label=f'Gas = {gf:.0%}')
ax2.axhline(rho_water, color='#ef4444', linewidth=2, linestyle='--', label='ρ_water = 1000')
ax2.set_xlabel('Water content (%)', color='white')
ax2.set_ylabel('Bulk density (kg/m³)', color='white')
ax2.set_title('Phumdi Density vs Water Content', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Buoyancy over time (years of waterlogging)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
years = np.arange(0, 50)
# Waterlogging model: water fraction increases exponentially
water_initial = 0.50
water_max = 0.92
tau = 15  # years timescale
water_t = water_max - (water_max - water_initial) * np.exp(-years / tau)
gas_t = 0.15 * np.exp(-years / 20)  # gas escapes over time
organic_t = 1 - water_t - gas_t
density_t = phumdi_density(organic_t, water_t, gas_t)
freeboard_t = 2.0 * np.maximum(1 - density_t / rho_water, 0)

ax3.plot(years, freeboard_t * 100, color='#22c55e', linewidth=2.5, label='Freeboard')
ax3.fill_between(years, 0, freeboard_t * 100, color='#22c55e', alpha=0.15)
ax3.axhline(5, color='#f59e0b', linewidth=1, linestyle='--', label='Critical threshold (5 cm)')
ax3.set_xlabel('Years of permanent waterlogging', color='white')
ax3.set_ylabel('Freeboard (cm above water)', color='white')
ax3.set_title('Phumdi Freeboard Loss Over Time', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Composition over time
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.stackplot(years, organic_t * 100, gas_t * 100, water_t * 100,
              colors=['#22c55e', '#f59e0b', '#3b82f6'],
              labels=['Organic', 'Trapped gas', 'Water'], alpha=0.8)
ax4.set_xlabel('Years of permanent waterlogging', color='white')
ax4.set_ylabel('Composition (%)', color='white')
ax4.set_title('Phumdi Composition Change Over Time', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='center right')
ax4.tick_params(colors='gray')
ax4.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print("Phumdi Buoyancy Analysis:")
print(f"{'Stage':<16} {'Density':>10} {'Submerged':>10} {'Freeboard':>10}")
print("-" * 48)
for name, org, wat, gas in stages:
    rho = phumdi_density(org, wat, gas)
    frac = min(rho / rho_water, 1.0)
    fb = 2.0 * max(1 - frac, 0)
    status = "SINKING" if rho >= rho_water else ""
    print(f"{name:<16} {rho:>8.0f} {frac:>9.1%} {fb:>8.2f} m  {status}")

print(f"\\nAfter {tau} years of waterlogging, freeboard drops to {freeboard_t[tau]*100:.1f} cm")
print(f"After 40 years: {freeboard_t[40]*100:.1f} cm — Loktak's phumdis are in crisis.")
print("The Ithai Barrage was built in 1983 — that\'s ~40 years of permanent waterlogging.")`,
      challenge: 'Model the effect of seasonal water level fluctuations (±1m) on phumdi health. Compare a natural regime (lake drops 1m in dry season, phumdis ground on sediment) vs the barrage regime (constant high water). Show how grounding replenishes nutrients.',
      successHint: 'Phumdis are a remarkable natural phenomenon — floating ecosystems built over decades by the accumulation of partially decomposed organic matter. Archimedes\' principle governs their behavior, and human alteration of hydrology is pushing them past the point of no return.',
    },
    {
      title: 'Water quality parameters — dissolved oxygen, BOD, and pH',
      concept: `Three parameters tell you more about water health than almost anything else: dissolved oxygen (DO), biochemical oxygen demand (BOD), and pH. Together they form the core of water quality assessment.

Dissolved oxygen is the amount of O₂ dissolved in water, measured in mg/L. Fish and aquatic invertebrates need at least 5 mg/L to survive. Cold water holds more DO than warm water (Henry's Law) — at 0°C, saturation is about 14.6 mg/L, but at 30°C it drops to 7.5 mg/L. Turbulent water absorbs more oxygen from the atmosphere. Photosynthesis by aquatic plants adds DO during daylight, while respiration by all organisms consumes it continuously.

BOD measures how much oxygen microorganisms consume while decomposing organic matter over 5 days at 20°C (BOD₅). Clean water has BOD < 2 mg/L. Polluted water with sewage or agricultural runoff can have BOD > 10 mg/L. High BOD means high organic load, which means microorganisms are consuming oxygen faster than it can be replenished — leading to hypoxia (low DO) and fish kills.

pH measures hydrogen ion concentration on a logarithmic scale from 0 to 14. Most freshwater life thrives between pH 6.5 and 8.5. Acid rain, mine drainage, or volcanic inputs lower pH. Photosynthesis raises pH (consuming CO₂), while respiration lowers it (producing CO₂). Loktak Lake's pH fluctuates between 5.5 and 7.5 depending on decomposition in the phumdis.`,
      analogy: 'Think of dissolved oxygen as the "air" that aquatic creatures breathe. BOD is like measuring how many people are in a sealed room — more people (organic matter) means the air (oxygen) gets used up faster. pH is like temperature for chemistry — too high or too low and the chemical reactions that sustain life stop working. These three numbers are the vital signs of a water body.',
      storyConnection: 'The secret garden of Loktak depends on a delicate balance of water chemistry. Phumdi decomposition releases organic acids (lowering pH) and consumes oxygen (increasing BOD). In the still waters beneath thick phumdis, DO can drop below 2 mg/L — a dead zone where fish cannot survive. The story\'s hidden garden is both beautiful and chemically precarious.',
      checkQuestion: 'A lake sample shows DO = 3.2 mg/L, BOD₅ = 12 mg/L, and pH = 5.8. Is this water healthy? What do these numbers tell you?',
      checkAnswer: 'This water is seriously stressed. DO of 3.2 mg/L is below the 5 mg/L threshold for most fish — many species would suffocate. BOD₅ of 12 mg/L indicates heavy organic pollution (clean water is < 2). pH of 5.8 is acidic, likely from decomposing organic matter producing humic acids. All three indicators point to eutrophication — too much organic matter consuming too much oxygen.',
      codeIntro: 'Model the oxygen sag curve (Streeter-Phelps equation) and visualize how organic pollution depletes dissolved oxygen downstream.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Streeter-Phelps Oxygen Sag Model
# dD/dt = k1*L - k2*D
# D = oxygen deficit (DOsat - DO), L = BOD remaining
# Solution: D(t) = [k1*L0/(k2-k1)] * (exp(-k1*t) - exp(-k2*t)) + D0*exp(-k2*t)

def oxygen_sag(t, L0, D0, k1, k2, DO_sat):
    """Compute DO over time using Streeter-Phelps equation."""
    if abs(k2 - k1) < 1e-10:
        k2 = k1 + 0.001
    deficit = (k1 * L0 / (k2 - k1)) * (np.exp(-k1 * t) - np.exp(-k2 * t)) + D0 * np.exp(-k2 * t)
    DO = DO_sat - deficit
    return np.maximum(DO, 0), deficit

# Parameters
DO_sat = 9.1     # mg/L at 20°C
DO_initial = 8.5
D0 = DO_sat - DO_initial
k1 = 0.23        # BOD decay rate (day^-1)
k2 = 0.46        # reaeration rate (day^-1)
t = np.linspace(0, 15, 500)  # days

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Oxygen sag curves for different pollution levels
ax = axes[0, 0]
ax.set_facecolor('#111827')
BOD_levels = [5, 15, 30, 50]
colors = ['#22c55e', '#f59e0b', '#ef4444', '#dc2626']
for L0, color in zip(BOD_levels, colors):
    DO, _ = oxygen_sag(t, L0, D0, k1, k2, DO_sat)
    ax.plot(t, DO, color=color, linewidth=2.5, label=f'BOD₀ = {L0} mg/L')
ax.axhline(DO_sat, color='#93c5fd', linewidth=1, linestyle=':', label=f'DO saturation ({DO_sat})')
ax.axhline(5.0, color='#ef4444', linewidth=1, linestyle='--', label='Fish stress threshold')
ax.axhline(2.0, color='#dc2626', linewidth=1, linestyle='--', label='Hypoxia')
ax.set_xlabel('Days downstream', color='white')
ax.set_ylabel('Dissolved Oxygen (mg/L)', color='white')
ax.set_title('Oxygen Sag Curve (Streeter-Phelps)', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: DO vs Temperature
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
temps = np.linspace(0, 40, 100)
# Henry's Law approximation for DO saturation
DO_temp = 14.6 - 0.39 * temps + 0.007 * temps**2 - 0.00006 * temps**3
ax2.plot(temps, DO_temp, color='#3b82f6', linewidth=2.5)
ax2.fill_between(temps, 0, DO_temp, color='#3b82f6', alpha=0.1)
ax2.axhline(5.0, color='#ef4444', linewidth=1, linestyle='--', label='Fish stress')
# Mark Loktak's range
ax2.axvspan(20, 30, alpha=0.15, color='#f59e0b', label='Loktak temp range')
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('DO saturation (mg/L)', color='white')
ax2.set_title('Dissolved Oxygen vs Temperature', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: pH scale with aquatic life zones
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ph_range = np.linspace(0, 14, 1000)
# Color gradient
for i in range(len(ph_range) - 1):
    ph = ph_range[i]
    if ph < 4:
        c = '#ef4444'
    elif ph < 6.5:
        c = '#f59e0b'
    elif ph < 8.5:
        c = '#22c55e'
    elif ph < 10:
        c = '#f59e0b'
    else:
        c = '#ef4444'
    ax3.barh(0, ph_range[i+1]-ph_range[i], left=ph_range[i], height=0.8, color=c, alpha=0.6)

ax3.axvspan(6.5, 8.5, alpha=0.3, color='#22c55e', label='Optimal for aquatic life')
ax3.axvspan(5.5, 7.5, alpha=0.2, color='#3b82f6', label='Loktak Lake range')
ax3.set_xlim(0, 14)
ax3.set_yticks([])
ax3.set_xlabel('pH', color='white', fontsize=12)
ax3.set_title('pH Scale — Aquatic Life Tolerance', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Daily DO cycle (photosynthesis/respiration)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
hours = np.linspace(0, 48, 500)
# DO follows photosynthesis (day) and respiration (night)
base_DO = 6.5
photo_amplitude = 2.5
resp_rate = 0.8
DO_daily = base_DO + photo_amplitude * np.sin(2 * np.pi * (hours - 6) / 24) * np.maximum(np.sin(np.pi * ((hours % 24) - 6) / 12), 0)
DO_daily -= resp_rate * np.sin(2 * np.pi * hours / 24) * 0.3
DO_daily = np.clip(DO_daily, 2, 12)

ax4.plot(hours, DO_daily, color='#22c55e', linewidth=2)
ax4.fill_between(hours, 0, DO_daily, where=DO_daily >= 5, color='#22c55e', alpha=0.15)
ax4.fill_between(hours, 0, DO_daily, where=DO_daily < 5, color='#ef4444', alpha=0.15)
for h in [6, 18, 30, 42]:
    ax4.axvline(h, color='#f59e0b', linewidth=0.5, linestyle=':', alpha=0.5)
ax4.axhline(5, color='#ef4444', linewidth=1, linestyle='--')
for h in [12, 36]:
    ax4.text(h, 9.5, '☀', ha='center', fontsize=14)
for h in [0, 24, 48]:
    ax4.text(h, 9.5, '🌙', ha='center', fontsize=12)
ax4.set_xlabel('Hours', color='white')
ax4.set_ylabel('DO (mg/L)', color='white')
ax4.set_title('24-Hour DO Cycle (Photosynthesis + Respiration)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Water Quality Parameters Summary:")
print(f"{'Parameter':<12} {'Healthy':>12} {'Stressed':>12} {'Critical':>12}")
print("-" * 50)
print(f"{'DO (mg/L)':<12} {'>7':>12} {'4-7':>12} {'<4':>12}")
print(f"{'BOD₅ (mg/L)':<12} {'<2':>12} {'2-10':>12} {'>10':>12}")
print(f"{'pH':<12} {'6.5-8.5':>12} {'5.5-9.0':>12} {'<5.5 or >9':>12}")
print(f"\\nLoktak Lake under phumdis: DO ≈ 2-4 mg/L, BOD ≈ 8-15, pH ≈ 5.5-6.5")
print("The phumdis create low-oxygen acidic microhabitats — stressful but unique.")`,
      challenge: 'Add a simulation of eutrophication: model how increasing nutrient input (nitrogen, phosphorus) drives algal growth, which initially increases DO (photosynthesis) but then crashes it when algae die and decompose. Plot the boom-bust cycle.',
      successHint: 'DO, BOD, and pH are the vital signs of aquatic ecosystems. The Streeter-Phelps equation, published in 1925, was one of the first mathematical models in environmental science and is still used today to predict the impact of pollution on rivers and lakes.',
    },
    {
      title: 'Aquatic food webs — energy flow in Loktak Lake',
      concept: `A food web maps who eats whom in an ecosystem. In Loktak Lake, the base of the food web is formed by phytoplankton (microscopic algae) and macrophytes (aquatic plants including phumdi vegetation). These primary producers convert solar energy into biomass through photosynthesis. Primary consumers — zooplankton, herbivorous fish, and invertebrates — eat the producers. Secondary consumers — predatory fish and wading birds — eat the primary consumers. Top predators like otters and large raptors sit at the apex.

Energy transfer between trophic levels is inefficient. The "10% rule" is a rough approximation: only about 10% of energy at one level is available to the next. If phytoplankton fix 10,000 kcal/m²/year, herbivores capture ~1,000, small predators ~100, and top predators ~10. This exponential decline in energy explains why top predators are always rare and why food chains rarely exceed 4-5 links.

The biomass pyramid mirrors this energy loss. Loktak's phytoplankton biomass far exceeds zooplankton biomass, which exceeds fish biomass, which exceeds bird and otter biomass. When phumdis degrade, they release enormous amounts of decomposing organic matter, feeding the detritivore pathway and potentially causing a regime shift — from a clear-water, macrophyte-dominated lake to a turbid, phytoplankton-dominated lake.`,
      analogy: 'A food web is like a company\'s organizational chart turned into a menu. The CEO (top predator) depends on managers (secondary consumers) who depend on workers (primary consumers) who depend on the raw materials (producers). Fire one layer and everything above it collapses. The 10% rule means each management layer "wastes" 90% of the productivity below it.',
      storyConnection: 'The secret garden of Loktak is not just plants — it is the foundation of an entire food web. Phumdis support insects, which feed fish, which feed the fishing cats and otters, which in turn support the local fishing communities. The endangered Sangai deer grazes on phumdi vegetation. When phumdis degrade, the entire food web unravels from the bottom up.',
      checkQuestion: 'If Loktak Lake phytoplankton produce 8,000 kcal/m²/year, and the 10% rule applies, how much energy is available to top predators (4th trophic level)? Why does this explain why Loktak can only support a small number of otters?',
      checkAnswer: 'Level 1 (phytoplankton): 8,000. Level 2 (zooplankton/herbivores): 800. Level 3 (small predatory fish): 80. Level 4 (otters/raptors): 8 kcal/m²/year. That is 0.1% of the original energy. A 200 km² lake would provide only 1,600,000 kcal/year for top predators — enough for maybe 5-10 otters. The energy pyramid dictates carrying capacity.',
      codeIntro: 'Build and visualize a food web energy flow model for Loktak Lake with trophic efficiency calculations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Loktak Lake food web model
trophic_levels = {
    'Phytoplankton & macrophytes': {'energy': 10000, 'level': 1, 'color': '#22c55e'},
    'Zooplankton & herbivores': {'energy': 1000, 'level': 2, 'color': '#3b82f6'},
    'Small predatory fish': {'energy': 100, 'level': 3, 'color': '#f59e0b'},
    'Top predators (otters, raptors)': {'energy': 10, 'level': 4, 'color': '#ef4444'},
}

# Detritivore pathway (phumdi decomposition)
detrital = {
    'Dead phumdi material': {'energy': 5000, 'level': 1, 'color': '#a855f7'},
    'Bacteria & fungi': {'energy': 500, 'level': 2, 'color': '#8b5cf6'},
    'Detritivore invertebrates': {'energy': 50, 'level': 3, 'color': '#6366f1'},
}

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Energy pyramid
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(trophic_levels.keys())
energies = [trophic_levels[n]['energy'] for n in names]
colors = [trophic_levels[n]['color'] for n in names]

for i, (name, energy, color) in enumerate(zip(names, energies, colors)):
    width = energy / max(energies)
    ax.barh(i, width, color=color, height=0.7, alpha=0.8, edgecolor='white', linewidth=0.5)
    ax.text(width + 0.02, i, f'{energy:,} kcal/m²/yr', va='center',
            color=color, fontsize=9, fontweight='bold')
    ax.text(0.01, i, name, va='center', color='white', fontsize=8)
ax.set_yticks([])
ax.set_xlabel('Relative energy', color='white')
ax.set_title('Loktak Lake Energy Pyramid', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Exponential energy decline
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
levels = np.arange(1, 6)
efficiencies = [0.05, 0.10, 0.15, 0.20]
for eff in efficiencies:
    energy = 10000 * eff ** (levels - 1)
    ax2.semilogy(levels, energy, 'o-', linewidth=2, label=f'{eff:.0%} efficiency')
ax2.set_xlabel('Trophic level', color='white')
ax2.set_ylabel('Energy (kcal/m²/yr)', color='white')
ax2.set_title('Energy vs Trophic Level at Different Efficiencies', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_xticks(levels)
ax2.set_xticklabels(['Producers','Herbivores','Small pred.','Top pred.','Apex'], fontsize=8)

# Plot 3: Grazer vs Detritivore pathway comparison
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
x_pos = np.array([0, 1, 2])
grazer_e = [10000, 1000, 100]
detrital_e = [5000, 500, 50]
w = 0.3
ax3.bar(x_pos - w/2, grazer_e, w, color='#22c55e', alpha=0.8, label='Grazer pathway')
ax3.bar(x_pos + w/2, detrital_e, w, color='#a855f7', alpha=0.8, label='Detrital pathway')
ax3.set_yscale('log')
ax3.set_xticks(x_pos)
ax3.set_xticklabels(['Level 1\\n(producers)', 'Level 2\\n(consumers)', 'Level 3\\n(predators)'], fontsize=9)
ax3.set_ylabel('Energy (kcal/m²/yr)', color='white')
ax3.set_title('Grazer vs Detritivore Pathways', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Regime shift — phumdi degradation shifts energy flow
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
years = np.arange(2000, 2030)
# Macrophyte contribution declines as phumdis degrade
macro_contrib = 70 * np.exp(-(years - 2000) / 25) + 20
phyto_contrib = 100 - macro_contrib
detrital_input = 10 + 60 * (1 - np.exp(-(years - 2000) / 15))

ax4.stackplot(years, macro_contrib, phyto_contrib, detrital_input,
              colors=['#22c55e', '#3b82f6', '#a855f7'],
              labels=['Macrophyte production', 'Phytoplankton production', 'Detrital input'],
              alpha=0.7)
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Relative contribution (%)', color='white')
ax4.set_title('Regime Shift: Macrophyte → Phytoplankton Dominated', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='right')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Loktak Lake Food Web — Energy Flow:")
print(f"{'Trophic Level':<35} {'Energy':>12} {'% of Base':>10}")
print("-" * 60)
base = 10000
for name, data in trophic_levels.items():
    pct = data['energy'] / base * 100
    print(f"{name:<35} {data['energy']:>8,} kcal  {pct:>8.1f}%")
print()
print(f"Only {10/10000:.2%} of producer energy reaches top predators.")
print(f"A 200 km² lake supports ~{200e6 * 10 / 1e6 / 365 / 3:.0f} otters (rough estimate).")
print(f"\\nPhumdi degradation shifts the base from macrophytes to phytoplankton,")
print(f"favoring turbidity-tolerant species and threatening clear-water specialists.")`,
      challenge: 'Add species diversity to the model. Within each trophic level, model 3-5 species competing for energy. Show how removing one key species (e.g., a phumdi-dependent fish) cascades through the web.',
      successHint: 'Food webs quantify the architecture of ecosystems. The 10% rule and energy pyramids explain fundamental ecological patterns — why predators are rare, why ecosystems have limited food chain length, and why losing producers (like phumdis) threatens everything above them.',
    },
    {
      title: 'Eutrophication — when too many nutrients kill a lake',
      concept: `Eutrophication is the process by which excessive nutrient input — primarily nitrogen (N) and phosphorus (P) — drives explosive algal growth, which eventually depletes oxygen and degrades water quality. It is the single greatest threat to freshwater lakes worldwide, and Loktak Lake is severely affected.

The process follows a predictable sequence. Stage 1: Nutrients from agricultural runoff, sewage, and phumdi decomposition enter the lake. Stage 2: Phytoplankton (algae) bloom explosively, turning the water green. Stage 3: The bloom blocks sunlight, killing submerged plants. Stage 4: When the algae die, bacteria decompose them, consuming enormous amounts of oxygen. Stage 5: Dissolved oxygen crashes (hypoxia or anoxia), killing fish and invertebrates. Stage 6: Only pollution-tolerant species survive — the lake has undergone a regime shift.

Phosphorus is usually the limiting nutrient in freshwater systems (Liebig's Law of the Minimum). Even small additions of P can trigger blooms. The critical threshold is about 30 μg/L total phosphorus — above this, a lake is considered eutrophic. Loktak Lake's phosphorus levels have reached 50-80 μg/L in heavily populated areas. The Carlson Trophic State Index (TSI) uses Secchi disk transparency, chlorophyll-a, and total phosphorus to classify lakes on a 0-100 scale: oligotrophic (<40), mesotrophic (40-50), eutrophic (50-70), hypereutrophic (>70).`,
      analogy: 'Eutrophication is like overfeeding fish in an aquarium. A little food keeps the fish healthy. Too much food rots, clouds the water, consumes oxygen, and eventually kills the fish. The food is nutrients, the rotting is bacterial decomposition, and the suffocating fish are every oxygen-dependent organism in the lake.',
      storyConnection: 'The secret garden of Loktak is under siege from eutrophication. Human settlements around the lake release sewage and agricultural runoff rich in nitrogen and phosphorus. Phumdi decomposition adds further organic load. The clear waters that once supported diverse fish species and the Sangai deer are turning turbid and oxygen-depleted. The garden is slowly being smothered by invisible excess.',
      checkQuestion: 'Lake A has total P = 15 μg/L and Secchi depth = 4.5 m. Lake B has total P = 65 μg/L and Secchi depth = 0.8 m. Classify each lake and predict what you would find in each.',
      checkAnswer: 'Lake A is oligotrophic (low nutrients, high clarity). You would find clear water, diverse native fish, submerged aquatic plants, and high DO. Lake B is eutrophic (high nutrients, low clarity). You would find green, turbid water dominated by algal blooms, few submerged plants (blocked light), low DO near the bottom, and pollution-tolerant fish species. Lake B is on the path Loktak is following.',
      codeIntro: 'Model the eutrophication cascade: nutrient loading → algal bloom → oxygen crash. Simulate the Carlson Trophic State Index.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Eutrophication model: nutrients drive algal growth, which crashes DO
def simulate_eutrophication(P_input, days=365):
    """Simulate annual eutrophication cycle."""
    dt = 1  # day
    # State variables
    P = np.zeros(days)       # phosphorus (μg/L)
    algae = np.zeros(days)   # chlorophyll-a (μg/L)
    DO = np.zeros(days)      # dissolved oxygen (mg/L)
    secchi = np.zeros(days)  # transparency (m)

    P[0] = 10; algae[0] = 2; DO[0] = 9.0; secchi[0] = 3.0

    for t in range(1, days):
        # Seasonal temperature effect on growth
        temp_factor = 0.5 + 0.5 * np.sin(2 * np.pi * (t - 90) / 365)

        # Phosphorus dynamics
        dP = P_input * dt - 0.02 * P[t-1] * dt + 0.01 * algae[t-1] * dt  # input - uptake + recycling
        P[t] = max(P[t-1] + dP, 0)

        # Algal growth (Monod kinetics)
        growth = 0.3 * (P[t] / (P[t] + 10)) * temp_factor
        death = 0.05 + 0.1 * (algae[t-1] / 100)  # density-dependent
        algae[t] = max(algae[t-1] + (growth - death) * algae[t-1] * dt, 0.5)

        # DO dynamics
        reaeration = 0.5 * (9.1 - DO[t-1])
        photosyn = 0.02 * algae[t] * temp_factor
        respiration = 0.03 * algae[t]
        decomp = 0.01 * max(algae[t-1] - algae[t], 0) * 5
        DO[t] = max(DO[t-1] + (reaeration + photosyn - respiration - decomp) * dt, 0)
        DO[t] = min(DO[t], 14)

        # Secchi depth (inversely related to algae)
        secchi[t] = max(6.0 / (1 + 0.05 * algae[t]), 0.2)

    return P, algae, DO, secchi

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
days = np.arange(365)
month_ticks = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
month_labels = ['J','F','M','A','M','J','J','A','S','O','N','D']

scenarios = [
    ('Oligotrophic (P input = 0.05)', 0.05, '#22c55e'),
    ('Mesotrophic (P input = 0.2)', 0.2, '#3b82f6'),
    ('Eutrophic (P input = 0.8)', 0.8, '#f59e0b'),
    ('Hypereutrophic (P input = 2.0)', 2.0, '#ef4444'),
]

# Plot 1: Algal biomass (chlorophyll-a)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for label, p_in, color in scenarios:
    _, algae, _, _ = simulate_eutrophication(p_in)
    ax.plot(days, algae, color=color, linewidth=2, label=label)
ax.set_xticks(month_ticks); ax.set_xticklabels(month_labels)
ax.set_ylabel('Chlorophyll-a (μg/L)', color='white')
ax.set_title('Algal Biomass Through Year', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Dissolved oxygen
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
for label, p_in, color in scenarios:
    _, _, DO, _ = simulate_eutrophication(p_in)
    ax2.plot(days, DO, color=color, linewidth=2, label=label)
ax2.axhline(5, color='#ef4444', linewidth=1, linestyle='--', label='Fish stress')
ax2.axhline(2, color='#dc2626', linewidth=1, linestyle='--', label='Hypoxia')
ax2.set_xticks(month_ticks); ax2.set_xticklabels(month_labels)
ax2.set_ylabel('DO (mg/L)', color='white')
ax2.set_title('Dissolved Oxygen Response', color='white', fontsize=12)
ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Carlson TSI
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
TP = np.linspace(1, 100, 200)  # total phosphorus μg/L
TSI_TP = 14.42 * np.log(TP) + 4.15
chl_a = np.linspace(0.1, 100, 200)
TSI_chl = 9.81 * np.log(chl_a) + 30.6
secchi_d = np.linspace(0.1, 10, 200)
TSI_sec = 60 - 14.41 * np.log(secchi_d)

ax3.plot(TP, TSI_TP, color='#ef4444', linewidth=2, label='TSI from total P')
ax3.axhspan(0, 40, alpha=0.1, color='#22c55e', label='Oligotrophic (<40)')
ax3.axhspan(40, 50, alpha=0.1, color='#3b82f6', label='Mesotrophic (40-50)')
ax3.axhspan(50, 70, alpha=0.1, color='#f59e0b', label='Eutrophic (50-70)')
ax3.axhspan(70, 100, alpha=0.1, color='#ef4444', label='Hypereutrophic (>70)')
# Mark Loktak
ax3.axvline(65, color='#fbbf24', linewidth=2, linestyle='--')
ax3.text(67, 80, 'Loktak\\nLake', color='#fbbf24', fontsize=10, fontweight='bold')
ax3.set_xlabel('Total Phosphorus (μg/L)', color='white')
ax3.set_ylabel('Carlson TSI', color='white')
ax3.set_title('Carlson Trophic State Index', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Long-term lake degradation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
decades = np.arange(1960, 2030)
nutrient_load = 10 + 60 * (1 - np.exp(-(decades - 1960) / 20))
fish_diversity = 45 * np.exp(-nutrient_load / 40) + 5
phumdi_area = 40 * np.exp(-(decades - 1983)**2 / 800) + 20 * np.exp(-(decades - 1960) / 50)

ax4.plot(decades, nutrient_load, color='#ef4444', linewidth=2, label='Nutrient load (a.u.)')
ax4.plot(decades, fish_diversity, color='#3b82f6', linewidth=2, label='Fish species (#)')
ax4.plot(decades, phumdi_area, color='#22c55e', linewidth=2, label='Phumdi area (km²)')
ax4.axvline(1983, color='#fbbf24', linewidth=1, linestyle='--')
ax4.text(1984, 55, 'Ithai\\nBarrage', color='#fbbf24', fontsize=9)
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Value', color='white')
ax4.set_title('Loktak Lake Long-Term Degradation', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Eutrophication Cascade:")
print("  Nutrients ↑ → Algae ↑ → Light ↓ → Submerged plants ↓ → DO ↓ → Fish ↓")
print()
print("Carlson Trophic State Index for Loktak Lake:")
print(f"  Total P ≈ 65 μg/L → TSI ≈ {14.42 * np.log(65) + 4.15:.0f}")
print(f"  Classification: Eutrophic (approaching hypereutrophic)")
print(f"\\nLoktak has lost an estimated 70% of its submerged plant diversity since 1983.")
print(f"Eutrophication + altered hydrology = double threat to the floating garden.")`,
      challenge: 'Add a remediation scenario: model what happens if nutrient loading is reduced by 50% starting in 2025. How many years does it take for the lake to recover? Include internal phosphorus loading (P released from sediments) as a factor that slows recovery.',
      successHint: 'Eutrophication is a global crisis — it affects lakes, rivers, estuaries, and even coastal oceans (dead zones). The physics and chemistry are straightforward, but the management is complex because nutrients come from diffuse sources across entire watersheds. Understanding the cascade is the first step to stopping it.',
    },
    {
      title: 'Wetland conservation and management — restoring Loktak',
      concept: `Wetland conservation combines hydrology, ecology, chemistry, and human systems. For Loktak Lake, any management plan must address the three interconnected threats: altered hydrology (Ithai Barrage), eutrophication (nutrient loading), and phumdi degradation. Each requires different interventions, but they cannot be solved independently.

Hydrological restoration means re-establishing a natural or semi-natural water level regime. This could involve modifying barrage operations to allow seasonal drawdown — letting the lake level drop during the dry season so phumdis can ground on sediments and regenerate. The Ramsar Convention (Loktak was designated a Ramsar Wetland of International Importance in 1990) recommends maintaining environmental flows.

Nutrient management requires reducing inputs from the catchment. Constructed wetlands can filter agricultural runoff. Buffer strips of native vegetation along streams trap sediment and absorb nutrients. Sewage treatment before discharge is essential. For internal loading (phosphorus cycling from sediments), techniques like alum treatment or hypolimnetic aeration can help.

Monitoring is the backbone of management. A Wetland Health Index combining water quality (DO, BOD, pH, nutrients), vegetation (phumdi area, plant diversity), and biodiversity (fish species richness, bird counts) provides a quantitative score that tracks progress. Adaptive management uses monitoring data to adjust interventions — it is the scientific method applied to ecosystem management.`,
      analogy: 'Restoring a wetland is like renovating a house while people still live in it. You cannot fix the plumbing (hydrology), electrical (nutrients), and structure (phumdis) independently — they all connect. And you must keep the residents (wildlife and fishing communities) comfortable throughout. A Wetland Health Index is like a home inspection report — it tells you what needs fixing first.',
      storyConnection: 'The secret garden of Loktak is not beyond saving, but it requires understanding every system we have studied: hydrology, phumdi dynamics, water chemistry, food webs, and eutrophication. The garden that the story celebrates still exists — reduced but resilient. Conservation science gives us the tools to help it recover, if we apply them with the same wonder and care that the story\'s characters brought to discovering it.',
      checkQuestion: 'You are designing a monitoring program for Loktak Lake. Which three measurements would give you the most information about lake health with the least cost? Justify each choice.',
      checkAnswer: 'Best three: (1) Secchi disk depth — costs almost nothing, integrates algal biomass, turbidity, and light availability in one measurement. Correlates strongly with trophic state. (2) Dissolved oxygen — a battery-powered probe gives instant readings and DO integrates biological activity, pollution, and reaeration. (3) Phumdi area from satellite imagery — freely available Landsat/Sentinel data lets you track floating vegetation extent over decades. These three cover water quality, productivity, and habitat with minimal equipment.',
      codeIntro: 'Build a Wetland Health Index for Loktak Lake that combines water quality, vegetation, and biodiversity metrics into a single 0-100 score.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wetland Health Index (WHI) — composite score from multiple indicators
# Each indicator is scored 0-100, then weighted

def score_DO(do_mg_l):
    """Score dissolved oxygen: 0 (anoxic) to 100 (saturated)."""
    return np.clip(do_mg_l / 9.1 * 100, 0, 100)

def score_BOD(bod):
    """Score BOD: 100 (clean) to 0 (heavily polluted)."""
    return np.clip(100 - bod * 10, 0, 100)

def score_pH(ph):
    """Score pH: 100 at optimal (7.0), decreasing away from it."""
    return np.clip(100 - 30 * abs(ph - 7.0), 0, 100)

def score_secchi(depth_m):
    """Score transparency: 100 at 4m+, 0 at 0.2m."""
    return np.clip((depth_m - 0.2) / 3.8 * 100, 0, 100)

def score_phumdi(area_km2, reference=40):
    """Score phumdi area relative to reference condition."""
    return np.clip(area_km2 / reference * 100, 0, 100)

def score_fish_species(n_species, reference=50):
    """Score fish diversity relative to historical reference."""
    return np.clip(n_species / reference * 100, 0, 100)

def wetland_health_index(do, bod, ph, secchi, phumdi_area, fish_spp):
    """Compute WHI as weighted average of component scores."""
    scores = {
        'DO': (score_DO(do), 0.20),
        'BOD': (score_BOD(bod), 0.15),
        'pH': (score_pH(ph), 0.10),
        'Transparency': (score_secchi(secchi), 0.15),
        'Phumdi area': (score_phumdi(phumdi_area), 0.20),
        'Fish diversity': (score_fish_species(fish_spp), 0.20),
    }
    whi = sum(s * w for s, w in scores.values())
    return whi, scores

# Historical trajectory of Loktak Lake
years = np.arange(1970, 2031)
n = len(years)

# Simulate degradation + partial recovery scenario
barrage_year = 1983
recovery_year = 2025

do_hist = 8.5 - 3.5 * (1 - np.exp(-(years - barrage_year) / 15)) * (years >= barrage_year)
do_hist[years >= recovery_year] += 1.0 * (1 - np.exp(-(years[years >= recovery_year] - recovery_year) / 10))

bod_hist = 2 + 8 * (1 - np.exp(-(years - 1975) / 20))
bod_hist[years >= recovery_year] -= 2.0 * (1 - np.exp(-(years[years >= recovery_year] - recovery_year) / 8))

ph_hist = 7.0 - 0.8 * (1 - np.exp(-(years - barrage_year) / 25)) * (years >= barrage_year)
secchi_hist = 3.5 - 2.5 * (1 - np.exp(-(years - 1975) / 18))
phumdi_hist = 40 - 20 * (1 - np.exp(-(years - barrage_year) / 20)) * (years >= barrage_year)
fish_hist = 50 - 30 * (1 - np.exp(-(years - 1975) / 22))

# Compute WHI for each year
whi_hist = np.zeros(n)
for i in range(n):
    whi, _ = wetland_health_index(do_hist[i], bod_hist[i], ph_hist[i],
                                   secchi_hist[i], phumdi_hist[i], fish_hist[i])
    whi_hist[i] = whi

# Current year detailed breakdown
whi_now, scores_now = wetland_health_index(5.2, 8.5, 6.3, 1.2, 25, 22)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: WHI over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(years, whi_hist, color='#22c55e', linewidth=2.5)
ax.fill_between(years, 0, whi_hist, where=whi_hist >= 60, color='#22c55e', alpha=0.15)
ax.fill_between(years, 0, whi_hist, where=(whi_hist >= 40) & (whi_hist < 60), color='#f59e0b', alpha=0.15)
ax.fill_between(years, 0, whi_hist, where=whi_hist < 40, color='#ef4444', alpha=0.15)
ax.axvline(barrage_year, color='#ef4444', linewidth=1, linestyle='--')
ax.text(barrage_year + 1, 85, 'Ithai Barrage', color='#ef4444', fontsize=9)
ax.axvline(recovery_year, color='#22c55e', linewidth=1, linestyle='--')
ax.text(recovery_year + 1, 85, 'Recovery plan', color='#22c55e', fontsize=9)
ax.axhspan(60, 100, alpha=0.05, color='#22c55e')
ax.axhspan(40, 60, alpha=0.05, color='#f59e0b')
ax.axhspan(0, 40, alpha=0.05, color='#ef4444')
ax.text(1971, 62, 'Good', color='#22c55e', fontsize=8)
ax.text(1971, 42, 'Fair', color='#f59e0b', fontsize=8)
ax.text(1971, 22, 'Poor', color='#ef4444', fontsize=8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Wetland Health Index', color='white')
ax.set_title('Loktak Lake WHI: 1970-2030', color='white', fontsize=12, fontweight='bold')
ax.set_ylim(0, 100)
ax.tick_params(colors='gray')

# Plot 2: Current year radar chart
ax2 = axes[0, 1]
ax2.remove()
ax2 = fig.add_subplot(2, 2, 2, projection='polar')
ax2.set_facecolor('#111827')
labels = list(scores_now.keys())
values = [scores_now[l][0] for l in labels]
angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
values += [values[0]]
angles += [angles[0]]
ax2.fill(angles, values, color='#3b82f6', alpha=0.25)
ax2.plot(angles, values, color='#3b82f6', linewidth=2)
ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(labels, fontsize=8, color='white')
ax2.set_rmax(100)
ax2.set_title(f'Current WHI: {whi_now:.0f}/100', color='white', fontsize=11, pad=20)
ax2.tick_params(colors='gray')

# Plot 3: Individual indicators over time
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.plot(years, score_DO(do_hist), linewidth=2, label='DO score', color='#22c55e')
ax3.plot(years, score_BOD(bod_hist), linewidth=2, label='BOD score', color='#3b82f6')
ax3.plot(years, score_secchi(secchi_hist), linewidth=2, label='Transparency', color='#f59e0b')
ax3.plot(years, score_phumdi(phumdi_hist), linewidth=2, label='Phumdi area', color='#a855f7')
ax3.plot(years, score_fish_species(fish_hist), linewidth=2, label='Fish diversity', color='#ef4444')
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Component score (0-100)', color='white')
ax3.set_title('Individual Health Indicators', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Management intervention comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
interventions = ['Do nothing', 'Barrage\\nmodification', 'Nutrient\\nreduction', 'Combined\\nplan']
whi_2030 = [28, 42, 38, 58]
colors = ['#ef4444', '#f59e0b', '#f59e0b', '#22c55e']
bars = ax4.bar(interventions, whi_2030, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
ax4.axhline(60, color='#22c55e', linewidth=1, linestyle='--', label='Good threshold')
ax4.axhline(40, color='#f59e0b', linewidth=1, linestyle='--', label='Fair threshold')
for bar, val in zip(bars, whi_2030):
    ax4.text(bar.get_x() + bar.get_width() / 2, val + 1, f'{val}',
             ha='center', color='white', fontsize=11, fontweight='bold')
ax4.set_ylabel('Projected WHI in 2030', color='white')
ax4.set_title('Management Scenario Comparison', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
ax4.set_ylim(0, 80)

plt.tight_layout()
plt.show()

print("Loktak Lake Wetland Health Index — Current Assessment:")
print(f"{'Indicator':<20} {'Value':>10} {'Score':>8} {'Weight':>8}")
print("-" * 50)
current_vals = {'DO': '5.2 mg/L', 'BOD': '8.5 mg/L', 'pH': '6.3',
                'Transparency': '1.2 m', 'Phumdi area': '25 km²', 'Fish diversity': '22 spp'}
for name in scores_now:
    score, weight = scores_now[name]
    print(f"{name:<20} {current_vals[name]:>10} {score:>7.0f} {weight:>7.0%}")
print(f"\\nOverall WHI: {whi_now:.0f}/100 — {'Poor' if whi_now < 40 else 'Fair' if whi_now < 60 else 'Good'}")
print(f"\\nKey finding: No single intervention is sufficient.")
print(f"Only a combined plan (hydrology + nutrients) can push WHI above 'Fair'.")
print(f"Loktak's secret garden needs integrated science-based management to survive.")`,
      challenge: 'Add a sensitivity analysis: which indicator has the greatest influence on the overall WHI? Vary each indicator independently and plot how the WHI changes. This tells managers where to invest limited resources for maximum impact.',
      successHint: 'The Wetland Health Index is an example of composite environmental indicators — tools that reduce complex, multi-dimensional ecological data into actionable scores. The challenge is always in the weighting: which parameters matter most depends on the specific ecosystem and management goals.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (wetland ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real wetland hydrology and ecology simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
