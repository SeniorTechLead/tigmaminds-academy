import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleTrainLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Simple machines — the wheel-and-axle and inclined plane',
      concept: `The little train of the hills uses two of the six classical **simple machines** in every journey:

**Wheel and axle**: The train's wheels are larger circles (the wheel) fixed to a smaller cylinder (the axle). When the wheel turns, the axle turns too, but with greater force. The **mechanical advantage** = radius of wheel / radius of axle. A wheel with radius 45 cm on an axle of radius 5 cm gives MA = 9 — the force is multiplied 9 times.

**Inclined plane**: The hillside track itself is an inclined plane. Instead of lifting the train straight up (enormous force over a short distance), the track takes a longer, gentler path (moderate force over a longer distance). A 1-in-40 gradient means the train travels 40 metres horizontally for every 1 metre of elevation — reducing the required force by a factor of 40.

The fundamental principle: **simple machines don't reduce the total work** (force × distance is conserved). They trade force for distance. The train applies less force over a longer path to achieve the same elevation gain.

The other four simple machines — lever, pulley, wedge, screw — are also present in the train: brake levers, coupling screws, wedge-shaped rail switches, and pulley systems in the engine.`,
      analogy: 'An inclined plane is like paying in instalments instead of lump sum. Lifting a 10-tonne train straight up 100 metres requires a massive one-time payment of force. A 4 km mountain track is like spreading that payment into 4,000 small instalments — each one manageable. You pay the same total, but each individual payment is small enough that the engine can handle it.',
      storyConnection: 'The little train in the story chugs up impossible-looking gradients. In reality, narrow-gauge hill railways like the Darjeeling Himalayan Railway (a UNESCO World Heritage Site) use gradients of 1-in-29 — steep enough that conventional railways would fail. The narrow gauge (610 mm) allows tighter curves, and the small, powerful locomotives apply concentrated force through precisely engineered wheel-and-axle systems.',
      checkQuestion: 'If a train weighs 50 tonnes and the track gradient is 1-in-40, what force (in addition to friction) does the engine need to exert to keep the train moving uphill at constant speed?',
      checkAnswer: 'The gravitational component along the slope = weight × sin(angle) = weight × (1/40) for a 1-in-40 grade. Force = 50,000 kg × 9.81 m/s² × (1/40) = 12,263 N ≈ 12.3 kN. This is just the gravity component — friction, air resistance, and curve resistance add more. But the inclined plane has reduced the required force from 490,500 N (lifting straight up) to 12,263 N — a 40× reduction.',
      codeIntro: 'Visualise how an inclined plane reduces the force needed to lift a train.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Train climbing a hill: direct lift vs inclined plane
mass = 50000  # kg (50 tonnes)
g = 9.81
height = 500  # metres to climb
gradients = [1/20, 1/30, 1/40, 1/50, 1/80]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Left: force vs gradient
ax1.set_facecolor('#111827')
gradient_vals = np.linspace(1/100, 1/10, 100)
force = mass * g * gradient_vals / 1000  # kN

ax1.plot(1/gradient_vals, force, color='#22c55e', linewidth=2)
ax1.fill_between(1/gradient_vals, force, alpha=0.1, color='#22c55e')

# Mark specific gradients
for grad in gradients:
    f = mass * g * grad / 1000
    ax1.plot(1/grad, f, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(f'1-in-{1/grad:.0f}\\n{f:.1f} kN', xy=(1/grad, f),
                 xytext=(1/grad + 3, f + 2), color='#f59e0b', fontsize=8)

# Direct lift force
direct_force = mass * g / 1000
ax1.axhline(direct_force, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Direct lift: {direct_force:.0f} kN')

ax1.set_xlabel('Gradient (1 in X)', color='white')
ax1.set_ylabel('Required force (kN)', color='white')
ax1.set_title('Force Required vs Track Gradient', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Right: track profile comparison
ax2.set_facecolor('#111827')
colors_grad = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for grad, color in zip(gradients, colors_grad):
    track_length = height / grad  # metres
    x = np.linspace(0, track_length, 100) / 1000  # km
    y = np.linspace(0, height, 100)
    ax2.plot(x, y, color=color, linewidth=2, label=f'1-in-{1/grad:.0f} ({track_length/1000:.1f} km)')

ax2.set_xlabel('Horizontal distance (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title(f'Track Profiles to Climb {height}m', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climbing 500m with a 50-tonne train:")
print(f"  Direct lift: {direct_force:.0f} kN force, 500 m distance")
for grad in gradients:
    f = mass * g * grad / 1000
    d = height / grad / 1000
    work = mass * g * height / 1e6  # MJ
    print(f"  1-in-{1/grad:.0f}: {f:.1f} kN force, {d:.1f} km track")
print(f"  Total work is ALWAYS the same: {mass * g * height / 1e6:.1f} MJ")
print("  The inclined plane trades force for distance — not total work.")`,
      challenge: 'Add friction (coefficient 0.01 on rails). Friction force = μ × mass × g × cos(angle). Now the total force is gravity-component + friction. Which gradient minimises total force? (It\'s not the gentlest one — too gentle and friction over the long distance adds up!)',
      successHint: 'Simple machines are the foundation of all mechanical engineering. Every complex machine — from a train to a robot — is ultimately a combination of these six principles. Understanding force-distance trade-offs is the first step to engineering anything.',
    },
    {
      title: 'Friction and traction — why trains stay on rails',
      concept: `A train wheel is smooth steel on a smooth steel rail. That sounds like a recipe for sliding — yet trains climb mountains. How?

**Friction** is the force that resists two surfaces sliding against each other. Two types matter for trains:

**Static friction** (traction): the grip between wheel and rail that prevents slipping. This is what allows the train to push forward — the wheel pushes backward on the rail, and friction pushes the wheel (and train) forward. Newton's Third Law in action.

**Rolling friction**: the small resistance of a wheel rolling on a rail. Steel on steel has very low rolling friction (coefficient ~0.001) — this is why trains are so efficient compared to road vehicles.

The **coefficient of friction** (μ):
- Steel wheel on dry rail: μ ≈ 0.35
- Steel wheel on wet rail: μ ≈ 0.10-0.20
- Steel wheel on oily/leaf-covered rail: μ ≈ 0.05

Maximum tractive force = μ × weight on driving wheels. If the engine weighs 30 tonnes with all weight on driving wheels, and μ = 0.35:
- Max traction = 0.35 × 30,000 × 9.81 = 103 kN

Exceed this and the wheels **slip** — spinning uselessly on the rail. Hill trains use sand dispensers that drop sand on the rail to increase friction when climbing steep grades.`,
      analogy: 'Traction is like walking on ice vs concrete. On concrete (high friction), you push backward with your foot and move forward — the ground "grips" you. On ice (low friction), your foot slides backward and you fall. A train wheel that loses traction is like a shoe on ice — spinning but going nowhere. Sand on the rail is like grit on an icy path: it increases the grip.',
      storyConnection: 'The little train in the story battles rain-slicked rails on monsoon days. In reality, wet leaves on rails are a major operational hazard — the coefficient of friction drops to 0.05, and a train that could climb a 1-in-30 grade in dry conditions might stall on a 1-in-60 grade when wet. This is why the Darjeeling railway employs crew members who walk ahead of the train to clear leaves and debris from the rails.',
      checkQuestion: 'Why are train wheels steel-on-steel rather than rubber-on-steel (like car tyres)? Wouldn\'t rubber give more traction?',
      checkAnswer: 'Yes, rubber would give higher friction — but that is exactly the problem. Trains carry enormous loads over long distances. High friction means high rolling resistance, which means enormously more fuel consumption. Steel-on-steel has just enough friction for traction but very low rolling resistance, making trains 3-5× more fuel-efficient per tonne-km than trucks. The trade-off: trains need longer braking distances and cannot climb as steep grades as rubber-tyred vehicles.',
      codeIntro: 'Model how friction determines the maximum gradient a train can climb.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Traction model: max gradient = μ (for small angles)
# More precisely: max_gradient = μ * cos(θ) - sin(θ) must be positive

friction_coefficients = np.linspace(0.01, 0.40, 200)

# Max gradient (simplified for small angles: gradient ≈ μ)
# More accurately: sin(θ) / cos(θ) < μ, so tan(θ) < μ, so gradient < μ
max_gradient_ratio = 1 / np.tan(np.arctan(friction_coefficients))  # 1-in-X

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Left: max climbable gradient vs friction coefficient
ax1.set_facecolor('#111827')
ax1.plot(friction_coefficients, 1/friction_coefficients, color='#22c55e', linewidth=2)
ax1.fill_between(friction_coefficients, 1/friction_coefficients, alpha=0.1, color='#22c55e')

# Mark conditions
conditions = [
    (0.05, 'Oily/leaves', '#ef4444'),
    (0.15, 'Wet rail', '#f59e0b'),
    (0.25, 'Damp rail', '#3b82f6'),
    (0.35, 'Dry rail', '#22c55e'),
]
for mu, label, color in conditions:
    grad = 1/mu
    ax1.plot(mu, grad, 'o', color=color, markersize=10)
    ax1.annotate(f'{label}\\nμ={mu}, 1-in-{grad:.0f}', xy=(mu, grad),
                 xytext=(mu + 0.02, grad + 5), color=color, fontsize=9,
                 arrowprops=dict(arrowstyle='->', color=color))

ax1.set_xlabel('Coefficient of friction (μ)', color='white')
ax1.set_ylabel('Max gradient (1 in X)', color='white')
ax1.set_title('Maximum Climbable Gradient', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 30)

# Right: tractive effort vs speed for a hill engine
ax2.set_facecolor('#111827')
speeds_kmh = np.linspace(0, 40, 100)
engine_mass = 30000  # kg
mu_dry = 0.30
mu_wet = 0.15

# Engine power (simplified): TE = Power / speed
power_kw = 300  # kW
te_power = np.where(speeds_kmh > 0, power_kw * 1000 / (speeds_kmh / 3.6), 0)
te_adhesion_dry = engine_mass * 9.81 * mu_dry  # max TE limited by adhesion
te_adhesion_wet = engine_mass * 9.81 * mu_wet

ax2.plot(speeds_kmh, np.minimum(te_power, te_adhesion_dry) / 1000, color='#22c55e', linewidth=2, label=f'Dry (μ={mu_dry})')
ax2.plot(speeds_kmh, np.minimum(te_power, te_adhesion_wet) / 1000, color='#3b82f6', linewidth=2, label=f'Wet (μ={mu_wet})')
ax2.axhline(te_adhesion_dry / 1000, color='#22c55e', linestyle=':', linewidth=1)
ax2.axhline(te_adhesion_wet / 1000, color='#3b82f6', linestyle=':', linewidth=1)
ax2.annotate('Adhesion limit (dry)', xy=(30, te_adhesion_dry/1000 + 1), color='#22c55e', fontsize=8)
ax2.annotate('Adhesion limit (wet)', xy=(30, te_adhesion_wet/1000 + 1), color='#3b82f6', fontsize=8)

# Grade resistance lines
for grade_str, grade_val in [('1-in-25', 1/25), ('1-in-40', 1/40)]:
    train_mass = 80000  # total train mass
    grade_resistance = train_mass * 9.81 * grade_val / 1000
    ax2.axhline(grade_resistance, color='#f59e0b', linestyle='--', linewidth=1)
    ax2.annotate(f'Grade resistance ({grade_str})', xy=(5, grade_resistance + 0.5), color='#f59e0b', fontsize=8)

ax2.set_xlabel('Speed (km/h)', color='white')
ax2.set_ylabel('Tractive effort (kN)', color='white')
ax2.set_title('Tractive Effort vs Speed', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 120)

plt.tight_layout()
plt.show()

print("Traction analysis for 30-tonne hill engine:")
for mu, label, _ in conditions:
    te = engine_mass * 9.81 * mu / 1000
    max_train = te / (9.81 * 1/40) / 1000  # max train mass on 1-in-40
    print(f"  {label} (μ={mu}): max TE = {te:.0f} kN, pulls {max_train:.0f} tonnes on 1-in-40")`,
      challenge: 'Rack railways use a toothed rail (no friction limit). If a rack system can handle any gradient, what is the steepest grade a conventional adhesion train has climbed? (Answer: the Lisbon tram at 13.5%, or about 1-in-7.4.)',
      successHint: 'Friction is often treated as a nuisance in physics class, but for trains it is essential. Without friction there is no traction, no steering (flanges on wheels guide the train), and no braking. Friction is the friend that makes railways work.',
    },
    {
      title: 'Steam power basics — heat engines that moved the world',
      concept: `The original hill trains were steam-powered. A steam locomotive converts **thermal energy** (burning coal or wood) into **mechanical energy** (turning wheels) through water and pressure.

The steam engine cycle:
1. **Firebox**: coal burns, producing heat (~1,000°C)
2. **Boiler**: heat converts water to steam at high pressure (10-15 atmospheres)
3. **Cylinder**: steam expands, pushing a piston back and forth
4. **Connecting rod + crank**: converts the piston's back-and-forth (reciprocating) motion into the wheel's round-and-round (rotary) motion
5. **Exhaust**: spent steam exits the chimney, pulling fresh air through the firebox (self-sustaining draft)

**Efficiency**: A steam locomotive converts only **6-12%** of the coal's chemical energy into useful wheel-turning work. The rest is lost as:
- Exhaust heat (hot steam and gases): ~50%
- Radiation from boiler and firebox: ~15%
- Friction in moving parts: ~5%
- Incomplete combustion: ~10-15%

Despite this low efficiency, steam engines changed the world. Before steam, the only power sources were muscle (human/animal), wind, and water. Steam provided **on-demand, portable, scalable power** — and railways connected places that geography had kept isolated.`,
      analogy: 'A steam engine is like a pressure cooker driving a bicycle wheel. The heat (fire) creates pressure (steam). The pressure pushes a piston (like the cooker\'s pressure release valve, but controlled). The piston\'s push-pull moves a crank that turns the wheel. Most of the heat escapes uselessly (like the steam that fogs your kitchen), but the small fraction that does useful work is enough to move a train.',
      storyConnection: 'The little train of the hills was almost certainly steam-powered in its early days. The Darjeeling Himalayan Railway, opened in 1881, used tiny B-class 0-4-0 saddle-tank locomotives weighing just 14 tonnes — small enough for the tight curves and narrow gauge. These engines burned coal, boiled water, and pushed their way up to 2,200 metres, belching steam into the mountain mist. The romance of the hill train IS the romance of steam.',
      checkQuestion: 'A steam locomotive uses water and coal. At high altitude, water boils at a lower temperature (because of lower atmospheric pressure). How does this affect a steam engine\'s performance in the mountains?',
      checkAnswer: 'Lower boiling point means the steam is generated at lower temperature and pressure for the same boiler design. Lower pressure means less force on the piston, so the engine produces less power. At 2,000 m, water boils at about 93°C instead of 100°C. This is a real problem — some hill railways used pressurised boilers to compensate, and others simply accepted reduced performance at higher altitudes.',
      codeIntro: 'Model the thermodynamic cycle of a steam locomotive and visualise energy flows.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified steam locomotive energy flow (Sankey-style bar chart)
coal_energy = 100  # start with 100 units

losses = {
    'Exhaust heat\\n(hot steam/gas)': 45,
    'Radiation\\n(boiler/firebox)': 15,
    'Incomplete\\ncombustion': 12,
    'Mechanical\\nfriction': 5,
    'Auxiliary\\nsystems': 3,
    'Useful work\\n(wheels)': 8,
    'Condenser\\nloss': 12,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Left: energy loss waterfall
ax1.set_facecolor('#111827')
names = list(losses.keys())
values = list(losses.values())
colors_loss = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#94a3b8', '#22c55e', '#3b82f6']

running_total = 100
tops = []
for v in values:
    tops.append(running_total)
    running_total -= v

bars = ax1.bar(range(len(names)), values, bottom=[t - v for t, v in zip(tops, values)],
               color=colors_loss, alpha=0.8, width=0.6)
ax1.set_xticks(range(len(names)))
ax1.set_xticklabels(names, fontsize=7, color='white')
ax1.set_ylabel('Energy (%)', color='white')
ax1.set_title('Steam Engine Energy Budget', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, val in zip(bars, values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_y() + bar.get_height()/2,
             f'{val}%', ha='center', va='center', color='white', fontsize=9, fontweight='bold')

# Right: pressure-volume diagram (idealised)
ax2.set_facecolor('#111827')

# Simplified PV diagram for steam engine
# 1→2: steam admission (constant pressure expansion)
# 2→3: cutoff, steam expands adiabatically
# 3→4: exhaust (constant pressure)
# 4→1: compression

V = np.linspace(0.1, 1.0, 200)
P_admission = 10  # atm
P_exhaust = 1.5   # atm
cutoff = 0.3  # cutoff ratio

# Phase 1-2: admission
v12 = V[V <= cutoff * V[-1]]
p12 = np.full_like(v12, P_admission)

# Phase 2-3: expansion
v23 = V[V > cutoff * V[-1]]
p23 = P_admission * (cutoff * V[-1] / v23)**1.3  # polytropic

# Phase 3-4: exhaust
v34 = V[::-1]
p34 = np.full_like(v34, P_exhaust)

ax2.plot(v12, p12, color='#ef4444', linewidth=2, label='Admission')
ax2.plot(v23, p23, color='#f59e0b', linewidth=2, label='Expansion')
ax2.plot(np.concatenate([v23[-1:], v12[:1]]), [p23[-1], P_exhaust], color='#3b82f6', linewidth=2, label='Exhaust')
ax2.plot([v12[0], v12[0]], [P_exhaust, P_admission], color='#22c55e', linewidth=2, label='Compression')
ax2.fill_between(np.concatenate([v12, v23]),
                 np.concatenate([p12, p23]),
                 P_exhaust, alpha=0.15, color='#f59e0b')
ax2.annotate('WORK\\n(shaded area)', xy=(0.5, 5), color='#f59e0b', fontsize=11, fontweight='bold', ha='center')

ax2.set_xlabel('Volume', color='white')
ax2.set_ylabel('Pressure (atm)', color='white')
ax2.set_title('Steam Engine PV Diagram', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Steam locomotive efficiency evolution:")
print("  Early (1830s): ~3-5% (Stephenson's Rocket)")
print("  Peak (1940s): ~8-12% (advanced superheated designs)")
print("  Modern diesel: ~35-40%")
print("  Modern electric: ~85-95% (at the motor; overall depends on power source)")
print()
print("Despite low efficiency, steam powered the industrial revolution.")
print("The key was not efficiency but CAPABILITY — no other technology")
print("could provide portable, on-demand power at that scale in 1800.")`,
      challenge: 'The cutoff ratio (when steam admission stops and expansion begins) affects efficiency. Change the cutoff from 0.3 to 0.5. How does the PV diagram and the work area change? Early cutoff = more expansion = better efficiency but less power.',
      successHint: 'The steam engine is where thermodynamics was born. Understanding its efficiency limits led to Carnot\'s theorem, the Second Law of Thermodynamics, and ultimately to every modern heat engine — from car engines to power plants.',
    },
    {
      title: 'Gear ratios — trading speed for force',
      concept: `When the little train hits a steep incline, the driver shifts to a lower gear. But what does "gear" actually mean?

A **gear** is a toothed wheel that meshes with another toothed wheel. When two gears of different sizes connect:
- The **smaller gear** (pinion) turns faster
- The **larger gear** (wheel) turns with more force (torque)

The **gear ratio** = teeth on driven gear / teeth on driving gear
- Ratio > 1: speed decreases, torque increases (for climbing hills)
- Ratio < 1: speed increases, torque decreases (for flat running)
- Ratio = 1: no change (same speed and torque)

For a hill train:
- Climbing: gear ratio of 3:1 or 4:1 (slow but powerful)
- Flat running: gear ratio of 1:1 (fast but less torque)

The trade-off is always: **speed × torque = constant** (minus friction losses). You can have more force OR more speed, but not both from the same engine. This is why bicycles have gears — low gear for hills (slow, easy pedalling), high gear for flats (fast, hard pedalling).`,
      analogy: 'Gears are like a lever that rotates. A long lever arm (large gear) moves slowly but lifts heavy loads. A short lever arm (small gear) moves fast but can lift less. The gear ratio determines where you are on this spectrum. A hill train\'s gearbox is like a hiker choosing between a steep shortcut (lots of effort) and a long switchback (less effort, more distance). Same elevation, different strategies.',
      storyConnection: 'The little train doesn\'t actually have a gearbox in the car sense — steam locomotives use the expansion ratio of steam and the driver\'s skill with the regulator and reverser to control speed and torque. Diesel-hydraulic hill trains use torque converters that act like automatic gearboxes. But the principle is identical: when the grade steepens, the engine trades speed for pulling power.',
      checkQuestion: 'A bicycle in first gear (gear ratio 1:3) lets you pedal easily uphill but you move slowly. In sixth gear (ratio 3:1), you pedal hard but move fast on flats. If you pedal at 60 rpm in both gears, what are the wheel speeds?',
      checkAnswer: 'First gear (1:3): for every pedal turn, the wheel turns 1/3 turn. Wheel speed = 60 × (1/3) = 20 rpm. Sixth gear (3:1): for every pedal turn, the wheel turns 3 times. Wheel speed = 60 × 3 = 180 rpm. But in first gear, each pedal stroke delivers 3× more torque to the wheel. Same energy input (your legs at 60 rpm), different output profiles (slow-and-strong vs fast-and-weak).',
      codeIntro: 'Model gear ratios and their effect on train performance on different gradients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Engine produces constant power of 300 kW
engine_power = 300  # kW
engine_rpm = 1000   # operating rpm

# Different gear ratios
gear_ratios = [1.0, 2.0, 3.0, 4.0, 5.0]

# For each gear ratio:
# wheel_rpm = engine_rpm / gear_ratio
# wheel_torque = engine_torque * gear_ratio
# tractive_effort = wheel_torque / wheel_radius

wheel_radius = 0.45  # metres
engine_torque = engine_power * 1000 / (engine_rpm * 2 * np.pi / 60)  # N⋅m

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

colors_gear = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

# Left: speed vs tractive effort for each gear
ax1.set_facecolor('#111827')
for ratio, color in zip(gear_ratios, colors_gear):
    wheel_torque = engine_torque * ratio * 0.9  # 90% gearbox efficiency
    tractive_effort = wheel_torque / wheel_radius / 1000  # kN
    wheel_rpm = engine_rpm / ratio
    speed_kmh = wheel_rpm * 2 * np.pi * wheel_radius * 60 / 1000  # km/h

    # Speed range (engine can vary from 500 to 1500 rpm)
    rpm_range = np.linspace(500, 1500, 50)
    speeds = rpm_range / ratio * 2 * np.pi * wheel_radius * 60 / 1000
    torques = engine_power * 1000 / (rpm_range * 2 * np.pi / 60)
    tes = torques * ratio * 0.9 / wheel_radius / 1000

    ax1.plot(speeds, tes, color=color, linewidth=2, label=f'Gear {ratio:.0f}:1')
    ax1.plot(speed_kmh, tractive_effort, 'o', color=color, markersize=8)

# Grade resistance lines
train_mass = 80000
for grade_name, grade in [('1-in-25', 1/25), ('1-in-40', 1/40), ('Flat + friction', 0.005)]:
    resistance = train_mass * 9.81 * grade / 1000
    ax1.axhline(resistance, color='gray', linestyle=':', linewidth=1)
    ax1.annotate(grade_name, xy=(35, resistance + 0.5), color='gray', fontsize=8)

ax1.set_xlabel('Speed (km/h)', color='white')
ax1.set_ylabel('Tractive effort (kN)', color='white')
ax1.set_title('Speed vs Force: Gear Selection', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Right: optimal gear for each gradient
ax2.set_facecolor('#111827')
gradients_x = np.linspace(0, 1/15, 100)
gradient_labels = 1 / gradients_x
optimal_speed = np.zeros_like(gradients_x)
optimal_gear = np.zeros_like(gradients_x)

for i, grad in enumerate(gradients_x):
    resistance = train_mass * 9.81 * (grad + 0.002) / 1000  # grade + rolling resistance
    best_speed = 0
    best_g = 1
    for ratio in gear_ratios:
        # Find speed where TE = resistance
        rpm_range = np.linspace(500, 1500, 100)
        for rpm in rpm_range:
            torque = engine_power * 1000 / (rpm * 2 * np.pi / 60)
            te = torque * ratio * 0.9 / wheel_radius / 1000
            if te >= resistance:
                speed = rpm / ratio * 2 * np.pi * wheel_radius * 60 / 1000
                if speed > best_speed:
                    best_speed = speed
                    best_g = ratio
    optimal_speed[i] = best_speed
    optimal_gear[i] = best_g

# Filter out extreme gradients
valid = gradient_labels > 15
ax2.plot(gradient_labels[valid], optimal_speed[valid], color='#22c55e', linewidth=2, label='Max speed')
ax2_twin = ax2.twinx()
ax2_twin.plot(gradient_labels[valid], optimal_gear[valid], color='#f59e0b', linewidth=2, linestyle='--', label='Optimal gear')

ax2.set_xlabel('Gradient (1 in X)', color='white')
ax2.set_ylabel('Max speed (km/h)', color='#22c55e')
ax2_twin.set_ylabel('Optimal gear ratio', color='#f59e0b')
ax2.set_title('Optimal Gear vs Gradient', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='#f59e0b')

plt.tight_layout()
plt.show()

print("Gear selection for 80-tonne train, 300 kW engine:")
for grade_name, grade in [('Flat', 0), ('1-in-80', 1/80), ('1-in-40', 1/40), ('1-in-25', 1/25)]:
    resistance = train_mass * 9.81 * (grade + 0.002)
    best_ratio = min([r for r in gear_ratios if engine_torque * r * 0.9 / wheel_radius >= resistance], default=5)
    speed = (engine_rpm / best_ratio) * 2 * np.pi * wheel_radius * 60 / 1000
    print(f"  {grade_name}: gear {best_ratio:.0f}:1, max speed {speed:.0f} km/h")`,
      challenge: 'Add a 6th gear (0.5:1 — an overdrive). On flat ground, how fast can the train go? But what happens if it hits a 1-in-80 grade in overdrive? (Hint: the tractive effort may be insufficient.)',
      successHint: 'Gear ratios are everywhere: bicycles, cars, trains, industrial machinery, even the gears in a wristwatch. Understanding the speed-torque trade-off is fundamental to mechanical engineering.',
    },
    {
      title: 'Gradients and switchbacks — engineering tracks through mountains',
      concept: `Building a railway through mountains is a geometry problem: how do you gain altitude within the limits of what a train can climb?

**Gradient limits**:
- Standard railways: 1-in-50 to 1-in-80 (1.25-2%)
- Hill railways: 1-in-20 to 1-in-40 (2.5-5%)
- Rack railways: up to 1-in-2 (50%!)

When the terrain is too steep for a direct route, engineers use three strategies:

**Switchbacks (zigzags)**: The train climbs at an angle, reaches a dead end, reverses, and climbs at an angle in the opposite direction. Like walking up a steep slope in a zigzag pattern.

**Spiral loops**: The track curves around and crosses over itself, gaining altitude in a helix. The Darjeeling railway has the famous Batasia Loop — the train circles 360° and crosses its own path to gain altitude.

**Tunnels and cuttings**: Cut through ridges rather than going over them. Reduces gradient by shortening the altitude change.

The **Darjeeling Himalayan Railway** (88 km, 610 mm gauge) climbs from 100 m to 2,200 m — a 2,100 m gain. With an average gradient of about 1-in-29, it uses 6 zigzag reversals and 5 spiral loops. The track is more than twice as long as the straight-line distance.`,
      analogy: 'Building a mountain railway is like drawing a path from the bottom to the top of a spiral staircase on the outside of a building. You cannot go straight up (too steep). So you wrap around the building (spiral loops), sometimes go back and forth across the face (switchbacks), and occasionally cut through walls (tunnels). The final path is much longer than the height gained, but the slope at every point is gentle enough for the train.',
      storyConnection: 'The little train in the story crosses bridges, enters tunnels, reverses at switchbacks, and loops over itself at spirals. Each of these engineering features exists on real hill railways. The joy of the journey IS the engineering — watching the town you just left appear far below as the train spirals upward, or feeling the train reverse and seeing the engine now at the back.',
      checkQuestion: 'The Shimla-Kalka railway has 102 tunnels in 96 km. Why so many tunnels rather than going around the mountains?',
      checkAnswer: 'Going around mountains means longer track, more curves, and often steeper grades on the approach and exit. A tunnel through a ridge maintains a constant, gentle gradient. Each tunnel is essentially a shortcut that avoids going up-and-over a ridge. With 102 tunnels, the railway maintains a manageable gradient through terrain that would otherwise require impossible switchbacks or unacceptably steep grades.',
      codeIntro: 'Model a mountain railway route with switchbacks and spiral loops, showing how they solve the gradient problem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model: Darjeeling-like hill railway
# Must climb from 100m to 2200m over ~88 km of track

# Route waypoints (simplified)
waypoints = [
    # (distance_km, altitude_m, feature)
    (0, 100, 'Start: Siliguri'),
    (10, 400, 'Steady climb'),
    (18, 600, 'Zigzag 1'),
    (20, 750, 'After zigzag'),
    (30, 1000, 'Steady climb'),
    (40, 1250, 'Zigzag 2'),
    (42, 1400, 'After zigzag'),
    (50, 1500, 'Spiral loop 1'),
    (55, 1650, 'Batasia Loop'),
    (60, 1800, 'Spiral loop 2'),
    (70, 2000, 'Steady climb'),
    (80, 2150, 'Approaching summit'),
    (88, 2200, 'Darjeeling'),
]

distances = [w[0] for w in waypoints]
altitudes = [w[1] for w in waypoints]
features = [w[2] for w in waypoints]

# Interpolate smooth profile
from numpy import interp
smooth_dist = np.linspace(0, 88, 500)
smooth_alt = np.interp(smooth_dist, distances, altitudes)

# Calculate gradients
gradients = np.diff(smooth_alt) / (np.diff(smooth_dist) * 1000) * 1000  # per mille

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Route profile
ax1.set_facecolor('#111827')
ax1.fill_between(smooth_dist, 0, smooth_alt, alpha=0.1, color='#22c55e')
ax1.plot(smooth_dist, smooth_alt, color='#22c55e', linewidth=2)

# Mark features
for d, a, f in waypoints:
    if 'Zigzag' in f or 'Spiral' in f or 'Batasia' in f:
        color = '#f59e0b' if 'Zigzag' in f else '#a855f7'
        ax1.plot(d, a, 'o', color=color, markersize=10)
        ax1.annotate(f, xy=(d, a), xytext=(d + 2, a + 80), color=color, fontsize=8,
                     arrowprops=dict(arrowstyle='->', color=color))
    elif 'Start' in f or 'Darjeeling' in f:
        ax1.plot(d, a, 's', color='#ef4444', markersize=10)
        ax1.annotate(f, xy=(d, a), xytext=(d + 1, a + 100), color='#ef4444', fontsize=9, fontweight='bold')

# Straight-line route
ax1.plot([0, 88], [100, 2200], color='#ef4444', linestyle=':', linewidth=1, label='Direct route (impossible)')
direct_gradient = (2200-100) / (88*1000) * 1000
ax1.annotate(f'Direct: {direct_gradient:.0f}‰ average', xy=(44, 1150), color='#ef4444', fontsize=8)

ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_title('Darjeeling Himalayan Railway — Route Profile', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Gradient profile
ax2.set_facecolor('#111827')
ax2.bar(smooth_dist[:-1], gradients, width=88/500, color=np.where(gradients > 35, '#ef4444',
        np.where(gradients > 25, '#f59e0b', '#22c55e')), alpha=0.8)
ax2.axhline(25, color='#f59e0b', linestyle='--', linewidth=1, label='Normal hill limit (25‰)')
ax2.axhline(35, color='#ef4444', linestyle='--', linewidth=1, label='Steep limit (35‰)')
ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Gradient (‰)', color='white')
ax2.set_title('Track Gradient Along Route', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Route statistics
total_climb = 2200 - 100
track_length = 88
direct_distance = np.sqrt(track_length**2 + (total_climb/1000)**2)
avg_gradient = total_climb / (track_length * 1000)
max_gradient = np.max(gradients)

print(f"Darjeeling Himalayan Railway statistics:")
print(f"  Total climb: {total_climb} m")
print(f"  Track length: {track_length} km")
print(f"  Direct distance: {direct_distance:.1f} km")
print(f"  Detour ratio: {track_length/direct_distance:.1f}x")
print(f"  Average gradient: 1-in-{1/avg_gradient:.0f} ({avg_gradient*1000:.0f}‰)")
print(f"  Max gradient: {max_gradient:.0f}‰ (1-in-{1000/max_gradient:.0f})")
print(f"  Zigzag reversals: 6")
print(f"  Spiral loops: 5")
print(f"  UNESCO World Heritage: Yes (1999)")`,
      challenge: 'Design an alternative route that avoids all zigzags by using only spiral loops. Each loop gains about 30 m of altitude and adds 0.8 km of track. How many loops would you need? How much longer would the route be?',
      successHint: 'From simple machines to friction to steam to gears to track design — you have covered the mechanical engineering of railways from first principles. Level 2 takes you into the deeper engineering: tractive effort calculations, braking physics, bridge loading, and the future of rail transport.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mechanical Engineering & Railways</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
