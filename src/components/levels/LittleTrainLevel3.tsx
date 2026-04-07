import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleTrainLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Steam engine thermodynamic cycle',
      concept: `A steam locomotive converts chemical energy (coal) to thermal energy (steam) to mechanical energy (piston motion) to kinetic energy (wheel rotation). The overall efficiency is only 8–10%.

The **Carnot limit** sets the theoretical maximum: η_max = 1 − T_cold/T_hot. For a boiler at 200°C (473 K) exhausting at 100°C (373 K): η_max = 1 − 373/473 = 21%. Real engines achieve less than half this due to incomplete combustion, heat radiation, and friction losses.

Narrow-gauge hill trains face additional challenges: altitude reduces air density (less oxygen for combustion), steep grades demand maximum power continuously, and sharp curves add drag.`,
      analogy: 'A steam locomotive is a teakettle on wheels — it boils water to make steam, but most of the heat escapes through the chimney, just like most of the steam from a kettle dissipates into the kitchen without doing useful work.',
      storyConnection: 'Bogi’s patched boiler in the story is not just charm — a real boiler must contain 15 atmospheres of pressure. Fourteen patches mean fourteen places where the pressure nearly won. Every hill train journey is a thermodynamic battle between the energy in coal and the losses along the way.',
      checkQuestion: 'Why are diesel and electric locomotives more efficient than steam?',
      checkAnswer: 'Diesel engines operate at higher temperatures and pressures (30–40% efficiency). Electric motors have no thermal cycle at all — they convert electricity to motion at 85–95% efficiency. Steam engines waste most energy as heat in the exhaust and through the boiler walls.',
      codeIntro: 'Model the Carnot efficiency limit and compare it to real engine performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carnot efficiency vs hot-side temperature
T_cold = 373  # K (100°C exhaust)
T_hot = np.linspace(400, 900, 200)  # K
carnot_eff = (1 - T_cold / T_hot) * 100  # percent

# Real engine efficiencies
real_steam = carnot_eff * 0.40  # steam achieves ~40% of Carnot
real_diesel = np.full_like(T_hot, 35)  # diesel is roughly constant
real_electric = np.full_like(T_hot, 90)  # electric motor efficiency

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(T_hot - 273, carnot_eff, color='#ef4444', linewidth=2, label='Carnot limit')
ax1.plot(T_hot - 273, real_steam, color='#f59e0b', linewidth=2, label='Real steam engine')
ax1.fill_between(T_hot - 273, real_steam, carnot_eff, alpha=0.1, color='#ef4444')
ax1.axhline(35, color='#3b82f6', linewidth=1.5, linestyle='--', label='Diesel engine')
ax1.axhline(90, color='#22c55e', linewidth=1.5, linestyle='--', label='Electric motor')
ax1.axvline(200, color='#f59e0b', linewidth=1, linestyle=':', alpha=0.5)
ax1.text(205, 5, 'Typical boiler\\\n200°C', color='#f59e0b', fontsize=8)
ax1.set_xlabel('Hot-side temperature (°C)', color='white')
ax1.set_ylabel('Efficiency (%)', color='white')
ax1.set_title('Thermodynamic Efficiency Limits', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Energy flow Sankey-style bar chart
ax2.set_facecolor('#111827')
stages = ['Coal\\\n(chemical)', 'Boiler\\\n(thermal)', 'Cylinder\\\n(pressure)', 'Wheels\\\n(kinetic)']
energies = [100, 85, 25, 8]
losses = [0, 15, 60, 17]
colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

bars = ax2.bar(stages, energies, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, e in zip(bars, energies):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
             f'{e}%', ha='center', va='bottom', color='white', fontsize=10, fontweight='bold')

ax2.set_ylabel('Energy remaining (%)', color='white')
ax2.set_title('Energy Flow in a Steam Locomotive', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 115)

plt.tight_layout()
plt.show()

print("Steam engine energy analysis:")
print(f"  Coal input: 100% chemical energy")
print(f"  After boiler: 85% (15% lost to flue gases, radiation)")
print(f"  After cylinder: 25% (60% lost as exhaust steam)")
print(f"  At wheels: 8% (17% lost to friction, auxiliary systems)")
print(f"  Carnot limit at 200°C/100°C: {(1 - 373/473)*100:.1f}%")`,
      challenge: 'Add a superheater that raises steam temperature to 350°C before entering the cylinder. Recalculate the Carnot limit and estimate the new real efficiency. How much improvement does superheating give? (Historical answer: it roughly doubled the efficiency of steam engines.)',
      successHint: 'Understanding thermodynamic limits is why the world moved from steam to diesel to electric. Each step captured more of the available energy.',
    },
    {
      title: 'Grade resistance and adhesion limits',
      concept: `The force needed to pull a train uphill is **F_grade = m × g × sin(θ)**. For a small angle, sin(θ) ≈ gradient/100.

At 3% grade, a 100-tonne train needs: 100,000 × 9.81 × 0.03 = 29,430 N ≈ 29.4 kN just to overcome gravity. Add rolling resistance (~1 kN) and curve resistance, and you approach the adhesion limit.

**Adhesion limit**: TE_max = μ × weight on drivers. With μ = 0.30 and 20 tonnes on driving wheels: TE_max = 58,860 N. The train can only climb until grade resistance equals this. Beyond that, wheels slip.`,
      analogy: 'Grade resistance is like pushing a shopping cart up a car park ramp. A gentle ramp is easy; a steep ramp requires your full weight leaning into the handle. At some steepness, you simply cannot push hard enough — your shoes slip on the concrete.',
      storyConnection: 'Bogi’s small wheels and patched boiler make her power-limited, but her narrow gauge and light weight make her adhesion-efficient. Every tonne of Bogi is working — unlike a broad-gauge express where the heavy, non-driving coaches are dead weight on a climb.',
      checkQuestion: 'A 50-tonne train on a 3% grade with 20 tonnes on driving wheels. Can it climb? What is the maximum grade?',
      checkAnswer: 'Grade force: 50,000 × 9.81 × 0.03 = 14,715 N. TE available: 0.30 × 20,000 × 9.81 = 58,860 N. Yes, with 4× margin. Maximum grade: TE/(m×g) = 58,860/(50,000×9.81) = 12%. Wheels slip at about 12% grade — well above what adhesion railways attempt.',
      codeIntro: 'Calculate the adhesion-limited maximum gradient for different train configurations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Train parameters
total_mass = 50000  # kg (50 tonnes)
g = 9.81
driver_fractions = [0.3, 0.4, 0.5, 0.6, 0.8, 1.0]  # fraction of weight on drivers
mu_values = {'Dry rail': 0.30, 'Damp rail': 0.20, 'Wet rail': 0.15, 'Leaves': 0.05}
colors_mu = {'Dry rail': '#22c55e', 'Damp rail': '#3b82f6', 'Wet rail': '#f59e0b', 'Leaves': '#ef4444'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Left: grade resistance vs gradient for different train weights
ax1.set_facecolor('#111827')
gradients_pct = np.linspace(0, 10, 200)  # percent
for mass, color, label in [(30000, '#22c55e', '30t'), (50000, '#3b82f6', '50t'),
                            (80000, '#f59e0b', '80t'), (150000, '#ef4444', '150t')]:
    force = mass * g * gradients_pct / 100 / 1000  # kN
    ax1.plot(gradients_pct, force, color=color, linewidth=2, label=f'{label} train')

# Mark adhesion limits (for 50t train, 40% on drivers)
te_dry = 0.30 * 0.4 * total_mass * g / 1000
ax1.axhline(te_dry, color='#22c55e', linestyle='--', linewidth=1, alpha=0.7)
ax1.text(0.5, te_dry + 1, f'TE limit (dry): {te_dry:.0f} kN', color='#22c55e', fontsize=8)

ax1.set_xlabel('Gradient (%)', color='white')
ax1.set_ylabel('Grade resistance (kN)', color='white')
ax1.set_title('Grade Resistance vs Gradient', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Right: maximum gradient vs friction coefficient
ax2.set_facecolor('#111827')
for frac in driver_fractions:
    max_grades = []
    mu_range = np.linspace(0.05, 0.40, 100)
    for mu in mu_range:
        # TE = mu * frac * m * g; Grade resistance = m * g * sin(theta)
        # At limit: mu * frac = sin(theta) ~ gradient/100
        max_grade = mu * frac * 100  # percent
        max_grades.append(max_grade)
    ax2.plot(mu_range, max_grades, linewidth=2, label=f'{frac*100:.0f}% on drivers')

# Mark real conditions
for label, mu in mu_values.items():
    ax2.axvline(mu, color=colors_mu[label], linestyle=':', linewidth=1, alpha=0.5)
    ax2.text(mu + 0.005, 1, label, color=colors_mu[label], fontsize=7, rotation=90)

ax2.set_xlabel('Friction coefficient (μ)', color='white')
ax2.set_ylabel('Maximum gradient (%)', color='white')
ax2.set_title('Adhesion-Limited Max Gradient', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Adhesion analysis for 50-tonne train:")
for label, mu in mu_values.items():
    for frac in [0.4, 0.6, 1.0]:
        max_g = mu * frac * 100
        print(f"  {label} (μ={mu}), {frac*100:.0f}% on drivers: max grade = {max_g:.1f}%")`,
      challenge: 'Add a sand dispenser that increases μ by 0.10 when activated. Plot the improvement in maximum gradient. At what gradient does sand become essential (i.e., the train would stall on wet rails without it)?',
      successHint: 'Adhesion is the fundamental constraint of all rail transport. Understanding this limit explains why mountain railways exist the way they do.',
    },
    {
      title: 'Curve resistance and superelevation',
      concept: `On a curve, a train’s inertia tries to push it outward (centrifugal effect). The required centripetal acceleration is **a = v²/R**.

Engineers tilt the outer rail higher (**superelevation**) to balance this force: **tan(θ) = v²/(g × R)**. There is a single “balance speed” where the tilt perfectly cancels the centrifugal effect.

Narrow-gauge hill railways face extreme curves (R < 100 m), requiring speed limits of 15–25 km/h. Curve resistance adds approximately **Fc = 700/R** Newtons per tonne, which is significant at small radii.`,
      analogy: 'Superelevation is a velodrome track for trains. Just as a cyclist banks into a turn on a tilted velodrome, the tilted rail lets gravity help the train around the curve instead of the wheel flanges grinding against the rail.',
      storyConnection: 'Every curve on Bogi’s route is a physics problem. The 18-metre radius curves on the Darjeeling railway demand extreme precision — too fast and the train derails outward; too slow on a superelevated curve and it leans inward dangerously.',
      checkQuestion: 'A curve has R = 50 m and 100 mm superelevation on 1,000 mm gauge. What is the maximum safe speed?',
      checkAnswer: 'v = √(g × R × superelevation/gauge) = √(9.81 × 50 × 0.1) = 7.0 m/s = 25 km/h. Exceeding this risks the outer flange climbing the rail and causing derailment.',
      codeIntro: 'Calculate safe speeds on curves and visualise superelevation requirements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Curve analysis
radii = np.linspace(20, 500, 200)  # metres
g = 9.81

# Superelevation for different speeds
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
gauge = 1.0  # metres (narrow gauge ~0.61, standard 1.435)
speeds_kmh = [10, 15, 20, 25, 30, 40]
colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ec4899']

for speed, color in zip(speeds_kmh, colors):
    v = speed / 3.6  # m/s
    # superelevation = gauge * v^2 / (g * R)
    superelev = gauge * v**2 / (g * radii) * 1000  # mm
    ax1.plot(radii, superelev, color=color, linewidth=2, label=f'{speed} km/h')

ax1.axhline(150, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax1.text(400, 155, 'Max practical superelevation: 150 mm', color='gray', fontsize=8)
ax1.set_xlabel('Curve radius (m)', color='white')
ax1.set_ylabel('Required superelevation (mm)', color='white')
ax1.set_title('Superelevation vs Curve Radius', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 300)

# Right: curve resistance per tonne
ax2.set_facecolor('#111827')
curve_resist = 700 / radii  # N per tonne (approximate formula)
grade_equiv = curve_resist / (g * 10)  # equivalent gradient in percent

ax2.plot(radii, curve_resist, color='#ef4444', linewidth=2, label='Curve resistance (N/tonne)')
ax2.fill_between(radii, curve_resist, alpha=0.1, color='#ef4444')

# Mark notable curves
notable = [(18, 'Darjeeling\\\nmin R'), (50, 'Typical\\\nhill'), (200, 'Mainline\\\ncurve')]
for r, label in notable:
    resist = 700 / r
    ax2.plot(r, resist, 'o', color='#f59e0b', markersize=8)
    ax2.annotate(f'{label}\\\n{resist:.0f} N/t', xy=(r, resist),
                 xytext=(r + 30, resist + 3), color='#f59e0b', fontsize=8,
                 arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Curve radius (m)', color='white')
ax2.set_ylabel('Curve resistance (N per tonne)', color='white')
ax2.set_title('Curve Resistance on Mountain Railways', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Curve resistance analysis:")
for r in [18, 50, 100, 200, 500]:
    cr = 700 / r
    grade_eq = cr / g / 10
    print(f"  R={r}m: curve resistance = {cr:.1f} N/tonne = equivalent to {grade_eq:.2f}% grade")
print("\\\nAt R=18m (Darjeeling), curve resistance alone equals a 0.40% grade!")`,
      challenge: 'Model a complete curve: combine grade resistance, curve resistance, and rolling resistance to find the total force on a 50-tonne train negotiating a 50 m radius curve on a 3% grade. What speed maximises throughput (tonnes per hour)?',
      successHint: 'Every curve on a mountain railway is a compromise between speed (which generates centrifugal force) and gradient (which demands tractive effort). Balancing these is the art of railway engineering.',
    },
    {
      title: 'Braking on mountain descents',
      concept: `Going downhill, gravity accelerates the train. Without braking, a train on a 3% grade would reach dangerous speeds within minutes.

Mountain railways use **three braking systems**:
1. **Friction brakes**: brake shoes press against wheels. Limited by heat buildup — on long descents, brakes can fade.
2. **Dynamic (rheostatic) braking**: motors act as generators, converting kinetic energy to electrical energy dissipated as heat in resistors.
3. **Regenerative braking**: same as dynamic, but feeds electricity back to the grid. Modern mountain railways recover 20–30% of energy.

The key equation: braking distance = v² / (2 × deceleration). On a downhill grade, effective deceleration is reduced by the grade component.`,
      analogy: 'Mountain braking is like cycling down a hill while squeezing the brakes — you feel the rims heat up. If you ride the brakes too long on a very long hill, the pads overheat and lose grip. This is exactly what happens to train brakes on long descents, which is why multiple independent systems are essential.',
      storyConnection: 'The express in the story flies through the hills on a broad-gauge line with tunnels and viaducts — but coming down, its enormous weight and speed make braking the critical challenge. Bogi’s advantage is her low speed and light weight: she barely needs to brake at all.',
      checkQuestion: 'A 100-tonne train at 30 km/h on a 3% downhill grade. What braking force is needed to stop in 200 m?',
      checkAnswer: 'v = 30/3.6 = 8.33 m/s. KE = 0.5 × 100,000 × 8.33² = 3,472,222 J. Grade force (accelerating) = 100,000 × 9.81 × 0.03 = 29,430 N over 200 m = 5,886,000 J. Total energy to absorb = 3,472,222 + 5,886,000 = 9,358,222 J. Brake force = 9,358,222 / 200 = 46,791 N = 46.8 kN.',
      codeIntro: 'Model braking distances and heat buildup on long mountain descents.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Braking analysis
mass = 100000  # kg (100 tonnes)
g = 9.81

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Left: braking distance vs speed at different grades
ax1.set_facecolor('#111827')
speeds = np.linspace(5, 50, 100)  # km/h
v_ms = speeds / 3.6
brake_decel = 0.5  # m/s^2 (typical service braking)

for grade, color, ls in [(0, '#22c55e', '-'), (2, '#3b82f6', '-'),
                          (4, '#f59e0b', '-'), (6, '#ef4444', '--')]:
    # Effective deceleration = brake_decel - g * grade/100
    eff_decel = brake_decel - g * grade / 100
    # If eff_decel <= 0, brakes cannot stop the train!
    safe = eff_decel > 0
    if safe:
        dist = v_ms**2 / (2 * eff_decel)
        ax1.plot(speeds, dist, color=color, linewidth=2, linestyle=ls,
                 label=f'{grade}% downhill (a_eff={eff_decel:.2f} m/s²)')
    else:
        ax1.axhline(0, color=color, linewidth=2, linestyle='--',
                     label=f'{grade}% — brakes insufficient!')

ax1.set_xlabel('Speed (km/h)', color='white')
ax1.set_ylabel('Braking distance (m)', color='white')
ax1.set_title('Braking Distance on Grades', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 2000)

# Right: brake temperature over a long descent
ax2.set_facecolor('#111827')
descent_km = np.linspace(0, 10, 500)  # km
descent_m = descent_km * 1000

# Heat generated = (grade force - drag) * distance
grade_pct = 3  # percent
grade_force = mass * g * grade_pct / 100  # N
brake_force = grade_force * 0.95  # braking absorbs most
brake_mass = 500  # kg of brake material
specific_heat = 500  # J/(kg·K) for cast iron

# Temperature rise
heat_per_metre = brake_force  # J/m
temp_rise = heat_per_metre * descent_m / (brake_mass * specific_heat)
base_temp = 20  # °C ambient
brake_temp = base_temp + temp_rise

# With regenerative braking (absorbs 30% of energy electrically)
brake_temp_regen = base_temp + temp_rise * 0.7

ax2.plot(descent_km, brake_temp, color='#ef4444', linewidth=2, label='Friction brakes only')
ax2.plot(descent_km, brake_temp_regen, color='#22c55e', linewidth=2, label='With regenerative (30%)')
ax2.axhline(400, color='#f59e0b', linestyle='--', linewidth=1, label='Brake fade threshold (400°C)')
ax2.fill_between(descent_km, 400, brake_temp, where=brake_temp > 400,
                  alpha=0.2, color='#ef4444')

ax2.set_xlabel('Distance descended (km)', color='white')
ax2.set_ylabel('Brake temperature (°C)', color='white')
ax2.set_title('Brake Heating on Long Descent', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

fade_dist = (400 - base_temp) * brake_mass * specific_heat / heat_per_metre / 1000
regen_fade = fade_dist / 0.7
print(f"100-tonne train, 3% grade:")
print(f"  Brake fade starts at: {fade_dist:.1f} km (friction only)")
print(f"  With regenerative braking: {regen_fade:.1f} km before fade")
print(f"  Regenerative braking extends safe descent by {regen_fade - fade_dist:.1f} km")`,
      challenge: 'Add a cooling model where brakes lose heat to the air proportional to (brake_temp - ambient). Find the equilibrium temperature for different descent speeds. Is there a speed at which brakes never overheat?',
      successHint: 'Braking is the most safety-critical system on any mountain railway. Understanding heat buildup is literally a life-or-death calculation.',
    },
    {
      title: 'Timetable scheduling on single-track lines',
      concept: `Most mountain railways are **single-track** with passing loops where trains can cross. Two trains cannot share a section simultaneously.

This is a **job-shop scheduling problem**: assign time slots to trains on shared track sections. Constraints include minimum headway, section running times, and dwell times at stations.

A **greedy algorithm** (priority to the train closest to a passing loop) gives feasible solutions. **Integer programming** finds the optimal timetable by minimising total delay.`,
      analogy: 'Scheduling on single track is like air traffic control for a narrow corridor — two planes cannot use the same runway at the same time, so a controller must sequence arrivals and departures with precise timing.',
      storyConnection: 'Bogi shares her track with the occasional goods train. In the story, the express gets priority on the new broad-gauge line, but on the old narrow-gauge, Bogi must carefully time her journey to avoid conflicts at the limited passing loops.',
      checkQuestion: 'Two trains approach a single-track section from opposite sides. Who waits?',
      checkAnswer: 'The train nearest to a passing loop waits, minimising total delay. If both are equidistant, the faster or higher-priority train goes first.',
      codeIntro: 'Simulate single-track scheduling with passing loops.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Single-track railway simulation
# 5 stations, 4 sections, 2 passing loops
stations = ['New Jalpaiguri', 'Sukna', 'Kurseong', 'Ghum', 'Darjeeling']
distances = [0, 11, 32, 51, 55]  # km (cumulative)
section_times = [45, 80, 70, 25]  # minutes per section
passing_loops = [1, 3]  # station indices where trains can pass

# Simulate 3 uphill and 2 downhill trains
np.random.seed(42)
n_up, n_down = 3, 2
up_departs = sorted(np.random.choice(range(0, 480, 30), n_up, replace=False))
down_departs = sorted(np.random.choice(range(60, 540, 30), n_down, replace=False))

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Plot uphill trains (time-distance diagram)
for i, dep in enumerate(up_departs):
    times = [dep]
    for st in section_times:
        times.append(times[-1] + st + np.random.randint(0, 10))  # add dwell time
    ax.plot(times, distances, color='#22c55e', linewidth=2,
            marker='o', markersize=4, label='Uphill' if i == 0 else '')
    ax.text(times[0] - 10, distances[0] - 2, f'U{i+1}', color='#22c55e', fontsize=9)

# Plot downhill trains
for i, dep in enumerate(down_departs):
    times = [dep]
    for st in reversed(section_times):
        times.append(times[-1] + int(st * 0.8) + np.random.randint(0, 8))
    ax.plot(times, list(reversed(distances)), color='#ef4444', linewidth=2,
            marker='s', markersize=4, label='Downhill' if i == 0 else '')
    ax.text(times[0] - 10, distances[-1] + 2, f'D{i+1}', color='#ef4444', fontsize=9)

# Mark passing loops
for idx in passing_loops:
    ax.axhline(distances[idx], color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
    ax.text(5, distances[idx] + 1, f'Passing loop: {stations[idx]}', color='#f59e0b', fontsize=8)

# Station labels
for name, dist in zip(stations, distances):
    ax.text(550, dist, name, color='white', fontsize=9, va='center')

ax.set_xlabel('Time (minutes from midnight)', color='white')
ax.set_ylabel('Distance from NJP (km)', color='white')
ax.set_title('Time-Distance Diagram: Darjeeling Himalayan Railway', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlim(0, 600)

plt.tight_layout()
plt.show()

print("Single-track scheduling analysis:")
print(f"  {n_up} uphill + {n_down} downhill trains")
print(f"  Passing loops at: {', '.join(stations[i] for i in passing_loops)}")
print(f"  Total journey time (up): ~{sum(section_times)} min = {sum(section_times)/60:.1f} hours")
print("  Conflicts must be resolved by holding trains at passing loops")`,
      challenge: 'Detect conflicts (where an uphill and downhill train occupy the same section simultaneously) and resolve them by delaying one train at a passing loop. Minimise total delay across all trains.',
      successHint: 'Railway scheduling is one of the oldest and most important combinatorial optimisation problems — and it is still an active area of research today.',
    },
    {
      title: 'Energy-optimal driving strategies',
      concept: `A skilled driver alternates between **power** and **coasting** to minimise fuel consumption while staying on schedule.

On descents, gravitational potential energy converts to kinetic energy for free. On flat sections, the train can coast (engine off) and slowly decelerate due to rolling resistance.

The optimal strategy uses **dynamic programming**: at each point, decide whether to power, coast, or brake to minimise total fuel while meeting the timetable. Good drivers save 15–20% fuel.`,
      analogy: 'Efficient driving is like cycling — you pedal hard uphill, coast downhill, and time your effort to arrive without wasting energy on unnecessary braking.',
      storyConnection: 'Bogi’s driver knows every metre of the route — where to open the regulator, where to coast, where the descent begins. This accumulated knowledge is human-optimised driving, and it takes years to master.',
      checkQuestion: 'The train is running 5 minutes early approaching a descent. Should the driver slow down or coast?',
      checkAnswer: 'Coast. Convert the time surplus into fuel savings. Arrive closer to schedule while using zero fuel on the descent. Only brake if speed becomes unsafe.',
      codeIntro: 'Model the energy cost of a complete mountain railway journey.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Route profile: elevation vs distance
distance_km = np.array([0, 5, 11, 18, 25, 32, 38, 44, 51, 55])
elevation_m = np.array([100, 300, 600, 900, 1200, 1483, 1700, 1950, 2258, 2076])
station_names = ['NJP', '', 'Sukna', '', '', 'Kurseong', '', '', 'Ghum', 'Darj.']

# Compute gradient per segment
n_seg = len(distance_km) - 1
gradients = np.diff(elevation_m) / (np.diff(distance_km) * 1000) * 100  # percent

# Energy model
mass = 40000  # kg (40 tonnes total)
g = 9.81
mu_roll = 0.002  # rolling resistance coefficient

# Energy per segment
energy_grade = []  # MJ
energy_roll = []
for i in range(n_seg):
    seg_len = (distance_km[i+1] - distance_km[i]) * 1000  # metres
    elev_change = elevation_m[i+1] - elevation_m[i]
    # Grade energy (positive = climbing, negative = descending)
    e_grade = mass * g * elev_change / 1e6  # MJ
    # Rolling resistance energy
    e_roll = mu_roll * mass * g * seg_len / 1e6  # MJ
    energy_grade.append(e_grade)
    energy_roll.append(e_roll)

energy_grade = np.array(energy_grade)
energy_roll = np.array(energy_roll)
energy_total = energy_grade + energy_roll

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Top left: elevation profile
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(distance_km, elevation_m, color='#22c55e', linewidth=2.5)
ax.fill_between(distance_km, elevation_m, alpha=0.15, color='#22c55e')
for d, e, name in zip(distance_km, elevation_m, station_names):
    if name:
        ax.plot(d, e, 'o', color='#f59e0b', markersize=6)
        ax.text(d, e + 80, name, color='#f59e0b', fontsize=8, ha='center')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('Route Profile: NJP to Darjeeling', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Top right: gradient per segment
ax = axes[0, 1]; ax.set_facecolor('#111827')
seg_midpoints = (distance_km[:-1] + distance_km[1:]) / 2
colors_g = ['#22c55e' if g > 0 else '#ef4444' for g in gradients]
ax.bar(seg_midpoints, gradients, width=3, color=colors_g, alpha=0.8)
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Gradient (%)', color='white')
ax.set_title('Gradient per Section', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Bottom left: energy breakdown per segment
ax = axes[1, 0]; ax.set_facecolor('#111827')
x = np.arange(n_seg)
ax.bar(x - 0.15, energy_grade, 0.3, color='#3b82f6', label='Grade energy')
ax.bar(x + 0.15, energy_roll, 0.3, color='#f59e0b', label='Rolling resistance')
ax.set_xticks(x)
ax.set_xticklabels([f'{d:.0f}' for d in seg_midpoints], fontsize=8)
ax.set_xlabel('Segment midpoint (km)', color='white')
ax.set_ylabel('Energy (MJ)', color='white')
ax.set_title('Energy per Segment', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Bottom right: cumulative energy
ax = axes[1, 1]; ax.set_facecolor('#111827')
cum_grade = np.cumsum(energy_grade)
cum_roll = np.cumsum(energy_roll)
cum_total = cum_grade + cum_roll
ax.plot(distance_km[1:], cum_grade, color='#3b82f6', linewidth=2, label='Grade (climbing)')
ax.plot(distance_km[1:], cum_roll, color='#f59e0b', linewidth=2, label='Rolling resistance')
ax.plot(distance_km[1:], cum_total, color='#ef4444', linewidth=2.5, label='Total required')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Cumulative energy (MJ)', color='white')
ax.set_title('Cumulative Energy: NJP to Darjeeling', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Journey energy analysis (NJP to Darjeeling):")
print(f"  Total grade energy: {sum(energy_grade):.1f} MJ")
print(f"  Total rolling resistance: {sum(energy_roll):.1f} MJ")
print(f"  Total energy required: {sum(energy_total):.1f} MJ")
print(f"  At 8% steam efficiency: {sum(energy_total) / 0.08:.0f} MJ of coal needed")
print(f"  Coal energy density ~29 MJ/kg: ~{sum(energy_total) / 0.08 / 29:.0f} kg of coal")`,
      challenge: 'Add a coasting strategy: on the Ghum-to-Darjeeling descent (the last segment), the train can coast and recover potential energy. Calculate how much energy is saved and what fraction of the uphill climb is "free" on the way back.',
      successHint: 'Energy analysis reveals the true cost of mountain railways and explains why fuel efficiency matters so much for sustainable transport.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Data Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (physics modelling)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model railway engineering with real physics. Click to start.</p>
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
