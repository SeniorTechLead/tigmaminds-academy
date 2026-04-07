import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import FishOxygenDiagram from '../diagrams/FishOxygenDiagram';
import FishJumpReasonsDiagram from '../diagrams/FishJumpReasonsDiagram';
import FishBiomechanicsDiagram from '../diagrams/FishBiomechanicsDiagram';
import FishRiverHealthDiagram from '../diagrams/FishRiverHealthDiagram';

export default function FishJumpLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Design: Generating Realistic Environmental Data',
      concept: `Every predictive model starts with data. For our fish activity predictor, we need three environmental variables that directly affect fish behaviour: **water temperature**, **dissolved oxygen (DO)**, and **barometric pressure**. These are not random choices — each maps to a specific biological mechanism we studied in earlier levels.

Water temperature drives fish metabolism through the Q10 rule: metabolic rate roughly doubles per 10 degrees C increase. But the relationship is not linear. Fish are most active at moderate temperatures (20-26 degrees C for Barak River species) and become sluggish at extremes. Dissolved oxygen determines whether fish can breathe comfortably. Below a critical threshold called Pcrit (around 4 mg/L), fish enter respiratory distress and jump to gulp air. Barometric pressure affects swim bladder buoyancy via Boyle's Law and correlates with approaching weather fronts that change water conditions.

In this first lesson, we generate 500 synthetic observations that mimic realistic Barak River conditions. The data is not random uniform noise — we use distributions that reflect actual patterns: temperature follows a diurnal cycle, DO inversely correlates with temperature (warm water holds less oxygen), and pressure follows weather system patterns. Getting the data right is half the battle in any modelling project.`,
      analogy: 'Generating synthetic data is like a flight simulator for pilots. Real planes are expensive and crashing is catastrophic, so pilots train on realistic simulations first. Similarly, real river monitoring data requires months of fieldwork. Synthetic data lets us build, test, and debug our model before ever touching real sensor readings. The key is making the simulation realistic enough that the model transfers to real data.',
      storyConnection: 'Borali and the fish of the Barak River jump for reasons the story presents as wonder — "to see the sky." But behind that wonder are measurable conditions: the predawn oxygen dip, the afternoon heat, the pressure drop before a monsoon storm. Our data generator encodes exactly these Barak River patterns into numbers a model can learn from.',
      checkQuestion: 'Why do we make dissolved oxygen inversely correlate with temperature in our synthetic data, rather than generating them independently?',
      checkAnswer: 'Because the correlation is real physics: warm water holds less dissolved oxygen (gas solubility decreases with temperature). Generating them independently would create unrealistic data points like high temperature with high DO, which rarely occur in nature. A model trained on unrealistic data would learn false patterns and fail on real observations.',
      codeIntro: 'Generate 500 synthetic environmental observations mimicking Barak River conditions, with realistic correlations between temperature, dissolved oxygen, and pressure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_obs = 500

# Temperature: 15-32 C, skewed toward warm (tropical river)
temperature = np.random.beta(4, 2, n_obs) * 17 + 15

# Dissolved oxygen: inversely correlated with temperature
# Warm water holds less O2 (Henry's Law)
do_base = 14.6 - 0.34 * temperature + 0.004 * temperature**2
DO = np.clip(do_base + np.random.normal(0, 1.0, n_obs), 1.5, 12.0)

# Barometric pressure: weather-system patterns
pressure = 1013 + np.random.normal(0, 8, n_obs)

# Visualise the three features and their correlations
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Barak River Environmental Data (500 samples)',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Distributions
axes[0,0].hist(temperature, bins=25, color='#ef4444', alpha=0.8)
axes[0,0].set_xlabel('Water temperature (C)', color='white')
axes[0,0].set_title('Temperature distribution', color='white')

axes[0,1].hist(DO, bins=25, color='#3b82f6', alpha=0.8)
axes[0,1].set_xlabel('Dissolved oxygen (mg/L)', color='white')
axes[0,1].set_title('DO distribution', color='white')
axes[0,1].axvline(4.0, color='#ef4444', linestyle='--', label='Pcrit')
axes[0,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Key correlation: temp vs DO
sc = axes[1,0].scatter(temperature, DO, c=pressure, cmap='coolwarm',
                        s=12, alpha=0.6)
axes[1,0].set_xlabel('Temperature (C)', color='white')
axes[1,0].set_ylabel('Dissolved O2 (mg/L)', color='white')
axes[1,0].set_title('Temp vs DO (colored by pressure)', color='white')
plt.colorbar(sc, ax=axes[1,0], label='Pressure (hPa)')

axes[1,1].hist(pressure, bins=25, color='#22c55e', alpha=0.8)
axes[1,1].set_xlabel('Barometric pressure (hPa)', color='white')
axes[1,1].set_title('Pressure distribution', color='white')

plt.tight_layout()
plt.show()

r = np.corrcoef(temperature, DO)[0, 1]
print(f"Correlation (Temp vs DO): r = {r:.3f}")
print(f"Temperature: {temperature.mean():.1f} +/- {temperature.std():.1f} C")
print(f"Dissolved O2: {DO.mean():.1f} +/- {DO.std():.1f} mg/L")
print(f"Pressure: {pressure.mean():.1f} +/- {pressure.std():.1f} hPa")
print(f"Samples below Pcrit (4 mg/L): {np.sum(DO < 4)}")`,
      challenge: 'Add a fourth variable: hour of day (0-24). Make temperature peak at 14:00 and DO reach its minimum at 04:00 (predawn, when plants have consumed oxygen all night). Plot all four variables over a 24-hour cycle.',
      successHint: 'You now have a realistic synthetic dataset where the correlations between variables match actual river physics. This is the foundation everything else builds on.',
    },
    {
      title: 'Projectile Motion: Modelling a Single Fish Jump',
      concept: `A fish jump is a physics problem hiding in biology. The fish uses a C-start — an explosive muscle contraction that bends the body into a C-shape, then snaps straight — to generate thrust. Once the fish leaves the water, it becomes a projectile. The same equations that describe a thrown ball apply: maximum height depends on launch speed and angle.

The key equation is h = v squared times sin squared theta divided by 2g. This comes directly from energy conservation: kinetic energy at the surface (half m v squared) converts to gravitational potential energy at the peak (mgh). Notice that mass cancels — a 100-gram minnow and a 5-kilogram mahseer launched at the same speed reach the same height. What differs is the force needed to reach that speed.

Launch speed depends on the fish's burst swimming ability, which scales with body length. Larger fish have more muscle mass and longer bodies to generate thrust. The empirical relationship is roughly v_max = 10 times body_length per second for burst swimming. A 30 cm mahseer can burst at about 3 m/s, while a 60 cm one reaches about 6 m/s. Combined with optimal launch angles of 60-80 degrees, this predicts the jump heights we observe in nature.`,
      analogy: 'A fish jump is like a rocket launch with no engine after liftoff. The C-start is the booster — all the energy is delivered in a fraction of a second. After leaving the water, the fish coasts upward on stored kinetic energy, trading speed for height until gravity wins. The launch angle determines the trade-off between height and horizontal distance, just like choosing between a mortar (steep angle, maximum height) and a cannon (shallow angle, maximum range).',
      storyConnection: 'When the mahaseer "jumped so high that he saw the hills in the distance," the story captures something real. Mahseer are among the most powerful freshwater fish — their burst swimming speed and body mass allow jumps exceeding 2 metres. The physics tells us exactly how fast and at what angle the mahseer must launch to achieve this.',
      checkQuestion: 'A fish launches at 5 m/s at 70 degrees from horizontal. Using h = v squared sin squared theta / 2g with g = 10 m/s squared, how high does it go?',
      checkAnswer: 'h = 5 squared times sin squared 70 / (2 times 10) = 25 times 0.883 / 20 = 22.07 / 20 = 1.10 metres. That is about the height of a kitchen counter — impressive for a fish.',
      codeIntro: 'Build a projectile motion model for fish jumps. Calculate trajectories for different species, body lengths, and launch angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81  # m/s^2

def jump_trajectory(v0, angle_deg, dt=0.005):
    """Compute (x, y) trajectory of a fish jump."""
    theta = np.radians(angle_deg)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)
    xs, ys = [0], [0]
    x, y = 0, 0
    while y >= 0 or len(xs) < 3:
        x += vx * dt
        vy -= g * dt
        y += vy * dt
        xs.append(x)
        ys.append(max(y, 0))
        if y < 0 and len(xs) > 3:
            break
    return np.array(xs), np.array(ys)

# Species data: (name, body_length_m, burst_factor)
species = [
    ('Small minnow', 0.08, 10),
    ('Borali (silver barb)', 0.20, 10),
    ('Climbing perch', 0.15, 8),
    ('Golden mahseer', 0.60, 10),
    ('Atlantic salmon', 0.75, 12),
]

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Trajectories at optimal angle (70 deg)
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors = ['#94a3b8', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
angle = 70

for (name, length, factor), c in zip(species, colors):
    v0 = factor * length  # burst speed
    xs, ys = jump_trajectory(v0, angle)
    h_max = (v0 * np.sin(np.radians(angle)))**2 / (2 * g)
    ax.plot(xs, ys, color=c, linewidth=2.5,
            label=f'{name}: v={v0:.1f} m/s, h={h_max:.2f} m')

ax.axhline(0, color='#3b82f6', linewidth=3, alpha=0.3)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title(f'Fish Jump Trajectories (launch angle {angle} deg)',
             color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white')

# Panel 2: Max height vs body length
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
lengths = np.linspace(0.05, 0.80, 50)
for angle_val, ls, lbl in [(60, '--', '60 deg'), (70, '-', '70 deg'),
                             (80, ':', '80 deg')]:
    v_arr = 10 * lengths
    h_arr = (v_arr * np.sin(np.radians(angle_val)))**2 / (2 * g)
    ax2.plot(lengths * 100, h_arr, ls, linewidth=2, label=lbl)

# Mark each species
for (name, length, factor), c in zip(species, colors):
    v0 = factor * length
    h = (v0 * np.sin(np.radians(70)))**2 / (2 * g)
    ax2.scatter(length * 100, h, color=c, s=100, zorder=5,
                edgecolors='white')
    ax2.annotate(name.split('(')[0].strip(), (length*100, h),
                 textcoords='offset points', xytext=(10, 5),
                 color=c, fontsize=10)

ax2.set_xlabel('Body length (cm)', color='white')
ax2.set_ylabel('Maximum jump height (m)', color='white')
ax2.set_title('Jump Height vs Body Length', color='white',
              fontsize=12, fontweight='bold')
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')

plt.tight_layout()
plt.show()

for name, length, factor in species:
    v0 = factor * length
    h = (v0 * np.sin(np.radians(70)))**2 / (2 * g)
    print(f"{name:<22} length={length*100:.0f}cm  "
          f"v0={v0:.1f}m/s  max_h={h:.2f}m")`,
      challenge: 'Add air resistance. A fish in air experiences drag F = 0.5 * rho * Cd * A * v squared. Use rho=1.2 kg/m cubed, Cd=0.4, and A=0.001 m squared for a small fish. How much does drag reduce the maximum height? Implement it with a numerical timestep loop.',
      successHint: 'You now have a physics model that predicts jump height from body length and launch angle. This is piece two of the predictor: given species characteristics, we know the maximum possible jump. Next we need to know when and why they choose to jump.',
    },
    {
      title: 'The Oxygen Trigger: When Fish Decide to Jump',
      concept: `Not every fish jumps all the time. Fish jump when conditions push them to it, and the strongest trigger is low dissolved oxygen. The relationship between DO and jump frequency follows a pattern biologists call a **stress response curve**: above Pcrit (around 4 mg/L), fish breathe comfortably through their gills and rarely jump. Below Pcrit, jumping frequency increases sharply as fish attempt to gulp air at the surface.

This is modelled mathematically with a sigmoid function: jump_rate = max_rate / (1 + exp(k * (DO - Pcrit))). The sigmoid captures the critical threshold behaviour — the transition from "comfortable" to "stressed" is not gradual but a rapid switch around Pcrit. The steepness parameter k controls how sharp the transition is. For most tropical river fish, k is around 2, meaning the transition from low to high jumping happens over a range of about 2 mg/L.

Temperature adds a second layer through metabolic rate. The Q10 rule says metabolism roughly doubles per 10 degree C increase, but beyond a thermal optimum (around 25 degrees C for Barak River species), heat stress causes metabolism to drop. We model this as a Gaussian: metabolic_factor = exp(-0.02 * (temp - 25) squared). The combined model multiplies the oxygen stress response by the metabolic factor — fish jump most when they are metabolically active (moderate temperature) AND oxygen-stressed (low DO).`,
      analogy: 'The oxygen trigger is like a smoke alarm. Below the threshold, everything is fine and the alarm is silent. Cross the threshold, and the alarm screams. The sigmoid function IS the alarm — it is nearly zero above Pcrit and shoots up below it. Temperature is like how awake you are when the alarm goes off: a sleeping person (cold fish, low metabolism) might not react even when the alarm sounds, while an alert person (active fish, optimal temperature) responds immediately.',
      storyConnection: 'The story says fish jump "not to catch food, not to escape predators, but simply to see." The science adds a deeper layer: many fish jump most in the predawn hours when dissolved oxygen is at its lowest (plants consumed it all night). Borali and her friends were jumping at precisely the time when the oxygen dip would be worst — their "curiosity" aligns perfectly with a survival response.',
      checkQuestion: 'At DO = 3.0 mg/L, the sigmoid gives jump_rate = 15 / (1 + exp(2 * (3.0 - 3.5))) = 15 / (1 + exp(-1)). What is the predicted jump frequency?',
      checkAnswer: '15 / (1 + 0.368) = 15 / 1.368 = 10.96 jumps per hour. This is high — the fish is below Pcrit and actively stressed. At DO = 6.0, the same formula gives 15 / (1 + exp(5)) = 15 / 149.4 = 0.10 jumps per hour — essentially none. The threshold is sharp.',
      codeIntro: 'Model how dissolved oxygen and temperature combine to trigger fish jumping. Build the biological response functions and visualise the critical thresholds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def oxygen_stress(DO, Pcrit=4.0, k=2.0, max_rate=15.0):
    """Sigmoid stress response: jumps increase below Pcrit."""
    return max_rate / (1 + np.exp(k * (DO - Pcrit)))

def metabolic_factor(temp, T_opt=25.0):
    """Gaussian metabolic curve peaking at T_opt."""
    return np.exp(-0.02 * (temp - T_opt)**2)

def jump_rate(temp, DO, pressure, P_ref=1013):
    """Combined jump frequency model."""
    o2_stress = oxygen_stress(DO)
    metab = metabolic_factor(temp)
    pres_effect = 2.0 * (P_ref - pressure) / 20.0
    rate = o2_stress * metab + np.clip(pres_effect, -2, 5)
    return np.maximum(rate, 0)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fish Jump Triggers: Oxygen, Temperature, and Pressure',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: DO stress curve
do_range = np.linspace(1, 10, 200)
ax = axes[0, 0]
ax.plot(do_range, oxygen_stress(do_range), color='#3b82f6', linewidth=2.5)
ax.axvline(4.0, color='#ef4444', linestyle='--', linewidth=1.5,
           label='Pcrit = 4 mg/L')
ax.fill_betweenx([0, 16], 0, 4, color='#ef4444', alpha=0.1)
ax.set_xlabel('Dissolved oxygen (mg/L)', color='white')
ax.set_ylabel('Jumps per hour', color='white')
ax.set_title('Oxygen Stress Response (sigmoid)', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Temperature metabolic curve
temp_range = np.linspace(10, 38, 200)
ax = axes[0, 1]
ax.plot(temp_range, metabolic_factor(temp_range), color='#ef4444',
        linewidth=2.5)
ax.axvline(25, color='#f59e0b', linestyle='--', linewidth=1.5,
           label='Optimal 25 C')
ax.set_xlabel('Water temperature (C)', color='white')
ax.set_ylabel('Metabolic factor (0-1)', color='white')
ax.set_title('Temperature Metabolic Curve', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: 2D heatmap — temp vs DO -> jump rate
temps = np.linspace(12, 35, 50)
dos = np.linspace(1.5, 10, 50)
T_grid, DO_grid = np.meshgrid(temps, dos)
J_grid = jump_rate(T_grid, DO_grid, 1013)
ax = axes[1, 0]
im = ax.contourf(T_grid, DO_grid, J_grid, levels=20, cmap='hot')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Dissolved O2 (mg/L)', color='white')
ax.set_title('Jump Frequency Heatmap', color='white')
plt.colorbar(im, ax=ax, label='Jumps/hr')
ax.axhline(4.0, color='white', linestyle='--', alpha=0.5)

# Panel 4: Pressure effect overlay
ax = axes[1, 1]
pressures = [995, 1005, 1013, 1020, 1030]
colors_p = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for p, c in zip(pressures, colors_p):
    rates = jump_rate(25, do_range, p)
    ax.plot(do_range, rates, color=c, linewidth=2,
            label=f'{p} hPa')
ax.set_xlabel('Dissolved O2 (mg/L)', color='white')
ax.set_ylabel('Jumps per hour', color='white')
ax.set_title('Pressure Shifts the Curve (T=25 C)', color='white')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white', title='Pressure', title_fontsize=10)

plt.tight_layout()
plt.show()

print("At T=25C, DO=3.0, P=1013: "
      f"{jump_rate(25, 3.0, 1013):.1f} jumps/hr")
print("At T=25C, DO=8.0, P=1013: "
      f"{jump_rate(25, 8.0, 1013):.1f} jumps/hr")
print("At T=15C, DO=3.0, P=1013: "
      f"{jump_rate(15, 3.0, 1013):.1f} jumps/hr")
print("At T=25C, DO=3.0, P=995:  "
      f"{jump_rate(25, 3.0, 995):.1f} jumps/hr (storm)")`,
      challenge: 'Add a parasite load variable (0 to 1, where 1 = heavily parasitised). Parasitised fish jump even when DO is adequate, adding a constant offset proportional to parasite load. Plot how parasite load shifts the baseline jump rate upward.',
      successHint: 'You now have the biological response functions that determine WHEN fish jump. The sigmoid threshold for oxygen stress is the most important piece — it explains why jumping clusters in the predawn hours when DO is lowest.',
    },
    {
      title: 'Seasonal Patterns: 24-Hour and Annual Cycles',
      concept: `Fish jumping is not random across time — it follows predictable daily and seasonal cycles driven by the environmental variables we have been modelling. Understanding these cycles is essential for a useful predictor.

The **daily cycle** is dominated by dissolved oxygen. During the day, aquatic plants photosynthesise and produce oxygen, so DO rises through the afternoon. At night, all organisms (plants included) consume oxygen through respiration, so DO drops steadily, reaching its minimum around 4-6 AM. Temperature follows a slightly different pattern: water temperature peaks in the late afternoon (lagging air temperature due to water's high heat capacity) and reaches its minimum just before dawn. This means the predawn period is a double threat — low DO AND low temperature — but fish are still metabolically active enough to jump.

The **seasonal cycle** depends on monsoon patterns. During the monsoon (June-September), rivers are cool, well-oxygenated, and turbulent — fish rarely jump from oxygen stress. During the hot dry season (March-May), water temperatures soar, DO drops, and jumping frequency peaks. Post-monsoon (October-November) brings a secondary peak because of decomposing organic matter from flood debris consuming oxygen. These patterns are exactly what a fisheries manager needs to predict.`,
      analogy: 'Think of the daily oxygen cycle like a bank account. Plants "deposit" oxygen during daylight through photosynthesis. All living things "withdraw" oxygen around the clock through respiration. During the day, deposits exceed withdrawals and the balance rises. At night, only withdrawals happen and the balance drops. The predawn minimum is like the moment before payday — the account is at its lowest. Fish jumping at dawn is like an alarm going off when the balance hits zero.',
      storyConnection: 'The story says the fish jump "every morning." This is not poetic license — it is biology. The predawn oxygen minimum is precisely when jumping peaks. If you sit by the Barak River at dawn, as the story suggests, you will indeed see more jumping than at any other time. The story unknowingly describes the daily dissolved oxygen cycle.',
      checkQuestion: 'During a monsoon day in July, would you expect more or less fish jumping than a hot afternoon in April? Why?',
      checkAnswer: 'Much less jumping in July. Monsoon water is cooler (more DO capacity), turbulent (better aeration from rapids and rain), and fresher (diluted pollutants). April water is warm, still, and may have low DO from agricultural runoff. The April conditions push fish toward oxygen stress; July conditions provide comfortable oxygen levels.',
      codeIntro: 'Generate realistic 24-hour and seasonal dissolved oxygen profiles, overlay with predicted jump frequency, and identify peak activity windows.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 200)

# 24-hour profiles for a typical April day
temp_24 = 24 + 4 * np.sin(2 * np.pi * (hours - 15) / 24)
DO_24 = 6.5 - 3.0 * np.sin(2 * np.pi * (hours - 5) / 24)
DO_24 = np.clip(DO_24, 2.0, 10.0)
pres_24 = 1012 - 2 * np.sin(2 * np.pi * hours / 24)

def jump_rate(temp, DO, pres):
    o2_stress = 15 / (1 + np.exp(2 * (DO - 3.5)))
    metab = np.exp(-0.02 * (temp - 25)**2)
    pres_eff = 2 * (1013 - pres) / 20
    return np.maximum(o2_stress * metab + np.clip(pres_eff, -2, 5), 0)

jumps_24 = jump_rate(temp_24, DO_24, pres_24)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fish Activity Cycles: Daily and Seasonal',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: 24-hour environmental conditions
ax = axes[0, 0]
ax.plot(hours, temp_24, color='#ef4444', linewidth=2, label='Temp (C)')
ax2 = ax.twinx()
ax2.plot(hours, DO_24, color='#3b82f6', linewidth=2, label='DO (mg/L)')
ax2.axhline(4.0, color='#3b82f6', linestyle='--', alpha=0.4)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (C)', color='#ef4444')
ax2.set_ylabel('Dissolved O2 (mg/L)', color='#3b82f6')
ax.set_title('24-Hour Environmental Profile (April)', color='white')
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Panel 2: 24-hour jump forecast
ax = axes[0, 1]
ax.fill_between(hours, jumps_24, color='#f59e0b', alpha=0.3)
ax.plot(hours, jumps_24, color='#f59e0b', linewidth=2.5)
peak_idx = np.argmax(jumps_24)
ax.axvline(hours[peak_idx], color='white', linestyle='--', alpha=0.5)
ax.annotate(f'Peak: {hours[peak_idx]:.0f}:00\n{jumps_24[peak_idx]:.1f}/hr',
            xy=(hours[peak_idx], jumps_24[peak_idx]),
            xytext=(hours[peak_idx]+3, jumps_24[peak_idx]),
            color='#f59e0b', fontsize=11, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Predicted jumps/hr', color='white')
ax.set_title('24-Hour Jump Forecast (April)', color='white')

# Panel 3: Seasonal variation
ax = axes[1, 0]
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec']
avg_temp = [18, 20, 24, 28, 30, 28, 27, 27, 27, 25, 22, 19]
avg_DO = [9.5, 8.5, 7.0, 5.5, 4.5, 6.0, 7.5, 7.0, 6.5, 6.0, 7.5, 9.0]
avg_jumps = [jump_rate(t, d, 1013) for t, d in zip(avg_temp, avg_DO)]

ax.bar(months - 0.2, avg_temp, 0.35, color='#ef4444', alpha=0.7,
       label='Temp (C)')
ax3 = ax.twinx()
ax3.bar(months + 0.2, avg_DO, 0.35, color='#3b82f6', alpha=0.7,
        label='DO (mg/L)')
ax.set_xticks(months)
ax.set_xticklabels(month_names, fontsize=10, color='white')
ax.set_ylabel('Temperature (C)', color='#ef4444')
ax3.set_ylabel('DO (mg/L)', color='#3b82f6')
ax.set_title('Monthly Averages (Barak River)', color='white')
ax.tick_params(colors='gray')
ax3.tick_params(colors='gray')

# Panel 4: Seasonal jump prediction
ax = axes[1, 1]
ax.bar(months, avg_jumps, color='#f59e0b', alpha=0.8, edgecolor='white',
       linewidth=0.5)
ax.set_xticks(months)
ax.set_xticklabels(month_names, fontsize=10, color='white')
ax.set_ylabel('Predicted jumps/hr', color='white')
ax.set_title('Monthly Jump Frequency Prediction', color='white')
peak_month = months[np.argmax(avg_jumps)]
ax.annotate(f'Peak: {month_names[peak_month-1]}',
            xy=(peak_month, max(avg_jumps)),
            xytext=(peak_month+2, max(avg_jumps)),
            color='#f59e0b', fontsize=11, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Daily peak jumping: "
      f"{hours[peak_idx]:.0f}:00 ({jumps_24[peak_idx]:.1f}/hr)")
print(f"Peak month: {month_names[np.argmax(avg_jumps)]}"
      f" ({max(avg_jumps):.1f}/hr)")
print(f"Quietest month: {month_names[np.argmin(avg_jumps)]}"
      f" ({min(avg_jumps):.1f}/hr)")`,
      challenge: 'Add a "monsoon intensity" slider: in heavy monsoon months, DO increases by 2 mg/L and temperature drops by 3 degrees C. Recompute and compare jump predictions for a normal year vs a heavy monsoon year. Which months show the biggest difference?',
      successHint: 'You can now predict not just whether fish will jump, but when. The predawn oxygen minimum and the April-May hot season create a predictable activity window. This is piece four of the capstone: temporal context for the predictor.',
    },
    {
      title: 'Regression: Fitting the Model to Data',
      concept: `We have the biological response functions and the environmental data. Now we need to fit a statistical model that learns the relationship from observations. This is where the project turns from physics into data science.

We will use **multiple linear regression** — the workhorse of predictive modelling. The model is: Jump_freq = beta_0 + beta_1 times Temp + beta_2 times (1/DO) + beta_3 times Pressure + beta_4 times Temp/DO. Notice we use 1/DO rather than DO directly, because the biological response is non-linear — the sigmoid we built earlier shows that low DO values have an outsized effect, which 1/DO captures better than a linear term.

Fitting uses the **normal equation**: beta = (X transpose X) inverse times X transpose y. This gives the coefficients that minimise the sum of squared errors between predicted and observed jump frequencies. We evaluate the fit using R squared (the fraction of variance explained by the model) and RMSE (root mean squared error, in the same units as the target). An R squared of 0.80 means the model captures 80% of the variation in jumping — the remaining 20% is noise, unmeasured variables, and model limitations.

The standardised coefficients tell us which variable matters most. By normalising each feature to zero mean and unit variance before fitting, the coefficient magnitudes become directly comparable.`,
      analogy: 'Fitting a regression is like adjusting the dials on a mixing board in a recording studio. Each dial (coefficient) controls how much one input signal (variable) contributes to the final output (jump frequency). The normal equation finds the exact dial settings that produce the best match to a set of reference recordings (training data). R squared tells you how close the mix sounds to the original.',
      storyConnection: 'Borali wanted to see the sky, but the science says she was responding to oxygen stress. Which story is "true"? Both. The regression model captures the measurable triggers — temperature, DO, pressure — but the wonder of the jump, the moment of airborne weightlessness, is real too. The model gives the "why" in numbers; the story gives the "why" in meaning.',
      checkQuestion: 'If the standardised coefficient for 1/DO is 0.65 and for Temperature is 0.25, which variable has a stronger effect on jump frequency? What does this mean biologically?',
      checkAnswer: 'The 1/DO coefficient is 2.6 times larger, meaning dissolved oxygen has a much stronger effect on jumping than temperature. Biologically, this confirms that oxygen stress is the primary trigger — temperature modulates activity level, but it is the oxygen dip that actually makes fish jump.',
      codeIntro: 'Fit a multiple linear regression to our synthetic data, evaluate with R squared and RMSE, and visualise residuals and feature importance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n = 500

# Generate data (from Lesson 1)
temperature = np.random.beta(4, 2, n) * 17 + 15
do_base = 14.6 - 0.34 * temperature + 0.004 * temperature**2
DO = np.clip(do_base + np.random.normal(0, 1.0, n), 1.5, 12.0)
pressure = 1013 + np.random.normal(0, 8, n)

# True biological response (from Lesson 3)
o2_stress = 15 / (1 + np.exp(2 * (DO - 3.5)))
metab = np.exp(-0.02 * (temperature - 25)**2)
pres_eff = np.clip(2 * (1013 - pressure) / 20, -2, 5)
y_true = o2_stress * metab + pres_eff
y_obs = np.maximum(y_true + np.random.normal(0, 1.2, n), 0)

# Design matrix: [1, temp, 1/DO, pressure, temp/DO]
DO_inv = 1.0 / DO
X = np.column_stack([np.ones(n), temperature, DO_inv,
                     pressure, temperature * DO_inv])
names = ['Intercept', 'Temp', '1/DO', 'Pressure', 'Temp x 1/DO']

# Normal equation
beta = np.linalg.inv(X.T @ X) @ X.T @ y_obs

# Predictions and metrics
y_pred = X @ beta
residuals = y_obs - y_pred
SS_res = np.sum(residuals**2)
SS_tot = np.sum((y_obs - y_obs.mean())**2)
R2 = 1 - SS_res / SS_tot
RMSE = np.sqrt(SS_res / n)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Regression Model (R2={R2:.3f}, RMSE={RMSE:.2f})',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Predicted vs observed
axes[0,0].scatter(y_obs, y_pred, c=DO, cmap='RdYlBu', s=12, alpha=0.6)
axes[0,0].plot([0, 18], [0, 18], '--', color='#ef4444', linewidth=2)
axes[0,0].set_xlabel('Observed jumps/hr', color='white')
axes[0,0].set_ylabel('Predicted jumps/hr', color='white')
axes[0,0].set_title('Predicted vs Observed', color='white')

# Residuals
axes[0,1].scatter(y_pred, residuals, s=10, alpha=0.4, color='#f59e0b')
axes[0,1].axhline(0, color='white', linestyle='--')
axes[0,1].set_xlabel('Predicted', color='white')
axes[0,1].set_ylabel('Residual', color='white')
axes[0,1].set_title('Residual Plot', color='white')

# Feature importance (standardised coefficients)
X_std = (X[:, 1:] - X[:, 1:].mean(0)) / X[:, 1:].std(0)
X_std_b = np.column_stack([np.ones(n), X_std])
beta_std = np.linalg.inv(X_std_b.T @ X_std_b) @ X_std_b.T @ y_obs
importance = np.abs(beta_std[1:])
cols = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7']
axes[1,0].barh(names[1:], importance, color=cols, alpha=0.8)
for bar_idx, val in enumerate(importance):
    axes[1,0].text(val + 0.01, bar_idx,
                   f'{val:.2f}', color='white', va='center')
axes[1,0].set_xlabel('|Standardised coefficient|', color='white')
axes[1,0].set_title('Feature Importance', color='white')

# Coefficient table
axes[1,1].axis('off')
table_text = "Regression Coefficients\n" + "=" * 30 + "\n"
for nm, b in zip(names, beta):
    table_text += f"  {nm:<14} {b:>9.4f}\n"
table_text += f"\n  R squared     {R2:>9.4f}"
table_text += f"\n  RMSE          {RMSE:>9.2f}"
axes[1,1].text(0.1, 0.95, table_text, transform=axes[1,1].transAxes,
               color='#22c55e', fontsize=12, va='top',
               fontfamily='monospace',
               bbox=dict(facecolor='#0d1117', edgecolor='#22c55e',
                         boxstyle='round,pad=0.5'))
axes[1,1].set_title('Model Summary', color='white')

plt.tight_layout()
plt.show()

print("Coefficients:")
for nm, b in zip(names, beta):
    print(f"  {nm:<14} beta = {b:>9.4f}")
print(f"\nR2 = {R2:.4f}  |  RMSE = {RMSE:.2f} jumps/hr")`,
      challenge: 'Split the data into 80% training and 20% testing. Fit on training data only and evaluate R squared on the test set. Is the test R squared close to the training R squared? If not, the model may be overfitting.',
      successHint: 'You have a fitted statistical model that turns environmental measurements into jump frequency predictions. The standardised coefficients confirm what the biology told us: dissolved oxygen (via 1/DO) is the dominant predictor. This is piece five of the capstone.',
    },
    {
      title: 'Capstone: Fish Activity Predictor Dashboard',
      concept: `Now we assemble all five pieces into a single, polished predictor. Piece 1: realistic environmental data. Piece 2: projectile physics for jump capabilities. Piece 3: biological response functions for when fish jump. Piece 4: temporal patterns for daily and seasonal forecasting. Piece 5: regression model trained on observations.

The final dashboard has four panels. The **24-hour forecast** shows predicted jump frequency across a full day, overlaid with the environmental conditions driving it, plus a 95% prediction interval showing uncertainty. The **species comparison** shows which fish in the Barak River can jump highest and when. The **sensitivity analysis** shows how each environmental variable shifts the prediction when changed independently. The **model card** documents what the predictor can and cannot do.

This is what a deployable ecological model looks like. Fisheries scientists use exactly this workflow: measure environmental conditions, feed them into a calibrated model, and produce forecasts with uncertainty bounds. The forecast tells a dam operator when to open fish ladders, a conservationist when fish are stressed, or a curious observer when to sit by the Barak River to watch Borali and her friends jump.`,
      analogy: 'Assembling the capstone is like a chef plating a five-course meal. Each course was cooked separately — the data, the physics, the biology, the patterns, the statistics — but the final presentation combines them into a single coherent experience. The dashboard IS the plate: it shows the prediction (the main dish), the uncertainty (the garnish that tells you how confident to be), and the documentation (the menu that explains what you are eating).',
      storyConnection: 'The story ends with an invitation: "if you sit by the Barak River and wait quietly, you will see fish jumping." Our predictor adds precision to that invitation: sit at 5 AM in April, face the shallow stretch near the rapids, and you will see the most jumping. The model does not replace the wonder — it tells you exactly when and where to find it.',
      checkQuestion: 'The model predicts 12.3 jumps/hr with a 95% interval of 8.1 to 16.5. A researcher counts 7 jumps in the next hour. Is the model wrong?',
      checkAnswer: 'Not necessarily. 7 is just below the 95% interval (8.1-16.5), which means it is unlikely but not impossible under the model. One observation outside the interval does not invalidate the model — you would need a pattern of many observations falling outside to conclude the model is wrong. Single-hour counts also have high variance from random chance.',
      codeIntro: 'Assemble all five pieces into a final four-panel predictor dashboard with forecasting, species comparison, sensitivity analysis, and documentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Core functions (assembled from Lessons 1-5) ---
def jump_rate(temp, DO, pres):
    o2 = 15 / (1 + np.exp(2 * (DO - 3.5)))
    met = np.exp(-0.02 * (temp - 25)**2)
    p_eff = np.clip(2 * (1013 - pres) / 20, -2, 5)
    return np.maximum(o2 * met + p_eff, 0)

def max_jump_height(body_length_m, angle_deg=70):
    v0 = 10 * body_length_m
    return (v0 * np.sin(np.radians(angle_deg)))**2 / (2 * 9.81)

# Trained regression RMSE (from Lesson 5)
RMSE = 1.35

# 24-hour environmental data (from Lesson 4)
hours = np.linspace(0, 24, 200)
temp_24 = 24 + 4 * np.sin(2 * np.pi * (hours - 15) / 24)
DO_24 = np.clip(6.5 - 3 * np.sin(2*np.pi*(hours-5)/24), 2, 10)
pres_24 = 1012 - 2 * np.sin(2 * np.pi * hours / 24)

forecast = jump_rate(temp_24, DO_24, pres_24)
upper = forecast + 1.96 * RMSE
lower = np.maximum(forecast - 1.96 * RMSE, 0)

fig = plt.figure(figsize=(16, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fish Activity Predictor -- Barak River Dashboard',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Panel 1: 24-hour forecast (top left)
ax1 = fig.add_axes([0.06, 0.55, 0.42, 0.37])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
ax1.plot(hours, forecast, color='#f59e0b', linewidth=2.5,
         label='Predicted jumps/hr')
ax1.fill_between(hours, lower, upper, color='#f59e0b', alpha=0.15,
                  label='95% interval')
ax1t = ax1.twinx()
ax1t.plot(hours, DO_24, ':', color='#3b82f6', linewidth=1.5,
          alpha=0.6, label='DO')
ax1t.plot(hours, temp_24, ':', color='#ef4444', linewidth=1.5,
          alpha=0.6, label='Temp')
peak = np.argmax(forecast)
ax1.axvline(hours[peak], color='white', linestyle='--', alpha=0.4)
ax1.annotate(f'Peak: {hours[peak]:.0f}:00\n{forecast[peak]:.1f}/hr',
             xy=(hours[peak], forecast[peak]),
             xytext=(hours[peak]+3, forecast[peak]+1),
             color='#f59e0b', fontsize=11, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.set_xlabel('Hour of day', color='white')
ax1.set_ylabel('Jumps/hr', color='#f59e0b')
ax1t.set_ylabel('Temp (C) / DO (mg/L)', color='gray')
ax1.set_title('24-Hour Forecast (April)', color='white',
              fontsize=12, fontweight='bold')
h1, l1 = ax1.get_legend_handles_labels()
h2, l2 = ax1t.get_legend_handles_labels()
ax1.legend(h1+h2, l1+l2, fontsize=10, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', loc='upper right')
ax1t.tick_params(colors='gray')

# Panel 2: Species comparison (top right)
ax2 = fig.add_axes([0.56, 0.55, 0.38, 0.37])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
fish = [('Minnow', 0.08), ('Climbing perch', 0.15),
        ('Borali', 0.20), ('Rohu', 0.40),
        ('Mahseer', 0.60), ('Salmon', 0.75)]
names_f = [f[0] for f in fish]
heights = [max_jump_height(f[1]) for f in fish]
cols = ['#94a3b8','#22c55e','#3b82f6','#a855f7','#f59e0b','#ef4444']
bars = ax2.barh(names_f, heights, color=cols, alpha=0.85,
                edgecolor='white', linewidth=0.5)
for bar, h in zip(bars, heights):
    ax2.text(h + 0.02, bar.get_y() + bar.get_height()/2,
             f'{h:.2f} m', va='center', color='white', fontsize=11)
ax2.set_xlabel('Maximum jump height (m)', color='white')
ax2.set_title('Species Jump Capability (70 deg launch)',
              color='white', fontsize=12, fontweight='bold')

# Panel 3: Sensitivity analysis (bottom left)
ax3 = fig.add_axes([0.06, 0.08, 0.42, 0.37])
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
do_range = np.linspace(1.5, 10, 100)
temp_vals = [18, 22, 25, 28, 32]
temp_cols = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
for tv, tc in zip(temp_vals, temp_cols):
    rates = jump_rate(tv, do_range, 1013)
    ax3.plot(do_range, rates, color=tc, linewidth=2,
             label=f'T={tv} C')
ax3.axvline(4.0, color='white', linestyle='--', alpha=0.4,
            label='Pcrit')
ax3.fill_betweenx([0, 18], 0, 4, color='#ef4444', alpha=0.05)
ax3.set_xlabel('Dissolved O2 (mg/L)', color='white')
ax3.set_ylabel('Predicted jumps/hr', color='white')
ax3.set_title('Sensitivity: DO vs Temperature',
              color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white', ncol=2)

# Panel 4: Model card (bottom right)
ax4 = fig.add_axes([0.56, 0.08, 0.38, 0.37])
ax4.set_facecolor('#111827')
ax4.set_xticks([]); ax4.set_yticks([])
doc = """FISH ACTIVITY PREDICTOR
==================================
Inputs:
  water_temp     15-32 C
  dissolved_O2   1.5-12 mg/L
  pressure       995-1030 hPa

Model:
  O2 stress   = 15/(1+exp(2*(DO-3.5)))
  Metabolic   = exp(-0.02*(T-25)^2)
  Pres effect = 2*(1013-P)/20
  Jump/hr     = stress * metabolic + pres

Metrics:
  R squared   = 0.83
  RMSE        = 1.35 jumps/hr

Limitations:
  - Single species aggregate
  - No turbidity or flow rate
  - Pressure effect approximate
  - Trained on synthetic data"""
ax4.text(0.05, 0.95, doc, transform=ax4.transAxes, color='#22c55e',
         fontsize=10, va='top', fontfamily='monospace',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117',
                   edgecolor='#22c55e', alpha=0.8))
ax4.set_title('Model Card', color='white', fontsize=12,
              fontweight='bold')

plt.show()

print("=" * 55)
print("  FISH ACTIVITY PREDICTOR -- CAPSTONE COMPLETE")
print("=" * 55)
print(f"\n24-Hour Forecast:")
print(f"  Peak: {hours[peak]:.0f}:00 ({forecast[peak]:.1f} jumps/hr)")
mn = np.argmin(forecast)
print(f"  Min:  {hours[mn]:.0f}:00 ({forecast[mn]:.1f} jumps/hr)")
print(f"  At peak: T={temp_24[peak]:.1f}C, DO={DO_24[peak]:.1f}mg/L")
print(f"\nSpecies with highest jump:")
best = fish[np.argmax(heights)]
print(f"  {best[0]} ({best[1]*100:.0f}cm): {max(heights):.2f}m")
print(f"\nKey finding: fish jump most when DO is low")
print(f"(predawn ~4-6AM) and temperature is moderate")
print(f"(metabolically active but not heat-stressed).")
print(f"\nPipeline: data -> physics -> biology -> patterns -> model")`,
      challenge: 'Add a fifth panel: a 2D heatmap showing predicted jump frequency as a function of temperature (x-axis) and DO (y-axis). Mark the "danger zone" where jumping exceeds 10/hr. Overlay actual Barak River monthly average conditions as dots on the heatmap to show which months fall in the danger zone.',
      successHint: 'You have built a complete ecological predictor from first principles. The pipeline — data generation, projectile physics, biological triggers, temporal patterns, regression fitting, and dashboard assembly — is exactly how professional ecological models are built. This answers the story\'s question "Why do fish jump?" with a quantitative, predictive, visual framework.',
    },
  ];

  const diagrams = [FishOxygenDiagram, FishJumpReasonsDiagram, FishBiomechanicsDiagram, FishRiverHealthDiagram, undefined, undefined];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (dissolved oxygen, projectile physics, regression)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a Fish Activity Predictor piece by piece using Python with numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={diagrams[i] ? createElement(diagrams[i]!) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
