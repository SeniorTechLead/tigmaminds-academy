import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NeermahalLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Modelling pile settlement with differential equations',
      concept: `When a load is applied to a pile, it does not settle instantly. The **time-dependent settlement** of a pile in clay follows a consolidation model:

\`ds/dt = k × (s_final - s(t))\`

where s(t) is settlement at time t, s_final is the ultimate settlement, and k is a rate constant related to soil permeability.

This is a first-order ODE with solution: \`s(t) = s_final × (1 - e^{-kt})\`

The settlement approaches s_final asymptotically — fast initially, then slowing. This is why:
- New buildings on soft soil settle noticeably in the first year
- Settlement continues for decades at a decreasing rate
- Engineers must predict both the total settlement AND the rate

📚 *We will use \`scipy.integrate.odeint\` to solve this ODE numerically and compare with the analytical solution.*`,
      analogy: 'Push your thumb into a sponge and hold it. It compresses quickly at first, then slower, and eventually stops. That is exactly what soil does under a pile — fast initial settlement, then gradual creep toward a final state.',
      storyConnection: 'Neermahal was built in the 1930s. The soft lakebed beneath it has been consolidating for nearly a century. Understanding the settlement curve tells us whether the palace has reached equilibrium or is still slowly sinking.',
      checkQuestion: 'If s_final = 50 mm and k = 0.5 per year, what is the settlement after 1 year? After 5 years?',
      checkAnswer: 'After 1 year: 50 × (1 - e^{-0.5}) = 50 × 0.393 = 19.7 mm. After 5 years: 50 × (1 - e^{-2.5}) = 50 × 0.918 = 45.9 mm. Most settlement happens in the first few years.',
      codeIntro: 'Solve the pile settlement ODE numerically and compare with the analytical solution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Settlement ODE: ds/dt = k * (s_final - s)
s_final = 50.0  # mm - ultimate settlement
k = 0.5         # per year - consolidation rate

# Analytical solution
t = np.linspace(0, 15, 300)
s_analytical = s_final * (1 - np.exp(-k * t))

# Numerical solution using Euler method
dt = 0.05
t_num = np.arange(0, 15, dt)
s_num = np.zeros_like(t_num)
for i in range(1, len(t_num)):
    dsdt = k * (s_final - s_num[i-1])
    s_num[i] = s_num[i-1] + dsdt * dt

fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

ax.plot(t, s_analytical, color='#34d399', linewidth=2.5, label='Analytical')
ax.plot(t_num[::10], s_num[::10], 'o', color='#f59e0b', markersize=4, label='Euler method')
ax.axhline(y=s_final, color='#9ca3af', linestyle='--', alpha=0.5, label=f'Final = {s_final} mm')

# Mark key times
for yr in [1, 5, 10]:
    s_val = s_final * (1 - np.exp(-k * yr))
    ax.plot(yr, s_val, 's', color='#f87171', markersize=8, zorder=5)
    ax.annotate(f'{s_val:.1f} mm', xy=(yr, s_val), xytext=(yr + 0.5, s_val - 4),
                color='white', fontsize=9)

ax.set_xlabel('Time (years)', color='white', fontsize=12)
ax.set_ylabel('Settlement (mm)', color='white', fontsize=12)
ax.set_title('Pile Settlement Over Time — Neermahal Foundation', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white')
ax.invert_yaxis()

plt.tight_layout()
plt.savefig('settlement.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Settlement at 1 year: {s_final*(1-np.exp(-k*1)):.1f} mm")
print(f"Settlement at 5 years: {s_final*(1-np.exp(-k*5)):.1f} mm")
print(f"Settlement at 90 years (present): {s_final*(1-np.exp(-k*90)):.1f} mm")
print("After 90 years, settlement is essentially complete.")`,
      challenge: 'Model differential settlement — one side settles with k=0.5, the other with k=0.3. Plot both and calculate the tilt angle of the palace over time.',
      successHint: 'Solving ODEs lets you predict how structures behave over time, not just at a single moment. This is the bridge between statics and dynamics.',
    },
    {
      title: 'Structural classes — modelling a palace column',
      concept: `A **Column** can be modelled as a Python class with properties like material, dimensions, and loading. Object-oriented programming lets us represent structural elements as interacting objects.

Key column properties:
- **Cross-section area** A = π(d/2)² for circular columns
- **Second moment of area** I = π d⁴/64 (resistance to bending)
- **Euler buckling load** P_cr = π² E I / L² (maximum load before the column buckles)
- **Compressive stress** σ = P/A (must not exceed material strength)

A column fails when EITHER:
1. Compressive stress exceeds material strength (crushing), OR
2. Load exceeds Euler buckling load (sideway collapse)

📚 *We will define a \`Column\` class with methods to calculate stress, buckling load, and safety factors.*`,
      analogy: 'Hold a pencil vertically and push down on the top. With a small push, it stays straight. Push harder, and it suddenly bows sideways and snaps — that is buckling. Short, thick columns crush. Tall, thin columns buckle.',
      storyConnection: 'Neermahal has ornate columns holding up its arched corridors. Each column must support the roof weight plus any lateral forces from wind and water. The columns are proportioned to avoid both crushing and buckling.',
      checkQuestion: 'A circular column has diameter 40 cm, length 4 m, and is made of brick (E = 15 GPa, strength = 10 MPa). What fails first — crushing or buckling?',
      checkAnswer: 'A = π(0.2)² = 0.1257 m². I = π(0.4)⁴/64 = 1.257×10⁻³ m⁴. Crushing load = 10×10⁶ × 0.1257 = 1,257 kN. Buckling load = π² × 15×10⁹ × 1.257×10⁻³ / 4² = 11,635 kN. Crushing occurs first at 1,257 kN.',
      codeIntro: 'Build a Column class to analyse the structural capacity of Neermahal columns.',
      code: `import numpy as np
import math

class Column:
    def __init__(self, name, diameter, length, E, strength):
        self.name = name
        self.d = diameter       # metres
        self.L = length         # metres
        self.E = E              # Pa (Young's modulus)
        self.strength = strength  # Pa (compressive strength)

    @property
    def area(self):
        return math.pi * (self.d / 2) ** 2

    @property
    def I(self):  # second moment of area
        return math.pi * self.d ** 4 / 64

    @property
    def crush_load(self):
        return self.strength * self.area

    @property
    def buckle_load(self):
        return math.pi ** 2 * self.E * self.I / self.L ** 2

    def analyse(self, applied_load):
        sf_crush = self.crush_load / applied_load
        sf_buckle = self.buckle_load / applied_load
        mode = "Crushing" if sf_crush < sf_buckle else "Buckling"
        return sf_crush, sf_buckle, mode

# Neermahal columns
cols = [
    Column("Brick pillar",   0.40, 4.0, 15e9, 10e6),
    Column("Stone column",   0.35, 3.5, 30e9, 50e6),
    Column("Concrete pier",  0.50, 5.0, 25e9, 25e6),
]

applied = 500e3  # 500 kN applied load

print(f"Applied load: {applied/1000:.0f} kN")
print("=" * 70)
print(f"{'Column':<16} {'Crush(kN)':>10} {'Buckle(kN)':>11} {'SF crush':>9} {'SF buckle':>10} {'Fails by':<10}")
print("-" * 70)

for c in cols:
    sf_c, sf_b, mode = c.analyse(applied)
    print(f"{c.name:<16} {c.crush_load/1000:>10.0f} {c.buckle_load/1000:>11.0f} {sf_c:>9.2f} {sf_b:>10.2f} {mode:<10}")

print()
print("All columns survive 500 kN with adequate safety factors.")
print("The brick pillar has the lowest margin — it would fail first.")`,
      challenge: 'Add a method to find the maximum safe load (considering both failure modes and a safety factor of 2.5). Which column can carry the most?',
      successHint: 'Classes let you model complex engineering objects with properties and behaviours. Each column "knows" its geometry, material, and how to check its own safety.',
    },
    {
      title: 'Coupled water-structure interaction',
      concept: `In reality, the water level and structural forces form a **coupled system**. Rising water increases:
1. **Hydrostatic force** on walls (pushing outward)
2. **Buoyancy** on the foundation (pushing upward)
3. **Seepage pressure** through the soil (reducing soil strength)

These interact: more buoyancy means less effective weight, which means less friction on piles, which means the piles must work harder per unit length.

The effective pile capacity with buoyancy is:
\`F_pile_eff = F_pile - buoyancy_on_pile\`

This coupled analysis requires solving multiple equations simultaneously — a system of equations that represents the structural equilibrium.

📚 *We will set up and solve a system of linear equations using \`numpy.linalg.solve()\` to find equilibrium forces.*`,
      analogy: 'Imagine a boat tied to a dock with three ropes. If the tide rises, the tension in each rope changes — but they all affect each other because the boat must stay in place. The palace walls, foundation, and piles are like those ropes — coupled.',
      storyConnection: 'During monsoon, everything changes at once for Neermahal. The water rises, pushes harder on walls, lifts the foundation, weakens the soil, and demands more from the piles. Engineers must model all these effects together, not in isolation.',
      checkQuestion: 'If buoyancy increases by 5,000 kN during monsoon, do the piles need to carry more or less load?',
      checkAnswer: 'Less. Buoyancy acts upward, partially supporting the palace weight. If buoyancy increases by 5,000 kN, the piles carry 5,000 kN less. Monsoon actually helps the vertical stability — but hurts the lateral stability (wall forces increase).',
      codeIntro: 'Solve a coupled force equilibrium for Neermahal under dry and monsoon conditions.',
      code: `import numpy as np

def analyse_equilibrium(water_depth, label):
    rho, g = 1000, 9.81
    palace_weight = 50000e3  # N (50,000 kN)
    wall_width = 50          # m total perimeter
    n_piles = 200
    pile_length = 8          # m
    pile_diam = 0.3          # m

    # Forces
    buoyancy = rho * g * water_depth * 50 * 30  # submerged volume approx
    lateral_force = 0.5 * rho * g * water_depth**2 * wall_width
    pile_friction_per_m = 25000 * np.pi * pile_diam  # soil shear * circumference

    # Vertical equilibrium: Weight = Buoyancy + Pile_vertical
    pile_vertical = palace_weight - buoyancy
    pile_per_pile = pile_vertical / n_piles
    required_length = pile_per_pile / pile_friction_per_m

    # Lateral: must be resisted by soil passive pressure on piles
    passive_per_pile = 0.5 * rho * g * pile_length**2 * pile_diam * 3  # Kp~3
    total_lateral_capacity = passive_per_pile * n_piles

    print(f"--- {label} (depth = {water_depth}m) ---")
    print(f"  Palace weight:      {palace_weight/1e6:8.1f} MN")
    print(f"  Buoyancy:           {buoyancy/1e6:8.1f} MN (up)")
    print(f"  Net vertical load:  {pile_vertical/1e6:8.1f} MN")
    print(f"  Load per pile:      {pile_per_pile/1e3:8.1f} kN")
    print(f"  Min pile length:    {required_length:8.1f} m")
    print(f"  Lateral force:      {lateral_force/1e6:8.1f} MN")
    print(f"  Lateral capacity:   {total_lateral_capacity/1e6:8.1f} MN")
    sf = total_lateral_capacity / lateral_force if lateral_force > 0 else float('inf')
    print(f"  Lateral SF:         {sf:8.2f}")
    print()
    return water_depth, pile_vertical/1e6, lateral_force/1e6, sf

results = []
for depth, label in [(1.5, "Dry season"), (3.0, "Normal"), (4.5, "Heavy monsoon"), (6.0, "Extreme flood")]:
    results.append(analyse_equilibrium(depth, label))

print("SUMMARY: As water rises, vertical load DECREASES but lateral force INCREASES.")
print("The critical condition is lateral stability during extreme floods.")`,
      challenge: 'Add seepage analysis: during monsoon, soil shear strength drops from 25 kPa to 18 kPa. Recalculate pile capacities with weakened soil.',
      successHint: 'Real structural analysis considers coupled effects. What helps vertically (buoyancy) can hurt laterally (water pressure). Engineering is about balance.',
    },
    {
      title: 'Wave loading — dynamic forces on the palace',
      concept: `Beyond static hydrostatic pressure, Neermahal faces **dynamic wave forces** during storms. Waves generate:

1. **Impact force**: proportional to wave height squared and wave speed
2. **Cyclic loading**: repeated push-pull that can fatigue materials
3. **Resonance risk**: if wave frequency matches structural frequency

The Morison equation for wave force on a cylindrical pile:
\`F = C_d × ½ρ × D × u|u| + C_m × ρ × (πD²/4) × du/dt\`

The first term is **drag** (proportional to velocity²), the second is **inertia** (proportional to acceleration).

For simplicity, we model wave velocity as sinusoidal: \`u(t) = u_max × sin(2πft)\`

📚 *We will use numerical differentiation and trigonometric functions to compute time-varying wave forces.*`,
      analogy: 'Stand in the sea as waves come in. Each wave pushes you (drag force) and pulls you back (inertia force). The total force oscillates — sometimes both add up, sometimes they partially cancel. This complex pattern acts on every column of Neermahal.',
      storyConnection: 'Rudrasagar Lake is large enough to generate significant waves during storms. These waves slam into the palace walls and columns repeatedly. Over 90 years, billions of wave impacts have tested the structure. It survives because the original design accounted for dynamic loading.',
      checkQuestion: 'If wave velocity doubles, how does the drag force change?',
      checkAnswer: 'Drag force is proportional to u|u| (velocity squared, preserving sign). Doubling velocity quadruples the drag force. This is why storm waves are so much more destructive than gentle swells.',
      codeIntro: 'Simulate wave forces on a Neermahal pile using the Morison equation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wave parameters
T_wave = 3.0    # wave period (seconds)
f = 1 / T_wave  # frequency
u_max = 1.5     # max velocity (m/s)
D = 0.4         # pile diameter (m)
rho = 1000
Cd, Cm = 1.2, 2.0  # drag and inertia coefficients

t = np.linspace(0, 3 * T_wave, 500)
u = u_max * np.sin(2 * np.pi * f * t)
dudt = u_max * 2 * np.pi * f * np.cos(2 * np.pi * f * t)

# Morison equation (per unit length)
F_drag = Cd * 0.5 * rho * D * u * np.abs(u)
F_inertia = Cm * rho * (np.pi * D**2 / 4) * dudt
F_total = F_drag + F_inertia

fig, axes = plt.subplots(3, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

labels = ['Drag Force (N/m)', 'Inertia Force (N/m)', 'Total Force (N/m)']
data = [F_drag, F_inertia, F_total]
colors = ['#3b82f6', '#f59e0b', '#ef4444']

for ax, y, label, color in zip(axes, data, labels, colors):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')
    ax.plot(t, y, color=color, linewidth=2)
    ax.fill_between(t, 0, y, alpha=0.15, color=color)
    ax.set_ylabel(label, color='white', fontsize=10)
    ax.axhline(y=0, color='#9ca3af', linewidth=0.5)
    ax.annotate(f'Peak: {np.max(np.abs(y)):.0f} N/m', xy=(0.02, 0.85),
                xycoords='axes fraction', color=color, fontsize=10, fontweight='bold')

axes[0].set_title('Wave Forces on a Neermahal Pile (Morison Equation)', color='white', fontsize=13)
axes[2].set_xlabel('Time (s)', color='white', fontsize=11)

plt.tight_layout()
plt.savefig('wave_forces.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Peak drag: {np.max(np.abs(F_drag)):.0f} N/m")
print(f"Peak inertia: {np.max(np.abs(F_inertia)):.0f} N/m")
print(f"Peak total: {np.max(np.abs(F_total)):.0f} N/m")
print(f"Note: drag and inertia peaks don't align — total < sum of peaks")`,
      challenge: 'During a storm, u_max doubles to 3.0 m/s. Rerun and compare peak forces. By what factor does the maximum total force increase?',
      successHint: 'Dynamic analysis reveals that structures face time-varying forces where the peak matters more than the average. This is why storm resistance is a separate engineering discipline.',
    },
    {
      title: 'Fatigue analysis — will the palace survive another century?',
      concept: `Repeated loading causes **fatigue** — gradual damage accumulation even when each individual load is well below the breaking strength.

The **S-N curve** (stress vs number of cycles) describes how many cycles a material can endure at a given stress level:

\`N = C / S^m\`

where S is stress amplitude, N is cycles to failure, and C, m are material constants.

**Miner's rule** for cumulative damage:
\`D = Σ (n_i / N_i)\`

Failure occurs when D ≥ 1. Each loading block (n_i cycles at stress S_i) uses up a fraction of the material's life.

Over 90 years, monsoon waves apply millions of cycles. Does the accumulated damage threaten Neermahal?

📚 *We will implement a fatigue analysis using classes, numpy arrays, and cumulative damage computation.*`,
      analogy: 'Bend a paper clip back and forth. Each bend does not break it, but after 10-20 bends, it snaps. The metal did not get weaker all at once — damage accumulated with each cycle. Neermahal faces the same process over decades of wave action.',
      storyConnection: 'Neermahal is nearly a century old and visibly deteriorating in places. Fatigue from millions of wave cycles, combined with chemical attack from lake water, explains why ongoing restoration is critical. This analysis predicts how much life remains.',
      checkQuestion: 'If a material can survive 10 million cycles at 50 MPa stress and the palace experiences 100,000 wave cycles per year, how many years until fatigue failure?',
      checkAnswer: '10,000,000 / 100,000 = 100 years. The palace was built about 90 years ago, so at this stress level, it would be approaching its fatigue life. This is why inspection and repair are urgent.',
      codeIntro: 'Perform a fatigue life analysis for Neermahal structural elements under cyclic wave loading.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# S-N curve parameters for reinforced concrete
C = 1e20   # material constant
m = 8      # fatigue exponent

# Stress levels from different wave conditions (MPa)
conditions = {
    "Calm days":     {"stress": 2.0, "cycles_per_year": 500000},
    "Normal waves":  {"stress": 5.0, "cycles_per_year": 200000},
    "Monsoon waves": {"stress": 12.0, "cycles_per_year": 50000},
    "Storm events":  {"stress": 25.0, "cycles_per_year": 1000},
}

print("Fatigue Analysis — Neermahal Structural Elements")
print("=" * 65)
print(f"{'Condition':<16} {'Stress':>7} {'Cycles/yr':>11} {'N_failure':>12} {'Damage/yr':>10}")
print("-" * 65)

total_damage_per_year = 0
for name, data in conditions.items():
    S = data["stress"]
    n = data["cycles_per_year"]
    N = C / S**m
    damage = n / N
    total_damage_per_year += damage
    print(f"{name:<16} {S:>6.1f} MPa {n:>10,} {N:>12.0f} {damage:>10.6f}")

print("-" * 65)
print(f"{'Total':<16} {'':>7} {'':>11} {'':>12} {total_damage_per_year:>10.6f}")
print()

years_to_failure = 1 / total_damage_per_year
print(f"Cumulative damage per year: {total_damage_per_year:.6f}")
print(f"Predicted fatigue life: {years_to_failure:.0f} years")
print(f"Palace age: ~90 years")
print(f"Remaining life: ~{years_to_failure - 90:.0f} years")

# Plot damage accumulation
years = np.arange(0, int(years_to_failure * 1.2))
cum_damage = total_damage_per_year * years

fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

ax.plot(years, cum_damage, color='#f87171', linewidth=2.5)
ax.axhline(y=1.0, color='#ef4444', linestyle='--', linewidth=2, label='Failure (D=1)')
ax.axvline(x=90, color='#f59e0b', linestyle=':', linewidth=2, label='Current age (90 yr)')
ax.fill_between(years, 0, cum_damage, where=cum_damage < 1, alpha=0.1, color='#34d399')
ax.fill_between(years, 0, cum_damage, where=cum_damage >= 1, alpha=0.1, color='#ef4444')

ax.set_xlabel('Years', color='white', fontsize=12)
ax.set_ylabel("Cumulative Damage (Miner\'s Rule)", color='white', fontsize=12)
ax.set_title('Fatigue Life Prediction — Neermahal', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('fatigue.png', dpi=100, facecolor='#1f2937')
plt.show()`,
      challenge: 'Climate change increases storm intensity: storm stress rises from 25 to 35 MPa. How does this affect the predicted remaining life? (Hint: the S^8 term makes this dramatic.)',
      successHint: 'Fatigue analysis bridges physics and time. It explains why old structures that "should" be fine can suddenly fail, and why regular maintenance extends life far beyond the original design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Structural Modelling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
