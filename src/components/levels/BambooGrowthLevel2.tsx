import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooGrowthLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Growth models — logistic and Gompertz curves',
      concept: `In Level 1, we saw that bamboo follows an S-shaped growth curve. In Level 2, we fit mathematical models to this curve.

**Logistic growth model:**
H(t) = K / (1 + e^(-r(t - t₀)))
- K = carrying capacity (maximum height)
- r = intrinsic growth rate
- t₀ = inflection point (time of fastest growth)
- Symmetric: growth accelerates and decelerates equally

**Gompertz growth model:**
H(t) = K * exp(-b * exp(-c * t))
- K = maximum height
- b = displacement along time axis
- c = growth rate
- Asymmetric: slow start, rapid middle, VERY slow approach to maximum

Bamboo fits the **Gompertz model** better than logistic because:
- The rapid growth phase is compressed (just 2-3 weeks)
- The deceleration phase is prolonged (maturation takes months)
- The curve is right-skewed: fast growth, slow finish

Fitting models to data lets us **predict** — when will this bamboo reach harvesting height?`,
      analogy: 'The logistic curve is like an equal-opportunity employer: it gives equal time to acceleration and deceleration. The Gompertz curve is like a sprinter: explosive start, gradual slowdown. Bamboo is a sprinter — its rapid growth phase is disproportionately short and intense.',
      storyConnection: 'The story marvels at bamboo\'s speed, but the Gompertz model reveals something deeper: the speed is concentrated into a brief window. Most of bamboo\'s life is spent slowly maturing. The drama of "91 cm per day" lasts only 2-3 weeks out of a 3-5 year maturation cycle.',
      checkQuestion: 'If you measured a bamboo shoot daily for 60 days and wanted to predict its final height after only 20 days of data, which model would give better predictions?',
      checkAnswer: 'The Gompertz model, because its asymmetric shape means the inflection point comes earlier. With 20 days of data, you\'d likely have passed the peak growth rate, and the Gompertz model\'s long tail would give a better estimate of the asymptote (final height). The logistic model would underestimate the final height because it assumes equal deceleration time.',
      codeIntro: 'Fit and compare logistic and Gompertz models to simulated bamboo growth data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated bamboo growth data (with noise)
np.random.seed(42)
days = np.arange(0, 60, 1)

# True model: Gompertz
K_true = 2000  # cm (20 meters)
b_true = 4.5
c_true = 0.12
height_true = K_true * np.exp(-b_true * np.exp(-c_true * days))
noise = np.random.normal(0, 30, len(days))
height_data = height_true + noise
height_data = np.clip(height_data, 0, None)

# Logistic model fit
K_log = 1900
r_log = 0.15
t0_log = 25
height_logistic = K_log / (1 + np.exp(-r_log * (days - t0_log)))

# Gompertz model fit
height_gompertz = K_true * np.exp(-b_true * np.exp(-c_true * days))

# Growth rates (derivatives)
days_fine = np.linspace(0, 60, 500)
gompertz_fine = K_true * np.exp(-b_true * np.exp(-c_true * days_fine))
gompertz_rate = K_true * b_true * c_true * np.exp(-c_true * days_fine) * np.exp(-b_true * np.exp(-c_true * days_fine))

logistic_fine = K_log / (1 + np.exp(-r_log * (days_fine - t0_log)))
logistic_rate = K_log * r_log * np.exp(-r_log * (days_fine - t0_log)) / (1 + np.exp(-r_log * (days_fine - t0_log)))**2

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Height curves
ax1.set_facecolor('#111827')
ax1.scatter(days, height_data, color='white', s=15, alpha=0.5, label='Measured data')
ax1.plot(days_fine, gompertz_fine, color='#22c55e', linewidth=2, label='Gompertz model')
ax1.plot(days_fine, logistic_fine, color='#ef4444', linewidth=2, linestyle='--', label='Logistic model')
ax1.axhline(K_true, color='gray', linestyle=':', linewidth=0.5)
ax1.text(50, K_true+40, f'K = {K_true} cm', color='gray', fontsize=8)
ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Height (cm)', color='white')
ax1.set_title('Bamboo Growth: Logistic vs Gompertz Model Fit', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Growth rate curves
ax2.set_facecolor('#111827')
ax2.plot(days_fine, gompertz_rate, color='#22c55e', linewidth=2, label='Gompertz rate')
ax2.plot(days_fine, logistic_rate, color='#ef4444', linewidth=2, linestyle='--', label='Logistic rate')
ax2.fill_between(days_fine, gompertz_rate, alpha=0.15, color='#22c55e')

# Mark peak growth
peak_gom = days_fine[np.argmax(gompertz_rate)]
peak_log = days_fine[np.argmax(logistic_rate)]
ax2.axvline(peak_gom, color='#22c55e', linestyle=':', linewidth=0.5)
ax2.axvline(peak_log, color='#ef4444', linestyle=':', linewidth=0.5)
ax2.annotate(f'Gompertz peak: day {peak_gom:.0f}', xy=(peak_gom, max(gompertz_rate)),
             xytext=(peak_gom+5, max(gompertz_rate)*0.9), color='#22c55e', fontsize=8)
ax2.annotate(f'Logistic peak: day {peak_log:.0f}', xy=(peak_log, max(logistic_rate)),
             xytext=(peak_log+5, max(logistic_rate)*1.1), color='#ef4444', fontsize=8)

ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Growth rate (cm/day)', color='white')
ax2.set_title('Growth Rate: Gompertz Peak Is Earlier and Sharper', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Residual analysis
resid_log = height_data - K_log / (1 + np.exp(-r_log * (days - t0_log)))
resid_gom = height_data - K_true * np.exp(-b_true * np.exp(-c_true * days))
print("Model comparison:")
print(f"  Logistic RMSE: {np.sqrt(np.mean(resid_log**2)):.1f} cm")
print(f"  Gompertz RMSE: {np.sqrt(np.mean(resid_gom**2)):.1f} cm")
print(f"  Gompertz peak growth: day {peak_gom:.0f} at {max(gompertz_rate):.0f} cm/day")
print(f"  Logistic peak growth: day {peak_log:.0f} at {max(logistic_rate):.0f} cm/day")
print()
print("Gompertz is asymmetric: the peak comes earlier (day {:.0f} vs {:.0f})".format(peak_gom, peak_log))
print("This matches bamboo's biology: explosive growth, then slow maturation.")`,
      challenge: 'Add a third model: the Richards growth curve (a generalized logistic with a shape parameter). Does it fit even better than Gompertz? What does the extra parameter buy you?',
      successHint: 'Growth models are used far beyond biology: population forecasting, technology adoption (S-curves), epidemic modeling, and market analysis. Choosing the right model for the data is a core skill in data science.',
    },
    {
      title: 'Hormone signaling pathways — from receptor to response',
      concept: `In Level 1, we learned that auxin and gibberellin drive bamboo growth. Now let's trace the complete signaling pathway — from hormone molecule to cell response.

**Gibberellin signaling (simplified):**
1. GA molecule enters the cell
2. GA binds to **GID1** receptor protein
3. GID1-GA complex binds to **DELLA** protein (a growth repressor)
4. DELLA is tagged for destruction (ubiquitinated)
5. The **proteasome** (cellular shredder) degrades DELLA
6. Without DELLA repression, growth genes are activated
7. Enzymes that loosen cell walls are produced
8. Cell elongation occurs

The key insight: gibberellin doesn't directly activate growth. It **removes a repressor** (DELLA). This is a **double-negative** system: GA → destroys DELLA → DELLA no longer blocks growth → growth proceeds.

**Why a double-negative?** It's more controllable. A direct activator would need precise dosing. A repressor-removal system is more like a brake: growth is always "ready to go," held back by DELLA. GA just releases the brake.`,
      analogy: 'GA signaling is like a parking brake on a car parked on a hill. The car (cell) is always ready to roll (grow). DELLA is the brake. GA is the signal to release the brake. You don\'t need to push the car — gravity (turgor pressure) does the work. You just remove the thing that\'s stopping it.',
      storyConnection: 'Bamboo\'s explosive growth isn\'t driven by some special activating signal — it\'s the rapid removal of growth brakes. High GA in bamboo meristems means DELLA proteins are destroyed faster, releasing the pre-loaded cells for elongation. Speed comes from derepression, not activation.',
      checkQuestion: 'If you created a mutant bamboo where DELLA couldn\'t be destroyed (GA-insensitive), what would happen?',
      checkAnswer: 'The bamboo would be severely dwarfed — a tiny version of itself. This is exactly what happens in DELLA gain-of-function mutants in other grasses. The dwarfing genes in Green Revolution wheat are modified DELLA genes that are partially resistant to GA-mediated destruction. Less DELLA destruction → more growth repression → shorter stems.',
      codeIntro: 'Simulate the GA-DELLA signaling pathway as a dynamic system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# GA-DELLA signaling dynamics
# GA -> destroys DELLA -> releases growth
time = np.arange(0, 48, 0.1)  # hours

# GA application at t=0 (step function)
ga_scenarios = {
    'High GA (bamboo)': 10.0,
    'Normal GA': 3.0,
    'Low GA': 1.0,
    'No GA (mutant)': 0.0,
}

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

scenario_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

for ax_idx, (name, ga_level) in enumerate(ga_scenarios.items()):
    ax = axes.flat[ax_idx]
    ax.set_facecolor('#111827')

    # DELLA dynamics: dDELLA/dt = production - GA_degradation - natural_decay
    della_production = 2.0  # constant production rate
    ga_degradation_rate = 0.5 * ga_level  # proportional to GA
    natural_decay = 0.1

    della = np.zeros_like(time)
    della[0] = 10  # initial DELLA level

    growth_rate = np.zeros_like(time)
    max_growth = 5.0  # maximum growth rate when DELLA = 0

    for i in range(1, len(time)):
        dt = time[i] - time[i-1]
        d_della = (della_production - ga_degradation_rate * della[i-1] - natural_decay * della[i-1]) * dt
        della[i] = max(della[i-1] + d_della, 0)
        # Growth is inversely proportional to DELLA
        growth_rate[i] = max_growth / (1 + della[i])

    color = scenario_colors[ax_idx]

    ax.plot(time, della, color='#ef4444', linewidth=2, label='DELLA protein')
    ax.plot(time, growth_rate * 2, color='#22c55e', linewidth=2, label='Growth rate (scaled)')
    ax.fill_between(time, growth_rate * 2, alpha=0.15, color='#22c55e')

    ax.set_xlabel('Time (hours)', color='white')
    ax.set_ylabel('Level', color='white')
    ax.set_title(f'{name}', color=color, fontsize=11, fontweight='bold')
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 12)

    # Steady state annotation
    if ga_level > 0:
        ss_della = della_production / (ga_degradation_rate + natural_decay)
        ss_growth = max_growth / (1 + ss_della)
        ax.axhline(ss_della, color='#ef4444', linestyle=':', linewidth=0.5, alpha=0.5)
        ax.text(40, ss_della + 0.3, f'DELLA ss: {ss_della:.1f}', color='#ef4444', fontsize=7)

plt.suptitle('GA-DELLA Signaling: Removing the Brake on Growth',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("GA-DELLA signaling summary:")
for name, ga_level in ga_scenarios.items():
    if ga_level > 0:
        ss_della = della_production / (ga_degradation_rate/ga_level*ga_level + natural_decay)
    else:
        ss_della = della_production / natural_decay
    ss_growth = max_growth / (1 + ss_della)
    print(f"  {name}: DELLA steady-state = {ss_della:.1f}, growth rate = {ss_growth:.2f}")
print()
print("Key insight: GA doesn't push growth — it releases the brake (DELLA)")
print("High GA -> low DELLA -> fast growth (bamboo)")
print("No GA -> high DELLA -> no growth (dwarf mutant)")`,
      challenge: 'Add a feedback loop: high growth rate triggers more GA production (positive feedback). How does this change the dynamics? Does it explain why bamboo growth accelerates before decelerating?',
      successHint: 'Signaling pathways with double-negative logic (destroying a repressor) are everywhere in biology: immune responses, cancer cell death, gene regulation. The GA-DELLA system is a textbook example of elegant molecular engineering.',
    },
    {
      title: 'Water transport — xylem and the transpiration stream',
      concept: `Bamboo grows 91 cm/day. Each centimeter of growth requires water to fill the expanding cells. Where does all this water come from, and how does it travel up a 30-meter stem?

**The transpiration-cohesion-tension theory:**
1. **Transpiration**: water evaporates from leaf stomata (tiny pores). A single bamboo culm can transpire 100+ litres per day.
2. **Tension**: evaporation creates negative pressure (tension) at the top of the plant — like sucking on a straw.
3. **Cohesion**: water molecules stick to each other via hydrogen bonds, forming an unbroken column.
4. **Adhesion**: water sticks to the walls of xylem vessels, preventing the column from falling.

The tension at the top pulls the entire water column upward. No pump is needed — it's a passive system driven by evaporation.

**Xylem transport speed**: 1-10 metres per hour in most trees. In bamboo during rapid growth: up to 15 m/hour — one of the fastest rates in the plant kingdom.

**The physics challenge**: water under tension is unstable. If a bubble forms (cavitation), the column breaks and that xylem vessel stops working. This is why extreme drought kills trees — widespread cavitation.`,
      analogy: 'The transpiration stream is like a chain of people passing buckets of water up a ladder. The person at the top empties their bucket (transpiration), creating a gap. Everyone pulls from the person below (cohesion). Nobody pushes — the pull comes from the top. If one person lets go (cavitation), that chain breaks.',
      storyConnection: 'Bamboo\'s rapid growth requires a massive water supply — hundreds of litres per day pumped to heights of 30 metres with no heart, no pump, no energy expenditure. The transpiration stream is one of the most elegant passive transport systems in nature.',
      checkQuestion: 'The tallest tree (a redwood at 116m) lifts water 116 metres by transpiration tension. What\'s the minimum pressure needed? (Hint: 1 atmosphere lifts water ~10m.)',
      checkAnswer: 'At minimum: 116/10 = 11.6 atmospheres of negative pressure (tension). In reality, it\'s about 15-20 atmospheres because of friction in the xylem and the need to overcome gravity AND generate enough flow. That\'s enormous tension on a liquid — and yet the water column holds together because of hydrogen bonding between water molecules.',
      codeIntro: 'Model water transport through bamboo xylem using the cohesion-tension theory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Water transport model
# Flow rate = (pressure_diff * conductivity) / (viscosity * height)
# Simplified Hagen-Poiseuille for xylem

height = np.linspace(0, 30, 300)  # meters (bamboo height)

# Pressure profile (MPa)
# At soil: ~0 MPa (atmospheric)
# At leaves: -1.5 to -2.5 MPa (transpiration tension)
# Hydrostatic: -0.01 MPa per meter height

soil_water_potential = -0.1  # MPa (well-watered soil)
transpiration_tension = -2.0  # MPa at leaves
hydrostatic = -0.01 * height  # gravity component

# Total water potential gradient
water_potential = soil_water_potential + (transpiration_tension - soil_water_potential) * (height / 30) + hydrostatic

# Flow velocity (proportional to pressure gradient)
conductivity = 5  # relative units
viscosity = 1  # relative
pressure_gradient = np.gradient(water_potential, height)
flow_velocity = -conductivity * pressure_gradient / viscosity  # m/hr

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Water potential profile
ax1.set_facecolor('#111827')
ax1.plot(water_potential, height, color='#3b82f6', linewidth=2, label='Water potential')
ax1.plot(hydrostatic + soil_water_potential, height, color='gray', linewidth=1,
         linestyle='--', label='Gravity only')
ax1.set_xlabel('Water potential (MPa)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Water Potential From Soil to Leaf', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotate key zones
ax1.annotate('Soil\\n(0 to -0.1 MPa)', xy=(soil_water_potential, 0),
             xytext=(soil_water_potential+0.3, 3), color='#22c55e', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax1.annotate('Leaves\\n(-2 MPa tension)', xy=(water_potential[-1], 30),
             xytext=(water_potential[-1]+0.3, 27), color='#ef4444', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Flow velocity profile
ax2.set_facecolor('#111827')

# Different scenarios
scenarios = {
    'Well-watered (high transpiration)': (-2.0, '#22c55e'),
    'Moderate stress': (-1.5, '#f59e0b'),
    'Drought (stomata closing)': (-0.5, '#ef4444'),
}

for name, (tension, color) in scenarios.items():
    wp = soil_water_potential + (tension - soil_water_potential) * (height / 30) + hydrostatic
    pg = np.gradient(wp, height)
    fv = -conductivity * pg / viscosity
    ax2.plot(fv, height, color=color, linewidth=2, label=name)

ax2.set_xlabel('Flow velocity (m/hr)', color='white')
ax2.set_ylabel('Height (m)', color='white')
ax2.set_title('Xylem Flow Velocity', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Mark growth zone
ax2.axhspan(0, 5, alpha=0.1, color='#a855f7')
ax2.text(0.01, 2.5, 'Active growth\\nzone (needs water)', color='#a855f7', fontsize=8)

plt.tight_layout()
plt.show()

print("Water transport in bamboo:")
print(f"  Height: 30 meters")
print(f"  Minimum tension needed: {30 * 0.01 + 0.1:.1f} MPa (gravity + soil)")
print(f"  Actual leaf tension: ~2.0 MPa")
print(f"  Daily water use: 100-200 litres per culm")
print()
print("During rapid growth, bamboo needs extra water for cell expansion.")
print("This is why bamboo grows fastest in the rainy season —")
print("both soil water and humidity support the massive transpiration demand.")`,
      challenge: 'At what height would cavitation (column breaking) become likely? Assume cavitation occurs when tension exceeds 3 MPa. Modify the model to find the maximum viable height for bamboo.',
      successHint: 'The transpiration stream is a marvel of passive physics — no pump, no energy, just evaporation and molecular cohesion. Understanding it explains plant height limits, drought responses, and why forests influence rainfall.',
    },
    {
      title: 'Mechanical properties of bamboo — hollow strength',
      concept: `Bamboo's hollow-tube structure is not a weakness — it's an engineering optimization. A hollow tube is stronger per unit mass than a solid rod of the same material.

**Why hollow is strong:**
The **second moment of area** (I) determines bending resistance:
- Solid circle: I = (pi/4) * r⁴
- Hollow tube: I = (pi/4) * (R⁴ - r⁴)

A hollow tube with the same outer diameter but 60% of the mass of a solid rod retains ~85% of its bending resistance. The material at the center of a solid rod barely contributes to strength — removing it saves weight with minimal strength loss.

**Bamboo's additional tricks:**
- **Graded structure**: the outer wall is denser (more fibers) than the inner wall. Stress is highest at the surface, so bamboo puts its strongest material where it's needed most.
- **Nodes**: the solid partitions at each joint act as bulkheads, preventing the tube from buckling (like the frames in an airplane fuselage).
- **Fiber alignment**: bamboo fibers run lengthwise, aligned with the main stress direction. Like carbon fiber composites.
- **Silica deposits**: bamboo accumulates silica from soil water, creating a hard, wear-resistant surface.`,
      analogy: 'A bamboo culm is like a carbon fiber bicycle frame: hollow, with the strongest material on the outside, internal ribs (nodes) to prevent buckling, and fibers aligned with stress. The difference is that bamboo assembles itself from water and sunlight in 3 years. The bicycle frame takes a factory and $5,000.',
      storyConnection: 'Why does bamboo never bend? Not because it\'s solid — because it\'s hollow AND engineered. The same principle that makes airplane fuselages and racing yacht masts strong makes bamboo strong: hollow tubes with strategic reinforcement.',
      checkQuestion: 'Why don\'t trees use hollow tubes like bamboo? Wouldn\'t they be lighter?',
      checkAnswer: 'Trees face different mechanical challenges. They need to support heavy lateral branches (bending moments) and resist wind from all directions. A solid core with growth rings provides this omnidirectional strength. Bamboo has no branches and sways with the wind rather than resisting it — different strategy, different architecture. Also, tree wood doubles as water transport (xylem); hollow stems would reduce transport capacity.',
      codeIntro: 'Calculate and compare the bending resistance of hollow vs. solid cylinders.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bending resistance: second moment of area (I)
# Solid: I = pi/4 * R^4
# Hollow: I = pi/4 * (R_outer^4 - R_inner^4)

R_outer = 5  # cm (bamboo outer radius)

# Vary wall thickness
wall_thickness = np.linspace(0.1, R_outer, 100)  # cm
R_inner = R_outer - wall_thickness

I_hollow = np.pi / 4 * (R_outer**4 - R_inner**4)
I_solid = np.pi / 4 * R_outer**4

# Mass (proportional to cross-sectional area)
area_hollow = np.pi * (R_outer**2 - R_inner**2)
area_solid = np.pi * R_outer**2

# Efficiency: I per unit area (strength per unit mass)
efficiency = I_hollow / area_hollow

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# I vs wall thickness
ax1.set_facecolor('#111827')
ax1.plot(wall_thickness, I_hollow / I_solid * 100, color='#22c55e', linewidth=2,
         label='Bending resistance (% of solid)')
ax1.plot(wall_thickness, area_hollow / area_solid * 100, color='#3b82f6', linewidth=2,
         label='Mass (% of solid)')
ax1.axhline(100, color='gray', linestyle=':', linewidth=0.5)

# Mark bamboo's typical wall thickness (~1.5 cm for R=5)
bamboo_wall = 1.5
bamboo_I = np.pi/4 * (R_outer**4 - (R_outer - bamboo_wall)**4) / I_solid * 100
bamboo_mass = np.pi * (R_outer**2 - (R_outer - bamboo_wall)**2) / area_solid * 100

ax1.plot(bamboo_wall, bamboo_I, 'o', color='#f59e0b', markersize=10)
ax1.plot(bamboo_wall, bamboo_mass, 'o', color='#f59e0b', markersize=10)
ax1.annotate(f'Bamboo: {bamboo_I:.0f}% strength\\nat {bamboo_mass:.0f}% mass',
             xy=(bamboo_wall, bamboo_I), xytext=(bamboo_wall+1, bamboo_I-15),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_xlabel('Wall thickness (cm)', color='white')
ax1.set_ylabel('Percentage of solid cylinder', color='white')
ax1.set_title('Hollow vs Solid: Strength-to-Mass Ratio', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Efficiency curve
ax2.set_facecolor('#111827')
ax2.plot(wall_thickness, efficiency, color='#a855f7', linewidth=2)
ax2.fill_between(wall_thickness, efficiency, alpha=0.15, color='#a855f7')

ax2.plot(bamboo_wall, np.pi/4 * (R_outer**4 - (R_outer-bamboo_wall)**4) /
         (np.pi * (R_outer**2 - (R_outer-bamboo_wall)**2)),
         'o', color='#f59e0b', markersize=10)

ax2.set_xlabel('Wall thickness (cm)', color='white')
ax2.set_ylabel('Efficiency (I / area)', color='white')
ax2.set_title('Structural Efficiency (higher = better per unit mass)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Bamboo mechanics (R={R_outer}cm, wall={bamboo_wall}cm):")
print(f"  Bending resistance: {bamboo_I:.0f}% of solid")
print(f"  Mass: {bamboo_mass:.0f}% of solid")
print(f"  Efficiency gain: {bamboo_I/bamboo_mass:.1f}x better strength-to-mass")
print()
print("Aerospace insight: airplane fuselages use the same principle.")
print("A hollow tube with 50% of the mass of a solid rod")
print("retains ~85% of its bending resistance.")
print("Nature discovered this millions of years before engineers did.")`,
      challenge: 'Add nodes (solid cross-sections every 30cm) and calculate how they affect buckling resistance. A hollow tube without nodes would buckle like crushing a drinking straw. How much do nodes help?',
      successHint: 'Structural mechanics — second moment of area, buckling, strength-to-weight optimization — are the same whether you\'re analyzing bamboo, bridges, or spacecraft. Nature optimized these equations millions of years ago.',
    },
    {
      title: 'Carbon sequestration — bamboo as climate solution',
      concept: `Bamboo absorbs CO₂ faster than almost any other plant — up to **12 tonnes per hectare per year**, compared to 6 tonnes for a typical tree plantation. This makes bamboo a powerful tool in the fight against climate change.

**Why bamboo sequesters so much carbon:**
1. **Fast growth**: 91 cm/day means rapid biomass accumulation
2. **Dense stands**: up to 40,000 culms per hectare (much denser than forests)
3. **Continuous harvest**: cutting mature culms stimulates new growth, so the grove keeps absorbing CO₂ indefinitely
4. **Root/rhizome carbon**: ~50% of bamboo biomass is underground, storing carbon in the soil
5. **Durable products**: bamboo used in construction, furniture, and textiles locks carbon for decades

**Carbon math for one hectare of bamboo:**
- Above-ground biomass: ~100 tonnes → ~50 tonnes carbon → ~180 tonnes CO₂ equivalent
- Below-ground biomass: ~50 tonnes → ~25 tonnes carbon → ~90 tonnes CO₂
- Annual addition: ~12 tonnes CO₂
- Product carbon storage: varies (flooring lasts 25+ years, charcoal locks carbon permanently)

Bamboo plantations on degraded land in NE India could sequester millions of tonnes of CO₂ annually while providing sustainable livelihoods.`,
      analogy: 'Bamboo is like a carbon vacuum cleaner that never fills up. A tree is a vacuum that runs once and fills its bag (stops absorbing when mature). Bamboo can be "emptied" (harvested) and restarted, pulling CO₂ from the atmosphere continuously, decade after decade.',
      storyConnection: 'The story asks why bamboo is so special. Here\'s the climate answer: bamboo is one of the fastest, cheapest, most scalable ways to remove CO₂ from the atmosphere. In NE India, where bamboo grows naturally and abundantly, it could be a cornerstone of climate action.',
      checkQuestion: 'If bamboo charcoal (biochar) is buried in soil, how long does the carbon stay locked away?',
      checkAnswer: 'Biochar is extremely stable — estimates range from hundreds to thousands of years. The carbon in biochar is in aromatic ring structures that resist microbial decomposition. This is why ancient charcoal is found at archaeological sites after millennia. Bamboo → biochar → soil burial is essentially permanent carbon sequestration.',
      codeIntro: 'Model carbon sequestration by bamboo vs. other land uses over 50 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 51)

# Carbon sequestration models (tonnes CO2 per hectare)

# Bamboo: continuous sequestration (harvest and regrow)
bamboo_rate = 12  # tonnes CO2/ha/year
bamboo_cumulative = bamboo_rate * years

# Tree plantation: sigmoid growth, slows as trees mature
tree_max_rate = 6  # tonnes/ha/year at peak
tree_carbon = 180 * (1 - np.exp(-0.05 * years))  # saturates at ~180 tonnes

# Degraded grassland: slow, minimal
grass_rate = 2
grass_carbon = grass_rate * years

# Cropland: net zero or slight emission
crop_carbon = -1 * years  # slight net emission from tillage

# Bamboo with product storage
bamboo_products = np.zeros_like(years, dtype=float)
for y in years:
    # Each year's harvest: some becomes durable products
    for harvest_year in range(y):
        age = y - harvest_year
        if age <= 25:  # products last ~25 years
            bamboo_products[y] += 3  # 3 tonnes CO2 locked in products per year

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Cumulative sequestration
ax1.set_facecolor('#111827')
ax1.plot(years, bamboo_cumulative, color='#22c55e', linewidth=2, label='Bamboo (harvested)')
ax1.plot(years, bamboo_cumulative + bamboo_products, color='#22c55e', linewidth=2,
         linestyle='--', label='Bamboo + products')
ax1.plot(years, tree_carbon, color='#3b82f6', linewidth=2, label='Tree plantation')
ax1.plot(years, grass_carbon, color='#f59e0b', linewidth=2, label='Grassland')
ax1.plot(years, crop_carbon, color='#ef4444', linewidth=2, label='Cropland (net emitter)')
ax1.fill_between(years, bamboo_cumulative, tree_carbon, where=bamboo_cumulative > tree_carbon,
                 alpha=0.1, color='#22c55e')

ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Cumulative CO2 sequestered (tonnes/ha)', color='white')
ax1.set_title('Carbon Sequestration: Bamboo vs Other Land Uses', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# NE India scenario
ax2.set_facecolor('#111827')
# If 100,000 hectares of degraded land in NE India planted with bamboo
area_ha = 100000
years_proj = np.arange(0, 31)

# Annual sequestration
bamboo_annual = area_ha * bamboo_rate / 1e6  # million tonnes CO2/year
tree_annual = area_ha * np.gradient(180 * (1 - np.exp(-0.05 * years_proj))) / 1e6

ax2.plot(years_proj, np.full_like(years_proj, bamboo_annual, dtype=float),
         color='#22c55e', linewidth=2, label='Bamboo (constant)')
ax2.plot(years_proj, tree_annual, color='#3b82f6', linewidth=2, label='Tree plantation (declining)')
ax2.fill_between(years_proj, bamboo_annual, tree_annual,
                 where=np.full_like(years_proj, bamboo_annual, dtype=float) > tree_annual,
                 alpha=0.15, color='#22c55e')

ax2.set_xlabel('Years after planting', color='white')
ax2.set_ylabel('Annual CO2 sequestered (million tonnes)', color='white')
ax2.set_title(f'NE India Scenario: {area_ha:,} ha of Bamboo', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"NE India bamboo scenario ({area_ha:,} hectares):")
print(f"  Annual CO2 sequestration: {area_ha * bamboo_rate:,.0f} tonnes = {area_ha * bamboo_rate / 1e6:.1f} million tonnes")
print(f"  Over 30 years: {area_ha * bamboo_rate * 30 / 1e6:.0f} million tonnes CO2")
print()
print(f"  For context: India's total annual emissions are ~2,800 million tonnes CO2")
print(f"  100,000 ha of bamboo = {area_ha * bamboo_rate / 2800e6 * 100:.2f}% of India's emissions")
print(f"  Scale to 1 million ha: {10 * area_ha * bamboo_rate / 2800e6 * 100:.1f}% of India's emissions")
print()
print("Bamboo on degraded land = carbon removal + jobs + materials")
print("One of the most practical climate solutions for NE India.")`,
      challenge: 'Add a biochar scenario: 30% of harvested bamboo is converted to biochar (permanently stored carbon). How does this change the 50-year cumulative sequestration? Model the long-term difference between composting vs. biochar.',
      successHint: 'From growth hormones to water transport to mechanical engineering to climate science — bamboo connects cell biology to global sustainability. Understanding bamboo is understanding how biology can solve human problems.',
    },
    {
      title: 'Bamboo engineering — from bicycles to buildings',
      concept: `Bamboo's mechanical properties (high strength-to-weight, hollow tube, natural composite) make it an ideal engineering material. Modern applications push bamboo far beyond traditional uses:

**Structural engineering:**
- **Bamboo-reinforced concrete**: bamboo strips replace steel rebar. Tensile strength is 60-80% of steel at 1/8 the weight and 1/50 the cost. Used in affordable housing in the Philippines and Colombia.
- **Laminated bamboo lumber (LBL)**: strips are glued into beams and panels. Stronger than timber, competitive with structural steel in some applications.
- **Cross-laminated bamboo (CLB)**: alternating layers (like plywood) create panels for walls and floors. A bamboo equivalent of cross-laminated timber (CLT).

**Transportation:**
- Bamboo bicycles: lighter than steel, absorb vibration better than aluminum. Companies in Ghana and Vietnam build them commercially.
- Bamboo skateboards, surfboards, even experimental car body panels.

**Textiles:**
- Bamboo viscose: cellulose extracted from bamboo, processed into silky fabric. Breathable, antibacterial (naturally), biodegradable.

**Challenge for engineers:** standardizing bamboo (natural variation) for building codes. ISO 22156 (2021) is the first international standard for bamboo structures.`,
      analogy: 'Bamboo is to the 21st century what steel was to the 19th: a versatile, strong material that can be used for everything from housing to transportation. The difference is that bamboo grows itself, sequesters carbon while growing, and biodegrades when done. Steel does none of those.',
      storyConnection: 'The story ends with bamboo as NE India\'s gift to the world. The engineering potential is real: NE India has the largest bamboo reserves in India (over 50% of national bamboo stock). Turning this natural resource into engineered products is an economic and environmental opportunity.',
      checkQuestion: 'Why has bamboo not already replaced steel in construction if it\'s so good?',
      checkAnswer: 'Four barriers: (1) Building codes require standardized materials; natural bamboo varies in strength, diameter, and wall thickness. Laminated bamboo solves this but adds processing cost. (2) Durability: untreated bamboo degrades in 3-5 years. Treatment (borax, heat) extends life to 25+ years but adds cost. (3) Joining: bamboo\'s hollow, round cross-section makes connections harder than steel bolts in I-beams. (4) Cultural bias: bamboo is perceived as "poor" despite superior engineering properties in many applications.',
      codeIntro: 'Compare engineering properties of bamboo products with conventional materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Engineering material comparison
materials = {
    'Raw bamboo': {'tensile': 185, 'compressive': 65, 'density': 700, 'cost': 200, 'co2': 0.5, 'color': '#22c55e'},
    'Laminated\\nbamboo (LBL)': {'tensile': 120, 'compressive': 55, 'density': 650, 'cost': 500, 'co2': 1.2, 'color': '#86efac'},
    'Pine wood': {'tensile': 40, 'compressive': 35, 'density': 500, 'cost': 300, 'co2': 0.7, 'color': '#f59e0b'},
    'Steel\\n(mild)': {'tensile': 250, 'compressive': 250, 'density': 7800, 'cost': 800, 'co2': 2.5, 'color': '#6b7280'},
    'Concrete': {'tensile': 5, 'compressive': 40, 'density': 2400, 'cost': 50, 'co2': 0.15, 'color': '#94a3b8'},
    'Carbon\\nfiber': {'tensile': 3500, 'compressive': 1500, 'density': 1600, 'cost': 15000, 'co2': 30, 'color': '#3b82f6'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

names = list(materials.keys())
colors = [m['color'] for m in materials.values()]

# Tensile vs compressive strength
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, (name, props) in enumerate(materials.items()):
    ax.scatter(props['compressive'], props['tensile'], s=200, color=props['color'],
               edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(name.replace('\\n', ' '), xy=(props['compressive'], props['tensile']),
                xytext=(props['compressive']+5, props['tensile']+10),
                color=props['color'], fontsize=7)
ax.set_xlabel('Compressive strength (MPa)', color='white')
ax.set_ylabel('Tensile strength (MPa)', color='white')
ax.set_title('Strength Profile', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Exclude carbon fiber for better scaling
ax.set_xlim(-10, 300)
ax.set_ylim(-10, 300)

# Specific strength (strength / density)
ax = axes[0, 1]
ax.set_facecolor('#111827')
specific_tensile = [m['tensile'] / m['density'] * 1000 for m in materials.values()]
bars = ax.barh(range(len(names)), specific_tensile, color=colors, alpha=0.85)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_xlabel('Specific tensile strength (kN·m/kg)', color='white')
ax.set_title('Strength per Unit Mass (higher = lighter structure)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.invert_yaxis()
for bar, val in zip(bars, specific_tensile):
    ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
            f'{val:.0f}', va='center', color='white', fontsize=8)

# Cost vs CO2 (sustainability metric)
ax = axes[1, 0]
ax.set_facecolor('#111827')
for name, props in materials.items():
    if props['cost'] < 5000:  # exclude carbon fiber for scale
        ax.scatter(props['cost'], props['co2'], s=200, color=props['color'],
                   edgecolor='white', linewidth=1, zorder=5)
        ax.annotate(name.replace('\\n', ' '), xy=(props['cost'], props['co2']),
                    xytext=(props['cost']+20, props['co2']+0.1),
                    color=props['color'], fontsize=7)
ax.set_xlabel('Cost (USD/tonne)', color='white')
ax.set_ylabel('CO2 footprint (kg CO2/kg)', color='white')
ax.set_title('Cost vs Carbon Footprint', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Application feasibility matrix
ax = axes[1, 1]
ax.set_facecolor('#111827')
applications = ['Housing\\nstructure', 'Furniture', 'Bicycle\\nframe', 'Reinforcement\\n(rebar)', 'Flooring']
bamboo_feasibility = [7, 9, 8, 6, 9]
steel_feasibility = [9, 4, 7, 10, 3]
wood_feasibility = [8, 9, 3, 2, 8]

x = np.arange(len(applications))
width = 0.25
ax.bar(x - width, bamboo_feasibility, width, color='#22c55e', alpha=0.85, label='Bamboo')
ax.bar(x, steel_feasibility, width, color='#6b7280', alpha=0.85, label='Steel')
ax.bar(x + width, wood_feasibility, width, color='#f59e0b', alpha=0.85, label='Wood')
ax.set_xticks(x)
ax.set_xticklabels(applications, color='white', fontsize=8)
ax.set_ylabel('Feasibility (0-10)', color='white')
ax.set_title('Application Suitability', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bamboo engineering summary:")
print(f"  Specific strength: {materials['Raw bamboo']['tensile']/materials['Raw bamboo']['density']*1000:.0f} kN*m/kg")
print(f"  vs Steel: {materials['Steel\\n(mild)']['tensile']/materials['Steel\\n(mild)']['density']*1000:.0f} kN*m/kg")
print(f"  Bamboo is {materials['Raw bamboo']['tensile']/materials['Raw bamboo']['density'] / (materials['Steel\\n(mild)']['tensile']/materials['Steel\\n(mild)']['density']):.1f}x better strength-per-mass than steel")
print()
print("Best bamboo applications:")
print("  Flooring, furniture, bicycle frames, low-rise housing")
print("  Where strength-to-weight, sustainability, and cost matter most")`,
      challenge: 'Design a bamboo bicycle frame: calculate the minimum wall thickness needed for a tube of 4cm diameter to support a 100kg rider. Compare with an aluminum frame of the same dimensions.',
      successHint: 'From cell biology to global engineering — bamboo is where molecular science meets sustainable design. The 91 cm/day growth rate is just the beginning; what matters is what we build with the result.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biophysics of Growth</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biophysics and engineering simulations. Click to start.</p>
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