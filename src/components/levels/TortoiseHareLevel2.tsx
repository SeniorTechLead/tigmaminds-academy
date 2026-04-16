import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TortoiseHareLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Equations of motion — predicting where things go',
      concept: `Level 1 gave you intuition about speed and acceleration. Now we formalize it with the **SUVAT equations** — the three equations that predict all motion under constant acceleration:

1. **v = u + at** (final velocity = initial velocity + acceleration x time)
2. **s = ut + ½at²** (displacement = initial velocity x time + half acceleration x time squared)
3. **v² = u² + 2as** (relates velocity to displacement without needing time)

Where: s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.

These equations assume **constant acceleration**. In the real world, acceleration varies (a cheetah's acceleration drops as it approaches top speed), but these equations are remarkably accurate for short time intervals.

For the Pobitora race: the hare's sprint phase has a ≈ 5 m/s² for the first 2 seconds, then a ≈ 0 (constant speed). The tortoise has a ≈ 0 always (constant speed from the start).`,
      analogy: 'SUVAT equations are like a recipe with five ingredients (s, u, v, a, t). If you know any three, you can calculate the other two. It is like being given three clues in a mystery — you can always deduce the rest.',
      storyConnection: 'Using SUVAT, we can calculate exactly when the tortoise overtakes the hare. If the hare sprints at 5 m/s for 10s (s = 50m) then naps, and the tortoise moves at 0.3 m/s constantly, the tortoise catches up at t = 50/0.3 = 167s. The equations turn a fable into a physics problem with an exact answer.',
      checkQuestion: 'A rhino charges from rest with acceleration 3 m/s². How far does it travel in the first 4 seconds?',
      checkAnswer: 'Using s = ut + ½at²: u = 0, a = 3, t = 4. s = 0 + ½(3)(16) = 24 meters. Its velocity at that point: v = u + at = 0 + 3(4) = 12 m/s (43 km/h). A charging rhino covers 24 meters — about 5 car lengths — in just 4 seconds.',
      codeIntro: 'Implement and visualize the SUVAT equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# SUVAT calculator and visualizer
def suvat_motion(u, a, t_max):
    """Calculate motion under constant acceleration."""
    t = np.linspace(0, t_max, 500)
    v = u + a * t  # equation 1
    s = u * t + 0.5 * a * t**2  # equation 2
    return t, s, v

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

scenarios = [
    {'name': 'Hare sprint', 'u': 0, 'a': 5.0, 't': 4, 'color': '#ef4444'},
    {'name': 'Rhino charge', 'u': 0, 'a': 3.0, 't': 6, 'color': '#8b5cf6'},
    {'name': 'Tortoise (constant)', 'u': 0.3, 'a': 0.0, 't': 10, 'color': '#22c55e'},
    {'name': 'Braking car', 'u': 20, 'a': -5.0, 't': 5, 'color': '#f59e0b'},
]

for sc in scenarios:
    t, s, v = suvat_motion(sc['u'], sc['a'], sc['t'])

    axes[0,0].set_facecolor('#111827')
    axes[0,0].plot(t, s, color=sc['color'], linewidth=2, label=sc['name'])

    axes[0,1].set_facecolor('#111827')
    axes[0,1].plot(t, v, color=sc['color'], linewidth=2, label=sc['name'])

axes[0,0].set_title('Displacement vs Time', color='white', fontsize=11)
axes[0,0].set_xlabel('Time (s)', color='white')
axes[0,0].set_ylabel('Displacement (m)', color='white')
axes[0,0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0,0].tick_params(colors='gray')

axes[0,1].set_title('Velocity vs Time', color='white', fontsize=11)
axes[0,1].set_xlabel('Time (s)', color='white')
axes[0,1].set_ylabel('Velocity (m/s)', color='white')
axes[0,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0,1].tick_params(colors='gray')

# Equation 3: v^2 = u^2 + 2as
# Braking distance analysis
axes[1,0].set_facecolor('#111827')
initial_speeds = np.linspace(5, 40, 20)  # m/s
a_brake = -8  # hard braking
braking_distances = -initial_speeds**2 / (2 * a_brake)  # from v^2=u^2+2as, v=0
axes[1,0].bar(initial_speeds * 3.6, braking_distances, width=4, color='#ef4444', alpha=0.7)
axes[1,0].set_xlabel('Initial speed (km/h)', color='white')
axes[1,0].set_ylabel('Braking distance (m)', color='white')
axes[1,0].set_title('Braking Distance (v\² = u\² + 2as)', color='white', fontsize=11)
axes[1,0].tick_params(colors='gray')

# Comparison: same distance, different accelerations
axes[1,1].set_facecolor('#111827')
accels = [1, 2, 3, 5, 8, 10]
for a in accels:
    t = np.linspace(0, 6, 100)
    s = 0.5 * a * t**2
    axes[1,1].plot(t, s, linewidth=2, label=f'a = {a} m/s\²')
axes[1,1].set_xlabel('Time (s)', color='white')
axes[1,1].set_ylabel('Distance (m)', color='white')
axes[1,1].set_title('Same start, different accelerations', color='white', fontsize=11)
axes[1,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[1,1].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SUVAT in action:")
print(f"  Hare: 0 to {5*4:.0f} m/s in 4s, covering {0.5*5*16:.0f}m")
print(f"  Rhino: 0 to {3*6:.0f} m/s in 6s, covering {0.5*3*36:.0f}m")
print(f"  Doubling speed quadruples braking distance (v\² relationship)")`,
      challenge: 'A hare and tortoise start 100m apart, moving toward each other. Hare: u=5 m/s, a=0. Tortoise: u=0.3 m/s, a=0. When and where do they meet? Solve with SUVAT.',
      successHint: 'SUVAT equations are the foundation of all classical mechanics. Every rocket launch, every car crash investigation, every sports analysis starts here. Master these three equations and you can predict any motion.',
    },
    {
      title: 'Projectile motion — when animals leap',
      concept: `When the hare leaps over a log, it becomes a **projectile** — an object moving under gravity alone (ignoring air resistance). Projectile motion combines two independent motions:

- **Horizontal**: constant velocity (no horizontal force)
- **Vertical**: constant acceleration (gravity pulls down at 9.81 m/s²)

The key insight: horizontal and vertical motions are **independent**. A bullet fired horizontally and a bullet dropped from the same height hit the ground at the same time.

**Equations:**
- Horizontal: x = v₀·cos(θ)·t
- Vertical: y = v₀·sin(θ)·t - ½gt²
- Range: R = v₀²·sin(2θ)/g
- Max height: H = v₀²·sin²(θ)/(2g)

**Optimal launch angle**: 45° gives maximum range (on flat ground). Animals instinctively know this — frogs jump close to 45°, and so do long jumpers.`,
      analogy: 'Projectile motion is like throwing a ball on a moving train. The ball goes forward (horizontal, from the train\'s speed) and down (vertical, from gravity) at the same time. The two motions combine into a curved path — a parabola. The train doesn\'t affect how fast the ball falls.',
      storyConnection: 'A hare leaping over obstacles in the Pobitora grasslands follows a parabolic arc. If it launches at 5 m/s at 45°, its range is about 2.5m and peak height about 0.6m. A rhino, surprisingly, can jump zero meters — they literally cannot jump. Their mass-to-muscle ratio doesn\'t allow it.',
      checkQuestion: 'A frog jumps at 3 m/s at a 45° angle. What is its maximum range? What if it jumps at 30°?',
      checkAnswer: 'At 45°: R = v²sin(90°)/g = 9/9.81 = 0.92m. At 30°: R = 9×sin(60°)/9.81 = 9×0.866/9.81 = 0.79m. The 45° jump goes 16% farther. But in reality, frogs often jump at lower angles for speed (reaching the destination faster even if slightly shorter range).',
      codeIntro: 'Simulate projectile motion for different launch angles and animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81

def projectile(v0, theta_deg, dt=0.001):
    theta = np.radians(theta_deg)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)
    x, y = [0], [0]
    t = 0
    while y[-1] >= 0 or len(y) < 3:
        t += dt
        x.append(vx * t)
        y.append(vy * t - 0.5 * g * t**2)
        if y[-1] < 0 and len(y) > 3:
            break
    return np.array(x), np.array(y)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Different angles, same speed
ax1.set_facecolor('#111827')
v0 = 5  # m/s
for angle in [15, 30, 45, 60, 75]:
    x, y = projectile(v0, angle)
    ax1.plot(x, y, linewidth=2, label=f'{angle}\°')

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title(f'Projectile at {v0} m/s: Different Angles', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(-0.1, None)
ax1.set_aspect('equal')

# Different animals jumping
ax2.set_facecolor('#111827')
jumpers = {
    'Frog': {'v0': 3.5, 'angle': 42, 'color': '#22c55e'},
    'Hare': {'v0': 5.0, 'angle': 35, 'color': '#ef4444'},
    'Impala': {'v0': 9.0, 'angle': 40, 'color': '#f59e0b'},
    'Snow leopard': {'v0': 8.0, 'angle': 30, 'color': '#8b5cf6'},
    'Human long jump': {'v0': 9.5, 'angle': 22, 'color': '#3b82f6'},
}

for name, props in jumpers.items():
    x, y = projectile(props['v0'], props['angle'])
    ax2.plot(x, y, color=props['color'], linewidth=2, label=f"{name} ({max(x):.1f}m)")

ax2.set_xlabel('Horizontal distance (m)', color='white')
ax2.set_ylabel('Height (m)', color='white')
ax2.set_title('Animal Jumps (realistic launch speeds)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_ylim(-0.1, None)

plt.tight_layout()
plt.show()

print("Range = v\² sin(2\θ) / g")
print(f"At 45\°, sin(90\°) = 1, giving maximum range.")
print()
for name, props in jumpers.items():
    R = props['v0']**2 * np.sin(2*np.radians(props['angle'])) / g
    H = props['v0']**2 * np.sin(np.radians(props['angle']))**2 / (2*g)
    print(f"  {name}: range={R:.2f}m, max height={H:.2f}m")`,
      challenge: 'Add air resistance to the simulation. Use F_drag = 0.5 * rho * v^2 * Cd * A. How does it change the trajectory? The path is no longer a perfect parabola.',
      successHint: 'Projectile motion is the gateway to orbital mechanics (a satellite is just a projectile that keeps "missing" the Earth), ballistics, and sports physics. The parabola is one of nature\'s favorite curves.',
    },
    {
      title: 'Friction — the hidden force in every race',
      concept: `Without friction, the hare would spin its legs uselessly like a car on ice. **Friction** is the force that resists relative motion between surfaces in contact.

**Two types:**
- **Static friction**: prevents motion from starting (keeps you from sliding on a slope). F_s ≤ μ_s × N
- **Kinetic friction**: resists ongoing motion (slows a sliding box). F_k = μ_k × N

Where μ = friction coefficient, N = normal force (usually weight for horizontal surfaces).

**Key facts:**
- Static friction > kinetic friction (it's harder to start moving than to keep moving)
- Friction depends on surface type, NOT on contact area (counterintuitive!)
- μ for rubber on grass ≈ 0.35, rubber on wet grass ≈ 0.20

**For running animals:**
Feet push backward on the ground; friction pushes the animal forward. More friction = more grip = better acceleration. This is why cheetahs have semi-retractable claws (like cleats) and geckos have micro-hairs.`,
      analogy: 'Friction is like the grip on a climbing wall. Without grip holds (friction), you slide down no matter how strong your arms are. The holds don\'t move you up — YOUR muscles do that — but the holds give your muscles something to push against. An animal\'s foot on the ground works the same way.',
      storyConnection: 'In the Pobitora grasslands, the ground shifts between dry grass, wet mud, and sandy patches. The hare\'s wide feet spread its weight on mud (snowshoe effect). The tortoise\'s textured shell-bottom provides grip on slopes. Each animal\'s foot is engineered for its terrain — friction coefficients optimized by evolution.',
      checkQuestion: 'Why do racing cars have wide, smooth tires (slicks) on dry tracks but narrow, treaded tires on wet tracks?',
      checkAnswer: 'On dry tracks, rubber grips through molecular adhesion — more contact area = more grip, so wide slicks are best. On wet tracks, water reduces adhesion. Treads channel water away from the contact patch. Narrower tires concentrate weight, pushing through the water film. Completely different friction strategies for different conditions.',
      codeIntro: 'Explore how friction affects running and braking.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81

# Friction coefficients for different surfaces
surfaces = {
    'Dry grass': 0.35,
    'Wet mud': 0.15,
    'Sandy path': 0.40,
    'Rocky ground': 0.55,
    'Ice': 0.05,
    'Rubber track': 0.70,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Max acceleration possible on each surface
# F_friction = mu * m * g = m * a_max, so a_max = mu * g
ax1.set_facecolor('#111827')
names = list(surfaces.keys())
mus = list(surfaces.values())
a_maxs = [mu * g for mu in mus]
colors = plt.cm.RdYlGn(np.linspace(0.2, 0.9, len(names)))

bars = ax1.barh(names, a_maxs, color=colors)
ax1.set_xlabel('Max acceleration (m/s\²)', color='white')
ax1.set_title('Maximum Acceleration by Surface', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for bar, a in zip(bars, a_maxs):
    ax1.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'{a:.1f} m/s\²', va='center', color='white', fontsize=9)

# Simulate a race on different surfaces
ax2.set_facecolor('#111827')
t = np.linspace(0, 5, 500)
v_max_hare = 20  # m/s

for name, mu in [('Dry grass', 0.35), ('Wet mud', 0.15), ('Rocky ground', 0.55)]:
    a_max = mu * g
    # Hare accelerates at a_max until reaching v_max
    t_to_vmax = v_max_hare / a_max
    v = np.where(t < t_to_vmax, a_max * t, v_max_hare)
    s = np.where(t < t_to_vmax,
                 0.5 * a_max * t**2,
                 0.5 * a_max * t_to_vmax**2 + v_max_hare * (t - t_to_vmax))
    ax2.plot(t, s, linewidth=2, label=f'{name} (\μ={mu})')

ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Distance (m)', color='white')
ax2.set_title('Hare Race on Different Surfaces', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Surface matters enormously:")
for name, mu in surfaces.items():
    a = mu * g
    t_100 = np.sqrt(2 * 100 / a) if a > 0 else float('inf')
    print(f"  {name}: \μ={mu}, max accel={a:.1f} m/s\², 100m from rest in {t_100:.1f}s")`,
      challenge: 'Model what happens when the hare hits a patch of wet mud mid-sprint. It enters at 15 m/s with mu=0.15. How far does it slide before stopping? Use v^2 = u^2 + 2as with a = -mu*g.',
      successHint: 'Friction engineering is everywhere: brake pads, tire design, shoe soles, even phone screen protectors. Understanding friction coefficients lets you predict and control motion on any surface.',
    },
    {
      title: 'Energy in running — the fuel of motion',
      concept: `Every step the hare and tortoise take costs energy. **Kinetic energy** (KE = ½mv²) is the energy of motion. **Work** is force times distance. The connection: the work done by muscles equals the change in kinetic energy.

**Energy budget of running:**
- **Kinetic energy**: accelerating the body forward
- **Potential energy**: lifting the center of mass with each stride (bounce)
- **Heat**: muscles are only ~25% efficient; 75% becomes heat
- **Elastic energy**: tendons store and release energy like springs (saves ~50% of the cost)

**Cost of transport** (COT) measures efficiency: energy per kilogram per meter. Surprisingly:
- Running COT is roughly constant across species (≈ 10 J/kg/km for most mammals)
- Larger animals are MORE efficient per kg (elephant < horse < rat)
- Swimming is cheapest; flying is moderate; running is most expensive

The tortoise wins on energy efficiency: less total energy spent to cover the same distance.`,
      analogy: 'Running energy is like your phone battery. Sprinting is like streaming video — drains fast. Walking is like reading text — lasts all day. The hare\'s "battery" (glycogen stores) drained in the sprint. The tortoise\'s "low power mode" (slow walking) lasted the whole race.',
      storyConnection: 'The hare collapsed from exhaustion — it spent all its glycogen (quick-burn fuel) in the sprint. The tortoise burned fat (slow-burn fuel) steadily. In Kaziranga, elephants walk 20-30 km daily because their slow pace is incredibly energy-efficient for their massive bodies. They are the ultimate tortoises.',
      checkQuestion: 'A 3 kg hare running at 20 m/s has kinetic energy KE = ½(3)(400) = 600 J. Where does this energy go when it stops?',
      checkAnswer: 'It converts to heat (mostly in the muscles as they brake, and friction between feet and ground), sound (the skidding noise), and deformation (paw prints in soft ground). Energy is never destroyed — it just changes form. This is the First Law of Thermodynamics.',
      codeIntro: 'Analyze the energy budget of running for different animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy analysis of running
animals = {
    'Tortoise': {'mass': 5, 'speed': 0.3, 'efficiency': 0.15},
    'Hare': {'mass': 3, 'speed': 20, 'efficiency': 0.25},
    'Human jogger': {'mass': 70, 'speed': 3, 'efficiency': 0.25},
    'Horse': {'mass': 500, 'speed': 15, 'efficiency': 0.25},
    'Elephant': {'mass': 5000, 'speed': 5, 'efficiency': 0.25},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Kinetic energy comparison
ax1.set_facecolor('#111827')
names = list(animals.keys())
KEs = [0.5 * a['mass'] * a['speed']**2 for a in animals.values()]
colors = ['#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#6b7280']

bars = ax1.bar(names, KEs, color=colors)
ax1.set_ylabel('Kinetic energy (J)', color='white')
ax1.set_title('Kinetic Energy at Top Speed (KE = \½mv\²)', color='white', fontsize=11)
ax1.tick_params(colors='gray')
ax1.tick_params(axis='x', rotation=20)
for bar, ke in zip(bars, KEs):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 200,
             f'{ke:,.0f} J', ha='center', color='white', fontsize=9)

# Cost of transport: energy per kg per meter
ax2.set_facecolor('#111827')
masses = np.logspace(-2, 4, 100)  # 0.01 kg to 10000 kg
# Empirical: COT ≈ 10.7 * mass^(-0.32) J/(kg*m) for running mammals
COT = 10.7 * masses**(-0.32)

ax2.plot(masses, COT, color='#22c55e', linewidth=2, label='Running mammals')
ax2.plot(masses, COT * 0.1, color='#3b82f6', linewidth=2, label='Swimming')
ax2.plot(masses, COT * 0.4, color='#f59e0b', linewidth=2, label='Flying')

for name, props in animals.items():
    cot = 10.7 * props['mass']**(-0.32)
    ax2.scatter(props['mass'], cot, s=80, color='white', zorder=5, edgecolors='gray')
    ax2.annotate(name, xy=(props['mass'], cot), xytext=(5, 8),
                 textcoords='offset points', color='white', fontsize=8)

ax2.set_xscale('log')
ax2.set_yscale('log')
ax2.set_xlabel('Body mass (kg)', color='white')
ax2.set_ylabel('Cost of transport (J/kg/m)', color='white')
ax2.set_title('Cost of Transport: Bigger = More Efficient per kg', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Energy at top speed:")
for name, props in animals.items():
    ke = 0.5 * props['mass'] * props['speed']**2
    food_cal = ke / (props['efficiency'] * 4184)  # food Calories needed
    print(f"  {name}: KE={ke:,.0f}J (needs ~{food_cal:.1f} food Cal to generate)")`,
      challenge: 'Calculate the total energy the hare and tortoise each spend to cover 100m. Include the 75% heat waste. Which animal is more energy-efficient for the race?',
      successHint: 'Energy analysis is the foundation of sports science, vehicle engineering, and ecology. Understanding energy budgets helps us design better running shoes, more efficient cars, and better conservation strategies.',
    },
    {
      title: 'Comparing animal locomotion — running, swimming, flying',
      concept: `Running is just one way to move. Nature has invented three main locomotion strategies, each with different physics:

**Running (terrestrial):**
- Must support body weight against gravity
- Must overcome friction and air resistance
- Legs act as levers and springs
- Most energy-expensive per meter

**Swimming (aquatic):**
- Buoyancy supports body weight (no energy spent fighting gravity)
- Must overcome water drag (800× denser than air)
- Fins/flukes push water backward (Newton's third law)
- Most energy-efficient per meter

**Flying (aerial):**
- Must generate lift to counter gravity (wing shape + speed)
- Low air resistance compared to water
- Wings provide both lift and thrust
- Moderate efficiency, but enables incredible range

**Froude number and Reynolds number** characterize locomotion physics — dimensionless numbers that predict whether an animal walks, trots, gallops, or swims at different speeds.`,
      analogy: 'Locomotion types are like transport modes in a city. Running is like cycling — you carry your own weight, efficient for short trips. Swimming is like taking a boat — the water holds you up, great for long distances. Flying is like a helicopter — expensive to hover, but once moving, you cover vast ground fast.',
      storyConnection: 'Pobitora and Kaziranga host all three locomotion types: rhinos and hares run, Gangetic dolphins swim, and pelicans and adjutant storks fly. The Brahmaputra River ecosystem is a laboratory of locomotion physics — every strategy coexisting in one watershed.',
      checkQuestion: 'A duck can run, swim, and fly. Which mode is most efficient for it? Why does it bother with the other two?',
      checkAnswer: 'Swimming is most energy-efficient per meter for a duck. But flying lets it cover long distances fast (migration), and walking lets it access food on land (grazing). Evolution didn\'t optimize for one mode — it found a "good enough" compromise for all three. Jack of all trades, master of none (but better than a master of one).',
      codeIntro: 'Compare the physics of running, swimming, and flying.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed vs body mass for different locomotion modes
# Empirical scaling laws
masses = np.logspace(-3, 4, 100)  # grams to tons

# Max speed scaling (approximate): v_max ∝ mass^a
# Running: v ≈ 10 * m^0.17 (m in kg)
# Swimming: v ≈ 3 * m^0.17
# Flying: v ≈ 15 * m^0.16
v_run = 10 * masses**0.17
v_swim = 3 * masses**0.17
v_fly = 15 * masses**0.16

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(masses, v_run, color='#22c55e', linewidth=2, label='Running')
ax1.plot(masses, v_swim, color='#3b82f6', linewidth=2, label='Swimming')
ax1.plot(masses, v_fly, color='#f59e0b', linewidth=2, label='Flying')

# Plot specific animals
specific = [
    ('Tortoise', 5, 0.08, '#22c55e', 'run'),
    ('Hare', 3, 20, '#ef4444', 'run'),
    ('Cheetah', 50, 33, '#f59e0b', 'run'),
    ('Dolphin', 200, 7.5, '#3b82f6', 'swim'),
    ('Eagle', 5, 40, '#f59e0b', 'fly'),
    ('Rhino', 2000, 15, '#8b5cf6', 'run'),
]
for name, m, v, c, mode in specific:
    ax1.scatter(m, v, s=80, color=c, zorder=5, edgecolors='white')
    ax1.annotate(name, xy=(m, v), xytext=(5, 5), textcoords='offset points',
                 color=c, fontsize=8)

ax1.set_xscale('log')
ax1.set_yscale('log')
ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Max speed (m/s)', color='white')
ax1.set_title('Max Speed vs Body Mass by Locomotion', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Froude number analysis for running gaits
ax2.set_facecolor('#111827')
# Fr = v^2 / (g * leg_length)
# Fr < 0.5: walk, 0.5-2.5: trot, > 2.5: gallop
leg_lengths = np.linspace(0.01, 1.5, 100)
v_walk_max = np.sqrt(0.5 * 9.81 * leg_lengths)
v_trot_max = np.sqrt(2.5 * 9.81 * leg_lengths)

ax2.fill_between(leg_lengths, 0, v_walk_max, alpha=0.3, color='#22c55e', label='Walk (Fr<0.5)')
ax2.fill_between(leg_lengths, v_walk_max, v_trot_max, alpha=0.3, color='#f59e0b', label='Trot (0.5<Fr<2.5)')
ax2.fill_between(leg_lengths, v_trot_max, 15, alpha=0.3, color='#ef4444', label='Gallop (Fr>2.5)')

gaits = [('Mouse', 0.02, 3.5), ('Hare', 0.15, 20), ('Human', 0.9, 10), ('Horse', 1.2, 18)]
for name, leg, speed in gaits:
    ax2.scatter(leg, speed, s=80, color='white', zorder=5, edgecolors='gray')
    ax2.annotate(name, xy=(leg, speed), xytext=(5, 5), textcoords='offset points',
                 color='white', fontsize=9)

ax2.set_xlabel('Leg length (m)', color='white')
ax2.set_ylabel('Speed (m/s)', color='white')
ax2.set_title('Froude Number: When to Walk, Trot, or Gallop', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Gait transitions are predicted by Froude number:")
print("  Fr = v\² / (g \× leg_length)")
print("  Walk: Fr < 0.5 | Trot: 0.5-2.5 | Gallop: > 2.5")
print("  Horses and humans naturally switch gaits at these thresholds!")`,
      challenge: 'Calculate the Froude number at which YOU transition from walking to running. Measure your leg length, measure your fastest comfortable walking speed. Fr should be close to 0.5.',
      successHint: 'The Froude number beautifully unifies locomotion across species. A mouse, a human, and an elephant all transition from walking to running at the same Froude number — despite vastly different sizes and speeds.',
    },
    {
      title: 'Optimization — finding the best strategy',
      concept: `The tortoise-hare fable is really an **optimization problem**: given limited energy, what running strategy maximizes the chance of finishing first?

**Optimization in physics and biology:**
- Minimize energy cost for a given speed
- Maximize range for a given fuel supply
- Find the optimal gait transition speed
- Find the best angle for a jump (45° for range, less for speed)

**Mathematical optimization** uses calculus (derivatives) to find minima and maxima. For any function f(x):
- Set f'(x) = 0 (find where slope is zero)
- Check f''(x) to determine if it's a minimum or maximum

**The hare's optimization problem:**
Given: total energy E, sprint speed v_s, rest time t_r per sprint
Maximize: total distance before exhaustion
Solution: sprint in shorter bursts with shorter rests → approaches continuous motion → approaches the tortoise's strategy!

The paradox: the optimal hare strategy IS the tortoise strategy.`,
      analogy: 'Optimization is like packing a suitcase. You want to maximize what you bring (value) while staying under the weight limit (constraint). You can pack one heavy luxury item (hare: one big sprint) or many light essentials (tortoise: steady progress). The best packing usually fills every gap — like the tortoise filling every second with steady motion.',
      storyConnection: 'The Pobitora race reveals a deep truth about optimization: given fixed total energy, the strategy that distributes effort evenly over time always beats the strategy of extreme bursts and rests. Marathon runners know this — "negative splitting" (running the second half slightly faster) is optimal. Even pacing beats sprinting.',
      checkQuestion: 'A car has fuel for 100 km at 60 km/h OR 70 km at 100 km/h (due to air resistance). You need to travel 90 km. Can you make it? What speed should you go?',
      checkAnswer: 'At 60 km/h, range = 100 km > 90 km. Yes, you can make it at 60 km/h. At 100 km/h, range = 70 km < 90 km. You run out of fuel. The optimal speed is around 60-70 km/h. Driving faster is literally counterproductive — you arrive never instead of arriving late. The tortoise strategy wins again.',
      codeIntro: 'Find the optimal running strategy using numerical optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Optimization: what sprint/rest ratio minimizes race time?
race_distance = 100  # meters
sprint_speed = 10  # m/s
walk_speed = 0.3  # m/s (tortoise speed)

# Strategy: sprint for t_sprint seconds, rest for t_rest seconds, repeat
# Constraint: total energy is fixed
total_energy = 1000  # arbitrary units
sprint_energy_rate = 50  # energy/second while sprinting
rest_recovery_rate = 5   # energy/second recovered while resting

sprint_fractions = np.linspace(0.01, 0.99, 200)
race_times = []
distances_at_exhaustion = []

for sf in sprint_fractions:
    # In each cycle: sprint for sf*T, rest for (1-sf)*T
    # Energy per cycle: sprint_energy_rate * sf * T - rest_recovery_rate * (1-sf) * T
    # Net energy rate: sf * sprint_rate - (1-sf) * recovery_rate
    net_energy_rate = sf * sprint_energy_rate - (1-sf) * rest_recovery_rate
    if net_energy_rate <= 0:
        # Sustainable forever (like the tortoise!)
        avg_speed = sprint_speed * sf
        race_time = race_distance / avg_speed if avg_speed > 0 else float('inf')
    else:
        time_to_exhaust = total_energy / net_energy_rate
        avg_speed = sprint_speed * sf
        distance_covered = avg_speed * time_to_exhaust
        if distance_covered >= race_distance:
            race_time = race_distance / avg_speed
        else:
            # Switch to walking after exhaustion
            remaining = race_distance - distance_covered
            race_time = time_to_exhaust + remaining / walk_speed

    race_times.append(race_time)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Race time vs sprint fraction
ax1.set_facecolor('#111827')
ax1.plot(sprint_fractions * 100, race_times, color='#22c55e', linewidth=2)
optimal_idx = np.argmin(race_times)
opt_sf = sprint_fractions[optimal_idx]
opt_time = race_times[optimal_idx]
ax1.scatter(opt_sf * 100, opt_time, s=100, color='#f59e0b', zorder=5, edgecolors='white')
ax1.annotate(f'Optimal: {opt_sf*100:.0f}% sprint\
Time: {opt_time:.1f}s',
             xy=(opt_sf*100, opt_time), xytext=(opt_sf*100+15, opt_time+50),
             color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Mark tortoise time
tortoise_time = race_distance / walk_speed
ax1.axhline(tortoise_time, color='#ef4444', linestyle='--', alpha=0.5, label=f'Pure tortoise: {tortoise_time:.0f}s')

ax1.set_xlabel('Sprint fraction (%)', color='white')
ax1.set_ylabel('Total race time (s)', color='white')
ax1.set_title('Optimal Sprint Strategy for 100m Race', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, min(max(race_times), 500))

# Average speed vs sprint fraction
ax2.set_facecolor('#111827')
avg_speeds = [race_distance / t for t in race_times]
ax2.plot(sprint_fractions * 100, avg_speeds, color='#3b82f6', linewidth=2)
ax2.scatter(opt_sf * 100, race_distance / opt_time, s=100, color='#f59e0b', zorder=5, edgecolors='white')
ax2.set_xlabel('Sprint fraction (%)', color='white')
ax2.set_ylabel('Average speed (m/s)', color='white')
ax2.set_title('Average Speed vs Strategy', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal strategy: sprint {opt_sf*100:.0f}% of the time")
print(f"  Optimal race time: {opt_time:.1f}s")
print(f"  Pure sprint (100%): exhausts at {total_energy/sprint_energy_rate:.0f}s")
print(f"  Pure tortoise (0%): {tortoise_time:.0f}s")
print()
print("The optimization shows: moderate, sustainable effort beats extremes.")
print("This is the mathematical proof of the fable's moral.")`,
      challenge: 'Change the recovery rate from 5 to 20 (the hare recovers faster during rest). How does this shift the optimal strategy? At what recovery rate does 100% sprinting become optimal?',
      successHint: 'Optimization is the language of engineering, economics, and evolution. Natural selection IS optimization — organisms that find better strategies in the energy-time landscape survive. The tortoise and hare fable is really about evolutionary optimization in disguise.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Kinematics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced physics simulations. Click to start.</p>
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