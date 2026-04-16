import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ChurningSeparationPipelineDiagram from '../diagrams/ChurningSeparationPipelineDiagram';
import ChurningDistillationDiagram from '../diagrams/ChurningDistillationDiagram';
import ChurningTitrationDiagram from '../diagrams/ChurningTitrationDiagram';
import ChurningEmulsionDiagram from '../diagrams/ChurningEmulsionDiagram';
import ChurningDensityColumnDiagram from '../diagrams/ChurningDensityColumnDiagram';
import ChurningMassSpecDiagram from '../diagrams/ChurningMassSpecDiagram';

export default function ChurningOceanLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Design a separation pipeline',
      concept: `In this capstone level, you will build complete systems that combine everything from Levels 1-3. The first project: designing an automated **separation pipeline** for a complex mixture.

A real chemical plant processes mixtures through multiple stages, each exploiting a different physical property:
1. **Filtration** — removes insoluble solids (by particle size)
2. **Centrifugation** — separates by density
3. **Distillation** — separates by boiling point
4. **Chromatography** — separates by chemical affinity

The challenge is choosing the right sequence. Filtering first removes debris that would clog a centrifuge. Centrifuging before distillation removes dense contaminants that could cause bumping. Each step must feed cleanly into the next.

Your code will define a mixture as a list of components with properties (density, boiling point, particle size, polarity), then implement each separation step as a function. The pipeline processes the mixture sequentially, producing pure fractions at each stage.

This is how real chemical engineers think: design the process as a series of well-defined operations, each exploiting a different physical property.`,
      analogy: 'Think of an airport security line. First, the metal detector removes people with weapons (filtration by a binary property). Then, passport control separates citizens from visitors (separation by category). Then, customs checks separate by what they are carrying (separation by content). Each checkpoint handles one type of check efficiently. A separation pipeline works the same way — each stage handles one separation criterion.',
      storyConnection: 'The churning of the ocean was a multi-stage process. First the churning separated the lightest substances, then progressively heavier ones. The pipeline you build here is an engineering formalization of that mythical process: systematic, sequential extraction of pure components from a complex mixture.',
      checkQuestion: 'Why is the order of separation steps important? What goes wrong if you distill before filtering?',
      checkAnswer: 'Distilling a mixture containing solid particles is dangerous and inefficient. Solid particles cause "bumping" — sudden violent boiling as superheated liquid flashes to steam around particle nucleation sites. This can shatter glassware and cause burns. Solid particles also accumulate in the distillation flask, contaminating the residue and reducing heat transfer. Always filter first, then distill the clear liquid. Process design is not just about what you do, but the order in which you do it.',
      codeIntro: 'Build a multi-stage separation pipeline processing a complex mixture.',
      code: `import numpy as np

# Define a complex mixture
# Each component: name, size(um), density(g/cm3), bp(°C), polarity
mixture = [
    ("Sand",        500.0, 2.65, 2230, "nonpolar"),
    ("Iron filings", 200.0, 7.87, 2862, "nonpolar"),
    ("Water",        0.001, 1.00, 100,  "polar"),
    ("Ethanol",      0.001, 0.79, 78.4, "polar"),
    ("Oil",          0.001, 0.92, 300,  "nonpolar"),
    ("Salt (dissolved)", 0.0003, 2.16, 1465, "polar"),
    ("Clay particles", 5.0, 2.20, 1700, "nonpolar"),
]

def filtration(mix, pore_size_um):
    """Separate by particle size."""
    residue = [c for c in mix if c[1] > pore_size_um]
    filtrate = [c for c in mix if c[1] <= pore_size_um]
    return residue, filtrate

def centrifuge(mix, threshold_density):
    """Separate by density: heavy (>threshold) vs light."""
    heavy = [c for c in mix if c[2] > threshold_density]
    light = [c for c in mix if c[2] <= threshold_density]
    return heavy, light

def distill(mix, temp_low, temp_high):
    """Collect fraction boiling between temp_low and temp_high."""
    fraction = [c for c in mix if temp_low <= c[3] <= temp_high]
    remainder = [c for c in mix if c[3] < temp_low or c[3] > temp_high]
    return fraction, remainder

print("=== SEPARATION PIPELINE ===")
print(f"Input: {len(mixture)} components")
print()

# Stage 1: Filter out large solids (>10 um)
solids, liquid_mix = filtration(mixture, 10.0)
print(f"Stage 1 — Filtration (10 um)")
print(f"  Residue: {[c[0] for c in solids]}")
print(f"  Filtrate: {[c[0] for c in liquid_mix]}")

# Stage 2: Centrifuge — separate by density
heavy, light = centrifuge(liquid_mix, 1.05)
print(f"\
Stage 2 — Centrifuge (threshold: 1.05 g/cm³)")
print(f"  Heavy: {[c[0] for c in heavy]}")
print(f"  Light: {[c[0] for c in light]}")

# Stage 3: Distill light fraction
ethanol_frac, remainder = distill(light, 70, 85)
water_frac, oils = distill(remainder, 95, 105)
print(f"\
Stage 3 — Distillation")
print(f"  78°C fraction: {[c[0] for c in ethanol_frac]}")
print(f"  100°C fraction: {[c[0] for c in water_frac]}")
print(f"  Remaining: {[c[0] for c in oils]}")

print("\
Pipeline complete! Each stage uses a different property.")`,
      challenge: 'Add a polarity-based separation step after distillation to separate oil from any remaining polar compounds. Then add a function that calculates purity percentage for each fraction. What is the minimum number of stages needed to separate all 7 components?',
      successHint: 'You have designed a complete separation pipeline — the same kind of process flowchart that chemical engineers use in industry. The key insight: no single technique separates everything; you need a pipeline that exploits multiple physical properties in sequence.',
    },
    {
      title: 'Simulate fractional distillation',
      concept: `In Level 2 you modeled simple distillation of a binary mixture. Now let's build a full **fractional distillation** simulation with multiple components and a distillation column with theoretical plates.

Each theoretical plate in a distillation column represents one "re-distillation" step. More plates = better separation. The number of plates needed depends on how close together the boiling points are:

- Gasoline (80°C) vs water (100°C): easy, ~5 plates
- Ethanol (78.4°C) vs methanol (64.7°C): medium, ~15 plates
- Benzene (80.1°C) vs toluene (110.6°C): easy, ~8 plates
- Isomers with 0.5°C difference: very hard, ~100+ plates

The code implements the **McCabe-Thiele method** (simplified): at each plate, the vapor is enriched in the more volatile component. After N plates, the vapor at the top is nearly pure low-boiling-point component.

You will model a 3-component mixture (methanol, ethanol, water) and simulate how each component is collected at different temperatures as the distillation proceeds.`,
      analogy: 'Imagine a multi-story building where each floor has a party. On the ground floor, a mixed crowd enters. The lightest dancers (best at jumping) hop up to the second floor. On the second floor, the lightest of those hop to the third. By the top floor, only the absolute lightest, best jumpers remain. Each floor is a "theoretical plate" — it enriches the mixture by one step. More floors = purer separation at the top.',
      storyConnection: 'The cosmic churning did not produce all treasures at once — they emerged progressively, each at a different stage. Fractional distillation mirrors this exactly: components emerge one at a time in order of their boiling points, each at a different "stage" of the process. The column is the modern churning rod — a tall structure that systematically separates a complex mixture.',
      checkQuestion: 'Ethanol and water form an azeotrope at 95.6% ethanol (78.2°C). What does this mean for distillation?',
      checkAnswer: 'An azeotrope is a mixture that boils at a constant temperature and produces vapor with the same composition as the liquid — it behaves as a single substance. You CANNOT purify ethanol beyond 95.6% by simple distillation because the azeotrope distills as a unit. To get 100% (absolute) ethanol, you need molecular sieves, extractive distillation, or a dehydrating agent like calcium oxide. This is why "pure" ethanol is usually sold as 95% — that is the distillation limit.',
      codeIntro: 'Model fractional distillation of a 3-component mixture with theoretical plates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three-component mixture
components = [
    {"name": "Methanol", "bp": 64.7, "fraction": 0.20, "color": "#ef4444"},
    {"name": "Ethanol",  "bp": 78.4, "fraction": 0.30, "color": "#fbbf24"},
    {"name": "Water",    "bp": 100.0, "fraction": 0.50, "color": "#3b82f6"},
]

# Simulate distillation: collect fractions at temperature ranges
temp_range = np.linspace(60, 105, 200)
collected = {c["name"]: [] for c in components}

for T in temp_range:
    for comp in components:
        # Vapor fraction depends on how close T is to bp
        # Higher volatility = more vapor at lower T
        vapor = comp["fraction"] * np.exp(-0.3 * (comp["bp"] - T))
        vapor = np.clip(vapor, 0, comp["fraction"])
        collected[comp["name"]].append(vapor)

plt.figure(figsize=(10, 5))
for comp in components:
    vals = collected[comp["name"]]
    plt.plot(temp_range, vals, linewidth=2.5, color=comp["color"],
             label=f'{comp["name"]} (bp={comp["bp"]}°C)')
    plt.fill_between(temp_range, vals, alpha=0.1, color=comp["color"])

plt.xlabel('Column temperature (°C)', fontsize=11, color='lightgray')
plt.ylabel('Vapor fraction', fontsize=11, color='lightgray')
plt.title('Fractional Distillation: 3-Component Separation', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')

# Mark collection windows
plt.axvspan(60, 70, alpha=0.1, color='red')
plt.axvspan(73, 83, alpha=0.1, color='gold')
plt.axvspan(95, 105, alpha=0.1, color='blue')
plt.tight_layout()
plt.show()

print("Collection windows:")
print("  60-70°C: Mostly methanol (first to boil)")
print("  73-83°C: Mostly ethanol (second to boil)")
print("  95-105°C: Mostly water (last to boil)")
print()
print("Purity depends on how well-separated the boiling points are")
print("and how many theoretical plates the column has.")`,
      challenge: 'Add a 4th component: "Acetone" (bp=56°C, fraction=0.15). Adjust other fractions so they sum to 1.0. Does acetone separate cleanly from methanol? If not, how many theoretical plates would you estimate are needed?',
      successHint: 'You have built a fractional distillation simulator. Real distillation columns in refineries have 20-100 theoretical plates and process thousands of barrels per day. The physics is the same — each plate enriches the vapor in the most volatile component.',
    },
    {
      title: 'Build a pH monitoring system',
      concept: `In Levels 1-2 you calculated pH from concentrations. Now let's build a complete **pH monitoring system** — the kind used in water treatment plants, aquariums, and chemical manufacturing.

The system needs to:
1. **Read** pH values over time (simulated sensor data)
2. **Detect** when pH drifts outside acceptable range
3. **Alert** when pH changes rapidly (potential contamination)
4. **Log** all events with timestamps
5. **Visualize** the pH history with alarm thresholds

We use a **moving average** to smooth noisy sensor data, and a **rate-of-change** detector to catch sudden spikes. The alarm logic uses hysteresis (different thresholds for triggering and clearing alarms) to prevent alarm flickering.

This is real industrial control engineering — the same algorithms run in water treatment plants monitoring drinking water safety.`,
      analogy: 'Think of a pH monitor like a smoke detector for chemistry. It constantly sniffs the air (reads pH), has a threshold for triggering an alarm (pH out of range), and uses sophisticated logic to avoid false alarms (a brief cooking smoke should not call the fire department, but sustained smoke should). The moving average is like counting to ten before pulling the alarm — making sure it is a real problem, not a momentary blip.',
      storyConnection: 'In the myth, the gods needed to monitor the churning carefully — too fast and Mount Mandara would fly off; too slow and nothing would separate. A pH monitoring system serves the same watchful purpose: constant vigilance over a chemical process, ready to alert when conditions deviate from the safe range.',
      checkQuestion: 'Why use a moving average instead of raw sensor readings? What trade-off does the window size control?',
      checkAnswer: 'Raw sensor readings are noisy — electronic interference, turbulence, and sensor drift create random fluctuations. A moving average smooths these out by averaging the last N readings. The trade-off: a larger window (more readings) gives smoother data but responds slower to real changes. A smaller window is more responsive but noisier. In safety-critical systems, this balance is crucial: you need to detect real contamination fast while ignoring sensor noise. Typical pH monitors use 10-30 second averaging windows.',
      codeIntro: 'Build a pH monitoring system with alarms, smoothing, and event logging.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 24 hours of pH data (readings every minute)
n_readings = 1440  # 24h * 60min
time_hours = np.linspace(0, 24, n_readings)

# Normal pH around 7.0 with noise
ph_base = 7.0 + 0.1 * np.sin(2 * np.pi * time_hours / 24)
noise = np.random.normal(0, 0.15, n_readings)

# Inject two events: acid spill at 8h, base leak at 18h
ph_data = ph_base + noise
ph_data[480:510] -= 2.0  # acid spill (pH drops to ~5)
ph_data[1080:1095] += 1.5  # base leak (pH rises to ~8.5)

# Moving average (window = 10 minutes)
window = 10
ph_smooth = np.convolve(ph_data, np.ones(window)/window, mode='same')

# Rate of change (pH units per minute)
rate = np.abs(np.diff(ph_smooth, prepend=ph_smooth[0]))

# Alarm thresholds
PH_LOW, PH_HIGH = 6.0, 8.0
RATE_ALARM = 0.1  # pH units/min

# Detect alarms
ph_alarm = (ph_smooth < PH_LOW) | (ph_smooth > PH_HIGH)
rate_alarm = rate > RATE_ALARM

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)

ax1.plot(time_hours, ph_data, color='gray', alpha=0.3, linewidth=0.5, label='Raw')
ax1.plot(time_hours, ph_smooth, color='#3b82f6', linewidth=1.5, label='Smoothed')
ax1.axhline(PH_LOW, color='red', linewidth=1, linestyle='--', alpha=0.6)
ax1.axhline(PH_HIGH, color='red', linewidth=1, linestyle='--', alpha=0.6)
ax1.fill_between(time_hours, PH_LOW, PH_HIGH, alpha=0.05, color='green')
alarm_times = time_hours[ph_alarm]
if len(alarm_times) > 0:
    ax1.scatter(alarm_times, ph_smooth[ph_alarm], c='red', s=5, zorder=5, label='ALARM')
ax1.set_ylabel('pH', fontsize=11, color='lightgray')
ax1.set_title('24-Hour pH Monitor', fontsize=14, color='white')
ax1.legend(fontsize=9, labelcolor='lightgray', loc='upper right')
ax1.tick_params(colors='lightgray')
ax1.grid(alpha=0.15)

ax2.plot(time_hours, rate, color='#f59e0b', linewidth=1)
ax2.axhline(RATE_ALARM, color='red', linewidth=1, linestyle='--', alpha=0.6)
ax2.set_xlabel('Time (hours)', fontsize=11, color='lightgray')
ax2.set_ylabel('Rate of change', fontsize=11, color='lightgray')
ax2.set_title('Rate-of-Change Detector', fontsize=13, color='white')
ax2.tick_params(colors='lightgray')
ax2.grid(alpha=0.15)

plt.tight_layout()
plt.show()

events = np.where(ph_alarm)[0]
print(f"pH alarms triggered: {len(events)} readings out of range")
print(f"First alarm at: {time_hours[events[0]]:.1f}h (acid spill detected)")`,
      challenge: 'Add a "dosing" response: when pH drops below 6.0, automatically add base (increment pH by 0.05/minute). When pH rises above 8.0, add acid. Plot the corrected pH alongside the uncorrected. This is closed-loop pH control.',
      successHint: 'You built a complete industrial monitoring system. Real water treatment plants use exactly this kind of logic: sensor reading, smoothing, threshold detection, rate-of-change analysis, and automated response. The same pattern applies to temperature, pressure, and flow monitoring.',
    },
    {
      title: 'Model emulsion stability over time',
      concept: `Emulsion stability is critical in food science (mayonnaise), pharmaceuticals (creams), and petroleum (crude oil). An emulsion breaks down through several mechanisms:

1. **Creaming**: Droplets rise (or sediment) under gravity — rate depends on droplet size and density difference (Stokes' law)
2. **Coalescence**: Droplets merge when they collide — rate increases with temperature and decreases with emulsifier
3. **Ostwald ripening**: Large droplets grow at the expense of small ones — driven by Laplace pressure differences
4. **Flocculation**: Droplets cluster without merging — reversible aggregation

**Stokes' law** for creaming rate: v = (2r² × delta_rho × g) / (9 × eta)

Where r is droplet radius, delta_rho is density difference, g is gravity, and eta is viscosity of the continuous phase.

Your code models all four destabilization mechanisms and predicts how long an emulsion remains stable under different conditions (temperature, droplet size, emulsifier concentration).`,
      analogy: 'Imagine a room full of soap bubbles floating in the air. Over time, several things happen simultaneously: (1) large bubbles float up faster than small ones (creaming), (2) when two bubbles touch they sometimes merge into one bigger bubble (coalescence), (3) air slowly diffuses from small bubbles to large ones, making the small ones shrink and disappear (Ostwald ripening), and (4) bubbles cluster together in clumps without popping (flocculation). An emulsion breaks down through these same four mechanisms.',
      storyConnection: 'The cosmic ocean was an emulsion that the gods and demons deliberately destabilized through churning. In your simulation, you model how emulsions naturally destabilize over time. The "treasures" that emerge are the separated phases — oil and water finding their own levels, just as the mythical treasures rose or sank to their natural positions.',
      checkQuestion: 'Homogenized milk stays mixed for weeks, while raw milk separates in hours. What does homogenization do to explain this?',
      checkAnswer: 'Homogenization forces milk through tiny nozzles at high pressure, breaking fat globules from ~4 um diameter down to <1 um. By Stokes\' law (v proportional to r²), reducing the radius by 4× reduces the creaming velocity by 16×. Additionally, the smaller droplets have more surface area coated by milk proteins (natural emulsifiers), making them more resistant to coalescence. The combination of smaller size and better emulsifier coverage extends shelf life from hours to weeks.',
      codeIntro: 'Simulate emulsion destabilization through creaming, coalescence, and ripening.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Emulsion parameters
r0 = 5e-6       # initial droplet radius (5 um)
rho_oil = 920    # oil density (kg/m3)
rho_water = 1000 # water density (kg/m3)
eta = 1e-3       # water viscosity (Pa.s)
g = 9.81
gamma = 0.03     # interfacial tension (N/m)

time_hours = np.linspace(0, 48, 200)
time_sec = time_hours * 3600

# 1. Creaming velocity (Stokes' law)
v_cream = 2 * r0**2 * (rho_water - rho_oil) * g / (9 * eta)
cream_dist = v_cream * time_sec * 100  # cm

# 2. Coalescence: droplet count decreases
n0 = 1e12  # initial droplet count per liter
k_coal = 1e-15  # coalescence rate constant
n_droplets = n0 / (1 + k_coal * n0 * time_sec)

# 3. Ostwald ripening: average radius grows
# r^3 = r0^3 + k_OR * t
k_OR = 1e-21  # ripening rate (m^3/s)
r_avg = (r0**3 + k_OR * time_sec)**(1/3) * 1e6  # um

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

axes[0].plot(time_hours, cream_dist, color='#60a5fa', linewidth=2)
axes[0].set_xlabel('Time (hours)', fontsize=10, color='lightgray')
axes[0].set_ylabel('Cream layer height (cm)', fontsize=10, color='lightgray')
axes[0].set_title('Creaming (Stokes)', fontsize=12, color='white')
axes[0].tick_params(colors='lightgray', labelsize=8)
axes[0].grid(alpha=0.2)

axes[1].plot(time_hours, n_droplets/1e12, color='#f59e0b', linewidth=2)
axes[1].set_xlabel('Time (hours)', fontsize=10, color='lightgray')
axes[1].set_ylabel('Droplets (×10¹²/L)', fontsize=10, color='lightgray')
axes[1].set_title('Coalescence', fontsize=12, color='white')
axes[1].tick_params(colors='lightgray', labelsize=8)
axes[1].grid(alpha=0.2)

axes[2].plot(time_hours, r_avg, color='#10b981', linewidth=2)
axes[2].set_xlabel('Time (hours)', fontsize=10, color='lightgray')
axes[2].set_ylabel('Avg radius (um)', fontsize=10, color='lightgray')
axes[2].set_title('Ostwald Ripening', fontsize=12, color='white')
axes[2].tick_params(colors='lightgray', labelsize=8)
axes[2].grid(alpha=0.2)

plt.suptitle('Emulsion Destabilization Mechanisms', fontsize=14, color='white', y=1.02)
plt.tight_layout()
plt.show()

print(f"Creaming velocity: {v_cream*1e6:.2f} um/s ({v_cream*3600*100:.2f} cm/hr)")
print(f"After 24h: cream layer ~{cream_dist[100]:.1f} cm")
print(f"After 48h: droplets reduced to {n_droplets[-1]/n0*100:.1f}% of original")
print(f"After 48h: avg radius grew from {r0*1e6:.1f} to {r_avg[-1]:.1f} um")`,
      challenge: 'Add an emulsifier effect: multiply the coalescence rate constant by 0.01 (emulsifier reduces coalescence 100×) and reduce Ostwald ripening by 10×. How much longer does the emulsion last? Plot both stabilized and unstabilized curves together.',
      successHint: 'You have modeled the physics of emulsion stability — the science behind food shelf life, cosmetic formulation, and petroleum processing. The same Stokes\' law that governs cream rising in a glass of milk governs oil droplet separation in billion-dollar refineries.',
    },
    {
      title: 'Create a density prediction algorithm',
      concept: `Can you predict the density of a substance from its molecular properties? This is a real problem in chemical engineering — measuring density requires a physical sample, but prediction from structure would let you screen thousands of candidates computationally.

We will build a simple **machine learning model** that predicts density from molecular features:
- **Molecular weight** (heavier molecules tend to be denser)
- **Number of OH groups** (hydrogen bonding packs molecules tighter)
- **Carbon chain length** (longer chains = lower density, like oils)
- **Presence of heavy atoms** (Cl, Br, metals increase density)

The approach: linear regression with these features, trained on known data, then predicting unknown compounds.

**density = w1 × MW + w2 × n_OH + w3 × chain_length + w4 × heavy_atoms + bias**

We train the model by finding weights (w1-w4) that minimize the prediction error on known compounds, then test it on compounds the model has not seen.`,
      analogy: 'Imagine you are a chef predicting how filling a meal will be. You learn from experience: more protein = more filling, more fiber = more filling, more water = less filling. After eating many meals, you develop an intuition (model) that predicts satiety from ingredients. Our density model works the same way: it learns from known compounds which molecular features predict higher or lower density.',
      storyConnection: 'The mythical churning revealed treasures in order of density — heaviest sinking, lightest floating. Your prediction algorithm formalizes this: given a compound\'s molecular "recipe," can you predict where it will sit in the density column without ever measuring it? This is computational chemistry — predicting physical properties from molecular structure.',
      checkQuestion: 'Why might a linear model fail to predict density accurately for ALL types of compounds?',
      checkAnswer: 'Density depends on molecular PACKING, which is nonlinear. Crystal structure, molecular shape (spheres pack differently than rods), hydrogen bonding networks, and pi-stacking in aromatic compounds all create complex, nonlinear relationships. A linear model captures the main trends (heavier = denser, more H-bonds = denser) but misses subtle effects. For example, water (MW=18) is denser than ethanol (MW=46) because of its extraordinary hydrogen bonding network. A linear model would predict the opposite based on molecular weight alone.',
      codeIntro: 'Build a linear regression model to predict density from molecular features.',
      code: `import numpy as np

# Training data: MW, n_OH, chain_length, heavy_atoms, density
data = np.array([
    [18,  1, 0, 0, 1.00],   # Water
    [32,  1, 1, 0, 0.79],   # Methanol
    [46,  1, 2, 0, 0.79],   # Ethanol
    [60,  0, 3, 0, 0.79],   # Propanone
    [78,  0, 6, 0, 0.88],   # Benzene
    [92,  0, 7, 0, 0.87],   # Toluene
    [58,  0, 4, 0, 0.71],   # Butane (liquid)
    [86,  0, 6, 0, 0.66],   # Hexane
    [119, 0, 2, 1, 1.49],   # Chloroform
    [154, 0, 1, 2, 2.89],   # CCl4-like
    [180, 2, 6, 0, 1.22],   # Glucose
    [92,  0, 0, 0, 1.10],   # Glycerol backbone
])

X = data[:, :4]  # features
y = data[:, 4]   # density

# Simple linear regression: y = X @ w + b
# Add bias column
X_bias = np.column_stack([X, np.ones(len(X))])
# Solve normal equation: w = (X^T X)^-1 X^T y
w = np.linalg.lstsq(X_bias, y, rcond=None)[0]

# Predictions
y_pred = X_bias @ w
errors = np.abs(y - y_pred)

print("=== Density Prediction Model ===")
print(f"Weights: MW={w[0]:.4f}, OH={w[1]:.4f}, chain={w[2]:.4f}, heavy={w[3]:.4f}")
print(f"Bias: {w[4]:.4f}")
print()
print(f"{'Compound':<14} {'Actual':>8} {'Predicted':>10} {'Error':>8}")
print("-" * 42)
names = ["Water","Methanol","Ethanol","Propanone","Benzene",
         "Toluene","Butane","Hexane","Chloroform","CCl4-like",
         "Glucose","Glycerol"]
for name, actual, pred, err in zip(names, y, y_pred, errors):
    print(f"{name:<14} {actual:>8.2f} {pred:>10.2f} {err:>8.3f}")

rmse = np.sqrt(np.mean(errors**2))
print(f"\
RMSE: {rmse:.3f} g/cm³")

# Predict unknown
unknown = np.array([74, 1, 4, 0, 1])  # Butanol
pred_unknown = unknown @ w
print(f"\
Prediction for butanol (MW=74, 1 OH, chain=4): {pred_unknown:.2f} g/cm³")
print(f"Actual butanol density: 0.81 g/cm³")`,
      challenge: 'Add more training data (look up densities for acetic acid, diethyl ether, dichloromethane). Does the model improve with more data? Try using X**2 features (polynomial regression) to capture nonlinear relationships.',
      successHint: 'You have built a quantitative structure-property relationship (QSPR) model — a fundamental tool in computational chemistry and drug discovery. Pharmaceutical companies use similar models (with thousands of features and millions of compounds) to predict drug properties before synthesizing them.',
    },
    {
      title: 'Capstone: Complete separation laboratory simulator',
      concept: `This is the capstone project. You will build a **complete separation laboratory simulator** that combines every technique from all four levels into one interactive system.

The simulator takes a mystery mixture and provides tools to identify and separate its components:
1. **Density measurement** — measure each component's density
2. **pH testing** — determine acidity/basicity
3. **Boiling point test** — heat the mixture and record what boils at each temperature
4. **Filtration** — remove solids
5. **Centrifugation** — separate by density
6. **Distillation** — separate by boiling point
7. **Chromatography** — separate by affinity
8. **Mass spectrometry** — identify unknowns by molecular weight

The code generates a random mystery mixture and provides analysis functions. Your job: use the tools to identify every component and achieve 95%+ purity for each separated fraction.

This mirrors what a real analytical chemist does: receive an unknown sample, run a series of tests, identify the components, then design and execute a separation strategy.`,
      analogy: 'You are a detective in a chemistry lab. The mystery mixture is your crime scene. Density is like checking fingerprints. pH is like checking blood type. Boiling point is like checking DNA. Chromatography is like reviewing security footage — it separates everything and shows you who was present. Mass spectrometry is the definitive ID — like matching a face to a photo. Your capstone brings all these detective tools together.',
      storyConnection: 'The churning of the ocean was humanity\'s first separation myth — a cosmic laboratory where a complex mixture yielded individual treasures through systematic effort. In this capstone, you recreate that myth in code: starting with a chaotic mixture and systematically extracting every pure component. The gods had divine tools; you have Python, NumPy, and the laws of chemistry.',
      checkQuestion: 'In what order would you analyze a completely unknown liquid mixture? Why does order matter?',
      checkAnswer: 'Best order: (1) Visual inspection (color, clarity, phases), (2) pH test (non-destructive, instant), (3) Density measurement (non-destructive), (4) Filtration (removes solids before other tests), (5) Boiling point test (small sample, identifies volatile components), (6) Chromatography (separates all components), (7) Mass spectrometry (identifies each separated component). Order matters because destructive tests (heating, chemical reactions) should come AFTER non-destructive ones, and separation should come before identification so you can identify pure components rather than mixtures.',
      codeIntro: 'Build a complete separation lab: analyze, identify, and separate a mystery mixture.',
      code: `import numpy as np

np.random.seed(42)

# Chemical database
CHEMICALS = {
    "water":     {"mw": 18,  "density": 1.00, "bp": 100, "ph": 7.0,  "polar": True,  "size": 0.001},
    "ethanol":   {"mw": 46,  "density": 0.79, "bp": 78,  "ph": 7.0,  "polar": True,  "size": 0.001},
    "acetic_acid":{"mw": 60, "density": 1.05, "bp": 118, "ph": 2.4,  "polar": True,  "size": 0.001},
    "hexane":    {"mw": 86,  "density": 0.66, "bp": 69,  "ph": 7.0,  "polar": False, "size": 0.001},
    "salt":      {"mw": 58,  "density": 2.16, "bp": 1465,"ph": 7.0,  "polar": True,  "size": 0.0003},
    "sand":      {"mw": 60,  "density": 2.65, "bp": 2230,"ph": 7.0,  "polar": False, "size": 500},
    "clay":      {"mw": 258, "density": 2.20, "bp": 1700,"ph": 7.0,  "polar": False, "size": 5.0},
}

# Generate mystery mixture (3-5 random chemicals)
n_components = np.random.randint(3, 6)
mystery = np.random.choice(list(CHEMICALS.keys()), n_components, replace=False)
amounts = np.random.uniform(10, 50, n_components)  # grams

print("=== SEPARATION LAB SIMULATOR ===")
print(f"Mystery mixture received: {n_components} unknown components")
print(f"Total mass: {amounts.sum():.1f} g")
print()

# Analysis tools
def measure_density(mix, amts):
    avg = sum(CHEMICALS[c]["density"] * a for c, a in zip(mix, amts)) / sum(amts)
    print(f"  Avg density: {avg:.2f} g/cm³")
    return avg

def test_ph(mix, amts):
    # pH dominated by strongest acid/base
    phs = [CHEMICALS[c]["ph"] for c in mix]
    avg_ph = np.mean(phs)
    print(f"  pH reading: {avg_ph:.1f}")
    return avg_ph

def filter_mix(mix, amts, pore_um):
    residue = [(c, a) for c, a in zip(mix, amts) if CHEMICALS[c]["size"] > pore_um]
    filtrate = [(c, a) for c, a in zip(mix, amts) if CHEMICALS[c]["size"] <= pore_um]
    return residue, filtrate

def distill_fraction(mix, amts, t_low, t_high):
    frac = [(c, a) for c, a in zip(mix, amts) if t_low <= CHEMICALS[c]["bp"] <= t_high]
    rest = [(c, a) for c, a in zip(mix, amts) if not (t_low <= CHEMICALS[c]["bp"] <= t_high)]
    return frac, rest

# Run analysis
print("Step 1: Measure density")
measure_density(mystery, amounts)

print("\
Step 2: Test pH")
test_ph(mystery, amounts)

print("\
Step 3: Filter (10 um pore)")
residue, filtrate = filter_mix(mystery, amounts, 10.0)
print(f"  Residue (solids): {[r[0] for r in residue]}")
print(f"  Filtrate (liquids): {[f[0] for f in filtrate]}")

print("\
Step 4: Distill filtrate")
if filtrate:
    f_names = [f[0] for f in filtrate]
    f_amts = [f[1] for f in filtrate]
    low_bp, rest = distill_fraction(f_names, f_amts, 60, 80)
    mid_bp, high_bp = distill_fraction(
        [r[0] for r in rest], [r[1] for r in rest], 90, 120)
    print(f"  60-80°C fraction: {[x[0] for x in low_bp]}")
    print(f"  90-120°C fraction: {[x[0] for x in mid_bp]}")
    print(f"  Remaining: {[x[0] for x in high_bp]}")

print("\
=== MYSTERY REVEALED ===")
for comp, amt in zip(mystery, amounts):
    props = CHEMICALS[comp]
    print(f"  {comp}: {amt:.1f}g (d={props['density']}, bp={props['bp']}°C, pH={props['ph']})") `,
      challenge: 'Extend the simulator with a `chromatograph()` function that separates by polarity, and a `mass_spec()` function that identifies by molecular weight. Then write a `full_analysis()` function that runs ALL steps automatically and reports the identity and purity of each separated fraction.',
      successHint: 'You have built a complete analytical chemistry laboratory in code. This capstone integrates every concept from all four levels: density, pH, boiling points, filtration, centrifugation, distillation, chromatography, and mass spectrometry. You now understand the full toolkit that chemists use to analyze and separate any mixture — the same toolkit that makes modern medicine, materials science, and environmental chemistry possible.',
    },
  ];

  const diagrams = [ChurningSeparationPipelineDiagram, ChurningDistillationDiagram, ChurningTitrationDiagram, ChurningEmulsionDiagram, ChurningDensityColumnDiagram, ChurningMassSpecDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone projects: build complete systems</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These capstone projects use Python for complete chemistry systems. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
