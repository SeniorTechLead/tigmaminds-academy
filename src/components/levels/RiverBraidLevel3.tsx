import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RiverBraidLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Sediment transport equations — modeling particle movement in flowing water",
      concept: "modeling particle movement in flowing water. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Sediment transport equations --- modeling particle movement in flowing water ---

# Shields parameter: dimensionless shear stress that determines
# whether sediment particles will move or stay put.
# tau* = tau_b / ((rho_s - rho_w) * g * D)

g = 9.81         # gravity (m/s^2)
rho_w = 1000     # water density (kg/m^3)
rho_s = 2650     # sediment density (kg/m^3, quartz sand)

def shields_parameter(velocity, depth, grain_size_mm, manning_n=0.03):
    """
    Compute Shields parameter from flow conditions.
    velocity: flow velocity (m/s)
    depth: water depth (m)
    grain_size_mm: sediment grain diameter (mm)
    """
    D = grain_size_mm / 1000.0  # convert to meters
    # Bed shear stress using Manning's equation: tau = rho * g * n^2 * V^2 / R^(1/3)
    # Simplified: tau_b = rho_w * g * depth * slope
    # Using Manning: slope = (V * n / R^(2/3))^2 where R ~ depth
    slope = (velocity * manning_n / depth**(2.0/3.0))**2
    tau_b = rho_w * g * depth * slope
    tau_star = tau_b / ((rho_s - rho_w) * g * D)
    return tau_star, tau_b

# Critical Shields parameter (approximate)
tau_star_critical = 0.047  # typical for sand

# Meyer-Peter Mueller bedload transport formula
def bedload_transport(tau_star, D_mm):
    """Dimensionless bedload transport rate (Meyer-Peter Mueller)."""
    D = D_mm / 1000.0
    if tau_star <= tau_star_critical:
        return 0.0
    q_star = 8 * (tau_star - tau_star_critical)**1.5
    # Dimensional transport rate (m^2/s)
    q_b = q_star * np.sqrt((rho_s/rho_w - 1) * g * D**3)
    return q_b

print("=== Sediment Transport: Shields Parameter Analysis ===")
print("\\nShields parameter tells us if the river can move sediment.")
print(f"Critical value (tau*_c) = {tau_star_critical} -- below this, particles stay put.\\n")

# Test different flow conditions
print("--- Flow Conditions vs Sediment Motion ---\\n")
print(f"{'Velocity':<12} {'Depth':<10} {'Grain Size':<12} {'Shields tau*':<14} {'Motion?':<12} {'Transport Rate'}")
print("-" * 76)

test_cases = [
    (0.3, 0.5, 1.0),   # slow, shallow, sand
    (0.8, 1.0, 1.0),   # moderate flow
    (1.5, 1.5, 1.0),   # fast flow
    (1.5, 1.5, 10.0),  # fast flow, gravel
    (2.5, 2.0, 1.0),   # flood conditions
    (2.5, 2.0, 50.0),  # flood, cobbles
]

for vel, depth, grain in test_cases:
    tau_star, tau_b = shields_parameter(vel, depth, grain)
    moves = "YES" if tau_star > tau_star_critical else "no"
    q_b = bedload_transport(tau_star, grain)
    q_str = f"{q_b:.6f} m2/s" if q_b > 0 else "0 (stable)"
    bar = "#" * min(int(tau_star * 20), 30)
    print(f"{vel:<12.1f} {depth:<10.1f} {grain:<12.1f} {tau_star:<14.4f} {moves:<12} {q_str}  {bar}")

# Grain size classes
print("\\n\\n--- Sediment Size Classification ---\\n")
sizes = [
    ("Clay", 0.002, "< 0.004 mm"),
    ("Silt", 0.03, "0.004 - 0.063 mm"),
    ("Fine sand", 0.15, "0.063 - 0.25 mm"),
    ("Medium sand", 0.5, "0.25 - 1 mm"),
    ("Coarse sand", 1.5, "1 - 2 mm"),
    ("Gravel", 10.0, "2 - 64 mm"),
    ("Cobble", 100.0, "64 - 256 mm"),
    ("Boulder", 500.0, "> 256 mm"),
]
print(f"{'Class':<14} {'Example D (mm)':<16} {'Range':<20} {'V to move (m/s)'}")
print("-" * 62)
for name, d, rng in sizes:
    # Estimate velocity needed to move at 1m depth
    # Working backwards from Shields: tau* = 0.047
    tau_b_needed = tau_star_critical * (rho_s - rho_w) * g * (d / 1000.0)
    slope_needed = tau_b_needed / (rho_w * g * 1.0)
    v_needed = np.sqrt(slope_needed) * 1.0**(2.0/3.0) / 0.03
    print(f"{name:<14} {d:<16.3f} {rng:<20} {v_needed:>.2f}")

print("\\n--- Key Insight ---")
print("Braided rivers form when there is abundant sediment and enough power to")
print("move it. The Shields parameter determines the threshold -- a small increase")
print("in flow velocity can suddenly mobilize material that was previously stable.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Channel morphology — quantifying braided river geometry from satellite data",
      concept: "quantifying braided river geometry from satellite data. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Channel morphology --- quantifying braided river geometry ---

# Key metrics for braided rivers:
# 1. Braiding Index (BI): number of channels at a cross-section
# 2. Sinuosity: channel length / straight-line distance
# 3. Channel width-to-depth ratio
# 4. Bar density: number of mid-channel bars per km

def sinuosity(channel_length, straight_distance):
    """Sinuosity = actual path / straight line. 1.0 = straight, >1.5 = meandering."""
    return channel_length / straight_distance

def braiding_index(cross_section_channels):
    """Average number of active channels across multiple cross-sections."""
    return np.mean(cross_section_channels)

def width_depth_ratio(width_m, depth_m):
    return width_m / depth_m

# Simulate satellite measurements of a braided river reach (e.g., Brahmaputra)
print("=== Channel Morphology: Braided River Geometry ===")
print("\\nSimulated satellite data for a 50 km braided river reach\\n")

# Generate realistic cross-section data
num_sections = 20
spacing_km = 2.5  # cross-sections every 2.5 km

channels_per_section = np.random.poisson(lam=4.5, size=num_sections) + 1
total_widths = np.random.normal(4000, 800, num_sections)  # meters
avg_depths = np.random.normal(3.5, 0.8, num_sections)
total_widths = np.clip(total_widths, 1500, 6000)
avg_depths = np.clip(avg_depths, 1.0, 7.0)

print(f"{'Section':<10} {'Distance (km)':<16} {'Channels':<12} {'Total Width (m)':<18} {'Avg Depth (m)':<16} {'W/D Ratio'}")
print("-" * 80)
for i in range(num_sections):
    dist = i * spacing_km
    wd = width_depth_ratio(total_widths[i], avg_depths[i])
    print(f"{i+1:<10} {dist:<16.1f} {channels_per_section[i]:<12} {total_widths[i]:<18.0f} {avg_depths[i]:<16.1f} {wd:<.0f}")

# Compute summary metrics
bi = braiding_index(channels_per_section)
print(f"\\n--- Summary Metrics ---")
print(f"\\n  Braiding Index (avg channels): {bi:.1f}")
print(f"  Min channels: {channels_per_section.min()}, Max: {channels_per_section.max()}")

# Sinuosity of the main channel
main_channel_length = 50 * 1.15 + np.random.normal(0, 1)  # slightly longer than straight
sin_val = sinuosity(main_channel_length, 50.0)
print(f"  Main channel sinuosity: {sin_val:.2f}")
if sin_val < 1.1:
    print(f"    -> Nearly straight (typical of high-energy braided rivers)")
elif sin_val < 1.5:
    print(f"    -> Low sinuosity (characteristic of braided pattern)")
else:
    print(f"    -> Meandering (unusual for braided rivers)")

avg_wd = np.mean(total_widths / avg_depths)
print(f"  Average width-to-depth ratio: {avg_wd:.0f}")
print(f"    -> {'Braided' if avg_wd > 40 else 'Single-thread'} pattern (threshold ~40)")

# River type classification
print("\\n--- River Pattern Classification ---\\n")
print(f"{'Metric':<30} {'Value':<15} {'Braided?'}")
print("-" * 55)
checks = [
    ("Braiding Index > 2", f"{bi:.1f}", bi > 2),
    ("Sinuosity < 1.3", f"{sin_val:.2f}", sin_val < 1.3),
    ("Width/Depth > 40", f"{avg_wd:.0f}", avg_wd > 40),
    ("Sediment supply high", "Yes (simulated)", True),
]
for label, val, passes in checks:
    status = "YES" if passes else "NO"
    print(f"  {label:<30} {val:<15} {status}")

all_pass = all(c[2] for c in checks)
print(f"\\n  Classification: {'BRAIDED RIVER' if all_pass else 'NOT CLEARLY BRAIDED'}")

print("\\n--- Key Insight ---")
print("Braided rivers have high width-to-depth ratios and low sinuosity.")
print("The Brahmaputra in Assam is one of the world's largest braided rivers,")
print("with a braiding index of 3-8 and total width up to 10 km during floods.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Erosion and deposition — simulating bank migration over decades",
      concept: "simulating bank migration over decades. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Erosion and deposition --- simulating bank migration over decades ---

# Bank erosion rate model: E = k * (tau - tau_c)^a
# where tau is shear stress, tau_c is critical stress, k and a are material constants

def bank_erosion_rate(velocity, bank_material="sand"):
    """
    Estimate lateral bank erosion rate in meters/year.
    Based on empirical relationships from river studies.
    """
    materials = {
        "clay":      {"k": 0.001, "tau_c": 5.0, "a": 1.0},
        "silt":      {"k": 0.005, "tau_c": 2.0, "a": 1.2},
        "sand":      {"k": 0.02,  "tau_c": 0.5, "a": 1.5},
        "gravel":    {"k": 0.005, "tau_c": 10.0, "a": 1.0},
    }
    props = materials[bank_material]
    # Approximate shear stress from velocity (simplified)
    tau = 1000 * 0.003 * velocity**2  # rho * Cf * V^2
    excess = max(0, tau - props["tau_c"])
    rate = props["k"] * excess**props["a"]
    return rate, tau

# Simulate 50 years of bank position for a braided river channel
print("=== Erosion and Deposition: Bank Migration Simulation ===")
print("\\nSimulating 50 years of bank movement for a braided river channel.\\n")

years = 50
bank_position = np.zeros(years + 1)  # meters from starting point
bank_position[0] = 0

# Annual flow varies: monsoon brings high flow, dry season is calm
annual_peak_velocities = np.random.normal(2.5, 0.6, years)
annual_peak_velocities = np.clip(annual_peak_velocities, 0.5, 4.5)

# Some years have exceptional floods
flood_years = np.random.choice(years, size=5, replace=False)
annual_peak_velocities[flood_years] *= 1.8

total_eroded = 0
total_deposited = 0

print(f"{'Year':<8} {'Peak V (m/s)':<14} {'Erosion (m)':<14} {'Deposition (m)':<16} {'Bank Pos (m)':<14} {'Event'}")
print("-" * 78)

for yr in range(years):
    v = annual_peak_velocities[yr]
    erosion, tau = bank_erosion_rate(v, "sand")

    # Deposition happens during low-flow periods (partial recovery)
    deposition = np.random.exponential(erosion * 0.3)

    net = erosion - deposition
    bank_position[yr + 1] = bank_position[yr] + net
    total_eroded += erosion
    total_deposited += deposition

    event = ""
    if yr in flood_years:
        event = "FLOOD"
    elif erosion > 5:
        event = "major erosion"

    if yr % 5 == 0 or yr in flood_years:
        print(f"{yr+1:<8} {v:<14.2f} {erosion:<14.2f} {deposition:<16.2f} {bank_position[yr+1]:<14.1f} {event}")

print(f"{'...'}")
print(f"{years:<8} {annual_peak_velocities[-1]:<14.2f} {'---':<14} {'---':<16} {bank_position[-1]:<14.1f}")

print(f"\\n--- 50-Year Summary ---")
print(f"\\n  Total erosion:    {total_eroded:>8.1f} m")
print(f"  Total deposition: {total_deposited:>8.1f} m")
print(f"  Net bank retreat: {bank_position[-1]:>8.1f} m")
print(f"  Average rate:     {bank_position[-1]/years:>8.1f} m/year")
print(f"  Max retreat in a year: {np.max(np.diff(bank_position)):>6.1f} m")

# Compare bank materials
print("\\n\\n--- Bank Material Comparison (at V = 2.5 m/s) ---\\n")
print(f"{'Material':<12} {'Erosion Rate':<16} {'Years to Lose 100m'}")
print("-" * 48)
for mat in ["clay", "silt", "sand", "gravel"]:
    rate, _ = bank_erosion_rate(2.5, mat)
    yrs_100m = 100 / rate if rate > 0 else float('inf')
    yrs_str = f"{yrs_100m:.0f}" if yrs_100m < 10000 else "10000+"
    print(f"{mat:<12} {rate:<16.3f} {yrs_str}")

print("\\n--- Key Insight ---")
print("Sandy banks erode fastest -- this is why braided rivers in Assam's")
print("alluvial plains shift so dramatically. A single flood can move a")
print("bank by tens of meters, destroying farmland in hours.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Flow routing — computing water velocity through braided channels",
      concept: "computing water velocity through braided channels. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Flow routing --- computing water velocity through braided channels ---

# Manning's equation: V = (1/n) * R^(2/3) * S^(1/2)
# V = velocity (m/s), n = Manning's roughness, R = hydraulic radius (m), S = slope

def manning_velocity(depth, width, slope, manning_n=0.03):
    """Compute flow velocity using Manning's equation."""
    area = width * depth
    wetted_perimeter = width + 2 * depth
    R = area / wetted_perimeter  # hydraulic radius
    V = (1.0 / manning_n) * R**(2.0/3.0) * slope**0.5
    Q = V * area  # discharge (m^3/s)
    return V, Q, R

# Simulate a braided river cross-section with multiple channels
print("=== Flow Routing Through Braided Channels ===")
print("\\nManning's equation: V = (1/n) * R^(2/3) * S^(1/2)\\n")

# Define channels at a single cross-section
slope = 0.0004  # typical for large alluvial rivers

channels = [
    {"name": "Main channel",    "width": 400, "depth": 5.0, "n": 0.025},
    {"name": "Secondary ch 1",  "width": 200, "depth": 3.0, "n": 0.030},
    {"name": "Secondary ch 2",  "width": 150, "depth": 2.5, "n": 0.030},
    {"name": "Overflow ch",     "width": 100, "depth": 1.5, "n": 0.040},
    {"name": "Floodplain left", "width": 800, "depth": 0.5, "n": 0.060},
    {"name": "Floodplain right","width": 600, "depth": 0.3, "n": 0.060},
]

print(f"River slope: {slope}")
print(f"\\n{'Channel':<20} {'Width (m)':<12} {'Depth (m)':<12} {'n':<8} {'V (m/s)':<10} {'Q (m3/s)':<12} {'% of Total'}")
print("-" * 86)

total_Q = 0
results = []
for ch in channels:
    V, Q, R = manning_velocity(ch["depth"], ch["width"], slope, ch["n"])
    results.append((ch["name"], ch["width"], ch["depth"], ch["n"], V, Q))
    total_Q += Q

for name, w, d, n, V, Q in results:
    pct = Q / total_Q * 100
    bar = "#" * int(pct / 2)
    print(f"{name:<20} {w:<12} {d:<12.1f} {n:<8.3f} {V:<10.2f} {Q:<12.0f} {pct:>5.1f}%  {bar}")

print(f"\\n  Total discharge: {total_Q:.0f} m3/s")
main_pct = results[0][5] / total_Q * 100
print(f"  Main channel carries: {main_pct:.1f}% of total flow")
print(f"  Floodplains carry: {(results[4][5] + results[5][5])/total_Q*100:.1f}%")

# How flow redistributes at different water levels
print("\\n\\n--- Flow Distribution at Different Flood Stages ---\\n")
print("As water rises, flow shifts from channels to floodplains.\\n")
print(f"{'Stage':<16} {'Depth Factor':<14} {'Total Q (m3/s)':<16} {'Main Ch %':<12} {'Floodplain %'}")
print("-" * 62)

for stage_name, depth_factor in [("Low flow", 0.3), ("Normal", 1.0), ("High flow", 1.5), ("Flood", 2.5), ("Major flood", 4.0)]:
    stage_total = 0
    main_q = 0
    flood_q = 0
    for i, ch in enumerate(channels):
        d = ch["depth"] * depth_factor
        if d < 0.05:
            continue
        V, Q, R = manning_velocity(d, ch["width"], slope, ch["n"])
        stage_total += Q
        if i == 0:
            main_q = Q
        if i >= 4:
            flood_q += Q
    main_pct = main_q / stage_total * 100 if stage_total > 0 else 0
    flood_pct = flood_q / stage_total * 100 if stage_total > 0 else 0
    print(f"{stage_name:<16} {depth_factor:<14.1f} {stage_total:<16.0f} {main_pct:<12.1f} {flood_pct:.1f}%")

print("\\n--- Key Insight ---")
print("During floods, floodplains can carry 30-50% of total discharge.")
print("This is why braided rivers are so wide -- the active channel belt")
print("expands dramatically during monsoon, then contracts to a few threads")
print("in the dry season. Flow velocity in the main channel barely changes;")
print("instead, the river gets WIDER.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Riparian ecology — modeling vegetation response to flood disturbance",
      concept: "modeling vegetation response to flood disturbance. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Riparian ecology --- modeling vegetation response to flood disturbance ---

# Vegetation succession model on a braided river floodplain
# After a flood clears vegetation, succession proceeds:
# bare sand -> grass -> shrub -> young forest -> mature forest
# But floods can reset the clock at any stage

class VegetationPatch:
    stages = ["Bare sand", "Grass", "Shrub", "Young forest", "Mature forest"]
    growth_years = [0, 1, 3, 8, 25]  # years to reach each stage

    def __init__(self):
        self.age = 0  # years since last disturbance
        self.biomass = 0  # kg/m^2

    def get_stage(self):
        for i in range(len(self.stages) - 1, -1, -1):
            if self.age >= self.growth_years[i]:
                return i, self.stages[i]
        return 0, self.stages[0]

    def grow(self):
        self.age += 1
        stage_idx, _ = self.get_stage()
        # Biomass accumulates following a logistic curve
        max_biomass = [0.1, 2.0, 8.0, 25.0, 50.0][stage_idx]
        growth_rate = [0, 1.5, 1.0, 0.5, 0.2][stage_idx]
        self.biomass += growth_rate * (1 - self.biomass / max(max_biomass, 0.1))
        self.biomass = min(self.biomass, max_biomass)

    def disturb(self, flood_intensity):
        """flood_intensity: 0-1, where 1 = catastrophic."""
        if flood_intensity > 0.8:
            self.age = 0
            self.biomass = 0
        elif flood_intensity > 0.5:
            self.age = max(0, self.age - 5)
            self.biomass *= 0.3
        elif flood_intensity > 0.2:
            self.biomass *= 0.7

# Simulate 50 patches across a floodplain cross-section
num_patches = 10
years = 40

print("=== Riparian Ecology: Vegetation vs Flood Disturbance ===")
print(f"\\nSimulating {num_patches} patches across a floodplain for {years} years.\\n")

# Distance from main channel determines flood exposure
patches = [VegetationPatch() for _ in range(num_patches)]
distances = np.linspace(50, 500, num_patches)  # meters from main channel

print(f"{'Year':<6}", end="")
for d in distances:
    print(f"{d:>5.0f}m ", end="")
print("  Flood?")
print("-" * (6 + 7 * num_patches + 10))

for yr in range(years):
    # Generate flood: probability and intensity
    flood_prob = 0.3  # 30% chance of significant flood each year
    is_flood = np.random.random() < flood_prob
    flood_strength = np.random.beta(2, 5) if is_flood else 0  # usually moderate

    for i, patch in enumerate(patches):
        if is_flood:
            # Closer to channel = more intense disturbance
            local_intensity = flood_strength * np.exp(-distances[i] / 200)
            patch.disturb(local_intensity)
        patch.grow()

    if yr % 5 == 0 or (is_flood and flood_strength > 0.6):
        print(f"{yr+1:<6}", end="")
        for patch in patches:
            stage_idx, stage_name = patch.get_stage()
            symbols = [".", "g", "S", "T", "F"]
            print(f"  {symbols[stage_idx]}({patch.biomass:>3.0f})", end="")
        flood_label = f"  FLOOD ({flood_strength:.1f})" if is_flood else ""
        print(flood_label)

print(f"\\nLegend: . = bare, g = grass, S = shrub, T = young tree, F = mature forest")
print(f"Numbers in parentheses = biomass (kg/m2)")

# Final state analysis
print(f"\\n--- Final State After {years} Years ---\\n")
print(f"{'Patch':<8} {'Distance':<12} {'Stage':<16} {'Age':<8} {'Biomass (kg/m2)'}")
print("-" * 52)
for i, patch in enumerate(patches):
    _, stage = patch.get_stage()
    print(f"{i+1:<8} {distances[i]:<12.0f} {stage:<16} {patch.age:<8} {patch.biomass:.1f}")

# Summary
near = [p for i, p in enumerate(patches) if distances[i] < 200]
far = [p for i, p in enumerate(patches) if distances[i] >= 200]
print(f"\\n  Near channel (<200m): avg biomass = {np.mean([p.biomass for p in near]):.1f} kg/m2")
print(f"  Far from channel (>200m): avg biomass = {np.mean([p.biomass for p in far]):.1f} kg/m2")

print("\\n--- Key Insight ---")
print("Braided rivers maintain high biodiversity through disturbance.")
print("Near the channel: constant resetting creates habitat for pioneer species.")
print("Far from channel: mature forest develops. This gradient of disturbance")
print("creates a mosaic of habitats -- the ecological richness of river islands")
print("like Majuli depends on this dynamic balance between floods and growth.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Predictive modeling — forecasting channel evolution from flow and sediment data",
      concept: "forecasting channel evolution from flow and sediment data. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Predictive modeling --- forecasting channel evolution ---

# Simple 1D channel evolution model
# The river has width W, depth D, slope S, and discharge Q
# It adjusts these over time to reach equilibrium (Lane's Balance)
# Q * S ~ Qs * D50  (discharge * slope balances sediment load * grain size)

class ChannelModel:
    def __init__(self, width, depth, slope, discharge, sediment_load):
        self.W = width           # meters
        self.D = depth           # meters
        self.S = slope           # dimensionless
        self.Q = discharge       # m^3/s
        self.Qs = sediment_load  # kg/s
        self.history = []

    def transport_capacity(self):
        """Simplified sediment transport capacity."""
        # Proportional to velocity^3 * width (stream power concept)
        V = self.Q / (self.W * self.D)
        return 0.001 * V**3 * self.W

    def step(self, dt_years=1):
        """Evolve channel for one time step."""
        capacity = self.transport_capacity()
        imbalance = self.Qs - capacity  # positive = excess sediment

        # Channel adjusts: excess sediment -> aggradation (wider, shallower)
        # Deficit sediment -> degradation (narrower, deeper)
        if imbalance > 0:
            # Depositing: channel widens and shallows
            self.W += imbalance * 0.5 * dt_years
            self.D -= imbalance * 0.01 * dt_years
            self.S += imbalance * 0.000001 * dt_years
        else:
            # Eroding: channel narrows and deepens
            self.W += imbalance * 0.3 * dt_years
            self.D -= imbalance * 0.008 * dt_years
            self.S += imbalance * 0.000001 * dt_years

        # Physical constraints
        self.W = max(self.W, 50)
        self.D = max(self.D, 0.5)
        self.S = max(self.S, 0.00001)

        self.history.append({
            "W": self.W, "D": self.D, "S": self.S,
            "capacity": capacity, "imbalance": imbalance
        })

# Scenario: river after a dam reduces sediment supply
print("=== Predictive Modeling: Channel Evolution After Dam Construction ===")
print("\\nA dam traps sediment upstream. The river downstream now has excess")
print("transport capacity and will erode its bed and banks.\\n")

# Initial conditions (pre-dam equilibrium)
model = ChannelModel(width=500, depth=3.5, slope=0.0004, discharge=5000, sediment_load=200)

# Pre-dam: verify near-equilibrium
cap0 = model.transport_capacity()
print(f"Pre-dam conditions:")
print(f"  Width: {model.W:.0f} m, Depth: {model.D:.1f} m, Slope: {model.S:.6f}")
print(f"  Discharge: {model.Q:.0f} m3/s")
print(f"  Sediment supply: {model.Qs:.0f} kg/s")
print(f"  Transport capacity: {cap0:.0f} kg/s")
print(f"  Balance: {'Near equilibrium' if abs(model.Qs - cap0) < 50 else 'Out of balance'}")

# Dam built: sediment drops to 30% of original
model.Qs = 60  # dam traps 70% of sediment
print(f"\\nPost-dam sediment supply: {model.Qs:.0f} kg/s (dam traps 70%)\\n")

# Simulate 30 years
years_sim = 30
print(f"{'Year':<8} {'Width (m)':<12} {'Depth (m)':<12} {'Slope':<14} {'Capacity':<12} {'Deficit':<12} {'Trend'}")
print("-" * 76)

for yr in range(years_sim):
    model.step(dt_years=1)
    h = model.history[-1]
    if yr % 3 == 0 or yr == years_sim - 1:
        trend = "eroding" if h["imbalance"] < -10 else "stable" if abs(h["imbalance"]) < 10 else "depositing"
        print(f"{yr+1:<8} {h['W']:<12.0f} {h['D']:<12.2f} {h['S']:<14.7f} {h['capacity']:<12.0f} {h['imbalance']:<12.0f} {trend}")

# Summary
h0 = {"W": 500, "D": 3.5, "S": 0.0004}
hf = model.history[-1]
print(f"\\n--- {years_sim}-Year Change Summary ---")
print(f"\\n  Width:  {h0['W']:.0f} -> {hf['W']:.0f} m  ({hf['W']-h0['W']:+.0f} m, {(hf['W']-h0['W'])/h0['W']*100:+.1f}%)")
print(f"  Depth:  {h0['D']:.1f} -> {hf['D']:.2f} m  ({hf['D']-h0['D']:+.2f} m, {(hf['D']-h0['D'])/h0['D']*100:+.1f}%)")
print(f"  Slope:  {h0['S']:.6f} -> {hf['S']:.7f}")

print(f"\\n--- What This Means ---")
print(f"  The river narrows by {h0['W']-hf['W']:.0f} m as it cuts down into its bed.")
print(f"  Depth increases by {hf['D']-h0['D']:.2f} m -- the 'hungry water' effect.")
print(f"  Braiding may decrease as the channel incises into a single thread.")

print("\\n--- Key Insight ---")
print("Lane's Balance (Q*S ~ Qs*D50) governs river form. When you change one")
print("variable (like trapping sediment behind a dam), the river adjusts ALL")
print("the others until a new equilibrium is reached. This can take decades")
print("and has major consequences for downstream communities and ecosystems.")`,
      challenge: "Combine the models from all six lessons into a unified analysis pipeline. Run it on a new dataset and generate a comprehensive summary report.",
      successHint: "You have built a complete analytical framework for this domain — from raw data to validated predictions.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (geomorphology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for braided river geomorphology and sediment transport. Click to start.</p>
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
