import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FlyingSquirrelLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Blueprint: Glider Design Parameters',
      concept: `Your capstone project is to build paper gliders with different wing shapes, measure their glide ratios, and find the design that maximizes horizontal distance from a given launch height. To do this scientifically rather than by guesswork, we first need to understand what parameters define a glider and how they interact.

Four parameters define a paper glider's aerodynamics. **Wing area** (A) is the total surface area of both wings combined, measured in square centimetres. A larger wing area generates more lift but also more drag. **Aspect ratio** (AR) is the wingspan squared divided by wing area: AR = b^2 / A. A long, narrow wing (high AR, like an albatross) produces lift more efficiently than a short, wide wing (low AR, like a butterfly). **Wing loading** is the glider's total weight divided by wing area: W/A. Lower wing loading means the glider needs less speed to generate enough lift to stay aloft. **Centre of gravity (CG) position** determines stability: a CG too far forward makes the glider dive; too far back makes it stall and tumble.

For paper gliders, we can control these four parameters by changing the paper size (wing area), wing shape (aspect ratio), adding paper clips (wing loading and CG position), and folding technique (camber and angle of attack). We will build four distinct designs, each emphasizing a different parameter, and test them systematically.`,
      analogy: 'Designing a glider experiment is like designing a cooking experiment to find the best bread recipe. You do not randomly change flour, yeast, water, and temperature all at once. You change ONE variable at a time (e.g., try three different flour types with everything else constant), measure the outcome (taste, texture, rise), and draw conclusions. Our four glider designs will each isolate one aerodynamic variable so we can understand its individual effect.',
      storyConnection: 'The flying squirrel of Hollongapar has evolved its own "design parameters" over millions of years: a patagium area of about 600 cm^2, an aspect ratio of roughly 1.5, a body mass of 1.5 kg giving a wing loading of about 25 N/m^2, and a CG controlled by shifting limb positions mid-glide. Our paper gliders will explore the same parameter space, just at smaller scale.',
      checkQuestion: 'Glider A has wingspan 30 cm and wing area 150 cm^2. Glider B has wingspan 20 cm and wing area 150 cm^2. Which has a higher aspect ratio, and what does that predict about their glide performance?',
      checkAnswer: 'Glider A: AR = 30^2 / 150 = 6.0. Glider B: AR = 20^2 / 150 = 2.7. Glider A has the higher aspect ratio. Higher AR means less induced drag (the drag penalty from generating lift), so Glider A should achieve a better glide ratio. However, high-AR wings are structurally weaker and more sensitive to turbulence, so there is a practical upper limit.',
      codeIntro: 'Define the four glider designs, compute their aerodynamic parameters, and predict their performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# GLIDER DESIGN LAB — Part 1: Parameter Database
# ============================================================

class GliderDesign:
    """Complete specification for a paper glider."""
    def __init__(self, name, wingspan_cm, chord_cm, mass_g, clip_pos_pct):
        self.name = name
        self.wingspan = wingspan_cm       # cm
        self.chord = chord_cm             # cm (average wing chord)
        self.mass = mass_g                # grams
        self.clip_pos = clip_pos_pct      # CG position (% from nose)

        # Derived parameters
        self.area_cm2 = wingspan_cm * chord_cm
        self.area_m2 = self.area_cm2 / 10000
        self.AR = wingspan_cm**2 / self.area_cm2
        self.weight_N = mass_g / 1000 * 9.81
        self.wing_loading = self.weight_N / self.area_m2  # N/m^2

        # Estimated stall speed (minimum flight speed)
        rho = 1.225
        CL_max = 0.8  # approximate for flat plate
        if self.area_m2 > 0 and CL_max > 0:
            self.v_stall = np.sqrt(2 * self.weight_N /
                                   (rho * self.area_m2 * CL_max))
        else:
            self.v_stall = 0

    def predicted_glide_ratio(self):
        """Estimate glide ratio from aspect ratio and wing loading."""
        # L/D approximately proportional to sqrt(AR) for simple gliders
        # Adjusted for paper glider Reynolds number regime
        base_ld = 0.9 * np.sqrt(self.AR)
        # CG penalty: optimal is around 25-35% from nose
        cg_optimal = 30
        cg_penalty = 1 - 0.015 * abs(self.clip_pos - cg_optimal)
        return base_ld * max(cg_penalty, 0.3)

    def report(self):
        print(f"  {self.name}")
        print(f"    Wingspan: {self.wingspan} cm, Chord: {self.chord} cm")
        print(f"    Area: {self.area_cm2} cm^2, AR: {self.AR:.2f}")
        print(f"    Mass: {self.mass} g, Wing loading: {self.wing_loading:.1f} N/m^2")
        print(f"    Stall speed: {self.v_stall:.2f} m/s")
        print(f"    Predicted L/D: {self.predicted_glide_ratio():.2f}")

# Four designs: each emphasizes a different parameter
designs = [
    GliderDesign("Wide & Short", wingspan_cm=30, chord_cm=10,
                 mass_g=5.0, clip_pos_pct=30),
    GliderDesign("Narrow & Long", wingspan_cm=15, chord_cm=10,
                 mass_g=5.0, clip_pos_pct=30),
    GliderDesign("Heavy Nose", wingspan_cm=22, chord_cm=10,
                 mass_g=8.0, clip_pos_pct=20),
    GliderDesign("Light & Flat", wingspan_cm=22, chord_cm=12,
                 mass_g=4.0, clip_pos_pct=35),
]

print("=== Glider Design Database ===")
for d in designs:
    d.report()
    print()

# --- Visualize parameter space ---
fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Paper Glider Design Space: 4 Test Configurations',
             color='white', fontsize=14, fontweight='bold')

colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
names = [d.name for d in designs]

# 1. Aspect ratio vs wing area
ax = axes[0, 0]; ax.set_facecolor('#111827')
for d, c in zip(designs, colors):
    ax.scatter(d.area_cm2, d.AR, color=c, s=200, zorder=5, edgecolors='white')
    ax.annotate(d.name, (d.area_cm2, d.AR), textcoords="offset points",
                xytext=(10, 5), color=c, fontsize=9)
ax.set_xlabel('Wing area (cm^2)', color='white')
ax.set_ylabel('Aspect ratio', color='white')
ax.set_title('Design Space: Area vs AR', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Wing loading vs predicted L/D
ax = axes[0, 1]; ax.set_facecolor('#111827')
for d, c in zip(designs, colors):
    ax.scatter(d.wing_loading, d.predicted_glide_ratio(), color=c, s=200,
               zorder=5, edgecolors='white')
    ax.annotate(d.name, (d.wing_loading, d.predicted_glide_ratio()),
                textcoords="offset points", xytext=(10, 5), color=c, fontsize=9)
ax.set_xlabel('Wing loading (N/m^2)', color='white')
ax.set_ylabel('Predicted glide ratio (L/D)', color='white')
ax.set_title('Wing Loading vs Performance', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. Parameter comparison bar chart
ax = axes[1, 0]; ax.set_facecolor('#111827')
params = ['AR', 'Area\\\n(cm^2/50)', 'Loading\\\n(N/m^2)', 'L/D\\\npredicted']
x_pos = np.arange(len(params))
width = 0.18
for i, (d, c) in enumerate(zip(designs, colors)):
    vals = [d.AR, d.area_cm2/50, d.wing_loading, d.predicted_glide_ratio()]
    ax.bar(x_pos + i * width, vals, width, color=c, label=d.name)
ax.set_xticks(x_pos + 1.5 * width)
ax.set_xticklabels(params, color='white', fontsize=9)
ax.set_ylabel('Value', color='white')
ax.set_title('Parameter Comparison', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 4. Stall speed comparison
ax = axes[1, 1]; ax.set_facecolor('#111827')
stall_speeds = [d.v_stall for d in designs]
bars = ax.barh(names, stall_speeds, color=colors, height=0.5)
for bar, v in zip(bars, stall_speeds):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            f'{v:.2f} m/s', va='center', color='white', fontsize=10)
ax.set_xlabel('Minimum flight speed (m/s)', color='white')
ax.set_title('Stall Speed: Lighter Gliders Fly Slower', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Design phase complete.")
print("Each glider isolates a different aerodynamic variable:")
print("  Wide & Short:  HIGH aspect ratio (efficient lift)")
print("  Narrow & Long: LOW aspect ratio (more induced drag)")
print("  Heavy Nose:    HIGH wing loading (fast, steep descent)")
print("  Light & Flat:  LOW wing loading (slow, gentle descent)")`,
      challenge: 'Add a fifth design called "Flying Squirrel" that mimics the real animal: wingspan 25 cm, chord 15 cm (low AR of ~1.7), mass 6 g, CG at 28%. How does its predicted performance compare to the optimized "Wide & Short" design?',
      successHint: 'A well-defined parameter space is the foundation of any engineering experiment. You now know exactly which four variables matter, how they interact, and what each design is testing. The flights will confirm or challenge these predictions.',
    },
    {
      title: 'Glide Trajectory Simulation: Physics Engine',
      concept: `To predict glide distance before building the actual gliders, we need a physics engine that simulates the trajectory of a glider through the air. The simulation solves Newton's second law at each time step: sum of forces equals mass times acceleration.

Three forces act on a glider in flight. **Gravity** pulls straight down with force W = m * g. **Lift** acts perpendicular to the direction of motion: L = 0.5 * rho * v^2 * A * C_L, where rho is air density, v is airspeed, A is wing area, and C_L is the lift coefficient (which depends on angle of attack). **Drag** acts opposite to the direction of motion: D = 0.5 * rho * v^2 * A * C_D, where C_D has two components: parasite drag (from the glider's shape, roughly constant) and induced drag (the penalty for generating lift, proportional to C_L^2 / (pi * AR)).

The total drag coefficient is C_D = C_D0 + C_L^2 / (pi * e * AR), where C_D0 is the parasite drag coefficient (about 0.05 for a paper glider) and e is the Oswald efficiency factor (about 0.7 for simple wings). This equation reveals a fundamental trade-off: generating more lift (higher C_L) always increases drag. The optimal C_L is the one that maximizes L/D, which occurs when parasite drag equals induced drag.

At each time step, we decompose the forces into horizontal and vertical components, compute acceleration, update velocity, and update position. The glide ends when height reaches zero.`,
      analogy: 'The physics engine is like a very detailed flipbook animation. Each page shows the glider at one moment in time with arrows for gravity, lift, and drag. To draw the next page, you calculate how the forces change the speed and direction, move the glider accordingly, and draw it in the new position. Flip through all the pages fast enough and you see the complete glide trajectory.',
      storyConnection: 'When Biren watched the flying squirrel "sail through the dark forest like a furry paper airplane," he was seeing the same physics our simulation computes. The squirrel launched from a hollong tree at perhaps 20 metres height, spread its patagium to generate lift, and the interplay of gravity, lift, and drag traced out a curving path to the next trunk 50 metres away. Our simulator recreates that path from first principles.',
      checkQuestion: 'A glider has C_D0 = 0.05, AR = 4, and e = 0.7. At what C_L does it achieve maximum L/D? What is that maximum L/D?',
      checkAnswer: 'Maximum L/D occurs when induced drag equals parasite drag: C_L^2 / (pi * e * AR) = C_D0. Solving: C_L = sqrt(C_D0 * pi * e * AR) = sqrt(0.05 * 3.14159 * 0.7 * 4) = sqrt(0.4398) = 0.663. At this C_L, total C_D = 2 * C_D0 = 0.10. So max L/D = 0.663 / 0.10 = 6.6. This is a realistic value for a well-made paper glider.',
      codeIntro: 'Build a 2D trajectory simulator and fly all four glider designs from the same launch height.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# GLIDER TRAJECTORY SIMULATOR
# ============================================================

rho = 1.225    # air density (kg/m^3)
g_accel = 9.81 # gravity (m/s^2)
dt = 0.001     # time step (s) — small for accuracy

class Glider:
    def __init__(self, name, area_m2, AR, mass_kg, CD0=0.05, e=0.7):
        self.name = name
        self.A = area_m2
        self.AR = AR
        self.m = mass_kg
        self.CD0 = CD0
        self.e = e
        self.weight = mass_kg * g_accel

    def aero_forces(self, v, alpha_deg):
        """Compute lift and drag at given speed and angle of attack."""
        alpha_rad = np.radians(np.clip(alpha_deg, 0, 25))
        # Thin airfoil theory (adjusted for paper)
        CL = 2 * np.pi * alpha_rad * 0.4  # reduced from ideal
        CL = min(CL, 1.2)  # stall limit
        # Drag polar
        if self.AR > 0:
            CD_induced = CL**2 / (np.pi * self.e * self.AR)
        else:
            CD_induced = 0
        CD = self.CD0 + CD_induced
        q = 0.5 * rho * v**2
        L = q * self.A * CL
        D = q * self.A * CD
        return L, D, CL, CD

    def best_glide_CL(self):
        """CL for maximum L/D."""
        return np.sqrt(self.CD0 * np.pi * self.e * self.AR)

    def max_LD(self):
        """Maximum lift-to-drag ratio."""
        CL_opt = self.best_glide_CL()
        CD_opt = 2 * self.CD0
        return CL_opt / CD_opt if CD_opt > 0 else 0

def simulate_glide(glider, launch_height, launch_speed=3.0, alpha_deg=8.0):
    """Simulate 2D glide trajectory. Returns arrays of (x, y, t, speed)."""
    # Initial conditions: launched horizontally with slight downward tilt
    vx = launch_speed
    vy = 0.0
    x, y = 0.0, launch_height

    xs, ys, ts, speeds = [x], [y], [0.0], [launch_speed]
    t = 0.0

    while y > 0 and t < 20.0:
        v = np.sqrt(vx**2 + vy**2)
        if v < 0.1:
            break

        # Flight path angle (negative = descending)
        gamma = np.arctan2(vy, vx)

        L, D, CL, CD = glider.aero_forces(v, alpha_deg)

        # Forces in earth frame
        # Lift perpendicular to velocity, drag opposite to velocity
        ax_force = (-D * np.cos(gamma) + L * np.sin(gamma)) / glider.m
        ay_force = (-D * np.sin(gamma) - L * np.cos(gamma)) / glider.m + g_accel * (-1)

        # Note: gravity is -g in y direction
        ay_force = (L * np.cos(gamma) - D * np.sin(gamma)) / glider.m - g_accel

        ax_force = (-D * np.cos(gamma) - L * np.sin(gamma)) / glider.m

        vx += ax_force * dt
        vy += ay_force * dt
        x += vx * dt
        y += vy * dt
        t += dt

        if y < 0:
            y = 0
        xs.append(x)
        ys.append(y)
        ts.append(t)
        speeds.append(v)

    return np.array(xs), np.array(ys), np.array(ts), np.array(speeds)

# Define four glider designs (matching Lesson 1)
gliders = [
    Glider("Wide & Short",  area_m2=300e-4, AR=3.0, mass_kg=0.005),
    Glider("Narrow & Long", area_m2=150e-4, AR=1.5, mass_kg=0.005),
    Glider("Heavy Nose",    area_m2=220e-4, AR=2.2, mass_kg=0.008),
    Glider("Light & Flat",  area_m2=264e-4, AR=1.83, mass_kg=0.004),
]

launch_h = 2.5  # metres (top of a staircase)
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Glide Trajectory Simulation: 4 Designs from 2.5 m Height',
             color='white', fontsize=14, fontweight='bold')

# 1. Trajectories
ax = axes[0, 0]; ax.set_facecolor('#111827')
results = {}
for glider, color in zip(gliders, colors):
    xs, ys, ts, speeds = simulate_glide(glider, launch_h, alpha_deg=8.0)
    results[glider.name] = (xs, ys, ts, speeds)
    glide_ratio = xs[-1] / launch_h
    ax.plot(xs, ys, color=color, linewidth=2,
            label=f'{glider.name}: {xs[-1]:.1f}m (L/D={glide_ratio:.1f})')

ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Glide Trajectories', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)
ax.tick_params(colors='gray')

# 2. Speed profiles
ax = axes[0, 1]; ax.set_facecolor('#111827')
for glider, color in zip(gliders, colors):
    xs, ys, ts, speeds = results[glider.name]
    ax.plot(ts, speeds, color=color, linewidth=2, label=glider.name)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Speed (m/s)', color='white')
ax.set_title('Speed During Glide', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Drag polar — CL vs CD for each design
ax = axes[1, 0]; ax.set_facecolor('#111827')
CL_range = np.linspace(0, 1.2, 100)
for glider, color in zip(gliders, colors):
    CD_vals = glider.CD0 + CL_range**2 / (np.pi * glider.e * glider.AR)
    ax.plot(CD_vals, CL_range, color=color, linewidth=2, label=glider.name)
    # Mark best L/D point
    CL_opt = glider.best_glide_CL()
    CD_opt = glider.CD0 + CL_opt**2 / (np.pi * glider.e * glider.AR)
    ax.plot(CD_opt, CL_opt, 'o', color=color, markersize=8)

ax.set_xlabel('Drag coefficient (CD)', color='white')
ax.set_ylabel('Lift coefficient (CL)', color='white')
ax.set_title('Drag Polar (dots = best L/D)', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Performance summary
ax = axes[1, 1]; ax.set_facecolor('#111827')
names = [g.name for g in gliders]
metrics = ['Max L/D', 'Range (m)', 'Flight time (s)']
x_pos = np.arange(len(metrics))
width = 0.18
for i, (glider, color) in enumerate(zip(gliders, colors)):
    xs, ys, ts, speeds = results[glider.name]
    vals = [glider.max_LD(), xs[-1], ts[-1]]
    ax.bar(x_pos + i * width, vals, width, color=color, label=glider.name)

ax.set_xticks(x_pos + 1.5 * width)
ax.set_xticklabels(metrics, color='white', fontsize=10)
ax.set_title('Performance Summary', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Simulation results:")
print(f"{'Design':<18} {'Range (m)':>10} {'Time (s)':>10} {'Max L/D':>10}")
print("-" * 50)
for glider in gliders:
    xs, ys, ts, speeds = results[glider.name]
    print(f"{glider.name:<18} {xs[-1]:>10.2f} {ts[-1]:>10.2f} {glider.max_LD():>10.2f}")`,
      challenge: 'Vary the angle of attack from 2 to 20 degrees for the "Wide & Short" glider and plot range vs angle of attack. Find the optimal AoA. Why does the range peak at an intermediate angle rather than at the maximum or minimum?',
      successHint: 'You now have a physics engine that predicts glide distance from aerodynamic parameters. This lets you predict the outcome of your real experiment before building a single glider. If the real results differ significantly from the simulation, the discrepancy tells you something interesting about the physics you did not model.',
    },
    {
      title: 'Glide Ratio Measurement: Experiment Design',
      concept: `Simulation gives predictions; experiments give truth. This lesson designs the measurement protocol for your paper glider tests. A rigorous experiment requires **controlled variables** (things you keep constant), **independent variables** (things you deliberately change), and **dependent variables** (things you measure).

For each glider design, you will launch from the **same height** (controlled), with the **same launch technique** (controlled), and measure the **horizontal distance** where the glider lands (dependent). The independent variable is the glider design. You repeat each launch **at least 5 times** to account for variation, and you compute the **mean** and **standard deviation** of the horizontal distance.

The glide ratio for each design is: GR = horizontal distance / launch height. If you launch from 2.5 metres and the glider lands 8 metres away, GR = 8 / 2.5 = 3.2. This means the glider travels 3.2 metres forward for every 1 metre it descends.

Important sources of error: (1) inconsistent launch speed and angle (the biggest source), (2) air currents in the room, (3) measurement imprecision (use a tape measure, not pacing), (4) glider degradation over repeated flights (paper bends and weakens). Acknowledging these errors and quantifying them with standard deviation is what separates science from guesswork.`,
      analogy: 'Running a glider experiment without repetition is like tasting a new dish once and declaring it delicious or terrible. Maybe the chef was having an unusually good or bad day. You need to taste it several times, on different days, before you can fairly judge. Five launches per glider give you enough "tastings" to separate real performance differences from random luck.',
      storyConnection: 'The flying squirrel does not glide once and retire. It makes dozens of glides every night, in varying wind conditions, between trees at different distances. Its lifetime of glides is its "dataset." If we watched the Hollongapar squirrel for a week and measured every glide, we would get a distribution of distances, just like our repeated paper glider launches will produce a distribution.',
      checkQuestion: 'Glider A averages 7.2 m with standard deviation 1.8 m over 5 launches. Glider B averages 8.0 m with standard deviation 0.5 m. Which is the better glider?',
      checkAnswer: 'Glider B is better. Although its mean distance is only slightly higher, its standard deviation is much smaller, meaning it performs consistently. Glider A might occasionally beat Glider B, but its high variability makes it unreliable. In engineering (and in nature), consistency often matters more than peak performance. The squirrel needs to reach the next tree EVERY time, not just sometimes.',
      codeIntro: 'Simulate realistic experimental data with measurement noise, compute statistics, and determine which design differences are statistically significant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# EXPERIMENT SIMULATION: Repeated Launches with Noise
# ============================================================

launch_height = 2.5  # metres

# True performance of each design (from our physics engine)
designs = {
    'Wide & Short':  {'true_range': 7.8, 'consistency': 0.6},
    'Narrow & Long': {'true_range': 5.2, 'consistency': 0.9},
    'Heavy Nose':    {'true_range': 6.5, 'consistency': 0.4},
    'Light & Flat':  {'true_range': 6.0, 'consistency': 1.2},
}

n_launches = 10  # launches per design

# Simulate experimental data
print("=== Experimental Data (10 launches each) ===")
print(f"Launch height: {launch_height} m")
print()

all_data = {}
for name, props in designs.items():
    # Add realistic noise: launch angle variation, air currents, measurement
    distances = (props['true_range']
                 + np.random.normal(0, props['consistency'], n_launches)
                 + np.random.normal(0, 0.3, n_launches))  # measurement error
    distances = np.maximum(distances, 0.5)  # can't be negative
    all_data[name] = distances

    glide_ratios = distances / launch_height
    print(f"{name}:")
    print(f"  Distances: {', '.join(f'{d:.2f}' for d in distances)} m")
    print(f"  Mean: {np.mean(distances):.2f} m, Std: {np.std(distances):.2f} m")
    print(f"  Glide ratio: {np.mean(glide_ratios):.2f} +/- {np.std(glide_ratios):.2f}")
    print()

# Statistical analysis
names = list(designs.keys())
means = [np.mean(all_data[n]) for n in names]
stds = [np.std(all_data[n]) for n in names]
grs = [np.mean(all_data[n]) / launch_height for n in names]
gr_stds = [np.std(all_data[n]) / launch_height for n in names]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Paper Glider Experiment: 10 Launches per Design',
             color='white', fontsize=14, fontweight='bold')
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

# 1. Raw data scatter + means
ax = axes[0, 0]; ax.set_facecolor('#111827')
for i, (name, color) in enumerate(zip(names, colors)):
    data = all_data[name]
    jitter = np.random.uniform(-0.15, 0.15, len(data))
    ax.scatter(np.full_like(data, i) + jitter, data, color=color,
               alpha=0.6, s=50, zorder=3)
    ax.errorbar(i, means[i], yerr=stds[i], color='white', capsize=8,
                capthick=2, linewidth=2, zorder=4)
    ax.plot(i, means[i], 'D', color=color, markersize=10,
            markeredgecolor='white', zorder=5)

ax.set_xticks(range(len(names)))
ax.set_xticklabels(names, color='white', fontsize=9, rotation=15)
ax.set_ylabel('Horizontal distance (m)', color='white')
ax.set_title('Raw Data with Mean +/- 1 Std Dev', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Glide ratio comparison
ax = axes[0, 1]; ax.set_facecolor('#111827')
bars = ax.bar(range(len(names)), grs, yerr=gr_stds, capsize=5,
              color=colors, width=0.6, edgecolor='white', linewidth=0.5)
for bar, gr, gs in zip(bars, grs, gr_stds):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + gs + 0.05,
            f'{gr:.2f}', ha='center', color='white', fontsize=11)
ax.set_xticks(range(len(names)))
ax.set_xticklabels(names, color='white', fontsize=9, rotation=15)
ax.set_ylabel('Glide ratio (distance / height)', color='white')
ax.set_title('Glide Ratio with Error Bars', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. Distribution histograms
ax = axes[1, 0]; ax.set_facecolor('#111827')
bins = np.linspace(2, 12, 20)
for name, color in zip(names, colors):
    ax.hist(all_data[name], bins=bins, alpha=0.4, color=color, label=name,
            edgecolor='none')
    ax.axvline(np.mean(all_data[name]), color=color, linewidth=2, linestyle='--')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Distribution of Distances', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Coefficient of variation (consistency metric)
ax = axes[1, 1]; ax.set_facecolor('#111827')
cvs = [s / m * 100 for m, s in zip(means, stds)]
bars = ax.barh(names, cvs, color=colors, height=0.5)
for bar, cv in zip(bars, cvs):
    label = 'Consistent' if cv < 10 else 'Variable' if cv < 15 else 'Unreliable'
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{cv:.1f}% ({label})', va='center', color='white', fontsize=10)
ax.set_xlabel('Coefficient of variation (%)', color='white')
ax.set_title('Consistency: Lower CV = More Repeatable', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Ranking
ranked = sorted(zip(names, grs, gr_stds, cvs),
                key=lambda x: x[1], reverse=True)
print("\\\nRanking by glide ratio:")
for rank, (name, gr, gs, cv) in enumerate(ranked, 1):
    print(f"  {rank}. {name}: GR = {gr:.2f} +/- {gs:.2f} (CV = {cv:.1f}%)")`,
      challenge: 'Implement a simple significance test: for the top two designs, compute the t-statistic = (mean1 - mean2) / sqrt(std1^2/n + std2^2/n). If t > 2.0, the difference is statistically significant at 95% confidence. Are your top two designs significantly different, or could the ranking be due to chance?',
      successHint: 'Experimental design is as important as the experiment itself. Without repetition, error bars, and consistency analysis, you have anecdotes, not data. This lesson shows that the "best" glider is not always the one with the single longest flight; it is the one that performs well reliably.',
    },
    {
      title: 'Weight Distribution: Centre of Gravity Effects',
      concept: `The fourth step in the project is adjusting weight distribution by adding paper clips to different positions on the glider. This tests the effect of **centre of gravity (CG) position** on flight characteristics, which is the single most important tuning parameter for any glider.

A glider with CG too far forward is **nose-heavy**. It tends to dive, producing a steep, fast descent with poor glide ratio. The nose-down pitch means a high angle of descent but the glider is very stable: if disturbed, it naturally returns to its dive. A glider with CG too far back is **tail-heavy**. It tends to pitch up, stall, and enter a tumbling motion. Tail-heavy gliders are unstable and unpredictable.

The optimal CG position for a paper glider is typically at 25-35% of the chord length from the leading edge. At this position, the lift force (acting at the aerodynamic centre, roughly 25% chord) and the weight (acting at the CG) create a balanced pitching moment that keeps the glider at a stable angle of attack.

We model CG effect on flight by adjusting the trim angle of attack. A forward CG forces a lower AoA (more dive). A rearward CG allows a higher AoA (more nose-up, closer to stall). The simulation sweeps CG position from 15% to 50% chord and shows how range, stability, and flight time change.`,
      analogy: 'CG position is like the balance point of a see-saw. A see-saw with the heavy kid too far forward tilts and slams down. With the heavy kid too far back, it tips the other way. The sweet spot is where both sides balance with a slight bias toward the front for stability. Moving a paper clip on your glider by just 1 centimetre is like shifting the heavy kid by a full seat position.',
      storyConnection: 'The flying squirrel adjusts its CG continuously during flight by shifting its limbs. Extending the front legs forward moves the CG forward for a steeper dive to gain speed. Pulling them back shifts the CG rearward, increasing AoA and lift for the landing flare. A paper clip is our crude version of this muscular control system.',
      checkQuestion: 'You add a 2-gram paper clip to a 5-gram glider at the nose. The CG shifts from 30% chord to 22% chord. How will the flight change?',
      checkAnswer: 'The total mass increases to 7 g (40% heavier), increasing wing loading and stall speed. The forward CG shift to 22% chord forces a lower angle of attack (more nose-down trim). Combined effect: the glider flies faster and steeper. Glide ratio likely decreases because the AoA is now below the optimal value for maximum L/D. The glider becomes very stable but inefficient, like a dart rather than a soaring bird.',
      codeIntro: 'Sweep CG position and paper clip weight, simulating the effect on glide trajectory, range, and stability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# WEIGHT DISTRIBUTION EXPERIMENT
# ============================================================

rho = 1.225; g_val = 9.81; dt = 0.001

def simulate_with_cg(area_m2, AR, mass_kg, cg_pct, launch_h=2.5):
    """Simulate glide with CG-dependent trim angle of attack."""
    CD0 = 0.05; e = 0.7

    # CG determines trim AoA
    # Optimal CG ~30% gives best AoA (~8 deg)
    # Forward CG -> lower AoA (divey)
    # Rearward CG -> higher AoA (toward stall)
    cg_optimal = 30.0
    aoa_base = 8.0
    aoa_trim = aoa_base + (cg_pct - cg_optimal) * 0.4
    aoa_trim = np.clip(aoa_trim, 2, 18)

    # Stability: forward CG is more stable
    stability = max(0, 1.0 - 0.03 * (cg_pct - 20))
    noise_amplitude = 0.5 * (1 - stability)

    vx, vy = 3.0, 0.0
    x, y = 0.0, launch_h
    xs, ys = [x], [y]
    t = 0

    while y > 0 and t < 20:
        v = np.sqrt(vx**2 + vy**2)
        if v < 0.1: break

        # Add stability-dependent noise
        aoa = aoa_trim + noise_amplitude * np.sin(t * 15)
        aoa = np.clip(aoa, 1, 20)

        alpha_rad = np.radians(aoa)
        CL = min(2 * np.pi * alpha_rad * 0.4, 1.2)
        CD = CD0 + CL**2 / (np.pi * e * AR)
        q = 0.5 * rho * v**2
        L = q * area_m2 * CL
        D = q * area_m2 * CD

        gamma = np.arctan2(vy, vx)
        ax_f = (-D * np.cos(gamma) - L * np.sin(gamma)) / mass_kg
        ay_f = (L * np.cos(gamma) - D * np.sin(gamma)) / mass_kg - g_val

        vx += ax_f * dt
        vy += ay_f * dt
        x += vx * dt
        y += vy * dt
        t += dt

        if y < 0: y = 0
        xs.append(x); ys.append(y)

    return np.array(xs), np.array(ys), aoa_trim, stability

# Base glider parameters
base_area = 264e-4  # m^2
base_AR = 2.2
base_mass = 0.005   # kg

# Sweep CG position (no added mass)
cg_positions = np.linspace(15, 50, 50)
ranges_by_cg = []
aoas_by_cg = []
stab_by_cg = []

for cg in cg_positions:
    xs, ys, aoa, stab = simulate_with_cg(base_area, base_AR, base_mass, cg)
    ranges_by_cg.append(xs[-1])
    aoas_by_cg.append(aoa)
    stab_by_cg.append(stab)

# Paper clip experiment: different positions and weights
clip_configs = [
    ('No clip', 0, 30),
    ('Light clip, nose', 1.5, 22),
    ('Light clip, middle', 1.5, 32),
    ('Light clip, tail', 1.5, 42),
    ('Heavy clip, nose', 3.0, 18),
    ('Heavy clip, tail', 3.0, 45),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Weight Distribution: Centre of Gravity Effects',
             color='white', fontsize=14, fontweight='bold')

# 1. Range vs CG position
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(cg_positions, ranges_by_cg, color='#3b82f6', linewidth=2.5)
ax.fill_between(cg_positions, ranges_by_cg, alpha=0.15, color='#3b82f6')
opt_idx = np.argmax(ranges_by_cg)
opt_cg = cg_positions[opt_idx]
opt_range = ranges_by_cg[opt_idx]
ax.plot(opt_cg, opt_range, 'o', color='#f59e0b', markersize=10, zorder=5)
ax.annotate(f'Optimal: {opt_cg:.0f}% chord\\\n{opt_range:.2f} m',
            xy=(opt_cg, opt_range), xytext=(opt_cg + 5, opt_range - 0.5),
            color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Mark zones
ax.axvspan(15, 25, alpha=0.1, color='#ef4444')
ax.text(17, min(ranges_by_cg) + 0.3, 'Nose-heavy\\\n(divey)', color='#ef4444', fontsize=9)
ax.axvspan(40, 50, alpha=0.1, color='#ef4444')
ax.text(41, min(ranges_by_cg) + 0.3, 'Tail-heavy\\\n(unstable)', color='#ef4444', fontsize=9)

ax.set_xlabel('CG position (% chord from nose)', color='white')
ax.set_ylabel('Horizontal range (m)', color='white')
ax.set_title('Range vs CG Position', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Trajectories for clip configurations
ax = axes[0, 1]; ax.set_facecolor('#111827')
clip_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']
for (name, clip_g, cg), color in zip(clip_configs, clip_colors):
    total_mass = (base_mass * 1000 + clip_g) / 1000
    xs, ys, _, _ = simulate_with_cg(base_area, base_AR, total_mass, cg)
    ax.plot(xs, ys, color=color, linewidth=1.8,
            label=f'{name} ({xs[-1]:.1f}m)')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Trajectories with Different Clip Positions', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)
ax.tick_params(colors='gray')

# 3. AoA and stability vs CG
ax = axes[1, 0]; ax.set_facecolor('#111827')
ax.plot(cg_positions, aoas_by_cg, color='#22c55e', linewidth=2, label='Trim AoA (deg)')
ax2 = ax.twinx()
ax2.plot(cg_positions, stab_by_cg, color='#a855f7', linewidth=2, label='Stability')
ax.set_xlabel('CG position (% chord)', color='white')
ax.set_ylabel('Trim angle of attack (deg)', color='#22c55e')
ax2.set_ylabel('Stability factor', color='#a855f7')
ax.set_title('AoA and Stability vs CG', color='white', fontsize=12)
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2,
          facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# 4. Summary: range vs added mass at optimal CG
ax = axes[1, 1]; ax.set_facecolor('#111827')
clip_masses = np.linspace(0, 5, 30)  # grams
ranges_mass = []
for cm in clip_masses:
    total_m = (base_mass * 1000 + cm) / 1000
    xs, ys, _, _ = simulate_with_cg(base_area, base_AR, total_m, 30)
    ranges_mass.append(xs[-1])

ax.plot(clip_masses, ranges_mass, color='#f59e0b', linewidth=2.5)
ax.fill_between(clip_masses, ranges_mass, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Added clip mass (g)', color='white')
ax.set_ylabel('Range at optimal CG (m)', color='white')
ax.set_title('Heavier Gliders Fly Shorter (at same wing area)', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Weight distribution findings:")
print(f"  Optimal CG: {opt_cg:.0f}% chord from nose")
print(f"  Best range: {opt_range:.2f} m (glide ratio {opt_range/2.5:.2f})")
print()
print("Paper clip configurations ranked by range:")
ranked = []
for name, clip_g, cg in clip_configs:
    total_m = (base_mass * 1000 + clip_g) / 1000
    xs, ys, _, _ = simulate_with_cg(base_area, base_AR, total_m, cg)
    ranked.append((name, xs[-1], clip_g, cg))
ranked.sort(key=lambda x: x[1], reverse=True)
for rank, (name, r, cg_mass, cg_pos) in enumerate(ranked, 1):
    print(f"  {rank}. {name}: {r:.2f} m (CG={cg_pos}%, +{cg_mass}g)")`,
      challenge: 'Design an experiment to find the EXACT optimal CG position for each of your four glider designs from Lesson 1. The optimal CG might be different for each design because it depends on aspect ratio and wing shape. Plot optimal CG vs aspect ratio.',
      successHint: 'CG position is the most sensitive tuning parameter in glider design. A 5% chord shift can change range by 30%. This is why the flying squirrel has muscles in its patagium: millimetre-level CG adjustments during flight mean the difference between reaching the next tree and falling short.',
    },
    {
      title: 'Best Design Analysis: Linking Paper to Patagium',
      concept: `With data from all four designs across multiple CG configurations, we can now identify the optimal design and explain WHY it wins. The analysis proceeds in three steps.

**Step 1: Rank by glide ratio.** The design with the highest mean glide ratio (horizontal distance divided by launch height) is the best performer in calm conditions. But we also consider consistency: a design with slightly lower mean but much lower variance may be preferable in practice.

**Step 2: Identify the dominant parameter.** By comparing designs pairwise (Wide vs Narrow isolates aspect ratio; Heavy vs Light isolates wing loading), we can determine which parameter has the largest effect on glide ratio. In almost all paper glider experiments, **aspect ratio dominates**: high-AR designs consistently outperform low-AR designs by the largest margin.

**Step 3: Connect to flying squirrel anatomy.** The flying squirrel has a surprisingly LOW aspect ratio (about 1.5-2.0). If high AR gives better glide ratio, why did evolution not give the squirrel longer, narrower wings? Because the squirrel optimizes for **manoeuvrability in dense forest**, not maximum range in open air. Low AR wings allow tight turns, rapid banking, and precise landing on tree trunks. High AR wings would clip branches and could not execute the sharp turns needed to navigate the canopy. This is the key insight: the "best" design depends on what you are optimizing FOR.`,
      analogy: 'This is like comparing a sports car and an SUV. The sports car wins on a racetrack (maximum speed in open space, like a high-AR glider in calm air). The SUV wins on a forest trail (manoeuvrability in cluttered terrain, like a low-AR squirrel in a dense canopy). Neither is objectively "better" because they are optimized for different environments. Declaring a winner requires first defining the competition.',
      storyConnection: 'In the story, the flying squirrel made a "long, sweeping arc" between hollong trees and also executed precise turns to dodge branches. A paper glider optimized only for range could not do both. The squirrel represents a multi-objective optimization: decent range AND excellent manoeuvrability AND reliable landing. Our best paper glider wins on range alone, but the squirrel would win in the forest.',
      checkQuestion: 'Your best paper glider achieves a glide ratio of 3.2. A real flying squirrel achieves 2.5. Does this mean the paper glider is aerodynamically superior?',
      checkAnswer: 'No. The paper glider flies in a straight line in still air. The squirrel navigates a 3D forest with branches, turbulence, and the need to land precisely on a vertical trunk. If you forced the paper glider to make a 90-degree turn mid-flight, its effective range would drop below the squirrel. The squirrel also carries a 1.5 kg payload (its body) compared to 5 grams for the glider. Comparing raw glide ratios across such different scales and missions is misleading.',
      codeIntro: 'Perform the final analysis: rank designs, identify key parameters, and compare to flying squirrel performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FINAL ANALYSIS: Best Design + Squirrel Comparison
# ============================================================

# Experimental results (mean +/- std from 10 launches each)
# Four base designs + two CG variants of the best
results = {
    'Wide & Short':     {'range_m': 7.80, 'std': 0.60, 'AR': 3.0,
                         'area_cm2': 300, 'mass_g': 5.0, 'wl': 1.63},
    'Narrow & Long':    {'range_m': 5.20, 'std': 0.90, 'AR': 1.5,
                         'area_cm2': 150, 'mass_g': 5.0, 'wl': 3.27},
    'Heavy Nose':       {'range_m': 6.50, 'std': 0.40, 'AR': 2.2,
                         'area_cm2': 220, 'mass_g': 8.0, 'wl': 3.57},
    'Light & Flat':     {'range_m': 6.00, 'std': 1.20, 'AR': 1.83,
                         'area_cm2': 264, 'mass_g': 4.0, 'wl': 1.49},
    'Wide+clip(nose)':  {'range_m': 7.10, 'std': 0.35, 'AR': 3.0,
                         'area_cm2': 300, 'mass_g': 6.5, 'wl': 2.13},
    'Wide+clip(tail)':  {'range_m': 5.80, 'std': 1.50, 'AR': 3.0,
                         'area_cm2': 300, 'mass_g': 6.5, 'wl': 2.13},
}

# Flying squirrel data for comparison
squirrel = {
    'name': 'Giant Flying Squirrel',
    'range_m': 50.0,  # from 20m launch height
    'launch_h': 20.0,
    'GR': 2.5,
    'AR': 1.7,
    'area_cm2': 600,
    'mass_g': 1500,
    'wl': 24.5,  # N/m^2
}

launch_h = 2.5
names = list(results.keys())
data = results

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Best Design Analysis: Paper Gliders vs Flying Squirrel',
             color='white', fontsize=14, fontweight='bold')

# 1. Glide ratio ranking
ax = axes[0, 0]; ax.set_facecolor('#111827')
grs = [data[n]['range_m'] / launch_h for n in names]
stds = [data[n]['std'] / launch_h for n in names]
sorted_idx = np.argsort(grs)[::-1]
sorted_names = [names[i] for i in sorted_idx]
sorted_grs = [grs[i] for i in sorted_idx]
sorted_stds = [stds[i] for i in sorted_idx]
bar_colors = ['#22c55e' if i == 0 else '#3b82f6' for i in range(len(sorted_names))]
bars = ax.barh(range(len(sorted_names)), sorted_grs, xerr=sorted_stds,
               capsize=4, color=bar_colors, height=0.6, edgecolor='white', linewidth=0.5)
for i, (gr, s) in enumerate(zip(sorted_grs, sorted_stds)):
    ax.text(gr + s + 0.1, i, f'{gr:.2f}', va='center', color='white', fontsize=10)
ax.set_yticks(range(len(sorted_names)))
ax.set_yticklabels(sorted_names, color='white', fontsize=9)
ax.set_xlabel('Glide ratio', color='white')
ax.set_title('Ranked by Glide Ratio', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.invert_yaxis()

# 2. Parameter sensitivity: what matters most?
ax = axes[0, 1]; ax.set_facecolor('#111827')
# Pairwise comparisons
comparisons = [
    ('Aspect Ratio', 'Wide & Short', 'Narrow & Long',
     data['Wide & Short']['range_m'] - data['Narrow & Long']['range_m']),
    ('Wing Loading', 'Light & Flat', 'Heavy Nose',
     data['Light & Flat']['range_m'] - data['Heavy Nose']['range_m']),
    ('CG Forward', 'Wide & Short', 'Wide+clip(nose)',
     data['Wide & Short']['range_m'] - data['Wide+clip(nose)']['range_m']),
    ('CG Rearward', 'Wide & Short', 'Wide+clip(tail)',
     data['Wide & Short']['range_m'] - data['Wide+clip(tail)']['range_m']),
]
comp_names = [c[0] for c in comparisons]
comp_effects = [abs(c[3]) for c in comparisons]
comp_colors = ['#22c55e' if e == max(comp_effects) else '#3b82f6' for e in comp_effects]
bars = ax.barh(comp_names, comp_effects, color=comp_colors, height=0.5)
for bar, eff in zip(bars, comp_effects):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            f'{eff:.2f} m', va='center', color='white', fontsize=10)
ax.set_xlabel('Effect on range (m)', color='white')
ax.set_title('Parameter Sensitivity', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. AR vs glide ratio with squirrel reference
ax = axes[0, 2]; ax.set_facecolor('#111827')
ars = [data[n]['AR'] for n in names]
grs_plot = [data[n]['range_m'] / launch_h for n in names]
colors_scatter = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']
for ar, gr, name, c in zip(ars, grs_plot, names, colors_scatter):
    ax.scatter(ar, gr, color=c, s=120, zorder=3, edgecolors='white')
    ax.annotate(name, (ar, gr), textcoords="offset points",
                xytext=(5, 5), color=c, fontsize=7)

# Add squirrel point
ax.scatter(squirrel['AR'], squirrel['GR'], color='#f59e0b', s=200,
           marker='*', zorder=5, edgecolors='white', linewidth=1.5)
ax.annotate('Flying Squirrel\\\n(AR=1.7, GR=2.5)', (squirrel['AR'], squirrel['GR']),
            textcoords="offset points", xytext=(10, -15),
            color='#f59e0b', fontsize=9, fontweight='bold')

# Trend line
ar_range = np.linspace(1, 4, 50)
gr_trend = 0.9 * np.sqrt(ar_range)  # theoretical: L/D ~ sqrt(AR)
ax.plot(ar_range, gr_trend, '--', color='gray', linewidth=1, alpha=0.5, label='L/D ~ sqrt(AR)')

ax.set_xlabel('Aspect ratio', color='white')
ax.set_ylabel('Glide ratio', color='white')
ax.set_title('AR vs Glide Ratio (+ Squirrel)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Scale comparison: paper vs squirrel
ax = axes[1, 0]; ax.set_facecolor('#111827')
best_name = sorted_names[0]
best = data[best_name]
categories = ['Mass (g)', 'Area (cm^2)', 'Wing loading\\\n(N/m^2)', 'Glide ratio']
paper_vals = [best['mass_g'], best['area_cm2'], best['wl'], best['range_m']/launch_h]
squirrel_vals = [squirrel['mass_g'], squirrel['area_cm2'], squirrel['wl'], squirrel['GR']]

# Normalize for visualization
paper_norm = [v / max(pv, sv) for v, pv, sv in zip(paper_vals, paper_vals, squirrel_vals)]
squirrel_norm = [v / max(pv, sv) for v, pv, sv in zip(squirrel_vals, paper_vals, squirrel_vals)]

x_pos = np.arange(len(categories))
ax.bar(x_pos - 0.2, paper_norm, 0.35, color='#3b82f6', label=f'Best paper ({best_name})')
ax.bar(x_pos + 0.2, squirrel_norm, 0.35, color='#f59e0b', label='Flying squirrel')
ax.set_xticks(x_pos)
ax.set_xticklabels(categories, color='white', fontsize=9)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Paper Glider vs Flying Squirrel', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 5. Why low AR for squirrels? Turn radius comparison
ax = axes[1, 1]; ax.set_facecolor('#111827')
AR_range = np.linspace(1, 6, 50)
# Turn radius approximately proportional to wing loading / (rho * v^2 * CL)
# For same speed, lower AR allows tighter turns (lower turn radius)
turn_radius = 2.0 * AR_range**0.8  # simplified model
glide_distance = 5.0 * np.sqrt(AR_range)  # from theory

ax.plot(AR_range, glide_distance, color='#22c55e', linewidth=2, label='Glide distance')
ax.set_ylabel('Relative glide distance', color='#22c55e')
ax2 = ax.twinx()
ax2.plot(AR_range, turn_radius, color='#ef4444', linewidth=2, label='Turn radius')
ax2.set_ylabel('Relative turn radius (m)', color='#ef4444')

# Mark squirrel's AR
ax.axvline(1.7, color='#f59e0b', linestyle=':', linewidth=2)
ax.text(1.8, 3, 'Squirrel AR\\\n(1.7)', color='#f59e0b', fontsize=10)

ax.set_xlabel('Aspect ratio', color='white')
ax.set_title('The AR Trade-off: Range vs Manoeuvrability', color='white', fontsize=12)
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2,
          facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')

# 6. Conclusion text
ax = axes[1, 2]; ax.set_facecolor('#111827'); ax.axis('off')
conclusion = f"""Experiment Conclusions
=========================

Best paper glider: {sorted_names[0]}
  Glide ratio: {sorted_grs[0]:.2f}
  Key advantage: Highest aspect ratio

Most sensitive parameter:
  Aspect ratio (effect: {comp_effects[0]:.1f}m)

Flying squirrel comparison:
  AR: 1.7 (low for manoeuvrability)
  GR: 2.5 (lower than best paper)
  BUT: navigates 3D forest canopy
  with turns, braking, and precise
  vertical-surface landings

Key insight: "Best" depends on the
mission. Open-air range favours high
AR. Dense-canopy survival favours
low AR + muscular control.

Evolution optimises for survival,
not for a single performance metric."""

ax.text(0.05, 0.95, conclusion, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Final rankings:")
for i, (name, gr, std) in enumerate(zip(sorted_names, sorted_grs, sorted_stds)):
    print(f"  {i+1}. {name}: GR = {gr:.2f} +/- {std:.2f}")
print(f"\\\nFlying squirrel: GR = {squirrel['GR']} (optimised for forest, not range)")`,
      challenge: 'Build a "squirrel mode" paper glider: low AR (1.7), but with adjustable flaps (fold wing tips up) that let you change AoA mid-flight by throwing with a flick. Test whether you can make it turn 90 degrees during a glide like the real squirrel does. What happens to range when you force a turn?',
      successHint: 'The most important lesson from this capstone is not which paper glider flies farthest. It is that "best" is always relative to the objective. The flying squirrel sacrifices raw glide performance for manoeuvrability, consistency, and landing precision, because those are what keep it alive in the Hollongapar forest. Good engineering, like good evolution, optimises for the right objective.',
    },
    {
      title: 'Capstone Synthesis: From Paper to Patagium',
      concept: `This final lesson brings together everything: the design parameter space (Lesson 1), the physics engine (Lesson 2), the experimental method (Lesson 3), the CG tuning (Lesson 4), and the comparative analysis (Lesson 5) into a single comprehensive visualization.

We will produce a **design space map** showing how every combination of aspect ratio and wing loading affects glide ratio, with each of our tested designs plotted on the map, the flying squirrel marked for comparison, and the theoretical optimum identified. This map answers the capstone question: given any constraints on wing shape and weight, what is the best achievable glide ratio?

We also compute the **Reynolds number** for each design, which determines whether our paper glider results scale to the squirrel. Reynolds number is Re = rho * v * L / mu, where L is the chord length and mu is air viscosity. Paper gliders operate at Re = 10,000-50,000 (laminar flow, high skin friction). The flying squirrel operates at Re = 100,000-300,000 (transitional flow, lower skin friction). This difference means the squirrel achieves better aerodynamic efficiency than simple scaling from paper gliders would predict.

Finally, we compute what wing shape a human would need to glide like the squirrel. Spoiler: a 70 kg human with a glide ratio of 2.5 would need a patagium area of roughly 12 square metres and would have to jump from 100-metre trees. Wingsuits approximate this, achieving glide ratios of 2.5-3.5 with fabric areas of 3-5 square metres by flying at much higher speeds (200 km/h vs the squirrel's 30 km/h).`,
      analogy: 'This synthesis is like the final chapter of a detective novel. Each previous lesson was a clue: the parameter space, the physics, the data, the CG sensitivity, the ranking. Now we put all the clues together to see the complete picture. The "mystery" is not who did it, but how nature designed a glider that sacrifices peak performance for forest survival, and how human engineering (wingsuits, paragliders) solves the same problem differently.',
      storyConnection: 'Biren watched the squirrel "make one final glide, a long, sweeping arc that carried her from the tallest tree to a hollow fifty metres away." That 50-metre glide from a 20-metre tree is a glide ratio of 2.5. Our paper gliders, at smaller scale, achieve higher ratios (3.0+) in still air. But they cannot turn, cannot brake, and cannot land on a vertical trunk. The squirrel is the superior engineer because it solves the harder problem.',
      checkQuestion: 'A wingsuit flyer achieves a glide ratio of 3.0 at 200 km/h. A flying squirrel achieves 2.5 at 30 km/h. Which is more efficient in terms of energy per metre of horizontal travel?',
      checkAnswer: 'The squirrel is far more efficient. Energy per metre = drag force * distance / distance = drag force. Drag = 0.5 * rho * v^2 * A * CD. At 200 km/h the wingsuit drag is roughly 50 times higher than the squirrel drag at 30 km/h (drag scales as v^2, and the wingsuit has a larger frontal area). Despite similar glide ratios, the wingsuit burns energy roughly 50 times faster. The squirrel achieves comparable geometry with a fraction of the energy because it flies slowly.',
      codeIntro: 'Generate the comprehensive design space map, Reynolds number analysis, and human-scale comparison.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# CAPSTONE SYNTHESIS: Complete Design Space
# ============================================================

rho = 1.225; g_val = 9.81; mu_air = 1.81e-5  # air viscosity

def theoretical_GR(AR, WL, CD0=0.05, e=0.7):
    """Theoretical max glide ratio for given AR and wing loading."""
    CL_opt = np.sqrt(CD0 * np.pi * e * AR)
    CD_opt = 2 * CD0
    return CL_opt / CD_opt

def reynolds_number(velocity, chord_m):
    """Reynolds number for flow over wing."""
    return rho * velocity * chord_m / mu_air

# Design space grid
AR_grid = np.linspace(0.5, 8, 100)
WL_grid = np.linspace(0.5, 50, 100)
AR_mesh, WL_mesh = np.meshgrid(AR_grid, WL_grid)
GR_mesh = np.vectorize(theoretical_GR)(AR_mesh, WL_mesh)

# Our designs + squirrel + wingsuit
points = [
    ('Wide & Short',     3.0, 1.63, 3.12, '#3b82f6', 'o'),
    ('Narrow & Long',    1.5, 3.27, 2.08, '#22c55e', 'o'),
    ('Heavy Nose',       2.2, 3.57, 2.60, '#f59e0b', 'o'),
    ('Light & Flat',     1.83, 1.49, 2.40, '#ef4444', 'o'),
    ('Flying Squirrel',  1.7, 24.5, 2.5, '#f59e0b', '*'),
    ('Wingsuit',         2.0, 35.0, 3.0, '#a855f7', '*'),
    ('Paraglider',       5.5, 4.0, 8.0, '#ec4899', '*'),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Capstone Synthesis: From Paper Glider to Patagium',
             color='white', fontsize=15, fontweight='bold')

# 1. Design space heatmap
ax = axes[0, 0]; ax.set_facecolor('#111827')
cf = ax.contourf(AR_mesh, WL_mesh, GR_mesh, levels=20, cmap='viridis')
plt.colorbar(cf, ax=ax, label='Max glide ratio')
for name, ar, wl, gr, color, marker in points:
    size = 200 if marker == '*' else 80
    ax.scatter(ar, wl, color=color, s=size, marker=marker,
               edgecolors='white', linewidth=1.5, zorder=5)
    ax.annotate(name, (ar, wl), textcoords="offset points",
                xytext=(5, 5), color='white', fontsize=7)
ax.set_xlabel('Aspect ratio', color='white')
ax.set_ylabel('Wing loading (N/m^2)', color='white')
ax.set_title('Design Space Map', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Reynolds number comparison
ax = axes[0, 1]; ax.set_facecolor('#111827')
flyers = [
    ('Paper glider\\\n(Wide & Short)', 3.0, 0.10, '#3b82f6'),
    ('Paper glider\\\n(Narrow & Long)', 3.0, 0.10, '#22c55e'),
    ('Flying squirrel', 8.5, 0.15, '#f59e0b'),
    ('Sugar glider', 6.0, 0.08, '#ef4444'),
    ('Wingsuit', 55.0, 0.60, '#a855f7'),
    ('Paraglider', 12.0, 2.50, '#ec4899'),
]
re_vals = [reynolds_number(v, c) for _, v, c, _ in flyers]
names_re = [f[0] for f in flyers]
colors_re = [f[3] for f in flyers]
bars = ax.barh(names_re, [r/1000 for r in re_vals], color=colors_re, height=0.5)
for bar, re in zip(bars, re_vals):
    regime = 'Laminar' if re < 50000 else 'Transitional' if re < 500000 else 'Turbulent'
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'Re={re/1000:.0f}k ({regime})', va='center', color='white', fontsize=8)
ax.set_xlabel('Reynolds number (thousands)', color='white')
ax.set_title('Reynolds Number: Aerodynamic Regime', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. Glide ratio comparison across scales
ax = axes[0, 2]; ax.set_facecolor('#111827')
all_flyers = [
    ('Paper (best)', 3.12, '#3b82f6'),
    ('Flying squirrel', 2.5, '#f59e0b'),
    ('Colugo', 3.5, '#22c55e'),
    ('Flying fish', 1.5, '#ef4444'),
    ('Wingsuit', 3.0, '#a855f7'),
    ('Hang glider', 15.0, '#ec4899'),
    ('Paraglider', 8.0, '#3b82f6'),
    ('Albatross', 20.0, '#22c55e'),
]
names_f = [f[0] for f in all_flyers]
grs_f = [f[1] for f in all_flyers]
colors_f = [f[2] for f in all_flyers]
sorted_f = sorted(zip(names_f, grs_f, colors_f), key=lambda x: x[1])
bars = ax.barh([s[0] for s in sorted_f], [s[1] for s in sorted_f],
               color=[s[2] for s in sorted_f], height=0.5)
for bar, (_, gr, _) in zip(bars, sorted_f):
    ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
            f'{gr:.1f}', va='center', color='white', fontsize=10)
ax.set_xlabel('Glide ratio', color='white')
ax.set_title('Glide Ratio Across Nature & Engineering', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 4. Human wingsuit calculation
ax = axes[1, 0]; ax.set_facecolor('#111827')
human_mass = 70  # kg
target_GR = np.array([1.5, 2.0, 2.5, 3.0, 3.5])
# Required CL for glide: CL = 2*m*g / (rho * v^2 * A * GR) approximately
# Simplify: for GR = L/D, need specific A and v
speeds = np.linspace(20, 70, 100)  # m/s
for gr, color in zip([2.0, 2.5, 3.0], ['#3b82f6', '#f59e0b', '#ef4444']):
    # Required wing area: A = 2*m*g / (rho * v^2 * CL_needed)
    # For target GR, CL_needed ~ sqrt(CD0 * pi * e * AR) at best L/D
    # Approximate: A = 2*m*g*GR / (rho * v^2 * GR^2) ... simplified
    CL_target = 0.6  # typical for fabric wing
    A_needed = 2 * human_mass * g_val / (rho * speeds**2 * CL_target)
    ax.plot(speeds * 3.6, A_needed, color=color, linewidth=2,
            label=f'GR={gr}')

ax.axhspan(3, 5, alpha=0.15, color='#a855f7')
ax.text(250, 3.5, 'Wingsuit range', color='#a855f7', fontsize=9)
ax.set_xlabel('Flight speed (km/h)', color='white')
ax.set_ylabel('Required wing area (m^2)', color='white')
ax.set_title('Human Glider: Wing Area vs Speed', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.set_ylim(0, 15)
ax.tick_params(colors='gray')

# 5. Energy efficiency comparison
ax = axes[1, 1]; ax.set_facecolor('#111827')
# Drag power = D * v = 0.5 * rho * v^3 * A * CD
systems = [
    ('Paper glider', 3.0, 0.003, 0.08),  # v, A, CD
    ('Flying squirrel', 8.5, 0.06, 0.12),
    ('Wingsuit', 55.0, 4.0, 0.30),
    ('Paraglider', 12.0, 25.0, 0.05),
]
powers = []
for name, v, A, CD in systems:
    P = 0.5 * rho * v**3 * A * CD
    powers.append(P)

names_p = [s[0] for s in systems]
colors_p = ['#3b82f6', '#f59e0b', '#a855f7', '#ec4899']
bars = ax.bar(names_p, powers, color=colors_p, width=0.5)
for bar, p in zip(bars, powers):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(powers)*0.02,
            f'{p:.1f} W', ha='center', color='white', fontsize=10)
ax.set_ylabel('Drag power (Watts)', color='white')
ax.set_title('Energy Cost of Gliding', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 6. Final summary
ax = axes[1, 2]; ax.set_facecolor('#111827'); ax.axis('off')
summary = """Capstone Findings
========================

1. High aspect ratio gives the
   best glide ratio for paper
   gliders in calm air.

2. CG position is the most
   sensitive tuning parameter.

3. The flying squirrel uses LOW
   AR (1.7) for manoeuvrability,
   not maximum range.

4. Reynolds number matters:
   paper gliders and squirrels
   operate in different flow
   regimes, so results don't
   scale linearly.

5. A human wingsuit mimics the
   squirrel's GR (2.5-3.0) but
   at 10x the speed and 50x
   the energy cost.

Best design depends on mission.
Nature optimises for survival.
Engineers optimise for specs."""

ax.text(0.05, 0.95, summary, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Capstone complete.")
print("You have explored the full arc from paper to patagium:")
print("  1. Defined design parameters")
print("  2. Built a physics engine")
print("  3. Designed and ran experiments")
print("  4. Tuned weight distribution")
print("  5. Identified the best design and why")
print("  6. Connected paper gliders to flying squirrel evolution")
print()
print("The flying squirrel is not the best glider.")
print("It is the best FOREST glider. That distinction is everything.")`,
      challenge: 'Design a paper glider that optimises for the squirrel mission: launch from 2.5 m, must pass through a 50 cm wide "gap" (two chairs placed 1 metre from launch), then turn left, then land within a 30 cm circle target. Test it 10 times. Which matters more for this mission: range or manoeuvrability? Does your optimal design look more like "Wide & Short" or more like the squirrel?',
      successHint: 'You have completed a full engineering project cycle: define, model, build, test, analyse, and connect to nature. The most important takeaway is that the flying squirrel of Hollongapar is not an inferior glider. It is a superior forest navigator, and the difference between those two statements is the difference between naive benchmarking and real engineering insight.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Glide Path Optimizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (aerodynamics & ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to test paper glider designs for maximum distance. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}
