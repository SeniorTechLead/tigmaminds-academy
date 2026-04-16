import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StonePullingLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Force and weight — what does a stone weigh?',
      concept: `**Weight** is the force of gravity pulling an object downward. It is calculated as:

**W = m × g**

Where:
- W = weight in Newtons (N)
- m = mass in kilograms (kg)
- g = acceleration due to gravity (9.81 m/s²)

In Naga stone-pulling traditions, massive stones (some weighing over 5,000 kg) are dragged through villages to mark achievements. Moving such a stone requires overcoming its weight and friction.

A 5,000 kg stone weighs:
W = 5,000 × 9.81 = 49,050 N ≈ 49 kN

That is roughly the weight of 8 small cars stacked together.

📚 *In Python, we use the **print()** function to display results. We can include calculations directly: print(5000 * 9.81) shows 49050.0.*`,
      analogy: 'Weight is like the "stubbornness" of an object resisting being moved. A feather has almost no stubbornness — a gentle breath moves it. A 5-tonne stone is extremely stubborn — dozens of people pulling together barely budge it. Gravity is what makes objects stubborn, and mass determines how stubborn they are.',
      storyConnection: 'In Nagaland, stone-pulling ceremonies (stone dragging) are feats of community strength and engineering. Entire villages coordinate to move multi-tonne stones using ropes, log rollers, and inclined paths. Understanding weight is the first step to understanding how they achieve this remarkable feat.',
      checkQuestion: 'If you transported the same 5,000 kg stone to the Moon (g = 1.62 m/s²), would it be easier to pull? Would its mass change?',
      checkAnswer: 'Its mass stays exactly 5,000 kg — mass is an intrinsic property of matter. But its weight drops to 5,000 × 1.62 = 8,100 N (about 1/6 of Earth weight). It would be MUCH easier to pull on the Moon because there is less gravitational force resisting motion. However, its inertia (resistance to acceleration) remains the same, so starting it moving still requires significant force.',
      codeIntro: 'Calculate the weight of stones of different masses and how many people are needed to move them.',
      code: `# Weight and force calculations for Naga stone-pulling

g = 9.81  # m/s², acceleration due to gravity

# Different stone masses used in ceremonies
stone_masses = [500, 1000, 2000, 3000, 5000, 8000]

# Average person can exert about 500 N of pulling force
pull_force_per_person = 500  # Newtons

print("Naga Stone-Pulling — Weight & Force Analysis")
print("=" * 55)
print(f"{'Mass (kg)':>10} | {'Weight (N)':>10} | {'Weight (kN)':>11} | {'People needed':>14}")
print("-" * 55)

for mass in stone_masses:
    weight = mass * g
    weight_kn = weight / 1000
    # Need to overcome friction too (coefficient ~0.5 for stone on dirt)
    friction_coeff = 0.5
    force_needed = weight * friction_coeff
    people = int(force_needed / pull_force_per_person) + 1
    print(f"  {mass:>7,} | {weight:>10,.0f} | {weight_kn:>9.1f} kN | {people:>13}")

print()
print("Note: This assumes flat ground with friction coefficient 0.5")
print("The Naga tradition uses techniques to reduce this requirement!")

# A 5000 kg stone
big_stone = 5000 * g
print(f"\
A 5,000 kg ceremonial stone weighs {big_stone:,.0f} N")
print(f"That's {big_stone/9.81:.0f} kg-force — like lifting {big_stone/700:.0f} people!")`,
      challenge: 'What if the stone is wet (friction coefficient drops to 0.3)? How many fewer people are needed? This is why Naga stone-pullers sometimes wet the path.',
      successHint: 'You now understand the fundamental relationship between mass, gravity, and weight. Every engineering solution in stone-pulling is about reducing the force needed relative to this weight.',
    },
    {
      title: 'Friction — the hidden enemy of stone-pullers',
      concept: `**Friction** is the force that resists sliding motion between two surfaces. For a stone on the ground:

**F_friction = μ × N**

Where:
- F_friction = friction force (N)
- μ (mu) = coefficient of friction (dimensionless)
- N = normal force (usually equals weight on flat ground)

Typical coefficients:
- Stone on dry dirt: μ ≈ 0.5-0.7
- Stone on wet dirt: μ ≈ 0.3-0.4
- Stone on wooden rollers: μ ≈ 0.1-0.2
- Stone on greased logs: μ ≈ 0.05-0.1

The Naga stone-pullers discovered through centuries of practice that reducing friction is more effective than adding more people. A clever surface preparation can cut the required force by 80%.

📚 *Python **lists** can be paired with **for loops** to process multiple items. The **zip()** function pairs elements from two lists together.*`,
      analogy: 'Friction is like trying to slide a heavy box across carpet vs a polished floor. The carpet grabs the box (high μ), while the polished floor lets it glide (low μ). The Naga stone-pullers essentially "polish the floor" — using water, grease, or wooden rollers to turn rough dirt into a smooth sliding surface.',
      storyConnection: 'The genius of Naga stone-pulling is not brute strength — it is engineering. By placing log rollers under the stone and greasing the path, they reduce the friction coefficient from 0.6 to 0.1, cutting the required force by 83%. This is ancient mechanical engineering.',
      checkQuestion: 'Why is it harder to START a stone sliding than to KEEP it sliding?',
      checkAnswer: 'Static friction (before motion begins) is higher than kinetic friction (during motion). The static coefficient μ_s is typically 20-50% higher than the kinetic coefficient μ_k. At the microscopic level, two surfaces at rest form stronger interlocking bonds than surfaces already in motion. This is why stone-pullers use rhythmic chanting — a sudden coordinated pull overcomes static friction, then the lower kinetic friction keeps the stone moving.',
      codeIntro: 'Compare the force needed to pull a stone under different surface conditions.',
      code: `# Friction analysis for stone-pulling

mass = 5000  # kg
g = 9.81
weight = mass * g  # Normal force on flat ground

# Surface conditions and their friction coefficients
surfaces = [
    ("Dry rough dirt", 0.65),
    ("Dry packed earth", 0.50),
    ("Wet packed earth", 0.35),
    ("Banana leaves on dirt", 0.25),
    ("Wooden planks", 0.20),
    ("Log rollers", 0.12),
    ("Greased log rollers", 0.06),
]

pull_per_person = 500  # Newtons

print(f"Stone mass: {mass:,} kg | Weight: {weight:,.0f} N")
print("=" * 65)
print(f"{'Surface':>25} | {'μ':>5} | {'Force (N)':>10} | {'People':>7} | {'Savings':>7}")
print("-" * 65)

baseline_people = None
for name, mu in surfaces:
    friction_force = mu * weight
    people = int(friction_force / pull_per_person) + 1
    if baseline_people is None:
        baseline_people = people
        savings = "baseline"
    else:
        saved = baseline_people - people
        savings = f"-{saved} ({saved/baseline_people*100:.0f}%)"
    bar = "█" * (people // 2)
    print(f"  {name:>23} | {mu:>5.2f} | {friction_force:>10,.0f} | {people:>6} | {savings:>7}")

print()
dry_force = 0.65 * weight
greased_force = 0.06 * weight
reduction = (1 - greased_force/dry_force) * 100
print(f"Engineering insight:")
print(f"  Greased rollers reduce force from {dry_force:,.0f} N to {greased_force:,.0f} N")
print(f"  That's a {reduction:.0f}% reduction — ancient engineering at its finest!")`,
      challenge: 'Calculate the force needed if the stone is pulled UPHILL on a 10-degree slope. Hint: the force of gravity along the slope adds to friction: F_total = μ × m × g × cos(θ) + m × g × sin(θ).',
      successHint: 'You have learned that friction is the primary obstacle in stone-pulling, and that reducing friction through surface engineering is far more efficient than adding more people.',
    },
    {
      title: 'The inclined plane — trading distance for force',
      concept: `An **inclined plane** (ramp) is one of the six classical simple machines. It reduces the force needed to raise an object by spreading the work over a longer distance.

**Mechanical advantage** of a ramp:
**MA = L / h**

Where:
- L = length of the ramp (distance traveled)
- h = height gained

If you push a stone up a 10 m ramp to reach a 2 m height:
MA = 10 / 2 = 5

You need only 1/5 the force — but you push 5× the distance. The total **work** (force × distance) remains the same (ignoring friction).

**W = F × d = m × g × h** (regardless of path)

This is the principle of **conservation of energy** — you cannot get something for nothing.

📚 *Python's **math** module provides trigonometric functions. math.sin(), math.cos(), and math.atan() work with angles in **radians**. Convert degrees to radians: radians = degrees × π / 180.*`,
      analogy: 'A ramp is like a gentle hiking trail vs a vertical cliff. Both get you to the same height, but the trail is longer and easier. You trade distance for effort. A wheelchair ramp, a mountain road with switchbacks, and the Naga stone-pulling path all use the same principle: make it longer to make it easier.',
      storyConnection: 'Naga villages often sit on hillsides. The stone-pulling paths are carefully chosen to follow gentle slopes rather than steep ascents. A winding path up a hill with 5:1 mechanical advantage means the community needs only 1/5 the force compared to lifting the stone straight up.',
      checkQuestion: 'If you make a ramp infinitely long and nearly flat, the mechanical advantage approaches infinity. Does this mean you need zero force?',
      checkAnswer: 'No, because friction increases with ramp length. Even a very gentle ramp has friction, and a longer ramp means more distance over which friction acts. There is an OPTIMAL ramp angle that minimizes total force (the sum of gravity component along the slope PLUS friction). Below this angle, friction dominates; above it, the gravity component dominates. This optimal angle depends on the friction coefficient.',
      codeIntro: 'Calculate the mechanical advantage and force for different ramp angles.',
      code: `import math

mass = 5000  # kg
g = 9.81
weight = mass * g
height = 3.0  # meters to raise the stone
mu = 0.15     # friction on prepared ramp surface

print(f"Stone: {mass:,} kg | Height to raise: {height} m")
print(f"Friction coefficient: {mu}")
print("=" * 65)
print(f"{'Angle (°)':>10} | {'Ramp (m)':>8} | {'MA':>5} | {'Pull Force':>11} | {'People':>7}")
print("-" * 65)

angles = [5, 10, 15, 20, 25, 30, 45, 60, 90]

for angle in angles:
    theta = math.radians(angle)
    ramp_length = height / math.sin(theta) if math.sin(theta) > 0.01 else float('inf')
    MA = ramp_length / height if ramp_length < 1000 else float('inf')

    # Force along the ramp = gravity component + friction
    # F = mg*sin(θ) + μ*mg*cos(θ)
    F_gravity = mass * g * math.sin(theta)
    F_friction = mu * mass * g * math.cos(theta)
    F_total = F_gravity + F_friction

    people = int(F_total / 500) + 1

    if ramp_length < 100:
        print(f"  {angle:>7}° | {ramp_length:>7.1f} | {MA:>5.1f} | {F_total:>9,.0f} N | {people:>6}")
    else:
        print(f"  {angle:>7}° | {ramp_length:>7.0f} | {MA:>5.1f} | {F_total:>9,.0f} N | {people:>6}")

# Find optimal angle
print()
best_angle = 0
min_force = float('inf')
for a in range(1, 90):
    theta = math.radians(a)
    F = mass * g * (math.sin(theta) + mu * math.cos(theta))
    if F < min_force:
        min_force = F
        best_angle = a

print(f"Optimal ramp angle: {best_angle}° (minimizes pulling force)")
print(f"Optimal force: {min_force:,.0f} N ({int(min_force/500)+1} people)")
print(f"vs vertical lift: {weight:,.0f} N ({int(weight/500)+1} people)")
print(f"Force reduction: {(1-min_force/weight)*100:.0f}%")`,
      challenge: 'What if the friction coefficient is 0.05 (greased rollers on the ramp)? How does the optimal angle change? Plot force vs angle for μ = 0.05, 0.15, and 0.30 to see the pattern.',
      successHint: 'You have discovered the key insight of the inclined plane: there is an optimal angle that depends on friction. The Naga stone-pullers, through generations of experience, found this optimum empirically.',
    },
    {
      title: 'Work and energy — the conservation law',
      concept: `**Work** is force applied over a distance:

**W = F × d × cos(θ)**

Where θ is the angle between force and motion direction.

The **work-energy theorem** states that the total work done on an object equals its change in kinetic energy:

**W_net = ΔKE = ½mv² - ½mv₀²**

For stone-pulling, we care about work done against gravity and friction:
- **Work against gravity**: W_g = mgh (raising stone height h)
- **Work against friction**: W_f = μmg×cos(θ) × d (along entire path)
- **Total work**: W_total = W_g + W_f

No matter what path you take, the work against gravity is the same (conservative force). But work against friction depends on path length (non-conservative). This is why shorter paths waste less energy to friction.

📚 *The **round()** function in Python rounds numbers to a specified number of decimal places: round(3.14159, 2) gives 3.14.*`,
      analogy: 'Work is like the total "effort-bill" you must pay to move the stone. Gravity charges a fixed fee based on height gained — like a toll. Friction charges per meter traveled — like fuel cost. A ramp reduces the toll per meter but increases total meters, so friction adds up. The cheapest route balances the two costs.',
      storyConnection: 'The Naga stone-pulling ceremony is a community work event in the truest physics sense. Every joule of energy comes from human muscles pulling ropes. Understanding work reveals the total human energy cost of moving a 5,000 kg stone — and why the ceremonial feast afterward is so well-deserved.',
      checkQuestion: 'If the total work is the same regardless of the ramp (for the gravity part), what advantage does the ramp actually provide?',
      checkAnswer: 'The ramp reduces the instantaneous FORCE required, even though total WORK is the same or slightly more (due to extra friction). Human muscles have a maximum force output. Without a ramp, you need hundreds of people pulling at their maximum. With a ramp, fewer people can do the same work by pulling over a longer time and distance. The ramp matches the task to human capabilities.',
      codeIntro: 'Calculate the total energy cost of pulling a stone via different methods.',
      code: `import math

mass = 5000  # kg
g = 9.81
height = 3.0  # meters

print("Work-Energy Analysis: Moving a 5,000 kg Stone Up 3 Meters")
print("=" * 60)

# Method 1: Straight vertical lift
W_gravity = mass * g * height
print(f"\
Work against gravity (any path): {W_gravity:,.0f} J = {W_gravity/1000:.1f} kJ")

# Different methods with friction
methods = [
    ("Vertical lift (impossible)", 90, 0, 0),
    ("Steep ramp (30°, bare stone)", 30, 0.50, 0.50),
    ("Medium ramp (15°, planks)", 15, 0.20, 0.20),
    ("Gentle ramp (8°, rollers)", 8, 0.12, 0.12),
    ("Gentle ramp (8°, greased)", 8, 0.06, 0.06),
]

print(f"\
{'Method':>35} | {'Distance':>8} | {'W_grav':>8} | {'W_fric':>8} | {'W_total':>8} | {'Efficiency':>10}")
print("-" * 95)

for name, angle, mu_static, mu_kinetic in methods:
    theta = math.radians(angle)
    if angle == 90:
        distance = height
        W_friction = 0
    else:
        distance = height / math.sin(theta)
        W_friction = mu_kinetic * mass * g * math.cos(theta) * distance

    W_total = W_gravity + W_friction
    efficiency = W_gravity / W_total * 100

    print(f"  {name:>33} | {distance:>6.1f} m | {W_gravity/1000:>6.1f} kJ | {W_friction/1000:>6.1f} kJ | {W_total/1000:>6.1f} kJ | {efficiency:>8.1f}%")

# Human energy perspective
print()
print("Human Energy Context:")
calories_per_joule = 1 / 4184  # 1 calorie = 4184 J
muscle_efficiency = 0.25  # human muscles are ~25% efficient
best_W = W_gravity + 0.06 * mass * g * math.cos(math.radians(8)) * height / math.sin(math.radians(8))
food_energy = best_W / muscle_efficiency
calories = food_energy * calories_per_joule
rice_portions = calories / 250  # ~250 cal per bowl of rice

print(f"  Best method total work: {best_W/1000:.1f} kJ")
print(f"  Human food energy needed (25% efficiency): {food_energy/1000:.1f} kJ")
print(f"  That's {calories:.0f} food calories")
print(f"  Equivalent to {rice_portions:.1f} bowls of rice")
print(f"  Now you know why the feast follows the stone-pulling!")`,
      challenge: 'Calculate how long it takes 50 people to pull the stone up the gentle ramp if each person can sustain 300 W (watts = joules/second) of power output. How does this compare to using 100 people?',
      successHint: 'You now understand that simple machines do not reduce work — they reduce force. The total energy cost depends on the path, and friction determines which path is most efficient.',
    },
    {
      title: 'Levers and mechanical advantage — multiplying human force',
      concept: `A **lever** is a rigid bar that pivots around a **fulcrum**. The Naga stone-pullers use lever principles in several ways:
- Pry bars to lift stone edges onto rollers
- Long ropes that act as flexible levers around guide posts

The **lever law** (Archimedes):
**F₁ × d₁ = F₂ × d₂**

Where F₁ and d₁ are the effort force and distance, F₂ and d₂ are the load force and distance.

**Mechanical advantage** = d₁ / d₂ = F₂ / F₁

Three classes of levers:
- **Class 1**: fulcrum between effort and load (seesaw, crowbar)
- **Class 2**: load between fulcrum and effort (wheelbarrow, nutcracker)
- **Class 3**: effort between fulcrum and load (tweezers, fishing rod)

📚 *Python can make **decisions** with if/elif/else statements. These let the program choose different paths based on conditions.*`,
      analogy: 'A lever is like a playground seesaw. A small child sitting far from the pivot can balance a heavy adult sitting close to the pivot. Distance compensates for weight. The Naga stone-pullers use this exact principle: a long pry bar lets one person exert the force of ten at the stone\'s edge.',
      storyConnection: 'Before the main pull begins, the stone must be lifted onto rollers. This requires pry bars — Class 1 levers. A team of 4 people with 2-meter pry bars can lift an edge that would otherwise require 20 people lifting directly. It is Archimedes\' insight applied to Naga engineering.',
      checkQuestion: 'If you double the length of a pry bar, does it become twice as effective?',
      checkAnswer: 'Yes, the mechanical advantage doubles (MA = effort arm / load arm). BUT there are practical limits: (1) longer bars flex more, wasting energy in bending, (2) they are harder to position in tight spaces, (3) the operator must push through a larger arc to achieve the same lift. Real levers balance mechanical advantage against practicality.',
      codeIntro: 'Calculate the mechanical advantage of different lever configurations used in stone-pulling.',
      code: `# Lever analysis for Naga stone-pulling

stone_edge_weight = 5000 * 9.81 / 4  # weight on one edge (quarter of stone)

print("Lever Analysis — Lifting Stone Edge onto Rollers")
print(f"Load to lift: {stone_edge_weight:,.0f} N (one quarter of stone)")
print("=" * 60)

# Class 1 lever: pry bar under stone edge
print("\
CLASS 1 LEVER — Pry bar under stone edge")
print(f"{'Bar length':>12} | {'Effort arm':>10} | {'Load arm':>9} | {'MA':>5} | {'Force needed':>13} | {'People':>6}")
print("-" * 60)

# The fulcrum is placed close to the stone
load_arm = 0.15  # 15 cm from fulcrum to stone edge

for bar_length in [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]:
    effort_arm = bar_length - load_arm
    MA = effort_arm / load_arm
    force_needed = stone_edge_weight / MA
    people = int(force_needed / 500) + 1

    print(f"  {bar_length:>7.1f} m  | {effort_arm:>8.2f} m | {load_arm:>7.2f} m | {MA:>5.1f} | {force_needed:>11,.0f} N | {people:>5}")

# Rope leverage around a post
print()
print("ROPE LEVERAGE — Wrapping rope around guide post")
print("Each wrap multiplies the holding force by e^(μπ)")
print()

import math
mu_rope = 0.4  # friction between rope and wooden post

for wraps in range(0, 5):
    angle = wraps * 2 * math.pi  # total angle in radians
    rope_MA = math.exp(mu_rope * angle) if wraps > 0 else 1
    force_needed = 5000 * 9.81 * 0.3 / rope_MA  # pulling force with friction
    people = max(1, int(force_needed / 500) + 1)

    if wraps == 0:
        print(f"  {wraps} wraps: MA = {rope_MA:>6.1f} → {force_needed:>8,.0f} N ({people} people) — no leverage")
    else:
        print(f"  {wraps} wrap{'s' if wraps > 1 else ' '}: MA = {rope_MA:>6.1f} → {force_needed:>8,.0f} N ({people} people)")

print()
print("The capstan effect (rope around post) is why ships can be")
print("moored by a single person wrapping rope around a bollard!")`,
      challenge: 'A lever team uses a 2.5 m pry bar but the stone only needs to be lifted 5 cm to slide a roller underneath. How far down must the team push their end of the bar? Calculate using similar triangles.',
      successHint: 'You have learned that levers multiply force using the same conservation principle as ramps: you trade distance for force. The Naga stone-pulling combines multiple simple machines — rollers, ramps, AND levers — for maximum effectiveness.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Forces & Simple Machines</span>
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
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
